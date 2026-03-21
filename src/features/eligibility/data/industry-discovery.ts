import {
  MAGOK_CODE_DIRECTORY,
  getDirectoryVerdictWeight,
  getMagokCodeDirectoryEntry,
} from '@/features/eligibility/data/magok-code-directory'
import { KNOWLEDGE_CENTER_DISCOVERY_ENTRIES } from '@/features/eligibility/data/knowledge-center-exact-codes'
import { normalizeKsicCode } from '@/features/eligibility/data/rules'
import type {
  DirectoryZoneType,
  IndustrySuggestion,
  RegulatoryFit,
} from '@/features/eligibility/types'

interface IndustryDiscoveryPreset {
  code: string
  name: string
  aliases: string[]
  reason: string
  suggestedRegulatoryFit?: RegulatoryFit
}

const STOP_WORDS = new Set([
  '업태',
  '종목',
  '업종',
  '사업내용',
  '주업종',
  '세부업종',
  '사업자등록증',
  '사업자',
  '등록증',
  '저는',
  '저희',
  '회사',
  '기업',
  '업체',
  '운영',
  '입니다',
  '해요',
  '합니다',
  '그리고',
  '관련',
  '중심',
  '위주',
  '주로',
  '서비스',
])

const FIELD_LABEL_PATTERN =
  /(업태|종목|업종|사업내용|주업종|세부업종)\s*[:：]?\s*([\s\S]*?)(?=(업태|종목|업종|사업내용|주업종|세부업종)\s*[:：]|\r?\n|$)/g

export const DISCOVERY_EXAMPLE_PROMPTS = [
  '저는 광고대행업 해요',
  '업태: 서비스 / 종목: 광고대행업',
  '앱 개발과 SaaS 운영을 합니다',
  '행사 기획, 컨벤션, 전시 대행을 합니다',
]

const DISCOVERY_PRESETS: IndustryDiscoveryPreset[] = [
  {
    code: '71310',
    name: '광고 대행업',
    aliases: [
      '광고대행',
      '광고대행업',
      '광고기획',
      '광고운영',
      '마케팅대행',
      '디지털마케팅',
      '온라인마케팅',
      '퍼포먼스마케팅',
    ],
    reason: '광고 기획과 집행 중심 설명은 보통 광고 대행업으로 연결됩니다.',
    suggestedRegulatoryFit: 'knowledgeIndustry',
  },
  {
    code: '71392',
    name: '광고물 문안, 도안, 설계 등 작성업',
    aliases: [
      '광고문안',
      '카피라이팅',
      '광고카피',
      '광고디자인',
      '광고도안',
      '광고콘텐츠작성',
    ],
    reason: '광고 제작물 기획이나 문안 작성 성격이 강하면 이 업종이 더 정확할 수 있습니다.',
    suggestedRegulatoryFit: 'knowledgeIndustry',
  },
  {
    code: '71391',
    name: '옥외 광고업',
    aliases: [
      '옥외광고',
      '옥외광고업',
      '간판광고',
      '현수막광고',
      '빌보드광고',
      '전시광고',
    ],
    reason: '간판, 현수막, 옥외 매체 중심 설명은 옥외 광고업으로 먼저 연결하는 편이 자연스럽습니다.',
    suggestedRegulatoryFit: 'knowledgeIndustry',
  },
  {
    code: '75994',
    name: '포장 및 충전업',
    aliases: ['포장충전', '포장충전업', '충전포장', '패키징충전'],
    reason:
      '포장과 충전 작업 중심 설명은 포장 및 충전업과 직접 연결되며, 마곡 지식산업센터에서는 제한 업종으로 함께 검토해야 합니다.',
    suggestedRegulatoryFit: 'knowledgeIndustry',
  },
  {
    code: '73203',
    name: '시각 디자인업',
    aliases: [
      '시각디자인',
      '그래픽디자인',
      '브랜딩',
      '브랜드디자인',
      '편집디자인',
      'ci디자인',
      'bi디자인',
    ],
    reason: '브랜딩과 그래픽 작업 설명은 시각 디자인업과 가장 가깝습니다.',
    suggestedRegulatoryFit: 'knowledgeIndustry',
  },
  {
    code: '73202',
    name: '제품 디자인업',
    aliases: ['제품디자인', '산업디자인', '패키지디자인', '프로덕트디자인'],
    reason: '제품이나 산업디자인 중심 설명은 제품 디자인업으로 연결되는 경우가 많습니다.',
    suggestedRegulatoryFit: 'knowledgeIndustry',
  },
  {
    code: '62010',
    name: '컴퓨터 프로그래밍 서비스업',
    aliases: [
      '앱개발',
      '웹개발',
      '프로그램개발',
      '소프트웨어개발',
      '플랫폼개발',
      '프로그래밍',
      '개발대행',
      '서비스개발',
    ],
    reason: '개발 용역이나 구축형 프로젝트 설명은 컴퓨터 프로그래밍 서비스업으로 먼저 검토합니다.',
    suggestedRegulatoryFit: 'informationIndustry',
  },
  {
    code: '58222',
    name: '응용 소프트웨어 개발 및 공급업',
    aliases: [
      'saas',
      '솔루션개발',
      '응용소프트웨어',
      '소프트웨어공급',
      '서비스형소프트웨어',
      '플랫폼서비스',
    ],
    reason: '자체 솔루션이나 SaaS 공급 모델 설명은 응용 소프트웨어 개발 및 공급업과 가깝습니다.',
    suggestedRegulatoryFit: 'informationIndustry',
  },
  {
    code: '58221',
    name: '시스템 소프트웨어 개발 및 공급업',
    aliases: ['시스템소프트웨어', '미들웨어', '운영체제', '보안솔루션', '플랫폼엔진'],
    reason: '시스템 레벨 소프트웨어나 엔진 개발 설명은 시스템 소프트웨어 개발 쪽이 더 맞을 수 있습니다.',
    suggestedRegulatoryFit: 'informationIndustry',
  },
  {
    code: '58211',
    name: '유선 온라인 게임 소프트웨어 개발 및 공급업',
    aliases: ['온라인게임개발', 'pc온라인게임', '유선온라인게임', 'mmorpg개발'],
    reason:
      'PC 기반 온라인 게임이나 중앙 서버형 게임 개발 설명은 유선 온라인 게임 소프트웨어 개발 및 공급업과 가깝습니다.',
    suggestedRegulatoryFit: 'informationIndustry',
  },
  {
    code: '58212',
    name: '모바일 게임 소프트웨어 개발 및 공급업',
    aliases: ['모바일게임개발', '게임앱개발', '모바일게임', '게임앱'],
    reason:
      '모바일 게임 앱이나 모바일 게임 서비스 설명은 모바일 게임 소프트웨어 개발 및 공급업으로 먼저 검토합니다.',
    suggestedRegulatoryFit: 'informationIndustry',
  },
  {
    code: '58219',
    name: '기타 게임 소프트웨어 개발 및 공급업',
    aliases: ['게임개발', '패키지게임', '비디오게임', '아케이드게임', '게임소프트웨어'],
    reason:
      '패키지 게임, 아케이드 게임, 비디오 게임 같은 설명은 기타 게임 소프트웨어 개발 및 공급업과 연결되는 경우가 많습니다.',
    suggestedRegulatoryFit: 'informationIndustry',
  },
  {
    code: '58111',
    name: '교과서 및 학습 서적 출판업',
    aliases: ['교재출판', '학습서출판', '참고서출판', '학습지출판', '교육출판'],
    reason:
      '교과서, 참고서, 학습지 같은 교육용 출판 설명은 교과서 및 학습 서적 출판업으로 먼저 연결하는 편이 자연스럽습니다.',
    suggestedRegulatoryFit: 'knowledgeIndustry',
  },
  {
    code: '58112',
    name: '만화 출판업',
    aliases: ['만화출판', '웹툰출판', '코믹출판', '만화책출판'],
    reason: '만화책이나 웹툰 출판 설명은 만화 출판업과 가장 가깝습니다.',
    suggestedRegulatoryFit: 'knowledgeIndustry',
  },
  {
    code: '58113',
    name: '일반 서적 출판업',
    aliases: ['출판사', '도서출판', '단행본출판', '책출판', '전자책출판'],
    reason:
      '일반 도서, 단행본, 전자책 중심 설명은 일반 서적 출판업으로 연결되는 경우가 많습니다.',
    suggestedRegulatoryFit: 'knowledgeIndustry',
  },
  {
    code: '58121',
    name: '신문 발행업',
    aliases: ['신문발행', '신문사', '인터넷신문발행', '뉴스신문'],
    reason: '신문 발행 중심 설명은 신문 발행업으로 먼저 검토하는 편이 맞습니다.',
    suggestedRegulatoryFit: 'knowledgeIndustry',
  },
  {
    code: '58122',
    name: '잡지 및 정기 간행물 발행업',
    aliases: ['잡지발행', '매거진발행', '정기간행물', '월간지발행', '사보발행'],
    reason:
      '매거진, 월간지, 사보 같은 정기 간행물 설명은 잡지 및 정기 간행물 발행업으로 연결하는 편이 자연스럽습니다.',
    suggestedRegulatoryFit: 'knowledgeIndustry',
  },
  {
    code: '58123',
    name: '정기 광고 간행물 발행업',
    aliases: ['광고간행물', '생활정보지', '부동산정보지', '구인구직지'],
    reason:
      '생활정보지나 구인구직지처럼 광고성 정기 간행물 설명은 정기 광고 간행물 발행업으로 보는 편이 맞습니다.',
    suggestedRegulatoryFit: 'knowledgeIndustry',
  },
  {
    code: '58190',
    name: '기타 인쇄물 출판업',
    aliases: ['카탈로그출판', '브로슈어출판', '리플릿출판', '캘린더출판'],
    reason:
      '카탈로그, 브로슈어, 리플릿 같은 인쇄물 발행 설명은 기타 인쇄물 출판업으로 연결할 수 있습니다.',
    suggestedRegulatoryFit: 'knowledgeIndustry',
  },
  {
    code: '62021',
    name: '컴퓨터 시스템 통합 자문 및 구축 서비스업',
    aliases: ['시스템통합', 'si', 'erp구축', 'it구축', '인프라구축', '전산구축'],
    reason: '시스템 구축이나 통합 자문 설명은 SI 성격 업종으로 보는 편이 안전합니다.',
    suggestedRegulatoryFit: 'informationIndustry',
  },
  {
    code: '62090',
    name: '기타 정보 기술 및 컴퓨터 운영 관련 서비스업',
    aliases: ['it운영', '클라우드운영', '시스템운영', '기술지원', 'devops', '데브옵스'],
    reason: '운영·관리형 IT 서비스 설명은 정보기술 운영 관련 서비스업과 가깝습니다.',
    suggestedRegulatoryFit: 'informationIndustry',
  },
  {
    code: '63111',
    name: '자료 처리업',
    aliases: ['자료처리', '데이터처리', '데이터가공', '데이터정제', '데이터처리대행'],
    reason: '데이터를 수집·가공·정리해 주는 서비스는 자료 처리업으로 먼저 연결합니다.',
    suggestedRegulatoryFit: 'informationIndustry',
  },
  {
    code: '63112',
    name: '호스팅 및 관련 서비스업',
    aliases: ['호스팅', '웹호스팅', '서버호스팅', '클라우드호스팅', '서버운영대행'],
    reason: '호스팅 표현이 있으면 호스팅 및 관련 서비스업을 우선 추천합니다.',
    suggestedRegulatoryFit: 'informationIndustry',
  },
  {
    code: '63120',
    name: '포털 및 기타 인터넷 정보 매개 서비스업',
    aliases: ['포털', '인터넷정보매개', '온라인플랫폼중개', '정보매개플랫폼'],
    reason: '포털이나 정보 매개형 플랫폼 설명은 인터넷 정보 매개 서비스업이 유력합니다.',
    suggestedRegulatoryFit: 'informationIndustry',
  },
  {
    code: '63991',
    name: '데이터베이스 및 온라인 정보 제공업',
    aliases: ['데이터베이스', 'db서비스', '온라인정보제공', '정보제공서비스', '데이터플랫폼'],
    reason: '데이터 제공과 정보서비스 중심 설명은 데이터베이스 및 온라인 정보 제공업에 가깝습니다.',
    suggestedRegulatoryFit: 'informationIndustry',
  },
  {
    code: '70121',
    name: '전기·전자공학 연구개발업',
    aliases: ['연구개발', 'r&d', 'rnd', '기술연구', '공학연구', '전자연구'],
    reason: '막연한 연구개발 설명은 대표적인 연구개발업 코드부터 검토하는 편이 좋습니다.',
    suggestedRegulatoryFit: 'knowledgeIndustry',
  },
  {
    code: '70113',
    name: '의학 및 약학 연구개발업',
    aliases: ['바이오연구', '신약개발', '의약연구', '의료연구', '제약연구'],
    reason: '바이오·제약 중심 설명은 의학 및 약학 연구개발업으로 연결되는 경우가 많습니다.',
    suggestedRegulatoryFit: 'knowledgeIndustry',
  },
  {
    code: '70119',
    name: '기타 자연과학 연구개발업',
    aliases: ['연구소', '기업부설연구소', '연구개발센터', 'r&d센터', '자연과학연구'],
    reason:
      '일반적인 연구소, 기업부설연구소, 자연과학 연구 설명은 기타 자연과학 연구개발업으로 먼저 연결하는 편이 좋습니다.',
    suggestedRegulatoryFit: 'knowledgeIndustry',
  },
  {
    code: '70129',
    name: '기타 공학 연구개발업',
    aliases: ['기계연구', '로봇연구', '소재연구', '부품연구', '장비연구', '공학연구개발'],
    reason:
      '기계, 로봇, 소재, 장비 같은 공학 분야 연구개발 설명은 기타 공학 연구개발업에 가깝습니다.',
    suggestedRegulatoryFit: 'knowledgeIndustry',
  },
  {
    code: '70130',
    name: '자연과학 및 공학 융합 연구개발업',
    aliases: ['융합연구', '융합r&d', '다학제연구', '복합연구개발'],
    reason:
      '자연과학과 공학이 함께 섞인 다학제 융합 연구개발 설명은 자연과학 및 공학 융합 연구개발업으로 연결하는 편이 자연스럽습니다.',
    suggestedRegulatoryFit: 'knowledgeIndustry',
  },
  {
    code: '70201',
    name: '경제 및 경영학 연구개발업',
    aliases: ['경제연구', '경영연구', '금융연구', '산업정책연구', '경제경영연구'],
    reason:
      '경제, 경영, 금융, 산업정책 중심의 연구 설명은 경제 및 경영학 연구개발업과 가장 가깝습니다.',
    suggestedRegulatoryFit: 'knowledgeIndustry',
  },
  {
    code: '70209',
    name: '기타 인문 및 사회과학 연구개발업',
    aliases: ['사회과학연구', '인문연구', '정책연구', '문화연구', '사회연구'],
    reason:
      '정책, 문화, 사회과학, 인문학 중심 연구 설명은 기타 인문 및 사회과학 연구개발업으로 검토하는 편이 맞습니다.',
    suggestedRegulatoryFit: 'knowledgeIndustry',
  },
  {
    code: '72111',
    name: '건축 설계 및 관련 서비스업',
    aliases: ['건축설계', '건축사사무소', '설계사무소', '건축기획', '건축감리'],
    reason:
      '건축 설계, 건축 기획, 건축사사무소 성격의 설명은 건축 설계 및 관련 서비스업으로 먼저 연결하는 편이 좋습니다.',
    suggestedRegulatoryFit: 'knowledgeIndustry',
  },
  {
    code: '72112',
    name: '도시 계획 및 조경 설계 서비스업',
    aliases: ['도시계획', '조경설계', '도시설계', '마스터플랜', '조경계획'],
    reason:
      '도시계획, 조경설계, 토지 활용 계획 설명은 도시 계획 및 조경 설계 서비스업과 가깝습니다.',
    suggestedRegulatoryFit: 'knowledgeIndustry',
  },
  {
    code: '72121',
    name: '건물 및 토목 엔지니어링 서비스업',
    aliases: ['토목설계', '토목엔지니어링', '구조설계', '건물엔지니어링'],
    reason:
      '건물, 구조, 도로, 교량, 토목 관련 엔지니어링 설명은 건물 및 토목 엔지니어링 서비스업으로 보는 편이 맞습니다.',
    suggestedRegulatoryFit: 'knowledgeIndustry',
  },
  {
    code: '72122',
    name: '환경 관련 엔지니어링 서비스업',
    aliases: ['환경엔지니어링', '환경컨설팅', '환경영향평가', '수질관리설계', '폐기물처리설계'],
    reason:
      '환경영향평가, 수질, 대기, 폐기물 처리 관련 설계나 컨설팅 설명은 환경 관련 엔지니어링 서비스업과 가깝습니다.',
    suggestedRegulatoryFit: 'knowledgeIndustry',
  },
  {
    code: '72129',
    name: '기타 엔지니어링 서비스업',
    aliases: ['엔지니어링', '기술용역', '기술자문', '기술서비스', '설계용역'],
    reason: '기술 자문이나 엔지니어링 설명은 관련 서비스업 코드가 더 적합할 수 있습니다.',
    suggestedRegulatoryFit: 'knowledgeIndustry',
  },
  {
    code: '72911',
    name: '물질 성분 검사 및 분석업',
    aliases: ['성분분석', '물질분석', '시험분석', '분석시험', '순도분석'],
    reason:
      '물질의 순도, 성분, 성질을 검사하거나 분석하는 설명은 물질 성분 검사 및 분석업으로 먼저 연결할 수 있습니다.',
    suggestedRegulatoryFit: 'knowledgeIndustry',
  },
  {
    code: '72919',
    name: '기타 기술 시험, 검사 및 분석업',
    aliases: ['시험검사', '분석서비스', '인증시험', '테스트랩', '검사분석'],
    reason: '시험·검사·분석 중심 사업은 기술 시험, 검사 및 분석업과 연결됩니다.',
    suggestedRegulatoryFit: 'knowledgeIndustry',
  },
  {
    code: '72921',
    name: '측량업',
    aliases: ['측량', '지적측량', '공간정보측량', '토지측량'],
    reason: '토지, 도로, 수로, 지적 관련 측량 설명은 측량업으로 직접 연결할 수 있습니다.',
    suggestedRegulatoryFit: 'knowledgeIndustry',
  },
  {
    code: '72922',
    name: '제도업',
    aliases: ['제도', '도면작성', '캐드제도', '설계도면', '청사진제도'],
    reason:
      '캐드 도면 작성이나 세밀한 설계 도면 작성 설명은 제도업과 가장 가깝습니다.',
    suggestedRegulatoryFit: 'knowledgeIndustry',
  },
  {
    code: '72923',
    name: '지질 조사․탐사 및 지도 제작업',
    aliases: ['지질조사', '지반조사', '지구물리탐사', '지도제작', '해도제작'],
    reason:
      '지질 조사, 지반 조사, 탐사, 지도 제작 설명은 지질 조사·탐사 및 지도 제작업으로 연결하는 편이 맞습니다.',
    suggestedRegulatoryFit: 'knowledgeIndustry',
  },
  {
    code: '71400',
    name: '시장 조사 및 여론 조사업',
    aliases: ['시장조사', '리서치', '여론조사', '소비자조사', '설문조사'],
    reason: '리서치와 설문조사 설명은 시장 조사 및 여론 조사업과 가장 가깝습니다.',
    suggestedRegulatoryFit: 'knowledgeIndustry',
  },
  {
    code: '71531',
    name: '경영 컨설팅업',
    aliases: [
      '경영컨설팅',
      '경영컨설팅업',
      '경영자문',
      '전략컨설팅',
      '사업컨설팅',
      '기업컨설팅',
      '전략기획자문',
      '조직컨설팅',
      '운영컨설팅',
    ],
    reason:
      '재정·인력·생산·시장관리 또는 전략기획 자문 설명은 경영 컨설팅업으로 먼저 검토하는 편이 맞습니다.',
    suggestedRegulatoryFit: 'knowledgeIndustry',
  },
  {
    code: '73903',
    name: '사업 및 무형 재산권 중개업',
    aliases: [
      '무형재산권중개',
      '특허중개',
      '라이선스중개',
      '기술이전중개',
      '상표권중개',
    ],
    reason:
      '특허, 상표, 기술이전, 라이선스 중개 설명은 사업 및 무형 재산권 중개업으로 먼저 연결하는 편이 정확합니다.',
    suggestedRegulatoryFit: 'knowledgeIndustry',
  },
  {
    code: '73904',
    name: '물품 감정, 계량 및 견본 추출업',
    aliases: ['물품감정', '상품감정', '계량서비스', '견본추출', '샘플추출'],
    reason:
      '물품 감정, 계량, 견본 추출 중심 설명은 해당 5자리 코드로 바로 검토하는 편이 좋습니다.',
    suggestedRegulatoryFit: 'knowledgeIndustry',
  },
  {
    code: '73902',
    name: '번역 및 통역 서비스업',
    aliases: ['번역', '통역', '로컬라이제이션', '현지화'],
    reason: '번역이나 통역 설명은 번역 및 통역 서비스업으로 바로 연결할 수 있습니다.',
    suggestedRegulatoryFit: 'knowledgeIndustry',
  },
  {
    code: '76400',
    name: '무형 재산권 임대업',
    aliases: [
      '무형재산권임대',
      '특허라이선스',
      '상표권라이선스',
      '저작권라이선스',
      'ip라이선스',
    ],
    reason:
      '특허, 상표, 저작권 같은 무형재산권 라이선스 임대 설명은 무형 재산권 임대업으로 연결하는 편이 맞습니다.',
    suggestedRegulatoryFit: 'knowledgeIndustry',
  },
  {
    code: '75992',
    name: '전시, 컨벤션 및 행사 대행업',
    aliases: ['행사대행', '전시대행', '컨벤션', '이벤트대행', '박람회', '행사기획'],
    reason: '행사 기획과 전시 운영 설명은 전시·컨벤션·행사 대행업과 가깝습니다.',
    suggestedRegulatoryFit: 'knowledgeIndustry',
  },
  {
    code: '59120',
    name: '영화, 비디오물 및 방송 프로그램 제작 관련 서비스업',
    aliases: [
      '영상편집',
      '영상후반작업',
      '후반작업',
      '더빙',
      '자막제작',
      '색보정',
      '필름가공',
    ],
    reason:
      '편집, 더빙, 자막, 색보정 같은 후반작업 설명은 제작 관련 서비스업으로 보는 편이 더 정확합니다.',
    suggestedRegulatoryFit: 'knowledgeIndustry',
  },
  {
    code: '59201',
    name: '음악 및 기타 오디오물 출판업',
    aliases: [
      '음악출판',
      '음원출판',
      '오디오물출판',
      '오디오콘텐츠출판',
      '오디오북출판',
    ],
    reason:
      '음원이나 오디오 콘텐츠의 출판 성격 설명은 음악 및 기타 오디오물 출판업으로 연결하는 편이 자연스럽습니다.',
    suggestedRegulatoryFit: 'knowledgeIndustry',
  },
  {
    code: '75991',
    name: '콜센터 및 텔레마케팅 서비스업',
    aliases: ['콜센터', '텔레마케팅', '아웃바운드마케팅', '고객센터운영', '상담센터'],
    reason: '콜센터나 텔레마케팅 운영 설명은 해당 서비스업 코드가 유력합니다.',
    suggestedRegulatoryFit: 'knowledgeIndustry',
  },
  {
    code: '74100',
    name: '사업시설 유지·관리 서비스업',
    aliases: ['시설관리', '유지관리', 'fm', '건물관리', '시설운영'],
    reason: '시설 운영과 유지관리 설명은 사업시설 유지관리 서비스업과 연결됩니다.',
    suggestedRegulatoryFit: 'knowledgeIndustry',
  },
  {
    code: '75320',
    name: '보안 시스템 서비스업',
    aliases: ['보안시스템', '출입통제', 'cctv관제', '물리보안', '보안관제'],
    reason: '보안 시스템 운영 설명은 보안 시스템 서비스업이 더 적합할 수 있습니다.',
    suggestedRegulatoryFit: 'knowledgeIndustry',
  },
  {
    code: '85503',
    name: '온라인 교육학원',
    aliases: ['온라인교육', '온라인강의', '인터넷강의', '원격교육', '온라인학원'],
    reason:
      '온라인 강의, 인터넷 강의, 원격 교육 중심 설명은 온라인 교육학원으로 먼저 검토하는 편이 자연스럽습니다.',
    suggestedRegulatoryFit: 'knowledgeIndustry',
  },
  {
    code: '85640',
    name: '사회교육시설',
    aliases: ['평생교육', '평생교육시설', '사회교육', '성인교육시설'],
    reason:
      '평생교육이나 사회교육시설 설명은 사회교육시설로 연결해 교육서비스업 조건을 함께 보는 편이 좋습니다.',
    suggestedRegulatoryFit: 'knowledgeIndustry',
  },
  {
    code: '85650',
    name: '직원 훈련기관',
    aliases: ['사내교육', '직원교육', '직원연수', '기업교육', '직원훈련'],
    reason:
      '직원 훈련, 기업 연수, 사내 교육 중심 설명은 직원 훈련기관 코드로 먼저 검토할 수 있습니다.',
    suggestedRegulatoryFit: 'knowledgeIndustry',
  },
  {
    code: '85669',
    name: '기타 기술 및 직업 훈련학원',
    aliases: ['직업훈련', '직업훈련원', '기술학원', '자격증학원', '직업교육'],
    reason:
      '기술교육, 직업훈련, 자격 준비 같은 설명은 기타 기술 및 직업 훈련학원과 가장 가깝습니다.',
    suggestedRegulatoryFit: 'knowledgeIndustry',
  },
  {
    code: '85691',
    name: '컴퓨터 학원',
    aliases: ['컴퓨터학원', '코딩학원', '프로그래밍학원', 'it교육', '컴퓨터교육'],
    reason:
      '코딩 교육, 컴퓨터 교육, 프로그래밍 학원 설명은 컴퓨터 학원으로 먼저 연결하는 편이 맞습니다.',
    suggestedRegulatoryFit: 'knowledgeIndustry',
  },
  {
    code: '85631',
    name: '외국어학원',
    aliases: ['외국어학원', '어학원', '영어학원', '일본어학원', '한국어학원'],
    reason:
      '회화나 시험 대비 외국어 교육 설명은 외국어학원으로 연결해 교육서비스업 조건을 함께 검토하는 편이 좋습니다.',
    suggestedRegulatoryFit: 'knowledgeIndustry',
  },
  {
    code: '85699',
    name: '그 외 기타 분류 안된 교육기관',
    aliases: ['사무교육', '경영교육', '실무교육', '비즈니스교육', '직무교육'],
    reason:
      '사무 실무, 경영 교육, 기타 분류되지 않은 직무 교육 설명은 그 외 기타 분류 안된 교육기관과 가깝습니다.',
    suggestedRegulatoryFit: 'knowledgeIndustry',
  },
  {
    code: '68112',
    name: '비주거용 건물 임대업',
    aliases: ['비주거용임대', '사무실임대', '건물임대'],
    reason: '임대업 표현은 조건부 허용 업종일 수 있어 별도 확인이 필요합니다.',
    suggestedRegulatoryFit: 'otherPermittedIndustry',
  },
  {
    code: '64201',
    name: '신탁업 및 집합 투자업',
    aliases: ['신탁', '집합투자'],
    reason: '신탁업은 조건부 허용 항목이라 다른 허용 업종과 함께 봐야 합니다.',
    suggestedRegulatoryFit: 'otherPermittedIndustry',
  },
]

const exactEntryMap = new Map(
  KNOWLEDGE_CENTER_DISCOVERY_ENTRIES.map((entry) => [entry.code, entry]),
)

function unique(values: string[]) {
  return [...new Set(values)]
}

export function normalizeIndustryText(value: string) {
  return value.toLowerCase().replace(/[\s"'`~!@#$%^&*()\-_=+[\]{};:,.<>/?\\|·ㆍ]/g, '')
}

function tokenize(value: string) {
  return unique(
    value
      .toLowerCase()
      .split(/[\s/,:;|()[\]{}]+/)
      .map((token) => token.trim())
      .filter(
        (token) =>
          token.length >= 2 &&
          !STOP_WORDS.has(token) &&
          !/^\d+$/.test(token),
      ),
  )
}

function splitSegment(value: string) {
  return value
    .split(/[/,|;]/)
    .flatMap((part) => part.split(/\s+(?:및|와|과)\s+/))
    .map((part) => part.trim())
    .filter(Boolean)
}

function extractQuerySegments(query: string) {
  const trimmedQuery = query.trim()

  if (!trimmedQuery) {
    return []
  }

  const segments = [trimmedQuery]

  for (const match of trimmedQuery.matchAll(FIELD_LABEL_PATTERN)) {
    const value = match[2]?.trim()

    if (!value) {
      continue
    }

    segments.push(value)
    segments.push(...splitSegment(value))
  }

  return unique(segments.map((segment) => segment.trim()).filter(Boolean))
}

function getCatalogMetadata(code: string) {
  const entry = exactEntryMap.get(code)

  return {
    officialName: entry?.name,
    catalogVerdict: entry?.verdict,
    catalogNote: entry?.note,
  }
}

function buildSuggestion(
  preset: Pick<IndustryDiscoveryPreset, 'code' | 'name' | 'suggestedRegulatoryFit'>,
  reason: string,
  matchKind: IndustrySuggestion['matchKind'],
  source: IndustrySuggestion['source'],
  score: number,
  zoneType: DirectoryZoneType,
): IndustrySuggestion {
  const catalogMetadata = getCatalogMetadata(preset.code)
  const directoryEntry = getMagokCodeDirectoryEntry(preset.code)
  const zoneVerdict = directoryEntry?.zoneVerdicts[zoneType]

  return {
    id: `${source}-${preset.code}`,
    code: preset.code,
    name: catalogMetadata.officialName ?? preset.name,
    reason,
    matchKind,
    source,
    score: score + (zoneVerdict ? getDirectoryVerdictWeight(zoneVerdict.verdict) * 8 : 0),
    suggestedRegulatoryFit: preset.suggestedRegulatoryFit,
    catalogVerdict: catalogMetadata.catalogVerdict,
    catalogNote: catalogMetadata.catalogNote,
    selectedZoneVerdict: zoneVerdict?.verdict,
    recommendationReason: zoneVerdict?.reason,
  }
}

function addSuggestion(
  map: Map<string, IndustrySuggestion>,
  suggestion: IndustrySuggestion,
) {
  const existing = map.get(suggestion.code)

  if (!existing) {
    map.set(suggestion.code, suggestion)
    return
  }

  const nextSuggestion =
    suggestion.score > existing.score ||
    (suggestion.score === existing.score &&
      suggestion.matchKind === 'exact' &&
      existing.matchKind === 'related')
      ? suggestion
      : existing

  map.set(suggestion.code, nextSuggestion)
}

function matchPresetAlias(
  querySegments: string[],
  queryTokens: string[],
  preset: IndustryDiscoveryPreset,
) {
  let bestScore = 0
  let matchedAlias = ''
  let matchKind: IndustrySuggestion['matchKind'] = 'related'

  for (const alias of preset.aliases) {
    const normalizedAlias = normalizeIndustryText(alias)
    const aliasTokens = tokenize(alias)
    const directSegmentMatch = querySegments.some((segment) =>
      segment.includes(normalizedAlias),
    )

    if (directSegmentMatch) {
      const score = 170 + normalizedAlias.length

      if (score > bestScore) {
        bestScore = score
        matchedAlias = alias
        matchKind = 'exact'
      }

      continue
    }

    const tokenHits = aliasTokens.filter((token) =>
      queryTokens.some(
        (queryToken) => queryToken.includes(token) || token.includes(queryToken),
      ),
    ).length

    if (!tokenHits) {
      continue
    }

    const score = tokenHits === aliasTokens.length ? 125 + tokenHits * 10 : 78 + tokenHits * 8

    if (score > bestScore) {
      bestScore = score
      matchedAlias = alias
      matchKind = tokenHits === aliasTokens.length ? 'exact' : 'related'
    }
  }

  if (!bestScore || !matchedAlias) {
    return null
  }

  return {
    matchedAlias,
    score: bestScore,
    matchKind,
  }
}

function matchCatalogName(
  querySegments: string[],
  queryTokens: string[],
  code: string,
  name: string,
) {
  const normalizedName = normalizeIndustryText(name)
  const directSegmentMatch = querySegments.some((segment) =>
    segment.includes(normalizedName),
  )

  if (directSegmentMatch) {
    return {
      reason: `입력한 표현에 \`${name}\`이 직접 포함되어 있어 정확 업종으로 연결했습니다.`,
      score: 155 + normalizedName.length,
      matchKind: 'exact' as const,
    }
  }

  const nameTokens = tokenize(name)
  const tokenHits = nameTokens.filter((token) =>
    queryTokens.some(
      (queryToken) => queryToken.includes(token) || token.includes(queryToken),
    ),
  ).length

  if (!tokenHits) {
    return null
  }

  return {
    reason: `${name}(${code})은 입력한 설명의 핵심어와 가까워 관련 업종으로 추천합니다.`,
    score: 68 + tokenHits * 9,
    matchKind: tokenHits >= Math.max(1, nameTokens.length - 1) ? ('exact' as const) : ('related' as const),
  }
}

function matchDirectoryEntry(
  querySegments: string[],
  queryTokens: string[],
  entry: (typeof MAGOK_CODE_DIRECTORY)[number],
) {
  const normalizedName = normalizeIndustryText(entry.name)
  const normalizedKeywords = entry.searchKeywords.map(normalizeIndustryText)
  const directSegmentMatch =
    querySegments.some((segment) => segment.includes(normalizedName)) ||
    normalizedKeywords.some((keyword) =>
      querySegments.some((segment) => keyword.includes(segment) || segment.includes(keyword)),
    )

  if (directSegmentMatch) {
    return {
      reason: `${entry.name}(${entry.code})은 입력한 설명과 가장 가까운 업종명 또는 분류 키워드에 직접 걸렸습니다.`,
      score: 118 + normalizedName.length,
      matchKind: 'exact' as const,
    }
  }

  const tokenHits = entry.searchKeywords.filter((keyword) =>
    queryTokens.some((queryToken) =>
      normalizeIndustryText(keyword).includes(queryToken) || queryToken.includes(normalizeIndustryText(keyword)),
    ),
  ).length

  if (!tokenHits) {
    return null
  }

  return {
    reason: `${entry.name}(${entry.code})은 입력한 표현과 가까운 관련 업종으로 검토할 수 있습니다.`,
    score: 54 + tokenHits * 7,
    matchKind: tokenHits >= 2 ? ('exact' as const) : ('related' as const),
  }
}

const maxExactSuggestions = 8
const maxRelatedSuggestions = 8

export function discoverIndustrySuggestions(
  query: string,
  zoneType: DirectoryZoneType = 'knowledgeIndustryCenter',
) {
  const trimmedQuery = query.trim()

  if (!trimmedQuery) {
    return []
  }

  const hasBusinessRegistrationLabels = FIELD_LABEL_PATTERN.test(trimmedQuery)
  FIELD_LABEL_PATTERN.lastIndex = 0

  const querySegments = extractQuerySegments(trimmedQuery).map(normalizeIndustryText)
  const queryTokens = tokenize(trimmedQuery)
  const suggestions = new Map<string, IndustrySuggestion>()
  const embeddedCodes = unique(
    (trimmedQuery.match(/\d{5}/g) ?? []).map((code) => normalizeKsicCode(code)),
  )

  for (const code of embeddedCodes) {
    const catalogMetadata = getCatalogMetadata(code)

    if (!catalogMetadata.officialName) {
      continue
    }

    addSuggestion(
      suggestions,
      {
        id: `direct-code-${code}`,
        code,
        name: catalogMetadata.officialName,
        reason: `입력 텍스트에 KSIC 코드 \`${code}\`가 직접 포함되어 있습니다.`,
        matchKind: 'exact',
        source: 'directCode',
        score:
          240 +
          (getMagokCodeDirectoryEntry(code)
            ? getDirectoryVerdictWeight(
                getMagokCodeDirectoryEntry(code)!.zoneVerdicts[zoneType].verdict,
              ) * 8
            : 0),
        catalogVerdict: catalogMetadata.catalogVerdict,
        catalogNote: catalogMetadata.catalogNote,
        selectedZoneVerdict: getMagokCodeDirectoryEntry(code)?.zoneVerdicts[zoneType].verdict,
        recommendationReason: getMagokCodeDirectoryEntry(code)?.zoneVerdicts[zoneType].reason,
      },
    )
  }

  for (const preset of DISCOVERY_PRESETS) {
    const presetMatch = matchPresetAlias(querySegments, queryTokens, preset)

    if (!presetMatch) {
      continue
    }

    const prefix =
      hasBusinessRegistrationLabels && presetMatch.matchKind === 'exact'
        ? '사업자등록증 텍스트의 업종 표현과 가장 가깝습니다.'
        : `입력한 \`${presetMatch.matchedAlias}\` 표현을 기준으로 추천했습니다.`

    addSuggestion(
      suggestions,
      buildSuggestion(
        preset,
        `${prefix} ${preset.reason}`,
        presetMatch.matchKind,
        'preset',
        presetMatch.score,
        zoneType,
      ),
    )
  }

  for (const entry of KNOWLEDGE_CENTER_DISCOVERY_ENTRIES) {
    const catalogMatch = matchCatalogName(
      querySegments,
      queryTokens,
      entry.code,
      entry.name,
    )

    if (!catalogMatch) {
      continue
    }

    addSuggestion(
      suggestions,
      {
        id: `catalog-${entry.code}`,
        code: entry.code,
        name: entry.name,
        reason: catalogMatch.reason,
        matchKind: catalogMatch.matchKind,
        source: 'catalog',
        score:
          catalogMatch.score +
          (getMagokCodeDirectoryEntry(entry.code)
            ? getDirectoryVerdictWeight(
                getMagokCodeDirectoryEntry(entry.code)!.zoneVerdicts[zoneType].verdict,
              ) * 8
            : 0),
        catalogVerdict: entry.verdict,
        catalogNote: entry.note,
        selectedZoneVerdict: getMagokCodeDirectoryEntry(entry.code)?.zoneVerdicts[zoneType].verdict,
        recommendationReason: getMagokCodeDirectoryEntry(entry.code)?.zoneVerdicts[zoneType].reason,
      },
    )
  }

  for (const entry of MAGOK_CODE_DIRECTORY) {
    const directoryMatch = matchDirectoryEntry(querySegments, queryTokens, entry)

    if (!directoryMatch) {
      continue
    }

    addSuggestion(
      suggestions,
      {
        id: `directory-${entry.code}`,
        code: entry.code,
        name: entry.name,
        reason: directoryMatch.reason,
        matchKind: directoryMatch.matchKind,
        source: 'directory',
        score:
          directoryMatch.score +
          getDirectoryVerdictWeight(entry.zoneVerdicts[zoneType].verdict) * 8,
        selectedZoneVerdict: entry.zoneVerdicts[zoneType].verdict,
        recommendationReason: entry.zoneVerdicts[zoneType].reason,
      },
    )
  }

  const orderedSuggestions = [...suggestions.values()].sort((left, right) => {
    if (right.score !== left.score) {
      return right.score - left.score
    }

     if (
      left.selectedZoneVerdict &&
      right.selectedZoneVerdict &&
      left.selectedZoneVerdict !== right.selectedZoneVerdict
    ) {
      return (
        getDirectoryVerdictWeight(right.selectedZoneVerdict) -
        getDirectoryVerdictWeight(left.selectedZoneVerdict)
      )
    }

    if (left.matchKind !== right.matchKind) {
      return left.matchKind === 'exact' ? -1 : 1
    }

    return left.code.localeCompare(right.code)
  })

  const exactMatches = orderedSuggestions
    .filter((suggestion) => suggestion.matchKind === 'exact')
    .slice(0, maxExactSuggestions)
  const relatedSuggestionPool = orderedSuggestions
    .filter((suggestion) => suggestion.matchKind === 'related')
  const relatedMatches = (
    relatedSuggestionPool.filter(
      (suggestion) => suggestion.selectedZoneVerdict !== 'ineligible',
    ).length > 0
      ? relatedSuggestionPool.filter(
          (suggestion) => suggestion.selectedZoneVerdict !== 'ineligible',
        )
      : relatedSuggestionPool
  ).slice(0, maxRelatedSuggestions)

  return [...exactMatches, ...relatedMatches]
}
