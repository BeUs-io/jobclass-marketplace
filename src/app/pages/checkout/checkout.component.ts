import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { PaymentService, CheckoutSession, PromoCode } from '../../services/payment.service';
import { AuthService, User } from '../../services/auth.service';
import { Observable, of } from 'rxjs';
import { map, take } from 'rxjs/operators';

interface PaymentFormData {
  // Billing Info
  fullName: string;
  email: string;
  company?: string;

  // Payment Method
  paymentMethod: 'stripe' | 'paypal';

  // Card Details (Stripe)
  cardNumber?: string;
  expiryMonth?: string;
  expiryYear?: string;
  cvv?: string;

  // Billing Address
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;

  // Additional
  savePaymentMethod: boolean;
  agreeToTerms: boolean;
}

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="min-h-screen bg-gray-50 py-8">
      <div class="container mx-auto px-4">
        <div class="max-w-6xl mx-auto">
          <!-- Progress Steps -->
          <div class="mb-8">
            <div class="flex items-center justify-center">
              <div class="flex items-center">
                <div class="flex items-center justify-center w-10 h-10 rounded-full"
                     [class.bg-primary]="currentStep >= 1"
                     [class.text-white]="currentStep >= 1"
                     [class.bg-gray-300]="currentStep < 1">
                  <span class="font-semibold">1</span>
                </div>
                <span class="ml-2 text-sm font-medium"
                      [class.text-primary]="currentStep >= 1">
                  Plan Selection
                </span>
              </div>

              <div class="w-16 h-0.5 mx-2"
                   [class.bg-primary]="currentStep >= 2"
                   [class.bg-gray-300]="currentStep < 2"></div>

              <div class="flex items-center">
                <div class="flex items-center justify-center w-10 h-10 rounded-full"
                     [class.bg-primary]="currentStep >= 2"
                     [class.text-white]="currentStep >= 2"
                     [class.bg-gray-300]="currentStep < 2">
                  <span class="font-semibold">2</span>
                </div>
                <span class="ml-2 text-sm font-medium"
                      [class.text-primary]="currentStep >= 2">
                  Payment Details
                </span>
              </div>

              <div class="w-16 h-0.5 mx-2"
                   [class.bg-primary]="currentStep >= 3"
                   [class.bg-gray-300]="currentStep < 3"></div>

              <div class="flex items-center">
                <div class="flex items-center justify-center w-10 h-10 rounded-full"
                     [class.bg-primary]="currentStep >= 3"
                     [class.text-white]="currentStep >= 3"
                     [class.bg-gray-300]="currentStep < 3">
                  <span class="font-semibold">3</span>
                </div>
                <span class="ml-2 text-sm font-medium"
                      [class.text-primary]="currentStep >= 3">
                  Confirmation
                </span>
              </div>
            </div>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <!-- Main Content -->
            <div class="lg:col-span-2">
              <!-- Step 1: Plan Review -->
              <div *ngIf="currentStep === 1" class="bg-white rounded-lg shadow-sm p-6">
                <h2 class="text-2xl font-bold mb-6">Review Your Plan</h2>

                <div *ngIf="checkoutSession$ | async as session" class="border rounded-lg p-4 mb-6">
                  <div class="flex justify-between items-start">
                    <div>
                      <h3 class="text-lg font-semibold">{{session.planName}} Plan</h3>
                      <p class="text-gray-600">Billed {{session.interval}}ly</p>
                    </div>
                    <div class="text-right">
                      <p class="text-2xl font-bold">{{session.amount}}</p>
                      <p class="text-sm text-gray-600">per {{session.interval}}</p>
                    </div>
                  </div>
                </div>

                <!-- Promo Code -->
                <div class="mb-6">
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Promo Code (Optional)
                  </label>
                  <div class="flex gap-2">
                    <input
                      type="text"
                      [(ngModel)]="promoCode"
                      placeholder="Enter promo code"
                      class="input-field flex-1"
                      [disabled]="promoApplied"
                    >
                    <button
                      *ngIf="!promoApplied"
                      (click)="applyPromoCode()"
                      [disabled]="isApplyingPromo"
                      class="btn btn-outline"
                    >
                      {{isApplyingPromo ? 'Applying...' : 'Apply'}}
                    </button>
                    <button
                      *ngIf="promoApplied"
                      (click)="removePromoCode()"
                      class="btn btn-outline"
                    >
                      Remove
                    </button>
                  </div>
                  <div *ngIf="promoMessage" class="mt-2">
                    <p [class.text-green-600]="promoApplied"
                       [class.text-red-600]="!promoApplied"
                       class="text-sm">
                      {{promoMessage}}
                    </p>
                  </div>
                </div>

                <!-- Available Promotions -->
                <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <h4 class="font-semibold text-blue-900 mb-2">🎉 Available Promotions</h4>
                  <div class="space-y-2">
                    <div class="flex items-center justify-between">
                      <span class="text-sm text-blue-800">New User Discount</span>
                      <code class="bg-white px-2 py-1 rounded text-xs font-mono">WELCOME20</code>
                    </div>
                    <div class="flex items-center justify-between">
                      <span class="text-sm text-blue-800">Student Discount (Basic Plan)</span>
                      <code class="bg-white px-2 py-1 rounded text-xs font-mono">STUDENT</code>
                    </div>
                    <ng-container *ngIf="(checkoutSession$ | async) as session">
                      <div *ngIf="session.amount >= 99" class="flex items-center justify-between">
                        <span class="text-sm text-blue-800">Save $50 on Pro Plans</span>
                        <code class="bg-white px-2 py-1 rounded text-xs font-mono">SAVE50</code>
                      </div>
                    </ng-container>
                  </div>
                </div>

                <button (click)="nextStep()" class="btn btn-primary w-full">
                  Continue to Payment
                </button>
              </div>

              <!-- Step 2: Payment Information -->
              <div *ngIf="currentStep === 2" class="space-y-6">
                <!-- Billing Information -->
                <div class="bg-white rounded-lg shadow-sm p-6">
                  <h2 class="text-xl font-semibold mb-4">Billing Information</h2>

                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">
                        Full Name <span class="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        [(ngModel)]="paymentForm.fullName"
                        class="input-field"
                        required
                      >
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">
                        Email <span class="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        [(ngModel)]="paymentForm.email"
                        class="input-field"
                        required
                      >
                    </div>
                    <div class="md:col-span-2">
                      <label class="block text-sm font-medium text-gray-700 mb-2">
                        Company (Optional)
                      </label>
                      <input
                        type="text"
                        [(ngModel)]="paymentForm.company"
                        class="input-field"
                      >
                    </div>
                  </div>
                </div>

                <!-- Payment Method -->
                <div class="bg-white rounded-lg shadow-sm p-6">
                  <h2 class="text-xl font-semibold mb-4">Payment Method</h2>

                  <!-- Payment Method Selection -->
                  <div class="grid grid-cols-2 gap-4 mb-6">
                    <button
                      (click)="paymentForm.paymentMethod = 'stripe'"
                      [class.ring-2]="paymentForm.paymentMethod === 'stripe'"
                      [class.ring-primary]="paymentForm.paymentMethod === 'stripe'"
                      class="border rounded-lg p-4 text-center hover:bg-gray-50 transition-colors"
                    >
                      <svg class="w-16 h-8 mx-auto mb-2" viewBox="0 0 60 25">
                        <path fill="#6772E5" d="M59.64 14.28h-8.06c.19 1.93 1.6 2.55 3.2 2.55 1.64 0 2.96-.37 4.05-.95v3.32a8.33 8.33 0 0 1-4.56 1.1c-4.01 0-6.83-2.5-6.83-7.48 0-4.19 2.39-7.52 6.3-7.52 3.92 0 5.96 3.28 5.96 7.5 0 .4-.04 1.26-.06 1.48zm-5.92-5.62c-1.03 0-2.17.73-2.17 2.58h4.25c0-1.85-1.07-2.58-2.08-2.58zM40.95 20.3c-1.44 0-2.32-.6-2.9-1.04l-.02 4.63-4.12.87V5.57h3.76l.08 1.02a4.7 4.7 0 0 1 3.23-1.29c2.9 0 5.62 2.6 5.62 7.4 0 5.23-2.7 7.6-5.65 7.6zM40 8.95c-.95 0-1.54.34-1.97.81l.02 6.12c.4.44.98.78 1.95.78 1.52 0 2.54-1.65 2.54-3.87 0-2.15-1.04-3.84-2.54-3.84zM28.24 5.57h4.13v14.44h-4.13V5.57zm0-4.7L32.37 0v3.36l-4.13.88V.88zm-3.06 9.01v9.99H21.1V5.54h3.79l.08 1.02a3.2 3.2 0 0 1 2.88-1.29v4.14c-1.31 0-2.18.23-2.67.38v.09zm-8.62 10.45c-4.02 0-6.8-2.71-6.8-7.58 0-5.02 2.9-7.52 6.84-7.52 1.7 0 3.16.3 4.38.85v3.53a7.38 7.38 0 0 0-3.78-1.01c-1.87 0-3.02 1.22-3.02 3.88 0 2.71 1.09 4.11 3 4.11 1.3 0 2.64-.41 3.77-1.08v3.55c-1.21.62-2.78.84-4.39.84l.01-.56zm-7.22-4.32c0 1.96 1.4 2.51 3.05 2.58v3.4a7.94 7.94 0 0 1-1.66.16c-3.5 0-5.5-1.78-5.5-4.93V8.75H3.67V5.57h1.56V1.7l4.12-.88v4.75h3.02v3.18h-3.03v5.24h.01zM2.55 15.89c.77 1.9 2.06 2.46 3.72 2.46 1.17 0 2.36-.18 3.65-.64v3.36c-1.27.49-2.73.78-4.37.78C1.62 21.85 0 19.02 0 14.55c0-4.22 2.06-7.25 5.35-7.25 1.09 0 2.11.2 2.97.55v3.5c-.88-.37-1.86-.58-2.77-.58-1.78 0-2.93 1.16-2.93 3.5 0 .9.17 1.83.52 2.6l-.6.02z"/>
                      </svg>
                      <span class="text-sm font-medium">Credit/Debit Card</span>
                    </button>
                    <button
                      (click)="paymentForm.paymentMethod = 'paypal'"
                      [class.ring-2]="paymentForm.paymentMethod === 'paypal'"
                      [class.ring-primary]="paymentForm.paymentMethod === 'paypal'"
                      class="border rounded-lg p-4 text-center hover:bg-gray-50 transition-colors"
                    >
                      <svg class="w-16 h-8 mx-auto mb-2" viewBox="0 0 124 33">
                        <path fill="#253B80" d="M46.211 6.749h-6.839a.95.95 0 0 0-.939.802l-2.766 17.537a.57.57 0 0 0 .564.658h3.265a.95.95 0 0 0 .939-.803l.746-4.73a.95.95 0 0 1 .938-.803h2.165c4.505 0 7.105-2.18 7.784-6.5.306-1.89.013-3.375-.872-4.415-.972-1.142-2.696-1.746-4.985-1.746zM47 13.154c-.374 2.454-2.249 2.454-4.062 2.454h-1.032l.724-4.583a.57.57 0 0 1 .563-.481h.473c1.235 0 2.4 0 3.002.704.359.42.469 1.044.332 1.906zM66.654 13.075h-3.275a.57.57 0 0 0-.563.481l-.146.916-.229-.332c-.709-1.029-2.29-1.373-3.868-1.373-3.619 0-6.71 2.741-7.312 6.586-.313 1.918.132 3.752 1.22 5.03.998 1.177 2.426 1.666 4.125 1.666 2.916 0 4.533-1.875 4.533-1.875l-.146.91a.57.57 0 0 0 .562.66h2.95a.95.95 0 0 0 .939-.804l1.77-11.208a.57.57 0 0 0-.56-.657zm-4.565 6.374c-.316 1.871-1.801 3.127-3.695 3.127-.951 0-1.711-.305-2.199-.883-.484-.574-.668-1.392-.514-2.301.295-1.855 1.805-3.152 3.67-3.152.93 0 1.686.309 2.184.892.499.589.697 1.411.554 2.317zM84.096 13.075h-3.291a.955.955 0 0 0-.787.417l-4.539 6.686-1.924-6.425a.953.953 0 0 0-.912-.678H69.41a.57.57 0 0 0-.541.754l3.625 10.638-3.408 4.811a.57.57 0 0 0 .465.9h3.287a.949.949 0 0 0 .781-.408l10.946-15.8a.57.57 0 0 0-.469-.895z"/>
                        <path fill="#179BD7" d="M94.992 6.749h-6.84a.95.95 0 0 0-.938.802l-2.767 17.537a.57.57 0 0 0 .563.658h3.51a.665.665 0 0 0 .656-.563l.785-4.971a.95.95 0 0 1 .938-.803h2.164c4.506 0 7.105-2.18 7.785-6.5.307-1.89.012-3.375-.873-4.415-.971-1.141-2.694-1.745-4.983-1.745zm.789 6.405c-.373 2.454-2.248 2.454-4.063 2.454h-1.031l.724-4.583a.568.568 0 0 1 .562-.481h.474c1.233 0 2.399 0 3.002.704.359.42.468 1.044.332 1.906zM115.434 13.075h-3.272a.566.566 0 0 0-.562.481l-.146.916-.229-.332c-.71-1.029-2.289-1.373-3.867-1.373-3.619 0-6.709 2.741-7.312 6.586-.312 1.918.131 3.752 1.22 5.03 1 1.177 2.426 1.666 4.125 1.666 2.916 0 4.532-1.875 4.532-1.875l-.146.91a.57.57 0 0 0 .563.66h2.949a.95.95 0 0 0 .938-.804l1.771-11.208a.57.57 0 0 0-.564-.657zm-4.565 6.374c-.315 1.871-1.801 3.127-3.695 3.127-.949 0-1.71-.305-2.198-.883-.483-.574-.667-1.392-.513-2.301.293-1.855 1.803-3.152 3.668-3.152.93 0 1.686.309 2.185.892.498.589.696 1.411.553 2.317zM119.295 7.23l-2.807 17.858a.569.569 0 0 0 .562.658h2.822c.469 0 .866-.34.938-.803l2.769-17.536a.57.57 0 0 0-.562-.659h-3.16a.571.571 0 0 0-.562.482z"/>
                      </svg>
                      <span class="text-sm font-medium">PayPal</span>
                    </button>
                  </div>

                  <!-- Stripe Card Form -->
                  <div *ngIf="paymentForm.paymentMethod === 'stripe'" class="space-y-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">
                        Card Number <span class="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        [(ngModel)]="paymentForm.cardNumber"
                        placeholder="1234 5678 9012 3456"
                        maxlength="19"
                        (input)="formatCardNumber($event)"
                        class="input-field"
                        required
                      >
                    </div>
                    <div class="grid grid-cols-2 gap-4">
                      <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">
                          Expiry Date <span class="text-red-500">*</span>
                        </label>
                        <div class="flex gap-2">
                          <input
                            type="text"
                            [(ngModel)]="paymentForm.expiryMonth"
                            placeholder="MM"
                            maxlength="2"
                            class="input-field"
                            required
                          >
                          <input
                            type="text"
                            [(ngModel)]="paymentForm.expiryYear"
                            placeholder="YY"
                            maxlength="2"
                            class="input-field"
                            required
                          >
                        </div>
                      </div>
                      <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">
                          CVV <span class="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          [(ngModel)]="paymentForm.cvv"
                          placeholder="123"
                          maxlength="4"
                          class="input-field"
                          required
                        >
                      </div>
                    </div>
                  </div>

                  <!-- PayPal -->
                  <div *ngIf="paymentForm.paymentMethod === 'paypal'" class="text-center py-8">
                    <svg class="w-24 h-24 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                    </svg>
                    <p class="text-gray-600">You will be redirected to PayPal to complete your payment securely.</p>
                  </div>
                </div>

                <!-- Billing Address -->
                <div class="bg-white rounded-lg shadow-sm p-6">
                  <h2 class="text-xl font-semibold mb-4">Billing Address</h2>

                  <div class="space-y-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">
                        Street Address <span class="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        [(ngModel)]="paymentForm.address"
                        class="input-field"
                        required
                      >
                    </div>
                    <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">
                          City <span class="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          [(ngModel)]="paymentForm.city"
                          class="input-field"
                          required
                        >
                      </div>
                      <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">
                          State/Province <span class="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          [(ngModel)]="paymentForm.state"
                          class="input-field"
                          required
                        >
                      </div>
                      <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">
                          ZIP Code <span class="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          [(ngModel)]="paymentForm.zipCode"
                          class="input-field"
                          required
                        >
                      </div>
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">
                        Country <span class="text-red-500">*</span>
                      </label>
                      <select
                        [(ngModel)]="paymentForm.country"
                        class="input-field"
                        required
                      >
                        <option value="">Select Country</option>
                        <option value="US">United States</option>
                        <option value="CA">Canada</option>
                        <option value="GB">United Kingdom</option>
                        <option value="AU">Australia</option>
                        <option value="DE">Germany</option>
                        <option value="FR">France</option>
                        <option value="ES">Spain</option>
                        <option value="IT">Italy</option>
                        <option value="JP">Japan</option>
                        <option value="CN">China</option>
                        <option value="IN">India</option>
                        <option value="BR">Brazil</option>
                      </select>
                    </div>
                  </div>

                  <div class="mt-6 space-y-3">
                    <label class="flex items-center">
                      <input
                        type="checkbox"
                        [(ngModel)]="paymentForm.savePaymentMethod"
                        class="mr-2"
                      >
                      <span class="text-sm text-gray-700">Save payment method for future purchases</span>
                    </label>
                    <label class="flex items-start">
                      <input
                        type="checkbox"
                        [(ngModel)]="paymentForm.agreeToTerms"
                        class="mr-2 mt-0.5"
                        required
                      >
                      <span class="text-sm text-gray-700">
                        I agree to the <a href="#" class="text-primary hover:underline">Terms of Service</a>
                        and <a href="#" class="text-primary hover:underline">Privacy Policy</a>
                      </span>
                    </label>
                  </div>
                </div>

                <div class="flex gap-4">
                  <button (click)="previousStep()" class="btn btn-outline flex-1">
                    Back
                  </button>
                  <button
                    (click)="nextStep()"
                    [disabled]="!isPaymentFormValid()"
                    class="btn btn-primary flex-1"
                  >
                    Review Order
                  </button>
                </div>
              </div>

              <!-- Step 3: Confirmation -->
              <div *ngIf="currentStep === 3" class="space-y-6">
                <div class="bg-white rounded-lg shadow-sm p-6">
                  <h2 class="text-2xl font-bold mb-6">Review and Confirm</h2>

                  <!-- Order Summary -->
                  <div class="border-b pb-6 mb-6">
                    <h3 class="font-semibold mb-4">Order Summary</h3>
                    <div *ngIf="checkoutSession$ | async as session" class="space-y-3">
                      <div class="flex justify-between">
                        <span>{{session.planName}} Plan ({{session.interval}}ly)</span>
                        <span>{{session.amount}}</span>
                      </div>
                      <div *ngIf="session.promoCode" class="flex justify-between text-green-600">
                        <span>Discount ({{session.promoCode.code}})</span>
                        <span>-<span>{{session.discountAmount}}</span></span>
                      </div>
                      <div class="flex justify-between font-semibold text-lg pt-3 border-t">
                        <span>Total</span>
                        <span>{{session.finalAmount}}</span>
                      </div>
                    </div>
                  </div>

                  <!-- Billing Information -->
                  <div class="border-b pb-6 mb-6">
                    <h3 class="font-semibold mb-4">Billing Information</h3>
                    <div class="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span class="text-gray-600">Name:</span>
                        <p class="font-medium">{{paymentForm.fullName}}</p>
                      </div>
                      <div>
                        <span class="text-gray-600">Email:</span>
                        <p class="font-medium">{{paymentForm.email}}</p>
                      </div>
                      <div *ngIf="paymentForm.company">
                        <span class="text-gray-600">Company:</span>
                        <p class="font-medium">{{paymentForm.company}}</p>
                      </div>
                    </div>
                  </div>

                  <!-- Payment Method -->
                  <div class="border-b pb-6 mb-6">
                    <h3 class="font-semibold mb-4">Payment Method</h3>
                    <div class="flex items-center">
                      <svg *ngIf="paymentForm.paymentMethod === 'stripe'" class="w-12 h-6 mr-3" viewBox="0 0 60 25">
                        <path fill="#6772E5" d="M59.64 14.28h-8.06c.19 1.93 1.6 2.55 3.2 2.55 1.64 0 2.96-.37 4.05-.95v3.32a8.33 8.33 0 0 1-4.56 1.1c-4.01 0-6.83-2.5-6.83-7.48 0-4.19 2.39-7.52 6.3-7.52 3.92 0 5.96 3.28 5.96 7.5 0 .4-.04 1.26-.06 1.48zm-5.92-5.62c-1.03 0-2.17.73-2.17 2.58h4.25c0-1.85-1.07-2.58-2.08-2.58z"/>
                      </svg>
                      <svg *ngIf="paymentForm.paymentMethod === 'paypal'" class="w-12 h-6 mr-3" viewBox="0 0 124 33">
                        <path fill="#253B80" d="M46.211 6.749h-6.839a.95.95 0 0 0-.939.802l-2.766 17.537a.57.57 0 0 0 .564.658h3.265a.95.95 0 0 0 .939-.803l.746-4.73a.95.95 0 0 1 .938-.803h2.165c4.505 0 7.105-2.18 7.784-6.5.306-1.89.013-3.375-.872-4.415-.972-1.142-2.696-1.746-4.985-1.746z"/>
                      </svg>
                      <div>
                        <p class="font-medium">
                          {{paymentForm.paymentMethod === 'stripe' ? 'Credit Card' : 'PayPal'}}
                        </p>
                        <p *ngIf="paymentForm.cardNumber" class="text-sm text-gray-600">
                          •••• {{paymentForm.cardNumber.slice(-4)}}
                        </p>
                      </div>
                    </div>
                  </div>

                  <!-- Billing Address -->
                  <div class="mb-6">
                    <h3 class="font-semibold mb-4">Billing Address</h3>
                    <p class="text-sm text-gray-600">
                      {{paymentForm.address}}<br>
                      {{paymentForm.city}}, {{paymentForm.state}} {{paymentForm.zipCode}}<br>
                      {{paymentForm.country}}
                    </p>
                  </div>

                  <!-- Security Badge -->
                  <div class="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                    <div class="flex items-center">
                      <svg class="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                      </svg>
                      <span class="text-sm text-green-800">Your payment information is encrypted and secure</span>
                    </div>
                  </div>

                  <div class="flex gap-4">
                    <button (click)="previousStep()" class="btn btn-outline flex-1">
                      Back
                    </button>
                    <button
                      (click)="processPayment()"
                      [disabled]="isProcessing"
                      class="btn btn-primary flex-1"
                    >
                      {{isProcessing ? 'Processing...' : 'Complete Purchase'}}
                    </button>
                  </div>
                </div>
              </div>

              <!-- Success Message -->
              <div *ngIf="paymentSuccess" class="bg-white rounded-lg shadow-sm p-8 text-center">
                <div class="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg class="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                <h2 class="text-2xl font-bold mb-2">Payment Successful!</h2>
                <p class="text-gray-600 mb-6">Thank you for your purchase. Your subscription is now active.</p>
                <div class="space-y-2 mb-6">
                  <ng-container *ngIf="checkoutSession$ | async as session">
                    <p class="text-sm text-gray-600">
                      Order ID: <span class="font-mono">{{session.id}}</span>
                    </p>
                  </ng-container>
                  <p class="text-sm text-gray-600">
                    A confirmation email has been sent to {{paymentForm.email}}
                  </p>
                </div>
                <div class="flex gap-4 justify-center">
                  <a routerLink="/profile" class="btn btn-primary">
                    View Subscription
                  </a>
                  <a routerLink="/" class="btn btn-outline">
                    Back to Home
                  </a>
                </div>
              </div>
            </div>

            <!-- Order Summary Sidebar -->
            <div class="lg:col-span-1">
              <div class="bg-white rounded-lg shadow-sm p-6 sticky top-4">
                <h3 class="font-semibold mb-4">Order Summary</h3>

                <div *ngIf="checkoutSession$ | async as session" class="space-y-4">
                  <!-- Plan Details -->
                  <div>
                    <p class="font-medium">{{session.planName}} Plan</p>
                    <p class="text-sm text-gray-600">Billed {{session.interval}}ly</p>
                  </div>

                  <!-- Price Breakdown -->
                  <div class="space-y-2 py-4 border-t border-b">
                    <div class="flex justify-between text-sm">
                      <span>Subtotal</span>
                      <span>{{session.amount}}</span>
                    </div>
                    <div *ngIf="session.promoCode" class="flex justify-between text-sm text-green-600">
                      <span>Discount</span>
                      <span>-<span>{{session.discountAmount}}</span></span>
                    </div>
                    <div class="flex justify-between text-sm">
                      <span>Tax</span>
                      <span>0</span>
                    </div>
                  </div>

                  <!-- Total -->
                  <div class="flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span>{{session.finalAmount}}</span>
                  </div>

                  <!-- Next Billing -->
                  <div class="text-sm text-gray-600">
                    <p *ngIf="session.interval === 'month'">
                      Next billing date: {{getNextBillingDate('month') | date: 'MMM d, yyyy'}}
                    </p>
                    <p *ngIf="session.interval === 'year'">
                      Next billing date: {{getNextBillingDate('year') | date: 'MMM d, yyyy'}}
                    </p>
                  </div>
                </div>

                <!-- Security Badges -->
                <div class="mt-6 pt-6 border-t">
                  <div class="flex items-center justify-center space-x-4 mb-4">
                    <svg class="w-12 h-8" viewBox="0 0 60 25">
                      <path fill="#6772E5" d="M59.64 14.28h-8.06c.19 1.93 1.6 2.55 3.2 2.55 1.64 0 2.96-.37 4.05-.95v3.32a8.33 8.33 0 0 1-4.56 1.1c-4.01 0-6.83-2.5-6.83-7.48 0-4.19 2.39-7.52 6.3-7.52 3.92 0 5.96 3.28 5.96 7.5 0 .4-.04 1.26-.06 1.48z"/>
                    </svg>
                    <svg class="w-12 h-8" viewBox="0 0 124 33">
                      <path fill="#253B80" d="M46.211 6.749h-6.839a.95.95 0 0 0-.939.802l-2.766 17.537a.57.57 0 0 0 .564.658h3.265a.95.95 0 0 0 .939-.803l.746-4.73a.95.95 0 0 1 .938-.803h2.165c4.505 0 7.105-2.18 7.784-6.5.306-1.89.013-3.375-.872-4.415-.972-1.142-2.696-1.746-4.985-1.746z"/>
                    </svg>
                  </div>
                  <p class="text-xs text-center text-gray-500">
                    <svg class="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                    </svg>
                    SSL Secure Payment
                  </p>
                  <p class="text-xs text-center text-gray-500 mt-2">
                    Your information is protected by 256-bit SSL encryption
                  </p>
                </div>

                <!-- Money Back Guarantee -->
                <div class="mt-6 p-4 bg-yellow-50 rounded-lg">
                  <div class="flex items-center text-yellow-800">
                    <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                    </svg>
                    <span class="text-sm font-medium">30-Day Money Back Guarantee</span>
                  </div>
                  <p class="text-xs text-yellow-700 mt-1">
                    Not satisfied? Get a full refund within 30 days.
                  </p>
                </div>

                <!-- Support -->
                <div class="mt-6 text-center">
                  <p class="text-sm text-gray-600">Need help?</p>
                  <a href="#" class="text-primary hover:underline text-sm">Contact Support</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    input[type="text"]::-webkit-inner-spin-button,
    input[type="text"]::-webkit-outer-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
  `]
})
export class CheckoutComponent implements OnInit {
  currentStep = 1;
  checkoutSession$!: Observable<CheckoutSession | null>;
  currentUser$!: Observable<User | null>;

  promoCode = '';
  promoApplied = false;
  promoMessage = '';
  isApplyingPromo = false;

  paymentForm: PaymentFormData = {
    fullName: '',
    email: '',
    company: '',
    paymentMethod: 'stripe',
    cardNumber: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    savePaymentMethod: false,
    agreeToTerms: false
  };

  isProcessing = false;
  paymentSuccess = false;
  paymentError = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private paymentService: PaymentService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.currentUser$ = this.authService.currentUser$;

    // Pre-fill user information
    this.currentUser$.subscribe(user => {
      if (user) {
        this.paymentForm.fullName = user.name;
        this.paymentForm.email = user.email;
      }
    });

    // Get plan details from query params
    this.route.queryParams.subscribe(params => {
      const planId = params['plan'];
      const billing = params['billing'] || 'month';
      const trial = params['trial'] === 'true';

      if (planId) {
        // Create checkout session
        this.createCheckoutSession(planId, billing, trial);
      } else {
        // Redirect to pricing if no plan selected
        this.router.navigate(['/pricing']);
      }
    });

    this.checkoutSession$ = this.paymentService.checkoutSession$;
  }

  createCheckoutSession(planId: string, billing: string, trial: boolean) {
    const plans = {
      'basic': { name: 'Basic', price: billing === 'year' ? 15 : 19 },
      'professional': { name: 'Professional', price: billing === 'year' ? 79 : 99 },
      'enterprise': { name: 'Enterprise', price: billing === 'year' ? 399 : 499 }
    };

    const plan = plans[planId as keyof typeof plans];
    if (plan) {
      this.paymentService.createCheckoutSession(
        planId,
        plan.name,
        plan.price,
        billing as 'month' | 'year'
      ).subscribe();
    }
  }

  applyPromoCode() {
    if (!this.promoCode) return;

    this.isApplyingPromo = true;

    // Subscribe to get the current value
    this.checkoutSession$.pipe(take(1)).subscribe(session => {
      if (!session) return;

      setTimeout(() => {
        const promo = this.paymentService.validatePromoCode(
          this.promoCode,
          session.planId,
          session.amount
        );

        if (promo) {
          session.promoCode = promo;
          session.discountAmount = this.paymentService.calculateDiscount(session.amount, promo);
          session.finalAmount = session.amount - session.discountAmount;
          this.paymentService.updateCheckoutSession(session);

          this.promoApplied = true;
          this.promoMessage = `Promo code applied! You saved $${session.discountAmount}`;
        } else {
          this.promoMessage = 'Invalid or expired promo code';
        }

        this.isApplyingPromo = false;
      }, 500);
    });
  }

  removePromoCode() {
    this.checkoutSession$.pipe(take(1)).subscribe(session => {
      if (session) {
        session.promoCode = undefined;
        session.discountAmount = undefined;
        session.finalAmount = session.amount;
        this.paymentService.updateCheckoutSession(session);

        this.promoApplied = false;
        this.promoCode = '';
        this.promoMessage = '';
      }
    });
  }

  formatCardNumber(event: Event) {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/\s/g, '');
    let formattedValue = '';

    for (let i = 0; i < value.length; i++) {
      if (i > 0 && i % 4 === 0) {
        formattedValue += ' ';
      }
      formattedValue += value[i];
    }

    this.paymentForm.cardNumber = formattedValue;
  }

  isPaymentFormValid(): boolean {
    if (!this.paymentForm.fullName || !this.paymentForm.email) return false;
    if (!this.paymentForm.address || !this.paymentForm.city || !this.paymentForm.state) return false;
    if (!this.paymentForm.zipCode || !this.paymentForm.country) return false;
    if (!this.paymentForm.agreeToTerms) return false;

    if (this.paymentForm.paymentMethod === 'stripe') {
      if (!this.paymentForm.cardNumber || !this.paymentForm.expiryMonth) return false;
      if (!this.paymentForm.expiryYear || !this.paymentForm.cvv) return false;
    }

    return true;
  }

  nextStep() {
    if (this.currentStep < 3) {
      this.currentStep++;
    }
  }

  previousStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  processPayment() {
    // For this template, we simulate a valid form and payment process
    this.isProcessing = true;
    this.paymentError = '';

    this.checkoutSession$.pipe(take(1)).subscribe(session => {
      if (!session) return;

      // Simulate payment processing
      setTimeout(() => {
        const isSuccess = Math.random() > 0.1; // 90% success rate

        if (isSuccess) {
          session.status = 'completed';
          session.customerEmail = this.paymentForm.email;
          this.paymentService.updateCheckoutSession(session);

          // Simulate saving payment method if requested
          // (Implementation would depend on your PaymentService)
          // if (this.paymentForm.savePaymentMethod) { ... }

          // Simulate subscription creation
          // (Implementation would depend on your PaymentService)
          // this.paymentService.createSubscription(...).subscribe(() => { ... });

          this.isProcessing = false;
          this.paymentSuccess = true;
          this.currentStep = 4;
        } else {
          this.paymentError = 'Payment failed. Please check your card details and try again.';
          this.isProcessing = false;
        }
      }, 2000);
    });
  }

  getNextBillingDate(interval: 'month' | 'year'): Date {
    const date = new Date();
    if (interval === 'month') {
      date.setMonth(date.getMonth() + 1);
    } else {
      date.setFullYear(date.getFullYear() + 1);
    }
    return date;
  }
}
