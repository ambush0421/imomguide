import { normalizeKsicCode } from '@/features/eligibility/data/rules'
import type {
  DirectoryZoneType,
  EligibilityInput,
  EligibilityResult,
  EligibilityStrategyPlan,
  IndustrySuggestion,
  IndustrySuggestionRelatedCode,
  RegulatoryFit,
  Verdict,
  ZoneType,
} from '@/features/eligibility/types'

type StrategyTrack =
  | 'software'
  | 'hosting'
  | 'content'
  | 'research'
  | 'education'
  | 'operations'
  | 'asset'
  | 'general'

const complianceRiskNote =
  '실제 하지 않는 업무를 혜택 때문에 추가하면 심사나 사후 확인 단계에서 불리할 수 있습니다.'

function unique(values: string[]) {
  return [...new Set(values.filter(Boolean))]
}

function getZoneLabel(zoneType: ZoneType | DirectoryZoneType) {
  if (zoneType === 'industrialFacility') {
    return '산업시설구역'
  }

  if (zoneType === 'knowledgeIndustryCenter') {
    return '지식산업센터'
  }

  return '지원시설구역'
}

function getTrack(code: string, regulatoryFit?: RegulatoryFit): StrategyTrack {
  const normalizedCode = normalizeKsicCode(code)

  if (normalizedCode === '63112') {
    return 'hosting'
  }

  if (normalizedCode === '68112' || normalizedCode === '64201') {
    return 'asset'
  }

  if (
    regulatoryFit === 'informationIndustry' ||
    normalizedCode.startsWith('58') ||
    normalizedCode.startsWith('620') ||
    normalizedCode.startsWith('631') ||
    normalizedCode.startsWith('639')
  ) {
    return 'software'
  }

  if (
    normalizedCode.startsWith('591') ||
    normalizedCode.startsWith('592') ||
    normalizedCode.startsWith('713') ||
    normalizedCode.startsWith('732')
  ) {
    return 'content'
  }

  if (
    normalizedCode.startsWith('70') ||
    normalizedCode.startsWith('714') ||
    normalizedCode.startsWith('715') ||
    normalizedCode.startsWith('721') ||
    normalizedCode.startsWith('729') ||
    normalizedCode.startsWith('739')
  ) {
    return 'research'
  }

  if (normalizedCode.startsWith('855') || normalizedCode.startsWith('856')) {
    return 'education'
  }

  if (normalizedCode.startsWith('759')) {
    return 'operations'
  }

  return 'general'
}

function getBusinessAngle(track: StrategyTrack) {
  switch (track) {
    case 'software':
      return '상담에서는 단순 IT라는 표현보다 개발 산출물, 운영 중인 서비스, 구축 범위를 붙여 설명하는 편이 정확합니다.'
    case 'hosting':
      return '호스팅은 서버 운영 구조, 직접 제공 기능, 고객사 대상 범위를 구체적으로 풀어야 심의 대응력이 생깁니다.'
    case 'content':
      return '콘텐츠·광고·디자인 계열은 제작 산출물과 실제 납품 방식이 보이도록 설명해야 코드 설득력이 높아집니다.'
    case 'research':
      return '연구·엔지니어링 계열은 자문보다 연구개발 수행 방식, 과업 범위, 인력 구성이 드러나도록 설명하는 편이 좋습니다.'
    case 'education':
      return '교육 계열은 강의 자체보다 커리큘럼, 운영 플랫폼, 강사·운영 인력 구조까지 함께 적는 편이 안전합니다.'
    case 'operations':
      return '운영·대행 계열은 실제 대행 범위와 내부 인력·시스템이 무엇인지 함께 설명해야 관련 업종으로 읽히기 쉽습니다.'
    case 'asset':
      return '자산·임대 계열은 단독 등록인지, 실제로 함께 수행하는 허용 업종이 있는지 분리해서 설명해야 합니다.'
    default:
      return '코드명만 말하기보다 실제 매출이 나는 핵심 업무를 한 문단으로 좁혀 적는 편이 정확한 분류에 도움이 됩니다.'
  }
}

function getEvidenceChecklist(track: StrategyTrack) {
  switch (track) {
    case 'software':
      return [
        '서비스 소개서, 화면 캡처, 개발 산출물처럼 실제 소프트웨어 수행 사실을 보여줄 자료',
        '개발·운영 계약서 또는 제안서처럼 매출이 어떤 업무에서 나는지 보이는 문서',
        '개발 인력이나 운영 인력 구성표',
      ]
    case 'hosting':
      return [
        '서버 운영 구조도 또는 제공 기능 설명 자료',
        '호스팅 범위와 고객 대상이 드러나는 계약서나 서비스 소개서',
        '직접 운영 인력, 인프라, 지원 체계를 정리한 메모',
      ]
    case 'content':
      return [
        '포트폴리오, 제작물, 캠페인 결과물처럼 실제 수행 내용을 보여주는 자료',
        '클라이언트 계약서나 작업 범위표',
        '기획, 제작, 운영 인력 구성표',
      ]
    case 'research':
      return [
        '연구개발 계획서, 과업 범위서, 기술 소개서',
        '연구인력이나 전문 인력 현황',
        '장비, 시험, 분석 또는 설계 산출물 예시',
      ]
    case 'education':
      return [
        '커리큘럼, 강의안, 교육 운영 계획서',
        'LMS 화면, 강의 플랫폼 소개, 수강 프로세스 설명 자료',
        '강사·운영 인력과 실제 교육 제공 사실을 보여주는 계약 또는 안내문',
      ]
    case 'operations':
      return [
        '대행 범위와 운영 프로세스를 설명한 소개서',
        '실제 운영 계약 또는 수행 사례',
        '운영 인력과 내부 시스템 구성 자료',
      ]
    case 'asset':
      return [
        '임대·신탁 외에 실제 수행하는 허용 업종이 있다면 그 계약서와 산출물',
        '주업종과 부업종 중 실제 매출 비중이 드러나는 자료',
        '단독 등록인지 복합 영위인지 확인할 수 있는 사업 설명서',
      ]
    default:
      return [
        '실제 서비스나 제품 소개서',
        '주요 계약서 또는 수행 범위 문서',
        '인력과 공간 사용 계획 메모',
      ]
  }
}

function getBenefitPath(
  track: StrategyTrack,
  zoneType: ZoneType | DirectoryZoneType,
  verdict: Verdict,
) {
  if (verdict === 'ineligible') {
    return `${getZoneLabel(zoneType)} 기준으로는 이 코드 하나만으로 혜택을 기대하기보다, 실제 영위하는 다른 허용 업종이나 다른 구역 검토가 우선입니다.`
  }

  if (verdict === 'reviewRequired' || verdict === 'conditional') {
    return `${getZoneLabel(zoneType)} 기준으로 바로 끝나는 코드가 아니라서, 실제 사업 구조와 증빙을 붙여야 입주 검토 경로가 열립니다.`
  }

  if (zoneType === 'knowledgeIndustryCenter') {
    if (track === 'software' || track === 'hosting') {
      return '지식산업센터에서는 5자리 코드 정합성과 실제 개발·운영 구조를 함께 보여주면 입주 검토 속도를 높이기 좋습니다.'
    }

    return '지식산업센터에서는 해당 5자리 코드와 실제 수행 업무가 맞아떨어진다는 점을 보여주는 것이 가장 중요한 혜택 경로입니다.'
  }

  if (zoneType === 'industrialFacility') {
    return '산업시설구역에서는 업종 코드 자체보다 연구개발, 설계, 기술사업화처럼 산업 기여도가 드러나는 설명이 유리합니다.'
  }

  return '지원시설구역은 별도 지침 검토가 필요해, 혜택보다 허용 용도 확인이 우선입니다.'
}

function getVerdictSpecificProofs(verdict: Verdict) {
  if (verdict === 'reviewRequired') {
    return ['위원회 설명용 1장 요약 자료', '사업모델과 공간 사용 계획을 함께 정리한 메모']
  }

  if (verdict === 'conditional') {
    return ['단독 등록 여부와 실제 영위 구조를 나눠 설명한 자료']
  }

  if (verdict === 'ineligible') {
    return ['실제 영위 중인 다른 허용 업종이 있는지 확인할 수 있는 사업 설명 자료']
  }

  return []
}

function getVerdictSpecificNextActions(
  suggestionOrCodeLabel: string,
  zoneType: ZoneType | DirectoryZoneType,
  verdict: Verdict,
) {
  if (verdict === 'reviewRequired') {
    return [
      `${suggestionOrCodeLabel} 기준으로 심의 대응 메모를 먼저 준비하세요.`,
      `${getZoneLabel(zoneType)} 관리기관에 설명할 핵심 업무와 공간 사용 계획을 한 장으로 정리하세요.`,
    ]
  }

  if (verdict === 'conditional') {
    return [
      `${suggestionOrCodeLabel}이 단독 등록인지, 다른 허용 업종과 함께 영위하는지 먼저 정리하세요.`,
      '실제 매출이 나는 핵심 업무가 무엇인지 계약과 산출물 기준으로 좁혀 보세요.',
    ]
  }

  if (verdict === 'ineligible') {
    return [
      `${getZoneLabel(zoneType)} 대신 다른 구역 검토가 필요한지 바로 비교해 보세요.`,
      '실제 영위하는 다른 허용 업종이 있다면 그 코드와 증빙을 먼저 다시 확인하세요.',
    ]
  }

  return [
    `${suggestionOrCodeLabel} 기준으로 실제 수행 업무를 한 문장으로 정리하세요.`,
    '예비판정 단계에서 면적, 인력, 제조시설 여부까지 함께 맞춰 보세요.',
  ]
}

function getVerdictSpecificRiskNotes(verdict: Verdict) {
  if (verdict === 'reviewRequired') {
    return ['심의 대상 코드는 코드명보다 실제 운영 구조를 더 엄격하게 확인받을 수 있습니다.']
  }

  if (verdict === 'conditional') {
    return ['조건부 업종은 단독 등록 여부와 실제 영위 범위를 함께 보지 않으면 과하게 낙관적으로 읽힐 수 있습니다.']
  }

  if (verdict === 'ineligible') {
    return ['현재 코드가 불가라면 억지로 맞추기보다 실제 수행 중인 다른 허용 업종이 있는지부터 확인해야 합니다.']
  }

  return []
}

function normalizeGuidanceText(value: string) {
  return value.toLowerCase().replace(/\s+/g, '').replace(/[.,:()]/g, '')
}

function getGuidanceTopicKey(value: string) {
  const normalized = normalizeGuidanceText(value)

  if (
    normalized.includes('실제하지않는업무') ||
    normalized.includes('실제영위') ||
    normalized.includes('실제수행업무') ||
    normalized.includes('핵심업무')
  ) {
    return 'business-scope'
  }

  if (normalized.includes('주업종') && normalized.includes('부업종')) {
    return 'primary-secondary'
  }

  if (
    normalized.includes('면적') ||
    normalized.includes('인력') ||
    normalized.includes('제조시설') ||
    normalized.includes('예비판정')
  ) {
    return 'adjust-inputs'
  }

  return normalized
}

function markGuidanceKeys(seen: Set<string>, value: string) {
  const normalized = normalizeGuidanceText(value)
  const topic = getGuidanceTopicKey(value)

  if (normalized) {
    seen.add(normalized)
  }

  if (topic) {
    seen.add(topic)
  }
}

function collectDistinctGuidance(
  values: string[],
  limit: number,
  seen: Set<string> = new Set(),
) {
  const items: string[] = []

  for (const value of unique(values)) {
    const normalized = normalizeGuidanceText(value)
    const topic = getGuidanceTopicKey(value)

    if (!normalized || seen.has(normalized) || seen.has(topic)) {
      continue
    }

    items.push(value)
    seen.add(normalized)
    seen.add(topic)

    if (items.length >= limit) {
      break
    }
  }

  return items
}

function buildDiscoveryRiskNotes(verdict: Verdict, catalogNote?: string) {
  return collectDistinctGuidance(
    [...getVerdictSpecificRiskNotes(verdict), catalogNote ?? '', complianceRiskNote],
    2,
  )
}

function getDiscoveryNextActionCandidates(
  suggestionOrCodeLabel: string,
  zoneType: ZoneType | DirectoryZoneType,
  verdict: Verdict,
) {
  if (verdict === 'reviewRequired') {
    return [
      `${suggestionOrCodeLabel} 기준으로 예비판정을 진행하면서 심의 필요 사유를 같이 확인해 보세요.`,
      `${getZoneLabel(zoneType)} 기준으로 면적, 인력, 제조시설 여부와 설명 메모를 함께 맞춰 보세요.`,
    ]
  }

  if (verdict === 'conditional') {
    return [
      `${suggestionOrCodeLabel}이 주업종인지 부업종인지 정한 뒤 예비판정으로 넘어가 보세요.`,
      `${getZoneLabel(zoneType)} 기준으로 면적, 인력, 제조시설 여부를 넣어 조건부 사유가 해소되는지 확인해 보세요.`,
    ]
  }

  if (verdict === 'ineligible') {
    return [
      '이 코드를 바로 확정하지 말고 현재 검색에서 나온 다른 후보와 먼저 비교해 보세요.',
      `${getZoneLabel(zoneType)} 외 다른 구역 기준이 더 맞는지도 함께 확인해 보세요.`,
    ]
  }

  return [
    `${suggestionOrCodeLabel} 기준으로 바로 예비판정을 이어가 보세요.`,
    `${getZoneLabel(zoneType)} 기준으로 면적, 인력, 제조시설 여부를 함께 맞춰 보세요.`,
  ]
}

function buildDiscoveryNextActions(
  suggestionOrCodeLabel: string,
  zoneType: ZoneType | DirectoryZoneType,
  verdict: Verdict,
  riskNotes: string[],
) {
  const seen = new Set<string>()

  riskNotes.forEach((item) => markGuidanceKeys(seen, item))

  return collectDistinctGuidance(
    getDiscoveryNextActionCandidates(suggestionOrCodeLabel, zoneType, verdict),
    2,
    seen,
  )
}

function getRelatedCodeReason(
  suggestion: IndustrySuggestion,
  candidate: IndustrySuggestion,
) {
  if (normalizeKsicCode(suggestion.code).slice(0, 2) === normalizeKsicCode(candidate.code).slice(0, 2)) {
    return '같은 계열 안에서 더 정확한 세분류 후보라 함께 비교해 볼 가치가 있습니다.'
  }

  if (
    suggestion.suggestedRegulatoryFit &&
    suggestion.suggestedRegulatoryFit === candidate.suggestedRegulatoryFit
  ) {
    return '같은 법령 분류 축에서 함께 검토할 수 있는 연관 코드입니다.'
  }

  return '입력 설명에서 함께 잡힌 연관 후보라 주업종·부업종 비교에 도움이 됩니다.'
}

function buildRelatedCodes(
  suggestions: IndustrySuggestion[],
  currentSuggestion: IndustrySuggestion,
): IndustrySuggestionRelatedCode[] {
  const relatedCandidates = suggestions
    .filter((candidate) => candidate.code !== currentSuggestion.code)
    .sort((left, right) => {
      const leftSamePrefix =
        normalizeKsicCode(left.code).slice(0, 2) ===
        normalizeKsicCode(currentSuggestion.code).slice(0, 2)
      const rightSamePrefix =
        normalizeKsicCode(right.code).slice(0, 2) ===
        normalizeKsicCode(currentSuggestion.code).slice(0, 2)

      if (leftSamePrefix !== rightSamePrefix) {
        return rightSamePrefix ? 1 : -1
      }

      const leftSameFit =
        left.suggestedRegulatoryFit &&
        left.suggestedRegulatoryFit === currentSuggestion.suggestedRegulatoryFit
      const rightSameFit =
        right.suggestedRegulatoryFit &&
        right.suggestedRegulatoryFit === currentSuggestion.suggestedRegulatoryFit

      if (leftSameFit !== rightSameFit) {
        return rightSameFit ? 1 : -1
      }

      return right.score - left.score
    })
    .slice(0, 2)

  return relatedCandidates.map((candidate) => ({
    code: candidate.code,
    name: candidate.name,
    reason: getRelatedCodeReason(currentSuggestion, candidate),
  }))
}

function getStrategyHeadline(
  input: EligibilityInput,
  result: EligibilityResult,
) {
  const codeLabel = `${input.ksicCode.trim()} ${input.ksicName.trim()}`.trim()

  if (result.verdict === 'ineligible') {
    return `${codeLabel || '현재 업종'}만으로는 바로 입주를 밀어붙이기보다, 실제 영위 업종과 대체 구역을 다시 설계하는 편이 안전합니다.`
  }

  if (result.verdict === 'reviewRequired') {
    return `${codeLabel || '현재 업종'}은 심의 대응 자료까지 준비해야 입주 검토가 열리는 유형입니다.`
  }

  if (result.verdict === 'conditional') {
    return `${codeLabel || '현재 업종'}은 실제 영위 구조와 등록 방식 설명이 붙어야 입주 가능성을 높일 수 있습니다.`
  }

  if (result.verdict === 'insufficient') {
    return '아직은 코드 정답보다, 실제 사업 내용을 더 구체적으로 정리하는 것이 우선입니다.'
  }

  return `${codeLabel || '현재 업종'}과 실제 영위 업무가 일치한다면, 이 기준으로 입주 검토를 이어갈 수 있습니다.`
}

export function enrichIndustrySuggestions(
  suggestions: IndustrySuggestion[],
  zoneType: DirectoryZoneType,
) {
  return suggestions.map((suggestion) => {
    const verdict = suggestion.selectedZoneVerdict ?? 'insufficient'
    const track = getTrack(suggestion.code, suggestion.suggestedRegulatoryFit)
    const codeLabel = `${suggestion.name}(${suggestion.code})`
    const requiredProofs = unique([
      ...getEvidenceChecklist(track),
      ...getVerdictSpecificProofs(verdict),
    ]).slice(0, 3)
    const riskNotes = buildDiscoveryRiskNotes(verdict, suggestion.catalogNote)
    const nextActions = buildDiscoveryNextActions(codeLabel, zoneType, verdict, riskNotes)

    return {
      ...suggestion,
      fitSummary:
        suggestion.recommendationReason ??
        `${codeLabel}은 입력한 설명과 가장 가깝게 읽힌 후보입니다.`,
      benefitSummary: getBenefitPath(track, zoneType, verdict),
      recommendedBusinessAngle: getBusinessAngle(track),
      requiredProofs,
      riskNotes,
      nextActions,
      relatedCodes: buildRelatedCodes(suggestions, suggestion),
    }
  })
}

export function getEligibilityStrategyPlan(
  input: EligibilityInput,
  result: EligibilityResult,
): EligibilityStrategyPlan {
  const track = getTrack(input.ksicCode, input.regulatoryFit)
  const codeLabel = `${input.ksicCode.trim()} ${input.ksicName.trim()}`.trim()

  return {
    headline: getStrategyHeadline(input, result),
    recommendedBusinessAngle: getBusinessAngle(track),
    benefitPath: getBenefitPath(track, input.zoneType, result.verdict),
    requiredProofs: unique([
      ...getEvidenceChecklist(track),
      ...getVerdictSpecificProofs(result.verdict),
    ]).slice(0, 4),
    riskNotes: unique([
      ...getVerdictSpecificRiskNotes(result.verdict),
      ...result.reasons.slice(0, 2),
      complianceRiskNote,
    ]).slice(0, 4),
    nextActions: unique([
      ...result.requiredActions.slice(0, 2),
      ...getVerdictSpecificNextActions(codeLabel || '현재 업종', input.zoneType, result.verdict),
    ]).slice(0, 4),
  }
}
