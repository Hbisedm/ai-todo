import { getTranslations } from 'next-intl/server';

import { SiteHeader } from '@/components/layout/site-header';
import { FeatureGrid } from '@/components/marketing/feature-grid';
import { HeroSection } from '@/components/marketing/hero-section';
import { ProductPreview } from '@/components/marketing/product-preview';
import type { AppLocale } from '@/i18n/routing';

export default async function MarketingPage({
  params
}: {
  params: Promise<{ locale: AppLocale }>;
}) {
  const { locale } = await params;
  const common = await getTranslations('common');

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
      <main className="marketing-main">
        <HeroSection />
        <FeatureGrid />
        <ProductPreview />
      </main>
    </div>
  );
}
