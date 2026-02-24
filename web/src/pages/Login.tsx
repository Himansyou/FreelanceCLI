import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth'
import { login as apiLogin } from '../api'
import AuthShell from '../layout/AuthShell'
import Button from '../ui/Button'
import Input from '../ui/Input'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const data = await apiLogin(email, password)
      login(data.accessToken, data.userId)
      navigate('/')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Log in to view sessions and reports."
      footer={
        <p className="muted">
          New here? <Link to="/register">Create an account</Link>
        </p>
      }
    >
      <form className="stack" onSubmit={handleSubmit}>
        <Input
          label="Email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Input
          label="Password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          error={error || undefined}
        />
        <div className="row row--end">
          <Button type="submit" disabled={loading}>
            {loading ? 'Logging in…' : 'Log in'}
          </Button>
        </div>
      </form>
    </AuthShell>
  )
}
