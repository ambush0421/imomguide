// ===== DOM Elements =====
const profileAvatar = document.getElementById('profileAvatar');
const profileName = document.getElementById('profileName');
const profileEmail = document.getElementById('profileEmail');
const membershipBadge = document.getElementById('membershipBadge');
const totalChats = document.getElementById('totalChats');
const joinDate = document.getElementById('joinDate');
const todayRemaining = document.getElementById('todayRemaining');
const upgradeSection = document.getElementById('upgradeSection');
const historyList = document.getElementById('historyList');
const babyCard = document.getElementById('babyCard');
const loadingOverlay = document.getElementById('loadingOverlay');
const logoutBtn = document.getElementById('logoutBtn');
const addBabyBtn = document.getElementById('addBabyBtn');
const babyModal = document.getElementById('babyModal');
const babyForm = document.getElementById('babyForm');

// ===== State =====
let currentUser = null;
let userProfile = null;

// ===== Initialize =====
function init() {
    // Check auth state
    if (window.auth) {
        window.auth.onAuthStateChanged(async (user) => {
            if (user) {
                currentUser = user;
                await loadUserProfile(user);
                await loadChatHistory(user.uid);
                hideLoading();
            } else {
                // Redirect to login
                window.location.href = '/pages/login.html?redirect=/src/pages/mypage.html';
            }
        });
    }
    
    setupEventListeners();
}

// ===== Load User Profile =====
async function loadUserProfile(user) {
    if (!window.db) return;
    try {
        const doc = await window.db.collection('users').doc(user.uid).get();
        
        if (doc.exists) {
            userProfile = doc.data();
            renderProfile(userProfile);
        } else {
            // Create profile if doesn't exist
            userProfile = {
                displayName: user.displayName || '사용자',
                email: user.email,
                photoURL: user.photoURL,
                isPremium: false,
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            };
            await window.db.collection('users').doc(user.uid).set(userProfile);
            renderProfile(userProfile);
        }
    } catch (error) {
        console.error('Failed to load profile:', error);
    }
}

// ===== Render Profile =====
function renderProfile(profile) {
    // Avatar
    if (profile.photoURL) {
        profileAvatar.innerHTML = `<img src="${profile.photoURL}" alt="프로필">`;
    } else {
        profileAvatar.innerHTML = `<span>${getInitial(profile.displayName)}</span>`;
    }
    
    // Name & Email
    profileName.textContent = profile.displayName || '사용자';
    profileEmail.textContent = profile.email;
    
    // Membership Badge
    if (profile.isPremium) {
        membershipBadge.textContent = '프리미엄 회원';
        membershipBadge.classList.add('premium');
        upgradeSection.style.display = 'none';
    } else {
        membershipBadge.textContent = '무료 회원';
        membershipBadge.classList.remove('premium');
        upgradeSection.style.display = 'block';
    }
    
    // Join Date
    if (profile.createdAt) {
        const date = profile.createdAt.toDate ? profile.createdAt.toDate() : new Date(profile.createdAt);
        joinDate.textContent = formatDate(date);
    }
    
    // Today Remaining
    todayRemaining.textContent = UsageTracker.getRemaining();
    
    // Baby Info
    if (profile.babyInfo) {
        renderBabyInfo(profile.babyInfo);
    }
}

// ===== Render Baby Info =====
function renderBabyInfo(babyInfo) {
    const age = calculateAge(new Date(babyInfo.birthdate));
    
    babyCard.innerHTML = `
        <div class="baby-info">
            <div class="baby-avatar">${babyInfo.gender === 'male' ? '👦' : '👧'}</div>
            <div class="baby-details">
                <h3>${babyInfo.nickname}</h3>
                <p class="baby-age">${age}</p>
                <p>${formatDate(new Date(babyInfo.birthdate))} 출생</p>
            </div>
        </div>
        <button class="btn btn-outline" style="margin-top: var(--space-md);" onclick="openBabyModal()">
            정보 수정
        </button>
    `;
}

// ===== Load Chat History =====
async function loadChatHistory(userId) {
    if (!window.db) return;
    try {
        const snapshot = await window.db.collection('chats')
            .where('userId', '==', userId)
            .orderBy('timestamp', 'desc')
            .limit(10)
            .get();
        
        if (snapshot.empty) {
            historyList.innerHTML = `
                <p class="empty-message">상담 기록이 없습니다. AI 전문가에게 첫 질문을 해보세요!</p>
            `;
            totalChats.textContent = '0';
            return;
        }
        
        // Count total chats
        const countSnapshot = await window.db.collection('chats')
            .where('userId', '==', userId)
            .get();
        totalChats.textContent = countSnapshot.size;
        
        // Render history
        let html = '';
        snapshot.forEach(doc => {
            const data = doc.data();
            const date = data.timestamp ? data.timestamp.toDate() : new Date();
            html += `
                <div class="history-item" onclick="viewChat('${doc.id}')">
                    <div class="history-question">${escapeHtml(data.question)}</div>
                    <div class="history-date">${formatDateTime(date)}</div>
                </div>
            `;
        });
        
        historyList.innerHTML = html;
        
    } catch (error) {
        console.error('Failed to load chat history:', error);
        historyList.innerHTML = `
            <p class="empty-message">상담 기록을 불러올 수 없습니다.</p>
        `;
    }
}

// ===== Event Listeners =====
function setupEventListeners() {
    // Logout
    logoutBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        try {
            await window.auth.signOut();
            window.location.href = '/';
        } catch (error) {
            console.error('Logout error:', error);
        }
    });
    
    // Add Baby
    if (addBabyBtn) {
        addBabyBtn.addEventListener('click', openBabyModal);
    }
    
    // Baby Form
    babyForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        await saveBabyInfo();
    });
    
    // Change Password
    document.getElementById('changePasswordBtn').addEventListener('click', async () => {
        if (currentUser && currentUser.email) {
            try {
                await window.auth.sendPasswordResetEmail(currentUser.email);
                alert('비밀번호 재설정 이메일을 보냈습니다.');
            } catch (error) {
                alert('오류가 발생했습니다. 다시 시도해 주세요.');
            }
        }
    });
    
    // Delete Account
    document.getElementById('deleteAccountBtn').addEventListener('click', async () => {
        if (confirm('정말 계정을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
            if (confirm('모든 데이터가 삭제됩니다. 계속하시겠습니까?')) {
                try {
                    // Delete user data
                    if (window.db) {
                        await window.db.collection('users').doc(currentUser.uid).delete();
                    }
                    
                    // Delete user account
                    await currentUser.delete();
                    
                    alert('계정이 삭제되었습니다.');
                    window.location.href = '/';
                } catch (error) {
                    console.error('Delete account error:', error);
                    if (error.code === 'auth/requires-recent-login') {
                        alert('보안을 위해 다시 로그인 후 시도해 주세요.');
                        await window.auth.signOut();
                        window.location.href = '/pages/login.html';
                    } else {
                        alert('오류가 발생했습니다. 다시 시도해 주세요.');
                    }
                }
            }
        }
    });
}

// ===== Baby Modal =====
function openBabyModal() {
    babyModal.style.display = 'flex';
    
    // Pre-fill if exists
    if (userProfile && userProfile.babyInfo) {
        document.getElementById('babyNickname').value = userProfile.babyInfo.nickname;
        document.getElementById('babyBirthdate').value = userProfile.babyInfo.birthdate;
        document.querySelector(`input[name="babyGender"][value="${userProfile.babyInfo.gender}"]`).checked = true;
    }
}

function closeBabyModal() {
    babyModal.style.display = 'none';
    babyForm.reset();
}

async function saveBabyInfo() {
    const nickname = document.getElementById('babyNickname').value.trim();
    const birthdate = document.getElementById('babyBirthdate').value;
    const genderInput = document.querySelector('input[name="babyGender"]:checked');
    const gender = genderInput ? genderInput.value : null;
    
    if (!nickname || !birthdate) {
        alert('모든 필드를 입력해 주세요.');
        return;
    }
    
    try {
        if (window.db) {
            await window.db.collection('users').doc(currentUser.uid).update({
                babyInfo: {
                    nickname,
                    birthdate,
                    gender
                }
            });
        }
        
        userProfile.babyInfo = { nickname, birthdate, gender };
        renderBabyInfo(userProfile.babyInfo);
        closeBabyModal();
        
    } catch (error) {
        console.error('Failed to save baby info:', error);
        alert('저장에 실패했습니다. 다시 시도해 주세요.');
    }
}

// Make closeBabyModal global
window.closeBabyModal = closeBabyModal;
window.openBabyModal = openBabyModal;

// ===== View Chat =====
function viewChat(chatId) {
    // TODO: Implement chat view modal or redirect
    console.log('View chat:', chatId);
}
window.viewChat = viewChat;

// ===== Utility Functions =====
function hideLoading() {
    loadingOverlay.style.display = 'none';
}

function getInitial(name) {
    return name ? name.charAt(0).toUpperCase() : '?';
}

function formatDate(date) {
    return date.toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function formatDateTime(date) {
    return date.toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function calculateAge(birthdate) {
    const today = new Date();
    const birth = new Date(birthdate);
    
    let months = (today.getFullYear() - birth.getFullYear()) * 12;
    months -= birth.getMonth();
    months += today.getMonth();
    
    if (months < 0) months = 0;
    
    if (months < 1) {
        const days = Math.floor((today - birth) / (1000 * 60 * 60 * 24));
        return `생후 ${days}일`;
    } else if (months < 24) {
        return `생후 ${months}개월`;
    } else {
        const years = Math.floor(months / 12);
        const remainingMonths = months % 12;
        return remainingMonths > 0 ? `${years}세 ${remainingMonths}개월` : `${years}세`;
    }
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ===== Start =====
document.addEventListener('DOMContentLoaded', init);
