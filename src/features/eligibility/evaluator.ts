import { legalBasesFromIds } from '@/features/eligibility/data/legal-bases'
import {
  getKnowledgeCenterCodeOnlyUncertainMatch,
  getKnowledgeCenterExactCodeMatch,
} from '@/features/eligibility/data/knowledge-center-exact-codes'
import {
  KNOWLEDGE_CENTER_EXTRA_RULES,
  MAGOK_INDUSTRIAL_RULES,
  SPECIAL_APPLICANT_LABELS,
  matchIndustryRule,
  normalizeKsicCode,
} from '@/features/eligibility/data/rules'
import type {
  ApplicantType,
  ComparableZoneType,
  EligibilityComparisonResults,
  EligibilityInput,
  EligibilityResult,
  RegulatoryFit,
} from '@/features/eligibility/types'

function unique(values: string[]) {
  return [...new Set(values)]
}

function buildResult(
  result: Omit<EligibilityResult, 'legalBases'> & { legalBasisIds: string[] },
): EligibilityResult {
  return {
    ...result,
    matchedRules: unique(result.matchedRules),
    reasons: unique(result.reasons),
    requiredActions: unique(result.requiredActions),
    legalBases: legalBasesFromIds(unique(result.legalBasisIds)),
  }
}

function getManualFitLabel(regulatoryFit: RegulatoryFit) {
  if (regulatoryFit === 'knowledgeIndustry') {
    return '지식산업'
  }

  if (regulatoryFit === 'informationIndustry') {
    return '정보통신산업'
  }

  if (regulatoryFit === 'otherPermittedIndustry') {
    return '기타 시행령 허용업종'
  }

  if (regulatoryFit === 'higherEducationResearchInstitute') {
    return '고등교육법 제25조 연구소의 연구개발업'
  }

  if (regulatoryFit === 'basicResearchInstitution') {
    return '기초연구법 제14조 기관·단체의 연구개발업'
  }

  if (regulatoryFit === 'elearningIndustry') {
    return '이러닝법상 업'
  }

  if (regulatoryFit === 'managedTechnicalService') {
    return '관리기관 인정 기타 전문·과학·기술 서비스업'
  }

  return null
}

function isManualResearchInstitution(regulatoryFit: RegulatoryFit) {
  return (
    regulatoryFit === 'higherEducationResearchInstitute' ||
    regulatoryFit === 'basicResearchInstitution'
  )
}

function isManualElearningIndustry(regulatoryFit: RegulatoryFit) {
  return regulatoryFit === 'elearningIndustry'
}

function isManualManagedTechnicalService(regulatoryFit: RegulatoryFit) {
  return regulatoryFit === 'managedTechnicalService'
}

function isSpecialOperator(applicantType: ApplicantType) {
  return (
    applicantType === 'ventureClusterTenant' ||
    applicantType === 'startupIncubator' ||
    applicantType === 'softwarePromotionFacility'
  )
}

function isPublicBody(applicantType: ApplicantType) {
  return applicantType === 'publicInstitution' || applicantType === 'publicRelatedOrg'
}

function formatExactCodeLabel(code: string, name: string) {
  return `${name}(${code})`
}

function buildComparisonInput(
  input: EligibilityInput,
  zoneType: ComparableZoneType,
): EligibilityInput {
  return {
    ...input,
    zoneType,
  }
}

export function evaluateEligibility(input: EligibilityInput): EligibilityResult {
  const normalizedCode = normalizeKsicCode(input.ksicCode)
  const knowledgeCenterExactMatch = getKnowledgeCenterExactCodeMatch(normalizedCode)
  const knowledgeCenterCodeOnlyUncertain = getKnowledgeCenterCodeOnlyUncertainMatch(
    normalizedCode,
  )
  const industrialRule = matchIndustryRule(MAGOK_INDUSTRIAL_RULES, normalizedCode)
  const knowledgeExtraRule = matchIndustryRule(
    KNOWLEDGE_CENTER_EXTRA_RULES,
    normalizedCode,
  )
  const manualFitLabel = getManualFitLabel(input.regulatoryFit)
  const hasManualResearchInstitution = isManualResearchInstitution(input.regulatoryFit)
  const hasManualElearningIndustry = isManualElearningIndustry(input.regulatoryFit)
  const hasManualManagedTechnicalService = isManualManagedTechnicalService(
    input.regulatoryFit,
  )
  const hasSpecialOperator = isSpecialOperator(input.applicantType)
  const hasPublicBody = isPublicBody(input.applicantType)
  const hasUniversityLab = input.applicantType === 'universityLab'
  const companyOrInstitutionName =
    input.companyName.trim() || SPECIAL_APPLICANT_LABELS[input.applicantType]

  const commonActions = [
    '실제 입주계약 전에는 서울경제진흥원 또는 SH공사 공고문 기준과 사업계획서를 함께 확인하세요.',
    '호실·필지 위치에 따라 세부 배치 가능 여부가 달라질 수 있으니 최종 계약 전 관리기관 확인이 필요합니다.',
  ]

  if (input.zoneType === 'supportFacility') {
    return buildResult({
      verdict: 'insufficient',
      title: '지원시설구역은 현재 자동판정 범위 밖입니다.',
      summary:
        '지원시설구역은 마곡 지구단위계획 시행지침의 허용용도를 따라야 해서, 이번 MVP에서는 수동 검토가 필요합니다.',
      matchedRules: ['지원시설구역 수동 검토'],
      reasons: [
        '제공된 자료만으로는 지원시설구역 허용 업종을 정확히 코드 매칭하기 어렵습니다.',
      ],
      requiredActions: [
        '마곡 지구단위계획 시행지침의 지원시설용지 허용용도를 확보해 주세요.',
        ...commonActions,
      ],
      legalBasisIds: ['magokSupportPending', 'decreeSupport'],
    })
  }

  if (
    !normalizedCode &&
    !manualFitLabel &&
    !hasSpecialOperator &&
    !hasPublicBody &&
    !hasUniversityLab
  ) {
    return buildResult({
      verdict: 'insufficient',
      title: '업종 코드 또는 예외 자격 정보가 더 필요합니다.',
      summary:
        '일반 기업 자동판정은 KSIC 코드가 있어야 정확하게 매칭할 수 있습니다.',
      matchedRules: ['입력 보완 필요'],
      reasons: [
        '현재 입력값만으로는 관리기본계획 또는 시행령 허용 업종과 자동 매칭할 수 없습니다.',
      ],
      requiredActions: [
        'KSIC 세분류 코드를 입력해 주세요. 예: 272, 62, 68112',
        '코드를 모르면 업종명과 함께 법령상 업종 분류를 선택해 주세요.',
      ],
      legalBasisIds: ['decreeEligibility'],
    })
  }

  if (input.zoneType === 'knowledgeIndustryCenter' && input.flags.isPackagingAndFilling) {
    return buildResult({
      verdict: 'ineligible',
      title: '지식산업센터 입주는 어렵습니다.',
      summary: '포장 및 충전업은 마곡 지식산업센터 예외 허용 범위에서 제외됩니다.',
      matchedRules: ['포장 및 충전업 제외'],
      reasons: [
        `${companyOrInstitutionName}의 입력 조건에 포장 및 충전업이 포함되어 있습니다.`,
      ],
      requiredActions: [
        '지식산업센터가 아니라 산업시설구역 또는 다른 입지 대안을 검토해 주세요.',
        ...commonActions,
      ],
      legalBasisIds: ['magokKnowledgeCenterExceptions'],
    })
  }

  if (input.zoneType === 'knowledgeIndustryCenter' && input.flags.isResourceStockpile) {
    return buildResult({
      verdict: 'ineligible',
      title: '지식산업센터 입주는 어렵습니다.',
      summary: '자원비축시설은 마곡 지식산업센터 예외 허용 범위에서 제외됩니다.',
      matchedRules: ['자원비축시설 제외'],
      reasons: [
        '입력 조건에 자원비축시설이 포함되어 있어 관리기본계획상 제한됩니다.',
      ],
      requiredActions: [...commonActions],
      legalBasisIds: ['magokKnowledgeCenterExceptions'],
    })
  }

  if (input.zoneType === 'knowledgeIndustryCenter' && input.flags.isRealEstateOnly) {
    return buildResult({
      verdict: 'ineligible',
      title: '지식산업센터 입주는 어렵습니다.',
      summary:
        '다른 허용 업종 없이 부동산임대·공급업만 단독 등록한 경우는 입주가 제한됩니다.',
      matchedRules: ['부동산임대·공급업 단독 제한'],
      reasons: ['부동산임대 또는 공급업 단독 등록 여부를 사용자가 직접 표시했습니다.'],
      requiredActions: [
        '실제 영위 업종 중 연구개발·IT 등 다른 허용 업종이 있는지 확인해 주세요.',
        ...commonActions,
      ],
      legalBasisIds: ['magokKnowledgeCenterExceptions'],
    })
  }

  if (input.zoneType === 'knowledgeIndustryCenter' && input.flags.isTrustOnly) {
    return buildResult({
      verdict: 'ineligible',
      title: '지식산업센터 입주는 어렵습니다.',
      summary: '다른 허용 업종 없이 신탁업만 단독 등록한 경우는 입주가 제한됩니다.',
      matchedRules: ['신탁업 단독 제한'],
      reasons: ['신탁업 단독 등록 여부를 사용자가 직접 표시했습니다.'],
      requiredActions: [
        '신탁업 외에 실제 영위하는 허용 업종이 있는지 다시 확인해 주세요.',
        ...commonActions,
      ],
      legalBasisIds: ['magokKnowledgeCenterExceptions'],
    })
  }

  if (
    input.zoneType === 'knowledgeIndustryCenter' &&
    knowledgeCenterExactMatch?.kind === 'blocked'
  ) {
    const blockedLabel = formatExactCodeLabel(
      knowledgeCenterExactMatch.entry.code,
      knowledgeCenterExactMatch.entry.name,
    )

    return buildResult({
      verdict: 'ineligible',
      title: '지식산업센터 입주는 어렵습니다.',
      summary: `${blockedLabel}은 마곡 지식산업센터 5자리 코드 기준에서 제한 업종입니다.`,
      matchedRules: [blockedLabel, '지식산업센터 불가 코드'],
      reasons: [knowledgeCenterExactMatch.entry.note],
      requiredActions: [
        '지식산업센터가 아니라 산업시설구역 또는 다른 입지 대안을 검토해 주세요.',
        ...commonActions,
      ],
      legalBasisIds: ['magokKnowledgeCenterExceptions', 'decreeOtherIndustry'],
    })
  }

  if (
    input.zoneType === 'knowledgeIndustryCenter' &&
    (input.flags.isHosting63112 ||
      knowledgeCenterExactMatch?.kind === 'reviewRequired')
  ) {
    const reviewLabel =
      knowledgeCenterExactMatch?.kind === 'reviewRequired'
        ? formatExactCodeLabel(
            knowledgeCenterExactMatch.entry.code,
            knowledgeCenterExactMatch.entry.name,
          )
        : '호스팅 및 관련 서비스업(63112)'

    return buildResult({
      verdict: 'reviewRequired',
      title: '정책심의위원회 심의가 필요합니다.',
      summary:
        `${reviewLabel}은 마곡 지식산업센터에서 예외 허용 여부를 위원회가 판단하도록 안내하고 있습니다.`,
      matchedRules: [reviewLabel],
      reasons: [
        knowledgeCenterExactMatch?.kind === 'reviewRequired'
          ? knowledgeCenterExactMatch.entry.note
          : '관리기본계획이 호스팅 및 관련 서비스업(63112)에 대해 별도 심의 필요를 명시합니다.',
      ],
      requiredActions: [
        '사업모델과 서버 운영 방식, 실제 사용면적 계획을 1장 요약으로 준비해 주세요.',
        '위원회 심의용으로 연구개발 또는 서비스 연계성을 설명하는 자료가 필요합니다.',
        ...commonActions,
      ],
      legalBasisIds: ['magokKnowledgeCenterExtra', 'magokConvergenceReview'],
    })
  }

  if (input.zoneType === 'knowledgeIndustryCenter' && hasManualResearchInstitution) {
    return buildResult({
      verdict: 'conditional',
      title: '지식산업센터 조건부 검토 대상입니다.',
      summary:
        `${manualFitLabel}은 KSIC 코드만으로 확정할 수 없고, 기관 설치 근거와 실제 연구개발 수행 계획을 함께 검토해야 합니다.`,
      matchedRules: [manualFitLabel ?? '연구기관 요건 검토'],
      reasons: [
        input.regulatoryFit === 'higherEducationResearchInstitute'
          ? '고등교육법 제25조 연구소에 해당한다면 연구소 설치 근거와 실제 연구개발 수행 여부를 함께 확인해야 합니다.'
          : '기초연구법 제14조 기관·단체에 해당한다면 기관 설립 근거와 실제 연구개발 수행 여부를 함께 확인해야 합니다.',
      ],
      requiredActions: [
        '연구소 또는 기관·단체 설치 근거 문서와 실제 연구개발 수행 계획을 준비해 주세요.',
        '대학이 포함되면 산학융합지구 입주, 연면적 2만㎡ 이하, 연구시설 50% 이상 등 추가 요건도 함께 확인해 주세요.',
        ...commonActions,
      ],
      legalBasisIds: ['magokKnowledgeCenterExtra', 'decreeKnowledgeIndustry'],
    })
  }

  if (input.zoneType === 'knowledgeIndustryCenter' && hasManualElearningIndustry) {
    return buildResult({
      verdict: 'conditional',
      title: '이러닝업 조건을 추가 확인해야 합니다.',
      summary:
        '이러닝업은 직접 대응 KSIC 코드만으로 판정하지 않고, 제7호·제10호 또는 시행령 제6조제3항 산업을 경영하는 입주기업체가 운영하는지까지 확인해야 합니다.',
      matchedRules: [manualFitLabel ?? '이러닝업'],
      reasons: [
        '이러닝법상 업은 운영 주체와 기존 입주기업체 업종의 연결성을 함께 확인해야 하는 조건부 항목입니다.',
      ],
      requiredActions: [
        '현재 영위 중인 출판업, 교육서비스업 또는 정보통신산업과의 연결성을 설명하는 자료를 준비해 주세요.',
        '강의 콘텐츠 제작 방식, 플랫폼 운영 구조, 실제 사용면적 계획을 함께 정리해 주세요.',
        ...commonActions,
      ],
      legalBasisIds: [
        'magokKnowledgeCenterExtra',
        'decreeKnowledgeIndustry',
        'decreeInformationIndustry',
      ],
    })
  }

  if (
    input.zoneType === 'knowledgeIndustryCenter' &&
    hasManualManagedTechnicalService
  ) {
    return buildResult({
      verdict: 'insufficient',
      title: '관리기관 인정 여부를 먼저 확인해야 합니다.',
      summary:
        '관리기관 인정 기타 전문·과학·기술 서비스업은 관리기관 인정과 홈페이지 게시 여부를 확인해야 해서 자동 확정이 어렵습니다.',
      matchedRules: [manualFitLabel ?? '관리기관 인정 업종'],
      reasons: [
        '시행령 제6조제2항제27호 업종은 일반 KSIC 코드만으로 자동 허용 여부를 확정할 수 없습니다.',
      ],
      requiredActions: [
        '관리기관 홈페이지에 해당 업종이 인정 산업으로 게시되어 있는지 먼저 확인해 주세요.',
        '필요하면 사전 질의나 위원회 검토 대상으로 문의하는 편이 안전합니다.',
        ...commonActions,
      ],
      legalBasisIds: [
        'magokKnowledgeCenterExtra',
        'decreeKnowledgeIndustry',
        'decreeDiscretion',
      ],
    })
  }

  if (
    input.zoneType === 'knowledgeIndustryCenter' &&
    knowledgeCenterExactMatch?.kind === 'additionalCheck'
  ) {
    const additionalLabel = formatExactCodeLabel(
      knowledgeCenterExactMatch.entry.code,
      knowledgeCenterExactMatch.entry.name,
    )

    return buildResult({
      verdict: 'insufficient',
      title: '추가 확인이 필요합니다.',
      summary:
        `${additionalLabel}은 코드만으로 지식산업센터 입주 가능 여부를 자동 확정하기 어렵습니다.`,
      matchedRules: [additionalLabel, '추가 확인 코드'],
      reasons: [knowledgeCenterExactMatch.entry.note],
      requiredActions: [
        '실제 영위 업무, 인허가 형태, 산업단지 입주 목적과의 연결성을 확인할 자료를 준비해 주세요.',
        '필요하면 관리기관 또는 위원회 사전 검토 대상으로 문의하는 편이 안전합니다.',
        ...commonActions,
      ],
      legalBasisIds: ['magokKnowledgeCenterExtra', 'decreeOtherIndustry'],
    })
  }

  if (
    input.zoneType === 'knowledgeIndustryCenter' &&
    knowledgeCenterCodeOnlyUncertain
  ) {
    const manualBasisIds =
      input.regulatoryFit === 'informationIndustry'
        ? ['decreeInformationIndustry']
        : input.regulatoryFit === 'otherPermittedIndustry'
          ? ['decreeOtherIndustry']
          : ['decreeKnowledgeIndustry']

    if (manualFitLabel) {
      return buildResult({
        verdict: 'conditional',
        title: '코드만으로는 확정하기 어렵지만 조건부 검토 대상입니다.',
        summary:
          `${knowledgeCenterCodeOnlyUncertain.label}은 코드만으로 자동 확정하기 어렵지만, 사용자가 ${manualFitLabel} 분류를 선택한 만큼 해당 조문 요건을 함께 검토해야 합니다.`,
        matchedRules: [
          knowledgeCenterCodeOnlyUncertain.label,
          '코드만으로 확정 불가',
          manualFitLabel,
        ],
        reasons: [
          knowledgeCenterCodeOnlyUncertain.note,
          `사용자가 법령상 ${manualFitLabel} 분류를 직접 선택했습니다.`,
        ],
        requiredActions: [
          '운영 형태와 실제 교육·연구·지원 기능이 해당 조문 요건에 맞는지 설명자료를 준비해 주세요.',
          '코드 분류와 함께 실제 프로그램 또는 서비스 운영 방식을 확인해 주세요.',
          ...commonActions,
        ],
        legalBasisIds: ['magokKnowledgeCenterExtra', ...manualBasisIds],
      })
    }

    return buildResult({
      verdict: 'insufficient',
      title: '코드만으로는 바로 확정하기 어렵습니다.',
      summary:
        `${knowledgeCenterCodeOnlyUncertain.label}은 기관 성격과 운영 형태를 함께 확인해야 지식산업센터 판정이 가능합니다.`,
      matchedRules: [knowledgeCenterCodeOnlyUncertain.label, '코드만으로 확정 불가'],
      reasons: [knowledgeCenterCodeOnlyUncertain.note],
      requiredActions: [
        '교육기관, 연구시설, 지원시설 중 어느 요건에 해당하는지 설명자료를 준비해 주세요.',
        '법령상 허용업종 분류를 수동으로 선택했다면 해당 근거도 함께 확인해 주세요.',
        ...commonActions,
      ],
      legalBasisIds: ['magokKnowledgeCenterExtra', 'decreeKnowledgeIndustry'],
    })
  }

  if (input.zoneType === 'industrialFacility') {
    if (hasUniversityLab) {
      return buildResult({
        verdict: 'reviewRequired',
        title: '정책심의위원회 심의가 필요합니다.',
        summary:
          '대학 및 대학부설연구소는 마곡 관리기본계획상 위원회 심의·의결을 거쳐 입주 가능합니다.',
        matchedRules: [
          '대학·대학부설연구소',
          industrialRule?.label ?? '연구개발 기관 검토',
        ],
        reasons: [
          industrialRule
            ? `입력한 업종은 ${industrialRule.group} 계열 허용 업종과 가깝습니다.`
            : '업종 코드는 별도 검토가 필요하지만, 대학 계열 기관은 예외 심의 트랙이 있습니다.',
        ],
        requiredActions: [
          '대학 또는 대학부설연구소 증빙과 연구시설 구성 계획을 준비해 주세요.',
          ...commonActions,
        ],
        legalBasisIds: ['magokUniversityReview', 'decreeEligibility'],
      })
    }

    if (hasPublicBody && (industrialRule || manualFitLabel)) {
      return buildResult({
        verdict: 'reviewRequired',
        title: '정책심의위원회 승인 대상입니다.',
        summary:
          '공공기관·공직유관단체는 시행령 제6조상 입주자격 업종을 영위하면서 위원회 승인을 받아야 합니다.',
        matchedRules: [
          SPECIAL_APPLICANT_LABELS[input.applicantType],
          industrialRule?.label ?? manualFitLabel ?? '예외 업종 검토',
        ],
        reasons: [
          industrialRule
            ? `입력 업종이 ${industrialRule.group} 계열 허용 업종과 일치합니다.`
            : `사용자가 법령상 ${manualFitLabel}에 해당한다고 표시했습니다.`,
        ],
        requiredActions: [
          '기관 설립 근거와 실제 수행 사업이 산업단지 입주목적과 연결된다는 설명 자료를 준비해 주세요.',
          ...commonActions,
        ],
        legalBasisIds: ['magokPublicInstitution', 'decreeEligibility'],
      })
    }

    if (industrialRule) {
      if (input.flags.requiresCommitteeReview) {
        return buildResult({
          verdict: 'reviewRequired',
          title: '입주 가능성이 있지만 심의가 권장됩니다.',
          summary:
            '기본 허용 업종과 매칭되지만, 융·복합 또는 특이 사업모델로 표시되어 위원회 검토가 적절합니다.',
          matchedRules: [industrialRule.label, '융·복합 업종 검토'],
          reasons: [
            `${normalizedCode} 코드는 ${industrialRule.label} 규칙과 매칭됩니다.`,
            '사용자가 융·복합 또는 경계 업종 검토가 필요하다고 표시했습니다.',
          ],
          requiredActions: [
            '기본 업종과 연계되는 연구개발 또는 사업화 구조를 사업계획서에 명확히 적어 주세요.',
            ...commonActions,
          ],
          legalBasisIds: ['magokIndustrialPlan', 'magokConvergenceReview'],
        })
      }

      if (input.flags.hasManufacturingFacility) {
        return buildResult({
          verdict: 'conditional',
          title: '입주 가능하나 제조시설 조건을 함께 충족해야 합니다.',
          summary:
            '마곡은 연구개발 중심 단지이므로 제조시설 운영 시 연구시설 비율 유지와 제조시설 비율 제한을 함께 충족해야 합니다.',
          matchedRules: [industrialRule.label, '제조시설 운영 예정'],
          reasons: [
            `${normalizedCode} 코드는 ${industrialRule.group} 계열 허용 업종과 매칭됩니다.`,
            '제조시설 또는 사업화시설 운영 예정으로 표시되어 추가 조건 검토가 필요합니다.',
          ],
          requiredActions: [
            '연구시설 비율을 유지하고 제조시설 비율은 20% 이하로 설계해 주세요.',
            '연구개발과 생산 간 연계성을 사업계획서와 배치도에서 설명해 주세요.',
            ...commonActions,
          ],
          legalBasisIds: ['magokIndustrialPlan', 'magokManufacturingCondition'],
        })
      }

      return buildResult({
        verdict: 'eligible',
        title: '산업시설구역 예비판정상 입주 가능성이 높습니다.',
        summary:
          `입력한 업종은 마곡 관리기본계획의 ${industrialRule.group} 계열 허용 업종과 일치합니다.`,
        matchedRules: [industrialRule.label],
        reasons: [
          `${normalizedCode} 코드는 ${industrialRule.label} 규칙과 자동 매칭되었습니다.`,
          input.address.trim()
            ? `입력 주소는 ${input.address.trim()}입니다. 실제 필지 또는 호실 검토는 별도 필요합니다.`
            : '주소는 비어 있지만 업종과 구역 기준 예비판정은 가능합니다.',
        ],
        requiredActions: [
          '입주신청 단계에서는 연구인력 계획과 연구시설 구성안을 함께 준비해 주세요.',
          ...commonActions,
        ],
        legalBasisIds: ['magokIndustrialPlan', 'decreeEligibility'],
      })
    }

    if (hasSpecialOperator) {
      return buildResult({
        verdict: 'conditional',
        title: '예외 시설 운영 주체로서 검토 가능합니다.',
        summary:
          '창업보육센터, 소프트웨어진흥시설, 벤처기업집적시설 계열은 관리기본계획상 예외 시설로 검토할 수 있습니다.',
        matchedRules: [SPECIAL_APPLICANT_LABELS[input.applicantType]],
        reasons: [
          `${SPECIAL_APPLICANT_LABELS[input.applicantType]}는 산업시설구역 예외 시설로 검토 가능합니다.`,
        ],
        requiredActions: [
          '해당 시설 지정 또는 운영 근거 서류를 준비해 주세요.',
          ...commonActions,
        ],
        legalBasisIds: ['magokIndustrialPlan', 'decreeOtherIndustry'],
      })
    }

    if (input.flags.requiresCommitteeReview) {
      return buildResult({
        verdict: 'reviewRequired',
        title: '기본 업종표에는 없지만 위원회 심의 대상이 될 수 있습니다.',
        summary:
          '관리기본계획은 융·복합 필요성이 인정되는 업종에 대해 위원회 심의를 통한 입주 가능성을 열어두고 있습니다.',
        matchedRules: ['융·복합 업종 검토'],
        reasons: [
          '입력 업종이 기본 허용 코드에는 직접 매칭되지 않았습니다.',
          '사용자가 융·복합 또는 예외 심의가 필요한 사업이라고 표시했습니다.',
        ],
        requiredActions: [
          '기존 허용 업종과의 연계성, 연구개발 목적, 지역 산업효과를 짧게 정리해 주세요.',
          ...commonActions,
        ],
        legalBasisIds: ['magokConvergenceReview', 'decreeDiscretion'],
      })
    }

    return buildResult({
      verdict: 'ineligible',
      title: '산업시설구역 기준으로는 입주가 쉽지 않습니다.',
      summary:
        '현재 입력된 업종은 마곡 관리기본계획의 산업시설구역 허용 업종과 직접 매칭되지 않습니다.',
      matchedRules: ['산업시설구역 허용 업종 미매칭'],
      reasons: [
        normalizedCode
          ? `${normalizedCode} 코드는 현재 MVP 규칙셋의 허용 업종 목록에 포함되지 않았습니다.`
          : '업종 코드 없이 자동 매칭이 어려운 상태입니다.',
      ],
      requiredActions: [
        '실제 KSIC 세분류가 더 좁은 허용 업종으로 분류되는지 먼저 확인해 주세요.',
        '지식산업센터 또는 위원회 심의 가능성도 함께 검토해 볼 수 있습니다.',
        ...commonActions,
      ],
      legalBasisIds: ['magokIndustrialPlan', 'decreeEligibility'],
    })
  }

  const exactKnowledgeCenterAllowed =
    knowledgeCenterExactMatch?.kind === 'allowed' ||
    knowledgeCenterExactMatch?.kind === 'conditional'
  const exactKnowledgeMatchLabel =
    exactKnowledgeCenterAllowed && knowledgeCenterExactMatch
      ? formatExactCodeLabel(
          knowledgeCenterExactMatch.entry.code,
          knowledgeCenterExactMatch.entry.name,
        )
      : null
  const knowledgeMatchLabel =
    exactKnowledgeMatchLabel ??
    industrialRule?.label ??
    knowledgeExtraRule?.label ??
    manualFitLabel ??
    null
  const isKnowledgeCenterAllowed =
    exactKnowledgeCenterAllowed ||
    Boolean(industrialRule) ||
    Boolean(knowledgeExtraRule) ||
    Boolean(manualFitLabel) ||
    hasSpecialOperator

  if (hasUniversityLab) {
    return buildResult({
      verdict: 'reviewRequired',
      title: '정책심의위원회 심의가 필요합니다.',
      summary:
        '대학 및 대학부설연구소는 지식산업센터에서도 예외 심의 트랙으로 검토하는 것이 안전합니다.',
      matchedRules: ['대학·대학부설연구소', knowledgeMatchLabel ?? '연구기관 검토'],
      reasons: [
        knowledgeMatchLabel
          ? `${knowledgeMatchLabel} 근거가 있어 예외 검토 가능성이 있습니다.`
          : '지식산업센터 예외 허용 범위와의 연결성을 위원회에 설명해야 합니다.',
      ],
      requiredActions: [
        '대학 또는 연구소 설치 근거, 연구면적 계획, 연구개발 인력 계획을 함께 준비해 주세요.',
        ...commonActions,
      ],
      legalBasisIds: [
        'magokUniversityReview',
        'magokKnowledgeCenterExtra',
        'decreeKnowledgeIndustry',
      ],
    })
  }

  if (hasPublicBody && isKnowledgeCenterAllowed) {
    return buildResult({
      verdict: 'reviewRequired',
      title: '공공기관·공직유관단체 심의가 필요합니다.',
      summary:
        '지식산업센터 입주자격 업종과의 연결성은 있으나, 최종적으로는 위원회 승인 절차가 필요합니다.',
      matchedRules: [
        SPECIAL_APPLICANT_LABELS[input.applicantType],
        knowledgeMatchLabel ?? '예외 업종 검토',
      ],
      reasons: [
        knowledgeMatchLabel
          ? `입력 업종은 ${knowledgeMatchLabel}로 정리할 수 있습니다.`
          : '법령상 예외 허용 업종으로 사용자가 직접 표시했습니다.',
      ],
      requiredActions: [
        '기관 기능이 산업단지 입주기업 지원 또는 연구개발 생태계와 연결된다는 설명이 필요합니다.',
        ...commonActions,
      ],
      legalBasisIds: ['magokPublicInstitution', 'magokKnowledgeCenterExtra'],
    })
  }

  if (input.flags.requiresCommitteeReview && !isKnowledgeCenterAllowed) {
    return buildResult({
      verdict: 'reviewRequired',
      title: '기본 규칙에는 없지만 위원회 심의 후보입니다.',
      summary:
        '사용자가 융·복합 또는 예외 업종으로 표시했으므로, 지식산업센터 예외 심의 트랙 검토가 가능합니다.',
      matchedRules: ['융·복합 업종 검토'],
      reasons: [
        '직접 허용 규칙에는 매칭되지 않았지만 위원회 심의 요청 의사가 표시되었습니다.',
      ],
      requiredActions: [
        '서비스 구조와 산업단지 기여도를 위원회 설명자료 형식으로 정리해 주세요.',
        ...commonActions,
      ],
      legalBasisIds: ['magokConvergenceReview', 'decreeDiscretion'],
    })
  }

  if (isKnowledgeCenterAllowed) {
    const actions = [...commonActions]
    const legalBasisIds = ['magokKnowledgeCenterExtra', 'decreeEligibility']
    const reasons = [
      exactKnowledgeMatchLabel
        ? `${exactKnowledgeMatchLabel}은 정리된 5자리 코드표와 일치합니다.`
        : knowledgeMatchLabel
          ? `${knowledgeMatchLabel} 기준으로 지식산업센터 예외 허용 범위와 매칭됩니다.`
          : '예외 시설 운영 주체로 표시되어 지식산업센터 검토가 가능합니다.',
    ]
    const matchedRules = [knowledgeMatchLabel ?? SPECIAL_APPLICANT_LABELS[input.applicantType]]
    let verdict: EligibilityResult['verdict'] = 'eligible'
    let title = '지식산업센터 예비판정상 입주 가능성이 있습니다.'
    let summary =
      exactKnowledgeMatchLabel
        ? `${exactKnowledgeMatchLabel}은 마곡 지식산업센터 5자리 코드 기준과 일치합니다.`
        : '지식산업센터는 관리기본계획 기본 업종 외에도 시행령 제6조 제2항부터 제5항의 업종까지 확장 허용합니다.'

    if (
      exactKnowledgeCenterAllowed &&
      knowledgeCenterExactMatch?.kind === 'conditional'
    ) {
      verdict = 'conditional'
      title = '지식산업센터 조건부 허용 업종입니다.'
      summary = `${exactKnowledgeMatchLabel}은 ${knowledgeCenterExactMatch.entry.note}.`
      reasons.push(
        '다른 허용 업종과 함께 등록된 경우에만 입주 검토가 가능한 조건부 허용 코드입니다.',
      )
      actions.unshift(
        knowledgeCenterExactMatch.entry.code === '64201'
          ? '신탁업 외에 함께 등록된 허용 업종과 실제 영위 사업을 확인해 주세요.'
          : '부동산 업종 외에 함께 등록된 허용 업종과 지식산업센터 설치·운영 목적을 함께 설명해 주세요.',
      )
      legalBasisIds.push('decreeOtherIndustry')
    }

    if (manualFitLabel && !exactKnowledgeCenterAllowed) {
      verdict = 'conditional'
      title = '지식산업센터 입주 가능성이 있으나 증빙 확인이 필요합니다.'
      summary =
        `사용자가 ${manualFitLabel}에 해당한다고 표시한 만큼, 해당 분류를 증명할 업종설명 자료를 함께 준비하는 것이 안전합니다.`
      reasons.push(
        '현재 MVP는 모든 시행령 허용 업종의 세부 KSIC를 완전히 내장하지 않았으므로 수동 분류 선택을 보조 지표로 사용했습니다.',
      )
      actions.unshift(
        '해당 업종이 지식산업·정보통신산업 또는 시행령 제6조 제5항 허용업종에 해당함을 보여주는 설명자료를 준비해 주세요.',
      )
      legalBasisIds.push(
        'decreeKnowledgeIndustry',
        'decreeInformationIndustry',
        'decreeOtherIndustry',
      )
    }

    if (knowledgeExtraRule && !exactKnowledgeCenterAllowed) {
      verdict = 'conditional'
      title = '지식산업센터 특례 업종으로 검토 가능합니다.'
      summary =
        '부동산임대·공급업은 지식산업센터 설치·운영 목적일 때만 예외 허용되는 성격이 강합니다.'
      actions.unshift(
        '지식산업센터 설치·운영 목적과 실제 사업구조를 함께 설명해 주세요.',
      )
      legalBasisIds.push('decreeOtherIndustry')
    }

    if (hasSpecialOperator) {
      verdict = 'conditional'
      title = '예외 시설 운영 주체로서 검토 가능합니다.'
      summary =
        '창업보육센터, 소프트웨어진흥시설, 벤처기업집적시설 계열은 별도 지정·운영 요건 확인이 함께 필요합니다.'
      actions.unshift('관련 법령상 지정 또는 운영 근거 문서를 함께 준비해 주세요.')
      legalBasisIds.push('decreeOtherIndustry')
    }

    return buildResult({
      verdict,
      title,
      summary,
      reasons,
      requiredActions: actions,
      matchedRules,
      legalBasisIds,
    })
  }

  return buildResult({
    verdict: 'ineligible',
    title: '지식산업센터 기준으로는 입주가 쉽지 않습니다.',
    summary:
      '현재 입력된 업종은 기본 허용 업종 또는 지식산업센터 예외 허용 업종으로 명확히 매칭되지 않습니다.',
    matchedRules: ['지식산업센터 허용 업종 미매칭'],
    reasons: [
      normalizedCode
        ? `${normalizedCode} 코드는 현재 내장된 관리기본계획/시행령 규칙과 직접 매칭되지 않았습니다.`
        : '업종 코드 입력 없이 예외 허용 요건을 확인하기 어렵습니다.',
    ],
    requiredActions: [
      '세부 KSIC 코드와 실제 영위 업종을 다시 확인해 주세요.',
      '업종이 지식산업, 정보통신산업 또는 시행령 제6조 제5항 업종에 해당한다면 법령상 업종 분류를 선택해 다시 판정해 보세요.',
      ...commonActions,
    ],
    legalBasisIds: ['magokKnowledgeCenterExtra', 'decreeEligibility'],
  })
}

export function evaluateEligibilityComparison(
  input: EligibilityInput,
): EligibilityComparisonResults {
  return {
    knowledgeIndustryCenter: evaluateEligibility(
      buildComparisonInput(input, 'knowledgeIndustryCenter'),
    ),
    industrialFacility: evaluateEligibility(
      buildComparisonInput(input, 'industrialFacility'),
    ),
  }
}
