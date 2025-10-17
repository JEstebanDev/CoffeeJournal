import { Injectable } from '@angular/core';
import { CoffeeTasting } from './coffee.service';
import { CardTastingInfo, RoastLevel, BrewMethod, InfoLevel } from '../forms/slide.interface';
import {
  roastLevels,
  brewMethodsOptions,
  bodyLevels,
  acidityLevels,
  afterTasteLevels,
} from '../forms/texts-forms';

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
      body: this.getBodyInfo(tasting.body || ''),
      acidity: this.getAcidityInfo(tasting.acidity || ''),
      aftertaste: this.getAftertasteInfo(tasting.aftertaste || ''),
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

  private getBodyInfo(bodyValue: string): InfoLevel {
    const foundBody = bodyLevels.find((body) => body.label === bodyValue.split(' - ')[0]);
    return (
      foundBody || {
        value: 0,
        label: 'Desconocido',
        icon: '❓',
        description: 'No especificado',
        color: '#E0E0E0',
      }
    );
  }

  private getRoastLevelInfo(roastLevel: string): RoastLevel {
    const foundRoast = roastLevels.find((roast) => roast.value === roastLevel);
    return foundRoast || { value: roastLevel, label: roastLevel, color: '#8B4513' };
  }

  private getBrewMethodInfo(brewMethod: string): BrewMethod {
    const foundMethod = brewMethodsOptions.find((method) => method.name === brewMethod);
    return foundMethod || { name: brewMethod, image: '' };
  }

  private getAcidityInfo(acidityValue: string): InfoLevel {
    const foundAcidity = acidityLevels.find(
      (acidity) => acidity.label === acidityValue.split(' - ')[0]
    );
    return (
      foundAcidity || {
        value: 0,
        label: 'Desconocido',
        icon: '❓',
        description: 'No especificado',
        color: '#E0E0E0',
      }
    );
  }

  private getAftertasteInfo(aftertasteValue: string): InfoLevel {
    const foundAftertaste = afterTasteLevels.find(
      (aftertaste) => aftertaste.label === aftertasteValue.split(' - ')[0]
    );
    return (
      foundAftertaste || {
        value: 0,
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
