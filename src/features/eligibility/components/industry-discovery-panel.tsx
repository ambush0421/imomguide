import { useState } from 'react'
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
  Verdict,
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

const MOBILE_DISCOVERY_EXAMPLES = [
  {
    prompt: DISCOVERY_EXAMPLE_PROMPTS[0],
    label: '광고대행업',
  },
  {
    prompt: DISCOVERY_EXAMPLE_PROMPTS[1],
    label: '업태/종목 입력',
  },
  {
    prompt: DISCOVERY_EXAMPLE_PROMPTS[2],
    label: '앱 개발/SaaS',
  },
  {
    prompt: DISCOVERY_EXAMPLE_PROMPTS[3],
    label: '행사 대행',
  },
] as const

const initialVisibleSuggestionCount = 3

type SuggestionGroupKey = 'priority' | 'secondary' | 'caution'
type SuggestionFilterKey = 'all' | 'eligible' | 'caution'

interface SuggestionGroupDefinition {
  key: SuggestionGroupKey
  title: string
  description: string
  badgeLabel: string
  badgeVariant: 'success' | 'muted' | 'warning'
  cardClassName: string
}

interface SuggestionFilterDefinition {
  key: SuggestionFilterKey
  label: string
  description: string
}

const SUGGESTION_GROUPS: SuggestionGroupDefinition[] = [
  {
    key: 'priority',
    title: '먼저 볼 코드',
    description:
      '입력 표현과 직접 연결되거나 현재 구역 기준으로 바로 검토할 가치가 큰 코드입니다.',
    badgeLabel: '우선 검토',
    badgeVariant: 'success',
    cardClassName:
      'border-[var(--border-accent-strong)] bg-[var(--surface-strong)] shadow-[var(--shadow-md)]',
  },
  {
    key: 'secondary',
    title: '함께 확인할 코드',
    description: '같은 계열에서 함께 비교해 보면 좋은 후보입니다.',
    badgeLabel: '함께 비교',
    badgeVariant: 'muted',
    cardClassName:
      'border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow-sm)]',
  },
  {
    key: 'caution',
    title: '주의해서 볼 코드',
    description:
      '조건부·심의 필요·추가 확인이 걸리는 후보라서 이유를 함께 읽어야 합니다.',
    badgeLabel: '주의 후보',
    badgeVariant: 'warning',
    cardClassName:
      'border-[var(--warning-border)] bg-[var(--warning-bg)] shadow-[var(--shadow-sm)]',
  },
]

const SUGGESTION_FILTERS: SuggestionFilterDefinition[] = [
  {
    key: 'all',
    label: '전체 후보',
    description:
      '현재 구역 기준 후보를 모두 보며, 어떤 코드를 먼저 설명할지 한 번에 비교합니다.',
  },
  {
    key: 'eligible',
    label: '바로 검토 가능',
    description: '현재 구역 기준 가능으로 먼저 검토할 후보만 보고 있습니다.',
  },
  {
    key: 'caution',
    label: '주의 후보만',
    description: '조건부·심의 필요·추가 확인이 걸린 후보만 따로 보고 있습니다.',
  },
]

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

function getSuggestionZoneVerdict(
  input: EligibilityInput,
  suggestion: IndustrySuggestion,
): Verdict {
  return suggestion.selectedZoneVerdict ?? buildPreviewResult(input, suggestion).verdict
}

function getSuggestionGroupKey(
  suggestion: IndustrySuggestion,
  zoneVerdict: Verdict,
): SuggestionGroupKey {
  if (zoneVerdict !== 'eligible') {
    return 'caution'
  }

  if (suggestion.matchKind === 'exact') {
    return 'priority'
  }

  return 'secondary'
}

function getSuggestionOriginLabel(suggestion: IndustrySuggestion) {
  return suggestion.matchKind === 'exact' ? '직접 연결' : '유사 후보'
}

function matchesSuggestionFilter(
  zoneVerdict: Verdict,
  filterKey: SuggestionFilterKey,
) {
  if (filterKey === 'eligible') {
    return zoneVerdict === 'eligible'
  }

  if (filterKey === 'caution') {
    return zoneVerdict !== 'eligible'
  }

  return true
}

function SuggestionCard({
  input,
  group,
  suggestion,
  zoneVerdict,
  onSelect,
}: {
  input: EligibilityInput
  group: SuggestionGroupDefinition
  suggestion: IndustrySuggestion
  zoneVerdict: Verdict
  onSelect: (suggestion: IndustrySuggestion) => void
}) {
  const headlineReason = suggestion.recommendationReason ?? suggestion.reason

  return (
    <article
      className={`rounded-[24px] border p-4 sm:rounded-[26px] sm:p-5 ${group.cardClassName}`}
    >
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant={group.badgeVariant}>{group.badgeLabel}</Badge>
        <Badge variant={suggestion.matchKind === 'exact' ? 'success' : 'muted'}>
          {getSuggestionOriginLabel(suggestion)}
        </Badge>
        <Badge variant="muted">{suggestion.code}</Badge>
        <Badge variant={getVerdictBadgeVariant(zoneVerdict)}>
          {getZoneLabel(input)} 기준 {formatVerdictLabel(zoneVerdict)}
        </Badge>
      </div>

      <h3 className="mt-3 font-display text-lg font-semibold leading-[1.22] text-[var(--foreground)] sm:mt-4 sm:text-xl">
        {suggestion.name}
      </h3>
      <p className="mt-2 max-w-[38rem] text-sm leading-7 text-[var(--foreground-muted)]">
        {headlineReason}
      </p>

      {suggestion.reason !== headlineReason ? (
        <p className="mt-3 hidden rounded-2xl border border-[var(--border-soft)] bg-[var(--surface-soft)] px-3.5 py-3 text-xs leading-6 text-[var(--foreground-subtle)] sm:block">
          추천 근거: {suggestion.reason}
        </p>
      ) : null}

      {suggestion.catalogNote ? (
        <p className="mt-2 hidden text-xs leading-5 text-[var(--foreground-subtle)] sm:block">
          참고: {suggestion.catalogNote}
        </p>
      ) : null}

      <div className="mt-5">
        <Button
          variant={group.key === 'priority' ? 'default' : 'secondary'}
          className="w-full whitespace-nowrap sm:w-auto"
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
  const [showAllMobileExamples, setShowAllMobileExamples] = useState(false)
  const [expandedGroupKeys, setExpandedGroupKeys] = useState<string[]>([])
  const [activeFilterState, setActiveFilterState] = useState<{
    filterKey: SuggestionFilterKey
    scopeKey: string
  }>({
    filterKey: 'all',
    scopeKey: '',
  })
  const groupedSuggestions = suggestions.map((suggestion) => {
    const zoneVerdict = getSuggestionZoneVerdict(input, suggestion)

    return {
      suggestion,
      zoneVerdict,
      groupKey: getSuggestionGroupKey(suggestion, zoneVerdict),
    }
  })
  const suggestionExpansionPrefix = `${screen}:${query.trim()}:${suggestions
    .map((suggestion) => suggestion.id)
    .join('|')}`
  const activeFilterKey =
    activeFilterState.scopeKey === suggestionExpansionPrefix
      ? activeFilterState.filterKey
      : 'all'
  const suggestionFilters = SUGGESTION_FILTERS.map((filter) => ({
    ...filter,
    count: groupedSuggestions.filter((item) =>
      matchesSuggestionFilter(item.zoneVerdict, filter.key),
    ).length,
  }))
  const activeSuggestionFilter =
    suggestionFilters.find((filter) => filter.key === activeFilterKey) ?? suggestionFilters[0]
  const filteredSuggestions = groupedSuggestions.filter((item) =>
    matchesSuggestionFilter(item.zoneVerdict, activeSuggestionFilter.key),
  )
  const suggestionGroups = SUGGESTION_GROUPS.map((group) => {
    const items = filteredSuggestions.filter((item) => item.groupKey === group.key)
    const expansionKey = `${suggestionExpansionPrefix}:${group.key}`
    const isExpanded = expandedGroupKeys.includes(expansionKey)
    const visibleItems = isExpanded
      ? items
      : items.slice(0, initialVisibleSuggestionCount)
    const hiddenItemCount = Math.max(items.length - visibleItems.length, 0)

    return {
      ...group,
      expansionKey,
      hiddenItemCount,
      isExpanded,
      items,
      visibleItems,
    }
  }).filter((group) => group.items.length > 0)
  const totalSuggestionCount = suggestions.length
  const visibleMobileExamples = showAllMobileExamples
    ? MOBILE_DISCOVERY_EXAMPLES
    : MOBILE_DISCOVERY_EXAMPLES.slice(0, 2)

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
          <CardTitle className="pt-1">컨설턴트·중개사를 위한 빠른 검색 홈</CardTitle>
          <CardDescription className="max-w-3xl">
            업종코드는 몰라도 됩니다. 고객이 말한 업태·종목이나 업무 내용을 그대로 적고,
            추천 코드와 예비판정을 한 번에 확인해 보세요.
          </CardDescription>
        </CardHeader>

        <CardContent className={embedded ? 'space-y-4 p-0 sm:space-y-6' : 'space-y-6'}>
          <section className="rounded-[20px] border border-[var(--border-accent-strong)] bg-[var(--surface-strong)] p-4 shadow-none sm:rounded-[28px] sm:p-6 sm:shadow-[var(--shadow-md)]">
            <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_280px]">
              <div>
                <div className="flex items-start gap-3">
                  <div className="mt-1 inline-flex size-9 items-center justify-center rounded-2xl bg-[var(--accent-soft)] text-[var(--accent-strong)] shadow-[var(--shadow-sm)] sm:size-10">
                    <SearchCheck className="size-4" />
                  </div>
                  <div>
                    <h3 className="font-display text-xl font-semibold leading-[1.2] text-[var(--foreground)] sm:text-[1.45rem]">
                      고객이 어떤 업태·종목으로 설명했나요?
                    </h3>
                    <p className="mt-2 max-w-[36rem] text-sm leading-6 text-[var(--foreground-muted)] sm:text-[15px] sm:leading-7">
                      <span className="sm:hidden">
                        고객이 말한 표현 그대로 적고 추천 코드를 바로 확인해 보세요.
                      </span>
                      <span className="hidden sm:inline">
                        업종코드는 몰라도 됩니다. 고객이 말한 업태·종목이나 업무 내용을
                        그대로 적어 주세요. 버튼을 누르면 추천 결과 화면으로 넘어가 바로
                        확인할 수 있습니다.
                      </span>
                    </p>
                  </div>
                </div>

                <Textarea
                  className="mt-5 min-h-24 bg-[var(--surface-strong)] text-base leading-7 shadow-[var(--shadow-sm)] sm:min-h-28 sm:text-[15px] sm:leading-7"
                  value={query}
                  placeholder="예: 소프트웨어 개발 도급, 온라인 교육 플랫폼 운영, 프랜차이즈 카페 본사"
                  onChange={(event) => onQueryChange(event.target.value)}
                />

                <div className="mt-3 space-y-1">
                  <p className="text-sm leading-6 text-[var(--foreground-muted)]">
                    사업자등록증 업태·종목, 실무 메모, 통화 중에 들은 표현 그대로 적으셔도
                    됩니다.
                  </p>
                  <p className="text-xs leading-5 text-[var(--foreground-subtle)]">
                    입력 후 '추천 코드 찾기' 버튼이 활성화됩니다.
                  </p>
                </div>

                <div className="mt-3 space-y-2 sm:hidden">
                  <div className="grid grid-cols-2 gap-2">
                    {visibleMobileExamples.map((item) => (
                      <Button
                        key={item.prompt}
                        variant="secondary"
                        size="sm"
                        className="min-w-0 justify-center px-3"
                        onClick={() => onExampleSelect(item.prompt)}
                      >
                        <span className="truncate">{item.label}</span>
                      </Button>
                    ))}
                  </div>
                  {MOBILE_DISCOVERY_EXAMPLES.length > 2 ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-auto min-h-0 px-0 py-1 text-[var(--foreground-muted)]"
                      onClick={() => setShowAllMobileExamples((prev) => !prev)}
                    >
                      {showAllMobileExamples ? '예시 접기' : '예시 더 보기'}
                    </Button>
                  ) : null}
                </div>

                <div className="mt-3 hidden gap-1.5 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:flex">
                  {DISCOVERY_EXAMPLE_PROMPTS.map((prompt) => (
                    <Button
                      key={prompt}
                      variant="secondary"
                      size="sm"
                      className="shrink-0 whitespace-nowrap"
                      onClick={() => onExampleSelect(prompt)}
                    >
                      {prompt}
                    </Button>
                  ))}
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-2 sm:auto-rows-fr">
                  <div className="flex h-full flex-col gap-2.5 rounded-[16px] border border-[var(--border-soft)] bg-[var(--surface-soft)] p-4">
                    <Button
                      disabled={isLoading || !query.trim()}
                      loading={isLoading}
                      className="w-full justify-center whitespace-nowrap"
                      onClick={onSubmitSearch}
                    >
                      {!isLoading ? <SearchCheck className="size-4" /> : null}
                      {isLoading ? '추천 코드 찾는 중...' : '추천 코드 찾기'}
                    </Button>
                    <p className="min-h-12 text-sm leading-6 text-[var(--foreground-muted)]">
                      설명을 적으면 마곡 기준 후보 코드를 먼저 보여드립니다.
                    </p>
                  </div>
                  <div className="flex h-full flex-col gap-2.5 rounded-[16px] border border-[var(--border-soft)] bg-[var(--surface-soft)] p-4">
                    <Button
                      variant="secondary"
                      aria-label="직접 입력으로 계속"
                      className="w-full justify-center whitespace-nowrap"
                      onClick={onContinueManual}
                    >
                      직접 입력으로 계속
                    </Button>
                    <p className="min-h-12 text-sm leading-6 text-[var(--foreground-muted)]">
                      코드를 알고 있으면 예비판정 화면으로 바로 넘어갑니다.
                    </p>
                  </div>
                </div>
              </div>

              <div className="hidden rounded-[24px] border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow-sm)] xl:block">
                <div className="text-xs font-semibold tracking-[0.08em] text-[var(--foreground-subtle)]">
                  상담 흐름은 이렇게 이어집니다
                </div>
                <div className="mt-3 space-y-3">
                  <div className="rounded-2xl bg-[var(--surface-soft)] px-4 py-3.5 text-sm leading-6 text-[var(--foreground-muted)]">
                    1. 고객이 말한 업태·종목이나 업무 내용을 적고 '추천 코드 찾기'를 누릅니다.
                  </div>
                  <div className="rounded-2xl bg-[var(--surface-soft)] px-4 py-3.5 text-sm leading-6 text-[var(--foreground-muted)]">
                    2. 다음 화면에서 먼저 볼 코드와 함께 확인할 후보를 비교합니다.
                  </div>
                  <div className="rounded-2xl bg-[var(--surface-soft)] px-4 py-3.5 text-sm leading-6 text-[var(--foreground-muted)]">
                    3. 원하는 코드를 누르면 조건 보정과 예비판정 화면으로 이어집니다.
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
      <CardHeader className={embedded ? 'space-y-4 px-0 pt-0 pb-0 sm:space-y-5' : 'space-y-5'}>
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
          <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
            <Button variant="secondary" size="sm" className="w-full whitespace-nowrap sm:w-auto" onClick={onBackToSearch}>
              <ChevronLeft className="size-4" />
              다시 검색
            </Button>
            <Button
              variant="ghost"
              size="sm"
              aria-label="직접 입력으로 계속"
              className="w-full justify-center text-[var(--foreground-muted)] sm:w-auto"
              onClick={onContinueManual}
            >
              <span className="sm:hidden">직접 입력</span>
              <span className="hidden sm:inline">직접 입력으로 계속</span>
            </Button>
          </div>
        </div>

        <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3 sm:gap-3">
          <div className="rounded-[20px] border border-[var(--border)] bg-[var(--surface-muted)] px-4 py-3.5 shadow-[var(--shadow-sm)] sm:rounded-[22px]">
            <div className="text-xs text-[var(--foreground-subtle)]">입력한 설명</div>
            <div className="mt-1 text-sm font-medium leading-6 text-[var(--foreground)]">
              {query.trim() || '아직 입력 전'}
            </div>
          </div>
          <div className="rounded-[20px] border border-[var(--border)] bg-[var(--surface-muted)] px-4 py-3.5 shadow-[var(--shadow-sm)] sm:rounded-[22px]">
            <div className="text-xs text-[var(--foreground-subtle)]">현재 기준 구역</div>
            <div className="mt-1 text-sm font-medium leading-6 text-[var(--foreground)]">
              {getZoneLabel(input)}
            </div>
          </div>
          <div className="rounded-[20px] border border-[var(--border)] bg-[var(--surface-muted)] px-4 py-3.5 shadow-[var(--shadow-sm)] sm:rounded-[22px]">
            <div className="text-xs text-[var(--foreground-subtle)]">추천 상태</div>
            <div className="mt-1 text-sm font-medium leading-6 text-[var(--foreground)]">
              {status === 'loading'
                ? '추천 코드를 찾는 중'
                : status === 'ready'
                  ? totalSuggestionCount > initialVisibleSuggestionCount
                    ? `${totalSuggestionCount}개 후보 정리 · 관련도 높은 순서로 먼저 표시`
                    : `${totalSuggestionCount}개 후보 정리`
                  : status === 'error'
                    ? '다시 확인 필요'
                    : '추천 준비'}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className={embedded ? 'space-y-4 p-0 pt-4 sm:space-y-6 sm:pt-6' : 'space-y-6'}>
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
            description="입력한 설명과 가장 가까운 업종코드를 찾는 중입니다."
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
                <Button aria-label="직접 입력으로 계속" onClick={onContinueManual}>
                  <span className="sm:hidden">직접 입력</span>
                  <span className="hidden sm:inline">직접 입력으로 계속</span>
                </Button>
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
                <Button aria-label="직접 입력으로 계속" onClick={onContinueManual}>
                  <span className="sm:hidden">직접 입력</span>
                  <span className="hidden sm:inline">직접 입력으로 계속</span>
                </Button>
              </div>
            }
            className="min-h-44"
          />
        ) : null}

        {status === 'ready' && suggestions.length > 0 ? (
          <div className="space-y-6">
            <div className="rounded-[20px] border border-[var(--border-accent-strong)] bg-[var(--surface-strong)] px-4 py-3.5 text-xs leading-5 text-[var(--foreground-muted)] shadow-[var(--shadow-sm)] sm:rounded-[24px] sm:py-4 sm:text-sm sm:leading-6">
              추천 결과를 현재 구역 기준으로 다시 묶었습니다. 먼저 볼 코드부터 확인하고,
              애매한 후보는 함께 확인할 코드와 주의해서 볼 코드에서 이유를 비교해 보세요.
              빠르게 좁혀보고 싶으면 아래 필터에서 현재 구역 기준 가능한 후보만 먼저 볼
              수도 있습니다.
            </div>

            <section className="rounded-[20px] border border-[var(--border)] bg-[var(--surface-soft)] px-4 py-3.5 shadow-[var(--shadow-sm)] sm:rounded-[24px] sm:px-5 sm:py-4">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <div className="text-sm font-semibold text-[var(--foreground)]">
                    추천 결과 빠르게 좁혀보기
                  </div>
                  <p className="mt-1 text-xs leading-5 text-[var(--foreground-muted)]">
                    {activeSuggestionFilter.description}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {suggestionFilters.map((filter) => (
                    <Button
                      key={filter.key}
                      variant={activeSuggestionFilter.key === filter.key ? 'default' : 'secondary'}
                      size="sm"
                      aria-pressed={activeSuggestionFilter.key === filter.key}
                      disabled={filter.key !== 'all' && filter.count === 0}
                      onClick={() =>
                        setActiveFilterState({
                          filterKey: filter.key,
                          scopeKey: suggestionExpansionPrefix,
                        })
                      }
                    >
                      {filter.label}
                      <span className="ml-1 text-xs opacity-80">{filter.count}</span>
                    </Button>
                  ))}
                </div>
              </div>
            </section>

            {suggestionGroups.length === 0 ? (
              <AsyncState
                variant="empty"
                title="선택한 필터에 맞는 후보가 아직 없습니다."
                description="전체 후보로 돌아가면 현재 검색에서 찾은 모든 추천 코드를 다시 볼 수 있습니다."
                actions={
                  <Button
                    variant="secondary"
                    onClick={() =>
                      setActiveFilterState({
                        filterKey: 'all',
                        scopeKey: suggestionExpansionPrefix,
                      })
                    }
                  >
                    전체 후보 보기
                  </Button>
                }
                className="min-h-44"
              />
            ) : (
              suggestionGroups.map((group) => (
                <section key={group.key} className="space-y-3">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <div className="text-sm font-semibold text-[var(--foreground)]">
                          {group.title}
                        </div>
                        <Badge variant={group.badgeVariant}>{group.items.length}개</Badge>
                      </div>
                      <p className="mt-1 max-w-2xl text-xs leading-5 text-[var(--foreground-muted)]">
                        {group.description}
                      </p>
                    </div>
                  </div>
                  <div className="grid gap-3 xl:grid-cols-2">
                    {group.visibleItems.map(({ suggestion, zoneVerdict }) => (
                      <SuggestionCard
                        key={suggestion.id}
                        input={input}
                        group={group}
                        suggestion={suggestion}
                        zoneVerdict={zoneVerdict}
                        onSelect={onSuggestionSelect}
                      />
                    ))}
                  </div>
                  {group.items.length > initialVisibleSuggestionCount ? (
                    <div className="flex justify-center sm:justify-start">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() =>
                          setExpandedGroupKeys((prev) =>
                            prev.includes(group.expansionKey)
                              ? prev.filter((key) => key !== group.expansionKey)
                              : [...prev, group.expansionKey],
                          )
                        }
                      >
                        {group.isExpanded
                          ? `${group.title} 접기`
                          : `더 보기 (${group.hiddenItemCount}개 더)`}
                      </Button>
                    </div>
                  ) : null}
                </section>
              ))
            )}
          </div>
        ) : null}
      </CardContent>
    </Card>
  )
}
