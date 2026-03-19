import { AlertTriangle, Layers3, Sparkles } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { KNOWLEDGE_CENTER_EXACT_RULE_COUNTS } from '@/features/eligibility/data/knowledge-center-exact-codes'
import {
  BLOCKING_SCENARIOS,
  KNOWLEDGE_CENTER_EXTRA_RULES,
  MAGOK_INDUSTRIAL_RULES,
  REVIEW_SCENARIOS,
} from '@/features/eligibility/data/rules'
import { formatRuleCount } from '@/utils/format'

export function RulebookTabs() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>필요하면 기준도 확인할 수 있습니다</CardTitle>
        <CardDescription>
          자동 판정에 쓰는 업종 규칙과 심의·제한 조건을 정리해 둔 참고 영역입니다.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="industrial">
          <TabsList>
            <TabsTrigger value="industrial">산업시설구역</TabsTrigger>
            <TabsTrigger value="knowledge">지식산업센터</TabsTrigger>
            <TabsTrigger value="review">심의·제한</TabsTrigger>
          </TabsList>

          <TabsContent value="industrial">
            <ScrollArea className="max-h-[28rem] rounded-[24px] border border-white/10 bg-black/15 p-1">
              <div className="space-y-3 p-4">
                <div className="flex items-center gap-3 text-sm text-[var(--foreground-muted)]">
                  <Layers3 className="size-4 text-[var(--accent-soft)]" />
                  <span>내장 규칙 {formatRuleCount(MAGOK_INDUSTRIAL_RULES.length)}</span>
                </div>
                {MAGOK_INDUSTRIAL_RULES.map((rule) => (
                  <article
                    key={rule.id}
                    className="rounded-2xl border border-white/8 bg-white/4 p-4"
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
                ))}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="knowledge">
            <ScrollArea className="max-h-[28rem] rounded-[24px] border border-white/10 bg-black/15 p-1">
              <div className="space-y-3 p-4">
                <div className="flex items-center gap-3 text-sm text-[var(--foreground-muted)]">
                  <Sparkles className="size-4 text-[var(--accent-soft)]" />
                  <span>
                    기본 허용업종 + 특례 {formatRuleCount(KNOWLEDGE_CENTER_EXTRA_RULES.length)}
                  </span>
                </div>
                <article className="rounded-2xl border border-emerald-300/10 bg-emerald-400/6 p-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="success">exact 5자리</Badge>
                    <h4 className="font-medium text-[var(--foreground)]">
                      사용자 정리 코드표 반영
                    </h4>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-[var(--foreground-muted)]">
                    자동 허용 {KNOWLEDGE_CENTER_EXACT_RULE_COUNTS.autoAllowed}개,
                    조건부 {KNOWLEDGE_CENTER_EXACT_RULE_COUNTS.conditional}개, 심의{' '}
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
                {KNOWLEDGE_CENTER_EXTRA_RULES.map((rule) => (
                  <article
                    key={rule.id}
                    className="rounded-2xl border border-white/8 bg-white/4 p-4"
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
                ))}
                <article className="rounded-2xl border border-dashed border-white/12 bg-black/20 p-4">
                  <h4 className="font-medium text-[var(--foreground)]">
                    수동 보조 분류
                  </h4>
                  <p className="mt-3 text-sm leading-6 text-[var(--foreground-muted)]">
                    지식산업, 정보통신산업, 기타 시행령 허용업종은 KSIC 코드만으로 자동 매칭이 어려운 경우 수동 선택으로 보조합니다.
                  </p>
                </article>
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="review">
            <ScrollArea className="max-h-[28rem] rounded-[24px] border border-white/10 bg-black/15 p-1">
              <div className="space-y-3 p-4">
                <div className="flex items-center gap-3 text-sm text-[var(--foreground-muted)]">
                  <AlertTriangle className="size-4 text-[var(--accent-soft)]" />
                  <span>심의 필요와 명시 제한 조건</span>
                </div>
                {REVIEW_SCENARIOS.map((scenario) => (
                  <article
                    key={scenario.id}
                    className="rounded-2xl border border-amber-300/10 bg-amber-400/6 p-4"
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
                {BLOCKING_SCENARIOS.map((scenario) => (
                  <article
                    key={scenario.id}
                    className="rounded-2xl border border-rose-300/10 bg-rose-400/6 p-4"
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
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
