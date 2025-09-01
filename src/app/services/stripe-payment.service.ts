import { Injectable } from '@angular/core';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { delay, map } from 'rxjs/operators';

export interface PaymentMethod {
  id: string;
  type: 'card' | 'bank_account' | 'paypal';
  last4: string;
  brand?: string;
  isDefault: boolean;
  expiryMonth?: number;
  expiryYear?: number;
}

export interface Transaction {
  id: string;
  type: 'payment' | 'refund' | 'withdrawal' | 'escrow_release';
  amount: number;
  currency: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';
  description: string;
  orderId?: string;
  projectId?: string;
  fromUserId: string;
  toUserId?: string;
  createdAt: Date;
  completedAt?: Date;
  stripePaymentIntentId?: string;
  escrowStatus?: 'held' | 'released' | 'refunded';
  disputeId?: string;
}

export interface EscrowAccount {
  id: string;
  orderId: string;
  amount: number;
  currency: string;
  status: 'active' | 'released' | 'disputed' | 'refunded';
  createdAt: Date;
  releaseDate?: Date;
  buyerId: string;
  sellerId: string;
  milestones?: EscrowMilestone[];
}

export interface EscrowMilestone {
  id: string;
  description: string;
  amount: number;
  status: 'pending' | 'funded' | 'released' | 'disputed';
  dueDate: Date;
  releaseConditions: string[];
  approvedByBuyer: boolean;
  approvedBySeller: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class StripePaymentService {
  private currentBalance = new BehaviorSubject<number>(2450.00);
  private escrowAccounts = new BehaviorSubject<EscrowAccount[]>([]);

  // Mock data
  private paymentMethods: PaymentMethod[] = [
    {
      id: 'pm_1',
      type: 'card',
      last4: '4242',
      brand: 'Visa',
      isDefault: true,
      expiryMonth: 12,
      expiryYear: 2025
    }
  ];

  private transactions: Transaction[] = [
    {
      id: 'tx_1',
      type: 'payment',
      amount: 250.00,
      currency: 'USD',
      status: 'completed',
      description: 'Payment for Logo Design Service',
      orderId: 'order_123',
      fromUserId: 'client_1',
      toUserId: 'freelancer_1',
      createdAt: new Date('2024-08-25'),
      completedAt: new Date('2024-08-25'),
      escrowStatus: 'released'
    }
  ];

  constructor() {}

  // Payment Methods
  getPaymentMethods(customerId: string): Observable<PaymentMethod[]> {
    return of(this.paymentMethods).pipe(delay(500));
  }

  addPaymentMethod(customerId: string, paymentMethodId: string): Observable<PaymentMethod> {
    const newMethod: PaymentMethod = {
      id: paymentMethodId,
      type: 'card',
      last4: '1234',
      brand: 'Visa',
      isDefault: false,
      expiryMonth: 12,
      expiryYear: 2027
    };
    this.paymentMethods.push(newMethod);
    return of(newMethod).pipe(delay(1000));
  }

  // Payment Processing
  createPaymentIntent(amount: number, currency: string, metadata: any): Observable<any> {
    const intent = {
      id: `pi_${Date.now()}`,
      amount,
      currency,
      status: 'requires_payment_method',
      clientSecret: `pi_${Date.now()}_secret`,
      metadata
    };
    return of(intent).pipe(delay(1000));
  }

  // Escrow Management
  createEscrowAccount(orderId: string, amount: number, buyerId: string, sellerId: string): Observable<EscrowAccount> {
    const escrowAccount: EscrowAccount = {
      id: `escrow_${Date.now()}`,
      orderId,
      amount,
      currency: 'USD',
      status: 'active',
      createdAt: new Date(),
      buyerId,
      sellerId
    };

    const currentAccounts = this.escrowAccounts.value;
    currentAccounts.push(escrowAccount);
    this.escrowAccounts.next(currentAccounts);

    return of(escrowAccount).pipe(delay(1000));
  }

  releaseEscrowFunds(escrowId: string): Observable<Transaction> {
    const escrowAccount = this.escrowAccounts.value.find(e => e.id === escrowId);

    if (!escrowAccount) {
      throw new Error('Escrow account not found');
    }

    const transaction: Transaction = {
      id: `tx_${Date.now()}`,
      type: 'escrow_release',
      amount: escrowAccount.amount,
      currency: escrowAccount.currency,
      status: 'completed',
      description: `Escrow Release for Order ${escrowAccount.orderId}`,
      orderId: escrowAccount.orderId,
      fromUserId: 'escrow',
      toUserId: escrowAccount.sellerId,
      createdAt: new Date(),
      completedAt: new Date(),
      escrowStatus: 'released'
    };

    escrowAccount.status = 'released';
    escrowAccount.releaseDate = new Date();

    this.currentBalance.next(this.currentBalance.value + escrowAccount.amount);
    this.transactions.unshift(transaction);

    return of(transaction).pipe(delay(1500));
  }

  getBalance(userId: string): Observable<number> {
    return this.currentBalance.asObservable();
  }

  getTransactionHistory(userId: string): Observable<Transaction[]> {
    return of(this.transactions).pipe(delay(500));
  }

  getEscrowAccounts(userId: string): Observable<EscrowAccount[]> {
    return this.escrowAccounts.asObservable();
  }

  setDefaultPaymentMethod(customerId: string, paymentMethodId: string): Observable<boolean> {
    this.paymentMethods.forEach(pm => {
      pm.isDefault = pm.id === paymentMethodId;
    });
    return of(true).pipe(delay(500));
  }

  removePaymentMethod(paymentMethodId: string): Observable<boolean> {
    const index = this.paymentMethods.findIndex(pm => pm.id === paymentMethodId);
    if (index > -1) {
      this.paymentMethods.splice(index, 1);
    }
    return of(true).pipe(delay(500));
  }

  withdrawFunds(amount: number, destinationId: string): Observable<Transaction> {
    if (amount > this.currentBalance.value) {
      throw new Error('Insufficient funds');
    }

    const transaction: Transaction = {
      id: `tx_${Date.now()}`,
      type: 'withdrawal',
      amount,
      currency: 'USD',
      status: 'processing',
      description: `Withdrawal to ${destinationId}`,
      fromUserId: 'current_user',
      createdAt: new Date()
    };

    this.currentBalance.next(this.currentBalance.value - amount);
    this.transactions.unshift(transaction);

    return of(transaction).pipe(delay(2000));
  }
}
