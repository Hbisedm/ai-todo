import { useTranslations } from 'next-intl';

export default function LocaleRootPage() {
  const t = useTranslations('marketing.hero');

  return (
    <main>
      <h1>{t('title')}</h1>
    </main>
  );
}
