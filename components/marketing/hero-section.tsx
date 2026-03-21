import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';

export function HeroSection() {
  const locale = useLocale();
  const t = useTranslations('marketing.hero');

  return (
    <section className="hero-section">
      <div className="hero-copy">
        <span className="eyebrow">{t('eyebrow')}</span>
        <h1>{t('title')}</h1>
        <p>{t('description')}</p>
        <div className="hero-actions">
          <Link className="cta-link" href={`/${locale}/register`}>{t('primaryCta')}</Link>
          <Link className="ghost-link" href={`/${locale}/login`}>{t('secondaryCta')}</Link>
        </div>
      </div>
      <div className="hero-card">
        <p className="muted">{t('previewLabel')}</p>
        <div className="preview-card accent">
          <strong>{t('cards.launch.title')}</strong>
          <span>{t('cards.launch.meta')}</span>
        </div>
        <div className="preview-card">
          <strong>{t('cards.review.title')}</strong>
          <span>{t('cards.review.meta')}</span>
        </div>
        <div className="preview-card soft">
          <strong>{t('cards.ship.title')}</strong>
          <span>{t('cards.ship.meta')}</span>
        </div>
      </div>
    </section>
  );
}
