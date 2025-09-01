import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService, User } from '../../services/auth.service';
import { JobService } from '../../services/job.service';
import { Job, JobType } from '../../models/job.model';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

interface JobApplication {
  id: string;
  jobId: string;
  jobTitle: string;
  applicantName: string;
  applicantEmail: string;
  applicantPhone: string;
  resumeUrl?: string;
  coverLetter: string;
  appliedDate: Date;
  status: 'new' | 'reviewing' | 'shortlisted' | 'interviewed' | 'rejected' | 'hired';
  notes?: string;
  rating?: number;
  linkedIn?: string;
  portfolio?: string;
  experience?: string;
  expectedSalary?: string;
}

interface DashboardStats {
  activeJobs: number;
  totalApplications: number;
  newApplications: number;
  shortlistedCandidates: number;
  hiredThisMonth: number;
  averageTimeToHire: number;
  applicationRate: number;
  viewsThisWeek: number;
}

@Component({
  selector: 'app-employer-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="min-h-screen bg-gray-50">
      <div class="container mx-auto px-4 py-8">
        <!-- Dashboard Header -->
        <div class="mb-8">
          <h1 class="text-3xl font-bold text-gray-800 mb-2">Employer Dashboard</h1>
          <p class="text-gray-600">Manage your job postings and track applications</p>
        </div>

        <!-- Stats Overview -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div class="bg-white rounded-lg shadow-sm p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-600">Active Jobs</p>
                <p class="text-2xl font-bold text-gray-800">{{stats.activeJobs}}</p>
                <p class="text-xs text-green-600 mt-1">+2 this week</p>
              </div>
              <div class="bg-blue-100 p-3 rounded-lg">
                <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A9 9 0 1 0 8.745 21h6.51A9 9 0 0 0 21 13.255z"></path>
                </svg>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-lg shadow-sm p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-600">Total Applications</p>
                <p class="text-2xl font-bold text-gray-800">{{stats.totalApplications}}</p>
                <p class="text-xs text-green-600 mt-1">{{stats.newApplications}} new</p>
              </div>
              <div class="bg-green-100 p-3 rounded-lg">
                <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-lg shadow-sm p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-600">Shortlisted</p>
                <p class="text-2xl font-bold text-gray-800">{{stats.shortlistedCandidates}}</p>
                <p class="text-xs text-blue-600 mt-1">Ready for interview</p>
              </div>
              <div class="bg-yellow-100 p-3 rounded-lg">
                <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
                </svg>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-lg shadow-sm p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-600">Avg. Time to Hire</p>
                <p class="text-2xl font-bold text-gray-800">{{stats.averageTimeToHire}} days</p>
                <p class="text-xs text-red-600 mt-1">-3 days vs last month</p>
              </div>
              <div class="bg-purple-100 p-3 rounded-lg">
                <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
            </div>
          </div>
        </div>

        <!-- Tabs -->
        <div class="bg-white rounded-lg shadow-sm mb-6">
          <div class="border-b">
            <nav class="flex space-x-8 px-6">
              <button
                (click)="activeTab = 'jobs'"
                [class.border-b-2]="activeTab === 'jobs'"
                [class.border-primary]="activeTab === 'jobs'"
                [class.text-primary]="activeTab === 'jobs'"
                class="py-4 px-1 font-medium transition-colors"
              >
                Job Postings
              </button>
              <button
                (click)="activeTab = 'applications'"
                [class.border-b-2]="activeTab === 'applications'"
                [class.border-primary]="activeTab === 'applications'"
                [class.text-primary]="activeTab === 'applications'"
                class="py-4 px-1 font-medium transition-colors relative"
              >
                Applications
                <span *ngIf="stats.newApplications > 0" class="ml-2 px-2 py-0.5 bg-red-500 text-white text-xs rounded-full">
                  {{stats.newApplications}}
                </span>
              </button>
              <button
                (click)="activeTab = 'analytics'"
                [class.border-b-2]="activeTab === 'analytics'"
                [class.border-primary]="activeTab === 'analytics'"
                [class.text-primary]="activeTab === 'analytics'"
                class="py-4 px-1 font-medium transition-colors"
              >
                Analytics
              </button>
              <button
                (click)="activeTab = 'candidates'"
                [class.border-b-2]="activeTab === 'candidates'"
                [class.border-primary]="activeTab === 'candidates'"
                [class.text-primary]="activeTab === 'candidates'"
                class="py-4 px-1 font-medium transition-colors"
              >
                Candidate Pool
              </button>
            </nav>
          </div>
        </div>

        <!-- Job Postings Tab -->
        <div *ngIf="activeTab === 'jobs'" class="space-y-6">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-xl font-semibold">Your Job Postings</h2>
            <a routerLink="/post-job" class="btn btn-primary">
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
              </svg>
              Post New Job
            </a>
          </div>

          <div class="bg-white rounded-lg shadow-sm overflow-hidden">
            <table class="w-full">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Job Title
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Applications
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Views
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Posted Date
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr *ngFor="let job of employerJobs$ | async">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div class="text-sm font-medium text-gray-900">{{job.title}}</div>
                      <div class="text-sm text-gray-500">{{job.location}}</div>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                          [ngClass]="getJobStatusClass(job)">
                      {{getJobStatus(job)}}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {{job.applications || 0}}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {{job.views || 0}}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{job.postedDate | date: 'MMM d, yyyy'}}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button (click)="editJob(job)" class="text-indigo-600 hover:text-indigo-900 mr-3">
                      Edit
                    </button>
                    <button (click)="viewApplications(job)" class="text-green-600 hover:text-green-900 mr-3">
                      Applications
                    </button>
                    <button (click)="toggleJobStatus(job)" class="text-yellow-600 hover:text-yellow-900 mr-3">
                      {{job.isActive ? 'Pause' : 'Activate'}}
                    </button>
                    <button (click)="deleteJob(job)" class="text-red-600 hover:text-red-900">
                      Delete
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Applications Tab -->
        <div *ngIf="activeTab === 'applications'" class="space-y-6">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-xl font-semibold">Applications</h2>
            <div class="flex gap-2">
              <select [(ngModel)]="applicationFilter" (change)="filterApplications()" class="px-4 py-2 border rounded-lg">
                <option value="all">All Applications</option>
                <option value="new">New</option>
                <option value="reviewing">Reviewing</option>
                <option value="shortlisted">Shortlisted</option>
                <option value="interviewed">Interviewed</option>
                <option value="rejected">Rejected</option>
                <option value="hired">Hired</option>
              </select>
              <input
                type="text"
                [(ngModel)]="searchQuery"
                (input)="searchApplications()"
                placeholder="Search candidates..."
                class="px-4 py-2 border rounded-lg"
              >
            </div>
          </div>

          <div class="grid grid-cols-1 gap-4">
            <div
              *ngFor="let application of filteredApplications$ | async"
              class="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
            >
              <div class="flex justify-between items-start">
                <div class="flex-1">
                  <div class="flex items-start justify-between mb-3">
                    <div>
                      <h3 class="text-lg font-semibold">{{application.applicantName}}</h3>
                      <p class="text-sm text-gray-600">Applied for: {{application.jobTitle}}</p>
                      <p class="text-xs text-gray-500">{{application.appliedDate | date: 'MMM d, yyyy h:mm a'}}</p>
                    </div>
                    <span
                      class="px-3 py-1 text-xs font-semibold rounded-full"
                      [ngClass]="getApplicationStatusClass(application.status)"
                    >
                      {{application.status}}
                    </span>
                  </div>

                  <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <p class="text-sm text-gray-600">Email</p>
                      <p class="text-sm font-medium">{{application.applicantEmail}}</p>
                    </div>
                    <div>
                      <p class="text-sm text-gray-600">Phone</p>
                      <p class="text-sm font-medium">{{application.applicantPhone}}</p>
                    </div>
                    <div *ngIf="application.expectedSalary">
                      <p class="text-sm text-gray-600">Expected Salary</p>
                      <p class="text-sm font-medium">{{application.expectedSalary}}</p>
                    </div>
                  </div>

                  <div class="mb-4">
                    <p class="text-sm text-gray-600 mb-2">Cover Letter</p>
                    <p class="text-sm text-gray-700 line-clamp-3">{{application.coverLetter}}</p>
                  </div>

                  <div class="flex items-center gap-3">
                    <button
                      (click)="viewResume(application)"
                      class="text-sm text-blue-600 hover:text-blue-800 flex items-center"
                    >
                      <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                      </svg>
                      View Resume
                    </button>
                    <a
                      *ngIf="application.linkedIn"
                      [href]="application.linkedIn"
                      target="_blank"
                      class="text-sm text-blue-600 hover:text-blue-800 flex items-center"
                    >
                      <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                      </svg>
                      LinkedIn
                    </a>
                    <a
                      *ngIf="application.portfolio"
                      [href]="application.portfolio"
                      target="_blank"
                      class="text-sm text-blue-600 hover:text-blue-800 flex items-center"
                    >
                      <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"></path>
                      </svg>
                      Portfolio
                    </a>
                  </div>

                  <div class="mt-4 pt-4 border-t flex items-center justify-between">
                    <div class="flex items-center gap-2">
                      <select
                        [(ngModel)]="application.status"
                        (change)="updateApplicationStatus(application)"
                        class="px-3 py-1 border rounded text-sm"
                      >
                        <option value="new">New</option>
                        <option value="reviewing">Reviewing</option>
                        <option value="shortlisted">Shortlisted</option>
                        <option value="interviewed">Interviewed</option>
                        <option value="rejected">Rejected</option>
                        <option value="hired">Hired</option>
                      </select>
                      <button
                        (click)="rateApplication(application)"
                        class="flex items-center gap-1 px-3 py-1 border rounded text-sm hover:bg-gray-50"
                      >
                        <svg
                          *ngFor="let star of [1,2,3,4,5]"
                          class="w-4 h-4"
                          [class.text-yellow-400]="star <= (application.rating || 0)"
                          [class.text-gray-300]="star > (application.rating || 0)"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                        </svg>
                      </button>
                    </div>
                    <div class="flex items-center gap-2">
                      <button
                        (click)="scheduleInterview(application)"
                        class="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                      >
                        Schedule Interview
                      </button>
                      <button
                        (click)="sendMessage(application)"
                        class="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                      >
                        Send Message
                      </button>
                      <button
                        (click)="addNote(application)"
                        class="px-3 py-1 border rounded text-sm hover:bg-gray-50"
                      >
                        Add Note
                      </button>
                    </div>
                  </div>

                  <div *ngIf="application.notes" class="mt-3 p-3 bg-yellow-50 rounded">
                    <p class="text-xs text-gray-600 mb-1">Notes:</p>
                    <p class="text-sm">{{application.notes}}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Analytics Tab -->
        <div *ngIf="activeTab === 'analytics'" class="space-y-6">
          <h2 class="text-xl font-semibold mb-4">Recruitment Analytics</h2>

          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <!-- Application Sources -->
            <div class="bg-white rounded-lg shadow-sm p-6">
              <h3 class="font-semibold mb-4">Application Sources</h3>
              <div class="space-y-3">
                <div class="flex items-center justify-between">
                  <span class="text-sm">Direct</span>
                  <div class="flex items-center gap-2">
                    <div class="w-32 bg-gray-200 rounded-full h-2">
                      <div class="bg-blue-600 h-2 rounded-full" style="width: 45%"></div>
                    </div>
                    <span class="text-sm font-medium">45%</span>
                  </div>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-sm">Job Boards</span>
                  <div class="flex items-center gap-2">
                    <div class="w-32 bg-gray-200 rounded-full h-2">
                      <div class="bg-green-600 h-2 rounded-full" style="width: 30%"></div>
                    </div>
                    <span class="text-sm font-medium">30%</span>
                  </div>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-sm">Referrals</span>
                  <div class="flex items-center gap-2">
                    <div class="w-32 bg-gray-200 rounded-full h-2">
                      <div class="bg-yellow-600 h-2 rounded-full" style="width: 15%"></div>
                    </div>
                    <span class="text-sm font-medium">15%</span>
                  </div>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-sm">Social Media</span>
                  <div class="flex items-center gap-2">
                    <div class="w-32 bg-gray-200 rounded-full h-2">
                      <div class="bg-purple-600 h-2 rounded-full" style="width: 10%"></div>
                    </div>
                    <span class="text-sm font-medium">10%</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Conversion Funnel -->
            <div class="bg-white rounded-lg shadow-sm p-6">
              <h3 class="font-semibold mb-4">Conversion Funnel</h3>
              <div class="space-y-3">
                <div class="flex items-center justify-between p-3 bg-blue-50 rounded">
                  <span class="text-sm">Views</span>
                  <span class="font-medium">1,234</span>
                </div>
                <div class="flex items-center justify-between p-3 bg-blue-100 rounded" style="width: 80%">
                  <span class="text-sm">Applications</span>
                  <span class="font-medium">456</span>
                </div>
                <div class="flex items-center justify-between p-3 bg-blue-200 rounded" style="width: 60%">
                  <span class="text-sm">Shortlisted</span>
                  <span class="font-medium">89</span>
                </div>
                <div class="flex items-center justify-between p-3 bg-blue-300 rounded" style="width: 40%">
                  <span class="text-sm">Interviewed</span>
                  <span class="font-medium">34</span>
                </div>
                <div class="flex items-center justify-between p-3 bg-blue-400 text-white rounded" style="width: 20%">
                  <span class="text-sm">Hired</span>
                  <span class="font-medium">12</span>
                </div>
              </div>
            </div>

            <!-- Time to Hire Trends -->
            <div class="bg-white rounded-lg shadow-sm p-6">
              <h3 class="font-semibold mb-4">Time to Hire Trends</h3>
              <div class="h-64 flex items-end justify-between gap-2">
                <div *ngFor="let month of ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']" class="flex-1">
                  <div class="bg-primary mb-2 rounded-t" [style.height.px]="Math.random() * 150 + 50"></div>
                  <p class="text-xs text-center">{{month}}</p>
                </div>
              </div>
            </div>

            <!-- Top Performing Jobs -->
            <div class="bg-white rounded-lg shadow-sm p-6">
              <h3 class="font-semibold mb-4">Top Performing Jobs</h3>
              <div class="space-y-3">
                <div class="flex items-center justify-between">
                  <div>
                    <p class="font-medium">Senior Developer</p>
                    <p class="text-xs text-gray-500">234 applications</p>
                  </div>
                  <span class="text-green-600 font-medium">+45%</span>
                </div>
                <div class="flex items-center justify-between">
                  <div>
                    <p class="font-medium">Product Manager</p>
                    <p class="text-xs text-gray-500">189 applications</p>
                  </div>
                  <span class="text-green-600 font-medium">+32%</span>
                </div>
                <div class="flex items-center justify-between">
                  <div>
                    <p class="font-medium">UX Designer</p>
                    <p class="text-xs text-gray-500">156 applications</p>
                  </div>
                  <span class="text-green-600 font-medium">+28%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Candidate Pool Tab -->
        <div *ngIf="activeTab === 'candidates'" class="space-y-6">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-xl font-semibold">Talent Pool</h2>
            <button class="btn btn-primary">
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
              </svg>
              Add Candidate
            </button>
          </div>

          <div class="bg-white rounded-lg shadow-sm p-6">
            <div class="mb-4">
              <input
                type="text"
                placeholder="Search talent pool..."
                class="w-full px-4 py-2 border rounded-lg"
              >
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div *ngFor="let candidate of talentPool" class="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div class="flex items-start justify-between mb-3">
                  <div class="flex items-center gap-3">
                    <div class="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                      <span class="text-lg font-semibold">{{candidate.name.charAt(0)}}</span>
                    </div>
                    <div>
                      <h4 class="font-medium">{{candidate.name}}</h4>
                      <p class="text-sm text-gray-600">{{candidate.title}}</p>
                    </div>
                  </div>
                  <div class="flex">
                    <svg
                      *ngFor="let star of [1,2,3,4,5]"
                      class="w-4 h-4"
                      [class.text-yellow-400]="star <= candidate.rating"
                      [class.text-gray-300]="star > candidate.rating"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                    </svg>
                  </div>
                </div>

                <div class="mb-3">
                  <div class="flex flex-wrap gap-1">
                    <span *ngFor="let skill of candidate.skills.slice(0, 3)" class="px-2 py-0.5 bg-gray-100 text-xs rounded">
                      {{skill}}
                    </span>
                    <span *ngIf="candidate.skills.length > 3" class="px-2 py-0.5 bg-gray-100 text-xs rounded">
                      +{{candidate.skills.length - 3}}
                    </span>
                  </div>
                </div>

                <div class="text-sm text-gray-600 mb-3">
                  <p>{{candidate.experience}} years experience</p>
                  <p>{{candidate.location}}</p>
                </div>

                <div class="flex gap-2">
                  <button class="flex-1 px-3 py-1 bg-primary text-white rounded text-sm hover:bg-primary-dark">
                    Contact
                  </button>
                  <button class="flex-1 px-3 py-1 border rounded text-sm hover:bg-gray-50">
                    View Profile
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .line-clamp-3 {
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
  `]
})
export class EmployerDashboardComponent implements OnInit {
  activeTab = 'jobs';
  employerJobs$!: Observable<Job[]>;
  filteredApplications$!: Observable<JobApplication[]>;

  stats: DashboardStats = {
    activeJobs: 8,
    totalApplications: 234,
    newApplications: 12,
    shortlistedCandidates: 23,
    hiredThisMonth: 4,
    averageTimeToHire: 21,
    applicationRate: 37,
    viewsThisWeek: 1234
  };

  applications: JobApplication[] = [];
  applicationFilter = 'all';
  searchQuery = '';
  Math = Math;

  talentPool = [
    {
      name: 'John Smith',
      title: 'Senior Developer',
      skills: ['JavaScript', 'React', 'Node.js', 'AWS', 'Docker'],
      experience: 5,
      location: 'New York, NY',
      rating: 5
    },
    {
      name: 'Sarah Johnson',
      title: 'Product Manager',
      skills: ['Product Strategy', 'Agile', 'User Research', 'Analytics'],
      experience: 7,
      location: 'San Francisco, CA',
      rating: 4
    },
    {
      name: 'Michael Chen',
      title: 'UX Designer',
      skills: ['Figma', 'User Research', 'Prototyping', 'Design Systems'],
      experience: 4,
      location: 'Austin, TX',
      rating: 5
    }
  ];

  constructor(
    private authService: AuthService,
    private jobService: JobService
  ) {}

  ngOnInit() {
    // Get employer's jobs
    this.employerJobs$ = this.jobService.jobs$.pipe(
      map(jobs => jobs.filter(job => job.isPremium)) // Filter for demo
    );

    // Generate mock applications
    this.generateMockApplications();
    this.filteredApplications$ = of(this.applications);
  }

  generateMockApplications() {
    this.applications = [
      {
        id: '1',
        jobId: '1',
        jobTitle: 'Senior Frontend Developer',
        applicantName: 'John Doe',
        applicantEmail: 'john.doe@email.com',
        applicantPhone: '+1 234-567-8900',
        coverLetter: 'I am excited to apply for this position. With over 5 years of experience in frontend development...',
        appliedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        status: 'new',
        linkedIn: 'https://linkedin.com/in/johndoe',
        portfolio: 'https://johndoe.dev',
        expectedSalary: '$120,000 - $150,000',
        rating: 4
      },
      {
        id: '2',
        jobId: '2',
        jobTitle: 'Product Manager',
        applicantName: 'Jane Smith',
        applicantEmail: 'jane.smith@email.com',
        applicantPhone: '+1 234-567-8901',
        coverLetter: 'As an experienced product manager with a proven track record...',
        appliedDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        status: 'shortlisted',
        linkedIn: 'https://linkedin.com/in/janesmith',
        expectedSalary: '$130,000 - $160,000',
        rating: 5,
        notes: 'Strong candidate, schedule interview ASAP'
      },
      {
        id: '3',
        jobId: '1',
        jobTitle: 'Senior Frontend Developer',
        applicantName: 'Bob Wilson',
        applicantEmail: 'bob.wilson@email.com',
        applicantPhone: '+1 234-567-8902',
        coverLetter: 'I believe my skills and experience make me a perfect fit for this role...',
        appliedDate: new Date(),
        status: 'reviewing',
        portfolio: 'https://bobwilson.com',
        expectedSalary: '$110,000 - $140,000',
        rating: 3
      }
    ];
  }

  getJobStatus(job: Job): string {
    if (job.applicationDeadline && job.applicationDeadline < new Date()) {
      return 'Expired';
    }
    return job.isActive !== false ? 'Active' : 'Paused';
  }

  getJobStatusClass(job: Job): string {
    const status = this.getJobStatus(job);
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800';
      case 'Paused':
        return 'bg-yellow-100 text-yellow-800';
      case 'Expired':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  getApplicationStatusClass(status: string): string {
    switch (status) {
      case 'new':
        return 'bg-blue-100 text-blue-800';
      case 'reviewing':
        return 'bg-yellow-100 text-yellow-800';
      case 'shortlisted':
        return 'bg-green-100 text-green-800';
      case 'interviewed':
        return 'bg-purple-100 text-purple-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'hired':
        return 'bg-green-500 text-white';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  editJob(job: Job) {
    console.log('Edit job:', job);
    // Navigate to edit job page
  }

  viewApplications(job: Job) {
    this.activeTab = 'applications';
    // Filter applications for this job
  }

  toggleJobStatus(job: Job) {
    job.isActive = !job.isActive;
    // Update job status in service
  }

  deleteJob(job: Job) {
    if (confirm('Are you sure you want to delete this job posting?')) {
      // Delete job
      console.log('Delete job:', job);
    }
  }

  filterApplications() {
    if (this.applicationFilter === 'all') {
      this.filteredApplications$ = of(this.applications);
    } else {
      this.filteredApplications$ = of(
        this.applications.filter(app => app.status === this.applicationFilter)
      );
    }
  }

  searchApplications() {
    if (!this.searchQuery) {
      this.filteredApplications$ = of(this.applications);
    } else {
      const query = this.searchQuery.toLowerCase();
      this.filteredApplications$ = of(
        this.applications.filter(app =>
          app.applicantName.toLowerCase().includes(query) ||
          app.applicantEmail.toLowerCase().includes(query) ||
          app.jobTitle.toLowerCase().includes(query)
        )
      );
    }
  }

  viewResume(application: JobApplication) {
    console.log('View resume:', application);
    // Open resume viewer
  }

  updateApplicationStatus(application: JobApplication) {
    console.log('Update status:', application);
    // Update status in backend
  }

  rateApplication(application: JobApplication) {
    const rating = prompt('Rate this application (1-5):');
    if (rating) {
      application.rating = parseInt(rating);
    }
  }

  scheduleInterview(application: JobApplication) {
    console.log('Schedule interview:', application);
    // Open interview scheduler
  }

  sendMessage(application: JobApplication) {
    console.log('Send message:', application);
    // Open message composer
  }

  addNote(application: JobApplication) {
    const note = prompt('Add a note:');
    if (note) {
      application.notes = note;
    }
  }
}
