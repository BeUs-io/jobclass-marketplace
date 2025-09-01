import { Injectable, signal } from '@angular/core';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { FreelanceService, Project, Order, Proposal, FreelancerProfile } from '../models/freelance.model';

@Injectable({
  providedIn: 'root'
})
export class FreelanceMarketplaceService {
  private freelanceServices: FreelanceService[] = [
    {
      id: '1',
      freelancerId: 'f1',
      freelancerName: 'Sarah Design Pro',
      freelancerAvatar: 'SD',
      freelancerRating: 4.9,
      freelancerReviews: 287,
      title: 'I will design a professional logo for your business',
      description: 'Get a unique, professional logo that represents your brand perfectly. I specialize in modern, minimalist designs that work across all platforms.',
      shortDescription: 'Professional logo design with unlimited revisions',
      category: 'Graphics & Design',
      subcategory: 'Logo Design',
      tags: ['logo', 'branding', 'design', 'business', 'professional'],
      images: ['https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400'],
      packages: [
        {
          id: 'basic',
          name: 'basic',
          title: 'Basic Logo',
          description: '1 Logo concept, 1 revision, source files',
          price: 25,
          deliveryTime: 2,
          deliveryUnit: 'days',
          revisions: 1,
          features: ['1 Logo concept', '1 Revision', 'PNG + JPG files', '48h delivery']
        },
        {
          id: 'standard',
          name: 'standard',
          title: 'Standard Package',
          description: '3 Logo concepts, 3 revisions, source files + social kit',
          price: 50,
          deliveryTime: 3,
          deliveryUnit: 'days',
          revisions: 3,
          features: ['3 Logo concepts', '3 Revisions', 'All source files', 'Social media kit', 'Commercial license']
        },
        {
          id: 'premium',
          name: 'premium',
          title: 'Premium Branding',
          description: '5 concepts, unlimited revisions, full brand package',
          price: 100,
          deliveryTime: 5,
          deliveryUnit: 'days',
          revisions: -1,
          features: ['5 Logo concepts', 'Unlimited revisions', 'Complete brand package', 'Business card design', 'Letterhead design', 'Brand guidelines']
        }
      ],
      addOns: [
        {
          id: 'rush',
          title: '24h Express Delivery',
          description: 'Get your logo in 24 hours',
          price: 20,
          deliveryTime: 1,
          deliveryUnit: 'days'
        },
        {
          id: 'extra-concepts',
          title: '2 Extra Concepts',
          description: 'Get 2 additional logo concepts',
          price: 15,
          deliveryTime: 0,
          deliveryUnit: 'days'
        }
      ],
      pricing: { startingPrice: 25, currency: 'USD' },
      deliveryTime: { min: 2, max: 5, unit: 'days' },
      revisions: 3,
      featured: true,
      verified: true,
      level: 'top-rated',
      totalOrders: 587,
      inQueue: 3,
      languages: ['English', 'Spanish'],
      skills: ['Logo Design', 'Branding', 'Adobe Illustrator', 'Photoshop'],
      createdAt: new Date('2023-01-15'),
      updatedAt: new Date(),
      status: 'active',
      faq: [
        {
          question: 'What do you need from me to get started?',
          answer: 'Your business name, industry, and any style preferences you have.'
        },
        {
          question: 'Do you provide source files?',
          answer: 'Yes, all packages include source files in AI, PSD, and EPS formats.'
        }
      ],
      requirements: ['Business name', 'Industry/business type', 'Color preferences (if any)', 'Style preferences']
    },
    {
      id: '2',
      freelancerId: 'f2',
      freelancerName: 'Alex WebDev',
      freelancerAvatar: 'AW',
      freelancerRating: 4.8,
      freelancerReviews: 156,
      title: 'I will develop a responsive WordPress website',
      description: 'Custom WordPress development with modern design and full responsiveness. SEO optimized and mobile-ready.',
      shortDescription: 'Custom WordPress website development',
      category: 'Programming & Tech',
      subcategory: 'Website Development',
      tags: ['wordpress', 'website', 'responsive', 'development', 'custom'],
      images: ['https://images.unsplash.com/photo-1547658719-da2b51169166?w=400'],
      packages: [
        {
          id: 'basic',
          name: 'basic',
          title: 'Basic Website',
          description: '5-page WordPress site with basic customization',
          price: 200,
          deliveryTime: 7,
          deliveryUnit: 'days',
          revisions: 2,
          features: ['5 pages', 'Responsive design', 'Basic SEO', 'Contact form']
        },
        {
          id: 'standard',
          name: 'standard',
          title: 'Business Website',
          description: '10-page site with advanced features and customization',
          price: 400,
          deliveryTime: 14,
          deliveryUnit: 'days',
          revisions: 3,
          features: ['10 pages', 'Custom design', 'Advanced SEO', 'E-commerce ready', 'Analytics setup']
        },
        {
          id: 'premium',
          name: 'premium',
          title: 'Enterprise Solution',
          description: 'Unlimited pages with premium features and support',
          price: 800,
          deliveryTime: 21,
          deliveryUnit: 'days',
          revisions: 5,
          features: ['Unlimited pages', 'Premium design', 'Full e-commerce', 'Performance optimization', '30-day support']
        }
      ],
      addOns: [],
      pricing: { startingPrice: 200, currency: 'USD' },
      deliveryTime: { min: 7, max: 21, unit: 'days' },
      revisions: 3,
      featured: true,
      verified: true,
      level: 'level-2',
      totalOrders: 234,
      inQueue: 5,
      languages: ['English'],
      skills: ['WordPress', 'PHP', 'JavaScript', 'HTML/CSS', 'React'],
      createdAt: new Date('2023-03-20'),
      updatedAt: new Date(),
      status: 'active',
      faq: [],
      requirements: ['Website content', 'Design preferences', 'Required features list']
    },
    {
      id: '3',
      freelancerId: 'f3',
      freelancerName: 'Emma Content Writer',
      freelancerAvatar: 'EC',
      freelancerRating: 4.7,
      freelancerReviews: 423,
      title: 'I will write SEO optimized blog posts and articles',
      description: 'High-quality, engaging content that ranks. I specialize in blog posts, articles, and web content that drives traffic.',
      shortDescription: 'SEO-optimized content writing',
      category: 'Writing & Translation',
      subcategory: 'Content Writing',
      tags: ['content writing', 'SEO', 'blog', 'articles', 'copywriting'],
      images: ['https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400'],
      packages: [
        {
          id: 'basic',
          name: 'basic',
          title: 'Basic Article',
          description: '500-word SEO article with keyword research',
          price: 35,
          deliveryTime: 2,
          deliveryUnit: 'days',
          revisions: 1,
          features: ['500 words', 'SEO optimized', '1 revision', 'Keyword research']
        },
        {
          id: 'standard',
          name: 'standard',
          title: 'Standard Blog Post',
          description: '1000-word in-depth article with images',
          price: 65,
          deliveryTime: 3,
          deliveryUnit: 'days',
          revisions: 2,
          features: ['1000 words', 'SEO optimized', '2 revisions', 'Meta description', 'Topic research', '2 images']
        },
        {
          id: 'premium',
          name: 'premium',
          title: 'Premium Content',
          description: '2000-word comprehensive guide with full optimization',
          price: 125,
          deliveryTime: 5,
          deliveryUnit: 'days',
          revisions: 3,
          features: ['2000 words', 'Full SEO', '3 revisions', 'Competitor analysis', 'Internal linking', 'Images & infographics']
        }
      ],
      addOns: [],
      pricing: { startingPrice: 35, currency: 'USD' },
      deliveryTime: { min: 2, max: 5, unit: 'days' },
      revisions: 2,
      featured: false,
      verified: true,
      level: 'level-2',
      totalOrders: 892,
      inQueue: 7,
      languages: ['English'],
      skills: ['Content Writing', 'SEO', 'Copywriting', 'Blog Writing', 'Research'],
      createdAt: new Date('2022-11-10'),
      updatedAt: new Date(),
      status: 'active',
      faq: [],
      requirements: ['Topic or title', 'Target keywords', 'Target audience', 'Tone preference']
    }
  ];

  private projects: Project[] = [
    {
      id: 'p1',
      clientId: 'c1',
      clientName: 'TechStartup Inc',
      clientAvatar: 'TS',
      clientRating: 4.7,
      clientReviews: 23,
      title: 'Mobile App UI/UX Design for Fintech Startup',
      description: 'We need a modern, user-friendly mobile app design for our fintech startup. The app should include user onboarding, dashboard, transaction history, and payment features.',
      category: 'Design',
      subcategory: 'Mobile App Design',
      skillsRequired: ['UI/UX Design', 'Mobile Design', 'Figma', 'Sketch', 'Prototyping'],
      budget: { type: 'fixed', min: 2000, max: 3500, currency: 'USD' },
      duration: { estimated: 3, unit: 'weeks' },
      location: 'remote',
      experienceLevel: 'expert',
      proposals: 12,
      status: 'open',
      postedAt: new Date('2024-08-20'),
      deadline: new Date('2024-09-15'),
      attachments: [],
      paymentVerified: true,
      featured: true,
      urgent: false,
      clientHistory: {
        totalSpent: 15000,
        projectsPosted: 8,
        hireRate: 85
      }
    },
    {
      id: 'p2',
      clientId: 'c2',
      clientName: 'Local Business Co',
      clientAvatar: 'LB',
      clientRating: 4.3,
      clientReviews: 7,
      title: 'Content Writing for E-commerce Website',
      description: 'Need product descriptions and blog content for our e-commerce website. 50 product descriptions and 10 blog posts required.',
      category: 'Writing',
      subcategory: 'Content Writing',
      skillsRequired: ['Content Writing', 'SEO Writing', 'E-commerce', 'Blog Writing'],
      budget: { type: 'fixed', min: 500, max: 800, currency: 'USD' },
      duration: { estimated: 2, unit: 'weeks' },
      location: 'remote',
      experienceLevel: 'intermediate',
      proposals: 8,
      status: 'open',
      postedAt: new Date('2024-08-25'),
      attachments: [],
      paymentVerified: true,
      featured: false,
      urgent: true,
      clientHistory: {
        totalSpent: 2500,
        projectsPosted: 3,
        hireRate: 100
      }
    },
    {
      id: 'p3',
      clientId: 'c3',
      clientName: 'Global Corp',
      clientAvatar: 'GC',
      clientRating: 4.9,
      clientReviews: 45,
      title: 'Full Stack Developer for SaaS Platform',
      description: 'Looking for an experienced full-stack developer to help build our SaaS platform. Must have experience with React, Node.js, and AWS.',
      category: 'Development',
      subcategory: 'Web Development',
      skillsRequired: ['React', 'Node.js', 'AWS', 'PostgreSQL', 'TypeScript'],
      budget: { type: 'hourly', min: 50, max: 80, currency: 'USD' },
      duration: { estimated: 3, unit: 'months' },
      location: 'remote',
      experienceLevel: 'expert',
      proposals: 18,
      status: 'open',
      postedAt: new Date('2024-08-22'),
      attachments: [],
      paymentVerified: true,
      featured: true,
      urgent: false,
      clientHistory: {
        totalSpent: 45000,
        projectsPosted: 15,
        hireRate: 92
      }
    }
  ];

  private orders: Order[] = [
    {
      id: 'o1',
      serviceId: '1',
      freelancerId: 'f1',
      clientId: 'c1',
      freelancerName: 'Sarah Design Pro',
      clientName: 'TechStartup Inc',
      title: 'Professional Logo Design - Standard Package',
      description: 'Logo design for TechStartup Inc with 3 concepts and revisions',
      package: {
        id: 'standard',
        name: 'standard',
        title: 'Standard Package',
        description: '3 Logo concepts, 3 revisions, source files + social kit',
        price: 50,
        deliveryTime: 3,
        deliveryUnit: 'days',
        revisions: 3,
        features: ['3 Logo concepts', '3 Revisions', 'All source files', 'Social media kit']
      },
      totalAmount: 50,
      currency: 'USD',
      status: 'active',
      deliveryDate: new Date('2024-09-05'),
      startDate: new Date('2024-09-01'),
      requirements: [
        { question: 'What is your business name?', answer: 'TechStartup Inc', required: true },
        { question: 'What industry are you in?', answer: 'Technology/Software', required: true },
        { question: 'Color preferences?', answer: 'Blue and white', required: false }
      ],
      deliverables: [],
      revisions: [],
      messages: [
        {
          id: 'm1',
          senderId: 'f1',
          senderType: 'freelancer',
          message: 'Hi! I\'ve started working on your logo. I\'ll have the first concepts ready soon.',
          timestamp: new Date('2024-09-01T10:00:00Z')
        }
      ],
      paymentStatus: 'escrowed'
    }
  ];

  private serviceCategories = [
    {
      name: 'Graphics & Design',
      subcategories: ['Logo Design', 'Brand Style Guides', 'Web Design', 'App Design', 'Print Design']
    },
    {
      name: 'Programming & Tech',
      subcategories: ['Website Development', 'Mobile Apps', 'Desktop Applications', 'E-commerce', 'Database']
    },
    {
      name: 'Digital Marketing',
      subcategories: ['Social Media Marketing', 'SEO', 'Content Marketing', 'Email Marketing', 'PPC']
    },
    {
      name: 'Writing & Translation',
      subcategories: ['Content Writing', 'Copywriting', 'Technical Writing', 'Translation', 'Proofreading']
    },
    {
      name: 'Video & Animation',
      subcategories: ['Video Editing', 'Animation', 'Intro Videos', 'Explainer Videos', 'Whiteboard Animation']
    }
  ];

  // Observable properties
  currentUserMode = signal<'job-seeker' | 'freelancer' | 'employer' | 'client'>('job-seeker');

  constructor() {}

  // User Mode Management
  setUserMode(mode: 'job-seeker' | 'freelancer' | 'employer' | 'client'): void {
    this.currentUserMode.set(mode);
  }

  getUserMode(): 'job-seeker' | 'freelancer' | 'employer' | 'client' {
    return this.currentUserMode();
  }

  // Freelance Services
  getFreelanceServices(category?: string, subcategory?: string): Observable<FreelanceService[]> {
    let filtered = this.freelanceServices;

    if (category) {
      filtered = filtered.filter(service => service.category === category);
    }

    if (subcategory) {
      filtered = filtered.filter(service => service.subcategory === subcategory);
    }

    return of(filtered).pipe(delay(500));
  }

  getFreelanceServiceById(id: string): Observable<FreelanceService | undefined> {
    return of(this.freelanceServices.find(service => service.id === id)).pipe(delay(300));
  }

  getFeaturedServices(): Observable<FreelanceService[]> {
    return of(this.freelanceServices.filter(service => service.featured)).pipe(delay(300));
  }

  searchFreelanceServices(query: string): Observable<FreelanceService[]> {
    const filtered = this.freelanceServices.filter(service =>
      service.title.toLowerCase().includes(query.toLowerCase()) ||
      service.description.toLowerCase().includes(query.toLowerCase()) ||
      service.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
    );
    return of(filtered).pipe(delay(400));
  }

  // Projects
  getProjects(category?: string): Observable<Project[]> {
    let filtered = this.projects;

    if (category) {
      filtered = filtered.filter(project => project.category === category);
    }

    return of(filtered).pipe(delay(500));
  }

  getProjectById(id: string): Observable<Project | undefined> {
    return of(this.projects.find(project => project.id === id)).pipe(delay(300));
  }

  getFeaturedProjects(): Observable<Project[]> {
    return of(this.projects.filter(project => project.featured)).pipe(delay(300));
  }

  searchProjects(query: string): Observable<Project[]> {
    const filtered = this.projects.filter(project =>
      project.title.toLowerCase().includes(query.toLowerCase()) ||
      project.description.toLowerCase().includes(query.toLowerCase()) ||
      project.skillsRequired.some(skill => skill.toLowerCase().includes(query.toLowerCase()))
    );
    return of(filtered).pipe(delay(400));
  }

  postProject(project: Partial<Project>): Observable<Project> {
    const newProject: Project = {
      id: Date.now().toString(),
      clientId: 'current-user',
      clientName: 'Current User',
      clientAvatar: 'CU',
      clientRating: 0,
      clientReviews: 0,
      proposals: 0,
      status: 'open',
      postedAt: new Date(),
      paymentVerified: false,
      featured: false,
      urgent: false,
      clientHistory: {
        totalSpent: 0,
        projectsPosted: 1,
        hireRate: 0
      },
      ...project
    } as Project;

    this.projects.unshift(newProject);
    return of(newProject).pipe(delay(800));
  }

  // Orders
  getOrders(userId: string, userType: 'freelancer' | 'client'): Observable<Order[]> {
    const filtered = this.orders.filter(order => {
      if (userType === 'freelancer') {
        return order.freelancerId === userId;
      } else {
        return order.clientId === userId;
      }
    });
    return of(filtered).pipe(delay(500));
  }

  getOrderById(id: string): Observable<Order | undefined> {
    return of(this.orders.find(order => order.id === id)).pipe(delay(300));
  }

  createOrder(serviceId: string, packageType: string, requirements: any): Observable<Order> {
    const service = this.freelanceServices.find(s => s.id === serviceId);
    const packageInfo = service?.packages.find(p => p.name === packageType);

    if (!service || !packageInfo) {
      throw new Error('Service or package not found');
    }

    const newOrder: Order = {
      id: Date.now().toString(),
      serviceId,
      freelancerId: service.freelancerId,
      clientId: 'current-user',
      freelancerName: service.freelancerName,
      clientName: 'Current User',
      title: service.title,
      description: `${service.title} - ${packageInfo.title}`,
      package: packageInfo,
      totalAmount: packageInfo.price,
      currency: 'USD',
      status: 'pending',
      deliveryDate: new Date(Date.now() + packageInfo.deliveryTime * 24 * 60 * 60 * 1000),
      startDate: new Date(),
      requirements: Object.entries(requirements).map(([question, answer]) => ({
        question,
        answer: answer as string,
        required: true
      })),
      deliverables: [],
      revisions: [],
      messages: [],
      paymentStatus: 'pending'
    };

    this.orders.unshift(newOrder);
    return of(newOrder).pipe(delay(1000));
  }

  // Categories
  getServiceCategories(): Observable<any[]> {
    return of(this.serviceCategories).pipe(delay(200));
  }

  // Dashboard stats
  getFreelancerStats(freelancerId: string): Observable<any> {
    const orders = this.orders.filter(o => o.freelancerId === freelancerId);
    const stats = {
      totalEarnings: orders.reduce((sum, order) => sum + order.totalAmount, 0),
      activeOrders: orders.filter(o => o.status === 'active').length,
      completedOrders: orders.filter(o => o.status === 'completed').length,
      avgRating: 4.8,
      responseTime: '1 hour',
      completionRate: 98,
      monthlyEarnings: 2500,
      pendingClearance: 450
    };
    return of(stats).pipe(delay(400));
  }

  getClientStats(clientId: string): Observable<any> {
    const orders = this.orders.filter(o => o.clientId === clientId);
    const stats = {
      totalSpent: orders.reduce((sum, order) => sum + order.totalAmount, 0),
      activeProjects: this.projects.filter(p => p.clientId === clientId && p.status === 'open').length,
      completedProjects: orders.filter(o => o.status === 'completed').length,
      avgRating: 4.6,
      totalHires: 12,
      openProjects: 3
    };
    return of(stats).pipe(delay(400));
  }
}
