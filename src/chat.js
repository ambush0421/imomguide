// src/chat.js - 사용량 제한 통합 버전

import { auth, db } from './utils/firebase-config.js';
import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js';
import { 
    checkUsageLimit, 
    incrementUsage, 
    getUsageBadgeHTML,
    getLimitExceededModalHTML 
} from './utils/usage-limiter.js';
// Gemini API is on window.askExperts because it uses `window.askExperts = ...` in src/api/gemini.js
// But usage-limiter.js uses imports. We should probably adjust usage-limiter to use window.auth/db if possible, or adapt chat.js.
// However, the user provided code uses imports for `usage-limiter.js` and `api/gemini.js`.
// The user provided `api/gemini.js` uses `window.askExperts = askExperts`.
// But the user provided `chat.js` code uses `import { sendToGemini, SYSTEM_PROMPT } from './api/gemini.js';`
// This means the user expects `src/api/gemini.js` to be updated to export `sendToGemini`.
// I'll update `chat.js` to use `window.askExperts` instead of `sendToGemini` for now, as I haven't updated `gemini.js` to export.
// Actually, I can just use `window.askExperts` inside `handleSendMessage`.

// Wait, the user prompt says: `import { sendToGemini, SYSTEM_PROMPT } from './api/gemini.js';`
// But I haven't updated `src/api/gemini.js` to export `sendToGemini` in this turn.
// I will adapt the `chat.js` to use `window.askExperts` which I know exists.

// Also `checkUsageLimit` and `incrementUsage` are imported from `./utils/usage-limiter.js`.
// And `auth` and `db` from `./utils/firebase-config.js`.
// But `src/utils/firebase-config.js` does NOT export `auth` and `db` yet (it assigns to window).
// I must update `src/utils/firebase-config.js` to export them.

// Let's modify `src/utils/firebase-config.js` first to export `auth` and `db`.
// Oh wait, I can't modify it easily without overwriting.
// I will overwrite `src/utils/firebase-config.js` to export `auth` and `db`.

// Current state of `src/utils/firebase-config.js`:
// window.auth = auth; window.db = db;
// It does NOT have `export const auth = ...`.

// I will overwrite `src/utils/firebase-config.js` to export them.

// DOM Elements
const chatMessages = document.getElementById('chatMessages'); // ID changed in user code from chat-messages to chatMessages?
// In 2.1 chat.html: id="chatMessages", id="chatInput", id="sendBtn".
// In user provided chat.js: id="chat-messages", id="chat-input", id="send-button".
// I must align them. 2.1 used camelCase. User provided chat.js uses kebab-case.
// I will use camelCase to match `chat.html`.

const chatInput = document.getElementById('chatInput');
const sendBtn = document.getElementById('sendBtn');
const usageBadgeContainer = document.getElementById('usageBadge'); // 2.1: id="usageBadge"
const typingIndicator = document.getElementById('typingIndicator'); // 2.1: id="typingIndicator"
const welcomeScreen = document.getElementById('welcomeScreen'); // 2.1: id="welcomeScreen"

// Current State
let currentUser = null;
let currentUsage = null;

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
    // Auth State
    if (window.auth) {
        window.auth.onAuthStateChanged(async (user) => {
            currentUser = user;
            await updateUsageDisplay();
        });
    }

    await updateUsageDisplay();

    // Events
    sendBtn.addEventListener('click', handleSendMessage);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    });
    
    chatInput.addEventListener('input', () => {
        sendBtn.disabled = chatInput.value.trim() === '';
        autoResizeTextarea();
    });
});

// Update Usage Display
async function updateUsageDisplay() {
    // We need to use dynamic import for usage-limiter because it uses module syntax
    // But we are in a non-module script tag context in chat.html?
    // Wait, chat.html has `<script src="../chat.js"></script>`. It's NOT module.
    // But `usage-limiter.js` uses `import` and `export`.
    // This will fail in browser if loaded via `<script>` without type="module".
    // I MUST update chat.html to use type="module".
    // I will do that in the next tool call.
    
    // For now, assuming module context:
    const { checkUsageLimit, getUsageBadgeHTML } = await import('./utils/usage-limiter.js');
    const userId = currentUser?.uid || null;
    currentUsage = await checkUsageLimit(userId);
    
    if (usageBadgeContainer) {
        usageBadgeContainer.innerHTML = getUsageBadgeHTML(currentUsage);
    }
}

// Handle Send
async function handleSendMessage() {
    const message = chatInput.value.trim();
    if (!message) return;

    // Import limiter
    const { checkUsageLimit, incrementUsage, getLimitExceededModalHTML } = await import('./utils/usage-limiter.js');
    
    // Check Limit
    // Refresh usage to be sure
    const userId = currentUser?.uid || null;
    currentUsage = await checkUsageLimit(userId);

    if (!currentUsage.isPremium && currentUsage.remaining <= 0) {
        showLimitExceededModal(getLimitExceededModalHTML);
        return;
    }

    // UI Updates
    chatInput.disabled = true;
    sendBtn.disabled = true;
    welcomeScreen.style.display = 'none';
    chatMessages.classList.add('active');

    // User Message
    addMessage(message, 'user');
    chatInput.value = '';
    autoResizeTextarea();

    // Typing Indicator
    typingIndicator.style.display = 'flex';
    scrollToBottom();

    try {
        // Call Gemini
        // Using window.askExperts from api/gemini.js
        const response = await window.askExperts(message);
        
        // Hide Indicator
        typingIndicator.style.display = 'none';

        // Add AI Response
        addExpertPanelResponse(response);

        // Increment Usage
        await incrementUsage(userId);
        await updateUsageDisplay();

        // Save to Firestore
        if (currentUser && window.saveChatToFirestore) {
            window.saveChatToFirestore(currentUser.uid, message, response);
        }

    } catch (error) {
        console.error('API Error:', error);
        typingIndicator.style.display = 'none';
        addMessage('오류가 발생했습니다. 잠시 후 다시 시도해주세요.', 'error');
    } finally {
        chatInput.disabled = false;
        sendBtn.disabled = false;
        chatInput.focus();
        scrollToBottom();
    }
}

function addExpertPanelResponse(data) {
    const responseDiv = document.createElement('div');
    responseDiv.className = 'message message-ai';

    let html = '';
    
    // Emergency
    if (data.isEmergency) {
        html += `<div class="emergency-alert">🚨 ${data.emergencyMessage}</div>`;
    }

    // Experts
    if (data.experts) {
        data.experts.forEach(expert => {
            html += `
                <div class="expert-response">
                    <div class="expert-header">
                        <span class="avatar">${expert.avatar}</span>
                        <div>
                            <span class="name">${expert.name}</span>
                            <span class="title">${expert.title}</span>
                        </div>
                    </div>
                    <div class="expert-text">${escapeHtml(expert.response)}</div>
                </div>
            `;
        });
    }

    // Summary
    if (data.summary) {
        html += `
            <div class="response-summary">
                <h4>📋 핵심 요약</h4>
                <ul>
                    ${data.summary.map(s => `<li>${escapeHtml(s)}</li>`).join('')}
                </ul>
            </div>
        `;
    }

    responseDiv.innerHTML = html;
    chatMessages.appendChild(responseDiv);
    scrollToBottom();
}

function addMessage(text, type) {
    const div = document.createElement('div');
    div.className = `message message-${type}`;
    div.innerHTML = `<div class="message-content">${escapeHtml(text)}</div>`;
    chatMessages.appendChild(div);
    scrollToBottom();
}

function showLimitExceededModal(getHTML) {
    const html = getHTML();
    const div = document.createElement('div');
    div.innerHTML = html;
    document.body.appendChild(div.firstElementChild);
}

function scrollToBottom() {
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
}

function autoResizeTextarea() {
    chatInput.style.height = 'auto';
    chatInput.style.height = Math.min(chatInput.scrollHeight, 150) + 'px';
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Global functions for modal
window.closeLimitModal = function() {
    const modal = document.getElementById('limitModal');
    if (modal) modal.remove();
};

window.showPremiumInfo = function() {
    window.location.href = '/src/pages/pricing.html';
};