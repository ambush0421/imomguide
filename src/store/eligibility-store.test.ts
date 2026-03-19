import { beforeEach, describe, expect, it } from 'vitest'

import type { IndustrySuggestion } from '@/features/eligibility/types'
import { useEligibilityStore } from '@/store/eligibility-store'

const exactSuggestion: IndustrySuggestion = {
  id: 'suggestion-ad-71310',
  code: '71310',
  name: '광고 대행업',
  reason: '광고대행업 문구와 가장 직접적으로 연결됩니다.',
  matchKind: 'exact',
  source: 'catalog',
  score: 98,
}

describe('useEligibilityStore', () => {
  beforeEach(() => {
    useEligibilityStore.getState().reset()
  })

  it('추천 업종 선택 시 즉시 2단계로 이동하고 결과는 초기화한다', async () => {
    await useEligibilityStore.getState().applyIndustrySuggestion(exactSuggestion)

    const state = useEligibilityStore.getState()

    expect(state.input.ksicCode).toBe('71310')
    expect(state.input.ksicName).toBe('광고 대행업')
    expect(state.currentStep).toBe('adjust')
    expect(state.status).toBe('idle')
    expect(state.result).toBeNull()
  })

  it('판정 완료 후 3단계로 이동하고 조건 수정 시 이전 결과를 무효화한다', async () => {
    await useEligibilityStore.getState().applyIndustrySuggestion(exactSuggestion)
    await useEligibilityStore.getState().evaluate()

    const readyState = useEligibilityStore.getState()

    expect(readyState.status).toBe('ready')
    expect(readyState.result).not.toBeNull()
    expect(readyState.currentStep).toBe('result')

    useEligibilityStore.getState().setField('ksicCode', '62010')

    const invalidatedState = useEligibilityStore.getState()

    expect(invalidatedState.input.ksicCode).toBe('62010')
    expect(invalidatedState.status).toBe('idle')
    expect(invalidatedState.result).toBeNull()
    expect(invalidatedState.currentStep).toBe('adjust')
  })
})
