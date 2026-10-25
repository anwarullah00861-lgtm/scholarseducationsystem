import { Routes } from '@angular/router';
import { adminAuthGuard } from './core/guards/admin-auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./core/layout/public-layout/public-layout').then((module) => module.PublicLayout),
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./features/public/public.routes').then((module) => module.PUBLIC_ROUTES),
      },
    ],
  },
  {
    path: 'admin',
    canActivate: [adminAuthGuard],
    loadComponent: () =>
      import('./core/layout/admin-layout/admin-layout').then((module) => module.AdminLayout),
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./features/admin/admin.routes').then((module) => module.ADMIN_ROUTES),
      },
    ],
  },
  {
    path: '**',
    loadComponent: () =>
      import('./core/layout/public-layout/public-layout').then((module) => module.PublicLayout),
    children: [
      {
        path: '**',
        title: 'Page not found · Scholars Education System',
        loadComponent: () =>
          import('./features/public/not-found/not-found').then((module) => module.NotFound),
      },
    ],
  },
];
