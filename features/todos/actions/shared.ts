import { ZodError } from 'zod';

import { TODO_ERROR_CODES } from '@/features/todos/error-codes';
import { type AppLocale, defaultLocale, locales } from '@/i18n/routing';
import { AppError, getAppErrorCode } from '@/lib/errors';

export function resolveTodoPath(locale?: string, returnTo?: string) {
  if (returnTo?.startsWith('/')) {
    return returnTo;
  }

  const safeLocale = locales.includes((locale ?? defaultLocale) as AppLocale)
    ? ((locale as AppLocale | undefined) ?? defaultLocale)
    : defaultLocale;

  return `/${safeLocale}/app`;
}

export function withoutTodoError(path: string) {
  const [pathname, query = ''] = path.split('?');
  const params = new URLSearchParams(query);

  params.delete('todoError');

  const nextQuery = params.toString();
  return nextQuery ? `${pathname}?${nextQuery}` : pathname;
}

export function withTodoError(path: string, code: string) {
  const [pathname, query = ''] = withoutTodoError(path).split('?');
  const params = new URLSearchParams(query);

  params.set('todoError', code);

  const nextQuery = params.toString();
  return nextQuery ? `${pathname}?${nextQuery}` : pathname;
}

export function normalizeTodoError(error: unknown, fallbackCode: string) {
  if (error instanceof ZodError) {
    return new AppError(TODO_ERROR_CODES.VALIDATION_FAILED);
  }

  const code = getAppErrorCode(error);

  if (code) {
    return new AppError(code);
  }

  if (error instanceof Error && error.message === 'Todo not found') {
    return new AppError(TODO_ERROR_CODES.NOT_FOUND);
  }

  return new AppError(fallbackCode);
}
