'use server';

import { getServerSession } from 'next-auth';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { authOptions } from '@/auth';
import { TODO_ERROR_CODES } from '@/features/todos/error-codes';
import { updateTodoForUser } from '@/features/todos/repository';
import { defaultLocale } from '@/i18n/routing';
import { AppError } from '@/lib/errors';
import { normalizeTodoError, resolveTodoPath, withTodoError, withoutTodoError } from '@/features/todos/actions/shared';

type UpdateTodoFn = (userId: string, input: {
  id: string;
  title?: string;
  description?: string;
  priority?: 'low' | 'medium' | 'high';
  dueDate?: string;
  status?: 'todo' | 'in_progress' | 'done';
}) => Promise<unknown>;

export async function updateTodoRecord(updateTodo: UpdateTodoFn, userId: string, input: {
  id: string;
  title?: string;
  description?: string;
  priority?: 'low' | 'medium' | 'high';
  dueDate?: string;
  status?: 'todo' | 'in_progress' | 'done';
}) {
  try {
    return await updateTodo(userId, input);
  } catch (error) {
    throw normalizeTodoError(error, TODO_ERROR_CODES.UPDATE_FAILED);
  }
}

export async function updateTodoAction(formData: FormData) {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id?: string } | undefined)?.id;
  const path = resolveTodoPath(String(formData.get('locale') ?? defaultLocale), String(formData.get('returnTo') ?? ''));

  if (!userId) {
    throw new AppError(TODO_ERROR_CODES.UNAUTHORIZED);
  }

  try {
    await updateTodoRecord(
      updateTodoForUser,
      userId,
      {
        id: String(formData.get('id') ?? ''),
        title: String(formData.get('title') ?? ''),
        description: String(formData.get('description') ?? ''),
        priority: String(formData.get('priority') ?? 'medium') as 'low' | 'medium' | 'high',
        dueDate: String(formData.get('dueDate') ?? '') || undefined,
        status: String(formData.get('status') ?? 'todo') as 'todo' | 'in_progress' | 'done'
      }
    );
  } catch (error) {
    const todoError = normalizeTodoError(error, TODO_ERROR_CODES.UPDATE_FAILED);
    redirect(withTodoError(path, todoError.code));
  }

  const nextPath = withoutTodoError(path);
  revalidatePath(nextPath);
  redirect(nextPath);
}
