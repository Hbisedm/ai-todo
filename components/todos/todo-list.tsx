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
  if (todos.length === 0) {
    return (
      <section className="empty-state">
        <h2>No tasks yet</h2>
        <p>Create your first task to bring this dashboard to life.</p>
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
