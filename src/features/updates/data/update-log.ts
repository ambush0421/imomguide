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

export const UPDATE_LOG_ENTRIES: UpdateLogEntry[] = [
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
