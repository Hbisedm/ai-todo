import { describe, expect, it } from 'vitest';

import { AppError, getAppErrorCode, isAppError } from '@/lib/errors';

describe('lib/errors', () => {
  it('recognizes AppError instances', () => {
    const error = new AppError('TODO_NOT_FOUND');

    expect(isAppError(error)).toBe(true);
    expect(getAppErrorCode(error)).toBe('TODO_NOT_FOUND');
  });

  it('extracts serializable error codes from plain objects', () => {
    expect(getAppErrorCode({ code: 'AUTH_EMAIL_TAKEN' })).toBe('AUTH_EMAIL_TAKEN');
    expect(getAppErrorCode({ message: 'nope' })).toBeUndefined();
  });
});
