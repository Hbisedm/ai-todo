import { test, expect } from '@playwright/test';

test('landing page shows the product headline', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: /organize your work/i })).toBeVisible();
  await expect(page.getByRole('link', { name: /log in/i })).toBeVisible();
  await expect(page.getByRole('link', { name: /get started/i })).toBeVisible();
  await expect(page.getByRole('heading', { name: /real authentication/i })).toBeVisible();
  await expect(page.getByText(/task dashboard preview/i).first()).toBeVisible();
});

test('redirects unauthenticated users away from /app', async ({ page }) => {
  await page.goto('/app');
  await expect(page).toHaveURL(/\/login/);
  await expect(page.getByRole('heading', { name: /log in/i })).toBeVisible();
});
