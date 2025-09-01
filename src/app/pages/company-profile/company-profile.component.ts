import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Job, Company } from '../../models/job.model';
import { Observable, of } from 'rxjs';

interface CompanyProfile extends Company {
  founded?: string;
  employees?: string;
  locations?: string[];
  culture?: string;
  benefits?: string[];
  techStack?: string[];
  socialLinks?: {
    website?: string;
    linkedin?: string;
    twitter?: string;
    facebook?: string;
  };
  jobs?: Job[];
  reviews?: CompanyReview[];
}

interface CompanyReview {
  id: string;
  rating: number;
  title: string;
  pros: string;
  cons: string;
  author: string;
  role: string;
  date: Date;
  verified: boolean;
}

@Component({
  selector: 'app-company-profile',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="min-h-screen bg-gray-50">
      <!-- Company Header -->
      <div class="bg-white border-b">
        <div class="container mx-auto px-4 py-8">
          <div class="flex items-start justify-between">
            <div class="flex items-center space-x-6">
              <img
                [src]="company?.logo || 'https://ui-avatars.com/api/?name=' + company?.name"
                [alt]="company?.name"
                class="w-24 h-24 rounded-lg object-cover"
              >
              <div>
                <h1 class="text-3xl font-bold text-gray-800">{{company?.name}}</h1>
                <p class="text-gray-600 mt-1">{{company?.industry}}</p>
                <div class="flex items-center gap-4 mt-3 text-sm text-gray-500">
                  <span class="flex items-center">
                    <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                    </svg>
                    {{company?.locations?.join(', ')}}
                  </span>
                  <span class="flex items-center">
                    <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
                    </svg>
                    {{company?.employees}} employees
                  </span>
                  <span class="flex items-center">
                    <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                    </svg>
                    Founded {{company?.founded}}
                  </span>
                </div>
              </div>
            </div>
            <div class="flex gap-3">
              <button class="btn btn-outline">
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                </svg>
                Follow
              </button>
              <a [href]="company?.socialLinks?.website" target="_blank" class="btn btn-primary">
                Visit Website
              </a>
            </div>
          </div>
        </div>
      </div>

      <!-- Navigation Tabs -->
      <div class="bg-white border-b sticky top-0 z-10">
        <div class="container mx-auto px-4">
          <nav class="flex space-x-8">
            <button
              (click)="activeTab = 'overview'"
              [class.border-b-2]="activeTab === 'overview'"
              [class.border-primary]="activeTab === 'overview'"
              [class.text-primary]="activeTab === 'overview'"
              class="py-4 px-1 font-medium transition-colors"
            >
              Overview
            </button>
            <button
              (click)="activeTab = 'jobs'"
              [class.border-b-2]="activeTab === 'jobs'"
              [class.border-primary]="activeTab === 'jobs'"
              [class.text-primary]="activeTab === 'jobs'"
              class="py-4 px-1 font-medium transition-colors"
            >
              Jobs ({{company?.jobs?.length || 0}})
            </button>
            <button
              (click)="activeTab = 'culture'"
              [class.border-b-2]="activeTab === 'culture'"
              [class.border-primary]="activeTab === 'culture'"
              [class.text-primary]="activeTab === 'culture'"
              class="py-4 px-1 font-medium transition-colors"
            >
              Culture & Benefits
            </button>
            <button
              (click)="activeTab = 'reviews'"
              [class.border-b-2]="activeTab === 'reviews'"
              [class.border-primary]="activeTab === 'reviews'"
              [class.text-primary]="activeTab === 'reviews'"
              class="py-4 px-1 font-medium transition-colors"
            >
              Reviews ({{company?.reviews?.length || 0}})
            </button>
          </nav>
        </div>
      </div>

      <!-- Content -->
      <div class="container mx-auto px-4 py-8">
        <!-- Overview Tab -->
        <div *ngIf="activeTab === 'overview'" class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div class="lg:col-span-2 space-y-6">
            <!-- About -->
            <div class="bg-white rounded-lg shadow-sm p-6">
              <h2 class="text-xl font-semibold mb-4">About {{company?.name}}</h2>
              <p class="text-gray-700 leading-relaxed">{{company?.description}}</p>
            </div>

            <!-- Tech Stack -->
            <div *ngIf="company?.techStack" class="bg-white rounded-lg shadow-sm p-6">
              <h2 class="text-xl font-semibold mb-4">Tech Stack</h2>
              <div class="flex flex-wrap gap-2">
                <span
                  *ngFor="let tech of company?.techStack"
                  class="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                >
                  {{tech}}
                </span>
              </div>
            </div>

            <!-- Recent Jobs -->
            <div class="bg-white rounded-lg shadow-sm p-6">
              <div class="flex justify-between items-center mb-4">
                <h2 class="text-xl font-semibold">Open Positions</h2>
                <button (click)="activeTab = 'jobs'" class="text-primary hover:text-primary-dark">
                  View All →
                </button>
              </div>
              <div class="space-y-4">
                <div
                  *ngFor="let job of company?.jobs?.slice(0, 3)"
                  class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <h3 class="font-medium mb-1">
                    <a [routerLink]="['/job', job.id]" class="hover:text-primary">{{job.title}}</a>
                  </h3>
                  <div class="flex items-center gap-4 text-sm text-gray-500">
                    <span>{{job.location}}</span>
                    <span>{{job.type}}</span>
                    <span *ngIf="job.salary">{{formatSalary(job.salary)}}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Sidebar -->
          <div class="space-y-6">
            <!-- Company Info -->
            <div class="bg-white rounded-lg shadow-sm p-6">
              <h3 class="font-semibold mb-4">Company Information</h3>
              <div class="space-y-3">
                <div>
                  <span class="text-sm text-gray-600">Industry</span>
                  <p class="font-medium">{{company?.industry}}</p>
                </div>
                <div>
                  <span class="text-sm text-gray-600">Company Size</span>
                  <p class="font-medium">{{company?.employees}} employees</p>
                </div>
                <div>
                  <span class="text-sm text-gray-600">Founded</span>
                  <p class="font-medium">{{company?.founded}}</p>
                </div>
                <div>
                  <span class="text-sm text-gray-600">Headquarters</span>
                  <p class="font-medium">{{company?.locations?.[0]}}</p>
                </div>
              </div>
            </div>

            <!-- Social Links -->
            <div class="bg-white rounded-lg shadow-sm p-6">
              <h3 class="font-semibold mb-4">Connect</h3>
              <div class="space-y-2">
                <a
                  *ngIf="company?.socialLinks?.website"
                  [href]="company?.socialLinks?.website"
                  target="_blank"
                  class="flex items-center text-gray-700 hover:text-primary"
                >
                  <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"></path>
                  </svg>
                  Website
                </a>
                <a
                  *ngIf="company?.socialLinks?.linkedin"
                  [href]="company?.socialLinks?.linkedin"
                  target="_blank"
                  class="flex items-center text-gray-700 hover:text-primary"
                >
                  <svg class="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                  LinkedIn
                </a>
              </div>
            </div>
          </div>
        </div>

        <!-- Jobs Tab -->
        <div *ngIf="activeTab === 'jobs'" class="space-y-4">
          <div *ngIf="company?.jobs?.length === 0" class="bg-white rounded-lg shadow-sm p-12 text-center">
            <svg class="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A9 9 0 1 0 8.745 21h6.51A9 9 0 0 0 21 13.255z"></path>
            </svg>
            <h3 class="text-lg font-medium text-gray-900 mb-2">No open positions</h3>
            <p class="text-gray-600">Check back later for new opportunities</p>
          </div>

          <div
            *ngFor="let job of company?.jobs"
            class="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow"
          >
            <div class="flex justify-between items-start">
              <div>
                <h3 class="text-lg font-semibold mb-1">
                  <a [routerLink]="['/job', job.id]" class="hover:text-primary">{{job.title}}</a>
                </h3>
                <div class="flex items-center gap-4 mb-3 text-sm text-gray-500">
                  <span>{{job.location}}</span>
                  <span class="badge badge-primary">{{job.type}}</span>
                  <span *ngIf="job.salary">{{formatSalary(job.salary)}}</span>
                </div>
                <p class="text-gray-600 mb-4">{{job.description}}</p>
                <a [routerLink]="['/job', job.id]" class="btn btn-primary">Apply Now</a>
              </div>
            </div>
          </div>
        </div>

        <!-- Culture Tab -->
        <div *ngIf="activeTab === 'culture'" class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div class="bg-white rounded-lg shadow-sm p-6">
            <h2 class="text-xl font-semibold mb-4">Company Culture</h2>
            <p class="text-gray-700 leading-relaxed">{{company?.culture}}</p>
          </div>

          <div class="bg-white rounded-lg shadow-sm p-6">
            <h2 class="text-xl font-semibold mb-4">Benefits & Perks</h2>
            <ul class="space-y-2">
              <li *ngFor="let benefit of company?.benefits" class="flex items-start">
                <svg class="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span class="text-gray-700">{{benefit}}</span>
              </li>
            </ul>
          </div>
        </div>

        <!-- Reviews Tab -->
        <div *ngIf="activeTab === 'reviews'" class="space-y-6">
          <!-- Rating Summary -->
          <div class="bg-white rounded-lg shadow-sm p-6">
            <div class="flex items-center justify-between mb-6">
              <h2 class="text-xl font-semibold">Employee Reviews</h2>
              <button class="btn btn-primary">Write a Review</button>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div class="text-center">
                <div class="text-4xl font-bold text-gray-800">{{averageRating}}</div>
                <div class="flex justify-center my-2">
                  <svg *ngFor="let star of [1,2,3,4,5]"
                       class="w-5 h-5"
                       [class.text-yellow-400]="star <= averageRating"
                       [class.text-gray-300]="star > averageRating"
                       fill="currentColor"
                       viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                  </svg>
                </div>
                <p class="text-sm text-gray-600">{{company?.reviews?.length}} reviews</p>
              </div>
              <div class="space-y-2">
                <div *ngFor="let rating of [5,4,3,2,1]" class="flex items-center">
                  <span class="text-sm text-gray-600 w-2">{{rating}}</span>
                  <svg class="w-4 h-4 text-yellow-400 mx-1" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                  </svg>
                  <div class="flex-1 h-2 bg-gray-200 rounded-full mx-2">
                    <div
                      class="h-2 bg-yellow-400 rounded-full"
                      [style.width.%]="getRatingPercentage(rating)"
                    ></div>
                  </div>
                  <span class="text-sm text-gray-600">{{getRatingCount(rating)}}</span>
                </div>
              </div>
              <div class="space-y-2">
                <div class="text-sm text-gray-600">Would recommend</div>
                <div class="text-2xl font-bold text-green-600">87%</div>
              </div>
            </div>
          </div>

          <!-- Individual Reviews -->
          <div class="space-y-4">
            <div
              *ngFor="let review of company?.reviews"
              class="bg-white border border-gray-200 rounded-lg p-6"
            >
              <div class="flex items-start justify-between mb-4">
                <div>
                  <div class="flex items-center mb-2">
                    <div class="flex">
                      <svg *ngFor="let star of [1,2,3,4,5]"
                           class="w-4 h-4"
                           [class.text-yellow-400]="star <= review.rating"
                           [class.text-gray-300]="star > review.rating"
                           fill="currentColor"
                           viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                      </svg>
                    </div>
                    <span class="ml-2 text-sm font-medium">{{review.title}}</span>
                  </div>
                  <p class="text-sm text-gray-600">
                    {{review.role}} • {{review.date | date: 'MMM yyyy'}}
                    <span *ngIf="review.verified" class="ml-2 text-green-600">✓ Verified</span>
                  </p>
                </div>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 class="font-medium text-green-600 mb-2">Pros</h4>
                  <p class="text-gray-700">{{review.pros}}</p>
                </div>
                <div>
                  <h4 class="font-medium text-red-600 mb-2">Cons</h4>
                  <p class="text-gray-700">{{review.cons}}</p>
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
export class CompanyProfileComponent implements OnInit {
  company?: CompanyProfile;
  activeTab = 'overview';
  averageRating = 4.2;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    // Mock company data
    this.company = {
      id: '1',
      name: 'TechCorp Solutions',
      logo: 'https://ui-avatars.com/api/?name=TechCorp&background=4f46e5&color=fff&size=200',
      industry: 'Technology',
      size: '1000-5000',
      founded: '2010',
      employees: '2,500+',
      locations: ['San Francisco, CA', 'New York, NY', 'Austin, TX'],
      description: 'TechCorp Solutions is a leading technology company focused on building innovative solutions that transform how businesses operate. We are passionate about creating products that make a real difference in people\'s lives.',
      culture: 'At TechCorp, we foster a culture of innovation, collaboration, and continuous learning. We believe in empowering our employees to take ownership of their work and make meaningful contributions to our mission.',
      benefits: [
        'Comprehensive health, dental, and vision insurance',
        'Unlimited PTO policy',
        '401(k) with company match',
        'Remote work flexibility',
        'Annual learning & development budget',
        'Stock options',
        'Parental leave',
        'Wellness programs and gym membership',
        'Free meals and snacks',
        'Company retreats and team events'
      ],
      techStack: ['React', 'Angular', 'Node.js', 'Python', 'AWS', 'Docker', 'Kubernetes', 'PostgreSQL', 'Redis', 'GraphQL'],
      socialLinks: {
        website: 'https://techcorp.com',
        linkedin: 'https://linkedin.com/company/techcorp',
        twitter: 'https://twitter.com/techcorp'
      },
      jobs: this.generateMockJobs(),
      reviews: this.generateMockReviews()
    };
  }

  private generateMockJobs(): Job[] {
    return [
      {
        id: '1',
        title: 'Senior Frontend Developer',
        company: { id: '1', name: 'TechCorp Solutions' },
        location: 'San Francisco, CA',
        type: 'Full-time' as any,
        salary: { min: 150000, max: 200000, currency: 'USD' },
        description: 'We are looking for an experienced Frontend Developer to join our team...',
        postedDate: new Date(),
        category: 'Engineering'
      },
      {
        id: '2',
        title: 'Product Manager',
        company: { id: '1', name: 'TechCorp Solutions' },
        location: 'New York, NY',
        type: 'Full-time' as any,
        salary: { min: 130000, max: 180000, currency: 'USD' },
        description: 'Join our product team to lead innovative projects...',
        postedDate: new Date(),
        category: 'Product'
      }
    ];
  }

  private generateMockReviews(): CompanyReview[] {
    return [
      {
        id: '1',
        rating: 5,
        title: 'Great place to work',
        pros: 'Excellent work-life balance, great benefits, supportive team, opportunities for growth',
        cons: 'Fast-paced environment can be challenging at times',
        author: 'Anonymous',
        role: 'Software Engineer',
        date: new Date('2024-01-15'),
        verified: true
      },
      {
        id: '2',
        rating: 4,
        title: 'Good company with room for improvement',
        pros: 'Innovative projects, smart colleagues, good compensation',
        cons: 'Communication between teams could be better',
        author: 'Anonymous',
        role: 'Product Manager',
        date: new Date('2023-11-20'),
        verified: true
      }
    ];
  }

  getRatingPercentage(rating: number): number {
    const total = this.company?.reviews?.length || 0;
    const count = this.company?.reviews?.filter(r => Math.floor(r.rating) === rating).length || 0;
    return total > 0 ? (count / total) * 100 : 0;
  }

  getRatingCount(rating: number): number {
    return this.company?.reviews?.filter(r => Math.floor(r.rating) === rating).length || 0;
  }

  formatSalary(salary: { min: number; max: number; currency: string }): string {
    return `${salary.min.toLocaleString()} - ${salary.max.toLocaleString()}`;
  }
}
