import { Component, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SliderTitleComponent } from '../../atoms/slider/slider-title/slider-title.component';
import { CountriesService, Country } from '../../../services/countries';
import { TranslatePipe } from '../../../services/language/translate.pipe';
import US from 'country-flag-icons/react/3x2/US';

export interface CoffeeIdentity {
  brand: string;
  coffeeName: string;
  beanType: string;
  origin: string;
}

@Component({
  selector: 'app-coffee-identity-slide',
  standalone: true,
  imports: [CommonModule, FormsModule, SliderTitleComponent, TranslatePipe],
  templateUrl: './coffee-identity-slide.component.html',
  styleUrls: ['./coffee-identity-slide.component.css'],
})
export class CoffeeIdentitySlideComponent {
  // Inputs
  coffeeData = input.required<CoffeeIdentity>();
  beanTypes = input.required<string[]>();
  countryCode: string | null = null;
  // Outputs
  dataChange = output<Partial<CoffeeIdentity>>();

  // Validation state - track if fields have been touched
  brandTouched = signal(false);
  coffeeNameTouched = signal(false);
  beanTypeTouched = signal(false);
  originTouched = signal(false);

  // Lista de países obtenida del servicio
  countries: Country[] = [];

  constructor(private countriesService: CountriesService) {
    this.countries = this.countriesService.getCountries();
  }

  // Whether to show the flag "pop" animation in the template.
  showFlagAnimation = false;

  updateField(field: keyof CoffeeIdentity, value: string) {
    // Mark field as touched
    this.markFieldAsTouched(field);
    
    // Limitar la longitud según el campo
    let limitedValue = value;
    if (field === 'brand' || field === 'coffeeName' || field === 'origin') {
      limitedValue = value.length > 50 ? value.substring(0, 50) : value;
    }
    
    this.dataChange.emit({ [field]: limitedValue });
  }

  markFieldAsTouched(field: keyof CoffeeIdentity) {
    switch (field) {
      case 'brand':
        this.brandTouched.set(true);
        break;
      case 'coffeeName':
        this.coffeeNameTouched.set(true);
        break;
      case 'beanType':
        this.beanTypeTouched.set(true);
        break;
      case 'origin':
        this.originTouched.set(true);
        break;
    }
  }

  // Validation methods
  isBrandValid(): boolean {
    const brand = this.coffeeData().brand;
    return !!brand && brand.trim().length > 0 && brand.length <= 50;
  }

  isCoffeeNameValid(): boolean {
    const coffeeName = this.coffeeData().coffeeName;
    return !!coffeeName && coffeeName.trim().length > 0 && coffeeName.length <= 50;
  }

  isBeanTypeValid(): boolean {
    return !!this.coffeeData().beanType;
  }

  isOriginValid(): boolean {
    const origin = this.coffeeData().origin;
    return !!origin && origin.trim().length > 0 && origin.length <= 50;
  }

  // Show error methods
  shouldShowBrandError(): boolean {
    return this.brandTouched() && !this.isBrandValid();
  }

  shouldShowCoffeeNameError(): boolean {
    return this.coffeeNameTouched() && !this.isCoffeeNameValid();
  }

  shouldShowBeanTypeError(): boolean {
    return this.beanTypeTouched() && !this.isBeanTypeValid();
  }

  shouldShowOriginError(): boolean {
    return this.originTouched() && !this.isOriginValid();
  }

  /**
   * Called from the origin input (e.g. (input)="onOriginInput($event.target.value)")
   * Detects if the provided value exactly matches a known country name (es/en).
   * If so, it prefixes the value with the country's flag and emits the change with
   * a short animation toggle. Otherwise emits the raw value.
   */
  onOriginInput(value: string) {
    this.originTouched.set(true);
    
    // Limitar la longitud a 50 caracteres
    const limitedValue = value.length > 50 ? value.substring(0, 50) : value;
    
    // Usar el servicio para buscar el país
    const matchedCountry = this.countriesService.findCountryByName(limitedValue);

    if (matchedCountry) {
      // Si encuentra un país, agregar la bandera al inicio (usamos nameEs como display por defecto)
      const newValue = `${matchedCountry.nameEs}`;

      // Activar animación momentánea para que el template pueda reaccionar
      this.showFlagAnimation = true;
      // Apagar la animación después de un corto tiempo (600ms)
      setTimeout(() => {
        this.showFlagAnimation = false;
      }, 600);

      this.dataChange.emit({ origin: newValue });
      this.countryCode = matchedCountry.flag;
    } else {
      // Si no encuentra un país, solo actualizar el valor tal cual
      this.dataChange.emit({ origin: limitedValue });
    }
  }

  /**
   * Devuelve el valor de origin sin la bandera al inicio (si existe).
   * Útil para mostrar un input sin emoji mientras se mantiene la versión
   * "decorada" en el modelo.
   */
  getOriginWithoutFlag(): string {
    const origin = (this.coffeeData().origin || '').toString();
    // Remover emojis de banderas del inicio si existen (par de Regional Indicator Symbols)
    return origin.replace(/^[\u{1F1E6}-\u{1F1FF}]{2}\s*/u, '');
  }
}
