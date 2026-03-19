/**
 * iMom Intelligence - Advanced Analysis Engine
 * Premium Parenting Intelligence Platform
 * Version 2.0 - Unified Design System
 */

// ============================================
// 1. CONFIGURATION & CONSTANTS
// ============================================

const CONFIG = {
    ANIMATION_DURATION: 300,
    DEBOUNCE_DELAY: 150,
    TOAST_DURATION: 3000,
    CHART_COLORS: {
        primary: '#6366f1',
        secondary: '#8b5cf6',
        accent: '#ec4899',
        success: '#10b981',
        warning: '#f59e0b',
        danger: '#ef4444',
        gradient: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #ec4899 100%)'
    }
};

const STORAGE_KEYS = {
    BIRTHDATE: 'imom_baby_birthdate',
    GENDER: 'imom_baby_gender',
    BABY_NAME: 'imom_baby_name',
    FEEDINGS: 'imom_feedings_v2',
    GROWTH: 'imom_growth_v2',
    SLEEP: 'imom_sleep_v2',
    VACCINES: 'imom_vaccines_v2',
    CHECKLISTS: 'imom_checklists_v1',
    THEME: 'imom_theme',
    ONBOARDING: 'imom_onboarding_complete'
};

// ============================================
// 2. UTILITY FUNCTIONS
// ============================================

const Utils = {
    // Storage helpers
    getStore: (key, defaultValue = []) => {
        try {
            return JSON.parse(localStorage.getItem(key) || JSON.stringify(defaultValue));
        } catch {
            return defaultValue;
        }
    },

    setStore: (key, value) => {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch {
            console.error('Storage error:', key);
            return false;
        }
    },

    // Date helpers
    calculateAge: (birthDate) => {
        const birth = new Date(birthDate);
        const today = new Date();
        const diffTime = today - birth;
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        const months = Math.floor(diffDays / 30.44);
        const years = Math.floor(months / 12);
        const remainingMonths = months % 12;

        return { days: diffDays, months, years, remainingMonths };
    },

    formatDate: (date, format = 'short') => {
        const d = new Date(date);
        const options = format === 'short'
            ? { month: 'short', day: 'numeric' }
            : { year: 'numeric', month: 'long', day: 'numeric' };
        return d.toLocaleDateString('ko-KR', options);
    },

    formatTime: (date) => {
        return new Date(date).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });
    },

    // Debounce helper
    debounce: (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // Animation helper
    animate: (element, animation, duration = CONFIG.ANIMATION_DURATION) => {
        return new Promise(resolve => {
            element.style.animation = `${animation} ${duration}ms ease-out forwards`;
            setTimeout(() => {
                element.style.animation = '';
                resolve();
            }, duration);
        });
    },

    // Generate unique ID
    generateId: () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
};

// ============================================
// 3. EXPERT DATA LIBRARY
// ============================================

const EXPERT_REPORTS = {
    growth: {
        normal: {
            title: "안정적 발달",
            color: "emerald",
            icon: "check-circle",
            message: "정상 범위입니다. 현재 월령에서 가장 중요한 것은 규칙적인 수면입니다. 성장 호르몬의 80%는 밤 10시에서 새벽 2시 사이에 분비됩니다.",
            tips: ["충분한 수면 시간 확보", "균형 잡힌 영양 섭취", "정기적인 야외 활동"]
        },
        overweight: {
            title: "체중 상위권",
            color: "amber",
            icon: "info-circle",
            message: "체중이 다소 높게 측정되었습니다. 하지만 영유아기 비만은 성인 비만과 다르므로 억지로 굶기지 마세요. 대신 활동량을 늘리는 놀이를 제안합니다.",
            tips: ["활동적인 놀이 시간 증가", "간식 횟수 조절", "TV 시청 시간 제한"]
        },
        underweight: {
            title: "체중 하위권",
            color: "rose",
            icon: "exclamation-circle",
            message: "체중이 하위권입니다. 수유량이나 식사량을 10% 정도 늘려보시고, 변 상태를 체크해 보세요. 흡수율이 낮을 수 있습니다.",
            tips: ["수유/식사량 점진적 증가", "철분 섭취 확인", "소화 상태 모니터링"]
        }
    },

    milestones: {
        0: {
            title: "신생아: 반사 신경의 신비",
            description: "아기의 손바닥을 건드리면 꽉 쥐는 '파악 반사'는 원시적인 생존 본능입니다. 이 시기엔 엄마의 심장 소리를 들려주는 것이 가장 큰 안정제입니다.",
            keyPoints: ["파악 반사", "모로 반사", "흡철 반사"],
            activity: "피부 접촉, 심장 소리 들려주기",
            warning: "2주 이상 황달이 지속되면 병원 방문"
        },
        3: {
            title: "3개월: 사회적 미소의 시작",
            description: "아기가 당신을 보고 웃기 시작합니다. 이것은 단순한 반사가 아닌 진정한 '사회적 미소'입니다. 많이 웃어주세요.",
            keyPoints: ["목 가누기", "사회적 미소", "옹알이 시작"],
            activity: "거울 놀이, 다양한 표정 보여주기",
            warning: "3개월에도 눈 맞춤이 없다면 상담 필요"
        },
        6: {
            title: "6개월: 이유식과 알레르기",
            description: "새로운 식재료를 추가할 땐 반드시 오전 중에 하세요. 그래야 알레르기 반응이 나타났을 때 즉시 병원에 갈 수 있습니다.",
            keyPoints: ["이유식 시작", "앉기 시도", "낯가림 시작"],
            activity: "다양한 질감의 음식 탐색",
            warning: "철분 보충이 필수인 시기"
        },
        9: {
            title: "9개월: 탐험가의 탄생",
            description: "기어다니기 시작하면서 세상 탐험에 나섭니다. 안전사고에 주의하고, '안 돼'라는 말을 일관되게 사용하기 시작하세요.",
            keyPoints: ["기어다니기", "손가락 집기", "대상영속성"],
            activity: "까꿍 놀이, 물건 찾기 놀이",
            warning: "작은 물건 삼킴 사고 주의"
        },
        12: {
            title: "첫 돌: 언어 지능의 기초",
            description: "아기는 이제 '안 돼'라는 말을 이해합니다. 단호한 표정과 따뜻한 목소리를 구분해서 사용해 주세요.",
            keyPoints: ["첫 걸음마", "첫 단어", "간단한 지시 이해"],
            activity: "그림책 읽기, 손가락으로 가리키기",
            warning: "18개월까지 단어가 없으면 언어 평가 고려"
        },
        18: {
            title: "18개월: 재접근기의 시작",
            description: "갑자기 아기가 껌딱지가 되었나요? 이는 세상이 무서워 다시 엄마라는 안전 기지로 돌아오는 자연스러운 과정입니다. 더 많이 안아주세요.",
            keyPoints: ["독립심과 불안의 공존", "언어 폭발기", "모방 놀이"],
            activity: "소꿉놀이, 역할 놀이",
            warning: "분리불안이 심하면 일시적으로 떨어지는 시간을 줄이세요"
        },
        24: {
            title: "24개월: 자아의 발견",
            description: "'싫어!', '내 거!'가 입버릇이 됩니다. 미운 두 살이 아니라 자아가 발달하는 건강한 신호입니다.",
            keyPoints: ["두 단어 조합", "자기 주장", "대소변 훈련 준비"],
            activity: "간단한 선택지 제공하기",
            warning: "지나친 통제는 역효과"
        },
        36: {
            title: "36개월: 사회성의 시작",
            description: "또래와의 놀이가 중요해집니다. 아직 '함께' 노는 것보다 '나란히' 노는 병행 놀이가 자연스럽습니다.",
            keyPoints: ["상상 놀이", "친구 개념", "규칙 이해 시작"],
            activity: "역할 놀이, 간단한 보드게임",
            warning: "공격적 행동이 지속되면 전문가 상담"
        }
    },

    vaccines: [
        { age: 0, name: "B형간염 1차", required: true },
        { age: 0, name: "BCG (피내용)", required: true },
        { age: 1, name: "B형간염 2차", required: true },
        { age: 2, name: "DTaP 1차", required: true },
        { age: 2, name: "IPV 1차", required: true },
        { age: 2, name: "Hib 1차", required: true },
        { age: 2, name: "PCV 1차", required: true },
        { age: 2, name: "로타바이러스 1차", required: false },
        { age: 4, name: "DTaP 2차", required: true },
        { age: 4, name: "IPV 2차", required: true },
        { age: 4, name: "Hib 2차", required: true },
        { age: 4, name: "PCV 2차", required: true },
        { age: 6, name: "B형간염 3차", required: true },
        { age: 6, name: "DTaP 3차", required: true },
        { age: 6, name: "IPV 3차", required: true },
        { age: 6, name: "Hib 3차", required: true },
        { age: 6, name: "PCV 3차", required: true },
        { age: 6, name: "인플루엔자 (매년)", required: true },
        { age: 12, name: "MMR 1차", required: true },
        { age: 12, name: "수두 1차", required: true },
        { age: 12, name: "일본뇌염 (사백신) 1-2차", required: true },
        { age: 12, name: "Hib 4차", required: true },
        { age: 12, name: "PCV 4차", required: true },
        { age: 12, name: "A형간염 1-2차", required: true },
        { age: 15, name: "DTaP 4차", required: true },
        { age: 18, name: "DTaP 5차 (4-6세)", required: true }
    ]
};

// ============================================
// 4. UI COMPONENTS
// ============================================

const UI = {
    // Toast Notification System
    toast: (message, type = 'info') => {
        const colors = {
            success: 'from-emerald-500 to-green-600',
            error: 'from-rose-500 to-red-600',
            warning: 'from-amber-500 to-orange-600',
            info: 'from-indigo-500 to-purple-600'
        };

        const icons = {
            success: 'check-circle',
            error: 'exclamation-circle',
            warning: 'exclamation-triangle',
            info: 'info-circle'
        };

        // Remove existing toasts
        document.querySelectorAll('.imom-toast').forEach(t => t.remove());

        const toast = document.createElement('div');
        toast.className = `imom-toast fixed top-24 right-6 z-50 bg-gradient-to-r ${colors[type]} text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 transform translate-x-full transition-transform duration-300`;
        toast.innerHTML = `
            <i class="fas fa-${icons[type]} text-xl"></i>
            <span class="font-medium">${message}</span>
        `;

        document.body.appendChild(toast);

        // Animate in
        requestAnimationFrame(() => {
            toast.classList.remove('translate-x-full');
            toast.classList.add('translate-x-0');
        });

        // Remove after delay
        setTimeout(() => {
            toast.classList.remove('translate-x-0');
            toast.classList.add('translate-x-full');
            setTimeout(() => toast.remove(), 300);
        }, CONFIG.TOAST_DURATION);
    },

    // Loading Spinner
    showLoading: (container) => {
        if (typeof container === 'string') {
            container = document.getElementById(container);
        }
        if (!container) return;

        container.innerHTML = `
            <div class="flex flex-col items-center justify-center py-20 animate-fade-in">
                <div class="relative">
                    <div class="w-16 h-16 border-4 border-indigo-100 rounded-full"></div>
                    <div class="w-16 h-16 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin absolute inset-0"></div>
                </div>
                <p class="mt-6 text-slate-500 font-medium">데이터 분석 중...</p>
            </div>
        `;
    },

    // Empty State
    showEmpty: (container, message = '데이터가 없습니다', icon = 'inbox') => {
        if (typeof container === 'string') {
            container = document.getElementById(container);
        }
        if (!container) return;

        container.innerHTML = `
            <div class="flex flex-col items-center justify-center py-20 animate-fade-in">
                <div class="w-20 h-20 bg-slate-100 rounded-3xl flex items-center justify-center mb-6">
                    <i class="fas fa-${icon} text-3xl text-slate-300"></i>
                </div>
                <p class="text-slate-400 font-medium text-center">${message}</p>
            </div>
        `;
    },

    // Modal System
    showModal: (options) => {
        const { title, content, onConfirm, onCancel, confirmText = '확인', cancelText = '취소', type = 'default' } = options;

        // Remove existing modals
        document.querySelectorAll('.imom-modal-overlay').forEach(m => m.remove());

        const modal = document.createElement('div');
        modal.className = 'imom-modal-overlay fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm opacity-0 transition-opacity duration-300';

        const typeColors = {
            default: 'indigo',
            danger: 'rose',
            success: 'emerald'
        };
        const color = typeColors[type];

        modal.innerHTML = `
            <div class="imom-modal bg-white rounded-3xl shadow-2xl max-w-md w-full transform scale-95 transition-transform duration-300 overflow-hidden">
                <div class="p-8">
                    <h3 class="text-2xl font-black text-slate-900 mb-4">${title}</h3>
                    <div class="text-slate-600 leading-relaxed">${content}</div>
                </div>
                <div class="flex border-t border-slate-100">
                    ${onCancel ? `<button class="modal-cancel flex-1 py-4 font-bold text-slate-500 hover:bg-slate-50 transition">${cancelText}</button>` : ''}
                    <button class="modal-confirm flex-1 py-4 font-bold text-${color}-600 hover:bg-${color}-50 transition ${onCancel ? 'border-l border-slate-100' : ''}">${confirmText}</button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        document.body.style.overflow = 'hidden';

        // Animate in
        requestAnimationFrame(() => {
            modal.classList.remove('opacity-0');
            modal.classList.add('opacity-100');
            modal.querySelector('.imom-modal').classList.remove('scale-95');
            modal.querySelector('.imom-modal').classList.add('scale-100');
        });

        // Event handlers
        const closeModal = () => {
            modal.classList.remove('opacity-100');
            modal.classList.add('opacity-0');
            document.body.style.overflow = '';
            setTimeout(() => modal.remove(), 300);
        };

        modal.querySelector('.modal-confirm').addEventListener('click', () => {
            if (onConfirm) onConfirm();
            closeModal();
        });

        if (onCancel) {
            modal.querySelector('.modal-cancel').addEventListener('click', () => {
                onCancel();
                closeModal();
            });
        }

        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });
    },

    // Progress Ring
    createProgressRing: (percent, size = 120, strokeWidth = 8) => {
        const radius = (size - strokeWidth) / 2;
        const circumference = radius * 2 * Math.PI;
        const offset = circumference - (percent / 100) * circumference;

        return `
            <svg width="${size}" height="${size}" class="transform -rotate-90">
                <circle cx="${size / 2}" cy="${size / 2}" r="${radius}" 
                        stroke="#e2e8f0" stroke-width="${strokeWidth}" fill="none"/>
                <circle cx="${size / 2}" cy="${size / 2}" r="${radius}" 
                        stroke="url(#gradient)" stroke-width="${strokeWidth}" fill="none"
                        stroke-linecap="round"
                        stroke-dasharray="${circumference}"
                        stroke-dashoffset="${offset}"
                        class="transition-all duration-1000 ease-out"/>
                <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" style="stop-color:#6366f1"/>
                        <stop offset="100%" style="stop-color:#ec4899"/>
                    </linearGradient>
                </defs>
            </svg>
        `;
    }
};

// ============================================
// 5. CORE FUNCTIONALITY
// ============================================

// Baby Info Management
const BabyInfo = {
    update: function () {
        const birthdateInput = document.getElementById('global-birthdate');
        const nameInput = document.getElementById('global-babyname');
        const genderSelect = document.getElementById('global-gender');

        if (!birthdateInput?.value) {
            UI.toast('생년월일을 입력해주세요', 'warning');
            return;
        }

        const birthdate = birthdateInput.value;
        const name = nameInput?.value || '우리 아기';
        const gender = genderSelect?.value || 'unknown';

        Utils.setStore(STORAGE_KEYS.BIRTHDATE, birthdate);
        Utils.setStore(STORAGE_KEYS.BABY_NAME, name);
        Utils.setStore(STORAGE_KEYS.GENDER, gender);

        this.displayInfo();
        UI.toast('아기 정보가 저장되었습니다', 'success');
    },

    displayInfo: function () {
        const birthdate = Utils.getStore(STORAGE_KEYS.BIRTHDATE, null);
        if (!birthdate) return;

        const age = Utils.calculateAge(birthdate);
        const name = Utils.getStore(STORAGE_KEYS.BABY_NAME, '우리 아기');

        // Update age display
        const ageDisplay = document.getElementById('global-age-display');
        if (ageDisplay) {
            let ageText = '';
            if (age.years > 0) {
                ageText = `${age.years}년 ${age.remainingMonths}개월차`;
            } else {
                ageText = `${age.months}개월차`;
            }
            ageDisplay.innerHTML = `
                <span class="text-indigo-600 font-black">${name}</span> 
                <span class="text-slate-500">${ageText} 육아 중</span>
            `;
        }

        // Show daily insight
        this.showInsight(age.months);
    },

    showInsight: function (months) {
        const insightBox = document.getElementById('daily-insight');
        if (!insightBox) return;

        // Find appropriate milestone
        const milestoneKeys = Object.keys(EXPERT_REPORTS.milestones).map(Number).sort((a, b) => b - a);
        const matchingKey = milestoneKeys.find(k => k <= months) || 0;
        const milestone = EXPERT_REPORTS.milestones[matchingKey];

        insightBox.classList.remove('hidden');
        insightBox.innerHTML = `
            <div class="bg-gradient-to-br from-indigo-50 via-white to-purple-50 rounded-3xl p-8 border border-indigo-100 animate-fade-in">
                <div class="flex items-start gap-6">
                    <div class="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-indigo-200">
                        <i class="fas fa-lightbulb text-white text-xl"></i>
                    </div>
                    <div class="flex-1">
                        <p class="text-xs font-black text-indigo-600 uppercase tracking-widest mb-2">Today's Insight</p>
                        <h4 class="text-xl font-black text-slate-900 mb-3">${milestone.title}</h4>
                        <p class="text-slate-600 leading-relaxed mb-4">${milestone.description}</p>
                        
                        <div class="flex flex-wrap gap-2 mb-4">
                            ${milestone.keyPoints.map(point => `
                                <span class="px-3 py-1 bg-white rounded-full text-xs font-bold text-indigo-600 border border-indigo-100">${point}</span>
                            `).join('')}
                        </div>
                        
                        <div class="flex flex-col sm:flex-row gap-4 text-sm">
                            <div class="flex items-center gap-2 text-emerald-600">
                                <i class="fas fa-play-circle"></i>
                                <span class="font-medium">${milestone.activity}</span>
                            </div>
                            <div class="flex items-center gap-2 text-amber-600">
                                <i class="fas fa-exclamation-triangle"></i>
                                <span class="font-medium">${milestone.warning}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    load: function () {
        const birthdate = Utils.getStore(STORAGE_KEYS.BIRTHDATE, null);
        const name = Utils.getStore(STORAGE_KEYS.BABY_NAME, null);
        const gender = Utils.getStore(STORAGE_KEYS.GENDER, null);

        if (birthdate) {
            const birthdateInput = document.getElementById('global-birthdate');
            if (birthdateInput) birthdateInput.value = birthdate;
        }

        if (name) {
            const nameInput = document.getElementById('global-babyname');
            if (nameInput) nameInput.value = name;
        }

        if (gender) {
            const genderSelect = document.getElementById('global-gender');
            if (genderSelect) genderSelect.value = gender;
        }

        if (birthdate) {
            this.displayInfo();
        }
    }
};

// Tab System
const TabSystem = {
    currentTab: null,

    switch: function (tabId) {
        if (this.currentTab === tabId) return;
        this.currentTab = tabId;

        // Update tab buttons
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('tab-active', 'bg-white', 'shadow-lg', 'text-indigo-600');
            btn.classList.add('text-slate-500');
        });

        const activeBtn = document.getElementById(`tab-${tabId}`);
        if (activeBtn) {
            activeBtn.classList.add('tab-active', 'bg-white', 'shadow-lg', 'text-indigo-600');
            activeBtn.classList.remove('text-slate-500');
        }

        // Load content
        const container = document.getElementById('tab-content');
        if (!container) return;

        UI.showLoading(container);

        setTimeout(() => {
            switch (tabId) {
                case 'growth':
                    GrowthTracker.render(container);
                    break;
                case 'feeding':
                    FeedingTracker.render(container);
                    break;
                case 'sleep':
                    SleepTracker.render(container);
                    break;
                case 'vaccine':
                    VaccineTracker.render(container);
                    break;
                case 'calculator':
                    Calculators.render(container);
                    break;
                default:
                    UI.showEmpty(container, '준비 중인 기능입니다', 'tools');
            }
        }, CONFIG.ANIMATION_DURATION);
    }
};

// Growth Tracker Module
const GrowthTracker = {
    render: function (container) {
        const data = Utils.getStore(STORAGE_KEYS.GROWTH);
        const latestRecord = data[data.length - 1];

        container.innerHTML = `
            <div class="grid lg:grid-cols-2 gap-8 animate-fade-in">
                <!-- Input Card -->
                <div class="content-card bg-white">
                    <div class="flex items-center gap-4 mb-8">
                        <div class="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200">
                            <i class="fas fa-ruler-vertical text-white"></i>
                        </div>
                        <div>
                            <h3 class="text-xl font-black text-slate-900">성장 지표 입력</h3>
                            <p class="text-sm text-slate-500">정확한 수치를 입력해주세요</p>
                        </div>
                    </div>
                    
                    <div class="space-y-6">
                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <label class="block text-sm font-bold text-slate-700 mb-2">신장 (cm)</label>
                                <input type="number" id="growth-height" step="0.1" placeholder="예: 75.5"
                                       class="w-full p-4 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 transition font-medium"
                                       value="${latestRecord?.height || ''}">
                            </div>
                            <div>
                                <label class="block text-sm font-bold text-slate-700 mb-2">체중 (kg)</label>
                                <input type="number" id="growth-weight" step="0.1" placeholder="예: 9.5"
                                       class="w-full p-4 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 transition font-medium"
                                       value="${latestRecord?.weight || ''}">
                            </div>
                        </div>
                        
                        <div>
                            <label class="block text-sm font-bold text-slate-700 mb-2">머리둘레 (cm) <span class="text-slate-400 font-normal">선택</span></label>
                            <input type="number" id="growth-head" step="0.1" placeholder="예: 45.0"
                                   class="w-full p-4 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 transition font-medium"
                                   value="${latestRecord?.head || ''}">
                        </div>
                        
                        <div>
                            <label class="block text-sm font-bold text-slate-700 mb-2">측정일</label>
                            <input type="date" id="growth-date" 
                                   class="w-full p-4 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 transition font-medium"
                                   value="${new Date().toISOString().split('T')[0]}">
                        </div>
                        
                        <button onclick="GrowthTracker.save()" 
                                class="w-full py-5 btn-primary text-white rounded-2xl font-black text-lg flex items-center justify-center gap-3 group">
                            <span>데이터 정밀 분석</span>
                            <i class="fas fa-arrow-right transition group-hover:translate-x-1"></i>
                        </button>
                    </div>
                </div>
                
                <!-- Report Card -->
                <div id="growth-report" class="content-card bg-gradient-to-br from-slate-900 to-slate-800 text-white min-h-[500px] relative overflow-hidden">
                    <div class="absolute -bottom-20 -right-20 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl"></div>
                    <div class="absolute top-10 right-10 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl"></div>
                    ${this.renderReport(data)}
                </div>
            </div>
            
            <!-- History -->
            ${data.length > 0 ? this.renderHistory(data) : ''}
        `;
    },

    renderReport: function (data) {
        if (data.length === 0) {
            return `
                <div class="relative z-10 h-full flex flex-col items-center justify-center text-center">
                    <div class="w-20 h-20 bg-white/10 rounded-3xl flex items-center justify-center mb-6">
                        <i class="fas fa-chart-line text-3xl text-indigo-400"></i>
                    </div>
                    <p class="text-slate-400 font-medium">기록된 데이터가 없습니다</p>
                    <p class="text-slate-500 text-sm mt-2">오늘의 성장을 기록해 보세요</p>
                </div>
            `;
        }

        const latest = data[data.length - 1];
        const report = EXPERT_REPORTS.growth.normal; // 실제 구현 시 계산 로직 추가

        // Calculate mock percentiles (실제 구현 시 WHO 데이터와 비교)
        const heightPercentile = Math.floor(Math.random() * 30) + 35;
        const weightPercentile = Math.floor(Math.random() * 30) + 35;

        return `
            <div class="relative z-10 animate-fade-in">
                <div class="flex items-center gap-3 mb-6">
                    <div class="w-10 h-10 bg-${report.color}-500/20 rounded-xl flex items-center justify-center">
                        <i class="fas fa-${report.icon} text-${report.color}-400"></i>
                    </div>
                    <span class="text-xs font-black uppercase tracking-widest text-indigo-400">AI Analysis Report</span>
                </div>
                
                <h4 class="text-3xl font-black mb-2">
                    분석 결과: <span class="text-${report.color}-400">${report.title}</span>
                </h4>
                <p class="text-slate-400 text-sm mb-8">${Utils.formatDate(latest.date, 'long')} 측정 기준</p>
                
                <p class="text-indigo-100/80 leading-relaxed mb-8">${report.message}</p>
                
                <div class="grid grid-cols-2 gap-4 mb-8">
                    <div class="bg-white/5 backdrop-blur rounded-2xl p-6 border border-white/10 text-center">
                        <p class="text-xs uppercase text-slate-500 mb-2">Height Rank</p>
                        <p class="text-3xl font-black text-white">Top ${100 - heightPercentile}%</p>
                        <p class="text-sm text-indigo-400 mt-1">${latest.height}cm</p>
                    </div>
                    <div class="bg-white/5 backdrop-blur rounded-2xl p-6 border border-white/10 text-center">
                        <p class="text-xs uppercase text-slate-500 mb-2">Weight Rank</p>
                        <p class="text-3xl font-black text-white">Top ${100 - weightPercentile}%</p>
                        <p class="text-sm text-indigo-400 mt-1">${latest.weight}kg</p>
                    </div>
                </div>
                
                <div class="bg-white/5 rounded-2xl p-4 border border-white/10">
                    <p class="text-xs font-bold text-indigo-400 mb-3"><i class="fas fa-lightbulb mr-2"></i>전문가 팁</p>
                    <ul class="space-y-2">
                        ${report.tips.map(tip => `
                            <li class="flex items-center gap-2 text-sm text-slate-300">
                                <i class="fas fa-check text-emerald-400 text-xs"></i>
                                <span>${tip}</span>
                            </li>
                        `).join('')}
                    </ul>
                </div>
            </div>
        `;
    },

    renderHistory: function (data) {
        const sortedData = [...data].reverse().slice(0, 5);

        return `
            <div class="mt-12 animate-fade-in">
                <h4 class="text-xl font-black text-slate-900 mb-6 flex items-center gap-3">
                    <i class="fas fa-history text-indigo-500"></i>
                    최근 기록
                </h4>
                <div class="bg-white rounded-3xl border border-slate-100 overflow-hidden">
                    <div class="grid grid-cols-4 gap-4 p-4 bg-slate-50 text-sm font-bold text-slate-500">
                        <span>날짜</span>
                        <span class="text-center">신장</span>
                        <span class="text-center">체중</span>
                        <span class="text-center">머리둘레</span>
                    </div>
                    ${sortedData.map((record, i) => `
                        <div class="grid grid-cols-4 gap-4 p-4 border-t border-slate-100 items-center hover:bg-slate-50 transition ${i === 0 ? 'bg-indigo-50/50' : ''}">
                            <span class="text-sm text-slate-600">${Utils.formatDate(record.date)}</span>
                            <span class="text-center font-bold text-slate-800">${record.height}cm</span>
                            <span class="text-center font-bold text-slate-800">${record.weight}kg</span>
                            <span class="text-center font-bold text-slate-800">${record.head || '-'}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    },

    save: function () {
        const height = document.getElementById('growth-height')?.value;
        const weight = document.getElementById('growth-weight')?.value;
        const head = document.getElementById('growth-head')?.value;
        const date = document.getElementById('growth-date')?.value;

        if (!height || !weight) {
            UI.toast('신장과 체중을 입력해주세요', 'warning');
            return;
        }

        const data = Utils.getStore(STORAGE_KEYS.GROWTH);
        data.push({
            id: Utils.generateId(),
            height: parseFloat(height),
            weight: parseFloat(weight),
            head: head ? parseFloat(head) : null,
            date: date || new Date().toISOString()
        });

        Utils.setStore(STORAGE_KEYS.GROWTH, data);

        // Re-render
        const container = document.getElementById('tab-content');
        this.render(container);

        UI.toast('성장 기록이 저장되었습니다', 'success');
    }
};

// Feeding Tracker Module
const FeedingTracker = {
    render: function (container) {
        const data = Utils.getStore(STORAGE_KEYS.FEEDINGS);
        const todayFeedings = this.getTodayFeedings(data);

        container.innerHTML = `
            <div class="grid lg:grid-cols-3 gap-8 animate-fade-in">
                <!-- Quick Add -->
                <div class="lg:col-span-2 content-card bg-white">
                    <div class="flex items-center gap-4 mb-8">
                        <div class="w-12 h-12 bg-gradient-to-br from-cyan-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg shadow-cyan-200">
                            <i class="fas fa-baby-carriage text-white"></i>
                        </div>
                        <div>
                            <h3 class="text-xl font-black text-slate-900">수유 기록</h3>
                            <p class="text-sm text-slate-500">수유 유형을 선택하세요</p>
                        </div>
                    </div>
                    
                    <div class="grid grid-cols-3 gap-4 mb-8">
                        <button onclick="FeedingTracker.quickAdd('breast')" 
                                class="p-6 rounded-2xl bg-pink-50 border-2 border-pink-100 hover:border-pink-300 transition group">
                            <div class="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm group-hover:scale-110 transition">
                                <i class="fas fa-heart text-2xl text-pink-500"></i>
                            </div>
                            <p class="font-bold text-slate-800">모유</p>
                            <p class="text-xs text-slate-500 mt-1">직수/유축</p>
                        </button>
                        
                        <button onclick="FeedingTracker.quickAdd('formula')"
                                class="p-6 rounded-2xl bg-blue-50 border-2 border-blue-100 hover:border-blue-300 transition group">
                            <div class="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm group-hover:scale-110 transition">
                                <i class="fas fa-prescription-bottle text-2xl text-blue-500"></i>
                            </div>
                            <p class="font-bold text-slate-800">분유</p>
                            <p class="text-xs text-slate-500 mt-1">ml 단위</p>
                        </button>
                        
                        <button onclick="FeedingTracker.quickAdd('solid')"
                                class="p-6 rounded-2xl bg-amber-50 border-2 border-amber-100 hover:border-amber-300 transition group">
                            <div class="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm group-hover:scale-110 transition">
                                <i class="fas fa-utensils text-2xl text-amber-500"></i>
                            </div>
                            <p class="font-bold text-slate-800">이유식</p>
                            <p class="text-xs text-slate-500 mt-1">고형식</p>
                        </button>
                    </div>
                    
                    <!-- Detail Input (Hidden by default) -->
                    <div id="feeding-detail" class="hidden">
                        <div class="p-6 bg-slate-50 rounded-2xl space-y-4">
                            <div class="grid grid-cols-2 gap-4">
                                <div>
                                    <label class="block text-sm font-bold text-slate-700 mb-2">양 (ml/분)</label>
                                    <input type="number" id="feeding-amount" 
                                           class="w-full p-4 bg-white rounded-xl outline-none focus:ring-2 focus:ring-indigo-500">
                                </div>
                                <div>
                                    <label class="block text-sm font-bold text-slate-700 mb-2">시간</label>
                                    <input type="time" id="feeding-time" 
                                           class="w-full p-4 bg-white rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                                           value="${new Date().toTimeString().slice(0, 5)}">
                                </div>
                            </div>
                            <div>
                                <label class="block text-sm font-bold text-slate-700 mb-2">메모 (선택)</label>
                                <input type="text" id="feeding-memo" placeholder="예: 잘 먹었음"
                                       class="w-full p-4 bg-white rounded-xl outline-none focus:ring-2 focus:ring-indigo-500">
                            </div>
                            <button onclick="FeedingTracker.save()" 
                                    class="w-full py-4 bg-slate-900 text-white rounded-xl font-bold hover:bg-black transition">
                                기록 저장
                            </button>
                        </div>
                    </div>
                </div>
                
                <!-- Today Summary -->
                <div class="content-card bg-gradient-to-br from-cyan-500 to-teal-600 text-white">
                    <h4 class="text-lg font-bold mb-6 flex items-center gap-2">
                        <i class="fas fa-calendar-day"></i>
                        오늘의 수유
                    </h4>
                    
                    <div class="text-center mb-8">
                        <p class="text-5xl font-black">${todayFeedings.length}</p>
                        <p class="text-cyan-100 mt-2">회 수유</p>
                    </div>
                    
                    <div class="space-y-3">
                        <div class="flex justify-between items-center bg-white/10 rounded-xl p-4">
                            <span class="text-cyan-100">모유</span>
                            <span class="font-bold">${todayFeedings.filter(f => f.type === 'breast').length}회</span>
                        </div>
                        <div class="flex justify-between items-center bg-white/10 rounded-xl p-4">
                            <span class="text-cyan-100">분유</span>
                            <span class="font-bold">${todayFeedings.filter(f => f.type === 'formula').reduce((sum, f) => sum + (f.amount || 0), 0)}ml</span>
                        </div>
                        <div class="flex justify-between items-center bg-white/10 rounded-xl p-4">
                            <span class="text-cyan-100">이유식</span>
                            <span class="font-bold">${todayFeedings.filter(f => f.type === 'solid').length}회</span>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Today's Timeline -->
            ${this.renderTimeline(todayFeedings)}
        `;
    },

    getTodayFeedings: function (data) {
        const today = new Date().toDateString();
        return data.filter(f => new Date(f.date).toDateString() === today);
    },

    renderTimeline: function (feedings) {
        if (feedings.length === 0) return '';

        const typeConfig = {
            breast: { icon: 'heart', color: 'pink', label: '모유' },
            formula: { icon: 'prescription-bottle', color: 'blue', label: '분유' },
            solid: { icon: 'utensils', color: 'amber', label: '이유식' }
        };

        return `
            <div class="mt-8 content-card bg-white animate-fade-in">
                <h4 class="text-lg font-black text-slate-900 mb-6">오늘 기록</h4>
                <div class="space-y-4">
                    ${feedings.reverse().map(f => {
            const config = typeConfig[f.type];
            return `
                            <div class="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl">
                                <div class="w-10 h-10 bg-${config.color}-100 rounded-xl flex items-center justify-center">
                                    <i class="fas fa-${config.icon} text-${config.color}-500"></i>
                                </div>
                                <div class="flex-1">
                                    <p class="font-bold text-slate-800">${config.label}</p>
                                    <p class="text-sm text-slate-500">${f.amount ? f.amount + (f.type === 'breast' ? '분' : 'ml') : ''} ${f.memo || ''}</p>
                                </div>
                                <span class="text-sm text-slate-400">${Utils.formatTime(f.date)}</span>
                            </div>
                        `;
        }).join('')}
                </div>
            </div>
        `;
    },

    selectedType: null,

    quickAdd: function (type) {
        this.selectedType = type;
        const detailDiv = document.getElementById('feeding-detail');
        detailDiv.classList.remove('hidden');

        const amountInput = document.getElementById('feeding-amount');
        if (type === 'breast') {
            amountInput.placeholder = '수유 시간 (분)';
        } else if (type === 'formula') {
            amountInput.placeholder = '분유량 (ml)';
        } else {
            amountInput.placeholder = '식사량 (g)';
        }
    },

    save: function () {
        if (!this.selectedType) return;

        const amount = document.getElementById('feeding-amount')?.value;
        const time = document.getElementById('feeding-time')?.value;
        const memo = document.getElementById('feeding-memo')?.value;

        const data = Utils.getStore(STORAGE_KEYS.FEEDINGS);
        const now = new Date();

        if (time) {
            const [hours, minutes] = time.split(':');
            now.setHours(parseInt(hours), parseInt(minutes));
        }

        data.push({
            id: Utils.generateId(),
            type: this.selectedType,
            amount: amount ? parseFloat(amount) : null,
            memo: memo || null,
            date: now.toISOString()
        });

        Utils.setStore(STORAGE_KEYS.FEEDINGS, data);

        const container = document.getElementById('tab-content');
        this.render(container);

        UI.toast('수유 기록이 저장되었습니다', 'success');
    }
};

// Sleep Tracker Module
const SleepTracker = {
    render: function (container) {
        const data = Utils.getStore(STORAGE_KEYS.SLEEP);

        container.innerHTML = `
            <div class="grid lg:grid-cols-2 gap-8 animate-fade-in">
                <div class="content-card bg-white">
                    <div class="flex items-center gap-4 mb-8">
                        <div class="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200">
                            <i class="fas fa-moon text-white"></i>
                        </div>
                        <div>
                            <h3 class="text-xl font-black text-slate-900">수면 기록</h3>
                            <p class="text-sm text-slate-500">수면 시작/종료 시간을 기록하세요</p>
                        </div>
                    </div>
                    
                    <div class="space-y-6">
                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <label class="block text-sm font-bold text-slate-700 mb-2">취침 시간</label>
                                <input type="datetime-local" id="sleep-start" 
                                       class="w-full p-4 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500">
                            </div>
                            <div>
                                <label class="block text-sm font-bold text-slate-700 mb-2">기상 시간</label>
                                <input type="datetime-local" id="sleep-end" 
                                       class="w-full p-4 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500">
                            </div>
                        </div>
                        
                        <div class="flex gap-4">
                            <button onclick="SleepTracker.quickStart()" 
                                    class="flex-1 py-4 bg-indigo-100 text-indigo-600 rounded-2xl font-bold hover:bg-indigo-200 transition flex items-center justify-center gap-2">
                                <i class="fas fa-play"></i>
                                지금 재우기
                            </button>
                            <button onclick="SleepTracker.save()" 
                                    class="flex-1 py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-black transition">
                                기록 저장
                            </button>
                        </div>
                    </div>
                </div>
                
                <div class="content-card bg-gradient-to-br from-indigo-900 to-purple-900 text-white">
                    <h4 class="text-lg font-bold mb-6">수면 분석</h4>
                    ${this.renderAnalysis(data)}
                </div>
            </div>
        `;
    },

    renderAnalysis: function (data) {
        if (data.length === 0) {
            return `
                <div class="text-center py-12 text-indigo-300">
                    <i class="fas fa-bed text-4xl mb-4 opacity-50"></i>
                    <p>기록된 수면 데이터가 없습니다</p>
                </div>
            `;
        }

        // Calculate average sleep
        const totalMinutes = data.reduce((sum, record) => {
            const start = new Date(record.start);
            const end = new Date(record.end);
            return sum + (end - start) / (1000 * 60);
        }, 0);
        const avgMinutes = totalMinutes / data.length;
        const avgHours = Math.floor(avgMinutes / 60);
        const avgMins = Math.floor(avgMinutes % 60);

        return `
            <div class="text-center mb-8">
                <p class="text-6xl font-black">${avgHours}<span class="text-2xl">시간</span> ${avgMins}<span class="text-2xl">분</span></p>
                <p class="text-indigo-300 mt-2">평균 수면 시간</p>
            </div>
            
            <div class="bg-white/10 rounded-2xl p-4">
                <p class="text-sm text-indigo-300 mb-2">최근 7일 기록: ${Math.min(data.length, 7)}개</p>
                <div class="flex gap-1 h-20 items-end">
                    ${data.slice(-7).map(record => {
            const start = new Date(record.start);
            const end = new Date(record.end);
            const hours = (end - start) / (1000 * 60 * 60);
            const height = Math.min((hours / 12) * 100, 100);
            return `<div class="flex-1 bg-indigo-400 rounded-t" style="height: ${height}%"></div>`;
        }).join('')}
                </div>
            </div>
        `;
    },

    quickStart: function () {
        const now = new Date();
        document.getElementById('sleep-start').value = now.toISOString().slice(0, 16);
        UI.toast('취침 시간이 기록되었습니다', 'info');
    },

    save: function () {
        const start = document.getElementById('sleep-start')?.value;
        const end = document.getElementById('sleep-end')?.value;

        if (!start || !end) {
            UI.toast('취침 및 기상 시간을 모두 입력해주세요', 'warning');
            return;
        }

        const data = Utils.getStore(STORAGE_KEYS.SLEEP);
        data.push({
            id: Utils.generateId(),
            start,
            end,
            date: new Date().toISOString()
        });

        Utils.setStore(STORAGE_KEYS.SLEEP, data);

        const container = document.getElementById('tab-content');
        this.render(container);

        UI.toast('수면 기록이 저장되었습니다', 'success');
    }
};

// Vaccine Tracker Module
const VaccineTracker = {
    render: function (container) {
        const birthdate = Utils.getStore(STORAGE_KEYS.BIRTHDATE, null);
        const completed = Utils.getStore(STORAGE_KEYS.VACCINES);

        if (!birthdate) {
            container.innerHTML = `
                <div class="text-center py-20">
                    <div class="w-20 h-20 bg-amber-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
                        <i class="fas fa-exclamation-triangle text-3xl text-amber-500"></i>
                    </div>
                    <h3 class="text-xl font-bold text-slate-900 mb-2">아기 정보가 필요합니다</h3>
                    <p class="text-slate-500">상단에서 아기의 생년월일을 먼저 입력해주세요</p>
                </div>
            `;
            return;
        }

        const age = Utils.calculateAge(birthdate);

        // Group vaccines by age
        const groupedVaccines = {};
        EXPERT_REPORTS.vaccines.forEach(v => {
            if (!groupedVaccines[v.age]) {
                groupedVaccines[v.age] = [];
            }
            groupedVaccines[v.age].push({
                ...v,
                completed: completed.includes(v.name)
            });
        });

        container.innerHTML = `
            <div class="animate-fade-in">
                <div class="flex items-center justify-between mb-8">
                    <div class="flex items-center gap-4">
                        <div class="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-200">
                            <i class="fas fa-syringe text-white"></i>
                        </div>
                        <div>
                            <h3 class="text-xl font-black text-slate-900">예방접종 스케줄</h3>
                            <p class="text-sm text-slate-500">현재 ${age.months}개월 기준</p>
                        </div>
                    </div>
                    <div class="text-right">
                        <p class="text-3xl font-black text-emerald-600">${completed.length}/${EXPERT_REPORTS.vaccines.length}</p>
                        <p class="text-sm text-slate-500">완료</p>
                    </div>
                </div>
                
                <div class="space-y-6">
                    ${Object.entries(groupedVaccines).map(([vaccineAge, vaccines]) => {
            const isPast = parseInt(vaccineAge) < age.months;
            const isCurrent = parseInt(vaccineAge) === age.months;
            const statusColor = isCurrent ? 'indigo' : isPast ? 'slate' : 'slate';

            return `
                            <div class="content-card bg-white ${isCurrent ? 'ring-2 ring-indigo-500' : ''}">
                                <div class="flex items-center gap-4 mb-4">
                                    <div class="w-10 h-10 ${isCurrent ? 'bg-indigo-600' : isPast ? 'bg-slate-400' : 'bg-slate-200'} rounded-xl flex items-center justify-center">
                                        <span class="text-white font-bold text-sm">${vaccineAge}M</span>
                                    </div>
                                    <div>
                                        <p class="font-bold text-slate-900">${parseInt(vaccineAge) === 0 ? '출생' : vaccineAge + '개월'}</p>
                                        ${isCurrent ? '<span class="text-xs text-indigo-600 font-bold">← 현재 시기</span>' : ''}
                                    </div>
                                </div>
                                
                                <div class="grid sm:grid-cols-2 gap-3">
                                    ${vaccines.map(v => `
                                        <label class="flex items-center gap-3 p-3 rounded-xl cursor-pointer transition ${v.completed ? 'bg-emerald-50' : 'bg-slate-50 hover:bg-slate-100'}">
                                            <input type="checkbox" 
                                                   ${v.completed ? 'checked' : ''} 
                                                   onchange="VaccineTracker.toggle('${v.name}')"
                                                   class="w-5 h-5 rounded text-emerald-500 focus:ring-emerald-500">
                                            <div class="flex-1">
                                                <p class="font-medium text-slate-800 ${v.completed ? 'line-through text-slate-400' : ''}">${v.name}</p>
                                                <p class="text-xs ${v.required ? 'text-rose-500' : 'text-slate-400'}">${v.required ? '필수' : '선택'}</p>
                                            </div>
                                            ${v.completed ? '<i class="fas fa-check-circle text-emerald-500"></i>' : ''}
                                        </label>
                                    `).join('')}
                                </div>
                            </div>
                        `;
        }).join('')}
                </div>
            </div>
        `;
    },

    toggle: function (vaccineName) {
        const completed = Utils.getStore(STORAGE_KEYS.VACCINES);
        const index = completed.indexOf(vaccineName);

        if (index > -1) {
            completed.splice(index, 1);
            UI.toast('접종 기록이 취소되었습니다', 'info');
        } else {
            completed.push(vaccineName);
            UI.toast('접종 완료로 기록되었습니다', 'success');
        }

        Utils.setStore(STORAGE_KEYS.VACCINES, completed);
    }
};

// Calculator Module
const Calculators = {
    render: function (container) {
        container.innerHTML = `
            <div class="grid lg:grid-cols-2 gap-8 animate-fade-in">
                <!-- Fever Medicine Calculator -->
                <div class="content-card bg-white">
                    <div class="flex items-center gap-4 mb-8">
                        <div class="w-12 h-12 bg-gradient-to-br from-rose-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg shadow-rose-200">
                            <i class="fas fa-pills text-white"></i>
                        </div>
                        <div>
                            <h3 class="text-xl font-black text-slate-900">해열제 용량 계산기</h3>
                            <p class="text-sm text-slate-500">체중 기반 정확한 용량 계산</p>
                        </div>
                    </div>
                    
                    <div class="space-y-6">
                        <div>
                            <label class="block text-sm font-bold text-slate-700 mb-2">아이 체중 (kg)</label>
                            <input type="number" id="calc-weight" step="0.1" placeholder="예: 10.5"
                                   class="w-full p-4 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-rose-500 transition font-medium">
                        </div>
                        
                        <button onclick="Calculators.calculateFever()" 
                                class="w-full py-5 bg-gradient-to-r from-rose-500 to-red-600 text-white rounded-2xl font-black text-lg hover:from-rose-600 hover:to-red-700 transition shadow-lg">
                            용량 계산하기
                        </button>
                        
                        <div id="fever-result" class="hidden">
                            <!-- Results will be inserted here -->
                        </div>
                    </div>
                </div>
                
                <!-- Due Date Calculator -->
                <div class="content-card bg-white">
                    <div class="flex items-center gap-4 mb-8">
                        <div class="w-12 h-12 bg-gradient-to-br from-pink-500 to-rose-600 rounded-2xl flex items-center justify-center shadow-lg shadow-pink-200">
                            <i class="fas fa-calendar-heart text-white"></i>
                        </div>
                        <div>
                            <h3 class="text-xl font-black text-slate-900">출산 예정일 계산기</h3>
                            <p class="text-sm text-slate-500">마지막 생리일 기준</p>
                        </div>
                    </div>
                    
                    <div class="space-y-6">
                        <div>
                            <label class="block text-sm font-bold text-slate-700 mb-2">마지막 생리 시작일</label>
                            <input type="date" id="calc-lmp"
                                   class="w-full p-4 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-pink-500 transition font-medium">
                        </div>
                        
                        <button onclick="Calculators.calculateDueDate()" 
                                class="w-full py-5 bg-gradient-to-r from-pink-500 to-rose-600 text-white rounded-2xl font-black text-lg hover:from-pink-600 hover:to-rose-700 transition shadow-lg">
                            예정일 계산하기
                        </button>
                        
                        <div id="duedate-result" class="hidden">
                            <!-- Results will be inserted here -->
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    calculateFever: function () {
        const weight = parseFloat(document.getElementById('calc-weight')?.value);

        if (!weight || weight < 3 || weight > 50) {
            UI.toast('올바른 체중을 입력해주세요 (3-50kg)', 'warning');
            return;
        }

        // 아세트아미노펜: 10-15mg/kg, 이부프로펜: 5-10mg/kg
        const acetaminophenMin = (weight * 10).toFixed(1);
        const acetaminophenMax = (weight * 15).toFixed(1);
        const ibuprofenMin = (weight * 5).toFixed(1);
        const ibuprofenMax = (weight * 10).toFixed(1);

        // 시럽 기준 (타이레놀 시럽 32mg/ml, 부루펜 시럽 20mg/ml)
        const tylenolSyrup = ((weight * 12.5) / 32).toFixed(1);
        const brupenSyrup = ((weight * 7.5) / 20).toFixed(1);

        const resultDiv = document.getElementById('fever-result');
        resultDiv.classList.remove('hidden');
        resultDiv.innerHTML = `
            <div class="p-6 bg-rose-50 rounded-2xl border border-rose-100 animate-fade-in">
                <h4 class="font-black text-lg text-rose-900 mb-4">
                    <i class="fas fa-calculator mr-2"></i>
                    체중 ${weight}kg 기준 권장 용량
                </h4>
                
                <div class="space-y-4">
                    <div class="bg-white p-4 rounded-xl">
                        <p class="font-bold text-slate-800 mb-1">아세트아미노펜 (타이레놀)</p>
                        <p class="text-2xl font-black text-rose-600">${acetaminophenMin} - ${acetaminophenMax}mg</p>
                        <p class="text-sm text-slate-500 mt-1">시럽 기준: 약 <strong>${tylenolSyrup}ml</strong></p>
                        <p class="text-xs text-slate-400 mt-2">4-6시간 간격, 하루 5회 이내</p>
                    </div>
                    
                    <div class="bg-white p-4 rounded-xl">
                        <p class="font-bold text-slate-800 mb-1">이부프로펜 (부루펜)</p>
                        <p class="text-2xl font-black text-blue-600">${ibuprofenMin} - ${ibuprofenMax}mg</p>
                        <p class="text-sm text-slate-500 mt-1">시럽 기준: 약 <strong>${brupenSyrup}ml</strong></p>
                        <p class="text-xs text-slate-400 mt-2">6-8시간 간격, 하루 4회 이내 (6개월 이상)</p>
                    </div>
                </div>
                
                <div class="mt-4 p-3 bg-amber-50 rounded-xl border border-amber-200">
                    <p class="text-xs text-amber-800">
                        <i class="fas fa-exclamation-triangle mr-1"></i>
                        이 계산기는 참고용입니다. 정확한 용량은 제품 설명서 또는 의사/약사와 상담하세요.
                    </p>
                </div>
            </div>
        `;
    },

    calculateDueDate: function () {
        const lmpDate = document.getElementById('calc-lmp')?.value;

        if (!lmpDate) {
            UI.toast('마지막 생리 시작일을 입력해주세요', 'warning');
            return;
        }

        const lmp = new Date(lmpDate);
        const dueDate = new Date(lmp);
        dueDate.setDate(dueDate.getDate() + 280); // 40주 = 280일

        const today = new Date();
        const weeksPregnant = Math.floor((today - lmp) / (1000 * 60 * 60 * 24 * 7));
        const daysExtra = Math.floor(((today - lmp) / (1000 * 60 * 60 * 24)) % 7);
        const daysUntilDue = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));

        const resultDiv = document.getElementById('duedate-result');
        resultDiv.classList.remove('hidden');
        resultDiv.innerHTML = `
            <div class="p-6 bg-pink-50 rounded-2xl border border-pink-100 animate-fade-in">
                <h4 class="font-black text-lg text-pink-900 mb-4">
                    <i class="fas fa-baby mr-2"></i>
                    출산 예정일 정보
                </h4>
                
                <div class="text-center py-6">
                    <p class="text-sm text-pink-600 mb-2">출산 예정일</p>
                    <p class="text-4xl font-black text-slate-900">${Utils.formatDate(dueDate, 'long')}</p>
                    <p class="text-lg text-pink-600 mt-2">D-${daysUntilDue}일</p>
                </div>
                
                <div class="grid grid-cols-2 gap-4 mt-4">
                    <div class="bg-white p-4 rounded-xl text-center">
                        <p class="text-sm text-slate-500">현재 임신 주수</p>
                        <p class="text-2xl font-black text-slate-900">${weeksPregnant}주 ${daysExtra}일</p>
                    </div>
                    <div class="bg-white p-4 rounded-xl text-center">
                        <p class="text-sm text-slate-500">임신 기간</p>
                        <p class="text-2xl font-black text-slate-900">${Math.floor((today - lmp) / (1000 * 60 * 60 * 24))}일</p>
                    </div>
                </div>
                
                <div class="mt-4 p-3 bg-pink-100 rounded-xl">
                    <p class="text-xs text-pink-800">
                        <i class="fas fa-info-circle mr-1"></i>
                        네겔레 법칙 기준 계산입니다. 정확한 예정일은 산부인과 초음파 검진으로 확인하세요.
                    </p>
                </div>
            </div>
        `;
    }
};

// ============================================
// 6. GLOBAL FUNCTIONS (for HTML onclick handlers)
// ============================================

window.updateGlobalBabyInfo = () => BabyInfo.update();
window.switchTab = (tabId) => TabSystem.switch(tabId);
window.GrowthTracker = GrowthTracker;
window.FeedingTracker = FeedingTracker;
window.SleepTracker = SleepTracker;
window.VaccineTracker = VaccineTracker;
window.Calculators = Calculators;

// ============================================
// 7. INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    // Load saved baby info
    BabyInfo.load();

    // Initialize tab system if on tools page
    if (document.getElementById('tab-content')) {
        TabSystem.switch('growth');
    }

    // Add CSS animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fade-in {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fade-in {
            animation: fade-in 0.5s ease-out forwards;
        }
        
        .content-card {
            border-radius: 2rem;
            border: 1px solid #f1f5f9;
            padding: 2rem;
            transition: all 0.3s ease;
        }
        
        .content-card:hover {
            box-shadow: 0 20px 40px -15px rgba(99, 102, 241, 0.1);
        }
        
        .btn-primary {
            background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
            transition: all 0.3s ease;
        }
        
        .btn-primary:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 30px -5px rgba(99, 102, 241, 0.4);
        }
        
        .tab-btn {
            transition: all 0.3s ease;
        }
        
        .tab-active {
            background: white;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
    `;
    document.head.appendChild(style);

    console.log('🍼 iMom Intelligence v2.0 initialized');
});
