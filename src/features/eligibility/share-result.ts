import type {
  ApplicantType,
  CompanyScale,
  EligibilityFlags,
  EligibilityInput,
  EligibilityResult,
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

const zoneTypeLabels: Record<ZoneType, string> = {
  industrialFacility: '산업시설구역',
  knowledgeIndustryCenter: '지식산업센터',
  supportFacility: '지원시설구역',
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

interface SharedEligibilityPayload {
  version: 1
  input: EligibilityInput
}

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

export function encodeSharedEligibilityInput(input: EligibilityInput) {
  const payload: SharedEligibilityPayload = {
    version: 1,
    input: normalizeSharedEligibilityInput(input),
  }

  return encodeBase64Url(JSON.stringify(payload))
}

export function decodeSharedEligibilityInput(value: string): EligibilityInput | null {
  try {
    const decoded = JSON.parse(
      decodeBase64Url(value),
    ) as Partial<SharedEligibilityPayload> | null

    if (!decoded || decoded.version !== 1) {
      return null
    }

    return normalizeSharedEligibilityInput(decoded.input)
  } catch {
    return null
  }
}

export function createSharedFinderHash(input: EligibilityInput) {
  return `#finder?share=${encodeSharedEligibilityInput(input)}`
}

export function buildEligibilityResultSummary(
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

export function buildEligibilityPrintDocument(
  input: EligibilityInput,
  result: EligibilityResult,
) {
  const summary = buildEligibilityResultSummary(input, result)
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
      <div class="meta">${escapeHtml(
        `${zoneTypeLabels[input.zoneType]} · ${input.ksicCode.trim()} ${input.ksicName.trim()}`.trim(),
      )}</div>
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
