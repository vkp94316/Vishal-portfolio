import { Link } from 'wouter';

export default function NotFound() {
  return (
    <main id="main-content" className="page-wrap not-found" aria-labelledby="not-found-title">
      <div>
        <p className="eyebrow section-kicker justify-center">A small wrong turn</p>
        <h1 id="not-found-title" className="display-heading display-title mt-6">404<span style={{ color: 'hsl(var(--primary))' }}>.</span></h1>
        <p className="text-[hsl(var(--muted-foreground))] mt-5">This page wandered off the edge of the notebook.</p>
        <Link href="/" className="button-primary mt-8" data-testid="link-not-found-home">Back to the beginning <span aria-hidden="true">↗</span></Link>
      </div>
    </main>
  );
}