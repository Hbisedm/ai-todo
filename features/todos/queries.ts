import { countOverdueTodos, countTodosByStatus, listTodosForUser } from '@/features/todos/repository';
import type { TodoFilters } from '@/features/todos/schema';

export async function getDashboardData(userId: string, filters: TodoFilters) {
  const [todos, total, completed, inProgress, overdue] = await Promise.all([
    listTodosForUser(userId, filters),
    countTodosByStatus(userId, 'all'),
    countTodosByStatus(userId, 'done'),
    countTodosByStatus(userId, 'in_progress'),
    countOverdueTodos(userId)
  ]);

  return {
    todos,
    stats: {
      total,
      completed,
      inProgress,
      overdue
    }
  };
}
