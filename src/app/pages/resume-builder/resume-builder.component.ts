import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

interface ResumeData {
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    location: string;
    linkedIn?: string;
    portfolio?: string;
    summary?: string;
  };
  experience: {
    id: string;
    company: string;
    position: string;
    location: string;
    startDate: string;
    endDate: string;
    current: boolean;
    description: string;
    achievements: string[];
  }[];
  education: {
    id: string;
    institution: string;
    degree: string;
    field: string;
    startDate: string;
    endDate: string;
    gpa?: string;
    honors?: string;
  }[];
  skills: {
    category: string;
    items: string[];
  }[];
  certifications: {
    id: string;
    name: string;
    issuer: string;
    date: string;
    expiryDate?: string;
    credentialId?: string;
  }[];
  languages: {
    language: string;
    proficiency: string;
  }[];
  projects?: {
    id: string;
    name: string;
    description: string;
    technologies: string[];
    link?: string;
  }[];
  references?: {
    name: string;
    position: string;
    company: string;
    email: string;
    phone: string;
  }[];
}

@Component({
  selector: 'app-resume-builder',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen bg-gray-50 py-8">
      <div class="container mx-auto px-4">
        <div class="max-w-6xl mx-auto">
          <!-- Header -->
          <div class="mb-8">
            <h1 class="text-3xl font-bold text-gray-800 mb-2">Resume Builder</h1>
            <p class="text-gray-600">Create a professional resume that gets you noticed</p>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <!-- Resume Form -->
            <div class="lg:col-span-2 space-y-6">
              <!-- Upload/Parse Resume -->
              <div class="bg-white rounded-lg shadow-sm p-6">
                <h2 class="text-xl font-semibold mb-4">Import Existing Resume</h2>
                <div class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <svg class="w-12 h-12 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                  </svg>
                  <p class="text-gray-600 mb-2">Drop your resume here or click to browse</p>
                  <p class="text-xs text-gray-500 mb-3">Supports PDF, DOC, DOCX formats</p>
                  <input
                    type="file"
                    (change)="onFileSelected($event)"
                    accept=".pdf,.doc,.docx"
                    class="hidden"
                    #fileInput
                  >
                  <button
                    (click)="fileInput.click()"
                    class="btn btn-primary"
                  >
                    Choose File
                  </button>
                  <button
                    *ngIf="!isParsing"
                    (click)="parseLinkedIn()"
                    class="btn btn-outline ml-2"
                  >
                    Import from LinkedIn
                  </button>
                  <div *ngIf="isParsing" class="mt-4">
                    <svg class="animate-spin h-8 w-8 text-primary mx-auto" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <p class="text-sm text-gray-600 mt-2">Parsing your resume...</p>
                  </div>
                </div>
              </div>

              <!-- Personal Information -->
              <div class="bg-white rounded-lg shadow-sm p-6">
                <h2 class="text-xl font-semibold mb-4">Personal Information</h2>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                    <input
                      type="text"
                      [(ngModel)]="resumeData.personalInfo.fullName"
                      class="input-field"
                      placeholder="John Doe"
                    >
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      [(ngModel)]="resumeData.personalInfo.email"
                      class="input-field"
                      placeholder="john@example.com"
                    >
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                    <input
                      type="tel"
                      [(ngModel)]="resumeData.personalInfo.phone"
                      class="input-field"
                      placeholder="+1 (555) 123-4567"
                    >
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Location</label>
                    <input
                      type="text"
                      [(ngModel)]="resumeData.personalInfo.location"
                      class="input-field"
                      placeholder="New York, NY"
                    >
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">LinkedIn</label>
                    <input
                      type="url"
                      [(ngModel)]="resumeData.personalInfo.linkedIn"
                      class="input-field"
                      placeholder="https://linkedin.com/in/johndoe"
                    >
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Portfolio</label>
                    <input
                      type="url"
                      [(ngModel)]="resumeData.personalInfo.portfolio"
                      class="input-field"
                      placeholder="https://johndoe.com"
                    >
                  </div>
                </div>
                <div class="mt-4">
                  <label class="block text-sm font-medium text-gray-700 mb-2">Professional Summary</label>
                  <textarea
                    [(ngModel)]="resumeData.personalInfo.summary"
                    rows="4"
                    class="input-field"
                    placeholder="Brief summary of your professional background and career objectives..."
                  ></textarea>
                  <button (click)="generateSummary()" class="mt-2 text-sm text-primary hover:text-primary-dark">
                    <svg class="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                    </svg>
                    Generate AI Summary
                  </button>
                </div>
              </div>

              <!-- Experience -->
              <div class="bg-white rounded-lg shadow-sm p-6">
                <div class="flex justify-between items-center mb-4">
                  <h2 class="text-xl font-semibold">Work Experience</h2>
                  <button (click)="addExperience()" class="btn btn-outline btn-sm">
                    <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                    </svg>
                    Add Experience
                  </button>
                </div>

                <div *ngFor="let exp of resumeData.experience; let i = index" class="border rounded-lg p-4 mb-4">
                  <div class="flex justify-between items-start mb-3">
                    <h3 class="font-medium">Experience #{{i + 1}}</h3>
                    <button (click)="removeExperience(i)" class="text-red-600 hover:text-red-700">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                      </svg>
                    </button>
                  </div>

                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label class="block text-sm text-gray-600 mb-1">Company</label>
                      <input
                        type="text"
                        [(ngModel)]="exp.company"
                        class="input-field"
                        placeholder="Company Name"
                      >
                    </div>
                    <div>
                      <label class="block text-sm text-gray-600 mb-1">Position</label>
                      <input
                        type="text"
                        [(ngModel)]="exp.position"
                        class="input-field"
                        placeholder="Job Title"
                      >
                    </div>
                    <div>
                      <label class="block text-sm text-gray-600 mb-1">Location</label>
                      <input
                        type="text"
                        [(ngModel)]="exp.location"
                        class="input-field"
                        placeholder="City, State"
                      >
                    </div>
                    <div>
                      <label class="block text-sm text-gray-600 mb-1">Start Date</label>
                      <input
                        type="month"
                        [(ngModel)]="exp.startDate"
                        class="input-field"
                      >
                    </div>
                    <div>
                      <label class="block text-sm text-gray-600 mb-1">End Date</label>
                      <input
                        type="month"
                        [(ngModel)]="exp.endDate"
                        [disabled]="exp.current"
                        class="input-field"
                      >
                    </div>
                    <div class="flex items-center">
                      <input
                        type="checkbox"
                        [(ngModel)]="exp.current"
                        id="current-{{i}}"
                        class="mr-2"
                      >
                      <label for="current-{{i}}" class="text-sm text-gray-600">Currently working here</label>
                    </div>
                  </div>

                  <div class="mt-4">
                    <label class="block text-sm text-gray-600 mb-1">Description</label>
                    <textarea
                      [(ngModel)]="exp.description"
                      rows="3"
                      class="input-field"
                      placeholder="Describe your responsibilities and achievements..."
                    ></textarea>
                  </div>

                  <div class="mt-4">
                    <label class="block text-sm text-gray-600 mb-1">Key Achievements</label>
                    <div *ngFor="let achievement of exp.achievements; let j = index" class="flex gap-2 mb-2">
                      <input
                        type="text"
                        [(ngModel)]="exp.achievements[j]"
                        class="input-field flex-1"
                        placeholder="Achievement or accomplishment"
                      >
                      <button (click)="removeAchievement(i, j)" class="text-red-600 hover:text-red-700">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                      </button>
                    </div>
                    <button (click)="addAchievement(i)" class="text-sm text-primary hover:text-primary-dark">
                      + Add Achievement
                    </button>
                  </div>
                </div>
              </div>

              <!-- Education -->
              <div class="bg-white rounded-lg shadow-sm p-6">
                <div class="flex justify-between items-center mb-4">
                  <h2 class="text-xl font-semibold">Education</h2>
                  <button (click)="addEducation()" class="btn btn-outline btn-sm">
                    <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                    </svg>
                    Add Education
                  </button>
                </div>

                <div *ngFor="let edu of resumeData.education; let i = index" class="border rounded-lg p-4 mb-4">
                  <div class="flex justify-between items-start mb-3">
                    <h3 class="font-medium">Education #{{i + 1}}</h3>
                    <button (click)="removeEducation(i)" class="text-red-600 hover:text-red-700">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                      </svg>
                    </button>
                  </div>

                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label class="block text-sm text-gray-600 mb-1">Institution</label>
                      <input
                        type="text"
                        [(ngModel)]="edu.institution"
                        class="input-field"
                        placeholder="University Name"
                      >
                    </div>
                    <div>
                      <label class="block text-sm text-gray-600 mb-1">Degree</label>
                      <input
                        type="text"
                        [(ngModel)]="edu.degree"
                        class="input-field"
                        placeholder="e.g., Bachelor of Science"
                      >
                    </div>
                    <div>
                      <label class="block text-sm text-gray-600 mb-1">Field of Study</label>
                      <input
                        type="text"
                        [(ngModel)]="edu.field"
                        class="input-field"
                        placeholder="e.g., Computer Science"
                      >
                    </div>
                    <div>
                      <label class="block text-sm text-gray-600 mb-1">GPA (Optional)</label>
                      <input
                        type="text"
                        [(ngModel)]="edu.gpa"
                        class="input-field"
                        placeholder="e.g., 3.8/4.0"
                      >
                    </div>
                    <div>
                      <label class="block text-sm text-gray-600 mb-1">Start Date</label>
                      <input
                        type="month"
                        [(ngModel)]="edu.startDate"
                        class="input-field"
                      >
                    </div>
                    <div>
                      <label class="block text-sm text-gray-600 mb-1">End Date</label>
                      <input
                        type="month"
                        [(ngModel)]="edu.endDate"
                        class="input-field"
                      >
                    </div>
                  </div>
                </div>
              </div>

              <!-- Skills -->
              <div class="bg-white rounded-lg shadow-sm p-6">
                <h2 class="text-xl font-semibold mb-4">Skills</h2>

                <div *ngFor="let skillGroup of resumeData.skills; let i = index" class="mb-4">
                  <div class="flex gap-2 mb-2">
                    <input
                      type="text"
                      [(ngModel)]="skillGroup.category"
                      class="input-field"
                      placeholder="Skill Category (e.g., Programming Languages)"
                    >
                    <button (click)="removeSkillCategory(i)" class="text-red-600 hover:text-red-700">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                      </svg>
                    </button>
                  </div>
                  <div class="flex flex-wrap gap-2">
                    <div
                      *ngFor="let skill of skillGroup.items; let j = index"
                      class="flex items-center bg-gray-100 rounded-full px-3 py-1"
                    >
                      <span class="text-sm">{{skill}}</span>
                      <button (click)="removeSkill(i, j)" class="ml-2 text-gray-500 hover:text-red-600">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                      </button>
                    </div>
                    <input
                      type="text"
                      (keyup.enter)="addSkill(i, $event)"
                      placeholder="Add skill..."
                      class="px-3 py-1 border rounded-full text-sm"
                    >
                  </div>
                </div>

                <button (click)="addSkillCategory()" class="text-sm text-primary hover:text-primary-dark">
                  + Add Skill Category
                </button>
              </div>

              <!-- Actions -->
              <div class="bg-white rounded-lg shadow-sm p-6">
                <div class="flex gap-4">
                  <button (click)="saveResume()" class="btn btn-primary flex-1">
                    <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V2"></path>
                    </svg>
                    Save Resume
                  </button>
                  <button (click)="exportPDF()" class="btn btn-outline flex-1">
                    <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                    </svg>
                    Export as PDF
                  </button>
                </div>
              </div>
            </div>

            <!-- Resume Preview -->
            <div class="lg:col-span-1">
              <div class="sticky top-4">
                <div class="bg-white rounded-lg shadow-sm p-6">
                  <div class="flex justify-between items-center mb-4">
                    <h3 class="font-semibold">Resume Preview</h3>
                    <select [(ngModel)]="selectedTemplate" (change)="changeTemplate()" class="text-sm border rounded px-2 py-1">
                      <option value="classic">Classic</option>
                      <option value="modern">Modern</option>
                      <option value="creative">Creative</option>
                      <option value="minimal">Minimal</option>
                    </select>
                  </div>

                  <div class="border rounded-lg p-4 bg-gray-50 min-h-[600px]">
                    <!-- Resume Preview Content -->
                    <div [ngClass]="getTemplateClass()">
                      <!-- Personal Info -->
                      <div class="text-center mb-4">
                        <h1 class="text-2xl font-bold">{{resumeData.personalInfo.fullName || 'Your Name'}}</h1>
                        <p class="text-sm text-gray-600">
                          {{resumeData.personalInfo.email}}
                          <span *ngIf="resumeData.personalInfo.phone"> | {{resumeData.personalInfo.phone}}</span>
                        </p>
                        <p class="text-sm text-gray-600">{{resumeData.personalInfo.location}}</p>
                      </div>

                      <!-- Summary -->
                      <div *ngIf="resumeData.personalInfo.summary" class="mb-4">
                        <h2 class="text-lg font-semibold border-b mb-2">Summary</h2>
                        <p class="text-sm">{{resumeData.personalInfo.summary}}</p>
                      </div>

                      <!-- Experience -->
                      <div *ngIf="resumeData.experience.length > 0" class="mb-4">
                        <h2 class="text-lg font-semibold border-b mb-2">Experience</h2>
                        <div *ngFor="let exp of resumeData.experience" class="mb-3">
                          <div class="flex justify-between">
                            <h3 class="font-medium text-sm">{{exp.position}}</h3>
                            <span class="text-xs text-gray-600">
                              {{exp.startDate}} - {{exp.current ? 'Present' : exp.endDate}}
                            </span>
                          </div>
                          <p class="text-sm text-gray-600">{{exp.company}}, {{exp.location}}</p>
                          <p class="text-xs mt-1">{{exp.description}}</p>
                        </div>
                      </div>

                      <!-- Education -->
                      <div *ngIf="resumeData.education.length > 0" class="mb-4">
                        <h2 class="text-lg font-semibold border-b mb-2">Education</h2>
                        <div *ngFor="let edu of resumeData.education" class="mb-2">
                          <h3 class="font-medium text-sm">{{edu.degree}} in {{edu.field}}</h3>
                          <p class="text-sm text-gray-600">{{edu.institution}}</p>
                          <p class="text-xs text-gray-600">{{edu.startDate}} - {{edu.endDate}}</p>
                        </div>
                      </div>

                      <!-- Skills -->
                      <div *ngIf="resumeData.skills.length > 0" class="mb-4">
                        <h2 class="text-lg font-semibold border-b mb-2">Skills</h2>
                        <div *ngFor="let skillGroup of resumeData.skills" class="mb-2">
                          <p class="text-sm">
                            <span class="font-medium">{{skillGroup.category}}:</span>
                            {{skillGroup.items.join(', ')}}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div class="mt-4 text-center">
                    <p class="text-xs text-gray-500 mb-2">ATS Score</p>
                    <div class="relative w-24 h-24 mx-auto">
                      <svg class="w-24 h-24 transform -rotate-90">
                        <circle
                          cx="48"
                          cy="48"
                          r="36"
                          stroke="currentColor"
                          stroke-width="8"
                          fill="none"
                          class="text-gray-200"
                        />
                        <circle
                          cx="48"
                          cy="48"
                          r="36"
                          stroke="currentColor"
                          stroke-width="8"
                          fill="none"
                          [style.strokeDasharray]="'226.195'"
                          [style.strokeDashoffset]="226.195 - (226.195 * atsScore / 100)"
                          class="text-green-500"
                        />
                      </svg>
                      <div class="absolute inset-0 flex items-center justify-center">
                        <span class="text-2xl font-bold">{{atsScore}}%</span>
                      </div>
                    </div>
                    <button (click)="improveATS()" class="mt-2 text-sm text-primary hover:text-primary-dark">
                      Improve Score
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .template-classic {
      font-family: 'Times New Roman', serif;
    }

    .template-modern {
      font-family: 'Arial', sans-serif;
    }

    .template-creative {
      font-family: 'Helvetica', sans-serif;
      color: #333;
    }

    .template-minimal {
      font-family: 'Calibri', sans-serif;
      color: #444;
    }
  `]
})
export class ResumeBuilderComponent implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef;

  resumeData: ResumeData = {
    personalInfo: {
      fullName: '',
      email: '',
      phone: '',
      location: '',
      linkedIn: '',
      portfolio: '',
      summary: ''
    },
    experience: [],
    education: [],
    skills: [],
    certifications: [],
    languages: [],
    projects: [],
    references: []
  };

  selectedTemplate = 'classic';
  isParsing = false;
  atsScore = 75;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    // Load saved resume data if exists
    const saved = localStorage.getItem('resumeData');
    if (saved) {
      this.resumeData = JSON.parse(saved);
    }

    // Pre-fill with user data
    const user = this.authService.getCurrentUser();
    if (user) {
      this.resumeData.personalInfo.fullName = user.name;
      this.resumeData.personalInfo.email = user.email;
      this.resumeData.personalInfo.phone = user.phone || '';
      this.resumeData.personalInfo.location = user.location || '';
    }
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.parseResume(input.files[0]);
    }
  }

  parseResume(file: File) {
    this.isParsing = true;

    // Simulate resume parsing
    setTimeout(() => {
      // Mock parsed data
      this.resumeData = {
        personalInfo: {
          fullName: 'John Doe',
          email: 'john.doe@email.com',
          phone: '+1 (555) 123-4567',
          location: 'New York, NY',
          linkedIn: 'https://linkedin.com/in/johndoe',
          portfolio: 'https://johndoe.dev',
          summary: 'Experienced software developer with 5+ years of experience in building scalable web applications...'
        },
        experience: [
          {
            id: '1',
            company: 'TechCorp',
            position: 'Senior Software Developer',
            location: 'New York, NY',
            startDate: '2020-01',
            endDate: '',
            current: true,
            description: 'Leading development of cloud-based solutions...',
            achievements: [
              'Increased application performance by 40%',
              'Led team of 5 developers'
            ]
          }
        ],
        education: [
          {
            id: '1',
            institution: 'University of Technology',
            degree: 'Bachelor of Science',
            field: 'Computer Science',
            startDate: '2014-09',
            endDate: '2018-05',
            gpa: '3.8/4.0',
            honors: 'Magna Cum Laude'
          }
        ],
        skills: [
          {
            category: 'Programming Languages',
            items: ['JavaScript', 'TypeScript', 'Python', 'Java']
          },
          {
            category: 'Frameworks',
            items: ['Angular', 'React', 'Node.js', 'Spring Boot']
          }
        ],
        certifications: [],
        languages: [
          { language: 'English', proficiency: 'Native' },
          { language: 'Spanish', proficiency: 'Professional' }
        ],
        projects: [],
        references: []
      };

      this.isParsing = false;
      this.calculateATSScore();
    }, 2000);
  }

  parseLinkedIn() {
    // Simulate LinkedIn import
    alert('LinkedIn import would open OAuth flow in real implementation');
  }

  generateSummary() {
    // Simulate AI summary generation
    if (this.resumeData.experience.length > 0) {
      const exp = this.resumeData.experience[0];
      this.resumeData.personalInfo.summary = `Experienced ${exp.position} with proven track record in ${exp.company}. Skilled in modern technologies and passionate about delivering high-quality solutions.`;
    }
  }

  addExperience() {
    this.resumeData.experience.push({
      id: Date.now().toString(),
      company: '',
      position: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      description: '',
      achievements: []
    });
  }

  removeExperience(index: number) {
    this.resumeData.experience.splice(index, 1);
  }

  addAchievement(expIndex: number) {
    this.resumeData.experience[expIndex].achievements.push('');
  }

  removeAchievement(expIndex: number, achievementIndex: number) {
    this.resumeData.experience[expIndex].achievements.splice(achievementIndex, 1);
  }

  addEducation() {
    this.resumeData.education.push({
      id: Date.now().toString(),
      institution: '',
      degree: '',
      field: '',
      startDate: '',
      endDate: '',
      gpa: '',
      honors: ''
    });
  }

  removeEducation(index: number) {
    this.resumeData.education.splice(index, 1);
  }

  addSkillCategory() {
    this.resumeData.skills.push({
      category: '',
      items: []
    });
  }

  removeSkillCategory(index: number) {
    this.resumeData.skills.splice(index, 1);
  }

  addSkill(categoryIndex: number, event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.value.trim()) {
      this.resumeData.skills[categoryIndex].items.push(input.value.trim());
      input.value = '';
    }
  }

  removeSkill(categoryIndex: number, skillIndex: number) {
    this.resumeData.skills[categoryIndex].items.splice(skillIndex, 1);
  }

  changeTemplate() {
    // Template change logic
    console.log('Template changed to:', this.selectedTemplate);
  }

  getTemplateClass(): string {
    return `template-${this.selectedTemplate}`;
  }

  calculateATSScore() {
    let score = 0;

    // Check for essential sections
    if (this.resumeData.personalInfo.fullName) score += 10;
    if (this.resumeData.personalInfo.email) score += 10;
    if (this.resumeData.personalInfo.phone) score += 5;
    if (this.resumeData.personalInfo.summary) score += 15;
    if (this.resumeData.experience.length > 0) score += 20;
    if (this.resumeData.education.length > 0) score += 15;
    if (this.resumeData.skills.length > 0) score += 15;

    // Check for keywords and formatting
    if (this.resumeData.experience.some(exp => exp.achievements.length > 0)) score += 10;

    this.atsScore = Math.min(score, 100);
  }

  improveATS() {
    alert('ATS improvement suggestions:\n\n' +
          '1. Add more relevant keywords from job descriptions\n' +
          '2. Use standard section headings\n' +
          '3. Include quantifiable achievements\n' +
          '4. Avoid graphics and complex formatting\n' +
          '5. Use standard fonts and bullet points');
  }

  saveResume() {
    localStorage.setItem('resumeData', JSON.stringify(this.resumeData));
    alert('Resume saved successfully!');
  }

  exportPDF() {
    // In real implementation, would use a library like jsPDF
    alert('PDF export would be implemented with jsPDF or similar library');
    console.log('Exporting resume:', this.resumeData);
  }
}
