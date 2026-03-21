import Link from 'next/link';
import { RegisterForm } from '@/components/auth/register-form';

export default function RegisterPage() {
  return (
    <main className="auth-page">
      <RegisterForm />
      <p className="auth-meta">
        Already have an account? <Link href="/login">Log in</Link>
      </p>
    </main>
  );
}
