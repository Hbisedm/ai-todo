'use client';

import { FormEvent, useState } from 'react';
import { signIn } from 'next-auth/react';
import { useLocale, useTranslations } from 'next-intl';

export function LoginForm() {
  const locale = useLocale();
  const t = useTranslations('auth.login');
  const [errorMessage, setErrorMessage] = useState('');
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage('');
    setIsPending(true);

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get('email') ?? '');
    const password = String(formData.get('password') ?? '');

    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
      callbackUrl: `/${locale}/app`
    });

    setIsPending(false);

    if (!result || result.error) {
      setErrorMessage(t('errors.invalidCredentials'));
      return;
    }

    window.location.href = `/${locale}/app`;
  }

  return (
    <form className="auth-card" onSubmit={handleSubmit}>
      <h1>{t('title')}</h1>
      <p>{t('subtitle')}</p>
      <label>
        <span>{t('fields.email')}</span>
        <input aria-label={t('fields.email')} name="email" type="email" required />
      </label>
      <label>
        <span>{t('fields.password')}</span>
        <input aria-label={t('fields.password')} name="password" type="password" required minLength={8} />
      </label>
      {errorMessage ? <p className="form-error">{errorMessage}</p> : null}
      <button type="submit" disabled={isPending}>{isPending ? t('actions.pending') : t('actions.submit')}</button>
    </form>
  );
}
