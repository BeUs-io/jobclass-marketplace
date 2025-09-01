import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CurrencyService, Currency } from '../../services/currency.service';
import { ExchangeRateService } from '../../services/exchange-rate.service';
import { Subject, debounceTime, takeUntil } from 'rxjs';

@Component({
  selector: 'app-currency-calculator',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="fixed bottom-4 right-4 z-50">
      <!-- Toggle Button -->
      <button
        *ngIf="!isOpen"
        (click)="toggleCalculator()"
        class="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all transform hover:scale-110"
        title="Currency Calculator">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
      </button>

      <!-- Calculator Widget -->
      <div
        *ngIf="isOpen"
        class="bg-white rounded-lg shadow-2xl p-6 w-96 animate-slide-up">

        <!-- Header -->
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-semibold flex items-center">
            <svg class="w-5 h-5 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
            </svg>
            Currency Calculator
          </h3>
          <button
            (click)="toggleCalculator()"
            class="text-gray-400 hover:text-gray-600">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <!-- Exchange Rate Info -->
        <div *ngIf="lastUpdateTime" class="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
          <div class="flex items-center justify-between">
            <span class="text-sm text-blue-700">
              <svg class="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              Live Exchange Rates
            </span>
            <button
              (click)="refreshRates()"
              [disabled]="isRefreshing"
              class="text-xs text-blue-600 hover:text-blue-800 disabled:opacity-50">
              <svg class="w-4 h-4 inline mr-1" [class.animate-spin]="isRefreshing" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
              </svg>
              {{ isRefreshing ? 'Updating...' : 'Refresh' }}
            </button>
          </div>
          <div class="text-xs text-blue-600 mt-1">
            Last updated: {{ lastUpdateTime | date:'short' }}
          </div>
        </div>

        <!-- From Currency -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">From</label>
          <div class="flex gap-2">
            <input
              type="number"
              [(ngModel)]="fromAmount"
              (ngModelChange)="onAmountChange()"
              placeholder="Enter amount"
              class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              min="0"
              step="0.01">
            <select
              [(ngModel)]="fromCurrency"
              (change)="onCurrencyChange()"
              class="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
              <option *ngFor="let currency of availableCurrencies" [value]="currency.code">
                {{ currency.symbol }} {{ currency.code }} - {{ currency.name }}
              </option>
            </select>
          </div>
        </div>

        <!-- Swap Button -->
        <div class="flex justify-center mb-4">
          <button
            (click)="swapCurrencies()"
            class="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
            <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"></path>
            </svg>
          </button>
        </div>

        <!-- To Currency -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">To</label>
          <div class="flex gap-2">
            <input
              type="number"
              [(ngModel)]="toAmount"
              [readonly]="true"
              placeholder="Converted amount"
              class="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50">
            <select
              [(ngModel)]="toCurrency"
              (change)="onCurrencyChange()"
              class="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
              <option *ngFor="let currency of availableCurrencies" [value]="currency.code">
                {{ currency.symbol }} {{ currency.code }} - {{ currency.name }}
              </option>
            </select>
          </div>
        </div>

        <!-- Conversion Details -->
        <div *ngIf="fromAmount > 0 && conversionRate" class="bg-gray-50 rounded-lg p-4 mb-4">
          <div class="text-sm text-gray-600 mb-2">Conversion Details</div>
          <div class="space-y-1">
            <div class="flex justify-between text-sm">
              <span>Exchange Rate:</span>
              <span class="font-medium">1 {{ fromCurrency }} = {{ conversionRate | number:'1.4-4' }} {{ toCurrency }}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span>Inverse Rate:</span>
              <span class="font-medium">1 {{ toCurrency }} = {{ (1/conversionRate) | number:'1.4-4' }} {{ fromCurrency }}</span>
            </div>
          </div>
        </div>

        <!-- Regional Pricing Info -->
        <div *ngIf="userLocation && showRegionalPricing" class="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
          <div class="flex items-start">
            <svg class="w-4 h-4 text-green-600 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <div class="flex-1">
              <div class="text-sm font-medium text-green-800">Regional Pricing Active</div>
              <div class="text-xs text-green-700 mt-1">
                Prices adjusted for {{ userLocation.country }}
                <span *ngIf="regionalAdjustment !== 0">
                  ({{ regionalAdjustment > 0 ? '+' : '' }}{{ regionalAdjustment }}%)
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Quick Convert Buttons -->
        <div class="mb-4">
          <div class="text-sm font-medium text-gray-700 mb-2">Quick Convert</div>
          <div class="grid grid-cols-4 gap-2">
            <button
              *ngFor="let amount of quickAmounts"
              (click)="setQuickAmount(amount)"
              class="px-2 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded transition-colors">
              {{ formatQuickAmount(amount) }}
            </button>
          </div>
        </div>

        <!-- Popular Conversions -->
        <div *ngIf="popularConversions.length > 0" class="border-t pt-4">
          <div class="text-sm font-medium text-gray-700 mb-2">Popular Conversions</div>
          <div class="space-y-2">
            <button
              *ngFor="let conversion of popularConversions"
              (click)="applyConversion(conversion)"
              class="w-full text-left px-3 py-2 text-sm bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors flex justify-between items-center">
              <span>{{ conversion.from }} → {{ conversion.to }}</span>
              <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </button>
          </div>
        </div>

        <!-- History -->
        <div *ngIf="conversionHistory.length > 0" class="border-t pt-4 mt-4">
          <div class="flex justify-between items-center mb-2">
            <span class="text-sm font-medium text-gray-700">Recent Conversions</span>
            <button
              (click)="clearHistory()"
              class="text-xs text-gray-500 hover:text-gray-700">
              Clear
            </button>
          </div>
          <div class="space-y-1 max-h-32 overflow-y-auto">
            <div
              *ngFor="let item of conversionHistory"
              class="text-xs text-gray-600 flex justify-between">
              <span>{{ item.fromAmount | number:'1.2-2' }} {{ item.from }} = {{ item.toAmount | number:'1.2-2' }} {{ item.to }}</span>
              <span class="text-gray-400">{{ item.time | date:'HH:mm' }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    @keyframes slide-up {
      from {
        transform: translateY(20px);
        opacity: 0;
      }
      to {
        transform: translateY(0);
        opacity: 1;
      }
    }
    .animate-slide-up {
      animation: slide-up 0.3s ease-out;
    }
  `]
})
export class CurrencyCalculatorComponent implements OnInit, OnDestroy {
  isOpen = false;
  fromAmount = 100;
  toAmount = 0;
  fromCurrency = 'USD';
  toCurrency = 'EUR';
  conversionRate = 0;

  availableCurrencies: Currency[] = [];
  lastUpdateTime: Date | null = null;
  isRefreshing = false;
  userLocation: any = null;
  regionalAdjustment = 0;
  showRegionalPricing = false;

  quickAmounts = [10, 50, 100, 500, 1000, 5000, 10000, 50000];

  popularConversions = [
    { from: 'USD', to: 'EUR' },
    { from: 'USD', to: 'GBP' },
    { from: 'USD', to: 'CNY' },
    { from: 'EUR', to: 'USD' },
    { from: 'USD', to: 'JPY' },
    { from: 'USD', to: 'KHR' }
  ];

  conversionHistory: any[] = [];

  private destroy$ = new Subject<void>();
  private amountChange$ = new Subject<void>();

  constructor(
    private currencyService: CurrencyService,
    private exchangeRateService: ExchangeRateService
  ) {}

  ngOnInit() {
    // Load available currencies
    this.availableCurrencies = this.currencyService.getCurrencies();

    // Set default currencies based on user preference
    const currentCurrency = this.currencyService.getCurrentCurrency();
    this.fromCurrency = currentCurrency.code;

    // Get user location for regional pricing
    this.exchangeRateService.userLocation$
      .pipe(takeUntil(this.destroy$))
      .subscribe(location => {
        if (location) {
          this.userLocation = location;
          this.regionalAdjustment = this.exchangeRateService.getRegionalPriceAdjustment(location.countryCode);
          this.showRegionalPricing = this.regionalAdjustment !== 0;

          // Set suggested currency
          const suggestedCurrency = this.exchangeRateService.getSuggestedCurrency();
          if (this.availableCurrencies.find(c => c.code === suggestedCurrency)) {
            this.toCurrency = suggestedCurrency;
          }
        }
      });

    // Debounce amount changes
    this.amountChange$
      .pipe(debounceTime(300), takeUntil(this.destroy$))
      .subscribe(() => this.calculateConversion());

    // Load conversion history from localStorage
    this.loadHistory();

    // Initial conversion
    this.calculateConversion();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  toggleCalculator() {
    this.isOpen = !this.isOpen;
    if (this.isOpen && !this.lastUpdateTime) {
      this.refreshRates();
    }
  }

  onAmountChange() {
    this.amountChange$.next();
  }

  onCurrencyChange() {
    this.calculateConversion();
  }

  calculateConversion() {
    if (this.fromAmount <= 0) {
      this.toAmount = 0;
      return;
    }

    this.exchangeRateService.convertCurrency(this.fromAmount, this.fromCurrency, this.toCurrency)
      .pipe(takeUntil(this.destroy$))
      .subscribe(convertedAmount => {
        this.toAmount = convertedAmount;
        this.conversionRate = convertedAmount / this.fromAmount;

        // Add to history
        this.addToHistory({
          fromAmount: this.fromAmount,
          from: this.fromCurrency,
          toAmount: this.toAmount,
          to: this.toCurrency,
          time: new Date()
        });
      });
  }

  swapCurrencies() {
    const temp = this.fromCurrency;
    this.fromCurrency = this.toCurrency;
    this.toCurrency = temp;

    const tempAmount = this.fromAmount;
    this.fromAmount = this.toAmount;
    this.toAmount = tempAmount;

    this.calculateConversion();
  }

  setQuickAmount(amount: number) {
    this.fromAmount = amount;
    this.calculateConversion();
  }

  formatQuickAmount(amount: number): string {
    if (amount >= 1000) {
      return `${amount / 1000}k`;
    }
    return amount.toString();
  }

  applyConversion(conversion: { from: string; to: string }) {
    this.fromCurrency = conversion.from;
    this.toCurrency = conversion.to;
    this.calculateConversion();
  }

  refreshRates() {
    this.isRefreshing = true;
    this.exchangeRateService.refreshRates()
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.lastUpdateTime = new Date();
        this.isRefreshing = false;
        this.calculateConversion();
      });
  }

  addToHistory(conversion: any) {
    // Avoid duplicate consecutive entries
    const lastEntry = this.conversionHistory[0];
    if (lastEntry &&
        lastEntry.fromAmount === conversion.fromAmount &&
        lastEntry.from === conversion.from &&
        lastEntry.to === conversion.to) {
      return;
    }

    this.conversionHistory.unshift(conversion);
    if (this.conversionHistory.length > 10) {
      this.conversionHistory.pop();
    }
    this.saveHistory();
  }

  loadHistory() {
    const saved = localStorage.getItem('currencyConversionHistory');
    if (saved) {
      try {
        this.conversionHistory = JSON.parse(saved).map((item: any) => ({
          ...item,
          time: new Date(item.time)
        }));
      } catch (e) {
        this.conversionHistory = [];
      }
    }
  }

  saveHistory() {
    localStorage.setItem('currencyConversionHistory', JSON.stringify(this.conversionHistory));
  }

  clearHistory() {
    this.conversionHistory = [];
    localStorage.removeItem('currencyConversionHistory');
  }
}
