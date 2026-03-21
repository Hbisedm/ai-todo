'use client';

import { FormEvent, useState } from 'react';
import { signIn } from 'next-auth/react';

export function LoginForm() {
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
      callbackUrl: '/app'
    });

    setIsPending(false);

    if (!result || result.error) {
      setErrorMessage('Check your email and password and try again.');
      return;
    }

    window.location.href = result.url ?? '/app';
  }

  return (
    <form className="auth-card" onSubmit={handleSubmit}>
      <h1>Log in</h1>
      <p>Welcome back. Pick up where you left off.</p>
      <label>
        <span>Email</span>
        <input name="email" type="email" required />
      </label>
      <label>
        <span>Password</span>
        <input name="password" type="password" required minLength={8} />
      </label>
      {errorMessage ? <p className="form-error">{errorMessage}</p> : null}
      <button type="submit" disabled={isPending}>{isPending ? 'Signing in...' : 'Log in'}</button>
    </form>
  );
}
