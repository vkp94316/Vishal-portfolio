import { type FormEvent, type ReactNode, useEffect, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { Link, Route, Switch, Router as WouterRouter, useLocation } from 'wouter';

const queryClient = new QueryClient();
const siteUrl = 'https://maravale.design';

type PageMeta = {
  title: string;
  description: string;
  path: string;
  schema?: Record<string, unknown>;
};

function Meta({ title, description, path, schema }: PageMeta) {
  useEffect(() => {
    document.title = title;
    const setMeta = (selector: string, content: string, attr: 'name' | 'property' = 'name') => {
      let node = document.head.querySelector<HTMLMetaElement>(selector);
      if (!node) {
        node = document.createElement('meta');
        node.setAttribute(attr, selector.match(/"(.*?)"/)?.[1] ?? '');
        document.head.appendChild(node);
      }
      node.content = content;
    };
    setMeta('meta[name="description"]', description);
    setMeta('meta[property="og:title"]', title, 'property');
    setMeta('meta[property="og:description"]', description, 'property');
    setMeta('meta[property="og:url"]', `${siteUrl}${path}`, 'property');
    setMeta('meta[property="og:type"]', 'website', 'property');
    setMeta('meta[name="twitter:card"]', 'summary_large_image');
    setMeta('meta[name="twitter:title"]', title);
    setMeta('meta[name="twitter:description"]', description);
    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = `${siteUrl}${path}`;
    const existingSchema = document.getElementById('page-schema');
    if (existingSchema) existingSchema.remove();
    if (schema) {
      const script = document.createElement('script');
      script.id = 'page-schema';
      script.type = 'application/ld+json';
      script.textContent = JSON.stringify(schema);
      document.head.appendChild(script);
    }
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [description, path, schema, title]);
  return null;
}

function Shell({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const links = [
    { href: '/', label: 'Home' },
    { href: '/work', label: 'Work' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
  ];
  return (
    <div className="min-h-[100dvh]">
      <a className="skip-link" href="#main-content">Skip to content</a>
      <header className="site-header">
        <div className="page-wrap site-nav">
          <Link href="/" className="brand" data-testid="link-brand" onClick={() => setMenuOpen(false)}>
            <span className="brand-mark" aria-hidden="true">M</span>
            <span>Mara Vale</span>
          </Link>
          <button
            type="button"
            className="menu-button"
            aria-expanded={menuOpen}
            aria-controls="primary-navigation"
            data-testid="button-menu"
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? 'Close' : 'Menu'}
          </button>
          <nav id="primary-navigation" className={`nav-links ${menuOpen ? 'is-open' : ''}`} aria-label="Primary navigation">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="nav-link"
                aria-current={location === link.href ? 'page' : undefined}
                data-testid={`link-nav-${link.label.toLowerCase()}`}
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <Link href="/contact" className="button-primary hidden sm:inline-flex" data-testid="link-header-contact">Start a conversation <span aria-hidden="true">↗</span></Link>
        </div>
      </header>
      {children}
      <footer className="site-footer">
        <div className="page-wrap footer-inner">
          <div>
            <p className="eyebrow">Mara Vale — Design Engineer</p>
            <p className="footer-note">Independent practice based between systems and stories.<br />Available for a considered few collaborations.</p>
          </div>
          <div className="footer-mark" aria-hidden="true">mv<span style={{ color: 'hsl(var(--primary))' }}>.</span></div>
        </div>
      </footer>
    </div>
  );
}

const personSchema = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Mara Vale',
  jobTitle: 'Design Engineer',
  url: siteUrl,
  sameAs: ['https://www.linkedin.com', 'https://github.com'],
  knowsAbout: ['Product design', 'Front-end engineering', 'Design systems', 'Research'],
};

function Home() {
  return (
    <>
      <Meta title="Mara Vale — Design Engineer" description="Mara Vale is an independent design engineer turning complex systems into clear, humane digital experiences." path="/" schema={personSchema} />
      <main id="main-content">
        <section className="page-wrap section-space" aria-labelledby="home-title">
          <div className="relative">
            <p className="eyebrow reveal">Independent design engineer / London + everywhere</p>
            <h1 id="home-title" className="display-heading hero-title text-balance reveal reveal-delay-1">I make difficult things feel <em>obvious.</em></h1>
            <div className="hero-mark" aria-hidden="true" />
            <div className="hero-rail reveal reveal-delay-2">
              <p className="max-w-[500px] text-lg leading-relaxed text-[hsl(var(--muted-foreground))]">I partner with thoughtful teams to shape digital products, systems, and identities that hold up under real life — not just a launch-day screenshot.</p>
              <Link href="/work" className="button-outline" data-testid="link-home-work">See selected work <span aria-hidden="true">↓</span></Link>
            </div>
          </div>
        </section>

        <section className="page-wrap section-space pt-0" aria-labelledby="featured-title">
          <div className="flex items-end justify-between gap-5 mb-8">
            <div><p className="eyebrow section-kicker">A small selection</p><h2 id="featured-title" className="display-heading text-5xl mt-4">Work with a pulse.</h2></div>
            <Link href="/work" className="font-mono text-xs underline underline-offset-4 hidden sm:block" data-testid="link-home-all-work">View all projects ↗</Link>
          </div>
          <div className="work-grid">
            <Link href="/work#field-notes" className="work-card reveal" data-testid="card-work-field-notes">
              <div className="work-card-top"><span className="eyebrow">01 / Product + systems</span><span className="eyebrow">2024</span></div>
              <div className="card-art art-window" aria-hidden="true" />
              <div className="work-card-bottom"><h3 className="card-title">Field<br />Notes</h3><span className="arrow" aria-hidden="true">↗</span></div>
            </Link>
            <Link href="/work#common-thread" className="work-card reveal reveal-delay-1" data-testid="card-work-common-thread">
              <div className="work-card-top"><span className="eyebrow">02 / Identity + web</span><span className="eyebrow">2023</span></div>
              <div className="card-art art-spiral" aria-hidden="true" />
              <div className="work-card-bottom"><h3 className="card-title">Common<br />Thread</h3><span className="arrow" aria-hidden="true">↗</span></div>
            </Link>
            <Link href="/work#civic-table" className="work-card reveal reveal-delay-2" data-testid="card-work-civic-table">
              <div className="work-card-top"><span className="eyebrow">03 / Service design</span><span className="eyebrow">2022—24</span></div>
              <div className="card-art art-strata" aria-hidden="true" />
              <div className="work-card-bottom"><h3 className="card-title">Civic<br />Table</h3><span className="arrow" aria-hidden="true">↗</span></div>
            </Link>
          </div>
        </section>

        <section className="page-wrap section-space" aria-labelledby="approach-title">
          <div className="split-section">
            <div><p className="eyebrow section-kicker">The throughline</p><h2 id="approach-title" className="display-heading display-title mt-5">Clarity is a form of care.</h2></div>
            <div>
              <p className="text-2xl leading-snug max-w-2xl">The best interfaces do more than work. They give people their bearings. My practice sits in the useful tension between a sharp point of view and a deep respect for the person on the other side of the screen.</p>
              <Link href="/about" className="button-outline mt-8" data-testid="link-home-about">More about the practice <span aria-hidden="true">↗</span></Link>
            </div>
          </div>
        </section>
        <section className="page-wrap section-space pt-0" aria-label="Invitation">
          <div className="studio-grid p-8 sm:p-16 relative overflow-hidden">
            <p className="eyebrow">Have a knot worth untangling?</p>
            <h2 className="display-heading text-6xl sm:text-8xl max-w-3xl mt-6">Let’s make<br /><em>good</em> sense.</h2>
            <Link href="/contact" className="button-primary mt-8" data-testid="link-home-contact">Tell me about it <span aria-hidden="true">↗</span></Link>
          </div>
        </section>
      </main>
    </>
  );
}

const projects = [
  { id: 'field-notes', number: '01', type: 'Product + design system', year: '2024', title: 'Field Notes', intro: 'A calmer command centre for the people who keep cities moving.', detail: 'I led product direction and front-end architecture for an operations platform used by 2,400+ field workers. The work replaced a thicket of legacy tools with one legible, offline-ready workspace.', outcome: '27% fewer handoff errors in the first quarter.', art: 'art-window' },
  { id: 'common-thread', number: '02', type: 'Identity + editorial web', year: '2023', title: 'Common Thread', intro: 'A new digital home for a cooperative of independent makers.', detail: 'A living identity built from shared rules, not a single visual trick. The site gives 48 makers a voice while making the collective feel like one generous, coherent place.', outcome: '3.4× increase in time spent exploring maker stories.', art: 'art-spiral' },
  { id: 'civic-table', number: '03', type: 'Service design + research', year: '2022—24', title: 'Civic Table', intro: 'Making local climate decisions legible, participatory, and a little less exhausting.', detail: 'I worked alongside residents, council teams, and community organisers to turn a complicated consultation process into a toolkit of plain-language moments and useful feedback loops.', outcome: '12 neighbourhoods using the toolkit today.', art: 'art-strata' },
];

function Work() {
  const schema = { '@context': 'https://schema.org', '@type': 'ItemList', itemListElement: projects.map((project, index) => ({ '@type': 'ListItem', position: index + 1, name: project.title, description: project.intro })) };
  return (
    <>
      <Meta title="Selected Work — Mara Vale" description="Selected product, identity, and service design work by Mara Vale." path="/work" schema={schema} />
      <main id="main-content">
        <section className="page-wrap page-intro" aria-labelledby="work-title">
          <p className="eyebrow section-kicker reveal">Selected work / 2022—24</p>
          <h1 id="work-title" className="display-heading display-title mt-5 reveal reveal-delay-1">The good, hard<br /><em>middle.</em></h1>
          <p className="mt-8 reveal reveal-delay-2">The part after the big idea and before the polished outcome — where systems get tested, assumptions get softened, and the work earns its place in the world.</p>
        </section>
        <section className="page-wrap section-space" aria-labelledby="projects-title">
          <h2 id="projects-title" className="sr-only">Project case studies</h2>
          <div className="space-y-24">
            {projects.map((project, index) => (
              <article id={project.id} key={project.id} className="grid lg:grid-cols-[1fr_1.3fr] gap-8 lg:gap-20 scroll-mt-10">
                <div className={`relative min-h-[390px] overflow-hidden border border-[hsl(var(--foreground)/.3)] ${index === 0 ? 'bg-[hsl(var(--secondary))]' : index === 1 ? 'bg-[hsl(var(--primary))]' : 'bg-[hsl(var(--muted))]'}`}>
                  <div className={`card-art ${project.art}`} style={{ right: '17%', top: '20%', width: '66%', height: '57%' }} aria-hidden="true" />
                  <span className="eyebrow absolute left-5 bottom-5">Case study / {project.number}</span>
                </div>
                <div className="pt-2">
                  <div className="flex justify-between gap-4 border-b ink-rule pb-4"><span className="eyebrow">{project.type}</span><span className="eyebrow">{project.year}</span></div>
                  <h2 className="display-heading text-6xl sm:text-8xl mt-8">{project.title}</h2>
                  <p className="text-2xl leading-snug mt-7 max-w-xl">{project.intro}</p>
                  <p className="text-[hsl(var(--muted-foreground))] leading-relaxed mt-5 max-w-xl">{project.detail}</p>
                  <p className="font-mono text-xs uppercase tracking-wider mt-8 text-[hsl(var(--primary))]"><span className="mr-3" aria-hidden="true">↳</span>{project.outcome}</p>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}

function About() {
  return (
    <>
      <Meta title="About Mara Vale — Design Engineer" description="Meet Mara Vale, an independent design engineer working across product, systems, and service design." path="/about" schema={personSchema} />
      <main id="main-content">
        <section className="page-wrap page-intro" aria-labelledby="about-title">
          <p className="eyebrow section-kicker reveal">About the practice</p>
          <h1 id="about-title" className="display-heading display-title mt-5 reveal reveal-delay-1">A designer who<br /><em>stays for the details.</em></h1>
        </section>
        <section className="page-wrap section-space" aria-labelledby="bio-title">
          <div className="bio-grid">
            <div className="portrait" role="img" aria-label="Abstract portrait mark for Mara Vale"><div className="portrait-mark" aria-hidden="true" /></div>
            <div>
              <p className="eyebrow section-kicker">A short version</p>
              <h2 id="bio-title" className="display-heading text-5xl mt-5">Hi, I’m Mara.</h2>
              <p className="text-xl leading-relaxed mt-7">I’m an independent design engineer with a soft spot for complicated problems and a stubborn belief that digital things can be both useful and beautiful.</p>
              <p className="text-[hsl(var(--muted-foreground))] leading-relaxed mt-5">For the past twelve years I’ve moved between product teams, studios, and the spaces in between. I design the structure, write the interface, and build enough of the thing to know where the seams are. Based in London, working wherever a good question needs me.</p>
              <Link href="/contact" className="button-primary mt-8" data-testid="link-about-contact">Work together <span aria-hidden="true">↗</span></Link>
            </div>
          </div>
        </section>
        <section className="page-wrap section-space pt-0" aria-labelledby="values-title">
          <div className="split-section">
            <div><p className="eyebrow section-kicker">Working principles</p><h2 id="values-title" className="display-heading display-title mt-5">Useful rules<br /><em>for messy work.</em></h2></div>
            <div className="capability-list">
              <div className="capability"><span className="capability-num">01</span><div><h3>Make the invisible visible.</h3><p>Map the system, name the trade-off, draw the thing everyone is circling around.</p></div></div>
              <div className="capability"><span className="capability-num">02</span><div><h3>Leave room for humans.</h3><p>Build with context, recovery, and real constraints in mind. The edge case is usually a person.</p></div></div>
              <div className="capability"><span className="capability-num">03</span><div><h3>Prototype the hard bit.</h3><p>Don’t polish the easy path while the important question stays hypothetical.</p></div></div>
              <div className="capability"><span className="capability-num">04</span><div><h3>Make it last.</h3><p>A good handover is part of the design. So are tokens, docs, and a little thoughtful restraint.</p></div></div>
            </div>
          </div>
        </section>
        <section className="page-wrap section-space pt-0" aria-labelledby="experience-title">
          <div className="flex items-end justify-between mb-8"><div><p className="eyebrow section-kicker">The long view</p><h2 id="experience-title" className="display-heading text-5xl mt-4">Places I’ve learned from.</h2></div></div>
          <div className="timeline">
            <div className="timeline-item"><time>2020—now</time><div><h3>Independent / Design engineer</h3><p>Partnering with public-interest teams, growing companies, and quietly ambitious founders.</p></div></div>
            <div className="timeline-item"><time>2017—20</time><div><h3>Northstar Studio / Lead designer</h3><p>Product, identity, and the connective tissue between the two.</p></div></div>
            <div className="timeline-item"><time>2012—17</time><div><h3>Various good people / Designer + developer</h3><p>Learning to ask better questions, one shipped thing at a time.</p></div></div>
          </div>
        </section>
      </main>
    </>
  );
}

function Contact() {
  const [values, setValues] = useState({ name: '', email: '', message: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sent, setSent] = useState(false);
  const validate = () => {
    const next: Record<string, string> = {};
    if (!values.name.trim()) next.name = 'Please tell me your name.';
    if (!values.email.trim()) next.email = 'Please add your email address.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) next.email = 'That email address doesn’t look quite right.';
    if (!values.message.trim()) next.message = 'A sentence or two is plenty to start.';
    setErrors(next);
    return Object.keys(next).length === 0;
  };
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (validate()) {
      setSent(true);
      setValues({ name: '', email: '', message: '' });
    }
  };
  const update = (field: 'name' | 'email' | 'message', value: string) => {
    setSent(false);
    setValues((current) => ({ ...current, [field]: value }));
    if (errors[field]) setErrors((current) => ({ ...current, [field]: '' }));
  };
  return (
    <>
      <Meta title="Contact Mara Vale — Design Engineer" description="Start a conversation with Mara Vale about a product, service, or system that needs making clearer." path="/contact" />
      <main id="main-content">
        <section className="page-wrap page-intro" aria-labelledby="contact-title">
          <p className="eyebrow section-kicker reveal">Start a conversation</p>
          <h1 id="contact-title" className="display-heading display-title mt-5 reveal reveal-delay-1">Bring the<br /><em>knot.</em></h1>
        </section>
        <section className="page-wrap section-space" aria-labelledby="form-title">
          <div className="contact-layout">
            <div className="contact-aside">
              <h2 id="form-title" className="display-heading text-5xl">Let’s see<br />what it’s made of.</h2>
              <p>Tell me what you’re working on, what feels stuck, or what you’re hoping to make more useful. No polished brief required.</p>
              <div className="contact-links" aria-label="Alternate contact methods">
                <a className="contact-link" href="mailto:hello@maravale.design" data-testid="link-email">hello@maravale.design <span aria-hidden="true">↗</span></a>
                <a className="contact-link" href="https://www.linkedin.com" target="_blank" rel="noreferrer" data-testid="link-linkedin">LinkedIn <span aria-hidden="true">↗</span></a>
                <a className="contact-link" href="https://github.com" target="_blank" rel="noreferrer" data-testid="link-github">GitHub <span aria-hidden="true">↗</span></a>
              </div>
            </div>
            <div className="form-card">
              {sent && <div className="status-message" role="status" aria-live="polite">Thank you — your note is staged and ready. I’ll get back to you within a couple of working days.</div>}
              <form onSubmit={submit} noValidate aria-describedby="form-note">
                <p id="form-note" className="text-[hsl(var(--muted-foreground))] text-sm mb-6">Required fields are marked with <span aria-hidden="true">*</span>.</p>
                <div className="field">
                  <label htmlFor="name">Your name <span aria-hidden="true">*</span></label>
                  <input id="name" name="name" type="text" autoComplete="name" value={values.name} onChange={(event) => update('name', event.target.value)} aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? 'name-error' : undefined} data-testid="input-name" />
                  {errors.name && <p id="name-error" className="field-error" role="alert">{errors.name}</p>}
                </div>
                <div className="field">
                  <label htmlFor="email">Email address <span aria-hidden="true">*</span></label>
                  <input id="email" name="email" type="email" autoComplete="email" value={values.email} onChange={(event) => update('email', event.target.value)} aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? 'email-error' : undefined} data-testid="input-email" />
                  {errors.email && <p id="email-error" className="field-error" role="alert">{errors.email}</p>}
                </div>
                <div className="field">
                  <label htmlFor="message">What are you thinking about? <span aria-hidden="true">*</span></label>
                  <textarea id="message" name="message" autoComplete="off" value={values.message} onChange={(event) => update('message', event.target.value)} aria-invalid={Boolean(errors.message)} aria-describedby={errors.message ? 'message-error' : undefined} data-testid="input-message" />
                  {errors.message && <p id="message-error" className="field-error" role="alert">{errors.message}</p>}
                </div>
                <button type="submit" className="button-primary" data-testid="button-submit-contact">Send the note <span aria-hidden="true">↗</span></button>
              </form>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

function Router() {
  return (
    <RoutedErrorBoundary>
      <Shell>
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/work" component={Work} />
          <Route path="/about" component={About} />
          <Route path="/contact" component={Contact} />
          <Route component={NotFound} />
        </Switch>
      </Shell>
    </RoutedErrorBoundary>
  );
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;