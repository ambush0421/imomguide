import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import App from '@/App'

describe('App', () => {
  it('초기 랜딩과 빈 상태를 렌더링한다', () => {
    render(<App />)

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
      screen.getByText('업종을 고르면 결과가 여기에 바로 나옵니다.'),
    ).toBeInTheDocument()
    expect(screen.getByText('업무용 추천 상품')).toBeInTheDocument()
    expect(screen.getByText('제휴 안내')).toBeInTheDocument()
    expect(screen.getByText('문의: contact.loopinlab@gmail.com')).toBeInTheDocument()
    expect(
      screen.getByRole('link', { name: /추천 상품 보기/i }),
    ).toHaveAttribute('href', 'https://link.coupang.com/a/d7nWco')
    expect(
      screen.getByRole('link', { name: /추가 추천 보기/i }),
    ).toHaveAttribute('href', 'https://link.coupang.com/a/d7n7ta')
    expect(screen.getByTitle('쿠팡 파트너스 상품 위젯')).toBeInTheDocument()
    expect(
      screen.getAllByRole('link', { name: /쿠팡 파트너스 사이드 배너/i }),
    ).toHaveLength(2)
  })
})
