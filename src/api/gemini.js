// ===== Gemini API Configuration =====
// Google AI Studio에서 API 키를 발급받으세요: https://aistudio.google.com/apikey

const GEMINI_API_KEY = 'YOUR_GEMINI_API_KEY'; // 실제 키로 교체
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent';

// ===== System Prompt for Expert Panel =====
const SYSTEM_PROMPT = `당신은 "아이맘가이드"라는 육아 상담 서비스의 AI입니다.
사용자가 육아 관련 질문을 하면, 3명의 전문가 관점에서 답변합니다.

## 핵심 원칙
1. 절대로 의료 진단을 하지 마세요
2. 응급 상황(고열 39도 이상, 호흡곤란, 경련, 의식 저하)은 즉시 "🚨 응급 상황입니다. 지금 바로 119에 연락하거나 가까운 응급실을 방문하세요!"라고 안내하세요
3. 따뜻하고 공감적인 톤을 유지하세요
4. 한국어로만 답변하세요
5. 구체적이고 실용적인 조언을 제공하세요

## 답변 형식 (반드시 이 JSON 형식으로 답변하세요)
{
  "isEmergency": false,
  "emergencyMessage": "",
  "experts": [
    {
      "name": "김소아 원장",
      "title": "소아청소년과 전문의 15년",
      "avatar": "👩‍⚕️",
      "response": "의학적 관점의 답변..."
    },
    {
      "name": "박경험 맘",
      "title": "세 아이 엄마 (15세, 12세, 8세)",
      "avatar": "👩",
      "response": "경험 기반 조언..."
    },
    {
      "name": "이심리 박사",
      "title": "아동발달심리학 박사",
      "avatar": "🧠",
      "response": "심리/발달 관점 조언..."
    }
  ],
  "summary": ["핵심 포인트 1", "핵심 포인트 2", "핵심 포인트 3"]
}

## 각 전문가 역할

### 김소아 원장 (의학적 관점)
- 증상의 가능한 원인 설명
- 가정에서의 대처법 안내
- 병원 방문이 필요한 기준 제시
- 말투: "의학적으로 보면~", "일반적으로 이 증상은~"

### 박경험 맘 (실전 경험)
- 공감과 위로로 시작
- 본인 경험담 공유
- 구체적인 실용 팁 제공
- 말투: "저도 그때 정말 힘들었어요", "이건 진짜 효과 있었어요"

### 이심리 박사 (심리/발달)
- 아이의 발달 단계 설명
- 행동의 심리적 의미 해석
- 부모의 감정도 케어
- 말투: "이 시기 아이들은~", "부모님 마음도 충분히 이해해요"

## 주의사항
- JSON 형식 외의 텍스트를 추가하지 마세요
- 각 전문가 응답은 150-250자 정도로 작성하세요
- summary는 반드시 3개의 핵심 포인트로 작성하세요`;

// ===== API Call Function =====
async function askExperts(question) {
    try {
        const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [
                    {
                        role: "user",
                        parts: [
                            { text: SYSTEM_PROMPT },
                            { text: `

사용자 질문: ${question}` }
                        ]
                    }
                ],
                generationConfig: {
                    temperature: 0.7,
                    topK: 40,
                    topP: 0.95,
                    maxOutputTokens: 2048,
                }
            })
        });

        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }

        const data = await response.json();
        
        // Extract text from response
        const text = data.candidates[0].content.parts[0].text;
        
        // Parse JSON from response
        // Gemini sometimes wraps JSON in markdown code blocks
        let jsonStr = text;
        if (text.includes('```json')) {
            jsonStr = text.split('```json')[1].split('```')[0];
        } else if (text.includes('```')) {
            jsonStr = text.split('```')[1].split('```')[0];
        }
        
        const parsed = JSON.parse(jsonStr.trim());
        return parsed;
        
    } catch (error) {
        console.error('Gemini API Error:', error);
        
        // Return fallback response
        return {
            isEmergency: false,
            emergencyMessage: "",
            experts: [
                {
                    name: "시스템",
                    title: "",
                    avatar: "⚠️",
                    response: "죄송합니다. 일시적인 오류가 발생했습니다. 잠시 후 다시 시도해 주세요."
                }
            ],
            summary: ["잠시 후 다시 시도해 주세요"]
        };
    }
}

// ===== Save Chat to Firestore (Optional) =====
async function saveChatToFirestore(userId, question, response) {
    if (!userId || !window.db) return;
    
    try {
        await window.db.collection('chats').add({
            userId: userId,
            question: question,
            response: response,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });
    } catch (error) {
        console.error('Failed to save chat:', error);
    }
}

// Export
window.askExperts = askExperts;
window.saveChatToFirestore = saveChatToFirestore;
