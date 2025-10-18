import { Injectable, signal, inject, computed } from '@angular/core';
import { CoffeeTasting } from '../coffee';
import { TopOrigin, Insight } from '../../components/molecule/stats-grid/stats-grid.component';
import { TranslationService } from '../language/translation.service';
import { LanguageService } from '../language/language.service';

export interface DashboardStatistics {
  totalTastings: number;
  averageRating: number;
  favoriteOrigin: string;
  topOrigins: TopOrigin[];
  favoriteRoast: string;
  favoriteBrewMethod: string;
  tastingTrend: string;
  insights: Insight[];
}

@Injectable({
  providedIn: 'root',
})
export class StatisticsService {
  private translationService = inject(TranslationService);
  private languageService = inject(LanguageService);

  // Método reactivo para obtener traducciones
  private getTranslation(key: string, params?: { [key: string]: string | number }): string {
    // Forzar la reactividad al idioma actual
    const currentLanguage = this.languageService.language();
    const result = this.translationService.translate(key, params);

    // Si la traducción no se encuentra, usar un fallback
    if (result === key) {
      console.warn(
        `[StatisticsService] Translation not found for key: "${key}" in language: ${currentLanguage}`
      );
      // Fallbacks básicos
      const fallbacks: { [key: string]: string } = {
        noDataMessage: currentLanguage === 'es' ? 'Sin datos' : 'No data',
        unknownOrigin: currentLanguage === 'es' ? 'Origen desconocido' : 'Unknown Origin',
        unknownRoast: currentLanguage === 'es' ? 'Tueste desconocido' : 'Unknown Roast',
        unknownMethod: currentLanguage === 'es' ? 'Método desconocido' : 'Unknown Method',
        insufficientDataMessage:
          currentLanguage === 'es'
            ? 'Datos insuficientes para calcular tendencia'
            : 'Insufficient data to calculate trend',
        exploreMoreMessage:
          currentLanguage === 'es'
            ? 'Explora más cafés para descubrir tus preferencias'
            : 'Explore more coffees to discover your preferences',
      };
      return fallbacks[key] || key;
    }
    return result;
  }

  /**
   * Calcula todas las estadísticas del dashboard basadas en las catas
   * Ahora es reactivo a los cambios de idioma
   */
  calculateStatistics(tastings: CoffeeTasting[]): DashboardStatistics {
    // Forzar la reactividad al idioma actual
    const currentLanguage = this.languageService.language();
    const totalTastings = tastings.length;

    if (totalTastings === 0) {
      return {
        totalTastings: 0,
        averageRating: 0,
        favoriteOrigin: this.getTranslation('noDataMessage'),
        topOrigins: [],
        favoriteRoast: '',
        favoriteBrewMethod: '',
        tastingTrend: '',
        insights: [],
      };
    }

    // Calcular promedio de puntuación
    const totalScore = tastings.reduce((sum, tasting) => sum + (tasting.score || 0), 0);
    const averageRating = totalScore / totalTastings;

    // Encontrar origen favorito (el más frecuente)
    const originCount = tastings.reduce((acc, tasting) => {
      const origin = tasting.origin || this.getTranslation('unknownOrigin');
      acc[origin] = (acc[origin] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const favoriteOrigin = Object.entries(originCount).reduce((a, b) => (a[1] > b[1] ? a : b))[0];

    // Top 3 orígenes más catados
    const topOrigins = Object.entries(originCount)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 3);

    // Tueste favorito
    const roastCount = tastings.reduce((acc, tasting) => {
      const roast = tasting.roast_level || this.getTranslation('unknownRoast');
      acc[roast] = (acc[roast] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    const favoriteRoastKey = Object.entries(roastCount).reduce((a, b) => (a[1] > b[1] ? a : b))[0];

    // Traducir nivel de tueste
    const favoriteRoast =
      this.getTranslation(
        `roastLevel${favoriteRoastKey.charAt(0).toUpperCase() + favoriteRoastKey.slice(1)}`
      ) || favoriteRoastKey;

    // Método de preparación favorito
    const brewMethodCount = tastings.reduce((acc, tasting) => {
      const method = tasting.brew_method || this.getTranslation('unknownMethod');
      acc[method] = (acc[method] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    const favoriteBrewMethodKey = Object.entries(brewMethodCount).reduce((a, b) =>
      a[1] > b[1] ? a : b
    )[0];
    const favoriteBrewMethod = this.getTranslation(favoriteBrewMethodKey) || favoriteBrewMethodKey;

    // Calcular tendencia de preferencias
    const tastingTrend = this.calculateTastingTrend(tastings);

    // Generar insights
    const insights = this.generateInsights(tastings);

    return {
      totalTastings,
      averageRating,
      favoriteOrigin,
      topOrigins,
      favoriteRoast,
      favoriteBrewMethod,
      tastingTrend,
      insights,
    };
  }

  /**
   * Calcula la tendencia de preferencias del usuario
   */
  private calculateTastingTrend(tastings: CoffeeTasting[]): string {
    if (tastings.length < 3) {
      return this.getTranslation('insufficientDataMessage');
    }

    // Analizar características más comunes
    const bodyCount: Record<string, number> = {};
    const acidityCount: Record<string, number> = {};

    tastings.forEach((tasting) => {
      if (tasting.body) {
        bodyCount[tasting.body] = (bodyCount[tasting.body] || 0) + 1;
      }
      if (tasting.acidity) {
        acidityCount[tasting.acidity] = (acidityCount[tasting.acidity] || 0) + 1;
      }
    });

    const mostCommonBody = Object.entries(bodyCount).sort((a, b) => b[1] - a[1])[0]?.[0] || '';
    const mostCommonAcidity =
      Object.entries(acidityCount).sort((a, b) => b[1] - a[1])[0]?.[0] || '';

    if (mostCommonBody && mostCommonAcidity) {
      const bodyTranslated = this.getTranslation(mostCommonBody) || mostCommonBody;
      const acidityTranslated = this.getTranslation(mostCommonAcidity) || mostCommonAcidity;
      return this.getTranslation('tastingTrendBodyAndAcidity', {
        body: bodyTranslated.toLowerCase(),
        acidity: acidityTranslated.toLowerCase(),
      });
    } else if (mostCommonBody) {
      const bodyTranslated = this.getTranslation(mostCommonBody) || mostCommonBody;
      return this.getTranslation('tastingTrendBody', {
        body: bodyTranslated.toLowerCase(),
      });
    } else if (mostCommonAcidity) {
      const acidityTranslated = this.getTranslation(mostCommonAcidity) || mostCommonAcidity;
      return this.getTranslation('tastingTrendAcidity', {
        acidity: acidityTranslated.toLowerCase(),
      });
    }

    return this.getTranslation('exploreMoreMessage');
  }

  /**
   * Genera insights personalizados basados en las catas
   */
  private generateInsights(tastings: CoffeeTasting[]): Insight[] {
    const insights: Insight[] = [];

    if (tastings.length === 0) return insights;

    // Insight 1: Café favorito (mejor calificado)
    const topRatedTasting = [...tastings].sort((a, b) => b.score - a.score)[0];
    if (topRatedTasting) {
      insights.push({
        message: this.getTranslation('insightFavoriteCoffee', {
          coffeeName: topRatedTasting.coffee_name,
          origin: topRatedTasting.origin,
          score: topRatedTasting.score,
        }),
        icon: 'star',
      });
    }

    // Insight 2: Método favorito
    const brewMethodCount: Record<string, number> = {};
    tastings.forEach((t) => {
      if (t.brew_method) {
        brewMethodCount[t.brew_method] = (brewMethodCount[t.brew_method] || 0) + 1;
      }
    });
    const favoriteMethod = Object.entries(brewMethodCount).sort((a, b) => b[1] - a[1])[0];
    if (favoriteMethod) {
      const methodTranslated = this.getTranslation(favoriteMethod[0]) || favoriteMethod[0];
      insights.push({
        message: this.getTranslation('insightFavoriteMethod', {
          method: methodTranslated,
          count: favoriteMethod[1],
        }),
        icon: 'coffee',
      });
    }

    // Insight 3: Tendencia de preferencias
    const bodyCount: Record<string, number> = {};
    const acidityCount: Record<string, number> = {};
    tastings.forEach((t) => {
      if (t.body) bodyCount[t.body] = (bodyCount[t.body] || 0) + 1;
      if (t.acidity) acidityCount[t.acidity] = (acidityCount[t.acidity] || 0) + 1;
    });
    const mostCommonBody = Object.entries(bodyCount).sort((a, b) => b[1] - a[1])[0]?.[0];
    const mostCommonAcidity = Object.entries(acidityCount).sort((a, b) => b[1] - a[1])[0]?.[0];
    if (mostCommonBody && mostCommonAcidity) {
      const bodyTranslated = this.getTranslation(mostCommonBody.split(' - ')[0]) || mostCommonBody;
      const acidityTranslated =
        this.getTranslation(mostCommonAcidity.split(' - ')[0]) || mostCommonAcidity;
      insights.push({
        message: this.getTranslation('insightPreferenceBodyAndAcidity', {
          body: bodyTranslated.toLowerCase(),
          acidity: acidityTranslated.toLowerCase(),
        }),
        icon: 'heart',
      });
    }

    // Insight 4: Promedio de calificación
    const avgScore = tastings.reduce((sum, t) => sum + t.score, 0) / tastings.length;
    insights.push({
      message: this.getTranslation('insightAverageScore', {
        score: avgScore.toFixed(1),
      }),
      icon: 'trend-up',
    });

    // Insight 5: Origen más explorado
    const originCount: Record<string, number> = {};
    tastings.forEach((t) => {
      if (t.origin) originCount[t.origin] = (originCount[t.origin] || 0) + 1;
    });
    const topOrigin = Object.entries(originCount).sort((a, b) => b[1] - a[1])[0];
    if (topOrigin) {
      insights.push({
        message: this.getTranslation('insightFavoriteOrigin', {
          count: topOrigin[1],
          origin: topOrigin[0],
        }),
        icon: 'lightbulb',
      });
    }

    return insights;
  }
}
