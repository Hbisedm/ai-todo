import { db } from '@/lib/db';
import type { TodoFilters } from '@/features/todos/schema';

const statusMap = {
  todo: 'TODO',
  in_progress: 'IN_PROGRESS',
  done: 'DONE'
} as const;

const priorityMap = {
  low: 'LOW',
  medium: 'MEDIUM',
  high: 'HIGH'
} as const;

type TodoDb = {
  todo: {
    findMany: (args: unknown) => Promise<unknown>;
    count: (args: unknown) => Promise<number>;
    create: (args: unknown) => Promise<unknown>;
    updateMany: (args: unknown) => Promise<{ count: number }>;
    deleteMany: (args: unknown) => Promise<{ count: number }>;
  };
};

export async function listTodosForUser(userId: string, filters?: TodoFilters, client: TodoDb = db as never) {
  return client.todo.findMany({
    where: {
      userId,
      ...(filters?.status && filters.status !== 'all' ? { status: statusMap[filters.status] } : {}),
      ...(filters?.priority && filters.priority !== 'all' ? { priority: priorityMap[filters.priority] } : {})
    },
    orderBy: [{ status: 'asc' }, { dueDate: 'asc' }, { createdAt: 'desc' }]
  });
}

export async function countTodosByStatus(userId: string, status: 'all' | 'todo' | 'in_progress' | 'done', client: TodoDb = db as never) {
  return client.todo.count({
    where: {
      userId,
      ...(status !== 'all' ? { status: statusMap[status] } : {})
    }
  });
}

export async function countOverdueTodos(userId: string, client: TodoDb = db as never) {
  return client.todo.count({
    where: {
      userId,
      dueDate: { lt: new Date() },
      status: { not: 'DONE' }
    }
  });
}

export async function createTodoForUser(userId: string, input: {
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
  status?: 'todo' | 'in_progress' | 'done';
}, client: TodoDb = db as never) {
  return client.todo.create({
    data: {
      userId,
      title: input.title,
      description: input.description || '',
      priority: priorityMap[input.priority],
      status: statusMap[input.status ?? 'todo'],
      dueDate: input.dueDate ? new Date(input.dueDate) : null
    }
  });
}

export async function updateTodoForUser(userId: string, input: {
  id: string;
  title?: string;
  description?: string;
  priority?: 'low' | 'medium' | 'high';
  dueDate?: string;
  status?: 'todo' | 'in_progress' | 'done';
}, client: TodoDb = db as never) {
  const result = await client.todo.updateMany({
    where: { id: input.id, userId },
    data: {
      ...(input.title !== undefined ? { title: input.title } : {}),
      ...(input.description !== undefined ? { description: input.description } : {}),
      ...(input.priority ? { priority: priorityMap[input.priority] } : {}),
      ...(input.status ? { status: statusMap[input.status] } : {}),
      ...(input.dueDate !== undefined ? { dueDate: input.dueDate ? new Date(input.dueDate) : null } : {})
    }
  });

  if (result.count === 0) {
    throw new Error('Todo not found');
  }
}

export async function deleteTodoForUser(userId: string, todoId: string, client: TodoDb = db as never) {
  const result = await client.todo.deleteMany({
    where: { id: todoId, userId }
  });

  if (result.count === 0) {
    throw new Error('Todo not found');
  }
}
