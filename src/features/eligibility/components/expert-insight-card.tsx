import { Lightbulb, ShieldAlert } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import type { ExpertInsightEntry } from '@/features/eligibility/data/expert-insights'

interface ExpertInsightCardProps {
  insight: ExpertInsightEntry
}

export function ExpertInsightCard({ insight }: ExpertInsightCardProps) {
  return (
    <article className="rounded-[24px] border border-[var(--border)] bg-[var(--surface-strong)] p-5">
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant={insight.tone}>전문가 인사이트</Badge>
        <Badge variant="muted">실무 해설</Badge>
      </div>
      <h4 className="mt-4 font-display text-lg font-semibold text-[var(--foreground)]">
        {insight.title}
      </h4>
      <p className="mt-3 text-sm leading-6 text-[var(--foreground-muted)]">
        {insight.summary}
      </p>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] p-4">
          <div className="flex items-center gap-2 text-sm font-medium text-[var(--foreground)]">
            <Lightbulb className="size-4 text-[var(--accent)]" />
            바로 써먹는 포인트
          </div>
          <ul className="mt-3 space-y-2 text-sm leading-6 text-[var(--foreground-muted)]">
            {insight.actionItems.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-muted)] p-4">
          <div className="flex items-center gap-2 text-sm font-medium text-[var(--foreground)]">
            <ShieldAlert className="size-4 text-[var(--accent)]" />
            놓치기 쉬운 리스크
          </div>
          <ul className="mt-3 space-y-2 text-sm leading-6 text-[var(--foreground-muted)]">
            {insight.riskNotes.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
    </article>
  )
}
