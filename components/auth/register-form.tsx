'use client';

import { FormEvent, useState } from 'react';
import { signIn } from 'next-auth/react';
import { useLocale, useTranslations } from 'next-intl';

import { LoadingSpinner } from '@/components/ui/loading-spinner';

export function RegisterForm() {
  const locale = useLocale();
  const t = useTranslations('auth.register');
  const [errorMessage, setErrorMessage] = useState('');
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage('');
    setIsPending(true);

    const formData = new FormData(event.currentTarget);
    const payload = {
      name: String(formData.get('name') ?? ''),
      email: String(formData.get('email') ?? ''),
      password: String(formData.get('password') ?? ''),
      confirmPassword: String(formData.get('confirmPassword') ?? '')
    };

    const response = await fetch('/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const result = (await response.json()) as { code?: string };
      setErrorMessage(result.code === 'AUTH_EMAIL_TAKEN' ? t('errors.emailTaken') : t('errors.generic'));
      setIsPending(false);
      return;
    }

    const result = await signIn('credentials', {
      email: payload.email,
      password: payload.password,
      redirect: false,
      callbackUrl: `/${locale}/app`
    });

    setIsPending(false);

    if (!result || result.error) {
      window.location.href = `/${locale}/login?registered=1`;
      return;
    }

    window.location.href = `/${locale}/app`;
  }

  return (
    <form className="auth-card" onSubmit={handleSubmit}>
      <h1>{t('title')}</h1>
      <p>{t('subtitle')}</p>
      <label>
        <span>{t('fields.name')}</span>
        <input aria-label={t('fields.name')} minLength={2} name="name" required />
      </label>
      <label>
        <span>{t('fields.email')}</span>
        <input aria-label={t('fields.email')} name="email" required type="email" />
      </label>
      <label>
        <span>{t('fields.password')}</span>
        <input aria-label={t('fields.password')} minLength={8} name="password" required type="password" />
      </label>
      <label>
        <span>{t('fields.confirmPassword')}</span>
        <input aria-label={t('fields.confirmPassword')} minLength={8} name="confirmPassword" required type="password" />
      </label>
      {errorMessage ? <p className="form-error">{errorMessage}</p> : null}
      <button disabled={isPending} type="submit">
        {isPending ? <LoadingSpinner /> : null}
        <span>{isPending ? t('actions.pending') : t('actions.submit')}</span>
      </button>
    </form>
  );
}
