import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { JobType } from '../../models/job.model';

interface JobPostingForm {
  title: string;
  company: string;
  location: string;
  type: JobType;
  category: string;
  description: string;
  requirements: string;
  benefits: string;
  salaryMin?: number;
  salaryMax?: number;
  salaryCurrency: string;
  applicationEmail: string;
  applicationUrl?: string;
  isRemote: boolean;
  isPremium: boolean;
  experienceLevel: string;
  deadline?: string;
}

@Component({
  selector: 'app-post-job',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen bg-gray-50 py-8">
      <div class="container mx-auto px-4">
        <div class="max-w-4xl mx-auto">
          <!-- Header -->
          <div class="mb-8">
            <h1 class="text-3xl font-bold text-gray-800 mb-2">Post a New Job</h1>
            <p class="text-gray-600">Fill in the details below to create your job listing</p>
          </div>

          <!-- Form -->
          <form (ngSubmit)="submitJob()" #jobForm="ngForm" class="space-y-6">
            <!-- Basic Information -->
            <div class="bg-white rounded-lg shadow-sm p-6">
              <h2 class="text-xl font-semibold mb-4">Basic Information</h2>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Job Title <span class="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    [(ngModel)]="formData.title"
                    name="title"
                    required
                    placeholder="e.g., Senior Frontend Developer"
                    class="input-field"
                  >
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Company Name <span class="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    [(ngModel)]="formData.company"
                    name="company"
                    required
                    placeholder="Your company name"
                    class="input-field"
                  >
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Location <span class="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    [(ngModel)]="formData.location"
                    name="location"
                    required
                    placeholder="e.g., New York, NY or Remote"
                    class="input-field"
                  >
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Job Type <span class="text-red-500">*</span>
                  </label>
                  <select
                    [(ngModel)]="formData.type"
                    name="type"
                    required
                    class="input-field"
                  >
                    <option value="">Select job type</option>
                    <option [value]="JobType.FULL_TIME">Full-time</option>
                    <option [value]="JobType.PART_TIME">Part-time</option>
                    <option [value]="JobType.CONTRACT">Contract</option>
                    <option [value]="JobType.TEMPORARY">Temporary</option>
                    <option [value]="JobType.INTERNSHIP">Internship</option>
                  </select>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Category <span class="text-red-500">*</span>
                  </label>
                  <select
                    [(ngModel)]="formData.category"
                    name="category"
                    required
                    class="input-field"
                  >
                    <option value="">Select category</option>
                    <option value="Engineering">Engineering</option>
                    <option value="Marketing">Marketing & Communication</option>
                    <option value="Sales">Sales</option>
                    <option value="Design">Design</option>
                    <option value="Product">Product</option>
                    <option value="IT & Telecoms">IT & Telecoms</option>
                    <option value="Finance">Financial Services</option>
                    <option value="HR">Human Resources</option>
                    <option value="Healthcare">Medical & Healthcare</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Experience Level <span class="text-red-500">*</span>
                  </label>
                  <select
                    [(ngModel)]="formData.experienceLevel"
                    name="experienceLevel"
                    required
                    class="input-field"
                  >
                    <option value="">Select level</option>
                    <option value="entry">Entry Level (0-2 years)</option>
                    <option value="mid">Mid Level (2-5 years)</option>
                    <option value="senior">Senior Level (5+ years)</option>
                    <option value="executive">Executive</option>
                  </select>
                </div>
              </div>

              <div class="mt-4">
                <label class="flex items-center">
                  <input
                    type="checkbox"
                    [(ngModel)]="formData.isRemote"
                    name="isRemote"
                    class="mr-2 text-primary rounded focus:ring-primary"
                  >
                  <span class="text-sm font-medium text-gray-700">This is a remote position</span>
                </label>
              </div>
            </div>

            <!-- Job Details -->
            <div class="bg-white rounded-lg shadow-sm p-6">
              <h2 class="text-xl font-semibold mb-4">Job Details</h2>

              <div class="space-y-6">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Job Description <span class="text-red-500">*</span>
                  </label>
                  <textarea
                    [(ngModel)]="formData.description"
                    name="description"
                    required
                    rows="6"
                    placeholder="Describe the role, responsibilities, and what makes this opportunity unique..."
                    class="input-field"
                  ></textarea>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Requirements <span class="text-red-500">*</span>
                  </label>
                  <textarea
                    [(ngModel)]="formData.requirements"
                    name="requirements"
                    required
                    rows="4"
                    placeholder="List the required skills, experience, and qualifications (one per line)"
                    class="input-field"
                  ></textarea>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Benefits
                  </label>
                  <textarea
                    [(ngModel)]="formData.benefits"
                    name="benefits"
                    rows="4"
                    placeholder="List the benefits and perks (one per line)"
                    class="input-field"
                  ></textarea>
                </div>
              </div>
            </div>

            <!-- Salary Information -->
            <div class="bg-white rounded-lg shadow-sm p-6">
              <h2 class="text-xl font-semibold mb-4">Salary Information</h2>

              <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Minimum Salary
                  </label>
                  <input
                    type="number"
                    [(ngModel)]="formData.salaryMin"
                    name="salaryMin"
                    placeholder="50000"
                    class="input-field"
                  >
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Maximum Salary
                  </label>
                  <input
                    type="number"
                    [(ngModel)]="formData.salaryMax"
                    name="salaryMax"
                    placeholder="80000"
                    class="input-field"
                  >
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Currency
                  </label>
                  <select
                    [(ngModel)]="formData.salaryCurrency"
                    name="salaryCurrency"
                    class="input-field"
                  >
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="GBP">GBP</option>
                    <option value="CAD">CAD</option>
                    <option value="AUD">AUD</option>
                  </select>
                </div>
              </div>
            </div>

            <!-- Application Settings -->
            <div class="bg-white rounded-lg shadow-sm p-6">
              <h2 class="text-xl font-semibold mb-4">Application Settings</h2>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Application Email <span class="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    [(ngModel)]="formData.applicationEmail"
                    name="applicationEmail"
                    required
                    placeholder="hr@company.com"
                    class="input-field"
                  >
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Application URL
                  </label>
                  <input
                    type="url"
                    [(ngModel)]="formData.applicationUrl"
                    name="applicationUrl"
                    placeholder="https://company.com/careers"
                    class="input-field"
                  >
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Application Deadline
                  </label>
                  <input
                    type="date"
                    [(ngModel)]="formData.deadline"
                    name="deadline"
                    class="input-field"
                  >
                </div>
              </div>
            </div>

            <!-- Premium Options -->
            <div class="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-6">
              <h2 class="text-xl font-semibold mb-4">Premium Options</h2>

              <label class="flex items-start">
                <input
                  type="checkbox"
                  [(ngModel)]="formData.isPremium"
                  name="isPremium"
                  class="mr-3 mt-1 text-primary rounded focus:ring-primary"
                >
                <div>
                  <span class="font-medium text-gray-700">Make this a Premium listing</span>
                  <p class="text-sm text-gray-600 mt-1">
                    Premium listings get 5x more visibility, appear at the top of search results,
                    and include special highlighting. ($99 for 30 days)
                  </p>
                </div>
              </label>
            </div>

            <!-- Submit Buttons -->
            <div class="flex gap-4">
              <button
                type="button"
                (click)="saveAsDraft()"
                class="btn btn-outline flex-1"
              >
                Save as Draft
              </button>
              <button
                type="submit"
                [disabled]="!jobForm.form.valid || submitting"
                class="btn btn-primary flex-1"
              >
                {{submitting ? 'Publishing...' : 'Publish Job'}}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class PostJobComponent {
  JobType = JobType;
  submitting = false;

  formData: JobPostingForm = {
    title: '',
    company: '',
    location: '',
    type: JobType.FULL_TIME,
    category: '',
    description: '',
    requirements: '',
    benefits: '',
    salaryCurrency: 'USD',
    applicationEmail: '',
    isRemote: false,
    isPremium: false,
    experienceLevel: ''
  };

  constructor(
    private router: Router,
    private authService: AuthService
  ) {
    // Check if user is logged in and is an employer
    const user = this.authService.getCurrentUser();
    if (!user) {
      this.router.navigate(['/']);
      return;
    }

    if (user.role === 'employer' && user.company) {
      this.formData.company = user.company;
    }
  }

  submitJob() {
    if (this.submitting) return;

    this.submitting = true;

    // Simulate API call
    setTimeout(() => {
      console.log('Job posted:', this.formData);
      this.submitting = false;

      // Show success message
      alert('Job posted successfully!');

      // Redirect to job listing or dashboard
      this.router.navigate(['/jobs']);
    }, 1500);
  }

  saveAsDraft() {
    console.log('Saving as draft:', this.formData);
    // Save to localStorage or API
    localStorage.setItem('jobDraft', JSON.stringify(this.formData));
    alert('Draft saved successfully!');
  }
}
