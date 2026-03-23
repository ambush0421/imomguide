import { cn } from '@/lib/utils'

export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'relative origin-center overflow-hidden rounded-[var(--skeleton-radius,var(--radius-field))]',
        'border border-[var(--border-subtle)] bg-[linear-gradient(180deg,var(--surface-elevated),var(--surface-overlay))]',
        'shadow-[var(--shadow-embedded)] backdrop-blur-xl animate-[pulse-organic_1.9s_ease-in-out_infinite]',
        'before:pointer-events-none before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_top_left,var(--surface-tint),transparent_60%)] before:content-[""]',
        'after:pointer-events-none after:absolute after:inset-x-0 after:top-0 after:h-1/2 after:bg-gradient-to-b after:from-[var(--highlight-soft)] after:to-transparent after:opacity-80 after:content-[""]',
        className,
      )}
      {...props}
    />
  )
}

export function SkeletonCard({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'rounded-[var(--radius-panel)] border border-[var(--border-subtle)] bg-[linear-gradient(180deg,var(--surface-strong),var(--surface-glass))] p-6 shadow-[var(--shadow-floating)] backdrop-blur-2xl',
        className,
      )}
    >
      <div className="space-y-4">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
        <div className="flex gap-3 pt-2">
          <Skeleton className="h-11 w-32 rounded-[var(--radius-field)]" />
          <Skeleton className="h-11 w-28 rounded-[var(--radius-field)]" />
        </div>
      </div>
    </div>
  )
}
