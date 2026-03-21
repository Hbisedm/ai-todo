import { defineConfig } from '@playwright/test';

const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? 'http://127.0.0.1:3000';

export default defineConfig({
  testDir: './tests/e2e',
  use: {
    baseURL
  },
  webServer: {
    command: 'corepack pnpm dev',
    url: baseURL,
    reuseExistingServer: false,
    timeout: 120000,
    env: {
      AUTH_SECRET: process.env.AUTH_SECRET ?? 'test-secret',
      DATABASE_URL: process.env.DATABASE_URL ?? 'postgresql://postgres:postgres@localhost:5432/todo_web',
      NEXTAUTH_URL: baseURL
    }
  }
});
