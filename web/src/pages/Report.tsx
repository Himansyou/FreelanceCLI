import { useState, useEffect } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { useAuth } from '../auth'
import { getReportSummary } from '../api'
import AppShell from '../layout/AppShell'
import Card from '../ui/Card'
import Input from '../ui/Input'

type ProjectSummary = { projectId: string; totalMinutes: number; sessionCount: number }
type Summary = {
  totalMinutes: number
  sessionCount: number
  from: string
  to: string
  byProject: ProjectSummary[]
}

const COLORS = ['#6366f1', '#22c55e', '#f59e0b', '#ec4899', '#14b8a6']

export default function Report() {
  const { token } = useAuth()
  const [summary, setSummary] = useState<Summary | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [projectId, setProjectId] = useState('')

  useEffect(() => {
    if (!token) return
    const params: { from?: string; to?: string; projectId?: string } = {}
    if (from) params.from = from
    if (to) params.to = to
    if (projectId) params.projectId = projectId
    getReportSummary(token, params)
      .then(setSummary)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [token, from, to, projectId])

  return (
    <AppShell title="Report">
      <div className="filters">
        <Input
          label="From"
          type="date"
          value={from}
          onChange={(e) => setFrom(e.target.value)}
        />
        <Input label="To" type="date" value={to} onChange={(e) => setTo(e.target.value)} />
        <Input
          label="Project"
          placeholder="optional"
          value={projectId}
          onChange={(e) => setProjectId(e.target.value)}
        />
      </div>

      {error && <p className="alert alert--error">{error}</p>}

      {loading ? (
        <p className="muted">Loading…</p>
      ) : summary ? (
        <>
          <div className="stats">
            <Card className="stat">
              <div className="stat__label">Total time</div>
              <div className="stat__value">
                {Math.floor(summary.totalMinutes / 60)}h {summary.totalMinutes % 60}m
              </div>
            </Card>
            <Card className="stat">
              <div className="stat__label">Sessions</div>
              <div className="stat__value">{summary.sessionCount}</div>
            </Card>
            <Card className="stat">
              <div className="stat__label">Period</div>
              <div className="stat__value">
                {summary.from} – {summary.to}
              </div>
            </Card>
          </div>

          <Card className="chartCard">
            <div className="chartCard__header">
              <h2 className="h2">By project</h2>
              <p className="muted">Cached for fast repeat views.</p>
            </div>

            {summary.byProject && summary.byProject.length > 0 ? (
              <div style={{ width: '100%', height: 320 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={summary.byProject} margin={{ top: 16, right: 12, left: 12, bottom: 16 }}>
                    <XAxis dataKey="projectId" stroke="var(--muted)" fontSize={12} />
                    <YAxis
                      stroke="var(--muted)"
                      fontSize={12}
                      tickFormatter={(v) => `${v} min`}
                    />
                    <Tooltip
                      contentStyle={{
                        background: 'var(--surface)',
                        border: '1px solid var(--border)',
                        borderRadius: 12,
                        color: 'var(--text)',
                      }}
                      formatter={(v: number) => [`${v} min`, 'Minutes']}
                    />
                    <Bar dataKey="totalMinutes" name="Minutes" radius={[8, 8, 0, 0]}>
                      {summary.byProject.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <p className="muted">No data for this filter.</p>
            )}
          </Card>
        </>
      ) : (
        <p className="muted">No data.</p>
      )}
    </AppShell>
  )
}
