import { getTranslations } from 'next-intl/server';

export default async function LoginPage() {
  const t = await getTranslations('auth.login');

  return (
    <main className="auth-page">
      <section className="auth-card">
        <h1>{t('title')}</h1>
      </section>
    </main>
  );
}
