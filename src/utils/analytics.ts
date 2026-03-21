type AnalyticsPrimitive = string | number | boolean

export type AnalyticsPayload = Record<
  string,
  AnalyticsPrimitive | null | undefined
>

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>
    gtag?: (
      command: 'event',
      eventName: string,
      eventParams?: Record<string, unknown>,
    ) => void
  }
}

function normalizePayload(payload: AnalyticsPayload) {
  return Object.fromEntries(
    Object.entries(payload).filter(([, value]) => value !== undefined && value !== null),
  )
}

export function trackEvent(eventName: string, payload: AnalyticsPayload = {}) {
  if (typeof window === 'undefined') {
    return
  }

  const normalizedPayload = normalizePayload(payload)

  if (Array.isArray(window.dataLayer)) {
    window.dataLayer.push({
      event: eventName,
      ...normalizedPayload,
    })
  }

  if (typeof window.gtag === 'function') {
    window.gtag('event', eventName, normalizedPayload)
  }
}
