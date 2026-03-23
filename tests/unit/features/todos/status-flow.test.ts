import { describe, expect, it } from 'vitest';

import { getNextTodoStatus, getTodoAdvanceActionKey } from '@/features/todos/status-flow';

describe('todo status flow', () => {
  it('treats done as a terminal status', () => {
    expect(getNextTodoStatus('TODO')).toBe('in_progress');
    expect(getNextTodoStatus('IN_PROGRESS')).toBe('done');
    expect(getNextTodoStatus('DONE')).toBeNull();
  });

  it('uses action labels that match the next step', () => {
    expect(getTodoAdvanceActionKey('TODO')).toBe('start');
    expect(getTodoAdvanceActionKey('IN_PROGRESS')).toBe('markDone');
    expect(getTodoAdvanceActionKey('DONE')).toBeNull();
  });
});
