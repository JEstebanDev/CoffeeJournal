import { Injectable, signal, computed } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Inject } from '@angular/core';

export type SupportedLanguage = 'es' | 'en';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private readonly LANGUAGE_KEY = 'coffee-journal-language';
  private readonly DEFAULT_LANGUAGE: SupportedLanguage = 'es';
  
  // Signal para el idioma actual
  private currentLanguage = signal<SupportedLanguage>(this.getInitialLanguage());
  
  // Computed para obtener el idioma actual
  public readonly language = computed(() => this.currentLanguage());
  
  // Computed para verificar si es español
  public readonly isSpanish = computed(() => this.currentLanguage() === 'es');
  
  // Computed para verificar si es inglés
  public readonly isEnglish = computed(() => this.currentLanguage() === 'en');

  constructor(@Inject(DOCUMENT) private document: Document) {
    this.initializeLanguage();
  }

  /**
   * Obtiene el idioma inicial basado en preferencias del usuario o navegador
   */
  private getInitialLanguage(): SupportedLanguage {
    // 1. Verificar si hay un idioma guardado en localStorage
    const savedLanguage = localStorage.getItem(this.LANGUAGE_KEY) as SupportedLanguage;
    if (savedLanguage && this.isValidLanguage(savedLanguage)) {
      return savedLanguage;
    }

    // 2. Detectar idioma del navegador
    const browserLanguage = this.detectBrowserLanguage();
    if (browserLanguage) {
      return browserLanguage;
    }

    // 3. Usar idioma por defecto
    return this.DEFAULT_LANGUAGE;
  }

  /**
   * Detecta el idioma del navegador
   */
  private detectBrowserLanguage(): SupportedLanguage | null {
    const browserLang = navigator.language || (navigator as any).userLanguage;
    
    if (browserLang) {
      // Extraer el código de idioma principal (ej: 'es' de 'es-ES')
      const primaryLang = browserLang.split('-')[0].toLowerCase();
      
      if (primaryLang === 'es') return 'es';
      if (primaryLang === 'en') return 'en';
    }

    return null;
  }

  /**
   * Valida si el idioma es soportado
   */
  private isValidLanguage(language: string): language is SupportedLanguage {
    return language === 'es' || language === 'en';
  }

  /**
   * Inicializa el idioma en la aplicación
   */
  private initializeLanguage(): void {
    const language = this.currentLanguage();
    this.setDocumentLanguage(language);
    this.saveLanguagePreference(language);
  }

  /**
   * Cambia el idioma de la aplicación
   */
  public setLanguage(language: SupportedLanguage): void {
    if (!this.isValidLanguage(language)) {
      console.warn(`Idioma no soportado: ${language}`);
      return;
    }

    this.currentLanguage.set(language);
    this.setDocumentLanguage(language);
    this.saveLanguagePreference(language);
    
    // Emitir evento personalizado para notificar el cambio
    this.document.dispatchEvent(new CustomEvent('languageChanged', {
      detail: { language }
    }));
  }

  /**
   * Alterna entre español e inglés
   */
  public toggleLanguage(): void {
    const newLanguage = this.currentLanguage() === 'es' ? 'en' : 'es';
    this.setLanguage(newLanguage);
  }

  /**
   * Establece el atributo lang en el documento HTML
   */
  private setDocumentLanguage(language: SupportedLanguage): void {
    this.document.documentElement.lang = language;
  }

  /**
   * Guarda la preferencia de idioma en localStorage
   */
  private saveLanguagePreference(language: SupportedLanguage): void {
    localStorage.setItem(this.LANGUAGE_KEY, language);
  }

  /**
   * Obtiene la lista de idiomas soportados
   */
  public getSupportedLanguages(): Array<{code: SupportedLanguage, name: string, nativeName: string}> {
    return [
      { code: 'es', name: 'Spanish', nativeName: 'Español' },
      { code: 'en', name: 'English', nativeName: 'English' }
    ];
  }

  /**
   * Obtiene el nombre del idioma actual en su idioma nativo
   */
  public getCurrentLanguageName(): string {
    const languages = this.getSupportedLanguages();
    const current = languages.find(lang => lang.code === this.currentLanguage());
    return current?.nativeName || 'Español';
  }
}
