import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <footer class="bg-secondary text-white">
      <!-- Stats Section -->
      <div class="bg-gray-100 py-12">
        <div class="container mx-auto px-4">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div class="animate-fade-in">
              <div class="flex items-center justify-center mb-2">
                <svg class="w-12 h-12 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A9 9 0 1 0 8.745 21h6.51A9 9 0 0 0 21 13.255z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 7v5l3 3"></path>
                </svg>
              </div>
              <h3 class="text-3xl font-bold text-gray-800">{{stats.jobs}}</h3>
              <p class="text-gray-600">Jobs Posted</p>
            </div>
            <div class="animate-fade-in" style="animation-delay: 0.1s;">
              <div class="flex items-center justify-center mb-2">
                <svg class="w-12 h-12 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
                </svg>
              </div>
              <h3 class="text-3xl font-bold text-gray-800">{{stats.users}}</h3>
              <p class="text-gray-600">Active Users</p>
            </div>
            <div class="animate-fade-in" style="animation-delay: 0.2s;">
              <div class="flex items-center justify-center mb-2">
                <svg class="w-12 h-12 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
              </div>
              <h3 class="text-3xl font-bold text-gray-800">{{stats.locations}}</h3>
              <p class="text-gray-600">Locations</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Main Footer -->
      <div class="py-12">
        <div class="container mx-auto px-4">
          <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
            <!-- About -->
            <div>
              <h4 class="text-lg font-semibold mb-4">ABOUT US</h4>
              <ul class="space-y-2">
                <li><a href="#" class="text-gray-300 hover:text-white transition-colors">FAQ</a></li>
                <li><a href="#" class="text-gray-300 hover:text-white transition-colors">Anti-Scam</a></li>
                <li><a href="#" class="text-gray-300 hover:text-white transition-colors">Terms</a></li>
                <li><a href="#" class="text-gray-300 hover:text-white transition-colors">Privacy</a></li>
              </ul>
            </div>

            <!-- Contact -->
            <div>
              <h4 class="text-lg font-semibold mb-4">CONTACT & SITEMAP</h4>
              <ul class="space-y-2">
                <li><a href="#" class="text-gray-300 hover:text-white transition-colors">Contact Us</a></li>
                <li><a routerLink="/companies" class="text-gray-300 hover:text-white transition-colors">Companies</a></li>
                <li><a href="#" class="text-gray-300 hover:text-white transition-colors">Sitemap</a></li>
                <li><a href="#" class="text-gray-300 hover:text-white transition-colors">Countries</a></li>
              </ul>
            </div>

            <!-- My Account -->
            <div>
              <h4 class="text-lg font-semibold mb-4">MY ACCOUNT</h4>
              <ul class="space-y-2">
                <li><a href="#" class="text-gray-300 hover:text-white transition-colors">Log In</a></li>
                <li><a href="#" class="text-gray-300 hover:text-white transition-colors">Register</a></li>
                <li><a href="#" class="text-gray-300 hover:text-white transition-colors">My Jobs</a></li>
                <li><a href="#" class="text-gray-300 hover:text-white transition-colors">Profile</a></li>
              </ul>
            </div>

            <!-- Follow Us -->
            <div>
              <h4 class="text-lg font-semibold mb-4">FOLLOW US ON</h4>
              <div class="flex space-x-3">
                <a href="#" class="bg-blue-600 p-2 rounded hover:bg-blue-700 transition-colors">
                  <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                <a href="#" class="bg-black p-2 rounded hover:bg-gray-800 transition-colors">
                  <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </a>
                <a href="#" class="bg-pink-600 p-2 rounded hover:bg-pink-700 transition-colors">
                  <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1112.324 0 6.162 6.162 0 01-12.324 0zM12 16a4 4 0 110-8 4 4 0 010 8zm4.965-10.405a1.44 1.44 0 112.881.001 1.44 1.44 0 01-2.881-.001z"/>
                  </svg>
                </a>
                <a href="#" class="bg-blue-500 p-2 rounded hover:bg-blue-600 transition-colors">
                  <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
                <a href="#" class="bg-red-600 p-2 rounded hover:bg-red-700 transition-colors">
                  <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </a>
              </div>
              <div class="mt-6">
                <a href="#" class="inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors">
                  <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.295-.6.295-.002 0-.003 0-.005 0l.213-3.054 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.64-.203-.658-.64.135-.954l11.566-4.458c.538-.196 1.006.128.832.941z"/>
                  </svg>
                  Join our Telegram
                </a>
              </div>
            </div>
          </div>

          <!-- Copyright -->
          <div class="mt-12 pt-8 border-t border-gray-700 text-center">
            <p class="text-gray-300">
              &copy; {{currentYear}} JobClass. All Rights Reserved.
              <span class="ml-2">Powered by Angular & Tailwind CSS</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  `,
  styles: []
})
export class FooterComponent {
  currentYear = new Date().getFullYear();

  stats = {
    jobs: '1,256',
    users: '4,699',
    locations: '7,200'
  };
}
