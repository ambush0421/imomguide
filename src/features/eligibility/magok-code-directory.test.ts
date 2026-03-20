import { describe, expect, it } from 'vitest'

import {
  MAGOK_CODE_DIRECTORY,
  MAGOK_CODE_DIRECTORY_TOTAL_COUNT,
  getMagokCodeDirectoryEntry,
} from '@/features/eligibility/data/magok-code-directory'

describe('MAGOK_CODE_DIRECTORY', () => {
  it('KSIC 11차 5자리 전체 코드 수를 누락 없이 적재한다', () => {
    expect(MAGOK_CODE_DIRECTORY_TOTAL_COUNT).toBe(1204)
    expect(MAGOK_CODE_DIRECTORY).toHaveLength(1204)
  })

  it('중복 코드 없이 적재된다', () => {
    const uniqueCodes = new Set(MAGOK_CODE_DIRECTORY.map((entry) => entry.code))

    expect(uniqueCodes.size).toBe(MAGOK_CODE_DIRECTORY.length)
  })

  it('모든 코드에 산업시설구역과 지식산업센터 verdict가 채워져 있다', () => {
    for (const entry of MAGOK_CODE_DIRECTORY) {
      expect(entry.zoneVerdicts.industrialFacility.verdict).toBeTruthy()
      expect(entry.zoneVerdicts.knowledgeIndustryCenter.verdict).toBeTruthy()
      expect(entry.zoneVerdicts.industrialFacility.reason.length).toBeGreaterThan(0)
      expect(entry.zoneVerdicts.knowledgeIndustryCenter.reason.length).toBeGreaterThan(0)
    }
  })

  it.each([
    ['63111', 'eligible', 'eligible'],
    ['63112', 'eligible', 'reviewRequired'],
    ['75994', 'ineligible', 'ineligible'],
    ['72121', 'eligible', 'eligible'],
    ['72922', 'ineligible', 'eligible'],
    ['71310', 'eligible', 'eligible'],
    ['74100', 'ineligible', 'eligible'],
    ['75320', 'ineligible', 'eligible'],
  ])(
    '%s 코드는 대표 판정이 유지된다',
    (code, industrialVerdict, knowledgeVerdict) => {
      const entry = getMagokCodeDirectoryEntry(code)

      expect(entry).not.toBeNull()
      expect(entry?.zoneVerdicts.industrialFacility.verdict).toBe(industrialVerdict)
      expect(entry?.zoneVerdicts.knowledgeIndustryCenter.verdict).toBe(knowledgeVerdict)
    },
  )
})
