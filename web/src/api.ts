const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080'

async function readApiError(res: Response, fallback: string) {
  const err = await res.json().catch(() => ({}))
  return (err as { error?: string }).error || fallback
}

export async function register(email: string, password: string) {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
  if (!res.ok) {
    throw new Error(await readApiError(res, 'Registration failed'))
  }
  return res.json()
}

export async function login(email: string, password: string) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
  if (!res.ok) {
    throw new Error(await readApiError(res, 'Login failed'))
  }
  return res.json()
}

export type AuthProfile = {
  id: string
  email: string
  createdAt: string
  defaultHourlyRate?: number
}

export async function getMyProfile(token: string): Promise<AuthProfile> {
  const res = await fetch(`${API_BASE}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!res.ok) throw new Error('Failed to load profile')
  return res.json()
}

export async function getSessions(token: string, params?: { projectId?: string; from?: string; to?: string }) {
  const q = new URLSearchParams()
  if (params?.projectId) q.set('projectId', params.projectId)
  if (params?.from) q.set('from', params.from)
  if (params?.to) q.set('to', params.to)
  const url = `${API_BASE}/tracking/sessions${q.toString() ? '?' + q : ''}`
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!res.ok) throw new Error('Failed to load sessions')
  return res.json()
}

export async function getReportSummary(token: string, params?: { projectId?: string; from?: string; to?: string }) {
  const q = new URLSearchParams()
  if (params?.projectId) q.set('projectId', params.projectId)
  if (params?.from) q.set('from', params.from)
  if (params?.to) q.set('to', params.to)
  const url = `${API_BASE}/reports/summary${q.toString() ? '?' + q : ''}`
  console.log('[getReportSummary] Fetching:', url)
  console.log('[getReportSummary] JWT token:', token)
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!res.ok) throw new Error('Failed to load report')
  return res.json()
}

export type ProjectRate = {
  projectId: string
  hourlyRate: number
  createdAt: string
  updatedAt: string
}

export async function getProjectRates(token: string): Promise<ProjectRate[]> {
  const res = await fetch(`${API_BASE}/project-settings`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!res.ok) throw new Error('Failed to load project rates')
  return res.json()
}

export async function getProjectRate(token: string, projectId: string): Promise<ProjectRate | null> {
  const res = await fetch(`${API_BASE}/project-settings/${encodeURIComponent(projectId)}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (res.status === 404) return null
  if (!res.ok) throw new Error('Failed to load project rate')
  return res.json()
}

export async function setProjectRate(token: string, projectId: string, hourlyRate: number): Promise<ProjectRate> {
  const res = await fetch(`${API_BASE}/project-settings`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ projectId, hourlyRate }),
  })
  if (!res.ok) throw new Error('Failed to set project rate')
  return res.json()
}

export async function deleteProjectRate(token: string, projectId: string): Promise<void> {
  const res = await fetch(`${API_BASE}/project-settings/${encodeURIComponent(projectId)}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!res.ok) throw new Error('Failed to delete project rate')
}

export async function updateDefaultRate(token: string, hourlyRate: number): Promise<AuthProfile> {
  const res = await fetch(`${API_BASE}/auth/me/default-rate`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ hourlyRate }),
  })
  if (!res.ok) throw new Error('Failed to update default rate')
  return res.json()
}
