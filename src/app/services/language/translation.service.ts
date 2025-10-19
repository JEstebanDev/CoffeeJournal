import { Injectable, signal, computed, effect } from '@angular/core';
import { LanguageService, SupportedLanguage } from './language.service';

export interface TranslationData {
  [key: string]: string;
}

@Injectable({
  providedIn: 'root',
})
export class TranslationService {
  private translations = signal<TranslationData>({});
  private isLoading = signal<boolean>(false);

  constructor(private languageService: LanguageService) {
    this.loadTranslations();
    
    // Escuchar cambios de idioma usando effect
    effect(() => {
      // Leer el idioma actual para activar el effect
      const currentLanguage = this.languageService.language();
      this.loadTranslations();
    });
  }

  /**
   * Carga las traducciones para el idioma actual
   */
  private async loadTranslations(): Promise<void> {
    this.isLoading.set(true);
    
    try {
      const currentLanguage = this.languageService.language();
      const translations = await this.fetchTranslations(currentLanguage);
      this.translations.set(translations);
    } catch (error) {
      console.error('Error cargando traducciones:', error);
      // Fallback a traducciones básicas
      const fallbackTranslations = this.getFallbackTranslations();
      this.translations.set(fallbackTranslations);
    } finally {
      this.isLoading.set(false);
    }
  }

  /**
   * Obtiene las traducciones desde los archivos XLF
   */
  private async fetchTranslations(language: SupportedLanguage): Promise<TranslationData> {
    const fileName = language === 'es' ? 'messages.es.xlf' : 'messages.en.xlf';
    
    try {
      const response = await fetch(`/assets/locale/${fileName}`);
      if (!response.ok) {
        throw new Error(`Error cargando archivo de traducción: ${fileName}`);
      }
      
      const xmlText = await response.text();
      return this.parseXlfFile(xmlText);
    } catch (error) {
      console.error(`Error cargando traducciones para ${language}:`, error);
      return this.getFallbackTranslations();
    }
  }

  /**
   * Parsea un archivo XLF y extrae las traducciones
   */
  private parseXlfFile(xmlText: string): TranslationData {
    const translations: TranslationData = {};
    
    try {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
      
      // Verificar si hay errores de parsing
      const parserError = xmlDoc.querySelector('parsererror');
      if (parserError) {
        console.error('XML parsing error:', parserError.textContent);
        return translations;
      }
      
      const transUnits = xmlDoc.querySelectorAll('trans-unit');
      
      transUnits.forEach((unit) => {
        const id = unit.getAttribute('id');
        const targetElement = unit.querySelector('target');
        
        if (id && targetElement) {
          translations[id] = targetElement.textContent || '';
        } else if (id) {
          console.warn(`Translation unit ${id} has no target element`);
        }
      });
    } catch (error) {
      console.error('Error parseando archivo XLF:', error);
    }
    
    return translations;
  }

  /**
   * Traducciones de fallback en caso de error
   */
  private getFallbackTranslations(): TranslationData {
    const currentLanguage = this.languageService.language();
    
    if (currentLanguage === 'en') {
      return {
        appName: 'Coffee Journal',
        loginButton: 'Login',
        heroTitle: 'Your Personal ',
        heroTitleHighlight: 'Coffee Tasting Journal',
        heroDescription:
          'Record, evaluate, and discover the unique flavors of each cup. Keep detailed track of your coffee experiences and refine your palate with every tasting.',
        startTastingButton: 'Start Tasting',
        logoutButton: 'Logout',
        welcomeMessage: 'Welcome back, ',
        dashboardSubtitle: "Here's a summary of your coffee journey",
        newTastingButton: 'New Tasting',
        loadingMessage: 'Loading your data...',
        totalTastingsLabel: 'Total Tastings',
        averageRatingLabel: 'Average Rating',
        favoriteOriginLabel: 'Favorite Origin',
        recentTastingsTitle: 'Recent Tastings',
        viewAllButton: 'View All',
        aromaLabel: 'Aroma',
        bodyLabel: 'Body',
        acidityLabel: 'Acidity',
        flavorLabel: 'Flavor',
        noTastingsTitle: 'No tastings recorded',
        noTastingsMessage: 'Start your coffee journey by recording your first tasting',
        startFirstTasting: 'Record First Tasting',
        coffeeIdentityTitle: 'Coffee Identity',
        coffeeIdentitySubtitle: "Basic information about the coffee you're going to taste",
        brandLabel: 'Brand',
        brandPlaceholder: 'E.g: Starbucks, Juan Valdez, Illy...',
        brandError: 'Brand is required',
        coffeeNameLabel: 'Coffee Name',
        coffeeNamePlaceholder: 'E.g: Colombia Supremo, Ethiopian Yirgacheffe...',
        coffeeNameError: 'Coffee name is required',
        beanTypeLabel: 'Bean Type',
        beanTypeError: 'Select a bean type',
        originLabel: 'Origin',
        originPlaceholder: 'E.g: Colombia, Ethiopia, Brazil...',
        originError: 'Origin is required',
        roastTitle: 'Roast and Preparation',
        roastSubtitle: 'Roast characteristics and brewing method',
        roastLevelLabel: 'Roast Level',
        roastLevelError: 'Select a roast level',
        brewMethodLabel: 'Brewing Method',
        brewMethodError: 'Select a brewing method',
        sensoryTitle: 'Sensory Notes',
        sensorySubtitle: 'Describe the sensory characteristics of the coffee',
        aromaDescription: 'What aromas do you perceive?',
        aromaPlaceholder: 'E.g: Floral, fruity, chocolate, nuts, caramel...',
        aromaError: "Describe the coffee's aroma",
        flavorDescription: 'What flavors do you identify?',
        flavorPlaceholder: 'E.g: Citrus, chocolate, nuts, spices...',
        flavorError: "Describe the coffee's flavor",
        bodyDescription: 'How does it feel in your mouth?',
        bodyError: 'Select the body level',
        flavorExperienceTitle: 'Flavor Experience',
        flavorExperienceSubtitle: 'Evaluate acidity and aftertaste',
        acidityDescription: 'How acidic is the coffee?',
        acidityError: 'Select the acidity level',
        aftertasteLabel: 'Aftertaste',
        aftertasteDescription: 'How long does the flavor last after swallowing?',
        aftertasteError: 'Select the aftertaste duration',
        aftertasteDescPlaceholder: 'Describe how the flavor evolves...',
        scoreTitle: 'Rating',
        scoreSubtitle: 'Evaluate your overall experience',
        generalImpressionLabel: 'General Impression',
        generalImpressionDescription: 'Describe your overall experience with this coffee',
        scoreLabel: 'Score',
        scoreError: 'Score is required (0-10)',
        beanTypeArabica: 'Arabica',
        beanTypeRobusta: 'Robusta',
        beanTypeLiberica: 'Liberica',
        roastLevelLight: 'Light',
        roastLevelMedium: 'Medium',
        roastLevelDark: 'Dark',
        brewMethodV60: 'V60',
        brewMethodEspresso: 'Espresso',
        brewMethodFrenchPress: 'French Press',
        brewMethodChemex: 'Chemex',
        brewMethodAeropress: 'Aeropress',
        brewMethodMoka: 'Moka',
        brewMethodColdBrew: 'Cold Brew',
        bodyLevelSoft: 'Soft',
        bodyLevelLight: 'Light',
        bodyLevelMedium: 'Medium',
        bodyLevelFull: 'Full',
        bodyLevelDense: 'Dense',
        acidityLevelNone: 'None',
        acidityLevelLow: 'Low',
        acidityLevelMedium: 'Medium',
        acidityLevelHigh: 'High',
        acidityLevelIntense: 'Intense',
        aftertasteLevelShort: 'Short',
        aftertasteLevelSoft: 'Soft',
        aftertasteLevelMedium: 'Medium',
        aftertasteLevelLong: 'Long',
        aftertasteLevelComplex: 'Complex',
        slideIdentityTitle: 'Coffee Identity',
        slideRoastTitle: 'Roast and Preparation',
        slideSensoryTitle: 'Sensory Notes',
        slideFlavorTitle: 'Flavor',
        slideScoreTitle: 'Rating',
        validationErrorMessage: '⚠️ Please complete all required fields in:',
        lastSlideError: "You're already on the last slide",
        sessionExpiredError: 'Session expired. Please log in again.',
        dataSavedMessage: 'Data saved. Redirecting to login...',
        invalidImageError: 'Please select a valid image file',
        confirmationTitle: 'Confirm action',
        confirmationMessage: 'Are you sure you want to continue?',
        tastingInProgressMessage: 'You have a tasting in progress. What would you like to do?',
        insufficientDataMessage: 'Not enough data yet to determine your trend',
        exploreMoreMessage: 'Explore more coffees to discover your preference profile',
        spanishLanguage: 'Spanish',
        coffeeBrandAriaLabel: 'Coffee brand',
        coffeeNameAriaLabel: 'Coffee name',
        coffeeOriginAriaLabel: 'Coffee origin',
        brewMethodsAriaLabel: 'Brewing methods',
         clearSearchAriaLabel: 'Clear search',
         sortByRecentAriaLabel: 'Most recent first',
         logoutAriaLabel: 'Logout',
         footerDevelopedBy: 'Developed with Angular by',
         // Body Level Descriptions
         bodyLevelSoftDescription: 'Watery or very soft',
         bodyLevelLightDescription: 'Soft but with presence',
         bodyLevelMediumDescription: 'Balanced texture',
         bodyLevelFullDescription: 'Creamy and round',
         bodyLevelDenseDescription: 'Heavy, oily',
         // Acidity Level Descriptions
         acidityLevelNoneDescription: 'Flat, no sparkle',
         acidityLevelLowDescription: 'Soft, balanced',
         acidityLevelMediumDescription: 'Bright but harmonious',
         acidityLevelHighDescription: 'Lively and sharp',
         acidityLevelIntenseDescription: 'Dominant, vibrant',
         // Aftertaste Level Descriptions
         aftertasteLevelShortDescription: 'Disappears quickly',
         aftertasteLevelSoftDescription: 'Mild persistence',
         aftertasteLevelMediumDescription: 'Good finish, no bitterness',
         aftertasteLevelLongDescription: 'Remains pleasant',
         aftertasteLevelComplexDescription: 'Evolves over time',
        // Score Slide
        coffeeImageTitle: 'Coffee Image',
        uploadImageText: 'Click to upload an image',
        uploadImageHint: 'JPG, PNG or WEBP (max. 5MB)',
        removeImageButton: '✕ Remove',
        saveTastingButton: '💾 Save Tasting',
        // Auth Page
        backButton: 'Back',
        loginTitle: 'Sign In',
        signupTitle: 'Sign Up',
        loginSubtitle: 'Access your coffee journal',
        signupSubtitle: 'Start your coffee journey',
        usernameLabel: 'Username',
        usernamePlaceholder: 'Enter your username',
        emailLabel: 'Email',
        emailPlaceholder: 'your@email.com',
        passwordLabel: 'Password',
        passwordPlaceholder: 'Minimum 6 characters',
        confirmPasswordLabel: 'Confirm Password',
        confirmPasswordPlaceholder: 'Repeat your password',
        signInButton: 'Sign In',
        signUpButton: 'Sign Up',
        magicLinkButton: 'Send Magic Link',
        noAccountText: "Don't have an account?",
        hasAccountText: 'Already have an account?',
        // Confirmation Dialog
        cancelButton: 'Cancel',
        confirmButton: 'Confirm',
        deleteTastingTitle: 'Delete tasting in progress?',
      };
    } else {
      return {
        appName: 'Coffee Journal',
        loginButton: 'Iniciar Sesión',
        heroTitle: 'Tu Bitácora Personal de ',
        heroTitleHighlight: 'Cata de Café',
        heroDescription:
          'Registra, evalúa y descubre los sabores únicos de cada taza. Lleva un seguimiento detallado de tus experiencias cafeteras y perfecciona tu paladar con cada degustación.',
        startTastingButton: 'Comenzar a Catar',
        logoutButton: 'Cerrar Sesión',
        welcomeMessage: '¡Bienvenido de nuevo, ',
        dashboardSubtitle: 'Aquí está el resumen de tu viaje cafetero',
        newTastingButton: 'Nueva Cata',
        loadingMessage: 'Cargando tus datos...',
        totalTastingsLabel: 'Catas Totales',
        averageRatingLabel: 'Calificación Promedio',
        favoriteOriginLabel: 'Origen Favorito',
        recentTastingsTitle: 'Catas Recientes',
        viewAllButton: 'Ver Todas',
        aromaLabel: 'Aroma',
        bodyLabel: 'Cuerpo',
        acidityLabel: 'Acidez',
        flavorLabel: 'Sabor',
        noTastingsTitle: 'No hay catas registradas',
        noTastingsMessage: 'Comienza tu viaje cafetero registrando tu primera cata',
        startFirstTasting: 'Registrar Primera Cata',
        coffeeIdentityTitle: 'Identidad del Café',
        coffeeIdentitySubtitle: 'Información básica del café que vas a catar',
        brandLabel: 'Marca',
        brandPlaceholder: 'Ej: Starbucks, Juan Valdez, Illy...',
        brandError: 'La marca es requerida',
        coffeeNameLabel: 'Nombre del Café',
        coffeeNamePlaceholder: 'Ej: Colombia Supremo, Ethiopian Yirgacheffe...',
        coffeeNameError: 'El nombre del café es requerido',
        beanTypeLabel: 'Tipo de Grano',
        beanTypeError: 'Selecciona un tipo de grano',
        originLabel: 'Origen',
        originPlaceholder: 'Ej: Colombia, Etiopía, Brasil...',
        originError: 'El origen es requerido',
        roastTitle: 'Tueste y Preparación',
        roastSubtitle: 'Características del tueste y método de preparación',
        roastLevelLabel: 'Nivel de Tueste',
        roastLevelError: 'Selecciona un nivel de tueste',
        brewMethodLabel: 'Método de Preparación',
        brewMethodError: 'Selecciona un método de preparación',
        sensoryTitle: 'Notas Sensoriales',
        sensorySubtitle: 'Describe las características sensoriales del café',
        aromaDescription: '¿Qué aromas percibes?',
        aromaPlaceholder: 'Ej: Floral, frutal, chocolate, nueces, caramelo...',
        aromaError: 'Describe el aroma del café',
        flavorDescription: '¿Qué sabores identificas?',
        flavorPlaceholder: 'Ej: Cítrico, chocolate, frutos secos, especias...',
        flavorError: 'Describe el sabor del café',
        bodyDescription: '¿Cómo se siente en la boca?',
        bodyError: 'Selecciona el nivel de cuerpo',
        flavorExperienceTitle: 'Experiencia de Sabor',
        flavorExperienceSubtitle: 'Evalúa la acidez y el retrogusto',
        acidityDescription: '¿Qué tan ácido es el café?',
        acidityError: 'Selecciona el nivel de acidez',
        aftertasteLabel: 'Retrogusto',
        aftertasteDescription: '¿Cuánto dura el sabor después de tragar?',
        aftertasteError: 'Selecciona la duración del retrogusto',
        aftertasteDescPlaceholder: 'Describe cómo evoluciona el sabor...',
        scoreTitle: 'Calificación',
        scoreSubtitle: 'Evalúa tu experiencia general',
        generalImpressionLabel: 'Impresión General',
        generalImpressionDescription: 'Describe tu experiencia general con este café',
        scoreLabel: 'Puntuación',
        scoreError: 'La puntuación es requerida (0-10)',
        beanTypeArabica: 'Arabica',
        beanTypeRobusta: 'Robusta',
        beanTypeLiberica: 'Liberica',
        roastLevelLight: 'Claro',
        roastLevelMedium: 'Medio',
        roastLevelDark: 'Oscuro',
        brewMethodV60: 'V60',
        brewMethodEspresso: 'Espresso',
        brewMethodFrenchPress: 'Prensa Francesa',
        brewMethodChemex: 'Chemex',
        brewMethodAeropress: 'Aeropress',
        brewMethodMoka: 'Moka',
        brewMethodColdBrew: 'Cold Brew',
        bodyLevelSoft: 'Suave',
        bodyLevelLight: 'Liviano',
        bodyLevelMedium: 'Medio',
        bodyLevelFull: 'Pleno',
        bodyLevelDense: 'Denso',
        acidityLevelNone: 'Nula',
        acidityLevelLow: 'Baja',
        acidityLevelMedium: 'Media',
        acidityLevelHigh: 'Alta',
        acidityLevelIntense: 'Intensa',
        aftertasteLevelShort: 'Corto',
        aftertasteLevelSoft: 'Suave',
        aftertasteLevelMedium: 'Medio',
        aftertasteLevelLong: 'Largo',
        aftertasteLevelComplex: 'Complejo',
        slideIdentityTitle: 'Identidad del Café',
        slideRoastTitle: 'Tueste y Preparación',
        slideSensoryTitle: 'Notas Sensoriales',
        slideFlavorTitle: 'Sabor',
        slideScoreTitle: 'Calificación',
        validationErrorMessage: '⚠️ Por favor completa todos los campos requeridos en:',
        lastSlideError: 'Ya estás en la última diapositiva',
        sessionExpiredError: 'Sesión expirada. Por favor inicia sesión nuevamente.',
        dataSavedMessage: 'Datos guardados. Redirigiendo al inicio de sesión...',
        invalidImageError: 'Por favor selecciona un archivo de imagen válido',
        confirmationTitle: 'Confirmar acción',
        confirmationMessage: '¿Estás seguro de que quieres continuar?',
        tastingInProgressMessage: 'Tienes una cata en progreso. ¿Qué quieres hacer?',
        insufficientDataMessage: 'Aún no hay suficientes datos para determinar tu tendencia',
        exploreMoreMessage: 'Explora más cafés para descubrir tu perfil de preferencias',
        spanishLanguage: 'Español',
        coffeeBrandAriaLabel: 'Marca del café',
        coffeeNameAriaLabel: 'Nombre del café',
        coffeeOriginAriaLabel: 'Origen del café',
        brewMethodsAriaLabel: 'Métodos de preparación',
         clearSearchAriaLabel: 'Limpiar búsqueda',
         sortByRecentAriaLabel: 'Más recientes primero',
         logoutAriaLabel: 'Cerrar Sesión',
         footerDevelopedBy: 'Desarrollado con Angular por',
         // Body Level Descriptions
         bodyLevelSoftDescription: 'Acuoso o muy suave',
         bodyLevelLightDescription: 'Suave pero con presencia',
         bodyLevelMediumDescription: 'Textura balanceada',
         bodyLevelFullDescription: 'Cremoso y redondo',
         bodyLevelDenseDescription: 'Pesado, aceitoso',
         // Acidity Level Descriptions
         acidityLevelNoneDescription: 'Plana, sin chispa',
         acidityLevelLowDescription: 'Suave, equilibrada',
         acidityLevelMediumDescription: 'Brillante pero armónica',
         acidityLevelHighDescription: 'Viva y punzante',
         acidityLevelIntenseDescription: 'Dominante, vibrante',
         // Aftertaste Level Descriptions
         aftertasteLevelShortDescription: 'Desaparece rápido',
         aftertasteLevelSoftDescription: 'Persistencia leve',
         aftertasteLevelMediumDescription: 'Buen final, sin amargor',
         aftertasteLevelLongDescription: 'Permanece agradable',
         aftertasteLevelComplexDescription: 'Evoluciona con el tiempo',
        // Score Slide
        coffeeImageTitle: 'Imagen del Café',
        uploadImageText: 'Haz clic para subir una imagen',
        uploadImageHint: 'JPG, PNG o WEBP (máx. 5MB)',
        removeImageButton: '✕ Eliminar',
        saveTastingButton: '💾 Guardar Cata',
        // Auth Page
        backButton: 'Volver',
        loginTitle: 'Iniciar Sesión',
        signupTitle: 'Crear Cuenta',
        loginSubtitle: 'Accede a tu bitácora cafetera',
        signupSubtitle: 'Comienza tu viaje cafetero',
        usernameLabel: 'Nombre de Usuario',
        usernamePlaceholder: 'Ingresa tu nombre de usuario',
        emailLabel: 'Correo Electrónico',
        emailPlaceholder: 'tu@email.com',
        passwordLabel: 'Contraseña',
        passwordPlaceholder: 'Mínimo 6 caracteres',
        confirmPasswordLabel: 'Confirmar Contraseña',
        confirmPasswordPlaceholder: 'Repite tu contraseña',
        signInButton: 'Iniciar Sesión',
        signUpButton: 'Crear Cuenta',
        magicLinkButton: 'Enviar Enlace Mágico',
        noAccountText: '¿No tienes cuenta?',
        hasAccountText: '¿Ya tienes cuenta?',
        // Confirmation Dialog
        cancelButton: 'Cancelar',
        confirmButton: 'Confirmar',
        deleteTastingTitle: '¿Eliminar cata en progreso?',
      };
    }
  }

  /**
   * Obtiene una traducción por su clave
   */
  public translate(key: string, params?: { [key: string]: string | number }): string {
    const translations = this.translations();
    let translation = translations[key] || key;
    
    // Debug: Log cuando no se encuentra una traducción
    if (!translations[key]) {
      console.warn(`Translation key not found: ${key}. Available keys:`, Object.keys(translations));
    }
    
    // Reemplazar parámetros si se proporcionan
    if (params) {
      Object.keys(params).forEach((paramKey) => {
        const placeholder = `{{${paramKey}}}`;
        translation = translation.replace(new RegExp(placeholder, 'g'), String(params[paramKey]));
      });
    }
    
    return translation;
  }

  /**
   * Verifica si una clave de traducción existe
   */
  public hasTranslation(key: string): boolean {
    return key in this.translations();
  }

  /**
   * Obtiene todas las traducciones actuales
   */
  public getAllTranslations(): TranslationData {
    return { ...this.translations() };
  }

  /**
   * Computed para verificar si las traducciones están cargando
   */
  public readonly loading = computed(() => this.isLoading());
}
