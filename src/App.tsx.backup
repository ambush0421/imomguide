import { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react'
import {
  ArrowRight,
  BookOpenText,
  CheckCircle2,
  ChevronDown,
  Clock3,
  ExternalLink,
  FileSearch,
  LibraryBig,
  Lock,
  Menu,
  SearchCheck,
  Trash2,
  X,
} from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { SkeletonCard } from '@/components/ui/skeleton'
import { Textarea } from '@/components/ui/textarea'

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
import {
  clearFinderWizardDraft,
  loadFinderWizardDraft,
  saveFinderWizardDraft,
  type FinderDiscoverScreen,
  type FinderWizardMode,
} from '@/features/eligibility/finder-wizard-storage'
import { RulebookTabs } from '@/features/eligibility/components/rulebook-tabs'
import {
  clearRecentEligibilityHistory,
  getRecentHistoryCodeLabel,
  getRecentHistoryContext,
  loadRecentEligibilityHistory,
  type RecentEligibilityHistoryEntry,
} from '@/features/eligibility/history-storage'
import {
  buildEligibilityPrintDocument,
  buildEligibilityResultSummary,
  createSharedFinderHash,
  decodeSharedEligibilityState,
  type SharedEligibilityState,
} from '@/features/eligibility/share-result'
import {
  getFeaturedGuideEntries,
  getGuideEntryByCode,
} from '@/features/guides/data/guide-catalog'
import {
  getLegalLibraryBasisSectionId,
  getLegalLibraryEntrySectionId,
} from '@/features/library/data/legal-library'
import { getRecentUpdateLogEntries } from '@/features/updates/data/update-log'
import {
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
import {
  formatKoreanDate,
  formatKoreanDateTime,
  formatNumber,
  formatVerdictLabel,
} from '@/utils/format'
import { trackEvent } from '@/utils/analytics'

type AppView = 'home' | 'directory' | 'library' | 'updates' | 'guide'
type DiscoverScreen = FinderDiscoverScreen
type ViewportTier = 'mobile' | 'tablet' | 'desktop'
type HistoryMode = 'push' | 'replace'

const introSteps = [
  {
    step: '1',
    title: '하는 일을 한 줄로 적습니다.',
    summary: '고객이 하는 일을 한 줄로 적어, 내 일과 가장 가까운 코드를 찾습니다.',
    description:
      '업태·종목, 실무 메모, 고객이 통화 중에 말한 표현 그대로 적어도 됩니다.',
  },
  {
    step: '2',
    title: '가까운 업종코드를 추천받습니다.',
    summary: '정확한 코드가 없어도 먼저 볼 후보를 좁힙니다.',
    description:
      '정확한 코드가 없어도 비슷한 코드들까지 한 번에 비교할 수 있습니다.',
  },
  {
    step: '3',
    title: '마곡 입주 가능성을 근거와 함께 확인합니다.',
    summary: '가능·조건부·심의 결과와 이유, 조건, 확인 포인트를 한 화면에서 봅니다.',
    description:
      '가능 / 조건부 가능 / 심의 필요 / 추가 확인 / 불가 순서로 읽으면 가장 빠릅니다.',
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

const heroBenefitCards = [
  {
    title: '업종코드를 몰라도 검색',
    description: '고객이 말한 그대로 적으면 됩니다.',
    tone: 'hero',
  },
  {
    title: '마곡 기준 자동 추천',
    description: '먼저 볼 후보를 빠르게 좁혀 드립니다.',
    tone: 'support',
  },
  {
    title: '가능·조건부·심의 필요 바로 확인',
    description: '판정 이유와 확인 포인트를 함께 보여드립니다.',
    tone: 'support',
  },
] as const

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

const brandAssets = {
  symbol: '/brand/magok-codefinder-symbol.svg',
  wordmark: '/brand/magok-codefinder-logo-horizontal.svg',
} as const

interface HashState {
  view: AppView
  guideCode: string | null
  sectionId: string
  sharedState: SharedEligibilityState | null
  mode: FinderWizardMode | null
  step: EligibilityStep | null
  discoverScreen: DiscoverScreen | null
  hasExplicitFinderState: boolean
}

function getHashState(hash: string): HashState {
  if (hash.startsWith('#guides/')) {
    const guideCode = decodeURIComponent(hash.slice('#guides/'.length)).trim()

    return {
      view: 'guide',
      guideCode: guideCode || null,
      sectionId: 'top',
      sharedState: null,
      mode: null,
      step: null,
      discoverScreen: null,
      hasExplicitFinderState: false,
    }
  }

  if (hash.startsWith('#directory')) {
    return {
      view: 'directory',
      guideCode: null,
      sectionId: 'top',
      sharedState: null,
      mode: null,
      step: null,
      discoverScreen: null,
      hasExplicitFinderState: false,
    }
  }

  if (hash.startsWith('#library')) {
    return {
      view: 'library',
      guideCode: null,
      sectionId: hash.slice(1) || 'library',
      sharedState: null,
      mode: null,
      step: null,
      discoverScreen: null,
      hasExplicitFinderState: false,
    }
  }

  if (hash.startsWith('#updates')) {
    return {
      view: 'updates',
      guideCode: null,
      sectionId: 'top',
      sharedState: null,
      mode: null,
      step: null,
      discoverScreen: null,
      hasExplicitFinderState: false,
    }
  }

  const normalizedHash = hash.startsWith('#') ? hash.slice(1) : hash
  const [sectionId = 'top', search = ''] = normalizedHash.split('?')
  const params = new URLSearchParams(search)
  const shareValue = params.get('share')
  const modeValue = params.get('mode')
  const stepValue = params.get('step')
  const screenValue = params.get('screen')
  const mode =
    modeValue === 'overview' || modeValue === 'focus' ? modeValue : null
  const step =
    stepValue === 'discover' || stepValue === 'adjust' || stepValue === 'result'
      ? stepValue
      : null
  const discoverScreen =
    screenValue === 'compose' || screenValue === 'results' ? screenValue : null

  return {
    view: 'home',
    guideCode: null,
    sectionId: sectionId || 'top',
    sharedState: shareValue ? decodeSharedEligibilityState(shareValue) : null,
    mode,
    step,
    discoverScreen,
    hasExplicitFinderState:
      modeValue !== null || stepValue !== null || screenValue !== null,
  }
}

function buildHomeHash({
  sectionId,
  mode,
  step,
  discoverScreen,
}: {
  sectionId: string
  mode?: FinderWizardMode | null
  step?: EligibilityStep | null
  discoverScreen?: DiscoverScreen | null
}) {
  const normalizedSectionId = sectionId || 'top'

  if (normalizedSectionId !== 'finder') {
    return `#${normalizedSectionId}`
  }

  const params = new URLSearchParams()

  if (mode) {
    params.set('mode', mode)
  }

  if (mode === 'focus' && step) {
    params.set('step', step)

    if (step === 'discover' && discoverScreen) {
      params.set('screen', discoverScreen)
    }
  }

  const search = params.toString()

  return search ? `#finder?${search}` : '#finder'
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

function getHistoryBadgeVariant(entry: RecentEligibilityHistoryEntry) {
  if (entry.compareZones) {
    return 'muted' as const
  }

  if (entry.primaryVerdict === 'eligible') {
    return 'success' as const
  }

  if (
    entry.primaryVerdict === 'conditional' ||
    entry.primaryVerdict === 'reviewRequired'
  ) {
    return 'warning' as const
  }

  if (entry.primaryVerdict === 'ineligible') {
    return 'danger' as const
  }

  return 'muted' as const
}

async function copyTextToClipboard(text: string) {
  const clipboard =
    typeof window !== 'undefined' ? window.navigator.clipboard : undefined

  if (clipboard?.writeText) {
    await clipboard.writeText(text)
    return
  }

  const textArea = document.createElement('textarea')
  textArea.value = text
  textArea.setAttribute('readonly', 'true')
  textArea.style.position = 'fixed'
  textArea.style.top = '-9999px'
  document.body.append(textArea)
  textArea.select()

  try {
    const copied = document.execCommand('copy')

    if (!copied) {
      throw new Error('clipboard copy failed')
    }
  } finally {
    textArea.remove()
  }
}

function HomeSections({
  input,
  status,
  result,
  additionalCodes,
  multiCodeResults,
  compareZones,
  comparisonResults,
  error,
  industryQuery,
  industrySuggestions,
  discoveryStatus,
  discoveryError,
  currentStep,
  discoverScreen,
  isWizardFocused,
  setField,
  setFlag,
  setCompareZones,
  setAdditionalCodeField,
  addAdditionalCode,
  removeAdditionalCode,
  setIndustryQuery,
  discoverIndustry,
  applyIndustrySuggestion,
  evaluate,
  onOpenDirectory,
  onOpenLibrary,
  onOpenUpdates,
  onOpenGuide,
  onFinderStateChange,
  onExitWizardFocus,
  onResetFinder,
  onCopyShareLink,
  onCopyResultSummary,
  onPrintResult,
}: {
  input: ReturnType<typeof useEligibilityStore.getState>['input']
  status: ReturnType<typeof useEligibilityStore.getState>['status']
  result: ReturnType<typeof useEligibilityStore.getState>['result']
  additionalCodes: ReturnType<typeof useEligibilityStore.getState>['additionalCodes']
  multiCodeResults: ReturnType<typeof useEligibilityStore.getState>['multiCodeResults']
  compareZones: ReturnType<typeof useEligibilityStore.getState>['compareZones']
  comparisonResults: ReturnType<typeof useEligibilityStore.getState>['comparisonResults']
  error: ReturnType<typeof useEligibilityStore.getState>['error']
  industryQuery: ReturnType<typeof useEligibilityStore.getState>['industryQuery']
  industrySuggestions: ReturnType<typeof useEligibilityStore.getState>['industrySuggestions']
  discoveryStatus: ReturnType<typeof useEligibilityStore.getState>['discoveryStatus']
  discoveryError: ReturnType<typeof useEligibilityStore.getState>['discoveryError']
  currentStep: ReturnType<typeof useEligibilityStore.getState>['currentStep']
  discoverScreen: DiscoverScreen
  isWizardFocused: boolean
  setField: ReturnType<typeof useEligibilityStore.getState>['setField']
  setFlag: ReturnType<typeof useEligibilityStore.getState>['setFlag']
  setCompareZones: ReturnType<typeof useEligibilityStore.getState>['setCompareZones']
  setAdditionalCodeField: ReturnType<typeof useEligibilityStore.getState>['setAdditionalCodeField']
  addAdditionalCode: ReturnType<typeof useEligibilityStore.getState>['addAdditionalCode']
  removeAdditionalCode: ReturnType<typeof useEligibilityStore.getState>['removeAdditionalCode']
  setIndustryQuery: ReturnType<typeof useEligibilityStore.getState>['setIndustryQuery']
  discoverIndustry: ReturnType<typeof useEligibilityStore.getState>['discoverIndustry']
  applyIndustrySuggestion: ReturnType<typeof useEligibilityStore.getState>['applyIndustrySuggestion']
  evaluate: ReturnType<typeof useEligibilityStore.getState>['evaluate']
  onOpenDirectory: () => void
  onOpenLibrary: (targetId?: string) => void
  onOpenUpdates: () => void
  onOpenGuide: (code: string) => void
  onFinderStateChange: (state: {
    focus?: boolean
    step?: EligibilityStep
    discoverScreen?: DiscoverScreen
    historyMode?: HistoryMode
  }) => void
  onExitWizardFocus: () => void
  onResetFinder: () => void
  onCopyShareLink: () => Promise<void>
  onCopyResultSummary: () => Promise<void>
  onPrintResult: () => void
}) {
  const canShowResult = Boolean(status === 'ready' && result)
  const canStayOnResultStep =
    status === 'loading' || status === 'error' || canShowResult
  const safeCurrentStep =
    currentStep === 'result' && !canStayOnResultStep ? 'adjust' : currentStep
  const [isAffiliateExpanded, setIsAffiliateExpanded] = useState(false)
  const [viewportTier, setViewportTier] = useState<ViewportTier>('desktop')
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
  const currentZoneLabel =
    input.zoneType === 'industrialFacility'
      ? '산업시설구역'
      : input.zoneType === 'knowledgeIndustryCenter'
        ? '지식산업센터'
        : '지원시설구역'
  const isDesktopViewport = viewportTier === 'desktop'
  const isCompactWizardFocused = isWizardFocused && !isDesktopViewport
  const isDesktopWizardFocused = isWizardFocused && isDesktopViewport
  const showOverviewSections = !isWizardFocused
  const showSlimDiscoverOverview =
    showOverviewSections &&
    safeCurrentStep === 'discover' &&
    activeDiscoverScreen === 'compose'
  const focusContextCards = [
    {
      label: '입력한 설명',
      value: industryQuery.trim() || input.ksicName.trim() || '아직 입력 전',
    },
    {
      label: '선택 코드',
      value: input.ksicCode.trim() || '아직 선택 전',
    },
    {
      label: '현재 구역',
      value: currentZoneLabel,
    },
  ] as const
  const focusRailHint =
    safeCurrentStep === 'discover'
      ? '하는 일을 적고 가장 가까운 코드 하나를 먼저 고르면 다음 단계로 자연스럽게 이어집니다.'
      : safeCurrentStep === 'adjust'
        ? '꼭 필요한 조건만 확인한 뒤 결과 보기 버튼으로 넘어가면 됩니다.'
        : '결과 제목, 판정 근거, 다음에 확인할 것 순서로 읽으면 가장 빠릅니다.'
  const filledAdditionalCodeCount = additionalCodes.filter(
    (item) => item.ksicCode.trim() || item.ksicName.trim(),
  ).length
  const activeFlagCount = Object.values(input.flags).filter(Boolean).length

  const dictionaryPreviewCards = [
    {
      title: '지식산업센터',
      count: `${formatNumber(getReviewableCount(knowledgeCounts))}개`,
      note: '지식산업센터 상담 전에 먼저 살펴볼 만한 코드를 빠르게 둘러볼 수 있습니다.',
      tone: 'strong',
    },
    {
      title: '산업시설구역',
      count: `${formatNumber(getReviewableCount(industrialCounts))}개`,
      note: '산업시설구역 입주 가능성을 볼 때, 허용 코드를 한 번에 찾기 좋습니다.',
      tone: 'soft',
    },
    {
      title: '쉽게 검색',
      count: '자유 문장 가능',
      note: '고객 업태·종목을 적으면 가까운 코드를 먼저 추천합니다.',
      tone: 'soft',
    },
  ] as const

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
      return
    }

    const mobileQuery = window.matchMedia('(max-width: 639px)')
    const tabletQuery = window.matchMedia('(min-width: 640px) and (max-width: 1023px)')
    const syncViewport = () => {
      if (mobileQuery.matches) {
        setViewportTier('mobile')
        return
      }

      if (tabletQuery.matches) {
        setViewportTier('tablet')
        return
      }

      setViewportTier('desktop')
    }

    syncViewport()

    if (
      typeof mobileQuery.addEventListener === 'function' &&
      typeof tabletQuery.addEventListener === 'function'
    ) {
      mobileQuery.addEventListener('change', syncViewport)
      tabletQuery.addEventListener('change', syncViewport)
      return () => {
        mobileQuery.removeEventListener('change', syncViewport)
        tabletQuery.removeEventListener('change', syncViewport)
      }
    }

    mobileQuery.addListener(syncViewport)
    tabletQuery.addListener(syncViewport)
    return () => {
      mobileQuery.removeListener(syncViewport)
      tabletQuery.removeListener(syncViewport)
    }
  }, [])

  useEffect(() => {
    if (!isWizardFocused) {
      return
    }

    scrollToSection('finder')
  }, [activeDiscoverScreen, isWizardFocused, safeCurrentStep])

  function handleDiscoverSearch() {
    trackEvent('eligibility_search_submitted', {
      zone_type: input.zoneType,
      query_length: industryQuery.trim().length,
      compare_zones: compareZones,
    })
    onFinderStateChange({
      focus: true,
      step: 'discover',
      discoverScreen: 'results',
      historyMode: 'push',
    })
    void discoverIndustry()
  }

  function handleBackToDiscoverSearch() {
    onFinderStateChange({
      focus: true,
      step: 'discover',
      discoverScreen: 'compose',
      historyMode: 'push',
    })
  }

  function handleWizardStepSelect(step: EligibilityStep) {
    if (step === 'discover') {
      onFinderStateChange({
        focus: true,
        step: 'discover',
        discoverScreen: 'compose',
        historyMode: 'push',
      })
      return
    }

    if (step === 'adjust') {
      if (!canOpenAdjustStep) {
        return
      }

      onFinderStateChange({
        focus: true,
        step: 'adjust',
        historyMode: 'push',
      })
      return
    }

    if (!canOpenResultStep) {
      return
    }

    onFinderStateChange({
      focus: true,
      step: 'result',
      historyMode: 'push',
    })
  }

  function runQuickSearch(value: string) {
    trackEvent('eligibility_quick_search_selected', {
      zone_type: input.zoneType,
      query_length: value.trim().length,
    })
    onFinderStateChange({
      focus: true,
      step: 'discover',
      discoverScreen: 'results',
      historyMode: 'push',
    })
    setIndustryQuery(value)
    void discoverIndustry()
  }

  function handleSuggestionSelect(
    suggestion: ReturnType<typeof useEligibilityStore.getState>['industrySuggestions'][number],
  ) {
    trackEvent('eligibility_suggestion_selected', {
      zone_type: input.zoneType,
      code: suggestion.code,
      match_kind: suggestion.matchKind,
      source: suggestion.source,
    })
    onFinderStateChange({
      focus: true,
      step: 'adjust',
      historyMode: 'push',
    })
    void applyIndustrySuggestion(suggestion)
  }

  function handleEvaluateStep() {
    trackEvent('eligibility_evaluation_requested', {
      zone_type: input.zoneType,
      compare_zones: compareZones,
      additional_code_count: filledAdditionalCodeCount,
      active_flag_count: activeFlagCount,
      regulatory_fit_manual: input.regulatoryFit !== 'auto',
    })
    onFinderStateChange({
      focus: true,
      historyMode: 'push',
    })
    void evaluate()
  }

  function handleContinueManualStep() {
    trackEvent('eligibility_manual_entry_started', {
      zone_type: input.zoneType,
      compare_zones: compareZones,
    })
    onFinderStateChange({
      focus: true,
      step: 'adjust',
      historyMode: 'push',
    })
  }

  function handleFinderEntry() {
    onFinderStateChange({
      focus: false,
      step: 'discover',
      discoverScreen: 'compose',
      historyMode: 'replace',
    })
    scrollToSection('hero-search')
    window.requestAnimationFrame(() => {
      const textarea = document.getElementById('hero-discovery-query')

      if (textarea instanceof HTMLTextAreaElement) {
        textarea.focus()
      }
    })
  }

  function handleExitWizardFocus() {
    onExitWizardFocus()
  }

  return (
    <>
      {showOverviewSections ? (
        <>
          <section className="space-y-4">
            <div className="grid gap-4 xl:grid-cols-[minmax(0,1.03fr)_minmax(0,0.97fr)] xl:items-stretch">
              <div className="relative overflow-hidden rounded-[20px] border border-[var(--border-accent-strong)] bg-[var(--surface-strong)] shadow-[var(--shadow-xl)] sm:rounded-[24px]">
                <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-[var(--hero-glow)]" />
                <div className="relative flex h-full flex-col px-5 py-5 sm:px-7 sm:py-6 lg:px-8 lg:py-7">
                  <Badge className="w-fit">마곡 일반산업단지 전용</Badge>
                  <div className="mt-3 hidden flex-wrap gap-2 sm:flex">
                    <div className="rounded-[12px] border border-[var(--border-soft)] bg-[var(--surface-strong)] px-3 py-1 text-xs font-medium text-[var(--foreground-subtle)]">
                      상담 준비용 빠른 검색
                    </div>
                    <div className="rounded-[12px] border border-[var(--border-soft)] bg-[var(--surface-strong)] px-3 py-1 text-xs font-medium text-[var(--foreground-subtle)]">
                      판정 근거 바로 설명
                    </div>
                  </div>
                  <h1 className="mt-4 max-w-[18ch] font-display text-[2.05rem] font-semibold leading-[1.08] tracking-[-0.045em] text-[var(--foreground)] sm:max-w-[22ch] sm:text-[2.9rem] lg:max-w-[23ch] lg:text-[3.45rem]">
                    마곡 입주 상담,
                    <br />
                    <span>업종코드부터 예비판정까지 한 번에</span>
                  </h1>
                  <p className="mt-4 max-w-2xl text-sm leading-7 text-[var(--foreground-muted)] sm:text-[15px] sm:leading-7">
                    사업자 업태·종목이나 하는 일을 적으면 마곡에서 먼저 볼 업종코드를
                    추천하고, 가능·조건부·심의 필요를 판정 근거와 함께 보여드립니다.
                    상담 준비와 설명에 바로 쓸 수 있습니다.
                  </p>

                  <div className="mt-6 grid gap-3 sm:grid-cols-2 sm:auto-rows-fr">
                    <div className="flex h-full flex-col gap-2.5 rounded-[16px] border border-[var(--border-soft)] bg-[var(--surface-strong)] p-4 shadow-[var(--shadow-sm)]">
                      <Button
                        size="lg"
                        onClick={handleFinderEntry}
                        className="w-full justify-center whitespace-nowrap"
                      >
                        업종코드 추천받기
                        <ArrowRight className="size-4" />
                      </Button>
                      <p className="min-h-12 text-sm leading-6 text-[var(--foreground-muted)]">
                        고객 업태·종목만으로 후보 코드를 먼저 좁힙니다.
                      </p>
                    </div>

                    <div className="flex h-full flex-col gap-2.5 rounded-[16px] border border-[var(--border-soft)] bg-[var(--surface-strong)] p-4 shadow-[var(--shadow-sm)]">
                      <Button
                        variant="secondary"
                        onClick={onOpenDirectory}
                        className="w-full justify-center whitespace-nowrap"
                      >
                        전체 코드 사전 보기
                      </Button>
                      <p className="min-h-12 text-sm leading-6 text-[var(--foreground-muted)]">
                        상담 전에 전체 허용 코드를 훑어볼 때 씁니다.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <Card
                id="hero-search"
                className="border-[var(--border-accent)] bg-[var(--surface-strong)] shadow-[var(--shadow-xl)]"
              >
                <CardContent className="space-y-5 p-5 sm:p-6">
                  <div className="flex items-start gap-3">
                    <div className="mt-1 inline-flex size-10 items-center justify-center rounded-[14px] bg-[var(--accent-soft)] text-[var(--accent-strong)] shadow-[var(--shadow-sm)]">
                      <SearchCheck className="size-5" />
                    </div>
                    <div>
                      <Badge variant="muted" className="w-fit">빠른 검색</Badge>
                      <h2 className="mt-3 font-display text-[1.75rem] font-semibold leading-[1.1] text-[var(--foreground)] sm:text-[2.05rem]">
                        컨설턴트·중개사를 위한
                        <br />
                        빠른 검색 홈
                      </h2>
                      <p className="mt-3 text-sm leading-7 text-[var(--foreground-muted)]">
                        업종코드는 몰라도 됩니다. 고객이 말한 업태·종목이나 업무 내용을
                        그대로 적고, 추천 코드와 예비판정을 한 번에 확인해 보세요.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Textarea
                      id="hero-discovery-query"
                      className="min-h-24 text-base leading-7"
                      value={industryQuery}
                      placeholder="예: 소프트웨어 개발 도급, 온라인 교육 플랫폼 운영, 프랜차이즈 카페 본사"
                      onChange={(event) => setIndustryQuery(event.target.value)}
                    />
                    <div className="space-y-1">
                      <p className="text-sm leading-6 text-[var(--foreground-muted)]">
                        사업자등록증 업태·종목, 실무 메모, 통화 중에 들은 표현 그대로
                        적으셔도 됩니다.
                      </p>
                      <p className="text-xs leading-5 text-[var(--foreground-subtle)]">
                        입력 후 '추천 코드 찾기' 버튼이 활성화됩니다.
                      </p>
                    </div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2 sm:auto-rows-fr">
                    <div className="flex h-full flex-col gap-2.5 rounded-[16px] border border-[var(--border-soft)] bg-[var(--surface-soft)] p-4">
                      <Button
                        disabled={discoveryStatus === 'loading' || !industryQuery.trim()}
                        loading={discoveryStatus === 'loading'}
                        className="w-full justify-center whitespace-nowrap"
                        onClick={handleDiscoverSearch}
                      >
                        {discoveryStatus !== 'loading' ? <SearchCheck className="size-4" /> : null}
                        {discoveryStatus === 'loading' ? '추천 코드 찾는 중...' : '추천 코드 찾기'}
                      </Button>
                      <p className="min-h-12 text-sm leading-6 text-[var(--foreground-muted)]">
                        설명을 적으면 마곡 기준 후보 코드를 먼저 보여드립니다.
                      </p>
                    </div>

                    <div className="flex h-full flex-col gap-2.5 rounded-[16px] border border-[var(--border-soft)] bg-[var(--surface-soft)] p-4">
                      <Button
                        variant="secondary"
                        className="w-full justify-center whitespace-nowrap"
                        onClick={handleContinueManualStep}
                      >
                        직접 입력으로 계속
                      </Button>
                      <p className="min-h-12 text-sm leading-6 text-[var(--foreground-muted)]">
                        코드를 알고 있으면 예비판정 화면으로 바로 넘어갑니다.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-3 sm:grid-cols-3 sm:auto-rows-fr">
              {heroBenefitCards.map((item, index) => (
                <div
                  key={item.title}
                  className={`flex h-full flex-col rounded-[14px] border px-4 py-4 ${
                    item.tone === 'hero'
                      ? 'border-[var(--border-accent-strong)] bg-[var(--surface-muted)] shadow-[var(--shadow-sm)]'
                      : 'border-[var(--border-soft)] bg-[var(--surface-soft)] shadow-[var(--shadow-sm)]'
                  }`}
                >
                  <div className="inline-flex size-8 items-center justify-center rounded-[12px] bg-[var(--accent-soft)] text-sm font-semibold text-[var(--accent-strong)] shadow-[var(--shadow-sm)]">
                    {index + 1}
                  </div>
                  <div className="mt-3 text-sm font-semibold leading-5 text-[var(--foreground)]">
                    {item.title}
                  </div>
                  <div className="mt-2 min-h-12 text-sm leading-6 text-[var(--foreground-muted)]">
                    {item.description}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </>
      ) : null}

      <section
        id="finder"
        aria-label="업종코드 분석 위저드"
        className={`${
          isCompactWizardFocused
            ? 'rounded-none border-0 bg-transparent p-0 shadow-none'
            : isDesktopWizardFocused
              ? 'rounded-[18px] border border-[var(--border-accent)] bg-[var(--surface-strong)] p-5 shadow-[var(--shadow-xl)] xl:p-6'
              : 'rounded-[16px] border border-[var(--border-accent)] bg-[var(--surface-strong)] p-3.5 shadow-[var(--shadow-xl)] sm:rounded-[20px] sm:p-8'
        }`}
      >
        {isCompactWizardFocused ? (
          <div className="mb-4 flex items-start justify-between gap-4 lg:hidden">
            <div className="min-w-0 max-w-2xl">
              <Badge variant="muted" className="w-fit">{currentWizardBadge}</Badge>
              <h2 className="mt-3 font-display text-[2rem] font-semibold leading-[1.04] text-[var(--foreground)] sm:text-[2.45rem]">
                {currentWizardTitle}
              </h2>
              <p className="mt-2 max-w-xl text-sm leading-6 text-[var(--foreground-muted)] sm:text-[15px] sm:leading-7">
                {currentWizardHint}
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="shrink-0"
              onClick={handleExitWizardFocus}
            >
              전체 보기
            </Button>
          </div>
        ) : (
          <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <Badge variant="muted" className="w-fit">입주 예비판정 워크스페이스</Badge>
              <h2 className="mt-3 max-w-3xl font-display text-[1.8rem] font-semibold leading-[1.06] text-[var(--foreground)] sm:mt-4 sm:text-4xl">
                검색 결과를 고르고
                <br />
                예비판정을 이어서 읽는 공간입니다
              </h2>
              <p className="mt-2 text-[13px] leading-5 text-[var(--foreground-subtle)] sm:hidden">
                {currentWizardHint}
              </p>
              <p className="mt-3 hidden max-w-3xl text-sm leading-7 text-[var(--foreground-muted)] sm:block">
                위 빠른 검색에서 고객 업태·종목을 먼저 정리한 뒤, 여기서 추천 결과 선택,
                조건 보정, 판정 읽기를 한 번에 이어서 진행하면 상담 흐름이 가장 자연스럽습니다.
              </p>
            </div>
              <div className="hidden rounded-[14px] border border-[var(--border)] bg-[var(--surface-strong)] px-4 py-3 text-sm leading-6 text-[var(--foreground-muted)] shadow-[var(--shadow-sm)] lg:block lg:max-w-sm">
                위에서 검색을 시작하고, 여기서는 '추천 결과 선택 → 예외 조건 확인 →
                결과 설명' 순서로 이어가면 실무 설명이 가장 매끄럽습니다.
            </div>
          </div>
        )}

        <div className={`${isCompactWizardFocused ? 'space-y-4 sm:space-y-6' : isDesktopWizardFocused ? 'space-y-4' : 'mt-4 space-y-3.5 sm:mt-8 sm:space-y-6'}`}>
          <div className={isDesktopWizardFocused ? 'grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start' : undefined}>
            <div className="space-y-3.5 sm:space-y-6">
              {!isCompactWizardFocused && showSlimDiscoverOverview ? (
                <section className="rounded-[20px] border border-[var(--border-accent-strong)] bg-[var(--surface-muted)] p-5 shadow-[var(--shadow-sm)] sm:p-6">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="max-w-2xl">
                      <Badge variant="muted" className="w-fit">이렇게 시작하세요</Badge>
                      <h3 className="mt-3 font-display text-[1.6rem] font-semibold leading-[1.12] text-[var(--foreground)] sm:text-[1.9rem]">
                        위 빠른 검색에서 시작하거나
                        <br />
                        직접 입력으로 바로 넘어가세요
                      </h3>
                      <p className="mt-3 text-sm leading-7 text-[var(--foreground-muted)]">
                        히어로의 빠른 검색은 통화 중 들은 표현 그대로 후보 코드를 좁히는
                        용도입니다. 업종코드를 이미 알고 있다면 아래 단계로 바로 예비판정을
                        이어갈 수 있습니다.
                      </p>
                    </div>
                    <div className="flex flex-col gap-2 sm:flex-row lg:flex-col">
                      <Button variant="secondary" onClick={handleFinderEntry}>
                        빠른 검색으로 올라가기
                      </Button>
                      <Button onClick={handleContinueManualStep}>
                        직접 입력으로 계속
                      </Button>
                    </div>
                  </div>
                </section>
              ) : null}

              <div className={`${isCompactWizardFocused ? 'hidden sm:grid sm:grid-cols-3 sm:gap-3' : 'grid grid-cols-3 gap-2 sm:gap-3 lg:gap-4'}`}>
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
                      aria-label={isLocked ? `${step.title} (검색 후 활성화)` : step.title}
                      title={isLocked ? '검색 후 활성화됩니다.' : undefined}
                      className={`rounded-[12px] border px-2.5 py-2.5 text-left transition sm:rounded-[14px] sm:px-4 sm:py-4 lg:px-5 lg:py-5 ${
                        isActive
                          ? 'border-[var(--border-accent-strong)] bg-[var(--surface-muted)] shadow-[var(--shadow-sm)]'
                          : isComplete
                            ? 'border-[var(--border-accent)] bg-[var(--surface-strong)] shadow-[var(--shadow-sm)]'
                            : 'border-[var(--border)] bg-[var(--surface)]'
                      } ${
                        isLocked
                          ? 'cursor-not-allowed opacity-60'
                          : 'cursor-pointer hover:border-[var(--border-accent-strong)] hover:bg-[var(--surface-strong)]'
                      }`}
                    >
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div
                          className={`inline-flex size-7 items-center justify-center rounded-[10px] text-[11px] font-semibold sm:size-9 sm:text-sm ${
                            isActive || isComplete
                              ? 'bg-[var(--accent)] text-[var(--accent-foreground)]'
                              : 'bg-[var(--surface-capsule-muted)] text-[var(--foreground-subtle)]'
                          }`}
                        >
                          {isComplete ? (
                            <CheckCircle2 className="size-4" />
                          ) : isLocked ? (
                            <Lock className="size-4" />
                          ) : (
                            index + 1
                          )}
                        </div>
                        <div className="min-w-0">
                          <div className="hidden text-xs font-medium text-[var(--foreground-subtle)] sm:block">
                            {step.badge}
                          </div>
                          <div className="text-[11px] font-semibold leading-4 text-[var(--foreground)] sm:hidden">
                            {step.shortTitle}
                          </div>
                          <div className="hidden text-sm font-semibold leading-5 text-[var(--foreground)] sm:block lg:text-base">
                            {step.title}
                          </div>
                          {isLocked ? (
                            <div className="mt-1 hidden items-center gap-1 text-xs font-medium leading-4 text-[var(--foreground-subtle)] sm:inline-flex">
                              <Lock className="size-3.5" />
                              검색 후 활성화
                            </div>
                          ) : null}
                        </div>
                      </div>
                    </button>
                  )
                })}
              </div>

              <Card className={`${isCompactWizardFocused ? 'rounded-[18px] border-[var(--border)] bg-[var(--surface-strong)] shadow-[var(--shadow-lg)]' : isDesktopWizardFocused ? 'rounded-[18px] border-[var(--border-accent)] bg-[var(--surface-strong)] shadow-[var(--shadow-xl)]' : 'rounded-[16px] border-[var(--border-accent)] bg-[var(--surface-strong)] shadow-[var(--shadow-lg)] sm:rounded-[18px]'}`}>
                <CardContent className={`${isCompactWizardFocused ? 'space-y-5 p-4 sm:space-y-7 sm:p-7' : isDesktopWizardFocused ? 'space-y-6 p-5 xl:space-y-7 xl:p-7' : 'space-y-3 p-3.5 sm:space-y-6 sm:p-6'}`}>
                  {!isCompactWizardFocused || safeCurrentStep !== 'discover' ? (
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                      <div className={isCompactWizardFocused ? 'hidden sm:block' : undefined}>
                        <Badge variant="muted" className="w-fit">{currentWizardBadge}</Badge>
                        <h3 className="mt-2 max-w-3xl font-display text-[1.9rem] font-semibold leading-[1.08] text-[var(--foreground)] sm:mt-4 sm:text-[2.2rem] xl:text-[2.45rem]">
                          {currentWizardTitle}
                        </h3>
                        <p className="mt-3 hidden max-w-2xl text-[15px] leading-7 text-[var(--foreground-muted)] sm:block">
                          {currentWizardDescription}
                        </p>
                      </div>
                      <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
                        {safeCurrentStep !== 'discover' ? (
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() =>
                              onFinderStateChange({
                                focus: true,
                                step: 'discover',
                                discoverScreen: 'compose',
                                historyMode: 'push',
                              })
                            }
                            className="w-full whitespace-nowrap sm:w-auto sm:flex-none"
                          >
                            <span className="sm:hidden">처음으로</span>
                            <span className="hidden sm:inline">처음 단계로 돌아가기</span>
                          </Button>
                        ) : null}
                        {isWizardFocused ? (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleExitWizardFocus}
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
                          전체 코드 사전 보기
                          <ArrowRight className="size-4" />
                        </Button>
                      </div>
                    </div>
                  ) : null}

                  <div
                    key={panelTransitionKey}
                    className="animate-fade-in space-y-5 sm:space-y-6"
                  >
                    {safeCurrentStep === 'discover' && showSlimDiscoverOverview ? (
                      <section className="rounded-[18px] border border-[var(--border)] bg-[var(--surface-soft)] px-4 py-4 shadow-[var(--shadow-sm)] sm:px-5">
                        <div className="text-sm font-semibold text-[var(--foreground)]">
                          검색을 시작하면 추천 결과가 이 영역에 이어집니다
                        </div>
                        <p className="mt-2 text-sm leading-6 text-[var(--foreground-muted)]">
                          위에서 검색을 시작하면 먼저 볼 코드와 함께 확인할 후보가 여기에
                          정리되고, 조건이 걸리는 업종은 따로 표시됩니다. 그다음 2단계와
                          3단계가 순서대로 활성화됩니다.
                        </p>
                      </section>
                    ) : null}

                    {safeCurrentStep === 'discover' && !showSlimDiscoverOverview ? (
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
                        additionalCodes={additionalCodes}
                        compareZones={compareZones}
                        status={status}
                        onFieldChange={setField}
                        onFlagChange={setFlag}
                        onCompareZonesChange={setCompareZones}
                        onAddAdditionalCode={addAdditionalCode}
                        onRemoveAdditionalCode={removeAdditionalCode}
                        onAdditionalCodeFieldChange={setAdditionalCodeField}
                        onEvaluate={handleEvaluateStep}
                        onReset={onResetFinder}
                        onPrevious={() =>
                          onFinderStateChange({
                            focus: true,
                            step: 'discover',
                            discoverScreen: 'compose',
                            historyMode: 'push',
                          })
                        }
                        primaryActionLabel={
                          compareZones ? '두 구역 비교 판정 보기' : '결과 보기'
                        }
                        secondaryActionLabel="이전 단계"
                        defaultExpanded
                        embedded
                      />
                    ) : null}

                    {safeCurrentStep === 'result' ? (
                <ResultPanel
                  input={input}
                  result={result}
                  multiCodeResults={multiCodeResults}
                  compareZones={compareZones}
                  comparisonResults={comparisonResults}
                  status={status}
                  error={error}
                  onEvaluate={evaluate}
                  onAdjust={() =>
                    onFinderStateChange({
                      focus: true,
                      step: 'adjust',
                      historyMode: 'push',
                    })
                  }
                  onOpenGuide={onOpenGuide}
                  onCopyShareLink={onCopyShareLink}
                  onCopyResultSummary={onCopyResultSummary}
                  onPrintResult={onPrintResult}
                  onOpenLibraryEntry={(entryId) =>
                    onOpenLibrary(getLegalLibraryEntrySectionId(entryId))
                  }
                  onOpenLibraryBasis={(basisId) =>
                    onOpenLibrary(getLegalLibraryBasisSectionId(basisId))
                  }
                  sticky={false}
                  stepLabel="3단계"
                  embedded
                />
                    ) : null}
                  </div>
                </CardContent>
              </Card>
            </div>

            {isDesktopWizardFocused ? (
              <aside className="hidden lg:block">
                <div className="sticky top-6 space-y-4">
                  <Card className="border-[var(--border-accent)] bg-[var(--surface-strong)] shadow-[var(--shadow-lg)]">
                    <CardContent className="space-y-4 p-5">
                      <Badge variant="muted" className="w-fit">집중 모드</Badge>
                      <div>
                        <h3 className="font-display text-2xl font-semibold leading-[1.15] text-[var(--foreground)]">
                          지금은 이 흐름만 보면 됩니다
                        </h3>
                        <p className="mt-3 text-sm leading-7 text-[var(--foreground-muted)]">
                          큰 화면에서도 한 단계씩만 읽기 쉽게 정리했습니다. 왼쪽은 입력과 결과,
                          오른쪽은 참고 정보만 남겨 집중도를 높였습니다.
                        </p>
                      </div>
                      <div className="space-y-3">
                        {wizardSteps.map((step, index) => {
                          const isActive = step.id === safeCurrentStep
                          const isComplete = currentWizardIndex > index

                          return (
                            <div
                              key={step.id}
                      className={`rounded-[14px] border px-4 py-4 ${
                                isActive
                                  ? 'border-[var(--border-accent-strong)] bg-[var(--surface-muted)] shadow-[var(--shadow-sm)]'
                                  : isComplete
                                    ? 'border-[var(--border-accent)] bg-[var(--surface-strong)] shadow-[var(--shadow-sm)]'
                                    : 'border-[var(--border-soft)] bg-[var(--surface-strong)]'
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <div
                          className={`inline-flex size-8 items-center justify-center rounded-[10px] text-sm font-semibold ${
                                    isActive || isComplete
                                      ? 'bg-[var(--accent)] text-[var(--accent-foreground)]'
                                      : 'bg-[var(--surface-capsule-muted)] text-[var(--foreground-subtle)]'
                                  }`}
                                >
                                  {index + 1}
                                </div>
                                <div className="min-w-0">
                                  <div className="text-xs font-medium text-[var(--foreground-subtle)]">
                                    {step.badge}
                                  </div>
                                  <div className="mt-1 text-sm font-semibold leading-5 text-[var(--foreground)]">
                                    {step.title}
                                  </div>
                                </div>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-[var(--border)] bg-[var(--surface-strong)] shadow-[var(--shadow-sm)]">
                    <CardContent className="space-y-4 p-5">
                      <div>
                        <div className="text-sm font-semibold text-[var(--foreground)]">
                          지금 입력한 내용
                        </div>
                        <p className="mt-2 text-sm leading-6 text-[var(--foreground-muted)]">
                          {focusRailHint}
                        </p>
                      </div>
                      <div className="grid gap-3">
                        {focusContextCards.map((item) => (
                          <div
                            key={item.label}
                            className="rounded-[14px] border border-[var(--border-soft)] bg-[var(--surface-soft)] px-4 py-3"
                          >
                            <div className="text-xs text-[var(--foreground-subtle)]">{item.label}</div>
                            <div className="mt-1 text-sm font-medium leading-6 text-[var(--foreground)]">
                              {item.value}
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Button variant="secondary" size="sm" onClick={handleExitWizardFocus}>
                          전체 보기
                        </Button>
                        <Button variant="ghost" size="sm" onClick={onOpenDirectory}>
                          전체 코드 사전 보기
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </aside>
            ) : null}
          </div>
        </div>
      </section>

      {showOverviewSections ? (
        <>
          <section className="grid gap-4 xl:grid-cols-[minmax(0,1.06fr)_minmax(0,0.94fr)] xl:items-stretch">
        <Card className="h-full border-[var(--border-accent)] bg-[var(--surface-strong)] shadow-[var(--shadow-lg)]">
          <CardContent className="flex h-full flex-col space-y-5 p-5 sm:p-6">
            <Badge variant="muted">전체 코드 사전</Badge>
            <h2 className="font-display text-[1.9rem] font-semibold leading-[1.08] text-[var(--foreground)] sm:text-[2.2rem]">
              전체 코드 사전
            </h2>
            <p className="max-w-2xl text-sm leading-7 text-[var(--foreground-muted)]">
              추천 결과를 받기 전에 후보를 넓게 보고 싶을 때, 또는 상담 전에 마곡 허용
              코드를 한 번 훑어보고 싶을 때 바로 쓰는 화면입니다.
            </p>

            <div className="grid gap-3 sm:grid-cols-3 sm:auto-rows-fr">
              {dictionaryPreviewCards.map((item) => (
                <div
                  key={item.title}
                  className={`flex h-full flex-col rounded-[14px] border px-4 py-4 ${
                    item.tone === 'strong'
                      ? 'border-[var(--border-accent-strong)] bg-[var(--surface-muted)] shadow-[var(--shadow-sm)]'
                      : 'border-[var(--border)] bg-[var(--surface-soft)] shadow-[var(--shadow-sm)]'
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

            <div className="mt-auto flex flex-wrap gap-3">
              <Button onClick={onOpenDirectory}>
                전체 코드 사전 보기
                <LibraryBig className="size-4" />
              </Button>
              <Button variant="ghost" onClick={() => scrollToSection('criteria')}>
                마곡 기준 빠르게 보기
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card
          id="practical-guide"
          className="h-full border-[var(--border)] bg-[var(--surface-strong)] shadow-[var(--shadow-lg)]"
        >
          <CardContent className="flex h-full flex-col space-y-4 p-5 sm:p-6">
            <div className="inline-flex size-11 items-center justify-center rounded-[14px] bg-[var(--accent-soft)] text-[var(--accent-strong)] shadow-[var(--shadow-sm)]">
              <BookOpenText className="size-5" />
            </div>
            <div>
              <h2 className="font-display text-[1.8rem] font-semibold leading-[1.08] text-[var(--foreground)] sm:text-[2.1rem]">
                실무에서는 보통 이렇게 봅니다
              </h2>
              <p className="mt-3 text-sm leading-7 text-[var(--foreground-muted)]">
                실무에서는 보통 이렇게 봅니다. ① 하는 일을 한 줄로 적고, ② 가까운
                업종코드를 고른 뒤, ③ 가능 / 조건부 가능 / 심의 필요 / 추가 확인 /
                불가 순서로 결과를 읽습니다.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3 sm:auto-rows-fr xl:grid-cols-1">
              {introSteps.map((item) => (
                <div
                  key={item.title}
                className="flex h-full flex-col rounded-[14px] border border-[var(--border)] bg-[var(--surface-strong)] px-4 py-4 shadow-[var(--shadow-sm)]"
                >
                  <div className="text-xs font-semibold tracking-[0.08em] text-[var(--foreground-subtle)]">
                    {item.step}단계
                  </div>
                  <div className="mt-2 text-sm font-semibold text-[var(--foreground)]">
                    {item.title}
                  </div>
                  <p className="mt-2 text-sm font-semibold leading-6 text-[var(--foreground)]">
                    {item.summary}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-[var(--foreground-muted)]">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="space-y-4">
        <div className="max-w-4xl">
          <Badge variant="muted">설명 도구</Badge>
          <h2 className="mt-4 font-display text-3xl font-semibold text-[var(--foreground)]">
            입주 판정을 설명할 수 있게 도와주는 도구들
          </h2>
          <p className="mt-3 text-sm leading-7 text-[var(--foreground-muted)]">
            상담 중 기준을 다시 확인하고, 판정 근거를 문서로 보여주고, 최근 반영 범위까지
            한 흐름으로 설명할 수 있게 정리했습니다.
          </p>
        </div>

        <section id="criteria" className="space-y-3">
          <div className="max-w-3xl">
            <div className="text-sm font-semibold text-[var(--accent-strong)]">
              마곡 기준을 빠르게 파악하는 법
            </div>
            <Badge variant="muted" className="mt-3">법령 참고</Badge>
            <h3 className="mt-4 font-display text-3xl font-semibold text-[var(--foreground)]">
              상담 중 기준을 바로 다시 확인하는 화면입니다
            </h3>
            <p className="mt-3 text-sm leading-7 text-[var(--foreground-muted)]">
              아래는 업종별 허용 코드 목록입니다. 전체 코드를 넓게 볼 때는 코드 사전을
              이용하는 편이 더 빠릅니다.
            </p>
          </div>
          <RulebookTabs onOpenDirectory={onOpenDirectory} />
        </section>

        <section className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-start">
          <Card className="border-[var(--border-accent)] bg-[var(--surface-strong)] shadow-[var(--shadow-lg)]">
            <CardContent className="space-y-5 p-5 sm:p-6">
              <div className="inline-flex size-11 items-center justify-center rounded-[14px] bg-[var(--accent-soft)] text-[var(--accent-strong)] shadow-[var(--shadow-sm)]">
                <BookOpenText className="size-5" />
              </div>
              <div>
                <Badge variant="muted">판정 근거 라이브러리</Badge>
                <h3 className="mt-4 font-display text-[1.9rem] font-semibold leading-[1.08] text-[var(--foreground)] sm:text-[2.2rem]">
                  시행령과 마곡 고시문을
                  <br />
                  문서별로 다시 읽을 수 있습니다
                </h3>
                <p className="mt-3 text-sm leading-7 text-[var(--foreground-muted)]">
                  결과 패널 각주에서 끝내지 않고, 시행령·마곡 고시문을 문서별로 다시 읽을
                  수 있는 화면입니다. 내부 검토 자료 만들 때도 바로 씁니다.
                </p>
              </div>
              <div className="grid gap-3">
                <div className="rounded-[14px] border border-[var(--border-accent)] bg-[var(--surface-muted)] px-4 py-4 text-sm leading-6 text-[var(--foreground-muted)] shadow-[var(--shadow-sm)]">
                  어떤 판정이 어디에서 나왔는지 조문과 문서 단위로 추적해, 상담 설명과
                  내부 공유 자료에 바로 활용하기 좋게 정리했습니다.
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="muted">시행령</Badge>
                  <Badge variant="muted">마곡 고시문</Badge>
                  <Badge variant="muted">조문 / 페이지 힌트</Badge>
                </div>
              </div>
              <div>
                <Button onClick={() => onOpenLibrary()}>
                  법령 라이브러리 열기
                  <ArrowRight className="size-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-[var(--border-neutral)] bg-[var(--surface-neutral)] shadow-[var(--shadow-sm)]">
            <CardContent className="space-y-5 p-5 sm:p-6">
              <div className="inline-flex size-11 items-center justify-center rounded-[14px] bg-[var(--surface-strong)] text-[var(--foreground-muted)] shadow-[var(--shadow-sm)]">
                <FileSearch className="size-5" />
              </div>
              <div>
                <Badge variant="muted">데이터 업데이트 로그</Badge>
                <h3 className="mt-4 font-display text-[1.9rem] font-semibold leading-[1.08] text-[var(--foreground)] sm:text-[2.2rem]">
                  최근 반영 범위도
                  <br />
                  빠르게 확인할 수 있습니다
                </h3>
                <p className="mt-3 text-sm leading-7 text-[var(--foreground-muted)]">
                  판정 기준과 화면 구조가 언제 어떻게 바뀌었는지 기록해둔 이력입니다.
                  '최근 반영 범위' 설명할 때 유용합니다.
                </p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {recentUpdates.map((entry) => (
                  <div
                    key={entry.id}
                    className="rounded-[14px] border border-[var(--border)] bg-[var(--surface-strong)] px-4 py-4 shadow-[var(--shadow-sm)]"
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
      </section>

      <section className="space-y-3">
        <div className="max-w-3xl">
          <Badge variant="muted">대표 업종 가이드</Badge>
          <h2 className="mt-4 font-display text-3xl font-semibold text-[var(--foreground)]">
            자주 찾는 업종은
            <br />
            문서형 가이드로 바로 읽을 수 있습니다
          </h2>
            <p className="mt-3 text-sm leading-7 text-[var(--foreground-muted)]">
              자주 상담 들어오는 업종은 코드별로 '마곡에서 어떻게 보는지'를 문서형
              가이드로 정리했습니다. 고객 설명할 때 그대로 보여주셔도 됩니다.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
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
              className="rounded-[18px] border border-[var(--border)] bg-[var(--surface-strong)] p-5 shadow-[var(--shadow-lg)] sm:p-6"
      >
        <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-3xl">
            <Badge variant="muted">참고용 제휴 링크</Badge>
            <h2 className="mt-4 font-display text-2xl font-semibold text-[var(--foreground)] sm:text-[2rem]">
              업종 분석과 법령 확인이 끝난 뒤 필요할 때만 참고할 수 있습니다
            </h2>
            <p className="mt-3 text-sm leading-7 text-[var(--foreground-muted)]">
              이 영역은 입주 판단용 본문이 아니라 사무실 준비에 참고할 수 있는 외부
              상품 링크입니다. 업종 분석과 법령 확인을 마친 뒤, 고객 사무실 준비를
              도와줄 때 참고할 수 있습니다. 필요한 경우에만 펼쳐서 보도록 기본 노출
              강도를 낮췄습니다.
            </p>
          </div>

                    <div className="rounded-[14px] border border-[var(--border)] bg-[var(--surface-strong)] px-4 py-3 text-xs leading-5 text-[var(--foreground-muted)] shadow-[var(--shadow-sm)]">
            광고보다 본문이 먼저 보이도록
            <br />
            제휴 영역은 기본 접힘 상태로 제공합니다.
          </div>
        </div>

                  <div className="mt-4 rounded-[18px] border border-[var(--border)] bg-[var(--surface-strong)] shadow-[var(--shadow-sm)]">
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
              <div className="grid gap-4 xl:grid-cols-[260px_minmax(0,1fr)] xl:items-start">
            <Card className="border-[var(--border)] bg-[var(--surface-soft)] shadow-[var(--shadow-sm)]">
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

                    <div className="rounded-[14px] border border-[var(--info-border)] bg-[var(--info-bg)] px-4 py-4">
                      <div className="flex items-start gap-3">
                        <div className="inline-flex size-10 shrink-0 items-center justify-center rounded-[14px] bg-[var(--accent-soft)] text-[var(--accent-strong)] shadow-[var(--shadow-sm)]">
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

                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-4">
                  {affiliateWidgets.map((widget) => (
                    <Card
                      key={widget.src}
              className="border-[var(--border)] bg-[var(--surface-strong)] shadow-[var(--shadow-sm)]"
                    >
                      <CardContent className="flex flex-col p-4 sm:p-5">
                        <div className="flex items-start justify-between gap-2">
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
                        <div className="mt-3 text-[15px] font-semibold leading-6 tracking-[-0.01em] text-[var(--foreground)] sm:text-base">
                          {widget.headline}
                        </div>
              <div className="mt-3 flex items-start justify-center rounded-[14px] border border-[var(--border)] bg-[var(--surface-soft)] px-2 py-3">
                          <iframe
                            src={widget.src}
                            title={widget.title}
                            width="120"
                            height="240"
                            frameBorder="0"
                            scrolling="no"
                            referrerPolicy="unsafe-url"
                            loading="lazy"
            className="overflow-hidden rounded-[12px] bg-[var(--surface-strong)]"
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
    additionalCodes,
    multiCodeResults,
    compareZones,
    comparisonResults,
    status,
    error,
    industryQuery,
    industrySuggestions,
    discoveryStatus,
    discoveryError,
    currentStep,
    setField,
    setFlag,
    setCompareZones,
    setAdditionalCodeField,
    addAdditionalCode,
    removeAdditionalCode,
    setCurrentStep,
    setIndustryQuery,
    discoverIndustry,
    applyIndustrySuggestion,
    evaluate,
    loadSharedResult,
    loadFinderDraft,
    reset,
  } = useEligibilityStore()

  const initialHashState = getHashState(window.location.hash)
  const [view, setView] = useState<AppView>(() => initialHashState.view)
  const [guideCode, setGuideCode] = useState<string | null>(() => initialHashState.guideCode)
  const [homeSectionId, setHomeSectionId] = useState<string>(() =>
    initialHashState.view === 'home' ? initialHashState.sectionId : 'top',
  )
  const [libraryFocusTargetId, setLibraryFocusTargetId] = useState<string | null>(() =>
    initialHashState.view === 'library' ? initialHashState.sectionId : null,
  )
  const [discoverScreen, setDiscoverScreen] = useState<DiscoverScreen>('compose')
  const [isWizardFocused, setIsWizardFocused] = useState(false)
  const [isHashInitialized, setIsHashInitialized] = useState(false)
  const [activeSharedFinderHash, setActiveSharedFinderHash] = useState<string | null>(
    null,
  )
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isHistoryOpen, setIsHistoryOpen] = useState(false)
  const [recentHistory, setRecentHistory] = useState<RecentEligibilityHistoryEntry[]>(
    () => loadRecentEligibilityHistory(),
  )
  const lastTrackedResultKeyRef = useRef<string | null>(null)
  const pendingFinderHistoryModeRef = useRef<HistoryMode>('replace')

  const syncFromHash = useCallback(() => {
    const nextHashState = getHashState(window.location.hash)

    setView(nextHashState.view)
    setGuideCode(nextHashState.guideCode)
    setHomeSectionId(nextHashState.view === 'home' ? nextHashState.sectionId : 'top')
    setLibraryFocusTargetId(
      nextHashState.view === 'library' ? nextHashState.sectionId : null,
    )

    if (nextHashState.sharedState) {
      loadSharedResult(nextHashState.sharedState)
      setDiscoverScreen('results')
      setIsWizardFocused(true)
      setActiveSharedFinderHash(window.location.hash)
    } else {
      setActiveSharedFinderHash(null)

      if (nextHashState.view === 'home' && nextHashState.sectionId === 'finder') {
        const storedDraft =
          nextHashState.mode === 'overview' ? null : loadFinderWizardDraft()

        if (storedDraft) {
          const nextStep = nextHashState.step ?? storedDraft.currentStep
          const nextDiscoverScreen =
            nextHashState.discoverScreen ??
            (nextStep === 'discover' ? storedDraft.discoverScreen : 'results')
          const nextFocus =
            nextHashState.mode === 'focus' || nextHashState.hasExplicitFinderState
              ? true
              : storedDraft.isWizardFocused

          loadFinderDraft({
            input: storedDraft.input,
            compareZones: storedDraft.compareZones,
            additionalCodes: storedDraft.additionalCodes,
            currentStep: nextStep,
            industryQuery: storedDraft.industryQuery,
          })
          setDiscoverScreen(nextDiscoverScreen)
          setIsWizardFocused(nextFocus)

          if (
            nextStep === 'discover' &&
            nextDiscoverScreen === 'results' &&
            storedDraft.industryQuery.trim()
          ) {
            void discoverIndustry()
          }
        } else if (nextHashState.mode === 'overview') {
          setIsWizardFocused(false)
          setDiscoverScreen('compose')
          setCurrentStep('discover')
        } else if (nextHashState.mode === 'focus' || nextHashState.hasExplicitFinderState) {
          const nextStep = nextHashState.step ?? 'discover'
          const nextDiscoverScreen =
            nextHashState.discoverScreen ??
            (nextStep === 'discover' ? 'compose' : 'results')

          setIsWizardFocused(true)
          setDiscoverScreen(nextStep === 'result' ? 'compose' : nextDiscoverScreen)
          setCurrentStep(nextStep === 'result' ? 'discover' : nextStep)
        } else {
          setIsWizardFocused(false)
          setDiscoverScreen('compose')
          setCurrentStep('discover')
        }
      } else if (nextHashState.view === 'home') {
        setIsWizardFocused(false)
        setDiscoverScreen('compose')
        setCurrentStep('discover')
      }
    }

    if (nextHashState.view === 'home') {
      scrollToSection(nextHashState.sectionId)
    }

    setIsHashInitialized(true)
  }, [discoverIndustry, loadFinderDraft, loadSharedResult, setCurrentStep])

  useEffect(() => {
    const frameId = window.requestAnimationFrame(() => {
      syncFromHash()
    })
    window.addEventListener('hashchange', syncFromHash)
    window.addEventListener('popstate', syncFromHash)

    return () => {
      window.cancelAnimationFrame(frameId)
      window.removeEventListener('hashchange', syncFromHash)
      window.removeEventListener('popstate', syncFromHash)
    }
  }, [syncFromHash])

  useEffect(() => {
    if (!isHashInitialized || view !== 'home' || homeSectionId !== 'finder') {
      pendingFinderHistoryModeRef.current = 'replace'
      return
    }

    if (
      activeSharedFinderHash &&
      window.location.hash === activeSharedFinderHash &&
      isWizardFocused &&
      currentStep === 'result'
    ) {
      return
    }

    const nextHash = buildHomeHash({
      sectionId: 'finder',
      mode: isWizardFocused ? 'focus' : 'overview',
      step: isWizardFocused ? currentStep : null,
      discoverScreen:
        isWizardFocused && currentStep === 'discover' ? discoverScreen : null,
    })

    if (window.location.hash === nextHash) {
      pendingFinderHistoryModeRef.current = 'replace'
      return
    }

    const historyMode = pendingFinderHistoryModeRef.current

    if (historyMode === 'push') {
      window.history.pushState(null, '', nextHash)
    } else {
      window.history.replaceState(null, '', nextHash)
    }
    pendingFinderHistoryModeRef.current = 'replace'
  }, [
    activeSharedFinderHash,
    currentStep,
    discoverScreen,
    homeSectionId,
    isHashInitialized,
    isWizardFocused,
    view,
  ])

  useEffect(() => {
    if (!isHashInitialized) {
      return
    }

    if (view !== 'home' || homeSectionId !== 'finder' || !isWizardFocused) {
      return
    }

    const hasDraftContent =
      Boolean(industryQuery.trim()) ||
      Boolean(input.ksicCode.trim()) ||
      Boolean(input.ksicName.trim()) ||
      additionalCodes.some((item) => item.ksicCode.trim() || item.ksicName.trim()) ||
      currentStep !== 'discover' ||
      discoverScreen === 'results'

    if (!hasDraftContent) {
      clearFinderWizardDraft()
      return
    }

    saveFinderWizardDraft({
      input,
      compareZones,
      additionalCodes,
      industryQuery,
      currentStep,
      discoverScreen,
      isWizardFocused,
    })
  }, [
    additionalCodes,
    compareZones,
    currentStep,
    discoverScreen,
    homeSectionId,
    industryQuery,
    input,
    isHashInitialized,
    isWizardFocused,
    view,
  ])

  useEffect(() => {
    if (status === 'loading') {
      lastTrackedResultKeyRef.current = null
    }
  }, [status])

  useEffect(() => {
    if (status !== 'ready' || !result) {
      return
    }

    const filledAdditionalCodeCount = additionalCodes.filter(
      (item) => item.ksicCode.trim() || item.ksicName.trim(),
    ).length
    const nextKey = [
      input.zoneType,
      input.ksicCode.trim(),
      input.ksicName.trim(),
      compareZones ? 'compare' : 'single',
      filledAdditionalCodeCount,
      multiCodeResults?.length ?? 1,
      result.verdict,
    ].join('|')

    if (lastTrackedResultKeyRef.current === nextKey) {
      return
    }

    lastTrackedResultKeyRef.current = nextKey
    trackEvent('eligibility_result_viewed', {
      zone_type: input.zoneType,
      verdict: result.verdict,
      compare_zones: compareZones,
      additional_code_count: filledAdditionalCodeCount,
      multi_code_count: multiCodeResults?.length ?? 1,
    })
  }, [
    additionalCodes,
    compareZones,
    input.ksicCode,
    input.ksicName,
    input.zoneType,
    multiCodeResults,
    result,
    status,
  ])

  function handleFinderStateChange({
    focus,
    step,
    discoverScreen: nextDiscoverScreen,
    historyMode = 'replace',
  }: {
    focus?: boolean
    step?: EligibilityStep
    discoverScreen?: DiscoverScreen
    historyMode?: HistoryMode
  }) {
    pendingFinderHistoryModeRef.current = historyMode
    setActiveSharedFinderHash(null)
    setView('home')
    setGuideCode(null)
    setHomeSectionId('finder')

    if (typeof focus === 'boolean') {
      setIsWizardFocused(focus)
    }

    if (nextDiscoverScreen) {
      setDiscoverScreen(nextDiscoverScreen)
    }

    if (step && step !== 'result') {
      setCurrentStep(step)
    }
  }

  function handleExitWizardFocus() {
    clearFinderWizardDraft()
    pendingFinderHistoryModeRef.current = 'replace'
    setActiveSharedFinderHash(null)
    setView('home')
    setGuideCode(null)
    setHomeSectionId('finder')
    setIsHistoryOpen(false)
    setIsWizardFocused(false)
    setDiscoverScreen('compose')
    setCurrentStep('discover')
    scrollToSection('finder')
  }

  function handleResetFinder() {
    clearFinderWizardDraft()
    pendingFinderHistoryModeRef.current = 'replace'
    setActiveSharedFinderHash(null)
    setView('home')
    setGuideCode(null)
    setHomeSectionId('finder')
    setIsHistoryOpen(false)
    setIsWizardFocused(false)
    setDiscoverScreen('compose')
    reset()
    scrollToSection('finder')
  }

  async function handleCopyShareLink() {
    const shareUrl = `${window.location.origin}${window.location.pathname}${createSharedFinderHash(
      input,
      {
        compareZones,
        additionalCodes,
      },
    )}`
    await copyTextToClipboard(shareUrl)
    trackEvent('eligibility_share_link_copied', {
      zone_type: input.zoneType,
      compare_zones: compareZones,
      additional_code_count: additionalCodes.filter(
        (item) => item.ksicCode.trim() || item.ksicName.trim(),
      ).length,
    })
  }

  async function handleCopyResultSummary() {
    if (!result) {
      return
    }

    await copyTextToClipboard(
      buildEligibilityResultSummary(input, result, {
        compareZones,
        comparisonResults,
        multiCodeResults,
      }),
    )
    trackEvent('eligibility_result_summary_copied', {
      zone_type: input.zoneType,
      compare_zones: compareZones,
      additional_code_count: additionalCodes.filter(
        (item) => item.ksicCode.trim() || item.ksicName.trim(),
      ).length,
    })
  }

  function handlePrintResult() {
    if (!result) {
      return
    }

    trackEvent('eligibility_result_print_requested', {
      zone_type: input.zoneType,
      compare_zones: compareZones,
      additional_code_count: additionalCodes.filter(
        (item) => item.ksicCode.trim() || item.ksicName.trim(),
      ).length,
    })

    const printWindow = window.open('', '_blank', 'noopener,noreferrer')

    if (!printWindow) {
      window.print()
      return
    }

    printWindow.document.open()
    printWindow.document.write(
      buildEligibilityPrintDocument(input, result, {
        compareZones,
        comparisonResults,
        multiCodeResults,
      }),
    )
    printWindow.document.close()
  }

  function handleToggleHistory() {
    setRecentHistory(loadRecentEligibilityHistory())
    setIsHistoryOpen((prev) => !prev)
  }

  function handleClearRecentHistory() {
    clearRecentEligibilityHistory()
    setRecentHistory([])
  }

  function handleOpenRecentHistory(entry: RecentEligibilityHistoryEntry) {
    trackEvent('eligibility_recent_history_opened', {
      compare_zones: entry.compareZones,
      additional_code_count: entry.additionalCodes.length,
      primary_verdict: entry.primaryVerdict,
    })
    setIsMobileMenuOpen(false)
    setIsHistoryOpen(false)
    window.history.replaceState(null, '', entry.shareHash)
    syncFromHash()
  }

  function openDirectoryView() {
    setView('directory')
    setGuideCode(null)
    setIsHistoryOpen(false)
    window.history.replaceState(null, '', '#directory')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function openLibraryView(targetId = 'library') {
    const normalizedTargetId = typeof targetId === 'string' ? targetId : 'library'

    trackEvent(
      normalizedTargetId.startsWith('library-basis-')
        ? 'eligibility_library_basis_opened'
        : normalizedTargetId.startsWith('library-entry-')
          ? 'eligibility_library_entry_opened'
          : 'eligibility_library_opened',
      {
        target_id: normalizedTargetId,
      },
    )
    setView('library')
    setGuideCode(null)
    setLibraryFocusTargetId(normalizedTargetId)
    setIsHistoryOpen(false)
    window.history.replaceState(null, '', `#${normalizedTargetId}`)

    if (normalizedTargetId === 'library') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  function openUpdatesView() {
    setView('updates')
    setGuideCode(null)
    setIsHistoryOpen(false)
    window.history.replaceState(null, '', '#updates')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function openHomeView(sectionId = 'top') {
    setView('home')
    setGuideCode(null)
    setIsHistoryOpen(false)
    setHomeSectionId(sectionId)

    if (sectionId === 'finder') {
      window.history.replaceState(null, '', '#finder')
      syncFromHash()
      return
    }

    setIsWizardFocused(false)
    setDiscoverScreen('compose')
    setCurrentStep('discover')
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
    setIsHistoryOpen(false)
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
    handleFinderStateChange({
      focus: true,
      step: 'adjust',
      historyMode: 'replace',
    })
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
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-[14px] focus:bg-[var(--accent)] focus:px-6 focus:py-3 focus:text-sm focus:font-semibold focus:text-[var(--accent-foreground)] focus:shadow-[var(--shadow-button-primary)]"
      >
        본문으로 바로가기
      </a>
      <div className="mx-auto max-w-[1180px] px-3 py-3 sm:px-6 sm:py-4 lg:px-8 lg:py-6">
        <header className="sticky top-3 z-20 rounded-[16px] border border-[var(--border-subtle)] bg-[var(--surface-header)] px-2.5 py-2.5 shadow-[var(--shadow-header)] backdrop-blur-xl sm:top-4 sm:rounded-[18px] sm:px-4 sm:py-3">
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div className="flex items-start justify-between gap-2 md:min-w-0 md:flex-1 md:items-center">
              <button
                type="button"
                onClick={() => openHomeView('top')}
                className="min-w-0 flex flex-1 items-center gap-3 pr-2 text-left md:flex-none md:pr-0"
                aria-label="마곡 코드찾기 홈으로"
              >
                <div className="inline-flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-[14px] ring-1 ring-[var(--border-accent)] shadow-[var(--shadow-accent)] sm:size-11">
                  <img
                    src={brandAssets.symbol}
                    alt=""
                    aria-hidden="true"
                    width="44"
                    height="44"
                    className="size-full object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="hidden truncate text-[11px] font-semibold tracking-[0.16em] text-[var(--foreground-subtle)] sm:block sm:text-xs">
                    입주 업종코드 서비스
                  </div>
                  <div className="break-keep text-[15px] font-semibold leading-[1.15] text-[var(--foreground)] sm:truncate sm:text-base sm:leading-normal">
                    마곡 코드찾기
                  </div>
                </div>
              </button>
              <button
                type="button"
                className="inline-flex size-10 shrink-0 items-center justify-center rounded-[14px] text-[var(--foreground-muted)] transition-colors hover:bg-[var(--accent-soft)] hover:text-[var(--accent-strong)] md:hidden"
                onClick={() => {
                  setIsHistoryOpen(false)
                  setIsMobileMenuOpen((prev) => !prev)
                }}
                aria-label={isMobileMenuOpen ? '메뉴 닫기' : '메뉴 열기'}
                aria-expanded={isMobileMenuOpen}
                aria-controls="mobile-nav-panel"
              >
                {isMobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
              </button>
            </div>

            <nav className="hidden items-center gap-1 md:flex">
              <Button
                variant={view === 'home' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => openHomeView('finder')}
                className="whitespace-nowrap"
              >
                검색 홈
              </Button>
              <Button
                variant={view === 'directory' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={openDirectoryView}
                className="whitespace-nowrap"
              >
                코드 사전
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => openHomeView('practical-guide')}
                className="whitespace-nowrap"
              >
                예비판정 안내
              </Button>
              <Button
                variant={view === 'library' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => openLibraryView()}
                className="whitespace-nowrap"
              >
                법령 참고
              </Button>
              <Button
                variant={view === 'updates' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={openUpdatesView}
                className="whitespace-nowrap"
              >
                업데이트
              </Button>
            </nav>

            <div className="hidden flex-wrap items-center gap-2 md:flex">
              <Button
                variant={isHistoryOpen ? 'secondary' : 'ghost'}
                size="sm"
                onClick={handleToggleHistory}
                className="whitespace-nowrap"
              >
                <Clock3 className="size-4" />
                최근 조회
              </Button>
              <Badge variant="muted" className="hidden sm:inline-flex">{activeZoneLabel} 기본</Badge>
              <Button
                size="sm"
                onClick={() => (view === 'home' ? openDirectoryView() : openHomeView('finder'))}
                className="whitespace-nowrap"
              >
                {view === 'home' ? '코드 사전 보기' : '검색 홈으로'}
                <ArrowRight className="size-4" />
              </Button>
            </div>

            <div className="flex items-center gap-1.5 md:hidden">
              <Button
                variant={isHistoryOpen ? 'secondary' : 'ghost'}
                size="sm"
                onClick={handleToggleHistory}
                aria-label="최근 조회 목록 열기"
                className="h-10 min-h-10 min-w-0 flex-1 justify-center px-2.5"
              >
                <Clock3 className="size-4" />
                <span className="whitespace-nowrap">최근</span>
              </Button>
              <Button
                size="sm"
                onClick={() => (view === 'home' ? openDirectoryView() : openHomeView('finder'))}
                aria-label={view === 'home' ? '코드 사전 보기' : '검색 홈으로'}
                className="h-10 min-h-10 min-w-0 flex-1 justify-center px-2.5"
              >
                <span className="whitespace-nowrap">{view === 'home' ? '사전 보기' : '검색'}</span>
                <ArrowRight className="size-4 shrink-0" />
              </Button>
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
                코드 사전
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => { openHomeView('practical-guide'); setIsMobileMenuOpen(false) }}
                className="justify-start"
              >
                예비판정 안내
              </Button>
              <Button
                variant={view === 'library' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => { openLibraryView(); setIsMobileMenuOpen(false) }}
                className="justify-start"
              >
                법령 참고
              </Button>
              <Button
                variant={view === 'updates' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => { openUpdatesView(); setIsMobileMenuOpen(false) }}
                className="justify-start"
              >
                업데이트
              </Button>
            </nav>
          ) : null}

          {isHistoryOpen ? (
            <div className="mt-2 border-t border-[var(--border)] pt-3">
              <Card className="border-[var(--border)] bg-[var(--surface-strong)] shadow-[var(--shadow-lg)]">
                <CardContent className="space-y-4 p-4 sm:p-5">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <Badge variant="muted" className="w-fit">최근 조회</Badge>
                      <h3 className="mt-3 font-display text-[1.35rem] font-semibold leading-[1.12] text-[var(--foreground)]">
                        최근 확인한 예비판정을 다시 열 수 있습니다
                      </h3>
                      <p className="mt-2 text-sm leading-6 text-[var(--foreground-muted)]">
                        상담 중 봤던 코드와 조건을 그대로 다시 불러옵니다.
                      </p>
                    </div>
                    {recentHistory.length > 0 ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleClearRecentHistory}
                        className="whitespace-nowrap"
                      >
                        <Trash2 className="size-4" />
                        전체 지우기
                      </Button>
                    ) : null}
                  </div>

                  {recentHistory.length > 0 ? (
                    <div className="max-h-[320px] space-y-2 overflow-y-auto pr-1">
                        {recentHistory.map((entry) => (
                          <button
                            type="button"
                            key={entry.shareHash}
                            onClick={() => handleOpenRecentHistory(entry)}
                            className="w-full rounded-[16px] border border-[var(--border)] bg-[var(--surface-soft)] px-4 py-4 text-left transition hover:border-[var(--border-accent-strong)] hover:bg-[var(--surface-strong)]"
                          >
                            <div className="flex flex-wrap items-center gap-2">
                              <Badge variant={getHistoryBadgeVariant(entry)}>
                                {entry.compareZones
                                  ? '두 구역 비교'
                                  : formatVerdictLabel(entry.primaryVerdict)}
                              </Badge>
                              <Badge variant="muted">{getRecentHistoryContext(entry)}</Badge>
                            </div>
                            <div className="mt-3 text-sm font-semibold leading-6 text-[var(--foreground)]">
                              {getRecentHistoryCodeLabel(entry)}
                            </div>
                            <p className="mt-1 text-sm leading-6 text-[var(--foreground-muted)]">
                              {entry.primaryTitle}
                            </p>
                            <p className="mt-2 text-xs leading-5 text-[var(--foreground-subtle)]">
                              {formatKoreanDateTime(entry.createdAt)}
                            </p>
                          </button>
                        ))}
                    </div>
                  ) : (
                    <div className="rounded-[16px] border border-dashed border-[var(--border)] bg-[var(--surface-soft)] px-4 py-4 text-sm leading-6 text-[var(--foreground-muted)]">
                      최근에 확인한 판정이 아직 없습니다. 결과를 한 번 보면 자동으로 이
                      목록에 저장됩니다.
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          ) : null}
        </header>

        <main id="main-content" className="animate-fade-in space-y-5 pb-12 pt-4 sm:space-y-6 sm:pt-5 lg:space-y-8 lg:pt-7">
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
                    상태입니다. 검색 홈이나 전체 코드 사전으로 돌아가 다시 진입해 주세요.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Button variant="secondary" onClick={() => openHomeView('finder')}>
                      검색 홈으로 돌아가기
                    </Button>
                    <Button variant="outline" onClick={openDirectoryView}>
                      전체 코드 사전 보기
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          ) : view === 'library' ? (
            <LegalLibraryPage
              onBackHome={() => openHomeView('finder')}
              onOpenUpdates={openUpdatesView}
              focusTargetId={libraryFocusTargetId}
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
              additionalCodes={additionalCodes}
              multiCodeResults={multiCodeResults}
              compareZones={compareZones}
              comparisonResults={comparisonResults}
              error={error}
              industryQuery={industryQuery}
              industrySuggestions={industrySuggestions}
              discoveryStatus={discoveryStatus}
              discoveryError={discoveryError}
              currentStep={currentStep}
              discoverScreen={discoverScreen}
              isWizardFocused={isWizardFocused}
              setField={setField}
              setFlag={setFlag}
              setCompareZones={setCompareZones}
              setAdditionalCodeField={setAdditionalCodeField}
              addAdditionalCode={addAdditionalCode}
              removeAdditionalCode={removeAdditionalCode}
              setIndustryQuery={setIndustryQuery}
              discoverIndustry={discoverIndustry}
              applyIndustrySuggestion={applyIndustrySuggestion}
              evaluate={evaluate}
              onOpenDirectory={openDirectoryView}
              onOpenLibrary={openLibraryView}
              onOpenUpdates={openUpdatesView}
              onOpenGuide={openGuideView}
              onFinderStateChange={handleFinderStateChange}
              onExitWizardFocus={handleExitWizardFocus}
              onResetFinder={handleResetFinder}
              onCopyShareLink={handleCopyShareLink}
              onCopyResultSummary={handleCopyResultSummary}
              onPrintResult={handlePrintResult}
            />
          )}
          </Suspense>

<footer className="space-y-6 rounded-[20px] border border-[var(--border)] bg-[var(--surface-strong)] px-6 py-6 shadow-[var(--shadow-lg)]">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
              <div className="min-w-0">
                <img
                  src={brandAssets.wordmark}
                  alt=""
                  aria-hidden="true"
                  width="920"
                  height="220"
                  className="hidden h-12 w-auto sm:block"
                />
                <div className="flex items-center gap-3 sm:hidden">
                  <img
                    src={brandAssets.symbol}
                    alt=""
                    aria-hidden="true"
                    width="44"
                    height="44"
                    className="size-11 rounded-[14px] ring-1 ring-[var(--border-accent)]"
                  />
                  <div>
                    <div className="text-xs font-semibold tracking-[0.16em] text-[var(--foreground-subtle)]">
                      입주 업종코드 서비스
                    </div>
                    <div className="mt-1 font-display text-2xl font-semibold text-[var(--foreground)]">
                      마곡 코드찾기
                    </div>
                  </div>
                </div>
                <p className="mt-4 max-w-2xl text-sm leading-6 text-[var(--foreground-muted)]">
                  마곡 일반산업단지 입주 검토를 더 빨리 시작할 수 있도록, 업종코드 추천,
                  전체 코드 사전, 예비판정을 한 화면 체계로 정리한 서비스입니다.
                </p>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--foreground-muted)]">
                  컨설턴트와 중개사가 마곡 입주 상담을 준비하고 설명할 때 쓰도록 설계했습니다.
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <Badge variant="muted">업종코드 추천</Badge>
                <Badge variant="muted">코드 사전</Badge>
                <Badge variant="muted">입주 예비판정</Badge>
                <Badge variant="muted">법령 참고</Badge>
                <Badge variant="muted">업데이트</Badge>
              </div>
            </div>

            <div className="grid gap-3 md:grid-cols-3">
              {footerFacts.map((item) => (
                <div
                  key={item}
                  className="rounded-[14px] border border-[var(--border)] bg-[var(--surface-muted)] px-4 py-4 text-sm leading-6 text-[var(--foreground-muted)]"
                >
                  {item}
                </div>
              ))}
            </div>

            <div className="rounded-[16px] border border-[var(--info-border)] bg-[var(--info-bg)] px-4 py-4 text-sm leading-6 text-[var(--info-foreground)]">
              제휴 링크가 포함된 영역에서는 대가성 안내를 함께 표기합니다.
            </div>
          </footer>
        </main>
      </div>
    </div>
  )
}

export default App
