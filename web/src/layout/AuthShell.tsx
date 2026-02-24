import React from 'react'
import { Link } from 'react-router-dom'

export default function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string
  subtitle?: string
  children: React.ReactNode
  footer?: React.ReactNode
}) {
  return (
    <div className="auth">
      <div className="auth__bg" aria-hidden="true" />
      <div className="auth__content">
        <header className="auth__header">
          <Link to="/" className="brand">
            <span className="brand__mark" aria-hidden="true">
              FC
            </span>
            <span className="brand__text">FreelanceCLI</span>
          </Link>
        </header>

        <main className="auth__main">
          <section className="authCard">
            <h1 className="authCard__title">{title}</h1>
            {subtitle && <p className="authCard__subtitle">{subtitle}</p>}
            {children}
          </section>

          {footer && <div className="auth__footer">{footer}</div>}
        </main>
      </div>
    </div>
  )
}

