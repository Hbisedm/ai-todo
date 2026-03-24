import { describe, expect, it } from 'vitest';

import { defaultLocale } from '@/i18n/routing';
import { getPreferredLocale, getRootRedirectPath } from '@/lib/root-redirect';

describe('root redirect helpers', () => {
  it('routes signed-in users to the localized dashboard', () => {
    expect(getRootRedirectPath('zh', true)).toBe('/zh/app');
    expect(getRootRedirectPath('en', true)).toBe('/en/app');
  });

  it('routes signed-out users to the localized landing page', () => {
    expect(getRootRedirectPath('zh', false)).toBe('/zh');
    expect(getRootRedirectPath('en', false)).toBe('/en');
  });

  it('keeps supported locale cookie values', () => {
    expect(getPreferredLocale('zh')).toBe('zh');
    expect(getPreferredLocale('en')).toBe('en');
  });

  it('falls back to the default locale for unsupported cookie values', () => {
    expect(getPreferredLocale('fr')).toBe(defaultLocale);
    expect(getPreferredLocale(undefined)).toBe(defaultLocale);
  });
});
