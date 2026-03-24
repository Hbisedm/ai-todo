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

- `DATABASE_URL`: PostgreSQL runtime connection string
- `DIRECT_URL`: direct PostgreSQL connection string for Prisma migrations
- `AUTH_SECRET`: long random secret for Auth.js
- `NEXTAUTH_URL`: app base URL

For `Neon` + `Prisma`, the recommended setup is:

- `DATABASE_URL` = pooled connection string
- `DIRECT_URL` = unpooled / direct connection string

## Local setup

```bash
corepack pnpm install
corepack pnpm db:generate
corepack pnpm db:migrate
corepack pnpm db:seed
corepack pnpm dev
```

If your local dev server cache gets into a bad state, use:

```bash
corepack pnpm dev:clean
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

## Deploy to Vercel with Neon

### 1. Create a Neon project

Create a PostgreSQL database in `Neon`, then collect:

- a pooled connection string
- an unpooled / direct connection string

Recommended mapping:

- `DATABASE_URL` → pooled
- `DIRECT_URL` → unpooled

### 2. Push the repository to GitHub

Import the GitHub repository into `Vercel` and create a project from it.

### 3. Configure Vercel environment variables

In `Vercel -> Project Settings -> Environment Variables`, add:

- `DATABASE_URL`
- `DIRECT_URL`
- `AUTH_SECRET`
- `NEXTAUTH_URL`

`NEXTAUTH_URL` must match the real production URL.

Examples:

- Vercel preview domain: `https://your-project.vercel.app`
- Custom domain: `https://todo.hbisedm.de5.net`

### 4. Run Prisma migrations during build

Set the Vercel build command to:

```bash
corepack pnpm prisma generate && corepack pnpm prisma migrate deploy && corepack pnpm build
```

This ensures the Prisma client is generated and checked-in migrations are applied before the app build finishes.

### 5. Deploy

Trigger the first deployment from Vercel.

After deployment, verify:

- landing page loads
- registration works
- login works
- TODO create / update / delete works
- locale switching works
- theme switching works

### 6. Optional: seed demo data

If you want demo users or starter tasks in production, run the seed script manually against the production database before exposing the app publicly.

## Notes

- `corepack pnpm test:e2e` starts the local Next.js server automatically through Playwright.
- The checked-in SQL migration lives at `prisma/migrations/0001_init/migration.sql`.
- For production, use a managed PostgreSQL provider such as `Neon` and a strong random `AUTH_SECRET`.
