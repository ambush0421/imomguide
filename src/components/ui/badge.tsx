import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium tracking-[0.02em]',
  {
    variants: {
      variant: {
        default: 'border-white/10 bg-white/10 text-[var(--foreground)]',
        success: 'border-emerald-400/20 bg-emerald-400/12 text-emerald-100',
        warning: 'border-amber-400/20 bg-amber-400/12 text-amber-100',
        danger: 'border-rose-400/20 bg-rose-400/12 text-rose-100',
        muted: 'border-white/10 bg-white/6 text-[var(--foreground-muted)]',
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
