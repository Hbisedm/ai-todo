'use server';

import { getServerSession } from 'next-auth';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { authOptions } from '@/auth';
import { TODO_ERROR_CODES } from '@/features/todos/error-codes';
import { createTodoForUser } from '@/features/todos/repository';
import { todoInputSchema } from '@/features/todos/schema';
import { defaultLocale } from '@/i18n/routing';
import { AppError } from '@/lib/errors';
import { normalizeTodoError, resolveTodoPath, withTodoError, withoutTodoError } from '@/features/todos/actions/shared';

type CreateTodoFn = (input: {
  userId: string;
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
}) => Promise<unknown>;

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
  const path = resolveTodoPath(String(formData.get('locale') ?? defaultLocale), String(formData.get('returnTo') ?? ''));

  if (!userId) {
    throw new AppError(TODO_ERROR_CODES.UNAUTHORIZED);
  }

  try {
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
  } catch (error) {
    const todoError = normalizeTodoError(error, TODO_ERROR_CODES.CREATE_FAILED);
    redirect(withTodoError(path, todoError.code));
  }

  const nextPath = withoutTodoError(path);
  revalidatePath(nextPath);
  redirect(nextPath);
}
