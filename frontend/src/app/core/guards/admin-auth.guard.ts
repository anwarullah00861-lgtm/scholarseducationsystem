import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * Guards admin routes until a valid access token is present.
 *
 * The backend enforces real authorization on every admin API call; this guard
 * only prevents the shell from being browsed without signing in.
 */
export const adminAuthGuard: CanActivateFn = (_route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  // The login route is a grandchild (admin → '' → login), so checking
  // route.firstChild never matched 'login' and caused an infinite redirect
  // loop. Inspect the target URL instead.
  if (state.url.startsWith('/admin/login')) {
    return true;
  }

  return auth.isAuthenticated() ? true : router.parseUrl('/admin/login');
};
