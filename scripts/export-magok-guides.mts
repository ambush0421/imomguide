import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import {
  MAGOK_GUIDE_CATALOG,
  getFeaturedGuideEntries,
  getGuideFaqIndex,
} from '../src/features/guides/data/guide-catalog'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const projectRoot = path.resolve(__dirname, '..')
const outputDir = path.join(projectRoot, 'docs', 'codex-brain')

async function main() {
  await mkdir(outputDir, { recursive: true })

  const guidesPath = path.join(outputDir, 'magok_guides_index.json')
  const faqPath = path.join(outputDir, 'magok_faq_index.json')
  const previewPath = path.join(outputDir, 'magok_guides_preview.md')

  const faqEntries = getGuideFaqIndex()
  const featuredGuides = getFeaturedGuideEntries(6)

  await writeFile(guidesPath, JSON.stringify(MAGOK_GUIDE_CATALOG, null, 2), 'utf8')
  await writeFile(faqPath, JSON.stringify(faqEntries, null, 2), 'utf8')

  const preview = [
    '# 마곡 업종별 가이드 미리보기',
    '',
    `- 생성일: ${new Date().toISOString()}`,
    `- 가이드 수: ${MAGOK_GUIDE_CATALOG.length}개`,
    `- FAQ 수: ${faqEntries.length}개`,
    '',
    '## 대표 가이드',
    '',
    ...featuredGuides.flatMap((guide) => [
      `### ${guide.title}`,
      '',
      `- 요약: ${guide.summary}`,
      `- 먼저 볼 구역: ${guide.recommendedZoneLabel}`,
      `- 핵심 해설: ${guide.highlights.join(' / ')}`,
      `- FAQ: ${guide.faq.map((item) => item.question).join(' | ')}`,
      '',
    ]),
    '## 산출물',
    '',
    '- `magok_guides_index.json`',
    '- `magok_faq_index.json`',
    '- `magok_guides_preview.md`',
  ].join('\n')

  await writeFile(previewPath, preview, 'utf8')

  console.log(
    `exported ${MAGOK_GUIDE_CATALOG.length} guides and ${faqEntries.length} faq entries`,
  )
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
