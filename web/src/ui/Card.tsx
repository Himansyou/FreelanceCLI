import React from 'react'
import { cx } from './cx'

export default function Card({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cx('card', className)} {...props} />
}

