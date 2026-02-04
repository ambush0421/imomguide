// ===== Firebase Configuration =====
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "imomguide-77800809.firebaseapp.com",
    projectId: "imomguide-77800809",
    storageBucket: "imomguide-77800809.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Initialize Firebase (Assuming firebase is available globally from script tags)
if (typeof firebase !== 'undefined') {
    firebase.initializeApp(firebaseConfig);
    const auth = firebase.auth();
    const db = firebase.firestore();

    // ===== Auth State Observer =====
    auth.onAuthStateChanged(user => {
        const loginBtn = document.querySelector('a[href*="login"]');
        
        if (user) {
            // User is signed in
            if (loginBtn) {
                loginBtn.textContent = '마이페이지';
                loginBtn.href = '/src/pages/mypage.html';
            }
        } else {
            // User is signed out
            if (loginBtn) {
                loginBtn.textContent = '로그인';
                loginBtn.href = '/src/pages/login.html';
            }
        }
    });

    window.imomguide_auth = auth;
    window.imomguide_db = db;
}

// ===== FAQ Accordion =====
document.querySelectorAll('.faq-question').forEach(button => {
    button.addEventListener('click', () => {
        const faqItem = button.parentElement;
        const isActive = faqItem.classList.contains('active');
        
        // Close all FAQ items
        document.querySelectorAll('.faq-item').forEach(item => {
            item.classList.remove('active');
        });
        
        // Open clicked item if it wasn't active
        if (!isActive) {
            faqItem.classList.add('active');
        }
    });
});

// ===== Smooth Scroll =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href.startsWith('#')) {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
});

// ===== Usage Tracking (Free Tier Limit) =====
const DAILY_FREE_LIMIT = 3;

function getUsageCount() {
    const today = new Date().toDateString();
    const stored = localStorage.getItem('imomguide_usage');
    
    if (stored) {
        const data = JSON.parse(stored);
        if (data.date === today) {
            return data.count;
        }
    }
    return 0;
}

function incrementUsage() {
    const today = new Date().toDateString();
    const count = getUsageCount() + 1;
    
    localStorage.setItem('imomguide_usage', JSON.stringify({
        date: today,
        count: count
    }));
    
    return count;
}

function canUseService() {
    // Check if user is premium (Mock for now)
    if (window.imomguide_auth && window.imomguide_auth.currentUser) {
        // TODO: Check premium status from Firestore
        return true;
    }
    
    // Check free tier limit
    return getUsageCount() < DAILY_FREE_LIMIT;
}

function getRemainingUsage() {
    return Math.max(0, DAILY_FREE_LIMIT - getUsageCount());
}

// ===== Export for other modules =====
window.imomguide = {
    canUseService,
    getRemainingUsage,
    incrementUsage
};
