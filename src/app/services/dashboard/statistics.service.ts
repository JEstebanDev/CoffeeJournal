import { Injectable, signal } from '@angular/core';
import { CoffeeTasting } from '../coffee';
import { TopOrigin, Insight } from '../../components/molecule/stats-grid/stats-grid.component';

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
  providedIn: 'root'
})
export class StatisticsService {

  /**
   * Calcula todas las estadísticas del dashboard basadas en las catas
   */
  calculateStatistics(tastings: CoffeeTasting[]): DashboardStatistics {
    const totalTastings = tastings.length;

    if (totalTastings === 0) {
      return {
        totalTastings: 0,
        averageRating: 0,
        favoriteOrigin: 'N/A',
        topOrigins: [],
        favoriteRoast: '',
        favoriteBrewMethod: '',
        tastingTrend: '',
        insights: []
      };
    }

    // Calcular promedio de puntuación
    const totalScore = tastings.reduce((sum, tasting) => sum + (tasting.score || 0), 0);
    const averageRating = totalScore / totalTastings;

    // Encontrar origen favorito (el más frecuente)
    const originCount = tastings.reduce((acc, tasting) => {
      const origin = tasting.origin || 'Desconocido';
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
      const roast = tasting.roast_level || 'Desconocido';
      acc[roast] = (acc[roast] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    const favoriteRoastKey = Object.entries(roastCount).reduce((a, b) => (a[1] > b[1] ? a : b))[0];

    // Traducir nivel de tueste a español
    const roastTranslation: Record<string, string> = {
      light: 'Claro',
      medium: 'Medio',
      dark: 'Oscuro',
    };
    const favoriteRoast = roastTranslation[favoriteRoastKey] || favoriteRoastKey;

    // Método de preparación favorito
    const brewMethodCount = tastings.reduce((acc, tasting) => {
      const method = tasting.brew_method || 'Desconocido';
      acc[method] = (acc[method] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    const favoriteBrewMethod = Object.entries(brewMethodCount).reduce((a, b) =>
      a[1] > b[1] ? a : b
    )[0];

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
      insights
    };
  }

  /**
   * Calcula la tendencia de preferencias del usuario
   */
  private calculateTastingTrend(tastings: CoffeeTasting[]): string {
    if (tastings.length < 3) {
      return 'insufficientDataMessage';
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
      return `Prefieres cafés con cuerpo ${mostCommonBody.toLowerCase()} y acidez ${mostCommonAcidity.toLowerCase()}`;
    } else if (mostCommonBody) {
      return `Prefieres cafés con cuerpo ${mostCommonBody.toLowerCase()}`;
    } else if (mostCommonAcidity) {
      return `Prefieres cafés con acidez ${mostCommonAcidity.toLowerCase()}`;
    }

    return 'exploreMoreMessage';
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
        message: `Tu café favorito hasta ahora es ${topRatedTasting.coffee_name}, ${topRatedTasting.origin} con ${topRatedTasting.score} de calificación.`,
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
      insights.push({
        message: `El método ${favoriteMethod[0]} es el que más te gusta con ${favoriteMethod[1]} catas.`,
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
      insights.push({
        message: `Prefieres cafés con cuerpo ${mostCommonBody.toLowerCase()} y acidez ${mostCommonAcidity.toLowerCase()}.`,
        icon: 'heart',
      });
    }

    // Insight 4: Promedio de calificación
    const avgScore = tastings.reduce((sum, t) => sum + t.score, 0) / tastings.length;
    insights.push({
      message: `Tu calificación promedio es ${avgScore.toFixed(
        1
      )} de 10. ¡Sigue explorando nuevos cafés!`,
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
        message: `Has catado ${topOrigin[1]} cafés de ${topOrigin[0]}. ¡Es tu origen favorito!`,
        icon: 'lightbulb',
      });
    }

    return insights;
  }
}
