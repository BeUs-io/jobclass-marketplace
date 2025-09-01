import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CompanyComparisonService } from '../../services/company-comparison.service';
import { CompanyService, Company } from '../../services/company.service';

@Component({
  selector: 'app-company-comparison',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="min-h-screen bg-gray-50">
      <!-- Header -->
      <div class="bg-white shadow-sm border-b">
        <div class="container mx-auto px-4 py-6">
          <div class="flex items-center justify-between">
            <div>
              <h1 class="text-2xl font-bold text-gray-900">Company Comparison Tool</h1>
              <p class="mt-1 text-sm text-gray-600">Compare up to 4 companies side-by-side</p>
            </div>
            <div class="flex items-center space-x-4">
              <span class="text-sm text-gray-500">
                {{ comparisonService.selectedCompanies().length }}/{{ comparisonService.maxCompanies }} companies selected
              </span>
              <button *ngIf="comparisonService.hasCompanies()"
                      (click)="clearComparison()"
                      class="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100">
                Clear All
              </button>
              <button *ngIf="comparisonService.comparisonReady()"
                      (click)="exportComparison()"
                      class="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100">
                Export CSV
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="container mx-auto px-4 py-8">
        <!-- Company Selection -->
        <div class="mb-8">
          <div class="bg-white rounded-lg shadow-md p-6">
            <h2 class="text-lg font-semibold mb-4">Select Companies to Compare</h2>

            <!-- Search -->
            <div class="mb-4">
              <input type="text"
                     [(ngModel)]="searchQuery"
                     (ngModelChange)="searchCompanies($event)"
                     placeholder="Search for companies..."
                     class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
            </div>

            <!-- Selected Companies -->
            <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div *ngFor="let company of comparisonService.selectedCompanies()"
                   class="relative bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
                <button (click)="removeCompany(company.id)"
                        class="absolute top-2 right-2 text-gray-400 hover:text-red-600">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
                <div class="flex items-center space-x-3">
                  <div class="w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold"
                       [style.background-color]="getCompanyColor(company.id)">
                    {{ company.logo }}
                  </div>
                  <div>
                    <h3 class="font-semibold text-gray-900">{{ company.name }}</h3>
                    <p class="text-xs text-gray-600">{{ company.industry }}</p>
                  </div>
                </div>
              </div>

              <!-- Add More Slots -->
              <div *ngFor="let slot of getEmptySlots()"
                   class="border-2 border-dashed border-gray-300 rounded-lg p-4 flex items-center justify-center">
                <span class="text-gray-400 text-sm">Select a company</span>
              </div>
            </div>

            <!-- Available Companies -->
            <div *ngIf="searchResults.length > 0" class="border-t pt-4">
              <h3 class="text-sm font-medium text-gray-700 mb-3">Available Companies</h3>
              <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
                <button *ngFor="let company of searchResults"
                        (click)="addCompany(company)"
                        [disabled]="comparisonService.isSelected(company.id) || !comparisonService.canAddMore()"
                        [class.opacity-50]="comparisonService.isSelected(company.id) || !comparisonService.canAddMore()"
                        [class.cursor-not-allowed]="comparisonService.isSelected(company.id) || !comparisonService.canAddMore()"
                        class="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-left">
                  <div class="w-10 h-10 rounded flex items-center justify-center text-white font-bold text-sm"
                       [style.background-color]="getCompanyColor(company.id)">
                    {{ company.logo }}
                  </div>
                  <div class="flex-1 min-w-0">
                    <p class="text-sm font-medium text-gray-900 truncate">{{ company.name }}</p>
                    <p class="text-xs text-gray-500">{{ company.size }} employees</p>
                  </div>
                  <span *ngIf="comparisonService.isSelected(company.id)"
                        class="text-green-600">
                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                    </svg>
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Comparison Table -->
        <div *ngIf="comparisonService.comparisonReady()" class="space-y-6">
          <!-- Insights -->
          <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 class="text-sm font-semibold text-blue-900 mb-2">Key Insights</h3>
            <ul class="space-y-1">
              <li *ngFor="let insight of insights" class="text-sm text-blue-800 flex items-start">
                <svg class="w-4 h-4 mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/>
                </svg>
                {{ insight }}
              </li>
            </ul>
          </div>

          <!-- Comparison Categories -->
          <div *ngFor="let category of comparisonService.comparisonMetrics"
               class="bg-white rounded-lg shadow-md overflow-hidden">
            <div class="bg-gray-50 px-6 py-3 border-b">
              <h3 class="text-lg font-semibold text-gray-900">{{ category.category }}</h3>
            </div>

            <div class="overflow-x-auto">
              <table class="w-full">
                <thead>
                  <tr class="border-b">
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-48">
                      Metric
                    </th>
                    <th *ngFor="let company of comparisonService.selectedCompanies()"
                        class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <div class="flex flex-col items-center">
                        <div class="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-sm mb-2"
                             [style.background-color]="getCompanyColor(company.id)">
                          {{ company.logo }}
                        </div>
                        {{ company.name }}
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let metric of category.metrics; let i = index"
                      [class.bg-gray-50]="i % 2 === 0">
                    <td class="px-6 py-4 text-sm font-medium text-gray-900">
                      {{ metric.name }}
                    </td>
                    <td *ngFor="let company of comparisonService.selectedCompanies()"
                        class="px-6 py-4 text-sm text-center">
                      <div [class.font-semibold]="isbestValue(metric, company)"
                           [class.text-green-600]="isbestValue(metric, company)">
                        <ng-container [ngSwitch]="metric.format">
                          <!-- Rating -->
                          <div *ngSwitchCase="'rating'" class="flex flex-col items-center">
                            <div class="flex text-yellow-400 mb-1">
                              <svg *ngFor="let star of [1,2,3,4,5]"
                                   [class.text-gray-300]="star > getMetricValue(company, metric.key)"
                                   class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                              </svg>
                            </div>
                            <span class="text-xs text-gray-600">{{ getMetricValue(company, metric.key) }}/5</span>
                          </div>

                          <!-- List -->
                          <div *ngSwitchCase="'list'" class="text-left">
                            <div class="max-h-20 overflow-y-auto">
                              <span *ngFor="let item of getMetricValue(company, metric.key); let last = last"
                                    class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800 m-0.5">
                                {{ item }}
                              </span>
                              <span *ngIf="!getMetricValue(company, metric.key) || getMetricValue(company, metric.key).length === 0"
                                    class="text-gray-400">N/A</span>
                            </div>
                          </div>

                          <!-- Boolean -->
                          <div *ngSwitchCase="'boolean'">
                            <span *ngIf="getMetricValue(company, metric.key)"
                                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                              </svg>
                              Yes
                            </span>
                            <span *ngIf="!getMetricValue(company, metric.key)"
                                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                              No
                            </span>
                          </div>

                          <!-- Number -->
                          <span *ngSwitchCase="'number'">
                            {{ getMetricValue(company, metric.key) | number }}
                          </span>

                          <!-- Default -->
                          <span *ngSwitchDefault>
                            {{ getMetricValue(company, metric.key) || 'N/A' }}
                          </span>
                        </ng-container>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Quick Actions -->
          <div class="bg-white rounded-lg shadow-md p-6">
            <h3 class="text-lg font-semibold mb-4">Quick Actions</h3>
            <div class="grid grid-cols-1 md:grid-cols-{{ comparisonService.selectedCompanies().length }} gap-4">
              <div *ngFor="let company of comparisonService.selectedCompanies()"
                   class="text-center">
                <h4 class="font-medium text-gray-900 mb-3">{{ company.name }}</h4>
                <div class="space-y-2">
                  <a [routerLink]="['/company', company.id]"
                     class="block w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    View Full Profile
                  </a>
                  <button class="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">
                    View Open Positions ({{ company.openPositions }})
                  </button>
                  <button class="w-full px-4 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100">
                    Follow Company
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div *ngIf="!comparisonService.comparisonReady() && comparisonService.selectedCompanies().length > 0"
             class="bg-yellow-50 border border-yellow-200 rounded-lg p-8 text-center">
          <svg class="mx-auto h-12 w-12 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
          </svg>
          <h3 class="mt-2 text-lg font-medium text-yellow-900">Select More Companies</h3>
          <p class="mt-1 text-sm text-yellow-700">You need at least 2 companies to start comparing.</p>
        </div>

        <!-- Initial Empty State -->
        <div *ngIf="comparisonService.selectedCompanies().length === 0"
             class="bg-white rounded-lg shadow-md p-12 text-center">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
          </svg>
          <h3 class="mt-2 text-lg font-medium text-gray-900">No Companies Selected</h3>
          <p class="mt-1 text-sm text-gray-500">Search and select companies above to start comparing.</p>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class CompanyComparisonComponent implements OnInit {
  searchQuery = '';
  searchResults: Company[] = [];
  insights: string[] = [];

  constructor(
    public comparisonService: CompanyComparisonService,
    private companyService: CompanyService
  ) {}

  ngOnInit(): void {
    this.loadInitialCompanies();
    this.updateInsights();
  }

  loadInitialCompanies(): void {
    this.companyService.getCompanies().subscribe(companies => {
      this.searchResults = companies.slice(0, 8);
    });
  }

  searchCompanies(query: string): void {
    if (!query) {
      this.loadInitialCompanies();
      return;
    }
    this.companyService.searchCompanies(query).subscribe(results => {
      this.searchResults = results;
    });
  }

  addCompany(company: Company): void {
    if (this.comparisonService.addCompany(company)) {
      this.updateInsights();
    }
  }

  removeCompany(companyId: string): void {
    this.comparisonService.removeCompany(companyId);
    this.updateInsights();
  }

  clearComparison(): void {
    this.comparisonService.clearComparison();
    this.insights = [];
  }

  updateInsights(): void {
    this.insights = this.comparisonService.generateInsights(
      this.comparisonService.selectedCompanies()
    );
  }

  getEmptySlots(): number[] {
    const selected = this.comparisonService.selectedCompanies().length;
    const empty = this.comparisonService.maxCompanies - selected;
    return Array(empty).fill(0);
  }

  getMetricValue(company: Company, key: string): any {
    return (company as any)[key];
  }

  isbestValue(metric: any, company: Company): boolean {
    if (!metric.higher_better) return false;
    const bestValue = this.comparisonService.getBestValue(
      metric.key,
      this.comparisonService.selectedCompanies()
    );
    const currentValue = this.getMetricValue(company, metric.key);
    return bestValue === currentValue;
  }

  exportComparison(): void {
    const csv = this.comparisonService.exportComparison(
      this.comparisonService.selectedCompanies()
    );
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'company-comparison.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  }

  getCompanyColor(companyId: string): string {
    const colors = [
      '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6',
      '#EC4899', '#06B6D4', '#F97316', '#6366F1', '#84CC16'
    ];
    const index = parseInt(companyId) % colors.length;
    return colors[index];
  }
}
