import { describe, expect, it } from 'vitest';

import { authOptions } from '@/auth';

describe('authOptions', () => {
  it('keeps login sessions alive for 10 days', () => {
    expect(authOptions.session?.strategy).toBe('jwt');
    expect(authOptions.session?.maxAge).toBe(60 * 60 * 24 * 10);
    expect(authOptions.jwt?.maxAge).toBe(60 * 60 * 24 * 10);
  });
});
