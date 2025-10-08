import { Injectable, inject, computed } from '@angular/core';
import { AuthService as Auth0Service } from '@auth0/auth0-angular';
import { Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private auth0 = inject(Auth0Service);
  private router = inject(Router);

  // Convert observables to signals
  isAuthenticated = toSignal(this.auth0.isAuthenticated$, { initialValue: false });
  isLoading = toSignal(this.auth0.isLoading$, { initialValue: true });
  user = toSignal(this.auth0.user$, { initialValue: null });
  error = toSignal(this.auth0.error$, { initialValue: null });

  // Computed signals
  userName = computed(() => {
    const user = this.user();
    return user?.given_name || user?.name || user?.nickname || 'Usuario';
  });

  userEmail = computed(() => {
    const user = this.user();
    return user?.email || '';
  });

  userPicture = computed(() => {
    const user = this.user();
    const picture = user?.picture;

    if (!picture || picture.trim() === '') {
      return null;
    }

    // Optimize Google profile images by adjusting size parameter
    if (picture.includes('googleusercontent.com')) {
      return picture.replace(/=s\d+-c$/, '=s200-c');
    }

    return picture;
  });

  /**
   * Login with redirect
   */
  loginWithRedirect(redirectPath: string = '/dashboard'): void {
    this.auth0
      .loginWithRedirect({
        appState: { target: redirectPath },
      })
      .subscribe();
  }

  /**
   * Login with popup
   */
  loginWithPopup(): void {
    this.auth0.loginWithPopup().subscribe({
      next: () => {
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        console.error('Login error:', err);
      },
    });
  }

  /**
   * Logout
   */
  logout(): void {
    this.auth0
      .logout({
        logoutParams: {
          returnTo: window.location.origin,
        },
      })
      .subscribe();
  }

  /**
   * Get access token
   */
  getAccessToken() {
    return this.auth0.getAccessTokenSilently();
  }

  /**
   * Handle authentication callback
   */
  handleAuthCallback(): void {
    this.auth0.appState$.subscribe((appState) => {
      const target = appState?.target || '/dashboard';
      this.router.navigate([target]);
    });
  }
}
