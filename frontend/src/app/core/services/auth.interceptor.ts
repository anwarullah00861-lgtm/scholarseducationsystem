import { HttpEvent, HttpHandlerFn, HttpRequest, HttpResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from './auth.service';

/**
 * Automatically refreshes the access token when the API returns 401.
 *
 * The refresh token lives in an HttpOnly cookie (path `/auth`), so the browser
 * sends it with every same-origin POST to /auth/refresh. On success the new
 * access token is stored and the failed request is retried. If refresh fails
 * the session is cleared and the user is redirected to the admin login page.
 */
export function authInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn) {
  const auth = inject(AuthService);
  const router = inject(Router);
  let refreshing = false;

  return next(req).pipe(
    catchError((error) => {
      if (error?.status !== 401 || refreshing) {
        return throwError(() => error);
      }

      // Only refresh for API calls; static asset 401s are not recoverable.
      if (!req.url.startsWith('http') && !req.url.startsWith('/auth')) {
        return throwError(() => error);
      }

      refreshing = true;

      return auth.refresh().pipe(
        switchMap(() => {
          refreshing = false;
          return next(req);
        }),
        catchError((refreshError) => {
          refreshing = false;
          auth.clear();
          void router.navigateByUrl('/admin/login');
          return throwError(() => refreshError);
        }),
      );
    }),
  );
}
