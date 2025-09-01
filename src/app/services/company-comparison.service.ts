import { Injectable, signal, computed } from '@angular/core';
import { Company } from './company.service';

export interface ComparisonMetric {
  category: string;
  metrics: {
    name: string;
    key: keyof Company | string;
    format?: 'number' | 'currency' | 'percent' | 'rating' | 'list' | 'boolean';
    higher_better?: boolean;
  }[];
}

@Injectable({
  providedIn: 'root'
})
export class CompanyComparisonService {
  selectedCompanies = signal<Company[]>([]);
  maxCompanies = 4;

  comparisonMetrics: ComparisonMetric[] = [
    {
      category: 'Overview',
      metrics: [
        { name: 'Industry', key: 'industry' },
        { name: 'Company Size', key: 'size' },
        { name: 'Founded', key: 'founded', format: 'number' },
        { name: 'Headquarters', key: 'headquarters' },
        { name: 'Open Positions', key: 'openPositions', format: 'number', higher_better: true }
      ]
    },
    {
      category: 'Ratings & Culture',
      metrics: [
        { name: 'Overall Rating', key: 'rating', format: 'rating', higher_better: true },
        { name: 'Work-Life Balance', key: 'workLifeBalance', format: 'rating', higher_better: true },
        { name: 'Compensation & Benefits', key: 'compensationBenefits', format: 'rating', higher_better: true },
        { name: 'Career Opportunities', key: 'careerOpportunities', format: 'rating', higher_better: true },
        { name: 'Diversity & Inclusion', key: 'diversityInclusion', format: 'rating', higher_better: true },
        { name: 'Management Quality', key: 'managementQuality', format: 'rating', higher_better: true }
      ]
    },
    {
      category: 'Benefits & Perks',
      metrics: [
        { name: 'Benefits', key: 'benefits', format: 'list' },
        { name: 'Perks', key: 'perks', format: 'list' }
      ]
    },
    {
      category: 'Tech Stack',
      metrics: [
        { name: 'Technologies', key: 'techStack', format: 'list' }
      ]
    },
    {
      category: 'Social Presence',
      metrics: [
        { name: 'Followers', key: 'followers', format: 'number', higher_better: true },
        { name: 'Review Count', key: 'reviewCount', format: 'number', higher_better: true },
        { name: 'Verified', key: 'verified', format: 'boolean' }
      ]
    }
  ];

  canAddMore = computed(() => this.selectedCompanies().length < this.maxCompanies);
  hasCompanies = computed(() => this.selectedCompanies().length > 0);
  comparisonReady = computed(() => this.selectedCompanies().length >= 2);

  constructor() {}

  addCompany(company: Company): boolean {
    const current = this.selectedCompanies();
    if (current.length >= this.maxCompanies) {
      return false;
    }
    if (current.find(c => c.id === company.id)) {
      return false;
    }
    this.selectedCompanies.set([...current, company]);
    return true;
  }

  removeCompany(companyId: string): void {
    const current = this.selectedCompanies();
    this.selectedCompanies.set(current.filter(c => c.id !== companyId));
  }

  clearComparison(): void {
    this.selectedCompanies.set([]);
  }

  isSelected(companyId: string): boolean {
    return this.selectedCompanies().some(c => c.id === companyId);
  }

  getBestValue(metric: string, companies: Company[]): any {
    if (companies.length === 0) return null;

    const values = companies.map(c => this.getMetricValue(c, metric)).filter(v => v !== null);
    if (values.length === 0) return null;

    const metricConfig = this.findMetricConfig(metric);
    if (!metricConfig?.higher_better) return null;

    if (metricConfig.format === 'number' || metricConfig.format === 'rating') {
      return Math.max(...values.map(v => Number(v) || 0));
    }

    return null;
  }

  private getMetricValue(company: Company, key: string): any {
    return (company as any)[key];
  }

  private findMetricConfig(key: string): any {
    for (const category of this.comparisonMetrics) {
      const metric = category.metrics.find(m => m.key === key);
      if (metric) return metric;
    }
    return null;
  }

  generateInsights(companies: Company[]): string[] {
    const insights: string[] = [];

    if (companies.length < 2) return insights;

    // Rating insights
    const ratings = companies.map(c => c.rating);
    const highestRated = companies.reduce((prev, current) =>
      prev.rating > current.rating ? prev : current
    );
    insights.push(`${highestRated.name} has the highest overall rating at ${highestRated.rating}/5`);

    // Size insights
    const sizes = companies.map(c => c.size);
    const uniqueSizes = [...new Set(sizes)];
    if (uniqueSizes.length === companies.length) {
      insights.push('All companies are of different sizes, offering varied work environments');
    }

    // Industry insights
    const industries = companies.map(c => c.industry);
    const uniqueIndustries = [...new Set(industries)];
    if (uniqueIndustries.length === 1) {
      insights.push(`All companies are in the ${uniqueIndustries[0]} industry`);
    } else {
      insights.push(`Companies span ${uniqueIndustries.length} different industries`);
    }

    // Open positions
    const totalOpenings = companies.reduce((sum, c) => sum + c.openPositions, 0);
    insights.push(`${totalOpenings} total open positions across all companies`);

    // Work-life balance
    const bestWorkLife = companies.reduce((prev, current) =>
      prev.workLifeBalance > current.workLifeBalance ? prev : current
    );
    if (bestWorkLife.workLifeBalance > 4) {
      insights.push(`${bestWorkLife.name} excels in work-life balance with a ${bestWorkLife.workLifeBalance}/5 rating`);
    }

    return insights;
  }

  exportComparison(companies: Company[]): string {
    let csv = 'Metric';
    companies.forEach(c => csv += `,${c.name}`);
    csv += '\n';

    this.comparisonMetrics.forEach(category => {
      csv += `\n${category.category}\n`;
      category.metrics.forEach(metric => {
        csv += metric.name;
        companies.forEach(company => {
          const value = this.getMetricValue(company, metric.key);
          csv += `,${this.formatValue(value, metric.format)}`;
        });
        csv += '\n';
      });
    });

    return csv;
  }

  private formatValue(value: any, format?: string): string {
    if (value === null || value === undefined) return 'N/A';

    switch (format) {
      case 'rating':
        return `${value}/5`;
      case 'currency':
        return `$${value.toLocaleString()}`;
      case 'percent':
        return `${value}%`;
      case 'list':
        return Array.isArray(value) ? value.length.toString() : '0';
      case 'boolean':
        return value ? 'Yes' : 'No';
      default:
        return value.toString();
    }
  }
}
