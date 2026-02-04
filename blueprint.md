# iMomGuide Blueprint

## Overview
iMomGuide is an AI-powered parenting platform designed to provide trustworthy, multi-perspective advice to parents. The core feature is an "AI Expert Panel" where a Pediatrician, a Veteran Mom, and a Child Psychologist provide real-time, conversational advice on parenting queries.

## Infrastructure
*   **Hosting**: Cloudflare Pages (Frontend)
*   **Backend**: Firebase (Auth, Firestore, Functions)
*   **AI**: OpenAI/Claude API (via Firebase Functions)

## Project Structure (Phase 1)
```
imomguide/
├── public/           # Static assets
├── src/
│   ├── components/   # Reusable UI components
│   ├── pages/        # HTML pages (index.html, chat.html, etc.)
│   ├── styles/       # CSS files
│   ├── utils/        # Firebase/Logic utilities
│   └── api/          # API calling logic
├── functions/        # Firebase Functions (Backend)
├── .gitignore
└── README.md
```

## Implementation Progress

### Phase 1: Initial Setup (Completed)
- [x] Create project directory structure.
- [x] Implement Landing Page (`src/pages/index.html`).
- [x] Implement Base Styles (`src/styles/main.css`).
- [x] Implement Base JS with Firebase initialization and Usage Tracking (`src/app.js`).
- [x] Configure `.gitignore`.

### Phase 2: AI Chat & Expert Panel (Completed)
- [x] Implement AI Chat Page (`src/pages/chat.html`).
- [x] Set up Firebase Config and Utility (`src/utils/firebase-config.js`).
- [x] Implement Google Gemini API Integration (`src/api/gemini.js`).
- [x] Implement Chat Logic with Usage Tracking (`src/chat.js`).
- [x] Implement Expert Personas (Pediatrician, Mom, Psychologist).
- [x] Integrate Summary and Disclaimer sections.

### Phase 3: Auth & Premium Features (Completed)
- [x] Implement Login/Signup (`src/pages/login.html`).
- [x] Create Auth Styles (`src/styles/auth.css`) and Logic (`src/auth.js`).
- [x] Implement My Page (`src/pages/mypage.html`) with Profile and History.
- [x] Create My Page Styles (`src/styles/mypage.css`) and Logic (`src/mypage.js`).
- [x] Integrate Firebase Auth (Email/Google) and Firestore User Profiles.

### Phase 4: Content & Tools (Completed)
- [x] Implement Legal Pages (`src/pages/terms.html`, `src/pages/privacy.html`).
- [x] Create Legal Styles (`src/styles/legal.css`).
- [x] Implement Guide List Page (`src/pages/guides.html`) with Trimester/Age tabs.
- [x] Implement First SEO Content (`src/pages/pregnancy/week-8.html`).
- [x] Create Guide and Article Styles (`src/styles/guides.css`, `src/styles/article.css`).
- [x] Implement Calculators (Due Date, Growth Percentile, Feeding, etc.).
- [x] Implement Usage Limit system (`src/utils/usage-limiter.js`).
- [x] Integrate Affiliate Marketing components (`src/utils/affiliate-manager.js`).
- [x] SEO Optimization (`sitemap.xml`, `robots.txt`).
- [x] Implement Community Page (`src/pages/community.html`).

### High-Priority Content Expansion (In Progress)
- [x] Implement Pregnancy 4 Weeks Guide (`src/pages/pregnancy/week-4.html`).
- [x] Implement Pregnancy 12 Weeks Guide (`src/pages/pregnancy/week-12.html`).
- [x] Implement Newborn Guide (0-1 Month) (`src/pages/baby/month-0.html`).
- [x] Implement Baby 6 Months Guide (`src/pages/baby/month-6.html`).
- [x] Implement Guide Index Pages (`src/pages/pregnancy/index.html`, `src/pages/baby/index.html`).
- [x] Implement Premium Membership Page (`src/pages/premium.html`).

### Next Steps
1.  **Payment Integration**: Integrate Toss Payments for actual subscription processing.
2.  **AdSense Integration**: Add ad units to high-traffic guide pages.
3.  **Content Scaling**: Use `scripts/generate-content.js` to create remaining weeks/months.
4.  **Advanced SEO**: Generate Sitemap entries for all new pages.
