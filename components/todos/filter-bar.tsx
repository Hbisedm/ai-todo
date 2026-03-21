import Link from 'next/link';

import type { TodoFilters } from '@/features/todos/schema';

const statusFilters = [
  { label: 'All', value: 'all' },
  { label: 'Todo', value: 'todo' },
  { label: 'In progress', value: 'in_progress' },
  { label: 'Done', value: 'done' }
] as const;

const priorityFilters = [
  { label: 'Any priority', value: 'all' },
  { label: 'High priority', value: 'high' },
  { label: 'Medium priority', value: 'medium' },
  { label: 'Low priority', value: 'low' }
] as const;

function buildHref(filters: TodoFilters, next: Partial<TodoFilters>) {
  const params = new URLSearchParams();
  const merged = { ...filters, ...next };

  if (merged.status && merged.status !== 'all') params.set('status', merged.status);
  if (merged.priority && merged.priority !== 'all') params.set('priority', merged.priority);

  const query = params.toString();
  return query ? `/app?${query}` : '/app';
}

export function FilterBar({ filters }: { filters: TodoFilters }) {
  return (
    <section className="filter-panel">
      <div className="filter-group">
        {statusFilters.map((filter) => (
          <Link className={`filter-chip ${filters.status === filter.value || (!filters.status && filter.value === 'all') ? 'active' : ''}`} href={buildHref(filters, { status: filter.value })} key={filter.value}>
            {filter.label}
          </Link>
        ))}
      </div>
      <div className="filter-group">
        {priorityFilters.map((filter) => (
          <Link className={`filter-chip ${filters.priority === filter.value || (!filters.priority && filter.value === 'all') ? 'active' : ''}`} href={buildHref(filters, { priority: filter.value })} key={filter.value}>
            {filter.label}
          </Link>
        ))}
      </div>
    </section>
  );
}
