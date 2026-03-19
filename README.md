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

루트에 있는 아래 파일들은 과거 `아이맘가이드` 정적 소스이며, 현재 웹/데스크톱 진입에 사용되지 않습니다.

- `pregnancy.html`
- `postpartum.html`
- `infant.html`
- `toddler.html`
- `preschool.html`
- `pricing.html`
- `privacy.html`
- `roadmap.html`
- `tools.html`
- `style.css`
- `main.js`

즉, 사이트를 수정할 때는 정적 HTML이 아니라 `src/` 아래 React 앱을 기준으로 작업하면 됩니다.

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
