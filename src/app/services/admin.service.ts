import { Injectable, signal, computed } from '@angular/core';
import { Observable, of, interval } from 'rxjs';
import { map, delay } from 'rxjs/operators';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'candidate' | 'employer' | 'admin';
  createdAt: Date;
  lastLogin: Date;
  status: 'active' | 'suspended' | 'pending';
  verificationStatus: 'verified' | 'unverified';
  subscriptionPlan?: 'free' | 'basic' | 'professional' | 'enterprise';
}

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  salary?: string;
  salaryRange?: {
    min: number;
    max: number;
    currency: string;
  };
  status: 'pending' | 'approved' | 'rejected';
  postedDate: Date;
  views: number;
  applications: number;
  category: string;
  type: string;
  description: string;
  requirements: string[];
}

export interface Report {
  id: string;
  type: 'user' | 'job' | 'payment';
  reportedBy: string;
  reportedItem: string;
  reason: string;
  status: 'pending' | 'reviewed' | 'resolved';
  createdAt: Date;
  insights?: {
    summary: string;
    keyMetrics: Array<{
      label: string;
      value: string;
      change: string;
      trend: 'up' | 'down' | 'stable';
    }>;
    recommendations: string[];
  };
}

export interface Analytics {
  totalUsers: number;
  activeUsers: number;
  totalJobs: number;
  activeJobs: number;
  totalApplications: number;
  revenue: {
    total: number;
    monthly: number;
    yearly: number;
  };
  subscriptions: {
    free: number;
    basic: number;
    professional: number;
    enterprise: number;
  };
  userGrowth: Array<{
    month: string;
    users: number;
    jobs: number;
    applications: number;
  }>;
}

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private users = signal<User[]>([
    {
      id: '1',
      email: 'john@example.com',
      name: 'John Doe',
      role: 'candidate',
      createdAt: new Date('2024-01-15'),
      lastLogin: new Date('2024-03-20'),
      status: 'active',
      verificationStatus: 'verified'
    },
    {
      id: '2',
      email: 'company@techcorp.com',
      name: 'TechCorp HR',
      role: 'employer',
      createdAt: new Date('2024-02-01'),
      lastLogin: new Date('2024-03-19'),
      status: 'active',
      verificationStatus: 'verified',
      subscriptionPlan: 'professional'
    },
    {
      id: '3',
      email: 'admin@jobclass.com',
      name: 'Admin User',
      role: 'admin',
      createdAt: new Date('2023-12-01'),
      lastLogin: new Date('2024-03-21'),
      status: 'active',
      verificationStatus: 'verified'
    }
  ]);

  private jobs = signal<Job[]>([
    {
      id: '1',
      title: 'Senior Frontend Developer',
      company: 'TechCorp',
      location: 'San Francisco, CA',
      salaryRange: {
        min: 120000,
        max: 180000,
        currency: '$'
      },
      status: 'approved',
      postedDate: new Date('2024-03-15'),
      views: 1250,
      applications: 45,
      category: 'Technology',
      type: 'Full-time',
      description: 'We are looking for an experienced frontend developer...',
      requirements: ['React', 'TypeScript', '5+ years experience']
    },
    {
      id: '2',
      title: 'Marketing Manager',
      company: 'StartupXYZ',
      location: 'Remote',
      salaryRange: {
        min: 80000,
        max: 120000,
        currency: '$'
      },
      status: 'pending',
      postedDate: new Date('2024-03-20'),
      views: 340,
      applications: 12,
      category: 'Marketing',
      type: 'Full-time',
      description: 'Join our growing marketing team...',
      requirements: ['Digital Marketing', 'SEO/SEM', '3+ years experience']
    }
  ]);

  private reports = signal<Report[]>([
    {
      id: '1',
      type: 'job',
      reportedBy: 'user123',
      reportedItem: 'job456',
      reason: 'Suspected scam - asking for upfront payment',
      status: 'pending',
      createdAt: new Date('2024-03-19'),
      insights: {
        summary: 'Job posting contains suspicious payment requests',
        keyMetrics: [
          { label: 'Risk Level', value: 'High', change: '+15%', trend: 'up' },
          { label: 'Similar Reports', value: '3', change: '+2', trend: 'up' }
        ],
        recommendations: [
          'Remove job posting immediately',
          'Suspend employer account pending investigation',
          'Review all postings from this employer'
        ]
      }
    },
    {
      id: '2',
      type: 'user',
      reportedBy: 'employer789',
      reportedItem: 'user012',
      reason: 'Fake profile - using stolen identity',
      status: 'reviewed',
      createdAt: new Date('2024-03-18'),
      insights: {
        summary: 'User profile verification failed',
        keyMetrics: [
          { label: 'Verification Score', value: '25%', change: '-50%', trend: 'down' },
          { label: 'Profile Completeness', value: '40%', change: '0%', trend: 'stable' }
        ],
        recommendations: [
          'Suspend account until identity verified',
          'Request additional documentation',
          'Flag similar profiles for review'
        ]
      }
    }
  ]);

  private analytics = signal<Analytics>({
    totalUsers: 15234,
    activeUsers: 8921,
    totalJobs: 3456,
    activeJobs: 2103,
    totalApplications: 45678,
    revenue: {
      total: 523000,
      monthly: 43583,
      yearly: 523000
    },
    subscriptions: {
      free: 12000,
      basic: 2500,
      professional: 650,
      enterprise: 84
    },
    userGrowth: [
      { month: 'Jan', users: 14200, jobs: 3100, applications: 41000 },
      { month: 'Feb', users: 14800, jobs: 3300, applications: 43000 },
      { month: 'Mar', users: 15234, jobs: 3456, applications: 45678 }
    ]
  });

  constructor() {
    // Simulate real-time updates
    interval(5000).subscribe(() => {
      this.updateAnalytics();
    });
  }

  private updateAnalytics(): void {
    const current = this.analytics();
    this.analytics.set({
      ...current,
      activeUsers: current.activeUsers + Math.floor(Math.random() * 10) - 5,
      totalApplications: current.totalApplications + Math.floor(Math.random() * 20)
    });
  }

  getUsers(): Observable<User[]> {
    return of(this.users());
  }

  getJobs(): Observable<Job[]> {
    return of(this.jobs());
  }

  getReports(): Observable<Report[]> {
    return of(this.reports());
  }

  getAnalytics(): Observable<Analytics> {
    return of(this.analytics());
  }

  suspendUser(userId: string): Observable<boolean> {
    const users = this.users();
    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex !== -1) {
      users[userIndex].status = 'suspended';
      this.users.set([...users]);
      return of(true).pipe(delay(500));
    }
    return of(false);
  }

  activateUser(userId: string): Observable<boolean> {
    const users = this.users();
    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex !== -1) {
      users[userIndex].status = 'active';
      this.users.set([...users]);
      return of(true).pipe(delay(500));
    }
    return of(false);
  }

  approveJob(jobId: string): Observable<boolean> {
    const jobs = this.jobs();
    const jobIndex = jobs.findIndex(j => j.id === jobId);
    if (jobIndex !== -1) {
      jobs[jobIndex].status = 'approved';
      this.jobs.set([...jobs]);
      return of(true).pipe(delay(500));
    }
    return of(false);
  }

  rejectJob(jobId: string): Observable<boolean> {
    const jobs = this.jobs();
    const jobIndex = jobs.findIndex(j => j.id === jobId);
    if (jobIndex !== -1) {
      jobs[jobIndex].status = 'rejected';
      this.jobs.set([...jobs]);
      return of(true).pipe(delay(500));
    }
    return of(false);
  }

  resolveReport(reportId: string): Observable<boolean> {
    const reports = this.reports();
    const reportIndex = reports.findIndex(r => r.id === reportId);
    if (reportIndex !== -1) {
      reports[reportIndex].status = 'resolved';
      this.reports.set([...reports]);
      return of(true).pipe(delay(500));
    }
    return of(false);
  }

  deleteUser(userId: string): Observable<boolean> {
    const users = this.users().filter(u => u.id !== userId);
    this.users.set(users);
    return of(true).pipe(delay(500));
  }

  deleteJob(jobId: string): Observable<boolean> {
    const jobs = this.jobs().filter(j => j.id !== jobId);
    this.jobs.set(jobs);
    return of(true).pipe(delay(500));
  }
}
