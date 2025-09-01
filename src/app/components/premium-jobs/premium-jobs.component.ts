import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Job, JobType } from '../../models/job.model';

@Component({
  selector: 'app-premium-jobs',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <section class="py-12 bg-gray-50">
      <div class="container mx-auto px-4">
        <div class="flex justify-between items-center mb-8">
          <h2 class="text-3xl font-bold text-gray-800">Premium Jobs</h2>
          <a routerLink="/jobs" class="text-primary hover:text-primary-dark transition-colors flex items-center">
            VIEW MORE
            <svg class="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </a>
        </div>

        <!-- Carousel Container -->
        <div class="relative">
          <div class="overflow-hidden">
            <div class="flex transition-transform duration-500 ease-in-out" [style.transform]="'translateX(-' + (currentIndex * 100) + '%)'">
              <div *ngFor="let jobSet of jobSets" class="w-full flex-shrink-0">
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div *ngFor="let job of jobSet" class="card card-hover">
                    <div class="flex items-start justify-between mb-4">
                      <img
                        [src]="job.company.logo || 'https://ui-avatars.com/api/?name=' + job.company.name + '&background=22c55e&color=fff'"
                        [alt]="job.company.name"
                        class="w-16 h-16 rounded-lg object-cover"
                      >
                      <span class="badge badge-warning">Premium</span>
                    </div>
                    <h3 class="text-lg font-semibold mb-2">
                      <a [routerLink]="['/job', job.id]" class="hover:text-primary transition-colors">
                        {{job.title}}
                      </a>
                    </h3>
                    <p class="text-gray-600 text-sm mb-4">{{job.company.name}}</p>
                    <div class="flex items-center justify-between text-sm text-gray-500">
                      <span class="flex items-center">
                        <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                        </svg>
                        {{job.location}}
                      </span>
                      <span class="badge" [ngClass]="getJobTypeBadgeClass(job.type)">
                        {{job.type}}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Navigation Buttons -->
          <button
            (click)="previousSlide()"
            class="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-shadow"
            [disabled]="currentIndex === 0"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
            </svg>
          </button>
          <button
            (click)="nextSlide()"
            class="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-shadow"
            [disabled]="currentIndex === jobSets.length - 1"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </button>

          <!-- Indicators -->
          <div class="flex justify-center mt-6 space-x-2">
            <button
              *ngFor="let set of jobSets; let i = index"
              (click)="goToSlide(i)"
              class="w-2 h-2 rounded-full transition-all duration-300"
              [ngClass]="currentIndex === i ? 'bg-primary w-8' : 'bg-gray-300'"
            ></button>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: []
})
export class PremiumJobsComponent implements OnInit, OnDestroy {
  currentIndex = 0;
  autoPlayInterval: any;
  jobSets: Job[][] = [];

  premiumJobs: Job[] = [
    {
      id: '1',
      title: 'Senior Frontend Developer',
      company: {
        id: '1',
        name: 'TechCorp Solutions',
        logo: 'https://ui-avatars.com/api/?name=TechCorp&background=4f46e5&color=fff'
      },
      location: 'San Francisco, CA',
      type: JobType.FULL_TIME,
      salary: { min: 120000, max: 180000, currency: 'USD' },
      description: 'We are looking for an experienced Frontend Developer...',
      postedDate: new Date(),
      category: 'Engineering',
      isPremium: true
    },
    {
      id: '2',
      title: 'Product Manager',
      company: {
        id: '2',
        name: 'InnovateTech',
        logo: 'https://ui-avatars.com/api/?name=InnovateTech&background=10b981&color=fff'
      },
      location: 'New York, NY',
      type: JobType.FULL_TIME,
      salary: { min: 100000, max: 150000, currency: 'USD' },
      description: 'Join our product team to lead innovative projects...',
      postedDate: new Date(),
      category: 'Product',
      isPremium: true
    },
    {
      id: '3',
      title: 'UX Designer',
      company: {
        id: '3',
        name: 'DesignHub',
        logo: 'https://ui-avatars.com/api/?name=DesignHub&background=ec4899&color=fff'
      },
      location: 'Austin, TX',
      type: JobType.CONTRACT,
      salary: { min: 80000, max: 120000, currency: 'USD' },
      description: 'Create beautiful and intuitive user experiences...',
      postedDate: new Date(),
      category: 'Design',
      isPremium: true
    },
    {
      id: '4',
      title: 'Data Scientist',
      company: {
        id: '4',
        name: 'DataMinds',
        logo: 'https://ui-avatars.com/api/?name=DataMinds&background=f59e0b&color=fff'
      },
      location: 'Seattle, WA',
      type: JobType.FULL_TIME,
      salary: { min: 130000, max: 200000, currency: 'USD' },
      description: 'Analyze complex data sets and build ML models...',
      postedDate: new Date(),
      category: 'Data Science',
      isPremium: true
    },
    {
      id: '5',
      title: 'Marketing Director',
      company: {
        id: '5',
        name: 'BrandBoost',
        logo: 'https://ui-avatars.com/api/?name=BrandBoost&background=8b5cf6&color=fff'
      },
      location: 'Los Angeles, CA',
      type: JobType.FULL_TIME,
      salary: { min: 90000, max: 140000, currency: 'USD' },
      description: 'Lead our marketing efforts and brand strategy...',
      postedDate: new Date(),
      category: 'Marketing',
      isPremium: true
    },
    {
      id: '6',
      title: 'DevOps Engineer',
      company: {
        id: '6',
        name: 'CloudTech',
        logo: 'https://ui-avatars.com/api/?name=CloudTech&background=06b6d4&color=fff'
      },
      location: 'Denver, CO',
      type: JobType.FULL_TIME,
      salary: { min: 110000, max: 160000, currency: 'USD' },
      description: 'Manage cloud infrastructure and CI/CD pipelines...',
      postedDate: new Date(),
      category: 'Engineering',
      isPremium: true
    }
  ];

  ngOnInit() {
    // Group jobs into sets of 3 for carousel
    for (let i = 0; i < this.premiumJobs.length; i += 3) {
      this.jobSets.push(this.premiumJobs.slice(i, i + 3));
    }

    // Start auto-play
    this.startAutoPlay();
  }

  ngOnDestroy() {
    this.stopAutoPlay();
  }

  startAutoPlay() {
    this.autoPlayInterval = setInterval(() => {
      if (this.currentIndex < this.jobSets.length - 1) {
        this.currentIndex++;
      } else {
        this.currentIndex = 0;
      }
    }, 5000);
  }

  stopAutoPlay() {
    if (this.autoPlayInterval) {
      clearInterval(this.autoPlayInterval);
    }
  }

  nextSlide() {
    if (this.currentIndex < this.jobSets.length - 1) {
      this.currentIndex++;
    }
  }

  previousSlide() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
    }
  }

  goToSlide(index: number) {
    this.currentIndex = index;
  }

  getJobTypeBadgeClass(type: JobType): string {
    switch (type) {
      case JobType.FULL_TIME:
        return 'badge-primary';
      case JobType.PART_TIME:
        return 'badge-secondary';
      case JobType.CONTRACT:
        return 'badge-warning';
      default:
        return 'badge-secondary';
    }
  }
}
