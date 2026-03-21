import { describe, expect, it, vi } from 'vitest';
import { listTodosForUser } from '@/features/todos/repository';

describe('listTodosForUser', () => {
  it('only requests todos for the current user', async () => {
    const findMany = vi.fn().mockResolvedValue([]);

    await listTodosForUser(
      'user-1',
      undefined,
      { todo: { findMany } } as never
    );

    expect(findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ userId: 'user-1' })
      })
    );
  });
});
