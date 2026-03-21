import { test, expect } from '@playwright/test';

test('english landing page shows translated marketing copy', async ({ page }) => {
  await page.goto('/en');
  await expect(page.getByRole('heading', { name: /organize your work with clarity/i })).toBeVisible();
  await expect(page.getByRole('link', { name: /get started/i })).toBeVisible();
});

test('redirects unauthenticated users away from /app', async ({ page }) => {
  await page.goto('/app');
  await expect(page).toHaveURL(/\/login/);
  await expect(page.getByRole('heading', { name: /log in/i })).toBeVisible();
});
