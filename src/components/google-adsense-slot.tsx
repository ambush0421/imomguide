import { useEffect, useRef, useState } from 'react'

import { AsyncState } from '@/components/async-state'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

declare global {
  interface Window {
    adsbygoogle?: Array<Record<string, unknown>>
  }
}

const ADSENSE_CLIENT_ID = 'ca-pub-2916041253392911'
const AD_STATUS_CHECK_DELAY_MS = 6000

type GoogleAdSenseSlotStatus =
  | 'idle'
  | 'loading'
  | 'ready'
  | 'empty'
  | 'error'

export interface GoogleAdSenseSlotProps {
  slotId?: string
  title?: string
  description?: string
  className?: string
  showDiagnostics?: boolean
}

export function GoogleAdSenseSlot({
  slotId,
  title = '스폰서 링크',
  description = '광고가 준비되면 이 영역에 표시됩니다.',
  className,
  showDiagnostics = false,
}: GoogleAdSenseSlotProps) {
  const normalizedSlotId = slotId?.trim() ?? ''
  const slotRef = useRef<HTMLModElement>(null)
  const requestedAdRef = useRef(false)
  const [status, setStatus] = useState<GoogleAdSenseSlotStatus>(() =>
    normalizedSlotId ? 'idle' : 'empty',
  )

  useEffect(() => {
    if (!normalizedSlotId) {
      return
    }

    if (requestedAdRef.current) {
      return
    }

    if (typeof window === 'undefined') {
      return
    }

    let retryTimerId: number | null = null
    let retryCount = 0

    const requestAd = () => {
      const adsbygoogle = window.adsbygoogle

      if (Array.isArray(adsbygoogle)) {
        requestedAdRef.current = true
        setStatus('loading')

        try {
          adsbygoogle.push({})
        } catch {
          setStatus('error')
        }

        return
      }

      if (retryCount >= 20) {
        setStatus('error')
        return
      }

      retryCount += 1
      retryTimerId = window.setTimeout(requestAd, 250)
    }

    requestAd()

    return () => {
      if (retryTimerId !== null) {
        window.clearTimeout(retryTimerId)
      }
    }
  }, [normalizedSlotId])

  useEffect(() => {
    if (status !== 'loading') {
      return
    }

    const timerId = window.setTimeout(() => {
      const slotElement = slotRef.current

      if (!slotElement) {
        setStatus('error')
        return
      }

      const adStatus = slotElement.getAttribute('data-ad-status')
      const computedStyle = window.getComputedStyle(slotElement)
      const adIframe = slotElement.querySelector('iframe')
      const iframeRect = adIframe?.getBoundingClientRect()

      const isHidden =
        computedStyle.display === 'none' ||
        adStatus === 'unfilled' ||
        (iframeRect ? iframeRect.width === 0 && iframeRect.height === 0 : false)

      setStatus(isHidden ? 'empty' : 'ready')
    }, AD_STATUS_CHECK_DELAY_MS)

    return () => {
      window.clearTimeout(timerId)
    }
  }, [status])

  if (!normalizedSlotId) {
    if (!showDiagnostics) {
      return null
    }

    return (
      <AsyncState
        variant="empty"
        title="광고 슬롯 ID가 아직 연결되지 않았습니다"
        description="AdSense에서 생성한 Display ads 슬롯 ID를 `VITE_ADSENSE_SLOT_HOME_INLINE`에 넣으면 이 위치에 수동 광고를 표시할 수 있습니다."
        className={className}
      />
    )
  }

  if ((status === 'empty' || status === 'error') && !showDiagnostics) {
    return null
  }

  return (
    <section className={className} aria-label={title}>
      <Card className="border-[var(--border)] bg-[var(--surface-strong)] shadow-[var(--shadow-sm)]">
        <CardContent className="space-y-4 p-5 sm:p-6">
          <div className="space-y-3">
            <Badge variant="muted" className="w-fit">
              광고
            </Badge>
            <div>
              <h2 className="font-display text-xl font-semibold text-[var(--foreground)] sm:text-2xl">
                {title}
              </h2>
              <p className="mt-2 text-sm leading-6 text-[var(--foreground-muted)]">
                {description}
              </p>
            </div>
          </div>

          <div className="relative min-h-[280px] rounded-[16px] border border-[var(--border)] bg-[var(--surface-soft)] p-3 sm:min-h-[320px] sm:p-4">
            {status === 'loading' ? (
              <div className="absolute inset-3 flex animate-pulse items-center justify-center rounded-[12px] border border-dashed border-[var(--border)] bg-[var(--surface-strong)] px-4 text-center">
                <div className="space-y-2">
                  <div className="text-sm font-semibold text-[var(--foreground)]">
                    광고 영역을 불러오는 중입니다
                  </div>
                  <p className="text-xs leading-5 text-[var(--foreground-muted)]">
                    수초 안에 광고가 채워지지 않으면 이 영역은 자동으로 숨겨집니다.
                  </p>
                </div>
              </div>
            ) : null}

            <ins
              ref={slotRef}
              className={cn(
                'adsbygoogle block h-full min-h-[248px] w-full overflow-hidden rounded-[12px]',
                status === 'loading' ? 'opacity-0' : 'opacity-100',
              )}
              style={{ display: 'block' }}
              data-ad-client={ADSENSE_CLIENT_ID}
              data-ad-slot={normalizedSlotId}
              data-ad-format="auto"
              data-full-width-responsive="true"
            />
          </div>

          {status === 'empty' && showDiagnostics ? (
            <AsyncState
              variant="empty"
              title="현재 채워진 광고가 없습니다"
              description="AdSense 요청은 시도됐지만 현재 이 위치를 채울 광고가 없거나, 계정/사이트 상태 때문에 송출이 거절됐을 수 있습니다."
            />
          ) : null}

          {status === 'error' && showDiagnostics ? (
            <AsyncState
              variant="error"
              title="광고 스크립트를 바로 초기화하지 못했습니다"
              description="AdSense 스크립트 로드 순서나 계정 상태를 확인한 뒤 다시 시도해 주세요."
            />
          ) : null}
        </CardContent>
      </Card>
    </section>
  )
}
