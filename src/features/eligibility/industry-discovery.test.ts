import { describe, expect, it } from 'vitest'

import { discoverIndustrySuggestions } from '@/features/eligibility/data/industry-discovery'

describe('discoverIndustrySuggestions', () => {
  it('광고대행업 자연어 입력을 정확 업종코드로 연결한다', () => {
    const suggestions = discoverIndustrySuggestions('저는 광고대행업 해요')

    expect(suggestions[0]?.code).toBe('71310')
    expect(suggestions[0]?.matchKind).toBe('exact')
  })

  it('사업자등록증 업태/종목 텍스트에서 광고대행업 코드를 찾는다', () => {
    const suggestions = discoverIndustrySuggestions(
      '업태: 서비스\n종목: 광고대행업',
    )

    expect(suggestions.some((suggestion) => suggestion.code === '71310')).toBe(true)
  })

  it('브랜딩과 그래픽 디자인 설명을 시각 디자인업으로 추천한다', () => {
    const suggestions = discoverIndustrySuggestions(
      '저희는 브랜딩과 그래픽 디자인 작업을 합니다',
    )

    expect(suggestions.some((suggestion) => suggestion.code === '73203')).toBe(true)
  })

  it('호스팅 표현이 들어오면 호스팅 업종을 후보에 포함한다', () => {
    const suggestions = discoverIndustrySuggestions('웹호스팅 서비스를 운영합니다')

    expect(suggestions.some((suggestion) => suggestion.code === '63112')).toBe(true)
  })
})
