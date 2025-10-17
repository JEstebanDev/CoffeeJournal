import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  CoffeeIdentitySlideComponent,
  CoffeeRoastSlideComponent,
  CoffeeSensorySlideComponent,
  CoffeeScoreSlideComponent,
  CoffeeFlavorSlideComponent,
} from '../../components/slide/index';

// Services
import { CoffeeService } from '../../services/coffee';
import { Login } from '../../services/auth';
import { PendingTastingService, SlideNavigationService, TastingStateService } from '../../services/forms';
import {
  beanTypes,
  roastLevels,
  brewMethodsOptions,
  bodyLevels,
  acidityLevels,
  afterTasteLevels,
  CoffeeTastingFormService,
  CoffeeIdentity,
  CoffeeScore,
  CoffeeImage,
  CoffeeFlavor,
} from '../../services/forms';
import { CoffeeSensory } from '../../components/slide/coffee-sensory-slide/coffee-sensory-slide.component';

@Component({
  selector: 'app-slides',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CoffeeIdentitySlideComponent,
    CoffeeRoastSlideComponent,
    CoffeeSensorySlideComponent,
    CoffeeFlavorSlideComponent,
    CoffeeScoreSlideComponent,
  ],
  templateUrl: './slides.page.html',
  styleUrl: './slides.page.css',
})
export class SlidesPage implements OnInit {
  // Services
  private coffeeService = inject(CoffeeService);
  private loginService = inject(Login);
  private router = inject(Router);
  private pendingTastingService = inject(PendingTastingService);
  private tastingStateService = inject(TastingStateService);

  // Public services (used in template)
  formService = inject(CoffeeTastingFormService);
  navigationService = inject(SlideNavigationService);

  // UI state signals
  isSubmitting = signal(false);
  errorMessage = signal<string | null>(null);
  successMessage = signal<string | null>(null);
  showPostSaveOptions = signal(false);

  // Auto-navigation timers for debouncing
  private autoNavTimers: Map<number, any> = new Map();

  // Expose form data for template binding
  get coffeeIdentity() {
    return this.formService.coffeeIdentity;
  }
  get coffeeRoast() {
    return this.formService.coffeeRoast;
  }
  get coffeeSensory() {
    return this.formService.coffeeSensory;
  }
  get coffeeFlavor() {
    return this.formService.coffeeFlavor;
  }
  get coffeeScore() {
    return this.formService.coffeeScore;
  }
  get selectedImage() {
    return this.formService.selectedImage;
  }
  get fullCoffeeData() {
    return this.formService.fullCoffeeData;
  }
  get isFormValid() {
    return this.formService.isFormValid;
  }
  get isSlideInvalid() {
    return this.formService.isSlideInvalid;
  }

  // Expose navigation data for template
  get currentSlide() {
    return this.navigationService.currentSlide;
  }
  get slides() {
    return this.navigationService.slides;
  }

  // Expose options for template
  get beanTypes() {
    return beanTypes;
  }
  get roastLevels() {
    return roastLevels;
  }
  get brewMethodsOptions() {
    return brewMethodsOptions;
  }
  get bodyLevels() {
    return bodyLevels;
  }
  get acidityLevels() {
    return acidityLevels;
  }
  get afterTasteLevels() {
    return afterTasteLevels;
  }

  async ngOnInit() {
    // Check if there's saved form data from before login
    const pendingData = await this.pendingTastingService.getPendingTasting();

    if (pendingData) {
      try {
        // Restore form data
        this.formService.loadFormData({
          coffeeIdentity: pendingData.coffeeIdentity,
          coffeeRoast: pendingData.coffeeRoast,
          coffeeSensory: pendingData.coffeeSensory,
          coffeeFlavor: pendingData.coffeeFlavor,
          coffeeScore: pendingData.coffeeScore,
          imageFile: pendingData.imageFile,
        });

        // Restore navigation state
        if (pendingData.currentSlide !== undefined) {
          this.navigationService.setCurrentSlide(pendingData.currentSlide);
        }

        // Mark that there's an active tasting session
        this.tastingStateService.setActiveTasting(true);

        // If user is now authenticated, show a message and auto-save immediately
        if (this.loginService.isAuthenticated()) {
          this.successMessage.set('¡Bienvenido! Guardando tu cata automáticamente...');

          // Auto-save the pending tasting immediately (no setTimeout)
          // Use a microtask to ensure the UI updates first
          Promise.resolve().then(() => {
            this.savePendingTastingToDatabase();
          });
        }
      } catch (error) {
        console.error('Error loading saved form data:', error);
        this.errorMessage.set('Error al cargar los datos guardados.');
      }
    } else {
      // No pending data, but check if there's any form data
      if (this.tastingStateService.hasTastingData()) {
        this.tastingStateService.setActiveTasting(true);
      }
    }
  }

  // Navigation methods
  nextSlide() {
    // Cancel any pending auto-navigation timers when user explicitly navigates
    this.cancelAllAutoNavs();
    const result = this.navigationService.nextSlide();
    if (!result.success && result.error) {
      this.showError(result.error);
    }
  }

  prevSlide() {
    // Cancel any pending auto-navigation timers when user explicitly navigates
    this.cancelAllAutoNavs();
    this.navigationService.prevSlide();
  }

  goToSlide(index: number) {
    // Cancel any pending auto-navigation timers when user explicitly navigates
    this.cancelAllAutoNavs();
    const result = this.navigationService.goToSlide(index);
    if (!result.success && result.error) {
      this.showError(result.error);
    }
  }

  isSlideCompleted(slideId: number): boolean {
    return this.navigationService.isSlideCompleted(slideId);
  }

  // Show error helper
  private showError(message: string) {
    // You could also show a toast notification here
  }

  /**
   * Helper method to handle auto-navigation with debounce
   * Cancels previous timer if user is still typing
   */
  private scheduleAutoNavigation(slideId: number, delay: number = 1200) {
    // Clear any existing timer for this slide
    if (this.autoNavTimers.has(slideId)) {
      clearTimeout(this.autoNavTimers.get(slideId));
    }

    // Only schedule if the slide is complete
    if (this.navigationService.shouldAutoNavigate(slideId)) {
      const timer = setTimeout(() => {
        // Navigate without canceling timers (internal navigation)
        const result = this.navigationService.nextSlide();
        if (!result.success && result.error) {
          this.showError(result.error);
        }
        this.autoNavTimers.delete(slideId);
      }, delay);

      this.autoNavTimers.set(slideId, timer);
    }
  }

  /**
   * Cancel all pending auto-navigation timers
   * Called when user manually navigates
   */
  private cancelAllAutoNavs() {
    this.autoNavTimers.forEach((timer) => clearTimeout(timer));
    this.autoNavTimers.clear();
  }

  // Identity slide handlers
  onIdentityChange(changes: Partial<CoffeeIdentity>) {
    this.formService.updateIdentity(changes);

    // Auto-navigate to next slide if all fields are filled
    // Uses debounce to wait until user stops typing
    this.scheduleAutoNavigation(0);
  }

  // Roast slide handlers
  onRoastLevelChange(level: string) {
    this.formService.updateRoastLevel(level);

    // Auto-navigate if both roast level and brew method are selected
    // Uses debounce to wait until user stops interacting
    this.scheduleAutoNavigation(1);
  }

  onBrewMethodChange(method: string) {
    this.formService.updateBrewMethod(method);

    // Auto-navigate if both roast level and brew method are selected
    // Uses debounce to wait until user stops interacting
    this.scheduleAutoNavigation(1);
  }

  // Sensory slide handlers
  onSensoryChange(changes: Partial<CoffeeSensory>) {
    this.formService.updateSensory(changes);

    // Auto-navigate when sensory slide is complete (body, aroma, acidity)
    // Uses debounce to wait until user stops typing
    this.scheduleAutoNavigation(2);
  }

  // Flavor slide handlers
  onFlavorChange(changes: Partial<CoffeeFlavor>) {
    this.formService.updateFlavor(changes);

    // Auto-navigate when flavor slide is complete (flavor, aftertaste, description)
    // Uses debounce to wait until user stops typing
    this.scheduleAutoNavigation(3);
  }

  // Score change handler
  onScoreChange(changes: Partial<CoffeeScore>) {
    this.formService.updateScore(changes);
  }

  // Image change handler
  onImageChange(imageData: CoffeeImage) {
    this.formService.updateImage(imageData);
  }

  onFormSubmit() {
    // Add logic to send the form data
  }

  async onSaveCoffeeForm() {
    // Validate entire form before saving
    if (!this.formService.isFormValid()) {
      this.errorMessage.set('⚠️ Por favor completa todos los campos requeridos antes de guardar.');

      // Find first invalid slide and navigate to it
      const firstInvalidSlide = this.navigationService.findFirstInvalidSlide();
      if (firstInvalidSlide !== null) {
        this.goToSlide(firstInvalidSlide);
        const errorMsg = this.navigationService.getValidationErrorMessage(firstInvalidSlide);
        this.showError(errorMsg);
      }

      // Clear error message after 5 seconds
      setTimeout(() => {
        this.errorMessage.set(null);
      }, 5000);

      return;
    }

    // Check if user is authenticated
    if (!this.loginService.isAuthenticated()) {
      // Save form data to IndexedDB (including image as File)
      const formData = this.formService.getFormDataForSaving();
      const pendingData = {
        ...formData,
        currentSlide: this.navigationService.currentSlide(),
        timestamp: Date.now(),
      };

      try {
        await this.pendingTastingService.savePendingTasting(pendingData);
        this.successMessage.set('💾 Datos guardados. Redirigiendo al inicio de sesión...');

        // Redirect to login after 2 seconds
        setTimeout(() => {
          this.router.navigate(['/auth']);
        }, 2000);
      } catch (error) {
        console.error('Error saving pending tasting:', error);
        this.errorMessage.set('Error al guardar los datos. Por favor intenta nuevamente.');
      }

      return;
    }

    // User is authenticated, save directly to database
    await this.savePendingTastingToDatabase();
  }

  /**
   * Save the current tasting data to the database
   */
  private async savePendingTastingToDatabase() {

    this.isSubmitting.set(true);
    this.errorMessage.set(null);
    this.successMessage.set(null);

    try {
      // Verify user is still authenticated
      if (!this.loginService.isAuthenticated()) {
        console.error('❌ Usuario no autenticado al intentar guardar');
        this.errorMessage.set('Sesión expirada. Por favor inicia sesión nuevamente.');
        this.isSubmitting.set(false);
        return;
      }

      // Get user ID
      const user = this.loginService.user;
      const userId = user?.id || 'anonymous';

      // Convert image to base64 if exists
      let imageBase64 = '';
      if (this.formService.selectedImage().file) {
        imageBase64 = await this.coffeeService.convertImageToBase64(
          this.formService.selectedImage().file!
        );
      }

      // Get full data from form service
      const fullData = this.formService.fullCoffeeData();

      // Use form service methods for data transformation
      const bodyDescription = this.formService.getBodyDescription(fullData.body);
      const acidityDescription = this.formService.getAcidityDescription(fullData.acidity);
      const aftertasteFullDescription = this.formService.getAftertasteDescription(
        fullData.aftertaste,
        fullData.aftertasteDescription
      );

      const coffeeTasting = {
        user_id: userId,
        brand: fullData.brand,
        coffee_name: fullData.coffeeName,
        bean_type: fullData.beanType,
        origin: fullData.origin,
        roast_level: fullData.roastLevel,
        brew_method: fullData.brewMethod,
        aroma: fullData.aroma,
        flavor: fullData.flavor,
        body: bodyDescription,
        acidity: acidityDescription,
        aftertaste: aftertasteFullDescription,
        impression: fullData.opinion,
        score: fullData.score,
        image: imageBase64,
      };


      // Save to database
      this.coffeeService.saveCoffeeTasting(coffeeTasting).subscribe({
        next: async () => {
          this.successMessage.set('¡Cata guardada exitosamente! ☕🎉');

          // Delete pending tasting from IndexedDB
          try {
            await this.pendingTastingService.deletePendingTasting();
          } catch (deleteError) {
            console.error('⚠️ Error al eliminar cata pendiente de IndexedDB:', deleteError);
            // Continue anyway, the tasting was saved successfully
          }

          // Clear tasting state since we've successfully saved
          this.tastingStateService.setActiveTasting(false);

          // Keep form data for potential new tasting
          // Reset only sensory and scoring data, keeping coffee identity and roast info
          this.formService.resetSensoryAndScoringData();
          this.navigationService.resetToSensorySlide();

          // Show options to user
          setTimeout(() => {
            this.showPostSaveOptionsModal();
          }, 1500);
        },
        error: (error) => {
          console.error('❌ Error al guardar la cata:', error);
          this.errorMessage.set('Error al guardar la cata. Por favor intenta nuevamente.');
          this.isSubmitting.set(false);
        },
        complete: () => {
          this.isSubmitting.set(false);
        },
      });
    } catch (error) {
      console.error('❌ Error inesperado:', error);
      this.errorMessage.set('Error al procesar la solicitud. Por favor intenta nuevamente.');
      this.isSubmitting.set(false);
    }
  }

  /**
   * Show options to user after successfully saving a tasting
   */
  private showPostSaveOptionsModal() {
    this.showPostSaveOptions.set(true);
  }

  /**
   * Handle user choice to create another tasting with the same coffee
   */
  onNewTastingWithSameCoffee() {
    this.showPostSaveOptions.set(false);
    this.successMessage.set('');
    // Mark that there's an active tasting session again
    this.tastingStateService.setActiveTasting(true);
    // Form data is already prepared (identity and roast info kept, sensory data reset)
    // Navigation is already set to sensory slide
    console.log('🔄 Creando nueva cata con el mismo café...');
  }

  /**
   * Handle user choice to create a completely new tasting
   */
  onNewTastingFromScratch() {
    this.showPostSaveOptions.set(false);
    this.successMessage.set('');
    this.formService.resetForm();
    this.navigationService.resetNavigation();
    // Mark that there's an active tasting session again
    this.tastingStateService.setActiveTasting(true);
    console.log('🆕 Creando nueva cata desde cero...');
  }

  /**
   * Handle user choice to go back to dashboard
   */
  onGoToDashboard() {
    this.showPostSaveOptions.set(false);
    // Clear tasting state when going to dashboard
    this.tastingStateService.setActiveTasting(false);
    this.router.navigate(['/dashboard']);
  }
}
