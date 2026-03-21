import { getTranslations } from 'next-intl/server';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

import { authOptions } from '@/auth';
import { FilterBar } from '@/components/todos/filter-bar';
import { StatsCards } from '@/components/todos/stats-cards';
import { TodoFormDialog } from '@/components/todos/todo-form-dialog';
import { TodoList } from '@/components/todos/todo-list';
import { getDashboardData } from '@/features/todos/queries';
import { todoFilterSchema } from '@/features/todos/schema';
import type { AppLocale } from '@/i18n/routing';

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

  const t = await getTranslations('dashboard');
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
          <p className="eyebrow">{t('eyebrow')}</p>
          <h1>{t('title')}</h1>
          <p className="muted">{t('subtitle')}</p>
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
