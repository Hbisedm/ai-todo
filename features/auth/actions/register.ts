'use server';

import { hash } from 'bcryptjs';
import { redirect } from 'next/navigation';

import { db } from '@/lib/db';
import { registerSchema, type RegisterInput } from '@/features/auth/schema';

type CreateUserFn = (input: {
  name: string;
  email: string;
  passwordHash: string;
}) => Promise<unknown>;

export async function registerUser(createUser: CreateUserFn, input: RegisterInput) {
  const parsed = registerSchema.parse(input);
  const passwordHash = await hash(parsed.password, 10);

  await createUser({
    name: parsed.name,
    email: parsed.email,
    passwordHash
  });
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
