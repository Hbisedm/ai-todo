type Stats = {
  total: number;
  completed: number;
  inProgress: number;
  overdue: number;
};

export function StatsCards({ stats }: { stats: Stats }) {
  return (
    <section className="stats-grid">
      <article className="stat-card"><span>Total tasks</span><strong>{stats.total}</strong></article>
      <article className="stat-card"><span>Completed</span><strong>{stats.completed}</strong></article>
      <article className="stat-card"><span>In progress</span><strong>{stats.inProgress}</strong></article>
      <article className="stat-card"><span>Overdue</span><strong>{stats.overdue}</strong></article>
    </section>
  );
}
