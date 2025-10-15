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
import { CoffeeService } from '../../services/coffee.service';
import { Login } from '../../services/login.service';
import {
  CoffeeTastingFormService,
  CoffeeIdentity,
  CoffeeSensory,
  CoffeeFlavor,
  CoffeeScore,
  CoffeeImage,
} from '../../services/slide/coffee-tasting-form.service';
import { PendingTastingService, SlideNavigationService } from '../../services/slide';

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

  // Public services (used in template)
  formService = inject(CoffeeTastingFormService);
  navigationService = inject(SlideNavigationService);

  // UI state signals
  isSubmitting = signal(false);
  errorMessage = signal<string | null>(null);
  successMessage = signal<string | null>(null);

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
    return this.formService.beanTypes;
  }
  get roastLevels() {
    return this.formService.roastLevels;
  }
  get brewMethodsOptions() {
    return this.formService.brewMethodsOptions;
  }
  get bodyLevels() {
    return this.formService.bodyLevels;
  }
  get acidityLevels() {
    return this.formService.acidityLevels;
  }
  get afterTasteLevels() {
    return this.formService.afterTasteLevels;
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

        // If user is now authenticated, show a message and auto-save
        if (this.loginService.isAuthenticated()) {
          this.successMessage.set('¡Bienvenido! Guardando tu cata automáticamente...');

          // Auto-save the pending tasting
          setTimeout(async () => {
            await this.savePendingTastingToDatabase();
          }, 1000);
        }
      } catch (error) {
        console.error('Error loading saved form data:', error);
      }
    }
  }

  // Navigation methods
  nextSlide() {
    const result = this.navigationService.nextSlide();
    if (!result.success && result.error) {
      this.showError(result.error);
    }
  }

  prevSlide() {
    this.navigationService.prevSlide();
  }

  goToSlide(index: number) {
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
    console.warn(message);
    // You could also show a toast notification here
  }

  // Identity slide handlers
  onIdentityChange(changes: Partial<CoffeeIdentity>) {
    this.formService.updateIdentity(changes);

    // Auto-navigate to next slide if all fields are filled
    if (this.navigationService.shouldAutoNavigate(0)) {
      setTimeout(() => this.nextSlide(), 600);
    }
  }

  // Roast slide handlers
  onRoastLevelChange(level: string) {
    this.formService.updateRoastLevel(level);

    // Auto-navigate if both roast level and brew method are selected
    if (this.navigationService.shouldAutoNavigate(1)) {
      setTimeout(() => this.nextSlide(), 600);
    }
  }

  onBrewMethodChange(method: string) {
    this.formService.updateBrewMethod(method);

    // Auto-navigate if both roast level and brew method are selected
    if (this.navigationService.shouldAutoNavigate(1)) {
      setTimeout(() => this.nextSlide(), 600);
    }
  }

  // Sensory slide handlers
  onSensoryChange(changes: Partial<CoffeeSensory>) {
    this.formService.updateSensory(changes);

    // Auto-navigate when sensory slide is complete (body, aroma, acidity)
    if (this.navigationService.shouldAutoNavigate(2)) {
      setTimeout(() => this.nextSlide(), 600);
    }
  }

  // Flavor slide handlers
  onFlavorChange(changes: Partial<CoffeeFlavor>) {
    this.formService.updateFlavor(changes);

    // Auto-navigate when flavor slide is complete (flavor, aftertaste, description)
    if (this.navigationService.shouldAutoNavigate(3)) {
      setTimeout(() => this.nextSlide(), 600);
    }
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
    console.log('Coffee Form Data:', this.formService.fullCoffeeData());
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

      console.log('💾 Guardando cata de café...', coffeeTasting);

      // Save to database
      this.coffeeService.saveCoffeeTasting(coffeeTasting).subscribe({
        next: async () => {
          this.successMessage.set('¡Cata guardada exitosamente! ☕🎉');

          // Delete pending tasting from IndexedDB
          await this.pendingTastingService.deletePendingTasting();

          // Redirect to dashboard after 2 seconds
          setTimeout(() => {
            this.router.navigate(['/dashboard']);
          }, 2000);
        },
        error: (error) => {
          console.error('Error al guardar la cata:', error);
          this.errorMessage.set('Error al guardar la cata. Por favor intenta nuevamente.');
          this.isSubmitting.set(false);
        },
        complete: () => {
          this.isSubmitting.set(false);
        },
      });
    } catch (error) {
      console.error('Error:', error);
      this.errorMessage.set('Error al procesar la solicitud');
      this.isSubmitting.set(false);
    }
  }
}
