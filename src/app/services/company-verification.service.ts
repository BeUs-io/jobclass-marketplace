import { Injectable, signal } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';

export interface CompanyVerification {
  id: string;
  companyId: string;
  companyName: string;
  status: 'pending' | 'verified' | 'rejected' | 'expired';
  submittedDate: Date;
  verifiedDate?: Date;
  expiryDate?: Date;
  documents: VerificationDocument[];
  verificationLevel: 'basic' | 'standard' | 'premium';
  verifiedBy?: string;
  rejectionReason?: string;
  businessInfo: BusinessInfo;
  contactInfo: ContactInfo;
  verificationChecks: VerificationCheck[];
}

export interface VerificationDocument {
  id: string;
  type: 'business_license' | 'tax_certificate' | 'incorporation' | 'utility_bill' | 'bank_statement' | 'other';
  name: string;
  url: string;
  uploadedDate: Date;
  status: 'pending' | 'approved' | 'rejected';
  notes?: string;
}

export interface BusinessInfo {
  legalName: string;
  tradingName?: string;
  registrationNumber: string;
  taxId: string;
  incorporationDate: Date;
  industry: string;
  employeeCount: string;
  annualRevenue?: string;
  website: string;
  headquarters: {
    address: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
  };
}

export interface ContactInfo {
  primaryContact: {
    name: string;
    title: string;
    email: string;
    phone: string;
  };
  hrContact?: {
    name: string;
    email: string;
    phone: string;
  };
  socialMedia?: {
    linkedin?: string;
    twitter?: string;
    facebook?: string;
  };
}

export interface VerificationCheck {
  type: 'document' | 'business_registry' | 'tax_verification' | 'website' | 'social_media' | 'reference';
  status: 'pending' | 'passed' | 'failed' | 'manual_review';
  completedDate?: Date;
  notes?: string;
  score?: number;
}

export interface VerificationStats {
  totalVerified: number;
  pendingVerifications: number;
  verificationRate: number;
  averageVerificationTime: number;
  rejectionRate: number;
  verificationByLevel: {
    basic: number;
    standard: number;
    premium: number;
  };
}

@Injectable({
  providedIn: 'root'
})
export class CompanyVerificationService {
  private verifications = signal<CompanyVerification[]>([
    {
      id: 'ver1',
      companyId: 'comp1',
      companyName: 'TechCorp Solutions',
      status: 'verified',
      submittedDate: new Date('2024-02-15'),
      verifiedDate: new Date('2024-02-18'),
      expiryDate: new Date('2025-02-18'),
      documents: [
        {
          id: 'doc1',
          type: 'business_license',
          name: 'Business License 2024.pdf',
          url: '#',
          uploadedDate: new Date('2024-02-15'),
          status: 'approved'
        },
        {
          id: 'doc2',
          type: 'tax_certificate',
          name: 'Tax Certificate.pdf',
          url: '#',
          uploadedDate: new Date('2024-02-15'),
          status: 'approved'
        }
      ],
      verificationLevel: 'premium',
      verifiedBy: 'Admin User',
      businessInfo: {
        legalName: 'TechCorp Solutions Inc.',
        tradingName: 'TechCorp',
        registrationNumber: 'TC2020-12345',
        taxId: '12-3456789',
        incorporationDate: new Date('2020-01-15'),
        industry: 'Technology',
        employeeCount: '100-500',
        annualRevenue: '$10M-$50M',
        website: 'https://techcorp.com',
        headquarters: {
          address: '123 Tech Street',
          city: 'San Francisco',
          state: 'CA',
          country: 'USA',
          postalCode: '94105'
        }
      },
      contactInfo: {
        primaryContact: {
          name: 'John Smith',
          title: 'CEO',
          email: 'john@techcorp.com',
          phone: '+1 555-0123'
        },
        hrContact: {
          name: 'Jane Doe',
          email: 'hr@techcorp.com',
          phone: '+1 555-0124'
        },
        socialMedia: {
          linkedin: 'https://linkedin.com/company/techcorp',
          twitter: 'https://twitter.com/techcorp'
        }
      },
      verificationChecks: [
        {
          type: 'document',
          status: 'passed',
          completedDate: new Date('2024-02-16'),
          score: 100
        },
        {
          type: 'business_registry',
          status: 'passed',
          completedDate: new Date('2024-02-17'),
          score: 95
        },
        {
          type: 'website',
          status: 'passed',
          completedDate: new Date('2024-02-17'),
          score: 100
        }
      ]
    },
    {
      id: 'ver2',
      companyId: 'comp2',
      companyName: 'StartupXYZ',
      status: 'pending',
      submittedDate: new Date('2024-03-18'),
      documents: [
        {
          id: 'doc3',
          type: 'incorporation',
          name: 'Certificate of Incorporation.pdf',
          url: '#',
          uploadedDate: new Date('2024-03-18'),
          status: 'pending'
        }
      ],
      verificationLevel: 'basic',
      businessInfo: {
        legalName: 'StartupXYZ LLC',
        registrationNumber: 'SXZ2023-98765',
        taxId: '98-7654321',
        incorporationDate: new Date('2023-06-01'),
        industry: 'Software',
        employeeCount: '10-50',
        website: 'https://startupxyz.com',
        headquarters: {
          address: '456 Startup Ave',
          city: 'Austin',
          state: 'TX',
          country: 'USA',
          postalCode: '78701'
        }
      },
      contactInfo: {
        primaryContact: {
          name: 'Mike Johnson',
          title: 'Founder',
          email: 'mike@startupxyz.com',
          phone: '+1 555-0125'
        }
      },
      verificationChecks: [
        {
          type: 'document',
          status: 'pending'
        },
        {
          type: 'business_registry',
          status: 'pending'
        }
      ]
    }
  ]);

  private stats = signal<VerificationStats>({
    totalVerified: 156,
    pendingVerifications: 23,
    verificationRate: 87.2,
    averageVerificationTime: 72, // hours
    rejectionRate: 8.5,
    verificationByLevel: {
      basic: 89,
      standard: 52,
      premium: 15
    }
  });

  constructor() {}

  getVerifications(): Observable<CompanyVerification[]> {
    return of(this.verifications());
  }

  getVerificationById(id: string): Observable<CompanyVerification | undefined> {
    return of(this.verifications().find(v => v.id === id));
  }

  getVerificationByCompanyId(companyId: string): Observable<CompanyVerification | undefined> {
    return of(this.verifications().find(v => v.companyId === companyId));
  }

  getVerificationStats(): Observable<VerificationStats> {
    return of(this.stats());
  }

  submitVerification(verification: Partial<CompanyVerification>): Observable<CompanyVerification> {
    const newVerification: CompanyVerification = {
      id: `ver${Date.now()}`,
      companyId: verification.companyId || '',
      companyName: verification.companyName || '',
      status: 'pending',
      submittedDate: new Date(),
      documents: verification.documents || [],
      verificationLevel: verification.verificationLevel || 'basic',
      businessInfo: verification.businessInfo!,
      contactInfo: verification.contactInfo!,
      verificationChecks: [
        { type: 'document', status: 'pending' },
        { type: 'business_registry', status: 'pending' },
        { type: 'website', status: 'pending' }
      ]
    };

    this.verifications.update(vers => [...vers, newVerification]);
    return of(newVerification).pipe(delay(500));
  }

  uploadDocument(verificationId: string, document: VerificationDocument): Observable<boolean> {
    const verifications = this.verifications();
    const index = verifications.findIndex(v => v.id === verificationId);

    if (index !== -1) {
      verifications[index].documents.push(document);
      this.verifications.set([...verifications]);
      return of(true).pipe(delay(500));
    }

    return of(false);
  }

  approveVerification(id: string, verifiedBy: string): Observable<boolean> {
    const verifications = this.verifications();
    const index = verifications.findIndex(v => v.id === id);

    if (index !== -1) {
      verifications[index].status = 'verified';
      verifications[index].verifiedDate = new Date();
      verifications[index].verifiedBy = verifiedBy;
      verifications[index].expiryDate = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000); // 1 year

      // Update all checks to passed
      verifications[index].verificationChecks.forEach(check => {
        check.status = 'passed';
        check.completedDate = new Date();
        check.score = 90 + Math.floor(Math.random() * 10);
      });

      this.verifications.set([...verifications]);

      // Update stats
      const stats = this.stats();
      stats.totalVerified++;
      stats.pendingVerifications--;
      this.stats.set(stats);

      return of(true).pipe(delay(500));
    }

    return of(false);
  }

  rejectVerification(id: string, reason: string): Observable<boolean> {
    const verifications = this.verifications();
    const index = verifications.findIndex(v => v.id === id);

    if (index !== -1) {
      verifications[index].status = 'rejected';
      verifications[index].rejectionReason = reason;

      this.verifications.set([...verifications]);

      // Update stats
      const stats = this.stats();
      stats.pendingVerifications--;
      this.stats.set(stats);

      return of(true).pipe(delay(500));
    }

    return of(false);
  }

  requestReverification(companyId: string): Observable<boolean> {
    const verifications = this.verifications();
    const index = verifications.findIndex(v => v.companyId === companyId);

    if (index !== -1) {
      verifications[index].status = 'pending';
      verifications[index].submittedDate = new Date();
      verifications[index].verificationChecks.forEach(check => {
        check.status = 'pending';
        check.completedDate = undefined;
      });

      this.verifications.set([...verifications]);
      return of(true).pipe(delay(500));
    }

    return of(false);
  }

  checkVerificationStatus(companyId: string): Observable<'verified' | 'pending' | 'rejected' | 'none'> {
    const verification = this.verifications().find(v => v.companyId === companyId);

    if (!verification) {
      return of('none');
    }

    if (verification.status === 'verified' && verification.expiryDate) {
      // Check if verification has expired
      if (new Date() > verification.expiryDate) {
        return of('rejected');
      }
    }

    return of(verification.status as 'verified' | 'pending' | 'rejected');
  }
}
