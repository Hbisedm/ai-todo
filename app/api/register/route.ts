import { NextResponse } from 'next/server';

import { registerUser } from '@/features/auth/actions/register';
import { db } from '@/lib/db';
import { isAppError } from '@/lib/errors';

export async function POST(request: Request) {
  const body = await request.json();

  try {
    await registerUser(
      (input) =>
        db.user.create({
          data: input
        }),
      body
    );

    return NextResponse.json({ ok: true });
  } catch (error) {
    if (isAppError(error)) {
      return NextResponse.json({ ok: false, code: error.code }, { status: 400 });
    }

    return NextResponse.json({ ok: false, code: 'AUTH_REGISTRATION_FAILED' }, { status: 500 });
  }
}
