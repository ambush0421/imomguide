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
    expect(screen.getByText('승인용 제휴영역')).toBeInTheDocument()
    expect(screen.getByText('실제 제휴 요소는 이 구역에 넣어 주세요')).toBeInTheDocument()
    expect(screen.getByText('운영자 정보')).toBeInTheDocument()
    expect(screen.getByText('쿠팡 파트너스 안내')).toBeInTheDocument()
    expect(screen.getByText('문의 이메일: contact.loopinlab@gmail.com')).toBeInTheDocument()
  })
})
