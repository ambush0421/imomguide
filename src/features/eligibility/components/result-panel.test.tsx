import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { ResultPanel } from '@/features/eligibility/components/result-panel'
import {
  evaluateEligibility,
  evaluateEligibilityComparison,
} from '@/features/eligibility/evaluator'
import type {
  EligibilityCodeEvaluation,
  EligibilityInput,
} from '@/features/eligibility/types'

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

function buildComparisonMultiCodeResults(): EligibilityCodeEvaluation[] {
  const secondaryInput: EligibilityInput = {
    ...baseInput,
    ksicCode: '62010',
    ksicName: '컴퓨터 프로그래밍 서비스업',
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
      comparisonResults: evaluateEligibilityComparison(baseInput),
    },
    {
      id: 'secondary-1',
      label: '부업종 1',
      order: 1,
      isPrimary: false,
      ksicCode: secondaryInput.ksicCode,
      ksicName: secondaryInput.ksicName,
      result: evaluateEligibility(secondaryInput),
      comparisonResults: evaluateEligibilityComparison(secondaryInput),
    },
  ]
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
      screen.getByText('제6조제2항제27호 · 관리기관 인정 기타 전문·과학·기술 서비스업'),
    ).toBeInTheDocument()
    expect(screen.getAllByText(/73905 고고유산 조사연구 서비스업/).length).toBeGreaterThan(0)
    expect(
      screen.getAllByText('관리기관 인정 산업으로 별도 인정받는지 확인 필요').length,
    ).toBeGreaterThan(0)
    expect(screen.getByText('입주 전략 메모')).toBeInTheDocument()
    expect(screen.getByText('필요 증빙')).toBeInTheDocument()
    expect(screen.getByText('추천 다음 행동')).toBeInTheDocument()
    expect(
      screen.getAllByText(
        '실제 하지 않는 업무를 혜택 때문에 추가하면 심사나 사후 확인 단계에서 불리할 수 있습니다.',
      ).length,
    ).toBeGreaterThan(0)
    expect(screen.getAllByText('전문가 인사이트').length).toBeGreaterThan(0)
    expect(screen.getByText('법적 근거 각주')).toBeInTheDocument()
    expect(screen.getByText(/근거 1/)).toBeInTheDocument()
    expect(screen.getByText('국가법령정보센터 본문')).toBeInTheDocument()
    expect(screen.getAllByText('법제처 국가법령정보센터').length).toBeGreaterThan(0)
  })

  it('58211은 결과 카드에서 제6조제3항제2호와 KSIC 계층으로 보여준다', () => {
    const softwareInput: EligibilityInput = {
      ...baseInput,
      ksicCode: '58211',
      ksicName: '유선 온라인 게임 소프트웨어 개발 및 공급업',
    }
    const result = evaluateEligibility(softwareInput)

    render(
      <ResultPanel
        input={softwareInput}
        result={result}
        status="ready"
        error={null}
        onEvaluate={() => {}}
      />,
    )

    expect(
      screen.getByText('제6조제3항제2호 · 소프트웨어 개발 및 공급업'),
    ).toBeInTheDocument()
    expect(
      screen.getByText(
        'J 정보통신업 > 58 출판업 > 582 소프트웨어 개발 및 공급업 > 5821 게임 소프트웨어 개발 및 공급업 > 58211 유선 온라인 게임 소프트웨어 개발 및 공급업',
      ),
    ).toBeInTheDocument()
  })

  it('58111은 계속 제6조제2항제7호 출판업으로 보여준다', () => {
    const publishingInput: EligibilityInput = {
      ...baseInput,
      ksicCode: '58111',
      ksicName: '교과서 및 학습 서적 출판업',
    }
    const result = evaluateEligibility(publishingInput)

    render(
      <ResultPanel
        input={publishingInput}
        result={result}
        status="ready"
        error={null}
        onEvaluate={() => {}}
      />,
    )

    expect(screen.getByText('제6조제2항제7호 · 출판업')).toBeInTheDocument()
    expect(
      screen.getByText(
        'J 정보통신업 > 58 출판업 > 581 서적, 잡지 및 기타 인쇄물 출판업 > 5811 서적 출판업 > 58111 교과서 및 학습 서적 출판업',
      ),
    ).toBeInTheDocument()
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

  it('결과 준비 상태에서는 공유 액션 버튼을 노출하고 콜백을 호출한다', async () => {
    const user = userEvent.setup()
    const result = evaluateEligibility(baseInput)
    const onCopyShareLink = vi.fn().mockResolvedValue(undefined)
    const onCopyResultSummary = vi.fn().mockResolvedValue(undefined)
    const onPrintResult = vi.fn()

    render(
      <ResultPanel
        input={baseInput}
        result={result}
        status="ready"
        error={null}
        onEvaluate={() => {}}
        onCopyShareLink={onCopyShareLink}
        onCopyResultSummary={onCopyResultSummary}
        onPrintResult={onPrintResult}
      />,
    )

    await user.click(screen.getByRole('button', { name: '공유 링크 복사' }))
    expect(onCopyShareLink).toHaveBeenCalledTimes(1)
    expect(await screen.findByText('공유 링크를 복사했습니다.')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: '판정 요약 복사' }))
    expect(onCopyResultSummary).toHaveBeenCalledTimes(1)
    expect(await screen.findByText('판정 요약을 복사했습니다.')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: '인쇄 / PDF 저장' }))
    expect(onPrintResult).toHaveBeenCalledTimes(1)
  })

  it('법적 근거 각주에서 라이브러리 이동 콜백을 호출할 수 있다', async () => {
    const user = userEvent.setup()
    const result = evaluateEligibility(baseInput)
    const onOpenLibraryEntry = vi.fn()
    const onOpenLibraryBasis = vi.fn()

    render(
      <ResultPanel
        input={baseInput}
        result={result}
        status="ready"
        error={null}
        onEvaluate={() => {}}
        onOpenLibraryEntry={onOpenLibraryEntry}
        onOpenLibraryBasis={onOpenLibraryBasis}
      />,
    )

    await user.click(
      screen.getByRole('button', {
        name: /산업집적활성화 및 공장설립에 관한 법률 시행령 라이브러리에서 보기/,
      }),
    )
    expect(onOpenLibraryEntry).toHaveBeenCalledTimes(1)

    await user.click(
      screen.getAllByRole('button', {
        name: /법령 라이브러리에서 근거 보기:/,
      })[0],
    )
    expect(onOpenLibraryBasis).toHaveBeenCalledTimes(1)
  })

  it('비교 모드에서는 두 구역 결과를 나란히 보여준다', () => {
    const result = evaluateEligibility(baseInput)
    const comparisonResults = evaluateEligibilityComparison(baseInput)

    render(
      <ResultPanel
        input={baseInput}
        result={result}
        compareZones
        comparisonResults={comparisonResults}
        status="ready"
        error={null}
        onEvaluate={() => {}}
      />,
    )

    expect(
      screen.getByText('지식산업센터와 산업시설구역을 한 번에 비교했습니다.'),
    ).toBeInTheDocument()
    expect(screen.getByText('두 구역 동시 비교')).toBeInTheDocument()
    expect(screen.getAllByText('지식산업센터').length).toBeGreaterThan(0)
    expect(screen.getAllByText('산업시설구역').length).toBeGreaterThan(0)
    expect(screen.getByText('비교 해설')).toBeInTheDocument()
  })

  it('복수 코드 비교 모드에서는 주업종과 부업종 결과를 코드별로 묶어 보여준다', () => {
    const result = evaluateEligibility(baseInput)
    const comparisonResults = evaluateEligibilityComparison(baseInput)

    render(
      <ResultPanel
        input={baseInput}
        result={result}
        multiCodeResults={buildComparisonMultiCodeResults()}
        compareZones
        comparisonResults={comparisonResults}
        status="ready"
        error={null}
        onEvaluate={() => {}}
      />,
    )

    expect(
      screen.getByText('주업종과 부업종 1개를 두 구역 기준으로 함께 비교했습니다.'),
    ).toBeInTheDocument()
    expect(screen.getByText('코드별 결과')).toBeInTheDocument()
    expect(screen.getByText('부업종 1')).toBeInTheDocument()
    expect(screen.getByText('62010 컴퓨터 프로그래밍 서비스업')).toBeInTheDocument()
    expect(screen.getAllByText('두 구역 비교').length).toBeGreaterThan(0)
  })
})
