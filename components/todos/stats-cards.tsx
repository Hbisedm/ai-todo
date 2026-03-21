import { useTranslations } from 'next-intl';

type Stats = {
  total: number;
  completed: number;
  inProgress: number;
  overdue: number;
};

export function StatsCards({ stats }: { stats: Stats }) {
  const t = useTranslations('dashboard.stats');

  return (
    <section className="stats-grid">
      <article className="stat-card"><span>{t('total')}</span><strong>{stats.total}</strong></article>
      <article className="stat-card"><span>{t('completed')}</span><strong>{stats.completed}</strong></article>
      <article className="stat-card"><span>{t('inProgress')}</span><strong>{stats.inProgress}</strong></article>
      <article className="stat-card"><span>{t('overdue')}</span><strong>{stats.overdue}</strong></article>
    </section>
  );
}
