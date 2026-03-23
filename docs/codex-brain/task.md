## 2026-03-23 업종코드 추천을 입주 전략 컨설턴트형으로 전환

- [x] 업종 추천/판정/결과 화면 관련 코드 경로 분석
- [x] `docs/codex-brain/implementation_plan.md` 승인 대기용 계획 작성
- [x] 사용자 승인 대기
- [x] `IndustrySuggestion`와 추천 결과 데이터 구조를 행동 중심 필드로 확장
- [x] `industry-discovery-panel`에 후보 코드 + 검토 이유 + 혜택/증빙/주의사항/다음 행동 구조 반영
- [x] `result-panel`과 인사이트 레이어를 코드 판정 중심에서 입주 전략 중심 설명으로 보강
- [x] 실제 하지 않는 업종 추가 유도 없이 연관 코드/증빙/입주 전략을 안내하는 문구 기준 정리
- [x] 관련 테스트 업데이트
- [x] `npm run lint`
- [x] `npm run test`
- [x] `npm run build`
- [x] `docs/codex-brain/walkthrough.md` 기록

## 2026-03-23 공용 UI 하이엔드 재설계 4차(페이지 조합 밀도 정리)

- [x] `App`/`eligibility-form`/`industry-discovery-panel`/`rulebook-tabs`/`badge` 현재 구조와 밀도 이슈 분석
- [x] `docs/codex-brain/implementation_plan.md` 승인 대기용 계획 작성
- [ ] 사용자 승인 대기
- [ ] `src/components/ui/badge.tsx`와 반복 배지/아이콘 박스 문법 정리
- [ ] `src/App.tsx` 히어로/스텝/포커스 rail의 보조 카드와 요약 박스 밀도 조정
- [ ] `industry-discovery-panel`/`eligibility-form`/`rulebook-tabs`의 요약 카드·배지·헤더 내부 간격 정리
- [ ] 주요 조합 화면에서 반응형 밀도와 계층 균형 확인
- [ ] `npm run lint`
- [ ] `npm run test`
- [ ] `npm run build`
- [ ] `docs/codex-brain/walkthrough.md` 기록

## 2026-03-23 공용 UI 하이엔드 재설계 3차(Button/App 장식 레이어)

- [x] `Button`과 `App` 페이지 레벨 장식 레이어 현재 구조 분석
- [x] `docs/codex-brain/implementation_plan.md` 승인 대기용 계획 작성
- [x] 사용자 승인 대기
- [x] `src/components/ui/button.tsx`를 글래스 버튼 시스템으로 재작성
- [x] `src/App.tsx`의 직접 `rgba`/`white` 기반 장식 레이어를 시맨틱 토큰으로 치환
- [x] 히어로/스텝 인디케이터/헤더에서 버튼과 배경 장식의 톤 정렬 확인
- [x] 이번 범위 파일에서 하드코딩 색상(`white`, `white/70`, 임의 rgba`) 제거 확인
- [x] `npm run lint`
- [x] `npm run test`
- [x] `npm run build`
- [x] `docs/codex-brain/walkthrough.md` 기록

## 2026-03-23 공용 UI 하이엔드 재설계 2차(Tabs/Switch/Skeleton/Textarea)

- [x] `Tabs`/`Switch`/`Skeleton`/`Textarea` 현재 구조와 대표 사용처 분석
- [x] `docs/codex-brain/implementation_plan.md` 승인 대기용 계획 작성
- [x] 사용자 승인 대기
- [x] `src/components/ui/tabs.tsx`를 글래스 트랙 + 정교한 활성 상태 전환 구조로 재작성
- [x] `src/components/ui/switch.tsx`를 다층 레일/썸 + 스냅 있는 전환으로 재작성
- [x] `src/components/ui/skeleton.tsx`를 shimmer 대신 pulse 중심 로딩 언어로 재작성
- [x] `src/components/ui/textarea.tsx`를 `Input`과 같은 깊이형 필드 레시피로 통일
- [x] 대표 사용처(`rulebook-tabs`, `eligibility-form`, `industry-discovery-panel`, `App`)에서 시각 균형 확인
- [x] 이번 범위 파일에서 하드코딩 색상(`white`, `white/70`, 임의 rgba`) 제거 확인
- [x] `npm run lint`
- [x] `npm run test`
- [x] `npm run build`
- [x] `docs/codex-brain/walkthrough.md` 기록

## 2026-03-22 공용 UI 하이엔드 재설계 1차(Card/Input/Select)

- [x] 공용 UI 토큰과 `Card`/`Input`/`Select`/`Tabs`/`Switch`/`Skeleton` 현재 구조 분석
- [x] `docs/codex-brain/implementation_plan.md` 승인 대기용 계획 작성
- [x] 사용자 승인 대기
- [x] `src/index.css`에 논리적 곡률·시맨틱 표면·다층 그림자 토큰 추가
- [x] `src/components/ui/card.tsx`를 중첩 곡률 + 글래스 레이어 구조로 재작성
- [x] `src/components/ui/input.tsx`를 카드 내부 반경과 맞는 깊이형 필드로 재작성
- [x] `src/components/ui/select.tsx`를 입력 필드와 같은 반경 계약 + 안전한 드롭다운 그림자로 재작성
- [x] 대표 사용처(`eligibility-form`)에서 카드/입력/셀렉트 조합 시각 균형 재확인
- [x] 하드코딩 색상(`white`, `white/70`, 임의 rgba`)이 이번 범위 파일에서 제거됐는지 확인
- [x] `npm run lint`
- [x] `npm run test`
- [x] `npm run build`
- [x] `docs/codex-brain/walkthrough.md` 기록

## 2026-03-21 모바일 헤더 브랜드 텍스트 잘림 해소

- [x] 현재 모바일 헤더에서 제목이 잘리는 재현 지점 확인
- [x] `docs/codex-brain/implementation_plan.md` 승인 대기용 계획 작성
- [x] 사용자 승인 대기
- [x] `src/App.tsx` 모바일 헤더 레이아웃 조정
- [x] 매우 좁은 폭에서도 제목/액션 버튼이 함께 보이는지 확인
- [x] `npm run lint`
- [x] `npm run test`
- [x] `npm run build`
- [x] `docs/codex-brain/walkthrough.md` 기록

## 2026-03-21 582xx 소프트웨어 계열 법령 연결 전면 정정

- [x] `582xx` 법령 연결과 KSIC 계층 표시의 현재 노출 경로 재확인
- [x] `docs/codex-brain/implementation_plan.md` 실행 기준 계획 반영
- [x] `제6조제3항 1~5호` 데이터 테이블 및 코드별 대표 조문 resolver 추가
- [x] `screen-insights`, `magok-code-directory`, `rulebook-tabs`에 새 매핑 적용
- [x] `guide-catalog`와 정적 SEO 산출물이 `제6조 제3항` 기준을 반영하도록 정리
- [x] 관련 테스트 업데이트
- [x] `npm run lint`
- [x] `npm run test`
- [x] `npm run export:guides`
- [x] `npm run export:directory`
- [x] `npm run build`
- [x] `docs/codex-brain/walkthrough.md` 기록

## 2026-03-21 finder 하이브리드 위저드 단계 복원 강화

- [x] 현재 `finder` 해시/집중 모드/스토어 전이 구조 재확인
- [x] `docs/codex-brain/implementation_plan.md`에 이번 루프 계획 추가
- [x] 위저드 해시 계약(`mode/step/screen/share`) 확장
- [x] 세션 초안 저장/복원 헬퍼 추가 및 `#finder` 복귀 흐름 연결
- [x] `App.tsx` 위저드 셸 책임 분리 및 단계 이동 `pushState` 반영
- [x] `directory/library/updates` 왕복 후 `finder` 초안 복원 유지
- [x] `App.test.tsx` 해시/세션 복원 회귀 테스트 추가
- [x] `npm run lint`
- [x] `npm run test`
- [x] `npm run build`
- [x] `docs/codex-brain/walkthrough.md` 기록

## 2026-03-21 지식산업센터 5자리 코드 문구 쉬운 표현으로 정리

- [x] 사용자 화면에 노출되는 `exact 5자리` 문구와 생성 경로 확인
- [x] `docs/codex-brain/implementation_plan.md` 승인 대기용 계획 작성
- [x] `screen-insights`, `expert-insights`, `evaluator`, `magok-code-directory`의 사용자 노출 문구를 쉬운 한국어로 통일
- [x] 관련 테스트 기대 문자열 업데이트
- [x] 로딩/에러/빈 상태 영향 없는지 결과 화면 문구 재확인
- [x] `npm run lint`
- [x] `npm run test`
- [x] `npm run build`
- [x] `docs/codex-brain/walkthrough.md` 기록
- [x] 사용자 승인 대기

## 2026-03-21 파비콘 루트 fallback 및 캐시 버스트 보강

- [x] 브라우저 탭에서 예전 파비콘이 남는 원인 재확인
- [x] 루트 favicon fallback 파일 세트 추가
- [x] `index.html` 파비콘 링크를 루트 경로 + 캐시 버스트 기준으로 정리
- [x] `npm run lint`
- [x] `npm run test`
- [x] `npm run build`
- [x] `docs/codex-brain/walkthrough.md` 기록
- [x] 사용자 재요청으로 바로 실행 승인 확인

## 2026-03-21 새 로고 기준 전체 브랜드 자산 최종 정리

- [x] 실제 서비스 참조 자산과 브랜드 폴더 잔여 원본 자산 재점검
- [x] `loopinlab-logo.ai`를 새 로고 기준 PDF 호환 원본으로 재생성
- [x] SVG/PNG/ICO/AI 브랜드 자산 정합성 최종 점검
- [x] `npm run lint`
- [x] `npm run test`
- [x] `npm run build`
- [x] `docs/codex-brain/walkthrough.md` 기록
- [x] 사용자 재요청으로 바로 실행 승인 확인

## 2026-03-21 전체 브랜드 로고/파비콘 일괄 교체

- [x] 현재 참조 중인 로고/파비콘과 잔여 브랜드 자산 범위 확인
- [x] `magok-codefinder` 로고/파비콘 세트 최신안 기준 재정렬
- [x] `loopinlab` 심볼/가로 로고를 같은 시각 언어로 교체
- [x] `magok-codefinder-illustration.svg` 내 심볼도 최신안으로 교체
- [x] PNG/ICO 파생 자산 재생성
- [x] `npm run lint`
- [x] `npm run test`
- [x] `npm run build`
- [x] `docs/codex-brain/walkthrough.md` 기록
- [x] 사용자 재요청으로 바로 실행 승인 확인

## 2026-03-21 L 하단 가로획 길이 보정

- [x] 하단 가로획이 실제로 짧게 보이는 현재 비율 확인
- [x] 심볼/워드마크/파비콘의 L 가로획을 세로획 길이감과 맞게 보정
- [x] `favicon.svg`와 파비콘 세트 재동기화
- [x] `npm run lint`
- [x] `npm run test`
- [x] `npm run build`
- [x] `docs/codex-brain/walkthrough.md` 기록
- [x] 사용자 재요청으로 바로 실행 승인 확인

## 2026-03-21 서있는 돋보기 가시성 보강

- [x] 기존 `O` 치환이 실제 화면에서 왜 안 보였는지 노출 위치 재확인
- [x] 심볼 로고의 원형 포인트를 세워진 돋보기 형태로 교체
- [x] 가로형 로고의 `CODE` 내 돋보기 `O`를 더 크게 보이도록 보강
- [x] `favicon.svg`와 파비콘 세트 재동기화
- [x] `npm run lint`
- [x] `npm run test`
- [x] `npm run build`
- [x] `docs/codex-brain/walkthrough.md` 기록
- [x] 사용자 재요청으로 바로 실행 승인 확인

## 2026-03-21 워드마크 O 세워진 돋보기 치환

- [x] 영문 워드마크에서 치환할 `O` 위치를 `CODE` 기준으로 확정
- [x] 가로형 로고의 영문 서브타이틀 `O`를 세워진 돋보기로 교체
- [x] `npm run lint`
- [x] `npm run test`
- [x] `npm run build`
- [x] `docs/codex-brain/walkthrough.md` 기록
- [x] 사용자 재요청으로 바로 실행 승인 확인

## 2026-03-21 L 블록형 로고 리파인 + 파비콘 전면 교체

- [x] 첨부 시안 기준 형태와 현재 색상 유지 원칙 확인
- [x] 실제 파비콘 세트(`svg/png/ico/apple-touch`) 범위 확인
- [x] 블록형 `L` 심볼 SVG 반영
- [x] 가로형 워드마크 좌측 심볼 동기화
- [x] `favicon.svg`와 `public/brand` 파비콘 세트 전체 교체
- [x] `npm run lint`
- [x] `npm run test`
- [x] `npm run build`
- [x] `docs/codex-brain/walkthrough.md` 기록
- [x] 사용자 재요청으로 바로 실행 승인 확인

## 2026-03-21 L 상단 돋보기 로고 확인 및 문서 정리

- [x] 현재 심볼/워드마크/파비콘이 이미 `L` 형태인지 확인
- [x] `V` 기준으로 남아 있던 작업/계획/결과 문구를 `L` 기준으로 정리
- [x] 헤더/푸터/파비콘 참조 경로 재확인
- [x] `npm run lint`
- [x] `npm run test`
- [x] `npm run build`
- [x] `docs/codex-brain/walkthrough.md` 기록
- [x] 사용자 재요청으로 바로 실행 승인 확인

## 2026-03-20 L 상단 돋보기 로고 리디자인

- [x] 현재 심볼/워드마크/파비콘 적용 지점 확인
- [x] `docs/codex-brain/implementation_plan.md` 승인 대기용 계획 작성
- [x] `L` 위에 돋보기 실루엣이 얹힌 새 심볼 SVG 시안 반영
- [x] 가로형 워드마크의 좌측 심볼을 새 콘셉트로 교체
- [x] `public/favicon.svg`를 새 심볼 기준으로 동기화
- [x] 헤더/푸터 실제 연결 자산 확인
- [x] 로딩/에러/빈 상태 영향 없는지 UI 확인
- [x] `npm run lint`
- [x] `npm run test`
- [x] `npm run build`
- [x] `docs/codex-brain/walkthrough.md` 기록
- [x] 사용자 승인 대기

## 2026-03-20 각진 레이아웃 재정렬 + 빈 공간 2차 보정

- [x] 홈 첫 화면을 `큰 카드 + 보조 스택`에서 선 정렬이 맞는 격자형 레이아웃으로 재구성
- [x] 공통 `Card`, `Button`, `Badge`, `AsyncState`의 과한 라운드 반경을 줄여 각진 인상으로 통일
- [x] 전수 코드 사전, 가이드, 법령 라이브러리, 업데이트 로그 상단 배치를 더 반듯한 2열/보조 격자로 재정리
- [x] 홈 하단 섹션과 푸터까지 큰 컨테이너 반경과 카드 밀도를 다시 맞춰 전체 톤을 통일
- [x] 모바일·태블릿·데스크톱에서 카드 선 정렬과 하단 빈 공간 재검증
- [x] `npm run lint`
- [x] `npm run test`
- [x] `npm run build`
- [x] `docs/codex-brain/walkthrough.md` 기록
- [x] 사용자 재요청으로 바로 실행 승인 확인

## 2026-03-20 데스크 홈 상단 빈 공간 제거 2차

- [x] 상단 데스크 레이아웃에서 빈 공간이 생기는 실제 원인 재확인
- [x] 오른쪽 보조 정보를 단일 카드 흐름으로 합쳐 좌우 밀도 균형 재조정
- [x] 같은 그룹 카드의 폭/높이 정렬 규칙 통일
- [x] 상단 큰 블록과 하단 공통 카드 행의 정렬 구조 재구성
- [x] `npm run lint`
- [x] `npm run test`
- [x] `npm run build`
- [x] `docs/codex-brain/walkthrough.md` 기록

## 2026-03-20 전체 웹사이트 밀도 재배치 + 빈 공간 제거

- [x] 홈 히어로와 첫 진입 안내 패널의 고정 높이/늘어짐 구조를 재설계
- [x] 홈 본문 섹션(전수 코드 사전, 법령 참고, 업데이트, 가이드, 제휴, 푸터)의 카드 밀도와 배치 흐름을 재정렬
- [x] 전수 코드 사전, 가이드, 법령 라이브러리, 업데이트 로그의 상단 2열 소개 레이아웃을 콘텐츠 길이에 맞게 적응형으로 통일
- [x] 공통 `Card` / `AsyncState` / 요약 카드의 `h-full`, `items-stretch`, `min-h-*` 사용 지점을 점검하고 빈 공간이 덜 생기게 조정
- [x] 모바일·태블릿·데스크톱에서 카드 높이 균형과 섹션 간 여백 흐름 재검증
- [x] `npm run lint`
- [x] `npm run test`
- [x] `npm run build`
- [x] `docs/codex-brain/walkthrough.md` 기록
- [x] 사용자 승인 대기

# 입주가능판별기 작업 체크리스트

## 2026-03-20 탭·데스크 혼합형 위저드 모드 + 가독성 보정

- [x] 현재 모바일 집중 모드 조건과 데스크/탭 레이아웃 분기 지점 재확인
- [x] 태블릿에서 집중형 위저드가 자연스럽게 보이도록 중간 breakpoint 설계
- [x] 데스크에서는 중앙 위저드 + 보조 참고 패널 조합의 혼합형 레이아웃 구현
- [x] `industry-discovery`, `eligibility-form`, `result-panel`의 제목/본문/입력 밀도 재조정
- [x] 긴 문장 줄 길이, 카드 패딩, 단계 헤더 위계 보정으로 가독성 개선
- [x] `npm run lint`
- [x] `npm run test`
- [x] `npm run build`
- [x] `docs/codex-brain/walkthrough.md` 기록

## 2026-03-20 단색 블루 적용

- [x] 전역 gradient 사용 지점과 단색 전환 범위 재확인
- [x] 전역 배경과 `surface` 계열을 단색 중심으로 정리
- [x] 기본 버튼/배지/카드의 gradient 제거
- [x] 홈 첫 화면과 주요 페이지 카드 배경을 단색 면으로 통일
- [x] `npm run lint`
- [x] `npm run test`
- [x] `npm run build`
- [x] `docs/codex-brain/walkthrough.md` 기록

## 2026-03-20 파스텔 제거형 색 보정

- [x] 모바일 결과 화면 기준 파스텔 톤이 유치하게 보이는 원인 재정리
- [x] 전역 `surface`, `surface-muted`, `surface-soft`, `accent-soft`를 더 중성적인 톤으로 재정의
- [x] 공통 `Badge`, `Button`의 과한 파스텔/베이비 블루 인상 축소
- [x] `ResultPanel`, `EligibilityForm`, 모바일 위저드 카드의 큰 블루 면 제거
- [x] `npm run lint`
- [x] `npm run test`
- [x] `npm run build`
- [x] `docs/codex-brain/walkthrough.md` 기록

## 2026-03-20 컬러 무드 2차 보정

- [x] 현재 토큰 기준으로 화면이 점잖고 올드하게 보이는 원인 재정리
- [x] 전역 `border`, `border-accent`, `shadow`, `accent` 토큰을 더 선명하고 또렷한 방향으로 재정의
- [x] 공통 `Button`, `Badge`, `Card`의 외곽선과 강조색 대비 상향
- [x] 홈 첫 화면 히어로/안내 카드의 표면색과 테두리 밀도 보정
- [x] 코드 사전 상단 섹션의 외곽선과 배경 무드 동기화
- [x] `npm run lint`
- [x] `npm run test`
- [x] `npm run build`
- [x] `docs/codex-brain/walkthrough.md` 기록

## 2026-03-20 컬러 무드 리디자인

- [x] 현재 전역 색 토큰과 하드코딩 배경/강조색 사용 지점 재확인
- [x] 스크린샷 기준 촌스러운 인상을 만드는 핵심 조합 식별
- [x] 전역 팔레트를 `밝은 화이트 + 잉크 텍스트 + 선명하지만 절제된 블루` 중심으로 재정의
- [x] 헤더/히어로/우측 안내 패널의 과한 베이지-블루 혼합 톤 제거
- [x] 버튼/배지/카드의 광택형 블루 그라데이션과 반투명 화이트 톤 정리
- [x] 주요 화면에서 하드코딩된 연파랑/하늘색 박스 색상 통일
- [x] `npm run lint`
- [x] `npm run test`
- [x] `npm run build`
- [x] `docs/codex-brain/walkthrough.md` 기록
- [x] 사용자 승인 대기

## 2026-03-20 지마켓 산스 + 프리텐다드 전역 적용

- [x] 현재 전역 폰트 import와 제목/본문 분기 지점 확인
- [x] `font-display` 유틸이 제목 계열 전반에 연결된 구조 확인
- [x] `Gmarket Sans` 공식 배포 파일 확보 및 self-hosting 경로 준비
- [x] `Gmarket Sans` + `Pretendard` 조합으로 전역 폰트 교체
- [x] 제목 계열(`h1`~`h4`, `font-display`)을 `Gmarket Sans`로 전환
- [x] 본문 계열(`body`)을 `Pretendard`로 전환하고 fallback 정리
- [x] 제목 자간과 작은 헤딩 가독성 영향 확인
- [x] `npm run lint`
- [x] `npm run test`
- [x] `npm run build`
- [x] `docs/codex-brain/walkthrough.md` 기록
- [x] 사용자 승인 대기

## 2026-03-20 모바일 집중형 위저드 + 트렌디 비주얼 리디자인

- [x] 모바일에서 위저드 진입 시 현재 단계만 보이는 집중 모드 구현
- [x] 모바일 집중 모드용 상단 안내/복귀 흐름 정리
- [x] 홈과 위저드의 컬러 토큰을 더 세련된 톤으로 재정의
- [x] 공통 `Button`/`Badge`/`Card`의 무드와 그림자 재정비
- [x] `finder`, `discover`, `adjust`, `result` 핵심 패널 톤 정리
- [x] `npm run lint`
- [x] `npm run test`
- [x] `npm run build`
- [x] `docs/codex-brain/walkthrough.md` 기록

## 2026-03-20 모바일 오버플로/잘림 보정

- [x] 모바일 헤더 CTA 폭 축소와 라벨 압축
- [x] 루트 래퍼 `overflow-x-hidden` 안전장치 추가
- [x] 모바일 `직접 입력으로 계속` 문구/버튼 폭 축소
- [x] 예시 칩 모바일 2개 우선 노출 + 더 보기 보정
- [x] `npm run lint`
- [x] `npm run test`
- [x] `npm run build`
- [x] `docs/codex-brain/walkthrough.md` 기록

## 2026-03-20 모바일 압축형 2차 보정

- [x] 모바일 히어로의 사실 카드/보조 포인트 노출량 축소
- [x] `finder` 외곽 패딩과 단계 탭의 모바일 높이 재압축
- [x] 추천 입력 화면의 설명/textarea/CTA를 모바일 우선으로 재배치
- [x] 2단계/3단계 요약 카드의 모바일 밀도 추가 보정
- [x] `npm run lint`
- [x] `npm run test`
- [x] `npm run build`
- [x] `docs/codex-brain/walkthrough.md` 기록

## 2026-03-20 사용자 관점 문구 최적화

- [x] 홈/위저드/결과/참고 영역의 관리자 설명형 문구 식별
- [x] 사용자 행동 중심 문구로 카피 정리
- [x] 내부 운영/절차 설명성 문구 축소 또는 제거
- [x] `npm run lint`
- [x] `npm run test`
- [x] `npm run build`
- [x] `docs/codex-brain/walkthrough.md` 기록

## 2026-03-20 모바일 위계 중심 리디자인

- [x] 모바일 헤더 높이와 액션 배치 압축
- [x] 상단 히어로 보조 카드의 모바일 구조 단순화
- [x] `finder` 외곽 설명과 스텝 UI의 모바일 위계 재정리
- [x] 추천 카드/CTA의 모바일 컴팩트 레이아웃 보정
- [x] `npm run lint`
- [x] `npm run test`
- [x] `npm run build`
- [x] `docs/codex-brain/walkthrough.md` 기록

## 2026-03-20 쉬운 검색 홈 단일 패널 전환 정리

- [x] 현재 `finder`의 중첩 카드 구조 확인
- [x] 1단계/2단계/3단계가 바깥 메인 패널 하나 안에서 보이도록 구조 정리
- [x] 단계 컴포넌트의 중복 헤더/카드 래퍼 제거 또는 임베드 모드 추가
- [x] `App.test.tsx`를 단일 패널 흐름 기준으로 갱신
- [x] `npm run lint`
- [x] `npm run test`
- [x] `npm run build`
- [x] `docs/codex-brain/walkthrough.md` 기록

## 2026-03-20 쉬운 검색 홈 뎁스형 화면 전환 개선

- [x] 현재 `finder` 단계 구조와 전환 지점 분석
- [x] 1단계를 `입력 화면 / 추천 결과 화면`으로 분리
- [x] 클릭 시 다음 화면으로 넘어가는 뎁스형 전환 흐름 구현
- [x] 2단계/3단계 자동 전환과 이전 이동 UX 정리
- [x] `App.test.tsx` 사용자 흐름 갱신
- [x] lint/test/build 재검증
- [x] walkthrough.md 갱신

## 2026-03-21 복수 업종코드 동시 판정

- [x] 현재 단일 코드 입력/결과/공유 구조 재확인
- [x] implementation_plan.md에 3번 기능 계획 추가
- [x] 스토어에 추가 업종코드 상태와 결과 구조 확장
- [x] 2단계 입력 화면에 최대 3개 코드 입력 UI 추가
- [x] 3단계 결과 화면에 주업종/부업종 동시 판정 카드 추가
- [x] 공유 링크/요약 복사/인쇄를 복수 코드까지 확장
- [x] App 테스트 및 결과 패널/공유 헬퍼 테스트 갱신
- [x] lint/test/build 검증
- [x] walkthrough.md 기록

## 2026-03-20 고대비형 SaaS 색 체계 보정

- [x] 전역 색 토큰 재정의
- [x] 공통 `Button`/`Badge`/`Card` 대비 강화
- [x] `AsyncState` 대비 강화
- [x] 홈 핵심 섹션 배경/테두리/강조색 보정
- [x] 헤더/푸터 대비 보정
- [x] 위저드 핵심 패널(`discover / adjust / result`) 대비 강화
- [x] 직접 입력 흐름 문구와 테스트 기대값 정합성 보정
- [x] `npm run lint`
- [x] `npm run test`
- [x] `npm run build`
- [x] `docs/codex-brain/walkthrough.md` 기록

## 2026-03-20 PDCA UI/UX 잔여 핵심 보정

- [x] 공통 `Button` loading API 추가
- [x] 추천/판정 CTA에 loading 상태 연결
- [x] `SelectItem` 클릭 affordance 보정
- [x] lazy 전환 이후 깨진 테스트 복구
- [x] `Button` loading 테스트 추가
- [x] `npm run lint`
- [x] `npm run test`
- [x] `npm run build`
- [x] `docs/codex-brain/walkthrough.md` 기록
- [x] 최종 체크리스트 상태 반영

## 2026-03-20 Cloudflare Pages Git 빌드 누락 원인 점검

- [x] Cloudflare Pages 실패 로그 확인
- [x] `wrangler.toml`의 Pages 출력 경로 설정 확인
- [x] `package.json`의 실제 빌드 스크립트 확인
- [x] 로컬 `npm run build` 및 `dist` 생성 여부 재검증
- [x] Git 연동 배포 실패의 직접 원인 정리
- [x] OAuth 토큰 기반 Pages API 호출 복구
- [x] `dist` direct upload로 Production 배포 성공
- [x] Pages 프로젝트 `build_config`를 `npm run build` / `dist`로 수정
- [x] `loopincode.com` 최신 자산 응답 확인
- [x] 대시보드/배포 방식 기준 대응안 문서화

## 2026-03-20 안티그래비티 walkthrough 공식 반영

- [x] 루트 `walkthrough.md` 문서 내용 확인
- [x] 문서에 적힌 파일별 변경 사항과 현재 소스 대조
- [x] `npm run build`로 빌드/청크 분리 상태 재확인
- [x] 정식 아티팩트 위치인 `docs/codex-brain/walkthrough.md` 반영 여부 확인
- [x] 루트 walkthrough 핵심 내용을 정식 워크스루 형식으로 통합
- [x] 통합 결과를 `docs/codex-brain` 아티팩트에 기록

## 2026-03-20 홈 섹션 대비 강화 및 쉬운 검색 슬라이드 위저드 설계

- [x] 현재 홈 화면 섹션 위계와 쉬운 검색 위저드 구조 분석
- [x] 홈 배경과 주요 섹션 대비를 높이는 레이아웃 방향 정리 (사용자 요청으로 폐기)
- [x] 쉬운 검색 홈의 이전/다음 버튼 흐름 재설계 (사용자 요청으로 폐기)
- [x] 터치 스와이프 기반 단계 전환 구조 설계 (사용자 요청으로 폐기)
- [x] 접근성/키보드/모바일 대응 검토 (사용자 요청으로 폐기)
- [x] 사용자 승인 대기 (사용자 요청으로 폐기)

## 2026-03-20 제안서/PDF 렌더러 경로 최종 확인 및 현 범위 종결

- [x] 현재 워크스페이스에서 제안서/PDF 렌더러 관련 문자열 재검색
- [x] `electron/main.mjs`의 실제 렌더러 진입 경로 재확인
- [x] `release/win-unpacked/resources/app.asar` 패키지 내용 확인
- [x] 별도 제안서/PDF 렌더러 파일 부재 결론 정리
- [x] 현 워크스페이스 기준 종결 가능 상태를 walkthrough.md에 기록

## 2026-03-20 결과 패널 출처 메타 재사용 1차 구현

- [x] 결과 패널 각주용 출처 메타 재사용 범위 재확인
- [x] `sourceKind -> 문서 메타` 헬퍼 추가
- [x] `LegalFootnotes`에 원문 출처 묶음과 메타 배지 반영
- [x] 결과 패널 테스트 보강
- [x] lint/test/build 검증
- [x] walkthrough.md 갱신

## 2026-03-20 법령 원문 출처 링크 및 문서 메타 강화

- [x] 법령 라이브러리 출처 메타 구조 추가
- [x] 업데이트 로그 출처 문서 링크 구조 추가
- [x] 앱 라이브러리 화면에 원문 보기/출처 메타 반영
- [x] 앱 업데이트 로그 화면에 원문 근거 링크 반영
- [x] 공개 SEO `library/updates` 페이지 메타 강화
- [x] SEO 빌더 테스트 보강
- [x] lint/test/export/build 검증
- [x] walkthrough.md 갱신

## 2026-03-20 Search Console 제출 최적화 1차 구현

- [x] 공개 SEO 페이지의 Search Console 제출 관점 요구사항 재정리
- [x] `seo-page-builder`에 `robots` 메타와 `sitemap index` 생성 추가
- [x] `export:seo-pages`에 `public/sitemaps/*.xml` 분리 생성 연결
- [x] 루트 `public/sitemap.xml`을 sitemap index로 전환
- [x] guide/faq/library/updates sitemap 분리 출력 확인
- [x] lint/test/export/build 검증
- [x] walkthrough.md 갱신

## 2026-03-20 공개 SEO 법령 라이브러리 및 업데이트 로그 1차 구현

- [x] library/updates 데이터 구조 재확인
- [x] 공개 SEO 빌더에 법령 라이브러리/업데이트 로그 문서 생성 추가
- [x] `export:seo-pages`에 `public/library`, `public/updates` 생성 연결
- [x] sitemap에 library/updates 공개 URL 추가
- [x] 앱 내 공개 페이지 진입선 추가
- [x] SEO 빌더 테스트 보강
- [x] lint/test/export/build 검증
- [x] walkthrough.md 갱신

## 2026-03-20 공개 SEO 가이드·FAQ 페이지 레이어 1차 구현

- [x] `seo-meta` 기준 공개 페이지 메타 구조 설계
- [x] 가이드/FAQ 공개 HTML 빌더 추가
- [x] FAQ/가이드/Breadcrumb 구조화데이터 반영
- [x] `export:seo-pages` 스크립트 추가
- [x] `prebuild` 자동 생성 파이프라인 연결
- [x] `public/guides`, `public/faq`, `public/sitemap.xml` 생성
- [x] 앱 가이드 화면에 공개 페이지 진입선 추가
- [x] SEO 페이지 빌더 테스트 추가
- [x] lint/test/export/build 검증
- [x] walkthrough.md 갱신

## 2026-03-20 업종별 가이드 및 FAQ 파이프라인 1차 구현

- [x] 현재 코드 사전 데이터와 가이드화 가능 범위 재확인
- [x] 가이드/FAQ 데이터 카탈로그 추가
- [x] `GuidePage` 구현
- [x] `#guides/<code>` 해시 라우팅 연결
- [x] 홈 대표 가이드 섹션 추가
- [x] 결과 패널 가이드 진입선 추가
- [x] `export:guides` 스크립트 추가
- [x] 가이드/FAQ 산출물 생성
- [x] 테스트 및 lint/build/export 검증
- [x] walkthrough.md 갱신

## 2026-03-20 법령 라이브러리 및 업데이트 로그 1차 구현

- [x] 현재 `High-Quality SaaS` 계획의 라이브러리/로그 범위 재확인
- [x] 법령 라이브러리 데이터 구조 및 화면 방향 정리
- [x] 업데이트 로그 데이터셋 추가
- [x] `LegalLibraryPage` 정식 라우팅 연결
- [x] `UpdateLogPage` 구현
- [x] 홈 신뢰 섹션에 라이브러리/업데이트 진입선 추가
- [x] `App.test.tsx` 내비게이션 테스트 보강
- [x] lint/test/build 검증
- [x] walkthrough.md 갱신

## 2026-03-20 High-Quality SaaS 아키텍처 재설계

- [x] Google 가이드라인 기반 제품 철학 재정의
- [x] 현재 홈/결과/코드사전/법령 구조의 한계 정리
- [x] 정보 우선·광고 후순위 아키텍처 방향 정리
- [x] 결과 화면용 `[전문가 인사이트]` 확장 계획 정의
- [x] `융복합 심의 경로` 자동화 계획 정의
- [x] `연구시설/제조시설 비율 계산기` 계획 정의
- [x] `법적 근거 각주` 자동 생성 계획 정의
- [x] `Interactive Eligibility Map` 계획 정의
- [x] `Pre-Check Audit Report` PDF 계획 정의
- [x] `SEO FAQ / 가이드 페이지` 대량 생성 계획 정의
- [x] `Native Ad`형 연관 서비스 카드 원칙 정의
- [x] `업종코드별 마곡 입주 가이드` 정적 페이지 전략 정의
- [x] `데이터 업데이트 로그`와 `참조 법령 라이브러리` 구조 정의
- [x] 데이터 시각화 및 구조화 정보 계획 정의
- [x] 사용자 승인
- [x] 결과 패널 1차 고도화 구현
- [x] 레이아웃 시뮬레이션 1차 구현
- [x] 법령 라이브러리/업데이트 로그 1차 구현
- [x] 가이드 페이지/라이브러리 구현
- [x] 검색 유입용 정적 페이지 생성 파이프라인 구현
- [x] 문서/검증 반영

## 2026-03-20 제휴 섹션 노출 강도 축소 및 본문 우선 재배치

- [x] 정책 링크 기준 위험 포인트 재정리
- [x] 홈 화면 내 제휴 노출 위치와 강도 재점검
- [x] 구현 계획 문서 반영
- [x] 사이드 배너 제거
- [x] 제휴 섹션 기본 접힘형 구조로 전환
- [x] 제휴 문구와 CTA를 참고용 톤으로 조정
- [x] 테스트 및 빌드 검증
- [x] `walkthrough.md` 갱신

## 2026-03-20 추천 상품 카드 라인 정렬 보정

- [x] 요청 화면과 관련 구현 위치 확인
- [x] 기존 `affiliate` 섹션 레이아웃 구조 분석
- [x] 정렬 깨짐 원인 정리 및 구현 계획 작성
- [x] 사용자 승인
- [x] 카드 헤더/본문/위젯 영역 정렬 보정
- [x] 긴 제목 줄수와 카드 높이 일관화
- [x] 상단 배지/라벨 줄바꿈 정리
- [x] 로딩/에러/빈 상태 영향 여부 재확인
- [x] 테스트 및 빌드 검증
- [x] `walkthrough.md` 갱신

## 2026-03-20 UI 정보 위계 재조정

- [x] `$ui-ux-pro-max` 기준으로 현재 화면 위계 문제 재점검
- [x] 강조할 정보와 힘을 뺄 보조 정보 구분
- [x] 홈 화면 hero/안내/요약 카드 시각 위계 재조정
- [x] 추천 검색 패널의 입력 우선 구조 강화
- [x] 코드 사전 검색 결과의 강조 톤 재조정
- [x] 공통 카드/뱃지 세기 완화
- [x] walkthrough.md 갱신

## 2026-03-20 KSIC 11차 전수 코드 사전 + 쉬운 추천형 검색 개편

- [x] 승인된 구현 계획 재확인
- [x] 현재 전수 입력원(`ksic11.txt`, 지식산업센터 exact CSV, 마곡 허용표) 재점검
- [x] KSIC 11차 5자리 전체 마스터 파서 추가
- [x] `산업시설구역 + 지식산업센터` 전수 verdict 사전 타입/데이터 레이어 구현
- [x] 추천 엔진을 zone 우선 추천형으로 개편
- [x] 홈 화면을 쉬운 검색 중심으로 재구성
- [x] 전용 코드 사전 페이지 구현
- [x] `판정 기준` 영역을 참고용 구조로 축소
- [x] 전수 코드 CSV/XLSX 산출물 생성
- [x] 테스트 확대 및 lint/build/test 재검증
- [x] `walkthrough.md` 갱신

## 현재 단계

- [x] AGENTS 규칙 및 적용 스킬 확인
- [x] 워크스페이스 상태 확인
- [x] 제공된 법령/고시문 분석
- [x] MVP 범위 가정 정리
- [x] 사용자 승인
- [x] 프론트엔드 스캐폴드 구성
- [x] 입주 판정 규칙 데이터 작성
- [x] 판정 엔진 구현
- [x] UI 구현
- [x] 로딩/에러/빈 상태 구현
- [x] 테스트 및 검증
- [x] `docs/codex-brain/walkthrough.md` 작성

## 확인된 사실

- `C:\projects\magok`는 현재 빈 디렉터리다.
- 현재 턴은 AGENTS의 3-Phase Workflow에 따라 PLANNING 단계만 수행한다.
- 제공 자료 기준 대상 단지는 `마곡일반산업단지`다.
- 입주 판정 핵심 근거는 아래 두 문서다.
  - `산업집적활성화 및 공장설립에 관한 법률 시행령(대통령령)(제35943호)(20260102).pdf`
  - `마곡일반산업단지 관리기본계획 고시문(제2025-593, 25.10.30).pdf`
- 관리기본계획상 `산업시설구역`과 `지식산업센터`의 입주 판정 규칙은 비교적 구체적이다.
- `지원시설구역`은 관리기본계획에서 지구단위계획 시행지침을 참조하므로, 세부 자동판정에는 추가 자료가 필요할 수 있다.

## MVP 가정

- 1차 버전은 `마곡 일반산업단지 전용 입주가능판별기`로 만든다.
- 1차 자동판정 범위는 `산업시설구역`과 `지식산업센터`에 집중한다.
- 주소 입력은 받되, 실제 판정은 사용자의 `구역/건물유형` 선택과 `업종/조건` 입력을 기준으로 수행한다.
- 결과 단계는 `가능`, `조건부 가능`, `심의 필요`, `불가`, `정보 부족`으로 나눈다.

## 승인 후 실행 순서

1. React + TypeScript 기반 프론트엔드 기본 구조를 생성한다.
2. 법령/고시문 규칙을 정규화한 데이터셋을 만든다.
3. 판정 엔진과 근거 설명 로직을 구현한다.
4. shadcn/ui 기반 입력 폼과 결과 화면을 구현한다.
5. 테스트 후 `walkthrough.md`를 작성한다.

## 실행 결과

- `Vite + React + TypeScript + Tailwind v4 + Zustand` 기반 MVP를 생성했다.
- 마곡 일반산업단지용 `산업시설구역`, `지식산업센터`, `지원시설구역(수동검토 안내)` 판정 흐름을 구현했다.
- 고시문과 시행령을 기반으로 허용 업종, 심의 필요 조건, 명시적 불가 조건을 데이터로 분리했다.
- 판정 결과에 근거 조항, 판단 이유, 추가 확인 사항을 함께 노출하도록 UI를 구현했다.
- `lint`, `build`, `test`를 모두 통과했다.

---

## 2026-03-16 입주가능업종 코드표 작업

- [x] 사용자 요청 확인
- [x] 제공된 PDF 경로 확인
- [x] PDF 추출 환경 준비
- [x] 마곡 관리기본계획 고시문 입주업종 표 추출
- [x] 시행령 제6조 관련 예외 규정 확인
- [x] 입주가능업종 코드표 작성
- [x] 결과 문서 저장
- [x] walkthrough.md 작성

## 2026-03-16 지식산업센터 정확 업종명 확장

- [x] 기존 접두코드 표 검토
- [x] KSIC 11차 개정 세세분류 5자리 코드 재추출
- [x] 자동 허용 코드의 정확 업종명 매핑
- [x] 조건부 허용/불가/추가확인 코드의 정확 업종명 매핑
- [x] 상세 문서 작성
- [x] walkthrough.md 갱신

## 2026-03-16 엑셀용 산출물 생성

- [x] 엑셀용 열 구조 설계
- [x] `xlsx` 파일 생성
- [x] `csv` 파일 생성
- [x] 시트/행 수 검증
- [x] walkthrough.md 갱신

## 2026-03-17 공장등록 가능 여부 검토

- [x] 마곡 고시문 관련 조항 재확인
- [x] 현행 법령 및 공식 안내 재확인
- [x] 지식산업센터 공장등록 가능 여부 정리
- [x] 메모 문서 작성
- [x] walkthrough.md 갱신

## 2026-03-16 지식산업센터 exact 5자리 로직 반영

- [x] 사용자 정리본 `magok_knowledge_industry_center_exact_5digit_codes.md/csv` 재검토
- [x] CSV 기반 exact 5자리 코드 로더 추가
- [x] 지식산업센터 exact 코드 우선 판정 로직 반영
- [x] `63111 자료 처리업 / 63112 호스팅` 불일치 정정
- [x] 추가 확인 코드와 여객운송 불가 코드 반영
- [x] 테스트 케이스 확장
- [x] lint/build/test 재검증
- [x] walkthrough.md 갱신

## 2026-03-17 자연어 업종 탐색형 GUI 확장

- [x] 사용자 요구사항 재정리
- [x] 기존 폼/스토어/판정 흐름 재검토
- [x] 자연어 업종 탐색 UX 설계 메모 반영
- [x] 업종 추천 데이터셋 및 키워드 사전 구현
- [x] 사업자등록증 텍스트 붙여넣기 파서 구현
- [x] 추천 결과 선택 후 자동 판정 연결
- [x] 기존 수기 입력 폼을 보조 입력 흐름으로 재정리
- [x] 탐색/선택 UI 빈 상태·로딩 상태·결과 상태 구현
- [x] 테스트 케이스 확장
- [x] lint/build/test 재검증
- [x] walkthrough.md 갱신

## 2026-03-17 데스크톱 GUI 패키징 추가

- [x] 데스크톱 앱 방식 검토
- [x] Electron 의존성 설치
- [x] Electron 메인 프로세스 추가
- [x] 웹/데스크톱 실행 스크립트 분리
- [x] Windows portable 빌드 설정 추가
- [x] lint/test/build/desktop build 검증
- [x] walkthrough.md 갱신

## 2026-03-17 데스크톱 검정화면 수정

- [x] 검정화면 재현 원인 확인
- [x] Vite 자산 경로를 상대경로로 수정
- [x] 웹 빌드 재생성
- [x] 테스트 재검증
- [x] `win-unpacked` 산출물 갱신 확인
- [x] walkthrough.md 갱신

## 2026-03-17 GUI 단순화 및 직관성 개선

- [x] 현재 화면의 복잡도 원인 재검토
- [x] 첫 화면 핵심 흐름을 `사업 설명 → 업종 선택 → 결과 확인`으로 재정의
- [x] 메인 레이아웃과 시각 톤 단순화
- [x] 업종 탐색 패널을 한눈에 이해되는 형태로 축소
- [x] 세부 보정 폼을 기본 숨김형 보조 흐름으로 재정리
- [x] 결과 패널의 핵심 메시지 우선 구조 적용
- [x] 테스트 및 빌드 재검증
- [x] walkthrough.md 갱신

## 2026-03-19 마곡 코드찾기 사이트 전면 리브랜딩

- [x] 현재 진입점과 아이맘가이드 소스 공존 구조 확인
- [x] 실사용 앱을 React 기준으로 전면 리브랜딩하기로 방향 확정
- [x] 메인 랜딩 섹션 구조 재설계
- [x] 판별기 섹션을 랜딩 내 핵심 기능으로 재배치
- [x] 보정/법령/신뢰 섹션 재구성
- [x] 메타 정보와 문구 전면 교체
- [x] 테스트 및 빌드 재검증
- [x] walkthrough.md 갱신

## 2026-03-19 실행물 브랜딩 및 레거시 정리 안내

- [x] 데스크톱 앱 브랜딩 정리 범위 확인
- [x] Electron 창 제목과 패키지 메타데이터를 새 브랜드로 변경
- [x] favicon을 마곡 코드찾기 스타일로 교체
- [x] README를 실제 프로젝트 설명 기준으로 전면 갱신
- [x] 레거시 정적 파일 비활성 상태를 문서로 명시
- [x] lint/build/test/desktop build 재검증
- [x] walkthrough.md 갱신

## 2026-03-19 도메인 이전 PDCA 정리

- [x] `imomguide.pages.dev -> loopincode.com` 이전 범위 정의
- [x] Cloudflare Pages 커스텀 도메인 방식 확인
- [x] Search Console 이전 절차 확인
- [x] AdSense 신규 사이트 추가 절차 확인
- [x] GA4 데이터 스트림 URL 변경 가능 여부 확인
- [x] 필수 변경 / 선택 변경 / 유지 가능 항목 분류
- [x] implementation_plan.md 반영
- [x] walkthrough.md 반영

## 2026-03-19 도메인 이전 코드 반영

- [x] 현재 배포 산출물 기준의 SEO/도메인 파일 위치 재확인
- [x] `index.html` canonical 및 소셜 메타를 `loopincode.com` 기준으로 갱신
- [x] `public/robots.txt` 추가
- [x] `public/sitemap.xml` 추가
- [x] `public/ads.txt` 추가
- [x] 루트 `robots.txt`, `sitemap.xml`도 동일 기준으로 정리
- [x] lint/test/build 재검증
- [x] `dist` 산출물 포함 여부 확인
- [x] walkthrough.md 갱신

## 2026-03-19 도메인 이전 운영 체크리스트 작성

- [x] Cloudflare 실무 클릭 경로 정리
- [x] Search Console 실무 클릭 경로 정리
- [x] AdSense 실무 클릭 경로 정리
- [x] GA4 실무 클릭 경로 정리
- [x] 순서형 운영 체크리스트 문서 작성
- [x] walkthrough.md 갱신

## 2026-03-19 Cloudflare Pages 배포 및 이전 준비 상태 점검

- [x] Cloudflare Pages 프로젝트 목록 확인

## 2026-03-20 지식산업센터 코드표 드롭다운 정리

- [x] `사용자 정리 코드표 반영` 영역의 현재 구조 재검토
- [x] exact 코드표 전체 공개용 데이터 형태 추가
- [x] 시행령 1~27호 대응용 검색 키 보강
- [x] 호별 드롭다운 UI 추가
- [x] 입주검토 구분별 전체 코드표 드롭다운 UI 추가
- [x] 검색어 입력 시 관련 드롭다운 자동 개방 처리
- [x] exact 코드표를 `코드 검색 / 전체 탐색` 2모드로 재구성
- [x] 메인 카피와 업종 추천 흐름을 쉬운 문장 중심으로 재정렬
- [x] 테스트 케이스 추가
- [x] lint/test/build 재검증
- [x] walkthrough.md 갱신
- [x] 기존 프로젝트와 연결 도메인 확인
- [x] `dist`를 `imomguide` 프로젝트에 직접 배포
- [x] 새 프로덕션 배포 URL 확인
- [x] `loopincode.com` 반영 여부 확인
- [x] `imomguide.pages.dev` 리다이렉트 상태 확인
- [x] 남은 수동 작업 정리
- [x] walkthrough.md 갱신

## 2026-03-19 GitHub 원격 저장소 교체 및 Git 배포 안정화

- [x] 원격 저장소 `ambush0421/imomguide` 기본 브랜치 상태 확인
- [x] 원격 저장소 작업본 별도 클론
- [x] 기존 `아이맘가이드` 정적 구조를 현재 `마곡 코드찾기` 프로젝트로 교체
- [x] 원격 저장소 작업본 기준 `lint/test/build` 검증
- [x] `codex/magok-site-replace` 브랜치 생성 및 푸시
- [x] Cloudflare Preview 배포 실패 원인 확인
- [x] prebuilt `dist` 추적으로 Git 배포 호환성 보정
- [x] Preview 배포 `Active` 확인
- [x] 동일 커밋을 `main`에 반영
- [x] Cloudflare Production 배포 `Active` 확인
- [x] walkthrough.md 갱신

## 2026-03-19 AdSense 사이트 검토 코드 반영

- [x] 현재 `loopincode.com`의 AdSense 관련 태그 상태 확인
- [x] AdSense 공식 가이드 기준 검토 필요 코드 확인
- [x] 동일 publisher ID 재사용 가능 여부 판단
- [x] `index.html`에 `google-adsense-account` meta 추가
- [x] `index.html`에 AdSense script 추가
- [x] `ads.txt` 유지 여부 확인
- [x] build/test 재검증
- [x] GitHub 원격 `main`에 반영
- [x] Cloudflare Production 반영 확인
- [x] walkthrough.md 갱신

## 2026-03-19 UI/UX 단순화 및 섹션 구조 업그레이드

- [x] 적용 스킬 재확인 (`pdca`, `ui-ux-pro-max`, `frontend-ui-ux-engineer`)
- [x] 현재 랜딩/핵심 패널 복잡도 원인 재분석
- [x] 섹션 구조를 `소개 / 사용 흐름 / 코드 찾기 / 판정 기준` 중심으로 재설계
- [x] 다크 글래스 위주의 시각 톤을 밝고 단정한 형태로 재정리
- [x] 업종 탐색 패널을 더 짧고 직관적인 입력 흐름으로 단순화
- [x] 결과 패널을 핵심 결과 우선 구조로 재정리
- [x] 세부 보정 폼을 보조 흐름으로 더 가볍게 정리
- [x] lint/test/build 재검증
- [x] 원격 저장소 동기화
- [x] Git 커밋 및 푸시
- [x] walkthrough.md 갱신

## 2026-03-19 기준 탭 내부 스크롤 제거

- [x] 사용자 제보 HTML 기준 문제 구간 확인
- [x] `rulebook-tabs` 내부 `ScrollArea + max-height` 구조 원인 확인
- [x] 탭 콘텐츠를 페이지 자연 스크롤 구조로 변경
- [x] 탭 버튼의 좁은 화면 줄바꿈 대응
- [x] build/test 재검증
- [x] 원격 저장소 반영
- [x] walkthrough.md 갱신

## 2026-03-19 기준 탭 검색 최적화 및 AdSense 403 정리

- [x] 기준 탭 추가 단순화 방향 결정
- [x] 긴 규칙 목록을 검색형 필터 구조로 재설계
- [x] 모바일 탭 버튼 및 카드 간격 재조정
- [x] AdSense 403 원인 후보를 로컬 코드와 공식 가이드 기준으로 재확인
- [x] 검토 단계용 `meta + ads.txt` 유지 전략으로 정리
- [x] lint/test/build 재검증
- [x] 원격 저장소 반영
- [x] walkthrough.md 갱신

## 2026-03-19 쿠팡 파트너스 최종승인 준비 섹션 추가

- [x] 쿠팡 공식 가이드 PDF의 최종승인 핵심 항목 확인
- [x] 활동 페이지 등록/스크린샷/대가성 문구 기준 추출
- [x] 사이트 내 승인 준비 안내 섹션 설계
- [x] 웹 UI 반영
- [x] lint/test/build 재검증
- [x] 원격 저장소 반영
- [x] walkthrough.md 갱신

## 2026-03-19 쿠팡 최종승인용 푸터 및 제출 문안 보강

- [x] 승인용 푸터에 필요한 정보 구조 재정리
- [x] `운영자 정보 / 문의 안내 / 쿠팡 파트너스 안내` 푸터 카드 추가
- [x] 공개 문의 채널 미확정 상태를 안내 문구로 정리
- [x] 쿠팡 제출용 스크린샷 체크리스트 문서 작성
- [x] 활동 페이지 등록 문안 초안 작성
- [x] 실배포 응답에서 쿠팡 섹션 문자열 포함 여부 확인
- [x] `loopincode.com`, `imomguide.pages.dev` HTML 응답 점검
- [x] lint/test/build 재검증
- [x] 원격 저장소 반영
- [x] walkthrough.md 갱신

## 2026-03-19 문의 이메일 실반영

- [x] 사용자 제공 이메일 확인
- [x] 푸터 `문의 안내` 카드에 실제 이메일 반영
- [x] 쿠팡 제출 체크리스트 문서에 실제 이메일 반영
- [x] 렌더 테스트 문구 갱신
- [x] 원격 저장소 반영
- [x] walkthrough.md 갱신

## 2026-03-19 지식산업센터 입주검토용 표 및 CSV/사이트 반영

- [x] 시행령 제6조제2항 1호~27호와 KSIC 11차 대조 검토
- [x] 누락되기 쉬운 기관요건/이러닝/관리기관 인정 항목 식별
- [x] `magok_knowledge_industry_center_allowed_codes.md`를 입주검토용 표 형태로 갱신
- [x] `magok_knowledge_industry_center_exact_5digit_codes.csv`를 최신 검토 결과로 보강
- [x] 사이트 기준 탭에 입주검토용 표 반영
- [x] lint/test/build 재검증
- [x] walkthrough.md 갱신

## 2026-03-19 레퍼런스 PDF 최종 반영 및 업종코드 분석기 완료

- [x] 사용자 제공 레퍼런스 PDF 기준으로 마곡 고시문·시행령·KSIC 11차 재대조
- [x] `73905`, `73909` 등 관리기관 인정 업종의 추가 확인 로직 보강
- [x] `연구소(2호)`, `기관·단체(3호)`, `이러닝업(26호)`, `관리기관 인정 업종(27호)` 수동 분류 반영
- [x] 폼 선택지와 판정 메시지 정리
- [x] evaluator 테스트 확장
- [x] lint/test/build 재검증
- [x] Cloudflare Pages 재배포
- [x] walkthrough.md 갱신

## 2026-03-19 업종코드 상세 해설 화면 반영

- [x] 결과 화면에서 현재 선택 코드의 상세 해설 노출 방식 설계
- [x] 조문 매칭, exact 5자리, 수동 법령 분류를 합친 화면용 인사이트 헬퍼 추가
- [x] 결과 패널에 `업종코드 상세 해설` 카드 반영
- [x] 화면 테스트 추가
- [x] lint/test/build 재검증
- [x] Cloudflare Pages 재배포
- [x] walkthrough.md 갱신

## 2026-03-19 블루 테마 UI/UX 개편

- [x] 현재 주황 기반 색 토큰과 하드코딩 범위 확인
- [x] 전역 색상 변수와 배경 그라데이션을 푸른 계열로 변경
- [x] 버튼·배지·셀렉트·비동기 상태 컴포넌트의 브랜드 톤 정리
- [x] 랜딩/판정/기준 탭 주요 카드와 인포 박스의 색감 정리
- [x] lint/test/build 재검증
- [x] Cloudflare Pages 재배포
- [x] walkthrough.md 갱신

## 2026-03-19 쿠팡 제출용 캡처 구도 및 문안 최종본 정리

- [x] 기존 쿠팡 제출 체크리스트 문서 재검토
- [x] 승인 스크린샷 전제 조건 정리
- [x] PC 캡처 구도 정리
- [x] 모바일 캡처 구도 정리
- [x] 활동 페이지 등록 문안 최종본 작성
- [x] 스크린샷 첨부 설명 문안 작성
- [x] 최종승인 요청 메모 문안 작성
- [x] 짧은 버전 문안 작성
- [x] walkthrough.md 갱신

## 2026-03-19 승인용 제휴영역 섹션 추가

- [x] 기존 랜딩 내 쿠팡 안내 섹션 위치 검토
- [x] 승인용 제휴영역 UI 구조 설계
- [x] 링크 카드 자리와 배너 자리 플레이스홀더 추가
- [x] 같은 화면 내 대가성 문구와 문의 정보 배치
- [x] 캡처 리허설 카드 추가
- [x] 문서에 새 제휴영역 기준 캡처 설명 반영
- [x] lint/test/build 재검증
- [x] 원격 저장소 반영
- [x] walkthrough.md 갱신

## 2026-03-19 단계형 위저드 전환

- [x] 기존 `finder` 병렬 레이아웃과 직접 수정 섹션 구조 재확인
- [x] `discover / adjust / result` 3단계 상태를 store에 추가
- [x] 추천 업종 선택 시 자동으로 2단계로 이동하도록 전환
- [x] 별도 `직접 수정` 블록을 2단계 안으로 흡수
- [x] 3단계 결과 화면에 `조건 다시 수정` 복귀 흐름 추가
- [x] 위저드 스텝바와 단계 카드 UI 반영
- [x] App 통합 테스트를 단계형 흐름 기준으로 갱신
- [x] store 전이 규칙 테스트 추가
- [x] lint/test/build 재검증
- [x] Cloudflare Pages 재배포
- [x] walkthrough.md 갱신

## 2026-03-19 경영컨설팅 검색 누락 보정

- [x] `경영컨설팅업(71531)` 검색 누락 원인 확인
- [x] exact 5자리 CSV에 `71531 경영 컨설팅업` 반영
- [x] 자연어 추천 사전에 `경영컨설팅` 계열 별칭 추가
- [x] 검색 테스트와 판정 테스트 추가
- [x] lint/test/build 재검증
- [x] Cloudflare Pages 재배포
- [x] walkthrough.md 갱신

## 2026-03-19 실무 검색어 누락 전수 점검

- [x] 지식산업 1~27호 exact 단일 코드와 검색 사전 대조
- [x] 공식명과 실무 검색어가 다른 exact 코드 추가 식별
- [x] `71391`, `75994`, `59120`, `59201`, `73903`, `73904`, `76400` 검색 별칭 보강
- [x] 단일 exact 코드 검색 사전 누락 0건 재확인
- [x] 검색 테스트 확장
- [x] lint/test/build 재검증
- [x] walkthrough.md 갱신

## 2026-03-19 범위형 업종 실무 검색어 확장

- [x] `58`, `70`, `72`, `85` 범위형 업종의 대표 exact 코드 후보 재정리
- [x] KSIC 11차 로컬 텍스트 기준으로 대표 코드명 재확인
- [x] 연구개발·출판·엔지니어링·교육서비스 실무 검색어 preset 확장
- [x] 교육서비스 code-only uncertain + 수동 법령 분류 결합 시 조건부 검토 흐름 보강
- [x] 검색 테스트와 판정 테스트 확장
- [x] lint/test/build 재검증
- [x] Cloudflare Pages 재배포
- [x] walkthrough.md 갱신

## 2026-03-19 쿠팡 실제 링크·배너·위젯 반영

- [x] 사용자 제공 쿠팡 파트너스 링크 2개, 배너 1개, iframe 위젯 1개 확인
- [x] 승인용 제휴영역 플레이스홀더를 실제 제휴 요소로 교체
- [x] 대가성 문구와 문의 이메일이 같은 섹션 안에 보이도록 유지
- [x] App 테스트를 실제 링크/배너/위젯 기준으로 보강
- [x] 쿠팡 제출 체크리스트 문서에 현재 실반영 요소 명시
- [x] lint/test/build 재검증
- [x] 원격 저장소 반영
- [x] Cloudflare Pages 재배포
- [x] walkthrough.md 갱신

## 2026-03-19 실서비스형 쿠팡 노출 축소

- [x] 현재 승인용 설명 섹션과 실서비스 UX 충돌 지점 확인
- [x] `최종승인 준비`, `권장 문구`, `캡처 리허설` 설명 제거 방향 결정
- [x] 제휴영역을 `추천 상품` 중심의 작은 사용자용 섹션으로 축소
- [x] 푸터를 운영/문의/활동 페이지 중심의 간결한 정보로 정리
- [x] lint/test/build 재검증
- [x] 원격 저장소 반영
- [x] Cloudflare Pages 재배포
- [x] walkthrough.md 갱신

## 2026-03-19 AdSense 스크립트 및 좌우 고정 배너 반영

- [x] 현재 meta/ads.txt/script 상태 재확인
- [x] `index.html`에 AdSense async script 1회 추가
- [x] `2xl` 이상에서만 보이는 좌우 고정 쿠팡 배너 추가
- [x] 메인 제휴 섹션과 충돌하지 않도록 작은 화면 숨김 처리
- [x] lint/test/build 재검증
- [x] 원격 저장소 반영
- [x] Cloudflare Pages 재배포
- [x] walkthrough.md 갱신

## 2026-03-19 업종 누락 재점검 및 상단 섹션 높이 정렬

- [x] 지식산업 리뷰표 단일 5자리 코드와 검색 preset 재대조
- [x] 범위형 업종 대표 코드 샘플과 검색 preset 재대조
- [x] 상단 히어로 2열 섹션 높이 정렬 수정
- [x] lint/test/build 재검증
- [x] Cloudflare Pages 재배포
- [x] walkthrough.md 갱신

## 2026-03-19 지식산업센터 기본값 조정

- [x] 현재 기본 구역 값이 잡히는 스토어 위치 확인
- [x] 기본값을 `지식산업센터`로 변경
- [x] 초기 렌더링 테스트에 기본값 노출 검증 추가
- [x] lint/test/build 재검증
- [x] 원격 저장소 반영
- [x] Cloudflare Pages 재배포
- [x] walkthrough.md 갱신

## 2026-03-19 쿠팡 사이드 배너 다이나믹 배너 전환

- [x] 사용자 제공 다이나믹 배너 태그 설정값 확인
- [x] 정적 사이드 배너를 다이나믹 배너 컴포넌트로 교체
- [x] 쿠팡 `g.js` 중복 로드 없이 재사용되도록 구성
- [x] 테스트를 다이나믹 배너 래퍼 기준으로 보강
- [x] lint/test/build 재검증
- [x] 원격 저장소 반영
- [x] Cloudflare Pages 재배포
- [x] walkthrough.md 갱신

## 2026-03-19 쿠팡 추천 위젯 3종 배치

- [x] 사용자 제공 iframe 위젯 3개 확인
- [x] 본문 추천 상품 영역을 3개 위젯 카드 그리드로 재배치
- [x] 테스트를 새 위젯 3개 기준으로 갱신
- [x] lint/test/build 재검증
- [x] 원격 저장소 반영
- [x] Cloudflare Pages 재배포
- [x] walkthrough.md 갱신

## 2026-03-19 쿠팡 사이드 배너 여백 재배치

- [x] 현재 사이드 배너 겹침/클리핑 원인 확인
- [x] 사이드 배너 래퍼의 흰 박스 스타일 제거
- [x] 콘텐츠 좌우 빈 여백 기준의 `calc()` 위치로 이동
- [x] Tailwind 임의 좌표 클래스를 inline style 좌표로 교체
- [x] 충분한 폭에서만 보이도록 노출 breakpoint 상향
- [x] lint/test/build 재검증
- [x] 원격 저장소 반영
- [x] Cloudflare Pages 재배포
- [x] walkthrough.md 갱신

## 2026-03-19 쿠팡 사이드 배너 미노출 보정

- [x] 사용자 화면 기준 미노출 원인 재확인
- [x] 사이드 배너 노출 breakpoint를 더 현실적인 데스크톱 폭으로 완화
- [x] 콘텐츠 여백 좌표를 더 안쪽으로 보정
- [x] lint/test/build 재검증
- [x] 원격 저장소 반영
- [x] Cloudflare Pages 재배포
- [x] walkthrough.md 갱신

## 2026-03-19 쿠팡 사이드 배너 안정화

- [x] 다이나믹 사이드 배너의 비정상 렌더링 원인 정리
- [x] 좌우 사이드 배너를 정적 160x600 배너 방식으로 전환
- [x] 콘텐츠 좌우 여백 고정 구조는 유지
- [x] lint/test/build 재검증
- [x] 원격 저장소 반영
- [x] Cloudflare Pages 재배포
- [x] walkthrough.md 갱신

## 2026-03-19 쿠팡 사이드 배너 iframe 재전환

- [x] 사용자 제공 `widgets.html` iframe 태그 확인
- [x] 좌우 사이드 배너를 쿠팡 iframe 위젯 방식으로 교체
- [x] 콘텐츠 좌우 여백 고정 구조 유지
- [x] lint/test/build 재검증
- [x] 원격 저장소 반영
- [x] Cloudflare Pages 재배포
- [x] walkthrough.md 갱신

## 2026-03-19 제휴 섹션 사용자 문구 정리

- [x] 운영자 설명처럼 보이는 제휴 문구 식별
- [x] 버튼/설명/위젯 상단 문구를 사용자 중심으로 단순화
- [x] 대가성 고지는 유지하고 표현을 더 명확하게 조정
- [x] 테스트 기대값 갱신
- [x] lint/test/build 재검증
- [x] 원격 저장소 반영
- [x] Cloudflare Pages 재배포
- [x] walkthrough.md 갱신

## 2026-03-19 제휴 섹션 UI/UX 보강

- [x] 제휴 섹션의 아쉬운 밀도와 위계 문제 재확인
- [x] 생수 위젯 `clX3qg` 복구
- [x] 추천 맥락이 드러나는 카드형 레이아웃으로 재구성
- [x] 테스트 기대값 갱신
- [x] lint/test/build 재검증
- [x] 원격 저장소 반영
- [x] Cloudflare Pages 재배포
- [x] walkthrough.md 갱신

## 2026-03-19 제휴 섹션 4카드 재배치

- [x] 핸드폰 위젯이 빠진 원인 재확인
- [x] `clX5tE` 모바일기기 위젯 복구
- [x] 제휴 섹션을 4카드 그리드 중심으로 재구성
- [x] 테스트 기대값 갱신
- [x] lint/test/build 재검증
- [x] 원격 저장소 반영
- [x] Cloudflare Pages 재배포
- [x] walkthrough.md 갱신

## 2026-03-19 제휴 섹션 사이드 보드 재구성

- [x] 왼쪽 설명 영역 과대 비중 문제 재확인
- [x] 왼쪽 안내를 컴팩트 카드로 축소
- [x] 오른쪽 추천 영역을 2열 사이드 보드 형태로 재정렬
- [x] 테스트 기대값 갱신
- [x] lint/test/build 재검증
- [x] 원격 저장소 반영
- [x] Cloudflare Pages 재배포
- [x] walkthrough.md 갱신

## 2026-03-19 제휴 보드 고도화

- [x] 현재 사이드 보드의 응집력 부족 재확인
- [x] 왼쪽 안내 카드에 체크리스트형 메모 추가
- [x] 오른쪽 카드를 가로 정보 + 세로 위젯 조합으로 재설계
- [x] 테스트 유지 확인
- [x] lint/test/build 재검증
- [x] 원격 저장소 반영
- [x] Cloudflare Pages 재배포
- [x] walkthrough.md 갱신

## 2026-03-19 loopincode 전용 소스 정리

- [x] 현재 엔트리 기준으로 미사용 정적 소스와 유지 대상 분류
- [x] 예전 `imomguide` 정적 HTML/JS/CSS와 임시 파일 제거
- [x] 루트 중복 정적 파일과 추적 중인 `dist` 정리
- [x] `.gitignore`, `README.md`를 현재 구조 기준으로 정리
- [x] lint/test/build 재검증
- [x] walkthrough.md 갱신

## 2026-03-21 홈 전환 카피·시각 위계 개선

- [x] 현재 홈 히어로와 반복 단계 안내 구조 재확인
- [x] `implementation_plan.md`에 이번 루프 구현 계획 추가
- [x] 히어로를 혜택 중심 헤드라인/서브 문장/CTA로 재작성
- [x] 상단 우측 보조 영역을 `가치 + 신뢰` 카드로 재구성
- [x] 단계 설명 정본과 법령/업데이트 섹션 카피 재정리
- [x] `App.test.tsx` 기대값 갱신
- [x] lint/test/build 재검증
- [x] walkthrough.md 갱신

## 2026-03-21 컨설턴트/중개사 우선 홈 재정렬

- [x] 홈 상단 네비를 `입주 예비판정 안내` 중심 구조로 재정렬
- [x] 히어로를 상담용 카피 + CTA 설명 + 빠른 검색 카드 조합으로 재구성
- [x] 히어로 아래 3단계 요약과 `실무에서는 보통 이렇게 봅니다` 역할 분리
- [x] `finder` 영역을 예비판정 워크스페이스 톤으로 슬림화
- [x] `전체 코드 사전`, 법령 참고, 라이브러리, 업데이트 로그 카피 재맥락화
- [x] 대표 업종 가이드, 제휴 링크, 푸터 보강 문구 반영
- [x] `App.test.tsx` 상호작용/카피 기대값 갱신 확인
- [x] lint/test/build 재검증
- [x] walkthrough.md 갱신

## 2026-03-21 홈 디테일 정리 1차

- [x] 대표 업종 가이드 요약 문장의 조사 오탈자 원인 수정
- [x] 상단 네비와 헤더 CTA 텍스트를 한 줄 중심으로 축약
- [x] 히어로 타이틀 줄바꿈과 배지 강조 위계 보정
- [x] 빠른 검색 textarea 높이 축소와 비활성화 힌트 추가
- [x] CTA/3단계 카드 높이와 배경 대비 정리
- [x] 예비판정 단계 잠금 상태에 `검색 후 활성화` 힌트 추가
- [x] 법령 참고 중복 설명을 `업종별 허용 코드 목록` 기준으로 정리
- [x] 테스트 기대값 갱신
- [x] lint/test/build 재검증
- [x] walkthrough.md 갱신

## 2026-03-21 워크스페이스 시작 구조 정리

- [x] 탭 위 `이렇게 시작하세요` 안내 박스 분리
- [x] 잠긴 2·3단계에 잠금 아이콘과 `검색 후 활성화` 힌트 강화
- [x] 1단계 카드 내부 가이드를 중립적인 결과 대기 안내로 축소
- [x] 테스트 기대값 갱신
- [x] lint/test/build 재검증
- [x] walkthrough.md 갱신

## 2026-03-21 결과 공유/저장 기능

- [x] 결과 패널·해시 라우팅·상태 직렬화 구조 재확인
- [x] `implementation_plan.md`에 이번 루프 구현 계획 추가
- [x] 공유 링크 생성/복원 + 결과 요약 복사 + 인쇄/PDF 저장 UI 구현
- [x] 테스트 기대값 갱신
- [x] lint/test/build 재검증
- [x] walkthrough.md 갱신

## 2026-03-21 두 구역 동시 비교 판정

- [x] 2단계 설정 화면·store·result panel 구조 재확인
- [x] `implementation_plan.md`에 이번 루프 구현 계획 추가
- [x] 두 구역 동시 비교 토글 + 결과 비교 패널 구현
- [x] 공유/복사/인쇄 흐름을 비교 모드까지 확장
- [x] 테스트 기대값 갱신
- [x] lint/test/build 재검증
- [x] walkthrough.md 갱신

## 2026-03-21 최근 조회 히스토리

- [x] 현재 공유 해시 복원 구조와 헤더 UI 삽입 지점 재확인
- [x] `implementation_plan.md`에 이번 루프 구현 계획 추가
- [x] 로컬스토리지 기반 최근 조회 저장/불러오기 레이어 구현
- [x] 헤더 드롭다운형 최근 조회 목록과 복원 액션 연결
- [x] 테스트 기대값 갱신
- [x] lint/test/build 재검증
- [x] walkthrough.md 갱신

## 2026-03-21 추천 결과 더 보기

- [x] 추천 엔진 slice 지점과 추천 결과 패널 구조 재확인
- [x] `implementation_plan.md`에 이번 루프 구현 계획 추가
- [x] 추천 엔진 반환 개수 확장 및 UI 기본 3개 노출/더 보기 구현
- [x] 관련 테스트 갱신
- [x] lint/test/build 재검증
- [x] walkthrough.md 갱신

## 2026-03-21 예외 조건 스마트 필터

- [x] 2단계 조건 토글의 현재 노출 구조와 플래그 사용처 재확인
- [x] `implementation_plan.md`에 이번 루프 구현 계획 추가
- [x] 추천 조건 우선 노출 + 전체 조건 펼치기 UX 구현
- [x] 현재 코드/업종명 기반 관련 조건 추천 규칙 추가
- [x] 관련 테스트 갱신
- [x] lint/test/build 재검증
- [x] walkthrough.md 갱신

## 2026-03-21 법적 근거 각주 직링크

- [x] 결과 각주와 법령 라이브러리의 현재 구조 재확인
- [x] `implementation_plan.md`에 이번 루프 구현 계획 추가
- [x] 각주/출처 카드에서 라이브러리 해당 문서·근거로 이동하는 액션 구현
- [x] 라이브러리 페이지 대상 카드 스크롤/강조 처리 추가
- [x] 관련 테스트 갱신
- [x] lint/test/build 재검증
- [x] walkthrough.md 갱신

## 2026-03-21 퍼널 이벤트 계측

- [x] 현재 코드베이스의 분석 도구 유무와 삽입 지점 재확인
- [x] `implementation_plan.md`에 이번 루프 구현 계획 추가
- [x] 벤더 종속 없는 analytics 유틸 추가
- [x] 검색/추천/판정/공유/라이브러리 이동 핵심 이벤트 계측 연결
- [x] 관련 테스트 갱신
- [x] lint/test/build 재검증
- [x] walkthrough.md 갱신

## 2026-03-21 추천 결과 그룹핑

- [x] 추천 결과 패널의 current exact/related 구조와 더 보기 흐름 재확인
- [x] `implementation_plan.md`에 이번 루프 구현 계획 추가
- [x] 추천 결과를 `먼저 볼 / 함께 확인 / 주의해서 볼` 그룹으로 재구성
- [x] 상태 카드와 보조 안내 문구를 그룹 기준에 맞게 정리
- [x] 관련 테스트 갱신
- [x] lint/test/build 재검증
- [x] walkthrough.md 갱신

## 2026-03-21 추천 결과 빠른 필터

- [x] 추천 결과 그룹과 현재 구역 verdict 구조 재확인
- [x] `implementation_plan.md`에 이번 루프 구현 계획 추가
- [x] `전체 후보 / 바로 검토 가능 / 주의 후보만` 필터 UI 추가
- [x] 그룹 섹션과 필터 결과 empty state 연동
- [x] 관련 테스트 갱신
- [x] lint/test/build 재검증
- [x] walkthrough.md 갱신

## 2026-03-21 로고/파비콘 L 심볼 리프레시

- [x] 현재 브랜드 자산 연결 지점과 기존 SVG 구조 재확인
- [x] `implementation_plan.md`에 이번 루프 구현 계획 추가
- [x] `L + 돋보기` 방향의 새 심볼 SVG 생성
- [x] favicon/심볼/워드마크/일러스트 자산 교체
- [x] 오래된 미완료 task 폐기 상태 반영
- [x] lint/test/build 재검증
- [x] walkthrough.md 갱신

## 2026-03-21 파비콘 파생 아이콘 정리

- [x] SVG favicon 기준 PNG/ICO/apple-touch 파생본 생성
- [x] `implementation_plan.md`에 이번 루프 구현 계획 추가
- [x] `index.html`에 favicon/apple-touch 링크 정리
- [x] 파생본 생성 결과와 경로 재확인
- [x] lint/test/build 재검증
- [x] walkthrough.md 갱신

## 2026-03-21 데스크톱 히어로 헤드라인 줄바꿈 보정

- [x] 데스크톱 히어로 H1 잘림 원인 재확인
- [x] `implementation_plan.md`에 이번 루프 구현 계획 추가
- [x] 문제 클래스 제거 및 줄바꿈 보정
- [x] lint/test/build 재검증
- [x] walkthrough.md 갱신
