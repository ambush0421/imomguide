import { useState } from 'react'
import {
  AlertTriangle,
  ArrowRight,
  BookOpenText,
  Landmark,
  Search,
} from 'lucide-react'

import { AsyncState } from '@/components/async-state'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { KNOWLEDGE_INDUSTRY_REVIEW_ROWS } from '@/features/eligibility/data/knowledge-industry-review-table'
import {
  BLOCKING_SCENARIOS,
  KNOWLEDGE_CENTER_EXTRA_RULES,
  MAGOK_INDUSTRIAL_RULES,
  REVIEW_SCENARIOS,
} from '@/features/eligibility/data/rules'
import { formatRuleCount } from '@/utils/format'

type TabKey = 'industrial' | 'knowledge' | 'review'

interface RulebookTabsProps {
  onOpenDirectory?: () => void
}

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
  onChange,
}: {
  value: string
  placeholder: string
  onChange: (value: string) => void
}) {
  return (
    <div className="relative">
      <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[var(--foreground-subtle)]" />
      <Input
        value={value}
        placeholder={placeholder}
        className="h-11 pl-10"
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  )
}

function Summary({
  title,
  description,
  countLabel,
}: {
  title: string
  description: string
  countLabel: string
}) {
  return (
    <div className="rounded-[24px] border border-[var(--border)] bg-[rgba(241,247,255,0.92)] p-4">
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="muted">{countLabel}</Badge>
        <div className="text-sm font-semibold text-[var(--foreground)]">{title}</div>
      </div>
      <p className="mt-3 text-sm leading-6 text-[var(--foreground-muted)]">{description}</p>
    </div>
  )
}

export function RulebookTabs({ onOpenDirectory }: RulebookTabsProps) {
  const [activeTab, setActiveTab] = useState<TabKey>('industrial')
  const [queries, setQueries] = useState<Record<TabKey, string>>({
    industrial: '',
    knowledge: '',
    review: '',
  })

  function setQuery(tab: TabKey, value: string) {
    setQueries((current) => ({
      ...current,
      [tab]: value,
    }))
  }

  const industrialRules = MAGOK_INDUSTRIAL_RULES.filter((rule) =>
    matchesText(
      [rule.label, rule.group, rule.summary, rule.prefixes.join(', ')],
      queries.industrial,
    ),
  )

  const knowledgeRows = KNOWLEDGE_INDUSTRY_REVIEW_ROWS.filter((row) =>
    matchesText(
      [row.clause, row.label, row.ksic, row.verdict, row.note, ...(row.searchTerms ?? [])],
      queries.knowledge,
    ),
  )

  const knowledgeExtraRules = KNOWLEDGE_CENTER_EXTRA_RULES.filter((rule) =>
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

  return (
    <Card className="bg-white/96">
      <CardHeader>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <Badge variant="muted">법령 참고</Badge>
            <CardTitle className="mt-4 text-2xl">업종별 허용 코드 목록</CardTitle>
            <p className="mt-2 max-w-3xl text-sm leading-7 text-[var(--foreground-muted)]">
              아래는 업종별 허용 코드 목록입니다. 전체 코드를 넓게 보려면 전용 코드
              사전을 이용하는 편이 더 쉽습니다.
            </p>
          </div>
          {onOpenDirectory ? (
            <Button variant="secondary" onClick={onOpenDirectory}>
              전수 코드 사전 열기
              <ArrowRight className="size-4" />
            </Button>
          ) : null}
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        <Tabs
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as TabKey)}
          defaultValue="industrial"
        >
          <TabsList>
            <TabsTrigger value="industrial">산업시설구역</TabsTrigger>
            <TabsTrigger value="knowledge">지식산업센터</TabsTrigger>
            <TabsTrigger value="review">심의·제한</TabsTrigger>
          </TabsList>

          <TabsContent value="industrial" className="space-y-4">
            <Toolbar
              value={queries.industrial}
              placeholder="예: 연구개발, 62, 광고대행업"
              onChange={(value) => setQuery('industrial', value)}
            />

            <Summary
              title="산업시설구역 허용 업종표"
              description="산업시설구역에서 먼저 확인해볼 수 있는 업종을 빠르게 찾아볼 수 있습니다."
              countLabel={`${formatRuleCount(MAGOK_INDUSTRIAL_RULES.length)} 규칙`}
            />

            {industrialRules.length === 0 ? (
              <AsyncState
                variant="empty"
                title="일치하는 산업시설구역 규칙을 찾지 못했습니다."
                description="업종명 일부나 prefix 숫자로 다시 찾아보세요."
                className="min-h-48"
              />
            ) : (
              <div className="grid gap-3 lg:grid-cols-2">
                {industrialRules.map((rule) => (
                  <article
                    key={rule.id}
                    className="rounded-[24px] border border-[var(--border)] bg-[rgba(249,251,255,0.96)] p-5"
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge>{rule.group}</Badge>
                      <h3 className="text-lg font-semibold text-[var(--foreground)]">
                        {rule.label}
                      </h3>
                    </div>
                    <p className="mt-3 text-sm leading-6 text-[var(--foreground-muted)]">
                      {rule.summary}
                    </p>
                    <p className="mt-4 text-xs leading-5 text-[var(--foreground-subtle)]">
                      prefix: {rule.prefixes.join(', ')}
                    </p>
                  </article>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="knowledge" className="space-y-4">
            <Toolbar
              value={queries.knowledge}
              placeholder="예: 72121, 교육서비스업, 호스팅"
              onChange={(value) => setQuery('knowledge', value)}
            />

            <div className="grid gap-3 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
              <Summary
                title="시행령 제6조제2항 1~27호 대응표"
                description="지식산업센터에서 바로 가능한지, 더 확인이 필요한지 다시 볼 수 있습니다."
                countLabel={`${formatRuleCount(KNOWLEDGE_INDUSTRY_REVIEW_ROWS.length)} 조문`}
              />
              <Summary
                title="지식산업센터 특례와 예외"
                description="자주 헷갈리는 업종은 따로 모아서 쉽게 확인할 수 있습니다."
                countLabel={`${formatRuleCount(KNOWLEDGE_CENTER_EXTRA_RULES.length)} 특례`}
              />
            </div>

            {knowledgeRows.length === 0 && knowledgeExtraRules.length === 0 ? (
              <AsyncState
                variant="empty"
                title="일치하는 지식산업센터 기준을 찾지 못했습니다."
                description="코드, 업종명, 조문 번호로 다시 검색해 보세요."
                className="min-h-48"
              />
            ) : (
              <div className="space-y-4">
                {knowledgeRows.length > 0 ? (
                  <div className="space-y-3">
                    {knowledgeRows.map((row) => (
                      <article
                        key={row.clause}
                        className="rounded-[24px] border border-[var(--border)] bg-[rgba(249,251,255,0.96)] p-5"
                      >
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge variant="muted">{row.clause}</Badge>
                          <Badge variant={getVerdictBadgeVariant(row.verdict)}>{row.verdict}</Badge>
                          <h3 className="text-lg font-semibold text-[var(--foreground)]">
                            {row.label}
                          </h3>
                        </div>
                        <p className="mt-3 text-sm leading-6 text-[var(--foreground-muted)]">
                          {row.note}
                        </p>
                        <p className="mt-3 text-xs leading-5 text-[var(--foreground-subtle)]">
                          현재 KSIC 대응: {row.ksic}
                        </p>
                      </article>
                    ))}
                  </div>
                ) : null}

                {knowledgeExtraRules.length > 0 ? (
                  <div className="grid gap-3 lg:grid-cols-3">
                    {knowledgeExtraRules.map((rule) => (
                      <article
                        key={rule.id}
                        className="rounded-[24px] border border-[var(--border)] bg-white p-5"
                      >
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge>{rule.group}</Badge>
                          <h3 className="text-base font-semibold text-[var(--foreground)]">
                            {rule.label}
                          </h3>
                        </div>
                        <p className="mt-3 text-sm leading-6 text-[var(--foreground-muted)]">
                          {rule.summary}
                        </p>
                        <p className="mt-4 text-xs leading-5 text-[var(--foreground-subtle)]">
                          prefix: {rule.prefixes.join(', ')}
                        </p>
                      </article>
                    ))}
                  </div>
                ) : null}
              </div>
            )}
          </TabsContent>

          <TabsContent value="review" className="space-y-4">
            <Toolbar
              value={queries.review}
              placeholder="예: 심의, 포장 및 충전업, 부동산임대"
              onChange={(value) => setQuery('review', value)}
            />

            <div className="grid gap-3 lg:grid-cols-2">
              <Summary
                title="심의 필요 시나리오"
                description="자동 허용으로 보기 어려운 경계 업종과 기관형 업종은 위원회 심의나 추가 확인이 필요합니다."
                countLabel={`${formatRuleCount(REVIEW_SCENARIOS.length)} 시나리오`}
              />
              <Summary
                title="명시적 제한 시나리오"
                description="포장 및 충전업, 여객 운송업 계열처럼 고시문이나 시행령 단서에서 제외된 경우를 모았습니다."
                countLabel={`${formatRuleCount(BLOCKING_SCENARIOS.length)} 제한`}
              />
            </div>

            {reviewRules.length === 0 && blockingRules.length === 0 ? (
              <AsyncState
                variant="empty"
                title="심의·제한 규칙 검색 결과가 없습니다."
                description="업종명이나 키워드를 조금 더 짧게 바꿔 다시 검색해 보세요."
                className="min-h-48"
              />
            ) : (
              <div className="grid gap-4 lg:grid-cols-2">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm font-semibold text-[var(--foreground)]">
                    <Landmark className="size-4 text-[var(--accent)]" />
                    심의 필요
                  </div>
                  {reviewRules.map((scenario) => (
                    <article
                      key={scenario.id}
                      className="rounded-[24px] border border-[var(--border)] bg-white p-5"
                    >
                      <h3 className="text-base font-semibold text-[var(--foreground)]">
                        {scenario.label}
                      </h3>
                      <p className="mt-3 text-sm leading-6 text-[var(--foreground-muted)]">
                        {scenario.summary}
                      </p>
                    </article>
                  ))}
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm font-semibold text-[var(--foreground)]">
                    <AlertTriangle className="size-4 text-[var(--danger-icon)]" />
                    불가 또는 제한
                  </div>
                  {blockingRules.map((scenario) => (
                    <article
                      key={scenario.id}
                      className="rounded-[24px] border border-[var(--danger-border)] bg-[var(--danger-bg)] p-5"
                    >
                      <h3 className="text-base font-semibold text-[var(--foreground)]">
                        {scenario.label}
                      </h3>
                      <p className="mt-3 text-sm leading-6 text-[var(--foreground-muted)]">
                        {scenario.summary}
                      </p>
                    </article>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>

        <div className="rounded-[24px] border border-[var(--border)] bg-[rgba(241,247,255,0.92)] p-5">
          <div className="flex items-center gap-2 text-sm font-semibold text-[var(--foreground)]">
            <BookOpenText className="size-4 text-[var(--accent)]" />
            쉽게 보는 기준
          </div>
          <div className="mt-3 grid gap-3 md:grid-cols-3">
            <div className="rounded-2xl border border-[var(--border)] bg-white px-4 py-3 text-sm leading-6 text-[var(--foreground-muted)]">
              `산업시설구역`은 마곡 고시문에 적힌 허용 prefix 중심으로 먼저 봅니다.
            </div>
            <div className="rounded-2xl border border-[var(--border)] bg-white px-4 py-3 text-sm leading-6 text-[var(--foreground-muted)]">
              `지식산업센터`는 기본 허용 업종 + 시행령 연결 업종 + 마곡 예외를 함께 봅니다.
            </div>
            <div className="rounded-2xl border border-[var(--border)] bg-white px-4 py-3 text-sm leading-6 text-[var(--foreground-muted)]">
              모든 코드를 전체로 찾고 싶다면 위 버튼으로 코드 사전을 여는 편이 가장 쉽습니다.
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
