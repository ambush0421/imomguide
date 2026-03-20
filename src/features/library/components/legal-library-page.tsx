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
      className="space-y-6 rounded-[36px] border border-[var(--border)] bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(244,248,255,0.96))] p-6 shadow-[0_24px_60px_rgba(28,33,43,0.08)] sm:p-8"
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <Badge variant="muted">법령 라이브러리</Badge>
          <h1 className="mt-4 font-display text-3xl font-semibold text-[var(--foreground)] sm:text-4xl">
            판정 근거를
            <br />
            문서 단위로 읽는 화면입니다
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-[var(--foreground-muted)] sm:text-base">
            결과 화면에서 쓰인 시행령과 마곡 고시문을 문서 단위로 다시 정리했습니다.
            어떤 판정이 어느 문서에서 왔는지, 실무에서 자주 인용하는 조문이 무엇인지
            한 번에 볼 수 있습니다.
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

      <div className="grid gap-4 lg:grid-cols-2">
        {entries.map((entry) => (
          <Card
            key={entry.id}
            className="border-[var(--border-accent)] bg-white/96 shadow-[0_18px_40px_rgba(24,32,43,0.06)]"
          >
            <CardContent className="space-y-5 p-5">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="muted">
                  {entry.sourceKind === 'magokPlan' ? '마곡 고시문' : '산업집적법 시행령'}
                </Badge>
                <Badge variant="muted">공개일 {formatKoreanDate(entry.effectiveDate)}</Badge>
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

              <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_320px]">
                <div className="rounded-[22px] border border-[var(--border)] bg-[rgba(241,247,255,0.9)] p-4">
                  <div className="flex items-center gap-2 text-sm font-medium text-[var(--foreground)]">
                    <Scale className="size-4 text-[var(--accent)]" />
                    문서 메타
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

                <div className="rounded-[22px] border border-[var(--border)] bg-white/92 p-4">
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

              <div className="rounded-[22px] border border-[var(--border)] bg-[rgba(241,247,255,0.9)] p-4">
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
                    className="rounded-[22px] border border-[var(--border)] bg-[rgba(255,255,255,0.84)] p-4"
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
                      <div className="mt-3 rounded-xl bg-[rgba(239,245,255,0.84)] px-3 py-3 text-sm leading-6 text-[var(--foreground-muted)]">
                        실무 해석: {basis.quote}
                      </div>
                    ) : null}
                  </article>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="rounded-[28px] border border-[var(--border)] bg-white/92 p-5">
        <div className="flex items-center gap-2 text-sm font-medium text-[var(--foreground)]">
          <Scale className="size-4 text-[var(--accent)]" />
          라이브러리 활용 팁
        </div>
        <ul className="mt-4 space-y-2 text-sm leading-6 text-[var(--foreground-muted)]">
          <li>입주 상담 전에는 결과 화면의 각주와 여기 라이브러리 문장을 함께 보여주면 설득력이 높습니다.</li>
          <li>산업시설구역은 고시문 우선, 지식산업센터 예외 허용은 시행령과 고시문을 같이 읽는 편이 안전합니다.</li>
          <li>심의 필요나 경계 업종은 업데이트 로그까지 같이 보면 최근 기준 반영 여부를 설명하기 쉽습니다.</li>
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
