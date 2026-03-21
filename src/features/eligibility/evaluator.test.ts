import { evaluateEligibility } from '@/features/eligibility/evaluator'
import type { EligibilityInput } from '@/features/eligibility/types'
import { describe, expect, it } from 'vitest'

const baseInput: EligibilityInput = {
  companyName: '테스트 기업',
  address: '서울 강서구 마곡동',
  zoneType: 'industrialFacility',
  ksicCode: '272',
  ksicName: '정밀 기기 제조업',
  companyScale: 'sme',
  grossAreaPy: '',
  rndHeadcount: '',
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
    expect(result.summary).toContain('5자리 코드 기준과 일치합니다')
  })

  it('71531 경영 컨설팅업은 지식산업센터 자동 허용 코드로 판정한다', () => {
    const result = evaluateEligibility({
      ...baseInput,
      zoneType: 'knowledgeIndustryCenter',
      ksicCode: '71531',
      ksicName: '경영 컨설팅업',
    })

    expect(result.verdict).toBe('eligible')
    expect(result.summary).toContain('5자리 코드 기준과 일치합니다')
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

  it('49102 철도 화물 운송업은 지식산업센터 5자리 허용 코드로 판정한다', () => {
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

  it('73905 고고유산 조사연구 서비스업은 추가 확인 대상으로 판정한다', () => {
    const result = evaluateEligibility({
      ...baseInput,
      zoneType: 'knowledgeIndustryCenter',
      ksicCode: '73905',
      ksicName: '고고유산 조사연구 서비스업',
    })

    expect(result.verdict).toBe('insufficient')
    expect(result.summary).toContain('자동 확정하기 어렵습니다')
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

  it('이러닝업 수동 분류는 조건부 확인 대상으로 판정한다', () => {
    const result = evaluateEligibility({
      ...baseInput,
      zoneType: 'knowledgeIndustryCenter',
      ksicCode: '85503',
      ksicName: '온라인 교육학원',
      regulatoryFit: 'elearningIndustry',
    })

    expect(result.verdict).toBe('conditional')
    expect(result.summary).toContain('제7호·제10호')
  })

  it('교육서비스업 코드를 지식산업으로 수동 분류하면 조건부 검토 대상으로 판정한다', () => {
    const result = evaluateEligibility({
      ...baseInput,
      zoneType: 'knowledgeIndustryCenter',
      ksicCode: '85691',
      ksicName: '컴퓨터 학원',
      regulatoryFit: 'knowledgeIndustry',
    })

    expect(result.verdict).toBe('conditional')
    expect(result.summary).toContain('코드만으로 자동 확정하기 어렵지만')
  })

  it('관리기관 인정 업종 수동 분류는 추가 확인 대상으로 판정한다', () => {
    const result = evaluateEligibility({
      ...baseInput,
      zoneType: 'knowledgeIndustryCenter',
      ksicCode: '73909',
      ksicName: '그 외 기타 분류 안된 전문, 과학 및 기술 서비스업',
      regulatoryFit: 'managedTechnicalService',
    })

    expect(result.verdict).toBe('insufficient')
    expect(result.title).toContain('관리기관 인정 여부')
  })
})
