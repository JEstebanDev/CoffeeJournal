import { Component, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SliderTitleComponent } from '../../atoms/slider/slider-title/slider-title.component';

export interface CoffeeSensory {
  body: number;
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
