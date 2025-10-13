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
  selector: 'app-coffee-sensory-slide',
  standalone: true,
  imports: [CommonModule, FormsModule, SliderTitleComponent],
  templateUrl: './coffee-sensory-slide.component.html',
  styleUrls: ['./coffee-sensory-slide.component.css'],
})
export class CoffeeSensorySlideComponent {
  sensoryData = input.required<CoffeeSensory>();
  sensoryChange = output<Partial<CoffeeSensory>>();
  bodyLevels = input.required<InfoLevel[]>();
  acidityLevels = input.required<InfoLevel[]>();
  afterTasteLevels = input.required<InfoLevel[]>();

  // Acidity scale configuration

  // Body slider helper methods
  getCurrentBodyIndex(): number {
    const currentBody = this.sensoryData().body;
    return this.bodyLevels().findIndex((level) => level.value === currentBody);
  }

  getCurrentBodyColor(): string {
    const currentBody = this.sensoryData().body;
    const level = this.bodyLevels().find((l) => l.value === currentBody);
    return level?.color || '#8d6e63';
  }

  getCurrentBodyIcon(): string {
    const currentBody = this.sensoryData().body;
    const level = this.bodyLevels().find((l) => l.value === currentBody);
    return level?.icon || '💧';
  }

  getCurrentDescription(): string {
    const currentBody = this.sensoryData().body;
    const level = this.bodyLevels().find((l) => l.value === currentBody);
    return level?.description || this.bodyLevels()[0]?.description || '';
  }

  onBodySliderChange(index: string) {
    const bodyIndex = parseInt(index, 10);
    const selectedLevel = this.bodyLevels()[bodyIndex];
    if (selectedLevel) {
      this.sensoryChange.emit({ body: selectedLevel.value });
    }
  }

  // Acidity slider helper methods
  getCurrentAcidityIndex(): number {
    const currentAcidity = this.sensoryData().acidity;
    return this.acidityLevels().findIndex((level) => level.value === currentAcidity);
  }

  getCurrentAcidityColor(): string {
    const currentAcidity = this.sensoryData().acidity;
    const level = this.acidityLevels().find((l) => l.value === currentAcidity);
    return level?.color || '#ffa726';
  }

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
