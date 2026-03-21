import { describe, expect, it } from 'vitest';
import { defaultLocale, locales } from '@/i18n/routing';

describe('i18n routing', () => {
  it('supports zh and en with en as default', () => {
    expect(locales).toEqual(['en', 'zh']);
    expect(defaultLocale).toBe('en');
  });
});
