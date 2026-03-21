import { useTranslations } from 'next-intl';

const statKeys = ['total', 'completed', 'overdue'] as const;
const lineKeys = ['launch', 'register', 'emptyState'] as const;

export function ProductPreview() {
  const t = useTranslations('marketing.preview');

  return (
    <section className="product-preview">
      <div>
        <p className="eyebrow">{t('eyebrow')}</p>
        <h2>{t('title')}</h2>
        <p>{t('description')}</p>
      </div>
      <div className="preview-panel">
        <div className="preview-panel__stats">
          {statKeys.map((statKey) => (
            <div key={statKey}><strong>{t(`stats.${statKey}.value`)}</strong><span>{t(`stats.${statKey}.label`)}</span></div>
          ))}
        </div>
        <div className="preview-panel__list">
          {lineKeys.map((lineKey) => (
            <div className="preview-line" key={lineKey}><strong>{t(`lines.${lineKey}.title`)}</strong><span>{t(`lines.${lineKey}.meta`)}</span></div>
          ))}
        </div>
      </div>
    </section>
  );
}
