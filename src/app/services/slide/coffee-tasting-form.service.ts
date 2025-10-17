import { Injectable, signal, computed } from '@angular/core';
import {
  CoffeeIdentity,
  CoffeeRoast,
  CoffeeSensory,
  CoffeeScore,
  CoffeeImage,
  CoffeeFlavor,
  FullCoffeeData,
} from './slide.interface';
import { acidityLevels, afterTasteLevels, bodyLevels } from './texts-forms';

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
    const bodyLevel = bodyLevels.find((level) => level.value === bodyValue);
    return bodyLevel ? `${bodyLevel.label} - ${bodyLevel.description}` : String(bodyValue);
  }

  getAcidityDescription(acidityValue: number): string {
    const acidityLevel = acidityLevels.find((level) => level.value === acidityValue);
    return acidityLevel
      ? `${acidityLevel.label} - ${acidityLevel.description}`
      : String(acidityValue);
  }

  getAftertasteDescription(aftertasteValue: number, description: string): string {
    const aftertasteLevel = afterTasteLevels.find((level) => level.value === aftertasteValue);
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
