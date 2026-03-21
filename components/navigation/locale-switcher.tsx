'use client';

import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';

import { locales, type AppLocale } from '@/i18n/routing';

const labels: Record<AppLocale, string> = {
  en: 'English',
  zh: '中文'
};

export function LocaleSwitcher({ label }: { label: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale() as AppLocale;
  const [open, setOpen] = useState(false);

  function switchLocale(nextLocale: AppLocale) {
    const segments = pathname.split('/').filter(Boolean);
    const [, ...rest] = segments;
    const nextPath = `/${[nextLocale, ...rest].join('/')}`;
    router.push(nextPath || `/${nextLocale}`);
    setOpen(false);
  }

  return (
    <div className="switcher-menu">
      <button
        aria-expanded={open}
        aria-label={label}
        className="ghost-link"
        onClick={() => setOpen((value) => !value)}
        type="button"
      >
        {locale.toUpperCase()}
      </button>
      {open ? (
        <div className="menu-popover" role="menu">
          {locales.map((option) => (
            <button
              className="menu-item"
              key={option}
              onClick={() => switchLocale(option)}
              role="menuitem"
              type="button"
            >
              {labels[option]}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
