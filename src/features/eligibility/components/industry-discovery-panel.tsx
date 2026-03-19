import { ArrowRight, SearchCheck } from 'lucide-react'

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
import { Textarea } from '@/components/ui/textarea'
import { DISCOVERY_EXAMPLE_PROMPTS } from '@/features/eligibility/data/industry-discovery'
import { evaluateEligibility } from '@/features/eligibility/evaluator'
import type {
  EligibilityInput,
  IndustrySuggestion,
} from '@/features/eligibility/types'
import { formatVerdictLabel } from '@/utils/format'

interface IndustryDiscoveryPanelProps {
  input: EligibilityInput
  query: string
  suggestions: IndustrySuggestion[]
  status: 'idle' | 'loading' | 'ready' | 'error'
  error: string | null
  onQueryChange: (value: string) => void
  onDiscover: () => void
  onSuggestionSelect: (suggestion: IndustrySuggestion) => void
  onExampleSelect: (value: string) => void
}

function getVerdictBadgeVariant(verdict: ReturnType<typeof evaluateEligibility>['verdict']) {
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

function buildPreviewResult(input: EligibilityInput, suggestion: IndustrySuggestion) {
  return evaluateEligibility({
    ...input,
    ksicCode: suggestion.code,
    ksicName: suggestion.name,
    regulatoryFit: suggestion.suggestedRegulatoryFit ?? 'auto',
    flags: {
      ...input.flags,
      isHosting63112: suggestion.code === '63112',
    },
  })
}

function SuggestionCard({
  input,
  suggestion,
  onSelect,
}: {
  input: EligibilityInput
  suggestion: IndustrySuggestion
  onSelect: (suggestion: IndustrySuggestion) => void
}) {
  const previewResult = buildPreviewResult(input, suggestion)

  return (
    <article className="rounded-[24px] border border-white/10 bg-white/[0.04] p-5">
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant={suggestion.matchKind === 'exact' ? 'success' : 'muted'}>
          {suggestion.matchKind === 'exact' ? '바로 선택 가능' : '비슷한 업종'}
        </Badge>
        <Badge variant="muted">{suggestion.code}</Badge>
        <Badge variant={getVerdictBadgeVariant(previewResult.verdict)}>
          예상 결과 {formatVerdictLabel(previewResult.verdict)}
        </Badge>
      </div>

      <h3 className="mt-4 font-display text-xl font-semibold text-[var(--foreground)]">
        {suggestion.name}
      </h3>
      <p className="mt-2 text-sm leading-6 text-[var(--foreground-muted)]">
        {suggestion.reason}
      </p>

      {suggestion.catalogNote ? (
        <p className="mt-3 text-xs leading-5 text-[var(--foreground-subtle)]">
          참고: {suggestion.catalogNote}
        </p>
      ) : null}

      <div className="mt-4">
        <Button onClick={() => onSelect(suggestion)}>
          <ArrowRight className="size-4" />
          이 업종으로 결과 보기
        </Button>
      </div>
    </article>
  )
}

export function IndustryDiscoveryPanel({
  input,
  query,
  suggestions,
  status,
  error,
  onQueryChange,
  onDiscover,
  onSuggestionSelect,
  onExampleSelect,
}: IndustryDiscoveryPanelProps) {
  const isLoading = status === 'loading'
  const exactSuggestions = suggestions.filter(
    (suggestion) => suggestion.matchKind === 'exact',
  )
  const relatedSuggestions = suggestions.filter(
    (suggestion) => suggestion.matchKind === 'related',
  )

  return (
    <Card className="overflow-hidden border-white/12 bg-white/[0.05]">
      <CardHeader>
        <Badge variant="muted" className="w-fit">
          1단계
        </Badge>
        <CardTitle className="pt-1">업종코드 찾기</CardTitle>
        <CardDescription className="max-w-3xl">
          사업 설명이나 사업자등록증의 `업태 / 종목`을 넣어 주세요. 가장 가까운
          업종코드를 먼저 찾고, 바로 입주 판정으로 이어집니다.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <section className="rounded-[24px] border border-white/10 bg-white/[0.04] p-5">
          <div className="flex items-start gap-3">
            <div className="mt-1 inline-flex size-10 items-center justify-center rounded-2xl bg-white/8 text-[var(--foreground)]">
              <SearchCheck className="size-4" />
            </div>
            <div>
              <h3 className="font-display text-lg font-semibold text-[var(--foreground)]">
                어떤 사업을 하시나요?
              </h3>
              <p className="mt-1 text-sm leading-6 text-[var(--foreground-muted)]">
                자유롭게 적어도 되고, 사업자등록증의 업태·종목을 그대로 붙여 넣어도
                됩니다.
              </p>
            </div>
          </div>

          <Textarea
            className="mt-4 min-h-36"
            value={query}
            placeholder={
              '예: 업태: 서비스 / 종목: 광고대행업\n예: 모바일 앱 개발과 SaaS 운영을 합니다'
            }
            onChange={(event) => onQueryChange(event.target.value)}
          />

          <div className="mt-4 flex flex-wrap gap-2">
            {DISCOVERY_EXAMPLE_PROMPTS.map((prompt) => (
              <Button
                key={prompt}
                variant="secondary"
                size="sm"
                onClick={() => onExampleSelect(prompt)}
              >
                {prompt}
              </Button>
            ))}
          </div>

          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <Button disabled={isLoading || !query.trim()} onClick={onDiscover}>
              <SearchCheck className="size-4" />
              {isLoading ? '업종코드 찾는 중...' : '업종코드 찾기'}
            </Button>
            <p className="text-sm leading-6 text-[var(--foreground-subtle)]">
              정확한 코드가 없으면 가장 가까운 업종을 추천해 드립니다.
            </p>
          </div>
        </section>

        {status === 'idle' ? (
          <AsyncState
            variant="empty"
            title="사업 내용을 입력하면 코드 후보를 바로 보여드립니다."
            description="위 입력창에 한 줄만 적어도 됩니다. 가장 가까운 업종을 찾은 뒤, 선택 즉시 결과가 나옵니다."
            className="min-h-44"
          />
        ) : null}

        {status === 'loading' ? (
          <AsyncState
            variant="loading"
            title="업종코드 후보를 찾고 있습니다."
            description="입력한 설명과 사업자등록증 표현을 함께 비교해 가장 가까운 KSIC 코드를 정리하는 중입니다."
            className="min-h-44"
          />
        ) : null}

        {status === 'error' ? (
          <AsyncState
            variant="error"
            title="업종코드 추천 중 오류가 발생했습니다."
            description={error ?? '입력 문장을 조금 더 짧게 적고 다시 시도해 주세요.'}
            className="min-h-44"
          />
        ) : null}

        {status === 'ready' && suggestions.length === 0 ? (
          <AsyncState
            variant="empty"
            title="정확히 맞는 코드를 아직 찾지 못했습니다."
            description="사업 설명을 조금 더 구체적으로 적어 주세요. 예: 온라인 광고 기획 및 집행, 웹호스팅 운영, 모바일 앱 개발 및 공급"
            className="min-h-44"
          />
        ) : null}

        {status === 'ready' && suggestions.length > 0 ? (
          <div className="space-y-6">
            {exactSuggestions.length > 0 ? (
              <section className="space-y-3">
                <div className="text-sm font-medium text-[var(--foreground)]">
                  바로 선택해도 되는 업종
                </div>
                <div className="space-y-3">
                  {exactSuggestions.map((suggestion) => (
                    <SuggestionCard
                      key={suggestion.id}
                      input={input}
                      suggestion={suggestion}
                      onSelect={onSuggestionSelect}
                    />
                  ))}
                </div>
              </section>
            ) : null}

            {relatedSuggestions.length > 0 ? (
              <section className="space-y-3">
                <div className="text-sm font-medium text-[var(--foreground)]">
                  비슷한 업종 후보
                </div>
                <div className="space-y-3">
                  {relatedSuggestions.map((suggestion) => (
                    <SuggestionCard
                      key={suggestion.id}
                      input={input}
                      suggestion={suggestion}
                      onSelect={onSuggestionSelect}
                    />
                  ))}
                </div>
              </section>
            ) : null}
          </div>
        ) : null}
      </CardContent>
    </Card>
  )
}
