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

test('theme switcher does not trigger hydration runtime errors', async ({ page }) => {
  const pageErrors: string[] = [];
  page.on('pageerror', (error) => pageErrors.push(error.message));

  await page.goto('/en');
  await page.getByRole('button', { name: /theme/i }).click();
  await page.getByRole('menuitem', { name: /light/i }).click();
  await page.reload();

  await expect(page.getByRole('button', { name: /theme/i })).toHaveText(/light/i);
  expect(pageErrors).not.toContainEqual(expect.stringMatching(/hydration|server-rendered html/i));
  await expect(page.getByText(/Unhandled Runtime Error/i)).toHaveCount(0);
});

test('language switch changes locale and marketing copy', async ({ page }) => {
  await page.goto('/en');
  await page.getByRole('button', { name: /language/i }).click();
  await page.getByRole('menuitem', { name: /^中文$/ }).click();
  await expect(page).toHaveURL(/\/zh$/);
  await expect(page.getByRole('heading', { name: /清晰地组织你的工作/i })).toBeVisible();
});

test('login errors render in chinese when locale is zh', async ({ page }) => {
  await page.goto('/zh/login');
  await page.getByLabel(/邮箱/i).fill('demo@todoweb.dev');
  await page.getByLabel(/密码/i).fill('wrong-password');
  await page.getByRole('button', { name: /登录/i }).click();
  await expect(page.getByText(/请检查邮箱和密码/i)).toBeVisible();
});

test('signed-in user sees chinese dashboard labels', async ({ page }) => {
  await page.goto('/zh/login');
  await page.getByLabel(/邮箱/i).fill('demo@todoweb.dev');
  await page.getByLabel(/密码/i).fill('password123');
  await page.getByRole('button', { name: /登录/i }).click();
  await expect(page).toHaveURL(/\/zh\/app/);
  await expect(page.getByText(/总任务数/)).toBeVisible();
});

test('todo action errors render in chinese on the dashboard', async ({ page }) => {
  await page.goto('/zh/login');
  await page.getByLabel(/邮箱/i).fill('demo@todoweb.dev');
  await page.getByLabel(/密码/i).fill('password123');
  await page.getByRole('button', { name: /登录/i }).click();
  await expect(page).toHaveURL(/\/zh\/app/);
  await page.goto('/zh/app?todoError=TODO_NOT_FOUND');
  await expect(page.getByText(/未找到该任务/i)).toBeVisible();
});
