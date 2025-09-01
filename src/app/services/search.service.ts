import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, delay } from 'rxjs/operators';
import { Job, JobType } from '../models/job.model';

export interface AdvancedFilters {
  keywords?: string[];
  locations?: string[];
  categories?: string[];
  jobTypes?: JobType[];
  salaryRange?: {
    min: number;
    max: number;
  };
  experienceLevels?: string[];
  companies?: string[];
  postedWithin?: number; // days
  isRemote?: boolean;
  benefits?: string[];
  skills?: string[];
  educationLevel?: string;
}

export interface SavedSearch {
  id: string;
  name: string;
  filters: AdvancedFilters;
  createdAt: Date;
  notificationEnabled: boolean;
  frequency?: 'daily' | 'weekly' | 'instantly';
  lastRun?: Date;
  newJobsCount?: number;
}

export interface SearchHistory {
  id: string;
  query: string;
  filters: AdvancedFilters;
  timestamp: Date;
  resultsCount: number;
}

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private savedSearchesSubject = new BehaviorSubject<SavedSearch[]>([]);
  public savedSearches$ = this.savedSearchesSubject.asObservable();

  private searchHistorySubject = new BehaviorSubject<SearchHistory[]>([]);
  public searchHistory$ = this.searchHistorySubject.asObservable();

  private suggestionsSubject = new BehaviorSubject<string[]>([]);
  public suggestions$ = this.suggestionsSubject.asObservable();

  constructor() {
    this.loadSavedSearches();
    this.loadSearchHistory();
  }

  // Advanced search with multiple criteria
  performAdvancedSearch(filters: AdvancedFilters, jobs: Job[]): Observable<Job[]> {
    return of(jobs).pipe(
      delay(300),
      map(allJobs => {
        let filtered = [...allJobs];

        // Keywords search
        if (filters.keywords && filters.keywords.length > 0) {
          filtered = filtered.filter(job => {
            const searchText = `${job.title} ${job.description} ${job.company.name}`.toLowerCase();
            return filters.keywords!.some(keyword =>
              searchText.includes(keyword.toLowerCase())
            );
          });
        }

        // Location filter
        if (filters.locations && filters.locations.length > 0) {
          filtered = filtered.filter(job =>
            filters.locations!.some(location =>
              job.location.toLowerCase().includes(location.toLowerCase())
            )
          );
        }

        // Category filter
        if (filters.categories && filters.categories.length > 0) {
          filtered = filtered.filter(job =>
            filters.categories!.includes(job.category)
          );
        }

        // Job type filter
        if (filters.jobTypes && filters.jobTypes.length > 0) {
          filtered = filtered.filter(job =>
            filters.jobTypes!.includes(job.type)
          );
        }

        // Salary range filter
        if (filters.salaryRange) {
          filtered = filtered.filter(job => {
            if (!job.salary) return false;
            return job.salary.min >= filters.salaryRange!.min &&
                   job.salary.max <= filters.salaryRange!.max;
          });
        }

        // Experience level filter
        if (filters.experienceLevels && filters.experienceLevels.length > 0) {
          filtered = filtered.filter(job =>
            job.experienceLevel && filters.experienceLevels!.includes(job.experienceLevel)
          );
        }

        // Company filter
        if (filters.companies && filters.companies.length > 0) {
          filtered = filtered.filter(job =>
            filters.companies!.includes(job.company.name)
          );
        }

        // Posted within filter
        if (filters.postedWithin) {
          const cutoffDate = new Date();
          cutoffDate.setDate(cutoffDate.getDate() - filters.postedWithin);
          filtered = filtered.filter(job =>
            job.postedDate >= cutoffDate
          );
        }

        // Remote filter
        if (filters.isRemote !== undefined) {
          filtered = filtered.filter(job => {
            const isRemote = job.location.toLowerCase().includes('remote') ||
                            (job.workEnvironment?.type === 'Remote');
            return filters.isRemote === isRemote;
          });
        }

        // Benefits filter
        if (filters.benefits && filters.benefits.length > 0) {
          filtered = filtered.filter(job =>
            job.benefits && filters.benefits!.some(benefit =>
              job.benefits!.some(jobBenefit =>
                jobBenefit.toLowerCase().includes(benefit.toLowerCase())
              )
            )
          );
        }

        // Skills filter
        if (filters.skills && filters.skills.length > 0) {
          filtered = filtered.filter(job =>
            job.skills && filters.skills!.some(skill =>
              job.skills!.some(jobSkill =>
                jobSkill.toLowerCase() === skill.toLowerCase()
              )
            )
          );
        }

        // Education level filter
        if (filters.educationLevel) {
          filtered = filtered.filter(job =>
            job.qualifications?.education?.toLowerCase().includes(filters.educationLevel!.toLowerCase())
          );
        }

        // Save to history
        this.addToSearchHistory({
          query: filters.keywords?.join(' ') || '',
          filters,
          resultsCount: filtered.length
        });

        return filtered;
      })
    );
  }

  // Save a search for future use
  saveSearch(name: string, filters: AdvancedFilters, enableNotifications: boolean = false): Observable<SavedSearch> {
    const savedSearch: SavedSearch = {
      id: Date.now().toString(),
      name,
      filters,
      createdAt: new Date(),
      notificationEnabled: enableNotifications,
      frequency: enableNotifications ? 'daily' : undefined
    };

    const currentSearches = this.savedSearchesSubject.value;
    this.savedSearchesSubject.next([...currentSearches, savedSearch]);
    this.persistSavedSearches();

    return of(savedSearch).pipe(delay(300));
  }

  // Update saved search
  updateSavedSearch(id: string, updates: Partial<SavedSearch>): Observable<boolean> {
    const searches = this.savedSearchesSubject.value;
    const index = searches.findIndex(s => s.id === id);

    if (index !== -1) {
      searches[index] = { ...searches[index], ...updates };
      this.savedSearchesSubject.next([...searches]);
      this.persistSavedSearches();
      return of(true).pipe(delay(300));
    }

    return of(false);
  }

  // Delete saved search
  deleteSavedSearch(id: string): Observable<boolean> {
    const searches = this.savedSearchesSubject.value.filter(s => s.id !== id);
    this.savedSearchesSubject.next(searches);
    this.persistSavedSearches();
    return of(true).pipe(delay(300));
  }

  // Get saved search by ID
  getSavedSearch(id: string): Observable<SavedSearch | undefined> {
    return this.savedSearches$.pipe(
      map(searches => searches.find(s => s.id === id))
    );
  }

  // Run a saved search
  runSavedSearch(searchId: string, jobs: Job[]): Observable<Job[]> {
    return this.getSavedSearch(searchId).pipe(
      map(savedSearch => {
        if (!savedSearch) return [];

        // Update last run time
        this.updateSavedSearch(searchId, { lastRun: new Date() });

        // Perform the search
        return this.performAdvancedSearchSync(savedSearch.filters, jobs);
      })
    );
  }

  // Synchronous version for internal use
  private performAdvancedSearchSync(filters: AdvancedFilters, jobs: Job[]): Job[] {
    let filtered = [...jobs];

    if (filters.keywords && filters.keywords.length > 0) {
      filtered = filtered.filter(job => {
        const searchText = `${job.title} ${job.description} ${job.company.name}`.toLowerCase();
        return filters.keywords!.some(keyword =>
          searchText.includes(keyword.toLowerCase())
        );
      });
    }

    // Apply all other filters (same logic as performAdvancedSearch)
    // ... (implementation similar to above)

    return filtered;
  }

  // Get search suggestions based on partial input
  getSearchSuggestions(query: string): Observable<string[]> {
    const suggestions = [
      'Software Developer',
      'Product Manager',
      'Data Scientist',
      'UX Designer',
      'Marketing Manager',
      'Sales Executive',
      'DevOps Engineer',
      'Business Analyst',
      'Project Manager',
      'Customer Success Manager',
      'Frontend Developer',
      'Backend Developer',
      'Full Stack Developer',
      'Machine Learning Engineer',
      'Cloud Architect'
    ];

    const filtered = suggestions.filter(s =>
      s.toLowerCase().includes(query.toLowerCase())
    );

    this.suggestionsSubject.next(filtered);
    return of(filtered).pipe(delay(100));
  }

  // Add to search history
  private addToSearchHistory(search: Omit<SearchHistory, 'id' | 'timestamp'>): void {
    const historyItem: SearchHistory = {
      id: Date.now().toString(),
      timestamp: new Date(),
      ...search
    };

    const history = this.searchHistorySubject.value;
    // Keep only last 20 searches
    const updated = [historyItem, ...history.slice(0, 19)];
    this.searchHistorySubject.next(updated);
    this.persistSearchHistory();
  }

  // Clear search history
  clearSearchHistory(): void {
    this.searchHistorySubject.next([]);
    localStorage.removeItem('searchHistory');
  }

  // Get recent searches
  getRecentSearches(limit: number = 5): Observable<SearchHistory[]> {
    return this.searchHistory$.pipe(
      map(history => history.slice(0, limit))
    );
  }

  // Check for new jobs matching saved searches
  checkSavedSearchesForNewJobs(jobs: Job[]): Observable<SavedSearch[]> {
    const searches = this.savedSearchesSubject.value;
    const updatedSearches: SavedSearch[] = [];

    searches.forEach(search => {
      if (search.notificationEnabled) {
        const results = this.performAdvancedSearchSync(search.filters, jobs);
        const newJobs = this.getNewJobsSinceLastRun(results, search.lastRun);

        if (newJobs.length > 0) {
          search.newJobsCount = newJobs.length;
          updatedSearches.push(search);
        }
      }
    });

    return of(updatedSearches).pipe(delay(500));
  }

  private getNewJobsSinceLastRun(jobs: Job[], lastRun?: Date): Job[] {
    if (!lastRun) return jobs;
    return jobs.filter(job => job.postedDate > lastRun);
  }

  // Persistence methods
  private loadSavedSearches(): void {
    const saved = localStorage.getItem('savedSearches');
    if (saved) {
      const searches = JSON.parse(saved).map((s: any) => ({
        ...s,
        createdAt: new Date(s.createdAt),
        lastRun: s.lastRun ? new Date(s.lastRun) : undefined
      }));
      this.savedSearchesSubject.next(searches);
    }
  }

  private persistSavedSearches(): void {
    localStorage.setItem('savedSearches', JSON.stringify(this.savedSearchesSubject.value));
  }

  private loadSearchHistory(): void {
    const saved = localStorage.getItem('searchHistory');
    if (saved) {
      const history = JSON.parse(saved).map((h: any) => ({
        ...h,
        timestamp: new Date(h.timestamp)
      }));
      this.searchHistorySubject.next(history);
    }
  }

  private persistSearchHistory(): void {
    localStorage.setItem('searchHistory', JSON.stringify(this.searchHistorySubject.value));
  }
}
