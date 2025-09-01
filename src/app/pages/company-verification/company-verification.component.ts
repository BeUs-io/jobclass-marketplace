import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  CompanyVerificationService,
  CompanyVerification,
  VerificationDocument,
  VerificationStats
} from '../../services/company-verification.service';

@Component({
  selector: 'app-company-verification',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen bg-gray-50 py-8">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Header -->
        <div class="mb-8">
          <h1 class="text-3xl font-bold text-gray-900">Company Verification Center</h1>
          <p class="mt-2 text-gray-600">Verify your company to build trust and unlock premium features</p>
        </div>

        <!-- Benefits of Verification -->
        <div class="mb-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h2 class="text-lg font-semibold text-blue-900 mb-3">Why Verify Your Company?</h2>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="flex items-start">
              <svg class="h-6 w-6 text-blue-600 mt-1 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <div>
                <h3 class="font-medium text-blue-900">Build Trust</h3>
                <p class="text-sm text-blue-700">Get a verified badge that shows candidates you're legitimate</p>
              </div>
            </div>
            <div class="flex items-start">
              <svg class="h-6 w-6 text-blue-600 mt-1 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
              </svg>
              <div>
                <h3 class="font-medium text-blue-900">Priority Listing</h3>
                <p class="text-sm text-blue-700">Your jobs appear higher in search results</p>
              </div>
            </div>
            <div class="flex items-start">
              <svg class="h-6 w-6 text-blue-600 mt-1 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"></path>
              </svg>
              <div>
                <h3 class="font-medium text-blue-900">Premium Features</h3>
                <p class="text-sm text-blue-700">Access advanced recruitment tools and analytics</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Current Verification Status -->
        <div class="mb-8">
          <div class="bg-white rounded-lg shadow p-6">
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-xl font-semibold text-gray-900">Verification Status</h2>
              <span class="px-4 py-2 rounded-full text-sm font-medium"
                    [class.bg-green-100]="currentVerification()?.status === 'verified'"
                    [class.text-green-800]="currentVerification()?.status === 'verified'"
                    [class.bg-yellow-100]="currentVerification()?.status === 'pending'"
                    [class.text-yellow-800]="currentVerification()?.status === 'pending'"
                    [class.bg-red-100]="currentVerification()?.status === 'rejected'"
                    [class.text-red-800]="currentVerification()?.status === 'rejected'"
                    [class.bg-gray-100]="!currentVerification()"
                    [class.text-gray-800]="!currentVerification()">
                {{ getStatusLabel() }}
              </span>
            </div>

            <!-- Verified Status -->
            <div *ngIf="currentVerification()?.status === 'verified'" class="space-y-4">
              <div class="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                <div class="flex items-center">
                  <svg class="h-12 w-12 text-green-600 mr-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                  </svg>
                  <div>
                    <h3 class="text-lg font-semibold text-green-900">Company Verified</h3>
                    <p class="text-sm text-green-700">Level: {{ currentVerification()?.verificationLevel | uppercase }}</p>
                    <p class="text-xs text-green-600">Valid until {{ currentVerification()?.expiryDate | date:'mediumDate' }}</p>
                  </div>
                </div>
                <button (click)="downloadCertificate()"
                        class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
                  Download Certificate
                </button>
              </div>

              <!-- Verification Details -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 class="text-sm font-medium text-gray-700 mb-2">Verification Checks</h4>
                  <div class="space-y-2">
                    <div *ngFor="let check of currentVerification()?.verificationChecks"
                         class="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span class="text-sm text-gray-600">{{ getCheckLabel(check.type) }}</span>
                      <div class="flex items-center">
                        <svg *ngIf="check.status === 'passed'" class="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                        </svg>
                        <span *ngIf="check.score" class="ml-2 text-sm font-medium text-gray-700">{{ check.score }}%</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 class="text-sm font-medium text-gray-700 mb-2">Verified Documents</h4>
                  <div class="space-y-2">
                    <div *ngFor="let doc of currentVerification()?.documents"
                         class="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span class="text-sm text-gray-600">{{ getDocumentLabel(doc.type) }}</span>
                      <span class="text-xs px-2 py-1 bg-green-100 text-green-800 rounded">Approved</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Pending Status -->
            <div *ngIf="currentVerification()?.status === 'pending'" class="space-y-4">
              <div class="p-4 bg-yellow-50 rounded-lg">
                <div class="flex items-center">
                  <svg class="h-6 w-6 text-yellow-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <div>
                    <h3 class="font-medium text-yellow-900">Verification In Progress</h3>
                    <p class="text-sm text-yellow-700">Your application is being reviewed. This usually takes 2-3 business days.</p>
                  </div>
                </div>
              </div>

              <!-- Progress Steps -->
              <div class="relative">
                <div class="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                <div class="space-y-6">
                  <div class="flex items-center">
                    <div class="relative z-10 w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
                      <svg class="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                    </div>
                    <div class="ml-4">
                      <h4 class="font-medium text-gray-900">Application Submitted</h4>
                      <p class="text-sm text-gray-500">{{ currentVerification()?.submittedDate | date:'medium' }}</p>
                    </div>
                  </div>
                  <div class="flex items-center">
                    <div class="relative z-10 w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center animate-pulse">
                      <svg class="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                      </svg>
                    </div>
                    <div class="ml-4">
                      <h4 class="font-medium text-gray-900">Under Review</h4>
                      <p class="text-sm text-gray-500">Our team is verifying your documents</p>
                    </div>
                  </div>
                  <div class="flex items-center opacity-50">
                    <div class="relative z-10 w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center">
                      <svg class="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                    </div>
                    <div class="ml-4">
                      <h4 class="font-medium text-gray-500">Verification Complete</h4>
                      <p class="text-sm text-gray-400">Estimated: 2-3 business days</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Rejected Status -->
            <div *ngIf="currentVerification()?.status === 'rejected'" class="space-y-4">
              <div class="p-4 bg-red-50 rounded-lg">
                <div class="flex items-start">
                  <svg class="h-6 w-6 text-red-600 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <div>
                    <h3 class="font-medium text-red-900">Verification Rejected</h3>
                    <p class="text-sm text-red-700 mt-1">{{ currentVerification()?.rejectionReason }}</p>
                    <button (click)="startNewVerification()"
                            class="mt-3 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
                      Submit New Application
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- No Verification -->
            <div *ngIf="!currentVerification()" class="text-center py-8">
              <svg class="mx-auto h-16 w-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
              </svg>
              <h3 class="text-lg font-medium text-gray-900 mb-2">No Verification Found</h3>
              <p class="text-gray-600 mb-4">Start the verification process to unlock premium features</p>
              <button (click)="startNewVerification()"
                      class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Start Verification Process
              </button>
            </div>
          </div>
        </div>

        <!-- Verification Form (if starting new) -->
        <div *ngIf="showVerificationForm()" class="bg-white rounded-lg shadow p-6 mb-8">
          <h2 class="text-xl font-semibold text-gray-900 mb-6">Company Verification Application</h2>

          <!-- Step Indicator -->
          <div class="flex items-center justify-between mb-8">
            <div *ngFor="let step of verificationSteps; let i = index" class="flex items-center flex-1">
              <div class="relative">
                <div class="w-10 h-10 rounded-full flex items-center justify-center"
                     [class.bg-blue-600]="currentStep() > i"
                     [class.bg-blue-100]="currentStep() === i"
                     [class.bg-gray-200]="currentStep() < i"
                     [class.text-white]="currentStep() > i"
                     [class.text-blue-600]="currentStep() === i"
                     [class.text-gray-400]="currentStep() < i">
                  {{ i + 1 }}
                </div>
                <span class="absolute top-12 left-1/2 transform -translate-x-1/2 text-xs whitespace-nowrap"
                      [class.text-gray-900]="currentStep() >= i"
                      [class.text-gray-400]="currentStep() < i">
                  {{ step }}
                </span>
              </div>
              <div *ngIf="i < verificationSteps.length - 1" class="flex-1 h-0.5 mx-2"
                   [class.bg-blue-600]="currentStep() > i"
                   [class.bg-gray-200]="currentStep() <= i">
              </div>
            </div>
          </div>

          <!-- Step 1: Business Information -->
          <div *ngIf="currentStep() === 0" class="space-y-6">
            <h3 class="text-lg font-medium text-gray-900">Business Information</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Legal Company Name *</label>
                <input type="text" [(ngModel)]="formData.legalName"
                       class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Trading Name (if different)</label>
                <input type="text" [(ngModel)]="formData.tradingName"
                       class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Registration Number *</label>
                <input type="text" [(ngModel)]="formData.registrationNumber"
                       class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Tax ID *</label>
                <input type="text" [(ngModel)]="formData.taxId"
                       class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Industry *</label>
                <select [(ngModel)]="formData.industry"
                        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">Select Industry</option>
                  <option value="Technology">Technology</option>
                  <option value="Finance">Finance</option>
                  <option value="Healthcare">Healthcare</option>
                  <option value="Manufacturing">Manufacturing</option>
                  <option value="Retail">Retail</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Number of Employees *</label>
                <select [(ngModel)]="formData.employeeCount"
                        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">Select Range</option>
                  <option value="1-10">1-10</option>
                  <option value="11-50">11-50</option>
                  <option value="51-200">51-200</option>
                  <option value="201-500">201-500</option>
                  <option value="500+">500+</option>
                </select>
              </div>
              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 mb-2">Company Website *</label>
                <input type="url" [(ngModel)]="formData.website"
                       placeholder="https://example.com"
                       class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
              </div>
            </div>
          </div>

          <!-- Step 2: Contact Information -->
          <div *ngIf="currentStep() === 1" class="space-y-6">
            <h3 class="text-lg font-medium text-gray-900">Contact Information</h3>
            <div class="space-y-4">
              <h4 class="text-md font-medium text-gray-700">Primary Contact</h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                  <input type="text" [(ngModel)]="formData.contactName"
                         class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Job Title *</label>
                  <input type="text" [(ngModel)]="formData.contactTitle"
                         class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                  <input type="email" [(ngModel)]="formData.contactEmail"
                         class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Phone *</label>
                  <input type="tel" [(ngModel)]="formData.contactPhone"
                         class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                </div>
              </div>

              <h4 class="text-md font-medium text-gray-700 mt-6">Company Address</h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="md:col-span-2">
                  <label class="block text-sm font-medium text-gray-700 mb-2">Street Address *</label>
                  <input type="text" [(ngModel)]="formData.address"
                         class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">City *</label>
                  <input type="text" [(ngModel)]="formData.city"
                         class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">State/Province *</label>
                  <input type="text" [(ngModel)]="formData.state"
                         class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Country *</label>
                  <input type="text" [(ngModel)]="formData.country"
                         class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Postal Code *</label>
                  <input type="text" [(ngModel)]="formData.postalCode"
                         class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                </div>
              </div>
            </div>
          </div>

          <!-- Step 3: Document Upload -->
          <div *ngIf="currentStep() === 2" class="space-y-6">
            <h3 class="text-lg font-medium text-gray-900">Upload Documents</h3>
            <p class="text-sm text-gray-600">Please upload the required documents to verify your company's legitimacy.</p>

            <div class="space-y-4">
              <!-- Required Documents -->
              <div class="border-2 border-dashed border-gray-300 rounded-lg p-6">
                <h4 class="font-medium text-gray-900 mb-4">Required Documents</h4>
                <div class="space-y-3">
                  <div class="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <div>
                      <p class="font-medium text-gray-700">Business License or Registration Certificate</p>
                      <p class="text-sm text-gray-500">Official document showing company registration</p>
                    </div>
                    <button class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                      Upload
                    </button>
                  </div>
                  <div class="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <div>
                      <p class="font-medium text-gray-700">Tax Registration Certificate</p>
                      <p class="text-sm text-gray-500">Proof of tax registration with authorities</p>
                    </div>
                    <button class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                      Upload
                    </button>
                  </div>
                </div>
              </div>

              <!-- Optional Documents -->
              <div class="border-2 border-dashed border-gray-300 rounded-lg p-6">
                <h4 class="font-medium text-gray-900 mb-4">Optional Documents (Faster Verification)</h4>
                <div class="space-y-3">
                  <div class="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <div>
                      <p class="font-medium text-gray-700">Utility Bill</p>
                      <p class="text-sm text-gray-500">Recent utility bill showing company address</p>
                    </div>
                    <button class="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700">
                      Upload
                    </button>
                  </div>
                  <div class="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <div>
                      <p class="font-medium text-gray-700">Bank Statement</p>
                      <p class="text-sm text-gray-500">Recent bank statement in company name</p>
                    </div>
                    <button class="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700">
                      Upload
                    </button>
                  </div>
                </div>
              </div>

              <!-- Uploaded Documents -->
              <div *ngIf="uploadedDocuments().length > 0" class="mt-4">
                <h4 class="font-medium text-gray-900 mb-3">Uploaded Documents</h4>
                <div class="space-y-2">
                  <div *ngFor="let doc of uploadedDocuments()"
                       class="flex items-center justify-between p-3 bg-green-50 rounded">
                    <div class="flex items-center">
                      <svg class="h-5 w-5 text-green-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                      <span class="text-sm font-medium text-gray-700">{{ doc.name }}</span>
                    </div>
                    <button (click)="removeDocument(doc)" class="text-red-600 hover:text-red-800">
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Step 4: Review & Submit -->
          <div *ngIf="currentStep() === 3" class="space-y-6">
            <h3 class="text-lg font-medium text-gray-900">Review & Submit</h3>
            <p class="text-sm text-gray-600">Please review your information before submitting.</p>

            <!-- Summary -->
            <div class="bg-gray-50 rounded-lg p-6 space-y-4">
              <div>
                <h4 class="font-medium text-gray-900 mb-3">Business Information</h4>
                <dl class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <dt class="text-gray-500">Legal Name</dt>
                    <dd class="font-medium text-gray-900">{{ formData.legalName }}</dd>
                  </div>
                  <div>
                    <dt class="text-gray-500">Registration Number</dt>
                    <dd class="font-medium text-gray-900">{{ formData.registrationNumber }}</dd>
                  </div>
                  <div>
                    <dt class="text-gray-500">Industry</dt>
                    <dd class="font-medium text-gray-900">{{ formData.industry }}</dd>
                  </div>
                  <div>
                    <dt class="text-gray-500">Website</dt>
                    <dd class="font-medium text-gray-900">{{ formData.website }}</dd>
                  </div>
                </dl>
              </div>

              <div>
                <h4 class="font-medium text-gray-900 mb-3">Contact Information</h4>
                <dl class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <dt class="text-gray-500">Contact Name</dt>
                    <dd class="font-medium text-gray-900">{{ formData.contactName }}</dd>
                  </div>
                  <div>
                    <dt class="text-gray-500">Email</dt>
                    <dd class="font-medium text-gray-900">{{ formData.contactEmail }}</dd>
                  </div>
                </dl>
              </div>

              <div>
                <h4 class="font-medium text-gray-900 mb-3">Documents</h4>
                <p class="text-sm text-gray-600">{{ uploadedDocuments().length }} document(s) uploaded</p>
              </div>
            </div>

            <!-- Terms & Conditions -->
            <div class="border border-gray-200 rounded-lg p-4">
              <label class="flex items-start">
                <input type="checkbox" [(ngModel)]="formData.agreedToTerms"
                       class="mt-1 mr-3">
                <span class="text-sm text-gray-600">
                  I certify that all information provided is accurate and complete. I understand that providing false information may result in rejection of this application and potential legal action.
                </span>
              </label>
            </div>
          </div>

          <!-- Navigation Buttons -->
          <div class="flex justify-between mt-8">
            <button *ngIf="currentStep() > 0"
                    (click)="previousStep()"
                    class="px-6 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300">
              Previous
            </button>
            <div *ngIf="currentStep() === 0"></div>

            <button *ngIf="currentStep() < 3"
                    (click)="nextStep()"
                    [disabled]="!canProceed()"
                    class="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed">
              Next
            </button>

            <button *ngIf="currentStep() === 3"
                    (click)="submitVerification()"
                    [disabled]="!formData.agreedToTerms"
                    class="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed">
              Submit Application
            </button>
          </div>
        </div>

        <!-- Verification Statistics -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div class="bg-white rounded-lg shadow p-6">
            <div class="flex items-center">
              <div class="p-3 bg-green-100 rounded-lg">
                <svg class="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <div class="ml-4">
                <p class="text-sm text-gray-500">Verified Companies</p>
                <p class="text-2xl font-bold text-gray-900">{{ stats()?.totalVerified | number }}</p>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-lg shadow p-6">
            <div class="flex items-center">
              <div class="p-3 bg-yellow-100 rounded-lg">
                <svg class="h-6 w-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <div class="ml-4">
                <p class="text-sm text-gray-500">Pending Reviews</p>
                <p class="text-2xl font-bold text-gray-900">{{ stats()?.pendingVerifications | number }}</p>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-lg shadow p-6">
            <div class="flex items-center">
              <div class="p-3 bg-blue-100 rounded-lg">
                <svg class="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
                </svg>
              </div>
              <div class="ml-4">
                <p class="text-sm text-gray-500">Success Rate</p>
                <p class="text-2xl font-bold text-gray-900">{{ stats()?.verificationRate | number:'1.1-1' }}%</p>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-lg shadow p-6">
            <div class="flex items-center">
              <div class="p-3 bg-purple-100 rounded-lg">
                <svg class="h-6 w-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <div class="ml-4">
                <p class="text-sm text-gray-500">Avg. Processing</p>
                <p class="text-2xl font-bold text-gray-900">{{ stats()?.averageVerificationTime | number }} hrs</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class CompanyVerificationComponent implements OnInit {
  currentVerification = signal<CompanyVerification | undefined>(undefined);
  stats = signal<VerificationStats | undefined>(undefined);
  showVerificationForm = signal(false);
  currentStep = signal(0);
  uploadedDocuments = signal<VerificationDocument[]>([]);

  verificationSteps = ['Business Info', 'Contact Info', 'Documents', 'Review'];

  formData = {
    legalName: '',
    tradingName: '',
    registrationNumber: '',
    taxId: '',
    industry: '',
    employeeCount: '',
    website: '',
    contactName: '',
    contactTitle: '',
    contactEmail: '',
    contactPhone: '',
    address: '',
    city: '',
    state: '',
    country: '',
    postalCode: '',
    agreedToTerms: false
  };

  constructor(private verificationService: CompanyVerificationService) {}

  ngOnInit(): void {
    this.loadVerificationStatus();
    this.loadStats();
  }

  loadVerificationStatus(): void {
    // In real app, get company ID from auth service
    const companyId = 'comp1';
    this.verificationService.getVerificationByCompanyId(companyId).subscribe(verification => {
      this.currentVerification.set(verification);
    });
  }

  loadStats(): void {
    this.verificationService.getVerificationStats().subscribe(stats => {
      this.stats.set(stats);
    });
  }

  getStatusLabel(): string {
    const status = this.currentVerification()?.status;
    if (!status) return 'Not Verified';

    const labels = {
      'verified': 'Verified',
      'pending': 'Verification Pending',
      'rejected': 'Verification Rejected',
      'expired': 'Verification Expired'
    };

    return labels[status] || 'Not Verified';
  }

  getCheckLabel(type: string): string {
    const labels: Record<string, string> = {
      'document': 'Document Verification',
      'business_registry': 'Business Registry Check',
      'tax_verification': 'Tax Registration',
      'website': 'Website Verification',
      'social_media': 'Social Media Presence',
      'reference': 'Reference Check'
    };
    return labels[type] || type;
  }

  getDocumentLabel(type: string): string {
    const labels: Record<string, string> = {
      'business_license': 'Business License',
      'tax_certificate': 'Tax Certificate',
      'incorporation': 'Incorporation Certificate',
      'utility_bill': 'Utility Bill',
      'bank_statement': 'Bank Statement',
      'other': 'Other Document'
    };
    return labels[type] || type;
  }

  startNewVerification(): void {
    this.showVerificationForm.set(true);
    this.currentStep.set(0);
  }

  nextStep(): void {
    if (this.canProceed()) {
      this.currentStep.update(step => Math.min(step + 1, this.verificationSteps.length - 1));
    }
  }

  previousStep(): void {
    this.currentStep.update(step => Math.max(step - 1, 0));
  }

  canProceed(): boolean {
    const step = this.currentStep();

    switch(step) {
      case 0: // Business Info
        return !!(this.formData.legalName && this.formData.registrationNumber &&
                 this.formData.taxId && this.formData.industry &&
                 this.formData.employeeCount && this.formData.website);
      case 1: // Contact Info
        return !!(this.formData.contactName && this.formData.contactTitle &&
                 this.formData.contactEmail && this.formData.contactPhone &&
                 this.formData.address && this.formData.city &&
                 this.formData.state && this.formData.country && this.formData.postalCode);
      case 2: // Documents
        return this.uploadedDocuments().length >= 2; // At least 2 required documents
      case 3: // Review
        return this.formData.agreedToTerms;
      default:
        return false;
    }
  }

  removeDocument(doc: VerificationDocument): void {
    this.uploadedDocuments.update(docs => docs.filter(d => d.id !== doc.id));
  }

  submitVerification(): void {
    const verification: Partial<CompanyVerification> = {
      companyId: 'comp-new',
      companyName: this.formData.legalName,
      verificationLevel: 'standard',
      documents: this.uploadedDocuments(),
      businessInfo: {
        legalName: this.formData.legalName,
        tradingName: this.formData.tradingName,
        registrationNumber: this.formData.registrationNumber,
        taxId: this.formData.taxId,
        incorporationDate: new Date(),
        industry: this.formData.industry,
        employeeCount: this.formData.employeeCount,
        website: this.formData.website,
        headquarters: {
          address: this.formData.address,
          city: this.formData.city,
          state: this.formData.state,
          country: this.formData.country,
          postalCode: this.formData.postalCode
        }
      },
      contactInfo: {
        primaryContact: {
          name: this.formData.contactName,
          title: this.formData.contactTitle,
          email: this.formData.contactEmail,
          phone: this.formData.contactPhone
        }
      }
    };

    this.verificationService.submitVerification(verification).subscribe(result => {
      this.showVerificationForm.set(false);
      this.loadVerificationStatus();
      alert('Verification application submitted successfully!');
    });
  }

  downloadCertificate(): void {
    // In real app, generate and download PDF certificate
    alert('Certificate download started...');
  }
}
