import type { CSSProperties } from 'react'

interface CoupangSideBannerProps {
  label: string
  href: string
  imageSrc: string
  style?: CSSProperties
  className?: string
}

export function CoupangSideBanner({
  label,
  href,
  imageSrc,
  style,
  className = '',
}: CoupangSideBannerProps) {
  return (
    <aside
      aria-label={label}
      className={`fixed top-1/2 z-30 hidden -translate-y-1/2 2xl:block ${className}`}
      style={style}
    >
      <a
        href={href}
        target="_blank"
        rel="nofollow sponsored noopener"
        referrerPolicy="unsafe-url"
        className="block overflow-hidden rounded-[24px] border border-[rgba(190,208,234,0.7)] bg-white shadow-[0_24px_44px_rgba(28,33,43,0.16)] transition hover:-translate-y-0.5 hover:shadow-[0_30px_60px_rgba(28,33,43,0.2)]"
      >
        <span className="sr-only">{label}</span>
        <img
          src={imageSrc}
          alt=""
          width={160}
          height={600}
          loading="lazy"
          className="block h-[600px] w-[160px]"
        />
      </a>
    </aside>
  )
}
