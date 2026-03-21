import Link from 'next/link';

import type { AppLocale } from '@/i18n/routing';

export function SiteHeader({
  locale,
  appName,
  loginLabel,
  getStartedLabel
}: {
  locale: AppLocale;
  appName: string;
  loginLabel: string;
  getStartedLabel: string;
}) {
  return (
    <header className="site-header">
      <Link className="brand" href={`/${locale}`}>
        {appName}
      </Link>
      <nav aria-label="Primary" className="site-nav">
        <Link href={`/${locale}/login`}>{loginLabel}</Link>
        <Link className="cta-link" href={`/${locale}/register`}>
          {getStartedLabel}
        </Link>
      </nav>
    </header>
  );
}
