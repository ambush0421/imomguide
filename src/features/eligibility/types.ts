export type ZoneType =
  | 'industrialFacility'
  | 'knowledgeIndustryCenter'
  | 'supportFacility'

export type Verdict =
  | 'eligible'
  | 'conditional'
  | 'reviewRequired'
  | 'ineligible'
  | 'insufficient'

export type ApplicantType =
  | 'company'
  | 'universityLab'
  | 'publicInstitution'
  | 'publicRelatedOrg'
  | 'ventureClusterTenant'
  | 'startupIncubator'
  | 'softwarePromotionFacility'

export type RegulatoryFit =
  | 'auto'
  | 'knowledgeIndustry'
  | 'informationIndustry'
  | 'otherPermittedIndustry'

export interface EligibilityFlags {
  isPackagingAndFilling: boolean
  isResourceStockpile: boolean
  isHosting63112: boolean
  isRealEstateOnly: boolean
  isTrustOnly: boolean
  hasManufacturingFacility: boolean
  requiresCommitteeReview: boolean
}

export interface EligibilityInput {
  companyName: string
  address: string
  zoneType: ZoneType
  ksicCode: string
  ksicName: string
  applicantType: ApplicantType
  regulatoryFit: RegulatoryFit
  notes: string
  flags: EligibilityFlags
}

export interface LegalBasis {
  id: string
  source: 'enforcementDecree' | 'magokPlan'
  citation: string
  summary: string
}

export interface IndustryRule {
  id: string
  label: string
  prefixes: string[]
  group: string
  summary: string
  legalBasisIds: string[]
}

export interface EligibilityResult {
  verdict: Verdict
  title: string
  summary: string
  reasons: string[]
  requiredActions: string[]
  matchedRules: string[]
  legalBases: LegalBasis[]
}

export type IndustrySuggestionMatchKind = 'exact' | 'related'

export type IndustrySuggestionSource = 'directCode' | 'preset' | 'catalog'

export interface IndustrySuggestion {
  id: string
  code: string
  name: string
  reason: string
  matchKind: IndustrySuggestionMatchKind
  source: IndustrySuggestionSource
  score: number
  suggestedRegulatoryFit?: RegulatoryFit
  catalogVerdict?: string
  catalogNote?: string
}
