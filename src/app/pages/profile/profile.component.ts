import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService, User, Notification } from '../../services/auth.service';
import { JobService } from '../../services/job.service';
import { Job } from '../../models/job.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="min-h-screen bg-gray-50 py-8">
      <div class="container mx-auto px-4">
        <div class="max-w-6xl mx-auto">
          <!-- Profile Header -->
          <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div class="flex items-start justify-between">
              <div class="flex items-center space-x-4">
                <img
                  [src]="user?.avatar || 'https://ui-avatars.com/api/?name=' + user?.name"
                  [alt]="user?.name"
                  class="w-20 h-20 rounded-full object-cover"
                >
                <div>
                  <h1 class="text-2xl font-bold text-gray-800">{{user?.name}}</h1>
                  <p class="text-gray-600">{{user?.email}}</p>
                  <p class="text-sm text-gray-500 mt-1">
                    <span class="capitalize">{{user?.role}}</span>
                    <span *ngIf="user?.company"> at {{user?.company}}</span>
                  </p>
                </div>
              </div>
              <button
                (click)="toggleEditMode()"
                class="btn btn-outline"
              >
                {{editMode ? 'Cancel' : 'Edit Profile'}}
              </button>
            </div>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <!-- Sidebar -->
            <div class="lg:col-span-1">
              <!-- Navigation -->
              <div class="bg-white rounded-lg shadow-sm p-4 mb-6">
                <nav class="space-y-1">
                  <button
                    (click)="activeTab = 'overview'"
                    [class.bg-primary]="activeTab === 'overview'"
                    [class.text-white]="activeTab === 'overview'"
                    class="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    Overview
                  </button>
                  <button
                    (click)="activeTab = 'notifications'"
                    [class.bg-primary]="activeTab === 'notifications'"
                    [class.text-white]="activeTab === 'notifications'"
                    class="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors flex justify-between items-center"
                  >
                    <span>Notifications</span>
                    <span
                      *ngIf="unreadCount > 0"
                      class="px-2 py-0.5 text-xs rounded-full"
                      [class.bg-white]="activeTab === 'notifications'"
                      [class.text-primary]="activeTab === 'notifications'"
                      [class.bg-red-500]="activeTab !== 'notifications'"
                      [class.text-white]="activeTab !== 'notifications'"
                    >
                      {{unreadCount}}
                    </span>
                  </button>
                  <button
                    (click)="activeTab = 'saved'"
                    [class.bg-primary]="activeTab === 'saved'"
                    [class.text-white]="activeTab === 'saved'"
                    class="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    Saved Jobs
                  </button>
                  <button
                    (click)="activeTab = 'applications'"
                    [class.bg-primary]="activeTab === 'applications'"
                    [class.text-white]="activeTab === 'applications'"
                    class="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    Applications
                  </button>
                  <button
                    *ngIf="user?.role === 'employer'"
                    (click)="activeTab = 'posted'"
                    [class.bg-primary]="activeTab === 'posted'"
                    [class.text-white]="activeTab === 'posted'"
                    class="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    Posted Jobs
                  </button>
                </nav>
              </div>

              <!-- Quick Stats -->
              <div class="bg-white rounded-lg shadow-sm p-4">
                <h3 class="font-semibold mb-3">Quick Stats</h3>
                <div class="space-y-2">
                  <div class="flex justify-between text-sm">
                    <span class="text-gray-600">Profile Views</span>
                    <span class="font-medium">1,234</span>
                  </div>
                  <div class="flex justify-between text-sm">
                    <span class="text-gray-600">Applications</span>
                    <span class="font-medium">23</span>
                  </div>
                  <div class="flex justify-between text-sm">
                    <span class="text-gray-600">Saved Jobs</span>
                    <span class="font-medium">{{(savedJobs$ | async)?.length || 0}}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Main Content -->
            <div class="lg:col-span-2">
              <!-- Overview Tab -->
              <div *ngIf="activeTab === 'overview'" class="space-y-6">
                <!-- Edit Profile Form -->
                <div *ngIf="editMode" class="bg-white rounded-lg shadow-sm p-6">
                  <h2 class="text-xl font-semibold mb-4">Edit Profile</h2>
                  <form (ngSubmit)="saveProfile()" class="space-y-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">Name</label>
                      <input
                        type="text"
                        [(ngModel)]="editedUser.name"
                        name="name"
                        class="input-field"
                      >
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">Location</label>
                      <input
                        type="text"
                        [(ngModel)]="editedUser.location"
                        name="location"
                        class="input-field"
                      >
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                      <input
                        type="tel"
                        [(ngModel)]="editedUser.phone"
                        name="phone"
                        class="input-field"
                      >
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                      <textarea
                        [(ngModel)]="editedUser.bio"
                        name="bio"
                        rows="4"
                        class="input-field"
                      ></textarea>
                    </div>
                    <div class="flex gap-4">
                      <button type="submit" class="btn btn-primary">Save Changes</button>
                      <button type="button" (click)="toggleEditMode()" class="btn btn-outline">Cancel</button>
                    </div>
                  </form>
                </div>

                <!-- Profile Info -->
                <div *ngIf="!editMode" class="bg-white rounded-lg shadow-sm p-6">
                  <h2 class="text-xl font-semibold mb-4">Profile Information</h2>
                  <div class="space-y-3">
                    <div>
                      <span class="text-sm text-gray-600">Location</span>
                      <p class="font-medium">{{user?.location || 'Not specified'}}</p>
                    </div>
                    <div>
                      <span class="text-sm text-gray-600">Phone</span>
                      <p class="font-medium">{{user?.phone || 'Not specified'}}</p>
                    </div>
                    <div>
                      <span class="text-sm text-gray-600">Bio</span>
                      <p class="text-gray-700">{{user?.bio || 'No bio added yet'}}</p>
                    </div>
                    <div>
                      <span class="text-sm text-gray-600">Member Since</span>
                      <p class="font-medium">{{user?.createdAt | date: 'MMMM yyyy'}}</p>
                    </div>
                  </div>
                </div>

                <!-- Resume Upload -->
                <div *ngIf="user?.role === 'jobseeker'" class="bg-white rounded-lg shadow-sm p-6">
                  <h2 class="text-xl font-semibold mb-4">Resume</h2>
                  <div *ngIf="!user?.resume" class="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                    <svg class="w-12 h-12 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                    </svg>
                    <p class="text-gray-600 mb-3">Upload your resume to apply for jobs faster</p>
                    <button class="btn btn-primary">Upload Resume</button>
                  </div>
                  <div *ngIf="user?.resume" class="flex items-center justify-between">
                    <div class="flex items-center">
                      <svg class="w-8 h-8 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                      </svg>
                      <div>
                        <p class="font-medium">resume.pdf</p>
                        <p class="text-sm text-gray-500">Uploaded 2 days ago</p>
                      </div>
                    </div>
                    <button class="text-primary hover:text-primary-dark">Replace</button>
                  </div>
                </div>
              </div>

              <!-- Notifications Tab -->
              <div *ngIf="activeTab === 'notifications'" class="space-y-4">
                <div class="bg-white rounded-lg shadow-sm p-6">
                  <div class="flex justify-between items-center mb-4">
                    <h2 class="text-xl font-semibold">Notifications</h2>
                    <button
                      (click)="clearAllNotifications()"
                      class="text-sm text-gray-600 hover:text-gray-900"
                    >
                      Clear All
                    </button>
                  </div>

                  <div *ngIf="notifications.length === 0" class="text-center py-8">
                    <svg class="w-12 h-12 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
                    </svg>
                    <p class="text-gray-600">No notifications yet</p>
                  </div>

                  <div class="space-y-3">
                    <div
                      *ngFor="let notification of notifications"
                      class="p-4 rounded-lg border transition-colors cursor-pointer"
                      [class.bg-blue-50]="!notification.read"
                      [class.border-blue-200]="!notification.read"
                      [class.bg-white]="notification.read"
                      [class.border-gray-200]="notification.read"
                      (click)="markAsRead(notification.id)"
                    >
                      <div class="flex items-start justify-between">
                        <div class="flex-1">
                          <div class="flex items-center mb-1">
                            <span
                              class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium mr-2"
                              [ngClass]="getNotificationTypeClass(notification.type)"
                            >
                              {{getNotificationTypeLabel(notification.type)}}
                            </span>
                            <span class="text-xs text-gray-500">{{notification.createdAt | date: 'short'}}</span>
                          </div>
                          <h4 class="font-medium text-gray-900">{{notification.title}}</h4>
                          <p class="text-sm text-gray-600 mt-1">{{notification.message}}</p>
                          <a
                            *ngIf="notification.actionUrl"
                            [href]="notification.actionUrl"
                            class="text-sm text-primary hover:text-primary-dark mt-2 inline-block"
                          >
                            View Details →
                          </a>
                        </div>
                        <button
                          *ngIf="!notification.read"
                          class="text-blue-600 hover:text-blue-800"
                        >
                          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
                            <path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd"/>
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Saved Jobs Tab -->
              <div *ngIf="activeTab === 'saved'" class="space-y-4">
                <div class="bg-white rounded-lg shadow-sm p-6">
                  <h2 class="text-xl font-semibold mb-4">Saved Jobs</h2>

                  <div *ngIf="(savedJobs$ | async)?.length === 0" class="text-center py-8">
                    <svg class="w-12 h-12 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                    </svg>
                    <p class="text-gray-600 mb-3">You haven't saved any jobs yet</p>
                    <a routerLink="/jobs" class="btn btn-primary">Browse Jobs</a>
                  </div>

                  <div class="space-y-4">
                    <div
                      *ngFor="let job of savedJobs$ | async"
                      class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div class="flex items-start justify-between">
                        <div class="flex items-start space-x-3">
                          <img
                            [src]="job.company.logo"
                            [alt]="job.company.name"
                            class="w-12 h-12 rounded-lg object-cover"
                          >
                          <div>
                            <h4 class="font-medium">
                              <a [routerLink]="['/job', job.id]" class="hover:text-primary">{{job.title}}</a>
                            </h4>
                            <p class="text-sm text-gray-600">{{job.company.name}} • {{job.location}}</p>
                            <div class="flex items-center gap-3 mt-2 text-sm text-gray-500">
                              <span>{{job.type}}</span>
                              <span *ngIf="job.salary">{{formatSalary(job.salary)}}</span>
                            </div>
                          </div>
                        </div>
                        <button
                          (click)="removeSavedJob(job.id)"
                          class="text-gray-400 hover:text-red-500"
                        >
                          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd"/>
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Applications Tab -->
              <div *ngIf="activeTab === 'applications'" class="space-y-4">
                <div class="bg-white rounded-lg shadow-sm p-6">
                  <h2 class="text-xl font-semibold mb-4">Job Applications</h2>

                  <div class="text-center py-8">
                    <svg class="w-12 h-12 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                    </svg>
                    <p class="text-gray-600">Application tracking coming soon!</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class ProfileComponent implements OnInit {
  user: User | null = null;
  editMode = false;
  activeTab = 'overview';
  notifications: Notification[] = [];
  unreadCount = 0;
  savedJobs$!: Observable<Job[]>;

  editedUser: Partial<User> = {};

  constructor(
    private authService: AuthService,
    private jobService: JobService
  ) {}

  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      this.user = user;
      if (user) {
        this.editedUser = { ...user };
      }
    });

    this.authService.notifications$.subscribe(notifications => {
      this.notifications = notifications;
    });

    this.authService.getUnreadNotificationCount().subscribe(count => {
      this.unreadCount = count;
    });

    this.savedJobs$ = this.jobService.getSavedJobs();
  }

  toggleEditMode() {
    this.editMode = !this.editMode;
    if (this.editMode && this.user) {
      this.editedUser = { ...this.user };
    }
  }

  saveProfile() {
    this.authService.updateProfile(this.editedUser).subscribe(updatedUser => {
      this.user = updatedUser;
      this.editMode = false;
    });
  }

  markAsRead(notificationId: string) {
    this.authService.markNotificationAsRead(notificationId);
  }

  clearAllNotifications() {
    if (confirm('Are you sure you want to clear all notifications?')) {
      this.authService.clearAllNotifications();
    }
  }

  removeSavedJob(jobId: string) {
    this.jobService.toggleSaveJob(jobId);
  }

  getNotificationTypeClass(type: string): string {
    switch (type) {
      case 'job_alert':
        return 'bg-blue-100 text-blue-800';
      case 'application_status':
        return 'bg-green-100 text-green-800';
      case 'message':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  getNotificationTypeLabel(type: string): string {
    switch (type) {
      case 'job_alert':
        return 'Job Alert';
      case 'application_status':
        return 'Application';
      case 'message':
        return 'Message';
      default:
        return 'System';
    }
  }

  formatSalary(salary: { min: number; max: number; currency: string }): string {
    return `${salary.min.toLocaleString()} - ${salary.max.toLocaleString()}`;
  }
}
