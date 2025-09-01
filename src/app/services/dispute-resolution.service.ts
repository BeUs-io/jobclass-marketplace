import { Injectable } from '@angular/core';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { delay, map } from 'rxjs/operators';

export interface Dispute {
  id: string;
  type: 'order' | 'payment' | 'quality' | 'deadline' | 'communication' | 'other';
  status: 'open' | 'under-review' | 'escalated' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'critical';
  orderId?: string;
  projectId?: string;
  initiatorId: string;
  initiatorType: 'client' | 'freelancer';
  respondentId: string;
  respondentType: 'client' | 'freelancer';
  title: string;
  description: string;
  evidence: Evidence[];
  timeline: DisputeEvent[];
  mediatorId?: string;
  mediatorNotes?: string;
  resolution?: DisputeResolution;
  createdAt: Date;
  updatedAt: Date;
  deadline?: Date;
  amount?: number;
  category: string;
}

export interface Evidence {
  id: string;
  type: 'screenshot' | 'document' | 'message' | 'file' | 'link';
  url: string;
  description: string;
  uploadedBy: string;
  uploadedAt: Date;
  verified: boolean;
}

export interface DisputeEvent {
  id: string;
  type: 'created' | 'responded' | 'evidence-added' | 'escalated' | 'mediation-started' | 'resolved' | 'closed';
  description: string;
  userId: string;
  userName: string;
  timestamp: Date;
  details?: any;
}

export interface DisputeResolution {
  id: string;
  type: 'refund' | 'partial-refund' | 'revision' | 'cancellation' | 'completion' | 'custom';
  decision: string;
  refundAmount?: number;
  refundPercentage?: number;
  agreedByInitiator: boolean;
  agreedByRespondent: boolean;
  implementedAt?: Date;
  mediatorDecision?: string;
  followUpActions?: string[];
}

export interface Review {
  id: string;
  type: 'service' | 'project' | 'freelancer' | 'client';
  targetId: string;
  reviewerId: string;
  reviewerName: string;
  reviewerType: 'client' | 'freelancer';
  rating: number;
  title: string;
  content: string;
  pros?: string[];
  cons?: string[];
  wouldRecommend: boolean;
  verifiedPurchase: boolean;
  helpful: number;
  notHelpful: number;
  status: 'pending' | 'approved' | 'flagged' | 'removed';
  moderationStatus?: ModerationStatus;
  response?: ReviewResponse;
  createdAt: Date;
  updatedAt: Date;
  orderId?: string;
  tags?: string[];
}

export interface ModerationStatus {
  status: 'pending' | 'reviewing' | 'approved' | 'rejected' | 'edited';
  reason?: string;
  moderatorId?: string;
  moderatedAt?: Date;
  flags: ReviewFlag[];
  aiScore?: number;
  aiFlags?: string[];
}

export interface ReviewFlag {
  id: string;
  type: 'spam' | 'inappropriate' | 'fake' | 'offensive' | 'misleading' | 'other';
  flaggedBy: string;
  reason: string;
  flaggedAt: Date;
  reviewed: boolean;
  reviewedBy?: string;
  action?: 'dismissed' | 'upheld' | 'warning';
}

export interface ReviewResponse {
  id: string;
  responderId: string;
  responderName: string;
  content: string;
  createdAt: Date;
  helpful: number;
}

export interface MediationSession {
  id: string;
  disputeId: string;
  mediatorId: string;
  mediatorName: string;
  scheduledAt: Date;
  duration?: number;
  type: 'video' | 'chat' | 'email';
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  participants: string[];
  transcript?: string;
  outcome?: string;
  nextSteps?: string[];
}

@Injectable({
  providedIn: 'root'
})
export class DisputeResolutionService {
  private disputes$ = new BehaviorSubject<Dispute[]>([]);
  private reviews$ = new BehaviorSubject<Review[]>([]);
  private mediationSessions$ = new BehaviorSubject<MediationSession[]>([]);
  private moderationQueue$ = new BehaviorSubject<Review[]>([]);

  // Mock data
  private mockDisputes: Dispute[] = [
    {
      id: 'dispute_1',
      type: 'quality',
      status: 'under-review',
      priority: 'high',
      orderId: 'order_123',
      initiatorId: 'client_1',
      initiatorType: 'client',
      respondentId: 'freelancer_1',
      respondentType: 'freelancer',
      title: 'Logo design not as described',
      description: 'The delivered logo does not match the requirements discussed. Colors are different and the style is not modern as requested.',
      evidence: [
        {
          id: 'evidence_1',
          type: 'screenshot',
          url: 'https://evidence.example.com/screenshot1.png',
          description: 'Original requirements document',
          uploadedBy: 'client_1',
          uploadedAt: new Date('2024-08-28'),
          verified: true
        }
      ],
      timeline: [
        {
          id: 'event_1',
          type: 'created',
          description: 'Dispute created',
          userId: 'client_1',
          userName: 'John Client',
          timestamp: new Date('2024-08-28T10:00:00')
        },
        {
          id: 'event_2',
          type: 'responded',
          description: 'Freelancer responded to dispute',
          userId: 'freelancer_1',
          userName: 'Sarah Designer',
          timestamp: new Date('2024-08-28T14:00:00')
        }
      ],
      createdAt: new Date('2024-08-28'),
      updatedAt: new Date('2024-08-29'),
      deadline: new Date('2024-09-05'),
      amount: 250,
      category: 'Design'
    }
  ];

  private mockReviews: Review[] = [
    {
      id: 'review_1',
      type: 'service',
      targetId: 'service_1',
      reviewerId: 'client_1',
      reviewerName: 'John Client',
      reviewerType: 'client',
      rating: 5,
      title: 'Excellent work!',
      content: 'Sarah delivered an amazing logo design. Very professional and responsive to feedback. Highly recommended!',
      pros: ['Fast delivery', 'Great communication', 'High quality work'],
      cons: [],
      wouldRecommend: true,
      verifiedPurchase: true,
      helpful: 23,
      notHelpful: 2,
      status: 'approved',
      moderationStatus: {
        status: 'approved',
        moderatorId: 'mod_1',
        moderatedAt: new Date('2024-08-20'),
        flags: [],
        aiScore: 0.95
      },
      createdAt: new Date('2024-08-19'),
      updatedAt: new Date('2024-08-20'),
      orderId: 'order_123'
    },
    {
      id: 'review_2',
      type: 'freelancer',
      targetId: 'freelancer_2',
      reviewerId: 'client_2',
      reviewerName: 'Emma Client',
      reviewerType: 'client',
      rating: 2,
      title: 'Disappointed with the service',
      content: 'The work was not up to standard and communication was poor.',
      wouldRecommend: false,
      verifiedPurchase: true,
      helpful: 5,
      notHelpful: 8,
      status: 'flagged',
      moderationStatus: {
        status: 'reviewing',
        flags: [
          {
            id: 'flag_1',
            type: 'misleading',
            flaggedBy: 'freelancer_2',
            reason: 'Client provided incomplete requirements',
            flaggedAt: new Date('2024-08-25'),
            reviewed: false
          }
        ],
        aiScore: 0.3,
        aiFlags: ['potentially_biased', 'lacks_detail']
      },
      createdAt: new Date('2024-08-24'),
      updatedAt: new Date('2024-08-25')
    }
  ];

  constructor() {
    this.disputes$.next(this.mockDisputes);
    this.reviews$.next(this.mockReviews);
    this.updateModerationQueue();
  }

  // Dispute Management
  getDisputes(userId?: string, role?: 'client' | 'freelancer'): Observable<Dispute[]> {
    return this.disputes$.pipe(
      map(disputes => {
        if (userId) {
          return disputes.filter(d =>
            (role === 'client' && d.initiatorId === userId) ||
            (role === 'freelancer' && d.respondentId === userId)
          );
        }
        return disputes;
      })
    );
  }

  getDispute(disputeId: string): Observable<Dispute | undefined> {
    return this.disputes$.pipe(
      map(disputes => disputes.find(d => d.id === disputeId))
    );
  }

  createDispute(dispute: Partial<Dispute>): Observable<Dispute> {
    const newDispute: Dispute = {
      id: `dispute_${Date.now()}`,
      type: dispute.type || 'other',
      status: 'open',
      priority: this.calculatePriority(dispute),
      initiatorId: dispute.initiatorId || '',
      initiatorType: dispute.initiatorType || 'client',
      respondentId: dispute.respondentId || '',
      respondentType: dispute.respondentType || 'freelancer',
      title: dispute.title || '',
      description: dispute.description || '',
      evidence: [],
      timeline: [
        {
          id: `event_${Date.now()}`,
          type: 'created',
          description: 'Dispute created',
          userId: dispute.initiatorId || '',
          userName: 'User',
          timestamp: new Date()
        }
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
      deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      category: dispute.category || 'General',
      ...dispute
    };

    const disputes = this.disputes$.value;
    disputes.unshift(newDispute);
    this.disputes$.next(disputes);

    return of(newDispute).pipe(delay(1000));
  }

  respondToDispute(disputeId: string, response: string, userId: string): Observable<boolean> {
    const disputes = this.disputes$.value;
    const dispute = disputes.find(d => d.id === disputeId);

    if (dispute) {
      dispute.timeline.push({
        id: `event_${Date.now()}`,
        type: 'responded',
        description: response,
        userId,
        userName: 'User',
        timestamp: new Date()
      });

      dispute.status = 'under-review';
      dispute.updatedAt = new Date();

      this.disputes$.next(disputes);
      return of(true).pipe(delay(500));
    }

    return of(false);
  }

  addEvidence(disputeId: string, evidence: Partial<Evidence>): Observable<boolean> {
    const disputes = this.disputes$.value;
    const dispute = disputes.find(d => d.id === disputeId);

    if (dispute) {
      const newEvidence: Evidence = {
        id: `evidence_${Date.now()}`,
        type: evidence.type || 'document',
        url: evidence.url || '',
        description: evidence.description || '',
        uploadedBy: evidence.uploadedBy || '',
        uploadedAt: new Date(),
        verified: false
      };

      dispute.evidence.push(newEvidence);
      dispute.timeline.push({
        id: `event_${Date.now()}`,
        type: 'evidence-added',
        description: 'New evidence added',
        userId: evidence.uploadedBy || '',
        userName: 'User',
        timestamp: new Date()
      });

      dispute.updatedAt = new Date();
      this.disputes$.next(disputes);

      return of(true).pipe(delay(500));
    }

    return of(false);
  }

  escalateDispute(disputeId: string, reason: string): Observable<boolean> {
    const disputes = this.disputes$.value;
    const dispute = disputes.find(d => d.id === disputeId);

    if (dispute) {
      dispute.status = 'escalated';
      dispute.priority = 'critical';
      dispute.timeline.push({
        id: `event_${Date.now()}`,
        type: 'escalated',
        description: `Dispute escalated: ${reason}`,
        userId: 'system',
        userName: 'System',
        timestamp: new Date()
      });

      dispute.updatedAt = new Date();
      this.disputes$.next(disputes);

      // Schedule mediation
      this.scheduleMediationSession(disputeId);

      return of(true).pipe(delay(500));
    }

    return of(false);
  }

  resolveDispute(disputeId: string, resolution: Partial<DisputeResolution>): Observable<boolean> {
    const disputes = this.disputes$.value;
    const dispute = disputes.find(d => d.id === disputeId);

    if (dispute) {
      dispute.resolution = {
        id: `resolution_${Date.now()}`,
        type: resolution.type || 'custom',
        decision: resolution.decision || '',
        agreedByInitiator: false,
        agreedByRespondent: false,
        ...resolution
      };

      dispute.status = 'resolved';
      dispute.timeline.push({
        id: `event_${Date.now()}`,
        type: 'resolved',
        description: `Dispute resolved: ${resolution.decision}`,
        userId: 'mediator',
        userName: 'Mediator',
        timestamp: new Date()
      });

      dispute.updatedAt = new Date();
      this.disputes$.next(disputes);

      return of(true).pipe(delay(500));
    }

    return of(false);
  }

  // Review Management
  getReviews(targetId?: string): Observable<Review[]> {
    return this.reviews$.pipe(
      map(reviews => {
        if (targetId) {
          return reviews.filter(r => r.targetId === targetId);
        }
        return reviews;
      })
    );
  }

  submitReview(review: Partial<Review>): Observable<Review> {
    const newReview: Review = {
      id: `review_${Date.now()}`,
      type: review.type || 'service',
      targetId: review.targetId || '',
      reviewerId: review.reviewerId || '',
      reviewerName: review.reviewerName || '',
      reviewerType: review.reviewerType || 'client',
      rating: review.rating || 0,
      title: review.title || '',
      content: review.content || '',
      wouldRecommend: review.wouldRecommend || false,
      verifiedPurchase: review.verifiedPurchase || false,
      helpful: 0,
      notHelpful: 0,
      status: 'pending',
      moderationStatus: {
        status: 'pending',
        flags: [],
        aiScore: this.calculateAIScore(review.content || '')
      },
      createdAt: new Date(),
      updatedAt: new Date(),
      ...review
    };

    const reviews = this.reviews$.value;
    reviews.unshift(newReview);
    this.reviews$.next(reviews);

    // Add to moderation queue
    this.updateModerationQueue();

    // Auto-approve if AI score is high
    if (newReview.moderationStatus?.aiScore && newReview.moderationStatus.aiScore > 0.8) {
      setTimeout(() => this.approveReview(newReview.id), 2000);
    }

    return of(newReview).pipe(delay(1000));
  }

  flagReview(reviewId: string, flag: Partial<ReviewFlag>): Observable<boolean> {
    const reviews = this.reviews$.value;
    const review = reviews.find(r => r.id === reviewId);

    if (review) {
      const newFlag: ReviewFlag = {
        id: `flag_${Date.now()}`,
        type: flag.type || 'other',
        flaggedBy: flag.flaggedBy || '',
        reason: flag.reason || '',
        flaggedAt: new Date(),
        reviewed: false
      };

      if (!review.moderationStatus) {
        review.moderationStatus = {
          status: 'reviewing',
          flags: [],
          aiScore: 0.5
        };
      }

      review.moderationStatus.flags.push(newFlag);
      review.moderationStatus.status = 'reviewing';
      review.status = 'flagged';
      review.updatedAt = new Date();

      this.reviews$.next(reviews);
      this.updateModerationQueue();

      return of(true).pipe(delay(500));
    }

    return of(false);
  }

  moderateReview(reviewId: string, action: 'approve' | 'reject' | 'edit', reason?: string): Observable<boolean> {
    const reviews = this.reviews$.value;
    const review = reviews.find(r => r.id === reviewId);

    if (review && review.moderationStatus) {
      switch (action) {
        case 'approve':
          review.moderationStatus.status = 'approved';
          review.status = 'approved';
          break;
        case 'reject':
          review.moderationStatus.status = 'rejected';
          review.status = 'removed';
          break;
        case 'edit':
          review.moderationStatus.status = 'edited';
          review.status = 'approved';
          break;
      }

      review.moderationStatus.reason = reason;
      review.moderationStatus.moderatorId = 'moderator_1';
      review.moderationStatus.moderatedAt = new Date();
      review.updatedAt = new Date();

      this.reviews$.next(reviews);
      this.updateModerationQueue();

      return of(true).pipe(delay(500));
    }

    return of(false);
  }

  private approveReview(reviewId: string): void {
    this.moderateReview(reviewId, 'approve', 'Auto-approved by AI');
  }

  respondToReview(reviewId: string, response: Partial<ReviewResponse>): Observable<boolean> {
    const reviews = this.reviews$.value;
    const review = reviews.find(r => r.id === reviewId);

    if (review) {
      review.response = {
        id: `response_${Date.now()}`,
        responderId: response.responderId || '',
        responderName: response.responderName || '',
        content: response.content || '',
        createdAt: new Date(),
        helpful: 0
      };

      review.updatedAt = new Date();
      this.reviews$.next(reviews);

      return of(true).pipe(delay(500));
    }

    return of(false);
  }

  // Mediation Management
  scheduleMediationSession(disputeId: string): Observable<MediationSession> {
    const session: MediationSession = {
      id: `session_${Date.now()}`,
      disputeId,
      mediatorId: 'mediator_1',
      mediatorName: 'Professional Mediator',
      scheduledAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
      type: 'video',
      status: 'scheduled',
      participants: []
    };

    const sessions = this.mediationSessions$.value;
    sessions.push(session);
    this.mediationSessions$.next(sessions);

    return of(session).pipe(delay(1000));
  }

  getMediationSessions(disputeId?: string): Observable<MediationSession[]> {
    return this.mediationSessions$.pipe(
      map(sessions => {
        if (disputeId) {
          return sessions.filter(s => s.disputeId === disputeId);
        }
        return sessions;
      })
    );
  }

  // Moderation Queue
  getModerationQueue(): Observable<Review[]> {
    return this.moderationQueue$.asObservable();
  }

  private updateModerationQueue(): void {
    const reviews = this.reviews$.value;
    const queue = reviews.filter(r =>
      r.status === 'pending' ||
      r.status === 'flagged' ||
      (r.moderationStatus && r.moderationStatus.status === 'reviewing')
    );
    this.moderationQueue$.next(queue);
  }

  // Analytics
  getDisputeAnalytics(): Observable<any> {
    const disputes = this.disputes$.value;

    const analytics = {
      totalDisputes: disputes.length,
      openDisputes: disputes.filter(d => d.status === 'open').length,
      resolvedDisputes: disputes.filter(d => d.status === 'resolved').length,
      averageResolutionTime: this.calculateAverageResolutionTime(disputes),
      disputesByType: this.groupDisputesByType(disputes),
      resolutionRate: this.calculateResolutionRate(disputes)
    };

    return of(analytics).pipe(delay(500));
  }

  getReviewAnalytics(): Observable<any> {
    const reviews = this.reviews$.value;

    const analytics = {
      totalReviews: reviews.length,
      averageRating: this.calculateAverageRating(reviews),
      flaggedReviews: reviews.filter(r => r.status === 'flagged').length,
      approvalRate: this.calculateApprovalRate(reviews),
      reviewsByRating: this.groupReviewsByRating(reviews)
    };

    return of(analytics).pipe(delay(500));
  }

  // Private helper methods
  private calculatePriority(dispute: Partial<Dispute>): 'low' | 'medium' | 'high' | 'critical' {
    if (dispute.amount && dispute.amount > 1000) return 'high';
    if (dispute.type === 'payment') return 'high';
    if (dispute.type === 'quality') return 'medium';
    return 'low';
  }

  private calculateAIScore(content: string): number {
    // Mock AI scoring - in reality, this would use NLP/ML
    const positiveWords = ['excellent', 'great', 'amazing', 'professional', 'recommended'];
    const negativeWords = ['terrible', 'awful', 'scam', 'fake', 'worst'];

    let score = 0.5;
    positiveWords.forEach(word => {
      if (content.toLowerCase().includes(word)) score += 0.1;
    });
    negativeWords.forEach(word => {
      if (content.toLowerCase().includes(word)) score -= 0.2;
    });

    return Math.max(0, Math.min(1, score));
  }

  private calculateAverageResolutionTime(disputes: Dispute[]): number {
    const resolved = disputes.filter(d => d.status === 'resolved');
    if (resolved.length === 0) return 0;

    const totalTime = resolved.reduce((sum, d) => {
      const time = d.updatedAt.getTime() - d.createdAt.getTime();
      return sum + time;
    }, 0);

    return Math.floor(totalTime / resolved.length / (1000 * 60 * 60 * 24)); // Days
  }

  private calculateResolutionRate(disputes: Dispute[]): number {
    if (disputes.length === 0) return 0;
    const resolved = disputes.filter(d => d.status === 'resolved' || d.status === 'closed').length;
    return Math.round((resolved / disputes.length) * 100);
  }

  private calculateAverageRating(reviews: Review[]): number {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
    return Math.round((sum / reviews.length) * 10) / 10;
  }

  private calculateApprovalRate(reviews: Review[]): number {
    if (reviews.length === 0) return 0;
    const approved = reviews.filter(r => r.status === 'approved').length;
    return Math.round((approved / reviews.length) * 100);
  }

  private groupDisputesByType(disputes: Dispute[]): any[] {
    const groups = new Map<string, number>();
    disputes.forEach(d => {
      groups.set(d.type, (groups.get(d.type) || 0) + 1);
    });
    return Array.from(groups.entries()).map(([type, count]) => ({ type, count }));
  }

  private groupReviewsByRating(reviews: Review[]): any[] {
    const groups = new Map<number, number>();
    for (let i = 1; i <= 5; i++) {
      groups.set(i, 0);
    }
    reviews.forEach(r => {
      groups.set(r.rating, (groups.get(r.rating) || 0) + 1);
    });
    return Array.from(groups.entries()).map(([rating, count]) => ({ rating, count }));
  }
}
