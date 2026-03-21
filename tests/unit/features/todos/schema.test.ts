import { describe, expect, it } from 'vitest';
import { todoInputSchema } from '@/features/todos/schema';

describe('todoInputSchema', () => {
  it('requires a title and accepts an optional due date', () => {
    const result = todoInputSchema.safeParse({
      title: '',
      priority: 'high'
    });

    expect(result.success).toBe(false);
  });
});
