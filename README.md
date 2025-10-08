# CoffeeJournal

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 20.3.4.

## Authentication

This application uses **Auth0** for authentication. The authentication system includes:

### Features
- ✅ Login with Auth0 (redirect flow)
- ✅ Logout functionality
- ✅ Protected routes with authentication guard
- ✅ User profile data (name, email, picture)
- ✅ **Coffee cup icon as default avatar** when user has no profile picture
- ✅ Modern Angular signals for reactive state management
- ✅ New Angular control flow syntax (@if, @for)

### Configuration

Auth0 credentials are configured in:
- `src/environment/environment.ts` (development)
- `src/environment/environment.prod.ts` (production)

Current configuration:
- **Domain**: `dev-8ug0ksj0cil6iwit.us.auth0.com`
- **Client ID**: `MIxnuAIbwYtSQzoro9yEHKfq5qJU6mVp`
- **Redirect URI**: `window.location.origin` (automatically set)

### Authentication Flow

1. **Landing Page** (`/`): Public page with login button
2. **Login**: Redirects to Auth0 login page
3. **Callback** (`/callback`): Handles Auth0 redirect after successful login
4. **Dashboard** (`/dashboard`): Protected route, requires authentication

### User Avatar Display

The dashboard displays the user's profile picture from Auth0. The system includes intelligent handling for different image sources:

#### Google Profile Images
Google profile images come with a size parameter (e.g., `=s96-c`). The application automatically optimizes these images by requesting a higher resolution (`=s200-c`) for better display quality.

```typescript
// Automatic optimization in auth.service.ts
if (picture.includes('googleusercontent.com')) {
  return picture.replace(/=s\d+-c$/, '=s200-c');
}
```

#### Fallback Behavior
If no picture is available or if the image fails to load, a **coffee cup icon** is shown as the default avatar, keeping with the coffee theme of the application.

```html
@if (userPicture() && !imageLoadError()) {
  <img
    [src]="userPicture()"
    [alt]="userName()"
    class="user-profile-img"
    (error)="onImageError()"
  />
} @else {
  <!-- Coffee cup SVG icon -->
}
```

**Features:**
- ✅ Automatic size optimization for Google profile images
- ✅ Error handling with fallback to coffee icon
- ✅ Circular avatar with proper image cropping
- ✅ Responsive design

### Components

#### Auth Service (`src/app/services/auth.service.ts`)
Custom wrapper around Auth0 with Angular signals:
- `isAuthenticated()` - Signal for authentication state
- `isLoading()` - Signal for loading state
- `user()` - Signal for user data
- `userName()` - Computed signal for user name
- `userEmail()` - Computed signal for user email
- `userPicture()` - Computed signal for user picture (returns `null` if no picture)
- `loginWithRedirect()` - Login method
- `logout()` - Logout method

#### Auth Guard (`src/app/guards/auth.guard.ts`)
Protects routes that require authentication. Automatically redirects to Auth0 login if user is not authenticated.

### Usage Example

```typescript
import { Component, inject } from '@angular/core';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-example',
  template: `
    @if (isAuthenticated()) {
      <div class="user-info">
        @if (userPicture()) {
          <img [src]="userPicture()" [alt]="userName()" />
        } @else {
          <!-- Default coffee icon -->
        }
        <p>Welcome {{ userName() }}!</p>
      </div>
      <button (click)="logout()">Logout</button>
    } @else {
      <button (click)="login()">Login</button>
    }
  `
})
export class ExampleComponent {
  private authService = inject(AuthService);
  
  isAuthenticated = this.authService.isAuthenticated;
  userName = this.authService.userName;
  userPicture = this.authService.userPicture;
  
  login() {
    this.authService.loginWithRedirect();
  }
  
  logout() {
    this.authService.logout();
  }
}
```

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with Karma, run:

```bash
ng test
```

## Auth0 Setup (for new projects)

If you need to set up Auth0 from scratch:

1. Create an Auth0 account at https://auth0.com
2. Create a new Application (Single Page Application)
3. Configure Allowed Callback URLs: `http://localhost:4200/callback, https://yourdomain.com/callback`
4. Configure Allowed Logout URLs: `http://localhost:4200, https://yourdomain.com`
5. Configure Allowed Web Origins: `http://localhost:4200, https://yourdomain.com`
6. Update the environment files with your Auth0 domain and client ID

## Technologies Used

- **Angular 20** - Latest version with signals and new control flow
- **Auth0 Angular SDK** - Authentication library
- **TypeScript** - Type-safe development
- **RxJS** - Reactive programming with observables
- **Angular Signals** - Modern reactive state management

## UI/UX Features

- 🎨 Coffee-themed design with gradient colors
- ☕ Coffee cup icon as default user avatar
- 🌙 Dark theme with glassmorphism effects
- 📱 Responsive design
- ⚡ Fast and reactive with Angular signals
- 🔒 Secure authentication with Auth0
