import type { LegalBasis } from '@/features/eligibility/types'
import { LEGAL_BASES } from '@/features/eligibility/data/legal-bases'

export interface SourceReference {
  title: string
  url: string
  authority: string
  publishedDate?: string
  documentNumber?: string
  description?: string
}

export interface LegalLibraryEntry {
  id: string
  title: string
  effectiveDate: string
  summary: string
  applicability: string
  sourceKind: 'enforcementDecree' | 'magokPlan'
  basisIds: string[]
  officialSource: SourceReference
  supplementarySources?: SourceReference[]
}

export interface LegalLibraryEntryDetail extends LegalLibraryEntry {
  bases: LegalBasis[]
}

export const LEGAL_LIBRARY_ENTRIES: LegalLibraryEntry[] = [
  {
    id: 'decree',
    title: '산업집적활성화 및 공장설립에 관한 법률 시행령',
    effectiveDate: '2025-01-21',
    summary:
      '입주자격의 기본 원칙과 지식산업, 정보통신산업, 기타 허용업종 범위를 정의하는 상위 기준입니다.',
    applicability:
      '모든 자동 판정의 공통 상위 근거로 사용되며, 지식산업센터 예외 허용 범위를 읽을 때 특히 중요합니다.',
    sourceKind: 'enforcementDecree',
    basisIds: [
      'decreeEligibility',
      'decreeKnowledgeIndustry',
      'decreeInformationIndustry',
      'decreeOtherIndustry',
      'decreeSupport',
      'decreeDiscretion',
    ],
    officialSource: {
      title: '국가법령정보센터 본문',
      url: 'https://law.go.kr/LSW/lsInfoP.do?lsiSeq=268501',
      authority: '법제처 국가법령정보센터',
      publishedDate: '2025-01-21',
      documentNumber: '대통령령 제35221호',
      description:
        '국가법령정보센터에서 제공하는 현행 시행령 본문으로, 실제 조문 확인 시 가장 먼저 열어야 하는 원문 페이지입니다.',
    },
  },
  {
    id: 'magok-plan',
    title: '마곡일반산업단지 관리기본계획 고시(제2025-593호)',
    effectiveDate: '2025-10-30',
    summary:
      '마곡 산업시설구역, 지식산업센터, 예외 심의, 제조시설 조건을 실제 운영 기준으로 좁혀 주는 핵심 문서입니다.',
    applicability:
      '산업시설구역 특화 업종, 지식산업센터 예외 허용, 융복합 심의, 제조시설 상한을 읽을 때 직접 근거로 사용합니다.',
    sourceKind: 'magokPlan',
    basisIds: [
      'magokIndustrialPlan',
      'magokKnowledgeCenterExtra',
      'magokKnowledgeCenterExceptions',
      'magokUniversityReview',
      'magokConvergenceReview',
      'magokPublicInstitution',
      'magokManufacturingCondition',
      'magokSupportPending',
    ],
    officialSource: {
      title: '서울특별시 고시문 PDF',
      url: 'https://news.seoul.go.kr/citybuild/files/2025/10/6903187d05b688.79849550.pdf',
      authority: '서울특별시',
      publishedDate: '2025-10-30',
      documentNumber: '서울특별시고시 제2025-593호',
      description:
        '마곡일반산업단지 관리기본계획 변경 고시 원문 PDF입니다. 실제 페이지 번호와 별표를 그대로 확인할 수 있습니다.',
    },
    supplementarySources: [
      {
        title: '서울특별시 도시공간본부 고시 페이지',
        url: 'https://news.seoul.go.kr/citybuild/archives/522314',
        authority: '서울특별시 도시공간본부',
        publishedDate: '2025-10-30',
        documentNumber: '서울특별시고시 제2025-593호',
        description:
          '서울특별시 도시공간본부의 게시 페이지로, 고시 개요와 첨부 원문 파일을 함께 확인할 수 있습니다.',
      },
    ],
  },
]

export function getLegalLibraryEntryDetails(): LegalLibraryEntryDetail[] {
  return LEGAL_LIBRARY_ENTRIES.map((entry) => ({
    ...entry,
    bases: entry.basisIds.map((id) => LEGAL_BASES[id]).filter(Boolean),
  }))
}

export function getLegalLibraryEntryById(id: string) {
  return LEGAL_LIBRARY_ENTRIES.find((entry) => entry.id === id)
}

export function getLegalLibraryEntryBySourceKind(sourceKind: LegalBasis['source']) {
  return LEGAL_LIBRARY_ENTRIES.find((entry) => entry.sourceKind === sourceKind)
}
