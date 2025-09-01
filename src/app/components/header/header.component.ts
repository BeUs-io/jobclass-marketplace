import { Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService, User } from '../../services/auth.service';
import { RealTimeNotificationService, NotificationBadges } from '../../services/real-time-notification.service';
import { FreelanceMarketplaceService } from '../../services/freelance.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, FormsModule],
  template: `
    <header [class.shadow-md]="isScrolled" class="sticky top-0 z-50 bg-white transition-shadow duration-300">
      <!-- Mode Switcher Bar -->
      <div class="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-2">
        <div class="container mx-auto px-4">
          <div class="flex items-center justify-center gap-4">
            <span class="text-sm">Switch Mode:</span>
            <div class="flex bg-white/20 rounded-lg p-1">
              <button (click)="switchMode('job-seeker')"
                      [class.bg-white]="currentMode === 'job-seeker'"
                      [class.text-indigo-600]="currentMode === 'job-seeker'"
                      [class.text-white]="currentMode !== 'job-seeker'"
                      class="px-3 py-1 rounded text-sm font-medium transition-all">
                Job Seeker
              </button>
              <button (click)="switchMode('freelancer')"
                      [class.bg-white]="currentMode === 'freelancer'"
                      [class.text-indigo-600]="currentMode === 'freelancer'"
                      [class.text-white]="currentMode !== 'freelancer'"
                      class="px-3 py-1 rounded text-sm font-medium transition-all">
                Freelancer
              </button>
              <button (click)="switchMode('employer')"
                      [class.bg-white]="currentMode === 'employer'"
                      [class.text-indigo-600]="currentMode === 'employer'"
                      [class.text-white]="currentMode !== 'employer'"
                      class="px-3 py-1 rounded text-sm font-medium transition-all">
                Employer
              </button>
              <button (click)="switchMode('client')"
                      [class.bg-white]="currentMode === 'client'"
                      [class.text-indigo-600]="currentMode === 'client'"
                      [class.text-white]="currentMode !== 'client'"
                      class="px-3 py-1 rounded text-sm font-medium transition-all">
                Client
              </button>
            </div>
          </div>
        </div>
      </div>

      <nav class="container mx-auto px-4">
        <div class="flex items-center justify-between h-16">
          <!-- Logo -->
          <a routerLink="/" class="flex items-center space-x-2">
            <span class="text-2xl font-bold">
              <span class="text-secondary">Job</span><span class="text-primary">Class</span>
            </span>
          </a>

          <!-- Desktop Navigation -->
          <div class="hidden md:flex items-center space-x-8">
            <!-- Job Seeker / Employer Navigation -->
            <ng-container *ngIf="currentMode === 'job-seeker' || currentMode === 'employer'">
              <a routerLink="/jobs" routerLinkActive="text-primary" class="text-gray-700 hover:text-primary transition-colors">
                Browse Jobs
              </a>
              <a routerLink="/companies" routerLinkActive="text-primary" class="text-gray-700 hover:text-primary transition-colors">
                Companies
              </a>
              <a routerLink="/categories" routerLinkActive="text-primary" class="text-gray-700 hover:text-primary transition-colors">
                Categories
              </a>
            </ng-container>

            <!-- Freelancer / Client Navigation -->
            <ng-container *ngIf="currentMode === 'freelancer' || currentMode === 'client'">
              <a routerLink="/marketplace" routerLinkActive="text-primary" class="text-gray-700 hover:text-primary transition-colors">
                Marketplace
              </a>
              <a routerLink="/services" routerLinkActive="text-primary" class="text-gray-700 hover:text-primary transition-colors">
                Browse Services
              </a>
              <a routerLink="/projects" routerLinkActive="text-primary" class="text-gray-700 hover:text-primary transition-colors">
                Find Projects
              </a>
            </ng-container>

            <a routerLink="/pricing" routerLinkActive="text-primary" class="text-gray-700 hover:text-primary transition-colors">
              Pricing
            </a>
            <a routerLink="/messages" routerLinkActive="text-primary" class="relative text-gray-700 hover:text-primary transition-colors">
              Messages
              <span *ngIf="(badges$ | async)?.messages && (badges$ | async)!.messages > 0"
                    class="absolute -top-2 -right-3 bg-red-500 text-white text-xs rounded-full min-w-[20px] h-5 flex items-center justify-center px-1">
                {{ (badges$ | async)!.messages }}
              </span>
            </a>
          </div>

          <!-- Right Actions -->
          <div class="hidden md:flex items-center space-x-4">
            <!-- Logged Out State -->
            <ng-container *ngIf="!(currentUser$ | async)">
              <!-- Mode-specific buttons -->
              <button *ngIf="currentMode === 'employer'" routerLink="/post-job" class="btn btn-outline">
                Post a Job
              </button>
              <button *ngIf="currentMode === 'client'" routerLink="/post-project" class="btn btn-outline">
                Post a Project
              </button>
              <button *ngIf="currentMode === 'freelancer'" routerLink="/create-service" class="btn btn-outline">
                Create Service
              </button>
              <button (click)="toggleLoginModal()" class="btn btn-primary">
                Sign In
              </button>
            </ng-container>

            <!-- Logged In State -->
            <ng-container *ngIf="currentUser$ | async as user">
              <!-- Mode-specific buttons -->
              <button *ngIf="currentMode === 'employer'" routerLink="/post-job" class="btn btn-outline">
                Post a Job
              </button>
              <button *ngIf="currentMode === 'client'" routerLink="/post-project" class="btn btn-outline">
                Post a Project
              </button>
              <button *ngIf="currentMode === 'freelancer'" routerLink="/freelancer-dashboard" class="btn btn-outline">
                Dashboard
              </button>

              <!-- Notifications -->
              <button class="relative p-2 text-gray-600 hover:text-gray-900">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
                </svg>
                <span
                  *ngIf="(unreadNotifications$ | async) as count"
                  class="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-500 rounded-full"
                >
                  {{count}}
                </span>
              </button>

              <!-- User Menu -->
              <div class="relative">
                <button
                  (click)="toggleUserMenu()"
                  class="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100"
                >
                  <img
                    [src]="user.avatar || 'https://ui-avatars.com/api/?name=' + user.name"
                    [alt]="user.name"
                    class="w-8 h-8 rounded-full"
                  >
                  <span class="font-medium">{{user.name}}</span>
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </button>

                <!-- Dropdown Menu -->
                <div
                  *ngIf="showUserMenu"
                  class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50"
                >
                  <a routerLink="/profile" class="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                    Profile
                  </a>

                  <!-- Job Seeker Options -->
                  <ng-container *ngIf="currentMode === 'job-seeker'">
                    <a routerLink="/resume-builder" class="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                      Resume Builder
                    </a>
                    <a routerLink="/application-tracker" class="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                      My Applications
                    </a>
                    <a routerLink="/jobs" class="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                      Saved Jobs
                    </a>
                  </ng-container>

                  <!-- Freelancer Options -->
                  <ng-container *ngIf="currentMode === 'freelancer'">
                    <a routerLink="/freelancer-dashboard" class="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                      Dashboard
                    </a>
                    <a routerLink="/manage-orders" class="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                      My Orders
                    </a>
                    <a routerLink="/portfolio" class="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                      Portfolio
                    </a>
                    <a routerLink="/create-service" class="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                      Create Service
                    </a>
                  </ng-container>

                  <!-- Employer Options -->
                  <ng-container *ngIf="currentMode === 'employer'">
                    <a routerLink="/employer-dashboard" class="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                      Employer Dashboard
                    </a>
                    <a routerLink="/company/1" class="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                      Company Profile
                    </a>
                    <a routerLink="/post-job" class="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                      Post a Job
                    </a>
                  </ng-container>

                  <!-- Client Options -->
                  <ng-container *ngIf="currentMode === 'client'">
                    <a routerLink="/client-dashboard" class="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                      Client Dashboard
                    </a>
                    <a routerLink="/post-project" class="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                      Post Project
                    </a>
                    <a routerLink="/manage-orders" class="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                      My Orders
                    </a>
                  </ng-container>

                  <hr class="my-2">
                  <button (click)="logout()" class="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100">
                    Logout
                  </button>
                </div>
              </div>
            </ng-container>
          </div>

          <!-- Mobile Menu Button -->
          <button (click)="toggleMobileMenu()" class="md:hidden p-2">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path *ngIf="!isMobileMenuOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
              <path *ngIf="isMobileMenuOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <!-- Mobile Menu -->
        <div *ngIf="isMobileMenuOpen" class="md:hidden py-4 border-t animate-slide-down">
          <div class="flex flex-col space-y-4">
            <a routerLink="/jobs" routerLinkActive="text-primary" class="text-gray-700 hover:text-primary transition-colors">
              Browse Jobs
            </a>
            <a routerLink="/companies" routerLinkActive="text-primary" class="text-gray-700 hover:text-primary transition-colors">
              Companies
            </a>
            <a routerLink="/categories" routerLinkActive="text-primary" class="text-gray-700 hover:text-primary transition-colors">
              Categories
            </a>
            <a routerLink="/pricing" routerLinkActive="text-primary" class="text-gray-700 hover:text-primary transition-colors">
              Pricing
            </a>
            <div class="flex flex-col space-y-2 pt-4 border-t">
              <button class="btn btn-outline w-full">
                Post a Job
              </button>
              <button (click)="toggleLoginModal()" class="btn btn-primary w-full">
                Sign In
              </button>
            </div>
          </div>
        </div>
      </nav>

      <!-- Login Modal -->
      <div *ngIf="showLoginModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50" (click)="closeModalOnBackdrop($event)">
        <div class="bg-white rounded-lg p-8 max-w-md w-full animate-slide-up" (click)="$event.stopPropagation()">
          <h2 class="text-2xl font-bold mb-6">Sign In</h2>
          <form (submit)="handleLogin($event)">
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                [(ngModel)]="loginEmail"
                name="email"
                class="input-field"
                placeholder="Enter your email"
                required
              >
            </div>
            <div class="mb-6">
              <label class="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <input
                type="password"
                [(ngModel)]="loginPassword"
                name="password"
                class="input-field"
                placeholder="Enter your password"
                required
              >
            </div>
            <div *ngIf="loginError" class="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
              {{loginError}}
            </div>
            <button
              type="submit"
              [disabled]="isLoggingIn"
              class="btn btn-primary w-full mb-4"
            >
              {{isLoggingIn ? 'Signing In...' : 'Sign In'}}
            </button>
            <p class="text-center text-sm text-gray-500 mb-4">
              Demo accounts:<br>
              Job Seeker: demo&#64;jobclass.com / demo123<br>
              Employer: employer&#64;jobclass.com / employer123
            </p>
            <p class="text-center text-sm text-gray-600">
              Don't have an account?
              <a href="#" class="text-primary hover:underline">Sign Up</a>
            </p>
          </form>
        </div>
      </div>
    </header>
  `,
  styles: []
})
export class HeaderComponent implements OnInit {
  isScrolled = false;
  isMobileMenuOpen = false;
  showLoginModal = false;
  showUserMenu = false;
  currentUser$!: Observable<User | null>;
  unreadNotifications$!: Observable<number>;
  badges$!: Observable<NotificationBadges>;
  currentMode: 'job-seeker' | 'freelancer' | 'employer' | 'client' = 'job-seeker';

  // Login form data
  loginEmail = '';
  loginPassword = '';
  loginError = '';
  isLoggingIn = false;

  constructor(
    private authService: AuthService,
    private notificationService: RealTimeNotificationService,
    private freelanceService: FreelanceMarketplaceService
  ) {}

  ngOnInit() {
    this.currentUser$ = this.authService.currentUser$;
    this.unreadNotifications$ = this.notificationService.getUnreadCount();
    this.badges$ = this.notificationService.badges$;
    this.currentMode = this.freelanceService.getUserMode();
  }

  switchMode(mode: 'job-seeker' | 'freelancer' | 'employer' | 'client') {
    this.currentMode = mode;
    this.freelanceService.setUserMode(mode);
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isScrolled = window.scrollY > 10;
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  toggleLoginModal() {
    this.showLoginModal = !this.showLoginModal;
    if (this.showLoginModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }

  closeModalOnBackdrop(event: Event) {
    if (event.target === event.currentTarget) {
      this.toggleLoginModal();
    }
  }

  handleLogin(event: Event) {
    event.preventDefault();
    this.loginError = '';
    this.isLoggingIn = true;

    this.authService.login({
      email: this.loginEmail,
      password: this.loginPassword
    }).subscribe(result => {
      this.isLoggingIn = false;
      if (result.success) {
        this.toggleLoginModal();
        this.loginEmail = '';
        this.loginPassword = '';
      } else {
        this.loginError = result.error || 'Login failed';
      }
    });
  }

  toggleUserMenu() {
    this.showUserMenu = !this.showUserMenu;
  }

  logout() {
    this.authService.logout();
    this.showUserMenu = false;
  }
}
