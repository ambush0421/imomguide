import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import {
  MAGOK_CODE_DIRECTORY,
  getZoneVerdictCounts,
} from '../src/features/eligibility/data/magok-code-directory'
import { legalBasesFromIds } from '../src/features/eligibility/data/legal-bases'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const projectRoot = path.resolve(__dirname, '..')
const outputDir = path.join(projectRoot, 'docs', 'codex-brain')

function csvEscape(value: string | number) {
  const text = String(value ?? '')
  const escaped = text.replaceAll('"', '""')

  return `"${escaped}"`
}

function joinLines(values: string[]) {
  return values.filter(Boolean).join(' | ')
}

function formatCountLine(label: string, counts: ReturnType<typeof getZoneVerdictCounts>) {
  return `- ${label}: 가능 ${counts.eligible}개 / 조건부 ${counts.conditional}개 / 심의 필요 ${counts.reviewRequired}개 / 추가 확인 ${counts.insufficient}개 / 불가 ${counts.ineligible}개`
}

async function main() {
  await mkdir(outputDir, { recursive: true })

  const rows = MAGOK_CODE_DIRECTORY.map((entry) => {
    const industrialBases = legalBasesFromIds(
      entry.zoneVerdicts.industrialFacility.legalBasisIds,
    )
    const knowledgeBases = legalBasesFromIds(
      entry.zoneVerdicts.knowledgeIndustryCenter.legalBasisIds,
    )

    return {
      code: entry.code,
      name: entry.name,
      sectionCode: entry.sectionCode,
      sectionName: entry.sectionName,
      divisionCode: entry.divisionCode,
      divisionName: entry.divisionName,
      groupCode: entry.groupCode,
      groupName: entry.groupName,
      categoryCode: entry.categoryCode,
      categoryName: entry.categoryName,
      browseCategory: entry.browseCategory,
      industrialFacilityVerdict: entry.zoneVerdicts.industrialFacility.verdict,
      industrialFacilityReason: entry.zoneVerdicts.industrialFacility.reason,
      industrialFacilityLegalBases: joinLines(
        industrialBases.map((basis) => basis.citation),
      ),
      industrialFacilityNotes: joinLines(entry.zoneVerdicts.industrialFacility.notes),
      knowledgeIndustryCenterVerdict:
        entry.zoneVerdicts.knowledgeIndustryCenter.verdict,
      knowledgeIndustryCenterReason: entry.zoneVerdicts.knowledgeIndustryCenter.reason,
      knowledgeIndustryCenterLegalBases: joinLines(
        knowledgeBases.map((basis) => basis.citation),
      ),
      knowledgeIndustryCenterNotes: joinLines(
        entry.zoneVerdicts.knowledgeIndustryCenter.notes,
      ),
      searchKeywords: joinLines(entry.searchKeywords),
    }
  })

  const headers = Object.keys(rows[0] ?? {})
  const csvLines = [
    headers.map(csvEscape).join(','),
    ...rows.map((row) =>
      headers.map((header) => csvEscape(row[header as keyof typeof row] ?? '')).join(','),
    ),
  ]

  const csvPath = path.join(outputDir, 'magok_ksic11_full_directory.csv')
  const jsonPath = path.join(outputDir, 'magok_ksic11_full_directory.json')
  const summaryPath = path.join(outputDir, 'magok_ksic11_full_directory_summary.md')

  await writeFile(csvPath, `\uFEFF${csvLines.join('\n')}`, 'utf8')
  await writeFile(jsonPath, JSON.stringify(rows, null, 2), 'utf8')

  const knowledgeCounts = getZoneVerdictCounts('knowledgeIndustryCenter')
  const industrialCounts = getZoneVerdictCounts('industrialFacility')
  const topCategories = [...new Map(
    MAGOK_CODE_DIRECTORY.reduce<Map<string, number>>((map, entry) => {
      map.set(entry.browseCategory, (map.get(entry.browseCategory) ?? 0) + 1)
      return map
    }, new Map()),
  ).entries()]
    .sort((left, right) => right[1] - left[1])
    .slice(0, 10)

  const summary = [
    '# 마곡 KSIC 11차 전수 코드 사전 요약',
    '',
    `- 생성일: ${new Date().toISOString()}`,
    `- 전체 코드 수: ${MAGOK_CODE_DIRECTORY.length}개`,
    formatCountLine('지식산업센터', knowledgeCounts),
    formatCountLine('산업시설구역', industrialCounts),
    '',
    '## 상위 분류',
    '',
    ...topCategories.map(([name, count]) => `- ${name}: ${count}개`),
    '',
    '## 산출물',
    '',
    '- `magok_ksic11_full_directory.csv`',
    '- `magok_ksic11_full_directory.json`',
    '- `magok_ksic11_full_directory.xlsx`',
  ].join('\n')

  await writeFile(summaryPath, summary, 'utf8')

  console.log(`exported ${rows.length} rows to ${csvPath}`)
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
