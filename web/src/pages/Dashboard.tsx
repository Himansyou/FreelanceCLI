import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
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

export default function Dashboard() {
  const { token } = useAuth()
  const [summary, setSummary] = useState<Summary | null>(null)
  const [loading, setLoading] = useState(true)

  const totalHours = summary ? Math.round((summary.totalMinutes / 60) * 10) / 10 : 0

  useEffect(() => {
    if (!token) return
    setLoading(true)
    getReportSummary(token)
      .then((summaryData) => {
        setSummary(summaryData)
      })
      .catch((e) => console.error(e))
      .finally(() => setLoading(false))
  }, [token])

  return (
    <div className="p-8 space-y-8">
      <section className="grid grid-cols-12 gap-6">
        <div className="col-span-12 md:col-span-4 bg-surface-container-low p-8 rounded-3xl flex flex-col justify-between border border-white/5 shadow-[0_0_20px_rgba(156,255,147,0.1)]">
          <div className="flex justify-between items-start">
            <span className="text-on-surface-variant text-xs font-mono uppercase tracking-widest">Total Hours</span>
            <span className="material-symbols-outlined text-primary" data-icon="schedule">schedule</span>
          </div>
          <div className="mt-8">
            <h2 className="text-5xl font-black tracking-tighter text-white">
              {loading ? '—' : totalHours}<span className="text-primary text-2xl ml-1">h</span>
            </h2>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-primary text-xs font-bold">{summary?.sessionCount || 0}</span>
              <span className="text-on-surface-variant text-[10px] uppercase tracking-wider">work sessions</span>
            </div>
          </div>
        </div>

        <div className="col-span-12 md:col-span-4 bg-surface-container p-8 rounded-3xl border border-white/5 relative overflow-hidden">
          <div className="flex justify-between items-start z-10 relative">
            <span className="text-on-surface-variant text-xs font-mono uppercase tracking-widest">Projects</span>
          </div>
          <div className="mt-8 z-10 relative">
            <h2 className="text-5xl font-black tracking-tighter text-white">
              {loading ? '—' : (summary?.byProject?.length || 0).toString().padStart(2, '0')}
            </h2>
            <p className="text-on-surface-variant text-xs mt-2">active this period</p>
          </div>
          <div className="absolute -right-4 -bottom-4 opacity-10">
            <span className="material-symbols-outlined text-[120px]" data-icon="hub">hub</span>
          </div>
        </div>

        <div className="col-span-12 md:col-span-4 bg-primary-container p-8 rounded-3xl flex flex-col justify-between group transition-transform hover:scale-[1.02]">
          <div className="flex flex-col gap-4">
            <div>
              <span className="text-on-primary-container/70 text-xs font-mono uppercase tracking-widest">Activity</span>
              <h2 className="text-4xl font-black tracking-tighter text-on-primary-container mt-2">Timeline</h2>
            </div>
            <Link to="/sessions">
              <button className="w-full mt-6 py-3 border border-outline-variant/30 rounded-2xl text-xs font-bold uppercase tracking-widest hover:bg-surface-variant transition-colors">
                View Sessions
              </button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
