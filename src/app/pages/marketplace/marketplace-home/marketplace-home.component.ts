import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { FreelanceMarketplaceService, FreelanceService } from '../../../services/freelance.service';
import { CurrencyService } from '../../../services/currency.service';
import { TranslationService } from '../../../services/translation.service';

@Component({
  selector: 'app-marketplace-home',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="min-h-screen bg-gray-50">
      <!-- Hero Section -->
      <section class="bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-20">
        <div class="container mx-auto px-4">
          <div class="max-w-4xl mx-auto text-center">
            <h1 class="text-5xl font-bold mb-6">{{ t('marketplace.title') || 'Freelance Marketplace' }}</h1>
            <p class="text-xl mb-8">{{ t('marketplace.subtitle') || 'Connect with top freelancers and clients worldwide' }}</p>

            <!-- Search Bar -->
            <div class="bg-white rounded-lg p-2 flex gap-2 max-w-2xl mx-auto">
              <input
                type="text"
                [(ngModel)]="searchQuery"
                [placeholder]="t('marketplace.searchPlaceholder') || 'Search for services or projects...'"
                class="flex-1 px-4 py-2 text-gray-800 focus:outline-none"
              >
              <button (click)="search()" class="btn btn-primary">
                {{ t('common.search') }}
              </button>
            </div>

            <!-- Quick Stats -->
            <div class="grid grid-cols-3 gap-8 mt-12">
              <div>
                <div class="text-3xl font-bold">{{ totalServices }}</div>
                <div class="text-purple-100">{{ t('marketplace.activeServices') || 'Active Services' }}</div>
              </div>
              <div>
                <div class="text-3xl font-bold">{{ totalProjects }}</div>
                <div class="text-purple-100">{{ t('marketplace.openProjects') || 'Open Projects' }}</div>
              </div>
              <div>
                <div class="text-3xl font-bold">{{ totalFreelancers }}+</div>
                <div class="text-purple-100">{{ t('marketplace.freelancers') || 'Freelancers' }}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Popular Categories -->
      <section class="py-16">
        <div class="container mx-auto px-4">
          <h2 class="text-3xl font-bold text-center mb-12">{{ t('marketplace.popularCategories') || 'Popular Categories' }}</h2>

          <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
            <a *ngFor="let category of popularCategories"
               [routerLink]="['/services']"
               [queryParams]="{category: category.slug}"
               class="bg-white rounded-lg p-6 text-center hover:shadow-lg transition-shadow">
              <div class="text-4xl mb-4">{{ category.icon }}</div>
              <h3 class="font-semibold mb-2">{{ category.name }}</h3>
              <p class="text-sm text-gray-600">{{ category.count }} {{ t('common.services') }}</p>
            </a>
          </div>
        </div>
      </section>

      <!-- Featured Services -->
      <section class="py-16 bg-white">
        <div class="container mx-auto px-4">
          <div class="flex justify-between items-center mb-12">
            <h2 class="text-3xl font-bold">{{ t('marketplace.featuredServices') || 'Featured Services' }}</h2>
            <a routerLink="/services" class="text-primary hover:underline">
              {{ t('marketplace.viewAllServices') || 'View all services' }} →
            </a>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <div *ngFor="let service of featuredServices"
                 class="bg-white border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
              <img [src]="service.images[0]" [alt]="service.title" class="w-full h-48 object-cover">
              <div class="p-4">
                <div class="flex items-center mb-2">
                  <img [src]="service.freelancer.avatar"
                       [alt]="service.freelancer.name"
                       class="w-8 h-8 rounded-full mr-2">
                  <div>
                    <div class="text-sm font-medium">{{ service.freelancer.name }}</div>
                    <div class="text-xs text-gray-600">
                      ⭐ {{ service.freelancer.rating }} ({{ service.freelancer.reviewCount }})
                    </div>
                  </div>
                </div>
                <h3 class="font-semibold mb-2 line-clamp-2">{{ service.title }}</h3>
                <div class="flex justify-between items-center">
                  <span class="text-sm text-gray-600">{{ t('marketplace.startingAt') }}</span>
                  <span class="font-bold text-primary">{{ formatPrice(service.startingPrice) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Recent Projects -->
      <section class="py-16">
        <div class="container mx-auto px-4">
          <div class="flex justify-between items-center mb-12">
            <h2 class="text-3xl font-bold">{{ t('marketplace.recentProjects') || 'Recent Projects' }}</h2>
            <a routerLink="/projects" class="text-primary hover:underline">
              {{ t('marketplace.viewAllProjects') || 'View all projects' }} →
            </a>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div *ngFor="let project of recentProjects"
                 class="bg-white rounded-lg p-6 hover:shadow-lg transition-shadow">
              <div class="flex justify-between items-start mb-4">
                <div>
                  <span class="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                    {{ project.status }}
                  </span>
                  <span class="ml-2 text-sm text-gray-600">
                    {{ t('marketplace.postedTime', {time: project.postedTime}) || 'Posted ' + project.postedTime }}
                  </span>
                </div>
                <span class="font-bold text-lg">{{ formatBudget(project.budget) }}</span>
              </div>

              <h3 class="font-semibold text-lg mb-2">{{ project.title }}</h3>
              <p class="text-gray-600 mb-4 line-clamp-2">{{ project.description }}</p>

              <div class="flex items-center justify-between">
                <div class="flex flex-wrap gap-2">
                  <span *ngFor="let skill of project.skills.slice(0, 3)"
                        class="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                    {{ skill }}
                  </span>
                  <span *ngIf="project.skills.length > 3"
                        class="px-2 py-1 text-gray-500 text-xs">
                    +{{ project.skills.length - 3 }} more
                  </span>
                </div>
                <div class="text-sm text-gray-600">
                  {{ project.proposals }} {{ t('marketplace.proposals') }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- How It Works -->
      <section class="py-16 bg-gray-100">
        <div class="container mx-auto px-4">
          <h2 class="text-3xl font-bold text-center mb-12">{{ t('marketplace.howItWorks') || 'How It Works' }}</h2>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto">
            <!-- For Clients -->
            <div>
              <h3 class="text-xl font-semibold mb-6 text-center">{{ t('marketplace.forClients') || 'For Clients' }}</h3>
              <div class="space-y-4">
                <div class="flex items-start">
                  <div class="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center flex-shrink-0 mr-4">1</div>
                  <div>
                    <h4 class="font-medium mb-1">{{ t('marketplace.step1Client') || 'Post Your Project' }}</h4>
                    <p class="text-sm text-gray-600">{{ t('marketplace.step1ClientDesc') || 'Describe your project and budget' }}</p>
                  </div>
                </div>
                <div class="flex items-start">
                  <div class="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center flex-shrink-0 mr-4">2</div>
                  <div>
                    <h4 class="font-medium mb-1">{{ t('marketplace.step2Client') || 'Review Proposals' }}</h4>
                    <p class="text-sm text-gray-600">{{ t('marketplace.step2ClientDesc') || 'Get proposals from skilled freelancers' }}</p>
                  </div>
                </div>
                <div class="flex items-start">
                  <div class="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center flex-shrink-0 mr-4">3</div>
                  <div>
                    <h4 class="font-medium mb-1">{{ t('marketplace.step3Client') || 'Hire & Collaborate' }}</h4>
                    <p class="text-sm text-gray-600">{{ t('marketplace.step3ClientDesc') || 'Choose the best freelancer and start working' }}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- For Freelancers -->
            <div>
              <h3 class="text-xl font-semibold mb-6 text-center">{{ t('marketplace.forFreelancers') || 'For Freelancers' }}</h3>
              <div class="space-y-4">
                <div class="flex items-start">
                  <div class="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center flex-shrink-0 mr-4">1</div>
                  <div>
                    <h4 class="font-medium mb-1">{{ t('marketplace.step1Freelancer') || 'Create Your Profile' }}</h4>
                    <p class="text-sm text-gray-600">{{ t('marketplace.step1FreelancerDesc') || 'Showcase your skills and portfolio' }}</p>
                  </div>
                </div>
                <div class="flex items-start">
                  <div class="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center flex-shrink-0 mr-4">2</div>
                  <div>
                    <h4 class="font-medium mb-1">{{ t('marketplace.step2Freelancer') || 'Browse & Apply' }}</h4>
                    <p class="text-sm text-gray-600">{{ t('marketplace.step2FreelancerDesc') || 'Find projects that match your expertise' }}</p>
                  </div>
                </div>
                <div class="flex items-start">
                  <div class="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center flex-shrink-0 mr-4">3</div>
                  <div>
                    <h4 class="font-medium mb-1">{{ t('marketplace.step3Freelancer') || 'Deliver & Earn' }}</h4>
                    <p class="text-sm text-gray-600">{{ t('marketplace.step3FreelancerDesc') || 'Complete projects and get paid securely' }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- CTA Section -->
      <section class="py-20 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div class="container mx-auto px-4 text-center">
          <h2 class="text-4xl font-bold mb-6">{{ t('marketplace.ctaTitle') || 'Ready to Get Started?' }}</h2>
          <p class="text-xl mb-8 max-w-2xl mx-auto">
            {{ t('marketplace.ctaSubtitle') || 'Join thousands of freelancers and clients already using our platform' }}
          </p>
          <div class="flex gap-4 justify-center">
            <a routerLink="/post-project" class="btn bg-white text-indigo-600 hover:bg-gray-100">
              {{ t('marketplace.postProject') }}
            </a>
            <a routerLink="/create-service" class="btn btn-outline border-white text-white hover:bg-white hover:text-indigo-600">
              {{ t('marketplace.becomeFreelancer') }}
            </a>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: []
})
export class MarketplaceHomeComponent implements OnInit {
  searchQuery = '';
  totalServices = 1250;
  totalProjects = 450;
  totalFreelancers = 3000;

  popularCategories = [
    { name: 'Web Development', slug: 'web-dev', icon: '💻', count: 250 },
    { name: 'Graphic Design', slug: 'design', icon: '🎨', count: 180 },
    { name: 'Content Writing', slug: 'writing', icon: '✍️', count: 150 },
    { name: 'Digital Marketing', slug: 'marketing', icon: '📈', count: 120 },
    { name: 'Video Editing', slug: 'video', icon: '🎬', count: 90 },
    { name: 'Translation', slug: 'translation', icon: '🌐', count: 80 },
    { name: 'Mobile Apps', slug: 'mobile', icon: '📱', count: 110 },
    { name: 'Data Entry', slug: 'data', icon: '📊', count: 70 }
  ];

  featuredServices: FreelanceService[] = [];
  recentProjects: any[] = [];

  constructor(
    private freelanceService: FreelanceMarketplaceService,
    private currencyService: CurrencyService,
    private translationService: TranslationService
  ) {}

  ngOnInit() {
    this.loadFeaturedServices();
    this.loadRecentProjects();

    // Update category names based on language
    this.translationService.currentLanguage$.subscribe(() => {
      this.updateCategoryNames();
    });
  }

  loadFeaturedServices() {
    this.freelanceService.getServices({ featured: true, limit: 8 }).subscribe(services => {
      this.featuredServices = services;
    });
  }

  loadRecentProjects() {
    // Mock data for recent projects
    this.recentProjects = [
      {
        id: 1,
        title: 'E-commerce Website Development',
        description: 'Looking for an experienced developer to build a modern e-commerce platform with React and Node.js...',
        budget: { min: 5000, max: 10000, currency: 'USD' },
        status: 'Open',
        postedTime: '2 hours ago',
        skills: ['React', 'Node.js', 'MongoDB', 'Stripe API'],
        proposals: 12
      },
      {
        id: 2,
        title: 'Logo Design for Tech Startup',
        description: 'Need a creative designer to create a modern, minimalist logo for our AI-powered analytics platform...',
        budget: { min: 500, max: 1000, currency: 'USD' },
        status: 'Open',
        postedTime: '5 hours ago',
        skills: ['Logo Design', 'Branding', 'Adobe Illustrator'],
        proposals: 25
      },
      {
        id: 3,
        title: 'Content Writing for Blog',
        description: 'Seeking a skilled content writer to produce 10 high-quality blog posts about digital marketing trends...',
        budget: { min: 300, max: 500, currency: 'USD', type: 'per-article' },
        status: 'Open',
        postedTime: '1 day ago',
        skills: ['Content Writing', 'SEO', 'Digital Marketing'],
        proposals: 18
      },
      {
        id: 4,
        title: 'Mobile App Development (iOS & Android)',
        description: 'Building a fitness tracking app with social features. Need experienced React Native developer...',
        budget: { min: 8000, max: 15000, currency: 'USD' },
        status: 'Open',
        postedTime: '2 days ago',
        skills: ['React Native', 'Firebase', 'API Integration', 'UI/UX'],
        proposals: 8
      }
    ];
  }

  updateCategoryNames() {
    // Update category names based on current language
    const categoryTranslations: any = {
      'web-dev': this.t('categories.webDev') || 'Web Development',
      'design': this.t('categories.design') || 'Graphic Design',
      'writing': this.t('categories.writing') || 'Content Writing',
      'marketing': this.t('categories.marketing') || 'Digital Marketing',
      'video': this.t('categories.video') || 'Video Editing',
      'translation': this.t('categories.translation') || 'Translation',
      'mobile': this.t('categories.mobile') || 'Mobile Apps',
      'data': this.t('categories.data') || 'Data Entry'
    };

    this.popularCategories = this.popularCategories.map(cat => ({
      ...cat,
      name: categoryTranslations[cat.slug] || cat.name
    }));
  }

  search() {
    // Implement search functionality
    console.log('Searching for:', this.searchQuery);
  }

  formatPrice(price: number): string {
    return this.currencyService.formatPrice(price);
  }

  formatBudget(budget: any): string {
    if (budget.type === 'per-article') {
      const min = this.currencyService.formatPrice(budget.min);
      const max = this.currencyService.formatPrice(budget.max);
      return `${min}-${max}/article`;
    }
    const min = this.currencyService.formatPrice(budget.min);
    const max = this.currencyService.formatPrice(budget.max);
    return `${min}-${max}`;
  }

  t(key: string, params?: any): string {
    const translation = this.translationService.translate(key);
    if (params && params.time) {
      return translation.replace('{time}', params.time);
    }
    return translation;
  }
}
