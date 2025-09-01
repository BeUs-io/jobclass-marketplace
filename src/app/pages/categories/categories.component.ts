import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  jobCount: number;
  description: string;
  subcategories?: string[];
  trending: boolean;
  growth: number; // percentage growth
}

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="min-h-screen bg-gray-50">
      <!-- Hero Section -->
      <div class="bg-gradient-to-r from-green-600 to-blue-600 text-white">
        <div class="container mx-auto px-4 py-16">
          <h1 class="text-4xl font-bold mb-4">Browse Jobs by Category</h1>
          <p class="text-xl opacity-90">Find your perfect role in {{totalJobs}} job listings across {{categories.length}} categories</p>

          <!-- Search Bar -->
          <div class="mt-8 max-w-2xl">
            <div class="relative">
              <input
                type="text"
                [(ngModel)]="searchTerm"
                placeholder="Search categories..."
                class="w-full px-4 py-3 pr-10 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-white"
              >
              <svg class="absolute right-3 top-3.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Stats -->
      <div class="container mx-auto px-4 -mt-8">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div class="bg-white rounded-lg shadow-md p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-600">Total Categories</p>
                <p class="text-2xl font-bold">{{categories.length}}</p>
              </div>
              <svg class="w-10 h-10 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            </div>
          </div>

          <div class="bg-white rounded-lg shadow-md p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-600">Active Jobs</p>
                <p class="text-2xl font-bold">{{totalJobs}}</p>
              </div>
              <svg class="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
              </svg>
            </div>
          </div>

          <div class="bg-white rounded-lg shadow-md p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-600">Trending Categories</p>
                <p class="text-2xl font-bold">{{trendingCount}}</p>
              </div>
              <svg class="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
              </svg>
            </div>
          </div>

          <div class="bg-white rounded-lg shadow-md p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-600">Avg. Jobs/Category</p>
                <p class="text-2xl font-bold">{{avgJobsPerCategory}}</p>
              </div>
              <svg class="w-10 h-10 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Trending Categories Banner -->
      <div class="container mx-auto px-4 mt-8">
        <div class="bg-gradient-to-r from-yellow-50 to-red-50 border border-yellow-200 rounded-lg p-6">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-lg font-semibold text-gray-900 mb-2">🔥 Hot Categories Right Now</h3>
              <div class="flex flex-wrap gap-2">
                <span *ngFor="let cat of getTrendingCategories()"
                      class="px-3 py-1 bg-white rounded-full text-sm font-medium text-gray-700 shadow-sm">
                  {{cat.name}} <span class="text-green-600">↑{{cat.growth}}%</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Categories Grid -->
      <div class="container mx-auto px-4 py-8">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-2xl font-bold">All Categories</h2>
          <div class="flex gap-2">
            <button
              (click)="viewMode = 'grid'"
              [class.bg-gray-200]="viewMode === 'grid'"
              class="px-4 py-2 rounded-lg hover:bg-gray-100"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path>
              </svg>
            </button>
            <button
              (click)="viewMode = 'list'"
              [class.bg-gray-200]="viewMode === 'list'"
              class="px-4 py-2 rounded-lg hover:bg-gray-100"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            </button>
          </div>
        </div>

        <!-- Grid View -->
        <div *ngIf="viewMode === 'grid'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <a *ngFor="let category of getFilteredCategories()"
             [routerLink]="['/jobs']"
             [queryParams]="{category: category.id}"
             class="group bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden">
            <div class="p-6">
              <div class="flex items-start justify-between mb-4">
                <div [class]="'w-12 h-12 rounded-lg flex items-center justify-center ' + category.color">
                  <span class="text-2xl">{{category.icon}}</span>
                </div>
                <div *ngIf="category.trending" class="flex items-center gap-1 text-xs font-medium text-red-600">
                  <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clip-rule="evenodd" />
                  </svg>
                  Trending
                </div>
              </div>

              <h3 class="text-lg font-semibold text-gray-900 mb-2 group-hover:text-green-600 transition-colors">
                {{category.name}}
              </h3>

              <p class="text-sm text-gray-600 mb-4 line-clamp-2">
                {{category.description}}
              </p>

              <div class="flex items-center justify-between">
                <span class="text-2xl font-bold text-gray-900">{{category.jobCount}}</span>
                <span class="text-sm text-gray-500">jobs available</span>
              </div>

              <div *ngIf="category.growth > 0" class="mt-3 pt-3 border-t">
                <div class="flex items-center justify-between text-sm">
                  <span class="text-gray-600">Growth</span>
                  <span class="text-green-600 font-medium">+{{category.growth}}%</span>
                </div>
              </div>
            </div>
          </a>
        </div>

        <!-- List View -->
        <div *ngIf="viewMode === 'list'" class="space-y-4">
          <div *ngFor="let category of getFilteredCategories()"
               class="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-4">
                <div [class]="'w-14 h-14 rounded-lg flex items-center justify-center ' + category.color">
                  <span class="text-3xl">{{category.icon}}</span>
                </div>
                <div>
                  <div class="flex items-center gap-2 mb-1">
                    <h3 class="text-xl font-semibold text-gray-900">{{category.name}}</h3>
                    <span *ngIf="category.trending"
                          class="px-2 py-1 bg-red-100 text-red-600 text-xs font-medium rounded-full">
                      🔥 Trending
                    </span>
                  </div>
                  <p class="text-gray-600">{{category.description}}</p>
                  <div *ngIf="category.subcategories && category.subcategories.length > 0" class="mt-2">
                    <div class="flex flex-wrap gap-2">
                      <span *ngFor="let sub of category.subcategories"
                            class="text-xs px-2 py-1 bg-gray-100 rounded-full text-gray-600">
                        {{sub}}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div class="text-right">
                <div class="text-3xl font-bold text-gray-900">{{category.jobCount}}</div>
                <div class="text-sm text-gray-500">jobs</div>
                <div *ngIf="category.growth > 0" class="mt-2 text-sm text-green-600 font-medium">
                  ↑ {{category.growth}}% this month
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div *ngIf="getFilteredCategories().length === 0"
             class="text-center py-12">
          <svg class="w-24 h-24 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <h3 class="text-lg font-medium text-gray-900 mb-2">No categories found</h3>
          <p class="text-gray-600">Try adjusting your search term</p>
        </div>
      </div>
    </div>
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
export class CategoriesComponent implements OnInit {
  searchTerm: string = '';
  viewMode: 'grid' | 'list' = 'grid';
  totalJobs: number = 0;
  trendingCount: number = 0;
  avgJobsPerCategory: number = 0;

  categories: Category[] = [
    {
      id: 'tech',
      name: 'Technology',
      icon: '💻',
      color: 'bg-blue-100',
      jobCount: 345,
      description: 'Software development, IT, and tech-related positions',
      subcategories: ['Frontend', 'Backend', 'DevOps', 'Mobile', 'AI/ML'],
      trending: true,
      growth: 25
    },
    {
      id: 'healthcare',
      name: 'Healthcare',
      icon: '🏥',
      color: 'bg-red-100',
      jobCount: 223,
      description: 'Medical, nursing, and healthcare professional roles',
      subcategories: ['Nursing', 'Physicians', 'Allied Health', 'Administration'],
      trending: true,
      growth: 18
    },
    {
      id: 'finance',
      name: 'Finance',
      icon: '💰',
      color: 'bg-green-100',
      jobCount: 189,
      description: 'Banking, accounting, and financial services',
      subcategories: ['Accounting', 'Banking', 'Insurance', 'Investment'],
      trending: false,
      growth: 12
    },
    {
      id: 'education',
      name: 'Education',
      icon: '📚',
      color: 'bg-purple-100',
      jobCount: 156,
      description: 'Teaching, training, and educational positions',
      subcategories: ['K-12', 'Higher Ed', 'Corporate Training', 'Online Education'],
      trending: false,
      growth: 8
    },
    {
      id: 'marketing',
      name: 'Marketing',
      icon: '📈',
      color: 'bg-pink-100',
      jobCount: 198,
      description: 'Marketing, advertising, and brand management',
      subcategories: ['Digital Marketing', 'Content', 'SEO/SEM', 'Social Media'],
      trending: true,
      growth: 22
    },
    {
      id: 'sales',
      name: 'Sales',
      icon: '🤝',
      color: 'bg-yellow-100',
      jobCount: 267,
      description: 'Sales, business development, and account management',
      subcategories: ['B2B Sales', 'B2C Sales', 'Inside Sales', 'Account Management'],
      trending: false,
      growth: 15
    },
    {
      id: 'design',
      name: 'Design',
      icon: '🎨',
      color: 'bg-indigo-100',
      jobCount: 134,
      description: 'Creative design, UX/UI, and visual arts',
      subcategories: ['UX/UI', 'Graphic Design', 'Product Design', 'Motion Design'],
      trending: true,
      growth: 28
    },
    {
      id: 'hr',
      name: 'Human Resources',
      icon: '👥',
      color: 'bg-orange-100',
      jobCount: 112,
      description: 'HR, recruitment, and people management',
      subcategories: ['Recruitment', 'Benefits', 'Training', 'HR Operations'],
      trending: false,
      growth: 10
    },
    {
      id: 'engineering',
      name: 'Engineering',
      icon: '⚙️',
      color: 'bg-gray-100',
      jobCount: 245,
      description: 'Engineering and technical positions',
      subcategories: ['Mechanical', 'Electrical', 'Civil', 'Chemical'],
      trending: false,
      growth: 14
    },
    {
      id: 'legal',
      name: 'Legal',
      icon: '⚖️',
      color: 'bg-amber-100',
      jobCount: 89,
      description: 'Legal services and compliance roles',
      subcategories: ['Corporate Law', 'Litigation', 'Compliance', 'Paralegal'],
      trending: false,
      growth: 6
    },
    {
      id: 'customer-service',
      name: 'Customer Service',
      icon: '📞',
      color: 'bg-teal-100',
      jobCount: 178,
      description: 'Customer support and service positions',
      subcategories: ['Call Center', 'Technical Support', 'Customer Success'],
      trending: false,
      growth: 11
    },
    {
      id: 'logistics',
      name: 'Transportation & Logistics',
      icon: '🚚',
      color: 'bg-lime-100',
      jobCount: 98,
      description: 'Supply chain, logistics, and transportation',
      subcategories: ['Supply Chain', 'Warehousing', 'Delivery', 'Fleet Management'],
      trending: false,
      growth: 9
    }
  ];

  ngOnInit() {
    this.calculateStats();
  }

  calculateStats() {
    this.totalJobs = this.categories.reduce((sum, cat) => sum + cat.jobCount, 0);
    this.trendingCount = this.categories.filter(cat => cat.trending).length;
    this.avgJobsPerCategory = Math.round(this.totalJobs / this.categories.length);
  }

  getFilteredCategories(): Category[] {
    if (!this.searchTerm) {
      return this.categories;
    }

    const search = this.searchTerm.toLowerCase();
    return this.categories.filter(cat =>
      cat.name.toLowerCase().includes(search) ||
      cat.description.toLowerCase().includes(search) ||
      cat.subcategories?.some(sub => sub.toLowerCase().includes(search))
    );
  }

  getTrendingCategories(): Category[] {
    return this.categories
      .filter(cat => cat.trending)
      .sort((a, b) => b.growth - a.growth)
      .slice(0, 5);
  }
}
