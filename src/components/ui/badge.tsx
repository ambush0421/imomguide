import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium tracking-[0.02em]',
  {
    variants: {
      variant: {
        default:
          'border-[rgba(43,109,255,0.18)] bg-[rgba(43,109,255,0.1)] text-[var(--accent)]',
        success:
          'border-emerald-200 bg-emerald-50 text-emerald-700',
        warning:
          'border-amber-200 bg-amber-50 text-amber-700',
        danger:
          'border-rose-200 bg-rose-50 text-rose-700',
        muted:
          'border-[rgba(21,37,58,0.1)] bg-[rgba(249,251,255,0.96)] text-[var(--foreground-subtle)]',
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
