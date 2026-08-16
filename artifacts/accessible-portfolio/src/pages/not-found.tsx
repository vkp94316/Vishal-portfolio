import { Link } from 'wouter';

export default function NotFound() {
  return (
    <main id="main-content" className="page-wrap not-found" aria-labelledby="not-found-title">
      <div>
        <p className="eyebrow section-kicker" style={{ justifyContent: 'center' }}>A small wrong turn</p>
        <h1 id="not-found-title" className="display-heading display-title" style={{ marginTop: '1.5rem' }}>404<span className="accent-mark">.</span></h1>
        <p style={{ color: 'var(--color-text-muted)', marginTop: '1.25rem' }}>This page wandered off the edge of the notebook.</p>
        <Link href="/" className="button-primary" style={{ marginTop: '2rem' }} data-testid="link-not-found-home">Back to the beginning <span aria-hidden="true">↗</span></Link>
      </div>
    </main>
  );
}