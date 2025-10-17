import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Login } from '../../../services/auth';
import { TastingStateService } from '../../../services/forms';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, ConfirmationDialogComponent],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent {
  private router = inject(Router);
  private loginService = inject(Login);
  private tastingStateService = inject(TastingStateService);

  // Signal to track if image failed to load
  imageLoadError = signal<boolean>(false);

  // Confirmation dialog signals
  showConfirmationDialog = signal<boolean>(false);
  confirmationTitle = signal<string>('¿Eliminar cata en progreso?');
  confirmationMessage = signal<string>('Tienes una cata en progreso. ¿Qué quieres hacer?');
  confirmationDetails = signal<string | null>(null);

  // Computed signals for user data
  userName = computed(() => {
    const user = this.loginService.currentUser();
    return (
      user?.user_metadata?.['username'] ||
      user?.user_metadata?.['full_name'] ||
      user?.user_metadata?.['name'] ||
      user?.email?.split('@')[0] ||
      'Usuario'
    );
  });

  userEmail = computed(() => {
    const user = this.loginService.currentUser();
    return user?.email || '';
  });

  userPicture = computed(() => {
    const user = this.loginService.currentUser();

    // Try multiple possible locations for the avatar
    const avatarUrl =
      user?.user_metadata?.['avatar_url'] ||
      user?.user_metadata?.['picture'] ||
      user?.user_metadata?.['avatar'] ||
      user?.user_metadata?.['profile_picture'] ||
      '';

    // If avatarUrl exists and is not a full URL (doesn't start with http),
    // it might be a path in Supabase storage
    if (avatarUrl && !avatarUrl.startsWith('http')) {
      // This would be a path like "user-id-random.jpg"
      // We need to get the public URL from Supabase storage
      // For now, return empty and we'll handle it in the component
      return '';
    }

    return avatarUrl;
  });

  async navigateToDashboard() {
    // Check if there's an active tasting session
    const hasActiveTasting = await this.tastingStateService.checkForActiveTasting();
    
    if (hasActiveTasting) {
      // Show confirmation dialog
      const progressInfo = this.tastingStateService.getTastingProgressInfo();
      this.confirmationDetails.set(
        `Progreso actual: ${progressInfo.currentSlide + 1} de ${progressInfo.totalSlides} pasos completados`
      );
      this.showConfirmationDialog.set(true);
    } else {
      // No active tasting, navigate directly
      this.router.navigate(['/dashboard']);
    }
  }

  onImageError() {
    this.imageLoadError.set(true);
  }

  onLogout() {
    this.loginService.signOut();
  }

  // Confirmation dialog handlers
  onConfirmDeleteTasting() {
    this.tastingStateService.clearTastingData()
      .then(() => {
        this.showConfirmationDialog.set(false);
        this.router.navigate(['/dashboard']);
      })
      .catch((error) => {
        console.error('Error clearing tasting data:', error);
        // Still navigate even if clearing fails
        this.showConfirmationDialog.set(false);
        this.router.navigate(['/dashboard']);
      });
  }

  onCancelDeleteTasting() {
    this.showConfirmationDialog.set(false);
    // Stay on current page, don't navigate
  }
}
