import { expect, test } from '@playwright/test';

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

test('todo cards keep badges readable beside long content and keep strong button contrast', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1200 });
  await page.goto('/zh/login');
  await page.getByLabel(/邮箱/i).fill('demo@todoweb.dev');
  await page.getByLabel(/密码/i).fill('password123');
  await page.getByRole('button', { name: /登录/i }).click();
  await expect(page).toHaveURL(/\/zh\/app/);

  const uniqueTitle = `超长布局回归-${Date.now()}`;
  await page.getByLabel(/标题/i).fill(`${uniqueTitle} 这是一个特别特别特别特别特别特别特别特别长的任务标题，用来检查内容过长时右侧状态标签和优先级标签不会被挤压`);
  await page.getByLabel(/描述/i).fill('这里再放一段很长很长的描述文本，模拟真实使用场景下用户输入很多内容，看看卡片布局是否还能保持稳定。');
  await page.getByRole('button', { name: /创建任务/i }).click();

  const card = page.locator('.todo-card', {
    has: page.getByRole('heading', { name: new RegExp(uniqueTitle) })
  }).first();
  await expect(card).toBeVisible();

  const layout = await card.evaluate((element) => {
    const top = element.querySelector('.todo-card__top');
    const content = element.querySelector('.todo-card__content');
    const meta = element.querySelector('.todo-meta');
    const button = element.querySelector('.todo-actions button');

    return {
      topDisplay: top ? getComputedStyle(top).display : null,
      contentMinWidth: content ? getComputedStyle(content).minWidth : null,
      metaFlexShrink: meta ? getComputedStyle(meta).flexShrink : null,
      buttonColor: button ? getComputedStyle(button).color : null
    };
  });

  expect(layout.topDisplay).toBe('grid');
  expect(layout.contentMinWidth).toBe('0px');
  expect(layout.metaFlexShrink).toBe('0');
  expect(layout.buttonColor).toBe('rgb(248, 250, 252)');
});

test('signed-in users visiting root land on their localized dashboard', async ({ page }) => {
  await page.goto('/en/login');
  await page.getByLabel(/email/i).fill('demo@todoweb.dev');
  await page.getByLabel(/password/i).fill('password123');
  await page.getByRole('button', { name: /log in/i }).click();
  await expect(page).toHaveURL(/\/en\/app/);

  await page.goto('/');

  await expect(page).toHaveURL(/\/en\/app/);
});

test('signed-in user can log out from the account menu', async ({ page }) => {
  await page.goto('/en/login');
  await page.getByLabel(/email/i).fill('demo@todoweb.dev');
  await page.getByLabel(/password/i).fill('password123');
  await page.getByRole('button', { name: /log in/i }).click();
  await expect(page).toHaveURL(/\/en\/app/);

  await page.getByRole('button', { name: /demo user/i }).click();
  await expect(page.getByRole('menuitem', { name: /log out/i })).toBeVisible();
  await page.getByRole('menuitem', { name: /log out/i }).click();

  await expect(page).toHaveURL(/\/en\/login/);
});
