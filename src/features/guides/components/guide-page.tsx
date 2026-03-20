import { ArrowRight, BookOpenText, FileQuestion, LibraryBig } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import type { MagokGuideEntry } from '@/features/guides/data/guide-catalog'
import { formatKoreanDate } from '@/utils/format'

interface GuidePageProps {
  guide: MagokGuideEntry
  onBackHome: () => void
  onOpenDirectory: () => void
  onOpenGuide: (code: string) => void
}

function getVerdictBadgeVariant(verdict: MagokGuideEntry['zoneSummaries'][number]['verdict']) {
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

export function GuidePage({
  guide,
  onBackHome,
  onOpenDirectory,
  onOpenGuide,
}: GuidePageProps) {
  return (
    <section
      id="guide"
      className="space-y-6 rounded-[36px] border border-[var(--border)] bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(244,248,255,0.96))] p-6 shadow-[0_24px_60px_rgba(28,33,43,0.08)] sm:p-8"
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <Badge variant="muted">업종별 입주 가이드</Badge>
          <h1 className="mt-4 font-display text-3xl font-semibold text-[var(--foreground)] sm:text-4xl">
            {guide.title}
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-[var(--foreground-muted)] sm:text-base">
            {guide.summary}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" onClick={onBackHome}>
            검색 홈으로 돌아가기
          </Button>
          <Button variant="outline" onClick={onOpenDirectory}>
            코드 사전 보기
          </Button>
          <Button asChild variant="ghost">
            <a href={`/guides/${guide.code}/`} target="_blank" rel="noopener noreferrer">
              공개 페이지 열기
            </a>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.1fr)_320px]">
        <Card className="border-[var(--border-accent)] bg-white/96 shadow-[0_18px_40px_rgba(24,32,43,0.06)]">
          <CardContent className="space-y-5 p-5">
            <div className="flex flex-wrap items-center gap-2">
              <Badge>{guide.code}</Badge>
              <Badge variant="muted">{guide.browseCategory}</Badge>
              <Badge variant="muted">업데이트 {formatKoreanDate(guide.updatedAt)}</Badge>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              {guide.zoneSummaries.map((zoneSummary) => (
                <div
                  key={`${guide.code}-${zoneSummary.zoneType}`}
                  className="rounded-[24px] border border-[var(--border)] bg-[rgba(241,247,255,0.9)] p-4"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant={getVerdictBadgeVariant(zoneSummary.verdict)}>
                      {zoneSummary.verdictLabel}
                    </Badge>
                    <Badge variant="muted">{zoneSummary.zoneLabel}</Badge>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-[var(--foreground-muted)]">
                    {zoneSummary.reason}
                  </p>
                  {zoneSummary.notes[0] ? (
                    <div className="mt-3 rounded-2xl border border-[var(--border)] bg-white/90 px-3 py-3 text-sm leading-6 text-[var(--foreground-muted)]">
                      {zoneSummary.notes[0]}
                    </div>
                  ) : null}
                </div>
              ))}
            </div>

            <div className="rounded-[24px] border border-[var(--border)] bg-[rgba(248,251,255,0.86)] p-4">
              <div className="flex items-center gap-2 text-sm font-medium text-[var(--foreground)]">
                <BookOpenText className="size-4 text-[var(--accent)]" />
                핵심 해설
              </div>
              <ul className="mt-3 space-y-2 text-sm leading-6 text-[var(--foreground-muted)]">
                {guide.highlights.map((item) => (
                  <li key={`${guide.code}-${item}`}>{item}</li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card className="border-[var(--border-soft)] bg-[rgba(248,251,255,0.84)] shadow-none">
          <CardContent className="space-y-4 p-5">
            <div className="inline-flex size-11 items-center justify-center rounded-2xl bg-[rgba(43,109,255,0.12)] text-[var(--accent)]">
              <LibraryBig className="size-5" />
            </div>
            <div>
              <div className="text-sm font-medium text-[var(--foreground-subtle)]">
                먼저 볼 구역
              </div>
              <div className="mt-2 text-2xl font-semibold text-[var(--foreground)]">
                {guide.recommendedZoneLabel}
              </div>
            </div>
            <div className="rounded-[22px] border border-[var(--border)] bg-white/90 px-4 py-4 text-sm leading-6 text-[var(--foreground-muted)]">
              이 가이드는 코드 사전, 결과 패널, 법적 근거 데이터를 합쳐 만든 문서형 요약입니다.
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
        <Card className="border-[var(--border-accent)] bg-white/96 shadow-[0_18px_40px_rgba(24,32,43,0.06)]">
          <CardContent className="space-y-4 p-5">
            <div className="flex items-center gap-2 text-sm font-medium text-[var(--foreground)]">
              <FileQuestion className="size-4 text-[var(--accent)]" />
              자주 묻는 질문
            </div>
            <div className="space-y-3">
              {guide.faq.map((item) => (
                <div
                  key={item.id}
                  className="rounded-[22px] border border-[var(--border)] bg-[rgba(248,251,255,0.86)] p-4"
                >
                  <div className="text-sm font-semibold text-[var(--foreground)]">
                    {item.question}
                  </div>
                  <p className="mt-2 text-sm leading-6 text-[var(--foreground-muted)]">
                    {item.answer}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-[var(--border-soft)] bg-[rgba(248,251,255,0.84)] shadow-none">
          <CardContent className="space-y-4 p-5">
            <div className="text-sm font-medium text-[var(--foreground)]">
              관련 법령
            </div>
            <div className="space-y-3">
              {guide.legalBases.map((basis) => (
                <div
                  key={basis.id}
                  className="rounded-[22px] border border-[var(--border)] bg-white/90 p-4"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge>{basis.citation}</Badge>
                    {basis.pageHint ? <Badge variant="muted">{basis.pageHint}</Badge> : null}
                    {basis.articlePath ? (
                      <Badge variant="muted">{basis.articlePath}</Badge>
                    ) : null}
                  </div>
                  <p className="mt-3 text-sm leading-6 text-[var(--foreground-muted)]">
                    {basis.summary}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-[var(--border-accent)] bg-white/96 shadow-[0_18px_40px_rgba(24,32,43,0.06)]">
        <CardContent className="space-y-4 p-5">
          <div className="text-sm font-medium text-[var(--foreground)]">연관 코드</div>
          <div className="flex flex-wrap gap-2">
            {guide.relatedCodes.map((relatedCode) => (
              <Button
                key={relatedCode.code}
                variant="secondary"
                size="sm"
                onClick={() => onOpenGuide(relatedCode.code)}
                aria-label={`${relatedCode.code} ${relatedCode.name} 가이드 보기`}
              >
                {relatedCode.code} · {relatedCode.name}
              </Button>
            ))}
          </div>
          <div>
            <Button variant="outline" onClick={onOpenDirectory}>
              전수 코드 사전에서 더 보기
              <ArrowRight className="size-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </section>
  )
}
