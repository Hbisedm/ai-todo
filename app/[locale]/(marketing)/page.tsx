import { getTranslations } from 'next-intl/server';

import { SiteHeader } from '@/components/layout/site-header';
import type { AppLocale } from '@/i18n/routing';

export default async function MarketingPage({
  params
}: {
  params: Promise<{ locale: AppLocale }>;
}) {
  const { locale } = await params;
  const common = await getTranslations('common');
  const hero = await getTranslations('marketing.hero');

  return (
    <div className="marketing-shell">
      <SiteHeader
        appName={common('appName')}
        getStartedLabel={common('navigation.getStarted')}
        languageLabel={common('navigation.language')}
        locale={locale}
        loginLabel={common('navigation.login')}
        themeLabel={common('navigation.theme')}
      />
      <main>
        <h1>{hero('title')}</h1>
      </main>
    </div>
  );
}
