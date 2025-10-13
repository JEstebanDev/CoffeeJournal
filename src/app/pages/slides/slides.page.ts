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
import { CoffeeFlavorSlideComponent } from '../../components/slide/coffe-flavor-slide/coffee-flavor-slide.component';
import { CoffeeScoreSlideComponent } from "../../components/slide/coffee-score-slide/coffee-score-slide.component";

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
    CoffeeScoreSlideComponent
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
    brewMethods: [],
  });

  coffeeSensory = signal<CoffeeSensory>({
    body: 0,
    acidity: 0,
    aftertaste: 0,
    aroma: '',
    flavor: '',
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
  }));

  // Navigation methods
  nextSlide() {
    if (this.currentSlide() < this.slides.length - 1) {
      this.currentSlide.update((val) => val + 1);
    }
  }

  prevSlide() {
    if (this.currentSlide() > 0) {
      this.currentSlide.update((val) => val - 1);
    }
  }

  goToSlide(index: number) {
    this.currentSlide.set(index);
  }

  // Identity slide handlers
  onIdentityChange(changes: Partial<CoffeeIdentity>) {
    this.coffeeIdentity.update((current) => ({
      ...current,
      ...changes,
    }));
  }

  // Roast slide handlers
  onRoastLevelChange(level: string) {
    this.coffeeRoast.update((current) => ({
      ...current,
      roastLevel: level,
    }));
  }

  onBrewMethodToggle(method: string) {
    const currentMethods = this.coffeeRoast().brewMethods;
    const index = currentMethods.indexOf(method);

    if (index > -1) {
      this.coffeeRoast.update((current) => ({
        ...current,
        brewMethods: currentMethods.filter((m) => m !== method),
      }));
    } else {
      this.coffeeRoast.update((current) => ({
        ...current,
        brewMethods: [...currentMethods, method],
      }));
    }
  }

  // Sensory slide handlers
  onSensoryChange(changes: Partial<CoffeeSensory>) {
    this.coffeeSensory.update((current) => ({
      ...current,
      ...changes,
    }));
  }

  onFormSubmit() {
    console.log('Coffee Form Data:', this.fullCoffeeData());
    // Add logic to send the form data
  }
}
