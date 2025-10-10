import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CoffeeService } from '../../services/coffee.service';

@Component({
  selector: 'app-coffee-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './coffee-form.component.html',
  styleUrls: ['./coffee-form.component.css'],
})
export class CoffeeFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private coffeeService = inject(CoffeeService);
  public router = inject(Router); // Hacer público para usar en el template
  private authService = inject(AuthService);

  coffeeForm: FormGroup;
  selectedImage = signal<string | null>(null);
  selectedFile = signal<File | null>(null);
  isSubmitting = signal(false);
  errorMessage = signal<string | null>(null);
  successMessage = signal<string | null>(null);
  isAuthenticated = this.authService.isAuthenticated;

  // Track if user came from dashboard
  private isFromDashboard = signal<boolean>(false);

  // Opciones para los selects
  beanTypes = ['Arábica', 'Robusta', 'Liberica', 'Excelsa', 'Mezcla'];
  roastLevels = ['Claro', 'Medio-Claro', 'Medio', 'Medio-Oscuro', 'Oscuro'];
  brewMethods = [
    'Espresso',
    'V60',
    'Chemex',
    'Prensa Francesa',
    'Aeropress',
    'Cafetera Italiana',
    'Cold Brew',
    'Turco',
  ];

  constructor() {
    this.coffeeForm = this.fb.group({
      brand: ['', [Validators.required, Validators.minLength(2)]],
      coffeeName: ['', [Validators.required, Validators.minLength(2)]],
      beanType: ['', Validators.required],
      origin: ['', [Validators.required, Validators.minLength(2)]],
      roastLevel: ['', Validators.required],
      brewMethod: ['', Validators.required],
      aroma: ['', [Validators.required, Validators.minLength(5)]],
      flavor: ['', [Validators.required, Validators.minLength(5)]],
      body: ['', [Validators.required, Validators.minLength(3)]],
      acidity: ['', [Validators.required, Validators.minLength(3)]],
      aftertaste: ['', [Validators.required, Validators.minLength(5)]],
      overallImpression: ['', [Validators.required, Validators.minLength(10)]],
      score: [5, [Validators.required, Validators.min(0), Validators.max(10)]],
    });
  }

  ngOnInit() {
    // Check if user came from dashboard route
    const currentUrl = this.router.url;
    this.isFromDashboard.set(currentUrl.startsWith('/dashboard'));

    // Check if there's saved form data from before login
    const savedFormData = localStorage.getItem('pendingCoffeeTasting');
    if (savedFormData) {
      try {
        const data = JSON.parse(savedFormData);
        this.coffeeForm.patchValue(data.formData);
        if (data.imageData) {
          this.selectedImage.set(data.imageData);
        }
        // Clear the saved data
        localStorage.removeItem('pendingCoffeeTasting');

        // If user is now authenticated, show a message
        if (this.isAuthenticated()) {
          this.successMessage.set('¡Bienvenido! Ahora puedes enviar tu cata.');
        }
      } catch (error) {
        console.error('Error loading saved form data:', error);
      }
    }
  }

  /**
   * Maneja la selección de imagen
   */
  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];

      // Validar tipo de archivo
      if (!file.type.startsWith('image/')) {
        this.errorMessage.set('Por favor selecciona un archivo de imagen válido');
        return;
      }

      // Validar tamaño (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        this.errorMessage.set('La imagen no debe superar los 5MB');
        return;
      }

      this.selectedFile.set(file);

      // Crear preview
      const reader = new FileReader();
      reader.onload = (e) => {
        this.selectedImage.set(e.target?.result as string);
      };
      reader.readAsDataURL(file);

      this.errorMessage.set(null);
    }
  }

  /**
   * Elimina la imagen seleccionada
   */
  removeImage(): void {
    this.selectedImage.set(null);
    this.selectedFile.set(null);
  }

  /**
   * Cancela el formulario y navega según el origen
   */
  onCancel(): void {
    // Set submitting state
    this.isSubmitting.set(true);

    // Clear any error or success messages
    this.errorMessage.set(null);
    this.successMessage.set(null);

    // Navigate based on where the user came from
    if (this.isFromDashboard()) {
      this.router.navigate(['/dashboard']).finally(() => {
        this.isSubmitting.set(false);
      });
    } else {
      this.router.navigate(['/']).finally(() => {
        this.isSubmitting.set(false);
      });
    }
  }

  /**
   * Envía el formulario
   */
  async onSubmit(): Promise<void> {
    if (this.coffeeForm.invalid) {
      this.markFormGroupTouched(this.coffeeForm);
      this.errorMessage.set('Por favor completa todos los campos requeridos');
      return;
    }

    // Check if user is authenticated
    if (!this.isAuthenticated()) {
      // Save form data to localStorage
      const formDataToSave = {
        formData: this.coffeeForm.value,
        imageData: this.selectedImage(),
      };
      localStorage.setItem('pendingCoffeeTasting', JSON.stringify(formDataToSave));

      // Redirect to login
      this.authService.loginWithRedirect('/dashboard/coffee/new');
      return;
    }

    this.isSubmitting.set(true);
    this.errorMessage.set(null);
    this.successMessage.set(null);

    try {
      // Obtener el user_id del AuthService
      const user = this.authService.user();
      const userId = user?.sub || 'anonymous';

      // Convertir imagen a base64 si existe
      let imageBase64 = '';
      if (this.selectedFile()) {
        imageBase64 = await this.coffeeService.convertImageToBase64(this.selectedFile()!);
      }

      // Preparar datos con los nombres de campos de Supabase
      const formData = this.coffeeForm.value;
      const coffeeTasting = {
        user_id: userId, // Formato YYYY-MM-DD
        brand: formData.brand,
        coffee_name: formData.coffeeName,
        bean_type: formData.beanType,
        origin: formData.origin,
        roast_level: formData.roastLevel,
        brew_method: formData.brewMethod,
        aroma: formData.aroma,
        flavor: formData.flavor,
        body: formData.body,
        acidity: formData.acidity,
        aftertaste: formData.aftertaste,
        impression: formData.overallImpression,
        score: parseFloat(formData.score),
        image: imageBase64,
      };

      // Enviar a Supabase
      this.coffeeService.saveCoffeeTasting(coffeeTasting).subscribe({
        next: () => {
          this.successMessage.set('¡Cata guardada exitosamente! ☕');
          this.coffeeForm.reset();
          this.removeImage();

          // Redirigir después de 2 segundos
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

  /**
   * Marca todos los campos del formulario como touched para mostrar errores
   */
  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach((key) => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }

  /**
   * Verifica si un campo tiene error
   */
  hasError(fieldName: string): boolean {
    const field = this.coffeeForm.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  /**
   * Obtiene el mensaje de error para un campo
   */
  getErrorMessage(fieldName: string): string {
    const field = this.coffeeForm.get(fieldName);
    if (field?.hasError('required')) {
      return 'Este campo es requerido';
    }
    if (field?.hasError('minlength')) {
      const minLength = field.errors?.['minlength'].requiredLength;
      return `Mínimo ${minLength} caracteres`;
    }
    if (field?.hasError('min')) {
      return 'El valor mínimo es 0';
    }
    if (field?.hasError('max')) {
      return 'El valor máximo es 10';
    }
    return '';
  }
}
