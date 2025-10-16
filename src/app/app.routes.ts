import { Routes } from '@angular/router';
import { LandingPage } from './pages/landing/landing.page';
import { DashboardPage } from './pages/dashboard/dashboard.page';
import { CoffeeDetailPage } from './pages/coffee-detail/coffee-detail.page';
import { AuthPage } from './pages/auth/auth.page';
import { SlidesPage } from './pages/slides/slides.page';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    component: LandingPage,
  },
  {
    path: 'auth',
    component: AuthPage,
  },
  {
    path: 'slides',
    component: SlidesPage,
  },
  {
    path: 'dashboard',
    component: DashboardPage,
    canActivate: [authGuard],
    children: [
      {
        path: 'coffee/new',
        component: SlidesPage,
      },
      {
        path: 'coffee/:id',
        component: CoffeeDetailPage,
      },
      {
        path: 'slides',
        component: SlidesPage,
      },
    ],
  },
  {
    path: 'coffee/new',
    component: SlidesPage,
  },
  {
    path: '**',
    redirectTo: '',
  },
];
