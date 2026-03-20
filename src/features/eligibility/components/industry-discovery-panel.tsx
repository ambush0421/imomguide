import { ArrowRight, ChevronLeft, SearchCheck } from 'lucide-react'

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

type DiscoveryScreen = 'compose' | 'results'

interface IndustryDiscoveryPanelProps {
  input: EligibilityInput
  query: string
  suggestions: IndustrySuggestion[]
  status: 'idle' | 'loading' | 'ready' | 'error'
  error: string | null
  screen: DiscoveryScreen
  embedded?: boolean
  onQueryChange: (value: string) => void
  onSubmitSearch: () => void
  onSuggestionSelect: (suggestion: IndustrySuggestion) => void
  onExampleSelect: (value: string) => void
  onBackToSearch: () => void
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
          ? 'border-[var(--border-accent-strong)] bg-[linear-gradient(180deg,var(--surface-strong)_0%,rgba(216,229,255,0.92)_100%)] shadow-[var(--shadow-md)]'
          : 'border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow-sm)]'
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
        <p className="mt-3 rounded-2xl bg-[var(--surface-soft)] px-3 py-2 text-xs leading-5 text-[var(--foreground-subtle)]">
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
  screen,
  embedded = false,
  onQueryChange,
  onSubmitSearch,
  onSuggestionSelect,
  onExampleSelect,
  onBackToSearch,
  onContinueManual,
}: IndustryDiscoveryPanelProps) {
  const isLoading = status === 'loading'
  const exactSuggestions = suggestions.filter(
    (suggestion) => suggestion.matchKind === 'exact',
  )
  const relatedSuggestions = suggestions.filter(
    (suggestion) => suggestion.matchKind === 'related',
  )
  const totalSuggestionCount = exactSuggestions.length + relatedSuggestions.length

  if (screen === 'compose') {
    return (
      <Card
        className={
          embedded
            ? 'overflow-visible rounded-none border-0 bg-transparent shadow-none'
            : 'overflow-hidden bg-[var(--surface)] shadow-[var(--shadow-md)]'
        }
      >
        <CardHeader className={embedded ? 'hidden' : undefined}>
          <Badge variant="muted" className="w-fit">
            1단계
          </Badge>
          <CardTitle className="pt-1">업종코드 추천받기</CardTitle>
          <CardDescription className="max-w-3xl">
            업종코드를 몰라도 됩니다. 사업 설명이나 사업자등록증의 `업태 / 종목`을 넣으면,
            먼저 가장 가까운 코드를 추천해 드리고 바로 다음 화면으로 이어집니다.
          </CardDescription>
        </CardHeader>

        <CardContent className={embedded ? 'space-y-6 p-0' : 'space-y-6'}>
          <section className="rounded-[28px] border border-[var(--border-accent-strong)] bg-[linear-gradient(180deg,var(--surface-strong)_0%,rgba(216,229,255,0.92)_100%)] p-5 shadow-[var(--shadow-md)] sm:p-6">
            <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_260px]">
              <div>
                <div className="flex items-start gap-3">
                  <div className="mt-1 inline-flex size-10 items-center justify-center rounded-2xl bg-[var(--accent-soft)] text-[var(--accent-strong)] shadow-[var(--shadow-sm)]">
                    <SearchCheck className="size-4" />
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-semibold text-[var(--foreground)]">
                      어떤 일을 하시나요?
                    </h3>
                    <p className="mt-1 text-sm leading-6 text-[var(--foreground-muted)]">
                      업종코드를 몰라도 됩니다. 어떤 일을 하는지 쉬운 말로 적어 주세요.
                      버튼을 누르면 추천 결과 화면으로 넘어가 바로 확인할 수 있습니다.
                    </p>
                  </div>
                </div>

                <Textarea
                  className="mt-4 min-h-36 bg-[var(--surface-strong)] shadow-[var(--shadow-sm)]"
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
                  <Button
                    disabled={isLoading || !query.trim()}
                    loading={isLoading}
                    onClick={onSubmitSearch}
                  >
                    {!isLoading ? <SearchCheck className="size-4" /> : null}
                    {isLoading ? '추천 코드 찾는 중...' : '추천 코드 찾기'}
                  </Button>
                  <Button variant="secondary" onClick={onContinueManual}>
                    직접 입력으로 계속
                  </Button>
                </div>
              </div>

              <div className="rounded-[24px] border border-[var(--border)] bg-[var(--surface)] p-4 shadow-[var(--shadow-sm)]">
                <div className="text-xs font-semibold tracking-[0.08em] text-[var(--foreground-subtle)]">
                  이렇게 넘어갑니다
                </div>
                <div className="mt-3 space-y-3">
                  <div className="rounded-2xl bg-[var(--surface-soft)] px-3 py-3 text-sm leading-6 text-[var(--foreground-muted)]">
                    1. 어떤 일을 하는지 적고 `추천 코드 찾기`를 누릅니다.
                  </div>
                  <div className="rounded-2xl bg-[var(--surface-soft)] px-3 py-3 text-sm leading-6 text-[var(--foreground-muted)]">
                    2. 다음 화면에서 `먼저 볼 코드`와 `비슷한 코드`를 비교합니다.
                  </div>
                  <div className="rounded-2xl bg-[var(--surface-soft)] px-3 py-3 text-sm leading-6 text-[var(--foreground-muted)]">
                    3. 원하는 코드를 누르면 2단계 조건 보정 화면으로 넘어갑니다.
                  </div>
                </div>
              </div>
            </div>
          </section>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card
      className={
        embedded
          ? 'overflow-visible rounded-none border-0 bg-transparent shadow-none'
          : 'overflow-hidden bg-[var(--surface)] shadow-[var(--shadow-md)]'
      }
    >
      <CardHeader className={embedded ? 'space-y-5 px-0 pt-0 pb-0' : 'space-y-5'}>
        <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <div className={embedded ? 'hidden' : undefined}>
            <Badge variant="muted" className="w-fit">
              1단계 · 추천 결과 화면
            </Badge>
            <CardTitle className="pt-1">입력한 설명과 가까운 코드를 정리했습니다</CardTitle>
            <CardDescription className="max-w-3xl">
              이 화면에서 코드를 하나 고르면 다음 단계로 넘어갑니다. 마음에 드는 코드가
              없으면 다시 검색하거나 직접 입력으로 이어갈 수 있습니다.
            </CardDescription>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" onClick={onBackToSearch}>
              <ChevronLeft className="size-4" />
              다시 검색
            </Button>
            <Button variant="ghost" onClick={onContinueManual}>
              직접 입력으로 계속
            </Button>
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          <div className="rounded-[22px] border border-[var(--border)] bg-[var(--surface-muted)] px-4 py-3 shadow-[var(--shadow-sm)]">
            <div className="text-xs text-[var(--foreground-subtle)]">입력한 설명</div>
            <div className="mt-1 text-sm font-medium text-[var(--foreground)]">
              {query.trim() || '아직 입력 전'}
            </div>
          </div>
          <div className="rounded-[22px] border border-[var(--border)] bg-[var(--surface-muted)] px-4 py-3 shadow-[var(--shadow-sm)]">
            <div className="text-xs text-[var(--foreground-subtle)]">현재 기준 구역</div>
            <div className="mt-1 text-sm font-medium text-[var(--foreground)]">
              {getZoneLabel(input)}
            </div>
          </div>
          <div className="rounded-[22px] border border-[var(--border)] bg-[var(--surface-muted)] px-4 py-3 shadow-[var(--shadow-sm)]">
            <div className="text-xs text-[var(--foreground-subtle)]">추천 상태</div>
            <div className="mt-1 text-sm font-medium text-[var(--foreground)]">
              {status === 'loading'
                ? '추천 코드를 찾는 중'
                : status === 'ready'
                  ? `${totalSuggestionCount}개 후보 정리`
                  : status === 'error'
                    ? '다시 확인 필요'
                    : '추천 준비'}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className={embedded ? 'space-y-6 p-0 pt-6' : 'space-y-6'}>
        {status === 'idle' ? (
          <AsyncState
            variant="empty"
            title="먼저 검색을 한 번 실행해 주세요."
            description="입력 화면으로 돌아가 사업 설명을 적고 추천 코드 찾기를 누르면, 이 화면에 후보 코드를 정리해 보여드립니다."
            actions={
              <Button variant="secondary" onClick={onBackToSearch}>
                <ChevronLeft className="size-4" />
                입력 화면으로 돌아가기
              </Button>
            }
            className="min-h-44"
          />
        ) : null}

        {status === 'loading' ? (
          <AsyncState
            variant="loading"
            title="추천 결과 화면을 준비하고 있습니다."
            description="입력한 설명과 사업자등록증 표현을 함께 비교해 가장 가까운 KSIC 코드를 정리하는 중입니다."
            className="min-h-44"
          />
        ) : null}

        {status === 'error' ? (
          <AsyncState
            variant="error"
            title="추천 코드를 정리하는 중 오류가 발생했습니다."
            description={error ?? '입력 문장을 조금 더 짧게 적고 다시 시도해 주세요.'}
            actions={
              <div className="flex flex-wrap gap-2">
                <Button variant="secondary" onClick={onBackToSearch}>
                  <ChevronLeft className="size-4" />
                  다시 검색
                </Button>
                <Button onClick={onContinueManual}>직접 입력으로 계속</Button>
              </div>
            }
            className="min-h-44"
          />
        ) : null}

        {status === 'ready' && suggestions.length === 0 ? (
          <AsyncState
            variant="empty"
            title="아직 맞는 추천 코드를 찾지 못했습니다."
            description="사업 설명을 조금 더 구체적으로 적어 주세요. 예: 온라인 광고 기획 및 집행, 웹호스팅 운영, 모바일 앱 개발 및 공급"
            actions={
              <div className="flex flex-wrap gap-2">
                <Button variant="secondary" onClick={onBackToSearch}>
                  <ChevronLeft className="size-4" />
                  입력 화면으로 돌아가기
                </Button>
                <Button onClick={onContinueManual}>직접 입력으로 계속</Button>
              </div>
            }
            className="min-h-44"
          />
        ) : null}

        {status === 'ready' && suggestions.length > 0 ? (
          <div className="space-y-6">
            <div className="rounded-[24px] border border-[var(--border-accent-strong)] bg-[linear-gradient(180deg,var(--surface-strong)_0%,var(--surface-muted)_100%)] px-4 py-4 text-sm leading-6 text-[var(--foreground-muted)] shadow-[var(--shadow-sm)]">
              추천된 카드를 누르면 바로 다음 화면으로 넘어갑니다. 먼저 볼 코드가 있으면
              그 코드부터 확인하는 편이 가장 빠릅니다.
            </div>

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
