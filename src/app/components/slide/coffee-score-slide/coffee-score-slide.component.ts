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
  selector: 'app-coffee-score-slide',
  standalone: true,
  imports: [CommonModule, FormsModule, SliderTitleComponent],
  templateUrl: './coffee-score-slide.component.html',
  styleUrls: ['./coffee-score-slide.component.css'],
})
export class CoffeeScoreSlideComponent {
  sensoryData = input.required<CoffeeSensory>();
  sensoryChange = output<Partial<CoffeeSensory>>();
  selectedFile = signal<File | null>(null);
  selectedImage = signal<string | null>(null);
  errorMessage = signal<string | null>(null);
  onBodyChange(value: number) {
    this.sensoryChange.emit({ body: value });
  }

  onAromaChange(value: string) {
    this.sensoryChange.emit({ aroma: value });
  }

  onFlavorChange(value: string) {
    this.sensoryChange.emit({ flavor: value });
  }

  /**
   * Maneja la selección de imagen
   */
  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];

      // Validar tipo de archivo
      if (!file.type.startsWith('image/')) {
        this.errorMessage.set('Por favor selecciona un archivo de imagen válido');
        return;
      }

      // Validar tamaño (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        this.errorMessage.set('La imagen no debe superar los 5MB');
        return;
      }

      this.selectedFile.set(file);

      // Crear preview
      const reader = new FileReader();
      reader.onload = (e) => {
        this.selectedImage.set(e.target?.result as string);
      };
      reader.readAsDataURL(file);

      this.errorMessage.set(null);
    }
  }
  /**
   * Elimina la imagen seleccionada
   */
  removeImage(): void {
    this.selectedImage.set(null);
    this.selectedFile.set(null);
  }
}
