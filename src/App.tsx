import { lazy, Suspense, useEffect, useState } from 'react'
import {
  ArrowRight,
  BookOpenText,
  Building2,
  CheckCircle2,
  ChevronDown,
  ExternalLink,
  FileSearch,
  LibraryBig,
  Menu,
  X,
} from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { SkeletonCard } from '@/components/ui/skeleton'

const CodeDirectoryPage = lazy(() =>
  import('@/features/eligibility/components/code-directory-page').then((m) => ({
    default: m.CodeDirectoryPage,
  })),
)
const GuidePage = lazy(() =>
  import('@/features/guides/components/guide-page').then((m) => ({
    default: m.GuidePage,
  })),
)
const LegalLibraryPage = lazy(() =>
  import('@/features/library/components/legal-library-page').then((m) => ({
    default: m.LegalLibraryPage,
  })),
)
const UpdateLogPage = lazy(() =>
  import('@/features/updates/components/update-log-page').then((m) => ({
    default: m.UpdateLogPage,
  })),
)
import { EligibilityForm } from '@/features/eligibility/components/eligibility-form'
import { IndustryDiscoveryPanel } from '@/features/eligibility/components/industry-discovery-panel'
import { ResultPanel } from '@/features/eligibility/components/result-panel'
import { RulebookTabs } from '@/features/eligibility/components/rulebook-tabs'
import {
  getFeaturedGuideEntries,
  getGuideEntryByCode,
} from '@/features/guides/data/guide-catalog'
import { getRecentUpdateLogEntries } from '@/features/updates/data/update-log'
import {
  MAGOK_CODE_DIRECTORY_TOTAL_COUNT,
  getZoneVerdictCounts,
} from '@/features/eligibility/data/magok-code-directory'
import type {
  DirectoryZoneType,
  MagokCodeDirectoryEntry,
} from '@/features/eligibility/types'
import {
  type EligibilityStep,
  useEligibilityStore,
} from '@/store/eligibility-store'
import { formatKoreanDate, formatNumber } from '@/utils/format'

type AppView = 'home' | 'directory' | 'library' | 'updates' | 'guide'
type DiscoverScreen = 'compose' | 'results'

const introSteps = [
  {
    step: '1',
    mobileTitle: '한 줄 입력',
    title: '하고 싶은 일을 적습니다',
    description:
      '업종코드를 몰라도 됩니다. 광고대행업처럼 한 줄로 적거나 사업자등록증의 업태·종목을 붙여 넣으면 됩니다.',
  },
  {
    step: '2',
    mobileTitle: '코드 추천',
    title: '가장 가까운 코드를 추천받습니다',
    description:
      '정확한 코드가 있으면 바로 보여주고, 없으면 현재 구역에서 검토 가능한 비슷한 코드를 먼저 추천합니다.',
  },
  {
    step: '3',
    mobileTitle: '결과 확인',
    title: '마곡에서 가능한지 확인합니다',
    description:
      '선택한 코드 기준으로 가능, 조건부 가능, 심의 필요, 추가 확인, 불가를 이유와 함께 보여줍니다.',
  },
]

const wizardSteps: Array<{
  id: EligibilityStep
  badge: string
  shortTitle: string
  title: string
  description: string
}> = [
  {
    id: 'discover',
    badge: '1단계',
    shortTitle: '추천',
    title: '업종코드 추천받기',
    description:
      '하고 싶은 일을 적으면 마곡에서 먼저 검토할 만한 코드를 추천합니다.',
  },
  {
    id: 'adjust',
    badge: '2단계',
    shortTitle: '보정',
    title: '선택한 코드 확인하기',
    description:
      '구역과 예외 조건만 필요한 만큼 손보고 결과 보기로 넘어가면 됩니다.',
  },
  {
    id: 'result',
    badge: '3단계',
    shortTitle: '결과',
    title: '입주 가능성 보기',
    description:
      '선택한 코드가 왜 가능 또는 불가인지, 어떤 조문을 봐야 하는지 쉽게 설명합니다.',
  },
]

const promisePoints = [
  '찾고 싶은 업종코드를 한 번에 찾아볼 수 있습니다.',
  '업종코드를 몰라도 쉬운 말로 검색할 수 있습니다.',
  '애매한 업종은 무리하게 가능으로 찍지 않고 더 확인할 점을 함께 보여줍니다.',
]

const coupangDisclosureText =
  '이 게시물은 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받습니다.'

const affiliateActions = [
  {
    title: '참고 상품 모음 보기',
    href: 'https://link.coupang.com/a/d7nWco',
    variant: 'secondary' as const,
  },
  {
    title: '추가 참고 링크 보기',
    href: 'https://link.coupang.com/a/d7n7ta',
    variant: 'outline' as const,
  },
]

const affiliateWidgets = [
  {
    src: 'https://coupa.ng/clX5tE',
    title: '쿠팡 파트너스 추천 위젯 모바일기기',
    badge: '모바일 기기',
    headline: '핸드폰과 태블릿',
  },
  {
    src: 'https://coupa.ng/clX3qg',
    title: '쿠팡 파트너스 추천 위젯 생수',
    badge: '탕비실 추천',
    headline: '생수와 비품',
  },
  {
    src: 'https://coupa.ng/clX5vK',
    title: '쿠팡 파트너스 추천 위젯 업무기기',
    badge: '업무 기기',
    headline: '디지털 업무 기기',
  },
  {
    src: 'https://coupa.ng/clX5EI',
    title: '쿠팡 파트너스 추천 위젯 소모품',
    badge: '사무 소모품',
    headline: '복사용지와 소모품',
  },
]

const footerFacts = [
  '운영: Loopin Lab',
  '문의: contact.loopinlab@gmail.com',
  '활동 페이지: https://loopincode.com',
]

function getHashState(hash: string): { view: AppView; guideCode: string | null } {
  if (hash.startsWith('#guides/')) {
    const guideCode = decodeURIComponent(hash.slice('#guides/'.length)).trim()

    return {
      view: 'guide',
      guideCode: guideCode || null,
    }
  }

  if (hash.startsWith('#directory')) {
    return { view: 'directory', guideCode: null }
  }

  if (hash.startsWith('#library')) {
    return { view: 'library', guideCode: null }
  }

  if (hash.startsWith('#updates')) {
    return { view: 'updates', guideCode: null }
  }

  return { view: 'home', guideCode: null }
}

function scrollToSection(id: string) {
  window.requestAnimationFrame(() => {
    const element = document.getElementById(id)

    if (element && typeof element.scrollIntoView === 'function') {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
      return
    }

    window.scrollTo({ top: 0, behavior: 'smooth' })
  })
}

function getReviewableCount(counts: ReturnType<typeof getZoneVerdictCounts>) {
  return (
    counts.eligible +
    counts.conditional +
    counts.reviewRequired +
    counts.insufficient
  )
}

function getZoneLabel(zoneType: DirectoryZoneType) {
  return zoneType === 'industrialFacility' ? '산업시설구역' : '지식산업센터'
}

function HomeSections({
  input,
  status,
  result,
  error,
  industryQuery,
  industrySuggestions,
  discoveryStatus,
  discoveryError,
  currentStep,
  setField,
  setFlag,
  setCurrentStep,
  setIndustryQuery,
  discoverIndustry,
  applyIndustrySuggestion,
  evaluate,
  reset,
  onOpenDirectory,
  onOpenLibrary,
  onOpenUpdates,
  onOpenGuide,
}: {
  input: ReturnType<typeof useEligibilityStore.getState>['input']
  status: ReturnType<typeof useEligibilityStore.getState>['status']
  result: ReturnType<typeof useEligibilityStore.getState>['result']
  error: ReturnType<typeof useEligibilityStore.getState>['error']
  industryQuery: ReturnType<typeof useEligibilityStore.getState>['industryQuery']
  industrySuggestions: ReturnType<typeof useEligibilityStore.getState>['industrySuggestions']
  discoveryStatus: ReturnType<typeof useEligibilityStore.getState>['discoveryStatus']
  discoveryError: ReturnType<typeof useEligibilityStore.getState>['discoveryError']
  currentStep: ReturnType<typeof useEligibilityStore.getState>['currentStep']
  setField: ReturnType<typeof useEligibilityStore.getState>['setField']
  setFlag: ReturnType<typeof useEligibilityStore.getState>['setFlag']
  setCurrentStep: ReturnType<typeof useEligibilityStore.getState>['setCurrentStep']
  setIndustryQuery: ReturnType<typeof useEligibilityStore.getState>['setIndustryQuery']
  discoverIndustry: ReturnType<typeof useEligibilityStore.getState>['discoverIndustry']
  applyIndustrySuggestion: ReturnType<typeof useEligibilityStore.getState>['applyIndustrySuggestion']
  evaluate: ReturnType<typeof useEligibilityStore.getState>['evaluate']
  reset: ReturnType<typeof useEligibilityStore.getState>['reset']
  onOpenDirectory: () => void
  onOpenLibrary: () => void
  onOpenUpdates: () => void
  onOpenGuide: (code: string) => void
}) {
  const canShowResult = Boolean(status === 'ready' && result)
  const canStayOnResultStep =
    status === 'loading' || status === 'error' || canShowResult
  const safeCurrentStep =
    currentStep === 'result' && !canStayOnResultStep ? 'adjust' : currentStep
  const [isAffiliateExpanded, setIsAffiliateExpanded] = useState(false)
  const [discoverScreen, setDiscoverScreen] = useState<DiscoverScreen>('compose')
  const [isMobileViewport, setIsMobileViewport] = useState(false)
  const [isMobileFinderFocused, setIsMobileFinderFocused] = useState(false)
  const activeDiscoverScreen =
    discoveryStatus === 'idle' &&
    industrySuggestions.length === 0 &&
    !industryQuery.trim()
      ? 'compose'
      : discoverScreen
  const currentWizardStep =
    wizardSteps.find((step) => step.id === safeCurrentStep) ?? wizardSteps[0]
  const currentWizardIndex = wizardSteps.findIndex(
    (step) => step.id === safeCurrentStep,
  )
  const currentWizardBadge =
    safeCurrentStep === 'discover' && activeDiscoverScreen === 'results'
      ? '1단계 · 추천 결과'
      : currentWizardStep.badge
  const currentWizardTitle =
    safeCurrentStep === 'discover' && activeDiscoverScreen === 'results'
      ? '추천 결과 확인하기'
      : currentWizardStep.title
  const currentWizardDescription =
    safeCurrentStep === 'discover' && activeDiscoverScreen === 'results'
      ? '추천된 코드 중 하나를 고르면 다음 화면으로 넘어갑니다.'
      : currentWizardStep.description
  const currentWizardHint =
    safeCurrentStep === 'discover'
      ? activeDiscoverScreen === 'results'
        ? '코드를 고르면 바로 다음 단계로 넘어갑니다.'
        : '한 줄로 적고 추천 코드를 바로 받아보세요.'
      : safeCurrentStep === 'adjust'
        ? '필요한 조건만 보고 결과 보기로 넘어가면 됩니다.'
        : '판정 결과와 이유를 한 화면에서 바로 읽습니다.'
  const panelTransitionKey =
    safeCurrentStep === 'discover'
      ? `discover-${activeDiscoverScreen}`
      : safeCurrentStep

  const knowledgeCounts = getZoneVerdictCounts('knowledgeIndustryCenter')
  const industrialCounts = getZoneVerdictCounts('industrialFacility')
  const recentUpdates = getRecentUpdateLogEntries(3)
  const featuredGuides = getFeaturedGuideEntries(3)
  const canOpenAdjustStep = Boolean(input.ksicCode.trim() || input.ksicName.trim())
  const canOpenResultStep = canStayOnResultStep
  const isMobileWizardFocused = isMobileViewport && isMobileFinderFocused

  const introFacts = [
    {
      label: '전체 전수 코드',
      value: `${formatNumber(MAGOK_CODE_DIRECTORY_TOTAL_COUNT)}개`,
      note: '전체 코드를 한 번에 살펴볼 수 있습니다',
      tone: 'hero',
    },
    {
      label: '지식산업센터 검토 가능',
      value: `${formatNumber(getReviewableCount(knowledgeCounts))}개`,
      note: '먼저 확인해볼 만한 코드를 모아 보여드립니다',
      tone: 'support',
    },
    {
      label: '산업시설구역 검토 가능',
      value: `${formatNumber(getReviewableCount(industrialCounts))}개`,
      note: '산업시설구역에서 먼저 볼 코드를 정리했습니다',
      tone: 'support',
    },
  ] as const

  const dictionaryPreviewCards = [
    {
      title: '지식산업센터',
      count: `${formatNumber(getReviewableCount(knowledgeCounts))}개`,
      note: '먼저 살펴볼 만한 코드를 빠르게 둘러볼 수 있습니다.',
      tone: 'strong',
    },
    {
      title: '산업시설구역',
      count: `${formatNumber(getReviewableCount(industrialCounts))}개`,
      note: '산업시설구역에서 볼 수 있는 코드를 한 번에 찾기 좋습니다.',
      tone: 'soft',
    },
    {
      title: '쉽게 검색',
      count: '자유 문장 가능',
      note: '하고 싶은 일을 적으면 가까운 코드를 먼저 추천합니다.',
      tone: 'soft',
    },
  ] as const

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
      return
    }

    const mediaQuery = window.matchMedia('(max-width: 639px)')
    const syncViewport = () => {
      setIsMobileViewport(mediaQuery.matches)
    }

    syncViewport()

    if (typeof mediaQuery.addEventListener === 'function') {
      mediaQuery.addEventListener('change', syncViewport)
      return () => mediaQuery.removeEventListener('change', syncViewport)
    }

    mediaQuery.addListener(syncViewport)
    return () => mediaQuery.removeListener(syncViewport)
  }, [])

  useEffect(() => {
    if (!isMobileWizardFocused) {
      return
    }

    scrollToSection('finder')
  }, [activeDiscoverScreen, isMobileWizardFocused, safeCurrentStep])

  function handleDiscoverSearch() {
    if (isMobileViewport) {
      setIsMobileFinderFocused(true)
    }

    setDiscoverScreen('results')
    void discoverIndustry()
  }

  function handleBackToDiscoverSearch() {
    setDiscoverScreen('compose')
  }

  function handleWizardStepSelect(step: EligibilityStep) {
    if (isMobileViewport) {
      setIsMobileFinderFocused(true)
    }

    if (step === 'discover') {
      setCurrentStep('discover')
      return
    }

    if (step === 'adjust') {
      if (!canOpenAdjustStep) {
        return
      }

      setCurrentStep('adjust')
      return
    }

    if (!canOpenResultStep) {
      return
    }

    setCurrentStep('result')
  }

  function runQuickSearch(value: string) {
    if (isMobileViewport) {
      setIsMobileFinderFocused(true)
    }

    setIndustryQuery(value)
    setDiscoverScreen('results')
    void discoverIndustry()
  }

  function handleSuggestionSelect(
    suggestion: ReturnType<typeof useEligibilityStore.getState>['industrySuggestions'][number],
  ) {
    if (isMobileViewport) {
      setIsMobileFinderFocused(true)
    }

    void applyIndustrySuggestion(suggestion)
  }

  function handleEvaluateStep() {
    if (isMobileViewport) {
      setIsMobileFinderFocused(true)
    }

    void evaluate()
  }

  function handleContinueManualStep() {
    if (isMobileViewport) {
      setIsMobileFinderFocused(true)
    }

    setCurrentStep('adjust')
  }

  function handleFinderEntry() {
    if (isMobileViewport) {
      setIsMobileFinderFocused(true)
    }

    scrollToSection('finder')
  }

  function handleExitMobileWizardFocus() {
    setIsMobileFinderFocused(false)
    scrollToSection('top')
  }

  return (
    <>
      {!isMobileWizardFocused ? (
        <>
          <section className="grid gap-4 lg:grid-cols-[minmax(0,1.14fr)_320px] lg:items-stretch lg:gap-6">
            <div className="flex h-full flex-col rounded-[30px] border border-[var(--border-accent-strong)] bg-[var(--surface-strong)] px-5 py-6 shadow-[var(--shadow-xl)] sm:rounded-[38px] sm:px-8 sm:py-8 lg:px-10 lg:py-10">
              <Badge variant="muted" className="w-fit">마곡 일반산업단지 전용</Badge>
              <h1 className="mt-4 max-w-4xl font-display text-[2.35rem] font-semibold leading-[1.02] tracking-[-0.06em] text-[var(--foreground)] sm:mt-5 sm:text-5xl lg:text-6xl">
                입주 가능한 업종코드를
                <br />
                쉽게 찾고
                <br />
                바로 확인합니다
              </h1>
              <p className="mt-4 max-w-3xl text-sm leading-7 text-[var(--foreground-muted)] sm:mt-5 sm:text-lg sm:leading-8">
                업종코드를 몰라도 괜찮습니다. 하고 싶은 일을 적거나 사업자등록증의
                업태·종목을 넣으면, 마곡에서 먼저 검토할 만한 코드를 추천하고 입주 가능성까지
                이어서 보여드립니다.
              </p>

              <div className="mt-6 flex flex-col gap-2 sm:mt-7 sm:flex-row sm:flex-wrap sm:gap-3">
                <Button
                  size="lg"
                  onClick={handleFinderEntry}
                  className="w-full justify-center whitespace-nowrap sm:w-auto"
                >
                  코드 추천받기
                  <ArrowRight className="size-4" />
                </Button>
                <Button
                  variant="secondary"
                  size="lg"
                  onClick={onOpenDirectory}
                  className="w-full justify-center whitespace-nowrap sm:w-auto"
                >
                  가능 코드 전체 보기
                </Button>
              </div>

              <div className="mt-6 hidden gap-3 sm:mt-7 sm:grid sm:grid-cols-3">
                {introFacts.map((fact) => (
                  <div
                    key={fact.label}
                      className={`rounded-[22px] border px-4 py-4 sm:rounded-[24px] ${
                      fact.tone === 'hero'
                        ? 'border-[var(--border-accent-strong)] bg-[var(--surface-strong)] shadow-[var(--shadow-md)]'
                        : 'border-[var(--border-soft)] bg-[var(--surface-strong)] shadow-[var(--shadow-sm)]'
                    }`}
                  >
                    <div className="text-xs font-medium text-[var(--foreground-subtle)]">
                      {fact.label}
                    </div>
                    <div
                      className={`mt-2 font-semibold text-[var(--foreground)] ${
                        fact.tone === 'hero' ? 'text-2xl' : 'text-xl'
                      }`}
                    >
                      {fact.value}
                    </div>
                    <div className="mt-1 text-xs leading-5 text-[var(--foreground-subtle)]">
                      {fact.note}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 grid grid-cols-3 gap-2 lg:hidden">
                {introSteps.map((item) => (
                  <div
                    key={item.step}
                    className="rounded-[18px] border border-[var(--border-soft)] bg-[var(--surface-strong)] px-3 py-3 shadow-[var(--shadow-sm)]"
                  >
                    <div className="text-[11px] font-semibold tracking-[0.04em] text-[var(--foreground-subtle)]">
                      {item.step}단계
                    </div>
                    <div className="mt-1 text-sm font-semibold leading-5 text-[var(--foreground)]">
                      {item.mobileTitle}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Card className="hidden h-full border-[var(--border-soft)] bg-[var(--surface-strong)] shadow-[var(--shadow-lg)] lg:block">
              <CardContent className="flex h-full flex-col space-y-5 p-6">
                <div className="inline-flex size-12 items-center justify-center rounded-2xl bg-[var(--accent-soft)] text-[var(--accent-strong)] shadow-[var(--shadow-sm)]">
                  <FileSearch className="size-6" />
                </div>
                <div>
                  <h2 className="font-display text-2xl font-semibold text-[var(--foreground)]">
                    처음 오셨다면 이렇게 보세요
                  </h2>
                  <p className="mt-2 text-sm leading-7 text-[var(--foreground-muted)]">
                    먼저 쉽게 찾고, 필요할 때만 자세한 기준을 다시 보는 순서로 구성했습니다.
                  </p>
                </div>

                <div className="space-y-3">
                  {introSteps.map((item) => (
                    <div
                      key={item.step}
                      className="rounded-[22px] border border-[var(--border-soft)] bg-[var(--surface-strong)] px-4 py-4 shadow-[var(--shadow-sm)]"
                    >
                      <div className="flex items-center gap-3">
                        <div className="inline-flex size-8 items-center justify-center rounded-full bg-[var(--accent-soft)] text-sm font-semibold text-[var(--accent-strong)]">
                          {item.step}
                        </div>
                        <div className="text-sm font-semibold text-[var(--foreground)]">
                          {item.title}
                        </div>
                      </div>
                      <p className="mt-2 text-sm leading-6 text-[var(--foreground-muted)]">
                        {item.description}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-auto flex flex-wrap gap-2">
                  <Badge variant="muted">
                    시행령 기준일 {formatKoreanDate('2026-01-02')}
                  </Badge>
                  <Badge variant="muted">
                    관리기본계획 고시일 {formatKoreanDate('2025-10-30')}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </section>

          <section className="hidden gap-3 sm:grid md:grid-cols-3">
            {promisePoints.map((item) => (
              <div
                key={item}
                className="rounded-[24px] border border-[var(--border-soft)] bg-[var(--surface-strong)] px-5 py-5 shadow-[var(--shadow-sm)]"
              >
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-[var(--accent)]" />
                  <p className="text-sm leading-7 text-[var(--foreground-muted)]">{item}</p>
                </div>
              </div>
            ))}
          </section>
        </>
      ) : null}

      <section
        id="finder"
        aria-label="업종코드 분석 위저드"
        className={`${
          isMobileWizardFocused
            ? 'rounded-none border-0 bg-transparent p-0 shadow-none'
                : 'rounded-[24px] border border-[var(--border-accent)] bg-[var(--surface-strong)] p-3.5 shadow-[var(--shadow-xl)] sm:rounded-[36px] sm:p-8'
        }`}
      >
        {isMobileWizardFocused ? (
          <div className="mb-3 flex items-start justify-between gap-3 sm:mb-6 sm:hidden">
            <div className="min-w-0">
              <Badge variant="muted" className="w-fit">{currentWizardBadge}</Badge>
              <h2 className="mt-3 font-display text-[1.95rem] font-semibold leading-[1.02] text-[var(--foreground)]">
                {currentWizardTitle}
              </h2>
              <p className="mt-2 text-[13px] leading-5 text-[var(--foreground-subtle)]">
                {currentWizardHint}
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="shrink-0"
              onClick={handleExitMobileWizardFocus}
            >
              전체 보기
            </Button>
          </div>
        ) : (
          <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <Badge variant="muted" className="w-fit">쉬운 검색 홈</Badge>
              <h2 className="mt-3 font-display text-[1.8rem] font-semibold leading-[1.06] text-[var(--foreground)] sm:mt-4 sm:text-4xl">
                업종코드를 몰라도
                <br />
                바로 찾고 확인합니다
              </h2>
              <p className="mt-2 text-[13px] leading-5 text-[var(--foreground-subtle)] sm:hidden">
                {currentWizardHint}
              </p>
              <p className="mt-3 hidden max-w-3xl text-sm leading-7 text-[var(--foreground-muted)] sm:block">
                자유 문장, 사업자등록증 업태·종목, 실무 메모 모두 괜찮습니다.
                업종코드를 몰라도 검색할 수 있고, 추천된 코드로 바로 입주 가능 여부를 확인할
                수 있습니다.
              </p>
            </div>
                <div className="hidden rounded-[22px] border border-[var(--border)] bg-[var(--surface-strong)] px-4 py-3 text-sm leading-6 text-[var(--foreground-muted)] shadow-[var(--shadow-sm)] lg:block lg:max-w-sm">
              `내가 하는 일이 어떤 코드에 가까운지`, `그 코드가 마곡에서 가능한지`,
              `왜 그런지`, `더 확인해야 할 게 있는지` 순서로 보여줍니다.
            </div>
          </div>
        )}

        <div className={`${isMobileWizardFocused ? 'space-y-3 sm:space-y-6' : 'mt-4 space-y-3.5 sm:mt-8 sm:space-y-6'}`}>
          <div className={`${isMobileWizardFocused ? 'hidden sm:grid sm:grid-cols-3 sm:gap-3' : 'grid grid-cols-3 gap-2 sm:gap-3'}`}>
            {wizardSteps.map((step, index) => {
              const isActive = step.id === safeCurrentStep
              const isComplete = currentWizardIndex > index
              const isLocked =
                (step.id === 'adjust' && !canOpenAdjustStep) ||
                (step.id === 'result' && !canOpenResultStep)

              return (
                <button
                  type="button"
                  key={step.id}
                  onClick={() => handleWizardStepSelect(step.id)}
                  disabled={isLocked}
                  aria-pressed={isActive}
                  className={`rounded-[18px] border px-2.5 py-2.5 text-left transition sm:rounded-[24px] sm:px-4 sm:py-4 ${
                    isActive
                      ? 'border-[var(--border-accent-strong)] bg-[var(--surface-muted)] shadow-[var(--shadow-sm)]'
                      : isComplete
                        ? 'border-[var(--border-accent)] bg-[var(--surface-strong)] shadow-[var(--shadow-sm)]'
                        : 'border-[var(--border)] bg-[var(--surface)]'
                  } ${
                    isLocked ? 'cursor-not-allowed opacity-60' : 'cursor-pointer hover:border-[var(--border-accent-strong)] hover:bg-[var(--surface-strong)]'
                  }`}
                >
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div
                      className={`inline-flex size-7 items-center justify-center rounded-full text-[11px] font-semibold sm:size-9 sm:text-sm ${
                        isActive || isComplete
                          ? 'bg-[var(--accent)] text-[var(--accent-foreground)]'
                          : 'bg-[rgba(124,136,155,0.18)] text-[var(--foreground-subtle)]'
                      }`}
                    >
                      {isComplete ? <CheckCircle2 className="size-4" /> : index + 1}
                    </div>
                    <div className="min-w-0">
                      <div className="hidden text-xs font-medium text-[var(--foreground-subtle)] sm:block">
                        {step.badge}
                      </div>
                      <div className="text-[11px] font-semibold leading-4 text-[var(--foreground)] sm:hidden">
                        {step.shortTitle}
                      </div>
                      <div className="hidden text-sm font-semibold text-[var(--foreground)] sm:block">
                        {step.title}
                      </div>
                    </div>
                  </div>
                </button>
              )
            })}
          </div>

          <Card className={`${isMobileWizardFocused ? 'rounded-[28px] border-[var(--border)] bg-[var(--surface-strong)] shadow-[var(--shadow-lg)]' : 'rounded-[22px] border-[var(--border-accent)] bg-[var(--surface-strong)] shadow-[var(--shadow-lg)] sm:rounded-[28px]'}`}>
            <CardContent className={`${isMobileWizardFocused ? 'space-y-4 p-4 sm:space-y-6 sm:p-6' : 'space-y-3 p-3.5 sm:space-y-6 sm:p-6'}`}>
              {!isMobileWizardFocused || safeCurrentStep !== 'discover' ? (
                <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                  <div className={isMobileWizardFocused ? 'hidden sm:block' : undefined}>
                    <Badge variant="muted" className="w-fit">{currentWizardBadge}</Badge>
                    <h3 className="mt-2 font-display text-xl font-semibold text-[var(--foreground)] sm:mt-4 sm:text-3xl">
                      {currentWizardTitle}
                    </h3>
                    <p className="mt-2 hidden max-w-3xl text-sm leading-7 text-[var(--foreground-muted)] sm:block">
                      {currentWizardDescription}
                    </p>
                  </div>
                  <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
                    {safeCurrentStep !== 'discover' ? (
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => setCurrentStep('discover')}
                        className="w-full whitespace-nowrap sm:w-auto sm:flex-none"
                      >
                        <span className="sm:hidden">처음으로</span>
                        <span className="hidden sm:inline">처음 단계로 돌아가기</span>
                      </Button>
                    ) : null}
                    {isMobileWizardFocused ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleExitMobileWizardFocus}
                        className="hidden whitespace-nowrap sm:inline-flex"
                      >
                        전체 보기
                      </Button>
                    ) : null}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={onOpenDirectory}
                      className="hidden whitespace-nowrap sm:inline-flex"
                    >
                      전체 코드 사전 열기
                      <ArrowRight className="size-4" />
                    </Button>
                  </div>
                </div>
              ) : null}

              <div
                key={panelTransitionKey}
                className="animate-fade-in space-y-4 sm:space-y-6"
              >
                {safeCurrentStep === 'discover' ? (
                  <IndustryDiscoveryPanel
                    input={input}
                    query={industryQuery}
                    suggestions={industrySuggestions}
                    status={discoveryStatus}
                    error={discoveryError}
                    screen={activeDiscoverScreen}
                    embedded
                    onQueryChange={setIndustryQuery}
                    onSubmitSearch={handleDiscoverSearch}
                    onSuggestionSelect={handleSuggestionSelect}
                    onExampleSelect={runQuickSearch}
                    onBackToSearch={handleBackToDiscoverSearch}
                    onContinueManual={handleContinueManualStep}
                  />
                ) : null}

                {safeCurrentStep === 'adjust' ? (
                  <EligibilityForm
                    input={input}
                    status={status}
                    onFieldChange={setField}
                    onFlagChange={setFlag}
                    onEvaluate={handleEvaluateStep}
                    onReset={reset}
                    onPrevious={() => setCurrentStep('discover')}
                    primaryActionLabel="결과 보기"
                    secondaryActionLabel="이전 단계"
                    defaultExpanded
                    embedded
                  />
                ) : null}

                {safeCurrentStep === 'result' ? (
                  <ResultPanel
                    input={input}
                    result={result}
                    status={status}
                    error={error}
                    onEvaluate={evaluate}
                    onAdjust={() => setCurrentStep('adjust')}
                    onOpenGuide={onOpenGuide}
                    sticky={false}
                    stepLabel="3단계"
                    embedded
                  />
                ) : null}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {!isMobileWizardFocused ? (
        <>
          <section className="grid gap-6 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]">
        <Card className="border-[var(--border-accent)] bg-[var(--surface-strong)] shadow-[var(--shadow-lg)]">
          <CardContent className="p-6">
            <Badge variant="muted">전수 코드 사전</Badge>
            <h2 className="mt-4 font-display text-3xl font-semibold text-[var(--foreground)]">
              모든 코드를 한 번에 보고 싶다면
              <br />
              전용 코드 사전에서 찾으면 됩니다
            </h2>
            <p className="mt-3 text-sm leading-7 text-[var(--foreground-muted)]">
              코드를 모르면 쉬운 검색에서 시작하고, 전체 코드를 보고 싶으면 여기서 바로
              찾아보면 됩니다.
            </p>

            <div className="mt-6 space-y-3">
              {dictionaryPreviewCards.map((item) => (
                <div
                  key={item.title}
                  className={`rounded-[24px] border px-4 py-4 ${
                    item.tone === 'strong'
                      ? 'border-[var(--border-accent-strong)] bg-[var(--surface-muted)] shadow-[var(--shadow-sm)]'
                      : 'border-[var(--border)] bg-[var(--surface-strong)] shadow-[var(--shadow-sm)]'
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="text-base font-semibold text-[var(--foreground)]">
                      {item.title}
                    </div>
                    <Badge variant="muted">{item.count}</Badge>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-[var(--foreground-muted)]">
                    {item.note}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <Button onClick={onOpenDirectory}>
                코드 사전 열기
                <LibraryBig className="size-4" />
              </Button>
              <Button variant="secondary" onClick={() => scrollToSection('criteria')}>
                법령 참고 보기
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border-[var(--border)] bg-[var(--surface-strong)] shadow-[var(--shadow-lg)]">
          <CardContent className="space-y-4 p-6">
            <div className="inline-flex size-11 items-center justify-center rounded-2xl bg-[var(--accent-soft)] text-[var(--accent-strong)] shadow-[var(--shadow-sm)]">
              <BookOpenText className="size-5" />
            </div>
            <div>
              <h2 className="font-display text-3xl font-semibold text-[var(--foreground)]">
                이렇게 읽으면 더 쉽습니다
              </h2>
              <p className="mt-3 text-sm leading-7 text-[var(--foreground-muted)]">
                먼저 내가 하는 일과 가까운 코드를 찾고, 그다음 `가능 / 조건부 가능 /
                심의 필요 / 추가 확인 / 불가` 순서로 읽으면 됩니다.
              </p>
            </div>

            <div className="space-y-3">
              {introSteps.map((item) => (
                <div
                  key={item.title}
                className="rounded-[22px] border border-[var(--border)] bg-[var(--surface-strong)] px-4 py-4 shadow-[var(--shadow-sm)]"
                >
                  <div className="text-sm font-semibold text-[var(--foreground)]">
                    {item.title}
                  </div>
                  <p className="mt-2 text-sm leading-6 text-[var(--foreground-muted)]">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      <section id="criteria" className="space-y-4">
        <div className="max-w-3xl">
          <Badge variant="muted">법령 참고</Badge>
          <h2 className="mt-4 font-display text-3xl font-semibold text-[var(--foreground)]">
            어떤 기준으로 보는지 아래에서 다시 확인할 수 있습니다
          </h2>
          <p className="mt-3 text-sm leading-7 text-[var(--foreground-muted)]">
            이 영역은 법령과 예외 규칙을 빠르게 훑는 참고 화면입니다. 전체 코드 탐색은
            전수 코드 사전에서 보는 편이 더 쉽습니다.
          </p>
        </div>
        <RulebookTabs onOpenDirectory={onOpenDirectory} />
      </section>

      <section className="grid gap-6 lg:grid-cols-[minmax(0,0.94fr)_minmax(0,1.06fr)]">
        <Card className="border-[var(--border-accent)] bg-[var(--surface-strong)] shadow-[var(--shadow-lg)]">
          <CardContent className="space-y-5 p-6">
            <div className="inline-flex size-11 items-center justify-center rounded-2xl bg-[var(--accent-soft)] text-[var(--accent-strong)] shadow-[var(--shadow-sm)]">
              <BookOpenText className="size-5" />
            </div>
            <div>
              <Badge variant="muted">참조 법령 라이브러리</Badge>
              <h2 className="mt-4 font-display text-3xl font-semibold text-[var(--foreground)]">
                판정 근거를
                <br />
                문서 단위로 다시 읽을 수 있습니다
              </h2>
              <p className="mt-3 text-sm leading-7 text-[var(--foreground-muted)]">
                결과 패널의 각주에서 끝나지 않고, 시행령과 마곡 고시문을 문서별로
                다시 읽을 수 있는 독립 화면을 준비했습니다. 상담 전 근거 설명이나
                내부 검토 자료 정리에 바로 쓸 수 있습니다.
              </p>
            </div>
            <div className="grid gap-3">
                <div className="rounded-[22px] border border-[var(--border-accent)] bg-[var(--surface-muted)] px-4 py-4 text-sm leading-6 text-[var(--foreground-muted)] shadow-[var(--shadow-sm)]">
                `산업집적법 시행령`과 `마곡 관리기본계획`을 문서 단위로 나눠, 어떤
                판정이 어디에서 왔는지 더 쉽게 추적할 수 있습니다.
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge variant="muted">시행령</Badge>
                <Badge variant="muted">마곡 고시문</Badge>
                <Badge variant="muted">조문 / 페이지 힌트</Badge>
              </div>
            </div>
            <div>
              <Button onClick={onOpenLibrary}>
                법령 라이브러리 열기
                <ArrowRight className="size-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border-[var(--border)] bg-[var(--surface-strong)] shadow-[var(--shadow-lg)]">
          <CardContent className="space-y-5 p-6">
            <div className="inline-flex size-11 items-center justify-center rounded-2xl bg-[var(--accent-soft)] text-[var(--accent-strong)] shadow-[var(--shadow-sm)]">
              <FileSearch className="size-5" />
            </div>
            <div>
              <Badge variant="muted">데이터 업데이트 로그</Badge>
              <h2 className="mt-4 font-display text-3xl font-semibold text-[var(--foreground)]">
                최근에 무엇이 바뀌었는지
                <br />
                빠르게 확인할 수 있습니다
              </h2>
              <p className="mt-3 text-sm leading-7 text-[var(--foreground-muted)]">
                판정 기준과 화면 구조가 언제 어떻게 바뀌었는지 기록해 둔 이력
                화면입니다. 상담 전 최신 반영 범위를 설명하거나 기존 화면과의 차이를
                정리할 때 유용합니다.
              </p>
            </div>
            <div className="space-y-3">
              {recentUpdates.map((entry) => (
                <div
                  key={entry.id}
                className="rounded-[22px] border border-[var(--border)] bg-[var(--surface-strong)] px-4 py-4 shadow-[var(--shadow-sm)]"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="muted">{formatKoreanDate(entry.date)}</Badge>
                    <div className="text-sm font-semibold text-[var(--foreground)]">
                      {entry.title}
                    </div>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-[var(--foreground-muted)]">
                    {entry.summary}
                  </p>
                </div>
              ))}
            </div>
            <div>
              <Button variant="secondary" onClick={onOpenUpdates}>
                업데이트 로그 열기
                <ArrowRight className="size-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="space-y-4">
        <div className="max-w-3xl">
          <Badge variant="muted">대표 업종 가이드</Badge>
          <h2 className="mt-4 font-display text-3xl font-semibold text-[var(--foreground)]">
            자주 찾는 업종은
            <br />
            문서형 가이드로 바로 읽을 수 있습니다
          </h2>
          <p className="mt-3 text-sm leading-7 text-[var(--foreground-muted)]">
            결과 화면에서 끝내지 않고, 코드별 설명과 자주 묻는 질문까지 읽을 수 있는
            가이드 페이지를 준비했습니다.
          </p>
        </div>
        <div className="grid gap-4 lg:grid-cols-3">
          {featuredGuides.map((guide) => (
            <Card
              key={guide.code}
                className="border-[var(--border-accent)] bg-[var(--surface-strong)] shadow-[var(--shadow-lg)]"
            >
              <CardContent className="space-y-4 p-5">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge>{guide.code}</Badge>
                  <Badge variant="muted">{guide.recommendedZoneLabel}</Badge>
                </div>
                <div>
                  <h3 className="font-display text-2xl font-semibold text-[var(--foreground)]">
                    {guide.name}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-[var(--foreground-muted)]">
                    {guide.summary}
                  </p>
                </div>
                <Button
                  variant="secondary"
                  onClick={() => onOpenGuide(guide.code)}
                  aria-label={`${guide.code} ${guide.name} 가이드 보기`}
                >
                  가이드 보기
                  <ArrowRight className="size-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section
        id="affiliate"
              className="rounded-[32px] border border-[var(--border)] bg-[var(--surface-strong)] p-5 shadow-[var(--shadow-lg)] sm:p-6"
      >
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <Badge variant="muted">참고용 제휴 링크</Badge>
            <h2 className="mt-4 font-display text-2xl font-semibold text-[var(--foreground)] sm:text-[2rem]">
              업종 분석과 법령 확인이 끝난 뒤 필요할 때만 참고할 수 있습니다
            </h2>
            <p className="mt-3 text-sm leading-7 text-[var(--foreground-muted)]">
              이 영역은 입주 판단용 본문이 아니라 사무실 준비에 참고할 수 있는 외부
              상품 링크입니다. 먼저 업종 분석 결과와 법령 참고를 확인한 뒤, 필요한 경우에만
              펼쳐서 보도록 기본 노출 강도를 낮췄습니다.
            </p>
          </div>

                    <div className="rounded-[20px] border border-[var(--border)] bg-[var(--surface-strong)] px-4 py-3 text-xs leading-5 text-[var(--foreground-muted)] shadow-[var(--shadow-sm)]">
            광고보다 본문이 먼저 보이도록
            <br />
            제휴 영역은 기본 접힘 상태로 제공합니다.
          </div>
        </div>

                  <div className="mt-5 rounded-[28px] border border-[var(--border)] bg-[var(--surface-strong)] shadow-[var(--shadow-sm)]">
          <button
            type="button"
            onClick={() => setIsAffiliateExpanded((current) => !current)}
            className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
            aria-expanded={isAffiliateExpanded}
            aria-controls="affiliate-links-panel"
          >
            <div>
              <div className="text-sm font-semibold text-[var(--foreground)]">
                사무환경 참고 상품 {isAffiliateExpanded ? '접기' : '펼치기'}
              </div>
              <p className="mt-1 text-xs leading-5 text-[var(--foreground-muted)]">
                외부 상품은 필요한 경우에만 확인할 수 있도록 접어두었습니다.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="muted" className="whitespace-nowrap">
                기본 숨김
              </Badge>
              <ChevronDown
                className={`size-4 text-[var(--foreground-subtle)] transition-transform ${
                  isAffiliateExpanded ? 'rotate-180' : ''
                }`}
              />
            </div>
          </button>

          {isAffiliateExpanded ? (
            <div
              id="affiliate-links-panel"
              className="border-t border-[var(--border)] px-4 py-4 sm:px-5 sm:py-5"
            >
              <div className="grid gap-4 xl:grid-cols-[280px_minmax(0,1fr)]">
            <Card className="h-full border-[var(--border)] bg-[var(--surface-soft)] shadow-[var(--shadow-sm)]">
                  <CardContent className="space-y-4 p-5">
                    <div>
                      <div className="text-sm font-semibold text-[var(--foreground)]">
                        사무실 준비 참고
                      </div>
                      <p className="mt-2 text-sm leading-6 text-[var(--foreground-muted)]">
                        사무 가구, 전자기기, 탕비용품처럼 자주 찾는 항목만 참고용으로
                        정리한 링크입니다. 입주 가능 여부를 대신하지 않으며, 본문보다
                        앞세우지 않도록 축소된 카드로 배치합니다.
                      </p>
                    </div>

                    <div className="rounded-[22px] border border-[var(--info-border)] bg-[var(--info-bg)] px-4 py-4">
                      <div className="flex items-start gap-3">
                        <div className="inline-flex size-10 shrink-0 items-center justify-center rounded-2xl bg-[var(--accent-soft)] text-[var(--accent-strong)] shadow-[var(--shadow-sm)]">
                          <ExternalLink className="size-4" />
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-[var(--foreground)]">
                            광고·제휴 안내
                          </div>
                          <p className="mt-1 text-sm leading-6 text-[var(--foreground-muted)]">
                            {coupangDisclosureText}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {affiliateActions.map((item) => (
                        <Button key={item.title} asChild variant={item.variant} size="sm">
                          <a
                            href={item.href}
                            target="_blank"
                            rel="nofollow sponsored noopener"
                            referrerPolicy="unsafe-url"
                          >
                            {item.title}
                          </a>
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  {affiliateWidgets.map((widget) => (
                    <Card
                      key={widget.src}
              className="h-full border-[var(--border)] bg-[var(--surface-strong)] shadow-[var(--shadow-sm)]"
                    >
                      <CardContent className="flex h-full flex-col p-4">
                        <div className="flex min-h-11 items-start justify-between gap-2">
                          <Badge
                            variant="muted"
                            className="shrink-0 whitespace-nowrap px-2.5 py-1 text-[11px] tracking-normal sm:text-xs"
                          >
                            {widget.badge}
                          </Badge>
                          <span className="shrink-0 whitespace-nowrap pt-1 text-[11px] text-[var(--foreground-subtle)] sm:text-xs">
                            외부 상품
                          </span>
                        </div>
                        <div className="mt-3 min-h-14 text-[15px] font-semibold leading-6 tracking-[-0.01em] text-[var(--foreground)] sm:min-h-16 sm:text-base">
                          {widget.headline}
                        </div>
              <div className="mt-4 flex flex-1 items-start justify-center rounded-[22px] border border-[var(--border)] bg-[var(--surface-soft)] px-2 py-3">
                          <iframe
                            src={widget.src}
                            title={widget.title}
                            width="120"
                            height="240"
                            frameBorder="0"
                            scrolling="no"
                            referrerPolicy="unsafe-url"
                            loading="lazy"
            className="overflow-hidden rounded-[18px] bg-[var(--surface-strong)]"
                          />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </section>
        </>
      ) : null}
    </>
  )
}

function App() {
  const {
    input,
    result,
    status,
    error,
    industryQuery,
    industrySuggestions,
    discoveryStatus,
    discoveryError,
    currentStep,
    setField,
    setFlag,
    setCurrentStep,
    setIndustryQuery,
    discoverIndustry,
    applyIndustrySuggestion,
    evaluate,
    reset,
  } = useEligibilityStore()

  const initialHashState = getHashState(window.location.hash)
  const [view, setView] = useState<AppView>(() => initialHashState.view)
  const [guideCode, setGuideCode] = useState<string | null>(() => initialHashState.guideCode)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    function handleHashChange() {
      const nextHashState = getHashState(window.location.hash)
      setView(nextHashState.view)
      setGuideCode(nextHashState.guideCode)
    }

    window.addEventListener('hashchange', handleHashChange)

    return () => {
      window.removeEventListener('hashchange', handleHashChange)
    }
  }, [])

  function openDirectoryView() {
    setView('directory')
    setGuideCode(null)
    window.history.replaceState(null, '', '#directory')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function openLibraryView() {
    setView('library')
    setGuideCode(null)
    window.history.replaceState(null, '', '#library')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function openUpdatesView() {
    setView('updates')
    setGuideCode(null)
    window.history.replaceState(null, '', '#updates')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function openHomeView(sectionId = 'top') {
    setView('home')
    setGuideCode(null)
    window.history.replaceState(null, '', `#${sectionId}`)
    scrollToSection(sectionId)
  }

  function openGuideView(code: string) {
    const normalizedCode = code.trim()

    if (!normalizedCode) {
      return
    }

    setView('guide')
    setGuideCode(normalizedCode)
    window.history.replaceState(null, '', `#guides/${encodeURIComponent(normalizedCode)}`)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function handleDirectoryApply(
    entry: MagokCodeDirectoryEntry,
    zoneType: DirectoryZoneType,
  ) {
    setField('zoneType', zoneType)
    setField('ksicCode', entry.code)
    setField('ksicName', entry.name)
    setField('regulatoryFit', 'auto')
    setFlag('isHosting63112', entry.code === '63112')
    setCurrentStep('adjust')
    openHomeView('finder')
  }

  const activeZoneLabel = getZoneLabel(
    input.zoneType === 'industrialFacility'
      ? 'industrialFacility'
      : 'knowledgeIndustryCenter',
  )
  const currentGuide = guideCode ? getGuideEntryByCode(guideCode) : null

  return (
    <div className="min-h-screen overflow-x-hidden">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-2xl focus:bg-[var(--accent)] focus:px-6 focus:py-3 focus:text-sm focus:font-semibold focus:text-white focus:shadow-lg"
      >
        본문으로 바로가기
      </a>
      <div className="mx-auto max-w-[1180px] px-3 py-3 sm:px-6 sm:py-4 lg:px-8 lg:py-6">
        <header className="sticky top-3 z-20 rounded-[20px] border border-[var(--border)] bg-[rgba(255,255,255,0.92)] px-2.5 py-2.5 shadow-[var(--shadow-md)] sm:top-4 sm:rounded-[24px] sm:px-4 sm:py-3 sm:shadow-[var(--shadow-lg)] sm:backdrop-blur">
          <div className="flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={() => openHomeView('top')}
              className="min-w-0 flex items-center gap-2 text-left"
              aria-label="마곡 코드찾기 홈으로"
            >
              <div className="inline-flex size-10 shrink-0 items-center justify-center rounded-2xl bg-[var(--accent)] text-[var(--accent-foreground)] shadow-[var(--shadow-accent)] sm:size-11">
                <Building2 className="size-5" />
              </div>
              <div className="min-w-0">
                <div className="hidden truncate text-[11px] font-semibold tracking-[0.16em] text-[var(--foreground-subtle)] sm:block sm:text-xs">
                  LOOPIN LAB
                </div>
                <div className="truncate text-base font-semibold text-[var(--foreground)] sm:text-base">
                  마곡 코드찾기
                </div>
              </div>
            </button>

            <nav className="hidden items-center gap-1 md:flex">
              <Button
                variant={view === 'home' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => openHomeView('finder')}
              >
                검색 홈
              </Button>
              <Button
                variant={view === 'directory' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={openDirectoryView}
              >
                전수 코드 사전
              </Button>
              <Button
                variant={view === 'library' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={openLibraryView}
              >
                법령 라이브러리
              </Button>
              <Button
                variant={view === 'updates' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={openUpdatesView}
              >
                업데이트 로그
              </Button>
              {view === 'home' ? (
                <Button variant="ghost" size="sm" onClick={() => openHomeView('criteria')}>
                  법령 참고
                </Button>
              ) : null}
            </nav>

            <div className="hidden flex-wrap items-center gap-2 md:flex">
              <Badge variant="muted" className="hidden sm:inline-flex">{activeZoneLabel} 기본</Badge>
              <Button
                size="sm"
                onClick={() => (view === 'home' ? openDirectoryView() : openHomeView('finder'))}
                className="whitespace-nowrap"
              >
                {view === 'home' ? '코드 사전 열기' : '검색 홈으로'}
                <ArrowRight className="size-4" />
              </Button>
            </div>

            <div className="flex shrink-0 items-center gap-1.5 md:hidden">
              <Button
                size="sm"
                onClick={() => (view === 'home' ? openDirectoryView() : openHomeView('finder'))}
                aria-label={view === 'home' ? '코드 사전 열기' : '검색 홈으로'}
                className="h-10 min-h-10 shrink-0 px-3"
              >
                <span>{view === 'home' ? '사전' : '검색'}</span>
                <ArrowRight className="size-4" />
              </Button>
              <button
                type="button"
                className="inline-flex size-10 items-center justify-center rounded-2xl text-[var(--foreground-muted)] transition-colors hover:bg-[var(--accent-soft)] hover:text-[var(--accent-strong)]"
                onClick={() => setIsMobileMenuOpen((prev) => !prev)}
                aria-label={isMobileMenuOpen ? '메뉴 닫기' : '메뉴 열기'}
                aria-expanded={isMobileMenuOpen}
                aria-controls="mobile-nav-panel"
              >
                {isMobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
              </button>
            </div>
          </div>

          {isMobileMenuOpen ? (
            <nav
              id="mobile-nav-panel"
              className="mt-2 flex animate-slide-down flex-col gap-1 border-t border-[var(--border)] pt-3 md:hidden"
              aria-label="모바일 내비게이션"
            >
              <Button
                variant={view === 'home' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => { openHomeView('finder'); setIsMobileMenuOpen(false) }}
                className="justify-start"
              >
                검색 홈
              </Button>
              <Button
                variant={view === 'directory' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => { openDirectoryView(); setIsMobileMenuOpen(false) }}
                className="justify-start"
              >
                전수 코드 사전
              </Button>
              <Button
                variant={view === 'library' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => { openLibraryView(); setIsMobileMenuOpen(false) }}
                className="justify-start"
              >
                법령 라이브러리
              </Button>
              <Button
                variant={view === 'updates' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => { openUpdatesView(); setIsMobileMenuOpen(false) }}
                className="justify-start"
              >
                업데이트 로그
              </Button>
              {view === 'home' ? (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => { openHomeView('criteria'); setIsMobileMenuOpen(false) }}
                  className="justify-start"
                >
                  법령 참고
                </Button>
              ) : null}
            </nav>
          ) : null}
        </header>

        <main id="main-content" className="animate-fade-in space-y-6 pb-12 pt-4 sm:space-y-8 sm:pt-6 lg:space-y-10 lg:pt-8">
          <Suspense fallback={<SkeletonCard />}>
          {view === 'directory' ? (
            <CodeDirectoryPage
              defaultZoneType={
                input.zoneType === 'industrialFacility'
                  ? 'industrialFacility'
                  : 'knowledgeIndustryCenter'
              }
              onBackHome={() => openHomeView('finder')}
              onApplyCode={handleDirectoryApply}
            />
          ) : view === 'guide' ? (
            currentGuide ? (
              <GuidePage
                guide={currentGuide}
                onBackHome={() => openHomeView('finder')}
                onOpenDirectory={openDirectoryView}
                onOpenGuide={openGuideView}
              />
            ) : (
              <Card className="border-[var(--border-accent)] bg-[var(--surface-strong)] shadow-[var(--shadow-md)]">
                <CardContent className="space-y-4 p-6">
                  <Badge variant="muted">가이드 없음</Badge>
                  <h2 className="font-display text-3xl font-semibold text-[var(--foreground)]">
                    요청한 가이드를 찾지 못했습니다
                  </h2>
                  <p className="text-sm leading-7 text-[var(--foreground-muted)]">
                    현재 생성된 가이드 범위 안에 없는 코드이거나 주소 해시가 잘못된
                    상태입니다. 검색 홈이나 전수 코드 사전으로 돌아가 다시 진입해 주세요.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Button variant="secondary" onClick={() => openHomeView('finder')}>
                      검색 홈으로 돌아가기
                    </Button>
                    <Button variant="outline" onClick={openDirectoryView}>
                      코드 사전 보기
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          ) : view === 'library' ? (
            <LegalLibraryPage
              onBackHome={() => openHomeView('finder')}
              onOpenUpdates={openUpdatesView}
            />
          ) : view === 'updates' ? (
            <UpdateLogPage
              onBackHome={() => openHomeView('finder')}
              onOpenLibrary={openLibraryView}
            />
          ) : (
            <HomeSections
              input={input}
              status={status}
              result={result}
              error={error}
              industryQuery={industryQuery}
              industrySuggestions={industrySuggestions}
              discoveryStatus={discoveryStatus}
              discoveryError={discoveryError}
              currentStep={currentStep}
              setField={setField}
              setFlag={setFlag}
              setCurrentStep={setCurrentStep}
              setIndustryQuery={setIndustryQuery}
              discoverIndustry={discoverIndustry}
              applyIndustrySuggestion={applyIndustrySuggestion}
              evaluate={evaluate}
              reset={reset}
              onOpenDirectory={openDirectoryView}
              onOpenLibrary={openLibraryView}
              onOpenUpdates={openUpdatesView}
              onOpenGuide={openGuideView}
            />
          )}
          </Suspense>

<footer className="space-y-6 rounded-[32px] border border-[var(--border)] bg-[var(--surface-strong)] px-6 py-6 shadow-[var(--shadow-lg)]">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <div className="text-xs font-semibold tracking-[0.16em] text-[var(--foreground-subtle)]">
                  LOOPIN LAB
                </div>
                <div className="mt-2 font-display text-2xl font-semibold text-[var(--foreground)]">
                  마곡 코드찾기
                </div>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--foreground-muted)]">
                  마곡 일반산업단지 입주 검토를 더 빨리 시작할 수 있도록, 업종코드 추천,
                  전체 코드 사전, 예비판정을 한 화면 체계로 정리한 서비스입니다.
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <Badge variant="muted">업종코드 추천</Badge>
                <Badge variant="muted">전수 코드 사전</Badge>
                <Badge variant="muted">입주 예비판정</Badge>
                <Badge variant="muted">법령 라이브러리</Badge>
                <Badge variant="muted">업데이트 로그</Badge>
              </div>
            </div>

            <div className="grid gap-3 md:grid-cols-3">
              {footerFacts.map((item) => (
                <div
                  key={item}
                  className="rounded-[22px] border border-[var(--border)] bg-[var(--surface-muted)] px-4 py-4 text-sm leading-6 text-[var(--foreground-muted)]"
                >
                  {item}
                </div>
              ))}
            </div>

            <div className="rounded-[26px] border border-[var(--info-border)] bg-[var(--info-bg)] px-4 py-4 text-sm leading-6 text-[var(--info-foreground)]">
              제휴 링크가 포함된 영역에서는 대가성 안내를 함께 표기합니다.
            </div>
          </footer>
        </main>
      </div>
    </div>
  )
}

export default App
