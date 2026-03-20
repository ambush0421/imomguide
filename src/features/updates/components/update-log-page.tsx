import { ArrowRight, ExternalLink, FileSearch, History } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { UPDATE_LOG_ENTRIES } from '@/features/updates/data/update-log'
import { formatKoreanDate } from '@/utils/format'

interface UpdateLogPageProps {
  onBackHome: () => void
  onOpenLibrary: () => void
}

export function UpdateLogPage({
  onBackHome,
  onOpenLibrary,
}: UpdateLogPageProps) {
  return (
    <section
      id="updates"
      className="space-y-6 rounded-[36px] border border-[var(--border)] bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(244,248,255,0.96))] p-6 shadow-[0_24px_60px_rgba(28,33,43,0.08)] sm:p-8"
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <Badge variant="muted">업데이트 로그</Badge>
          <h1 className="mt-4 font-display text-3xl font-semibold text-[var(--foreground)] sm:text-4xl">
            기준 변경과 제품 보강 이력을
            <br />
            한 번에 봅니다
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-[var(--foreground-muted)] sm:text-base">
            어떤 기준을 언제 반영했고, 화면이 왜 달라졌는지 기록하는 페이지입니다.
            상담 전에 최신 반영 범위를 설명하거나, 기존 판정과 현재 판정 차이를 확인할 때
            참고할 수 있습니다.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" onClick={onBackHome}>
            검색 홈으로 돌아가기
          </Button>
          <Button variant="outline" onClick={onOpenLibrary}>
            법령 라이브러리 보기
          </Button>
          <Button asChild variant="ghost">
            <a href="/updates/" target="_blank" rel="noopener noreferrer">
              공개 페이지 열기
            </a>
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {UPDATE_LOG_ENTRIES.map((entry, index) => (
          <Card
            key={entry.id}
            className="border-[rgba(43,109,255,0.12)] bg-white/96 shadow-[0_18px_40px_rgba(24,32,43,0.06)]"
          >
            <CardContent className="space-y-5 p-5">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="muted">
                      {formatKoreanDate(entry.date)}
                    </Badge>
                    <Badge variant="muted">업데이트 {index + 1}</Badge>
                  </div>
                  <h2 className="mt-4 font-display text-2xl font-semibold text-[var(--foreground)]">
                    {entry.title}
                  </h2>
                  <p className="mt-3 text-sm leading-7 text-[var(--foreground-muted)]">
                    {entry.summary}
                  </p>
                </div>

                <div className="rounded-[22px] border border-[var(--border)] bg-[rgba(241,247,255,0.9)] px-4 py-4 lg:max-w-xs">
                  <div className="flex items-center gap-2 text-sm font-medium text-[var(--foreground)]">
                    <FileSearch className="size-4 text-[var(--accent)]" />
                    반영 범위
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {entry.affectedAreas.map((item) => (
                      <Badge key={`${entry.id}-${item}`}>{item}</Badge>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_280px]">
                <div className="rounded-[24px] border border-[var(--border)] bg-[rgba(248,251,255,0.86)] p-4">
                  <div className="text-sm font-medium text-[var(--foreground)]">
                    이번에 달라진 점
                  </div>
                  <ul className="mt-3 space-y-2 text-sm leading-6 text-[var(--foreground-muted)]">
                    {entry.highlights.map((item) => (
                      <li key={`${entry.id}-${item}`}>{item}</li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-[24px] border border-[var(--border)] bg-white/92 p-4">
                  <div className="flex items-center gap-2 text-sm font-medium text-[var(--foreground)]">
                    <ExternalLink className="size-4 text-[var(--accent)]" />
                    원문·정책 출처
                  </div>
                  {entry.sourceReferences.length ? (
                    <div className="mt-3 space-y-3">
                      {entry.sourceReferences.map((source) => (
                        <article
                          key={`${entry.id}-${source.url}`}
                          className="rounded-[18px] border border-[var(--border)] bg-[rgba(248,251,255,0.82)] p-3"
                        >
                          <a
                            className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--accent)] hover:underline"
                            href={source.url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {source.title}
                            <ExternalLink className="size-3.5" />
                          </a>
                          <div className="mt-2 flex flex-wrap gap-2">
                            <Badge variant="muted">{source.authority}</Badge>
                            {source.documentNumber ? (
                              <Badge variant="muted">{source.documentNumber}</Badge>
                            ) : null}
                            {source.publishedDate ? (
                              <Badge variant="muted">
                                공개일 {formatKoreanDate(source.publishedDate)}
                              </Badge>
                            ) : null}
                          </div>
                          {source.description ? (
                            <p className="mt-2 text-xs leading-5 text-[var(--foreground-muted)]">
                              {source.description}
                            </p>
                          ) : null}
                        </article>
                      ))}
                    </div>
                  ) : (
                    <p className="mt-3 text-sm leading-6 text-[var(--foreground-muted)]">
                      등록된 원문 출처가 아직 없습니다.
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="rounded-[28px] border border-[var(--border)] bg-white/92 p-5">
        <div className="flex items-center gap-2 text-sm font-medium text-[var(--foreground)]">
          <History className="size-4 text-[var(--accent)]" />
          업데이트 로그 활용 팁
        </div>
        <ul className="mt-4 space-y-2 text-sm leading-6 text-[var(--foreground-muted)]">
          <li>최근 반영일이 필요한 상담에서는 홈 요약보다 이 로그를 직접 보여주는 편이 더 명확합니다.</li>
          <li>판정 기준이 바뀌었다고 설명해야 할 때는 affected area와 참고 근거를 함께 읽어주면 좋습니다.</li>
          <li>세부 조문까지 확인해야 하면 법령 라이브러리로 이어서 이동하면 됩니다.</li>
        </ul>
        <div className="mt-4">
          <Button variant="outline" onClick={onOpenLibrary}>
            법령 라이브러리 이어서 보기
            <ArrowRight className="size-4" />
          </Button>
        </div>
      </div>
    </section>
  )
}
