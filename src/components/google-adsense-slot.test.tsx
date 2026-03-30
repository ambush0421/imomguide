import { render, screen, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { GoogleAdSenseSlot } from '@/components/google-adsense-slot'

describe('GoogleAdSenseSlot', () => {
  beforeEach(() => {
    window.adsbygoogle = []
  })

  afterEach(() => {
    window.adsbygoogle = undefined
  })

  it('슬롯 ID가 없으면 진단 모드가 아닐 때 렌더링하지 않는다', () => {
    const { container } = render(<GoogleAdSenseSlot />)

    expect(container).toBeEmptyDOMElement()
  })

  it('슬롯 ID가 있으면 adsbygoogle push를 호출한다', async () => {
    const push = vi.fn()
    window.adsbygoogle = Object.assign([], { push })

    render(<GoogleAdSenseSlot slotId="1234567890" />)

    await waitFor(() => {
      expect(push).toHaveBeenCalledWith({})
    })
  })

  it('진단 모드에서는 슬롯 ID가 없을 때 안내 문구를 보여준다', () => {
    render(<GoogleAdSenseSlot showDiagnostics />)

    expect(
      screen.getByText('광고 슬롯 ID가 아직 연결되지 않았습니다'),
    ).toBeInTheDocument()
  })
})
