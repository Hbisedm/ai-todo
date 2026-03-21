import Link from 'next/link';

import { LocaleSwitcher } from '@/components/navigation/locale-switcher';
import { ThemeSwitcher } from '@/components/navigation/theme-switcher';
import { locales, type AppLocale } from '@/i18n/routing';

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
        <LocaleSwitcher label={languageLabel} locales={locales} />
        <ThemeSwitcher label={themeLabel} />
        <Link href={`/${locale}/login`}>{loginLabel}</Link>
        <Link className="cta-link" href={`/${locale}/register`}>
          {getStartedLabel}
        </Link>
      </nav>
    </header>
  );
}
