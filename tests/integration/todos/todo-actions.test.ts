import { describe, expect, it, vi } from 'vitest';

import { createTodoRecord } from '@/features/todos/actions/create-todo';
import { deleteTodoRecord } from '@/features/todos/actions/delete-todo';
import { resolveTodoPath, withTodoError, withoutTodoError } from '@/features/todos/actions/shared';
import { updateTodoRecord } from '@/features/todos/actions/update-todo';

describe('todo action helpers', () => {
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

  it('returns a locale-aware dashboard path', () => {
    expect(resolveTodoPath('zh')).toBe('/zh/app');
    expect(resolveTodoPath('en', '/en/app?status=done')).toBe('/en/app?status=done');
  });

  it('adds and removes todo error query params', () => {
    expect(withTodoError('/zh/app?status=done', 'TODO_NOT_FOUND')).toBe('/zh/app?status=done&todoError=TODO_NOT_FOUND');
    expect(withoutTodoError('/zh/app?status=done&todoError=TODO_NOT_FOUND')).toBe('/zh/app?status=done');
  });

  it('maps missing todos to a stable error code when updating', async () => {
    const updateTodo = vi.fn().mockRejectedValue(new Error('Todo not found'));

    await expect(
      updateTodoRecord(updateTodo, 'user-1', {
        id: 'todo-1',
        status: 'done'
      })
    ).rejects.toMatchObject({ code: 'TODO_NOT_FOUND' });
  });

  it('maps unexpected delete failures to a stable error code', async () => {
    const deleteTodo = vi.fn().mockRejectedValue(new Error('boom'));

    await expect(deleteTodoRecord(deleteTodo, 'user-1', 'todo-1')).rejects.toMatchObject({
      code: 'TODO_DELETE_FAILED'
    });
  });
});
