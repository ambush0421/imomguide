# 도메인 이전 운영 체크리스트

대상 이전:

- 기존 주소: `https://imomguide.pages.dev/`
- 새 주소: `https://loopincode.com/`

기준일:

- `2026-03-19`

---

## 1. Cloudflare Pages

### 1-1. `loopincode.com` 커스텀 도메인 연결

1. Cloudflare 대시보드 로그인
2. `Workers & Pages` 클릭
3. 대상 Pages 프로젝트 클릭
4. `Custom domains` 클릭
5. `Set up a domain` 클릭
6. `loopincode.com` 입력 후 진행
7. 안내에 따라 DNS 또는 nameserver 설정 완료

실무 메모:

- `apex domain`인 `loopincode.com`을 붙일 때는 Cloudflare zone 연결과 nameserver 설정이 필요할 수 있다.
- `www.loopincode.com`도 쓸 계획이면 별도로 추가할지, `www -> apex`로 보낼지 먼저 정한다.

### 1-2. 기존 `pages.dev`를 새 도메인으로 리다이렉트

1. Cloudflare 대시보드 로그인
2. `Workers & Pages` 클릭
3. 대상 Pages 프로젝트 클릭
4. `Custom domains`에서 `loopincode.com`이 등록되어 있는지 확인
5. `Go Bulk Redirects` 또는 계정의 `Bulk redirects` 이동
6. `Create Bulk Redirect List` 클릭
7. 아래 값으로 리다이렉트 항목 생성

- Source URL: `<project>.pages.dev`
- Target URL: `https://loopincode.com`
- Status: `301`
- Parameters:
  - `Preserve query string`
  - `Subpath matching`
  - `Preserve path suffix`
  - `Include subdomains`

8. `Next`
9. `Continue to Redirect Rules`
10. `Create Bulk Redirect Rule`
11. Rule name 입력
12. 방금 만든 Redirect List 선택
13. `Save and Deploy`

실무 메모:

- Bulk Redirect는 Cloudflare 프록시가 걸린 호스트에서 동작한다.
- 전환 중에는 `pages.dev`를 죽이지 말고, 새 도메인으로 보내는 구조를 유지하는 편이 안전하다.

### 1-3. 배포 후 확인

1. 브라우저에서 `https://imomguide.pages.dev/` 접속
2. `https://loopincode.com/`으로 이동되는지 확인
3. 하위 경로도 확인

- `https://imomguide.pages.dev/some-page`
- 기대 결과: `https://loopincode.com/some-page`

---

## 2. Google Search Console

### 2-1. 새 도메인 속성 추가

권장:

- 새 도메인은 `Domain property`로 추가

순서:

1. Search Console 로그인
2. 좌측 상단 `속성 선택기(property selector)` 클릭
3. `+ Add property` 클릭
4. `Domain` 선택
5. `loopincode.com` 입력
6. `Continue`
7. DNS TXT 레코드 값 복사
8. Cloudflare DNS로 가서 TXT 레코드 추가
9. Search Console로 돌아와 `Verify`

실무 메모:

- `Domain property`는 `www`, `non-www`, `http`, `https`를 묶어서 보는 데 유리하다.
- 기존 `imomguide.pages.dev`는 보통 `URL-prefix property`로 유지하면 된다.

### 2-2. 새 sitemap 제출

1. Search Console에서 `loopincode.com` 속성 선택
2. 좌측 메뉴 `Sitemaps` 클릭
3. `Add a new sitemap` 입력칸에 `sitemap.xml` 입력
4. `Submit`

확인할 것:

- 제출 상태가 `Success`인지
- 읽은 날짜가 잡히는지

### 2-3. Change of Address 실행

전제:

- 기존 주소가 새 주소로 `301/308` 리다이렉트되고 있어야 함
- 기존 속성과 새 속성을 모두 검증한 상태여야 함

순서:

1. Search Console에서 기존 속성 선택
2. 좌측 하단 `Settings` 클릭
3. `Change of address` 클릭
4. 새 사이트로 `loopincode.com` 선택
5. 검증 단계 진행
6. 확인 후 제출

실무 메모:

- 메뉴가 안 보이거나 적용이 안 되면, `301 리다이렉트 + 새 sitemap 제출 + URL 검사` 조합으로도 이전을 진행할 수 있다.
- Change of Address는 보조 신호이고, 핵심은 `정확한 영구 리다이렉트`다.

### 2-4. URL 검사와 모니터링

1. `URL Inspection`에서 `https://loopincode.com/` 검사
2. `Request indexing` 필요 시 실행
3. 대표 URL 몇 개도 검사
4. `Page indexing` 보고서 확인
5. `Performance` 보고서에서 클릭/노출 이동 추적

전환 후 최소 확인 기간:

- 첫 2주: 매일
- 이후 4주: 주 2~3회

---

## 3. Google AdSense

### 3-1. 새 사이트 추가

1. AdSense 로그인
2. 좌측 메뉴 `Sites` 클릭
3. `+ New site` 클릭
4. `loopincode.com` 입력
5. `Save`

예상 상태:

- 처음에는 `Requires review`

### 3-2. 사이트 검증

다음 중 한 가지 방법 선택:

- `AdSense code snippet`
- `Ads.txt code snippet`
- `Meta tag`

현재 레포 기준으로 이미 반영된 것:

- `ads.txt`는 배포 산출물에 포함되도록 정리됨

실무 순서:

1. `Sites`에서 `loopincode.com` 클릭
2. 검증 방법 선택
3. 필요한 코드 또는 파일 반영 여부 확인
4. `Verify`
5. `Request review`

기다릴 것:

- 상태가 `Ready`로 바뀌는지 확인

실무 메모:

- AdSense는 기존 사이트 이름만 바꾸는 방식이 아니라 새 사이트를 별도로 추가하는 흐름이다.
- 보통 검토는 며칠 걸릴 수 있고, 경우에 따라 더 길어질 수 있다.

### 3-3. Privacy & messaging 사용 중이면 추가 작업

1. AdSense 로그인
2. `Privacy & messaging` 클릭
3. 사이트 목록에서 `loopincode.com`이 보이는지 확인
4. 없으면 새 사이트 추가 후 메시지 연결
5. 기존 메시지가 있으면 새 사이트에도 적용

---

## 4. Google Analytics 4

### 4-1. 기존 웹 데이터 스트림 URL 수정

1. Google Analytics 로그인
2. 좌측 하단 `Admin` 클릭
3. `Property` 열에서 `Data streams` 클릭
4. 웹 데이터 스트림 클릭
5. 우측 상단 `edit` 아이콘 클릭
6. `Website URL`을 `https://loopincode.com/`으로 수정
7. `Update stream`

실무 메모:

- 보통 새 속성을 만들 필요는 없다.
- 기존 측정 ID를 계속 쓰고, 웹 스트림 URL만 바꾸는 방식이 가장 단순하다.

### 4-2. 태그 수집 확인

1. 같은 스트림 화면에서 `Google tag` 정보 확인
2. 사이트에 동일 측정 ID가 들어가 있는지 확인
3. 사이트 접속 후 `Realtime` 보고서 확인

확인 기준:

- `loopincode.com` 접속 후 실시간 사용자 반영
- 페이지뷰가 정상 집계

### 4-3. 선택 확인

필요한 경우만:

1. `Admin > Data streams > Web stream`
2. `Configure tag settings`
3. 아래 항목 점검

- `Unwanted referrals`
- `Cross-domain measurement`

적용 상황:

- 전환 기간에 여러 도메인을 함께 쓰거나
- 외부 결제/예약/폼 도메인이 섞일 때

---

## 5. 운영 순서 요약

권장 순서:

1. Cloudflare에서 `loopincode.com` 연결
2. `pages.dev -> loopincode.com` 301 리다이렉트 설정
3. Search Console 새 속성 추가 + sitemap 제출
4. Search Console Change of Address 실행
5. AdSense 새 사이트 추가 + 검토 요청
6. GA4 웹 데이터 스트림 URL 수정
7. 브라우저/모바일에서 실제 접속 테스트
8. 2~6주간 색인/광고/분석 상태 모니터링

---

## 6. 완료 기준

- `imomguide.pages.dev` 접속 시 `loopincode.com`으로 이동
- Search Console에서 새 sitemap 성공
- Search Console에서 새 도메인 인덱싱 시작
- AdSense에서 `loopincode.com` 상태가 `Ready`
- GA4 Realtime에서 `loopincode.com` 트래픽 확인

---

## 공식 참고 문서

- Google Search Central: Site Moves and Migrations
- Google Search Console Help: Add a website property to Search Console
- Google Search Console Help: Reports at a glance / Property settings
- Google AdSense Help: Add a new site to your AdSense sites list
- Google AdSense Help: Add or remove sites
- Google Analytics Help: Edit / delete accounts, properties, and data streams
- Cloudflare Pages: Custom domains
- Cloudflare Pages: Redirecting `*.pages.dev` to a Custom Domain
- Cloudflare Rules: Create Bulk Redirects in the dashboard
