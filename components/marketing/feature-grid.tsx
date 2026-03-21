import { useTranslations } from 'next-intl';

const featureKeys = ['auth', 'dashboard', 'architecture'] as const;

export function FeatureGrid() {
  const t = useTranslations('marketing.features');

  return (
    <section className="feature-grid">
      {featureKeys.map((featureKey) => (
        <article className="feature-card" key={featureKey}>
          <h2>{t(`${featureKey}.title`)}</h2>
          <p>{t(`${featureKey}.description`)}</p>
        </article>
      ))}
    </section>
  );
}
