import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';

import type { TodoFilters } from '@/features/todos/schema';

const statusFilters = [
  { key: 'all', value: 'all' },
  { key: 'todo', value: 'todo' },
  { key: 'inProgress', value: 'in_progress' },
  { key: 'done', value: 'done' }
] as const;

const priorityFilters = [
  { key: 'anyPriority', value: 'all' },
  { key: 'high', value: 'high' },
  { key: 'medium', value: 'medium' },
  { key: 'low', value: 'low' }
] as const;

function buildHref(locale: string, filters: TodoFilters, next: Partial<TodoFilters>) {
  const params = new URLSearchParams();
  const merged = { ...filters, ...next };

  if (merged.status && merged.status !== 'all') params.set('status', merged.status);
  if (merged.priority && merged.priority !== 'all') params.set('priority', merged.priority);

  const query = params.toString();
  return query ? `/${locale}/app?${query}` : `/${locale}/app`;
}

export function FilterBar({ filters }: { filters: TodoFilters }) {
  const locale = useLocale();
  const t = useTranslations('dashboard.filters');

  return (
    <section className="filter-panel">
      <div className="filter-group">
        {statusFilters.map((filter) => (
          <Link className={`filter-chip ${filters.status === filter.value || (!filters.status && filter.value === 'all') ? 'active' : ''}`} href={buildHref(locale, filters, { status: filter.value })} key={filter.value}>
            {t(filter.key)}
          </Link>
        ))}
      </div>
      <div className="filter-group">
        {priorityFilters.map((filter) => (
          <Link className={`filter-chip ${filters.priority === filter.value || (!filters.priority && filter.value === 'all') ? 'active' : ''}`} href={buildHref(locale, filters, { priority: filter.value })} key={filter.value}>
            {t(filter.key)}
          </Link>
        ))}
      </div>
    </section>
  );
}
