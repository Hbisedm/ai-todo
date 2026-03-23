import { getTranslations } from 'next-intl/server';

import { LoginForm } from '@/components/auth/login-form';
import { SiteHeader } from '@/components/layout/site-header';
import type { AppLocale } from '@/i18n/routing';

export default async function LoginPage({
  params
}: {
  params: Promise<{ locale: AppLocale }>;
}) {
  const { locale } = await params;
  const common = await getTranslations('common');

  return (
    <div className="marketing-shell auth-shell">
      <SiteHeader
        appName={common('appName')}
        getStartedLabel={common('navigation.getStarted')}
        languageLabel={common('navigation.language')}
        locale={locale}
        loginLabel={common('navigation.login')}
        themeLabel={common('navigation.theme')}
      />
      <main className="auth-page">
        <div className="auth-page__inner">
          <LoginForm />
        </div>
      </main>
    </div>
  );
}
