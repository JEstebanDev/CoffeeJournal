import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Login } from '../../services/auth';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './auth.page.html',
  styleUrl: './auth.page.css',
})
export class AuthPage {
  private loginService = inject(Login);
  private router = inject(Router);

  // UI state
  isLogin = signal(true);
  isLoading = signal(false);
  errorMessage = signal('');
  successMessage = signal('');

  // Form data
  email = signal('');
  password = signal('');
  confirmPassword = signal('');
  username = signal('');

  toggleMode() {
    this.isLogin.update((v) => !v);
    this.errorMessage.set('');
    this.successMessage.set('');
  }

  async onSubmit() {
    this.errorMessage.set('');
    this.successMessage.set('');
    this.isLoading.set(true);

    try {
      if (this.isLogin()) {
        await this.handleLogin();
      } else {
        await this.handleSignup();
      }
    } catch (error: any) {
      this.errorMessage.set(error.message || 'An error occurred');
    } finally {
      this.isLoading.set(false);
    }
  }

  private async handleLogin() {
    const { data, error } = await this.loginService.signInWithPassword(
      this.email(),
      this.password()
    );

    if (error) {
      this.errorMessage.set(error.message);
      return;
    }

    if (data.session) {
      this.successMessage.set('Login successful! Redirecting...');
      setTimeout(() => this.router.navigate(['/dashboard']), 1000);
    }
  }

  private async handleSignup() {
    if (this.password() !== this.confirmPassword()) {
      this.errorMessage.set('Passwords do not match');
      return;
    }

    if (this.password().length < 6) {
      this.errorMessage.set('Password must be at least 6 characters');
      return;
    }

    const { data, error } = await this.loginService.signUp(this.email(), this.password(), {
      username: this.username(),
    });

    if (error) {
      this.errorMessage.set(error.message);
      return;
    }

    this.successMessage.set('Account created! Please check your email to verify your account.');
  }

  async signInWithMagicLink() {
    if (!this.email()) {
      this.errorMessage.set('Please enter your email');
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set('');

    const { error } = await this.loginService.signInWithOtp(this.email());

    this.isLoading.set(false);

    if (error) {
      this.errorMessage.set(error.message);
      return;
    }

    this.successMessage.set('¡Enlace enviado! Revisa tu correo para continuar tu viaje cafetero.');
  }

  goBack() {
    this.router.navigate(['/']);
  }
}
