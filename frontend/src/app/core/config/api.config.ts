/**
 * API base URL resolution.
 *
 * - In local development the NestJS API runs on http://localhost:3000 while the
 *   Angular dev server runs on port 4200, so requests are sent cross-origin.
 * - In production the deployment rewrites `/auth/*` and `/api/*` to the backend
 *   (see docs/deployment.md), so relative URLs are correct and stay same-origin,
 *   which keeps the refresh-token cookie behaviour simple.
 *
 * No secrets belong here — everything in the Angular bundle is public.
 */
const DEV_API_BASE = 'http://localhost:3000';

const isLocalhost =
  typeof window !== 'undefined' &&
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

export const API_BASE_URL = isLocalhost ? DEV_API_BASE : '';
