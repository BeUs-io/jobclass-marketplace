import { Injectable } from '@angular/core';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { delay, map } from 'rxjs/operators';

export interface PortfolioItem {
  id: string;
  userId: string;
  title: string;
  description: string;
  category: string;
  skills: string[];
  tools: string[];
  completedDate: Date;
  clientName?: string;
  projectUrl?: string;
  featured: boolean;
  visibility: 'public' | 'private' | 'clients-only';
  media: PortfolioMedia[];
  stats: PortfolioStats;
  testimonial?: Testimonial;
  createdAt: Date;
  updatedAt: Date;
  tags: string[];
  order: number;
}

export interface PortfolioMedia {
  id: string;
  type: 'image' | 'video' | 'document' | 'link' | 'embed';
  url: string;
  thumbnailUrl?: string;
  title: string;
  description?: string;
  fileSize?: number;
  mimeType?: string;
  dimensions?: { width: number; height: number };
  duration?: number; // for videos
  isPrimary: boolean;
  order: number;
}

export interface PortfolioStats {
  views: number;
  likes: number;
  shares: number;
  comments: number;
  inquiries: number;
}

export interface Testimonial {
  id: string;
  clientName: string;
  clientTitle?: string;
  clientCompany?: string;
  clientAvatar?: string;
  content: string;
  rating: number;
  verified: boolean;
  date: Date;
}

export interface PortfolioCollection {
  id: string;
  userId: string;
  name: string;
  description: string;
  coverImage?: string;
  items: string[]; // Portfolio item IDs
  visibility: 'public' | 'private' | 'unlisted';
  createdAt: Date;
  updatedAt: Date;
}

export interface FileUploadProgress {
  file: File;
  progress: number;
  status: 'pending' | 'uploading' | 'completed' | 'failed';
  error?: string;
  result?: PortfolioMedia;
}

@Injectable({
  providedIn: 'root'
})
export class PortfolioManagementService {
  private portfolioItems$ = new BehaviorSubject<PortfolioItem[]>([]);
  private collections$ = new BehaviorSubject<PortfolioCollection[]>([]);
  private uploadProgress$ = new BehaviorSubject<Map<string, FileUploadProgress>>(new Map());

  // Mock data
  private mockPortfolioItems: PortfolioItem[] = [
    {
      id: 'portfolio_1',
      userId: 'user_1',
      title: 'E-commerce Website Redesign',
      description: 'Complete redesign of an e-commerce platform with modern UI/UX principles, improving conversion rates by 35%.',
      category: 'Web Design',
      skills: ['UI/UX Design', 'Responsive Design', 'Prototyping', 'User Research'],
      tools: ['Figma', 'Adobe XD', 'Sketch', 'InVision'],
      completedDate: new Date('2024-07-15'),
      clientName: 'TechMart Inc.',
      projectUrl: 'https://techmart-demo.com',
      featured: true,
      visibility: 'public',
      media: [
        {
          id: 'media_1',
          type: 'image',
          url: 'https://via.placeholder.com/800x600',
          thumbnailUrl: 'https://via.placeholder.com/400x300',
          title: 'Homepage Design',
          description: 'Modern homepage with hero section and product showcase',
          isPrimary: true,
          order: 1,
          dimensions: { width: 1920, height: 1080 }
        },
        {
          id: 'media_2',
          type: 'image',
          url: 'https://via.placeholder.com/800x600',
          thumbnailUrl: 'https://via.placeholder.com/400x300',
          title: 'Product Page',
          isPrimary: false,
          order: 2,
          dimensions: { width: 1920, height: 1080 }
        }
      ],
      stats: {
        views: 1250,
        likes: 89,
        shares: 23,
        comments: 15,
        inquiries: 7
      },
      testimonial: {
        id: 'test_1',
        clientName: 'John Smith',
        clientTitle: 'CEO',
        clientCompany: 'TechMart Inc.',
        content: 'Exceptional work! The redesign exceeded our expectations and significantly improved our conversion rates.',
        rating: 5,
        verified: true,
        date: new Date('2024-07-20')
      },
      createdAt: new Date('2024-07-20'),
      updatedAt: new Date('2024-08-01'),
      tags: ['e-commerce', 'responsive', 'modern', 'conversion-optimization'],
      order: 1
    }
  ];

  private mockCollections: PortfolioCollection[] = [
    {
      id: 'collection_1',
      userId: 'user_1',
      name: 'Web Design Projects',
      description: 'Collection of my best web design work',
      coverImage: 'https://via.placeholder.com/400x300',
      items: ['portfolio_1', 'portfolio_2'],
      visibility: 'public',
      createdAt: new Date('2024-06-01'),
      updatedAt: new Date('2024-08-15')
    }
  ];

  constructor() {
    this.portfolioItems$.next(this.mockPortfolioItems);
    this.collections$.next(this.mockCollections);
  }

  // Portfolio Items Management
  getPortfolioItems(userId: string): Observable<PortfolioItem[]> {
    return this.portfolioItems$.pipe(
      map(items => items.filter(item => item.userId === userId))
    );
  }

  getPortfolioItem(itemId: string): Observable<PortfolioItem | undefined> {
    return this.portfolioItems$.pipe(
      map(items => items.find(item => item.id === itemId))
    );
  }

  createPortfolioItem(item: Partial<PortfolioItem>): Observable<PortfolioItem> {
    const newItem: PortfolioItem = {
      id: `portfolio_${Date.now()}`,
      userId: 'current_user',
      title: item.title || '',
      description: item.description || '',
      category: item.category || '',
      skills: item.skills || [],
      tools: item.tools || [],
      completedDate: item.completedDate || new Date(),
      featured: false,
      visibility: 'public',
      media: [],
      stats: {
        views: 0,
        likes: 0,
        shares: 0,
        comments: 0,
        inquiries: 0
      },
      createdAt: new Date(),
      updatedAt: new Date(),
      tags: item.tags || [],
      order: this.portfolioItems$.value.length + 1,
      ...item
    };

    const items = this.portfolioItems$.value;
    items.push(newItem);
    this.portfolioItems$.next(items);

    return of(newItem).pipe(delay(1000));
  }

  updatePortfolioItem(itemId: string, updates: Partial<PortfolioItem>): Observable<PortfolioItem | null> {
    const items = this.portfolioItems$.value;
    const index = items.findIndex(item => item.id === itemId);

    if (index > -1) {
      items[index] = {
        ...items[index],
        ...updates,
        updatedAt: new Date()
      };
      this.portfolioItems$.next(items);
      return of(items[index]).pipe(delay(800));
    }

    return of(null);
  }

  deletePortfolioItem(itemId: string): Observable<boolean> {
    const items = this.portfolioItems$.value;
    const index = items.findIndex(item => item.id === itemId);

    if (index > -1) {
      items.splice(index, 1);
      this.portfolioItems$.next(items);
      return of(true).pipe(delay(500));
    }

    return of(false);
  }

  // File Upload Management
  uploadFile(file: File, portfolioItemId: string): Observable<FileUploadProgress> {
    const uploadId = `upload_${Date.now()}`;
    const progress: FileUploadProgress = {
      file,
      progress: 0,
      status: 'pending'
    };

    // Update progress map
    const progressMap = this.uploadProgress$.value;
    progressMap.set(uploadId, progress);
    this.uploadProgress$.next(progressMap);

    // Simulate upload progress
    const progressInterval = setInterval(() => {
      progress.progress += 10;
      progress.status = 'uploading';

      if (progress.progress >= 100) {
        clearInterval(progressInterval);
        progress.status = 'completed';
        progress.result = {
          id: `media_${Date.now()}`,
          type: this.getMediaType(file.type),
          url: URL.createObjectURL(file),
          thumbnailUrl: URL.createObjectURL(file),
          title: file.name,
          fileSize: file.size,
          mimeType: file.type,
          isPrimary: false,
          order: 1
        };

        // Add media to portfolio item
        this.addMediaToPortfolioItem(portfolioItemId, progress.result);
      }

      progressMap.set(uploadId, progress);
      this.uploadProgress$.next(progressMap);
    }, 200);

    return of(progress).pipe(delay(2000));
  }

  uploadMultipleFiles(files: File[], portfolioItemId: string): Observable<FileUploadProgress[]> {
    const uploads = files.map(file => this.uploadFile(file, portfolioItemId));
    return of([]).pipe(delay(1000)); // Simplified for demo
  }

  deleteMedia(portfolioItemId: string, mediaId: string): Observable<boolean> {
    const items = this.portfolioItems$.value;
    const item = items.find(i => i.id === portfolioItemId);

    if (item) {
      const mediaIndex = item.media.findIndex(m => m.id === mediaId);
      if (mediaIndex > -1) {
        item.media.splice(mediaIndex, 1);
        this.portfolioItems$.next(items);
        return of(true).pipe(delay(500));
      }
    }

    return of(false);
  }

  reorderMedia(portfolioItemId: string, mediaIds: string[]): Observable<boolean> {
    const items = this.portfolioItems$.value;
    const item = items.find(i => i.id === portfolioItemId);

    if (item) {
      mediaIds.forEach((mediaId, index) => {
        const media = item.media.find(m => m.id === mediaId);
        if (media) {
          media.order = index + 1;
        }
      });

      item.media.sort((a, b) => a.order - b.order);
      this.portfolioItems$.next(items);
      return of(true).pipe(delay(300));
    }

    return of(false);
  }

  // Collections Management
  getCollections(userId: string): Observable<PortfolioCollection[]> {
    return this.collections$.pipe(
      map(collections => collections.filter(c => c.userId === userId))
    );
  }

  createCollection(collection: Partial<PortfolioCollection>): Observable<PortfolioCollection> {
    const newCollection: PortfolioCollection = {
      id: `collection_${Date.now()}`,
      userId: 'current_user',
      name: collection.name || '',
      description: collection.description || '',
      items: collection.items || [],
      visibility: collection.visibility || 'public',
      createdAt: new Date(),
      updatedAt: new Date(),
      ...collection
    };

    const collections = this.collections$.value;
    collections.push(newCollection);
    this.collections$.next(collections);

    return of(newCollection).pipe(delay(800));
  }

  addToCollection(collectionId: string, portfolioItemId: string): Observable<boolean> {
    const collections = this.collections$.value;
    const collection = collections.find(c => c.id === collectionId);

    if (collection && !collection.items.includes(portfolioItemId)) {
      collection.items.push(portfolioItemId);
      collection.updatedAt = new Date();
      this.collections$.next(collections);
      return of(true).pipe(delay(500));
    }

    return of(false);
  }

  removeFromCollection(collectionId: string, portfolioItemId: string): Observable<boolean> {
    const collections = this.collections$.value;
    const collection = collections.find(c => c.id === collectionId);

    if (collection) {
      const index = collection.items.indexOf(portfolioItemId);
      if (index > -1) {
        collection.items.splice(index, 1);
        collection.updatedAt = new Date();
        this.collections$.next(collections);
        return of(true).pipe(delay(500));
      }
    }

    return of(false);
  }

  // Analytics
  incrementPortfolioStats(itemId: string, stat: keyof PortfolioStats): Observable<boolean> {
    const items = this.portfolioItems$.value;
    const item = items.find(i => i.id === itemId);

    if (item) {
      item.stats[stat]++;
      this.portfolioItems$.next(items);
      return of(true).pipe(delay(200));
    }

    return of(false);
  }

  getPortfolioAnalytics(userId: string): Observable<any> {
    const items = this.portfolioItems$.value.filter(i => i.userId === userId);

    const analytics = {
      totalItems: items.length,
      totalViews: items.reduce((sum, item) => sum + item.stats.views, 0),
      totalLikes: items.reduce((sum, item) => sum + item.stats.likes, 0),
      totalInquiries: items.reduce((sum, item) => sum + item.stats.inquiries, 0),
      averageRating: 4.8,
      topCategories: this.getTopCategories(items),
      performanceByMonth: this.getPerformanceByMonth(items)
    };

    return of(analytics).pipe(delay(500));
  }

  // Private helper methods
  private addMediaToPortfolioItem(portfolioItemId: string, media: PortfolioMedia): void {
    const items = this.portfolioItems$.value;
    const item = items.find(i => i.id === portfolioItemId);

    if (item) {
      media.order = item.media.length + 1;
      item.media.push(media);
      this.portfolioItems$.next(items);
    }
  }

  private getMediaType(mimeType: string): 'image' | 'video' | 'document' | 'link' | 'embed' {
    if (mimeType.startsWith('image/')) return 'image';
    if (mimeType.startsWith('video/')) return 'video';
    if (mimeType.includes('pdf') || mimeType.includes('document')) return 'document';
    return 'document';
  }

  private getTopCategories(items: PortfolioItem[]): any[] {
    const categoryCount = new Map<string, number>();
    items.forEach(item => {
      categoryCount.set(item.category, (categoryCount.get(item.category) || 0) + 1);
    });

    return Array.from(categoryCount.entries())
      .map(([category, count]) => ({ category, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }

  private getPerformanceByMonth(items: PortfolioItem[]): any[] {
    // Mock monthly performance data
    return [
      { month: 'Jan', views: 450, inquiries: 12 },
      { month: 'Feb', views: 520, inquiries: 15 },
      { month: 'Mar', views: 680, inquiries: 18 },
      { month: 'Apr', views: 750, inquiries: 22 },
      { month: 'May', views: 890, inquiries: 28 },
      { month: 'Jun', views: 1050, inquiries: 32 }
    ];
  }
}
