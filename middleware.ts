import createMiddleware from 'next-intl/middleware';
import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

import { defaultLocale, locales } from '@/i18n/routing';

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'always'
});

export default async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname === '/') {
    return NextResponse.next();
  }

  const response = intlMiddleware(request);
  const [, locale, section] = request.nextUrl.pathname.split('/');

  if (locales.includes(locale as (typeof locales)[number]) && section === 'app') {
    const token = await getToken({
      req: request,
      secret: process.env.AUTH_SECRET
    });

    if (!token) {
      const loginUrl = new URL(`/${locale}/login`, request.url);
      loginUrl.searchParams.set('callbackUrl', request.nextUrl.pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return response;
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
};
