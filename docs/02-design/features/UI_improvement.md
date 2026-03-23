# UI_improvement Design Document

> Version: 1.0.0 | Created: 2026-03-23 | Status: Draft

## 1. Overview
Plan 문서(UI_improvement.md)를 바탕으로, 마곡 프로젝트(magok)의 일관된 UI/UX 적용을 위한 상세 설계입니다. 프론트엔드 아키텍처 및 공통 컴포넌트의 명세를 정의합니다.

## 2. Architecture
### System Diagram
프론트엔드 애플리케이션은 메인 화면, 공통 컴포넌트(UI Kit), 그리고 레이아웃 컨테이너로 구성됩니다.
[User] -> [Main Layout (Navigation, Header)] -> [Feature Views] -> [Common UI Components (Buttons, Modals, Forms)]

### Components
- **Main Layout**: 전역 네비게이션 및 헤더를 포함하여 일관된 페이지 전환 경험 제공
- **Button / Input Form**: 재사용 가능한 폼 요소들로 통일된 스타일(CSS/Tailwind 등) 적용
- **Modal / Dialog**: 중앙 집중식 상태 관리 또는 공통 컴포넌트를 통해 호출 가능한 팝업 UI

## 3. Data Model
### Entities
해당 설계는 UI 개선 중심이므로, 백엔드 데이터 모델의 변경은 없습니다. UI 컴포넌트용 Props 모델만 정의합니다.

`	ypescript
// 공통 버튼 컴포넌트 Props
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'outline' | 'danger';
  size: 'sm' | 'md' | 'lg';
  isDisabled?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

// 모달 상태 관리 모델
interface ModalState {
  isOpen: boolean;
  title: string;
  content: React.ReactNode;
  onConfirm?: () => void;
  onCancel?: () => void;
}
`

## 4. API Specification
### Endpoints
기존 API를 유지하며, UI 표출을 위한 엔드포인트 변경은 없습니다.

## 5. UI Design
- **Color Palette**: 브랜드 컬러를 기준으로 Primary, Secondary, Background, Text 색상을 CSS 변수 또는 설정 파일에 정의
- **Typography**: 가독성을 높인 폰트 스케일 적용 (Heading 1~6, Body, Caption)
- **Spacing/Layout**: 4px 또는 8px 그리드 시스템을 기반으로 일관된 마진 및 패딩 적용

## 6. Test Plan
| Test Case | Expected Result |
|-----------|-----------------|
| 공통 버튼 렌더링 | 각 variant(primary, secondary 등)에 맞는 스타일이 올바르게 렌더링됨 |
| 반응형 레이아웃 확인 | 모바일/태블릿/데스크톱 해상도에 따라 메인 화면 레이아웃이 깨지지 않고 변형됨 |
| 모달 컴포넌트 동작 | 열기/닫기 동작이 부드럽게(애니메이션 포함) 수행되고 콜백 이벤트가 정상 작동함 |
