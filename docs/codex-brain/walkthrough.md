# 입주가능판별기 구현 결과

## 1. 구현 개요

마곡 일반산업단지 전용 `입주가능판별기` MVP를 신규 생성했다.  
사용자는 주소, 구역/건물유형, KSIC 코드, 신청 주체, 예외 조건을 입력하고, 시스템은 `가능 / 조건부 가능 / 심의 필요 / 불가 / 정보 부족` 5단계 중 하나로 예비판정한다.

이번 버전은 아래 범위를 포함한다.

- 산업시설구역 자동판정
- 지식산업센터 자동판정
- 사용자 정리 CSV 기반 exact 5자리 코드 우선판정
- 지원시설구역 수동 검토 안내
- 법령 근거 표시
- 로딩/에러/빈 상태 처리
- 단위 테스트 및 기본 UI 렌더 테스트

## 2. 반영한 핵심 법령 규칙

### 마곡 관리기본계획

- 산업시설구역 허용 업종표를 prefix 매칭 규칙으로 정규화
- 대학/대학부설연구소는 위원회 심의 필요
- 공공기관/공직유관단체는 위원회 승인 필요
- 지식산업센터는 시행령 제6조 제2항~제5항 업종 확장 허용
- 지식산업센터 exact 5자리 코드표를 CSV로 직접 로드해 자동 허용/심의/조건부/추가확인/불가를 우선 판정
- 지식산업센터 제한 조건 반영
  - 포장 및 충전업 불가
  - 여객 운송업 exact 코드 불가
  - 자원비축시설 불가
  - 부동산임대·공급업 단독 불가
  - 신탁업 단독 불가
  - 호스팅 및 관련 서비스업(63112) 심의 필요
  - 자료 처리업(63111) 자동 허용
- 제조시설 운영 시 조건부 가능 처리
  - 연구시설 비율 유지
  - 제조시설 비율 20% 이하 안내

### 산업집적법 시행령

- 제6조 제1항 입주자격 기본 요건 반영
- 제6조 제2항 지식산업
- 제6조 제3항 정보통신산업
- 제6조 제5항 기타 허용 산업
- 제6조 제6항 지원기관 관련 참고
- 제6조 제7항 예외 승인 가능성 반영

## 3. 구현 파일

주요 화면과 판정 로직은 아래에 구성했다.

- `src/App.tsx`
- `src/features/eligibility/evaluator.ts`
- `src/features/eligibility/data/rules.ts`
- `src/features/eligibility/data/legal-bases.ts`
- `src/features/eligibility/data/knowledge-center-exact-codes.ts`
- `src/features/eligibility/components/eligibility-form.tsx`
- `src/features/eligibility/components/result-panel.tsx`
- `src/features/eligibility/components/rulebook-tabs.tsx`
- `src/store/eligibility-store.ts`
- `src/utils/format.ts`

공통 UI는 shadcn/ui 스타일로 아래 컴포넌트를 분리했다.

- `src/components/ui/button.tsx`
- `src/components/ui/card.tsx`
- `src/components/ui/badge.tsx`
- `src/components/ui/input.tsx`
- `src/components/ui/select.tsx`
- `src/components/ui/switch.tsx`
- `src/components/ui/tabs.tsx`
- `src/components/ui/scroll-area.tsx`
- `src/components/ui/separator.tsx`
- `src/components/ui/textarea.tsx`

## 4. 검증 결과

실행한 명령:

```bash
npm run lint
npm run build
npm run test
```

결과:

- `lint` 통과
- `build` 통과
- `test` 통과
  - 2개 테스트 파일
  - 11개 테스트 케이스 통과

## 5. 알려진 한계

- 지원시설구역은 지구단위계획 시행지침 원문 없이 정확한 자동판정이 어려워 수동 검토 안내만 제공한다.
- 주소는 현재 참고 입력값이며, 필지/호실 자동 매핑 기능은 아직 없다.
- 지식산업센터 예외 업종 중 일부는 KSIC만으로 완전 판별이 어려워 `법령 분류 수동 선택` 보조 입력을 사용한다.

## 6. 다음 확장 후보

1. 마곡 지번/건물 데이터 연동으로 주소 기반 구역 자동판별
2. 지원시설구역 허용용도 기준서 반영
3. 실제 입주신청 체크리스트와 제출서류 생성 기능 추가

---

## 2026-03-16 지식산업센터 입주 가능 코드표 추가

### 산출물

- `docs/codex-brain/magok_knowledge_industry_center_allowed_codes.md`

### 추가 반영 내용

- 마곡 산업단지 내 지식산업센터 입주 가능 업종코드를 `자동 허용 / 조건부 허용 / 추가 확인 / 불가`로 재구성했다.
- 마곡 고시의 기본 허용코드와 시행령 제6조제2항부터 제5항 추가 허용코드를 합쳐 실무 판정표 형태로 정리했다.
- `호스팅 및 관련 서비스업`의 경우 마곡 고시문 코드 `63111`과 통계청 KSIC 코드 `63112`가 불일치하는 점을 별도로 표시했다.

---

## 2026-03-16 지식산업센터 정확 업종명 포함 5자리 코드표 추가

### 산출물

- `docs/codex-brain/magok_knowledge_industry_center_exact_5digit_codes.md`

### 추가 반영 내용

- 마곡 산업단지 내 지식산업센터 입주 가능 업종을 KSIC 11차 개정 세세분류 `5자리 코드` 기준으로 다시 펼쳐 `정확 업종명`까지 매핑했다.
- 자동 허용 `421개` exact code, 조건부 허용 `4개` exact code, 추가 확인 `7개` exact code, 불가 `14개` exact code를 분리해 정리했다.
- 대학, 대학부설연구소, 교육서비스업, 창업보육센터처럼 `기관 성격`이나 `운영 형태`가 기준인 항목은 코드만으로 확정되지 않는다는 점을 별도 표로 정리했다.

### 검증

- 마곡 고시문 허용 업종 접두코드와 시행령 제6조 예외 조항을 기준으로 1차 필터링
- 통계청 한국표준산업분류 11차 개정 추출본에서 세세분류 `5자리 코드`와 정확 업종명 재매핑
- `63111 자료 처리업`, `63112 호스팅 및 관련 서비스업` 코드명 재확인

---

## 2026-03-16 엑셀용 파일 생성

### 산출물

- `docs/codex-brain/magok_knowledge_industry_center_exact_5digit_codes.xlsx`
- `docs/codex-brain/magok_knowledge_industry_center_exact_5digit_codes.csv`

### 추가 반영 내용

- `판정구분 / 구분 / 코드 / 정확 업종명 / 조건·비고` 열 구조로 엑셀에서 바로 필터링 가능한 형식으로 변환했다.
- `전체판정표`, `자동허용`, `조건부허용`, `추가확인`, `불가`, `확정불가`, `주의사항` 시트를 포함한 `xlsx` 파일을 생성했다.
- `코드` 열은 텍스트로 저장해 선행 `0`이 유지되도록 처리했다.
- `csv`는 BOM 포함 `utf-8-sig`로 저장해 한글 깨짐 가능성을 낮췄다.

### 검증

- `xlsx` 파일 생성 및 로드 확인
- `전체판정표` 시트 기준 `452행(헤더 포함)`, `5열` 확인
- `csv` 파일 샘플 행 확인

---

## 2026-03-17 공장등록 가능 여부 검토 메모 추가

### 산출물

- `docs/codex-brain/magok_factory_registration_note.md`

### 추가 반영 내용

- 마곡 산업단지 내 `지식산업센터 입주 가능`과 `공장등록 가능`을 구분해서 정리했다.
- 지식산업센터에서도 제조업체의 공장등록이 가능한 법적 근거와, 마곡 고시가 추가로 거는 제한 조건을 한 문서에 묶었다.
- `제조시설 20% 이하`, `연구시설 비율 유지`, `도시형공장`, `연구개발-제조 연계성` 조건을 핵심 판정요소로 정리했다.

### 검증

- 사용자 제공 `마곡일반산업단지 관리기본계획 고시문`의 지식산업센터 제조시설 관련 페이지 재확인
- 사용자 제공 `산업집적활성화 및 공장설립에 관한 법률 시행령`의 공장 및 지식산업센터 관련 조항 재확인
- 국가법령정보센터와 한국산업단지공단 Factory On 공식 페이지 대조

---

## 2026-03-16 exact 5자리 판정 엔진 반영

### 반영 내용

- `docs/codex-brain/magok_knowledge_industry_center_exact_5digit_codes.csv`를 앱에서 직접 읽어 exact 5자리 코드셋을 구성했다.
- 지식산업센터에서는 exact 5자리 코드가 있으면 prefix 규칙보다 먼저 판정한다.
- `63111 자료 처리업`은 자동 허용, `63112 호스팅 및 관련 서비스업`은 심의 필요로 수정했다.
- `49102 철도 화물 운송업`처럼 기존 prefix 규칙만으로는 잡히지 않던 허용 코드도 자동판정되도록 보강했다.
- `52941` 등 `추가 확인 필요 코드`는 `정보 부족`으로 보수 판정해 관리기관 확인을 유도한다.

### 검증

- `npm run lint` 통과
- `npm run build` 통과
- `npm run test` 통과
  - 2개 테스트 파일
  - 11개 테스트 케이스 통과

---

## 2026-03-17 자연어 업종 탐색형 GUI 확장

### 반영 내용

- `업종코드 찾기` 패널을 추가해 자유 설명과 사업자등록증 `업태/종목` 텍스트를 바로 입력할 수 있게 했다.
- `광고대행업`, `앱 개발`, `디자인`, `호스팅`, `자료 처리`, `행사대행`, `번역`, `시장조사` 등 자주 쓰는 표현에 대한 별칭 사전을 만들고 exact 5자리 코드표와 함께 탐색에 사용했다.
- 입력 문장에서 `업태`, `종목`, `업종`, `사업내용` 라벨을 우선 파싱한 뒤, 정확히 찾은 업종코드와 관련 업종 추천을 분리해서 보여주도록 구현했다.
- 추천 카드마다 `추천 이유`, `현재 선택한 구역 기준 예상 판정`, `마곡 메모`, `이 업종으로 판정하기` 액션을 넣어 선택 즉시 기존 판정 엔진으로 이어지게 했다.
- 기존 `입주 예비판정 입력` 폼은 `세부 판정 조건 보정` 역할로 재정리해 추천 결과를 수동 보정하는 흐름으로 바꿨다.

### 구현 파일

- `src/features/eligibility/data/industry-discovery.ts`
- `src/features/eligibility/components/industry-discovery-panel.tsx`
- `src/store/eligibility-store.ts`
- `src/App.tsx`
- `src/features/eligibility/components/eligibility-form.tsx`
- `src/features/eligibility/components/result-panel.tsx`
- `src/features/eligibility/industry-discovery.test.ts`
- `src/App.test.tsx`

### 검증

- `npm run lint` 통과
- `npm run build` 통과
  - Vite plugin timing warning만 표시되었고 빌드는 정상 완료
- `npm run test -- --run` 통과
  - 3개 테스트 파일
  - 15개 테스트 케이스 통과

---

## 2026-03-17 데스크톱 GUI 패키징 추가

### 반영 내용

- 현재 React + Vite 화면을 그대로 재사용하는 `Electron` 데스크톱 래퍼를 추가했다.
- `web:dev`, `web:preview`, `desktop:dev`, `desktop:build` 스크립트를 분리해 웹 실행과 데스크톱 실행을 명확히 구분했다.
- `electron/main.mjs`에서 개발 모드에는 로컬 Vite 서버를, 배포 모드에는 `dist/index.html`을 직접 로드하도록 구성했다.
- `scripts/desktop-build.mjs`를 추가해 electron-builder 캐시 충돌을 피하도록 매번 새 캐시로 portable exe를 빌드하게 만들었다.
- Windows portable 실행 파일이 `release/magok-eligibility-desktop-0.0.0.exe`로 생성되는 것을 확인했다.

### 구현 파일

- `electron/main.mjs`
- `scripts/desktop-build.mjs`
- `package.json`

### 검증

- `npm run lint` 통과
- `npm run test -- --run` 통과
  - 3개 테스트 파일
  - 15개 테스트 케이스 통과
- `npm run desktop:build` 통과
  - 산출물: `release/magok-eligibility-desktop-0.0.0.exe`
  - 참고: 기본 Electron 아이콘 사용 로그가 표시되며, 커스텀 아이콘 미적용 상태다.

---

## 2026-03-17 데스크톱 검정화면 수정

### 원인

- 패키징된 Electron 앱은 `file://`로 `dist/index.html`을 열지만, Vite 기본 빌드 출력은 `/assets/...` 절대경로를 사용하고 있었다.
- 그 결과 데스크톱 앱이 JS/CSS 자산을 읽지 못해 창은 뜨지만 내용이 렌더링되지 않는 검정화면이 발생했다.

### 반영 내용

- `vite.config.ts`에 `base: './'`를 추가해 빌드 자산 경로를 상대경로로 변경했다.
- 수정 후 `dist/index.html`이 `./assets/...`를 가리키는 것을 확인했다.
- 재빌드 후 `release/win-unpacked/resources/app.asar` 갱신 시각이 바뀐 것을 확인했다.

### 검증

- `npm run build` 통과
- `npm run test -- --run` 통과
  - 3개 테스트 파일
  - 15개 테스트 케이스 통과
- `dist/index.html` 자산 경로 확인
  - `./assets/index-*.js`
  - `./assets/index-*.css`

---

## 2026-03-17 GUI 단순화 및 직관성 개선

### 반영 내용

- 첫 화면을 `사업 설명 입력 → 추천 업종 선택 → 결과 확인` 3단계 중심으로 다시 구성했다.
- 기존 상단 히어로의 통계 카드와 부가 설명을 줄이고, 서비스 목적과 사용 순서만 짧게 보이도록 단순화했다.
- `업종코드 찾기` 패널은 하나의 입력 흐름 안에서 예시 버튼, 검색 버튼, 추천 결과가 이어지도록 재정리했다.
- 추천 카드의 정보량을 줄이고 `업종명`, `코드`, `짧은 이유`, `이 업종으로 결과 보기` 액션이 먼저 보이게 바꿨다.
- `세부 판정 조건 보정` 폼은 `직접 수정이 필요할 때만` 여는 접힘형 보조 섹션으로 바꿨다.
- 결과 화면은 `판정`, `짧은 설명`, `왜 이렇게 판단했는지`, `다음에 확인할 것` 순서로 재구성해 처음 보는 사용자도 빠르게 이해할 수 있게 정리했다.
- 전반적인 배경과 장식 요소를 줄여 시각적 부담을 낮췄다.

### 구현 파일

- `src/App.tsx`
- `src/features/eligibility/components/industry-discovery-panel.tsx`
- `src/features/eligibility/components/eligibility-form.tsx`
- `src/features/eligibility/components/result-panel.tsx`
- `src/features/eligibility/components/rulebook-tabs.tsx`
- `src/index.css`
- `src/App.test.tsx`

### 검증

- `npm run lint` 통과
- `npm run build` 통과
- `npx vitest run --pool=threads --maxWorkers=1 --reporter=verbose src/App.test.tsx src/features/eligibility/evaluator.test.ts src/features/eligibility/industry-discovery.test.ts` 통과
  - 3개 테스트 파일
  - 15개 테스트 케이스 통과
- `npm run desktop:build`
  - `release/win-unpacked/Magok Eligibility Desktop.exe` 갱신 확인
  - `portable exe`는 백신 또는 파일 잠금으로 출력 파일이 잠겨 오래 대기할 수 있음을 확인

---

## 2026-03-19 마곡 코드찾기 사이트 전면 리브랜딩

### 방향 결정

- 루트에는 `아이맘가이드` 정적 HTML/CSS/JS 소스가 들어와 있었지만, 실제 웹/데스크톱 진입점은 `index.html -> src/main.tsx -> React App` 구조였다.
- 따라서 정적 HTML 페이지를 개별 수정하는 대신, 현재 서비스 진입점인 React 앱을 `마곡 코드찾기` 사이트로 전면 리브랜딩하는 방식으로 진행했다.
- 기존 아이맘가이드 정적 파일은 참고 소스로 남겨 두고, 실제 배포 대상은 React 앱 기준으로 교체했다.

### 반영 내용

- 메인 화면을 단순 도구 페이지에서 `랜딩 + 코드 찾기 + 결과 + 신뢰 + 기준` 구조의 사이트로 확장했다.
- 상단에는 브랜드 바와 앵커 내비게이션을 추가하고, 히어로 섹션에서 서비스 목적이 바로 보이게 문구를 전면 교체했다.
- `이런 분께 맞습니다`, `신뢰 포인트`, `판정 기준` 같은 섹션을 추가해 사이트 전체가 `마곡 업종코드 찾기 서비스`처럼 보이도록 정보 구조를 재설계했다.
- 기존 업종코드 추천/입주 판정 기능은 제거하지 않고, 랜딩 안의 핵심 기능 섹션으로 통합했다.
- `index.html`의 `lang`, `title`, `description` 메타 정보도 마곡 사이트 기준으로 교체했다.

### 구현 파일

- `src/App.tsx`
- `src/App.test.tsx`
- `index.html`

### 검증

- `npm run lint` 통과
- `npm run build` 통과
- `npx vitest run src/App.test.tsx --reporter=verbose --pool=threads --maxWorkers=1 --testTimeout=5000` 통과
  - 1개 테스트 파일
  - 1개 테스트 케이스 통과
- `npx vitest run src/features/eligibility/evaluator.test.ts src/features/eligibility/industry-discovery.test.ts --reporter=verbose --pool=threads --maxWorkers=1 --testTimeout=5000` 통과
  - 2개 테스트 파일
  - 14개 테스트 케이스 통과

---

## 2026-03-19 실행물 브랜딩 및 레거시 정리 안내

### 반영 내용

- 데스크톱 창 제목을 `마곡 코드찾기`로 바꾸고, Electron 패키지 메타데이터도 `Magok Code Finder` 기준으로 정리했다.
- `package.json`의 `description`, `appId`, `productName`, Windows 산출물 이름을 새 브랜드에 맞게 갱신했다.
- 기본 파비콘을 `마곡 코드찾기` 성격에 맞는 심볼형 SVG로 교체했다.
- `README.md`를 기본 Vite 템플릿에서 실제 프로젝트 설명 문서로 전면 교체했다.
- 루트에 들어온 `아이맘가이드` 정적 HTML/CSS/JS 파일은 현재 비활성 레거시 소스이며, 실제 수정 진입점은 `src/` 아래 React 앱이라는 점을 README에 명시했다.
- `release/win-unpacked/Magok Code Finder.exe`가 새 브랜드 기준으로 생성되는 것을 확인했다.

### 구현 파일

- `electron/main.mjs`
- `package.json`
- `public/favicon.svg`
- `README.md`
- `scripts/desktop-build.mjs`

### 검증

- `npm run lint` 통과
- `npx vitest run src/App.test.tsx --reporter=verbose --pool=threads --maxWorkers=1 --testTimeout=5000` 통과
  - 1개 테스트 파일
  - 1개 테스트 케이스 통과
- `npx vitest run src/features/eligibility/evaluator.test.ts src/features/eligibility/industry-discovery.test.ts --reporter=verbose --pool=threads --maxWorkers=1 --testTimeout=5000` 통과
  - 2개 테스트 파일
  - 14개 테스트 케이스 통과
- `npm run build` 통과
- `npm run desktop:build`
  - `release/win-unpacked/Magok Code Finder.exe` 생성 확인
  - `portable exe`는 Windows `electron-builder` 캐시/NSIS 상태에 따라 지연 또는 실패 가능성이 있어, 현재는 `win-unpacked` 실행본을 우선 전달 산출물로 본다.
- 전달용 압축본 생성
  - `release/magok-code-finder-win-unpacked.zip` 생성 확인

---

## 2026-03-19 도메인 이전 PDCA 정리

### 상황

- 사용자는 `https://imomguide.pages.dev/`를 `https://loopincode.com/`으로 바꾸려 한다.
- 이 작업은 호스팅 변경이 아니라 `공개 도메인 이동`이 포함된 이전 작업이라서, Cloudflare Pages 설정 외에 Google 계열 도구의 후속 조치가 필요하다.

### 정리 결과

- Cloudflare Pages
  - `loopincode.com`을 Pages 프로젝트의 커스텀 도메인으로 연결해야 한다.
  - 기존 `*.pages.dev` 프로덕션 주소는 새 커스텀 도메인으로 리다이렉트하는 구성이 권장된다.
- Search Console
  - `imomguide.pages.dev`와 `loopincode.com`을 모두 검증해야 한다.
  - 전체 도메인 이전이면 Change of Address, 새 sitemap 제출, 기존 URL의 영구 리다이렉트가 필요하다.
- AdSense
  - 기존 사이트 항목을 단순 수정하는 방식이 아니라 `loopincode.com`을 새 사이트로 추가하고 검토를 다시 받아야 한다.
  - `Privacy & messaging`를 쓰고 있다면 새 사이트도 별도로 연결해야 한다.
- Google Analytics 4
  - 보통 새 속성을 만들 필요는 없다.
  - 기존 웹 데이터 스트림의 `Website URL`을 `loopincode.com`으로 수정하면 된다.
  - 필요하면 리퍼럴 제외나 교차 도메인 설정을 함께 점검한다.

### 사용자 관점 한 줄 결론

- `Search Console`은 새 속성 추가 + 이전 처리 대상이다.
- `AdSense`는 새 사이트 추가 + 재검토 대상이다.
- `GA4`는 대개 새로 만들지 않고 기존 스트림 URL만 바꾸면 된다.

### 검증

- Google Search Central 공식 문서
- Google AdSense Help 공식 문서
- Google Analytics Help 공식 문서
- Cloudflare Pages 공식 문서

---

## 2026-03-19 도메인 이전 코드 반영

### 반영 내용

- `index.html`에 `https://loopincode.com/` 기준 `canonical`, `og:url`, `og:title`, `og:description`, `twitter:*` 메타를 추가했다.
- 실제 배포 산출물에 포함되도록 `public/robots.txt`, `public/sitemap.xml`, `public/ads.txt`를 새로 만들었다.
- 루트 `robots.txt`와 `sitemap.xml`도 예전 `imomguide.pages.dev` 기준 내용을 제거하고 `loopincode.com` 기준으로 정리했다.
- sitemap은 현재 실제 공개 구조에 맞춰 루트 URL 1건만 포함하는 최소 형태로 단순화했다.

### 구현 파일

- `index.html`
- `public/robots.txt`
- `public/sitemap.xml`
- `public/ads.txt`
- `robots.txt`
- `sitemap.xml`

### 검증

- `npm run lint` 통과
- `npm run test` 통과
  - 3개 테스트 파일
  - 15개 테스트 케이스 통과
- `npm run build` 통과
- `dist` 산출물 확인
  - `dist/robots.txt` 생성 확인
  - `dist/sitemap.xml` 생성 확인
  - `dist/ads.txt` 생성 확인

### 남은 수동 작업

- Cloudflare Pages 대시보드에서 `loopincode.com` 커스텀 도메인 연결
- 기존 `imomguide.pages.dev` 프로덕션 주소를 `loopincode.com`으로 리다이렉트
- Google Search Console에 새 속성 검증, sitemap 제출, 필요 시 Change of Address 실행
- AdSense에 `loopincode.com` 새 사이트 추가 및 검토 요청
- GA4 데이터 스트림의 웹사이트 URL을 `loopincode.com`으로 갱신

---

## 2026-03-19 도메인 이전 운영 체크리스트 작성

### 반영 내용

- Cloudflare, Search Console, AdSense, GA4에서 실제로 눌러야 하는 메뉴 경로를 순서대로 정리했다.
- `imomguide.pages.dev -> loopincode.com` 이전에 맞춘 운영 체크리스트 문서를 별도 작성했다.
- `pages.dev` 리다이렉트, Search Console 속성 추가/Change of Address, AdSense 새 사이트 추가, GA4 스트림 URL 수정 순서를 한 문서에서 이어서 볼 수 있게 정리했다.

### 산출물

- `docs/codex-brain/domain_migration_operations_checklist.md`

### 검증

- 공식 문서 메뉴명과 절차를 기준으로 수기 정리
- 코드 변경 없음

---

## 2026-03-19 Cloudflare Pages 배포 및 이전 준비 상태 점검

### 반영 내용

- `wrangler`로 Cloudflare Pages 프로젝트 목록을 확인한 결과, 대상 프로젝트는 `imomguide`였고 연결 도메인은 `imomguide.pages.dev`, `loopincode.com`이었다.
- 빌드 산출물 `dist`를 `imomguide` 프로젝트에 직접 업로드해 새 프로덕션 배포를 생성했다.
- 새 배포 URL은 `https://1dd53e8b.imomguide.pages.dev`로 확인됐다.
- `https://loopincode.com`은 이미 새 배포 내용을 응답하고 있었고, 본문 메타에 `loopincode.com` canonical과 `마곡 코드찾기` 타이틀이 반영된 것을 확인했다.
- `https://imomguide.pages.dev`도 현재는 같은 새 내용을 응답하지만, 아직 `loopincode.com`으로 리다이렉트되지는 않는 상태다.

### 검증

- `npx wrangler pages project list`
  - `imomguide.pages.dev`, `loopincode.com` 연결 프로젝트 확인
- `npx wrangler pages deploy dist --project-name imomguide`
  - 업로드 성공
  - 배포 완료 URL: `https://1dd53e8b.imomguide.pages.dev`
- `npx wrangler pages deployment list --project-name imomguide`
  - 새 Production 배포가 최상단에 반영된 것 확인
- `curl -I https://loopincode.com`
  - `200 OK`
- `curl -I https://imomguide.pages.dev`
  - `200 OK`
  - 아직 리다이렉트 없음

### 현재 판단

- `배포`: 완료
- `커스텀 도메인 반영`: 완료
- `구도메인 -> 신도메인 리다이렉트`: 미완료
- `Git 연동 자동배포 덮어쓰기 위험`: 있음

### 운영 리스크

- 이 Pages 프로젝트는 `Git Provider: Yes` 상태다.
- 따라서 연결된 원격 저장소에서 자동 배포가 다시 돌면, 이번 수동 업로드 배포가 이후 배포로 덮일 수 있다.
- 현재 로컬 작업본이 실제 연결 저장소와 다르다면, Cloudflare Pages의 Git 연동 소스도 같은 기준으로 맞춰 두는 것이 안전하다.

### 남은 수동 작업

- Cloudflare Bulk Redirect 또는 Redirect Rules로 `imomguide.pages.dev -> loopincode.com` 영구 리다이렉트 설정
- Search Console Change of Address 실행
- AdSense 새 사이트 검토 상태 확인

---

## 2026-03-19 GitHub 원격 저장소 교체 및 Git 배포 안정화

### 반영 내용

- 원격 저장소 `https://github.com/ambush0421/imomguide`의 기본 브랜치 `main`이 아직 `아이맘가이드` 정적 사이트 구조라는 점을 확인했다.
- 별도 작업 디렉터리에 원격 저장소를 클론한 뒤, 현재 `마곡 코드찾기` 프로젝트 구조로 교체했다.
- 원격 작업본 기준으로 `npm ci`, `npm run lint`, `npm run test`, `npm run build`를 다시 확인했다.
- 먼저 `codex/magok-site-replace` 브랜치에 푸시해 Cloudflare Preview 배포를 확인했다.
- 첫 Preview 배포는 `Failure`였고, 원인은 기존 Pages 프로젝트가 무빌드(static) 설정에 가까워 Git 배포 시 prebuilt `dist/`가 필요하기 때문으로 판단했다.
- `dist/`를 함께 추적하도록 보정한 뒤 같은 브랜치에 다시 푸시했고, Preview 배포가 `Active`로 전환됐다.
- 이후 같은 커밋 `45696c8`을 원격 `main`에 반영했고, Cloudflare Production 배포도 `Active` 상태가 됐다.

### 검증

- 원격 브랜치 확인
  - `refs/heads/main` -> `45696c8`
  - `refs/heads/codex/magok-site-replace` -> `45696c8`
- Cloudflare Preview 배포
  - 실패 커밋: `a80b7ae`
  - 성공 커밋: `45696c8`
  - Active Preview URL: `https://7328591b.imomguide.pages.dev`
- Cloudflare Production 배포
  - Active Production deployment commit: `45696c8`
  - Active Production URL: `https://6273ac32.imomguide.pages.dev`
- 운영 도메인 확인
  - `https://loopincode.com` -> `200 OK`

### 현재 판단

- `GitHub 원격 저장소 교체`: 완료
- `Cloudflare Git Production 배포`: 완료
- `구도메인 -> 신도메인 리다이렉트`: 미완료

### 운영 메모

- 현재 Git 배포 호환성을 위해 prebuilt `dist/`를 함께 추적하는 상태다.
- 장기적으로는 Cloudflare Pages 대시보드에서 `Build command = npm run build`, `Build output directory = dist`로 명시 전환하면 더 깔끔하다.

---

## 2026-03-19 AdSense 사이트 검토 코드 반영

### 판단

- `loopincode.com`은 이미 같은 AdSense 계정의 publisher ID를 담은 `ads.txt`를 가지고 있었고, 이 값은 그대로 유지하는 것이 맞다.
- 사이트 검토용 publisher ID는 새로 만들 필요가 없고, 기존 `ca-pub-2916041253392911` / `pub-2916041253392911`를 그대로 재사용하면 된다.
- 다만 기존 상태에서는 `head`에 AdSense script와 `google-adsense-account` meta가 없어, 검토 신호를 더 분명히 하기 위해 둘 다 추가했다.

### 반영 내용

- `index.html`에 아래 두 항목을 추가했다.
  - `<meta name="google-adsense-account" content="ca-pub-2916041253392911">`
  - `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2916041253392911`
- `public/ads.txt`는 기존 값 그대로 유지했다.
- 변경 내용을 GitHub 원격 `main`과 Cloudflare Production 배포까지 반영했다.

### 검증

- `npm run build` 통과
- `npm run test` 통과
  - 3개 테스트 파일
  - 15개 테스트 케이스 통과
- Cloudflare Production 배포
  - `fb87daa` 기준 `Production Active`
- 운영 도메인 확인
  - `https://loopincode.com` HTML에서 `google-adsense-account`
  - `adsbygoogle.js?client=ca-pub-2916041253392911`
  - 기존 `ads.txt` 값 노출 확인

### 결론

- `ads.txt`: 기존 값 그대로 사용
- `AdSense script`: 추가하는 것이 맞음
- `google-adsense-account` meta: 추가하는 것이 맞음

---

## 2026-03-19 UI/UX 단순화 및 섹션 구조 업그레이드

### 작업 배경

- 기존 랜딩은 기능은 충분했지만 카드 수와 설명량이 많아, 첫 화면에서 사용자가 무엇을 먼저 해야 하는지 빠르게 파악하기 어려웠다.
- 다크 글래스 스타일이 강해서 핵심 행동보다 장식과 보조 정보가 먼저 보이는 느낌이 있었다.
- 이번 작업 목표는 `심플하고 직관적이며 섹션별 역할이 분명한 UI`로 재구성하는 것이었다.

### 반영 내용

- 메인 화면 구조를 `소개`, `이용 방법`, `코드 찾기`, `직접 수정`, `판정 기준` 5개 섹션으로 단순화했다.
- 히어로 영역은 서비스 설명과 시작 버튼 중심으로 줄이고, 첫 행동이 바로 보이게 정리했다.
- 전체 컬러 시스템을 밝은 뉴트럴 배경과 오렌지 포인트 중심으로 바꿔 시각적 부담을 낮췄다.
- `IndustryDiscoveryPanel`은 입력 안내와 추천 카드 구조를 더 짧고 직관적으로 바꿨다.
- `ResultPanel`은 결과 요약, 판단 이유, 다음 확인사항, 세부 근거를 단계적으로 보이게 재배열했다.
- `EligibilityForm`은 세부 보정용 보조 흐름이라는 인상이 더 분명하게 보이도록 정리했다.
- 공통 UI 컴포넌트 기본값도 새 톤에 맞게 손봤다.

### 구현 파일

- `src/App.tsx`
- `src/index.css`
- `src/components/ui/card.tsx`
- `src/components/ui/badge.tsx`
- `src/components/ui/button.tsx`
- `src/components/ui/input.tsx`
- `src/components/ui/textarea.tsx`
- `src/components/ui/select.tsx`
- `src/components/ui/switch.tsx`
- `src/components/async-state.tsx`
- `src/features/eligibility/components/industry-discovery-panel.tsx`
- `src/features/eligibility/components/result-panel.tsx`
- `src/features/eligibility/components/eligibility-form.tsx`
- `src/App.test.tsx`

### 적용 스킬

- `pdca`
- `ui-ux-pro-max`
- `frontend-ui-ux-engineer`

### 검증

- `npm run lint` 통과
- `npm run test -- --run` 통과
  - 3개 테스트 파일
  - 15개 테스트 케이스 통과
- `npm run build` 통과
  - `dist/index.html`
  - `dist/assets/*.css`
  - `dist/assets/*.js`

### 결과 요약

- 첫 화면에서 해야 할 행동이 더 빨리 보이도록 정보 흐름이 정리됐다.
- 설명 카드 수와 시각적 무게를 줄여 전체 밀도가 낮아졌다.
- 처음 보는 사용자도 페이지 목적을 더 쉽게 이해할 수 있는 구조로 바뀌었다.

---

## 2026-03-19 UI/UX 단순화 및 섹션 구조 업그레이드

### 작업 배경

- 기존 랜딩은 기능은 충분했지만, 카드 수와 설명량이 많아 첫 화면에서 `무엇을 먼저 해야 하는지` 즉시 파악하기 어려웠다.
- 전체가 다크 글래스 스타일에 가깝다 보니, 핵심 행동보다 장식과 정보가 먼저 보이는 느낌이 있었다.
- 사용자는 `심플하고 직관적이며, 섹션별로 정리된 화면`을 원했다.

### 반영 내용

- 첫 화면 구조를 `한 줄 설명 → 바로 시작 → 사용 흐름` 중심으로 다시 구성했다.
- 메인 섹션을 `소개`, `이용 방법`, `코드 찾기`, `직접 수정`, `판정 기준` 순으로 단순화했다.
- 페이지 전체를 밝은 뉴트럴 배경과 오렌지 포인트 중심으로 재정리해 가독성을 높였다.
- `IndustryDiscoveryPanel`은 설명과 상태 문구를 더 짧게 줄이고, 추천 카드도 더 가볍게 정리했다.
- `ResultPanel`은 결과 요약을 먼저 보여주고 `이유 / 다음 확인 / 세부 근거`를 깔끔하게 분리했다.
- `EligibilityForm`은 세부 보정용 보조 섹션이라는 인상이 더 명확하도록 톤과 문구를 정리했다.
- 공통 UI 컴포넌트(`card`, `badge`, `button`, `input`, `textarea`, `select`, `switch`, `async-state`)의 기본 스타일도 함께 조정했다.

### 구현 파일

- `src/App.tsx`
- `src/index.css`
- `src/components/ui/card.tsx`
- `src/components/ui/badge.tsx`
- `src/components/ui/button.tsx`
- `src/components/ui/input.tsx`
- `src/components/ui/textarea.tsx`
- `src/components/ui/select.tsx`
- `src/components/ui/switch.tsx`
- `src/components/async-state.tsx`
- `src/features/eligibility/components/industry-discovery-panel.tsx`
- `src/features/eligibility/components/result-panel.tsx`
- `src/features/eligibility/components/eligibility-form.tsx`
- `src/App.test.tsx`

### 적용 스킬

- `pdca`
- `ui-ux-pro-max`
- `frontend-ui-ux-engineer`

### 검증

- `npm run lint` 통과
- `npm run test -- --run` 통과
  - 3개 테스트 파일
  - 15개 테스트 케이스 통과
- `npm run build` 통과
  - `dist/index.html`
  - `dist/assets/index-BRKOEdRh.css`
  - `dist/assets/index-CQ-j8fUs.js`

### 결과 요약

- 첫 화면에서 해야 할 행동이 더 빨리 보이도록 흐름이 정리됐다.
- 안내 카드 수와 시각적 무게를 줄여 전체 밀도가 낮아졌다.
- 섹션별 의미가 선명해져 `이게 어떤 페이지인지`에 대한 혼란이 줄어든 구조로 바뀌었다.
