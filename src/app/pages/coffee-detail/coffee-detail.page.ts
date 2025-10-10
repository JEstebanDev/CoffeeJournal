import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { CoffeeService, CoffeeTasting } from '../../services/coffee.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-coffee-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './coffee-detail.page.html',
  styleUrl: './coffee-detail.page.css',
})
export class CoffeeDetailPage implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private coffeeService = inject(CoffeeService);
  private auth = inject(AuthService);

  // User data signals
  user = this.auth.user;
  userName = this.auth.userName;
  userEmail = this.auth.userEmail;
  userPicture = this.auth.userPicture;

  // Coffee detail signals
  coffee = signal<CoffeeTasting | null>(null);
  isLoading = signal<boolean>(true);
  errorMessage = signal<string | null>(null);
  imageLoadError = signal<boolean>(false);

  ngOnInit() {
    const coffeeId = this.route.snapshot.paramMap.get('id');
    if (coffeeId) {
      this.loadCoffeeDetail(coffeeId);
    } else {
      this.errorMessage.set('ID de café no válido');
      this.isLoading.set(false);
    }
  }

  loadCoffeeDetail(coffeeId: string) {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    const userId = this.auth.userId();
    if (userId=='') {
      this.errorMessage.set('No se pudo obtener la información del usuario');
      this.isLoading.set(false);
      return;
    }

    // Obtener todas las catas del usuario y buscar la específica
    this.coffeeService.getCoffeeTastingsByUser(userId).subscribe({
      next: (tastings) => {
        const foundCoffee = tastings.find(tasting => tasting.id === coffeeId);
        if (foundCoffee) {
          this.coffee.set(foundCoffee);
        } else {
          this.errorMessage.set('Café no encontrado');
        }
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error al cargar el detalle del café:', error);
        this.errorMessage.set('Error al cargar el detalle del café. Por favor intenta nuevamente.');
        this.isLoading.set(false);
      },
    });
  }

  onBack() {
    this.router.navigate(['/dashboard']);
  }

  onEdit() {
    const coffee = this.coffee();
    if (coffee) {
      this.router.navigate(['/dashboard/coffee/edit', coffee.id]);
    }
  }

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
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  onLogout() {
    if (typeof this.auth.logout === 'function') {
      try {
        (this.auth as any).logout?.({ returnTo: window.location.origin });
      } catch {
        (this.auth as any).logout?.();
      }
    }
  }
}