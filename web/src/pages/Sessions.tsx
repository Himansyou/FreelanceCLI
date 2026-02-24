import { useState, useEffect } from 'react'
import { useAuth } from '../auth'
import { getSessions } from '../api'
import AppShell from '../layout/AppShell'
import Input from '../ui/Input'
import Card from '../ui/Card'

type Session = {
  id: string
  projectId: string
  startTime: string
  endTime: string
  durationMinutes: number
  createdAt: string
}

export default function Sessions() {
  const { token } = useAuth()
  const [sessions, setSessions] = useState<Session[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [projectFilter, setProjectFilter] = useState('')

  useEffect(() => {
    if (!token) return
    getSessions(token, projectFilter ? { projectId: projectFilter } : undefined)
      .then((data) => setSessions(data.sessions || []))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [token, projectFilter])

  return (
    <AppShell title="Sessions">
      <div className="row row--between row--wrap">
        <div style={{ minWidth: 260, maxWidth: 420, width: '100%' }}>
          <Input
            label="Project filter"
            placeholder="e.g. website-redesign"
            value={projectFilter}
            onChange={(e) => setProjectFilter(e.target.value)}
          />
        </div>
      </div>

      {error && <p className="alert alert--error">{error}</p>}

      <Card className="tableCard">
        {loading ? (
          <p className="muted">Loading…</p>
        ) : (
          <>
            <div className="tableWrap">
              <table className="table">
                <thead>
                  <tr>
                    <th>Project</th>
                    <th>Start</th>
                    <th>End</th>
                    <th style={{ textAlign: 'right' }}>Duration</th>
                  </tr>
                </thead>
                <tbody>
                  {sessions.map((s) => (
                    <tr key={s.id}>
                      <td>
                        <span className="chip chip--subtle">{s.projectId}</span>
                      </td>
                      <td>{new Date(s.startTime).toLocaleString()}</td>
                      <td>{new Date(s.endTime).toLocaleString()}</td>
                      <td style={{ textAlign: 'right' }}>{s.durationMinutes} min</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {sessions.length === 0 && <p className="muted">No sessions found.</p>}
          </>
        )}
      </Card>
    </AppShell>
  )
}
