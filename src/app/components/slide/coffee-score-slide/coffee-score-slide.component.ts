import { Component, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SliderTitleComponent } from '../../atoms/slider/slider-title/slider-title.component';
import { TranslatePipe } from '../../../services/language/translate.pipe';

export interface CoffeeScore {
  opinion: string;
  score: number;
}

export interface CoffeeImage {
  file: File | null;
  preview: string | null;
}

@Component({
  selector: 'app-coffee-score-slide',
  standalone: true,
  imports: [CommonModule, FormsModule, SliderTitleComponent, TranslatePipe],
  templateUrl: './coffee-score-slide.component.html',
  styleUrls: ['./coffee-score-slide.component.css'],
})
export class CoffeeScoreSlideComponent {
  scoreData = input.required<CoffeeScore>();
  scoreChange = output<Partial<CoffeeScore>>();
  imageChange = output<CoffeeImage>();
  saveForm = output<void>();
  opinionTouched = signal(false);
  selectedFile = signal<File | null>(null);
  selectedImage = signal<string | null>(null);
  errorMessage = signal<string | null>(null);

  // Validation state - track if fields have been touched
  scoreTouched = signal(false);

  onScoreInput(event: Event) {
    const input = event.target as HTMLInputElement;
    let value = input.value;

    // Limpiar ceros a la izquierda
    value = value.replace(/^0+/, '') || '0';

    // Convertir a número y validar
    const numericValue = parseInt(value, 10);

    // Si el valor está vacío o es inválido, usar 0
    if (isNaN(numericValue)) {
      value = '0';
    } else {
      // Asegurar que esté en el rango 0-10
      const validValue = Math.max(0, Math.min(10, numericValue));
      value = validValue.toString();
    }

    // Actualizar el valor del input si cambió
    if (input.value !== value) {
      input.value = value;
    }

    this.onScoreChange(parseInt(value, 10));
  }

  onScoreChange(value: number) {
    this.scoreTouched.set(true);

    // Validar que el valor esté entre 0 y 10
    const validValue = Math.max(0, Math.min(10, value));

    this.scoreChange.emit({
      score: validValue,
    });
  }

  onScoreKeydown(event: KeyboardEvent) {
    // Permitir teclas de navegación y control
    const allowedKeys = [
      'Backspace',
      'Delete',
      'Tab',
      'Escape',
      'Enter',
      'ArrowLeft',
      'ArrowRight',
      'ArrowUp',
      'ArrowDown',
      'Home',
      'End',
    ];

    if (allowedKeys.includes(event.key)) {
      return;
    }

    // Permitir solo números del 0 al 9
    if (!/^[0-9]$/.test(event.key)) {
      event.preventDefault();
      return;
    }

    // Obtener el valor actual del input
    const input = event.target as HTMLInputElement;
    const currentValue = input.value;

    // Si el valor actual es 0 y se intenta agregar otro dígito, prevenir
    if (currentValue === '0' && event.key !== '0') {
      // Permitir reemplazar el 0 con otro dígito
      return;
    }

    // Si el valor actual es 0 y se intenta agregar otro 0, prevenir
    if (currentValue === '0' && event.key === '0') {
      event.preventDefault();
      return;
    }

    // Crear el nuevo valor para validar
    const newValue = currentValue + event.key;
    const numericValue = parseInt(newValue, 10);

    // Si el nuevo valor sería mayor a 10, prevenir la entrada
    if (numericValue > 10) {
      event.preventDefault();
      return;
    }

    // Si el valor actual ya tiene un dígito y el nuevo valor sería inválido, prevenir
    if (currentValue.length >= 1 && numericValue > 10) {
      event.preventDefault();
      return;
    }
  }

  onScorePaste(event: ClipboardEvent) {
    event.preventDefault();

    const pastedText = event.clipboardData?.getData('text') || '';
    const numericValue = parseInt(pastedText, 10);

    // Solo permitir pegar si es un número válido entre 0 y 10
    if (!isNaN(numericValue) && numericValue >= 0 && numericValue <= 10) {
      this.onScoreChange(numericValue);
    }
  }

  onOpinionChange(value: string) {
    this.opinionTouched.set(true);
    // Limitar la longitud a 500 caracteres
    const limitedValue = value.length > 500 ? value.substring(0, 500) : value;
    this.scoreChange.emit({ opinion: limitedValue });
  }

  onSaveForm() {
    this.saveForm.emit();
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
        this.errorMessage.set('invalidImageError');
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
        const preview = e.target?.result as string;
        this.selectedImage.set(preview);

        // Emit image change to parent
        this.imageChange.emit({
          file: file,
          preview: preview,
        });
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

    // Emit null image to parent
    this.imageChange.emit({
      file: null,
      preview: null,
    });
  }

  // Validation methods
  isScoreValid(): boolean {
    const score = this.scoreData().score;
    return score >= 0 && score <= 10;
  }

  // Show error methods
  shouldShowScoreError(): boolean {
    return this.scoreTouched() && !this.isScoreValid();
  }
}
