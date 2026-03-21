import { describe, expect, it } from 'vitest'

import {
  buildEligibilityResultSummary,
  createSharedFinderHash,
  decodeSharedEligibilityInput,
} from '@/features/eligibility/share-result'
import { evaluateEligibility } from '@/features/eligibility/evaluator'
import type { EligibilityInput } from '@/features/eligibility/types'

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
})
