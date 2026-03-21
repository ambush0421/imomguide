## 2026-03-20 V 상단 돋보기 로고 리디자인

### 목표

- 기존 `문서 + 확대경` 중심 심볼 대신, 더 단순하고 기억하기 쉬운 `V 위 돋보기` 조합으로 브랜드 인상을 다시 만든다.
- 현재 서비스가 쓰는 SVG 자산 구조를 유지하면서 헤더, 푸터, 파비콘에 같은 심볼이 일관되게 보이도록 정리한다.
- 텍스트 로고는 유지하되, 좌측 심볼만 바꿔도 전체 무드가 더 또렷하게 읽히도록 만든다.

### 현재 구조 진단

1. 현재 심볼은 `문서 아이콘 + 우하단 돋보기` 조합이라, 업종코드 검색이라는 기능은 설명하지만 인상이 다소 일반적이고 서비스 고유성이 약하다.
2. 실제 앱에서는 [`src/App.tsx`](C:\projects\magok\src\App.tsx)에서 `brandAssets`로 `public/brand/magok-codefinder-symbol.svg`, `public/brand/magok-codefinder-logo-horizontal.svg`를 직접 사용하고 있다.
3. 파비콘은 [`public/favicon.svg`](C:\projects\magok\public\favicon.svg), OG 기본 이미지는 [`src/features/guides/seo/seo-page-builder.ts`](C:\projects\magok\src\features\guides\seo\seo-page-builder.ts)에서 같은 `favicon.svg` 경로를 사용하므로, 심볼 변경 시 이 자산도 같이 맞추는 편이 일관성이 좋다.

### 구현 방향

1. 심볼 콘셉트
   - 배경의 강한 블루 정사각 라운드 박스는 유지한다.
   - 중앙에는 두꺼운 `V` 골격을 두고, 꼭짓점 상단 또는 상부 중앙에 작은 돋보기 링을 얹어 `찾기/탐색` 의미를 남긴다.
   - 손잡이는 너무 길지 않게 짧게 두어, 모바일 파비콘 크기에서도 `V`가 먼저 읽히게 만든다.
2. 자산 갱신
   - [`public/brand/magok-codefinder-symbol.svg`](C:\projects\magok\public\brand\magok-codefinder-symbol.svg)를 새 심볼로 교체한다.
   - [`public/brand/magok-codefinder-logo-horizontal.svg`](C:\projects\magok\public\brand\magok-codefinder-logo-horizontal.svg)의 좌측 심볼도 같은 도형 언어로 다시 그린다.
   - [`public/favicon.svg`](C:\projects\magok\public\favicon.svg)를 새 심볼 기준으로 동기화한다.
3. 연결 확인
   - [`src/App.tsx`](C:\projects\magok\src\App.tsx)의 헤더/푸터에서 새 자산이 자연스럽게 보이는지 확인한다.
   - [`index.html`](C:\projects\magok\index.html)과 SEO 기본 이미지 경로가 별도 코드 수정 없이 새 파비콘을 참조하는지 확인한다.

### 예상 영향 범위

- [`public/brand/magok-codefinder-symbol.svg`](C:\projects\magok\public\brand\magok-codefinder-symbol.svg)
- [`public/brand/magok-codefinder-logo-horizontal.svg`](C:\projects\magok\public\brand\magok-codefinder-logo-horizontal.svg)
- [`public/favicon.svg`](C:\projects\magok\public\favicon.svg)
- 필요 시 [`src/App.tsx`](C:\projects\magok\src\App.tsx)
- `docs/codex-brain/task.md`
- `docs/codex-brain/implementation_plan.md`
- `docs/codex-brain/walkthrough.md`

### 검증 계획

- `npm run lint`
- `npm run test`
- `npm run build`
- 헤더/푸터/파비콘 수동 확인

## 2026-03-20 각진 레이아웃 재정렬 + 빈 공간 2차 보정

### 목표

- 사용자가 싫다고 느낀 `하단이 허전한 카드` 인상을 더 줄이고, 시각적으로 선이 맞는 단단한 서비스형 레이아웃으로 다시 정리한다.
- 화면 전반의 과한 곡률을 줄여 `딱딱 떨어지는`, `각이 맞는` 인상을 만든다.
- 홈뿐 아니라 코드 사전, 가이드, 법령, 업데이트 페이지까지 같은 반경 스케일과 보조 카드 배치 규칙을 공유하게 만든다.

### 현재 구조 진단

1. 이전 보정으로 강제 `stretch`는 많이 줄었지만, 홈 첫 화면은 여전히 `큰 둥근 메인 카드 + 옆 세로 카드 스택` 인상이 강해 사용자가 원하는 `격자형 정렬감`이 부족하다.
2. `src/components/ui/card.tsx`, `src/components/ui/button.tsx`, `src/components/ui/badge.tsx`의 기본 반경이 크고 pill 성격이 강해서, 페이지별 배치를 다듬어도 전체 인상이 둥글고 느슨하게 보인다.
3. `src/App.tsx`와 각 서브페이지의 섹션 래퍼가 `rounded-[30px]` 안팎의 큰 반경을 반복해 쓰고 있어, 화면 전체가 카드보드처럼 둥글게 나뉘며 선 정렬감이 약해진다.
4. 가이드, 법령, 업데이트, 코드 사전의 보조 정보 카드는 여전히 `짧은 카드 세로 적층` 비중이 높아, 내용량이 적을 때 구조가 빈약해 보일 수 있다.

### 구현 방향

1. 공통 스타일
   - `Card`, `Button`, `Badge`, `AsyncState` 기본 반경을 한 단계씩 낮춰 더 각진 UI 기본값으로 바꾼다.
   - 필요 시 아이콘 배경 박스와 상태 박스도 같은 반경 스케일로 맞춘다.
2. `src/App.tsx`
   - 홈 첫 화면을 `메시지 / 빠른 기준 / 단계 안내`가 서로 맞물리는 격자형 구조로 재배치한다.
   - 상단 큰 카드 내부도 `본문 + 우측 요약 + 하단 수치` 식으로 재구성해 카드 하단이 허전해 보이지 않게 한다.
   - 홈 중단 섹션, 제휴 영역, 헤더, 푸터의 큰 래퍼 반경도 함께 줄여 전체 톤을 통일한다.
3. 서브페이지
   - 코드 사전, 가이드, 법령 라이브러리, 업데이트 로그의 상단 소개부와 보조 카드 구성을 `짧은 세로 스택`보다 `맞물리는 보조 격자` 중심으로 다시 정리한다.
   - 큰 화면에서 오른쪽이 비어 보이는 지점을 줄이기 위해 작은 정보 카드들을 2열 블록으로 묶는다.

### 예상 영향 범위

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

### 검증 계획

- `npm run lint`
- `npm run test`
- `npm run build`

## 2026-03-20 데스크 홈 상단 빈 공간 제거 2차

### 목표

- 데스크톱 홈 첫 섹션에서 왼쪽 히어로 아래가 비어 보이는 인상을 줄인다.
- 오른쪽 안내 영역이 여러 장의 카드로 세로 분절되며 전체 높이가 과도하게 길어지는 구조를 하나의 정보 카드 흐름으로 다시 묶는다.
- 같은 그룹으로 묶인 카드들은 폭과 높이 기준도 통일해 더 정돈된 그리드로 보이게 만든다.
- 상단은 `좌우 큰 블록`, 하단은 `공통 카드 행`으로 분리해 큰 박스 경계도 맞춘다.

### 현재 구조 진단

1. `src/App.tsx` 상단 우측 영역은 `처음 오셨다면 이렇게 보세요`, `바로 볼 핵심 정보`, `왜 이 흐름이 편한가요?`가 분리된 카드로 쌓여 있어 전체 높이가 왼쪽 히어로보다 길어지기 쉽다.
2. 이 구조 때문에 좌우 카드의 높이 차가 커지고, 실제 빈 공간은 카드 안이 아니라 `왼쪽 히어로 아래 빈 면`으로 체감된다.

### 구현 방향

1. `src/App.tsx`
   - 오른쪽 3개 카드 구조를 `하나의 통합 안내 카드`로 재구성한다.
   - 카드 내부에서 `단계 안내`, `핵심 정보`, `흐름 설명`을 섹션으로만 나눠 보여주고, 바깥 그리드에서는 하나의 덩어리처럼 보이게 만든다.
   - 각 섹션의 패딩과 보더를 줄여 정보는 유지하되 전체 높이는 더 압축한다.
   - `auto-rows-fr`, `h-full`을 같은 그룹 카드에 적용해 카드 높이가 글 길이에 따라 들쑥날쑥하지 않게 맞춘다.
   - 히어로 아래 설명 카드 행은 좌우 전체 폭을 쓰는 별도 행으로 빼서, 상단 큰 블록과 하단 카드 행이 명확히 나뉘도록 한다.

### 예상 영향 범위

- `src/App.tsx`
- `docs/pdca/2026-03-20-home-top-gap-removal.md`
- `docs/codex-brain/task.md`
- `docs/codex-brain/implementation_plan.md`
- `docs/codex-brain/walkthrough.md`

### 검증 계획

- `npm run lint`
- `npm run test`
- `npm run build`

## 2026-03-20 전체 웹사이트 밀도 재배치 + 빈 공간 제거

### 목표

- 특정 카드 하단이 텅 비어 보이는 문제를 한 군데만 땜질하지 않고, 사이트 전반의 레이아웃 규칙 차원에서 정리한다.
- 데스크톱에서 특히 두드러지는 `왼쪽 큰 카드 + 오른쪽 고정 폭 보조 카드` 패턴을 콘텐츠 길이에 따라 자연스럽게 접히고 재배치되는 구조로 바꾼다.
- 홈, 전수 코드 사전, 가이드, 법령 라이브러리, 업데이트 로그까지 공통으로 적용되는 “정보 밀도 높은 서비스형 UI”를 만든다.

### 현재 구조 진단

1. `src/App.tsx` 홈 첫 화면은 `lg:items-stretch` + 좌우 카드 `h-full` 조합을 사용하고 있어, 오른쪽 안내 카드 높이에 맞춰 왼쪽 히어로 카드가 불필요하게 늘어난다.
2. 같은 파일의 중단 섹션들도 2열 비율 고정 그리드 위에 콘텐츠 길이가 다른 카드들을 나란히 두고 있어, 화면마다 밀도 차이가 크고 빈 면이 남기 쉽다.
3. `src/features/eligibility/components/code-directory-page.tsx`, `src/features/guides/components/guide-page.tsx`, `src/features/library/components/legal-library-page.tsx`, `src/features/updates/components/update-log-page.tsx`도 고정 폭 보조 컬럼과 요약 카드 패턴을 반복해, 콘텐츠가 짧을 때 하단 여백이 구조적으로 생길 가능성이 높다.
4. `src/components/async-state.tsx`의 기본 `min-h-72`, 일부 `h-full`, 일부 카드 내부의 `mt-auto` 배치가 “안정적인 카드 높이”에는 유리하지만, 실제 내용이 짧은 경우 과한 빈 공간으로 보일 수 있다.
5. `Codex_System_Prompt.md`, `GEMINI.md`, `docs/pdca/`는 현재 워크스페이스에서 확인되지 않아, 이번 계획은 실제 소스와 기존 `docs/codex-brain` 기록을 기준으로 수립한다.

### 구현 방향

1. `src/App.tsx`
   - 홈 첫 화면을 `고정 높이 맞추기` 중심이 아니라 `콘텐츠 흐름 우선` 구조로 재배치한다.
   - 히어로 본문과 우측 안내 카드의 관계를 `늘어나는 2열`에서 `상단 핵심 메시지 + 보조 정보 레일` 구조로 바꿔, 하단 빈 공간 없이 정보가 채워지도록 한다.
   - 중단 섹션은 비슷한 밀도의 카드끼리 다시 묶고, 독립 섹션 수와 카드 길이를 조정해 전체 스크롤 흐름을 더 촘촘하게 만든다.
2. `src/features/eligibility/components/code-directory-page.tsx`
   - 상단 검색 패널과 우측 조건 요약 카드의 비율을 재설계해, 데스크톱에서 보조 컬럼이 과도하게 길어지지 않도록 조정한다.
   - 빈 결과/검색 결과 구역의 세로 길이도 공통 상태 컴포넌트 기준과 함께 맞춘다.
3. `src/features/guides/components/guide-page.tsx`
   - 상단 소개부의 본문 카드와 우측 요약 카드를 재구성해, 짧은 요약 때문에 우측 카드 하단이 비는 인상을 줄인다.
   - FAQ, 법령, 연관 코드 섹션은 같은 카드 반복보다는 읽기 흐름이 이어지는 밀도로 정리한다.
4. `src/features/library/components/legal-library-page.tsx`
   - 문서별 카드 안의 `문서 정보 / 원문 출처` 2열 보조 블록을 더 유연한 분할로 바꿔 긴 문서 설명과 짧은 메타데이터가 충돌하지 않게 한다.
5. `src/features/updates/components/update-log-page.tsx`
   - 업데이트 헤더와 각 항목의 `바뀐 화면 / 참고 출처` 보조 컬럼을 콘텐츠 길이에 따라 자연스럽게 아래로 흐르는 구조로 손본다.
6. 공통 컴포넌트
   - 필요 시 `src/components/ui/card.tsx`와 `src/components/async-state.tsx`의 기본 높이 정책을 완화하고, 페이지별로 강제 높이를 덜 쓰는 방향으로 조정한다.

### 예상 영향 범위

- `src/App.tsx`
- `src/components/ui/card.tsx`
- `src/components/async-state.tsx`
- `src/features/eligibility/components/code-directory-page.tsx`
- `src/features/guides/components/guide-page.tsx`
- `src/features/library/components/legal-library-page.tsx`
- `src/features/updates/components/update-log-page.tsx`
- 필요 시 `src/features/eligibility/components/industry-discovery-panel.tsx`
- 필요 시 `src/features/eligibility/components/eligibility-form.tsx`
- 필요 시 `src/features/eligibility/components/result-panel.tsx`
- `docs/pdca/README.md`
- `docs/pdca/2026-03-20-overall-density-relayout.md`
- `docs/codex-brain/task.md`
- `docs/codex-brain/implementation_plan.md`
- `docs/codex-brain/walkthrough.md`

### 검증 계획

- `npm run lint`
- `npm run test`
- `npm run build`

# 입주가능판별기 구현 계획

## 2026-03-20 탭·데스크 혼합형 위저드 모드 + 가독성 보정

### 목표

- 현재 모바일 전용 집중 모드를 태블릿과 데스크톱까지 확장하되, 모든 화면을 똑같이 모바일처럼 만들지 않고 `혼합형 위저드`로 재설계한다.
- 태블릿에서는 집중형 흐름을 유지하고, 데스크톱에서는 가운데 위저드 1개에 필요한 참고 정보만 옆에 두는 구조로 바꾼다.
- 동시에 제목 크기, 줄 길이, 카드 패딩, 본문 대비를 조정해 “생각보다 가독성이 떨어지는” 지점도 같이 해결한다.

### 현재 구조 진단

1. `src/App.tsx`에서 집중 모드는 `isMobileViewport && isMobileFinderFocused` 조건으로만 동작하고 있어, 태블릿과 데스크톱에서는 항상 넓은 홈 레이아웃으로 풀린다.
2. 실제 단계 본문은 `IndustryDiscoveryPanel`, `EligibilityForm`, `ResultPanel`로 잘 분리되어 있어 재배치 난이도는 높지 않다.
3. 현재는 제목과 설명이 크기 대비 길고, 카드 내부 패딩도 화면 크기별로 충분히 다듬어지지 않아 큰 화면에서 집중도가 떨어질 수 있다.

### 구현 방향

1. `src/App.tsx`
   - viewport 감지를 `mobile / tablet / desktop` 수준으로 확장하고, 기존 `finder focused` 상태를 태블릿과 데스크톱에서도 사용할 수 있게 정리한다.
   - 태블릿은 현재 모바일 집중형에 가까운 단일 위저드 화면으로 유지한다.
   - 데스크톱은 `중앙 위저드 패널 + 얇은 참고 패널` 2열 레이아웃으로 바꿔 공간 낭비 없이 집중 모드를 유지한다.
2. `src/features/eligibility/components/industry-discovery-panel.tsx`
   - 소개 카피 줄 수를 줄이고, 입력부와 예시/설명 박스의 폭과 간격을 데스크 기준으로 재정렬한다.
3. `src/features/eligibility/components/eligibility-form.tsx`
   - 설정 카드의 제목/설명 위계를 더 명확히 하고, 필드 그리드와 보조 문구의 줄 길이를 줄여 읽기 쉽게 만든다.
4. `src/features/eligibility/components/result-panel.tsx`
   - 결과 카드와 해설/이유/다음 액션 섹션의 제목 크기, 카드 간격, 텍스트 줄 길이를 조정해 한 번에 읽히도록 만든다.
5. 필요 시 공통 `Card`, `Badge`, `Button`의 padding/leading도 breakpoint 기준으로 미세 조정한다.

### 예상 영향 범위

- `src/App.tsx`
- `src/features/eligibility/components/industry-discovery-panel.tsx`
- `src/features/eligibility/components/eligibility-form.tsx`
- `src/features/eligibility/components/result-panel.tsx`
- 필요 시 `src/components/ui/card.tsx`
- 필요 시 `src/components/ui/button.tsx`
- `docs/codex-brain/task.md`
- `docs/codex-brain/implementation_plan.md`
- `docs/codex-brain/walkthrough.md`

### 검증 계획

- `npm run lint`
- `npm run test`
- `npm run build`

## 2026-03-20 단색 블루 적용

### 목표

- 화면 전체에서 gradient와 섞인 면을 제거하고, 단색 면 중심의 더 또렷한 UI로 정리한다.
- 포인트 컬러는 한 가지 블루 축으로만 사용하고, 큰 면은 화이트/라이트 뉴트럴 배경으로 고정한다.
- 사용자가 올린 홈 스크린샷처럼 첫 화면이 단정하고 명확하게 읽히도록 만든다.

### 현재 문제 진단

1. 전역 토큰이 중성으로 정리되어도, 아직 여러 컴포넌트와 페이지에 남아 있는 `linear-gradient`가 화면 인상을 섞어 보이게 한다.
2. 기본 버튼, 기본 배지, 기본 카드가 모두 gradient를 쓰고 있어 단색 레이아웃으로 읽히지 않는다.
3. 홈 첫 화면과 일부 상세 페이지 카드가 단색보다 `면이 흐르는 UI`처럼 보여 사용자 의도와 다르다.

### 구현 방향

1. `src/index.css`
   - 바디 배경을 gradient 없이 단색 `background`로 고정한다.
   - `accent`와 `accent-strong`을 사실상 같은 블루 축으로 맞춰 단색 사용 원칙을 강화한다.
2. `src/components/ui/button.tsx`, `src/components/ui/badge.tsx`, `src/components/ui/card.tsx`
   - 기본 variant에서 모든 gradient를 제거하고 단색 배경으로 전환한다.
3. `src/App.tsx`
   - 홈 히어로, 우측 안내 카드, 위저드 래퍼, 하단 카드, 푸터에 남은 gradient 배경을 단색 면으로 정리한다.
4. `src/features/*/components/*page.tsx`
   - 코드 사전, 가이드, 라이브러리, 업데이트 페이지 카드에 남은 gradient 배경을 단색으로 맞춘다.
5. `src/features/eligibility/components/industry-discovery-panel.tsx`
   - 검색/추천 패널 내 강조 박스의 gradient 배경도 단색으로 통일한다.

### 예상 영향 범위

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

### 검증 계획

- `npm run lint`
- `npm run test`
- `npm run build`

## 2026-03-20 파스텔 제거형 색 보정

### 목표

- 사용자가 유치하게 느끼는 파스텔 블루 큰 면을 줄이고, 더 성숙하고 제품적인 화면 무드로 재정렬한다.
- 전체를 어둡게 누르지 않으면서도 `화이트 중심`, `그래파이트 텍스트`, `짧고 강한 블루 포인트` 구조로 바꾼다.
- 특히 모바일 결과 화면처럼 정보 밀도가 높은 구간에서 학습앱 같은 느낌 대신 전문 서비스 UI처럼 보이게 만든다.

### 현재 문제 진단

1. 전역 `surface-muted`, `surface-soft`, `accent-soft`가 모두 파란 기운을 가지고 있어 큰 면적에 깔리면 유치한 인상으로 읽힌다.
2. `ResultPanel`의 핵심 결과 카드와 상세 해설 필드가 연한 블루 면을 반복해서 사용해, 모바일 화면에서 파스텔이 겹겹이 쌓여 보인다.
3. `EligibilityForm`과 모바일 위저드 카드도 같은 톤을 공유하고 있어, 흐름 전체가 다소 장난스럽게 느껴진다.

### 구현 방향

1. `src/index.css`
   - `surface` 계열을 거의 화이트/라이트 그레이에 가깝게 재정의하고, 바디 배경의 블루 기운도 크게 줄인다.
   - `accent-soft`는 작은 인터랙션용 수준으로만 남기고, `info`, `success`, `warning`, `danger` 배경도 파스텔 면이 아니라 거의 화이트 기반으로 바꾼다.
2. `src/components/ui/button.tsx`, `src/components/ui/badge.tsx`
   - 기본 버튼의 베이비 블루 느낌을 줄이고 더 간결한 블루 그라데이션으로 정리한다.
   - muted/success/warning/danger 배지는 채운 파스텔 면보다 얇은 선과 가벼운 백색 면 중심으로 바꾼다.
3. `src/App.tsx`
   - 모바일 집중 위저드와 메인 히어로/안내 카드의 하드코딩 블루 끝색을 제거하고, 큰 면은 화이트 중심으로 되돌린다.
4. `src/features/eligibility/components/result-panel.tsx`
   - 결과 요약 카드, 상세 해설 필드, 이유/가이드 섹션의 연한 블루 면을 없애고 중성 표면 중심으로 재구성한다.
5. `src/features/eligibility/components/eligibility-form.tsx`
   - 상단 설정 요약 카드의 파스텔 그라데이션을 제거해 2단계/3단계가 같은 시각 언어를 쓰도록 맞춘다.

### 예상 영향 범위

- `src/index.css`
- `src/components/ui/button.tsx`
- `src/components/ui/badge.tsx`
- `src/App.tsx`
- `src/features/eligibility/components/result-panel.tsx`
- `src/features/eligibility/components/eligibility-form.tsx`
- `docs/codex-brain/task.md`
- `docs/codex-brain/implementation_plan.md`
- `docs/codex-brain/walkthrough.md`

### 검증 계획

- `npm run lint`
- `npm run test`
- `npm run build`

## 2026-03-20 컬러 무드 2차 보정

### 목표

- 사용자가 느끼는 `할아버지 아저씨들이 쓸 법한 색` 인상을 줄이고, 더 젊고 제품적인 화면 톤으로 다시 보정한다.
- 전반적인 카드와 섹션의 테두리를 한 단계 더 또렷하게 세워 정보 구획이 선명하게 읽히도록 만든다.
- 기존의 신뢰감은 유지하되, 포인트 컬러를 더 현대적인 코발트 블루 축으로 이동시켜 덜 보수적인 첫인상을 만든다.

### 현재 문제 진단

1. 현재 토큰은 베이지는 사라졌지만, `화이트 + 파우더 블루 + 점잖은 네이비` 인상이 아직 강해 화면이 다소 보수적으로 읽힌다.
2. 공통 카드와 배지의 외곽선이 여전히 얇고 은은해, 화면 구조가 또렷하게 잡히지 않는다.
3. 첫 화면 히어로와 우측 안내 카드가 모두 연한 표면색이라, 포인트 블루가 살아도 전체 무드는 여전히 얌전하게 느껴진다.

### 구현 방향

1. `src/index.css`
   - `--accent`, `--accent-strong`, `--accent-soft`를 더 선명한 코발트 블루 축으로 이동한다.
   - `--border`, `--border-soft`, `--border-accent*`를 진하게 올리고, 그림자도 더 차가운 톤으로 재정의한다.
   - 바디 배경은 깨끗한 화이트 기반 위에 밝은 블루 기운을 조금 더 살려 제품 톤을 젊게 만든다.
2. `src/components/ui/button.tsx`
   - 기본 버튼을 더 생기 있는 블루 그라데이션으로 보정하고, 보조 버튼의 ring과 hover 대비를 강화한다.
3. `src/components/ui/badge.tsx`, `src/components/ui/card.tsx`
   - muted 배지와 기본 카드의 선을 더 또렷하게 세우고, 표면색을 더 차갑고 깨끗한 방향으로 정리한다.
4. `src/App.tsx`
   - 메인 히어로, 우측 안내 카드, 사실 카드의 배경/테두리 위계를 재보정해 첫 화면 인상이 덜 점잖고 더 현대적으로 보이게 한다.
5. `src/features/eligibility/components/code-directory-page.tsx`
   - 상단 루트 섹션과 검색 카드의 경계선을 더 분명하게 만들어 홈과 동일한 톤으로 맞춘다.

### 예상 영향 범위

- `src/index.css`
- `src/components/ui/button.tsx`
- `src/components/ui/badge.tsx`
- `src/components/ui/card.tsx`
- `src/App.tsx`
- `src/features/eligibility/components/code-directory-page.tsx`
- `docs/codex-brain/task.md`
- `docs/codex-brain/implementation_plan.md`
- `docs/codex-brain/walkthrough.md`

### 검증 계획

- `npm run lint`
- `npm run test`
- `npm run build`

## 2026-03-20 컬러 무드 리디자인

### 목표

- 현재의 `웜 베이지 + 강한 코발트 + 반투명 화이트` 조합에서 벗어나, 더 차분하고 제품적인 컬러 체계로 재정리한다.
- 폰트는 유지하고 색만 정리해도 인상이 크게 달라지도록 `src/index.css` 토큰과 공통 UI 컴포넌트부터 다시 잡는다.
- 부동산/법령/판정 서비스에 맞게 `신뢰감`, `정돈감`, `정보 밀도`가 먼저 느껴지도록 만든다.

### 현재 문제 진단

1. `src/index.css`의 베이지 배경 그라데이션과 코발트 포인트가 서로 다른 무드를 가져 전체 인상이 어색하다.
2. 공통 `Button`, `Badge`, `Card`가 여전히 광택형 블루 그라데이션, 반투명 화이트, 큰 그림자를 많이 써서 화면이 가볍지 않고 촌스럽게 보인다.
3. `App.tsx`, `code-directory-page.tsx`, `eligibility-form.tsx` 등에서 `rgba(244,248,255,...)`, `rgba(239,245,255,...)` 같은 연파랑 박스가 많이 남아 있어 전역 토큰을 바꿔도 화면이 통일되지 않는다.
4. 헤더/히어로/우측 설명 패널이 모두 밝은 카드인데 배경에도 컬러가 많아, 대비보다 산만함이 먼저 느껴진다.

### 제안 방향

1. 전역 배경은 `도자기 화이트` 계열의 아주 옅은 뉴트럴로 정리하고, 현재 베이지/골드 느낌은 거의 제거한다.
2. 본문과 선은 `차콜 잉크 + 뉴트럴 그레이`로 정리해 정보 서비스다운 밀도를 만든다.
3. 포인트 컬러는 지금보다 채도를 낮춘 `딥 네이비` 한 축으로 줄이고, hover/soft/selected 상태도 같은 계열 안에서만 움직이게 만든다.
4. 카드 배경은 불투명한 오프화이트 중심으로 바꾸고, 큰 그림자보다 얇은 경계선과 짧은 그림자로 정리한다.
5. 우측 설명 패널과 요약 카드 같은 보조 영역은 연파랑 박스를 남발하지 않고, 배경 차이보다 선과 여백으로 위계를 만든다.

### 구현 방향

1. `src/index.css`
   - `--background`, `--surface*`, `--foreground*`, `--border*`, `--accent*`, `--ring`, `--shadow*` 토큰을 새 무드로 재정의한다.
   - 바디 배경의 `radial-gradient`와 베이지 톤을 줄여 더 정제된 뉴트럴 배경으로 교체한다.
2. `src/components/ui/button.tsx`
   - 기본 버튼의 강한 블루 그라데이션과 과한 hover shadow를 줄이고, 더 평평한 네이비 솔리드 중심으로 바꾼다.
   - `secondary`, `ghost`, `outline`도 현재의 떠 있는 유리판 느낌을 줄인다.
3. `src/components/ui/badge.tsx`, `src/components/ui/card.tsx`
   - 배지와 카드의 반투명 광택 톤을 줄이고, 오프화이트 면 + 얇은 선 중심으로 정리한다.
4. `src/App.tsx`
   - 헤더, 메인 히어로, 우측 안내 패널, 푸터의 하드코딩된 밝은 배경과 블루 계열 보조 박스를 새 토큰 기준으로 정리한다.
5. `src/features/eligibility/components/code-directory-page.tsx`
   - 상단 섹션과 내부 요약 박스의 연파랑 배경을 줄이고, 필요한 강조만 남긴다.
6. `src/features/eligibility/components/eligibility-form.tsx`
   - 단계 카드와 보조 요약 박스의 블루 tint를 낮추고 뉴트럴 위계 중심으로 다시 정리한다.

### 예상 영향 범위

- `src/index.css`
- `src/components/ui/button.tsx`
- `src/components/ui/badge.tsx`
- `src/components/ui/card.tsx`
- `src/App.tsx`
- `src/features/eligibility/components/code-directory-page.tsx`
- `src/features/eligibility/components/eligibility-form.tsx`
- 필요 시 `src/features/eligibility/components/convergence-review-card.tsx`
- 필요 시 `src/features/eligibility/components/expert-insight-card.tsx`
- `docs/codex-brain/task.md`
- `docs/codex-brain/implementation_plan.md`
- `docs/codex-brain/walkthrough.md`

### 검증 계획

- `npm run lint`
- `npm run test`
- `npm run build`
- 홈 첫 화면에서 헤더/히어로/우측 패널 색 위계 시각 확인
- 코드 사전/판정 화면에서 하드코딩 블루 박스 잔존 여부 확인

## 2026-03-20 지마켓 산스 + 프리텐다드 전역 폰트 전환

### 목표

- 제목은 `Gmarket Sans`, 본문은 `Pretendard`로 전환해 또렷하면서도 친근한 인상을 만든다.
- 현재 전역 폰트 진입점인 `src/index.css` 한 곳에서 기본 서체와 제목 서체를 정리해 변경 범위를 최소화한다.
- 이미 광범위하게 쓰이는 `font-display` 유틸이 새 제목 폰트를 자연스럽게 타도록 유지한다.

### 구현 방향

1. `Pretendard`는 공식 저장소 CDN import를 사용해 본문용 sans 서체를 안정적으로 로드한다.
2. `Gmarket Sans`는 공식 배포 ZIP에서 받은 OTF 파일을 `public/fonts/gmarket-sans`로 self-hosting 한다.
3. `src/index.css`의 `body` 기본 `font-family`를 `Pretendard` 중심으로 바꾸고, 한국어 UI에 맞는 sans-serif fallback을 함께 정리한다.
4. `h1`~`h4`와 `@theme inline`의 `--font-display`를 `Gmarket Sans` 기반으로 바꿔, 현재 `font-display` 클래스가 붙은 카드 제목과 주요 헤딩이 자동으로 새 조합을 사용하게 한다.
5. `Gmarket Sans`는 공식적으로 `Light/Medium/Bold` 3종만 제공되므로, 현재 많이 쓰이는 `font-semibold` 계열에는 `Medium/Bold` 매핑이 자연스럽게 이어지도록 `@font-face` weight를 정리한다.
6. 변경 후 홈, 코드 사전, 라이브러리처럼 헤딩 밀도가 다른 화면에서 제목/본문 대비가 과하지 않은지 확인한다.

### 예상 영향 범위

- `src/index.css`
- 필요 시 `src/components/ui/card.tsx`
- 필요 시 `src/App.tsx`
- `docs/codex-brain/task.md`
- `docs/codex-brain/implementation_plan.md`
- `docs/codex-brain/walkthrough.md`

### 리스크 및 확인 포인트

- `Gmarket Sans`는 3개 굵기만 제공되므로 `500/600/700` 매핑을 CSS에서 명시해 현재 클래스 체계와 어긋나지 않게 해야 한다.
- 현재 `font-display`가 카드 타이틀처럼 비교적 작은 텍스트에도 쓰이고 있어, 일부 작은 제목은 자간 보정이 필요할 수 있다.
- AGENTS 문서에서 우선 읽으라고 한 `Codex_System_Prompt.md`, `GEMINI.md`, `docs/pdca/`는 현재 워크스페이스에서 확인되지 않아, 실제 소스 구조를 기준으로 계획을 수립한다.

### 검증 계획

- `npm run lint`
- `npm run test`
- `npm run build`
- 주요 헤딩/본문이 함께 있는 화면에서 시각 확인
- 모바일/데스크톱에서 제목 대비와 줄바꿈 확인

## 2026-03-20 모바일 집중형 위저드 + 트렌디 비주얼 리디자인

### 목표

- 모바일에서 사용자가 위저드에 들어오면 이전/이후 카드가 겹쳐 보이지 않도록, 현재 단계만 남는 집중형 흐름으로 전환한다.
- 홈 전반의 연한 파랑 위주 톤을 덜어내고, 더 세련된 중성 배경과 짙은 잉크 텍스트, 정제된 코발트 포인트를 중심으로 사이트 분위기를 다시 잡는다.
- 데스크톱 정보 구조는 유지하되, 모바일에서는 더 앱처럼 읽히고 데스크톱에서는 더 선명하고 현대적인 화면으로 느껴지게 만든다.

### 구현 방향

1. `src/App.tsx` 안에 모바일 전용 `finder` 집중 모드 상태를 추가하고, 위저드 진입 후에는 히어로/보조 섹션을 접은 채 현재 단계 패널만 보이도록 조건부 렌더링한다.
2. 모바일 집중 모드에서는 단계 칩, 상단 요약, 닫기/복귀 액션을 더 간결하게 바꿔 `현재 어디인지`만 짧게 보여준다.
3. `src/index.css`의 전역 토큰을 연파랑 SaaS 팔레트에서 벗어나 `웜 화이트 배경 + 잉크 네이비 + 코발트 포인트` 중심으로 다시 정의한다.
4. `src/components/ui/button.tsx`, `src/components/ui/badge.tsx`, `src/components/ui/card.tsx`의 그림자, 배경, hover 질감을 새 토큰과 맞추고 과한 광택 느낌을 줄인다.
5. `src/App.tsx`, `IndustryDiscoveryPanel`, `EligibilityForm`, `ResultPanel`의 핵심 그라데이션/하드코딩 블루 톤도 새 무드에 맞게 일부 직접 보정한다.
6. 마지막에 `npm run lint`, `npm run test`, `npm run build`를 돌리고 결과를 `walkthrough.md`에 정리한다.

### 예상 영향 범위

- `src/App.tsx`
- `src/index.css`
- `src/components/ui/button.tsx`
- `src/components/ui/badge.tsx`
- `src/components/ui/card.tsx`
- `src/features/eligibility/components/industry-discovery-panel.tsx`
- `src/features/eligibility/components/eligibility-form.tsx`
- `src/features/eligibility/components/result-panel.tsx`
- `src/App.test.tsx`
- `docs/codex-brain/task.md`
- `docs/codex-brain/implementation_plan.md`
- `docs/codex-brain/walkthrough.md`

### 검증 계획

- `npm run lint`
- `npm run test`
- `npm run build`

## 2026-03-20 모바일 오버플로/잘림 보정

### 목표

- 모바일에서 화면 오른쪽이 잘리는 실제 오버플로 문제를 먼저 없애고, 사용자가 가로 스크롤 없이 위저드를 읽을 수 있게 만든다.
- 특히 헤더의 `코드 사전 열기` 버튼과 1단계 내부의 긴 보조 버튼·예시 칩이 좁은 폭에서 전체 레이아웃을 밀어내지 않도록 모바일 전용 압축 규칙을 추가한다.
- 단순히 `overflow-x-hidden`으로 가리는 데서 끝내지 않고, 원인 요소의 라벨 길이와 노출량도 함께 줄여 구조적으로 안전한 모바일 화면으로 정리한다.

### 구현 방향

1. `src/App.tsx`의 모바일 헤더 CTA는 짧은 라벨과 더 작은 가로 패딩으로 줄이고, 루트 래퍼에는 `overflow-x-hidden`을 추가한다.
2. 브랜드 보조 텍스트와 헤더 간격도 모바일 기준으로 조금 더 압축해 로고/버튼/메뉴가 한 줄 안에서 안정적으로 들어오게 한다.
3. `IndustryDiscoveryPanel`에서는 모바일용 보조 버튼 문구를 `직접 입력`처럼 짧게 바꾸고, 긴 라벨은 데스크톱 이상에서만 풀 텍스트를 보이게 한다.
4. 예시 칩은 모바일에서 처음 2개만 보이게 하고, `더 보기`를 눌렀을 때만 전체 칩을 펼쳐 첫 화면 폭과 높이를 동시에 안정화한다.
5. 마지막에 `npm run lint`, `npm run test`, `npm run build`를 다시 실행해 회귀 여부를 확인하고 결과를 문서에 남긴다.

### 예상 영향 범위

- `src/App.tsx`
- `src/features/eligibility/components/industry-discovery-panel.tsx`
- `src/App.test.tsx`
- `docs/codex-brain/task.md`
- `docs/codex-brain/implementation_plan.md`
- `docs/codex-brain/walkthrough.md`

### 검증 계획

- `npm run lint`
- `npm run test`
- `npm run build`

## 2026-03-20 모바일 압축형 2차 보정

### 목표

- 모바일에서 첫 스크린 안에 `제목`, `현재 단계`, `입력 시작점`이 더 빨리 들어오도록 홈과 `finder`의 세로 길이를 한 번 더 줄인다.
- 이미 단일 패널로 바뀐 구조는 유지하되, 여전히 무겁게 느껴지는 `사실 카드`, `보조 포인트`, `두꺼운 보조 CTA`를 더 가볍게 만들어 실제 앱형 위저드처럼 읽히게 한다.
- 사용자는 스크롤보다 `입력 -> 추천 -> 결과` 행동 흐름을 먼저 이해하고, 모바일에서 넘침이나 중첩감 없이 주요 버튼을 누를 수 있어야 한다.

### 구현 방향

1. `src/App.tsx`에서 모바일 기준으로 히어로의 `introFacts`, 보조 포인트 섹션을 줄이거나 숨겨 `finder`가 더 빨리 보이게 만든다.
2. `finder` 외곽 패딩, 내부 헤더, 3단계 탭 버튼의 모바일 높이와 그림자 강도를 더 낮춰 카드가 여러 겹 뜬 느낌을 줄인다.
3. `IndustryDiscoveryPanel`의 입력 설명은 모바일에서 더 짧게 보이게 하고, `textarea` 높이와 예시 칩 간격, 보조 CTA의 시각적 무게를 한 번 더 줄인다.
4. `EligibilityForm`, `ResultPanel`은 상단 요약 카드 그리드와 제목 크기, 버튼 배치를 모바일 우선 밀도로 다시 조정한다.
5. 구조/카피 회귀가 없는지 `npm run lint`, `npm run test`, `npm run build`로 다시 확인하고 결과를 `walkthrough.md`에 남긴다.

### 예상 영향 범위

- `src/App.tsx`
- `src/features/eligibility/components/industry-discovery-panel.tsx`
- `src/features/eligibility/components/eligibility-form.tsx`
- `src/features/eligibility/components/result-panel.tsx`
- `docs/codex-brain/task.md`
- `docs/codex-brain/implementation_plan.md`
- `docs/codex-brain/walkthrough.md`

### 검증 계획

- `npm run lint`
- `npm run test`
- `npm run build`

## 2026-03-20 사용자 관점 문구 최적화

### 목표

- 사용자가 이 사이트를 이용하면서 바로 이해하고 행동할 수 있는 문구만 남기고, 운영자나 내부 담당자에게 설명하듯 쓰인 문장을 줄인다.
- 기능 구조는 바꾸지 않고, 홈/위저드/결과/참고 영역의 보조 설명을 사용자 시선의 언어로 다시 다듬는다.

### 구현 방향

1. `src/App.tsx`의 히어로 보조 설명, 사실 카드, 코드 사전 소개 문구에서 내부 구현 설명이나 제도 해설 톤을 줄인다.
2. `IndustryDiscoveryPanel`, `EligibilityForm`, `ResultPanel`의 설명문은 `무엇을 하면 되는지`, `지금 무엇을 보여주는지` 중심으로 다시 쓴다.
3. `RulebookTabs`는 법령 자체를 숨기지 않되, 섹션 소개 문구를 사용자 참고용 안내 톤으로 바꾼다.
4. 테스트에 직접 걸리는 헤딩은 가능한 유지하고, 설명/보조 카피 중심으로 손본 뒤 `lint/test/build`로 회귀를 확인한다.

### 예상 영향 범위

- `src/App.tsx`
- `src/features/eligibility/components/code-directory-page.tsx`
- `src/features/eligibility/components/industry-discovery-panel.tsx`
- `src/features/eligibility/components/eligibility-form.tsx`
- `src/features/eligibility/components/result-panel.tsx`
- `src/features/eligibility/components/rulebook-tabs.tsx`
- `src/features/guides/components/guide-page.tsx`
- `src/features/library/components/legal-library-page.tsx`
- `src/features/updates/components/update-log-page.tsx`
- `docs/codex-brain/task.md`
- `docs/codex-brain/walkthrough.md`

### 검증 계획

- `npm run lint`
- `npm run test`
- `npm run build`

## 2026-03-20 모바일 위계 중심 리디자인

### 목표

- 모바일에서 첫 화면을 가리는 과도한 헤더 높이와 중복 카드 깊이를 줄여, 사용자가 `무엇을 눌러야 하는지`를 더 빨리 이해하게 만든다.
- 기존 블루 톤은 유지하되, 구조적으로 과했던 `큰 헤더 + 큰 소개 카드 + 큰 위저드 헤더 + 긴 추천 카드`를 압축해 실제 SaaS 제품처럼 읽히는 화면으로 다듬는다.
- 특히 추천 결과 카드와 핵심 CTA가 모바일에서 두 줄로 꺾이거나 설명에 묻히지 않도록 정보 위계를 다시 잡는다.

### 구현 방향

1. `src/App.tsx`의 sticky 헤더를 모바일 기준 2줄 컴팩트 구조로 재배치하고, 큰 빈 여백 없이 `로고 / 핵심 CTA / 메뉴`가 빠르게 읽히도록 정리한다.
2. 상단 히어로 우측의 긴 보조 설명 카드는 모바일에서 숨기거나 축약하고, 대신 더 짧은 단계 요약만 남겨 첫 화면 길이를 줄인다.
3. `finder` 섹션 상단의 소개 문구와 3단계 스텝 UI를 모바일 우선으로 압축해, 바깥 설명보다 실제 위저드 본문이 먼저 보이게 만든다.
4. `IndustryDiscoveryPanel`의 예시 버튼과 안내 박스는 모바일에서 덜 길게 보이도록 정리하고, 추천 카드와 CTA는 줄바꿈 없이 더 컴팩트한 레이아웃으로 다시 맞춘다.
5. 필요 시 `EligibilityForm`과 `ResultPanel`의 상단 요약 영역도 모바일 스캔 속도 기준으로 여백과 버튼 배치를 다듬고, 마지막에 `lint/test/build`로 회귀를 확인한다.

### 예상 영향 범위

- `src/App.tsx`
- `src/features/eligibility/components/industry-discovery-panel.tsx`
- `src/features/eligibility/components/eligibility-form.tsx`
- `src/features/eligibility/components/result-panel.tsx`
- `src/App.test.tsx`
- `docs/codex-brain/task.md`
- `docs/codex-brain/walkthrough.md`

### 검증 계획

- `npm run lint`
- `npm run test`
- `npm run build`

## 2026-03-20 쉬운 검색 홈 단일 패널 전환 정리

### 목표

- `finder`가 단계마다 새 창이 겹쳐 뜨는 것처럼 보이지 않게 하고, 하나의 메인 패널 안에서 본문만 바뀌는 위저드로 정리한다.
- 이미 만든 `입력 -> 추천 결과 -> 조건 확인 -> 결과 확인` 흐름은 유지하되, 카드 중첩과 반복 헤더만 줄여 시각적 깊이를 단순화한다.

### 구현 방향

1. `HomeSections`의 바깥 카드만 메인 패널로 유지하고, 단계 컴포넌트는 그 안에 삽입되는 본문 역할로 바꾼다.
2. `IndustryDiscoveryPanel`, `EligibilityForm`, `ResultPanel`에 임베드 모드를 추가해 내부 `Card` 래퍼와 중복 헤더를 선택적으로 제거한다.
3. 단계별로 필요한 핵심 요약 카드와 액션 버튼은 유지하되, 이중 테두리와 이중 제목 구조는 줄인다.
4. 테스트는 더 이상 내부 개별 카드 제목에 의존하지 않고, 한 개 위저드 영역 안에서 단계 전환이 이뤄지는 흐름을 기준으로 확인한다.

### 예상 영향 범위

- `src/App.tsx`
- `src/features/eligibility/components/industry-discovery-panel.tsx`
- `src/features/eligibility/components/eligibility-form.tsx`
- `src/features/eligibility/components/result-panel.tsx`
- `src/App.test.tsx`
- `docs/codex-brain/task.md`
- `docs/codex-brain/walkthrough.md`

### 검증 계획

- `npm run lint`
- `npm run test`
- `npm run build`

## 2026-03-20 쉬운 검색 홈 뎁스형 화면 전환 개선

### 목표

- 사용자가 `finder` 섹션에서 같은 카드 안의 정보 덩어리를 읽는 것이 아니라, 클릭할 때마다 다음 화면으로 넘어간다는 느낌을 분명하게 받게 한다.
- 현재 `discover -> adjust -> result` 구조는 유지하되, 1단계 안의 `검색 입력`과 `추천 결과`도 분리해 더 뎁스형 흐름으로 바꾼다.

### 구현 방향

1. `HomeSections`의 위저드 본문을 단계별 스크린처럼 보이도록 슬라이드형/패널형 전환 구조로 재구성한다.
2. `IndustryDiscoveryPanel`은 `입력 화면`과 `추천 결과 화면`을 분리하고, 검색 버튼을 누르면 결과 화면으로 넘어가게 만든다.
3. 추천 결과 화면에서는 `다시 검색`, `직접 입력으로 계속`, `이 코드로 확인하기`를 명확한 다음 행동으로 배치한다.
4. 추천 코드 선택 시 2단계 `adjust`로, `결과 보기` 시 3단계 `result`로 자동 전환되게 유지한다.
5. 2단계와 3단계는 이전/다음 관계가 명확하게 보이도록 헤더와 내비게이션을 보강한다.
6. 테스트는 `App.test.tsx`에서 `검색 -> 추천 결과 화면 -> 코드 선택 -> 조건 보정 -> 결과 화면` 흐름을 기준으로 갱신한다.

### 예상 영향 범위

- `src/App.tsx`
- `src/features/eligibility/components/industry-discovery-panel.tsx`
- `src/store/eligibility-store.ts`
- `src/App.test.tsx`
- `docs/codex-brain/task.md`
- `docs/codex-brain/walkthrough.md`

### 검증 계획

- `npm run lint`
- `npm run test`
- `npm run build`

## 2026-03-20 고대비형 SaaS 색 체계 보정

### 목표

- 현재 블루 단일 톤 위주의 안전한 팔레트를, CTA와 핵심 정보가 더 또렷하게 들어오는 고대비형 SaaS 스타일로 보정한다.
- 제품 구조와 컴포넌트 체계는 유지하되, 배경-카드-강조색 위계를 더 분명하게 만들어 첫인상과 스캔 속도를 개선한다.
- 전역 토큰, 공통 UI 컴포넌트, 홈 핵심 섹션까지만 우선 손대고 기능 흐름이나 문구는 바꾸지 않는다.

### 구현 방향

1. `src/index.css`의 전역 색 토큰을 더 중립적인 배경과 더 진한 전경, 더 선명한 블루 CTA 기준으로 재정의한다.
2. `src/components/ui/button.tsx`, `badge.tsx`, `card.tsx`, `async-state.tsx`의 기본 색/테두리/그림자 체계를 새 토큰 기준으로 높여 공통 대비를 끌어올린다.
3. `src/App.tsx`의 헤더, 히어로, 위저드, 코드 사전/법령/업데이트/가이드 진입 섹션처럼 시선이 가장 많이 머무는 영역의 배경과 테두리 대비를 함께 강화한다.
4. 상태 색은 기존 의미를 유지하되, muted/default 배지와 보조 카드가 배경에 묻히지 않도록 더 진한 텍스트와 선명한 경계를 준다.
5. 마지막에 `lint/test/build`를 다시 실행해 기능 회귀 없이 스타일만 바뀌었는지 확인한다.

### 예상 영향 범위

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
- `docs/codex-brain/walkthrough.md`

## 2026-03-20 PDCA UI/UX 잔여 핵심 보정

### 목표

- 이미 반영된 UI/UX 개선은 유지하고, 실제로 남아 있는 핵심 갭만 보정한다.
- 공통 `Button`에 `loading` 상태를 추가해 추천/판정 CTA의 비동기 피드백을 일관되게 맞춘다.
- `SelectItem` 상호작용 affordance와 lazy 전환 이후 깨진 테스트 1건을 함께 정리해 문서-코드-검증 상태를 다시 일치시킨다.

### 구현 방향

1. `src/components/ui/button.tsx`에 `loading?: boolean`을 추가하고, 네이티브 버튼일 때만 스피너, `disabled`, `aria-busy`를 자동 적용한다.
2. `src/features/eligibility/components/industry-discovery-panel.tsx`와 `src/features/eligibility/components/eligibility-form.tsx`의 주요 CTA에 `loading`을 연결해 중복 클릭 방지와 시각 피드백을 동시에 제공한다.
3. `src/components/ui/select.tsx`의 `SelectItem` 커서를 `cursor-pointer`로 바꿔 클릭 가능한 요소라는 신호를 명확히 한다.
4. `src/App.test.tsx`의 전수 코드 사전 진입 테스트를 `findByRole` 기반으로 바꿔 lazy 렌더링 이후 DOM 준비를 기다리게 한다.
5. `Button` loading 동작을 별도 컴포넌트 테스트로 추가하고, 마지막에 `lint/test/build`를 모두 다시 돌린다.

### 예상 영향 범위

- `src/components/ui/button.tsx`
- `src/components/ui/select.tsx`
- `src/features/eligibility/components/industry-discovery-panel.tsx`
- `src/features/eligibility/components/eligibility-form.tsx`
- `src/App.test.tsx`
- `src/components/ui/button.test.tsx`
- `docs/codex-brain/task.md`
- `docs/codex-brain/walkthrough.md`

## 2026-03-20 Cloudflare Pages Git 빌드 누락 원인 점검

### 목표

- Cloudflare Pages 로그의 `No build command specified. Skipping build step.`와 `Output directory "dist" not found.`가 왜 발생했는지 현재 저장소 기준으로 확정한다.
- 저장소 수정만으로 해결 가능한 범위와, Cloudflare 대시보드에서 반드시 맞춰야 하는 설정을 분리해서 정리한다.

### 구현 방향

1. `wrangler.toml`에서 Pages 출력 디렉터리 설정이 어떻게 선언돼 있는지 확인한다.
2. `package.json`에서 실제 프로덕션 빌드 명령이 무엇인지 확인한다.
3. 로컬에서 `npm run build`를 다시 실행해 `dist`가 정상 생성되는지 검증한다.
4. Cloudflare 공식 문서 기준으로 Git 연동 Pages 프로젝트에는 빌드 명령과 출력 디렉터리를 지정해야 함을 확인한다.
5. 현재 실패는 앱 코드 문제가 아니라 Pages가 빌드 명령 없이 `dist`만 찾도록 설정된 상태라는 결론으로 정리한다.
6. 로컬 wrangler 설정의 OAuth 토큰을 현재 프로세스 환경변수에 주입해 Pages API와 direct upload를 다시 사용할 수 있게 한다.
7. `wrangler pages deploy dist --project-name imomguide --commit-dirty=true`로 production을 즉시 복구한다.
8. Cloudflare Pages 프로젝트 API에서 `build_config`를 `npm run build`, `dist`, `/` 기준으로 저장한다.
9. `loopincode.com`과 최신 direct upload URL이 같은 자산 해시를 응답하는지 확인한다.

### 검증 메모

- `Get-Content -Raw wrangler.toml`
- `Get-Content -Raw package.json`
- `Get-Content -Raw .gitignore`
- `npm run build`
- `npx wrangler whoami`
- `npx wrangler pages deploy dist --project-name imomguide --commit-dirty=true`
- `Invoke-RestMethod https://api.cloudflare.com/client/v4/accounts/.../pages/projects/imomguide`
- `Invoke-WebRequest https://0b19544e.imomguide.pages.dev`
- `Invoke-WebRequest https://loopincode.com`
- Cloudflare Pages 공식 문서
  - Git integration
  - Build configuration
  - Wrangler configuration

## 2026-03-20 안티그래비티 walkthrough 공식 반영

### 목표

- 루트 `walkthrough.md`에 적힌 UI/UX 개선 항목이 현재 소스에 실제로 반영되어 있는지 빠르게 확인한다.
- 프로젝트 규칙상 정식 산출물 위치인 `docs/codex-brain/walkthrough.md`에 같은 내용을 공식 형식으로 재정리해 남긴다.

### 검토 범위

1. 루트 `walkthrough.md`에 명시된 대상 파일 `src/index.css`, `src/components/ui/button.tsx`, `src/App.tsx`, `index.html`, `src/components/ui/skeleton.tsx`를 직접 확인한다.
2. 접근성(`skip nav`, `aria-*`), 터치 타겟(`44px`), 애니메이션, reduced motion, lazy import, `Suspense`, 폰트 프리로드/프리커넥트 여부를 소스 기준으로 검증한다.
3. `npm run build`를 다시 실행해 실제 빌드 성공과 분리 청크 생성 여부를 확인한다.
4. 루트 `walkthrough.md`의 핵심 내용을 `작업 배경 / 반영 내용 / 구현 파일 / 검증 결과 / 결과 요약` 형식으로 재구성한다.
5. 점검 메모 성격의 임시 기록을 공식 반영 상태에 맞게 갱신한다.

### 검증 메모

- `Get-Content -Raw walkthrough.md`
- `Get-Content -Raw src/index.css`
- `Get-Content -Raw src/components/ui/button.tsx`
- `Get-Content -Raw src/App.tsx`
- `Get-Content -Raw index.html`
- `Get-Content -Raw src/components/ui/skeleton.tsx`
- `git status --short`
- `git diff --no-index -- walkthrough.md docs/codex-brain/walkthrough.md`
- `npm run build`

## 2026-03-20 홈 섹션 대비 강화 및 쉬운 검색 슬라이드 위저드 설계

### 목표

- 홈 화면에서 배경과 핵심 섹션의 경계가 더 선명하게 읽히도록 시각적 대비를 높인다.
- `쉬운 검색 홈`을 한 화면 안에서 자연스럽게 넘겨보는 슬라이드형 위저드로 바꿔, 클릭과 터치 모두로 다음 단계/이전 단계 이동이 가능하게 만든다.
- 기존 `discover -> adjust -> result` 상태 구조는 유지하되, 사용자가 현재 어디에 있는지와 다음 행동이 무엇인지 더 직관적으로 느끼게 한다.

### 구현 방향

1. `HomeSections`의 주요 섹션을 같은 톤의 카드 나열이 아니라 `히어로 / 위저드 / 참고 섹션`이 분리된 밴드형 레이아웃으로 재정리한다.
2. 홈 배경에는 은은한 그라디언트와 섹션별 surface 차이를 더하고, 핵심 섹션은 테두리/그림자/배경색 강도를 한 단계 높여 `무엇을 먼저 봐야 하는지`가 드러나게 한다.
3. `쉬운 검색 홈`은 현재의 조건부 렌더링 구조를 감싸는 `슬라이드 트랙`을 만들고, 단계별 패널을 좌우 이동시키는 방식으로 바꾼다.
4. 단계 하단에는 `이전`, `다음`, `결과 보기`, `처음으로` 같은 네비게이션 버튼을 문맥에 맞게 노출한다.
5. 포인터 이벤트를 사용해 모바일/터치 환경에서 좌우 스와이프 시 단계가 전환되게 하고, 과도한 스와이프 오동작을 막기 위해 임계값을 둔다.
6. 키보드/스크린리더 기준으로도 현재 단계가 유지되도록 `aria-live`, 현재 단계 텍스트, 버튼 라벨을 함께 점검한다.
7. 검증은 `App.test.tsx`에 단계 이동과 홈 진입 UX를 보강하고, `lint/test/build`로 마무리한다.

### 예상 영향 범위

- `src/App.tsx`
- `src/App.test.tsx`
- 필요 시 `src/features/eligibility/components/industry-discovery-panel.tsx`
- 필요 시 `src/features/eligibility/components/eligibility-form.tsx`
- `docs/codex-brain/task.md`
- `docs/codex-brain/walkthrough.md`

### 검증 계획

- `npm run lint`
- `npm run test`
- `npm run build`

## 2026-03-20 제안서/PDF 렌더러 경로 최종 확인 및 현 범위 종결

### 목표

- `result-panel-source-metadata-reuse` 다음 단계로 예정했던 `제안서/PDF 렌더러 연결`의 실현 가능성을 현재 워크스페이스 기준으로 최종 판정한다.
- 연결 대상이 실제로 없을 경우, 억지 구현 대신 `현 범위 종결`로 정리해 추후 다른 브랜치/워크스페이스에서 이어붙일 수 있는 기준점을 남긴다.

### 구현 방향

1. 소스 트리(`src`, `scripts`, `electron`, `public`, `docs`)에서 제안서/PDF 관련 문자열과 렌더러 경로를 재검색한다.
2. `electron/main.mjs`가 실제로 어떤 엔트리를 여는지 확인해, 별도 제안서 전용 창이나 렌더러가 존재하는지 검증한다.
3. `release/win-unpacked/resources/app.asar` 패키지 내부를 확인해, 배포 산출물 기준으로도 별도 제안서/PDF 렌더러가 포함되어 있는지 확인한다.
4. 별도 렌더러가 없으면 이번 워크스페이스에서는 출처 메타 헬퍼 연결 작업을 더 진행하지 않고, 결과 패널까지 구현 완료된 상태를 현 범위 종결로 기록한다.

### 예상 영향 범위

- `electron/main.mjs`
- `release/win-unpacked/resources/app.asar`
- `docs/codex-brain/task.md`
- `docs/codex-brain/walkthrough.md`

### 검증 계획

- `Get-Content electron/main.mjs`
- `Get-ChildItem src,scripts,electron,public,docs -Recurse -File | Select-String ...`
- `npx asar list release/win-unpacked/resources/app.asar`

## 2026-03-20 결과 패널 출처 메타 재사용 1차 구현

### 목표

- `LegalFootnotes`가 법령 라이브러리에서 정의한 공식 원문 메타를 다시 사용하도록 연결한다.
- 결과 패널에서도 `원문 보기`, `출처 기관`, `문서번호`, `공개일`을 한 번에 확인할 수 있게 만들어 상담/공유 흐름을 강화한다.
- PDF/제안서 전용 경로가 아직 없는 현재 코드베이스 상황을 반영해, 재사용 가능한 출처 메타 계층을 먼저 완성한다.

### 구현 방향

1. `legal-library.ts`에 `sourceKind -> 문서 메타`를 되찾는 헬퍼를 추가한다.
2. `legal-footnotes.tsx`에서 legal basis의 `source` 값을 기준으로 원문 출처 묶음과 메타 배지를 노출한다.
3. `result-panel.test.tsx`에 결과 화면의 원문 출처 노출을 검증하는 테스트를 추가한다.
4. 이번 턴에서는 PDF/제안서 전용 출력 경로가 코드에 없는 점을 walkthrough에 명시하고, 다음 단계에서 연결 가능한 상태만 만든다.

### 예상 영향 범위

- `src/features/library/data/legal-library.ts`
- `src/features/eligibility/components/legal-footnotes.tsx`
- `src/features/eligibility/components/result-panel.test.tsx`
- `docs/codex-brain/task.md`
- `docs/codex-brain/walkthrough.md`

### 검증 계획

- `npm run lint`
- `npm run test`
- `npm run build`

## 2026-03-20 법령 원문 출처 링크 및 문서 메타 강화

### 목표

- 법령 라이브러리와 업데이트 로그에 `원문 보기`, `출처 기관`, `고시번호/법령번호`, `공개일` 메타를 명시해 신뢰 신호를 강화한다.
- 내부 앱 화면과 공개 SEO 페이지가 같은 출처 데이터를 재사용하도록 데이터 구조를 통합한다.
- 공개 페이지 구조화 데이터에도 발행일·출처 URL을 반영해 Search Console과 검색엔진이 문서 맥락을 더 잘 읽게 만든다.

### 구현 방향

1. `legal-library.ts`에 공식 원문 URL, 출처 기관, 고시번호, 공개일 메타를 추가한다.
2. `update-log.ts`에는 각 업데이트가 근거로 삼는 원문/정책 문서 링크 목록을 추가한다.
3. `LegalLibraryPage`, `UpdateLogPage`에서 원문 보기 버튼과 출처 메타 카드가 보이도록 확장한다.
4. `seo-page-builder`의 `library/updates` 공개 페이지에도 같은 메타와 링크를 반영하고, 구조화 데이터에 날짜와 출처 URL을 넣는다.

### 예상 영향 범위

- `src/features/library/data/legal-library.ts`
- `src/features/library/components/legal-library-page.tsx`
- `src/features/updates/data/update-log.ts`
- `src/features/updates/components/update-log-page.tsx`
- `src/features/guides/seo/seo-page-builder.ts`
- `src/features/guides/seo/seo-page-builder.test.ts`
- `scripts/export-magok-seo-pages.mts`
- `public/library/**/*`
- `public/updates/**/*`

### 검증 계획

- `npm run lint`
- `npm run test`
- `npm run export:seo-pages`
- `npm run build`

## 2026-03-20 Search Console 제출 최적화 1차 구현

### 목표

- Search Console 제출 관점에서 `sitemap.xml`을 단일 URL 목록이 아닌 `sitemap index`로 전환해 색인 자산을 섹션별로 관리한다.
- `guides`, `faq`, `library`, `updates`, `core`를 분리된 sitemap으로 내보내 대량 정적 페이지의 재생성 비용과 점검 범위를 낮춘다.
- 공개 SEO 페이지 전반에 `robots` 메타를 명시해 검색엔진 크롤링 의도를 일관되게 전달한다.

### 구현 방향

1. `seo-page-builder`에 `robots` 메타와 `sitemap index` 생성 함수를 추가한다.
2. `export-magok-seo-pages.mts`가 `public/sitemaps/*.xml`을 만들고, 루트 `public/sitemap.xml`은 각 sitemap을 가리키는 인덱스로 출력하게 한다.
3. `guide/faq`뿐 아니라 `library/updates` 공개 페이지도 같은 SEO 출력 흐름에서 함께 관리한다.
4. 검증은 `lint`, `test`, `export:seo-pages`, `build`를 순차 실행해 Windows 환경의 재생성 충돌 없이 통과하는지 확인한다.

### 예상 영향 범위

- `src/features/guides/data/guide-catalog.ts`
- `src/features/guides/seo/seo-page-builder.ts`
- `src/features/guides/seo/seo-page-builder.test.ts`
- `src/features/library/data/legal-library.ts`
- `scripts/export-magok-seo-pages.mts`
- `package.json`
- `public/sitemap.xml`
- `public/sitemaps/*.xml`
- `public/library/**/*`
- `public/updates/**/*`

### 검증 계획

- `npm run lint`
- `npm run test`
- `npm run export:seo-pages`
- `npm run build`

## 2026-03-20 공개 SEO 법령 라이브러리 및 업데이트 로그 1차 구현

### 목표

- 기존 공개 SEO 파이프라인을 `guide/faq`에서 `library/updates`까지 확장해, 법령과 변경 이력도 검색엔진이 직접 읽을 수 있게 만든다.
- `public/library`, `public/updates` 정적 HTML과 sitemap 항목을 자동 생성해, 공개 지식 자산과 신뢰 자산이 같은 배포 흐름에서 관리되게 한다.
- 앱 내부 `LegalLibraryPage`, `UpdateLogPage`에서도 공개 페이지로 바로 이동할 수 있게 연결한다.

### 구현 방향

1. `seo-page-builder`에 `library index/detail`, `updates index/detail` HTML 빌더를 추가한다.
2. `export-magok-seo-pages.mts`가 `guides/faq`뿐 아니라 `library/updates`도 재생성하고 sitemap에 포함하도록 확장한다.
3. `LegalLibraryPage`, `UpdateLogPage`에 `공개 페이지 열기` 버튼을 추가한다.
4. 테스트에서는 canonical, breadcrumb, 페이지 타이틀, sitemap 생성 여부를 고정한다.

### 예상 영향 범위

- `src/features/library/data/legal-library.ts`
- `src/features/guides/seo/seo-page-builder.ts`
- `src/features/guides/seo/seo-page-builder.test.ts`
- `scripts/export-magok-seo-pages.mts`
- `src/features/library/components/legal-library-page.tsx`
- `src/features/updates/components/update-log-page.tsx`
- `public/library/**/*`
- `public/updates/**/*`
- `public/sitemap.xml`

### 검증 계획

- `npm run lint`
- `npm run test`
- `npm run export:seo-pages`
- `npm run build`

## 2026-03-20 공개 SEO 가이드·FAQ 페이지 레이어 1차 구현

### 목표

- 해시 라우트 기반 가이드를 검색엔진이 직접 읽을 수 있는 `정적 공개 HTML`로 확장한다.
- 가이드/FAQ 데이터에서 공개 페이지와 sitemap을 함께 생성해, 배포 시점마다 검색 자산이 자동으로 갱신되게 만든다.
- `title`, `description`, `canonical`, `Open Graph`, `Twitter`, `FAQPage`, `BreadcrumbList`까지 포함한 최소 SEO 메타 구조를 각 페이지에 넣는다.

### 구현 방향

1. `seo-page-builder`에서 가이드 페이지, FAQ 페이지, 색인 페이지, sitemap XML을 생성한다.
2. `export-magok-seo-pages.mts`가 `public/guides`, `public/faq`, `public/sitemap.xml`을 재생성하도록 만든다.
3. `package.json`의 `prebuild`에서 이 생성기를 자동 실행해, 일반 `build`만으로도 공개 SEO 페이지가 포함되게 한다.
4. 앱 내부 가이드 화면에는 `공개 페이지 열기` 진입선을 넣어, 문서형 가이드와 검색용 공개 페이지가 분리되어도 연결이 유지되게 한다.

### 예상 영향 범위

- `src/features/guides/seo/seo-page-builder.ts`
- `src/features/guides/seo/seo-page-builder.test.ts`
- `scripts/export-magok-seo-pages.mts`
- `src/features/guides/data/guide-catalog.ts`
- `src/features/guides/components/guide-page.tsx`
- `package.json`
- `public/guides/**/*`
- `public/faq/**/*`
- `public/sitemap.xml`

### 검증 계획

- `seo-page-builder` 테스트로 canonical/JSON-LD/BreadcrumbList 포함 여부 확인
- `npm run export:seo-pages` 실행 시 공개 HTML과 sitemap 생성 확인
- `npm run build`에서 `prebuild`를 포함한 전체 흐름 통과 확인

## 2026-03-20 업종별 가이드 및 FAQ 파이프라인 1차 구현

### 목표

- `코드 사전 데이터`를 사람이 읽을 수 있는 `문서형 가이드`로 재구성해, 결과 화면을 넘어서는 콘텐츠 자산을 만든다.
- 앱 내부에서는 `#guides/<code>` 해시 라우트로 가이드를 바로 읽을 수 있게 하고, 같은 데이터로 JSON/Markdown 산출물도 함께 뽑는다.
- FAQ는 별도 수기 작성이 아니라 가이드 데이터에서 파생 생성해, 이후 정적 페이지와 구조화 데이터 확장에 재사용할 수 있게 한다.

### 구현 방향

1. `src/features/guides/data/guide-catalog.ts`에서 `MAGOK_CODE_DIRECTORY`를 가이드 엔트리와 FAQ 엔트리로 변환한다.
2. `GuidePage`를 추가하고 `App.tsx`에서 `#guides/<code>` 해시 라우팅을 지원한다.
3. 홈에 `대표 업종 가이드` 섹션을 추가하고, 결과 패널에도 `이 코드 가이드 보기` 진입선을 붙인다.
4. `scripts/export-magok-guides.mts`를 통해 가이드/FAQ 인덱스 JSON과 미리보기 Markdown을 `docs/codex-brain/`에 생성한다.

### 예상 영향 범위

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

### 검증 계획

- 홈 대표 가이드 카드에서 가이드 화면으로 이동하는지 확인
- 결과 패널에서 `이 코드 가이드 보기` 버튼이 가이드로 이어지는지 확인
- `npm run lint`, `npm run test`, `npm run build`, `npm run export:guides` 검증

## 2026-03-20 법령 라이브러리 및 업데이트 로그 1차 구현

### 목표

- `결과 패널 각주`에 흩어져 있는 신뢰 정보를 독립 화면으로 분리해, 사용자가 문서 단위 근거와 최근 변경 이력을 따로 읽을 수 있게 한다.
- 홈에서도 `법령 라이브러리`, `업데이트 로그`로 바로 이동할 수 있게 연결해, 서비스가 단순 판독기가 아니라 관리 근거와 업데이트 이력을 갖춘 정보 제품처럼 읽히게 만든다.
- 기존 hash 기반 단일 앱 구조를 유지하면서 `#library`, `#updates` 뷰를 추가해 구현 부담을 낮춘다.

### 구현 방향

1. `src/features/library/data/legal-library.ts`와 `legal-bases.ts` 메타데이터를 사용해 `LegalLibraryPage`를 정식 뷰로 연결한다.
2. `src/features/updates/data/update-log.ts`에 최근 반영 이력을 정리하고, `UpdateLogPage`에서 날짜·반영 범위·근거 라벨을 함께 보여준다.
3. `src/App.tsx`의 `AppView`를 `home | directory | library | updates`로 확장하고, 헤더 내비게이션과 홈 신뢰 섹션에서 새 화면 진입선을 제공한다.
4. 홈에서는 최근 업데이트 3건을 미리 보여주고, 법령 문서를 별도 카드로 안내해 결과 화면 밖에서도 신뢰 자산이 보이게 한다.

### 예상 영향 범위

- `src/App.tsx`
- `src/App.test.tsx`
- `src/features/library/components/legal-library-page.tsx`
- `src/features/library/data/legal-library.ts`
- `src/features/updates/components/update-log-page.tsx`
- `src/features/updates/data/update-log.ts`
- `docs/codex-brain/task.md`
- `docs/codex-brain/walkthrough.md`

### 검증 계획

- 헤더에서 `법령 라이브러리`, `업데이트 로그` 버튼으로 정상 이동하는지 확인
- 각 페이지에서 홈 또는 상대 페이지로 되돌아갈 수 있는지 확인
- `npm run lint`, `npm run test`, `npm run build` 회귀 검증

## 2026-03-20 High-Quality SaaS 아키텍처 재설계

### 핵심 목표

- 서비스를 `단순 판독기`가 아니라 `마곡 입주 의사결정 미디어 + SaaS`로 재정의한다.
- 광고 또는 제휴 요소보다 `판정 근거`, `실무 해설`, `가이드 콘텐츠`, `업데이트 신뢰성`이 먼저 보이도록 구조를 바꾼다.
- Google 검색 품질 가이드와 게시자 정책 기준에서 `정보성`, `독창성`, `탐색 편의성`, `신뢰성`이 드러나는 사이트 아키텍처를 만든다.

### 현재 구조의 한계

- 현재 홈은 `쉬운 검색`, `코드 사전`, `법령 참고`, `제휴 링크`를 한 화면에 모아두고 있어 기능은 많지만 `왜 이 사이트가 권위 있는가`를 충분히 설명하지 못한다.
- 현재 결과 패널은 `가능/조건부/심의 필요/불가`와 근거를 잘 보여주지만, 구글이 고품질 정보 페이지로 인식할 만한 `독자적 해설`과 `실무 조언`이 약하다.
- 현재 법령 참고는 탭형 요약에 머물러 있어, 개별 문서가 검색 유입과 신뢰 신호를 만드는 `인덱서블 페이지`로 확장되지 못한다.
- 현재 제휴 요소는 최근에 축소했지만, 여전히 `정보 흐름 안에 어떤 맥락으로 녹아드는가`까지 제품 차원에서 설계되지는 않았다.

### 제품 철학

1. 정보가 먼저다.
2. 판정만으로 끝내지 않고, 사용자가 다음 행동을 결정할 수 있는 해설까지 제공한다.
3. 광고는 클릭 유도 장치가 아니라, 본문 맥락 안의 보조 리소스여야 한다.
4. 모든 중요한 주장과 판정은 출처, 업데이트 일자, 적용 범위가 따라와야 한다.
5. 검색 유입 페이지는 키워드용 문서가 아니라, 실제 질문에 답하는 가이드여야 한다.

### 목표 정보 구조

- 홈 `/`
  - 쉬운 업종 검색
  - 서비스 신뢰 신호
    - 최근 업데이트 로그 요약
    - 법령 반영 기준일
    - 데이터 커버리지
  - 대표 가이드 링크
    - 업종별 입주 가이드
    - 법령 라이브러리
    - 자주 묻는 심의 포인트
- 결과 화면
  - 판정 결과
  - 법적 근거
  - 추가 확인 사항
  - `[전문가 인사이트]`
  - `[다음 단계 체크리스트]`
  - `[연관 가이드]`
  - `[연관 서비스/준비 자료]` 카드
- 코드 사전 `/directory`
  - 전체 코드 탐색
  - verdict 필터
  - 검색어 기반 진입
  - 관련 가이드 문서 연결
- 업종별 가이드 `/guides/:code`
  - 예: `71531 경영컨설팅업 마곡 입주 가이드`
  - 코드 설명
  - 마곡 기준 판정
  - 자주 걸리는 조건
  - 준비 서류/심의 포인트
  - 관련 법령 요약
  - 관련 코드 비교
- 법령 라이브러리 `/library`
  - 문서별 핵심 요약
  - 조문별 해설
  - 반영 일자
  - 원문 PDF 링크
- 업데이트 로그 `/updates`
  - 데이터 갱신 내역
  - 반영 법령 버전
  - 코드 분류 변경 이력

### 코드에 박히는 구조

#### 1. 결과 패널의 `전문가 인사이트`

- 현재 `ResultPanel`은 verdict와 근거 중심이다.
- 여기에 아래 블록을 추가한다.
  - `ExpertInsightCard`
    - verdict + zoneType + KSIC 코드 조합별 실무 조언
    - 예: 심의 가능성이 높은 이유
    - 예: 사업계획서/인력구성/제출자료 팁
    - 예: 자주 오해하는 예외 규정
  - `NextActionChecklistCard`
    - 지금 바로 할 일
    - 확인할 문서
    - 심의 필요 시 준비 항목
- 데이터는 하드코딩 문구가 아니라 `insight dataset`으로 분리한다.

예상 파일:

- `src/features/eligibility/components/result-panel.tsx`
- `src/features/eligibility/components/expert-insight-card.tsx`
- `src/features/eligibility/data/expert-insights.ts`

#### 1-1. `융복합 심의 경로` 자동화

- 이미 `legal-bases.ts`에는 `magokConvergenceReview`, `rules.ts`에는 `convergence-review` 시나리오가 있어 확장 기반이 있다.
- 이를 단순 경고가 아니라 `실행 가능한 심의 경로 안내`로 확장한다.
- 원칙:
  - 원칙적 불가 또는 경계 업종이어도 `IT / BT / NT / GT / 에너지 / 자원순환`과의 결합 가능성이 있으면 별도 안내를 노출한다.
  - 사용자의 메모, 업종명, 선택한 유사 코드, 신청 주체를 바탕으로 `융복합 가능성 힌트`를 제공한다.
  - 최종 verdict를 무리하게 뒤집지 않고 `심의 경로 존재`를 별도 층위로 설명한다.
- 결과 문구 예시:
  - `원칙상 직접 허용 코드는 아니지만, 마곡 관리기본계획상 산업 융·복합 필요성이 인정되면 정책심의위원회 검토 경로가 있습니다.`
  - `사업계획서에는 기술 결합성, 연구개발 인력 비중, 기존 특화 산업과의 연결성을 함께 제시해야 합니다.`

예상 파일:

- `src/features/eligibility/data/convergence-review-playbook.ts`
- `src/features/eligibility/components/convergence-review-card.tsx`

#### 2. 광고가 아닌 정보로 읽히는 `Native Recommendation`

- 홈 전체 하단에 묶어두는 광고 보드 대신, 결과 문맥 안에서만 연관 리소스를 보여준다.
- 원칙:
  - 결과가 없으면 노출하지 않는다.
  - 로딩/에러/빈 상태에서는 노출하지 않는다.
  - 판정과 연결되는 맥락 문구가 있어야 한다.
  - `추천 상품 보기` 같은 문구 대신 `연관 서비스 확인하기`, `사무실 준비 참고 자료`처럼 중립적 문구를 쓴다.
- 예시:
  - `입주 확정 후 많이 찾는 네트워크/프린터 준비 체크`
  - `IT 장비 렌탈 가이드`
  - `사무실 탕비 준비 체크리스트`

예상 파일:

- `src/features/eligibility/components/contextual-resource-card.tsx`
- `src/features/eligibility/data/contextual-resources.ts`

#### 3. 검색 유입용 `업종코드별 마곡 입주 가이드`

- 단순 directory 검색 결과만으로는 `개별 검색 의도`를 받기 어렵다.
- `코드별 정적 페이지`를 생성해 long-tail 유입을 받는다.
- 대상 수:
  - 최소 `검토 가치가 있는 코드` 우선 생성
  - 최종적으로는 `KSIC 11차 5자리 전체 1204개`까지 확장 가능
- 각 페이지의 기본 구조:
  - H1: `71531 경영컨설팅업 마곡 입주 가이드`
  - 한 줄 요약 verdict
  - 왜 이런 결과인지
  - 심의/조건 체크 포인트
  - 비슷한 코드와 차이
  - 관련 법령 요약
  - 마지막 업데이트 일자
- 이 페이지들은 keyword landing page가 아니라 `가이드 문서`여야 한다.

예상 파일/파이프라인:

- `src/features/guides/`
- `scripts/export-magok-guides.mts`
- 라우팅 페이지 또는 정적 렌더링 진입점

#### 3-1. `SEO FAQ / 질문형 랜딩` 대량 생성

- 가이드 페이지 외에 질문형 검색 의도를 받는 FAQ 자산을 만든다.
- 예시:
  - `7131 광고대행업 마곡 입주 가능한가요?`
  - `62 컴퓨터 프로그래밍 업종 세제 혜택 있나요?`
  - `63112 호스팅업은 왜 심의가 필요한가요?`
- 답변은 얇은 Q&A가 아니라 다음을 모두 포함하는 짧은 가이드여야 한다.
  - verdict 요약
  - 왜 그런지
  - 심의/예외 포인트
  - 연관 법령
  - 관련 코드 링크
  - 상담 전 체크리스트
- 구조화 데이터(`FAQPage`, `BreadcrumbList`)를 함께 고려한다.

예상 파일:

- `src/features/guides/faq/`
- `scripts/export-magok-faq-pages.mts`

#### 4. E-E-A-T 강화용 `법령 라이브러리`와 `업데이트 로그`

- 현재 `RulebookTabs`는 좋은 요약이지만 indexable asset이 아니다.
- 아래 두 축으로 확장한다.
  - `LegalLibraryPage`
    - 문서별 요약
    - 핵심 조문
    - 적용 범위
    - 원문 출처
  - `UpdateLogPage`
    - 언제 무엇이 바뀌었는지
    - 왜 판정이 달라졌는지
    - 어떤 데이터셋이 갱신됐는지
- 푸터와 홈 상단 신뢰 영역에서 최신 업데이트 1~3개를 노출한다.

예상 파일:

- `src/features/library/`
- `src/features/updates/`
- `src/data/legal-library.ts`
- `src/data/update-log.ts`

#### 4-1. `법적 근거 각주` 자동 생성

- 현재 `LegalBasis`는 `id`, `source`, `citation`, `summary`까지만 가진다.
- 이를 아래 필드까지 확장한다.
  - `articlePath`
  - `pageHint`
  - `quote`
  - `sourceDocumentTitle`
- 결과 패널 하단에는 사람이 바로 복사해 실무 자료로 붙일 수 있는 `법적 근거 각주` 블록을 생성한다.
- 출력 형식:
  - `근거 1. 마곡일반산업단지 관리기본계획 고시(제2025-593호) 7쪽 융·복합 업종 심의`
  - `근거 2. 산업집적법 시행령 제6조 제7항`
- 향후 PDF 원문 뷰어 또는 문서 라이브러리 상세 페이지로 연결 가능한 링크 구조를 준비한다.

예상 파일:

- `src/features/eligibility/components/legal-footnotes.tsx`
- `src/features/eligibility/data/legal-bases.ts`

#### 5. 데이터 시각화

- 결과를 텍스트만으로 두지 않고 시각적으로도 이해시키는 계층을 추가한다.
- 우선순위:
  - `판정 흐름도`
  - `가능/조건부/심의 필요` 판단 트리
  - 구역별 검토 가능 코드 수 요약
  - 법령 반영 타임라인
- 목적은 장식이 아니라, 복잡한 규칙을 쉽게 읽히게 만드는 것이다.

예상 파일:

- `src/features/eligibility/components/verdict-flow-diagram.tsx`
- `src/features/eligibility/components/zone-summary-chart.tsx`

#### 5-1. `Interactive Eligibility Map`

- 마곡의 특화 산업군(BiT, GeT, BmT, IT 등)을 지도형 또는 클러스터형 시각 요소로 표현한다.
- 목적:
  - 사용자가 `내 업종이 어느 산업 클러스터와 가까운지`를 직관적으로 이해
  - 융복합 심의 가능성을 시각적으로 연결
  - 검색 유입 페이지에서도 시각 콘텐츠 자산으로 활용
- 초기 버전은 실제 지도가 아니라 `클러스터 인터랙션 맵`으로 시작해도 된다.

예상 파일:

- `src/features/eligibility/components/interactive-eligibility-map.tsx`
- `src/features/eligibility/data/cluster-zones.ts`

#### 5-2. `마곡 입주 레이아웃 시뮬레이션`

- 고시문상의 연구시설 비율, 제조시설 비율 조건을 숫자로 계산하는 실전형 도구를 추가한다.
- 입력:
  - 총 면적
  - 기업 구분(대기업/중소기업)
  - 제조시설 계획 여부
  - 예상 연구개발 인력
- 출력:
  - 최소 연구시설 필요 면적
  - 제조시설 허용 가능 최대 면적
  - 사후 신고 시 점검 포인트
  - 위험 경고
- 핵심 메시지:
  - `1,000평 기준 연구시설 최소 400평`
  - `제조시설은 연구시설 유지 조건 아래 20% 이내`

예상 파일:

- `src/features/eligibility/components/layout-simulator.tsx`
- `src/features/eligibility/data/layout-rules.ts`
- `src/features/eligibility/utils/layout-calculator.ts`

#### 5-3. `Pre-Check Audit Report` PDF

- 결과 화면을 단순 뷰가 아니라 `영업용 사전진단 보고서`로 내려받을 수 있게 한다.
- 포함 내용:
  - 기본 판정 요약
  - 법적 근거 각주
  - 전문가 인사이트
  - 면적 시뮬레이션 결과
  - 사업개시 신고/공장설립 완료신고 심사기준 요약
  - 제출 전 체크리스트
- 목적:
  - 중개 실무자, 컨설턴트, 법인 담당자가 바로 공유 가능한 문서 자산 생성

예상 파일:

- `src/features/reports/`
- `src/features/reports/build-precheck-report.ts`
- PDF 렌더링 또는 print stylesheet 기반 출력 모듈

### 데이터 모델 확장

- `ExpertInsightEntry`
  - `code`
  - `zoneType`
  - `verdict`
  - `headline`
  - `analysis`
  - `actionItems`
  - `riskNotes`
- `GuidePageEntry`
  - `code`
  - `slug`
  - `title`
  - `summary`
  - `verdictByZone`
  - `faq`
  - `relatedCodes`
  - `updatedAt`
- `LegalLibraryEntry`
  - `documentId`
  - `title`
  - `effectiveDate`
  - `summary`
  - `keyArticles`
  - `sourceUrl`
- `UpdateLogEntry`
  - `date`
  - `title`
  - `description`
  - `affectedCodes`
  - `sourceDocumentIds`
- `ConvergenceReviewEntry`
  - `code`
  - `candidateCluster`
  - `reviewRationale`
  - `planHints`
  - `requiredNarratives`
- `LayoutSimulationInput`
  - `grossAreaPy`
  - `companyScale`
  - `hasManufacturingFacility`
  - `rndHeadcount`
- `LayoutSimulationResult`
  - `minimumResearchAreaPy`
  - `maximumManufacturingAreaPy`
  - `warnings`
  - `postCheckItems`

### 광고/정책 원칙

- 사이드 고정 배너는 사용하지 않는다.
- empty / loading / error / 결과 없음 상태에서는 광고성 리소스를 노출하지 않는다.
- 광고 또는 제휴 요소는 명확히 표시하되, 본문보다 더 강하게 디자인하지 않는다.
- 클릭 유도 문구, 오해를 부르는 버튼 카피, 결과와 무관한 상품 위젯은 피한다.
- 광고는 `결과 이후의 연관 리소스`로만 배치한다.

### 단계별 구현 순서

1. 결과 패널에 `전문가 인사이트`와 `다음 단계 체크리스트`를 추가한다.
2. `융복합 심의 경로`와 `법적 근거 각주`를 결과 패널에 연결한다.
3. `마곡 입주 레이아웃 시뮬레이션`을 결과 흐름에 추가한다.
4. 홈 제휴 섹션을 결과 문맥형 `Native Recommendation` 구조로 재배치한다.
5. `업종코드별 가이드`와 `SEO FAQ` 생성 파이프라인을 만든다.
6. `법령 라이브러리`와 `업데이트 로그` 페이지를 추가한다.
7. `Interactive Eligibility Map`과 `Pre-Check Audit Report`를 붙인다.
8. 구조화 데이터와 SEO 메타를 정리한다.

### 완료 기준

- 홈 첫 화면에서 광고보다 정보 구조가 먼저 보인다.
- 결과 페이지가 `기계 판정`이 아니라 `실무 해설 문서`처럼 읽힌다.
- 검색엔진이 인덱싱할 수 있는 가이드/법령/업데이트 페이지가 추가된다.
- 제휴 요소는 본문을 방해하지 않고, 맥락이 있을 때만 노출된다.
- 사용자는 `판정 결과 -> 왜 그런지 -> 다음에 무엇을 해야 하는지`를 한 흐름으로 이해할 수 있다.

## 2026-03-20 제휴 섹션 노출 강도 축소 및 본문 우선 재배치

### 목표

- 홈 첫 화면에서 제휴 요소가 본문보다 먼저 눈에 들어오는 인상을 줄인다.
- 제휴 링크는 유지하되 `필요할 때만 펼쳐 보는 참고 자료` 수준으로 노출 강도를 낮춘다.
- 분석 결과, 코드 사전, 법령 참고 같은 핵심 본문 흐름이 먼저 소비되도록 구조를 재정렬한다.

### 확인한 원인

- 홈 화면의 사이드 배너와 항상 펼쳐진 4개 제휴 카드가 첫 인상에서 본문 비중을 잠식할 수 있다.
- 기존 CTA 문구가 `추천 상품 보기` 중심이라 분석 도구보다 쇼핑 행동을 먼저 유도하는 톤으로 읽힐 수 있다.
- 제휴 섹션이 접힘 없이 항상 노출되어 `광고보다 본문이 먼저`라는 정책 취지와 거리가 있다.

### 구현 방향

1. 홈 진입 시 보이던 `CoupangSideBanner`는 제거한다.
2. 제휴 섹션은 기본 접힘형 패널로 바꾸고, 사용자가 직접 펼칠 때만 위젯을 노출한다.
3. 섹션 제목과 설명은 `입주 판단용 본문이 아니라 참고 링크`라는 점이 명확히 드러나도록 수정한다.
4. 제휴 CTA는 더 낮은 강도의 버튼 스타일과 중립적 문구로 바꾼다.
5. 펼친 뒤에도 제휴 카드의 배경, 그림자, 타이포 세기를 낮춰 본문보다 덜 강하게 보이게 한다.

### 영향 범위

- 주 수정 대상: `src/App.tsx`
- 회귀 확인 대상: `src/App.test.tsx`
- 문서 산출물: `docs/codex-brain/task.md`, `docs/codex-brain/walkthrough.md`

### 검증 계획

- 홈 초기 진입 시 제휴 위젯과 사이드 배너가 기본 노출되지 않는지 확인
- 제휴 패널을 펼쳤을 때 기존 외부 링크와 위젯이 정상적으로 보이는지 확인
- `npm run lint`, `npm run test`, `npm run build` 기준 회귀 여부 확인

## 2026-03-20 추천 상품 카드 라인 정렬 보정

### 목표

- 추천 상품 4개 카드의 상단 헤더선, 제목 시작선, 상품 위젯 영역, 하단 CTA 기준선을 최대한 동일하게 맞춘다.
- 제목 길이가 다른 경우에도 카드 전체 높이가 들쭉날쭉해 보이지 않도록 안정적인 레이아웃을 만든다.
- 기존 시각 톤은 유지하되, 필요한 경우 제목 글자 크기와 줄높이를 소폭 줄여 정돈감을 높인다.

### 확인한 원인

- `affiliate` 섹션의 카드 본문이 `space-y-4` 기반 세로 흐름이라 제목 높이가 커지면 아래 블록이 함께 밀린다.
- 카드 제목 길이가 달라 `핸드폰과 태블릿`, `디지털 업무 기기`, `복사용지와 소모품` 카드의 제목 높이가 서로 다르게 잡힌다.
- iframe 높이는 고정이지만 카드 내부 구획 높이가 균일하지 않아 위젯 시작선과 CTA 위치가 어긋나 보인다.

### 구현 방향

1. 카드 본문을 고정 구획형 `flex` 또는 `grid` 레이아웃으로 바꿔 헤더, 제목, 위젯 영역을 분리한다.
2. 제목 영역에 `min-height`, `line-clamp`, 반응형 글자 크기/줄높이 조정을 적용해 카드 간 높이 차를 줄인다.
3. iframe 래퍼와 카드 전체에 동일한 세로 분배 규칙을 적용해 상품 위젯과 하단 버튼 기준선을 맞춘다.
4. 카드 상단 배지와 `외부 상품` 라벨은 `nowrap`과 축소된 패딩을 적용해 헤더 첫 줄이 카드마다 동일하게 유지되도록 한다.
5. 모바일과 데스크톱에서 모두 줄바꿈이 과도하게 깨지지 않는지 함께 확인한다.

### 영향 범위

- 주 수정 대상: `src/App.tsx`
- 회귀 확인 대상: `src/App.test.tsx`
- 문서 산출물: `docs/codex-brain/task.md`, `docs/codex-brain/walkthrough.md`

### 승인 후 검증 계획

- 홈 화면에서 4개 추천 카드의 제목/위젯/버튼 기준선 정렬 확인
- 긴 제목 카드가 다른 카드보다 과도하게 세로 길이를 점유하지 않는지 확인
- `npm test`, `npm run build` 기준 회귀 여부 확인

## 2026-03-20 UI 정보 위계 재조정

### 목표

- `강조해야 할 정보`와 `보조 정보`의 시각적 세기를 명확히 나눈다.
- 홈, 추천 검색, 코드 사전에서 사용자가 먼저 봐야 할 행동과 결과가 즉시 눈에 들어오게 한다.

### 반영 원칙

1. 기본 카드와 보조 배지는 힘을 낮추고, 핵심 카드만 강한 대비와 그림자를 사용한다.
2. 설명 문장은 배경과 톤을 눌러서 읽고 싶을 때만 읽히게 만든다.
3. 입력창, 현재 단계, 결과 개수, verdict 같은 핵심 정보는 강조 색과 더 큰 타이포로 먼저 보이게 한다.
4. 코드 사전 결과 카드는 verdict와 코드가 먼저 보이고, 분류/법령 메모는 펼친 뒤 보이는 보조 정보로 둔다.

## 2026-03-20 KSIC 11차 전수 코드 사전 + 쉬운 추천형 검색 개편

### 목표

- 앱을 `마곡에서 입주 가능한 업종코드를 누구나 쉽게 찾는 사이트`로 재정의한다.
- 범위는 `산업시설구역 + 지식산업센터`의 KSIC 11차 5자리 전체 코드 전수 분류다.
- `지원시설구역`은 이번 버전에서 수동 검토 안내로 유지한다.

### 구현 방향

1. `ksic11.txt`를 파싱해 KSIC 11차 5자리 전체 마스터를 만든다.
2. 기존 `지식산업센터 exact CSV`, `마곡 허용표`, `시행령 대응표`를 전수 verdict 레이어로 합친다.
3. 홈 화면은 쉬운 검색 하나에 집중하고, 전체 코드는 별도 `코드 사전` 화면에서 탐색하게 한다.
4. 추천 엔진은 현재 구역 기준 `검토 가능한 코드`를 우선 정렬한다.
5. 기존 `판정 기준` 탭은 법적 기준 참고용으로만 남기고, exact 전체 탐색 UI는 코드 사전 페이지로 이동한다.

### 새 데이터 레이어

- `MagokCodeDirectoryEntry`
  - `code`
  - `name`
  - `sectionCode`, `sectionName`
  - `divisionCode`, `divisionName`
  - `groupCode`, `groupName`
  - `categoryCode`, `categoryName`
  - `browseCategory`
  - `zoneVerdicts.industrialFacility`
  - `zoneVerdicts.knowledgeIndustryCenter`
  - `searchKeywords`
- `zoneVerdict`
  - `verdict`
  - `reason`
  - `legalBasisIds`
  - `notes`

### UI 계획

- 홈
  - 큰 검색창
  - 쉬운 예시 문구
  - 추천 코드 카드
  - 전체 코드 사전으로 가는 CTA
- 코드 사전
  - 큰 검색창
  - 구역 필터
  - 결과 필터
  - 대분류/업무군 필터
  - 코드순 목록
  - 상세 펼치기
- 판정 기준
  - 산업시설구역 규칙
  - 지식산업센터 조문 대응표
  - 심의/제한 규칙
  - 코드 사전 바로가기

### 검증 메모

- 전수 코드 수, 중복 여부, zone verdict 누락 여부 확인
- 대표 코드 회귀
  - `63111`
  - `63112`
  - `75994`
  - `72121`
  - `72922`
  - `71310`
  - `74100`
  - `75320`
- 쉬운 검색 회귀
  - `광고대행업`
  - `앱 개발`
  - `호스팅`
  - `엔지니어링`
  - `콜센터`
  - `생명공학`

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

---

## 2026-03-21 결과 공유/저장 기능 계획

### 변경 목표

- 컨설턴트가 판정 결과를 바로 전달할 수 있도록 `공유 링크`, `요약 복사`, `인쇄/PDF 저장` 흐름을 결과 화면에 추가한다.
- 공유 링크로 진입했을 때 해시만으로 같은 입력과 결과를 복원해, 별도 설명 없이도 동일한 예비판정 화면이 바로 열리게 만든다.
- 이번 루프는 1번 기능만 완결하는 범위로 제한하고, 동시 비교·멀티 코드·히스토리·더 보기 같은 다음 기능은 건드리지 않는다.

### 구현 메모

1. `src/features/eligibility/share-result.ts`
   - `EligibilityInput` 직렬화/복원을 담당하는 유틸 파일을 새로 만든다.
   - Base64 URL-safe 문자열로 인코딩하고, 복원 시 enum/boolean/string 값을 안전하게 정규화한다.
   - 공유용 해시 `#finder?share=...` 생성 헬퍼와 결과 요약 텍스트 생성 헬퍼를 함께 둔다.
2. `src/store/eligibility-store.ts`
   - 공유 링크 진입 시 즉시 결과 화면을 만들 수 있도록 `loadSharedResult(input)` 메서드를 추가한다.
   - 이 메서드는 입력을 세팅하고 `evaluateEligibility`를 동기 실행해 `status: ready`, `currentStep: result` 상태를 만든다.
3. `src/App.tsx`
   - `getHashState`가 `#finder?share=...`를 읽어 `sharedInput`을 반환하도록 확장한다.
   - 해시 변경 시 공유 입력이 있으면 store의 `loadSharedResult`를 호출하고, 홈 화면 결과가 준비된 상태에서는 현재 입력으로 공유 해시를 다시 써준다.
   - `HomeSections`와 `ResultPanel`에 공유/복사/인쇄 콜백을 내려준다.
4. `src/features/eligibility/components/result-panel.tsx`
   - 결과 카드 상단에 `공유 링크 복사`, `판정 요약 복사`, `인쇄 / PDF 저장` 버튼을 추가한다.
   - 복사 성공 시 짧은 상태 문구가 바뀌도록 로컬 피드백을 넣고, 인쇄는 전용 팝업 문서로 열어 PDF 저장에도 바로 쓸 수 있게 한다.
5. 테스트
   - `src/features/eligibility/share-result.test.ts`에서 직렬화/복원 round-trip을 검증한다.
   - `src/features/eligibility/components/result-panel.test.tsx`에서 새 액션 버튼과 콜백 실행을 확인한다.
   - `src/App.test.tsx`에서 공유 해시 진입 복원과 링크 복사 동작을 확인한다.

### 검증 메모

- `npm run lint`
- `npm run test -- --run`
- `npm run build`

---

## 2026-03-21 두 구역 동시 비교 판정 계획

### 변경 목표

- 2단계 보정 화면에서 `지식산업센터 ↔ 산업시설구역 동시 비교`를 켜면, 같은 업종코드 기준으로 두 구역 결과를 한 화면에서 나란히 보여준다.
- 비교 모드는 단순 UI 토글이 아니라 결과 전달 기능까지 이어져야 하므로, 공유 해시/요약 복사/인쇄 문서도 비교 결과를 함께 담도록 확장한다.
- 이번 루프는 2번 기능만 완결하고, 멀티 코드·히스토리·더 보기 같은 다음 기능은 건드리지 않는다.

### 구현 메모

1. 타입/평가 계층
   - `src/features/eligibility/types.ts`에 비교 가능한 구역 타입과 비교 결과 맵 타입을 추가한다.
   - `src/features/eligibility/evaluator.ts`에 `evaluateEligibilityComparison(input)` 헬퍼를 추가해 `지식산업센터`, `산업시설구역` 결과를 한 번에 계산한다.
2. 공유/복원 계층
   - `src/features/eligibility/share-result.ts`의 payload를 `compareZones`까지 담는 v2 포맷으로 확장한다.
   - 기존 v1 공유 링크도 계속 열리도록 복원 함수는 하위 호환을 유지한다.
   - 요약 텍스트와 인쇄 문서는 비교 모드일 때 두 구역 결과를 모두 담도록 확장한다.
3. store
   - `src/store/eligibility-store.ts`에 `compareZones`, `comparisonResults`, `setCompareZones`를 추가한다.
   - `evaluate()`와 `loadSharedResult()`는 비교 모드일 때 두 구역 결과를 함께 세팅한다.
4. UI
   - `src/features/eligibility/components/eligibility-form.tsx`에 `두 구역 동시 비교` 스위치를 추가한다.
   - 비교 모드에서는 단일 구역 선택 대신 비교 모드 안내를 보여주고, primary CTA도 비교 판정 맥락으로 바꾼다.
   - `src/features/eligibility/components/result-panel.tsx`는 비교 모드일 때 상단 요약 카드와 두 개의 구역 결과 카드를 나란히 렌더링한다.
5. App 연결
   - `src/App.tsx`는 compare state를 form/result/share 액션까지 연결한다.
6. 테스트
   - `share-result.test.ts`에 비교 모드 공유 round-trip을 추가한다.
   - `result-panel.test.tsx`에 비교 결과 렌더링 테스트를 추가한다.
   - `App.test.tsx`에 비교 모드 진입 후 두 구역 결과가 같이 보이는 흐름을 추가한다.

### 검증 메모

- `npm run lint`
- `npm run test -- --run`
- `npm run build`

---

## 2026-03-21 홈 전환 카피·시각 위계 개선 계획

### 변경 목표

- 현재의 전문성과 신뢰는 유지하면서, 첫 화면에서 `왜 지금 써봐야 하는지`가 더 빠르게 보이도록 홈 전환 카피와 시각 위계를 다듬는다.
- 1순위 타깃은 `대표님도 이해할 수 있는 쉬운 문장 + 컨설턴트·중개사가 신뢰할 수 있는 근거 톤`의 균형으로 잡는다.
- 해시 라우팅, 업종 추천 흐름, 판정 로직, 데이터 스키마는 그대로 두고 홈 카피와 섹션 역할만 재정렬한다.

### 구현 메모

1. `src/App.tsx`
   - 상단 히어로 헤드라인을 `마곡 입주, 업종코드부터 예비판정까지 한 번에`로 교체한다.
   - 서브 문장을 `업태·종목이나 하는 일을 적으면 ... 근거와 함께 보여드립니다.` 톤으로 재작성한다.
   - 메인 CTA를 `업종코드 추천받기`, `전체 코드 사전 보기`로 통일하고, CTA 바로 아래 혜택 카드 3개를 배치한다.
   - 데스크톱 우측 상단 카드는 `이 서비스로 할 수 있는 일`, `판정 근거를 바로 추적` 2개 카드로 재구성해 반복 단계 설명을 줄인다.
   - `introSteps`와 관련 안내 카피를 `한 줄 입력 → 코드 추천 → 근거 확인` 흐름으로 더 짧고 실무적인 문장으로 정리한다.
   - 법령 라이브러리 섹션은 차별점이 더 살아나도록 톤을 올리고, 업데이트 로그는 중립 톤 보조 카드처럼 배치한다.
2. `src/index.css`
   - 기존 토큰을 우선 유지하면서 홈 보조 영역에 쓸 중립 표면/경계 토큰만 최소 추가한다.
3. `src/App.test.tsx`
   - 새 히어로 헤드라인, CTA 2개, 혜택 카드 3개, 가이드 섹션 카피를 기준으로 홈 렌더링 테스트를 갱신한다.
   - `업종코드 추천받기`, `전체 코드 사전 보기` 버튼의 기존 뷰 전환 동작 회귀를 확인한다.
4. 문서
   - `task.md`에 진행 체크리스트를 남기고, 검증 완료 후 `walkthrough.md`에 반영 내용과 결과를 기록한다.

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

---

## 2026-03-20 지식산업센터 코드표 드롭다운 정리 계획

### 변경 목표

- `사용자 정리 코드표 반영` 카드에서 요약 숫자만 보이던 exact 코드표를 실제 검토용 드롭다운 UI로 확장한다.
- 사용자는 `호별로 보기`와 `입주검토 구분별 전체 보기`를 같은 카드 안에서 펼치고 접을 수 있어야 한다.
- 검색어를 넣으면 관련 드롭다운이 자동으로 열려 개별 코드까지 바로 확인할 수 있어야 한다.

### 구현 메모

1. `src/features/eligibility/data/knowledge-center-exact-codes.ts`
   - CSV 전체를 화면에서 바로 활용할 수 있도록 공개용 카탈로그 엔트리 배열을 추가한다.
   - 각 행에 판정구분, 입주검토 구분, 코드/범위, 메모, exact 여부를 함께 담아 UI 쪽 계산량을 줄인다.
2. `src/features/eligibility/data/knowledge-industry-review-table.ts`
   - `1~27호` 대응표에 `searchTerms`를 추가해 범위형 조문도 개별 5자리 코드 기준으로 다시 찾을 수 있게 만든다.
   - 이 검색 키는 표 검색과 호별 드롭다운 매핑에 공용으로 사용한다.
3. `src/features/eligibility/components/rulebook-tabs.tsx`
   - `사용자 정리 코드표 반영` 카드 안에 `호별 펼쳐보기`와 `전체 코드표 펼쳐보기` 두 블록을 추가한다.
   - `details/summary` 기반 접이식 UI로 구현해 별도 의존성 없이 펼치기/접기를 지원한다.
   - 검색어가 있으면 관련 조문/분류 아코디언을 자동으로 열고, 코드/업종명/메모를 한 번에 보여준다.
4. 테스트
   - `src/App.test.tsx`에 `72121` 같은 중간 코드를 검색했을 때 드롭다운 안에서 실제 코드가 보이는지 검증 케이스를 추가한다.

### 검증 메모

- `npm run lint`
- `npm run test -- --run`
- `npm run build`

---

## 2026-03-21 컨설턴트/중개사 우선 홈 재정렬 계획

### 변경 목표

- 홈 전체를 컨설턴트/중개사 우선 시점으로 다시 정리해 첫 화면에서 바로 `상담 준비와 설명에 쓰는 서비스`라는 인상이 들게 만든다.
- 기존 `쉬운 검색 홈`을 히어로 안으로 끌어올려, 혜택 카피와 빠른 검색을 한 화면에서 바로 이어서 쓰게 만든다.
- 뷰 전환, 해시 구조, 업종 추천/예비판정 로직은 그대로 두고 홈 카피와 배치만 재설계한다.

### 구현 메모

1. `src/App.tsx`
   - 상단 네비를 `검색 홈`, `전체 코드 사전`, `입주 예비판정 안내`, `법령 라이브러리`, `업데이트 로그` 순서로 정리한다.
   - 히어로 왼쪽에는 상담형 헤드라인, 서브 카피, CTA 2개와 각 버튼 아래 설명을 넣는다.
   - 히어로 오른쪽에는 `컨설턴트·중개사를 위한 빠른 검색 홈` 카드를 넣고 기존 `industryQuery`, `discoverIndustry`, `setCurrentStep` 흐름을 그대로 재사용한다.
   - `finder` 섹션은 워크스페이스 성격만 남기고, discover 초기 화면에서는 중복 소개 대신 `빠른 검색으로 올라가기 / 직접 입력으로 계속` 카드만 보여준다.
   - `실무에서는 보통 이렇게 봅니다` 카드에는 `id="practical-guide"`를 달아 상단 메뉴 점프 지점으로 사용한다.
   - `전체 코드 사전`, 법령 참고, 라이브러리, 업데이트 로그, 대표 업종 가이드, 제휴 링크, 푸터 문구를 컨설턴트/중개사 실무 톤으로 조정한다.
2. `src/features/eligibility/components/industry-discovery-panel.tsx`
   - compose 화면 제목, 설명, placeholder, 입력 아래 안내, 버튼 보조 텍스트를 상담 상황에 맞게 수정한다.
   - 오른쪽 흐름 안내 카드도 `고객 설명 → 후보 코드 비교 → 예비판정` 흐름 중심으로 바꾼다.
3. `src/App.test.tsx`
   - 새 히어로 카피, CTA 설명, 빠른 검색 카드, 상단 메뉴 `입주 예비판정 안내`, 실무 가이드 섹션, 하단 보강 문구를 기준으로 기대값을 업데이트한다.
   - 빠른 검색 버튼, `직접 입력으로 계속`, `전체 코드 사전 보기`, `입주 예비판정 안내`의 상호작용 회귀를 검증한다.

### 검증 메모

- `npm run lint`
- `npm run test -- --run`
- `npm run build`

---

## 2026-03-21 홈 디테일 정리 1차 계획

### 변경 목표

- 사용자가 바로 체감한 어색함을 줄이기 위해, 구조는 유지한 채 `한 줄 정리`, `비활성 힌트`, `오탈자 보정` 같은 디테일을 먼저 다듬는다.
- 첫 진입 시 가장 눈에 띄는 헤더 줄바꿈, 히어로 제목 줄깨짐, 빠른 검색 비활성 버튼 혼란, 가이드 카드 조사 오류를 우선 해결한다.

### 구현 메모

1. `src/App.tsx`
   - 헤더 네비 라벨을 `코드 사전`, `예비판정 안내`, `법령 참고`, `업데이트`처럼 짧게 줄이고 `whitespace-nowrap`를 준다.
   - 헤더 우측 CTA도 `코드 사전 보기`로 축약한다.
   - 히어로 제목은 두 줄이 안정적으로 유지되게 폭과 줄바꿈을 조정하고, 첫 배지는 강조색으로 바꾼다.
   - 히어로 CTA/혜택 카드, 빠른 검색 버튼 카드 높이를 통일하고 textarea 높이를 줄인다.
   - 빠른 검색 버튼 아래에 `입력 후 활성화됩니다` 힌트를 넣고, 잠긴 단계 버튼에는 `검색 후 활성화` 안내를 추가한다.
   - 법령 참고 섹션 설명은 `업종별 허용 코드 목록`이라는 한 문맥으로 정리한다.
2. `src/features/eligibility/components/industry-discovery-panel.tsx`
   - compose 화면 textarea 높이와 버튼 설명 높이를 맞추고, 비활성화 힌트를 추가한다.
3. `src/features/eligibility/components/rulebook-tabs.tsx`
   - 카드 제목과 설명을 `업종별 허용 코드 목록` 중심으로 정리해 중복 설명을 줄인다.
4. `src/features/guides/data/guide-catalog.ts`
   - 판정 라벨 뒤 조사(`로/으로`)를 자동으로 붙이는 helper를 만들어 `가능로` 같은 문법 오류가 생기지 않게 한다.
5. `src/App.test.tsx`
   - 축약된 네비 명칭과 새 힌트 텍스트 기준으로 기대값을 업데이트한다.

### 검증 메모

- `npm run lint`
- `npm run test -- --run`
- `npm run build`

---

## 2026-03-21 워크스페이스 시작 구조 정리 계획

### 변경 목표

- `입주 예비판정 워크스페이스` 첫 화면에서 어디서 시작해야 하는지 더 즉시 이해되도록, 시작 가이드를 탭 바깥으로 분리한다.
- 잠긴 2·3단계는 `비활성 기능`이 아니라 `아직 조건이 충족되지 않은 단계`라는 점이 더 명확히 보이게 만든다.

### 구현 메모

1. `src/App.tsx`
   - `showSlimDiscoverOverview` 상태에서 탭 위에 `이렇게 시작하세요` 안내 박스를 별도로 렌더링한다.
   - 기존 1단계 패널 안에 있던 시작 가이드는 제거하고, 대신 `검색을 시작하면 결과가 이 영역에 이어진다`는 중립적 안내 카드로 축소한다.
   - 잠긴 step 버튼에는 숫자 대신 잠금 아이콘을 보여주고, `검색 후 활성화` 텍스트를 함께 붙인다.
2. `src/App.test.tsx`
   - 초기 홈 렌더 시 `이렇게 시작하세요`와 `검색 후 활성화`가 보이는지 검증한다.

### 검증 메모

- `npm run lint`
- `npm run test -- --run`
- `npm run build`

---

## 2026-03-21 복수 업종코드 동시 판정 계획

### 변경 목표

- 2단계에서 주업종과 부업종을 함께 입력해 최대 3개 업종코드를 한 번에 예비판정할 수 있게 만든다.
- 기존 단일 코드 흐름과 2번 기능인 `두 구역 동시 비교`는 유지하고, 복수 코드 입력 시에도 결과 공유/복사/인쇄가 동일하게 동작하게 만든다.
- 컨설턴트가 사업자등록증의 주업종 + 부업종 조합을 한 화면에서 설명할 수 있도록, 결과 화면을 `코드별 카드` 중심으로 확장한다.

### 구현 메모

1. `src/features/eligibility/types.ts`
   - 추가 코드 입력 타입 `EligibilityAdditionalCode`와 코드별 계산 결과 타입 `EligibilityCodeEvaluation`을 추가한다.
   - `주업종/부업종` 라벨을 결과와 공유 문서에서 함께 재사용할 수 있게 `label`, `order`, `isPrimary` 정보를 담는다.
2. `src/store/eligibility-store.ts`
   - `additionalCodes`, `multiCodeResults` 상태를 추가한다.
   - `addAdditionalCode`, `removeAdditionalCode`, `setAdditionalCodeField` 액션을 만든다.
   - `evaluate()`는 주업종 결과를 기존 `result`에 유지하면서, 추가 코드가 있으면 코드별 결과 배열도 함께 계산한다.
   - `loadSharedResult()`와 `reset()`도 추가 코드 상태를 함께 다루도록 확장한다.
3. `src/features/eligibility/share-result.ts`
   - 공유 payload를 `additionalCodes`까지 담는 v3 포맷으로 확장하고, 기존 v1/v2 링크는 계속 열리게 유지한다.
   - 요약 복사/인쇄용 문서 생성기에서 복수 코드 요약과 복수 코드 비교 요약을 모두 지원한다.
4. `src/features/eligibility/components/eligibility-form.tsx`
   - `입지와 업종 정보` 영역에 `함께 판정할 추가 업종코드` 섹션을 추가한다.
   - 최대 2개 부업종 행을 추가/삭제할 수 있게 하고, 비워 둔 행은 결과 계산에서 자동 제외된다는 안내를 넣는다.
   - 상단 요약 카드에도 현재 함께 보는 코드 개수를 보여준다.
5. `src/features/eligibility/components/result-panel.tsx`
   - 복수 코드 결과가 있으면 상단 헤드라인을 `주업종 + 부업종 동시 판정` 문맥으로 바꾸고, 코드별 결과 카드를 렌더링한다.
   - 비교 모드와 함께 켠 경우에는 각 코드 카드 안에 `지식산업센터 / 산업시설구역` 결과를 같이 보여준다.
   - 법적 근거 각주는 모든 코드와 비교 결과를 합쳐 중복 없이 정리한다.
6. `src/App.tsx`
   - 새 스토어 상태와 액션을 `EligibilityForm`, `ResultPanel`, 공유 링크 생성기로 연결한다.
   - 요약 복사, 공유 링크, 인쇄/PDF 저장이 복수 업종코드 상태를 함께 담도록 갱신한다.
7. 테스트
   - `src/features/eligibility/share-result.test.ts`에 복수 코드 공유 round-trip과 복수 코드 요약 케이스를 추가한다.
   - `src/features/eligibility/components/result-panel.test.tsx`에 복수 코드 카드 렌더링 케이스를 추가한다.
   - `src/App.test.tsx`에 `직접 입력 → 부업종 추가 → 결과 보기` 흐름을 추가한다.

### 검증 메모

- `npm run lint`
- `npm run test -- --run`
- `npm run build`

---

## 2026-03-21 최근 조회 히스토리 계획

### 변경 목표

- 판정 결과를 본 뒤 새로고침이나 다른 화면 이동이 있어도 최근 본 건을 다시 쉽게 열 수 있도록 `최근 조회` 히스토리를 추가한다.
- 저장 포맷은 기존 공유 해시 복원 구조를 재사용해, 한 번 저장한 최근 건을 클릭하면 같은 입력/조건/결과를 바로 복원하도록 만든다.
- 상단 헤더에서 바로 접근 가능한 드롭다운형 패널로 제공해, 컨설턴트가 여러 고객 건을 오갈 때 재입력 비용을 줄인다.

### 구현 메모

1. `src/features/eligibility/history-storage.ts`
   - 로컬스토리지 키, 최대 저장 개수, entry 타입을 정의한다.
   - `loadRecentEligibilityHistory`, `saveRecentEligibilityHistory`, `clearRecentEligibilityHistory` 헬퍼를 추가한다.
   - 기존 `createSharedFinderHash`를 재사용해 중복 판정은 같은 해시 기준으로 덮어쓰게 한다.
2. `src/App.tsx`
   - 결과가 `ready`가 되면 최근 조회 엔트리를 자동 저장하는 effect를 추가한다.
   - 헤더에 `최근 조회` 토글 버튼과 최근 조회 패널을 추가한다.
   - 최근 조회 리스트 아이템을 누르면 `loadSharedResult()`와 해시 갱신을 통해 같은 상태를 바로 복원하게 한다.
   - 빈 상태와 `전체 지우기` 액션도 함께 제공한다.
3. `src/utils/format.ts`
   - 헤더 패널에서 최근 조회 시각을 읽기 좋게 보여줄 `formatKoreanDateTime` 포맷터를 추가한다.
4. 테스트
   - `src/features/eligibility/history-storage.test.ts`에서 저장/중복 덮어쓰기/라벨 생성 규칙을 검증한다.
   - `src/App.test.tsx`에서 결과 저장 후 최근 조회 목록 노출과 클릭 복원 흐름을 검증한다.

### 검증 메모

- `npm run lint`
- `npm run test -- --run`
- `npm run build`

---

## 2026-03-21 추천 결과 더 보기 계획

### 변경 목표

- 1단계 추천 결과 화면에서 후보를 `3개로 고정해 잘라 보이는 느낌`을 줄이고, 사용자가 필요할 때 더 많은 후보를 직접 펼쳐 볼 수 있게 만든다.
- 추천 엔진은 더 많은 후보를 반환하되, 결과 화면은 처음 3개만 먼저 보여줘 첫 화면 밀도를 유지한다.
- `먼저 볼 코드`와 `비슷한 코드`를 각각 독립적으로 펼칠 수 있게 해, 컨설턴트가 상담 상황에 따라 필요한 범위만 넓혀 보도록 만든다.

### 구현 메모

1. `src/features/eligibility/data/industry-discovery.ts`
   - exact / related 후보 상한을 늘려 더 많은 추천 결과를 반환하도록 조정한다.
   - 기본 정렬 규칙은 유지하고, 단순히 최종 slice 상한만 넓혀 UI가 더 보여줄 수 있는 후보 풀을 확보한다.
2. `src/features/eligibility/components/industry-discovery-panel.tsx`
   - exact / related 섹션 각각에 `기본 3개만 노출`하는 접힌 상태를 추가한다.
   - 숨겨진 후보가 있으면 `더 보기 (N개 더)` 버튼을 보여주고, 펼친 뒤에는 `접기`를 제공한다.
   - 추천 상태와 안내 문구도 `전체 후보를 더 볼 수 있다`는 맥락으로 짧게 조정한다.
3. 테스트
   - `src/features/eligibility/industry-discovery.test.ts`에 넓은 검색어가 3개 초과 후보를 반환하는 케이스를 추가한다.
   - `src/App.test.tsx` 또는 추천 패널 관련 테스트에 `더 보기` 버튼과 확장 결과 노출을 검증한다.

### 검증 메모

- `npm run lint`
- `npm run test -- --run`
- `npm run build`

---

## 2026-03-21 예외 조건 스마트 필터 계획

### 변경 목표

- 2단계 `제한·예외 조건`에서 모든 토글을 한 번에 나열하지 않고, 현재 업종코드/업종명 기준으로 먼저 볼 조건만 우선 보여준다.
- 추천 조건이 없는 경우에도 사용자가 전체 조건을 직접 열어 모두 확인할 수 있게 해, 첫 진입 부담은 줄이고 제어권은 유지한다.
- 이미 사용자가 켜 둔 조건은 추천 대상이 아니어도 계속 보이게 해, 보정 중인 상태가 갑자기 숨지지 않도록 만든다.

### 구현 메모

1. `src/features/eligibility/components/eligibility-form.tsx`
   - 조건 토글 메타데이터에 `추천 규칙`과 `추천 힌트`를 함께 담는다.
   - 현재 `input.ksicCode`, `input.ksicName`, `input.notes`, `zoneType`, `compareZones`, `regulatoryFit`를 조합한 컨텍스트로 `추천 조건` 목록을 계산한다.
   - 기본 상태는 `추천 조건만 보기`로 두고, 상단에 `내 업종에 해당할 수 있는 조건 N개` 요약 카드와 `전체 조건 보기` 토글 버튼을 추가한다.
   - 추천 조건이 없을 때는 빈 상태 안내를 보여주고, 사용자가 `전체 조건 보기`를 눌러 모든 토글을 직접 펼칠 수 있게 만든다.
   - 이미 켜 둔 조건은 추천 목록에 없더라도 계속 visible 상태로 유지한다.
2. 테스트
   - `src/App.test.tsx`에 특정 코드에서 관련 조건만 먼저 노출되는지 검증한다.
   - `전체 조건 보기`를 누르면 숨겨졌던 조건이 드러나는 흐름도 함께 검증한다.

### 검증 메모

- `npm run lint`
- `npm run test -- --run`
- `npm run build`

---

## 2026-03-21 법적 근거 각주 직링크 계획

### 변경 목표

- 결과 화면의 `법적 근거 각주`에서 끝내지 않고, 클릭 한 번으로 법령 라이브러리의 해당 문서 또는 근거 카드까지 바로 이동하게 만든다.
- 단순히 라이브러리 첫 화면만 여는 것이 아니라, 사용자가 방금 본 근거를 같은 문장 흐름으로 이어서 읽을 수 있게 스크롤 위치와 강조 상태를 함께 맞춘다.
- 외부 원문 링크는 유지하고, 내부 라이브러리 직링크를 별도 보조 액션으로 추가해 `설명 도구`로서의 완성도를 높인다.

### 구현 메모

1. `src/App.tsx`
   - `#library` 해시에 `#library-entry-...`, `#library-basis-...` 형태의 내부 타겟을 함께 담을 수 있게 확장한다.
   - `openLibraryView(targetId?)` 형태로 문서 카드 또는 근거 카드까지 직접 여는 헬퍼를 만든다.
   - 결과 패널에 `onOpenLibraryEntry`, `onOpenLibraryBasis` 콜백을 넘기고, 라이브러리 페이지에는 현재 타겟 id를 전달한다.
2. `src/features/eligibility/components/legal-footnotes.tsx`
   - 출처 카드에는 `라이브러리에서 보기` 액션을 추가한다.
   - 각 근거 카드의 제목 줄 또는 보조 버튼에서 `법령 라이브러리에서 근거 보기` 액션을 제공한다.
3. `src/features/library/components/legal-library-page.tsx`
   - 문서 카드와 근거 카드에 안정적인 DOM id를 추가한다.
   - 전달된 target id가 있으면 해당 위치로 스크롤하고, 카드 스타일도 강조 상태로 보여준다.
4. `src/features/eligibility/components/result-panel.tsx`
   - `LegalFootnotes`에 새 콜백 props를 연결한다.
5. 테스트
   - `src/features/eligibility/components/result-panel.test.tsx`에 각주 직링크 버튼 콜백 테스트를 추가한다.
   - `src/App.test.tsx`에 결과 화면에서 `라이브러리에서 보기` 클릭 시 라이브러리 화면으로 이동하는 흐름을 추가한다.

### 검증 메모

- `npm run lint`
- `npm run test -- --run`
- `npm run build`

---

## 2026-03-21 퍼널 이벤트 계측 계획

### 변경 목표

- 현재 추가한 주요 기능들이 실제로 얼마나 쓰이는지 확인할 수 있도록 `검색 → 추천 선택 → 결과 보기 → 공유/라이브러리 이동` 핵심 퍼널 이벤트를 심는다.
- 특정 분석 벤더가 아직 정해지지 않았으므로, `window.gtag` 또는 `window.dataLayer`가 있으면 자동으로 전달되고 없으면 조용히 no-op 되는 얇은 공통 유틸을 만든다.
- 개인 식별성이 강한 자유 입력 문장은 보내지 않고, 코드·구역·비교 모드·부업종 개수·결과 verdict 같은 구조화된 값만 보낸다.

### 구현 메모

1. `src/utils/analytics.ts`
   - 공통 `trackEvent()` 유틸과 전송 가능한 primitive payload 타입을 추가한다.
   - `gtag('event', ...)`와 `dataLayer.push(...)`를 모두 지원하고, 둘 다 없으면 그냥 종료한다.
2. `src/App.tsx`
   - `handleDiscoverSearch`, `runQuickSearch`, `handleSuggestionSelect`, `handleContinueManualStep`, `handleEvaluateStep`에 검색/추천/평가 요청 이벤트를 넣는다.
   - 결과가 `ready`가 되었을 때 한 번만 `result_viewed` 이벤트를 보내도록 dedupe key를 둔다.
   - 공유 링크 복사, 요약 복사, 인쇄, 최근 조회 복원, 법령 라이브러리 이동에도 이벤트를 추가한다.
3. 테스트
   - `src/utils/analytics.test.ts`에서 `dataLayer`/`gtag` 브리지 동작을 검증한다.
   - `src/App.test.tsx`에 기본 퍼널 동작 후 핵심 이벤트가 기록되는지 확인하는 케이스를 추가한다.

### 검증 메모

- `npm run lint`
- `npm run test -- --run`
- `npm run build`

---

## 2026-03-21 추천 결과 그룹핑 계획

### 변경 목표

- 추천 결과가 `exact 3개만 보여주는 화면`처럼 보이지 않게, 현재 구역 판정과 매칭 강도를 함께 써서 `먼저 볼 코드 / 함께 확인할 코드 / 주의해서 볼 코드` 구조로 다시 묶는다.
- 추천 엔진의 반환 방식은 그대로 유지하고, 프론트에서 그룹별 설명과 `더 보기`를 제공해 `왜 이 순서인지`를 더 쉽게 설명할 수 있게 만든다.
- 홈/워크스페이스의 보조 카피도 새 그룹 기준으로 맞춰, 검색 후 다음 흐름이 더 자연스럽게 읽히게 한다.

### 구현 메모

1. `src/features/eligibility/components/industry-discovery-panel.tsx`
   - `suggestion.matchKind`, `score`, `selectedZoneVerdict`를 기준으로 그룹 key를 계산하는 헬퍼를 추가한다.
   - `먼저 볼 / 함께 확인 / 주의해서 볼` 섹션 메타데이터와 그룹별 설명 문구를 추가한다.
   - 기존 `exact/related` 섹션을 그룹 기반 렌더링으로 교체하고, `더 보기`는 그룹별로 유지한다.
   - 추천 상태 카드와 결과 상단 안내 문구도 `3개 먼저 표시` 대신 `관련도 높은 순서로 먼저 표시` 톤으로 바꾼다.
2. `src/App.tsx`
   - 위저드 slim overview와 검색 흐름 설명 문구를 새 그룹 구조에 맞게 수정한다.
3. 테스트
   - `src/App.test.tsx`에서 추천 결과 제목 기대값을 새 그룹 텍스트로 갱신한다.
   - 넓은 검색어 흐름에서 `함께 확인할 코드`와 그룹별 접기 버튼이 동작하는지 검증한다.

### 검증 메모

- `npm run lint`
- `npm run test -- --run`
- `npm run build`

---

## 2026-03-21 추천 결과 빠른 필터 계획

### 변경 목표

- 그룹핑된 추천 결과 위에 `전체 후보 / 바로 검토 가능 / 주의 후보만` 필터를 추가해, 상담 중에도 현재 구역 기준으로 후보를 빠르게 좁혀볼 수 있게 만든다.
- 추천 엔진의 반환값은 유지하고, UI에서 현재 `selectedZoneVerdict`를 기준으로 필터링해 화면을 더 실무 친화적으로 만든다.
- 필터로 후보가 없어지는 경우에도 `전체 후보로 돌아가기` 액션이 있는 empty state를 제공해 흐름이 끊기지 않게 한다.

### 구현 메모

1. `src/features/eligibility/components/industry-discovery-panel.tsx`
   - 추천 결과 상단에 필터 버튼과 현재 필터 설명 문구를 추가한다.
   - `all`, `eligible`, `caution` 필터 key와 verdict 기반 매칭 헬퍼를 만든다.
   - 그룹핑 전 suggestions를 먼저 필터링하고, 그 결과를 기존 `먼저 볼 / 함께 확인 / 주의해서 볼` 그룹 렌더링에 연결한다.
   - 필터 결과가 비면 `AsyncState` empty variant와 `전체 후보 보기` 액션을 보여준다.
2. `src/App.test.tsx`
   - broad query 흐름에서 필터 버튼이 보이고, `바로 검토 가능` 선택 시 활성 상태와 설명 문구가 바뀌는지 검증한다.
3. 문서
   - `task.md`, `walkthrough.md`에 이번 루프 결과를 기록한다.

### 검증 메모

- `npm run lint`
- `npm run test -- --run`
- `npm run build`

---

## 2026-03-21 로고/파비콘 L 심볼 리프레시 계획

### 변경 목표

- 현재 `V + 돋보기` 인상에 가까운 심볼을 `L + 돋보기` 조합으로 바꿔, 서비스명 첫 글자와 검색 도구 이미지를 더 직접적으로 연결한다.
- 브라우저 탭의 favicon과 앱 헤더/푸터에서 쓰는 브랜드 자산을 같은 심볼 계열로 통일한다.
- 요청한 대로 favicon SVG뿐 아니라 재사용 가능한 SVG 일러스트 파일도 함께 생성해, 이후 소개 문서나 배너 작업에 바로 쓸 수 있게 한다.

### 구현 메모

1. `public/favicon.svg`
   - 64px 이하에서도 식별되는 단순한 `L + 돋보기` 모노그램으로 교체한다.
   - 기존 블루 톤은 유지하되, 내부 디테일은 줄여 소형 아이콘 가독성을 우선한다.
2. `public/brand/magok-codefinder-symbol.svg`
   - 헤더/모바일 푸터에서 쓰는 심볼 자산을 favicon과 같은 방향으로 교체한다.
3. `public/brand/magok-codefinder-logo-horizontal.svg`
   - 새 심볼을 포함한 가로형 워드마크로 교체한다.
4. `public/brand/magok-codefinder-illustration.svg`
   - 브랜드 소개용으로 쓸 수 있는 큰 SVG 일러스트 파일을 추가한다.
5. 문서
   - `task.md`의 2026-03-20 미완료 설계 묶음은 사용자 요청에 따라 `폐기`로 닫는다.
   - `walkthrough.md`에 자산 교체와 검증 결과를 기록한다.

### 검증 메모

- `npm run lint`
- `npm run test -- --run`
- `npm run build`
