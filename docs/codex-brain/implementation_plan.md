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

---

## 2026-03-19 UI/UX 단순화 및 섹션 구조 업그레이드 계획

### 변경 목표

현재 `마곡 코드찾기`는 기능은 충분하지만, 랜딩 설명 카드와 어두운 유리판 스타일이 많아 처음 방문한 사용자가 `무엇을 먼저 해야 하는지` 파악하는 데 시간이 걸린다. 이번 변경에서는 기능을 줄이지 않고도, 첫 화면을 `한 줄 설명 → 입력 → 결과` 중심으로 다시 배열해 직관성을 높인다.

### 디자인 방향

1. 상단 첫 화면은 서비스 소개보다 `바로 시작`을 우선한다.
2. 섹션은 `소개`, `이용 흐름`, `코드 찾기`, `판정 기준` 4개로 단순화한다.
3. 전체 톤은 짙은 배경 중심에서 `밝은 뉴트럴 + 오렌지 포인트`로 바꿔 정보 밀도를 낮춘다.
4. 각 카드의 역할을 명확히 나누고, 작은 보조 카드 남발을 줄인다.
5. 세부 보정과 법령 근거는 `필요할 때 펼쳐보는 보조 정보`처럼 느껴지도록 위계를 조정한다.

### 구현 메모

1. `src/index.css`
   - 컬러 토큰을 라이트 테마 중심으로 바꾸고 배경 그래디언트를 최소화한다.
   - 본문과 카드 대비를 높여 텍스트 가독성을 우선한다.
2. 공통 UI 컴포넌트
   - `card`, `button`, `badge`, `input`, `textarea`, `select`, `switch`, `async-state`를 새 톤에 맞게 조정한다.
3. `src/App.tsx`
   - 상단을 단순한 브랜드 바와 명확한 히어로로 축소한다.
   - `어떻게 쓰는지`와 `누가 쓰는지`를 짧은 섹션형 카드로 정리한다.
   - 핵심 기능 영역에서 `업종 탐색`과 `결과`가 가장 먼저 보이도록 배치한다.
4. `industry-discovery-panel.tsx`
   - 입력 설명과 예시를 간결하게 줄이고, 추천 카드의 시각적 계층을 단순화한다.
5. `result-panel.tsx`, `eligibility-form.tsx`
   - 결과 요약, 판단 이유, 다음 확인사항의 흐름을 짧게 재정리하고 세부 보정은 더 차분한 보조 섹션으로 만든다.

### 검증 메모

- `npm run lint`
- `npm run test`
- `npm run build`
- 원격 저장소 반영 후 `git push`

---

## 2026-03-19 기준 탭 내부 스크롤 제거 계획

### 변경 목표

`판정 기준` 영역의 탭 콘텐츠는 현재 `ScrollArea`와 `max-h-[28rem]` 조합으로 내부 스크롤 박스가 만들어져 있다. 이 구조는 규칙 카드가 길어질수록 내용이 카드 내부에 갇힌 것처럼 느껴져, 사용자가 모든 규칙을 한 번에 읽기 어렵다. 이번 변경에서는 내부 스크롤을 없애고 페이지 전체 스크롤 흐름에 자연스럽게 이어지도록 바꾼다.

### 구현 메모

1. `src/features/eligibility/components/rulebook-tabs.tsx`
   - `ScrollArea` 제거
   - 각 탭 콘텐츠를 일반 컨테이너로 바꿔 전체 내용이 모두 보이게 구성
2. `src/components/ui/tabs.tsx`
   - `TabsList`와 `TabsTrigger`가 작은 화면에서도 줄바꿈되도록 조정
3. 검증
   - `npm run test -- --run`
   - `npm run build`

---

## 2026-03-19 기준 탭 검색 최적화 및 AdSense 403 정리 계획

### 변경 목표

`판정 기준` 영역은 내부 스크롤 제거 이후에도 규칙 수가 많아 길게 느껴질 수 있다. 이번 단계에서는 긴 목록을 `검색형 필터 + 요약 카드` 구조로 다시 정리해 필요한 규칙만 빠르게 찾게 만든다. 동시에 현재 `loopincode.com`에서 보이는 AdSense `403` 요청은 광고 송출 코드가 검토 단계에서 먼저 호출되면서 생길 가능성이 높으므로, 공식 가이드상 허용되는 `meta + ads.txt` 검토 방식으로 정리해 콘솔 노이즈를 줄인다.

### 구현 메모

1. `src/features/eligibility/components/rulebook-tabs.tsx`
   - 탭별 검색 입력 추가
   - 규칙 수 요약 카드 추가
   - 결과 없음 상태 추가
   - 모바일에서 패딩과 카드 간격 축소
2. `src/components/ui/tabs.tsx`
   - 모바일에서 세로 스택처럼 보이도록 조정
3. `index.html`
   - AdSense 검토용 `meta`는 유지
   - `ads.txt`는 유지
   - 실제 광고 송출 전까지 `adsbygoogle.js` 로더는 제거
4. 검증
   - `npm run lint`
   - `npm run test -- --run`
   - `npm run build`

---

## 2026-03-19 쿠팡 파트너스 최종승인 준비 섹션 추가 계획

### 변경 목표

쿠팡 파트너스 공식 가이드에 따르면 최종승인 단계에서 주로 확인하는 항목은 `활동 페이지 등록`, `활동 스크린샷`, `대가성 문구`다. 현재 사이트에는 이 기준을 방문자가 바로 이해할 수 있는 안내가 없으므로, 승인 준비용 참고 섹션을 추가해 실제 활동 페이지로도 활용하기 쉽게 만든다.

### 구현 메모

1. `src/App.tsx`
   - `쿠팡 파트너스 최종승인 준비` 섹션 추가
   - 등록해야 할 항목 3개를 카드로 요약
   - 권장 대가성 문구를 눈에 띄는 카드로 제공
2. 검증
   - `npm run lint`
   - `npm run test -- --run`
   - `npm run build`

---

## 2026-03-19 쿠팡 최종승인용 푸터 및 제출 문안 보강 계획

### 변경 목표

쿠팡 파트너스 최종승인 관점에서 현재 랜딩은 본문 안내는 갖췄지만, 푸터에 `운영자 정보`, `문의 안내`, `파트너스 안내`가 명확히 정리돼 있지 않다. 이번 단계에서는 실제 승인 제출 화면처럼 보이도록 푸터를 보강하고, 운영자가 그대로 복붙할 수 있는 `활동 페이지 등록 문안`과 `스크린샷 체크리스트`를 별도 문서로 정리한다.

### 구현 메모

1. `src/App.tsx`
   - 기존 얇은 브랜드 푸터를 승인용 정보 카드 구조로 확장
   - `운영자 정보`, `문의 안내`, `쿠팡 파트너스 안내` 3개 카드 추가
   - 대가성 문구 예시를 푸터 하단에도 한 번 더 고정
2. `src/App.test.tsx`
   - 푸터 승인 안내 텍스트가 렌더링되는지 기본 검증 추가
3. `docs/codex-brain/coupang_final_approval_submission_checklist.md`
   - 활동 페이지 등록 문안 초안 작성
   - PC/모바일 스크린샷 체크리스트 작성
   - 제출 전 최종 점검 항목 작성
4. 실배포 점검
   - `loopincode.com` HTML과 번들에서 쿠팡 섹션 문자열이 실제로 응답되는지 확인
   - `imomguide.pages.dev`가 같은 배포본을 응답하는지 점검

### 검증 메모

- `npm run lint`
- `npm run test -- --run`
- `npm run build`
- `Invoke-WebRequest https://loopincode.com`

---

## 2026-03-19 loopincode 전용 소스 정리 계획

### 변경 목표

- 예전 `imomguide` 정적 사이트 제작 흔적을 저장소에서 제거하고, 현재 운영 중인 loopincode용 React/Electron 소스만 남긴다.
- 현재 엔트리(`index.html -> src/main.tsx -> src/App.tsx`, `electron/main.mjs`)에서 사용하지 않는 루트 정적 HTML, 템플릿, 임시 파일, 추적 중인 빌드 산출물을 정리한다.
- 기존 Cloudflare Pages 프로젝트명 `imomguide` 같은 인프라 식별자는 운영 영향이 있으므로 이번 정리에서는 유지한다.

### 구현 메모

1. 삭제 대상
   - 루트의 과거 정적 페이지와 템플릿:
     - `infant.html`, `postpartum.html`, `pregnancy.html`, `preschool.html`, `pricing.html`, `privacy.html`, `roadmap.html`, `toddler.html`, `tools.html`
     - `nav_template.html`, `mobile_nav_template.html`
     - `main.js`, `style.css`
   - 현재 참조되지 않는 임시/보조 파일:
     - `tmp_coupang_guide.pdf`, `tmp_coupang_partners_main.js`
     - `src/assets/hero.png`, `src/assets/react.svg`, `src/assets/vite.svg`
   - 루트 중복 정적 파일:
     - `ads.txt`, `robots.txt`, `sitemap.xml`
   - 추적 중인 빌드 산출물:
     - `dist/` 전체
2. 유지 대상
   - 현재 앱 소스 `src/`, 정적 자산 원본 `public/`, 데스크톱 진입점 `electron/`, 배포 설정 `wrangler.toml`, 법령 참고 파일과 `docs/codex-brain/` 문서
3. 보조 정리
   - `.gitignore`에 `dist`와 임시 파일 패턴을 추가해 다시 추적되지 않게 한다.
   - `README.md`를 현재 구조 기준으로 업데이트해, 예전 정적 사이트 소스가 제거됐음을 반영한다.

### 검증 메모

- `npm run lint`
- `npm run test`
- `npm run build`

---

## 2026-03-19 지식산업센터 기본값 조정 계획

### 변경 목표

- 첫 방문 사용자가 세부 보정 섹션을 열지 않아도 현재 판정 기본 구역이 `지식산업센터`임을 바로 보게 한다.
- `입력 초기화`를 눌렀을 때도 같은 기본값으로 돌아오게 유지한다.

### 구현 메모

1. `src/store/eligibility-store.ts`
   - `defaultInput.zoneType` 기본값을 `knowledgeIndustryCenter`로 변경한다.
2. `src/App.test.tsx`
   - 초기 렌더링 시 `지식산업센터`가 보이는지 검증을 추가한다.
3. 문서
   - `task.md`, `walkthrough.md`에 기본값 변경과 검증 결과를 기록한다.

### 검증 메모

- `npm run lint`
- `npm run test -- --run`
- `npm run build`

---

## 2026-03-19 쿠팡 사이드 배너 다이나믹 배너 전환 계획

### 변경 목표

- 기존 정적 160x600 이미지 배너를 사용자 제공 `PartnersCoupang.G` 다이나믹 배너 태그 기준으로 교체한다.
- 좌우 고정 노출 위치는 유지하되, 스크립트는 한 번만 로드하고 각 배너 영역에서 안전하게 재사용한다.

### 구현 메모

1. `src/components/coupang-dynamic-banner.tsx`
   - 쿠팡 `g.js`를 한 번만 로드하는 헬퍼와 배너 영역 컴포넌트를 추가한다.
   - 배너 설정값은 `id=973794`, `template=carousel`, `trackingCode=AF7474453`, `160x600` 기준으로 실행한다.
2. `src/App.tsx`
   - 좌우 고정 배너를 정적 이미지 링크 대신 다이나믹 배너 컴포넌트로 교체한다.
3. `src/App.test.tsx`
   - 외부 스크립트 실행 여부와 무관하게 다이나믹 배너 래퍼 2개가 렌더링되는지 검증한다.
4. 문서
   - `task.md`, `walkthrough.md`에 교체 배경과 검증 결과를 기록한다.

### 검증 메모

- `npm run lint`
- `npm run test -- --run`
- `npm run build`

---

## 2026-03-19 쿠팡 추천 위젯 3종 배치 계획

### 변경 목표

- 본문 `추천 상품` 영역의 단일 iframe 위젯을 사용자 제공 3개 iframe 위젯으로 교체한다.
- 모바일과 데스크톱 모두에서 답답하지 않도록 카드형 3종 위젯 레이아웃으로 정리한다.

### 구현 메모

1. `src/App.tsx`
   - 기존 단일 `affiliateWidget`을 3개 위젯 배열로 교체한다.
   - `추천 위젯 3종` 카드 안에 반응형 그리드로 배치한다.
2. `src/App.test.tsx`
   - 새 제목과 3개 iframe title이 렌더링되는지 검증한다.
3. 문서
   - `task.md`, `walkthrough.md`에 위젯 교체와 검증 결과를 기록한다.

### 검증 메모

- `npm run lint`
- `npm run test -- --run`
- `npm run build`

---

## 2026-03-19 쿠팡 사이드 배너 여백 재배치 계획

### 변경 목표

- 다이나믹 사이드 배너가 본문 위에 겹치거나 흰 박스처럼 보이지 않게, 콘텐츠 좌우의 빈 여백에 직접 붙여 보이도록 재배치한다.
- 충분한 가로폭이 있을 때만 노출되게 해 레이아웃 충돌을 줄인다.

### 구현 메모

1. `src/components/coupang-dynamic-banner.tsx`
   - 배너 래퍼의 배경, 보더, 그림자, overflow를 제거해 광고가 잘리지 않게 한다.
   - 표시 조건을 `min-[1560px]` 이상으로 높인다.
2. `src/App.tsx`
   - 좌우 배너 위치를 `left/right-4` 대신 `max-width 1180px` 본문 기준 `calc()` 위치로 조정한다.
3. 문서
   - `task.md`, `walkthrough.md`에 재배치 이유와 검증 결과를 기록한다.

### 검증 메모

- `npm run lint`
- `npm run test -- --run`
- `npm run build`

---

## 2026-03-19 업종 누락 재점검 및 상단 섹션 높이 정렬 계획

### 변경 목표

- 현재 지식산업센터 업종 검색기가 리뷰표 기준으로 놓친 exact 코드나 범위형 대표 코드가 남아 있는지 다시 확인한다.
- 상단 첫 섹션에서 왼쪽 히어로 카드와 오른쪽 안내 카드의 높이를 데스크톱 기준으로 맞춰, 이미지 추가 이후에도 시각 균형이 무너지지 않게 한다.

### 구현 메모

1. 데이터 재점검
   - `src/features/eligibility/data/knowledge-industry-review-table.ts`의 단일 5자리 코드와 `src/features/eligibility/data/industry-discovery.ts` preset 코드를 재대조한다.
   - `58`, `70`, `72`, `85` 범위형 업종에서 현재 대표 검색어로 쓰는 샘플 코드도 함께 재대조한다.
   - 구조적 누락이 없으면 결과를 작업 문서와 최종 보고에 명시하고, 남는 리스크는 자유어 동의어의 장기 꼬리 구간으로 한정해 적는다.
2. 레이아웃 수정
   - `src/App.tsx` 상단 히어로 섹션의 데스크톱 grid 정렬을 `stretch` 기준으로 바꾼다.
   - 왼쪽 히어로 카드와 오른쪽 안내 카드 내부를 `h-full` + `flex-col` 구조로 정리해 카드 외곽 높이가 맞도록 조정한다.
   - 오른쪽 카드 하단 배지 영역은 `mt-auto`로 아래에 고정해, 내용이 조금 늘어나도 카드 균형이 유지되게 만든다.
3. 검증
   - `npm run lint`
   - `npm run test`
   - `npm run build`
   - `npx wrangler pages deploy dist --project-name imomguide`
   - 운영 번들이 새 CSS/JS를 가리키는지 확인한다.

---

## 2026-03-19 AdSense 스크립트 및 좌우 고정 배너 반영 계획

### 변경 목표

- 현재 빠져 있는 AdSense `pagead2.googlesyndication.com` 스크립트를 `head`에 추가한다.
- 초대형 화면에서는 쿠팡 160x600 배너를 좌우에 고정 배치해 스크롤을 내려도 따라오게 만든다.
- 메인 콘텐츠 침범을 줄이기 위해 작은 화면에서는 배너를 숨긴다.

### 구현 메모

1. `index.html`
   - `google-adsense-account` meta 아래에 AdSense async script를 1회 추가한다.
2. `src/App.tsx`
   - 좌우 고정 배너용 상수를 추가한다.
   - `2xl` 이상에서만 보이는 fixed anchor 2개를 렌더링한다.
   - 기존 하단 `추천 상품` 섹션은 유지한다.
3. `src/App.test.tsx`
   - 사이드 배너 링크가 2개 렌더링되는지 확인한다.
4. 배포
   - 원격 저장소에 같은 변경을 반영한 뒤 `main`까지 푸시하고 `loopincode.com` HTML에서 script/meta/ads.txt를 다시 확인한다.

### 검증 메모

- `npm run lint`
- `npm run test -- --run`
- `npm run build`
- `Invoke-WebRequest https://loopincode.com`
- `Invoke-WebRequest https://loopincode.com/ads.txt`
- `Invoke-WebRequest https://imomguide.pages.dev`

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

---

## 2026-03-19 GitHub 원격 저장소 교체 및 Git 배포 안정화 계획

### 변경 목표

- `https://github.com/ambush0421/imomguide`의 `main`을 현재 `마곡 코드찾기` 프로젝트 기준으로 교체한다.
- Cloudflare Pages의 기존 Git 연동이 유지되더라도 새 저장소 구조로 Production 배포가 가능하도록 맞춘다.

### 구현 메모

1. 원격 저장소를 별도 작업 디렉터리에 클론한다.
2. 현재 로컬 프로젝트에서 배포에 필요한 소스와 설정만 선별해 원격 작업본에 복사한다.
3. 원격 작업본에서 `npm ci`, `npm run lint`, `npm run test`, `npm run build`를 다시 검증한다.
4. `codex/magok-site-replace` 브랜치로 먼저 푸시해 Preview 배포 상태를 본다.
5. Preview 실패 시 현재 Pages 프로젝트가 무빌드 구조라는 점을 감안해 prebuilt `dist/`를 함께 추적한다.
6. Preview가 `Active`가 되면 같은 커밋을 `main`에 반영한다.

### 검증 메모

- `git ls-remote --heads https://github.com/ambush0421/imomguide.git`
- `git clone --depth 1 https://github.com/ambush0421/imomguide.git`
- 원격 작업본에서 `npm ci`
- 원격 작업본에서 `npm run lint`
- 원격 작업본에서 `npm run test`
- 원격 작업본에서 `npm run build`
- `git push origin codex/magok-site-replace`
- `npx wrangler pages deployment list --project-name imomguide`
- `git push origin codex/magok-site-replace:main`

---

## 2026-03-19 AdSense 사이트 검토 코드 반영 계획

### 변경 목표

- `loopincode.com`이 AdSense 사이트 검토 시 더 명확하게 식별되도록 `head`에 AdSense 계정 신호를 추가한다.
- 기존 AdSense 계정의 publisher ID를 유지한 채, 현재 사이트에서 필요한 태그만 보강한다.

### 구현 메모

1. `index.html`
   - `<meta name="google-adsense-account" content="ca-pub-2916041253392911">` 추가
   - AdSense script snippet 추가
2. `public/ads.txt`
   - 기존 `google.com, pub-2916041253392911, DIRECT, f08c47fec0942fa0` 유지
3. GitHub 원격
   - 동일 변경을 원격 저장소 작업본과 `main`에 반영

### 검증 메모

- `npm run build`
- `npm run test`
- `Invoke-WebRequest https://loopincode.com`로 메타/script 포함 여부 확인

---

## 2026-03-19 지식산업센터 입주검토용 표 및 CSV/사이트 반영 계획

### 변경 목표

- 시행령 제6조제2항 1호부터 27호까지를 `입주검토용 표` 형태로 다시 정리해, 코드가 있는 항목과 기관요건으로 판단해야 하는 항목을 한눈에 구분할 수 있게 한다.
- 기존 `exact 5자리` CSV에는 누락되기 쉬운 `연구소`, `기관·단체`, `이러닝`, `관리기관 인정 산업` 같은 비정형 판정 항목을 보강한다.
- 사이트 기준 탭에도 같은 검토 표를 노출해 사용자가 화면에서 바로 확인할 수 있게 한다.

### 구현 메모

1. `docs/codex-brain/magok_knowledge_industry_center_allowed_codes.md`
   - 시행령 제6조제2항 1호~27호 기준의 `입주검토용 표`를 추가한다.
   - 각 행에는 `호`, `시행령 업종`, `현재 KSIC 대응`, `자동판정 가능 여부`, `실무 확인사항`을 적는다.
2. `docs/codex-brain/magok_knowledge_industry_center_exact_5digit_codes.csv`
   - 헤더를 사람이 바로 읽기 쉬운 `입주검토용` 표현으로 정리한다.
   - 기존 exact 5자리 코드 행은 유지하되, `코드만으로 확정 불가` 행에 `고등교육법상 연구소`, `기초연구법상 기관·단체`, `이러닝업`, `7390 중 관리기관 인정 산업`을 보강한다.
3. `src/features/eligibility/data`
   - 사이트에 노출할 `시행령 제6조제2항 1~27호 입주검토용 표` 데이터를 추가한다.
4. `src/features/eligibility/components/rulebook-tabs.tsx`
   - 지식산업센터 탭에 검색 가능한 `입주검토용 표` 섹션을 추가한다.
   - 작은 화면에서도 읽기 쉽도록 카드형 또는 가로 스크롤 가능한 표 구조로 구현한다.

### 검증 메모

- `npm run lint`
- `npm run test`
- `npm run build`
- 사이트 기준 탭에서 `입주검토용 표`와 CSV 기반 기존 판정이 함께 보이는지 확인

---

## 2026-03-19 레퍼런스 PDF 최종 반영 및 업종코드 분석기 완료 계획

### 변경 목표

- 사용자가 추가한 `마곡 관리기본계획 고시문`, `시행령`, `KSIC 11차 해설서`를 다시 기준 문서로 삼아 업종코드 분석기의 누락 항목을 최종 보강한다.
- 문서에만 적혀 있고 실제 엔진에는 덜 반영돼 있던 `연구소(2호)`, `기관·단체(3호)`, `이러닝업(26호)`, `관리기관 인정 업종(27호)` 흐름을 판정 로직과 폼 선택지에 연결한다.
- `73905`, `73909`처럼 관리기관 인정 산업으로 봐야 하는 세세분류도 direct code 입력 시 보수적으로 안내되도록 맞춘다.

### 구현 메모

1. `docs/codex-brain/magok_knowledge_industry_center_exact_5digit_codes.csv/.md`
   - `73905`, `73909`를 `추가 확인` 행으로 명시해 exact code 기반 분석기가 직접 읽을 수 있게 한다.
2. `src/features/eligibility/data/knowledge-center-exact-codes.ts`
   - CSV의 `코드만으로 확정 불가` 행을 파싱해 prefix 기반 불확실 판정에 재사용한다.
3. `src/features/eligibility/types.ts`, `src/features/eligibility/components/eligibility-form.tsx`
   - 수동 법령 분류 선택지에 `2호`, `3호`, `26호`, `27호` 항목을 추가한다.
4. `src/features/eligibility/evaluator.ts`
   - 위 선택지를 실제 결과에 반영하고, `관리기관 인정` 항목은 자동 허용이 아니라 `추가 확인`으로 보수적으로 안내한다.
5. `src/features/eligibility/evaluator.test.ts`
   - `73905`, `이러닝업`, `관리기관 인정 업종` 시나리오를 테스트로 고정한다.
6. 배포
   - `wrangler pages deploy`로 새 번들을 다시 올리고 `loopincode.com`이 같은 번들을 가리키는지 확인한다.

### 검증 메모

- `npm run lint`
- `npm run test`
- `npm run build`
- `Invoke-WebRequest https://loopincode.com`
- `Invoke-WebRequest https://<pages-dev-url>`

---

## 2026-03-19 업종코드 상세 해설 화면 반영 계획

### 변경 목표

- 사용자가 선택한 업종코드가 화면에서 바로 어떤 조문과 규칙에 연결되는지 확인할 수 있게 한다.
- 결과 패널 안에서 `입력 코드`, `연결 조문`, `현재 KSIC 대응`, `판정 기준`, `실무 메모`를 한 번에 보여준다.

### 구현 메모

1. `src/features/eligibility/data/screen-insights.ts`
   - 결과 화면 전용 인사이트 헬퍼를 만든다.
   - `exact 5자리`, `코드만으로 확정 불가`, `수동 법령 분류`, `산업시설구역 기본업종`, `지식산업센터 특례`를 한 객체로 합친다.
2. `src/features/eligibility/components/result-panel.tsx`
   - `업종코드 상세 해설` 카드를 추가한다.
   - 사용자가 선택한 코드의 조문 연결과 실무 메모를 카드 형태로 바로 보이게 한다.
3. 테스트
   - 관리기관 인정 검토 코드(`73905`)를 예시로 상세 해설 카드가 실제 렌더링되는지 UI 테스트를 추가한다.
4. 배포
   - 새 번들을 다시 배포하고 `loopincode.com`이 동일 번들을 가리키는지 확인한다.

### 검증 메모

- `npm run lint`
- `npm run test`
- `npm run build`
- `Invoke-WebRequest https://loopincode.com`
- 번들 안에 `업종코드 상세 해설` 문자열 포함 여부 확인

---

## 2026-03-19 블루 테마 UI/UX 개편 계획

### 변경 목표

- 현재 주황 계열 브랜드 톤을 푸른 계열로 전환해 더 차분하고 신뢰감 있는 화면으로 정리한다.
- 단순 포인트 컬러 변경이 아니라, 배경 그라데이션, 정보 카드, hover 상태, 아이콘 배경까지 함께 맞춰 전체 인상을 통일한다.

### 구현 메모

1. `src/index.css`
   - 전역 색 토큰(`--background`, `--accent`, `--ring` 등)을 블루 계열로 조정한다.
   - body 배경 그라데이션과 selection 색도 함께 바꾼다.
2. 공용 UI 컴포넌트
   - `badge.tsx`, `button.tsx`, `select.tsx`, `switch.tsx`, `async-state.tsx`의 브랜드 관련 색을 새 토큰에 맞춘다.
3. 화면 컴포넌트
   - `App.tsx`, `eligibility-form.tsx`, `industry-discovery-panel.tsx`, `result-panel.tsx`, `rulebook-tabs.tsx`에서 남아 있는 웜톤 카드와 hover 배경을 블루 계열로 정리한다.
   - 상태 의미가 있는 `warning/danger`는 의미 전달을 위해 유지하고, 브랜드 포인트 색만 블루로 전환한다.
4. 배포
   - 새 CSS 번들을 다시 배포하고 운영 도메인이 같은 파일을 가리키는지 확인한다.

### 검증 메모

- `npm run lint`
- `npm run test`
- `npm run build`
- `Invoke-WebRequest https://loopincode.com`
- 운영 CSS 번들 안에 `#2b6dff`, `#eef4ff` 포함 여부 확인

---

## 2026-03-19 단계형 위저드 전환 계획

### 변경 목표

- `finder` 영역을 `1단계 업종 찾기 → 2단계 조건 보정 → 3단계 결과 확인` 흐름의 단일 위저드로 재구성한다.
- 기존 별도 섹션이던 `세부 조건 직접 수정`을 2단계 안으로 흡수해, 업종 선택 뒤 필요한 경우에만 조건을 만지도록 UX를 단순화한다.
- 참고 섹션인 `최종승인 준비`, `판정 기준`, 푸터는 현재 위치를 유지해 메인 흐름과 참고 정보를 분리한다.

### 구현 메모

1. `src/store/eligibility-store.ts`
   - `currentStep: 'discover' | 'adjust' | 'result'`를 추가한다.
   - `applyIndustrySuggestion()`은 자동 판정 대신 `ksicCode`, `ksicName`, `regulatoryFit`만 반영하고 2단계로 이동한다.
   - `evaluate()`는 성공 시 3단계로 이동하게 바꾼다.
   - `setField()`와 `setFlag()`는 2단계 또는 3단계에서 수정되면 이전 결과를 `idle + null`로 무효화한다.
2. `src/App.tsx`
   - `finder`를 단일 위저드 컨테이너로 바꾸고, 상단에 3단계 스텝바를 추가한다.
   - 1단계에서는 `IndustryDiscoveryPanel`, 2단계에서는 `EligibilityForm`, 3단계에서는 `ResultPanel`만 보이도록 상태 기반으로 전환한다.
   - `직접 입력으로 계속`, `이전 단계`, `조건 다시 수정`, `처음 단계로 돌아가기` 액션을 단계 흐름에 맞게 배치한다.
3. `src/features/eligibility/components`
   - `industry-discovery-panel.tsx`에 `직접 입력으로 계속` 버튼을 추가한다.
   - `eligibility-form.tsx`는 단계 카드 안에서 재사용할 수 있도록 `이전 단계`, 커스텀 액션 라벨, 기본 펼침 상태를 받는다.
   - `result-panel.tsx`는 전체 폭 단계 화면에서 쓸 수 있도록 `조건 다시 수정`, `sticky` 옵션, 단계 라벨을 받는다.
4. 테스트
   - `src/App.test.tsx`를 위저드 플로우 기준으로 다시 작성한다.
   - `src/store/eligibility-store.test.ts`를 추가해 추천 선택, 결과 이동, stale result 무효화 규칙을 고정한다.
   - `src/setupTests.ts`에 cleanup을 명시해 테스트 간 DOM 중첩을 막는다.

### 검증 메모

- `npm run lint`
- `npm run test`
- `npm run build`
- `npx wrangler pages deploy dist --project-name imomguide`
- `Invoke-WebRequest https://24046f1c.imomguide.pages.dev`
- `Invoke-WebRequest https://loopincode.com`

---

## 2026-03-19 경영컨설팅 검색 누락 보정 계획

### 변경 목표

- 사용자가 `경영컨설팅`, `경영컨설팅업`, `전략기획 자문`처럼 입력했을 때 추천 결과에 `71531 경영 컨설팅업`이 실제로 노출되게 한다.
- 검색 추천뿐 아니라, 코드 직접 입력 시에도 `지식산업센터 자동 허용` 판정과 연결되도록 exact 5자리 데이터셋을 보강한다.

### 구현 메모

1. `docs/codex-brain/magok_knowledge_industry_center_exact_5digit_codes.csv`
   - `자동 허용` 구간에 `71531, 경영 컨설팅업` 행을 추가한다.
   - 메모에는 시행령 제6조제2항제11호 취지에 맞게 `재정·인력·생산·시장관리·전략기획 자문` 성격 확인 필요를 적는다.
2. `src/features/eligibility/data/industry-discovery.ts`
   - `경영컨설팅`, `경영컨설팅업`, `경영자문`, `전략컨설팅`, `전략기획자문` 등 별칭을 가진 preset을 추가한다.
   - `suggestedRegulatoryFit`은 `knowledgeIndustry`로 연결한다.
3. 테스트
   - `src/features/eligibility/industry-discovery.test.ts`에 자연어 검색 테스트를 추가한다.
   - `src/features/eligibility/evaluator.test.ts`에 `71531` 지식산업센터 자동 허용 판정 테스트를 추가한다.

### 검증 메모

- `npm run lint`
- `npm run test`
- `npm run build`
- `npx wrangler pages deploy dist --project-name imomguide`
- 운영 페이지에서 `index-Oex0_FWl.js` 반영 여부 확인

---

## 2026-03-19 실무 검색어 누락 전수 점검 계획

### 변경 목표

- `경영컨설팅`처럼 공식 KSIC 명칭과 사용자의 실제 검색 표현이 달라서 추천이 비는 항목을 전수 점검한다.
- 지식산업 1~27호 중 `단일 exact 코드`에 해당하는 항목은 최소한 검색 사전에서 모두 한 번은 걸리게 보강한다.

### 구현 메모

1. 대조 기준
   - `src/features/eligibility/data/knowledge-industry-review-table.ts`의 단일 exact 코드
   - `docs/codex-brain/magok_knowledge_industry_center_exact_5digit_codes.csv`
   - `src/features/eligibility/data/industry-discovery.ts`
2. 점검 포인트
   - CSV에는 있는데 검색 preset이 없는 exact 코드 식별
   - 공백, 점, 쉼표, `및` 같은 공식 명칭 차이 때문에 실무 검색어로는 안 잡히는 항목 우선 보강
3. 예상 보강 대상
   - `71391 옥외 광고업`
   - `75994 포장 및 충전업`
   - `59120 영화, 비디오물 및 방송 프로그램 제작 관련 서비스업`
   - `59201 음악 및 기타 오디오물 출판업`
   - `73903 사업 및 무형 재산권 중개업`
   - `73904 물품 감정, 계량 및 견본 추출업`
   - `76400 무형 재산권 임대업`
4. 테스트
   - `industry-discovery.test.ts`에 위 항목들의 자연어/실무어 입력 케이스를 추가한다.
   - 대조 결과 기준으로 지식산업 단일 exact 코드 누락이 남지 않았는지 재확인한다.

### 검증 메모

- `npm run lint`
- `npm run test`
- `npm run build`
- 단일 exact 코드 검색 사전 누락 0건 확인

---

## 2026-03-19 범위형 업종 실무 검색어 확장 계획

### 변경 목표

- `58 출판업`, `70 연구개발업`, `72 건축기술·엔지니어링 및 기타 과학기술 서비스업`, `85 교육서비스업`처럼 코드 범위로 허용되는 업종이 실무 검색어에서도 잘 걸리게 만든다.
- 특히 교육서비스업처럼 `코드만으로 확정 불가`인 범위는 검색 후에도 전부 `정보 부족`으로 끝나지 않도록, 수동 법령 분류와 결합되면 `조건부 검토` 흐름으로 이어지게 보완한다.

### 구현 메모

1. 대표 exact 코드 선정
   - 로컬 KSIC 해설 텍스트 `ksic11.txt`를 기준으로 범위형 업종 내부 대표 코드를 다시 확인한다.
   - 범위별 대표 코드 예:
     - `70`: `70119`, `70129`, `70130`, `70201`, `70209`
     - `72`: `72111`, `72112`, `72121`, `72122`, `72911`, `72921`, `72922`, `72923`
     - `58`: `58111`, `58112`, `58113`, `58121`, `58122`, `58123`, `58190`, `58211`, `58212`, `58219`
     - `85`: `85503`, `85640`, `85650`, `85669`, `85691`, `85631`, `85699`
2. `src/features/eligibility/data/industry-discovery.ts`
   - 대표 코드별로 사용자가 실제로 치는 검색어 별칭을 추가한다.
   - 예:
     - `기업부설연구소`, `연구개발센터`
     - `건축설계`, `도시계획`, `환경영향평가`, `지질조사`
     - `출판사`, `전자책출판`, `웹툰출판`, `모바일게임개발`
     - `온라인교육`, `직업훈련원`, `코딩학원`, `사내교육`
3. `src/features/eligibility/evaluator.ts`
   - `codeOnlyUncertain` 분기에서 사용자가 `지식산업/정보통신산업/기타 허용업종` 수동 분류를 같이 선택한 경우 `insufficient` 대신 `conditional`로 안내한다.
   - 교육서비스 계열 검색 후 2단계에서 수동 분류를 보정했을 때 결과가 더 실무적으로 이어지게 한다.
4. 테스트
   - `industry-discovery.test.ts`에 범위형 업종 대표 검색어 케이스를 대량 추가한다.
   - `evaluator.test.ts`에 교육서비스 코드 + 수동 법령 분류 조합의 조건부 판정 테스트를 추가한다.

### 검증 메모

- `npm run lint`
- `npm run test`
- `npm run build`
- `npx wrangler pages deploy dist --project-name imomguide`
- 운영 페이지에서 `index-BzUj6zdl.js` 반영 여부 확인

---

## 2026-03-19 쿠팡 실제 제휴 링크 반영 계획

### 변경 목표

- 승인용 제휴영역의 플레이스홀더를 실제 쿠팡 파트너스 링크, 배너, iframe 위젯으로 교체한다.
- 같은 화면 안에 `대가성 문구`, `문의 이메일`, `실제 제휴 요소`가 함께 보여 최종승인 캡처용으로 바로 사용할 수 있게 만든다.
- GitHub 원격과 Cloudflare Pages 운영 도메인까지 같은 결과를 보도록 마감한다.

### 구현 메모

1. `src/App.tsx`
   - 비활성 플레이스홀더 카드 대신 실제 링크 2개, 배너 1개, iframe 위젯 1개를 렌더링한다.
   - 각 링크는 새 탭으로 열고 `nofollow sponsored noopener`를 붙여 제휴 링크 성격을 분명히 한다.
   - 대가성 문구와 문의 이메일이 같은 섹션 안에서 계속 보이도록 유지한다.
2. `src/App.test.tsx`
   - 실제 링크 href, 배너 alt, iframe title이 렌더링되는지 검증한다.
3. 문서
   - `coupang_final_approval_submission_checklist.md`에 현재 실제 반영 요소를 명시한다.
   - `task.md`, `walkthrough.md`에 반영 범위와 검증 결과를 남긴다.
4. 배포
   - 원격 저장소에 커밋/푸시 후 `wrangler pages deploy dist --project-name imomguide`로 운영 도메인에 즉시 반영한다.

### 검증 메모

- `npm run lint`
- `npm run test -- --run`
- `npm run build`
- `Invoke-WebRequest https://loopincode.com`
- 운영 JS 번들 안에 실제 쿠팡 링크 문자열 포함 여부 확인

---

## 2026-03-19 실서비스형 쿠팡 노출 축소 계획

### 변경 목표

- 메인 페이지에서 `승인용 설명`, `캡처 리허설`, `최종승인 준비` 같은 내부 운영 UI를 제거한다.
- 실제 사용자에게는 `작은 추천 상품 섹션 + 짧은 대가성 고지 + 문의 정보`만 남겨 메인 서비스 흐름을 해치지 않게 한다.
- 승인을 위한 문서와 운영 메모는 코드가 아니라 문서 아티팩트 쪽에 유지한다.

### 구현 메모

1. `src/App.tsx`
   - `최종승인 준비`, `권장 문구`, `승인용 제휴영역`의 과한 설명 블록을 제거한다.
   - 실제 제휴 노출은 `추천 상품` 섹션으로 축소하고, 버튼형 링크 2개와 작은 iframe 위젯, 짧은 고지문만 남긴다.
   - 푸터는 운영/문의/활동 페이지 정도의 간결한 정보만 남긴다.
2. `src/App.test.tsx`
   - 승인용 문구 대신 축소된 `추천 상품` 섹션과 제휴 링크, 위젯, 문의 문구를 기준으로 검증한다.
3. 문서
   - `task.md`, `walkthrough.md`에 실서비스형 축소 의도와 검증 결과를 추가한다.
4. 배포
   - 원격 저장소에도 동일 반영 후 lint/test/build, Git 푸시, Pages 배포 상태를 다시 확인한다.

### 검증 메모

- `npm run lint`
- `npm run test -- --run`
- `npm run build`
- `Invoke-WebRequest https://loopincode.com`
