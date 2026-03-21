'use server';

import { getServerSession } from 'next-auth';
import { revalidatePath } from 'next/cache';

import { authOptions } from '@/auth';
import { createTodoForUser } from '@/features/todos/repository';
import { todoInputSchema } from '@/features/todos/schema';

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
  const parsed = todoInputSchema.parse(input);

  return createTodo({
    userId,
    title: parsed.title,
    description: parsed.description,
    priority: parsed.priority,
    dueDate: parsed.dueDate
  });
}

export async function createTodoAction(formData: FormData) {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id?: string } | undefined)?.id;

  if (!userId) {
    throw new Error('Unauthorized');
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

  revalidatePath('/app');
}
