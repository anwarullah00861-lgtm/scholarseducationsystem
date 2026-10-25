# Scholars Education System — School Website

A school website and admin workspace for **Scholars Education System**, Miran Shah,
North Waziristan, Khyber Pakhtunkhwa, Pakistan.

The school serves **PG, Nursery, Prep and Classes 1–8**.

> **Current status: Phase 2 complete — frontend deployed, backend pending.**
> The public website, admin workspace, NestJS API, PostgreSQL schema and
> cookie-based authentication with RBAC are built and tested.
> **The Angular frontend is deployed to Firebase Hosting at
> <https://scholarseducationsystem-a6a4f.web.app>** (project `scholarseducationsystem-a6a4f`).
> The NestJS API is **not yet deployed** — sign-in on the live site cannot work
> until the backend has a hosted URL (see
> [docs/deployment.md](docs/deployment.md)).
> The admission application module (public submission with document uploads,
> admin listing and status workflow) is implemented on top of Phase 2.

---

## What is included

### Phase 1 — public website and admin shell

### Public website
- Responsive layout with a utility bar, sticky header, desktop navigation, mobile
  navigation dialog, footer and skip link.
- Pages: Home, About, Academics, Admissions, Resources, Iqbal Series, Media, Contact
  and a styled 404 page.
- Clear, honest preview states for content the school has not supplied yet:
  - no invented phone numbers, email addresses, office hours, social links or videos;
  - no admission form that pretends to submit;
  - no book titles for the Iqbal Series until they are confirmed.
- Light, dark and system theme modes with saved preference and no flash on load.
- Design-token system, Material 3 theme, responsive grids and reduced-motion support.

### Admin workspace shell
- `/admin` dashboard with readiness checklist, quick actions, stat cards and a
  Chart.js sample chart (clearly labelled sample data).
- Sidebar navigation and placeholder module pages for admissions, students,
  examinations, website content, e-books, Iqbal Series, media, reports and settings.
- Persistent Phase 1 preview banner making the absence of sign-in and live data clear.

### Deliberately **not** included yet
- Admission applications, uploads, A4 print/PDF output.
- Student records, live statistics, reports or examination results.
- Real e-book files, videos, social links or downloadable forms.
- File storage and PDF generation.
- A seeded production user — admin accounts are created deliberately, never
  committed as seed data.

### Phase 2 — NestJS backend, database and authentication
- NestJS 11 API with Prisma + PostgreSQL (schema, SQL migration, dev database
  via `docker-compose.yml`).
- Secure cookie-based auth: `POST /auth/login`, `POST /auth/refresh` (rotating,
  HttpOnly cookie, reuse prevention), `POST /auth/logout`, `GET /auth/me`.
- Refresh tokens stored as SHA-256 hashes; passwords hashed with bcrypt.
- RBAC (`SUPER_ADMIN` / `ADMIN` / `STAFF`) enforced server-side with JWT and
  roles guards on every admin endpoint.
- Admin APIs: announcement CRUD under `/admin/content/announcements`;
  contact-message inbox under `/admin/contacts`;
  admission applications under `/admissions` (public submission with file
  uploads, duplicate check, paginated admin listing and status workflow).
- Public `POST /contact` endpoint with strict DTO validation and rate limiting.
- Environment validation (Joi), helmet headers, CORS restricted to the configured
  origin, global exception filter, login throttling.
- Angular admin login page at `/admin/login` plus a route guard; the backend
  remains the real security boundary.

See [docs/architecture.md](docs/architecture.md) for the detailed design and roadmap,
and [docs/deployment.md](docs/deployment.md) for the deployment plan and blockers.

---

## Tech stack

| Layer | Choice |
| --- | --- |
| Frontend framework | Angular 21 (standalone components, signals) |
| Language | TypeScript 5.9 |
| Styling | SCSS + Angular Material 21 (Material 3 theme) |
| Icons | `@lucide/angular` |
| Charts | Chart.js 4 (lazy-loaded with the admin dashboard) |
| Fonts | Manrope Variable + Fraunces Variable (self-hosted via Fontsource) |
| API | NestJS 11 + PostgreSQL 16 |
| ORM | Prisma 6 (chosen over TypeORM for schema-driven migrations) |
| Auth | JWT access tokens + rotating HttpOnly refresh-token cookies |
| Tests | Vitest (frontend), Jest (backend) |

Angular 21 was selected because the local Node.js version (v24.14.0) does not meet
Angular CLI 22's Node requirement. Upgrade both together when the environment allows.

---

## Getting started

Requirements: Node.js 20.19+, 22.12+ or 24+ (tested on 24.14.0), npm 11+.
Backend additionally needs Docker (for the local PostgreSQL container).

### Frontend

```bash
cd frontend
npm install
npm start
```

Open <http://localhost:4200/>.

### Backend

```bash
cd backend
npm install
cp .env.example .env        # then set a strong JWT_SECRET (32+ random chars)
npm run db:up               # start PostgreSQL 16 in Docker
npm run prisma:migrate:dev  # apply migrations
npm run prisma:generate     # generate the Prisma Client
npm run start:dev           # API on http://localhost:3000
```

### Scripts

Run from `frontend/`:

| Command | Purpose |
| --- | --- |
| `npm start` | Development server on port 4200 |
| `npm run build` | Optimised production build in `dist/frontend` |
| `npm run test:ci` | Unit tests, single run |
| `npm test` | Unit tests in watch mode |
| `npm run format` | Format source with Prettier |
| `npm run format:check` | Verify formatting without writing |

Run from `backend/`:

| Command | Purpose |
| --- | --- |
| `npm run start:dev` | API in watch mode on port 3000 |
| `npm run build` | Production build in `dist/` |
| `npm test` | Backend unit tests (Jest) |
| `npm run db:up` / `db:down` | Start/stop the local PostgreSQL container |
| `npm run prisma:migrate:dev` | Create/apply migrations during development |
| `npm run prisma:migrate` | Apply pending migrations (production) |
| `npm run prisma:generate` | Regenerate the Prisma Client |

### Verification baseline

- Frontend: `npm run build`, `npm run test:ci` (14 tests in 4 files),
  `npm run format:check` — all passing.
- Backend: `npm run build`, `npm test` (58 tests in 10 suites) — all passing;
  `npx prisma generate` succeeds against `prisma/schema.prisma`. The admissions
  module adds 19 focused tests (submission, validation, duplicate handling,
  protected admin listing, status updates).

---

## Routes

### Public

| Route | Page |
| --- | --- |
| `/` | Home |
| `/about` | About the school |
| `/academics` | PG–Class 8 learning pathways |
| `/admissions` | Admission information and process |
| `/resources` | Textbooks, syllabus and library preview |
| `/iqbal-series` | Iqbal Series reading section |
| `/media` | Video and social channel preview |
| `/contact` | Location and contact guidance |
| any unknown path | Public 404 page |

### Admin (Phase 2 — sign-in required)

| Route | Module |
| --- | --- |
| `/admin/login` | Sign-in page |
| `/admin` | Dashboard |
| `/admin/admissions` | Admissions |
| `/admin/students` | Students |
| `/admin/examinations` | Examinations |
| `/admin/content` | Website content |
| `/admin/resources` | E-books & resources |
| `/admin/iqbal-series` | Iqbal Series |
| `/admin/media` | Videos & social |
| `/admin/reports` | Reports |
| `/admin/settings` | Settings |

> The Angular route guard redirects unauthenticated visitors to `/admin/login`,
> and the NestJS API independently rejects every admin request without a valid
> JWT. The guard is a convenience, not the security boundary — server-side RBAC
> is authoritative. Admin accounts must be created in the database; no default
> credentials ship with the repository.

---

## Theme and configuration

- Theme preference is stored in `localStorage` under `ses.theme` and supports
  `light`, `dark` and `system`.
- An inline script in `src/index.html` applies the saved theme before first paint.
- `src/app/core/services/theme.service.ts` tracks operating-system theme changes
  while in system mode.
- Design tokens live in `src/styles/_tokens.scss`; global rules, Material overrides
  and utilities live in `src/styles.scss`.
- School name, location, navigation and contact placeholders are centralised in
  `src/app/core/config/site.config.ts`. Contact and social values are intentionally
  empty until the school confirms them.
- Admin navigation is defined in `src/app/core/config/admin-nav.config.ts`.

---

## Project structure

```
scholar education system/
├── README.md
├── firebase.json               # Firebase Hosting config (Angular SPA)
├── .firebaserc.example         # template for the Firebase project mapping
├── docs/
│   ├── architecture.md
│   └── deployment.md           # deployment plan + current blockers
├── backend/
│   ├── docker-compose.yml      # local PostgreSQL 16
│   ├── prisma/                 # schema.prisma + SQL migrations
│   └── src/
│       ├── app/                # root module, health controller
│       ├── auth/               # login/refresh/logout/me, guards, RBAC
│       ├── config/             # Joi environment validation
│       ├── contacts/           # public contact form + admin inbox
│       ├── content/            # admin announcement CRUD
│       ├── prisma/             # PrismaService
│       └── main.ts             # helmet, CORS, validation, filters
└── frontend/
    ├── public/                 # favicon, manifest, static assets
    └── src/
        ├── app/
        │   ├── core/
        │   │   ├── config/     # site + admin navigation configuration
        │   │   ├── guards/     # admin auth guard
        │   │   ├── layout/     # public and admin shells
        │   │   ├── models/
        │   │   └── services/   # theme + auth services
        │   ├── features/
        │   │   ├── public/     # public pages and public routes
        │   │   └── admin/      # login, dashboard, placeholder modules
        │   ├── shared/         # reusable UI components
        │   ├── app.routes.ts   # top-level lazy route configuration
        │   └── app.config.ts
        ├── styles/             # tokens and SCSS mixins
        ├── styles.scss         # global design system
        └── index.html
```

---

## Content that the school must provide

These are intentionally blank so the site never publishes guessed information:

- Confirmed phone number, email address and office hours.
- Official Facebook, YouTube, WhatsApp or other social links.
- Confirmed Iqbal Series book titles, editions and class assignments.
- Approved admission form templates and fee/eligibility details.
- Textbooks, syllabus and curriculum PDFs with permission to publish.
- School photos, videos and branding assets.
- Confirmed academic calendar and announcements.

Update `site.config.ts` and the relevant page content when these are approved.

---

## Phase roadmap

| Phase | Scope |
| --- | --- |
| **1 — complete** | Angular foundation, design system, public site, admin shell, themes, tests |
| **2 — complete (deploy pending)** | NestJS API, PostgreSQL/Prisma, secure auth, RBAC, content/contact/admissions APIs |
| 3 | Admissions module implemented; student records, statistics and growth reports pending |
| 4 | PDF e-book library, Iqbal Series content, videos and social links |
| 5 | Midterm/Final examinations, results, report cards and school reports |
| Later | Android app integration, notifications, LMS capabilities |

Phase 2 delivers the API foundation and security model; Phase 3 builds the
school-data modules on top of it. The frontend is live on Firebase Hosting;
the API deployment is the remaining Phase 2 item — see
[docs/deployment.md](docs/deployment.md).
