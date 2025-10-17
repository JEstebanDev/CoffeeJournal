import { Injectable } from '@angular/core';
import { CoffeeTasting } from '../coffee.service';
import { CardTastingInfo, RoastLevel, BrewMethod, InfoLevel } from './slide.interface';
import {
  roastLevels,
  brewMethodsOptions,
  bodyLevels,
  acidityLevels,
  afterTasteLevels,
} from './texts-forms';

@Injectable({
  providedIn: 'root',
})
export class CoffeeCardInfoService {
  private tastingIdMap = new Map<string, string>();

  mapCoffeeTastingToCardInfo(tasting: CoffeeTasting): CardTastingInfo {
    const cardInfo: CardTastingInfo = {
      brand: tasting.brand || '',
      coffeeName: tasting.coffee_name || '',
      beanType: tasting.bean_type || '',
      origin: tasting.origin || '',
      roastLevel: this.getRoastLevelInfo(tasting.roast_level),
      brewMethod: this.getBrewMethodInfo(tasting.brew_method),
      aroma: tasting.aroma || '',
      flavor: tasting.flavor || '',
      body: this.getBodyInfo(parseInt(tasting.body) || 0),
      acidity: this.getAcidityInfo(parseInt(tasting.acidity) || 0),
      aftertaste: this.getAftertasteInfo(parseInt(tasting.aftertaste) || 0),
      impression: tasting.impression || '',
      score: tasting.score || 0,
      createdAt: tasting.created_at ? new Date(tasting.created_at) : new Date(),
      image: tasting.image || '',
    };

    if (tasting.id) {
      const cardKey = `${cardInfo.coffeeName}-${cardInfo.brand}-${cardInfo.createdAt.getTime()}`;
      this.tastingIdMap.set(cardKey, tasting.id);
    }

    return cardInfo;
  }

  private getRoastLevelInfo(roastLevel: string): RoastLevel {
    const foundRoast = roastLevels.find((roast) => roast.value === roastLevel);
    return foundRoast || { value: roastLevel, label: roastLevel, color: '#8B4513' };
  }

  private getBrewMethodInfo(brewMethod: string): BrewMethod {
    const foundMethod = brewMethodsOptions.find((method) => method.name === brewMethod);
    return foundMethod || { name: brewMethod, image: '' };
  }

  private getBodyInfo(bodyValue: number): InfoLevel {
    const foundBody = bodyLevels.find((body) => body.value === bodyValue);
    return (
      foundBody || {
        value: bodyValue,
        label: 'Desconocido',
        icon: '❓',
        description: 'No especificado',
        color: '#E0E0E0',
      }
    );
  }

  private getAcidityInfo(acidityValue: number): InfoLevel {
    const foundAcidity = acidityLevels.find((acidity) => acidity.value === acidityValue);
    return (
      foundAcidity || {
        value: acidityValue,
        label: 'Desconocido',
        icon: '❓',
        description: 'No especificado',
        color: '#E0E0E0',
      }
    );
  }

  private getAftertasteInfo(aftertasteValue: number): InfoLevel {
    const foundAftertaste = afterTasteLevels.find(
      (aftertaste) => aftertaste.value === aftertasteValue
    );
    return (
      foundAftertaste || {
        value: aftertasteValue,
        label: 'Desconocido',
        icon: '❓',
        description: 'No especificado',
        color: '#E0E0E0',
      }
    );
  }

  getTastingId(tasting: CardTastingInfo): string | undefined {
    const cardKey = `${tasting.coffeeName}-${tasting.brand}-${tasting.createdAt.getTime()}`;
    return this.tastingIdMap.get(cardKey);
  }

  clearIdMap(): void {
    this.tastingIdMap.clear();
  }
}
