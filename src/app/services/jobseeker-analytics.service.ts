import { Injectable, signal } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

export interface ApplicationAnalytics {
  userId: string;
  totalApplications: number;
  successRate: number;
  averageResponseTime: number; // in days
  interviewConversionRate: number;
  offerConversionRate: number;
  applicationsByStatus: {
    submitted: number;
    underReview: number;
    interview: number;
    offer: number;
    rejected: number;
    withdrawn: number;
  };
  applicationsByMonth: MonthlyStats[];
  topPerformingCategories: CategoryPerformance[];
  companiesApplied: CompanyApplication[];
  skillsAnalysis: SkillAnalysis[];
  salaryAnalysis: SalaryAnalysis;
  timeMetrics: TimeMetrics;
  improvementSuggestions: string[];
}

export interface MonthlyStats {
  month: string;
  year: number;
  applications: number;
  interviews: number;
  offers: number;
  successRate: number;
}

export interface CategoryPerformance {
  category: string;
  applications: number;
  interviews: number;
  offers: number;
  successRate: number;
  avgResponseTime: number;
}

export interface CompanyApplication {
  companyName: string;
  applications: number;
  status: 'pending' | 'interview' | 'offered' | 'rejected';
  lastApplied: Date;
  avgSalary?: number;
}

export interface SkillAnalysis {
  skill: string;
  demandLevel: 'high' | 'medium' | 'low';
  matchedJobs: number;
  successRate: number;
  recommendedForImprovement: boolean;
}

export interface SalaryAnalysis {
  averageOffered: number;
  averageExpected: number;
  marketAverage: number;
  salaryTrend: 'increasing' | 'stable' | 'decreasing';
  negotiationSuccess: number;
  salaryByCategory: {
    category: string;
    avgSalary: number;
  }[];
}

export interface TimeMetrics {
  avgTimeToFirstResponse: number; // days
  avgTimeToInterview: number; // days
  avgTimeToOffer: number; // days
  avgApplicationTime: number; // minutes per application
  peakApplicationHours: string[];
  mostSuccessfulDays: string[];
}

export interface ProfileStrength {
  overall: number; // percentage
  sections: {
    basicInfo: number;
    experience: number;
    education: number;
    skills: number;
    portfolio: number;
    certifications: number;
  };
  missingElements: string[];
  recommendations: string[];
}

export interface CompetitorAnalysis {
  averageApplicationsPerJob: number;
  yourRanking: number; // percentile
  strongerProfiles: number;
  suggestions: string[];
}

@Injectable({
  providedIn: 'root'
})
export class JobseekerAnalyticsService {
  private analytics = signal<ApplicationAnalytics>({
    userId: 'user1',
    totalApplications: 47,
    successRate: 12.8,
    averageResponseTime: 5.2,
    interviewConversionRate: 23.4,
    offerConversionRate: 8.5,
    applicationsByStatus: {
      submitted: 18,
      underReview: 12,
      interview: 8,
      offer: 4,
      rejected: 3,
      withdrawn: 2
    },
    applicationsByMonth: [
      {
        month: 'January',
        year: 2024,
        applications: 12,
        interviews: 3,
        offers: 1,
        successRate: 8.3
      },
      {
        month: 'February',
        year: 2024,
        applications: 18,
        interviews: 4,
        offers: 2,
        successRate: 11.1
      },
      {
        month: 'March',
        year: 2024,
        applications: 17,
        interviews: 5,
        offers: 1,
        successRate: 5.9
      }
    ],
    topPerformingCategories: [
      {
        category: 'Technology',
        applications: 22,
        interviews: 7,
        offers: 3,
        successRate: 13.6,
        avgResponseTime: 4.5
      },
      {
        category: 'Marketing',
        applications: 15,
        interviews: 3,
        offers: 1,
        successRate: 6.7,
        avgResponseTime: 6.2
      },
      {
        category: 'Finance',
        applications: 10,
        interviews: 2,
        offers: 0,
        successRate: 0,
        avgResponseTime: 7.8
      }
    ],
    companiesApplied: [
      {
        companyName: 'TechCorp',
        applications: 3,
        status: 'interview',
        lastApplied: new Date('2024-03-15'),
        avgSalary: 120000
      },
      {
        companyName: 'StartupXYZ',
        applications: 2,
        status: 'offered',
        lastApplied: new Date('2024-03-10'),
        avgSalary: 110000
      },
      {
        companyName: 'BigCorpInc',
        applications: 1,
        status: 'rejected',
        lastApplied: new Date('2024-02-28'),
        avgSalary: 130000
      }
    ],
    skillsAnalysis: [
      {
        skill: 'JavaScript',
        demandLevel: 'high',
        matchedJobs: 156,
        successRate: 15.2,
        recommendedForImprovement: false
      },
      {
        skill: 'React',
        demandLevel: 'high',
        matchedJobs: 142,
        successRate: 18.5,
        recommendedForImprovement: false
      },
      {
        skill: 'Python',
        demandLevel: 'medium',
        matchedJobs: 89,
        successRate: 8.3,
        recommendedForImprovement: true
      },
      {
        skill: 'AWS',
        demandLevel: 'high',
        matchedJobs: 98,
        successRate: 5.2,
        recommendedForImprovement: true
      }
    ],
    salaryAnalysis: {
      averageOffered: 115000,
      averageExpected: 125000,
      marketAverage: 118000,
      salaryTrend: 'increasing',
      negotiationSuccess: 65,
      salaryByCategory: [
        { category: 'Technology', avgSalary: 125000 },
        { category: 'Marketing', avgSalary: 95000 },
        { category: 'Finance', avgSalary: 135000 }
      ]
    },
    timeMetrics: {
      avgTimeToFirstResponse: 5.2,
      avgTimeToInterview: 8.7,
      avgTimeToOffer: 14.3,
      avgApplicationTime: 25,
      peakApplicationHours: ['9:00 AM', '2:00 PM', '7:00 PM'],
      mostSuccessfulDays: ['Tuesday', 'Thursday']
    },
    improvementSuggestions: [
      'Your interview conversion rate is below average. Consider improving your resume formatting.',
      'Applications in Finance category have 0% success rate. Consider gaining more relevant skills.',
      'Your expected salary is 8% above market average. Consider adjusting expectations.',
      'AWS skills are in high demand but your success rate is low. Consider getting certified.'
    ]
  });

  private profileStrength = signal<ProfileStrength>({
    overall: 78,
    sections: {
      basicInfo: 100,
      experience: 85,
      education: 90,
      skills: 75,
      portfolio: 60,
      certifications: 40
    },
    missingElements: [
      'Portfolio projects',
      'Professional certifications',
      'LinkedIn profile link',
      'Cover letter template'
    ],
    recommendations: [
      'Add 2-3 portfolio projects to showcase your skills',
      'Complete AWS certification to improve marketability',
      'Update your LinkedIn profile and add the link',
      'Create a compelling cover letter template'
    ]
  });

  private competitorAnalysis = signal<CompetitorAnalysis>({
    averageApplicationsPerJob: 45,
    yourRanking: 72, // 72nd percentile
    strongerProfiles: 28,
    suggestions: [
      '28% of applicants have stronger profiles in your category',
      'Consider adding more relevant keywords to your resume',
      'Highlight quantifiable achievements in your experience',
      'Add industry-specific certifications'
    ]
  });

  constructor() {}

  getUserAnalytics(userId: string): Observable<ApplicationAnalytics> {
    // In real app, fetch user-specific data
    return of(this.analytics());
  }

  getProfileStrength(userId: string): Observable<ProfileStrength> {
    return of(this.profileStrength());
  }

  getCompetitorAnalysis(userId: string, category?: string): Observable<CompetitorAnalysis> {
    return of(this.competitorAnalysis());
  }

  getApplicationTrends(userId: string, period: 'week' | 'month' | 'quarter' | 'year'): Observable<any> {
    const analytics = this.analytics();

    // Calculate trends based on period
    const trends = {
      period,
      current: {
        applications: 0,
        interviews: 0,
        offers: 0
      },
      previous: {
        applications: 0,
        interviews: 0,
        offers: 0
      },
      change: {
        applications: 0,
        interviews: 0,
        offers: 0
      }
    };

    // Simulate trend calculation
    if (period === 'month') {
      trends.current = {
        applications: 17,
        interviews: 5,
        offers: 1
      };
      trends.previous = {
        applications: 18,
        interviews: 4,
        offers: 2
      };
    }

    trends.change = {
      applications: ((trends.current.applications - trends.previous.applications) / trends.previous.applications) * 100,
      interviews: ((trends.current.interviews - trends.previous.interviews) / trends.previous.interviews) * 100,
      offers: ((trends.current.offers - trends.previous.offers) / trends.previous.offers) * 100
    };

    return of(trends);
  }

  getRecommendedJobs(userId: string): Observable<any[]> {
    // Based on analytics, recommend jobs
    const recommendations = [
      {
        jobId: 'job1',
        title: 'Senior Frontend Developer',
        company: 'TechCorp',
        matchScore: 92,
        reasons: [
          'High success rate with similar positions',
          'Skills match: React, JavaScript',
          'Salary within expected range'
        ]
      },
      {
        jobId: 'job2',
        title: 'Full Stack Developer',
        company: 'InnovateTech',
        matchScore: 87,
        reasons: [
          'Company culture match',
          'Technology stack alignment',
          'Location preference match'
        ]
      }
    ];

    return of(recommendations);
  }

  getSkillGapAnalysis(userId: string): Observable<any> {
    const analysis = {
      missingSkills: [
        { skill: 'Docker', demand: 'high', jobsRequiring: 234 },
        { skill: 'Kubernetes', demand: 'medium', jobsRequiring: 156 },
        { skill: 'GraphQL', demand: 'medium', jobsRequiring: 98 }
      ],
      learningPaths: [
        {
          path: 'DevOps Fundamentals',
          duration: '3 months',
          skills: ['Docker', 'Kubernetes', 'CI/CD'],
          potentialSalaryIncrease: 15000
        },
        {
          path: 'Advanced Frontend',
          duration: '2 months',
          skills: ['GraphQL', 'Next.js', 'TypeScript'],
          potentialSalaryIncrease: 10000
        }
      ]
    };

    return of(analysis);
  }

  generateInsights(userId: string): Observable<string[]> {
    const analytics = this.analytics();
    const insights: string[] = [];

    // Success rate insights
    if (analytics.successRate < 10) {
      insights.push('Your application success rate is below average. Consider tailoring your resume for each position.');
    }

    // Response time insights
    if (analytics.averageResponseTime > 7) {
      insights.push('Companies take longer to respond to your applications. Try following up after a week.');
    }

    // Category insights
    const bestCategory = analytics.topPerformingCategories[0];
    if (bestCategory) {
      insights.push(`You have the highest success rate in ${bestCategory.category} positions. Focus more on this area.`);
    }

    // Salary insights
    if (analytics.salaryAnalysis.averageExpected > analytics.salaryAnalysis.marketAverage * 1.1) {
      insights.push('Your salary expectations are above market rate. Consider being more flexible.');
    }

    // Time insights
    if (analytics.timeMetrics.avgApplicationTime > 30) {
      insights.push('You spend more time than average on applications. Consider creating templates.');
    }

    return of(insights);
  }

  exportAnalyticsReport(userId: string, format: 'pdf' | 'csv' | 'json'): Observable<Blob> {
    // Simulate report generation
    const analytics = this.analytics();
    const reportData = JSON.stringify(analytics, null, 2);
    const blob = new Blob([reportData], { type: 'application/json' });
    return of(blob);
  }
}
