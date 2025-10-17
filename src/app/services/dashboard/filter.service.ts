import { Injectable, signal, computed } from '@angular/core';
import { CardTastingInfo } from '../forms';

export type SortOrder = 'recent' | 'best' | 'worst';

@Injectable({
  providedIn: 'root'
})
export class FilterService {
  
  // Search filter signal
  searchQuery = signal<string>('');
  
  // Sort order signal
  sortOrder = signal<SortOrder>('recent');

  /**
   * Computed signal for filtered and sorted tastings
   */
  getFilteredTastings = (tastings: CardTastingInfo[]) => {
    return computed(() => {
      const query = this.searchQuery().toLowerCase().trim();
      const sort = this.sortOrder();

      // Filter tastings
      let filtered = tastings;
      if (query) {
        filtered = tastings.filter(
          (tasting) =>
            (tasting.coffeeName ?? '').toLowerCase().includes(query) ||
            (tasting.brand ?? '').toLowerCase().includes(query)
        );
      }

      // Sort tastings
      return [...filtered].sort((a, b) => {
        switch (sort) {
          case 'best':
            return b.score - a.score; // Mejor puntuación primero
          case 'worst':
            return a.score - b.score; // Peor puntuación primero
          case 'recent':
          default:
            // Más recientes primero (por fecha de creación)
            const dateA = new Date(a.createdAt || 0).getTime();
            const dateB = new Date(b.createdAt || 0).getTime();
            return dateB - dateA;
        }
      });
    });
  };

  /**
   * Updates the search query
   */
  updateSearchQuery(query: string): void {
    this.searchQuery.set(query);
  }

  /**
   * Clears the search query
   */
  clearSearch(): void {
    this.searchQuery.set('');
  }

  /**
   * Sets the sort order
   */
  setSortOrder(order: SortOrder): void {
    this.sortOrder.set(order);
  }

  /**
   * Sort by best ratings
   */
  sortByBest(): void {
    this.setSortOrder('best');
  }

  /**
   * Sort by worst ratings
   */
  sortByWorst(): void {
    this.setSortOrder('worst');
  }

  /**
   * Sort by most recent
   */
  sortByRecent(): void {
    this.setSortOrder('recent');
  }
}
