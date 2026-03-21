# TODO Web

Portfolio-grade full-stack TODO app built with `Next.js`, `Prisma`, `PostgreSQL`, and `Auth.js`.

## Features

- Marketing landing page with product-style presentation
- Email/password authentication with protected app routes
- User-scoped TODO CRUD foundations
- Card-based dashboard UI with stats, filters, and quick actions
- Prisma schema, migration SQL, and seed workflow

## Environment

Copy `.env.example` to `.env.local` and fill in the values:

```bash
cp .env.example .env.local
```

Required variables:

- `DATABASE_URL`
- `AUTH_SECRET`

## Local setup

```bash
pnpm install
pnpm db:generate
pnpm db:migrate
pnpm db:seed
pnpm dev
```

## Demo account

After seeding:

- Email: `demo@todoweb.dev`
- Password: `password123`

## Tests

```bash
pnpm test
pnpm test:e2e
pnpm build
```

## Notes

- `pnpm test:e2e` starts the local Next.js server automatically through Playwright.
- The checked-in SQL migration lives at `prisma/migrations/0001_init/migration.sql`.
- For production, use a real PostgreSQL instance and a long random `AUTH_SECRET`.
