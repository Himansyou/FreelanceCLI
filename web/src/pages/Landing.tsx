import { Link } from 'react-router-dom'

export default function Landing() {
  return (
    <main className="min-h-screen bg-background text-on-surface overflow-x-hidden">
      {/* ── NAV ─────────────────────────────────────────────── */}
      <header className="fixed top-0 w-full z-40 bg-black/70 backdrop-blur-xl border-b border-outline-variant/20">
        <nav className="max-w-7xl mx-auto px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-2xl">terminal</span>
            <span className="text-xl font-black tracking-tighter">FreelanceCLI</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm text-on-surface-variant font-medium">
            <a href="#features" className="hover:text-on-surface transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-on-surface transition-colors">How it works</a>
            <a href="#stats" className="hover:text-on-surface transition-colors">Stats</a>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login" className="text-on-surface-variant hover:text-on-surface transition-colors px-3 py-2 text-sm font-medium">
              Log in
            </Link>
            <Link
              to="/setup-guide"
              className="bg-primary-container text-on-primary px-5 py-2 rounded-xl font-bold text-sm active:scale-95 transition-transform hover:brightness-110"
            >
              Get Started
            </Link>
          </div>
        </nav>
      </header>

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="pt-40 pb-28 px-8 max-w-7xl mx-auto">
        <div className="relative bg-surface-container rounded-[40px] border border-outline-variant/20 p-10 md:p-20 text-center overflow-hidden">
          {/* Decorative glow blobs */}
          <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-primary/10 blur-[120px] pointer-events-none" />
          <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-tertiary/10 blur-[120px] pointer-events-none" />

          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface-container-high border border-outline-variant/30 mb-8">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Built for Freelancers</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-tight mb-6">
              Track Every Billable Hour<br />
              with <span className="text-primary">FreelanceCLI</span>
            </h1>
            <p className="max-w-2xl mx-auto text-on-surface-variant text-lg md:text-xl mb-12 leading-relaxed">
              Start sessions right from your terminal, sync securely to the cloud, and share clean project reports with clients — all from one unified tool.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/setup-guide"
                className="bg-primary-container text-on-primary px-10 py-4 rounded-2xl font-black text-base hover:brightness-110 active:scale-95 transition-all shadow-[0_0_30px_rgba(156,255,147,0.25)]"
              >
                Get Started Free →
              </Link>
              <Link
                to="/login"
                className="bg-surface-container-high text-on-surface px-10 py-4 rounded-2xl font-bold text-base hover:bg-surface-bright transition-colors border border-outline-variant/30"
              >
                Log In
              </Link>
            </div>

            {/* terminal mockup pill */}
            <div className="mt-14 mx-auto max-w-xl bg-surface-container-highest rounded-2xl p-5 text-left font-mono text-sm border border-outline-variant/20">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-3 h-3 rounded-full bg-error/60" />
                <span className="w-3 h-3 rounded-full bg-primary-container/60" />
                <span className="w-3 h-3 rounded-full bg-primary/60" />
              </div>
              <p className="text-on-surface-variant">$ <span className="text-primary">freelance</span> start "Client Portal redesign"</p>
              <p className="text-on-surface-variant/60 mt-1">▸ Session started — 2025-04-25 10:32 AM</p>
              <p className="text-on-surface-variant mt-2">$ <span className="text-primary">freelance</span> stop</p>
              <p className="text-on-surface-variant/60 mt-1">▸ Session stopped — 3h 42m logged ✓</p>
              <p className="text-on-surface-variant mt-2">$ <span className="text-primary">freelance</span> sync</p>
              <p className="text-on-surface-variant/60 mt-1">▸ Synced 1 session to server <span className="text-primary">✓</span></p>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS ────────────────────────────────────────────── */}
      <section id="stats" className="px-8 pb-24 max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-outline-variant/20 rounded-3xl overflow-hidden border border-outline-variant/20">
          {[
            { value: '10k+', label: 'Sessions Tracked' },
            { value: '98%', label: 'Uptime' },
            { value: '500+', label: 'Active Users' },
            { value: '< 100ms', label: 'Sync Latency' },
          ].map((s) => (
            <div key={s.label} className="bg-surface-container p-8 text-center">
              <p className="text-3xl md:text-4xl font-black text-primary mb-1">{s.value}</p>
              <p className="text-xs uppercase tracking-widest text-on-surface-variant font-medium">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ─────────────────────────────────────────── */}
      <section id="features" className="px-8 pb-28 max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <p className="text-xs font-mono uppercase tracking-widest text-primary mb-3">Features</p>
          <h2 className="text-4xl md:text-5xl font-black tracking-tighter">Everything you need,<br />nothing you don't</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              icon: 'terminal',
              title: 'CLI-first Workflow',
              desc: 'Use simple, memorable commands to start, stop, and manage your work sessions without leaving the terminal.',
              accent: 'text-primary',
            },
            {
              icon: 'cloud_sync',
              title: 'Offline + Auto Sync',
              desc: 'Keep tracking even when offline. All sessions are queued locally and synced automatically when connectivity returns.',
              accent: 'text-tertiary',
            },
            {
              icon: 'analytics',
              title: 'Rich Reports',
              desc: 'Generate beautiful project reports with session breakdowns, total hours, and export-ready data for client billing.',
              accent: 'text-secondary',
            },
            {
              icon: 'lock',
              title: 'Secure by Default',
              desc: 'JWT-based authentication, encrypted token storage, and role-scoped API access out of the box.',
              accent: 'text-primary',
            },
            {
              icon: 'speed',
              title: 'Blazing Fast',
              desc: 'Spring Boot backend with sub-100ms API responses. The CLI never slows down your development flow.',
              accent: 'text-tertiary',
            },
            {
              icon: 'folder_open',
              title: 'Project Scoped',
              desc: 'Separate sessions and reports by project. Share targeted reports with each client — nothing leaks across.',
              accent: 'text-secondary',
            },
          ].map((f) => (
            <div
              key={f.title}
              className="group bg-surface-container-low rounded-3xl p-7 border border-outline-variant/20 hover:border-primary/30 hover:bg-surface-container transition-all duration-300"
            >
              <span className={`material-symbols-outlined text-3xl ${f.accent} mb-4 block`}>{f.icon}</span>
              <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors">{f.title}</h3>
              <p className="text-sm text-on-surface-variant leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────── */}
      <section id="how-it-works" className="px-8 pb-28 max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <p className="text-xs font-mono uppercase tracking-widest text-primary mb-3">How it works</p>
          <h2 className="text-4xl md:text-5xl font-black tracking-tighter">Three commands.<br />Full control.</h2>
        </div>

        <div className="relative grid md:grid-cols-3 gap-6">
          {/* connector line (desktop) */}
          <div className="hidden md:block absolute top-10 left-1/6 right-1/6 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent pointer-events-none" />

          {[
            { step: '01', icon: 'login', title: 'Install & Authenticate', desc: 'Install the CLI via pip or brew, then run `freelance login` with your FreelanceCLI credentials.' },
            { step: '02', icon: 'play_circle', title: 'Start & Stop Sessions', desc: 'Run `freelance start "Project name"` to begin. Stop with `freelance stop`. Sessions are stored locally.' },
            { step: '03', icon: 'share', title: 'Sync & Share Reports', desc: 'Sync to the cloud and view your dashboard. Export polished PDF/CSV reports for clients in one click.' },
          ].map((s) => (
            <div key={s.step} className="relative bg-surface-container rounded-3xl p-8 border border-outline-variant/20 text-center">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-surface-container-high border border-primary/20 mb-5">
                <span className="material-symbols-outlined text-primary text-2xl">{s.icon}</span>
              </div>
              <p className="text-xs font-mono text-on-surface-variant/50 mb-2">{s.step}</p>
              <h3 className="text-lg font-bold mb-3">{s.title}</h3>
              <p className="text-sm text-on-surface-variant leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── TESTIMONIALS ─────────────────────────────────────── */}
      <section className="px-8 pb-28 max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <p className="text-xs font-mono uppercase tracking-widest text-primary mb-3">Testimonials</p>
          <h2 className="text-4xl md:text-5xl font-black tracking-tighter">Loved by freelancers</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              quote: "FreelanceCLI changed how I bill clients. I no longer guess hours — I just export the report.",
              name: 'Aditya R.',
              role: 'Full-stack Developer',
            },
            {
              quote: "The terminal-first approach is exactly what I wanted. No Electron, no overhead, just `freelance start`.",
              name: 'Priya M.',
              role: 'DevOps Consultant',
            },
            {
              quote: "Offline sync is a lifesaver when I'm working from cafes with spotty wifi. Sessions never get lost.",
              name: 'Carlos T.',
              role: 'UI/UX Designer',
            },
          ].map((t) => (
            <div key={t.name} className="bg-surface-container-low rounded-3xl p-7 border border-outline-variant/20">
              <span className="material-symbols-outlined text-primary/60 text-4xl mb-4 block">format_quote</span>
              <p className="text-on-surface-variant text-sm leading-relaxed mb-6">"{t.quote}"</p>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center">
                  <span className="text-primary font-bold text-sm">{t.name[0]}</span>
                </div>
                <div>
                  <p className="text-sm font-bold">{t.name}</p>
                  <p className="text-xs text-on-surface-variant">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────── */}
      <section className="px-8 pb-32 max-w-7xl mx-auto">
        <div className="relative bg-surface-container rounded-[40px] border border-primary/20 p-12 md:p-20 text-center overflow-hidden">
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-80 h-80 rounded-full bg-primary/10 blur-[100px] pointer-events-none" />
          <div className="relative z-10">
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-5">
              Ready to own your <span className="text-primary">time?</span>
            </h2>
            <p className="text-on-surface-variant text-lg mb-10 max-w-xl mx-auto">
              Join hundreds of freelancers who trust FreelanceCLI for accurate tracking and professional reporting.
            </p>
            <Link
              to="/setup-guide"
              className="inline-block bg-primary-container text-on-primary px-12 py-5 rounded-2xl font-black text-lg hover:brightness-110 active:scale-95 transition-all shadow-[0_0_40px_rgba(156,255,147,0.3)]"
            >
              Start for free →
            </Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────── */}
      <footer className="border-t border-outline-variant/20 px-8 py-10 max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">terminal</span>
          <span className="font-black tracking-tighter">FreelanceCLI</span>
        </div>
        <p className="text-xs text-on-surface-variant text-center">© {new Date().getFullYear()} FreelanceCLI. Built with ♥ for developers.</p>
        <div className="flex items-center gap-4 text-xs text-on-surface-variant">
          <Link to="/login" className="hover:text-on-surface transition-colors">Log in</Link>
          <Link to="/setup-guide" className="hover:text-on-surface transition-colors">Get started</Link>
        </div>
      </footer>
    </main>
  )
}
