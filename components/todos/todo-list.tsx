import { useTranslations } from 'next-intl';

import { TodoCard } from '@/components/todos/todo-card';

type Todo = {
  id: string;
  title: string;
  description: string | null;
  status: string;
  priority: string;
  dueDate: Date | string | null;
};

export function TodoList({ todos }: { todos: Todo[] }) {
  const t = useTranslations('todos.empty');

  if (todos.length === 0) {
    return (
      <section className="empty-state">
        <h2>{t('title')}</h2>
        <p>{t('description')}</p>
      </section>
    );
  }

  return (
    <section className="todo-list">
      {todos.map((todo) => (
        <TodoCard key={todo.id} todo={todo} />
      ))}
    </section>
  );
}
