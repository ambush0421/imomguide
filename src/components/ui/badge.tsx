import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold tracking-[0.02em]',
  {
    variants: {
      variant: {
        default:
          'border-[var(--accent-strong)] bg-[var(--accent)] text-[var(--accent-foreground)] shadow-[0_10px_20px_rgba(20,92,255,0.18)]',
        success:
          'border-[var(--success-border)] bg-[var(--success-bg)] text-[var(--success-foreground)]',
        warning:
          'border-[var(--warning-border)] bg-[var(--warning-bg)] text-[var(--warning-foreground)]',
        danger:
          'border-[var(--danger-border)] bg-[var(--danger-bg)] text-[var(--danger-foreground)]',
        muted:
          'border-[var(--border)] bg-[var(--surface-muted)] text-[var(--foreground-muted)]',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge }
