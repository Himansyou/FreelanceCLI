import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../auth'
import { getReportSummary, getProjectRate, setProjectRate } from '../api'

type ProjectSummary = { projectId: string; totalMinutes: number; sessionCount: number; earnings: number }
type Summary = {
  totalMinutes: number
  sessionCount: number
  from: string
  to: string
  totalEarnings: number
  byProject: ProjectSummary[]
}

export default function Dashboard() {
  const { token } = useAuth()
  const [summary, setSummary] = useState<Summary | null>(null)
  const [loading, setLoading] = useState(true)
  const [editingProject, setEditingProject] = useState<string | null>(null)
  const [projectRates, setProjectRates] = useState<Record<string, number>>({})

  const totalHours = summary ? Math.round((summary.totalMinutes / 60) * 10) / 10 : 0
  const totalEarnings = summary ? Math.round(summary.totalEarnings * 100) / 100 : 0

  useEffect(() => {
    if (!token) return
    setLoading(true)
    getReportSummary(token)
      .then((summaryData) => {
        setSummary(summaryData)
        // Fetch rates for all projects
        if (summaryData.byProject) {
          summaryData.byProject.forEach(project => {
            getProjectRate(token, project.projectId)
              .then(rate => {
                if (rate) {
                  setProjectRates(prev => ({ ...prev, [project.projectId]: rate.hourlyRate }))
                }
              })
              .catch(() => {})
          })
        }
      })
      .catch((e) => console.error(e))
      .finally(() => setLoading(false))
  }, [token])

  const handleRateChange = async (projectId: string, newRate: number) => {
    if (!token) return
    try {
      await setProjectRate(token, projectId, newRate)
      setProjectRates(prev => ({ ...prev, [projectId]: newRate }))
      setEditingProject(null)
      // Refresh summary to recalculate earnings
      getReportSummary(token)
        .then(setSummary)
        .catch(console.error)
    } catch (error) {
      console.error('Failed to update rate:', error)
    }
  }

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
            <span className="text-on-surface-variant text-xs font-mono uppercase tracking-widest">Earnings</span>
          </div>
          <div className="mt-8 z-10 relative">
            <h2 className="text-5xl font-black tracking-tighter text-white">
              {loading ? '—' : `$${totalEarnings}`}
            </h2>
            <p className="text-on-surface-variant text-xs mt-2">total this period</p>
          </div>
          <div className="absolute -right-4 -bottom-4 opacity-10">
            <span className="material-symbols-outlined text-[120px]" data-icon="payments">payments</span>
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

        <div className="col-span-12 md:col-span-4 bg-surface-container-high p-8 rounded-3xl flex flex-col justify-between group transition-transform hover:scale-[1.02]">
          <div className="flex flex-col gap-4">
            <div>
              <span className="text-on-surface-variant/70 text-xs font-mono uppercase tracking-widest">Settings</span>
              <h2 className="text-4xl font-black tracking-tighter text-white mt-2">Rates</h2>
            </div>
            <Link to="/settings">
              <button className="w-full mt-6 py-3 border border-outline-variant/30 rounded-2xl text-xs font-bold uppercase tracking-widest hover:bg-surface-variant transition-colors">
                Manage Rates
              </button>
            </Link>
          </div>
        </div>

        <div className="col-span-12 md:col-span-4 bg-tertiary-container p-8 rounded-3xl flex flex-col justify-between group transition-transform hover:scale-[1.02]">
          <div className="flex flex-col gap-4">
            <div>
              <span className="text-on-tertiary-container/70 text-xs font-mono uppercase tracking-widest">Analytics</span>
              <h2 className="text-4xl font-black tracking-tighter text-on-tertiary-container mt-2">Reports</h2>
            </div>
            <Link to="/reports">
              <button className="w-full mt-6 py-3 border border-outline-variant/30 rounded-2xl text-xs font-bold uppercase tracking-widest hover:bg-surface-variant transition-colors">
                View Reports
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Project Rates Section */}
      {summary?.byProject && summary.byProject.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-xl font-bold">Project Rates</h3>
          </div>
          <div className="space-y-3">
            {summary.byProject.map((project) => {
              const currentRate = projectRates[project.projectId]
              const projectHours = (project.totalMinutes / 60).toFixed(1)
              const projectEarnings = project.earnings.toFixed(2)

              return (
                <div key={project.projectId} className="group flex items-center gap-6 bg-surface-container-low hover:bg-surface-container rounded-2xl p-5 transition-all border-none shadow-[0_0_10px_rgba(0,0,0,0.1)]">
                  <div className="w-12 h-12 bg-surface-container-high rounded-xl flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                    <span className="material-symbols-outlined text-primary" data-icon="folder">folder</span>
                  </div>
                  <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4 items-center">
                    <div>
                      <p className="text-sm font-bold truncate max-w-[200px]" title={project.projectId}>{project.projectId}</p>
                      <p className="text-[11px] text-on-surface-variant uppercase tracking-wider font-mono">Project ID</p>
                    </div>

                    <div className="text-center">
                      <p className="text-sm font-medium">{projectHours}h</p>
                      <p className="text-[11px] text-on-surface-variant font-mono">{project.sessionCount} sessions</p>
                    </div>

                    <div className="text-center">
                      <p className="text-sm font-medium">${projectEarnings}</p>
                      <p className="text-[11px] text-on-surface-variant font-mono">earned</p>
                    </div>

                    <div className="text-right">
                      {editingProject === project.projectId ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            defaultValue={currentRate || ''}
                            placeholder="Rate"
                            className="w-20 bg-surface-container-highest border-none rounded-lg text-sm px-2 py-1 text-on-surface focus:ring-1 focus:ring-primary/50 outline-none"
                            autoFocus
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                const input = e.target as HTMLInputElement
                                const rate = parseFloat(input.value)
                                if (rate > 0) {
                                  handleRateChange(project.projectId, rate)
                                }
                              } else if (e.key === 'Escape') {
                                setEditingProject(null)
                              }
                            }}
                          />
                          <button
                            onClick={() => setEditingProject(null)}
                            className="text-on-surface-variant hover:text-white transition-colors"
                          >
                            <span className="material-symbols-outlined text-sm" data-icon="close">close</span>
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setEditingProject(project.projectId)}
                          className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                        >
                          {currentRate ? `$${currentRate}/hr` : 'Set Rate'}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </section>
      )}
    </div>
  )
}
