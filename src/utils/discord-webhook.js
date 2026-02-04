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
