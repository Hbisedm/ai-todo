'use server';

import { getServerSession } from 'next-auth';
import { revalidatePath } from 'next/cache';

import { authOptions } from '@/auth';
import { deleteTodoForUser } from '@/features/todos/repository';

export async function deleteTodoAction(formData: FormData) {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id?: string } | undefined)?.id;

  if (!userId) {
    throw new Error('Unauthorized');
  }

  await deleteTodoForUser(userId, String(formData.get('id') ?? ''));
  revalidatePath('/app');
}
