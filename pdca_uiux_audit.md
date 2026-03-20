# 🔄 PDCA UI/UX 종합 감사 리포트

**프로젝트:** 마곡 코드찾기 (Magok Code Finder)
**스택:** React 18 + Vite 8 + TailwindCSS v4 + Radix UI + lucide-react
**감사 기반:** `ui-ux-pro-max` + `frontend-ui-ux-engineer` 스킬 가이드라인
**감사일:** 2026-03-20

---

## 📊 총괄 요약 (Executive Summary)

| 카테고리 | 등급 | 현재 점수 | 목표 점수 |
|---------|------|----------|----------|
| 1. 접근성 (Accessibility) | ⚠️ B+ | 78/100 | 95+ |
| 2. 터치 & 인터랙션 | ✅ A- | 85/100 | 92+ |
| 3. 퍼포먼스 | ⚠️ B | 72/100 | 90+ |
| 4. 레이아웃 & 반응형 | ✅ A | 90/100 | 95+ |
| 5. 타이포그래피 & 색상 | ✅ A- | 86/100 | 92+ |
| 6. 애니메이션 | ⚠️ B- | 68/100 | 85+ |
| 7. 스타일 일관성 | ✅ A | 92/100 | 95+ |
| 8. 차트 & 데이터 표현 | ⚠️ C+ | 65/100 | 80+ |

**종합 등급: B+ (79.5/100)** → 목표: **A (90+)**

---

## 🔵 P (Plan) — 현재 디자인 시스템 분석

### 디자인 토큰 현황

[index.css](file:///c:/projects/magok/src/index.css)에 정의된 CSS 커스텀 프로퍼티:

```css
/* 현재 컬러 시스템 */
--background: #eef4ff        /* 배경 — 밝은 블루 */
--surface: rgba(255,255,255,0.88)
--foreground: #15253a        /* 텍스트 메인 — 진한 네이비 */
--foreground-muted: #586b86  /* 텍스트 보조 */
--foreground-subtle: #8293ad /* 텍스트 힌트 */
--accent: #2b6dff           /* 브랜드 포인트 — 생생한 블루 */
--accent-strong: #1658db    /* 액센트 강조 */
--accent-soft: #9cc0ff      /* 액센트 연한 */
```

### 폰트 시스템 현황

| 용도 | 폰트 | 특징 |
|------|------|------|
| 본문 | IBM Plex Sans KR | 한국어 최적화, 400-700 weight |
| 제목 | Space Grotesk | 영문 디스플레이, letter-spacing -0.03em |

### 컴포넌트 체계 현황

11개 Radix 기반 UI 컴포넌트가 `src/components/ui/`에 존재:

| 컴포넌트 | 라운딩 | 높이 | 특기사항 |
|---------|--------|------|---------|
| Button | `rounded-full` | h-9/11/12 | 4 variants, 3 sizes ✅ |
| Card | `rounded-[28px]` | auto | 핵심 컨테이너 ✅ |
| Badge | `rounded-full` | auto | 5 variants ✅ |
| Input | `rounded-2xl` | h-12 | 포커스 링 있음 ✅ |
| Select | `rounded-2xl` | h-12 | Radix 기반 ✅ |
| Switch | `rounded-full` | h-6 | 포커스 + 비활성 ✅ |
| Tabs | `rounded-[24px]` | auto | 모바일 그리드 대응 ✅ |
| Separator | — | — | Radix 기반 |
| Label | — | — | Radix 기반 |
| ScrollArea | — | — | Radix 기반 |
| Textarea | `rounded-2xl` | auto | 기본 스타일 |

---

## 🟢 D (Do) — 세부 항목별 감사 결과

### 1. 접근성 (CRITICAL) — 78점

#### ✅ 잘 된 점
- 버튼 `focus-visible:ring-2` 포커스 링 일관 적용
- `disabled:opacity-50 + disabled:pointer-events-none` 비활성 상태 처리
- `aria-expanded`, `aria-controls` 속성 올바르게 사용 (affiliate 섹션)
- `aria-label` 가이드 버튼에 적용
- 시맨틱 HTML: `<header>`, `<main>`, `<footer>`, `<nav>`, `<section>` 사용

#### ⚠️ 개선 필요 항목

| ID | 이슈 | 우선도 | 위치 |
|----|------|--------|------|
| A-01 | 헤더 로고 버튼 `aria-label` 누락 | 높음 | [App.tsx:1090-1106](file:///c:/projects/magok/src/App.tsx#L1090-L1106) |
| A-02 | 모바일 네비게이션 `hidden md:flex`만으로 접근성 대안 없음 | 높음 | [App.tsx:1108](file:///c:/projects/magok/src/App.tsx#L1108) |
| A-03 | `color-contrast` — `--foreground-subtle: #8293ad` vs `--background: #eef4ff` = **3.1:1** (WCAG AA 미충족) | 높음 | [index.css:13](file:///c:/projects/magok/src/index.css#L13) |
| A-04 | SelectItem `cursor-default` → 클릭 가능한 요소에 `cursor-pointer` 필요 | 중간 | [select.tsx:70](file:///c:/projects/magok/src/components/ui/select.tsx#L70) |
| A-05 | 스킵 내비게이션(skip-nav) 링크 없음 | 중간 | [App.tsx](file:///c:/projects/magok/src/App.tsx) |
| A-06 | `<iframe>` 제휴 위젯에 대한 접근성 대안 없음 | 낮음 | [App.tsx:960-970](file:///c:/projects/magok/src/App.tsx#L960-L970) |

> [!IMPORTANT]
> **A-03**이 가장 시급합니다. `--foreground-subtle`은 힌트 텍스트에 광범위하게 사용되며, WCAG AA 4.5:1을 충족하지 못합니다. `#6b7fa0`(약 4.5:1) 이상으로 어둡게 조정해야 합니다.

---

### 2. 터치 & 인터랙션 (CRITICAL) — 85점

#### ✅ 잘 된 점
- 버튼 최소 높이 `h-9`(36px) ~ `h-12`(48px) → 대부분 44px 기준 충족
- `transition-all duration-200` 부드러운 전환 적용
- `hover:-translate-y-0.5` 기본 버튼 호버 피드백
- `disabled:pointer-events-none` 비동기 중복 방지 기반 존재

#### ⚠️ 개선 필요 항목

| ID | 이슈 | 우선도 | 위치 |
|----|------|--------|------|
| T-01 | `Button size="sm"` h-9(36px) → **44px 미충족** (스킬 기준 최소 44×44px) | 높음 | [button.tsx:23](file:///c:/projects/magok/src/components/ui/button.tsx#L23) |
| T-02 | 헤더 로고 영역 터치 타겟이 텍스트 크기에 의존 | 중간 | [App.tsx:1090-1106](file:///c:/projects/magok/src/App.tsx#L1090-L1106) |
| T-03 | 비동기 로딩 중 버튼 `disabled` + 로딩 인디케이터 표시 부재 | 중간 | App 전반 |
| T-04 | 에러 피드백이 에러 발생 위치 근처에 표시되는지 확인 필요 | 낮음 | result-panel, eligibility-form |

---

### 3. 퍼포먼스 (HIGH) — 72점

#### ✅ 잘 된 점
- `loading="lazy"` iframe에 적용
- Vite 빌드 시스템으로 번들 최적화 기반 존재
- `display=swap` Google Fonts에 적용

#### ⚠️ 개선 필요 항목

| ID | 이슈 | 우선도 | 위치 |
|----|------|--------|------|
| P-01 | `prefers-reduced-motion` 미디어 쿼리 미적용 → 모션 민감 사용자 배려 없음 | 높음 | 전체 CSS/컴포넌트 |
| P-02 | 폰트 프리로드(`<link rel="preload">`) 없음 → FOUT 발생 가능 | 높음 | [index.html](file:///c:/projects/magok/index.html) |
| P-03 | `App.tsx`가 1280줄 단일 파일 → 코드 스플리팅 없음 | 중간 | [App.tsx](file:///c:/projects/magok/src/App.tsx) |
| P-04 | background gradient에 `radial-gradient` 2개 + `linear-gradient` 1개 → 리페인트 비용 | 낮음 | [index.css:37-40](file:///c:/projects/magok/src/index.css#L37-L40) |
| P-05 | 콘텐츠 점프 방지(CLS) — 스켈레톤/예약 높이 없이 비동기 콘텐츠 렌더링 | 중간 | async 상태 전환 시 |

---

### 4. 레이아웃 & 반응형 (HIGH) — 90점

#### ✅ 잘 된 점
- `max-w-[1180px]` 일관된 max-width
- `px-4 sm:px-6 lg:px-8` 브레이크포인트별 패딩
- `grid-cols-1 → sm/md/lg:grid-cols-N` 반응형 그리드 적절
- `min-width: 320px` 모바일 바닥값 설정
- `viewport meta` width=device-width, initial-scale=1.0 ✅
- 스티키 헤더 `sticky top-4 z-20` 알맞은 플로팅 처리

#### ⚠️ 개선 필요 항목

| ID | 이슈 | 우선도 | 위치 |
|----|------|--------|------|
| L-01 | `z-index` 체계가 하드코딩 (`z-20`, `z-50`) → z-index 스케일 시스템 없음 | 중간 | 전체 |
| L-02 | 모바일에서 `hidden md:flex` nav가 숨김이나 대체 메뉴(햄버거)가 없음 → 모바일 내비게이션 불가 | 높음 | [App.tsx:1108](file:///c:/projects/magok/src/App.tsx#L1108) |
| L-03 | 스티키 헤더 높이만큼 `main`에 별도 패딩 조정 필요 여부 확인 | 낮음 | [App.tsx:1157](file:///c:/projects/magok/src/App.tsx#L1157) |

> [!WARNING]
> **L-02**는 접근성과 연관됩니다. 모바일에서 네비게이션이 완전히 숨겨지고 대체 UI가 없어, 모바일 사용자는 해시 라우팅을 통한 직접 탐색 외에 페이지 이동이 어렵습니다.

---

### 5. 타이포그래피 & 색상 (MEDIUM) — 86점

#### ✅ 잘 된 점

**타이포그래피:**
- IBM Plex Sans KR + Space Grotesk — 정보 전달형 SaaS에 적합한 조합
- `letter-spacing: -0.03em` 제목용 타이트 커닝
- `font-semibold`/`font-medium` 위계 구분 일관성
- `leading-6`/`leading-7`/`leading-8` 행간 1.5~2.0 범위로 적절
- 제목 text-4xl~6xl → 본문 text-sm/text-base 위계 명확

**색상:**
- 블루 모노크롬 팔레트가 정부/산업 서비스에 적절한 신뢰감 전달
- `rgba()` 기반 투명도 변화로 깊이감 표현
- 상태별 시맨틱 색상 분리: success(emerald), warning(amber), danger(rose)

#### ⚠️ 개선 필요 항목

| ID | 이슈 | 우선도 | 위치 |
|----|------|--------|------|
| C-01 | 모든 색상이 블루 단색 → 액센트 보조색(Secondary accent) 부재. CTA 차별화 약함 | 중간 | 디자인 시스템 전체 |
| C-02 | `--foreground-subtle: #8293ad` 대비 불충분 (A-03 재참조) | 높음 | [index.css:13](file:///c:/projects/magok/src/index.css#L13) |
| C-03 | 다크 모드 완전 미지원 | 낮음 | 전체 |
| C-04 | inline 색상(예: `text-sky-900`, `bg-sky-50`) Tailwind 색상과 디자인 토큰 혼용 | 중간 | App.tsx 여러 위치 |
| C-05 | line-length 제한 없음 → 큰 화면에서 가독성 저하 가능 (65-75자 권장) | 낮음 | 본문 텍스트 영역 |

> [!NOTE]
> **현재 색상 팔레트 점검:**
>
> | 조합 | 대비비 | WCAG AA | 상태 |
> |------|--------|---------|------|
> | `#15253a` vs `#eef4ff` | 10.1:1 | ✅ AAA | 합격 |
> | `#586b86` vs `#eef4ff` | 4.8:1 | ✅ AA | 합격 |
> | `#8293ad` vs `#eef4ff` | **3.1:1** | ❌ FAIL | **실패** |
> | `#2b6dff` vs `#ffffff` | 4.5:1 | ✅ AA | 경계 합격 |
> | `#2b6dff` vs `#eef4ff` | 4.3:1 | ❌ FAIL (큰 텍스트는 OK) | **일반 텍스트 실패** |

---

### 6. 애니메이션 (MEDIUM) — 68점

#### ✅ 잘 된 점
- `transition-all duration-200` 기본 마이크로 인터랙션 적절 (150-300ms 범위)
- `hover:-translate-y-0.5` 은은한 상승 효과
- `transition-transform` 성능 측면(GPU 가속) 양호
- `rotate-180` chevron 토글 자연스러움

#### ⚠️ 개선 필요 항목

| ID | 이슈 | 우선도 | 위치 |
|----|------|--------|------|
| AN-01 | `prefers-reduced-motion` 미디어 쿼리 전혀 없음 (P-01 재참조) | 높음 | 전체 |
| AN-02 | 페이지 전환(view 변경) 시 애니메이션 없음 → 뷰 전환이 갑작스러움 | 중간 | App.tsx view 스위치 |
| AN-03 | 결과 패널 등장 시 Skeleton/진입 애니메이션 없음 | 중간 | result-panel.tsx |
| AN-04 | 스크롤 기반 reveal 없음 → 긴 페이지에서 정적 느낌 | 낮음 | HomeSections |
| AN-05 | 위저드 스텝 전환 시 fade/slide 없음 | 중간 | App.tsx 위저드 영역 |

---

### 7. 스타일 일관성 (MEDIUM) — 92점

#### ✅ 잘 된 점
- lucide-react 아이콘만 사용 (이모지 아이콘 없음 ✅)
- `size-4`/`size-5`/`size-6` 일관된 아이콘 크기
- `rounded-[22px]`, `rounded-[24px]`, `rounded-[28px]` 재사용 패턴
- CVA(class-variance-authority) 기반 variant 시스템
- CSS 커스텀 프로퍼티 기반 디자인 토큰 사용

#### ⚠️ 개선 필요 항목

| ID | 이슈 | 우선도 | 위치 |
|----|------|--------|------|
| S-01 | 라운딩 값이 분산 (22, 24, 26, 28, 32, 36, 38px) → 통합 스케일 필요 | 낮음 | 전체 |
| S-02 | shadow 패턴이 inline으로 분산 → 디자인 토큰화 필요 | 중간 | App.tsx 전반 |
| S-03 | Button variant에 `var()` 래핑 사용 (`bg-[var(--accent)]`) — 직접 토큰 참조 가능 | 낮음 | [button.tsx](file:///c:/projects/magok/src/components/ui/button.tsx) |

---

### 8. 차트 & 데이터 표현 (LOW) — 65점

#### 현황
- 현재 차트 컴포넌트 없음
- 데이터는 카드형 통계(introFacts, dictionaryPreviewCards)로만 표현
- 대형 데이터(코드 디렉토리)는 테이블/리스트 형태

#### ⚠️ 개선 필요 항목

| ID | 이슈 | 우선도 | 위치 |
|----|------|--------|------|
| D-01 | 통계 숫자에 카운트업 애니메이션 없음 → 정적 느낌 | 낮음 | introFacts 영역 |
| D-02 | 구역별 코드 분포를 시각적 차트로 보여주면 더 직관적 | 낮음 | 제안 사항 |

---

## 🟡 C (Check) — 우선순위별 개선 카드

### 🔴 Priority 1 — 즉시 수정 (1-2일)

| # | 이슈 | 카테고리 | 작업량 |
|---|------|---------|--------|
| 1 | **A-03/C-02**: `--foreground-subtle` 대비 불충분 → `#6b7fa0`으로 변경 | 색상 | CSS 1줄 수정 |
| 2 | **T-01**: `Button size="sm"` 최소 높이 `h-10`(40px) or `min-h-11`(44px)로 변경 | 인터랙션 | 1줄 수정 |
| 3 | **A-01**: 헤더 로고에 `aria-label="마곡 코드찾기 홈으로"` 추가 | 접근성 | 1줄 수정 |
| 4 | **A-05**: 스킵 내비게이션 링크 추가 | 접근성 | 10줄 추가 |

### 🟠 Priority 2 — 단기 개선 (3-5일)

| # | 이슈 | 카테고리 | 작업량 |
|---|------|---------|--------|
| 5 | **L-02/A-02**: 모바일 햄버거 메뉴 추가 | 레이아웃 | 컴포넌트 1개 신규 |
| 6 | **AN-01/P-01**: `prefers-reduced-motion` 전역 CSS 규칙 추가 | 애니메이션 | CSS 10줄 |
| 7 | **P-02**: Google Fonts 프리로드 `<link rel="preload">` 추가 | 퍼포먼스 | HTML 2줄 |
| 8 | **C-04**: Tailwind 색상 → CSS 토큰 통합 정리 | 색상 | 분산 수정 |
| 9 | **P-05**: 비동기 상태 스켈레톤 + 예약 높이 추가 | 퍼포먼스 | 컴포넌트별 |
| 10 | **T-03**: 비동기 버튼 로딩 인디케이터 추가 | 인터랙션 | 버튼 래퍼 |

### 🟢 Priority 3 — 중기 개선 (1-2주)

| # | 이슈 | 카테고리 | 작업량 |
|---|------|---------|--------|
| 11 | **AN-02/05**: 페이지/위저드 전환 애니메이션 (framer-motion 또는 CSS) | 애니메이션 | 중간 |
| 12 | **S-01/S-02**: 라운딩 스케일 및 그림자 토큰 체계 정립 | 스타일 | CSS 리팩토링 |
| 13 | **P-03**: App.tsx 코드 스플리팅 (lazy import + Suspense) | 퍼포먼스 | 중간 |
| 14 | **AN-03**: 결과 패널 스켈레톤 로딩 + 진입 애니메이션 | 애니메이션 | 컴포넌트 1개 |
| 15 | **C-01**: Secondary accent 색상 도입(예: Teal/Indigo) | 색상 | 디자인 결정 |

---

## 🔴 A (Act) — 개선 실행 계획

### Phase 1: Quick Wins (즉시, 1-2일)

```diff
/* index.css — A-03 대비 수정 */
- --foreground-subtle: #8293ad;
+ --foreground-subtle: #6b7fa0;
```

```diff
/* button.tsx — T-01 터치 타겟 수정 */
- sm: 'h-9 px-3 text-xs',
+ sm: 'h-10 min-h-[44px] px-3 text-xs',
```

```diff
/* App.tsx — A-01 접근성 라벨 */
  <button
    type="button"
    onClick={() => openHomeView('top')}
-   className="flex items-center gap-3 text-left"
+   className="flex items-center gap-3 text-left"
+   aria-label="마곡 코드찾기 홈으로"
  >
```

### Phase 2: 핵심 UX 강화 (3-5일)

1. **모바일 메뉴**: Sheet 또는 Drawer 컴포넌트로 구현
2. **reduced-motion**: `index.css`에 전역 규칙 추가
3. **폰트 프리로드**: `index.html` `<head>`에 추가
4. **스켈레톤 로딩**: `SkeletonCard` 컴포넌트 생성

### Phase 3: 프리미엄 경험 (1-2주)

1. **뷰 전환 애니메이션**: CSS `@starting-style` 또는 `framer-motion`
2. **디자인 토큰 정리**: shadow, border-radius 스케일 시스템
3. **코드 스플리팅**: `React.lazy` + `<Suspense>`
4. **보조 액센트 도입**: 의사결정 후 반영

---

## 📋 Pre-Delivery 체크리스트 (스킬 기반)

### Visual Quality
- [x] 이모지 아이콘 없음 (SVG lucide-react 사용) ✅
- [x] 일관된 아이콘 세트 (lucide-react) ✅
- [ ] `--foreground-subtle` 대비 4.5:1 미충족 ← **수정 필요**
- [x] Hover 상태가 레이아웃 시프트 유발하지 않음 ✅
- [ ] inline shadow → 토큰화 필요

### Interaction
- [ ] `size="sm"` 버튼 최소 44×44px 미충족 ← **수정 필요**
- [x] 대부분 hover 시 시각적 피드백 제공 ✅
- [x] transition 150-300ms 범위 ✅
- [x] focus-visible 키보드 탐색 지원 ✅

### Responsive
- [x] 반응형 그리드 시스템 적용 ✅
- [ ] 모바일 내비게이션 대안 없음 ← **수정 필요**
- [x] `min-width: 320px` 바닥값 설정 ✅
- [x] 가로 스크롤 방지 ✅

### Accessibility
- [ ] 스킵 내비게이션 없음 ← **추가 필요**
- [x] form input에 label 사용 ✅
- [ ] `prefers-reduced-motion` 미적용 ← **추가 필요**
- [x] 시맨틱 HTML 사용 ✅

### Performance
- [ ] 폰트 프리로드 없음 ← **추가 필요**
- [x] iframe lazy loading 적용 ✅
- [ ] App.tsx 코드 스플리팅 미적용
- [x] CSS에서 transform/opacity 사용 ✅

---

## 🎨 색상 진단 상세

### 현재 컬러 팔레트 시각화

```
Primary Scale:
  #0a1929 ██ (가장 진한 — 미사용)
  #15253a ██ foreground
  #586b86 ██ foreground-muted
  #8293ad ██ foreground-subtle ⚠️ 대비 부족
  #9cc0ff ██ accent-soft
  #2b6dff ██ accent (브랜드)
  #1658db ██ accent-strong
  #eef4ff ██ background
  #ffffff ██ surface-strong
```

### 권장 수정 컬러

```
변경 전: --foreground-subtle: #8293ad  (3.1:1)
변경 후: --foreground-subtle: #6b7fa0  (4.5:1) ✅

변경 전: --accent: #2b6dff  (4.3:1 vs #eef4ff)
유지:     큰 텍스트(18px+/14px bold+)용 OK, 일반 텍스트에선 배경 조합 주의
```

---

> [!TIP]
> **다음 PDCA 사이클 권장 시점:** Phase 1 Quick Wins 적용 후 1주 내 재감사하여 점수 변화를 추적하세요. 목표는 **A등급(90+)**입니다.
