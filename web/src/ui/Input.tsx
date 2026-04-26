import React from 'react'
import { cx } from './cx'

export type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string
  hint?: string
  error?: string
}

export default function Input({ label, hint, error, className, id, ...props }: InputProps) {
  const inputId = id ?? React.useId()
  const hintId = hint ? `${inputId}-hint` : undefined
  const errorId = error ? `${inputId}-error` : undefined
  const describedBy = [hintId, errorId].filter(Boolean).join(' ') || undefined

  return (
    <label className="flex flex-col gap-1 mb-4" htmlFor={inputId}>
      {label && <span className="text-xs font-mono uppercase tracking-wider text-on-surface-variant ml-1">{label}</span>}
      <input
        id={inputId}
        className={cx(
          'w-full bg-surface-container-highest border border-outline-variant/20 rounded-2xl py-3.5 px-4 text-on-surface placeholder:text-on-surface-variant/30 focus:ring-2 focus:ring-primary/25 focus:border-primary/30 transition-all outline-none text-sm',
          error && 'border-error',
          className
        )}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        {...props}
      />
      {hint && !error && (
        <span id={hintId} className="text-xs text-on-surface-variant/60 mt-1 ml-1">
          {hint}
        </span>
      )}
      {error && (
        <span id={errorId} className="text-xs text-error mt-1 ml-1">
          {error}
        </span>
      )}
    </label>
  )
}

