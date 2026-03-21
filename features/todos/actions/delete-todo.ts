'use server';

import { getServerSession } from 'next-auth';
import { revalidatePath } from 'next/cache';

import { authOptions } from '@/auth';
import { normalizeTodoError, resolveTodoPath } from '@/features/todos/actions/create-todo';
import { TODO_ERROR_CODES } from '@/features/todos/error-codes';
import { deleteTodoForUser } from '@/features/todos/repository';
import { defaultLocale } from '@/i18n/routing';
import { AppError } from '@/lib/errors';

type DeleteTodoFn = (userId: string, todoId: string) => Promise<unknown>;

export async function deleteTodoRecord(deleteTodo: DeleteTodoFn, userId: string, todoId: string) {
  try {
    return await deleteTodo(userId, todoId);
  } catch (error) {
    throw normalizeTodoError(error, TODO_ERROR_CODES.DELETE_FAILED);
  }
}

export async function deleteTodoAction(formData: FormData) {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id?: string } | undefined)?.id;

  if (!userId) {
    throw new AppError(TODO_ERROR_CODES.UNAUTHORIZED);
  }

  await deleteTodoRecord(deleteTodoForUser, userId, String(formData.get('id') ?? ''));
  revalidatePath(resolveTodoPath(String(formData.get('locale') ?? defaultLocale), String(formData.get('returnTo') ?? '')));
}
