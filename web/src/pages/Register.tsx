import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth'
import { login as apiLogin, register as apiRegister } from '../api'
import AuthShell from '../layout/AuthShell'
import Button from '../ui/Button'
import Input from '../ui/Input'

export default function Register() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const { login } = useAuth()
  const navigate = useNavigate()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (password !== confirm) {
      setError('Passwords do not match')
      return
    }
    setLoading(true)
    try {
      await apiRegister(email, password)
      const data = await apiLogin(email, password)
      login(data.accessToken, data.userId)
      navigate('/dashboard')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthShell
      title="Create your account"
      subtitle="Register once, then use the CLI or web to log in."
      footer={
        <p className="muted">
          Already have an account? <Link to="/login">Log in</Link>
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
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Input
          label="Confirm password"
          type="password"
          autoComplete="new-password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          required
          error={error || undefined}
        />

        <div className="row row--end">
          <Button type="submit" disabled={loading}>
            {loading ? 'Creating…' : 'Create account'}
          </Button>
        </div>
      </form>
    </AuthShell>
  )
}

