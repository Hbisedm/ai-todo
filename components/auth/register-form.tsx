'use client';

import { FormEvent, useState } from 'react';
import { signIn } from 'next-auth/react';

export function RegisterForm() {
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
      setErrorMessage('Could not create your account. Please check the form and try again.');
      setIsPending(false);
      return;
    }

    const result = await signIn('credentials', {
      email: payload.email,
      password: payload.password,
      redirect: false,
      callbackUrl: '/app'
    });

    setIsPending(false);

    if (!result || result.error) {
      window.location.href = '/login?registered=1';
      return;
    }

    window.location.href = result.url ?? '/app';
  }

  return (
    <form className="auth-card" onSubmit={handleSubmit}>
      <h1>Create your account</h1>
      <p>Start planning in a polished personal workspace.</p>
      <label>
        <span>Name</span>
        <input name="name" required minLength={2} />
      </label>
      <label>
        <span>Email</span>
        <input name="email" type="email" required />
      </label>
      <label>
        <span>Password</span>
        <input name="password" type="password" required minLength={8} />
      </label>
      <label>
        <span>Confirm password</span>
        <input name="confirmPassword" type="password" required minLength={8} />
      </label>
      {errorMessage ? <p className="form-error">{errorMessage}</p> : null}
      <button type="submit" disabled={isPending}>{isPending ? 'Creating account...' : 'Get started'}</button>
    </form>
  );
}
