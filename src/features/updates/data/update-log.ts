import {
  getLegalLibraryEntryById,
  type SourceReference,
} from '@/features/library/data/legal-library'

export interface UpdateLogEntry {
  id: string
  date: string
  title: string
  summary: string
  highlights: string[]
  affectedAreas: string[]
  sourceReferences: SourceReference[]
}

const decreeSource = getLegalLibraryEntryById('decree')?.officialSource
const magokPlanSource = getLegalLibraryEntryById('magok-plan')?.officialSource

const affiliatePolicySources: SourceReference[] = [
  {
    title: 'Google 게시자 정책: 콘텐츠가 없는 화면의 광고',
    url: 'https://support.google.com/publisherpolicies/answer/11112688',
    authority: 'Google Publisher Policies',
    description:
      '콘텐츠가 거의 없거나 완료/전환/에러 상태인 화면에서 광고를 어떻게 다뤄야 하는지 설명하는 정책 문서입니다.',
  },
  {
    title: 'AdSense 프로그램 정책',
    url: 'https://support.google.com/adsense/answer/48182?utm_source=crs&utm_medium=email&utm_campaign=notification',
    authority: 'Google AdSense Help',
    description:
      '광고 배치, 클릭 유도 금지, 저품질 페이지 제한 등 전체 운영 기준을 정리한 정책 문서입니다.',
  },
]

const contentQualityPolicySources: SourceReference[] = [
  {
    title: 'AdSense 페이지 준비 가이드',
    url: 'https://support.google.com/adsense/answer/7299563?hl=ko',
    authority: 'Google AdSense Help',
    description:
      '고유 콘텐츠, 쉬운 탐색, 좋은 사용자 경험을 갖춘 페이지인지 점검하는 AdSense 공식 안내입니다.',
  },
  {
    title: 'AdSense 계정 미승인 사유와 해결 방법',
    url: 'https://support.google.com/adsense/answer/81904?hl=ko',
    authority: 'Google AdSense Help',
    description:
      '불충분한 콘텐츠, 콘텐츠 품질 문제, 사이트 탐색 문제를 수정한 뒤 재검토를 요청하는 흐름을 설명합니다.',
  },
  {
    title: '유용하고 신뢰할 수 있는 사용자 우선 콘텐츠',
    url: 'https://developers.google.com/search/docs/fundamentals/creating-helpful-content?hl=ko',
    authority: 'Google Search Central',
    description:
      '콘텐츠의 원본성, 신뢰성, 누가·어떻게·왜 만들었는지를 공개하는 기준을 설명합니다.',
  },
  {
    title: 'Google 검색 스팸 정책',
    url: 'https://developers.google.com/search/docs/essentials/spam-policies?hl=ko',
    authority: 'Google Search Central',
    description:
      '대량 자동 생성, 얇은 제휴, 스크래핑처럼 낮은 가치로 판단될 수 있는 공개 콘텐츠 위험을 정리합니다.',
  },
]

export const UPDATE_LOG_ENTRIES: UpdateLogEntry[] = [
  {
    id: 'adsense-content-review-20260424',
    date: '2026-04-24',
    title: 'AdSense 콘텐츠 품질 재검토 준비 보강',
    summary:
      '가치가 별로 없는 콘텐츠 지적에 대응해 공개 신뢰 페이지, 공통 탐색, 편집 기준, 검토 방법론, 빌드 후 콘텐츠 품질 점검을 보강했습니다.',
    highlights: [
      '검토 방법론과 편집 정책 페이지를 추가해 누가, 어떻게, 왜 콘텐츠를 운영하는지 공개했습니다.',
      '대표 가이드, 법령 라이브러리, 업데이트 로그, 문의/약관/개인정보 페이지를 모든 공개 SEO 페이지에서 이동할 수 있게 공통 내비게이션을 붙였습니다.',
      '승인 전 광고보다 원본 콘텐츠와 근거 자료가 먼저 보이도록 콘텐츠 품질 점검 스크립트를 추가했습니다.',
    ],
    affectedAreas: ['공개 SEO 페이지', '신뢰 페이지', '사이트맵', 'AdSense 재검토 체크'],
    sourceReferences: contentQualityPolicySources,
  },
  {
    id: 'content-quality-trust-refresh',
    date: '2026-04-13',
    title: '콘텐츠 품질·운영 신뢰 페이지 정비',
    summary:
      '대표 가이드 설명을 보강하고, 검토 방법론·편집 정책·문의 경로를 독립 공개 페이지로 분리해 저가치 콘텐츠 리스크를 줄였습니다.',
    highlights: [
      '대표 가이드와 색인 페이지에 판단 순서, 준비 자료, 운영 정보 링크를 추가했습니다.',
      '검토 방법론과 편집 정책 페이지를 새로 공개해 어떤 원문과 원칙으로 콘텐츠를 관리하는지 설명했습니다.',
      '홈 첫 응답 HTML에도 서비스 요약, 주요 링크, 운영 신뢰 정보를 넣어 JS 렌더링 전에도 핵심 내용을 읽을 수 있게 정리했습니다.',
    ],
    affectedAreas: ['홈 초기 HTML', '대표 가이드 공개 페이지', '신뢰 페이지', '업데이트 로그'],
    sourceReferences: contentQualityPolicySources,
  },
  {
    id: 'magok-plan-2026-144-refresh',
    date: '2026-03-26',
    title: '최신 마곡 관리기본계획 고시(2026-144호) 반영',
    summary:
      '서울특별시고시 제2026-144호를 기준으로 법령 라이브러리, 결과 각주, 공개 페이지 출처 메타데이터를 최신화했습니다.',
    highlights: [
      '구 고시 제2025-593호 대신 최신 고시 제2026-144호 원문 PDF와 게시 페이지를 연결했습니다.',
      '법령 라이브러리에 입주계약 변경·임대사업 제한 근거를 추가해 사후 운영 리스크도 함께 볼 수 있게 했습니다.',
      '가이드와 업데이트 공개 페이지의 기준일을 최신 반영 시점으로 다시 맞췄습니다.',
    ],
    affectedAreas: ['법령 라이브러리', '결과 각주', '가이드/FAQ 공개 페이지', '업데이트 로그'],
    sourceReferences: [magokPlanSource].filter(
      (source): source is SourceReference => Boolean(source),
    ),
  },
  {
    id: 'legal-library-and-update-log',
    date: '2026-03-20',
    title: '법령 라이브러리와 업데이트 로그 1차 공개',
    summary:
      '시행령과 마곡 고시문을 문서 단위로 다시 읽을 수 있는 라이브러리 화면과, 반영 이력을 한눈에 보는 업데이트 로그 화면을 추가했습니다.',
    highlights: [
      '법적 근거를 문서별로 묶어 읽을 수 있게 정리했습니다.',
      '최근 변경 이력과 반영 범위를 홈에서 바로 확인할 수 있게 연결했습니다.',
      '신뢰 자료를 홈 보조 정보가 아닌 독립 화면으로 분리했습니다.',
    ],
    affectedAreas: ['홈 신뢰 섹션', '법령 라이브러리', '업데이트 로그'],
    sourceReferences: [decreeSource, magokPlanSource].filter(
      (source): source is SourceReference => Boolean(source),
    ),
  },
  {
    id: 'layout-simulator-v1',
    date: '2026-03-20',
    title: '레이아웃 시뮬레이션 1차 추가',
    summary:
      '총 면적, 기업 규모, 연구개발 인력, 제조시설 계획 여부를 바탕으로 연구시설 최소 면적과 제조시설 상한을 계산하는 사전 시뮬레이터를 추가했습니다.',
    highlights: [
      '대기업 50%, 중소기업 40% 연구시설 기준을 보수적으로 반영했습니다.',
      '제조시설 20% 상한과 일반 활용 가능 면적을 함께 계산합니다.',
      '영업 상담 단계에서 숫자로 설명할 수 있는 화면을 만들었습니다.',
    ],
    affectedAreas: ['결과 패널', '입력 폼', '계산 유틸'],
    sourceReferences: [magokPlanSource].filter(
      (source): source is SourceReference => Boolean(source),
    ),
  },
  {
    id: 'result-panel-v1',
    date: '2026-03-20',
    title: '결과 패널 1차 고도화',
    summary:
      '단순 verdict 중심 결과를 실무 해설형 결과 문서로 확장해 전문가 인사이트, 융복합 심의 경로, 법적 근거 각주를 추가했습니다.',
    highlights: [
      '융복합 심의 경로 안내 카드를 새로 추가했습니다.',
      '법적 근거를 문서명, 조문, 페이지 힌트와 함께 보여주도록 바꿨습니다.',
      '실무에서 복사해 설명하기 쉬운 각주 구조를 만들었습니다.',
    ],
    affectedAreas: ['결과 패널', '법적 근거 데이터', '테스트'],
    sourceReferences: [decreeSource, magokPlanSource].filter(
      (source): source is SourceReference => Boolean(source),
    ),
  },
  {
    id: 'affiliate-reduction',
    date: '2026-03-20',
    title: '제휴 섹션 노출 강도 축소',
    summary:
      '제휴 영역을 기본 접힘형 참고 패널로 바꾸고, 첫 화면에서는 정보가 먼저 보이도록 노출 강도를 낮췄습니다.',
    highlights: [
      '사이드 배너를 제거했습니다.',
      '초기 상태에서는 제휴 위젯이 보이지 않도록 바꿨습니다.',
      '중립적 문구와 낮은 강도의 CTA로 조정했습니다.',
    ],
    affectedAreas: ['홈 제휴 섹션', 'CTA 카피', '초기 화면 정보 위계'],
    sourceReferences: affiliatePolicySources,
  },
]

export function getRecentUpdateLogEntries(limit = 3) {
  return UPDATE_LOG_ENTRIES.slice(0, limit)
}
