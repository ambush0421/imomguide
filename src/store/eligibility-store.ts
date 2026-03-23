import { create } from 'zustand'

import { discoverIndustrySuggestions } from '@/features/eligibility/data/industry-discovery'
import {
  evaluateEligibility,
  evaluateEligibilityComparison,
} from '@/features/eligibility/evaluator'
import {
  createRecentEligibilityHistoryEntry,
  saveRecentEligibilityHistory,
} from '@/features/eligibility/history-storage'
import {
  defaultSharedEligibilityInput,
  normalizeSharedEligibilityInput,
  type SharedEligibilityState,
} from '@/features/eligibility/share-result'
import type {
  EligibilityAdditionalCode,
  EligibilityCodeEvaluation,
  EligibilityComparisonResults,
  EligibilityFlags,
  EligibilityInput,
  EligibilityResult,
  IndustrySuggestion,
} from '@/features/eligibility/types'

type EvaluationStatus = 'idle' | 'loading' | 'ready' | 'error'
type DiscoveryStatus = 'idle' | 'loading' | 'ready' | 'error'
export type EligibilityStep = 'discover' | 'adjust' | 'result'

interface EligibilityStore {
  input: EligibilityInput
  result: EligibilityResult | null
  additionalCodes: EligibilityAdditionalCode[]
  multiCodeResults: EligibilityCodeEvaluation[] | null
  compareZones: boolean
  comparisonResults: EligibilityComparisonResults | null
  status: EvaluationStatus
  error: string | null
  industryQuery: string
  industrySuggestions: IndustrySuggestion[]
  discoveryStatus: DiscoveryStatus
  discoveryError: string | null
  currentStep: EligibilityStep
  setField: <K extends keyof EligibilityInput>(
    field: K,
    value: EligibilityInput[K],
  ) => void
  setFlag: <K extends keyof EligibilityFlags>(
    field: K,
    value: EligibilityFlags[K],
  ) => void
  setCompareZones: (value: boolean) => void
  addAdditionalCode: () => void
  removeAdditionalCode: (id: string) => void
  setAdditionalCodeField: (
    id: string,
    field: keyof Omit<EligibilityAdditionalCode, 'id'>,
    value: string,
  ) => void
  setCurrentStep: (step: EligibilityStep) => void
  setIndustryQuery: (value: string) => void
  discoverIndustry: () => Promise<void>
  applyIndustrySuggestion: (suggestion: IndustrySuggestion) => Promise<void>
  evaluate: () => Promise<void>
  loadSharedResult: (state: SharedEligibilityState) => void
  loadFinderDraft: (draft: {
    input: EligibilityInput
    compareZones: boolean
    additionalCodes: EligibilityAdditionalCode[]
    currentStep: EligibilityStep
    industryQuery: string
  }) => void
  reset: () => void
}

const defaultInput: EligibilityInput = defaultSharedEligibilityInput
const maxAdditionalCodes = 2
let additionalCodeSequence = 0

function createAdditionalCode(): EligibilityAdditionalCode {
  additionalCodeSequence += 1

  return {
    id: `additional-code-${additionalCodeSequence}`,
    ksicCode: '',
    ksicName: '',
  }
}

function normalizeAdditionalCodes(
  additionalCodes: EligibilityAdditionalCode[],
): EligibilityAdditionalCode[] {
  return additionalCodes.slice(0, maxAdditionalCodes).map((item) => ({
    id: item.id.trim() || createAdditionalCode().id,
    ksicCode: item.ksicCode,
    ksicName: item.ksicName,
  }))
}

function hasAdditionalCodeValue(item: EligibilityAdditionalCode) {
  return Boolean(item.ksicCode.trim() || item.ksicName.trim())
}

function buildCodeEvaluation(
  baseInput: EligibilityInput,
  code: {
    id: string
    label: string
    order: number
    isPrimary: boolean
    ksicCode: string
    ksicName: string
  },
  compareZones: boolean,
): EligibilityCodeEvaluation {
  const nextInput: EligibilityInput = {
    ...baseInput,
    ksicCode: code.ksicCode,
    ksicName: code.ksicName,
  }
  const result = evaluateEligibility(nextInput)

  return {
    ...code,
    result,
    comparisonResults: compareZones ? evaluateEligibilityComparison(nextInput) : null,
  }
}

function buildCodeEvaluations(
  input: EligibilityInput,
  additionalCodes: EligibilityAdditionalCode[],
  compareZones: boolean,
) {
  const filledAdditionalCodes = additionalCodes.filter(hasAdditionalCodeValue)
  const allCodes = [
    {
      id: 'primary-code',
      label: '주업종',
      order: 0,
      isPrimary: true,
      ksicCode: input.ksicCode,
      ksicName: input.ksicName,
    },
    ...filledAdditionalCodes.map((item, index) => ({
      id: item.id,
      label: `부업종 ${index + 1}`,
      order: index + 1,
      isPrimary: false,
      ksicCode: item.ksicCode,
      ksicName: item.ksicName,
    })),
  ]
  const evaluations = allCodes.map((item) => buildCodeEvaluation(input, item, compareZones))
  const primaryEvaluation = evaluations[0]

  return {
    result: primaryEvaluation.result,
    comparisonResults: primaryEvaluation.comparisonResults,
    multiCodeResults: evaluations.length > 1 ? evaluations : null,
  }
}

function wait(ms: number) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms)
  })
}

export const useEligibilityStore = create<EligibilityStore>((set, get) => ({
  input: defaultInput,
  result: null,
  additionalCodes: [],
  multiCodeResults: null,
  compareZones: false,
  comparisonResults: null,
  status: 'idle',
  error: null,
  industryQuery: '',
  industrySuggestions: [],
  discoveryStatus: 'idle',
  discoveryError: null,
  currentStep: 'discover',
  setField: (field, value) =>
    set((state) => ({
      input: {
        ...state.input,
        [field]: value,
      },
      result:
        state.currentStep === 'adjust' || state.currentStep === 'result'
          ? null
          : state.result,
      status:
        state.currentStep === 'adjust' || state.currentStep === 'result'
          ? 'idle'
          : state.status,
      multiCodeResults:
        state.currentStep === 'adjust' || state.currentStep === 'result'
          ? null
          : state.multiCodeResults,
      comparisonResults:
        state.currentStep === 'adjust' || state.currentStep === 'result'
          ? null
          : state.comparisonResults,
      error:
        state.currentStep === 'adjust' || state.currentStep === 'result'
          ? null
          : state.error,
      currentStep: state.currentStep === 'result' ? 'adjust' : state.currentStep,
    })),
  setFlag: (field, value) =>
    set((state) => ({
      input: {
        ...state.input,
        flags: {
          ...state.input.flags,
          [field]: value,
        },
      },
      result:
        state.currentStep === 'adjust' || state.currentStep === 'result'
          ? null
          : state.result,
      status:
        state.currentStep === 'adjust' || state.currentStep === 'result'
          ? 'idle'
          : state.status,
      multiCodeResults:
        state.currentStep === 'adjust' || state.currentStep === 'result'
          ? null
          : state.multiCodeResults,
      comparisonResults:
        state.currentStep === 'adjust' || state.currentStep === 'result'
          ? null
          : state.comparisonResults,
      error:
        state.currentStep === 'adjust' || state.currentStep === 'result'
          ? null
          : state.error,
      currentStep: state.currentStep === 'result' ? 'adjust' : state.currentStep,
    })),
  setCompareZones: (value) =>
    set((state) => {
      const nextZoneType =
        value && state.input.zoneType === 'supportFacility'
          ? 'knowledgeIndustryCenter'
          : state.input.zoneType

      return {
        compareZones: value,
        input: {
          ...state.input,
          zoneType: nextZoneType,
        },
        result:
          state.currentStep === 'adjust' || state.currentStep === 'result'
            ? null
            : state.result,
        multiCodeResults:
          state.currentStep === 'adjust' || state.currentStep === 'result'
            ? null
            : state.multiCodeResults,
        comparisonResults:
          state.currentStep === 'adjust' || state.currentStep === 'result'
            ? null
            : state.comparisonResults,
        status:
          state.currentStep === 'adjust' || state.currentStep === 'result'
            ? 'idle'
            : state.status,
        error:
          state.currentStep === 'adjust' || state.currentStep === 'result'
            ? null
            : state.error,
        currentStep: state.currentStep === 'result' ? 'adjust' : state.currentStep,
      }
    }),
  addAdditionalCode: () =>
    set((state) => {
      if (state.additionalCodes.length >= maxAdditionalCodes) {
        return state
      }

      return {
        additionalCodes: [...state.additionalCodes, createAdditionalCode()],
        result:
          state.currentStep === 'adjust' || state.currentStep === 'result'
            ? null
            : state.result,
        multiCodeResults:
          state.currentStep === 'adjust' || state.currentStep === 'result'
            ? null
            : state.multiCodeResults,
        comparisonResults:
          state.currentStep === 'adjust' || state.currentStep === 'result'
            ? null
            : state.comparisonResults,
        status:
          state.currentStep === 'adjust' || state.currentStep === 'result'
            ? 'idle'
            : state.status,
        error:
          state.currentStep === 'adjust' || state.currentStep === 'result'
            ? null
            : state.error,
        currentStep: state.currentStep === 'result' ? 'adjust' : state.currentStep,
      }
    }),
  removeAdditionalCode: (id) =>
    set((state) => ({
      additionalCodes: state.additionalCodes.filter((item) => item.id !== id),
      result:
        state.currentStep === 'adjust' || state.currentStep === 'result'
          ? null
          : state.result,
      multiCodeResults:
        state.currentStep === 'adjust' || state.currentStep === 'result'
          ? null
          : state.multiCodeResults,
      comparisonResults:
        state.currentStep === 'adjust' || state.currentStep === 'result'
          ? null
          : state.comparisonResults,
      status:
        state.currentStep === 'adjust' || state.currentStep === 'result'
          ? 'idle'
          : state.status,
      error:
        state.currentStep === 'adjust' || state.currentStep === 'result'
          ? null
          : state.error,
      currentStep: state.currentStep === 'result' ? 'adjust' : state.currentStep,
    })),
  setAdditionalCodeField: (id, field, value) =>
    set((state) => ({
      additionalCodes: state.additionalCodes.map((item) =>
        item.id === id
          ? {
              ...item,
              [field]: value,
            }
          : item,
      ),
      result:
        state.currentStep === 'adjust' || state.currentStep === 'result'
          ? null
          : state.result,
      multiCodeResults:
        state.currentStep === 'adjust' || state.currentStep === 'result'
          ? null
          : state.multiCodeResults,
      comparisonResults:
        state.currentStep === 'adjust' || state.currentStep === 'result'
          ? null
          : state.comparisonResults,
      status:
        state.currentStep === 'adjust' || state.currentStep === 'result'
          ? 'idle'
          : state.status,
      error:
        state.currentStep === 'adjust' || state.currentStep === 'result'
          ? null
          : state.error,
      currentStep: state.currentStep === 'result' ? 'adjust' : state.currentStep,
    })),
  setCurrentStep: (step) =>
    set((state) => {
      if (
        step === 'result' &&
        !(
          state.status === 'loading' ||
          state.status === 'error' ||
          (state.status === 'ready' && state.result)
        )
      ) {
        return state
      }

      return {
        currentStep: step,
      }
    }),
  setIndustryQuery: (value) =>
    set({
      industryQuery: value,
      industrySuggestions: [],
      discoveryStatus: 'idle',
      discoveryError: null,
    }),
  discoverIndustry: async () => {
    set({
      discoveryStatus: 'loading',
      discoveryError: null,
    })

    try {
      await wait(220)
      const { industryQuery, input } = get()
      const industrySuggestions = discoverIndustrySuggestions(
        industryQuery,
        input.zoneType === 'supportFacility'
          ? 'knowledgeIndustryCenter'
          : input.zoneType,
      )

      set({
        industrySuggestions,
        discoveryStatus: 'ready',
      })
    } catch (error) {
      set({
        discoveryStatus: 'error',
        discoveryError:
          error instanceof Error
            ? error.message
            : '업종 추천 생성 중 알 수 없는 오류가 발생했습니다.',
      })
    }
  },
  applyIndustrySuggestion: async (suggestion) => {
    const currentInput = get().input
    const nextInput: EligibilityInput = {
      ...currentInput,
      ksicCode: suggestion.code,
      ksicName: suggestion.name,
      regulatoryFit: suggestion.suggestedRegulatoryFit ?? 'auto',
      flags: {
        ...currentInput.flags,
        isHosting63112: suggestion.code === '63112',
      },
    }

    set({
      input: nextInput,
      result: null,
      additionalCodes: [],
      multiCodeResults: null,
      comparisonResults: null,
      status: 'idle',
      error: null,
      currentStep: 'adjust',
    })
  },
  evaluate: async () => {
    set({
      status: 'loading',
      error: null,
      result: null,
      multiCodeResults: null,
      comparisonResults: null,
      currentStep: 'result',
    })

    try {
      await wait(320)
      const { input, compareZones, additionalCodes } = get()
      const { result, comparisonResults, multiCodeResults } = buildCodeEvaluations(
        input,
        additionalCodes,
        compareZones,
      )

      set({
        status: 'ready',
        result,
        multiCodeResults,
        comparisonResults,
        currentStep: 'result',
      })

      saveRecentEligibilityHistory(
        createRecentEligibilityHistoryEntry({
          input,
          compareZones,
          additionalCodes,
          result,
        }),
      )
    } catch (error) {
      set({
        status: 'error',
        result: null,
        multiCodeResults: null,
        comparisonResults: null,
        error:
          error instanceof Error
            ? error.message
            : '판정 엔진 실행 중 알 수 없는 오류가 발생했습니다.',
        currentStep: 'result',
      })
    }
  },
  loadSharedResult: ({ input, compareZones, additionalCodes }) => {
    const nextInput: EligibilityInput = {
      ...defaultInput,
      ...input,
      zoneType:
        compareZones && input.zoneType === 'supportFacility'
          ? 'knowledgeIndustryCenter'
          : input.zoneType,
      flags: {
        ...defaultInput.flags,
        ...input.flags,
      },
    }
    const nextAdditionalCodes = normalizeAdditionalCodes(additionalCodes)
    const { result, comparisonResults, multiCodeResults } = buildCodeEvaluations(
      nextInput,
      nextAdditionalCodes,
      compareZones,
    )

    set({
      input: nextInput,
      result,
      additionalCodes: nextAdditionalCodes,
      multiCodeResults,
      compareZones,
      comparisonResults,
      status: 'ready',
      error: null,
      industryQuery: '',
      industrySuggestions: [],
      discoveryStatus: 'idle',
      discoveryError: null,
      currentStep: 'result',
    })

    saveRecentEligibilityHistory(
      createRecentEligibilityHistoryEntry({
        input: nextInput,
        compareZones,
        additionalCodes: nextAdditionalCodes,
        result,
      }),
    )
  },
  loadFinderDraft: ({
    input,
    compareZones,
    additionalCodes,
    currentStep,
    industryQuery,
  }) => {
    const normalizedInput = normalizeSharedEligibilityInput(input)
    const nextInput: EligibilityInput = {
      ...defaultInput,
      ...normalizedInput,
      zoneType:
        compareZones && normalizedInput.zoneType === 'supportFacility'
          ? 'knowledgeIndustryCenter'
          : normalizedInput.zoneType,
      flags: {
        ...defaultInput.flags,
        ...normalizedInput.flags,
      },
    }
    const nextAdditionalCodes = normalizeAdditionalCodes(additionalCodes)

    if (
      currentStep === 'result' &&
      (nextInput.ksicCode.trim() || nextInput.ksicName.trim())
    ) {
      const { result, comparisonResults, multiCodeResults } = buildCodeEvaluations(
        nextInput,
        nextAdditionalCodes,
        compareZones,
      )

      set({
        input: nextInput,
        result,
        additionalCodes: nextAdditionalCodes,
        multiCodeResults,
        compareZones,
        comparisonResults,
        status: 'ready',
        error: null,
        industryQuery,
        industrySuggestions: [],
        discoveryStatus: 'idle',
        discoveryError: null,
        currentStep: 'result',
      })
      return
    }

    set({
      input: nextInput,
      result: null,
      additionalCodes: nextAdditionalCodes,
      multiCodeResults: null,
      compareZones,
      comparisonResults: null,
      status: 'idle',
      error: null,
      industryQuery,
      industrySuggestions: [],
      discoveryStatus: 'idle',
      discoveryError: null,
      currentStep: currentStep === 'result' ? 'adjust' : currentStep,
    })
  },
  reset: () =>
    set({
      input: defaultInput,
      result: null,
      additionalCodes: [],
      multiCodeResults: null,
      compareZones: false,
      comparisonResults: null,
      status: 'idle',
      error: null,
      industryQuery: '',
      industrySuggestions: [],
      discoveryStatus: 'idle',
      discoveryError: null,
      currentStep: 'discover',
    }),
}))
