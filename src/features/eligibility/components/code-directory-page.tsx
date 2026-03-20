import { useEffect, useMemo, useState } from 'react'
import {
  ArrowRight,
  BookOpenText,
  ChevronDown,
  Filter,
  Search,
} from 'lucide-react'

import { AsyncState } from '@/components/async-state'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  MAGOK_CODE_DIRECTORY_CATEGORY_OPTIONS,
  MAGOK_CODE_DIRECTORY_SECTION_OPTIONS,
  MAGOK_CODE_DIRECTORY_TOTAL_COUNT,
  filterMagokCodeDirectory,
  getZoneVerdictCounts,
  type CodeDirectoryFilterOptions,
} from '@/features/eligibility/data/magok-code-directory'
import { legalBasesFromIds } from '@/features/eligibility/data/legal-bases'
import type {
  DirectoryZoneType,
  MagokCodeDirectoryEntry,
  Verdict,
} from '@/features/eligibility/types'
import { formatNumber, formatVerdictLabel } from '@/utils/format'

const PAGE_SIZE = 24

const zoneTypeLabels: Record<DirectoryZoneType, string> = {
  industrialFacility: '산업시설구역',
  knowledgeIndustryCenter: '지식산업센터',
}

const verdictFilters: Array<{ value: Verdict | 'all'; label: string }> = [
  { value: 'all', label: '전체' },
  { value: 'eligible', label: '가능' },
  { value: 'conditional', label: '조건부 가능' },
  { value: 'reviewRequired', label: '심의 필요' },
  { value: 'insufficient', label: '추가 확인' },
  { value: 'ineligible', label: '불가' },
]

function getVerdictBadgeVariant(verdict: Verdict) {
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

function getVerdictAccentClass(verdict: Verdict) {
  if (verdict === 'eligible') {
    return 'bg-[var(--dot-success)]'
  }

  if (verdict === 'conditional' || verdict === 'reviewRequired') {
    return 'bg-[var(--dot-warning)]'
  }

  if (verdict === 'ineligible') {
    return 'bg-[var(--dot-danger)]'
  }

  return 'bg-[var(--dot-neutral)]'
}

interface CodeDirectoryPageProps {
  defaultZoneType: DirectoryZoneType
  onBackHome: () => void
  onApplyCode: (entry: MagokCodeDirectoryEntry, zoneType: DirectoryZoneType) => void
}

export function CodeDirectoryPage({
  defaultZoneType,
  onBackHome,
  onApplyCode,
}: CodeDirectoryPageProps) {
  const [zoneType, setZoneType] = useState<DirectoryZoneType>(defaultZoneType)
  const [query, setQuery] = useState('')
  const [verdict, setVerdict] = useState<CodeDirectoryFilterOptions['verdict']>('all')
  const [sectionCode, setSectionCode] = useState('all')
  const [browseCategory, setBrowseCategory] = useState('all')
  const [page, setPage] = useState(1)

  useEffect(() => {
    setZoneType(defaultZoneType)
  }, [defaultZoneType])

  useEffect(() => {
    setPage(1)
  }, [browseCategory, query, sectionCode, verdict, zoneType])

  const verdictCounts = useMemo(() => getZoneVerdictCounts(zoneType), [zoneType])

  const filteredEntries = useMemo(
    () =>
      filterMagokCodeDirectory({
        query,
        zoneType,
        verdict,
        sectionCode,
        browseCategory,
      }),
    [browseCategory, query, sectionCode, verdict, zoneType],
  )

  const totalPages = Math.max(1, Math.ceil(filteredEntries.length / PAGE_SIZE))
  const clampedPage = Math.min(page, totalPages)
  const pagedEntries = filteredEntries.slice(
    (clampedPage - 1) * PAGE_SIZE,
    clampedPage * PAGE_SIZE,
  )

  return (
    <section
      id="directory"
      className="space-y-6 rounded-[36px] border border-[var(--border)] bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(244,248,255,0.96))] p-6 shadow-[0_24px_60px_rgba(28,33,43,0.08)] sm:p-8"
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <Badge variant="muted">전용 코드 사전</Badge>
          <h1 className="mt-4 font-display text-3xl font-semibold text-[var(--foreground)] sm:text-4xl">
            입주 가능한 업종코드를
            <br />
            전체로 찾아보는 화면입니다
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-[var(--foreground-muted)] sm:text-base">
            코드를 몰라도 업종명으로 검색할 수 있고, 알고 있다면 5자리 코드 그대로 넣어도
            됩니다. 찾은 코드는 바로 판정 흐름으로 넘길 수 있습니다.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" onClick={onBackHome}>
            검색 홈으로 돌아가기
          </Button>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.2fr)_320px]">
        <Card className="border-[var(--border-accent)] bg-white/96 shadow-[0_18px_40px_rgba(24,32,43,0.06)]">
          <CardContent className="space-y-5 p-5">
            <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_200px_220px]">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[var(--foreground-subtle)]" />
                <Input
                  value={query}
                  placeholder="예: 광고대행업 / 앱 개발 / 72121 / 63112"
                  className="h-12 pl-10"
                  onChange={(event) => setQuery(event.target.value)}
                />
              </div>
              <Select
                value={zoneType}
                onValueChange={(value) => setZoneType(value as DirectoryZoneType)}
              >
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="구역 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="knowledgeIndustryCenter">지식산업센터</SelectItem>
                  <SelectItem value="industrialFacility">산업시설구역</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={verdict}
                onValueChange={(value) => setVerdict(value as CodeDirectoryFilterOptions['verdict'])}
              >
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="결과 필터" />
                </SelectTrigger>
                <SelectContent>
                  {verdictFilters.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-3 lg:grid-cols-[220px_minmax(0,1fr)]">
              <Select value={sectionCode} onValueChange={setSectionCode}>
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="대분류 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">대분류 전체</SelectItem>
                  {MAGOK_CODE_DIRECTORY_SECTION_OPTIONS.map((item) => (
                    <SelectItem key={item.code} value={item.code}>
                      {item.code} · {item.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={browseCategory} onValueChange={setBrowseCategory}>
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="업무군 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">업무군 전체</SelectItem>
                  {MAGOK_CODE_DIRECTORY_CATEGORY_OPTIONS.map((item) => (
                    <SelectItem key={item} value={item}>
                      {item}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-wrap gap-2">
              {['광고대행업', '앱 개발', '호스팅', '엔지니어링', '콜센터', '생명공학'].map(
                (item) => (
                  <Button
                    key={item}
                    variant="secondary"
                    size="sm"
                    onClick={() => setQuery(item)}
                  >
                    {item}
                  </Button>
                ),
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="border-[var(--border-soft)] bg-[rgba(248,251,255,0.84)] shadow-none">
          <CardContent className="space-y-4 p-5">
            <div className="flex items-center gap-2 text-sm font-semibold text-[var(--foreground)]">
              <Filter className="size-4 text-[var(--accent)]" />
              지금 보고 있는 기준
            </div>
            <div className="grid gap-3">
              <div className="rounded-2xl border border-[var(--border)] bg-white px-4 py-3">
                <div className="text-xs text-[var(--foreground-subtle)]">전체 코드</div>
                <div className="mt-1 text-lg font-semibold text-[var(--foreground)]">
                  {formatNumber(MAGOK_CODE_DIRECTORY_TOTAL_COUNT)}개
                </div>
              </div>
              <div className="rounded-2xl border border-[var(--border)] bg-white px-4 py-3">
                <div className="text-xs text-[var(--foreground-subtle)]">현재 구역</div>
                <div className="mt-1 text-lg font-semibold text-[var(--foreground)]">
                  {zoneTypeLabels[zoneType]}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-2xl border border-[var(--border)] bg-white px-4 py-3">
                  <div className="text-xs text-[var(--foreground-subtle)]">가능</div>
                  <div className="mt-1 text-base font-semibold text-[var(--foreground)]">
                    {formatNumber(verdictCounts.eligible)}
                  </div>
                </div>
                <div className="rounded-2xl border border-[var(--border)] bg-white px-4 py-3">
                  <div className="text-xs text-[var(--foreground-subtle)]">조건부</div>
                  <div className="mt-1 text-base font-semibold text-[var(--foreground)]">
                    {formatNumber(verdictCounts.conditional)}
                  </div>
                </div>
                <div className="rounded-2xl border border-[var(--border)] bg-white px-4 py-3">
                  <div className="text-xs text-[var(--foreground-subtle)]">심의 필요</div>
                  <div className="mt-1 text-base font-semibold text-[var(--foreground)]">
                    {formatNumber(verdictCounts.reviewRequired)}
                  </div>
                </div>
                <div className="rounded-2xl border border-[var(--border)] bg-white px-4 py-3">
                  <div className="text-xs text-[var(--foreground-subtle)]">추가 확인</div>
                  <div className="mt-1 text-base font-semibold text-[var(--foreground)]">
                    {formatNumber(verdictCounts.insufficient)}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {filteredEntries.length === 0 ? (
        <AsyncState
          variant="empty"
          title="조건에 맞는 코드를 찾지 못했습니다."
          description="업종명 표현을 조금 더 짧게 바꾸거나, 결과 필터를 `전체`로 바꿔 다시 찾아보세요."
          className="min-h-56 rounded-[28px] border border-[var(--border)] bg-white"
        />
      ) : (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-3">
              <Badge variant="muted">검색 결과</Badge>
              <div className="rounded-full bg-[rgba(43,109,255,0.08)] px-3 py-1 text-sm font-semibold text-[var(--accent)]">
                {formatNumber(filteredEntries.length)}개 찾음
              </div>
              <p className="text-sm leading-6 text-[var(--foreground-muted)]">
                지금 조건에 맞는 코드만 먼저 추려 보여드립니다.
              </p>
            </div>
            <p className="text-xs leading-5 text-[var(--foreground-subtle)]">
              {formatNumber(clampedPage)} / {formatNumber(totalPages)} 페이지
            </p>
          </div>

          <div className="grid gap-3 xl:grid-cols-2">
            {pagedEntries.map((entry) => {
              const zoneVerdict = entry.zoneVerdicts[zoneType]
              const legalBases = legalBasesFromIds(zoneVerdict.legalBasisIds)

              return (
                <details
                  key={`${zoneType}-${entry.code}`}
                  className="group overflow-hidden rounded-[26px] border border-[var(--border-soft)] bg-white"
                >
                  <div className={`h-1.5 w-full ${getVerdictAccentClass(zoneVerdict.verdict)}`} />
                  <summary className="cursor-pointer list-none px-5 py-5">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge variant={getVerdictBadgeVariant(zoneVerdict.verdict)}>
                            {formatVerdictLabel(zoneVerdict.verdict)}
                          </Badge>
                          <Badge variant="muted">{entry.code}</Badge>
                          <Badge variant="muted">{entry.browseCategory}</Badge>
                        </div>
                        <h3 className="mt-4 font-display text-2xl font-semibold text-[var(--foreground)]">
                          {entry.name}
                        </h3>
                        <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--foreground-muted)]">
                          {zoneVerdict.reason}
                        </p>
                      </div>
                      <ChevronDown className="mt-1 size-5 shrink-0 text-[var(--foreground-subtle)] transition group-open:rotate-180" />
                    </div>
                  </summary>

                  <div className="border-t border-[var(--border)] px-5 py-5">
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="rounded-2xl border border-[var(--border-soft)] bg-[rgba(248,251,255,0.92)] px-4 py-3">
                        <div className="text-xs text-[var(--foreground-subtle)]">대분류</div>
                        <div className="mt-1 text-sm font-semibold text-[var(--foreground)]">
                          {entry.sectionCode} · {entry.sectionName}
                        </div>
                      </div>
                      <div className="rounded-2xl border border-[var(--border-soft)] bg-[rgba(248,251,255,0.92)] px-4 py-3">
                        <div className="text-xs text-[var(--foreground-subtle)]">중분류</div>
                        <div className="mt-1 text-sm font-semibold text-[var(--foreground)]">
                          {entry.divisionCode} · {entry.divisionName}
                        </div>
                      </div>
                      <div className="rounded-2xl border border-[var(--border-soft)] bg-[rgba(248,251,255,0.92)] px-4 py-3">
                        <div className="text-xs text-[var(--foreground-subtle)]">소분류</div>
                        <div className="mt-1 text-sm font-semibold text-[var(--foreground)]">
                          {entry.groupCode} · {entry.groupName}
                        </div>
                      </div>
                      <div className="rounded-2xl border border-[var(--border-soft)] bg-[rgba(248,251,255,0.92)] px-4 py-3">
                        <div className="text-xs text-[var(--foreground-subtle)]">세분류</div>
                        <div className="mt-1 text-sm font-semibold text-[var(--foreground)]">
                          {entry.categoryCode} · {entry.categoryName}
                        </div>
                      </div>
                    </div>

                    {zoneVerdict.notes.length > 0 ? (
                      <div className="mt-4 space-y-2">
                        {zoneVerdict.notes.map((note) => (
                          <div
                            key={`${entry.code}-${note}`}
                            className="rounded-2xl border border-[var(--border-soft)] bg-[rgba(255,255,255,0.84)] px-4 py-3 text-sm leading-6 text-[var(--foreground-muted)]"
                          >
                            {note}
                          </div>
                        ))}
                      </div>
                    ) : null}

                    {legalBases.length > 0 ? (
                      <div className="mt-4 space-y-2">
                        {legalBases.map((basis) => (
                          <div
                            key={`${entry.code}-${basis.id}`}
                            className="rounded-2xl border border-[var(--border-soft)] bg-[rgba(244,248,255,0.92)] px-4 py-3"
                          >
                            <div className="text-xs uppercase tracking-[0.12em] text-[var(--foreground-subtle)]">
                              {basis.source === 'magokPlan' ? '고시문' : '시행령'} ·{' '}
                              {basis.citation}
                            </div>
                            <div className="mt-2 text-sm leading-6 text-[var(--foreground-muted)]">
                              {basis.summary}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : null}

                    <div className="mt-5 flex flex-wrap gap-2">
                      <Button onClick={() => onApplyCode(entry, zoneType)}>
                        이 코드로 판정하기
                        <ArrowRight className="size-4" />
                      </Button>
                    </div>
                  </div>
                </details>
              )
            })}
          </div>

          {totalPages > 1 ? (
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-[24px] border border-[var(--border)] bg-white px-4 py-4">
              <p className="text-sm leading-6 text-[var(--foreground-muted)]">
                코드를 놓치지 않도록 페이지로 나눠 보여드립니다.
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  disabled={clampedPage <= 1}
                  onClick={() => setPage((current) => Math.max(1, current - 1))}
                >
                  이전
                </Button>
                <Badge variant="muted">
                  {formatNumber(clampedPage)} / {formatNumber(totalPages)}
                </Badge>
                <Button
                  variant="secondary"
                  size="sm"
                  disabled={clampedPage >= totalPages}
                  onClick={() =>
                    setPage((current) => Math.min(totalPages, current + 1))
                  }
                >
                  다음
                </Button>
              </div>
            </div>
          ) : null}
        </div>
      )}

      <div className="rounded-[28px] border border-[var(--border-soft)] bg-[rgba(248,251,255,0.84)] p-5">
        <div className="flex items-center gap-2 text-sm font-semibold text-[var(--foreground)]">
          <BookOpenText className="size-4 text-[var(--accent)]" />
          보는 법
        </div>
        <div className="mt-3 grid gap-3 md:grid-cols-3">
          <div className="rounded-2xl border border-[var(--border-soft)] bg-white/88 px-4 py-3 text-sm leading-6 text-[var(--foreground-muted)]">
            `가능`은 현재 구역 기준으로 코드만 보면 기본 검토 대상에 들어간다는 뜻입니다.
          </div>
          <div className="rounded-2xl border border-[var(--border-soft)] bg-white/88 px-4 py-3 text-sm leading-6 text-[var(--foreground-muted)]">
            `조건부 가능`과 `심의 필요`는 추가 서류, 단독 등록 제한, 위원회 판단이 붙는 경우입니다.
          </div>
          <div className="rounded-2xl border border-[var(--border-soft)] bg-white/88 px-4 py-3 text-sm leading-6 text-[var(--foreground-muted)]">
            `추가 확인`은 코드만으로는 부족한 경우라서 실제 사업 내용과 관리기관 확인이 더 필요합니다.
          </div>
        </div>
      </div>
    </section>
  )
}
