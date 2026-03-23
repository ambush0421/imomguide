import * as React from 'react'

import { cn } from '@/lib/utils'

type CSSVariableValue = string | number | undefined

type CSSVariableStyle = React.CSSProperties &
  Record<`--${string}`, CSSVariableValue>

const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, style, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'relative isolate overflow-hidden rounded-[var(--card-radius)] border border-[var(--border-subtle)]',
        'bg-[linear-gradient(180deg,var(--surface-strong),var(--surface-glass))] text-[var(--foreground)]',
        'shadow-[var(--shadow-floating)] backdrop-blur-2xl',
        'before:pointer-events-none before:absolute before:inset-px before:rounded-[calc(var(--card-radius)-1px)]',
        'before:border before:border-[var(--border-highlight)] before:bg-[radial-gradient(circle_at_top_left,var(--surface-tint),transparent_58%)] before:content-[""]',
        'after:pointer-events-none after:absolute after:inset-x-0 after:top-0 after:h-24 after:bg-gradient-to-b',
        'after:from-[var(--highlight-soft)] after:via-[var(--highlight-accent)] after:to-transparent after:content-[""]',
        className,
      )}
      style={
        {
          '--card-radius': 'var(--radius-panel)',
          '--card-padding': '12px',
          '--card-content-padding': '24px',
          '--card-inner-radius':
            'max(calc(var(--card-radius) - var(--card-padding)), var(--radius-field))',
          ...style,
        } as CSSVariableStyle
      }
      {...props}
    />
  ),
)

Card.displayName = 'Card'

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'relative z-10 space-y-3 px-[var(--card-content-padding)] pt-[var(--card-content-padding)] pb-0',
      className,
    )}
    {...props}
  />
))

CardHeader.displayName = 'CardHeader'

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      'font-display text-xl font-semibold tracking-[-0.03em] text-[var(--foreground)]',
      className,
    )}
    {...props}
  />
))

CardTitle.displayName = 'CardTitle'

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn(
      'text-sm leading-7 text-[var(--foreground-muted)]',
      className,
    )}
    {...props}
  />
))

CardDescription.displayName = 'CardDescription'

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'relative z-10 px-[var(--card-content-padding)] pb-[var(--card-content-padding)] pt-6',
      className,
    )}
    {...props}
  />
))

CardContent.displayName = 'CardContent'

export { Card, CardContent, CardDescription, CardHeader, CardTitle }
