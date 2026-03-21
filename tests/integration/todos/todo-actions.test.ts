import { describe, expect, it, vi } from 'vitest';
import { createTodoRecord } from '@/features/todos/actions/create-todo';

describe('createTodoRecord', () => {
  it('creates a todo for the provided user id', async () => {
    const createTodo = vi.fn().mockResolvedValue({ id: 'todo-1' });

    await createTodoRecord(createTodo, 'user-1', {
      title: 'Ship portfolio',
      priority: 'high'
    });

    expect(createTodo).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: 'user-1',
        title: 'Ship portfolio',
        priority: 'high'
      })
    );
  });
});
