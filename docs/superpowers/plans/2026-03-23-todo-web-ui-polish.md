# TODO Web UI Polish Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refine the visual presentation of the localized TODO Web app so the marketing page, auth screens, and dashboard feel like one coherent product-quality SaaS UI.

**Architecture:** Keep the current component structure and theme/i18n behavior intact, but narrow broad global layout rules and move visual control to page-specific sections and reusable surface patterns. Use focused CSS changes in `app/globals.css` plus minimal component markup adjustments to create a stronger header, two-column marketing hero, tighter feature/preview sections, and more intentional auth framing.

**Tech Stack:** Next.js App Router, TypeScript, CSS, next-intl, next-themes, Playwright

---

## Proposed File Structure

- Modify: `app/globals.css` — replace over-broad global layout rules with page-specific marketing/auth/dashboard layout styling and unified surface patterns
- Modify: `app/[locale]/(marketing)/page.tsx` — preserve structure, ensure section wrappers align with refined layout rules if needed
- Modify: `components/layout/site-header.tsx` — keep behavior, allow cleaner control grouping and CTA rhythm
- Modify: `components/marketing/hero-section.tsx` — preserve content, support balanced two-column hero layout
- Modify: `components/marketing/feature-grid.tsx` — preserve content, align cards to equal-height product grid
- Modify: `components/marketing/product-preview.tsx` — preserve content, improve product-summary panel hierarchy
- Modify: `app/[locale]/(auth)/login/page.tsx` — add auth shell framing if needed
- Modify: `app/[locale]/(auth)/register/page.tsx` — add auth shell framing if needed
- Modify: `tests/e2e/auth-and-dashboard.spec.ts` — strengthen landing-page visual structure regression
- Modify: `tests/e2e/theme-and-locale.spec.ts` — keep existing hydration/theme regression green while UI changes land

## Task 1: Lock the desired landing-page structure with a failing E2E

**Files:**
- Modify: `tests/e2e/auth-and-dashboard.spec.ts`

- [ ] **Step 1: Write a failing landing-page structure regression**

```ts
import { test, expect } from '@playwright/test';

test('english landing page shows polished product sections', async ({ page }) => {
  await page.goto('/en');
  await expect(page.getByRole('heading', { name: /organize your work with clarity/i })).toBeVisible();
  await expect(page.getByRole('link', { name: /create your workspace/i })).toBeVisible();
  await expect(page.getByRole('heading', { name: /built to feel like a real product, not a mockup\./i })).toBeVisible();
  await expect(page.getByRole('heading', { name: /real authentication/i })).toBeVisible();
});
```

- [ ] **Step 2: Run the landing-page regression and verify failure if structure is missing**

Run: `corepack pnpm playwright test tests/e2e/auth-and-dashboard.spec.ts --grep "english landing page shows polished product sections"`
Expected: FAIL until the updated layout is in place.

- [ ] **Step 3: Commit the failing test only if it adds new coverage not already present**

If the test is meaningfully new, keep it; otherwise refine the existing test in place.

## Task 2: Refine the global layout system without changing functionality

**Files:**
- Modify: `app/globals.css`

- [ ] **Step 1: Write the minimal CSS-focused regression target list in the diff itself**

Target behaviors:
- marketing pages are not globally centered by the generic `main` rule
- auth pages keep centered flow without inheriting marketing spacing
- dashboard spacing remains intact

- [ ] **Step 2: Narrow broad layout selectors and introduce page-specific shells**

Implement changes like:

```css
main {
  width: 100%;
}

.marketing-main {
  display: grid;
  gap: 4rem;
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.auth-page {
  min-height: calc(100vh - 76px);
  display: grid;
  place-items: center;
  padding: 2rem;
}
```

- [ ] **Step 3: Add unified surface spacing / card rhythm**

Use shared spacing, radius, and shadow updates for header controls, marketing cards, auth cards, and preview panels without redesigning components from scratch.

- [ ] **Step 4: Run the landing-page regression and a quick auth/dashboard smoke pass**

Run: `corepack pnpm playwright test tests/e2e/auth-and-dashboard.spec.ts tests/e2e/theme-and-locale.spec.ts --grep "english landing page shows|header exposes language and theme controls"`
Expected: PASS.

- [ ] **Step 5: Commit the layout-system pass**

```bash
git add app/globals.css tests/e2e/auth-and-dashboard.spec.ts
git commit -m "style: refine shared layout system"
```

## Task 3: Turn the hero into a balanced two-column product section

**Files:**
- Modify: `components/marketing/hero-section.tsx`
- Modify: `app/globals.css`

- [ ] **Step 1: Keep content fixed and adjust only layout hooks if needed**

If needed, add minimal wrapper classes rather than restructuring content logic.

- [ ] **Step 2: Implement the two-column desktop layout with stacked mobile fallback**

```css
.hero-section {
  display: grid;
  grid-template-columns: minmax(0, 1.1fr) minmax(320px, 0.9fr);
  gap: 2rem;
  align-items: center;
}
```

- [ ] **Step 3: Improve preview-card spacing and hierarchy**

Ensure the right-hand preview reads like a product summary rather than three loose blocks.

- [ ] **Step 4: Re-run the landing-page E2E and inspect `/en` manually**

Run: `corepack pnpm playwright test tests/e2e/auth-and-dashboard.spec.ts --grep "english landing page shows polished product sections"`
Expected: PASS.

- [ ] **Step 5: Commit the hero polish**

```bash
git add components/marketing/hero-section.tsx app/globals.css
git commit -m "style: polish landing hero layout"
```

## Task 4: Tighten feature grid and product preview sections

**Files:**
- Modify: `components/marketing/feature-grid.tsx`
- Modify: `components/marketing/product-preview.tsx`
- Modify: `app/globals.css`

- [ ] **Step 1: Keep semantics stable and adjust only markup needed for alignment**

Prefer wrapper classes over content changes.

- [ ] **Step 2: Implement equal-height feature cards and stronger preview panel grouping**

Examples:

```css
.feature-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1rem;
}

.product-preview {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(320px, 0.95fr);
  gap: 1.5rem;
}
```

- [ ] **Step 3: Add responsive fallbacks below tablet width**

Collapse to single-column layout without breaking reading order.

- [ ] **Step 4: Run the landing-page regression and inspect `/en` manually**

Run: `corepack pnpm playwright test tests/e2e/auth-and-dashboard.spec.ts --grep "english landing page shows polished product sections"`
Expected: PASS.

- [ ] **Step 5: Commit the section polish**

```bash
git add components/marketing/feature-grid.tsx components/marketing/product-preview.tsx app/globals.css
git commit -m "style: refine marketing sections"
```

## Task 5: Polish header and auth framing to match the product system

**Files:**
- Modify: `components/layout/site-header.tsx`
- Modify: `app/[locale]/(auth)/login/page.tsx`
- Modify: `app/[locale]/(auth)/register/page.tsx`
- Modify: `app/globals.css`
- Modify: `tests/e2e/theme-and-locale.spec.ts`

- [ ] **Step 1: Add a failing regression if header/auth layout loses core controls**

Reuse existing header-control and auth-route tests rather than inventing redundant coverage.

- [ ] **Step 2: Refine header spacing and control grouping**

Make language/theme controls feel like product toolbar actions while keeping CTA prominence under control.

- [ ] **Step 3: Add auth-shell framing around the existing forms**

Use page-level spacing and optional supporting copy block if needed, but do not change form behavior.

- [ ] **Step 4: Run focused E2E verification**

Run: `corepack pnpm playwright test tests/e2e/auth-and-dashboard.spec.ts tests/e2e/theme-and-locale.spec.ts --grep "header exposes language and theme controls|redirects unauthenticated users away from locale dashboard|theme switcher does not trigger hydration runtime errors"`
Expected: PASS.

- [ ] **Step 5: Commit the header/auth polish**

```bash
git add components/layout/site-header.tsx app/[locale]/(auth)/login/page.tsx app/[locale]/(auth)/register/page.tsx app/globals.css tests/e2e/theme-and-locale.spec.ts
git commit -m "style: align header and auth surfaces"
```

## Task 6: Final verification and cleanup

**Files:**
- Modify: `README.md` only if usage notes need adjustment

- [ ] **Step 1: Run the complete automated verification set**

Run:
```bash
corepack pnpm vitest run
set -a && . ./.env && export NEXTAUTH_URL=http://127.0.0.1:3000 && set +a && corepack pnpm build
corepack pnpm playwright test tests/e2e/auth-and-dashboard.spec.ts tests/e2e/theme-and-locale.spec.ts
```
Expected: PASS.

- [ ] **Step 2: Manually inspect key routes**

Inspect:
- `/en`
- `/en/login`
- `/zh/app`

Verify spacing, hierarchy, and responsive feel are consistent.

- [ ] **Step 3: Commit the final UI handoff if additional cleanup was needed**

```bash
git add app/globals.css README.md
git commit -m "style: finalize product ui polish"
```
