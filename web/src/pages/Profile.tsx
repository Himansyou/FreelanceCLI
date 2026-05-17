import { useEffect, useState } from 'react'
import { useAuth } from '../auth'
import { getMyProfile } from '../api'

type ProfileData = {
  id: string
  email: string
  createdAt: string
}

export default function Profile() {
  const { token, userId } = useAuth()
  const [profile, setProfile] = useState<ProfileData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!token) return
    setLoading(true)
    setError('')
    getMyProfile(token)
      .then(setProfile)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [token])

  return (
    <div className="max-w-6xl mx-auto space-y-8 p-8 w-full h-full min-h-0 overflow-y-auto">
      <div>
        <h2 className="text-4xl font-extrabold tracking-tight text-white mb-2">Profile</h2>
        <p className="text-on-surface-variant text-sm">Your account details.</p>
      </div>

      {error && <div className="text-error bg-error/10 p-4 rounded-xl font-bold">{error}</div>}

      <section className="grid grid-cols-1 gap-6">
        <div className="bg-surface-container rounded-3xl p-6">
          <h3 className="text-xl font-bold mb-4">Account</h3>
          <div className="space-y-4 text-sm">
            <div className="bg-surface-container-low rounded-2xl p-4">
              <div className="text-on-surface-variant text-xs uppercase tracking-widest mb-1">Email</div>
              <div>{loading ? 'Loading...' : profile?.email || '-'}</div>
            </div>
            <div className="bg-surface-container-low rounded-2xl p-4">
              <div className="text-on-surface-variant text-xs uppercase tracking-widest mb-1">User ID</div>
              <div className="font-mono break-all">{loading ? 'Loading...' : profile?.id || userId || '-'}</div>
            </div>
            <div className="bg-surface-container-low rounded-2xl p-4">
              <div className="text-on-surface-variant text-xs uppercase tracking-widest mb-1">Member since</div>
              <div>{loading || !profile ? '-' : new Date(profile.createdAt).toLocaleDateString()}</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
