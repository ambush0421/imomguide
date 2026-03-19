import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 rounded-full text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)] disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default:
          'bg-[var(--accent)] px-5 py-3 text-[var(--accent-foreground)] shadow-[0_16px_34px_rgba(239,109,30,0.18)] hover:-translate-y-0.5 hover:bg-[var(--accent-strong)]',
        secondary:
          'bg-white px-5 py-3 text-[var(--foreground)] ring-1 ring-[var(--border)] hover:bg-[rgba(239,109,30,0.05)]',
        ghost:
          'px-4 py-3 text-[var(--foreground-muted)] hover:bg-[rgba(239,109,30,0.06)] hover:text-[var(--foreground)]',
        outline:
          'bg-transparent px-5 py-3 text-[var(--foreground)] ring-1 ring-[var(--border)] hover:bg-white/60',
      },
      size: {
        default: 'h-11',
        sm: 'h-9 px-3 text-xs',
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
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  },
)

Button.displayName = 'Button'

export { Button }
