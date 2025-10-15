import { Component, input, output, signal } from '@angular/core';
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
  selector: 'app-coffee-flavor-slide',
  standalone: true,
  imports: [CommonModule, FormsModule, SliderTitleComponent],
  templateUrl: './coffee-flavor-slide.component.html',
  styleUrls: ['./coffee-flavor-slide.component.css'],
})
export class CoffeeFlavorSlideComponent {
  sensoryData = input.required<CoffeeSensory>();
  sensoryChange = output<Partial<CoffeeSensory>>();
  acidityLevels = input.required<InfoLevel[]>();
  afterTasteLevels = input.required<InfoLevel[]>();

  // Validation state - track if fields have been touched
  acidityTouched = signal(false);
  aftertasteTouched = signal(false);

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

  getCurrentAcidityIcon(): string {
    const currentAcidity = this.sensoryData().acidity;
    const level = this.acidityLevels().find((l) => l.value === currentAcidity);
    return level?.icon || '🍊';
  }

  getCurrentAcidityDescription(): string {
    const currentAcidity = this.sensoryData().acidity;
    const level = this.acidityLevels().find((l) => l.value === currentAcidity);
    return level?.description || this.acidityLevels()[0]?.description || '';
  }

  onAciditySliderChange(index: string) {
    this.acidityTouched.set(true);
    const acidityIndex = parseInt(index, 10);
    const selectedLevel = this.acidityLevels()[acidityIndex];
    if (selectedLevel) {
      this.sensoryChange.emit({ acidity: selectedLevel.value });
    }
  }

  // Aftertaste slider helper methods
  getCurrentAftertasteIndex(): number {
    const currentAftertaste = this.sensoryData().aftertaste;
    return this.afterTasteLevels().findIndex((level) => level.value === currentAftertaste);
  }

  getCurrentAftertasteColor(): string {
    const currentAftertaste = this.sensoryData().aftertaste;
    const level = this.afterTasteLevels().find((l) => l.value === currentAftertaste);
    return level?.color || '#ab47bc';
  }

  getCurrentAftertasteIcon(): string {
    const currentAftertaste = this.sensoryData().aftertaste;
    const level = this.afterTasteLevels().find((l) => l.value === currentAftertaste);
    return level?.icon || '🌬️';
  }

  getCurrentAftertasteDescription(): string {
    const currentAftertaste = this.sensoryData().aftertaste;
    const level = this.afterTasteLevels().find((l) => l.value === currentAftertaste);
    return level?.description || this.afterTasteLevels()[0]?.description || '';
  }

  onAftertasteSliderChange(index: string) {
    this.aftertasteTouched.set(true);
    const aftertasteIndex = parseInt(index, 10);
    const selectedLevel = this.afterTasteLevels()[aftertasteIndex];
    if (selectedLevel) {
      this.sensoryChange.emit({ aftertaste: selectedLevel.value });
    }
  }

  onBodyChange(value: number) {
    this.sensoryChange.emit({ body: value });
  }

  onAcidityChange(value: number) {
    this.acidityTouched.set(true);
    this.sensoryChange.emit({ acidity: value });
  }

  onAftertasteChange(value: number) {
    this.aftertasteTouched.set(true);
    this.sensoryChange.emit({ aftertaste: value });
  }

  onAromaChange(value: string) {
    this.sensoryChange.emit({ aroma: value });
  }

  onFlavorChange(value: string) {
    this.sensoryChange.emit({ flavor: value });
  }

  // Validation methods
  isAcidityValid(): boolean {
    return this.sensoryData().acidity > 0;
  }

  isAftertasteValid(): boolean {
    return this.sensoryData().aftertaste > 0;
  }

  // Show error methods
  shouldShowAcidityError(): boolean {
    return this.acidityTouched() && !this.isAcidityValid();
  }

  shouldShowAftertasteError(): boolean {
    return this.aftertasteTouched() && !this.isAftertasteValid();
  }
}
