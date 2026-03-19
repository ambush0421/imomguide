import {
  getKnowledgeCenterCodeOnlyUncertainMatch,
  getKnowledgeCenterExactCodeMatch,
} from '@/features/eligibility/data/knowledge-center-exact-codes'
import { KNOWLEDGE_INDUSTRY_REVIEW_ROWS } from '@/features/eligibility/data/knowledge-industry-review-table'
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

function getClauseByCode(normalizedCode: string) {
  if (!normalizedCode) {
    return null
  }

  if (normalizedCode.startsWith('70')) {
    return KNOWLEDGE_INDUSTRY_REVIEW_ROWS[0]
  }

  if (normalizedCode.startsWith('72')) {
    return KNOWLEDGE_INDUSTRY_REVIEW_ROWS[3]
  }

  if (normalizedCode === '71392') {
    return KNOWLEDGE_INDUSTRY_REVIEW_ROWS[4]
  }

  if (normalizedCode.startsWith('5911')) {
    return KNOWLEDGE_INDUSTRY_REVIEW_ROWS[5]
  }

  if (normalizedCode.startsWith('58')) {
    return KNOWLEDGE_INDUSTRY_REVIEW_ROWS[6]
  }

  if (normalizedCode.startsWith('7320')) {
    return KNOWLEDGE_INDUSTRY_REVIEW_ROWS[7]
  }

  if (normalizedCode === '75994') {
    return KNOWLEDGE_INDUSTRY_REVIEW_ROWS[8]
  }

  if (normalizedCode.startsWith('85')) {
    return KNOWLEDGE_INDUSTRY_REVIEW_ROWS[9]
  }

  if (normalizedCode === '71531') {
    return KNOWLEDGE_INDUSTRY_REVIEW_ROWS[10]
  }

  if (normalizedCode === '73902') {
    return KNOWLEDGE_INDUSTRY_REVIEW_ROWS[11]
  }

  if (normalizedCode === '75992') {
    return KNOWLEDGE_INDUSTRY_REVIEW_ROWS[12]
  }

  if (normalizedCode.startsWith('3900')) {
    return KNOWLEDGE_INDUSTRY_REVIEW_ROWS[13]
  }

  if (normalizedCode === '59120') {
    return KNOWLEDGE_INDUSTRY_REVIEW_ROWS[14]
  }

  if (normalizedCode === '59201') {
    return KNOWLEDGE_INDUSTRY_REVIEW_ROWS[15]
  }

  if (normalizedCode === '71400') {
    return KNOWLEDGE_INDUSTRY_REVIEW_ROWS[16]
  }

  if (normalizedCode === '73903') {
    return KNOWLEDGE_INDUSTRY_REVIEW_ROWS[17]
  }

  if (normalizedCode === '73904') {
    return KNOWLEDGE_INDUSTRY_REVIEW_ROWS[18]
  }

  if (normalizedCode === '76400') {
    return KNOWLEDGE_INDUSTRY_REVIEW_ROWS[19]
  }

  if (normalizedCode === '71310') {
    return KNOWLEDGE_INDUSTRY_REVIEW_ROWS[20]
  }

  if (normalizedCode === '71391') {
    return KNOWLEDGE_INDUSTRY_REVIEW_ROWS[21]
  }

  if (normalizedCode === '74100') {
    return KNOWLEDGE_INDUSTRY_REVIEW_ROWS[22]
  }

  if (normalizedCode === '75320') {
    return KNOWLEDGE_INDUSTRY_REVIEW_ROWS[23]
  }

  if (normalizedCode === '75991') {
    return KNOWLEDGE_INDUSTRY_REVIEW_ROWS[24]
  }

  if (['73901', '73905', '73909'].includes(normalizedCode)) {
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
    const clause = getManualClause(input.regulatoryFit) ?? getClauseByCode(normalizedCode)
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
        allowed: 'exact 5자리 허용 코드',
        reviewRequired: 'exact 5자리 심의 코드',
        conditional: 'exact 5자리 조건부 코드',
        additionalCheck: 'exact 5자리 추가 확인 코드',
        blocked: 'exact 5자리 불가 코드',
      } as const

      fields.push({ label: '판정 기준', value: kindLabelMap[exactMatch.kind] })
      bullets.push(exactMatch.entry.note)

      if (exactMatch.kind === 'allowed') {
        title = '선택한 업종은 exact 5자리 기준으로 바로 대조됩니다.'
      }

      if (exactMatch.kind === 'reviewRequired') {
        title = '선택한 업종은 위원회 심의 여부를 함께 봐야 합니다.'
      }

      if (exactMatch.kind === 'conditional') {
        title = '선택한 업종은 단독 등록 여부까지 같이 봐야 합니다.'
      }

      if (exactMatch.kind === 'additionalCheck') {
        title = '선택한 업종은 코드만으로 확정하지 않고 추가 확인이 필요합니다.'
      }

      if (exactMatch.kind === 'blocked') {
        title = '선택한 업종은 마곡 지식산업센터 기준에서 바로 제한됩니다.'
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
      title = '선택한 업종은 지식산업센터 특례 업종으로 화면에 반영됩니다.'
    } else if (industrialRule) {
      fields.push({ label: '판정 기준', value: '산업시설구역 기본업종 연동' })
      bullets.push(industrialRule.summary)
    }

    if (clause) {
      fields.push({ label: '연결 조문', value: `${clause.clause} · ${clause.label}` })
      fields.push({ label: '현재 KSIC 대응', value: clause.ksic })
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
    } else {
      fields.push({ label: '매칭 상태', value: '기본 허용표 미매칭' })
      bullets.push('현재 입력 코드가 산업시설구역 기본 허용 prefix와 직접 매칭되지는 않았습니다.')
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
