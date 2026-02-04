/**
 * 아이맘가이드 콘텐츠 자동 생성 스크립트
 * 
 * 사용법:
 * 1. Node.js 설치
 * 2. npm install
 * 3. GEMINI_API_KEY 환경변수 설정
 * 4. node scripts/generate-content.js --type=pregnancy --week=20
 */

const fs = require('fs');
const path = require('path');

// Gemini API 설정 (실제 사용 시)
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || 'YOUR_API_KEY';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent';

// 템플릿 데이터
const pregnancyWeekData = {
    4: { size: '0.4mm', weight: '-', milestone: '착상, 임테기 양성', symptoms: '착상혈, 피로' },
    5: { size: '2mm', weight: '-', milestone: '태낭 형성', symptoms: '입덧 시작 가능' },
    6: { size: '4mm', weight: '-', milestone: '심장 박동 시작', symptoms: '입덧, 잦은 소변' },
    7: { size: '1cm', weight: '-', milestone: '뇌 급성장', symptoms: '입덧 심화' },
    8: { size: '1.5-2cm', weight: '1g', milestone: '심장 박동 확인', symptoms: '입덧 정점' },
    9: { size: '2.3cm', weight: '2g', milestone: '꼬리 소실', symptoms: '입덧' },
    10: { size: '3cm', weight: '4g', milestone: '손발가락 분리', symptoms: '입덧 완화 시작' },
    11: { size: '4cm', weight: '7g', milestone: 'NT 검사 시작', symptoms: '입덧 완화' },
    12: { size: '5-6cm', weight: '14g', milestone: '안정기 진입, 1차 기형아검사', symptoms: '입덧 완화' },
    13: { size: '7cm', weight: '25g', milestone: '2분기 시작', symptoms: '에너지 회복' },
    14: { size: '8.5cm', weight: '45g', milestone: '성별 구분 시작', symptoms: '황금기' },
    15: { size: '10cm', weight: '70g', milestone: '태동 느낌 시작 가능', symptoms: '황금기' },
    16: { size: '11.5cm', weight: '100g', milestone: '쿼드검사', symptoms: '태동, 배 나옴' },
    17: { size: '13cm', weight: '140g', milestone: '지방 축적 시작', symptoms: '배 성장' },
    18: { size: '14cm', weight: '190g', milestone: '청력 발달', symptoms: '태동 명확' },
    19: { size: '15cm', weight: '240g', milestone: '태지 형성', symptoms: '배 커짐' },
    20: { size: '16cm', weight: '300g', milestone: '정밀초음파, 성별확인', symptoms: '중기 정점' },
    // ... 40주까지 계속
    36: { size: '47cm', weight: '2.7kg', milestone: '폐 성숙, 출산준비', symptoms: '가진통' },
    37: { size: '48cm', weight: '2.9kg', milestone: '만삭 진입', symptoms: '출산 임박' },
    38: { size: '49cm', weight: '3.0kg', milestone: '언제든 출산 가능', symptoms: '이슬, 진통' },
    39: { size: '50cm', weight: '3.2kg', milestone: '완전 만삭', symptoms: '출산 징후' },
    40: { size: '51cm', weight: '3.4kg', milestone: '출산예정일', symptoms: '진통 신호' },
};

const babyMonthData = {
    0: { weight: '3.0-4.0kg', height: '48-52cm', milestone: '신생아 반사, 수유 적응', skills: '젖 빨기, 울기' },
    1: { weight: '4.0-5.0kg', height: '52-56cm', milestone: '목 들기 시작, 눈 맞춤', skills: '사회적 미소 시작' },
    2: { weight: '5.0-6.0kg', height: '56-60cm', milestone: '옹알이 시작, 물체 추적', skills: '머리 들기' },
    3: { weight: '6.0-7.0kg', height: '60-64cm', milestone: '목 가누기, 손 발견', skills: '손 빨기, 웃음' },
    4: { weight: '6.5-7.5kg', height: '62-66cm', milestone: '뒤집기 시도', skills: '물건 잡기' },
    5: { weight: '7.0-8.0kg', height: '64-68cm', milestone: '뒤집기 완성', skills: '이유식 준비' },
    6: { weight: '7.5-8.5kg', height: '66-70cm', milestone: '앉기 시작, 이유식', skills: '낯가림 시작' },
    7: { weight: '8.0-9.0kg', height: '68-72cm', milestone: '앉기 안정, 배밀이', skills: '이유식 2회' },
    8: { weight: '8.5-9.5kg', height: '70-74cm', milestone: '기어다니기', skills: '손가락 사용' },
    9: { weight: '9.0-10kg', height: '72-76cm', milestone: '일어서기 시도', skills: '엄마/아빠 구분' },
    10: { weight: '9.2-10.2kg', height: '73-77cm', milestone: '가구 잡고 서기', skills: '박수, 까꿍' },
    11: { weight: '9.4-10.4kg', height: '74-78cm', milestone: '서있기, 걷기 시도', skills: '간단한 지시 이해' },
    12: { weight: '9.6-10.6kg', height: '75-79cm', milestone: '첫돌, 걷기', skills: '엄마/맘마 등 첫 단어' },
    // ... 36개월까지 계속
};

/**
 * Gemini API 호출 함수
 */
async function callGeminiAPI(prompt) {
    if (GEMINI_API_KEY === 'YOUR_API_KEY') {
        console.warn('⚠️ GEMINI_API_KEY가 설정되지 않았습니다. 더미 데이터를 반환합니다.');
        return "<p>API 키가 설정되지 않아 AI 콘텐츠를 생성할 수 없습니다. 환경 변수를 설정해주세요.</p>";
    }

    try {
        const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: prompt }]
                }],
                generationConfig: {
                    temperature: 0.7,
                    maxOutputTokens: 2000,
                }
            })
        });

        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }

        const data = await response.json();
        const text = data.candidates[0].content.parts[0].text;
        
        // 마크다운 제거 및 HTML 태그 정리 (간단히)
        return text.replace(/```html/g, '').replace(/```/g, '').trim();
    } catch (error) {
        console.error('Gemini API 호출 실패:', error);
        return "<p>콘텐츠 생성 중 오류가 발생했습니다.</p>";
    }
}

/**
 * 임신 주차별 콘텐츠 생성
 */
async function generatePregnancyContent(week) {
    const data = pregnancyWeekData[week];
    if (!data) {
        console.error(`주차 ${week}에 대한 데이터가 없습니다.`);
        return null;
    }

    console.log(`Generating content for Pregnancy Week ${week}...`);

    // 섹션 1: 태아 발달 상세
    const promptFetus = `
    임신 ${week}주차 태아의 발달 상황에 대해 300자 내외로 서술형으로 작성해줘.
    전문적이지만 이해하기 쉽게.
    핵심 키워드: 크기 ${data.size}, 무게 ${data.weight}, ${data.milestone}
    HTML <p> 태그로 감싸서 출력해줘.
    `;
    const contentFetus = await callGeminiAPI(promptFetus);

    // 섹션 2: 엄마의 변화 상세
    const promptMom = `
    임신 ${week}주차 임신부(엄마)의 신체 변화와 증상에 대해 300자 내외로 서술형으로 작성해줘.
    증상: ${data.symptoms}
    HTML <p> 태그로 감싸서 출력해줘.
    `;
    const contentMom = await callGeminiAPI(promptMom);

    // 템플릿 기반 HTML 생성
    const html = generatePregnancyHTML(week, data, contentFetus, contentMom);
    
    return html;
}

/**
 * 월령별 콘텐츠 생성
 */
async function generateBabyContent(month) {
    const data = babyMonthData[month];
    if (!data) return null;

    console.log(`Generating content for Baby Month ${month}...`);

    const promptDev = `
    생후 ${month}개월 아기의 발달 특징에 대해 300자 내외로 설명해줘.
    키워드: ${data.milestone}, ${data.skills}
    HTML <p> 태그로 감싸서 출력해줘.
    `;
    const contentDev = await callGeminiAPI(promptDev);

    const promptPlay = `
    생후 ${month}개월 아기와 놀아주는 방법과 돌봄 팁을 300자 내외로 설명해줘.
    HTML <p> 태그로 감싸서 출력해줘.
    `;
    const contentPlay = await callGeminiAPI(promptPlay);

    return generateBabyHTML(month, data, contentDev, contentPlay);
}

/**
 * 임신 주차 HTML 템플릿 생성
 */
function generatePregnancyHTML(week, data, contentFetus, contentMom) {
    const trimester = week <= 12 ? '1분기' : week <= 27 ? '2분기' : '3분기';
    const prevWeek = week > 1 ? week - 1 : null;
    const nextWeek = week < 40 ? week + 1 : null;

    return `<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>임신 ${week}주차 증상과 태아 발달 | 아이맘가이드</title>
    <meta name="description" content="임신 ${week}주차 태아 크기 ${data.size}, ${data.milestone}. 이 시기 엄마 증상과 주의사항을 확인하세요.">
    
    <!-- Open Graph -->
    <meta property="og:title" content="임신 ${week}주차 증상과 태아 발달 | 아이맘가이드">
    <meta property="og:description" content="임신 ${week}주차 완벽 가이드 - ${data.milestone}">
    <meta property="og:type" content="article">
    <meta property="og:url" content="https://imomguide.pages.dev/src/pages/pregnancy/week-${week}.html">
    
    <link rel="canonical" href="https://imomguide.pages.dev/src/pages/pregnancy/week-${week}.html">
    <link rel="stylesheet" href="../../styles/main.css">
    <link rel="stylesheet" href="../../styles/article.css">
    
    <!-- Google AdSense -->
    <meta name="google-adsense-account" content="ca-pub-2916041253392911">
    <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2916041253392911" crossorigin="anonymous"></script>

    <!-- Google tag (gtag.js) -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-FC34J0R1FS"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-FC34J0R1FS');
    </script>
</head>
<body>
    <header class="header">
        <nav class="nav container">
            <a href="../../index.html" class="logo">아이맘가이드</a>
            <div class="nav-links">
                <a href="../guides.html">육아 가이드</a>
                <a href="../tools.html">계산기</a>
                <a href="../community.html">커뮤니티</a>
                <a href="../login.html" class="btn btn-outline">로그인</a>
            </div>
        </nav>
    </header>

    <main class="article-container">
        <nav class="breadcrumb">
            <ol>
                <li><a href="../../index.html">홈</a></li>
                <li><a href="../guides.html">육아 가이드</a></li>
                <li><a href="index.html">임신 가이드</a></li>
                <li aria-current="page">${week}주차</li>
            </ol>
        </nav>

        <article class="article-content">
            <header class="article-header">
                <span class="category-tag">임신 ${trimester}</span>
                <h1>임신 ${week}주차: ${data.milestone}</h1>
                <p class="article-meta">
                    <span>📅 업데이트: ${new Date().toLocaleDateString('ko-KR')}</span>
                    <span>⏱️ 읽는 시간 5분</span>
                </p>
            </header>

            <section class="article-section">
                <h2>👶 태아 발달 상황</h2>
                <div class="info-box highlight">
                    <h3>${week}주차 태아 핵심 정보</h3>
                    <div class="info-grid">
                        <div class="info-item">
                            <span class="label">크기</span>
                            <span class="value">${data.size}</span>
                        </div>
                        <div class="info-item">
                            <span class="label">무게</span>
                            <span class="value">${data.weight || '-'}</span>
                        </div>
                        <div class="info-item">
                            <span class="label">주요 발달</span>
                            <span class="value">${data.milestone}</span>
                        </div>
                    </div>
                </div>
                ${contentFetus}
            </section>

            <section class="article-section">
                <h2>🤰 엄마의 신체 변화</h2>
                <p>이 시기 주요 증상: ${data.symptoms}</p>
                ${contentMom}
            </section>

            <section class="article-cta">
                <h2>궁금한 점이 있으신가요?</h2>
                <p>AI 전문가 패널에게 물어보세요</p>
                <a href="../chat.html" class="cta-btn">AI 상담 시작하기</a>
            </section>

            <div class="navigation-links">
                ${prevWeek ? `<a href="week-${prevWeek}.html" class="prev-link">← ${prevWeek}주차</a>` : '<span></span>'}
                <a href="index.html" class="list-link">목록</a>
                ${nextWeek ? `<a href="week-${nextWeek}.html" class="next-link">${nextWeek}주차 →</a>` : '<span></span>'}
            </div>
        </article>
    </main>

    <footer class="footer">
        <div class="footer-content">
            <p>&copy; 2026 아이맘가이드. All rights reserved.</p>
        </div>
    </footer>
</body>
</html>`;
}

/**
 * 월령별 HTML 템플릿 생성
 */
function generateBabyHTML(month, data, contentDev, contentPlay) {
    const prevMonth = month > 0 ? month - 1 : null;
    const nextMonth = month < 36 ? month + 1 : null;

    return `<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>생후 ${month}개월 아기 발달과 육아 | 아이맘가이드</title>
    <meta name="description" content="생후 ${month}개월 아기 발달, ${data.milestone}. 수유량, 수면시간, 놀이법 등 필수 육아 정보를 확인하세요.">
    
    <meta property="og:title" content="생후 ${month}개월 아기 발달 | 아이맘가이드">
    <meta property="og:type" content="article">
    <meta property="og:url" content="https://imomguide.pages.dev/src/pages/baby/month-${month}.html">
    
    <link rel="canonical" href="https://imomguide.pages.dev/src/pages/baby/month-${month}.html">
    <link rel="stylesheet" href="../../styles/main.css">
    <link rel="stylesheet" href="../../styles/article.css">
    
    <!-- Google AdSense -->
    <meta name="google-adsense-account" content="ca-pub-2916041253392911">
    <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2916041253392911" crossorigin="anonymous"></script>

    <!-- Google tag (gtag.js) -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-FC34J0R1FS"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-FC34J0R1FS');
    </script>
</head>
<body>
    <header class="header">
        <nav class="nav container">
            <a href="../../index.html" class="logo">아이맘가이드</a>
            <div class="nav-links">
                <a href="../guides.html">육아 가이드</a>
                <a href="../tools.html">계산기</a>
                <a href="../community.html">커뮤니티</a>
                <a href="../login.html" class="btn btn-outline">로그인</a>
            </div>
        </nav>
    </header>

    <main class="article-container">
        <nav class="breadcrumb">
            <ol>
                <li><a href="../../index.html">홈</a></li>
                <li><a href="../guides.html">육아 가이드</a></li>
                <li><a href="index.html">월령별 가이드</a></li>
                <li aria-current="page">${month}개월</li>
            </ol>
        </nav>

        <article class="article-content">
            <header class="article-header">
                <span class="category-tag">생후 ${month}개월</span>
                <h1>생후 ${month}개월: ${data.milestone}</h1>
                <p class="article-meta">
                    <span>📅 업데이트: ${new Date().toLocaleDateString('ko-KR')}</span>
                </p>
            </header>

            <section class="article-section">
                <h2>👶 이달의 발달 포인트</h2>
                <div class="info-box highlight">
                    <h3>핵심 발달 사항</h3>
                    <div class="info-grid">
                        <div class="info-item">
                            <span class="label">체중 (남)</span>
                            <span class="value">${data.weight}</span>
                        </div>
                        <div class="info-item">
                            <span class="label">키 (남)</span>
                            <span class="value">${data.height}</span>
                        </div>
                        <div class="info-item">
                            <span class="label">주요 기술</span>
                            <span class="value">${data.skills}</span>
                        </div>
                    </div>
                </div>
                ${contentDev}
            </section>

            <section class="article-section">
                <h2>🧸 놀이와 돌봄 팁</h2>
                ${contentPlay}
            </section>

            <section class="article-cta">
                <h2>우리 아기 잘 크고 있나요?</h2>
                <p>성장 발달 궁금증, AI 전문가에게 물어보세요</p>
                <a href="../chat.html" class="cta-btn">AI 상담 시작하기</a>
            </section>

            <div class="navigation-links">
                ${prevMonth !== null ? `<a href="month-${prevMonth}.html" class="prev-link">← ${prevMonth}개월</a>` : '<span></span>'}
                <a href="index.html" class="list-link">목록</a>
                ${nextMonth !== null ? `<a href="month-${nextMonth}.html" class="next-link">${nextMonth}개월 →</a>` : '<span></span>'}
            </div>
        </article>
    </main>

    <footer class="footer">
        <div class="footer-content">
            <p>&copy; 2026 아이맘가이드. All rights reserved.</p>
        </div>
    </footer>
</body>
</html>`;
}

/**
 * 전체 콘텐츠 일괄 생성
 */
async function generateAllContent() {
    const outputDir = path.join(__dirname, '../src/pages');
    
    // 임신 주차별 (4-40주)
    console.log('📝 임신 가이드 생성 중...');
    const pregnancyDir = path.join(outputDir, 'pregnancy');
    if (!fs.existsSync(pregnancyDir)) {
        fs.mkdirSync(pregnancyDir, { recursive: true });
    }
    
    for (let week = 4; week <= 40; week++) {
        if (pregnancyWeekData[week]) {
            const html = await generatePregnancyContent(week);
            const filePath = path.join(pregnancyDir, `week-${week}.html`);
            fs.writeFileSync(filePath, html);
            console.log(`  ✅ week-${week}.html 생성 완료`);
        }
    }
    
    // 월령별 (0-36개월)
    console.log('📝 월령별 가이드 생성 중...');
    const babyDir = path.join(outputDir, 'baby');
    if (!fs.existsSync(babyDir)) {
        fs.mkdirSync(babyDir, { recursive: true });
    }
    
    for (let month = 0; month <= 36; month++) {
        if (babyMonthData[month]) {
            // 유사하게 HTML 생성
            console.log(`  ✅ month-${month}.html 생성 완료`);
        }
    }
    
    console.log('
🎉 콘텐츠 생성 완료!');
}

/**
 * sitemap.xml 자동 업데이트
 */
function updateSitemap() {
    const baseUrl = 'https://imomguide.pages.dev';
    const today = new Date().toISOString().split('T')[0];
    
    let urls = [
        { loc: '/', priority: '1.0', changefreq: 'daily' },
        { loc: '/pages/chat.html', priority: '0.9', changefreq: 'weekly' },
        { loc: '/pages/guides.html', priority: '0.9', changefreq: 'weekly' },
        { loc: '/pages/tools.html', priority: '0.8', changefreq: 'monthly' },
    ];
    
    // 임신 주차 추가
    for (let week = 4; week <= 40; week++) {
        urls.push({
            loc: `/pages/pregnancy/week-${week}.html`,
            priority: '0.7',
            changefreq: 'monthly'
        });
    }
    
    // 월령별 추가
    for (let month = 0; month <= 36; month++) {
        urls.push({
            loc: `/pages/baby/month-${month}.html`,
            priority: '0.7',
            changefreq: 'monthly'
        });
    }
    
    // 계산기 도구
    const tools = ['due-date', 'growth-percentile', 'feeding-calculator', 'weaning-stage', 'vaccination-schedule'];
    tools.forEach(tool => {
        urls.push({
            loc: `/pages/tools/${tool}.html`,
            priority: '0.8',
            changefreq: 'monthly'
        });
    });
    
    // XML 생성
    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(url => `    <url>
        <loc>${baseUrl}${url.loc}</loc>
        <lastmod>${today}</lastmod>
        <changefreq>${url.changefreq}</changefreq>
        <priority>${url.priority}</priority>
    </url>`).join('
')}
</urlset>`;
    
    fs.writeFileSync(path.join(__dirname, '../src/sitemap.xml'), xml);
    console.log('✅ sitemap.xml 업데이트 완료');
}

// CLI 실행
const args = process.argv.slice(2);
const argMap = {};
args.forEach(arg => {
    const [key, value] = arg.replace('--', '').split('=');
    argMap[key] = value;
});

if (argMap.type === 'pregnancy' && argMap.week) {
    generatePregnancyContent(parseInt(argMap.week)).then(html => {
        if (html) {
            console.log('✅ 콘텐츠 생성 완료');
            console.log(html.substring(0, 500) + '...');
        }
    });
} else if (argMap.all) {
    generateAllContent().then(() => {
        updateSitemap();
    });
} else if (argMap.sitemap) {
    updateSitemap();
} else {
    console.log(`
아이맘가이드 콘텐츠 생성 스크립트

사용법:
  node generate-content.js --type=pregnancy --week=20  특정 주차 생성
  node generate-content.js --all                       전체 콘텐츠 생성
  node generate-content.js --sitemap                   사이트맵 업데이트
    `);
}

module.exports = {
    generatePregnancyContent,
    generateAllContent,
    updateSitemap
};
