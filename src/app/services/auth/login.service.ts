import { inject, Injectable, signal } from '@angular/core';
import { AuthChangeEvent, Session, User } from '@supabase/supabase-js';
import { Router } from '@angular/router';
import { SupabaseService } from '../database/supabase.service';
import { PendingTastingService } from '../forms/pending-tasting.service';

export interface Profile {
  id?: string;
  username: string;
  website: string;
  avatar_url: string;
}

@Injectable({
  providedIn: 'root',
})
export class Login {
  private supabaseService = inject(SupabaseService);
  private router = inject(Router);
  private pendingTastingService = inject(PendingTastingService);

  // Reactive signals for auth state
  currentUser = signal<User | null>(null);
  currentSession = signal<Session | null>(null);
  isAuthenticated = signal<boolean>(false);
  isLoading = signal<boolean>(true);

  constructor() {
    this.initializeAuth();
  }

  private async initializeAuth() {
    // Get initial session
    const {
      data: { session },
    } = await this.supabaseService.client.auth.getSession();
    this.currentSession.set(session);
    this.currentUser.set(session?.user ?? null);
    this.isAuthenticated.set(!!session);
    this.isLoading.set(false);

    // Listen to auth changes
    this.supabaseService.client.auth.onAuthStateChange(async (event, session) => {
      this.currentSession.set(session);
      this.currentUser.set(session?.user ?? null);
      this.isAuthenticated.set(!!session);

      // Handle different auth events
      if (event === 'SIGNED_IN') {
        // Check if there's a pending tasting to complete
        const pendingTasting = await this.pendingTastingService.getPendingTasting();

        if (pendingTasting) {
          // Navigate to slides to complete the pending tasting
          this.router.navigate(['/slides']);
        } else {
          // No pending tasting, navigate to dashboard
          this.router.navigate(['/dashboard']);
        }
      } else if (event === 'SIGNED_OUT') {
        // Clear localStorage when user signs out
        this.clearLocalStorage();
        this.router.navigate(['/']);
      }
    });
  }

  get session() {
    return this.currentSession();
  }

  get user() {
    return this.currentUser();
  }

  // Sign in with email and password
  async signInWithPassword(email: string, password: string) {
    const { data, error } = await this.supabaseService.client.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  }

  // Sign up with email and password
  async signUp(email: string, password: string, metadata?: { username?: string }) {
    const { data, error } = await this.supabaseService.client.auth.signUp({
      email,
      password,
      options: {
        data: metadata,
      },
    });
    return { data, error };
  }

  // Sign in with magic link (OTP)
  async signInWithOtp(email: string) {
    const { data, error } = await this.supabaseService.client.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}`,
      },
    });
    return { data, error };
  }

  // Sign in with OAuth provider (Google, GitHub, etc.)
  async signInWithOAuth(provider: 'google' | 'github' | 'gitlab' | 'bitbucket') {
    const { data, error } = await this.supabaseService.client.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}`,
      },
    });
    return { data, error };
  }

  // Sign out
  async signOut() {
    const { error } = await this.supabaseService.client.auth.signOut();
    if (!error) {
      // Clear auth state signals
      this.currentSession.set(null);
      this.currentUser.set(null);
      this.isAuthenticated.set(false);

      // Clear all user data from localStorage
      this.clearLocalStorage();
    }
    return { error };
  }

  // Clear all user-related data from localStorage
  private clearLocalStorage() {
    // Clear pending coffee tasting form data
    localStorage.removeItem('pendingCoffeeTasting');

    // Clear any Supabase auth data (Supabase uses keys starting with 'sb-')
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('sb-')) {
        keysToRemove.push(key);
      }
    }

    // Remove all Supabase keys
    keysToRemove.forEach(key => localStorage.removeItem(key));

    // Optional: Clear all localStorage if you want a complete clean slate
    // localStorage.clear();
  }

  // Reset password
  async resetPassword(email: string) {
    const { data, error } = await this.supabaseService.client.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/callback?type=recovery`,
    });
    return { data, error };
  }

  // Update password
  async updatePassword(newPassword: string) {
    const { data, error } = await this.supabaseService.client.auth.updateUser({
      password: newPassword,
    });
    return { data, error };
  }

  // Get user profile from profiles table
  async getProfile(userId: string) {
    const { data, error } = await this.supabaseService.client
      .from('profiles')
      .select(`username, website, avatar_url`)
      .eq('id', userId)
      .single();
    return { data, error };
  }

  // Update user profile
  async updateProfile(userId: string, profile: Partial<Profile>) {
    const { data, error } = await this.supabaseService.client
      .from('profiles')
      .upsert({ id: userId, ...profile })
      .select()
      .single();
    return { data, error };
  }

  // Download avatar image
  async downloadImage(path: string) {
    const { data, error } = await this.supabaseService.client.storage
      .from('avatars')
      .download(path);
    return { data, error };
  }

  // Upload avatar image
  async uploadAvatar(userId: string, file: File) {
    const fileExt = file.name.split('.').pop();
    const filePath = `${userId}-${Math.random()}.${fileExt}`;

    const { data, error } = await this.supabaseService.client.storage
      .from('avatars')
      .upload(filePath, file);

    return { data, error, filePath };
  }

  // Auth state change listener
  authChanges(callback: (event: AuthChangeEvent, session: Session | null) => void) {
    return this.supabaseService.client.auth.onAuthStateChange(callback);
  }
}
