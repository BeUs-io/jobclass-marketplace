import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { ExchangeRateService } from './exchange-rate.service';

export interface Currency {
  code: string;
  symbol: string;
  name: string;
  exchangeRate: number; // Rate relative to USD
  decimals: number;
  format: string; // 'symbol-first' or 'symbol-last'
}

@Injectable({
  providedIn: 'root'
})
export class CurrencyService {
  private currencies: Currency[] = [
    { code: 'USD', symbol: '$', name: 'US Dollar', exchangeRate: 1, decimals: 2, format: 'symbol-first' },
    { code: 'EUR', symbol: '€', name: 'Euro', exchangeRate: 0.92, decimals: 2, format: 'symbol-first' },
    { code: 'GBP', symbol: '£', name: 'British Pound', exchangeRate: 0.79, decimals: 2, format: 'symbol-first' },
    { code: 'CNY', symbol: '¥', name: 'Chinese Yuan', exchangeRate: 7.24, decimals: 2, format: 'symbol-first' },
    { code: 'KHR', symbol: '៛', name: 'Cambodian Riel', exchangeRate: 4100, decimals: 0, format: 'symbol-last' },
    { code: 'JPY', symbol: '¥', name: 'Japanese Yen', exchangeRate: 147.5, decimals: 0, format: 'symbol-first' },
    { code: 'AUD', symbol: 'A$', name: 'Australian Dollar', exchangeRate: 1.52, decimals: 2, format: 'symbol-first' },
    { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar', exchangeRate: 1.35, decimals: 2, format: 'symbol-first' },
    { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar', exchangeRate: 1.34, decimals: 2, format: 'symbol-first' },
    { code: 'THB', symbol: '฿', name: 'Thai Baht', exchangeRate: 35.2, decimals: 2, format: 'symbol-first' },
    { code: 'VND', symbol: '₫', name: 'Vietnamese Dong', exchangeRate: 24300, decimals: 0, format: 'symbol-last' },
    { code: 'INR', symbol: '₹', name: 'Indian Rupee', exchangeRate: 83.1, decimals: 2, format: 'symbol-first' }
  ];

  private currentCurrencySubject = new BehaviorSubject<Currency>(this.currencies[0]);
  public currentCurrency$ = this.currentCurrencySubject.asObservable();

  constructor(private exchangeRateService?: ExchangeRateService) {
    // Load saved currency from localStorage
    const savedCurrency = localStorage.getItem('selectedCurrency');
    if (savedCurrency) {
      const currency = this.currencies.find(c => c.code === savedCurrency);
      if (currency) {
        this.currentCurrencySubject.next(currency);
      }
    }

    // Update exchange rates from live API if available
    if (this.exchangeRateService) {
      this.updateExchangeRates();
    }
  }

  getCurrencies(): Currency[] {
    return this.currencies;
  }

  getCurrentCurrency(): Currency {
    return this.currentCurrencySubject.value;
  }

  setCurrency(currencyCode: string): void {
    const currency = this.currencies.find(c => c.code === currencyCode);
    if (currency) {
      this.currentCurrencySubject.next(currency);
      localStorage.setItem('selectedCurrency', currencyCode);
    }
  }

  convertFromUSD(amountUSD: number, toCurrencyCode?: string): number {
    const currency = toCurrencyCode
      ? this.currencies.find(c => c.code === toCurrencyCode)
      : this.currentCurrencySubject.value;

    if (!currency) return amountUSD;
    return amountUSD * currency.exchangeRate;
  }

  convertToUSD(amount: number, fromCurrencyCode?: string): number {
    const currency = fromCurrencyCode
      ? this.currencies.find(c => c.code === fromCurrencyCode)
      : this.currentCurrencySubject.value;

    if (!currency) return amount;
    return amount / currency.exchangeRate;
  }

  formatCurrency(amount: number, currencyCode?: string): string {
    const currency = currencyCode
      ? this.currencies.find(c => c.code === currencyCode)
      : this.currentCurrencySubject.value;

    if (!currency) return `$${amount.toFixed(2)}`;

    const formattedAmount = currency.decimals === 0
      ? Math.round(amount).toLocaleString()
      : amount.toFixed(currency.decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ',');

    if (currency.format === 'symbol-first') {
      return `${currency.symbol}${formattedAmount}`;
    } else {
      return `${formattedAmount}${currency.symbol}`;
    }
  }

  formatPrice(priceUSD: number, currencyCode?: string): string {
    const convertedAmount = this.convertFromUSD(priceUSD, currencyCode);
    return this.formatCurrency(convertedAmount, currencyCode);
  }

  // Get exchange rate between two currencies
  getExchangeRate(fromCode: string, toCode: string): number {
    const fromCurrency = this.currencies.find(c => c.code === fromCode);
    const toCurrency = this.currencies.find(c => c.code === toCode);

    if (!fromCurrency || !toCurrency) return 1;

    // Convert through USD as base
    return toCurrency.exchangeRate / fromCurrency.exchangeRate;
  }

  // Update exchange rates from live API
  updateExchangeRates(): void {
    if (!this.exchangeRateService) return;

    this.exchangeRateService.getExchangeRates().subscribe(rates => {
      this.currencies.forEach(currency => {
        if (currency.code !== 'USD' && rates.rates[currency.code]) {
          currency.exchangeRate = rates.rates[currency.code];
        }
      });
    });
  }

  // Convert with live rates if available
  convertFromUSDLive(amountUSD: number, toCurrencyCode?: string): Observable<number> {
    const currency = toCurrencyCode
      ? this.currencies.find(c => c.code === toCurrencyCode)
      : this.currentCurrencySubject.value;

    if (!currency || !this.exchangeRateService) {
      return of(this.convertFromUSD(amountUSD, toCurrencyCode));
    }

    return this.exchangeRateService.convertCurrency(amountUSD, 'USD', currency.code);
  }

  // Convert with regional pricing
  convertWithRegionalPricing(amountUSD: number, toCurrencyCode?: string): Observable<number> {
    if (!this.exchangeRateService) {
      return of(this.convertFromUSD(amountUSD, toCurrencyCode));
    }

    const currency = toCurrencyCode || this.currentCurrencySubject.value.code;
    const adjustedPrice = this.exchangeRateService.applyRegionalPricing(amountUSD);

    return this.exchangeRateService.convertCurrency(adjustedPrice, 'USD', currency);
  }

  // Get price with PPP adjustment
  getPPPAdjustedPrice(basePrice: number): Observable<{
    originalPrice: number;
    adjustedPrice: number;
    discount: number;
    currency: string;
  }> {
    if (!this.exchangeRateService) {
      return of({
        originalPrice: basePrice,
        adjustedPrice: this.convertFromUSD(basePrice),
        discount: 0,
        currency: this.currentCurrencySubject.value.code
      });
    }

    return this.exchangeRateService.getPPPAdjustedPrice(basePrice);
  }
}
