import { describe, expect, it } from 'vitest';
import { envSchema } from '@/lib/env';

describe('envSchema', () => {
  it('rejects when DATABASE_URL is missing', () => {
    const result = envSchema.safeParse({ AUTH_SECRET: 'secret' });
    expect(result.success).toBe(false);
  });
});
