// Firebase Configuration
// Firebase Console에서 가져온 설정값으로 교체하세요
const firebaseConfig = {
    apiKey: "YOUR_FIREBASE_API_KEY",
    authDomain: "imomguide-77800809.firebaseapp.com",
    projectId: "imomguide-77800809",
    storageBucket: "imomguide-77800809.firebasestorage.app",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Initialize Firebase
if (typeof firebase !== 'undefined') {
    firebase.initializeApp(firebaseConfig);
    
    // Assign to constants for export
    const authInstance = firebase.auth();
    const dbInstance = firebase.firestore();

    // Export services globally for backward compatibility
    window.auth = authInstance;
    window.db = dbInstance;
}

// Re-export for modules
const auth = typeof firebase !== 'undefined' ? firebase.auth() : null;
const db = typeof firebase !== 'undefined' ? firebase.firestore() : null;

export { auth, db };

// ===== Usage Tracking =====
const DAILY_FREE_LIMIT = 3;

const UsageTracker = {
    getToday() {
        return new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    },
    
    getUsage() {
        const stored = localStorage.getItem('imomguide_usage');
        if (stored) {
            const data = JSON.parse(stored);
            if (data.date === this.getToday()) {
                return data.count;
            }
        }
        return 0;
    },
    
    increment() {
        const count = this.getUsage() + 1;
        localStorage.setItem('imomguide_usage', JSON.stringify({
            date: this.getToday(),
            count: count
        }));
        return count;
    },
    
    canUse() {
        // 로그인 사용자는 프리미엄 체크 (추후 구현)
        if (auth && auth.currentUser) {
            // TODO: Firestore에서 프리미엄 상태 확인
            return true;
        }
        return this.getUsage() < DAILY_FREE_LIMIT;
    },
    
    getRemaining() {
        return Math.max(0, DAILY_FREE_LIMIT - this.getUsage());
    }
};

// Export global for non-module scripts
window.firebaseConfig = firebaseConfig;
window.UsageTracker = UsageTracker;