import {
  getKnowledgeCenterCodeOnlyUncertainMatch,
  getKnowledgeCenterExactCodeMatch,
} from '@/features/eligibility/data/knowledge-center-exact-codes'
import { KNOWLEDGE_INDUSTRY_REVIEW_ROWS } from '@/features/eligibility/data/knowledge-industry-review-table'
import { getKsicHierarchyLabelByCode } from '@/features/eligibility/data/magok-code-directory'
import { getPrimaryRegulatoryClauseByCode } from '@/features/eligibility/data/regulatory-clause-resolver'
import {
  KNOWLEDGE_CENTER_EXTRA_RULES,
  MAGOK_INDUSTRIAL_RULES,
  matchIndustryRule,
  normalizeKsicCode,
} from '@/features/eligibility/data/rules'
import type {
  EligibilityInput,
  EligibilityResult,
  RegulatoryFit,
} from '@/features/eligibility/types'

type InsightTone = 'success' | 'warning' | 'danger' | 'muted'

interface InsightField {
  label: string
  value: string
}

export interface EligibilityScreenInsight {
  title: string
  tone: InsightTone
  fields: InsightField[]
  bullets: string[]
}

function getVerdictTone(
  verdict: EligibilityResult['verdict'] | null | undefined,
): InsightTone {
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

function getManualClause(regulatoryFit: RegulatoryFit) {
  if (regulatoryFit === 'higherEducationResearchInstitute') {
    return KNOWLEDGE_INDUSTRY_REVIEW_ROWS[1]
  }

  if (regulatoryFit === 'basicResearchInstitution') {
    return KNOWLEDGE_INDUSTRY_REVIEW_ROWS[2]
  }

  if (regulatoryFit === 'elearningIndustry') {
    return KNOWLEDGE_INDUSTRY_REVIEW_ROWS[25]
  }

  if (regulatoryFit === 'managedTechnicalService') {
    return KNOWLEDGE_INDUSTRY_REVIEW_ROWS[26]
  }

  return null
}

function unique(values: string[]) {
  return [...new Set(values.filter(Boolean))]
}

export function getEligibilityScreenInsight(
  input: EligibilityInput,
  result: EligibilityResult | null,
): EligibilityScreenInsight | null {
  const normalizedCode = normalizeKsicCode(input.ksicCode)
  const tone = getVerdictTone(result?.verdict)

  if (input.zoneType === 'knowledgeIndustryCenter') {
    const exactMatch = getKnowledgeCenterExactCodeMatch(normalizedCode)
    const uncertainMatch = getKnowledgeCenterCodeOnlyUncertainMatch(normalizedCode)
    const clause =
      getManualClause(input.regulatoryFit) ?? getPrimaryRegulatoryClauseByCode(normalizedCode)
    const knowledgeRule = matchIndustryRule(KNOWLEDGE_CENTER_EXTRA_RULES, normalizedCode)
    const industrialRule = matchIndustryRule(MAGOK_INDUSTRIAL_RULES, normalizedCode)

    const fields: InsightField[] = []
    const bullets: string[] = []
    let title = '선택한 업종코드를 화면 기준으로 다시 풀어봤습니다.'

    if (input.ksicCode.trim()) {
      fields.push({ label: '입력 코드', value: input.ksicCode.trim() })
    }

    if (input.ksicName.trim()) {
      fields.push({ label: '입력 업종', value: input.ksicName.trim() })
    }

    if (exactMatch) {
      const kindLabelMap = {
        allowed: '5자리 코드 일치',
        reviewRequired: '5자리 코드 심의 대상',
        conditional: '5자리 코드 조건부 허용',
        additionalCheck: '5자리 코드 추가 확인 필요',
        blocked: '5자리 코드 불가',
      } as const

      fields.push({ label: '판정 기준', value: kindLabelMap[exactMatch.kind] })
      bullets.push(exactMatch.entry.note)

      if (exactMatch.kind === 'allowed') {
        title = '선택한 업종은 5자리 업종코드와 일치합니다.'
        bullets.push('상담에서는 실제 서비스와 산출물을 이 5자리 코드 표현에 맞춰 구체적으로 설명하는 편이 좋습니다.')
      }

      if (exactMatch.kind === 'reviewRequired') {
        title = '선택한 업종은 위원회 심의 여부를 함께 봐야 합니다.'
        bullets.push('심의 대상이면 운영 구조, 인력, 공간 사용 계획까지 같이 설명해야 판단이 빨라집니다.')
      }

      if (exactMatch.kind === 'conditional') {
        title = '선택한 업종은 단독 등록 여부까지 같이 봐야 합니다.'
        bullets.push('조건부 업종은 단독 등록인지, 다른 허용 업종과 함께 영위하는지 분리해 설명하는 편이 안전합니다.')
      }

      if (exactMatch.kind === 'additionalCheck') {
        title = '선택한 업종은 코드만으로 확정하지 않고 추가 확인이 필요합니다.'
        bullets.push('코드가 비슷해 보여도 실제 영위 업무와 증빙이 맞지 않으면 다른 세분류로 해석될 수 있습니다.')
      }

      if (exactMatch.kind === 'blocked') {
        title = '선택한 업종은 마곡 지식산업센터 기준에서 바로 제한됩니다.'
        bullets.push('실제 영위 중인 다른 허용 업종이 있다면 그 코드와 증빙을 다시 확인하는 쪽이 더 현실적입니다.')
      }
    } else if (uncertainMatch) {
      fields.push({ label: '판정 기준', value: '코드만으로 확정 불가' })
      bullets.push(uncertainMatch.note)
      title = '선택한 업종은 운영 주체나 설치 요건까지 같이 확인해야 합니다.'
    } else if (getManualClause(input.regulatoryFit)) {
      fields.push({ label: '판정 기준', value: '수동 법령 분류' })
      title = '선택한 업종은 수동으로 고른 법령 분류 기준까지 함께 봅니다.'
    } else if (knowledgeRule) {
      fields.push({ label: '판정 기준', value: '지식산업센터 특례 코드' })
      bullets.push(knowledgeRule.summary)
      bullets.push('특례 업종은 코드명보다 실제 사업 구조와 입주 목적을 함께 설명해야 설득력이 생깁니다.')
      title = '선택한 업종은 지식산업센터 특례 업종으로 화면에 반영됩니다.'
    } else if (industrialRule) {
      fields.push({ label: '판정 기준', value: '산업시설구역 기본업종 연동' })
      bullets.push(industrialRule.summary)
      bullets.push('산업시설구역에서는 연구개발, 설계, 기술사업화 포인트를 함께 보여주는 편이 유리합니다.')
    }

    if (clause) {
      fields.push({ label: '연결 조문', value: `${clause.articlePath} · ${clause.label}` })
      fields.push({
        label: '현재 KSIC 대응',
        value: getKsicHierarchyLabelByCode(normalizedCode) ?? clause.ksic,
      })
      bullets.push(clause.note)
    }

    if (input.regulatoryFit !== 'auto') {
      const manualLabels: Record<Exclude<RegulatoryFit, 'auto'>, string> = {
        knowledgeIndustry: '지식산업',
        informationIndustry: '정보통신산업',
        otherPermittedIndustry: '기타 시행령 허용업종',
        higherEducationResearchInstitute: '고등교육법 제25조 연구소(2호)',
        basicResearchInstitution: '기초연구법 제14조 기관·단체(3호)',
        elearningIndustry: '이러닝법상 업(26호)',
        managedTechnicalService: '관리기관 인정 업종(27호)',
      }

      fields.push({
        label: '선택한 법령 분류',
        value: manualLabels[input.regulatoryFit],
      })
    }

    if (fields.length === 0 && bullets.length === 0) {
      return null
    }

    return {
      title,
      tone,
      fields,
      bullets: unique(bullets),
    }
  }

  if (input.zoneType === 'industrialFacility') {
    const industrialRule = matchIndustryRule(MAGOK_INDUSTRIAL_RULES, normalizedCode)

    if (!industrialRule && !input.ksicCode.trim() && !input.ksicName.trim()) {
      return null
    }

    const fields: InsightField[] = []
    const bullets: string[] = []
    let title = '선택한 업종을 산업시설구역 기준으로 화면에서 다시 확인했습니다.'

    if (input.ksicCode.trim()) {
      fields.push({ label: '입력 코드', value: input.ksicCode.trim() })
    }

    if (input.ksicName.trim()) {
      fields.push({ label: '입력 업종', value: input.ksicName.trim() })
    }

    if (industrialRule) {
      fields.push({ label: '매칭 그룹', value: `${industrialRule.group} · ${industrialRule.label}` })
      fields.push({ label: '적용 prefix', value: industrialRule.prefixes.join(', ') })
      bullets.push(industrialRule.summary)
      bullets.push('사업계획서에서는 업종명보다 연구개발 목적과 산업단지 기여도를 먼저 설명하는 편이 좋습니다.')
    } else {
      fields.push({ label: '매칭 상태', value: '기본 허용표 미매칭' })
      bullets.push('현재 입력 코드가 산업시설구역 기본 허용 prefix와 직접 매칭되지는 않았습니다.')
      bullets.push('실제 수행 업무가 더 잘 드러나는 세분류 코드나 대체 구역 검토가 필요한지 같이 보세요.')
      title = '선택한 업종은 산업시설구역 기본 허용표와 바로 맞지 않습니다.'
    }

    return {
      title,
      tone,
      fields,
      bullets: unique(bullets),
    }
  }

  if (!result) {
    return null
  }

  return {
    title: '지원시설구역은 별도 지침 확인이 필요한 구간입니다.',
    tone,
    fields: [
      { label: '현재 구역', value: '지원시설구역' },
      { label: '판정 기준', value: '지구단위계획 시행지침 수동 검토' },
    ],
    bullets: unique([
      '지원시설구역은 마곡 지구단위계획 시행지침의 허용용도를 추가로 확인해야 합니다.',
    ]),
  }
}
