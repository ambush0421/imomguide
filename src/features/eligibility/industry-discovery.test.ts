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

  it('경영컨설팅 자연어 입력을 경영 컨설팅업으로 연결한다', () => {
    const suggestions = discoverIndustrySuggestions('경영컨설팅 및 전략기획 자문을 합니다')

    expect(suggestions.some((suggestion) => suggestion.code === '71531')).toBe(true)
    expect(
      suggestions.find((suggestion) => suggestion.code === '71531')?.matchKind,
    ).toBe('exact')
  })

  it.each([
    ['옥외광고와 간판광고 운영', '71391'],
    ['포장충전 작업을 합니다', '75994'],
    ['영상편집과 더빙 후반작업을 합니다', '59120'],
    ['음원출판과 오디오콘텐츠 출판을 합니다', '59201'],
    ['특허중개와 기술이전중개를 합니다', '73903'],
    ['상품감정과 견본추출 서비스를 합니다', '73904'],
    ['특허라이선스와 상표권라이선스를 임대합니다', '76400'],
  ])('%s 입력을 해당 exact 코드로 추천한다', (query, code) => {
    const suggestions = discoverIndustrySuggestions(query)

    expect(suggestions.some((suggestion) => suggestion.code === code)).toBe(true)
    expect(
      suggestions.find((suggestion) => suggestion.code === code)?.matchKind,
    ).toBe('exact')
  })

  it.each([
    ['기업부설연구소와 연구개발센터를 운영합니다', '70119'],
    ['기계연구와 로봇연구를 수행합니다', '70129'],
    ['경제연구와 경영연구를 수행합니다', '70201'],
    ['정책연구와 사회과학연구를 합니다', '70209'],
    ['건축설계와 건축감리 서비스를 제공합니다', '72111'],
    ['도시계획과 조경설계를 합니다', '72112'],
    ['환경영향평가와 폐기물처리설계를 합니다', '72122'],
    ['성분분석과 시험분석을 수행합니다', '72911'],
    ['지적측량과 토지측량을 합니다', '72921'],
    ['도면작성과 캐드제도를 합니다', '72922'],
    ['지질조사와 지도제작을 합니다', '72923'],
    ['출판사 운영과 전자책 출판을 합니다', '58113'],
    ['웹툰출판과 만화출판을 합니다', '58112'],
    ['잡지발행과 매거진발행을 합니다', '58122'],
    ['모바일게임 개발을 합니다', '58212'],
    ['온라인게임 개발을 합니다', '58211'],
    ['온라인교육과 인터넷강의를 운영합니다', '85503'],
    ['직업훈련원과 자격증학원을 운영합니다', '85669'],
    ['코딩학원과 컴퓨터교육을 합니다', '85691'],
    ['사내교육과 직원연수를 운영합니다', '85650'],
  ])('%s 입력을 범위형 업종 대표 코드로 추천한다', (query, code) => {
    const suggestions = discoverIndustrySuggestions(query)

    expect(suggestions.some((suggestion) => suggestion.code === code)).toBe(true)
  })

  it('호스팅 표현이 들어오면 호스팅 업종을 후보에 포함한다', () => {
    const suggestions = discoverIndustrySuggestions('웹호스팅 서비스를 운영합니다')

    expect(suggestions.some((suggestion) => suggestion.code === '63112')).toBe(true)
  })

  it('넓은 검색어에서는 3개를 넘는 후보를 반환해 더 보기 확장이 가능하다', () => {
    const suggestions = discoverIndustrySuggestions('개발')

    expect(suggestions.length).toBeGreaterThan(3)
  })
})
