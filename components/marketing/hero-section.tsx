import Link from 'next/link';

export function HeroSection() {
  return (
    <section className="hero-section">
      <div className="hero-copy">
        <span className="eyebrow">Portfolio-grade task management</span>
        <h1>Organize your work with clarity</h1>
        <p>
          A polished full-stack TODO experience with real authentication, responsive cards, and a dashboard that feels like a complete product.
        </p>
        <div className="hero-actions">
          <Link className="cta-link" href="/register">Create your workspace</Link>
          <Link className="ghost-link" href="/login">See the sign-in flow</Link>
        </div>
      </div>
      <div className="hero-card">
        <p className="muted">Task dashboard preview</p>
        <div className="preview-card accent">
          <strong>Launch portfolio refresh</strong>
          <span>High priority · Due Friday</span>
        </div>
        <div className="preview-card">
          <strong>Review auth flow polish</strong>
          <span>In progress · Real authentication</span>
        </div>
        <div className="preview-card soft">
          <strong>Ship dashboard cards</strong>
          <span>Done · Updated 1h ago</span>
        </div>
      </div>
    </section>
  );
}
