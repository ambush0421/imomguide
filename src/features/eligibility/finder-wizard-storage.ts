import {
  defaultSharedEligibilityInput,
  normalizeSharedEligibilityInput,
} from '@/features/eligibility/share-result'
import type {
  EligibilityAdditionalCode,
  EligibilityInput,
} from '@/features/eligibility/types'
import type { EligibilityStep } from '@/store/eligibility-store'

const finderWizardStorageKey = 'magok:finder-wizard-draft:v1'
const maxAdditionalCodes = 2

export type FinderWizardMode = 'overview' | 'focus'
export type FinderDiscoverScreen = 'compose' | 'results'

export interface FinderWizardDraft {
  input: EligibilityInput
  compareZones: boolean
  additionalCodes: EligibilityAdditionalCode[]
  industryQuery: string
  currentStep: EligibilityStep
  discoverScreen: FinderDiscoverScreen
  isWizardFocused: boolean
}

function canUseStorage() {
  return typeof window !== 'undefined' && 'sessionStorage' in window
}

function normalizeString(value: unknown) {
  return typeof value === 'string' ? value : ''
}

function normalizeBoolean(value: unknown) {
  return value === true
}

function normalizeStep(value: unknown): EligibilityStep {
  return value === 'adjust' || value === 'result' ? value : 'discover'
}

function normalizeDiscoverScreen(value: unknown): FinderDiscoverScreen {
  return value === 'results' ? 'results' : 'compose'
}

function hasAdditionalCodeValue(item: EligibilityAdditionalCode) {
  return Boolean(item.ksicCode.trim() || item.ksicName.trim())
}

function normalizeAdditionalCodes(value: unknown): EligibilityAdditionalCode[] {
  if (!Array.isArray(value)) {
    return []
  }

  return value
    .slice(0, maxAdditionalCodes)
    .map((item, index) => {
      const nextValue =
        item && typeof item === 'object'
          ? (item as Partial<Record<keyof EligibilityAdditionalCode, unknown>>)
          : {}

      return {
        id: normalizeString(nextValue.id) || `finder-draft-code-${index + 1}`,
        ksicCode: normalizeString(nextValue.ksicCode),
        ksicName: normalizeString(nextValue.ksicName),
      }
    })
    .filter(hasAdditionalCodeValue)
}

function normalizeFinderWizardDraft(value: unknown): FinderWizardDraft | null {
  if (!value || typeof value !== 'object') {
    return null
  }

  const nextValue = value as Partial<Record<keyof FinderWizardDraft, unknown>>
  const input = {
    ...defaultSharedEligibilityInput,
    ...normalizeSharedEligibilityInput(nextValue.input),
  }

  return {
    input,
    compareZones: normalizeBoolean(nextValue.compareZones),
    additionalCodes: normalizeAdditionalCodes(nextValue.additionalCodes),
    industryQuery: normalizeString(nextValue.industryQuery),
    currentStep: normalizeStep(nextValue.currentStep),
    discoverScreen: normalizeDiscoverScreen(nextValue.discoverScreen),
    isWizardFocused: normalizeBoolean(nextValue.isWizardFocused),
  }
}

export function loadFinderWizardDraft() {
  if (!canUseStorage()) {
    return null
  }

  try {
    const rawValue = window.sessionStorage.getItem(finderWizardStorageKey)

    if (!rawValue) {
      return null
    }

    return normalizeFinderWizardDraft(JSON.parse(rawValue))
  } catch {
    return null
  }
}

export function saveFinderWizardDraft(draft: FinderWizardDraft) {
  if (!canUseStorage()) {
    return
  }

  window.sessionStorage.setItem(
    finderWizardStorageKey,
    JSON.stringify({
      ...draft,
      input: normalizeSharedEligibilityInput(draft.input),
      additionalCodes: normalizeAdditionalCodes(draft.additionalCodes),
    } satisfies FinderWizardDraft),
  )
}

export function clearFinderWizardDraft() {
  if (!canUseStorage()) {
    return
  }

  window.sessionStorage.removeItem(finderWizardStorageKey)
}
