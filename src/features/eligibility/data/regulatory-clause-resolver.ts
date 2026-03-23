import {
  INFORMATION_INDUSTRY_REVIEW_ROWS,
} from '@/features/eligibility/data/information-industry-review-table'
import {
  KNOWLEDGE_INDUSTRY_REVIEW_ROWS,
  type KnowledgeIndustryReviewRow,
} from '@/features/eligibility/data/knowledge-industry-review-table'

export type RegulatoryClauseRow = KnowledgeIndustryReviewRow

export function getInformationIndustryClauseByCode(normalizedCode: string) {
  if (!normalizedCode) {
    return null
  }

  if (normalizedCode.startsWith('62')) {
    return INFORMATION_INDUSTRY_REVIEW_ROWS[0]
  }

  if (normalizedCode.startsWith('582')) {
    return INFORMATION_INDUSTRY_REVIEW_ROWS[1]
  }

  if (normalizedCode.startsWith('6311')) {
    return INFORMATION_INDUSTRY_REVIEW_ROWS[2]
  }

  if (
    normalizedCode === '63120' ||
    normalizedCode === '63991' ||
    normalizedCode === '63999'
  ) {
    return INFORMATION_INDUSTRY_REVIEW_ROWS[3]
  }

  if (normalizedCode.startsWith('612')) {
    return INFORMATION_INDUSTRY_REVIEW_ROWS[4]
  }

  return null
}

export function getKnowledgeIndustryClauseByCode(normalizedCode: string) {
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

  if (normalizedCode.startsWith('581')) {
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

export function getPrimaryRegulatoryClauseByCode(normalizedCode: string) {
  return (
    getInformationIndustryClauseByCode(normalizedCode) ??
    getKnowledgeIndustryClauseByCode(normalizedCode)
  )
}
