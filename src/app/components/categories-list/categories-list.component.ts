import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Category } from '../../models/job.model';

@Component({
  selector: 'app-categories-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <section class="py-12 bg-gray-50">
      <div class="container mx-auto px-4">
        <div class="flex justify-between items-center mb-8">
          <h2 class="text-3xl font-bold text-gray-800">Browse by Category</h2>
          <a routerLink="/categories" class="text-primary hover:text-primary-dark transition-colors flex items-center">
            VIEW MORE
            <svg class="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </a>
        </div>

        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <a
            *ngFor="let category of categories"
            [routerLink]="['/jobs']"
            [queryParams]="{category: category.name}"
            class="group flex items-center space-x-3 bg-white p-4 rounded-lg hover:shadow-md transition-all duration-200 hover:-translate-y-1"
          >
            <div class="flex-shrink-0">
              <div class="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <svg class="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path [attr.d]="getCategoryIcon(category.name)"></path>
                </svg>
              </div>
            </div>
            <div>
              <h4 class="font-medium text-gray-800 group-hover:text-primary transition-colors">{{category.name}}</h4>
              <p class="text-sm text-gray-500">{{category.jobCount}} jobs</p>
            </div>
          </a>
        </div>
      </div>
    </section>
  `,
  styles: []
})
export class CategoriesListComponent {
  categories: Category[] = [
    { id: '1', name: 'Engineering', jobCount: 245 },
    { id: '2', name: 'Financial Services', jobCount: 189 },
    { id: '3', name: 'Banking', jobCount: 156 },
    { id: '4', name: 'Security & Safety', jobCount: 98 },
    { id: '5', name: 'Training', jobCount: 75 },
    { id: '6', name: 'Public Service', jobCount: 134 },
    { id: '7', name: 'Real Estate', jobCount: 89 },
    { id: '8', name: 'Independent & Freelance', jobCount: 267 },
    { id: '9', name: 'IT & Telecoms', jobCount: 345 },
    { id: '10', name: 'Marketing & Communication', jobCount: 198 },
    { id: '11', name: 'Babysitting & Nanny Work', jobCount: 45 },
    { id: '12', name: 'Human Resources', jobCount: 112 },
    { id: '13', name: 'Medical & Healthcare', jobCount: 223 },
    { id: '14', name: 'Tourism & Restaurants', jobCount: 167 },
    { id: '15', name: 'Transportation & Logistics', jobCount: 98 }
  ];

  getCategoryIcon(categoryName: string): string {
    // Return different SVG paths based on category
    const icons: { [key: string]: string } = {
      'Engineering': 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z',
      'Financial Services': 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
      'Banking': 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z',
      'IT & Telecoms': 'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
      'Medical & Healthcare': 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z',
      'default': 'M21 13.255A9 9 0 1 0 8.745 21h6.51A9 9 0 0 0 21 13.255z'
    };

    return icons[categoryName] || icons['default'];
  }
}
