import type { CSSProperties } from 'react'

interface CoupangSideBannerProps {
  label: string
  iframeSrc: string
  style?: CSSProperties
  className?: string
}

export function CoupangSideBanner({
  label,
  iframeSrc,
  style,
  className = '',
}: CoupangSideBannerProps) {
  return (
    <aside
      aria-label={label}
      className={`fixed top-1/2 z-30 hidden -translate-y-1/2 2xl:block ${className}`}
      style={style}
    >
      <div className="overflow-hidden rounded-[24px] border border-[rgba(190,208,234,0.7)] bg-white shadow-[0_24px_44px_rgba(28,33,43,0.16)]">
        <span className="sr-only">{label}</span>
        <iframe
          src={iframeSrc}
          title={label}
          width="160"
          height="600"
          frameBorder="0"
          scrolling="no"
          referrerPolicy="unsafe-url"
          loading="lazy"
          className="block h-[600px] w-[160px] bg-white"
          style={{ colorScheme: 'light' }}
        />
      </div>
    </aside>
  )
}
