import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoffeeTasting } from '../../../services/coffee.service';

@Component({
  selector: 'app-tasting-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tasting-card.component.html',
  styleUrl: './tasting-card.component.css',
})
export class TastingCardComponent {
  @Input() tasting!: CoffeeTasting;
  @Output() cardClick = new EventEmitter<string>();

  onCardClick() {
    if (this.tasting.id) {
      this.cardClick.emit(this.tasting.id);
    }
  }
}
