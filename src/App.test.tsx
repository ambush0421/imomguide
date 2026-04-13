import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import App from '@/App'
import { createSharedFinderHash } from '@/features/eligibility/share-result'
import type { EligibilityInput } from '@/features/eligibility/types'
import { useEligibilityStore } from '@/store/eligibility-store'

const sharedResultInput: EligibilityInput = {
  companyName: '공유 테스트 기업',
  address: '서울 강서구 마곡중앙로',
  zoneType: 'knowledgeIndustryCenter',
  ksicCode: '73905',
  ksicName: '경영 컨설팅업',
  companyScale: 'sme',
  grossAreaPy: '',
  rndHeadcount: '',
  applicantType: 'company',
  regulatoryFit: 'auto',
  notes: '공유 링크 테스트',
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

describe('App', () => {
  beforeEach(() => {
    useEligibilityStore.getState().reset()
    window.localStorage.clear()
    window.sessionStorage.clear()
    window.history.replaceState(null, '', '#top')
    window.dataLayer = []
    window.gtag = undefined
    window.magokDesktop = undefined
    window.scrollTo = vi.fn()
    Element.prototype.scrollIntoView = vi.fn()
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation((query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        addListener: vi.fn(),
        removeListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    })
  })

  it('Electron 브리지에서는 우측 상단 개발도구 버튼으로 DevTools를 열 수 있다', async () => {
    const openDevTools = vi.fn().mockResolvedValue(true)
    window.magokDesktop = { openDevTools }

    render(<App />)
    const user = userEvent.setup()

    await user.click(screen.getByRole('button', { name: '개발도구 열기' }))

    expect(openDevTools).toHaveBeenCalledTimes(1)
  })

  it('`#finder?mode=overview`로 진입하면 홈 개요 화면을 유지한다', () => {
    window.history.replaceState(null, '', '#finder?mode=overview')

    render(<App />)

    expect(
      screen.getByRole('heading', {
        name: /마곡 입주 상담,\s*업종코드부터 예비판정까지 한 번에/,
      }),
    ).toBeInTheDocument()
    expect(
      screen.queryByRole('heading', {
        name: '추천 결과 확인하기',
      }),
    ).not.toBeInTheDocument()
    expect(window.location.hash).toBe('#finder?mode=overview')
  })

  it('초기에는 컨설턴트용 히어로 검색과 주요 안내 섹션이 함께 보인다', async () => {
    render(<App />)
    const finderSection = screen.getByRole('region', {
      name: '업종코드 분석 위저드',
    })

    expect(screen.getAllByText('마곡 코드찾기').length).toBeGreaterThan(0)
    expect(
      screen.getByRole('heading', {
        name: /마곡 입주 상담,\s*업종코드부터 예비판정까지 한 번에/,
      }),
    ).toBeInTheDocument()
    expect(
      screen.getByText(
        /사업자 업태·종목이나 하는 일을 적으면 마곡에서 먼저 볼 업종코드를 추천하고,/,
      ),
    ).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '예비판정 안내' })).toBeInTheDocument()
    expect(screen.getByText('업종코드를 몰라도 검색')).toBeInTheDocument()
    expect(screen.getByText('마곡 기준 자동 추천')).toBeInTheDocument()
    expect(screen.getByText('가능·조건부·심의 필요 바로 확인')).toBeInTheDocument()
    expect(screen.getByText('고객 업태·종목만으로 후보 코드를 먼저 좁힙니다.')).toBeInTheDocument()
    expect(screen.getByText('상담 전에 전체 허용 코드를 훑어볼 때 씁니다.')).toBeInTheDocument()
    expect(screen.getAllByText('업종코드 추천받기').length).toBeGreaterThan(0)
    expect(screen.getAllByRole('button', { name: '전체 코드 사전 보기' }).length).toBeGreaterThan(0)
    expect(
      screen.getByRole('heading', {
        name: /컨설턴트·중개사를 위한\s*빠른 검색 홈/,
      }),
    ).toBeInTheDocument()
    expect(
      screen.getByPlaceholderText(
        '예: 소프트웨어 개발 도급, 온라인 교육 플랫폼 운영, 프랜차이즈 카페 본사',
      ),
    ).toBeInTheDocument()
    expect(
      screen.getByText(
        '사업자등록증 업태·종목, 실무 메모, 통화 중에 들은 표현 그대로 적으셔도 됩니다.',
      ),
    ).toBeInTheDocument()
    expect(screen.getAllByText("입력 후 '추천 코드 찾기' 버튼이 활성화됩니다.").length).toBeGreaterThan(0)
    expect(screen.getByText('실무에서는 보통 이렇게 봅니다')).toBeInTheDocument()
    expect(screen.getByText('하는 일을 한 줄로 적습니다.')).toBeInTheDocument()
    expect(screen.getByText('입주 판정을 설명할 수 있게 도와주는 도구들')).toBeInTheDocument()
    expect(
      within(finderSection).getByRole('heading', {
        name: /위 빠른 검색에서 시작하거나\s*직접 입력으로 바로 넘어가세요/,
      }),
    ).toBeInTheDocument()
    expect(within(finderSection).getByText('이렇게 시작하세요')).toBeInTheDocument()
    expect(within(finderSection).getAllByText('검색 후 활성화').length).toBeGreaterThan(0)
    expect(screen.getByText('마곡 입주 가능성을 근거와 함께 확인합니다.')).toBeInTheDocument()
    expect(screen.queryByText('사무실 준비 참고 링크')).not.toBeInTheDocument()
    expect(screen.queryByText('제휴 링크 안내')).not.toBeInTheDocument()
    expect(screen.queryByTitle('쿠팡 파트너스 추천 위젯 모바일기기')).not.toBeInTheDocument()
    expect(screen.queryByText('상담 준비에 도움이 되는 스폰서 정보')).not.toBeInTheDocument()
    expect(screen.getByRole('link', { name: '서비스 소개' })).toHaveAttribute('href', '/about/')
    expect(screen.getByRole('link', { name: '문의' })).toHaveAttribute('href', '/contact/')
    expect(screen.getByRole('link', { name: '개인정보처리방침' })).toHaveAttribute('href', '/privacy/')
    expect(screen.getByRole('link', { name: '이용약관' })).toHaveAttribute('href', '/terms/')
    expect(
      screen.getByText(
        '공개 페이지에서는 서비스 소개, 문의, 개인정보처리방침, 이용약관을 함께 제공해 운영 정보와 책임 범위를 바로 확인할 수 있습니다.',
      ),
    ).toBeInTheDocument()

    await userEvent.setup().click(screen.getByRole('tab', { name: '지식산업센터' }))
    expect(screen.getByText('시행령 제6조제2항 1~27호 대응표')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '전수 코드 사전 열기' })).toBeInTheDocument()
  })

  it('추천 업종 선택 후 2단계로 이동하고 결과 보기 후 3단계 결과를 보여준다', async () => {
    render(<App />)
    const user = userEvent.setup()
    const finderSection = screen.getByRole('region', {
      name: '업종코드 분석 위저드',
    })

    await user.type(
      screen.getByPlaceholderText(
        '예: 소프트웨어 개발 도급, 온라인 교육 플랫폼 운영, 프랜차이즈 카페 본사',
      ),
      '광고대행업',
    )
    await user.click(
      screen.getAllByRole('button', { name: '추천 코드 찾기' })[0],
    )

    expect(window.location.hash).toBe('#finder?mode=focus&step=discover&screen=results')

    expect(
      await within(finderSection).findByRole('heading', {
        name: '추천 결과 확인하기',
      }),
    ).toBeInTheDocument()
    expect(
      within(finderSection).queryByText('컨설턴트·중개사를 위한 빠른 검색 홈'),
    ).not.toBeInTheDocument()
    expect(
      within(finderSection).getByText('추천된 코드 중 하나를 고르면 다음 화면으로 넘어갑니다.'),
    ).toBeInTheDocument()
    expect(
      await within(finderSection).findByText('먼저 볼 코드'),
    ).toBeInTheDocument()
    expect(within(finderSection).queryByRole('button', { name: '상세 보기' })).not.toBeInTheDocument()
    expect(within(finderSection).queryByText('먼저 준비할 자료')).not.toBeInTheDocument()
    expect(within(finderSection).queryByText('꼭 확인할 점')).not.toBeInTheDocument()
    expect(within(finderSection).queryByText('다음 단계에서 할 일')).not.toBeInTheDocument()
    expect(within(finderSection).queryByText('공통 체크포인트')).not.toBeInTheDocument()
    expect(
      within(finderSection).queryByText(
        '주업종과 부업종 중 무엇으로 설명하는 게 더 실제 사업에 가까운지 비교해 보세요.',
      ),
    ).not.toBeInTheDocument()

    await user.click(
      within(finderSection).getAllByRole('button', { name: '이 코드로 확인하기' })[0],
    )

    await waitFor(() => {
      expect(window.location.hash).toBe('#finder?mode=focus&step=adjust')
    })

    expect(await within(finderSection).findByText('선택한 업종코드')).toBeInTheDocument()
    expect(within(finderSection).getByDisplayValue('71310')).toBeInTheDocument()
    expect(within(finderSection).getByDisplayValue('광고 대행업')).toBeInTheDocument()

    await user.click(within(finderSection).getByRole('button', { name: '결과 보기' }))

    await waitFor(() => {
      expect(within(finderSection).getByText('업종코드 상세 해설')).toBeInTheDocument()
    })

    expect(window.location.hash).toBe('#finder?mode=focus&step=result')

    expect(
      within(finderSection).getByRole('button', { name: '조건 다시 수정' }),
    ).toBeInTheDocument()
  })

  it('직접 입력으로 계속을 누르면 2단계 조건 보정 화면으로 이동한다', async () => {
    render(<App />)
    const user = userEvent.setup()
    const finderSection = screen.getByRole('region', {
      name: '업종코드 분석 위저드',
    })

    await user.click(screen.getAllByRole('button', { name: '직접 입력으로 계속' })[0])

    await waitFor(() => {
      expect(window.location.hash).toBe('#finder?mode=focus&step=adjust')
    })

    expect(await within(finderSection).findByText('선택한 업종코드')).toBeInTheDocument()
    expect(within(finderSection).getByText('직접 입력 예정')).toBeInTheDocument()
  })

  it('결과에서 조건 다시 수정 후 값을 바꾸면 adjust 해시로 되돌아간다', async () => {
    render(<App />)
    const user = userEvent.setup()
    const finderSection = screen.getByRole('region', {
      name: '업종코드 분석 위저드',
    })

    await user.click(screen.getAllByRole('button', { name: '직접 입력으로 계속' })[0])
    await user.clear(within(finderSection).getByLabelText('KSIC 코드'))
    await user.type(within(finderSection).getByLabelText('KSIC 코드'), '62010')
    await user.clear(within(finderSection).getByLabelText('업종명'))
    await user.type(
      within(finderSection).getByLabelText('업종명'),
      '컴퓨터 프로그래밍 서비스업',
    )
    await user.click(within(finderSection).getByRole('button', { name: '결과 보기' }))

    await waitFor(() => {
      expect(within(finderSection).getByRole('button', { name: '공유 링크 복사' })).toBeInTheDocument()
    })
    expect(window.location.hash).toBe('#finder?mode=focus&step=result')

    await user.click(within(finderSection).getByRole('button', { name: '조건 다시 수정' }))

    await waitFor(() => {
      expect(window.location.hash).toBe('#finder?mode=focus&step=adjust')
    })

    await user.clear(within(finderSection).getByLabelText('KSIC 코드'))
    await user.type(within(finderSection).getByLabelText('KSIC 코드'), '63110')

    await waitFor(() => {
      expect(window.location.hash).toBe('#finder?mode=focus&step=adjust')
    })
    expect(
      within(finderSection).queryByRole('button', { name: '공유 링크 복사' }),
    ).not.toBeInTheDocument()
  })

  it('코드 사전으로 나갔다가 검색 홈으로 돌아오면 adjust 초안을 복원한다', async () => {
    render(<App />)
    const user = userEvent.setup()
    const finderSection = screen.getByRole('region', {
      name: '업종코드 분석 위저드',
    })

    await user.click(screen.getAllByRole('button', { name: '직접 입력으로 계속' })[0])
    await user.clear(within(finderSection).getByLabelText('KSIC 코드'))
    await user.type(within(finderSection).getByLabelText('KSIC 코드'), '62010')
    await user.clear(within(finderSection).getByLabelText('업종명'))
    await user.type(
      within(finderSection).getByLabelText('업종명'),
      '컴퓨터 프로그래밍 서비스업',
    )

    await user.click(screen.getAllByRole('button', { name: '전체 코드 사전 보기' })[0])

    expect(
      await screen.findByPlaceholderText('예: 광고대행업 / 앱 개발 / 72121 / 63112'),
    ).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: '검색 홈으로 돌아가기' }))

    await waitFor(() => {
      expect(window.location.hash).toBe('#finder?mode=focus&step=adjust')
    })
    const restoredFinderSection = screen.getByRole('region', {
      name: '업종코드 분석 위저드',
    })

    expect(within(restoredFinderSection).getByDisplayValue('62010')).toBeInTheDocument()
    expect(
      within(restoredFinderSection).getByDisplayValue('컴퓨터 프로그래밍 서비스업'),
    ).toBeInTheDocument()
  })

  it('plain `#finder`로 다시 열면 session draft를 복원한다', async () => {
    const firstRender = render(<App />)
    const user = userEvent.setup()
    const finderSection = screen.getByRole('region', {
      name: '업종코드 분석 위저드',
    })

    await user.click(screen.getAllByRole('button', { name: '직접 입력으로 계속' })[0])
    await user.clear(within(finderSection).getByLabelText('KSIC 코드'))
    await user.type(within(finderSection).getByLabelText('KSIC 코드'), '62010')
    await user.clear(within(finderSection).getByLabelText('업종명'))
    await user.type(
      within(finderSection).getByLabelText('업종명'),
      '컴퓨터 프로그래밍 서비스업',
    )

    await waitFor(() => {
      expect(window.location.hash).toBe('#finder?mode=focus&step=adjust')
    })

    firstRender.unmount()
    window.history.replaceState(null, '', '#finder')

    render(<App />)

    await waitFor(() => {
      expect(window.location.hash).toBe('#finder?mode=focus&step=adjust')
    })
    expect(screen.getByDisplayValue('62010')).toBeInTheDocument()
    expect(screen.getByDisplayValue('컴퓨터 프로그래밍 서비스업')).toBeInTheDocument()
  })

  it('넓은 검색어에서는 추천 결과 화면에서 더 보기로 후보를 확장할 수 있다', async () => {
    render(<App />)
    const user = userEvent.setup()
    const finderSection = screen.getByRole('region', {
      name: '업종코드 분석 위저드',
    })

    await user.type(
      screen.getByPlaceholderText(
        '예: 소프트웨어 개발 도급, 온라인 교육 플랫폼 운영, 프랜차이즈 카페 본사',
      ),
      '개발',
    )
    await user.click(screen.getAllByRole('button', { name: '추천 코드 찾기' })[0])

    expect(
      await within(finderSection).findByRole('button', { name: /더 보기 \(\d+개 더\)/ }),
    ).toBeInTheDocument()
    expect(
      within(finderSection).queryByText(
        '실제 하지 않는 업무를 혜택 때문에 추가하면 심사나 사후 확인 단계에서 불리할 수 있습니다.',
      ),
    ).not.toBeInTheDocument()
    expect(within(finderSection).queryByText('공통 체크포인트')).not.toBeInTheDocument()
    expect(
      within(finderSection).getByText(/관련도 높은 순서로 먼저 표시/),
    ).toBeInTheDocument()
    expect(
      within(finderSection).getByRole('button', { name: /전체 후보\s*\d+/ }),
    ).toBeInTheDocument()
    expect(
      within(finderSection).getByRole('button', { name: /바로 검토 가능\s*\d+/ }),
    ).toBeInTheDocument()

    await user.click(
      within(finderSection).getByRole('button', { name: /바로 검토 가능\s*\d+/ }),
    )

    expect(
      within(finderSection).getByRole('button', { name: /바로 검토 가능\s*\d+/ }),
    ).toHaveAttribute('aria-pressed', 'true')
    expect(
      within(finderSection).getByText(
        '현재 구역 기준 가능으로 먼저 검토할 후보만 보고 있습니다.',
      ),
    ).toBeInTheDocument()

    const suggestionButtonCountBefore = within(finderSection).getAllByRole('button', {
      name: '이 코드로 확인하기',
    }).length

    await user.click(
      within(finderSection).getByRole('button', { name: /더 보기 \(\d+개 더\)/ }),
    )

    await waitFor(() => {
      expect(
        within(finderSection).getByRole('button', {
          name: /먼저 볼 코드 접기|함께 확인할 코드 접기|주의해서 볼 코드 접기/,
        }),
      ).toBeInTheDocument()
    })

    const suggestionButtonCountAfter = within(finderSection).getAllByRole('button', {
      name: '이 코드로 확인하기',
    }).length

    expect(suggestionButtonCountAfter).toBeGreaterThan(suggestionButtonCountBefore)
  })

  it('모바일에서는 위저드 진입 후 현재 단계 화면만 집중해서 보여준다', async () => {
    window.matchMedia = vi.fn().mockImplementation((query: string) => ({
      matches: query === '(max-width: 639px)',
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }))

    render(<App />)
    const user = userEvent.setup()

    await user.type(
      screen.getByPlaceholderText(
        '예: 소프트웨어 개발 도급, 온라인 교육 플랫폼 운영, 프랜차이즈 카페 본사',
      ),
      '광고대행업',
    )
    await user.click(screen.getAllByRole('button', { name: '추천 코드 찾기' })[0])

    expect(
      screen.queryByRole('heading', {
        name: /마곡 입주 상담,\s*업종코드부터 예비판정까지 한 번에/,
      }),
    ).not.toBeInTheDocument()
    expect(screen.queryByText('사무실 준비 참고 링크')).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: '전체 보기' })).toBeInTheDocument()
    expect(await screen.findByText('먼저 볼 코드')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: '전체 보기' }))

    expect(
      screen.getByRole('heading', {
        name: /마곡 입주 상담,\s*업종코드부터 예비판정까지 한 번에/,
      }),
    ).toBeInTheDocument()
  })

  it('데스크톱에서는 위저드 진입 후 중앙 단계와 우측 참고 패널을 함께 보여준다', async () => {
    render(<App />)
    const user = userEvent.setup()

    await user.type(
      screen.getByPlaceholderText(
        '예: 소프트웨어 개발 도급, 온라인 교육 플랫폼 운영, 프랜차이즈 카페 본사',
      ),
      '광고대행업',
    )
    await user.click(screen.getAllByRole('button', { name: '추천 코드 찾기' })[0])

    expect(
      screen.queryByRole('heading', {
        name: /마곡 입주 상담,\s*업종코드부터 예비판정까지 한 번에/,
      }),
    ).not.toBeInTheDocument()
    expect(screen.getByText('지금은 이 흐름만 보면 됩니다')).toBeInTheDocument()
    expect(screen.getByText('지금 입력한 내용')).toBeInTheDocument()
    expect(await screen.findByText('먼저 볼 코드')).toBeInTheDocument()
    expect(screen.getAllByRole('button', { name: '전체 보기' }).length).toBeGreaterThan(0)

    await user.click(screen.getAllByRole('button', { name: '전체 보기' })[0])

    expect(
      screen.getByRole('heading', {
        name: /마곡 입주 상담,\s*업종코드부터 예비판정까지 한 번에/,
      }),
    ).toBeInTheDocument()
  })

  it('전수 코드 사전 화면에서 5자리 코드를 검색할 수 있다', async () => {
    render(<App />)
    const user = userEvent.setup()

    await user.click(screen.getAllByRole('button', { name: '전체 코드 사전 보기' })[0])

    const searchInput = await screen.findByPlaceholderText(
      '예: 광고대행업 / 앱 개발 / 72121 / 63112',
    )

    expect(searchInput).toBeInTheDocument()
    expect(screen.getByText('전용 코드 사전')).toBeInTheDocument()

    await user.type(searchInput, '72121')

    expect(screen.getAllByText('72121').length).toBeGreaterThan(0)
    expect(
      screen.getAllByText('건물 및 토목 엔지니어링 서비스업').length,
    ).toBeGreaterThan(0)

    await user.click(screen.getByRole('button', { name: '검색 홈으로 돌아가기' }))
    expect(
      screen.getByRole('heading', {
        name: /마곡 입주 상담,\s*업종코드부터 예비판정까지 한 번에/,
      }),
    ).toBeInTheDocument()
  })

  it('상단 메뉴의 예비판정 안내를 누르면 practical-guide 섹션으로 이동한다', async () => {
    render(<App />)
    const user = userEvent.setup()
    const scrollIntoViewMock = vi.mocked(Element.prototype.scrollIntoView)

    scrollIntoViewMock.mockClear()

    await user.click(screen.getByRole('button', { name: '예비판정 안내' }))

    await waitFor(() => {
      expect(scrollIntoViewMock).toHaveBeenCalled()
    })
    expect(screen.getByText('실무에서는 보통 이렇게 봅니다')).toBeInTheDocument()
  })

  it('법령 라이브러리와 업데이트 로그 화면으로 이동할 수 있다', async () => {
    render(<App />)
    const user = userEvent.setup()

    await user.click(screen.getByRole('button', { name: '법령 참고' }))

    expect(
      await screen.findByRole('heading', {
        name: /판정에 쓰인 문서를\s*한 번에 볼 수 있습니다/,
      }),
    ).toBeInTheDocument()
    expect(
      screen.getByText('산업집적활성화 및 공장설립에 관한 법률 시행령'),
    ).toBeInTheDocument()
    expect(screen.getByText('국가법령정보센터 본문')).toBeInTheDocument()
    expect(screen.getAllByText('대통령령 제35221호').length).toBeGreaterThan(0)

    await user.click(screen.getByRole('button', { name: '업데이트 로그 보기' }))

    expect(
      await screen.findByRole('heading', {
        name: /최근에 달라진 내용을\s*한 번에 볼 수 있습니다/,
      }),
    ).toBeInTheDocument()
    expect(screen.getByText('레이아웃 시뮬레이션 1차 추가')).toBeInTheDocument()
    expect(screen.getAllByText('서울특별시 고시문 PDF').length).toBeGreaterThan(0)

    await user.click(screen.getByRole('button', { name: '법령 라이브러리 보기' }))

    expect(
      await screen.findByRole('heading', {
        name: /판정에 쓰인 문서를\s*한 번에 볼 수 있습니다/,
      }),
    ).toBeInTheDocument()
  })

  it('대표 가이드 카드에서 업종별 가이드 화면으로 이동할 수 있다', async () => {
    render(<App />)
    const user = userEvent.setup()

    await user.click(
      screen.getByRole('button', { name: '71310 광고 대행업 가이드 보기' }),
    )

    expect(
      await screen.findByRole('heading', {
        name: /71310 광고 대행업 마곡 입주 가이드/,
      }),
    ).toBeInTheDocument()
    expect(screen.getByText('자주 묻는 질문')).toBeInTheDocument()
    expect(screen.getByText('관련 법령')).toBeInTheDocument()
  })

  it('공유 해시로 진입하면 같은 입력의 결과 화면을 바로 복원한다', async () => {
    window.history.replaceState(null, '', createSharedFinderHash(sharedResultInput))

    render(<App />)

    expect(await screen.findByRole('button', { name: '공유 링크 복사' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '판정 요약 복사' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '인쇄 / PDF 저장' })).toBeInTheDocument()
    expect(screen.getAllByText('73905').length).toBeGreaterThan(0)
    expect(screen.getByText('법적 근거 각주')).toBeInTheDocument()
  })

  it('두 구역 동시 비교를 켜면 결과 화면에서 두 구역 판정을 함께 보여준다', async () => {
    render(<App />)
    const user = userEvent.setup()
    const finderSection = screen.getByRole('region', {
      name: '업종코드 분석 위저드',
    })

    await user.click(screen.getAllByRole('button', { name: '직접 입력으로 계속' })[0])

    await user.clear(within(finderSection).getByLabelText('KSIC 코드'))
    await user.type(within(finderSection).getByLabelText('KSIC 코드'), '62010')
    await user.clear(within(finderSection).getByLabelText('업종명'))
    await user.type(
      within(finderSection).getByLabelText('업종명'),
      '컴퓨터 프로그래밍 서비스업',
    )
    await user.click(
      within(finderSection).getByRole('switch', { name: '두 구역 동시 비교' }),
    )
    await user.click(
      within(finderSection).getByRole('button', { name: '두 구역 비교 판정 보기' }),
    )

    await waitFor(() => {
      expect(
        within(finderSection).getByText('지식산업센터와 산업시설구역을 한 번에 비교했습니다.'),
      ).toBeInTheDocument()
    })

    expect(within(finderSection).getByText('두 구역 동시 비교')).toBeInTheDocument()
    expect(within(finderSection).getAllByText('지식산업센터').length).toBeGreaterThan(0)
    expect(within(finderSection).getAllByText('산업시설구역').length).toBeGreaterThan(0)
  })

  it('부업종을 추가하면 결과 화면에서 복수 업종코드를 함께 보여준다', async () => {
    render(<App />)
    const user = userEvent.setup()
    const finderSection = screen.getByRole('region', {
      name: '업종코드 분석 위저드',
    })

    await user.click(screen.getAllByRole('button', { name: '직접 입력으로 계속' })[0])

    await user.clear(within(finderSection).getByLabelText('KSIC 코드'))
    await user.type(within(finderSection).getByLabelText('KSIC 코드'), '62010')
    await user.clear(within(finderSection).getByLabelText('업종명'))
    await user.type(
      within(finderSection).getByLabelText('업종명'),
      '컴퓨터 프로그래밍 서비스업',
    )

    await user.click(within(finderSection).getByRole('button', { name: '업종코드 추가' }))

    await user.type(within(finderSection).getByLabelText('부업종 1 KSIC 코드'), '63110')
    await user.type(within(finderSection).getByLabelText('부업종 1 업종명'), '자료 처리업')

    await user.click(within(finderSection).getByRole('button', { name: '결과 보기' }))

    await waitFor(() => {
      expect(
        within(finderSection).getByText('주업종과 부업종 1개를 한 번에 판정했습니다.'),
      ).toBeInTheDocument()
    })

    expect(within(finderSection).getByText('코드별 결과')).toBeInTheDocument()
    expect(within(finderSection).getByText('주업종')).toBeInTheDocument()
    expect(within(finderSection).getByText('부업종 1')).toBeInTheDocument()
    expect(within(finderSection).getByText('63110 자료 처리업')).toBeInTheDocument()
  }, 10000)

  it('2단계 예외 조건은 관련 조건만 먼저 보여주고 전체 조건 보기로 확장할 수 있다', async () => {
    render(<App />)
    const user = userEvent.setup()
    const finderSection = screen.getByRole('region', {
      name: '업종코드 분석 위저드',
    })

    await user.click(screen.getAllByRole('button', { name: '직접 입력으로 계속' })[0])

    await user.clear(within(finderSection).getByLabelText('KSIC 코드'))
    await user.type(within(finderSection).getByLabelText('KSIC 코드'), '63112')
    await user.clear(within(finderSection).getByLabelText('업종명'))
    await user.type(
      within(finderSection).getByLabelText('업종명'),
      '호스팅 및 관련 서비스업',
    )

    expect(
      within(finderSection).getByText('내 업종에 해당할 수 있는 조건 1개'),
    ).toBeInTheDocument()
    expect(
      within(finderSection).getByText('호스팅 및 관련 서비스업(63112)'),
    ).toBeInTheDocument()
    expect(
      within(finderSection).queryByText('포장 및 충전업'),
    ).not.toBeInTheDocument()

    await user.click(within(finderSection).getByRole('button', { name: '전체 조건 보기' }))

    expect(within(finderSection).getByText('포장 및 충전업')).toBeInTheDocument()
    expect(
      within(finderSection).getByRole('button', { name: '추천 조건만 보기' }),
    ).toBeInTheDocument()
  })

  it('전체 조건에서 켠 예외 조건은 추천 조건만 보기로 돌아가도 계속 보인다', async () => {
    render(<App />)
    const user = userEvent.setup()
    const finderSection = screen.getByRole('region', {
      name: '업종코드 분석 위저드',
    })

    await user.click(screen.getAllByRole('button', { name: '직접 입력으로 계속' })[0])

    await user.clear(within(finderSection).getByLabelText('KSIC 코드'))
    await user.type(within(finderSection).getByLabelText('KSIC 코드'), '62010')
    await user.clear(within(finderSection).getByLabelText('업종명'))
    await user.type(
      within(finderSection).getByLabelText('업종명'),
      '컴퓨터 프로그래밍 서비스업',
    )

    expect(
      within(finderSection).getByText(
        '현재 입력 기준으로 꼭 먼저 볼 조건은 없습니다. 필요할 때 전체 조건을 열어 직접 확인해 주세요.',
      ),
    ).toBeInTheDocument()

    await user.click(within(finderSection).getByRole('button', { name: '전체 조건 보기' }))
    await user.click(
      within(finderSection).getByRole('switch', {
        name: '제조시설 또는 사업화시설 운영 예정',
      }),
    )
    await user.click(
      within(finderSection).getByRole('button', { name: '추천 조건만 보기' }),
    )

    expect(
      within(finderSection).getByText('내 업종에 해당할 수 있는 조건 1개'),
    ).toBeInTheDocument()
    expect(
      within(finderSection).getByText('제조시설 또는 사업화시설 운영 예정'),
    ).toBeInTheDocument()
    expect(within(finderSection).getAllByText('1개 적용 중').length).toBeGreaterThan(0)
  })

  it('판정 결과를 본 뒤 최근 조회에서 같은 상태를 다시 복원할 수 있다', async () => {
    render(<App />)
    const user = userEvent.setup()
    const finderSection = screen.getByRole('region', {
      name: '업종코드 분석 위저드',
    })

    await user.click(screen.getAllByRole('button', { name: '직접 입력으로 계속' })[0])

    await user.clear(within(finderSection).getByLabelText('KSIC 코드'))
    await user.type(within(finderSection).getByLabelText('KSIC 코드'), '62010')
    await user.clear(within(finderSection).getByLabelText('업종명'))
    await user.type(
      within(finderSection).getByLabelText('업종명'),
      '컴퓨터 프로그래밍 서비스업',
    )
    await user.click(within(finderSection).getByRole('button', { name: '결과 보기' }))

    await waitFor(() => {
      expect(within(finderSection).getByRole('button', { name: '공유 링크 복사' })).toBeInTheDocument()
    })

    await user.click(screen.getByRole('button', { name: '최근 조회' }))

    expect(
      screen.getByRole('button', { name: /62010 컴퓨터 프로그래밍 서비스업/ }),
    ).toBeInTheDocument()

    await user.click(within(finderSection).getByRole('button', { name: '조건 다시 수정' }))
    await user.clear(within(finderSection).getByLabelText('KSIC 코드'))
    await user.type(within(finderSection).getByLabelText('KSIC 코드'), '63110')
    await user.clear(within(finderSection).getByLabelText('업종명'))
    await user.type(within(finderSection).getByLabelText('업종명'), '자료 처리업')

    expect(within(finderSection).getByDisplayValue('63110')).toBeInTheDocument()

    await user.click(
      screen.getByRole('button', { name: /62010 컴퓨터 프로그래밍 서비스업/ }),
    )

    await waitFor(() => {
      expect(within(finderSection).getByRole('button', { name: '공유 링크 복사' })).toBeInTheDocument()
    })

    expect(screen.getAllByText('62010').length).toBeGreaterThan(0)
    expect(screen.queryByText('최근 확인한 예비판정을 다시 열 수 있습니다')).not.toBeInTheDocument()
  }, 10000)

  it('결과 각주에서 라이브러리 근거 보기로 바로 이동할 수 있다', async () => {
    render(<App />)
    const user = userEvent.setup()
    const finderSection = screen.getByRole('region', {
      name: '업종코드 분석 위저드',
    })

    await user.click(screen.getAllByRole('button', { name: '직접 입력으로 계속' })[0])

    await user.clear(within(finderSection).getByLabelText('KSIC 코드'))
    await user.type(within(finderSection).getByLabelText('KSIC 코드'), '62010')
    await user.clear(within(finderSection).getByLabelText('업종명'))
    await user.type(
      within(finderSection).getByLabelText('업종명'),
      '컴퓨터 프로그래밍 서비스업',
    )
    await user.click(within(finderSection).getByRole('button', { name: '결과 보기' }))

    await waitFor(() => {
      expect(within(finderSection).getByText('법적 근거 각주')).toBeInTheDocument()
    })

    await user.click(
      within(finderSection).getAllByRole('button', {
        name: /법령 라이브러리에서 근거 보기:/,
      })[0],
    )

    expect(
      await screen.findByRole('heading', {
        name: /판정에 쓰인 문서를\s*한 번에 볼 수 있습니다/,
      }),
    ).toBeInTheDocument()
    expect(window.location.hash).toMatch(/^#library-basis-/)
  })

  it('핵심 퍼널 이벤트를 dataLayer에 기록한다', async () => {
    render(<App />)
    const user = userEvent.setup()
    const finderSection = screen.getByRole('region', {
      name: '업종코드 분석 위저드',
    })

    await user.type(
      screen.getByPlaceholderText(
        '예: 소프트웨어 개발 도급, 온라인 교육 플랫폼 운영, 프랜차이즈 카페 본사',
      ),
      '광고대행업',
    )
    await user.click(screen.getAllByRole('button', { name: '추천 코드 찾기' })[0])

    await waitFor(() => {
      expect(within(finderSection).getByText('추천 결과 확인하기')).toBeInTheDocument()
    })

    expect(
      await within(finderSection).findByText('먼저 볼 코드'),
    ).toBeInTheDocument()

    await user.click(
      within(finderSection).getAllByRole('button', { name: '이 코드로 확인하기' })[0],
    )
    await user.click(within(finderSection).getByRole('button', { name: '결과 보기' }))

    await waitFor(() => {
      expect(within(finderSection).getByText('법적 근거 각주')).toBeInTheDocument()
    })

    await user.click(
      within(finderSection).getAllByRole('button', {
        name: /법령 라이브러리에서 근거 보기:/,
      })[0],
    )

    const eventNames =
      window.dataLayer?.map((entry) => String(entry.event)) ?? []

    expect(eventNames).toEqual(
      expect.arrayContaining([
        'eligibility_search_submitted',
        'eligibility_suggestion_selected',
        'eligibility_evaluation_requested',
        'eligibility_result_viewed',
        'eligibility_library_basis_opened',
      ]),
    )
  })
})
