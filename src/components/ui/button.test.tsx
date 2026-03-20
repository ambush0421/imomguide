import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { Button } from '@/components/ui/button'

describe('Button', () => {
  it('loading 상태에서 스피너와 비활성화, aria-busy를 함께 적용한다', () => {
    render(<Button loading>추천 코드 찾는 중...</Button>)

    const button = screen.getByRole('button', { name: '추천 코드 찾는 중...' })

    expect(button).toBeDisabled()
    expect(button).toHaveAttribute('aria-busy', 'true')
    expect(button).toHaveTextContent('추천 코드 찾는 중...')
    expect(button.querySelector('svg')).not.toBeNull()
  })
})
