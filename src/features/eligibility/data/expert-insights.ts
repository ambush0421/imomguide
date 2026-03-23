import {
  getKnowledgeCenterExactCodeMatch,
} from '@/features/eligibility/data/knowledge-center-exact-codes'
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

type InsightTone = 'success' | 'warning' | 'danger' | 'muted'

export interface ExpertInsightEntry {
  id: string
  title: string
  summary: string
  actionItems: string[]
  riskNotes: string[]
  tone: InsightTone
}

function unique(values: string[]) {
  return [...new Set(values.filter(Boolean))]
}

const complianceRiskNote =
  '실제 하지 않는 업무를 혜택 때문에 추가하면 심사나 사후 확인 단계에서 불리할 수 있습니다.'

function getTone(verdict: EligibilityResult['verdict']): InsightTone {
  if (verdict === 'eligible') {
    return 'success'
  }

  if (verdict === 'conditional' || verdict === 'reviewRequired') {
    return 'warning'
  }

  if (verdict === 'ineligible') {
    return 'danger'
  }

  return 'muted'
}

export function getExpertInsights(
  input: EligibilityInput,
  result: EligibilityResult | null,
): ExpertInsightEntry[] {
  if (!result) {
    return []
  }

  const normalizedCode = normalizeKsicCode(input.ksicCode)
  const industrialRule = matchIndustryRule(MAGOK_INDUSTRIAL_RULES, normalizedCode)
  const knowledgeExtraRule = matchIndustryRule(
    KNOWLEDGE_CENTER_EXTRA_RULES,
    normalizedCode,
  )
  const exactMatch = getKnowledgeCenterExactCodeMatch(normalizedCode)
  const tone = getTone(result.verdict)

  const insights: ExpertInsightEntry[] = []

  if (input.zoneType === 'industrialFacility' && industrialRule) {
    insights.push({
      id: 'industrial-fit',
      title: `${industrialRule.group} 계열 적합도로 읽는 실무 포인트`,
      summary:
        industrialRule.group === '공통'
          ? '공통 허용 업종이라도 실제 입주 단계에서는 연구개발 성격과 산업단지 기여도를 함께 설명해야 안정적입니다.'
          : `${industrialRule.group} 특화 그룹과 직접 연결되는 업종이라, 단순 코드 일치보다도 연구개발·사업화 맥락을 같이 제시할수록 심사 대응력이 높아집니다.`,
      actionItems: unique([
        '사업계획서 첫 문단에서 업종 자체보다 연구개발 목적과 산업단지 적합성을 먼저 설명하세요.',
        industrialRule.group === '공통'
          ? '공통 허용 업종이어도 실제 사용공간, 연구인력, 개발 산출물을 함께 정리해 두는 편이 안전합니다.'
          : `${industrialRule.group} 특화 산업군과 연결되는 제품·서비스 사례를 2~3개 정도 정리하세요.`,
      ]),
      riskNotes: unique([
        input.flags.hasManufacturingFacility
          ? '제조시설을 함께 운영하면 연구시설 비율과 제조시설 상한을 동시에 맞춰야 합니다.'
          : '',
        input.flags.requiresCommitteeReview
          ? '경계 업종으로 설명될 가능성이 있으면 위원회 질의에 대비한 융복합 서술이 필요합니다.'
          : '',
        complianceRiskNote,
      ]),
      tone,
    })
  }

  if (input.zoneType === 'knowledgeIndustryCenter' && exactMatch) {
    const exactLabels = {
      allowed: '5자리 코드 일치',
      reviewRequired: '5자리 코드 심의 대상',
      conditional: '5자리 코드 조건부 허용',
      additionalCheck: '5자리 코드 추가 확인 필요',
      blocked: '5자리 코드 불가',
    } as const

    insights.push({
      id: 'exact-match',
      title: `${exactLabels[exactMatch.kind]} 기준으로 확인한 결과입니다.`,
      summary:
        exactMatch.kind === 'allowed'
          ? '지식산업센터에서는 넓은 업종군 분류보다 5자리 코드 일치가 더 설득력 있습니다. 실제 상담에서도 이 기준을 함께 설명하면 이해를 돕기 좋습니다.'
          : exactMatch.kind === 'blocked'
            ? '불가 코드라도 왜 제외되는지 명확히 설명할 수 있어야 다른 호실, 다른 구역, 융복합 심의 경로 제안으로 대화가 이어집니다.'
            : '5자리 코드 기준은 입주 가능 여부뿐 아니라 어떤 추가 설명이 필요한지도 함께 알려주는 실무 기준입니다.',
      actionItems: unique([
        '상담 화면이나 공유 메모에는 5자리 코드를 그대로 표기해 업종 오해를 줄이세요.',
        exactMatch.entry.note,
        exactMatch.kind === 'allowed'
          ? '실제 매출이 나는 핵심 업무를 이 5자리 코드 표현으로 다시 한 문장 정리해 두세요.'
          : '',
      ]),
      riskNotes: unique([
        exactMatch.kind === 'blocked'
          ? '코드명은 비슷해 보여도 5자리 세분류가 다르면 판정이 크게 달라질 수 있습니다.'
          : '',
        exactMatch.kind === 'conditional' || exactMatch.kind === 'reviewRequired'
          ? '조건부/심의 코드는 단독 등록 여부와 실제 운영 구조를 함께 확인해야 합니다.'
          : '',
        complianceRiskNote,
      ]),
      tone,
    })
  } else if (input.zoneType === 'knowledgeIndustryCenter' && knowledgeExtraRule) {
    insights.push({
      id: 'knowledge-extra',
      title: '지식산업센터 특례 업종으로 읽어야 하는 결과입니다.',
      summary:
        '기본 허용업종이 아니라도 시행령 제6조 제2항~제5항과 마곡 고시문 예외 허용 문구를 함께 읽으면 검토 논리가 생깁니다.',
      actionItems: [
        '코드 설명보다 실제 사업 구조가 왜 지식산업센터 취지와 맞는지 먼저 정리하세요.',
        '부동산·신탁 계열은 단독 등록 여부와 실제 운영 목적을 분리해서 설명해야 합니다.',
      ],
      riskNotes: [
        '지식산업센터 특례 업종은 서류에서 설치·운영 목적이 흐리면 보수적으로 해석될 수 있습니다.',
        complianceRiskNote,
      ],
      tone,
    })
  }

  if (input.applicantType === 'universityLab' || input.applicantType === 'publicInstitution' || input.applicantType === 'publicRelatedOrg') {
    insights.push({
      id: 'special-applicant',
      title: '신청 주체 설명이 판정보다 중요할 수 있습니다.',
      summary:
        '대학, 공공기관, 공직유관단체는 업종 코드만 맞아도 곧바로 확정되기보다 기관 성격과 입주 목적을 함께 설명해야 심의 대응력이 올라갑니다.',
      actionItems: [
        '기관 설치 근거, 수행 사업, 산업단지 기여 포인트를 1장 요약으로 정리하세요.',
        '입주 목적이 연구개발 생태계 조성인지, 지원기관 역할인지 문장으로 분명히 쓰세요.',
      ],
      riskNotes: [
        '기관 성격이 모호하면 일반 기업보다 더 엄격하게 추가 증빙을 요구받을 수 있습니다.',
        complianceRiskNote,
      ],
      tone: 'warning',
    })
  }

  if (insights.length === 0) {
    insights.push({
      id: 'default',
      title: '이번 결과는 코드 일치만이 아니라 실제 사업 설명까지 함께 봐야 합니다.',
      summary:
        '마곡 판정은 코드 매칭으로 시작하지만, 최종 검토에서는 실제 사업 내용과 공간 사용 계획이 함께 읽힙니다.',
      actionItems: [
        '업종명, 실제 서비스 설명, 사용할 공간 구성을 한 문단으로 정리해 두세요.',
        '비슷한 KSIC 코드 후보가 있다면 더 좁은 세분류로 다시 비교해 보는 편이 좋습니다.',
      ],
      riskNotes: [
        '입주 상담 단계에서는 한 줄 업종명보다 구체적인 운영 시나리오가 더 큰 영향을 줄 수 있습니다.',
        complianceRiskNote,
      ],
      tone,
    })
  }

  return insights.slice(0, 2)
}
