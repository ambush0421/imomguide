# 2026-03-20 전체 웹사이트 밀도 재배치 + 빈 공간 제거

## Plan

- 홈과 주요 하위 페이지에서 2열 소개 카드가 고정 폭과 높이 강제로 늘어지며 빈 공간이 남는 문제를 줄인다.
- 홈 히어로, 전수 코드 사전, 가이드, 법령 라이브러리, 업데이트 로그를 같은 적응형 밀도 규칙으로 통일한다.
- 공통 상태 카드와 제휴 위젯처럼 `h-full`, `min-h-*` 영향을 크게 받는 영역은 내용 길이 우선 구조로 되돌린다.

## Do

- `src/App.tsx`
  - 홈 히어로와 첫 진입 안내 패널을 `items-start` 기반 적응형 2열로 재구성했다.
  - 홈 본문 섹션의 카드 간격, 카드 내부 패딩, 가이드/업데이트 미리보기 배치를 조밀하게 조정했다.
  - 제휴 위젯의 `h-full`, `min-h-*`를 제거해 카드 높이가 내용에 따라 자연스럽게 줄어들게 했다.
- `src/components/async-state.tsx`
  - 공통 상태 카드 기본 높이를 낮췄다.
- `src/features/eligibility/components/code-directory-page.tsx`
  - 상단 소개 + 필터 + 요약 영역을 적응형 2열로 재구성했다.
- `src/features/guides/components/guide-page.tsx`
  - 상단 소개부와 FAQ/법령 2열 블록을 더 유연하게 바꿨다.
- `src/features/library/components/legal-library-page.tsx`
  - 문서 카드 내부 2열 메타 블록이 중간 폭에서 세로 흐름으로 자연스럽게 접히도록 조정했다.
- `src/features/updates/components/update-log-page.tsx`
  - 업데이트 카드의 보조 정보 블록 분할 시점을 늦춰 빈 공간을 줄였다.

## Check

- 실행 명령
  - `npm run lint`
  - `npm run test`
  - `npm run build`
- 결과
  - `lint` 통과
  - `test` 통과
    - `8 files / 77 tests`
  - `build` 통과
    - SEO export 포함 전체 빌드 성공
- 관찰 사항
  - chunk size 경고와 plugin timing 경고는 기존과 동일하게 남아 있다.

## Act

- 다음 루프에서는 홈 카드 수 자체를 더 줄일지, 아니면 현재 밀도 구조를 유지한 채 컬러/타이포만 추가 조정할지 사용자 피드백을 기준으로 결정한다.
- 이번 작업에서 효과가 좋았던 규칙은 다음에도 우선 적용한다.
  - 2열 소개 영역은 `lg/xl`에서만 분리하고, `items-start`를 기본으로 둔다.
  - 짧은 보조 카드에는 `h-full`, 큰 `min-h-*`를 되도록 쓰지 않는다.
  - 문단 간격은 없애지 말고, 카드 패딩과 줄 길이부터 줄여 읽기 밀도를 조정한다.
