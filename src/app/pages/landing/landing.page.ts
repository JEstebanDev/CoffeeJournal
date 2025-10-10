import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './landing.page.html',
  styleUrl: './landing.page.css',
})
export class LandingPage {
  private authService = inject(AuthService);
  private router = inject(Router);

  // Signals from auth service
  isAuthenticated = this.authService.isAuthenticated;
  isLoading = this.authService.isLoading;

  onLogin() {
    // Use redirect for more reliable authentication
    this.authService.loginWithRedirect('/dashboard');
  }

  onStartTasting() {
    // Navigate directly to the coffee form without requiring login
    this.router.navigate(['/coffee/new']);
  }
}
