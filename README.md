# 마곡 코드찾기

마곡 일반산업단지 전용 `업종코드 추천 + 입주 예비판정` 웹/데스크톱 앱입니다.

사용자는 아래 흐름으로 바로 확인할 수 있습니다.

1. 사업 설명 또는 사업자등록증의 `업태 / 종목` 입력
2. 추천 업종코드 확인
3. 마곡 기준 입주 가능성 예비판정 확인

## 현재 진입점

실제 서비스 진입점은 아래입니다.

- 웹: `index.html -> src/main.tsx -> src/App.tsx`
- 데스크톱: `electron/main.mjs`

예전 `아이맘가이드` 정적 HTML/JS/CSS 소스는 정리했고, 이제 저장소에는 loopincode 운영에 필요한 React/Electron 기반 소스만 남겨 둡니다.
즉, 사이트를 수정할 때는 루트 정적 HTML이 아니라 `src/` 아래 React 앱을 기준으로 작업하면 됩니다.

## 기술 스택

- React 18
- TypeScript
- Vite
- Tailwind CSS v4
- shadcn/ui 스타일 컴포넌트
- Zustand
- Electron

## 주요 파일

- 메인 랜딩 및 사이트 구조: `src/App.tsx`
- 업종코드 추천 UI: `src/features/eligibility/components/industry-discovery-panel.tsx`
- 결과 패널: `src/features/eligibility/components/result-panel.tsx`
- 세부 보정 입력: `src/features/eligibility/components/eligibility-form.tsx`
- 판정 엔진: `src/features/eligibility/evaluator.ts`
- 업종 추천 데이터: `src/features/eligibility/data/industry-discovery.ts`
- Electron 진입점: `electron/main.mjs`

## 실행 방법

### 웹 개발 서버

```bash
npm run dev
```

기본 주소:

- [http://localhost:5173](http://localhost:5173)

### 웹 빌드 미리보기

```bash
npm run build
npm run preview
```

### 데스크톱 앱 개발 실행

```bash
npm run desktop:dev
```

### 데스크톱 앱 빌드

```bash
npm run desktop:build
```

확인된 산출물:

- `release/win-unpacked/Magok Code Finder.exe`
- `release/magok-code-finder-win-unpacked.zip`

참고:

- `portable exe` 목표 파일명은 `release/magok-code-finder-0.0.0.exe`다.
- 다만 Windows 환경의 `electron-builder` 캐시/NSIS 상태에 따라 `portable exe`는 지연되거나 실패할 수 있다.
- 현재 가장 안정적으로 바로 실행 가능한 산출물은 `release/win-unpacked/Magok Code Finder.exe`다.

## Cloudflare Pages 배포 메모

- 프로젝트명: `imomguide`
- 연결 도메인: `imomguide.pages.dev`, `loopincode.com`
- 저장소를 Git 연동으로 계속 사용할 경우, Cloudflare Pages의 `Build command`는 `npm run build`, `Build output directory`는 `dist`로 맞춰 두는 것이 안전하다.
- `wrangler.toml`에는 `pages_build_output_dir = "./dist"`를 반영해 두었다.
- 현재 Pages 프로젝트명은 기존 운영 이력 때문에 `imomguide`를 유지하고 있지만, 실제 서비스 소스는 loopincode 기준으로 관리한다.

## 정책 대응 메모

- 현재 공개 버전에서는 홈의 AdSense/제휴 영역을 노출하지 않는다.
- 공개 SEO 페이지도 대표 가이드와 핵심 문서만 export 하도록 축소해 둔다.

## 개발용 법령 조사 워크플로

이 프로젝트는 사용자 화면에서 법령 API를 실시간 조회하지 않습니다.
대신 검증한 법적 근거를 코드에 고정해 두고, 법령 변경이 있을 때만 개발/운영자가 별도로 확인해 반영합니다.

현재 기준으로 [`korean-law-mcp`](https://github.com/chrisryugj/korean-law-mcp)는 이 "개발용 조사 도구" 용도에 가장 잘 맞습니다.

- 용도: 법령, 판례, 해석례, 자치법규를 조사해서 내부 근거 데이터 갱신
- 비권장: 앱 프론트엔드/Electron 런타임에 직접 연결
- 이유: API 키 노출, 네트워크 의존성 증가, 테스트/정적 산출물 재현성 저하

권장 흐름:

1. `korean-law-mcp`로 최신 법령/판례/해석례 확인
2. 프로젝트 코드의 근거 데이터 갱신
3. 관련 테스트와 문서까지 함께 갱신

주요 반영 파일:

- `src/features/eligibility/data/legal-bases.ts`
- `src/features/library/data/legal-library.ts`
- 법령 노출 UI/테스트
- `docs/codex-brain/*`

중요 원칙:

- `LAW_OC` 같은 법제처 API 키는 저장소에 커밋하지 않는다.
- 개인 MCP 설정 파일(`Claude Desktop`, `Cursor`, `Continue` 등)도 저장소에 넣지 않는다.
- 실서비스 판정 로직은 계속 내부 정적 데이터 기준으로 유지한다.

자세한 절차는 `docs/codex-brain/korean-law-mcp-workflow.md`에 정리했다.

## 검증 명령

```bash
npm run lint
npx vitest run src/App.test.tsx --reporter=verbose --pool=threads --maxWorkers=1 --testTimeout=5000
npx vitest run src/features/eligibility/evaluator.test.ts src/features/eligibility/industry-discovery.test.ts --reporter=verbose --pool=threads --maxWorkers=1 --testTimeout=5000
npm run build
```

## 참고

- 법령 및 작업 아티팩트는 `docs/codex-brain/` 아래에 정리되어 있습니다.
- 현재 판정은 `마곡 일반산업단지` 기준이며, `지원시설구역`은 보수적으로 안내합니다.
