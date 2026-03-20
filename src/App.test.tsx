import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import App from '@/App'
import { useEligibilityStore } from '@/store/eligibility-store'

describe('App', () => {
  beforeEach(() => {
    useEligibilityStore.getState().reset()
    window.history.replaceState(null, '', '#top')
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

  it('초기에는 쉬운 검색 홈과 전수 코드 사전 진입이 함께 보인다', async () => {
    render(<App />)
    const user = userEvent.setup()
    const finderSection = screen.getByRole('region', {
      name: '업종코드 분석 위저드',
    })

    expect(screen.getAllByText('마곡 코드찾기').length).toBeGreaterThan(0)
    expect(
      screen.getByRole('heading', {
        name: /입주 가능한 업종코드를\s*쉽게 찾고\s*바로 확인합니다/,
      }),
    ).toBeInTheDocument()
    expect(screen.getByText('전체 전수 코드')).toBeInTheDocument()
    expect(screen.getByText('가능 코드 전체 보기')).toBeInTheDocument()
    expect(within(finderSection).getByText('어떤 일을 하시나요?')).toBeInTheDocument()
    expect(screen.getByText('참고용 제휴 링크')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /사무환경 참고 상품 펼치기/i })).toBeInTheDocument()
    expect(screen.queryByText('광고·제휴 안내')).not.toBeInTheDocument()
    expect(screen.queryByTitle('쿠팡 파트너스 추천 위젯 모바일기기')).not.toBeInTheDocument()
    expect(screen.queryByTitle('쿠팡 파트너스 추천 위젯 생수')).not.toBeInTheDocument()
    expect(screen.queryByTitle('쿠팡 파트너스 추천 위젯 업무기기')).not.toBeInTheDocument()
    expect(screen.queryByTitle('쿠팡 파트너스 추천 위젯 소모품')).not.toBeInTheDocument()
    expect(screen.queryAllByText(/쿠팡 파트너스 사이드 배너/i)).toHaveLength(0)

    await user.click(screen.getByRole('button', { name: /사무환경 참고 상품 펼치기/i }))

    expect(screen.getByText('광고·제휴 안내')).toBeInTheDocument()
    expect(screen.getByTitle('쿠팡 파트너스 추천 위젯 모바일기기')).toBeInTheDocument()
    expect(screen.getByTitle('쿠팡 파트너스 추천 위젯 생수')).toBeInTheDocument()
    expect(screen.getByTitle('쿠팡 파트너스 추천 위젯 업무기기')).toBeInTheDocument()
    expect(screen.getByTitle('쿠팡 파트너스 추천 위젯 소모품')).toBeInTheDocument()

    await user.click(screen.getByRole('tab', { name: '지식산업센터' }))
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
      within(finderSection).getByPlaceholderText(/업태: 서비스 \/ 종목: 광고대행업/i),
      '광고대행업',
    )
    await user.click(
      within(finderSection).getByRole('button', { name: '추천 코드 찾기' }),
    )

    expect(
      await within(finderSection).findByRole('heading', {
        name: '추천 결과 확인하기',
      }),
    ).toBeInTheDocument()
    expect(within(finderSection).queryByText('어떤 일을 하시나요?')).not.toBeInTheDocument()
    expect(
      within(finderSection).getByText('추천된 코드 중 하나를 고르면 다음 화면으로 넘어갑니다.'),
    ).toBeInTheDocument()
    expect(
      await within(finderSection).findByText('바로 확인할 수 있는 추천 코드'),
    ).toBeInTheDocument()

    await user.click(
      within(finderSection).getAllByRole('button', { name: '이 코드로 확인하기' })[0],
    )

    expect(await within(finderSection).findByText('선택한 업종코드')).toBeInTheDocument()
    expect(within(finderSection).getByDisplayValue('71310')).toBeInTheDocument()
    expect(within(finderSection).getByDisplayValue('광고 대행업')).toBeInTheDocument()

    await user.click(within(finderSection).getByRole('button', { name: '결과 보기' }))

    await waitFor(() => {
      expect(within(finderSection).getByText('업종코드 상세 해설')).toBeInTheDocument()
    })

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

    await user.click(
      within(finderSection).getByRole('button', { name: '직접 입력으로 계속' }),
    )

    expect(await within(finderSection).findByText('선택한 업종코드')).toBeInTheDocument()
    expect(within(finderSection).getByText('직접 입력 예정')).toBeInTheDocument()
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

    await user.click(screen.getByRole('button', { name: '코드 추천받기' }))

    expect(
      screen.queryByRole('heading', {
        name: /입주 가능한 업종코드를\s*쉽게 찾고\s*바로 확인합니다/,
      }),
    ).not.toBeInTheDocument()
    expect(screen.queryByText('참고용 제휴 링크')).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: '전체 보기' })).toBeInTheDocument()
    expect(screen.getByText('어떤 일을 하시나요?')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: '전체 보기' }))

    expect(
      screen.getByRole('heading', {
        name: /입주 가능한 업종코드를\s*쉽게 찾고\s*바로 확인합니다/,
      }),
    ).toBeInTheDocument()
  })

  it('데스크톱에서는 위저드 진입 후 중앙 단계와 우측 참고 패널을 함께 보여준다', async () => {
    render(<App />)
    const user = userEvent.setup()

    await user.click(screen.getByRole('button', { name: '코드 추천받기' }))

    expect(
      screen.queryByRole('heading', {
        name: /입주 가능한 업종코드를\s*쉽게 찾고\s*바로 확인합니다/,
      }),
    ).not.toBeInTheDocument()
    expect(screen.getByText('지금은 이 흐름만 보면 됩니다')).toBeInTheDocument()
    expect(screen.getByText('지금 입력한 내용')).toBeInTheDocument()
    expect(screen.getByText('어떤 일을 하시나요?')).toBeInTheDocument()
    expect(screen.getAllByRole('button', { name: '전체 보기' }).length).toBeGreaterThan(0)

    await user.click(screen.getAllByRole('button', { name: '전체 보기' })[0])

    expect(
      screen.getByRole('heading', {
        name: /입주 가능한 업종코드를\s*쉽게 찾고\s*바로 확인합니다/,
      }),
    ).toBeInTheDocument()
  })

  it('전수 코드 사전 화면에서 5자리 코드를 검색할 수 있다', async () => {
    render(<App />)
    const user = userEvent.setup()

    await user.click(screen.getByRole('button', { name: '가능 코드 전체 보기' }))

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
        name: /입주 가능한 업종코드를\s*쉽게 찾고\s*바로 확인합니다/,
      }),
    ).toBeInTheDocument()
  })

  it('법령 라이브러리와 업데이트 로그 화면으로 이동할 수 있다', async () => {
    render(<App />)
    const user = userEvent.setup()

    await user.click(screen.getByRole('button', { name: '법령 라이브러리' }))

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
})
