import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-hero-search',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section class="relative h-[500px] flex items-center justify-center overflow-hidden">
      <!-- Background Image with Overlay -->
      <div class="absolute inset-0">
        <div class="absolute inset-0 bg-gradient-to-r from-secondary/90 to-accent/80 z-10"></div>
        <img
          src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=1920&h=600&fit=crop"
          alt="Office background"
          class="w-full h-full object-cover"
        >
      </div>

      <!-- Content -->
      <div class="relative z-20 container mx-auto px-4 text-center">
        <h1 class="text-5xl md:text-6xl font-bold text-white mb-4 animate-fade-in">
          FIND A JOB NEAR YOU
        </h1>
        <p class="text-xl text-white/90 mb-8 animate-slide-up">
          Simple, fast and efficient
        </p>

        <!-- Search Form -->
        <form (submit)="handleSearch($event)" class="max-w-4xl mx-auto animate-slide-up" style="animation-delay: 0.2s;">
          <div class="bg-white rounded-lg shadow-xl p-2 flex flex-col md:flex-row gap-2">
            <!-- What Input -->
            <div class="flex-1 relative">
              <div class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A9 9 0 1 0 8.745 21h6.51A9 9 0 0 0 21 13.255z"></path>
                </svg>
              </div>
              <input
                type="text"
                [(ngModel)]="searchQuery"
                name="searchQuery"
                placeholder="What ?"
                class="w-full pl-10 pr-3 py-3 rounded-lg focus:outline-none"
              >
            </div>

            <!-- Where Input -->
            <div class="flex-1 relative">
              <div class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
              </div>
              <input
                type="text"
                [(ngModel)]="locationQuery"
                name="locationQuery"
                placeholder="Where ?"
                class="w-full pl-10 pr-3 py-3 rounded-lg focus:outline-none"
              >
            </div>

            <!-- Search Button -->
            <button type="submit" class="px-8 py-3 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors flex items-center justify-center">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </button>
          </div>
        </form>

        <!-- Quick Links -->
        <div class="mt-6 flex flex-wrap justify-center gap-2 animate-fade-in" style="animation-delay: 0.4s;">
          <span class="text-white/80 text-sm">Popular searches:</span>
          <button class="px-3 py-1 bg-white/20 text-white rounded-full text-sm hover:bg-white/30 transition-colors">
            Remote Jobs
          </button>
          <button class="px-3 py-1 bg-white/20 text-white rounded-full text-sm hover:bg-white/30 transition-colors">
            Full-time
          </button>
          <button class="px-3 py-1 bg-white/20 text-white rounded-full text-sm hover:bg-white/30 transition-colors">
            Developer
          </button>
          <button class="px-3 py-1 bg-white/20 text-white rounded-full text-sm hover:bg-white/30 transition-colors">
            Marketing
          </button>
        </div>
      </div>
    </section>
  `,
  styles: []
})
export class HeroSearchComponent {
  searchQuery = '';
  locationQuery = '';

  handleSearch(event: Event) {
    event.preventDefault();
    console.log('Search:', this.searchQuery, 'Location:', this.locationQuery);
    // Implement search functionality
  }
}
