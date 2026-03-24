import { cookies } from 'next/headers';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

import { authOptions } from '@/auth';
import { getPreferredLocale, getRootRedirectPath } from '@/lib/root-redirect';

const LOCALE_COOKIE_NAME = 'NEXT_LOCALE';

export default async function RootPage() {
  const localeCookie = cookies().get(LOCALE_COOKIE_NAME)?.value;
  const locale = getPreferredLocale(localeCookie);
  const session = await getServerSession(authOptions);

  redirect(getRootRedirectPath(locale, Boolean(session?.user)));
}
