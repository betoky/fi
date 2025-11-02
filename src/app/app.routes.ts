import { Routes } from '@angular/router';
import { noAuthGuard } from './guards/no-auth-guard';

export const routes: Routes = [
  {
    path: 'login',
    canActivate: [noAuthGuard],
    loadComponent: () => import('./pages/login/login').then(m => m.Login)
  },
  {
    path: 'confirm',
    loadComponent: () => import('./pages/confirm-profile/confirm-profile').then(m => m.ConfirmProfile)
  },
  {
    path: '',
    loadComponent: () => import('./components/main-layout/main-layout').then(m => m.MainLayout),
    children: [
      {
        path: '',
        loadComponent: () => import('./pages/dashboard/dashboard').then(m => m.Dashboard)
      }
    ]
  }
];
