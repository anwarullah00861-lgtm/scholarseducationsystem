import { PUBLIC_ROUTES } from './features/public/public.routes';
import { ADMIN_ROUTES } from './features/admin/admin.routes';
import { adminAuthGuard } from './core/guards/admin-auth.guard';
import { routes } from './app.routes';

describe('application routes', () => {
  it('keeps the public wildcard out of the public layout children', () => {
    // A nested `**` under the empty-path public layout would intercept /admin
    // before the top-level admin route is reached.
    expect(PUBLIC_ROUTES.some((route) => route.path === '**')).toBe(false);
  });

  it('registers the admin workspace before the top-level wildcard', () => {
    const adminIndex = routes.findIndex((route) => route.path === 'admin');
    const wildcardIndex = routes.findIndex((route) => route.path === '**');

    expect(adminIndex).toBeGreaterThanOrEqual(0);
    expect(wildcardIndex).toBeGreaterThan(adminIndex);
  });

  it('protects the admin workspace with the authentication guard', () => {
    const adminRoute = routes.find((route) => route.path === 'admin');

    expect(adminRoute?.canActivate).toEqual([adminAuthGuard]);
  });

  it('exposes every public page and all admin modules', () => {
    const publicPaths = PUBLIC_ROUTES.map((route) => route.path);
    const adminPaths = ADMIN_ROUTES.map((route) => route.path);

    expect(publicPaths).toEqual([
      '',
      'about',
      'academics',
      'admissions',
      'admissions/apply',
      'admissions/apply/success',
      'resources',
      'iqbal-series',
      'media',
      'contact',
    ]);
    expect(adminPaths).toEqual([
      'login',
      '',
      'admissions',
      'admissions/:id',
      'students',
      'examinations',
      'content',
      'resources',
      'iqbal-series',
      'media',
      'reports',
      'settings',
    ]);
  });
});
