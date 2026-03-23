import { describe, expect, it } from 'vitest'

import { getEligibilityScreenInsight } from '@/features/eligibility/data/screen-insights'
import { evaluateEligibility } from '@/features/eligibility/evaluator'
import type { EligibilityInput } from '@/features/eligibility/types'

const baseInput: EligibilityInput = {
  companyName: '테스트 기업',
  address: '서울 강서구 마곡동',
  zoneType: 'knowledgeIndustryCenter',
  ksicCode: '',
  ksicName: '',
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

describe('getEligibilityScreenInsight', () => {
  it.each([
    ['58211', '유선 온라인 게임 소프트웨어 개발 및 공급업'],
    ['58212', '모바일 게임 소프트웨어 개발 및 공급업'],
    ['58219', '기타 게임 소프트웨어 개발 및 공급업'],
    ['58221', '시스템 소프트웨어 개발 및 공급업'],
    ['58222', '응용 소프트웨어 개발 및 공급업'],
  ])('%s 코드는 제6조제3항제2호로 연결된다', (ksicCode, ksicName) => {
    const input: EligibilityInput = {
      ...baseInput,
      ksicCode,
      ksicName,
    }
    const result = evaluateEligibility(input)
    const insight = getEligibilityScreenInsight(input, result)

    expect(insight).not.toBeNull()
    expect(insight?.fields).toContainEqual({
      label: '연결 조문',
      value: '제6조제3항제2호 · 소프트웨어 개발 및 공급업',
    })
  })

  it.each([
    ['58111', '교과서 및 학습 서적 출판업'],
    ['58112', '만화 출판업'],
    ['58113', '일반 서적 출판업'],
    ['58190', '기타 인쇄물 출판업'],
  ])('%s 코드는 계속 제6조제2항제7호로 연결된다', (ksicCode, ksicName) => {
    const input: EligibilityInput = {
      ...baseInput,
      ksicCode,
      ksicName,
    }
    const result = evaluateEligibility(input)
    const insight = getEligibilityScreenInsight(input, result)

    expect(insight).not.toBeNull()
    expect(insight?.fields).toContainEqual({
      label: '연결 조문',
      value: '제6조제2항제7호 · 출판업',
    })
  })
})
