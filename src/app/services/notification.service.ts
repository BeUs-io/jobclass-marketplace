import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, timer, interval } from 'rxjs';
import { map, delay, switchMap } from 'rxjs/operators';
import { Job } from '../models/job.model';

export interface EmailNotification {
  id: string;
  recipientEmail: string;
  type: 'job_alert' | 'application_status' | 'interview_scheduled' | 'message' | 'deadline_reminder' | 'newsletter';
  subject: string;
  body: string;
  sentAt?: Date;
  scheduledFor?: Date;
  status: 'pending' | 'sent' | 'failed' | 'scheduled';
  jobId?: string;
  applicationId?: string;
  metadata?: any;
}

export interface NotificationPreferences {
  userId: string;
  email: string;
  jobAlerts: boolean;
  applicationUpdates: boolean;
  interviewReminders: boolean;
  marketingEmails: boolean;
  frequency: 'instantly' | 'daily' | 'weekly';
  categories?: string[];
  locations?: string[];
  salaryRange?: { min: number; max: number };
}

export interface JobAlert {
  id: string;
  userId: string;
  name: string;
  criteria: {
    keywords?: string[];
    categories?: string[];
    locations?: string[];
    minSalary?: number;
    jobTypes?: string[];
  };
  frequency: 'instantly' | 'daily' | 'weekly';
  isActive: boolean;
  lastSent?: Date;
  matchedJobs?: number;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private emailQueueSubject = new BehaviorSubject<EmailNotification[]>([]);
  public emailQueue$ = this.emailQueueSubject.asObservable();

  private notificationPreferencesSubject = new BehaviorSubject<NotificationPreferences | null>(null);
  public notificationPreferences$ = this.notificationPreferencesSubject.asObservable();

  private jobAlertsSubject = new BehaviorSubject<JobAlert[]>([]);
  public jobAlerts$ = this.jobAlertsSubject.asObservable();

  private emailTemplates = {
    job_alert: {
      subject: '🔔 New jobs matching your criteria',
      template: `
        <h2>New Job Opportunities</h2>
        <p>Hi {{userName}},</p>
        <p>We found {{jobCount}} new jobs that match your search criteria:</p>
        {{jobList}}
        <p>Best regards,<br>JobClass Team</p>
      `
    },
    application_status: {
      subject: '📋 Your application status has been updated',
      template: `
        <h2>Application Status Update</h2>
        <p>Hi {{applicantName}},</p>
        <p>Your application for <strong>{{jobTitle}}</strong> at <strong>{{companyName}}</strong> has been updated.</p>
        <p>New Status: <strong>{{status}}</strong></p>
        {{additionalInfo}}
        <p>Best regards,<br>JobClass Team</p>
      `
    },
    interview_scheduled: {
      subject: '📅 Interview scheduled for {{jobTitle}}',
      template: `
        <h2>Interview Scheduled</h2>
        <p>Hi {{applicantName}},</p>
        <p>Great news! You have an interview scheduled for:</p>
        <ul>
          <li>Position: {{jobTitle}}</li>
          <li>Company: {{companyName}}</li>
          <li>Date: {{interviewDate}}</li>
          <li>Time: {{interviewTime}}</li>
          <li>Location/Link: {{interviewLocation}}</li>
        </ul>
        <p>{{interviewNotes}}</p>
        <p>Good luck!</p>
        <p>Best regards,<br>JobClass Team</p>
      `
    },
    deadline_reminder: {
      subject: '⏰ Application deadline approaching',
      template: `
        <h2>Application Deadline Reminder</h2>
        <p>Hi {{userName}},</p>
        <p>The application deadline for <strong>{{jobTitle}}</strong> at <strong>{{companyName}}</strong> is approaching.</p>
        <p>Deadline: {{deadline}}</p>
        <p>Don't miss out on this opportunity!</p>
        <a href="{{jobUrl}}">Apply Now</a>
        <p>Best regards,<br>JobClass Team</p>
      `
    }
  };

  constructor() {
    this.loadPreferences();
    this.loadJobAlerts();
    this.startEmailProcessor();
    this.startJobAlertChecker();
  }

  // Send instant notification
  sendNotification(notification: Omit<EmailNotification, 'id' | 'status'>): Observable<boolean> {
    const email: EmailNotification = {
      ...notification,
      id: Date.now().toString(),
      status: 'pending'
    };

    const queue = this.emailQueueSubject.value;
    this.emailQueueSubject.next([...queue, email]);

    // Simulate sending email
    return of(true).pipe(
      delay(1000),
      map(() => {
        this.markEmailAsSent(email.id);
        return true;
      })
    );
  }

  // Schedule notification for later
  scheduleNotification(notification: Omit<EmailNotification, 'id' | 'status'>, scheduleFor: Date): Observable<EmailNotification> {
    const email: EmailNotification = {
      ...notification,
      id: Date.now().toString(),
      status: 'scheduled',
      scheduledFor: scheduleFor
    };

    const queue = this.emailQueueSubject.value;
    this.emailQueueSubject.next([...queue, email]);

    return of(email).pipe(delay(300));
  }

  // Send job alert email
  sendJobAlert(userId: string, jobs: Job[]): Observable<boolean> {
    const preferences = this.notificationPreferencesSubject.value;
    if (!preferences || !preferences.jobAlerts) {
      return of(false);
    }

    const jobList = jobs.map(job => `
      <div style="border: 1px solid #e5e7eb; padding: 12px; margin: 8px 0; border-radius: 8px;">
        <h3>${job.title}</h3>
        <p>${job.company.name} - ${job.location}</p>
        <p>${job.salary ? `$${job.salary.min.toLocaleString()} - $${job.salary.max.toLocaleString()}` : 'Salary not specified'}</p>
        <a href="/job/${job.id}">View Job</a>
      </div>
    `).join('');

    const emailBody = this.emailTemplates.job_alert.template
      .replace('{{userName}}', 'User')
      .replace('{{jobCount}}', jobs.length.toString())
      .replace('{{jobList}}', jobList);

    return this.sendNotification({
      recipientEmail: preferences.email,
      type: 'job_alert',
      subject: this.emailTemplates.job_alert.subject,
      body: emailBody,
      sentAt: new Date()
    });
  }

  // Send application status update
  sendApplicationStatusUpdate(
    applicantEmail: string,
    applicantName: string,
    jobTitle: string,
    companyName: string,
    status: string,
    additionalInfo?: string
  ): Observable<boolean> {
    const emailBody = this.emailTemplates.application_status.template
      .replace('{{applicantName}}', applicantName)
      .replace('{{jobTitle}}', jobTitle)
      .replace('{{companyName}}', companyName)
      .replace('{{status}}', status)
      .replace('{{additionalInfo}}', additionalInfo || '');

    return this.sendNotification({
      recipientEmail: applicantEmail,
      type: 'application_status',
      subject: this.emailTemplates.application_status.subject,
      body: emailBody,
      sentAt: new Date()
    });
  }

  // Send interview scheduled notification
  sendInterviewNotification(
    applicantEmail: string,
    applicantName: string,
    jobTitle: string,
    companyName: string,
    interviewDetails: {
      date: Date;
      time: string;
      location: string;
      notes?: string;
    }
  ): Observable<boolean> {
    const emailBody = this.emailTemplates.interview_scheduled.template
      .replace('{{applicantName}}', applicantName)
      .replace('{{jobTitle}}', jobTitle)
      .replace('{{companyName}}', companyName)
      .replace('{{interviewDate}}', interviewDetails.date.toLocaleDateString())
      .replace('{{interviewTime}}', interviewDetails.time)
      .replace('{{interviewLocation}}', interviewDetails.location)
      .replace('{{interviewNotes}}', interviewDetails.notes || '');

    const subject = this.emailTemplates.interview_scheduled.subject
      .replace('{{jobTitle}}', jobTitle);

    return this.sendNotification({
      recipientEmail: applicantEmail,
      type: 'interview_scheduled',
      subject: subject,
      body: emailBody,
      sentAt: new Date()
    });
  }

  // Send deadline reminder
  sendDeadlineReminder(
    userEmail: string,
    userName: string,
    jobTitle: string,
    companyName: string,
    deadline: Date,
    jobUrl: string
  ): Observable<boolean> {
    const emailBody = this.emailTemplates.deadline_reminder.template
      .replace('{{userName}}', userName)
      .replace('{{jobTitle}}', jobTitle)
      .replace('{{companyName}}', companyName)
      .replace('{{deadline}}', deadline.toLocaleDateString())
      .replace('{{jobUrl}}', jobUrl);

    return this.sendNotification({
      recipientEmail: userEmail,
      type: 'deadline_reminder',
      subject: this.emailTemplates.deadline_reminder.subject,
      body: emailBody,
      sentAt: new Date()
    });
  }

  // Create job alert
  createJobAlert(alert: Omit<JobAlert, 'id'>): Observable<JobAlert> {
    const newAlert: JobAlert = {
      ...alert,
      id: Date.now().toString()
    };

    const alerts = this.jobAlertsSubject.value;
    this.jobAlertsSubject.next([...alerts, newAlert]);
    this.persistJobAlerts();

    return of(newAlert).pipe(delay(300));
  }

  // Update job alert
  updateJobAlert(id: string, updates: Partial<JobAlert>): Observable<boolean> {
    const alerts = this.jobAlertsSubject.value;
    const index = alerts.findIndex(a => a.id === id);

    if (index !== -1) {
      alerts[index] = { ...alerts[index], ...updates };
      this.jobAlertsSubject.next([...alerts]);
      this.persistJobAlerts();
      return of(true).pipe(delay(300));
    }

    return of(false);
  }

  // Delete job alert
  deleteJobAlert(id: string): Observable<boolean> {
    const alerts = this.jobAlertsSubject.value.filter(a => a.id !== id);
    this.jobAlertsSubject.next(alerts);
    this.persistJobAlerts();
    return of(true).pipe(delay(300));
  }

  // Update notification preferences
  updatePreferences(preferences: NotificationPreferences): Observable<NotificationPreferences> {
    this.notificationPreferencesSubject.next(preferences);
    localStorage.setItem('notificationPreferences', JSON.stringify(preferences));
    return of(preferences).pipe(delay(300));
  }

  // Get email history
  getEmailHistory(userId: string): Observable<EmailNotification[]> {
    // In real app, this would fetch from backend
    const history = this.emailQueueSubject.value.filter(
      email => email.status === 'sent'
    );
    return of(history);
  }

  // Batch send emails
  batchSendEmails(emails: Omit<EmailNotification, 'id' | 'status'>[]): Observable<boolean> {
    const emailsWithIds = emails.map(email => ({
      ...email,
      id: Date.now().toString() + Math.random(),
      status: 'pending' as const
    }));

    const queue = this.emailQueueSubject.value;
    this.emailQueueSubject.next([...queue, ...emailsWithIds]);

    // Simulate batch processing
    return of(true).pipe(
      delay(2000),
      map(() => {
        emailsWithIds.forEach(email => this.markEmailAsSent(email.id));
        return true;
      })
    );
  }

  // Process email queue
  private startEmailProcessor(): void {
    // Process emails every 10 seconds
    interval(10000).subscribe(() => {
      const queue = this.emailQueueSubject.value;
      const pendingEmails = queue.filter(email => email.status === 'pending');
      const scheduledEmails = queue.filter(
        email => email.status === 'scheduled' &&
        email.scheduledFor &&
        email.scheduledFor <= new Date()
      );

      [...pendingEmails, ...scheduledEmails].forEach(email => {
        this.processEmail(email);
      });
    });
  }

  // Process individual email
  private processEmail(email: EmailNotification): void {
    console.log('Processing email:', email);
    // Simulate email sending
    setTimeout(() => {
      this.markEmailAsSent(email.id);
      console.log('Email sent:', email.id);
    }, 1000);
  }

  // Mark email as sent
  private markEmailAsSent(emailId: string): void {
    const queue = this.emailQueueSubject.value;
    const index = queue.findIndex(e => e.id === emailId);

    if (index !== -1) {
      queue[index].status = 'sent';
      queue[index].sentAt = new Date();
      this.emailQueueSubject.next([...queue]);
    }
  }

  // Check job alerts periodically
  private startJobAlertChecker(): void {
    // Check every hour
    interval(3600000).subscribe(() => {
      this.checkJobAlerts();
    });
  }

  // Check all active job alerts
  private checkJobAlerts(): void {
    const alerts = this.jobAlertsSubject.value.filter(a => a.isActive);

    alerts.forEach(alert => {
      const shouldSend = this.shouldSendAlert(alert);
      if (shouldSend) {
        // In real app, fetch matching jobs and send alert
        console.log('Checking job alert:', alert);
        this.updateJobAlert(alert.id, { lastSent: new Date() });
      }
    });
  }

  // Determine if alert should be sent
  private shouldSendAlert(alert: JobAlert): boolean {
    if (!alert.lastSent) return true;

    const now = new Date();
    const lastSent = new Date(alert.lastSent);
    const hoursSinceLastSent = (now.getTime() - lastSent.getTime()) / (1000 * 60 * 60);

    switch (alert.frequency) {
      case 'instantly':
        return hoursSinceLastSent >= 1;
      case 'daily':
        return hoursSinceLastSent >= 24;
      case 'weekly':
        return hoursSinceLastSent >= 168;
      default:
        return false;
    }
  }

  // Load preferences from storage
  private loadPreferences(): void {
    const saved = localStorage.getItem('notificationPreferences');
    if (saved) {
      this.notificationPreferencesSubject.next(JSON.parse(saved));
    }
  }

  // Load job alerts from storage
  private loadJobAlerts(): void {
    const saved = localStorage.getItem('jobAlerts');
    if (saved) {
      const alerts = JSON.parse(saved).map((a: any) => ({
        ...a,
        lastSent: a.lastSent ? new Date(a.lastSent) : undefined
      }));
      this.jobAlertsSubject.next(alerts);
    }
  }

  // Persist job alerts to storage
  private persistJobAlerts(): void {
    localStorage.setItem('jobAlerts', JSON.stringify(this.jobAlertsSubject.value));
  }
}
