'use client';

import { useState } from 'react';
import { signOut } from 'next-auth/react';

import type { AppLocale } from '@/i18n/routing';

export function LogoutButton({
  locale,
  label,
  pendingLabel,
  userLabel
}: {
  locale: AppLocale;
  label: string;
  pendingLabel: string;
  userLabel: string;
}) {
  const [isPending, setIsPending] = useState(false);

  async function handleLogout() {
    setIsPending(true);
    await signOut({
      callbackUrl: `/${locale}/login`
    });
  }

  return (
    <div className="dashboard-account">
      <span className="dashboard-account__label">{userLabel}</span>
      <button className="site-link" type="button" onClick={handleLogout} disabled={isPending}>
        {isPending ? pendingLabel : label}
      </button>
    </div>
  );
}
