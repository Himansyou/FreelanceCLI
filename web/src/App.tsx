import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './auth'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Sessions from './pages/Sessions'
import Report from './pages/Report'

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { token } = useAuth()
  if (!token) return <Navigate to="/login" replace />
  return <>{children}</>
}

function PublicOnlyRoute({ children }: { children: React.ReactNode }) {
  const { token } = useAuth()
  if (token) return <Navigate to="/" replace />
  return <>{children}</>
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<PublicOnlyRoute><Login /></PublicOnlyRoute>} />
        <Route path="/register" element={<PublicOnlyRoute><Register /></PublicOnlyRoute>} />
        <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/sessions" element={<PrivateRoute><Sessions /></PrivateRoute>} />
        <Route path="/report" element={<PrivateRoute><Report /></PrivateRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
