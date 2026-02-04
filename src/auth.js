// ===== DOM Elements =====
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const forgotPasswordForm = document.getElementById('forgotPasswordForm');

const emailLoginForm = document.getElementById('emailLoginForm');
const emailRegisterForm = document.getElementById('emailRegisterForm');
const resetPasswordForm = document.getElementById('resetPasswordForm');

const googleLoginBtn = document.getElementById('googleLoginBtn');
const googleRegisterBtn = document.getElementById('googleRegisterBtn');

const showRegisterLink = document.getElementById('showRegisterLink');
const showLoginLink = document.getElementById('showLoginLink');
const forgotPasswordLink = document.getElementById('forgotPasswordLink');
const backToLoginLink = document.getElementById('backToLoginLink');

const loadingOverlay = document.getElementById('loadingOverlay');

// Error elements
const loginError = document.getElementById('loginError');
const registerError = document.getElementById('registerError');
const resetError = document.getElementById('resetError');
const resetSuccess = document.getElementById('resetSuccess');

// ===== Initialize =====
function init() {
    setupFormSwitching();
    setupGoogleAuth();
    setupEmailAuth();
    setupPasswordReset();
    checkRedirect();
    
    // Check if already logged in
    if (window.auth) {
        window.auth.onAuthStateChanged(user => {
            if (user) {
                // Redirect to chat or mypage
                const urlParams = new URLSearchParams(window.location.search);
                const redirect = urlParams.get('redirect') || '/pages/chat.html';
                window.location.href = redirect;
            }
        });
    }
}

// ===== Form Switching =====
function setupFormSwitching() {
    showRegisterLink.addEventListener('click', (e) => {
        e.preventDefault();
        loginForm.style.display = 'none';
        registerForm.style.display = 'block';
        forgotPasswordForm.style.display = 'none';
        clearErrors();
    });
    
    showLoginLink.addEventListener('click', (e) => {
        e.preventDefault();
        loginForm.style.display = 'block';
        registerForm.style.display = 'none';
        forgotPasswordForm.style.display = 'none';
        clearErrors();
    });
    
    forgotPasswordLink.addEventListener('click', (e) => {
        e.preventDefault();
        loginForm.style.display = 'none';
        registerForm.style.display = 'none';
        forgotPasswordForm.style.display = 'block';
        clearErrors();
    });
    
    backToLoginLink.addEventListener('click', (e) => {
        e.preventDefault();
        loginForm.style.display = 'block';
        registerForm.style.display = 'none';
        forgotPasswordForm.style.display = 'none';
        clearErrors();
    });
}

// ===== Google Authentication =====
function setupGoogleAuth() {
    const googleProvider = new firebase.auth.GoogleAuthProvider();
    googleProvider.setCustomParameters({
        prompt: 'select_account'
    });
    
    const handleGoogleSignIn = async () => {
        showLoading();
        clearErrors();
        
        try {
            const result = await window.auth.signInWithPopup(googleProvider);
            const user = result.user;
            
            // Check if new user
            if (result.additionalUserInfo.isNewUser) {
                await createUserProfile(user, {
                    displayName: user.displayName,
                    email: user.email,
                    photoURL: user.photoURL,
                    provider: 'google'
                });
            }
            
            // Redirect
            redirectAfterAuth();
            
        } catch (error) {
            hideLoading();
            handleAuthError(error, loginError);
        }
    };
    
    googleLoginBtn.addEventListener('click', handleGoogleSignIn);
    googleRegisterBtn.addEventListener('click', handleGoogleSignIn);
}

// ===== Email Authentication =====
function setupEmailAuth() {
    // Login
    emailLoginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        showLoading();
        clearErrors();
        
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        
        try {
            await window.auth.signInWithEmailAndPassword(email, password);
            redirectAfterAuth();
        } catch (error) {
            hideLoading();
            handleAuthError(error, loginError);
        }
    });
    
    // Register
    emailRegisterForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        showLoading();
        clearErrors();
        
        const name = document.getElementById('registerName').value.trim();
        const email = document.getElementById('registerEmail').value;
        const password = document.getElementById('registerPassword').value;
        const passwordConfirm = document.getElementById('registerPasswordConfirm').value;
        const agreeTerms = document.getElementById('agreeTerms').checked;
        
        // Validation
        if (password !== passwordConfirm) {
            hideLoading();
            showError(registerError, '비밀번호가 일치하지 않습니다.');
            return;
        }
        
        if (!agreeTerms) {
            hideLoading();
            showError(registerError, '이용약관에 동의해 주세요.');
            return;
        }
        
        try {
            // Create user
            const result = await window.auth.createUserWithEmailAndPassword(email, password);
            const user = result.user;
            
            // Update display name
            await user.updateProfile({
                displayName: name
            });
            
            // Create user profile in Firestore
            await createUserProfile(user, {
                displayName: name,
                email: email,
                provider: 'email'
            });
            
            // Send email verification (optional)
            // await user.sendEmailVerification();
            
            redirectAfterAuth();
            
        } catch (error) {
            hideLoading();
            handleAuthError(error, registerError);
        }
    });
}

// ===== Password Reset =====
function setupPasswordReset() {
    resetPasswordForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        showLoading();
        clearErrors();
        
        const email = document.getElementById('resetEmail').value;
        
        try {
            await window.auth.sendPasswordResetEmail(email);
            hideLoading();
            resetSuccess.textContent = '비밀번호 재설정 이메일을 보냈습니다. 이메일을 확인해 주세요.';
            resetSuccess.style.display = 'block';
            
        } catch (error) {
            hideLoading();
            handleAuthError(error, resetError);
        }
    });
}

// ===== Create User Profile in Firestore =====
async function createUserProfile(user, additionalData) {
    if (!window.db) return;
    const userRef = window.db.collection('users').doc(user.uid);
    
    const userData = {
        uid: user.uid,
        email: user.email,
        displayName: additionalData.displayName || user.displayName || '익명 사용자',
        photoURL: additionalData.photoURL || user.photoURL || null,
        provider: additionalData.provider,
        isPremium: false,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        lastLoginAt: firebase.firestore.FieldValue.serverTimestamp(),
        // 육아 관련 프로필 (나중에 업데이트)
        babyInfo: null,
        preferences: {
            notifications: true,
            newsletter: false
        }
    };
    
    await userRef.set(userData, { merge: true });
    return userData;
}

// ===== Update Last Login =====
async function updateLastLogin(userId) {
    if (!window.db) return;
    try {
        await window.db.collection('users').doc(userId).update({
            lastLoginAt: firebase.firestore.FieldValue.serverTimestamp()
        });
    } catch (error) {
        console.error('Failed to update last login:', error);
    }
}

// ===== Error Handling =====
function handleAuthError(error, errorElement) {
    console.error('Auth Error:', error);
    
    let message = '오류가 발생했습니다. 다시 시도해 주세요.';
    
    switch (error.code) {
        case 'auth/email-already-in-use':
            message = '이미 사용 중인 이메일입니다.';
            break;
        case 'auth/invalid-email':
            message = '유효하지 않은 이메일 형식입니다.';
            break;
        case 'auth/operation-not-allowed':
            message = '이 로그인 방식은 현재 사용할 수 없습니다.';
            break;
        case 'auth/weak-password':
            message = '비밀번호가 너무 약합니다. 6자 이상 입력해 주세요.';
            break;
        case 'auth/user-disabled':
            message = '비활성화된 계정입니다. 고객센터에 문의해 주세요.';
            break;
        case 'auth/user-not-found':
            message = '등록되지 않은 이메일입니다.';
            break;
        case 'auth/wrong-password':
            message = '비밀번호가 올바르지 않습니다.';
            break;
        case 'auth/invalid-credential':
            message = '이메일 또는 비밀번호가 올바르지 않습니다.';
            break;
        case 'auth/too-many-requests':
            message = '너무 많은 시도가 있었습니다. 잠시 후 다시 시도해 주세요.';
            break;
        case 'auth/popup-closed-by-user':
            message = '로그인 창이 닫혔습니다. 다시 시도해 주세요.';
            break;
        case 'auth/network-request-failed':
            message = '네트워크 오류가 발생했습니다. 인터넷 연결을 확인해 주세요.';
            break;
    }
    
    showError(errorElement, message);
}

// ===== Utility Functions =====
function showError(element, message) {
    element.textContent = message;
    element.style.display = 'block';
}

function clearErrors() {
    loginError.style.display = 'none';
    registerError.style.display = 'none';
    resetError.style.display = 'none';
    resetSuccess.style.display = 'none';
}

function showLoading() {
    loadingOverlay.style.display = 'flex';
}

function hideLoading() {
    loadingOverlay.style.display = 'none';
}

function redirectAfterAuth() {
    const urlParams = new URLSearchParams(window.location.search);
    const redirect = urlParams.get('redirect') || '/pages/chat.html';
    const plan = urlParams.get('plan');
    
    if (plan === 'premium') {
        window.location.href = '/src/pages/pricing.html';
    } else {
        window.location.href = redirect;
    }
}

function checkRedirect() {
    const urlParams = new URLSearchParams(window.location.search);
    const action = urlParams.get('action');
    
    if (action === 'register') {
        loginForm.style.display = 'none';
        registerForm.style.display = 'block';
    }
}

// ===== Start =====
document.addEventListener('DOMContentLoaded', init);
