import { defaultLocale, isSupportedLocale, type AppLocale } from '@/i18n/routing';

export function getPreferredLocale(cookieLocale?: string): AppLocale {
  return cookieLocale && isSupportedLocale(cookieLocale) ? cookieLocale : defaultLocale;
}

export function getRootRedirectPath(locale: AppLocale, isAuthenticated: boolean) {
  return isAuthenticated ? `/${locale}/app` : `/${locale}`;
}
