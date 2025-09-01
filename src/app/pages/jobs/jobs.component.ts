import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { JobService, JobFilters } from '../../services/job.service';
import { AuthService } from '../../services/auth.service';
import { Job, JobType, Category, Location } from '../../models/job.model';
import { Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-jobs',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="min-h-screen bg-gray-50">
      <!-- Search Header -->
      <div class="bg-white shadow-sm border-b">
        <div class="container mx-auto px-4 py-6">
          <div class="flex flex-col md:flex-row gap-4">
            <div class="flex-1">
              <input
                type="text"
                [(ngModel)]="searchQuery"
                (input)="onSearchChange()"
                placeholder="Search jobs, companies, or keywords..."
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
            </div>
            <div class="flex gap-2">
              <button
                (click)="toggleFilters()"
                class="px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center"
              >
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path>
                </svg>
                Filters
                <span *ngIf="activeFilterCount > 0" class="ml-2 px-2 py-0.5 bg-primary text-white text-xs rounded-full">
                  {{activeFilterCount}}
                </span>
              </button>
              <button
                (click)="resetFilters()"
                *ngIf="activeFilterCount > 0"
                class="px-4 py-3 text-gray-600 hover:text-gray-900 transition-colors"
              >
                Clear All
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="container mx-auto px-4 py-8">
        <div class="flex gap-8">
          <!-- Filters Sidebar -->
          <aside
            *ngIf="showFilters"
            class="w-80 flex-shrink-0 animate-slide-in"
            [@slideIn]
          >
            <div class="bg-white rounded-lg shadow-sm p-6 sticky top-4">
              <h3 class="font-semibold text-lg mb-4">Filter Jobs</h3>

              <!-- Location Filter -->
              <div class="mb-6">
                <label class="block text-sm font-medium text-gray-700 mb-2">Location</label>
                <select
                  [(ngModel)]="filters.location"
                  (change)="applyFilters()"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">All Locations</option>
                  <option *ngFor="let location of locations$ | async" [value]="location.name">
                    {{location.name}} ({{location.jobCount}})
                  </option>
                </select>
              </div>

              <!-- Category Filter -->
              <div class="mb-6">
                <label class="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  [(ngModel)]="filters.category"
                  (change)="applyFilters()"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">All Categories</option>
                  <option *ngFor="let category of categories$ | async" [value]="category.name">
                    {{category.name}} ({{category.jobCount}})
                  </option>
                </select>
              </div>

              <!-- Job Type Filter -->
              <div class="mb-6">
                <label class="block text-sm font-medium text-gray-700 mb-2">Job Type</label>
                <div class="space-y-2">
                  <label *ngFor="let type of jobTypes" class="flex items-center">
                    <input
                      type="radio"
                      name="jobType"
                      [value]="type.value"
                      [(ngModel)]="filters.jobType"
                      (change)="applyFilters()"
                      class="mr-2 text-primary focus:ring-primary"
                    >
                    <span class="text-sm">{{type.label}}</span>
                  </label>
                </div>
              </div>

              <!-- Salary Range Filter -->
              <div class="mb-6">
                <label class="block text-sm font-medium text-gray-700 mb-2">Salary Range</label>
                <div class="flex gap-2">
                  <input
                    type="number"
                    [(ngModel)]="filters.salaryMin"
                    (change)="applyFilters()"
                    placeholder="Min"
                    class="w-1/2 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                  <input
                    type="number"
                    [(ngModel)]="filters.salaryMax"
                    (change)="applyFilters()"
                    placeholder="Max"
                    class="w-1/2 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                </div>
              </div>

              <!-- Remote Filter -->
              <div class="mb-6">
                <label class="flex items-center">
                  <input
                    type="checkbox"
                    [(ngModel)]="filters.isRemote"
                    (change)="applyFilters()"
                    class="mr-2 text-primary rounded focus:ring-primary"
                  >
                  <span class="text-sm font-medium text-gray-700">Remote Jobs Only</span>
                </label>
              </div>

              <!-- Experience Level -->
              <div class="mb-6">
                <label class="block text-sm font-medium text-gray-700 mb-2">Experience Level</label>
                <select
                  [(ngModel)]="filters.experienceLevel"
                  (change)="applyFilters()"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">All Levels</option>
                  <option value="entry">Entry Level</option>
                  <option value="mid">Mid Level</option>
                  <option value="senior">Senior Level</option>
                  <option value="executive">Executive</option>
                </select>
              </div>
            </div>
          </aside>

          <!-- Jobs List -->
          <div class="flex-1">
            <!-- Results Header -->
            <div class="flex justify-between items-center mb-6">
              <div>
                <h1 class="text-2xl font-bold text-gray-800">
                  <ng-container *ngIf="(filteredJobs$ | async) as jobs">
                    {{jobs.length}} Jobs Found
                  </ng-container>
                </h1>
                <p class="text-gray-600 mt-1">
                  <span *ngIf="filters.searchQuery">for "{{filters.searchQuery}}"</span>
                  <span *ngIf="filters.location"> in {{filters.location}}</span>
                </p>
              </div>
              <div class="flex items-center gap-2">
                <label class="text-sm text-gray-600">Sort by:</label>
                <select
                  [(ngModel)]="sortBy"
                  (change)="onSortChange()"
                  class="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="salary-high">Salary: High to Low</option>
                  <option value="salary-low">Salary: Low to High</option>
                </select>
              </div>
            </div>

            <!-- Loading State -->
            <div *ngIf="loading" class="text-center py-12">
              <div class="inline-flex items-center">
                <svg class="animate-spin h-8 w-8 text-primary mr-3" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Searching jobs...
              </div>
            </div>

            <!-- Jobs Grid -->
            <div *ngIf="!loading" class="space-y-4">
              <div
                *ngFor="let job of filteredJobs$ | async"
                class="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-all duration-200"
              >
                <div class="flex justify-between items-start">
                  <div class="flex-1">
                    <div class="flex items-start gap-4">
                      <img
                        [src]="job.company.logo || 'https://ui-avatars.com/api/?name=' + job.company.name"
                        [alt]="job.company.name"
                        class="w-14 h-14 rounded-lg object-cover"
                      >
                      <div class="flex-1">
                        <h3 class="text-lg font-semibold mb-1">
                          <a [routerLink]="['/job', job.id]" class="hover:text-primary transition-colors">
                            {{job.title}}
                          </a>
                          <span *ngIf="job.isPremium" class="ml-2 badge badge-warning">Premium</span>
                          <span *ngIf="job.isUrgent" class="ml-2 badge badge-danger">Urgent</span>
                        </h3>
                        <p class="text-gray-600 mb-2">{{job.company.name}}</p>

                        <div class="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-3">
                          <span class="flex items-center">
                            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                            </svg>
                            {{job.location}}
                          </span>
                          <span class="badge" [ngClass]="getJobTypeBadgeClass(job.type)">
                            {{job.type}}
                          </span>
                          <span *ngIf="job.salary" class="font-medium text-gray-700">
                            {{formatSalary(job.salary)}}
                          </span>
                          <span class="flex items-center">
                            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                            {{getTimeAgo(job.postedDate)}}
                          </span>
                        </div>

                        <p class="text-gray-600 mb-4">{{job.description}}</p>

                        <div class="flex items-center gap-4">
                          <button
                            (click)="toggleSaveJob(job.id)"
                            class="text-primary hover:text-primary-dark transition-colors flex items-center text-sm"
                          >
                            <svg
                              class="w-4 h-4 mr-1"
                              [class.fill-current]="isJobSaved(job.id) | async"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                            </svg>
                            {{(isJobSaved(job.id) | async) ? 'Saved' : 'Save Job'}}
                          </button>
                          <a [routerLink]="['/job', job.id]" class="btn btn-primary">
                            Apply Now
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- No Results -->
              <div
                *ngIf="(filteredJobs$ | async)?.length === 0"
                class="text-center py-12 bg-white rounded-lg"
              >
                <svg class="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <h3 class="text-lg font-medium text-gray-900 mb-2">No jobs found</h3>
                <p class="text-gray-600">Try adjusting your filters or search criteria</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    @keyframes slideIn {
      from {
        opacity: 0;
        transform: translateX(-20px);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }

    .animate-slide-in {
      animation: slideIn 0.3s ease-out;
    }
  `]
})
export class JobsComponent implements OnInit {
  filters: JobFilters = {};
  searchQuery = '';
  showFilters = true;
  loading = false;
  sortBy = 'newest';
  activeFilterCount = 0;

  filteredJobs$!: Observable<Job[]>;
  categories$!: Observable<Category[]>;
  locations$!: Observable<Location[]>;

  jobTypes = [
    { value: '', label: 'All Types' },
    { value: JobType.FULL_TIME, label: 'Full-time' },
    { value: JobType.PART_TIME, label: 'Part-time' },
    { value: JobType.CONTRACT, label: 'Contract' },
    { value: JobType.INTERNSHIP, label: 'Internship' },
    { value: JobType.TEMPORARY, label: 'Temporary' }
  ];

  constructor(
    private jobService: JobService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.categories$ = this.jobService.getCategories();
    this.locations$ = this.jobService.getLocations();
    this.applyFilters();
  }

  onSearchChange() {
    this.filters.searchQuery = this.searchQuery;
    this.applyFilters();
  }

  applyFilters() {
    this.loading = true;
    this.calculateActiveFilters();

    this.filteredJobs$ = this.jobService.searchJobs(this.filters).pipe(
      map(jobs => this.sortJobs(jobs))
    );

    setTimeout(() => this.loading = false, 300);
  }

  sortJobs(jobs: Job[]): Job[] {
    const sorted = [...jobs];

    switch (this.sortBy) {
      case 'newest':
        return sorted.sort((a, b) => b.postedDate.getTime() - a.postedDate.getTime());
      case 'oldest':
        return sorted.sort((a, b) => a.postedDate.getTime() - b.postedDate.getTime());
      case 'salary-high':
        return sorted.sort((a, b) => (b.salary?.max || 0) - (a.salary?.max || 0));
      case 'salary-low':
        return sorted.sort((a, b) => (a.salary?.min || 0) - (b.salary?.min || 0));
      default:
        return sorted;
    }
  }

  onSortChange() {
    this.applyFilters();
  }

  toggleFilters() {
    this.showFilters = !this.showFilters;
  }

  resetFilters() {
    this.filters = {};
    this.searchQuery = '';
    this.applyFilters();
  }

  calculateActiveFilters() {
    let count = 0;
    if (this.filters.location) count++;
    if (this.filters.category) count++;
    if (this.filters.jobType) count++;
    if (this.filters.salaryMin || this.filters.salaryMax) count++;
    if (this.filters.isRemote) count++;
    if (this.filters.experienceLevel) count++;
    this.activeFilterCount = count;
  }

  toggleSaveJob(jobId: string) {
    if (this.authService.getCurrentUser()) {
      this.jobService.toggleSaveJob(jobId);
    } else {
      // Show login prompt
      alert('Please login to save jobs');
    }
  }

  isJobSaved(jobId: string): Observable<boolean> {
    return this.jobService.isJobSaved(jobId);
  }

  getTimeAgo(date: Date): string {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));

    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours} hours ago`;

    const days = Math.floor(hours / 24);
    if (days === 1) return 'Yesterday';
    if (days < 30) return `${days} days ago`;

    const months = Math.floor(days / 30);
    return `${months} month${months > 1 ? 's' : ''} ago`;
  }

  getJobTypeBadgeClass(type: JobType): string {
    switch (type) {
      case JobType.FULL_TIME:
        return 'badge-primary';
      case JobType.PART_TIME:
        return 'badge-secondary';
      case JobType.CONTRACT:
        return 'badge-warning';
      case JobType.INTERNSHIP:
        return 'bg-blue-100 text-blue-800';
      default:
        return 'badge-secondary';
    }
  }

  formatSalary(salary: { min: number; max: number; currency: string }): string {
    return `${salary.min.toLocaleString()} - ${salary.max.toLocaleString()}`;
  }
}
