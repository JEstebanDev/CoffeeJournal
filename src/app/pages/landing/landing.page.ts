import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Login } from '../../services/auth';
import { FutterComponent } from '../../components/molecule/futter/futter.component';
import { TranslatePipe } from '../../services/language/translate.pipe';
import { SEOService } from '../../services/seo';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [CommonModule, FutterComponent, TranslatePipe],
  templateUrl: './landing.page.html',
  styleUrl: './landing.page.css',
})
export class LandingPage implements OnInit {
  private router = inject(Router);
  private loginService = inject(Login);
  private seoService = inject(SEOService);

  // Signal to show loading state during authentication
  isAuthenticating = signal(false);

  async ngOnInit() {
    // Configurar SEO para la página de landing
    this.seoService.setHomePageSEO();

    // Check if there's a hash in the URL (magic link or OAuth callback)
    const hash = window.location.hash;

    if (hash && (hash.includes('access_token') || hash.includes('type=magiclink'))) {
      await this.handleAuthCallback();
    }
  }

  private async handleAuthCallback() {
    try {
      this.isAuthenticating.set(true);

      // Wait for Supabase to process the hash and establish the session
      // The onAuthStateChange listener in the login service will handle the redirect
      // We just need to give it time to process
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Check if user is now authenticated
      if (this.loginService.isAuthenticated()) {
        // Clear the hash from URL for cleaner navigation
        window.history.replaceState(null, '', window.location.pathname);

        // The login service's onAuthStateChange will handle the redirect to dashboard
        // But we'll do it here as a fallback
        this.router.navigate(['/dashboard']);
      } else {
        // If authentication failed, clear the hash and show an error
        window.history.replaceState(null, '', window.location.pathname);
        console.error('Authentication failed - no session established');
      }
    } catch (error) {
      console.error('Error handling auth callback:', error);
      // Clear the hash even on error
      window.history.replaceState(null, '', window.location.pathname);
    } finally {
      this.isAuthenticating.set(false);
    }
  }

  onLogin() {
    // Navigate to the auth page
    this.router.navigate(['/auth']);
  }

  onStartTasting() {
    // Navigate directly to the coffee form without requiring login
    this.router.navigate(['/coffee/new']);
  }
}
