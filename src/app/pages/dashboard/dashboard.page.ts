import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

interface CoffeeTasting {
  id: string;
  coffeeName: string;
  origin: string;
  roastLevel: string;
  brewMethod: string;
  rating: number;
  date: Date;
  notes: string;
  aroma: number;
  body: number;
  acidity: number;
  flavor: number;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.page.html',
  styleUrl: './dashboard.page.css',
})
export class DashboardPage implements OnInit {
  private auth = inject(AuthService);
  private router = inject(Router);

  // User data signals provided by the AuthService
  user = this.auth.user;
  userName = this.auth.userName;
  userEmail = this.auth.userEmail;
  userPicture = this.auth.userPicture;

  // Signal to track if image failed to load
  imageLoadError = signal<boolean>(false);

  // Dashboard data signals
  totalTastings = signal<number>(0);
  averageRating = signal<number>(0);
  favoriteOrigin = signal<string>('');
  recentTastings = signal<CoffeeTasting[]>([]);
  isLoading = signal<boolean>(true);

  // Example of a computed signal if needed in the template
  averageRatingRounded = computed(() => Math.round(this.averageRating()));

  ngOnInit() {
    // Load dashboard data (simulated)
    this.loadDashboardData();
  }

  loadDashboardData() {
    // Simulación de carga de datos
    // En producción, esto vendría de un servicio/API
    setTimeout(() => {
      this.totalTastings.set(24);
      this.averageRating.set(4.2);
      this.favoriteOrigin.set('Colombia');

      // Datos de ejemplo de catas recientes
      this.recentTastings.set([
        {
          id: '1',
          coffeeName: 'Café Especial Huila',
          origin: 'Colombia',
          roastLevel: 'Medio',
          brewMethod: 'V60',
          rating: 4.5,
          date: new Date('2024-01-15'),
          notes: 'Notas de chocolate y caramelo, muy equilibrado',
          aroma: 4,
          body: 5,
          acidity: 4,
          flavor: 5,
        },
        {
          id: '2',
          coffeeName: 'Ethiopian Yirgacheffe',
          origin: 'Etiopía',
          roastLevel: 'Claro',
          brewMethod: 'Chemex',
          rating: 4.8,
          date: new Date('2024-01-12'),
          notes: 'Floral, cítrico, muy aromático',
          aroma: 5,
          body: 4,
          acidity: 5,
          flavor: 5,
        },
        {
          id: '3',
          coffeeName: 'Sumatra Mandheling',
          origin: 'Indonesia',
          roastLevel: 'Oscuro',
          brewMethod: 'French Press',
          rating: 4.0,
          date: new Date('2024-01-10'),
          notes: 'Terroso, cuerpo completo, baja acidez',
          aroma: 4,
          body: 5,
          acidity: 3,
          flavor: 4,
        },
      ]);

      this.isLoading.set(false);
    }, 1000);
  }

  onNewTasting() {
    this.router.navigate(['/tasting/new']);
  }

  onViewAllTastings() {
    this.router.navigate(['/tastings']);
  }

  onViewTasting(tastingId: string) {
    this.router.navigate(['/tasting', tastingId]);
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
}
