import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { StripePaymentService, Transaction, EscrowAccount, PaymentMethod } from '../../../services/stripe-payment.service';

@Component({
  selector: 'app-payment-management',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="min-h-screen bg-gray-50">
      <!-- Header -->
      <div class="bg-gradient-to-r from-green-600 to-teal-600 text-white">
        <div class="container mx-auto px-4 py-8">
          <h1 class="text-3xl font-bold mb-2">Payment Management</h1>
          <p class="text-green-100">Manage your transactions, escrow accounts, and payment methods</p>
        </div>
      </div>

      <!-- Balance Overview -->
      <div class="container mx-auto px-4 -mt-8">
        <div class="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div class="grid md:grid-cols-4 gap-6">
            <div>
              <p class="text-sm text-gray-600 mb-1">Available Balance</p>
              <p class="text-3xl font-bold text-green-600">\${{ balance | number:'1.2-2' }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-600 mb-1">In Escrow</p>
              <p class="text-2xl font-semibold text-blue-600">\${{ totalInEscrow | number:'1.2-2' }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-600 mb-1">Pending</p>
              <p class="text-2xl font-semibold text-yellow-600">\${{ pendingAmount | number:'1.2-2' }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-600 mb-1">This Month</p>
              <p class="text-2xl font-semibold text-gray-700">\${{ monthlyEarnings | number:'1.2-2' }}</p>
            </div>
          </div>

          <div class="mt-6 flex gap-4">
            <button (click)="showWithdrawModal = true"
                    class="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700">
              Withdraw Funds
            </button>
            <button (click)="activeTab = 'payment-methods'"
                    class="border border-gray-300 px-6 py-2 rounded-lg hover:bg-gray-50">
              Add Payment Method
            </button>
          </div>
        </div>
      </div>

      <div class="container mx-auto px-4 pb-8">
        <!-- Tabs -->
        <div class="bg-white rounded-lg shadow-sm mb-6">
          <div class="border-b">
            <nav class="flex">
              @for (tab of tabs; track tab.id) {
                <button (click)="activeTab = tab.id"
                        [class.border-b-2]="activeTab === tab.id"
                        [class.border-green-600]="activeTab === tab.id"
                        [class.text-green-600]="activeTab === tab.id"
                        class="px-6 py-4 font-medium hover:text-green-600">
                  {{ tab.label }}
                </button>
              }
            </nav>
          </div>
        </div>

        <!-- Tab Content -->
        <div [ngSwitch]="activeTab">
          <!-- Transactions Tab -->
          <div *ngSwitchCase="'transactions'" class="bg-white rounded-lg shadow-md p-6">
            <div class="flex justify-between items-center mb-6">
              <h2 class="text-xl font-semibold">Transaction History</h2>
              <select [(ngModel)]="transactionFilter" class="px-4 py-2 border rounded-lg">
                <option value="">All Transactions</option>
                <option value="payment">Payments</option>
                <option value="escrow_release">Escrow Releases</option>
                <option value="withdrawal">Withdrawals</option>
                <option value="refund">Refunds</option>
              </select>
            </div>

            <div class="space-y-3">
              @for (transaction of filteredTransactions; track transaction.id) {
                <div class="border rounded-lg p-4 hover:bg-gray-50">
                  <div class="flex justify-between items-start">
                    <div class="flex items-start gap-3">
                      <div class="w-10 h-10 rounded-full flex items-center justify-center"
                           [class.bg-green-100]="transaction.type === 'payment' || transaction.type === 'escrow_release'"
                           [class.bg-red-100]="transaction.type === 'withdrawal'"
                           [class.bg-yellow-100]="transaction.type === 'refund'">
                        <svg class="w-5 h-5"
                             [class.text-green-600]="transaction.type === 'payment' || transaction.type === 'escrow_release'"
                             [class.text-red-600]="transaction.type === 'withdrawal'"
                             [class.text-yellow-600]="transaction.type === 'refund'"
                             fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                [attr.d]="getTransactionIcon(transaction.type)"/>
                        </svg>
                      </div>
                      <div>
                        <p class="font-medium">{{ transaction.description }}</p>
                        <p class="text-sm text-gray-600">{{ transaction.createdAt | date:'medium' }}</p>
                      </div>
                    </div>
                    <div class="text-right">
                      <p class="font-semibold text-lg"
                         [class.text-green-600]="transaction.type === 'payment' || transaction.type === 'escrow_release'"
                         [class.text-red-600]="transaction.type === 'withdrawal'"
                         [class.text-yellow-600]="transaction.type === 'refund'">
                        {{ transaction.type === 'withdrawal' ? '-' : '+' }}\${{ transaction.amount | number:'1.2-2' }}
                      </p>
                      <span class="text-xs px-2 py-1 rounded-full"
                            [class.bg-green-100]="transaction.status === 'completed'"
                            [class.text-green-600]="transaction.status === 'completed'"
                            [class.bg-yellow-100]="transaction.status === 'processing'"
                            [class.text-yellow-600]="transaction.status === 'processing'"
                            [class.bg-red-100]="transaction.status === 'failed'"
                            [class.text-red-600]="transaction.status === 'failed'">
                        {{ transaction.status }}
                      </span>
                    </div>
                  </div>
                </div>
              }
            </div>
          </div>

          <!-- Escrow Tab -->
          <div *ngSwitchCase="'escrow'" class="bg-white rounded-lg shadow-md p-6">
            <h2 class="text-xl font-semibold mb-6">Escrow Accounts</h2>

            @if (escrowAccounts.length > 0) {
              <div class="space-y-4">
                @for (escrow of escrowAccounts; track escrow.id) {
                  <div class="border rounded-lg p-4">
                    <div class="flex justify-between items-start mb-3">
                      <div>
                        <p class="font-medium">Order #{{ escrow.orderId }}</p>
                        <p class="text-sm text-gray-600">Created {{ escrow.createdAt | date:'shortDate' }}</p>
                      </div>
                      <span class="px-3 py-1 rounded-full text-sm font-medium"
                            [class.bg-blue-100]="escrow.status === 'active'"
                            [class.text-blue-600]="escrow.status === 'active'"
                            [class.bg-green-100]="escrow.status === 'released'"
                            [class.text-green-600]="escrow.status === 'released'"
                            [class.bg-red-100]="escrow.status === 'disputed'"
                            [class.text-red-600]="escrow.status === 'disputed'">
                        {{ escrow.status }}
                      </span>
                    </div>

                    <div class="mb-3">
                      <p class="text-2xl font-bold text-gray-800">\${{ escrow.amount | number:'1.2-2' }}</p>
                    </div>

                    @if (escrow.milestones && escrow.milestones.length > 0) {
                      <div class="border-t pt-3">
                        <p class="text-sm font-medium mb-2">Milestones:</p>
                        <div class="space-y-2">
                          @for (milestone of escrow.milestones; track milestone.id) {
                            <div class="flex justify-between items-center text-sm">
                              <div class="flex items-center gap-2">
                                <div class="w-2 h-2 rounded-full"
                                     [class.bg-gray-300]="milestone.status === 'pending'"
                                     [class.bg-blue-500]="milestone.status === 'funded'"
                                     [class.bg-green-500]="milestone.status === 'released'"></div>
                                <span>{{ milestone.description }}</span>
                              </div>
                              <span class="font-medium">\${{ milestone.amount | number:'1.2-2' }}</span>
                            </div>
                          }
                        </div>
                      </div>
                    }

                    <div class="mt-4 flex gap-2">
                      @if (escrow.status === 'active') {
                        <button (click)="releaseEscrow(escrow.id)"
                                class="text-sm bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                          Release Funds
                        </button>
                        <button (click)="disputeEscrow(escrow.id)"
                                class="text-sm border border-red-600 text-red-600 px-4 py-2 rounded hover:bg-red-50">
                          Dispute
                        </button>
                      }
                    </div>
                  </div>
                }
              </div>
            } @else {
              <p class="text-center text-gray-500 py-8">No active escrow accounts</p>
            }
          </div>

          <!-- Payment Methods Tab -->
          <div *ngSwitchCase="'payment-methods'" class="bg-white rounded-lg shadow-md p-6">
            <div class="flex justify-between items-center mb-6">
              <h2 class="text-xl font-semibold">Payment Methods</h2>
              <button (click)="showAddPaymentModal = true"
                      class="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
                + Add New Method
              </button>
            </div>

            <div class="grid md:grid-cols-2 gap-4">
              @for (method of paymentMethods; track method.id) {
                <div class="border rounded-lg p-4" [class.border-green-500]="method.isDefault">
                  <div class="flex justify-between items-start">
                    <div class="flex items-center gap-3">
                      <div class="w-12 h-12 bg-gray-100 rounded flex items-center justify-center">
                        @if (method.type === 'card') {
                          <svg class="w-8 h-8 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z"/>
                            <path fill-rule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clip-rule="evenodd"/>
                          </svg>
                        }
                      </div>
                      <div>
                        <p class="font-medium">
                          {{ method.brand }} •••• {{ method.last4 }}
                        </p>
                        <p class="text-sm text-gray-600">
                          Expires {{ method.expiryMonth }}/{{ method.expiryYear }}
                        </p>
                      </div>
                    </div>
                    @if (method.isDefault) {
                      <span class="text-xs bg-green-100 text-green-600 px-2 py-1 rounded">Default</span>
                    }
                  </div>

                  <div class="mt-4 flex gap-2">
                    @if (!method.isDefault) {
                      <button (click)="setDefaultPaymentMethod(method.id)"
                              class="text-sm text-green-600 hover:text-green-700">
                        Set as Default
                      </button>
                    }
                    <button (click)="removePaymentMethod(method.id)"
                            class="text-sm text-red-600 hover:text-red-700">
                      Remove
                    </button>
                  </div>
                </div>
              }
            </div>
          </div>
        </div>
      </div>

      <!-- Withdraw Modal -->
      @if (showWithdrawModal) {
        <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div class="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 class="text-xl font-semibold mb-4">Withdraw Funds</h3>

            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-2">Amount</label>
              <div class="relative">
                <span class="absolute left-3 top-3 text-gray-500">\$</span>
                <input type="number" [(ngModel)]="withdrawAmount"
                       [max]="balance"
                       class="w-full pl-8 pr-3 py-3 border rounded-lg">
              </div>
              <p class="text-sm text-gray-600 mt-1">
                Available: \${{ balance | number:'1.2-2' }}
              </p>
            </div>

            <div class="mb-6">
              <label class="block text-sm font-medium text-gray-700 mb-2">Withdraw to</label>
              <select [(ngModel)]="selectedWithdrawMethod" class="w-full px-3 py-3 border rounded-lg">
                @for (method of paymentMethods; track method.id) {
                  <option [value]="method.id">
                    {{ method.brand }} •••• {{ method.last4 }}
                  </option>
                }
              </select>
            </div>

            <div class="flex gap-3">
              <button (click)="processWithdrawal()"
                      class="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700">
                Withdraw
              </button>
              <button (click)="showWithdrawModal = false"
                      class="flex-1 border border-gray-300 py-2 rounded-lg hover:bg-gray-50">
                Cancel
              </button>
            </div>
          </div>
        </div>
      }
    </div>
  `,
  styles: []
})
export class PaymentManagementComponent implements OnInit {
  balance = 0;
  totalInEscrow = 0;
  pendingAmount = 0;
  monthlyEarnings = 0;

  activeTab = 'transactions';
  tabs = [
    { id: 'transactions', label: 'Transactions' },
    { id: 'escrow', label: 'Escrow' },
    { id: 'payment-methods', label: 'Payment Methods' }
  ];

  transactions: Transaction[] = [];
  filteredTransactions: Transaction[] = [];
  transactionFilter = '';

  escrowAccounts: EscrowAccount[] = [];
  paymentMethods: PaymentMethod[] = [];

  showWithdrawModal = false;
  showAddPaymentModal = false;
  withdrawAmount = 0;
  selectedWithdrawMethod = '';

  constructor(private paymentService: StripePaymentService) {}

  ngOnInit() {
    this.loadPaymentData();
  }

  loadPaymentData() {
    // Load balance
    this.paymentService.getBalance('current_user').subscribe(balance => {
      this.balance = balance;
    });

    // Load transactions
    this.paymentService.getTransactionHistory('current_user').subscribe(transactions => {
      this.transactions = transactions;
      this.filterTransactions();
      this.calculateMonthlyEarnings();
    });

    // Load escrow accounts
    this.paymentService.getEscrowAccounts('current_user').subscribe(accounts => {
      this.escrowAccounts = accounts;
      this.calculateEscrowTotal();
    });

    // Load payment methods
    this.paymentService.getPaymentMethods('current_user').subscribe(methods => {
      this.paymentMethods = methods;
      if (methods.length > 0) {
        this.selectedWithdrawMethod = methods[0].id;
      }
    });
  }

  filterTransactions() {
    if (this.transactionFilter) {
      this.filteredTransactions = this.transactions.filter(t => t.type === this.transactionFilter);
    } else {
      this.filteredTransactions = this.transactions;
    }
  }

  calculateMonthlyEarnings() {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    this.monthlyEarnings = this.transactions
      .filter(t =>
        (t.type === 'payment' || t.type === 'escrow_release') &&
        t.status === 'completed' &&
        new Date(t.createdAt) >= startOfMonth
      )
      .reduce((sum, t) => sum + t.amount, 0);
  }

  calculateEscrowTotal() {
    this.totalInEscrow = this.escrowAccounts
      .filter(e => e.status === 'active')
      .reduce((sum, e) => sum + e.amount, 0);
  }

  releaseEscrow(escrowId: string) {
    this.paymentService.releaseEscrowFunds(escrowId).subscribe(() => {
      this.loadPaymentData();
    });
  }

  disputeEscrow(escrowId: string) {
    // Navigate to dispute page
    console.log('Disputing escrow:', escrowId);
  }

  setDefaultPaymentMethod(methodId: string) {
    this.paymentService.setDefaultPaymentMethod('current_user', methodId).subscribe(() => {
      this.loadPaymentData();
    });
  }

  removePaymentMethod(methodId: string) {
    if (confirm('Are you sure you want to remove this payment method?')) {
      this.paymentService.removePaymentMethod(methodId).subscribe(() => {
        this.loadPaymentData();
      });
    }
  }

  processWithdrawal() {
    if (this.withdrawAmount > 0 && this.withdrawAmount <= this.balance) {
      this.paymentService.withdrawFunds(this.withdrawAmount, this.selectedWithdrawMethod).subscribe(() => {
        this.showWithdrawModal = false;
        this.withdrawAmount = 0;
        this.loadPaymentData();
      });
    }
  }

  getTransactionIcon(type: string): string {
    const icons: { [key: string]: string } = {
      'payment': 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
      'escrow_release': 'M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V2',
      'withdrawal': 'M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z',
      'refund': 'M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6'
    };
    return icons[type] || icons['payment'];
  }
}
