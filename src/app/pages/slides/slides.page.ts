import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  CoffeeIdentitySlideComponent,
  CoffeeIdentity,
} from '../../components/coffee-identity-slide/coffee-identity-slide.component';
import {
  CoffeeRoastSlideComponent,
  CoffeeRoast,
} from '../../components/coffee-roast-slide/coffee-roast-slide.component';

@Component({
  selector: 'app-slides',
  standalone: true,
  imports: [CommonModule, FormsModule, CoffeeIdentitySlideComponent, CoffeeRoastSlideComponent],
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

  slides = [
    { id: 0, title: 'Identidad del Café' },
    { id: 1, title: 'Tueste y Preparación' },
    { id: 2, title: 'Notas sensorial' },
  ];

  // Computed full form data
  fullCoffeeData = computed(() => ({
    ...this.coffeeIdentity(),
    ...this.coffeeRoast(),
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

  onFormSubmit() {
    console.log('Coffee Form Data:', this.fullCoffeeData());
    // Add logic to send the form data
  }
}
