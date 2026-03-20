import { ArrowUpRight, Network } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import type { ConvergenceReviewPlaybook } from '@/features/eligibility/data/convergence-review-playbook'

interface ConvergenceReviewCardProps {
  playbook: ConvergenceReviewPlaybook
}

export function ConvergenceReviewCard({ playbook }: ConvergenceReviewCardProps) {
  return (
    <section className="rounded-[24px] border border-[rgba(43,109,255,0.18)] bg-[rgba(239,245,255,0.9)] p-5">
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="warning">융복합 심의 경로</Badge>
        {playbook.candidateClusters.map((cluster) => (
          <Badge key={cluster} variant="muted">
            {cluster}
          </Badge>
        ))}
      </div>
      <h4 className="mt-4 font-display text-lg font-semibold text-[var(--foreground)]">
        {playbook.title}
      </h4>
      <p className="mt-3 text-sm leading-6 text-[var(--foreground-muted)]">
        {playbook.summary}
      </p>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-[var(--border)] bg-white/90 p-4">
          <div className="flex items-center gap-2 text-sm font-medium text-[var(--foreground)]">
            <Network className="size-4 text-[var(--accent)]" />
            사업계획서에 먼저 들어갈 문장
          </div>
          <ul className="mt-3 space-y-2 text-sm leading-6 text-[var(--foreground-muted)]">
            {playbook.planHints.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-[var(--border)] bg-white/90 p-4">
          <div className="flex items-center gap-2 text-sm font-medium text-[var(--foreground)]">
            <ArrowUpRight className="size-4 text-[var(--accent)]" />
            심의 전 체크 자료
          </div>
          <ul className="mt-3 space-y-2 text-sm leading-6 text-[var(--foreground-muted)]">
            {playbook.evidenceChecklist.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
