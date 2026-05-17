import { Link } from 'react-router-dom'

const CLI_DOWNLOAD_URL = 'https://example.com/freelancecli-download'

export default function SetupGuide() {
  return (
    <main className="min-h-screen bg-background text-on-surface">
      <header className="fixed top-0 w-full z-40 bg-black/80 backdrop-blur-xl border-b border-outline-variant/20">
        <nav className="max-w-7xl mx-auto px-8 py-4 flex items-center justify-between">
          <Link to="/" className="text-xl font-black tracking-tighter">
            FreelanceCLI
          </Link>
          <div className="flex items-center gap-3">
            <Link to="/login" className="text-on-surface-variant hover:text-on-surface transition-colors px-3 py-2">
              Log in
            </Link>
            <Link to="/register" className="bg-primary-container text-on-primary px-5 py-2 rounded-xl font-bold">
              Register
            </Link>
          </div>
        </nav>
      </header>

      <section className="pt-32 pb-16 px-6 max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <h1 className="text-5xl md:text-6xl font-black tracking-tighter mb-3">
            Setup <span className="text-primary">Guide</span>
          </h1>
          <p className="text-on-surface-variant text-lg">Get running in a few minutes and start tracking real work sessions.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="md:col-span-7 bg-surface-container rounded-[2rem] p-8">
            <div className="flex items-center gap-3 mb-4">
              <span className="material-symbols-outlined text-primary">download</span>
              <h2 className="text-2xl font-bold">Step 1: Download CLI</h2>
            </div>
            <p className="text-on-surface-variant mb-6">Download and install the FreelanceCLI app for your system.</p>
            <a
              href={CLI_DOWNLOAD_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 bg-primary-container text-on-primary px-5 py-3 rounded-xl font-bold"
            >
              Download FreelanceCLI
              <span className="material-symbols-outlined text-sm">open_in_new</span>
            </a>
            <p className="text-xs text-on-surface-variant mt-3">Temporary link for now - replace with real download URL later.</p>
          </div>

          <div className="md:col-span-5 bg-surface-container-low rounded-[2rem] p-8">
            <div className="flex items-center gap-3 mb-4">
              <span className="material-symbols-outlined text-primary">person_add</span>
              <h2 className="text-2xl font-bold">Step 2: Register</h2>
            </div>
            <p className="text-on-surface-variant mb-6">Create your account once to enable sync and web reports.</p>
            <Link to="/register" className="inline-block bg-white text-black font-bold py-3 px-5 rounded-xl">
              Create account
            </Link>
          </div>

          <div className="md:col-span-6 bg-surface-container rounded-[2rem] p-8">
            <div className="flex items-center gap-3 mb-4">
              <span className="material-symbols-outlined text-primary">key</span>
              <h2 className="text-2xl font-bold">Step 3: Log in from CLI</h2>
            </div>
            <p className="text-on-surface-variant mb-4">Authenticate your terminal so sessions are linked to your account.</p>
            <div className="bg-surface-container-lowest rounded-xl p-4 font-mono text-primary-dim">
              freelance login
            </div>
          </div>

          <div className="md:col-span-6 bg-surface-container-low rounded-[2rem] p-8">
            <div className="flex items-center gap-3 mb-4">
              <span className="material-symbols-outlined text-primary">play_circle</span>
              <h2 className="text-2xl font-bold">Step 4: Track sessions</h2>
            </div>
            <p className="text-on-surface-variant mb-4">Start work, stop when done, then sync your records.</p>
            <div className="bg-surface-container-lowest rounded-xl p-4 font-mono text-sm space-y-2">
              <div><span className="text-primary-dim">$ </span>freelance start my-project</div>
              <div><span className="text-primary-dim">$ </span>freelance stop</div>
              <div><span className="text-primary-dim">$ </span>freelance sync</div>
            </div>
          </div>

          <div className="md:col-span-12 bg-surface-container rounded-[2rem] p-8">
            <div className="flex items-center gap-3 mb-4">
              <span className="material-symbols-outlined text-primary">insights</span>
              <h2 className="text-2xl font-bold">Step 5: View reports</h2>
            </div>
            <p className="text-on-surface-variant mb-4">Generate CLI reports and open the dashboard to review your project breakdown.</p>
            <div className="bg-surface-container-lowest rounded-xl p-4 font-mono text-primary mb-5">freelance report my-project</div>
            <div className="flex flex-wrap gap-3">
              <Link to="/login" className="bg-primary-container text-on-primary px-6 py-3 rounded-xl font-bold">
                Log in to dashboard
              </Link>
              <Link to="/" className="bg-surface-container-high px-6 py-3 rounded-xl font-bold">
                Back to landing
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
