'use server';

import { getServerSession } from 'next-auth';
import { revalidatePath } from 'next/cache';
import { ZodError } from 'zod';

import { authOptions } from '@/auth';
import { createTodoForUser } from '@/features/todos/repository';
import { todoInputSchema } from '@/features/todos/schema';
import { type AppLocale, defaultLocale, locales } from '@/i18n/routing';
import { AppError, getAppErrorCode } from '@/lib/errors';
import { TODO_ERROR_CODES } from '@/features/todos/error-codes';

type CreateTodoFn = (input: {
  userId: string;
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
}) => Promise<unknown>;

export function resolveTodoPath(locale?: string, returnTo?: string) {
  if (returnTo?.startsWith('/')) {
    return returnTo;
  }

  const safeLocale = locales.includes((locale ?? defaultLocale) as AppLocale)
    ? (locale as AppLocale | undefined) ?? defaultLocale
    : defaultLocale;

  return `/${safeLocale}/app`;
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

export async function createTodoRecord(createTodo: CreateTodoFn, userId: string, input: {
  title: string;
  description?: string;
  priority?: 'low' | 'medium' | 'high';
  dueDate?: string;
}) {
  try {
    const parsed = todoInputSchema.parse(input);

    return await createTodo({
      userId,
      title: parsed.title,
      description: parsed.description,
      priority: parsed.priority,
      dueDate: parsed.dueDate
    });
  } catch (error) {
    throw normalizeTodoError(error, TODO_ERROR_CODES.CREATE_FAILED);
  }
}

export async function createTodoAction(formData: FormData) {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id?: string } | undefined)?.id;

  if (!userId) {
    throw new AppError(TODO_ERROR_CODES.UNAUTHORIZED);
  }

  await createTodoRecord(
    (input) => createTodoForUser(input.userId, input),
    userId,
    {
      title: String(formData.get('title') ?? ''),
      description: String(formData.get('description') ?? ''),
      priority: (String(formData.get('priority') ?? 'medium') as 'low' | 'medium' | 'high'),
      dueDate: String(formData.get('dueDate') ?? '') || undefined
    }
  );

  revalidatePath(resolveTodoPath(String(formData.get('locale') ?? defaultLocale), String(formData.get('returnTo') ?? '')));
}
