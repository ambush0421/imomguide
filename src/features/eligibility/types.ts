export type ZoneType =
  | 'industrialFacility'
  | 'knowledgeIndustryCenter'
  | 'supportFacility'

export type DirectoryZoneType = Exclude<ZoneType, 'supportFacility'>
export type CompanyScale = 'sme' | 'large'

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
  | 'higherEducationResearchInstitute'
  | 'basicResearchInstitution'
  | 'elearningIndustry'
  | 'managedTechnicalService'

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
  companyScale: CompanyScale
  grossAreaPy: string
  rndHeadcount: string
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
  sourceDocumentTitle?: string
  articlePath?: string
  pageHint?: string
  quote?: string
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

export interface MagokDirectoryZoneVerdict {
  verdict: Verdict
  reason: string
  legalBasisIds: string[]
  notes: string[]
}

export interface MagokCodeDirectoryEntry {
  code: string
  name: string
  sectionCode: string
  sectionName: string
  divisionCode: string
  divisionName: string
  groupCode: string
  groupName: string
  categoryCode: string
  categoryName: string
  browseCategory: string
  zoneVerdicts: Record<DirectoryZoneType, MagokDirectoryZoneVerdict>
  searchKeywords: string[]
}

export type IndustrySuggestionMatchKind = 'exact' | 'related'

export type IndustrySuggestionSource = 'directCode' | 'preset' | 'catalog' | 'directory'

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
  selectedZoneVerdict?: Verdict
  recommendationReason?: string
}
