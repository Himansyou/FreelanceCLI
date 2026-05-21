const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080'

async function readApiError(res: Response, fallback: string) {
  const err = await res.json().catch(() => ({}))
  return (err as { error?: string }).error || fallback
}

export async function register(email: string, username: string, password: string) {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, username, password }),
  })
  if (!res.ok) {
    throw new Error(await readApiError(res, 'Registration failed'))
  }
  return res.json()
}

export async function initiateRegistration(email: string, username: string, password: string) {
  const res = await fetch(`${API_BASE}/auth/register/initiate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, username, password }),
  })
  if (!res.ok) {
    throw new Error(await readApiError(res, 'Failed to send OTP'))
  }
  // No response body expected
  return null
}

export async function verifyRegistration(email: string, otp: string) {
  const res = await fetch(`${API_BASE}/auth/register/verify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, otp }),
  })
  if (!res.ok) {
    throw new Error(await readApiError(res, 'OTP verification failed'))
  }
  return res.json()
}

export async function verifyRegistrationToken(token: string) {
  const res = await fetch(`${API_BASE}/auth/register/verify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token }),
  })
  if (!res.ok) {
    throw new Error(await readApiError(res, 'Email verification failed'))
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
  username: string
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
  if (res.status === 404) return [] // No projects yet
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

export type ProjectDetail = {
  projectId: string
  projectName: string
  projectStart: string
  projectEnd: string
  totalMinutes: number
  sessionCount: number
  totalEarnings: number
  hourlyRate: number
  weeklySummaries: WeeklySummary[]
  sessions: SessionDetail[]
}

export type WeeklySummary = {
  weekStart: string
  weekEnd: string
  totalMinutes: number
  sessionCount: number
  earnings: number
}

export type SessionDetail = {
  sessionId: string
  startTime: string
  endTime: string
  durationMinutes: number
  earnings: number
  deviceId: string
}

export async function getProjectDetail(token: string, projectId: string): Promise<ProjectDetail> {
  const res = await fetch(`${API_BASE}/reports/project-detail?projectId=${encodeURIComponent(projectId)}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!res.ok) throw new Error('Failed to load project detail')
  return res.json()
}
