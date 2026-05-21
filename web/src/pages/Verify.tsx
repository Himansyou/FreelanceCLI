import { useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../auth'
import { verifyRegistrationToken } from '../api'

export default function Verify() {
  const [searchParams] = useSearchParams()
  const { login } = useAuth()
  const navigate = useNavigate()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [errorMsg, setErrorMsg] = useState('')

  useEffect(() => {
    const token = searchParams.get('token')
    if (!token) {
      setStatus('error')
      setErrorMsg('Invalid verification link — no token provided.')
      return
    }

    verifyRegistrationToken(token)
      .then((data) => {
        setStatus('success')
        login(data.accessToken, data.userId, '')
        setTimeout(() => navigate('/dashboard'), 1500)
      })
      .catch((err) => {
        setStatus('error')
        setErrorMsg(err instanceof Error ? err.message : 'Verification failed')
      })
  }, [searchParams, login, navigate])

  return (
    <main className="min-h-screen bg-background flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="bg-surface-container rounded-[32px] border border-outline-variant/20 p-8 md:p-10 shadow-[0_0_60px_rgba(0,0,0,0.6)] text-center">
          {status === 'loading' && (
            <>
              <span className="material-symbols-outlined text-5xl text-secondary animate-spin mb-4 block">progress_activity</span>
              <h1 className="text-2xl font-black tracking-tighter text-on-surface mb-2">Verifying your email…</h1>
              <p className="text-on-surface-variant text-sm">Hang tight, we're confirming your account.</p>
            </>
          )}
          {status === 'success' && (
            <>
              <span className="material-symbols-outlined text-5xl text-secondary mb-4 block">check_circle</span>
              <h1 className="text-2xl font-black tracking-tighter text-on-surface mb-2">Email verified!</h1>
              <p className="text-on-surface-variant text-sm">Redirecting to your dashboard…</p>
            </>
          )}
          {status === 'error' && (
            <>
              <span className="material-symbols-outlined text-5xl text-error mb-4 block">error</span>
              <h1 className="text-2xl font-black tracking-tighter text-on-surface mb-2">Verification failed</h1>
              <p className="text-on-surface-variant text-sm mb-6">{errorMsg}</p>
              <div className="space-y-3">
                <Link to="/register" className="block w-full bg-secondary-container text-on-secondary font-black py-3.5 rounded-2xl hover:brightness-110 transition-all text-base">
                  Try registering again
                </Link>
                <Link to="/login" className="block text-sm text-on-surface-variant hover:text-on-surface transition-colors">
                  Already have an account? Log in
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  )
}
