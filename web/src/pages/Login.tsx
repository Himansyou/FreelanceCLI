import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../auth'
import { login as apiLogin } from '../api'

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
    <main className="w-full h-screen flex items-center justify-center p-8 relative overflow-hidden bg-background">
      {/* Decorative Background Element */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] pointer-events-none"></div>
      
      <div className="w-full max-w-md relative z-10">
        <div className="bg-surface-container-low rounded-3xl p-10 border-none shadow-2xl obsidian-glass">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-surface-container-highest rounded-2xl mb-6">
              <span className="material-symbols-outlined text-primary text-4xl" data-icon="terminal" data-weight="fill" style={{ fontVariationSettings: "'FILL' 1" }}>terminal</span>
            </div>
            <h2 className="text-3xl font-extrabold tracking-tighter text-on-surface mb-2 font-headline">Welcome Back</h2>
            <p className="text-on-surface-variant text-sm font-body">Authenticate to resume your session.</p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && <div className="text-error bg-error/10 p-3 rounded-xl text-center text-sm font-bold">{error}</div>}
            
            <div className="space-y-2">
              <label className="text-[10px] font-mono uppercase tracking-[0.1em] text-on-surface-variant ml-1">Terminal ID</label>
              <div className="relative">
                <input 
                  className="w-full bg-surface-container-highest border-none rounded-2xl py-4 px-5 text-on-surface placeholder:text-on-surface-variant/30 focus:ring-2 focus:ring-primary/20 transition-all font-mono outline-none" 
                  placeholder="username@freelance-cli" 
                  type="text"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-mono uppercase tracking-[0.1em] text-on-surface-variant ml-1">Access Key</label>
              <div className="relative">
                <input 
                  className="w-full bg-surface-container-highest border-none rounded-2xl py-4 px-5 text-on-surface placeholder:text-on-surface-variant/30 focus:ring-2 focus:ring-primary/20 transition-all font-mono outline-none" 
                  placeholder="••••••••••••" 
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>
            <div className="pt-2">
              <button 
                className="w-full bg-primary-container text-on-primary-container font-black py-4 rounded-3xl hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2 text-base shadow-[0_0_20px_rgba(156,255,147,0.2)]" 
                type="submit"
                disabled={loading}
              >
                <span className="material-symbols-outlined" data-icon="login">login</span>
                {loading ? 'Executing...' : 'Execute Login'}
              </button>
            </div>
          </form>

          <div className="mt-8 flex items-center gap-4">
            <div className="h-[1px] flex-1 bg-outline-variant/30"></div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-on-surface-variant/50">OR</span>
            <div className="h-[1px] flex-1 bg-outline-variant/30"></div>
          </div>

          <div className="mt-8 text-center">
            <span className="text-xs font-medium text-on-surface-variant hover:text-primary transition-colors cursor-pointer">Request new access key</span>
          </div>
        </div>

        <div className="mt-8 flex justify-between items-center px-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
            <span className="text-[10px] font-mono text-on-surface-variant uppercase tracking-widest">System Online</span>
          </div>
          <div className="text-[10px] font-mono text-on-surface-variant uppercase tracking-widest">
            Node: US-EAST-01
          </div>
        </div>
      </div>

      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-primary/5 blur-[150px] rounded-full"></div>
        <div className="absolute bottom-0 left-0 w-1/4 h-1/4 bg-primary/5 blur-[120px] rounded-full"></div>
      </div>
    </main>
  )
}
