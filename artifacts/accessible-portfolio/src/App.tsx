import { type FormEvent, type ReactNode, useEffect, useRef, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { Link, Route, Switch, Router as WouterRouter, useLocation } from 'wouter';

const queryClient = new QueryClient();
const siteUrl = typeof window !== 'undefined' ? window.location.origin : '';

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
    setMeta('meta[property="og:site_name"]', 'Vishal Kumar Pandey', 'property');
    setMeta('meta[name="twitter:card"]', 'summary_large_image');
    setMeta('meta[name="twitter:title"]', title);
    setMeta('meta[name="twitter:description"]', description);
    setMeta('meta[name="twitter:url"]', `${siteUrl}${path}`);
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
  const menuButtonRef = useRef<HTMLButtonElement | null>(null);
  const links = [
    { href: '/', label: 'Home' },
    { href: '/work', label: 'Projects' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
  ];
  const closeMenu = (restoreFocus = false) => {
    setMenuOpen(false);
    if (restoreFocus) {
      window.requestAnimationFrame(() => menuButtonRef.current?.focus());
    }
  };
  useEffect(() => {
    if (!menuOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeMenu(true);
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  });
  return (
    <div className="min-h-[100dvh]">
      <a className="skip-link" href="#main-content">Skip to main content</a>
      <header className="site-header">
        <div className="page-wrap site-nav">
          <Link href="/" className="brand" data-testid="link-brand" onClick={() => closeMenu()}>
            <span className="brand-mark" aria-hidden="true">V</span>
            <span>Vishal Kumar Pandey</span>
          </Link>
          <button
            type="button"
            className="menu-button"
            ref={menuButtonRef}
            aria-expanded={menuOpen}
            aria-controls="primary-navigation"
            aria-label={menuOpen ? 'Close primary navigation' : 'Open primary navigation'}
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
                onClick={() => closeMenu(menuOpen)}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <Link href="/contact" className="button-primary hidden sm:inline-flex" data-testid="link-header-contact">Get in touch <span aria-hidden="true">↗</span></Link>
        </div>
      </header>
      {children}
      <footer className="site-footer">
        <div className="page-wrap footer-inner">
          <div>
            <p className="eyebrow">Vishal Kumar Pandey — BCA Student &amp; Developer</p>
            <p className="footer-note">Building practical web solutions with a focus on clear interfaces and useful technology.</p>
          </div>
          <div className="footer-mark" aria-hidden="true">vk<span style={{ color: 'hsl(var(--primary))' }}>.</span></div>
        </div>
      </footer>
    </div>
  );
}

const personSchema = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Vishal Kumar Pandey',
  jobTitle: 'BCA Student & Developer',
  url: siteUrl,
  description: 'Bachelor of Computer Applications student and developer focused on web development and practical software solutions.',
  knowsAbout: ['Web Development', 'HTML', 'CSS', 'Java', 'Python', 'JavaScript', 'SQL', 'MySQL', 'React', 'Node.js', 'Git & GitHub'],
};

function Home() {
  return (
    <>
      <Meta title="Vishal Kumar Pandey — BCA Student & Developer" description="Vishal Kumar Pandey is a BCA student and aspiring software developer who enjoys building responsive, user-friendly web applications." path="/" schema={personSchema} />
      <main id="main-content">
        <section className="page-wrap section-space" aria-labelledby="home-title">
          <div className="relative">
            <p className="eyebrow reveal">BCA STUDENT &amp; DEVELOPER / WEB DEVELOPMENT</p>
            <h1 id="home-title" className="display-heading hero-title text-balance reveal reveal-delay-1">I build practical <em>web solutions.</em></h1>
            <div className="hero-mark" aria-hidden="true" />
            <div className="hero-rail reveal reveal-delay-2">
              <p className="max-w-[500px] text-lg leading-relaxed text-[hsl(var(--muted-foreground))]">I am a BCA student and aspiring software developer who enjoys building responsive, user-friendly web applications and learning through practical projects.</p>
              <Link href="/work" className="button-outline" data-testid="link-home-work">View My Project <span aria-hidden="true">↓</span></Link>
            </div>
          </div>
        </section>

        <section className="page-wrap section-space pt-0" aria-labelledby="featured-title">
          <div className="flex items-end justify-between gap-5 mb-8">
            <div><p className="eyebrow section-kicker">Selected coursework</p><h2 id="featured-title" className="display-heading text-5xl mt-4">Projects built to be useful.</h2></div>
            <Link href="/work" className="font-mono text-xs underline underline-offset-4 hidden sm:block" data-testid="link-home-all-work">View project details ↗</Link>
          </div>
          <div className="work-grid">
            <Link href="/work#gym-membership-management" className="work-card reveal" data-testid="card-work-gym-membership">
              <div className="work-card-top"><span className="eyebrow">01 / Web development</span><span className="eyebrow">Coursework</span></div>
              <div className="card-art art-window" aria-hidden="true" />
              <div className="work-card-bottom"><h3 className="card-title">Gym<br />Membership</h3><span className="arrow" aria-hidden="true">↗</span></div>
            </Link>
          </div>
        </section>

        <section className="page-wrap section-space" aria-labelledby="approach-title">
          <div className="split-section">
            <div><p className="eyebrow section-kicker">My focus</p><h2 id="approach-title" className="display-heading display-title mt-5">Learning by building useful things.</h2></div>
            <div>
              <p className="text-2xl leading-snug max-w-2xl">I enjoy turning requirements into clear interfaces and reliable functionality. My learning focuses on strong web fundamentals, practical databases, server-side development, and responsible use of APIs.</p>
              <Link href="/about" className="button-outline mt-8" data-testid="link-home-about">More about me <span aria-hidden="true">↗</span></Link>
            </div>
          </div>
        </section>
        <section className="page-wrap section-space pt-0" aria-label="Invitation">
          <div className="studio-grid p-8 sm:p-16 relative overflow-hidden">
            <p className="eyebrow">Have a project idea?</p>
            <h2 className="display-heading text-6xl sm:text-8xl max-w-3xl mt-6">Let’s build<br /><em>something useful.</em></h2>
            <Link href="/contact" className="button-primary mt-8" data-testid="link-home-contact">Contact me <span aria-hidden="true">↗</span></Link>
          </div>
        </section>
      </main>
    </>
  );
}

const projects = [
  {
    id: 'gym-membership-management',
    number: '01',
    type: 'Web development',
    year: 'Coursework',
    title: 'Gym Membership Management System',
    intro: 'A responsive web application concept designed to make gym membership management easier by organizing membership plans, member information, attendance, and fitness-related features in one user-friendly interface.',
    detail: 'The project focuses on a practical responsive interface with clear day-to-day interactions. It does not claim backend, database, authentication, API, or online payment functionality.',
    features: ['Membership plans', 'Member information', 'Attendance management', 'BMI Calculator', 'Responsive user interface', 'User-friendly navigation'],
    outcome: 'HTML · CSS · JavaScript · Responsive Web Design',
    art: 'art-window',
  },
];

function Work() {
  const schema = { '@context': 'https://schema.org', '@type': 'ItemList', itemListElement: projects.map((project, index) => ({ '@type': 'ListItem', position: index + 1, name: project.title, description: project.intro })) };
  return (
    <>
      <Meta title="Projects — Vishal Kumar Pandey" description="Explore the Gym Membership Management System built by BCA student and developer Vishal Kumar Pandey." path="/work" schema={schema} />
      <main id="main-content">
        <section className="page-wrap page-intro" aria-labelledby="work-title">
          <p className="eyebrow section-kicker reveal">Projects / Web development</p>
          <h1 id="work-title" className="display-heading display-title mt-5 reveal reveal-delay-1">Projects built with code,<br /><em>curiosity, and care.</em></h1>
          <p className="mt-8 reveal reveal-delay-2">I build practical web applications to strengthen my development skills and solve real-world problems.</p>
        </section>
        <section className="page-wrap section-space" aria-labelledby="projects-title">
          <h2 id="projects-title" className="sr-only">Project case studies</h2>
          <div className="space-y-24">
            {projects.map((project, index) => (
              <article id={project.id} key={project.id} className="grid lg:grid-cols-[1fr_1.3fr] gap-8 lg:gap-20 scroll-mt-10">
                <div className={`relative min-h-[390px] overflow-hidden border border-[hsl(var(--foreground)/.3)] ${index === 0 ? 'bg-[hsl(var(--secondary))]' : index === 1 ? 'bg-[hsl(var(--primary))]' : 'bg-[hsl(var(--muted))]'}`}>
                  <div className={`card-art ${project.art}`} style={{ right: '17%', top: '20%', width: '66%', height: '57%' }} aria-hidden="true" />
                  <span className="eyebrow absolute left-5 bottom-5">Project / {project.number}</span>
                </div>
                <div className="pt-2">
                  <div className="flex justify-between gap-4 border-b ink-rule pb-4"><span className="eyebrow">{project.type}</span><span className="eyebrow">{project.year}</span></div>
                  <h2 className="display-heading text-6xl sm:text-8xl mt-8">{project.title}</h2>
                  <p className="text-2xl leading-snug mt-7 max-w-xl">{project.intro}</p>
                  <p className="text-[hsl(var(--muted-foreground))] leading-relaxed mt-5 max-w-xl">{project.detail}</p>
                   <h3 className="eyebrow mt-8">Features</h3>
                   <ul className="mt-3 grid sm:grid-cols-2 gap-x-6 gap-y-2 text-sm text-[hsl(var(--muted-foreground))] list-disc pl-5">
                     {project.features.map((feature) => <li key={feature}>{feature}</li>)}
                   </ul>
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
      <Meta title="About Vishal Kumar Pandey — BCA Student & Developer" description="Learn about Vishal Kumar Pandey, a Bachelor of Computer Applications student and aspiring software developer." path="/about" schema={personSchema} />
      <main id="main-content">
        <section className="page-wrap page-intro" aria-labelledby="about-title">
          <p className="eyebrow section-kicker reveal">ABOUT ME</p>
          <h1 id="about-title" className="display-heading display-title mt-5 reveal reveal-delay-1">Learning, building, and improving<br /><em>one project at a time.</em></h1>
        </section>
        <section className="page-wrap section-space" aria-labelledby="bio-title">
          <div className="bio-grid">
            <div className="portrait" role="img" aria-label="Abstract portrait mark for Vishal Kumar Pandey"><div className="portrait-mark" aria-hidden="true" /></div>
            <div>
              <p className="eyebrow section-kicker">A short version</p>
              <h2 id="bio-title" className="display-heading text-5xl mt-5">Hi, I’m Vishal.</h2>
              <p className="text-xl leading-relaxed mt-7">Hi, I'm Vishal Kumar Pandey, a BCA student and aspiring software developer. I enjoy building practical web applications and exploring technologies that help turn ideas into useful digital solutions.</p>
              <p className="text-[hsl(var(--muted-foreground))] leading-relaxed mt-5">My current interests include web development, Python, JavaScript, databases, and modern application development. I focus on learning by building projects and improving my problem-solving skills.</p>
              <Link href="/contact" className="button-primary mt-8" data-testid="link-about-contact">Get in touch <span aria-hidden="true">↗</span></Link>
            </div>
          </div>
        </section>
        <section className="page-wrap section-space pt-0" aria-labelledby="values-title">
          <div className="split-section">
            <div><p className="eyebrow section-kicker">TECHNICAL SKILLS</p><h2 id="values-title" className="display-heading display-title mt-5">Skills for<br /><em>practical projects.</em></h2></div>
            <div className="capability-list">
              <div className="capability"><span className="capability-num">01</span><div><h3>HTML</h3><p>Semantic structure for accessible web pages.</p></div></div>
              <div className="capability"><span className="capability-num">02</span><div><h3>CSS</h3><p>Responsive layouts and clear visual presentation.</p></div></div>
              <div className="capability"><span className="capability-num">03</span><div><h3>Java and Python</h3><p>Programming fundamentals and practical application development.</p></div></div>
              <div className="capability"><span className="capability-num">04</span><div><h3>SQL / MySQL</h3><p>Working with structured data and database fundamentals.</p></div></div>
              <div className="capability"><span className="capability-num">05</span><div><h3>React and Node.js</h3><p>Modern frontend and server-side web development.</p></div></div>
              <div className="capability"><span className="capability-num">06</span><div><h3>Git &amp; GitHub</h3><p>Version control and collaborative development workflows.</p></div></div>
            </div>
          </div>
        </section>
        <section className="page-wrap section-space pt-0" aria-labelledby="experience-title">
          <div className="flex items-end justify-between mb-8"><div><p className="eyebrow section-kicker">Education</p><h2 id="experience-title" className="display-heading text-5xl mt-4">What I’m studying.</h2></div></div>
          <div className="timeline">
            <div className="timeline-item"><time>Current</time><div><h3>Bachelor of Computer Applications (BCA)</h3><p>Studying computer applications with a focus on web development and software fundamentals.</p></div></div>
          </div>
        </section>
      </main>
    </>
  );
}

function Contact() {
  const [values, setValues] = useState({ name: '', email: '', subject: '', message: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sent, setSent] = useState(false);
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const firstErrorRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null);
  const validate = () => {
    const next: Record<string, string> = {};
    if (!values.name.trim()) next.name = 'Please tell me your name.';
    if (!values.email.trim()) next.email = 'Please add your email address.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) next.email = 'That email address doesn’t look quite right.';
    if (!values.subject.trim()) next.subject = 'Please add a subject for your note.';
    if (!values.message.trim()) next.message = 'A sentence or two is plenty to start.';
    setErrors(next);
    if (Object.keys(next).length > 0) {
      const firstError = ['name', 'email', 'subject', 'message'].find((field) => next[field]);
      if (firstError) {
        window.requestAnimationFrame(() => {
          firstErrorRef.current = document.getElementById(firstError) as HTMLInputElement | HTMLTextAreaElement | null;
          firstErrorRef.current?.focus();
        });
      }
    }
    return Object.keys(next).length === 0;
  };
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitAttempted(true);
    if (validate()) {
      setSent(true);
      setValues({ name: '', email: '', subject: '', message: '' });
      setErrors({});
      setSubmitAttempted(false);
    }
  };
  const update = (field: 'name' | 'email' | 'subject' | 'message', value: string) => {
    setSent(false);
    setValues((current) => ({ ...current, [field]: value }));
    if (errors[field]) setErrors((current) => ({ ...current, [field]: '' }));
  };
  return (
    <>
      <Meta title="Contact Vishal Kumar Pandey — BCA Student & Developer" description="Contact Vishal Kumar Pandey about a project idea, internship opportunity, or simply connecting." path="/contact" />
      <main id="main-content">
        <section className="page-wrap page-intro" aria-labelledby="contact-title">
          <p className="eyebrow section-kicker reveal">GET IN TOUCH</p>
          <h1 id="contact-title" className="display-heading display-title mt-5 reveal reveal-delay-1">Let's build<br /><em>something useful.</em></h1>
        </section>
        <section className="page-wrap section-space" aria-labelledby="form-title">
          <div className="contact-layout">
            <aside className="contact-aside" aria-labelledby="form-title">
              <h2 id="form-title" className="display-heading text-5xl">Tell me<br />what you’re building.</h2>
              <p>If you have a project idea, internship opportunity, or simply want to connect, feel free to send me a message.</p>
            </aside>
            <div className="form-card">
              <div className="sr-only" aria-live="polite" aria-atomic="true">
                {sent ? 'Thank you. Your note has been sent. I’ll get back to you within a couple of working days.' : ''}
                {submitAttempted && Object.keys(errors).length > 0 ? `${Object.keys(errors).length} form errors need your attention.` : ''}
              </div>
              {sent && <div className="status-message" role="status">Thank you — your note is staged and ready. I’ll get back to you within a couple of working days.</div>}
              <form onSubmit={submit} noValidate aria-describedby="form-note">
                <p id="form-note" className="text-[hsl(var(--muted-foreground))] text-sm mb-6">Required fields are marked with <span aria-hidden="true">*</span>.</p>
                <div className="field">
                  <label htmlFor="name">Your name <span aria-hidden="true">*</span></label>
                  <input id="name" name="name" type="text" autoComplete="name" required value={values.name} onChange={(event) => update('name', event.target.value)} aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? 'name-error' : undefined} ref={(node) => { firstErrorRef.current = errors.name ? node : firstErrorRef.current; }} data-testid="input-name" />
                  {errors.name && <p id="name-error" className="field-error" role="alert">{errors.name}</p>}
                </div>
                <div className="field">
                  <label htmlFor="email">Email address <span aria-hidden="true">*</span></label>
                  <input id="email" name="email" type="email" autoComplete="email" required value={values.email} onChange={(event) => update('email', event.target.value)} aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? 'email-error' : undefined} data-testid="input-email" />
                  {errors.email && <p id="email-error" className="field-error" role="alert">{errors.email}</p>}
                </div>
                <div className="field">
                  <label htmlFor="subject">Subject <span aria-hidden="true">*</span></label>
                  <input id="subject" name="subject" type="text" autoComplete="off" required value={values.subject} onChange={(event) => update('subject', event.target.value)} aria-invalid={Boolean(errors.subject)} aria-describedby={errors.subject ? 'subject-error' : undefined} data-testid="input-subject" />
                  {errors.subject && <p id="subject-error" className="field-error" role="alert">{errors.subject}</p>}
                </div>
                <div className="field">
                  <label htmlFor="message">What are you thinking about? <span aria-hidden="true">*</span></label>
                  <textarea id="message" name="message" autoComplete="off" required value={values.message} onChange={(event) => update('message', event.target.value)} aria-invalid={Boolean(errors.message)} aria-describedby={errors.message ? 'message-error' : undefined} data-testid="input-message" />
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