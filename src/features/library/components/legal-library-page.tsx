import { ArrowRight, BookOpenText, ExternalLink, Scale } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { getLegalLibraryEntryDetails } from '@/features/library/data/legal-library'
import { formatKoreanDate } from '@/utils/format'

interface LegalLibraryPageProps {
  onBackHome: () => void
  onOpenUpdates: () => void
}

export function LegalLibraryPage({
  onBackHome,
  onOpenUpdates,
}: LegalLibraryPageProps) {
  const entries = getLegalLibraryEntryDetails()

  return (
    <section
      id="library"
      className="space-y-5 rounded-[20px] border border-[var(--border)] bg-[var(--surface-strong)] p-5 shadow-[0_24px_60px_rgba(28,33,43,0.08)] sm:p-6 lg:p-7"
    >
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_auto] xl:items-start">
        <div className="max-w-3xl">
          <Badge variant="muted">법령 라이브러리</Badge>
          <h1 className="mt-4 max-w-3xl font-display text-[2rem] font-semibold leading-[1.08] text-[var(--foreground)] sm:text-[2.4rem]">
            판정에 쓰인 문서를
            <br />
            한 번에 볼 수 있습니다
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--foreground-muted)] sm:text-[15px]">
            결과 화면에 나온 근거를 문서별로 다시 모아봤습니다. 궁금한 문장을 직접
            확인하거나, 원문으로 이어서 볼 때 편하게 참고할 수 있습니다.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" onClick={onBackHome}>
            검색 홈으로 돌아가기
          </Button>
          <Button variant="outline" onClick={onOpenUpdates}>
            업데이트 로그 보기
          </Button>
          <Button asChild variant="ghost">
            <a href="/library/" target="_blank" rel="noopener noreferrer">
              공개 페이지 열기
            </a>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-2 xl:items-start">
        {entries.map((entry) => (
          <Card
            key={entry.id}
            className="border-[var(--border-accent)] bg-white/96 shadow-[0_18px_40px_rgba(24,32,43,0.06)]"
          >
            <CardContent className="space-y-5 p-5 sm:p-6">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="muted">
                  {entry.sourceKind === 'magokPlan' ? '마곡 고시문' : '산업집적법 시행령'}
                </Badge>
                <Badge variant="muted">기준일 {formatKoreanDate(entry.effectiveDate)}</Badge>
                {entry.officialSource.documentNumber ? (
                  <Badge variant="muted">{entry.officialSource.documentNumber}</Badge>
                ) : null}
              </div>

              <div>
                <h2 className="font-display text-2xl font-semibold text-[var(--foreground)]">
                  {entry.title}
                </h2>
                <p className="mt-3 text-sm leading-7 text-[var(--foreground-muted)]">
                  {entry.summary}
                </p>
              </div>

              <div className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_300px] xl:items-start">
                <div className="rounded-[14px] border border-[var(--border)] bg-[rgba(241,247,255,0.9)] p-4">
                  <div className="flex items-center gap-2 text-sm font-medium text-[var(--foreground)]">
                    <Scale className="size-4 text-[var(--accent)]" />
                    문서 정보
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Badge>{entry.officialSource.authority}</Badge>
                    {entry.officialSource.documentNumber ? (
                      <Badge variant="muted">{entry.officialSource.documentNumber}</Badge>
                    ) : null}
                    {entry.officialSource.publishedDate ? (
                      <Badge variant="muted">
                        공개일 {formatKoreanDate(entry.officialSource.publishedDate)}
                      </Badge>
                    ) : null}
                  </div>
                  {entry.officialSource.description ? (
                    <p className="mt-3 text-sm leading-6 text-[var(--foreground-muted)]">
                      {entry.officialSource.description}
                    </p>
                  ) : null}
                </div>

                <div className="rounded-[14px] border border-[var(--border)] bg-white/92 p-4">
                  <div className="flex items-center gap-2 text-sm font-medium text-[var(--foreground)]">
                    <ExternalLink className="size-4 text-[var(--accent)]" />
                    원문 출처
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Button asChild size="sm" variant="outline">
                      <a
                        href={entry.officialSource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {entry.officialSource.title}
                        <ExternalLink className="size-3.5" />
                      </a>
                    </Button>
                    {entry.supplementarySources?.map((source) => (
                      <Button asChild key={`${entry.id}-${source.url}`} size="sm" variant="ghost">
                        <a href={source.url} target="_blank" rel="noopener noreferrer">
                          {source.title}
                          <ExternalLink className="size-3.5" />
                        </a>
                      </Button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="rounded-[14px] border border-[var(--border)] bg-[rgba(241,247,255,0.9)] p-4">
                <div className="flex items-center gap-2 text-sm font-medium text-[var(--foreground)]">
                  <BookOpenText className="size-4 text-[var(--accent)]" />
                  이 문서를 언제 보나요?
                </div>
                <p className="mt-3 text-sm leading-6 text-[var(--foreground-muted)]">
                  {entry.applicability}
                </p>
              </div>

              <div className="space-y-3">
                {entry.bases.map((basis) => (
                  <article
                    key={basis.id}
                    className="rounded-[14px] border border-[var(--border)] bg-[rgba(255,255,255,0.84)] p-4"
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
                    {basis.quote ? (
                      <div className="mt-3 rounded-[12px] bg-[rgba(239,245,255,0.84)] px-3 py-3 text-sm leading-6 text-[var(--foreground-muted)]">
                        쉽게 풀면: {basis.quote}
                      </div>
                    ) : null}
                  </article>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="rounded-[18px] border border-[var(--border)] bg-white/92 p-5 sm:p-6">
        <div className="flex items-center gap-2 text-sm font-medium text-[var(--foreground)]">
          <Scale className="size-4 text-[var(--accent)]" />
          이렇게 보면 좋습니다
        </div>
        <ul className="mt-4 space-y-2 text-sm leading-6 text-[var(--foreground-muted)]">
          <li>결과 화면에서 본 근거가 궁금하면 여기서 같은 문서를 다시 찾아보면 됩니다.</li>
          <li>지식산업센터와 산업시설구역이 헷갈릴 때는 문서별 설명을 차례로 읽어보면 이해가 쉽습니다.</li>
          <li>최근에 달라진 내용까지 보고 싶다면 업데이트 로그로 이어서 보면 됩니다.</li>
        </ul>
        <div className="mt-4">
          <Button variant="outline" onClick={onOpenUpdates}>
            업데이트 로그 이어서 보기
            <ArrowRight className="size-4" />
          </Button>
        </div>
      </div>
    </section>
  )
}
