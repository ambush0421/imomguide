import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'

import { RulebookTabs } from '@/features/eligibility/components/rulebook-tabs'

describe('RulebookTabs', () => {
  it('58211 검색 시 제6조제3항제2호 소프트웨어 개발 및 공급업 묶음으로 보여준다', async () => {
    const user = userEvent.setup()

    render(<RulebookTabs />)

    await user.click(screen.getByRole('tab', { name: '지식산업센터' }))
    await user.type(
      screen.getByPlaceholderText('예: 72121, 교육서비스업, 호스팅'),
      '58211',
    )

    expect(screen.getByText('시행령 제6조제3항 1~5호 대응표')).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: '소프트웨어 개발 및 공급업' }),
    ).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: '출판업' })).not.toBeInTheDocument()
    expect(
      screen.getByText('현재 KSIC 대응: 582xx(58211, 58212, 58219, 58221, 58222)'),
    ).toBeInTheDocument()
  })
})
