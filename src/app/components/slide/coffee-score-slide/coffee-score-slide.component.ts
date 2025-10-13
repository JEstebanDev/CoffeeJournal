import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SliderTitleComponent } from '../../atoms/slider/slider-title/slider-title.component';

export interface CoffeeSensory {
  body: number;
  acidity: number;
  aftertaste: number;
  aroma: string;
  flavor: string;
}

export interface InfoLevel {
  value: number;
  label: string;
  icon: string;
  description: string;
  color: string;
}

@Component({
  selector: 'app-coffee-score-slide',
  standalone: true,
  imports: [CommonModule, FormsModule, SliderTitleComponent],
  templateUrl: './coffee-score-slide.component.html',
  styleUrls: ['./coffee-score-slide.component.css'],
})
export class CoffeeScoreSlideComponent {
  sensoryData = input.required<CoffeeSensory>();
  sensoryChange = output<Partial<CoffeeSensory>>();

  onBodyChange(value: number) {
    this.sensoryChange.emit({ body: value });
  }

  onAromaChange(value: string) {
    this.sensoryChange.emit({ aroma: value });
  }

  onFlavorChange(value: string) {
    this.sensoryChange.emit({ flavor: value });
  }
}
