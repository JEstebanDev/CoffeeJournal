import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import { LanguageService } from './app/services/language/language.service';

// Initialize language service
bootstrapApplication(App, appConfig).then((appRef) => {
  // Initialize the language service to set up language detection
  appRef.injector.get(LanguageService);
}).catch((err) => console.error(err));
