# Scholars Education System — Frontend

Angular 21 frontend for the Scholars Education System public website and admin
workspace shell.

**Phase 1 status:** UI foundation only. There is no backend, authentication, database
or live school data. Do not enter confidential information in the admin preview.

See the [project README](../README.md) for the full overview and the
[architecture document](../docs/architecture.md) for design and roadmap details.

## Commands

```bash
npm install
npm start          # http://localhost:4200
npm run build      # dist/frontend
npm run test:ci    # single test run
npm run format:check
```

## Structure

```
src/app/
├── core/          # config, layouts, models, theme service
├── features/      # public pages and admin workspace
├── shared/        # reusable components
├── app.routes.ts  # top-level lazy routes
└── styles.scss    # global design system

src/styles/        # tokens and mixins
```

Public routes: `/`, `/about`, `/academics`, `/admissions`, `/resources`,
`/iqbal-series`, `/media`, `/contact`, plus a 404 page.

Admin preview routes: `/admin` and module pages under `/admin/*`.

## Before public deployment

Authentication and role-based access control are **not implemented**. Keep the admin
shell private or wait for Phase 2 before exposing it publicly.
