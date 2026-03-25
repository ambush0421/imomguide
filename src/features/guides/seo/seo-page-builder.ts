import type {
  GuideFaqIndexEntry,
  MagokGuideEntry,
} from '@/features/guides/data/guide-catalog'
import type {
  LegalLibraryEntryDetail,
  SourceReference,
} from '@/features/library/data/legal-library'
import type { UpdateLogEntry } from '@/features/updates/data/update-log'

const SITE_URL = 'https://loopincode.com'
const BRAND_NAME = '마곡 코드찾기'
const DEFAULT_OG_IMAGE = `${SITE_URL}/favicon.svg`

interface SeoPageDocument {
  filePath: string
  html: string
  url: string
}

function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
}

function stripHtml(value: string) {
  return value.replace(/<[^>]+>/g, '')
}

function truncateText(value: string, maxLength: number) {
  if (value.length <= maxLength) {
    return value
  }

  return `${value.slice(0, maxLength - 1).trim()}…`
}

function buildMetaTags({
  title,
  description,
  canonicalUrl,
  structuredData,
}: {
  title: string
  description: string
  canonicalUrl: string
  structuredData: unknown[]
}) {
  const escapedTitle = escapeHtml(title)
  const escapedDescription = escapeHtml(description)
  const escapedCanonicalUrl = escapeHtml(canonicalUrl)
  const structuredDataJson = JSON.stringify(structuredData).replaceAll(
    '</script',
    '<\\/script',
  )

  return [
    '<meta charset="UTF-8" />',
    '<meta name="viewport" content="width=device-width, initial-scale=1.0" />',
    '<meta name="robots" content="index,follow,max-snippet:-1,max-image-preview:large,max-video-preview:-1" />',
    `<title>${escapedTitle}</title>`,
    `<meta name="description" content="${escapedDescription}" />`,
    `<link rel="canonical" href="${escapedCanonicalUrl}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:site_name" content="${escapeHtml(BRAND_NAME)}" />`,
    `<meta property="og:title" content="${escapedTitle}" />`,
    `<meta property="og:description" content="${escapedDescription}" />`,
    `<meta property="og:url" content="${escapedCanonicalUrl}" />`,
    `<meta property="og:image" content="${escapeHtml(DEFAULT_OG_IMAGE)}" />`,
    '<meta name="twitter:card" content="summary_large_image" />',
    `<meta name="twitter:title" content="${escapedTitle}" />`,
    `<meta name="twitter:description" content="${escapedDescription}" />`,
    `<meta name="twitter:image" content="${escapeHtml(DEFAULT_OG_IMAGE)}" />`,
    `<script type="application/ld+json">${structuredDataJson}</script>`,
  ].join('\n    ')
}

function buildDocument({
  title,
  description,
  canonicalUrl,
  body,
  structuredData,
}: {
  title: string
  description: string
  canonicalUrl: string
  body: string
  structuredData: unknown[]
}) {
  return `<!doctype html>
<html lang="ko">
  <head>
    ${buildMetaTags({ title, description, canonicalUrl, structuredData })}
    <style>
      :root {
        color-scheme: light;
        --bg: #f4f8ff;
        --panel: rgba(255,255,255,0.96);
        --line: rgba(43,109,255,0.14);
        --text: #1f2a3d;
        --muted: #5a6a82;
        --accent: #2b6dff;
      }
      * { box-sizing: border-box; }
      body {
        margin: 0;
        font-family: "Pretendard", "Noto Sans KR", sans-serif;
        background: linear-gradient(180deg, #f7faff 0%, #eef4ff 100%);
        color: var(--text);
      }
      main {
        width: min(1120px, calc(100% - 32px));
        margin: 0 auto;
        padding: 40px 0 64px;
      }
      .hero, .section {
        background: var(--panel);
        border: 1px solid var(--line);
        border-radius: 28px;
        padding: 24px;
        box-shadow: 0 20px 50px rgba(28,33,43,0.08);
      }
      .section { margin-top: 16px; }
      .eyebrow {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 8px 12px;
        border-radius: 999px;
        background: rgba(43,109,255,0.08);
        color: var(--accent);
        font-size: 13px;
        font-weight: 700;
      }
      h1 {
        margin: 18px 0 0;
        font-size: clamp(32px, 5vw, 48px);
        line-height: 1.12;
        letter-spacing: -0.04em;
      }
      h2 {
        margin: 0 0 12px;
        font-size: 24px;
        line-height: 1.25;
      }
      p, li { color: var(--muted); line-height: 1.8; }
      ul { margin: 0; padding-left: 20px; }
      .meta-row, .chip-row, .link-row {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
        margin-top: 16px;
      }
      .chip, .link-chip {
        display: inline-flex;
        align-items: center;
        padding: 8px 12px;
        border-radius: 999px;
        border: 1px solid var(--line);
        background: rgba(239,245,255,0.9);
        color: var(--text);
        font-size: 13px;
        text-decoration: none;
      }
      .grid {
        display: grid;
        gap: 16px;
      }
      .grid.two {
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      }
      .card {
        border: 1px solid var(--line);
        border-radius: 24px;
        background: rgba(248,251,255,0.88);
        padding: 20px;
      }
      .faq-item + .faq-item { margin-top: 12px; }
      a.cta {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        margin-top: 16px;
        color: white;
        background: var(--accent);
        border-radius: 999px;
        padding: 12px 18px;
        text-decoration: none;
        font-weight: 700;
      }
      a.text-link {
        color: var(--accent);
        text-decoration: none;
        font-weight: 700;
      }
      @media (max-width: 720px) {
        main { width: min(100% - 20px, 1120px); padding-top: 24px; }
        .hero, .section { padding: 18px; border-radius: 22px; }
      }
    </style>
  </head>
  <body>
    <main>
      ${body}
    </main>
  </body>
</html>`
}

function buildWebPageSchema({
  name,
  description,
  url,
  datePublished,
  dateModified,
  publisher,
  isBasedOn,
}: {
  name: string
  description: string
  url: string
  datePublished?: string
  dateModified?: string
  publisher?: { name: string; url?: string }
  isBasedOn?: string[]
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name,
    description,
    url,
    ...(datePublished ? { datePublished } : {}),
    ...(dateModified ? { dateModified } : {}),
    ...(publisher
      ? {
          publisher: {
            '@type': 'Organization',
            name: publisher.name,
            ...(publisher.url ? { url: publisher.url } : {}),
          },
        }
      : {}),
    ...(isBasedOn?.length
      ? { isBasedOn: isBasedOn.length === 1 ? isBasedOn[0] : isBasedOn }
      : {}),
  }
}

function buildBreadcrumbList(items: Array<{ name: string; item: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((entry, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: entry.name,
      item: entry.item,
    })),
  }
}

function buildFaqSchema(items: Array<{ question: string; answer: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: stripHtml(item.answer),
      },
    })),
  }
}

function buildGuideSchema(guide: MagokGuideEntry, canonicalUrl: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: guide.title,
    description: guide.summary,
    url: canonicalUrl,
    areaServed: {
      '@type': 'Place',
      name: '마곡일반산업단지',
    },
    provider: {
      '@type': 'Organization',
      name: BRAND_NAME,
      url: SITE_URL,
    },
  }
}

function renderGuideBody(guide: MagokGuideEntry, canonicalUrl: string) {
  const zoneCards = guide.zoneSummaries
    .map(
      (zoneSummary) => `
      <article class="card">
        <div class="chip-row">
          <span class="chip">${escapeHtml(zoneSummary.zoneLabel)}</span>
          <span class="chip">${escapeHtml(zoneSummary.verdictLabel)}</span>
        </div>
        <p>${escapeHtml(zoneSummary.reason)}</p>
        ${
          zoneSummary.notes[0]
            ? `<p>${escapeHtml(zoneSummary.notes[0])}</p>`
            : ''
        }
      </article>`,
    )
    .join('')

  const faqItems = guide.faq
    .map(
      (item) => `
      <article class="card faq-item">
        <h2>${escapeHtml(item.question)}</h2>
        <p>${escapeHtml(item.answer)}</p>
      </article>`,
    )
    .join('')

  const legalItems = guide.legalBases
    .map(
      (basis) => `
      <article class="card faq-item">
        <div class="chip-row">
          <span class="chip">${escapeHtml(basis.citation)}</span>
          ${basis.pageHint ? `<span class="chip">${escapeHtml(basis.pageHint)}</span>` : ''}
          ${basis.articlePath ? `<span class="chip">${escapeHtml(basis.articlePath)}</span>` : ''}
        </div>
        <p>${escapeHtml(basis.summary)}</p>
      </article>`,
    )
    .join('')

  const relatedLinks = guide.relatedCodes
    .map(
      (relatedCode) =>
        `<a class="link-chip" href="${SITE_URL}/guides/${relatedCode.code}/">${escapeHtml(
          `${relatedCode.code} · ${relatedCode.name}`,
        )}</a>`,
    )
    .join('')

  return `
    <section class="hero">
      <div class="eyebrow">업종별 입주 가이드</div>
      <h1>${escapeHtml(guide.title)}</h1>
      <p>${escapeHtml(guide.summary)}</p>
      <div class="meta-row">
        <span class="chip">${escapeHtml(guide.code)}</span>
        <span class="chip">${escapeHtml(guide.browseCategory)}</span>
        <span class="chip">업데이트 ${escapeHtml(guide.updatedAt)}</span>
      </div>
      <a class="cta" href="${SITE_URL}/#guides/${guide.code}">앱에서 인터랙티브로 보기</a>
    </section>

    <section class="section">
      <h2>구역별 판단 요약</h2>
      <div class="grid two">${zoneCards}</div>
    </section>

    <section class="section">
      <h2>핵심 해설</h2>
      <ul>
        ${guide.highlights.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}
      </ul>
    </section>

    <section class="section">
      <h2>자주 묻는 질문</h2>
      ${faqItems}
    </section>

    <section class="section">
      <h2>관련 법령</h2>
      ${legalItems}
    </section>

    <section class="section">
      <h2>연관 코드</h2>
      <div class="link-row">${relatedLinks}</div>
      <p><a class="text-link" href="${SITE_URL}/#directory">전수 코드 사전으로 돌아가기</a></p>
      <p><a class="text-link" href="${canonicalUrl}">${escapeHtml(canonicalUrl)}</a></p>
    </section>
  `
}

export function buildGuideSeoDocument(guide: MagokGuideEntry): SeoPageDocument {
  const publicPath = `/guides/${guide.code}/`
  const canonicalUrl = `${SITE_URL}${publicPath}`
  const title = truncateText(`${guide.title} | ${BRAND_NAME}`, 60)
  const description = truncateText(
    `${guide.name}(${guide.code})의 마곡 입주 가능성, 구역별 판단, 관련 법령, FAQ를 한 페이지로 정리한 가이드입니다.`,
    160,
  )
  const structuredData = [
    buildGuideSchema(guide, canonicalUrl),
    buildFaqSchema(guide.faq.map((item) => ({ question: item.question, answer: item.answer }))),
    buildBreadcrumbList([
      { name: BRAND_NAME, item: SITE_URL },
      { name: '업종별 입주 가이드', item: `${SITE_URL}/guides/` },
      { name: guide.title, item: canonicalUrl },
    ]),
  ]

  return {
    filePath: `guides/${guide.code}/index.html`,
    url: canonicalUrl,
    html: buildDocument({
      title,
      description,
      canonicalUrl,
      structuredData,
      body: renderGuideBody(guide, canonicalUrl),
    }),
  }
}

function renderFaqBody(faqEntry: GuideFaqIndexEntry) {
  return `
    <section class="hero">
      <div class="eyebrow">마곡 입주 FAQ</div>
      <h1>${escapeHtml(faqEntry.question)}</h1>
      <p>${escapeHtml(faqEntry.answer)}</p>
      <div class="meta-row">
        <span class="chip">${escapeHtml(faqEntry.guideCode)}</span>
        <span class="chip">${escapeHtml(faqEntry.guideTitle)}</span>
      </div>
      <a class="cta" href="${SITE_URL}/guides/${faqEntry.guideCode}/">관련 가이드 보기</a>
    </section>

    <section class="section">
      <h2>답변 요약</h2>
      <p>${escapeHtml(faqEntry.answer)}</p>
      <p><a class="text-link" href="${SITE_URL}/#guides/${faqEntry.guideCode}">앱에서 가이드 열기</a></p>
    </section>
  `
}

export function buildFaqSeoDocument(faqEntry: GuideFaqIndexEntry): SeoPageDocument {
  const publicPath = faqEntry.faqPath
  const canonicalUrl = `${SITE_URL}${publicPath}`
  const title = truncateText(`${faqEntry.question} | ${BRAND_NAME}`, 60)
  const description = truncateText(faqEntry.answer, 160)
  const structuredData = [
    buildFaqSchema([{ question: faqEntry.question, answer: faqEntry.answer }]),
    buildBreadcrumbList([
      { name: BRAND_NAME, item: SITE_URL },
      { name: 'FAQ', item: `${SITE_URL}/faq/` },
      { name: faqEntry.question, item: canonicalUrl },
    ]),
  ]

  return {
    filePath: `faq/${faqEntry.faqSlug}/index.html`,
    url: canonicalUrl,
    html: buildDocument({
      title,
      description,
      canonicalUrl,
      structuredData,
      body: renderFaqBody(faqEntry),
    }),
  }
}

function renderIndexLinkCards(
  items: Array<{ href: string; title: string; description: string; chips?: string[] }>,
) {
  return items
    .map(
      (item) => `
      <article class="card">
        <h2><a class="text-link" href="${escapeHtml(item.href)}">${escapeHtml(item.title)}</a></h2>
        <p>${escapeHtml(item.description)}</p>
        ${
          item.chips?.length
            ? `<div class="chip-row">${item.chips
                .map((chip) => `<span class="chip">${escapeHtml(chip)}</span>`)
                .join('')}</div>`
            : ''
        }
      </article>`,
    )
    .join('')
}

function renderSourceReferenceCards(references: SourceReference[]) {
  return references
    .map(
      (reference) => `
      <article class="card faq-item">
        <h2><a class="text-link" href="${escapeHtml(reference.url)}">${escapeHtml(reference.title)}</a></h2>
        <div class="chip-row">
          <span class="chip">${escapeHtml(reference.authority)}</span>
          ${
            reference.documentNumber
              ? `<span class="chip">${escapeHtml(reference.documentNumber)}</span>`
              : ''
          }
          ${
            reference.publishedDate
              ? `<span class="chip">공개일 ${escapeHtml(reference.publishedDate)}</span>`
              : ''
          }
        </div>
        ${reference.description ? `<p>${escapeHtml(reference.description)}</p>` : ''}
      </article>`,
    )
    .join('')
}

export function buildGuideIndexSeoDocument(guides: MagokGuideEntry[]): SeoPageDocument {
  const canonicalUrl = `${SITE_URL}/guides/`
  const title = '마곡 업종별 입주 가이드 모음 | 마곡 코드찾기'
  const description =
    '마곡 일반산업단지 업종코드별 입주 가능성, 구역 비교, 관련 법령, FAQ를 모아 둔 가이드 색인입니다.'
  const cards = renderIndexLinkCards(
    guides.map((guide) => ({
      href: `${SITE_URL}/guides/${guide.code}/`,
      title: guide.title,
      description: guide.summary,
      chips: [guide.code, guide.recommendedZoneLabel],
    })),
  )

  return {
    filePath: 'guides/index.html',
    url: canonicalUrl,
    html: buildDocument({
      title,
      description,
      canonicalUrl,
      structuredData: [
        buildBreadcrumbList([
          { name: BRAND_NAME, item: SITE_URL },
          { name: '업종별 입주 가이드', item: canonicalUrl },
        ]),
      ],
      body: `
        <section class="hero">
          <div class="eyebrow">업종별 가이드 색인</div>
          <h1>마곡 업종별 입주 가이드 모음</h1>
          <p>${escapeHtml(description)}</p>
          <a class="cta" href="${SITE_URL}/#finder">앱에서 바로 판정하기</a>
        </section>
        <section class="section">
          <h2>전체 가이드</h2>
          <div class="grid two">${cards}</div>
        </section>
      `,
    }),
  }
}

export function buildFaqIndexSeoDocument(faqEntries: GuideFaqIndexEntry[]): SeoPageDocument {
  const canonicalUrl = `${SITE_URL}/faq/`
  const title = '마곡 입주 FAQ 모음 | 마곡 코드찾기'
  const description =
    '마곡 입주 가능성, 심의 필요 사유, 구역별 차이를 질문형으로 정리한 FAQ 색인입니다.'
  const cards = renderIndexLinkCards(
    faqEntries.map((faqEntry) => ({
      href: `${SITE_URL}${faqEntry.faqPath}`,
      title: faqEntry.question,
      description: faqEntry.answer,
      chips: [faqEntry.guideCode],
    })),
  )

  return {
    filePath: 'faq/index.html',
    url: canonicalUrl,
    html: buildDocument({
      title,
      description,
      canonicalUrl,
      structuredData: [
        buildBreadcrumbList([
          { name: BRAND_NAME, item: SITE_URL },
          { name: 'FAQ', item: canonicalUrl },
        ]),
      ],
      body: `
        <section class="hero">
          <div class="eyebrow">마곡 입주 FAQ 색인</div>
          <h1>질문형 FAQ 모음</h1>
          <p>${escapeHtml(description)}</p>
        </section>
        <section class="section">
          <h2>전체 FAQ</h2>
          <div class="grid two">${cards}</div>
        </section>
      `,
    }),
  }
}

export function buildSitemapXml(
  urls: Array<{
    url: string
    lastmod: string
    priority?: string
    changefreq?: string
  }>,
) {
  const items = urls
    .map(
      (entry) => `  <url>
    <loc>${escapeHtml(entry.url)}</loc>
    <lastmod>${escapeHtml(entry.lastmod)}</lastmod>
    <changefreq>${escapeHtml(entry.changefreq ?? 'weekly')}</changefreq>
    <priority>${escapeHtml(entry.priority ?? '0.7')}</priority>
  </url>`,
    )
    .join('\n')

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${items}
</urlset>`
}

export function buildSitemapIndexXml(
  sitemaps: Array<{
    url: string
    lastmod: string
  }>,
) {
  const items = sitemaps
    .map(
      (entry) => `  <sitemap>
    <loc>${escapeHtml(entry.url)}</loc>
    <lastmod>${escapeHtml(entry.lastmod)}</lastmod>
  </sitemap>`,
    )
    .join('\n')

  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${items}
</sitemapindex>`
}

function renderLibraryBody(
  entry: LegalLibraryEntryDetail | null,
  canonicalUrl: string,
  pageTitle: string,
  pageDescription: string,
) {
  if (!entry) {
    return `
      <section class="hero">
        <div class="eyebrow">법령 라이브러리</div>
        <h1>${escapeHtml(pageTitle)}</h1>
        <p>${escapeHtml(pageDescription)}</p>
        <a class="cta" href="${SITE_URL}/#library">앱에서 인터랙티브로 보기</a>
      </section>
    `
  }

  const basisCards = entry.bases
    .map(
      (basis) => `
      <article class="card faq-item">
        <div class="chip-row">
          <span class="chip">${escapeHtml(basis.citation)}</span>
          ${basis.pageHint ? `<span class="chip">${escapeHtml(basis.pageHint)}</span>` : ''}
          ${basis.articlePath ? `<span class="chip">${escapeHtml(basis.articlePath)}</span>` : ''}
        </div>
        <p>${escapeHtml(basis.summary)}</p>
        ${basis.quote ? `<p>${escapeHtml(basis.quote)}</p>` : ''}
      </article>`,
    )
    .join('')

  const sourceCards = renderSourceReferenceCards([
    entry.officialSource,
    ...(entry.supplementarySources ?? []),
  ])

  return `
    <section class="hero">
      <div class="eyebrow">법령 라이브러리</div>
      <h1>${escapeHtml(pageTitle)}</h1>
      <p>${escapeHtml(pageDescription)}</p>
      <div class="meta-row">
        <span class="chip">${escapeHtml(entry.sourceKind === 'magokPlan' ? '마곡 고시문' : '산업집적법 시행령')}</span>
        <span class="chip">${escapeHtml(entry.officialSource.authority)}</span>
        ${entry.officialSource.documentNumber ? `<span class="chip">${escapeHtml(entry.officialSource.documentNumber)}</span>` : ''}
        ${entry.officialSource.publishedDate ? `<span class="chip">공개일 ${escapeHtml(entry.officialSource.publishedDate)}</span>` : ''}
      </div>
      <div class="link-row">
        <a class="cta" href="${SITE_URL}/#library">앱에서 인터랙티브로 보기</a>
        <a class="link-chip" href="${escapeHtml(entry.officialSource.url)}">원문 보기</a>
      </div>
    </section>

    <section class="section">
      <h2>언제 이 문서를 보나요?</h2>
      <p>${escapeHtml(entry.applicability)}</p>
    </section>

    <section class="section">
      <h2>핵심 조문과 해설</h2>
      ${basisCards}
    </section>

    <section class="section">
      <h2>원문 출처</h2>
      ${sourceCards}
    </section>

    <section class="section">
      <h2>공개 주소</h2>
      <p><a class="text-link" href="${canonicalUrl}">${escapeHtml(canonicalUrl)}</a></p>
    </section>
  `
}

export function buildLibraryIndexSeoDocument(entries: LegalLibraryEntryDetail[]): SeoPageDocument {
  const canonicalUrl = `${SITE_URL}/library/`
  const title = '마곡 법령 라이브러리 | 마곡 코드찾기'
  const description =
    '마곡 입주 판정에 쓰이는 산업집적법 시행령과 마곡 관리기본계획을 문서 단위로 정리한 공개 법령 라이브러리입니다.'
  const latestEffectiveDate = entries.reduce<string | undefined>((latest, entry) => {
    if (!latest || entry.effectiveDate > latest) {
      return entry.effectiveDate
    }

    return latest
  }, undefined)
  const cards = renderIndexLinkCards(
    entries.map((entry) => ({
      href: `${SITE_URL}/library/${entry.id}/`,
      title: entry.title,
      description: entry.summary,
      chips: [
        entry.sourceKind === 'magokPlan' ? '마곡 고시문' : '산업집적법 시행령',
        entry.officialSource.authority,
      ],
    })),
  )

  return {
    filePath: 'library/index.html',
    url: canonicalUrl,
    html: buildDocument({
      title,
      description,
      canonicalUrl,
      structuredData: [
        buildWebPageSchema({
          name: title,
          description,
          url: canonicalUrl,
          dateModified: latestEffectiveDate,
          publisher: {
            name: BRAND_NAME,
            url: SITE_URL,
          },
        }),
        buildBreadcrumbList([
          { name: BRAND_NAME, item: SITE_URL },
          { name: '법령 라이브러리', item: canonicalUrl },
        ]),
      ],
      body: `
        <section class="hero">
          <div class="eyebrow">법령 라이브러리</div>
          <h1>마곡 입주 법령 라이브러리</h1>
          <p>${escapeHtml(description)}</p>
          <a class="cta" href="${SITE_URL}/#library">앱에서 라이브러리 열기</a>
        </section>
        <section class="section">
          <h2>문서 목록</h2>
          <div class="grid two">${cards}</div>
        </section>
      `,
    }),
  }
}

export function buildLibraryDetailSeoDocument(entry: LegalLibraryEntryDetail): SeoPageDocument {
  const canonicalUrl = `${SITE_URL}/library/${entry.id}/`
  const title = truncateText(`${entry.title} | ${BRAND_NAME}`, 60)
  const description = truncateText(entry.summary, 160)

  return {
    filePath: `library/${entry.id}/index.html`,
    url: canonicalUrl,
    html: buildDocument({
      title,
      description,
      canonicalUrl,
      structuredData: [
        buildWebPageSchema({
          name: entry.title,
          description,
          url: canonicalUrl,
          datePublished: entry.officialSource.publishedDate,
          dateModified: entry.effectiveDate,
          publisher: {
            name: entry.officialSource.authority,
          },
          isBasedOn: [
            entry.officialSource.url,
            ...(entry.supplementarySources ?? []).map((source) => source.url),
          ],
        }),
        buildBreadcrumbList([
          { name: BRAND_NAME, item: SITE_URL },
          { name: '법령 라이브러리', item: `${SITE_URL}/library/` },
          { name: entry.title, item: canonicalUrl },
        ]),
      ],
      body: renderLibraryBody(entry, canonicalUrl, entry.title, entry.summary),
    }),
  }
}

function renderUpdateBody(
  entry: UpdateLogEntry | null,
  canonicalUrl: string,
  pageTitle: string,
  pageDescription: string,
) {
  if (!entry) {
    return `
      <section class="hero">
        <div class="eyebrow">업데이트 로그</div>
        <h1>${escapeHtml(pageTitle)}</h1>
        <p>${escapeHtml(pageDescription)}</p>
        <a class="cta" href="${SITE_URL}/#updates">앱에서 인터랙티브로 보기</a>
      </section>
    `
  }

  return `
    <section class="hero">
      <div class="eyebrow">업데이트 로그</div>
      <h1>${escapeHtml(pageTitle)}</h1>
      <p>${escapeHtml(pageDescription)}</p>
      <div class="meta-row">
        <span class="chip">${escapeHtml(entry.date)}</span>
        ${entry.sourceReferences
          .slice(0, 2)
          .map((source) => `<span class="chip">${escapeHtml(source.title)}</span>`)
          .join('')}
      </div>
      <a class="cta" href="${SITE_URL}/#updates">앱에서 인터랙티브로 보기</a>
    </section>

    <section class="section">
      <h2>이번에 달라진 점</h2>
      <ul>
        ${entry.highlights.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}
      </ul>
    </section>

    <section class="section">
      <h2>영향 범위</h2>
      <div class="chip-row">
        ${entry.affectedAreas.map((item) => `<span class="chip">${escapeHtml(item)}</span>`).join('')}
      </div>
    </section>

    <section class="section">
      <h2>원문·정책 출처</h2>
      ${renderSourceReferenceCards(entry.sourceReferences)}
    </section>

    <section class="section">
      <h2>공개 주소</h2>
      <p><a class="text-link" href="${canonicalUrl}">${escapeHtml(canonicalUrl)}</a></p>
    </section>
  `
}

export function buildUpdatesIndexSeoDocument(entries: UpdateLogEntry[]): SeoPageDocument {
  const canonicalUrl = `${SITE_URL}/updates/`
  const title = '마곡 업데이트 로그 | 마곡 코드찾기'
  const description =
    '마곡 입주 판정 기준과 화면 구조가 언제 어떻게 바뀌었는지 기록한 공개 업데이트 로그입니다.'
  const cards = renderIndexLinkCards(
    entries.map((entry) => ({
      href: `${SITE_URL}/updates/${entry.id}/`,
      title: entry.title,
      description: entry.summary,
      chips: [entry.date, ...entry.sourceReferences.slice(0, 2).map((source) => source.title)],
    })),
  )

  return {
    filePath: 'updates/index.html',
    url: canonicalUrl,
    html: buildDocument({
      title,
      description,
      canonicalUrl,
      structuredData: [
        buildWebPageSchema({
          name: title,
          description,
          url: canonicalUrl,
          dateModified: entries[0]?.date,
          publisher: {
            name: BRAND_NAME,
            url: SITE_URL,
          },
        }),
        buildBreadcrumbList([
          { name: BRAND_NAME, item: SITE_URL },
          { name: '업데이트 로그', item: canonicalUrl },
        ]),
      ],
      body: `
        <section class="hero">
          <div class="eyebrow">업데이트 로그</div>
          <h1>마곡 제품 업데이트 이력</h1>
          <p>${escapeHtml(description)}</p>
          <a class="cta" href="${SITE_URL}/#updates">앱에서 업데이트 로그 열기</a>
        </section>
        <section class="section">
          <h2>최근 변경 내역</h2>
          <div class="grid two">${cards}</div>
        </section>
      `,
    }),
  }
}

export function buildUpdateDetailSeoDocument(entry: UpdateLogEntry): SeoPageDocument {
  const canonicalUrl = `${SITE_URL}/updates/${entry.id}/`
  const title = truncateText(`${entry.title} | ${BRAND_NAME}`, 60)
  const description = truncateText(entry.summary, 160)

  return {
    filePath: `updates/${entry.id}/index.html`,
    url: canonicalUrl,
    html: buildDocument({
      title,
      description,
      canonicalUrl,
      structuredData: [
        buildWebPageSchema({
          name: entry.title,
          description,
          url: canonicalUrl,
          datePublished: entry.date,
          dateModified: entry.date,
          publisher: {
            name: BRAND_NAME,
            url: SITE_URL,
          },
          isBasedOn: entry.sourceReferences.map((source) => source.url),
        }),
        buildBreadcrumbList([
          { name: BRAND_NAME, item: SITE_URL },
          { name: '업데이트 로그', item: `${SITE_URL}/updates/` },
          { name: entry.title, item: canonicalUrl },
        ]),
      ],
      body: renderUpdateBody(entry, canonicalUrl, entry.title, entry.summary),
    }),
  }
}
