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
    <label className="field" htmlFor={inputId}>
      {label && <span className="field__label">{label}</span>}
      <input
        id={inputId}
        className={cx('input', error && 'input--error', className)}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        {...props}
      />
      {hint && !error && (
        <span id={hintId} className="field__hint">
          {hint}
        </span>
      )}
      {error && (
        <span id={errorId} className="field__error">
          {error}
        </span>
      )}
    </label>
  )
}

