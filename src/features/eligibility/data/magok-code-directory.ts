import ksic11Raw from '../../../../ksic11.txt?raw'

import {
  type KnowledgeCenterCatalogEntry,
  KNOWLEDGE_CENTER_CATALOG_ENTRIES,
  getKnowledgeCenterCodeOnlyUncertainMatch,
  getKnowledgeCenterExactCodeMatch,
} from '@/features/eligibility/data/knowledge-center-exact-codes'
import {
  KNOWLEDGE_CENTER_EXTRA_RULES,
  MAGOK_INDUSTRIAL_RULES,
  matchIndustryRule,
} from '@/features/eligibility/data/rules'
import { getInformationIndustryClauseByCode } from '@/features/eligibility/data/regulatory-clause-resolver'
import type {
  DirectoryZoneType,
  MagokCodeDirectoryEntry,
  MagokDirectoryZoneVerdict,
  Verdict,
} from '@/features/eligibility/types'

interface ParsedKsicEntry {
  code: string
  name: string
  sectionCode: string
  sectionName: string
  divisionCode: string
  divisionName: string
  groupCode: string
  groupName: string
  categoryCode: string
  categoryName: string
}

interface KsicSectionMeta {
  code: string
  name: string
  min: number
  max: number
}

export interface CodeDirectoryFilterOptions {
  query: string
  zoneType: DirectoryZoneType
  verdict: Verdict | 'all'
  sectionCode: string
  browseCategory: string
}

const KSIC_SECTION_META: KsicSectionMeta[] = [
  { code: 'A', name: '농업, 임업 및 어업', min: 1, max: 3 },
  { code: 'B', name: '광업', min: 5, max: 8 },
  { code: 'C', name: '제조업', min: 10, max: 34 },
  { code: 'D', name: '전기, 가스, 증기 및 공기조절 공급업', min: 35, max: 35 },
  { code: 'E', name: '수도, 하수 및 폐기물 처리, 원료 재생업', min: 36, max: 39 },
  { code: 'F', name: '건설업', min: 41, max: 42 },
  { code: 'G', name: '도매 및 소매업', min: 45, max: 47 },
  { code: 'H', name: '운수 및 창고업', min: 49, max: 52 },
  { code: 'I', name: '숙박 및 음식점업', min: 55, max: 56 },
  { code: 'J', name: '정보통신업', min: 58, max: 63 },
  { code: 'K', name: '금융 및 보험업', min: 64, max: 66 },
  { code: 'L', name: '부동산업', min: 68, max: 68 },
  { code: 'M', name: '전문, 과학 및 기술 서비스업', min: 70, max: 73 },
  { code: 'N', name: '사업시설 관리, 사업 지원 및 임대 서비스업', min: 74, max: 76 },
  { code: 'O', name: '공공 행정, 국방 및 사회보장 행정', min: 84, max: 84 },
  { code: 'P', name: '교육 서비스업', min: 85, max: 85 },
  { code: 'Q', name: '보건업 및 사회복지 서비스업', min: 86, max: 87 },
  { code: 'R', name: '예술, 스포츠 및 여가관련 서비스업', min: 90, max: 91 },
  { code: 'S', name: '협회 및 단체, 수리 및 기타 개인 서비스업', min: 94, max: 96 },
  {
    code: 'T',
    name: '가구 내 고용활동 및 달리 분류되지 않은 자가 소비 생산활동',
    min: 97,
    max: 98,
  },
  { code: 'U', name: '국제 및 외국기관', min: 99, max: 99 },
]

const DIVISION_NAME_OVERRIDES: Record<string, string> = {
  '24': '1차 금속 제조업',
}

const GROUP_NAME_OVERRIDES: Record<string, string> = {
  '242': '1차 비철금속 제조업',
}

const CATEGORY_NAME_OVERRIDES: Record<string, string> = {
  '2221': '1차 플라스틱제품 제조업',
  '2421': '1차 비철금속 제조업',
  '4672': '1차 금속제품 및 금속광물 도매업',
}

const categoryEntryMap = new Map(
  KNOWLEDGE_CENTER_CATALOG_ENTRIES.filter((entry) => /^\d{5}$/.test(entry.code)).map(
    (entry) => [entry.code, entry],
  ),
)

function normalizeText(value: string) {
  return value.toLowerCase().replace(/[\s"'`~!@#$%^&*()\-_=+[\]{};:,.<>/?\\|·ㆍ]/g, '')
}

function compactText(value: string) {
  return value.replace(/\s+/g, ' ').trim()
}

function getSectionFromDivision(divisionCode: string) {
  const numericCode = Number.parseInt(divisionCode, 10)

  return (
    KSIC_SECTION_META.find(
      (section) => numericCode >= section.min && numericCode <= section.max,
    ) ?? null
  )
}

function parseCodeMap(raw: string, digits: 2 | 3 | 4 | 5) {
  const pattern = new RegExp(`^(\\d{${digits}})(?!\\d)\\s*([가-힣A-Za-z].+)$`)
  const entries = new Map<string, string>()

  for (const line of raw.split(/\r?\n/)) {
    const trimmedLine = line.trim()

    if (!trimmedLine) {
      continue
    }

    const matched = trimmedLine.match(pattern)

    if (!matched) {
      continue
    }

    const [, code, name] = matched

    if (!entries.has(code)) {
      entries.set(code, compactText(name))
    }
  }

  return entries
}

function parseKsicMaster(raw: string) {
  const normalizedRaw = raw.replace(/^\uFEFF/, '')
  const divisions = parseCodeMap(normalizedRaw, 2)
  const groups = parseCodeMap(normalizedRaw, 3)
  const categories = parseCodeMap(normalizedRaw, 4)
  const exactCodes = parseCodeMap(normalizedRaw, 5)

  return [...exactCodes.entries()]
    .map<ParsedKsicEntry | null>(([code, name]) => {
      const divisionCode = code.slice(0, 2)
      const groupCode = code.slice(0, 3)
      const categoryCode = code.slice(0, 4)
      const section = getSectionFromDivision(divisionCode)

      if (!section) {
        return null
      }

      const divisionName =
        DIVISION_NAME_OVERRIDES[divisionCode] ?? divisions.get(divisionCode) ?? ''
      const groupName = GROUP_NAME_OVERRIDES[groupCode] ?? groups.get(groupCode) ?? ''
      const categoryName =
        CATEGORY_NAME_OVERRIDES[categoryCode] ?? categories.get(categoryCode) ?? ''

      return {
        code,
        name,
        sectionCode: section.code,
        sectionName: section.name,
        divisionCode,
        divisionName,
        groupCode,
        groupName,
        categoryCode,
        categoryName,
      }
    })
    .filter((entry): entry is ParsedKsicEntry => {
      return Boolean(
        entry &&
          entry.divisionName &&
          entry.groupName &&
          entry.categoryName &&
          entry.sectionName,
      )
    })
    .sort((left, right) => left.code.localeCompare(right.code, 'ko'))
}

function buildSearchKeywords(
  entry: ParsedKsicEntry,
  browseCategory: string,
  zoneVerdicts: MagokCodeDirectoryEntry['zoneVerdicts'],
) {
  return [
    entry.code,
    entry.name,
    entry.sectionCode,
    entry.sectionName,
    entry.divisionCode,
    entry.divisionName,
    entry.groupCode,
    entry.groupName,
    entry.categoryCode,
    entry.categoryName,
    browseCategory,
    zoneVerdicts.industrialFacility.reason,
    zoneVerdicts.knowledgeIndustryCenter.reason,
    ...zoneVerdicts.industrialFacility.notes,
    ...zoneVerdicts.knowledgeIndustryCenter.notes,
  ].filter(Boolean)
}

function buildIndustrialZoneVerdict(code: string): MagokDirectoryZoneVerdict {
  const matchedRule = matchIndustryRule(MAGOK_INDUSTRIAL_RULES, code)

  if (!matchedRule) {
    return {
      verdict: 'ineligible',
      reason: '마곡 산업시설구역의 명시 허용 업종표에 직접 들어가지 않는 코드입니다.',
      legalBasisIds: ['magokIndustrialPlan'],
      notes: [
        '산업시설구역은 관리기본계획에 적힌 허용 그룹과 prefix에 속한 업종만 기본 허용으로 봅니다.',
      ],
    }
  }

  const notes = [matchedRule.summary]
  let reason = `${matchedRule.label} 허용 그룹에 포함되는 코드입니다.`

  if (code.startsWith('582')) {
    reason =
      'KSIC상 58 출판업 하위의 582 소프트웨어 개발 및 공급업으로, 마곡 산업시설구역 IT 허용군에 포함되는 코드입니다.'
    notes.unshift(
      '게임·시스템·응용 소프트웨어 계열은 KSIC 체계상 58 출판업 아래에 놓이지만, 실질 업종은 582 소프트웨어 개발 및 공급업으로 보는 편이 정확합니다.',
    )
  }

  if (code.startsWith('70')) {
    notes.push(
      '대학·대학부설연구소나 공공기관 성격이면 실제 입주 단계에서 심의가 추가될 수 있습니다.',
    )
  }

  return {
    verdict: 'eligible',
    reason,
    legalBasisIds: matchedRule.legalBasisIds,
    notes,
  }
}

function buildKnowledgeZoneVerdict(
  code: string,
  categoryEntry: KnowledgeCenterCatalogEntry | undefined,
): MagokDirectoryZoneVerdict {
  const exactMatch = getKnowledgeCenterExactCodeMatch(code)
  const informationClause = getInformationIndustryClauseByCode(code)

  if (exactMatch) {
    if (exactMatch.kind === 'allowed') {
      if (informationClause) {
        return {
          verdict: 'eligible',
          reason: `${informationClause.label}으로서 ${informationClause.articlePath}와 연결되는 5자리 코드입니다.`,
          legalBasisIds: ['magokKnowledgeCenterExtra', informationClause.legalBasisId],
          notes: [
            exactMatch.entry.note ||
              'KSIC 체계상 58 출판업 하위에 놓이더라도, 대표 법령 연결은 소프트웨어 개발 및 공급업 기준으로 보는 편이 정확합니다.',
          ],
        }
      }

      return {
        verdict: 'eligible',
        reason: '지식산업센터 5자리 코드 기준에서 바로 허용되는 업종입니다.',
        legalBasisIds: ['magokKnowledgeCenterExtra', 'decreeKnowledgeIndustry'],
        notes: [exactMatch.entry.note],
      }
    }

    if (exactMatch.kind === 'reviewRequired') {
      if (informationClause) {
        return {
          verdict: 'reviewRequired',
          reason: `${informationClause.label} 범위이지만 지식산업센터에서 위원회 심의가 필요한 코드입니다.`,
          legalBasisIds: [
            'magokKnowledgeCenterExtra',
            informationClause.legalBasisId,
            'magokConvergenceReview',
          ],
          notes: [exactMatch.entry.note],
        }
      }

      return {
        verdict: 'reviewRequired',
        reason: '지식산업센터에서 위원회 심의가 필요한 코드입니다.',
        legalBasisIds: ['magokKnowledgeCenterExtra', 'magokConvergenceReview'],
        notes: [exactMatch.entry.note],
      }
    }

    if (exactMatch.kind === 'conditional') {
      return {
        verdict: 'conditional',
        reason: '입주는 검토 가능하지만 단독 등록 제한이나 추가 요건이 붙는 코드입니다.',
        legalBasisIds: ['magokKnowledgeCenterExtra', 'decreeOtherIndustry'],
        notes: [exactMatch.entry.note],
      }
    }

    if (exactMatch.kind === 'additionalCheck') {
      return {
        verdict: 'insufficient',
        reason: '코드만으로는 자동 확정하기 어려워 관리기관 또는 세부 실무 내용을 더 확인해야 합니다.',
        legalBasisIds: ['magokKnowledgeCenterExtra', 'decreeDiscretion'],
        notes: [exactMatch.entry.note],
      }
    }

    return {
      verdict: 'ineligible',
      reason: '지식산업센터에서 명시적으로 제외하거나 불가로 정리된 코드입니다.',
      legalBasisIds: ['magokKnowledgeCenterExceptions', 'decreeOtherIndustry'],
      notes: [exactMatch.entry.note],
    }
  }

  const codeOnlyUncertain = getKnowledgeCenterCodeOnlyUncertainMatch(code)

  if (codeOnlyUncertain) {
    return {
      verdict: 'insufficient',
      reason: '시행령 조문에는 연결되지만 코드만으로 자동 허용을 확정하기 어려운 범위입니다.',
      legalBasisIds: ['decreeKnowledgeIndustry', 'decreeDiscretion'],
      notes: [codeOnlyUncertain.note],
    }
  }

  const industrialRule = matchIndustryRule(MAGOK_INDUSTRIAL_RULES, code)

  if (industrialRule) {
    return {
      verdict: 'eligible',
      reason: '마곡 기본 입주업종에 포함되어 지식산업센터에서도 함께 검토 가능한 코드입니다.',
      legalBasisIds: [...industrialRule.legalBasisIds, 'magokKnowledgeCenterExtra'],
      notes: [industrialRule.summary],
    }
  }

  const extraRule = matchIndustryRule(KNOWLEDGE_CENTER_EXTRA_RULES, code)

  if (extraRule) {
    return {
      verdict: 'conditional',
      reason: '지식산업센터 특례 업종으로 분류되지만 다른 허용 업종과 함께 보거나 추가 요건을 확인해야 합니다.',
      legalBasisIds: extraRule.legalBasisIds,
      notes: [extraRule.summary],
    }
  }

  return {
    verdict: 'ineligible',
    reason: '현재 마곡 지식산업센터 허용 코드표와 조문 대응표에서 직접 확인되지 않는 코드입니다.',
    legalBasisIds: ['magokKnowledgeCenterExtra'],
    notes: [
      categoryEntry?.note ??
        '지식산업센터는 관리기본계획 기본 업종과 시행령 제6조제2항부터 제5항의 연결 범위 안에서만 기본 검토합니다.',
    ],
  }
}

function getBrowseCategory(
  parsedEntry: ParsedKsicEntry,
  categoryEntry: KnowledgeCenterCatalogEntry | undefined,
) {
  const industrialRule = matchIndustryRule(MAGOK_INDUSTRIAL_RULES, parsedEntry.code)

  if (categoryEntry) {
    return categoryEntry.category
  }

  if (industrialRule) {
    return `${industrialRule.group} 허용군`
  }

  return parsedEntry.sectionName
}

function buildDirectory() {
  const parsedEntries = parseKsicMaster(ksic11Raw)

  return parsedEntries.map<MagokCodeDirectoryEntry>((parsedEntry) => {
    const categoryEntry = categoryEntryMap.get(parsedEntry.code)
    const browseCategory = getBrowseCategory(parsedEntry, categoryEntry)
    const zoneVerdicts = {
      industrialFacility: buildIndustrialZoneVerdict(parsedEntry.code),
      knowledgeIndustryCenter: buildKnowledgeZoneVerdict(parsedEntry.code, categoryEntry),
    }

    return {
      ...parsedEntry,
      browseCategory,
      zoneVerdicts,
      searchKeywords: buildSearchKeywords(parsedEntry, browseCategory, zoneVerdicts),
    }
  })
}

export const MAGOK_CODE_DIRECTORY = buildDirectory()

export const MAGOK_CODE_DIRECTORY_BY_CODE = new Map(
  MAGOK_CODE_DIRECTORY.map((entry) => [entry.code, entry]),
)

export const MAGOK_CODE_DIRECTORY_TOTAL_COUNT = MAGOK_CODE_DIRECTORY.length

export const MAGOK_CODE_DIRECTORY_SECTION_OPTIONS = [
  ...new Map(
    MAGOK_CODE_DIRECTORY.map((entry) => [
      entry.sectionCode,
      { code: entry.sectionCode, name: entry.sectionName },
    ]),
  ).values(),
]

export const MAGOK_CODE_DIRECTORY_CATEGORY_OPTIONS = [
  ...new Set(MAGOK_CODE_DIRECTORY.map((entry) => entry.browseCategory)),
].sort((left, right) => left.localeCompare(right, 'ko'))

export function getMagokCodeDirectoryEntry(code: string) {
  return MAGOK_CODE_DIRECTORY_BY_CODE.get(code) ?? null
}

export function formatKsicHierarchyLabel(entry: Pick<
  MagokCodeDirectoryEntry,
  | 'sectionCode'
  | 'sectionName'
  | 'divisionCode'
  | 'divisionName'
  | 'groupCode'
  | 'groupName'
  | 'categoryCode'
  | 'categoryName'
  | 'code'
  | 'name'
>) {
  return [
    `${entry.sectionCode} ${entry.sectionName}`,
    `${entry.divisionCode} ${entry.divisionName}`,
    `${entry.groupCode} ${entry.groupName}`,
    `${entry.categoryCode} ${entry.categoryName}`,
    `${entry.code} ${entry.name}`,
  ].join(' > ')
}

export function getKsicHierarchyLabelByCode(code: string) {
  const entry = getMagokCodeDirectoryEntry(code)

  return entry ? formatKsicHierarchyLabel(entry) : null
}

export function getDirectoryVerdictWeight(verdict: Verdict) {
  if (verdict === 'eligible') {
    return 5
  }

  if (verdict === 'conditional') {
    return 4
  }

  if (verdict === 'reviewRequired') {
    return 3
  }

  if (verdict === 'insufficient') {
    return 2
  }

  return 1
}

export function filterMagokCodeDirectory({
  query,
  zoneType,
  verdict,
  sectionCode,
  browseCategory,
}: CodeDirectoryFilterOptions) {
  const normalizedQuery = normalizeText(query)

  return MAGOK_CODE_DIRECTORY.filter((entry) => {
    if (verdict !== 'all' && entry.zoneVerdicts[zoneType].verdict !== verdict) {
      return false
    }

    if (sectionCode !== 'all' && entry.sectionCode !== sectionCode) {
      return false
    }

    if (browseCategory !== 'all' && entry.browseCategory !== browseCategory) {
      return false
    }

    if (!normalizedQuery) {
      return true
    }

    return entry.searchKeywords.some((keyword) =>
      normalizeText(keyword).includes(normalizedQuery),
    )
  })
}

export function getZoneVerdictCounts(zoneType: DirectoryZoneType) {
  return MAGOK_CODE_DIRECTORY.reduce<Record<Verdict, number>>(
    (counts, entry) => {
      counts[entry.zoneVerdicts[zoneType].verdict] += 1
      return counts
    },
    {
      eligible: 0,
      conditional: 0,
      reviewRequired: 0,
      insufficient: 0,
      ineligible: 0,
    },
  )
}
