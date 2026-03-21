'use server';

import { hash } from 'bcryptjs';
import { redirect } from 'next/navigation';

import { AUTH_ERROR_CODES } from '@/features/auth/error-codes';
import { registerSchema, type RegisterInput } from '@/features/auth/schema';
import { db } from '@/lib/db';
import { AppError } from '@/lib/errors';

type CreateUserFn = (input: {
  name: string;
  email: string;
  passwordHash: string;
}) => Promise<unknown>;

export async function registerUser(createUser: CreateUserFn, input: RegisterInput) {
  const parsed = registerSchema.parse(input);
  const passwordHash = await hash(parsed.password, 10);

  try {
    await createUser({
      name: parsed.name,
      email: parsed.email,
      passwordHash
    });
  } catch (error) {
    if (typeof error === 'object' && error && 'code' in error && error.code === 'P2002') {
      throw new AppError(AUTH_ERROR_CODES.EMAIL_TAKEN);
    }

    throw new AppError(AUTH_ERROR_CODES.REGISTRATION_FAILED);
  }
}

export async function registerAction(formData: FormData) {
  await registerUser(
    (input) =>
      db.user.create({
        data: input
      }),
    {
      name: String(formData.get('name') ?? ''),
      email: String(formData.get('email') ?? ''),
      password: String(formData.get('password') ?? ''),
      confirmPassword: String(formData.get('confirmPassword') ?? '')
    }
  );

  redirect('/login?registered=1');
}
