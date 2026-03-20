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
    expect(screen.getAllByText('전문가 인사이트').length).toBeGreaterThan(0)
    expect(screen.getByText('법적 근거 각주')).toBeInTheDocument()
    expect(screen.getByText(/근거 1/)).toBeInTheDocument()
    expect(screen.getByText('국가법령정보센터 본문')).toBeInTheDocument()
    expect(screen.getAllByText('법제처 국가법령정보센터').length).toBeGreaterThan(0)
  })

  it('융복합 심의 경로가 필요한 경우 결과 화면에 준비 포인트를 보여준다', () => {
    const convergenceInput: EligibilityInput = {
      ...baseInput,
      zoneType: 'industrialFacility',
      ksicCode: '62010',
      ksicName: '컴퓨터 프로그래밍 서비스업',
      flags: {
        ...baseInput.flags,
        requiresCommitteeReview: true,
      },
    }
    const result = evaluateEligibility(convergenceInput)

    render(
      <ResultPanel
        input={convergenceInput}
        result={result}
        status="ready"
        error={null}
        onEvaluate={() => {}}
      />,
    )

    expect(screen.getByText('융복합 심의 경로')).toBeInTheDocument()
    expect(
      screen.getByText('정책심의위원회 설명자료를 준비하는 흐름으로 보는 편이 좋습니다.'),
    ).toBeInTheDocument()
    expect(screen.getAllByText('IT').length).toBeGreaterThan(0)
  })

  it('총 면적을 입력하면 레이아웃 시뮬레이션 수치를 보여준다', () => {
    const simulationInput: EligibilityInput = {
      ...baseInput,
      zoneType: 'industrialFacility',
      ksicCode: '272',
      ksicName: '정밀 기기 제조업',
      grossAreaPy: '1000',
      rndHeadcount: '20',
      flags: {
        ...baseInput.flags,
        hasManufacturingFacility: true,
      },
    }
    const result = evaluateEligibility(simulationInput)

    render(
      <ResultPanel
        input={simulationInput}
        result={result}
        status="ready"
        error={null}
        onEvaluate={() => {}}
      />,
    )

    expect(screen.getByText('마곡 입주 레이아웃 시뮬레이션')).toBeInTheDocument()
    expect(screen.getAllByText('400평').length).toBeGreaterThan(0)
    expect(screen.getByText('200평')).toBeInTheDocument()
    expect(screen.getByText('20평')).toBeInTheDocument()
  })
})
