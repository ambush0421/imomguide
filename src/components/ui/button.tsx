import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { LoaderCircle } from 'lucide-react'

import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 rounded-full text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)] disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default:
          'bg-[var(--accent)] px-5 py-3 text-[var(--accent-foreground)] shadow-[var(--shadow-accent)] hover:-translate-y-0.5 hover:brightness-[0.97] hover:shadow-[0_20px_34px_rgba(31,94,255,0.18)]',
        secondary:
          'bg-[var(--surface-strong)] px-5 py-3 text-[var(--foreground)] ring-1 ring-[var(--border-soft)] shadow-[var(--shadow-sm)] hover:bg-[var(--surface-muted)] hover:text-[var(--foreground)] hover:ring-[var(--border-accent-strong)]',
        ghost:
          'px-4 py-3 text-[var(--foreground)] hover:bg-[var(--accent-soft)] hover:text-[var(--accent-strong)]',
        outline:
          'bg-[var(--surface-strong)] px-5 py-3 text-[var(--foreground)] ring-1 ring-[var(--border-soft)] hover:bg-[var(--surface-muted)] hover:ring-[var(--border-accent-strong)]',
      },
      size: {
        default: 'h-11',
        sm: 'h-9 min-h-[44px] px-3 text-xs',
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
        {isLoading ? <LoaderCircle className="size-4 animate-spin" aria-hidden="true" /> : null}
        {children}
      </button>
    )
  },
)

Button.displayName = 'Button'

export { Button }
