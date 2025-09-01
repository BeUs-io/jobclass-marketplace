import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { JobService, JobFilters } from '../../services/job.service';
import { AuthService } from '../../services/auth.service';
import { Job, JobType, Category, Location } from '../../models/job.model';
import { CurrencyService } from '../../services/currency.service';
import { TranslationService } from '../../services/translation.service';
import { Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';

// ... existing code ... <rest of the component>

                    <!-- Job salary/rate -->
                    <div class="flex items-center justify-between mb-4">
                      <span *ngIf="job.salary" class="text-lg font-semibold text-gray-900">
                        {{ formatSalary(job.salary) }}
                      </span>
                      <span *ngIf="job.rate" class="text-lg font-semibold text-gray-900">
                        {{ formatRate(job.rate) }}
                      </span>
                    </div>

// ... existing code ... <rest of the template>

export class JobsComponent implements OnInit {
  // ... existing code ... <existing properties>

  constructor(
    private jobService: JobService,
    private authService: AuthService,
    private currencyService: CurrencyService,
    private translationService: TranslationService
  ) {}

  // ... existing code ... <existing methods>

  formatSalary(salary: { min: number; max: number; currency: string; period: string }): string {
    const min = this.currencyService.formatPrice(salary.min);
    const max = this.currencyService.formatPrice(salary.max);
    return `${min} - ${max} / ${this.t('jobCard.' + salary.period)}`;
  }

  formatRate(rate: { amount: number; currency: string; period: string }): string {
    const amount = this.currencyService.formatPrice(rate.amount);
    return `${amount} / ${this.t('jobCard.' + rate.period)}`;
  }

  t(key: string): string {
    return this.translationService.translate(key);
  }

  // ... existing code ... <rest of the methods>
}
