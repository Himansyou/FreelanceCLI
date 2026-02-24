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
