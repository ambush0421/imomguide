// ===== Gemini API Client (Secure Version) =====
// This interacts with Firebase Cloud Functions instead of calling the API directly.

async function askExperts(question) {
    try {
        // Ensure Firebase Functions is initialized
        const functions = firebase.functions();
        
        // Use local emulator if on localhost (Optional: for development)
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            // functions.useEmulator('localhost', 5001);
        }

        const askExpertsFn = functions.httpsCallable('askExperts');
        
        const result = await askExpertsFn({ question: question });
        return result.data;
        
    } catch (error) {
        console.error('Cloud Function Error:', error);
        
        // Return fallback response for UI stability
        return {
            isEmergency: false,
            emergencyMessage: "",
            experts: [
                {
                    name: "시스템",
                    title: "알림",
                    avatar: "⚠️",
                    response: "서버와 통신 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요."
                }
            ],
            summary: ["서버 연결 확인 필요", "잠시 후 재시도", "네트워크 상태 확인"]
        };
    }
}

// ===== Save Chat to Firestore =====
async function saveChatToFirestore(userId, question, response) {
    if (!userId || !window.imomguide_db) return;
    
    try {
        await window.imomguide_db.collection('chats').add({
            userId: userId,
            question: question,
            response: response,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });
    } catch (error) {
        console.error('Failed to save chat:', error);
    }
}

// Export to window for access from chat.js
window.askExperts = askExperts;
window.saveChatToFirestore = saveChatToFirestore;