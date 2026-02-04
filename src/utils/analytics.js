/**
 * 아이맘가이드 Google Analytics 설정
 * GA4 (Google Analytics 4)
 */

// GA4 측정 ID (실제 ID로 교체 필요)
const GA_MEASUREMENT_ID = 'G-XXXXXXXXXX';

/**
 * GA4 초기화 스크립트 삽입
 */
export function initializeAnalytics() {
    // gtag 스크립트 로드
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
    document.head.appendChild(script);

    // gtag 초기화
    window.dataLayer = window.dataLayer || [];
    function gtag() { dataLayer.push(arguments); }
    window.gtag = gtag;
    
    gtag('js', new Date());
    gtag('config', GA_MEASUREMENT_ID, {
        'page_title': document.title,
        'page_location': window.location.href,
        'cookie_flags': 'samesite=none;secure'
    });
}

/**
 * 페이지뷰 트래킹
 */
export function trackPageView(pagePath, pageTitle) {
    if (typeof gtag !== 'undefined') {
        gtag('config', GA_MEASUREMENT_ID, {
            'page_path': pagePath,
            'page_title': pageTitle
        });
    }
}

/**
 * 이벤트 트래킹
 */
export function trackEvent(eventName, parameters = {}) {
    if (typeof gtag !== 'undefined') {
        gtag('event', eventName, parameters);
    }
}

/**
 * AI 상담 이벤트
 */
export function trackAIChat(action, details = {}) {
    trackEvent('ai_chat', {
        'action': action,
        'question_length': details.questionLength || 0,
        'response_time': details.responseTime || 0,
        ...details
    });
}

/**
 * 계산기 사용 이벤트
 */
export function trackCalculatorUse(calculatorType, result = {}) {
    trackEvent('calculator_use', {
        'calculator_type': calculatorType,
        ...result
    });
}

/**
 * 콘텐츠 조회 이벤트
 */
export function trackContentView(contentType, contentId, contentTitle) {
    trackEvent('content_view', {
        'content_type': contentType,
        'content_id': contentId,
        'content_title': contentTitle
    });
}

/**
 * 제휴 링크 클릭 이벤트
 */
export function trackAffiliateClick(productId, productName, context) {
    trackEvent('affiliate_click', {
        'product_id': productId,
        'product_name': productName,
        'click_context': context
    });
}

/**
 * 회원가입 이벤트
 */
export function trackSignUp(method) {
    trackEvent('sign_up', {
        'method': method
    });
}

/**
 * 로그인 이벤트
 */
export function trackLogin(method) {
    trackEvent('login', {
        'method': method
    });
}

/**
 * 프리미엄 전환 이벤트
 */
export function trackPremiumConversion(plan, price) {
    trackEvent('purchase', {
        'currency': 'KRW',
        'value': price,
        'items': [{
            'item_id': plan,
            'item_name': `프리미엄 ${plan}`,
            'price': price
        }]
    });
}

/**
 * 사용량 제한 도달 이벤트
 */
export function trackUsageLimitReached(userId) {
    trackEvent('usage_limit_reached', {
        'user_id': userId || 'anonymous'
    });
}

// HTML에 삽입할 초기화 코드
export const analyticsInitScript = `
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}"></script>
<script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', '${GA_MEASUREMENT_ID}');
</script>
`;
