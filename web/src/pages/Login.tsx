import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth'
import { login as apiLogin } from '../api'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPass, setShowPass] = useState(false)

  const { login } = useAuth()
  const navigate = useNavigate()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const data = await apiLogin(email, password)
      login(data.accessToken, data.userId)
      navigate('/dashboard')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-background flex overflow-hidden">
      {/* ── LEFT DECORATIVE PANEL ── */}
      <aside className="hidden lg:flex flex-col w-[45%] bg-surface-container-low border-r border-outline-variant/20 relative overflow-hidden p-12 justify-between">
        {/* glow blobs */}
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-primary/10 blur-[130px] pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full bg-tertiary/10 blur-[100px] pointer-events-none" />

        {/* brand */}
        <div className="relative z-10 flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-2xl">terminal</span>
          <Link to="/" className="text-xl font-black tracking-tighter hover:text-primary transition-colors">FreelanceCLI</Link>
        </div>

        {/* minimal left panel content */}
        <div className="relative z-10 flex flex-col items-start justify-center h-full">
          <h2 className="text-3xl font-black tracking-tighter text-on-surface mb-2">Welcome to FreelanceCLI</h2>
          <p className="text-on-surface-variant text-sm max-w-xs">Track your freelance work with ease. Log in to get started.</p>
        </div>

        <p className="relative z-10 text-xs text-on-surface-variant/50">
          © {new Date().getFullYear()} FreelanceCLI
        </p>
      </aside>

      {/* ── RIGHT LOGIN PANEL ── */}
      <section className="flex-1 flex items-center justify-center px-6 py-12 relative">
        {/* subtle glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-primary/5 blur-[120px] pointer-events-none" />

        <div className="w-full max-w-md relative z-10">
          {/* mobile brand */}
          <div className="lg:hidden flex items-center gap-2 mb-10">
            <span className="material-symbols-outlined text-primary text-2xl">terminal</span>
            <Link to="/" className="text-xl font-black tracking-tighter">FreelanceCLI</Link>
          </div>

          {/* card */}
          <div className="bg-surface-container rounded-[32px] border border-outline-variant/20 p-8 md:p-10 shadow-[0_0_60px_rgba(0,0,0,0.6)]">
            {/* header */}
            <div className="mb-8">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                <span className="text-[10px] font-mono uppercase tracking-widest text-primary">Secure login</span>
              </div>
              <h1 className="text-3xl font-black tracking-tighter text-on-surface mb-1">Welcome back</h1>
              <p className="text-on-surface-variant text-sm">Sign in to your FreelanceCLI dashboard</p>
            </div>

            {/* form */}
            <form className="space-y-5" onSubmit={handleSubmit}>
              {error && (
                <div className="flex items-center gap-2 text-error bg-error/10 border border-error/20 p-3 rounded-2xl text-sm">
                  <span className="material-symbols-outlined text-base">error</span>
                  {error}
                </div>
              )}

              {/* email */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono uppercase tracking-[0.12em] text-on-surface-variant ml-1">Email</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-on-surface-variant/50 text-[18px] pointer-events-none">mail</span>
                  <input
                    className="w-full bg-surface-container-highest border border-outline-variant/20 rounded-2xl py-3.5 pl-11 pr-5 text-on-surface placeholder:text-on-surface-variant/30 focus:ring-2 focus:ring-primary/25 focus:border-primary/30 transition-all outline-none text-sm"
                    placeholder="you@example.com"
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    disabled={loading}
                    required
                  />
                </div>
              </div>

              {/* password */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono uppercase tracking-[0.12em] text-on-surface-variant ml-1">Password</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-on-surface-variant/50 text-[18px] pointer-events-none">lock</span>
                  <input
                    className="w-full bg-surface-container-highest border border-outline-variant/20 rounded-2xl py-3.5 pl-11 pr-12 text-on-surface placeholder:text-on-surface-variant/30 focus:ring-2 focus:ring-primary/25 focus:border-primary/30 transition-all outline-none text-sm"
                    placeholder="••••••••••••"
                    type={showPass ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    disabled={loading}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(v => !v)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-on-surface-variant/50 hover:text-on-surface-variant text-[18px] transition-colors"
                    tabIndex={-1}
                  >
                    {showPass ? 'visibility_off' : 'visibility'}
                  </button>
                </div>
              </div>

              {/* submit */}
              <div className="pt-2">
                <button
                  className="w-full bg-primary-container text-on-primary font-black py-4 rounded-2xl hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2 text-base shadow-[0_0_24px_rgba(156,255,147,0.2)] disabled:opacity-60 disabled:cursor-not-allowed"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="material-symbols-outlined text-sm animate-spin">progress_activity</span>
                      Logging in…
                    </>
                  ) : (
                    <>
                      Log in
                      <span className="material-symbols-outlined text-sm">arrow_forward</span>
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* divider */}
            <div className="flex items-center gap-3 my-6">
              <div className="flex-1 h-px bg-outline-variant/30" />
              <span className="text-xs text-on-surface-variant/40 font-mono">or</span>
              <div className="flex-1 h-px bg-outline-variant/30" />
            </div>

            {/* footer links */}
            <div className="text-center text-sm text-on-surface-variant space-y-2">
              <p>New to FreelanceCLI? <Link className="text-primary font-semibold hover:underline" to="/register">Create account</Link></p>
              <Link to="/" className="text-xs text-on-surface-variant/50 hover:text-on-surface-variant transition-colors block">← Back to homepage</Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
