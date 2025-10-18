# Sistema de Internacionalización (i18n)

Este directorio contiene todos los servicios y componentes necesarios para la internacionalización de la aplicación Coffee Journal.

## Archivos

### Servicios

- **`language.service.ts`**: Servicio principal que maneja la detección automática de idioma, cambio de idioma y persistencia de preferencias.
- **`translation.service.ts`**: Servicio que carga y gestiona las traducciones desde archivos XLF.
- **`translate.pipe.ts`**: Pipe personalizado para usar traducciones en templates.

### Componentes

- **`language-selector/`**: Componente selector de idioma que permite al usuario cambiar entre español e inglés.

## Características

### Detección Automática de Idioma

El sistema detecta automáticamente el idioma preferido del usuario basándose en:

1. **Preferencia guardada**: Si el usuario ya seleccionó un idioma anteriormente, se usa esa preferencia.
2. **Idioma del navegador**: Se detecta el idioma configurado en el navegador del usuario.
3. **Idioma por defecto**: Si no se puede detectar, se usa español como idioma por defecto.

### Idiomas Soportados

- **Español (es)**: Idioma por defecto
- **Inglés (en)**: Idioma secundario

### Persistencia

Las preferencias de idioma se guardan en `localStorage` con la clave `coffee-journal-language`.

## Uso

### En Componentes TypeScript

```typescript
import { LanguageService } from '../services/language/language.service';

export class MyComponent {
  private languageService = inject(LanguageService);

  // Cambiar idioma
  changeLanguage(language: 'es' | 'en') {
    this.languageService.setLanguage(language);
  }

  // Alternar entre idiomas
  toggleLanguage() {
    this.languageService.toggleLanguage();
  }

  // Verificar idioma actual
  get isSpanish() {
    return this.languageService.isSpanish();
  }
}
```

### En Templates HTML

```html
<!-- Usar el pipe de traducción -->
<h1>{{ 'welcomeMessage' | translate }}</h1>

<!-- Con parámetros -->
<p>{{ 'welcomeUser' | translate: {name: userName} }}</p>

<!-- Usar el selector de idioma -->
<app-language-selector></app-language-selector>
```

### Agregar Nuevas Traducciones

1. **Agregar al archivo XLF español** (`public/assets/locale/messages.es.xlf`):
```xml
<trans-unit id="newTranslationKey" datatype="html">
  <source>Texto en español</source>
  <target>Texto en español</target>
</trans-unit>
```

2. **Agregar al archivo XLF inglés** (`public/assets/locale/messages.en.xlf`):
```xml
<trans-unit id="newTranslationKey" datatype="html">
  <source>Texto en español</source>
  <target>Text in English</target>
</trans-unit>
```

3. **Usar en el template**:
```html
<p>{{ 'newTranslationKey' | translate }}</p>
```

## Archivos de Traducción

Los archivos de traducción están ubicados en `public/assets/locale/`:

- `messages.es.xlf`: Traducciones en español
- `messages.en.xlf`: Traducciones en inglés

## Selector de Idioma

El componente `LanguageSelectorComponent` se encuentra en la esquina superior derecha de la aplicación y permite:

- Cambiar entre español e inglés
- Ver el idioma actual activo
- Interfaz visual con banderas de países

## Eventos

El sistema emite un evento personalizado `languageChanged` cuando se cambia el idioma:

```typescript
document.addEventListener('languageChanged', (event: CustomEvent) => {
  console.log('Idioma cambiado a:', event.detail.language);
});
```

## Configuración

El sistema se inicializa automáticamente en `main.ts` y no requiere configuración adicional.

## Fallbacks

Si hay un error al cargar las traducciones, el sistema usa traducciones de fallback hardcodeadas para asegurar que la aplicación siempre muestre texto legible.
