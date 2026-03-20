import { useState } from 'react'
import {
  Building2,
  ChevronLeft,
  ChevronDown,
  ChevronUp,
  Factory,
  FlaskConical,
  RefreshCcw,
  SearchCheck,
} from 'lucide-react'

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
  status: 'idle' | 'loading' | 'ready' | 'error'
  onFieldChange: <K extends keyof EligibilityInput>(
    field: K,
    value: EligibilityInput[K],
  ) => void
  onFlagChange: <K extends keyof EligibilityFlags>(
    field: K,
    value: EligibilityFlags[K],
  ) => void
  onEvaluate: () => void
  onReset: () => void
  onPrevious?: () => void
  primaryActionLabel?: string
  secondaryActionLabel?: string
  defaultExpanded?: boolean
  embedded?: boolean
}

const switchRows: Array<{
  key: keyof EligibilityFlags
  label: string
  description: string
}> = [
  {
    key: 'isPackagingAndFilling',
    label: '포장 및 충전업',
    description: '지식산업센터에서는 명시적 제한 업종입니다.',
  },
  {
    key: 'isResourceStockpile',
    label: '자원비축시설',
    description: '지식산업센터 예외 허용 범위에서 제외됩니다.',
  },
  {
    key: 'isHosting63112',
    label: '호스팅 및 관련 서비스업(63112)',
    description: '정확 5자리 코드 기준으로 지식산업센터에서는 위원회 심의가 필요합니다.',
  },
  {
    key: 'isRealEstateOnly',
    label: '부동산임대·공급업만 단독 등록',
    description: '지식산업센터 단독 등록은 제한됩니다.',
  },
  {
    key: 'isTrustOnly',
    label: '신탁업만 단독 등록',
    description: '다른 허용 업종 없이 단독 등록이면 불가입니다.',
  },
  {
    key: 'hasManufacturingFacility',
    label: '제조시설 또는 사업화시설 운영 예정',
    description: '산업시설구역에서는 제조시설 비율 등 추가 조건이 붙습니다.',
  },
  {
    key: 'requiresCommitteeReview',
    label: '융·복합 또는 경계 업종으로 위원회 검토 필요',
    description: '기본 업종표와 애매하면 심의 필요 결과로 보수적으로 판정합니다.',
  },
]

export function EligibilityForm({
  input,
  status,
  onFieldChange,
  onFlagChange,
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
  const enabledFlagCount = switchRows.filter((row) => input.flags[row.key]).length

  return (
    <Card
      className={
        embedded
          ? 'overflow-visible rounded-none border-0 bg-transparent shadow-none'
          : 'overflow-hidden bg-[var(--surface)] shadow-[var(--shadow-md)]'
      }
    >
      <CardHeader className={embedded ? 'hidden' : 'relative'}>
        <CardTitle>세부 조건 직접 수정</CardTitle>
        <CardDescription>
          대부분은 위에서 업종을 고른 뒤 결과만 보면 됩니다. 구역이나 예외 조건을
          직접 바꾸고 싶을 때만 이 섹션을 열어 주세요.
        </CardDescription>
      </CardHeader>
      <CardContent className={embedded ? 'space-y-4 p-0 sm:space-y-6' : 'space-y-6'}>
        <section className="rounded-[20px] border border-[var(--border-accent-strong)] bg-[var(--surface-strong)] p-3.5 shadow-none sm:rounded-[24px] sm:p-5 sm:shadow-[var(--shadow-sm)]">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 inline-flex size-9 items-center justify-center rounded-2xl bg-[var(--accent-soft)] text-[var(--accent-strong)] shadow-[var(--shadow-sm)] sm:size-10">
                <SearchCheck className="size-4" />
              </div>
              <div>
                <h3 className="font-display text-base font-semibold text-[var(--foreground)] sm:text-lg">
                  현재 판정 설정
                </h3>
                <p className="mt-1 text-[13px] leading-5 text-[var(--foreground-muted)] sm:text-sm sm:leading-6">
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

          <div className="mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-2 sm:gap-3 xl:grid-cols-4">
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-strong)] px-3 py-3 shadow-[var(--shadow-sm)] sm:px-4">
              <div className="text-xs text-[var(--foreground-subtle)]">구역</div>
              <div className="mt-1 text-sm font-medium text-[var(--foreground)]">
                {zoneTypeLabels[input.zoneType]}
              </div>
            </div>
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-strong)] px-3 py-3 shadow-[var(--shadow-sm)] sm:px-4">
              <div className="text-xs text-[var(--foreground-subtle)]">회사/기관 유형</div>
              <div className="mt-1 text-sm font-medium text-[var(--foreground)]">
                {applicantTypeLabels[input.applicantType]}
              </div>
            </div>
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-strong)] px-3 py-3 shadow-[var(--shadow-sm)] sm:px-4">
              <div className="text-xs text-[var(--foreground-subtle)]">선택한 업종코드</div>
              <div className="mt-1 text-sm font-medium text-[var(--foreground)]">
                {input.ksicCode.trim() || '직접 입력 예정'}
              </div>
            </div>
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-strong)] px-3 py-3 shadow-[var(--shadow-sm)] sm:px-4">
              <div className="text-xs text-[var(--foreground-subtle)]">예외조건</div>
              <div className="mt-1 text-sm font-medium text-[var(--foreground)]">
                {enabledFlagCount > 0 ? `${enabledFlagCount}개 적용 중` : '없음'}
              </div>
            </div>
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
            <section className="rounded-[24px] border border-[var(--border)] bg-[var(--surface-strong)] p-5 shadow-[var(--shadow-sm)]">
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

              <div className="grid gap-4 md:grid-cols-2">
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

            <section className="rounded-[24px] border border-[var(--border)] bg-[var(--surface-strong)] p-5 shadow-[var(--shadow-sm)]">
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

            <section className="rounded-[24px] border border-[var(--border)] bg-[var(--surface-strong)] p-5 shadow-[var(--shadow-sm)]">
              <div className="mb-4 flex items-start gap-3">
                <div className="mt-0.5 inline-flex size-9 items-center justify-center rounded-2xl bg-[var(--accent-soft)] text-[var(--accent-strong)] shadow-[var(--shadow-sm)]">
                  <Factory className="size-4" />
                </div>
                <div>
                  <h3 className="font-display text-lg font-semibold text-[var(--foreground)]">
                    제한·예외 조건
                  </h3>
                  <p className="mt-1 text-sm leading-6 text-[var(--foreground-muted)]">
                    해당되는 항목만 켜 주세요. 없으면 그대로 두면 됩니다.
                  </p>
                </div>
              </div>

              <div className="grid gap-3">
                {switchRows.map((row) => (
                  <label
                    key={row.key}
                    className="flex items-start justify-between gap-4 rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] px-4 py-3 shadow-[var(--shadow-sm)]"
                  >
                    <div className="space-y-1 pr-4">
                      <span className="block text-sm font-medium text-[var(--foreground)]">
                        {row.label}
                      </span>
                      <span className="block text-xs leading-5 text-[var(--foreground-muted)]">
                        {row.description}
                      </span>
                    </div>
                    <Switch
                      checked={input.flags[row.key]}
                      onCheckedChange={(checked) => onFlagChange(row.key, checked)}
                      aria-label={row.label}
                    />
                  </label>
                ))}
              </div>
            </section>

            <section className="rounded-[24px] border border-[var(--border)] bg-[var(--surface-strong)] p-5 shadow-[var(--shadow-sm)]">
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
