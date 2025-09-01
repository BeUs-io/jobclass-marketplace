import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CompanyService, Company } from '../../services/company.service';

@Component({
  selector: 'app-companies',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="min-h-screen bg-gray-50">
      <!-- Hero Section -->
      <div class="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div class="container mx-auto px-4">
          <div class="flex justify-between items-start">
            <div>
              <h1 class="text-4xl font-bold mb-4">Explore Companies</h1>
              <p class="text-xl text-blue-100">Discover great places to work and build your career</p>
            </div>
            <a routerLink="/companies/compare"
               class="px-6 py-3 bg-white text-blue-700 font-semibold rounded-lg shadow hover:bg-blue-50 transition-colors flex items-center">
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
              </svg>
              Compare Companies
            </a>
          </div>

          <!-- Search Bar -->
          <div class="mt-8 max-w-2xl">
            <div class="relative">
              <input type="text"
                     [(ngModel)]="searchQuery"
                     (ngModelChange)="onSearchChange($event)"
                     placeholder="Search companies by name, industry, or location..."
                     class="w-full px-4 py-3 pr-12 text-gray-900 bg-white rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-400">
              <svg class="absolute right-4 top-3.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </div>
          </div>

          <!-- Stats -->
          <div class="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div class="bg-white/10 backdrop-blur rounded-lg p-4">
              <div class="text-3xl font-bold">{{ companyService.filteredCompanies().length }}</div>
              <div class="text-blue-100">Companies</div>
            </div>
            <div class="bg-white/10 backdrop-blur rounded-lg p-4">
              <div class="text-3xl font-bold">{{ totalOpenPositions() }}</div>
              <div class="text-blue-100">Open Positions</div>
            </div>
            <div class="bg-white/10 backdrop-blur rounded-lg p-4">
              <div class="text-3xl font-bold">{{ companyService.industries().length }}</div>
              <div class="text-blue-100">Industries</div>
            </div>
            <div class="bg-white/10 backdrop-blur rounded-lg p-4">
              <div class="text-3xl font-bold">{{ verifiedCompaniesCount() }}</div>
              <div class="text-blue-100">Verified Companies</div>
            </div>
          </div>
        </div>
      </div>

      <div class="container mx-auto px-4 py-8">
        <div class="flex flex-col lg:flex-row gap-8">
          <!-- Filters Sidebar -->
          <div class="lg:w-1/4">
            <div class="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <h2 class="text-lg font-semibold mb-4">Filters</h2>

              <!-- Industry Filter -->
              <div class="mb-6">
                <h3 class="text-sm font-semibold text-gray-700 mb-3">Industry</h3>
                <div class="space-y-2 max-h-48 overflow-y-auto">
                  <label *ngFor="let industry of companyService.industries()"
                         class="flex items-center cursor-pointer hover:bg-gray-50 p-1 rounded">
                    <input type="checkbox"
                           [checked]="isIndustrySelected(industry)"
                           (change)="toggleIndustry(industry)"
                           class="mr-2 rounded text-blue-600 focus:ring-blue-500">
                    <span class="text-sm text-gray-700">{{ industry }}</span>
                    <span class="ml-auto text-xs text-gray-500">{{ getIndustryCount(industry) }}</span>
                  </label>
                </div>
              </div>

              <!-- Company Size Filter -->
              <div class="mb-6">
                <h3 class="text-sm font-semibold text-gray-700 mb-3">Company Size</h3>
                <div class="space-y-2">
                  <label *ngFor="let size of companyService.sizes"
                         class="flex items-center cursor-pointer hover:bg-gray-50 p-1 rounded">
                    <input type="checkbox"
                           [checked]="isSizeSelected(size)"
                           (change)="toggleSize(size)"
                           class="mr-2 rounded text-blue-600 focus:ring-blue-500">
                    <span class="text-sm text-gray-700">{{ size }} employees</span>
                  </label>
                </div>
              </div>

              <!-- Location Filter -->
              <div class="mb-6">
                <h3 class="text-sm font-semibold text-gray-700 mb-3">Location</h3>
                <div class="space-y-2 max-h-48 overflow-y-auto">
                  <label *ngFor="let location of companyService.locations()"
                         class="flex items-center cursor-pointer hover:bg-gray-50 p-1 rounded">
                    <input type="checkbox"
                           [checked]="isLocationSelected(location)"
                           (change)="toggleLocation(location)"
                           class="mr-2 rounded text-blue-600 focus:ring-blue-500">
                    <span class="text-sm text-gray-700">{{ location }}</span>
                  </label>
                </div>
              </div>

              <!-- Rating Filter -->
              <div class="mb-6">
                <h3 class="text-sm font-semibold text-gray-700 mb-3">Minimum Rating</h3>
                <div class="flex items-center space-x-2">
                  <input type="range"
                         min="0"
                         max="5"
                         step="0.5"
                         [(ngModel)]="minRating"
                         (ngModelChange)="onRatingChange($event)"
                         class="flex-1">
                  <span class="text-sm font-medium text-gray-700 w-8">{{ minRating }}</span>
                </div>
                <div class="mt-2 flex items-center">
                  <div class="flex text-yellow-400">
                    <svg *ngFor="let star of [1,2,3,4,5]"
                         [class.text-gray-300]="star > minRating"
                         class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                    </svg>
                  </div>
                  <span class="ml-2 text-sm text-gray-600">& above</span>
                </div>
              </div>

              <!-- Additional Filters -->
              <div class="mb-6">
                <h3 class="text-sm font-semibold text-gray-700 mb-3">More Filters</h3>
                <label class="flex items-center cursor-pointer hover:bg-gray-50 p-1 rounded mb-2">
                  <input type="checkbox"
                         [(ngModel)]="showVerifiedOnly"
                         (ngModelChange)="onVerifiedChange($event)"
                         class="mr-2 rounded text-blue-600 focus:ring-blue-500">
                  <span class="text-sm text-gray-700">Verified Companies Only</span>
                </label>
                <label class="flex items-center cursor-pointer hover:bg-gray-50 p-1 rounded">
                  <input type="checkbox"
                         [(ngModel)]="showWithOpenings"
                         (ngModelChange)="onOpeningsChange($event)"
                         class="mr-2 rounded text-blue-600 focus:ring-blue-500">
                  <span class="text-sm text-gray-700">Has Open Positions</span>
                </label>
              </div>

              <!-- Clear Filters -->
              <button (click)="clearFilters()"
                      class="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                Clear All Filters
              </button>
            </div>
          </div>

          <!-- Companies List -->
          <div class="lg:w-3/4">
            <!-- Sort Bar -->
            <div class="bg-white rounded-lg shadow-md p-4 mb-6">
              <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                <div class="mb-4 sm:mb-0">
                  <span class="text-gray-600">Showing </span>
                  <span class="font-semibold">{{ companyService.filteredCompanies().length }}</span>
                  <span class="text-gray-600"> companies</span>
                </div>
                <div class="flex items-center space-x-2">
                  <span class="text-sm text-gray-600">Sort by:</span>
                  <select [(ngModel)]="sortBy"
                          (ngModelChange)="onSortChange($event)"
                          class="px-3 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="rating">Rating</option>
                    <option value="name">Name</option>
                    <option value="openings">Open Positions</option>
                    <option value="size">Company Size</option>
                  </select>
                </div>
              </div>
            </div>

            <!-- Company Cards -->
            <div class="grid gap-6">
              <div *ngFor="let company of companyService.filteredCompanies()"
                   class="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow">
                <div class="p-6">
                  <div class="flex items-start justify-between">
                    <div class="flex items-start space-x-4">
                      <!-- Company Logo -->
                      <div class="w-16 h-16 rounded-lg flex items-center justify-center text-white font-bold text-xl"
                           [style.background-color]="getCompanyColor(company.id)">
                        {{ company.logo }}
                      </div>

                      <!-- Company Info -->
                      <div class="flex-1">
                        <div class="flex items-center space-x-2">
                          <a [routerLink]="['/company', company.id]"
                             class="text-xl font-bold text-gray-900 hover:text-blue-600">
                            {{ company.name }}
                          </a>
                          <span *ngIf="company.verified"
                                class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                            <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path fill-rule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                            </svg>
                            Verified
                          </span>
                        </div>

                        <div class="mt-1 flex items-center space-x-4 text-sm text-gray-600">
                          <span class="flex items-center">
                            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                            </svg>
                            {{ company.industry }}
                          </span>
                          <span class="flex items-center">
                            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                            </svg>
                            {{ company.location }}
                          </span>
                          <span class="flex items-center">
                            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/>
                            </svg>
                            {{ company.size }} employees
                          </span>
                        </div>

                        <p class="mt-3 text-gray-600 line-clamp-2">{{ company.description }}</p>

                        <!-- Key Benefits -->
                        <div class="mt-3 flex flex-wrap gap-2">
                          <span *ngFor="let benefit of company.benefits.slice(0, 3)"
                                class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            {{ benefit }}
                          </span>
                          <span *ngIf="company.benefits.length > 3"
                                class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            +{{ company.benefits.length - 3 }} more
                          </span>
                        </div>

                        <!-- Tech Stack (if available) -->
                        <div *ngIf="company.techStack && company.techStack.length > 0" class="mt-3">
                          <div class="flex flex-wrap gap-2">
                            <span *ngFor="let tech of company.techStack.slice(0, 4)"
                                  class="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                              {{ tech }}
                            </span>
                            <span *ngIf="company.techStack.length > 4"
                                  class="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-700">
                              +{{ company.techStack.length - 4 }} more
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <!-- Right Side Info -->
                    <div class="flex flex-col items-end space-y-2">
                      <!-- Rating -->
                      <div class="flex items-center space-x-1">
                        <span class="text-2xl font-bold text-gray-900">{{ company.rating }}</span>
                        <div class="flex flex-col">
                          <div class="flex text-yellow-400">
                            <svg *ngFor="let star of [1,2,3,4,5]"
                                 [class.text-gray-300]="star > company.rating"
                                 class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                            </svg>
                          </div>
                          <span class="text-xs text-gray-500">{{ company.reviewCount }} reviews</span>
                        </div>
                      </div>

                      <!-- Follow Button -->
                      <button (click)="toggleFollow(company.id)"
                              [class.bg-blue-600]="!isFollowing(company.id)"
                              [class.text-white]="!isFollowing(company.id)"
                              [class.hover:bg-blue-700]="!isFollowing(company.id)"
                              [class.bg-gray-100]="isFollowing(company.id)"
                              [class.text-gray-700]="isFollowing(company.id)"
                              [class.hover:bg-gray-200]="isFollowing(company.id)"
                              class="px-4 py-2 rounded-lg font-medium transition-colors">
                        {{ isFollowing(company.id) ? 'Following' : 'Follow' }}
                      </button>
                    </div>
                  </div>

                  <!-- Bottom Stats -->
                  <div class="mt-4 pt-4 border-t border-gray-200 flex items-center justify-between">
                    <div class="flex items-center space-x-6 text-sm">
                      <span class="flex items-center text-gray-600">
                        <svg class="w-4 h-4 mr-1 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A11.996 11.996 0 0112 24c-6.627 0-12-5.373-12-12C0 5.373 5.373 0 12 0c2.54 0 4.894.79 6.834 2.135"/>
                        </svg>
                        <span class="font-semibold text-gray-900">{{ company.openPositions }}</span>
                        <span class="ml-1">open positions</span>
                      </span>
                      <span class="flex items-center text-gray-600">
                        <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
                        </svg>
                        <span class="font-semibold text-gray-900">{{ company.followers | number }}</span>
                        <span class="ml-1">followers</span>
                      </span>
                      <span class="text-gray-600">
                        Founded <span class="font-semibold text-gray-900">{{ company.founded }}</span>
                      </span>
                    </div>
                    <a [routerLink]="['/company', company.id]"
                       class="text-blue-600 hover:text-blue-700 font-medium flex items-center">
                      View Details
                      <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <!-- No Results -->
            <div *ngIf="companyService.filteredCompanies().length === 0"
                 class="bg-white rounded-lg shadow-md p-12 text-center">
              <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
              </svg>
              <h3 class="mt-2 text-lg font-medium text-gray-900">No companies found</h3>
              <p class="mt-1 text-gray-500">Try adjusting your filters or search criteria.</p>
              <button (click)="clearFilters()"
                      class="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Clear Filters
              </button>
            </div>
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
export class CompaniesComponent implements OnInit {
  searchQuery = '';
  minRating = 0;
  showVerifiedOnly = false;
  showWithOpenings = false;
  sortBy: 'rating' | 'name' | 'openings' | 'size' = 'rating';
  followedCompanies = signal<Set<string>>(new Set());

  constructor(public companyService: CompanyService) {}

  ngOnInit(): void {
    this.loadFollowedCompanies();
  }

  loadFollowedCompanies(): void {
    this.companyService.followedCompanies$.subscribe(followed => {
      this.followedCompanies.set(followed);
    });
  }

  onSearchChange(query: string): void {
    this.companyService.searchTerm.set(query);
  }

  onRatingChange(rating: number): void {
    this.companyService.minRating.set(rating);
  }

  onVerifiedChange(verified: boolean): void {
    this.companyService.showVerifiedOnly.set(verified);
  }

  onOpeningsChange(hasOpenings: boolean): void {
    this.companyService.showWithOpeningsOnly.set(hasOpenings);
  }

  onSortChange(sortBy: 'rating' | 'name' | 'openings' | 'size'): void {
    this.companyService.sortBy.set(sortBy);
  }

  toggleIndustry(industry: string): void {
    const current = this.companyService.selectedIndustries();
    const index = current.indexOf(industry);
    if (index === -1) {
      this.companyService.selectedIndustries.set([...current, industry]);
    } else {
      this.companyService.selectedIndustries.set(current.filter(i => i !== industry));
    }
  }

  toggleSize(size: string): void {
    const current = this.companyService.selectedSizes();
    const index = current.indexOf(size);
    if (index === -1) {
      this.companyService.selectedSizes.set([...current, size]);
    } else {
      this.companyService.selectedSizes.set(current.filter(s => s !== size));
    }
  }

  toggleLocation(location: string): void {
    const current = this.companyService.selectedLocations();
    const index = current.indexOf(location);
    if (index === -1) {
      this.companyService.selectedLocations.set([...current, location]);
    } else {
      this.companyService.selectedLocations.set(current.filter(l => l !== location));
    }
  }

  isIndustrySelected(industry: string): boolean {
    return this.companyService.selectedIndustries().includes(industry);
  }

  isSizeSelected(size: string): boolean {
    return this.companyService.selectedSizes().includes(size);
  }

  isLocationSelected(location: string): boolean {
    return this.companyService.selectedLocations().includes(location);
  }

  clearFilters(): void {
    this.searchQuery = '';
    this.minRating = 0;
    this.showVerifiedOnly = false;
    this.showWithOpenings = false;
    this.companyService.searchTerm.set('');
    this.companyService.selectedIndustries.set([]);
    this.companyService.selectedSizes.set([]);
    this.companyService.selectedLocations.set([]);
    this.companyService.minRating.set(0);
    this.companyService.showVerifiedOnly.set(false);
    this.companyService.showWithOpeningsOnly.set(false);
  }

  toggleFollow(companyId: string): void {
    if (this.isFollowing(companyId)) {
      this.companyService.unfollowCompany(companyId).subscribe();
    } else {
      this.companyService.followCompany(companyId).subscribe();
    }
  }

  isFollowing(companyId: string): boolean {
    return this.followedCompanies().has(companyId);
  }

  getCompanyColor(companyId: string): string {
    const colors = [
      '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6',
      '#EC4899', '#06B6D4', '#F97316', '#6366F1', '#84CC16'
    ];
    const index = parseInt(companyId) % colors.length;
    return colors[index];
  }

  getIndustryCount(industry: string): number {
    return this.companyService.filteredCompanies()
      .filter(c => c.industry === industry).length;
  }

  totalOpenPositions(): number {
    return this.companyService.filteredCompanies()
      .reduce((sum, company) => sum + company.openPositions, 0);
  }

  verifiedCompaniesCount(): number {
    return this.companyService.filteredCompanies()
      .filter(c => c.verified).length;
  }
}
