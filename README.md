# TODO Web

Portfolio-grade full-stack TODO app built with `Next.js`, `Prisma`, `PostgreSQL`, `Auth.js`, `next-intl`, and `next-themes`.

## Features

- Locale-prefixed routes with `en` / `zh` support
- Light / dark / system theme switching with persistence
- Marketing landing page, authentication, and dashboard localized end to end
- Email/password authentication with protected app routes
- User-scoped TODO CRUD with translated mutation feedback
- Prisma schema, migration SQL, and seed workflow

## Environment

Copy `.env.example` to `.env` and fill in the values:

```bash
cp .env.example .env
```

Required variables:

- `DATABASE_URL`
- `AUTH_SECRET`
- `NEXTAUTH_URL`

## Local setup

```bash
corepack pnpm install
corepack pnpm db:generate
corepack pnpm db:migrate
corepack pnpm db:seed
corepack pnpm dev
```

## Locale routes

- `/en`
- `/zh`

## Theme modes

- `system`
- `light`
- `dark`

## Demo account

After seeding:

- Email: `demo@todoweb.dev`
- Password: `password123`

## Tests

```bash
corepack pnpm test
corepack pnpm test:e2e
corepack pnpm build
```

## Notes

- `corepack pnpm test:e2e` starts the local Next.js server automatically through Playwright.
- The checked-in SQL migration lives at `prisma/migrations/0001_init/migration.sql`.
- For production, use a real PostgreSQL instance and a long random `AUTH_SECRET`.
