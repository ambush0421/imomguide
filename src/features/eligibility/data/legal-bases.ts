import type { LegalBasis } from '@/features/eligibility/types'

export const LEGAL_BASES: Record<string, LegalBasis> = {
  decreeEligibility: {
    id: 'decreeEligibility',
    source: 'enforcementDecree',
    citation: '산업집적법 시행령 제6조 제1항',
    sourceDocumentTitle: '산업집적활성화 및 공장설립에 관한 법률 시행령',
    articlePath: '제6조 제1항',
    summary:
      '입주하려는 사업은 해당 산업단지 관리기본계획상의 입주대상산업 또는 사업지원에 필요한 사업이어야 합니다.',
    quote: '입주대상산업 여부는 산업단지 관리기본계획과 연결해서 해석해야 합니다.',
  },
  decreeKnowledgeIndustry: {
    id: 'decreeKnowledgeIndustry',
    source: 'enforcementDecree',
    citation: '산업집적법 시행령 제6조 제2항',
    sourceDocumentTitle: '산업집적활성화 및 공장설립에 관한 법률 시행령',
    articlePath: '제6조 제2항',
    summary:
      '지식산업에는 연구개발업, 엔지니어링, 광고, 출판, 디자인, 행사대행 등 지식서비스 업종이 포함됩니다.',
    quote: '연구개발업과 지식서비스 업종은 지식산업 범주로 묶여 해석됩니다.',
  },
  decreeInformationIndustry: {
    id: 'decreeInformationIndustry',
    source: 'enforcementDecree',
    citation: '산업집적법 시행령 제6조 제3항',
    sourceDocumentTitle: '산업집적활성화 및 공장설립에 관한 법률 시행령',
    articlePath: '제6조 제3항',
    summary:
      '정보통신산업에는 소프트웨어 개발, 시스템 통합, 호스팅, 데이터베이스, 전기통신업이 포함됩니다.',
    quote: '소프트웨어 개발, 시스템 통합, 데이터 처리 계열은 정보통신산업 근거로 연결됩니다.',
  },
  decreeOtherIndustry: {
    id: 'decreeOtherIndustry',
    source: 'enforcementDecree',
    citation: '산업집적법 시행령 제6조 제5항',
    sourceDocumentTitle: '산업집적활성화 및 공장설립에 관한 법률 시행령',
    articlePath: '제6조 제5항',
    summary:
      '폐기물 처리, 물류, 운송, 전기업, 부동산임대·공급업, 창업보육센터, 신탁업 등 추가 허용 산업을 규정합니다.',
    quote: '시행령은 본업 외에 일부 지원·운영 업종까지 별도로 허용 범위에 둡니다.',
  },
  decreeSupport: {
    id: 'decreeSupport',
    source: 'enforcementDecree',
    citation: '산업집적법 시행령 제6조 제6항',
    sourceDocumentTitle: '산업집적활성화 및 공장설립에 관한 법률 시행령',
    articlePath: '제6조 제6항',
    summary:
      '지원기관은 원칙적으로 광범위한 업종이 가능하나 제조업, 주거·숙박·위락 등 일부는 제외됩니다.',
    quote: '지원시설은 폭넓게 허용되지만 별도 제외 업종이 존재합니다.',
  },
  decreeDiscretion: {
    id: 'decreeDiscretion',
    source: 'enforcementDecree',
    citation: '산업집적법 시행령 제6조 제7항',
    sourceDocumentTitle: '산업집적활성화 및 공장설립에 관한 법률 시행령',
    articlePath: '제6조 제7항',
    summary:
      '관리기관은 산업단지의 조성목적이나 지역경제상 필요에 따라 예외적 입주자격을 부여할 수 있습니다.',
    quote: '직접 허용 업종이 아니어도 조성목적과 지역경제상 필요가 인정되면 예외 검토가 가능합니다.',
  },
  magokIndustrialPlan: {
    id: 'magokIndustrialPlan',
    source: 'magokPlan',
    citation: '마곡 관리기본계획 6~8쪽 산업시설구역 입주업종',
    sourceDocumentTitle: '마곡일반산업단지 관리기본계획 고시(제2025-593호)',
    pageHint: '6~8쪽',
    summary:
      '마곡 산업시설구역은 연구개발업, IT, BT, NT, GT, 에너지, 자원순환 등 지정 업종 위주로 입주를 허용합니다.',
    quote: '산업시설구역은 특화 산업군과 공통 허용 업종 중심으로 해석해야 합니다.',
  },
  magokKnowledgeCenterExtra: {
    id: 'magokKnowledgeCenterExtra',
    source: 'magokPlan',
    citation: '마곡 관리기본계획 7~8쪽 지식산업센터 예외 허용',
    sourceDocumentTitle: '마곡일반산업단지 관리기본계획 고시(제2025-593호)',
    pageHint: '7~8쪽',
    summary:
      '지식산업센터는 관리기본계획 기본 업종 외에도 시행령 제6조 제2항부터 제5항의 업종까지 확장 허용합니다.',
    quote: '지식산업센터는 시행령 제6조 제2항부터 제5항 업종까지 넓게 검토합니다.',
  },
  magokKnowledgeCenterExceptions: {
    id: 'magokKnowledgeCenterExceptions',
    source: 'magokPlan',
    citation: '마곡 관리기본계획 7쪽 예외 제한 문구',
    sourceDocumentTitle: '마곡일반산업단지 관리기본계획 고시(제2025-593호)',
    pageHint: '7쪽',
    summary:
      '포장 및 충전업, 자원비축시설, 부동산임대·공급업 또는 신탁업 단독 등록은 지식산업센터 입주가 제한됩니다.',
    quote: '예외 허용 범위에도 명시적 제외 업종과 단독 등록 제한이 있습니다.',
  },
  magokUniversityReview: {
    id: 'magokUniversityReview',
    source: 'magokPlan',
    citation: '마곡 관리기본계획 7쪽 대학·대학부설연구소',
    sourceDocumentTitle: '마곡일반산업단지 관리기본계획 고시(제2025-593호)',
    pageHint: '7쪽',
    summary:
      '대학 및 대학부설연구소는 정책심의위원회의 심의·의결을 거쳐 입주할 수 있습니다.',
    quote: '대학 계열 기관은 예외 심의 트랙으로 해석하는 것이 안전합니다.',
  },
  magokConvergenceReview: {
    id: 'magokConvergenceReview',
    source: 'magokPlan',
    citation: '마곡 관리기본계획 7쪽 융·복합 업종 심의',
    sourceDocumentTitle: '마곡일반산업단지 관리기본계획 고시(제2025-593호)',
    pageHint: '7쪽',
    summary:
      '지정 업종 외라도 산업 융·복합상 필요하다고 판단되는 업종은 위원회 심의를 통해 입주 가능 여부를 판단합니다.',
    quote: '융복합 필요성이 인정되면 정책심의위원회 심의 경로가 열려 있습니다.',
  },
  magokPublicInstitution: {
    id: 'magokPublicInstitution',
    source: 'magokPlan',
    citation: '마곡 관리기본계획 6쪽 공공기관·공직유관단체',
    sourceDocumentTitle: '마곡일반산업단지 관리기본계획 고시(제2025-593호)',
    pageHint: '6쪽',
    summary:
      '시행령 제6조상 입주자격 업종을 영위하는 공공기관·공직유관단체는 정책심의위원회 승인 시 입주할 수 있습니다.',
    quote: '공공기관 계열은 업종 요건 충족과 별도 승인 절차를 함께 봐야 합니다.',
  },
  magokManufacturingCondition: {
    id: 'magokManufacturingCondition',
    source: 'magokPlan',
    citation: '마곡 관리기본계획 10~11쪽 제조시설 및 사업화시설 조건',
    sourceDocumentTitle: '마곡일반산업단지 관리기본계획 고시(제2025-593호)',
    pageHint: '10~11쪽',
    summary:
      '제조시설은 연구시설 비율을 유지하면서 제조시설 비율 20% 이하와 연구개발-생산 연계성 등을 충족해야 합니다.',
    quote: '연구시설 비율 유지와 제조시설 상한은 함께 검토해야 하는 핵심 조건입니다.',
  },
  magokSupportPending: {
    id: 'magokSupportPending',
    source: 'magokPlan',
    citation: '마곡 관리기본계획 7~8쪽 지원시설구역',
    sourceDocumentTitle: '마곡일반산업단지 관리기본계획 고시(제2025-593호)',
    pageHint: '7~8쪽',
    summary:
      '지원시설구역은 마곡 지구단위계획 시행지침의 허용용도를 따라야 하므로, 세부 자동판정에는 별도 기준서가 필요합니다.',
    quote: '지원시설구역은 별도 지침 확인 없이는 자동 확정이 어렵습니다.',
  },
}

export function legalBasesFromIds(ids: string[]) {
  return ids
    .map((id) => LEGAL_BASES[id])
    .filter((basis): basis is LegalBasis => Boolean(basis))
}
