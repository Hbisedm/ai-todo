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

test('dashboard keeps a roomy two-column layout on desktop', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1200 });
  await page.goto('/zh/login');
  await page.getByLabel(/邮箱/i).fill('demo@todoweb.dev');
  await page.getByLabel(/密码/i).fill('password123');
  await page.getByRole('button', { name: /登录/i }).click();
  await expect(page).toHaveURL(/\/zh\/app/);

  const gridTemplateColumns = await page.locator('.dashboard-grid').evaluate((element) =>
    getComputedStyle(element).gridTemplateColumns
  );
  const formWidth = await page.locator('.todo-form-card').evaluate((element) => element.getBoundingClientRect().width);

  expect(gridTemplateColumns.trim().split(/\s+/)).toHaveLength(2);
  expect(formWidth).toBeGreaterThanOrEqual(380);
  await expect(page.getByRole('heading', { name: /添加真正重要的事情/i })).toBeVisible();
});
