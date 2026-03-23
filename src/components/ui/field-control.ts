import type * as React from 'react'

type CSSVariableValue = string | number | undefined

export type CSSVariableStyle = React.CSSProperties &
  Record<`--${string}`, CSSVariableValue>

export function createFieldStyle(style?: React.CSSProperties): CSSVariableStyle {
  return {
    '--field-height': 'var(--field-height)',
    '--field-radius': 'var(--card-inner-radius, var(--radius-field))',
    ...style,
  }
}

export const fieldControlClassName = [
  'w-full rounded-[var(--field-radius)] border border-[var(--border-subtle)]',
  'bg-[linear-gradient(180deg,var(--surface-elevated),var(--surface-overlay))]',
  'text-sm text-[var(--foreground)] shadow-[var(--shadow-field)] backdrop-blur-xl',
  'transition-[background-color,border-color,box-shadow,transform,color] duration-300 ease-[var(--motion-snappy)]',
  'hover:border-[var(--border-strong)]',
  'hover:bg-[linear-gradient(180deg,var(--surface-strong),var(--surface-elevated))]',
  'focus-visible:outline-none focus-visible:border-[var(--border-accent-strong)]',
  'focus-visible:bg-[linear-gradient(180deg,var(--surface-strong),var(--surface-elevated))]',
  'focus-visible:shadow-[var(--shadow-field-focus)]',
  'disabled:cursor-not-allowed disabled:border-[var(--border-subtle)]',
  'disabled:bg-[linear-gradient(180deg,var(--surface-overlay),var(--surface-overlay))]',
  'disabled:text-[var(--foreground-subtle)] disabled:shadow-none disabled:opacity-100',
  'aria-invalid:border-[var(--danger-border)]',
  'aria-invalid:bg-[linear-gradient(180deg,var(--surface-strong),var(--surface-overlay))]',
  'aria-invalid:shadow-[var(--shadow-field-danger)]',
  'aria-invalid:focus-visible:shadow-[var(--shadow-field-danger)]',
].join(' ')
