import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface CoffeeRoast {
  roastLevel: string;
  brewMethods: string[];
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
  imports: [CommonModule, FormsModule],
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
  brewMethodToggle = output<string>();

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
    const roastIndex = parseInt(index, 10);
    const selectedLevel = this.roastLevels()[roastIndex];
    if (selectedLevel) {
      this.roastLevelChange.emit(selectedLevel.value);
    }
  }
  
  toggleBrewMethod(method: string) {
    this.brewMethodToggle.emit(method);
  }

  isBrewMethodSelected(method: string): boolean {
    return this.coffeeData().brewMethods.includes(method);
  }

}
