import { useState } from 'react'
import {
  AlertTriangle,
  Layers3,
  Search,
  Sparkles,
  X,
} from 'lucide-react'

import { AsyncState } from '@/components/async-state'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { KNOWLEDGE_CENTER_EXACT_RULE_COUNTS } from '@/features/eligibility/data/knowledge-center-exact-codes'
import { KNOWLEDGE_INDUSTRY_REVIEW_ROWS } from '@/features/eligibility/data/knowledge-industry-review-table'
import {
  BLOCKING_SCENARIOS,
  KNOWLEDGE_CENTER_EXTRA_RULES,
  MAGOK_INDUSTRIAL_RULES,
  REVIEW_SCENARIOS,
} from '@/features/eligibility/data/rules'
import { formatRuleCount } from '@/utils/format'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

type TabKey = 'industrial' | 'knowledge' | 'review'

function normalizeQuery(value: string) {
  return value.trim().toLowerCase()
}

function matchesText(targets: string[], query: string) {
  const normalizedQuery = normalizeQuery(query)

  if (!normalizedQuery) {
    return true
  }

  return targets.some((target) => target.toLowerCase().includes(normalizedQuery))
}

function getVerdictBadgeVariant(verdict: string) {
  if (verdict === '가능') {
    return 'success' as const
  }

  if (verdict === '조건부') {
    return 'warning' as const
  }

  if (verdict === '불가') {
    return 'danger' as const
  }

  return 'muted' as const
}

function Toolbar({
  value,
  placeholder,
  summary,
  onChange,
  onClear,
}: {
  value: string
  placeholder: string
  summary: string
  onChange: (value: string) => void
  onClear: () => void
}) {
  return (
    <div className="flex flex-col gap-3 rounded-[20px] border border-[var(--border)] bg-white p-3 sm:flex-row sm:items-center sm:justify-between sm:p-4">
      <div className="text-sm leading-6 text-[var(--foreground-muted)]">{summary}</div>
      <div className="flex w-full items-center gap-2 sm:max-w-sm">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[var(--foreground-subtle)]" />
          <Input
            value={value}
            placeholder={placeholder}
            className="h-11 pl-10 pr-10"
            onChange={(event) => onChange(event.target.value)}
          />
          {value ? (
            <button
              type="button"
              className="absolute right-3 top-1/2 inline-flex size-5 -translate-y-1/2 items-center justify-center rounded-full text-[var(--foreground-subtle)] transition hover:bg-[rgba(43,109,255,0.08)] hover:text-[var(--foreground)]"
              onClick={onClear}
              aria-label="검색어 지우기"
            >
              <X className="size-3.5" />
            </button>
          ) : null}
        </div>
      </div>
    </div>
  )
}

function SummaryCards({
  items,
}: {
  items: Array<{ label: string; value: string }>
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {items.map((item) => (
        <div
          key={item.label}
          className="rounded-[18px] border border-[var(--border)] bg-white px-4 py-3"
        >
          <div className="text-xs text-[var(--foreground-subtle)]">{item.label}</div>
          <div className="mt-1 text-sm font-semibold text-[var(--foreground)]">
            {item.value}
          </div>
        </div>
      ))}
    </div>
  )
}

export function RulebookTabs() {
  const [activeTab, setActiveTab] = useState<TabKey>('industrial')
  const [queries, setQueries] = useState<Record<TabKey, string>>({
    industrial: '',
    knowledge: '',
    review: '',
  })

  const industrialRules = MAGOK_INDUSTRIAL_RULES.filter((rule) =>
    matchesText(
      [rule.label, rule.group, rule.summary, rule.prefixes.join(', ')],
      queries.industrial,
    ),
  )

  const knowledgeRules = KNOWLEDGE_CENTER_EXTRA_RULES.filter((rule) =>
    matchesText(
      [rule.label, rule.group, rule.summary, rule.prefixes.join(', ')],
      queries.knowledge,
    ),
  )

  const reviewRules = REVIEW_SCENARIOS.filter((scenario) =>
    matchesText([scenario.label, scenario.summary], queries.review),
  )

  const blockingRules = BLOCKING_SCENARIOS.filter((scenario) =>
    matchesText([scenario.label, scenario.summary], queries.review),
  )

  const knowledgeReviewRows = KNOWLEDGE_INDUSTRY_REVIEW_ROWS.filter((row) =>
    matchesText(
      [row.clause, row.label, row.ksic, row.verdict, row.note],
      queries.knowledge,
    ),
  )

  function setQuery(tab: TabKey, value: string) {
    setQueries((current) => ({
      ...current,
      [tab]: value,
    }))
  }

  const currentQuery = queries[activeTab]

  return (
    <Card>
      <CardHeader>
        <CardTitle>필요하면 기준도 확인할 수 있습니다</CardTitle>
        <CardDescription>
          자동 판정에 쓰는 업종 규칙과 심의·제한 조건을 검색하면서 확인할 수 있는
          참고 영역입니다.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <Tabs
          defaultValue="industrial"
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as TabKey)}
        >
          <TabsList>
            <TabsTrigger value="industrial">산업시설구역</TabsTrigger>
            <TabsTrigger value="knowledge">지식산업센터</TabsTrigger>
            <TabsTrigger value="review">심의·제한</TabsTrigger>
          </TabsList>

          <TabsContent value="industrial" className="space-y-4">
            <Toolbar
              value={queries.industrial}
              placeholder="업종명, 그룹, prefix로 찾기"
              summary={`내장 규칙 ${formatRuleCount(MAGOK_INDUSTRIAL_RULES.length)} 중 ${formatRuleCount(industrialRules.length)} 표시`}
              onChange={(value) => setQuery('industrial', value)}
              onClear={() => setQuery('industrial', '')}
            />
            <SummaryCards
              items={[
                { label: '전체 규칙', value: formatRuleCount(MAGOK_INDUSTRIAL_RULES.length) },
                { label: '현재 표시', value: formatRuleCount(industrialRules.length) },
                { label: '검색어', value: currentQuery || '없음' },
              ]}
            />
            <div className="space-y-3 rounded-[24px] border border-[var(--border)] bg-[rgba(239,245,255,0.86)] p-3 sm:p-4">
              <div className="flex items-center gap-3 text-sm text-[var(--foreground-muted)]">
                <Layers3 className="size-4 text-[var(--accent)]" />
                <span>산업시설구역 허용 업종 목록</span>
              </div>
              {industrialRules.length === 0 ? (
                <AsyncState
                  variant="empty"
                  title="맞는 규칙을 찾지 못했습니다."
                  description="검색어를 조금 더 짧게 바꾸거나 prefix 숫자로 다시 찾아보세요."
                  className="min-h-44 bg-white"
                />
              ) : (
                industrialRules.map((rule) => (
                  <article
                    key={rule.id}
                    className="rounded-2xl border border-[var(--border)] bg-white p-4"
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge>{rule.group}</Badge>
                      <h4 className="font-medium text-[var(--foreground)]">{rule.label}</h4>
                    </div>
                    <p className="mt-3 text-sm leading-6 text-[var(--foreground-muted)]">
                      {rule.summary}
                    </p>
                    <p className="mt-3 text-xs leading-5 text-[var(--foreground-subtle)]">
                      prefix: {rule.prefixes.join(', ')}
                    </p>
                  </article>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="knowledge" className="space-y-4">
            <Toolbar
              value={queries.knowledge}
              placeholder="특례 업종명, 요약, prefix로 찾기"
              summary={`지식산업센터 특례 ${formatRuleCount(KNOWLEDGE_CENTER_EXTRA_RULES.length)} 중 ${formatRuleCount(knowledgeRules.length)} 표시`}
              onChange={(value) => setQuery('knowledge', value)}
              onClear={() => setQuery('knowledge', '')}
            />
            <SummaryCards
              items={[
                {
                  label: 'exact 5자리',
                  value: `${KNOWLEDGE_CENTER_EXACT_RULE_COUNTS.autoAllowed}개 자동 허용`,
                },
                {
                  label: '입주검토 표',
                  value: `${formatRuleCount(KNOWLEDGE_INDUSTRY_REVIEW_ROWS.length)}개 조문`,
                },
                {
                  label: '심의·추가확인',
                  value: `${KNOWLEDGE_CENTER_EXACT_RULE_COUNTS.reviewRequired + KNOWLEDGE_CENTER_EXACT_RULE_COUNTS.additionalCheck}개`,
                },
              ]}
            />
            <div className="space-y-3 rounded-[24px] border border-[var(--border)] bg-[rgba(239,245,255,0.86)] p-3 sm:p-4">
              <div className="flex items-center gap-3 text-sm text-[var(--foreground-muted)]">
                <Sparkles className="size-4 text-[var(--accent)]" />
                <span>지식산업센터 특례와 exact 5자리 규칙</span>
              </div>
              <article className="rounded-2xl border border-[rgba(43,109,255,0.16)] bg-[rgba(239,245,255,0.92)] p-4">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="success">exact 5자리</Badge>
                  <h4 className="font-medium text-[var(--foreground)]">
                    사용자 정리 코드표 반영
                  </h4>
                </div>
                <p className="mt-3 text-sm leading-6 text-[var(--foreground-muted)]">
                  자동 허용 {KNOWLEDGE_CENTER_EXACT_RULE_COUNTS.autoAllowed}개, 조건부{' '}
                  {KNOWLEDGE_CENTER_EXACT_RULE_COUNTS.conditional}개, 심의{' '}
                  {KNOWLEDGE_CENTER_EXACT_RULE_COUNTS.reviewRequired}개, 추가 확인{' '}
                  {KNOWLEDGE_CENTER_EXACT_RULE_COUNTS.additionalCheck}개, 불가{' '}
                  {KNOWLEDGE_CENTER_EXACT_RULE_COUNTS.blockedItems}개를 CSV 기준으로
                  그대로 반영했습니다.
                </p>
                <p className="mt-3 text-xs leading-5 text-[var(--foreground-subtle)]">
                  `63111 자료 처리업` 자동 허용, `63112 호스팅 및 관련 서비스업` 심의
                  필요 규칙을 우선 적용합니다.
                </p>
              </article>
              <article className="rounded-2xl border border-[var(--border)] bg-white p-4">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="muted">입주검토용 표</Badge>
                  <h4 className="font-medium text-[var(--foreground)]">
                    시행령 제6조제2항 1~27호 대응표
                  </h4>
                </div>
                <p className="mt-3 text-sm leading-6 text-[var(--foreground-muted)]">
                  조문 기준 업종, 현재 KSIC 대응, 마곡 지식산업센터 적용 결과를 한
                  표로 다시 정리했습니다. 검색창에 조문 번호, 업종명, 코드, 메모를
                  넣으면 함께 좁혀집니다.
                </p>
                {knowledgeReviewRows.length === 0 ? (
                  <AsyncState
                    variant="empty"
                    title="입주검토용 표에서 일치하는 항목을 찾지 못했습니다."
                    description="조문 번호, 업종명, KSIC 코드 일부로 다시 검색해 보세요."
                    className="mt-4 min-h-40 bg-[rgba(239,245,255,0.88)]"
                  />
                ) : (
                  <div className="mt-4 overflow-x-auto rounded-[20px] border border-[var(--border)]">
                    <table className="min-w-[880px] border-collapse text-left text-sm">
                      <thead className="bg-[rgba(239,245,255,0.88)] text-[var(--foreground-muted)]">
                        <tr>
                          <th className="px-4 py-3 font-medium">호</th>
                          <th className="px-4 py-3 font-medium">시행령 업종</th>
                          <th className="px-4 py-3 font-medium">현재 KSIC 대응</th>
                          <th className="px-4 py-3 font-medium">마곡 적용</th>
                          <th className="px-4 py-3 font-medium">확인 포인트</th>
                        </tr>
                      </thead>
                      <tbody>
                        {knowledgeReviewRows.map((row) => (
                          <tr
                            key={row.clause}
                            className="border-t border-[var(--border)] align-top"
                          >
                            <td className="px-4 py-3 text-[var(--foreground-muted)]">
                              {row.clause}
                            </td>
                            <td className="px-4 py-3 font-medium text-[var(--foreground)]">
                              {row.label}
                            </td>
                            <td className="px-4 py-3 text-[var(--foreground-muted)]">
                              {row.ksic}
                            </td>
                            <td className="px-4 py-3">
                              <Badge variant={getVerdictBadgeVariant(row.verdict)}>
                                {row.verdict}
                              </Badge>
                            </td>
                            <td className="px-4 py-3 leading-6 text-[var(--foreground-muted)]">
                              {row.note}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </article>
              {knowledgeRules.length === 0 ? (
                <AsyncState
                  variant="empty"
                  title="맞는 특례 규칙을 찾지 못했습니다."
                  description="업종명이나 prefix로 다시 찾아보면 더 빠르게 확인할 수 있습니다."
                  className="min-h-44 bg-white"
                />
              ) : (
                knowledgeRules.map((rule) => (
                  <article
                    key={rule.id}
                    className="rounded-2xl border border-[var(--border)] bg-white p-4"
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge>{rule.group}</Badge>
                      <h4 className="font-medium text-[var(--foreground)]">{rule.label}</h4>
                    </div>
                    <p className="mt-3 text-sm leading-6 text-[var(--foreground-muted)]">
                      {rule.summary}
                    </p>
                    <p className="mt-3 text-xs leading-5 text-[var(--foreground-subtle)]">
                      prefix: {rule.prefixes.join(', ')}
                    </p>
                  </article>
                ))
              )}
              <article className="rounded-2xl border border-dashed border-[var(--border)] bg-white/70 p-4">
                <h4 className="font-medium text-[var(--foreground)]">수동 보조 분류</h4>
                <p className="mt-3 text-sm leading-6 text-[var(--foreground-muted)]">
                  지식산업, 정보통신산업, 기타 시행령 허용업종은 KSIC 코드만으로 자동
                  매칭이 어려운 경우 수동 선택으로 보조합니다.
                </p>
              </article>
            </div>
          </TabsContent>

          <TabsContent value="review" className="space-y-4">
            <Toolbar
              value={queries.review}
              placeholder="심의 조건, 제한 업종으로 찾기"
              summary={`심의 ${formatRuleCount(REVIEW_SCENARIOS.length)}개 / 불가 ${formatRuleCount(BLOCKING_SCENARIOS.length)}개 중 검색 결과 표시`}
              onChange={(value) => setQuery('review', value)}
              onClear={() => setQuery('review', '')}
            />
            <SummaryCards
              items={[
                { label: '심의 필요', value: formatRuleCount(reviewRules.length) },
                { label: '명시 제한', value: formatRuleCount(blockingRules.length) },
                { label: '검색어', value: queries.review || '없음' },
              ]}
            />
            <div className="space-y-3 rounded-[24px] border border-[var(--border)] bg-[rgba(239,245,255,0.86)] p-3 sm:p-4">
              <div className="flex items-center gap-3 text-sm text-[var(--foreground-muted)]">
                <AlertTriangle className="size-4 text-[var(--accent)]" />
                <span>심의 필요와 명시 제한 조건</span>
              </div>
              {reviewRules.length === 0 && blockingRules.length === 0 ? (
                <AsyncState
                  variant="empty"
                  title="맞는 심의·제한 조건을 찾지 못했습니다."
                  description="업종명이나 키워드를 조금 더 짧게 바꿔 다시 검색해 보세요."
                  className="min-h-44 bg-white"
                />
              ) : null}
              {reviewRules.map((scenario) => (
                <article
                  key={scenario.id}
                  className="rounded-2xl border border-amber-200 bg-amber-50 p-4"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="warning">심의</Badge>
                    <h4 className="font-medium text-[var(--foreground)]">
                      {scenario.label}
                    </h4>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-[var(--foreground-muted)]">
                    {scenario.summary}
                  </p>
                </article>
              ))}
              {blockingRules.map((scenario) => (
                <article
                  key={scenario.id}
                  className="rounded-2xl border border-rose-200 bg-rose-50 p-4"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="danger">불가</Badge>
                    <h4 className="font-medium text-[var(--foreground)]">
                      {scenario.label}
                    </h4>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-[var(--foreground-muted)]">
                    {scenario.summary}
                  </p>
                </article>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
