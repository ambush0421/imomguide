import { beforeEach, describe, expect, it } from 'vitest'

import {
  clearRecentEligibilityHistory,
  createRecentEligibilityHistoryEntry,
  getRecentHistoryCodeLabel,
  getRecentHistoryContext,
  loadRecentEligibilityHistory,
  saveRecentEligibilityHistory,
} from '@/features/eligibility/history-storage'
import { evaluateEligibility } from '@/features/eligibility/evaluator'
import type { EligibilityInput } from '@/features/eligibility/types'

const baseInput: EligibilityInput = {
  companyName: '테스트 기업',
  address: '서울 강서구 마곡중앙로',
  zoneType: 'knowledgeIndustryCenter',
  ksicCode: '62010',
  ksicName: '컴퓨터 프로그래밍 서비스업',
  companyScale: 'sme',
  grossAreaPy: '',
  rndHeadcount: '',
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

describe('history-storage helpers', () => {
  beforeEach(() => {
    window.localStorage.clear()
    clearRecentEligibilityHistory()
  })

  it('최근 조회를 저장하고 같은 건은 맨 앞으로 덮어쓴다', () => {
    const result = evaluateEligibility(baseInput)
    const entry = createRecentEligibilityHistoryEntry({
      input: baseInput,
      compareZones: false,
      additionalCodes: [],
      result,
    })

    saveRecentEligibilityHistory(entry)
    saveRecentEligibilityHistory({
      ...entry,
      createdAt: '2026-03-21T10:00:00.000Z',
    })

    const history = loadRecentEligibilityHistory()

    expect(history).toHaveLength(1)
    expect(history[0].createdAt).toBe('2026-03-21T10:00:00.000Z')
  })

  it('복수 코드와 비교 모드 문맥을 최근 조회 라벨로 만든다', () => {
    const result = evaluateEligibility(baseInput)
    const entry = createRecentEligibilityHistoryEntry({
      input: baseInput,
      compareZones: true,
      additionalCodes: [
        {
          id: 'secondary-1',
          ksicCode: '63110',
          ksicName: '자료 처리업',
        },
      ],
      result,
    })

    expect(getRecentHistoryCodeLabel(entry)).toBe('62010 컴퓨터 프로그래밍 서비스업 외 1개')
    expect(getRecentHistoryContext(entry)).toBe('지식산업센터 + 산업시설구역 비교 · 최근 2개 코드')
  })
})
