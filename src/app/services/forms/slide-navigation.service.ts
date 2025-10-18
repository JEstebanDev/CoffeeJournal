import { Injectable, signal, computed, inject } from '@angular/core';
import { CoffeeTastingFormService } from './coffee-tasting-form.service';

export interface Slide {
  id: number;
  title: string;
}

@Injectable({
  providedIn: 'root',
})
export class SlideNavigationService {
  private formService = inject(CoffeeTastingFormService);

  // Current slide index
  currentSlide = signal(0);

  // Slides configuration
  readonly slides: Slide[] = [
    { id: 0, title: 'slideIdentityTitle' },
    { id: 1, title: 'slideRoastTitle' },
    { id: 2, title: 'slideSensoryTitle' },
    { id: 3, title: 'slideFlavorTitle' },
    { id: 4, title: 'slideScoreTitle' },
  ];

  readonly slideNames = [
    'slideIdentityTitle',
    'slideRoastTitle',
    'slideSensoryTitle',
    'slideFlavorTitle',
    'slideScoreTitle',
  ];

  // Computed signal to check if we're on the last slide
  isLastSlide = computed(() => this.currentSlide() === this.slides.length - 1);

  // Computed signal to check if we're on the first slide
  isFirstSlide = computed(() => this.currentSlide() === 0);

  /**
   * Navigate to the next slide with validation
   */
  nextSlide(): { success: boolean; error?: string } {
    const current = this.currentSlide();

    // Check if current slide is valid before proceeding
    if (this.formService.isSlideInvalid()(current)) {
      return {
        success: false,
        error: this.getValidationErrorMessage(current),
      };
    }

    // Move to next slide if not at the end
    if (current < this.slides.length - 1) {
      this.currentSlide.update((val) => val + 1);
      return { success: true };
    }

    return { success: false, error: 'lastSlideError' };
  }

  /**
   * Navigate to the previous slide
   */
  prevSlide(): { success: boolean } {
    if (this.currentSlide() > 0) {
      this.currentSlide.update((val) => val - 1);
      return { success: true };
    }
    return { success: false };
  }

  /**
   * Navigate to a specific slide
   */
  goToSlide(index: number): { success: boolean; error?: string } {
    // Allow going back to any slide
    // But prevent skipping ahead if current slide is invalid
    const current = this.currentSlide();

    if (index > current && this.formService.isSlideInvalid()(current)) {
      return {
        success: false,
        error: this.getValidationErrorMessage(current),
      };
    }

    this.currentSlide.set(index);
    return { success: true };
  }

  /**
   * Get validation error message for a specific slide
   */
  getValidationErrorMessage(slideId: number): string {
    return `validationErrorMessage ${this.slideNames[slideId]}`;
  }

  /**
   * Check if a slide is completed (valid)
   */
  isSlideCompleted(slideId: number): boolean {
    switch (slideId) {
      case 0:
        return this.formService.isIdentitySlideValid();
      case 1:
        return this.formService.isRoastSlideValid();
      case 2:
        return this.formService.isSensorySlideValid();
      case 3:
        return this.formService.isFlavorSlideValid();
      case 4:
        return this.formService.isScoreSlideValid();
      default:
        return false;
    }
  }

  /**
   * Check if auto-navigation should happen for a specific slide
   */
  shouldAutoNavigate(slideId: number): boolean {
    return this.currentSlide() === slideId && this.isSlideCompleted(slideId);
  }

  /**
   * Reset navigation to first slide
   */
  resetNavigation() {
    this.currentSlide.set(0);
  }

  /**
   * Reset navigation to sensory slide (slide 2) for new tasting with same coffee
   */
  resetToSensorySlide() {
    this.currentSlide.set(2);
  }

  /**
   * Set current slide (useful for restoring state)
   */
  setCurrentSlide(slideIndex: number) {
    if (slideIndex >= 0 && slideIndex < this.slides.length) {
      this.currentSlide.set(slideIndex);
    }
  }

  /**
   * Find first invalid slide
   */
  findFirstInvalidSlide(): number | null {
    for (let i = 0; i < this.slides.length; i++) {
      if (this.formService.isSlideInvalid()(i)) {
        return i;
      }
    }
    return null;
  }
}
