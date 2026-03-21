import { useTranslations } from 'next-intl';

import { createTodoAction } from '@/features/todos/actions/create-todo';

export function TodoFormDialog() {
  const t = useTranslations('todos.form');

  return (
    <section className="todo-form-card">
      <div>
        <p className="eyebrow">{t('eyebrow')}</p>
        <h2>{t('title')}</h2>
      </div>
      <form action={createTodoAction} className="todo-form">
        <label>
          <span>{t('fields.title')}</span>
          <input name="title" placeholder={t('placeholders.title')} required />
        </label>
        <label>
          <span>{t('fields.description')}</span>
          <textarea name="description" placeholder={t('placeholders.description')} rows={3} />
        </label>
        <div className="todo-form__row">
          <label>
            <span>{t('fields.priority')}</span>
            <select defaultValue="medium" name="priority">
              <option value="low">{t('priority.low')}</option>
              <option value="medium">{t('priority.medium')}</option>
              <option value="high">{t('priority.high')}</option>
            </select>
          </label>
          <label>
            <span>{t('fields.dueDate')}</span>
            <input name="dueDate" type="date" />
          </label>
        </div>
        <button type="submit">{t('submit')}</button>
      </form>
    </section>
  );
}
