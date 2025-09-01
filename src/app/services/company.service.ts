import { Injectable, signal, computed } from '@angular/core';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { delay, map } from 'rxjs/operators';

export interface Company {
  id: string;
  name: string;
  logo: string;
  industry: string;
  size: string;
  location: string;
  headquarters: string;
  founded: number;
  website: string;
  description: string;
  mission: string;
  culture: string;
  benefits: string[];
  perks: string[];
  techStack?: string[];
  rating: number;
  reviewCount: number;
  openPositions: number;
  followers: number;
  verified: boolean;
  featured: boolean;
  images: string[];
  socialLinks: {
    linkedin?: string;
    twitter?: string;
    facebook?: string;
    instagram?: string;
  };
  keyPeople: {
    name: string;
    position: string;
    image: string;
  }[];
  awards: {
    title: string;
    year: number;
    issuer: string;
  }[];
  workLifeBalance: number;
  compensationBenefits: number;
  careerOpportunities: number;
  diversityInclusion: number;
  managementQuality: number;
}

export interface CompanyReview {
  id: string;
  companyId: string;
  userId: string;
  userName: string;
  userTitle: string;
  rating: number;
  title: string;
  pros: string;
  cons: string;
  advice?: string;
  recommendToFriend: boolean;
  outlook: 'positive' | 'neutral' | 'negative';
  ceoApproval: boolean;
  employmentStatus: 'current' | 'former';
  employmentLength: string;
  helpful: number;
  date: Date;
}

export interface CompanyFilter {
  industries: string[];
  sizes: string[];
  locations: string[];
  minRating: number;
  verified: boolean;
  hasOpenings: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class CompanyService {
  private companies: Company[] = [
    {
      id: '1',
      name: 'TechCorp',
      logo: 'TC',
      industry: 'Technology',
      size: '5001-10000',
      location: 'San Francisco, CA',
      headquarters: 'San Francisco, CA',
      founded: 2010,
      website: 'https://techcorp.com',
      description: 'Leading technology company specializing in cloud solutions and AI-driven products.',
      mission: 'To democratize technology and make it accessible to everyone.',
      culture: 'We foster innovation, collaboration, and continuous learning in a diverse and inclusive environment.',
      benefits: [
        'Health, Dental & Vision Insurance',
        '401(k) with 6% match',
        'Unlimited PTO',
        'Parental Leave',
        'Professional Development Budget',
        'Stock Options'
      ],
      perks: [
        'Free meals & snacks',
        'Gym membership',
        'Commuter benefits',
        'Team events',
        'Flexible work hours',
        'Remote work options'
      ],
      techStack: ['React', 'Node.js', 'Python', 'AWS', 'Kubernetes', 'PostgreSQL'],
      rating: 4.5,
      reviewCount: 234,
      openPositions: 45,
      followers: 12500,
      verified: true,
      featured: true,
      images: [
        'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800',
        'https://images.unsplash.com/photo-1497366754035-f200581a8d4d?w=800',
        'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800'
      ],
      socialLinks: {
        linkedin: 'https://linkedin.com/company/techcorp',
        twitter: 'https://twitter.com/techcorp',
        facebook: 'https://facebook.com/techcorp'
      },
      keyPeople: [
        {
          name: 'John Smith',
          position: 'CEO & Founder',
          image: 'JS'
        },
        {
          name: 'Jane Doe',
          position: 'CTO',
          image: 'JD'
        }
      ],
      awards: [
        {
          title: 'Best Place to Work',
          year: 2024,
          issuer: 'Tech Magazine'
        },
        {
          title: 'Innovation Award',
          year: 2023,
          issuer: 'Industry Leaders'
        }
      ],
      workLifeBalance: 4.2,
      compensationBenefits: 4.5,
      careerOpportunities: 4.3,
      diversityInclusion: 4.6,
      managementQuality: 4.1
    },
    {
      id: '2',
      name: 'DesignHub',
      logo: 'DH',
      industry: 'Design',
      size: '51-200',
      location: 'New York, NY',
      headquarters: 'New York, NY',
      founded: 2015,
      website: 'https://designhub.com',
      description: 'Creative design agency focused on user experience and brand identity.',
      mission: 'To create beautiful, functional designs that inspire and engage.',
      culture: 'Creative, collaborative, and user-focused with emphasis on work-life balance.',
      benefits: [
        'Health & Dental Insurance',
        '401(k) with 4% match',
        '20 days PTO',
        'Creative sabbaticals',
        'Design tools budget'
      ],
      perks: [
        'Flexible hours',
        'Art classes',
        'Monthly team outings',
        'Standing desks',
        'Pet-friendly office'
      ],
      rating: 4.7,
      reviewCount: 89,
      openPositions: 8,
      followers: 3400,
      verified: true,
      featured: false,
      images: [
        'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800'
      ],
      socialLinks: {
        linkedin: 'https://linkedin.com/company/designhub',
        instagram: 'https://instagram.com/designhub'
      },
      keyPeople: [
        {
          name: 'Sarah Johnson',
          position: 'Creative Director',
          image: 'SJ'
        }
      ],
      awards: [
        {
          title: 'Design Excellence Award',
          year: 2024,
          issuer: 'Design Association'
        }
      ],
      workLifeBalance: 4.8,
      compensationBenefits: 4.0,
      careerOpportunities: 4.2,
      diversityInclusion: 4.5,
      managementQuality: 4.6
    },
    {
      id: '3',
      name: 'DataMinds',
      logo: 'DM',
      industry: 'Data Science',
      size: '201-500',
      location: 'Seattle, WA',
      headquarters: 'Seattle, WA',
      founded: 2018,
      website: 'https://dataminds.io',
      description: 'Data analytics and machine learning solutions for enterprises.',
      mission: 'To unlock the power of data for better business decisions.',
      culture: 'Data-driven, analytical, and focused on continuous improvement.',
      benefits: [
        'Comprehensive health coverage',
        '401(k) with 5% match',
        'Education reimbursement',
        'Conference attendance',
        'Stock options'
      ],
      perks: [
        'Remote-first',
        'Home office stipend',
        'Learning budget',
        'Quarterly hackathons'
      ],
      techStack: ['Python', 'TensorFlow', 'Spark', 'Snowflake', 'Tableau'],
      rating: 4.4,
      reviewCount: 156,
      openPositions: 23,
      followers: 8900,
      verified: true,
      featured: true,
      images: [
        'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800'
      ],
      socialLinks: {
        linkedin: 'https://linkedin.com/company/dataminds',
        twitter: 'https://twitter.com/dataminds'
      },
      keyPeople: [
        {
          name: 'Michael Chen',
          position: 'CEO',
          image: 'MC'
        },
        {
          name: 'Lisa Wang',
          position: 'Chief Data Scientist',
          image: 'LW'
        }
      ],
      awards: [],
      workLifeBalance: 4.3,
      compensationBenefits: 4.4,
      careerOpportunities: 4.5,
      diversityInclusion: 4.2,
      managementQuality: 4.3
    },
    {
      id: '4',
      name: 'CloudTech',
      logo: 'CT',
      industry: 'Cloud Computing',
      size: '1001-5000',
      location: 'Denver, CO',
      headquarters: 'Denver, CO',
      founded: 2012,
      website: 'https://cloudtech.com',
      description: 'Enterprise cloud infrastructure and DevOps solutions.',
      mission: 'To simplify cloud adoption and accelerate digital transformation.',
      culture: 'Engineering excellence, customer focus, and continuous innovation.',
      benefits: [
        'Premium health plans',
        '401(k) with 6% match',
        'Unlimited PTO',
        'Equity packages',
        'Wellness programs'
      ],
      perks: [
        'Ski passes',
        'Outdoor gear discount',
        'Team retreats',
        'Gaming room',
        'Beer on tap'
      ],
      techStack: ['AWS', 'Azure', 'Kubernetes', 'Terraform', 'Go', 'Java'],
      rating: 4.6,
      reviewCount: 312,
      openPositions: 67,
      followers: 15600,
      verified: true,
      featured: true,
      images: [
        'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800'
      ],
      socialLinks: {
        linkedin: 'https://linkedin.com/company/cloudtech',
        twitter: 'https://twitter.com/cloudtech'
      },
      keyPeople: [
        {
          name: 'Robert Taylor',
          position: 'CEO',
          image: 'RT'
        }
      ],
      awards: [
        {
          title: 'Cloud Innovation Leader',
          year: 2024,
          issuer: 'Cloud Computing Magazine'
        }
      ],
      workLifeBalance: 4.5,
      compensationBenefits: 4.6,
      careerOpportunities: 4.7,
      diversityInclusion: 4.3,
      managementQuality: 4.4
    },
    {
      id: '5',
      name: 'BrandBoost',
      logo: 'BB',
      industry: 'Marketing',
      size: '11-50',
      location: 'Los Angeles, CA',
      headquarters: 'Los Angeles, CA',
      founded: 2020,
      website: 'https://brandboost.com',
      description: 'Digital marketing and brand strategy for modern businesses.',
      mission: 'To elevate brands through creative storytelling and data-driven strategies.',
      culture: 'Creative, fast-paced, and results-oriented with a fun atmosphere.',
      benefits: [
        'Health insurance',
        'Simple IRA',
        '15 days PTO',
        'Professional development'
      ],
      perks: [
        'Flexible schedule',
        'Creative Fridays',
        'Team lunches',
        'Industry events'
      ],
      rating: 4.3,
      reviewCount: 45,
      openPositions: 5,
      followers: 2100,
      verified: false,
      featured: false,
      images: [
        'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=800'
      ],
      socialLinks: {
        instagram: 'https://instagram.com/brandboost',
        linkedin: 'https://linkedin.com/company/brandboost'
      },
      keyPeople: [
        {
          name: 'Emma Wilson',
          position: 'Founder & CEO',
          image: 'EW'
        }
      ],
      awards: [],
      workLifeBalance: 4.1,
      compensationBenefits: 3.9,
      careerOpportunities: 4.3,
      diversityInclusion: 4.4,
      managementQuality: 4.2
    },
    {
      id: '6',
      name: 'FinanceFlow',
      logo: 'FF',
      industry: 'Financial Services',
      size: '501-1000',
      location: 'Chicago, IL',
      headquarters: 'Chicago, IL',
      founded: 2016,
      website: 'https://financeflow.com',
      description: 'Modern financial technology solutions for businesses and consumers.',
      mission: 'To make financial services accessible, transparent, and efficient.',
      culture: 'Professional, detail-oriented, with focus on compliance and innovation.',
      benefits: [
        'Excellent health coverage',
        '401(k) with 5% match',
        'Performance bonuses',
        'Education assistance',
        'Stock purchase plan'
      ],
      perks: [
        'Summer Fridays',
        'Gym membership',
        'Financial planning services',
        'Commuter benefits'
      ],
      rating: 4.2,
      reviewCount: 198,
      openPositions: 34,
      followers: 9800,
      verified: true,
      featured: false,
      images: [
        'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800'
      ],
      socialLinks: {
        linkedin: 'https://linkedin.com/company/financeflow',
        twitter: 'https://twitter.com/financeflow'
      },
      keyPeople: [
        {
          name: 'David Martinez',
          position: 'CEO',
          image: 'DM'
        },
        {
          name: 'Rachel Green',
          position: 'CFO',
          image: 'RG'
        }
      ],
      awards: [
        {
          title: 'FinTech Innovation Award',
          year: 2023,
          issuer: 'Finance Industry Association'
        }
      ],
      workLifeBalance: 4.0,
      compensationBenefits: 4.3,
      careerOpportunities: 4.2,
      diversityInclusion: 4.1,
      managementQuality: 4.0
    }
  ];

  private companiesSubject = new BehaviorSubject<Company[]>(this.companies);
  private followedCompaniesSubject = new BehaviorSubject<Set<string>>(new Set());

  companies$ = this.companiesSubject.asObservable();
  followedCompanies$ = this.followedCompaniesSubject.asObservable();

  searchTerm = signal('');
  selectedIndustries = signal<string[]>([]);
  selectedSizes = signal<string[]>([]);
  selectedLocations = signal<string[]>([]);
  minRating = signal(0);
  showVerifiedOnly = signal(false);
  showWithOpeningsOnly = signal(false);
  sortBy = signal<'name' | 'rating' | 'size' | 'openings'>('rating');

  filteredCompanies = computed(() => {
    let filtered = this.companies;
    const search = this.searchTerm().toLowerCase();

    // Search filter
    if (search) {
      filtered = filtered.filter(company =>
        company.name.toLowerCase().includes(search) ||
        company.description.toLowerCase().includes(search) ||
        company.industry.toLowerCase().includes(search) ||
        company.location.toLowerCase().includes(search)
      );
    }

    // Industry filter
    const industries = this.selectedIndustries();
    if (industries.length > 0) {
      filtered = filtered.filter(company =>
        industries.includes(company.industry)
      );
    }

    // Size filter
    const sizes = this.selectedSizes();
    if (sizes.length > 0) {
      filtered = filtered.filter(company =>
        sizes.includes(company.size)
      );
    }

    // Location filter
    const locations = this.selectedLocations();
    if (locations.length > 0) {
      filtered = filtered.filter(company =>
        locations.some(loc => company.location.includes(loc))
      );
    }

    // Rating filter
    const rating = this.minRating();
    if (rating > 0) {
      filtered = filtered.filter(company => company.rating >= rating);
    }

    // Verified filter
    if (this.showVerifiedOnly()) {
      filtered = filtered.filter(company => company.verified);
    }

    // Open positions filter
    if (this.showWithOpeningsOnly()) {
      filtered = filtered.filter(company => company.openPositions > 0);
    }

    // Sort
    const sortBy = this.sortBy();
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'rating':
          return b.rating - a.rating;
        case 'size':
          return this.getSizeValue(b.size) - this.getSizeValue(a.size);
        case 'openings':
          return b.openPositions - a.openPositions;
        default:
          return 0;
      }
    });

    return filtered;
  });

  industries = computed(() => {
    const uniqueIndustries = new Set(this.companies.map(c => c.industry));
    return Array.from(uniqueIndustries).sort();
  });

  sizes = [
    '1-10',
    '11-50',
    '51-200',
    '201-500',
    '501-1000',
    '1001-5000',
    '5001-10000',
    '10000+'
  ];

  locations = computed(() => {
    const uniqueLocations = new Set<string>();
    this.companies.forEach(c => {
      const city = c.location.split(',')[0];
      uniqueLocations.add(city);
    });
    return Array.from(uniqueLocations).sort();
  });

  constructor() {}

  private getSizeValue(size: string): number {
    const sizeMap: { [key: string]: number } = {
      '1-10': 1,
      '11-50': 2,
      '51-200': 3,
      '201-500': 4,
      '501-1000': 5,
      '1001-5000': 6,
      '5001-10000': 7,
      '10000+': 8
    };
    return sizeMap[size] || 0;
  }

  getCompanies(): Observable<Company[]> {
    return this.companies$.pipe(delay(500));
  }

  getCompanyById(id: string): Observable<Company | undefined> {
    return of(this.companies.find(c => c.id === id)).pipe(delay(300));
  }

  getFeaturedCompanies(): Observable<Company[]> {
    return of(this.companies.filter(c => c.featured)).pipe(delay(300));
  }

  followCompany(companyId: string): Observable<void> {
    const followed = this.followedCompaniesSubject.value;
    followed.add(companyId);
    this.followedCompaniesSubject.next(new Set(followed));

    // Update follower count
    const company = this.companies.find(c => c.id === companyId);
    if (company) {
      company.followers++;
      this.companiesSubject.next([...this.companies]);
    }

    return of(void 0).pipe(delay(300));
  }

  unfollowCompany(companyId: string): Observable<void> {
    const followed = this.followedCompaniesSubject.value;
    followed.delete(companyId);
    this.followedCompaniesSubject.next(new Set(followed));

    // Update follower count
    const company = this.companies.find(c => c.id === companyId);
    if (company) {
      company.followers--;
      this.companiesSubject.next([...this.companies]);
    }

    return of(void 0).pipe(delay(300));
  }

  isFollowing(companyId: string): Observable<boolean> {
    return this.followedCompanies$.pipe(
      map(followed => followed.has(companyId))
    );
  }

  getCompanyReviews(companyId: string): Observable<CompanyReview[]> {
    const reviews: CompanyReview[] = [
      {
        id: '1',
        companyId,
        userId: 'user1',
        userName: 'John Developer',
        userTitle: 'Senior Software Engineer',
        rating: 4.5,
        title: 'Great place to grow your career',
        pros: 'Excellent learning opportunities, great team culture, competitive compensation',
        cons: 'Fast-paced environment can be stressful at times',
        advice: 'Be prepared to learn quickly and take ownership of your projects',
        recommendToFriend: true,
        outlook: 'positive',
        ceoApproval: true,
        employmentStatus: 'current',
        employmentLength: '2 years',
        helpful: 45,
        date: new Date('2024-01-15')
      },
      {
        id: '2',
        companyId,
        userId: 'user2',
        userName: 'Sarah Designer',
        userTitle: 'UX Designer',
        rating: 4.0,
        title: 'Good work-life balance',
        pros: 'Flexible hours, remote options, supportive management',
        cons: 'Limited career growth in some departments',
        recommendToFriend: true,
        outlook: 'neutral',
        ceoApproval: true,
        employmentStatus: 'former',
        employmentLength: '3 years',
        helpful: 32,
        date: new Date('2023-11-20')
      }
    ];

    return of(reviews.filter(r => r.companyId === companyId)).pipe(delay(500));
  }

  submitReview(review: Partial<CompanyReview>): Observable<void> {
    // In a real app, this would submit to backend
    return of(void 0).pipe(delay(1000));
  }

  searchCompanies(query: string): Observable<Company[]> {
    const filtered = this.companies.filter(c =>
      c.name.toLowerCase().includes(query.toLowerCase()) ||
      c.industry.toLowerCase().includes(query.toLowerCase())
    );
    return of(filtered).pipe(delay(300));
  }
}
