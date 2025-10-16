import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Login } from '../../../services/login.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent {
  private router = inject(Router);
  private loginService = inject(Login);

  // Signal to track if image failed to load
  imageLoadError = signal<boolean>(false);

  // Computed signals for user data
  userName = computed(() => {
    const user = this.loginService.currentUser();
    return user?.user_metadata?.['username'] || 
           user?.user_metadata?.['full_name'] || 
           user?.user_metadata?.['name'] || 
           user?.email?.split('@')[0] || 
           'Usuario';
  });

  userEmail = computed(() => {
    const user = this.loginService.currentUser();
    return user?.email || '';
  });

  userPicture = computed(() => {
    const user = this.loginService.currentUser();
    
    // Try multiple possible locations for the avatar
    const avatarUrl = user?.user_metadata?.['avatar_url'] || 
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

  navigateToDashboard() {
    this.router.navigate(['/dashboard']);
  }

  onImageError() {
    this.imageLoadError.set(true);
  }

  onLogout() {
    this.loginService.signOut();
  }
}
