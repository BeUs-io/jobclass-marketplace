import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { FreelanceMarketplaceService } from '../../../services/freelance.service';
import { Project } from '../../../models/freelance.model';

@Component({
  selector: 'app-browse-projects',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="min-h-screen bg-gray-50">
      <!-- Header -->
      <div class="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-12">
        <div class="container mx-auto px-4">
          <h1 class="text-4xl font-bold mb-4">Find Projects</h1>
          <p class="text-xl text-indigo-100">Discover opportunities that match your skills</p>
        </div>
      </div>

      <div class="container mx-auto px-4 py-8">
        <div class="flex gap-8">
          <!-- Filters Sidebar -->
          <aside class="w-64 flex-shrink-0">
            <div class="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <h3 class="font-semibold text-lg mb-4">Filters</h3>

              <!-- Category Filter -->
              <div class="mb-6">
                <label class="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select [(ngModel)]="filters.category" (change)="applyFilters()"
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500">
                  <option value="">All Categories</option>
                  <option value="Design">Design</option>
                  <option value="Development">Development</option>
                  <option value="Writing">Writing</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Video">Video & Animation</option>
                </select>
              </div>

              <!-- Budget Type -->
              <div class="mb-6">
                <label class="block text-sm font-medium text-gray-700 mb-2">Budget Type</label>
                <div class="space-y-2">
                  <label class="flex items-center">
                    <input type="radio" name="budgetType" value=""
                           [(ngModel)]="filters.budgetType" (change)="applyFilters()"
                           class="mr-2 text-indigo-600">
                    <span class="text-sm">All</span>
                  </label>
                  <label class="flex items-center">
                    <input type="radio" name="budgetType" value="fixed"
                           [(ngModel)]="filters.budgetType" (change)="applyFilters()"
                           class="mr-2 text-indigo-600">
                    <span class="text-sm">Fixed Price</span>
                  </label>
                  <label class="flex items-center">
                    <input type="radio" name="budgetType" value="hourly"
                           [(ngModel)]="filters.budgetType" (change)="applyFilters()"
                           class="mr-2 text-indigo-600">
                    <span class="text-sm">Hourly Rate</span>
                  </label>
                </div>
              </div>

              <!-- Budget Range -->
              <div class="mb-6">
                <label class="block text-sm font-medium text-gray-700 mb-2">Budget Range</label>
                <div class="space-y-2">
                  <input type="number" [(ngModel)]="filters.minBudget" placeholder="Min"
                         class="w-full px-3 py-2 border border-gray-300 rounded-lg">
                  <input type="number" [(ngModel)]="filters.maxBudget" placeholder="Max"
                         class="w-full px-3 py-2 border border-gray-300 rounded-lg">
                </div>
              </div>

              <!-- Experience Level -->
              <div class="mb-6">
                <label class="block text-sm font-medium text-gray-700 mb-2">Experience Level</label>
                <div class="space-y-2">
                  @for (level of experienceLevels; track level.value) {
                    <label class="flex items-center">
                      <input type="checkbox" [value]="level.value"
                             (change)="toggleExperience(level.value)"
                             class="mr-2 text-indigo-600 rounded">
                      <span class="text-sm">{{ level.label }}</span>
                    </label>
                  }
                </div>
              </div>

              <!-- Location -->
              <div class="mb-6">
                <label class="block text-sm font-medium text-gray-700 mb-2">Location</label>
                <select [(ngModel)]="filters.location" (change)="applyFilters()"
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg">
                  <option value="">Any</option>
                  <option value="remote">Remote</option>
                  <option value="onsite">On-site</option>
                  <option value="hybrid">Hybrid</option>
                </select>
              </div>

              <!-- Project Features -->
              <div class="mb-6">
                <label class="block text-sm font-medium text-gray-700 mb-2">Features</label>
                <div class="space-y-2">
                  <label class="flex items-center">
                    <input type="checkbox" [(ngModel)]="filters.paymentVerified"
                           (change)="applyFilters()"
                           class="mr-2 text-indigo-600 rounded">
                    <span class="text-sm">Payment Verified</span>
                  </label>
                  <label class="flex items-center">
                    <input type="checkbox" [(ngModel)]="filters.urgent"
                           (change)="applyFilters()"
                           class="mr-2 text-indigo-600 rounded">
                    <span class="text-sm">Urgent</span>
                  </label>
                  <label class="flex items-center">
                    <input type="checkbox" [(ngModel)]="filters.featured"
                           (change)="applyFilters()"
                           class="mr-2 text-indigo-600 rounded">
                    <span class="text-sm">Featured</span>
                  </label>
                </div>
              </div>

              <button (click)="resetFilters()"
                      class="w-full py-2 text-sm text-gray-600 hover:text-gray-800">
                Clear All Filters
              </button>
            </div>
          </aside>

          <!-- Projects List -->
          <div class="flex-1">
            <!-- Sort and Search -->
            <div class="bg-white rounded-lg shadow-sm p-4 mb-6">
              <div class="flex flex-col md:flex-row gap-4">
                <div class="flex-1">
                  <input type="text" [(ngModel)]="searchQuery"
                         (keyup.enter)="applyFilters()"
                         placeholder="Search projects..."
                         class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500">
                </div>
                <select [(ngModel)]="sortBy" (change)="sortProjects()"
                        class="px-4 py-2 border border-gray-300 rounded-lg">
                  <option value="newest">Newest First</option>
                  <option value="budget-high">Budget: High to Low</option>
                  <option value="budget-low">Budget: Low to High</option>
                  <option value="proposals-low">Fewer Proposals</option>
                </select>
              </div>
              <div class="mt-3 text-sm text-gray-600">
                {{ filteredProjects.length }} projects found
              </div>
            </div>

            <!-- Projects List -->
            <div class="space-y-4">
              @for (project of filteredProjects; track project.id) {
                <div class="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6"
                     [routerLink]="['/project', project.id]">
                  <!-- Project Header -->
                  <div class="flex justify-between items-start mb-4">
                    <div>
                      <div class="flex items-center gap-2 mb-2">
                        @if (project.urgent) {
                          <span class="px-2 py-1 bg-red-100 text-red-600 rounded text-xs font-semibold">
                            Urgent
                          </span>
                        }
                        @if (project.featured) {
                          <span class="px-2 py-1 bg-yellow-100 text-yellow-600 rounded text-xs font-semibold">
                            Featured
                          </span>
                        }
                      </div>
                      <h3 class="text-xl font-semibold text-gray-800 hover:text-indigo-600 cursor-pointer">
                        {{ project.title }}
                      </h3>
                    </div>
                    @if (project.paymentVerified) {
                      <div class="flex items-center gap-1 text-green-600">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
                        <span class="text-sm">Payment Verified</span>
                      </div>
                    }
                  </div>

                  <!-- Project Details -->
                  <p class="text-gray-600 mb-4 line-clamp-2">{{ project.description }}</p>

                  <!-- Skills -->
                  <div class="flex flex-wrap gap-2 mb-4">
                    @for (skill of project.skillsRequired.slice(0, 5); track skill) {
                      <span class="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                        {{ skill }}
                      </span>
                    }
                    @if (project.skillsRequired.length > 5) {
                      <span class="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                        +{{ project.skillsRequired.length - 5 }} more
                      </span>
                    }
                  </div>

                  <!-- Project Meta -->
                  <div class="flex flex-wrap items-center gap-6 text-sm">
                    <!-- Budget -->
                    <div>
                      <span class="text-gray-500">Budget:</span>
                      <span class="font-semibold text-gray-800 ml-1">
                        @if (project.budget.type === 'fixed') {
                          \${{ project.budget.min }}-\${{ project.budget.max }}
                        } @else {
                          \${{ project.budget.min }}-\${{ project.budget.max }}/hr
                        }
                      </span>
                    </div>

                    <!-- Experience Level -->
                    <div>
                      <span class="text-gray-500">Experience:</span>
                      <span class="font-semibold text-gray-800 ml-1 capitalize">
                        {{ project.experienceLevel }}
                      </span>
                    </div>

                    <!-- Duration -->
                    <div>
                      <span class="text-gray-500">Duration:</span>
                      <span class="font-semibold text-gray-800 ml-1">
                        {{ project.duration.estimated }} {{ project.duration.unit }}
                      </span>
                    </div>

                    <!-- Location -->
                    <div>
                      <span class="text-gray-500">Location:</span>
                      <span class="font-semibold text-gray-800 ml-1 capitalize">
                        {{ project.location }}
                      </span>
                    </div>

                    <!-- Proposals -->
                    <div class="ml-auto">
                      <span class="text-indigo-600 font-semibold">
                        {{ project.proposals }} proposals
                      </span>
                    </div>
                  </div>

                  <!-- Client Info -->
                  <div class="mt-4 pt-4 border-t flex items-center justify-between">
                    <div class="flex items-center gap-3">
                      <div class="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center font-bold text-gray-600">
                        {{ project.clientAvatar }}
                      </div>
                      <div>
                        <p class="font-medium text-sm">{{ project.clientName }}</p>
                        <div class="flex items-center gap-2 text-xs text-gray-500">
                          <div class="flex items-center gap-1">
                            <svg class="w-3 h-3 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                            </svg>
                            <span>{{ project.clientRating }}</span>
                          </div>
                          <span>•</span>
                          <span>\${{ project.clientHistory.totalSpent / 1000 }}k spent</span>
                          <span>•</span>
                          <span>{{ project.clientHistory.hireRate }}% hire rate</span>
                        </div>
                      </div>
                    </div>
                    <div class="text-sm text-gray-500">
                      Posted {{ getTimeAgo(project.postedAt) }}
                    </div>
                  </div>
                </div>
              }
            </div>

            <!-- Load More -->
            @if (hasMore) {
              <div class="text-center mt-8">
                <button (click)="loadMore()"
                        class="px-8 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                  Load More Projects
                </button>
              </div>
            }
          </div>
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
export class BrowseProjectsComponent implements OnInit {
  projects: Project[] = [];
  filteredProjects: Project[] = [];
  searchQuery = '';
  sortBy = 'newest';
  hasMore = false;

  filters = {
    category: '',
    budgetType: '',
    minBudget: null as number | null,
    maxBudget: null as number | null,
    experienceLevels: [] as string[],
    location: '',
    paymentVerified: false,
    urgent: false,
    featured: false
  };

  experienceLevels = [
    { value: 'entry', label: 'Entry Level' },
    { value: 'intermediate', label: 'Intermediate' },
    { value: 'expert', label: 'Expert' }
  ];

  constructor(private freelanceService: FreelanceMarketplaceService) {}

  ngOnInit() {
    this.loadProjects();
  }

  loadProjects() {
    this.freelanceService.getProjects().subscribe(projects => {
      this.projects = projects;
      this.applyFilters();
    });
  }

  applyFilters() {
    this.filteredProjects = this.projects.filter(project => {
      // Search query
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase();
        if (!project.title.toLowerCase().includes(query) &&
            !project.description.toLowerCase().includes(query) &&
            !project.skillsRequired.some(skill => skill.toLowerCase().includes(query))) {
          return false;
        }
      }

      // Category filter
      if (this.filters.category && project.category !== this.filters.category) {
        return false;
      }

      // Budget type filter
      if (this.filters.budgetType && project.budget.type !== this.filters.budgetType) {
        return false;
      }

      // Budget range filter
      if (this.filters.minBudget && project.budget.max < this.filters.minBudget) {
        return false;
      }
      if (this.filters.maxBudget && project.budget.min > this.filters.maxBudget) {
        return false;
      }

      // Experience level filter
      if (this.filters.experienceLevels.length > 0 &&
          !this.filters.experienceLevels.includes(project.experienceLevel)) {
        return false;
      }

      // Location filter
      if (this.filters.location && project.location !== this.filters.location) {
        return false;
      }

      // Feature filters
      if (this.filters.paymentVerified && !project.paymentVerified) {
        return false;
      }
      if (this.filters.urgent && !project.urgent) {
        return false;
      }
      if (this.filters.featured && !project.featured) {
        return false;
      }

      return true;
    });

    this.sortProjects();
  }

  sortProjects() {
    switch (this.sortBy) {
      case 'newest':
        this.filteredProjects.sort((a, b) =>
          new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime());
        break;
      case 'budget-high':
        this.filteredProjects.sort((a, b) => b.budget.max - a.budget.max);
        break;
      case 'budget-low':
        this.filteredProjects.sort((a, b) => a.budget.min - b.budget.min);
        break;
      case 'proposals-low':
        this.filteredProjects.sort((a, b) => a.proposals - b.proposals);
        break;
    }
  }

  toggleExperience(level: string) {
    const index = this.filters.experienceLevels.indexOf(level);
    if (index > -1) {
      this.filters.experienceLevels.splice(index, 1);
    } else {
      this.filters.experienceLevels.push(level);
    }
    this.applyFilters();
  }

  resetFilters() {
    this.filters = {
      category: '',
      budgetType: '',
      minBudget: null,
      maxBudget: null,
      experienceLevels: [],
      location: '',
      paymentVerified: false,
      urgent: false,
      featured: false
    };
    this.searchQuery = '';
    this.applyFilters();
  }

  loadMore() {
    // Implement pagination
  }

  getTimeAgo(date: Date): string {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours} hours ago`;
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
    return `${Math.floor(days / 30)} months ago`;
  }
}
