import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, timer, BehaviorSubject, catchError, map } from 'rxjs';
import { switchMap, shareReplay, tap } from 'rxjs/operators';

export interface ExchangeRates {
  base: string;
  date: string;
  rates: { [currency: string]: number };
  timestamp: number;
}

export interface GeoLocation {
  country: string;
  countryCode: string;
  city: string;
  timezone: string;
  currency: string;
  ip: string;
}

@Injectable({
  providedIn: 'root'
})
export class ExchangeRateService {
  // Free API endpoints (in production, use paid services for better reliability)
  private readonly EXCHANGE_API_URL = 'https://api.exchangerate-api.com/v4/latest/USD';
  private readonly GEO_API_URL = 'https://ipapi.co/json/';

  // Alternative APIs for fallback
  private readonly FALLBACK_EXCHANGE_API = 'https://api.fxratesapi.com/latest?base=USD';
  private readonly FALLBACK_GEO_API = 'https://ip-api.com/json/';

  // Cache exchange rates for 5 minutes
  private exchangeRatesCache$!: Observable<ExchangeRates>;
  private lastFetchTime = 0;
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  // Store current location
  private userLocationSubject = new BehaviorSubject<GeoLocation | null>(null);
  public userLocation$ = this.userLocationSubject.asObservable();

  // Regional pricing adjustments (percentage)
  private readonly regionalPricing: { [countryCode: string]: number } = {
    // Developed markets (higher pricing)
    'US': 0,      // Base pricing
    'GB': 5,      // UK +5%
    'DE': 3,      // Germany +3%
    'FR': 3,      // France +3%
    'JP': 8,      // Japan +8%
    'AU': 5,      // Australia +5%
    'CA': -2,     // Canada -2%
    'SG': 10,     // Singapore +10%
    'CH': 15,     // Switzerland +15%
    'AE': 12,     // UAE +12%
    'HK': 10,     // Hong Kong +10%
    'NZ': 3,      // New Zealand +3%
    'NO': 12,     // Norway +12%
    'SE': 8,      // Sweden +8%
    'DK': 8,      // Denmark +8%

    // Emerging markets (adjusted pricing)
    'CN': -15,    // China -15%
    'IN': -25,    // India -25%
    'BR': -20,    // Brazil -20%
    'MX': -18,    // Mexico -18%
    'ID': -30,    // Indonesia -30%
    'TH': -22,    // Thailand -22%
    'MY': -20,    // Malaysia -20%
    'PH': -28,    // Philippines -28%
    'VN': -35,    // Vietnam -35%
    'KH': -40,    // Cambodia -40%
    'LA': -40,    // Laos -40%
    'MM': -45,    // Myanmar -45%
    'BD': -35,    // Bangladesh -35%
    'PK': -35,    // Pakistan -35%
    'NG': -30,    // Nigeria -30%
    'EG': -25,    // Egypt -25%
    'ZA': -20,    // South Africa -20%
    'KE': -30,    // Kenya -30%
    'AR': -25,    // Argentina -25%
    'CL': -15,    // Chile -15%
    'CO': -22,    // Colombia -22%
    'PE': -25,    // Peru -25%
    'UA': -40,    // Ukraine -40%
    'RU': -30,    // Russia -30%
    'TR': -25,    // Turkey -25%
    'PL': -18,    // Poland -18%
    'RO': -22,    // Romania -22%
    'CZ': -15,    // Czech Republic -15%
    'HU': -18,    // Hungary -18%
  };

  // Preferred currencies by country
  private readonly countryCurrencies: { [countryCode: string]: string } = {
    'US': 'USD', 'GB': 'GBP', 'DE': 'EUR', 'FR': 'EUR', 'IT': 'EUR', 'ES': 'EUR',
    'JP': 'JPY', 'CN': 'CNY', 'IN': 'INR', 'AU': 'AUD', 'CA': 'CAD', 'BR': 'BRL',
    'MX': 'MXN', 'KR': 'KRW', 'ID': 'IDR', 'TH': 'THB', 'MY': 'MYR', 'SG': 'SGD',
    'PH': 'PHP', 'VN': 'VND', 'KH': 'KHR', 'HK': 'HKD', 'TW': 'TWD', 'NZ': 'NZD',
    'ZA': 'ZAR', 'NG': 'NGN', 'EG': 'EGP', 'KE': 'KES', 'AE': 'AED', 'SA': 'SAR',
    'IL': 'ILS', 'TR': 'TRY', 'RU': 'RUB', 'UA': 'UAH', 'PL': 'PLN', 'CZ': 'CZK',
    'HU': 'HUF', 'RO': 'RON', 'BG': 'BGN', 'HR': 'HRK', 'RS': 'RSD', 'CH': 'CHF',
    'NO': 'NOK', 'SE': 'SEK', 'DK': 'DKK', 'AR': 'ARS', 'CL': 'CLP', 'CO': 'COP',
    'PE': 'PEN', 'UY': 'UYU', 'VE': 'VES', 'BD': 'BDT', 'PK': 'PKR', 'LK': 'LKR'
  };

  constructor(private http: HttpClient) {
    this.initializeExchangeRates();
    this.detectUserLocation();
  }

  /**
   * Initialize exchange rates with auto-refresh every 5 minutes
   */
  private initializeExchangeRates(): void {
    this.exchangeRatesCache$ = timer(0, this.CACHE_DURATION).pipe(
      switchMap(() => this.fetchExchangeRates()),
      shareReplay(1)
    );
  }

  /**
   * Fetch exchange rates from API with fallback
   */
  private fetchExchangeRates(): Observable<ExchangeRates> {
    return this.http.get<any>(this.EXCHANGE_API_URL).pipe(
      map(data => ({
        base: data.base || 'USD',
        date: data.date || new Date().toISOString().split('T')[0],
        rates: data.rates || {},
        timestamp: Date.now()
      })),
      catchError(() => {
        // Fallback to alternative API
        return this.http.get<any>(this.FALLBACK_EXCHANGE_API).pipe(
          map(data => ({
            base: data.base || 'USD',
            date: data.date || new Date().toISOString().split('T')[0],
            rates: data.rates || {},
            timestamp: Date.now()
          })),
          catchError(() => {
            // Return cached/default rates if all APIs fail
            return of(this.getDefaultRates());
          })
        );
      }),
      tap(rates => {
        this.lastFetchTime = Date.now();
        console.log('Exchange rates updated:', rates);
      })
    );
  }

  /**
   * Get current exchange rates
   */
  getExchangeRates(): Observable<ExchangeRates> {
    return this.exchangeRatesCache$;
  }

  /**
   * Convert amount between currencies using live rates
   */
  convertCurrency(amount: number, from: string, to: string): Observable<number> {
    if (from === to) return of(amount);

    return this.getExchangeRates().pipe(
      map(rates => {
        const fromRate = from === 'USD' ? 1 : (rates.rates[from] || 1);
        const toRate = to === 'USD' ? 1 : (rates.rates[to] || 1);
        return (amount / fromRate) * toRate;
      })
    );
  }

  /**
   * Detect user's location
   */
  detectUserLocation(): void {
    this.http.get<any>(this.GEO_API_URL).pipe(
      map(data => ({
        country: data.country_name || data.country || 'Unknown',
        countryCode: data.country_code || data.countryCode || 'US',
        city: data.city || 'Unknown',
        timezone: data.timezone || data.time_zone || 'UTC',
        currency: data.currency || this.countryCurrencies[data.country_code] || 'USD',
        ip: data.ip || ''
      })),
      catchError(() => {
        // Try fallback API
        return this.http.get<any>(this.FALLBACK_GEO_API).pipe(
          map(data => ({
            country: data.country || 'Unknown',
            countryCode: data.countryCode || 'US',
            city: data.city || 'Unknown',
            timezone: data.timezone || 'UTC',
            currency: this.countryCurrencies[data.countryCode] || 'USD',
            ip: data.query || ''
          })),
          catchError(() => of(this.getDefaultLocation()))
        );
      })
    ).subscribe(location => {
      this.userLocationSubject.next(location);
      console.log('User location detected:', location);
    });
  }

  /**
   * Get regional price adjustment for a country
   */
  getRegionalPriceAdjustment(countryCode: string): number {
    return this.regionalPricing[countryCode.toUpperCase()] || 0;
  }

  /**
   * Apply regional pricing to an amount
   */
  applyRegionalPricing(basePrice: number, countryCode?: string): number {
    const code = countryCode || this.userLocationSubject.value?.countryCode || 'US';
    const adjustment = this.getRegionalPriceAdjustment(code);
    return basePrice * (1 + adjustment / 100);
  }

  /**
   * Get suggested currency for user's location
   */
  getSuggestedCurrency(): string {
    const location = this.userLocationSubject.value;
    if (!location) return 'USD';
    return this.countryCurrencies[location.countryCode] || location.currency || 'USD';
  }

  /**
   * Get purchasing power parity adjusted price
   */
  getPPPAdjustedPrice(basePrice: number, targetCountry?: string): Observable<{
    originalPrice: number;
    adjustedPrice: number;
    discount: number;
    currency: string;
  }> {
    const country = targetCountry || this.userLocationSubject.value?.countryCode || 'US';
    const currency = this.countryCurrencies[country] || 'USD';
    const adjustedPrice = this.applyRegionalPricing(basePrice, country);
    const discount = basePrice - adjustedPrice;

    return this.convertCurrency(adjustedPrice, 'USD', currency).pipe(
      map(convertedPrice => ({
        originalPrice: basePrice,
        adjustedPrice: convertedPrice,
        discount: discount > 0 ? discount : 0,
        currency
      }))
    );
  }

  /**
   * Get default exchange rates (fallback)
   */
  private getDefaultRates(): ExchangeRates {
    return {
      base: 'USD',
      date: new Date().toISOString().split('T')[0],
      timestamp: Date.now(),
      rates: {
        'USD': 1,
        'EUR': 0.92,
        'GBP': 0.79,
        'JPY': 147.5,
        'CNY': 7.24,
        'INR': 83.1,
        'AUD': 1.52,
        'CAD': 1.35,
        'CHF': 0.88,
        'HKD': 7.83,
        'SGD': 1.34,
        'SEK': 10.5,
        'KRW': 1315,
        'NOK': 10.6,
        'NZD': 1.63,
        'MXN': 17.1,
        'ZAR': 18.8,
        'BRL': 4.95,
        'RUB': 92.5,
        'IDR': 15450,
        'THB': 35.2,
        'MYR': 4.65,
        'PHP': 55.8,
        'VND': 24300,
        'KHR': 4100,
        'TRY': 28.9,
        'AED': 3.67,
        'SAR': 3.75,
        'PLN': 4.02,
        'CZK': 22.4,
        'HUF': 352,
        'RON': 4.57,
        'BGN': 1.80,
        'HRK': 6.95,
        'UAH': 36.5,
        'ILS': 3.72,
        'EGP': 30.9,
        'NGN': 790,
        'KES': 153,
        'PKR': 282,
        'BDT': 110,
        'LKR': 323
      }
    };
  }

  /**
   * Get default location (fallback)
   */
  private getDefaultLocation(): GeoLocation {
    return {
      country: 'United States',
      countryCode: 'US',
      city: 'Unknown',
      timezone: 'America/New_York',
      currency: 'USD',
      ip: ''
    };
  }

  /**
   * Force refresh exchange rates
   */
  refreshRates(): Observable<ExchangeRates> {
    return this.fetchExchangeRates();
  }

  /**
   * Get all available currencies
   */
  getAvailableCurrencies(): Observable<string[]> {
    return this.getExchangeRates().pipe(
      map(rates => Object.keys(rates.rates).sort())
    );
  }
}
