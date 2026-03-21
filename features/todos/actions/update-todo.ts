'use server';

import { getServerSession } from 'next-auth';
import { revalidatePath } from 'next/cache';

import { authOptions } from '@/auth';
import { updateTodoForUser } from '@/features/todos/repository';

export async function updateTodoAction(formData: FormData) {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id?: string } | undefined)?.id;

  if (!userId) {
    throw new Error('Unauthorized');
  }

  await updateTodoForUser(userId, {
    id: String(formData.get('id') ?? ''),
    title: String(formData.get('title') ?? ''),
    description: String(formData.get('description') ?? ''),
    priority: String(formData.get('priority') ?? 'medium') as 'low' | 'medium' | 'high',
    dueDate: String(formData.get('dueDate') ?? '') || undefined,
    status: String(formData.get('status') ?? 'todo') as 'todo' | 'in_progress' | 'done'
  });

  revalidatePath('/app');
}
