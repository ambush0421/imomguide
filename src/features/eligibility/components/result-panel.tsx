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
}: ResultPanelProps) {
  const hasManualInput = Boolean(input.ksicCode.trim() || input.ksicName.trim())

  return (
    <Card className="sticky top-6 overflow-hidden">
      <CardHeader>
        <div className="flex items-center justify-between gap-3">
          <div>
            <CardTitle>바로 결과 보기</CardTitle>
            <CardDescription>
              선택한 업종과 현재 설정 기준으로 입주 가능성을 보여드립니다.
            </CardDescription>
          </div>
          {input.address.trim() ? (
            <Badge variant="muted" className="hidden md:inline-flex">
              <MapPin className="mr-1 size-3.5" />
              {input.address.trim()}
            </Badge>
          ) : null}
        </div>
      </CardHeader>
      <CardContent>
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
            <section className="rounded-[24px] border border-white/10 bg-white/[0.04] p-5">
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

            <section className="rounded-[24px] border border-white/10 bg-white/[0.04] p-5">
              <div className="flex items-center gap-2 text-sm font-medium text-[var(--foreground)]">
                <ArrowRight className="size-4 text-[var(--accent-soft)]" />
                왜 이렇게 판단했나요?
              </div>
              <ul className="mt-4 space-y-3 text-sm leading-6 text-[var(--foreground-muted)]">
                {result.reasons.map((reason) => (
                  <li
                    key={reason}
                    className="rounded-2xl border border-white/8 bg-white/4 px-4 py-3"
                  >
                    {reason}
                  </li>
                ))}
              </ul>
            </section>

            <section className="rounded-[24px] border border-white/10 bg-white/[0.04] p-5">
              <div className="flex items-center gap-2 text-sm font-medium text-[var(--foreground)]">
                <FileStack className="size-4 text-[var(--accent-soft)]" />
                다음에 확인할 것
              </div>
              <ul className="mt-4 space-y-3 text-sm leading-6 text-[var(--foreground-muted)]">
                {result.requiredActions.map((action) => (
                  <li
                    key={action}
                    className="rounded-2xl border border-white/8 bg-white/4 px-4 py-3"
                  >
                    {action}
                  </li>
                ))}
              </ul>
            </section>

            <section className="rounded-[24px] border border-white/10 bg-white/[0.04] p-5">
              <div className="flex items-center justify-between gap-3">
                <h4 className="font-display text-lg font-semibold text-[var(--foreground)]">
                  세부 근거
                </h4>
                <Badge variant="muted">{result.legalBases.length}건</Badge>
              </div>
              <div className="mt-4 space-y-3">
                {result.legalBases.map((basis) => (
                  <article
                    key={basis.id}
                    className="rounded-2xl border border-white/8 bg-white/4 p-4"
                  >
                    <div className="text-xs uppercase tracking-[0.14em] text-[var(--foreground-subtle)]">
                      {basis.source === 'magokPlan' ? '고시문' : '시행령'} ·{' '}
                      {basis.citation}
                    </div>
                    <p className="mt-3 text-sm leading-6 text-[var(--foreground-muted)]">
                      {basis.summary}
                    </p>
                  </article>
                ))}
              </div>
            </section>
          </div>
        ) : null}
      </CardContent>
    </Card>
  )
}
