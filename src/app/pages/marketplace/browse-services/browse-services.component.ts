import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { FreelanceMarketplaceService } from '../../../services/freelance.service';
import { FreelanceService } from '../../../models/freelance.model';

@Component({
  selector: 'app-browse-services',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="min-h-screen bg-gray-50">
      <!-- Header -->
      <div class="bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-12">
        <div class="container mx-auto px-4">
          <h1 class="text-4xl font-bold mb-4">Browse Services</h1>
          <p class="text-xl text-emerald-100">Find the perfect freelancer for your project</p>
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
                <select [(ngModel)]="selectedCategory" (change)="applyFilters()"
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500">
                  <option value="">All Categories</option>
                  @for (cat of categories; track cat.name) {
                    <option [value]="cat.name">{{ cat.name }}</option>
                  }
                </select>
              </div>

              <!-- Price Range -->
              <div class="mb-6">
                <label class="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
                <div class="space-y-2">
                  <input type="number" [(ngModel)]="minPrice" placeholder="Min"
                         class="w-full px-3 py-2 border border-gray-300 rounded-lg">
                  <input type="number" [(ngModel)]="maxPrice" placeholder="Max"
                         class="w-full px-3 py-2 border border-gray-300 rounded-lg">
                </div>
              </div>

              <!-- Delivery Time -->
              <div class="mb-6">
                <label class="block text-sm font-medium text-gray-700 mb-2">Delivery Time</label>
                <select [(ngModel)]="deliveryTime" (change)="applyFilters()"
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg">
                  <option value="">Any</option>
                  <option value="24h">Up to 24 hours</option>
                  <option value="3d">Up to 3 days</option>
                  <option value="7d">Up to 7 days</option>
                  <option value="month">Up to 1 month</option>
                </select>
              </div>

              <!-- Seller Level -->
              <div class="mb-6">
                <label class="block text-sm font-medium text-gray-700 mb-2">Seller Level</label>
                <div class="space-y-2">
                  @for (level of sellerLevels; track level.value) {
                    <label class="flex items-center">
                      <input type="checkbox" [value]="level.value"
                             (change)="toggleLevel(level.value)"
                             class="mr-2 text-teal-600 rounded">
                      <span class="text-sm">{{ level.label }}</span>
                    </label>
                  }
                </div>
              </div>

              <button (click)="resetFilters()"
                      class="w-full py-2 text-sm text-gray-600 hover:text-gray-800">
                Clear All Filters
              </button>
            </div>
          </aside>

          <!-- Services Grid -->
          <div class="flex-1">
            <!-- Sort and View Options -->
            <div class="bg-white rounded-lg shadow-sm p-4 mb-6">
              <div class="flex justify-between items-center">
                <p class="text-gray-600">{{ filteredServices.length }} services available</p>
                <div class="flex gap-4">
                  <select [(ngModel)]="sortBy" (change)="sortServices()"
                          class="px-4 py-2 border border-gray-300 rounded-lg">
                    <option value="relevance">Most Relevant</option>
                    <option value="rating">Best Rating</option>
                    <option value="orders">Most Orders</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                  </select>
                </div>
              </div>
            </div>

            <!-- Services Grid -->
            <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              @for (service of filteredServices; track service.id) {
                <div class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow cursor-pointer"
                     [routerLink]="['/service', service.id]">
                  <!-- Service Image -->
                  <div class="aspect-video bg-gradient-to-br from-teal-400 to-emerald-500 relative">
                    @if (service.featured) {
                      <span class="absolute top-2 left-2 bg-yellow-500 text-white px-2 py-1 rounded text-xs font-semibold">
                        Featured
                      </span>
                    }
                    @if (service.video) {
                      <div class="absolute top-2 right-2 bg-black/50 text-white p-2 rounded-full">
                        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z"/>
                        </svg>
                      </div>
                    }
                  </div>

                  <!-- Service Info -->
                  <div class="p-4">
                    <!-- Seller Info -->
                    <div class="flex items-center gap-3 mb-3">
                      <div class="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                        {{ service.freelancerAvatar }}
                      </div>
                      <div>
                        <p class="font-medium text-sm">{{ service.freelancerName }}</p>
                        <div class="flex items-center gap-1">
                          <span class="text-xs px-2 py-0.5 bg-teal-100 text-teal-700 rounded">
                            {{ getLevelBadge(service.level) }}
                          </span>
                        </div>
                      </div>
                    </div>

                    <!-- Service Title -->
                    <h3 class="font-semibold text-gray-800 mb-2 line-clamp-2">
                      {{ service.title }}
                    </h3>

                    <!-- Rating and Orders -->
                    <div class="flex items-center gap-4 mb-3">
                      <div class="flex items-center gap-1">
                        <svg class="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                        </svg>
                        <span class="text-sm font-semibold">{{ service.freelancerRating }}</span>
                        <span class="text-xs text-gray-500">({{ service.freelancerReviews }})</span>
                      </div>
                      <span class="text-xs text-gray-500">{{ service.totalOrders }} orders</span>
                    </div>

                    <!-- Price -->
                    <div class="flex justify-between items-center pt-3 border-t">
                      <span class="text-xs text-gray-500">Starting at</span>
                      <span class="text-xl font-bold text-teal-600">\${{ service.pricing.startingPrice }}</span>
                    </div>
                  </div>
                </div>
              }
            </div>

            <!-- Load More -->
            @if (hasMore) {
              <div class="text-center mt-8">
                <button (click)="loadMore()"
                        class="px-8 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors">
                  Load More Services
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
export class BrowseServicesComponent implements OnInit {
  services: FreelanceService[] = [];
  filteredServices: FreelanceService[] = [];

  // Filter options
  selectedCategory = '';
  minPrice: number | null = null;
  maxPrice: number | null = null;
  deliveryTime = '';
  selectedLevels: string[] = [];

  // Sort
  sortBy = 'relevance';

  hasMore = false;

  categories = [
    { name: 'Graphics & Design', subcategories: [] },
    { name: 'Programming & Tech', subcategories: [] },
    { name: 'Digital Marketing', subcategories: [] },
    { name: 'Writing & Translation', subcategories: [] },
    { name: 'Video & Animation', subcategories: [] }
  ];

  sellerLevels = [
    { value: 'new', label: 'New Seller' },
    { value: 'level-1', label: 'Level 1' },
    { value: 'level-2', label: 'Level 2' },
    { value: 'top-rated', label: 'Top Rated' }
  ];

  constructor(private freelanceService: FreelanceMarketplaceService) {}

  ngOnInit() {
    this.loadServices();
  }

  loadServices() {
    this.freelanceService.getFreelanceServices().subscribe(services => {
      this.services = services;
      this.filteredServices = [...services];
      this.sortServices();
    });
  }

  applyFilters() {
    this.filteredServices = this.services.filter(service => {
      // Category filter
      if (this.selectedCategory && service.category !== this.selectedCategory) {
        return false;
      }

      // Price filter
      if (this.minPrice && service.pricing.startingPrice < this.minPrice) {
        return false;
      }
      if (this.maxPrice && service.pricing.startingPrice > this.maxPrice) {
        return false;
      }

      // Level filter
      if (this.selectedLevels.length > 0 && !this.selectedLevels.includes(service.level)) {
        return false;
      }

      return true;
    });

    this.sortServices();
  }

  sortServices() {
    switch (this.sortBy) {
      case 'rating':
        this.filteredServices.sort((a, b) => b.freelancerRating - a.freelancerRating);
        break;
      case 'orders':
        this.filteredServices.sort((a, b) => b.totalOrders - a.totalOrders);
        break;
      case 'price-low':
        this.filteredServices.sort((a, b) => a.pricing.startingPrice - b.pricing.startingPrice);
        break;
      case 'price-high':
        this.filteredServices.sort((a, b) => b.pricing.startingPrice - a.pricing.startingPrice);
        break;
    }
  }

  toggleLevel(level: string) {
    const index = this.selectedLevels.indexOf(level);
    if (index > -1) {
      this.selectedLevels.splice(index, 1);
    } else {
      this.selectedLevels.push(level);
    }
    this.applyFilters();
  }

  resetFilters() {
    this.selectedCategory = '';
    this.minPrice = null;
    this.maxPrice = null;
    this.deliveryTime = '';
    this.selectedLevels = [];
    this.applyFilters();
  }

  loadMore() {
    // Implement pagination
  }

  getLevelBadge(level: string): string {
    const badges: { [key: string]: string } = {
      'new': 'New Seller',
      'level-1': 'Level 1',
      'level-2': 'Level 2',
      'top-rated': 'Top Rated'
    };
    return badges[level] || 'New';
  }
}
