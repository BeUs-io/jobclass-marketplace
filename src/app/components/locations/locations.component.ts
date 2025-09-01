import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Location } from '../../models/job.model';

@Component({
  selector: 'app-locations',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <section class="py-12">
      <div class="container mx-auto px-4">
        <div class="flex items-center mb-8">
          <svg class="w-8 h-8 mr-3 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
          </svg>
          <h2 class="text-3xl font-bold text-gray-800">Choose a city or region</h2>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <!-- Cities List -->
          <div>
            <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
              <a
                *ngFor="let location of topLocations"
                [routerLink]="['/jobs']"
                [queryParams]="{location: location.name}"
                class="text-gray-700 hover:text-primary transition-colors"
              >
                {{location.name}}
              </a>
            </div>
            <button class="mt-6 text-primary hover:text-primary-dark transition-colors flex items-center">
              More cities
              <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </button>
          </div>

          <!-- Map -->
          <div class="relative">
            <div class="bg-gradient-to-br from-blue-50 to-green-50 rounded-lg p-8 h-64 flex items-center justify-center">
              <svg class="w-full h-full max-w-md" viewBox="0 0 959 593" fill="none" xmlns="http://www.w3.org/2000/svg">
                <!-- Simplified US Map -->
                <path d="M 100 200 L 150 180 L 200 190 L 250 200 L 300 210 L 350 220 L 400 230 L 450 240 L 500 250 L 550 260 L 600 270 L 650 280 L 700 290 L 750 300 L 800 310 L 850 300 L 900 290 L 900 350 L 850 360 L 800 370 L 750 380 L 700 390 L 650 400 L 600 410 L 550 420 L 500 430 L 450 420 L 400 410 L 350 400 L 300 390 L 250 380 L 200 370 L 150 360 L 100 350 Z"
                      fill="#e0f2fe"
                      stroke="#0ea5e9"
                      stroke-width="2"
                      class="hover:fill-blue-200 transition-colors cursor-pointer"/>

                <!-- State dots for major cities -->
                <circle cx="800" cy="280" r="6" fill="#22c55e" class="animate-pulse" title="New York"/>
                <circle cx="450" cy="350" r="6" fill="#22c55e" class="animate-pulse" title="Chicago"/>
                <circle cx="150" cy="380" r="6" fill="#22c55e" class="animate-pulse" title="Los Angeles"/>
                <circle cx="720" cy="400" r="6" fill="#22c55e" class="animate-pulse" title="Houston"/>
                <circle cx="760" cy="320" r="6" fill="#22c55e" class="animate-pulse" title="Philadelphia"/>
                <circle cx="300" cy="380" r="6" fill="#22c55e" class="animate-pulse" title="Phoenix"/>

                <text x="480" y="550" text-anchor="middle" class="text-sm fill-gray-600">
                  United States
                </text>
              </svg>
            </div>
          </div>
        </div>

        <!-- Add Resume CTA -->
        <div class="mt-12 bg-gradient-to-r from-primary to-primary-dark rounded-lg p-8 text-center text-white">
          <h3 class="text-2xl font-bold mb-4">Looking for a Job?</h3>
          <p class="mb-6">Upload your resume and let employers find you!</p>
          <button class="bg-white text-primary px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors inline-flex items-center">
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
            </svg>
            Add Your Resume
          </button>
        </div>
      </div>
    </section>
  `,
  styles: []
})
export class LocationsComponent {
  topLocations: Location[] = [
    { id: '1', name: 'New York City', country: 'USA', jobCount: 456 },
    { id: '2', name: 'Los Angeles', country: 'USA', jobCount: 389 },
    { id: '3', name: 'Chicago', country: 'USA', jobCount: 312 },
    { id: '4', name: 'Brooklyn', country: 'USA', jobCount: 234 },
    { id: '5', name: 'Houston', country: 'USA', jobCount: 298 },
    { id: '6', name: 'Queens', country: 'USA', jobCount: 189 },
    { id: '7', name: 'Phoenix', country: 'USA', jobCount: 267 },
    { id: '8', name: 'Philadelphia', country: 'USA', jobCount: 245 },
    { id: '9', name: 'Manhattan', country: 'USA', jobCount: 334 },
    { id: '10', name: 'San Antonio', country: 'USA', jobCount: 178 },
    { id: '11', name: 'San Diego', country: 'USA', jobCount: 223 },
    { id: '12', name: 'The Bronx', country: 'USA', jobCount: 145 },
    { id: '13', name: 'Dallas', country: 'USA', jobCount: 289 },
    { id: '14', name: 'San Jose', country: 'USA', jobCount: 301 }
  ];
}
