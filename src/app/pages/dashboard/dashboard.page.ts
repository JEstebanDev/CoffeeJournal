import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CoffeeService, CoffeeTasting } from '../../services/coffee.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './dashboard.page.html',
  styleUrl: './dashboard.page.css',
})
export class DashboardPage implements OnInit {
  private auth = inject(AuthService);
  private router = inject(Router);
  private coffeeService = inject(CoffeeService);

  // User data signals provided by the AuthService
  user = this.auth.user;
  userName = this.auth.userName;
  userEmail = this.auth.userEmail;
  userPicture = this.auth.userPicture;

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

  // Computed signal for filtered tastings
  filteredTastings = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    const tastings = this.allTastings();

    if (!query) {
      return tastings;
    }

    return tastings.filter(tasting =>
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
  }

  ngOnInit() {
    // Check initial route state
    const url = this.router.url;
    this.isChildRouteActive.set(url !== '/dashboard' && url.startsWith('/dashboard/'));

    // Load dashboard data from database
    this.loadDashboardData();
  }

  loadDashboardData() {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    const userId = this.auth.userId();
    if (userId == '') {
      this.errorMessage.set('No se pudo obtener la información del usuario');
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

  onLogout() {
    // Delegate to the AuthService logout. The service may wrap Auth0's logout API.
    if (typeof this.auth.logout === 'function') {
      try {
        // If the service accepts params, it can handle them; otherwise this is a simple call.
        // Provide returnTo for compatibility with Auth0-style logout.
        (this.auth as any).logout?.({ returnTo: window.location.origin });
      } catch {
        // Fallback to calling logout without params
        (this.auth as any).logout?.();
      }
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
