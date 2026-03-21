import Link from 'next/link';
import { LoginForm } from '@/components/auth/login-form';

export default function LoginPage() {
  return (
    <main className="auth-page">
      <LoginForm />
      <p className="auth-meta">
        New here? <Link href="/register">Create an account</Link>
      </p>
    </main>
  );
}
