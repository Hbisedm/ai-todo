import Link from 'next/link';

import { LocaleSwitcher } from '@/components/navigation/locale-switcher';
import { ThemeSwitcher } from '@/components/navigation/theme-switcher';
import type { AppLocale } from '@/i18n/routing';

export function SiteHeader({
  locale,
  appName,
  loginLabel,
  getStartedLabel,
  languageLabel,
  themeLabel
}: {
  locale: AppLocale;
  appName: string;
  loginLabel: string;
  getStartedLabel: string;
  languageLabel: string;
  themeLabel: string;
}) {
  return (
    <header className="site-header">
      <Link className="brand" href={`/${locale}`}>
        {appName}
      </Link>
      <nav aria-label="Primary" className="site-nav">
        <div className="site-nav__controls">
          <LocaleSwitcher label={languageLabel} />
          <ThemeSwitcher label={themeLabel} />
        </div>
        <div className="site-nav__actions">
          <Link className="site-link" href={`/${locale}/login`}>{loginLabel}</Link>
          <Link className="cta-link" href={`/${locale}/register`}>
            {getStartedLabel}
          </Link>
        </div>
      </nav>
    </header>
  );
}
