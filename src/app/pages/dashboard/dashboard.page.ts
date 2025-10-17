import { Component, OnInit, inject, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { CoffeeService, CoffeeTasting } from '../../services/coffee.service';
import { Login } from '../../services/login.service';
import { filter } from 'rxjs/operators';
import { HeaderComponent } from '../../components/molecule/header/header.component';
import {
  StatsGridComponent,
  TopOrigin,
} from '../../components/molecule/stats-grid/stats-grid.component';
import { TastingCardComponent } from '../../components/molecule/tasting-card/tasting-card.component';
import {
  InsightToastComponent,
  Insight,
} from '../../components/molecule/insight-toast/insight-toast.component';
import { CardTastingInfo } from '../../services/slide/slide.interface';
import { CoffeeCardInfoService } from '../../services/slide/coffee-card-info.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    HeaderComponent,
    StatsGridComponent,
    TastingCardComponent,
    // InsightToastComponent,
  ],
  templateUrl: './dashboard.page.html',
  styleUrl: './dashboard.page.css',
})
export class DashboardPage implements OnInit {
  private router = inject(Router);
  private coffeeService = inject(CoffeeService);
  private loginService = inject(Login);
  private coffeeCardInfoService = inject(CoffeeCardInfoService);

  // Signal to track if a child route is active
  isChildRouteActive = signal<boolean>(false);

  // Flag to track if data has been loaded at least once
  private dataLoadAttempted = signal<boolean>(false);

  // Dashboard data signals
  totalTastings = signal<number>(0);
  averageRating = signal<number>(0);
  favoriteOrigin = signal<string>('');
  recentTastings = signal<CoffeeTasting[]>([]);
  allTastings = signal<CoffeeTasting[]>([]); // Todas las catas sin filtrar
  mappedTastings = signal<CardTastingInfo[]>([]); // Catas mapeadas para las tarjetas
  isLoading = signal<boolean>(0 as unknown as boolean); // ensure boolean initialization
  errorMessage = signal<string | null>(null);

  // New statistics signals
  topOrigins = signal<TopOrigin[]>([]);
  favoriteRoast = signal<string>('');
  favoriteBrewMethod = signal<string>('');
  tastingTrend = signal<string>('');
  insights = signal<Insight[]>([]);

  // Search filter signal
  searchQuery = signal<string>('');

  // Sort order signal
  sortOrder = signal<'recent' | 'best' | 'worst'>('recent');

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
    const query = this.searchQuery().toLowerCase().trim();
    const tastings = this.mappedTastings();
    const sort = this.sortOrder();

    // Filter tastings
    let filtered = tastings;
    if (query) {
      filtered = tastings.filter(
        (tasting) =>
          (tasting.coffeeName ?? '').toLowerCase().includes(query) ||
          (tasting.brand ?? '').toLowerCase().includes(query)
      );
    }

    // Sort tastings
    return [...filtered].sort((a, b) => {
      switch (sort) {
        case 'best':
          return b.score - a.score; // Mejor puntuación primero
        case 'worst':
          return a.score - b.score; // Peor puntuación primero
        case 'recent':
        default:
          // Más recientes primero (por fecha de creación)
          const dateA = new Date(a.createdAt || 0).getTime();
          const dateB = new Date(b.createdAt || 0).getTime();
          return dateB - dateA;
      }
    });
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

      console.log('🔍 Dashboard effect triggered:', {
        hasUser: !!user,
        isLoading: loading,
        dataLoadAttempted: this.dataLoadAttempted(),
        currentIsLoading: this.isLoading(),
      });

      if (loading) {
        // still initializing auth, don't act yet
        console.log('⏳ Auth still loading, waiting...');
        return;
      }

      if (!user) {
        // User logged out or not authenticated: clear dashboard data and redirect to home
        console.log('👤 No user, clearing data...');
        this.allTastings.set([]);
        this.recentTastings.set([]);
        this.mappedTastings.set([]);
        this.coffeeCardInfoService.clearIdMap();
        this.totalTastings.set(0);
        this.averageRating.set(0);
        this.favoriteOrigin.set('N/A');
        this.isLoading.set(false);
        this.errorMessage.set(null);
        this.dataLoadAttempted.set(false); // Reset the flag when user logs out

        // Only navigate if not already on the public root
        if (this.router.url !== '/') {
          this.router.navigate(['/']);
        }
      } else {
        // User is authenticated: load dashboard data
        // Only load if we haven't attempted to load data yet and we're not currently loading
        if (!this.dataLoadAttempted() && !this.isLoading()) {
          console.log('🔄 Attempting to load dashboard data...');
          this.loadDashboardData();
        } else {
          console.log('⏭️ Skipping load:', {
            dataLoadAttempted: this.dataLoadAttempted(),
            isLoading: this.isLoading(),
          });
        }
      }
    });
  }

  ngOnInit() {
    // Check initial route state
    const url = this.router.url;
    this.isChildRouteActive.set(url !== '/dashboard' && url.startsWith('/dashboard/'));
  }

  loadDashboardData() {
    // Mark that we've attempted to load data
    this.dataLoadAttempted.set(true);
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

    console.log('📊 Loading dashboard data for user:', userId);

    // Obtener las catas del usuario desde la base de datos
    this.coffeeService.getCoffeeTastingsByUser(userId).subscribe({
      next: (tastings) => {
        console.log('✅ Tastings loaded:', tastings.length);
        this.allTastings.set(tastings); // Guardar todas las catas
        this.recentTastings.set(tastings); // También actualizar recentTastings

        // Mapear las catas a CardTastingInfo
        const mappedTastings = tastings.map((tasting) =>
          this.coffeeCardInfoService.mapCoffeeTastingToCardInfo(tasting)
        );
        this.mappedTastings.set(mappedTastings);

        this.calculateStatistics(tastings);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('❌ Error al cargar las catas:', error);
        this.errorMessage.set('Error al cargar tus catas. Por favor intenta nuevamente.');
        this.isLoading.set(false);
      },
    });
  }

  calculateStatistics(tastings: CoffeeTasting[]) {
    // Total de catas
    this.totalTastings.set(tastings.length);

    if (tastings.length === 0) {
      this.averageRating.set(0);
      this.favoriteOrigin.set('N/A');
      this.topOrigins.set([]);
      this.favoriteRoast.set('');
      this.favoriteBrewMethod.set('');
      this.tastingTrend.set('');
      this.insights.set([]);
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

    // Top 3 orígenes más catados
    const topOriginsArray = Object.entries(originCount)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 3);
    this.topOrigins.set(topOriginsArray);

    // Tueste favorito
    const roastCount = tastings.reduce((acc, tasting) => {
      const roast = tasting.roast_level || 'Desconocido';
      acc[roast] = (acc[roast] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    const favoriteRoast = Object.entries(roastCount).reduce((a, b) => (a[1] > b[1] ? a : b))[0];

    // Traducir nivel de tueste a español
    const roastTranslation: Record<string, string> = {
      light: 'Claro',
      medium: 'Medio',
      dark: 'Oscuro',
    };
    const translatedRoast = roastTranslation[favoriteRoast] || favoriteRoast;
    this.favoriteRoast.set(translatedRoast);

    // Método de preparación favorito
    const brewMethodCount = tastings.reduce((acc, tasting) => {
      const method = tasting.brew_method || 'Desconocido';
      acc[method] = (acc[method] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    const favoriteBrewMethod = Object.entries(brewMethodCount).reduce((a, b) =>
      a[1] > b[1] ? a : b
    )[0];
    this.favoriteBrewMethod.set(favoriteBrewMethod);

    // Calcular tendencia de preferencias
    const trend = this.calculateTastingTrend(tastings);
    this.tastingTrend.set(trend);

    // Generar insights
    const generatedInsights = this.generateInsights(tastings);
    this.insights.set(generatedInsights);
  }

  /**
   * Calcula la tendencia de preferencias del usuario
   */
  private calculateTastingTrend(tastings: CoffeeTasting[]): string {
    if (tastings.length < 3) {
      return 'Aún no hay suficientes datos para determinar tu tendencia';
    }

    // Analizar características más comunes
    const bodyCount: Record<string, number> = {};
    const acidityCount: Record<string, number> = {};

    tastings.forEach((tasting) => {
      if (tasting.body) {
        bodyCount[tasting.body] = (bodyCount[tasting.body] || 0) + 1;
      }
      if (tasting.acidity) {
        acidityCount[tasting.acidity] = (acidityCount[tasting.acidity] || 0) + 1;
      }
    });

    const mostCommonBody = Object.entries(bodyCount).sort((a, b) => b[1] - a[1])[0]?.[0] || '';
    const mostCommonAcidity =
      Object.entries(acidityCount).sort((a, b) => b[1] - a[1])[0]?.[0] || '';

    if (mostCommonBody && mostCommonAcidity) {
      return `Prefieres cafés con cuerpo ${mostCommonBody.toLowerCase()} y acidez ${mostCommonAcidity.toLowerCase()}`;
    } else if (mostCommonBody) {
      return `Prefieres cafés con cuerpo ${mostCommonBody.toLowerCase()}`;
    } else if (mostCommonAcidity) {
      return `Prefieres cafés con acidez ${mostCommonAcidity.toLowerCase()}`;
    }

    return 'Explora más cafés para descubrir tu perfil de preferencias';
  }

  /**
   * Genera insights personalizados basados en las catas
   */
  private generateInsights(tastings: CoffeeTasting[]): Insight[] {
    const insights: Insight[] = [];

    if (tastings.length === 0) return insights;

    // Insight 1: Café favorito (mejor calificado)
    const topRatedTasting = [...tastings].sort((a, b) => b.score - a.score)[0];
    if (topRatedTasting) {
      insights.push({
        message: `Tu café favorito hasta ahora es ${topRatedTasting.coffee_name}, ${topRatedTasting.origin} con ${topRatedTasting.score} de calificación.`,
        icon: 'star',
      });
    }

    // Insight 2: Método favorito
    const brewMethodCount: Record<string, number> = {};
    tastings.forEach((t) => {
      if (t.brew_method) {
        brewMethodCount[t.brew_method] = (brewMethodCount[t.brew_method] || 0) + 1;
      }
    });
    const favoriteMethod = Object.entries(brewMethodCount).sort((a, b) => b[1] - a[1])[0];
    if (favoriteMethod) {
      insights.push({
        message: `El método ${favoriteMethod[0]} es el que más te gusta con ${favoriteMethod[1]} catas.`,
        icon: 'coffee',
      });
    }

    // Insight 3: Tendencia de preferencias
    const bodyCount: Record<string, number> = {};
    const acidityCount: Record<string, number> = {};
    tastings.forEach((t) => {
      if (t.body) bodyCount[t.body] = (bodyCount[t.body] || 0) + 1;
      if (t.acidity) acidityCount[t.acidity] = (acidityCount[t.acidity] || 0) + 1;
    });
    const mostCommonBody = Object.entries(bodyCount).sort((a, b) => b[1] - a[1])[0]?.[0];
    const mostCommonAcidity = Object.entries(acidityCount).sort((a, b) => b[1] - a[1])[0]?.[0];
    if (mostCommonBody && mostCommonAcidity) {
      insights.push({
        message: `Prefieres cafés con cuerpo ${mostCommonBody.toLowerCase()} y acidez ${mostCommonAcidity.toLowerCase()}.`,
        icon: 'heart',
      });
    }

    // Insight 4: Promedio de calificación
    const avgScore = tastings.reduce((sum, t) => sum + t.score, 0) / tastings.length;
    insights.push({
      message: `Tu calificación promedio es ${avgScore.toFixed(
        1
      )} de 10. ¡Sigue explorando nuevos cafés!`,
      icon: 'trend-up',
    });

    // Insight 5: Origen más explorado
    const originCount: Record<string, number> = {};
    tastings.forEach((t) => {
      if (t.origin) originCount[t.origin] = (originCount[t.origin] || 0) + 1;
    });
    const topOrigin = Object.entries(originCount).sort((a, b) => b[1] - a[1])[0];
    if (topOrigin) {
      insights.push({
        message: `Has catado ${topOrigin[1]} cafés de ${topOrigin[0]}. ¡Es tu origen favorito!`,
        icon: 'lightbulb',
      });
    }

    return insights;
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

  // Métodos de ordenamiento
  sortByBest() {
    this.sortOrder.set('best');
  }

  sortByWorst() {
    this.sortOrder.set('worst');
  }

  sortByRecent() {
    this.sortOrder.set('recent');
  }

  /**
   * Obtiene el ID original de una CardTastingInfo
   */
  getTastingId(tasting: CardTastingInfo): string | undefined {
    return this.coffeeCardInfoService.getTastingId(tasting);
  }
}
