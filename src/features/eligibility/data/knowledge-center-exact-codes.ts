import knowledgeCenterExactCodesCsv from '../../../../docs/codex-brain/magok_knowledge_industry_center_exact_5digit_codes.csv?raw'

type KnowledgeCenterCsvVerdict =
  | '자동 허용'
  | '조건부 허용'
  | '추가 확인'
  | '불가'
  | '코드만으로 확정 불가'

interface KnowledgeCenterCsvRow {
  verdict: KnowledgeCenterCsvVerdict
  category: string
  code: string
  name: string
  note: string
}

export interface KnowledgeCenterExactCodeEntry {
  code: string
  category: string
  name: string
  note: string
}

export interface KnowledgeCenterDiscoveryEntry extends KnowledgeCenterExactCodeEntry {
  verdict: KnowledgeCenterCsvVerdict
}

export type KnowledgeCenterExactCodeKind =
  | 'allowed'
  | 'reviewRequired'
  | 'conditional'
  | 'additionalCheck'
  | 'blocked'

interface KnowledgeCenterCodeOnlyUncertainEntry {
  codePattern: string
  label: string
  note: string
  prefix?: string
}

function parseCsvLine(line: string) {
  const values: string[] = []
  let current = ''
  let isQuoted = false

  for (let index = 0; index < line.length; index += 1) {
    const char = line[index]
    const nextChar = line[index + 1]

    if (char === '"') {
      if (isQuoted && nextChar === '"') {
        current += '"'
        index += 1
        continue
      }

      isQuoted = !isQuoted
      continue
    }

    if (char === ',' && !isQuoted) {
      values.push(current)
      current = ''
      continue
    }

    current += char
  }

  values.push(current)
  return values
}

function parseKnowledgeCenterRows(csv: string) {
  const normalizedCsv = csv.replace(/^\uFEFF/, '').trim()

  if (!normalizedCsv) {
    return []
  }

  const [, ...lines] = normalizedCsv.split(/\r?\n/)

  return lines
    .map(parseCsvLine)
    .filter((columns) => columns.length >= 5)
    .map<KnowledgeCenterCsvRow>(([verdict, category, code, name, note]) => ({
      verdict: verdict as KnowledgeCenterCsvVerdict,
      category,
      code,
      name,
      note,
    }))
}

function toEntryMap(rows: KnowledgeCenterCsvRow[]) {
  return rows.reduce<Record<string, KnowledgeCenterExactCodeEntry>>((map, row) => {
    if (/^\d{5}$/.test(row.code)) {
      map[row.code] = {
        code: row.code,
        category: row.category,
        name: row.name,
        note: row.note,
      }
    }

    return map
  }, {})
}

const knowledgeCenterRows = parseKnowledgeCenterRows(knowledgeCenterExactCodesCsv)

const autoAllowedRows = knowledgeCenterRows.filter((row) => row.verdict === '자동 허용')
const conditionalRows = knowledgeCenterRows.filter((row) => row.verdict === '조건부 허용')
const reviewRows = conditionalRows.filter((row) => row.code === '63112')
const conditionalOnlyRows = conditionalRows.filter((row) => row.code !== '63112')
const additionalCheckRows = knowledgeCenterRows.filter((row) => row.verdict === '추가 확인')
const blockedRows = knowledgeCenterRows.filter((row) => row.verdict === '불가')
const blockedCodeRows = blockedRows.filter((row) => /^\d{5}$/.test(row.code))
const codeOnlyUncertainRows = knowledgeCenterRows.filter(
  (row) => row.verdict === '코드만으로 확정 불가',
)

export const KNOWLEDGE_CENTER_EXACT_AUTO_ALLOWED_CODES = new Set(
  autoAllowedRows.map((row) => row.code),
)

export const KNOWLEDGE_CENTER_EXACT_AUTO_ALLOWED_MAP = toEntryMap(autoAllowedRows)
export const KNOWLEDGE_CENTER_EXACT_REVIEW_CODE_MAP = toEntryMap(reviewRows)
export const KNOWLEDGE_CENTER_EXACT_CONDITIONAL_CODE_MAP = toEntryMap(
  conditionalOnlyRows,
)
export const KNOWLEDGE_CENTER_EXACT_ADDITIONAL_CHECK_CODE_MAP = toEntryMap(
  additionalCheckRows,
)
export const KNOWLEDGE_CENTER_EXACT_BLOCKED_CODE_MAP = toEntryMap(blockedCodeRows)

const knowledgeCenterCodeOnlyUncertainCodeMap = codeOnlyUncertainRows.reduce<
  Record<string, KnowledgeCenterCodeOnlyUncertainEntry>
>((map, row) => {
  const codes = [...new Set(row.code.match(/\d{5}/g) ?? [])]

  for (const code of codes) {
    if (
      KNOWLEDGE_CENTER_EXACT_AUTO_ALLOWED_CODES.has(code) ||
      KNOWLEDGE_CENTER_EXACT_REVIEW_CODE_MAP[code] ||
      KNOWLEDGE_CENTER_EXACT_CONDITIONAL_CODE_MAP[code] ||
      KNOWLEDGE_CENTER_EXACT_ADDITIONAL_CHECK_CODE_MAP[code] ||
      KNOWLEDGE_CENTER_EXACT_BLOCKED_CODE_MAP[code]
    ) {
      continue
    }

    map[code] = {
      codePattern: row.code,
      label: row.name,
      note: row.note,
    }
  }

  return map
}, {})

export const KNOWLEDGE_CENTER_EXACT_RULE_COUNTS = {
  autoAllowed: autoAllowedRows.length,
  reviewRequired: reviewRows.length,
  conditional: conditionalOnlyRows.length,
  additionalCheck: additionalCheckRows.length,
  blockedItems: blockedRows.length,
  blockedCodes: blockedCodeRows.length,
}

export const KNOWLEDGE_CENTER_DISCOVERY_ENTRIES: KnowledgeCenterDiscoveryEntry[] =
  knowledgeCenterRows
    .filter((row) => /^\d{5}$/.test(row.code))
    .map((row) => ({
      code: row.code,
      category: row.category,
      name: row.name,
      note: row.note,
      verdict: row.verdict,
    }))

export const KNOWLEDGE_CENTER_CODE_ONLY_UNCERTAIN_PREFIXES: KnowledgeCenterCodeOnlyUncertainEntry[] =
  codeOnlyUncertainRows
    .filter((row) => /^\d+\*$/.test(row.code) && row.code !== '70*')
    .map((row) => ({
      codePattern: row.code,
      prefix: row.code.slice(0, -1),
      label: row.name,
      note: row.note,
    }))

export function getKnowledgeCenterExactCodeMatch(normalizedCode: string): {
  kind: KnowledgeCenterExactCodeKind
  entry: KnowledgeCenterExactCodeEntry
} | null {
  if (!normalizedCode || normalizedCode.length !== 5) {
    return null
  }

  const reviewMatch = KNOWLEDGE_CENTER_EXACT_REVIEW_CODE_MAP[normalizedCode]

  if (reviewMatch) {
    return {
      kind: 'reviewRequired',
      entry: reviewMatch,
    }
  }

  const conditionalMatch = KNOWLEDGE_CENTER_EXACT_CONDITIONAL_CODE_MAP[normalizedCode]

  if (conditionalMatch) {
    return {
      kind: 'conditional',
      entry: conditionalMatch,
    }
  }

  const additionalCheckMatch =
    KNOWLEDGE_CENTER_EXACT_ADDITIONAL_CHECK_CODE_MAP[normalizedCode]

  if (additionalCheckMatch) {
    return {
      kind: 'additionalCheck',
      entry: additionalCheckMatch,
    }
  }

  const blockedMatch = KNOWLEDGE_CENTER_EXACT_BLOCKED_CODE_MAP[normalizedCode]

  if (blockedMatch) {
    return {
      kind: 'blocked',
      entry: blockedMatch,
    }
  }

  if (KNOWLEDGE_CENTER_EXACT_AUTO_ALLOWED_CODES.has(normalizedCode)) {
    return {
      kind: 'allowed',
      entry: KNOWLEDGE_CENTER_EXACT_AUTO_ALLOWED_MAP[normalizedCode],
    }
  }

  return null
}

export function getKnowledgeCenterCodeOnlyUncertainMatch(normalizedCode: string) {
  const exactMatch = knowledgeCenterCodeOnlyUncertainCodeMap[normalizedCode]

  if (exactMatch) {
    return exactMatch
  }

  return (
    KNOWLEDGE_CENTER_CODE_ONLY_UNCERTAIN_PREFIXES.find((entry) =>
      entry.prefix ? normalizedCode.startsWith(entry.prefix) : false,
    ) ?? null
  )
}
