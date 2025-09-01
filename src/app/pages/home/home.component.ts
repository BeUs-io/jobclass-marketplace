import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { HeroSearchComponent } from '../../components/hero-search/hero-search.component';
import { PremiumJobsComponent } from '../../components/premium-jobs/premium-jobs.component';
import { LatestJobsComponent } from '../../components/latest-jobs/latest-jobs.component';
import { CategoriesListComponent } from '../../components/categories-list/categories-list.component';
import { LocationsComponent } from '../../components/locations/locations.component';
import { FeaturedCompaniesComponent } from '../../components/featured-companies/featured-companies.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    HeroSearchComponent,
    PremiumJobsComponent,
    LatestJobsComponent,
    CategoriesListComponent,
    LocationsComponent,
    FeaturedCompaniesComponent
  ],
  template: `
    <div>
      <!-- Hero Section -->
      <app-hero-search></app-hero-search>

      <!-- Premium Jobs -->
      <app-premium-jobs></app-premium-jobs>

      <!-- Latest Jobs -->
      <app-latest-jobs></app-latest-jobs>

      <!-- Browse by Category -->
      <app-categories-list></app-categories-list>

      <!-- Choose Location -->
      <app-locations></app-locations>

      <!-- Featured Companies -->
      <app-featured-companies></app-featured-companies>
    </div>
  `,
  styles: []
})
export class HomeComponent {}
