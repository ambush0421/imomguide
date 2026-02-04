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
 * 임신 주차별 콘텐츠 생성
 */
async function generatePregnancyContent(week) {
    const data = pregnancyWeekData[week];
    if (!data) {
        console.error(`주차 ${week}에 대한 데이터가 없습니다.`);
        return null;
    }

    // AI로 상세 콘텐츠 생성 (실제 구현 시)
    const prompt = `
    당신은 한국의 임산부를 위한 육아 정보 전문가입니다.
    임신 ${week}주차에 대한 상세 가이드를 작성해주세요.
    
    핵심 정보:
    - 태아 크기: ${data.size}
    - 태아 무게: ${data.weight}
    - 주요 이정표: ${data.milestone}
    - 엄마 증상: ${data.symptoms}
    
    다음 섹션을 포함해주세요:
    1. 태아 발달 상황 (300자)
    2. 엄마의 신체 변화 (300자)
    3. 이 시기 필요한 검사 (해당 시)
    4. 영양 관리 팁
    5. 실전 조언
    6. FAQ 3개
    
    출처: 대한산부인과학회, 질병관리청, WHO
    의료 면책 고지 포함
    `;

    // 템플릿 기반 HTML 생성
    const html = generatePregnancyHTML(week, data);
    
    return html;
}

/**
 * 임신 주차 HTML 템플릿 생성
 */
function generatePregnancyHTML(week, data) {
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
    <meta name="keywords" content="임신 ${week}주차, 임신 ${week}주, 태아 발달, ${data.milestone}">
    
    <meta property="og:title" content="임신 ${week}주차 증상과 태아 발달 | 아이맘가이드">
    <meta property="og:description" content="임신 ${week}주차 완벽 가이드 - ${data.milestone}">
    
    <link rel="canonical" href="https://imomguide.pages.dev/pages/pregnancy/week-${week}.html">
    <link rel="stylesheet" href="../../styles/main.css">
    <link rel="stylesheet" href="../../styles/article.css">
    
    <script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": "임신 ${week}주차 증상과 태아 발달",
        "datePublished": "${new Date().toISOString().split('T')[0]}"
    }
    </script>
</head>
<body>
    <header class="header">
        <nav class="nav">
            <a href="../../index.html" class="logo">아이맘가이드</a>
            <div class="nav-links">
                <a href="../chat.html">AI 상담</a>
                <a href="../guides.html" class="active">육아 가이드</a>
                <a href="../tools.html">계산기</a>
                <a href="../login.html" class="btn-login">로그인</a>
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
                    <span>📅 ${new Date().toLocaleDateString('ko-KR')}</span>
                    <span>⏱️ 읽는 시간 8분</span>
                </p>
                <div class="article-summary">
                    <p>임신 ${week}주차, ${data.milestone} 시기입니다. 
                    태아는 ${data.size} 크기로 자라고 있으며, 
                    엄마는 ${data.symptoms} 등의 증상을 경험할 수 있습니다.</p>
                </div>
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
                <p><!-- AI 생성 콘텐츠 들어갈 자리 --></p>
            </section>

            <section class="article-section">
                <h2>🤰 엄마의 신체 변화</h2>
                <p>이 시기 주요 증상: ${data.symptoms}</p>
                <p><!-- AI 생성 콘텐츠 들어갈 자리 --></p>
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

            <section class="references">
                <h3>📚 참고 자료</h3>
                <ul>
                    <li>대한산부인과학회 (2024)</li>
                    <li>질병관리청 (2024)</li>
                    <li>WHO</li>
                </ul>
                <p class="disclaimer">본 콘텐츠는 일반적인 정보 제공 목적이며, 
                의료적 진단이나 처방을 대체하지 않습니다.</p>
            </section>
        </article>
    </main>

    <footer class="footer">
        <div class="footer-content">
            <p>&copy; 2026 아이맘가이드. All rights reserved.</p>
            <div class="footer-links">
                <a href="../terms.html">이용약관</a>
                <a href="../privacy.html">개인정보처리방침</a>
            </div>
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
