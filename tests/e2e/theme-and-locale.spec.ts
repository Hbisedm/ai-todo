import { expect, test } from '@playwright/test';

test('root path redirects to a supported locale', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveURL(/\/en$|\/zh$/);
});

test('header exposes language and theme controls', async ({ page }) => {
  await page.goto('/en');
  await expect(page.getByRole('button', { name: /language/i })).toBeVisible();
  await expect(page.getByRole('button', { name: /theme/i })).toBeVisible();
});

test('theme selection persists after reload', async ({ page }) => {
  await page.goto('/en');
  await page.getByRole('button', { name: /theme/i }).click();
  await page.getByRole('menuitem', { name: /light/i }).click();
  await page.reload();
  await expect(page.locator('html')).toHaveClass(/light/);
});

test('language switch changes locale and marketing copy', async ({ page }) => {
  await page.goto('/en');
  await page.getByRole('button', { name: /language/i }).click();
  await page.getByRole('menuitem', { name: /^中文$/ }).click();
  await expect(page).toHaveURL(/\/zh$/);
  await expect(page.getByRole('heading', { name: /清晰地组织你的工作/i })).toBeVisible();
});
