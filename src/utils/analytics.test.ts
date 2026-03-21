import { beforeEach, describe, expect, it, vi } from 'vitest'

import { trackEvent } from '@/utils/analytics'

describe('trackEvent', () => {
  beforeEach(() => {
    window.dataLayer = []
    window.gtag = undefined
  })

  it('dataLayer가 있으면 이벤트를 push한다', () => {
    trackEvent('eligibility_search_submitted', {
      zone_type: 'knowledgeIndustryCenter',
      compare_zones: false,
    })

    expect(window.dataLayer).toEqual([
      {
        event: 'eligibility_search_submitted',
        zone_type: 'knowledgeIndustryCenter',
        compare_zones: false,
      },
    ])
  })

  it('gtag가 있으면 같은 payload로 이벤트를 보낸다', () => {
    window.gtag = vi.fn()

    trackEvent('eligibility_result_viewed', {
      verdict: 'eligible',
      compare_zones: true,
      additional_code_count: 1,
    })

    expect(window.gtag).toHaveBeenCalledWith('event', 'eligibility_result_viewed', {
      verdict: 'eligible',
      compare_zones: true,
      additional_code_count: 1,
    })
  })
})
