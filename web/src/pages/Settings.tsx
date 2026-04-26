import { useState, useEffect } from 'react'
import { useAuth } from '../auth'
import { getMyProfile, updateDefaultRate, getProjectRates, setProjectRate, deleteProjectRate } from '../api'

export default function Settings() {
  const { token } = useAuth()
  const [defaultRate, setDefaultRate] = useState<number | null>(null)
  const [projectRates, setProjectRates] = useState<Record<string, number>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!token) return
    loadData()
  }, [token])

  const loadData = async () => {
    try {
      setLoading(true)
      const [profile, rates] = await Promise.all([
        getMyProfile(token),
        getProjectRates(token)
      ])
      setDefaultRate(profile.defaultHourlyRate || null)
      const ratesMap: Record<string, number> = {}
      rates.forEach(rate => {
        ratesMap[rate.projectId] = rate.hourlyRate
      })
      setProjectRates(ratesMap)
    } catch (err) {
      setError('Failed to load settings')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleDefaultRateChange = async (newRate: number) => {
    if (!token) return
    try {
      setSaving(true)
      await updateDefaultRate(token, newRate)
      setDefaultRate(newRate)
    } catch (err) {
      setError('Failed to update default rate')
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  const handleProjectRateChange = async (projectId: string, newRate: number) => {
    if (!token) return
    try {
      setSaving(true)
      await setProjectRate(token, projectId, newRate)
      setProjectRates(prev => ({ ...prev, [projectId]: newRate }))
    } catch (err) {
      setError('Failed to update project rate')
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteProjectRate = async (projectId: string) => {
    if (!token) return
    try {
      setSaving(true)
      await deleteProjectRate(token, projectId)
      setProjectRates(prev => {
        const newRates = { ...prev }
        delete newRates[projectId]
        return newRates
      })
    } catch (err) {
      setError('Failed to delete project rate')
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-8">
        <div className="text-center py-8 text-on-surface-variant animate-pulse font-mono">Loading settings...</div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-8 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-4 border-b border-white/5">
        <div>
          <h2 className="text-4xl font-headline font-black tracking-tighter text-white">Settings</h2>
          <p className="text-on-surface-variant mt-1 font-body">Manage your hourly rates and billing preferences</p>
        </div>
      </div>

      {error && <div className="text-error bg-error/10 p-4 rounded-xl font-bold">{error}</div>}

      {/* Default Rate Section */}
      <section className="bg-surface-container p-8 rounded-3xl space-y-6">
        <div>
          <h3 className="text-xl font-bold mb-2">Default Hourly Rate</h3>
          <p className="text-sm text-on-surface-variant">This rate will be used for projects without specific rates</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex-1">
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant font-bold">$</span>
              <input
                type="number"
                step="0.01"
                min="0"
                value={defaultRate || ''}
                onChange={(e) => setDefaultRate(parseFloat(e.target.value) || null)}
                placeholder="Enter default rate"
                className="w-full bg-surface-container-highest border-none rounded-xl text-lg px-10 py-3 text-on-surface focus:ring-1 focus:ring-primary/50 outline-none"
              />
            </div>
          </div>
          <button
            onClick={() => defaultRate && handleDefaultRateChange(defaultRate)}
            disabled={saving || !defaultRate}
            className="px-6 py-3 bg-primary text-on-primary rounded-xl font-bold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </section>

      {/* Project Rates Section */}
      <section className="bg-surface-container p-8 rounded-3xl space-y-6">
        <div>
          <h3 className="text-xl font-bold mb-2">Project Rates</h3>
          <p className="text-sm text-on-surface-variant">Set specific hourly rates for individual projects</p>
        </div>

        <div className="space-y-4">
          {Object.entries(projectRates).length === 0 ? (
            <div className="text-center py-8 text-on-surface-variant font-mono">
              No project rates set yet. Add a project rate above.
            </div>
          ) : (
            Object.entries(projectRates).map(([projectId, rate]) => (
              <div key={projectId} className="flex items-center gap-4 bg-surface-container-low p-4 rounded-xl">
                <div className="flex-1">
                  <p className="font-bold truncate">{projectId}</p>
                  <p className="text-sm text-on-surface-variant">${rate}/hr</p>
                </div>
                <button
                  onClick={() => handleDeleteProjectRate(projectId)}
                  disabled={saving}
                  className="p-2 text-error hover:bg-error/10 rounded-lg transition-colors disabled:opacity-50"
                  title="Remove rate"
                >
                  <span className="material-symbols-outlined" data-icon="delete">delete</span>
                </button>
              </div>
            ))
          )}
        </div>

        {/* Add New Project Rate */}
        <div className="border-t border-white/10 pt-6">
          <AddProjectRateForm
            onAdd={(projectId, rate) => handleProjectRateChange(projectId, rate)}
            existingProjects={Object.keys(projectRates)}
            disabled={saving}
          />
        </div>
      </section>
    </div>
  )
}

function AddProjectRateForm({
  onAdd,
  existingProjects,
  disabled
}: {
  onAdd: (projectId: string, rate: number) => void
  existingProjects: string[]
  disabled: boolean
}) {
  const [projectId, setProjectId] = useState('')
  const [rate, setRate] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (projectId && rate && parseFloat(rate) > 0) {
      onAdd(projectId, parseFloat(rate))
      setProjectId('')
      setRate('')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-4">
      <div className="flex-1">
        <input
          type="text"
          value={projectId}
          onChange={(e) => setProjectId(e.target.value)}
          placeholder="Project ID"
          className="w-full bg-surface-container-highest border-none rounded-xl text-sm px-4 py-3 text-on-surface focus:ring-1 focus:ring-primary/50 outline-none"
        />
      </div>
      <div className="w-32">
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant font-bold text-sm">$</span>
          <input
            type="number"
            step="0.01"
            min="0"
            value={rate}
            onChange={(e) => setRate(e.target.value)}
            placeholder="Rate"
            className="w-full bg-surface-container-highest border-none rounded-xl text-sm px-8 py-3 text-on-surface focus:ring-1 focus:ring-primary/50 outline-none"
          />
        </div>
      </div>
      <button
        type="submit"
        disabled={disabled || !projectId || !rate || parseFloat(rate) <= 0}
        className="px-4 py-3 bg-secondary text-on-secondary rounded-xl font-bold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Add
      </button>
    </form>
  )
}