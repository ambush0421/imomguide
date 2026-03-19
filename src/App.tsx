import {
  ArrowRight,
  Building2,
  CheckCircle2,
  ExternalLink,
  FileSearch,
  Landmark,
} from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { EligibilityForm } from '@/features/eligibility/components/eligibility-form'
import { IndustryDiscoveryPanel } from '@/features/eligibility/components/industry-discovery-panel'
import { ResultPanel } from '@/features/eligibility/components/result-panel'
import { RulebookTabs } from '@/features/eligibility/components/rulebook-tabs'
import { useEligibilityStore } from '@/store/eligibility-store'
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
    description:
      '업무 공간 준비에 참고할 수 있는 외부 추천 상품 링크입니다.',
    href: 'https://link.coupang.com/a/d7nWco',
    variant: 'default' as const,
  },
  {
    title: '추가 추천 보기',
    description:
      '다른 추천 항목도 보고 싶다면 보조 링크에서 이어서 확인할 수 있습니다.',
    href: 'https://link.coupang.com/a/d7n7ta',
    variant: 'secondary' as const,
  },
]

const affiliateWidget = {
  src: 'https://coupa.ng/clX3qg',
  title: '쿠팡 파트너스 상품 위젯',
}

const sideAffiliateBanner = {
  href: 'https://link.coupang.com/a/d7pcAe',
  imageSrc:
    'https://ads-partners.coupang.com/banners/973791?subId=&traceId=V0-301-879dd1202e5c73b2-I973791&w=160&h=600',
  imageAlt: '쿠팡 파트너스 사이드 배너',
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
    setField,
    setFlag,
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

  return (
    <div className="min-h-screen">
      {(['left', 'right'] as const).map((side) => (
        <a
          key={side}
          href={sideAffiliateBanner.href}
          target="_blank"
          rel="nofollow sponsored noopener"
          referrerPolicy="unsafe-url"
          aria-label={`쿠팡 파트너스 사이드 배너 ${side}`}
          className={`fixed top-1/2 z-30 hidden -translate-y-1/2 2xl:block ${
            side === 'left' ? 'left-4' : 'right-4'
          }`}
        >
          <img
            src={sideAffiliateBanner.imageSrc}
            alt={sideAffiliateBanner.imageAlt}
            width="160"
            height="600"
            loading="lazy"
            className="h-auto w-[160px] rounded-[24px] border border-[var(--border)] bg-white shadow-[0_18px_40px_rgba(28,33,43,0.18)]"
          />
        </a>
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
          <section className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_380px] lg:items-start">
            <div className="rounded-[36px] border border-[var(--border)] bg-white/88 px-6 py-8 shadow-[0_24px_60px_rgba(28,33,43,0.08)] sm:px-8 lg:px-10 lg:py-10">
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
              <CardContent className="space-y-5 p-6">
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

                <div className="flex flex-wrap gap-2">
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

            <div className="mt-8 grid gap-6 xl:grid-cols-[minmax(0,1.04fr)_minmax(360px,0.96fr)]">
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
              />
              <ResultPanel
                input={input}
                result={result}
                status={status}
                error={error}
                onEvaluate={evaluate}
              />
            </div>
          </section>

          <section className="grid gap-6 lg:grid-cols-[360px_minmax(0,1fr)]">
            <Card>
              <CardContent className="space-y-4 p-6">
                <Badge variant="muted">직접 수정</Badge>
                <h2 className="font-display text-3xl font-semibold text-[var(--foreground)]">
                  예외 조건이 있으면
                  <br />
                  여기서만 보정하세요.
                </h2>
                <p className="text-sm leading-7 text-[var(--foreground-muted)]">
                  대부분은 추천 업종을 고른 뒤 결과만 보면 충분합니다. 구역, 신청 주체,
                  호스팅 여부처럼 예외가 있는 경우에만 아래 보정 폼을 열어 다시 판정하면
                  됩니다.
                </p>
                <div className="space-y-3">
                  <div className="rounded-[22px] border border-[var(--border)] bg-[rgba(255,255,255,0.72)] px-4 py-4 text-sm leading-6 text-[var(--foreground-muted)]">
                    추천 업종과 예외 조건이 다르면 직접 바꿔도 됩니다.
                  </div>
                  <div className="rounded-[22px] border border-[var(--border)] bg-[rgba(255,255,255,0.72)] px-4 py-4 text-sm leading-6 text-[var(--foreground-muted)]">
                    수정 후에는 같은 화면에서 바로 다시 판정됩니다.
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
            />
          </section>

          <section
            id="affiliate"
            className="rounded-[32px] border border-[var(--border)] bg-[linear-gradient(180deg,rgba(248,252,255,0.96),rgba(255,255,255,0.94))] p-6 shadow-[0_20px_56px_rgba(28,33,43,0.08)] sm:p-8"
          >
            <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_184px] lg:items-center">
              <div>
                <Badge variant="muted">추천 상품</Badge>
                <h2 className="mt-4 font-display text-3xl font-semibold text-[var(--foreground)] sm:text-4xl">
                  업무용 추천 상품
                </h2>
                <p className="mt-3 max-w-3xl text-sm leading-7 text-[var(--foreground-muted)]">
                  업무 공간이나 사무환경을 준비할 때 참고할 수 있는 외부 추천 상품입니다.
                  필요한 경우에만 가볍게 확인해 보세요.
                </p>

                <div className="mt-6 flex flex-wrap gap-3">
                  {affiliateActions.map((item) => (
                    <Button
                      key={item.title}
                      asChild
                      variant={item.variant}
                      className="h-auto rounded-2xl px-5 py-4"
                    >
                      <a
                        href={item.href}
                        target="_blank"
                        rel="nofollow sponsored noopener"
                        referrerPolicy="unsafe-url"
                      >
                        <span className="flex flex-col items-start gap-1 text-left">
                          <span className="font-semibold">{item.title}</span>
                          <span className="text-xs font-medium opacity-80">
                            {item.description}
                          </span>
                        </span>
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
                        제휴 안내
                      </div>
                      <p className="mt-1 text-sm leading-6 text-[var(--foreground-muted)]">
                        {coupangDisclosureText}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mx-auto w-full max-w-[168px] rounded-[28px] border border-[var(--border)] bg-white p-4 shadow-[0_18px_34px_rgba(43,109,255,0.08)]">
                <div className="text-xs font-semibold tracking-[0.14em] text-[var(--foreground-subtle)]">
                  상품 위젯
                </div>
                <div className="mt-3 flex justify-center">
                  <iframe
                    src={affiliateWidget.src}
                    title={affiliateWidget.title}
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
