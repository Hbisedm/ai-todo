import { getTranslations } from 'next-intl/server';

export default async function RegisterPage() {
  const t = await getTranslations('auth.register');

  return (
    <main className="auth-page">
      <section className="auth-card">
        <h1>{t('title')}</h1>
      </section>
    </main>
  );
}
