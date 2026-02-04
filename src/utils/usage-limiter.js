/**
 * 아이맘가이드 사용량 제한 시스템
 * - 무료 사용자: 일일 3회 AI 상담 제한
 * - 프리미엄 사용자: 무제한
 */

import { db } from './firebase-config.js';
import { 
    doc, 
    getDoc, 
    setDoc, 
    updateDoc, 
    serverTimestamp,
    increment 
} from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js';

// 무료 사용자 일일 제한
const FREE_DAILY_LIMIT = 3;

// 한국 시간 기준 오늘 날짜 문자열
function getTodayDateString() {
    const now = new Date();
    // UTC+9 (한국 시간)
    const koreaTime = new Date(now.getTime() + (9 * 60 * 60 * 1000));
    return koreaTime.toISOString().split('T')[0];
}

/**
 * 사용자의 오늘 사용량 확인
 * @param {string} userId - Firebase Auth UID
 * @returns {Object} { used: number, limit: number, remaining: number, isPremium: boolean }
 */
export async function checkUsageLimit(userId) {
    if (!userId) {
        // 비로그인 사용자는 localStorage 기반
        return checkLocalUsage();
    }

    try {
        const today = getTodayDateString();
        
        // 사용자 프로필 확인 (프리미엄 여부)
        const userDoc = await getDoc(doc(db, 'users', userId));
        const userData = userDoc.exists() ? userDoc.data() : {};
        const isPremium = userData.isPremium || false;

        if (isPremium) {
            return {
                used: 0,
                limit: Infinity,
                remaining: Infinity,
                isPremium: true
            };
        }

        // 일일 사용량 확인
        const usageDoc = await getDoc(doc(db, 'usage', userId));
        
        if (!usageDoc.exists()) {
            return {
                used: 0,
                limit: FREE_DAILY_LIMIT,
                remaining: FREE_DAILY_LIMIT,
                isPremium: false
            };
        }

        const usageData = usageDoc.data();
        
        // 날짜가 다르면 리셋
        if (usageData.date !== today) {
            return {
                used: 0,
                limit: FREE_DAILY_LIMIT,
                remaining: FREE_DAILY_LIMIT,
                isPremium: false
            };
        }

        const used = usageData.count || 0;
        
        return {
            used: used,
            limit: FREE_DAILY_LIMIT,
            remaining: Math.max(0, FREE_DAILY_LIMIT - used),
            isPremium: false
        };
    } catch (error) {
        console.error('사용량 확인 오류:', error);
        // 오류 시 로컬 스토리지 폴백
        return checkLocalUsage();
    }
}

/**
 * 비로그인 사용자용 로컬 스토리지 기반 사용량 확인
 */
function checkLocalUsage() {
    const today = getTodayDateString();
    const storageKey = `imomguide_usage_${today}`;
    const used = parseInt(localStorage.getItem(storageKey) || '0');
    
    return {
        used: used,
        limit: FREE_DAILY_LIMIT,
        remaining: Math.max(0, FREE_DAILY_LIMIT - used),
        isPremium: false,
        isLocal: true
    };
}

/**
 * 사용량 증가 (API 호출 시)
 * @param {string} userId - Firebase Auth UID (없으면 로컬)
 * @returns {boolean} 성공 여부
 */
export async function incrementUsage(userId) {
    if (!userId) {
        return incrementLocalUsage();
    }

    try {
        const today = getTodayDateString();
        const usageRef = doc(db, 'usage', userId);
        const usageDoc = await getDoc(usageRef);

        if (!usageDoc.exists() || usageDoc.data().date !== today) {
            // 새로운 날짜 - 리셋
            await setDoc(usageRef, {
                count: 1,
                date: today,
                updatedAt: serverTimestamp()
            });
        } else {
            // 기존 날짜 - 증가
            await updateDoc(usageRef, {
                count: increment(1),
                updatedAt: serverTimestamp()
            });
        }

        // 채팅 히스토리에도 기록 (통계용)
        await logUsageHistory(userId, today);

        return true;
    } catch (error) {
        console.error('사용량 증가 오류:', error);
        return incrementLocalUsage();
    }
}

/**
 * 로컬 스토리지 사용량 증가
 */
function incrementLocalUsage() {
    const today = getTodayDateString();
    const storageKey = `imomguide_usage_${today}`;
    const current = parseInt(localStorage.getItem(storageKey) || '0');
    localStorage.setItem(storageKey, (current + 1).toString());
    return true;
}

/**
 * 사용 기록 로깅 (통계 분석용)
 */
async function logUsageHistory(userId, date) {
    try {
        const historyRef = doc(db, 'usageHistory', `${userId}_${date}_${Date.now()}`);
        await setDoc(historyRef, {
            userId: userId,
            date: date,
            timestamp: serverTimestamp(),
            action: 'ai_chat'
        });
    } catch (error) {
        // 히스토리 로깅 실패는 무시
        console.warn('히스토리 로깅 실패:', error);
    }
}

/**
 * 사용량 제한 UI 표시용 HTML 생성
 * @param {Object} usage - checkUsageLimit 반환값
 * @returns {string} HTML 문자열
 */
export function getUsageBadgeHTML(usage) {
    if (usage.isPremium) {
        return `
            <div class="usage-badge premium">
                <span class="badge-icon">⭐</span>
                <span class="badge-text">프리미엄 · 무제한</span>
            </div>
        `;
    }

    const percentage = ((usage.limit - usage.remaining) / usage.limit) * 100;
    const isLow = usage.remaining <= 1;
    
    return `
        <div class="usage-badge free ${isLow ? 'low' : ''}">
            <span class="badge-icon">${isLow ? '⚠️' : '💬'}</span>
            <span class="badge-text">오늘 ${usage.remaining}/${usage.limit}회 남음</span>
            <div class="usage-bar">
                <div class="usage-fill" style="width: ${percentage}%"></div>
            </div>
        </div>
    `;
}

/**
 * 제한 초과 시 표시할 모달 HTML
 */
export function getLimitExceededModalHTML() {
    return `
        <div class="limit-modal-overlay" id="limitModal">
            <div class="limit-modal">
                <div class="limit-modal-icon">😢</div>
                <h2>오늘 무료 상담 횟수를 모두 사용했어요</h2>
                <p>내일 다시 3회 무료 상담이 가능합니다.</p>
                <p style="font-size: 0.9rem; color: #888; margin-top: 10px;">
                    또는 프리미엄으로 업그레이드하면<br>무제한으로 상담받을 수 있어요!
                </p>
                
                <div class="limit-modal-buttons">
                    <button class="btn-secondary" onclick="closeLimitModal()">
                        내일 다시 올게요
                    </button>
                    <button class="btn-primary" onclick="showPremiumInfo()">
                        프리미엄 알아보기
                    </button>
                </div>
                
                <div class="limit-modal-alternatives">
                    <p>그동안 이런 콘텐츠는 어떠세요?</p>
                    <div class="alternative-links">
                        <a href="guides.html">📚 육아 가이드 읽기</a>
                        <a href="tools.html">🧮 육아 계산기 사용하기</a>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// 모달 CSS (chat.css에 추가)
export const limitModalCSS = `
.limit-modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    animation: fadeIn 0.3s ease;
}

.limit-modal {
    background: #fff;
    padding: 40px;
    border-radius: 20px;
    max-width: 400px;
    text-align: center;
    animation: slideUp 0.3s ease;
}

.limit-modal-icon {
    font-size: 4rem;
    margin-bottom: 20px;
}

.limit-modal h2 {
    font-size: 1.3rem;
    color: #333;
    margin-bottom: 10px;
}

.limit-modal p {
    color: #666;
    line-height: 1.6;
}

.limit-modal-buttons {
    display: flex;
    gap: 10px;
    margin-top: 25px;
}

.limit-modal-buttons button {
    flex: 1;
    padding: 14px;
    border-radius: 10px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
}

.btn-secondary {
    background: #f0f0f0;
    border: none;
    color: #666;
}

.btn-primary {
    background: linear-gradient(135deg, #FF6B9D 0%, #FF8E53 100%);
    border: none;
    color: #fff;
}

.btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(255, 107, 157, 0.4);
}

.limit-modal-alternatives {
    margin-top: 25px;
    padding-top: 20px;
    border-top: 1px solid #eee;
}

.limit-modal-alternatives p {
    font-size: 0.9rem;
    margin-bottom: 15px;
}

.alternative-links {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.alternative-links a {
    padding: 12px;
    background: #f8f9fa;
    border-radius: 8px;
    text-decoration: none;
    color: #333;
    font-size: 0.9rem;
    transition: all 0.3s ease;
}

.alternative-links a:hover {
    background: #FFF5F8;
    color: #FF6B9D;
}

.usage-badge {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 12px;
    background: #f0f0f0;
    border-radius: 20px;
    font-size: 0.85rem;
}

.usage-badge.premium {
    background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
    color: #fff;
}

.usage-badge.low {
    background: #FFF3CD;
    color: #856404;
}

.usage-bar {
    width: 50px;
    height: 4px;
    background: #ddd;
    border-radius: 2px;
    overflow: hidden;
}

.usage-fill {
    height: 100%;
    background: #FF6B9D;
    transition: width 0.3s ease;
}

 @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
}

 @keyframes slideUp {
    from { 
        opacity: 0; 
        transform: translateY(20px); 
    }
    to { 
        opacity: 1; 
        transform: translateY(0); 
    }
}
`;
