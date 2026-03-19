import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'

import App from '@/App'
import { useEligibilityStore } from '@/store/eligibility-store'

describe('App', () => {
  beforeEach(() => {
    useEligibilityStore.getState().reset()
  })

  it('초기에는 1단계만 크게 보이고 참고 섹션은 하단에 유지된다', async () => {
    render(<App />)
    const user = userEvent.setup()
    const finderSection = screen.getByRole('region', {
      name: '업종코드 분석 위저드',
    })

    expect(screen.getAllByText('마곡 코드찾기').length).toBeGreaterThan(0)
    expect(
      screen.getByRole('heading', {
        name: /업종코드 찾기부터\s*입주 가능성 확인까지\s*한 화면에서 끝냅니다\./,
      }),
    ).toBeInTheDocument()
    expect(
      screen.getByText('지금 바로 업종코드를 찾고 결과를 확인하세요'),
    ).toBeInTheDocument()
    expect(
      within(finderSection).getByText(
        '사업 설명이나 사업자등록증 업태·종목을 넣고 가장 가까운 업종코드를 먼저 찾습니다.',
      ),
    ).toBeInTheDocument()
    expect(screen.getAllByText('지식산업센터').length).toBeGreaterThan(0)
    expect(within(finderSection).getByText('어떤 사업을 하시나요?')).toBeInTheDocument()
    expect(screen.queryByText('업종코드 상세 해설')).not.toBeInTheDocument()

    expect(screen.getByText('업무용 추천 상품')).toBeInTheDocument()
    expect(screen.getByText('광고·제휴 안내')).toBeInTheDocument()
    expect(screen.getAllByText('모바일 기기').length).toBeGreaterThan(0)
    expect(screen.getAllByText('생수/비품').length).toBeGreaterThan(0)
    expect(screen.getByText('핸드폰과 태블릿')).toBeInTheDocument()
    expect(screen.getByText('탕비실 추천')).toBeInTheDocument()
    expect(screen.getByText('생수와 비품')).toBeInTheDocument()
    expect(screen.getByText('문의: contact.loopinlab@gmail.com')).toBeInTheDocument()
    expect(
      screen.getByRole('link', { name: /추천 상품 보기/i }),
    ).toHaveAttribute('href', 'https://link.coupang.com/a/d7nWco')
    expect(
      screen.getByRole('link', { name: /추가 상품 보기/i }),
    ).toHaveAttribute('href', 'https://link.coupang.com/a/d7n7ta')
    expect(screen.getByTitle('쿠팡 파트너스 추천 위젯 모바일기기')).toBeInTheDocument()
    expect(screen.getByTitle('쿠팡 파트너스 추천 위젯 생수')).toBeInTheDocument()
    expect(screen.getByTitle('쿠팡 파트너스 추천 위젯 업무기기')).toBeInTheDocument()
    expect(screen.getByTitle('쿠팡 파트너스 추천 위젯 소모품')).toBeInTheDocument()
    expect(screen.getByText('많이 찾는 업무 준비 품목')).toBeInTheDocument()
    expect(screen.getAllByText('상품 자세히 보기')).toHaveLength(4)
    expect(
      screen.getAllByText(/쿠팡 파트너스 사이드 배너/i),
    ).toHaveLength(2)

    await user.click(screen.getByRole('tab', { name: '지식산업센터' }))
    expect(screen.getByText('시행령 제6조제2항 1~27호 대응표')).toBeInTheDocument()
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
      within(finderSection).getByRole('button', { name: '업종코드 찾기' }),
    )

    expect(await within(finderSection).findByText('정확히 찾은 후보')).toBeInTheDocument()
    await user.click(
      within(finderSection).getAllByRole('button', { name: '이 업종으로 계속' })[0],
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
})
