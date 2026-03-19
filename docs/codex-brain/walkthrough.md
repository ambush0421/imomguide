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

### Git 반영

- 원격 저장소 `ambush0421/imomguide`
- UI 단순화 코드 커밋: `feat: simplify magok finder ui`
- 완료 기록 문서 커밋: `docs: record ui deployment`
- 최종 상태
  - `codex/magok-site-replace` 반영 완료
  - `main` 반영 완료

### Cloudflare 반영

- Preview 배포
  - 브랜치: `codex/magok-site-replace`
  - 상태: `Active` 확인
- Production 배포
  - 브랜치: `main`
  - 상태: `Active` 확인

---

## 2026-03-19 기준 탭 내부 스크롤 제거

### 문제 확인

- 사용자가 `판정 기준` 영역의 `지식산업센터` 탭에서 일부 카드가 내부 스크롤 때문에 끝까지 보이지 않는다고 제보했다.
- 실제 구현을 확인한 결과, [rulebook-tabs.tsx](C:/projects/magok/src/features/eligibility/components/rulebook-tabs.tsx) 에서 각 탭 콘텐츠를 `ScrollArea`와 `max-h-[28rem]`으로 감싸 내부 스크롤 박스를 만들고 있었다.
- 따라서 사용자가 본 문제는 데이터 누락이 아니라 `내부 스크롤 컨테이너에 규칙 카드가 갇혀 보이는 구조`였다.

### 반영 내용

- `rulebook-tabs`에서 내부 `ScrollArea`를 제거하고, 탭 콘텐츠가 페이지 자연 스크롤 흐름으로 이어지도록 변경했다.
- 산업시설구역, 지식산업센터, 심의·제한 탭 모두 동일하게 `전체 내용이 한 번에 보이는 카드 리스트` 형태로 정리했다.
- 탭 버튼은 [tabs.tsx](C:/projects/magok/src/components/ui/tabs.tsx) 에서 줄바꿈 가능한 구조로 바꿔 좁은 화면에서도 잘리지 않게 조정했다.

### 구현 파일

- [rulebook-tabs.tsx](C:/projects/magok/src/features/eligibility/components/rulebook-tabs.tsx)
- [tabs.tsx](C:/projects/magok/src/components/ui/tabs.tsx)

### 검증

- `npm run lint` 통과
- `npm run test -- --run` 통과
  - 3개 테스트 파일
  - 15개 테스트 케이스 통과
- `npm run build` 통과

### 결과

- `판정 기준` 탭 내부에서 따로 스크롤하지 않아도 전체 규칙 카드를 페이지 스크롤로 끝까지 볼 수 있게 됐다.
- 탭 버튼도 작은 화면에서 줄바꿈되므로 일부 탭명이 잘리거나 가려질 가능성이 줄어들었다.

---

## 2026-03-19 기준 탭 검색 최적화 및 AdSense 403 정리

### 작업 배경

- 내부 스크롤을 없앤 뒤에도 `판정 기준` 영역은 규칙 수가 많아 길게 느껴질 수 있었다.
- 사용자는 `더 단순화`와 `모바일 최적화`를 원했고, 동시에 브라우저 콘솔에서 AdSense `403` 요청 오류를 확인했다.
- 로컬 코드 기준으로는 실제 광고 슬롯 컴포넌트 없이 `head`의 AdSense 로더 스크립트만 있었기 때문에, 검토 단계에서 광고 요청이 먼저 발생하고 있을 가능성이 높았다.

### 반영 내용

- [rulebook-tabs.tsx](C:/projects/magok/src/features/eligibility/components/rulebook-tabs.tsx)에 탭별 검색 필터를 추가해 긴 규칙 목록을 바로 찾을 수 있게 바꿨다.
- 각 탭 상단에 현재 표시 수와 핵심 요약 카드도 함께 배치했다.
- 결과가 없을 때는 빈 상태 메시지를 보여주도록 정리했다.
- 모바일에서 탭 버튼이 한 줄에 눌려 보이지 않도록 [tabs.tsx](C:/projects/magok/src/components/ui/tabs.tsx)를 `세로 스택형`에 가깝게 조정했다.
- AdSense는 검토 단계용으로 [index.html](C:/projects/magok/index.html)에서 `google-adsense-account` meta는 유지하고, `adsbygoogle.js` 로더는 제거했다.
- `ads.txt`는 유지한다.

### AdSense 403 해석

- 현재 페이지 소스에는 실제 광고 슬롯 마크업이 없고, 검토용 계정 식별 메타만 남아 있다.
- 따라서 기존 `403`은 코드 자체가 깨진 오류라기보다, 승인 전 단계에서 AdSense 광고 요청이 거절되던 상황으로 보는 것이 타당하다.
- 이 판단은 로컬 코드 구조와 Google AdSense의 `사이트 연결` 및 `사이트 준비 상태` 안내를 바탕으로 한 추론이다.

### 구현 파일

- [rulebook-tabs.tsx](C:/projects/magok/src/features/eligibility/components/rulebook-tabs.tsx)
- [tabs.tsx](C:/projects/magok/src/components/ui/tabs.tsx)
- [index.html](C:/projects/magok/index.html)

### 검증

- `npm run lint` 통과
- `npm run test -- --run` 통과
  - 3개 테스트 파일
  - 15개 테스트 케이스 통과
- `npm run build` 통과

### 결과

- `판정 기준` 영역이 긴 카드 나열에서 `검색해서 바로 찾는 참고 영역`으로 더 단순해졌다.
- 모바일에서도 탭 버튼과 카드 간격이 덜 답답하게 보이도록 정리됐다.
- 검토 단계에서 불필요한 AdSense 광고 요청을 줄여 브라우저 콘솔의 `403` 노이즈가 완화될 가능성이 높아졌다.

---

## 2026-03-19 쿠팡 파트너스 최종승인 준비 섹션 추가

### 참고한 공식 기준

- 쿠팡 공식 이용 가이드 PDF의 `STEP 3. 최종승인` 구간을 확인했다.
- 핵심 확인 항목은 다음 세 가지였다.
  - 등록한 활동 페이지와 실제 활동 페이지의 일치 여부
  - 링크/배너/위젯과 대가성 문구가 함께 보이는 활동 스크린샷 등록
  - 파트너스 링크가 있는 모든 게시물에 대가성 문구 표기

### 반영 내용

- [App.tsx](C:/projects/magok/src/App.tsx)에 `쿠팡 파트너스 최종승인 준비` 섹션을 추가했다.
- 섹션 안에서 `활동 페이지 등록`, `활동 스크린샷`, `대가성 문구` 3가지를 카드로 나눠 안내했다.
- 공식 가이드의 권장 취지에 맞게 대가성 문구 예시도 눈에 띄는 카드로 함께 배치했다.

### 구현 파일

- [App.tsx](C:/projects/magok/src/App.tsx)

### 검증

- `npm run lint` 통과
- `npm run test -- --run` 통과
  - 3개 테스트 파일
  - 15개 테스트 케이스 통과
- `npm run build` 통과

### 결과

- 이 사이트를 쿠팡 파트너스 활동 페이지로 활용할 때, 승인 준비에 필요한 핵심 항목을 방문자가 바로 확인할 수 있게 됐다.
- 활동 스크린샷과 대가성 문구 준비를 설명하는 영역이 생겨, 최종승인 준비용 페이지로도 더 설득력 있게 보이는 방향으로 정리됐다.

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

---

## 2026-03-19 쿠팡 최종승인용 푸터 및 제출 문안 보강

### 작업 배경

- 사용자는 쿠팡 파트너스 최종승인 관점에서 사이트를 한 번 더 다듬고, `운영자 정보 / 문의 / 쿠팡 파트너스 안내`가 푸터에 명확히 보이길 원했다.
- 이전 단계에서 본문 중간에 `최종승인 준비` 섹션은 추가됐지만, 실제 승인 제출 화면처럼 보이기에는 푸터의 실무 정보가 부족했다.
- 동시에 라이브 배포가 실제로 반영됐는지 `loopincode.com`과 `imomguide.pages.dev` 응답도 다시 확인할 필요가 있었다.

### 반영 내용

- [App.tsx](C:/projects/magok/src/App.tsx)의 푸터를 승인용 3열 카드 구조로 확장했다.
  - `운영자 정보`
  - `문의 안내`
  - `쿠팡 파트너스 안내`
- 문의 채널은 현재 공개된 실제 연락처를 확인하지 못했으므로, `실제 이메일 또는 카카오톡 채널을 승인 제출 전 반영해야 한다`는 운영 메모를 명시했다.
- 푸터 하단에 대가성 문구 예시를 다시 한 번 고정해, 스크린샷 캡처 시 함께 보일 수 있게 했다.
- [App.test.tsx](C:/projects/magok/src/App.test.tsx)에 푸터의 승인 안내 텍스트 렌더링 검증을 추가했다.
- [coupang_final_approval_submission_checklist.md](C:/projects/magok/docs/codex-brain/coupang_final_approval_submission_checklist.md)를 새로 만들어 아래 내용을 정리했다.
  - 활동 페이지 등록 문안 초안
  - 최종승인용 스크린샷 체크리스트
  - 제출 전 최종 점검 항목

### 실배포 점검

- `Invoke-WebRequest https://loopincode.com` 결과, HTML 응답은 최신 `google-adsense-account` meta와 현재 번들 파일(`index-mKuFBYf3.js`)을 가리키고 있었다.
- 같은 응답의 `cf-cache-status`는 `DYNAMIC`으로 확인돼, 이전에 의심했던 오래된 정적 캐시 고정 상태는 아니라는 점을 확인했다.
- `loopincode.com/assets/index-mKuFBYf3.js` 안에서 아래 문자열이 실제로 확인됐다.
  - `쿠팡 파트너스`
  - `권장 예시`
  - `활동 페이지를 모두 등록하세요`
- `https://imomguide.pages.dev`도 현재는 같은 HTML 응답을 반환하고 있다.
- 다만 `imomguide.pages.dev -> loopincode.com` 리다이렉트는 여전히 별도 운영 작업으로 남아 있다.

### 구현 파일

- [App.tsx](C:/projects/magok/src/App.tsx)
- [App.test.tsx](C:/projects/magok/src/App.test.tsx)
- [coupang_final_approval_submission_checklist.md](C:/projects/magok/docs/codex-brain/coupang_final_approval_submission_checklist.md)

### 검증

- `npm run lint` 통과
- `npm run test -- --run` 통과
  - 3개 테스트 파일
  - 15개 테스트 케이스 통과
- `npm run build` 통과
  - `dist/index.html`
  - `dist/assets/index-Bxe6FHC4.css`
  - `dist/assets/index-BmWSm7St.js`

### 결과

- 사이트 하단만 봐도 쿠팡 승인 준비에 필요한 핵심 정보 구조가 보이도록 정리됐다.
- 운영자가 바로 사용할 수 있는 제출용 문안과 체크리스트가 별도 문서로 생겨, 승인 신청 준비가 쉬워졌다.
- 라이브 도메인의 현재 응답과 번들 안에서도 쿠팡 관련 섹션이 실제 포함된 것을 확인했다.

---

## 2026-03-19 문의 이메일 실반영

### 작업 배경

- 사용자가 실제 문의 이메일 `contact.loopinlab@gmail.com`을 제공했다.
- 이전까지는 승인용 푸터에 문의 채널이 미확정 상태라는 안내만 있었기 때문에, 실제 제출 화면과 문서에 동일한 연락처를 반영할 필요가 있었다.

### 반영 내용

- [App.tsx](C:/projects/magok/src/App.tsx)의 `문의 안내` 카드 문구를 실제 이메일 기준으로 수정했다.
- 문의 카드 포인트 첫 줄에 `문의 이메일: contact.loopinlab@gmail.com`을 직접 노출했다.
- [App.test.tsx](C:/projects/magok/src/App.test.tsx)에 해당 이메일이 렌더링되는지 검증을 추가했다.
- [coupang_final_approval_submission_checklist.md](C:/projects/magok/docs/codex-brain/coupang_final_approval_submission_checklist.md)에도 같은 이메일을 반영해, 스크린샷 체크리스트와 최종 점검 문구가 실제 운영 정보와 맞도록 정리했다.

### 검증

- `npm run lint` 통과
- `npm run test -- --run` 통과
- `npm run build` 통과

### 결과

- 화면과 제출용 문서의 문의 채널이 동일해져 승인 제출 시 정보 불일치 가능성이 줄었다.
- 이제 푸터 스크린샷만 캡처해도 실제 문의 이메일이 함께 보이는 상태가 됐다.

---

## 2026-03-19 지식산업센터 입주검토용 표 및 CSV/사이트 반영

### 작업 배경

- 사용자는 시행령 제6조제2항 1호부터 27호까지를 누락 없이 다시 확인하고, 그 결과를 `입주검토용 표` 형태로 문서와 사이트에 동시에 반영하길 원했다.
- 특히 KSIC 11차에서는 법령 문구와 표준산업분류 명칭·코드가 그대로 1:1 대응되지 않는 항목이 있어, `고등교육법상 연구소`, `기초연구법상 기관·단체`, `이러닝업`, `관리기관 인정 산업` 같은 항목을 별도로 보강할 필요가 있었다.

### 반영 내용

- [magok_knowledge_industry_center_allowed_codes.md](C:/projects/magok/docs/codex-brain/magok_knowledge_industry_center_allowed_codes.md)에 `시행령 제6조제2항 입주검토용 표`를 새로 추가했다.
  - `호`
  - `시행령 업종`
  - `현재 KSIC 대응`
  - `마곡 지식산업센터 적용`
  - `실무 확인사항`
- [magok_knowledge_industry_center_exact_5digit_codes.csv](C:/projects/magok/docs/codex-brain/magok_knowledge_industry_center_exact_5digit_codes.csv)의 헤더를 실무형으로 바꾸고, 아래 `코드만으로 확정 불가` 행을 보강했다.
  - `연구소(2호)`
  - `기관·단체(3호)`
  - `이러닝업(26호)`
  - `73901·73905·73909 등`
- [magok_knowledge_industry_center_exact_5digit_codes.md](C:/projects/magok/docs/codex-brain/magok_knowledge_industry_center_exact_5digit_codes.md)에도 같은 비정형 판정 항목을 추가해 문서와 CSV가 어긋나지 않도록 맞췄다.
- [knowledge-industry-review-table.ts](C:/projects/magok/src/features/eligibility/data/knowledge-industry-review-table.ts)를 새로 만들어 시행령 1~27호의 화면용 검토 데이터를 분리했다.
- [rulebook-tabs.tsx](C:/projects/magok/src/features/eligibility/components/rulebook-tabs.tsx) 지식산업센터 탭에 `시행령 제6조제2항 1~27호 대응표`를 추가했다.
  - 검색창과 연동되도록 구성
  - `가능 / 조건부 / 추가 확인 / 불가` 배지로 즉시 구분 가능
- [App.test.tsx](C:/projects/magok/src/App.test.tsx)는 지식산업센터 탭을 실제로 눌렀을 때 새 표가 보이는지 검증하도록 보완했다.

### 검증

- `npm run lint` 통과
- `npm run test` 통과
  - 3개 테스트 파일
  - 15개 테스트 케이스 통과
- `npm run build` 통과
  - `dist/index.html`
  - `dist/assets/index-ilDEELP8.css`
  - `dist/assets/index-BfgjL2uf.js`

### 배포 확인

- `npx wrangler pages deploy dist --project-name imomguide`로 새 빌드를 배포했다.
- 배포 URL: `https://058d53cd.imomguide.pages.dev`
- `pages.dev`와 `loopincode.com`의 HTML 모두 새 번들 `index-BfgjL2uf.js`를 가리키는 것을 확인했다.
- `pages.dev`와 `loopincode.com`의 번들 파일 안에서 `시행령 제6조제2항 1~27호 대응표` 문자열이 실제 포함된 것도 확인했다.

### 결과 요약

- 사용자가 한눈에 볼 수 있는 `27개 조문 기준 입주검토용 표`가 문서와 사이트에 동시에 생겼다.
- exact 5자리 CSV는 기존 판정 로직을 유지하면서도, 빠지기 쉬운 비정형 항목까지 실무 메모와 함께 보강됐다.
- 공개 사이트 번들까지 새 표가 포함된 상태로 배포를 마쳤다.

---

## 2026-03-19 레퍼런스 PDF 최종 반영 및 업종코드 분석기 완료

### 작업 배경

- 사용자는 추가로 제공한 로컬 PDF 3종을 기준으로 업종코드 분석기를 끝까지 보강해 달라고 요청했다.
- 기존 반영본은 `입주검토용 표`와 CSV는 들어가 있었지만, 실제 판정 엔진에서는 `연구소(2호)`, `기관·단체(3호)`, `이러닝업(26호)`, `관리기관 인정 업종(27호)` 흐름이 완전히 연결돼 있지 않았다.
- 또한 `73905`, `73909`처럼 제27호 취지로 보수적으로 봐야 하는 세세분류가 direct code 입력에서 누락될 여지가 있어 이를 막을 필요가 있었다.

### 반영 내용

- [magok_knowledge_industry_center_exact_5digit_codes.csv](C:/projects/magok/docs/codex-brain/magok_knowledge_industry_center_exact_5digit_codes.csv)에 아래 `추가 확인` 코드를 명시했다.
  - `73905 고고유산 조사연구 서비스업`
  - `73909 그 외 기타 분류 안된 전문, 과학 및 기술 서비스업`
- [magok_knowledge_industry_center_exact_5digit_codes.md](C:/projects/magok/docs/codex-brain/magok_knowledge_industry_center_exact_5digit_codes.md)도 같은 내용으로 맞춰 문서와 CSV를 동기화했다.
- [knowledge-center-exact-codes.ts](C:/projects/magok/src/features/eligibility/data/knowledge-center-exact-codes.ts)
  - CSV의 `코드만으로 확정 불가` 행을 직접 파싱하도록 바꿨다.
  - `85*` 같은 prefix 기반 불확실 항목은 코드만으로 자동 확정하지 않도록 유지했다.
  - exact 코드로 명시된 `73905`, `73909`는 `추가 확인` 결과로 직접 연결되도록 보강했다.
- [types.ts](C:/projects/magok/src/features/eligibility/types.ts)와 [eligibility-form.tsx](C:/projects/magok/src/features/eligibility/components/eligibility-form.tsx)
  - 수동 법령 분류에 아래 선택지를 추가했다.
  - `고등교육법 제25조 연구소(2호)`
  - `기초연구법 제14조 기관·단체(3호)`
  - `이러닝법상 업(26호)`
  - `관리기관 인정 업종(27호)`
- [evaluator.ts](C:/projects/magok/src/features/eligibility/evaluator.ts)
  - `2호`, `3호` 선택 시 `기관 설치 근거 + 실제 연구개발 수행 계획` 확인이 필요한 조건부 결과를 반환하도록 보강했다.
  - `26호` 선택 시 `제7호·제10호 또는 제6조제3항 산업을 경영하는 입주기업체가 운영하는지`를 묻는 조건부 결과를 반환하도록 추가했다.
  - `27호` 선택 시 관리기관 인정과 홈페이지 게시 여부를 먼저 확인하도록 `추가 확인` 결과를 반환하게 했다.
- [evaluator.test.ts](C:/projects/magok/src/features/eligibility/evaluator.test.ts)
  - `73905`
  - `이러닝업(26호)`
  - `관리기관 인정 업종(27호)`
  시나리오를 테스트로 추가했다.

### 검증

- `npm run lint` 통과
- `npm run test` 통과
  - 3개 테스트 파일
  - 18개 테스트 케이스 통과
- `npm run build` 통과
  - `dist/index.html`
  - `dist/assets/index-ilDEELP8.css`
  - `dist/assets/index-C7_sujel.js`

### 배포 확인

- `npx wrangler pages deploy dist --project-name imomguide`로 다시 배포했다.
- 새 배포 URL: `https://73c21219.imomguide.pages.dev`
- `https://73c21219.imomguide.pages.dev`와 `https://loopincode.com`의 HTML이 모두 새 번들 `index-C7_sujel.js`를 가리키는 것을 확인했다.

### 결과 요약

- 문서에만 있던 `2호`, `3호`, `26호`, `27호` 흐름이 실제 업종코드 분석기 엔진과 입력 폼에도 연결됐다.
- `73905`, `73909` 같은 관리기관 인정 검토 대상 코드를 직접 넣어도 이제 보수적으로 `추가 확인` 결과가 나온다.
- 새 번들이 실제 운영 도메인까지 반영돼, 사이트 업종코드 분석기 기준이 레퍼런스 PDF와 더 가깝게 맞춰졌다.

---

## 2026-03-19 업종코드 상세 해설 화면 반영

### 작업 배경

- 사용자는 결과를 파일로 받기보다, 사이트 화면 안에서 바로 확인할 수 있게 해 달라고 요청했다.
- 기존 결과 패널은 `가능/조건부/심의/불가` 요약은 잘 보여줬지만, 현재 선택한 코드가 정확히 어떤 조문과 코드표에 연결되는지는 한 번 더 추론해야 했다.

### 반영 내용

- [screen-insights.ts](C:/projects/magok/src/features/eligibility/data/screen-insights.ts)를 새로 만들어 화면 전용 인사이트 헬퍼를 추가했다.
  - `exact 5자리`
  - `코드만으로 확정 불가`
  - `수동 법령 분류`
  - `산업시설구역 기본업종`
  - `지식산업센터 특례`
  를 한 객체로 합쳐 결과 화면에서 바로 쓸 수 있게 정리했다.
- [result-panel.tsx](C:/projects/magok/src/features/eligibility/components/result-panel.tsx)에 `업종코드 상세 해설` 카드를 추가했다.
  - `입력 코드`
  - `입력 업종`
  - `판정 기준`
  - `연결 조문`
  - `현재 KSIC 대응`
  - `실무 메모`
  를 결과 요약 아래에서 바로 보여준다.
- `73905` 같은 코드 입력 시 이제 화면 안에서 바로 아래 흐름을 확인할 수 있다.
  - `27호 · 관리기관 인정 기타 전문·과학·기술 서비스업`
  - `7390 중 미열거 영역`
  - `관리기관 인정 산업으로 별도 인정받는지 확인 필요`
- [result-panel.test.tsx](C:/projects/magok/src/features/eligibility/components/result-panel.test.tsx)를 추가해 `업종코드 상세 해설` 카드가 실제 렌더링되는지 UI 테스트로 고정했다.

### 검증

- `npm run lint` 통과
- `npm run test` 통과
  - 4개 테스트 파일
  - 19개 테스트 케이스 통과
- `npm run build` 통과
  - `dist/index.html`
  - `dist/assets/index-tWpwNL8l.css`
  - `dist/assets/index-DX33N43b.js`

### 배포 확인

- `npx wrangler pages deploy dist --project-name imomguide`로 재배포했다.
- 새 배포 URL: `https://b3223d0c.imomguide.pages.dev`
- `https://b3223d0c.imomguide.pages.dev`와 `https://loopincode.com` HTML이 모두 새 번들 `index-DX33N43b.js`를 가리키는 것을 확인했다.
- `loopincode.com`의 새 번들 안에 `업종코드 상세 해설`, `관리기관 인정 산업으로 별도 인정받는지 확인 필요` 문자열이 포함된 것도 확인했다.

### 결과 요약

- 이제 사용자는 파일을 열지 않아도, 선택한 업종코드가 어떤 조문과 기준에 걸리는지 사이트 화면에서 바로 볼 수 있다.
- 특히 `지식산업센터 추가 확인 코드`, `이러닝`, `관리기관 인정 업종` 같은 애매한 케이스도 화면 카드로 더 명확하게 읽을 수 있게 됐다.

---

## 2026-03-19 블루 테마 UI/UX 개편

### 작업 배경

- 사용자는 현재 화면을 푸른 계열 UI/UX로 바꿀 수 있는지 요청했다.
- 기존 화면은 주황 기반 포인트 컬러와 웜톤 배경이 강해서, 법령·검토 도구 특유의 차분하고 신뢰감 있는 인상을 더 주려면 블루 계열로 재정리하는 편이 자연스러웠다.

### 반영 내용

- [index.css](C:/projects/magok/src/index.css)
  - 전역 색 토큰을 블루 계열로 교체했다.
  - `--background`, `--accent`, `--accent-strong`, `--ring` 등을 새 팔레트로 바꾸고 body 그라데이션도 차가운 톤으로 정리했다.
- [badge.tsx](C:/projects/magok/src/components/ui/badge.tsx)
  - 기본 브랜드 배지를 블루 포인트로 바꿨다.
  - `muted` 배지 배경도 약한 블루 틴트로 조정했다.
- [button.tsx](C:/projects/magok/src/components/ui/button.tsx), [select.tsx](C:/projects/magok/src/components/ui/select.tsx), [switch.tsx](C:/projects/magok/src/components/ui/switch.tsx), [async-state.tsx](C:/projects/magok/src/components/async-state.tsx)
  - 버튼 그림자, hover, focus ring, 셀렉트 highlight, 스위치, 빈 상태 카드까지 블루 계열로 맞췄다.
- [App.tsx](C:/projects/magok/src/App.tsx)
  - 랜딩 상단 아이콘 글로우, 이용 방법 스텝, 핵심 기능 섹션, 푸터 카드, 안내 박스 색을 블루 계열로 바꿨다.
  - 쿠팡 안내 박스처럼 기존 amber 계열이던 정보 카드도 `sky` 계열로 조정했다.
- [eligibility-form.tsx](C:/projects/magok/src/features/eligibility/components/eligibility-form.tsx), [industry-discovery-panel.tsx](C:/projects/magok/src/features/eligibility/components/industry-discovery-panel.tsx), [result-panel.tsx](C:/projects/magok/src/features/eligibility/components/result-panel.tsx), [rulebook-tabs.tsx](C:/projects/magok/src/features/eligibility/components/rulebook-tabs.tsx)
  - 입력 패널, 결과 요약, 상세 해설, 기준 탭 카드의 웜톤 배경을 블루 계열로 정리했다.
  - 상태 의미가 강한 `warning/danger` 계열은 유지해 의미 전달력은 살렸다.

### 검증

- `npm run lint` 통과
- `npm run test` 통과
  - 4개 테스트 파일
  - 19개 테스트 케이스 통과
- `npm run build` 통과
  - `dist/index.html`
  - `dist/assets/index-Da3MiyC8.css`
  - `dist/assets/index-CdfXDUcJ.js`

### 배포 확인

- `npx wrangler pages deploy dist --project-name imomguide`로 재배포했다.
- 새 배포 URL: `https://d69698c3.imomguide.pages.dev`
- `https://d69698c3.imomguide.pages.dev`와 `https://loopincode.com` HTML이 모두 새 번들 `index-CdfXDUcJ.js`, `index-Da3MiyC8.css`를 가리키는 것을 확인했다.
- 운영 CSS 번들 안에 `#2b6dff`, `#eef4ff`가 포함된 것도 확인했다.

### 결과 요약

- 전체 화면 톤이 주황 중심에서 푸른 계열로 바뀌어, 더 차분하고 신뢰감 있는 느낌으로 정리됐다.
- 배경, 버튼, 카드, 빈 상태, 입력 폼이 같이 바뀌어서 단순 색 교체가 아니라 전체 UI가 한 세트처럼 보이게 됐다.

---

## 2026-03-19 쿠팡 제출용 캡처 구도 및 문안 최종본 정리

### 작업 배경

- 사용자는 쿠팡 파트너스 최종승인 제출을 위해 `PC/모바일 캡처 구도`와 `제출 문안 최종본`을 바로 쓸 수 있는 형태로 원했다.
- 기존 문서는 체크리스트 중심이어서, 실제 심사 화면에 어떤 요소를 같이 보여야 하는지와 제출란에 그대로 붙여 넣을 문안이 조금 더 구체적으로 필요했다.

### 반영 내용

- [coupang_final_approval_submission_checklist.md](C:/projects/magok/docs/codex-brain/coupang_final_approval_submission_checklist.md)에 아래 내용을 추가했다.
  - 승인 제출 전제 조건
  - PC 캡처 구도
  - 모바일 캡처 구도
  - 활동 페이지 등록 문안 최종본
  - 스크린샷 첨부 설명 문안
  - 최종승인 요청 메모 문안
  - 짧은 버전 문안
  - 제출 직전 30초 점검표
- 특히 `실제 쿠팡 파트너스 링크/배너/위젯`이 같은 화면에 보여야 한다는 점과, `대가성 문구`가 같은 화면에 함께 있어야 한다는 점을 가장 먼저 보이게 정리했다.
- 문의 이메일은 현재 운영값인 `contact.loopinlab@gmail.com` 기준으로 모든 문안에 맞췄다.

### 검증

- 이번 단계는 문서 정리 작업으로, 별도 코드 수정이나 빌드 작업은 수행하지 않았다.
- 문서 내용은 현재 운영 주소 `https://loopincode.com/`와 반영된 문의 이메일 기준으로 작성했다.

### 결과 요약

- 이제 사용자는 쿠팡 제출 화면에서 그대로 복붙할 수 있는 문안과, 어떤 화면을 캡처해야 하는지에 대한 구체적인 가이드를 한 문서에서 바로 확인할 수 있다.
- 특히 `링크/배너 + 대가성 문구 + 문의 정보`를 어떤 우선순위로 한 화면에 넣어야 하는지 판단이 쉬워졌다.

---

## 2026-03-19 승인용 제휴영역 섹션 추가

### 작업 배경

- 사용자는 문서만이 아니라, 실제 사이트 안에도 쿠팡 제출용으로 바로 캡처할 수 있는 `제휴영역`이 있길 원했다.
- 다만 실제 쿠팡 파트너스 URL은 아직 제공되지 않았기 때문에, 거짓 링크를 넣는 대신 `실제 링크나 배너를 바로 교체할 수 있는 승인용 레이아웃`으로 구성할 필요가 있었다.

### 반영 내용

- [App.tsx](C:/projects/magok/src/App.tsx)에 `승인용 제휴영역` 섹션을 새로 추가했다.
- 섹션 안에는 아래 요소를 함께 배치했다.
  - `링크 카드 자리`
  - `배너 자리`
  - 같은 화면 안의 `대가성 문구`
  - `캡처 리허설` 안내 카드
  - 문의 이메일 안내
- 링크 카드와 배너 자리는 현재 `실제 쿠팡 파트너스 URL로 교체해야 하는 자리`라는 점이 보이도록 점선 카드와 비활성 버튼 형태로 구성했다.
- [App.test.tsx](C:/projects/magok/src/App.test.tsx)에 `승인용 제휴영역`과 `실제 제휴 요소는 이 구역에 넣어 주세요` 문구가 렌더링되는지 검증을 추가했다.
- [coupang_final_approval_submission_checklist.md](C:/projects/magok/docs/codex-brain/coupang_final_approval_submission_checklist.md)도 새 섹션 기준으로 캡처 설명을 보강했다.

### 검증

- `npm run lint` 통과
- `npm run test -- --run` 통과
  - 3개 테스트 파일
  - 15개 테스트 케이스 통과
- `npm run build` 통과
  - `dist/index.html`
  - `dist/assets/index-DMxnKqiy.css`
  - `dist/assets/index-wXWR_llK.js`

### 결과 요약

- 사이트 안에 실제 승인 캡처용으로 쓸 기준 구역이 생겨, 사용자가 어느 위치를 제휴영역으로 잡아야 할지 더 명확해졌다.
- 실제 쿠팡 파트너스 링크만 나중에 꽂으면, 현재 레이아웃 그대로 승인용 캡처 흐름으로 이어갈 수 있게 됐다.

---

## 2026-03-19 쿠팡 실제 링크·배너·위젯 반영

### 작업 배경

- 사용자는 승인용 제휴영역의 플레이스홀더가 아니라 실제 쿠팡 파트너스 링크, 배너, 위젯을 바로 반영해 달라고 요청했다.
- 이번 단계의 목적은 `실제 제휴 요소 + 대가성 문구 + 문의 이메일`이 같은 화면에 함께 보이는 승인 제출용 라이브 구성을 만드는 것이다.

### 반영 내용

- [App.tsx](C:/projects/imomguide_remote_20260319/src/App.tsx)
  - `승인용 제휴영역`의 비활성 플레이스홀더를 제거하고 실제 링크 2개를 버튼형 카드로 교체했다.
  - 실제 728x90 배너와 iframe 위젯을 같은 섹션 안에 추가했다.
  - 각 제휴 링크는 새 탭으로 열리고 `nofollow sponsored noopener` 속성을 붙였다.
  - 대가성 문구와 문의 이메일 `contact.loopinlab@gmail.com`은 같은 섹션 안에서 계속 보이도록 유지했다.
- [App.test.tsx](C:/projects/imomguide_remote_20260319/src/App.test.tsx)
  - 실제 링크 href, 배너 alt, iframe title 렌더링을 검증하도록 보강했다.
- [coupang_final_approval_submission_checklist.md](C:/projects/imomguide_remote_20260319/docs/codex-brain/coupang_final_approval_submission_checklist.md)
  - 현재 사이트에 반영된 실제 링크, 배너, 위젯 정보를 문서에 추가했다.

### 검증

- `npm run lint` 통과
- `npm run test -- --run` 통과
  - 3개 테스트 파일
  - 15개 테스트 케이스 통과
- `npm run build` 통과
  - `dist/index.html`
  - `dist/assets/index-CX7ApAM0.css`
  - `dist/assets/index-xvF1-hNF.js`
- Git 커밋 `dd1f458` (`feat: add live coupang affiliate elements`)를 `codex/magok-site-replace`와 `main`에 모두 푸시했다.
- Cloudflare Pages Preview 새 배포 URL: `https://b641a1af.imomguide.pages.dev`
- Cloudflare Pages Production Active: `https://19879faf.imomguide.pages.dev` (`dd1f458`)
- 운영 도메인 `https://loopincode.com`의 최신 번들 `index-Oex0_FWl.js` 안에 아래 문자열이 모두 포함되는 것을 확인했다.
  - `https://link.coupang.com/a/d7nWco`
  - `https://link.coupang.com/a/d7n7ta`
  - `https://link.coupang.com/a/d7nYOA`
  - `https://coupa.ng/clX3qg`
  - `contact.loopinlab@gmail.com`

### 결과 요약

- 승인용 제휴영역이 더 이상 모형이 아니라 실제 활동 페이지 구조로 바뀌었고, 쿠팡 최종승인용 캡처에 바로 쓸 수 있는 준비 상태가 됐다.

---

## 2026-03-19 실서비스형 쿠팡 노출 축소

### 작업 배경

- 사용자는 현재 메인 페이지가 `승인 통과용 설명`을 너무 크게 노출하고 있어, 실제 서비스 사용자에게는 과하다고 판단했다.
- 이번 단계의 목적은 `실사용자에게는 자연스럽고 작게`, `운영/승인용 정보는 문서로 분리`하는 방향으로 쿠팡 관련 노출을 줄이는 것이다.

### 반영 내용

- [App.tsx](C:/projects/imomguide_remote_20260319/src/App.tsx)
  - `최종승인 준비`, `권장 문구`, `캡처 리허설` 같은 설명성 섹션을 제거했다.
  - 실제 제휴 노출은 `업무용 추천 상품` 섹션으로 축소하고, 버튼형 링크 2개와 작은 iframe 위젯, 짧은 `제휴 안내`만 남겼다.
  - 원래 과하게 노출되던 운영자/승인 카드형 푸터를 간단한 정보 3개로 축소했다.
- [App.test.tsx](C:/projects/imomguide_remote_20260319/src/App.test.tsx)
  - 새로운 `업무용 추천 상품`, `제휴 안내`, `문의` 문구와 실제 링크 href, 위젯 존재 여부를 검증하도록 갱신했다.

### 검증

- `npm run lint` 통과
- `npm run test -- --run` 통과
  - 3개 테스트 파일
  - 15개 테스트 케이스 통과
- `npm run build` 통과
  - `dist/index.html`
  - `dist/assets/index-C8wMFAgN.css`
  - `dist/assets/index-CUSbAYT4.js`
- Git 커밋 `ac6ea69` (`refactor: simplify live affiliate presentation`)를 `codex/magok-site-replace`와 `main`에 모두 푸시했다.
- Cloudflare Pages Production Active: `https://7f8135c5.imomguide.pages.dev` (`ac6ea69`)
- 운영 도메인 `https://loopincode.com`의 최신 번들 `index-BzUj6zdl.js` 안에서 아래 문자열을 확인했다.
  - `업무용 추천 상품`
  - `제휴 안내`
  - `추천 상품 보기`
  - `추가 추천 보기`
  - `문의: contact.loopinlab@gmail.com`
- 같은 번들 안에서 아래 문자열이 제거된 것도 확인했다.
  - `최종승인 준비`
  - `승인용 제휴영역`

### 결과 요약

- 메인 페이지가 다시 `입주가능 판별 서비스` 중심으로 보이게 됐고, 쿠팡 관련 요소는 실제 사용자 경험을 해치지 않는 범위로 줄었다.

---

## 2026-03-19 AdSense 스크립트 및 좌우 고정 배너 반영

### 작업 배경

- 사용자는 AdSense `script`, `ads.txt`, `google-adsense-account meta`가 모두 들어갔는지 다시 확인해 달라고 요청했고, 확인 결과 `script`만 빠져 있었다.
- 추가로 쿠팡 160x600 배너를 좌우에 고정해 스크롤을 내려도 따라오게 넣을 수 있는지 요청했다.

### 반영 내용

- [index.html](C:/projects/imomguide_remote_20260319/index.html)
  - `google-adsense-account` meta 아래에 AdSense async script를 1회 추가했다.
- [App.tsx](C:/projects/imomguide_remote_20260319/src/App.tsx)
  - 쿠팡 160x600 사이드 배너 상수를 추가했다.
  - `2xl` 이상 화면에서만 좌우에 고정되는 배너 2개를 렌더링하도록 반영했다.
  - 메인 `추천 상품` 섹션은 유지해 작은 화면에서는 기존 UX가 그대로 유지되게 했다.
- [App.test.tsx](C:/projects/imomguide_remote_20260319/src/App.test.tsx)
  - `쿠팡 파트너스 사이드 배너` 링크가 2개 렌더링되는지 검증을 추가했다.

### 검증

- `npm run lint` 통과
- `npm run test -- --run` 통과
  - 3개 테스트 파일
  - 15개 테스트 케이스 통과
- `npm run build` 통과
  - `dist/index.html`
  - `dist/assets/index-DsJ3FP3B.css`
  - `dist/assets/index-CzY_qXcO.js`
- Git 커밋 `335d3fa` (`feat: add adsense script and side banners`)를 `codex/magok-site-replace`와 `main`에 모두 푸시했다.
- Cloudflare Pages Production Active: `https://6211b9b1.imomguide.pages.dev` (`335d3fa`)
- 운영 도메인 `https://loopincode.com`의 최신 HTML과 번들에서 아래 항목을 모두 확인했다.
  - `google-adsense-account` meta 1회
  - AdSense async script `pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2916041253392911`
  - `ads.txt` 응답 `google.com, pub-2916041253392911, DIRECT, f08c47fec0942fa0`
  - 번들 `index-CzY_qXcO.js` 안의 `https://link.coupang.com/a/d7pcAe`
  - 번들 `index-CzY_qXcO.js` 안의 `쿠팡 파트너스 사이드 배너`

### 결과 요약

- AdSense 식별 요소는 `meta + ads.txt + script` 3종 구성이 맞춰지게 됐고, 초대형 화면에서는 좌우 고정 배너가 추가로 노출되도록 준비됐다.

---

## 2026-03-19 지식산업센터 기본값 조정

### 작업 배경

- 사용자는 `구역 또는 건물 유형`의 기본값이 `지식산업센터`로 시작하길 원했다.
- 이번 단계의 목적은 첫 화면과 입력 초기화 이후 상태 모두에서 `지식산업센터`를 기본값으로 유지하는 것이다.

### 반영 내용

- [eligibility-store.ts](C:/projects/imomguide_remote_20260319/src/store/eligibility-store.ts)
  - `defaultInput.zoneType`을 `industrialFacility`에서 `knowledgeIndustryCenter`로 변경했다.
- [App.test.tsx](C:/projects/imomguide_remote_20260319/src/App.test.tsx)
  - 초기 렌더링 시 `지식산업센터`가 화면에 보이는지 검증을 추가했다.

### 검증

- `npm run lint` 통과
- `npm run test -- --run` 통과
  - 3개 테스트 파일
  - 15개 테스트 케이스 통과
- `npm run build` 통과
  - `dist/index.html`
  - `dist/assets/index-zpFHZgKx.css`
  - `dist/assets/index-0bqty4mx.js`
- Git 커밋 `df96b26` (`feat: default zone to knowledge industry center`)를 `codex/magok-site-replace`와 `main`에 모두 푸시했다.
- Cloudflare Pages Production Active: `https://d2e8c2d7.imomguide.pages.dev` (`df96b26`)
- `https://loopincode.com`은 확인 시점에 아직 이전 번들 `index-BmeHSo0H.js`, `index-BnevUQsF.css`를 응답하고 있어 커스텀 도메인 캐시 반영이 더 필요했다.

### 결과 요약

- 사용자가 처음 진입하거나 `입력 초기화`를 눌렀을 때 기본 구역이 `지식산업센터`로 일관되게 유지되도록 조정했다.

---

## 2026-03-19 쿠팡 사이드 배너 다이나믹 배너 전환

### 작업 배경

- 사용자는 정적 160x600 이미지 배너 대신 쿠팡 포털에서 생성한 `PartnersCoupang.G` 다이나믹 배너 태그로 사이드 배너를 바꿔 달라고 요청했다.
- 이번 단계의 목적은 기존 좌우 고정 노출 위치는 유지하면서, 실제 태그 사용 가이드 형식에 더 가깝게 다이나믹 배너를 실행하는 것이다.

### 반영 내용

- [coupang-dynamic-banner.tsx](C:/projects/imomguide_remote_20260319/src/components/coupang-dynamic-banner.tsx)
  - 쿠팡 `https://ads-partners.coupang.com/g.js`를 한 번만 로드하는 헬퍼를 추가했다.
  - 각 고정 배너 영역 안에서 `new PartnersCoupang.G(...)`를 실행해 다이나믹 배너를 렌더링하도록 구성했다.
- [App.tsx](C:/projects/imomguide_remote_20260319/src/App.tsx)
  - 기존 정적 이미지 사이드 배너를 제거하고, `id=973794`, `template=carousel`, `trackingCode=AF7474453`, `160x600` 설정의 다이나믹 배너 2개로 교체했다.
- [App.test.tsx](C:/projects/imomguide_remote_20260319/src/App.test.tsx)
  - 외부 스크립트 실행과 무관하게 `쿠팡 파트너스 사이드 배너` 래퍼 2개가 렌더링되는지 검증을 갱신했다.

### 검증

- `npm run lint` 통과
- `npm run test -- --run` 통과
  - 3개 테스트 파일
  - 15개 테스트 케이스 통과
- `npm run build` 통과
  - `dist/index.html`
  - `dist/assets/index-SwaFqRfB.css`
  - `dist/assets/index-Ba9B1Ak6.js`

### 결과 요약

- 좌우 고정 배너는 유지하면서, 배너 콘텐츠 자체는 사용자 제공 태그 기반의 쿠팡 다이나믹 배너로 전환되도록 정리했다.

---

## 2026-03-19 쿠팡 추천 위젯 3종 배치

### 작업 배경

- 사용자는 본문 제휴영역에 새 쿠팡 iframe 위젯 3개를 넣고, 보기 좋게 배치한 뒤 커밋과 배포까지 해 달라고 요청했다.
- 이번 단계의 목적은 단일 위젯 대신 3개 위젯을 `추천 위젯 3종` 카드 그리드로 정리해, 정보 밀도는 높이고 시각적 답답함은 줄이는 것이다.

### 반영 내용

- [App.tsx](C:/projects/imomguide_remote_20260319/src/App.tsx)
  - 기존 단일 `affiliateWidget`을 3개 iframe 위젯 배열로 교체했다.
  - 추천 상품 우측 영역을 `추천 위젯 3종` 카드로 바꾸고, `sm` 이상에서는 2열, `xl`에서는 3열 카드 그리드로 배치했다.
- [App.test.tsx](C:/projects/imomguide_remote_20260319/src/App.test.tsx)
  - `추천 위젯 3종` 제목과 `쿠팡 파트너스 추천 위젯 1~3` iframe title이 렌더링되는지 검증하도록 갱신했다.

### 검증

- `npm run lint` 통과
- `npm run test -- --run` 통과
  - 3개 테스트 파일
  - 15개 테스트 케이스 통과
- `npm run build` 통과
  - `dist/index.html`
  - `dist/assets/index-DXmBQR9h.css`
  - `dist/assets/index-DRsMfrUv.js`

### 결과 요약

- 본문 제휴영역은 단일 위젯보다 훨씬 읽기 쉬운 3종 추천 위젯 카드형 레이아웃으로 정리됐다.
