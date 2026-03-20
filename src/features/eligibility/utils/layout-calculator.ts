import type { EligibilityInput } from '@/features/eligibility/types'

export interface LayoutSimulationResult {
  researchRatio: number
  minimumResearchAreaPy: number
  maximumManufacturingAreaPy: number
  remainingGeneralAreaPy: number
  researchAreaPerPersonPy: number | null
  notices: string[]
}

function parsePositiveNumber(value: string) {
  const normalized = value.replace(/,/g, '').trim()
  const parsed = Number.parseFloat(normalized)

  if (!Number.isFinite(parsed) || parsed <= 0) {
    return null
  }

  return parsed
}

function roundToFirstDecimal(value: number) {
  return Math.round(value * 10) / 10
}

export function calculateLayoutSimulation(
  input: EligibilityInput,
): LayoutSimulationResult | null {
  const grossAreaPy = parsePositiveNumber(input.grossAreaPy)

  if (!grossAreaPy) {
    return null
  }

  const rndHeadcount = parsePositiveNumber(input.rndHeadcount)
  const researchRatio = input.companyScale === 'large' ? 50 : 40
  const minimumResearchAreaPy = roundToFirstDecimal((grossAreaPy * researchRatio) / 100)
  const manufacturingRatio = input.flags.hasManufacturingFacility ? 20 : 0
  const maximumManufacturingAreaPy = roundToFirstDecimal(
    (grossAreaPy * manufacturingRatio) / 100,
  )
  const remainingGeneralAreaPy = roundToFirstDecimal(
    Math.max(grossAreaPy - minimumResearchAreaPy - maximumManufacturingAreaPy, 0),
  )
  const researchAreaPerPersonPy =
    rndHeadcount && rndHeadcount > 0
      ? roundToFirstDecimal(minimumResearchAreaPy / rndHeadcount)
      : null

  const notices = [
    input.companyScale === 'large'
      ? '대기업 기준으로 연구시설 최소 50%를 보수적으로 적용했습니다.'
      : '중소기업 기준으로 연구시설 최소 40%를 보수적으로 적용했습니다.',
    input.flags.hasManufacturingFacility
      ? '제조시설 예정으로 표시되어 총 면적의 20%를 제조시설 상한으로 계산했습니다.'
      : '제조시설 예정이 아니므로 제조시설 상한은 별도 배분하지 않았습니다.',
    input.zoneType !== 'industrialFacility'
      ? '이 계산은 산업시설구역의 연구시설·제조시설 조건을 기준으로 한 예비 시뮬레이션입니다.'
      : '산업시설구역 예비판정과 함께 보는 보수적 면적 시뮬레이션입니다.',
  ]

  return {
    researchRatio,
    minimumResearchAreaPy,
    maximumManufacturingAreaPy,
    remainingGeneralAreaPy,
    researchAreaPerPersonPy,
    notices,
  }
}
