import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

interface FeaturedCompany {
  id: string;
  name: string;
  logo: string;
  jobCount: number;
  industry: string;
}

@Component({
  selector: 'app-featured-companies',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <section class="py-12 bg-gray-50">
      <div class="container mx-auto px-4">
        <div class="flex justify-between items-center mb-8">
          <h2 class="text-3xl font-bold text-gray-800">Featured Companies</h2>
          <a routerLink="/companies" class="text-primary hover:text-primary-dark transition-colors flex items-center">
            VIEW MORE
            <svg class="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </a>
        </div>

        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          <div
            *ngFor="let company of featuredCompanies"
            class="bg-white rounded-lg p-6 text-center hover:shadow-lg transition-all duration-200 hover:-translate-y-1 cursor-pointer"
          >
            <div class="mb-4">
              <img
                [src]="company.logo"
                [alt]="company.name"
                class="w-20 h-20 mx-auto object-contain"
              >
            </div>
            <h4 class="font-medium text-gray-800 mb-1">{{company.name}}</h4>
            <p class="text-sm text-gray-500 mb-2">{{company.industry}}</p>
            <a
              [routerLink]="['/jobs']"
              [queryParams]="{company: company.name}"
              class="text-sm text-primary hover:text-primary-dark transition-colors"
            >
              Jobs at {{company.name}} ({{company.jobCount}})
            </a>
          </div>
        </div>

        <!-- Company logos carousel for smaller screens -->
        <div class="mt-8 overflow-x-auto md:hidden">
          <div class="flex space-x-4 pb-4">
            <div
              *ngFor="let company of featuredCompanies"
              class="flex-shrink-0 bg-white rounded-lg p-4 w-32 text-center"
            >
              <img
                [src]="company.logo"
                [alt]="company.name"
                class="w-16 h-16 mx-auto object-contain mb-2"
              >
              <p class="text-xs font-medium text-gray-800">{{company.name}}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: []
})
export class FeaturedCompaniesComponent {
  featuredCompanies: FeaturedCompany[] = [
    {
      id: '1',
      name: 'H&M',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/H%26M-Logo.svg/320px-H%26M-Logo.svg.png',
      jobCount: 15,
      industry: 'Retail'
    },
    {
      id: '2',
      name: 'FOX',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/25/FOX_wordmark.svg/320px-FOX_wordmark.svg.png',
      jobCount: 8,
      industry: 'Media'
    },
    {
      id: '3',
      name: 'Test.io',
      logo: 'https://ui-avatars.com/api/?name=Test.io&background=06b6d4&color=fff&size=128',
      jobCount: 12,
      industry: 'Technology'
    },
    {
      id: '4',
      name: 'Pampers',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/85/Pampers_logo.svg/320px-Pampers_logo.svg.png',
      jobCount: 6,
      industry: 'Consumer Goods'
    },
    {
      id: '5',
      name: 'Dance Studio',
      logo: 'https://ui-avatars.com/api/?name=Dance+Studio&background=ec4899&color=fff&size=128',
      jobCount: 4,
      industry: 'Entertainment'
    },
    {
      id: '6',
      name: 'Nestlé',
      logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/d/d8/Nestl%C3%A9.svg/320px-Nestl%C3%A9.svg.png',
      jobCount: 18,
      industry: 'Food & Beverage'
    },
    {
      id: '7',
      name: 'Quizon',
      logo: 'https://ui-avatars.com/api/?name=Quizon&background=8b5cf6&color=fff&size=128',
      jobCount: 9,
      industry: 'Technology'
    },
    {
      id: '8',
      name: 'Dickinson Green',
      logo: 'https://ui-avatars.com/api/?name=DG&background=10b981&color=fff&size=128',
      jobCount: 7,
      industry: 'Consulting'
    },
    {
      id: '9',
      name: 'Heineken',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f5/Heineken_logo.svg/320px-Heineken_logo.svg.png',
      jobCount: 11,
      industry: 'Beverage'
    },
    {
      id: '10',
      name: 'LEGO',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/LEGO_logo.svg/320px-LEGO_logo.svg.png',
      jobCount: 14,
      industry: 'Toys'
    },
    {
      id: '11',
      name: 'SpaceCube',
      logo: 'https://ui-avatars.com/api/?name=SpaceCube&background=6366f1&color=fff&size=128',
      jobCount: 10,
      industry: 'Aerospace'
    },
    {
      id: '12',
      name: 'Wells Fargo',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Wells_Fargo_Bank.svg/320px-Wells_Fargo_Bank.svg.png',
      jobCount: 16,
      industry: 'Banking'
    }
  ];
}
