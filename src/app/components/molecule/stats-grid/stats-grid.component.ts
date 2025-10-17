import { Component, Input, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';

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
  imports: [CommonModule],
  templateUrl: './stats-grid.component.html',
  styleUrl: './stats-grid.component.css',
})
export class StatsGridComponent implements OnInit, OnDestroy {
  @Input() totalTastings: number = 0;
  @Input() topOrigins: TopOrigin[] = [];
  @Input() favoriteRoast: string = '';
  @Input() favoriteBrewMethod: string = '';
  @Input() tastingTrend: string = '';
  @Input() insights: Insight[] = [];

  currentInsightIndex = 0;
  private intervalId: any;

  constructor(private cdr: ChangeDetectorRef) {}

  // Mapeo de países a códigos de bandera
  countryFlags: Record<string, string> = {
    'Colombia': 'co',
    'Brasil': 'br', 
    'Etiopía': 'et',
    'Guatemala': 'gt',
    'Costa Rica': 'cr',
    'Honduras': 'hn',
    'Perú': 'pe',
    'México': 'mx',
    'Nicaragua': 'ni',
    'Jamaica': 'jm',
    'Hawaii': 'us',
    'Indonesia': 'id',
    'Vietnam': 'vn',
    'India': 'in',
    'Kenia': 'ke',
    'Tanzania': 'tz',
    'Uganda': 'ug',
    'Rwanda': 'rw',
    'Burundi': 'bi',
    'Yemen': 'ye',
    'República Dominicana': 'do',
    'Puerto Rico': 'pr',
    'Ecuador': 'ec',
    'Bolivia': 'bo',
    'Venezuela': 've',
    'Panamá': 'pa',
    'El Salvador': 'sv',
    'Cuba': 'cu'
  };

  // Mapeo de métodos de preparación a imágenes
  brewMethodImages: Record<string, string> = {
    'V60': '/assets/brew_method/pourover.png',
    'Espresso': '/assets/brew_method/espresso.png',
    'Prensa Francesa': '/assets/brew_method/french_press.png',
    'Chemex': '/assets/brew_method/chemex.png',
    'Aeropress': '/assets/brew_method/aeropress.png',
    'Moka': '/assets/brew_method/moka_pot.png',
    'Cold Brew': '/assets/brew_method/cold_brew.png'
  };

  getCountryFlag(country: string): string {
    return this.countryFlags[country] || 'xx'; // 'xx' es un código genérico para países no encontrados
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
    }, 4000); // Cambiar cada 4 segundos
  }
}
