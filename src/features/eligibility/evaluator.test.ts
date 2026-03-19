import { evaluateEligibility } from '@/features/eligibility/evaluator'
import type { EligibilityInput } from '@/features/eligibility/types'
import { describe, expect, it } from 'vitest'

const baseInput: EligibilityInput = {
  companyName: '테스트 기업',
  address: '서울 강서구 마곡동',
  zoneType: 'industrialFacility',
  ksicCode: '272',
  ksicName: '정밀 기기 제조업',
  applicantType: 'company',
  regulatoryFit: 'auto',
  notes: '',
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

describe('evaluateEligibility', () => {
  it('산업시설구역 허용 업종을 가능으로 판정한다', () => {
    const result = evaluateEligibility(baseInput)

    expect(result.verdict).toBe('eligible')
    expect(result.title).toContain('입주 가능성이 높습니다')
  })

  it('제조시설 예정이면 조건부 가능으로 판정한다', () => {
    const result = evaluateEligibility({
      ...baseInput,
      flags: {
        ...baseInput.flags,
        hasManufacturingFacility: true,
      },
    })

    expect(result.verdict).toBe('conditional')
    expect(result.summary).toContain('제조시설')
  })

  it('지식산업센터의 포장 및 충전업은 불가로 판정한다', () => {
    const result = evaluateEligibility({
      ...baseInput,
      zoneType: 'knowledgeIndustryCenter',
      flags: {
        ...baseInput.flags,
        isPackagingAndFilling: true,
      },
    })

    expect(result.verdict).toBe('ineligible')
  })

  it('63111 자료 처리업은 지식산업센터 자동 허용 코드로 판정한다', () => {
    const result = evaluateEligibility({
      ...baseInput,
      zoneType: 'knowledgeIndustryCenter',
      ksicCode: '63111',
      ksicName: '자료 처리업',
    })

    expect(result.verdict).toBe('eligible')
    expect(result.summary).toContain('exact 5자리 허용 코드')
  })

  it('63112 호스팅 및 관련 서비스업은 심의 필요로 판정한다', () => {
    const result = evaluateEligibility({
      ...baseInput,
      zoneType: 'knowledgeIndustryCenter',
      ksicCode: '63112',
      ksicName: '호스팅 및 관련 서비스업',
    })

    expect(result.verdict).toBe('reviewRequired')
    expect(result.summary).toContain('위원회')
  })

  it('49102 철도 화물 운송업은 지식산업센터 exact 허용 코드로 판정한다', () => {
    const result = evaluateEligibility({
      ...baseInput,
      zoneType: 'knowledgeIndustryCenter',
      ksicCode: '49102',
      ksicName: '철도 화물 운송업',
    })

    expect(result.verdict).toBe('eligible')
  })

  it('75994 포장 및 충전업은 코드만으로도 지식산업센터 불가로 판정한다', () => {
    const result = evaluateEligibility({
      ...baseInput,
      zoneType: 'knowledgeIndustryCenter',
      ksicCode: '75994',
      ksicName: '포장 및 충전업',
    })

    expect(result.verdict).toBe('ineligible')
  })

  it('52941 항공 및 육상 화물 취급업은 추가 확인 대상으로 판정한다', () => {
    const result = evaluateEligibility({
      ...baseInput,
      zoneType: 'knowledgeIndustryCenter',
      ksicCode: '52941',
      ksicName: '항공 및 육상 화물 취급업',
    })

    expect(result.verdict).toBe('insufficient')
  })

  it('지원시설구역은 정보 부족으로 안내한다', () => {
    const result = evaluateEligibility({
      ...baseInput,
      zoneType: 'supportFacility',
    })

    expect(result.verdict).toBe('insufficient')
  })

  it('지식산업센터 수동 법령 분류를 조건부 가능으로 본다', () => {
    const result = evaluateEligibility({
      ...baseInput,
      zoneType: 'knowledgeIndustryCenter',
      ksicCode: '',
      ksicName: '사내 교육 플랫폼',
      regulatoryFit: 'knowledgeIndustry',
    })

    expect(result.verdict).toBe('conditional')
  })
})
