import type { ReactNode } from 'react'
import { LoaderCircle, Search, TriangleAlert } from 'lucide-react'

import { cn } from '@/lib/utils'

type AsyncStateVariant = 'empty' | 'loading' | 'error'

const iconMap: Record<AsyncStateVariant, ReactNode> = {
  empty: <Search className="size-5" />,
  loading: <LoaderCircle className="size-5 animate-spin" />,
  error: <TriangleAlert className="size-5" />,
}

export interface AsyncStateProps {
  variant: AsyncStateVariant
  title: string
  description: string
  actions?: ReactNode
  className?: string
}

export function AsyncState({
  variant,
  title,
  description,
  actions,
  className,
}: AsyncStateProps) {
  return (
    <div
      className={cn(
        'flex min-h-72 flex-col justify-center rounded-[24px] border border-dashed border-[var(--border)] bg-[rgba(239,245,255,0.88)] p-6',
        className,
      )}
    >
      <div className="mb-4 inline-flex size-11 items-center justify-center rounded-2xl bg-[rgba(43,109,255,0.1)] text-[var(--accent)]">
        {iconMap[variant]}
      </div>
      <h3 className="font-display text-xl font-semibold text-[var(--foreground)]">
        {title}
      </h3>
      <p className="mt-3 max-w-xl text-sm leading-6 text-[var(--foreground-muted)]">
        {description}
      </p>
      {actions ? <div className="mt-5">{actions}</div> : null}
    </div>
  )
}
