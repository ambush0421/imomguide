const functions = require("firebase-functions");
const admin = require("firebase-admin");
const fetch = require("node-fetch");

admin.initializeApp();

// Gemini API Configuration
// Best practice: Set this via CLI: firebase functions:config:set gemini.key="YOUR_KEY"
// Fallback: Hardcoded for development (Replace before production if not using config)
const GEMINI_API_KEY = functions.config().gemini?.key || "YOUR_API_KEY_HERE";
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent";

const SYSTEM_PROMPT = `당신은 "아이맘가이드"라는 육아 상담 서비스의 AI입니다.
사용자가 육아 관련 질문을 하면, 3명의 전문가 관점에서 답변합니다.

## 핵심 원칙
1. 절대로 의료 진단을 하지 마세요
2. 응급 상황(고열 39도 이상, 호흡곤란, 경련, 의식 저하)은 즉시 "🚨 응급 상황입니다. 지금 바로 119에 연락하거나 가까운 응급실을 방문하세요!"라고 안내하세요
3. 따뜻하고 공감적인 톤을 유지하세요
4. 한국어로만 답변하세요
5. 구체적이고 실용적인 조언을 제공하세요

## 답변 형식 (JSON)
{
  "isEmergency": false,
  "emergencyMessage": "",
  "experts": [
    {
      "name": "김소아 원장",
      "title": "소아청소년과 전문의",
      "avatar": "👩‍⚕️",
      "response": "..."
    },
    {
      "name": "박경험 맘",
      "title": "세 아이 엄마",
      "avatar": "👩",
      "response": "..."
    },
    {
      "name": "이심리 박사",
      "title": "아동발달 전문가",
      "avatar": "🧠",
      "response": "..."
    }
  ],
  "summary": ["포인트 1", "포인트 2", "포인트 3"]
}`;

exports.askExperts = functions.https.onCall(async (data, context) => {
  // Authentication check (Optional: uncomment to require login)
  // if (!context.auth) {
  //   throw new functions.https.HttpsError('unauthenticated', 'The function must be called while authenticated.');
  // }

  const question = data.question;
  if (!question) {
    throw new functions.https.HttpsError("invalid-argument", "The function must be called with a 'question' argument.");
  }

  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [
              { text: SYSTEM_PROMPT },
              { text: `

사용자 질문: ${question}` },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2048,
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Gemini API Error:", errorText);
      throw new functions.https.HttpsError("internal", "Failed to call AI service");
    }

    const resultData = await response.json();
    const text = resultData.candidates[0].content.parts[0].text;

    // Parse JSON safely
    let jsonStr = text;
    if (text.includes("```json")) {
      jsonStr = text.split("```json")[1].split("```")[0];
    } else if (text.includes("```")) {
      jsonStr = text.split("```")[1].split("```")[0];
    }

    return JSON.parse(jsonStr.trim());
  } catch (error) {
    console.error("Function Error:", error);
    throw new functions.https.HttpsError("internal", "An error occurred", error);
  }
});
