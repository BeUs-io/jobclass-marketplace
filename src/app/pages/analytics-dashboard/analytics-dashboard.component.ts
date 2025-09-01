import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  JobseekerAnalyticsService,
  ApplicationAnalytics,
  ProfileStrength,
  CompetitorAnalysis
} from '../../services/jobseeker-analytics.service';

@Component({
  selector: 'app-analytics-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen bg-gray-50 py-8">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Header -->
        <div class="mb-8">
          <h1 class="text-3xl font-bold text-gray-900">Application Analytics Dashboard</h1>
          <p class="mt-2 text-gray-600">Track your job search performance and get insights to improve your success rate</p>
        </div>

        <!-- Key Metrics -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div class="bg-white rounded-lg shadow p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-500">Total Applications</p>
                <p class="text-3xl font-bold text-gray-900">{{ analytics()?.totalApplications | number }}</p>
                <p class="text-sm text-gray-600 mt-1">Last 30 days</p>
              </div>
              <div class="p-3 bg-blue-100 rounded-full">
                <svg class="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-lg shadow p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-500">Success Rate</p>
                <p class="text-3xl font-bold"
                   [class.text-green-600]="(analytics()?.successRate || 0) >= 15"
                   [class.text-yellow-600]="(analytics()?.successRate || 0) >= 10 && (analytics()?.successRate || 0) < 15"
                   [class.text-red-600]="(analytics()?.successRate || 0) < 10">
                  {{ analytics()?.successRate | number:'1.1-1' }}%
                </p>
                <div class="flex items-center mt-1">
                  <span class="text-sm"
                        [class.text-green-600]="(analytics()?.successRate || 0) >= 15"
                        [class.text-red-600]="(analytics()?.successRate || 0) < 10">
                    <span *ngIf="(analytics()?.successRate || 0) >= 15">↑ Above average</span>
                    <span *ngIf="(analytics()?.successRate || 0) < 10">↓ Below average</span>
                    <span *ngIf="(analytics()?.successRate || 0) >= 10 && (analytics()?.successRate || 0) < 15">Average</span>
                  </span>
                </div>
              </div>
              <div class="p-3 bg-green-100 rounded-full">
                <svg class="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-lg shadow p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-500">Interview Rate</p>
                <p class="text-3xl font-bold text-purple-600">{{ analytics()?.interviewConversionRate | number:'1.1-1' }}%</p>
                <p class="text-sm text-gray-600 mt-1">{{ getInterviewCount() }} interviews</p>
              </div>
              <div class="p-3 bg-purple-100 rounded-full">
                <svg class="h-6 w-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-lg shadow p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-500">Avg Response Time</p>
                <p class="text-3xl font-bold text-gray-900">{{ analytics()?.averageResponseTime | number:'1.0-0' }}</p>
                <p class="text-sm text-gray-600 mt-1">days</p>
              </div>
              <div class="p-3 bg-yellow-100 rounded-full">
                <svg class="h-6 w-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
            </div>
          </div>
        </div>

        <!-- Profile Strength & Competitor Analysis -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <!-- Profile Strength -->
          <div class="bg-white rounded-lg shadow p-6">
            <h2 class="text-lg font-semibold text-gray-900 mb-4">Profile Strength</h2>

            <!-- Overall Score -->
            <div class="mb-6">
              <div class="flex justify-between items-center mb-2">
                <span class="text-sm font-medium text-gray-700">Overall Completeness</span>
                <span class="text-sm font-bold"
                      [class.text-green-600]="(profileStrength()?.overall || 0) >= 80"
                      [class.text-yellow-600]="(profileStrength()?.overall || 0) >= 60 && (profileStrength()?.overall || 0) < 80"
                      [class.text-red-600]="(profileStrength()?.overall || 0) < 60">
                  {{ profileStrength()?.overall }}%
                </span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-3">
                <div class="h-3 rounded-full transition-all duration-500"
                     [class.bg-green-500]="(profileStrength()?.overall || 0) >= 80"
                     [class.bg-yellow-500]="(profileStrength()?.overall || 0) >= 60 && (profileStrength()?.overall || 0) < 80"
                     [class.bg-red-500]="(profileStrength()?.overall || 0) < 60"
                     [style.width.%]="profileStrength()?.overall">
                </div>
              </div>
            </div>

            <!-- Section Scores -->
            <div class="space-y-3">
              <div *ngFor="let section of getProfileSections()" class="flex justify-between items-center">
                <span class="text-sm text-gray-600">{{ section.name }}</span>
                <div class="flex items-center">
                  <div class="w-24 bg-gray-200 rounded-full h-2 mr-3">
                    <div class="h-2 rounded-full"
                         [class.bg-green-400]="section.score >= 80"
                         [class.bg-yellow-400]="section.score >= 60 && section.score < 80"
                         [class.bg-red-400]="section.score < 60"
                         [style.width.%]="section.score">
                    </div>
                  </div>
                  <span class="text-xs font-medium text-gray-700 w-10 text-right">{{ section.score }}%</span>
                </div>
              </div>
            </div>

            <!-- Missing Elements -->
            <div *ngIf="profileStrength()?.missingElements && profileStrength()!.missingElements.length > 0"
                 class="mt-4 p-3 bg-yellow-50 rounded-lg">
              <p class="text-sm font-medium text-yellow-900 mb-2">Complete these to improve your profile:</p>
              <ul class="text-sm text-yellow-700 space-y-1">
                <li *ngFor="let element of profileStrength()?.missingElements" class="flex items-start">
                  <span class="text-yellow-500 mr-2">•</span>
                  {{ element }}
                </li>
              </ul>
            </div>
          </div>

          <!-- Competitor Analysis -->
          <div class="bg-white rounded-lg shadow p-6">
            <h2 class="text-lg font-semibold text-gray-900 mb-4">How You Compare</h2>

            <!-- Ranking -->
            <div class="mb-6 text-center">
              <div class="text-4xl font-bold"
                   [class.text-green-600]="(competitorAnalysis()?.yourRanking || 0) >= 75"
                   [class.text-yellow-600]="(competitorAnalysis()?.yourRanking || 0) >= 50 && (competitorAnalysis()?.yourRanking || 0) < 75"
                   [class.text-red-600]="(competitorAnalysis()?.yourRanking || 0) < 50">
                Top {{ 100 - (competitorAnalysis()?.yourRanking || 0) }}%
              </div>
              <p class="text-sm text-gray-600 mt-1">of all candidates in your field</p>
            </div>

            <!-- Stats -->
            <div class="space-y-4">
              <div class="flex justify-between items-center p-3 bg-gray-50 rounded">
                <span class="text-sm text-gray-600">Avg applications per job</span>
                <span class="text-sm font-bold text-gray-900">{{ competitorAnalysis()?.averageApplicationsPerJob | number }}</span>
              </div>
              <div class="flex justify-between items-center p-3 bg-gray-50 rounded">
                <span class="text-sm text-gray-600">Stronger profiles ahead</span>
                <span class="text-sm font-bold text-gray-900">{{ competitorAnalysis()?.strongerProfiles }}%</span>
              </div>
            </div>

            <!-- Suggestions -->
            <div class="mt-4 p-3 bg-blue-50 rounded-lg">
              <p class="text-sm font-medium text-blue-900 mb-2">Stand out from competition:</p>
              <ul class="text-sm text-blue-700 space-y-1">
                <li *ngFor="let suggestion of competitorAnalysis()?.suggestions?.slice(0, 3)" class="flex items-start">
                  <span class="text-blue-500 mr-2">→</span>
                  {{ suggestion }}
                </li>
              </ul>
            </div>
          </div>
        </div>

        <!-- Application Status Distribution -->
        <div class="bg-white rounded-lg shadow p-6 mb-8">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">Application Pipeline</h2>

          <div class="grid grid-cols-2 md:grid-cols-6 gap-4">
            <div class="text-center">
              <div class="text-2xl font-bold text-gray-700">{{ analytics()?.applicationsByStatus?.submitted | number }}</div>
              <div class="text-sm text-gray-500">Submitted</div>
              <div class="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div class="h-full bg-gray-500"
                     [style.width.%]="getStatusPercentage('submitted')"></div>
              </div>
            </div>
            <div class="text-center">
              <div class="text-2xl font-bold text-blue-600">{{ analytics()?.applicationsByStatus?.underReview | number }}</div>
              <div class="text-sm text-gray-500">Under Review</div>
              <div class="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div class="h-full bg-blue-500"
                     [style.width.%]="getStatusPercentage('underReview')"></div>
              </div>
            </div>
            <div class="text-center">
              <div class="text-2xl font-bold text-purple-600">{{ analytics()?.applicationsByStatus?.interview | number }}</div>
              <div class="text-sm text-gray-500">Interview</div>
              <div class="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div class="h-full bg-purple-500"
                     [style.width.%]="getStatusPercentage('interview')"></div>
              </div>
            </div>
            <div class="text-center">
              <div class="text-2xl font-bold text-green-600">{{ analytics()?.applicationsByStatus?.offer | number }}</div>
              <div class="text-sm text-gray-500">Offers</div>
              <div class="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div class="h-full bg-green-500"
                     [style.width.%]="getStatusPercentage('offer')"></div>
              </div>
            </div>
            <div class="text-center">
              <div class="text-2xl font-bold text-red-600">{{ analytics()?.applicationsByStatus?.rejected | number }}</div>
              <div class="text-sm text-gray-500">Rejected</div>
              <div class="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div class="h-full bg-red-500"
                     [style.width.%]="getStatusPercentage('rejected')"></div>
              </div>
            </div>
            <div class="text-center">
              <div class="text-2xl font-bold text-gray-500">{{ analytics()?.applicationsByStatus?.withdrawn | number }}</div>
              <div class="text-sm text-gray-500">Withdrawn</div>
              <div class="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div class="h-full bg-gray-400"
                     [style.width.%]="getStatusPercentage('withdrawn')"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Monthly Trends & Category Performance -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <!-- Monthly Trends -->
          <div class="bg-white rounded-lg shadow p-6">
            <h2 class="text-lg font-semibold text-gray-900 mb-4">Monthly Trends</h2>

            <div class="space-y-4">
              <div *ngFor="let month of analytics()?.applicationsByMonth"
                   class="border-b pb-3 last:border-0">
                <div class="flex justify-between items-center mb-2">
                  <span class="text-sm font-medium text-gray-700">{{ month.month }} {{ month.year }}</span>
                  <span class="text-xs px-2 py-1 rounded-full"
                        [class.bg-green-100]="month.successRate >= 10"
                        [class.text-green-800]="month.successRate >= 10"
                        [class.bg-red-100]="month.successRate < 10"
                        [class.text-red-800]="month.successRate < 10">
                    {{ month.successRate | number:'1.1-1' }}% success
                  </span>
                </div>
                <div class="grid grid-cols-3 gap-2 text-sm">
                  <div class="flex items-center">
                    <span class="text-gray-500 mr-2">Apps:</span>
                    <span class="font-medium">{{ month.applications }}</span>
                  </div>
                  <div class="flex items-center">
                    <span class="text-gray-500 mr-2">Interviews:</span>
                    <span class="font-medium text-purple-600">{{ month.interviews }}</span>
                  </div>
                  <div class="flex items-center">
                    <span class="text-gray-500 mr-2">Offers:</span>
                    <span class="font-medium text-green-600">{{ month.offers }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Trend Analysis -->
            <div class="mt-4 p-3 bg-gray-50 rounded-lg">
              <p class="text-sm text-gray-600">
                <span *ngIf="getTrendDirection() === 'up'" class="text-green-600">↑ Your success rate is improving</span>
                <span *ngIf="getTrendDirection() === 'down'" class="text-red-600">↓ Your success rate is declining</span>
                <span *ngIf="getTrendDirection() === 'stable'" class="text-gray-600">→ Your success rate is stable</span>
              </p>
            </div>
          </div>

          <!-- Top Performing Categories -->
          <div class="bg-white rounded-lg shadow p-6">
            <h2 class="text-lg font-semibold text-gray-900 mb-4">Performance by Category</h2>

            <div class="space-y-4">
              <div *ngFor="let category of analytics()?.topPerformingCategories; let i = index"
                   class="relative">
                <div class="flex justify-between items-center mb-2">
                  <span class="text-sm font-medium text-gray-700">{{ category.category }}</span>
                  <div class="flex items-center space-x-2">
                    <span class="text-xs text-gray-500">{{ category.applications }} apps</span>
                    <span class="text-xs px-2 py-1 rounded"
                          [class.bg-green-100]="category.successRate >= 10"
                          [class.text-green-700]="category.successRate >= 10"
                          [class.bg-yellow-100]="category.successRate >= 5 && category.successRate < 10"
                          [class.text-yellow-700]="category.successRate >= 5 && category.successRate < 10"
                          [class.bg-red-100]="category.successRate < 5"
                          [class.text-red-700]="category.successRate < 5">
                      {{ category.successRate | number:'1.1-1' }}%
                    </span>
                  </div>
                </div>
                <div class="grid grid-cols-2 gap-2 text-xs text-gray-500">
                  <div>Interviews: {{ category.interviews }}</div>
                  <div>Offers: {{ category.offers }}</div>
                </div>
                <div class="mt-2 w-full bg-gray-200 rounded-full h-2">
                  <div class="h-2 rounded-full"
                       [class.bg-green-500]="i === 0"
                       [class.bg-blue-500]="i === 1"
                       [class.bg-purple-500]="i === 2"
                       [style.width.%]="(category.successRate / 20) * 100">
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Skills Analysis -->
        <div class="bg-white rounded-lg shadow p-6 mb-8">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">Skills Impact Analysis</h2>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div *ngFor="let skill of analytics()?.skillsAnalysis"
                 class="border rounded-lg p-4"
                 [class.border-green-200]="skill.demandLevel === 'high' && skill.successRate >= 15"
                 [class.bg-green-50]="skill.demandLevel === 'high' && skill.successRate >= 15"
                 [class.border-yellow-200]="skill.recommendedForImprovement"
                 [class.bg-yellow-50]="skill.recommendedForImprovement">
              <div class="flex justify-between items-start mb-2">
                <h3 class="font-medium text-gray-900">{{ skill.skill }}</h3>
                <span class="text-xs px-2 py-1 rounded"
                      [class.bg-red-100]="skill.demandLevel === 'high'"
                      [class.text-red-700]="skill.demandLevel === 'high'"
                      [class.bg-yellow-100]="skill.demandLevel === 'medium'"
                      [class.text-yellow-700]="skill.demandLevel === 'medium'"
                      [class.bg-gray-100]="skill.demandLevel === 'low'"
                      [class.text-gray-700]="skill.demandLevel === 'low'">
                  {{ skill.demandLevel }} demand
                </span>
              </div>
              <div class="space-y-1 text-xs text-gray-600">
                <div>{{ skill.matchedJobs }} matching jobs</div>
                <div>Success rate: {{ skill.successRate | number:'1.1-1' }}%</div>
              </div>
              <div *ngIf="skill.recommendedForImprovement"
                   class="mt-2 text-xs text-yellow-700 font-medium">
                ⚠ Improve this skill
              </div>
            </div>
          </div>
        </div>

        <!-- Salary Analysis -->
        <div class="bg-white rounded-lg shadow p-6 mb-8">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-lg font-semibold text-gray-900">Salary Insights</h2>
            <span class="text-sm px-3 py-1 rounded-full"
                  [class.bg-green-100]="analytics()?.salaryAnalysis?.salaryTrend === 'increasing'"
                  [class.text-green-700]="analytics()?.salaryAnalysis?.salaryTrend === 'increasing'"
                  [class.bg-gray-100]="analytics()?.salaryAnalysis?.salaryTrend === 'stable'"
                  [class.text-gray-700]="analytics()?.salaryAnalysis?.salaryTrend === 'stable'"
                  [class.bg-red-100]="analytics()?.salaryAnalysis?.salaryTrend === 'decreasing'"
                  [class.text-red-700]="analytics()?.salaryAnalysis?.salaryTrend === 'decreasing'">
              <span *ngIf="analytics()?.salaryAnalysis?.salaryTrend === 'increasing'">↑ Trending Up</span>
              <span *ngIf="analytics()?.salaryAnalysis?.salaryTrend === 'stable'">→ Stable</span>
              <span *ngIf="analytics()?.salaryAnalysis?.salaryTrend === 'decreasing'">↓ Trending Down</span>
            </span>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="text-center">
              <p class="text-sm text-gray-500 mb-1">Your Expected</p>
              <p class="text-2xl font-bold text-gray-900">{{ analytics()?.salaryAnalysis?.averageExpected | currency:'USD':'symbol':'1.0-0' }}</p>
            </div>
            <div class="text-center">
              <p class="text-sm text-gray-500 mb-1">Market Average</p>
              <p class="text-2xl font-bold text-blue-600">{{ analytics()?.salaryAnalysis?.marketAverage | currency:'USD':'symbol':'1.0-0' }}</p>
            </div>
            <div class="text-center">
              <p class="text-sm text-gray-500 mb-1">Avg Offered</p>
              <p class="text-2xl font-bold text-green-600">{{ analytics()?.salaryAnalysis?.averageOffered | currency:'USD':'symbol':'1.0-0' }}</p>
            </div>
          </div>

          <!-- Salary Comparison Alert -->
          <div *ngIf="getSalaryGap() !== 0" class="mt-4 p-3 rounded-lg"
               [class.bg-yellow-50]="getSalaryGap() > 10"
               [class.bg-green-50]="getSalaryGap() <= 10 && getSalaryGap() > -10"
               [class.bg-blue-50]="getSalaryGap() <= -10">
            <p class="text-sm"
               [class.text-yellow-700]="getSalaryGap() > 10"
               [class.text-green-700]="getSalaryGap() <= 10 && getSalaryGap() > -10"
               [class.text-blue-700]="getSalaryGap() <= -10">
              <span *ngIf="getSalaryGap() > 10">⚠ Your expectations are {{ getSalaryGap() | number:'1.0-0' }}% above market average</span>
              <span *ngIf="getSalaryGap() <= 10 && getSalaryGap() > -10">✓ Your expectations align with market rates</span>
              <span *ngIf="getSalaryGap() <= -10">💡 You could potentially ask for {{ -getSalaryGap() | number:'1.0-0' }}% more</span>
            </p>
          </div>

          <!-- Negotiation Success -->
          <div class="mt-4 flex justify-between items-center p-3 bg-gray-50 rounded">
            <span class="text-sm text-gray-600">Negotiation Success Rate</span>
            <div class="flex items-center">
              <div class="w-32 bg-gray-200 rounded-full h-2 mr-3">
                <div class="h-2 rounded-full bg-green-500"
                     [style.width.%]="analytics()?.salaryAnalysis?.negotiationSuccess">
                </div>
              </div>
              <span class="text-sm font-bold text-gray-900">{{ analytics()?.salaryAnalysis?.negotiationSuccess }}%</span>
            </div>
          </div>
        </div>

        <!-- Improvement Suggestions -->
        <div class="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 mb-8">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">Personalized Recommendations</h2>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div *ngFor="let suggestion of analytics()?.improvementSuggestions"
                 class="flex items-start bg-white rounded-lg p-4">
              <div class="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                <svg class="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <p class="text-sm text-gray-700">{{ suggestion }}</p>
            </div>
          </div>
        </div>

        <!-- Export Options -->
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex justify-between items-center">
            <div>
              <h3 class="text-lg font-semibold text-gray-900">Export Your Analytics</h3>
              <p class="text-sm text-gray-600 mt-1">Download your job search analytics report</p>
            </div>
            <div class="flex space-x-3">
              <button (click)="exportReport('pdf')"
                      class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
                Export as PDF
              </button>
              <button (click)="exportReport('csv')"
                      class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
                Export as CSV
              </button>
              <button (click)="exportReport('json')"
                      class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                Export as JSON
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class AnalyticsDashboardComponent implements OnInit {
  analytics = signal<ApplicationAnalytics | undefined>(undefined);
  profileStrength = signal<ProfileStrength | undefined>(undefined);
  competitorAnalysis = signal<CompetitorAnalysis | undefined>(undefined);

  constructor(private analyticsService: JobseekerAnalyticsService) {}

  ngOnInit(): void {
    this.loadAnalytics();
  }

  loadAnalytics(): void {
    const userId = 'user1'; // In real app, get from auth service

    this.analyticsService.getUserAnalytics(userId).subscribe(data => {
      this.analytics.set(data);
    });

    this.analyticsService.getProfileStrength(userId).subscribe(data => {
      this.profileStrength.set(data);
    });

    this.analyticsService.getCompetitorAnalysis(userId).subscribe(data => {
      this.competitorAnalysis.set(data);
    });
  }

  getInterviewCount(): number {
    return this.analytics()?.applicationsByStatus?.interview || 0;
  }

  getStatusPercentage(status: string): number {
    const total = this.analytics()?.totalApplications || 1;
    const statusCounts = this.analytics()?.applicationsByStatus;

    if (!statusCounts) return 0;

    const count = statusCounts[status as keyof typeof statusCounts] || 0;
    return (count / total) * 100;
  }

  getProfileSections(): Array<{name: string, score: number}> {
    const sections = this.profileStrength()?.sections;
    if (!sections) return [];

    return [
      { name: 'Basic Information', score: sections.basicInfo },
      { name: 'Experience', score: sections.experience },
      { name: 'Education', score: sections.education },
      { name: 'Skills', score: sections.skills },
      { name: 'Portfolio', score: sections.portfolio },
      { name: 'Certifications', score: sections.certifications }
    ];
  }

  getTrendDirection(): 'up' | 'down' | 'stable' {
    const months = this.analytics()?.applicationsByMonth;
    if (!months || months.length < 2) return 'stable';

    const lastMonth = months[months.length - 1].successRate;
    const previousMonth = months[months.length - 2].successRate;

    if (lastMonth > previousMonth + 2) return 'up';
    if (lastMonth < previousMonth - 2) return 'down';
    return 'stable';
  }

  getSalaryGap(): number {
    const expected = this.analytics()?.salaryAnalysis?.averageExpected || 0;
    const market = this.analytics()?.salaryAnalysis?.marketAverage || 1;

    return ((expected - market) / market) * 100;
  }

  exportReport(format: 'pdf' | 'csv' | 'json'): void {
    this.analyticsService.exportAnalyticsReport('user1', format).subscribe(blob => {
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `job-search-analytics.${format}`;
      link.click();
      window.URL.revokeObjectURL(url);
    });
  }
}
