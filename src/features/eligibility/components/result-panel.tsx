import { ArrowRight, FileStack, MapPin } from 'lucide-react'

import { AsyncState } from '@/components/async-state'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { ConvergenceReviewCard } from '@/features/eligibility/components/convergence-review-card'
import { ExpertInsightCard } from '@/features/eligibility/components/expert-insight-card'
import { LegalFootnotes } from '@/features/eligibility/components/legal-footnotes'
import { LayoutSimulator } from '@/features/eligibility/components/layout-simulator'
import { getConvergenceReviewPlaybook } from '@/features/eligibility/data/convergence-review-playbook'
import { getExpertInsights } from '@/features/eligibility/data/expert-insights'
import { getEligibilityScreenInsight } from '@/features/eligibility/data/screen-insights'
import { getGuideEntryByCode } from '@/features/guides/data/guide-catalog'
import type {
  EligibilityInput,
  EligibilityResult,
} from '@/features/eligibility/types'
import { formatVerdictLabel } from '@/utils/format'

const zoneTypeLabels: Record<EligibilityInput['zoneType'], string> = {
  industrialFacility: '산업시설구역',
  knowledgeIndustryCenter: '지식산업센터',
  supportFacility: '지원시설구역',
}

interface ResultPanelProps {
  input: EligibilityInput
  result: EligibilityResult | null
  status: 'idle' | 'loading' | 'ready' | 'error'
  error: string | null
  onEvaluate: () => void
  onAdjust?: () => void
  onOpenGuide?: (code: string) => void
  sticky?: boolean
  stepLabel?: string
  embedded?: boolean
}

function getBadgeVariant(verdict: EligibilityResult['verdict']) {
  if (verdict === 'eligible') {
    return 'success' as const
  }

  if (verdict === 'conditional' || verdict === 'reviewRequired') {
    return 'warning' as const
  }

  if (verdict === 'ineligible') {
    return 'danger' as const
  }

  return 'muted' as const
}

export function ResultPanel({
  input,
  result,
  status,
  error,
  onEvaluate,
  onAdjust,
  onOpenGuide,
  sticky = true,
  stepLabel = '2단계',
  embedded = false,
}: ResultPanelProps) {
  const hasManualInput = Boolean(input.ksicCode.trim() || input.ksicName.trim())
  const screenInsight = getEligibilityScreenInsight(input, result)
  const expertInsights = getExpertInsights(input, result)
  const convergencePlaybook = getConvergenceReviewPlaybook(input, result)
  const guideEntry = input.ksicCode.trim()
    ? getGuideEntryByCode(input.ksicCode.trim())
    : null

  return (
    <Card
      className={
        embedded
          ? sticky
            ? 'sticky top-6 overflow-visible rounded-none border-0 bg-transparent shadow-none'
            : 'overflow-visible rounded-none border-0 bg-transparent shadow-none'
          : sticky
            ? 'sticky top-6 overflow-hidden bg-[var(--surface)] shadow-[var(--shadow-md)]'
            : 'overflow-hidden bg-[var(--surface)] shadow-[var(--shadow-md)]'
      }
    >
      <CardHeader className={embedded ? 'px-0 pt-0 pb-0' : undefined}>
        <div className="flex items-center justify-between gap-3">
          <div className={embedded ? 'hidden' : undefined}>
            <Badge variant="muted" className="mb-3 w-fit">
              {stepLabel}
            </Badge>
            <CardTitle>결과 확인</CardTitle>
            <CardDescription>
              선택한 업종과 현재 설정 기준으로 입주 가능성을 바로 보여드립니다.
            </CardDescription>
          </div>
          {input.address.trim() ? (
            <Badge variant="muted" className="hidden md:inline-flex">
              <MapPin className="mr-1 size-3.5" />
              {input.address.trim()}
            </Badge>
          ) : null}
        </div>
        {status === 'ready' && result && onAdjust ? (
          <div className="pt-3">
            <Button variant="secondary" onClick={onAdjust}>
              조건 다시 수정
            </Button>
          </div>
        ) : null}
      </CardHeader>
      <CardContent className={embedded ? 'p-0 pt-5' : undefined}>
        {status === 'idle' ? (
          <AsyncState
            variant="empty"
            title="업종을 고르면 결과가 여기에 바로 나옵니다."
            description="먼저 왼쪽에서 사업 설명을 입력하고 추천 업종을 선택해 주세요. 직접 코드를 넣었다면 아래 버튼으로 바로 판정할 수 있습니다."
            actions={
              hasManualInput ? (
                <Button onClick={onEvaluate}>현재 설정으로 결과 보기</Button>
              ) : undefined
            }
          />
        ) : null}

        {status === 'loading' ? (
          <AsyncState
            variant="loading"
            title="법령과 관리기본계획을 대조하고 있습니다."
            description="허용 업종, 심의 필요 조건, 명시적 제한 문구를 순서대로 확인하는 중입니다."
          />
        ) : null}

        {status === 'error' ? (
          <AsyncState
            variant="error"
            title="판정 중 오류가 발생했습니다."
            description={error ?? '입력값 또는 내부 판정 엔진을 다시 확인해 주세요.'}
            actions={
              <Button variant="secondary" onClick={onEvaluate}>
                다시 시도
              </Button>
            }
          />
        ) : null}

        {status === 'ready' && result ? (
          <div className="space-y-4">
            <section className="rounded-[24px] border border-[var(--border-accent-strong)] bg-[linear-gradient(180deg,var(--surface-strong)_0%,var(--surface-muted)_100%)] p-5 shadow-[var(--shadow-md)]">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant={getBadgeVariant(result.verdict)}>
                  {formatVerdictLabel(result.verdict)}
                </Badge>
                <Badge variant="muted">{zoneTypeLabels[input.zoneType]}</Badge>
                {input.ksicCode.trim() ? (
                  <Badge variant="muted">{input.ksicCode.trim()}</Badge>
                ) : null}
              </div>
              <h3 className="mt-4 font-display text-2xl font-semibold text-[var(--foreground)]">
                {result.title}
              </h3>
              <p className="mt-3 text-sm leading-6 text-[var(--foreground-muted)]">
                {result.summary}
              </p>
              {result.matchedRules.length > 0 ? (
                <div className="mt-4 flex flex-wrap gap-2">
                  {result.matchedRules.map((rule) => (
                    <Badge key={rule}>{rule}</Badge>
                  ))}
                </div>
              ) : null}
            </section>

            {screenInsight ? (
              <section className="rounded-[24px] border border-[var(--border)] bg-[var(--surface-strong)] p-5 shadow-[var(--shadow-sm)]">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant={screenInsight.tone}>업종코드 상세 해설</Badge>
                  <Badge variant="muted">화면 기준 재정리</Badge>
                </div>
                <h4 className="mt-4 font-display text-lg font-semibold text-[var(--foreground)]">
                  {screenInsight.title}
                </h4>
                <div className="mt-4 grid gap-3">
                  {screenInsight.fields.map((field) => (
                    <div
                      key={`${field.label}-${field.value}`}
                      className="rounded-2xl border border-[var(--border)] bg-[var(--surface-muted)] px-4 py-3 shadow-[var(--shadow-sm)]"
                    >
                      <div className="text-xs text-[var(--foreground-subtle)]">
                        {field.label}
                      </div>
                      <div className="mt-1 text-sm font-medium leading-6 text-[var(--foreground)]">
                        {field.value}
                      </div>
                    </div>
                  ))}
                </div>
                {screenInsight.bullets.length > 0 ? (
                  <div className="mt-4 space-y-3">
                    {screenInsight.bullets.map((bullet) => (
                      <div
                        key={bullet}
                        className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm leading-6 text-[var(--foreground-muted)] shadow-[var(--shadow-sm)]"
                      >
                        {bullet}
                      </div>
                    ))}
                  </div>
                ) : null}
              </section>
            ) : null}

            {expertInsights.length > 0 ? (
              <section className="space-y-4 rounded-[24px] border border-[var(--border)] bg-[var(--surface-soft)] p-5 shadow-[var(--shadow-sm)]">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="muted">전문가 인사이트</Badge>
                  <Badge variant="muted">실무형 해설</Badge>
                </div>
                <div className="grid gap-4 xl:grid-cols-2">
                  {expertInsights.map((insight) => (
                    <ExpertInsightCard key={insight.id} insight={insight} />
                  ))}
                </div>
              </section>
            ) : null}

            {convergencePlaybook ? (
              <ConvergenceReviewCard playbook={convergencePlaybook} />
            ) : null}

            <div className="grid gap-4 md:grid-cols-2">
              <section className="rounded-[24px] border border-[var(--border)] bg-[var(--surface-strong)] p-5 shadow-[var(--shadow-sm)]">
                <div className="flex items-center gap-2 text-sm font-medium text-[var(--foreground)]">
                  <ArrowRight className="size-4 text-[var(--accent)]" />
                  왜 이렇게 판단했나요?
                </div>
                <ul className="mt-4 space-y-3 text-sm leading-6 text-[var(--foreground-muted)]">
                  {result.reasons.map((reason) => (
                    <li
                      key={reason}
                      className="rounded-2xl border border-[var(--border)] bg-[var(--surface-muted)] px-4 py-3 shadow-[var(--shadow-sm)]"
                    >
                      {reason}
                    </li>
                  ))}
                </ul>
              </section>

              <section className="rounded-[24px] border border-[var(--border)] bg-[var(--surface-strong)] p-5 shadow-[var(--shadow-sm)]">
                <div className="flex items-center gap-2 text-sm font-medium text-[var(--foreground)]">
                  <FileStack className="size-4 text-[var(--accent)]" />
                  다음에 확인할 것
                </div>
                <ul className="mt-4 space-y-3 text-sm leading-6 text-[var(--foreground-muted)]">
                  {result.requiredActions.map((action) => (
                    <li
                      key={action}
                      className="rounded-2xl border border-[var(--warning-border)] bg-[rgba(255,247,221,0.82)] px-4 py-3 shadow-[var(--shadow-sm)]"
                    >
                      {action}
                    </li>
                  ))}
                </ul>
              </section>
            </div>

            {guideEntry && onOpenGuide ? (
              <section className="rounded-[24px] border border-[var(--border)] bg-[var(--surface-soft)] p-5 shadow-[var(--shadow-sm)]">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="muted">연관 가이드</Badge>
                  <Badge variant="muted">{guideEntry.code}</Badge>
                </div>
                <h4 className="mt-4 font-display text-lg font-semibold text-[var(--foreground)]">
                  이 업종 기준 설명을 문서형 가이드로 다시 읽을 수 있습니다
                </h4>
                <p className="mt-3 text-sm leading-6 text-[var(--foreground-muted)]">
                  결과 화면의 요약보다 더 긴 설명, 구역 비교, 자주 묻는 질문을 한 번에
                  보는 가이드 페이지입니다.
                </p>
                <div className="mt-4">
                  <Button
                    variant="secondary"
                    onClick={() => onOpenGuide(guideEntry.code)}
                    aria-label={`${guideEntry.code} 가이드 보기`}
                  >
                    이 코드 가이드 보기
                    <ArrowRight className="size-4" />
                  </Button>
                </div>
              </section>
            ) : null}

            <LayoutSimulator input={input} />

            <LegalFootnotes legalBases={result.legalBases} />
          </div>
        ) : null}
      </CardContent>
    </Card>
  )
}
