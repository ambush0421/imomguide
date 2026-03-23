import { useState } from 'react'
import {
  Building2,
  ChevronLeft,
  ChevronDown,
  ChevronUp,
  Factory,
  FlaskConical,
  Plus,
  RefreshCcw,
  SearchCheck,
  Trash2,
} from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import type {
  EligibilityAdditionalCode,
  EligibilityFlags,
  EligibilityInput,
} from '@/features/eligibility/types'

const zoneTypeLabels: Record<EligibilityInput['zoneType'], string> = {
  industrialFacility: '산업시설구역',
  knowledgeIndustryCenter: '지식산업센터',
  supportFacility: '지원시설구역',
}

const applicantTypeLabels: Record<EligibilityInput['applicantType'], string> = {
  company: '일반 기업',
  universityLab: '대학·대학부설연구소',
  publicInstitution: '공공기관',
  publicRelatedOrg: '공직유관단체',
  ventureClusterTenant: '벤처기업집적시설 입주자',
  startupIncubator: '창업보육센터 운영 주체',
  softwarePromotionFacility: '소프트웨어진흥시설 운영 주체',
}

interface EligibilityFormProps {
  input: EligibilityInput
  additionalCodes: EligibilityAdditionalCode[]
  compareZones: boolean
  status: 'idle' | 'loading' | 'ready' | 'error'
  onFieldChange: <K extends keyof EligibilityInput>(
    field: K,
    value: EligibilityInput[K],
  ) => void
  onFlagChange: <K extends keyof EligibilityFlags>(
    field: K,
    value: EligibilityFlags[K],
  ) => void
  onCompareZonesChange: (value: boolean) => void
  onAddAdditionalCode: () => void
  onRemoveAdditionalCode: (id: string) => void
  onAdditionalCodeFieldChange: (
    id: string,
    field: keyof Omit<EligibilityAdditionalCode, 'id'>,
    value: string,
  ) => void
  onEvaluate: () => void
  onReset: () => void
  onPrevious?: () => void
  primaryActionLabel?: string
  secondaryActionLabel?: string
  defaultExpanded?: boolean
  embedded?: boolean
}

interface EligibilityFlagRecommendationContext {
  normalizedCode: string
  normalizedCombinedText: string
  zoneType: EligibilityInput['zoneType']
  compareZones: boolean
  regulatoryFit: EligibilityInput['regulatoryFit']
}

interface EligibilitySwitchRow {
  key: keyof EligibilityFlags
  label: string
  description: string
  recommendationHint: string
  matches: (context: EligibilityFlagRecommendationContext) => boolean
}

function normalizeEligibilitySearchText(value: string) {
  return value.toLowerCase().replace(/\s+/g, '')
}

function matchesEligibilityKeyword(text: string, keywords: string[]) {
  return keywords.some((keyword) => text.includes(normalizeEligibilitySearchText(keyword)))
}

function matchesExactCode(code: string, codes: string[]) {
  return codes.includes(code)
}

function isKnowledgeCenterContext(context: EligibilityFlagRecommendationContext) {
  return context.compareZones || context.zoneType === 'knowledgeIndustryCenter'
}

function isIndustrialContext(context: EligibilityFlagRecommendationContext) {
  return context.compareZones || context.zoneType === 'industrialFacility'
}

function isManufacturingCode(code: string) {
  const prefix = Number.parseInt(code.slice(0, 2), 10)

  if (Number.isNaN(prefix)) {
    return false
  }

  return prefix >= 10 && prefix <= 34
}

function createEligibilityFlagContext(
  input: EligibilityInput,
  compareZones: boolean,
): EligibilityFlagRecommendationContext {
  return {
    normalizedCode: input.ksicCode.replace(/\D/g, ''),
    normalizedCombinedText: normalizeEligibilitySearchText(
      [input.ksicName, input.notes].filter(Boolean).join(' '),
    ),
    zoneType: input.zoneType,
    compareZones,
    regulatoryFit: input.regulatoryFit,
  }
}

const switchRows: EligibilitySwitchRow[] = [
  {
    key: 'isPackagingAndFilling',
    label: '포장 및 충전업',
    description: '지식산업센터에서는 명시적 제한 업종입니다.',
    recommendationHint: '업종명에 포장·충전 표현이 있을 때 먼저 확인합니다.',
    matches: (context) =>
      isKnowledgeCenterContext(context) &&
      matchesEligibilityKeyword(context.normalizedCombinedText, [
        '포장',
        '충전',
        'packaging',
        'filling',
      ]),
  },
  {
    key: 'isResourceStockpile',
    label: '자원비축시설',
    description: '지식산업센터 예외 허용 범위에서 제외됩니다.',
    recommendationHint: '자원 비축·저장 성격이 보이면 먼저 확인합니다.',
    matches: (context) =>
      isKnowledgeCenterContext(context) &&
      matchesEligibilityKeyword(context.normalizedCombinedText, [
        '자원비축',
        '비축',
        'stockpile',
      ]),
  },
  {
    key: 'isHosting63112',
    label: '호스팅 및 관련 서비스업(63112)',
    description: '정확 5자리 코드 기준으로 지식산업센터에서는 위원회 심의가 필요합니다.',
    recommendationHint: '63112 코드나 호스팅 표현이 보이면 먼저 확인합니다.',
    matches: (context) =>
      isKnowledgeCenterContext(context) &&
      (matchesExactCode(context.normalizedCode, ['63112']) ||
        matchesEligibilityKeyword(context.normalizedCombinedText, [
          '호스팅',
          'hosting',
          '서버호스팅',
          '클라우드서버',
        ])),
  },
  {
    key: 'isRealEstateOnly',
    label: '부동산임대·공급업만 단독 등록',
    description: '지식산업센터 단독 등록은 제한됩니다.',
    recommendationHint: '부동산 임대·공급 코드가 보이면 단독 등록 여부를 확인합니다.',
    matches: (context) =>
      isKnowledgeCenterContext(context) &&
      (matchesExactCode(context.normalizedCode, ['68112', '68122']) ||
        matchesEligibilityKeyword(context.normalizedCombinedText, [
          '부동산임대',
          '부동산공급',
          '임대업',
          '공급업',
        ])),
  },
  {
    key: 'isTrustOnly',
    label: '신탁업만 단독 등록',
    description: '다른 허용 업종 없이 단독 등록이면 불가입니다.',
    recommendationHint: '신탁업 관련 코드나 표현이 있으면 단독 등록 여부를 확인합니다.',
    matches: (context) =>
      isKnowledgeCenterContext(context) &&
      (matchesExactCode(context.normalizedCode, ['64201']) ||
        matchesEligibilityKeyword(context.normalizedCombinedText, ['신탁'])),
  },
  {
    key: 'hasManufacturingFacility',
    label: '제조시설 또는 사업화시설 운영 예정',
    description: '산업시설구역에서는 제조시설 비율 등 추가 조건이 붙습니다.',
    recommendationHint: '제조·생산·파일럿 운영 계획이 있으면 먼저 확인합니다.',
    matches: (context) =>
      isIndustrialContext(context) &&
      (isManufacturingCode(context.normalizedCode) ||
        matchesEligibilityKeyword(context.normalizedCombinedText, [
          '제조',
          '생산',
          '가공',
          '공장',
          '파일럿',
          'pilot',
          '양산',
          '사업화',
        ])),
  },
  {
    key: 'requiresCommitteeReview',
    label: '융·복합 또는 경계 업종으로 위원회 검토 필요',
    description: '기본 업종표와 애매하면 심의 필요 결과로 보수적으로 판정합니다.',
    recommendationHint: '융합형 사업이거나 수동 법령 분류를 골랐을 때 먼저 확인합니다.',
    matches: (context) =>
      context.regulatoryFit !== 'auto' ||
      matchesEligibilityKeyword(context.normalizedCombinedText, [
        '융복합',
        '융합',
        '복합',
        '경계업종',
        '위원회',
        '심의',
        '예외검토',
      ]),
  },
]

function getRecommendedSwitchRows(
  input: EligibilityInput,
  compareZones: boolean,
): EligibilitySwitchRow[] {
  const context = createEligibilityFlagContext(input, compareZones)

  return switchRows.filter((row) => input.flags[row.key] || row.matches(context))
}

export function EligibilityForm({
  input,
  additionalCodes,
  compareZones,
  status,
  onFieldChange,
  onFlagChange,
  onCompareZonesChange,
  onAddAdditionalCode,
  onRemoveAdditionalCode,
  onAdditionalCodeFieldChange,
  onEvaluate,
  onReset,
  onPrevious,
  primaryActionLabel = '현재 설정으로 다시 판정',
  secondaryActionLabel,
  defaultExpanded = false,
  embedded = false,
}: EligibilityFormProps) {
  const isLoading = status === 'loading'
  const [isExpanded, setIsExpanded] = useState(defaultExpanded)
  const [showAllFlags, setShowAllFlags] = useState(false)
  const enabledFlagCount = switchRows.filter((row) => input.flags[row.key]).length
  const filledAdditionalCodeCount = additionalCodes.filter(
    (item) => item.ksicCode.trim() || item.ksicName.trim(),
  ).length
  const selectedCodeSummary =
    filledAdditionalCodeCount > 0
      ? `${input.ksicCode.trim() || '직접 입력 예정'} 외 ${filledAdditionalCodeCount}개`
      : input.ksicCode.trim() || '직접 입력 예정'
  const canAddAdditionalCode = additionalCodes.length < 2
  const recommendedSwitchRows = getRecommendedSwitchRows(input, compareZones)
  const visibleSwitchRows = showAllFlags ? switchRows : recommendedSwitchRows
  const hiddenSwitchRowCount = Math.max(switchRows.length - recommendedSwitchRows.length, 0)

  return (
    <Card
      className={
        embedded
          ? 'overflow-visible rounded-none border-0 bg-transparent shadow-none before:hidden after:hidden'
          : 'overflow-hidden'
      }
    >
      <CardHeader className={embedded ? 'hidden' : 'relative'}>
        <CardTitle>세부 조건 직접 수정</CardTitle>
        <CardDescription>
          대부분은 위에서 업종을 고른 뒤 결과만 보면 됩니다. 구역이나 예외 조건을
          직접 바꾸고 싶을 때만 이 섹션을 열어 주세요.
        </CardDescription>
      </CardHeader>
      <CardContent className={embedded ? 'space-y-5 p-0 sm:space-y-7' : 'space-y-7'}>
        <section className="rounded-[20px] border border-[var(--border-accent-strong)] bg-[var(--surface-strong)] p-4 shadow-none sm:rounded-[24px] sm:p-6 sm:shadow-[var(--shadow-sm)]">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 inline-flex size-9 items-center justify-center rounded-2xl bg-[var(--accent-soft)] text-[var(--accent-strong)] shadow-[var(--shadow-sm)] sm:size-10">
                <SearchCheck className="size-4" />
              </div>
              <div>
                <h3 className="font-display text-lg font-semibold text-[var(--foreground)] sm:text-xl">
                  현재 판정 설정
                </h3>
                <p className="mt-2 max-w-[34rem] text-[13px] leading-6 text-[var(--foreground-muted)] sm:text-[15px] sm:leading-7">
                  필요한 항목만 아래에서 바꾸고 다시 판정하면 됩니다.
                </p>
              </div>
            </div>
            <Button
              variant="secondary"
              size="sm"
              className="w-full whitespace-nowrap sm:w-auto"
              onClick={() => setIsExpanded((value) => !value)}
            >
              {isExpanded ? (
                <>
                  <ChevronUp className="size-4" />
                  세부 보정 닫기
                </>
              ) : (
                <>
                  <ChevronDown className="size-4" />
                  세부 보정 열기
                </>
              )}
            </Button>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-2.5 sm:grid-cols-2 sm:gap-3 xl:grid-cols-4">
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-strong)] px-4 py-4 shadow-[var(--shadow-sm)]">
              <div className="text-xs text-[var(--foreground-subtle)]">구역</div>
              <div className="mt-1 text-sm font-medium leading-6 text-[var(--foreground)]">
                {compareZones
                  ? '지식산업센터 + 산업시설구역 비교'
                  : zoneTypeLabels[input.zoneType]}
              </div>
            </div>
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-strong)] px-4 py-4 shadow-[var(--shadow-sm)]">
              <div className="text-xs text-[var(--foreground-subtle)]">회사/기관 유형</div>
              <div className="mt-1 text-sm font-medium leading-6 text-[var(--foreground)]">
                {applicantTypeLabels[input.applicantType]}
              </div>
            </div>
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-strong)] px-4 py-4 shadow-[var(--shadow-sm)]">
              <div className="text-xs text-[var(--foreground-subtle)]">선택한 업종코드</div>
              <div className="mt-1 text-sm font-medium leading-6 text-[var(--foreground)]">
                {selectedCodeSummary}
              </div>
            </div>
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-strong)] px-4 py-4 shadow-[var(--shadow-sm)]">
              <div className="text-xs text-[var(--foreground-subtle)]">예외조건</div>
              <div className="mt-1 text-sm font-medium leading-6 text-[var(--foreground)]">
                {enabledFlagCount > 0 ? `${enabledFlagCount}개 적용 중` : '없음'}
              </div>
            </div>
          </div>

          <div className="mt-4 rounded-2xl border border-[var(--border)] bg-[var(--surface-strong)] px-4 py-4 shadow-[var(--shadow-sm)]">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="text-sm font-semibold text-[var(--foreground)]">
                  두 구역 동시 비교
                </div>
                <p className="text-sm leading-6 text-[var(--foreground-muted)]">
                  지식산업센터와 산업시설구역 결과를 한 화면에서 같이 비교합니다.
                </p>
              </div>
              <Switch
                checked={compareZones}
                onCheckedChange={onCompareZonesChange}
                aria-label="두 구역 동시 비교"
              />
            </div>
            <p className="mt-3 text-xs leading-5 text-[var(--foreground-subtle)]">
              {compareZones
                ? '비교 모드가 켜져 있어 두 구역 결과를 동시에 계산합니다.'
                : '끄면 현재 선택한 한 구역 기준으로만 예비판정을 봅니다.'}
            </p>
          </div>

          <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:gap-3">
            <Button
              className="w-full justify-center whitespace-nowrap sm:flex-1"
              loading={isLoading}
              onClick={onEvaluate}
            >
              {!isLoading ? <SearchCheck className="size-4" /> : null}
              {isLoading ? '판정 계산 중...' : primaryActionLabel}
            </Button>
            {onPrevious ? (
              <Button
                className="w-full justify-center whitespace-nowrap sm:flex-1"
                variant="secondary"
                disabled={isLoading}
                onClick={onPrevious}
              >
                <ChevronLeft className="size-4" />
                {secondaryActionLabel ?? '이전 단계'}
              </Button>
            ) : (
              <Button
                className="w-full justify-center whitespace-nowrap sm:flex-1"
                variant="secondary"
                disabled={isLoading}
                onClick={onReset}
              >
                <RefreshCcw className="size-4" />
                {secondaryActionLabel ?? '입력 초기화'}
              </Button>
            )}
          </div>
        </section>

        {isExpanded ? (
          <>
            <section className="rounded-[24px] border border-[var(--border)] bg-[var(--surface-strong)] p-5 shadow-[var(--shadow-sm)] sm:p-6">
              <div className="mb-4 flex items-start gap-3">
                <div className="mt-0.5 inline-flex size-9 items-center justify-center rounded-2xl bg-[var(--accent-soft)] text-[var(--accent-strong)] shadow-[var(--shadow-sm)]">
                  <Building2 className="size-4" />
                </div>
                <div>
                  <h3 className="font-display text-lg font-semibold text-[var(--foreground)]">
                    입지와 업종 정보
                  </h3>
                  <p className="mt-1 text-sm leading-6 text-[var(--foreground-muted)]">
                    자동 추천 결과를 직접 고치고 싶을 때만 수정해 주세요.
                  </p>
                </div>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                {compareZones ? (
                  <div className="space-y-2 md:col-span-2">
                    <Label>비교 대상 구역</Label>
                    <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] px-4 py-4 text-sm leading-6 text-[var(--foreground-muted)] shadow-[var(--shadow-sm)]">
                      지식산업센터와 산업시설구역을 같은 업종코드, 같은 예외 조건으로
                      나란히 계산합니다. 두 구역 중 어디가 더 유리한지 결과 화면에서 바로
                      비교할 수 있습니다.
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Label>구역 또는 건물 유형</Label>
                    <Select
                      value={input.zoneType}
                      onValueChange={(value) =>
                        onFieldChange('zoneType', value as EligibilityInput['zoneType'])
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="구역 선택" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="industrialFacility">산업시설구역</SelectItem>
                        <SelectItem value="knowledgeIndustryCenter">
                          지식산업센터
                        </SelectItem>
                        <SelectItem value="supportFacility">지원시설구역</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div className="space-y-2">
                  <Label>회사/기관 유형</Label>
                  <Select
                    value={input.applicantType}
                    onValueChange={(value) =>
                      onFieldChange(
                        'applicantType',
                        value as EligibilityInput['applicantType'],
                      )
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="신청 주체 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="company">일반 기업</SelectItem>
                      <SelectItem value="universityLab">대학·대학부설연구소</SelectItem>
                      <SelectItem value="publicInstitution">공공기관</SelectItem>
                      <SelectItem value="publicRelatedOrg">공직유관단체</SelectItem>
                      <SelectItem value="ventureClusterTenant">
                        벤처기업집적시설 입주자
                      </SelectItem>
                      <SelectItem value="startupIncubator">
                        창업보육센터 운영 주체
                      </SelectItem>
                      <SelectItem value="softwarePromotionFacility">
                        소프트웨어진흥시설 운영 주체
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ksicCode">KSIC 코드</Label>
                  <Input
                    id="ksicCode"
                    value={input.ksicCode}
                    placeholder="예: 71310, 62010, 68112"
                    onChange={(event) => onFieldChange('ksicCode', event.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ksicName">업종명</Label>
                  <Input
                    id="ksicName"
                    value={input.ksicName}
                    placeholder="예: 광고 대행업, 컴퓨터 프로그래밍 서비스업"
                    onChange={(event) => onFieldChange('ksicName', event.target.value)}
                  />
                </div>
              </div>

              <div className="mt-5 rounded-[20px] border border-[var(--border)] bg-[var(--surface-soft)] p-4 shadow-[var(--shadow-sm)] sm:rounded-[22px] sm:p-5">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <div className="text-sm font-semibold text-[var(--foreground)]">
                      함께 판정할 추가 업종코드
                    </div>
                    <p className="mt-2 text-sm leading-6 text-[var(--foreground-muted)]">
                      주업종과 부업종을 함께 봅니다. 사업자등록증 기준으로 최대 3개까지
                      입력하세요.
                    </p>
                    <p className="mt-1 text-xs leading-5 text-[var(--foreground-subtle)]">
                      비워 둔 추가 행은 결과에서 자동 제외됩니다.
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={onAddAdditionalCode}
                    disabled={!canAddAdditionalCode}
                    className="whitespace-nowrap"
                  >
                    <Plus className="size-4" />
                    업종코드 추가
                  </Button>
                </div>

                <div className="mt-4 space-y-3">
                  {additionalCodes.length > 0 ? (
                    additionalCodes.map((item, index) => (
                      <div
                        key={item.id}
                        className="rounded-2xl border border-[var(--border)] bg-[var(--surface-strong)] p-4 shadow-[var(--shadow-sm)]"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <div className="text-sm font-semibold text-[var(--foreground)]">
                              부업종 {index + 1}
                            </div>
                            <p className="mt-1 text-xs leading-5 text-[var(--foreground-subtle)]">
                              주업종과 같은 조건으로 함께 예비판정합니다.
                            </p>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => onRemoveAdditionalCode(item.id)}
                            aria-label={`부업종 ${index + 1} 삭제`}
                          >
                            <Trash2 className="size-4" />
                            삭제
                          </Button>
                        </div>

                        <div className="mt-4 grid gap-3 md:grid-cols-[minmax(0,0.75fr)_minmax(0,1.25fr)]">
                          <div className="space-y-2">
                            <Label htmlFor={`additional-code-${item.id}`}>
                              부업종 {index + 1} KSIC 코드
                            </Label>
                            <Input
                              id={`additional-code-${item.id}`}
                              value={item.ksicCode}
                              placeholder="예: 62010, 58211"
                              onChange={(event) =>
                                onAdditionalCodeFieldChange(
                                  item.id,
                                  'ksicCode',
                                  event.target.value,
                                )
                              }
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor={`additional-name-${item.id}`}>
                              부업종 {index + 1} 업종명
                            </Label>
                            <Input
                              id={`additional-name-${item.id}`}
                              value={item.ksicName}
                              placeholder="예: 컴퓨터 프로그래밍 서비스업"
                              onChange={(event) =>
                                onAdditionalCodeFieldChange(
                                  item.id,
                                  'ksicName',
                                  event.target.value,
                                )
                              }
                            />
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="rounded-2xl border border-dashed border-[var(--border)] bg-[var(--surface-strong)] px-4 py-4 text-sm leading-6 text-[var(--foreground-muted)]">
                      지금은 주업종 1개만 판정합니다. 부업종이 더 있으면 업종코드 추가
                      버튼으로 같은 화면에서 함께 검토할 수 있습니다.
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-4 space-y-2">
                <Label>세부 업종 분류</Label>
                <Select
                  value={input.regulatoryFit}
                  onValueChange={(value) =>
                    onFieldChange(
                      'regulatoryFit',
                      value as EligibilityInput['regulatoryFit'],
                    )
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="추천 결과대로 사용" />
                  </SelectTrigger>
                  <SelectContent>
                  <SelectItem value="auto">추천 결과대로 사용</SelectItem>
                    <SelectItem value="knowledgeIndustry">지식산업</SelectItem>
                    <SelectItem value="informationIndustry">정보통신산업</SelectItem>
                    <SelectItem value="otherPermittedIndustry">
                      기타 시행령 허용업종
                    </SelectItem>
                    <SelectItem value="higherEducationResearchInstitute">
                      고등교육법 제25조 연구소(2호)
                    </SelectItem>
                    <SelectItem value="basicResearchInstitution">
                      기초연구법 제14조 기관·단체(3호)
                    </SelectItem>
                    <SelectItem value="elearningIndustry">
                      이러닝법상 업(26호)
                    </SelectItem>
                    <SelectItem value="managedTechnicalService">
                      관리기관 인정 업종(27호)
                    </SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs leading-5 text-[var(--foreground-subtle)]">
                  추천된 업종이 내 일과 다르게 보일 때만 바꿔 주세요.
                </p>
              </div>
            </section>

            <section className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="companyName">기업명 또는 기관명</Label>
                <Input
                  id="companyName"
                  value={input.companyName}
                  placeholder="예: 루핀랩 바이오"
                  onChange={(event) => onFieldChange('companyName', event.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">주소</Label>
                <Input
                  id="address"
                  value={input.address}
                  placeholder="예: 서울 강서구 마곡중앙로 ..."
                  onChange={(event) => onFieldChange('address', event.target.value)}
                />
              </div>
            </section>

            <section className="rounded-[24px] border border-[var(--border)] bg-[var(--surface-strong)] p-5 shadow-[var(--shadow-sm)] sm:p-6">
              <div className="mb-4 flex items-start gap-3">
                <div className="mt-0.5 inline-flex size-9 items-center justify-center rounded-2xl bg-[var(--accent-soft)] text-[var(--accent-strong)] shadow-[var(--shadow-sm)]">
                  <Factory className="size-4" />
                </div>
                <div>
                  <h3 className="font-display text-lg font-semibold text-[var(--foreground)]">
                    마곡 입주 레이아웃 시뮬레이션
                  </h3>
                  <p className="mt-1 text-sm leading-6 text-[var(--foreground-muted)]">
                    총 면적과 기업 규모를 넣으면 필요한 면적을 바로 가늠해 볼 수 있습니다.
                  </p>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label>기업 규모</Label>
                  <Select
                    value={input.companyScale}
                    onValueChange={(value) =>
                      onFieldChange(
                        'companyScale',
                        value as EligibilityInput['companyScale'],
                      )
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="기업 규모 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sme">중소기업</SelectItem>
                      <SelectItem value="large">대기업</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="grossAreaPy">총 면적(평)</Label>
                  <Input
                    id="grossAreaPy"
                    inputMode="decimal"
                    value={input.grossAreaPy}
                    placeholder="예: 1000"
                    onChange={(event) =>
                      onFieldChange('grossAreaPy', event.target.value)
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="rndHeadcount">예상 연구개발 인력(명)</Label>
                  <Input
                    id="rndHeadcount"
                    inputMode="numeric"
                    value={input.rndHeadcount}
                    placeholder="예: 18"
                    onChange={(event) =>
                      onFieldChange('rndHeadcount', event.target.value)
                    }
                  />
                </div>
              </div>

              <p className="mt-3 text-xs leading-5 text-[var(--foreground-subtle)]">
                실제 계약이나 입주 전에는 한 번 더 확인해 보시는 것을 권장합니다.
              </p>
            </section>

            <section className="rounded-[24px] border border-[var(--border)] bg-[var(--surface-strong)] p-5 shadow-[var(--shadow-sm)] sm:p-6">
              <div className="mb-4 flex items-start gap-3">
                <div className="mt-0.5 inline-flex size-9 items-center justify-center rounded-2xl bg-[var(--accent-soft)] text-[var(--accent-strong)] shadow-[var(--shadow-sm)]">
                  <Factory className="size-4" />
                </div>
                <div>
                  <h3 className="font-display text-lg font-semibold text-[var(--foreground)]">
                    제한·예외 조건
                  </h3>
                  <p className="mt-1 text-sm leading-6 text-[var(--foreground-muted)]">
                    현재 업종에서 먼저 볼 조건만 우선 보여드립니다. 필요하면 전체 조건을
                    열어 직접 고를 수 있습니다.
                  </p>
                </div>
              </div>

              <div className="rounded-[20px] border border-[var(--border)] bg-[var(--surface-soft)] p-4 shadow-[var(--shadow-sm)]">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <div className="text-sm font-semibold text-[var(--foreground)]">
                        내 업종에 해당할 수 있는 조건 {recommendedSwitchRows.length}개
                      </div>
                      {enabledFlagCount > 0 ? (
                        <Badge variant="warning">{enabledFlagCount}개 적용 중</Badge>
                      ) : null}
                    </div>
                    <p className="text-sm leading-6 text-[var(--foreground-muted)]">
                      {recommendedSwitchRows.length > 0
                        ? '현재 업종코드와 입력한 설명을 기준으로 먼저 볼 조건만 골랐습니다.'
                        : '현재 입력 기준으로 꼭 먼저 볼 조건은 없습니다. 필요할 때 전체 조건을 열어 직접 확인해 주세요.'}
                    </p>
                    <p className="text-xs leading-5 text-[var(--foreground-subtle)]">
                      {showAllFlags
                        ? '전체 조건을 펼쳐서 모두 보이고 있습니다.'
                        : hiddenSwitchRowCount > 0
                          ? `나머지 ${hiddenSwitchRowCount}개 조건은 전체 조건 보기에서 확인할 수 있습니다.`
                          : '현재 조건에서는 전체 조건을 이미 모두 보여주고 있습니다.'}
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    className="whitespace-nowrap"
                    onClick={() => setShowAllFlags((value) => !value)}
                  >
                    {showAllFlags ? '추천 조건만 보기' : '전체 조건 보기'}
                  </Button>
                </div>
              </div>

              {visibleSwitchRows.length > 0 ? (
                <div className="grid gap-3">
                  {visibleSwitchRows.map((row) => {
                    const isRecommended = recommendedSwitchRows.some(
                      (recommendedRow) => recommendedRow.key === row.key,
                    )

                    return (
                      <label
                        key={row.key}
                        className="flex items-start justify-between gap-4 rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] px-4 py-4 shadow-[var(--shadow-sm)]"
                      >
                        <div className="space-y-2 pr-4">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="block text-sm font-medium text-[var(--foreground)]">
                              {row.label}
                            </span>
                            {isRecommended ? <Badge variant="muted">추천 조건</Badge> : null}
                          </div>
                          <span className="block text-xs leading-6 text-[var(--foreground-muted)]">
                            {row.description}
                          </span>
                          {isRecommended ? (
                            <span className="block text-xs leading-5 text-[var(--foreground-subtle)]">
                              {row.recommendationHint}
                            </span>
                          ) : null}
                        </div>
                        <Switch
                          checked={input.flags[row.key]}
                          onCheckedChange={(checked) => onFlagChange(row.key, checked)}
                          aria-label={row.label}
                        />
                      </label>
                    )
                  })}
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-[var(--border)] bg-[var(--surface-soft)] px-4 py-4 text-sm leading-6 text-[var(--foreground-muted)]">
                  아직 자동으로 추천할 예외 조건은 없습니다. 수동으로 보정해야 하면
                  `전체 조건 보기`를 눌러 모든 토글을 확인해 주세요.
                </div>
              )}
            </section>

            <section className="rounded-[24px] border border-[var(--border)] bg-[var(--surface-strong)] p-5 shadow-[var(--shadow-sm)] sm:p-6">
              <div className="mb-4 flex items-start gap-3">
                <div className="mt-0.5 inline-flex size-9 items-center justify-center rounded-2xl bg-[var(--accent-soft)] text-[var(--accent-strong)] shadow-[var(--shadow-sm)]">
                  <FlaskConical className="size-4" />
                </div>
                <div>
                  <h3 className="font-display text-lg font-semibold text-[var(--foreground)]">
                    보충 메모
                  </h3>
                  <p className="mt-1 text-sm leading-6 text-[var(--foreground-muted)]">
                    심의 포인트나 사업 설명을 추가로 남길 수 있습니다.
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">사업 설명 메모</Label>
                <Textarea
                  id="notes"
                  value={input.notes}
                  placeholder="예: 연구개발 중심 기업이며 향후 소규모 파일럿 생산 예정"
                  onChange={(event) => onFieldChange('notes', event.target.value)}
                />
              </div>
            </section>
          </>
        ) : null}
      </CardContent>
    </Card>
  )
}
