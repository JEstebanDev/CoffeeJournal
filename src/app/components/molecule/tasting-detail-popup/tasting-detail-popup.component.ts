import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoffeeTasting } from '../../../services/coffee';
import { CoffeeCardInfoService } from '../../../services/coffee/coffee-card-info.service';
import { TranslatePipe } from '../../../services/language/translate.pipe';
import { CardTastingInfo } from '../../../services/forms';

@Component({
  selector: 'app-tasting-detail-popup',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  templateUrl: './tasting-detail-popup.component.html',
  styleUrl: './tasting-detail-popup.component.css',
})
export class TastingDetailPopupComponent implements OnInit {
  @Input() tasting!: CoffeeTasting;
  @Output() close = new EventEmitter<void>();

  private coffeeCardInfoService = new CoffeeCardInfoService();
  mappedTasting: CardTastingInfo | null = null;

  ngOnInit() {
    if (this.tasting) {
      this.mappedTasting = this.coffeeCardInfoService.mapCoffeeTastingToCardInfo(this.tasting);
    }
  }

  onClose() {
    this.close.emit();
  }

  onBackdropClick(event: Event) {
    if (event.target === event.currentTarget) {
      this.onClose();
    }
  }

  // Helper methods for formatting data
  getFormattedDate(date: Date | string | undefined): string {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  getScoreColor(score: number): string {
    if (score >= 8) return '#10b981'; // green
    if (score >= 6) return '#f59e0b'; // yellow
    return '#ef4444'; // red
  }

  getScoreStars(score: number): string {
    const fullStars = Math.floor(score / 2);
    const hasHalfStar = score % 2 >= 1;
    let stars = '★'.repeat(fullStars);
    if (hasHalfStar) stars += '☆';
    return stars;
  }

  // Helper methods for getting translated values
  getRoastLevel(): string {
    return this.mappedTasting?.roastLevel?.label || this.tasting.roast_level;
  }

  getBrewMethod(): string {
    return this.mappedTasting?.brewMethod?.name || this.tasting.brew_method;
  }

  getBeanType(): string {
    return this.mappedTasting?.beanType || this.tasting.bean_type;
  }

  getBody(): string {
    if (this.mappedTasting?.body) {
      return `${this.mappedTasting.body.label} - ${this.mappedTasting.body.description}`;
    }
    return this.tasting.body;
  }

  getAcidity(): string {
    if (this.mappedTasting?.acidity) {
      return `${this.mappedTasting.acidity.label} - ${this.mappedTasting.acidity.description}`;
    }
    return this.tasting.acidity;
  }

  getAftertaste(): string {
    if (this.mappedTasting?.aftertaste) {
      return `${this.mappedTasting.aftertaste.label} - ${this.mappedTasting.aftertaste.description}`;
    }
    return this.tasting.aftertaste;
  }

  getAftertasteDescription(): string {
    const aftertasteParts = this.tasting.aftertaste?.split(' - ') || [];
    if (aftertasteParts.length > 1) {
      const description = aftertasteParts.slice(1).join('. ').trim();
      const dotIndex = description.indexOf('.');
      if (dotIndex !== -1) {
        return description.substring(dotIndex + 1).trim();
      }
      return description;
    }
    return '';
  }

  // Métodos para obtener solo las claves de traducción (sin concatenar)
  getBodyLabel(): string {
    return this.mappedTasting?.body?.label || this.tasting.body?.split(' - ')[0] || '';
  }

  getBodyDescription(): string {
    return this.mappedTasting?.body?.description || this.tasting.body?.split(' - ')[1] || '';
  }

  getAcidityLabel(): string {
    return this.mappedTasting?.acidity?.label || this.tasting.acidity?.split(' - ')[0] || '';
  }

  getAcidityDescription(): string {
    return this.mappedTasting?.acidity?.description || this.tasting.acidity?.split(' - ')[1] || '';
  }

  getAftertasteLabel(): string {
    return this.mappedTasting?.aftertaste?.label || this.tasting.aftertaste?.split(' - ')[0] || '';
  }

  getAftertasteDescriptionKey(): string {
    return (
      this.mappedTasting?.aftertaste?.description || this.tasting.aftertaste?.split(' - ')[1] || ''
    );
  }
}
