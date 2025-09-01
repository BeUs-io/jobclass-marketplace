import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Job, JobType, Category, Location } from '../models/job.model';
import { delay, map } from 'rxjs/operators';

export interface JobFilters {
  searchQuery?: string;
  location?: string;
  category?: string;
  jobType?: JobType;
  salaryMin?: number;
  salaryMax?: number;
  isRemote?: boolean;
  experienceLevel?: string;
}

@Injectable({
  providedIn: 'root'
})
export class JobService {
  private jobsSubject = new BehaviorSubject<Job[]>(this.generateMockJobs());
  public jobs$ = this.jobsSubject.asObservable();

  private filtersSubject = new BehaviorSubject<JobFilters>({});
  public filters$ = this.filtersSubject.asObservable();

  private savedJobsSubject = new BehaviorSubject<Set<string>>(new Set());
  public savedJobs$ = this.savedJobsSubject.asObservable();

  constructor() {
    // Load saved jobs from localStorage
    const savedJobs = localStorage.getItem('savedJobs');
    if (savedJobs) {
      this.savedJobsSubject.next(new Set(JSON.parse(savedJobs)));
    }
  }

  searchJobs(filters: JobFilters): Observable<Job[]> {
    this.filtersSubject.next(filters);

    return this.jobs$.pipe(
      map(jobs => {
        let filtered = [...jobs];

        // Search query filter
        if (filters.searchQuery) {
          const query = filters.searchQuery.toLowerCase();
          filtered = filtered.filter(job =>
            job.title.toLowerCase().includes(query) ||
            job.company.name.toLowerCase().includes(query) ||
            job.description.toLowerCase().includes(query)
          );
        }

        // Location filter
        if (filters.location) {
          filtered = filtered.filter(job =>
            job.location.toLowerCase().includes(filters.location!.toLowerCase())
          );
        }

        // Category filter
        if (filters.category) {
          filtered = filtered.filter(job => job.category === filters.category);
        }

        // Job type filter
        if (filters.jobType) {
          filtered = filtered.filter(job => job.type === filters.jobType);
        }

        // Salary filter
        if (filters.salaryMin || filters.salaryMax) {
          filtered = filtered.filter(job => {
            if (!job.salary) return false;
            const minOk = !filters.salaryMin || job.salary.min >= filters.salaryMin;
            const maxOk = !filters.salaryMax || job.salary.max <= filters.salaryMax;
            return minOk && maxOk;
          });
        }

        // Remote filter
        if (filters.isRemote) {
          filtered = filtered.filter(job => job.location.toLowerCase().includes('remote'));
        }

        return filtered;
      }),
      delay(300) // Simulate API delay
    );
  }

  getJobById(id: string): Observable<Job | undefined> {
    return this.jobs$.pipe(
      map(jobs => jobs.find(job => job.id === id))
    );
  }

  toggleSaveJob(jobId: string): void {
    const currentSaved = this.savedJobsSubject.value;
    if (currentSaved.has(jobId)) {
      currentSaved.delete(jobId);
    } else {
      currentSaved.add(jobId);
    }
    this.savedJobsSubject.next(new Set(currentSaved));
    localStorage.setItem('savedJobs', JSON.stringify(Array.from(currentSaved)));
  }

  isJobSaved(jobId: string): Observable<boolean> {
    return this.savedJobs$.pipe(
      map(saved => saved.has(jobId))
    );
  }

  getSavedJobs(): Observable<Job[]> {
    return this.jobs$.pipe(
      map(jobs => {
        const savedIds = this.savedJobsSubject.value;
        return jobs.filter(job => savedIds.has(job.id));
      })
    );
  }

  getCategories(): Observable<Category[]> {
    const categories: Category[] = [
      { id: '1', name: 'Engineering', jobCount: 245 },
      { id: '2', name: 'Financial Services', jobCount: 189 },
      { id: '3', name: 'Banking', jobCount: 156 },
      { id: '4', name: 'Security & Safety', jobCount: 98 },
      { id: '5', name: 'Training', jobCount: 75 },
      { id: '6', name: 'Public Service', jobCount: 134 },
      { id: '7', name: 'Real Estate', jobCount: 89 },
      { id: '8', name: 'Independent & Freelance', jobCount: 267 },
      { id: '9', name: 'IT & Telecoms', jobCount: 345 },
      { id: '10', name: 'Marketing & Communication', jobCount: 198 }
    ];
    return of(categories);
  }

  getLocations(): Observable<Location[]> {
    const locations: Location[] = [
      { id: '1', name: 'New York City', country: 'USA', jobCount: 456 },
      { id: '2', name: 'Los Angeles', country: 'USA', jobCount: 389 },
      { id: '3', name: 'Chicago', country: 'USA', jobCount: 312 },
      { id: '4', name: 'Remote', country: 'Worldwide', jobCount: 789 },
      { id: '5', name: 'San Francisco', country: 'USA', jobCount: 445 },
      { id: '6', name: 'Boston', country: 'USA', jobCount: 234 },
      { id: '7', name: 'Seattle', country: 'USA', jobCount: 367 },
      { id: '8', name: 'Austin', country: 'USA', jobCount: 298 }
    ];
    return of(locations);
  }

  private generateMockJobs(): Job[] {
    const jobs: Job[] = [];
    const companies = ['TechCorp', 'InnovateTech', 'DataMinds', 'CloudTech', 'DesignHub'];
    const locations = ['New York, NY', 'San Francisco, CA', 'Remote', 'Austin, TX', 'Seattle, WA'];
    const categories = ['Engineering', 'Marketing', 'Design', 'Sales', 'Product'];
    const types = [JobType.FULL_TIME, JobType.PART_TIME, JobType.CONTRACT, JobType.INTERNSHIP];

    for (let i = 1; i <= 50; i++) {
      const companyName = companies[Math.floor(Math.random() * companies.length)];
      jobs.push({
        id: i.toString(),
        title: this.getRandomJobTitle(),
        company: {
          id: Math.ceil(i / 10).toString(),
          name: companyName,
          logo: `https://ui-avatars.com/api/?name=${companyName}&background=${this.getRandomColor()}&color=fff`,
          description: `${companyName} is a leading technology company focused on innovation and excellence.`,
          culture: 'We foster a culture of innovation, collaboration, and continuous learning.'
        },
        location: locations[Math.floor(Math.random() * locations.length)],
        type: types[Math.floor(Math.random() * types.length)],
        salary: Math.random() > 0.3 ? {
          min: Math.floor(Math.random() * 50000) + 50000,
          max: Math.floor(Math.random() * 100000) + 100000,
          currency: 'USD'
        } : undefined,
        description: 'We are looking for a talented professional to join our growing team. In this role, you will have the opportunity to work on exciting projects and make a real impact on our products and services. You will collaborate with cross-functional teams to deliver high-quality solutions that meet our customers\' needs.',
        requirements: [
          '3+ years of relevant experience',
          'Bachelor\'s degree in related field or equivalent experience',
          'Strong communication and collaboration skills',
          'Problem-solving mindset and attention to detail',
          'Ability to work in a fast-paced environment'
        ],
        responsibilities: [
          'Design and implement scalable solutions',
          'Collaborate with cross-functional teams',
          'Participate in code reviews and technical discussions',
          'Mentor junior team members',
          'Contribute to product roadmap and strategy'
        ],
        benefits: [
          'Comprehensive health, dental, and vision insurance',
          '401(k) with company match',
          'Flexible work arrangements',
          'Professional development budget',
          'Unlimited PTO',
          'Stock options'
        ],
        skills: this.getRandomSkills(),
        experienceLevel: this.getRandomExperienceLevel(),
        qualifications: {
          education: 'Bachelor\'s degree in Computer Science, Engineering, or related field',
          experience: '3-5 years of professional experience',
          certifications: ['AWS Certified', 'PMP', 'Scrum Master']
        },
        workEnvironment: {
          type: Math.random() > 0.5 ? 'Hybrid' : 'Remote',
          schedule: 'Flexible hours',
          teamSize: '10-20',
          travelRequired: Math.random() > 0.8
        },
        postedDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
        applicationDeadline: new Date(Date.now() + Math.random() * 60 * 24 * 60 * 60 * 1000),
        category: categories[Math.floor(Math.random() * categories.length)],
        isPremium: Math.random() > 0.7,
        isUrgent: Math.random() > 0.9,
        views: Math.floor(Math.random() * 1000),
        applications: Math.floor(Math.random() * 50),
        hiringManager: this.getRandomHiringManager()
      });
    }

    return jobs;
  }

  private getRandomJobTitle(): string {
    const titles = [
      'Senior Frontend Developer',
      'Product Manager',
      'UX Designer',
      'Data Scientist',
      'Marketing Director',
      'DevOps Engineer',
      'Sales Executive',
      'Content Writer',
      'Business Analyst',
      'Full Stack Developer',
      'Project Manager',
      'Customer Success Manager',
      'Software Engineer',
      'Graphic Designer',
      'HR Manager'
    ];
    return titles[Math.floor(Math.random() * titles.length)];
  }

  private getRandomSkills(): string[] {
    const allSkills = [
      'JavaScript', 'TypeScript', 'React', 'Angular', 'Vue.js', 'Node.js',
      'Python', 'Java', 'C#', 'SQL', 'MongoDB', 'AWS', 'Docker', 'Kubernetes',
      'Git', 'CI/CD', 'Agile', 'Scrum', 'REST APIs', 'GraphQL'
    ];
    const numSkills = Math.floor(Math.random() * 5) + 3;
    const skills: string[] = [];
    for (let i = 0; i < numSkills; i++) {
      const skill = allSkills[Math.floor(Math.random() * allSkills.length)];
      if (!skills.includes(skill)) {
        skills.push(skill);
      }
    }
    return skills;
  }

  private getRandomExperienceLevel(): string {
    const levels = ['Entry Level', 'Mid Level', 'Senior Level', 'Lead', 'Executive'];
    return levels[Math.floor(Math.random() * levels.length)];
  }

  private getRandomHiringManager(): string {
    const managers = ['John Smith', 'Sarah Johnson', 'Michael Chen', 'Emily Davis', 'Robert Wilson'];
    return managers[Math.floor(Math.random() * managers.length)];
  }

  private getRandomColor(): string {
    const colors = ['4f46e5', '10b981', 'ec4899', 'f59e0b', '8b5cf6', '06b6d4', 'ef4444'];
    return colors[Math.floor(Math.random() * colors.length)];
  }
}
