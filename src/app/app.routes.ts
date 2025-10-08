import { Routes } from '@angular/router';
import { LandingPage } from './pages/landing/landing.page';
import { DashboardPage } from './pages/dashboard/dashboard.page';
import { CallbackPage } from './pages/callback/callback.page';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    component: LandingPage
  },
  {
    path: 'callback',
    component: CallbackPage
  },
  {
    path: 'dashboard',
    component: DashboardPage,
    canActivate: [authGuard]
  },
  {
    path: '**',
    redirectTo: ''
  },
];
