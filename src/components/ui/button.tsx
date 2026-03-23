import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { LoaderCircle } from 'lucide-react'

import { cn } from '@/lib/utils'

const buttonVariants = cva(
  [
    'relative isolate inline-flex items-center justify-center gap-2 overflow-hidden rounded-[16px] border px-5 py-3 text-sm font-semibold',
    'transition-[transform,box-shadow,background-color,border-color,color] duration-300 ease-[var(--motion-snappy)]',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]',
    'disabled:pointer-events-none disabled:opacity-55',
    'before:pointer-events-none before:absolute before:inset-x-0 before:top-0 before:h-1/2 before:bg-gradient-to-b before:from-[var(--highlight-soft)] before:to-transparent before:opacity-80 before:content-[""]',
    'after:pointer-events-none after:absolute after:inset-px after:rounded-[calc(16px-1px)] after:border after:border-transparent after:content-[""]',
  ].join(' '),
  {
    variants: {
      variant: {
        default:
          'border-[var(--border-accent-strong)] bg-[linear-gradient(180deg,var(--accent-elevated),var(--accent-deep))] text-[var(--accent-foreground)] shadow-[var(--shadow-button-primary)] after:border-[var(--highlight-accent)] hover:-translate-y-0.5 hover:shadow-[var(--shadow-button-primary-hover)]',
        secondary:
          'border-[var(--border-subtle)] bg-[linear-gradient(180deg,var(--surface-strong),var(--surface-elevated))] text-[var(--foreground)] shadow-[var(--shadow-button-secondary)] after:border-[var(--border-highlight)] hover:-translate-y-0.5 hover:border-[var(--border-accent-strong)] hover:bg-[linear-gradient(180deg,var(--surface-strong),var(--surface-overlay))]',
        ghost:
          'border-transparent bg-transparent text-[var(--foreground)] shadow-none before:opacity-0 after:hidden hover:border-[var(--border-subtle)] hover:bg-[linear-gradient(180deg,var(--surface-elevated),var(--surface-overlay))] hover:text-[var(--accent-strong)] hover:shadow-[var(--shadow-embedded)]',
        outline:
          'border-[var(--border-soft)] bg-[linear-gradient(180deg,var(--surface-glass),var(--surface-elevated))] text-[var(--foreground)] shadow-[var(--shadow-embedded)] after:border-[var(--border-highlight)] hover:-translate-y-0.5 hover:border-[var(--border-accent-strong)] hover:bg-[linear-gradient(180deg,var(--surface-strong),var(--surface-elevated))]',
      },
      size: {
        default: 'h-[var(--field-height)]',
        sm: 'h-10 min-h-[44px] px-3.5 text-xs',
        lg: 'h-12 px-6 text-sm',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  loading?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, loading = false, disabled, children, ...props }, ref) => {
    const isLoading = loading && !asChild

    if (asChild) {
      return (
        <Slot
          className={cn(buttonVariants({ variant, size, className }))}
          ref={ref}
          {...props}
        >
          {children}
        </Slot>
      )
    }

    return (
      <button
        type="button"
        className={cn(
          buttonVariants({ variant, size, className }),
          isLoading ? 'cursor-progress' : undefined,
        )}
        ref={ref}
        {...props}
        disabled={disabled || isLoading}
        aria-busy={isLoading || undefined}
      >
        {isLoading ? <LoaderCircle className="relative z-10 size-4 animate-spin" aria-hidden="true" /> : null}
        <span className="relative z-10 inline-flex items-center gap-2">{children}</span>
      </button>
    )
  },
)

Button.displayName = 'Button'

export { Button }
