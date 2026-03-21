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
