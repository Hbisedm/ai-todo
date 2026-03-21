import { useTranslations } from 'next-intl';

import { deleteTodoAction } from '@/features/todos/actions/delete-todo';
import { updateTodoAction } from '@/features/todos/actions/update-todo';
import type { AppLocale } from '@/i18n/routing';

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

export function TodoCard({ todo, locale, returnTo }: { todo: Todo; locale: AppLocale; returnTo: string }) {
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
            <input name="locale" type="hidden" value={locale} />
            <input name="returnTo" type="hidden" value={returnTo} />
            <button type="submit">{t('advanceStatus')}</button>
          </form>
          <form action={deleteTodoAction}>
            <input name="id" type="hidden" value={todo.id} />
            <input name="locale" type="hidden" value={locale} />
            <input name="returnTo" type="hidden" value={returnTo} />
            <button className="danger-button" type="submit">{t('delete')}</button>
          </form>
        </div>
      </div>
    </article>
  );
}
