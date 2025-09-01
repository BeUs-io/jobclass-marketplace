import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExchangeRateService } from '../../services/exchange-rate.service';
import { CurrencyService } from '../../services/currency.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-regional-pricing',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="showRegionalPricing" class="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-4 my-4">
      <div class="flex items-start gap-3">
        <div class="flex-shrink-0">
          <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        </div>

        <div class="flex-1">
          <h3 class="font-semibold text-green-800 mb-2">
            Special Regional Pricing for {{ userLocation?.country }}
          </h3>

          <div class="space-y-3">
            <!-- Original vs Adjusted Price -->
            <div class="bg-white rounded-lg p-3">
              <div class="flex justify-between items-center mb-2">
                <span class="text-sm text-gray-600">Original Price</span>
                <span class="text-sm line-through text-gray-400">
                  {{ originalPrice | currency:originalCurrency }}
                </span>
              </div>

              <div class="flex justify-between items-center">
                <span class="text-sm font-medium text-gray-800">Your Price</span>
                <div class="text-right">
                  <span class="text-xl font-bold text-green-600">
                    {{ adjustedPrice | currency:localCurrency }}
                  </span>
                  <div *ngIf="discount > 0" class="text-xs text-green-600">
                    Save {{ discount }}% with regional pricing
                  </div>
                </div>
              </div>
            </div>

            <!-- Pricing Explanation -->
            <div class="text-sm text-gray-700">
              <div class="flex items-center gap-2 mb-1">
                <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span class="font-medium">Why this price?</span>
              </div>
              <p class="text-xs text-gray-600 ml-6">
                We adjust our prices based on purchasing power parity to make our services
                more accessible globally. This price is automatically calculated for your region.
              </p>
            </div>

            <!-- Currency Options -->
            <div class="flex items-center gap-2 text-sm">
              <span class="text-gray-600">Prefer a different currency?</span>
              <button
                (click)="openCurrencySelector()"
                class="text-blue-600 hover:text-blue-800 underline">
                Change Currency
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Compact Version for Lists -->
    <div *ngIf="!showRegionalPricing && compactMode && discount > 0"
         class="inline-flex items-center gap-2 px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
      <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path>
      </svg>
      <span>{{ discount }}% regional discount</span>
    </div>
  `,
  styles: []
})
export class RegionalPricingComponent implements OnInit {
  @Input() basePrice!: number;
  @Input() compactMode = false;
  @Input() showDetails = true;

  showRegionalPricing = false;
  userLocation: any = null;
  originalPrice = 0;
  adjustedPrice = 0;
  discount = 0;
  originalCurrency = 'USD';
  localCurrency = 'USD';

  constructor(
    private exchangeRateService: ExchangeRateService,
    private currencyService: CurrencyService
  ) {}

  ngOnInit() {
    // Get user location and calculate regional pricing
    this.exchangeRateService.userLocation$.subscribe(location => {
      if (location) {
        this.userLocation = location;
        this.localCurrency = location.currency;
        this.calculateRegionalPricing();
      }
    });
  }

  calculateRegionalPricing() {
    if (!this.userLocation || !this.basePrice) return;

    const adjustment = this.exchangeRateService.getRegionalPriceAdjustment(this.userLocation.countryCode);

    // Only show if there's a discount
    if (adjustment < 0) {
      this.showRegionalPricing = !this.compactMode;
      this.originalPrice = this.basePrice;
      this.discount = Math.abs(adjustment);

      // Calculate adjusted price in local currency
      this.exchangeRateService.getPPPAdjustedPrice(this.basePrice).subscribe(result => {
        this.adjustedPrice = result.adjustedPrice;
        this.localCurrency = result.currency;
      });
    } else if (adjustment > 0 && this.showDetails) {
      // Show premium pricing notice for certain regions
      this.showRegionalPricing = false;
    }
  }

  openCurrencySelector() {
    // Emit event or open currency selector modal
    // This would typically trigger the currency calculator or header currency selector
    console.log('Open currency selector');
  }
}
