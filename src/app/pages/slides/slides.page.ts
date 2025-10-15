import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  CoffeeIdentitySlideComponent,
  CoffeeIdentity,
} from '../../components/slide/coffee-identity-slide/coffee-identity-slide.component';
import {
  CoffeeRoastSlideComponent,
  CoffeeRoast,
} from '../../components/slide/coffee-roast-slide/coffee-roast-slide.component';
import {
  CoffeeSensorySlideComponent,
  CoffeeSensory,
  InfoLevel,
} from '../../components/slide/coffee-sensory-slide/coffee-sensory-slide.component';
import {
  CoffeeFlavor,
  CoffeeFlavorSlideComponent,
} from '../../components/slide/coffe-flavor-slide/coffee-flavor-slide.component';
import {
  CoffeeScore,
  CoffeeScoreSlideComponent,
} from '../../components/slide/coffee-score-slide/coffee-score-slide.component';

@Component({
  selector: 'app-slides',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CoffeeIdentitySlideComponent,
    CoffeeRoastSlideComponent,
    CoffeeSensorySlideComponent,
    CoffeeFlavorSlideComponent,
    CoffeeScoreSlideComponent,
  ],
  templateUrl: './slides.page.html',
  styleUrls: ['./slides.page.css'],
})
export class SlidesPage {
  currentSlide = signal(0);

  // Coffee data split into two parts
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
    body: 0,
    aroma: '',
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

  // Options for selectors
  beanTypes = ['Arabica', 'Robusta', 'Liberica'];

  roastLevels = [
    { value: 'light', label: 'Claro ☀️', color: '#D4A574' },
    { value: 'medium', label: 'Medio 🌤️', color: '#8B6F47' },
    { value: 'dark', label: 'Oscuro 🌑', color: '#3E2723' },
  ];

  brewMethodsOptions = [
    { name: 'V60', image: '/assets/brew_method/pourover.png' },
    { name: 'Espresso', image: '/assets/brew_method/espresso.png' },
    { name: 'Prensa Francesa', image: '/assets/brew_method/french_press.png' },
    { name: 'Chemex', image: '/assets/brew_method/chemex.png' },
    { name: 'Aeropress', image: '/assets/brew_method/aeropress.png' },
    { name: 'Moka', image: '/assets/brew_method/moka_pot.png' },
    { name: 'Cold Brew', image: '/assets/brew_method/cold_brew.png' },
  ];

  // Notas sensorial

  bodyLevels: InfoLevel[] = [
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

  acidityLevels: InfoLevel[] = [
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

  // Aftertaste scale configuration
  afterTasteLevels: InfoLevel[] = [
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

  slides = [
    { id: 0, title: 'Identidad del Café' },
    { id: 1, title: 'Tueste y Preparación' },
    { id: 2, title: 'Notas sensorial' },
    { id: 3, title: 'Sabor' },
    { id: 4, title: 'Calificacion' },
  ];

  // Computed full form data
  fullCoffeeData = computed(() => ({
    ...this.coffeeIdentity(),
    ...this.coffeeRoast(),
    ...this.coffeeSensory(),
    ...this.coffeeFlavor(),
    ...this.coffeeScore(),
  }));

  // Validation computed signals
  isIdentitySlideValid = computed(() => {
    const identity = this.coffeeIdentity();
    return !!(
      identity.brand &&
      identity.brand.trim().length > 0 &&
      identity.coffeeName &&
      identity.coffeeName.trim().length > 0 &&
      identity.beanType &&
      identity.origin &&
      identity.origin.trim().length > 0
    );
  });

  isRoastSlideValid = computed(() => {
    const roast = this.coffeeRoast();
    return !!(roast.roastLevel && roast.brewMethod);
  });

  isSensorySlideValid = computed(() => {
    const sensory = this.coffeeSensory();
    return !!(
      sensory.body > 0 &&
      sensory.aroma &&
      sensory.aroma.trim().length > 0 &&
      sensory.flavor &&
      sensory.flavor.trim().length > 0
    );
  });

  isFlavorSlideValid = computed(() => {
    const sensory = this.coffeeFlavor();
    return !!(
      sensory.acidity > 0 &&
      sensory.aftertaste > 0 &&
      sensory.aftertasteDescription &&
      sensory.aftertasteDescription.trim().length > 0
    );
  });

  isScoreSlideValid = computed(() => {
    const score = this.coffeeScore();
    return !!(score.score > 0 && score.opinion && score.opinion.trim().length > 0);
  });

  // Check if a slide has errors (is invalid)
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
          return false;
      }
    };
  });

  // Check if all slides are valid (global form validation)
  isFormValid = computed(() => {
    return (
      this.isIdentitySlideValid() &&
      this.isRoastSlideValid() &&
      this.isSensorySlideValid() &&
      this.isFlavorSlideValid() &&
      this.isScoreSlideValid()
    );
  });

  // Navigation methods with validation
  nextSlide() {
    const current = this.currentSlide();

    // Check if current slide is valid before advancing
    if (this.isSlideInvalid()(current)) {
      // Show error message or highlight invalid fields
      this.showValidationError(current);
      return;
    }

    if (current < this.slides.length - 1) {
      this.currentSlide.update((val) => val + 1);
    }
  }

  prevSlide() {
    if (this.currentSlide() > 0) {
      this.currentSlide.update((val) => val - 1);
    }
  }

  goToSlide(index: number) {
    // Allow going back to any slide
    // But prevent skipping ahead if current slide is invalid
    const current = this.currentSlide();

    if (index > current && this.isSlideInvalid()(current)) {
      this.showValidationError(current);
      return;
    }

    this.currentSlide.set(index);
  }

  // Show validation error for a specific slide
  showValidationError(slideId: number) {
    const slideNames = [
      'Identidad del Café',
      'Tueste y Preparación',
      'Notas Sensoriales',
      'Sabor',
      'Calificación',
    ];

    console.warn(`⚠️ Por favor completa todos los campos requeridos en: ${slideNames[slideId]}`);
    // You could also show a toast notification here
  }

  isSlideCompleted(slideId: number): boolean {
    switch (slideId) {
      case 0:
        return this.isIdentitySlideValid();
      case 1:
        return this.isRoastSlideValid();
      case 2:
        return this.isSensorySlideValid();
      case 3:
        return this.isFlavorSlideValid();
      case 4:
        return this.isScoreSlideValid();
      default:
        return false;
    }
  }

  // Identity slide handlers
  onIdentityChange(changes: Partial<CoffeeIdentity>) {
    this.coffeeIdentity.update((current) => ({
      ...current,
      ...changes,
    }));

    // Auto-navigate to next slide if all fields are filled
    if (this.isIdentitySlideValid() && this.currentSlide() === 0) {
      setTimeout(() => this.nextSlide(), 600);
    }
  }

  // Roast slide handlers
  onRoastLevelChange(level: string) {
    this.coffeeRoast.update((current) => ({
      ...current,
      roastLevel: level,
    }));

    // Auto-navigate if both roast level and brew method are selected
    if (this.isRoastSlideValid() && this.currentSlide() === 1) {
      setTimeout(() => this.nextSlide(), 600);
    }
  }

  onBrewMethodChange(method: string) {
    this.coffeeRoast.update((current) => ({
      ...current,
      brewMethod: method,
    }));

    // Auto-navigate if both roast level and brew method are selected
    if (this.isRoastSlideValid() && this.currentSlide() === 1) {
      setTimeout(() => this.nextSlide(), 600);
    }
  }

  // Sensory slide handlers
  onSensoryChange(changes: Partial<CoffeeSensory>) {
    this.coffeeSensory.update((current) => ({
      ...current,
      ...changes,
    }));

    // Auto-navigate when sensory slide is complete (body, aroma, flavor)
    if (this.isSensorySlideValid() && this.currentSlide() === 2) {
      setTimeout(() => this.nextSlide(), 600);
    }
  }

  // Flavor slide handlers
  onFlavorChange(changes: Partial<CoffeeFlavor>) {
    this.coffeeFlavor.update((current) => ({
      ...current,
      ...changes,
    }));

    // Auto-navigate when sensory slide is complete ( acidity, aftertaste,)
    if (this.isSensorySlideValid() && this.currentSlide() === 3) {
      setTimeout(() => this.nextSlide(), 600);
    }
  }

  // Score change handler
  onScoreChange(changes: Partial<CoffeeScore>) {
    this.coffeeScore.update((current) => ({ ...current, ...changes }));
  }

  onFormSubmit() {
    console.log('Coffee Form Data:', this.fullCoffeeData());
    // Add logic to send the form data
  }

  onSaveCoffeeForm() {
    // Validate entire form before saving
    if (!this.isFormValid()) {
      alert('⚠️ Por favor completa todos los campos requeridos antes de guardar.');

      // Find first invalid slide and navigate to it
      for (let i = 0; i < this.slides.length; i++) {
        if (this.isSlideInvalid()(i)) {
          this.goToSlide(i);
          this.showValidationError(i);
          break;
        }
      }
      return;
    }

    console.log('💾 Guardando cata de café...', this.fullCoffeeData());
    // TODO: Implement save logic (API call, local storage, etc.)
    alert('¡Cata guardada exitosamente! 🎉');
  }
}
