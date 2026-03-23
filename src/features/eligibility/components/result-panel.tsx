import { useEffect, useState } from 'react'
import { ArrowRight, Copy, FileStack, Link2, MapPin, Printer } from 'lucide-react'

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
import { getEligibilityStrategyPlan } from '@/features/eligibility/data/eligibility-strategy'
import { getGuideEntryByCode } from '@/features/guides/data/guide-catalog'
import type {
  ComparableZoneType,
  EligibilityCodeEvaluation,
  EligibilityComparisonResults,
  EligibilityInput,
  EligibilityResult,
} from '@/features/eligibility/types'
import { formatVerdictLabel } from '@/utils/format'

const zoneTypeLabels: Record<EligibilityInput['zoneType'], string> = {
  industrialFacility: '산업시설구역',
  knowledgeIndustryCenter: '지식산업센터',
  supportFacility: '지원시설구역',
}

const comparisonZoneOrder: ComparableZoneType[] = [
  'knowledgeIndustryCenter',
  'industrialFacility',
]

const verdictRank: Record<EligibilityResult['verdict'], number> = {
  eligible: 0,
  conditional: 1,
  reviewRequired: 2,
  insufficient: 3,
  ineligible: 4,
}

interface ResultPanelProps {
  input: EligibilityInput
  result: EligibilityResult | null
  multiCodeResults?: EligibilityCodeEvaluation[] | null
  compareZones?: boolean
  comparisonResults?: EligibilityComparisonResults | null
  status: 'idle' | 'loading' | 'ready' | 'error'
  error: string | null
  onEvaluate: () => void
  onAdjust?: () => void
  onOpenGuide?: (code: string) => void
  onCopyShareLink?: () => Promise<void> | void
  onCopyResultSummary?: () => Promise<void> | void
  onPrintResult?: () => void
  onOpenLibraryEntry?: (entryId: string) => void
  onOpenLibraryBasis?: (basisId: string) => void
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

function getComparisonHeadline(comparisonResults: EligibilityComparisonResults) {
  const knowledgeResult = comparisonResults.knowledgeIndustryCenter
  const industrialResult = comparisonResults.industrialFacility

  if (knowledgeResult.verdict === industrialResult.verdict) {
    return `두 구역 모두 ${formatVerdictLabel(knowledgeResult.verdict)} 결과로 정리됩니다.`
  }

  return verdictRank[knowledgeResult.verdict] < verdictRank[industrialResult.verdict]
    ? '지식산업센터 쪽이 더 유리하게 나옵니다.'
    : '산업시설구역 쪽이 더 유리하게 나옵니다.'
}

function getComparisonSupportCopy(comparisonResults: EligibilityComparisonResults) {
  const knowledgeResult = comparisonResults.knowledgeIndustryCenter
  const industrialResult = comparisonResults.industrialFacility

  return `${zoneTypeLabels.knowledgeIndustryCenter}는 ${formatVerdictLabel(
    knowledgeResult.verdict,
  )}, ${zoneTypeLabels.industrialFacility}는 ${formatVerdictLabel(
    industrialResult.verdict,
  )}로 계산됐습니다. 같은 업종이라도 어느 구역이 더 맞는지 상담 중 바로 설명할 수 있습니다.`
}

function getCombinedLegalBases(comparisonResults: EligibilityComparisonResults) {
  const values = comparisonZoneOrder.flatMap(
    (zoneType) => comparisonResults[zoneType].legalBases,
  )

  return values.filter(
    (basis, index, allValues) =>
      allValues.findIndex((candidate) => candidate.id === basis.id) === index,
  )
}

function getCombinedLegalBasesForMultiCode(
  multiCodeResults: EligibilityCodeEvaluation[],
  isComparisonMode: boolean,
) {
  const values = multiCodeResults.flatMap((entry) =>
    isComparisonMode && entry.comparisonResults
      ? comparisonZoneOrder.flatMap(
          (zoneType) => entry.comparisonResults?.[zoneType].legalBases ?? [],
        )
      : entry.result.legalBases,
  )

  return values.filter(
    (basis, index, allValues) =>
      allValues.findIndex((candidate) => candidate.id === basis.id) === index,
  )
}

function getCodeDisplayText(entry: EligibilityCodeEvaluation) {
  const codeAndName = `${entry.ksicCode.trim()} ${entry.ksicName.trim()}`.trim()

  return codeAndName || '업종코드를 직접 입력해 주세요'
}

function getMultiCodeHeadline(
  multiCodeResults: EligibilityCodeEvaluation[],
  isComparisonMode: boolean,
) {
  const additionalCount = Math.max(multiCodeResults.length - 1, 0)

  if (isComparisonMode) {
    return `주업종과 부업종 ${additionalCount}개를 두 구역 기준으로 함께 비교했습니다.`
  }

  return `주업종과 부업종 ${additionalCount}개를 한 번에 판정했습니다.`
}

function getMultiCodeSupportCopy(
  input: EligibilityInput,
  multiCodeResults: EligibilityCodeEvaluation[],
  isComparisonMode: boolean,
) {
  if (isComparisonMode) {
    return `총 ${multiCodeResults.length}개 업종코드를 지식산업센터와 산업시설구역 기준으로 동시에 계산했습니다. 사업자등록증의 주업종과 부업종이 어느 구역에서 더 유리한지, 코드별로 바로 설명할 수 있습니다.`
  }

  return `총 ${multiCodeResults.length}개 업종코드를 ${zoneTypeLabels[input.zoneType]} 기준으로 함께 판정했습니다. 주업종과 부업종 중 어디에서 추가 확인이 필요한지 코드별로 나눠 읽을 수 있습니다.`
}

function ActionButtons({
  onCopyShareLink,
  onCopyResultSummary,
  onPrintResult,
  onCopyShare,
  onCopySummary,
  isCopyingLink,
  isCopyingSummary,
}: {
  onCopyShareLink?: () => Promise<void> | void
  onCopyResultSummary?: () => Promise<void> | void
  onPrintResult?: () => void
  onCopyShare: () => Promise<void> | void
  onCopySummary: () => Promise<void> | void
  isCopyingLink: boolean
  isCopyingSummary: boolean
}) {
  return (
    <div className="mt-5 flex flex-wrap gap-2">
      {onCopyShareLink ? (
        <Button
          variant="secondary"
          size="sm"
          className="whitespace-nowrap"
          onClick={onCopyShare}
          disabled={isCopyingLink}
        >
          <Link2 className="size-4" />
          {isCopyingLink ? '링크 복사 중...' : '공유 링크 복사'}
        </Button>
      ) : null}
      {onCopyResultSummary ? (
        <Button
          variant="outline"
          size="sm"
          className="whitespace-nowrap"
          onClick={onCopySummary}
          disabled={isCopyingSummary}
        >
          <Copy className="size-4" />
          {isCopyingSummary ? '요약 복사 중...' : '판정 요약 복사'}
        </Button>
      ) : null}
      {onPrintResult ? (
        <Button
          variant="ghost"
          size="sm"
          className="whitespace-nowrap"
          onClick={onPrintResult}
        >
          <Printer className="size-4" />
          인쇄 / PDF 저장
        </Button>
      ) : null}
    </div>
  )
}

export function ResultPanel({
  input,
  result,
  multiCodeResults = null,
  compareZones = false,
  comparisonResults = null,
  status,
  error,
  onEvaluate,
  onAdjust,
  onOpenGuide,
  onCopyShareLink,
  onCopyResultSummary,
  onPrintResult,
  onOpenLibraryEntry,
  onOpenLibraryBasis,
  sticky = true,
  stepLabel = '2단계',
  embedded = false,
}: ResultPanelProps) {
  const hasManualInput = Boolean(input.ksicCode.trim() || input.ksicName.trim())
  const isComparisonMode = Boolean(compareZones && comparisonResults)
  const isMultiCodeMode = Boolean(multiCodeResults && multiCodeResults.length > 1)
  const screenInsight =
    !isComparisonMode && !isMultiCodeMode ? getEligibilityScreenInsight(input, result) : null
  const strategyPlan =
    !isComparisonMode && !isMultiCodeMode && result
      ? getEligibilityStrategyPlan(input, result)
      : null
  const expertInsights =
    !isComparisonMode && !isMultiCodeMode ? getExpertInsights(input, result) : []
  const convergencePlaybook =
    !isComparisonMode && !isMultiCodeMode
      ? getConvergenceReviewPlaybook(input, result)
      : null
  const guideEntry = input.ksicCode.trim()
    ? getGuideEntryByCode(input.ksicCode.trim())
    : null
  const [actionFeedback, setActionFeedback] = useState<string | null>(null)
  const [isCopyingLink, setIsCopyingLink] = useState(false)
  const [isCopyingSummary, setIsCopyingSummary] = useState(false)

  useEffect(() => {
    if (!actionFeedback) {
      return
    }

    const timeoutId = window.setTimeout(() => {
      setActionFeedback(null)
    }, 2400)

    return () => {
      window.clearTimeout(timeoutId)
    }
  }, [actionFeedback])

  async function handleCopyShareLink() {
    if (!onCopyShareLink || isCopyingLink) {
      return
    }

    setIsCopyingLink(true)

    try {
      await onCopyShareLink()
      setActionFeedback('공유 링크를 복사했습니다.')
    } catch {
      setActionFeedback('공유 링크 복사에 실패했습니다.')
    } finally {
      setIsCopyingLink(false)
    }
  }

  async function handleCopyResultSummary() {
    if (!onCopyResultSummary || isCopyingSummary) {
      return
    }

    setIsCopyingSummary(true)

    try {
      await onCopyResultSummary()
      setActionFeedback('판정 요약을 복사했습니다.')
    } catch {
      setActionFeedback('판정 요약 복사에 실패했습니다.')
    } finally {
      setIsCopyingSummary(false)
    }
  }

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
              선택한 업종과 현재 설정 기준으로 입주 가능성과 준비 포인트를 함께 보여드립니다.
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
            <Button
              variant="secondary"
              size="sm"
              className="w-full whitespace-nowrap sm:w-auto"
              onClick={onAdjust}
            >
              조건 다시 수정
            </Button>
          </div>
        ) : null}
      </CardHeader>
      <CardContent className={embedded ? 'p-0 pt-5 sm:pt-6' : undefined}>
        {status === 'idle' ? (
          <AsyncState
            variant="empty"
            title="업종을 고르면 결과가 여기에 바로 나옵니다."
            description="먼저 사업 설명을 입력하고 업종을 선택해 주세요. 직접 코드를 넣었다면 아래 버튼으로 바로 확인할 수 있습니다."
            actions={
              hasManualInput ? (
                <Button onClick={onEvaluate}>
                  {compareZones ? '두 구역 비교 판정 보기' : '현재 설정으로 결과 보기'}
                </Button>
              ) : undefined
            }
          />
        ) : null}

        {status === 'loading' ? (
          <AsyncState
            variant="loading"
            title={
              compareZones
                ? '두 구역 비교 결과를 계산하고 있습니다.'
                : '입주 가능 여부를 확인하고 있습니다.'
            }
            description={
              compareZones
                ? '지식산업센터와 산업시설구역 결과를 함께 정리하는 중입니다.'
                : '결과와 함께 확인할 내용을 정리하는 중입니다.'
            }
          />
        ) : null}

        {status === 'error' ? (
          <AsyncState
            variant="error"
            title="판정 중 오류가 발생했습니다."
            description={error ?? '잠시 후 다시 시도해 주세요.'}
            actions={
              <Button variant="secondary" onClick={onEvaluate}>
                다시 시도
              </Button>
            }
          />
        ) : null}

        {status === 'ready' && result ? (
          <div className="space-y-5 sm:space-y-6">
            <section className="rounded-[22px] border border-[var(--border-accent-strong)] bg-[var(--surface-strong)] p-5 shadow-[var(--shadow-md)] sm:rounded-[24px] sm:p-6">
              <div className="flex flex-wrap items-center gap-2">
                {isComparisonMode ? (
                  <Badge variant="muted">비교 모드</Badge>
                ) : isMultiCodeMode ? (
                  <Badge variant="muted">복수 코드</Badge>
                ) : (
                  <Badge variant={getBadgeVariant(result.verdict)}>
                    {formatVerdictLabel(result.verdict)}
                  </Badge>
                )}
                {isComparisonMode ? (
                  <Badge variant="muted">두 구역 동시 비교</Badge>
                ) : (
                  <Badge variant="muted">{zoneTypeLabels[input.zoneType]}</Badge>
                )}
                {isMultiCodeMode && multiCodeResults ? (
                  <Badge variant="muted">총 {multiCodeResults.length}개 코드</Badge>
                ) : input.ksicCode.trim() ? (
                  <Badge variant="muted">{input.ksicCode.trim()}</Badge>
                ) : null}
              </div>
              <h3 className="mt-3 max-w-3xl font-display text-[1.55rem] font-semibold leading-[1.16] text-[var(--foreground)] sm:mt-4 sm:text-[2rem]">
                {isMultiCodeMode && multiCodeResults
                  ? getMultiCodeHeadline(multiCodeResults, Boolean(compareZones))
                  : isComparisonMode
                  ? '지식산업센터와 산업시설구역을 한 번에 비교했습니다.'
                  : result.title}
              </h3>
              <p className="mt-3 max-w-[42rem] text-[15px] leading-7 text-[var(--foreground-muted)]">
                {isMultiCodeMode && multiCodeResults
                  ? getMultiCodeSupportCopy(input, multiCodeResults, Boolean(compareZones))
                  : isComparisonMode && comparisonResults
                  ? getComparisonSupportCopy(comparisonResults)
                  : result.summary}
              </p>
              <ActionButtons
                onCopyShareLink={onCopyShareLink}
                onCopyResultSummary={onCopyResultSummary}
                onPrintResult={onPrintResult}
                onCopyShare={handleCopyShareLink}
                onCopySummary={handleCopyResultSummary}
                isCopyingLink={isCopyingLink}
                isCopyingSummary={isCopyingSummary}
              />
              {actionFeedback ? (
                <p className="mt-3 text-sm font-medium text-[var(--accent-strong)]">
                  {actionFeedback}
                </p>
              ) : null}
              {isMultiCodeMode && multiCodeResults ? (
                <section className="mt-4 rounded-[20px] border border-[var(--border)] bg-[var(--surface-soft)] p-4 shadow-[var(--shadow-sm)]">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="muted">코드별 결과</Badge>
                    <Badge variant="muted">주업종 + 부업종</Badge>
                  </div>
                  <p className="mt-3 text-sm leading-7 text-[var(--foreground-muted)]">
                    사업자등록증에 여러 업종코드가 있을 때, 어떤 코드가 더 유리하고 어떤
                    코드가 추가 확인이 필요한지 이 화면에서 바로 읽을 수 있게 정리했습니다.
                  </p>
                </section>
              ) : null}
              {isComparisonMode && comparisonResults && !isMultiCodeMode ? (
                <div className="mt-4 grid gap-3 md:grid-cols-2">
                  {comparisonZoneOrder.map((zoneType) => {
                    const zoneResult = comparisonResults[zoneType]

                    return (
                      <div
                        key={zoneType}
                        className="rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] px-4 py-4 shadow-[var(--shadow-sm)]"
                      >
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge variant="muted">{zoneTypeLabels[zoneType]}</Badge>
                          <Badge variant={getBadgeVariant(zoneResult.verdict)}>
                            {formatVerdictLabel(zoneResult.verdict)}
                          </Badge>
                        </div>
                        <div className="mt-3 text-sm font-semibold leading-6 text-[var(--foreground)]">
                          {zoneResult.title}
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : result.matchedRules.length > 0 ? (
                <div className="mt-4 flex flex-wrap gap-2">
                  {result.matchedRules.map((rule) => (
                    <Badge key={rule}>{rule}</Badge>
                  ))}
                </div>
              ) : null}
            </section>

            {isMultiCodeMode && multiCodeResults ? (
              <>
                <section className="grid gap-4 xl:grid-cols-2">
                  {multiCodeResults.map((entry) => (
                    <article
                      key={entry.id}
                      className="rounded-[22px] border border-[var(--border)] bg-[var(--surface-strong)] p-5 shadow-[var(--shadow-sm)] sm:rounded-[24px] sm:p-6"
                    >
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge variant="muted">{entry.label}</Badge>
                        {entry.ksicCode.trim() ? (
                          <Badge variant="muted">{entry.ksicCode.trim()}</Badge>
                        ) : null}
                        {!compareZones ? (
                          <Badge variant={getBadgeVariant(entry.result.verdict)}>
                            {formatVerdictLabel(entry.result.verdict)}
                          </Badge>
                        ) : (
                          <Badge variant="muted">두 구역 비교</Badge>
                        )}
                      </div>
                      <h4 className="mt-4 font-display text-xl font-semibold leading-[1.2] text-[var(--foreground)]">
                        {getCodeDisplayText(entry)}
                      </h4>
                      <p className="mt-3 text-sm leading-7 text-[var(--foreground-muted)]">
                        {compareZones
                          ? '지식산업센터와 산업시설구역 결과를 같은 카드 안에서 바로 비교할 수 있습니다.'
                          : entry.result.summary}
                      </p>
                      {compareZones && entry.comparisonResults ? (
                        (() => {
                          const comparisonResultsForEntry = entry.comparisonResults

                          return (
                            <div className="mt-5 grid gap-3">
                              {comparisonZoneOrder.map((zoneType) => {
                                const zoneResult = comparisonResultsForEntry[zoneType]

                                return (
                                  <div
                                    key={`${entry.id}-${zoneType}`}
                                    className="rounded-2xl border border-[var(--border-soft)] bg-[var(--surface-soft)] p-4 shadow-[var(--shadow-sm)]"
                                  >
                                    <div className="flex flex-wrap items-center gap-2">
                                      <Badge variant="muted">{zoneTypeLabels[zoneType]}</Badge>
                                      <Badge variant={getBadgeVariant(zoneResult.verdict)}>
                                        {formatVerdictLabel(zoneResult.verdict)}
                                      </Badge>
                                    </div>
                                    <div className="mt-3 text-sm font-semibold leading-6 text-[var(--foreground)]">
                                      {zoneResult.title}
                                    </div>
                                    <p className="mt-2 text-sm leading-6 text-[var(--foreground-muted)]">
                                      {zoneResult.summary}
                                    </p>
                                    <div className="mt-4 grid gap-3">
                                      <div>
                                        <div className="flex items-center gap-2 text-sm font-medium text-[var(--foreground)]">
                                          <ArrowRight className="size-4 text-[var(--accent)]" />
                                          왜 이렇게 판단했나요?
                                        </div>
                                        <ul className="mt-3 space-y-3 text-sm leading-6 text-[var(--foreground-muted)]">
                                          {zoneResult.reasons.map((reason) => (
                                            <li
                                              key={`${entry.id}-${zoneType}-${reason}`}
                                              className="rounded-2xl border border-[var(--border-soft)] bg-[var(--surface-strong)] px-4 py-3.5 shadow-[var(--shadow-sm)]"
                                            >
                                              {reason}
                                            </li>
                                          ))}
                                        </ul>
                                      </div>
                                      <div>
                                        <div className="flex items-center gap-2 text-sm font-medium text-[var(--foreground)]">
                                          <FileStack className="size-4 text-[var(--accent)]" />
                                          다음에 확인할 것
                                        </div>
                                        <ul className="mt-3 space-y-3 text-sm leading-6 text-[var(--foreground-muted)]">
                                          {zoneResult.requiredActions.map((action) => (
                                            <li
                                              key={`${entry.id}-${zoneType}-${action}`}
                                              className="rounded-2xl border border-[var(--warning-border)] bg-[var(--warning-bg)] px-4 py-3.5 shadow-[var(--shadow-sm)]"
                                            >
                                              {action}
                                            </li>
                                          ))}
                                        </ul>
                                      </div>
                                    </div>
                                  </div>
                                )
                              })}
                            </div>
                          )
                        })()
                      ) : (
                        <>
                          {entry.result.matchedRules.length > 0 ? (
                            <div className="mt-4 flex flex-wrap gap-2">
                              {entry.result.matchedRules.map((rule) => (
                                <Badge key={`${entry.id}-${rule}`}>{rule}</Badge>
                              ))}
                            </div>
                          ) : null}
                          <div className="mt-5 grid gap-4">
                            <div>
                              <div className="flex items-center gap-2 text-sm font-medium text-[var(--foreground)]">
                                <ArrowRight className="size-4 text-[var(--accent)]" />
                                왜 이렇게 판단했나요?
                              </div>
                              <ul className="mt-3 space-y-3 text-sm leading-6 text-[var(--foreground-muted)]">
                                {entry.result.reasons.map((reason) => (
                                  <li
                                    key={`${entry.id}-${reason}`}
                                    className="rounded-2xl border border-[var(--border-soft)] bg-[var(--surface-soft)] px-4 py-3.5 shadow-[var(--shadow-sm)]"
                                  >
                                    {reason}
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <div className="flex items-center gap-2 text-sm font-medium text-[var(--foreground)]">
                                <FileStack className="size-4 text-[var(--accent)]" />
                                다음에 확인할 것
                              </div>
                              <ul className="mt-3 space-y-3 text-sm leading-6 text-[var(--foreground-muted)]">
                                {entry.result.requiredActions.map((action) => (
                                  <li
                                    key={`${entry.id}-${action}`}
                                    className="rounded-2xl border border-[var(--warning-border)] bg-[var(--warning-bg)] px-4 py-3.5 shadow-[var(--shadow-sm)]"
                                  >
                                    {action}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </>
                      )}
                    </article>
                  ))}
                </section>
              </>
            ) : isComparisonMode && comparisonResults ? (
              <>
                <section className="rounded-[22px] border border-[var(--border)] bg-[var(--surface-strong)] p-5 shadow-[var(--shadow-sm)] sm:rounded-[24px] sm:p-6">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="muted">비교 해설</Badge>
                  </div>
                  <h4 className="mt-4 font-display text-lg font-semibold text-[var(--foreground)]">
                    {getComparisonHeadline(comparisonResults)}
                  </h4>
                  <p className="mt-3 text-sm leading-7 text-[var(--foreground-muted)]">
                    같은 업종코드를 두 구역 기준으로 동시에 계산했습니다. 고객에게는 어느
                    구역이 더 유리한지, 어떤 구역에서 추가 확인이 더 필요한지 이 화면 그대로
                    설명하면 됩니다.
                  </p>
                </section>

                <section className="grid gap-4 xl:grid-cols-2">
                  {comparisonZoneOrder.map((zoneType) => {
                    const zoneResult = comparisonResults[zoneType]

                    return (
                      <article
                        key={zoneType}
                        className="rounded-[22px] border border-[var(--border)] bg-[var(--surface-strong)] p-5 shadow-[var(--shadow-sm)] sm:rounded-[24px] sm:p-6"
                      >
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge variant="muted">{zoneTypeLabels[zoneType]}</Badge>
                          <Badge variant={getBadgeVariant(zoneResult.verdict)}>
                            {formatVerdictLabel(zoneResult.verdict)}
                          </Badge>
                        </div>
                        <h4 className="mt-4 font-display text-xl font-semibold leading-[1.2] text-[var(--foreground)]">
                          {zoneResult.title}
                        </h4>
                        <p className="mt-3 text-sm leading-7 text-[var(--foreground-muted)]">
                          {zoneResult.summary}
                        </p>
                        {zoneResult.matchedRules.length > 0 ? (
                          <div className="mt-4 flex flex-wrap gap-2">
                            {zoneResult.matchedRules.map((rule) => (
                              <Badge key={`${zoneType}-${rule}`}>{rule}</Badge>
                            ))}
                          </div>
                        ) : null}
                        <div className="mt-5 grid gap-4">
                          <div>
                            <div className="flex items-center gap-2 text-sm font-medium text-[var(--foreground)]">
                              <ArrowRight className="size-4 text-[var(--accent)]" />
                              왜 이렇게 판단했나요?
                            </div>
                            <ul className="mt-3 space-y-3 text-sm leading-6 text-[var(--foreground-muted)]">
                              {zoneResult.reasons.map((reason) => (
                                <li
                                  key={`${zoneType}-${reason}`}
                                  className="rounded-2xl border border-[var(--border-soft)] bg-[var(--surface-soft)] px-4 py-3.5 shadow-[var(--shadow-sm)]"
                                >
                                  {reason}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <div className="flex items-center gap-2 text-sm font-medium text-[var(--foreground)]">
                              <FileStack className="size-4 text-[var(--accent)]" />
                              다음에 확인할 것
                            </div>
                            <ul className="mt-3 space-y-3 text-sm leading-6 text-[var(--foreground-muted)]">
                              {zoneResult.requiredActions.map((action) => (
                                <li
                                  key={`${zoneType}-${action}`}
                                  className="rounded-2xl border border-[var(--warning-border)] bg-[var(--warning-bg)] px-4 py-3.5 shadow-[var(--shadow-sm)]"
                                >
                                  {action}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </article>
                    )
                  })}
                </section>
              </>
            ) : (
              <>
                {strategyPlan ? (
                  <section className="rounded-[22px] border border-[var(--border)] bg-[var(--surface-strong)] p-5 shadow-[var(--shadow-sm)] sm:rounded-[24px] sm:p-6">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant={getBadgeVariant(result.verdict)}>입주 전략 메모</Badge>
                      <Badge variant="muted">실제 영위 기준</Badge>
                    </div>
                    <h4 className="mt-4 max-w-3xl font-display text-lg font-semibold leading-[1.24] text-[var(--foreground)]">
                      {strategyPlan.headline}
                    </h4>
                    <div className="mt-4 grid gap-4 xl:grid-cols-2">
                      <div className="rounded-[20px] border border-[var(--border-soft)] bg-[var(--surface-soft)] p-4 shadow-[var(--shadow-sm)]">
                        <div className="text-sm font-semibold text-[var(--foreground)]">
                          이렇게 설명하면 좋습니다
                        </div>
                        <p className="mt-2 text-sm leading-6 text-[var(--foreground-muted)]">
                          {strategyPlan.recommendedBusinessAngle}
                        </p>
                      </div>
                      <div className="rounded-[20px] border border-[var(--border-soft)] bg-[var(--surface)] p-4 shadow-[var(--shadow-sm)]">
                        <div className="text-sm font-semibold text-[var(--foreground)]">
                          기대할 수 있는 입주 경로
                        </div>
                        <p className="mt-2 text-sm leading-6 text-[var(--foreground-muted)]">
                          {strategyPlan.benefitPath}
                        </p>
                      </div>
                    </div>
                    <div className="mt-4 grid gap-4 xl:grid-cols-3">
                      <section className="rounded-[20px] border border-[var(--border-soft)] bg-[var(--surface-soft)] p-4 shadow-[var(--shadow-sm)]">
                        <div className="flex items-center gap-2 text-sm font-medium text-[var(--foreground)]">
                          <FileStack className="size-4 text-[var(--accent)]" />
                          필요 증빙
                        </div>
                        <ul className="mt-3 space-y-2 text-sm leading-6 text-[var(--foreground-muted)]">
                          {strategyPlan.requiredProofs.map((item) => (
                            <li key={`proof-${item}`}>{item}</li>
                          ))}
                        </ul>
                      </section>
                      <section className="rounded-[20px] border border-[var(--warning-border)] bg-[var(--warning-bg)] p-4 shadow-[var(--shadow-sm)]">
                        <div className="flex items-center gap-2 text-sm font-medium text-[var(--foreground)]">
                          <ArrowRight className="size-4 text-[var(--accent)]" />
                          주의사항
                        </div>
                        <ul className="mt-3 space-y-2 text-sm leading-6 text-[var(--foreground-muted)]">
                          {strategyPlan.riskNotes.map((item) => (
                            <li key={`risk-${item}`}>{item}</li>
                          ))}
                        </ul>
                      </section>
                      <section className="rounded-[20px] border border-[var(--border-soft)] bg-[var(--surface)] p-4 shadow-[var(--shadow-sm)]">
                        <div className="flex items-center gap-2 text-sm font-medium text-[var(--foreground)]">
                          <ArrowRight className="size-4 text-[var(--accent)]" />
                          추천 다음 행동
                        </div>
                        <ul className="mt-3 space-y-2 text-sm leading-6 text-[var(--foreground-muted)]">
                          {strategyPlan.nextActions.map((item) => (
                            <li key={`next-${item}`}>{item}</li>
                          ))}
                        </ul>
                      </section>
                    </div>
                  </section>
                ) : null}

                {screenInsight ? (
                  <section className="rounded-[22px] border border-[var(--border)] bg-[var(--surface-strong)] p-5 shadow-[var(--shadow-sm)] sm:rounded-[24px] sm:p-6">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant={screenInsight.tone}>업종코드 상세 해설</Badge>
                      <Badge variant="muted">쉽게 풀어보기</Badge>
                    </div>
                    <h4 className="mt-4 max-w-3xl font-display text-lg font-semibold leading-[1.24] text-[var(--foreground)]">
                      {screenInsight.title}
                    </h4>
                    <div className="mt-4 grid gap-3">
                      {screenInsight.fields.map((field) => (
                        <div
                          key={`${field.label}-${field.value}`}
                          className="rounded-2xl border border-[var(--border-soft)] bg-[var(--surface-soft)] px-4 py-3.5 shadow-[var(--shadow-sm)]"
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
                            className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3.5 text-sm leading-7 text-[var(--foreground-muted)] shadow-[var(--shadow-sm)]"
                          >
                            {bullet}
                          </div>
                        ))}
                      </div>
                    ) : null}
                  </section>
                ) : null}

                {expertInsights.length > 0 ? (
                  <section className="space-y-4 rounded-[22px] border border-[var(--border)] bg-[var(--surface-strong)] p-5 shadow-[var(--shadow-sm)] sm:rounded-[24px] sm:p-6">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant="muted">전문가 인사이트</Badge>
                      <Badge variant="muted">도움말</Badge>
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
                  <section className="rounded-[22px] border border-[var(--border)] bg-[var(--surface-strong)] p-5 shadow-[var(--shadow-sm)] sm:rounded-[24px] sm:p-6">
                    <div className="flex items-center gap-2 text-sm font-medium text-[var(--foreground)]">
                      <ArrowRight className="size-4 text-[var(--accent)]" />
                      왜 이렇게 판단했나요?
                    </div>
                    <ul className="mt-4 space-y-3 text-sm leading-6 text-[var(--foreground-muted)]">
                      {result.reasons.map((reason) => (
                        <li
                          key={reason}
                          className="rounded-2xl border border-[var(--border-soft)] bg-[var(--surface-soft)] px-4 py-3.5 shadow-[var(--shadow-sm)]"
                        >
                          {reason}
                        </li>
                      ))}
                    </ul>
                  </section>

                  <section className="rounded-[22px] border border-[var(--border)] bg-[var(--surface-strong)] p-5 shadow-[var(--shadow-sm)] sm:rounded-[24px] sm:p-6">
                    <div className="flex items-center gap-2 text-sm font-medium text-[var(--foreground)]">
                      <FileStack className="size-4 text-[var(--accent)]" />
                      판정 근거 기준 다음에 확인할 것
                    </div>
                    <ul className="mt-4 space-y-3 text-sm leading-6 text-[var(--foreground-muted)]">
                      {result.requiredActions.map((action) => (
                        <li
                          key={action}
                          className="rounded-2xl border border-[var(--warning-border)] bg-[var(--warning-bg)] px-4 py-3.5 shadow-[var(--shadow-sm)]"
                        >
                          {action}
                        </li>
                      ))}
                    </ul>
                  </section>
                </div>
              </>
            )}

            {guideEntry && onOpenGuide ? (
              <section className="rounded-[22px] border border-[var(--border)] bg-[var(--surface-strong)] p-5 shadow-[var(--shadow-sm)] sm:rounded-[24px] sm:p-6">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="muted">연관 가이드</Badge>
                  <Badge variant="muted">{guideEntry.code}</Badge>
                </div>
                <h4 className="mt-4 font-display text-lg font-semibold text-[var(--foreground)]">
                  이 업종 기준 설명을 문서형 가이드로 다시 읽을 수 있습니다
                </h4>
                <p className="mt-3 text-sm leading-6 text-[var(--foreground-muted)]">
                  결과를 더 길게 읽고 싶을 때 참고할 수 있는 가이드입니다.
                </p>
                <div className="mt-4">
                  <Button
                    variant="secondary"
                    className="w-full justify-center sm:w-auto"
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

              <LegalFootnotes
                legalBases={
                  isMultiCodeMode && multiCodeResults
                    ? getCombinedLegalBasesForMultiCode(
                        multiCodeResults,
                      Boolean(compareZones),
                    )
                  : isComparisonMode && comparisonResults
                      ? getCombinedLegalBases(comparisonResults)
                      : result.legalBases
                }
                onOpenLibraryEntry={onOpenLibraryEntry}
                onOpenLibraryBasis={onOpenLibraryBasis}
              />
          </div>
        ) : null}
      </CardContent>
    </Card>
  )
}
