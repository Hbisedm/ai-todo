import { describe, expect, it, vi } from 'vitest';
import { registerUser } from '@/features/auth/actions/register';

describe('registerUser', () => {
  it('hashes the password before creating a user', async () => {
    const createUser = vi.fn().mockResolvedValue({ id: 'user-1' });

    await registerUser(createUser, {
      name: 'Sam',
      email: 'sam@example.com',
      password: 'password123',
      confirmPassword: 'password123'
    });

    expect(createUser).toHaveBeenCalledWith(
      expect.objectContaining({
        email: 'sam@example.com',
        passwordHash: expect.not.stringContaining('password123')
      })
    );
  });
});
