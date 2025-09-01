import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { PaymentService } from '../../services/payment.service';

interface PricingPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  billingPeriod: 'month' | 'year';
  currency: string;
  popular?: boolean;
  features: {
    text: string;
    included: boolean;
    tooltip?: string;
  }[];
  cta: string;
  ctaLink?: string;
  badge?: string;
}

interface FAQ {
  question: string;
  answer: string;
}

@Component({
  selector: 'app-pricing',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="min-h-screen bg-gray-50">
      <!-- Promotional Banner -->
      <div *ngIf="showPromoBanner" class="bg-gradient-to-r from-purple-600 to-pink-600 text-white relative">
        <div class="container mx-auto px-4 py-3 flex items-center justify-between">
          <div class="flex items-center">
            <svg class="w-6 h-6 mr-2 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"></path>
            </svg>
            <span class="font-semibold">Limited Time Offer!</span>
            <span class="ml-2">Get 50% off your first month with code <code class="bg-white/20 px-2 py-0.5 rounded">FIRSTMONTH50</code></span>
          </div>
          <button (click)="closeBanner()" class="p-1 hover:bg-white/20 rounded">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
      </div>

      <!-- Hero Section -->
      <div class="bg-gradient-to-br from-primary to-primary-dark text-white py-16">
        <div class="container mx-auto px-4 text-center">
          <h1 class="text-4xl md:text-5xl font-bold mb-4">Choose Your Perfect Plan</h1>
          <p class="text-xl text-white/90 mb-8">Start free and scale as you grow. No hidden fees.</p>

          <!-- Billing Toggle -->
          <div class="inline-flex items-center bg-white/10 rounded-full p-1">
            <button
              (click)="billingPeriod = 'month'"
              [class.bg-white]="billingPeriod === 'month'"
              [class.text-primary]="billingPeriod === 'month'"
              [class.text-white]="billingPeriod !== 'month'"
              class="px-6 py-2 rounded-full font-medium transition-all"
            >
              Monthly
            </button>
            <button
              (click)="billingPeriod = 'year'"
              [class.bg-white]="billingPeriod === 'year'"
              [class.text-primary]="billingPeriod === 'year'"
              [class.text-white]="billingPeriod !== 'year'"
              class="px-6 py-2 rounded-full font-medium transition-all"
            >
              Yearly
              <span class="ml-2 text-xs bg-green-500 text-white px-2 py-0.5 rounded-full">Save 20%</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Pricing Cards -->
      <div class="container mx-auto px-4 -mt-8">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div
            *ngFor="let plan of getPricingPlans()"
            class="bg-white rounded-lg shadow-lg overflow-hidden"
            [class.ring-2]="plan.popular"
            [class.ring-primary]="plan.popular"
            [class.transform]="plan.popular"
            [class.scale-105]="plan.popular"
          >
            <!-- Plan Badge -->
            <div *ngIf="plan.badge" class="bg-gradient-to-r from-primary to-primary-dark text-white text-center py-2 text-sm font-medium">
              {{plan.badge}}
            </div>

            <!-- Plan Header -->
            <div class="p-6">
              <h3 class="text-2xl font-bold mb-2">{{plan.name}}</h3>
              <p class="text-gray-600 mb-4">{{plan.description}}</p>

              <!-- Price -->
              <div class="mb-6">
                <span class="text-4xl font-bold">
                  <span *ngIf="plan.price === 0">Free</span>
                  <span *ngIf="plan.price > 0">
                    $<span>{{getPrice(plan)}}</span>
                  </span>
                </span>
                <span *ngIf="plan.price > 0" class="text-gray-600">
                  /{{billingPeriod === 'year' ? 'year' : 'month'}}
                </span>
                <div *ngIf="plan.price > 0 && billingPeriod === 'year'" class="text-sm text-green-600 mt-1">
                  Save $<span>{{getAnnualSavings(plan)}}</span> annually
                </div>
              </div>

              <!-- CTA Button -->
              <button
                (click)="selectPlan(plan)"
                class="w-full py-3 rounded-lg font-medium transition-all"
                [class.bg-primary]="plan.popular"
                [class.text-white]="plan.popular"
                [class.hover:bg-primary-dark]="plan.popular"
                [class.bg-gray-100]="!plan.popular"
                [class.text-gray-800]="!plan.popular"
                [class.hover:bg-gray-200]="!plan.popular"
              >
                {{plan.cta}}
              </button>
            </div>

            <!-- Features -->
            <div class="px-6 pb-6 border-t pt-6">
              <ul class="space-y-3">
                <li
                  *ngFor="let feature of plan.features"
                  class="flex items-start"
                  [class.text-gray-400]="!feature.included"
                >
                  <svg
                    *ngIf="feature.included"
                    class="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <svg
                    *ngIf="!feature.included"
                    class="w-5 h-5 text-gray-300 mr-2 mt-0.5 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                  <span class="text-sm">{{feature.text}}</span>
                  <button
                    *ngIf="feature.tooltip"
                    class="ml-1"
                    (click)="showTooltip(feature.tooltip)"
                  >
                    <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <!-- Feature Comparison Table -->
      <div class="container mx-auto px-4 py-16">
        <h2 class="text-3xl font-bold text-center mb-12">Detailed Feature Comparison</h2>

        <div class="overflow-x-auto">
          <table class="w-full bg-white rounded-lg shadow-lg overflow-hidden">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-4 text-left text-sm font-medium text-gray-700">Features</th>
                <th class="px-6 py-4 text-center text-sm font-medium text-gray-700">Free</th>
                <th class="px-6 py-4 text-center text-sm font-medium text-gray-700">
                  <div class="flex items-center justify-center">
                    Basic
                    <span class="ml-2 text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded">Job Seekers</span>
                  </div>
                </th>
                <th class="px-6 py-4 text-center text-sm font-medium text-gray-700">
                  <div class="flex items-center justify-center">
                    Professional
                    <span class="ml-2 text-xs bg-purple-100 text-purple-600 px-2 py-0.5 rounded">Employers</span>
                  </div>
                </th>
                <th class="px-6 py-4 text-center text-sm font-medium text-gray-700">Enterprise</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <!-- Job Seeker Features -->
              <tr class="bg-blue-50">
                <td colspan="5" class="px-6 py-3 text-sm font-semibold text-blue-900">Job Seeker Features</td>
              </tr>
              <tr>
                <td class="px-6 py-4 text-sm text-gray-700">Job Search & Browse</td>
                <td class="px-6 py-4 text-center">{{getFeatureIcon(true)}}</td>
                <td class="px-6 py-4 text-center">{{getFeatureIcon(true)}}</td>
                <td class="px-6 py-4 text-center">{{getFeatureIcon(true)}}</td>
                <td class="px-6 py-4 text-center">{{getFeatureIcon(true)}}</td>
              </tr>
              <tr>
                <td class="px-6 py-4 text-sm text-gray-700">Job Applications</td>
                <td class="px-6 py-4 text-center">5/month</td>
                <td class="px-6 py-4 text-center">Unlimited</td>
                <td class="px-6 py-4 text-center">Unlimited</td>
                <td class="px-6 py-4 text-center">Unlimited</td>
              </tr>
              <tr>
                <td class="px-6 py-4 text-sm text-gray-700">Resume Builder</td>
                <td class="px-6 py-4 text-center">Basic</td>
                <td class="px-6 py-4 text-center">Advanced + ATS</td>
                <td class="px-6 py-4 text-center">Advanced + ATS</td>
                <td class="px-6 py-4 text-center">Advanced + ATS</td>
              </tr>
              <tr>
                <td class="px-6 py-4 text-sm text-gray-700">Saved Searches</td>
                <td class="px-6 py-4 text-center">3</td>
                <td class="px-6 py-4 text-center">Unlimited</td>
                <td class="px-6 py-4 text-center">Unlimited</td>
                <td class="px-6 py-4 text-center">Unlimited</td>
              </tr>
              <tr>
                <td class="px-6 py-4 text-sm text-gray-700">Job Alerts</td>
                <td class="px-6 py-4 text-center">Weekly</td>
                <td class="px-6 py-4 text-center">Daily</td>
                <td class="px-6 py-4 text-center">Instant</td>
                <td class="px-6 py-4 text-center">Instant</td>
              </tr>
              <tr>
                <td class="px-6 py-4 text-sm text-gray-700">Profile Views Analytics</td>
                <td class="px-6 py-4 text-center">{{getFeatureIcon(false)}}</td>
                <td class="px-6 py-4 text-center">{{getFeatureIcon(true)}}</td>
                <td class="px-6 py-4 text-center">{{getFeatureIcon(true)}}</td>
                <td class="px-6 py-4 text-center">{{getFeatureIcon(true)}}</td>
              </tr>
              <tr>
                <td class="px-6 py-4 text-sm text-gray-700">Priority Support</td>
                <td class="px-6 py-4 text-center">{{getFeatureIcon(false)}}</td>
                <td class="px-6 py-4 text-center">Email</td>
                <td class="px-6 py-4 text-center">Email + Chat</td>
                <td class="px-6 py-4 text-center">24/7 Phone</td>
              </tr>

              <!-- Employer Features -->
              <tr class="bg-purple-50">
                <td colspan="5" class="px-6 py-3 text-sm font-semibold text-purple-900">Employer Features</td>
              </tr>
              <tr>
                <td class="px-6 py-4 text-sm text-gray-700">Job Postings</td>
                <td class="px-6 py-4 text-center">{{getFeatureIcon(false)}}</td>
                <td class="px-6 py-4 text-center">{{getFeatureIcon(false)}}</td>
                <td class="px-6 py-4 text-center">5/month</td>
                <td class="px-6 py-4 text-center">Unlimited</td>
              </tr>
              <tr>
                <td class="px-6 py-4 text-sm text-gray-700">Premium Job Listings</td>
                <td class="px-6 py-4 text-center">{{getFeatureIcon(false)}}</td>
                <td class="px-6 py-4 text-center">{{getFeatureIcon(false)}}</td>
                <td class="px-6 py-4 text-center">1/month</td>
                <td class="px-6 py-4 text-center">Unlimited</td>
              </tr>
              <tr>
                <td class="px-6 py-4 text-sm text-gray-700">Applicant Tracking</td>
                <td class="px-6 py-4 text-center">{{getFeatureIcon(false)}}</td>
                <td class="px-6 py-4 text-center">{{getFeatureIcon(false)}}</td>
                <td class="px-6 py-4 text-center">{{getFeatureIcon(true)}}</td>
                <td class="px-6 py-4 text-center">{{getFeatureIcon(true)}}</td>
              </tr>
              <tr>
                <td class="px-6 py-4 text-sm text-gray-700">Candidate Database Access</td>
                <td class="px-6 py-4 text-center">{{getFeatureIcon(false)}}</td>
                <td class="px-6 py-4 text-center">{{getFeatureIcon(false)}}</td>
                <td class="px-6 py-4 text-center">Limited</td>
                <td class="px-6 py-4 text-center">Full Access</td>
              </tr>
              <tr>
                <td class="px-6 py-4 text-sm text-gray-700">Analytics Dashboard</td>
                <td class="px-6 py-4 text-center">{{getFeatureIcon(false)}}</td>
                <td class="px-6 py-4 text-center">{{getFeatureIcon(false)}}</td>
                <td class="px-6 py-4 text-center">Basic</td>
                <td class="px-6 py-4 text-center">Advanced</td>
              </tr>
              <tr>
                <td class="px-6 py-4 text-sm text-gray-700">Team Collaboration</td>
                <td class="px-6 py-4 text-center">{{getFeatureIcon(false)}}</td>
                <td class="px-6 py-4 text-center">{{getFeatureIcon(false)}}</td>
                <td class="px-6 py-4 text-center">3 users</td>
                <td class="px-6 py-4 text-center">Unlimited</td>
              </tr>
              <tr>
                <td class="px-6 py-4 text-sm text-gray-700">API Access</td>
                <td class="px-6 py-4 text-center">{{getFeatureIcon(false)}}</td>
                <td class="px-6 py-4 text-center">{{getFeatureIcon(false)}}</td>
                <td class="px-6 py-4 text-center">{{getFeatureIcon(false)}}</td>
                <td class="px-6 py-4 text-center">{{getFeatureIcon(true)}}</td>
              </tr>
              <tr>
                <td class="px-6 py-4 text-sm text-gray-700">Custom Branding</td>
                <td class="px-6 py-4 text-center">{{getFeatureIcon(false)}}</td>
                <td class="px-6 py-4 text-center">{{getFeatureIcon(false)}}</td>
                <td class="px-6 py-4 text-center">{{getFeatureIcon(false)}}</td>
                <td class="px-6 py-4 text-center">{{getFeatureIcon(true)}}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Add-on Services -->
      <div class="bg-white py-16">
        <div class="container mx-auto px-4">
          <h2 class="text-3xl font-bold text-center mb-12">Add-on Services</h2>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div class="text-center">
              <div class="bg-gradient-to-br from-blue-500 to-blue-600 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
              </div>
              <h3 class="text-xl font-semibold mb-2">Resume Review</h3>
              <p class="text-gray-600 mb-4">Professional review and optimization of your resume</p>
              <p class="text-2xl font-bold">$49<span class="text-sm text-gray-600">/resume</span></p>
            </div>

            <div class="text-center">
              <div class="bg-gradient-to-br from-green-500 to-green-600 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"></path>
                </svg>
              </div>
              <h3 class="text-xl font-semibold mb-2">Featured Job Post</h3>
              <p class="text-gray-600 mb-4">Get 5x more visibility for your job posting</p>
              <p class="text-2xl font-bold">$99<span class="text-sm text-gray-600">/30 days</span></p>
            </div>

            <div class="text-center">
              <div class="bg-gradient-to-br from-purple-500 to-purple-600 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                </svg>
              </div>
              <h3 class="text-xl font-semibold mb-2">Career Coaching</h3>
              <p class="text-gray-600 mb-4">1-on-1 coaching session with industry experts</p>
              <p class="text-2xl font-bold">$149<span class="text-sm text-gray-600">/session</span></p>
            </div>
          </div>
        </div>
      </div>

      <!-- FAQs -->
      <div class="container mx-auto px-4 py-16">
        <h2 class="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>

        <div class="max-w-3xl mx-auto">
          <div
            *ngFor="let faq of faqs; let i = index"
            class="mb-4"
          >
            <button
              (click)="toggleFAQ(i)"
              class="w-full bg-white rounded-lg shadow-sm p-6 text-left hover:shadow-md transition-shadow"
            >
              <div class="flex justify-between items-center">
                <h3 class="text-lg font-semibold">{{faq.question}}</h3>
                <svg
                  class="w-5 h-5 text-gray-500 transition-transform"
                  [class.rotate-180]="expandedFAQ === i"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </div>
            </button>
            <div
              *ngIf="expandedFAQ === i"
              class="bg-white rounded-b-lg px-6 pb-6 -mt-2 animate-slide-down"
            >
              <p class="text-gray-600">{{faq.answer}}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- CTA Section -->
      <div class="bg-gradient-to-r from-primary to-primary-dark text-white py-16">
        <div class="container mx-auto px-4 text-center">
          <h2 class="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p class="text-xl mb-8">Join thousands of job seekers and employers already using JobClass</p>
          <div class="flex justify-center gap-4">
            <button (click)="startFreeTrial()" class="bg-white text-primary px-8 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors">
              Start Free Trial
            </button>
            <button (click)="contactSales()" class="bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg font-medium hover:bg-white/10 transition-colors">
              Contact Sales
            </button>
          </div>
        </div>
      </div>

      <!-- Trust Badges -->
      <div class="bg-gray-100 py-12">
        <div class="container mx-auto px-4">
          <div class="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div class="text-3xl font-bold text-gray-800">100K+</div>
              <p class="text-gray-600">Active Job Seekers</p>
            </div>
            <div>
              <div class="text-3xl font-bold text-gray-800">5K+</div>
              <p class="text-gray-600">Companies Hiring</p>
            </div>
            <div>
              <div class="text-3xl font-bold text-gray-800">98%</div>
              <p class="text-gray-600">Customer Satisfaction</p>
            </div>
            <div>
              <div class="text-3xl font-bold text-gray-800">24/7</div>
              <p class="text-gray-600">Support Available</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    @keyframes slideDown {
      from {
        opacity: 0;
        transform: translateY(-10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .animate-slide-down {
      animation: slideDown 0.3s ease-out;
    }
  `]
})
export class PricingComponent implements OnInit {
  billingPeriod: 'month' | 'year' = 'month';
  expandedFAQ: number | null = null;
  Math = Math;
  showPromoBanner = true;

  plans: PricingPlan[] = [
    {
      id: 'free',
      name: 'Free',
      description: 'Perfect for getting started',
      price: 0,
      billingPeriod: 'month',
      currency: 'USD',
      cta: 'Get Started',
      features: [
        { text: 'Browse all job listings', included: true },
        { text: '5 job applications per month', included: true },
        { text: 'Basic resume builder', included: true },
        { text: '3 saved searches', included: true },
        { text: 'Weekly job alerts', included: true },
        { text: 'Community support', included: true },
        { text: 'Profile analytics', included: false },
        { text: 'Priority application review', included: false },
        { text: 'Advanced filters', included: false },
        { text: 'Resume templates', included: false }
      ]
    },
    {
      id: 'basic',
      name: 'Basic',
      description: 'For active job seekers',
      price: 19,
      billingPeriod: 'month',
      currency: 'USD',
      cta: 'Start 14-Day Trial',
      popular: true,
      badge: 'MOST POPULAR',
      features: [
        { text: 'Everything in Free', included: true },
        { text: 'Unlimited job applications', included: true },
        { text: 'Advanced resume builder + ATS', included: true },
        { text: 'Unlimited saved searches', included: true },
        { text: 'Daily job alerts', included: true },
        { text: 'Profile analytics', included: true },
        { text: 'Priority application review', included: true },
        { text: 'Advanced search filters', included: true },
        { text: '10+ resume templates', included: true },
        { text: 'Email support', included: true }
      ]
    },
    {
      id: 'professional',
      name: 'Professional',
      description: 'For employers & recruiters',
      price: 99,
      billingPeriod: 'month',
      currency: 'USD',
      cta: 'Start Hiring',
      features: [
        { text: 'All Basic features', included: true },
        { text: '5 job postings per month', included: true },
        { text: '1 featured job per month', included: true },
        { text: 'Applicant tracking system', included: true },
        { text: 'Candidate database (limited)', included: true },
        { text: 'Basic analytics dashboard', included: true },
        { text: '3 team members', included: true },
        { text: 'Email + chat support', included: true },
        { text: 'Interview scheduling', included: true },
        { text: 'Bulk messaging', included: true }
      ]
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      description: 'For large organizations',
      price: 499,
      billingPeriod: 'month',
      currency: 'USD',
      cta: 'Contact Sales',
      features: [
        { text: 'Everything in Professional', included: true },
        { text: 'Unlimited job postings', included: true },
        { text: 'Unlimited featured jobs', included: true },
        { text: 'Full candidate database', included: true },
        { text: 'Advanced analytics & reporting', included: true },
        { text: 'Unlimited team members', included: true },
        { text: 'API access', included: true },
        { text: 'Custom branding', included: true },
        { text: 'Dedicated account manager', included: true },
        { text: '24/7 phone support', included: true }
      ]
    }
  ];

  faqs: FAQ[] = [
    {
      question: 'Can I change my plan later?',
      answer: 'Yes! You can upgrade or downgrade your plan at any time. When upgrading, you\'ll be charged the prorated difference. When downgrading, the remaining balance will be credited to your account.'
    },
    {
      question: 'Is there a free trial available?',
      answer: 'Yes, we offer a 14-day free trial for our Basic and Professional plans. No credit card required to start your trial.'
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and bank transfers for Enterprise plans.'
    },
    {
      question: 'Can I cancel my subscription anytime?',
      answer: 'Absolutely! You can cancel your subscription at any time from your account settings. Your access will continue until the end of your current billing period.'
    },
    {
      question: 'Do you offer discounts for non-profits?',
      answer: 'Yes, we offer a 50% discount for registered non-profit organizations. Please contact our sales team with your non-profit documentation.'
    },
    {
      question: 'What happens to my data if I cancel?',
      answer: 'Your data remains accessible for 30 days after cancellation. You can export your data at any time. After 30 days, data may be permanently deleted.'
    },
    {
      question: 'Are there any setup fees?',
      answer: 'No, there are no setup fees for any of our plans. Enterprise customers may opt for professional onboarding services at an additional cost.'
    },
    {
      question: 'Do you offer custom pricing for large teams?',
      answer: 'Yes! For teams larger than 50 members or organizations with specific needs, we offer custom pricing. Contact our sales team for a personalized quote.'
    }
  ];

  constructor(
    private router: Router,
    private authService: AuthService,
    private paymentService: PaymentService
  ) {}

  ngOnInit() {
    // Track page view analytics for all plans
    this.plans.forEach(plan => {
      this.paymentService.trackPlanView(plan.id, plan.name);
    });

    // Check for promotional banner in localStorage
    const bannerClosed = localStorage.getItem('promoBannerClosed');
    if (bannerClosed) {
      this.showPromoBanner = false;
    }

    // Check for any pricing-related query parameters
    const urlParams = new URLSearchParams(window.location.search);
    const plan = urlParams.get('plan');
    if (plan) {
      this.scrollToPlan(plan);
    }
  }

  getPricingPlans(): PricingPlan[] {
    return this.plans;
  }

  getPrice(plan: PricingPlan): number {
    if (this.billingPeriod === 'year') {
      return Math.floor(plan.price * 0.8);
    }
    return plan.price;
  }

  getAnnualSavings(plan: PricingPlan): number {
    return plan.price * 12 - Math.floor(plan.price * 0.8) * 12;
  }

  selectPlan(plan: PricingPlan) {
    // Track plan click analytics
    this.paymentService.trackPlanClick(plan.id, plan.name);

    const user = this.authService.getCurrentUser();

    if (plan.id === 'free') {
      if (!user) {
        this.router.navigate(['/']);
        alert('Sign up for a free account to get started!');
      } else {
        alert('You are already on the free plan!');
      }
    } else if (plan.id === 'enterprise') {
      this.contactSales();
    } else {
      if (!user) {
        // Store selected plan and redirect to signup
        localStorage.setItem('selectedPlan', JSON.stringify(plan));
        alert('Please sign up to continue with ' + plan.name + ' plan');
        // In real app, would redirect to signup page
      } else {
        // Navigate to checkout page
        this.router.navigate(['/checkout'], {
          queryParams: {
            plan: plan.id,
            billing: this.billingPeriod
          }
        });
      }
    }
  }

  getFeatureIcon(included: boolean): string {
    if (included) {
      return '✓';
    }
    return '✗';
  }

  toggleFAQ(index: number) {
    this.expandedFAQ = this.expandedFAQ === index ? null : index;
  }

  showTooltip(message: string) {
    alert(message);
  }

  startFreeTrial() {
    const user = this.authService.getCurrentUser();
    if (!user) {
      alert('Please sign up to start your free trial');
      // Redirect to signup
    } else {
      this.router.navigate(['/checkout'], {
        queryParams: {
          plan: 'basic',
          trial: true
        }
      });
    }
  }

  contactSales() {
    alert('Sales team contact:\nEmail: sales@jobclass.com\nPhone: 1-800-JOBCLASS');
    // In real app, would open contact form or redirect to contact page
  }

  scrollToPlan(planId: string) {
    // Scroll to specific plan
    setTimeout(() => {
      const element = document.getElementById('plan-' + planId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  }

  closeBanner() {
    this.showPromoBanner = false;
    localStorage.setItem('promoBannerClosed', 'true');
  }
}
