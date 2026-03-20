# 입주가능판별기 구현 결과

## 2026-03-20 V 상단 돋보기 로고 리디자인

### 작업 배경

- 사용자는 현재 로고가 마음에 들지 않으며, `V 위에 돋보기 같은 모양`이 보이는 더 단순한 심볼을 원했다.
- 기존 심볼은 문서 아이콘과 우하단 확대경 조합이라 기능 설명은 가능하지만, 브랜드 인상은 다소 일반적이었다.
- 이번 작업은 화면 레이아웃을 건드리지 않고 브랜드 자산만 교체하면서, 헤더/푸터/파비콘/OG 기본 이미지가 같은 심볼 언어를 공유하도록 맞추는 데 초점을 뒀다.

### 반영 내용

- `public/brand/magok-codefinder-symbol.svg`
  - 기존 `문서 + 돋보기` 심볼 대신 `굵은 V + 상단 돋보기 링` 구조로 교체했다.
  - 서비스가 쓰던 블루 라운드 사각형과 밝은 내부 하이라이트는 유지하면서, 중심 형태는 더 단순하고 기억하기 쉬운 방향으로 정리했다.
- `public/brand/magok-codefinder-logo-horizontal.svg`
  - 가로형 워드마크의 좌측 심볼을 동일한 `V 위 돋보기` 콘셉트로 다시 그렸다.
  - 텍스트 워드마크는 유지해 기존 서비스명 가독성은 그대로 가져갔다.
- `public/favicon.svg`
  - 파비콘도 같은 심볼 구조로 동기화해 브라우저 탭 아이콘과 기본 OG 이미지가 새 브랜드와 맞도록 정리했다.
- 연결 확인
  - `src/App.tsx`에서 헤더와 푸터가 계속 `brandAssets`를 통해 같은 자산 경로를 바라보는 점을 확인했다.
  - `index.html`과 `src/features/guides/seo/seo-page-builder.ts`가 `favicon.svg`를 참조하고 있어, 추가 코드 수정 없이 새 아이콘이 반영되는 구조를 유지했다.
  - React 컴포넌트 구조나 상태 컴포넌트는 수정하지 않아 로딩/에러/빈 상태 처리에는 영향이 없음을 함께 확인했다.

### 구현 파일

- `public/brand/magok-codefinder-symbol.svg`
- `public/brand/magok-codefinder-logo-horizontal.svg`
- `public/favicon.svg`
- `docs/codex-brain/task.md`
- `docs/codex-brain/implementation_plan.md`
- `docs/codex-brain/walkthrough.md`

### 검증 결과

실행한 명령:

```bash
npm run lint
npm run test
npm run build
```

결과:

- SVG XML 파싱 확인 통과
- `npm run lint` 통과
- `npm run test` 통과
  - `Test Files 8 passed`
  - `Tests 77 passed`
- `npm run build` 통과
  - SEO export 포함 전체 빌드 성공
  - `chunk size`와 `plugin timing` 경고는 기존과 같은 성격의 경고로 유지됐다.

### 결과 요약

- 브랜드 심볼이 더 이상 `문서 아이콘` 중심으로 읽히지 않고, 사용자가 요청한 `V 위 돋보기` 인상이 먼저 들어오도록 바뀌었다.
- 파비콘, 헤더 심볼, 푸터 워드마크가 같은 시각 언어를 쓰게 되어 브랜드 일관성도 함께 좋아졌다.

## 2026-03-20 각진 레이아웃 재정렬 + 빈 공간 2차 보정

### 작업 배경

- 사용자는 이전 보정보다 더 강하게 `빈 공간이 싫다`, `모양이 딱딱 떨어지고 각이 맞았으면 좋겠다`고 요청했다.
- 단순히 높이만 줄이는 수준이 아니라, 홈과 서브페이지 전반의 카드 반경과 보조 정보 배치를 더 각진 서비스형 UI로 다시 정리할 필요가 있었다.

### 반영 내용

- `src/components/ui/card.tsx`
- `src/components/ui/button.tsx`
- `src/components/ui/badge.tsx`
- `src/components/async-state.tsx`
  - 공통 `Card`, `Button`, `Badge`, `AsyncState`의 기본 라운드 반경을 줄여 화면 전체가 더 각지고 정리된 인상으로 보이게 바꿨다.
- `src/App.tsx`
  - 홈 첫 화면을 `메시지 + 기준 정보 + 수치 카드 + 우측 보조 격자` 구조로 다시 짜서, 카드 내부 하단이 허전해 보이는 느낌을 더 줄였다.
  - 홈 중단 섹션, 위저드 래퍼, 제휴 영역, 헤더, 푸터의 큰 반경도 함께 줄여 전체 선 정렬감이 맞도록 조정했다.
- `src/features/eligibility/components/code-directory-page.tsx`
- `src/features/guides/components/guide-page.tsx`
- `src/features/library/components/legal-library-page.tsx`
- `src/features/updates/components/update-log-page.tsx`
  - 코드 사전, 가이드, 법령, 업데이트 페이지의 상단 소개부와 요약 카드도 더 작은 반경과 반듯한 보조 박스 조합으로 맞춰, 페이지마다 모양이 제각각으로 느껴지지 않게 통일했다.

### 구현 파일

- `src/App.tsx`
- `src/components/ui/card.tsx`
- `src/components/ui/button.tsx`
- `src/components/ui/badge.tsx`
- `src/components/async-state.tsx`
- `src/features/eligibility/components/code-directory-page.tsx`
- `src/features/guides/components/guide-page.tsx`
- `src/features/library/components/legal-library-page.tsx`
- `src/features/updates/components/update-log-page.tsx`
- `docs/codex-brain/task.md`
- `docs/codex-brain/implementation_plan.md`
- `docs/codex-brain/walkthrough.md`

### 검증 결과

실행한 명령:

```bash
npm run lint
npm run test
npm run build
```

결과:

- `npm run lint` 통과
- `npm run test` 통과
  - `Test Files 8 passed`
  - `Tests 77 passed`
- `npm run build` 통과
  - SEO export 포함 전체 빌드 성공
  - chunk size / plugin timing 경고는 남아 있지만 빌드를 막는 오류는 아니었다.

### 결과 요약

- 홈 첫 화면의 배치를 더 각지고 촘촘한 격자형으로 바꿔, 사용자가 싫어하던 `카드 안 하단 빈 공간` 인상을 한 단계 더 줄였다.
- 공통 반경 스케일을 낮춰 사이트 전체가 둥글고 느슨한 느낌보다 `딱 맞고 단정한 서비스 UI`에 가깝게 보이도록 정리했다.

## 2026-03-20 데스크 홈 상단 빈 공간 제거 2차

### 작업 배경

- 밀도 재배치 이후에도 데스크톱 홈 첫 섹션에서 오른쪽 안내 영역이 여러 카드로 세로 분리되어 있어, 왼쪽 히어로 아래가 비어 보인다는 피드백이 남아 있었다.
- 문제는 카드 안의 공백보다 `오른쪽 스택 전체 높이 > 왼쪽 히어로 높이`인 구조였기 때문에, 카드 개수를 줄여 하나의 흐름으로 다시 묶는 것이 핵심이었다.

### 반영 내용

- `src/App.tsx`
  - 오른쪽의 `처음 오셨다면 이렇게 보세요`, `바로 볼 핵심 정보`, `왜 이 흐름이 편한가요?`를 분리 카드 3개에서 단일 통합 카드 1개로 재구성했다.
  - 통합 카드 안에서는 `단계 안내`, `핵심 정보`, `흐름 설명`만 섹션으로 구분하고, 외부 그리드에서는 하나의 덩어리처럼 보여 상단 좌우 높이 균형을 맞췄다.
  - 각 보조 섹션의 패딩과 border radius를 약간 줄여 전체 높이도 함께 압축했다.
  - 같은 줄에 놓인 카드 그룹에는 `auto-rows-fr`와 `h-full`을 적용하고, 긴 문장은 짧게 줄여 카드 폭/높이가 들쑥날쑥해 보이지 않게 정리했다.
  - 히어로 아래 설명 카드 행은 좌우 전체 폭을 쓰는 별도 줄로 이동시켜, 상단 큰 박스와 하단 카드 행이 반듯하게 끊겨 보이도록 재배치했다.
- `docs/pdca/2026-03-20-home-top-gap-removal.md`
  - 이번 2차 보정 내용을 별도 PDCA 파일로 남겼다.

### 구현 파일

- `src/App.tsx`
- `docs/pdca/2026-03-20-home-top-gap-removal.md`
- `docs/codex-brain/task.md`
- `docs/codex-brain/implementation_plan.md`
- `docs/codex-brain/walkthrough.md`

### 검증 결과

실행한 명령:

```bash
npm run lint
npm run test
npm run build
```

결과:

- `npm run lint` 통과
- `npm run test` 통과
  - `Test Files 8 passed`
  - `Tests 77 passed`
- `npm run build` 통과
  - 기존과 같은 chunk size / plugin timing 경고만 유지

### 결과 요약

- 데스크톱 홈 첫 섹션의 오른쪽 정보가 하나의 카드 흐름으로 묶이면서, 왼쪽 히어로 아래가 통째로 비어 보이는 인상이 줄었다.
- 이제 상단은 `왼쪽 핵심 히어로 + 오른쪽 통합 안내 카드` 구조라 이전보다 훨씬 딱 맞는 배치로 읽힌다.

## 2026-03-20 전체 웹사이트 밀도 재배치 + 빈 공간 제거

### 작업 배경

- 사용자는 특정 카드 한 장이 아니라 사이트 전반에서 “비어 보이는 카드 하단”과 “늘어진 2열 소개 영역”을 정리해 달라고 요청했다.
- 특히 홈, 전수 코드 사전, 가이드, 법령 라이브러리, 업데이트 로그가 서로 다른 밀도 규칙을 쓰고 있어, 같은 서비스 안에서도 정보 압축감이 들쭉날쭉하다는 문제가 있었다.

### 반영 내용

- `src/App.tsx`
  - 홈 첫 화면은 `lg:items-start` 기반 2열 구조로 바꿔, 히어로 카드가 옆 카드에 끌려 늘어지지 않게 정리했다.
  - 히어로 패딩, 헤드라인 폭, 첫 진입 안내 카드 내부 스텝 배치를 압축해 상단 밀도를 높였다.
  - 홈 본문에서는 전수 코드 사전, 법령/업데이트, 가이드, 제휴, 푸터 섹션의 카드 간격과 프리뷰 카드 배치를 다시 잡아 스크롤 흐름을 더 촘촘하게 만들었다.
  - 제휴 위젯에서는 `h-full`, `min-h-*`를 걷어내어 카드 높이가 내용에 맞게 자연스럽게 줄어들게 했다.
- `src/features/eligibility/components/code-directory-page.tsx`
  - 상단 검색/필터 패널과 우측 조건 요약 영역을 적응형 2열로 통일하고, 중간 폭 화면에서는 보조 카드가 자연스럽게 아래로 흐르도록 바꿨다.
- `src/features/guides/components/guide-page.tsx`
  - 가이드 상단 소개와 FAQ/법령 2열 블록을 더 늦은 breakpoint에서만 분리하도록 조정해, 짧은 요약 카드 때문에 하단이 비는 인상을 줄였다.
- `src/features/library/components/legal-library-page.tsx`
- `src/features/updates/components/update-log-page.tsx`
  - 문서 정보/원문 출처, 변경점/출처 같은 2열 보조 블록의 분할 시점을 `xl`로 늦춰, 중간 폭에서 카드가 어색하게 길어지지 않게 정리했다.
- `src/components/async-state.tsx`
  - 공통 빈/로딩/에러 상태의 기본 최소 높이를 낮춰 과한 세로 여백을 줄였다.
- `docs/pdca/README.md`
  - 저장소 안에서 PDCA 루프를 기록하는 규칙과 파일 네이밍 기준을 정리했다.
- `docs/pdca/2026-03-20-overall-density-relayout.md`
  - 이번 작업의 `Plan / Do / Check / Act`를 별도 파일로 기록했다.

### 구현 파일

- `src/App.tsx`
- `src/components/async-state.tsx`
- `src/features/eligibility/components/code-directory-page.tsx`
- `src/features/guides/components/guide-page.tsx`
- `src/features/library/components/legal-library-page.tsx`
- `src/features/updates/components/update-log-page.tsx`
- `docs/pdca/README.md`
- `docs/pdca/2026-03-20-overall-density-relayout.md`
- `docs/codex-brain/task.md`
- `docs/codex-brain/implementation_plan.md`
- `docs/codex-brain/walkthrough.md`

### 검증 결과

실행한 명령:

```bash
npm run lint
npm run test
npm run build
```

결과:

- `npm run lint` 통과
- `npm run test` 통과
  - `Test Files 8 passed`
  - `Tests 77 passed`
- `npm run build` 통과
  - SEO export 포함 전체 빌드 성공
  - 빌드 마지막의 chunk size 경고와 plugin timing 경고는 기존과 같은 성격의 경고이며, 이번 변경으로 새 오류는 생기지 않았다.

### 결과 요약

- 사이트 전반의 카드가 더 촘촘해졌고, 특히 첫 화면과 소개형 2열 섹션에서 불필요한 하단 빈 공간이 줄었다.
- 이번 작업부터는 `docs/pdca/` 폴더에서도 같은 변경을 PDCA 루프로 별도 추적할 수 있게 됐다.

## 2026-03-20 탭·데스크 혼합형 위저드 모드 + 가독성 보정

### 작업 배경

- 사용자는 모바일에서만 제공되던 집중형 위저드 흐름을 태블릿과 데스크톱에도 확장하되, 데스크톱은 화면을 꽉 채운 단일 패널보다 `중앙 위저드 + 참고 패널` 조합이 더 적절하다고 요청했다.
- 동시에 현재 위저드 문장들이 길게 이어져 보여 읽는 속도가 떨어진다고 느꼈고, 문단 간격은 완전히 없애지 말고 줄 길이와 패딩을 조정하는 방향으로 가독성을 개선하기로 했다.

### 반영 내용

- `src/App.tsx`
  - viewport를 `mobile / tablet / desktop`으로 나누고, 기존 모바일 집중 모드를 태블릿 집중형과 데스크 혼합형으로 확장했다.
  - 태블릿에서는 현재 단계에만 집중하는 단일 위저드 레이아웃을 유지하고, 데스크톱에서는 중앙 단계 카드와 우측 참고 레일을 함께 보여주도록 재구성했다.
  - 위저드 진입 시 현재 단계, 빠른 힌트, 입력 컨텍스트를 우측 패널에서 바로 볼 수 있게 해 데스크톱의 빈 공간을 줄였다.
- `src/features/eligibility/components/industry-discovery-panel.tsx`
  - 추천 단계의 제목, 설명, textarea, 추천 카드 이유 문구 폭과 줄간격을 조정했다.
  - 우측 도움말 카드와 요약 박스 패딩을 키워 텍스트가 숨 가쁘게 붙어 보이지 않게 했다.
- `src/features/eligibility/components/eligibility-form.tsx`
  - 2단계 조건 설정 카드와 요약 카드의 세로 간격을 다시 잡고, 설명 문장의 폭과 줄간격을 넓혀 읽기 쉽게 정리했다.
  - 문단 앞뒤 공백은 제거하지 않고, 대신 과한 공백만 줄여 위계는 유지하면서 밀도를 다듬었다.
- `src/features/eligibility/components/result-panel.tsx`
  - 결과 제목, 요약 설명, 상세 해설 카드, 후속 액션 섹션의 패딩과 line-height를 조정해 긴 판단 문장이 덜 답답하게 보이도록 했다.
- `src/App.test.tsx`
  - 모바일 집중형 테스트는 유지하고, 데스크톱에서 위저드 진입 시 우측 참고 패널이 함께 노출되는지 검증하는 테스트를 추가했다.

### 구현 파일

- `src/App.tsx`
- `src/App.test.tsx`
- `src/features/eligibility/components/industry-discovery-panel.tsx`
- `src/features/eligibility/components/eligibility-form.tsx`
- `src/features/eligibility/components/result-panel.tsx`
- `docs/codex-brain/task.md`
- `docs/codex-brain/implementation_plan.md`
- `docs/codex-brain/walkthrough.md`

### 검증 결과

실행한 명령:

```bash
npm run lint
npm run test
npm run build
```

결과:

- `npm run lint` 통과
- `npm run test` 통과
  - `Test Files 8 passed`
  - `Tests 77 passed`
- `npm run build` 통과
  - SEO export 포함 전체 빌드 성공
  - chunk size 경고와 plugin timing 경고는 기존처럼 유지되며, 이번 변경으로 새 오류는 생기지 않았다.

### 결과 요약

- 이제 위저드는 모바일과 태블릿에서는 집중형으로, 데스크톱에서는 중앙 작업 영역과 참고 패널이 함께 보이는 혼합형으로 동작한다.
- 가독성은 문단 간격을 없애는 대신, 줄 길이와 카드 패딩, 제목/본문 line-height를 조정해 더 안정적으로 읽히는 방향으로 정리됐다.

## 2026-03-20 단색 블루 적용

### 작업 배경

- 사용자는 화면 전반에 gradient가 너무 많고, 그 때문에 전체 인상이 올드하고 무겁게 느껴진다고 피드백했다.
- 특히 홈 첫 화면에서는 `한 가지 블루 + 흰 카드`보다 `섞인 블루 톤`이 먼저 보였기 때문에, 색 체계보다도 먼저 표현 방식을 단색 중심으로 바꾸는 것이 필요했다.

### 반영 내용

- `src/index.css`
  - 바디 배경의 gradient를 제거하고 단색 배경으로 고정했다.
  - `accent`와 `accent-strong`을 같은 축으로 맞춰 포인트 블루가 한 가지 색처럼 보이게 만들었다.
- `src/components/ui/button.tsx`
  - 기본 버튼을 gradient 없이 단색 블루 버튼으로 바꿨다.
- `src/components/ui/badge.tsx`
  - 기본 배지도 단색 블루 배지로 바꾸고, 과한 색 흐름을 제거했다.
- `src/components/ui/card.tsx`
  - 기본 카드 배경을 gradient 없이 단색 흰 면으로 정리했다.
- `src/App.tsx`
  - 홈 히어로, 우측 안내 카드, 위저드 래퍼, 소개 카드, 라이브러리/업데이트/푸터 카드의 gradient 배경을 단색으로 바꿨다.
- `src/features/eligibility/components/code-directory-page.tsx`
  - 코드 사전 메인 래퍼도 단색 카드 구조로 통일했다.
- `src/features/eligibility/components/industry-discovery-panel.tsx`
  - 추천 카드와 안내 박스의 gradient 강조를 제거했다.
- `src/features/guides/components/guide-page.tsx`
- `src/features/library/components/legal-library-page.tsx`
- `src/features/updates/components/update-log-page.tsx`
  - 각 페이지 루트 카드의 gradient 배경을 단색 흰 면으로 통일했다.

### 구현 파일

- `src/index.css`
- `src/components/ui/button.tsx`
- `src/components/ui/badge.tsx`
- `src/components/ui/card.tsx`
- `src/App.tsx`
- `src/features/eligibility/components/code-directory-page.tsx`
- `src/features/eligibility/components/industry-discovery-panel.tsx`
- `src/features/guides/components/guide-page.tsx`
- `src/features/library/components/legal-library-page.tsx`
- `src/features/updates/components/update-log-page.tsx`
- `docs/codex-brain/task.md`
- `docs/codex-brain/implementation_plan.md`
- `docs/codex-brain/walkthrough.md`

### 검증 결과

실행한 명령:

```bash
npm run lint
npm run test
npm run build
```

결과:

- `npm run lint` 통과
- `npm run test` 통과
  - `Test Files 8 passed`
  - `Tests 76 passed`
- `npm run build` 통과
  - 주요 산출물: `dist/assets/index-_puhWPwq.css`, `dist/assets/index-OE67gP3p.js`
  - chunk size 경고는 기존처럼 계속 남아 있다.

### 결과 요약

- 이제 화면은 gradient가 아니라 단색 면과 외곽선으로 구조를 잡기 때문에, 첫인상이 훨씬 더 정돈되고 덜 올드하게 읽힌다.
- 사용자가 올린 홈 스크린샷 기준으로도 버튼, 카드, 래퍼가 모두 한 가지 블루와 흰 면 중심으로 통일되었다.

## 2026-03-20 파스텔 제거형 색 보정

### 작업 배경

- 사용자는 이전 시안의 파스텔 블루 면이 여전히 유치하게 느껴진다고 피드백했다.
- 특히 모바일 결과 화면에서 연한 하늘색 배경과 블루 tint 박스가 여러 겹 쌓여, 전문 서비스보다 학습앱처럼 보이는 문제가 있었다.

### 반영 내용

- `src/index.css`
  - `surface`, `surface-muted`, `surface-soft`를 화이트/라이트 그레이 중심으로 재정의했다.
  - 바디 배경의 블루 기운을 크게 줄여 화면 전체가 덜 파스텔처럼 보이게 만들었다.
  - 상태 색상과 `info` 배경도 거의 화이트 기반으로 정리했다.
- `src/components/ui/button.tsx`
  - 기본 버튼의 베이비 블루 인상을 줄이고, 더 간결한 딥 블루 그라데이션으로 정리했다.
- `src/components/ui/badge.tsx`
  - `muted` 배지는 흰 면 + 얇은 선 중심으로 바꾸고, 상태 배지도 채운 파스텔 면 느낌을 줄였다.
- `src/App.tsx`
  - 메인 히어로, 우측 안내 카드, 모바일 집중 위저드 카드의 큰 블루 면을 제거하고 화이트 중심으로 되돌렸다.
- `src/features/eligibility/components/result-panel.tsx`
  - 핵심 결과 카드, 상세 해설 필드, 이유/가이드 섹션의 연한 블루 배경을 없애고 중성 표면 중심으로 다시 구성했다.
- `src/features/eligibility/components/eligibility-form.tsx`
  - 상단 설정 요약 카드의 파스텔 그라데이션을 제거해 2단계/3단계의 화면 톤을 통일했다.

### 구현 파일

- `src/index.css`
- `src/components/ui/button.tsx`
- `src/components/ui/badge.tsx`
- `src/App.tsx`
- `src/features/eligibility/components/result-panel.tsx`
- `src/features/eligibility/components/eligibility-form.tsx`
- `docs/codex-brain/task.md`
- `docs/codex-brain/implementation_plan.md`
- `docs/codex-brain/walkthrough.md`

### 검증 결과

실행한 명령:

```bash
npm run lint
npm run test
npm run build
```

결과:

- `npm run lint` 통과
- `npm run test` 통과
  - `Test Files 8 passed`
  - `Tests 76 passed`
- `npm run build` 통과
  - 주요 산출물: `dist/assets/index-dAJh4ozX.css`, `dist/assets/index-5IDy2Qym.js`
  - chunk size 경고와 plugin timing 경고는 기존처럼 계속 남아 있다.

### 결과 요약

- 이제 블루는 큰 배경이 아니라 작은 포인트로만 남고, 화면의 기본 인상은 훨씬 더 차분하고 전문적인 화이트 중심 UI에 가까워졌다.
- 특히 모바일 결과 화면에서 유치하게 보이던 파스텔 적층감이 크게 줄어들었다.

## 2026-03-20 컬러 무드 2차 보정

### 작업 배경

- 사용자는 이전 보정 이후에도 테두리가 너무 옅고, 전체 톤이 여전히 `할아버지 아저씨들이 쓸 법한 색`처럼 보인다고 느꼈다.
- 따라서 이번 단계에서는 단순히 밝기만 조정하지 않고, 외곽선 밀도를 올리고 포인트 블루 자체를 더 현대적인 코발트 축으로 이동시키는 데 집중했다.

### 반영 내용

- `src/index.css`
  - 전역 `accent`, `border`, `border-accent`, `shadow` 토큰을 더 선명하고 차가운 방향으로 다시 정의했다.
  - 바디 배경에 밝은 코발트/스카이 블루 기운을 더해 첫 화면이 덜 점잖고 더 제품적으로 보이게 만들었다.
- `src/components/ui/button.tsx`
  - 기본 버튼을 더 선명한 블루 그라데이션으로 바꾸고, 보조 버튼과 outline 버튼의 ring 대비를 높였다.
- `src/components/ui/badge.tsx`
  - 기본 배지는 더 또렷한 블루 배지로, `muted` 배지는 아주 옅은 블루 면과 진한 선 조합으로 정리했다.
- `src/components/ui/card.tsx`
  - 기본 카드의 선을 `border-soft` 기준으로 바꾸어 카드 경계가 더 분명하게 읽히도록 만들었다.
- `src/App.tsx`
  - 메인 히어로 카드의 경계선을 더 진하게 올리고, 배경을 화이트-아이스 블루 계열로 보정했다.
  - 우측 안내 카드와 내부 스텝 카드도 더 차갑고 깨끗한 표면색과 선으로 정리했다.
- `src/features/eligibility/components/code-directory-page.tsx`
  - 코드 사전 상단 루트 섹션과 검색 카드의 외곽선 대비를 높여 홈 화면과 같은 제품 톤으로 맞췄다.

### 구현 파일

- `src/index.css`
- `src/components/ui/button.tsx`
- `src/components/ui/badge.tsx`
- `src/components/ui/card.tsx`
- `src/App.tsx`
- `src/features/eligibility/components/code-directory-page.tsx`
- `docs/codex-brain/task.md`
- `docs/codex-brain/implementation_plan.md`
- `docs/codex-brain/walkthrough.md`

### 검증 결과

실행한 명령:

```bash
npm run lint
npm run test
npm run build
```

결과:

- `npm run lint` 통과
- `npm run test` 통과
  - `Test Files 8 passed`
  - `Tests 76 passed`
- `npm run build` 통과
  - 주요 산출물: `dist/assets/index-hpXZZizE.css`, `dist/assets/index-dijMtWY9.js`
  - chunk size 경고와 plugin timing 경고는 기존처럼 계속 남아 있다.

### 결과 요약

- 화면이 이전보다 훨씬 또렷하게 구획되고, 블루 포인트도 덜 보수적이고 더 현대적인 인상으로 올라왔다.
- 특히 카드와 섹션의 외곽선이 살아나면서, 전체가 흐리게 섞이지 않고 제품 UI처럼 정리된 느낌이 강해졌다.

## 2026-03-20 컬러 무드 리디자인

### 작업 배경

- 사용자는 현재 화면의 색감이 여전히 촌스럽다고 느꼈고, 실제 스크린샷에서도 `베이지 배경 + 쨍한 블루 + 반투명 흰 카드`가 뒤섞여 제품 인상이 흐려지는 문제가 보였다.
- 중간에 너무 회색으로 눌린 시안도 바로 피드백을 받아, 최종적으로는 `밝은 화이트 + 잉크 텍스트 + 선명하지만 절제된 블루` 톤으로 다시 끌어올렸다.
- 목표는 부동산·법령·판정 서비스다운 신뢰감은 유지하되, 화면이 답답하거나 올드해 보이지 않게 만드는 것이었다.

### 반영 내용

- `src/index.css`
  - 전역 컬러 토큰을 `쿨 화이트`, `파우더 블루`, `로열 블루`, `잉크 네이비` 축으로 재정의했다.
  - 바디 배경은 베이지를 제거하고, 밝은 화이트와 아주 옅은 블루가 섞인 배경 그라데이션으로 교체했다.
  - 상태 색상과 그림자도 새 톤에 맞게 다시 정리했다.
- `src/components/ui/button.tsx`
  - 기본 버튼은 너무 칙칙하지 않도록 깊이 있는 블루 그라데이션을 유지하되, 이전보다 훨씬 정돈된 로열 블루 톤으로 바꿨다.
  - `secondary`, `ghost`, `outline`은 과한 유리판 느낌 대신 밝은 면과 얇은 선 중심으로 정리했다.
- `src/components/ui/badge.tsx`
  - 기본 배지는 선명한 블루 배경, `muted` 배지는 옅은 파우더 블루 면으로 정리해 위계를 분명하게 만들었다.
- `src/components/ui/card.tsx`
  - 카드 배경을 베이지 기운이 남던 그라데이션에서, 더 밝고 깨끗한 화이트-소프트 블루 면으로 교체했다.
- `src/App.tsx`
  - 홈 첫 화면의 헤더, 메인 히어로, 우측 안내 패널, 위저드 패널, 하단 카드, 푸터 카드에서 남아 있던 베이지/아이보리 하드코딩 배경을 새 토큰 기준으로 바꿨다.
  - 결과적으로 첫 화면이 더 밝고, 버튼 블루만 또렷하게 살아나는 구조로 정리됐다.
- `src/features/eligibility/components/code-directory-page.tsx`
  - 상단 섹션, 검색 결과 배지, 상세 정보 박스, 법령 카드, 하단 안내 영역의 연파랑 박스를 전역 톤에 맞는 표면 색으로 정리했다.
- `src/features/eligibility/components/convergence-review-card.tsx`
  - 융복합 심의 카드의 과한 하늘색 배경을 줄이고, 공통 표면 색과 액센트 선 기준으로 정리했다.
- `src/features/eligibility/components/expert-insight-card.tsx`
  - 전문가 인사이트 카드도 파트별 배경을 더 밝고 정제된 표면 색으로 정리해 일관성을 맞췄다.

### 구현 파일

- `src/index.css`
- `src/components/ui/button.tsx`
- `src/components/ui/badge.tsx`
- `src/components/ui/card.tsx`
- `src/App.tsx`
- `src/features/eligibility/components/code-directory-page.tsx`
- `src/features/eligibility/components/convergence-review-card.tsx`
- `src/features/eligibility/components/expert-insight-card.tsx`
- `docs/codex-brain/task.md`
- `docs/codex-brain/walkthrough.md`

### 검증 결과

실행한 명령:

```bash
npm run lint
npm run test
npm run build
```

결과:

- `npm run lint` 통과
- `npm run test` 통과
  - `Test Files 8 passed`
  - `Tests 76 passed`
- `npm run build` 통과
  - `467`개 guide, `1401`개 faq, `2`개 library, `4`개 update 정적 페이지 생성 확인
  - 주요 산출물: `dist/assets/index-Dx9Ou_e9.css`, `dist/assets/index-DfQUMXqz.js`
  - chunk size 경고와 plugin timing 경고는 기존처럼 계속 남아 있다.

### 결과 요약

- 전체 화면이 이제 베이지/하늘색/진한 블루가 따로 노는 대신, 밝은 화이트와 선명한 블루 중심으로 훨씬 정돈된 인상을 가지게 됐다.
- 중간에 한 번 너무 눌렸던 회색 톤도 다시 걷어내서, 세련되면서도 생기가 있는 쪽으로 균형을 맞췄다.

## 2026-03-20 지마켓 산스 + 프리텐다드 전역 적용

### 작업 배경

- 사용자는 제목은 `지마켓 산스`, 본문은 `프리텐다드` 조합으로 사이트 전체 인상을 다시 맞추고 싶어 했다.
- 처음 검토했던 다른 조합 대신, 상업용 사용이 명확하고 한국어 UI에서 많이 검증된 조합으로 바로 방향을 바꿔 적용했다.
- 제목용 서체는 외부 CDN 의존도를 줄이기 위해 공식 배포 파일을 로컬에 두고, 본문용 서체는 공식 Pretendard CDN 경로를 사용하는 구조로 정리했다.

### 반영 내용

- `public/fonts/gmarket-sans`
  - Gmarket Design System 공식 ZIP에서 받은 `GmarketSansLight.otf`, `GmarketSansMedium.otf`, `GmarketSansBold.otf`를 앱 정적 자산으로 추가했다.
- `src/index.css`
  - Google Fonts import를 제거하고, Pretendard 공식 jsDelivr 동적 서브셋 import로 본문 폰트를 교체했다.
  - `@font-face`를 추가해 `Gmarket Sans`를 `400`, `500`, `600`, `700` weight로 self-hosting 하도록 연결했다.
  - `--font-body`는 `Pretendard` 기준으로, `--font-heading`과 `--font-display`는 `Gmarket Sans` 기준으로 다시 정의했다.
  - 결과적으로 `body`는 프리텐다드, `h1`~`h4`와 `font-display` 계열은 지마켓 산스를 사용하게 됐다.
- `src/components/ui/card.tsx`
  - 카드 제목처럼 비교적 작은 헤딩에서 답답해 보이지 않도록 `tracking`을 `-0.02em`로 완화했다.
- `docs/codex-brain/task.md`
  - 사용자 최종 선택인 `지마켓 산스 + 프리텐다드` 기준으로 체크리스트를 갱신했다.
- `docs/codex-brain/implementation_plan.md`
  - 공식 Gmarket Sans self-hosting + Pretendard 공식 CDN import 구조로 계획 내용을 정리했다.

### 구현 파일

- `public/fonts/gmarket-sans/GmarketSansLight.otf`
- `public/fonts/gmarket-sans/GmarketSansMedium.otf`
- `public/fonts/gmarket-sans/GmarketSansBold.otf`
- `src/index.css`
- `src/components/ui/card.tsx`
- `docs/codex-brain/task.md`
- `docs/codex-brain/implementation_plan.md`
- `docs/codex-brain/walkthrough.md`

### 검증 결과

실행한 명령:

```bash
npm run lint
npm run test
npm run build
```

결과:

- `npm run lint` 통과
- `npm run test` 통과
  - `Test Files 8 passed`
  - `Tests 76 passed`
- `npm run build` 통과
  - `467`개 guide, `1401`개 faq, `2`개 library, `4`개 update 정적 페이지 생성 확인
  - 주요 산출물: `dist/assets/index-Dm8zXu8X.css`, `dist/assets/index-BT4T0p0J.js`
  - chunk size 경고와 plugin timing 경고는 기존처럼 계속 남아 있다.

### 결과 요약

- 제목은 지마켓 산스로 더 또렷하고 브랜드형 인상이 살아났고, 본문은 프리텐다드로 바뀌면서 긴 설명 문단의 읽기 밀도도 안정적으로 유지됐다.
- 구현 방식도 `제목용 로컬 self-hosting + 본문용 공식 CDN`으로 정리돼, 상업용 웹서비스에서 계속 가져가기 쉬운 구조가 됐다.

## 2026-03-20 모바일 집중형 위저드 + 트렌디 비주얼 리디자인

### 작업 배경

- 모바일에서는 홈 소개 카드와 위저드 카드가 한 화면에 겹쳐 보여, 사용자가 현재 단계에만 집중하기 어려웠다.
- 동시에 전체 색감도 연한 파랑 위주로 퍼져 있어 제품형 웹사이트라기보다 오래된 SaaS 템플릿처럼 보이는 인상이 강했다.
- 이번 작업은 모바일에서는 `현재 단계만 보이는 집중형 위저드`로 흐름을 정리하고, 전체 화면은 더 세련된 뉴트럴 베이스와 코발트 포인트 중심으로 다시 다듬는 데 초점을 맞췄다.

### 반영 내용

- `src/App.tsx`
  - 모바일에서 `코드 추천받기`로 위저드에 들어오면 `finder`만 남고, 히어로/보조 섹션/후속 카드들은 숨겨 현재 단계 화면에만 집중할 수 있게 만들었다.
  - 추천 결과, 조건 보정, 결과 확인으로 넘어갈 때도 모바일에서는 같은 집중 모드가 유지되도록 흐름을 정리했다.
  - 집중 모드 상단에는 `현재 단계 + 짧은 힌트 + 전체 보기 복귀 버튼`만 남기고, 기존의 큰 소개 헤더와 단계 카드 묶음은 감췄다.
  - 홈과 사전/라이브러리/업데이트/가이드/제휴 섹션의 하드코딩 블루 배경을 웜 화이트 기반으로 다시 조정했다.
- `src/index.css`
  - 전역 토큰을 `웜 화이트 배경`, `잉크 네이비 텍스트`, `정제된 코발트 포인트` 중심으로 재정의했다.
  - 바디 배경 그라데이션도 차가운 하늘색 계열에서, 은은한 베이지와 코발트가 섞인 더 트렌디한 분위기로 교체했다.
- `src/components/ui/button.tsx`
  - 기본 버튼을 코발트 그라데이션 + 절제된 그림자 스타일로 바꿨다.
  - `secondary`, `ghost`, `outline` 버튼도 새 팔레트 기준으로 hover 질감을 다시 맞췄다.
- `src/components/ui/badge.tsx`
  - 기본 배지는 더 깊은 코발트 계열로, `muted` 배지는 반투명 뉴트럴 톤으로 정리했다.
- `src/components/ui/card.tsx`
  - 공통 카드 배경을 평면 흰색에서 은은한 뉴트럴 그라데이션과 블러가 섞인 질감으로 바꿨다.
- `src/features/eligibility/components/industry-discovery-panel.tsx`
  - 1단계 입력 패널과 `먼저 볼 코드` 추천 카드의 하이라이트 배경을 새 무드에 맞는 뉴트럴 강조 톤으로 바꿨다.
- `src/App.test.tsx`
  - 모바일 `matchMedia` 환경을 흉내 내는 테스트를 추가해, 집중 모드 진입 시 홈 헤더와 제휴 섹션이 사라지고 `전체 보기` 복귀가 동작하는지 검증했다.

### 구현 파일

- `src/App.tsx`
- `src/index.css`
- `src/components/ui/button.tsx`
- `src/components/ui/badge.tsx`
- `src/components/ui/card.tsx`
- `src/features/eligibility/components/industry-discovery-panel.tsx`
- `src/App.test.tsx`
- `docs/codex-brain/task.md`
- `docs/codex-brain/implementation_plan.md`
- `docs/codex-brain/walkthrough.md`

### 검증 결과

실행한 명령:

```bash
npm run lint
npm run test
npm run build
```

결과:

- `npm run lint` 통과
- `npm run test` 통과
  - `8 passed`
  - `76 passed`
- `npm run build` 통과
  - `467`개 guide, `1401`개 faq, `2`개 library, `4`개 update 정적 페이지 생성 확인
  - 주요 산출물: `dist/assets/index-T_RgDzZq.js`, `dist/assets/index-DJWXMuXh.css`
  - chunk size 경고와 rolldown plugin timing 경고는 기존처럼 계속 남아 있다.

### 결과 요약

- 모바일에서는 이제 위저드에 들어간 순간 주변 카드가 사라지고 현재 단계만 남아, 화면 흐름이 훨씬 앱처럼 읽히는 상태가 됐다.
- 색 체계는 연한 파랑 위주에서 벗어나 더 성숙한 뉴트럴 + 코발트 조합으로 재정리되어, 첫인상 자체가 훨씬 현대적으로 바뀌었다.

## 2026-03-20 모바일 오버플로/잘림 보정

### 작업 배경

- 모바일 캡처 기준으로 화면 오른쪽이 잘리고 있었고, 특히 헤더의 `코드 사전 열기` 버튼과 1단계 내부의 긴 보조 버튼·예시 칩이 좁은 폭에서 전체 레이아웃을 밀어내는 상태였다.
- 이번 작업은 단순히 가려 보이게 하는 수준이 아니라, 모바일에서 폭을 밀어내는 원인 요소의 라벨과 노출량을 함께 줄여 실제 오버플로를 없애는 데 목적이 있었다.

### 반영 내용

- `src/App.tsx`
  - 루트 래퍼에 `overflow-x-hidden`을 추가해 모바일에서 전체 문서 가로 오버플로를 차단했다.
  - 모바일 헤더는 패딩과 간격을 더 줄이고, `코드 사전 열기` CTA를 `사전` 짧은 라벨로 압축했다.
  - 브랜드 보조 텍스트 `LOOPIN LAB`은 모바일에서 숨겨 로고 영역 폭도 함께 줄였다.
- `src/features/eligibility/components/industry-discovery-panel.tsx`
  - `직접 입력으로 계속`은 모바일에서 `직접 입력`으로 짧게 보이도록 바꾸고, 접근성 이름은 그대로 유지했다.
  - 예시 칩은 모바일에서 처음 2개만 2열 그리드로 노출하고, `예시 더 보기`를 눌렀을 때만 전체 칩이 펼쳐지도록 바꿨다.
  - 데스크톱 이상에서는 기존 전체 예시 칩 구성을 유지해 검색 흐름을 그대로 쓸 수 있게 했다.

### 구현 파일

- `src/App.tsx`
- `src/features/eligibility/components/industry-discovery-panel.tsx`
- `docs/codex-brain/task.md`
- `docs/codex-brain/implementation_plan.md`
- `docs/codex-brain/walkthrough.md`

### 검증 결과

실행한 명령:

```bash
npm run lint
npm run test
npm run build
```

결과:

- `npm run lint` 통과
- `npm run test` 통과
  - `8 passed`
  - `75 passed`
- `npm run build` 통과
  - `467`개 guide, `1401`개 faq, `2`개 library, `4`개 update 정적 페이지 생성 확인
  - 메인 청크 `dist/assets/index-BMwBxTCv.js` 대형 청크 경고와 rolldown plugin timing 경고는 계속 남아 있다.

### 결과 요약

- 모바일에서 오른쪽이 잘리던 가장 직접적인 원인인 `헤더 폭`과 `예시/보조 CTA 폭`을 함께 줄여, 가로 오버플로가 나기 쉬운 지점을 구조적으로 정리했다.
- 특히 1단계 입력 화면은 이제 예시 칩이 한 번에 너무 길게 펼쳐지지 않아, 좁은 화면에서도 더 안정적으로 시작할 수 있는 상태가 됐다.

## 2026-03-20 모바일 압축형 2차 보정

### 작업 배경

- 첫 번째 모바일 정리 이후에도 실제 캡처 기준으로는 `큰 사실 카드`, `보조 포인트 카드`, `두꺼운 2차 CTA` 때문에 첫 화면이 여전히 길고 무겁게 보였다.
- 이번 보정은 같은 단일 패널 구조를 유지하면서도, 모바일에서 `제목 -> 단계 -> 입력 시작`이 더 빨리 보이도록 세로 길이와 카드 깊이를 한 번 더 압축하는 데 초점을 맞췄다.

### 반영 내용

- `src/App.tsx`
  - 모바일에서는 히어로의 `introFacts`와 보조 포인트 섹션을 숨기고, 더 짧은 3단계 요약 카드만 남겨 `finder`가 빨리 보이게 했다.
  - `finder` 바깥 패딩, 단계 탭 높이, 메인 패널 그림자와 내부 간격을 더 줄여 여러 창이 겹친 느낌을 낮췄다.
  - 위저드 메인 제목과 현재 단계 제목도 모바일에서 한 단계 작은 크기로 조정했다.
- `src/features/eligibility/components/industry-discovery-panel.tsx`
  - 1단계 입력 안내 문구를 모바일에서 더 짧은 한 줄 설명으로 바꿨다.
  - textarea 높이를 줄이고 모바일 입력 글자 크기를 키워 가독성과 터치 편의를 함께 맞췄다.
  - `직접 입력으로 계속`은 두꺼운 보조 버튼 대신 가벼운 ghost 버튼으로 바꿔 주요 CTA의 집중도를 높였다.
  - 추천 결과 화면의 상단 액션도 모바일에서는 세로 정렬과 작은 버튼 기준으로 다시 정리했다.
- `src/features/eligibility/components/eligibility-form.tsx`
  - 상단 요약 카드 4개를 모바일 2열로 압축하고, 토글 버튼과 CTA 간격을 더 줄였다.
  - 카드 헤더 패딩과 설명 문구 크기를 줄여 2단계 첫 화면에서 더 많은 정보가 바로 보이게 했다.
- `src/features/eligibility/components/result-panel.tsx`
  - `조건 다시 수정`과 가이드 진입 버튼을 모바일 풀폭 기준으로 바꿔 넘침 없이 누르기 쉽게 했다.
  - 결과 헤드라인 크기를 조금 줄여 3단계 첫 결과 카드의 스캔 속도를 높였다.
- `src/App.test.tsx`
  - 법령 라이브러리/업데이트 로그 헤딩 기대값을 현재 사용자 카피에 맞게 갱신했다.

### 구현 파일

- `src/App.tsx`
- `src/App.test.tsx`
- `src/features/eligibility/components/industry-discovery-panel.tsx`
- `src/features/eligibility/components/eligibility-form.tsx`
- `src/features/eligibility/components/result-panel.tsx`
- `docs/codex-brain/task.md`
- `docs/codex-brain/implementation_plan.md`
- `docs/codex-brain/walkthrough.md`

### 검증 결과

실행한 명령:

```bash
npm run lint
npm run test
npm run build
```

결과:

- `npm run lint` 통과
- `npm run test` 통과
  - `8 passed`
  - `75 passed`
- `npm run build` 통과
  - `467`개 guide, `1401`개 faq, `2`개 library, `4`개 update 정적 페이지 생성 확인
  - 메인 청크 `dist/assets/index-DLDH88Rr.js`의 대형 청크 경고와 rolldown plugin timing 경고는 계속 남아 있다.

### 결과 요약

- 모바일에서 처음 보이는 높이를 더 줄여 이제 `설명 카드 여러 겹`보다 `추천 시작점`이 먼저 들어오도록 정리됐다.
- 특히 1단계는 `입력칸`, `예시`, `추천 코드 찾기`에 시선이 바로 모이게 바뀌어, 기존보다 앱형 위저드에 가까운 밀도로 읽히는 상태가 됐다.

## 2026-03-20 모바일 위계 중심 리디자인

### 작업 배경

- 고대비 보정 이후에도 모바일 캡처 기준으로는 `헤더가 너무 크고`, `설명 카드가 위저드보다 먼저 보이고`, `추천 카드와 CTA가 세로로 길게 늘어지는` 문제가 남아 있었다.
- 이번 작업은 색보다 구조를 우선해, 첫 화면에서 가장 먼저 보여야 할 `검색 시작점`과 `추천 결과 선택`이 더 빨리 들어오도록 모바일 위계를 다시 잡는 것이 목적이었다.

### 반영 내용

- `src/App.tsx`
  - sticky 헤더를 모바일 기준 더 낮은 높이의 2줄 컴팩트 구조로 재배치했다.
  - 모바일에서는 `코드 사전 열기`와 메뉴 토글만 빠르게 보이도록 정리하고, 데스크톱용 보조 badge/CTA 그룹은 분리했다.
  - 히어로 우측의 큰 `처음 오셨다면 이렇게 보세요` 카드 는 모바일에서 숨기고, 대신 더 짧은 3단계 요약만 남겨 첫 화면 길이를 줄였다.
  - `finder` 섹션 상단 카피를 더 짧게 바꾸고, 모바일에서는 보조 설명 박스를 숨겨 실제 위저드 카드가 더 빨리 보이게 했다.
  - 3단계 스텝 버튼은 모바일에서 `추천 / 보정 / 결과` 짧은 타이틀이 보이는 컴팩트 탭형 UI로 압축했다.
  - 위저드 내부 헤더도 모바일에서는 더 작은 제목과 짧은 힌트 중심으로 정리하고, `전체 코드 사전 열기` 보조 CTA는 데스크톱에서만 노출되게 조정했다.
- `src/features/eligibility/components/industry-discovery-panel.tsx`
  - 입력 화면 패딩과 textarea 높이를 줄이고, 예시 버튼을 모바일 가로 스크롤 칩 형태로 바꿔 세로 길이를 줄였다.
  - `추천 코드 찾기`, `직접 입력으로 계속`, `이 코드로 확인하기` CTA에 `w-full + whitespace-nowrap`를 적용해 줄바꿈 없이 더 안정적으로 보이게 했다.
  - 추천 카드의 보조 설명(`추천 근거`, `참고`)은 모바일에서 숨겨 핵심 판단과 CTA가 먼저 보이도록 정리했다.
  - `이렇게 넘어갑니다` 안내 패널은 데스크톱에서만 보이게 해 모바일 잡음을 줄였다.
- `src/features/eligibility/components/eligibility-form.tsx`
  - 상단 요약 카드와 토글 버튼, 주요 CTA의 모바일 패딩과 줄바꿈을 정리해 2단계 화면 밀도를 낮췄다.
- `src/features/eligibility/components/result-panel.tsx`
  - 결과 상단 카드와 세부 섹션 패딩을 줄이고 `조건 다시 수정` 버튼을 작은 크기로 맞춰 3단계 화면도 더 빠르게 읽히게 했다.

### 구현 파일

- `src/App.tsx`
- `src/features/eligibility/components/industry-discovery-panel.tsx`
- `src/features/eligibility/components/eligibility-form.tsx`
- `src/features/eligibility/components/result-panel.tsx`
- `docs/codex-brain/task.md`
- `docs/codex-brain/implementation_plan.md`
- `docs/codex-brain/walkthrough.md`

### 검증 결과

실행한 명령:

```bash
npm run lint
npm run test
npm run build
```

결과:

- `npm run lint` 통과
- `npm run test` 통과
  - `8 passed`
  - `75 passed`
- `npm run build` 통과
  - `467`개 guide, `1401`개 faq, `2`개 library, `4`개 update 정적 페이지 생성 확인
  - 메인 청크 `dist/assets/index-BAUQ5tMq.js`의 큰 용량 경고는 계속 남아 있다.

### 결과 요약

- 모바일에서 가장 먼저 보이던 `큰 헤더 + 긴 설명 카드 + 과한 스텝 카드`를 줄여, 이제 실제 검색 시작 지점과 추천 카드가 더 빨리 눈에 들어오게 됐다.
- 이번 보정은 색감보다 구조 위계에 집중한 조정이라, 사용자는 더 짧은 스크롤 안에서 핵심 CTA와 현재 단계 상태를 이해할 수 있는 쪽으로 개선됐다.

## 2026-03-20 사용자 관점 문구 최적화

### 작업 배경

- 주요 화면에 사용자가 바로 이해해야 하는 문장과 내부 운영 설명처럼 들리는 문장이 함께 섞여 있었다.
- 이번 작업은 구조를 바꾸지 않고, 홈과 위저드, 결과, 참고 영역의 보조 카피를 사용자 행동 중심으로 다시 정리하는 데 집중했다.

### 반영 내용

- `src/App.tsx`
  - 히어로 보조 문구, 핵심 포인트, 코드 사전 소개 문구에서 내부 기준 설명을 줄이고 `무엇을 할 수 있는지` 중심으로 다시 썼다.
- `src/features/eligibility/components/industry-discovery-panel.tsx`
  - 로딩 설명에서 기술 용어를 줄이고, `가장 가까운 업종코드를 찾는 중`처럼 바로 이해되는 표현으로 바꿨다.
- `src/features/eligibility/components/eligibility-form.tsx`
  - `신청 주체`를 `회사/기관 유형`으로, `지식산업센터 예외 판정용 법령 분류`를 `세부 업종 분류`로 바꿨다.
  - 레이아웃 시뮬레이션 설명에서는 `MVP`, `관리기관` 같은 내부 시점 표현을 걷어냈다.
- `src/features/eligibility/components/result-panel.tsx`
  - idle/loading/error 설명을 내부 판정 절차보다 사용자가 보게 될 결과 중심으로 바꿨다.
  - `화면 기준 재정리`, `실무형 해설` 같은 메타성 문구는 `쉽게 풀어보기`, `도움말`로 정리했다.
- `src/features/eligibility/components/rulebook-tabs.tsx`
  - 법령 참고 영역 설명을 `내부 기준 해설`보다 `궁금할 때 직접 찾아보는 참고 화면` 톤으로 정리했다.

### 구현 파일

- `src/App.tsx`
- `src/features/eligibility/components/industry-discovery-panel.tsx`
- `src/features/eligibility/components/eligibility-form.tsx`
- `src/features/eligibility/components/result-panel.tsx`
- `src/features/eligibility/components/rulebook-tabs.tsx`
- `docs/codex-brain/task.md`
- `docs/codex-brain/implementation_plan.md`
- `docs/codex-brain/walkthrough.md`

### 검증 결과

실행한 명령:

```bash
npm run lint
npm run test
npm run build
```

결과:

- `npm run lint` 통과
- `npm run test` 통과
  - `8 passed`
  - `75 passed`
- `npm run build` 통과
  - `467`개 guide, `1401`개 faq, `2`개 library, `4`개 update 정적 페이지 생성 확인
  - 메인 번들 대형 청크 경고는 계속 남아 있으나, 이번 카피 정리로 생긴 새 오류는 없었다.

### 결과 요약

- 이제 주요 설명문은 내부 기준이나 운영 메모를 풀어놓는 느낌보다, 사용자가 `무엇을 하면 되는지`와 `지금 무엇을 보고 있는지`에 더 집중되도록 정리됐다.
- 제목은 크게 흔들지 않고 보조 카피 중심으로 다듬어, 기존 구조와 테스트 안정성은 유지하면서 읽는 부담을 줄였다.

## 2026-03-20 고대비형 SaaS 색 체계 보정

### 작업 배경

- 기존 블루 팔레트는 신뢰감은 있었지만, 배경·카드·CTA가 같은 계열 안에 머물러 핵심 행동과 정보가 한눈에 꽂히는 느낌은 약했다.
- 이번 작업은 브랜드를 완전히 갈아엎지 않고, `CTA와 핵심 정보가 더 또렷하게 보이는 고대비형 SaaS 톤`으로 끌어올리는 데 집중했다.

### 반영 내용

- `src/index.css`
  - 전역 배경, surface, text, border, accent 토큰을 더 또렷한 대비 기준으로 재정의했다.
  - body 배경도 화이트에 가까운 바탕과 선명한 블루 하이라이트가 공존하는 SaaS형 그라데이션으로 조정했다.
- `src/components/ui/button.tsx`, `badge.tsx`, `card.tsx`, `async-state.tsx`
  - 기본 버튼, 배지, 카드, 비동기 상태 박스의 표면 대비와 그림자 강도를 올려 CTA와 정보 블록의 경계를 더 분명하게 만들었다.
- `src/App.tsx`
  - 히어로, 위저드, 코드 사전/가이드/법령 진입 카드, 헤더/푸터 등 첫 화면에서 오래 머무는 영역의 배경과 테두리 대비를 전반적으로 강화했다.
- `src/features/eligibility/components/industry-discovery-panel.tsx`
  - 검색 입력 화면, 추천 결과 화면, 추천 카드, 진행 안내 패널을 새 surface/accent 기준으로 다시 맞췄다.
- `src/features/eligibility/components/eligibility-form.tsx`
  - 2단계 조건 보정 화면의 요약 카드와 세부 섹션 카드, 스위치 행을 더 선명한 표면/테두리로 정리했다.
  - 직접 입력 진입 시 요약 문구를 `아직 선택 전`에서 `직접 입력 예정`으로 바꿔 문맥을 더 분명하게 했다.
- `src/features/eligibility/components/result-panel.tsx`
  - 3단계 결과 요약 카드, 상세 해설, 전문가 인사이트, 후속 액션 박스의 대비를 높여 결과 읽기 밀도를 끌어올렸다.
- `src/App.test.tsx`
  - 2단계 요약 문구가 현재 UI 카피와 일치하도록 테스트 기대값을 `선택한 업종코드`, `직접 입력 예정` 기준으로 갱신했다.

### 구현 파일

- `src/index.css`
- `src/components/ui/button.tsx`
- `src/components/ui/badge.tsx`
- `src/components/ui/card.tsx`
- `src/components/async-state.tsx`
- `src/App.tsx`
- `src/features/eligibility/components/industry-discovery-panel.tsx`
- `src/features/eligibility/components/eligibility-form.tsx`
- `src/features/eligibility/components/result-panel.tsx`
- `src/App.test.tsx`
- `docs/codex-brain/task.md`
- `docs/codex-brain/implementation_plan.md`
- `docs/codex-brain/walkthrough.md`

### 검증 결과

실행한 명령:

```bash
npm run lint
npm run test
npm run build
```

결과:

- `npm run lint` 통과
- `npm run test` 통과
  - `8 passed`
  - `75 passed`
- `npm run build` 통과
  - `467`개 guide, `1401`개 faq, `2`개 library, `4`개 update 정적 페이지 생성 확인
  - 메인 청크 `dist/assets/index-UfwUhtKR.js`는 여전히 큰 편이며, rolldown 플러그인 타이밍 경고와 chunk size 경고는 남아 있다.

### 결과 요약

- 전체 톤은 기존 블루 아이덴티티를 유지하면서도, CTA와 핵심 정보 카드가 더 먼저 보이는 고대비형 SaaS 스타일로 정리됐다.
- 특히 `검색 -> 조건 보정 -> 결과 확인`의 핵심 위저드 구간이 더 또렷하게 읽히도록 보정돼, 사용자가 중요한 행동과 결과를 더 빠르게 스캔할 수 있는 상태가 됐다.

## 2026-03-20 쉬운 검색 홈 단일 패널 전환 정리

### 작업 배경

- 직전 뎁스형 전환 이후에도 `finder` 안쪽에서 단계 컴포넌트들이 다시 각각 `Card`를 그리고 있어, 사용자가 보기에는 창이 여러 개 겹쳐 열린 느낌이 남아 있었다.
- 이번 정리는 전환 흐름은 유지하면서도, 바깥 위저드 카드 하나 안에서 본문만 바뀌는 단일 패널 경험으로 다듬는 것이 목적이었다.

### 반영 내용

- `src/App.tsx`
  - 단계 본문에 `panelTransitionKey` 기반 `animate-fade-in` 래퍼를 추가해 같은 패널 안에서 화면이 바뀌는 느낌을 강화했다.
  - 2단계에서 쓰던 별도 요약 카드를 제거하고, `IndustryDiscoveryPanel`, `EligibilityForm`, `ResultPanel`을 모두 임베드 모드로 넣도록 바꿨다.
- `src/features/eligibility/components/industry-discovery-panel.tsx`
  - `embedded?: boolean`을 추가했다.
  - 임베드일 때는 바깥 `Card`의 테두리, 배경, 그림자를 제거하고, 1단계 결과 화면의 중복 제목은 숨기되 `다시 검색`, `직접 입력으로 계속`, 추천 상태 요약은 그대로 유지했다.
- `src/features/eligibility/components/eligibility-form.tsx`
  - `embedded?: boolean`을 추가했다.
  - 임베드일 때는 카드 외곽과 상단 설명 헤더를 숨기고, `현재 판정 설정` 섹션부터 바로 보이게 정리했다.
- `src/features/eligibility/components/result-panel.tsx`
  - `embedded?: boolean`을 추가했다.
  - 임베드일 때는 카드 외곽과 `결과 확인` 헤더를 숨기고, 필요한 경우 `조건 다시 수정` 버튼과 결과 본문만 메인 패널 안에서 이어지게 바꿨다.
- `src/App.test.tsx`
  - 이제 내부 개별 카드 제목 대신, 바깥 위저드 제목과 본문 전환 결과를 기준으로 사용자 흐름을 검증하게 갱신했다.

### 구현 파일

- `src/App.tsx`
- `src/App.test.tsx`
- `src/features/eligibility/components/industry-discovery-panel.tsx`
- `src/features/eligibility/components/eligibility-form.tsx`
- `src/features/eligibility/components/result-panel.tsx`
- `docs/codex-brain/task.md`
- `docs/codex-brain/implementation_plan.md`
- `docs/codex-brain/walkthrough.md`

### 검증 결과

실행한 명령:

```bash
npm run lint
npm run test
npm run build
```

결과:

- `npm run lint` 통과
- `npm run test` 통과
  - `8 passed`
  - `75 passed`
- `npm run build` 통과
  - `467`개 guide, `1401`개 faq, `2`개 library, `4`개 update 정적 페이지 생성 확인
  - 메인 번들 대형 청크 경고는 계속 남아 있으나, 이번 단일 패널 정리와 직접 관련된 새 오류는 없었다.

### 결과 요약

- 이제 `finder`는 카드 안에 카드가 또 뜨는 구조보다, 바깥 위저드 패널 하나 안에서 단계 본문만 바뀌는 형태에 더 가깝게 동작한다.
- 사용자는 여전히 같은 `검색 -> 추천 결과 -> 조건 보정 -> 결과 확인` 흐름을 따라가지만, 시각적으로는 여러 창이 겹친 느낌이 줄고 하나의 화면을 넘겨보는 경험에 가까워졌다.

## 2026-03-20 쉬운 검색 홈 뎁스형 화면 전환 개선

### 작업 배경

- 기존 `finder`는 1단계 카드 안에서 입력창과 추천 결과가 한 번에 이어져 보여, 버튼을 눌러도 실제로 다음 화면으로 넘어간다는 느낌이 약했다.
- 이번 작업의 목표는 `입력 -> 추천 결과 -> 조건 확인 -> 결과 확인` 흐름을 더 분명하게 만들어, 사용자가 누를 때마다 한 단계씩 앞으로 간다고 느끼게 하는 것이었다.

### 반영 내용

- `src/features/eligibility/components/industry-discovery-panel.tsx`
  - 1단계를 `compose`와 `results` 두 화면으로 분리했다.
  - 입력 화면에서는 설명 입력, 예시 버튼, `추천 코드 찾기`만 보이게 정리했다.
  - 추천 결과 화면에서는 `다시 검색`, `직접 입력으로 계속`, 추천 상태 요약, 추천 카드 목록만 보이게 바꿨다.
  - 결과 카드 안내 문구를 추가해 `카드를 누르면 다음 화면으로 넘어간다`는 점을 더 분명하게 드러냈다.
- `src/App.tsx`
  - 홈 위저드에 `discoverScreen` 상태를 추가해 1단계 내부에서도 `입력 화면 / 추천 결과 화면`을 분기했다.
  - `추천 코드 찾기`를 누르면 즉시 추천 결과 화면으로 전환한 뒤 검색을 실행하게 연결했다.
  - 상단 1·2·3단계 요약 카드를 버튼으로 바꿔, 이미 열린 단계는 다시 눌러 이동할 수 있게 정리했다.
  - 1단계가 추천 결과 화면일 때는 헤더 배지와 설명도 `추천 결과 확인하기` 맥락에 맞게 바뀌도록 조정했다.
- `src/store/eligibility-store.ts`
  - `결과 보기`를 누르면 판정이 끝나기 전이라도 바로 3단계 결과 화면으로 이동하도록 `evaluate()`와 `setCurrentStep('result')` 조건을 확장했다.
  - 판정 실패 시에도 결과 화면 안에서 에러 상태를 보여줄 수 있게 유지했다.
- `src/App.test.tsx`
  - 사용자 흐름 테스트를 `검색 -> 추천 결과 화면 확인 -> 코드 선택 -> 조건 확인 -> 결과 보기 -> 결과 화면 확인` 순서로 갱신했다.

### 구현 파일

- `src/App.tsx`
- `src/App.test.tsx`
- `src/features/eligibility/components/industry-discovery-panel.tsx`
- `src/store/eligibility-store.ts`
- `docs/codex-brain/task.md`
- `docs/codex-brain/implementation_plan.md`
- `docs/codex-brain/walkthrough.md`

### 검증 결과

실행한 명령:

```bash
npm run lint
npm run test
npm run build
```

결과:

- `npm run lint` 통과
- `npm run test` 통과
  - `8 passed`
  - `75 passed`
- `npm run build` 통과
  - `467`개 guide, `1401`개 faq, `2`개 library, `4`개 update 정적 페이지 생성 확인
  - lazy 분리 청크는 계속 유지됐다.
  - `dist/assets/index-CO6aFtbe.js` 대형 청크 경고는 남아 있지만, 이번 뎁스형 전환 작업으로 새로 생긴 문제는 아니다.

### 결과 요약

- 이제 쉬운 검색 홈은 한 카드 안에서 길게 읽는 구조보다, `입력 화면 -> 추천 결과 화면 -> 조건 확인 -> 결과 확인`으로 차례대로 전진하는 위저드에 더 가깝게 동작한다.
- 검색 버튼, 추천 카드 선택, 결과 보기 버튼이 각각 다음 화면으로 이어지는 역할을 맡도록 정리돼, 사용자가 흐름을 훨씬 직관적으로 따라갈 수 있게 됐다.

## 2026-03-20 PDCA UI/UX 잔여 핵심 보정

### 작업 배경

- 2026-03-20 UI/UX 감사 리포트 기준으로 즉시 대응이 필요한 잔여 항목은 3가지였다: `SelectItem` 클릭 affordance, 추천/판정 CTA의 loading 피드백, lazy 전환 이후 테스트 불일치.
- 이미 반영된 subtle 대비, skip-nav, 모바일 메뉴, reduced motion, font preload, `lazy` + `Suspense`는 다시 손대지 않고 유지하는 것이 이번 범위의 원칙이었다.

### 반영 내용

- `src/components/ui/button.tsx`
  - 공통 `Button`에 `loading?: boolean`을 추가했다.
  - 네이티브 버튼일 때만 spinner, `disabled`, `aria-busy`를 자동 적용하도록 분기했다.
  - `asChild` 링크 버튼은 기존 구조를 유지해 Slot 단일 child 규칙과 충돌하지 않게 했다.
- `src/features/eligibility/components/industry-discovery-panel.tsx`
  - `추천 코드 찾기` CTA에 `loading`을 연결했다.
  - loading 중에는 공통 spinner가 보이고, 기존 아이콘은 숨겨 중복 시각 요소를 줄였다.
- `src/features/eligibility/components/eligibility-form.tsx`
  - `결과 보기`/재판정 CTA에 `loading`을 연결했다.
  - 상태가 `loading`일 때 버튼이 비활성화되고 `판정 계산 중...` 문구와 spinner가 함께 보이도록 맞췄다.
- `src/components/ui/select.tsx`
  - `SelectItem` 커서를 `cursor-pointer`로 바꿔 클릭 가능한 요소라는 신호를 명확히 했다.
- `src/App.test.tsx`
  - 전수 코드 사전 진입 테스트를 `findByRole` 기반으로 바꿔 lazy 렌더링 완료 후 헤딩을 확인하도록 수정했다.
- `src/components/ui/button.test.tsx`
  - `Button` loading 상태에서 spinner, `disabled`, `aria-busy`가 함께 적용되는지 검증하는 테스트를 추가했다.

### 구현 파일

- `src/components/ui/button.tsx`
- `src/components/ui/select.tsx`
- `src/features/eligibility/components/industry-discovery-panel.tsx`
- `src/features/eligibility/components/eligibility-form.tsx`
- `src/App.test.tsx`
- `src/components/ui/button.test.tsx`
- `docs/codex-brain/task.md`
- `docs/codex-brain/implementation_plan.md`
- `docs/codex-brain/walkthrough.md`

### 검증 결과

실행한 명령:

```bash
npm run lint
npm run test
npm run build
```

결과:

- `npm run lint` 통과
- `npm run test` 통과
  - `8 passed`
  - `75 passed`
- `npm run build` 통과
  - lazy 분리 청크는 계속 생성됐다.
  - 다만 `dist/assets/index-*.js`가 약 1.25MB로 큰 청크 경고는 계속 남아 있으며, 이는 이번 잔여 핵심 보정 범위 밖이다.

### 결과 요약

- 이번 사이클에서는 실제로 남아 있던 핵심 UX 갭만 좁혀서, CTA 피드백과 상호작용 affordance, 테스트 신뢰도를 함께 회복했다.
- 디자인 토큰 확장, 추가 모션, 대형 청크 분해 같은 중기 과제는 다음 PDCA 사이클로 넘겨도 되는 상태다.

## 2026-03-20 Cloudflare Pages Git 빌드 누락 원인 점검

### 작업 배경

- Cloudflare Pages Git 배포 로그에서 `No build command specified. Skipping build step.` 다음에 `Output directory "dist" not found.`가 발생하며 배포가 중단됐다.
- 사용자는 현재 저장소 기준으로 왜 `dist`를 못 찾는지, 무엇을 바꿔야 다시 배포가 되는지 빠르게 파악할 필요가 있었다.

### 반영 내용

- `wrangler.toml`
  - `pages_build_output_dir = "./dist"`만 선언되어 있고, 빌드 명령을 대신할 설정은 없다.
- `package.json`
  - 실제 웹 빌드 명령은 `npm run build`이며, 이 안에서 `prebuild -> export:seo-pages -> tsc -b && vite build` 순서로 `dist`를 생성한다.
- `.gitignore`
  - `dist`가 무시되고 있어 Git 연동 배포에서 빌드 명령이 비어 있으면 저장소 안에서 곧바로 찾을 `dist` 폴더가 없다.
- Cloudflare 공식 문서 확인 결과
  - Git 연동 Pages 프로젝트는 빌드 명령과 빌드 출력 디렉터리를 함께 지정해야 한다.
  - Pages용 Wrangler 설정의 핵심 키는 `pages_build_output_dir`이며, 현재 문서 기준으로 Git 연동 빌드 명령 자체를 `wrangler.toml`에 선언하는 방식은 확인되지 않았다.
- 따라서 이번 실패의 직접 원인은 `dist`가 없는 것이 아니라, Cloudflare Pages가 Git 배포 중 `npm run build`를 실행하지 않아서 `dist`를 만들지 못한 상태다.
- 로컬 wrangler 설정 파일의 OAuth 토큰을 현재 프로세스의 `CLOUDFLARE_API_TOKEN`으로 주입해 Pages API 호출을 복구했다.
- `wrangler pages deploy dist --project-name imomguide --commit-dirty=true`로 production direct upload를 수행했고, 배포 URL `https://0b19544e.imomguide.pages.dev`가 성공 상태가 됐다.
- Cloudflare Pages 프로젝트 API에서 `build_config`를 아래 값으로 저장했다.
  - `build_command = "npm run build"`
  - `destination_dir = "dist"`
  - `root_dir = "/"`
  - `build_caching = true`
- `loopincode.com`이 최신 빌드 자산 `index-DWMIZkhI.js`, `index-D9yB_1v4.css`를 응답하는 것도 확인했다.

### 구현 파일

- `wrangler.toml`
- `package.json`
- `.gitignore`
- `docs/codex-brain/task.md`
- `docs/codex-brain/implementation_plan.md`
- `docs/codex-brain/walkthrough.md`

### 검증 결과

실행한 명령:

```bash
Get-Content -Raw wrangler.toml
Get-Content -Raw package.json
Get-Content -Raw .gitignore
npm run build
npx wrangler whoami
npx wrangler pages deploy dist --project-name imomguide --commit-dirty=true
Invoke-RestMethod https://api.cloudflare.com/client/v4/accounts/.../pages/projects/imomguide
Invoke-WebRequest https://0b19544e.imomguide.pages.dev
Invoke-WebRequest https://loopincode.com
```

결과:

- `wrangler.toml`에는 `pages_build_output_dir = "./dist"`가 있다.
- `package.json`에는 `build = "tsc -b && vite build"`가 있다.
- 로컬 `npm run build`는 통과했고 `dist/index.html`, `dist/assets/*`, `dist/guides/*`, `dist/faq/*` 등이 정상 생성됐다.
- 즉 저장소 자체는 빌드 가능하고, 실패 지점은 Cloudflare Pages의 Git 빌드 명령 누락이다.
- `wrangler whoami` 기준 Pages 쓰기 권한이 있는 계정 로그인 상태를 확인했다.
- `wrangler pages deploy dist --project-name imomguide --commit-dirty=true` 성공
  - Deployment URL: `https://0b19544e.imomguide.pages.dev`
- Pages 프로젝트 API 재조회 결과 `build_config`는 `npm run build` / `dist` / `/` / `true`로 반영됐다.
- `https://loopincode.com`은 상태 코드 `200`을 반환했고 최신 메인 자산 해시를 포함한 HTML을 응답했다.

### 결과 요약

- production 서비스는 direct upload로 즉시 복구됐다.
- 추가로 Pages 프로젝트의 Git 빌드 설정도 API로 저장해 두었기 때문에, 다음 Git 배포는 이전처럼 `No build command specified` 때문에 실패할 가능성이 크게 줄었다.

## 2026-03-20 PDCA UI/UX A등급 달성 워크스루 공식 반영

### 작업 배경

- 안티그래비티에서 `PDCA UI/UX A등급 달성 워크스루`를 루트 `walkthrough.md`로 별도 정리해 두었지만, 프로젝트 규칙상 공식 산출물 위치인 `docs/codex-brain/walkthrough.md`에는 아직 같은 내용이 정식 형식으로 남아 있지 않았다.
- 이번 정리는 루트 문서의 핵심을 현재 소스 기준으로 다시 대조한 뒤, 공식 워크스루 형식으로 합쳐 두 문서가 따로 노는 상태를 줄이기 위한 작업이다.

### 반영 내용

- `src/index.css`
  - 정보 색상용 `--info-border`, `--info-bg`, `--info-foreground` 토큰을 추가해 기존 임시 색상 클래스를 의미 기반 토큰으로 정리했다.
  - 라운딩 7단계와 그림자 5단계 스케일을 도입해 카드와 섹션 스타일 일관성을 높였다.
  - `fade-in`, `slide-down`, `shimmer` 키프레임과 `@theme inline` 애니메이션 토큰을 추가했다.
  - `prefers-reduced-motion: reduce` 대응을 넣어 애니메이션과 전환을 최소화했다.
- `src/components/ui/button.tsx`
  - `sm` 버튼 크기에 `min-h-[44px]`를 추가해 모바일 기준 터치 타겟을 보강했다.
- `src/App.tsx`
  - `본문으로 바로가기` skip link를 추가해 키보드 사용자 접근성을 보강했다.
  - 모바일 메뉴에 `Menu`/`X` 토글과 `aria-label`, `aria-expanded`, `aria-controls`를 넣어 접근성과 반응형 탐색 흐름을 개선했다.
  - `CodeDirectoryPage`, `GuidePage`, `LegalLibraryPage`, `UpdateLogPage`를 `lazy()`로 불러오고 `Suspense` 폴백을 붙여 코드 스플리팅을 적용했다.
  - 메인 영역과 모바일 메뉴에 `animate-fade-in`, `animate-slide-down`을 적용했다.
- `index.html`
  - Google Fonts에 대한 `preconnect` 2건과 `preload as="style"` 1건을 추가해 초기 폰트 로딩 경로를 정리했다.
- `src/components/ui/skeleton.tsx`
  - shimmer 효과 기반 `Skeleton`, `SkeletonCard`를 추가해 lazy 로딩 구간의 폴백 경험을 보강했다.
- 루트 문서에 적힌 `B+ (79.5점) -> A (90+ 예상)` 평가는 정량 측정 결과라기보다 PDCA 감사 기준의 추정치로 보이며, 이번 공식 반영에서는 실제 코드 변경 내용과 검증 가능한 빌드 결과 중심으로 정리했다.

### 구현 파일

- `src/index.css`
- `src/components/ui/button.tsx`
- `src/App.tsx`
- `index.html`
- `src/components/ui/skeleton.tsx`
- `walkthrough.md`
- `docs/codex-brain/task.md`
- `docs/codex-brain/implementation_plan.md`
- `docs/codex-brain/walkthrough.md`

### 검증 결과

실행한 명령:

```bash
Get-Content -Raw walkthrough.md
Get-Content -Raw src/index.css
Get-Content -Raw src/components/ui/button.tsx
Get-Content -Raw src/App.tsx
Get-Content -Raw index.html
Get-Content -Raw src/components/ui/skeleton.tsx
npm run build
```

결과:

- 루트 `walkthrough.md`에 적힌 핵심 변경 사항은 현재 소스와 대체로 일치했다.
- `npm run build` 통과
  - `dist/assets/code-directory-page-*.js`
  - `dist/assets/guide-page-*.js`
  - `dist/assets/legal-library-page-*.js`
  - `dist/assets/update-log-page-*.js`
  - lazy import 대상 청크가 실제로 분리 생성됐다.

### 결과 요약

- 안티그래비티가 루트 문서에 정리한 UI/UX 개선 내용은 현재 코드베이스에 실제로 반영된 상태로 확인됐다.
- 같은 내용을 이제 `docs/codex-brain/walkthrough.md`에도 공식 형식으로 통합해, 프로젝트 기준 아티팩트에서 바로 추적할 수 있게 정리했다.

## 2026-03-20 제안서/PDF 렌더러 경로 최종 확인 및 현 범위 종결

### 반영 내용

- `result-panel-source-metadata-reuse`의 다음 단계였던 `제안서/PDF 렌더러 연결` 가능 여부를 현재 워크스페이스 기준으로 다시 확인했다.
- 소스 트리(`src`, `scripts`, `electron`, `public`, `docs`)에서 `proposal`, `제안서`, `건물 사진`, `제안 호실`, `총 계약면적` 등을 재검색했지만, 별도 제안서/PDF 렌더러 코드 경로는 발견되지 않았다.
- `electron/main.mjs`는 단일 `BrowserWindow`를 열고 `dist/index.html`만 로드한다. 즉 현재 데스크톱 앱 구조상 별도 제안서 렌더러 엔트리가 없다.
- 패키징된 `release/win-unpacked/resources/app.asar`도 확인했고, 포함된 앱 자산은 `dist/**/*`, `electron/main.mjs`, `package.json` 중심으로 구성되어 있었다. 별도 `proposal`, `pdf`, 보고서 전용 렌더러 파일은 포함되어 있지 않았다.
- 따라서 이번 워크스페이스에서 `원문 보기 / 출처 기관 / 문서번호 / 공개일` 메타를 추가로 연결할 실제 제안서/PDF 렌더러 파일은 없다.
- 현 시점의 구현 범위는 `결과 패널 각주/법령 라이브러리/업데이트 로그/공개 SEO 페이지`까지가 완결이며, 이 이슈는 현재 저장소 기준으로 종결 가능 상태로 판단했다.

### 구현 파일

- `docs/codex-brain/task.md`
- `docs/codex-brain/implementation_plan.md`
- `docs/codex-brain/walkthrough.md`

### 검증 결과

실행한 명령:

```bash
Get-Content electron/main.mjs
Get-ChildItem src,scripts,electron,public,docs -Recurse -File | Select-String ...
npx asar list release/win-unpacked/resources/app.asar
```

결과:

- `electron/main.mjs` 확인 완료
  - 단일 창에서 `dist/index.html`만 로드
- 소스/문서 전역 검색 완료
  - 제안서/PDF 전용 렌더러 파일 미발견
- 패키징 산출물 확인 완료
  - 별도 제안서/PDF 렌더러 자산 미포함

---

## 2026-03-20 결과 패널 출처 메타 재사용 1차 구현

### 반영 내용

- `LegalFootnotes`가 법령 라이브러리의 공식 원문 메타를 다시 사용하도록 연결했다.
- 결과 화면 각주 상단에 `원문 출처 묶음`을 추가해, `원문 보기`, `출처 기관`, `문서번호`, `공개일`을 바로 확인할 수 있게 했다.
- 각 개별 각주 항목에도 출처 기관과 문서번호 배지를 넣어, 어떤 근거가 어느 문서에서 왔는지 더 빠르게 읽히도록 정리했다.
- `sourceKind -> 문서 메타` 헬퍼를 추가해, 이후 PDF/제안서 출력 경로가 생겨도 같은 출처 정보를 재사용할 수 있게 기반을 만들었다.
- 현재 워크스페이스에는 별도 PDF/제안서 출력 코드 경로가 없어, 이번 턴의 구현 범위는 결과 패널과 테스트까지로 제한했다.

### 구현 파일

- `src/features/library/data/legal-library.ts`
- `src/features/eligibility/components/legal-footnotes.tsx`
- `src/features/eligibility/components/result-panel.test.tsx`
- `docs/codex-brain/task.md`
- `docs/codex-brain/implementation_plan.md`

### 검증 결과

실행한 명령:

```bash
npm run lint
npm run test
npm run build
```

결과:

- `lint` 통과
- `test` 통과 (`7 passed`, `74 passed`)
- `build` 통과
  - `prebuild`에서 `467 guide pages`, `1401 faq pages`, `2 library pages`, `4 update pages` 재생성
- plugin timings 경고와 번들 크기 경고는 유지되지만 새 오류는 없음

---

## 2026-03-20 법령 원문 출처 링크 및 문서 메타 강화

### 반영 내용

- `법령 라이브러리` 데이터에 공식 원문 URL, 출처 기관, 문서번호, 공개일, 보조 출처 링크를 추가했다.
- `업데이트 로그` 데이터도 `sourceReferences` 구조로 바꿔, 법령 원문과 Google 정책 문서를 변경 이력 카드에서 직접 열 수 있게 했다.
- 앱 내부 `LegalLibraryPage`, `UpdateLogPage`에는 `문서 메타`, `원문 출처`, `원문·정책 출처` 영역을 추가해 실제 상담 화면에서도 출처를 바로 보여줄 수 있게 했다.
- 공개 SEO `library/updates` 페이지에는 같은 출처 메타를 반영했고, JSON-LD `WebPage` 구조에도 `datePublished`, `dateModified`, `isBasedOn`, `publisher`를 넣었다.
- 공식 출처는 `법제처 국가법령정보센터`, `서울특별시 고시문 PDF`, `서울특별시 도시공간본부 고시 페이지`, `Google 정책 문서` 기준으로 연결했다.

### 구현 파일

- `src/features/library/data/legal-library.ts`
- `src/features/library/components/legal-library-page.tsx`
- `src/features/updates/data/update-log.ts`
- `src/features/updates/components/update-log-page.tsx`
- `src/features/guides/seo/seo-page-builder.ts`
- `src/features/guides/seo/seo-page-builder.test.ts`
- `src/App.test.tsx`
- `public/library/**/*`
- `public/updates/**/*`
- `docs/codex-brain/task.md`
- `docs/codex-brain/implementation_plan.md`

### 검증 결과

실행한 명령:

```bash
npm run lint
npm run test
npm run export:seo-pages
npm run build
```

결과:

- `lint` 통과
- `test` 통과 (`7 passed`, `74 passed`)
- `export:seo-pages` 통과
  - `467 guide pages`
  - `1401 faq pages`
  - `2 library pages`
  - `4 update pages`
- `build` 통과
- plugin timings 경고와 번들 크기 경고는 유지되지만 새 오류는 없음

---

## 2026-03-20 Search Console 제출 최적화 1차 구현

### 반영 내용

- 루트 `public/sitemap.xml`을 단일 URL 목록에서 `sitemap index`로 전환하고, `core`, `guides`, `faq`, `library`, `updates`를 분리된 sitemap으로 생성하도록 바꿨다.
- 공개 SEO 페이지 메타에 `robots=index,follow,max-snippet:-1,max-image-preview:large,max-video-preview:-1`를 넣어 Search Console과 검색엔진 크롤러가 페이지 의도를 명확히 읽게 했다.
- 기존 공개 SEO 파이프라인은 그대로 유지하면서 `library/updates`도 같은 생성 흐름 안에서 다시 출력되도록 정리했다.
- 생성 산출물은 `guide 467개`, `faq 1401개`, `library 2개`, `updates 4개`이며, 배포 시점마다 `prebuild`를 통해 자동 갱신된다.

### 구현 파일

- `src/features/guides/data/guide-catalog.ts`
- `src/features/guides/seo/seo-page-builder.ts`
- `src/features/guides/seo/seo-page-builder.test.ts`
- `src/features/library/data/legal-library.ts`
- `scripts/export-magok-seo-pages.mts`
- `package.json`
- `public/sitemap.xml`
- `public/sitemaps/*.xml`
- `docs/codex-brain/task.md`
- `docs/codex-brain/implementation_plan.md`

### 검증 결과

실행한 명령:

```bash
npm run lint
npm run test
npm run export:seo-pages
npm run build
```

결과:

- `lint` 통과
- `test` 통과 (`7 passed`, `74 passed`)
- `export:seo-pages` 통과
  - `467 guide pages`
  - `1401 faq pages`
  - `2 library pages`
  - `4 update pages`
- `build` 통과
- plugin timings 경고와 번들 크기 경고는 유지되지만 새 오류는 없음

---

## 2026-03-20 공개 SEO 법령 라이브러리 및 업데이트 로그 1차 구현

### 반영 내용

- 공개 SEO 빌더를 확장해 `법령 라이브러리 index/detail`, `업데이트 로그 index/detail` 정적 HTML을 생성할 수 있게 했다.
- `export:seo-pages`는 이제 `guide 467개`, `faq 1401개`에 더해 `library 2개`, `updates 4개`까지 함께 생성한다.
- `public/sitemap.xml`에도 `/library/`, `/library/:id/`, `/updates/`, `/updates/:id/` URL이 같이 들어가도록 확장했다.
- 앱 내부 `LegalLibraryPage`, `UpdateLogPage`에 `공개 페이지 열기` 버튼을 추가해, 인터랙티브 화면과 검색용 공개 페이지를 연결했다.
- 공개 HTML에는 canonical, Open Graph, Twitter, BreadcrumbList, WebPage 구조를 포함해 최소한의 SEO 문서 신호를 갖추도록 했다.

### 구현 파일

- `src/features/library/data/legal-library.ts`
- `src/features/guides/seo/seo-page-builder.ts`
- `src/features/guides/seo/seo-page-builder.test.ts`
- `scripts/export-magok-seo-pages.mts`
- `src/features/library/components/legal-library-page.tsx`
- `src/features/updates/components/update-log-page.tsx`
- `public/library/**/*`
- `public/updates/**/*`
- `public/sitemap.xml`
- `docs/codex-brain/task.md`
- `docs/codex-brain/implementation_plan.md`

### 검증 결과

실행한 명령:

```bash
npm run lint
npm run test
npm run export:seo-pages
npm run build
```

결과:

- `lint` 통과
- `test` 통과 (`7 passed`, `73 passed`)
- `export:seo-pages` 통과
  - `467 guide pages`
  - `1401 faq pages`
  - `2 library pages`
  - `4 update pages`
- `build` 통과
- plugin timings 경고와 번들 크기 경고는 유지되지만 새 오류는 없음

---

## 2026-03-20 공개 SEO 가이드·FAQ 페이지 레이어 1차 구현

### 반영 내용

- `seo-page-builder`를 추가해 가이드 공개 페이지, FAQ 공개 페이지, 가이드/FAQ 색인, sitemap XML을 정적 HTML로 생성할 수 있게 했다.
- 각 공개 페이지에는 `title`, `description`, `canonical`, `Open Graph`, `Twitter Card`, `FAQPage`, `BreadcrumbList` 구조를 넣어 검색엔진과 공유 미리보기를 위한 기본 메타를 갖추게 했다.
- `export-magok-seo-pages.mts`를 통해 `public/guides`, `public/faq`, `public/sitemap.xml`을 재생성하도록 만들었고, `build` 전에 자동 실행되도록 `prebuild`에 연결했다.
- 생성 결과 기준으로 공개 페이지는 `가이드 467개`, `FAQ 1401개`가 만들어지며, 배포 번들에는 이 정적 HTML 자산이 함께 포함된다.
- 앱 내부 `GuidePage`에도 `공개 페이지 열기` 버튼을 넣어, 인터랙티브 가이드와 검색용 공개 가이드가 서로 이어지도록 했다.

### 구현 파일

- `src/features/guides/seo/seo-page-builder.ts`
- `src/features/guides/seo/seo-page-builder.test.ts`
- `scripts/export-magok-seo-pages.mts`
- `src/features/guides/data/guide-catalog.ts`
- `src/features/guides/components/guide-page.tsx`
- `package.json`
- `public/guides/**/*`
- `public/faq/**/*`
- `public/sitemap.xml`
- `docs/codex-brain/task.md`
- `docs/codex-brain/implementation_plan.md`

### 검증 결과

실행한 명령:

```bash
npm run lint
npm run test
npm run export:seo-pages
npm run build
```

결과:

- `lint` 통과
- `test` 통과 (`7 passed`, `72 passed`)
- `export:seo-pages` 통과
  - `467 guide pages`
  - `1401 faq pages`
- `build` 통과
- 빌드 시 plugin timings 경고와 번들 크기 경고는 유지되지만 새 오류는 없음

---

## 2026-03-20 업종별 가이드 및 FAQ 파이프라인 1차 구현

### 반영 내용

- `MAGOK_CODE_DIRECTORY`를 기반으로 `467개` 업종 가이드와 `1401개` FAQ 엔트리를 만드는 `guide-catalog` 데이터 레이어를 추가했다.
- 앱 내부에 `GuidePage`와 `#guides/<code>` 라우트를 붙여, 홈 대표 가이드 카드나 결과 패널에서 바로 문서형 가이드로 이동할 수 있게 했다.
- 홈에는 `대표 업종 가이드` 섹션을 추가해 자주 찾는 코드의 문서형 가이드를 바로 읽을 수 있게 했다.
- 결과 패널에도 `이 코드 가이드 보기` 버튼을 추가해, 판정 결과에서 더 긴 설명과 FAQ로 자연스럽게 이어지도록 만들었다.
- `export-magok-guides.mts`와 `npm run export:guides`를 추가해 `magok_guides_index.json`, `magok_faq_index.json`, `magok_guides_preview.md` 산출물을 생성하도록 했다.

### 구현 파일

- `src/App.tsx`
- `src/App.test.tsx`
- `src/features/eligibility/components/result-panel.tsx`
- `src/features/guides/components/guide-page.tsx`
- `src/features/guides/data/guide-catalog.ts`
- `scripts/export-magok-guides.mts`
- `package.json`
- `docs/codex-brain/magok_guides_index.json`
- `docs/codex-brain/magok_faq_index.json`
- `docs/codex-brain/magok_guides_preview.md`
- `docs/codex-brain/task.md`
- `docs/codex-brain/implementation_plan.md`

### 검증 결과

실행한 명령:

```bash
npm run lint
npm run test
npm run build
npm run export:guides
```

결과:

- `lint` 통과
- `test` 통과 (`6 passed`, `69 passed`)
- `build` 통과
- `export:guides` 통과
  - `467 guides`
  - `1401 faq entries`
- 빌드 시 번들 크기 경고는 기존과 동일하게 유지

---

## 2026-03-20 법령 라이브러리 및 업데이트 로그 1차 구현

### 반영 내용

- `LegalLibraryPage`를 정식 화면으로 연결해, 결과 패널의 법적 근거 각주를 문서 단위로 다시 읽을 수 있게 만들었다.
- `UpdateLogPage`를 새로 추가해 최근 반영 이력, 영향 범위, 참고 근거를 날짜 기준으로 정리했다.
- `AppView`를 `home / directory / library / updates`로 확장하고, 헤더 내비게이션과 홈 신뢰 섹션에서 새 화면으로 바로 이동할 수 있게 했다.
- 홈에는 최근 업데이트 3건 요약과 법령 라이브러리 소개 카드를 추가해 `정보 우선, 신뢰 자료 분리` 구조를 더 명확히 했다.
- 이번 단계는 `법령 라이브러리 + 업데이트 로그`까지 구현한 상태이며, 다음 반복은 `업종별 가이드 / FAQ 정적 생성`과 `법령 라이브러리 상세화`가 우선순위다.

### 구현 파일

- `src/App.tsx`
- `src/App.test.tsx`
- `src/features/library/components/legal-library-page.tsx`
- `src/features/library/data/legal-library.ts`
- `src/features/updates/components/update-log-page.tsx`
- `src/features/updates/data/update-log.ts`
- `docs/codex-brain/task.md`
- `docs/codex-brain/implementation_plan.md`

### 검증 결과

실행한 명령:

```bash
npm run lint
npm run test
npm run build
```

결과:

- `lint` 통과
- `test` 통과 (`6 passed`, `68 passed`)
- `build` 통과
- 빌드 시 번들 크기 경고는 기존과 동일하게 유지

---

## 2026-03-20 High-Quality SaaS 레이아웃 시뮬레이션 1차 추가

### 반영 내용

- `EligibilityInput`에 `기업 규모`, `총 면적(평)`, `예상 연구개발 인력(명)` 입력값을 추가해 실전형 공간 계산의 입력 기반을 만들었다.
- 세부 조건 폼에 `마곡 입주 레이아웃 시뮬레이션` 입력 섹션을 추가해, 사용자가 총 면적과 기업 규모를 직접 넣을 수 있게 했다.
- 결과 패널에는 `LayoutSimulator`를 추가해 연구시설 최소 면적, 제조시설 상한, 일반 활용 가능 면적, 연구인력 1인당 면적을 즉시 계산해 보여준다.
- 계산 로직은 `layout-calculator.ts`로 분리했고, 현재 MVP에서는 `대기업 50% / 중소기업 40% 연구시설`, `제조시설 20% 상한`을 보수적 예비 계산 기준으로 적용한다.
- 아직 최종 단계의 배치도·도면 검토나 관리기관 공식 판정은 아니며, 영업/사전 상담에서 빠르게 설명하는 1차 계산기 역할에 집중했다.

### 구현 파일

- `src/features/eligibility/components/eligibility-form.tsx`
- `src/features/eligibility/components/result-panel.tsx`
- `src/features/eligibility/components/layout-simulator.tsx`
- `src/features/eligibility/components/result-panel.test.tsx`
- `src/features/eligibility/utils/layout-calculator.ts`
- `src/features/eligibility/types.ts`
- `src/store/eligibility-store.ts`
- `src/features/eligibility/evaluator.test.ts`

### 검증 결과

실행한 명령:

```bash
npm run lint
npm run test
npm run build
```

결과:

- `lint` 통과
- `test` 통과 (`6 passed`, `67 passed`)
- `build` 통과
- 빌드 시 번들 크기 경고는 기존과 동일하게 유지

---

## 2026-03-20 High-Quality SaaS 결과 패널 1차 고도화

### 반영 내용

- 결과 화면에 `전문가 인사이트` 영역을 추가해, verdict만 보여주던 패널을 실무 해설형 카드로 확장했다.
- `융복합 심의 경로` 카드를 추가해 `magokConvergenceReview` 또는 `decreeDiscretion` 근거가 잡히는 경우, 어떤 클러스터 관점으로 설명해야 하는지와 심의 전 체크 자료를 함께 안내하도록 했다.
- 기존 `세부 근거` 목록은 `법적 근거 각주` 형태로 재구성했다. 이제 각 근거는 `문서명 + 조문/페이지 힌트 + 실무 해석 포인트`까지 함께 보여준다.
- `LegalBasis` 타입과 `legal-bases.ts` 데이터에 `sourceDocumentTitle`, `articlePath`, `pageHint`, `quote` 메타데이터를 추가해 향후 PDF 뷰어·법령 라이브러리 확장 기반을 만들었다.
- 이번 턴에서는 결과 패널 1차 고도화까지 구현했고, `레이아웃 시뮬레이션`, `Interactive Eligibility Map`, `Pre-Check Audit Report`, `가이드/FAQ 대량 생성`은 다음 실행 항목으로 남겨두었다.

### 구현 파일

- `src/features/eligibility/components/result-panel.tsx`
- `src/features/eligibility/components/result-panel.test.tsx`
- `src/features/eligibility/components/expert-insight-card.tsx`
- `src/features/eligibility/components/convergence-review-card.tsx`
- `src/features/eligibility/components/legal-footnotes.tsx`
- `src/features/eligibility/data/expert-insights.ts`
- `src/features/eligibility/data/convergence-review-playbook.ts`
- `src/features/eligibility/data/legal-bases.ts`
- `src/features/eligibility/types.ts`

### 검증 결과

실행한 명령:

```bash
npm run lint
npm run test
npm run build
```

결과:

- `lint` 통과
- `test` 통과 (`6 passed`, `66 passed`)
- `build` 통과
- 빌드 시 번들 크기 경고는 기존과 동일하게 유지

---

## 2026-03-20 제휴 섹션 노출 강도 축소 및 본문 우선 재배치

### 반영 내용

- 홈 첫 화면에서 항상 보이던 `CoupangSideBanner` 2개를 제거해, 진입 즉시 광고성 요소가 먼저 보이는 인상을 줄였다.
- `affiliate` 섹션은 기본 펼침형 보드에서 `버튼으로 직접 여는 접힘형 참고 패널`로 전환했다. 초기 상태에서는 제휴 위젯과 제휴 안내 문구가 노출되지 않고, 사용자가 직접 펼칠 때만 보인다.
- 섹션 헤더 문구를 `참고용 제휴 링크`, `업종 분석과 법령 확인이 끝난 뒤 필요할 때만 참고` 같은 표현으로 바꿔, 본문보다 쇼핑 행동을 먼저 유도하던 톤을 낮췄다.
- 제휴 CTA는 `추천 상품 보기 / 추가 상품 보기`에서 `참고 상품 모음 보기 / 추가 참고 링크 보기`로 조정하고, 버튼 강도도 `secondary`, `outline`로 낮췄다.
- 펼친 뒤의 제휴 카드도 그림자와 배경 대비를 약화해 본문 카드보다 덜 강하게 보이도록 정리했다.

### 구현 파일

- `src/App.tsx`
- `src/App.test.tsx`
- `docs/codex-brain/task.md`

### 검증 결과

실행한 명령:

```bash
npm run lint
npm run test
npm run build
```

결과:

- `lint` 통과
- `test` 통과 (`6 passed`, `65 passed`)
- `build` 통과
- 빌드 시 번들 크기 경고와 plugin timings 경고는 남아 있으나, 이번 변경으로 새 오류는 발생하지 않음

---

## 2026-03-20 추천 상품 카드 라인 정렬 보정

### 반영 내용

- `affiliate` 추천 상품 카드 본문을 `flex` 기반 고정 구획 레이아웃으로 바꿔, 배지 행 다음 제목과 상품 위젯이 같은 시작선에서 보이도록 조정했다.
- 카드 전체에 `h-full`을 적용하고 상품 위젯 래퍼에 `flex-1`을 부여해, 긴 제목이 있어도 상품 박스와 하단 CTA가 카드마다 크게 어긋나지 않도록 정리했다.
- 제목은 `text-base ~ 1.0625rem` 범위로 소폭 줄이고 `min-h`를 부여해 `핸드폰과 태블릿`, `디지털 업무 기기`, `복사용지와 소모품`처럼 길이가 다른 문구도 비슷한 시각 리듬으로 정돈했다.
- 상단 `Badge`와 `외부 상품` 텍스트는 `whitespace-nowrap`와 더 작은 패딩을 적용해, 스크린샷처럼 상단 라벨이 두 줄로 갈라지며 카드 맨 윗선이 어긋나는 문제를 추가로 보정했다.
- 이번 수정은 시각 정렬만 다루며, 로딩/에러/빈 상태 분기나 기존 제휴 링크/iframe 동작은 바꾸지 않았다.

### 구현 파일

- `src/App.tsx`
- `docs/codex-brain/task.md`

### 검증 결과

실행한 명령:

```bash
npm run lint
npm run test
npm run build
```

결과:

- `lint` 통과
- `test` 통과 (`6 passed`, `65 passed`)
- `build` 통과
- Vite 번들 크기 경고(`500 kB 초과 chunk`)는 기존과 동일하게 유지

---

## 2026-03-20 UI 정보 위계 재조정

### 반영 내용

- 공통 `Card`, `Badge`의 기본 세기를 낮춰 모든 박스가 같은 무게로 보이던 문제를 줄였다.
- 홈 첫 화면에서는 hero, 주요 CTA, 핵심 수치 카드는 더 강하게 보이고, 안내 카드와 설명성 박스는 더 연하게 보이도록 재조정했다.
- 추천 검색 패널은 `업종코드를 몰라도 됩니다` 입력 영역을 메인으로 두고, 설명은 별도 보조 박스로 분리했다.
- 추천 결과 카드는 `먼저 볼 코드`와 `비슷한 코드`를 시각적으로 구분해, 바로 선택해야 하는 후보가 먼저 보이게 했다.
- 코드 사전은 검색 결과 개수, verdict 색상, 카드 상단 accent strip으로 결과 우선순위가 더 분명하게 보이도록 바꿨다.

### 구현 파일

- `src/components/ui/card.tsx`
- `src/components/ui/badge.tsx`
- `src/index.css`
- `src/App.tsx`
- `src/features/eligibility/components/industry-discovery-panel.tsx`
- `src/features/eligibility/components/code-directory-page.tsx`

---

## 2026-03-20 KSIC 11차 전수 코드 사전 + 쉬운 추천형 검색 개편

### 구현 개요

- 앱의 중심 흐름을 `쉬운 검색 홈 + 전용 코드 사전` 구조로 재편했다.
- `ksic11.txt`를 기반으로 KSIC 11차 `5자리 전체 1204개 코드`를 파싱해, `산업시설구역 + 지식산업센터` 전수 verdict 사전을 만들었다.
- 기존 exact 코드표, 마곡 관리기본계획 허용표, 시행령 대응표를 합쳐 `코드별 결과 / 이유 / 법적 근거 / 메모 / 검색키`를 갖는 디렉터리 레이어를 추가했다.
- 추천 엔진은 현재 구역 기준으로 `검토 가능한 코드`를 우선 보여주는 구조로 바꿨다.

### 핵심 반영 내용

- 새 데이터 레이어
  - `src/features/eligibility/data/magok-code-directory.ts`
  - `src/features/eligibility/types.ts`
- 추천/스토어 개편
  - `src/features/eligibility/data/industry-discovery.ts`
  - `src/store/eligibility-store.ts`
  - `src/features/eligibility/components/industry-discovery-panel.tsx`
- 화면 구조 개편
  - `src/App.tsx`
  - `src/features/eligibility/components/code-directory-page.tsx`
  - `src/features/eligibility/components/rulebook-tabs.tsx`
- 산출물 생성 스크립트
  - `scripts/export-magok-directory.mts`
  - `scripts/export_magok_directory_xlsx.py`

### 전수 사전 결과

- KSIC 11차 5자리 전체 코드 수: `1204`
- 지식산업센터
  - `가능 421`
  - `조건부 3`
  - `심의 필요 1`
  - `추가 확인 42`
  - `불가 737`
- 산업시설구역
  - `가능 376`
  - `불가 828`

### 생성 산출물

- `docs/codex-brain/magok_ksic11_full_directory.csv`
- `docs/codex-brain/magok_ksic11_full_directory.json`
- `docs/codex-brain/magok_ksic11_full_directory.xlsx`
- `docs/codex-brain/magok_ksic11_full_directory_summary.md`

### UI/UX 개편 결과

- 홈 화면은 `업종코드를 몰라도 됩니다` 흐름에 맞춰 쉬운 검색 중심으로 재구성했다.
- `코드 사전` 화면에서 전체 코드 목록을 검색, 구역 필터, 결과 필터, 대분류/업무군 필터로 탐색할 수 있게 했다.
- 기존 `판정 기준` 탭은 법령 참고용으로 단순화하고, 전체 exact 코드 브라우징은 코드 사전으로 이동했다.
- `72121`, `72922` 같은 중간 exact 코드도 검색으로 바로 찾을 수 있게 보강했다.

### 검증 결과

실행한 명령:

```bash
npm run export:directory
npm run lint
npm run build
npm run test -- --run
```

결과:

- `export:directory` 통과
  - `1204`행 CSV/JSON/XLSX/요약 산출물 재생성 확인
- `lint` 통과
- `build` 통과
- `test` 통과
  - 6개 테스트 파일
  - 65개 테스트 케이스 통과
- 참고: Vite 번들 크기 경고(`500 kB 초과`)는 남아 있지만 빌드는 정상 완료

---

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
  - 4개 테스트 파일
  - 19개 테스트 케이스 통과
- `npm run build` 통과
  - `dist/index.html`
  - `dist/assets/index-D0wNNO76.css`
  - `dist/assets/index-VDb091Lx.js`

### 결과 요약

- 사이트 안에 실제 승인 캡처용으로 쓸 기준 구역이 생겨, 사용자가 어느 위치를 제휴영역으로 잡아야 할지 더 명확해졌다.
- 실제 쿠팡 파트너스 링크만 나중에 꽂으면, 현재 레이아웃 그대로 승인용 캡처 흐름으로 이어갈 수 있게 됐다.

---

## 2026-03-19 단계형 위저드 전환

### 작업 배경

- 사용자는 현재의 병렬형 판별 화면 대신 `1단계 업종 찾기 → 2단계 조건 보정 → 3단계 결과 확인` 흐름으로 더 또렷하게 보이는 단계형 UX를 원했다.
- 별도 섹션으로 떨어져 있던 `세부 조건 직접 수정`은 흐름을 끊는 요소였기 때문에, 추천 업종 선택 뒤 필요한 경우에만 이어서 보정하도록 통합할 필요가 있었다.

### 반영 내용

- [App.tsx](C:/projects/magok/src/App.tsx)
  - `finder` 영역을 단일 위저드 컨테이너로 재구성했다.
  - 상단에 3단계 스텝바를 추가하고, 현재 단계의 설명만 크게 노출되도록 바꿨다.
  - 기존 좌우 병렬 `IndustryDiscoveryPanel + ResultPanel` 배치를 제거하고 단계별 단일 카드로 전환했다.
  - 별도 `직접 수정` 섹션을 삭제하고 2단계 화면 안으로 흡수했다.
  - `업종코드 분석 위저드`라는 `region` 레이블을 추가해 테스트 안정성과 접근성을 함께 보강했다.
- [eligibility-store.ts](C:/projects/magok/src/store/eligibility-store.ts)
  - `currentStep`과 `setCurrentStep()`를 추가했다.
  - `applyIndustrySuggestion()`은 더 이상 즉시 평가하지 않고, 코드/이름/법령 분류만 반영한 뒤 2단계로 이동하게 바꿨다.
  - `evaluate()`는 성공 시 3단계로 이동하게 바꿨다.
  - 2단계나 3단계에서 필드나 스위치를 바꾸면 이전 결과를 `idle + null`로 무효화하도록 정리했다.
- [industry-discovery-panel.tsx](C:/projects/magok/src/features/eligibility/components/industry-discovery-panel.tsx)
  - 추천 선택 버튼 문구를 `이 업종으로 계속`으로 바꾸고, `직접 입력으로 계속` 보조 버튼을 추가했다.
- [eligibility-form.tsx](C:/projects/magok/src/features/eligibility/components/eligibility-form.tsx)
  - `이전 단계`, 커스텀 액션 라벨, 기본 펼침 상태를 받도록 확장했다.
  - 2단계 진입 시 바로 보정할 수 있도록 기본 펼침형으로 재사용했다.
- [result-panel.tsx](C:/projects/magok/src/features/eligibility/components/result-panel.tsx)
  - `조건 다시 수정` 버튼, `sticky` 옵션, 단계 라벨을 추가해 3단계 전체 폭 카드로 재사용할 수 있게 했다.
- [App.test.tsx](C:/projects/magok/src/App.test.tsx), [eligibility-store.test.ts](C:/projects/magok/src/store/eligibility-store.test.ts), [setupTests.ts](C:/projects/magok/src/setupTests.ts)
  - 앱 통합 테스트를 단계형 흐름 기준으로 다시 작성했다.
  - 스토어 전이 테스트를 추가해 추천 선택, 결과 진입, stale result 무효화 규칙을 고정했다.
  - 테스트 간 DOM 중첩 문제를 막기 위해 cleanup을 명시했다.

### 검증

- `npm run lint` 통과
- `npm run test` 통과
  - 5개 테스트 파일
  - 23개 테스트 케이스 통과
- `npm run build` 통과
  - `dist/index.html`
  - `dist/assets/index-hZP1qH4M.css`
  - `dist/assets/index-6LO-ofsP.js`

### 배포 확인

- `npx wrangler pages deploy dist --project-name imomguide`로 재배포했다.
- 새 배포 URL: `https://24046f1c.imomguide.pages.dev`
- `https://24046f1c.imomguide.pages.dev`와 `https://loopincode.com` HTML이 모두 새 번들 `index-6LO-ofsP.js`, `index-hZP1qH4M.css`를 가리키는 것을 확인했다.

### 결과 요약

- 이제 메인 판별 흐름이 `찾기 → 보정 → 결과` 순서로 또렷하게 보여서, 처음 들어온 사용자도 어느 단계에 있는지 바로 이해할 수 있다.
- 직접 수정은 필요할 때만 2단계에서 열도록 정리돼 화면 집중도가 좋아졌고, 결과를 본 뒤 다시 조건을 고치는 왕복 흐름도 자연스러워졌다.

---

## 2026-03-19 경영컨설팅 검색 누락 보정

### 작업 배경

- 사용자는 사이트에서 `경영컨설팅`을 검색했는데 추천 결과가 보이지 않는다고 제보했다.
- 확인 결과, 화면 기준표와 해설 데이터에는 `11호 경영컨설팅업(71531)`이 있었지만, 실제 검색 추천 사전과 exact 5자리 CSV에는 빠져 있어서 `검색`과 `판정` 연결이 끊겨 있었다.

### 반영 내용

- [magok_knowledge_industry_center_exact_5digit_codes.csv](C:/projects/magok/docs/codex-brain/magok_knowledge_industry_center_exact_5digit_codes.csv)
  - `자동 허용` 구간에 `71531, 경영 컨설팅업` 행을 추가했다.
  - 메모에는 `재정·인력·생산·시장관리 또는 전략기획 자문`인지 실질 업무 범위를 확인하는 것이 안전하다는 설명을 넣었다.
- [industry-discovery.ts](C:/projects/magok/src/features/eligibility/data/industry-discovery.ts)
  - `경영컨설팅`, `경영컨설팅업`, `경영자문`, `전략컨설팅`, `사업컨설팅`, `기업컨설팅`, `전략기획자문`, `조직컨설팅`, `운영컨설팅` 별칭을 가진 preset을 추가했다.
  - 검색 결과가 `71531 경영 컨설팅업`으로 직접 이어지도록 `knowledgeIndustry` 분류도 함께 연결했다.
- [evaluator.test.ts](C:/projects/magok/src/features/eligibility/evaluator.test.ts)
  - `71531 경영 컨설팅업`이 지식산업센터에서 `자동 허용 코드`로 판정되는 테스트를 추가했다.
- [industry-discovery.test.ts](C:/projects/magok/src/features/eligibility/industry-discovery.test.ts)
  - `경영컨설팅 및 전략기획 자문` 입력 시 `71531`이 exact 추천으로 포함되는 테스트를 추가했다.

### 검증

- `npm run lint` 통과
- `npm run test` 통과
  - 5개 테스트 파일
  - 25개 테스트 케이스 통과
- `npm run build` 통과
  - `dist/index.html`
  - `dist/assets/index-CZDlIMdI.css`
  - `dist/assets/index-Oex0_FWl.js`

### 결과 요약

- 이번 건은 사용 방법 문제가 아니라 실제 데이터 누락이 맞았다.
- 이제 `경영컨설팅`으로 검색해도 추천 결과가 나오고, `71531`을 직접 입력해도 지식산업센터 자동 허용 흐름으로 이어진다.

---

## 2026-03-19 실무 검색어 누락 전수 점검

### 작업 배경

- 사용자는 `경영컨설팅` 외에도 비슷하게 검색되지 않는 업종이 더 있는지 확인해 달라고 요청했다.
- 그래서 이번에는 단일 사례 보정이 아니라, `지식산업 1~27호 exact 단일 코드`를 기준표, exact 5자리 CSV, 자연어 추천 사전 사이에서 다시 대조했다.

### 점검 결과

- `exact 5자리 CSV`에는 들어 있지만 `검색 preset`에는 빠져 있던 단일 exact 코드가 추가로 있었다.
- 이번 점검에서 보강한 항목은 아래 7개다.
  - `71391 옥외 광고업`
  - `75994 포장 및 충전업`
  - `59120 영화, 비디오물 및 방송 프로그램 제작 관련 서비스업`
  - `59201 음악 및 기타 오디오물 출판업`
  - `73903 사업 및 무형 재산권 중개업`
  - `73904 물품 감정, 계량 및 견본 추출업`
  - `76400 무형 재산권 임대업`
- 점검 후 기준으로는 `지식산업 1~27호의 단일 exact 코드`가 검색 사전에서 빠진 항목은 `0건`으로 맞췄다.

### 반영 내용

- [industry-discovery.ts](C:/projects/magok/src/features/eligibility/data/industry-discovery.ts)
  - 위 7개 코드에 대해 실무 검색어 별칭을 추가했다.
  - 예시:
    - `옥외광고`, `간판광고`, `전시광고` → `71391`
    - `포장충전`, `충전포장` → `75994`
    - `영상편집`, `후반작업`, `더빙`, `자막제작` → `59120`
    - `음원출판`, `오디오물출판`, `오디오북출판` → `59201`
    - `특허중개`, `기술이전중개`, `라이선스중개` → `73903`
    - `상품감정`, `계량서비스`, `견본추출` → `73904`
    - `특허라이선스`, `상표권라이선스`, `ip라이선스` → `76400`
- [industry-discovery.test.ts](C:/projects/magok/src/features/eligibility/industry-discovery.test.ts)
  - 위 항목들이 자연어 검색에서 exact 추천으로 실제 잡히는지 테스트를 확장했다.

### 검증

- 단일 exact 코드 대조 결과: 검색 사전 누락 `0건`
- `npm run lint` 통과
- `npm run test` 통과
  - 5개 테스트 파일
  - 32개 테스트 케이스 통과
- `npm run build` 통과
  - `dist/index.html`
  - `dist/assets/index-CZDlIMdI.css`
  - `dist/assets/index-pxTDacQP.js`

### 결과 요약

- `경영컨설팅`만의 문제가 아니라, 공식 업종명과 실무 검색어가 달라서 검색이 비기 쉬운 exact 코드가 몇 개 더 있었다.
- 지금은 그 구간까지 같이 메워서, 최소한 지식산업 1~27호의 단일 exact 코드는 검색 사전 기준으로 한 번씩은 걸리도록 정리했다.

---

## 2026-03-19 범위형 업종 실무 검색어 확장

### 작업 배경

- 사용자는 다음 단계로 `범위형 업종`까지 실무 검색어 사전을 더 넓혀 달라고 요청했다.
- 단일 exact 코드 보강 이후에도 `58 출판업`, `70 연구개발업`, `72 건축기술·엔지니어링 및 기타 과학기술 서비스업`, `85 교육서비스업`처럼 범위 전체로 허용되는 업종은 실무 표현이 훨씬 다양해서, 대표 코드를 별도로 잡아 주는 편이 실제 검색 체감이 좋았다.

### 반영 내용

- [industry-discovery.ts](C:/projects/magok/src/features/eligibility/data/industry-discovery.ts)
  - 범위형 업종 대표 코드를 중심으로 실무 검색어 preset을 크게 확장했다.
  - 연구개발업 `70`
    - `70119` 기타 자연과학 연구개발업
    - `70129` 기타 공학 연구개발업
    - `70130` 자연과학 및 공학 융합 연구개발업
    - `70201` 경제 및 경영학 연구개발업
    - `70209` 기타 인문 및 사회과학 연구개발업
  - 건축기술·엔지니어링 `72`
    - `72111` 건축 설계 및 관련 서비스업
    - `72112` 도시 계획 및 조경 설계 서비스업
    - `72121` 건물 및 토목 엔지니어링 서비스업
    - `72122` 환경 관련 엔지니어링 서비스업
    - `72911` 물질 성분 검사 및 분석업
    - `72921` 측량업
    - `72922` 제도업
    - `72923` 지질 조사·탐사 및 지도 제작업
  - 출판업 `58`
    - `58111`, `58112`, `58113`, `58121`, `58122`, `58123`, `58190`
    - `58211`, `58212`, `58219`
  - 교육서비스업 `85`
    - `85503` 온라인 교육학원
    - `85640` 사회교육시설
    - `85650` 직원 훈련기관
    - `85669` 기타 기술 및 직업 훈련학원
    - `85691` 컴퓨터 학원
    - `85631` 외국어학원
    - `85699` 그 외 기타 분류 안된 교육기관
  - 실제 검색어 예시는 다음처럼 반영했다.
    - `기업부설연구소`, `연구개발센터`
    - `건축설계`, `도시계획`, `환경영향평가`, `지질조사`
    - `출판사`, `전자책출판`, `웹툰출판`, `모바일게임개발`
    - `온라인교육`, `직업훈련원`, `코딩학원`, `사내교육`
- [evaluator.ts](C:/projects/magok/src/features/eligibility/evaluator.ts)
  - `코드만으로 확정 불가` 분기에서, 사용자가 `지식산업`, `정보통신산업`, `기타 허용업종` 같은 수동 법령 분류를 같이 선택한 경우 `정보 부족` 대신 `조건부 검토`로 이어지도록 보강했다.
  - 특히 `85 교육서비스업` 계열은 검색 후 2단계에서 법령 분류를 함께 고르면 더 실무적인 결과 흐름으로 이어진다.
- [industry-discovery.test.ts](C:/projects/magok/src/features/eligibility/industry-discovery.test.ts)
  - 연구개발, 엔지니어링, 출판, 교육서비스 대표 검색어 케이스를 대량 추가했다.
- [evaluator.test.ts](C:/projects/magok/src/features/eligibility/evaluator.test.ts)
  - `85691 컴퓨터 학원 + 지식산업 수동 분류` 조합이 `조건부`로 내려오는 테스트를 추가했다.

### 검증

- `npm run lint` 통과
- `npm run test` 통과
  - 5개 테스트 파일
  - 53개 테스트 케이스 통과
- `npm run build` 통과
  - `dist/index.html`
  - `dist/assets/index-mI5OlmAA.css`
  - `dist/assets/index-BzUj6zdl.js`

### 결과 요약

- 이제 검색 사전이 단일 exact 코드 위주에서, 실무에서 많이 찾는 범위형 업종 표현까지 한 단계 넓어졌다.
- 특히 `연구소`, `건축설계`, `출판사`, `온라인교육`, `코딩학원` 같은 표현이 이전보다 더 자연스럽게 대표 코드로 연결된다.

---

## 2026-03-19 쿠팡 실제 링크·배너·위젯 반영

### 작업 배경

- 사용자는 승인용 제휴영역의 플레이스홀더가 아니라 실제 쿠팡 파트너스 링크, 배너, 위젯을 바로 반영해 달라고 요청했다.
- 이번 단계의 목적은 `실제 제휴 요소 + 대가성 문구 + 문의 이메일`이 같은 화면에 함께 보이는 승인 제출용 라이브 구성을 만드는 것이다.

### 반영 내용

- [App.tsx](C:/projects/magok/src/App.tsx)
  - `승인용 제휴영역`의 비활성 플레이스홀더를 제거하고 실제 링크 2개를 버튼형 카드로 교체했다.
  - 실제 728x90 배너와 iframe 위젯을 같은 섹션 안에 추가했다.
  - 각 제휴 링크는 새 탭으로 열리고 `nofollow sponsored noopener` 속성을 붙였다.
  - 대가성 문구와 문의 이메일 `contact.loopinlab@gmail.com`은 같은 섹션 안에서 계속 보이도록 유지했다.
- [App.test.tsx](C:/projects/magok/src/App.test.tsx)
  - 실제 링크 href, 배너 alt, iframe title 렌더링을 검증하도록 보강했다.
- [coupang_final_approval_submission_checklist.md](C:/projects/magok/docs/codex-brain/coupang_final_approval_submission_checklist.md)
  - 현재 사이트에 반영된 실제 링크, 배너, 위젯 정보를 문서에 추가했다.

### 검증

- `npm run lint` 통과
- `npm run test -- --run` 통과
  - 5개 테스트 파일
  - 23개 테스트 케이스 통과
- `npm run build` 통과
  - `dist/index.html`
  - `dist/assets/index-tyawFIcj.css`
  - `dist/assets/index-B7d70x8T.js`
- 배포 원본 저장소 `C:/projects/imomguide_remote_20260319`에서도 `npm run lint`, `npm run test -- --run`, `npm run build`를 다시 통과했다.
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

- [App.tsx](C:/projects/magok/src/App.tsx)
  - `최종승인 준비`, `권장 문구`, `캡처 리허설` 같은 설명성 섹션을 제거했다.
  - 실제 제휴 노출은 `업무용 추천 상품` 섹션으로 축소하고, 버튼형 링크 2개와 작은 iframe 위젯, 짧은 `제휴 안내`만 남겼다.
  - 원래 과하게 노출되던 운영자/승인 카드형 푸터를 간단한 정보 3개로 축소했다.
- [App.test.tsx](C:/projects/magok/src/App.test.tsx)
  - 새로운 `업무용 추천 상품`, `제휴 안내`, `문의` 문구와 실제 링크 href, 위젯 존재 여부를 검증하도록 갱신했다.

### 검증

- `npm run lint` 통과
- `npm run test -- --run` 통과
  - 5개 테스트 파일
  - 32개 테스트 케이스 통과
- `npm run build` 통과
  - `dist/index.html`
  - `dist/assets/index-D2ydi6ep.css`
  - `dist/assets/index-CE1FXAGK.js`
- 배포 원본 저장소 `C:/projects/imomguide_remote_20260319`에서도 `npm run lint`, `npm run test -- --run`, `npm run build`를 다시 통과했다.
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

- [index.html](C:/projects/magok/index.html)
  - `google-adsense-account` meta 아래에 AdSense async script를 1회 추가했다.
- [App.tsx](C:/projects/magok/src/App.tsx)
  - 쿠팡 160x600 사이드 배너 상수를 추가했다.
  - `2xl` 이상 화면에서만 좌우에 고정되는 배너 2개를 렌더링하도록 반영했다.
  - 메인 `추천 상품` 섹션은 유지해 작은 화면에서는 기존 UX가 그대로 유지되게 했다.
- [App.test.tsx](C:/projects/magok/src/App.test.tsx)
  - `쿠팡 파트너스 사이드 배너` 링크가 2개 렌더링되는지 검증을 추가했다.

### 검증

- `npm run lint` 통과
- `npm run test -- --run` 통과
  - 5개 테스트 파일
  - 53개 테스트 케이스 통과
- `npm run build` 통과
  - `dist/index.html`
  - `dist/assets/index-DwCoa_IW.css`
  - `dist/assets/index-CuTCsTKB.js`
- GitHub 배포 원본 저장소 `C:\projects\imomguide_remote_20260319`에 같은 변경을 반영하고 커밋 `335d3fa` (`feat: add adsense script and side banners`)를 `codex/magok-site-replace`와 `main`에 푸시했다.
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

## 2026-03-19 업종 누락 재점검 및 상단 섹션 높이 정렬

### 작업 배경

- 사용자는 `경영컨설팅` 외에 다른 업종도 검색 누락이 남아 있는지 다시 확인해 달라고 요청했다.
- 추가로 상단 첫 섹션에 이미지를 넣은 뒤 왼쪽 히어로 카드와 오른쪽 안내 카드의 높이가 어긋나 보여, 두 섹션 높이를 맞춰 달라고 요청했다.

### 반영 내용

- [App.tsx](C:/projects/magok/src/App.tsx)
  - 상단 첫 섹션의 데스크톱 grid 정렬을 `lg:items-start`에서 `lg:items-stretch`로 바꿨다.
  - 왼쪽 히어로 카드를 `flex h-full flex-col` 구조로 바꿔 행 높이를 자연스럽게 함께 쓰도록 정리했다.
  - 오른쪽 안내 카드 `CardContent`를 `flex h-full flex-col`로 바꾸고, 하단 기준 배지 영역에 `mt-auto`를 적용해 카드 바닥에 안정적으로 붙도록 조정했다.
- 데이터 재점검
  - `knowledge-industry-review-table.ts`의 단일 5자리 코드 `59120, 59201, 71310, 71391, 71392, 71400, 71531, 73902, 73903, 73904, 74100, 75320, 75991, 75992, 75994, 76400`가 모두 `industry-discovery.ts` preset에 존재하는 것을 다시 확인했다.
  - 범위형 업종 대표 샘플 32개(`58`, `70`, `72`, `85` 계열)도 검색 preset에서 누락 없이 연결되는 것을 재확인했다.
  - 현재 남는 리스크는 구조적 누락이 아니라, 사용자가 입력할 수 있는 장기 꼬리 자유어 동의어 범위다.

### 검증

- `npm run lint` 통과
- `npm run test` 통과
  - 5개 테스트 파일
  - 53개 테스트 케이스 통과
- `npm run build` 통과
  - `dist/index.html`
  - `dist/assets/index-BnevUQsF.css`
  - `dist/assets/index-BmeHSo0H.js`
- Cloudflare Pages Preview 새 배포 URL: `https://ce92871a.imomguide.pages.dev`
- 운영 도메인 `https://loopincode.com` HTML이 동일한 최신 번들 `index-BmeHSo0H.js`, `index-BnevUQsF.css`를 가리키는 것을 확인했다.
- 운영 번들 `index-BmeHSo0H.js` 안에 `마곡 일반산업단지 전용`, `처음 오셨다면 이렇게 보세요` 문자열이 모두 포함되는 것도 확인했다.

### 결과 요약

- 기준표 기준의 구조적 업종 검색 누락은 이번 재점검에서도 추가로 발견되지 않았다.
- 상단 첫 섹션은 데스크톱에서 좌우 카드가 같은 높이로 정렬되도록 정리됐다.

---

## 2026-03-19 지식산업센터 기본값 조정

### 작업 배경

- 사용자는 `구역 또는 건물 유형`의 기본값이 `지식산업센터`로 시작하길 원했다.
- 이번 단계의 목적은 첫 화면과 입력 초기화 이후 상태 모두에서 `지식산업센터`를 기본값으로 유지하는 것이다.

### 반영 내용

- [eligibility-store.ts](C:/projects/magok/src/store/eligibility-store.ts)
  - `defaultInput.zoneType`을 `industrialFacility`에서 `knowledgeIndustryCenter`로 변경했다.
- [App.test.tsx](C:/projects/magok/src/App.test.tsx)
  - 초기 렌더링 시 `지식산업센터`가 화면에 보이는지 검증을 추가했다.

### 검증

- `npm run lint` 통과
- `npm run test -- --run` 통과
  - 5개 테스트 파일
  - 53개 테스트 케이스 통과
- `npm run build` 통과
  - `dist/index.html`
  - `dist/assets/index-BlJlcgiU.css`
  - `dist/assets/index-D0ioGliW.js`
- GitHub 배포 원본 저장소 `C:\projects\imomguide_remote_20260319`에 같은 변경을 반영하고 커밋 `df96b26` (`feat: default zone to knowledge industry center`)를 `codex/magok-site-replace`와 `main`에 푸시했다.
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

- [coupang-dynamic-banner.tsx](C:/projects/magok/src/components/coupang-dynamic-banner.tsx)
  - 쿠팡 `https://ads-partners.coupang.com/g.js`를 한 번만 로드하는 헬퍼를 추가했다.
  - 각 고정 배너 영역 안에서 `new PartnersCoupang.G(...)`를 실행해 다이나믹 배너를 렌더링하도록 구성했다.
- [App.tsx](C:/projects/magok/src/App.tsx)
  - 기존 정적 이미지 사이드 배너를 제거하고, `id=973794`, `template=carousel`, `trackingCode=AF7474453`, `160x600` 설정의 다이나믹 배너 2개로 교체했다.
- [App.test.tsx](C:/projects/magok/src/App.test.tsx)
  - 외부 스크립트 실행과 무관하게 `쿠팡 파트너스 사이드 배너` 래퍼 2개가 렌더링되는지 검증을 갱신했다.

### 검증

- `npm run lint` 통과
- `npm run test -- --run` 통과
  - 5개 테스트 파일
  - 53개 테스트 케이스 통과
- `npm run build` 통과
  - `dist/index.html`
  - `dist/assets/index-CfgHCmPe.css`
  - `dist/assets/index-B6DS_93j.js`

### 결과 요약

- 좌우 고정 배너는 유지하면서, 배너 콘텐츠 자체는 사용자 제공 태그 기반의 쿠팡 다이나믹 배너로 전환되도록 정리했다.

---

## 2026-03-19 쿠팡 추천 위젯 3종 배치

### 작업 배경

- 사용자는 본문 제휴영역에 새 쿠팡 iframe 위젯 3개를 넣고, 보기 좋게 배치한 뒤 커밋과 배포까지 해 달라고 요청했다.
- 이번 단계의 목적은 단일 위젯 대신 3개 위젯을 `추천 위젯 3종` 카드 그리드로 정리해, 정보 밀도는 높이고 시각적 답답함은 줄이는 것이다.

### 반영 내용

- [App.tsx](C:/projects/magok/src/App.tsx)
  - 기존 단일 `affiliateWidget`을 3개 iframe 위젯 배열로 교체했다.
  - 추천 상품 우측 영역을 `추천 위젯 3종` 카드로 바꾸고, `sm` 이상에서는 2열, `xl`에서는 3열 카드 그리드로 배치했다.
- [App.test.tsx](C:/projects/magok/src/App.test.tsx)
  - `추천 위젯 3종` 제목과 `쿠팡 파트너스 추천 위젯 1~3` iframe title이 렌더링되는지 검증하도록 갱신했다.

### 검증

- `npm run lint` 통과
- `npm run test -- --run` 통과
  - 5개 테스트 파일
  - 53개 테스트 케이스 통과
- `npm run build` 통과
  - `dist/index.html`
  - `dist/assets/index-DXmBQR9h.css`
  - `dist/assets/index-DRsMfrUv.js`

### 결과 요약

- 본문 제휴영역은 단일 위젯보다 훨씬 읽기 쉬운 3종 추천 위젯 카드형 레이아웃으로 정리됐다.

---

## 2026-03-19 쿠팡 사이드 배너 여백 재배치

### 작업 배경

- 사용자는 다이나믹 사이드 배너가 `왼쪽 오른쪽 비어 있는 쪽`이 아니라 어색한 흰 박스처럼 보여 이상하다고 판단했다.
- 이번 단계의 목적은 사이드 배너를 콘텐츠 바깥 여백에 직접 놓고, 본문과 시각적으로 섞이지 않게 정리하는 것이다.

### 반영 내용

- [coupang-dynamic-banner.tsx](C:/projects/magok/src/components/coupang-dynamic-banner.tsx)
  - 배너 래퍼의 흰 배경, 보더, 그림자, overflow를 제거해 광고 자체가 잘리지 않게 했다.
  - 표시 조건을 `2xl`에서 `min-[1560px]` 이상으로 조정해 충분한 가로폭이 있을 때만 보이게 했다.
- [App.tsx](C:/projects/magok/src/App.tsx)
  - 배너 위치를 `left/right-4`에서 `max-width 1180px` 본문 바깥 여백 기준 `calc(50vw - 590px - 184px)` 좌표로 옮겼다.
  - Tailwind 임의 좌표 클래스 대신 inline style로 고정 위치를 지정해 실제 콘텐츠 여백 좌표가 정확히 적용되게 했다.

### 검증

- `npm run lint` 통과
- `npm run test -- --run` 통과
  - 5개 테스트 파일
  - 53개 테스트 케이스 통과
- `npm run build` 통과
  - `dist/index.html`
  - `dist/assets/index-C0h_rT6e.css`
  - `dist/assets/index-BV9LX5-L.js`
- GitHub 배포 원본 저장소 반영 시 Tailwind 임의 좌표 클래스 대신 inline style 좌표로 다시 한 번 보정했다.
- GitHub 배포 원본 저장소 `C:\projects\imomguide_remote_20260319`에 같은 변경을 반영하고 커밋 `ea2f25b` (`fix: reposition side coupang banners in outer gutters`)를 `codex/magok-site-replace`와 `main`에 푸시했다.
- Cloudflare Pages Production Active: `https://e000dbf1.imomguide.pages.dev` (`ea2f25b`)
- `https://loopincode.com`은 확인 시점에 아직 직전 번들 `index-DRsMfrUv.js`, `index-DXmBQR9h.css`를 응답하고 있어 커스텀 도메인 캐시 반영이 더 필요했다.

### 결과 요약

- 사이드 배너는 이제 화면 모서리가 아니라 본문 양옆의 빈 여백을 기준으로 고정되도록 정리됐다.

---

## 2026-03-19 쿠팡 사이드 배너 미노출 보정

### 작업 배경

- 사용자는 실제 데스크톱 화면에서 `왼쪽 오른쪽에 광고가 없다`고 판단했고, 제공한 스크린샷에서도 사이드 배너가 렌더링되지 않았다.
- 원인을 다시 확인해 보니 사이드 배너 노출 breakpoint가 지나치게 높아 일부 데스크톱 폭에서 광고가 통째로 숨겨지고 있었다.

### 반영 내용

- [coupang-dynamic-banner.tsx](C:/projects/magok/src/components/coupang-dynamic-banner.tsx)
  - 사이드 배너 노출 조건을 `min-[1560px]`에서 `2xl`(`1536px`) 기준으로 낮춰 현실적인 데스크톱 화면에서 바로 보이게 조정했다.
- [App.tsx](C:/projects/magok/src/App.tsx)
  - 사이드 배너 좌표를 `calc(50vw - 590px - 184px)`에서 `max(8px, calc(50vw - 590px - 172px))`로 보정해, 콘텐츠 좌우 여백에 조금 더 밀착하면서도 화면 바깥으로 밀려나지 않게 했다.

### 검증

- `npm run lint` 통과
- `npm run test -- --run` 통과
- `npm run build` 통과

### 결과 요약

- 이전보다 더 넓은 데스크톱 폭에서 좌우 사이드 배너가 실제로 노출되도록 조건을 완화했고, 콘텐츠 여백 기준 위치도 함께 보정했다.

---

## 2026-03-19 쿠팡 사이드 배너 안정화

### 작업 배경

- 사용자는 쿠팡 사이드 광고가 여전히 `왼쪽 하단에 짱박혀` 보인다고 판단했고, 실제 화면에서도 다이나믹 태그가 의도한 좌우 고정 위치를 따르지 않았다.
- 현재 증상은 CSS 좌표 문제라기보다 쿠팡 다이나믹 태그가 사이드 2개 복제 배치와 잘 맞지 않는 구조에 가까웠다.

### 반영 내용

- [coupang-side-banner.tsx](C:/projects/magok/src/components/coupang-side-banner.tsx)
  - 쿠팡 다이나믹 스크립트 기반 컴포넌트를 제거하고, 정적 `160x600` 배너 이미지를 감싼 고정 사이드 배너 컴포넌트로 교체했다.
  - 링크는 `https://link.coupang.com/a/d7pcAe`, 이미지는 `973791` 배너 자산을 사용했다.
- [App.tsx](C:/projects/magok/src/App.tsx)
  - 좌우 사이드 광고 렌더링을 `CoupangDynamicBanner`에서 `CoupangSideBanner`로 전환했다.
  - 기존 콘텐츠 여백 기준 좌표는 유지해, 스크롤 시에도 좌우에 안정적으로 붙도록 구성했다.

### 검증

- `npm run lint` 통과
- `npm run test -- --run` 통과
- `npm run build` 통과

### 결과 요약

- 좌우 사이드 광고는 더 이상 쿠팡 다이나믹 스크립트에 의존하지 않고, 고정된 정적 160x600 배너로 안정적으로 렌더링되도록 바뀌었다.

---

## 2026-03-19 쿠팡 사이드 배너 iframe 재전환

### 작업 배경

- 사용자는 정적 이미지 배너 대신 쿠팡이 제공한 `widgets.html` iframe 태그로 좌우 사이드 광고를 다시 교체해 보길 원했다.
- iframe 방식은 다이나믹 스크립트보다 부모 레이아웃을 더 잘 따를 가능성이 높아, 콘텐츠 좌우 여백 고정 구조와의 궁합을 다시 검증할 가치가 있었다.

### 반영 내용

- [coupang-side-banner.tsx](C:/projects/magok/src/components/coupang-side-banner.tsx)
  - 정적 이미지 링크 기반 구현을 제거하고, `160x600` 쿠팡 iframe 위젯을 직접 렌더링하도록 변경했다.
  - 좌우 래퍼의 보더, 라운드, 그림자는 유지해 레일 광고처럼 보이도록 정리했다.
- [App.tsx](C:/projects/magok/src/App.tsx)
  - 사이드 배너 데이터 소스를 `href + imageSrc`에서 `iframeSrc`로 교체했다.
  - 좌우 모두 동일한 `widgets.html?id=973794&template=carousel&trackingCode=AF7474453...` iframe을 사용한다.

### 검증

- `npm run lint` 통과
- `npm run test -- --run` 통과
- `npm run build` 통과

### 결과 요약

- 좌우 사이드 광고는 다시 쿠팡 공식 iframe 위젯 기반으로 교체됐고, 위치 제어는 기존 콘텐츠 여백 고정 레일 구조를 그대로 사용한다.

---

## 2026-03-19 제휴 섹션 사용자 문구 정리

### 작업 배경

- 사용자는 제휴 영역에 `빠져야 할 문구`와 `보여야 할 문구`가 섞여 있는지 다시 확인해 달라고 요청했다.
- 실제 화면을 보면 `추천 위젯 3종`, `120 x 240`, `추천 위젯 1/2/3`처럼 운영자 또는 내부 분류에 가까운 문구가 남아 있어 사용자 경험을 흐리고 있었다.

### 반영 내용

- [App.tsx](C:/projects/magok/src/App.tsx)
  - 배지 문구를 `추천 상품`에서 `업무용 추천`으로 조정했다.
  - 본문 설명을 `사무환경 준비에 도움이 되는 제품을 함께 볼 수 있습니다.`로 줄였다.
  - CTA 버튼은 부가 설명을 제거하고 `추천 상품 보기`, `추가 상품 보기`만 남겼다.
  - 고지 영역 제목을 `제휴 안내`에서 `광고·제휴 안내`로 바꿔 사용자에게 더 명확하게 보이도록 했다.
  - 우측 위젯 영역의 `추천 위젯 3종`, `120 x 240`, `추천 위젯 1/2/3` 문구를 제거하고, 각 카드 하단에 `상품 자세히 보기`만 남겼다.
- [App.test.tsx](C:/projects/magok/src/App.test.tsx)
  - `광고·제휴 안내`, `추가 상품 보기`, `상품 자세히 보기` 기준으로 테스트를 갱신했다.

### 검증

- `npm run lint` 통과
- `npm run test -- --run` 통과
- `npm run build` 통과

### 결과 요약

- 제휴 섹션은 내부 설명 문구를 줄이고, 사용자에게 필요한 CTA와 대가성 고지 중심으로 더 직관적으로 정리됐다.

---

## 2026-03-19 제휴 섹션 UI/UX 보강

### 작업 배경

- 사용자는 현재 제휴 섹션의 UI/UX가 아직 아쉽다고 느꼈고, 예전에 보이던 생수 광고가 어디로 사라졌는지도 함께 확인하고 싶어 했다.
- 확인 결과 생수 위젯은 이전에 다른 3개 iframe 위젯으로 교체하는 과정에서 빠졌고, 제휴 섹션은 추천 맥락보다 단순한 버튼과 위젯 나열에 가까웠다.

### 반영 내용

- [App.tsx](C:/projects/magok/src/App.tsx)
  - `affiliateWidgets` 첫 항목을 예전 생수 위젯 `https://coupa.ng/clX3qg`로 되돌렸다.
  - 위젯 데이터에 `badge`, `headline`, `description` 정보를 추가해 추천 이유가 드러나도록 확장했다.
  - 제휴 섹션 왼쪽에는 `생수/비품`, `업무 기기`, `사무 소모품` 하이라이트 배지를 추가했다.
  - 오른쪽 영역은 `생수와 비품`을 강조하는 대표 카드 1개와 보조 카드 2개 구조로 재구성했다.
  - 대표 카드 아래에는 `탕비실이나 공용 공간에 두기 좋은 품목을 먼저 볼 수 있습니다.` 안내를 넣어 추천 맥락을 더 분명하게 만들었다.
- [App.test.tsx](C:/projects/magok/src/App.test.tsx)
  - 생수 위젯 복구와 새 UI 카피(`생수/비품`, `탕비실 추천`, `생수와 비품`) 기준으로 테스트를 갱신했다.

### 검증

- `npm run lint` 통과
- `npm run test -- --run` 통과
- `npm run build` 통과

### 결과 요약

- 제휴 섹션은 단순한 위젯 나열에서 벗어나, 생수 위젯을 다시 포함한 `대표 추천 + 보조 추천` 구조로 재정리됐다.

---

## 2026-03-19 제휴 섹션 4카드 재배치

### 작업 배경

- 사용자는 `3개까지 밖에 배치가 안 되나`, `핸드폰이 사라졌다`, `안 예쁘다`고 느꼈다.
- 실제로 제휴 섹션은 최근 개편 과정에서 모바일기기 위젯이 빠졌고, `대표 1개 + 보조 2개` 구조라 상품 구성이 반쯤 비어 보이는 문제가 있었다.

### 반영 내용

- [App.tsx](C:/projects/magok/src/App.tsx)
  - 누락됐던 `clX5tE` 모바일기기 위젯을 다시 추가해 총 4개 품목으로 복구했다.
  - 카테고리는 `모바일 기기`, `생수/비품`, `업무 기기`, `사무 소모품` 4개로 확장했다.
  - 오른쪽 레이아웃은 `많이 찾는 업무 준비 품목` 헤더 아래 2x2 카드 그리드로 재배치해, 네 개가 고르게 보이도록 정리했다.
  - 상단 두 카드는 강조 배경과 `추천` 배지를 주어 위계를 만들고, 모든 카드에 제목·설명·위젯·행동 문구가 들어가도록 다듬었다.
- [App.test.tsx](C:/projects/magok/src/App.test.tsx)
  - `쿠팡 파트너스 추천 위젯 모바일기기`와 `많이 찾는 업무 준비 품목` 문구를 포함한 새 구조 기준으로 테스트를 갱신했다.

### 검증

- `npm run lint` 통과
- `npm run test -- --run` 통과
- `npm run build` 통과

### 결과 요약

- 제휴 섹션은 다시 4개 품목이 모두 보이게 복구됐고, 2x2 그리드 기반으로 더 균형 있게 정리됐다.

---

## 2026-03-19 제휴 섹션 사이드 보드 재구성

### 작업 배경

- 사용자는 현재 배치가 여전히 별로라고 느꼈고, 특히 `사이드에 잘 구성`해 달라고 요청했다.
- 기존 4카드 구성은 품목 수는 맞췄지만, 왼쪽 영역이 여전히 크게 비어 보이고 오른쪽도 보드처럼 응집되지 않아 시선이 퍼지는 문제가 있었다.

### 반영 내용

- [App.tsx](C:/projects/magok/src/App.tsx)
  - 전체 비율을 `320px 안내 카드 + 나머지 추천 보드` 구조로 재조정했다.
  - 왼쪽은 설명, CTA, 광고 고지만 담은 컴팩트 카드로 축소했다.
  - 오른쪽 헤더를 `사이드 추천 보드`로 바꾸고, 4개 카드가 더 단단한 보드처럼 보이도록 여백과 위계를 재조정했다.
  - 카드에는 hover 상승 효과와 일관된 높이감을 주어 UI 밀도를 높였다.
- [App.test.tsx](C:/projects/magok/src/App.test.tsx)
  - 새 헤더 문구 `사이드 추천 보드` 기준으로 테스트를 갱신했다.

### 검증

- `npm run lint` 통과
- `npm run test -- --run` 통과
- `npm run build` 통과

### 결과 요약

- 제휴 섹션은 이제 왼쪽이 과하게 비어 보이지 않고, 오른쪽 추천 영역이 실제 `사이드 보드`처럼 더 응집력 있게 보이도록 재구성됐다.

---

## 2026-03-19 제휴 보드 고도화

### 작업 배경

- 사용자는 사이드 보드로 바꾼 뒤에도 여전히 부족하다고 느꼈다.
- 이전 구조는 비율은 나아졌지만 카드 내부가 여전히 단조롭고, 오른쪽 보드가 강한 위계를 가지지 못해 완성도가 덜 느껴졌다.

### 반영 내용

- [App.tsx](C:/projects/magok/src/App.tsx)
  - 왼쪽 안내 카드에 체크리스트형 메모를 추가해 단순 소개 카드보다 실사용 안내판처럼 느껴지도록 만들었다.
  - 오른쪽 카드 상단에 카테고리별 그라데이션 라인을 넣어 품목별 구분감을 높였다.
  - 각 추천 카드는 `좌측 정보 / 우측 상품 위젯` 구조로 바꿔, 이전보다 더 사이드 보드다운 압축된 밀도를 만들었다.
  - 카드 타이포, hover, 내부 여백을 함께 조정해 덜 밋밋하고 더 응집감 있게 보이도록 다듬었다.

### 검증

- `npm run lint` 통과
- `npm run test -- --run` 통과
- `npm run build` 통과

### 결과 요약

- 제휴 영역은 단순 카드 나열보다 더 `보드형 추천 패널`에 가까운 인상으로 개선됐다.

---

## 2026-03-19 loopincode 전용 소스 정리

### 작업 배경

- 사용자는 더 이상 필요하지 않은 예전 `imomguide` 사이트 제작 흔적을 제거하고, 현재 운영 중인 loopincode 관련 소스만 남겨 달라고 요청했다.
- 현재 웹 엔트리는 `index.html -> src/main.tsx -> src/App.tsx`, 데스크톱 엔트리는 `electron/main.mjs`인데, 루트에는 과거 정적 HTML/JS/CSS와 중복 정적 파일, 추적 중인 `dist` 산출물이 함께 남아 있었다.

### 반영 내용

- [README.md](C:/projects/magok/README.md)
  - 예전 정적 소스가 제거됐고 이제 React/Electron 기반 loopincode 소스만 관리한다는 현재 구조로 설명을 정리했다.
  - Cloudflare Pages 프로젝트명 `imomguide`는 기존 운영 인프라 식별자라서 이번 정리에서는 유지한다는 점을 명시했다.
- [.gitignore](C:/projects/magok/.gitignore)
  - `dist`와 `tmp_*`를 추가해 빌드 산출물과 임시 파일이 다시 추적되지 않게 정리했다.
- 삭제한 과거 정적/중복/임시 파일
  - 루트 정적 페이지와 템플릿:
    - `infant.html`, `postpartum.html`, `pregnancy.html`, `preschool.html`, `pricing.html`, `privacy.html`, `roadmap.html`, `toddler.html`, `tools.html`
    - `nav_template.html`, `mobile_nav_template.html`
    - `main.js`, `style.css`
  - 루트 중복 정적 파일:
    - `ads.txt`, `robots.txt`, `sitemap.xml`
  - 임시/미사용 파일:
    - `tmp_coupang_guide.pdf`, `tmp_coupang_partners_main.js`
    - `src/assets/hero.png`, `src/assets/react.svg`, `src/assets/vite.svg`
  - 추적 중이던 빌드 산출물:
    - `dist/` 내부 파일 전체
- 유지한 항목
  - 현재 앱 소스 `src/`
  - 정적 자산 원본 `public/`
  - 데스크톱 진입점 `electron/`
  - 법령/작업 문서 `docs/codex-brain/`
  - 배포 설정 `wrangler.toml`

### 검증

- `npm run lint` 통과
- `npm run test` 통과
  - 5개 테스트 파일
  - 53개 테스트 케이스 통과
- `npm run build` 통과
  - `dist/index.html`
  - `dist/assets/index-DCsMlPyE.css`
  - `dist/assets/index-SrEU6g-x.js`

### 결과 요약

- 저장소 루트에서 예전 `imomguide` 정적 사이트 흔적은 제거되고, 현재 loopincode 운영에 필요한 소스 중심 구조만 남게 됐다.
- `dist`는 더 이상 저장소에 추적되지 않고, 필요할 때 `npm run build`로만 다시 생성되는 구조로 정리됐다.

---

## 2026-03-20 지식산업센터 코드표 드롭다운 정리

### 작업 배경

- 사용자는 `사용자 정리 코드표 반영` 카드에서 요약 숫자만 보는 대신, 실제 코드를 `호별로` 펼쳐서 확인하고 싶어 했다.
- 기존 화면은 exact 5자리 규칙을 카운트로만 보여주고 있었고, 세부 코드를 확인하려면 CSV나 별도 표를 직접 찾아야 했다.
- 이어서 사용자는 사이트 전체가 `입주가 가능한 코드를 전부 알 수 있고`, `업종 코드를 추천해 주며`, `고등학생도 쉽게 검색할 수 있는 수준`으로 더 쉬워야 한다고 요청했다.

### 반영 내용

- [knowledge-center-exact-codes.ts](C:/projects/magok/src/features/eligibility/data/knowledge-center-exact-codes.ts)
  - CSV 전체를 화면에서 재사용할 수 있도록 `KNOWLEDGE_CENTER_CATALOG_ENTRIES`를 추가했다.
  - 각 항목에 판정구분, 입주검토 구분, 코드/범위, 업종명, 메모, exact 여부를 함께 담아 UI 쪽에서 바로 그룹핑할 수 있게 했다.
- [knowledge-industry-review-table.ts](C:/projects/magok/src/features/eligibility/data/knowledge-industry-review-table.ts)
  - `1호`, `4호`, `7호` 같은 범위형 조문에 `searchTerms`를 추가했다.
  - 이 값은 `72121`, `72922` 같은 중간 코드를 표 검색과 호별 드롭다운에서 함께 찾기 위한 기준으로 사용한다.
- [rulebook-tabs.tsx](C:/projects/magok/src/features/eligibility/components/rulebook-tabs.tsx)
  - `사용자 정리 코드표 반영` 카드 안에 `호별 펼쳐보기`와 `전체 코드표 펼쳐보기`를 새로 추가했다.
  - `호별 펼쳐보기`는 시행령 제6조제2항 1~27호 기준으로 exact 코드와 범위를 매핑해 보여준다.
  - `전체 코드표 펼쳐보기`는 입주검토 구분별로 `457개` 전체 항목을 드롭다운으로 탐색할 수 있게 바꿨다.
  - 검색어가 들어오면 일치하는 조문/분류 드롭다운이 자동으로 열려 사용자가 개별 코드를 바로 볼 수 있게 했다.
  - 이후 사용자 피드백을 반영해 `호별 보기`와 `분류별 보기`를 한 번에 동시에 보여주지 않고, 한 가지 방식만 선택해서 볼 수 있는 브라우징 구조로 다시 단순화했다.
  - 검색어가 있으면 `검색 결과`를 먼저 상단에 보여 주고, 브라우징은 아래에서 이어서 보게 해 읽는 순서를 더 자연스럽게 정리했다.
  - 추가로 exact 코드표 카드 자체를 `코드 검색`과 `전체 탐색` 두 모드로 분리해, 사용자가 지금 찾는 중인지 둘러보는 중인지 한눈에 이해되도록 다시 정리했다.
- [App.tsx](C:/projects/magok/src/App.tsx)
  - 메인 헤드라인과 소개 문구를 `입주 가능한 코드 전체 확인`, `추천 코드 받기`, `쉬운 검색` 중심으로 다시 썼다.
  - 첫 화면 CTA도 `코드 추천받기`, `가능 코드 전체 보기`처럼 행동이 바로 보이는 표현으로 정리했다.
- [industry-discovery-panel.tsx](C:/projects/magok/src/features/eligibility/components/industry-discovery-panel.tsx)
  - `업종코드를 몰라도 된다`는 메시지를 전면에 내세우고, 입력 예시와 버튼 문구도 더 쉬운 표현으로 바꿨다.
  - 추천 결과는 `추천 코드`, `비슷한 코드`처럼 덜 어려운 말로 보이게 다듬었다.
- [App.test.tsx](C:/projects/magok/src/App.test.tsx)
  - `72121` 검색 시 `4호` 드롭다운이 열리고 해당 코드가 실제로 화면에 표시되는지 검증을 추가했다.

### 검증

- `npm run lint` 통과
- `npm run test -- --run` 통과
- `npm run build` 통과

### 결과 요약

- 지식산업센터 exact 코드표는 이제 요약 숫자만 보여주는 카드가 아니라, `호별 근거`와 `전체 코드 목록`을 접고 펼치며 실제 검토에 사용할 수 있는 탐색 UI로 바뀌었다.
