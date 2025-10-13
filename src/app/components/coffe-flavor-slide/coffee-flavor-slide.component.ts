import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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
  imports: [CommonModule, FormsModule],
  templateUrl: './coffee-flavor-slide.component.html',
  styleUrls: ['./coffee-flavor-slide.component.css'],
})
export class CoffeeFlavorSlideComponent {
  sensoryData = input.required<CoffeeSensory>();
  sensoryChange = output<Partial<CoffeeSensory>>();
  acidityLevels = input.required<InfoLevel[]>();
  afterTasteLevels = input.required<InfoLevel[]>();

  // Acidity scale configuration

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
    return level?.description || '';
  }

  onAciditySliderChange(index: string) {
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
    return level?.description || '';
  }

  onAftertasteSliderChange(index: string) {
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
    this.sensoryChange.emit({ acidity: value });
  }

  onAftertasteChange(value: number) {
    this.sensoryChange.emit({ aftertaste: value });
  }

  onAromaChange(value: string) {
    this.sensoryChange.emit({ aroma: value });
  }

  onFlavorChange(value: string) {
    this.sensoryChange.emit({ flavor: value });
  }
}
