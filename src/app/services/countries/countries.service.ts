import { Injectable } from '@angular/core';

export interface Country {
  flag: string;
  nameEs: string;
  nameEn: string;
}

@Injectable({
  providedIn: 'root',
})
export class CountriesService {
  // Lista completa de países productores de café
  private readonly countries: Country[] = [
    // América Latina
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

    // Norteamérica
    { flag: 'us', nameEs: 'Hawaii', nameEn: 'Hawaii' },
  ];

  /**
   * Obtiene la lista completa de países
   */
  getCountries(): Country[] {
    return [...this.countries];
  }

  /**
   * Busca un país por su nombre (en español o inglés)
   */
  findCountryByName(name: string): Country | undefined {
    const lowerName = name.toLowerCase().trim();
    return this.countries.find(
      (country) =>
        country.nameEs.toLowerCase() === lowerName || country.nameEn.toLowerCase() === lowerName
    );
  }

  /**
   * Obtiene el código de bandera para un país dado su nombre
   */
  getCountryFlag(countryName: string): string {
    const country = this.findCountryByName(countryName);
    return country ? country.flag : 'xx'; // 'xx' es un código genérico para países no encontrados
  }

  /**
   * Obtiene un mapeo de nombres de países a códigos de bandera
   * Útil para componentes que necesitan un Record<string, string>
   */
  getCountryFlagsMap(): Record<string, string> {
    const flagsMap: Record<string, string> = {};
    this.countries.forEach((country) => {
      flagsMap[country.nameEs] = country.flag;
      flagsMap[country.nameEn] = country.flag;
    });
    return flagsMap;
  }

  /**
   * Verifica si un nombre corresponde a un país conocido
   */
  isKnownCountry(name: string): boolean {
    return this.findCountryByName(name) !== undefined;
  }
}
