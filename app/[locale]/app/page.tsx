import { getTranslations } from 'next-intl/server';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

import { authOptions } from '@/auth';
import type { AppLocale } from '@/i18n/routing';

export default async function AppPage({
  params
}: {
  params: Promise<{ locale: AppLocale }>;
}) {
  const { locale } = await params;
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect(`/${locale}/login`);
  }

  const t = await getTranslations('dashboard');

  return (
    <main className="dashboard-page">
      <section className="dashboard-hero">
        <div>
          <p className="eyebrow">{t('eyebrow')}</p>
          <h1>{t('title')}</h1>
        </div>
      </section>
    </main>
  );
}
