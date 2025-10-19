import { Component, Input, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CountriesService } from '../../../services/countries';
import { TranslatePipe } from '../../../services/language/translate.pipe';

export interface TopOrigin {
  name: string;
  count: number;
}

export interface Insight {
  message: string;
  icon: string;
}

@Component({
  selector: 'app-stats-grid',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  templateUrl: './stats-grid.component.html',
  styleUrl: './stats-grid.component.css',
})
export class StatsGridComponent implements OnInit, OnDestroy {
  @Input() totalTastings: number = 0;
  @Input() topOrigins: TopOrigin[] = [];
  @Input() favoriteBrewMethod: string = '';
  @Input() tastingTrend: string = '';
  @Input() insights: Insight[] = [];

  currentInsightIndex = 0;
  private intervalId: any;

  constructor(private cdr: ChangeDetectorRef, private countriesService: CountriesService) {}
  // Mapeo de métodos de preparación a imágenes
  brewMethodImages: Record<string, string> = {
    V60: '/assets/brew_method/pourover.png',
    Espresso: '/assets/brew_method/espresso.png',
    'Prensa Francesa': '/assets/brew_method/french_press.png',
    Chemex: '/assets/brew_method/chemex.png',
    Aeropress: '/assets/brew_method/aeropress.png',
    Moka: '/assets/brew_method/moka_pot.png',
    'Cold Brew': '/assets/brew_method/cold_brew.png',
  };

  getCountryFlag(country: string): string {
    if (country.split(',').length !== 1) {
      country = country.split(',')[0].toString();
    }
    return this.countriesService.getCountryFlag(country);
  }

  getBrewMethodImage(method: string): string {
    return this.brewMethodImages[method] || '/assets/brew_method/pourover.png';
  }

  ngOnInit() {
    if (this.insights.length > 0) {
      this.startInsightRotation();
    }
  }

  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  private startInsightRotation() {
    this.intervalId = setInterval(() => {
      this.currentInsightIndex = (this.currentInsightIndex + 1) % this.insights.length;
      this.cdr.detectChanges();
    }, 5000); // Cambiar cada 5 segundos
  }

  // Método para navegar al siguiente insight manualmente
  nextInsight() {
    if (this.insights.length > 0) {
      this.currentInsightIndex = (this.currentInsightIndex + 1) % this.insights.length;
      this.cdr.detectChanges();
    }
  }
}
