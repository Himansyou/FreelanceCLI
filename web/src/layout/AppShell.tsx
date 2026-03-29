import React from 'react'
import { NavLink } from 'react-router-dom'
import { useAuth } from '../auth'
import Button from '../ui/Button'
import { cx } from '../ui/cx'

function NavItem({
  to,
  icon,
  children,
}: {
  to: string
  icon: string
  children: React.ReactNode
}) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cx('sidenav__link', isActive && 'sidenav__link--active')
      }
    >
      <span className="material-symbols-outlined" aria-hidden="true">
        {icon}
      </span>
      <span className="sidenav__label">{children}</span>
    </NavLink>
  )
}

export default function AppShell({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  const { userId, logout } = useAuth()

  return (
    <div className="shell">
      <aside className="sidenav" aria-label="Sidebar">
        <div className="sidenav__brand">
          <h1 className="sidenav__title">FreelanceCLI</h1>
          <p className="sidenav__version">v1.0.0</p>
        </div>

        <nav className="sidenav__nav" aria-label="Primary">
          <NavItem to="/" icon="dashboard">
            Dashboard
          </NavItem>
          <NavItem to="/sessions" icon="terminal">
            Sessions
          </NavItem>
          <NavItem to="/report" icon="analytics">
            Reports
          </NavItem>
        </nav>

        <div className="sidenav__footer">
          {userId && <div className="sidenav__user mono">{userId.slice(0, 8)}…</div>}
          <Button variant="ghost" size="sm" onClick={logout}>
            Logout
          </Button>
        </div>
      </aside>

      <div>
        <header className="topbar">
          <div className="topbar__inner">
            <h2 className="topbar__title">{title}</h2>
          </div>
        </header>

        <main className="page min-h-screen overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}

