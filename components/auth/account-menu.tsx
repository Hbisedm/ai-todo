'use client';

import { useEffect, useRef, useState } from 'react';
import { signOut } from 'next-auth/react';

import { LoadingSpinner } from '@/components/ui/loading-spinner';
import type { AppLocale } from '@/i18n/routing';

export function AccountMenu({
  locale,
  userLabel,
  logoutLabel,
  logoutPendingLabel
}: {
  locale: AppLocale;
  userLabel: string;
  logoutLabel: string;
  logoutPendingLabel: string;
}) {
  const [open, setOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener('mousedown', handlePointerDown);
    return () => document.removeEventListener('mousedown', handlePointerDown);
  }, []);

  async function handleLogout() {
    setIsPending(true);
    await signOut({ callbackUrl: `/${locale}/login` });
  }

  return (
    <div className="switcher-menu account-menu" ref={rootRef}>
      <button
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label={userLabel}
        className="ghost-link account-menu__trigger"
        onClick={() => setOpen((value) => !value)}
        type="button"
      >
        <span className="account-menu__name">{userLabel}</span>
      </button>
      {open ? (
        <div className="menu-popover account-menu__popover" role="menu">
          <div className="account-menu__identity">{userLabel}</div>
          <button className="menu-item account-menu__logout" disabled={isPending} onClick={handleLogout} role="menuitem" type="button">
            {isPending ? <LoadingSpinner /> : null}
            <span>{isPending ? logoutPendingLabel : logoutLabel}</span>
          </button>
        </div>
      ) : null}
    </div>
  );
}
