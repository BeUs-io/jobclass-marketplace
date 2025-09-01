import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';

export interface Subscription {
  id: string;
  userId: string;
  planId: string;
  planName: string;
  status: 'active' | 'cancelled' | 'expired' | 'trial' | 'past_due';
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
  paymentMethod?: PaymentMethod;
  amount: number;
  currency: string;
  interval: 'month' | 'year';
  trialEndsAt?: Date;
}

export interface PaymentMethod {
  id: string;
  type: 'card' | 'paypal' | 'bank_account';
  last4?: string;
  brand?: string;
  expiryMonth?: number;
  expiryYear?: number;
  email?: string;
  isDefault: boolean;
}

export interface Invoice {
  id: string;
  subscriptionId: string;
  amount: number;
  currency: string;
  status: 'paid' | 'pending' | 'failed';
  dueDate: Date;
  paidAt?: Date;
  invoiceUrl?: string;
  items: {
    description: string;
    amount: number;
    quantity: number;
  }[];
}

export interface PromoCode {
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  validUntil: Date;
  maxUses: number;
  usedCount: number;
  applicablePlans: string[];
  minAmount?: number;
  isActive: boolean;
}

export interface CheckoutSession {
  id: string;
  planId: string;
  planName: string;
  amount: number;
  interval: 'month' | 'year';
  promoCode?: PromoCode;
  discountAmount?: number;
  finalAmount: number;
  currency: string;
  customerEmail?: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
}

export interface PricingAnalytics {
  planId: string;
  planName: string;
  views: number;
  clicks: number;
  conversions: number;
  revenue: number;
  conversionRate: number;
  averageOrderValue: number;
  churnRate: number;
  period: 'day' | 'week' | 'month' | 'year';
}

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private subscriptionSubject = new BehaviorSubject<Subscription | null>(null);
  public subscription$ = this.subscriptionSubject.asObservable();

  private paymentMethodsSubject = new BehaviorSubject<PaymentMethod[]>([]);
  public paymentMethods$ = this.paymentMethodsSubject.asObservable();

  private invoicesSubject = new BehaviorSubject<Invoice[]>([]);
  public invoices$ = this.invoicesSubject.asObservable();

  private activePromoCodesSubject = new BehaviorSubject<PromoCode[]>(this.getDefaultPromoCodes());
  public activePromoCodes$ = this.activePromoCodesSubject.asObservable();

  private analyticsSubject = new BehaviorSubject<PricingAnalytics[]>([]);
  public analytics$ = this.analyticsSubject.asObservable();

  private checkoutSessionSubject = new BehaviorSubject<CheckoutSession | null>(null);
  public checkoutSession$ = this.checkoutSessionSubject.asObservable();

  constructor() {
    this.loadSubscription();
    this.loadPaymentMethods();
    this.generateMockAnalytics();
  }

  // Initialize Stripe
  initializeStripe(publishableKey: string): Observable<boolean> {
    // In real implementation, would load Stripe.js
    console.log('Initializing Stripe with key:', publishableKey);
    return of(true).pipe(delay(500));
  }

  // Create checkout session
  createCheckoutSession(
    planId: string,
    planName: string,
    amount: number,
    interval: 'month' | 'year',
    promoCode?: string
  ): Observable<CheckoutSession> {
    let session: CheckoutSession = {
      id: 'cs_' + Date.now(),
      planId,
      planName,
      amount,
      interval,
      finalAmount: amount,
      currency: 'USD',
      status: 'pending'
    };

    // Apply promo code if provided
    if (promoCode) {
      const promo = this.validatePromoCode(promoCode, planId, amount);
      if (promo) {
        session.promoCode = promo;
        session.discountAmount = this.calculateDiscount(amount, promo);
        session.finalAmount = amount - session.discountAmount;
      }
    }

    this.checkoutSessionSubject.next(session);

    // Track analytics
    this.trackPlanClick(planId, planName);

    return of(session).pipe(delay(300));
  }

  // Process payment with Stripe
  processStripePayment(
    sessionId: string,
    paymentMethodId: string,
    billingDetails: any
  ): Observable<{ success: boolean; subscription?: Subscription; error?: string }> {
    // Simulate Stripe payment processing
    return of(null).pipe(
      delay(2000),
      map(() => {
        const session = this.checkoutSessionSubject.value;
        if (!session) {
          return { success: false, error: 'Invalid session' };
        }

        // Create subscription
        const subscription: Subscription = {
          id: 'sub_' + Date.now(),
          userId: 'user_1',
          planId: session.planId,
          planName: session.planName,
          status: 'active',
          currentPeriodStart: new Date(),
          currentPeriodEnd: this.getNextBillingDate(session.interval),
          cancelAtPeriodEnd: false,
          amount: session.finalAmount,
          currency: session.currency,
          interval: session.interval
        };

        this.subscriptionSubject.next(subscription);
        this.saveSubscription(subscription);

        // Update session status
        session.status = 'completed';
        this.checkoutSessionSubject.next(session);

        // Track conversion
        this.trackConversion(session.planId, session.planName, session.finalAmount);

        // Generate invoice
        this.generateInvoice(subscription);

        return { success: true, subscription };
      })
    );
  }

  // Process PayPal payment
  processPayPalPayment(
    sessionId: string,
    orderId: string
  ): Observable<{ success: boolean; subscription?: Subscription; error?: string }> {
    // Simulate PayPal payment processing
    return this.processStripePayment(sessionId, 'paypal_' + orderId, {});
  }

  // Validate promo code
  validatePromoCode(code: string, planId: string, amount: number): PromoCode | null {
    const promoCodes = this.activePromoCodesSubject.value;
    const promo = promoCodes.find(p =>
      p.code.toUpperCase() === code.toUpperCase() &&
      p.isActive &&
      p.validUntil > new Date() &&
      p.usedCount < p.maxUses &&
      (p.applicablePlans.length === 0 || p.applicablePlans.includes(planId)) &&
      (!p.minAmount || amount >= p.minAmount)
    );

    if (promo) {
      // Increment usage count
      promo.usedCount++;
      this.activePromoCodesSubject.next([...promoCodes]);
    }

    return promo || null;
  }

  // Calculate discount
  calculateDiscount(amount: number, promo: PromoCode): number {
    if (promo.discountType === 'percentage') {
      return Math.round(amount * (promo.discountValue / 100));
    } else {
      return Math.min(promo.discountValue, amount);
    }
  }

  // Get current subscription
  getCurrentSubscription(): Observable<Subscription | null> {
    return this.subscription$;
  }

  // Cancel subscription
  cancelSubscription(subscriptionId: string, immediately: boolean = false): Observable<boolean> {
    return of(null).pipe(
      delay(1000),
      map(() => {
        const subscription = this.subscriptionSubject.value;
        if (subscription && subscription.id === subscriptionId) {
          if (immediately) {
            subscription.status = 'cancelled';
          } else {
            subscription.cancelAtPeriodEnd = true;
          }
          this.subscriptionSubject.next(subscription);
          this.saveSubscription(subscription);
          return true;
        }
        return false;
      })
    );
  }

  // Resume subscription
  resumeSubscription(subscriptionId: string): Observable<boolean> {
    return of(null).pipe(
      delay(1000),
      map(() => {
        const subscription = this.subscriptionSubject.value;
        if (subscription && subscription.id === subscriptionId) {
          subscription.cancelAtPeriodEnd = false;
          this.subscriptionSubject.next(subscription);
          this.saveSubscription(subscription);
          return true;
        }
        return false;
      })
    );
  }

  // Update payment method
  updatePaymentMethod(paymentMethodId: string): Observable<boolean> {
    return of(null).pipe(
      delay(1000),
      map(() => {
        const methods = this.paymentMethodsSubject.value;
        methods.forEach(m => m.isDefault = m.id === paymentMethodId);
        this.paymentMethodsSubject.next([...methods]);
        this.savePaymentMethods(methods);
        return true;
      })
    );
  }

  // Add payment method
  addPaymentMethod(method: Omit<PaymentMethod, 'id'>): Observable<PaymentMethod> {
    const newMethod: PaymentMethod = {
      ...method,
      id: 'pm_' + Date.now()
    };

    const methods = this.paymentMethodsSubject.value;
    this.paymentMethodsSubject.next([...methods, newMethod]);
    this.savePaymentMethods([...methods, newMethod]);

    return of(newMethod).pipe(delay(500));
  }

  // Remove payment method
  removePaymentMethod(methodId: string): Observable<boolean> {
    const methods = this.paymentMethodsSubject.value.filter(m => m.id !== methodId);
    this.paymentMethodsSubject.next(methods);
    this.savePaymentMethods(methods);
    return of(true).pipe(delay(500));
  }

  // Get invoices
  getInvoices(): Observable<Invoice[]> {
    return this.invoices$;
  }

  // Download invoice
  downloadInvoice(invoiceId: string): Observable<Blob> {
    // In real implementation, would generate PDF
    const invoice = this.invoicesSubject.value.find(i => i.id === invoiceId);
    if (invoice) {
      const content = `Invoice #${invoice.id}\nAmount: $${invoice.amount}\nStatus: ${invoice.status}`;
      const blob = new Blob([content], { type: 'text/plain' });
      return of(blob).pipe(delay(500));
    }
    return of(new Blob()).pipe(delay(500));
  }

  // Analytics tracking
  trackPlanView(planId: string, planName: string): void {
    const analytics = this.analyticsSubject.value;
    const existing = analytics.find(a => a.planId === planId);

    if (existing) {
      existing.views++;
    } else {
      analytics.push({
        planId,
        planName,
        views: 1,
        clicks: 0,
        conversions: 0,
        revenue: 0,
        conversionRate: 0,
        averageOrderValue: 0,
        churnRate: 0,
        period: 'month'
      });
    }

    this.analyticsSubject.next([...analytics]);
    this.saveAnalytics(analytics);
  }

  trackPlanClick(planId: string, planName: string): void {
    const analytics = this.analyticsSubject.value;
    const existing = analytics.find(a => a.planId === planId);

    if (existing) {
      existing.clicks++;
      existing.conversionRate = (existing.conversions / existing.clicks) * 100;
    }

    this.analyticsSubject.next([...analytics]);
    this.saveAnalytics(analytics);
  }

  trackConversion(planId: string, planName: string, amount: number): void {
    const analytics = this.analyticsSubject.value;
    const existing = analytics.find(a => a.planId === planId);

    if (existing) {
      existing.conversions++;
      existing.revenue += amount;
      existing.conversionRate = (existing.conversions / existing.clicks) * 100;
      existing.averageOrderValue = existing.revenue / existing.conversions;
    }

    this.analyticsSubject.next([...analytics]);
    this.saveAnalytics(analytics);
  }

  // Update checkout session
  updateCheckoutSession(session: CheckoutSession): void {
    this.checkoutSessionSubject.next(session);
  }

  // Get analytics data
  getAnalytics(period: 'day' | 'week' | 'month' | 'year' = 'month'): Observable<PricingAnalytics[]> {
    return this.analytics$.pipe(
      map(analytics => analytics.filter(a => a.period === period))
    );
  }

  // Private helper methods
  private getNextBillingDate(interval: 'month' | 'year'): Date {
    const date = new Date();
    if (interval === 'month') {
      date.setMonth(date.getMonth() + 1);
    } else {
      date.setFullYear(date.getFullYear() + 1);
    }
    return date;
  }

  private generateInvoice(subscription: Subscription): void {
    const invoice: Invoice = {
      id: 'inv_' + Date.now(),
      subscriptionId: subscription.id,
      amount: subscription.amount,
      currency: subscription.currency,
      status: 'paid',
      dueDate: new Date(),
      paidAt: new Date(),
      items: [{
        description: `${subscription.planName} Subscription (${subscription.interval}ly)`,
        amount: subscription.amount,
        quantity: 1
      }]
    };

    const invoices = this.invoicesSubject.value;
    this.invoicesSubject.next([invoice, ...invoices]);
    this.saveInvoices([invoice, ...invoices]);
  }

  private getDefaultPromoCodes(): PromoCode[] {
    return [
      {
        code: 'WELCOME20',
        discountType: 'percentage',
        discountValue: 20,
        validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        maxUses: 1000,
        usedCount: 142,
        applicablePlans: [],
        isActive: true
      },
      {
        code: 'SAVE50',
        discountType: 'fixed',
        discountValue: 50,
        validUntil: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
        maxUses: 500,
        usedCount: 89,
        applicablePlans: ['professional', 'enterprise'],
        minAmount: 99,
        isActive: true
      },
      {
        code: 'STUDENT',
        discountType: 'percentage',
        discountValue: 50,
        validUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        maxUses: 10000,
        usedCount: 3421,
        applicablePlans: ['basic'],
        isActive: true
      }
    ];
  }

  private generateMockAnalytics(): void {
    const analytics: PricingAnalytics[] = [
      {
        planId: 'free',
        planName: 'Free',
        views: 15234,
        clicks: 3456,
        conversions: 2341,
        revenue: 0,
        conversionRate: 67.8,
        averageOrderValue: 0,
        churnRate: 12.3,
        period: 'month'
      },
      {
        planId: 'basic',
        planName: 'Basic',
        views: 8923,
        clicks: 2156,
        conversions: 523,
        revenue: 9937,
        conversionRate: 24.3,
        averageOrderValue: 19,
        churnRate: 8.5,
        period: 'month'
      },
      {
        planId: 'professional',
        planName: 'Professional',
        views: 4567,
        clicks: 892,
        conversions: 156,
        revenue: 15444,
        conversionRate: 17.5,
        averageOrderValue: 99,
        churnRate: 5.2,
        period: 'month'
      },
      {
        planId: 'enterprise',
        planName: 'Enterprise',
        views: 1234,
        clicks: 234,
        conversions: 23,
        revenue: 11477,
        conversionRate: 9.8,
        averageOrderValue: 499,
        churnRate: 2.1,
        period: 'month'
      }
    ];

    this.analyticsSubject.next(analytics);
  }

  // Local storage methods
  private loadSubscription(): void {
    const saved = localStorage.getItem('subscription');
    if (saved) {
      const subscription = JSON.parse(saved);
      subscription.currentPeriodStart = new Date(subscription.currentPeriodStart);
      subscription.currentPeriodEnd = new Date(subscription.currentPeriodEnd);
      if (subscription.trialEndsAt) {
        subscription.trialEndsAt = new Date(subscription.trialEndsAt);
      }
      this.subscriptionSubject.next(subscription);
    }
  }

  private saveSubscription(subscription: Subscription): void {
    localStorage.setItem('subscription', JSON.stringify(subscription));
  }

  private loadPaymentMethods(): void {
    const saved = localStorage.getItem('paymentMethods');
    if (saved) {
      this.paymentMethodsSubject.next(JSON.parse(saved));
    }
  }

  private savePaymentMethods(methods: PaymentMethod[]): void {
    localStorage.setItem('paymentMethods', JSON.stringify(methods));
  }

  private saveInvoices(invoices: Invoice[]): void {
    localStorage.setItem('invoices', JSON.stringify(invoices));
  }

  private saveAnalytics(analytics: PricingAnalytics[]): void {
    localStorage.setItem('pricingAnalytics', JSON.stringify(analytics));
  }
}
