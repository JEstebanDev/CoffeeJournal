import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardTastingInfo } from '../../../services/slide/slide.interface';

@Component({
  selector: 'app-tasting-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tasting-card.component.html',
  styleUrl: './tasting-card.component.css',
})
export class TastingCardComponent {
  @Input() tasting!: CardTastingInfo;
  @Input() tastingId?: string; // ID for navigation
  @Output() cardClick = new EventEmitter<string>();

  onCardClick() {
    if (this.tastingId) {
      this.cardClick.emit(this.tastingId);
    }
  }
}
