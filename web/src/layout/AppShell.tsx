import React from 'react'
import { NavLink } from 'react-router-dom'
import { useAuth } from '../auth'
import Button from '../ui/Button'
import { cx } from '../ui/cx'

function NavItem({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) => cx('nav__link', isActive && 'nav__link--active')}
    >
      {children}
    </NavLink>
  )
}

export default function AppShell({
  title,
  actions,
  children,
}: {
  title: string
  actions?: React.ReactNode
  children: React.ReactNode
}) {
  const { userId, logout } = useAuth()

  return (
    <div className="app">
      <header className="topbar">
        <div className="topbar__inner">
          <div className="topbar__left">
            <div className="brand brand--small" aria-label="FreelanceCLI">
              <span className="brand__mark" aria-hidden="true">
                FC
              </span>
              <span className="brand__text">FreelanceCLI</span>
            </div>
            <nav className="nav" aria-label="Primary">
              <NavItem to="/">Dashboard</NavItem>
              <NavItem to="/sessions">Sessions</NavItem>
              <NavItem to="/report">Report</NavItem>
            </nav>
          </div>

          <div className="topbar__right">
            {actions}
            {userId && <span className="chip">{userId.slice(0, 8)}…</span>}
            <Button variant="ghost" size="sm" onClick={logout}>
              Log out
            </Button>
          </div>
        </div>
      </header>

      <main className="container">
        <div className="pageHeader">
          <h1 className="pageHeader__title">{title}</h1>
        </div>
        {children}
      </main>
    </div>
  )
}

