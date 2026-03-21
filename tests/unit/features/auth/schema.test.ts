import { describe, expect, it } from 'vitest';
import { registerSchema } from '@/features/auth/schema';

describe('registerSchema', () => {
  it('requires a valid email and matching passwords', () => {
    const result = registerSchema.safeParse({
      name: '',
      email: 'bad-email',
      password: '123',
      confirmPassword: '456'
    });

    expect(result.success).toBe(false);
  });
});
