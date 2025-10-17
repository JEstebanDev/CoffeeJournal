import { Injectable } from '@angular/core';

export interface PendingCoffeeTasting {
  coffeeIdentity: {
    brand: string;
    coffeeName: string;
    beanType: string;
    origin: string;
  };
  coffeeRoast: {
    roastLevel: string;
    brewMethod: string;
  };
  coffeeSensory: {
    aroma: string;
    flavor: string;
    body: number;
  };
  coffeeFlavor: {
    acidity: number;
    aftertaste: number;
    aftertasteDescription: string;
  };
  coffeeScore: {
    opinion: string;
    score: number;
  };
  imageFile: File | null;
  currentSlide: number;
  timestamp: number;
}

@Injectable({
  providedIn: 'root',
})
export class PendingTastingService {
  private readonly DB_NAME = 'CoffeeJournalDB';
  private readonly DB_VERSION = 1;
  private readonly STORE_NAME = 'pendingTastings';
  private readonly PENDING_KEY = 'current_pending_tasting';

  private db: IDBDatabase | null = null;

  constructor() {
    this.initDB();
  }

  /**
   * Initialize IndexedDB
   */
  private async initDB(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.DB_NAME, this.DB_VERSION);

      request.onerror = () => {
        console.error('Error opening IndexedDB:', request.error);
        reject(request.error);
      };

      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // Create object store if it doesn't exist
        if (!db.objectStoreNames.contains(this.STORE_NAME)) {
          db.createObjectStore(this.STORE_NAME);
        }
      };
    });
  }

  /**
   * Ensure DB is initialized
   */
  private async ensureDB(): Promise<IDBDatabase> {
    if (!this.db) {
      await this.initDB();
    }
    if (!this.db) {
      throw new Error('Failed to initialize IndexedDB');
    }
    return this.db;
  }

  /**
   * Save pending tasting to IndexedDB
   */
  async savePendingTasting(data: PendingCoffeeTasting): Promise<void> {
    try {
      const db = await this.ensureDB();

      return new Promise((resolve, reject) => {
        const transaction = db.transaction([this.STORE_NAME], 'readwrite');
        const store = transaction.objectStore(this.STORE_NAME);

        const request = store.put(data, this.PENDING_KEY);

        request.onsuccess = () => {
          resolve();
        };

        request.onerror = () => {
          console.error('❌ Error saving pending tasting:', request.error);
          reject(request.error);
        };
      });
    } catch (error) {
      console.error('Error in savePendingTasting:', error);
      throw error;
    }
  }

  /**
   * Get pending tasting from IndexedDB
   */
  async getPendingTasting(): Promise<PendingCoffeeTasting | null> {
    try {
      const db = await this.ensureDB();

      return new Promise((resolve, reject) => {
        const transaction = db.transaction([this.STORE_NAME], 'readonly');
        const store = transaction.objectStore(this.STORE_NAME);

        const request = store.get(this.PENDING_KEY);

        request.onsuccess = () => {
          const data = request.result as PendingCoffeeTasting | undefined;
          resolve(data || null);
        };

        request.onerror = () => {
          console.error('❌ Error getting pending tasting:', request.error);
          reject(request.error);
        };
      });
    } catch (error) {
      console.error('Error in getPendingTasting:', error);
      return null;
    }
  }

  /**
   * Check if there's a pending tasting
   */
  async hasPendingTasting(): Promise<boolean> {
    const data = await this.getPendingTasting();
    return data !== null;
  }

  /**
   * Delete pending tasting from IndexedDB
   */
  async deletePendingTasting(): Promise<void> {
    try {
      const db = await this.ensureDB();

      return new Promise((resolve, reject) => {
        const transaction = db.transaction([this.STORE_NAME], 'readwrite');
        const store = transaction.objectStore(this.STORE_NAME);

        const request = store.delete(this.PENDING_KEY);

        request.onsuccess = () => {
          resolve();
        };

        request.onerror = () => {
          console.error('❌ Error deleting pending tasting:', request.error);
          reject(request.error);
        };
      });
    } catch (error) {
      console.error('Error in deletePendingTasting:', error);
      throw error;
    }
  }

  /**
   * Clear all pending tastings (useful for cleanup)
   */
  async clearAll(): Promise<void> {
    try {
      const db = await this.ensureDB();

      return new Promise((resolve, reject) => {
        const transaction = db.transaction([this.STORE_NAME], 'readwrite');
        const store = transaction.objectStore(this.STORE_NAME);

        const request = store.clear();

        request.onsuccess = () => {
          resolve();
        };

        request.onerror = () => {
          console.error('❌ Error clearing pending tastings:', request.error);
          reject(request.error);
        };
      });
    } catch (error) {
      console.error('Error in clearAll:', error);
      throw error;
    }
  }
}
