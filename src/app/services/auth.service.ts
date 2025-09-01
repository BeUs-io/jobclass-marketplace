import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'jobseeker' | 'employer' | 'admin';
  company?: string;
  avatar?: string;
  phone?: string;
  location?: string;
  bio?: string;
  resume?: string;
  savedJobs?: string[];
  appliedJobs?: string[];
  notifications?: Notification[];
  createdAt: Date;
}

export interface Notification {
  id: string;
  type: 'job_alert' | 'application_status' | 'message' | 'system';
  title: string;
  message: string;
  read: boolean;
  createdAt: Date;
  jobId?: string;
  actionUrl?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData extends LoginCredentials {
  name: string;
  role: 'jobseeker' | 'employer';
  company?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  private notificationsSubject = new BehaviorSubject<Notification[]>([]);
  public notifications$ = this.notificationsSubject.asObservable();

  constructor() {
    // Check for saved user session
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      this.currentUserSubject.next(JSON.parse(savedUser));
      this.loadUserNotifications();
    }
  }

  login(credentials: LoginCredentials): Observable<{ success: boolean; user?: User; error?: string }> {
    // Simulate API call
    return of(null).pipe(
      delay(1000),
      map(() => {
        // Mock validation
        if (credentials.email === 'demo@jobclass.com' && credentials.password === 'demo123') {
          const user: User = {
            id: '1',
            email: credentials.email,
            name: 'John Doe',
            role: 'jobseeker',
            avatar: 'https://ui-avatars.com/api/?name=John+Doe&background=22c55e&color=fff',
            location: 'New York, NY',
            bio: 'Experienced software developer looking for new opportunities',
            savedJobs: [],
            appliedJobs: [],
            createdAt: new Date()
          };

          this.currentUserSubject.next(user);
          localStorage.setItem('currentUser', JSON.stringify(user));
          this.loadUserNotifications();

          return { success: true, user };
        } else if (credentials.email === 'employer@jobclass.com' && credentials.password === 'employer123') {
          const user: User = {
            id: '2',
            email: credentials.email,
            name: 'Jane Smith',
            role: 'employer',
            company: 'TechCorp Solutions',
            avatar: 'https://ui-avatars.com/api/?name=Jane+Smith&background=4f46e5&color=fff',
            location: 'San Francisco, CA',
            createdAt: new Date()
          };

          this.currentUserSubject.next(user);
          localStorage.setItem('currentUser', JSON.stringify(user));
          this.loadUserNotifications();

          return { success: true, user };
        }

        return { success: false, error: 'Invalid email or password' };
      })
    );
  }

  register(data: RegisterData): Observable<{ success: boolean; user?: User; error?: string }> {
    return of(null).pipe(
      delay(1000),
      map(() => {
        // Mock registration
        const user: User = {
          id: Date.now().toString(),
          email: data.email,
          name: data.name,
          role: data.role,
          company: data.company,
          avatar: `https://ui-avatars.com/api/?name=${data.name.replace(' ', '+')}&background=22c55e&color=fff`,
          savedJobs: [],
          appliedJobs: [],
          createdAt: new Date()
        };

        this.currentUserSubject.next(user);
        localStorage.setItem('currentUser', JSON.stringify(user));

        // Send welcome notification
        this.addNotification({
          id: Date.now().toString(),
          type: 'system',
          title: 'Welcome to JobClass!',
          message: 'Your account has been created successfully. Start exploring job opportunities!',
          read: false,
          createdAt: new Date()
        });

        return { success: true, user };
      })
    );
  }

  logout(): void {
    this.currentUserSubject.next(null);
    this.notificationsSubject.next([]);
    localStorage.removeItem('currentUser');
    localStorage.removeItem('notifications');
  }

  isLoggedIn(): Observable<boolean> {
    return this.currentUser$.pipe(map(user => !!user));
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  updateProfile(updates: Partial<User>): Observable<User> {
    const currentUser = this.currentUserSubject.value;
    if (currentUser) {
      const updatedUser = { ...currentUser, ...updates };
      this.currentUserSubject.next(updatedUser);
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      return of(updatedUser).pipe(delay(500));
    }
    throw new Error('No user logged in');
  }

  private loadUserNotifications(): void {
    const savedNotifications = localStorage.getItem('notifications');
    if (savedNotifications) {
      this.notificationsSubject.next(JSON.parse(savedNotifications));
    } else {
      // Generate some mock notifications
      this.generateMockNotifications();
    }
  }

  private generateMockNotifications(): void {
    const notifications: Notification[] = [
      {
        id: '1',
        type: 'job_alert',
        title: 'New Job Match',
        message: '5 new jobs match your preferences',
        read: false,
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000)
      },
      {
        id: '2',
        type: 'application_status',
        title: 'Application Viewed',
        message: 'Your application for Senior Developer at TechCorp was viewed',
        read: false,
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
        jobId: '1'
      },
      {
        id: '3',
        type: 'message',
        title: 'New Message',
        message: 'You have received a message from a recruiter',
        read: true,
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
      }
    ];

    this.notificationsSubject.next(notifications);
    localStorage.setItem('notifications', JSON.stringify(notifications));
  }

  addNotification(notification: Notification): void {
    const current = this.notificationsSubject.value;
    const updated = [notification, ...current];
    this.notificationsSubject.next(updated);
    localStorage.setItem('notifications', JSON.stringify(updated));
  }

  markNotificationAsRead(notificationId: string): void {
    const current = this.notificationsSubject.value;
    const updated = current.map(n =>
      n.id === notificationId ? { ...n, read: true } : n
    );
    this.notificationsSubject.next(updated);
    localStorage.setItem('notifications', JSON.stringify(updated));
  }

  getUnreadNotificationCount(): Observable<number> {
    return this.notifications$.pipe(
      map(notifications => notifications.filter(n => !n.read).length)
    );
  }

  clearAllNotifications(): void {
    this.notificationsSubject.next([]);
    localStorage.removeItem('notifications');
  }
}
