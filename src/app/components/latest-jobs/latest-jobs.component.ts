import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Job, JobType } from '../../models/job.model';

@Component({
  selector: 'app-latest-jobs',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <section class="py-12">
      <div class="container mx-auto px-4">
        <div class="flex justify-between items-center mb-8">
          <h2 class="text-3xl font-bold text-gray-800">Latest Jobs</h2>
          <a routerLink="/jobs" class="text-primary hover:text-primary-dark transition-colors flex items-center">
            VIEW MORE
            <svg class="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </a>
        </div>

        <!-- Jobs List -->
        <div class="space-y-4">
          <div *ngFor="let job of latestJobs" class="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
            <div class="flex flex-col md:flex-row md:items-center md:justify-between">
              <div class="flex items-start space-x-4 flex-1">
                <img
                  [src]="job.company.logo || 'https://ui-avatars.com/api/?name=' + job.company.name + '&background=22c55e&color=fff'"
                  [alt]="job.company.name"
                  class="w-12 h-12 rounded-lg object-cover"
                >
                <div class="flex-1">
                  <div class="flex items-start justify-between">
                    <div>
                      <h3 class="text-lg font-semibold mb-1">
                        <a [routerLink]="['/job', job.id]" class="hover:text-primary transition-colors">
                          {{job.title}}
                        </a>
                        <span *ngIf="job.isPremium" class="ml-2 badge badge-warning">Premium</span>
                        <span *ngIf="job.isUrgent" class="ml-2 badge badge-danger">Urgent</span>
                      </h3>
                      <p class="text-gray-600 text-sm mb-2">
                        <a href="#" class="hover:text-primary transition-colors">{{job.company.name}}</a>
                      </p>
                    </div>
                  </div>

                  <div class="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                    <span class="flex items-center">
                      <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                      {{getTimeAgo(job.postedDate)}}
                    </span>
                    <span class="flex items-center">
                      <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                      </svg>
                      {{job.category}}
                    </span>
                    <span class="flex items-center">
                      <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                      </svg>
                      {{job.location}}
                    </span>
                    <span class="badge" [ngClass]="getJobTypeBadgeClass(job.type)">
                      {{job.type}}
                    </span>
                    <span *ngIf="job.salary" class="flex items-center font-medium text-gray-700">
                      <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                      {{formatSalary(job.salary)}}
                    </span>
                  </div>

                  <p class="mt-3 text-gray-600 line-clamp-2">{{job.description}}</p>

                  <div class="mt-4 flex items-center space-x-4">
                    <button class="text-primary hover:text-primary-dark transition-colors flex items-center text-sm">
                      <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                      </svg>
                      Save Job
                    </button>
                    <button class="text-primary hover:text-primary-dark transition-colors flex items-center text-sm">
                      <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                      </svg>
                      Email Job
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- View All Jobs Button -->
        <div class="text-center mt-8">
          <a routerLink="/jobs" class="btn btn-primary">
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
            </svg>
            VIEW ALL JOBS
          </a>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .line-clamp-2 {
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
  `]
})
export class LatestJobsComponent {
  latestJobs: Job[] = [
    {
      id: '7',
      title: 'Hiring Client Service Specialist',
      company: {
        id: '7',
        name: 'Huels, Wunsch And Farrell',
        logo: 'https://ui-avatars.com/api/?name=HWF&background=6366f1&color=fff'
      },
      location: 'St. Johns',
      type: JobType.CONTRACT,
      salary: { min: 30000, max: 45000, currency: 'USD' },
      description: 'Ipsa doloribus numquam sed in necessitatibus maxime aut. Vitae dolores nihil totam ipsam nostrum. Repudiandae architecto non recusandae id velit ab quis.',
      postedDate: new Date(Date.now() - 16 * 60 * 60 * 1000),
      category: 'Babysitting & Nanny Work'
    },
    {
      id: '8',
      title: 'Animal Shelter Worker Junior',
      company: {
        id: '7',
        name: 'Huels, Wunsch And Farrell',
        logo: 'https://ui-avatars.com/api/?name=HWF&background=6366f1&color=fff'
      },
      location: 'Burton',
      type: JobType.FULL_TIME,
      salary: { min: 40000, max: 55000, currency: 'USD' },
      description: 'Sint sed impedit omnis nam quas blanditiis. Quidem repellat dolorem voluptatem in. Ea reiciendis facilis qui est aut.',
      postedDate: new Date(Date.now() - 16 * 60 * 60 * 1000),
      category: 'Engineering',
      isPremium: true
    },
    {
      id: '9',
      title: 'ASAP: B2B Sales Specialist',
      company: {
        id: '7',
        name: 'Huels, Wunsch And Farrell',
        logo: 'https://ui-avatars.com/api/?name=HWF&background=6366f1&color=fff'
      },
      location: 'Minden',
      type: JobType.INTERNSHIP,
      salary: { min: 25000, max: 35000, currency: 'USD' },
      description: 'Omnis veritatis officiis sed autem. Omnis rerum illo facere. Excepturi voluptas accusantium necessitatibus cum sit dolores rem.',
      postedDate: new Date(Date.now() - 16 * 60 * 60 * 1000),
      category: 'Babysitting & Nanny Work',
      isUrgent: true
    },
    {
      id: '10',
      title: 'Attorney',
      company: {
        id: '7',
        name: 'Huels, Wunsch And Farrell',
        logo: 'https://ui-avatars.com/api/?name=HWF&background=6366f1&color=fff'
      },
      location: 'Emmett',
      type: JobType.OPTIONAL,
      salary: { min: 70000, max: 120000, currency: 'USD' },
      description: 'Rerum maiores aut velit voluptates autem distinctio. Et sint accusamus possimus impedit dolore a. Similique commodi corporis ut perferendis omnis.',
      postedDate: new Date(Date.now() - 17 * 60 * 60 * 1000),
      category: 'Banking',
      isPremium: true
    },
    {
      id: '11',
      title: 'Safety Engineer Senior',
      company: {
        id: '8',
        name: 'Kirlin, Wisozk And Kuhn',
        logo: 'https://ui-avatars.com/api/?name=KWK&background=f59e0b&color=fff'
      },
      location: 'Watertown',
      type: JobType.FULL_TIME,
      salary: { min: 80000, max: 110000, currency: 'USD' },
      description: 'Libero est illum non et est. Omnis aut qui libero ad provident doloribus. Nemo porro repellendus animi iusto.',
      postedDate: new Date(Date.now() - 17 * 60 * 60 * 1000),
      category: 'Transportation & Logistics',
      isPremium: true
    }
  ];

  getTimeAgo(date: Date): string {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));

    if (hours < 1) {
      return 'Just now';
    } else if (hours < 24) {
      return `${hours} hours ago`;
    } else {
      const days = Math.floor(hours / 24);
      return `${days} day${days > 1 ? 's' : ''} ago`;
    }
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
        return 'badge-info text-blue-800 bg-blue-100';
      default:
        return 'badge-secondary';
    }
  }

  formatSalary(salary: { min: number; max: number; currency: string }): string {
    return `${salary.min.toLocaleString()} - ${salary.max.toLocaleString()}`;
  }
}
