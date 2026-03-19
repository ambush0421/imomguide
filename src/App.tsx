import {
  ArrowRight,
  BadgeCheck,
  Building2,
  FileSearch,
  Landmark,
  SearchCheck,
  ShieldCheck,
  SlidersHorizontal,
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

const heroSignals = [
  {
    label: '기준 문서',
    value: '시행령 + 관리기본계획',
  },
  {
    label: '대상',
    value: '마곡 일반산업단지',
  },
  {
    label: '결과',
    value: '코드 추천 + 입주 판정',
  },
]

const serviceHighlights = [
  {
    icon: SearchCheck,
    title: '사업 설명만 넣어도 시작됩니다',
    description:
      '업태·종목을 모르더라도 자연어로 적으면 가장 가까운 업종코드를 먼저 추천합니다.',
  },
  {
    icon: BadgeCheck,
    title: '선택 즉시 결과로 이어집니다',
    description:
      '추천 코드를 고르면 마곡 기준의 입주 가능성을 바로 예비판정해 줍니다.',
  },
  {
    icon: SlidersHorizontal,
    title: '애매한 케이스만 직접 보정합니다',
    description:
      '구역, 신청 주체, 예외조건은 하단에서 필요할 때만 열어 수정할 수 있습니다.',
  },
]

const audienceCards = [
  {
    title: '임차 문의를 받는 중개 실무자',
    description:
      '업종 설명만 받아도 마곡에서 바로 가능한지, 심의가 필요한지 먼저 걸러볼 수 있습니다.',
  },
  {
    title: '입주 검토 중인 법인 담당자',
    description:
      '사업자등록증의 업태·종목을 그대로 붙여 넣고 후보 코드와 판정 결과를 함께 확인할 수 있습니다.',
  },
  {
    title: '서류 전 검토가 필요한 운영팀',
    description:
      '불가 업종, 심의 필요 업종, 추가 확인이 필요한 케이스를 초기에 빠르게 분류할 수 있습니다.',
  },
]

const quickLaunchCases = [
  '저는 광고대행업 해요',
  '앱 개발과 SaaS 운영을 합니다',
  '업태: 서비스 / 종목: 광고대행업',
  '행사 기획, 컨벤션, 전시 대행을 합니다',
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
      <div className="mx-auto max-w-[1240px] px-4 py-4 sm:px-6 lg:px-8 lg:py-6">
        <header className="sticky top-4 z-20 rounded-full border border-white/10 bg-[rgba(8,14,24,0.76)] px-4 py-3 shadow-[0_20px_60px_rgba(0,0,0,0.22)] backdrop-blur-xl">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <a href="#top" className="flex items-center gap-3">
              <div className="inline-flex size-11 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#f56a1f,#ff9f45)] text-[var(--accent-foreground)] shadow-[0_10px_30px_rgba(245,106,31,0.25)]">
                <Building2 className="size-5" />
              </div>
              <div>
                <div className="text-sm font-semibold tracking-[0.08em] text-[var(--foreground-subtle)]">
                  LOOPIN LAB
                </div>
                <div className="text-base font-semibold text-[var(--foreground)]">
                  마곡 코드찾기
                </div>
              </div>
            </a>

            <nav className="hidden items-center gap-1 lg:flex">
              <a
                href="#finder"
                className="rounded-full px-4 py-2 text-sm font-medium text-[var(--foreground-muted)] transition hover:bg-white/8 hover:text-[var(--foreground)]"
              >
                코드 찾기
              </a>
              <a
                href="#guide"
                className="rounded-full px-4 py-2 text-sm font-medium text-[var(--foreground-muted)] transition hover:bg-white/8 hover:text-[var(--foreground)]"
              >
                이용 흐름
              </a>
              <a
                href="#criteria"
                className="rounded-full px-4 py-2 text-sm font-medium text-[var(--foreground-muted)] transition hover:bg-white/8 hover:text-[var(--foreground)]"
              >
                판정 기준
              </a>
            </nav>

            <Button asChild size="sm">
              <a href="#finder">
                바로 찾기
                <ArrowRight className="size-4" />
              </a>
            </Button>
          </div>
        </header>

        <main id="top" className="space-y-8 pb-10 pt-6 lg:space-y-10 lg:pt-8">
          <section className="relative overflow-hidden rounded-[36px] border border-white/10 bg-[linear-gradient(135deg,rgba(14,23,38,0.96),rgba(8,14,24,0.88))] px-6 py-8 shadow-[0_28px_120px_rgba(0,0,0,0.26)] sm:px-8 lg:px-10 lg:py-10">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(245,106,31,0.24),transparent_26%),radial-gradient(circle_at_85%_18%,rgba(32,197,174,0.18),transparent_22%),radial-gradient(circle_at_bottom_right,rgba(79,101,255,0.12),transparent_24%)]" />
            <div className="relative grid gap-8 xl:grid-cols-[minmax(0,1.02fr)_minmax(360px,0.98fr)] xl:items-center">
              <div>
                <Badge className="bg-white/10 text-white">마곡 일반산업단지 전용</Badge>
                <h1 className="mt-5 max-w-4xl font-display text-4xl font-semibold tracking-[-0.06em] text-white sm:text-5xl lg:text-6xl">
                  마곡 업종코드,
                  <br />
                  설명만 넣으면 바로 찾습니다.
                </h1>
                <p className="mt-5 max-w-3xl text-base leading-7 text-[var(--foreground-muted)] sm:text-lg">
                  사업 설명이나 사업자등록증의 업태·종목을 넣으면 업종코드를 먼저
                  찾고, 이어서 마곡 관리기본계획 기준의 입주 가능성까지 한 번에
                  보여주는 사이트입니다.
                </p>

                <div className="mt-6 flex flex-wrap gap-3">
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

                <div className="mt-6 flex flex-wrap gap-3">
                  <Badge variant="muted">
                    시행령 기준일 {formatKoreanDate('2026-01-02')}
                  </Badge>
                  <Badge variant="muted">
                    관리기본계획 고시일 {formatKoreanDate('2025-10-30')}
                  </Badge>
                </div>
              </div>

              <div className="grid gap-4">
                <Card className="border-white/12 bg-white/[0.06] shadow-[0_24px_80px_rgba(0,0,0,0.22)]">
                  <CardContent className="space-y-5 p-6">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <div className="text-sm font-semibold text-[var(--foreground)]">
                          빠른 예시
                        </div>
                        <p className="mt-1 text-sm leading-6 text-[var(--foreground-muted)]">
                          이 사이트에서 실제로 하게 되는 가장 기본 흐름입니다.
                        </p>
                      </div>
                      <div className="inline-flex size-12 items-center justify-center rounded-2xl bg-[var(--accent)]/16 text-[var(--accent-soft)]">
                        <FileSearch className="size-6" />
                      </div>
                    </div>

                    <div className="rounded-[24px] border border-white/10 bg-black/20 p-4">
                      <div className="text-xs uppercase tracking-[0.16em] text-[var(--foreground-subtle)]">
                        입력
                      </div>
                      <p className="mt-2 text-lg font-semibold text-[var(--foreground)]">
                        “저는 광고대행업 해요”
                      </p>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="rounded-[24px] border border-emerald-300/10 bg-emerald-400/7 p-4">
                        <div className="text-xs uppercase tracking-[0.16em] text-emerald-100/80">
                          추천 코드
                        </div>
                        <div className="mt-2 text-xl font-semibold text-white">71310</div>
                        <p className="mt-1 text-sm text-emerald-50/80">광고 대행업</p>
                      </div>
                      <div className="rounded-[24px] border border-amber-300/10 bg-amber-400/7 p-4">
                        <div className="text-xs uppercase tracking-[0.16em] text-amber-100/80">
                          결과
                        </div>
                        <div className="mt-2 text-xl font-semibold text-white">가능</div>
                        <p className="mt-1 text-sm text-amber-50/80">
                          구역과 조건에 따라 추가 검토만 하면 됩니다.
                        </p>
                      </div>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-3">
                      {heroSignals.map((signal) => (
                        <div
                          key={signal.label}
                          className="rounded-[22px] border border-white/8 bg-white/[0.04] px-4 py-4"
                        >
                          <div className="text-xs text-[var(--foreground-subtle)]">
                            {signal.label}
                          </div>
                          <div className="mt-2 text-sm font-semibold text-[var(--foreground)]">
                            {signal.value}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>

          <section className="grid gap-4 lg:grid-cols-3" id="guide">
            {serviceHighlights.map((highlight) => {
              const Icon = highlight.icon

              return (
                <Card
                  key={highlight.title}
                  className="border-white/8 bg-white/[0.05] shadow-none"
                >
                  <CardContent className="p-6">
                    <div className="inline-flex size-12 items-center justify-center rounded-2xl bg-white/8 text-[var(--accent-soft)]">
                      <Icon className="size-5" />
                    </div>
                    <h2 className="mt-5 font-display text-2xl font-semibold text-[var(--foreground)]">
                      {highlight.title}
                    </h2>
                    <p className="mt-3 text-sm leading-6 text-[var(--foreground-muted)]">
                      {highlight.description}
                    </p>
                  </CardContent>
                </Card>
              )
            })}
          </section>

          <section className="grid gap-4 xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
            <Card className="border-white/8 bg-white/[0.05] shadow-none">
              <CardContent className="p-6">
                <Badge variant="muted">이런 분께 맞습니다</Badge>
                <h2 className="mt-4 font-display text-3xl font-semibold text-[var(--foreground)]">
                  코드표를 직접 뒤지지 않아도
                  <br />
                  바로 걸러낼 수 있게 만들었습니다.
                </h2>
                <p className="mt-4 max-w-2xl text-sm leading-7 text-[var(--foreground-muted)]">
                  마곡은 허용 업종, 심의 필요 업종, 지식산업센터 예외 업종이 섞여
                  있어서 매번 코드표를 다시 찾아야 합니다. 이 사이트는 그 초기 확인
                  시간을 줄이는 데 초점을 맞췄습니다.
                </p>
              </CardContent>
            </Card>

            <div className="grid gap-4">
              {audienceCards.map((card) => (
                <Card key={card.title} className="border-white/8 bg-white/[0.05] shadow-none">
                  <CardContent className="p-6">
                    <h3 className="font-display text-2xl font-semibold text-[var(--foreground)]">
                      {card.title}
                    </h3>
                    <p className="mt-3 text-sm leading-6 text-[var(--foreground-muted)]">
                      {card.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          <section
            id="finder"
            className="rounded-[36px] border border-white/10 bg-white/[0.04] p-6 shadow-[0_24px_90px_rgba(0,0,0,0.18)] sm:p-8"
          >
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <Badge variant="muted">핵심 기능</Badge>
                <h2 className="mt-4 font-display text-3xl font-semibold text-[var(--foreground)] sm:text-4xl">
                  지금 바로 업종코드를 찾아보세요
                </h2>
                <p className="mt-3 max-w-3xl text-sm leading-7 text-[var(--foreground-muted)]">
                  자유 문장으로 적어도 되고, 사업자등록증의 업태·종목을 그대로 붙여
                  넣어도 됩니다. 코드 추천과 입주 판정을 같은 화면에서 이어서 볼 수
                  있습니다.
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                {quickLaunchCases.map((example) => (
                  <Button
                    key={example}
                    size="sm"
                    variant="secondary"
                    onClick={() => runQuickSearch(example)}
                  >
                    {example}
                  </Button>
                ))}
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

          <section className="grid gap-6 xl:grid-cols-[minmax(0,0.88fr)_minmax(0,1.12fr)]">
            <Card className="border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.03))] shadow-none">
              <CardContent className="space-y-5 p-6">
                <Badge variant="muted">신뢰 포인트</Badge>
                <h2 className="font-display text-3xl font-semibold text-[var(--foreground)]">
                  아무 코드나 찍지 않고,
                  <br />
                  문서 기준으로 보수적으로 판단합니다.
                </h2>
                <div className="space-y-4">
                  <div className="rounded-[24px] border border-white/8 bg-white/[0.04] p-4">
                    <div className="flex items-center gap-3">
                      <Landmark className="size-5 text-[var(--accent-soft)]" />
                      <div className="text-sm font-semibold text-[var(--foreground)]">
                        법령과 고시문 기준
                      </div>
                    </div>
                    <p className="mt-2 text-sm leading-6 text-[var(--foreground-muted)]">
                      산업집적법 시행령과 마곡 관리기본계획을 함께 반영해 지식산업센터
                      예외와 심의 포인트까지 구분합니다.
                    </p>
                  </div>
                  <div className="rounded-[24px] border border-white/8 bg-white/[0.04] p-4">
                    <div className="flex items-center gap-3">
                      <ShieldCheck className="size-5 text-[var(--accent-soft)]" />
                      <div className="text-sm font-semibold text-[var(--foreground)]">
                        애매하면 보수적으로
                      </div>
                    </div>
                    <p className="mt-2 text-sm leading-6 text-[var(--foreground-muted)]">
                      확정이 어려운 케이스는 무리하게 `가능`으로 찍지 않고 `심의 필요`
                      또는 `정보 부족`으로 안내합니다.
                    </p>
                  </div>
                  <div className="rounded-[24px] border border-white/8 bg-white/[0.04] p-4">
                    <div className="flex items-center gap-3">
                      <BadgeCheck className="size-5 text-[var(--accent-soft)]" />
                      <div className="text-sm font-semibold text-[var(--foreground)]">
                        실무 보정까지 같은 화면에서
                      </div>
                    </div>
                    <p className="mt-2 text-sm leading-6 text-[var(--foreground-muted)]">
                      구역, 신청 주체, 예외 조건이 있으면 아래 보정 섹션에서 바로 바꿔
                      다시 판정할 수 있습니다.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-white/8 bg-white/[0.04] shadow-none">
              <CardContent className="p-6">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="text-sm font-semibold text-[var(--foreground)]">
                      세부 조건은 필요한 경우에만 여세요
                    </div>
                    <p className="mt-1 text-sm leading-6 text-[var(--foreground-muted)]">
                      대부분은 코드 추천만으로 충분하지만, 애매한 케이스는 아래에서
                      직접 수정할 수 있습니다.
                    </p>
                  </div>
                  <Badge variant="muted" className="w-fit">
                    선택 사항
                  </Badge>
                </div>
                <div className="mt-6">
                  <EligibilityForm
                    input={input}
                    status={status}
                    onFieldChange={setField}
                    onFlagChange={setFlag}
                    onEvaluate={evaluate}
                    onReset={reset}
                  />
                </div>
              </CardContent>
            </Card>
          </section>

          <section id="criteria" className="space-y-4">
            <div>
              <Badge variant="muted">판정 기준</Badge>
              <h2 className="mt-4 font-display text-3xl font-semibold text-[var(--foreground)]">
                어떤 기준으로 보는지 아래에서 확인할 수 있습니다
              </h2>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-[var(--foreground-muted)]">
                마곡 산업시설구역, 지식산업센터 특례, 심의·제한 시나리오를 모두
                정리해 두었습니다.
              </p>
            </div>
            <RulebookTabs />
          </section>

          <footer className="rounded-[32px] border border-white/10 bg-[rgba(7,12,20,0.88)] px-6 py-6 shadow-[0_24px_80px_rgba(0,0,0,0.18)]">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <div className="text-sm font-semibold tracking-[0.08em] text-[var(--foreground-subtle)]">
                  LOOPIN LAB
                </div>
                <div className="mt-2 font-display text-2xl font-semibold text-[var(--foreground)]">
                  마곡 코드찾기
                </div>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--foreground-muted)]">
                  마곡 일반산업단지 입주 검토를 더 빠르게 시작할 수 있도록, 업종코드
                  추천과 예비판정을 한 화면에 정리한 서비스입니다.
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <Badge variant="muted">업종코드 추천</Badge>
                <Badge variant="muted">입주 예비판정</Badge>
                <Badge variant="muted">마곡 관리기본계획 반영</Badge>
              </div>
            </div>
          </footer>
        </main>
      </div>
    </div>
  )
}

export default App
