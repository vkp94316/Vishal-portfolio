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
    { href: '/todo', label: 'To-Do' },
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
    <div className="app-shell">
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
          <Link href="/contact" className="button-primary header-cta" data-testid="link-header-contact">
            Get in touch <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </header>
      {children}
      <footer className="site-footer">
        <div className="page-wrap footer-inner">
          <div>
            <p className="eyebrow">Vishal Kumar Pandey — BCA Student &amp; Developer</p>
            <p className="footer-note">Building practical web solutions with a focus on clear interfaces and useful technology.</p>
          </div>
          <div className="footer-mark" aria-hidden="true">vk<span className="accent-mark">.</span></div>
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
          <div className="hero-wrapper">
            <p className="eyebrow reveal">BCA STUDENT &amp; DEVELOPER / WEB DEVELOPMENT</p>
            <h1 id="home-title" className="display-heading hero-title text-balance reveal reveal-delay-1">I build practical <em>web solutions.</em></h1>
            <div className="hero-mark" aria-hidden="true" />
            <div className="hero-rail reveal reveal-delay-2">
              <p>I am a BCA student and aspiring software developer who enjoys building responsive, user-friendly web applications and learning through practical projects.</p>
              <Link href="/work" className="button-outline" data-testid="link-home-work">View My Project <span aria-hidden="true">↓</span></Link>
            </div>
          </div>
        </section>

        <section className="page-wrap section-space pt-0" aria-labelledby="featured-title">
          <div className="section-header">
            <div>
              <p className="eyebrow section-kicker">Selected coursework</p>
              <h2 id="featured-title" className="display-heading display-title" style={{ marginTop: '0.75rem' }}>Projects built to be useful.</h2>
            </div>
            <Link href="/work" className="font-mono text-xs underline underline-offset-4 header-cta" data-testid="link-home-all-work">View project details ↗</Link>
          </div>
          <div className="work-grid">
            <Link href="/work#gym-membership-management" className="work-card reveal" data-testid="card-work-gym-membership">
              <div className="work-card-top">
                <span className="eyebrow">01 / Web development</span>
                <span className="eyebrow">Coursework</span>
              </div>
              <div className="card-art art-window" aria-hidden="true" />
              <div className="work-card-bottom">
                <h3 className="card-title">Gym<br />Membership</h3>
                <span className="arrow" aria-hidden="true">↗</span>
              </div>
            </Link>
          </div>
        </section>

        <section className="page-wrap section-space" aria-labelledby="approach-title">
          <div className="split-section">
            <div>
              <p className="eyebrow section-kicker">My focus</p>
              <h2 id="approach-title" className="display-heading display-title" style={{ marginTop: '1rem' }}>Learning by building useful things.</h2>
            </div>
            <div>
              <p style={{ fontSize: '1.25rem', lineHeight: '1.5', maxWidth: '650px' }}>
                I enjoy turning requirements into clear interfaces and reliable functionality. My learning focuses on strong web fundamentals, practical databases, server-side development, and responsible use of APIs.
              </p>
              <Link href="/about" className="button-outline" style={{ marginTop: '2rem' }} data-testid="link-home-about">More about me <span aria-hidden="true">↗</span></Link>
            </div>
          </div>
        </section>

        <section className="page-wrap section-space pt-0" aria-label="Invitation">
          <div className="studio-grid cta-banner">
            <p className="eyebrow">Have a project idea?</p>
            <h2 className="display-heading display-title" style={{ maxWidth: '800px', marginTop: '1.5rem' }}>Let’s build<br /><em>something useful.</em></h2>
            <Link href="/contact" className="button-primary" style={{ marginTop: '2rem' }} data-testid="link-home-contact">Contact me <span aria-hidden="true">↗</span></Link>
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
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: projects.map((project, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: project.title,
      description: project.intro,
    })),
  };

  return (
    <>
      <Meta title="Projects — Vishal Kumar Pandey" description="Explore the Gym Membership Management System built by BCA student and developer Vishal Kumar Pandey." path="/work" schema={schema} />
      <main id="main-content">
        <section className="page-wrap page-intro" aria-labelledby="work-title">
          <p className="eyebrow section-kicker reveal">Projects / Web development</p>
          <h1 id="work-title" className="display-heading display-title reveal reveal-delay-1" style={{ marginTop: '1rem' }}>Projects built with code,<br /><em>curiosity, and care.</em></h1>
          <p className="reveal reveal-delay-2" style={{ marginTop: '1.5rem' }}>I build practical web applications to strengthen my development skills and solve real-world problems.</p>
        </section>
        <section className="page-wrap section-space" aria-labelledby="projects-title">
          <h2 id="projects-title" className="sr-only">Project case studies</h2>
          <div className="projects-container">
            {projects.map((project) => (
              <article id={project.id} key={project.id} className="project-case-study">
                <div className="project-preview-card">
                  <div className={`card-art ${project.art}`} aria-hidden="true" />
                  <span className="eyebrow" style={{ position: 'absolute', left: '1.25rem', bottom: '1.25rem' }}>Project / {project.number}</span>
                </div>
                <div style={{ paddingTop: '0.5rem' }}>
                  <div className="project-meta-row">
                    <span className="eyebrow">{project.type}</span>
                    <span className="eyebrow">{project.year}</span>
                  </div>
                  <h2 className="display-heading display-title" style={{ marginTop: '1.5rem' }}>{project.title}</h2>
                  <p style={{ fontSize: '1.25rem', lineHeight: '1.4', marginTop: '1.25rem', maxWidth: '600px' }}>{project.intro}</p>
                  <p style={{ color: 'var(--color-text-muted)', lineHeight: '1.6', marginTop: '1rem', maxWidth: '600px' }}>{project.detail}</p>
                  <h3 className="eyebrow" style={{ marginTop: '2rem' }}>Features</h3>
                  <ul className="project-feature-list">
                    {project.features.map((feature) => (
                      <li key={feature}>{feature}</li>
                    ))}
                  </ul>
                  <p className="project-tech-outcome">
                    <span style={{ marginRight: '0.75rem' }} aria-hidden="true">↳</span>
                    {project.outcome}
                  </p>
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
          <h1 id="about-title" className="display-heading display-title reveal reveal-delay-1" style={{ marginTop: '1rem' }}>Learning, building, and improving<br /><em>one project at a time.</em></h1>
        </section>
        <section className="page-wrap section-space" aria-labelledby="bio-title">
          <div className="bio-grid">
            <div className="portrait" role="img" aria-label="Abstract portrait mark for Vishal Kumar Pandey">
              <div className="portrait-mark" aria-hidden="true" />
            </div>
            <div>
              <p className="eyebrow section-kicker">A short version</p>
              <h2 id="bio-title" className="display-heading display-title" style={{ marginTop: '1rem' }}>Hi, I’m Vishal.</h2>
              <p style={{ fontSize: '1.15rem', lineHeight: '1.6', marginTop: '1.25rem' }}>
                Hi, I'm Vishal Kumar Pandey, a BCA student and aspiring software developer. I enjoy building practical web applications and exploring technologies that help turn ideas into useful digital solutions.
              </p>
              <p style={{ color: 'var(--color-text-muted)', lineHeight: '1.6', marginTop: '1rem' }}>
                My current interests include web development, Python, JavaScript, databases, and modern application development. I focus on learning by building projects and improving my problem-solving skills.
              </p>
              <Link href="/contact" className="button-primary" style={{ marginTop: '2rem' }} data-testid="link-about-contact">Get in touch <span aria-hidden="true">↗</span></Link>
            </div>
          </div>
        </section>
        <section className="page-wrap section-space pt-0" aria-labelledby="values-title">
          <div className="split-section">
            <div>
              <p className="eyebrow section-kicker">TECHNICAL SKILLS</p>
              <h2 id="values-title" className="display-heading display-title" style={{ marginTop: '1rem' }}>Skills for<br /><em>practical projects.</em></h2>
            </div>
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
          <div className="section-header">
            <div>
              <p className="eyebrow section-kicker">Education</p>
              <h2 id="experience-title" className="display-heading display-title" style={{ marginTop: '0.75rem' }}>What I’m studying.</h2>
            </div>
          </div>
          <div className="timeline">
            <div className="timeline-item">
              <time>Current</time>
              <div>
                <h3>Bachelor of Computer Applications (BCA)</h3>
                <p>Studying computer applications with a focus on web development and software fundamentals.</p>
              </div>
            </div>
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
          <h1 id="contact-title" className="display-heading display-title reveal reveal-delay-1" style={{ marginTop: '1rem' }}>Let's build<br /><em>something useful.</em></h1>
        </section>
        <section className="page-wrap section-space" aria-labelledby="form-title">
          <div className="contact-layout">
            <aside className="contact-aside" aria-labelledby="form-title">
              <h2 id="form-title" className="display-heading display-title">Tell me<br />what you’re building.</h2>
              <p>If you have a project idea, internship opportunity, or simply want to connect, feel free to send me a message.</p>
            </aside>
            <div className="form-card">
              <div className="sr-only" aria-live="polite" aria-atomic="true">
                {sent ? 'Thank you. Your note has been sent. I’ll get back to you within a couple of working days.' : ''}
                {submitAttempted && Object.keys(errors).length > 0 ? `${Object.keys(errors).length} form errors need your attention.` : ''}
              </div>
              {sent && <div className="status-message" role="status">Thank you — your note is staged and ready. I’ll get back to you within a couple of working days.</div>}
              <form onSubmit={submit} noValidate aria-describedby="form-note">
                <p id="form-note" style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>Required fields are marked with <span aria-hidden="true">*</span>.</p>
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

function TodoPage() {
  type TodoItem = {
    id: string;
    text: string;
    completed: boolean;
    createdAt: number;
  };

  type FilterType = 'all' | 'active' | 'completed';

  const STORAGE_KEY = 'vishal_portfolio_todos';

  const INITIAL_TODOS: TodoItem[] = [
    { id: 'todo-1', text: 'Explore responsive portfolio layout & CSS Grid', completed: true, createdAt: 1700000000000 },
    { id: 'todo-2', text: 'Review Gym Membership Management System project', completed: false, createdAt: 1700000001000 },
    { id: 'todo-3', text: 'Test light & dark theme toggle behavior', completed: false, createdAt: 1700000002000 },
  ];

  const [todos, setTodos] = useState<TodoItem[]>(() => {
    if (typeof window === 'undefined') return INITIAL_TODOS;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // ignore
    }
    return INITIAL_TODOS;
  });

  const [inputVal, setInputVal] = useState('');
  const [filter, setFilter] = useState<FilterType>('all');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const [announcement, setAnnouncement] = useState('');
  const editInputRef = useRef<HTMLInputElement | null>(null);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
    } catch (e) {
      console.error('Failed to save to localStorage:', e);
    }
  }, [todos]);

  // Focus edit input on edit start
  useEffect(() => {
    if (editingId && editInputRef.current) {
      editInputRef.current.focus();
    }
  }, [editingId]);

  // Create
  const handleAdd = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = inputVal.trim();
    if (!trimmed) return;
    const newTodo: TodoItem = {
      id: `todo-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      text: trimmed,
      completed: false,
      createdAt: Date.now(),
    };
    setTodos((prev) => [newTodo, ...prev]);
    setInputVal('');
    setAnnouncement(`Task "${trimmed}" added.`);
  };

  // Toggle Completed
  const handleToggle = (id: string) => {
    setTodos((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const nextState = !t.completed;
          setAnnouncement(`Task "${t.text}" marked as ${nextState ? 'completed' : 'active'}.`);
          return { ...t, completed: nextState };
        }
        return t;
      })
    );
  };

  // Delete
  const handleDelete = (id: string, text: string) => {
    setTodos((prev) => prev.filter((t) => t.id !== id));
    if (editingId === id) {
      setEditingId(null);
    }
    setAnnouncement(`Task "${text}" deleted.`);
  };

  // Start Edit
  const handleStartEdit = (todo: TodoItem) => {
    setEditingId(todo.id);
    setEditText(todo.text);
  };

  // Save Edit
  const handleSaveEdit = (id: string) => {
    const trimmed = editText.trim();
    if (trimmed) {
      setTodos((prev) =>
        prev.map((t) => (t.id === id ? { ...t, text: trimmed } : t))
      );
      setAnnouncement(`Task updated to "${trimmed}".`);
    }
    setEditingId(null);
    setEditText('');
  };

  // Cancel Edit
  const handleCancelEdit = () => {
    setEditingId(null);
    setEditText('');
  };

  // Clear Completed
  const handleClearCompleted = () => {
    const count = todos.filter((t) => t.completed).length;
    setTodos((prev) => prev.filter((t) => !t.completed));
    setAnnouncement(`Cleared ${count} completed task${count === 1 ? '' : 's'}.`);
  };

  const filteredTodos = todos.filter((t) => {
    if (filter === 'active') return !t.completed;
    if (filter === 'completed') return t.completed;
    return true;
  });

  const activeCount = todos.filter((t) => !t.completed).length;
  const completedCount = todos.filter((t) => t.completed).length;

  return (
    <>
      <Meta
        title="Interactive To-Do List — Vishal Kumar Pandey"
        description="A client-side task management web application demonstrating JavaScript DOM manipulation, state management, filter pipelines, and localStorage persistence."
        path="/todo"
      />
      <main id="main-content">
        <section className="page-wrap page-intro" aria-labelledby="todo-title">
          <p className="eyebrow section-kicker reveal">JAVASCRIPT &amp; STATE MANAGEMENT</p>
          <h1 id="todo-title" className="display-heading display-title reveal reveal-delay-1" style={{ marginTop: '1rem' }}>
            Interactive <em>To-Do List.</em>
          </h1>
          <p className="reveal reveal-delay-2" style={{ marginTop: '1.5rem' }}>
            A responsive client-side task management application featuring full CRUD capabilities, filter pipelines, and local storage state persistence.
          </p>
        </section>

        <section className="page-wrap section-space" aria-label="Task manager application">
          <div className="todo-container">
            {/* Screen Reader Live Announcements */}
            <div className="sr-only" aria-live="polite" aria-atomic="true">
              {announcement}
            </div>

            <div className="todo-card">
              {/* Task Creation Form */}
              <form onSubmit={handleAdd} className="todo-form" aria-label="Add new task">
                <div className="todo-input-wrap">
                  <label htmlFor="new-todo-input" className="sr-only">
                    What needs to be done?
                  </label>
                  <input
                    id="new-todo-input"
                    type="text"
                    className="todo-input"
                    placeholder="Add a new task..."
                    value={inputVal}
                    onChange={(e) => setInputVal(e.target.value)}
                    required
                    data-testid="input-new-todo"
                  />
                </div>
                <button type="submit" className="button-primary" data-testid="button-add-todo">
                  Add Task <span aria-hidden="true">↗</span>
                </button>
              </form>

              {/* Filters & Statistics Toolbar */}
              <div className="todo-toolbar">
                <div>
                  <strong>{activeCount}</strong> {activeCount === 1 ? 'task' : 'tasks'} remaining
                </div>
                <div className="todo-filters" role="group" aria-label="Task filters">
                  <button
                    type="button"
                    className={`todo-filter-btn ${filter === 'all' ? 'is-active' : ''}`}
                    onClick={() => setFilter('all')}
                    aria-pressed={filter === 'all'}
                    data-testid="filter-all"
                  >
                    All ({todos.length})
                  </button>
                  <button
                    type="button"
                    className={`todo-filter-btn ${filter === 'active' ? 'is-active' : ''}`}
                    onClick={() => setFilter('active')}
                    aria-pressed={filter === 'active'}
                    data-testid="filter-active"
                  >
                    Active ({activeCount})
                  </button>
                  <button
                    type="button"
                    className={`todo-filter-btn ${filter === 'completed' ? 'is-active' : ''}`}
                    onClick={() => setFilter('completed')}
                    aria-pressed={filter === 'completed'}
                    data-testid="filter-completed"
                  >
                    Completed ({completedCount})
                  </button>
                </div>
              </div>

              {/* Task List */}
              {filteredTodos.length === 0 ? (
                <div className="todo-empty" data-testid="todo-empty-state">
                  <p className="todo-empty-title">
                    {filter === 'all' ? 'All caught up!' : filter === 'active' ? 'No active tasks!' : 'No completed tasks yet.'}
                  </p>
                  <p>
                    {filter === 'all'
                      ? 'You have no tasks in your list. Type a new task above and hit "Add Task" to get started.'
                      : filter === 'active'
                      ? 'Great job! All of your existing tasks are marked as completed.'
                      : 'Complete a task from your active list to see it appear here.'}
                  </p>
                </div>
              ) : (
                <ul className="todo-list" aria-label="Task list">
                  {filteredTodos.map((todo) => {
                    const isEditing = editingId === todo.id;
                    return (
                      <li key={todo.id} className={`todo-item ${todo.completed ? 'is-completed' : ''}`} data-testid={`todo-item-${todo.id}`}>
                        {isEditing ? (
                          <div className="todo-edit-wrap">
                            <label htmlFor={`edit-input-${todo.id}`} className="sr-only">
                              Edit task text
                            </label>
                            <input
                              id={`edit-input-${todo.id}`}
                              ref={editInputRef}
                              type="text"
                              className="todo-edit-input"
                              value={editText}
                              onChange={(e) => setEditText(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') handleSaveEdit(todo.id);
                                if (e.key === 'Escape') handleCancelEdit();
                              }}
                              data-testid="input-edit-todo"
                            />
                            <button
                              type="button"
                              className="todo-btn-icon todo-btn-save"
                              onClick={() => handleSaveEdit(todo.id)}
                              aria-label="Save edited task"
                              data-testid="button-save-edit"
                            >
                              Save
                            </button>
                            <button
                              type="button"
                              className="todo-btn-icon"
                              onClick={handleCancelEdit}
                              aria-label="Cancel editing"
                              data-testid="button-cancel-edit"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <>
                            <div className="todo-content">
                              <input
                                id={`checkbox-${todo.id}`}
                                type="checkbox"
                                className="todo-checkbox"
                                checked={todo.completed}
                                onChange={() => handleToggle(todo.id)}
                                aria-label={`Mark task "${todo.text}" as ${todo.completed ? 'incomplete' : 'completed'}`}
                                data-testid={`checkbox-todo-${todo.id}`}
                              />
                              <label
                                htmlFor={`checkbox-${todo.id}`}
                                className="todo-text"
                                onDoubleClick={() => handleStartEdit(todo)}
                                title="Double-click to edit"
                              >
                                {todo.text}
                              </label>
                            </div>
                            <div className="todo-actions">
                              <button
                                type="button"
                                className="todo-btn-icon"
                                onClick={() => handleStartEdit(todo)}
                                aria-label={`Edit task "${todo.text}"`}
                                title="Edit task"
                                data-testid={`button-edit-${todo.id}`}
                              >
                                Edit
                              </button>
                              <button
                                type="button"
                                className="todo-btn-icon todo-btn-delete"
                                onClick={() => handleDelete(todo.id, todo.text)}
                                aria-label={`Delete task "${todo.text}"`}
                                title="Delete task"
                                data-testid={`button-delete-${todo.id}`}
                              >
                                Delete
                              </button>
                            </div>
                          </>
                        )}
                      </li>
                    );
                  })}
                </ul>
              )}

              {/* Footer Summary / Clear Completed */}
              <div className="todo-footer-bar">
                <span>Stored locally in your browser</span>
                {completedCount > 0 && (
                  <button
                    type="button"
                    className="todo-btn-clear"
                    onClick={handleClearCompleted}
                    data-testid="button-clear-completed"
                  >
                    Clear completed ({completedCount})
                  </button>
                )}
              </div>
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
          <Route path="/work/:rest*" component={Work} />
          <Route path="/todo" component={TodoPage} />
          <Route path="/todo/:rest*" component={TodoPage} />
          <Route path="/tasks" component={TodoPage} />
          <Route path="/tasks/:rest*" component={TodoPage} />
          <Route path="/about" component={About} />
          <Route path="/about/:rest*" component={About} />
          <Route path="/contact" component={Contact} />
          <Route path="/contact/:rest*" component={Contact} />
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