import {
  ArrowRight,
  Building2,
  CheckCircle2,
  ExternalLink,
  FileSearch,
  Landmark,
} from 'lucide-react'

import { CoupangSideBanner } from '@/components/coupang-side-banner'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { EligibilityForm } from '@/features/eligibility/components/eligibility-form'
import { IndustryDiscoveryPanel } from '@/features/eligibility/components/industry-discovery-panel'
import { ResultPanel } from '@/features/eligibility/components/result-panel'
import { RulebookTabs } from '@/features/eligibility/components/rulebook-tabs'
import {
  type EligibilityStep,
  useEligibilityStore,
} from '@/store/eligibility-store'
import { formatKoreanDate } from '@/utils/format'

const introFacts = [
  { label: '대상', value: '마곡 일반산업단지' },
  { label: '기준', value: '시행령 + 관리기본계획' },
  { label: '결과', value: '업종코드 추천 + 입주 예비판정' },
]

const steps = [
  {
    step: '1',
    title: '사업 내용을 적습니다',
    description:
      '광고대행업처럼 한 줄로 적거나, 사업자등록증의 업태·종목을 그대로 붙여 넣으면 됩니다.',
  },
  {
    step: '2',
    title: '추천 업종을 고릅니다',
    description:
      '정확히 맞는 코드가 있으면 바로 보여주고, 없으면 가장 가까운 관련 업종을 추천합니다.',
  },
  {
    step: '3',
    title: '입주 가능성을 바로 봅니다',
    description:
      '선택한 업종 기준으로 가능, 조건부 가능, 심의 필요, 불가를 한 화면에서 확인합니다.',
  },
]

const wizardSteps: Array<{
  id: EligibilityStep
  badge: string
  title: string
  description: string
}> = [
  {
    id: 'discover',
    badge: '1단계',
    title: '업종 찾기',
    description:
      '사업 설명이나 사업자등록증 업태·종목을 넣고 가장 가까운 업종코드를 먼저 찾습니다.',
  },
  {
    id: 'adjust',
    badge: '2단계',
    title: '조건 보정',
    description:
      '선택한 업종을 기준으로 구역, 신청 주체, 예외 조건을 확인하고 필요하면 보정합니다.',
  },
  {
    id: 'result',
    badge: '3단계',
    title: '결과 확인',
    description:
      '가능 여부, 연결 조문, 업종코드 상세 해설과 추가 확인 포인트를 한 화면에서 봅니다.',
  },
]

const useCases = [
  '중개 실무자가 임차 문의를 받았을 때',
  '법인 담당자가 입주 가능 업종을 먼저 확인할 때',
  '사업자등록증 업태·종목만 받아 빠르게 1차 검토할 때',
]

const trustPoints = [
  '마곡 관리기본계획과 시행령을 함께 반영합니다.',
  '애매한 업종은 무리하게 가능으로 찍지 않습니다.',
  '세부 조건 수정과 재판정을 같은 화면에서 이어서 할 수 있습니다.',
]

const coupangDisclosureText =
  '이 게시물은 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받습니다.'

const affiliateActions = [
  {
    title: '추천 상품 보기',
    href: 'https://link.coupang.com/a/d7nWco',
    variant: 'default' as const,
  },
  {
    title: '추가 상품 보기',
    href: 'https://link.coupang.com/a/d7n7ta',
    variant: 'secondary' as const,
  },
]

const affiliateWidgets = [
  {
    src: 'https://coupa.ng/clX5tE',
    title: '쿠팡 파트너스 추천 위젯 모바일기기',
    badge: '모바일 기기',
    headline: '핸드폰과 태블릿',
    description: '이동 중에도 확인이 잦은 업무용 기기를 먼저 살펴볼 수 있습니다.',
  },
  {
    src: 'https://coupa.ng/clX3qg',
    title: '쿠팡 파트너스 추천 위젯 생수',
    badge: '탕비실 추천',
    headline: '생수와 비품',
    description: '사무실에 두기 좋은 비품과 생수를 먼저 볼 수 있습니다.',
  },
  {
    src: 'https://coupa.ng/clX5vK',
    title: '쿠팡 파트너스 추천 위젯 업무기기',
    badge: '업무 기기',
    headline: '디지털 업무 기기',
    description: '노트북과 주변 기기처럼 작업 효율에 직접 연결되는 제품입니다.',
  },
  {
    src: 'https://coupa.ng/clX5EI',
    title: '쿠팡 파트너스 추천 위젯 소모품',
    badge: '사무 소모품',
    headline: '복사용지와 소모품',
    description: '자주 채워 두는 소모품을 빠르게 확인할 수 있습니다.',
  },
]

const affiliateHighlights = ['모바일 기기', '생수/비품', '업무 기기', '사무 소모품']

const affiliateSidebarNotes = [
  '실무에서 자주 먼저 보는 품목만 추렸습니다.',
  '외부 링크로 바로 이어져 빠르게 비교할 수 있습니다.',
  '광고·제휴 고지는 아래에 분명하게 표시합니다.',
]

const affiliateCardAccentClasses = [
  'from-sky-500 to-indigo-500',
  'from-cyan-500 to-blue-500',
  'from-violet-500 to-indigo-500',
  'from-amber-500 to-orange-500',
] as const

const sideAffiliateBanner = {
  iframeSrc:
    'https://ads-partners.coupang.com/widgets.html?id=973794&template=carousel&trackingCode=AF7474453&subId=&width=160&height=600&tsource=',
}

const footerFacts = [
  '운영: Loopin Lab',
  '문의: contact.loopinlab@gmail.com',
  '활동 페이지: https://loopincode.com',
]

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

  function runQuickSearch(value: string) {
    setIndustryQuery(value)
    void discoverIndustry()
  }

  const sideBannerStyles = {
    left: {
      left: 'max(8px, calc(50vw - 590px - 172px))',
    },
    right: {
      right: 'max(8px, calc(50vw - 590px - 172px))',
    },
  } as const

  const canShowResult = Boolean(status === 'ready' && result)
  const safeCurrentStep =
    currentStep === 'result' && !canShowResult ? 'adjust' : currentStep
  const currentWizardStep =
    wizardSteps.find((step) => step.id === safeCurrentStep) ?? wizardSteps[0]
  const currentWizardIndex = wizardSteps.findIndex(
    (step) => step.id === safeCurrentStep,
  )
  return (
    <div className="min-h-screen">
      {(['left', 'right'] as const).map((side) => (
        <CoupangSideBanner
          key={side}
          label={`쿠팡 파트너스 사이드 배너 ${side}`}
          iframeSrc={sideAffiliateBanner.iframeSrc}
          style={sideBannerStyles[side]}
        />
      ))}

      <div className="mx-auto max-w-[1180px] px-4 py-4 sm:px-6 lg:px-8 lg:py-6">
        <header className="sticky top-4 z-20 rounded-[24px] border border-[var(--border)] bg-white/88 px-4 py-3 shadow-[0_18px_40px_rgba(28,33,43,0.08)] backdrop-blur">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <a href="#top" className="flex items-center gap-3">
              <div className="inline-flex size-11 items-center justify-center rounded-2xl bg-[var(--accent)] text-[var(--accent-foreground)] shadow-[0_14px_30px_rgba(43,109,255,0.24)]">
                <Building2 className="size-5" />
              </div>
              <div>
                <div className="text-xs font-semibold tracking-[0.16em] text-[var(--foreground-subtle)]">
                  LOOPIN LAB
                </div>
                <div className="text-base font-semibold text-[var(--foreground)]">
                  마곡 코드찾기
                </div>
              </div>
            </a>

            <nav className="hidden items-center gap-1 md:flex">
              <a
                href="#how"
                className="rounded-full px-4 py-2 text-sm font-medium text-[var(--foreground-muted)] transition hover:bg-[rgba(43,109,255,0.08)] hover:text-[var(--foreground)]"
              >
                이용 방법
              </a>
              <a
                href="#finder"
                className="rounded-full px-4 py-2 text-sm font-medium text-[var(--foreground-muted)] transition hover:bg-[rgba(43,109,255,0.08)] hover:text-[var(--foreground)]"
              >
                코드 찾기
              </a>
              <a
                href="#criteria"
                className="rounded-full px-4 py-2 text-sm font-medium text-[var(--foreground-muted)] transition hover:bg-[rgba(43,109,255,0.08)] hover:text-[var(--foreground)]"
              >
                판정 기준
              </a>
            </nav>

            <Button asChild size="sm">
              <a href="#finder">
                바로 시작
                <ArrowRight className="size-4" />
              </a>
            </Button>
          </div>
        </header>

        <main id="top" className="space-y-8 pb-12 pt-6 lg:space-y-10 lg:pt-8">
          <section className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_380px] lg:items-stretch">
            <div className="flex h-full flex-col rounded-[36px] border border-[var(--border)] bg-white/88 px-6 py-8 shadow-[0_24px_60px_rgba(28,33,43,0.08)] sm:px-8 lg:px-10 lg:py-10">
              <Badge variant="muted">마곡 일반산업단지 전용</Badge>
              <h1 className="mt-5 max-w-4xl font-display text-4xl font-semibold tracking-[-0.06em] text-[var(--foreground)] sm:text-5xl lg:text-6xl">
                업종코드 찾기부터
                <br />
                입주 가능성 확인까지
                <br />
                한 화면에서 끝냅니다.
              </h1>
              <p className="mt-5 max-w-3xl text-base leading-8 text-[var(--foreground-muted)] sm:text-lg">
                사업 설명이나 사업자등록증의 업태·종목을 넣으면 가장 가까운 업종코드를
                먼저 찾고, 이어서 마곡 기준의 입주 가능성을 바로 보여드립니다.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <Button asChild size="lg">
                  <a href="#finder">
                    지금 코드 찾기
                    <ArrowRight className="size-4" />
                  </a>
                </Button>
                <Button asChild variant="secondary" size="lg">
                  <a href="#criteria">판정 기준 보기</a>
                </Button>
              </div>

              <div className="mt-7 grid gap-3 sm:grid-cols-3">
                {introFacts.map((fact) => (
                  <div
                    key={fact.label}
                    className="rounded-[24px] border border-[var(--border)] bg-[rgba(255,255,255,0.72)] px-4 py-4"
                  >
                    <div className="text-xs font-medium text-[var(--foreground-subtle)]">
                      {fact.label}
                    </div>
                    <div className="mt-2 text-sm font-semibold text-[var(--foreground)]">
                      {fact.value}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Card className="h-full bg-[linear-gradient(180deg,rgba(243,248,255,0.98),rgba(255,255,255,0.94))]">
              <CardContent className="flex h-full flex-col space-y-5 p-6">
                <div className="inline-flex size-12 items-center justify-center rounded-2xl bg-[rgba(43,109,255,0.12)] text-[var(--accent)]">
                  <FileSearch className="size-6" />
                </div>
                <div>
                  <h2 className="font-display text-2xl font-semibold text-[var(--foreground)]">
                    처음 오셨다면 이렇게 보세요
                  </h2>
                  <p className="mt-2 text-sm leading-7 text-[var(--foreground-muted)]">
                    이 서비스는 업종코드표를 뒤지는 시간을 줄이기 위한 1차 확인 도구입니다.
                  </p>
                </div>

                <div className="space-y-3">
                  {steps.map((item) => (
                    <div
                      key={item.step}
                      className="rounded-[24px] border border-[var(--border)] bg-white px-4 py-4"
                    >
                      <div className="flex items-center gap-3">
                        <div className="inline-flex size-8 items-center justify-center rounded-full bg-[rgba(43,109,255,0.12)] text-sm font-semibold text-[var(--accent)]">
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

          <section id="how" className="grid gap-4 md:grid-cols-3">
            {steps.map((item) => (
              <Card key={item.step}>
                <CardContent className="p-6">
                  <div className="inline-flex size-10 items-center justify-center rounded-full bg-[rgba(43,109,255,0.12)] text-base font-semibold text-[var(--accent)]">
                    {item.step}
                  </div>
                  <h2 className="mt-4 font-display text-2xl font-semibold text-[var(--foreground)]">
                    {item.title}
                  </h2>
                  <p className="mt-3 text-sm leading-7 text-[var(--foreground-muted)]">
                    {item.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </section>

          <section className="grid gap-6 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
            <Card>
              <CardContent className="p-6">
                <Badge variant="muted">이런 분께 맞습니다</Badge>
                <h2 className="mt-4 font-display text-3xl font-semibold text-[var(--foreground)]">
                  누가 써도
                  <br />
                  첫 단계가 바로 보이도록 정리했습니다.
                </h2>
                <div className="mt-5 space-y-3">
                  {useCases.map((item) => (
                    <div
                      key={item}
                      className="flex items-start gap-3 rounded-[24px] border border-[var(--border)] bg-[rgba(255,255,255,0.72)] px-4 py-4"
                    >
                      <CheckCircle2 className="mt-0.5 size-5 text-[var(--accent)]" />
                      <p className="text-sm leading-6 text-[var(--foreground-muted)]">
                        {item}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <Badge variant="muted">판정 원칙</Badge>
                <h2 className="mt-4 font-display text-3xl font-semibold text-[var(--foreground)]">
                  빠르게 보여주되,
                  <br />
                  보수적으로 안내합니다.
                </h2>
                <div className="mt-5 space-y-3">
                  {trustPoints.map((item) => (
                    <div
                      key={item}
                      className="flex items-start gap-3 rounded-[24px] border border-[var(--border)] bg-[rgba(255,255,255,0.72)] px-4 py-4"
                    >
                      <Landmark className="mt-0.5 size-5 text-[var(--accent)]" />
                      <p className="text-sm leading-6 text-[var(--foreground-muted)]">
                        {item}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </section>

          <section
            id="finder"
            aria-label="업종코드 분석 위저드"
            className="rounded-[36px] border border-[var(--border)] bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(242,247,255,0.94))] p-6 shadow-[0_24px_70px_rgba(28,33,43,0.08)] sm:p-8"
          >
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <Badge variant="muted">핵심 기능</Badge>
                <h2 className="mt-4 font-display text-3xl font-semibold text-[var(--foreground)] sm:text-4xl">
                  지금 바로 업종코드를 찾고 결과를 확인하세요
                </h2>
                <p className="mt-3 max-w-3xl text-sm leading-7 text-[var(--foreground-muted)]">
                  자유 문장, 사업자등록증 업태·종목, 실무 메모 형태 모두 괜찮습니다.
                  가장 가까운 후보를 먼저 보여드리고, 선택한 코드로 바로 판정합니다.
                </p>
              </div>
              <div className="rounded-[24px] border border-[var(--border)] bg-white px-4 py-4 text-sm leading-6 text-[var(--foreground-muted)] lg:max-w-sm">
                입력이 애매하면 관련 업종을 추천하고, 애매한 판정은 `심의 필요` 또는
                `정보 부족`으로 보수적으로 표시합니다.
              </div>
            </div>

            <div className="mt-8 space-y-6">
              <div className="grid gap-3 lg:grid-cols-3">
                {wizardSteps.map((step, index) => {
                  const isActive = step.id === safeCurrentStep
                  const isComplete = currentWizardIndex > index

                  return (
                    <div
                      key={step.id}
                      className={`rounded-[24px] border px-4 py-4 transition ${
                        isActive
                          ? 'border-[rgba(43,109,255,0.2)] bg-[rgba(239,245,255,0.96)] shadow-[0_18px_32px_rgba(43,109,255,0.08)]'
                          : isComplete
                            ? 'border-[rgba(43,109,255,0.16)] bg-white'
                            : 'border-[var(--border)] bg-white/72'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`inline-flex size-9 items-center justify-center rounded-full text-sm font-semibold ${
                            isActive || isComplete
                              ? 'bg-[rgba(43,109,255,0.12)] text-[var(--accent)]'
                              : 'bg-[rgba(130,147,173,0.18)] text-[var(--foreground-subtle)]'
                          }`}
                        >
                          {isComplete ? <CheckCircle2 className="size-4" /> : index + 1}
                        </div>
                        <div>
                          <div className="text-xs font-medium text-[var(--foreground-subtle)]">
                            {step.badge}
                          </div>
                          <div className="text-sm font-semibold text-[var(--foreground)]">
                            {step.title}
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              <Card className="bg-white/92">
                <CardContent className="space-y-6 p-6">
                  <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                      <Badge variant="muted">{currentWizardStep.badge}</Badge>
                      <h3 className="mt-4 font-display text-3xl font-semibold text-[var(--foreground)]">
                        {currentWizardStep.title}
                      </h3>
                      <p className="mt-3 max-w-3xl text-sm leading-7 text-[var(--foreground-muted)]">
                        {currentWizardStep.description}
                      </p>
                    </div>
                    {safeCurrentStep !== 'discover' ? (
                      <Button
                        variant="secondary"
                        onClick={() => setCurrentStep('discover')}
                      >
                        처음 단계로 돌아가기
                      </Button>
                    ) : null}
                  </div>

                  {safeCurrentStep === 'discover' ? (
                    <IndustryDiscoveryPanel
                      input={input}
                      query={industryQuery}
                      suggestions={industrySuggestions}
                      status={discoveryStatus}
                      error={discoveryError}
                      onQueryChange={setIndustryQuery}
                      onDiscover={discoverIndustry}
                      onSuggestionSelect={applyIndustrySuggestion}
                      onExampleSelect={runQuickSearch}
                      onContinueManual={() => setCurrentStep('adjust')}
                    />
                  ) : null}

                  {safeCurrentStep === 'adjust' ? (
                    <div className="space-y-5">
                      <Card className="bg-[rgba(239,245,255,0.86)]">
                        <CardContent className="grid gap-3 p-5 md:grid-cols-2 xl:grid-cols-4">
                          <div className="rounded-2xl border border-[var(--border)] bg-white px-4 py-3">
                            <div className="text-xs text-[var(--foreground-subtle)]">
                              선택한 업종코드
                            </div>
                            <div className="mt-1 text-sm font-semibold text-[var(--foreground)]">
                              {input.ksicCode.trim() || '직접 입력 예정'}
                            </div>
                          </div>
                          <div className="rounded-2xl border border-[var(--border)] bg-white px-4 py-3">
                            <div className="text-xs text-[var(--foreground-subtle)]">
                              선택한 업종명
                            </div>
                            <div className="mt-1 text-sm font-semibold text-[var(--foreground)]">
                              {input.ksicName.trim() || '아직 선택 전'}
                            </div>
                          </div>
                          <div className="rounded-2xl border border-[var(--border)] bg-white px-4 py-3">
                            <div className="text-xs text-[var(--foreground-subtle)]">
                              현재 구역
                            </div>
                            <div className="mt-1 text-sm font-semibold text-[var(--foreground)]">
                              {input.zoneType === 'industrialFacility'
                                ? '산업시설구역'
                                : input.zoneType === 'knowledgeIndustryCenter'
                                  ? '지식산업센터'
                                  : '지원시설구역'}
                            </div>
                          </div>
                          <div className="rounded-2xl border border-[var(--border)] bg-white px-4 py-3">
                            <div className="text-xs text-[var(--foreground-subtle)]">
                              안내
                            </div>
                            <div className="mt-1 text-sm font-semibold text-[var(--foreground)]">
                              필요하면 조건만 보정하고 결과 보기로 이동
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <EligibilityForm
                        input={input}
                        status={status}
                        onFieldChange={setField}
                        onFlagChange={setFlag}
                        onEvaluate={evaluate}
                        onReset={reset}
                        onPrevious={() => setCurrentStep('discover')}
                        primaryActionLabel="결과 보기"
                        secondaryActionLabel="이전 단계"
                        defaultExpanded
                      />
                    </div>
                  ) : null}

                  {safeCurrentStep === 'result' ? (
                    <ResultPanel
                      input={input}
                      result={result}
                      status={status}
                      error={error}
                      onEvaluate={evaluate}
                      onAdjust={() => setCurrentStep('adjust')}
                      sticky={false}
                      stepLabel="3단계"
                    />
                  ) : null}
                </CardContent>
              </Card>
            </div>
          </section>

          <section
            id="affiliate"
            className="rounded-[32px] border border-[var(--border)] bg-[linear-gradient(180deg,rgba(248,252,255,0.96),rgba(255,255,255,0.94))] p-6 shadow-[0_20px_56px_rgba(28,33,43,0.08)] sm:p-8"
          >
            <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
              <div className="max-w-3xl">
                <Badge variant="muted">업무용 추천</Badge>
                <h2 className="mt-4 font-display text-3xl font-semibold text-[var(--foreground)] sm:text-4xl">
                  업무용 추천 상품
                </h2>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--foreground-muted)]">
                  핸드폰, 생수, 업무 기기, 소모품까지 실무에서 자주 먼저 보는 품목을 한
                  화면 안에서 바로 비교할 수 있게 정리했습니다.
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                {affiliateHighlights.map((item) => (
                  <Badge key={item} variant="muted">
                    {item}
                  </Badge>
                ))}
                <Badge variant="muted">4 picks</Badge>
              </div>
            </div>

            <div className="mt-6 grid gap-5 xl:grid-cols-[320px_minmax(0,1fr)_minmax(0,1fr)] xl:grid-rows-[auto_1fr_1fr]">
              <div className="rounded-[30px] border border-[var(--border)] bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(243,248,255,0.94))] p-5 shadow-[0_18px_36px_rgba(28,33,43,0.06)] xl:row-span-3 xl:h-full xl:sticky xl:top-24">
                <Badge variant="muted">업무용 추천</Badge>
                <h3 className="mt-4 font-display text-3xl font-semibold text-[var(--foreground)]">
                  바로 보는 추천
                </h3>
                <p className="mt-3 text-sm leading-7 text-[var(--foreground-muted)]">
                  업무 시작 전에 자주 챙기는 품목만 한곳에 모아, 바로 비교하고 외부
                  링크로 이어질 수 있게 구성했습니다.
                </p>

                <div className="mt-5 flex flex-wrap gap-2">
                  {affiliateHighlights.map((item) => (
                    <Badge key={item} variant="muted">
                      {item}
                    </Badge>
                  ))}
                </div>

                <div className="mt-6 grid gap-3">
                  {affiliateSidebarNotes.map((note) => (
                    <div
                      key={note}
                      className="flex items-start gap-3 rounded-[20px] border border-[rgba(190,208,234,0.55)] bg-white/92 px-4 py-4 text-sm leading-6 text-[var(--foreground-muted)]"
                    >
                      <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-[var(--accent)]" />
                      <span>{note}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-6 grid gap-3">
                  {affiliateActions.map((item) => (
                    <Button
                      key={item.title}
                      asChild
                      variant={item.variant}
                      className="justify-start rounded-2xl px-5"
                    >
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

                <div className="mt-6 rounded-[24px] border border-sky-200 bg-sky-50 px-4 py-4">
                  <div className="flex items-start gap-3">
                    <div className="inline-flex size-10 shrink-0 items-center justify-center rounded-2xl bg-[rgba(43,109,255,0.12)] text-[var(--accent)]">
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
              </div>

              <div className="rounded-[30px] border border-[var(--border)] bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(246,250,255,0.96))] p-5 shadow-[0_20px_40px_rgba(43,109,255,0.08)] xl:col-span-2">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="text-sm font-semibold text-[var(--foreground)]">
                      사이드 추천 보드
                    </div>
                    <p className="mt-1 text-sm leading-6 text-[var(--foreground-muted)]">
                      실무에서 자주 보는 품목을 비어 보이지 않게 한 보드 안에 촘촘하게
                      정리했습니다.
                    </p>
                  </div>
                  <Badge variant="muted">4 picks</Badge>
                </div>
              </div>

              {affiliateWidgets.map((widget, index) => (
                <div
                  key={widget.src}
                  className="group relative overflow-hidden rounded-[28px] border border-[rgba(190,208,234,0.7)] bg-white/95 p-4 shadow-[0_14px_28px_rgba(43,109,255,0.06)] transition hover:-translate-y-0.5 hover:shadow-[0_24px_44px_rgba(43,109,255,0.12)]"
                >
                  <div
                    className={`absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r ${affiliateCardAccentClasses[index]}`}
                  />
                  <div className="grid h-full gap-4 sm:grid-cols-[minmax(0,1fr)_132px] sm:items-center">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <div className="text-xs font-semibold tracking-[0.12em] text-[var(--foreground-subtle)]">
                          {widget.badge}
                        </div>
                        {index < 2 ? <Badge variant="muted">추천</Badge> : null}
                      </div>
                      <div className="mt-3 text-[1.65rem] font-semibold leading-9 text-[var(--foreground)]">
                        {widget.headline}
                      </div>
                      <p className="mt-3 text-sm leading-7 text-[var(--foreground-muted)]">
                        {widget.description}
                      </p>

                      <div className="mt-4 flex flex-wrap gap-2">
                        <span className="rounded-full border border-[rgba(190,208,234,0.65)] bg-[rgba(244,247,255,0.92)] px-3 py-1 text-xs font-medium text-[var(--foreground-subtle)]">
                          빠른 비교
                        </span>
                        <span className="rounded-full border border-[rgba(190,208,234,0.65)] bg-[rgba(244,247,255,0.92)] px-3 py-1 text-xs font-medium text-[var(--foreground-subtle)]">
                          외부 링크
                        </span>
                      </div>

                      <div className="mt-5 text-xs font-medium tracking-[0.04em] text-[var(--foreground-subtle)]">
                        상품 자세히 보기
                      </div>
                    </div>

                    <div className="flex justify-center rounded-[24px] border border-[rgba(190,208,234,0.7)] bg-[linear-gradient(180deg,#ffffff,rgba(245,248,255,0.96))] px-2 py-3 shadow-[inset_0_0_0_1px_rgba(190,208,234,0.35)]">
                      <iframe
                        src={widget.src}
                        title={widget.title}
                        width="120"
                        height="240"
                        frameBorder="0"
                        scrolling="no"
                        referrerPolicy="unsafe-url"
                        loading="lazy"
                        className="overflow-hidden rounded-[18px] bg-white"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section id="criteria" className="space-y-4">
            <div className="max-w-3xl">
              <Badge variant="muted">판정 기준</Badge>
              <h2 className="mt-4 font-display text-3xl font-semibold text-[var(--foreground)]">
                어떤 기준으로 보는지 아래에서 바로 확인할 수 있습니다
              </h2>
              <p className="mt-3 text-sm leading-7 text-[var(--foreground-muted)]">
                산업시설구역, 지식산업센터 특례, 심의 필요 업종, 명시적 제한 업종을
                각각 나눠 두었습니다.
              </p>
            </div>
            <RulebookTabs />
          </section>

          <footer className="space-y-6 rounded-[32px] border border-[var(--border)] bg-white/88 px-6 py-6 shadow-[0_20px_50px_rgba(28,33,43,0.06)]">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <div className="text-xs font-semibold tracking-[0.16em] text-[var(--foreground-subtle)]">
                  LOOPIN LAB
                </div>
                <div className="mt-2 font-display text-2xl font-semibold text-[var(--foreground)]">
                  마곡 코드찾기
                </div>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--foreground-muted)]">
                  마곡 일반산업단지 입주 검토를 더 빨리 시작할 수 있도록, 업종코드
                  추천과 예비판정을 한 화면에 정리한 서비스입니다.
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <Badge variant="muted">업종코드 추천</Badge>
                <Badge variant="muted">입주 예비판정</Badge>
                <Badge variant="muted">법령 근거 정리</Badge>
              </div>
            </div>

            <div className="grid gap-3 md:grid-cols-3">
              {footerFacts.map((item) => (
                <div
                  key={item}
                  className="rounded-[22px] border border-[var(--border)] bg-[rgba(239,245,255,0.94)] px-4 py-4 text-sm leading-6 text-[var(--foreground-muted)]"
                >
                  {item}
                </div>
              ))}
            </div>

            <div className="rounded-[26px] border border-sky-200 bg-sky-50 px-4 py-4 text-sm leading-6 text-sky-900">
              제휴 링크가 포함된 영역에서는 대가성 안내를 함께 표기합니다.
            </div>
          </footer>
        </main>
      </div>
    </div>
  )
}

export default App
