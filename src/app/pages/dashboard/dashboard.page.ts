import { Component, OnInit, inject, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { CoffeeService, CoffeeTasting } from '../../services/coffee.service';
import { Login } from '../../services/login.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './dashboard.page.html',
  styleUrl: './dashboard.page.css',
})
export class DashboardPage implements OnInit {
  private router = inject(Router);
  private coffeeService = inject(CoffeeService);
  private loginService = inject(Login);

  // Signal to track if image failed to load
  imageLoadError = signal<boolean>(false);

  // Signal to track if a child route is active
  isChildRouteActive = signal<boolean>(false);

  // Dashboard data signals
  totalTastings = signal<number>(0);
  averageRating = signal<number>(0);
  favoriteOrigin = signal<string>('');
  recentTastings = signal<CoffeeTasting[]>([]);
  allTastings = signal<CoffeeTasting[]>([]); // Todas las catas sin filtrar
  isLoading = signal<boolean>(true);
  errorMessage = signal<string | null>(null);

  // Search filter signal
  searchQuery = signal<string>('');

  // Computed signals for user data

  userName = computed(() => {
    const user = this.loginService.currentUser();
    return user?.user_metadata?.['username'] || user?.email?.split('@')[0] || 'Usuario';
  });

  userEmail = computed(() => {
    const user = this.loginService.currentUser();
    return user?.email || '';
  });

  userPicture = computed(() => {
    const user = this.loginService.currentUser();
    return user?.user_metadata?.['avatar_url'] || '';
  });

  // Computed signal for filtered tastings
  filteredTastings = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    const tastings = this.allTastings();

    if (!query) {
      return tastings;
    }

    return tastings.filter(
      (tasting) =>
        (tasting.coffee_name ?? '').toLowerCase().includes(query) ||
        (tasting.brand ?? '').toLowerCase().includes(query)
    );
  });

  // Example of a computed signal if needed in the template
  averageRatingRounded = computed(() => Math.round(this.averageRating() * 10) / 10);

  constructor() {
    // Subscribe to router events to detect child route activation
    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => {
      // Check if current URL is exactly '/dashboard' or has child routes
      const url = this.router.url;
      this.isChildRouteActive.set(url !== '/dashboard' && url.startsWith('/dashboard/'));
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
        this.allTastings.set([]);
        this.recentTastings.set([]);
        this.totalTastings.set(0);
        this.averageRating.set(0);
        this.favoriteOrigin.set('N/A');
        this.isLoading.set(false);
        this.errorMessage.set(null);

        // Only navigate if not already on the public root
        if (this.router.url !== '/') {
          this.router.navigate(['/']);
        }
      } else {
        // User is authenticated: load dashboard data
        // Guard to avoid repeated loads if already loading or data exists
        if (!this.isLoading() && this.allTastings().length === 0) {
          this.loadDashboardData();
        } else if (this.allTastings().length === 0) {
          // If it's the initial state, trigger load
          this.loadDashboardData();
        }
      }
    });
  }

  ngOnInit() {
    // Check initial route state
    const url = this.router.url;
    this.isChildRouteActive.set(url !== '/dashboard' && url.startsWith('/dashboard/'));

    // The effect in the constructor will handle loading data when auth is ready
    // No need to manually call loadDashboardData here
  }

  loadDashboardData() {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    // Get userId using Supabase
    const user = this.loginService.user;
    const userId = user?.id;

    if (!userId) {
      this.errorMessage.set('No se pudo obtener el ID del usuario');
      this.isLoading.set(false);
      return;
    }

    // Obtener las catas del usuario desde la base de datos
    this.coffeeService.getCoffeeTastingsByUser(userId).subscribe({
      next: (tastings) => {
        this.allTastings.set(tastings); // Guardar todas las catas
        this.recentTastings.set(tastings); // También actualizar recentTastings
        this.calculateStatistics(tastings);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error al cargar las catas:', error);
        this.errorMessage.set('Error al cargar tus catas. Por favor intenta nuevamente.');
        this.isLoading.set(false);
      },
    });
  }

  /**
   * Calcula estadísticas basadas en las catas del usuario
   */
  calculateStatistics(tastings: CoffeeTasting[]) {
    // Total de catas
    this.totalTastings.set(tastings.length);

    if (tastings.length === 0) {
      this.averageRating.set(0);
      this.favoriteOrigin.set('N/A');
      return;
    }

    // Calcular promedio de puntuación
    const totalScore = tastings.reduce((sum, tasting) => sum + (tasting.score || 0), 0);
    const average = totalScore / tastings.length;
    this.averageRating.set(average);

    // Encontrar origen favorito (el más frecuente)
    const originCount = tastings.reduce((acc, tasting) => {
      const origin = tasting.origin || 'Desconocido';
      acc[origin] = (acc[origin] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const favoriteOrigin = Object.entries(originCount).reduce((a, b) => (a[1] > b[1] ? a : b))[0];

    this.favoriteOrigin.set(favoriteOrigin);
  }

  onNewTasting() {
    this.router.navigate(['/dashboard/coffee/new']);
  }

  onViewAllTastings() {
    this.router.navigate(['/coffee']);
  }

  onViewTasting(tastingId: string) {
    this.router.navigate(['/coffee', tastingId]);
  }

  onSlideClick(): void {
    this.router.navigate(['/slides']);
  }

  async onLogout() {
    try {
      await this.loginService.signOut();
      this.router.navigate(['/']);
    } catch (error) {
      console.error('Error during logout:', error);
      this.errorMessage.set('Error al cerrar sesión. Por favor intenta nuevamente.');
    }
  }

  // Method to handle image load errors
  onImageError() {
    this.imageLoadError.set(true);
  }

  getStarArray(rating: number): boolean[] {
    const rounded = Math.round(rating);
    return Array.from({ length: 5 }, (_, index) => index < rounded);
  }

  formatDate(date: Date | string): string {
    return new Date(date).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  onSearchChange(event: Event) {
    const input = event.target as HTMLInputElement;
    this.searchQuery.set(input.value);
  }

  clearSearch() {
    this.searchQuery.set('');
  }
}
