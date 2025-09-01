import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService, User, Job, Report, Analytics } from '../../services/admin.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen bg-gray-50">
      <!-- Header -->
      <div class="bg-white shadow-sm border-b">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="py-6">
            <h1 class="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p class="mt-2 text-gray-600">Manage users, jobs, and platform analytics</p>
          </div>
        </div>
      </div>

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <!-- Analytics Overview -->
        <div class="mb-8">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">Platform Analytics</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <!-- Total Users -->
            <div class="bg-white rounded-lg shadow p-6">
              <div class="flex items-center">
                <div class="flex-shrink-0 bg-blue-100 rounded-lg p-3">
                  <svg class="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
                  </svg>
                </div>
                <div class="ml-4">
                  <p class="text-sm font-medium text-gray-500">Total Users</p>
                  <p class="text-2xl font-bold text-gray-900">{{ (analytics()?.totalUsers || 0) | number }}</p>
                  <p class="text-sm text-green-600">{{ (analytics()?.activeUsers || 0) | number }} active</p>
                </div>
              </div>
            </div>

            <!-- Total Jobs -->
            <div class="bg-white rounded-lg shadow p-6">
              <div class="flex items-center">
                <div class="flex-shrink-0 bg-green-100 rounded-lg p-3">
                  <svg class="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                  </svg>
                </div>
                <div class="ml-4">
                  <p class="text-sm font-medium text-gray-500">Total Jobs</p>
                  <p class="text-2xl font-bold text-gray-900">{{ (analytics()?.totalJobs || 0) | number }}</p>
                  <p class="text-sm text-green-600">{{ (analytics()?.activeJobs || 0) | number }} active</p>
                </div>
              </div>
            </div>

            <!-- Applications -->
            <div class="bg-white rounded-lg shadow p-6">
              <div class="flex items-center">
                <div class="flex-shrink-0 bg-purple-100 rounded-lg p-3">
                  <svg class="h-6 w-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                  </svg>
                </div>
                <div class="ml-4">
                  <p class="text-sm font-medium text-gray-500">Applications</p>
                  <p class="text-2xl font-bold text-gray-900">{{ (analytics()?.totalApplications || 0) | number }}</p>
                  <p class="text-sm text-blue-600">+12% this month</p>
                </div>
              </div>
            </div>

            <!-- Revenue -->
            <div class="bg-white rounded-lg shadow p-6">
              <div class="flex items-center">
                <div class="flex-shrink-0 bg-yellow-100 rounded-lg p-3">
                  <svg class="h-6 w-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <div class="ml-4">
                  <p class="text-sm font-medium text-gray-500">Revenue</p>
                  <p class="text-2xl font-bold text-gray-900">{{ (analytics()?.revenue?.monthly || 0) | currency }}</p>
                  <p class="text-sm text-green-600">+8% from last month</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Subscription Distribution -->
        <div class="mb-8">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">Subscription Distribution</h2>
          <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div class="bg-white rounded-lg shadow p-4">
              <h3 class="text-sm font-medium text-gray-500 mb-2">Free</h3>
              <div class="text-2xl font-bold text-gray-900">{{ (analytics()?.subscriptions?.free || 0) | number }}</div>
              <div class="mt-2 flex items-center text-sm text-gray-600">
                <span class="text-green-500 mr-1">↑</span> 5% from last month
              </div>
            </div>
            <div class="bg-white rounded-lg shadow p-4">
              <h3 class="text-sm font-medium text-gray-500 mb-2">Basic</h3>
              <div class="text-2xl font-bold text-blue-600">{{ (analytics()?.subscriptions?.basic || 0) | number }}</div>
              <div class="mt-2 flex items-center text-sm text-gray-600">
                <span class="text-green-500 mr-1">↑</span> 12% from last month
              </div>
            </div>
            <div class="bg-white rounded-lg shadow p-4">
              <h3 class="text-sm font-medium text-gray-500 mb-2">Professional</h3>
              <div class="text-2xl font-bold text-purple-600">{{ (analytics()?.subscriptions?.professional || 0) | number }}</div>
              <div class="mt-2 flex items-center text-sm text-gray-600">
                <span class="text-green-500 mr-1">↑</span> 18% from last month
              </div>
            </div>
            <div class="bg-white rounded-lg shadow p-4">
              <h3 class="text-sm font-medium text-gray-500 mb-2">Enterprise</h3>
              <div class="text-2xl font-bold text-yellow-600">{{ (analytics()?.subscriptions?.enterprise || 0) | number }}</div>
              <div class="mt-2 flex items-center text-sm text-gray-600">
                <span class="text-green-500 mr-1">↑</span> 25% from last month
              </div>
            </div>
          </div>
        </div>

        <!-- Tabs -->
        <div class="mb-4 border-b border-gray-200">
          <nav class="-mb-px flex space-x-8">
            <button
              (click)="activeTab.set('users')"
              [class.border-blue-500]="activeTab() === 'users'"
              [class.text-blue-600]="activeTab() === 'users'"
              [class.border-transparent]="activeTab() !== 'users'"
              [class.text-gray-500]="activeTab() !== 'users'"
              class="whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm hover:text-gray-700 hover:border-gray-300"
            >
              Users Management
            </button>
            <button
              (click)="activeTab.set('jobs')"
              [class.border-blue-500]="activeTab() === 'jobs'"
              [class.text-blue-600]="activeTab() === 'jobs'"
              [class.border-transparent]="activeTab() !== 'jobs'"
              [class.text-gray-500]="activeTab() !== 'jobs'"
              class="whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm hover:text-gray-700 hover:border-gray-300"
            >
              Jobs Moderation
            </button>
            <button
              (click)="activeTab.set('reports')"
              [class.border-blue-500]="activeTab() === 'reports'"
              [class.text-blue-600]="activeTab() === 'reports'"
              [class.border-transparent]="activeTab() !== 'reports'"
              [class.text-gray-500]="activeTab() !== 'reports'"
              class="whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm hover:text-gray-700 hover:border-gray-300"
            >
              Reports & Complaints
            </button>
          </nav>
        </div>

        <!-- Users Management -->
        <div *ngIf="activeTab() === 'users'" class="bg-white rounded-lg shadow">
          <div class="px-4 py-5 sm:p-6">
            <div class="flex justify-between items-center mb-4">
              <h3 class="text-lg font-medium text-gray-900">User Management</h3>
              <div class="flex space-x-2">
                <input
                  type="text"
                  [(ngModel)]="searchTerm"
                  placeholder="Search users..."
                  class="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                <select [(ngModel)]="filterRole" class="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">All Roles</option>
                  <option value="candidate">Candidate</option>
                  <option value="employer">Employer</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>

            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Login</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr *ngFor="let user of filteredUsers()">
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div class="text-sm font-medium text-gray-900">{{ user.name }}</div>
                        <div class="text-sm text-gray-500">{{ user.email }}</div>
                      </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span [class.bg-blue-100]="user.role === 'candidate'"
                            [class.text-blue-800]="user.role === 'candidate'"
                            [class.bg-green-100]="user.role === 'employer'"
                            [class.text-green-800]="user.role === 'employer'"
                            [class.bg-purple-100]="user.role === 'admin'"
                            [class.text-purple-800]="user.role === 'admin'"
                            class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full">
                        {{ user.role }}
                      </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span [class.bg-green-100]="user.status === 'active'"
                            [class.text-green-800]="user.status === 'active'"
                            [class.bg-red-100]="user.status === 'suspended'"
                            [class.text-red-800]="user.status === 'suspended'"
                            [class.bg-yellow-100]="user.status === 'pending'"
                            [class.text-yellow-800]="user.status === 'pending'"
                            class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full">
                        {{ user.status }}
                      </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {{ user.createdAt | date:'shortDate' }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {{ user.lastLogin | date:'short' }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div class="flex space-x-2">
                        <button (click)="viewUserDetails(user)" class="text-blue-600 hover:text-blue-900">View</button>
                        <button *ngIf="user.status === 'active'" (click)="suspendUser(user.id)" class="text-yellow-600 hover:text-yellow-900">Suspend</button>
                        <button *ngIf="user.status === 'suspended'" (click)="activateUser(user.id)" class="text-green-600 hover:text-green-900">Activate</button>
                        <button (click)="deleteUser(user.id)" class="text-red-600 hover:text-red-900">Delete</button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- Jobs Moderation -->
        <div *ngIf="activeTab() === 'jobs'" class="bg-white rounded-lg shadow">
          <div class="px-4 py-5 sm:p-6">
            <div class="flex justify-between items-center mb-4">
              <h3 class="text-lg font-medium text-gray-900">Job Postings Moderation</h3>
              <div class="flex space-x-2">
                <select [(ngModel)]="filterJobStatus" class="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            </div>

            <div class="space-y-4">
              <div *ngFor="let job of filteredJobs()" class="border rounded-lg p-4 hover:bg-gray-50">
                <div class="flex justify-between items-start">
                  <div class="flex-1">
                    <div class="flex items-center space-x-2">
                      <h4 class="text-lg font-medium text-gray-900">{{ job.title }}</h4>
                      <span [class.bg-yellow-100]="job.status === 'pending'"
                            [class.text-yellow-800]="job.status === 'pending'"
                            [class.bg-green-100]="job.status === 'approved'"
                            [class.text-green-800]="job.status === 'approved'"
                            [class.bg-red-100]="job.status === 'rejected'"
                            [class.text-red-800]="job.status === 'rejected'"
                            class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full">
                        {{ job.status }}
                      </span>
                    </div>
                    <p class="text-sm text-gray-600 mt-1">{{ job.company }} • {{ job.location }}</p>
                    <p class="text-sm text-gray-500 mt-2">{{ job.description }}</p>
                    <div class="flex items-center space-x-4 mt-3 text-sm text-gray-500">
                      <span>Posted: {{ job.postedDate | date:'shortDate' }}</span>
                      <span>Views: {{ job.views | number }}</span>
                      <span>Applications: {{ job.applications | number }}</span>
                      <span>Category: {{ job.category }}</span>
                    </div>
                  </div>
                  <div class="flex flex-col space-y-2 ml-4">
                    <button (click)="viewJobDetails(job)" class="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700">View Details</button>
                    <button *ngIf="job.status === 'pending'" (click)="approveJob(job.id)" class="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700">Approve</button>
                    <button *ngIf="job.status === 'pending'" (click)="rejectJob(job.id)" class="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700">Reject</button>
                    <button (click)="deleteJob(job.id)" class="px-3 py-1 text-sm bg-gray-600 text-white rounded hover:bg-gray-700">Delete</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Reports & Complaints -->
        <div *ngIf="activeTab() === 'reports'" class="bg-white rounded-lg shadow">
          <div class="px-4 py-5 sm:p-6">
            <div class="flex justify-between items-center mb-4">
              <h3 class="text-lg font-medium text-gray-900">Reports & Complaints</h3>
              <div class="flex space-x-2">
                <select [(ngModel)]="filterReportStatus" class="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">All Reports</option>
                  <option value="pending">Pending</option>
                  <option value="reviewed">Reviewed</option>
                  <option value="resolved">Resolved</option>
                </select>
              </div>
            </div>

            <div class="space-y-4">
              <div *ngFor="let report of filteredReports()" class="border rounded-lg p-4 hover:bg-gray-50">
                <div class="flex justify-between items-start">
                  <div class="flex-1">
                    <div class="flex items-center space-x-2">
                      <span [class.bg-blue-100]="report.type === 'user'"
                            [class.text-blue-800]="report.type === 'user'"
                            [class.bg-green-100]="report.type === 'job'"
                            [class.text-green-800]="report.type === 'job'"
                            [class.bg-purple-100]="report.type === 'payment'"
                            [class.text-purple-800]="report.type === 'payment'"
                            class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full">
                        {{ report.type | uppercase }} REPORT
                      </span>
                      <span [class.bg-yellow-100]="report.status === 'pending'"
                            [class.text-yellow-800]="report.status === 'pending'"
                            [class.bg-blue-100]="report.status === 'reviewed'"
                            [class.text-blue-800]="report.status === 'reviewed'"
                            [class.bg-green-100]="report.status === 'resolved'"
                            [class.text-green-800]="report.status === 'resolved'"
                            class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full">
                        {{ report.status }}
                      </span>
                    </div>
                    <p class="text-sm font-medium text-gray-900 mt-2">{{ report.reason }}</p>
                    <div class="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                      <span>Reported by: {{ report.reportedBy }}</span>
                      <span>Item: {{ report.reportedItem }}</span>
                      <span>Date: {{ report.createdAt | date:'short' }}</span>
                    </div>
                  </div>
                  <div class="flex flex-col space-y-2 ml-4">
                    <button (click)="viewReportDetails(report)" class="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700">View Details</button>
                    <button *ngIf="report.status !== 'resolved'" (click)="resolveReport(report.id)" class="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700">Mark Resolved</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Job Details Modal -->
      <div *ngIf="selectedJob()" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
        <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
          <div class="mt-3">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Job Details</h3>
            <div class="space-y-3">
              <div>
                <label class="block text-sm font-medium text-gray-700">Title</label>
                <p class="text-sm text-gray-900">{{ selectedJob()?.title }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Company</label>
                <p class="text-sm text-gray-900">{{ selectedJob()?.company }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Location</label>
                <p class="text-sm text-gray-900">{{ selectedJob()?.location }}</p>
              </div>
              <ng-container *ngIf="selectedJob()?.salaryRange">
                <div>
                  <label class="block text-sm font-medium text-gray-700">Salary Range</label>
                  <p class="text-sm text-gray-900">
                    {{ (selectedJob()?.salaryRange?.currency || '$') }}{{ (selectedJob()?.salaryRange?.min || 0) | number }} -
                    {{ (selectedJob()?.salaryRange?.currency || '$') }}{{ (selectedJob()?.salaryRange?.max || 0) | number }}
                  </p>
                </div>
              </ng-container>
              <div>
                <label class="block text-sm font-medium text-gray-700">Category</label>
                <p class="text-sm text-gray-900">{{ selectedJob()?.category }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Type</label>
                <p class="text-sm text-gray-900">{{ selectedJob()?.type }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Description</label>
                <p class="text-sm text-gray-900">{{ selectedJob()?.description }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Requirements</label>
                <ul class="text-sm text-gray-900 list-disc list-inside">
                  <li *ngFor="let req of selectedJob()?.requirements">{{ req }}</li>
                </ul>
              </div>
            </div>
            <div class="mt-4 flex justify-end space-x-2">
              <button (click)="selectedJob.set(null)" class="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400">Close</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Report Details Modal -->
      <div *ngIf="selectedReport()" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
        <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
          <div class="mt-3">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Report Details</h3>
            <div class="space-y-3">
              <div>
                <label class="block text-sm font-medium text-gray-700">Type</label>
                <p class="text-sm text-gray-900">{{ selectedReport()?.type | uppercase }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Reason</label>
                <p class="text-sm text-gray-900">{{ selectedReport()?.reason }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Status</label>
                <p class="text-sm text-gray-900">{{ selectedReport()?.status }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Reported By</label>
                <p class="text-sm text-gray-900">{{ selectedReport()?.reportedBy }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Reported Item</label>
                <p class="text-sm text-gray-900">{{ selectedReport()?.reportedItem }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Date</label>
                <p class="text-sm text-gray-900">{{ selectedReport()?.createdAt | date:'medium' }}</p>
              </div>

              <ng-container *ngIf="selectedReport()?.insights">
                <div>
                  <h5 class="text-sm font-medium text-gray-900 mb-2">Summary</h5>
                  <p class="text-sm text-gray-700">{{ (selectedReport()?.insights?.summary || '') }}</p>
                </div>
                <div>
                  <h5 class="text-sm font-medium text-gray-900 mb-2">Key Metrics</h5>
                  <div class="grid grid-cols-2 gap-4">
                    <div *ngFor="let metric of (selectedReport()?.insights?.keyMetrics || [])"
                         class="bg-gray-50 p-3 rounded-lg">
                      <p class="text-xs text-gray-500">{{ metric.label }}</p>
                      <p class="text-lg font-semibold">{{ metric.value }}</p>
                      <p class="text-xs" [class.text-green-600]="metric.trend === 'up'"
                         [class.text-red-600]="metric.trend === 'down'">
                        {{ metric.change }}
                      </p>
                    </div>
                  </div>
                </div>
                <div>
                  <h5 class="text-sm font-medium text-gray-900 mb-2">Recommendations</h5>
                  <ul class="space-y-1">
                    <li *ngFor="let recommendation of (selectedReport()?.insights?.recommendations || [])"
                        class="text-sm text-gray-700 flex items-start">
                      <span class="text-blue-500 mr-2">•</span>
                      {{ recommendation }}
                    </li>
                  </ul>
                </div>
              </ng-container>
            </div>
            <div class="mt-4 flex justify-end space-x-2">
              <button (click)="selectedReport.set(null)" class="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400">Close</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class AdminDashboardComponent implements OnInit {
  activeTab = signal<'users' | 'jobs' | 'reports'>('users');
  users = signal<User[]>([]);
  jobs = signal<Job[]>([]);
  reports = signal<Report[]>([]);
  analytics = signal<Analytics | null>(null);

  searchTerm = '';
  filterRole = '';
  filterJobStatus = '';
  filterReportStatus = '';

  selectedJob = signal<Job | null>(null);
  selectedReport = signal<Report | null>(null);

  filteredUsers = computed(() => {
    let filtered = this.users();
    if (this.searchTerm) {
      filtered = filtered.filter(u =>
        u.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
    if (this.filterRole) {
      filtered = filtered.filter(u => u.role === this.filterRole);
    }
    return filtered;
  });

  filteredJobs = computed(() => {
    let filtered = this.jobs();
    if (this.filterJobStatus) {
      filtered = filtered.filter(j => j.status === this.filterJobStatus);
    }
    return filtered;
  });

  filteredReports = computed(() => {
    let filtered = this.reports();
    if (this.filterReportStatus) {
      filtered = filtered.filter(r => r.status === this.filterReportStatus);
    }
    return filtered;
  });

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.adminService.getUsers().subscribe(users => this.users.set(users));
    this.adminService.getJobs().subscribe(jobs => this.jobs.set(jobs));
    this.adminService.getReports().subscribe(reports => this.reports.set(reports));
    this.adminService.getAnalytics().subscribe(analytics => this.analytics.set(analytics));
  }

  viewUserDetails(user: User): void {
    console.log('View user details:', user);
  }

  suspendUser(userId: string): void {
    this.adminService.suspendUser(userId).subscribe(() => {
      this.loadData();
    });
  }

  activateUser(userId: string): void {
    this.adminService.activateUser(userId).subscribe(() => {
      this.loadData();
    });
  }

  deleteUser(userId: string): void {
    if (confirm('Are you sure you want to delete this user?')) {
      this.adminService.deleteUser(userId).subscribe(() => {
        this.loadData();
      });
    }
  }

  viewJobDetails(job: Job): void {
    this.selectedJob.set(job);
  }

  approveJob(jobId: string): void {
    this.adminService.approveJob(jobId).subscribe(() => {
      this.loadData();
    });
  }

  rejectJob(jobId: string): void {
    this.adminService.rejectJob(jobId).subscribe(() => {
      this.loadData();
    });
  }

  deleteJob(jobId: string): void {
    if (confirm('Are you sure you want to delete this job?')) {
      this.adminService.deleteJob(jobId).subscribe(() => {
        this.loadData();
      });
    }
  }

  viewReportDetails(report: Report): void {
    this.selectedReport.set(report);
  }

  resolveReport(reportId: string): void {
    this.adminService.resolveReport(reportId).subscribe(() => {
      this.loadData();
    });
  }
}
