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
      className={`fixed top-28 z-30 hidden lg:block ${className}`}
      style={style}
    >
      <div className="h-[270px] w-[72px] xl:h-[330px] xl:w-[88px] 2xl:h-[420px] 2xl:w-[112px] min-[1800px]:h-[480px] min-[1800px]:w-[128px] min-[2100px]:h-[600px] min-[2100px]:w-[160px]">
        <div className="origin-top-left scale-[0.45] xl:scale-[0.55] 2xl:scale-[0.7] min-[1800px]:scale-[0.8] min-[2100px]:scale-100">
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
        </div>
      </div>
    </aside>
  )
}
