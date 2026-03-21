import type {
  ApplicantType,
  EligibilityAdditionalCode,
  EligibilityCodeEvaluation,
  CompanyScale,
  ComparableZoneType,
  EligibilityComparisonResults,
  EligibilityFlags,
  EligibilityInput,
  EligibilityResult,
  LegalBasis,
  RegulatoryFit,
  ZoneType,
} from '@/features/eligibility/types'
import { formatVerdictLabel } from '@/utils/format'

const zoneTypes = [
  'industrialFacility',
  'knowledgeIndustryCenter',
  'supportFacility',
] as const satisfies readonly ZoneType[]
const companyScales = ['sme', 'large'] as const satisfies readonly CompanyScale[]
const applicantTypes = [
  'company',
  'universityLab',
  'publicInstitution',
  'publicRelatedOrg',
  'ventureClusterTenant',
  'startupIncubator',
  'softwarePromotionFacility',
] as const satisfies readonly ApplicantType[]
const regulatoryFits = [
  'auto',
  'knowledgeIndustry',
  'informationIndustry',
  'otherPermittedIndustry',
  'higherEducationResearchInstitute',
  'basicResearchInstitution',
  'elearningIndustry',
  'managedTechnicalService',
] as const satisfies readonly RegulatoryFit[]

const comparableZoneOrder: ComparableZoneType[] = [
  'knowledgeIndustryCenter',
  'industrialFacility',
]

const zoneTypeLabels: Record<ZoneType, string> = {
  industrialFacility: '산업시설구역',
  knowledgeIndustryCenter: '지식산업센터',
  supportFacility: '지원시설구역',
}

export interface SharedEligibilityState {
  input: EligibilityInput
  compareZones: boolean
  additionalCodes: EligibilityAdditionalCode[]
}

export interface EligibilityResultDocumentOptions {
  compareZones?: boolean
  comparisonResults?: EligibilityComparisonResults | null
  multiCodeResults?: EligibilityCodeEvaluation[] | null
}

export const defaultSharedEligibilityInput: EligibilityInput = {
  companyName: '',
  address: '',
  zoneType: 'knowledgeIndustryCenter',
  ksicCode: '',
  ksicName: '',
  companyScale: 'sme',
  grossAreaPy: '',
  rndHeadcount: '',
  applicantType: 'company',
  regulatoryFit: 'auto',
  notes: '',
  flags: {
    isPackagingAndFilling: false,
    isResourceStockpile: false,
    isHosting63112: false,
    isRealEstateOnly: false,
    isTrustOnly: false,
    hasManufacturingFacility: false,
    requiresCommitteeReview: false,
  },
}

interface SharedEligibilityPayloadV1 {
  version: 1
  input: EligibilityInput
}

interface SharedEligibilityPayloadV2 {
  version: 2
  input: EligibilityInput
  compareZones: boolean
}

interface SharedEligibilityPayloadV3 {
  version: 3
  input: EligibilityInput
  compareZones: boolean
  additionalCodes: EligibilityAdditionalCode[]
}

type SharedEligibilityPayload =
  | SharedEligibilityPayloadV1
  | SharedEligibilityPayloadV2
  | SharedEligibilityPayloadV3

const maxAdditionalCodes = 2

function normalizeString(value: unknown) {
  return typeof value === 'string' ? value : ''
}

function normalizeBoolean(value: unknown) {
  return value === true
}

function normalizeEnum<T extends readonly string[]>(
  value: unknown,
  allowedValues: T,
  fallback: T[number],
): T[number] {
  return typeof value === 'string' && allowedValues.includes(value)
    ? value
    : fallback
}

function normalizeFlags(value: unknown): EligibilityFlags {
  const nextValue =
    value && typeof value === 'object'
      ? (value as Partial<Record<keyof EligibilityFlags, unknown>>)
      : {}

  return {
    isPackagingAndFilling: normalizeBoolean(nextValue.isPackagingAndFilling),
    isResourceStockpile: normalizeBoolean(nextValue.isResourceStockpile),
    isHosting63112: normalizeBoolean(nextValue.isHosting63112),
    isRealEstateOnly: normalizeBoolean(nextValue.isRealEstateOnly),
    isTrustOnly: normalizeBoolean(nextValue.isTrustOnly),
    hasManufacturingFacility: normalizeBoolean(nextValue.hasManufacturingFacility),
    requiresCommitteeReview: normalizeBoolean(nextValue.requiresCommitteeReview),
  }
}

function normalizeAdditionalCodes(value: unknown): EligibilityAdditionalCode[] {
  if (!Array.isArray(value)) {
    return []
  }

  return value.slice(0, maxAdditionalCodes).map((item, index) => {
    const nextValue =
      item && typeof item === 'object'
        ? (item as Partial<Record<keyof EligibilityAdditionalCode, unknown>>)
        : {}

    return {
      id: normalizeString(nextValue.id) || `shared-code-${index + 1}`,
      ksicCode: normalizeString(nextValue.ksicCode),
      ksicName: normalizeString(nextValue.ksicName),
    }
  })
}

export function normalizeSharedEligibilityInput(value: unknown): EligibilityInput {
  const nextValue =
    value && typeof value === 'object'
      ? (value as Partial<Record<keyof EligibilityInput, unknown>>)
      : {}

  return {
    companyName: normalizeString(nextValue.companyName),
    address: normalizeString(nextValue.address),
    zoneType: normalizeEnum(
      nextValue.zoneType,
      zoneTypes,
      defaultSharedEligibilityInput.zoneType,
    ),
    ksicCode: normalizeString(nextValue.ksicCode),
    ksicName: normalizeString(nextValue.ksicName),
    companyScale: normalizeEnum(
      nextValue.companyScale,
      companyScales,
      defaultSharedEligibilityInput.companyScale,
    ),
    grossAreaPy: normalizeString(nextValue.grossAreaPy),
    rndHeadcount: normalizeString(nextValue.rndHeadcount),
    applicantType: normalizeEnum(
      nextValue.applicantType,
      applicantTypes,
      defaultSharedEligibilityInput.applicantType,
    ),
    regulatoryFit: normalizeEnum(
      nextValue.regulatoryFit,
      regulatoryFits,
      defaultSharedEligibilityInput.regulatoryFit,
    ),
    notes: normalizeString(nextValue.notes),
    flags: normalizeFlags(nextValue.flags),
  }
}

function encodeBase64Url(value: string) {
  const bytes = new TextEncoder().encode(value)
  let binary = ''

  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte)
  })

  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '')
}

function decodeBase64Url(value: string) {
  const base64Value = value.replace(/-/g, '+').replace(/_/g, '/')
  const padding = base64Value.length % 4 === 0 ? '' : '='.repeat(4 - (base64Value.length % 4))
  const binary = atob(`${base64Value}${padding}`)
  const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0))

  return new TextDecoder().decode(bytes)
}

export function encodeSharedEligibilityState(state: SharedEligibilityState) {
  const payload: SharedEligibilityPayloadV3 = {
    version: 3,
    input: normalizeSharedEligibilityInput(state.input),
    compareZones: normalizeBoolean(state.compareZones),
    additionalCodes: normalizeAdditionalCodes(state.additionalCodes),
  }

  return encodeBase64Url(JSON.stringify(payload))
}

export function encodeSharedEligibilityInput(input: EligibilityInput) {
  return encodeSharedEligibilityState({
    input,
    compareZones: false,
    additionalCodes: [],
  })
}

export function decodeSharedEligibilityState(value: string): SharedEligibilityState | null {
  try {
    const decoded = JSON.parse(
      decodeBase64Url(value),
    ) as Partial<SharedEligibilityPayload> | null

    if (
      !decoded ||
      (decoded.version !== 1 && decoded.version !== 2 && decoded.version !== 3)
    ) {
      return null
    }

    return {
      input: normalizeSharedEligibilityInput(decoded.input),
      compareZones:
        decoded.version === 2 || decoded.version === 3
          ? normalizeBoolean(decoded.compareZones)
          : false,
      additionalCodes:
        decoded.version === 3 ? normalizeAdditionalCodes(decoded.additionalCodes) : [],
    }
  } catch {
    return null
  }
}

export function decodeSharedEligibilityInput(value: string): EligibilityInput | null {
  return decodeSharedEligibilityState(value)?.input ?? null
}

export function createSharedFinderHash(
  input: EligibilityInput,
  options?: {
    compareZones?: boolean
    additionalCodes?: EligibilityAdditionalCode[]
  },
) {
  return `#finder?share=${encodeSharedEligibilityState({
    input,
    compareZones: options?.compareZones ?? false,
    additionalCodes: options?.additionalCodes ?? [],
  })}`
}

function getUniqueLegalBases(values: LegalBasis[]) {
  return values.filter(
    (basis, index, allValues) =>
      allValues.findIndex((candidate) => candidate.id === basis.id) === index,
  )
}

function buildSingleResultSummaryLines(
  input: EligibilityInput,
  result: EligibilityResult,
) {
  const lines = [
    '마곡 입주 예비판정 요약',
    `${input.ksicCode.trim()} ${input.ksicName.trim()}`.trim() || '업종코드 미입력',
    `${zoneTypeLabels[input.zoneType]} 기준 ${formatVerdictLabel(result.verdict)}`,
    result.title,
    result.summary,
  ]

  if (result.reasons.length > 0) {
    lines.push('', '판정 이유')
    result.reasons.forEach((reason) => {
      lines.push(`- ${reason}`)
    })
  }

  if (result.requiredActions.length > 0) {
    lines.push('', '추가 확인')
    result.requiredActions.forEach((action) => {
      lines.push(`- ${action}`)
    })
  }

  if (result.legalBases.length > 0) {
    lines.push('', '법적 근거')
    result.legalBases.forEach((basis) => {
      const suffix = basis.articlePath ? ` / ${basis.articlePath}` : ''
      lines.push(`- ${basis.citation}${suffix}`)
    })
  }

  return lines
}

function getCodeHeading(label: string, ksicCode: string, ksicName: string) {
  const codeAndName = `${ksicCode.trim()} ${ksicName.trim()}`.trim()

  return codeAndName ? `${label}: ${codeAndName}` : `${label}: 업종코드 미입력`
}

function buildComparisonSummaryLines(
  input: EligibilityInput,
  comparisonResults: EligibilityComparisonResults,
) {
  const lines = [
    '마곡 입주 예비판정 비교 요약',
    `${input.ksicCode.trim()} ${input.ksicName.trim()}`.trim() || '업종코드 미입력',
    '지식산업센터와 산업시설구역을 같은 조건으로 나란히 비교했습니다.',
  ]

  comparableZoneOrder.forEach((zoneType) => {
    const result = comparisonResults[zoneType]
    lines.push(
      '',
      `${zoneTypeLabels[zoneType]}: ${formatVerdictLabel(result.verdict)}`,
      result.title,
      result.summary,
    )

    if (result.reasons.length > 0) {
      lines.push('판정 이유')
      result.reasons.forEach((reason) => {
        lines.push(`- ${reason}`)
      })
    }

    if (result.requiredActions.length > 0) {
      lines.push('추가 확인')
      result.requiredActions.forEach((action) => {
        lines.push(`- ${action}`)
      })
    }
  })

  const legalBases = getUniqueLegalBases(
    comparableZoneOrder.flatMap((zoneType) => comparisonResults[zoneType].legalBases),
  )

  if (legalBases.length > 0) {
    lines.push('', '법적 근거')
    legalBases.forEach((basis) => {
      const suffix = basis.articlePath ? ` / ${basis.articlePath}` : ''
      lines.push(`- ${basis.citation}${suffix}`)
    })
  }

  return lines
}

function buildMultiCodeSummaryLines(
  input: EligibilityInput,
  multiCodeResults: EligibilityCodeEvaluation[],
  options?: EligibilityResultDocumentOptions,
) {
  const isComparisonMode = Boolean(options?.compareZones)
  const lines = [
    isComparisonMode ? '마곡 입주 복수 업종코드 비교 요약' : '마곡 입주 복수 업종코드 판정 요약',
    `총 ${multiCodeResults.length}개 업종코드를 함께 검토했습니다.`,
  ]

  multiCodeResults.forEach((entry) => {
    lines.push('', getCodeHeading(entry.label, entry.ksicCode, entry.ksicName))

    if (isComparisonMode && entry.comparisonResults) {
      const comparisonResultsForEntry = entry.comparisonResults

      comparableZoneOrder.forEach((zoneType) => {
        const comparisonResult = comparisonResultsForEntry[zoneType]

        lines.push(
          `${zoneTypeLabels[zoneType]} 기준 ${formatVerdictLabel(comparisonResult.verdict)}`,
          comparisonResult.title,
          comparisonResult.summary,
        )

        if (comparisonResult.reasons.length > 0) {
          lines.push('판정 이유')
          comparisonResult.reasons.forEach((reason) => {
            lines.push(`- ${reason}`)
          })
        }

        if (comparisonResult.requiredActions.length > 0) {
          lines.push('추가 확인')
          comparisonResult.requiredActions.forEach((action) => {
            lines.push(`- ${action}`)
          })
        }
      })

      return
    }

    lines.push(
      `${zoneTypeLabels[input.zoneType]} 기준 ${formatVerdictLabel(entry.result.verdict)}`,
      entry.result.title,
      entry.result.summary,
    )

    if (entry.result.reasons.length > 0) {
      lines.push('판정 이유')
      entry.result.reasons.forEach((reason) => {
        lines.push(`- ${reason}`)
      })
    }

    if (entry.result.requiredActions.length > 0) {
      lines.push('추가 확인')
      entry.result.requiredActions.forEach((action) => {
        lines.push(`- ${action}`)
      })
    }
  })

  const legalBases = getUniqueLegalBases(
    multiCodeResults.flatMap((entry) => {
      if (isComparisonMode && entry.comparisonResults) {
        const comparisonResultsForEntry = entry.comparisonResults

        return comparableZoneOrder.flatMap(
          (zoneType) => comparisonResultsForEntry[zoneType].legalBases,
        )
      }

      return entry.result.legalBases
    }),
  )

  if (legalBases.length > 0) {
    lines.push('', '법적 근거')
    legalBases.forEach((basis) => {
      const suffix = basis.articlePath ? ` / ${basis.articlePath}` : ''
      lines.push(`- ${basis.citation}${suffix}`)
    })
  }

  return lines
}

export function buildEligibilityResultSummary(
  input: EligibilityInput,
  result: EligibilityResult,
  options?: EligibilityResultDocumentOptions,
) {
  const lines =
    options?.multiCodeResults && options.multiCodeResults.length > 1
      ? buildMultiCodeSummaryLines(input, options.multiCodeResults, options)
      : options?.compareZones && options.comparisonResults
        ? buildComparisonSummaryLines(input, options.comparisonResults)
        : buildSingleResultSummaryLines(input, result)

  return lines.join('\n')
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function getPrintMetaLine(
  input: EligibilityInput,
  options?: EligibilityResultDocumentOptions,
) {
  if (options?.multiCodeResults && options.multiCodeResults.length > 1) {
    const targetLabel =
      options.compareZones ? '지식산업센터 + 산업시설구역 비교' : zoneTypeLabels[input.zoneType]

    return `복수 업종코드 ${options.multiCodeResults.length}건 · ${targetLabel}`
  }

  const targetLabel =
    options?.compareZones && options.comparisonResults
      ? '지식산업센터 + 산업시설구역 비교'
      : zoneTypeLabels[input.zoneType]

  return `${targetLabel} · ${input.ksicCode.trim()} ${input.ksicName.trim()}`.trim()
}

export function buildEligibilityPrintDocument(
  input: EligibilityInput,
  result: EligibilityResult,
  options?: EligibilityResultDocumentOptions,
) {
  const summary = buildEligibilityResultSummary(input, result, options)
  const htmlSummary = escapeHtml(summary).replace(/\n/g, '<br />')

  return `<!doctype html>
<html lang="ko">
  <head>
    <meta charset="utf-8" />
    <title>마곡 입주 예비판정 결과</title>
    <style>
      body {
        margin: 0;
        padding: 40px;
        font-family: "Pretendard", "Apple SD Gothic Neo", "Malgun Gothic", sans-serif;
        color: #162033;
        background: #ffffff;
      }
      .page {
        max-width: 760px;
        margin: 0 auto;
      }
      h1 {
        margin: 0 0 12px;
        font-size: 28px;
        line-height: 1.2;
      }
      .meta {
        margin-bottom: 24px;
        color: #4a5872;
        font-size: 14px;
      }
      .panel {
        border: 1px solid #d9e2ef;
        border-radius: 18px;
        padding: 24px;
        background: #f8fbff;
      }
      .summary {
        margin: 0;
        font-size: 15px;
        line-height: 1.8;
        white-space: normal;
      }
    </style>
  </head>
  <body>
    <main class="page">
      <h1>마곡 입주 예비판정 결과</h1>
      <div class="meta">${escapeHtml(getPrintMetaLine(input, options))}</div>
      <section class="panel">
        <p class="summary">${htmlSummary}</p>
      </section>
    </main>
    <script>
      window.addEventListener('load', function () {
        window.focus();
        window.print();
      });
    </script>
  </body>
</html>`
}
