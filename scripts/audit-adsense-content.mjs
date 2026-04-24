import { existsSync, readdirSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const SITE_URL = 'https://loopincode.com'
const REQUIRED_NAV_PATHS = [
  '/guides/',
  '/library/',
  '/updates/',
  '/about/',
  '/methodology/',
  '/editorial-policy/',
  '/contact/',
  '/privacy/',
  '/terms/',
]
const REQUIRED_SITEMAP_PATHS = [
  '/about/',
  '/methodology/',
  '/editorial-policy/',
  '/contact/',
  '/privacy/',
  '/terms/',
]
const BANNED_PLACEHOLDERS = [
  /under construction/i,
  /coming soon/i,
  /lorem ipsum/i,
  /준비\s*중/,
  /공사\s*중/,
]

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const projectRoot = path.resolve(__dirname, '..')
const distDir = path.join(projectRoot, 'dist')
const publicDir = path.join(projectRoot, 'public')
const siteRoot = existsSync(path.join(distDir, 'index.html')) ? distDir : projectRoot

function collectHtmlFiles(dir, skipNames = new Set()) {
  if (!existsSync(dir)) {
    return []
  }

  const files = []
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (skipNames.has(entry.name)) {
      continue
    }

    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      files.push(...collectHtmlFiles(fullPath, skipNames))
      continue
    }

    if (entry.isFile() && entry.name.endsWith('.html')) {
      files.push(fullPath)
    }
  }

  return files
}

function getHtmlFiles() {
  if (siteRoot === distDir) {
    return collectHtmlFiles(distDir, new Set(['assets']))
  }

  return [
    path.join(projectRoot, 'index.html'),
    ...collectHtmlFiles(publicDir),
  ].filter((filePath) => existsSync(filePath))
}

function toDisplayPath(filePath) {
  if (siteRoot === distDir) {
    return path.relative(distDir, filePath).replaceAll(path.sep, '/')
  }

  return path.relative(projectRoot, filePath).replaceAll(path.sep, '/')
}

function stripVisibleText(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<svg[\s\S]*?<\/svg>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim()
}

function hasHref(html, pathName) {
  return html.includes(`href="${pathName}"`) || html.includes(`href="${SITE_URL}${pathName}"`)
}

function auditHtmlFile(filePath) {
  const html = readFileSync(filePath, 'utf8')
  const displayPath = toDisplayPath(filePath)
  const isRoot = displayPath === 'index.html'
  const isNotFound = displayPath === '404.html' || displayPath.endsWith('/404.html')
  const visibleText = stripVisibleText(html)
  const errors = []

  if (!/<title>[^<]{8,}<\/title>/i.test(html)) {
    errors.push('missing useful <title>')
  }

  if (!/<meta\s+name=["']description["']/i.test(html)) {
    errors.push('missing meta description')
  }

  if (!/<link\s+rel=["']canonical["']/i.test(html)) {
    errors.push('missing canonical link')
  }

  if (!isNotFound) {
    const minimumVisibleTextLength = isRoot ? 160 : 500
    if (visibleText.length < minimumVisibleTextLength) {
      errors.push(
        `visible text too short (${visibleText.length} chars, minimum ${minimumVisibleTextLength})`,
      )
    }

    const navHits = REQUIRED_NAV_PATHS.filter((pathName) => hasHref(html, pathName)).length
    if (navHits < 5) {
      errors.push(`too few site navigation links (${navHits}/5 minimum)`)
    }
  }

  for (const pattern of BANNED_PLACEHOLDERS) {
    if (pattern.test(visibleText)) {
      errors.push(`placeholder phrase matched: ${pattern}`)
    }
  }

  const adUnitMatches = html.match(/class=["'][^"']*adsbygoogle[^"']*["']/gi) ?? []
  if (adUnitMatches.length > 0 && visibleText.length < 1200) {
    errors.push('Google ad unit appears on a low-text page')
  }

  return errors.map((error) => `${displayPath}: ${error}`)
}

function auditAdsTxt() {
  const adsTxtPath =
    siteRoot === distDir ? path.join(distDir, 'ads.txt') : path.join(publicDir, 'ads.txt')
  if (!existsSync(adsTxtPath)) {
    return ['ads.txt is missing']
  }

  const adsTxt = readFileSync(adsTxtPath, 'utf8')
  if (!adsTxt.includes('google.com, pub-2916041253392911, DIRECT')) {
    return ['ads.txt does not authorize the configured Google publisher ID']
  }

  return []
}

function auditSitemap() {
  const sitemapPath =
    siteRoot === distDir
      ? path.join(distDir, 'sitemaps', 'core.xml')
      : path.join(publicDir, 'sitemaps', 'core.xml')

  if (!existsSync(sitemapPath)) {
    return ['core sitemap is missing']
  }

  const sitemap = readFileSync(sitemapPath, 'utf8')
  return REQUIRED_SITEMAP_PATHS
    .filter((pathName) => !sitemap.includes(`${SITE_URL}${pathName}`))
    .map((pathName) => `core sitemap is missing ${pathName}`)
}

const htmlFiles = getHtmlFiles()
const failures = [
  ...htmlFiles.flatMap(auditHtmlFile),
  ...auditAdsTxt(),
  ...auditSitemap(),
]

if (failures.length > 0) {
  console.error('AdSense content audit failed:')
  for (const failure of failures) {
    console.error(`- ${failure}`)
  }
  process.exit(1)
}

const sourceLabel = siteRoot === distDir ? 'dist/' : 'source public files'
console.log(`AdSense content audit passed: ${htmlFiles.length} HTML files checked from ${sourceLabel}`)
