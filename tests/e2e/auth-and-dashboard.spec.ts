import { test, expect } from '@playwright/test';

test('english landing page shows translated marketing copy', async ({ page }) => {
  await page.goto('/en');
  await expect(page.getByRole('heading', { name: /organize your work with clarity/i })).toBeVisible();
  await expect(page.getByRole('link', { name: /get started/i })).toBeVisible();
  await expect(page.getByRole('heading', { name: /built to feel like a real product, not a mockup\./i })).toBeVisible();
  await expect(page.getByRole('heading', { name: /real authentication/i })).toBeVisible();
});

test('redirects unauthenticated users away from locale dashboard', async ({ page }) => {
  await page.goto('/en/app');
  await expect(page).toHaveURL(/\/en\/login/);
  await expect(page.getByRole('heading', { name: /log in/i })).toBeVisible();
});
