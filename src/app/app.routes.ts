import { Routes } from '@angular/router';
import { LandingPage } from './pages/landing/landing.page';
import { DashboardPage } from './pages/dashboard/dashboard.page';
import { CallbackPage } from './pages/callback/callback.page';
import { CoffeeFormComponent } from './pages/coffee-form/coffee-form.component';
import { CoffeeDetailPage } from './pages/coffee-detail/coffee-detail.page';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    component: LandingPage,
  },
  {
    path: 'callback',
    component: CallbackPage,
  },
  {
    path: 'dashboard',
    component: DashboardPage,
    canActivate: [authGuard],
    children: [
      {
        path: 'coffee/new',
        component: CoffeeFormComponent,
      },
      {
        path: 'coffee/:id',
        component: CoffeeDetailPage,
      },
    ],
  },
  {
    path: 'coffee/new',
    component: CoffeeFormComponent,
  },
  {
    path: '**',
    redirectTo: '',
  },
];