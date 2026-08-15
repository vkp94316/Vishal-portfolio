import { useState, useMemo } from 'react';
import {
  Search, Plus, ArrowUpRight, ArrowRight, Mail, Phone,
  Heart, Filter, ChevronDown, Circle, Users, Send, Clock
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const CONTACTS = [
  { id: 1,  name: 'Marisol Vega',     role: 'Director of Curriculum', org: 'Ridgeline Unified SD',   segment: 'K-12',       seats: 1240, plan: 'District',  renewal: 'Mar 14', engagement: 92, status: 'Engaged',  initials: 'MV', last: '2d ago' },
  { id: 2,  name: 'Daniel Okafor',    role: 'Dean of Online Learning', org: 'Carver State College',  segment: 'Higher Ed',  seats: 3800, plan: 'Campus',    renewal: 'Mar 02', engagement: 67, status: 'Due soon', initials: 'DO', last: '5h ago' },
  { id: 3,  name: 'Priya Raghunathan',role: 'Head of School',          org: 'Maplewood Montessori',  segment: 'K-12',       seats: 310,  plan: 'School',    renewal: 'Apr 21', engagement: 88, status: 'Engaged',  initials: 'PR', last: '1d ago' },
  { id: 4,  name: 'Tom Lindqvist',    role: 'Learning Ops Manager',    org: 'Brightpath Tutoring',   segment: 'Tutoring',   seats: 96,   plan: 'Team',      renewal: 'Feb 28', engagement: 41, status: 'At risk',  initials: 'TL', last: '12d ago' },
  { id: 5,  name: 'Aisha Bello',      role: 'EdTech Coordinator',      org: 'Lakeview Public Schools',segment: 'K-12',      seats: 2150, plan: 'District',  renewal: 'Mar 09', engagement: 74, status: 'Due soon', initials: 'AB', last: '3d ago' },
  { id: 6,  name: 'Jonas Petersen',   role: 'Provost, Digital Programs',org: 'Northgate University', segment: 'Higher Ed',  seats: 5600, plan: 'Campus',    renewal: 'May 30', engagement: 81, status: 'Engaged',  initials: 'JP', last: '6h ago' },
  { id: 7,  name: 'Rosa Camacho',     role: 'Founder',                 org: 'Semilla Learning Lab',  segment: 'Tutoring',   seats: 48,   plan: 'Team',      renewal: 'Mar 01', engagement: 35, status: 'At risk',  initials: 'RC', last: '18d ago' },
  { id: 8,  name: 'Hannah Whitfield', role: 'Asst. Superintendent',    org: 'Cedar Falls CSD',       segment: 'K-12',       seats: 1875, plan: 'District',  renewal: 'Mar 11', engagement: 58, status: 'Due soon', initials: 'HW', last: '4d ago' },
  { id: 9,  name: 'Kenji Watanabe',   role: 'Director, Student Success',org: 'Pacific Crest College',segment: 'Higher Ed',  seats: 2900, plan: 'Campus',    renewal: 'Jun 17', engagement: 95, status: 'Engaged',  initials: 'KW', last: '1h ago' },
  { id: 10, name: 'Leah Strickland',  role: 'Program Manager',         org: 'Open Door Adult Ed',    segment: 'Tutoring',   seats: 220,  plan: 'School',    renewal: 'Mar 05', engagement: 49, status: 'Due soon', initials: 'LS', last: '7d ago' },
];

const TABS = ['All', 'Due soon', 'Engaged', 'At risk'];

const STATUS_STYLE = {
  'Engaged':  { dot: '#1A7A4C', bg: 'rgba(26,122,76,0.08)',  text: '#1A7A4C' },
  'Due soon': { dot: '#E8501F', bg: 'rgba(232,80,31,0.08)',  text: '#C2401A' },
  'At risk':  { dot: '#1A1816', bg: 'rgba(26,24,22,0.06)',   text: '#1A1816' },
};

function SegmentBar({ label, value, total, accent }) {
  const pct = Math.round((value / total) * 100);
  return (
    <div className="group">
      <div className="flex items-baseline justify-between mb-[6px]">
        <span className="text-[11px] uppercase tracking-[0.12em] text-[#6B655C]">{label}</span>
        <span className="text-[14px] font-medium tabular-nums text-[#1A1816]">{value}</span>
      </div>
      <div className="h-[6px] w-full bg-[#E9E4DB] overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="h-full"
          style={{ background: accent }}
        />
      </div>
    </div>
  );
}

export default function App() {
  const [tab, setTab] = useState('All');
  const [selected, setSelected] = useState([2, 5]);
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    return CONTACTS.filter(c => {
      const matchTab = tab === 'All' || c.status === tab;
      const q = query.toLowerCase();
      const matchQ = !q || c.name.toLowerCase().includes(q) || c.org.toLowerCase().includes(q);
      return matchTab && matchQ;
    });
  }, [tab, query]);

  const toggle = (id) =>
    setSelected(s => (s.includes(id) ? s.filter(x => x !== id) : [...s, id]));

  const allChecked = filtered.length > 0 && filtered.every(c => selected.includes(c.id));

  return (
    <div className="min-h-screen bg-[#F2EEE7] text-[#1A1816] font-sans antialiased" style={{ fontFamily: "'Archivo', 'Helvetica Neue', Helvetica, sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Archivo:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=Archivo+Expanded:wght@500;600;700&display=swap" rel="stylesheet" />
      <style dangerouslySetInnerHTML={{ __html: `
        * { box-sizing: border-box; }
        ::selection { background: #E8501F; color: #FBFAF6; }
        .hairline { border-color: rgba(26,24,22,0.14); }
        .row-hover:hover { background: #FBF8F2; }
        .display-type { font-family: 'Archivo Expanded', 'Archivo', sans-serif; letter-spacing: -0.04em; }
        ::-webkit-scrollbar { width: 8px; height: 8px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #D6CFC2; }
        ::-webkit-scrollbar-thumb:hover { background: #BFB6A6; }
        input[type="checkbox"] { accent-color: #E8501F; }
        .ring-grid { background-image: linear-gradient(rgba(26,24,22,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(26,24,22,0.05) 1px, transparent 1px); background-size: 28px 28px; }
      `}} />

      {/* ── Top bar ───────────────────────────────── */}
      <header className="border-b hairline bg-[#FBFAF6]">
        <div className="max-w-[1440px] mx-auto px-8 h-[60px] flex items-center justify-between">
          <div className="flex items-center gap-10">
            <div className="flex items-center gap-2.5">
              <div className="w-[22px] h-[22px] bg-[#E8501F] grid place-items-center">
                <Heart size={12} strokeWidth={2.5} className="text-[#FBFAF6]" fill="#FBFAF6" />
              </div>
              <span className="text-[14px] font-semibold tracking-tight">Tendril&nbsp;Learn</span>
              <span className="text-[11px] uppercase tracking-[0.14em] text-[#8A8276] mt-[1px] ml-1">Care&nbsp;CRM</span>
            </div>
            <nav className="hidden md:flex items-center gap-7 text-[14px]">
              <a className="text-[#1A1816] font-medium border-b-2 border-[#E8501F] pb-[19px] -mb-[21px]" href="#">Contacts</a>
              <a className="text-[#8A8276] hover:text-[#1A1816] transition-colors" href="#">Campaigns</a>
              <a className="text-[#8A8276] hover:text-[#1A1816] transition-colors" href="#">Renewals</a>
              <a className="text-[#8A8276] hover:text-[#1A1816] transition-colors" href="#">Reports</a>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 border hairline bg-white px-3 h-[34px] w-[260px]">
              <Search size={14} className="text-[#8A8276]" />
              <input
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search educators, schools…"
                className="bg-transparent outline-none text-[14px] w-full placeholder:text-[#A39A8B]"
              />
            </div>
            <button className="flex items-center gap-2 bg-[#1A1816] text-[#FBFAF6] text-[14px] font-medium h-[34px] px-4 hover:bg-[#E8501F] transition-colors">
              <Plus size={14} /> New contact
            </button>
            <div className="w-[34px] h-[34px] bg-[#E8501F] text-[#FBFAF6] grid place-items-center text-[12px] font-semibold">SR</div>
          </div>
        </div>
      </header>

      {/* ── Bento grid ────────────────────────────── */}
      <main className="max-w-[1440px] mx-auto px-8 py-8">
        <div className="grid grid-cols-12 gap-[14px]">

          {/* HERO — seasonal promo */}
          <motion.section
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            className="col-span-12 lg:col-span-7 bg-[#E8501F] text-[#FBF6EF] relative overflow-hidden"
          >
            <div className="ring-grid absolute inset-0 opacity-[0.35]" style={{ filter: 'invert(1)' }} />
            <div className="relative p-8 pb-7 flex flex-col h-full justify-between min-h-[340px]">
              <div className="flex items-start justify-between">
                <span className="text-[11px] uppercase tracking-[0.18em] border border-[#FBF6EF]/50 px-2.5 py-1">Seasonal campaign · Ends Mar 31</span>
                <span className="text-[11px] uppercase tracking-[0.18em] opacity-80">02 — Spring 2025</span>
              </div>
              <div className="mt-6">
                <h1 className="display-type leading-[0.86] text-[88px] sm:text-[124px] font-700 font-bold">
                  Spring<br />Care&nbsp;<span className="italic font-normal" style={{ fontFamily: 'Archivo' }}>—40%</span>
                </h1>
                <p className="text-[14px] max-w-[420px] mt-5 leading-[1.55] opacity-95">
                  Renewal relief for the educators who carry the most. Every contact below qualifies
                  for 40% off seat expansions through March — reach out before their budgets close.
                </p>
              </div>
              <div className="flex items-center gap-3 mt-7">
                <button className="flex items-center gap-2 bg-[#1A1816] text-[#FBF6EF] text-[14px] font-medium h-[40px] px-5 hover:bg-[#FBF6EF] hover:text-[#1A1816] transition-colors">
                  <Send size={14} /> Send care campaign ({selected.length})
                </button>
                <button className="flex items-center gap-2 border border-[#FBF6EF]/60 text-[14px] h-[40px] px-5 hover:bg-[#FBF6EF]/10 transition-colors">
                  Preview offer <ArrowUpRight size={14} />
                </button>
              </div>
            </div>
          </motion.section>

          {/* Campaign reach */}
          <motion.section
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.06 }}
            className="col-span-6 lg:col-span-3 bg-[#FBFAF6] border hairline p-6 flex flex-col justify-between"
          >
            <div className="flex items-start justify-between">
              <span className="text-[11px] uppercase tracking-[0.14em] text-[#6B655C]">Eligible contacts</span>
              <Users size={15} className="text-[#A39A8B]" />
            </div>
            <div>
              <div className="display-type text-[72px] leading-none font-semibold tracking-tight">248</div>
              <div className="text-[14px] text-[#6B655C] mt-2">across 61 schools & districts</div>
            </div>
            <div>
              <div className="flex justify-between text-[11px] uppercase tracking-[0.12em] text-[#6B655C] mb-[6px]">
                <span>Reached so far</span><span className="text-[#1A1816] font-medium">156 / 248</span>
              </div>
              <div className="h-[6px] bg-[#E9E4DB]">
                <motion.div initial={{ width: 0 }} animate={{ width: '63%' }} transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.3 }} className="h-full bg-[#E8501F]" />
              </div>
            </div>
          </motion.section>

          {/* Right mini column */}
          <div className="col-span-6 lg:col-span-2 flex flex-col gap-[14px]">
            <motion.section
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-[#1A1816] text-[#FBF6EF] p-5 flex-1 flex flex-col justify-between min-h-[160px]"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] uppercase tracking-[0.14em] opacity-70">Days left</span>
                <Clock size={14} className="opacity-60" />
              </div>
              <div>
                <div className="display-type text-[56px] leading-none font-semibold">27</div>
                <div className="text-[14px] opacity-70 mt-1">until offer closes</div>
              </div>
            </motion.section>
            <motion.section
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.14 }}
              className="bg-[#FBFAF6] border hairline p-5 flex-1 flex flex-col justify-between min-h-[160px]"
            >
              <span className="text-[11px] uppercase tracking-[0.14em] text-[#6B655C]">Conversion</span>
              <div>
                <div className="display-type text-[56px] leading-none font-semibold">31<span className="text-[28px] align-top">%</span></div>
                <div className="text-[14px] text-[#1A7A4C] mt-1 flex items-center gap-1">
                  <ArrowUpRight size={13} /> +9 pts vs. fall drive
                </div>
              </div>
            </motion.section>
          </div>

          {/* CONTACT LIST — main table */}
          <motion.section
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.18 }}
            className="col-span-12 lg:col-span-9 bg-[#FBFAF6] border hairline"
          >
            {/* table header bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 px-6 pt-5 pb-4 border-b hairline">
              <div className="flex items-baseline gap-3">
                <h2 className="text-[18px] font-semibold tracking-tight">Promotion contacts</h2>
                <span className="text-[11px] uppercase tracking-[0.14em] text-[#8A8276]">{filtered.length} shown · {selected.length} selected</span>
              </div>
              <div className="flex items-center gap-1">
                {TABS.map(t => (
                  <button
                    key={t}
                    onClick={() => setTab(t)}
                    className={`text-[13px] h-[30px] px-3.5 transition-colors ${
                      tab === t
                        ? 'bg-[#1A1816] text-[#FBF6EF]'
                        : 'text-[#6B655C] hover:bg-[#EFEAE1]'
                    }`}
                  >
                    {t}
                    {t !== 'All' && (
                      <span className="ml-1.5 tabular-nums opacity-60">
                        {CONTACTS.filter(c => c.status === t).length}
                      </span>
                    )}
                  </button>
                ))}
                <button className="ml-2 flex items-center gap-1.5 text-[13px] h-[30px] px-3 border hairline text-[#6B655C] hover:bg-[#EFEAE1] transition-colors">
                  <Filter size={13} /> Sort: Renewal <ChevronDown size={13} />
                </button>
              </div>
            </div>

            {/* column heads */}
            <div className="grid grid-cols-[36px_minmax(220px,2.2fr)_1.6fr_0.9fr_0.7fr_0.9fr_1fr_0.9fr_72px] items-center px-6 h-[38px] text-[11px] uppercase tracking-[0.12em] text-[#8A8276] border-b hairline">
              <div>
                <input
                  type="checkbox"
                  checked={allChecked}
                  onChange={() => setSelected(allChecked ? [] : filtered.map(c => c.id))}
                  className="w-[14px] h-[14px] cursor-pointer"
                />
              </div>
              <div>Contact</div>
              <div>Organization</div>
              <div>Segment</div>
              <div className="text-right">Seats</div>
              <div className="pl-6">Renewal</div>
              <div>Engagement</div>
              <div>Status</div>
              <div className="text-right">Reach</div>
            </div>

            {/* rows */}
            <div>
              <AnimatePresence initial={false}>
                {filtered.map((c) => {
                  const st = STATUS_STYLE[c.status];
                  const isSel = selected.includes(c.id);
                  return (
                    <motion.div
                      key={c.id}
                      layout
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      transition={{ duration: 0.18 }}
                      className={`row-hover grid grid-cols-[36px_minmax(220px,2.2fr)_1.6fr_0.9fr_0.7fr_0.9fr_1fr_0.9fr_72px] items-center px-6 h-[58px] text-[14px] border-b hairline cursor-pointer ${isSel ? 'bg-[#FCEFE9]' : ''}`}
                      onClick={() => toggle(c.id)}
                    >
                      <div onClick={e => e.stopPropagation()}>
                        <input type="checkbox" checked={isSel} onChange={() => toggle(c.id)} className="w-[14px] h-[14px] cursor-pointer" />
                      </div>
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`w-[34px] h-[34px] grid place-items-center text-[12px] font-semibold shrink-0 ${isSel ? 'bg-[#E8501F] text-[#FBF6EF]' : 'bg-[#1A1816] text-[#FBF6EF]'}`}>
                          {c.initials}
                        </div>
                        <div className="min-w-0">
                          <div className="font-medium truncate leading-tight">{c.name}</div>
                          <div className="text-[12px] text-[#8A8276] truncate leading-tight mt-[2px]">{c.role}</div>
                        </div>
                      </div>
                      <div className="truncate text-[#3A352E]">{c.org}</div>
                      <div>
                        <span className="text-[12px] border hairline px-2 py-[3px] text-[#6B655C]">{c.segment}</span>
                      </div>
                      <div className="text-right tabular-nums">{c.seats.toLocaleString()}</div>
                      <div className="pl-6 tabular-nums">{c.renewal}</div>
                      <div className="flex items-center gap-2.5 pr-4">
                        <div className="h-[5px] flex-1 bg-[#E9E4DB] max-w-[80px]">
                          <div className="h-full" style={{ width: `${c.engagement}%`, background: c.engagement > 70 ? '#1A7A4C' : c.engagement > 50 ? '#E8501F' : '#1A1816' }} />
                        </div>
                        <span className="text-[12px] tabular-nums text-[#6B655C] w-[28px]">{c.engagement}</span>
                      </div>
                      <div>
                        <span className="inline-flex items-center gap-1.5 text-[12px] font-medium px-2 py-[4px]" style={{ background: st.bg, color: st.text }}>
                          <Circle size={6} fill={st.dot} stroke="none" /> {c.status}
                        </span>
                      </div>
                      <div className="flex items-center justify-end gap-1" onClick={e => e.stopPropagation()}>
                        <button className="w-[28px] h-[28px] grid place-items-center border hairline text-[#6B655C] hover:bg-[#1A1816] hover:text-[#FBF6EF] transition-colors">
                          <Mail size={13} />
                        </button>
                        <button className="w-[28px] h-[28px] grid place-items-center border hairline text-[#6B655C] hover:bg-[#1A1816] hover:text-[#FBF6EF] transition-colors">
                          <Phone size={13} />
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
              {filtered.length === 0 && (
                <div className="px-6 py-12 text-center text-[14px] text-[#8A8276]">No contacts match this view.</div>
              )}
            </div>

            {/* footer */}
            <div className="flex items-center justify-between px-6 h-[48px] text-[12px] text-[#8A8276]">
              <span className="uppercase tracking-[0.12em]">Showing {filtered.length} of 248 eligible</span>
              <div className="flex items-center gap-4">
                <button className="hover:text-[#1A1816] transition-colors">← Prev</button>
                <span className="tabular-nums text-[#1A1816]">01 / 25</span>
                <button className="hover:text-[#1A1816] transition-colors">Next →</button>
              </div>
            </div>
          </motion.section>

          {/* Right rail of bento */}
          <div className="col-span-12 lg:col-span-3 flex flex-col gap-[14px]">

            {/* Segments */}
            <motion.section
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.22 }}
              className="bg-[#FBFAF6] border hairline p-6"
            >
              <div className="flex items-baseline justify-between mb-5">
                <h3 className="text-[14px] font-semibold tracking-tight">Who we're caring for</h3>
                <span className="text-[11px] uppercase tracking-[0.12em] text-[#8A8276]">By segment</span>
              </div>
              <div className="space-y-4">
                <SegmentBar label="K-12 Districts" value={129} total={248} accent="#E8501F" />
                <SegmentBar label="Higher Education" value={74} total={248} accent="#1A1816" />
                <SegmentBar label="Tutoring & Adult Ed" value={45} total={248} accent="#1A7A4C" />
              </div>
            </motion.section>

            {/* Needs a check-in */}
            <motion.section
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.26 }}
              className="bg-[#FBFAF6] border hairline p-6 flex-1"
            >
              <div className="flex items-baseline justify-between mb-4">
                <h3 className="text-[14px] font-semibold tracking-tight">Needs a check-in</h3>
                <span className="text-[11px] uppercase tracking-[0.12em] text-[#E8501F]">3 quiet</span>
              </div>
              <p className="text-[13px] text-[#6B655C] leading-[1.5] mb-4">
                These educators haven't heard from us in over a week. A short, personal note goes further than the discount.
              </p>
              <div className="space-y-px">
                {[CONTACTS[6], CONTACTS[3], CONTACTS[9]].map(c => (
                  <div key={c.id} className="flex items-center justify-between py-2.5 border-t hairline group">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-[26px] h-[26px] bg-[#EFEAE1] text-[#1A1816] grid place-items-center text-[10px] font-semibold">{c.initials}</div>
                      <div className="min-w-0">
                        <div className="text-[13px] font-medium truncate">{c.name}</div>
                        <div className="text-[11px] text-[#8A8276] truncate">{c.last} · {c.org}</div>
                      </div>
                    </div>
                    <button className="text-[12px] flex items-center gap-1 text-[#6B655C] group-hover:text-[#E8501F] transition-colors shrink-0">
                      Reach out <ArrowRight size={12} />
                    </button>
                  </div>
                ))}
              </div>
            </motion.section>

            {/* Promo footnote card */}
            <motion.section
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-[#1A1816] text-[#FBF6EF] p-6"
            >
              <div className="text-[11px] uppercase tracking-[0.16em] opacity-70 mb-3">Care note of the week</div>
              <p className="text-[14px] leading-[1.55]">
                "Tendril let our reading interventionists actually see which kids were slipping —
                before report cards did."
              </p>
              <div className="text-[12px] opacity-70 mt-3">— Marisol Vega, Ridgeline USD · shared with permission</div>
            </motion.section>
          </div>
        </div>

        {/* footer rule */}
        <div className="flex items-center justify-between mt-8 pt-4 border-t hairline text-[11px] uppercase tracking-[0.14em] text-[#8A8276]">
          <span>Tendril Learn — Customer Care Workspace</span>
          <span>Grid 12 · Spring drive 2025</span>
        </div>
      </main>
    </div>
  );
}