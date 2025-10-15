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

  // Validation state - track if fields have been touched
  bodyTouched = signal(false);
  acidityTouched = signal(false);
  aftertasteTouched = signal(false);
  aromaTouched = signal(false);
  flavorTouched = signal(false);

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
    this.bodyTouched.set(true);
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

  getCurrentAcidityIcon(): string {
    const currentAcidity = this.sensoryData().acidity;
    const level = this.acidityLevels().find((l) => l.value === currentAcidity);
    return level?.icon || '🍋';
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
    return level?.color || '#8d6e63';
  }

  getCurrentAftertasteIcon(): string {
    const currentAftertaste = this.sensoryData().aftertaste;
    const level = this.afterTasteLevels().find((l) => l.value === currentAftertaste);
    return level?.icon || '✨';
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
    this.bodyTouched.set(true);
    this.sensoryChange.emit({ body: value });
  }

  onAromaChange(value: string) {
    this.aromaTouched.set(true);
    this.sensoryChange.emit({ aroma: value });
  }

  onFlavorChange(value: string) {
    this.flavorTouched.set(true);
    this.sensoryChange.emit({ flavor: value });
  }

  // Validation methods
  isBodyValid(): boolean {
    return this.sensoryData().body > 0;
  }

  isAcidityValid(): boolean {
    return this.sensoryData().acidity > 0;
  }

  isAftertasteValid(): boolean {
    return this.sensoryData().aftertaste > 0;
  }

  isAromaValid(): boolean {
    return !!this.sensoryData().aroma && this.sensoryData().aroma.trim().length > 0;
  }

  isFlavorValid(): boolean {
    return !!this.sensoryData().flavor && this.sensoryData().flavor.trim().length > 0;
  }

  // Show error methods
  shouldShowBodyError(): boolean {
    return this.bodyTouched() && !this.isBodyValid();
  }

  shouldShowAromaError(): boolean {
    return this.aromaTouched() && !this.isAromaValid();
  }

  shouldShowFlavorError(): boolean {
    return this.flavorTouched() && !this.isFlavorValid();
  }
}
