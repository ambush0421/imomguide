import {
  PUBLIC_GUIDE_CATALOG,
  type GuideFaqIndexEntry,
  type MagokGuideEntry,
} from '@/features/guides/data/guide-catalog'
import type {
  LegalLibraryEntryDetail,
  SourceReference,
} from '@/features/library/data/legal-library'
import type { UpdateLogEntry } from '@/features/updates/data/update-log'

const SITE_URL = 'https://loopincode.com'
const BRAND_NAME = '마곡 코드찾기'
const DEFAULT_OG_IMAGE = `${SITE_URL}/favicon.svg`

interface SeoPageDocument {
  filePath: string
  html: string
  url: string
}

interface StaticSeoPageSection {
  heading: string
  paragraphs?: string[]
  bullets?: string[]
}

interface StaticSeoPageDefinition {
  slug: string
  title: string
  description: string
  eyebrow: string
  heroTitle: string
  heroSummary: string
  ctaLabel: string
  ctaHref: string
  sections: StaticSeoPageSection[]
}

const DEFAULT_ROBOTS_CONTENT =
  'index,follow,max-snippet:-1,max-image-preview:large,max-video-preview:-1'

const PUBLIC_GUIDE_CODE_SET = new Set(PUBLIC_GUIDE_CATALOG.map((entry) => entry.code))
const TRUST_PAGE_LINKS = [
  { href: `${SITE_URL}/about/`, label: '서비스 소개' },
  { href: `${SITE_URL}/methodology/`, label: '판정 기준' },
  { href: `${SITE_URL}/editorial-policy/`, label: '편집 정책' },
  { href: `${SITE_URL}/contact/`, label: '문의' },
  { href: `${SITE_URL}/privacy/`, label: '개인정보처리방침' },
  { href: `${SITE_URL}/terms/`, label: '이용약관' },
] as const

const STATIC_SEO_PAGES: StaticSeoPageDefinition[] = [
  {
    slug: 'about',
    title: '서비스 소개',
    description:
      '마곡 코드찾기가 어떤 기준으로 업종코드 추천과 입주 예비판정을 제공하는지 소개합니다.',
    eyebrow: '서비스 소개',
    heroTitle: '마곡 코드찾기는 무엇을 하는 서비스인가요?',
    heroSummary:
      '마곡 일반산업단지 입주 상담을 준비할 때 업종코드 추천, 구역별 예비판정, 관련 법령 정리를 한 번에 볼 수 있도록 만든 실무형 안내 서비스입니다.',
    ctaLabel: '홈에서 바로 시작하기',
    ctaHref: `${SITE_URL}/#finder`,
    sections: [
      {
        heading: '무엇을 제공하나요',
        paragraphs: [
          '마곡 코드찾기는 마곡 일반산업단지 입주 상담 과정에서 가장 자주 막히는 세 가지 질문, 즉 어떤 업종코드를 먼저 봐야 하는지, 지식산업센터와 산업시설구역 중 어디부터 검토해야 하는지, 실제 근거 문서는 무엇인지에 답하도록 설계된 서비스입니다.',
          '단순히 코드 이름만 보여주는 사전이 아니라, 상담 과정에서 그대로 설명할 수 있도록 추천 이유, 구역별 판단 차이, 원문 문서 위치, 최근 업데이트 이력을 함께 제공합니다.',
        ],
        bullets: [
          '사업 설명을 바탕으로 먼저 볼 업종코드를 추천합니다.',
          '지식산업센터와 산업시설구역 기준을 나눠 예비판정을 정리합니다.',
          '관련 법령, 업데이트 로그, 대표 업종 가이드를 함께 제공합니다.',
        ],
      },
      {
        heading: '왜 이 사이트가 필요한가요',
        paragraphs: [
          '마곡 입주 검토는 코드표만으로 끝나지 않고, 실제 영위 업무와 구역별 허용 기준을 함께 읽어야 하는 경우가 많습니다. 같은 업종처럼 보여도 설명 방식이나 입주 목적에 따라 먼저 확인해야 할 구역과 준비 서류가 달라집니다.',
          '이 서비스는 그 차이를 실무 언어로 풀어 적어, 중개사·운영 담당자·사업 준비자가 상담 초반에 방향을 잘못 잡지 않도록 돕는 데 초점을 둡니다.',
        ],
      },
      {
        heading: '콘텐츠 운영 원칙',
        bullets: [
          '서울특별시 고시와 산업집적법 시행령을 기준으로 공개 설명을 갱신합니다.',
          '검색엔진에 공개하는 페이지는 대표 업종과 핵심 문서만 남기고 주기적으로 정리합니다.',
          '실무에서 바로 확인할 수 있는 체크포인트와 다음 행동을 함께 안내합니다.',
          '원문을 그대로 복제하지 않고, 상담 흐름에 맞는 해설과 비교 포인트를 덧붙입니다.',
        ],
      },
      {
        heading: '이런 분께 적합합니다',
        paragraphs: [
          '마곡 입주 상담을 준비하는 컨설턴트, 중개사, 운영 담당자가 빠르게 기준을 확인할 때 적합합니다.',
          '최종 법률 판단이나 행정 확정은 관할 기관 안내와 제출 서류 검토를 함께 거치는 것을 권장합니다.',
        ],
      },
      {
        heading: '신뢰 정보는 어디서 확인하나요',
        paragraphs: [
          '서비스 소개, 판정 기준, 편집 정책, 문의, 개인정보처리방침, 이용약관을 별도 공개 페이지로 제공해 운영 주체와 콘텐츠 관리 방식을 쉽게 확인할 수 있게 했습니다.',
          '최근에 어떤 기준이 바뀌었는지는 업데이트 로그에서, 실제 원문 출처는 법령 라이브러리에서 다시 확인할 수 있습니다.',
        ],
      },
    ],
  },
  {
    slug: 'contact',
    title: '문의',
    description:
      '마곡 코드찾기 서비스 문의 방법과 버그 제보, 콘텐츠 수정 요청 방법을 안내합니다.',
    eyebrow: '문의',
    heroTitle: '문의와 수정 요청은 여기로 보내 주세요',
    heroSummary:
      '서비스 사용 중 오류를 발견했거나 콘텐츠 수정이 필요하면 이메일로 알려 주세요. 확인 후 순서대로 답변합니다.',
    ctaLabel: '이메일 보내기',
    ctaHref: 'mailto:contact.loopinlab@gmail.com',
    sections: [
      {
        heading: '문의 채널',
        paragraphs: [
          '운영 문의와 콘텐츠 수정 요청은 현재 이메일 한 채널로 받습니다. 공개 페이지 오류, 설명 보완, 링크 깨짐, 업데이트 제안처럼 사이트 품질과 직접 관련된 요청을 우선 확인합니다.',
        ],
        bullets: [
          '이메일: contact.loopinlab@gmail.com',
          '오류 제보 시 URL, 업종코드, 화면 캡처를 함께 보내 주시면 확인이 빠릅니다.',
          '법령·기준 업데이트 제안은 출처 문서명과 페이지 정보를 함께 알려 주세요.',
        ],
      },
      {
        heading: '응답 범위',
        paragraphs: [
          '서비스 동작 오류, 공개 콘텐츠 수정 요청, 운영 문의를 우선 확인합니다.',
          '개별 사건의 법률 자문이나 행정 확답은 제공하지 않으며, 필요한 경우 관할 기관 확인을 안내합니다.',
        ],
      },
      {
        heading: '수정 요청 시 함께 보내면 좋은 정보',
        bullets: [
          '문제가 발생한 페이지 주소와 확인한 날짜',
          '어떤 문장이나 판정 설명이 실제와 다르다고 느꼈는지에 대한 메모',
          '가능하면 원문 출처 URL, 고시 번호, 페이지 힌트',
        ],
      },
      {
        heading: '운영 원칙',
        paragraphs: [
          '의견이 접수되면 원문 출처와 현재 공개 설명을 대조한 뒤, 공개 업데이트 로그에 반영 가능한 항목을 우선 수정합니다.',
          '광고 문의보다 사용자 오류 제보와 콘텐츠 품질 개선 요청을 먼저 처리합니다.',
        ],
      },
    ],
  },
  {
    slug: 'privacy',
    title: '개인정보처리방침',
    description:
      '마곡 코드찾기에서 어떤 정보가 저장되고 어떤 분석 도구를 사용하는지 안내합니다.',
    eyebrow: '개인정보처리방침',
    heroTitle: '개인정보와 이용 정보 처리 안내',
    heroSummary:
      '마곡 코드찾기는 공개 웹 서비스로 운영되며, 사용자가 입력한 예비판정 값은 브라우저 저장소와 공유 링크 생성 기능 중심으로 처리됩니다.',
    ctaLabel: '홈으로 돌아가기',
    ctaHref: `${SITE_URL}/`,
    sections: [
      {
        heading: '수집 및 저장 정보',
        paragraphs: [
          '현재 서비스는 회원 가입이나 결제 기능 없이 공개 웹 서비스로 운영됩니다. 사용자가 입력한 내용은 예비판정 흐름을 이어가기 위한 목적에서 브라우저 로컬 저장소에만 임시 보관될 수 있습니다.',
        ],
        bullets: [
          '입력한 업종 설명과 예비판정 값은 브라우저 로컬 저장소에 임시로 저장될 수 있습니다.',
          '공유 링크를 만들면 사용자가 입력한 값 일부가 URL 해시에 포함될 수 있습니다.',
          '서버 회원 계정이나 결제 기능은 현재 운영하지 않습니다.',
        ],
      },
      {
        heading: '분석 도구',
        bullets: [
          '서비스는 Google Analytics 4를 사용해 방문 흐름과 화면 사용 패턴을 익명 통계 수준으로 확인합니다.',
          '광고 게재 준비를 위한 AdSense 계정 확인 스크립트가 포함될 수 있으나, 승인 전까지 공개 광고 노출은 비활성 상태를 기본값으로 유지합니다.',
        ],
      },
      {
        heading: '사용자 제어 방법',
        bullets: [
          '브라우저 저장소에 남은 입력값은 앱 내 초기화 기능으로 직접 삭제할 수 있습니다.',
          '공유 링크를 만들지 않으면 입력값이 외부 URL에 포함되지 않습니다.',
          '브라우저 설정에서 쿠키와 로컬 저장소를 정리하면 기기 내 임시 데이터도 함께 삭제할 수 있습니다.',
        ],
      },
      {
        heading: '문의',
        paragraphs: [
          '개인정보 처리 관련 문의는 contact.loopinlab@gmail.com으로 보내 주세요.',
        ],
      },
    ],
  },
  {
    slug: 'terms',
    title: '이용약관',
    description:
      '마곡 코드찾기 서비스 이용 조건과 책임 범위, 콘텐츠 사용 원칙을 안내합니다.',
    eyebrow: '이용약관',
    heroTitle: '서비스 이용 전 알아둘 사항',
    heroSummary:
      '마곡 코드찾기는 공개 정보와 내부 정리 기준을 바탕으로 입주 검토를 돕는 안내 서비스입니다. 최종 의사결정 전에는 반드시 원문 고시와 관할 기관 확인을 함께 권장합니다.',
    ctaLabel: '대표 가이드 보기',
    ctaHref: `${SITE_URL}/guides/`,
    sections: [
      {
        heading: '서비스 성격',
        paragraphs: [
          '마곡 코드찾기는 공개 정보와 자체 정리 기준을 바탕으로 입주 검토를 돕는 참고용 서비스입니다. 사용자는 공개 페이지와 앱에서 제공되는 요약 설명을 초기 검토 자료로 활용할 수 있지만, 최종 판단은 반드시 원문 문서와 관할 기관 확인을 함께 거쳐야 합니다.',
        ],
        bullets: [
          '본 서비스는 입주 검토를 돕는 참고용 도구입니다.',
          '최종 입주 가능 여부는 제출 서류, 사업 실질, 심의 결과에 따라 달라질 수 있습니다.',
          '법률·세무·행정 확정 답변을 대신하지 않습니다.',
        ],
      },
      {
        heading: '콘텐츠 이용',
        bullets: [
          '공개 가이드와 법령 요약은 출처 문서를 바탕으로 자체 정리한 설명입니다.',
          '외부 문서 링크와 인용은 원문 확인 편의를 위한 것이며, 원문 효력이 우선합니다.',
        ],
      },
      {
        heading: '책임 범위',
        paragraphs: [
          '서비스 이용 과정에서 발생한 개별 계약, 입주 심의, 행정 결과에 대한 최종 책임은 이용자와 관련 기관 확인 절차에 있습니다.',
          '중대한 오류 제보가 접수되면 확인 후 가능한 범위에서 수정 이력을 공개합니다.',
        ],
      },
      {
        heading: '금지되는 이용 방식',
        bullets: [
          '서비스 설명을 원문 확인 없이 법률 확정 답변으로 재판매하거나 단정적으로 안내하는 행위',
          '자동 판정 결과만으로 계약 또는 신고 절차를 완료했다고 오인하게 만드는 행위',
          '공개 콘텐츠를 출처 표기 없이 그대로 복제해 재게시하는 행위',
        ],
      },
    ],
  },
  {
    slug: 'methodology',
    title: '판정 기준',
    description:
      '마곡 코드찾기가 어떤 원문과 절차를 바탕으로 업종코드 추천과 예비판정을 만드는지 설명합니다.',
    eyebrow: '판정 기준',
    heroTitle: '업종코드 추천과 예비판정은 이렇게 만듭니다',
    heroSummary:
      '마곡 코드찾기는 원문 고시, 시행령, 코드 사전 데이터를 바탕으로 추천 후보를 좁히고, 구역별 판단 포인트를 설명형 문서로 다시 정리합니다.',
    ctaLabel: '법령 라이브러리 보기',
    ctaHref: `${SITE_URL}/library/`,
    sections: [
      {
        heading: '기본 데이터 원문',
        bullets: [
          '산업집적활성화 및 공장설립에 관한 법률 시행령',
          '마곡일반산업단지 관리기본계획 변경 고시',
          'KSIC 11차 업종 코드 텍스트와 내부 매핑 데이터',
        ],
      },
      {
        heading: '추천 코드 생성 방식',
        paragraphs: [
          '사용자가 입력한 업태·종목·업무 설명에서 핵심 표현을 추출해 내부 업종 사전과 대조한 뒤, 먼저 검토할 후보 코드를 보여줍니다.',
          '정확한 코드가 이미 있는 경우에는 수동 입력으로 바로 넘어갈 수 있고, 모호한 표현일 때는 유사 코드와 비교 포인트를 함께 제공합니다.',
        ],
      },
      {
        heading: '구역별 예비판정 방식',
        bullets: [
          '지식산업센터와 산업시설구역 기준을 분리해 각각의 이유와 메모를 보여줍니다.',
          '조건부 가능, 심의 필요, 추가 확인처럼 실무에서 헷갈리기 쉬운 상태를 별도 라벨로 구분합니다.',
          '원문 조문과 페이지 힌트를 함께 붙여 사용자가 근거를 다시 추적할 수 있게 합니다.',
        ],
      },
      {
        heading: '한계와 주의사항',
        paragraphs: [
          '자동 추천과 예비판정은 실제 사업 설명의 품질에 영향을 받습니다. 같은 코드라도 영위 방식, 입주 목적, 제조시설 계획, 임대 구조에 따라 해석이 달라질 수 있습니다.',
          '따라서 이 서비스는 최종 확정 대신 초기 검토와 설명 정리를 돕는 데 목적이 있으며, 계약·신고·심의 전에는 반드시 원문과 관할 기관 안내를 다시 확인해야 합니다.',
        ],
      },
    ],
  },
  {
    slug: 'editorial-policy',
    title: '편집 정책',
    description:
      '공개 가이드와 법령 요약 페이지를 어떤 원칙으로 작성·수정·검증하는지 설명합니다.',
    eyebrow: '편집 정책',
    heroTitle: '공개 콘텐츠는 이런 원칙으로 관리합니다',
    heroSummary:
      '마곡 코드찾기의 공개 페이지는 원문 복제가 아니라, 실무에서 바로 써야 하는 설명과 비교 포인트를 덧붙인 편집형 콘텐츠를 목표로 운영합니다.',
    ctaLabel: '업데이트 로그 보기',
    ctaHref: `${SITE_URL}/updates/`,
    sections: [
      {
        heading: '고유 콘텐츠 원칙',
        bullets: [
          '원문 문서를 그대로 복사하지 않고, 상담에 필요한 요약·비교·체크포인트를 자체 문장으로 작성합니다.',
          '비슷한 주제라도 각 공개 페이지가 답하는 질문과 다음 행동이 겹치지 않도록 구성합니다.',
          '광고보다 본문과 탐색 구조가 먼저 보이도록 유지합니다.',
        ],
      },
      {
        heading: '출처 검증 방식',
        paragraphs: [
          '법령과 고시 관련 페이지는 공식 원문 URL을 먼저 확인하고, 공개 설명과 원문 표현이 어긋나는 부분이 없는지 대조합니다.',
          '업데이트가 확인되면 법령 라이브러리, 대표 가이드, 업데이트 로그를 함께 수정해 한 화면만 낡지 않도록 관리합니다.',
        ],
      },
      {
        heading: '수정과 이력 공개',
        bullets: [
          '중요한 기준 변경이나 페이지 구조 변경은 업데이트 로그에 날짜와 영향 범위를 남깁니다.',
          '오류 제보가 들어오면 수정 가능한 범위부터 순차적으로 반영합니다.',
          '근거가 불충분한 내용은 추정 표현을 줄이고, 확인이 필요한 조건으로 명시합니다.',
        ],
      },
      {
        heading: '광고와 사용자 경험 원칙',
        paragraphs: [
          '광고 수익을 목적으로 페이지를 늘리지 않으며, 정보 가치가 낮은 템플릿성 페이지는 공개 색인에서 제외하거나 정리합니다.',
          '완성도 낮은 화면이나 오류 상태 화면에서는 광고보다 복구 안내와 탐색 링크를 먼저 제공하는 것을 기본 원칙으로 둡니다.',
        ],
      },
    ],
  },
]

function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
}

function stripHtml(value: string) {
  return value.replace(/<[^>]+>/g, '')
}

function truncateText(value: string, maxLength: number) {
  if (value.length <= maxLength) {
    return value
  }

  return `${value.slice(0, maxLength - 1).trim()}…`
}

function buildMetaTags({
  title,
  description,
  canonicalUrl,
  structuredData,
  robotsContent = DEFAULT_ROBOTS_CONTENT,
}: {
  title: string
  description: string
  canonicalUrl: string
  structuredData: unknown[]
  robotsContent?: string
}) {
  const escapedTitle = escapeHtml(title)
  const escapedDescription = escapeHtml(description)
  const escapedCanonicalUrl = escapeHtml(canonicalUrl)
  const structuredDataJson = JSON.stringify(structuredData).replaceAll(
    '</script',
    '<\\/script',
  )

  return [
    '<meta charset="UTF-8" />',
    '<meta name="viewport" content="width=device-width, initial-scale=1.0" />',
    `<meta name="robots" content="${escapeHtml(robotsContent)}" />`,
    `<title>${escapedTitle}</title>`,
    `<meta name="description" content="${escapedDescription}" />`,
    `<link rel="canonical" href="${escapedCanonicalUrl}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:site_name" content="${escapeHtml(BRAND_NAME)}" />`,
    `<meta property="og:title" content="${escapedTitle}" />`,
    `<meta property="og:description" content="${escapedDescription}" />`,
    `<meta property="og:url" content="${escapedCanonicalUrl}" />`,
    `<meta property="og:image" content="${escapeHtml(DEFAULT_OG_IMAGE)}" />`,
    '<meta name="twitter:card" content="summary_large_image" />',
    `<meta name="twitter:title" content="${escapedTitle}" />`,
    `<meta name="twitter:description" content="${escapedDescription}" />`,
    `<meta name="twitter:image" content="${escapeHtml(DEFAULT_OG_IMAGE)}" />`,
    `<script type="application/ld+json">${structuredDataJson}</script>`,
  ].join('\n    ')
}

function buildDocument({
  title,
  description,
  canonicalUrl,
  body,
  structuredData,
  robotsContent = DEFAULT_ROBOTS_CONTENT,
}: {
  title: string
  description: string
  canonicalUrl: string
  body: string
  structuredData: unknown[]
  robotsContent?: string
}) {
  return `<!doctype html>
<html lang="ko">
  <head>
    ${buildMetaTags({
      title,
      description,
      canonicalUrl,
      structuredData,
      robotsContent,
    })}
    <style>
      :root {
        color-scheme: light;
        --bg: #f4f8ff;
        --panel: rgba(255,255,255,0.96);
        --line: rgba(43,109,255,0.14);
        --text: #1f2a3d;
        --muted: #5a6a82;
        --accent: #2b6dff;
      }
      * { box-sizing: border-box; }
      body {
        margin: 0;
        font-family: "Pretendard", "Noto Sans KR", sans-serif;
        background: linear-gradient(180deg, #f7faff 0%, #eef4ff 100%);
        color: var(--text);
      }
      main {
        width: min(1120px, calc(100% - 32px));
        margin: 0 auto;
        padding: 40px 0 64px;
      }
      .hero, .section {
        background: var(--panel);
        border: 1px solid var(--line);
        border-radius: 28px;
        padding: 24px;
        box-shadow: 0 20px 50px rgba(28,33,43,0.08);
      }
      .section { margin-top: 16px; }
      .eyebrow {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 8px 12px;
        border-radius: 999px;
        background: rgba(43,109,255,0.08);
        color: var(--accent);
        font-size: 13px;
        font-weight: 700;
      }
      h1 {
        margin: 18px 0 0;
        font-size: clamp(32px, 5vw, 48px);
        line-height: 1.12;
        letter-spacing: -0.04em;
      }
      h2 {
        margin: 0 0 12px;
        font-size: 24px;
        line-height: 1.25;
      }
      p, li { color: var(--muted); line-height: 1.8; }
      ul, ol { margin: 0; padding-left: 20px; }
      .meta-row, .chip-row, .link-row {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
        margin-top: 16px;
      }
      .chip, .link-chip {
        display: inline-flex;
        align-items: center;
        padding: 8px 12px;
        border-radius: 999px;
        border: 1px solid var(--line);
        background: rgba(239,245,255,0.9);
        color: var(--text);
        font-size: 13px;
        text-decoration: none;
      }
      .grid {
        display: grid;
        gap: 16px;
      }
      .grid.two {
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      }
      .card {
        border: 1px solid var(--line);
        border-radius: 24px;
        background: rgba(248,251,255,0.88);
        padding: 20px;
      }
      .faq-item + .faq-item { margin-top: 12px; }
      a.cta {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        margin-top: 16px;
        color: white;
        background: var(--accent);
        border-radius: 999px;
        padding: 12px 18px;
        text-decoration: none;
        font-weight: 700;
      }
      a.text-link {
        color: var(--accent);
        text-decoration: none;
        font-weight: 700;
      }
      @media (max-width: 720px) {
        main { width: min(100% - 20px, 1120px); padding-top: 24px; }
        .hero, .section { padding: 18px; border-radius: 22px; }
      }
    </style>
  </head>
  <body>
    <main>
      ${body}
    </main>
  </body>
</html>`
}

function buildWebPageSchema({
  name,
  description,
  url,
  datePublished,
  dateModified,
  publisher,
  isBasedOn,
}: {
  name: string
  description: string
  url: string
  datePublished?: string
  dateModified?: string
  publisher?: { name: string; url?: string }
  isBasedOn?: string[]
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name,
    description,
    url,
    ...(datePublished ? { datePublished } : {}),
    ...(dateModified ? { dateModified } : {}),
    ...(publisher
      ? {
          publisher: {
            '@type': 'Organization',
            name: publisher.name,
            ...(publisher.url ? { url: publisher.url } : {}),
          },
        }
      : {}),
    ...(isBasedOn?.length
      ? { isBasedOn: isBasedOn.length === 1 ? isBasedOn[0] : isBasedOn }
      : {}),
  }
}

function buildBreadcrumbList(items: Array<{ name: string; item: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((entry, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: entry.name,
      item: entry.item,
    })),
  }
}

function buildFaqSchema(items: Array<{ question: string; answer: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: stripHtml(item.answer),
      },
    })),
  }
}

function renderTrustLinkRow() {
  return TRUST_PAGE_LINKS.map(
    (item) => `<a class="link-chip" href="${escapeHtml(item.href)}">${escapeHtml(item.label)}</a>`,
  ).join('')
}

function buildGuideSchema(guide: MagokGuideEntry, canonicalUrl: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: guide.title,
    description: guide.summary,
    url: canonicalUrl,
    areaServed: {
      '@type': 'Place',
      name: '마곡일반산업단지',
    },
    provider: {
      '@type': 'Organization',
      name: BRAND_NAME,
      url: SITE_URL,
    },
  }
}

function renderGuideBody(guide: MagokGuideEntry, canonicalUrl: string) {
  const publicRelatedCodes = guide.relatedCodes.filter((entry) =>
    PUBLIC_GUIDE_CODE_SET.has(entry.code),
  )
  const primaryZone = guide.zoneSummaries[0]
  const secondaryZone = guide.zoneSummaries[1]
  const practicalChecks = [
    `${guide.recommendedZoneLabel} 기준으로 먼저 검토하고, 다른 구역 결과와 차이가 나는지 함께 비교합니다.`,
    ...guide.zoneSummaries.flatMap((zoneSummary) => zoneSummary.notes.slice(0, 1)),
    secondaryZone
      ? `${secondaryZone.zoneLabel}에서는 ${secondaryZone.verdictLabel}로 정리되므로, 계약 대상 구역과 실제 영위 업무 설명이 어긋나지 않는지 함께 확인합니다.`
      : '',
  ].filter((item, index, items) => item && items.indexOf(item) === index)
  const readingOrder = [
    `${primaryZone?.zoneLabel ?? guide.recommendedZoneLabel} 결과부터 읽고 왜 ${primaryZone?.verdictLabel ?? '해당 판정'}으로 분류됐는지 확인합니다.`,
    secondaryZone
      ? `${secondaryZone.zoneLabel} 비교 결과를 이어서 읽어 같은 업종이지만 어디서 더 보수적으로 보는지 정리합니다.`
      : '다른 구역과의 비교 포인트를 함께 확인합니다.',
    `${guide.legalBases[0]?.citation ?? '관련 법령'}와 페이지 힌트를 따라 원문을 다시 확인합니다.`,
  ]
  const preparationItems = [
    `${guide.name} 실제 수행 업무가 드러나는 서비스 소개서 또는 제안서`,
    `${guide.recommendedZoneLabel} 입주 목적과 공간 사용 계획을 설명할 수 있는 사업 개요 메모`,
    ...guide.zoneSummaries.flatMap((zoneSummary) => zoneSummary.notes.slice(0, 1)),
    `${guide.legalBases[0]?.citation ?? '관련 법령'} 원문 확인 메모`,
  ].filter((item, index, items) => item && items.indexOf(item) === index)

  const zoneCards = guide.zoneSummaries
    .map(
      (zoneSummary) => `
      <article class="card">
        <div class="chip-row">
          <span class="chip">${escapeHtml(zoneSummary.zoneLabel)}</span>
          <span class="chip">${escapeHtml(zoneSummary.verdictLabel)}</span>
        </div>
        <p>${escapeHtml(zoneSummary.reason)}</p>
        ${
          zoneSummary.notes[0]
            ? `<p>${escapeHtml(zoneSummary.notes[0])}</p>`
            : ''
        }
      </article>`,
    )
    .join('')

  const faqItems = guide.faq
    .map(
      (item) => `
      <article class="card faq-item">
        <h2>${escapeHtml(item.question)}</h2>
        <p>${escapeHtml(item.answer)}</p>
      </article>`,
    )
    .join('')

  const legalItems = guide.legalBases
    .map(
      (basis) => `
      <article class="card faq-item">
        <div class="chip-row">
          <span class="chip">${escapeHtml(basis.citation)}</span>
          ${basis.pageHint ? `<span class="chip">${escapeHtml(basis.pageHint)}</span>` : ''}
          ${basis.articlePath ? `<span class="chip">${escapeHtml(basis.articlePath)}</span>` : ''}
        </div>
        <p>${escapeHtml(basis.summary)}</p>
      </article>`,
    )
    .join('')

  const relatedLinks = publicRelatedCodes
    .map(
      (relatedCode) =>
        `<a class="link-chip" href="${SITE_URL}/guides/${relatedCode.code}/">${escapeHtml(
          `${relatedCode.code} · ${relatedCode.name}`,
        )}</a>`,
    )
    .join('')

  const followUpActions = [
    `${guide.code} 코드를 기준으로 앱에서 조건 보정과 구역 비교를 다시 확인합니다.`,
    `${guide.legalBases[0]?.citation ?? '관련 법령'}부터 읽고 실제 사업 설명과 맞는지 검토합니다.`,
    publicRelatedCodes[0]
      ? `대표 공개 가이드 중 연관 코드 ${publicRelatedCodes[0].code}와 비교해 더 가까운 설명이 있는지 확인합니다.`
      : '연관 코드는 앱 안에서 전체 코드 사전과 함께 비교해 보는 편이 안전합니다.',
  ]

  return `
    <section class="hero">
      <div class="eyebrow">업종별 입주 가이드</div>
      <h1>${escapeHtml(guide.title)}</h1>
      <p>${escapeHtml(guide.summary)}</p>
      <div class="meta-row">
        <span class="chip">${escapeHtml(guide.code)}</span>
        <span class="chip">${escapeHtml(guide.browseCategory)}</span>
        <span class="chip">업데이트 ${escapeHtml(guide.updatedAt)}</span>
      </div>
      <a class="cta" href="${SITE_URL}/#guides/${guide.code}">앱에서 인터랙티브로 보기</a>
    </section>

    <section class="section">
      <h2>이 가이드가 다루는 범위</h2>
      <p>${escapeHtml(
        `${guide.name}(${guide.code})는 ${guide.sectionName} 안에서 ${guide.browseCategory} 흐름으로 분류되는 업종입니다.`,
      )}</p>
      <p>${escapeHtml(
        `${guide.recommendedZoneLabel}를 먼저 보되, 다른 구역 결과와 이유를 함께 놓고 비교해야 실제 상담에서 설명이 흔들리지 않습니다.`,
      )}</p>
      <p>${escapeHtml(
        '이 페이지는 원문 문서 전체를 그대로 옮긴 것이 아니라, 실제 상담과 검토 과정에서 바로 쓸 수 있도록 판단 순서와 체크포인트를 덧붙인 편집형 가이드입니다.',
      )}</p>
    </section>

    <section class="section">
      <h2>구역별 판단 요약</h2>
      <div class="grid two">${zoneCards}</div>
    </section>

    <section class="section">
      <h2>이렇게 읽으면 빠릅니다</h2>
      <ol>
        ${readingOrder.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}
      </ol>
    </section>

    <section class="section">
      <h2>핵심 해설</h2>
      <ul>
        ${guide.highlights.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}
      </ul>
    </section>

    <section class="section">
      <h2>실무 체크포인트</h2>
      <div class="grid two">
        ${practicalChecks
          .map(
            (item) => `
          <article class="card">
            <p>${escapeHtml(item)}</p>
          </article>`,
          )
          .join('')}
      </div>
    </section>

    <section class="section">
      <h2>준비 자료 체크리스트</h2>
      <ul>
        ${preparationItems.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}
      </ul>
    </section>

    <section class="section">
      <h2>자주 묻는 질문</h2>
      ${faqItems}
    </section>

    <section class="section">
      <h2>관련 법령</h2>
      ${legalItems}
    </section>

    <section class="section">
      <h2>연관 코드</h2>
      ${
        publicRelatedCodes.length > 0
          ? `<div class="link-row">${relatedLinks}</div>`
          : '<p>현재 공개 대표 가이드 안에서 직접 연결되는 연관 코드는 없으며, 앱의 전체 코드 사전에서 더 넓게 비교할 수 있습니다.</p>'
      }
      <h2 style="margin-top: 24px;">앱에서 이어서 확인하기</h2>
      <ul>
        ${followUpActions.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}
      </ul>
      <h2 style="margin-top: 24px;">운영 정보</h2>
      <div class="link-row">${renderTrustLinkRow()}</div>
      <p><a class="text-link" href="${SITE_URL}/#guides/${guide.code}">앱에서 이 가이드 열기</a></p>
      <p><a class="text-link" href="${SITE_URL}/#directory">전수 코드 사전으로 돌아가기</a></p>
      <p><a class="text-link" href="${canonicalUrl}">${escapeHtml(canonicalUrl)}</a></p>
    </section>
  `
}

export function buildGuideSeoDocument(guide: MagokGuideEntry): SeoPageDocument {
  const publicPath = `/guides/${guide.code}/`
  const canonicalUrl = `${SITE_URL}${publicPath}`
  const title = truncateText(`${guide.title} | ${BRAND_NAME}`, 60)
  const description = truncateText(
    `${guide.name}(${guide.code})의 마곡 입주 가능성, 구역별 판단, 관련 법령, FAQ를 한 페이지로 정리한 가이드입니다.`,
    160,
  )
  const structuredData = [
    buildGuideSchema(guide, canonicalUrl),
    buildFaqSchema(guide.faq.map((item) => ({ question: item.question, answer: item.answer }))),
    buildBreadcrumbList([
      { name: BRAND_NAME, item: SITE_URL },
      { name: '업종별 입주 가이드', item: `${SITE_URL}/guides/` },
      { name: guide.title, item: canonicalUrl },
    ]),
  ]

  return {
    filePath: `guides/${guide.code}/index.html`,
    url: canonicalUrl,
    html: buildDocument({
      title,
      description,
      canonicalUrl,
      structuredData,
      body: renderGuideBody(guide, canonicalUrl),
    }),
  }
}

function renderStaticSeoPageBody(page: StaticSeoPageDefinition, canonicalUrl: string) {
  const sections = page.sections
    .map(
      (section) => `
        <section class="section">
          <h2>${escapeHtml(section.heading)}</h2>
          ${
            section.paragraphs
              ?.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`)
              .join('') ?? ''
          }
          ${
            section.bullets?.length
              ? `<ul>${section.bullets
                  .map((item) => `<li>${escapeHtml(item)}</li>`)
                  .join('')}</ul>`
              : ''
          }
        </section>`,
    )
    .join('')

  return `
    <section class="hero">
      <div class="eyebrow">${escapeHtml(page.eyebrow)}</div>
      <h1>${escapeHtml(page.heroTitle)}</h1>
      <p>${escapeHtml(page.heroSummary)}</p>
      <a class="cta" href="${page.ctaHref}">${escapeHtml(page.ctaLabel)}</a>
    </section>
    ${sections}
    <section class="section">
      <h2>바로가기</h2>
      <div class="link-row">
        <a class="link-chip" href="${SITE_URL}/">홈</a>
        <a class="link-chip" href="${SITE_URL}/guides/">대표 가이드</a>
        <a class="link-chip" href="${SITE_URL}/library/">법령 라이브러리</a>
        <a class="link-chip" href="${SITE_URL}/updates/">업데이트 로그</a>
        ${renderTrustLinkRow()}
      </div>
      <p><a class="text-link" href="${canonicalUrl}">${escapeHtml(canonicalUrl)}</a></p>
    </section>
  `
}

export function buildStaticSeoDocuments(): SeoPageDocument[] {
  return STATIC_SEO_PAGES.map((page) => {
    const canonicalUrl = `${SITE_URL}/${page.slug}/`
    const title = truncateText(`${page.title} | ${BRAND_NAME}`, 60)
    const structuredData = [
      buildWebPageSchema({
        name: `${page.title} | ${BRAND_NAME}`,
        description: page.description,
        url: canonicalUrl,
        dateModified: '2026-03-30',
        publisher: { name: BRAND_NAME, url: SITE_URL },
      }),
      buildBreadcrumbList([
        { name: BRAND_NAME, item: SITE_URL },
        { name: page.title, item: canonicalUrl },
      ]),
    ]

    return {
      filePath: `${page.slug}/index.html`,
      url: canonicalUrl,
      html: buildDocument({
        title,
        description: page.description,
        canonicalUrl,
        structuredData,
        body: renderStaticSeoPageBody(page, canonicalUrl),
      }),
    }
  })
}

export function buildNotFoundSeoPage() {
  const canonicalUrl = `${SITE_URL}/404.html`

  return buildDocument({
    title: '페이지를 찾을 수 없습니다 | 마곡 코드찾기',
    description:
      '요청한 페이지를 찾을 수 없습니다. 홈, 대표 가이드, 법령 라이브러리에서 다시 탐색해 주세요.',
    canonicalUrl,
    robotsContent: 'noindex,nofollow',
    structuredData: [
      buildWebPageSchema({
        name: '페이지를 찾을 수 없습니다 | 마곡 코드찾기',
        description:
          '요청한 페이지를 찾을 수 없습니다. 홈, 대표 가이드, 법령 라이브러리에서 다시 탐색해 주세요.',
        url: canonicalUrl,
        publisher: { name: BRAND_NAME, url: SITE_URL },
      }),
    ],
    body: `
      <section class="hero">
        <div class="eyebrow">404</div>
        <h1>요청한 페이지를 찾을 수 없습니다</h1>
        <p>이전 공개 URL이 정리됐거나 주소가 잘못 입력됐을 수 있습니다. 아래 경로에서 다시 확인해 주세요.</p>
        <a class="cta" href="${SITE_URL}/">홈으로 돌아가기</a>
      </section>
      <section class="section">
        <h2>다음 경로 추천</h2>
        <div class="link-row">
          <a class="link-chip" href="${SITE_URL}/guides/">대표 가이드</a>
          <a class="link-chip" href="${SITE_URL}/library/">법령 라이브러리</a>
          <a class="link-chip" href="${SITE_URL}/updates/">업데이트 로그</a>
          <a class="link-chip" href="${SITE_URL}/contact/">문의</a>
        </div>
      </section>
    `,
  })
}

function renderFaqBody(faqEntry: GuideFaqIndexEntry) {
  return `
    <section class="hero">
      <div class="eyebrow">마곡 입주 FAQ</div>
      <h1>${escapeHtml(faqEntry.question)}</h1>
      <p>${escapeHtml(faqEntry.answer)}</p>
      <div class="meta-row">
        <span class="chip">${escapeHtml(faqEntry.guideCode)}</span>
        <span class="chip">${escapeHtml(faqEntry.guideTitle)}</span>
      </div>
      <a class="cta" href="${SITE_URL}/guides/${faqEntry.guideCode}/">관련 가이드 보기</a>
    </section>

    <section class="section">
      <h2>답변 요약</h2>
      <p>${escapeHtml(faqEntry.answer)}</p>
      <p><a class="text-link" href="${SITE_URL}/#guides/${faqEntry.guideCode}">앱에서 가이드 열기</a></p>
    </section>
  `
}

export function buildFaqSeoDocument(faqEntry: GuideFaqIndexEntry): SeoPageDocument {
  const publicPath = faqEntry.faqPath
  const canonicalUrl = `${SITE_URL}${publicPath}`
  const title = truncateText(`${faqEntry.question} | ${BRAND_NAME}`, 60)
  const description = truncateText(faqEntry.answer, 160)
  const structuredData = [
    buildFaqSchema([{ question: faqEntry.question, answer: faqEntry.answer }]),
    buildBreadcrumbList([
      { name: BRAND_NAME, item: SITE_URL },
      { name: 'FAQ', item: `${SITE_URL}/faq/` },
      { name: faqEntry.question, item: canonicalUrl },
    ]),
  ]

  return {
    filePath: `faq/${faqEntry.faqSlug}/index.html`,
    url: canonicalUrl,
    html: buildDocument({
      title,
      description,
      canonicalUrl,
      structuredData,
      body: renderFaqBody(faqEntry),
    }),
  }
}

function renderIndexLinkCards(
  items: Array<{ href: string; title: string; description: string; chips?: string[] }>,
) {
  return items
    .map(
      (item) => `
      <article class="card">
        <h2><a class="text-link" href="${escapeHtml(item.href)}">${escapeHtml(item.title)}</a></h2>
        <p>${escapeHtml(item.description)}</p>
        ${
          item.chips?.length
            ? `<div class="chip-row">${item.chips
                .map((chip) => `<span class="chip">${escapeHtml(chip)}</span>`)
                .join('')}</div>`
            : ''
        }
      </article>`,
    )
    .join('')
}

function renderSourceReferenceCards(references: SourceReference[]) {
  return references
    .map(
      (reference) => `
      <article class="card faq-item">
        <h2><a class="text-link" href="${escapeHtml(reference.url)}">${escapeHtml(reference.title)}</a></h2>
        <div class="chip-row">
          <span class="chip">${escapeHtml(reference.authority)}</span>
          ${
            reference.documentNumber
              ? `<span class="chip">${escapeHtml(reference.documentNumber)}</span>`
              : ''
          }
          ${
            reference.publishedDate
              ? `<span class="chip">공개일 ${escapeHtml(reference.publishedDate)}</span>`
              : ''
          }
        </div>
        ${reference.description ? `<p>${escapeHtml(reference.description)}</p>` : ''}
      </article>`,
    )
    .join('')
}

export function buildGuideIndexSeoDocument(guides: MagokGuideEntry[]): SeoPageDocument {
  const canonicalUrl = `${SITE_URL}/guides/`
  const title = '마곡 업종별 입주 가이드 모음 | 마곡 코드찾기'
  const description =
    '마곡 일반산업단지 업종코드별 입주 가능성, 구역 비교, 관련 법령, FAQ를 모아 둔 가이드 색인입니다.'
  const cards = renderIndexLinkCards(
    guides.map((guide) => ({
      href: `${SITE_URL}/guides/${guide.code}/`,
      title: guide.title,
      description: guide.summary,
      chips: [guide.code, guide.recommendedZoneLabel],
    })),
  )

  return {
    filePath: 'guides/index.html',
    url: canonicalUrl,
    html: buildDocument({
      title,
      description,
      canonicalUrl,
      structuredData: [
        buildBreadcrumbList([
          { name: BRAND_NAME, item: SITE_URL },
          { name: '업종별 입주 가이드', item: canonicalUrl },
        ]),
      ],
      body: `
        <section class="hero">
          <div class="eyebrow">업종별 가이드 색인</div>
          <h1>마곡 업종별 입주 가이드 모음</h1>
          <p>${escapeHtml(description)}</p>
          <a class="cta" href="${SITE_URL}/#finder">앱에서 바로 판정하기</a>
        </section>
        <section class="section">
          <h2>이 색인은 이렇게 쓰면 좋습니다</h2>
          <ol>
            <li>자주 검토하는 업종부터 골라 구역별 판단 차이를 먼저 읽습니다.</li>
            <li>해당 가이드의 법령 섹션에서 원문 근거를 확인합니다.</li>
            <li>코드가 애매하면 앱의 전체 코드 사전과 예비판정 화면으로 이어서 비교합니다.</li>
          </ol>
        </section>
        <section class="section">
          <h2>전체 가이드</h2>
          <div class="grid two">${cards}</div>
        </section>
        <section class="section">
          <h2>운영 정보</h2>
          <p>대표 가이드는 실무에서 자주 찾는 업종만 선별해 공개하며, 기준 변경이나 설명 수정은 업데이트 로그에 남깁니다.</p>
          <div class="link-row">${renderTrustLinkRow()}</div>
        </section>
      `,
    }),
  }
}

export function buildFaqIndexSeoDocument(faqEntries: GuideFaqIndexEntry[]): SeoPageDocument {
  const canonicalUrl = `${SITE_URL}/faq/`
  const title = '마곡 입주 FAQ 모음 | 마곡 코드찾기'
  const description =
    '마곡 입주 가능성, 심의 필요 사유, 구역별 차이를 질문형으로 정리한 FAQ 색인입니다.'
  const cards = renderIndexLinkCards(
    faqEntries.map((faqEntry) => ({
      href: `${SITE_URL}${faqEntry.faqPath}`,
      title: faqEntry.question,
      description: faqEntry.answer,
      chips: [faqEntry.guideCode],
    })),
  )

  return {
    filePath: 'faq/index.html',
    url: canonicalUrl,
    html: buildDocument({
      title,
      description,
      canonicalUrl,
      structuredData: [
        buildBreadcrumbList([
          { name: BRAND_NAME, item: SITE_URL },
          { name: 'FAQ', item: canonicalUrl },
        ]),
      ],
      body: `
        <section class="hero">
          <div class="eyebrow">마곡 입주 FAQ 색인</div>
          <h1>질문형 FAQ 모음</h1>
          <p>${escapeHtml(description)}</p>
        </section>
        <section class="section">
          <h2>전체 FAQ</h2>
          <div class="grid two">${cards}</div>
        </section>
      `,
    }),
  }
}

export function buildSitemapXml(
  urls: Array<{
    url: string
    lastmod: string
    priority?: string
    changefreq?: string
  }>,
) {
  const items = urls
    .map(
      (entry) => `  <url>
    <loc>${escapeHtml(entry.url)}</loc>
    <lastmod>${escapeHtml(entry.lastmod)}</lastmod>
    <changefreq>${escapeHtml(entry.changefreq ?? 'weekly')}</changefreq>
    <priority>${escapeHtml(entry.priority ?? '0.7')}</priority>
  </url>`,
    )
    .join('\n')

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${items}
</urlset>`
}

export function buildSitemapIndexXml(
  sitemaps: Array<{
    url: string
    lastmod: string
  }>,
) {
  const items = sitemaps
    .map(
      (entry) => `  <sitemap>
    <loc>${escapeHtml(entry.url)}</loc>
    <lastmod>${escapeHtml(entry.lastmod)}</lastmod>
  </sitemap>`,
    )
    .join('\n')

  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${items}
</sitemapindex>`
}

function renderLibraryBody(
  entry: LegalLibraryEntryDetail | null,
  canonicalUrl: string,
  pageTitle: string,
  pageDescription: string,
) {
  if (!entry) {
    return `
      <section class="hero">
        <div class="eyebrow">법령 라이브러리</div>
        <h1>${escapeHtml(pageTitle)}</h1>
        <p>${escapeHtml(pageDescription)}</p>
        <a class="cta" href="${SITE_URL}/#library">앱에서 인터랙티브로 보기</a>
      </section>
    `
  }

  const basisCards = entry.bases
    .map(
      (basis) => `
      <article class="card faq-item">
        <div class="chip-row">
          <span class="chip">${escapeHtml(basis.citation)}</span>
          ${basis.pageHint ? `<span class="chip">${escapeHtml(basis.pageHint)}</span>` : ''}
          ${basis.articlePath ? `<span class="chip">${escapeHtml(basis.articlePath)}</span>` : ''}
        </div>
        <p>${escapeHtml(basis.summary)}</p>
        ${basis.quote ? `<p>${escapeHtml(basis.quote)}</p>` : ''}
      </article>`,
    )
    .join('')

  const sourceCards = renderSourceReferenceCards([
    entry.officialSource,
    ...(entry.supplementarySources ?? []),
  ])

  return `
    <section class="hero">
      <div class="eyebrow">법령 라이브러리</div>
      <h1>${escapeHtml(pageTitle)}</h1>
      <p>${escapeHtml(pageDescription)}</p>
      <div class="meta-row">
        <span class="chip">${escapeHtml(entry.sourceKind === 'magokPlan' ? '마곡 고시문' : '산업집적법 시행령')}</span>
        <span class="chip">${escapeHtml(entry.officialSource.authority)}</span>
        ${entry.officialSource.documentNumber ? `<span class="chip">${escapeHtml(entry.officialSource.documentNumber)}</span>` : ''}
        ${entry.officialSource.publishedDate ? `<span class="chip">공개일 ${escapeHtml(entry.officialSource.publishedDate)}</span>` : ''}
      </div>
      <div class="link-row">
        <a class="cta" href="${SITE_URL}/#library">앱에서 인터랙티브로 보기</a>
        <a class="link-chip" href="${escapeHtml(entry.officialSource.url)}">원문 보기</a>
      </div>
    </section>

    <section class="section">
      <h2>언제 이 문서를 보나요?</h2>
      <p>${escapeHtml(entry.applicability)}</p>
    </section>

    <section class="section">
      <h2>핵심 조문과 해설</h2>
      ${basisCards}
    </section>

    <section class="section">
      <h2>원문 출처</h2>
      ${sourceCards}
    </section>

    <section class="section">
      <h2>운영 정보</h2>
      <div class="link-row">${renderTrustLinkRow()}</div>
    </section>

    <section class="section">
      <h2>공개 주소</h2>
      <p><a class="text-link" href="${canonicalUrl}">${escapeHtml(canonicalUrl)}</a></p>
    </section>
  `
}

export function buildLibraryIndexSeoDocument(entries: LegalLibraryEntryDetail[]): SeoPageDocument {
  const canonicalUrl = `${SITE_URL}/library/`
  const title = '마곡 법령 라이브러리 | 마곡 코드찾기'
  const description =
    '마곡 입주 판정에 쓰이는 산업집적법 시행령과 마곡 관리기본계획을 문서 단위로 정리한 공개 법령 라이브러리입니다.'
  const latestEffectiveDate = entries.reduce<string | undefined>((latest, entry) => {
    if (!latest || entry.effectiveDate > latest) {
      return entry.effectiveDate
    }

    return latest
  }, undefined)
  const cards = renderIndexLinkCards(
    entries.map((entry) => ({
      href: `${SITE_URL}/library/${entry.id}/`,
      title: entry.title,
      description: entry.summary,
      chips: [
        entry.sourceKind === 'magokPlan' ? '마곡 고시문' : '산업집적법 시행령',
        entry.officialSource.authority,
      ],
    })),
  )

  return {
    filePath: 'library/index.html',
    url: canonicalUrl,
    html: buildDocument({
      title,
      description,
      canonicalUrl,
      structuredData: [
        buildWebPageSchema({
          name: title,
          description,
          url: canonicalUrl,
          dateModified: latestEffectiveDate,
          publisher: {
            name: BRAND_NAME,
            url: SITE_URL,
          },
        }),
        buildBreadcrumbList([
          { name: BRAND_NAME, item: SITE_URL },
          { name: '법령 라이브러리', item: canonicalUrl },
        ]),
      ],
      body: `
        <section class="hero">
          <div class="eyebrow">법령 라이브러리</div>
          <h1>마곡 입주 법령 라이브러리</h1>
          <p>${escapeHtml(description)}</p>
          <a class="cta" href="${SITE_URL}/#library">앱에서 라이브러리 열기</a>
        </section>
        <section class="section">
          <h2>문서별 역할</h2>
          <ul>
            <li>시행령은 상위 범주와 기본 자격 요건을 확인할 때 먼저 봅니다.</li>
            <li>마곡 고시문은 실제 구역 운영 기준, 예외 허용, 제조시설 조건을 좁혀 읽을 때 중요합니다.</li>
            <li>공개 페이지에서는 문서별 요약과 함께 원문 URL을 함께 제공합니다.</li>
          </ul>
        </section>
        <section class="section">
          <h2>문서 목록</h2>
          <div class="grid two">${cards}</div>
        </section>
        <section class="section">
          <h2>운영 정보</h2>
          <p>원문이 갱신되면 법령 라이브러리, 대표 가이드, 업데이트 로그를 함께 수정하는 것을 기본 원칙으로 둡니다.</p>
          <div class="link-row">${renderTrustLinkRow()}</div>
        </section>
      `,
    }),
  }
}

export function buildLibraryDetailSeoDocument(entry: LegalLibraryEntryDetail): SeoPageDocument {
  const canonicalUrl = `${SITE_URL}/library/${entry.id}/`
  const title = truncateText(`${entry.title} | ${BRAND_NAME}`, 60)
  const description = truncateText(entry.summary, 160)

  return {
    filePath: `library/${entry.id}/index.html`,
    url: canonicalUrl,
    html: buildDocument({
      title,
      description,
      canonicalUrl,
      structuredData: [
        buildWebPageSchema({
          name: entry.title,
          description,
          url: canonicalUrl,
          datePublished: entry.officialSource.publishedDate,
          dateModified: entry.effectiveDate,
          publisher: {
            name: entry.officialSource.authority,
          },
          isBasedOn: [
            entry.officialSource.url,
            ...(entry.supplementarySources ?? []).map((source) => source.url),
          ],
        }),
        buildBreadcrumbList([
          { name: BRAND_NAME, item: SITE_URL },
          { name: '법령 라이브러리', item: `${SITE_URL}/library/` },
          { name: entry.title, item: canonicalUrl },
        ]),
      ],
      body: renderLibraryBody(entry, canonicalUrl, entry.title, entry.summary),
    }),
  }
}

function renderUpdateBody(
  entry: UpdateLogEntry | null,
  canonicalUrl: string,
  pageTitle: string,
  pageDescription: string,
) {
  if (!entry) {
    return `
      <section class="hero">
        <div class="eyebrow">업데이트 로그</div>
        <h1>${escapeHtml(pageTitle)}</h1>
        <p>${escapeHtml(pageDescription)}</p>
        <a class="cta" href="${SITE_URL}/#updates">앱에서 인터랙티브로 보기</a>
      </section>
    `
  }

  return `
    <section class="hero">
      <div class="eyebrow">업데이트 로그</div>
      <h1>${escapeHtml(pageTitle)}</h1>
      <p>${escapeHtml(pageDescription)}</p>
      <div class="meta-row">
        <span class="chip">${escapeHtml(entry.date)}</span>
        ${entry.sourceReferences
          .slice(0, 2)
          .map((source) => `<span class="chip">${escapeHtml(source.title)}</span>`)
          .join('')}
      </div>
      <a class="cta" href="${SITE_URL}/#updates">앱에서 인터랙티브로 보기</a>
    </section>

    <section class="section">
      <h2>이번에 달라진 점</h2>
      <ul>
        ${entry.highlights.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}
      </ul>
    </section>

    <section class="section">
      <h2>영향 범위</h2>
      <div class="chip-row">
        ${entry.affectedAreas.map((item) => `<span class="chip">${escapeHtml(item)}</span>`).join('')}
      </div>
    </section>

    <section class="section">
      <h2>원문·정책 출처</h2>
      ${renderSourceReferenceCards(entry.sourceReferences)}
    </section>

    <section class="section">
      <h2>운영 정보</h2>
      <div class="link-row">${renderTrustLinkRow()}</div>
    </section>

    <section class="section">
      <h2>공개 주소</h2>
      <p><a class="text-link" href="${canonicalUrl}">${escapeHtml(canonicalUrl)}</a></p>
    </section>
  `
}

export function buildUpdatesIndexSeoDocument(entries: UpdateLogEntry[]): SeoPageDocument {
  const canonicalUrl = `${SITE_URL}/updates/`
  const title = '마곡 업데이트 로그 | 마곡 코드찾기'
  const description =
    '마곡 입주 판정 기준과 화면 구조가 언제 어떻게 바뀌었는지 기록한 공개 업데이트 로그입니다.'
  const cards = renderIndexLinkCards(
    entries.map((entry) => ({
      href: `${SITE_URL}/updates/${entry.id}/`,
      title: entry.title,
      description: entry.summary,
      chips: [entry.date, ...entry.sourceReferences.slice(0, 2).map((source) => source.title)],
    })),
  )

  return {
    filePath: 'updates/index.html',
    url: canonicalUrl,
    html: buildDocument({
      title,
      description,
      canonicalUrl,
      structuredData: [
        buildWebPageSchema({
          name: title,
          description,
          url: canonicalUrl,
          dateModified: entries[0]?.date,
          publisher: {
            name: BRAND_NAME,
            url: SITE_URL,
          },
        }),
        buildBreadcrumbList([
          { name: BRAND_NAME, item: SITE_URL },
          { name: '업데이트 로그', item: canonicalUrl },
        ]),
      ],
      body: `
        <section class="hero">
          <div class="eyebrow">업데이트 로그</div>
          <h1>마곡 제품 업데이트 이력</h1>
          <p>${escapeHtml(description)}</p>
          <a class="cta" href="${SITE_URL}/#updates">앱에서 업데이트 로그 열기</a>
        </section>
        <section class="section">
          <h2>왜 변경 이력을 공개하나요</h2>
          <p>입주 판단 기준과 설명 문장은 작은 표현 차이에도 의미가 달라질 수 있어, 어떤 기준이 언제 바뀌었는지 추적할 수 있도록 공개 로그를 유지합니다.</p>
          <p>중요한 수정은 영향 범위와 참고한 출처를 함께 남겨 사이트 운영 투명성을 높이는 데 목적이 있습니다.</p>
        </section>
        <section class="section">
          <h2>최근 변경 내역</h2>
          <div class="grid two">${cards}</div>
        </section>
        <section class="section">
          <h2>운영 정보</h2>
          <div class="link-row">${renderTrustLinkRow()}</div>
        </section>
      `,
    }),
  }
}

export function buildUpdateDetailSeoDocument(entry: UpdateLogEntry): SeoPageDocument {
  const canonicalUrl = `${SITE_URL}/updates/${entry.id}/`
  const title = truncateText(`${entry.title} | ${BRAND_NAME}`, 60)
  const description = truncateText(entry.summary, 160)

  return {
    filePath: `updates/${entry.id}/index.html`,
    url: canonicalUrl,
    html: buildDocument({
      title,
      description,
      canonicalUrl,
      structuredData: [
        buildWebPageSchema({
          name: entry.title,
          description,
          url: canonicalUrl,
          datePublished: entry.date,
          dateModified: entry.date,
          publisher: {
            name: BRAND_NAME,
            url: SITE_URL,
          },
          isBasedOn: entry.sourceReferences.map((source) => source.url),
        }),
        buildBreadcrumbList([
          { name: BRAND_NAME, item: SITE_URL },
          { name: '업데이트 로그', item: `${SITE_URL}/updates/` },
          { name: entry.title, item: canonicalUrl },
        ]),
      ],
      body: renderUpdateBody(entry, canonicalUrl, entry.title, entry.summary),
    }),
  }
}
