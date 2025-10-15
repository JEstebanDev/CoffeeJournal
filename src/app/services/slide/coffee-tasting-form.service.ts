import { Injectable, signal, computed } from '@angular/core';
import { RoastLevel } from '../../components/slide/roast-level.interface';

// Types
export interface CoffeeIdentity {
  brand: string;
  coffeeName: string;
  beanType: string;
  origin: string;
}

export interface CoffeeRoast {
  roastLevel: string;
  brewMethod: string;
}

export interface CoffeeSensory {
  aroma: string;
  body: number;
  flavor: string;
}

export interface CoffeeFlavor {
  acidity: number;
  aftertaste: number;
  aftertasteDescription: string;
}

export interface CoffeeScore {
  opinion: string;
  score: number;
}

export interface CoffeeImage {
  file: File | null;
  preview: string | null;
}

export interface InfoLevel {
  value: number;
  label: string;
  icon: string;
  description: string;
  color: string;
}

export interface FullCoffeeData {
  brand: string;
  coffeeName: string;
  beanType: string;
  origin: string;
  roastLevel: string;
  brewMethod: string;
  aroma: string;
  body: number;
  acidity: number;
  flavor: string;
  aftertaste: number;
  aftertasteDescription: string;
  opinion: string;
  score: number;
}

@Injectable({
  providedIn: 'root',
})
export class CoffeeTastingFormService {
  // Form data signals
  coffeeIdentity = signal<CoffeeIdentity>({
    brand: '',
    coffeeName: '',
    beanType: '',
    origin: '',
  });

  coffeeRoast = signal<CoffeeRoast>({
    roastLevel: '',
    brewMethod: '',
  });

  coffeeSensory = signal<CoffeeSensory>({
    aroma: '',
    body: 0,
    flavor: '',
  });

  coffeeFlavor = signal<CoffeeFlavor>({
    acidity: 0,
    aftertaste: 0,
    aftertasteDescription: '',
  });

  coffeeScore = signal<CoffeeScore>({
    opinion: '',
    score: 0,
  });

  selectedImage = signal<CoffeeImage>({
    file: null,
    preview: null,
  });

  // Options data
  readonly beanTypes = ['Arabica', 'Robusta', 'Liberica'];

  readonly roastLevels: RoastLevel[] = [
    { value: 'light', label: 'Claro ☀️', color: '#D4A574' },
    { value: 'medium', label: 'Medio 🌤️', color: '#8B6F47' },
    { value: 'dark', label: 'Oscuro 🌑', color: '#3E2723' },
  ];

  readonly brewMethodsOptions = [
    { name: 'V60', image: '/assets/brew_method/pourover.png' },
    { name: 'Espresso', image: '/assets/brew_method/espresso.png' },
    { name: 'Prensa Francesa', image: '/assets/brew_method/french_press.png' },
    { name: 'Chemex', image: '/assets/brew_method/chemex.png' },
    { name: 'Aeropress', image: '/assets/brew_method/aeropress.png' },
    { name: 'Moka', image: '/assets/brew_method/moka_pot.png' },
    { name: 'Cold Brew', image: '/assets/brew_method/cold_brew.png' },
  ];

  readonly bodyLevels: InfoLevel[] = [
    {
      value: 1,
      label: 'Suave',
      icon: '💧',
      description: 'Acuoso o muy suave',
      color: '#bfada6',
    },
    {
      value: 2,
      label: 'Liviano',
      icon: '☁️',
      description: 'Suave pero con presencia',
      color: '#a1887f',
    },
    { value: 3, label: 'Medio', icon: '🪶', description: 'Textura balanceada', color: '#8d6e63' },
    { value: 4, label: 'Pleno', icon: '🍫', description: 'Cremoso y redondo', color: '#6d4c41' },
    { value: 5, label: 'Denso', icon: '🧈', description: 'Pesado, aceitoso', color: '#4e342e' },
  ];

  readonly acidityLevels: InfoLevel[] = [
    { value: 1, label: 'Nula', icon: '⚪', description: 'Plana, sin chispa', color: '#d4c9c4' },
    { value: 2, label: 'Baja', icon: '🍊', description: 'Suave, equilibrada', color: '#ffcc80' },
    {
      value: 3,
      label: 'Media',
      icon: '🍋',
      description: 'Brillante pero armónica',
      color: '#ffb84d',
    },
    { value: 4, label: 'Alta', icon: '🍏', description: 'Viva y punzante', color: '#ffad33' },
    {
      value: 5,
      label: 'Intensa',
      icon: '🌈',
      description: 'Dominante, vibrante',
      color: '#ffa726',
    },
  ];

  readonly afterTasteLevels: InfoLevel[] = [
    { value: 1, label: 'Corto', icon: '🌬️', description: 'Desaparece rápido', color: '#e1bee7' },
    { value: 2, label: 'Suave', icon: '☁️', description: 'Persistencia leve', color: '#ce93d8' },
    {
      value: 3,
      label: 'Medio',
      icon: '🌤️',
      description: 'Buen final, sin amargor',
      color: '#ba68c8',
    },
    { value: 4, label: 'Largo', icon: '🌇', description: 'Permanece agradable', color: '#ab47bc' },
    {
      value: 5,
      label: 'Complejo',
      icon: '🌌',
      description: 'Evoluciona con el tiempo',
      color: '#8e24aa',
    },
  ];

  // Computed signal for full coffee data
  fullCoffeeData = computed<FullCoffeeData>(() => ({
    ...this.coffeeIdentity(),
    ...this.coffeeRoast(),
    ...this.coffeeSensory(),
    ...this.coffeeFlavor(),
    ...this.coffeeScore(),
  }));

  // Validation computed signals
  isIdentitySlideValid = computed(() => {
    const identity = this.coffeeIdentity();
    return (
      identity.brand.trim() !== '' &&
      identity.coffeeName.trim() !== '' &&
      identity.beanType !== '' &&
      identity.origin.trim() !== ''
    );
  });

  isRoastSlideValid = computed(() => {
    const roast = this.coffeeRoast();
    return roast.roastLevel !== '' && roast.brewMethod !== '';
  });

  isSensorySlideValid = computed(() => {
    const sensory = this.coffeeSensory();
    const bodyValid = typeof sensory.body === 'number' && sensory.body >= 1 && sensory.body <= 5;
    return sensory.aroma.trim() !== '' && bodyValid && sensory.flavor.trim() !== '';
  });

  isFlavorSlideValid = computed(() => {
    const flavor = this.coffeeFlavor();
    const acidityValid =
      typeof flavor.acidity === 'number' && flavor.acidity >= 1 && flavor.acidity <= 5;
    const aftertasteValid =
      typeof flavor.aftertaste === 'number' && flavor.aftertaste >= 1 && flavor.aftertaste <= 5;
    return acidityValid && aftertasteValid && flavor.aftertasteDescription.trim() !== '';
  });

  isScoreSlideValid = computed(() => {
    const score = this.coffeeScore();
    return score.opinion.trim() !== '' && score.score > 0 && score.score <= 10;
  });

  isSlideInvalid = computed(() => {
    return (slideId: number): boolean => {
      switch (slideId) {
        case 0:
          return !this.isIdentitySlideValid();
        case 1:
          return !this.isRoastSlideValid();
        case 2:
          return !this.isSensorySlideValid();
        case 3:
          return !this.isFlavorSlideValid();
        case 4:
          return !this.isScoreSlideValid();
        default:
          return true;
      }
    };
  });

  isFormValid = computed(() => {
    return (
      this.isIdentitySlideValid() &&
      this.isRoastSlideValid() &&
      this.isSensorySlideValid() &&
      this.isFlavorSlideValid() &&
      this.isScoreSlideValid()
    );
  });

  // Update methods
  updateIdentity(changes: Partial<CoffeeIdentity>) {
    this.coffeeIdentity.update((current) => ({
      ...current,
      ...changes,
    }));
  }

  updateRoastLevel(level: string) {
    this.coffeeRoast.update((current) => ({
      ...current,
      roastLevel: level,
    }));
  }

  updateBrewMethod(method: string) {
    this.coffeeRoast.update((current) => ({
      ...current,
      brewMethod: method,
    }));
  }

  updateSensory(changes: Partial<CoffeeSensory>) {
    this.coffeeSensory.update((current) => ({
      ...current,
      ...changes,
    }));
  }

  updateFlavor(changes: Partial<CoffeeFlavor>) {
    this.coffeeFlavor.update((current) => ({
      ...current,
      ...changes,
    }));
  }

  updateScore(changes: Partial<CoffeeScore>) {
    this.coffeeScore.update((current) => ({ ...current, ...changes }));
  }

  updateImage(imageData: CoffeeImage) {
    this.selectedImage.set(imageData);
  }

  // Data transformation methods
  getBodyDescription(bodyValue: number): string {
    const bodyLevel = this.bodyLevels.find((level) => level.value === bodyValue);
    return bodyLevel ? `${bodyLevel.label} - ${bodyLevel.description}` : String(bodyValue);
  }

  getAcidityDescription(acidityValue: number): string {
    const acidityLevel = this.acidityLevels.find((level) => level.value === acidityValue);
    return acidityLevel
      ? `${acidityLevel.label} - ${acidityLevel.description}`
      : String(acidityValue);
  }

  getAftertasteDescription(aftertasteValue: number, description: string): string {
    const aftertasteLevel = this.afterTasteLevels.find((level) => level.value === aftertasteValue);
    return aftertasteLevel
      ? `${aftertasteLevel.label} - ${aftertasteLevel.description}. ${description}`
      : description;
  }

  // Reset form
  resetForm() {
    this.coffeeIdentity.set({
      brand: '',
      coffeeName: '',
      beanType: '',
      origin: '',
    });

    this.coffeeRoast.set({
      roastLevel: '',
      brewMethod: '',
    });

    this.coffeeSensory.set({
      aroma: '',
      body: 0,
      flavor: '',
    });

    this.coffeeFlavor.set({
      acidity: 0,
      aftertaste: 0,
      aftertasteDescription: '',
    });

    this.coffeeScore.set({
      opinion: '',
      score: 0,
    });

    this.selectedImage.set({
      file: null,
      preview: null,
    });
  }

  // Load form data (for restoring from pending tasting)
  loadFormData(data: {
    coffeeIdentity?: CoffeeIdentity;
    coffeeRoast?: CoffeeRoast;
    coffeeSensory?: CoffeeSensory;
    coffeeFlavor?: CoffeeFlavor;
    coffeeScore?: CoffeeScore;
    imageFile?: File | null;
  }) {
    if (data.coffeeIdentity) {
      this.coffeeIdentity.set(data.coffeeIdentity);
    }
    if (data.coffeeRoast) {
      this.coffeeRoast.set(data.coffeeRoast);
    }
    if (data.coffeeSensory) {
      this.coffeeSensory.set(data.coffeeSensory);
    }
    if (data.coffeeFlavor) {
      this.coffeeFlavor.set(data.coffeeFlavor);
    }
    if (data.coffeeScore) {
      this.coffeeScore.set(data.coffeeScore);
    }
    if (data.imageFile) {
      const previewUrl = URL.createObjectURL(data.imageFile);
      this.selectedImage.set({
        file: data.imageFile,
        preview: previewUrl,
      });
    }
  }

  // Get form data for saving
  getFormDataForSaving() {
    return {
      coffeeIdentity: this.coffeeIdentity(),
      coffeeRoast: this.coffeeRoast(),
      coffeeSensory: this.coffeeSensory(),
      coffeeFlavor: this.coffeeFlavor(),
      coffeeScore: this.coffeeScore(),
      imageFile: this.selectedImage().file,
    };
  }
}
