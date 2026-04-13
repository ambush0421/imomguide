# `korean-law-mcp` 개발용 운용 가이드

## 목적

`korean-law-mcp`는 이 프로젝트에서 "실서비스 기능"이 아니라 "운영자용 법령 조사 도구"로 사용한다.

현재 앱은 아래 파일에 정리된 근거 데이터를 직접 소비한다.

- `src/features/eligibility/data/legal-bases.ts`
- `src/features/library/data/legal-library.ts`

즉 사용자 화면에서 법령 API를 실시간 호출하지 않고, 검증된 내용을 코드에 반영해 재현성과 안정성을 유지한다.

## 왜 이렇게 쓰는가

이 프로젝트는 Vite + React + Electron 구조라서, MCP 서버를 앱 런타임에 직접 붙이는 구조와 잘 맞지 않는다.
특히 법제처 Open API 키 `LAW_OC`를 배포 앱 안에 넣는 방식은 피하는 편이 안전하다.

따라서 권장 방식은 다음과 같다.

1. 개발/운영 환경의 MCP 클라이언트에 `korean-law-mcp`를 연결한다.
2. 최신 법령·판례·해석례를 조사한다.
3. 결과를 사람이 검토한 뒤 프로젝트의 정적 근거 데이터와 문서를 갱신한다.

## 빠른 설정 메모

2026-04-03 기준 [`korean-law-mcp`](https://github.com/chrisryugj/korean-law-mcp) README는 다음을 안내한다.

- `npm install -g korean-law-mcp`
- 법제처 Open API 키 `LAW_OC` 필요
- 로컬 MCP 서버와 원격 MCP(`https://korean-law-mcp.fly.dev/mcp`) 둘 다 지원
- Claude Desktop, Cursor, Windsurf, Continue, Zed 같은 MCP 클라이언트 설정 가능

예시 개념:

```json
{
  "mcpServers": {
    "korean-law": {
      "command": "korean-law-mcp",
      "env": {
        "LAW_OC": "개인-API-키"
      }
    }
  }
}
```

주의:

- 위 예시는 "개인 로컬 설정" 예시일 뿐이며, 저장소에 커밋하지 않는다.
- API 키는 `.env`, README 예시, 앱 코드 어느 곳에도 하드코딩하지 않는다.

## 이 프로젝트에서 추천하는 사용 시나리오

### 1. 법령 문구 최신 여부 확인

다음 상황에서 먼저 확인한다.

- 서울특별시 마곡 관리기본계획 고시가 새로 올라왔을 때
- `산업집적활성화 및 공장설립에 관한 법률 시행령` 조문이 개정됐을 때
- 지식산업센터 허용 업종 범위 해석이 흔들릴 때

우선 갱신 후보:

- `legal-bases.ts`의 `citation`, `sourceDocumentTitle`, `pageHint`, `summary`, `quote`
- `legal-library.ts`의 공식 출처 URL, 문서번호, 발행일, 설명

### 2. 판례/해석례 보강

다음처럼 "조문만으로 애매한 실무 질문"이 들어올 때 조사 보조용으로 쓴다.

- 호스팅/데이터 처리/소프트웨어 계열 업종의 정보통신산업 연결
- 임대, 전대, 일부 임대, 사업계획 변경 같은 운영 제한
- 융복합 업종이나 심의 필요 업종의 보수적 설명 문구

이 경우 바로 자동 판정 로직에 넣지 말고, 먼저 내부 메모나 `docs/codex-brain`에 근거를 정리한 뒤 사람이 판단해서 반영한다.

### 3. 사용자 제공 문서 검토 보조

사용자가 PDF, 계약서, 운영계획서를 줄 때도 참고 도구로는 유용할 수 있다.
다만 이 프로젝트의 결과 화면에 MCP 분석 결과를 그대로 노출하지는 않는다.

권장 흐름:

1. 문서의 핵심 쟁점 파악
2. 관련 법령/해석례 조사
3. 사람이 검토
4. 필요 시 앱의 설명 문구 또는 운영 문서 갱신

## 갱신 절차 체크리스트

1. 바뀐 법령이나 판례를 `korean-law-mcp`로 조사한다.
2. 법적 근거가 실제 서비스에 반영할 가치가 있는지 판단한다.
3. 아래 파일을 필요한 범위만 갱신한다.

- `src/features/eligibility/data/legal-bases.ts`
- `src/features/library/data/legal-library.ts`
- 관련 UI 파일
- 관련 테스트 파일
- `docs/codex-brain/task.md`
- `docs/codex-brain/implementation_plan.md`
- `docs/codex-brain/walkthrough.md`

4. 변경 후 아래 검증을 실행한다.

```bash
npm run lint
npm run test
npm run build
```

## 비권장 패턴

- 앱 프론트엔드에서 직접 `korean-law-mcp`나 법제처 API를 호출하기
- Electron 앱에 개인 API 키를 포함해 배포하기
- MCP 조사 결과를 사람 검토 없이 자동 판정 문구로 반영하기
- 개인별 MCP 설정 파일을 저장소에 커밋하기

## 현재 결론

이 프로젝트에서 `korean-law-mcp`는 "필요한 도구"는 맞지만, 위치는 앱 내부가 아니라 개발/운영 워크플로 바깥쪽이 맞다.
가장 안전한 기본값은 "조사 도구로 연결하고, 서비스는 계속 정적 근거 데이터로 운영"하는 방식이다.
