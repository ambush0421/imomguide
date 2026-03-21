import {
  MAGOK_CODE_DIRECTORY,
  getDirectoryVerdictWeight,
} from '@/features/eligibility/data/magok-code-directory'
import { legalBasesFromIds } from '@/features/eligibility/data/legal-bases'
import type {
  DirectoryZoneType,
  LegalBasis,
  MagokCodeDirectoryEntry,
  Verdict,
} from '@/features/eligibility/types'
import { formatVerdictLabel } from '@/utils/format'

export interface GuideZoneSummary {
  zoneType: DirectoryZoneType
  zoneLabel: string
  verdict: Verdict
  verdictLabel: string
  reason: string
  notes: string[]
  legalBases: LegalBasis[]
}

export interface GuideFaqItem {
  id: string
  question: string
  answer: string
}

export interface GuideFaqIndexEntry extends GuideFaqItem {
  guideCode: string
  guideTitle: string
  slug: string
  faqSlug: string
  faqPath: string
  updatedAt: string
}

export interface GuideRelatedCode {
  code: string
  name: string
}

export interface MagokGuideEntry {
  code: string
  slug: string
  title: string
  name: string
  updatedAt: string
  browseCategory: string
  sectionName: string
  summary: string
  recommendedZoneType: DirectoryZoneType
  recommendedZoneLabel: string
  zoneSummaries: GuideZoneSummary[]
  highlights: string[]
  faq: GuideFaqItem[]
  legalBases: LegalBasis[]
  relatedCodes: GuideRelatedCode[]
}

const GUIDE_UPDATED_AT = '2026-03-20'

const FEATURED_GUIDE_CODES = [
  '71310',
  '72121',
  '63111',
  '63112',
  '70201',
  '72922',
] as const

const zoneLabels: Record<DirectoryZoneType, string> = {
  industrialFacility: '산업시설구역',
  knowledgeIndustryCenter: '지식산업센터',
}

const zoneOrder: DirectoryZoneType[] = [
  'knowledgeIndustryCenter',
  'industrialFacility',
]

function dedupeLegalBases(legalBases: LegalBasis[]) {
  const seen = new Set<string>()

  return legalBases.filter((basis) => {
    if (seen.has(basis.id)) {
      return false
    }

    seen.add(basis.id)
    return true
  })
}

function isReviewableVerdict(verdict: Verdict) {
  return verdict !== 'ineligible'
}

function isGuideCandidate(entry: MagokCodeDirectoryEntry) {
  return zoneOrder.some((zoneType) =>
    isReviewableVerdict(entry.zoneVerdicts[zoneType].verdict),
  )
}

function getPrimaryZoneType(entry: MagokCodeDirectoryEntry) {
  return zoneOrder
    .slice()
    .sort((left, right) => {
      const leftWeight = getDirectoryVerdictWeight(entry.zoneVerdicts[left].verdict)
      const rightWeight = getDirectoryVerdictWeight(entry.zoneVerdicts[right].verdict)

      if (leftWeight !== rightWeight) {
        return rightWeight - leftWeight
      }

      return zoneOrder.indexOf(left) - zoneOrder.indexOf(right)
    })[0]
}

function appendRoParticle(word: string) {
  const lastChar = word.at(-1)

  if (!lastChar) {
    return word
  }

  const codePoint = lastChar.charCodeAt(0)

  if (codePoint < 0xac00 || codePoint > 0xd7a3) {
    return `${word}으로`
  }

  const jongseong = (codePoint - 0xac00) % 28

  if (jongseong === 0 || jongseong === 8) {
    return `${word}로`
  }

  return `${word}으로`
}

function buildZoneSummary(
  entry: MagokCodeDirectoryEntry,
  zoneType: DirectoryZoneType,
): GuideZoneSummary {
  const zoneVerdict = entry.zoneVerdicts[zoneType]

  return {
    zoneType,
    zoneLabel: zoneLabels[zoneType],
    verdict: zoneVerdict.verdict,
    verdictLabel: formatVerdictLabel(zoneVerdict.verdict),
    reason: zoneVerdict.reason,
    notes: zoneVerdict.notes,
    legalBases: legalBasesFromIds(zoneVerdict.legalBasisIds),
  }
}

function buildGuideSummary(
  entry: MagokCodeDirectoryEntry,
  primaryZoneSummary: GuideZoneSummary,
  otherZoneSummary: GuideZoneSummary,
) {
  return `${entry.name}(${entry.code})는 ${primaryZoneSummary.zoneLabel} 기준 ${appendRoParticle(primaryZoneSummary.verdictLabel)} 먼저 검토되며, ${otherZoneSummary.zoneLabel}에서는 ${appendRoParticle(otherZoneSummary.verdictLabel)} 정리됩니다.`
}

function buildGuideHighlights(
  primaryZoneSummary: GuideZoneSummary,
  otherZoneSummary: GuideZoneSummary,
) {
  const highlights = [
    `${primaryZoneSummary.zoneLabel} 기준 핵심 포인트: ${primaryZoneSummary.reason}`,
  ]

  if (primaryZoneSummary.notes[0]) {
    highlights.push(primaryZoneSummary.notes[0])
  }

  if (
    otherZoneSummary.verdict !== primaryZoneSummary.verdict ||
    otherZoneSummary.reason !== primaryZoneSummary.reason
  ) {
    highlights.push(
      `${otherZoneSummary.zoneLabel} 비교 포인트: ${otherZoneSummary.reason}`,
    )
  }

  return [...new Set(highlights)].slice(0, 3)
}

function buildGuideFaq(
  entry: MagokCodeDirectoryEntry,
  primaryZoneSummary: GuideZoneSummary,
  otherZoneSummary: GuideZoneSummary,
  legalBases: LegalBasis[],
): GuideFaqItem[] {
  const legalBasisText = legalBases
    .slice(0, 2)
    .map((basis) => basis.citation)
    .join(', ')

  const additionalCheckText =
    primaryZoneSummary.notes[0] ??
    otherZoneSummary.notes[0] ??
    '세부 사업 내용과 제출 서류를 함께 검토하는 편이 안전합니다.'

  return [
    {
      id: `${entry.code}-faq-1`,
      question: `${entry.code} ${entry.name} 업종은 마곡에서 가능한가요?`,
      answer: `${buildGuideSummary(entry, primaryZoneSummary, otherZoneSummary)} 현재 화면 기준으로는 ${primaryZoneSummary.zoneLabel} 우선 검토가 적합합니다.`,
    },
    {
      id: `${entry.code}-faq-2`,
      question: `${entry.name} 업종은 왜 ${primaryZoneSummary.verdictLabel} 판정을 받나요?`,
      answer: `${primaryZoneSummary.reason} 근거는 ${legalBasisText || '마곡 관리기본계획과 시행령 연결 기준'}를 먼저 보면 됩니다.`,
    },
    {
      id: `${entry.code}-faq-3`,
      question: `${entry.name} 업종은 무엇을 추가로 확인하면 좋나요?`,
      answer: `${additionalCheckText} ${otherZoneSummary.zoneLabel} 비교 결과도 함께 보고 구역 선택 전략을 정하는 편이 좋습니다.`,
    },
  ]
}

function buildRelatedCodes(entry: MagokCodeDirectoryEntry) {
  return MAGOK_CODE_DIRECTORY.filter((candidate) => {
    if (candidate.code === entry.code) {
      return false
    }

    if (!isGuideCandidate(candidate)) {
      return false
    }

    return (
      candidate.browseCategory === entry.browseCategory ||
      candidate.groupCode === entry.groupCode
    )
  })
    .sort((left, right) => {
      const leftWeight = Math.max(
        getDirectoryVerdictWeight(left.zoneVerdicts.knowledgeIndustryCenter.verdict),
        getDirectoryVerdictWeight(left.zoneVerdicts.industrialFacility.verdict),
      )
      const rightWeight = Math.max(
        getDirectoryVerdictWeight(right.zoneVerdicts.knowledgeIndustryCenter.verdict),
        getDirectoryVerdictWeight(right.zoneVerdicts.industrialFacility.verdict),
      )

      if (leftWeight !== rightWeight) {
        return rightWeight - leftWeight
      }

      return left.code.localeCompare(right.code, 'ko')
    })
    .slice(0, 4)
    .map((candidate) => ({
      code: candidate.code,
      name: candidate.name,
    }))
}

function buildGuideEntry(entry: MagokCodeDirectoryEntry): MagokGuideEntry {
  const primaryZoneType = getPrimaryZoneType(entry)
  const primaryZoneSummary = buildZoneSummary(entry, primaryZoneType)
  const otherZoneType = zoneOrder.find((zoneType) => zoneType !== primaryZoneType)!
  const otherZoneSummary = buildZoneSummary(entry, otherZoneType)
  const legalBases = dedupeLegalBases([
    ...primaryZoneSummary.legalBases,
    ...otherZoneSummary.legalBases,
  ])

  return {
    code: entry.code,
    slug: entry.code,
    title: `${entry.code} ${entry.name} 마곡 입주 가이드`,
    name: entry.name,
    updatedAt: GUIDE_UPDATED_AT,
    browseCategory: entry.browseCategory,
    sectionName: entry.sectionName,
    summary: buildGuideSummary(entry, primaryZoneSummary, otherZoneSummary),
    recommendedZoneType: primaryZoneType,
    recommendedZoneLabel: zoneLabels[primaryZoneType],
    zoneSummaries: [primaryZoneSummary, otherZoneSummary],
    highlights: buildGuideHighlights(primaryZoneSummary, otherZoneSummary),
    faq: buildGuideFaq(entry, primaryZoneSummary, otherZoneSummary, legalBases),
    legalBases,
    relatedCodes: buildRelatedCodes(entry),
  }
}

export const MAGOK_GUIDE_CATALOG = MAGOK_CODE_DIRECTORY.filter(isGuideCandidate)
  .map(buildGuideEntry)
  .sort((left, right) => left.code.localeCompare(right.code, 'ko'))

export const MAGOK_GUIDE_CATALOG_BY_CODE = new Map(
  MAGOK_GUIDE_CATALOG.map((entry) => [entry.code, entry]),
)

export const FEATURED_GUIDE_ENTRIES = FEATURED_GUIDE_CODES.map((code) =>
  MAGOK_GUIDE_CATALOG_BY_CODE.get(code),
).filter((entry): entry is MagokGuideEntry => Boolean(entry))

export function getGuideEntryByCode(code: string) {
  return MAGOK_GUIDE_CATALOG_BY_CODE.get(code.trim()) ?? null
}

export function getFeaturedGuideEntries(limit = 3) {
  return FEATURED_GUIDE_ENTRIES.slice(0, limit)
}

export function getGuideFaqIndex() {
  return MAGOK_GUIDE_CATALOG.flatMap((entry) =>
    entry.faq.map((faq) => ({
      ...faq,
      guideCode: entry.code,
      guideTitle: entry.title,
      slug: entry.slug,
      faqSlug: faq.id,
      faqPath: `/faq/${faq.id}/`,
      updatedAt: entry.updatedAt,
    })),
  )
}
