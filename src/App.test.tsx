import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import App from '@/App'

describe('App', () => {
  it('초기 랜딩과 빈 상태를 렌더링한다', () => {
    render(<App />)

    expect(screen.getAllByText('마곡 코드찾기').length).toBeGreaterThan(0)
    expect(
      screen.getByRole('heading', {
        name: /마곡 업종코드,\s*설명만 넣으면 바로 찾습니다\./,
      }),
    ).toBeInTheDocument()
    expect(
      screen.getByText('지금 바로 업종코드를 찾아보세요'),
    ).toBeInTheDocument()
    expect(
      screen.getByText('업종을 고르면 결과가 여기에 바로 나옵니다.'),
    ).toBeInTheDocument()
  })
})
