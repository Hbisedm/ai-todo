const features = [
  {
    title: 'Real authentication',
    description: 'Credential sign-in, protected routes, and user-scoped task data.'
  },
  {
    title: 'Card-first dashboard',
    description: 'A polished layout with stats, focus areas, and clean task grouping.'
  },
  {
    title: 'Portfolio-ready architecture',
    description: 'Next.js, Prisma, and a structured domain layer you can confidently explain.'
  }
];

export function FeatureGrid() {
  return (
    <section className="feature-grid">
      {features.map((feature) => (
        <article className="feature-card" key={feature.title}>
          <h2>{feature.title}</h2>
          <p>{feature.description}</p>
        </article>
      ))}
    </section>
  );
}
