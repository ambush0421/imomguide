# 아이맘가이드 Discord 커뮤니티 설정 가이드

## 1. 서버 구조

### 1.1 카테고리 및 채널
```
📢 공지사항
├── #공지사항
├── #이벤트
└── #업데이트

🤰 임신 맘
├── #임신-초기-1-12주
├── #임신-중기-13-27주
├── #임신-후기-28-40주
└── #출산-준비

👶 육아 맘
├── #신생아-0-3개월
├── #영아-4-12개월
├── #유아-13-36개월
└── #형제자매-육아

💬 자유게시판
├── #일상-수다
├── #육아템-추천
├── #고민-상담
└── #정보-공유

🤖 AI 상담
├── #ai-질문하기
└── #ai-답변-아카이브

📚 자료실
├── #가이드-링크
├── #계산기-도구
└── #유용한-정보
```

---

## 2. Discord 봇 연동 (향후 구현)

### 2.1 봇 기능 목표
1. `/질문` 명령어로 AI 상담 연동
2. 질문-답변 자동 아카이브
3. 인기 질문 → 웹사이트 FAQ 자동 생성
4. 신규 콘텐츠 알림

### 2.2 간단한 Webhook 연동 (무료)

Discord Webhook으로 새 콘텐츠 알림 전송:

```javascript
// src/utils/discord-webhook.js

const DISCORD_WEBHOOK_URL = 'YOUR_DISCORD_WEBHOOK_URL';

/**
 * Discord에 새 콘텐츠 알림 전송
 */
export async function sendDiscordNotification(content) {
    const payload = {
        embeds: [{
            title: content.title,
            description: content.description,
            url: content.url,
            color: 0xFF6B9D, // 브랜드 컬러
            thumbnail: {
                url: content.thumbnail || 'https://imomguide.pages.dev/images/logo.png'
            },
            fields: [
                {
                    name: '📂 카테고리',
                    value: content.category,
                    inline: true
                },
                {
                    name: '🔗 바로가기',
                    value: `[클릭하여 보기](${content.url})`,
                    inline: true
                }
            ],
            footer: {
                text: '아이맘가이드 | AI 육아 정보 플랫폼'
            },
            timestamp: new Date().toISOString()
        }]
    };

    try {
        const response = await fetch(DISCORD_WEBHOOK_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });
        
        return response.ok;
    } catch (error) {
        console.error('Discord 알림 전송 실패:', error);
        return false;
    }
}

// 사용 예시
// sendDiscordNotification({
//     title: '🆕 새 가이드가 올라왔어요!',
//     description: '임신 8주차 증상과 태아 발달 - 심장 소리가 들려요',
//     url: 'https://imomguide.pages.dev/pages/pregnancy/week-8.html',
//     category: '임신 가이드'
// });
```

---

## 3. 커뮤니티 운영 가이드

### 3.1 환영 메시지 (자동)
```
🎉 **{username}** 님, 아이맘가이드 커뮤니티에 오신 것을 환영해요!

여기서는 임신, 출산, 육아에 대한 정보를 나누고
서로의 경험을 공유할 수 있어요.

🔹 먼저 자기소개 해주세요!
🔹 궁금한 점은 편하게 질문해 주세요.
🔹 서로 존중하며 따뜻한 커뮤니티를 만들어요.

📱 **아이맘가이드 웹사이트**
https://imomguide.pages.dev

🤖 **AI 전문가 상담** (무료 3회/일)
https://imomguide.pages.dev/pages/chat.html
```

### 3.2 커뮤니티 규칙
```
📜 **아이맘가이드 커뮤니티 규칙**

1️⃣ **존중과 배려**
   모든 분의 경험과 선택을 존중해 주세요.

2️⃣ **의료 정보 주의**
   여기서 나누는 정보는 참고용입니다.
   건강 문제는 반드시 전문의와 상담하세요.

3️⃣ **광고 및 홍보 금지**
   무단 광고, 홍보성 게시물은 삭제됩니다.

4️⃣ **개인정보 보호**
   타인의 개인정보를 공유하지 마세요.

5️⃣ **긍정적인 분위기**
   비난, 비하 발언은 자제해 주세요.

위반 시 경고 없이 퇴장될 수 있습니다.
```

### 3.3 주간 이벤트 아이디어
- **월요일**: 이번 주 목표 공유
- **수요일**: 육아템 추천의 날
- **금요일**: 주간 Q&A 정리
- **주말**: 일상 공유 & 휴식

---

## 4. 커뮤니티 ↔ 웹사이트 연동

### 4.1 인기 질문 수집 → FAQ 업데이트
```
Discord 인기 질문
      ↓
주간 정리 (수동/자동)
      ↓
웹사이트 FAQ 페이지 업데이트
      ↓
네이버 블로그 포스팅
```

### 4.2 콘텐츠 알림 자동화
```
새 콘텐츠 발행
      ↓
Discord Webhook 알림
      ↓
커뮤니티 #공지사항 채널
```
