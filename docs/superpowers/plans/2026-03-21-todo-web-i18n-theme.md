# TODO Web I18n and Theme Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add `zh` / `en` internationalization, locale-aware routing, user-visible translated error handling, and `light` / `dark` / `system` theme switching to the existing TODO Web app.

**Architecture:** Use `next-intl` to move the app to locale-prefixed routes under `app/[locale]`, with `middleware.ts` handling locale detection and protected route behavior together. Use `next-themes` at the locale layout level so all pages consume one shared theme system, and convert user-visible server errors into stable error codes that the UI maps to translated messages.

**Tech Stack:** `Next.js App Router`, `TypeScript`, `next-intl`, `next-themes`, `Prisma`, `Auth.js`, `Vitest`, `Playwright`

---

## Proposed File Structure

### Locale and Theme Foundation

- Create: `i18n/routing.ts` — supported locales, default locale, and locale-aware navigation helpers
- Create: `i18n/request.ts` — request config for `next-intl/server`
- Create: `messages/en.json` — English message catalog
- Create: `messages/zh.json` — Chinese message catalog
- Create: `components/providers/theme-provider.tsx` — `next-themes` wrapper with system default
- Create: `components/navigation/locale-switcher.tsx` — locale dropdown used in the shared header
- Create: `components/navigation/theme-switcher.tsx` — theme selector used in the shared header
- Modify: `middleware.ts` — combine locale detection, redirect behavior, and protected app route handling
- Modify: `app/layout.tsx` — minimal root shell only
- Create: `app/page.tsx` — redirect bare `/` to resolved locale
- Create: `app/[locale]/layout.tsx` — locale layout with `NextIntlClientProvider` and theme provider

### Route Migration

- Create: `app/[locale]/(marketing)/page.tsx` — localized landing page
- Create: `app/[locale]/(auth)/login/page.tsx` — localized login page
- Create: `app/[locale]/(auth)/register/page.tsx` — localized register page
- Create: `app/[locale]/app/page.tsx` — localized dashboard page
- Remove/replace: `app/(marketing)/page.tsx` once locale route is active
- Remove/replace: `app/(auth)/login/page.tsx` once locale route is active
- Remove/replace: `app/(auth)/register/page.tsx` once locale route is active
- Remove/replace: `app/app/page.tsx` once locale route is active

### Shared UI Refactor

- Modify: `components/layout/site-header.tsx` — locale-aware links plus language/theme controls
- Modify: `components/marketing/hero-section.tsx` — translated text, theme-safe styles
- Modify: `components/marketing/feature-grid.tsx` — translated titles/descriptions
- Modify: `components/marketing/product-preview.tsx` — translated copy, theme-safe preview cards
- Modify: `components/auth/login-form.tsx` — translated labels/errors, locale-aware redirects
- Modify: `components/auth/register-form.tsx` — translated labels/errors, locale-aware redirects
- Modify: `components/todos/stats-cards.tsx` — translated labels
- Modify: `components/todos/filter-bar.tsx` — translated chips and locale-aware links
- Modify: `components/todos/todo-card.tsx` — translated badges/buttons
- Modify: `components/todos/todo-form-dialog.tsx` — translated labels/buttons
- Modify: `components/todos/todo-list.tsx` — translated empty state
- Modify: `app/globals.css` — introduce semantic CSS variables for light/dark themes

### Error and Message Mapping

- Create: `features/auth/error-codes.ts` — stable auth-facing error codes
- Create: `features/todos/error-codes.ts` — stable todo-facing error codes
- Create: `lib/errors.ts` — helpers for serializable app errors and code extraction
- Modify: `features/auth/actions/register.ts` — return error codes instead of user-facing strings
- Modify: `app/api/register/route.ts` — normalize registration failures
- Modify: `auth.ts` — credentials auth failure normalization
- Modify: `features/todos/actions/create-todo.ts` — TODO mutation error code normalization
- Modify: `features/todos/actions/update-todo.ts` — TODO mutation error code normalization
- Modify: `features/todos/actions/delete-todo.ts` — TODO mutation error code normalization

### Tests and Tooling

- Modify: `package.json` — add `next-intl` and `next-themes` deps if missing, keep scripts stable
- Modify: `playwright.config.ts` — stable E2E startup config for locale/theming flows
- Create: `tests/unit/i18n/routing.test.ts`
- Create: `tests/unit/lib/errors.test.ts`
- Modify: `tests/unit/features/auth/schema.test.ts`
- Modify: `tests/integration/auth/register-action.test.ts`
- Modify: `tests/integration/todos/todo-actions.test.ts`
- Modify: `tests/e2e/auth-and-dashboard.spec.ts`
- Create: `tests/e2e/theme-and-locale.spec.ts`

## Task 1: Install i18n/theme dependencies and stabilize test scaffolding

**Files:**
- Modify: `package.json`
- Modify: `playwright.config.ts`
- Create: `tests/unit/i18n/routing.test.ts`

- [ ] **Step 1: Write a failing routing test for supported locales**

```ts
import { describe, expect, it } from 'vitest';
import { locales, defaultLocale } from '@/i18n/routing';

describe('i18n routing', () => {
  it('supports zh and en with en as default', () => {
    expect(locales).toEqual(['en', 'zh']);
    expect(defaultLocale).toBe('en');
  });
});
```

- [ ] **Step 2: Run the routing test to verify failure**

Run: `pnpm vitest run tests/unit/i18n/routing.test.ts`
Expected: FAIL because `i18n/routing.ts` does not exist yet.

- [ ] **Step 3: Install `next-intl` and `next-themes`, then add minimal routing config**

```ts
export const locales = ['en', 'zh'] as const;
export const defaultLocale = 'en';
export type AppLocale = (typeof locales)[number];
```

```json
{
  "dependencies": {
    "next-intl": "<current>",
    "next-themes": "<current>"
  }
}
```

- [ ] **Step 4: Re-run the routing test**

Run: `pnpm vitest run tests/unit/i18n/routing.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit the dependency and test foundation**

Run:
```bash
git add package.json pnpm-lock.yaml playwright.config.ts i18n/routing.ts tests/unit/i18n/routing.test.ts
git commit -m "feat: add i18n and theme foundation deps"
```

## Task 2: Add locale-aware routing and provider layout

**Files:**
- Create: `i18n/request.ts`
- Modify: `middleware.ts`
- Modify: `app/layout.tsx`
- Create: `app/page.tsx`
- Create: `app/[locale]/layout.tsx`
- Create: `messages/en.json`
- Create: `messages/zh.json`
- Create: `tests/e2e/theme-and-locale.spec.ts`

- [ ] **Step 1: Write a failing E2E test for root redirect into a locale route**

```ts
import { test, expect } from '@playwright/test';

test('root path redirects to a supported locale', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveURL(/\/en$|\/zh$/);
});
```

- [ ] **Step 2: Run the targeted E2E test to verify failure**

Run: `pnpm playwright test tests/e2e/theme-and-locale.spec.ts --grep "root path redirects to a supported locale"`
Expected: FAIL because the app still serves non-locale routes.

- [ ] **Step 3: Implement locale request config, root redirect, and locale layout**

```ts
export default getRequestConfig(async ({requestLocale}) => {
  const locale = hasLocale(locales, await requestLocale) ? await requestLocale : defaultLocale;
  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default
  };
});
```

```tsx
export default async function LocaleLayout({children, params}: Props) {
  const {locale} = await params;
  setRequestLocale(locale);
  return (
    <html lang={locale} suppressHydrationWarning>
      <body>
        <NextIntlClientProvider messages={messages}>
          <ThemeProvider>{children}</ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
```

- [ ] **Step 4: Re-run the locale redirect E2E test**

Run: `pnpm playwright test tests/e2e/theme-and-locale.spec.ts --grep "root path redirects to a supported locale"`
Expected: PASS.

- [ ] **Step 5: Commit locale routing and providers**

Run:
```bash
git add app/layout.tsx app/page.tsx app/[locale]/layout.tsx i18n/request.ts i18n/routing.ts messages middleware.ts tests/e2e/theme-and-locale.spec.ts
git commit -m "feat: add locale routing and app providers"
```

## Task 3: Move marketing and auth routes under `app/[locale]`

**Files:**
- Create: `app/[locale]/(marketing)/page.tsx`
- Create: `app/[locale]/(auth)/login/page.tsx`
- Create: `app/[locale]/(auth)/register/page.tsx`
- Modify: `components/layout/site-header.tsx`
- Modify: `components/marketing/hero-section.tsx`
- Modify: `components/marketing/feature-grid.tsx`
- Modify: `components/marketing/product-preview.tsx`
- Modify: `components/auth/login-form.tsx`
- Modify: `components/auth/register-form.tsx`
- Modify: `tests/e2e/auth-and-dashboard.spec.ts`

- [ ] **Step 1: Extend the smoke test to check English locale content**

```ts
test('english landing page shows translated marketing copy', async ({ page }) => {
  await page.goto('/en');
  await expect(page.getByRole('heading', {name: /organize your work with clarity/i})).toBeVisible();
  await expect(page.getByRole('link', {name: /get started/i})).toBeVisible();
});
```

- [ ] **Step 2: Run the marketing/auth E2E smoke test and confirm failure**

Run: `pnpm playwright test tests/e2e/auth-and-dashboard.spec.ts --grep "english landing page shows translated marketing copy"`
Expected: FAIL because the marketing/auth routes are not locale-aware yet.

- [ ] **Step 3: Move the pages under `app/[locale]` and consume translations**

```tsx
const t = useTranslations('marketing.hero');
return <h1>{t('title')}</h1>;
```

```tsx
<Link href={{pathname: '/login', params: {locale}}}>{t('login')}</Link>
```

- [ ] **Step 4: Re-run the targeted marketing/auth E2E test**

Run: `pnpm playwright test tests/e2e/auth-and-dashboard.spec.ts --grep "english landing page shows translated marketing copy"`
Expected: PASS.

- [ ] **Step 5: Commit localized marketing and auth pages**

Run:
```bash
git add app/[locale]/(marketing) app/[locale]/(auth) components/layout/site-header.tsx components/marketing components/auth tests/e2e/auth-and-dashboard.spec.ts
git commit -m "feat: localize marketing and auth routes"
```

## Task 4: Add shared language and theme controls in the header

**Files:**
- Create: `components/providers/theme-provider.tsx`
- Create: `components/navigation/locale-switcher.tsx`
- Create: `components/navigation/theme-switcher.tsx`
- Modify: `components/layout/site-header.tsx`
- Modify: `messages/en.json`
- Modify: `messages/zh.json`
- Modify: `tests/e2e/theme-and-locale.spec.ts`

- [ ] **Step 1: Write a failing E2E test for theme and language controls**

```ts
test('header exposes language and theme controls', async ({ page }) => {
  await page.goto('/en');
  await expect(page.getByRole('button', {name: /language/i})).toBeVisible();
  await expect(page.getByRole('button', {name: /theme/i})).toBeVisible();
});
```

- [ ] **Step 2: Run the control visibility E2E test to verify failure**

Run: `pnpm playwright test tests/e2e/theme-and-locale.spec.ts --grep "header exposes language and theme controls"`
Expected: FAIL because the shared header does not expose these controls yet.

- [ ] **Step 3: Implement the switcher components and inject them into the header**

```tsx
export function ThemeSwitcher() {
  const {theme, setTheme} = useTheme();
  return (
    <button aria-label="Theme">
      {theme}
    </button>
  );
}
```

```tsx
export function LocaleSwitcher({locale}: {locale: AppLocale}) {
  return <button aria-label="Language">{locale.toUpperCase()}</button>;
}
```

- [ ] **Step 4: Re-run the header control E2E test**

Run: `pnpm playwright test tests/e2e/theme-and-locale.spec.ts --grep "header exposes language and theme controls"`
Expected: PASS.

- [ ] **Step 5: Commit the shared controls**

Run:
```bash
git add components/providers/theme-provider.tsx components/navigation components/layout/site-header.tsx messages tests/e2e/theme-and-locale.spec.ts app/[locale]/layout.tsx
git commit -m "feat: add locale and theme controls"
```

## Task 5: Convert global styles to semantic light/dark theme tokens

**Files:**
- Modify: `app/globals.css`
- Modify: `components/marketing/hero-section.tsx`
- Modify: `components/marketing/feature-grid.tsx`
- Modify: `components/marketing/product-preview.tsx`
- Modify: `components/auth/login-form.tsx`
- Modify: `components/auth/register-form.tsx`
- Modify: `tests/e2e/theme-and-locale.spec.ts`

- [ ] **Step 1: Write a failing E2E test for theme persistence**

```ts
test('theme selection persists after reload', async ({ page }) => {
  await page.goto('/en');
  await page.getByRole('button', {name: /theme/i}).click();
  await page.getByRole('menuitem', {name: /light/i}).click();
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('style', /color-scheme: light/i);
});
```

- [ ] **Step 2: Run the theme persistence E2E test and confirm failure**

Run: `pnpm playwright test tests/e2e/theme-and-locale.spec.ts --grep "theme selection persists after reload"`
Expected: FAIL because the app still uses hard-coded dark styles.

- [ ] **Step 3: Replace hard-coded colors with semantic CSS variables and wire `next-themes`**

```css
:root {
  --background: 248 250 252;
  --foreground: 15 23 42;
  --card: 255 255 255;
}

.dark {
  --background: 15 23 42;
  --foreground: 226 232 240;
  --card: 15 23 42;
}
```

```tsx
<ThemeProvider attribute="class" defaultTheme="system" enableSystem>
  {children}
</ThemeProvider>
```

- [ ] **Step 4: Re-run the theme persistence E2E test**

Run: `pnpm playwright test tests/e2e/theme-and-locale.spec.ts --grep "theme selection persists after reload"`
Expected: PASS.

- [ ] **Step 5: Commit the theme-safe styling pass**

Run:
```bash
git add app/globals.css components/marketing components/auth components/providers/theme-provider.tsx tests/e2e/theme-and-locale.spec.ts
git commit -m "feat: add semantic light and dark theme styling"
```

## Task 6: Localize the dashboard and TODO UI under locale routes

**Files:**
- Create: `app/[locale]/app/page.tsx`
- Modify: `components/todos/stats-cards.tsx`
- Modify: `components/todos/filter-bar.tsx`
- Modify: `components/todos/todo-card.tsx`
- Modify: `components/todos/todo-form-dialog.tsx`
- Modify: `components/todos/todo-list.tsx`
- Modify: `features/todos/queries.ts`
- Modify: `messages/en.json`
- Modify: `messages/zh.json`
- Modify: `tests/e2e/theme-and-locale.spec.ts`

- [ ] **Step 1: Write a failing E2E test for Chinese dashboard copy**

```ts
test('chinese dashboard renders translated labels', async ({ page }) => {
  await page.goto('/zh/app');
  await expect(page.getByText(/总任务数/)).toBeVisible();
});
```

- [ ] **Step 2: Run the localized dashboard E2E test and confirm failure**

Run: `pnpm playwright test tests/e2e/theme-and-locale.spec.ts --grep "chinese dashboard renders translated labels"`
Expected: FAIL because the dashboard still uses non-locale routes and hard-coded text.

- [ ] **Step 3: Move the dashboard route under `app/[locale]/app` and localize the TODO UI**

```tsx
const t = useTranslations('dashboard.stats');
return <span>{t('total')}</span>;
```

```tsx
<Link href={{pathname: '/app', params: {locale}, query: {status: 'done'}}}>...</Link>
```

- [ ] **Step 4: Re-run the localized dashboard E2E test**

Run: `pnpm playwright test tests/e2e/theme-and-locale.spec.ts --grep "chinese dashboard renders translated labels"`
Expected: PASS.

- [ ] **Step 5: Commit the localized dashboard**

Run:
```bash
git add app/[locale]/app components/todos features/todos/queries.ts messages tests/e2e/theme-and-locale.spec.ts
git commit -m "feat: localize dashboard and todo ui"
```

## Task 7: Normalize auth and TODO errors into translatable codes

**Files:**
- Create: `features/auth/error-codes.ts`
- Create: `features/todos/error-codes.ts`
- Create: `lib/errors.ts`
- Modify: `features/auth/actions/register.ts`
- Modify: `app/api/register/route.ts`
- Modify: `auth.ts`
- Modify: `features/todos/actions/create-todo.ts`
- Modify: `features/todos/actions/update-todo.ts`
- Modify: `features/todos/actions/delete-todo.ts`
- Create: `tests/unit/lib/errors.test.ts`
- Modify: `tests/integration/auth/register-action.test.ts`
- Modify: `tests/integration/todos/todo-actions.test.ts`

- [ ] **Step 1: Write failing tests for stable error codes**

```ts
import { describe, expect, it } from 'vitest';
import { AUTH_ERROR_CODES } from '@/features/auth/error-codes';

describe('AUTH_ERROR_CODES', () => {
  it('exposes invalid credentials code', () => {
    expect(AUTH_ERROR_CODES.INVALID_CREDENTIALS).toBe('AUTH_INVALID_CREDENTIALS');
  });
});
```

```ts
it('returns a duplicate email error code', async () => {
  const createUser = vi.fn().mockRejectedValue({code: 'P2002'});
  await expect(registerUser(createUser, payload)).rejects.toMatchObject({code: 'AUTH_EMAIL_TAKEN'});
});
```

- [ ] **Step 2: Run the auth/todo error tests and confirm failure**

Run: `pnpm vitest run tests/unit/lib/errors.test.ts tests/integration/auth/register-action.test.ts tests/integration/todos/todo-actions.test.ts`
Expected: FAIL because stable app error helpers do not exist yet.

- [ ] **Step 3: Implement app error helpers and convert actions to throw coded errors**

```ts
export class AppError extends Error {
  constructor(public code: string, message?: string) {
    super(message ?? code);
  }
}
```

```ts
if (isPrismaUniqueConstraint(error)) {
  throw new AppError(AUTH_ERROR_CODES.EMAIL_TAKEN);
}
```

- [ ] **Step 4: Re-run the auth/todo error tests**

Run: `pnpm vitest run tests/unit/lib/errors.test.ts tests/integration/auth/register-action.test.ts tests/integration/todos/todo-actions.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit translatable error code normalization**

Run:
```bash
git add features/auth/error-codes.ts features/todos/error-codes.ts lib/errors.ts features/auth/actions/register.ts app/api/register/route.ts auth.ts features/todos/actions tests/unit/lib/errors.test.ts tests/integration/auth/register-action.test.ts tests/integration/todos/todo-actions.test.ts
git commit -m "feat: normalize user-facing errors for translation"
```

## Task 8: Translate client-side error rendering and locale-aware form flows

**Files:**
- Modify: `components/auth/login-form.tsx`
- Modify: `components/auth/register-form.tsx`
- Modify: `components/todos/todo-form-dialog.tsx`
- Modify: `components/todos/todo-card.tsx`
- Modify: `messages/en.json`
- Modify: `messages/zh.json`
- Modify: `tests/e2e/theme-and-locale.spec.ts`

- [ ] **Step 1: Write a failing E2E test for translated auth errors**

```ts
test('login errors render in chinese when locale is zh', async ({ page }) => {
  await page.goto('/zh/login');
  await page.getByLabel(/邮箱/).fill('demo@todoweb.dev');
  await page.getByLabel(/密码/).fill('wrong-password');
  await page.getByRole('button', {name: /登录/}).click();
  await expect(page.getByText(/请检查邮箱和密码/)).toBeVisible();
});
```

- [ ] **Step 2: Run the translated auth error E2E test and confirm failure**

Run: `pnpm playwright test tests/e2e/theme-and-locale.spec.ts --grep "login errors render in chinese"`
Expected: FAIL because the client forms still hard-code English strings.

- [ ] **Step 3: Update form components to map app error codes to translated messages**

```ts
const t = useTranslations('errors.auth');
setErrorMessage(t(errorCodeToTranslationKey(code)));
```

```tsx
<label>
  <span>{t('fields.email')}</span>
  <input aria-label={t('fields.email')} />
</label>
```

- [ ] **Step 4: Re-run the translated auth error E2E test**

Run: `pnpm playwright test tests/e2e/theme-and-locale.spec.ts --grep "login errors render in chinese"`
Expected: PASS.

- [ ] **Step 5: Commit translated form and mutation feedback**

Run:
```bash
git add components/auth components/todos messages tests/e2e/theme-and-locale.spec.ts
git commit -m "feat: translate form and mutation feedback"
```

## Task 9: Finalize regression coverage and developer docs

**Files:**
- Modify: `README.md`
- Modify: `.env.example`
- Modify: `tests/e2e/auth-and-dashboard.spec.ts`
- Modify: `tests/e2e/theme-and-locale.spec.ts`
- Modify: `playwright.config.ts`

- [ ] **Step 1: Add failing README expectations for i18n and theme setup**

```md
- [ ] set `AUTH_SECRET` and `DATABASE_URL`
- [ ] start localized app routes under `/en` or `/zh`
- [ ] verify theme switcher supports system, light, dark
```

- [ ] **Step 2: Run the final verification suite before docs are updated**

Run: `pnpm vitest run && AUTH_SECRET=test-secret DATABASE_URL="postgresql://postgres:postgres@localhost:5432/todo_web" pnpm build && pnpm playwright test tests/e2e/auth-and-dashboard.spec.ts tests/e2e/theme-and-locale.spec.ts`
Expected: FAIL until the last docs/config cleanup and E2E coverage are complete.

- [ ] **Step 3: Update README, env example, and final smoke coverage**

```md
## Locale Routes
- `/en`
- `/zh`

## Theme Modes
- system
- light
- dark
```

```env
NEXT_PUBLIC_APP_URL="http://127.0.0.1:3000"
```

- [ ] **Step 4: Re-run the full verification suite**

Run: `pnpm vitest run && AUTH_SECRET=test-secret DATABASE_URL="postgresql://postgres:postgres@localhost:5432/todo_web" pnpm build && pnpm playwright test tests/e2e/auth-and-dashboard.spec.ts tests/e2e/theme-and-locale.spec.ts`
Expected: PASS.

- [ ] **Step 5: Commit the final i18n/theme handoff**

Run:
```bash
git add README.md .env.example playwright.config.ts tests/e2e/auth-and-dashboard.spec.ts tests/e2e/theme-and-locale.spec.ts
git commit -m "docs: finalize i18n and theme workflow"
```

## Notes for the Implementer

- Keep all user-visible strings out of component bodies unless they are translation keys.
- Prefer `useTranslations` / `getTranslations` close to the component that needs the copy; do not pass giant translation dictionaries through props.
- Keep locale-aware routes canonical; once `app/[locale]` is active, remove or redirect legacy non-locale paths.
- Do not mix service-layer errors with translated sentences. Return codes, translate at the edge.
- Replace color literals only when they affect current UI; avoid unrelated style churn.
- Preserve the commit cadence above. The user explicitly asked for a git commit after each tested development slice.
