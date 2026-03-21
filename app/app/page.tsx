import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

import { authOptions } from '@/auth';
import { FilterBar } from '@/components/todos/filter-bar';
import { StatsCards } from '@/components/todos/stats-cards';
import { TodoFormDialog } from '@/components/todos/todo-form-dialog';
import { TodoList } from '@/components/todos/todo-list';
import { getDashboardData } from '@/features/todos/queries';
import { todoFilterSchema } from '@/features/todos/schema';

export default async function AppPage({
  searchParams
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id?: string } | undefined)?.id;

  if (!userId) {
    redirect('/login');
  }

  const rawSearchParams = await searchParams;
  const filters = todoFilterSchema.parse({
    status: typeof rawSearchParams.status === 'string' ? rawSearchParams.status : undefined,
    priority: typeof rawSearchParams.priority === 'string' ? rawSearchParams.priority : undefined
  });

  const { todos, stats } = await getDashboardData(userId, filters);

  return (
    <main className="dashboard-page">
      <section className="dashboard-hero">
        <div>
          <p className="eyebrow">Your TODO dashboard</p>
          <h1>Focus on the next high-impact task.</h1>
          <p className="muted">Track progress, keep priorities visible, and move work forward with a clean workflow.</p>
        </div>
      </section>
      <StatsCards stats={stats} />
      <FilterBar filters={filters} />
      <section className="dashboard-grid">
        <TodoFormDialog />
        <TodoList todos={todos as never[]} />
      </section>
    </main>
  );
}
