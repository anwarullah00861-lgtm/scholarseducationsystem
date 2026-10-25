# Deployment Guide (Phase 2)

This document describes the intended deployment architecture for the Scholars
Education System and exactly what is required to deploy it. **No deployment has
been performed yet** — see [Current status](#current-status) for the blockers.

## Architecture

```
┌─────────────────────────────┐        ┌──────────────────────────────┐
│ Firebase Hosting            │        │ NestJS API (Cloud Run or     │
│ Angular SPA (static files)  │───────▶│ Cloud Functions gen-2)       │
│ SPA rewrites → index.html   │  /auth │ TLS, CORS, cookie auth       │
└─────────────────────────────┘  /api  └──────────────┬───────────────┘
                                                      │ DATABASE_URL
                                                      ▼
                                       ┌──────────────────────────────┐
                                       │ Managed PostgreSQL           │
                                       │ (Cloud SQL / Neon / Supabase)│
                                       └──────────────────────────────┘
```

### Frontend → Firebase Hosting

Firebase Hosting serves the compiled Angular app (`frontend/dist/frontend/browser`)
as static files with SPA rewrites. Hosting cannot execute the NestJS server;
this is configured in `firebase.json`.

### Backend → Cloud Run (recommended) or Cloud Functions gen-2

Firebase Hosting does not run NestJS. The API must run elsewhere:

- **Cloud Run (recommended)** — NestJS calls `app.listen()`, which maps cleanly
  to a long-lived container. Session cookies and connection pooling behave the
  same as local development.
- **Cloud Functions gen-2 (possible, with caveats)** — NestJS can run behind the
  `@nestjs/platform-express` serverless adapter, but a plain `listen()` app must
  be wrapped (e.g. `serverless-http`) or bootstrapped with `NestFactory.create`
  per cold start. Long-lived DB connections from many function instances can
  exhaust PostgreSQL connection limits; use PgBouncer or a pooled connection
  string (most managed Postgres providers offer `?pgbouncer=true` style URLs).

Once the API has a URL, add a Hosting rewrite so the browser calls it
same-origin (keeps `SameSite` cookies simple):

```json
{ "source": "/api/**", "run": { "serviceId": "scholars-api", "region": "europe-west1" } }
{ "source": "/auth/**", "run": { "serviceId": "scholars-api", "region": "europe-west1" } }
```

### Database → managed PostgreSQL

PostgreSQL stays on a managed database service (Cloud SQL, Neon, Supabase, …).
Do **not** replace it with Firestore — the Prisma schema and SQL migrations are
PostgreSQL-specific.

## Production configuration

| Variable | Source | Notes |
| --- | --- | --- |
| `DATABASE_URL` | Secret Manager / platform secrets | Managed Postgres, TLS mode required |
| `JWT_SECRET` | Secret Manager | ≥ 32 random chars, generated per environment |
| `CORS_ORIGIN` | Platform env var | Exact origin of the Firebase Hosting site, e.g. `https://<project>.web.app` |
| `NODE_ENV` | Platform env var | `production` enables `Secure` cookies |
| `REFRESH_TOKEN_EXPIRES_DAYS` | Optional | Default 14 |

Security behaviour already implemented in the backend:

- Refresh token cookie: `HttpOnly`, `SameSite=Lax`, `Path=/auth`,
  `Secure` when `NODE_ENV=production`, HTTPS enforced by Firebase Hosting and
  Cloud Run.
- CORS with `credentials: true` restricted to `CORS_ORIGIN`.
- Helmet security headers, DTO validation (`whitelist` + `forbidNonWhitelisted`),
  login throttling (10/min), contact-form throttling (5/min).

## Required credentials / steps to deploy

Deployment is blocked until these are available:

1. **Firebase project** — a project ID (e.g. `scholars-education-xxxx`).
2. **Firebase CLI credentials** — either `firebase login` on the deploy machine
   or a CI service account with Firebase Hosting Admin + (if used) Cloud Run
   Invoker roles. No service-account keys are stored in this repository.
3. **`.firebaserc`** — copy `.firebaserc.example` to `.firebaserc` and set the
   real project ID (or run `firebase use --add`).
4. **Managed PostgreSQL instance** with a `DATABASE_URL` for production, plus
   `npx prisma migrate deploy` to apply `prisma/migrations`.
5. **Backend hosting target** — decide Cloud Run vs Functions gen-2, build the
   container/entrypoint, and set the secrets above.
6. **Build** — `npm run build` in `frontend/` before `firebase deploy --only hosting`.

## Current status

| Step | Status |
| --- | --- |
| Angular build + tests | ✅ passing locally |
| Backend build + tests | ✅ passing locally |
| Prisma Client generation | ✅ working |
| Firebase CLI installed | ✅ `firebase-tools` 15.34.1 |
| Firebase credentials | ✅ logged in (CI-style device flow; no keys stored in the repo) |
| Firebase project ID | ✅ `scholarseducationsystem-a6a4f` |
| **Angular frontend → Firebase Hosting** | ✅ **deployed** — <https://scholarseducationsystem-a6a4f.web.app> (44 files; SPA fallback verified for `/admin`, `/admin/login`, `/contact`) |
| NestJS backend hosting | ❌ not provisioned (Cloud Run or Functions decision pending) |
| Production database | ❌ no managed PostgreSQL provisioned — `prisma migrate deploy` not run |

### Remaining blockers for the API

1. Choose and provision backend hosting (Cloud Run recommended; see
   [Architecture](#architecture)).
2. Provision managed PostgreSQL and set `DATABASE_URL`.
3. Set `JWT_SECRET` (≥ 32 random chars) and `CORS_ORIGIN=https://scholarseducationsystem-a6a4f.web.app`
   as secrets, then add the `/auth/**` and `/api/**` Hosting rewrites so the
   login flow works end-to-end.

Until then, the deployed site is fully browsable, but `/admin/login` cannot
authenticate — that is expected, not a regression. No deployment URL is claimed
beyond what Firebase confirmed above.
