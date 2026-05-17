import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth'
import { login as apiLogin, initiateRegistration, verifyRegistration } from '../api'

export default function Register() {
  const [step, setStep] = useState(1)
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [otp, setOtp] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPass, setShowPass] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const { login } = useAuth()
  const navigate = useNavigate()

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email')
      return
    }
    setError('')
    setStep(2)
  }

  async function handleFinalSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (password !== confirm) {
      setError('Passwords do not match')
      return
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }
    if (username.length < 2) {
      setError('Username must be at least 2 characters')
      return
    }
    setLoading(true)
    try {
      await initiateRegistration(email, username, password)
      setStep(3)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to send OTP')
    } finally {
      setLoading(false)
    }
  }

  async function handleOtpSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP')
      return
    }
    setLoading(true)
    try {
      const data = await verifyRegistration(email, otp)
      login(data.accessToken, data.userId, username)
      navigate('/dashboard')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'OTP verification failed')
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
          <h2 className="text-3xl font-black tracking-tighter text-on-surface mb-2">Join FreelanceCLI</h2>
          <p className="text-on-surface-variant text-sm max-w-xs">Start tracking your freelance work today. Create your account in seconds.</p>
        </div>

        <p className="relative z-10 text-xs text-on-surface-variant/50">
          © {new Date().getFullYear()} FreelanceCLI
        </p>
      </aside>

      {/* ── RIGHT REGISTER PANEL ── */}
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
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary/10 border border-secondary/20 mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
                <span className="text-[10px] font-mono uppercase tracking-widest text-secondary">Step {step} of 3</span>
              </div>
              <h1 className="text-3xl font-black tracking-tighter text-on-surface mb-1">
                {step === 1 ? 'Create account' : step === 2 ? 'Almost there!' : 'Verify your email'}
              </h1>
              <p className="text-on-surface-variant text-sm">
                {step === 1 ? 'Enter your email to get started' : step === 2 ? 'Set up your username and password' : `Enter the 6-digit code sent to ${email}`}
              </p>
            </div>

            {/* Progress indicator */}
            <div className="flex gap-2 mb-6">
              <div className={`flex-1 h-1 rounded-full transition-all ${step >= 1 ? 'bg-secondary' : 'bg-outline-variant/30'}`} />
              <div className={`flex-1 h-1 rounded-full transition-all ${step >= 2 ? 'bg-secondary' : 'bg-outline-variant/30'}`} />
              <div className={`flex-1 h-1 rounded-full transition-all ${step >= 3 ? 'bg-secondary' : 'bg-outline-variant/30'}`} />
            </div>

            {/* form */}
            <form className="space-y-5" onSubmit={step === 1 ? handleEmailSubmit : step === 2 ? handleFinalSubmit : handleOtpSubmit}>
              {error && (
                <div className="flex items-center gap-2 text-error bg-error/10 border border-error/20 p-3 rounded-2xl text-sm">
                  <span className="material-symbols-outlined text-base">error</span>
                  {error}
                </div>
              )}

              {step === 1 ? (
                /* Step 1: Email only */
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono uppercase tracking-[0.12em] text-on-surface-variant ml-1">Email</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-gray-500 text-[18px] pointer-events-none">mail</span>
                    <input
                      className="w-full bg-[#1a1a1a] border border-gray-600 rounded-2xl py-3.5 pl-11 pr-5 text-gray-200 placeholder:!text-[#111] focus:ring-2 focus:ring-primary/25 focus:border-primary/30 transition-all outline-none text-sm"
                      placeholder="Enter your email"
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      disabled={loading}
                      required
                      autoFocus
                    />
                  </div>
                </div>
              ) : step === 2 ? (
                /* Step 2: Username and password */
                <>
                  {/* username */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono uppercase tracking-[0.12em] text-on-surface-variant ml-1">Username</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-gray-500 text-[18px] pointer-events-none">person</span>
                      <input
                        className="w-full bg-[#1a1a1a] border border-gray-600 rounded-2xl py-3.5 pl-11 pr-5 text-gray-200 placeholder:!text-[#111] focus:ring-2 focus:ring-primary/25 focus:border-primary/30 transition-all outline-none text-sm"
                        placeholder="What should we call you?"
                        type="text"
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                        disabled={loading}
                        required
                        autoFocus
                      />
                    </div>
                  </div>

                  {/* password */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono uppercase tracking-[0.12em] text-on-surface-variant ml-1">Password</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-gray-500 text-[18px] pointer-events-none">lock</span>
                      <input
                        className="w-full bg-[#1a1a1a] border border-gray-600 rounded-2xl py-3.5 pl-11 pr-12 text-gray-200 placeholder:!text-[#111] focus:ring-2 focus:ring-primary/25 focus:border-primary/30 transition-all outline-none text-sm"
                        placeholder="Create a password"
                        type={showPass ? 'text' : 'password'}
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        disabled={loading}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPass(v => !v)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-gray-500 hover:text-gray-300 text-[18px] transition-colors"
                        tabIndex={-1}
                      >
                        {showPass ? 'visibility_off' : 'visibility'}
                      </button>
                    </div>
                  </div>

                  {/* confirm password */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono uppercase tracking-[0.12em] text-on-surface-variant ml-1">Confirm Password</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-gray-500 text-[18px] pointer-events-none">lock</span>
                      <input
                        className="w-full bg-[#1a1a1a] border border-gray-600 rounded-2xl py-3.5 pl-11 pr-12 text-gray-200 placeholder:!text-[#111] focus:ring-2 focus:ring-primary/25 focus:border-primary/30 transition-all outline-none text-sm"
                        placeholder="Confirm your password"
                        type={showConfirm ? 'text' : 'password'}
                        value={confirm}
                        onChange={e => setConfirm(e.target.value)}
                        disabled={loading}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirm(v => !v)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-gray-500 hover:text-gray-300 text-[18px] transition-colors"
                        tabIndex={-1}
                      >
                        {showConfirm ? 'visibility_off' : 'visibility'}
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                /* Step 3: OTP verification */
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono uppercase tracking-[0.12em] text-on-surface-variant ml-1">Verification Code</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-gray-500 text-[18px] pointer-events-none">verified</span>
                    <input
                      className="w-full bg-[#1a1a1a] border border-gray-600 rounded-2xl py-3.5 pl-11 pr-5 text-gray-200 placeholder:!text-[#111] focus:ring-2 focus:ring-primary/25 focus:border-primary/30 transition-all outline-none text-sm text-center tracking-[0.5em] font-mono"
                      placeholder="000000"
                      type="text"
                      value={otp}
                      onChange={e => {
                        const value = e.target.value.replace(/\D/g, '').slice(0, 6)
                        setOtp(value)
                      }}
                      disabled={loading}
                      required
                      autoFocus
                      maxLength={6}
                    />
                  </div>
                  <p className="text-xs text-on-surface-variant/60 text-center">
                    Code expires in 20 minutes. Check your spam folder if you don't see it.
                  </p>
                </div>
              )}

              {/* submit */}
              <div className="pt-2">
                <button
                  className="w-full bg-secondary-container text-on-secondary font-black py-4 rounded-2xl hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2 text-base shadow-[0_0_24px_rgba(137,250,170,0.2)] disabled:opacity-60 disabled:cursor-not-allowed"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="material-symbols-outlined text-sm animate-spin">progress_activity</span>
                      {step === 1 ? 'Processing…' : step === 2 ? 'Sending OTP…' : 'Verifying…'}
                    </>
                  ) : (
                    <>
                      {step === 1 ? 'Continue' : step === 2 ? 'Send verification code' : 'Verify & create account'}
                      <span className="material-symbols-outlined text-sm">{step === 1 ? 'arrow_forward' : step === 2 ? 'send' : 'check'}</span>
                    </>
                  )}
                </button>
              </div>

              {/* back button for step 2 and 3 */}
              {step > 1 && (
                <button
                  type="button"
                  onClick={() => setStep(step - 1)}
                  className="w-full text-center text-sm text-on-surface-variant hover:text-on-surface transition-colors"
                  disabled={loading}
                >
                  ← Back
                </button>
              )}
            </form>

            {/* divider */}
            <div className="flex items-center gap-3 my-6">
              <div className="flex-1 h-px bg-outline-variant/30" />
              <span className="text-xs text-on-surface-variant/40 font-mono">or</span>
              <div className="flex-1 h-px bg-outline-variant/30" />
            </div>

            {/* footer links */}
            <div className="text-center text-sm text-on-surface-variant space-y-2">
              <p>Already have an account? <Link className="text-secondary font-semibold hover:underline" to="/login">Log in</Link></p>
              <Link to="/" className="text-xs text-on-surface-variant/50 hover:text-on-surface-variant transition-colors block">← Back to homepage</Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}