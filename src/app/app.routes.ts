import { Routes } from '@angular/router';
import { noAuthGuard } from './guards/no-auth-guard';
import { profileGuard } from './guards/profile-guard';

export const routes: Routes = [
  {
    path: 'login',
    canActivate: [noAuthGuard],
    loadComponent: () => import('./pages/login/login').then((m) => m.Login),
  },
  {
    path: 'confirm',
    loadComponent: () =>
      import('./pages/confirm-profile/confirm-profile').then((m) => m.ConfirmProfile),
  },
  {
    path: '',
    canActivateChild: [profileGuard],
    loadComponent: () => import('./components/main-layout/main-layout').then((m) => m.MainLayout),
    children: [
      {
        path: 'dashboard', pathMatch: 'full',
        loadComponent: () => import('./pages/dashboard/dashboard').then((m) => m.Dashboard),
      },
      {
        path: 'expenses',
        loadComponent: () => import('./pages/expenses/expenses').then((m) => m.Expenses),
      },
      {
        path: 'banking-transactions',
        loadComponent: () => import('./pages/bank/bank').then((m) => m.Bank),
      },
      {
        path: 'investments',
        loadComponent: () => import('./pages/investments/investments').then((m) => m.Investments),
      },
      {
        path: '**',
        redirectTo: '/dashboard',
      },
    ],
  },
];
