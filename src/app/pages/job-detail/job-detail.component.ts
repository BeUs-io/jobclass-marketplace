import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { JobService } from '../../services/job.service';
import { AuthService, User } from '../../services/auth.service';
import { Job, JobType } from '../../models/job.model';
import { Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

interface JobApplication {
  fullName: string;
  email: string;
  phone: string;
  coverLetter: string;
  resume?: File;
  linkedIn?: string;
  portfolio?: string;
  availableStart?: string;
  expectedSalary?: string;
  referralSource?: string;
  agreeToTerms?: boolean;
}

@Component({
  selector: 'app-job-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="min-h-screen bg-gray-50">
      <div *ngIf="job$ | async as job" class="container mx-auto px-4 py-8">
        <!-- Breadcrumb -->
        <nav class="flex items-center text-sm text-gray-600 mb-6">
          <a routerLink="/" class="hover:text-primary">Home</a>
          <span class="mx-2">/</span>
          <a routerLink="/jobs" class="hover:text-primary">Jobs</a>
          <span class="mx-2">/</span>
          <span class="text-gray-900">{{job.title}}</span>
        </nav>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <!-- Main Content -->
          <div class="lg:col-span-2 space-y-6">
            <!-- Job Header -->
            <div class="bg-white rounded-lg shadow-sm p-6">
              <div class="flex items-start justify-between mb-4">
                <div class="flex items-start space-x-4">
                  <img
                    [src]="job.company.logo || 'https://ui-avatars.com/api/?name=' + job.company.name"
                    [alt]="job.company.name"
                    class="w-16 h-16 rounded-lg object-cover"
                  >
                  <div>
                    <h1 class="text-2xl font-bold text-gray-900 mb-2">{{job.title}}</h1>
                    <div class="flex items-center space-x-2 text-gray-600">
                      <a [routerLink]="['/company', job.company.id]" class="hover:text-primary">
                        {{job.company.name}}
                      </a>
                      <span>•</span>
                      <span class="flex items-center">
                        <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                        </svg>
                        {{job.location}}
                      </span>
                    </div>
                  </div>
                </div>
                <div class="flex items-center space-x-2">
                  <button
                    (click)="toggleSaveJob()"
                    class="p-2 rounded-lg border hover:bg-gray-50 transition-colors"
                    [class.bg-red-50]="isJobSaved$ | async"
                    [class.border-red-200]="isJobSaved$ | async"
                  >
                    <svg
                      class="w-5 h-5"
                      [class.text-red-500]="isJobSaved$ | async"
                      [class.text-gray-400]="!(isJobSaved$ | async)"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd"/>
                    </svg>
                  </button>
                  <button
                    (click)="shareJob()"
                    class="p-2 rounded-lg border hover:bg-gray-50 transition-colors"
                  >
                    <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m9.032 4.026a3 3 0 10-5.464 0m5.464 0a3 3 0 10-5.464 0M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    </svg>
                  </button>
                  <button
                    (click)="printJob()"
                    class="p-2 rounded-lg border hover:bg-gray-50 transition-colors"
                  >
                    <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </button>
                </div>
              </div>

              <!-- Job Meta Info -->
              <div class="flex flex-wrap gap-4 text-sm">
                <span class="flex items-center text-gray-600">
                  <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A9 9 0 1 0 8.745 21h6.51A9 9 0 0 0 21 13.255z"></path>
                  </svg>
                  {{job.type}}
                </span>
                <span class="flex items-center text-gray-600">
                  <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                  </svg>
                  {{job.category}}
                </span>
                <span *ngIf="job.salary" class="flex items-center text-gray-600">
                  <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  {{formatSalary(job.salary)}}
                </span>
                <span class="flex items-center text-gray-600">
                  <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  Posted {{getTimeAgo(job.postedDate)}}
                </span>
                <span *ngIf="job.applicationDeadline" class="flex items-center text-gray-600">
                  <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                  </svg>
                  Deadline: {{job.applicationDeadline | date: 'MMM d, yyyy'}}
                </span>
              </div>

              <!-- Skills Tags -->
              <div *ngIf="job.skills && job.skills.length > 0" class="mt-4">
                <div class="flex flex-wrap gap-2">
                  <span *ngFor="let skill of job.skills" class="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">
                    {{skill}}
                  </span>
                </div>
              </div>

              <!-- Apply Button (Mobile) -->
              <div class="mt-6 lg:hidden">
                <button (click)="showApplicationModal()" class="btn btn-primary w-full">
                  Apply Now
                </button>
              </div>
            </div>

            <!-- Job Description -->
            <div class="bg-white rounded-lg shadow-sm p-6">
              <h2 class="text-xl font-semibold mb-4">Job Description</h2>
              <div class="prose prose-gray max-w-none">
                <p class="text-gray-700 whitespace-pre-line">{{job.description}}</p>
              </div>

              <!-- Key Responsibilities -->
              <div *ngIf="job.responsibilities && job.responsibilities.length > 0" class="mt-6">
                <h3 class="font-semibold mb-3">Key Responsibilities</h3>
                <ul class="space-y-2">
                  <li *ngFor="let resp of job.responsibilities" class="flex items-start">
                    <span class="text-primary mr-2">•</span>
                    <span class="text-gray-700">{{resp}}</span>
                  </li>
                </ul>
              </div>
            </div>

            <!-- Requirements -->
            <div *ngIf="job.requirements && job.requirements.length > 0" class="bg-white rounded-lg shadow-sm p-6">
              <h2 class="text-xl font-semibold mb-4">Requirements</h2>
              <ul class="space-y-2">
                <li *ngFor="let req of job.requirements" class="flex items-start">
                  <svg class="w-5 h-5 text-primary mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <span class="text-gray-700">{{req}}</span>
                </li>
              </ul>
            </div>

            <!-- Qualifications & Experience -->
            <div *ngIf="job.qualifications" class="bg-white rounded-lg shadow-sm p-6">
              <h2 class="text-xl font-semibold mb-4">Qualifications & Experience</h2>
              <div class="space-y-3">
                <div *ngIf="job.qualifications.education">
                  <h3 class="font-medium mb-2">Education</h3>
                  <p class="text-gray-700">{{job.qualifications.education}}</p>
                </div>
                <div *ngIf="job.qualifications.experience">
                  <h3 class="font-medium mb-2">Experience</h3>
                  <p class="text-gray-700">{{job.qualifications.experience}}</p>
                </div>
                <div *ngIf="job.qualifications.certifications && job.qualifications.certifications.length > 0">
                  <h3 class="font-medium mb-2">Preferred Certifications</h3>
                  <ul class="list-disc list-inside text-gray-700">
                    <li *ngFor="let cert of job.qualifications.certifications">{{cert}}</li>
                  </ul>
                </div>
              </div>
            </div>

            <!-- Benefits -->
            <div *ngIf="job.benefits && job.benefits.length > 0" class="bg-white rounded-lg shadow-sm p-6">
              <h2 class="text-xl font-semibold mb-4">Benefits & Perks</h2>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div *ngFor="let benefit of job.benefits" class="flex items-center">
                  <svg class="w-5 h-5 text-green-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span class="text-gray-700">{{benefit}}</span>
                </div>
              </div>
            </div>

            <!-- Work Environment -->
            <div *ngIf="job.workEnvironment" class="bg-white rounded-lg shadow-sm p-6">
              <h2 class="text-xl font-semibold mb-4">Work Environment</h2>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div *ngIf="job.workEnvironment.type" class="flex items-center">
                  <svg class="w-5 h-5 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                  </svg>
                  <span class="text-gray-700">{{job.workEnvironment.type}}</span>
                </div>
                <div *ngIf="job.workEnvironment.schedule" class="flex items-center">
                  <svg class="w-5 h-5 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
                  </svg>
                  <span class="text-gray-700">{{job.workEnvironment.schedule}}</span>
                </div>
                <div *ngIf="job.workEnvironment.teamSize" class="flex items-center">
                  <svg class="w-5 h-5 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
                  </svg>
                  <span class="text-gray-700">Team of {{job.workEnvironment.teamSize}}</span>
                </div>
                <div *ngIf="job.workEnvironment.travelRequired !== undefined" class="flex items-center">
                  <svg class="w-5 h-5 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <span class="text-gray-700">{{job.workEnvironment.travelRequired ? 'Travel Required' : 'No Travel Required'}}</span>
                </div>
              </div>
            </div>

            <!-- About Company -->
            <div class="bg-white rounded-lg shadow-sm p-6">
              <h2 class="text-xl font-semibold mb-4">About {{job.company.name}}</h2>
              <p class="text-gray-700 mb-4">
                {{job.company.description || 'Leading company in the ' + job.category + ' industry, committed to innovation and excellence.'}}
              </p>
              <div *ngIf="job.company.culture" class="mb-4">
                <h3 class="font-medium mb-2">Company Culture</h3>
                <p class="text-gray-700">{{job.company.culture}}</p>
              </div>
              <a [routerLink]="['/company', job.company.id]" class="text-primary hover:text-primary-dark inline-flex items-center">
                View Company Profile
                <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </a>
            </div>
          </div>

          <!-- Sidebar -->
          <div class="lg:col-span-1 space-y-6">
            <!-- Apply Card -->
            <div class="bg-white rounded-lg shadow-sm p-6 sticky top-4">
              <h3 class="font-semibold mb-4">Apply for this position</h3>

              <div class="space-y-4 mb-6">
                <div class="flex items-center text-sm text-gray-600">
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                  </svg>
                  {{job.views || 0}} views
                </div>
                <div class="flex items-center text-sm text-gray-600">
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
                  </svg>
                  {{job.applications || 0}} applicants
                </div>
                <div *ngIf="job.hiringManager" class="flex items-center text-sm text-gray-600">
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
                  </svg>
                  Hiring Manager: {{job.hiringManager}}
                </div>
              </div>

              <button
                (click)="showApplicationModal()"
                class="btn btn-primary w-full mb-3"
              >
                Apply Now
              </button>

              <button
                (click)="applyWithResume()"
                class="btn btn-outline w-full"
              >
                Quick Apply with Resume
              </button>

              <div class="mt-4 p-3 bg-blue-50 rounded-lg">
                <div class="flex items-start">
                  <svg class="w-5 h-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                  </svg>
                  <div class="text-xs text-blue-700">
                    <p class="font-medium">Application Tips:</p>
                    <ul class="mt-1 space-y-1">
                      <li>• Tailor your resume to match key requirements</li>
                      <li>• Include a personalized cover letter</li>
                      <li>• Follow up within 1 week</li>
                    </ul>
                  </div>
                </div>
              </div>

              <p class="text-xs text-gray-500 mt-4 text-center">
                By applying, you agree to our Terms and Privacy Policy
              </p>
            </div>

            <!-- Job Stats -->
            <div class="bg-white rounded-lg shadow-sm p-6">
              <h3 class="font-semibold mb-4">Job Overview</h3>
              <div class="space-y-3">
                <div>
                  <span class="text-sm text-gray-600">Job Type</span>
                  <p class="font-medium">{{job.type}}</p>
                </div>
                <div>
                  <span class="text-sm text-gray-600">Category</span>
                  <p class="font-medium">{{job.category}}</p>
                </div>
                <div>
                  <span class="text-sm text-gray-600">Location</span>
                  <p class="font-medium">{{job.location}}</p>
                </div>
                <div *ngIf="job.salary">
                  <span class="text-sm text-gray-600">Salary Range</span>
                  <p class="font-medium">{{formatSalary(job.salary)}}</p>
                </div>
                <div *ngIf="job.experienceLevel">
                  <span class="text-sm text-gray-600">Experience Level</span>
                  <p class="font-medium">{{job.experienceLevel}}</p>
                </div>
                <div>
                  <span class="text-sm text-gray-600">Posted Date</span>
                  <p class="font-medium">{{job.postedDate | date: 'MMM d, yyyy'}}</p>
                </div>
                <div *ngIf="job.applicationDeadline">
                  <span class="text-sm text-gray-600">Application Deadline</span>
                  <p class="font-medium">{{job.applicationDeadline | date: 'MMM d, yyyy'}}</p>
                </div>
              </div>
            </div>

            <!-- Report Job -->
            <div class="bg-white rounded-lg shadow-sm p-6">
              <h3 class="font-semibold mb-4">Is this job suspicious?</h3>
              <button (click)="reportJob()" class="text-red-600 hover:text-red-700 text-sm flex items-center">
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                Report this job posting
              </button>
            </div>

            <!-- Share Job -->
            <div class="bg-white rounded-lg shadow-sm p-6">
              <h3 class="font-semibold mb-4">Share this job</h3>
              <div class="flex space-x-2">
                <button
                  (click)="shareOn('facebook')"
                  class="flex-1 p-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                >
                  <svg class="w-5 h-5 mx-auto" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </button>
                <button
                  (click)="shareOn('twitter')"
                  class="flex-1 p-2 bg-black text-white rounded hover:bg-gray-800 transition-colors"
                >
                  <svg class="w-5 h-5 mx-auto" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </button>
                <button
                  (click)="shareOn('linkedin')"
                  class="flex-1 p-2 bg-blue-700 text-white rounded hover:bg-blue-800 transition-colors"
                >
                  <svg class="w-5 h-5 mx-auto" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </button>
                <button
                  (click)="copyLink()"
                  class="flex-1 p-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
                >
                  <svg class="w-5 h-5 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Similar Jobs -->
        <div class="mt-12">
          <h2 class="text-2xl font-bold mb-6">Similar Jobs</h2>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div
              *ngFor="let similarJob of similarJobs$ | async"
              class="bg-white rounded-lg shadow-sm p-6 hover:shadow-lg transition-shadow"
            >
              <div class="flex items-start space-x-3 mb-4">
                <img
                  [src]="similarJob.company.logo || 'https://ui-avatars.com/api/?name=' + similarJob.company.name"
                  [alt]="similarJob.company.name"
                  class="w-12 h-12 rounded-lg object-cover"
                >
                <div>
                  <h3 class="font-semibold">
                    <a [routerLink]="['/job', similarJob.id]" class="hover:text-primary">
                      {{similarJob.title}}
                    </a>
                  </h3>
                  <p class="text-sm text-gray-600">{{similarJob.company.name}}</p>
                </div>
              </div>
              <div class="flex items-center justify-between text-sm text-gray-500">
                <span>{{similarJob.location}}</span>
                <span class="badge badge-primary">{{similarJob.type}}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div *ngIf="!(job$ | async)" class="container mx-auto px-4 py-12">
        <div class="text-center">
          <svg class="animate-spin h-10 w-10 text-primary mx-auto mb-4" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p class="text-gray-600">Loading job details...</p>
        </div>
      </div>

      <!-- Application Modal -->
      <div
        *ngIf="showApplication"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
        (click)="closeApplicationModal($event)"
      >
        <div
          class="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-slide-up"
          (click)="$event.stopPropagation()"
        >
          <div class="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
            <h2 class="text-xl font-semibold">Apply for {{(job$ | async)?.title}}</h2>
            <button
              (click)="closeApplicationModal()"
              class="p-1 hover:bg-gray-100 rounded"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>

          <form (submit)="submitApplication($event)" class="p-6 space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Full Name <span class="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  [(ngModel)]="applicationForm.fullName"
                  name="fullName"
                  required
                  class="input-field"
                >
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Email <span class="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  [(ngModel)]="applicationForm.email"
                  name="email"
                  required
                  class="input-field"
                >
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Phone <span class="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  [(ngModel)]="applicationForm.phone"
                  name="phone"
                  required
                  class="input-field"
                >
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  LinkedIn Profile
                </label>
                <input
                  type="url"
                  [(ngModel)]="applicationForm.linkedIn"
                  name="linkedIn"
                  placeholder="https://linkedin.com/in/..."
                  class="input-field"
                >
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Portfolio/Website
                </label>
                <input
                  type="url"
                  [(ngModel)]="applicationForm.portfolio"
                  name="portfolio"
                  placeholder="https://..."
                  class="input-field"
                >
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Available to Start
                </label>
                <input
                  type="date"
                  [(ngModel)]="applicationForm.availableStart"
                  name="availableStart"
                  class="input-field"
                >
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Expected Salary (Annual)
              </label>
              <input
                type="text"
                [(ngModel)]="applicationForm.expectedSalary"
                name="expectedSalary"
                placeholder="e.g., 80,000 - 100,000"
                class="input-field"
              >
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                How did you hear about this position?
              </label>
              <select
                [(ngModel)]="applicationForm.referralSource"
                name="referralSource"
                class="input-field"
              >
                <option value="">Select an option</option>
                <option value="jobboard">Job Board</option>
                <option value="company-website">Company Website</option>
                <option value="linkedin">LinkedIn</option>
                <option value="referral">Employee Referral</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Cover Letter <span class="text-red-500">*</span>
              </label>
              <textarea
                [(ngModel)]="applicationForm.coverLetter"
                name="coverLetter"
                required
                rows="6"
                placeholder="Tell us why you're interested in this position and what makes you a great fit..."
                class="input-field"
              ></textarea>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Resume/CV <span class="text-red-500">*</span>
              </label>
              <div class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <svg class="w-12 h-12 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                </svg>
                <p class="text-gray-600 mb-2">Drop your resume here or click to browse</p>
                <input
                  type="file"
                  (change)="onFileSelected($event)"
                  accept=".pdf,.doc,.docx"
                  class="hidden"
                  #fileInput
                >
                <button
                  type="button"
                  (click)="fileInput.click()"
                  class="btn btn-outline"
                >
                  Choose File
                </button>
                <p *ngIf="selectedFileName" class="mt-2 text-sm text-gray-600">
                  Selected: {{selectedFileName}}
                </p>
              </div>
            </div>

            <div class="flex items-start">
              <input
                type="checkbox"
                [(ngModel)]="applicationForm.agreeToTerms"
                name="agreeToTerms"
                id="agreeToTerms"
                class="mr-2 mt-0.5 text-primary rounded focus:ring-primary"
              >
              <label for="agreeToTerms" class="text-sm text-gray-600">
                I agree to the processing of my personal data in accordance with the Privacy Policy
              </label>
            </div>

            <div class="flex gap-4 pt-4">
              <button
                type="button"
                (click)="closeApplicationModal()"
                class="btn btn-outline flex-1"
              >
                Cancel
              </button>
              <button
                type="submit"
                [disabled]="isSubmitting"
                class="btn btn-primary flex-1"
              >
                {{isSubmitting ? 'Submitting...' : 'Submit Application'}}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .prose p {
      margin-bottom: 1rem;
    }

    .prose ul {
      list-style-type: disc;
      padding-left: 1.5rem;
      margin-bottom: 1rem;
    }

    .prose li {
      margin-bottom: 0.5rem;
    }
  `]
})
export class JobDetailComponent implements OnInit {
  job$!: Observable<Job | undefined>;
  similarJobs$!: Observable<Job[]>;
  isJobSaved$!: Observable<boolean>;
  currentUser$!: Observable<User | null>;

  showApplication = false;
  isSubmitting = false;
  selectedFileName = '';

  applicationForm: JobApplication = {
    fullName: '',
    email: '',
    phone: '',
    coverLetter: ''
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private jobService: JobService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.job$ = this.route.paramMap.pipe(
      switchMap(params => {
        const jobId = params.get('id');
        return jobId ? this.jobService.getJobById(jobId) : of(undefined);
      })
    );

    this.similarJobs$ = this.job$.pipe(
      switchMap(job => {
        if (job) {
          // Get similar jobs based on category
          return this.jobService.searchJobs({ category: job.category }).pipe(
            map(jobs => jobs.filter(j => j.id !== job.id).slice(0, 3))
          );
        }
        return of([]);
      })
    );

    this.job$.subscribe(job => {
      if (job) {
        this.isJobSaved$ = this.jobService.isJobSaved(job.id);
        // Update views count (in real app, this would be an API call)
        if (!job.views) job.views = 0;
        job.views++;
      }
    });

    this.currentUser$ = this.authService.currentUser$;

    // Pre-fill form if user is logged in
    this.currentUser$.subscribe(user => {
      if (user) {
        this.applicationForm.fullName = user.name;
        this.applicationForm.email = user.email;
        this.applicationForm.phone = user.phone || '';
      }
    });
  }

  toggleSaveJob() {
    this.job$.subscribe(job => {
      if (job) {
        const user = this.authService.getCurrentUser();
        if (user) {
          this.jobService.toggleSaveJob(job.id);
        } else {
          alert('Please login to save jobs');
        }
      }
    });
  }

  shareJob() {
    const url = window.location.href;
    this.copyToClipboard(url);
    alert('Job link copied to clipboard!');
  }

  shareOn(platform: string) {
    const url = encodeURIComponent(window.location.href);
    this.job$.subscribe(job => {
      if (job) {
        const text = encodeURIComponent(`Check out this job: ${job.title} at ${job.company.name}`);
        let shareUrl = '';

        switch (platform) {
          case 'facebook':
            shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
            break;
          case 'twitter':
            shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${text}`;
            break;
          case 'linkedin':
            shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
            break;
        }

        if (shareUrl) {
          window.open(shareUrl, '_blank', 'width=600,height=400');
        }
      }
    });
  }

  copyLink() {
    this.copyToClipboard(window.location.href);
    alert('Link copied to clipboard!');
  }

  private copyToClipboard(text: string) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
  }

  showApplicationModal() {
    const user = this.authService.getCurrentUser();
    if (!user) {
      if (confirm('Please login to apply for this job. Would you like to login now?')) {
        // In real app, navigate to login or show login modal
        alert('Login functionality would be triggered here');
      }
      return;
    }
    this.showApplication = true;
    document.body.style.overflow = 'hidden';
  }

  closeApplicationModal(event?: Event) {
    if (!event || event.target === event.currentTarget) {
      this.showApplication = false;
      document.body.style.overflow = '';
    }
  }

  applyWithResume() {
    const user = this.authService.getCurrentUser();
    if (!user) {
      alert('Please login to apply');
      return;
    }

    if (user.resume) {
      // Quick apply with saved resume
      this.isSubmitting = true;
      setTimeout(() => {
        this.isSubmitting = false;
        alert('Application submitted successfully with your saved resume!');

        // Add to applied jobs
        this.job$.subscribe(job => {
          if (job) {
            if (!user.appliedJobs) user.appliedJobs = [];
            user.appliedJobs.push(job.id);
            this.authService.updateProfile({ appliedJobs: user.appliedJobs });

            // Add notification
            this.authService.addNotification({
              id: Date.now().toString(),
              type: 'application_status',
              title: 'Application Submitted',
              message: `Your application for ${job.title} at ${job.company.name} has been submitted successfully.`,
              read: false,
              createdAt: new Date(),
              jobId: job.id
            });
          }
        });
      }, 1500);
    } else {
      alert('Please upload a resume in your profile to use Quick Apply');
      this.router.navigate(['/profile']);
    }
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.applicationForm.resume = input.files[0];
      this.selectedFileName = input.files[0].name;
    }
  }

  submitApplication(event: Event) {
    event.preventDefault();

    if (!this.applicationForm.resume) {
      alert('Please upload your resume');
      return;
    }

    this.isSubmitting = true;

    // Simulate API call
    setTimeout(() => {
      this.isSubmitting = false;
      this.closeApplicationModal();
      alert('Your application has been submitted successfully! You will receive a confirmation email shortly.');

      // Update user's applied jobs
      const user = this.authService.getCurrentUser();
      if (user) {
        this.job$.subscribe(job => {
          if (job) {
            if (!user.appliedJobs) user.appliedJobs = [];
            user.appliedJobs.push(job.id);
            this.authService.updateProfile({ appliedJobs: user.appliedJobs });

            // Add notification
            this.authService.addNotification({
              id: Date.now().toString(),
              type: 'application_status',
              title: 'Application Submitted',
              message: `Your application for ${job.title} at ${job.company.name} has been submitted successfully.`,
              read: false,
              createdAt: new Date(),
              jobId: job.id
            });
          }
        });
      }
    }, 2000);
  }

  printJob() {
    window.print();
  }

  reportJob() {
    if (confirm('Are you sure you want to report this job posting as suspicious?')) {
      alert('Thank you for reporting. We will review this job posting.');
    }
  }

  formatSalary(salary: { min: number; max: number; currency: string }): string {
    return `$${salary.min.toLocaleString()} - $${salary.max.toLocaleString()} ${salary.currency}`;
  }

  getTimeAgo(date: Date): string {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));

    if (hours < 1) return 'just now';
    if (hours < 24) return `${hours} hours ago`;

    const days = Math.floor(hours / 24);
    if (days === 1) return 'yesterday';
    if (days < 30) return `${days} days ago`;

    const months = Math.floor(days / 30);
    return `${months} month${months > 1 ? 's' : ''} ago`;
  }
}
