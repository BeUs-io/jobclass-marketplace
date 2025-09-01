import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, interval } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Notification {
  id: string;
  type: 'message' | 'application' | 'interview' | 'offer' | 'system' | 'job_alert';
  title: string;
  message: string;
  icon?: string;
  actionUrl?: string;
  timestamp: Date;
  read: boolean;
  priority: 'low' | 'medium' | 'high';
  metadata?: any;
}

export interface NotificationBadges {
  total: number;
  messages: number;
  applications: number;
  alerts: number;
}

@Injectable({
  providedIn: 'root'
})
export class RealTimeNotificationService {
  private notificationsSubject = new BehaviorSubject<Notification[]>([]);
  public notifications$ = this.notificationsSubject.asObservable();

  private badgesSubject = new BehaviorSubject<NotificationBadges>({
    total: 0,
    messages: 0,
    applications: 0,
    alerts: 0
  });
  public badges$ = this.badgesSubject.asObservable();

  private soundEnabled = true;
  private desktopNotificationsEnabled = false;

  constructor() {
    this.loadNotifications();
    this.simulateRealTimeNotifications();
    this.requestDesktopNotificationPermission();
  }

  private loadNotifications() {
    const saved = localStorage.getItem('notifications');
    if (saved) {
      const notifications = JSON.parse(saved);
      notifications.forEach((n: any) => {
        n.timestamp = new Date(n.timestamp);
      });
      this.notificationsSubject.next(notifications);
    } else {
      this.generateInitialNotifications();
    }
    this.updateBadgeCounts();
  }

  private generateInitialNotifications() {
    const notifications: Notification[] = [
      {
        id: 'notif_1',
        type: 'message',
        title: 'New message from Sarah Johnson',
        message: 'Hi! I reviewed your application and would like to schedule an interview.',
        icon: '💬',
        actionUrl: '/messages',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        read: false,
        priority: 'high'
      },
      {
        id: 'notif_2',
        type: 'application',
        title: 'Application status updated',
        message: 'Your application for Senior Developer at TechCorp has been shortlisted.',
        icon: '📋',
        actionUrl: '/application-tracker',
        timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
        read: false,
        priority: 'medium'
      },
      {
        id: 'notif_3',
        type: 'interview',
        title: 'Interview reminder',
        message: 'Your interview with CloudTech is scheduled for tomorrow at 2 PM.',
        icon: '📅',
        actionUrl: '/application-tracker',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
        read: true,
        priority: 'high'
      },
      {
        id: 'notif_4',
        type: 'job_alert',
        title: 'New jobs matching your profile',
        message: '5 new Senior Developer positions were posted today.',
        icon: '🔔',
        actionUrl: '/jobs',
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        read: true,
        priority: 'low'
      }
    ];

    this.notificationsSubject.next(notifications);
    this.saveNotifications();
  }

  private saveNotifications() {
    localStorage.setItem('notifications', JSON.stringify(this.notificationsSubject.value));
  }

  private updateBadgeCounts() {
    const notifications = this.notificationsSubject.value;
    const unread = notifications.filter(n => !n.read);

    const badges: NotificationBadges = {
      total: unread.length,
      messages: unread.filter(n => n.type === 'message').length,
      applications: unread.filter(n => ['application', 'interview', 'offer'].includes(n.type)).length,
      alerts: unread.filter(n => ['job_alert', 'system'].includes(n.type)).length
    };

    this.badgesSubject.next(badges);
  }

  private simulateRealTimeNotifications() {
    // Simulate new notifications every 30-60 seconds
    interval(30000 + Math.random() * 30000).subscribe(() => {
      if (Math.random() > 0.5) {
        this.addRandomNotification();
      }
    });
  }

  private addRandomNotification() {
    const types = ['message', 'application', 'interview', 'offer', 'job_alert'];
    const type = types[Math.floor(Math.random() * types.length)] as Notification['type'];

    const notifications: Record<Notification['type'], () => Notification> = {
      message: () => ({
        id: 'notif_' + Date.now(),
        type: 'message',
        title: 'New message from employer',
        message: 'You have received a new message regarding your application.',
        icon: '💬',
        actionUrl: '/messages',
        timestamp: new Date(),
        read: false,
        priority: 'medium'
      }),
      application: () => ({
        id: 'notif_' + Date.now(),
        type: 'application',
        title: 'Application viewed',
        message: 'An employer has viewed your application.',
        icon: '👁️',
        actionUrl: '/application-tracker',
        timestamp: new Date(),
        read: false,
        priority: 'low'
      }),
      interview: () => ({
        id: 'notif_' + Date.now(),
        type: 'interview',
        title: 'Interview scheduled',
        message: 'You have a new interview scheduled for next week.',
        icon: '📅',
        actionUrl: '/application-tracker',
        timestamp: new Date(),
        read: false,
        priority: 'high'
      }),
      offer: () => ({
        id: 'notif_' + Date.now(),
        type: 'offer',
        title: 'Job offer received!',
        message: 'Congratulations! You have received a job offer.',
        icon: '🎉',
        actionUrl: '/application-tracker',
        timestamp: new Date(),
        read: false,
        priority: 'high'
      }),
      job_alert: () => ({
        id: 'notif_' + Date.now(),
        type: 'job_alert',
        title: 'New job matches',
        message: 'New jobs matching your preferences are available.',
        icon: '🔔',
        actionUrl: '/jobs',
        timestamp: new Date(),
        read: false,
        priority: 'low'
      }),
      system: () => ({
        id: 'notif_' + Date.now(),
        type: 'system',
        title: 'System update',
        message: 'New features have been added to improve your experience.',
        icon: 'ℹ️',
        actionUrl: '',
        timestamp: new Date(),
        read: false,
        priority: 'low'
      })
    };

    const newNotification = notifications[type]();
    this.addNotification(newNotification);
  }

  addNotification(notification: Notification): void {
    const notifications = [notification, ...this.notificationsSubject.value];

    // Keep only last 50 notifications
    if (notifications.length > 50) {
      notifications.splice(50);
    }

    this.notificationsSubject.next(notifications);
    this.updateBadgeCounts();
    this.saveNotifications();

    // Play sound if enabled
    if (this.soundEnabled && !notification.read) {
      this.playNotificationSound();
    }

    // Show desktop notification if enabled
    if (this.desktopNotificationsEnabled && !notification.read) {
      this.showDesktopNotification(notification);
    }
  }

  markAsRead(notificationId: string): void {
    const notifications = this.notificationsSubject.value;
    const notification = notifications.find(n => n.id === notificationId);

    if (notification) {
      notification.read = true;
      this.notificationsSubject.next(notifications);
      this.updateBadgeCounts();
      this.saveNotifications();
    }
  }

  markAllAsRead(): void {
    const notifications = this.notificationsSubject.value;
    notifications.forEach(n => n.read = true);
    this.notificationsSubject.next(notifications);
    this.updateBadgeCounts();
    this.saveNotifications();
  }

  deleteNotification(notificationId: string): void {
    const notifications = this.notificationsSubject.value.filter(n => n.id !== notificationId);
    this.notificationsSubject.next(notifications);
    this.updateBadgeCounts();
    this.saveNotifications();
  }

  clearAll(): void {
    this.notificationsSubject.next([]);
    this.updateBadgeCounts();
    this.saveNotifications();
  }

  getUnreadCount(): Observable<number> {
    return this.notifications$.pipe(
      map(notifications => notifications.filter(n => !n.read).length)
    );
  }

  getRecentNotifications(limit: number = 5): Observable<Notification[]> {
    return this.notifications$.pipe(
      map(notifications => notifications.slice(0, limit))
    );
  }

  private playNotificationSound() {
    // In a real app, you would play an audio file
    console.log('🔔 Notification sound played');
  }

  private requestDesktopNotificationPermission() {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission().then(permission => {
        this.desktopNotificationsEnabled = permission === 'granted';
      });
    }
  }

  private showDesktopNotification(notification: Notification) {
    if ('Notification' in window && Notification.permission === 'granted') {
      const desktopNotif = new Notification(notification.title, {
        body: notification.message,
        icon: '/assets/logo.png',
        badge: '/assets/badge.png',
        tag: notification.id,
        requireInteraction: notification.priority === 'high'
      });

      desktopNotif.onclick = () => {
        window.focus();
        if (notification.actionUrl) {
          window.location.href = notification.actionUrl;
        }
        desktopNotif.close();
      };
    }
  }

  toggleSound(): void {
    this.soundEnabled = !this.soundEnabled;
    localStorage.setItem('notificationSound', this.soundEnabled.toString());
  }

  toggleDesktopNotifications(): void {
    if (!this.desktopNotificationsEnabled && 'Notification' in window) {
      Notification.requestPermission().then(permission => {
        this.desktopNotificationsEnabled = permission === 'granted';
        localStorage.setItem('desktopNotifications', this.desktopNotificationsEnabled.toString());
      });
    } else {
      this.desktopNotificationsEnabled = false;
      localStorage.setItem('desktopNotifications', 'false');
    }
  }

  getSoundEnabled(): boolean {
    return this.soundEnabled;
  }

  getDesktopNotificationsEnabled(): boolean {
    return this.desktopNotificationsEnabled;
  }
}
