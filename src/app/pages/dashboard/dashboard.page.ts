import { Component, OnInit, inject, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { CoffeeService } from '../../services/coffee';
import { Login } from '../../services/auth';
import { filter } from 'rxjs/operators';
import { HeaderComponent } from '../../components/molecule/header/header.component';
import { StatsGridComponent } from '../../components/molecule/stats-grid/stats-grid.component';
import { TastingCardComponent } from '../../components/molecule/tasting-card/tasting-card.component';
import { CardTastingInfo } from '../../services/forms';
import { CoffeeCardInfoService } from '../../services/coffee';
import { DashboardStateService } from '../../services/dashboard';
import { TranslatePipe } from '../../services/language/translate.pipe';
import { TastingDetailPopupComponent } from '../../components/molecule/tasting-detail-popup/tasting-detail-popup.component';
import { CoffeeTasting } from '../../services/coffee';
import { SEOService } from '../../services/seo';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    HeaderComponent,
    StatsGridComponent,
    TastingCardComponent,
    TastingDetailPopupComponent,
    TranslatePipe,
  ],
  templateUrl: './dashboard.page.html',
  styleUrl: './dashboard.page.css',
})
export class DashboardPage implements OnInit {
  private router = inject(Router);
  private coffeeService = inject(CoffeeService);
  private loginService = inject(Login);
  private coffeeCardInfoService = inject(CoffeeCardInfoService);
  private dashboardState = inject(DashboardStateService);
  private seoService = inject(SEOService);

  // Signal to track if a child route is active
  isChildRouteActive = signal<boolean>(false);

  // Popup state
  showPopup = false;
  selectedTasting: CoffeeTasting | null = null;

  // Expose dashboard state signals for template access
  get totalTastings() {
    return this.dashboardState.totalTastings;
  }
  get averageRating() {
    return this.dashboardState.averageRating;
  }
  get favoriteOrigin() {
    return this.dashboardState.favoriteOrigin;
  }
  get recentTastings() {
    return this.dashboardState.recentTastings;
  }
  get allTastings() {
    return this.dashboardState.allTastings;
  }
  get mappedTastings() {
    return this.dashboardState.mappedTastings;
  }
  get isLoading() {
    return this.dashboardState.isLoading;
  }
  get errorMessage() {
    return this.dashboardState.errorMessage;
  }
  get topOrigins() {
    return this.dashboardState.topOrigins;
  }
  get favoriteBrewMethod() {
    return this.dashboardState.favoriteBrewMethod;
  }
  get tastingTrend() {
    return this.dashboardState.tastingTrend;
  }
  get insights() {
    return this.dashboardState.insights;
  }
  get userName() {
    return this.dashboardState.userName;
  }
  get filteredTastings() {
    return this.dashboardState.filteredTastings;
  }
  get averageRatingRounded() {
    return this.dashboardState.averageRatingRounded;
  }
  get searchQuery() {
    return this.dashboardState.getFilterService().searchQuery;
  }
  get sortOrder() {
    return this.dashboardState.getFilterService().sortOrder;
  }

  constructor() {
    // Subscribe to router events to detect child route activation
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        // Check if current URL is exactly '/dashboard' or has child routes
        const url = this.router.url;
        this.isChildRouteActive.set(url !== '/dashboard' && url.startsWith('/dashboard/'));

        // If we're navigating back to the main dashboard from a child route, reload data
        if (url === '/dashboard' && this.dashboardState.getDataLoadAttempted()) {
          this.reloadDashboardData();
        }
      });

    // Reactive effect to respond to authentication state changes.
    // This will react when loginService.currentUser() or internal auth signals change.
    // When a user logs in, we load the dashboard data. When they log out, we clear the data and redirect.
    effect(() => {
      // Read current user from the service (assumed to be reactive inside the service)
      const user = this.loginService.currentUser();

      // Also ensure login service has finished initial loading before reacting
      const loading = this.loginService.isLoading ? this.loginService.isLoading() : false;

      if (loading) {
        // still initializing auth, don't act yet
        return;
      }

      if (!user) {
        // User logged out or not authenticated: clear dashboard data and redirect to home
        this.dashboardState.clearData();
        this.coffeeCardInfoService.clearIdMap();

        // Only navigate if not already on the public root
        if (this.router.url !== '/') {
          this.router.navigate(['/']);
        }
      } else {
        // User is authenticated: load dashboard data
        // Only load if we haven't attempted to load data yet and we're not currently loading
        if (!this.dashboardState.getDataLoadAttempted() && !this.dashboardState.isLoading()) {
          this.loadDashboardData();
        } else {
        }
      }
    });
  }

  ngOnInit() {
    // Configurar SEO para la página de dashboard
    this.seoService.setDashboardSEO();

    // Check initial route state
    const url = this.router.url;
    this.isChildRouteActive.set(url !== '/dashboard' && url.startsWith('/dashboard/'));
  }

  loadDashboardData() {
    // Mark that we've attempted to load data
    this.dashboardState.setDataLoadAttempted(true);
    this.dashboardState.setLoading(true);
    this.dashboardState.setError(null);

    // Get userId using Supabase
    const user = this.loginService.user;
    const userId = user?.id;

    if (!userId) {
      this.dashboardState.setError('No se pudo obtener el ID del usuario');
      this.dashboardState.setLoading(false);
      return;
    }

    // Obtener las catas del usuario desde la base de datos
    this.coffeeService.getCoffeeTastingsByUser(userId).subscribe({
      next: (tastings) => {
        // Mapear las catas a CardTastingInfo
        const mappedTastings = tastings.map((tasting) =>
          this.coffeeCardInfoService.mapCoffeeTastingToCardInfo(tasting)
        );

        // Update all data through the state service
        this.dashboardState.updateTastings(tastings, mappedTastings);
        this.dashboardState.updateStatistics(tastings);
        this.dashboardState.setLoading(false);
      },
      error: (error) => {
        console.error('❌ Error al cargar las catas:', error);
        this.dashboardState.setError('Error al cargar tus catas. Por favor intenta nuevamente.');
        this.dashboardState.setLoading(false);
      },
    });
  }

  /**
   * Reloads dashboard data without resetting the dataLoadAttempted flag
   * This is used when returning from child routes to ensure fresh data
   */
  reloadDashboardData() {
    this.dashboardState.setLoading(true);
    this.dashboardState.setError(null);

    // Get userId using Supabase
    const user = this.loginService.user;
    const userId = user?.id;

    if (!userId) {
      this.dashboardState.setError('No se pudo obtener el ID del usuario');
      this.dashboardState.setLoading(false);
      return;
    }

    // Obtener las catas del usuario desde la base de datos
    this.coffeeService.getCoffeeTastingsByUser(userId).subscribe({
      next: (tastings) => {
   
        // Mapear las catas a CardTastingInfo
        const mappedTastings = tastings.map((tasting) =>
          this.coffeeCardInfoService.mapCoffeeTastingToCardInfo(tasting)
        );

        // Update all data through the state service
        this.dashboardState.updateTastings(tastings, mappedTastings);
        this.dashboardState.updateStatistics(tastings);
        this.dashboardState.setLoading(false);
      },
      error: (error) => {
        console.error('❌ Error al recargar las catas:', error);
        this.dashboardState.setError('Error al recargar tus catas. Por favor intenta nuevamente.');
        this.dashboardState.setLoading(false);
      },
    });
  }

  onNewTasting() {
    this.router.navigate(['/dashboard/coffee/new']);
  }

  onViewAllTastings() {
    this.router.navigate(['/coffee']);
  }

  onViewTasting(tastingId: string) {
    // Find the tasting data
    const tasting = this.dashboardState
      .getRawTastings()
      .find((t: CoffeeTasting) => t.id === tastingId);
    if (tasting) {
      this.selectedTasting = tasting;
      this.showPopup = true;
    } else {
      console.error('Tasting not found:', tastingId);
    }
  }

  onClosePopup() {
    this.showPopup = false;
    this.selectedTasting = null;
  }

  onSearchChange(event: Event) {
    const input = event.target as HTMLInputElement;
    this.dashboardState.getFilterService().updateSearchQuery(input.value);
  }

  clearSearch() {
    this.dashboardState.getFilterService().clearSearch();
  }

  // Métodos de ordenamiento
  sortByBest() {
    this.dashboardState.getFilterService().sortByBest();
  }

  sortByWorst() {
    this.dashboardState.getFilterService().sortByWorst();
  }

  sortByRecent() {
    this.dashboardState.getFilterService().sortByRecent();
  }

  /**
   * Obtiene el ID original de una CardTastingInfo
   */
  getTastingId(tasting: CardTastingInfo): string | undefined {
    return this.coffeeCardInfoService.getTastingId(tasting);
  }
}
