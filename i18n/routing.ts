export const locales = ['en', 'zh'] as const;
export const defaultLocale = 'en';

export type AppLocale = (typeof locales)[number];

export function isSupportedLocale(value: string): value is AppLocale {
  return locales.includes(value as AppLocale);
}
