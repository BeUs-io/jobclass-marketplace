export interface Job {
  id: string;
  title: string;
  company: Company;
  location: string;
  type: JobType;
  salary?: {
    min: number;
    max: number;
    currency: string;
  };
  description: string;
  requirements?: string[];
  responsibilities?: string[];
  benefits?: string[];
  postedDate: Date;
  applicationDeadline?: Date;
  category: string;
  isPremium?: boolean;
  isUrgent?: boolean;
  views?: number;
  applications?: number;
  skills?: string[];
  experienceLevel?: string;
  qualifications?: {
    education?: string;
    experience?: string;
    certifications?: string[];
  };
  workEnvironment?: {
    type?: string;
    schedule?: string;
    teamSize?: string;
    travelRequired?: boolean;
  };
  hiringManager?: string;
  isActive?: boolean;
}

export interface Company {
  id: string;
  name: string;
  logo?: string;
  website?: string;
  description?: string;
  size?: string;
  industry?: string;
  culture?: string;
}

export enum JobType {
  FULL_TIME = 'Full-time',
  PART_TIME = 'Part-time',
  CONTRACT = 'Contract',
  TEMPORARY = 'Temporary',
  INTERNSHIP = 'Internship',
  PERMANENT = 'Permanent',
  OPTIONAL = 'Optional'
}

export interface Category {
  id: string;
  name: string;
  icon?: string;
  jobCount: number;
}

export interface Location {
  id: string;
  name: string;
  state?: string;
  country: string;
  jobCount: number;
}
