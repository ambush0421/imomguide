import { mkdir, rm, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import {
  MAGOK_GUIDE_CATALOG,
  getGuideFaqIndex,
} from '../src/features/guides/data/guide-catalog'
import {
  buildFaqIndexSeoDocument,
  buildFaqSeoDocument,
  buildGuideIndexSeoDocument,
  buildGuideSeoDocument,
  buildLibraryDetailSeoDocument,
  buildLibraryIndexSeoDocument,
  buildSitemapIndexXml,
  buildSitemapXml,
  buildUpdateDetailSeoDocument,
  buildUpdatesIndexSeoDocument,
} from '../src/features/guides/seo/seo-page-builder'
import { getLegalLibraryEntryDetails } from '../src/features/library/data/legal-library'
import { UPDATE_LOG_ENTRIES } from '../src/features/updates/data/update-log'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const projectRoot = path.resolve(__dirname, '..')
const publicDir = path.join(projectRoot, 'public')

async function writeSeoPage(rootDir: string, filePath: string, html: string) {
  const fullPath = path.join(rootDir, filePath)
  await mkdir(path.dirname(fullPath), { recursive: true })
  await writeFile(fullPath, html, 'utf8')
}

async function main() {
  const faqIndex = getGuideFaqIndex()
  const libraryEntries = getLegalLibraryEntryDetails()
  const guideDocuments = MAGOK_GUIDE_CATALOG.map((guide) => buildGuideSeoDocument(guide))
  const faqDocuments = faqIndex.map((faqEntry) => buildFaqSeoDocument(faqEntry))
  const libraryDocuments = libraryEntries.map((entry) =>
    buildLibraryDetailSeoDocument(entry),
  )
  const updateDocuments = UPDATE_LOG_ENTRIES.map((entry) =>
    buildUpdateDetailSeoDocument(entry),
  )
  const guideIndexDocument = buildGuideIndexSeoDocument(MAGOK_GUIDE_CATALOG)
  const faqIndexDocument = buildFaqIndexSeoDocument(faqIndex)
  const libraryIndexDocument = buildLibraryIndexSeoDocument(libraryEntries)
  const updatesIndexDocument = buildUpdatesIndexSeoDocument(UPDATE_LOG_ENTRIES)

  await rm(path.join(publicDir, 'guides'), { recursive: true, force: true })
  await rm(path.join(publicDir, 'faq'), { recursive: true, force: true })
  await rm(path.join(publicDir, 'library'), { recursive: true, force: true })
  await rm(path.join(publicDir, 'updates'), { recursive: true, force: true })
  await rm(path.join(publicDir, 'sitemaps'), { recursive: true, force: true })

  await writeSeoPage(publicDir, guideIndexDocument.filePath, guideIndexDocument.html)
  await writeSeoPage(publicDir, faqIndexDocument.filePath, faqIndexDocument.html)
  await writeSeoPage(publicDir, libraryIndexDocument.filePath, libraryIndexDocument.html)
  await writeSeoPage(publicDir, updatesIndexDocument.filePath, updatesIndexDocument.html)

  for (const document of guideDocuments) {
    await writeSeoPage(publicDir, document.filePath, document.html)
  }

  for (const document of faqDocuments) {
    await writeSeoPage(publicDir, document.filePath, document.html)
  }

  for (const document of libraryDocuments) {
    await writeSeoPage(publicDir, document.filePath, document.html)
  }

  for (const document of updateDocuments) {
    await writeSeoPage(publicDir, document.filePath, document.html)
  }

  const coreSitemap = buildSitemapXml([
    {
      url: 'https://loopincode.com/',
      lastmod: '2026-03-20',
      priority: '1.0',
      changefreq: 'weekly',
    },
    {
      url: guideIndexDocument.url,
      lastmod: '2026-03-20',
      priority: '0.9',
      changefreq: 'weekly',
    },
    {
      url: faqIndexDocument.url,
      lastmod: '2026-03-20',
      priority: '0.8',
      changefreq: 'weekly',
    },
    {
      url: libraryIndexDocument.url,
      lastmod: '2026-03-20',
      priority: '0.8',
      changefreq: 'weekly',
    },
    {
      url: updatesIndexDocument.url,
      lastmod: '2026-03-20',
      priority: '0.7',
      changefreq: 'weekly',
    },
  ])

  const guideSitemap = buildSitemapXml(
    guideDocuments.map((document) => ({
      url: document.url,
      lastmod: '2026-03-20',
      priority: '0.8',
      changefreq: 'weekly',
    })),
  )

  const faqSitemap = buildSitemapXml(
    faqDocuments.map((document) => ({
      url: document.url,
      lastmod: document.filePath.includes('/index.html') ? '2026-03-20' : '2026-03-20',
      priority: '0.7',
      changefreq: 'weekly',
    })),
  )

  const librarySitemap = buildSitemapXml(
    libraryDocuments.map((document) => ({
      url: document.url,
      lastmod: '2026-03-20',
      priority: '0.7',
      changefreq: 'weekly',
    })),
  )

  const updatesSitemap = buildSitemapXml(
    updateDocuments.map((document) => ({
      url: document.url,
      lastmod: '2026-03-20',
      priority: '0.6',
      changefreq: 'weekly',
    })),
  )

  const sitemapIndex = buildSitemapIndexXml([
    {
      url: 'https://loopincode.com/sitemaps/core.xml',
      lastmod: '2026-03-20',
    },
    {
      url: 'https://loopincode.com/sitemaps/guides.xml',
      lastmod: '2026-03-20',
    },
    {
      url: 'https://loopincode.com/sitemaps/faq.xml',
      lastmod: '2026-03-20',
    },
    {
      url: 'https://loopincode.com/sitemaps/library.xml',
      lastmod: '2026-03-20',
    },
    {
      url: 'https://loopincode.com/sitemaps/updates.xml',
      lastmod: '2026-03-20',
    },
  ])

  await writeSeoPage(publicDir, 'sitemaps/core.xml', coreSitemap)
  await writeSeoPage(publicDir, 'sitemaps/guides.xml', guideSitemap)
  await writeSeoPage(publicDir, 'sitemaps/faq.xml', faqSitemap)
  await writeSeoPage(publicDir, 'sitemaps/library.xml', librarySitemap)
  await writeSeoPage(publicDir, 'sitemaps/updates.xml', updatesSitemap)
  await writeFile(path.join(publicDir, 'sitemap.xml'), sitemapIndex, 'utf8')

  console.log(
    `exported ${guideDocuments.length} guide pages, ${faqDocuments.length} faq pages, ${libraryDocuments.length} library pages, ${updateDocuments.length} update pages to public/`,
  )
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
