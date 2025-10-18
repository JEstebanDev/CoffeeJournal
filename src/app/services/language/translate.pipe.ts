import { Pipe, PipeTransform, inject } from '@angular/core';
import { TranslationService } from './translation.service';

@Pipe({
  name: 'translate',
  standalone: true,
  pure: false // No es puro porque depende del estado del servicio de traducción
})
export class TranslatePipe implements PipeTransform {
  private translationService = inject(TranslationService);

  transform(key: string, params?: { [key: string]: string | number }): string {
    return this.translationService.translate(key, params);
  }
}
