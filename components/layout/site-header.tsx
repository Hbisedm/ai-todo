import Link from 'next/link';

export function SiteHeader() {
  return (
    <header className="site-header">
      <Link className="brand" href="/">
        TODO Web
      </Link>
      <nav className="site-nav" aria-label="Primary">
        <Link href="/login">Log in</Link>
        <Link className="cta-link" href="/register">
          Get started
        </Link>
      </nav>
    </header>
  );
}
