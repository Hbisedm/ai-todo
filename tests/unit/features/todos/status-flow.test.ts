import { describe, expect, it } from 'vitest';

import { getNextTodoStatus } from '@/features/todos/status-flow';

describe('todo status flow', () => {
  it('treats done as a terminal status', () => {
    expect(getNextTodoStatus('TODO')).toBe('in_progress');
    expect(getNextTodoStatus('IN_PROGRESS')).toBe('done');
    expect(getNextTodoStatus('DONE')).toBeNull();
  });
});
