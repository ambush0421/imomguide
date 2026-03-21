import {
  createSharedFinderHash,
  defaultSharedEligibilityInput,
  normalizeSharedEligibilityInput,
} from '@/features/eligibility/share-result'
import type {
  EligibilityAdditionalCode,
  EligibilityInput,
  EligibilityResult,
  Verdict,
  ZoneType,
} from '@/features/eligibility/types'

const historyStorageKey = 'magok:eligibility-history:v1'
const maxRecentHistoryEntries = 8

const zoneTypeLabels: Record<ZoneType, string> = {
  industrialFacility: '산업시설구역',
  knowledgeIndustryCenter: '지식산업센터',
  supportFacility: '지원시설구역',
}

const verdicts = [
  'eligible',
  'conditional',
  'reviewRequired',
  'insufficient',
  'ineligible',
] as const satisfies readonly Verdict[]

export interface RecentEligibilityHistoryEntry {
  shareHash: string
  createdAt: string
  input: EligibilityInput
  compareZones: boolean
  additionalCodes: EligibilityAdditionalCode[]
  primaryVerdict: Verdict
  primaryTitle: string
  codeCount: number
}

function canUseStorage() {
  return typeof window !== 'undefined' && 'localStorage' in window
}

function normalizeString(value: unknown) {
  return typeof value === 'string' ? value : ''
}

function normalizeBoolean(value: unknown) {
  return value === true
}

function normalizeVerdict(value: unknown): Verdict {
  return typeof value === 'string' && verdicts.includes(value as Verdict)
    ? (value as Verdict)
    : 'insufficient'
}

function normalizeNumber(value: unknown, fallback: number) {
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback
}

function hasAdditionalCodeValue(item: EligibilityAdditionalCode) {
  return Boolean(item.ksicCode.trim() || item.ksicName.trim())
}

function normalizeAdditionalCodes(value: unknown): EligibilityAdditionalCode[] {
  if (!Array.isArray(value)) {
    return []
  }

  return value
    .slice(0, 2)
    .map((item, index) => {
      const nextValue =
        item && typeof item === 'object'
          ? (item as Partial<Record<keyof EligibilityAdditionalCode, unknown>>)
          : {}

      return {
        id: normalizeString(nextValue.id) || `recent-code-${index + 1}`,
        ksicCode: normalizeString(nextValue.ksicCode),
        ksicName: normalizeString(nextValue.ksicName),
      }
    })
    .filter(hasAdditionalCodeValue)
}

function normalizeHistoryEntry(value: unknown): RecentEligibilityHistoryEntry | null {
  if (!value || typeof value !== 'object') {
    return null
  }

  const nextValue = value as Partial<Record<keyof RecentEligibilityHistoryEntry, unknown>>
  const input = {
    ...defaultSharedEligibilityInput,
    ...normalizeSharedEligibilityInput(nextValue.input),
  }
  const additionalCodes = normalizeAdditionalCodes(nextValue.additionalCodes)
  const compareZones = normalizeBoolean(nextValue.compareZones)
  const shareHash =
    normalizeString(nextValue.shareHash) ||
    createSharedFinderHash(input, {
      compareZones,
      additionalCodes,
    })
  const codeCount = Math.max(
    1,
    normalizeNumber(nextValue.codeCount, 1 + additionalCodes.length),
  )

  return {
    shareHash,
    createdAt: normalizeString(nextValue.createdAt),
    input,
    compareZones,
    additionalCodes,
    primaryVerdict: normalizeVerdict(nextValue.primaryVerdict),
    primaryTitle: normalizeString(nextValue.primaryTitle),
    codeCount,
  }
}

export function loadRecentEligibilityHistory() {
  if (!canUseStorage()) {
    return [] as RecentEligibilityHistoryEntry[]
  }

  try {
    const rawValue = window.localStorage.getItem(historyStorageKey)

    if (!rawValue) {
      return []
    }

    const parsed = JSON.parse(rawValue)

    if (!Array.isArray(parsed)) {
      return []
    }

    return parsed
      .map(normalizeHistoryEntry)
      .filter((entry): entry is RecentEligibilityHistoryEntry => entry !== null)
      .slice(0, maxRecentHistoryEntries)
  } catch {
    return []
  }
}

export function saveRecentEligibilityHistory(entry: RecentEligibilityHistoryEntry) {
  if (!canUseStorage()) {
    return [] as RecentEligibilityHistoryEntry[]
  }

  const nextEntries = [
    entry,
    ...loadRecentEligibilityHistory().filter(
      (candidate) => candidate.shareHash !== entry.shareHash,
    ),
  ].slice(0, maxRecentHistoryEntries)

  window.localStorage.setItem(historyStorageKey, JSON.stringify(nextEntries))

  return nextEntries
}

export function clearRecentEligibilityHistory() {
  if (!canUseStorage()) {
    return
  }

  window.localStorage.removeItem(historyStorageKey)
}

export function createRecentEligibilityHistoryEntry({
  input,
  compareZones,
  additionalCodes,
  result,
}: {
  input: EligibilityInput
  compareZones: boolean
  additionalCodes: EligibilityAdditionalCode[]
  result: EligibilityResult
}) {
  const normalizedInput = normalizeSharedEligibilityInput(input)
  const normalizedAdditionalCodes = additionalCodes
    .slice(0, 2)
    .filter(hasAdditionalCodeValue)
    .map((item, index) => ({
      id: item.id.trim() || `recent-code-${index + 1}`,
      ksicCode: item.ksicCode,
      ksicName: item.ksicName,
    }))

  return {
    shareHash: createSharedFinderHash(normalizedInput, {
      compareZones,
      additionalCodes: normalizedAdditionalCodes,
    }),
    createdAt: new Date().toISOString(),
    input: normalizedInput,
    compareZones,
    additionalCodes: normalizedAdditionalCodes,
    primaryVerdict: result.verdict,
    primaryTitle: result.title,
    codeCount: 1 + normalizedAdditionalCodes.length,
  } satisfies RecentEligibilityHistoryEntry
}

export function getRecentHistoryCodeLabel(entry: RecentEligibilityHistoryEntry) {
  const primaryCode = `${entry.input.ksicCode.trim()} ${entry.input.ksicName.trim()}`.trim()

  if (entry.codeCount > 1) {
    return `${primaryCode || '업종코드 미입력'} 외 ${entry.codeCount - 1}개`
  }

  return primaryCode || '업종코드 미입력'
}

export function getRecentHistoryContext(entry: RecentEligibilityHistoryEntry) {
  const zoneLabel = entry.compareZones
    ? '지식산업센터 + 산업시설구역 비교'
    : zoneTypeLabels[entry.input.zoneType]

  return `${zoneLabel} · 최근 ${entry.codeCount}개 코드`
}
