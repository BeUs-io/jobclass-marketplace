export interface FreelanceService {
  id: string;
  freelancerId: string;
  freelancerName: string;
  freelancerAvatar: string;
  freelancerRating: number;
  freelancerReviews: number;
  title: string;
  description: string;
  shortDescription: string;
  category: string;
  subcategory: string;
  tags: string[];
  images: string[];
  video?: string;
  packages: ServicePackage[];
  addOns: AddOn[];
  pricing: {
    startingPrice: number;
    currency: string;
  };
  deliveryTime: {
    min: number;
    max: number;
    unit: 'hours' | 'days' | 'weeks';
  };
  revisions: number;
  featured: boolean;
  verified: boolean;
  level: 'new' | 'level-1' | 'level-2' | 'top-rated';
  totalOrders: number;
  inQueue: number;
  languages: string[];
  skills: string[];
  createdAt: Date;
  updatedAt: Date;
  status: 'active' | 'paused' | 'draft';
  faq: FAQ[];
  requirements: string[];
}

export interface ServicePackage {
  id: string;
  name: 'basic' | 'standard' | 'premium';
  title: string;
  description: string;
  price: number;
  deliveryTime: number;
  deliveryUnit: 'hours' | 'days' | 'weeks';
  revisions: number;
  features: string[];
}

export interface AddOn {
  id: string;
  title: string;
  description: string;
  price: number;
  deliveryTime: number;
  deliveryUnit: 'hours' | 'days' | 'weeks';
}

export interface FAQ {
  question: string;
  answer: string;
}

export interface Project {
  id: string;
  clientId: string;
  clientName: string;
  clientAvatar: string;
  clientRating: number;
  clientReviews: number;
  title: string;
  description: string;
  category: string;
  subcategory: string;
  skillsRequired: string[];
  budget: {
    type: 'fixed' | 'hourly';
    min: number;
    max: number;
    currency: string;
  };
  duration: {
    estimated: number;
    unit: 'hours' | 'days' | 'weeks' | 'months';
  };
  location: 'remote' | 'onsite' | 'hybrid';
  experienceLevel: 'entry' | 'intermediate' | 'expert';
  proposals: number;
  status: 'open' | 'in-progress' | 'completed' | 'cancelled';
  postedAt: Date;
  deadline?: Date;
  attachments: string[];
  paymentVerified: boolean;
  featured: boolean;
  urgent: boolean;
  clientHistory: {
    totalSpent: number;
    projectsPosted: number;
    hireRate: number;
  };
}

export interface Order {
  id: string;
  serviceId?: string;
  projectId?: string;
  freelancerId: string;
  clientId: string;
  freelancerName: string;
  clientName: string;
  title: string;
  description: string;
  package?: ServicePackage;
  addOns?: AddOn[];
  totalAmount: number;
  currency: string;
  status: 'pending' | 'active' | 'delivered' | 'revision' | 'completed' | 'cancelled';
  deliveryDate: Date;
  startDate: Date;
  completedDate?: Date;
  requirements: OrderRequirement[];
  deliverables: Deliverable[];
  revisions: Revision[];
  messages: OrderMessage[];
  milestones?: Milestone[];
  paymentStatus: 'pending' | 'escrowed' | 'released' | 'refunded';
  rating?: {
    freelancerRating: number;
    clientRating: number;
    freelancerReview: string;
    clientReview: string;
  };
}

export interface OrderRequirement {
  question: string;
  answer: string;
  required: boolean;
}

export interface Deliverable {
  id: string;
  filename: string;
  url: string;
  type: string;
  uploadedAt: Date;
  description?: string;
}

export interface Revision {
  id: string;
  requestedBy: 'client' | 'freelancer';
  description: string;
  requestedAt: Date;
  status: 'pending' | 'completed';
}

export interface OrderMessage {
  id: string;
  senderId: string;
  senderType: 'client' | 'freelancer';
  message: string;
  timestamp: Date;
  attachments?: string[];
}

export interface Milestone {
  id: string;
  title: string;
  description: string;
  amount: number;
  dueDate: Date;
  status: 'pending' | 'funded' | 'completed' | 'released';
}

export interface Proposal {
  id: string;
  projectId: string;
  freelancerId: string;
  freelancerName: string;
  freelancerAvatar: string;
  freelancerRating: number;
  coverLetter: string;
  proposedBudget: number;
  proposedTimeline: number;
  timelineUnit: 'hours' | 'days' | 'weeks';
  attachments: string[];
  submittedAt: Date;
  status: 'pending' | 'shortlisted' | 'hired' | 'rejected';
  clientViewed: boolean;
}

export interface FreelancerProfile {
  id: string;
  userId: string;
  title: string;
  overview: string;
  hourlyRate: number;
  currency: string;
  availability: 'available' | 'busy' | 'not-available';
  skills: string[];
  languages: Array<{
    language: string;
    proficiency: 'basic' | 'conversational' | 'fluent' | 'native';
  }>;
  portfolio: PortfolioItem[];
  certifications: Certification[];
  education: Education[];
  workHistory: WorkHistory[];
  earnings: {
    total: number;
    thisMonth: number;
    avgOrderValue: number;
  };
  stats: {
    totalOrders: number;
    completionRate: number;
    onTimeDelivery: number;
    responseTime: string;
  };
  level: 'new' | 'level-1' | 'level-2' | 'top-rated';
  badges: string[];
}

export interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  images: string[];
  video?: string;
  skills: string[];
  completedAt: Date;
}

export interface Certification {
  id: string;
  name: string;
  issuedBy: string;
  issuedDate: Date;
  expiryDate?: Date;
  credentialId?: string;
  credentialUrl?: string;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startYear: number;
  endYear?: number;
  current: boolean;
}

export interface WorkHistory {
  id: string;
  company: string;
  position: string;
  description: string;
  startDate: Date;
  endDate?: Date;
  current: boolean;
}
