import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './auth'
import Landing from './pages/Landing'
import SetupGuide from './pages/SetupGuide'
import Login from './pages/Login'
import Register from './pages/Register'
import Verify from './pages/Verify'
import Dashboard from './pages/Dashboard'
import Sessions from './pages/Sessions'
import Report from './pages/Report'
import Profile from './pages/Profile'
import Settings from './pages/Settings'
import DashboardLayout from './layout/DashboardLayout'

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { token } = useAuth()
  if (!token) return <Navigate to="/login" replace />
  return <>{children}</>
}

function PublicOnlyRoute({ children }: { children: React.ReactNode }) {
  const { token } = useAuth()
  if (token) return <Navigate to="/dashboard" replace />
  return <>{children}</>
}

function HomeRoute() {
  const { token } = useAuth()
  return token ? <Navigate to="/dashboard" replace /> : <Landing />
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomeRoute />} />
        <Route path="/setup-guide" element={<SetupGuide />} />
        <Route path="/login" element={<PublicOnlyRoute><Login /></PublicOnlyRoute>} />
        <Route path="/register" element={<PublicOnlyRoute><Register /></PublicOnlyRoute>} />
        <Route path="/verify" element={<PublicOnlyRoute><Verify /></PublicOnlyRoute>} />
        
        <Route path="/dashboard" element={<PrivateRoute><DashboardLayout><Dashboard /></DashboardLayout></PrivateRoute>} />
        <Route path="/sessions" element={<PrivateRoute><DashboardLayout><Sessions /></DashboardLayout></PrivateRoute>} />
        <Route path="/reports" element={<PrivateRoute><DashboardLayout><Report /></DashboardLayout></PrivateRoute>} />
        <Route path="/settings" element={<PrivateRoute><DashboardLayout><Settings /></DashboardLayout></PrivateRoute>} />
        <Route path="/profile" element={<PrivateRoute><DashboardLayout><Profile /></DashboardLayout></PrivateRoute>} />
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
