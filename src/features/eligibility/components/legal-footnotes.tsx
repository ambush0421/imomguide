import { ExternalLink } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  getLegalLibraryEntryBySourceKind,
  type LegalLibraryEntry,
} from '@/features/library/data/legal-library'
import type { LegalBasis } from '@/features/eligibility/types'
import { formatKoreanDate } from '@/utils/format'

interface LegalFootnotesProps {
  legalBases: LegalBasis[]
}

export function LegalFootnotes({ legalBases }: LegalFootnotesProps) {
  const sourceEntries = legalBases.reduce<LegalLibraryEntry[]>((entries, basis) => {
    const entry = getLegalLibraryEntryBySourceKind(basis.source)

    if (entry && !entries.some((item) => item.id === entry.id)) {
      entries.push(entry)
    }

    return entries
  }, [])

  return (
    <section className="rounded-[24px] border border-[var(--border)] bg-white p-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h4 className="font-display text-lg font-semibold text-[var(--foreground)]">
            법적 근거 각주
          </h4>
          <p className="mt-2 text-sm leading-6 text-[var(--foreground-muted)]">
            결과 화면에 나온 판단을 바로 공유하거나 보고서에 옮길 수 있도록 근거 문구를
            각주형으로 정리했습니다.
          </p>
        </div>
        <Badge variant="muted">{legalBases.length}건</Badge>
      </div>

      {sourceEntries.length ? (
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {sourceEntries.map((entry) => (
            <article
              key={entry.id}
              className="rounded-2xl border border-[var(--border)] bg-[rgba(248,251,255,0.88)] p-4"
            >
              <div className="flex flex-wrap items-center gap-2">
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
              <div className="mt-3 text-sm font-semibold text-[var(--foreground)]">
                {entry.title}
              </div>
              <p className="mt-2 text-sm leading-6 text-[var(--foreground-muted)]">
                결과 화면과 보고서에 같은 출처 메타를 그대로 가져다 쓸 수 있도록 원문
                경로를 함께 표시합니다.
              </p>
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
            </article>
          ))}
        </div>
      ) : null}

      <ol className="mt-4 space-y-3">
        {legalBases.map((basis, index) => (
          <li
            key={basis.id}
            className="rounded-2xl border border-[var(--border)] bg-[rgba(241,247,255,0.9)] p-4"
          >
            {(() => {
              const sourceEntry = getLegalLibraryEntryBySourceKind(basis.source)

              return sourceEntry ? (
                <div className="mb-3 flex flex-wrap gap-2">
                  <Badge variant="muted">{sourceEntry.officialSource.authority}</Badge>
                  {sourceEntry.officialSource.documentNumber ? (
                    <Badge variant="muted">{sourceEntry.officialSource.documentNumber}</Badge>
                  ) : null}
                </div>
              ) : null
            })()}
            <div className="text-xs uppercase tracking-[0.14em] text-[var(--foreground-subtle)]">
              근거 {index + 1}
            </div>
            <div className="mt-2 text-sm font-semibold leading-6 text-[var(--foreground)]">
              {basis.sourceDocumentTitle ?? (basis.source === 'magokPlan' ? '마곡 관리기본계획' : '산업집적법 시행령')}
              {' · '}
              {basis.citation}
              {basis.pageHint ? ` · ${basis.pageHint}` : ''}
              {basis.articlePath ? ` · ${basis.articlePath}` : ''}
            </div>
            <p className="mt-3 text-sm leading-6 text-[var(--foreground-muted)]">
              {basis.summary}
            </p>
            {basis.quote ? (
              <div className="mt-3 rounded-xl bg-white/80 px-3 py-3 text-sm leading-6 text-[var(--foreground-muted)]">
                실무 해석 포인트: {basis.quote}
              </div>
            ) : null}
          </li>
        ))}
      </ol>
    </section>
  )
}
