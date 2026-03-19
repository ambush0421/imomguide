import type { ApplicantType, IndustryRule } from '@/features/eligibility/types'

export const MAGOK_INDUSTRIAL_RULES: IndustryRule[] = [
  { id: 'r-and-d', label: '연구개발업', prefixes: ['70'], group: '공통', summary: '연구개발업은 마곡 산업시설구역의 기본 허용 업종입니다.', legalBasisIds: ['magokIndustrialPlan', 'decreeKnowledgeIndustry'] },
  { id: 'advertising', label: '광고대행업', prefixes: ['7131'], group: '공통', summary: '광고대행업은 공통 허용 업종으로 분류됩니다.', legalBasisIds: ['magokIndustrialPlan'] },
  { id: 'engineering', label: '건축기술·엔지니어링', prefixes: ['721'], group: '공통', summary: '건축기술, 엔지니어링 및 관련 기술 서비스업이 허용됩니다.', legalBasisIds: ['magokIndustrialPlan', 'decreeKnowledgeIndustry'] },
  { id: 'testing', label: '기술시험·검사·분석', prefixes: ['7291'], group: '공통', summary: '기술시험, 검사 및 분석업은 공통 허용 업종입니다.', legalBasisIds: ['magokIndustrialPlan'] },
  { id: 'design', label: '전문 디자인업', prefixes: ['7320'], group: '공통', summary: '전문 디자인업은 공통 허용 업종입니다.', legalBasisIds: ['magokIndustrialPlan', 'decreeKnowledgeIndustry'] },
  { id: 'professional-services', label: '기타 전문서비스업', prefixes: ['7160'], group: '공통', summary: '기타 전문서비스업은 공통 허용 업종입니다.', legalBasisIds: ['magokIndustrialPlan'] },
  { id: 'it-precision', label: 'IT·정밀기기', prefixes: ['272'], group: 'IT', summary: '정밀기기 제조업은 마곡 IT 특화 업종으로 허용됩니다.', legalBasisIds: ['magokIndustrialPlan'] },
  { id: 'it-electronics', label: '전자부품·컴퓨터·통신장비', prefixes: ['26'], group: 'IT', summary: '전자부품, 컴퓨터, 영상·음향 및 통신장비 제조업이 허용됩니다.', legalBasisIds: ['magokIndustrialPlan'] },
  { id: 'it-electrical', label: '전기장비 제조업', prefixes: ['28'], group: 'IT', summary: '전기장비 제조업이 허용됩니다.', legalBasisIds: ['magokIndustrialPlan'] },
  { id: 'it-publishing', label: '출판업', prefixes: ['58'], group: 'IT', summary: '출판업은 마곡 IT 특화 업종으로 분류됩니다.', legalBasisIds: ['magokIndustrialPlan', 'decreeKnowledgeIndustry'] },
  { id: 'it-media', label: '영상·오디오 기록물 제작·배급', prefixes: ['59'], group: 'IT', summary: '영상 및 오디오 기록물 제작업은 IT 특화 업종으로 허용됩니다.', legalBasisIds: ['magokIndustrialPlan', 'decreeKnowledgeIndustry'] },
  { id: 'it-program-provider', label: '프로그램 공급업', prefixes: ['60221'], group: 'IT', summary: '프로그램 공급업은 마곡 IT 특화 업종입니다.', legalBasisIds: ['magokIndustrialPlan'] },
  { id: 'it-telecom', label: '전기통신업', prefixes: ['612'], group: 'IT', summary: '전기통신업이 허용됩니다.', legalBasisIds: ['magokIndustrialPlan', 'decreeInformationIndustry'] },
  { id: 'it-programming', label: '컴퓨터 프로그래밍·시스템 통합', prefixes: ['62'], group: 'IT', summary: '컴퓨터 프로그래밍, 시스템 통합 및 관리업이 허용됩니다.', legalBasisIds: ['magokIndustrialPlan', 'decreeInformationIndustry'] },
  { id: 'it-information-service', label: '정보서비스업', prefixes: ['63'], group: 'IT', summary: '정보서비스업이 허용됩니다.', legalBasisIds: ['magokIndustrialPlan', 'decreeInformationIndustry'] },
  { id: 'it-exhibition', label: '전시·컨벤션·행사 대행업', prefixes: ['75992'], group: 'IT', summary: '전시, 컨벤션 및 행사 대행업이 허용됩니다.', legalBasisIds: ['magokIndustrialPlan', 'decreeKnowledgeIndustry'] },
  { id: 'bt-crop', label: '작물재배업', prefixes: ['011'], group: 'BT', summary: '유전공학 및 바이오 연계 작물재배업이 허용됩니다.', legalBasisIds: ['magokIndustrialPlan'] },
  { id: 'bt-food-additive', label: '조미료·식품첨가물 제조', prefixes: ['1083', '1089', '109'], group: 'BT', summary: '바이오 관련 식품 제조 계열이 허용됩니다.', legalBasisIds: ['magokIndustrialPlan'] },
  { id: 'bt-chemical', label: '비료·화학·의약품', prefixes: ['2031', '204', '21'], group: 'BT', summary: '바이오신약, 바이오시밀러 등 관련 화학·의약품 업종이 허용됩니다.', legalBasisIds: ['magokIndustrialPlan'] },
  { id: 'bt-medical-device', label: '의료용기기', prefixes: ['271'], group: 'BT', summary: '의료용기기 제조업이 허용됩니다.', legalBasisIds: ['magokIndustrialPlan'] },
  { id: 'bt-veterinary', label: '수의업', prefixes: ['731'], group: 'BT', summary: '바이오 장기·수의 관련 업종이 허용됩니다.', legalBasisIds: ['magokIndustrialPlan'] },
  { id: 'nt-materials', label: '나노소재·금속가공', prefixes: ['23', '25'], group: 'NT', summary: '비금속 광물제품 및 금속가공제품 계열이 허용됩니다.', legalBasisIds: ['magokIndustrialPlan'] },
  { id: 'gt-production', label: '그린생산 제조', prefixes: ['1419', '13213', '22', '29', '30', '31'], group: 'GT', summary: '그린생산 관련 제조업이 허용됩니다.', legalBasisIds: ['magokIndustrialPlan'] },
  { id: 'energy', label: '에너지 공급업', prefixes: ['35'], group: '에너지', summary: '전기, 가스, 증기 및 공기조절 공급업이 허용됩니다.', legalBasisIds: ['magokIndustrialPlan', 'decreeOtherIndustry'] },
  { id: 'resource-circulation', label: '자원순환·환경정화', prefixes: ['38', '39'], group: '자원순환', summary: '폐기물 처리 및 환경정화·복원 업종이 허용됩니다.', legalBasisIds: ['magokIndustrialPlan', 'decreeOtherIndustry'] },
]

export const KNOWLEDGE_CENTER_EXTRA_RULES: IndustryRule[] = [
  { id: 'kic-trust', label: '신탁업 및 집합 투자업', prefixes: ['64201'], group: '지식산업센터 특례', summary: '신탁업은 다른 허용 업종과 함께 등록된 경우에만 조건부 허용됩니다.', legalBasisIds: ['magokKnowledgeCenterExtra', 'decreeOtherIndustry'] },
  { id: 'kic-real-estate-rent', label: '부동산임대업', prefixes: ['68112'], group: '지식산업센터 특례', summary: '지식산업센터 설치·운영 목적의 부동산임대업은 예외적으로 허용됩니다.', legalBasisIds: ['magokKnowledgeCenterExtra', 'decreeOtherIndustry'] },
  { id: 'kic-real-estate-supply', label: '부동산공급업', prefixes: ['68122'], group: '지식산업센터 특례', summary: '지식산업센터 설치·운영 목적의 부동산공급업은 예외적으로 허용됩니다.', legalBasisIds: ['magokKnowledgeCenterExtra', 'decreeOtherIndustry'] },
]

export const REVIEW_SCENARIOS = [
  { id: 'hosting-review', label: '호스팅 및 관련 서비스업(63112)', summary: '정확 5자리 코드 기준으로 지식산업센터 예외 허용 여부를 위원회가 판단합니다.' },
  { id: 'university-review', label: '대학·대학부설연구소', summary: '정책심의위원회 심의·의결을 거쳐 입주 가능 여부를 판단합니다.' },
  { id: 'public-review', label: '공공기관·공직유관단체', summary: '시행령 제6조상 업종 요건을 충족한 뒤 정책심의위원회 승인이 필요합니다.' },
  { id: 'convergence-review', label: '융·복합 또는 경계 업종', summary: '관리기본계획상 지정 업종 외라도 위원회 심의로 최종 판단이 가능합니다.' },
]

export const BLOCKING_SCENARIOS = [
  { id: 'packaging-block', label: '포장 및 충전업', summary: '지식산업센터 예외 허용 범위에서 명시적으로 제외됩니다.' },
  { id: 'passenger-transport-block', label: '여객 운송업 계열', summary: '철도·버스·택시·여객선·항공 여객 운송업은 시행령 단서에 따라 지식산업센터 허용 대상에서 제외됩니다.' },
  { id: 'stockpile-block', label: '자원비축시설', summary: '지식산업센터 예외 허용 범위에서 명시적으로 제외됩니다.' },
  { id: 'real-estate-only-block', label: '부동산임대·공급업 단독', summary: '다른 허용 업종 없이 단독 등록한 경우 지식산업센터 입주가 불가합니다.' },
  { id: 'trust-only-block', label: '신탁업 단독', summary: '다른 허용 업종 없이 신탁업만 등록한 경우 지식산업센터 입주가 불가합니다.' },
]

export const SPECIAL_APPLICANT_LABELS: Record<ApplicantType, string> = {
  company: '일반 기업',
  universityLab: '대학·대학부설연구소',
  publicInstitution: '공공기관',
  publicRelatedOrg: '공직유관단체',
  ventureClusterTenant: '벤처기업집적시설 입주자',
  startupIncubator: '창업보육센터 운영 주체',
  softwarePromotionFacility: '소프트웨어진흥시설 운영 주체',
}

export function normalizeKsicCode(value: string) {
  return value.replace(/[^0-9]/g, '')
}

export function matchIndustryRule(rules: IndustryRule[], normalizedCode: string) {
  if (!normalizedCode) {
    return null
  }

  let matched: { rule: IndustryRule; prefixLength: number } | null = null

  for (const rule of rules) {
    for (const prefix of rule.prefixes) {
      if (normalizedCode.startsWith(prefix)) {
        if (!matched || prefix.length > matched.prefixLength) {
          matched = { rule, prefixLength: prefix.length }
        }
      }
    }
  }

  return matched?.rule ?? null
}
