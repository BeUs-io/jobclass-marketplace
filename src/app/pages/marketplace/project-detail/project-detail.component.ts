import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { FreelanceMarketplaceService } from '../../../services/freelance.service';
import { Project } from '../../../models/freelance.model';

@Component({
  selector: 'app-project-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="min-h-screen bg-gray-50">
      @if (project) {
        <!-- Header -->
        <div class="bg-white border-b">
          <div class="container mx-auto px-4 py-6">
            <nav class="flex items-center gap-2 text-sm mb-4">
              <a routerLink="/" class="text-gray-500 hover:text-gray-700">Home</a>
              <span class="text-gray-400">/</span>
              <a routerLink="/projects" class="text-gray-500 hover:text-gray-700">Projects</a>
              <span class="text-gray-400">/</span>
              <span class="text-gray-700">{{ project.category }}</span>
            </nav>

            <div class="flex justify-between items-start">
              <div>
                <div class="flex items-center gap-3 mb-3">
                  @if (project.urgent) {
                    <span class="px-3 py-1 bg-red-100 text-red-600 rounded text-sm font-semibold">
                      Urgent
                    </span>
                  }
                  @if (project.featured) {
                    <span class="px-3 py-1 bg-yellow-100 text-yellow-600 rounded text-sm font-semibold">
                      Featured
                    </span>
                  }
                  @if (project.paymentVerified) {
                    <div class="flex items-center gap-1 text-green-600">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                      </svg>
                      <span class="text-sm font-semibold">Payment Verified</span>
                    </div>
                  }
                </div>
                <h1 class="text-3xl font-bold text-gray-800">{{ project.title }}</h1>
              </div>

              <div class="text-right">
                <div class="text-3xl font-bold text-indigo-600">
                  @if (project.budget.type === 'fixed') {
                    \${{ project.budget.min }} - \${{ project.budget.max }}
                  } @else {
                    \${{ project.budget.min }}/hr - \${{ project.budget.max }}/hr
                  }
                </div>
                <p class="text-gray-500">{{ project.budget.type === 'fixed' ? 'Fixed Price' : 'Hourly Rate' }}</p>
              </div>
            </div>
          </div>
        </div>

        <div class="container mx-auto px-4 py-8">
          <div class="grid lg:grid-cols-3 gap-8">
            <!-- Main Content -->
            <div class="lg:col-span-2">
              <!-- Project Description -->
              <div class="bg-white rounded-lg shadow-md p-6 mb-6">
                <h2 class="text-xl font-semibold mb-4">Project Description</h2>
                <div class="prose max-w-none text-gray-700 whitespace-pre-wrap">{{ project.description }}</div>

                @if (project.attachments && project.attachments.length > 0) {
                  <div class="mt-6">
                    <h3 class="font-semibold mb-3">Attachments</h3>
                    <div class="flex flex-wrap gap-2">
                      @for (attachment of project.attachments; track attachment) {
                        <a href="#" class="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded hover:bg-gray-200">
                          <svg class="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"/>
                          </svg>
                          <span class="text-sm">{{ attachment }}</span>
                        </a>
                      }
                    </div>
                  </div>
                }
              </div>

              <!-- Skills Required -->
              <div class="bg-white rounded-lg shadow-md p-6 mb-6">
                <h2 class="text-xl font-semibold mb-4">Skills Required</h2>
                <div class="flex flex-wrap gap-2">
                  @for (skill of project.skillsRequired; track skill) {
                    <span class="px-4 py-2 bg-indigo-50 text-indigo-700 rounded-full font-medium">
                      {{ skill }}
                    </span>
                  }
                </div>
              </div>

              <!-- Project Details -->
              <div class="bg-white rounded-lg shadow-md p-6 mb-6">
                <h2 class="text-xl font-semibold mb-4">Project Details</h2>
                <div class="grid md:grid-cols-2 gap-6">
                  <div>
                    <p class="text-gray-500 text-sm mb-1">Experience Level</p>
                    <p class="font-semibold capitalize">{{ project.experienceLevel }} Level</p>
                  </div>
                  <div>
                    <p class="text-gray-500 text-sm mb-1">Project Duration</p>
                    <p class="font-semibold">{{ project.duration.estimated }} {{ project.duration.unit }}</p>
                  </div>
                  <div>
                    <p class="text-gray-500 text-sm mb-1">Location</p>
                    <p class="font-semibold capitalize">{{ project.location }}</p>
                  </div>
                  @if (project.deadline) {
                    <div>
                      <p class="text-gray-500 text-sm mb-1">Deadline</p>
                      <p class="font-semibold">{{ formatDate(project.deadline) }}</p>
                    </div>
                  }
                </div>
              </div>

              <!-- Activity -->
              <div class="bg-white rounded-lg shadow-md p-6">
                <h2 class="text-xl font-semibold mb-4">Activity on this Project</h2>
                <div class="space-y-4">
                  <div class="flex justify-between py-3 border-b">
                    <span class="text-gray-600">Proposals</span>
                    <span class="font-semibold">{{ project.proposals }}</span>
                  </div>
                  <div class="flex justify-between py-3 border-b">
                    <span class="text-gray-600">Last viewed by client</span>
                    <span class="font-semibold">2 hours ago</span>
                  </div>
                  <div class="flex justify-between py-3 border-b">
                    <span class="text-gray-600">Interviewing</span>
                    <span class="font-semibold">0</span>
                  </div>
                  <div class="flex justify-between py-3">
                    <span class="text-gray-600">Invites sent</span>
                    <span class="font-semibold">3</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Sidebar -->
            <div class="lg:col-span-1">
              <!-- Submit Proposal Card -->
              <div class="bg-white rounded-lg shadow-md p-6 mb-6 sticky top-4">
                <h3 class="text-xl font-semibold mb-4">Submit a Proposal</h3>

                @if (!hasSubmittedProposal) {
                  <div class="space-y-4">
                    <!-- Bid Amount -->
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">
                        {{ project.budget.type === 'fixed' ? 'Your Bid' : 'Hourly Rate' }}
                      </label>
                      <div class="relative">
                        <span class="absolute left-3 top-3 text-gray-500">\$</span>
                        <input type="number" [(ngModel)]="proposalBid"
                               class="w-full pl-8 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500">
                      </div>
                      <p class="text-xs text-gray-500 mt-1">
                        Client's budget: \${{ project.budget.min }} - \${{ project.budget.max }}
                      </p>
                    </div>

                    <!-- Delivery Time -->
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">
                        Delivery Time
                      </label>
                      <div class="flex gap-2">
                        <input type="number" [(ngModel)]="proposalDeliveryTime"
                               class="flex-1 px-3 py-3 border border-gray-300 rounded-lg">
                        <select [(ngModel)]="proposalDeliveryUnit"
                                class="px-3 py-3 border border-gray-300 rounded-lg">
                          <option value="days">Days</option>
                          <option value="weeks">Weeks</option>
                          <option value="months">Months</option>
                        </select>
                      </div>
                    </div>

                    <!-- Cover Letter -->
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">
                        Cover Letter
                      </label>
                      <textarea [(ngModel)]="proposalCoverLetter" rows="4"
                                placeholder="Introduce yourself and explain why you're the best fit for this project..."
                                class="w-full px-3 py-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-indigo-500"></textarea>
                    </div>

                    <!-- Submit Button -->
                    <button (click)="submitProposal()"
                            class="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors">
                      Submit Proposal
                    </button>

                    <p class="text-xs text-gray-500 text-center">
                      You have 10 connects. This proposal requires 4 connects.
                    </p>
                  </div>
                } @else {
                  <div class="text-center py-8">
                    <svg class="w-16 h-16 text-green-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    <h4 class="text-lg font-semibold mb-2">Proposal Submitted!</h4>
                    <p class="text-gray-600">Your proposal has been sent to the client.</p>
                  </div>
                }
              </div>

              <!-- Client Info -->
              <div class="bg-white rounded-lg shadow-md p-6">
                <h3 class="text-xl font-semibold mb-4">About the Client</h3>

                <div class="flex items-center gap-3 mb-4">
                  <div class="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center font-bold text-gray-600">
                    {{ project.clientAvatar }}
                  </div>
                  <div>
                    <p class="font-semibold">{{ project.clientName }}</p>
                    <div class="flex items-center gap-1">
                      @for (i of [1,2,3,4,5]; track i) {
                        <svg class="w-4 h-4" [class.text-yellow-500]="i <= Math.floor(project.clientRating)"
                             [class.text-gray-300]="i > Math.floor(project.clientRating)"
                             fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                        </svg>
                      }
                      <span class="text-sm text-gray-500 ml-1">{{ project.clientRating }}</span>
                    </div>
                  </div>
                </div>

                <div class="space-y-3">
                  @if (project.location) {
                    <div class="flex justify-between text-sm">
                      <span class="text-gray-500">Location</span>
                      <span class="font-medium">United States</span>
                    </div>
                  }

                  <div class="flex justify-between text-sm">
                    <span class="text-gray-500">Jobs Posted</span>
                    <span class="font-medium">{{ project.clientHistory.projectsPosted }}</span>
                  </div>

                  <div class="flex justify-between text-sm">
                    <span class="text-gray-500">Total Spent</span>
                    <span class="font-medium">\${{ (project.clientHistory.totalSpent / 1000).toFixed(1) }}k</span>
                  </div>

                  <div class="flex justify-between text-sm">
                    <span class="text-gray-500">Hire Rate</span>
                    <span class="font-medium">{{ project.clientHistory.hireRate }}%</span>
                  </div>

                  <div class="flex justify-between text-sm">
                    <span class="text-gray-500">Member Since</span>
                    <span class="font-medium">Jan 2023</span>
                  </div>
                </div>

                <div class="mt-6 pt-6 border-t">
                  <h4 class="font-semibold mb-2">Verification</h4>
                  <div class="space-y-2">
                    @if (project.paymentVerified) {
                      <div class="flex items-center gap-2 text-sm">
                        <svg class="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                        </svg>
                        <span>Payment method verified</span>
                      </div>
                    }
                    <div class="flex items-center gap-2 text-sm">
                      <svg class="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                      </svg>
                      <span>Email verified</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Similar Projects -->
              <div class="bg-white rounded-lg shadow-md p-6 mt-6">
                <h3 class="text-xl font-semibold mb-4">Similar Projects</h3>
                <div class="space-y-3">
                  <a href="#" class="block hover:bg-gray-50 p-3 rounded">
                    <h4 class="font-medium text-indigo-600 hover:text-indigo-700">E-commerce Website Development</h4>
                    <p class="text-sm text-gray-600 mt-1">\$1000-2500 • 5 proposals</p>
                  </a>
                  <a href="#" class="block hover:bg-gray-50 p-3 rounded">
                    <h4 class="font-medium text-indigo-600 hover:text-indigo-700">React Native App Development</h4>
                    <p class="text-sm text-gray-600 mt-1">\$2000-3500 • 8 proposals</p>
                  </a>
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
export class ProjectDetailComponent implements OnInit {
  project: Project | null = null;
  hasSubmittedProposal = false;

  // Proposal form
  proposalBid: number = 0;
  proposalDeliveryTime: number = 7;
  proposalDeliveryUnit = 'days';
  proposalCoverLetter = '';

  Math = Math;

  constructor(
    private route: ActivatedRoute,
    private freelanceService: FreelanceMarketplaceService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      const id = params['id'];
      this.freelanceService.getProjectById(id).subscribe(project => {
        if (project) {
          this.project = project;
          // Set default bid based on project budget
          this.proposalBid = Math.floor((project.budget.min + project.budget.max) / 2);
        }
      });
    });
  }

  submitProposal() {
    if (!this.project) return;

    // Validate proposal
    if (!this.proposalBid || !this.proposalCoverLetter) {
      alert('Please fill in all required fields');
      return;
    }

    // Submit proposal logic
    console.log('Submitting proposal:', {
      projectId: this.project.id,
      bid: this.proposalBid,
      deliveryTime: this.proposalDeliveryTime,
      deliveryUnit: this.proposalDeliveryUnit,
      coverLetter: this.proposalCoverLetter
    });

    this.hasSubmittedProposal = true;
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
}
