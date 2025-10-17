import { Injectable, signal, computed, inject } from '@angular/core';
import { PendingTastingService } from './pending-tasting.service';
import { CoffeeTastingFormService } from './coffee-tasting-form.service';
import { SlideNavigationService } from './slide-navigation.service';

@Injectable({
  providedIn: 'root',
})
export class TastingStateService {
  private pendingTastingService = inject(PendingTastingService);
  private formService = inject(CoffeeTastingFormService);
  private navigationService = inject(SlideNavigationService);

  // Signal to track if there's an active tasting session
  private hasActiveTasting = signal<boolean>(false);

  // Computed signal to check if there's any tasting data
  hasTastingData = computed(() => {
    const identity = this.formService.coffeeIdentity();
    const roast = this.formService.coffeeRoast();
    const sensory = this.formService.coffeeSensory();
    const flavor = this.formService.coffeeFlavor();
    const score = this.formService.coffeeScore();

    // Check if any form has meaningful data
    const hasIdentityData = identity.brand.trim() !== '' || 
                           identity.coffeeName.trim() !== '' || 
                           identity.beanType !== '' || 
                           identity.origin.trim() !== '';
    
    const hasRoastData = roast.roastLevel !== '' || roast.brewMethod !== '';
    
    const hasSensoryData = sensory.aroma.trim() !== '' || 
                          sensory.flavor.trim() !== '' || 
                          sensory.body > 0;
    
    const hasFlavorData = flavor.acidity > 0 || 
                         flavor.aftertaste > 0 || 
                         flavor.aftertasteDescription.trim() !== '';
    
    const hasScoreData = score.opinion.trim() !== '' || score.score > 0;

    return hasIdentityData || hasRoastData || hasSensoryData || hasFlavorData || hasScoreData;
  });

  // Computed signal to check if there's a pending tasting in IndexedDB
  hasPendingTasting = computed(() => this.hasActiveTasting());

  /**
   * Check if there's an active tasting session
   */
  async checkForActiveTasting(): Promise<boolean> {
    try {
      // Check for pending tasting in IndexedDB
      const hasPending = await this.pendingTastingService.hasPendingTasting();
      
      // Check for current form data
      const hasFormData = this.hasTastingData();
      
      const isActive = hasPending || hasFormData;
      this.hasActiveTasting.set(isActive);
      
      return isActive;
    } catch (error) {
      console.error('Error checking for active tasting:', error);
      return false;
    }
  }

  /**
   * Clear all tasting data
   */
  async clearTastingData(): Promise<void> {
    try {
      // Clear form data
      this.formService.resetForm();
      
      // Reset navigation
      this.navigationService.resetNavigation();
      
      // Clear pending tasting from IndexedDB
      await this.pendingTastingService.deletePendingTasting();
      
      // Update state
      this.hasActiveTasting.set(false);
    } catch (error) {
      console.error('Error clearing tasting data:', error);
      throw error;
    }
  }

  /**
   * Set active tasting state
   */
  setActiveTasting(isActive: boolean) {
    this.hasActiveTasting.set(isActive);
  }

  /**
   * Get current tasting progress info
   */
  getTastingProgressInfo(): { hasData: boolean; currentSlide: number; totalSlides: number } {
    return {
      hasData: this.hasTastingData(),
      currentSlide: this.navigationService.currentSlide(),
      totalSlides: this.navigationService.slides.length
    };
  }
}
