import { useState, useEffect, useMemo } from 'react'
import { useAuth } from '../auth'
import { useSearchParams } from 'react-router-dom'
import { getSessions } from '../api'

type Session = {
  id: string
  projectId: string
  startTime: string
  endTime: string | null
  durationMinutes: number
  syncedAt: string
}

export default function Sessions() {
  const { token } = useAuth()
  const [searchParams] = useSearchParams()
  const searchQuery = searchParams.get('search') || ''
  const [sessions, setSessions] = useState<Session[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!token) return
    getSessions(token)
      .then((data) => setSessions(data.sessions || []))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [token])

  const filteredSessions = useMemo(() => {
    if (!searchQuery) return sessions
    const query = searchQuery.toLowerCase()
    return sessions.filter(session =>
      session.projectId.toLowerCase().includes(query) ||
      session.id.toLowerCase().includes(query)
    )
  }, [sessions, searchQuery])

  const sortedSessions = useMemo(() => {
    return [...filteredSessions].sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime())
  }, [filteredSessions])

  const totalBillable = sortedSessions.reduce((acc, s) => acc + (s.durationMinutes || 0), 0) / 60
  const totalRounded = Math.round(totalBillable * 100) / 100

  return (
    <div className="max-w-6xl mx-auto space-y-8 p-8 w-full h-full min-h-0 overflow-y-auto">
      {/* Hero Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-4xl font-extrabold tracking-tight text-white mb-2">Sessions</h2>
          <p className="text-on-surface-variant font-mono text-sm">
            {searchQuery ? `Found ${sortedSessions.length} results for "${searchQuery}"` : `${sessions.length} sessions • ${totalRounded}h total`}
          </p>
        </div>
      </div>

      {error && <div className="text-error bg-error/10 p-4 rounded-xl font-bold">{error}</div>}

      {/* Stats Summary Card */}
      <div className="bg-surface-container rounded-3xl p-8 flex flex-col justify-between border-none shadow-lg">
        <div>
          <h4 className="text-lg font-bold mb-6">Summary</h4>
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <span className="text-on-surface-variant text-sm font-mono">Total Time</span>
              <span className="text-xl font-bold text-primary">{totalRounded}h</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-on-surface-variant text-sm font-mono">Sessions</span>
              <span className="text-xl font-bold">{sessions.length}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-on-surface-variant text-sm font-mono">Sync Status</span>
              <span className="text-xl font-bold">{loading ? 'Syncing...' : 'Complete'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Historical Log */}
      <section className="space-y-4">
        <div className="flex items-center justify-between px-2">
          <h3 className="text-xl font-bold">History</h3>
        </div>

        {/* Log Card List */}
        <div className="space-y-3">
          {loading ? (
            <div className="text-center py-8 text-on-surface-variant animate-pulse font-mono">Loading sessions...</div>
          ) : sortedSessions.length === 0 ? (
            <div className="text-center py-8 text-on-surface-variant font-mono">
              {searchQuery ? `No sessions found matching "${searchQuery}"` : 'No work sessions synced yet.'}
            </div>
          ) : (
            sortedSessions.map((s) => {
              const start = new Date(s.startTime)
              const end = s.endTime ? new Date(s.endTime) : null
              const isOngoing = !end
              const durHrs = s.durationMinutes ? (s.durationMinutes / 60).toFixed(2) : '0.00'

              return (
                <div key={s.id} className="group flex items-center gap-6 bg-surface-container-low hover:bg-surface-container rounded-2xl p-5 transition-all cursor-pointer border-none shadow-[0_0_10px_rgba(0,0,0,0.1)]">
                  <div className="w-12 h-12 bg-surface-container-high rounded-xl flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                    <span className="material-symbols-outlined text-primary" data-icon="history">history</span>
                  </div>
                  <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4 items-center">
                    <div>
                      <p className="text-sm font-bold truncate max-w-[200px]" title={s.projectId}>{s.projectId}</p>
                      <p className="text-[11px] text-on-surface-variant uppercase tracking-wider font-mono">Project ID</p>
                    </div>
                    
                    <div className="hidden md:block text-center">
                      <p className="text-sm font-medium">{start.toLocaleDateString()}</p>
                      <p className="text-[11px] text-on-surface-variant font-mono">
                        {start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {end ? end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Ongoing'}
                      </p>
                    </div>

                    <div className="text-right md:text-center">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-tighter ${isOngoing ? 'bg-primary-container text-on-primary-container' : 'bg-surface-variant text-on-surface-variant'}`}>
                        {isOngoing ? 'Live' : 'Synced'}
                      </span>
                    </div>

                    <div className="text-right">
                      <p className="text-lg font-black font-mono tracking-tighter text-white">
                        {isOngoing ? '--' : `${durHrs}h`}
                      </p>
                      <p className="text-[10px] text-on-surface-variant font-mono">
                        {s.durationMinutes} min
                      </p>
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </section>
    </div>
  )
}
