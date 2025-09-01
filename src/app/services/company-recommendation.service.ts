import { Injectable, signal, computed } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { Company } from './company.service';

export interface UserPreferences {
  industries: string[];
  companySize: string[];
  location: string[];
  minRating: number;
  workLifeBalance: number; // 1-5 importance
  compensation: number; // 1-5 importance
  careerGrowth: number; // 1-5 importance
  culture: number; // 1-5 importance
  benefits: string[];
  techStack?: string[];
  values: string[];
}

export interface RecommendationScore {
  companyId: string;
  company: Company;
  overallScore: number; // 0-100
  matchReasons: string[];
  scores: {
    industryMatch: number;
    sizeMatch: number;
    locationMatch: number;
    ratingMatch: number;
    cultureMatch: number;
    benefitsMatch: number;
    techMatch: number;
  };
  strengths: string[];
  considerations: string[];
}

export interface AIInsight {
  type: 'strength' | 'opportunity' | 'trend' | 'advice';
  title: string;
  description: string;
  relevance: number; // 0-100
}

@Injectable({
  providedIn: 'root'
})
export class CompanyRecommendationService {
  userPreferences = signal<UserPreferences>({
    industries: [],
    companySize: [],
    location: [],
    minRating: 3.5,
    workLifeBalance: 4,
    compensation: 4,
    careerGrowth: 5,
    culture: 4,
    benefits: [],
    techStack: [],
    values: []
  });

  recommendationHistory = signal<RecommendationScore[]>([]);

  constructor() {}

  updatePreferences(preferences: Partial<UserPreferences>): void {
    const current = this.userPreferences();
    this.userPreferences.set({ ...current, ...preferences });
  }

  getRecommendations(companies: Company[]): Observable<RecommendationScore[]> {
    const preferences = this.userPreferences();
    const recommendations = companies.map(company =>
      this.calculateRecommendationScore(company, preferences)
    );

    // Sort by overall score
    recommendations.sort((a, b) => b.overallScore - a.overallScore);

    // Store in history
    this.recommendationHistory.set(recommendations.slice(0, 10));

    return of(recommendations).pipe(delay(800));
  }

  private calculateRecommendationScore(
    company: Company,
    preferences: UserPreferences
  ): RecommendationScore {
    const scores = {
      industryMatch: this.calculateIndustryMatch(company, preferences),
      sizeMatch: this.calculateSizeMatch(company, preferences),
      locationMatch: this.calculateLocationMatch(company, preferences),
      ratingMatch: this.calculateRatingMatch(company, preferences),
      cultureMatch: this.calculateCultureMatch(company, preferences),
      benefitsMatch: this.calculateBenefitsMatch(company, preferences),
      techMatch: this.calculateTechMatch(company, preferences)
    };

    // Weighted average based on user preferences
    const weights = {
      industryMatch: 0.2,
      sizeMatch: 0.1,
      locationMatch: 0.15,
      ratingMatch: 0.15,
      cultureMatch: preferences.culture / 5 * 0.15,
      benefitsMatch: preferences.compensation / 5 * 0.15,
      techMatch: 0.1
    };

    let overallScore = 0;
    let totalWeight = 0;
    for (const [key, weight] of Object.entries(weights)) {
      overallScore += scores[key as keyof typeof scores] * weight;
      totalWeight += weight;
    }
    overallScore = (overallScore / totalWeight) * 100;

    const matchReasons = this.generateMatchReasons(company, scores, preferences);
    const strengths = this.identifyStrengths(company, scores);
    const considerations = this.identifyConsiderations(company, scores);

    return {
      companyId: company.id,
      company,
      overallScore: Math.round(overallScore),
      matchReasons,
      scores,
      strengths,
      considerations
    };
  }

  private calculateIndustryMatch(company: Company, preferences: UserPreferences): number {
    if (preferences.industries.length === 0) return 0.7;
    return preferences.industries.includes(company.industry) ? 1 : 0.3;
  }

  private calculateSizeMatch(company: Company, preferences: UserPreferences): number {
    if (preferences.companySize.length === 0) return 0.7;
    return preferences.companySize.includes(company.size) ? 1 : 0.4;
  }

  private calculateLocationMatch(company: Company, preferences: UserPreferences): number {
    if (preferences.location.length === 0) return 0.7;
    return preferences.location.some(loc =>
      company.location.toLowerCase().includes(loc.toLowerCase())
    ) ? 1 : 0.3;
  }

  private calculateRatingMatch(company: Company, preferences: UserPreferences): number {
    if (company.rating >= preferences.minRating) {
      return Math.min(1, company.rating / 5);
    }
    return company.rating / preferences.minRating * 0.5;
  }

  private calculateCultureMatch(company: Company, preferences: UserPreferences): number {
    let score = 0;
    let factors = 0;

    if (preferences.workLifeBalance > 3) {
      score += (company.workLifeBalance / 5) * preferences.workLifeBalance;
      factors += preferences.workLifeBalance;
    }

    if (preferences.careerGrowth > 3) {
      score += (company.careerOpportunities / 5) * preferences.careerGrowth;
      factors += preferences.careerGrowth;
    }

    if (preferences.culture > 3) {
      score += (company.managementQuality / 5) * preferences.culture;
      factors += preferences.culture;
    }

    return factors > 0 ? score / factors : 0.7;
  }

  private calculateBenefitsMatch(company: Company, preferences: UserPreferences): number {
    if (preferences.benefits.length === 0) return 0.7;

    const matchingBenefits = preferences.benefits.filter(benefit =>
      company.benefits.some(cb =>
        cb.toLowerCase().includes(benefit.toLowerCase())
      )
    );

    return matchingBenefits.length / preferences.benefits.length;
  }

  private calculateTechMatch(company: Company, preferences: UserPreferences): number {
    if (!preferences.techStack || preferences.techStack.length === 0) return 0.7;
    if (!company.techStack || company.techStack.length === 0) return 0.3;

    const matchingTech = preferences.techStack.filter(tech =>
      company.techStack!.some(ct =>
        ct.toLowerCase().includes(tech.toLowerCase())
      )
    );

    return matchingTech.length / preferences.techStack.length;
  }

  private generateMatchReasons(
    company: Company,
    scores: any,
    preferences: UserPreferences
  ): string[] {
    const reasons: string[] = [];

    if (scores.industryMatch > 0.8) {
      reasons.push(`Perfect match for ${company.industry} industry preference`);
    }

    if (scores.ratingMatch > 0.8) {
      reasons.push(`Highly rated company (${company.rating}/5)`);
    }

    if (scores.cultureMatch > 0.8) {
      reasons.push('Strong cultural alignment with your values');
    }

    if (scores.benefitsMatch > 0.7) {
      reasons.push('Excellent benefits package matching your needs');
    }

    if (company.openPositions > 20) {
      reasons.push(`${company.openPositions} open positions available`);
    }

    if (company.verified) {
      reasons.push('Verified company with established reputation');
    }

    return reasons.slice(0, 4);
  }

  private identifyStrengths(company: Company, scores: any): string[] {
    const strengths: string[] = [];

    if (company.rating >= 4.5) {
      strengths.push('Exceptional employee satisfaction');
    }

    if (company.workLifeBalance >= 4.3) {
      strengths.push('Outstanding work-life balance');
    }

    if (company.compensationBenefits >= 4.3) {
      strengths.push('Competitive compensation and benefits');
    }

    if (company.careerOpportunities >= 4.3) {
      strengths.push('Strong career growth opportunities');
    }

    if (company.diversityInclusion >= 4.3) {
      strengths.push('Commitment to diversity and inclusion');
    }

    return strengths.slice(0, 3);
  }

  private identifyConsiderations(company: Company, scores: any): string[] {
    const considerations: string[] = [];

    if (company.rating < 3.5) {
      considerations.push('Lower than average employee ratings');
    }

    if (company.openPositions < 5) {
      considerations.push('Limited open positions currently');
    }

    if (!company.verified) {
      considerations.push('Company not yet verified');
    }

    if (scores.locationMatch < 0.5) {
      considerations.push('Location may require relocation');
    }

    return considerations;
  }

  getAIInsights(company: Company): Observable<AIInsight[]> {
    const insights: AIInsight[] = [
      {
        type: 'strength',
        title: 'Growing Tech Leader',
        description: `${company.name} has shown 40% growth in job openings over the past year, indicating rapid expansion.`,
        relevance: 85
      },
      {
        type: 'opportunity',
        title: 'Early Career Development',
        description: 'Based on employee reviews, this company invests heavily in junior talent development programs.',
        relevance: 78
      },
      {
        type: 'trend',
        title: 'Remote-First Culture',
        description: '73% of employees report flexible work arrangements, above industry average.',
        relevance: 82
      },
      {
        type: 'advice',
        title: 'Application Tip',
        description: 'Employees mention that demonstrating cultural fit is key during interviews at this company.',
        relevance: 90
      }
    ];

    return of(insights).pipe(delay(600));
  }

  getPredictedFit(companyId: string, userProfile: any): Observable<number> {
    // Simulate AI prediction based on user profile
    const fitScore = Math.random() * 30 + 70; // 70-100 range
    return of(fitScore).pipe(delay(500));
  }

  getPersonalizedTips(company: Company): Observable<string[]> {
    const tips = [
      `Highlight experience with ${company.techStack?.[0] || 'relevant technologies'} in your application`,
      `Emphasize ${company.rating > 4 ? 'collaborative skills' : 'adaptability'} based on company culture`,
      `Research recent ${company.industry} trends to discuss in interviews`,
      `Connect with current employees on LinkedIn for insider perspectives`,
      `Prepare examples demonstrating ${company.values?.[0] || 'innovation and teamwork'}`
    ];

    return of(tips.slice(0, 3)).pipe(delay(400));
  }
}
