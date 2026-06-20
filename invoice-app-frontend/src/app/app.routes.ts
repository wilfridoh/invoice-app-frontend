import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'users', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: '',
    canActivate: [authGuard],
    children: [
      {
        path: 'users',
        loadComponent: () =>
          import('./features/users/list/list.component').then(m => m.ListComponent)
      },
      {
        path: 'users/new',
        loadComponent: () =>
          import('./features/users/form/form.component').then(m => m.FormComponent)
      },
      {
        path: 'users/:id/edit',
        loadComponent: () =>
          import('./features/users/form/form.component').then(m => m.FormComponent)
      }
    ]
  },
  { path: '**', redirectTo: 'users' }
];
