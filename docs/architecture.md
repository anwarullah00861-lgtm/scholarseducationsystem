# Architecture — Scholars Education System

This document describes the Phase 1 frontend architecture and the intended shape of
later phases. Anything marked **planned** or **proposed** is not implemented yet.

---

## 1. Goals and boundaries

### Phase 1 goals
- A credible, responsive public website for a PG–Class 8 school in Miran Shah.
- A reusable design system that later modules can inherit.
- An admin workspace shell that makes the future module map visible.
- Honest content states: never invent contact details, social links, book titles,
  forms, videos or statistics.
- A build that is easy to extend with a real API in Phase 2.

### Explicit non-goals for Phase 1
- No authentication, sessions or role checks.
- No database, API, file storage or PDF generation.
- No collection or storage of personal data.
- No claim that placeholder admin modules are functional.

---

## 2. Runtime architecture (Phase 1)

```
Browser
  └── Angular SPA (static files)
        ├── PublicLayout ── PublicHeader / RouterOutlet / PublicFooter
        │     └── lazy public pages
        └── AdminLayout ─── sidebar / topbar / preview banner / RouterOutlet
              ├── lazy dashboard (Chart.js)
              └── lazy placeholder modules
```

There is no server-side application in this phase. The production build is a set of
static assets in `frontend/dist/frontend` and must be served with SPA fallback so
deep links such as `/admin/students` return `index.html`.

---

## 3. Frontend structure

```
src/app/
├── core/
│   ├── config/
│   │   ├── site.config.ts        # school identity, navigation, empty contact slots
│   │   └── admin-nav.config.ts   # admin sidebar groups
│   ├── layout/
│   │   ├── public-layout/        # skip link + header + outlet + footer
│   │   ├── public-header/        # sticky header, desktop + mobile navigation
│   │   ├── public-footer/
│   │   └── admin-layout/         # Material sidenav shell
│   ├── models/
│   └── services/
│       └── theme.service.ts      # light / dark / system preference
├── features/
│   ├── public/                   # one folder per public page + routes + 404
│   └── admin/                    # dashboard, placeholder component, routes
├── shared/components/            # logo, icon, theme toggle, page hero, etc.
├── app.routes.ts                 # top-level lazy route tree
├── app.config.ts                 # router, animations, Material defaults
└── app.ts                        # root component
```

### Layering rules
- `features/*` may import from `shared/*` and `core/*`.
- `shared/*` must not import feature pages.
- Cross-cutting configuration belongs in `core/config`, not inside page components.
- Public and admin shells are kept separate so the admin workspace can later gain
  guards, a different navigation model and its own data services without touching
  public pages.

---

## 4. Routing

### Top-level tree
1. `''` → `PublicLayout` → `PUBLIC_ROUTES`
2. `'admin'` → `AdminLayout` → `ADMIN_ROUTES`
3. `'**'` → `PublicLayout` → 404 page

The wildcard is registered **after** `/admin` and is **not** a child of the public
layout's empty path. An earlier version placed `**` inside `PUBLIC_ROUTES`, which
caused `/admin` to render the public 404 page. `app.routes.spec.ts` now guards this
ordering so the regression cannot return.

### Lazy loading
Every page and both layouts are lazy-loaded. The admin dashboard is the only route
that pulls in Chart.js, keeping the initial public bundle small.

### Route titles
Each route sets an Angular `title`, producing document titles such as
`Admissions · Scholars Education System` and `Dashboard · Scholars Admin`.

---

## 5. Design system

### Tokens
`src/styles/_tokens.scss` defines brand, surface, text, spacing, radius, shadow,
motion and layout tokens. Light is the default; dark overrides are applied through
`html[data-theme='dark']`.

### Material theme
`src/styles.scss` configures Angular Material's Material 3 theme with green primary
and yellow tertiary palettes. Material system tokens use `light-dark()`, driven by
`color-scheme`, so Material components follow the same theme as the custom tokens.

### Shared UI
- `app-logo` — wordmark/crest with light and dark variants.
- `app-icon` — typed Lucide icon wrapper and `IconName` union.
- `app-theme-toggle` — accessible menu for light/dark/system.
- `app-mobile-nav-dialog` — full-height mobile navigation.
- `app-page-hero`, `app-section-heading`, `app-stat-card` — consistent page sections.
- Global utilities for containers, sections, buttons, links and prose.

### Accessibility baseline
- Skip link and semantic landmarks.
- Visible `:focus-visible` outlines.
- One `<h1>` per page.
- Labelled navigation regions and icon buttons.
- `prefers-reduced-motion` handling.
- Decorative elements marked `aria-hidden`.
- No unlabelled form controls in Phase 1 (admission forms are not implemented).

---

## 6. Theming flow

1. Before Angular loads, an inline script in `index.html` reads `ses.theme` and sets
   `data-theme` + `color-scheme` to avoid a flash of the wrong theme.
2. `ThemeService` reads the stored preference, otherwise defaults to `system`.
3. It applies the resolved theme to `<html>` and updates the `theme-color` meta tag.
4. In system mode it listens for operating-system color-scheme changes.
5. `setPreference()` persists explicit choices to `localStorage`.
6. The dashboard chart re-renders when the resolved theme changes so axis and grid
   colours follow the palette.

Storage is wrapped in `try/catch` because private browsing or embedded webviews may
block `localStorage`; the session still works without persistence.

---

## 7. Data and content boundaries

Phase 1 has no school data. This is intentional and visible in the UI.

- `SITE.contact` values are `null`; `SITE.socialLinks` is empty. Components hide or
  replace these with explicit “to be confirmed” guidance.
- Admission information describes the intended process but provides no submitting
  form.
- Resource and Iqbal Series pages describe future libraries without inventing titles.
- Dashboard statistics use `—` or configured facts; the only chart is labelled
  **Sample data**.
- Admin module pages display phase labels and delivered/planned feature lists rather
  than fake records.

When real content arrives, it should be supplied by an API rather than hard-coded in
page templates.

---

## 8. Backend architecture (Phase 2 — implemented)

### Services
```
Angular SPA  ──HTTPS/JSON──>  NestJS API  ──>  PostgreSQL (Prisma)
                                     │
                                     └── (later) object storage, background jobs
```

### NestJS modules
| Module | Responsibility | Status |
| --- | --- | --- |
| `AuthModule` | Login, rotating refresh sessions, logout, `/auth/me`, JWT + roles guards | implemented |
| `ContentModule` | Admin announcement CRUD (`/admin/content/announcements`) | implemented |
| `ContactsModule` | Public `POST /contact`, admin inbox `GET/PATCH /admin/contacts` | implemented |
| `UsersModule` | Staff accounts, roles, password reset | planned (Phase 3) |
| `AdmissionsModule` … `FilesModule` | See roadmap below | planned |

### Prisma models (implemented)
- `User` (uuid id, unique email, bcrypt `passwordHash`, `Role` enum
  `SUPER_ADMIN | ADMIN | STAFF`, `status` string with `active` gate at login and
  token validation).
- `RefreshToken` (userId FK, `tokenHash`, `expiresAt`, `revoked`; cascade delete).
- `Announcement`, `ContactMessage`.
- Migrations live in `prisma/migrations` as plain SQL; the initial migration
  creates the enum, tables, foreign key and indexes.

### Authentication flow
1. `POST /auth/login` (throttled 10/min) validates the DTO, compares the bcrypt
   password hash, rejects non-`active` users, returns a short-lived JWT
   (`sub`, `email`, `role`) in the body and sets a 48-byte random refresh token
   as an `HttpOnly`, `SameSite=Lax`, `Path=/auth`, `Secure` (production) cookie.
2. The refresh token is stored **hashed** (SHA-256) in `RefreshToken`; the raw
   value never touches the database.
3. `POST /auth/refresh` rotates: a new token is issued and the presented token
   row is revoked. Presenting an already-revoked/unknown token fails, which
   detects reuse.
4. `POST /auth/logout` revokes the presented token and clears the cookie.
5. `GET /auth/me` returns the JWT-derived profile and permissions.

### Authorization model
- `JwtAuthGuard` verifies the bearer token and re-reads the user from the
  database on every request (status + existence re-check), then attaches
  role-derived permissions.
- `RolesGuard` + `@Roles({ roles, permissions })` enforce deny-by-default RBAC
  on every admin controller; `SUPER_ADMIN` holds the `*` wildcard permission.
- Angular's `adminAuthGuard` only shapes navigation; the API is authoritative.

### Security controls
- Joi-validated environment (`JWT_SECRET` ≥ 32 chars, `DATABASE_URL` required).
- Helmet headers, CORS restricted to `CORS_ORIGIN` with credentials,
  global `ValidationPipe` (`whitelist` + `forbidNonWhitelisted`),
  `AllExceptionsFilter` that never leaks internals, throttling (global plus
  stricter per-route limits on login and the contact form).

---

## 9. Future module behaviour

### Admissions
- 3–4 selectable form templates.
- A4 print preview and server-generated PDF.
- Draft → submitted → under review → accepted/waitlisted/rejected workflow.
- Applicant search, filters and exports restricted by role.
- Personal data access audited.

### Students and reports
- Profiles, guardians, class/section enrolment and history.
- Statistics by class level, gender and status.
- Growth charts using Chart.js from aggregated API data.
- Printable/exportable school reports.

### Examinations
- Separate Midterm and Final terms.
- Subject-level marks, grade calculation and report cards.
- Controlled publication to families, with correction history.

### Resources and Iqbal Series
- Admin uploads PDFs with metadata and draft/published states.
- In-browser viewing plus controlled downloads.
- Iqbal Series titles stay unpublished until the school confirms them.

### Media
- Curated video records and official social links.
- Safe external-link handling and enable/disable controls.

### Android integration
- Consume the same authenticated REST API.
- Prefer token-based mobile auth with device revocation.
- Keep admin-only functions out of the public app surface.

---

## 10. Quality gates and testing

Frontend checks (run from `frontend/`):

```bash
npm run build
npm run test:ci
npm run format:check
```

Backend checks (run from `backend/`):

```bash
npm run build          # NestJS production build (tsc)
npm test               # Jest unit tests
npx prisma generate    # Prisma Client generation
npx prisma migrate deploy   # requires a reachable DATABASE_URL
```

Current automated coverage:
- `theme.service.spec.ts` — default/system resolution, persistence, restoration and
  OS theme changes.
- `app.routes.spec.ts` — wildcard ordering, admin guard registration, public and
  admin route inventories.
- `app.spec.ts` — root component creation.
- `auth.service.spec.ts` — login (success/unknown email/wrong password/suspended
  account), refresh rotation, expired/unknown token rejection, logout revocation.
- `jwt-auth.guard.spec.ts` — missing/invalid token, deleted user, suspended user,
  permission attachment incl. `*` wildcard.
- `roles.guard.spec.ts` — deny-by-default RBAC for staff/admin/super-admin.
- `content.service.spec.ts` — announcement CRUD against a mocked Prisma service.
- `login.dto.spec.ts` — email/password validation rules.
- `app.controller.spec.ts` — health endpoint payload.

Manual verification performed at a 693 px viewport (Phase 1):
- all public and admin routes render the correct page and title;
- `/admin` no longer falls through to the public 404;
- mobile navigation opens, navigates and closes;
- theme switches between light/dark and persists across reloads;
- dashboard chart renders and re-themes;
- no horizontal overflow and no unlabelled controls.

### Recommended additions in later phases
- API contract tests and database integration tests against a live PostgreSQL.
- End-to-end tests (Playwright) for sign-in, admissions and result publication.
- Accessibility checks in CI (axe) and visual regression for key pages.

---

## 11. Deployment notes

Deployment is prepared but **not performed** — see
[deployment.md](deployment.md) for the architecture, required credentials and
current blockers. Summary:

- Angular builds to `frontend/dist/frontend/browser`; `firebase.json` serves it
  on Firebase Hosting with SPA fallback, cache headers and `cleanUrls`.
- Firebase Hosting cannot run NestJS. The API targets Cloud Run (recommended)
  or Cloud Functions gen-2 with a serverless adapter; PostgreSQL stays on a
  managed database (never Firestore without approval).
- Serve over HTTPS (enforced by Firebase Hosting and the API platform).
- Set `CORS_ORIGIN` to the exact Hosting origin; cookies become `Secure` when
  `NODE_ENV=production`.
- **A client-side route guard alone is not security.** The NestJS guards are
  the boundary; they reject any admin request without a valid JWT regardless
  of what the frontend does.
- No secrets, database credentials, JWT secrets or service-account keys are
  stored in this repository; use `.env` locally (git-ignored) and secret
  management in production.

---

## 12. Key decisions and trade-offs

| Decision | Reason |
| --- | --- |
| Angular 21 instead of 22 | Local Node v24.14.0 does not satisfy Angular CLI 22's `^24.15.0` requirement |
| Standalone components + signals | Current Angular direction; simpler composition and state |
| Angular Material + custom tokens | Accessible primitives with a distinctive school identity |
| `@lucide/angular` | Maintained package; the older `lucide-angular` is deprecated |
| Chart.js lazy-loaded | Keeps the public site's initial bundle small |
| Centralised `site.config.ts` | Prevents invented contact/social data and simplifies later API wiring |
| Unauthenticated admin preview | Lets the school review the workspace layout before Phase 2 investment |
| Separate public/admin layouts | Clean foundation for guards, roles and admin-only services |
