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
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md bg-surface-container rounded-2xl shadow-lg p-8 md:p-10 border border-outline-variant/20">
        <header className="mb-8 flex flex-col items-center">
          <Link to="/" className="flex items-center gap-2 mb-2">
            <span className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-lg" aria-hidden="true">FC</span>
            <span className="text-xl font-black tracking-tighter text-on-surface">FreelanceCLI</span>
          </Link>
        </header>
        <main>
          <section>
            <h1 className="text-2xl font-black text-on-surface mb-2">{title}</h1>
            {subtitle && <p className="text-on-surface-variant text-sm mb-6">{subtitle}</p>}
            {children}
          </section>
          {footer && <div className="mt-8 text-center text-on-surface-variant text-sm">{footer}</div>}
        </main>
      </div>
    </div>
  )
}

