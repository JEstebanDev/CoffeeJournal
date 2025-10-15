import { Component, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SliderTitleComponent } from '../../atoms/slider/slider-title/slider-title.component';

export interface CoffeeRoast {
  roastLevel: string;
  brewMethod: string;
}

export interface RoastLevel {
  value: string;
  label: string;
  color: string;
}

export interface BrewMethod {
  name: string;
  image: string;
}

@Component({
  selector: 'app-coffee-roast-slide',
  standalone: true,
  imports: [CommonModule, FormsModule, SliderTitleComponent],
  templateUrl: './coffee-roast-slide.component.html',
  styleUrls: ['./coffee-roast-slide.component.css'],
})
export class CoffeeRoastSlideComponent {
  // Inputs
  coffeeData = input.required<CoffeeRoast>();
  roastLevels = input.required<RoastLevel[]>();
  brewMethodsOptions = input.required<BrewMethod[]>();

  // Outputs
  roastLevelChange = output<string>();
  brewMethodChange = output<string>();

  // Validation state - track if fields have been touched
  roastLevelTouched = signal(false);
  brewMethodTouched = signal(false);

  selectRoastLevel(level: string) {
    this.roastLevelChange.emit(level);
  }

  getCurrentRoastIndex(): number {
    const currentLevel = this.coffeeData().roastLevel;
    return this.roastLevels().findIndex((level) => level.value === currentLevel);
  }

  getCurrentRoastColor(): string {
    const currentLevel = this.coffeeData().roastLevel;
    const level = this.roastLevels().find((l) => l.value === currentLevel);
    return level?.color || '#8B4513';
  }

  getCurrentRoastEmoji(): string {
    const currentLevel = this.coffeeData().roastLevel;
    const emojiMap: { [key: string]: string } = {
      light: '☕',
      medium: '🍂',
      dark: '🔥',
    };
    return emojiMap[currentLevel] || '☕';
  }

  onSliderChange(index: string) {
    this.roastLevelTouched.set(true);
    const roastIndex = parseInt(index, 10);
    const selectedLevel = this.roastLevels()[roastIndex];
    if (selectedLevel) {
      this.roastLevelChange.emit(selectedLevel.value);
    }
  }

  selectBrewMethod(method: string) {
    this.brewMethodTouched.set(true);
    this.brewMethodChange.emit(method);
  }

  isBrewMethodSelected(method: string): boolean {
    return this.coffeeData().brewMethod === method;
  }

  // Validation methods
  isRoastLevelValid(): boolean {
    return !!this.coffeeData().roastLevel;
  }

  isBrewMethodValid(): boolean {
    return !!this.coffeeData().brewMethod;
  }

  // Show error methods
  shouldShowRoastLevelError(): boolean {
    return this.roastLevelTouched() && !this.isRoastLevelValid();
  }

  shouldShowBrewMethodError(): boolean {
    return this.brewMethodTouched() && !this.isBrewMethodValid();
  }
}
