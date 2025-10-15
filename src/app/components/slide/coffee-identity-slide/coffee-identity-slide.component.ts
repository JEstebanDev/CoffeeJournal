import { Component, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SliderTitleComponent } from '../../atoms/slider/slider-title/slider-title.component';
import US from 'country-flag-icons/react/3x2/US';
export interface CoffeeIdentity {
  brand: string;
  coffeeName: string;
  beanType: string;
  origin: string;
}

export interface Country {
  flag: string;
  nameEs: string;
  nameEn: string;
}

@Component({
  selector: 'app-coffee-identity-slide',
  standalone: true,
  imports: [CommonModule, FormsModule, SliderTitleComponent],
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

  // Lista de países productores de café
  countries: Country[] = [
    { flag: 'br', nameEs: 'Brasil', nameEn: 'Brazil' },
    { flag: 'co', nameEs: 'Colombia', nameEn: 'Colombia' },
    { flag: 'hn', nameEs: 'Honduras', nameEn: 'Honduras' },
    { flag: 'pe', nameEs: 'Perú', nameEn: 'Peru' },
    { flag: 'mx', nameEs: 'México', nameEn: 'Mexico' },
    { flag: 'gt', nameEs: 'Guatemala', nameEn: 'Guatemala' },
    { flag: 'ni', nameEs: 'Nicaragua', nameEn: 'Nicaragua' },
    { flag: 'sv', nameEs: 'El Salvador', nameEn: 'El Salvador' },
    { flag: 'cr', nameEs: 'Costa Rica', nameEn: 'Costa Rica' },
    { flag: 'pa', nameEs: 'Panamá', nameEn: 'Panama' },
    { flag: 'do', nameEs: 'República Dominicana', nameEn: 'Dominican Republic' },
    { flag: 'jm', nameEs: 'Jamaica', nameEn: 'Jamaica' },
    { flag: 've', nameEs: 'Venezuela', nameEn: 'Venezuela' },
    { flag: 'ec', nameEs: 'Ecuador', nameEn: 'Ecuador' },
    { flag: 'bo', nameEs: 'Bolivia', nameEn: 'Bolivia' },
    { flag: 'cu', nameEs: 'Cuba', nameEn: 'Cuba' },
    { flag: 'pr', nameEs: 'Puerto Rico', nameEn: 'Puerto Rico' },

    // África
    { flag: 'et', nameEs: 'Etiopía', nameEn: 'Ethiopia' },
    { flag: 'ug', nameEs: 'Uganda', nameEn: 'Uganda' },
    { flag: 'ci', nameEs: 'Costa de Marfil', nameEn: 'Ivory Coast' },
    { flag: 'ke', nameEs: 'Kenia', nameEn: 'Kenya' },
    { flag: 'tz', nameEs: 'Tanzania', nameEn: 'Tanzania' },
    { flag: 'rw', nameEs: 'Ruanda', nameEn: 'Rwanda' },
    { flag: 'bi', nameEs: 'Burundi', nameEn: 'Burundi' },
    { flag: 'cm', nameEs: 'Camerún', nameEn: 'Cameroon' },
    {
      flag: 'cd',
      nameEs: 'República Democrática del Congo',
      nameEn: 'Democratic Republic of the Congo',
    },
    { flag: 'mg', nameEs: 'Madagascar', nameEn: 'Madagascar' },

    // Asia
    { flag: 'vn', nameEs: 'Vietnam', nameEn: 'Vietnam' },
    { flag: 'id', nameEs: 'Indonesia', nameEn: 'Indonesia' },
    { flag: 'in', nameEs: 'India', nameEn: 'India' },
    { flag: 'la', nameEs: 'Laos', nameEn: 'Laos' },
    { flag: 'th', nameEs: 'Tailandia', nameEn: 'Thailand' },
    { flag: 'ph', nameEs: 'Filipinas', nameEn: 'Philippines' },
    { flag: 'cn', nameEs: 'China', nameEn: 'China' },
    { flag: 'mm', nameEs: 'Myanmar', nameEn: 'Myanmar' },
    { flag: 'tl', nameEs: 'Timor Oriental', nameEn: 'East Timor' },
    { flag: 'ye', nameEs: 'Yemen', nameEn: 'Yemen' },

    // Oceanía
    { flag: 'pg', nameEs: 'Papúa Nueva Guinea', nameEn: 'Papua New Guinea' },
    { flag: 'sb', nameEs: 'Islas Salomón', nameEn: 'Solomon Islands' },
  ];

  // Whether to show the flag "pop" animation in the template.
  showFlagAnimation = false;

  updateField(field: keyof CoffeeIdentity, value: string) {
    // Mark field as touched
    this.markFieldAsTouched(field);
    this.dataChange.emit({ [field]: value });
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
    return !!this.coffeeData().brand && this.coffeeData().brand.trim().length > 0;
  }

  isCoffeeNameValid(): boolean {
    return !!this.coffeeData().coffeeName && this.coffeeData().coffeeName.trim().length > 0;
  }

  isBeanTypeValid(): boolean {
    return !!this.coffeeData().beanType;
  }

  isOriginValid(): boolean {
    return !!this.coffeeData().origin && this.coffeeData().origin.trim().length > 0;
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
    // Buscar si el texto contiene un país conocido (coincidencia exacta tras trim)
    const lowerValue = (value || '').toLowerCase().trim();

    const matchedCountry = this.countries.find((country) => {
      const lowerNameEs = country.nameEs.toLowerCase();
      const lowerNameEn = country.nameEn.toLowerCase();
      return lowerValue === lowerNameEs || lowerValue === lowerNameEn;
    });

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
      this.dataChange.emit({ origin: value });
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
