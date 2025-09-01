import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { FreelanceMarketplaceService } from '../../../services/freelance.service';
import { FreelanceService, ServicePackage } from '../../../models/freelance.model';

@Component({
  selector: 'app-service-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="min-h-screen bg-gray-50">
      @if (service) {
        <!-- Breadcrumb -->
        <div class="bg-white border-b">
          <div class="container mx-auto px-4 py-3">
            <nav class="flex items-center gap-2 text-sm">
              <a routerLink="/" class="text-gray-500 hover:text-gray-700">Home</a>
              <span class="text-gray-400">/</span>
              <a routerLink="/services" class="text-gray-500 hover:text-gray-700">Services</a>
              <span class="text-gray-400">/</span>
              <span class="text-gray-700">{{ service.category }}</span>
            </nav>
          </div>
        </div>

        <div class="container mx-auto px-4 py-8">
          <div class="grid lg:grid-cols-3 gap-8">
            <!-- Main Content -->
            <div class="lg:col-span-2">
              <!-- Service Title -->
              <h1 class="text-3xl font-bold text-gray-800 mb-4">{{ service.title }}</h1>

              <!-- Seller Info -->
              <div class="flex items-center gap-4 mb-6 pb-6 border-b">
                <div class="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  {{ service.freelancerAvatar }}
                </div>
                <div>
                  <h3 class="font-semibold text-lg">{{ service.freelancerName }}</h3>
                  <div class="flex items-center gap-3 mt-1">
                    <div class="flex items-center gap-1">
                      @for (i of [1,2,3,4,5]; track i) {
                        <svg class="w-4 h-4" [class.text-yellow-500]="i <= service.freelancerRating"
                             [class.text-gray-300]="i > service.freelancerRating" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                        </svg>
                      }
                      <span class="text-sm font-semibold ml-1">{{ service.freelancerRating }}</span>
                      <span class="text-sm text-gray-500">({{ service.freelancerReviews }} reviews)</span>
                    </div>
                    <span class="text-sm text-gray-500">{{ service.totalOrders }} orders</span>
                    <span class="text-sm px-2 py-1 bg-teal-100 text-teal-700 rounded">
                      {{ getLevelBadge(service.level) }}
                    </span>
                  </div>
                </div>
              </div>

              <!-- Gallery -->
              <div class="mb-8">
                <div class="aspect-video bg-gradient-to-br from-teal-400 to-emerald-500 rounded-lg overflow-hidden">
                  @if (service.images?.[0]) {
                    <img [src]="service.images[0]" [alt]="service.title" class="w-full h-full object-cover">
                  }
                </div>
                @if (service.images && service.images.length > 1) {
                  <div class="flex gap-2 mt-2">
                    @for (image of service.images.slice(1); track image) {
                      <div class="w-20 h-20 bg-gray-200 rounded overflow-hidden cursor-pointer hover:opacity-80">
                        <img [src]="image" class="w-full h-full object-cover">
                      </div>
                    }
                  </div>
                }
              </div>

              <!-- Description -->
              <div class="mb-8">
                <h2 class="text-2xl font-semibold mb-4">About This Service</h2>
                <div class="prose max-w-none text-gray-700">
                  {{ service.description }}
                </div>
              </div>

              <!-- Skills -->
              @if (service.skills && service.skills.length > 0) {
                <div class="mb-8">
                  <h2 class="text-2xl font-semibold mb-4">Skills & Expertise</h2>
                  <div class="flex flex-wrap gap-2">
                    @for (skill of service.skills; track skill) {
                      <span class="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                        {{ skill }}
                      </span>
                    }
                  </div>
                </div>
              }

              <!-- FAQ -->
              @if (service.faq && service.faq.length > 0) {
                <div class="mb-8">
                  <h2 class="text-2xl font-semibold mb-4">Frequently Asked Questions</h2>
                  <div class="space-y-4">
                    @for (item of service.faq; track item.question) {
                      <div class="bg-white rounded-lg p-4">
                        <h4 class="font-semibold text-gray-800 mb-2">{{ item.question }}</h4>
                        <p class="text-gray-600">{{ item.answer }}</p>
                      </div>
                    }
                  </div>
                </div>
              }

              <!-- Reviews Section -->
              <div class="mb-8">
                <h2 class="text-2xl font-semibold mb-4">Reviews</h2>
                <div class="bg-white rounded-lg p-6">
                  <div class="flex items-center gap-6 mb-6">
                    <div class="text-center">
                      <div class="text-4xl font-bold text-gray-800">{{ service.freelancerRating }}</div>
                      <div class="flex items-center gap-1 mt-1">
                        @for (i of [1,2,3,4,5]; track i) {
                          <svg class="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                          </svg>
                        }
                      </div>
                      <p class="text-sm text-gray-500 mt-1">{{ service.freelancerReviews }} reviews</p>
                    </div>
                  </div>

                  <!-- Sample Reviews -->
                  <div class="space-y-4">
                    <div class="border-t pt-4">
                      <div class="flex items-start gap-3">
                        <div class="w-10 h-10 bg-gray-300 rounded-full"></div>
                        <div class="flex-1">
                          <div class="flex items-center gap-2 mb-1">
                            <span class="font-semibold">John Doe</span>
                            <div class="flex items-center gap-1">
                              @for (i of [1,2,3,4,5]; track i) {
                                <svg class="w-3 h-3 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                                </svg>
                              }
                            </div>
                            <span class="text-sm text-gray-500">2 weeks ago</span>
                          </div>
                          <p class="text-gray-700">Excellent work! Delivered on time and exceeded expectations.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Sidebar - Packages -->
            <div class="lg:col-span-1">
              <div class="sticky top-4">
                <!-- Package Tabs -->
                <div class="bg-white rounded-lg shadow-lg overflow-hidden">
                  <div class="flex border-b">
                    @for (pkg of service.packages; track pkg.id) {
                      <button (click)="selectedPackage = pkg"
                              [class.bg-teal-50]="selectedPackage?.id === pkg.id"
                              [class.border-b-2]="selectedPackage?.id === pkg.id"
                              [class.border-teal-600]="selectedPackage?.id === pkg.id"
                              class="flex-1 py-3 px-4 text-sm font-semibold capitalize hover:bg-gray-50">
                        {{ pkg.name }}
                      </button>
                    }
                  </div>

                  @if (selectedPackage) {
                    <div class="p-6">
                      <!-- Package Title & Price -->
                      <div class="mb-4">
                        <h3 class="text-xl font-semibold mb-2">{{ selectedPackage.title }}</h3>
                        <div class="text-3xl font-bold text-teal-600">\${{ selectedPackage.price }}</div>
                      </div>

                      <!-- Package Description -->
                      <p class="text-gray-600 mb-4">{{ selectedPackage.description }}</p>

                      <!-- Delivery & Revisions -->
                      <div class="flex gap-4 mb-4 text-sm">
                        <div class="flex items-center gap-2">
                          <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                          </svg>
                          <span>{{ selectedPackage.deliveryTime }} {{ selectedPackage.deliveryUnit }} delivery</span>
                        </div>
                        <div class="flex items-center gap-2">
                          <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                          </svg>
                          <span>{{ selectedPackage.revisions === -1 ? 'Unlimited' : selectedPackage.revisions }} Revisions</span>
                        </div>
                      </div>

                      <!-- Features -->
                      <div class="mb-6">
                        <h4 class="font-semibold mb-2">What's Included:</h4>
                        <ul class="space-y-2">
                          @for (feature of selectedPackage.features; track feature) {
                            <li class="flex items-start gap-2">
                              <svg class="w-5 h-5 text-green-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                              </svg>
                              <span class="text-sm text-gray-700">{{ feature }}</span>
                            </li>
                          }
                        </ul>
                      </div>

                      <!-- Add-ons -->
                      @if (service.addOns && service.addOns.length > 0) {
                        <div class="mb-6">
                          <h4 class="font-semibold mb-2">Add-ons:</h4>
                          <div class="space-y-2">
                            @for (addon of service.addOns; track addon.id) {
                              <label class="flex items-start gap-2 cursor-pointer">
                                <input type="checkbox" [(ngModel)]="selectedAddons[addon.id]"
                                       class="mt-1 text-teal-600 rounded">
                                <div class="flex-1">
                                  <div class="flex justify-between">
                                    <span class="text-sm font-medium">{{ addon.title }}</span>
                                    <span class="text-sm font-semibold">+\${{ addon.price }}</span>
                                  </div>
                                  <p class="text-xs text-gray-500">{{ addon.description }}</p>
                                </div>
                              </label>
                            }
                          </div>
                        </div>
                      }

                      <!-- Order Button -->
                      <button (click)="orderService()"
                              class="w-full bg-teal-600 text-white py-3 rounded-lg font-semibold hover:bg-teal-700 transition-colors">
                        Continue (\${{ calculateTotal() }})
                      </button>

                      <!-- Contact Seller -->
                      <button class="w-full mt-3 border border-gray-300 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors">
                        Contact Seller
                      </button>
                    </div>
                  }
                </div>

                <!-- Seller Card -->
                <div class="bg-white rounded-lg shadow-lg p-6 mt-4">
                  <h3 class="font-semibold mb-4">About the Seller</h3>
                  <div class="flex items-center gap-3 mb-4">
                    <div class="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                      {{ service.freelancerAvatar }}
                    </div>
                    <div>
                      <p class="font-semibold">{{ service.freelancerName }}</p>
                      <p class="text-sm text-gray-500">{{ getLevelBadge(service.level) }} Seller</p>
                    </div>
                  </div>

                  <div class="space-y-2 text-sm">
                    <div class="flex justify-between">
                      <span class="text-gray-500">From</span>
                      <span class="font-medium">United States</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-gray-500">Member since</span>
                      <span class="font-medium">{{ formatDate(service.createdAt) }}</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-gray-500">Avg. response time</span>
                      <span class="font-medium">1 hour</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-gray-500">Languages</span>
                      <span class="font-medium">{{ service.languages?.join(', ') }}</span>
                    </div>
                  </div>

                  <button routerLink="/freelancer-profile/{{ service.freelancerId }}"
                          class="w-full mt-4 text-teal-600 font-semibold hover:text-teal-700">
                    View Profile
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      }
    </div>
  `,
  styles: []
})
export class ServiceDetailComponent implements OnInit {
  service: FreelanceService | null = null;
  selectedPackage: ServicePackage | null = null;
  selectedAddons: { [key: string]: boolean } = {};

  constructor(
    private route: ActivatedRoute,
    private freelanceService: FreelanceMarketplaceService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      const id = params['id'];
      this.freelanceService.getFreelanceServiceById(id).subscribe(service => {
        if (service) {
          this.service = service;
          this.selectedPackage = service.packages[0];
        }
      });
    });
  }

  calculateTotal(): number {
    if (!this.selectedPackage || !this.service) return 0;

    let total = this.selectedPackage.price;

    // Add selected add-ons
    if (this.service.addOns) {
      for (const addon of this.service.addOns) {
        if (this.selectedAddons[addon.id]) {
          total += addon.price;
        }
      }
    }

    return total;
  }

  orderService() {
    if (!this.service || !this.selectedPackage) return;

    // Navigate to checkout or order confirmation
    console.log('Ordering service:', this.service.id, this.selectedPackage.name);
  }

  getLevelBadge(level: string): string {
    const badges: { [key: string]: string } = {
      'new': 'New',
      'level-1': 'Level 1',
      'level-2': 'Level 2',
      'top-rated': 'Top Rated'
    };
    return badges[level] || 'New';
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
  }
}
