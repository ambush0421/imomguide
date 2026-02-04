/**
 * 아이맘가이드 제휴 마케팅 관리 시스템
 * - 쿠팡 파트너스, 11번가, 지마켓 등 제휴 링크 관리
 */

// 제휴 상품 데이터베이스
const affiliateProducts = {
    // 임신 관련
    'prenatal-folic': {
        name: '임산부 엽산 영양제',
        category: '영양제',
        links: {
            coupang: 'https://link.coupang.com/YOUR_COUPANG_ID/prenatal-folic',
            elevenst: 'https://www.11st.co.kr/products/YOUR_PRODUCT_ID',
        },
        keywords: ['엽산', '임산부 영양제', '임신 초기']
    },
    'prenatal-multi': {
        name: '임산부 종합 영양제',
        category: '영양제',
        links: {
            coupang: 'https://link.coupang.com/YOUR_COUPANG_ID/prenatal-multi',
        },
        keywords: ['임산부 비타민', '종합 영양제']
    },
    'nausea-candy': {
        name: '입덧 완화 캔디',
        category: '입덧',
        links: {
            coupang: 'https://link.coupang.com/YOUR_COUPANG_ID/nausea-candy',
        },
        keywords: ['입덧', '임신 초기', '메스꺼움']
    },
    'body-pillow': {
        name: '임산부 바디필로우',
        category: '수면',
        links: {
            coupang: 'https://link.coupang.com/YOUR_COUPANG_ID/body-pillow',
        },
        keywords: ['임산부 베개', '수면', '바디필로우']
    },
    'stretch-cream': {
        name: '튼살 예방 크림',
        category: '스킨케어',
        links: {
            coupang: 'https://link.coupang.com/YOUR_COUPANG_ID/stretch-cream',
        },
        keywords: ['튼살', '임신선', '보습']
    },

    // 수유 관련
    'breast-pump': {
        name: '전동 유축기',
        category: '수유',
        links: {
            coupang: 'https://link.coupang.com/YOUR_COUPANG_ID/breast-pump',
        },
        keywords: ['유축기', '모유 수유', '전동']
    },
    'bottle-set': {
        name: '젖병 세트',
        category: '수유',
        links: {
            coupang: 'https://link.coupang.com/YOUR_COUPANG_ID/bottle-set',
        },
        keywords: ['젖병', '분유', '신생아']
    },
    'formula-maker': {
        name: '분유 포트',
        category: '수유',
        links: {
            coupang: 'https://link.coupang.com/YOUR_COUPANG_ID/formula-maker',
        },
        keywords: ['분유 포트', '분유 제조기', '온도 유지']
    },

    // 이유식 관련
    'baby-food-maker': {
        name: '이유식 조리기',
        category: '이유식',
        links: {
            coupang: 'https://link.coupang.com/YOUR_COUPANG_ID/baby-food-maker',
        },
        keywords: ['이유식', '블렌더', '찜기']
    },
    'silicone-spoon': {
        name: '실리콘 이유식 스푼',
        category: '이유식',
        links: {
            coupang: 'https://link.coupang.com/YOUR_COUPANG_ID/silicone-spoon',
        },
        keywords: ['이유식 스푼', '실리콘', '아기 숟가락']
    },
    'food-container': {
        name: '이유식 보관용기 세트',
        category: '이유식',
        links: {
            coupang: 'https://link.coupang.com/YOUR_COUPANG_ID/food-container',
        },
        keywords: ['이유식 보관', '냉동', '큐브']
    },

    // 건강 관리
    'thermometer': {
        name: '비접촉 체온계',
        category: '건강',
        links: {
            coupang: 'https://link.coupang.com/YOUR_COUPANG_ID/thermometer',
        },
        keywords: ['체온계', '발열', '비접촉']
    },
    'fever-patch': {
        name: '쿨링 패치 (열냉이)',
        category: '건강',
        links: {
            coupang: 'https://link.coupang.com/YOUR_COUPANG_ID/fever-patch',
        },
        keywords: ['열냉이', '쿨링', '발열']
    },
    'infant-tylenol': {
        name: '영아용 해열제',
        category: '건강',
        links: {
            coupang: 'https://link.coupang.com/YOUR_COUPANG_ID/infant-tylenol',
        },
        keywords: ['해열제', '타이레놀', '챔프']
    },

    // 수면 관련
    'white-noise': {
        name: '백색소음기',
        category: '수면',
        links: {
            coupang: 'https://link.coupang.com/YOUR_COUPANG_ID/white-noise',
        },
        keywords: ['백색소음', '수면', '숙면']
    },
    'swaddle': {
        name: '속싸개/스와들',
        category: '수면',
        links: {
            coupang: 'https://link.coupang.com/YOUR_COUPANG_ID/swaddle',
        },
        keywords: ['속싸개', '스와들', '신생아 수면']
    },

    // 외출 관련
    'stroller': {
        name: '유모차',
        category: '외출',
        links: {
            coupang: 'https://link.coupang.com/YOUR_COUPANG_ID/stroller',
        },
        keywords: ['유모차', '휴대용', '절충형']
    },
    'car-seat': {
        name: '카시트',
        category: '외출',
        links: {
            coupang: 'https://link.coupang.com/YOUR_COUPANG_ID/car-seat',
        },
        keywords: ['카시트', '신생아', '회전형']
    },
    'diaper-bag': {
        name: '기저귀 가방',
        category: '외출',
        links: {
            coupang: 'https://link.coupang.com/YOUR_COUPANG_ID/diaper-bag',
        },
        keywords: ['기저귀 가방', '외출', '수납']
    },
};

// 키워드별 제품 매핑 (AI 응답에서 키워드 추출용)
const keywordProductMap = {
    // 증상/상황별
    '입덧': ['nausea-candy', 'prenatal-folic'],
    '수면': ['white-noise', 'swaddle', 'body-pillow'],
    '발열': ['thermometer', 'fever-patch', 'infant-tylenol'],
    '이유식': ['baby-food-maker', 'silicone-spoon', 'food-container'],
    '수유': ['breast-pump', 'bottle-set', 'formula-maker'],
    '분유': ['formula-maker', 'bottle-set'],
    '모유': ['breast-pump', 'milk-bags'],
    '기저귀': ['diaper-bag', 'diapers'],
    '외출': ['stroller', 'car-seat', 'diaper-bag'],
    
    // 시기별
    '임신 초기': ['prenatal-folic', 'nausea-candy', 'body-pillow'],
    '임신 중기': ['prenatal-multi', 'stretch-cream', 'body-pillow'],
    '임신 후기': ['hospital-bag', 'newborn-clothes', 'nursing-bra'],
    '신생아': ['bottle-set', 'swaddle', 'thermometer'],
};

/**
 * 제휴 링크 가져오기
 * @param {string} productId - 상품 ID
 * @param {string} platform - 플랫폼 (coupang, elevenst, gmarket)
 * @returns {string|null} 제휴 링크 URL
 */
export function getAffiliateLink(productId, platform = 'coupang') {
    const product = affiliateProducts[productId];
    if (!product) return null;
    
    return product.links[platform] || product.links.coupang || null;
}

/**
 * 상품 정보 가져오기
 * @param {string} productId - 상품 ID
 * @returns {Object|null} 상품 정보
 */
export function getProductInfo(productId) {
    return affiliateProducts[productId] || null;
}

/**
 * 키워드 기반 추천 상품 가져오기
 * @param {string[]} keywords - 키워드 배열
 * @param {number} limit - 최대 개수
 * @returns {Array} 추천 상품 배열
 */
export function getRecommendedProducts(keywords, limit = 3) {
    const productIds = new Set();
    
    keywords.forEach(keyword => {
        const matches = keywordProductMap[keyword];
        if (matches) {
            matches.forEach(id => productIds.add(id));
        }
    });

    // 상품 정보와 링크 반환
    return Array.from(productIds)
        .slice(0, limit)
        .map(id => ({
            id,
            ...affiliateProducts[id],
            link: getAffiliateLink(id)
        }))
        .filter(p => p.link);
}

/**
 * AI 응답에서 키워드 추출 및 상품 추천
 * @param {string} aiResponse - AI 응답 텍스트
 * @returns {Array} 추천 상품 배열
 */
export function extractAndRecommend(aiResponse) {
    const allKeywords = Object.keys(keywordProductMap);
    const foundKeywords = allKeywords.filter(keyword => 
        aiResponse.includes(keyword)
    );
    
    return getRecommendedProducts(foundKeywords, 3);
}

/**
 * 클릭 추적 (Analytics 연동)
 * @param {string} productId - 상품 ID
 * @param {string} context - 클릭 맥락 (chat, article, tool 등)
 */
export function trackAffiliateClick(productId, context) {
    // Google Analytics 이벤트 전송
    if (typeof gtag !== 'undefined') {
        gtag('event', 'affiliate_click', {
            'product_id': productId,
            'product_name': affiliateProducts[productId]?.name || 'unknown',
            'context': context
        });
    }

    // 내부 통계 기록 (Firebase)
    logAffiliateClick(productId, context);
}

/**
 * Firebase에 클릭 기록
 */
async function logAffiliateClick(productId, context) {
    try {
        // Firebase 연동 시 구현
        console.log(`Affiliate click: ${productId} from ${context}`);
    } catch (error) {
        console.warn('Affiliate click logging failed:', error);
    }
}

/**
 * 제휴 상품 위젯 HTML 생성
 * @param {Array} products - 상품 배열
 * @param {string} context - 표시 맥락
 * @returns {string} HTML 문자열
 */
export function renderAffiliateWidget(products, context = 'general') {
    if (!products || products.length === 0) {
        return '';
    }

    return `
        <div class="affiliate-widget" data-context="${context}">
            <h4>💡 관련 추천 제품</h4>
            <div class="affiliate-products">
                ${products.map(product => `
                    <a href="${product.link}" 
                       class="affiliate-product-card" 
                       target="_blank" 
                       rel="noopener sponsored"
                       data-product-id="${product.id}"
                       onclick="trackAffiliateClick('${product.id}', '${context}')">
                        <span class="product-category">${product.category}</span>
                        <span class="product-name">${product.name}</span>
                        <span class="product-cta">구매하러 가기 →</span>
                    </a>
                `).join('')}
            </div>
            <p class="affiliate-disclosure">
                *이 포스팅은 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받습니다.
            </p>
        </div>
    `;
}

// CSS for affiliate widget
export const affiliateWidgetCSS = `
.affiliate-widget {
    margin: 25px 0;
    padding: 20px;
    background: linear-gradient(135deg, #FFF5F8 0%, #F0F7FF 100%);
    border-radius: 12px;
    border: 1px solid #FFD0E0;
}

.affiliate-widget h4 {
    margin-bottom: 15px;
    font-size: 1rem;
    color: #333;
}

.affiliate-products {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.affiliate-product-card {
    display: flex;
    flex-direction: column;
    padding: 15px;
    background: #fff;
    border-radius: 10px;
    text-decoration: none;
    transition: all 0.3s ease;
    border: 1px solid #eee;
}

.affiliate-product-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0,0,0,0.1);
    border-color: #FF6B9D;
}

.affiliate-product-card .product-category {
    font-size: 0.75rem;
    color: #FF6B9D;
    font-weight: 600;
    margin-bottom: 5px;
}

.affiliate-product-card .product-name {
    font-size: 0.95rem;
    color: #333;
    font-weight: 600;
    margin-bottom: 8px;
}

.affiliate-product-card .product-cta {
    font-size: 0.85rem;
    color: #888;
}

.affiliate-disclosure {
    margin-top: 15px;
    font-size: 0.75rem;
    color: #999;
    line-height: 1.5;
}

 @media (min-width: 768px) {
    .affiliate-products {
        flex-direction: row;
    }
    
    .affiliate-product-card {
        flex: 1;
    }
}
`;
