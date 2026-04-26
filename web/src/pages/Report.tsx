import { useState, useEffect, useMemo } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { useAuth } from '../auth'
import { getReportSummary } from '../api'

type ProjectSummary = { projectId: string; totalMinutes: number; sessionCount: number }
type Summary = {
  totalMinutes: number
  sessionCount: number
  from: string
  to: string
  byProject: ProjectSummary[]
}

const COLORS = ['#9CFF93', '#7aeb9d', '#00fc40', '#89faaa', '#0eeafd']

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
    if (from && from !== 'null') params.from = from
    if (to && to !== 'null') params.to = to
    if (projectId && projectId !== 'null') params.projectId = projectId

    setLoading(true)
    getReportSummary(token, params)
      .then(setSummary)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [token, from, to, projectId])

  const totalHours = useMemo(() => {
    if (!summary) return 0;
    return (summary.totalMinutes / 60).toFixed(1);
  }, [summary])

  return (
    <div className="flex-1 p-8 space-y-8 overflow-y-auto w-full max-w-7xl mx-auto h-full min-h-0">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-4 border-b border-white/5">
        <div>
          <h2 className="text-4xl font-headline font-black tracking-tighter text-white">Reports</h2>
          <p className="text-on-surface-variant mt-1 font-body">Time breakdown and analytics</p>
        </div>
        
        <div className="flex flex-wrap gap-3 items-center">
          <input 
            type="date" 
            value={from} 
            onChange={(e) => setFrom(e.target.value)} 
            className="bg-surface-container-highest border-none rounded-xl text-sm px-4 py-2 text-on-surface focus:ring-1 focus:ring-primary/50 outline-none"
            title="Start Date"
          />
          <span className="text-on-surface-variant font-bold">-</span>
          <input 
            type="date" 
            value={to} 
            onChange={(e) => setTo(e.target.value)} 
            className="bg-surface-container-highest border-none rounded-xl text-sm px-4 py-2 text-on-surface focus:ring-1 focus:ring-primary/50 outline-none"
            title="End Date"
          />
          <input 
            type="text" 
            placeholder="Filter by Project"
            value={projectId} 
            onChange={(e) => setProjectId(e.target.value)} 
            className="bg-surface-container-highest border-none rounded-xl text-sm px-4 py-2 text-on-surface focus:ring-1 focus:ring-primary/50 outline-none w-32 md:w-48"
          />
           <button className="bg-primary text-on-primary px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 hover:opacity-90 transition-opacity">
               <span className="material-symbols-outlined text-sm" data-icon="download">download</span>
               Export
           </button>
        </div>
      </div>

      {error && <div className="text-error bg-error/10 p-4 rounded-xl font-bold">{error}</div>}

      {/* Bento Grid Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-surface-container-low p-6 rounded-3xl flex flex-col justify-between shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
          <div>
            <span className="text-xs font-label uppercase tracking-widest text-on-surface-variant">Hours</span>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-3xl font-mono font-bold">{loading ? '--' : totalHours}</span>
              <span className="text-primary text-xs font-bold">total</span>
            </div>
          </div>
          <div className="mt-4 h-1.5 w-full bg-surface-container-highest rounded-full overflow-hidden">
            <div className="h-full bg-primary w-full rounded-full animate-pulse shadow-[0_0_10px_rgba(156,255,147,0.5)]"></div>
          </div>
        </div>

        <div className="bg-surface-container-low p-6 rounded-3xl flex flex-col justify-between shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
          <div>
            <span className="text-xs font-label uppercase tracking-widest text-on-surface-variant">Sessions</span>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-3xl font-mono font-bold">{loading ? '--' : summary?.sessionCount || 0}</span>
              <span className="text-secondary text-xs font-bold">recorded</span>
            </div>
          </div>
          <div className="mt-4 h-1.5 w-full bg-surface-container-highest rounded-full overflow-hidden">
            <div className="h-full bg-secondary w-full rounded-full shadow-[0_0_10px_rgba(137,250,170,0.5)]"></div>
          </div>
        </div>

        <div className="bg-surface-container-low p-6 rounded-3xl flex flex-col justify-between shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
          <div>
            <span className="text-xs font-label uppercase tracking-widest text-on-surface-variant">Projects</span>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-3xl font-mono font-bold">{loading ? '--' : summary?.byProject?.length || 0}</span>
              <span className="text-tertiary text-xs font-bold">active</span>
            </div>
          </div>
          <div className="mt-4 h-1.5 w-full bg-surface-container-highest rounded-full overflow-hidden">
            <div className="h-full bg-tertiary w-full rounded-full shadow-[0_0_10px_rgba(14,234,253,0.5)]"></div>
          </div>
        </div>
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Time by Project Chart */}
        <div className="col-span-12 lg:col-span-2 bg-surface-container p-8 rounded-[3rem] relative overflow-hidden group shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h3 className="text-xl font-bold">Project Time Distribution</h3>
              <p className="text-sm text-on-surface-variant">Hours logged per project this period</p>
            </div>
          </div>
          
          <div className="relative h-64 w-full">
            {loading ? (
              <div className="flex items-center justify-center w-full h-full text-on-surface-variant font-mono animate-pulse">Loading Chart Data...</div>
            ) : summary?.byProject?.length ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={summary.byProject} margin={{ top: 16, right: 12, left: -20, bottom: 16 }}>
                  <XAxis dataKey="projectId" stroke="var(--outline)" fontSize={11} tick={{fill: '#ababab'}} axisLine={false} tickLine={false} />
                  <YAxis
                    stroke="var(--outline)"
                    fontSize={11}
                    tickFormatter={(v) => {
                      if (v >= 60) return `${Math.floor(v / 60)}h`
                      return `${Math.floor(v)}m`
                    }}
                    tick={{fill: '#ababab'}} axisLine={false} tickLine={false}
                  />
                  <Tooltip
                    cursor={{fill: 'rgba(255,255,255,0.05)'}}
                    contentStyle={{
                      background: 'rgba(31,31,31,0.9)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: 12,
                      color: '#ffffff',
                      backdropFilter: 'blur(10px)'
                    }}
                    formatter={(v: number) => {
                      const hours = Math.floor(v / 60)
                      const minutes = v % 60
                      if (hours > 0) {
                        return [`${hours}h ${minutes}m`, 'Time Spent']
                      }
                      return [`${minutes}m`, 'Time Spent']
                    }}
                  />
                  <Bar dataKey="totalMinutes" name="Time" radius={[6, 6, 0, 0]} maxBarSize={60}>
                    {summary.byProject.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center w-full h-full text-on-surface-variant font-mono">No data for this filter.</div>
            )}
          </div>
        </div>

        {/* Project Matrix Mini-Card */}
        <div className="col-span-12 lg:col-span-1 bg-surface-container-high p-8 rounded-[3rem] flex flex-col shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
          <h3 className="text-xl font-bold mb-1">Distribution</h3>
          <p className="text-sm text-on-surface-variant mb-8">Time by project</p>
          
          <div className="flex-1 space-y-6 overflow-y-auto">
            {summary?.byProject?.map((p, i) => {
              const perc = summary.totalMinutes ? ((p.totalMinutes / summary.totalMinutes) * 100).toFixed(0) : 0;
              const col = COLORS[i % COLORS.length];

              return (
                <div className="space-y-2" key={p.projectId}>
                  <div className="flex justify-between text-xs uppercase tracking-tighter">
                    <span className="text-on-surface font-bold truncate max-w-[150px]">{p.projectId}</span>
                    <span className="text-on-surface-variant">{perc}%</span>
                  </div>
                  <div className="h-2 w-full bg-surface-variant rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${perc}%`, backgroundColor: col, boxShadow: `0 0 12px ${col}40` }}></div>
                  </div>
                </div>
              )
            })}
            
            {(!summary?.byProject || summary.byProject.length === 0) && !loading && (
              <p className="text-on-surface-variant text-sm py-4">No project data found.</p>
            )}
          </div>
        </div>
      </div>

       {/* Background Accents (Subtle Glows) */}
       <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none -z-10"></div>
       <div className="fixed bottom-0 left-64 w-[300px] h-[300px] bg-secondary/5 rounded-full blur-[100px] pointer-events-none -z-10"></div>
    </div>
  )
}
