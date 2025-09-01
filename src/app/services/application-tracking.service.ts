import { Injectable, signal } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

export interface Application {
  id: string;
  jobId: string;
  jobTitle: string;
  company: string;
  appliedDate: Date;
  status: 'submitted' | 'under-review' | 'interview' | 'offer' | 'rejected';
  timeline: ApplicationEvent[];
  documents: ApplicationDocument[];
  interviews: Interview[];
  offer?: JobOffer;
}

export interface ApplicationEvent {
  date: Date;
  type: 'submitted' | 'viewed' | 'shortlisted' | 'interview-scheduled' | 'interview-completed' | 'offer-made' | 'rejected';
  description: string;
}

export interface ApplicationDocument {
  id: string;
  name: string;
  type: 'resume' | 'cover-letter' | 'portfolio' | 'other';
  uploadDate: Date;
  url: string;
}

export interface Interview {
  id: string;
  type: 'phone' | 'video' | 'in-person';
  scheduledDate: Date;
  duration: number;
  interviewers: string[];
  notes?: string;
  status: 'scheduled' | 'completed' | 'cancelled';
}

export interface JobOffer {
  salary: number;
  startDate: Date;
  benefits: string[];
  status: 'pending' | 'accepted' | 'rejected' | 'negotiating';
}

@Injectable({
  providedIn: 'root'
})
export class ApplicationTrackingService {
  private applications = signal<Application[]>([
    {
      id: '1',
      jobId: 'job1',
      jobTitle: 'Senior Frontend Developer',
      company: 'TechCorp',
      appliedDate: new Date('2024-03-10'),
      status: 'interview',
      timeline: [
        { date: new Date('2024-03-10'), type: 'submitted', description: 'Application submitted' },
        { date: new Date('2024-03-11'), type: 'viewed', description: 'Application viewed by recruiter' },
        { date: new Date('2024-03-13'), type: 'shortlisted', description: 'Shortlisted for interview' },
        { date: new Date('2024-03-15'), type: 'interview-scheduled', description: 'Interview scheduled' }
      ],
      documents: [
        { id: 'doc1', name: 'Resume.pdf', type: 'resume', uploadDate: new Date('2024-03-10'), url: '#' },
        { id: 'doc2', name: 'Cover Letter.pdf', type: 'cover-letter', uploadDate: new Date('2024-03-10'), url: '#' }
      ],
      interviews: [
        {
          id: 'int1',
          type: 'video',
          scheduledDate: new Date('2024-03-20T14:00:00'),
          duration: 60,
          interviewers: ['John Smith', 'Jane Doe'],
          status: 'scheduled'
        }
      ]
    },
    {
      id: '2',
      jobId: 'job2',
      jobTitle: 'Full Stack Developer',
      company: 'StartupXYZ',
      appliedDate: new Date('2024-03-05'),
      status: 'offer',
      timeline: [
        { date: new Date('2024-03-05'), type: 'submitted', description: 'Application submitted' },
        { date: new Date('2024-03-06'), type: 'viewed', description: 'Application viewed' },
        { date: new Date('2024-03-08'), type: 'interview-scheduled', description: 'Interview scheduled' },
        { date: new Date('2024-03-12'), type: 'interview-completed', description: 'Interview completed' },
        { date: new Date('2024-03-15'), type: 'offer-made', description: 'Job offer received' }
      ],
      documents: [
        { id: 'doc3', name: 'Resume.pdf', type: 'resume', uploadDate: new Date('2024-03-05'), url: '#' }
      ],
      interviews: [
        {
          id: 'int2',
          type: 'video',
          scheduledDate: new Date('2024-03-12T10:00:00'),
          duration: 45,
          interviewers: ['Mike Johnson'],
          status: 'completed',
          notes: 'Great technical skills, good culture fit'
        }
      ],
      offer: {
        salary: 120000,
        startDate: new Date('2024-04-01'),
        benefits: ['Health Insurance', '401k', 'Remote Work'],
        status: 'pending'
      }
    }
  ]);

  constructor() {}

  getApplications(): Observable<Application[]> {
    return of(this.applications());
  }

  getApplicationById(id: string): Observable<Application | undefined> {
    return of(this.applications().find(a => a.id === id));
  }

  updateApplicationStatus(id: string, status: Application['status']): Observable<boolean> {
    const apps = this.applications();
    const index = apps.findIndex(a => a.id === id);
    if (index !== -1) {
      apps[index].status = status;
      this.applications.set([...apps]);
      return of(true).pipe(delay(500));
    }
    return of(false);
  }

  scheduleInterview(applicationId: string, interview: Interview): Observable<boolean> {
    const apps = this.applications();
    const index = apps.findIndex(a => a.id === applicationId);
    if (index !== -1) {
      apps[index].interviews.push(interview);
      apps[index].timeline.push({
        date: new Date(),
        type: 'interview-scheduled',
        description: `${interview.type} interview scheduled`
      });
      this.applications.set([...apps]);
      return of(true).pipe(delay(500));
    }
    return of(false);
  }

  respondToOffer(applicationId: string, response: 'accepted' | 'rejected' | 'negotiating'): Observable<boolean> {
    const apps = this.applications();
    const index = apps.findIndex(a => a.id === applicationId);
    if (index !== -1 && apps[index].offer) {
      apps[index].offer!.status = response;
      this.applications.set([...apps]);
      return of(true).pipe(delay(500));
    }
    return of(false);
  }

  withdrawApplication(id: string): Observable<boolean> {
    const apps = this.applications().filter(a => a.id !== id);
    this.applications.set(apps);
    return of(true).pipe(delay(500));
  }
}
