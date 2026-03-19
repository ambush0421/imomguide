import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { ResultPanel } from '@/features/eligibility/components/result-panel'
import { evaluateEligibility } from '@/features/eligibility/evaluator'
import type { EligibilityInput } from '@/features/eligibility/types'

const baseInput: EligibilityInput = {
  companyName: '테스트 기업',
  address: '서울 강서구 마곡동',
  zoneType: 'knowledgeIndustryCenter',
  ksicCode: '73905',
  ksicName: '고고유산 조사연구 서비스업',
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

describe('ResultPanel', () => {
  it('지식산업센터 코드 상세 해설을 화면에 보여준다', () => {
    const result = evaluateEligibility(baseInput)

    render(
      <ResultPanel
        input={baseInput}
        result={result}
        status="ready"
        error={null}
        onEvaluate={() => {}}
      />,
    )

    expect(screen.getByText('업종코드 상세 해설')).toBeInTheDocument()
    expect(
      screen.getByText('27호 · 관리기관 인정 기타 전문·과학·기술 서비스업'),
    ).toBeInTheDocument()
    expect(screen.getByText('7390 중 미열거 영역')).toBeInTheDocument()
    expect(
      screen.getAllByText('관리기관 인정 산업으로 별도 인정받는지 확인 필요').length,
    ).toBeGreaterThan(0)
  })
})
