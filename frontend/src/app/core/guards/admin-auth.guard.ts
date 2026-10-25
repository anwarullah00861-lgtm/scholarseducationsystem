import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * Guards admin routes until a valid access token is present.
 *
 * The backend enforces real authorization on every admin API call; this guard
 * only prevents the shell from being browsed without signing in.
 */
export const adminAuthGuard: CanActivateFn = (route) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  const childPath = route.firstChild?.routeConfig?.path ?? route.routeConfig?.path;

  if (childPath === 'login') {
    return true;
  }

  return auth.isAuthenticated() ? true : router.parseUrl('/admin/login');
};
