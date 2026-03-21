import { NextResponse } from 'next/server';

import { db } from '@/lib/db';
import { registerUser } from '@/features/auth/actions/register';

export async function POST(request: Request) {
  const body = await request.json();

  await registerUser(
    (input) =>
      db.user.create({
        data: input
      }),
    body
  );

  return NextResponse.json({ ok: true });
}
