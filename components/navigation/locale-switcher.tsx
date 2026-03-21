'use client';

import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';

import type { AppLocale } from '@/i18n/routing';

export function LocaleSwitcher({
  label,
  locales
}: {
  label: string;
  locales: readonly AppLocale[];
}) {
  const router = useRouter();
  const locale = useLocale() as AppLocale;

  return (
    <button
      aria-label={label}
      className="ghost-link"
      onClick={() => {
        const nextLocale = locales.find((item) => item !== locale) ?? locale;
        router.push(`/${nextLocale}`);
      }}
      type="button"
    >
      {locale.toUpperCase()}
    </button>
  );
}
