import { useEffect, useRef } from 'react'

interface CoupangDynamicBannerConfig {
  id: number
  template: 'carousel'
  trackingCode: string
  width: string
  height: string
  tsource: string
}

interface CoupangDynamicBannerProps {
  label: string
  className?: string
  config: CoupangDynamicBannerConfig
}

type CoupangWindow = Window & {
  PartnersCoupang?: {
    G: new (config: CoupangDynamicBannerConfig) => unknown
  }
}

let coupangScriptPromise: Promise<void> | null = null

function loadCoupangDynamicScript() {
  if (typeof window === 'undefined') {
    return Promise.resolve()
  }

  const coupangWindow = window as CoupangWindow

  if (coupangWindow.PartnersCoupang?.G) {
    return Promise.resolve()
  }

  if (coupangScriptPromise) {
    return coupangScriptPromise
  }

  coupangScriptPromise = new Promise((resolve, reject) => {
    const existingScript = document.querySelector<HTMLScriptElement>(
      'script[data-coupang-dynamic-script="true"]',
    )

    if (existingScript) {
      existingScript.addEventListener('load', () => resolve(), { once: true })
      existingScript.addEventListener(
        'error',
        () => reject(new Error('쿠팡 다이나믹 배너 스크립트를 불러오지 못했습니다.')),
        { once: true },
      )
      return
    }

    const script = document.createElement('script')
    script.src = 'https://ads-partners.coupang.com/g.js'
    script.async = true
    script.dataset.coupangDynamicScript = 'true'
    script.onload = () => resolve()
    script.onerror = () =>
      reject(new Error('쿠팡 다이나믹 배너 스크립트를 불러오지 못했습니다.'))
    document.head.appendChild(script)
  })

  return coupangScriptPromise
}

export function CoupangDynamicBanner({
  label,
  className = '',
  config,
}: CoupangDynamicBannerProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current

    if (!container) {
      return
    }

    let disposed = false
    container.innerHTML = ''

    void loadCoupangDynamicScript()
      .then(() => {
        if (disposed) {
          return
        }

        const inlineScript = document.createElement('script')
        inlineScript.type = 'text/javascript'
        inlineScript.text = `new PartnersCoupang.G(${JSON.stringify(config)});`
        container.appendChild(inlineScript)
      })
      .catch(() => {
        if (!disposed) {
          container.innerHTML = ''
        }
      })

    return () => {
      disposed = true
      container.innerHTML = ''
    }
  }, [config])

  return (
    <aside
      aria-label={label}
      className={`fixed top-1/2 z-30 hidden -translate-y-1/2 overflow-hidden rounded-[24px] border border-[var(--border)] bg-white shadow-[0_18px_40px_rgba(28,33,43,0.18)] 2xl:block ${className}`}
    >
      <span className="sr-only">{label}</span>
      <div
        ref={containerRef}
        className="flex h-[600px] w-[160px] items-center justify-center bg-white"
      />
    </aside>
  )
}
