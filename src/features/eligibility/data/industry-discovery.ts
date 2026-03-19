import { KNOWLEDGE_CENTER_DISCOVERY_ENTRIES } from '@/features/eligibility/data/knowledge-center-exact-codes'
import { normalizeKsicCode } from '@/features/eligibility/data/rules'
import type {
  IndustrySuggestion,
  RegulatoryFit,
} from '@/features/eligibility/types'

interface IndustryDiscoveryPreset {
  code: string
  name: string
  aliases: string[]
  reason: string
  suggestedRegulatoryFit?: RegulatoryFit
}

const STOP_WORDS = new Set([
  '업태',
  '종목',
  '업종',
  '사업내용',
  '주업종',
  '세부업종',
  '사업자등록증',
  '사업자',
  '등록증',
  '저는',
  '저희',
  '회사',
  '기업',
  '업체',
  '운영',
  '입니다',
  '해요',
  '합니다',
  '그리고',
  '관련',
  '중심',
  '위주',
  '주로',
  '서비스',
])

const FIELD_LABEL_PATTERN =
  /(업태|종목|업종|사업내용|주업종|세부업종)\s*[:：]?\s*([\s\S]*?)(?=(업태|종목|업종|사업내용|주업종|세부업종)\s*[:：]|\r?\n|$)/g

export const DISCOVERY_EXAMPLE_PROMPTS = [
  '저는 광고대행업 해요',
  '업태: 서비스 / 종목: 광고대행업',
  '앱 개발과 SaaS 운영을 합니다',
  '행사 기획, 컨벤션, 전시 대행을 합니다',
]

const DISCOVERY_PRESETS: IndustryDiscoveryPreset[] = [
  {
    code: '71310',
    name: '광고 대행업',
    aliases: [
      '광고대행',
      '광고대행업',
      '광고기획',
      '광고운영',
      '마케팅대행',
      '디지털마케팅',
      '온라인마케팅',
      '퍼포먼스마케팅',
    ],
    reason: '광고 기획과 집행 중심 설명은 보통 광고 대행업으로 연결됩니다.',
    suggestedRegulatoryFit: 'knowledgeIndustry',
  },
  {
    code: '71392',
    name: '광고물 문안, 도안, 설계 등 작성업',
    aliases: [
      '광고문안',
      '카피라이팅',
      '광고카피',
      '광고디자인',
      '광고도안',
      '광고콘텐츠작성',
    ],
    reason: '광고 제작물 기획이나 문안 작성 성격이 강하면 이 업종이 더 정확할 수 있습니다.',
    suggestedRegulatoryFit: 'knowledgeIndustry',
  },
  {
    code: '73203',
    name: '시각 디자인업',
    aliases: [
      '시각디자인',
      '그래픽디자인',
      '브랜딩',
      '브랜드디자인',
      '편집디자인',
      'ci디자인',
      'bi디자인',
    ],
    reason: '브랜딩과 그래픽 작업 설명은 시각 디자인업과 가장 가깝습니다.',
    suggestedRegulatoryFit: 'knowledgeIndustry',
  },
  {
    code: '73202',
    name: '제품 디자인업',
    aliases: ['제품디자인', '산업디자인', '패키지디자인', '프로덕트디자인'],
    reason: '제품이나 산업디자인 중심 설명은 제품 디자인업으로 연결되는 경우가 많습니다.',
    suggestedRegulatoryFit: 'knowledgeIndustry',
  },
  {
    code: '62010',
    name: '컴퓨터 프로그래밍 서비스업',
    aliases: [
      '앱개발',
      '웹개발',
      '프로그램개발',
      '소프트웨어개발',
      '플랫폼개발',
      '프로그래밍',
      '개발대행',
      '서비스개발',
    ],
    reason: '개발 용역이나 구축형 프로젝트 설명은 컴퓨터 프로그래밍 서비스업으로 먼저 검토합니다.',
    suggestedRegulatoryFit: 'informationIndustry',
  },
  {
    code: '58222',
    name: '응용 소프트웨어 개발 및 공급업',
    aliases: [
      'saas',
      '솔루션개발',
      '응용소프트웨어',
      '소프트웨어공급',
      '서비스형소프트웨어',
      '플랫폼서비스',
    ],
    reason: '자체 솔루션이나 SaaS 공급 모델 설명은 응용 소프트웨어 개발 및 공급업과 가깝습니다.',
    suggestedRegulatoryFit: 'informationIndustry',
  },
  {
    code: '58221',
    name: '시스템 소프트웨어 개발 및 공급업',
    aliases: ['시스템소프트웨어', '미들웨어', '운영체제', '보안솔루션', '플랫폼엔진'],
    reason: '시스템 레벨 소프트웨어나 엔진 개발 설명은 시스템 소프트웨어 개발 쪽이 더 맞을 수 있습니다.',
    suggestedRegulatoryFit: 'informationIndustry',
  },
  {
    code: '62021',
    name: '컴퓨터 시스템 통합 자문 및 구축 서비스업',
    aliases: ['시스템통합', 'si', 'erp구축', 'it구축', '인프라구축', '전산구축'],
    reason: '시스템 구축이나 통합 자문 설명은 SI 성격 업종으로 보는 편이 안전합니다.',
    suggestedRegulatoryFit: 'informationIndustry',
  },
  {
    code: '62090',
    name: '기타 정보 기술 및 컴퓨터 운영 관련 서비스업',
    aliases: ['it운영', '클라우드운영', '시스템운영', '기술지원', 'devops', '데브옵스'],
    reason: '운영·관리형 IT 서비스 설명은 정보기술 운영 관련 서비스업과 가깝습니다.',
    suggestedRegulatoryFit: 'informationIndustry',
  },
  {
    code: '63111',
    name: '자료 처리업',
    aliases: ['자료처리', '데이터처리', '데이터가공', '데이터정제', '데이터처리대행'],
    reason: '데이터를 수집·가공·정리해 주는 서비스는 자료 처리업으로 먼저 연결합니다.',
    suggestedRegulatoryFit: 'informationIndustry',
  },
  {
    code: '63112',
    name: '호스팅 및 관련 서비스업',
    aliases: ['호스팅', '웹호스팅', '서버호스팅', '클라우드호스팅', '서버운영대행'],
    reason: '호스팅 표현이 있으면 호스팅 및 관련 서비스업을 우선 추천합니다.',
    suggestedRegulatoryFit: 'informationIndustry',
  },
  {
    code: '63120',
    name: '포털 및 기타 인터넷 정보 매개 서비스업',
    aliases: ['포털', '인터넷정보매개', '온라인플랫폼중개', '정보매개플랫폼'],
    reason: '포털이나 정보 매개형 플랫폼 설명은 인터넷 정보 매개 서비스업이 유력합니다.',
    suggestedRegulatoryFit: 'informationIndustry',
  },
  {
    code: '63991',
    name: '데이터베이스 및 온라인 정보 제공업',
    aliases: ['데이터베이스', 'db서비스', '온라인정보제공', '정보제공서비스', '데이터플랫폼'],
    reason: '데이터 제공과 정보서비스 중심 설명은 데이터베이스 및 온라인 정보 제공업에 가깝습니다.',
    suggestedRegulatoryFit: 'informationIndustry',
  },
  {
    code: '70121',
    name: '전기·전자공학 연구개발업',
    aliases: ['연구개발', 'r&d', 'rnd', '기술연구', '공학연구', '전자연구'],
    reason: '막연한 연구개발 설명은 대표적인 연구개발업 코드부터 검토하는 편이 좋습니다.',
    suggestedRegulatoryFit: 'knowledgeIndustry',
  },
  {
    code: '70113',
    name: '의학 및 약학 연구개발업',
    aliases: ['바이오연구', '신약개발', '의약연구', '의료연구', '제약연구'],
    reason: '바이오·제약 중심 설명은 의학 및 약학 연구개발업으로 연결되는 경우가 많습니다.',
    suggestedRegulatoryFit: 'knowledgeIndustry',
  },
  {
    code: '72129',
    name: '기타 엔지니어링 서비스업',
    aliases: ['엔지니어링', '기술용역', '기술자문', '기술서비스', '설계용역'],
    reason: '기술 자문이나 엔지니어링 설명은 관련 서비스업 코드가 더 적합할 수 있습니다.',
    suggestedRegulatoryFit: 'knowledgeIndustry',
  },
  {
    code: '72919',
    name: '기타 기술 시험, 검사 및 분석업',
    aliases: ['시험검사', '분석서비스', '인증시험', '테스트랩', '검사분석'],
    reason: '시험·검사·분석 중심 사업은 기술 시험, 검사 및 분석업과 연결됩니다.',
    suggestedRegulatoryFit: 'knowledgeIndustry',
  },
  {
    code: '71400',
    name: '시장 조사 및 여론 조사업',
    aliases: ['시장조사', '리서치', '여론조사', '소비자조사', '설문조사'],
    reason: '리서치와 설문조사 설명은 시장 조사 및 여론 조사업과 가장 가깝습니다.',
    suggestedRegulatoryFit: 'knowledgeIndustry',
  },
  {
    code: '73902',
    name: '번역 및 통역 서비스업',
    aliases: ['번역', '통역', '로컬라이제이션', '현지화'],
    reason: '번역이나 통역 설명은 번역 및 통역 서비스업으로 바로 연결할 수 있습니다.',
    suggestedRegulatoryFit: 'knowledgeIndustry',
  },
  {
    code: '75992',
    name: '전시, 컨벤션 및 행사 대행업',
    aliases: ['행사대행', '전시대행', '컨벤션', '이벤트대행', '박람회', '행사기획'],
    reason: '행사 기획과 전시 운영 설명은 전시·컨벤션·행사 대행업과 가깝습니다.',
    suggestedRegulatoryFit: 'knowledgeIndustry',
  },
  {
    code: '75991',
    name: '콜센터 및 텔레마케팅 서비스업',
    aliases: ['콜센터', '텔레마케팅', '아웃바운드마케팅', '고객센터운영', '상담센터'],
    reason: '콜센터나 텔레마케팅 운영 설명은 해당 서비스업 코드가 유력합니다.',
    suggestedRegulatoryFit: 'knowledgeIndustry',
  },
  {
    code: '74100',
    name: '사업시설 유지·관리 서비스업',
    aliases: ['시설관리', '유지관리', 'fm', '건물관리', '시설운영'],
    reason: '시설 운영과 유지관리 설명은 사업시설 유지관리 서비스업과 연결됩니다.',
    suggestedRegulatoryFit: 'knowledgeIndustry',
  },
  {
    code: '75320',
    name: '보안 시스템 서비스업',
    aliases: ['보안시스템', '출입통제', 'cctv관제', '물리보안', '보안관제'],
    reason: '보안 시스템 운영 설명은 보안 시스템 서비스업이 더 적합할 수 있습니다.',
    suggestedRegulatoryFit: 'knowledgeIndustry',
  },
  {
    code: '68112',
    name: '비주거용 건물 임대업',
    aliases: ['비주거용임대', '사무실임대', '건물임대'],
    reason: '임대업 표현은 조건부 허용 업종일 수 있어 별도 확인이 필요합니다.',
    suggestedRegulatoryFit: 'otherPermittedIndustry',
  },
  {
    code: '64201',
    name: '신탁업 및 집합 투자업',
    aliases: ['신탁', '집합투자'],
    reason: '신탁업은 조건부 허용 항목이라 다른 허용 업종과 함께 봐야 합니다.',
    suggestedRegulatoryFit: 'otherPermittedIndustry',
  },
]

const exactEntryMap = new Map(
  KNOWLEDGE_CENTER_DISCOVERY_ENTRIES.map((entry) => [entry.code, entry]),
)

function unique(values: string[]) {
  return [...new Set(values)]
}

export function normalizeIndustryText(value: string) {
  return value.toLowerCase().replace(/[\s"'`~!@#$%^&*()\-_=+[\]{};:,.<>/?\\|·ㆍ]/g, '')
}

function tokenize(value: string) {
  return unique(
    value
      .toLowerCase()
      .split(/[\s/,:;|()[\]{}]+/)
      .map((token) => token.trim())
      .filter(
        (token) =>
          token.length >= 2 &&
          !STOP_WORDS.has(token) &&
          !/^\d+$/.test(token),
      ),
  )
}

function splitSegment(value: string) {
  return value
    .split(/[/,|;]/)
    .flatMap((part) => part.split(/\s+(?:및|와|과)\s+/))
    .map((part) => part.trim())
    .filter(Boolean)
}

function extractQuerySegments(query: string) {
  const trimmedQuery = query.trim()

  if (!trimmedQuery) {
    return []
  }

  const segments = [trimmedQuery]

  for (const match of trimmedQuery.matchAll(FIELD_LABEL_PATTERN)) {
    const value = match[2]?.trim()

    if (!value) {
      continue
    }

    segments.push(value)
    segments.push(...splitSegment(value))
  }

  return unique(segments.map((segment) => segment.trim()).filter(Boolean))
}

function getCatalogMetadata(code: string) {
  const entry = exactEntryMap.get(code)

  return {
    officialName: entry?.name,
    catalogVerdict: entry?.verdict,
    catalogNote: entry?.note,
  }
}

function buildSuggestion(
  preset: Pick<IndustryDiscoveryPreset, 'code' | 'name' | 'suggestedRegulatoryFit'>,
  reason: string,
  matchKind: IndustrySuggestion['matchKind'],
  source: IndustrySuggestion['source'],
  score: number,
): IndustrySuggestion {
  const catalogMetadata = getCatalogMetadata(preset.code)

  return {
    id: `${source}-${preset.code}`,
    code: preset.code,
    name: catalogMetadata.officialName ?? preset.name,
    reason,
    matchKind,
    source,
    score,
    suggestedRegulatoryFit: preset.suggestedRegulatoryFit,
    catalogVerdict: catalogMetadata.catalogVerdict,
    catalogNote: catalogMetadata.catalogNote,
  }
}

function addSuggestion(
  map: Map<string, IndustrySuggestion>,
  suggestion: IndustrySuggestion,
) {
  const existing = map.get(suggestion.code)

  if (!existing) {
    map.set(suggestion.code, suggestion)
    return
  }

  const nextSuggestion =
    suggestion.score > existing.score ||
    (suggestion.score === existing.score &&
      suggestion.matchKind === 'exact' &&
      existing.matchKind === 'related')
      ? suggestion
      : existing

  map.set(suggestion.code, nextSuggestion)
}

function matchPresetAlias(
  querySegments: string[],
  queryTokens: string[],
  preset: IndustryDiscoveryPreset,
) {
  let bestScore = 0
  let matchedAlias = ''
  let matchKind: IndustrySuggestion['matchKind'] = 'related'

  for (const alias of preset.aliases) {
    const normalizedAlias = normalizeIndustryText(alias)
    const aliasTokens = tokenize(alias)
    const directSegmentMatch = querySegments.some((segment) =>
      segment.includes(normalizedAlias),
    )

    if (directSegmentMatch) {
      const score = 170 + normalizedAlias.length

      if (score > bestScore) {
        bestScore = score
        matchedAlias = alias
        matchKind = 'exact'
      }

      continue
    }

    const tokenHits = aliasTokens.filter((token) =>
      queryTokens.some(
        (queryToken) => queryToken.includes(token) || token.includes(queryToken),
      ),
    ).length

    if (!tokenHits) {
      continue
    }

    const score = tokenHits === aliasTokens.length ? 125 + tokenHits * 10 : 78 + tokenHits * 8

    if (score > bestScore) {
      bestScore = score
      matchedAlias = alias
      matchKind = tokenHits === aliasTokens.length ? 'exact' : 'related'
    }
  }

  if (!bestScore || !matchedAlias) {
    return null
  }

  return {
    matchedAlias,
    score: bestScore,
    matchKind,
  }
}

function matchCatalogName(
  querySegments: string[],
  queryTokens: string[],
  code: string,
  name: string,
) {
  const normalizedName = normalizeIndustryText(name)
  const directSegmentMatch = querySegments.some((segment) =>
    segment.includes(normalizedName),
  )

  if (directSegmentMatch) {
    return {
      reason: `입력한 표현에 \`${name}\`이 직접 포함되어 있어 정확 업종으로 연결했습니다.`,
      score: 155 + normalizedName.length,
      matchKind: 'exact' as const,
    }
  }

  const nameTokens = tokenize(name)
  const tokenHits = nameTokens.filter((token) =>
    queryTokens.some(
      (queryToken) => queryToken.includes(token) || token.includes(queryToken),
    ),
  ).length

  if (!tokenHits) {
    return null
  }

  return {
    reason: `${name}(${code})은 입력한 설명의 핵심어와 가까워 관련 업종으로 추천합니다.`,
    score: 68 + tokenHits * 9,
    matchKind: tokenHits >= Math.max(1, nameTokens.length - 1) ? ('exact' as const) : ('related' as const),
  }
}

export function discoverIndustrySuggestions(query: string) {
  const trimmedQuery = query.trim()

  if (!trimmedQuery) {
    return []
  }

  const hasBusinessRegistrationLabels = FIELD_LABEL_PATTERN.test(trimmedQuery)
  FIELD_LABEL_PATTERN.lastIndex = 0

  const querySegments = extractQuerySegments(trimmedQuery).map(normalizeIndustryText)
  const queryTokens = tokenize(trimmedQuery)
  const suggestions = new Map<string, IndustrySuggestion>()
  const embeddedCodes = unique(
    (trimmedQuery.match(/\d{5}/g) ?? []).map((code) => normalizeKsicCode(code)),
  )

  for (const code of embeddedCodes) {
    const catalogMetadata = getCatalogMetadata(code)

    if (!catalogMetadata.officialName) {
      continue
    }

    addSuggestion(
      suggestions,
      {
        id: `direct-code-${code}`,
        code,
        name: catalogMetadata.officialName,
        reason: `입력 텍스트에 KSIC 코드 \`${code}\`가 직접 포함되어 있습니다.`,
        matchKind: 'exact',
        source: 'directCode',
        score: 240,
        catalogVerdict: catalogMetadata.catalogVerdict,
        catalogNote: catalogMetadata.catalogNote,
      },
    )
  }

  for (const preset of DISCOVERY_PRESETS) {
    const presetMatch = matchPresetAlias(querySegments, queryTokens, preset)

    if (!presetMatch) {
      continue
    }

    const prefix =
      hasBusinessRegistrationLabels && presetMatch.matchKind === 'exact'
        ? '사업자등록증 텍스트의 업종 표현과 가장 가깝습니다.'
        : `입력한 \`${presetMatch.matchedAlias}\` 표현을 기준으로 추천했습니다.`

    addSuggestion(
      suggestions,
      buildSuggestion(
        preset,
        `${prefix} ${preset.reason}`,
        presetMatch.matchKind,
        'preset',
        presetMatch.score,
      ),
    )
  }

  for (const entry of KNOWLEDGE_CENTER_DISCOVERY_ENTRIES) {
    const catalogMatch = matchCatalogName(
      querySegments,
      queryTokens,
      entry.code,
      entry.name,
    )

    if (!catalogMatch) {
      continue
    }

    addSuggestion(
      suggestions,
      {
        id: `catalog-${entry.code}`,
        code: entry.code,
        name: entry.name,
        reason: catalogMatch.reason,
        matchKind: catalogMatch.matchKind,
        source: 'catalog',
        score: catalogMatch.score,
        catalogVerdict: entry.verdict,
        catalogNote: entry.note,
      },
    )
  }

  const orderedSuggestions = [...suggestions.values()].sort((left, right) => {
    if (right.score !== left.score) {
      return right.score - left.score
    }

    if (left.matchKind !== right.matchKind) {
      return left.matchKind === 'exact' ? -1 : 1
    }

    return left.code.localeCompare(right.code)
  })

  const exactMatches = orderedSuggestions
    .filter((suggestion) => suggestion.matchKind === 'exact')
    .slice(0, 3)
  const relatedMatches = orderedSuggestions
    .filter((suggestion) => suggestion.matchKind === 'related')
    .slice(0, 4)

  return [...exactMatches, ...relatedMatches]
}
