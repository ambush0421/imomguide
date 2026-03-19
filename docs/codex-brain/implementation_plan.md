# 입주가능판별기 구현 계획

## 1. 목표

마곡일반산업단지의 입주 가능 여부를 빠르게 예비 판정할 수 있는 웹 기반 판별기를 구축한다. 사용자는 주소, 구역/건물유형, 업종 코드(KSIC), 기업 유형, 예외 조건을 입력하고, 시스템은 입주 가능 여부와 그 근거 조항을 함께 보여준다.

이번 계획은 `C:\projects\magok`가 빈 워크스페이스라는 점을 전제로 한 신규 MVP 설계다.

## 2. 문서 기준과 핵심 규칙

### 2.1 산업집적활성화 및 공장설립에 관한 법률 시행령

근거 문서: `산업집적활성화 및 공장설립에 관한 법률 시행령(대통령령)(제35943호)(20260102).pdf`

- 제6조 제2항~제5항
  - `지식산업`, `정보통신산업`, `자원비축시설`, 그 밖에 대통령령으로 정하는 산업의 범위를 규정한다.
  - 지식산업에는 연구개발업, 건축기술/엔지니어링, 광고업, 디자인업, 교육서비스업 일부, 사업시설 유지관리 서비스업, 콜센터/텔레마케팅, 환경정화 및 복원업 등이 포함된다.
  - 정보통신산업에는 소프트웨어 개발/공급, 시스템 통합, 호스팅 및 관련 서비스, 데이터베이스/온라인 정보제공, 전기통신업이 포함된다.
  - 제5항에는 폐기물 처리, 창고업/물류, 운송업, 산업용기계장비임대업, 부동산임대 및 공급업, 전기업, 창업보육센터, 신탁업 등 추가 허용 산업이 포함된다.
- 제6조 제6항
  - 지원기관은 원칙적으로 거의 모든 사업이 가능하지만 제조업, 주거/숙박/위락 등 일부는 제외된다.
- 제6조 제7항
  - 관리기관이 필요하다고 인정하고 관리권자 승인을 받으면 예외적으로 입주자격을 부여할 수 있다.
- 제36조의4
  - 지식산업센터 입주 대상 사업의 범위를 정한다.
- 제48조의2
  - 관리기관이 입주기준을 공고해야 함을 규정한다.

### 2.2 마곡일반산업단지 관리기본계획

근거 문서: `마곡일반산업단지 관리기본계획 고시문(제2025-593, 25.10.30).pdf`

- 6~8페이지 핵심
  - 마곡 일반산업단지는 `산업시설구역` 입주업종을 별도로 제한한다.
  - 공통 허용 업종에는 연구개발업(`70`), 광고대행업(`7131`), 건축기술/엔지니어링(`721`), 기술시험/검사/분석(`7291`), 전문디자인업(`7320`), 기타전문서비스업(`7160`)이 포함된다.
  - 특화 산업군은 IT, BT, NT, GT, 에너지, 자원순환으로 구성된다.
  - 대학(원) 및 대학(원) 부설연구소는 정책심의위원회 심의·의결을 거쳐 입주 가능하다.
  - 상기 입주업종 외에도 산업 융복합상 필요하다고 판단되면 위원회 심의로 입주 가능 여부를 최종 판단한다.
  - 지식산업센터는 관리기본계획의 기본 입주업종 외에도 시행령 제6조 제2항~제5항 업종을 허용한다.
  - 다만 아래는 예외적으로 제한된다.
    - 제6조 제2항 제9호 `포장 및 충전업`은 불가
    - 제6조 제4항 `자원비축시설`은 불가
    - 다른 허용 업종 없이 `부동산임대 및 공급업`, `신탁업`만 단독 등록한 업체는 불가
    - `호스팅 및 관련 서비스업(63112)`은 위원회 심의 필요
  - 공공기관/공직유관단체는 시행령 제6조상 입주자격 업종을 영위하면서 위원회 승인을 받는 경우 입주 가능하다.
- 10~11페이지 핵심
  - 사업개시 및 공장설립 완료 시 연구시설 비율, 연구개발 인력, 제조시설 비율 등 사후 심사 기준이 있다.
  - 제조시설은 원칙적으로 연구시설 비율을 유지하면서 `20% 이하` 등 추가 조건을 충족해야 한다.

## 3. MVP 범위

### 포함

- 마곡 일반산업단지 전용 판정기
- `산업시설구역`, `지식산업센터` 자동 판정
- 업종 코드 prefix 기반 허용/제한 판정
- 예외 조건 반영
  - 대학/대학부설연구소
  - 공공기관/공직유관단체
  - 벤처기업집적시설
  - 소프트웨어진흥시설
  - 창업보육센터
  - 호스팅업(63112)
  - 부동산임대/공급업 단독 여부
  - 신탁업 단독 여부
  - 포장 및 충전업 여부
  - 자원비축시설 여부
- 결과와 함께 근거 조항/추가 확인사항 출력

### 제외 또는 보류

- `지원시설구역` 자동판정
  - 현재 자료만으로는 지구단위계획 시행지침의 허용업종을 정확히 자동화하기 어렵다.
  - 1차 버전에서는 `추가 자료 필요` 또는 `수동 검토 권장`으로 처리한다.
- 주소만으로 구역을 자동 판별하는 기능
  - 별도의 필지/건물/구역 매핑 데이터가 필요하다.
- 실제 입주계약 신청서 생성
- 관리기관 공고문 크롤링 자동화

## 4. 사용자 시나리오

1. 사용자가 주소를 입력한다.
2. 사용자가 판정 대상 유형을 선택한다.
   - 산업시설구역
   - 지식산업센터
3. 사용자가 업종 코드와 업종명을 입력한다.
4. 사용자가 기업 유형과 예외 조건을 체크한다.
5. 시스템이 즉시 판정 결과를 계산한다.
6. 결과 화면에서 아래 정보를 보여준다.
   - 판정 결과
   - 판단 근거
   - 심의 필요 여부
   - 추가 제출/확인 필요 항목
   - 관련 조항 출처

## 5. 기술 방향

빈 워크스페이스이므로 1차 구현은 아래 스택을 기준으로 진행한다.

- `Vite + React 18 + TypeScript`
- `Tailwind CSS v4`
- `shadcn/ui`
- `Zustand`

선정 이유:

- 빠르게 MVP를 세팅할 수 있다.
- 판정기 특성상 SSR이 반드시 필요하지 않다.
- shadcn/ui를 이용해 입력 폼/상태 카드/탭/아코디언을 빠르게 조합할 수 있다.

## 6. 화면 구성안

### 6.1 메인 화면

- 상단: 서비스 제목, 대상 단지 안내, 문서 기준일 표시
- 좌측 또는 상단 카드: 입력 폼
- 우측 또는 하단 카드: 판정 결과

### 6.2 입력 섹션

- 주소 입력
  - 텍스트 입력
  - 향후 Kakao Maps 주소 검색으로 확장 가능한 형태
- 구역/건물유형 선택
  - 산업시설구역
  - 지식산업센터
  - 지원시설구역(선택 시 자동판정 제한 안내)
- 업종 정보
  - KSIC 코드
  - 업종명
- 기업 속성
  - 일반 기업
  - 대학/대학부설연구소
  - 공공기관/공직유관단체
  - 벤처기업집적시설 입주자
  - 창업보육센터
  - 소프트웨어진흥시설
- 예외 조건
  - 포장 및 충전업 해당
  - 자원비축시설 해당
  - 호스팅 및 관련 서비스업(63112)
  - 부동산임대/공급업만 단독 등록
  - 신탁업만 단독 등록
  - 제조시설 운영 예정

### 6.3 결과 섹션

- 결과 배지
  - 가능
  - 조건부 가능
  - 심의 필요
  - 불가
  - 정보 부족
- 근거 조항 카드
- 이유 목록
- 추가 검토/서류 안내
- 면책성 안내
  - 실제 입주계약 가능 여부는 관리기관 심사/정책심의위원회 판단에 따라 달라질 수 있음

## 7. 상태 처리 원칙

모든 화면과 컴포넌트는 아래 상태를 반드시 가진다.

- 로딩 상태
  - 초기 규칙 로드 중
  - 주소 검색 연동 시 검색 중
- 에러 상태
  - 규칙 데이터 로드 실패
  - 잘못된 입력
- 빈 상태
  - 아직 입력 전
  - 판정 조건이 부족한 경우

## 8. 데이터 모델 초안

```ts
type ZoneType = "industrialFacility" | "knowledgeIndustryCenter" | "supportFacility";

type Verdict =
  | "eligible"
  | "conditional"
  | "reviewRequired"
  | "ineligible"
  | "insufficient";

interface EligibilityInput {
  address: string;
  zoneType: ZoneType;
  ksicCode: string;
  ksicName: string;
  applicantType:
    | "company"
    | "universityLab"
    | "publicInstitution"
    | "publicRelatedOrg"
    | "ventureClusterTenant"
    | "startupIncubator"
    | "softwarePromotionFacility";
  flags: {
    isPackagingAndFilling: boolean;
    isResourceStockpile: boolean;
    isHosting63112: boolean;
    isRealEstateOnly: boolean;
    isTrustOnly: boolean;
    hasManufacturingFacility: boolean;
  };
}

interface LegalBasis {
  source: "enforcementDecree" | "magokPlan";
  citation: string;
  summary: string;
}

interface EligibilityResult {
  verdict: Verdict;
  title: string;
  reasons: string[];
  requiredActions: string[];
  legalBases: LegalBasis[];
}
```

## 9. 규칙 엔진 설계

### 9.1 규칙 데이터

- `magokIndustrialAllowedPrefixes`
  - 공통 허용 코드
  - IT / BT / NT / GT / 에너지 / 자원순환 코드
- `knowledgeCenterExtraRules`
  - 시행령 제6조 제2항~제5항 허용
- `hardBlocks`
  - 포장 및 충전업
  - 자원비축시설
  - 부동산임대/공급업 단독
  - 신탁업 단독
- `reviewRules`
  - 대학/대학부설연구소
  - 호스팅 63112
  - 융복합 업종
  - 공공기관/공직유관단체

### 9.2 판정 순서

1. 필수 입력값 검증
2. 지원시설구역 여부 확인
   - 지원시설구역이면 자동판정 제한 결과 반환
3. 명시적 불가 규칙 우선 적용
4. 산업시설구역 기본 허용 코드 매칭
5. 지식산업센터인 경우 시행령 확장 허용 규칙 적용
6. 심의 필요 규칙 적용
7. 추가 조건(제조시설, 연구시설 비율 안내 등) 부여
8. 최종 결과 생성

## 10. 파일/폴더 초안

```text
src/
  app/
  components/
  features/eligibility/
    components/
    data/
    hooks/
    types.ts
    rules.ts
    evaluator.ts
  store/
  utils/
    format.ts
```

메모:

- 숫자 포맷팅이 필요한 값은 `utils/format.ts`에 모은다.
- 법령 규칙 데이터는 컴포넌트 내부 하드코딩 대신 `features/eligibility/data`로 분리한다.

## 11. 검증 계획

### 단위 테스트

- 허용 업종 판정
- 불가 업종 판정
- 지식산업센터 예외 허용 판정
- 심의 필요 판정
- 입력 부족 상태 판정

### UI 테스트

- 초기 빈 상태 렌더링
- 업종 코드 입력 후 결과 표시
- 지원시설구역 선택 시 제한 안내 표시
- 에러/빈 상태 렌더링

## 12. 리스크와 대응

- 리스크: 워크스페이스가 비어 있어 기존 공용 레이아웃/컴포넌트 규칙을 확인할 수 없음
  - 대응: 신규 MVP 구조를 생성하되, 이후 기존 리포지토리가 제공되면 맞춰 이관 가능하게 모듈화한다.
- 리스크: 지원시설구역은 추가 기준 문서 없이 자동화 정확도가 낮음
  - 대응: 1차 버전에서 자동판정 제외
- 리스크: 주소만으로 정확한 구역 자동판정이 불가
  - 대응: 1차는 사용자가 구역을 선택하고, 후속 단계에서 지번-구역 매핑 데이터 연동
- 리스크: 마곡 관리기본계획의 업종표는 KSIC prefix 매칭 설계가 필요함
  - 대응: 코드 prefix 룰과 예외 룰을 분리해 구현

## 13. 승인 요청 포인트

아래 가정으로 실행 단계에 들어가도 되는지 확인이 필요하다.

1. 이번 구현은 `마곡 일반산업단지 전용 MVP`로 진행
2. `산업시설구역`과 `지식산업센터`를 우선 지원
3. 빈 워크스페이스 기준으로 `Vite + React + TypeScript` 신규 스캐폴드 생성

---

## 2026-03-16 입주가능업종 코드표 작성 계획

### 작업 목표

사용자가 제공한 두 PDF를 근거로 마곡일반산업단지의 입주가능업종 코드를 표로 정리한다.

대상 문서:
- `C:/Users/ll_woo2/Downloads/마곡일반산업단지 관리기본계획 고시문(제2025-593, 25.10.30).pdf`
- `C:/Users/ll_woo2/Downloads/산업집적활성화 및 공장설립에 관한 법률 시행령(대통령령)(제35943호)(20260102).pdf`

### 수행 방법

1. `pypdf`, `pdfplumber`로 고시문과 시행령의 본문 및 표를 추출한다.
2. 고시문 6~7페이지의 `<입주업종>` 표를 기준으로 산업시설구역 기본 입주업종 코드를 정리한다.
3. 시행령 제6조제2항부터 제5항과 고시문 비고를 대조해 지식산업센터 추가 허용 및 제외 조건을 정리한다.
4. 코드, 업종명, 구분, 예외 조건을 문서화한다.

### 검증 계획

- 고시문 텍스트 추출 결과와 표 추출 결과를 상호 비교한다.
- 지식산업센터 예외 허용 조건은 고시문 비고와 시행령 조문을 함께 확인한다.
- 결과는 `docs/codex-brain/magok_permitted_industry_codes.md`에 저장한다.

---

## 2026-03-16 지식산업센터 exact 5자리 판정 로직 보강

### 변경 목표

사용자가 재정리한 `magok_knowledge_industry_center_exact_5digit_codes.md/csv`를 앱 판정 엔진에 직접 반영해, 지식산업센터에서 `5자리 KSIC exact code`를 prefix 규칙보다 우선 적용한다.

### 구현 메모

1. `docs/codex-brain/magok_knowledge_industry_center_exact_5digit_codes.csv`를 `?raw`로 불러와 프런트엔드 번들 안에서 파싱한다.
2. exact 코드 판정은 `자동 허용 / 심의 필요(63112) / 조건부 허용 / 추가 확인 / 불가`로 나눈다.
3. `63111 자료 처리업`은 자동 허용, `63112 호스팅 및 관련 서비스업`은 심의 필요로 정정한다.
4. `49102` 같은 화물운송 exact 허용 코드와 `75994` 같은 exact 불가 코드를 테스트로 고정한다.

### 검증 메모

- `npm run lint`
- `npm run build`
- `npm run test`

---

## 2026-03-17 자연어 업종 탐색형 GUI 확장 계획

### 변경 목표

기존 `KSIC 코드 직접 입력형` 판별기를 `자연어 업종 탐색 + 추천 선택형 GUI`로 확장한다. 사용자는 `저는 광고대행업 해요`처럼 자유롭게 설명하거나 사업자등록증의 `업태/종목` 텍스트를 붙여넣고, 시스템은 해당 업종코드를 먼저 찾아 제안한 뒤 선택 즉시 입주판정을 이어서 실행한다.

### UX 방향

1. 메인 입력 상단에 `업종코드 찾기` 패널을 추가한다.
2. `자유 설명`과 `사업자등록증 텍스트 붙여넣기`를 같은 입력창으로 받는다.
3. 결과는 `정확히 찾은 업종코드`와 `관련 업종 추천`으로 나눠 보여준다.
4. 각 추천 카드에 `왜 이 코드를 추천하는지`, `현재 선택한 구역 기준 예상 판정`, `이 업종으로 판정하기` 액션을 넣는다.
5. 기존 KSIC 수기 입력 폼은 `직접 보정` 용도로 유지한다.

### 구현 메모

1. `지식산업센터 exact 5자리 코드표 + 기존 산업시설 prefix 규칙 + 자주 쓰는 업종 별칭 사전`을 합쳐 탐색 데이터셋을 만든다.
2. `업태`, `종목`, `업종`, `사업내용` 라벨이 포함된 텍스트를 우선 파싱하고, 없으면 전체 문장을 자유검색 대상으로 사용한다.
3. `광고대행업`, `소프트웨어 개발`, `디자인`, `번역`, `행사대행`, `호스팅`, `자료처리`처럼 자주 등장하는 표현에는 대표 exact code를 우선 추천한다.
4. 추천 선택 시 `ksicCode`, `ksicName`, 필요 시 `regulatoryFit`과 일부 예외 플래그를 자동 반영한 뒤 판정 엔진을 바로 실행한다.
5. 추천 결과가 없으면 `관련 업종을 추천해서 등록하시겠어요?` 흐름이 이어지도록 넓은 규칙 기반 fallback 추천을 제공한다.

### 검증 메모

- 자연어 예시: `광고대행업`, `앱 개발`, `호스팅`, `시장조사`
- 사업자등록증 텍스트 예시: `업태: 서비스 / 종목: 광고대행업`
- 선택형 GUI 렌더링 테스트
- `npm run lint`
- `npm run build`
- `npm run test`

---

## 2026-03-17 데스크톱 GUI 패키징 계획

### 변경 목표

기존 웹 GUI를 유지한 채, 같은 화면을 `윈도우 데스크톱 GUI 프로그램`으로도 실행할 수 있게 만든다. 브라우저 없이 실행 가능한 개발 모드와 `portable exe` 산출물을 모두 제공한다.

### 구현 방향

1. 현재 React + Vite 앱은 그대로 두고, 별도 네이티브 UI로 재작성하지 않는다.
2. `Electron` 메인 프로세스로 현재 웹 앱을 감싸 데스크톱 윈도우에서 띄운다.
3. 개발 중에는 Electron이 `127.0.0.1:5180`의 Vite 서버를 바라보게 하고, 배포 시에는 `dist/index.html`을 직접 로드한다.
4. 패키징은 설치기보다 배포가 간단한 `Windows portable exe`를 우선 지원한다.

### 구현 메모

1. `electron/main.mjs`에 BrowserWindow 생성 로직을 추가한다.
2. `package.json`에 `web:dev`, `web:preview`, `desktop:dev`, `desktop:build` 스크립트를 분리한다.
3. `electron-builder` 설정으로 `release/` 아래에 Windows portable 실행 파일을 출력한다.
4. 웹에서 보는 경로는 `npm run dev` 또는 `npm run preview` 기준으로 유지한다.

### 검증 메모

- `npm run lint`
- `npm run test -- --run`
- `npm run build`
- `npm run desktop:build`

---

## 2026-03-17 GUI 단순화 및 직관성 개선 계획

### 변경 목표

현재 입주가능판별기는 기능은 충분하지만 첫 화면에 정보와 선택지가 많아, 사용자가 `무엇부터 해야 하는지` 즉시 이해하기 어렵다. 이번 변경에서는 기능 범위는 유지하고, 첫인상을 `사업 설명 입력 → 추천 업종 선택 → 결과 확인` 3단계 중심으로 재구성한다.

### UX 방향

1. 상단 히어로와 통계 카드 중심 레이아웃을 줄이고, 서비스 목적과 사용 순서만 짧게 보여준다.
2. 메인 화면의 기본 흐름은 `업종 설명 입력`과 `판정 결과` 두 영역만 먼저 보이게 한다.
3. 회사명, 주소, 예외 플래그, 법령 분류 같은 수동 입력은 `직접 수정이 필요할 때만` 여는 보조 섹션으로 내린다.
4. 결과 화면은 `판정`, `짧은 설명`, `다음 확인사항`을 우선 보여주고, 세부 근거는 그 아래에서 확인하도록 한다.
5. 시각적으로는 과한 장식과 보조 카드 수를 줄여 한눈에 핵심 액션이 보이게 한다.

### 구현 메모

1. `src/App.tsx`
   - 복잡한 헤더와 통계 카드를 제거하고 3단계 안내 중심의 간결한 랜딩으로 바꾼다.
   - `업종 탐색`과 `결과`를 상단 핵심 영역으로 두고, `세부 보정`과 `판정 기준`은 하단 보조 영역으로 이동한다.
2. `src/features/eligibility/components/industry-discovery-panel.tsx`
   - 예시 카드와 상태 설명을 줄이고, 한 개의 입력 카드 안에서 바로 이해되는 구조로 바꾼다.
   - 추천 카드도 `코드`, `업종명`, `짧은 이유`, `선택 버튼` 중심으로 단순화한다.
3. `src/features/eligibility/components/eligibility-form.tsx`
   - 기본 접힘형 섹션으로 바꾸고, 사용자가 필요할 때만 세부 조건을 수정하게 한다.
   - 현재 선택된 구역, 신청 주체, 업종코드를 요약해서 먼저 보여준다.
4. `src/features/eligibility/components/result-panel.tsx`
   - 결과의 첫 화면을 더 짧고 명확하게 바꾸고, 근거·사유는 보조 정보로 정리한다.
5. `src/index.css`
   - 배경과 전체 톤을 조금 더 차분하게 조정해 시각적 부담을 낮춘다.

### 검증 메모

- `npm run test -- --run`
- `npm run build`
- 필요 시 `npm run lint`

---

## 2026-03-19 마곡 코드찾기 사이트 전면 리브랜딩 계획

### 변경 목표

현재 워크스페이스에는 `아이맘가이드` 정적 HTML/CSS/JS 소스와, 실제 서비스 진입점인 `React + Vite` 기반 마곡 판별기가 함께 존재한다. 이번 작업에서는 실사용되는 React 앱을 기준으로 사이트 전체를 `마곡 업종코드 찾기 + 입주가능판별` 브랜드 사이트로 전면 개편한다.

### 방향 판단

1. 루트의 `pregnancy.html`, `infant.html`, `style.css`, `main.js` 등은 아이맘가이드 정적 사이트 소스다.
2. 현재 `index.html`은 `src/main.tsx`를 로드하고 있어 실제 웹/데스크톱 진입점은 React 앱이다.
3. 따라서 정적 아이맘가이드를 개별 페이지 단위로 수정하기보다, React 메인 화면을 새 브랜드 사이트 구조로 바꾸는 것이 배포/데스크톱/테스트 관점에서 가장 안전하다.

### UX 방향

1. 첫 화면에서 서비스 정체가 바로 보이도록 `마곡 업종코드 찾기` 메시지를 전면에 둔다.
2. 랜딩 페이지는 `무엇을 하는 사이트인지`, `누가 쓰는지`, `어떻게 쓰는지`, `지금 바로 찾기` 흐름이 이어지게 만든다.
3. 기존 판별기는 별도 도구가 아니라 랜딩 내부 핵심 섹션으로 통합한다.
4. 보정 입력과 법령 기준은 하단 신뢰 섹션으로 내려서 초반 인지 부하를 낮춘다.
5. 아이맘가이드 특유의 프리미엄 랜딩 감성은 유지하되, 컬러·카피·정보구조는 산업단지/법령/B2B 서비스에 맞게 전면 교체한다.

### 구현 메모

1. `src/App.tsx`
   - 단일 도구 화면에서 `랜딩 + 기능 섹션 + 신뢰 섹션 + 푸터` 구조로 확장한다.
   - 히어로, 핵심 가치, 대표 사용 시나리오, 바로 찾기 섹션을 추가한다.
2. `src/index.css`
   - 산업/B2B/법령 서비스에 맞는 색상과 배경 톤을 더 명확히 다듬는다.
3. `src/features/eligibility/components/*`
   - 기존 판별기 컴포넌트는 랜딩에 맞게 섹션형 카드로 배치만 조정하고, 핵심 기능은 유지한다.
4. `index.html`
   - 문서 제목과 메타 문구를 마곡 사이트 기준으로 바꾼다.
5. 테스트
   - 최소한 메인 렌더 테스트 문구를 새 구조에 맞게 갱신한다.

### 검증 메모

- `npm run lint`
- `npm run build`
- `npx vitest run --pool=threads --maxWorkers=1 --reporter=verbose src/App.test.tsx src/features/eligibility/evaluator.test.ts src/features/eligibility/industry-discovery.test.ts`

---

## 2026-03-19 실행물 브랜딩 및 레거시 정리 안내 계획

### 변경 목표

사이트 본문은 이미 `마곡 코드찾기`로 전환됐지만, 실행물과 문서 일부에는 여전히 `입주가능판별기`, `Magok Eligibility Desktop`, Vite 기본 README 같은 잔여 표현이 남아 있다. 이번 변경에서는 실제 배포/실행 경험까지 새 브랜드와 맞도록 정리한다.

### 방향 판단

1. 루트의 `pregnancy.html`, `postpartum.html`, `style.css`, `main.js`는 현재 진입점이 아니므로 삭제하지 않는다.
2. 대신 README에 `React 앱이 실제 서비스 진입점`이고, 아이맘가이드 정적 파일은 현재 비활성 참고 소스임을 분명히 적는다.
3. Electron 창 제목, 패키지 설명, 산출물 이름을 `마곡 코드찾기` 기준으로 맞춘다.
4. favicon도 현재 서비스 성격에 맞는 간단한 아이콘으로 교체한다.

### 구현 메모

1. `electron/main.mjs`
   - 창 제목을 `마곡 코드찾기` 기준으로 수정한다.
2. `package.json`
   - description, productName, artifactName, appId를 새 브랜드에 맞게 정리한다.
3. `public/favicon.svg`
   - 마곡 코드찾기 전용 심볼로 교체한다.
4. `README.md`
   - 프로젝트 소개, 실행 방법, 웹/데스크톱 빌드, 레거시 정적 파일 안내를 실제 상태에 맞게 다시 작성한다.

### 검증 메모

- `npm run lint`
- `npm run build`
- `npx vitest run src/App.test.tsx --reporter=verbose --pool=threads --maxWorkers=1 --testTimeout=5000`
- `npx vitest run src/features/eligibility/evaluator.test.ts src/features/eligibility/industry-discovery.test.ts --reporter=verbose --pool=threads --maxWorkers=1 --testTimeout=5000`
- `npm run desktop:build`

---

## 2026-03-19 도메인 이전 PDCA 계획

### Plan

- `https://imomguide.pages.dev/`에서 `https://loopincode.com/`으로 바꾸는 작업은 단순 주소 변경이 아니라 검색엔진 입장에서는 `사이트 이전(site move)`에 가깝다.
- 따라서 Cloudflare Pages의 커스텀 도메인 연결만으로 끝내지 않고, 검색/광고/분석 설정까지 묶어서 처리해야 한다.

### Do

1. Cloudflare Pages에 `loopincode.com`을 커스텀 도메인으로 연결한다.
2. 기존 `*.pages.dev` 프로덕션 주소는 새 커스텀 도메인으로 리다이렉트한다.
3. 사이트 내부 링크, canonical, sitemap, robots, 구조화데이터 URL, Open Graph URL을 새 도메인 기준으로 갱신한다.
4. Search Console에는 `imomguide.pages.dev`와 `loopincode.com`을 모두 검증하고, 전체 이전이면 Change of Address와 새 sitemap 제출을 함께 진행한다.
5. AdSense는 기존 사이트 이름만 바꾸는 개념이 아니라 `loopincode.com`을 새 사이트로 추가하고 검토를 다시 받는다.
6. GA4는 대개 새 속성을 만들지 않고 기존 웹 데이터 스트림의 URL을 `loopincode.com`으로 수정한다.

### Check

- Search Console에서 새 sitemap 수집 상태, 색인 상태, 리디렉션 반영을 확인한다.
- AdSense에서 새 사이트가 `Ready` 상태로 바뀌는지 확인한다.
- GA4 Realtime에서 새 도메인 기반 페이지뷰가 정상 수집되는지 확인한다.

### Act

- 이전 안정화 전까지는 기존 `pages.dev` 주소를 유지하되, 사용자와 크롤러는 `loopincode.com`으로 보내는 구조를 유지한다.
- 검색 유입과 광고 송출이 안정되면 외부 링크, 프로필, 공유 URL도 새 도메인으로 일괄 전환한다.

---

## 2026-03-19 도메인 이전 코드 반영 계획

### 변경 목표

- 실제 배포 산출물에 `loopincode.com` 기준의 검색/광고/정규화 신호가 포함되도록 정적 SEO 파일과 메타 정보를 정리한다.
- 특히 현재 루트의 `robots.txt`, `sitemap.xml`, `ads.txt`는 Vite 빌드 결과물에 자동 포함되지 않으므로, `public/` 기준으로 재배치한다.

### 구현 메모

1. `index.html`
   - canonical, Open Graph, Twitter 메타를 `https://loopincode.com/` 기준으로 갱신한다.
2. `public/robots.txt`
   - 새 도메인의 sitemap 위치를 선언한다.
3. `public/sitemap.xml`
   - 현재 공개 기준 URL만 담은 최소 sitemap을 만든다.
4. `public/ads.txt`
   - 기존 AdSense 퍼블리셔 ID를 실제 배포 산출물로 복사한다.
5. 루트 정적 파일
   - 혼동 방지를 위해 루트 `robots.txt`, `sitemap.xml`도 같은 기준으로 맞춘다.

### 검증 메모

- `npm run lint`
- `npm run test`
- `npm run build`
- `dist/robots.txt`, `dist/sitemap.xml`, `dist/ads.txt` 생성 여부 확인

---

## 2026-03-19 Cloudflare Pages 배포 및 이전 준비 상태 점검 계획

### 변경 목표

- 코드 수정분을 실제 Cloudflare Pages 프로젝트에 올리고, `loopincode.com` 기준 이전 준비 상태를 운영 관점에서 확인한다.

### 구현 메모

1. 기존 Pages 프로젝트 목록에서 대상 프로젝트를 확인한다.
2. `loopincode.com`이 이미 연결된 프로젝트인지 확인한다.
3. `dist`를 `wrangler pages deploy`로 직접 업로드한다.
4. 새 배포 URL과 커스텀 도메인 응답을 확인한다.
5. `imomguide.pages.dev`가 아직 리다이렉트되지 않는지 여부를 점검한다.

### 검증 메모

- `npx wrangler pages project list`
- `npx wrangler pages deployment list --project-name imomguide`
- `npx wrangler pages deploy dist --project-name imomguide`
- `curl -I https://loopincode.com`
- `curl -I https://imomguide.pages.dev`
