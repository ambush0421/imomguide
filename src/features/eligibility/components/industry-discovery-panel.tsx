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
  onContinueManual: () => void
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

function getZoneLabel(input: EligibilityInput) {
  if (input.zoneType === 'industrialFacility') {
    return '산업시설구역'
  }

  if (input.zoneType === 'knowledgeIndustryCenter') {
    return '지식산업센터'
  }

  return '지원시설구역'
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
  const zoneVerdict = suggestion.selectedZoneVerdict ?? previewResult.verdict
  const headlineReason = suggestion.recommendationReason ?? suggestion.reason
  const isExact = suggestion.matchKind === 'exact'

  return (
    <article
      className={`rounded-[26px] border p-5 ${
        isExact
          ? 'border-[rgba(43,109,255,0.16)] bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(241,247,255,0.96))] shadow-[0_18px_36px_rgba(43,109,255,0.08)]'
          : 'border-[rgba(21,37,58,0.08)] bg-[rgba(255,255,255,0.84)] shadow-none'
      }`}
    >
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant={isExact ? 'success' : 'muted'}>
          {isExact ? '먼저 볼 코드' : '비슷한 코드'}
        </Badge>
        <Badge variant="muted">{suggestion.code}</Badge>
        <Badge variant={getVerdictBadgeVariant(zoneVerdict)}>
          {getZoneLabel(input)} 기준 {formatVerdictLabel(zoneVerdict)}
        </Badge>
      </div>

      <h3 className="mt-4 font-display text-xl font-semibold text-[var(--foreground)]">
        {suggestion.name}
      </h3>
      <p className="mt-2 text-sm leading-6 text-[var(--foreground-muted)]">
        {headlineReason}
      </p>

      {suggestion.reason !== headlineReason ? (
        <p className="mt-3 rounded-2xl bg-[rgba(248,251,255,0.92)] px-3 py-2 text-xs leading-5 text-[var(--foreground-subtle)]">
          추천 근거: {suggestion.reason}
        </p>
      ) : null}

      {suggestion.catalogNote ? (
        <p className="mt-2 text-xs leading-5 text-[var(--foreground-subtle)]">
          참고: {suggestion.catalogNote}
        </p>
      ) : null}

      <div className="mt-5">
        <Button
          variant={suggestion.matchKind === 'exact' ? 'default' : 'secondary'}
          onClick={() => onSelect(suggestion)}
        >
          <ArrowRight className="size-4" />
          이 코드로 확인하기
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
  onContinueManual,
}: IndustryDiscoveryPanelProps) {
  const isLoading = status === 'loading'
  const exactSuggestions = suggestions.filter(
    (suggestion) => suggestion.matchKind === 'exact',
  )
  const relatedSuggestions = suggestions.filter(
    (suggestion) => suggestion.matchKind === 'related',
  )

  return (
    <Card className="overflow-hidden bg-white/92">
      <CardHeader>
        <Badge variant="muted" className="w-fit">
          1단계
        </Badge>
        <CardTitle className="pt-1">업종코드 추천받기</CardTitle>
        <CardDescription className="max-w-3xl">
          업종코드를 몰라도 됩니다. 사업 설명이나 사업자등록증의 `업태 / 종목`을 넣으면,
          먼저 가장 가까운 코드를 추천해 드리고 바로 결과 확인으로 이어집니다.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <section className="rounded-[28px] border border-[rgba(43,109,255,0.14)] bg-[linear-gradient(180deg,rgba(241,247,255,0.96),rgba(255,255,255,0.96))] p-5 sm:p-6">
          <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_260px]">
            <div>
              <div className="flex items-start gap-3">
                <div className="mt-1 inline-flex size-10 items-center justify-center rounded-2xl bg-[rgba(43,109,255,0.12)] text-[var(--accent)]">
                  <SearchCheck className="size-4" />
                </div>
                <div>
                  <h3 className="font-display text-lg font-semibold text-[var(--foreground)]">
                    어떤 일을 하시나요?
                  </h3>
                  <p className="mt-1 text-sm leading-6 text-[var(--foreground-muted)]">
                    업종코드를 몰라도 됩니다. 어떤 일을 하는지 쉬운 말로 적어 주세요. 바로 확인할 만한 코드를 먼저
                    추천하고, 애매하면 비슷한 코드까지 이어서 보여드립니다.
                  </p>
                </div>
              </div>

              <Textarea
                className="mt-4 min-h-36 bg-white"
                value={query}
                placeholder={
                  '예: 광고대행업을 해요\n예: 업태: 서비스 / 종목: 광고대행업\n예: 모바일 앱 개발과 SaaS 운영을 합니다'
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

              <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
                <Button disabled={isLoading || !query.trim()} onClick={onDiscover}>
                  <SearchCheck className="size-4" />
                  {isLoading ? '추천 코드 찾는 중...' : '추천 코드 찾기'}
                </Button>
                <Button variant="secondary" onClick={onContinueManual}>
                  직접 입력으로 계속
                </Button>
              </div>
            </div>

            <div className="rounded-[24px] border border-[rgba(21,37,58,0.08)] bg-[rgba(255,255,255,0.82)] p-4">
              <div className="text-xs font-semibold tracking-[0.08em] text-[var(--foreground-subtle)]">
                이렇게 보면 쉽습니다
              </div>
              <div className="mt-3 space-y-3">
                <div className="rounded-2xl bg-[rgba(248,251,255,0.96)] px-3 py-3 text-sm leading-6 text-[var(--foreground-muted)]">
                  1. 먼저 `바로 확인할 수 있는 추천 코드`를 봅니다.
                </div>
                <div className="rounded-2xl bg-[rgba(248,251,255,0.96)] px-3 py-3 text-sm leading-6 text-[var(--foreground-muted)]">
                  2. 없으면 `비슷한 코드 추천`에서 가까운 업종을 고릅니다.
                </div>
                <div className="rounded-2xl bg-[rgba(248,251,255,0.96)] px-3 py-3 text-sm leading-6 text-[var(--foreground-muted)]">
                  3. 선택한 코드로 바로 입주 가능성까지 확인합니다.
                </div>
              </div>
            </div>
          </div>
        </section>

        {status === 'idle' ? (
          <AsyncState
            variant="empty"
            title="사업 내용을 입력하면 추천 코드를 바로 보여드립니다."
            description="한 줄만 적어도 됩니다. 가장 가까운 코드를 찾은 뒤, 선택 즉시 입주 가능 여부를 볼 수 있습니다."
            className="min-h-44"
          />
        ) : null}

        {status === 'loading' ? (
          <AsyncState
            variant="loading"
            title="추천 코드를 찾고 있습니다."
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
            title="아직 맞는 추천 코드를 찾지 못했습니다."
            description="사업 설명을 조금 더 구체적으로 적어 주세요. 예: 온라인 광고 기획 및 집행, 웹호스팅 운영, 모바일 앱 개발 및 공급"
            className="min-h-44"
          />
        ) : null}

        {status === 'ready' && suggestions.length > 0 ? (
          <div className="space-y-6">
            {exactSuggestions.length > 0 ? (
              <section className="space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <div className="text-sm font-semibold text-[var(--foreground)]">
                    바로 확인할 수 있는 추천 코드
                  </div>
                  <Badge variant="success">{exactSuggestions.length}개</Badge>
                </div>
                <div className="grid gap-3 xl:grid-cols-2">
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
                <div className="flex items-center justify-between gap-3">
                  <div className="text-sm font-semibold text-[var(--foreground)]">
                    비슷한 코드 추천
                  </div>
                  <Badge variant="muted">{relatedSuggestions.length}개</Badge>
                </div>
                <div className="grid gap-3 xl:grid-cols-2">
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
