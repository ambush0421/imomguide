import React from 'react'
import { Menu, X, Clock3 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

// 헤더가 받을 Props 정의
export interface HeaderProps {
  brandAssets: { symbol: string; logotype: string }
  view: 'home' | 'directory' | 'library' | 'updates'
  activeZoneLabel: string
  isMobileMenuOpen: boolean
  setIsMobileMenuOpen: React.Dispatch<React.SetStateAction<boolean>>
  isHistoryOpen: boolean
  setIsHistoryOpen: React.Dispatch<React.SetStateAction<boolean>>
  onOpenHomeView: (section: string) => void
  onOpenDirectoryView: () => void
  onOpenLibraryView: () => void
  onToggleHistory: () => void
}

export function Header({
  brandAssets,
  view,
  activeZoneLabel,
  isMobileMenuOpen,
  setIsMobileMenuOpen,
  isHistoryOpen,
  setIsHistoryOpen,
  onOpenHomeView,
  onOpenDirectoryView,
  onOpenLibraryView,
  onToggleHistory
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-[var(--border-subtle)] bg-[var(--surface-header)]/80 backdrop-blur-xl sm:rounded-[18px] sm:top-4 sm:mx-auto sm:w-[calc(100%-2rem)] sm:border sm:px-4 sm:py-3 px-3 py-2 shadow-sm transition-all duration-200">
      <div className="mx-auto flex h-14 items-center justify-between gap-4 max-w-[1180px]">
        
        {/* Logo Section */}
        <div className="flex items-center gap-2 md:min-w-0 md:flex-1">
          <button
            type="button"
            onClick={() => onOpenHomeView('top')}
            className="flex items-center gap-3 pr-2 text-left md:flex-none hover:opacity-80 transition-opacity"
            aria-label="홈으로 이동"
          >
            <div className="inline-flex size-9 sm:size-10 items-center justify-center overflow-hidden rounded-[12px] ring-1 ring-[var(--border-accent)] shadow-sm">
              <img
                src={brandAssets.symbol}
                alt="Logo"
                width="40"
                height="40"
                className="size-full object-cover"
              />
            </div>
            <div className="min-w-0 hidden sm:block">
              <div className="truncate text-[11px] font-semibold tracking-wider text-[var(--foreground-subtle)]">MAGOK CODE</div>
              <div className="truncate text-sm font-bold text-[var(--foreground)]">마곡 입주 도우미</div>
            </div>
          </button>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-2">
          <Button variant={view === 'home' ? 'secondary' : 'ghost'} size="sm" onClick={() => onOpenHomeView('finder')} className="whitespace-nowrap rounded-full">검색</Button>
          <Button variant={view === 'directory' ? 'secondary' : 'ghost'} size="sm" onClick={onOpenDirectoryView} className="whitespace-nowrap rounded-full">코드 사전</Button>
          <Button variant="ghost" size="sm" onClick={() => onOpenHomeView('practical-guide')} className="whitespace-nowrap rounded-full">가이드</Button>
          <Button variant={view === 'library' ? 'secondary' : 'ghost'} size="sm" onClick={onOpenLibraryView} className="whitespace-nowrap rounded-full">자료실</Button>
        </nav>

        {/* Right Section (History & Mobile Toggle) */}
        <div className="flex items-center gap-2">
          <div className="hidden md:flex items-center gap-2">
             <Badge variant="muted" className="hidden xl:inline-flex">{activeZoneLabel} 기준</Badge>
             <Button
              variant={isHistoryOpen ? 'secondary' : 'outline'}
              size="sm"
              onClick={onToggleHistory}
              className="whitespace-nowrap rounded-full border-[var(--border)]"
            >
              <Clock3 className="size-4 mr-1.5" />
              히스토리
            </Button>
          </div>

          <button
            type="button"
            className="inline-flex size-10 items-center justify-center rounded-[12px] text-[var(--foreground-muted)] hover:bg-[var(--surface-muted)] lg:hidden"
            onClick={() => {
              setIsHistoryOpen(false)
              setIsMobileMenuOpen((prev) => !prev)
            }}
          >
            {isMobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Panel */}
      {isMobileMenuOpen && (
        <nav className="mt-2 flex flex-col gap-1 border-t border-[var(--border-soft)] pt-2 pb-2 lg:hidden animate-in slide-in-from-top-2">
          <Button variant={view === 'home' ? 'secondary' : 'ghost'} size="sm" onClick={() => { onOpenHomeView('finder'); setIsMobileMenuOpen(false) }} className="justify-start">검색</Button>
          <Button variant={view === 'directory' ? 'secondary' : 'ghost'} size="sm" onClick={() => { onOpenDirectoryView(); setIsMobileMenuOpen(false) }} className="justify-start">코드 사전</Button>
          <Button variant="ghost" size="sm" onClick={() => { onOpenHomeView('practical-guide'); setIsMobileMenuOpen(false) }} className="justify-start">가이드</Button>
          <Button variant={view === 'library' ? 'secondary' : 'ghost'} size="sm" onClick={() => { onOpenLibraryView(); setIsMobileMenuOpen(false) }} className="justify-start">자료실</Button>
          <div className="mt-2 border-t border-[var(--border-soft)] pt-2 md:hidden">
            <Button variant="outline" size="sm" onClick={() => { onToggleHistory(); setIsMobileMenuOpen(false) }} className="w-full justify-start">
              <Clock3 className="size-4 mr-2" /> 히스토리
            </Button>
          </div>
        </nav>
      )}
    </header>
  )
}
