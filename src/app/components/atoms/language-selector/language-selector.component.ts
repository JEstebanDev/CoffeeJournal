import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LanguageService, SupportedLanguage } from '../../../services/language/language.service';
import { TranslatePipe } from '../../../services/language/translate.pipe';

@Component({
  selector: 'app-language-selector',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  templateUrl: './language-selector.component.html',
  styleUrls: ['./language-selector.component.css']
})
export class LanguageSelectorComponent {
  private languageService = inject(LanguageService);

  // Computed properties
  public readonly currentLanguage = computed(() => this.languageService.language());
  public readonly supportedLanguages = computed(() => this.languageService.getSupportedLanguages());
  public readonly isSpanish = computed(() => this.languageService.isSpanish());
  public readonly isEnglish = computed(() => this.languageService.isEnglish());

  /**
   * Cambia el idioma de la aplicación
   */
  public changeLanguage(language: SupportedLanguage): void {
    this.languageService.setLanguage(language);
  }

  /**
   * Alterna entre español e inglés
   */
  public toggleLanguage(): void {
    this.languageService.toggleLanguage();
  }

  /**
   * Obtiene la bandera del idioma
   */
  public getLanguageFlag(language: SupportedLanguage): string {
    return language === 'es' ? '🇪🇸' : '🇺🇸';
  }

  /**
   * Obtiene el nombre del idioma en su idioma nativo
   */
  public getLanguageName(language: SupportedLanguage): string {
    const languages = this.supportedLanguages();
    const lang = languages.find(l => l.code === language);
    return lang?.nativeName || language.toUpperCase();
  }
}
