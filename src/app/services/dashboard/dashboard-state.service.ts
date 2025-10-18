import { Injectable, signal, computed, inject } from '@angular/core';
import { CoffeeTasting } from '../coffee';
import { CardTastingInfo } from '../forms';
import { Login } from '../auth';
import { StatisticsService, DashboardStatistics } from './statistics.service';
import { FilterService } from './filter.service';

@Injectable({
  providedIn: 'root'
})
export class DashboardStateService {
  private loginService = inject(Login);
  private statisticsService = inject(StatisticsService);
  private filterService = inject(FilterService);

  // Flag to track if data has been loaded at least once
  private dataLoadAttempted = signal<boolean>(false);

  // Dashboard data signals
  totalTastings = signal<number>(0);
  averageRating = signal<number>(0);
  favoriteOrigin = signal<string>('');
  recentTastings = signal<CoffeeTasting[]>([]);
  allTastings = signal<CoffeeTasting[]>([]);
  mappedTastings = signal<CardTastingInfo[]>([]);
  isLoading = signal<boolean>(false);
  errorMessage = signal<string | null>(null);

  // Statistics signals
  topOrigins = signal<{ name: string; count: number }[]>([]);
  favoriteBrewMethod = signal<string>('');
  tastingTrend = signal<string>('');
  insights = signal<{ message: string; icon: string }[]>([]);

  // Computed signal for user name (used in welcome message)
  userName = computed(() => {
    const user = this.loginService.currentUser();
    return (
      user?.user_metadata?.['username'] ||
      user?.user_metadata?.['full_name'] ||
      user?.user_metadata?.['name'] ||
      user?.email?.split('@')[0] ||
      'Usuario'
    );
  });

  // Computed signal for filtered and sorted tastings
  filteredTastings = computed(() => {
    const tastings = this.mappedTastings();
    return this.filterService.getFilteredTastings(tastings)();
  });

  // Example of a computed signal if needed in the template
  averageRatingRounded = computed(() => Math.round(this.averageRating() * 10) / 10);

  /**
   * Gets the data load attempted flag
   */
  getDataLoadAttempted(): boolean {
    return this.dataLoadAttempted();
  }

  /**
   * Sets the data load attempted flag
   */
  setDataLoadAttempted(attempted: boolean): void {
    this.dataLoadAttempted.set(attempted);
  }

  /**
   * Updates all statistics based on tastings
   */
  updateStatistics(tastings: CoffeeTasting[]): void {
    const stats = this.statisticsService.calculateStatistics(tastings);
    
    this.totalTastings.set(stats.totalTastings);
    this.averageRating.set(stats.averageRating);
    this.favoriteOrigin.set(stats.favoriteOrigin);
    this.topOrigins.set(stats.topOrigins);
    this.favoriteBrewMethod.set(stats.favoriteBrewMethod);
    this.tastingTrend.set(stats.tastingTrend);
    this.insights.set(stats.insights);
  }

  /**
   * Updates all tastings data
   */
  updateTastings(tastings: CoffeeTasting[], mappedTastings: CardTastingInfo[]): void {
    this.allTastings.set(tastings);
    this.recentTastings.set(tastings);
    this.mappedTastings.set(mappedTastings);
  }

  /**
   * Sets loading state
   */
  setLoading(loading: boolean): void {
    this.isLoading.set(loading);
  }

  /**
   * Sets error message
   */
  setError(error: string | null): void {
    this.errorMessage.set(error);
  }

  /**
   * Clears all dashboard data
   */
  clearData(): void {
    this.allTastings.set([]);
    this.recentTastings.set([]);
    this.mappedTastings.set([]);
    this.totalTastings.set(0);
    this.averageRating.set(0);
    this.favoriteOrigin.set('N/A');
    this.topOrigins.set([]);
    this.favoriteBrewMethod.set('');
    this.tastingTrend.set('');
    this.insights.set([]);
    this.isLoading.set(false);
    this.errorMessage.set(null);
    this.dataLoadAttempted.set(false);
  }

  /**
   * Gets the filter service for external access
   */
  getFilterService(): FilterService {
    return this.filterService;
  }

  /**
   * Forces a data reload by resetting the dataLoadAttempted flag
   * This can be called when we know new data should be available
   */
  forceDataReload(): void {
    this.dataLoadAttempted.set(false);
  }
}
