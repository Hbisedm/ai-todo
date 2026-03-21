import { useTranslations } from 'next-intl';

import { deleteTodoAction } from '@/features/todos/actions/delete-todo';
import { updateTodoAction } from '@/features/todos/actions/update-todo';

type Todo = {
  id: string;
  title: string;
  description: string | null;
  status: string;
  priority: string;
  dueDate: Date | string | null;
};

const nextStatus: Record<string, 'todo' | 'in_progress' | 'done'> = {
  TODO: 'in_progress',
  IN_PROGRESS: 'done',
  DONE: 'todo'
};

export function TodoCard({ todo }: { todo: Todo }) {
  const t = useTranslations('todos.card');
  const dueDate = todo.dueDate ? new Date(todo.dueDate) : null;

  return (
    <article className="todo-card">
      <div className="todo-card__top">
        <div>
          <h3>{todo.title}</h3>
          {todo.description ? <p>{todo.description}</p> : <p className="muted">{t('noDescription')}</p>}
        </div>
        <div className="todo-meta">
          <span className="badge">{t(`status.${todo.status}`)}</span>
          <span className="badge badge-secondary">{t(`priority.${todo.priority}`)}</span>
        </div>
      </div>
      <div className="todo-card__bottom">
        <span>{dueDate ? `${t('due')} ${dueDate.toLocaleDateString()}` : t('noDueDate')}</span>
        <div className="todo-actions">
          <form action={updateTodoAction}>
            <input name="id" type="hidden" value={todo.id} />
            <input name="status" type="hidden" value={nextStatus[todo.status] ?? 'todo'} />
            <button type="submit">{t('advanceStatus')}</button>
          </form>
          <form action={deleteTodoAction}>
            <input name="id" type="hidden" value={todo.id} />
            <button className="danger-button" type="submit">{t('delete')}</button>
          </form>
        </div>
      </div>
    </article>
  );
}
