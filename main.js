/**
 * iMomGuide - Main Application Logic
 * Simulates an AI Expert Panel for parenting advice.
 */

// --- Configuration & Data ---

const EXPERTS = {
    doctor: {
        id: 'doctor',
        name: '김소아 원장',
        role: '소아청소년과 전문의',
        avatar: '🩺',
        style: 'doctor',
        intro: "의학적인 관점에서 말씀드리겠습니다.",
        templates: [
            "아이의 증상을 보니 {topic} 관련 증상일 수 있습니다. 체온을 수시로 체크해주시고, 38도 이상이라면 해열제를 교차 복용하는 것이 좋습니다.",
            "이 시기 아이들에게 흔히 나타나는 {topic} 현상입니다. 너무 걱정하지 않으셔도 되지만, 증상이 3일 이상 지속되면 내원하시는 게 좋습니다.",
            "의학적으로 보았을 때 {topic} 부분은 주의가 필요합니다. 집안 습도를 50-60%로 유지해주시는 것이 중요합니다."
        ]
    },
    mom: {
        id: 'mom',
        name: '박경험 맘',
        role: '베테랑 육아맘',
        avatar: '🤱',
        style: 'mom',
        intro: "저도 아이 키울 때 그게 참 힘들더라고요.",
        templates: [
            "제 둘째도 {topic} 때문에 정말 고생했어요. 저는 따뜻한 보리차를 수시로 먹이니까 좀 낫더라고요.",
            "엄마가 죄책감 가지실 필요 없어요. {topic} 문제는 시간이 약이더라고요. 엄마가 편해야 아이도 편해요.",
            "육아템빨이라는 말이 있잖아요? {topic}에는 역시 장비가 중요해요. 제가 써본 것 중에 추천해드릴게요."
        ]
    },
    psych: {
        id: 'psych',
        name: '이심리 박사',
        role: '아동심리 전문가',
        avatar: '🧠',
        style: 'psych',
        intro: "아이의 마음을 먼저 읽어주는 것이 중요합니다.",
        templates: [
            "이 시기 아이는 {topic}을(를) 통해 세상과 소통하려고 합니다. 아이의 감정을 먼저 읽어주세요.",
            "부모님의 불안한 마음이 아이에게 전달될 수 있습니다. {topic} 상황에서는 단호하지만 부드러운 훈육이 필요해요.",
            "아이와의 애착 형성이 가장 중요한 시기입니다. {topic} 행동은 관심 받고 싶다는 신호일 수 있어요."
        ]
    }
};

const PRODUCTS = {
    '열': { name: '브라운 체온계 IRT6520', price: '89,000원', img: '🌡️' },
    '기저귀': { name: '하기스 네이처메이드', price: '45,000원', img: '👶' },
    '분유': { name: '압타밀 프로푸트라', price: '38,000원', img: '🍼' },
    '잠': { name: '머미쿨쿨 좁쌀이불', price: '59,000원', img: '💤' },
    '이유식': { name: '베이비무브 쿡마스터', price: '210,000원', img: '🥣' },
    '장난감': { name: '에듀테이블', price: '48,000원', img: '🧸' }
};

// --- Monetization & Limits ---

class SubscriptionManager {
    constructor() {
        this.isPremium = false;
        this.maxFreeDaily = 3;
        this.loadStatus();
    }

    loadStatus() {
        // Simple local storage mock
        const today = new Date().toDateString();
        const savedDate = localStorage.getItem('lastUsageDate');
        
        if (savedDate !== today) {
            localStorage.setItem('lastUsageDate', today);
            localStorage.setItem('usageCount', '0');
        }

        this.usageCount = parseInt(localStorage.getItem('usageCount') || '0');
        this.updateUI();
    }

    canChat() {
        if (this.isPremium) return true;
        return this.usageCount < this.maxFreeDaily;
    }

    incrementUsage() {
        if (this.isPremium) return;
        this.usageCount++;
        localStorage.setItem('usageCount', this.usageCount.toString());
        this.updateUI();
    }

    togglePremium() {
        this.isPremium = !this.isPremium;
        this.updateUI();
        return this.isPremium;
    }

    updateUI() {
        const counter = document.getElementById('usage-counter');
        const btn = document.getElementById('premium-btn');
        
        if (this.isPremium) {
            counter.textContent = "✨ 프리미엄 회원 (무제한)";
            counter.style.color = "#d32f2f";
            counter.style.fontWeight = "bold";
            btn.textContent = "구독 해지";
        } else {
            const remaining = this.maxFreeDaily - this.usageCount;
            counter.textContent = `무료 이용: ${remaining}/${this.maxFreeDaily}회 남음`;
            counter.style.color = "#333";
            btn.textContent = "프리미엄 구독";
        }
    }
}

// --- Chat Logic ---

class ChatApp {
    constructor() {
        this.subManager = new SubscriptionManager();
        this.chatHistory = document.getElementById('chat-history');
        this.userInput = document.getElementById('user-input');
        this.sendBtn = document.getElementById('send-btn');
        this.premiumBtn = document.getElementById('premium-btn');

        this.initEventListeners();
    }

    initEventListeners() {
        this.sendBtn.addEventListener('click', () => this.handleUserMessage());
        this.userInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.handleUserMessage();
            }
        });

        this.premiumBtn.addEventListener('click', () => {
            const isNowPremium = this.subManager.togglePremium();
            alert(isNowPremium ? "프리미엄 구독이 시작되었습니다! 무제한으로 상담하세요." : "프리미엄 구독이 해지되었습니다.");
        });
    }

    async handleUserMessage() {
        const text = this.userInput.value.trim();
        if (!text) return;

        if (!this.subManager.canChat()) {
            alert("무료 이용 횟수를 모두 소진했습니다. 내일 다시 이용하거나 프리미엄을 구독해주세요!");
            return;
        }

        // 1. Add User Message
        this.addMessage(text, 'user');
        this.userInput.value = '';
        this.subManager.incrementUsage();
        this.scrollToBottom();

        // 2. Extract Keywords (Simple Heuristic)
        const keywords = this.extractKeywords(text);
        const topic = keywords.length > 0 ? keywords[0] : "육아 고민";

        // 3. Simulate Expert Responses Sequence
        this.setLoading(true);

        // Chain expert responses
        await this.simulateExpertResponse(EXPERTS.doctor, topic, 1500);
        await this.simulateExpertResponse(EXPERTS.mom, topic, 2000);
        await this.simulateExpertResponse(EXPERTS.psych, topic, 1500);

        this.setLoading(false);
    }

    extractKeywords(text) {
        // Simple mock keyword extraction for demo
        const potentialKeywords = ['열', '기저귀', '분유', '잠', '수면', '밥', '이유식', '놀이', '장난감', '울음', '훈육'];
        return potentialKeywords.filter(k => text.includes(k));
    }

    addMessage(text, type, expert = null) {
        const msgDiv = document.createElement('div');
        msgDiv.className = `message ${type === 'user' ? 'user-message' : 'expert-message ' + expert?.style}`;
        
        let html = '';
        
        if (expert) {
            html += `
                <div class="message-header">
                    <span>${expert.avatar}</span>
                    <span>${expert.name}</span>
                </div>
            `;
        }

        // Convert newlines to <br>
        const formattedText = text.replace(/\n/g, '<br>');
        html += `<div>${formattedText}</div>`;

        // Check for product recommendations in Expert responses (Mock Logic)
        if (expert && expert.id === 'mom') {
             const product = this.findProduct(text);
             if (product) {
                 html += this.createProductCard(product);
             }
        }

        msgDiv.innerHTML = html;
        this.chatHistory.appendChild(msgDiv);
    }

    findProduct(text) {
        for (const [key, product] of Object.entries(PRODUCTS)) {
            if (text.includes(key)) return product;
        }
        return null;
    }

    createProductCard(product) {
        return `
            <div class="product-rec">
                <div style="font-size: 2rem;">${product.img}</div>
                <div class="product-info">
                    <h4>${product.name}</h4>
                    <p style="font-weight: bold; color: #d32f2f;">${product.price}</p>
                </div>
                <a href="#" class="product-btn" onclick="alert('제휴 링크로 이동합니다: ${product.name}')">구매하기</a>
            </div>
        `;
    }

    async simulateExpertResponse(expert, topic, delay) {
        // Show typing indicator
        const indicator = this.showTypingIndicator(expert);
        this.scrollToBottom();
        
        await new Promise(resolve => setTimeout(resolve, delay));
        
        // Remove indicator
        indicator.remove();

        // Generate Text
        const template = expert.templates[Math.floor(Math.random() * expert.templates.length)];
        let responseText = template.replace('{topic}', topic);
        
        // Add specific product keywords to Mom's response to trigger product card
        if (expert.id === 'mom') {
            const productKey = Object.keys(PRODUCTS).find(k => topic.includes(k));
            if (productKey) {
                responseText += ` 아, 혹시 ${productKey} 고민이시면 이것도 한번 보세요.`;
            }
        }

        this.addMessage(responseText, 'expert', expert);
        this.scrollToBottom();
    }

    showTypingIndicator(expert) {
        const div = document.createElement('div');
        div.className = 'message expert-message ' + expert.style;
        div.innerHTML = `
            <div class="message-header">
                <span>${expert.avatar}</span>
                <span>${expert.name}</span>
                <span class="typing-indicator">작성 중...</span>
            </div>
        `;
        this.chatHistory.appendChild(div);
        return div;
    }

    setLoading(isLoading) {
        this.sendBtn.disabled = isLoading;
        this.userInput.disabled = isLoading;
        if (!isLoading) {
            this.userInput.focus();
        }
    }

    scrollToBottom() {
        this.chatHistory.scrollTop = this.chatHistory.scrollHeight;
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    new ChatApp();
});
