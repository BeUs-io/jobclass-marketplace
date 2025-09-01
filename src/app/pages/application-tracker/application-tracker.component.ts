import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApplicationTrackingService, Application } from '../../services/application-tracking.service';

@Component({
  selector: 'app-application-tracker',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen bg-gray-50 py-8">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="mb-8">
          <h1 class="text-3xl font-bold text-gray-900">Application Tracker</h1>
          <p class="mt-2 text-gray-600">Track and manage all your job applications in one place</p>
        </div>

        <!-- Stats Overview -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div class="bg-white rounded-lg shadow p-6">
            <div class="text-sm font-medium text-gray-500">Total Applications</div>
            <div class="mt-2 text-3xl font-bold text-gray-900">{{ applications().length }}</div>
          </div>
          <div class="bg-white rounded-lg shadow p-6">
            <div class="text-sm font-medium text-gray-500">Under Review</div>
            <div class="mt-2 text-3xl font-bold text-blue-600">
              {{ getStatusCount('under-review') }}
            </div>
          </div>
          <div class="bg-white rounded-lg shadow p-6">
            <div class="text-sm font-medium text-gray-500">Interviews</div>
            <div class="mt-2 text-3xl font-bold text-purple-600">
              {{ getStatusCount('interview') }}
            </div>
          </div>
          <div class="bg-white rounded-lg shadow p-6">
            <div class="text-sm font-medium text-gray-500">Offers</div>
            <div class="mt-2 text-3xl font-bold text-green-600">
              {{ getStatusCount('offer') }}
            </div>
          </div>
        </div>

        <!-- Filter Tabs -->
        <div class="mb-6 border-b border-gray-200">
          <nav class="-mb-px flex space-x-8">
            <button
              *ngFor="let filter of filters"
              (click)="activeFilter.set(filter.value)"
              [class.border-blue-500]="activeFilter() === filter.value"
              [class.text-blue-600]="activeFilter() === filter.value"
              [class.border-transparent]="activeFilter() !== filter.value"
              [class.text-gray-500]="activeFilter() !== filter.value"
              class="whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm hover:text-gray-700 hover:border-gray-300"
            >
              {{ filter.label }}
              <span class="ml-2 px-2 py-1 text-xs rounded-full"
                    [class.bg-blue-100]="activeFilter() === filter.value"
                    [class.text-blue-600]="activeFilter() === filter.value"
                    [class.bg-gray-100]="activeFilter() !== filter.value"
                    [class.text-gray-600]="activeFilter() !== filter.value">
                {{ getFilteredApplications(filter.value).length }}
              </span>
            </button>
          </nav>
        </div>

        <!-- Applications List -->
        <div class="space-y-4">
          <div *ngFor="let app of getFilteredApplications(activeFilter())"
               class="bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
            <div class="p-6">
              <div class="flex justify-between items-start">
                <div class="flex-1">
                  <div class="flex items-center">
                    <h3 class="text-lg font-semibold text-gray-900">{{ app.jobTitle }}</h3>
                    <span class="ml-3 px-3 py-1 text-xs font-medium rounded-full"
                          [class.bg-gray-100]="app.status === 'submitted'"
                          [class.text-gray-800]="app.status === 'submitted'"
                          [class.bg-blue-100]="app.status === 'under-review'"
                          [class.text-blue-800]="app.status === 'under-review'"
                          [class.bg-purple-100]="app.status === 'interview'"
                          [class.text-purple-800]="app.status === 'interview'"
                          [class.bg-green-100]="app.status === 'offer'"
                          [class.text-green-800]="app.status === 'offer'"
                          [class.bg-red-100]="app.status === 'rejected'"
                          [class.text-red-800]="app.status === 'rejected'">
                      {{ getStatusLabel(app.status) }}
                    </span>
                  </div>
                  <p class="mt-1 text-sm text-gray-600">{{ app.company }}</p>
                  <p class="mt-1 text-xs text-gray-500">Applied {{ app.appliedDate | date:'mediumDate' }}</p>
                </div>
                <button (click)="toggleExpanded(app.id)"
                        class="text-gray-400 hover:text-gray-600">
                  <svg class="h-6 w-6 transition-transform"
                       [class.rotate-180]="expandedApplications().includes(app.id)"
                       fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </button>
              </div>

              <!-- Expanded Details -->
              <div *ngIf="expandedApplications().includes(app.id)" class="mt-6 border-t pt-6">
                <!-- Timeline -->
                <div class="mb-6">
                  <h4 class="text-sm font-semibold text-gray-900 mb-3">Application Timeline</h4>
                  <div class="relative">
                    <div class="absolute left-2 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                    <div class="space-y-3">
                      <div *ngFor="let event of app.timeline" class="flex items-start">
                        <div class="relative z-10 flex items-center justify-center w-4 h-4 bg-white border-2 rounded-full"
                             [class.border-green-500]="event.type === 'offer-made'"
                             [class.border-blue-500]="event.type === 'interview-scheduled' || event.type === 'interview-completed'"
                             [class.border-gray-400]="event.type === 'submitted' || event.type === 'viewed' || event.type === 'shortlisted'"
                             [class.border-red-500]="event.type === 'rejected'">
                          <div class="w-2 h-2 rounded-full"
                               [class.bg-green-500]="event.type === 'offer-made'"
                               [class.bg-blue-500]="event.type === 'interview-scheduled' || event.type === 'interview-completed'"
                               [class.bg-gray-400]="event.type === 'submitted' || event.type === 'viewed' || event.type === 'shortlisted'"
                               [class.bg-red-500]="event.type === 'rejected'">
                          </div>
                        </div>
                        <div class="ml-4 flex-1">
                          <p class="text-sm font-medium text-gray-900">{{ event.description }}</p>
                          <p class="text-xs text-gray-500">{{ event.date | date:'short' }}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Interviews -->
                <div *ngIf="app.interviews.length > 0" class="mb-6">
                  <h4 class="text-sm font-semibold text-gray-900 mb-3">Interviews</h4>
                  <div class="space-y-2">
                    <div *ngFor="let interview of app.interviews"
                         class="bg-gray-50 rounded-lg p-4">
                      <div class="flex justify-between items-start">
                        <div>
                          <p class="text-sm font-medium text-gray-900">
                            {{ getInterviewTypeLabel(interview.type) }} Interview
                          </p>
                          <p class="text-sm text-gray-600">{{ interview.scheduledDate | date:'medium' }}</p>
                          <p class="text-xs text-gray-500">Duration: {{ interview.duration }} minutes</p>
                          <p class="text-xs text-gray-500">With: {{ interview.interviewers.join(', ') }}</p>
                        </div>
                        <span class="px-2 py-1 text-xs font-medium rounded-full"
                              [class.bg-yellow-100]="interview.status === 'scheduled'"
                              [class.text-yellow-800]="interview.status === 'scheduled'"
                              [class.bg-green-100]="interview.status === 'completed'"
                              [class.text-green-800]="interview.status === 'completed'"
                              [class.bg-red-100]="interview.status === 'cancelled'"
                              [class.text-red-800]="interview.status === 'cancelled'">
                          {{ interview.status }}
                        </span>
                      </div>
                      <p *ngIf="interview.notes" class="mt-2 text-sm text-gray-600 italic">
                        Notes: {{ interview.notes }}
                      </p>
                    </div>
                  </div>
                </div>

                <!-- Job Offer -->
                <div *ngIf="app.offer" class="mb-6">
                  <h4 class="text-sm font-semibold text-gray-900 mb-3">Job Offer</h4>
                  <div class="bg-green-50 rounded-lg p-4">
                    <div class="grid grid-cols-2 gap-4">
                      <div>
                        <p class="text-xs text-gray-500">Salary</p>
                        <p class="text-sm font-medium text-gray-900">{{ app.offer.salary | currency }}</p>
                      </div>
                      <div>
                        <p class="text-xs text-gray-500">Start Date</p>
                        <p class="text-sm font-medium text-gray-900">{{ app.offer.startDate | date:'mediumDate' }}</p>
                      </div>
                    </div>
                    <div class="mt-3">
                      <p class="text-xs text-gray-500">Benefits</p>
                      <p class="text-sm text-gray-900">{{ app.offer.benefits.join(', ') }}</p>
                    </div>
                    <div class="mt-4 flex space-x-2">
                      <button *ngIf="app.offer.status === 'pending'"
                              (click)="respondToOffer(app.id, 'accepted')"
                              class="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded hover:bg-green-700">
                        Accept Offer
                      </button>
                      <button *ngIf="app.offer.status === 'pending'"
                              (click)="respondToOffer(app.id, 'negotiating')"
                              class="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700">
                        Negotiate
                      </button>
                      <button *ngIf="app.offer.status === 'pending'"
                              (click)="respondToOffer(app.id, 'rejected')"
                              class="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded hover:bg-red-700">
                        Decline
                      </button>
                      <span *ngIf="app.offer.status !== 'pending'"
                            class="px-4 py-2 text-sm font-medium rounded"
                            [class.bg-green-100]="app.offer.status === 'accepted'"
                            [class.text-green-800]="app.offer.status === 'accepted'"
                            [class.bg-blue-100]="app.offer.status === 'negotiating'"
                            [class.text-blue-800]="app.offer.status === 'negotiating'"
                            [class.bg-red-100]="app.offer.status === 'rejected'"
                            [class.text-red-800]="app.offer.status === 'rejected'">
                        {{ app.offer.status === 'accepted' ? 'Offer Accepted' :
                           app.offer.status === 'negotiating' ? 'Negotiating' :
                           'Offer Declined' }}
                      </span>
                    </div>
                  </div>
                </div>

                <!-- Actions -->
                <div class="flex space-x-2">
                  <button (click)="withdrawApplication(app.id)"
                          class="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded hover:bg-red-100">
                    Withdraw Application
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div *ngIf="getFilteredApplications(activeFilter()).length === 0"
             class="text-center py-12">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z">
            </path>
          </svg>
          <h3 class="mt-2 text-sm font-medium text-gray-900">No applications found</h3>
          <p class="mt-1 text-sm text-gray-500">Start applying to jobs to track them here.</p>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class ApplicationTrackerComponent implements OnInit {
  applications = signal<Application[]>([]);
  activeFilter = signal<string>('all');
  expandedApplications = signal<string[]>([]);

  filters = [
    { label: 'All Applications', value: 'all' },
    { label: 'Submitted', value: 'submitted' },
    { label: 'Under Review', value: 'under-review' },
    { label: 'Interview', value: 'interview' },
    { label: 'Offers', value: 'offer' },
    { label: 'Rejected', value: 'rejected' }
  ];

  constructor(private applicationService: ApplicationTrackingService) {}

  ngOnInit(): void {
    this.loadApplications();
  }

  loadApplications(): void {
    this.applicationService.getApplications().subscribe(apps => {
      this.applications.set(apps);
    });
  }

  getFilteredApplications(filter: string): Application[] {
    const apps = this.applications();
    if (filter === 'all') return apps;
    return apps.filter(app => app.status === filter);
  }

  toggleExpanded(appId: string): void {
    const expanded = this.expandedApplications();
    const index = expanded.indexOf(appId);
    if (index === -1) {
      this.expandedApplications.set([...expanded, appId]);
    } else {
      this.expandedApplications.set(expanded.filter(id => id !== appId));
    }
  }

  getStatusLabel(status: string): string {
    const labels: Record<string, string> = {
      'submitted': 'Submitted',
      'under-review': 'Under Review',
      'interview': 'Interview Stage',
      'offer': 'Offer Received',
      'rejected': 'Not Selected'
    };
    return labels[status] || status;
  }

  getInterviewTypeLabel(type: string): string {
    const labels: Record<string, string> = {
      'phone': 'Phone',
      'video': 'Video',
      'in-person': 'In-Person'
    };
    return labels[type] || type;
  }

  respondToOffer(applicationId: string, response: 'accepted' | 'rejected' | 'negotiating'): void {
    this.applicationService.respondToOffer(applicationId, response).subscribe(() => {
      this.loadApplications();
    });
  }

  withdrawApplication(applicationId: string): void {
    if (confirm('Are you sure you want to withdraw this application?')) {
      this.applicationService.withdrawApplication(applicationId).subscribe(() => {
        this.loadApplications();
      });
    }
  }

  getStatusCount(status: string): number {
    return this.applications().filter(a => a.status === status).length;
  }
}
