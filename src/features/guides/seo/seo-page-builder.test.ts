import { describe, expect, it } from 'vitest'

import {
  buildFaqSeoDocument,
  buildGuideSeoDocument,
  buildGuideIndexSeoDocument,
  buildLibraryDetailSeoDocument,
  buildLibraryIndexSeoDocument,
  buildSitemapIndexXml,
  buildSitemapXml,
  buildUpdateDetailSeoDocument,
  buildUpdatesIndexSeoDocument,
} from '@/features/guides/seo/seo-page-builder'
import {
  MAGOK_GUIDE_CATALOG,
  getGuideFaqIndex,
} from '@/features/guides/data/guide-catalog'
import { getLegalLibraryEntryDetails } from '@/features/library/data/legal-library'
import { UPDATE_LOG_ENTRIES } from '@/features/updates/data/update-log'

describe('seo-page-builder', () => {
  it('가이드 공개 페이지 HTML에 canonical과 FAQ 구조화데이터를 넣는다', () => {
    const guide = MAGOK_GUIDE_CATALOG.find((entry) => entry.code === '71310')!
    const document = buildGuideSeoDocument(guide)

    expect(document.filePath).toBe('guides/71310/index.html')
    expect(document.url).toBe('https://loopincode.com/guides/71310/')
    expect(document.html).toContain('<link rel="canonical" href="https://loopincode.com/guides/71310/" />')
    expect(document.html).toContain('<meta name="robots" content="index,follow,max-snippet:-1,max-image-preview:large,max-video-preview:-1" />')
    expect(document.html).toContain('"@type":"FAQPage"')
    expect(document.html).toContain('"@type":"BreadcrumbList"')
    expect(document.html).toContain('71310 광고 대행업 마곡 입주 가이드')
  })

  it('FAQ 공개 페이지 HTML에 질문별 canonical을 넣는다', () => {
    const faqEntry = getGuideFaqIndex().find((entry) => entry.guideCode === '71310')!
    const document = buildFaqSeoDocument(faqEntry)

    expect(document.filePath).toBe(`faq/${faqEntry.faqSlug}/index.html`)
    expect(document.html).toContain(`<link rel="canonical" href="https://loopincode.com${faqEntry.faqPath}" />`)
    expect(document.html).toContain(faqEntry.question)
    expect(document.html).toContain('"@type":"FAQPage"')
  })

  it('58211 가이드 공개 페이지는 제6조 제3항 근거를 포함한다', () => {
    const guide = MAGOK_GUIDE_CATALOG.find((entry) => entry.code === '58211')!
    const document = buildGuideSeoDocument(guide)

    expect(document.filePath).toBe('guides/58211/index.html')
    expect(document.html).toContain('산업집적법 시행령 제6조 제3항')
    expect(document.html).toContain('유선 온라인 게임 소프트웨어 개발 및 공급업')
  })

  it('가이드 색인과 사이트맵 XML을 만들 수 있다', () => {
    const guideIndex = buildGuideIndexSeoDocument(MAGOK_GUIDE_CATALOG.slice(0, 2))
    const sitemap = buildSitemapXml([
      {
        url: 'https://loopincode.com/',
        lastmod: '2026-03-20',
        priority: '1.0',
      },
      {
        url: guideIndex.url,
        lastmod: '2026-03-20',
      },
    ])

    expect(guideIndex.filePath).toBe('guides/index.html')
    expect(guideIndex.html).toContain('마곡 업종별 입주 가이드 모음')
    expect(sitemap).toContain('<loc>https://loopincode.com/</loc>')
    expect(sitemap).toContain('<loc>https://loopincode.com/guides/</loc>')
  })

  it('사이트맵 인덱스 XML을 만들 수 있다', () => {
    const sitemapIndex = buildSitemapIndexXml([
      {
        url: 'https://loopincode.com/sitemaps/core.xml',
        lastmod: '2026-03-20',
      },
      {
        url: 'https://loopincode.com/sitemaps/guides.xml',
        lastmod: '2026-03-20',
      },
    ])

    expect(sitemapIndex).toContain('<sitemapindex')
    expect(sitemapIndex).toContain('<loc>https://loopincode.com/sitemaps/core.xml</loc>')
    expect(sitemapIndex).toContain('<loc>https://loopincode.com/sitemaps/guides.xml</loc>')
  })

  it('법령 라이브러리와 업데이트 로그 공개 페이지를 만들 수 있다', () => {
    const libraryEntries = getLegalLibraryEntryDetails()
    const libraryIndex = buildLibraryIndexSeoDocument(libraryEntries)
    const libraryDetail = buildLibraryDetailSeoDocument(libraryEntries[0]!)
    const updatesIndex = buildUpdatesIndexSeoDocument(UPDATE_LOG_ENTRIES)
    const updateDetail = buildUpdateDetailSeoDocument(UPDATE_LOG_ENTRIES[0]!)

    expect(libraryIndex.filePath).toBe('library/index.html')
    expect(libraryIndex.html).toContain('<link rel="canonical" href="https://loopincode.com/library/" />')
    expect(libraryDetail.filePath).toBe('library/decree/index.html')
    expect(libraryDetail.html).toContain('"@type":"BreadcrumbList"')
    expect(libraryDetail.html).toContain('국가법령정보센터 본문')
    expect(libraryDetail.html).toContain('대통령령 제35221호')
    expect(updatesIndex.filePath).toBe('updates/index.html')
    expect(updatesIndex.html).toContain('<link rel="canonical" href="https://loopincode.com/updates/" />')
    expect(updateDetail.filePath).toBe('updates/legal-library-and-update-log/index.html')
    expect(updateDetail.html).toContain('법령 라이브러리와 업데이트 로그 1차 공개')
    expect(updateDetail.html).toContain('서울특별시 고시문 PDF')
    expect(updateDetail.html).toContain('"isBasedOn"')
  })
})
