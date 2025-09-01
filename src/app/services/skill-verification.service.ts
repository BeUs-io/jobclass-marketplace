import { Injectable } from '@angular/core';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { delay, map } from 'rxjs/operators';

export interface SkillTest {
  id: string;
  skillName: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  duration: number; // in minutes
  passingScore: number;
  totalQuestions: number;
  description: string;
  prerequisites: string[];
  certificateValid: number; // months
  price: number;
  attempts: number;
  popularity: number;
  averageScore: number;
  completionRate: number;
}

export interface TestQuestion {
  id: string;
  testId: string;
  type: 'multiple-choice' | 'coding' | 'essay' | 'true-false' | 'practical';
  question: string;
  options?: string[];
  correctAnswer?: string | string[];
  codeTemplate?: string;
  timeLimit?: number; // seconds
  points: number;
  explanation?: string;
  resources?: string[];
}

export interface TestAttempt {
  id: string;
  userId: string;
  testId: string;
  testName: string;
  startTime: Date;
  endTime?: Date;
  score?: number;
  status: 'in-progress' | 'completed' | 'passed' | 'failed' | 'abandoned';
  answers: TestAnswer[];
  timeSpent: number;
  certificateId?: string;
  feedback?: string;
}

export interface TestAnswer {
  questionId: string;
  answer: any;
  isCorrect?: boolean;
  pointsEarned: number;
  timeSpent: number;
}

export interface SkillCertificate {
  id: string;
  userId: string;
  userName: string;
  skillName: string;
  testId: string;
  score: number;
  issueDate: Date;
  expiryDate: Date;
  verificationCode: string;
  badgeUrl: string;
  level: 'bronze' | 'silver' | 'gold' | 'platinum';
  verified: boolean;
  blockchain?: {
    transactionId: string;
    blockNumber: number;
    timestamp: Date;
  };
}

export interface SkillBadge {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  level: string;
  requirements: string[];
  earnedBy: number;
  category: string;
}

export interface UserSkillProfile {
  userId: string;
  verifiedSkills: VerifiedSkill[];
  certificates: SkillCertificate[];
  badges: SkillBadge[];
  totalTests: number;
  passRate: number;
  averageScore: number;
  skillStrength: { [skill: string]: number };
  recommendations: string[];
}

export interface VerifiedSkill {
  skillName: string;
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  score: number;
  verifiedDate: Date;
  certificateId: string;
  endorsed: number;
  endorsements: Endorsement[];
}

export interface Endorsement {
  id: string;
  endorserId: string;
  endorserName: string;
  endorserTitle: string;
  message: string;
  date: Date;
  verified: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class SkillVerificationService {
  private availableTests$ = new BehaviorSubject<SkillTest[]>([]);
  private userAttempts$ = new BehaviorSubject<TestAttempt[]>([]);
  private userCertificates$ = new BehaviorSubject<SkillCertificate[]>([]);
  private userSkillProfile$ = new BehaviorSubject<UserSkillProfile | null>(null);

  // Mock test data
  private mockTests: SkillTest[] = [
    {
      id: 'test_1',
      skillName: 'JavaScript',
      category: 'Programming',
      difficulty: 'intermediate',
      duration: 45,
      passingScore: 70,
      totalQuestions: 30,
      description: 'Test your JavaScript knowledge including ES6+, async programming, and best practices.',
      prerequisites: ['Basic Programming', 'HTML/CSS'],
      certificateValid: 12,
      price: 0,
      attempts: 5420,
      popularity: 95,
      averageScore: 72,
      completionRate: 85
    },
    {
      id: 'test_2',
      skillName: 'React',
      category: 'Programming',
      difficulty: 'advanced',
      duration: 60,
      passingScore: 75,
      totalQuestions: 35,
      description: 'Advanced React concepts including hooks, context, performance optimization, and testing.',
      prerequisites: ['JavaScript', 'HTML/CSS'],
      certificateValid: 12,
      price: 19.99,
      attempts: 3250,
      popularity: 88,
      averageScore: 68,
      completionRate: 78
    },
    {
      id: 'test_3',
      skillName: 'UI/UX Design',
      category: 'Design',
      difficulty: 'intermediate',
      duration: 40,
      passingScore: 70,
      totalQuestions: 25,
      description: 'Principles of user interface and user experience design.',
      prerequisites: [],
      certificateValid: 18,
      price: 14.99,
      attempts: 2150,
      popularity: 82,
      averageScore: 75,
      completionRate: 88
    }
  ];

  private mockQuestions: { [testId: string]: TestQuestion[] } = {
    'test_1': [
      {
        id: 'q1',
        testId: 'test_1',
        type: 'multiple-choice',
        question: 'What is the output of typeof null in JavaScript?',
        options: ['null', 'undefined', 'object', 'number'],
        correctAnswer: 'object',
        points: 2,
        explanation: 'This is a known quirk in JavaScript where typeof null returns "object".'
      },
      {
        id: 'q2',
        testId: 'test_1',
        type: 'coding',
        question: 'Write a function that removes duplicates from an array.',
        codeTemplate: 'function removeDuplicates(arr) {\n  // Your code here\n}',
        timeLimit: 300,
        points: 5,
        resources: ['MDN: Set', 'MDN: Array.filter']
      }
    ]
  };

  private mockCertificates: SkillCertificate[] = [
    {
      id: 'cert_1',
      userId: 'user_1',
      userName: 'John Doe',
      skillName: 'JavaScript',
      testId: 'test_1',
      score: 85,
      issueDate: new Date('2024-07-15'),
      expiryDate: new Date('2025-07-15'),
      verificationCode: 'CERT-JS-2024-A1B2C3',
      badgeUrl: 'https://badges.example.com/javascript-intermediate.png',
      level: 'silver',
      verified: true
    }
  ];

  constructor() {
    this.availableTests$.next(this.mockTests);
    this.userCertificates$.next(this.mockCertificates);
    this.initializeUserProfile();
  }

  // Test Management
  getAvailableTests(category?: string): Observable<SkillTest[]> {
    return this.availableTests$.pipe(
      map(tests => {
        if (category) {
          return tests.filter(test => test.category === category);
        }
        return tests;
      })
    );
  }

  getTest(testId: string): Observable<SkillTest | undefined> {
    return this.availableTests$.pipe(
      map(tests => tests.find(test => test.id === testId))
    );
  }

  searchTests(query: string): Observable<SkillTest[]> {
    return this.availableTests$.pipe(
      map(tests => tests.filter(test =>
        test.skillName.toLowerCase().includes(query.toLowerCase()) ||
        test.category.toLowerCase().includes(query.toLowerCase())
      ))
    );
  }

  // Test Taking
  startTest(testId: string, userId: string): Observable<TestAttempt> {
    const test = this.mockTests.find(t => t.id === testId);

    if (!test) {
      throw new Error('Test not found');
    }

    const attempt: TestAttempt = {
      id: `attempt_${Date.now()}`,
      userId,
      testId,
      testName: test.skillName,
      startTime: new Date(),
      status: 'in-progress',
      answers: [],
      timeSpent: 0
    };

    const attempts = this.userAttempts$.value;
    attempts.push(attempt);
    this.userAttempts$.next(attempts);

    return of(attempt).pipe(delay(500));
  }

  getTestQuestions(testId: string): Observable<TestQuestion[]> {
    const questions = this.mockQuestions[testId] || [];
    return of(questions).pipe(delay(500));
  }

  submitAnswer(attemptId: string, questionId: string, answer: any): Observable<boolean> {
    const attempts = this.userAttempts$.value;
    const attempt = attempts.find(a => a.id === attemptId);

    if (attempt) {
      const existingAnswerIndex = attempt.answers.findIndex(a => a.questionId === questionId);
      const testAnswer: TestAnswer = {
        questionId,
        answer,
        pointsEarned: 0, // Will be calculated on submission
        timeSpent: 0
      };

      if (existingAnswerIndex > -1) {
        attempt.answers[existingAnswerIndex] = testAnswer;
      } else {
        attempt.answers.push(testAnswer);
      }

      this.userAttempts$.next(attempts);
      return of(true).pipe(delay(300));
    }

    return of(false);
  }

  completeTest(attemptId: string): Observable<TestAttempt> {
    const attempts = this.userAttempts$.value;
    const attempt = attempts.find(a => a.id === attemptId);

    if (!attempt) {
      throw new Error('Attempt not found');
    }

    // Calculate score
    const test = this.mockTests.find(t => t.id === attempt.testId);
    if (test) {
      // Mock scoring logic
      attempt.score = Math.floor(Math.random() * 30) + 70; // Random score between 70-100
      attempt.status = attempt.score >= test.passingScore ? 'passed' : 'failed';
      attempt.endTime = new Date();
      attempt.timeSpent = Math.floor((attempt.endTime.getTime() - attempt.startTime.getTime()) / 1000 / 60);

      // Issue certificate if passed
      if (attempt.status === 'passed') {
        this.issueCertificate(attempt.userId, test, attempt.score);
      }
    }

    this.userAttempts$.next(attempts);
    return of(attempt).pipe(delay(1000));
  }

  // Certificate Management
  issueCertificate(userId: string, test: SkillTest, score: number): Observable<SkillCertificate> {
    const certificate: SkillCertificate = {
      id: `cert_${Date.now()}`,
      userId,
      userName: 'Current User',
      skillName: test.skillName,
      testId: test.id,
      score,
      issueDate: new Date(),
      expiryDate: new Date(Date.now() + test.certificateValid * 30 * 24 * 60 * 60 * 1000),
      verificationCode: this.generateVerificationCode(),
      badgeUrl: this.getBadgeUrl(test.skillName, score),
      level: this.getCertificateLevel(score),
      verified: true
    };

    const certificates = this.userCertificates$.value;
    certificates.push(certificate);
    this.userCertificates$.next(certificates);

    // Update user profile
    this.updateUserProfile(userId);

    return of(certificate).pipe(delay(1500));
  }

  getUserCertificates(userId: string): Observable<SkillCertificate[]> {
    return this.userCertificates$.pipe(
      map(certificates => certificates.filter(cert => cert.userId === userId))
    );
  }

  verifyCertificate(verificationCode: string): Observable<SkillCertificate | null> {
    return this.userCertificates$.pipe(
      map(certificates => certificates.find(cert => cert.verificationCode === verificationCode) || null),
      delay(500)
    );
  }

  // Skill Profile Management
  getUserSkillProfile(userId: string): Observable<UserSkillProfile | null> {
    return this.userSkillProfile$.asObservable();
  }

  endorseSkill(skillName: string, userId: string, endorsement: Partial<Endorsement>): Observable<boolean> {
    const profile = this.userSkillProfile$.value;

    if (profile) {
      const skill = profile.verifiedSkills.find(s => s.skillName === skillName);
      if (skill) {
        const newEndorsement: Endorsement = {
          id: `endorse_${Date.now()}`,
          endorserId: endorsement.endorserId || 'current_user',
          endorserName: endorsement.endorserName || 'Endorser Name',
          endorserTitle: endorsement.endorserTitle || 'Professional',
          message: endorsement.message || '',
          date: new Date(),
          verified: false
        };

        skill.endorsements.push(newEndorsement);
        skill.endorsed++;
        this.userSkillProfile$.next(profile);

        return of(true).pipe(delay(500));
      }
    }

    return of(false);
  }

  // Test History
  getUserTestHistory(userId: string): Observable<TestAttempt[]> {
    return this.userAttempts$.pipe(
      map(attempts => attempts.filter(a => a.userId === userId))
    );
  }

  // Analytics
  getSkillAnalytics(userId: string): Observable<any> {
    const certificates = this.userCertificates$.value.filter(c => c.userId === userId);
    const attempts = this.userAttempts$.value.filter(a => a.userId === userId);

    const analytics = {
      totalCertificates: certificates.length,
      totalAttempts: attempts.length,
      passRate: this.calculatePassRate(attempts),
      averageScore: this.calculateAverageScore(attempts),
      skillDistribution: this.getSkillDistribution(certificates),
      recentActivity: this.getRecentActivity(attempts),
      upcomingExpirations: this.getUpcomingExpirations(certificates)
    };

    return of(analytics).pipe(delay(500));
  }

  // Private helper methods
  private initializeUserProfile(): void {
    const profile: UserSkillProfile = {
      userId: 'user_1',
      verifiedSkills: [
        {
          skillName: 'JavaScript',
          level: 'intermediate',
          score: 85,
          verifiedDate: new Date('2024-07-15'),
          certificateId: 'cert_1',
          endorsed: 12,
          endorsements: []
        }
      ],
      certificates: this.mockCertificates,
      badges: [],
      totalTests: 5,
      passRate: 80,
      averageScore: 78,
      skillStrength: {
        'JavaScript': 85,
        'React': 72,
        'Node.js': 68,
        'CSS': 90
      },
      recommendations: ['React Advanced', 'Node.js Fundamentals', 'TypeScript Basics']
    };

    this.userSkillProfile$.next(profile);
  }

  private updateUserProfile(userId: string): void {
    // Update user profile based on new certificates and attempts
    const profile = this.userSkillProfile$.value;
    if (profile && profile.userId === userId) {
      const certificates = this.userCertificates$.value.filter(c => c.userId === userId);
      const attempts = this.userAttempts$.value.filter(a => a.userId === userId);

      profile.certificates = certificates;
      profile.totalTests = attempts.length;
      profile.passRate = this.calculatePassRate(attempts);
      profile.averageScore = this.calculateAverageScore(attempts);

      this.userSkillProfile$.next(profile);
    }
  }

  private generateVerificationCode(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = 'CERT-';
    for (let i = 0; i < 12; i++) {
      if (i % 4 === 0 && i > 0) code += '-';
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  }

  private getBadgeUrl(skillName: string, score: number): string {
    const level = this.getCertificateLevel(score);
    return `https://badges.example.com/${skillName.toLowerCase()}-${level}.png`;
  }

  private getCertificateLevel(score: number): 'bronze' | 'silver' | 'gold' | 'platinum' {
    if (score >= 95) return 'platinum';
    if (score >= 85) return 'gold';
    if (score >= 75) return 'silver';
    return 'bronze';
  }

  private calculatePassRate(attempts: TestAttempt[]): number {
    if (attempts.length === 0) return 0;
    const passed = attempts.filter(a => a.status === 'passed').length;
    return Math.round((passed / attempts.length) * 100);
  }

  private calculateAverageScore(attempts: TestAttempt[]): number {
    const completed = attempts.filter(a => a.score !== undefined);
    if (completed.length === 0) return 0;
    const sum = completed.reduce((acc, a) => acc + (a.score || 0), 0);
    return Math.round(sum / completed.length);
  }

  private getSkillDistribution(certificates: SkillCertificate[]): any[] {
    const distribution = new Map<string, number>();
    certificates.forEach(cert => {
      distribution.set(cert.skillName, (distribution.get(cert.skillName) || 0) + 1);
    });
    return Array.from(distribution.entries()).map(([skill, count]) => ({ skill, count }));
  }

  private getRecentActivity(attempts: TestAttempt[]): TestAttempt[] {
    return attempts
      .sort((a, b) => b.startTime.getTime() - a.startTime.getTime())
      .slice(0, 5);
  }

  private getUpcomingExpirations(certificates: SkillCertificate[]): SkillCertificate[] {
    const threeMonthsFromNow = new Date();
    threeMonthsFromNow.setMonth(threeMonthsFromNow.getMonth() + 3);

    return certificates
      .filter(cert => cert.expiryDate <= threeMonthsFromNow)
      .sort((a, b) => a.expiryDate.getTime() - b.expiryDate.getTime());
  }
}
