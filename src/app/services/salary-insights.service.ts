import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

export interface SalaryData {
  role: string;
  department: string;
  level: string;
  baseSalary: {
    min: number;
    max: number;
    median: number;
    average: number;
  };
  totalCompensation: {
    min: number;
    max: number;
    median: number;
    average: number;
  };
  bonus?: {
    min: number;
    max: number;
    average: number;
  };
  equity?: {
    min: number;
    max: number;
    average: number;
  };
  dataPoints: number;
  lastUpdated: Date;
}

export interface CompanySalaryInsights {
  companyId: string;
  companyName: string;
  salaryData: SalaryData[];
  averageRating: number;
  competitivenessScore: number; // 0-100
  industryComparison: {
    position: 'below' | 'at' | 'above';
    percentDifference: number;
  };
  benefits: {
    name: string;
    value: string;
    satisfaction: number; // 0-5
  }[];
  compensationPhilosophy: string;
  payTransparency: boolean;
  negotiable: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class SalaryInsightsService {
  private mockSalaryData: { [key: string]: CompanySalaryInsights } = {
    '1': { // TechCorp
      companyId: '1',
      companyName: 'TechCorp',
      salaryData: [
        {
          role: 'Software Engineer',
          department: 'Engineering',
          level: 'Junior',
          baseSalary: { min: 80000, max: 100000, median: 90000, average: 92000 },
          totalCompensation: { min: 95000, max: 120000, median: 105000, average: 108000 },
          bonus: { min: 5000, max: 15000, average: 10000 },
          equity: { min: 10000, max: 20000, average: 15000 },
          dataPoints: 45,
          lastUpdated: new Date('2024-01-15')
        },
        {
          role: 'Software Engineer',
          department: 'Engineering',
          level: 'Senior',
          baseSalary: { min: 130000, max: 170000, median: 150000, average: 152000 },
          totalCompensation: { min: 160000, max: 220000, median: 185000, average: 190000 },
          bonus: { min: 15000, max: 35000, average: 25000 },
          equity: { min: 20000, max: 40000, average: 30000 },
          dataPoints: 78,
          lastUpdated: new Date('2024-01-15')
        },
        {
          role: 'Product Manager',
          department: 'Product',
          level: 'Mid',
          baseSalary: { min: 110000, max: 140000, median: 125000, average: 127000 },
          totalCompensation: { min: 130000, max: 170000, median: 150000, average: 152000 },
          bonus: { min: 10000, max: 25000, average: 18000 },
          equity: { min: 15000, max: 30000, average: 22000 },
          dataPoints: 32,
          lastUpdated: new Date('2024-01-10')
        },
        {
          role: 'Data Scientist',
          department: 'Data',
          level: 'Senior',
          baseSalary: { min: 140000, max: 180000, median: 160000, average: 162000 },
          totalCompensation: { min: 170000, max: 230000, median: 195000, average: 200000 },
          bonus: { min: 15000, max: 35000, average: 25000 },
          equity: { min: 20000, max: 40000, average: 30000 },
          dataPoints: 25,
          lastUpdated: new Date('2024-01-12')
        },
        {
          role: 'UX Designer',
          department: 'Design',
          level: 'Mid',
          baseSalary: { min: 95000, max: 120000, median: 107000, average: 108000 },
          totalCompensation: { min: 105000, max: 140000, median: 122000, average: 125000 },
          bonus: { min: 5000, max: 15000, average: 10000 },
          equity: { min: 10000, max: 20000, average: 15000 },
          dataPoints: 18,
          lastUpdated: new Date('2024-01-08')
        }
      ],
      averageRating: 4.3,
      competitivenessScore: 85,
      industryComparison: {
        position: 'above',
        percentDifference: 12
      },
      benefits: [
        { name: '401(k) Match', value: '6% match', satisfaction: 4.5 },
        { name: 'Health Insurance', value: '100% covered', satisfaction: 4.8 },
        { name: 'PTO', value: 'Unlimited', satisfaction: 4.6 },
        { name: 'Remote Work', value: 'Flexible', satisfaction: 4.7 },
        { name: 'Learning Budget', value: '$2,500/year', satisfaction: 4.4 },
        { name: 'Wellness Stipend', value: '$100/month', satisfaction: 4.3 }
      ],
      compensationPhilosophy: 'We believe in paying at the 75th percentile of the market for all roles, with significant equity participation for long-term value creation.',
      payTransparency: true,
      negotiable: true
    },
    '2': { // DesignHub
      companyId: '2',
      companyName: 'DesignHub',
      salaryData: [
        {
          role: 'Senior Designer',
          department: 'Design',
          level: 'Senior',
          baseSalary: { min: 100000, max: 130000, median: 115000, average: 117000 },
          totalCompensation: { min: 110000, max: 145000, median: 127000, average: 130000 },
          bonus: { min: 5000, max: 12000, average: 8000 },
          dataPoints: 15,
          lastUpdated: new Date('2024-01-20')
        },
        {
          role: 'Creative Director',
          department: 'Design',
          level: 'Director',
          baseSalary: { min: 150000, max: 180000, median: 165000, average: 167000 },
          totalCompensation: { min: 170000, max: 210000, median: 190000, average: 192000 },
          bonus: { min: 15000, max: 25000, average: 20000 },
          dataPoints: 8,
          lastUpdated: new Date('2024-01-18')
        }
      ],
      averageRating: 4.1,
      competitivenessScore: 75,
      industryComparison: {
        position: 'at',
        percentDifference: 2
      },
      benefits: [
        { name: '401(k) Match', value: '4% match', satisfaction: 4.0 },
        { name: 'Health Insurance', value: '80% covered', satisfaction: 3.8 },
        { name: 'PTO', value: '20 days', satisfaction: 4.2 },
        { name: 'Creative Days', value: '1 day/month', satisfaction: 4.7 }
      ],
      compensationPhilosophy: 'Fair market compensation with emphasis on work-life balance and creative freedom.',
      payTransparency: false,
      negotiable: true
    }
  };

  constructor() {}

  getCompanySalaryInsights(companyId: string): Observable<CompanySalaryInsights | null> {
    return of(this.mockSalaryData[companyId] || null).pipe(delay(500));
  }

  getSalaryByRole(companyId: string, role: string): Observable<SalaryData[]> {
    const companyData = this.mockSalaryData[companyId];
    if (!companyData) {
      return of([]).pipe(delay(300));
    }

    const roleSalaries = companyData.salaryData.filter(
      s => s.role.toLowerCase().includes(role.toLowerCase())
    );
    return of(roleSalaries).pipe(delay(300));
  }

  compareSalaries(companyIds: string[], role: string): Observable<any> {
    const comparisons = companyIds.map(id => {
      const company = this.mockSalaryData[id];
      if (!company) return null;

      const roleSalary = company.salaryData.find(s => s.role === role);
      return {
        companyId: id,
        companyName: company.companyName,
        salary: roleSalary
      };
    }).filter(c => c !== null);

    return of(comparisons).pipe(delay(500));
  }

  getIndustryBenchmark(industry: string, role: string): Observable<any> {
    // Mock industry benchmark data
    const benchmark = {
      industry,
      role,
      baseSalary: {
        percentile25: 85000,
        percentile50: 105000,
        percentile75: 130000,
        percentile90: 155000
      },
      totalCompensation: {
        percentile25: 95000,
        percentile50: 120000,
        percentile75: 155000,
        percentile90: 190000
      },
      dataPoints: 500,
      lastUpdated: new Date('2024-01-01')
    };

    return of(benchmark).pipe(delay(400));
  }

  submitSalaryData(data: Partial<SalaryData>): Observable<void> {
    // In a real app, this would submit to backend
    console.log('Submitting salary data:', data);
    return of(void 0).pipe(delay(1000));
  }

  getSalaryTrends(companyId: string): Observable<any> {
    const trends = {
      companyId,
      yearOverYear: [
        { year: 2021, averageIncrease: 3.2 },
        { year: 2022, averageIncrease: 4.5 },
        { year: 2023, averageIncrease: 5.1 },
        { year: 2024, averageIncrease: 4.8 }
      ],
      projectedIncrease: 5.2,
      inflationAdjusted: true
    };

    return of(trends).pipe(delay(300));
  }
}
