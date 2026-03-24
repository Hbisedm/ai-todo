import { beforeEach, describe, expect, it, vi } from 'vitest';

const { redirectMock, cookiesMock, getServerSessionMock } = vi.hoisted(() => ({
  redirectMock: vi.fn(),
  cookiesMock: vi.fn(),
  getServerSessionMock: vi.fn()
}));

vi.mock('next/navigation', () => ({
  redirect: redirectMock
}));

vi.mock('next/headers', () => ({
  cookies: cookiesMock
}));

vi.mock('next-auth', () => ({
  getServerSession: getServerSessionMock
}));

vi.mock('@/auth', () => ({
  authOptions: {}
}));

describe('RootPage', () => {
  beforeEach(() => {
    vi.resetModules();
    redirectMock.mockReset();
    cookiesMock.mockReset();
    getServerSessionMock.mockReset();
  });

  it('redirects signed-in users to their localized app', async () => {
    cookiesMock.mockReturnValue({
      get: vi.fn().mockReturnValue({ value: 'zh' })
    });
    getServerSessionMock.mockResolvedValue({ user: { id: 'user-1' } });

    const { default: RootPage } = await import('@/app/page');

    await RootPage();

    expect(redirectMock).toHaveBeenCalledWith('/zh/app');
  });

  it('redirects signed-out users to the localized landing page', async () => {
    cookiesMock.mockReturnValue({
      get: vi.fn().mockReturnValue(undefined)
    });
    getServerSessionMock.mockResolvedValue(null);

    const { default: RootPage } = await import('@/app/page');

    await RootPage();

    expect(redirectMock).toHaveBeenCalledWith('/en');
  });
});
