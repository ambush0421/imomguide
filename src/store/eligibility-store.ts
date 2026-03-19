import { create } from 'zustand'

import { discoverIndustrySuggestions } from '@/features/eligibility/data/industry-discovery'
import { evaluateEligibility } from '@/features/eligibility/evaluator'
import type {
  EligibilityFlags,
  EligibilityInput,
  EligibilityResult,
  IndustrySuggestion,
} from '@/features/eligibility/types'

type EvaluationStatus = 'idle' | 'loading' | 'ready' | 'error'
type DiscoveryStatus = 'idle' | 'loading' | 'ready' | 'error'

interface EligibilityStore {
  input: EligibilityInput
  result: EligibilityResult | null
  status: EvaluationStatus
  error: string | null
  industryQuery: string
  industrySuggestions: IndustrySuggestion[]
  discoveryStatus: DiscoveryStatus
  discoveryError: string | null
  setField: <K extends keyof EligibilityInput>(
    field: K,
    value: EligibilityInput[K],
  ) => void
  setFlag: <K extends keyof EligibilityFlags>(
    field: K,
    value: EligibilityFlags[K],
  ) => void
  setIndustryQuery: (value: string) => void
  discoverIndustry: () => Promise<void>
  applyIndustrySuggestion: (suggestion: IndustrySuggestion) => Promise<void>
  evaluate: () => Promise<void>
  reset: () => void
}

const defaultInput: EligibilityInput = {
  companyName: '',
  address: '',
  zoneType: 'knowledgeIndustryCenter',
  ksicCode: '',
  ksicName: '',
  applicantType: 'company',
  regulatoryFit: 'auto',
  notes: '',
  flags: {
    isPackagingAndFilling: false,
    isResourceStockpile: false,
    isHosting63112: false,
    isRealEstateOnly: false,
    isTrustOnly: false,
    hasManufacturingFacility: false,
    requiresCommitteeReview: false,
  },
}

function wait(ms: number) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms)
  })
}

export const useEligibilityStore = create<EligibilityStore>((set, get) => ({
  input: defaultInput,
  result: null,
  status: 'idle',
  error: null,
  industryQuery: '',
  industrySuggestions: [],
  discoveryStatus: 'idle',
  discoveryError: null,
  setField: (field, value) =>
    set((state) => ({
      input: {
        ...state.input,
        [field]: value,
      },
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
    })),
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
      const industrySuggestions = discoverIndustrySuggestions(get().industryQuery)

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
      status: 'loading',
      error: null,
    })

    try {
      await wait(240)
      const result = evaluateEligibility(nextInput)

      set({
        status: 'ready',
        result,
      })
    } catch (error) {
      set({
        status: 'error',
        error:
          error instanceof Error
            ? error.message
            : '추천 업종 적용 중 알 수 없는 오류가 발생했습니다.',
      })
    }
  },
  evaluate: async () => {
    set({ status: 'loading', error: null })

    try {
      await wait(320)
      const result = evaluateEligibility(get().input)

      set({
        status: 'ready',
        result,
      })
    } catch (error) {
      set({
        status: 'error',
        error:
          error instanceof Error
            ? error.message
            : '판정 엔진 실행 중 알 수 없는 오류가 발생했습니다.',
      })
    }
  },
  reset: () =>
    set({
      input: defaultInput,
      result: null,
      status: 'idle',
      error: null,
      industryQuery: '',
      industrySuggestions: [],
      discoveryStatus: 'idle',
      discoveryError: null,
    }),
}))
