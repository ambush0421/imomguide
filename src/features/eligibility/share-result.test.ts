import { describe, expect, it } from 'vitest'

import {
  buildEligibilityResultSummary,
  createSharedFinderHash,
  decodeSharedEligibilityInput,
  decodeSharedEligibilityState,
} from '@/features/eligibility/share-result'
import {
  evaluateEligibility,
  evaluateEligibilityComparison,
} from '@/features/eligibility/evaluator'
import type {
  EligibilityAdditionalCode,
  EligibilityCodeEvaluation,
  EligibilityInput,
} from '@/features/eligibility/types'

const baseInput: EligibilityInput = {
  companyName: '테스트 기업',
  address: '서울 강서구 마곡중앙로',
  zoneType: 'knowledgeIndustryCenter',
  ksicCode: '73905',
  ksicName: '경영 컨설팅업',
  companyScale: 'sme',
  grossAreaPy: '',
  rndHeadcount: '',
  applicantType: 'company',
  regulatoryFit: 'auto',
  notes: '공유 테스트',
  flags: {
    isPackagingAndFilling: false,
    isResourceStockpile: false,
    isHosting63112: false,
    isRealEstateOnly: false,
    isTrustOnly: false,
    hasManufacturingFacility: false,
    requiresCommitteeReview: false,
  },
}

const additionalCodes: EligibilityAdditionalCode[] = [
  {
    id: 'secondary-1',
    ksicCode: '62010',
    ksicName: '컴퓨터 프로그래밍 서비스업',
  },
]

function buildMultiCodeResults(): EligibilityCodeEvaluation[] {
  const secondaryInput: EligibilityInput = {
    ...baseInput,
    ksicCode: additionalCodes[0].ksicCode,
    ksicName: additionalCodes[0].ksicName,
  }

  return [
    {
      id: 'primary-code',
      label: '주업종',
      order: 0,
      isPrimary: true,
      ksicCode: baseInput.ksicCode,
      ksicName: baseInput.ksicName,
      result: evaluateEligibility(baseInput),
      comparisonResults: null,
    },
    {
      id: additionalCodes[0].id,
      label: '부업종 1',
      order: 1,
      isPrimary: false,
      ksicCode: secondaryInput.ksicCode,
      ksicName: secondaryInput.ksicName,
      result: evaluateEligibility(secondaryInput),
      comparisonResults: null,
    },
  ]
}

describe('share-result helpers', () => {
  it('공유 해시를 만들고 같은 입력으로 복원한다', () => {
    const hash = createSharedFinderHash(baseInput)
    const shareValue = hash.split('share=')[1]

    expect(shareValue).toBeTruthy()
    expect(decodeSharedEligibilityInput(shareValue)).toEqual(baseInput)
  })

  it('판정 요약 텍스트에 핵심 결과와 법적 근거를 담는다', () => {
    const result = evaluateEligibility(baseInput)
    const summary = buildEligibilityResultSummary(baseInput, result)

    expect(summary).toContain('마곡 입주 예비판정 요약')
    expect(summary).toContain('73905 경영 컨설팅업')
    expect(summary).toContain('지식산업센터 기준')
    expect(summary).toContain('법적 근거')
    expect(result.legalBases.some((basis) => summary.includes(basis.citation))).toBe(true)
  })

  it('비교 모드 공유 해시는 compare 상태까지 함께 복원한다', () => {
    const hash = createSharedFinderHash(baseInput, { compareZones: true })
    const shareValue = hash.split('share=')[1]

    expect(decodeSharedEligibilityState(shareValue)).toEqual({
      input: baseInput,
      compareZones: true,
      additionalCodes: [],
    })
  })

  it('복수 업종코드 공유 해시는 추가 코드까지 함께 복원한다', () => {
    const hash = createSharedFinderHash(baseInput, {
      compareZones: true,
      additionalCodes,
    })
    const shareValue = hash.split('share=')[1]

    expect(decodeSharedEligibilityState(shareValue)).toEqual({
      input: baseInput,
      compareZones: true,
      additionalCodes,
    })
  })

  it('비교 모드 요약 텍스트에는 두 구역 결과가 모두 들어간다', () => {
    const result = evaluateEligibility(baseInput)
    const comparisonResults = evaluateEligibilityComparison(baseInput)
    const summary = buildEligibilityResultSummary(baseInput, result, {
      compareZones: true,
      comparisonResults,
    })

    expect(summary).toContain('마곡 입주 예비판정 비교 요약')
    expect(summary).toContain('지식산업센터:')
    expect(summary).toContain('산업시설구역:')
  })

  it('복수 업종코드 요약 텍스트에는 주업종과 부업종 결과가 함께 들어간다', () => {
    const result = evaluateEligibility(baseInput)
    const summary = buildEligibilityResultSummary(baseInput, result, {
      multiCodeResults: buildMultiCodeResults(),
    })

    expect(summary).toContain('마곡 입주 복수 업종코드 판정 요약')
    expect(summary).toContain('주업종: 73905 경영 컨설팅업')
    expect(summary).toContain('부업종 1: 62010 컴퓨터 프로그래밍 서비스업')
  })
})
