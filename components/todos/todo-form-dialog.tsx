import { createTodoAction } from '@/features/todos/actions/create-todo';

export function TodoFormDialog() {
  return (
    <section className="todo-form-card">
      <div>
        <p className="eyebrow">New task</p>
        <h2>Add something meaningful</h2>
      </div>
      <form action={createTodoAction} className="todo-form">
        <label>
          <span>Title</span>
          <input name="title" placeholder="Ship portfolio" required />
        </label>
        <label>
          <span>Description</span>
          <textarea name="description" placeholder="Optional details" rows={3} />
        </label>
        <div className="todo-form__row">
          <label>
            <span>Priority</span>
            <select defaultValue="medium" name="priority">
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </label>
          <label>
            <span>Due date</span>
            <input name="dueDate" type="date" />
          </label>
        </div>
        <button type="submit">Create task</button>
      </form>
    </section>
  );
}
