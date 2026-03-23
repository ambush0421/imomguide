import { describe, expect, it } from 'vitest'

import { discoverIndustrySuggestions } from '@/features/eligibility/data/industry-discovery'

describe('discoverIndustrySuggestions', () => {
  it('추천 결과에 입주 전략과 연관 코드 정보를 함께 붙인다', () => {
    const suggestions = discoverIndustrySuggestions('앱 개발과 SaaS 운영을 합니다')
    const softwareSuggestion = suggestions.find((suggestion) => suggestion.code === '62010')

    expect(softwareSuggestion).toBeDefined()
    expect(softwareSuggestion?.benefitSummary).toContain('입주')
    expect(softwareSuggestion?.recommendedBusinessAngle).toContain('개발 산출물')
    expect(softwareSuggestion?.requiredProofs?.length).toBeGreaterThan(0)
    expect(softwareSuggestion?.nextActions?.length).toBeGreaterThan(0)
    expect(softwareSuggestion?.relatedCodes?.some((code) => code.code === '58222')).toBe(true)
    expect(softwareSuggestion?.riskNotes).toContain(
      '실제 하지 않는 업무를 혜택 때문에 추가하면 심사나 사후 확인 단계에서 불리할 수 있습니다.',
    )
  })
})
