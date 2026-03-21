import { getTranslations } from 'next-intl/server';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

import { authOptions } from '@/auth';
import { FilterBar } from '@/components/todos/filter-bar';
import { StatsCards } from '@/components/todos/stats-cards';
import { TodoFormDialog } from '@/components/todos/todo-form-dialog';
import { TodoList } from '@/components/todos/todo-list';
import { TODO_ERROR_CODE_VALUES } from '@/features/todos/error-codes';
import { getDashboardData } from '@/features/todos/queries';
import { todoFilterSchema } from '@/features/todos/schema';
import type { AppLocale } from '@/i18n/routing';

function buildReturnTo(locale: AppLocale, filters: { status?: string; priority?: string }) {
  const params = new URLSearchParams();

  if (filters.status && filters.status !== 'all') {
    params.set('status', filters.status);
  }

  if (filters.priority && filters.priority !== 'all') {
    params.set('priority', filters.priority);
  }

  const query = params.toString();
  return query ? `/${locale}/app?${query}` : `/${locale}/app`;
}

export default async function AppPage({
  params,
  searchParams
}: {
  params: Promise<{ locale: AppLocale }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { locale } = await params;
  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id?: string } | undefined)?.id;

  if (!userId) {
    redirect(`/${locale}/login`);
  }

  const dashboardT = await getTranslations('dashboard');
  const todoErrorT = await getTranslations('todos.errors');
  const rawSearchParams = await searchParams;
  const filters = todoFilterSchema.parse({
    status: typeof rawSearchParams.status === 'string' ? rawSearchParams.status : undefined,
    priority: typeof rawSearchParams.priority === 'string' ? rawSearchParams.priority : undefined
  });
  const returnTo = buildReturnTo(locale, filters);
  const todoErrorCode = typeof rawSearchParams.todoError === 'string' ? rawSearchParams.todoError : undefined;
  const todoErrorMessage = todoErrorCode && TODO_ERROR_CODE_VALUES.includes(todoErrorCode as never)
    ? todoErrorT(todoErrorCode as never)
    : null;
  const { todos, stats } = await getDashboardData(userId, filters);

  return (
    <main className="dashboard-page">
      <section className="dashboard-hero">
        <div>
          <p className="eyebrow">{dashboardT('eyebrow')}</p>
          <h1>{dashboardT('title')}</h1>
          <p className="muted">{dashboardT('subtitle')}</p>
        </div>
      </section>
      {todoErrorMessage ? <p className="page-error-banner">{todoErrorMessage}</p> : null}
      <StatsCards stats={stats} />
      <FilterBar filters={filters} />
      <section className="dashboard-grid">
        <TodoFormDialog locale={locale} returnTo={returnTo} />
        <TodoList locale={locale} returnTo={returnTo} todos={todos as never[]} />
      </section>
    </main>
  );
}
