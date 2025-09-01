import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { FreelanceMarketplaceService } from '../../../services/freelance.service';
import { FreelanceService, Project } from '../../../models/freelance.model';

@Component({
  selector: 'app-marketplace-home',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <!-- Hero Section -->
      <section class="relative bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 text-white py-20">
        <div class="absolute inset-0 bg-black/20"></div>
        <div class="container mx-auto px-4 relative z-10">
          <div class="max-w-4xl mx-auto text-center">
            <h1 class="text-5xl font-bold mb-6">
              Find & Hire Expert Freelancers<br>
              <span class="text-cyan-200">Or Offer Your Services</span>
            </h1>
            <p class="text-xl mb-10 text-cyan-50">
              Connect with top talent worldwide. From quick gigs to long-term projects.
            </p>

            <!-- Search Bar -->
            <div class="bg-white rounded-xl shadow-2xl p-2 max-w-3xl mx-auto">
              <div class="flex flex-col md:flex-row gap-2">
                <input
                  type="text"
                  [(ngModel)]="searchQuery"
                  placeholder="Try 'logo design' or 'web development'"
                  class="flex-1 px-6 py-4 text-gray-700 rounded-lg focus:outline-none"
                />
                <button
                  (click)="search()"
                  class="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-8 py-4 rounded-lg hover:from-emerald-700 hover:to-teal-700 transition-all font-semibold"
                >
                  Search
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Featured Services -->
      <section class="py-16">
        <div class="container mx-auto px-4">
          <h2 class="text-3xl font-bold mb-8">Featured Services</h2>
          <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            @for (service of featuredServices; track service.id) {
              <div class="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer"
                   [routerLink]="['/service', service.id]">
                <div class="aspect-video bg-gradient-to-br from-gray-200 to-gray-300"></div>
                <div class="p-4">
                  <h3 class="font-semibold text-gray-800 mb-2">{{ service.title }}</h3>
                  <p class="text-sm text-gray-600 mb-3">by {{ service.freelancerName }}</p>
                  <div class="flex justify-between items-center">
                    <span class="text-lg font-bold text-teal-600">From \${{ service.pricing.startingPrice }}</span>
                    <div class="flex items-center gap-1">
                      <span class="text-yellow-500">★</span>
                      <span class="text-sm">{{ service.freelancerRating }}</span>
                    </div>
                  </div>
                </div>
              </div>
            }
          </div>
        </div>
      </section>

      <!-- Featured Projects -->
      <section class="py-16 bg-white">
        <div class="container mx-auto px-4">
          <h2 class="text-3xl font-bold mb-8">Latest Projects</h2>
          <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            @for (project of featuredProjects; track project.id) {
              <div class="border-2 border-gray-100 rounded-xl p-6 hover:border-teal-500 transition-colors cursor-pointer"
                   [routerLink]="['/project', project.id]">
                <h3 class="font-semibold text-lg text-gray-800 mb-2">{{ project.title }}</h3>
                <p class="text-gray-600 text-sm mb-4">{{ project.description }}</p>
                <div class="flex justify-between items-end">
                  <div>
                    <span class="text-lg font-bold text-gray-800">
                      \${{ project.budget.min }} - \${{ project.budget.max }}
                    </span>
                    <span class="text-gray-500 block text-sm">{{ project.budget.type }}</span>
                  </div>
                  <span class="text-teal-600 text-sm">{{ project.proposals }} proposals</span>
                </div>
              </div>
            }
          </div>
        </div>
      </section>
    </div>
  `,
  styles: []
})
export class MarketplaceHomeComponent implements OnInit {
  searchQuery = '';
  featuredServices: FreelanceService[] = [];
  featuredProjects: Project[] = [];

  constructor(private freelanceService: FreelanceMarketplaceService) {}

  ngOnInit() {
    this.loadFeaturedContent();
  }

  loadFeaturedContent() {
    this.freelanceService.getFeaturedServices().subscribe(services => {
      this.featuredServices = services;
    });

    this.freelanceService.getFeaturedProjects().subscribe(projects => {
      this.featuredProjects = projects;
    });
  }

  search() {
    console.log('Searching for:', this.searchQuery);
  }
}
