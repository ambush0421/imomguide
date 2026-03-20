import {
  KNOWLEDGE_CENTER_EXTRA_RULES,
  MAGOK_INDUSTRIAL_RULES,
  matchIndustryRule,
  normalizeKsicCode,
} from '@/features/eligibility/data/rules'
import type {
  EligibilityInput,
  EligibilityResult,
} from '@/features/eligibility/types'

export interface ConvergenceReviewPlaybook {
  title: string
  summary: string
  candidateClusters: string[]
  planHints: string[]
  evidenceChecklist: string[]
}

function unique(values: string[]) {
  return [...new Set(values.filter(Boolean))]
}

function inferClusters(normalizedCode: string) {
  if (!normalizedCode) {
    return ['공통 연구개발']
  }

  const industrialRule = matchIndustryRule(MAGOK_INDUSTRIAL_RULES, normalizedCode)

  if (industrialRule?.group && industrialRule.group !== '공통') {
    return [industrialRule.group]
  }

  if (
    ['58', '59', '60', '61', '62', '63'].some((prefix) =>
      normalizedCode.startsWith(prefix),
    )
  ) {
    return ['IT']
  }

  if (
    ['011', '108', '109', '20', '21', '271', '731'].some((prefix) =>
      normalizedCode.startsWith(prefix),
    )
  ) {
    return ['BT']
  }

  if (['23', '25'].some((prefix) => normalizedCode.startsWith(prefix))) {
    return ['NT']
  }

  if (['22', '29', '30', '31'].some((prefix) => normalizedCode.startsWith(prefix))) {
    return ['GT']
  }

  if (normalizedCode.startsWith('35')) {
    return ['에너지']
  }

  if (['38', '39'].some((prefix) => normalizedCode.startsWith(prefix))) {
    return ['자원순환']
  }

  return ['공통 연구개발']
}

export function getConvergenceReviewPlaybook(
  input: EligibilityInput,
  result: EligibilityResult | null,
): ConvergenceReviewPlaybook | null {
  if (!result) {
    return null
  }

  const hasConvergenceBasis = result.legalBases.some(
    (basis) => basis.id === 'magokConvergenceReview' || basis.id === 'decreeDiscretion',
  )
  const shouldShow =
    hasConvergenceBasis ||
    input.flags.requiresCommitteeReview ||
    result.verdict === 'reviewRequired'

  if (!shouldShow) {
    return null
  }

  const normalizedCode = normalizeKsicCode(input.ksicCode)
  const knowledgeExtraRule = matchIndustryRule(
    KNOWLEDGE_CENTER_EXTRA_RULES,
    normalizedCode,
  )
  const industrialRule = matchIndustryRule(MAGOK_INDUSTRIAL_RULES, normalizedCode)
  const candidateClusters = inferClusters(normalizedCode)

  return {
    title:
      result.verdict === 'ineligible'
        ? '원칙상 불가여도 융복합 심의 경로는 별도로 정리할 수 있습니다.'
        : '정책심의위원회 설명자료를 준비하는 흐름으로 보는 편이 좋습니다.',
    summary:
      industrialRule || knowledgeExtraRule
        ? `${industrialRule?.label ?? knowledgeExtraRule?.label}와 연결되는 포인트를 중심으로, 기존 허용 업종과의 결합 구조를 설명하면 심의 논리가 더 선명해집니다.`
        : '직접 허용 코드가 아니더라도, 기존 특화 산업과의 결합성과 연구개발 목적을 설명하면 예외 검토 논리를 만들 수 있습니다.',
    candidateClusters,
    planHints: unique([
      `${candidateClusters.join(', ')} 클러스터와 연결되는 기술·서비스 결합 문장을 사업계획서 첫 문단에 배치하세요.`,
      '연구개발 인력 비중, 핵심 산출물, 입주 후 협업 대상 같은 운영 문장을 코드 설명보다 먼저 제시하세요.',
      input.zoneType === 'industrialFacility'
        ? '산업시설구역이라면 허용 업종과의 연계성, 연구시설 구성, 사업화 필요성을 같이 적는 편이 유리합니다.'
        : '지식산업센터라면 서비스 구조, 사용면적, 실제 운영 조직이 지식산업센터 취지와 맞는지까지 설명해야 합니다.',
    ]),
    evidenceChecklist: unique([
      '기술 결합성 또는 산업 융복합 필요성을 보여주는 1장 요약',
      '연구개발 인력 구성과 실제 사용 공간 계획',
      '기존 마곡 특화 산업군과 연결되는 제품·서비스 흐름도',
      input.notes.trim()
        ? `사용자 메모에 적은 핵심 설명: ${input.notes.trim()}`
        : '',
    ]),
  }
}
