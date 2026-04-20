# Fronts — Multi-App Frontend Monorepo

React 기반 프론트엔드 프로젝트 3종을 하나의 레포지토리에서 관리하고, 포트폴리오 사이트와 함께 Vercel 단일 배포로 운영합니다.

---

## 프로젝트 구성

| 디렉터리 | 앱 이름 | 설명 |
|---|---|---|
| `portfolio/` | Portfolio | 세 프로젝트를 소개하는 메인 포트폴리오 페이지 |
| `gomin/` | 고민 한 접시 | 익명 고민 공유 소셜 플랫폼 |
| `frontend/` | TechMate | 개발자를 위한 IT 뉴스 큐레이션 서비스 |
| `cholog/` | CHO:LOG | 개발 초보자를 위한 로그 수집·분석 서비스 |

---

## 앱 소개

### 🍣 고민 한 접시 (`/gomin`)
고민을 초밥처럼 올려두면 누군가 답해주는 익명 고민 공유 플랫폼.  
마스터캣 캐릭터, BGM, 사운드 이펙트로 무거운 고민도 가볍게.

**주요 기능**
- 익명 고민 공유 & 답변
- 실시간 알림 (SSE)
- PWA · 푸시 알림
- Kakao / Google 소셜 로그인
- BGM & 사운드 이펙트

**기술 스택:** React 18 · Redux Toolkit · Firebase · Tailwind CSS · Vite · MSW

---

### 💡 TechMate (`/techmate`)
개발자를 위한 IT 뉴스 큐레이션 서비스.  
기사를 읽고 메모하며 퀴즈로 복습하는 맞춤형 학습 경험을 제공합니다.

**주요 기능**
- IT 뉴스 큐레이션 & 추천
- 기사 스크랩 & 폴더 관리
- AI 학습 퀴즈
- Google / Kakao OAuth 2.0
- 스켈레톤 UI & 부드러운 UX

**기술 스택:** React 19 · Redux Toolkit · Tailwind CSS · Vite · MSW · Markdown

---

### 🪵 CHO:LOG (`/cholog`)
개발 초보자도 쉽게 사용할 수 있는 로그 수집·분석 서비스.  
SDK 한 줄 삽입으로 로그를 수집하고, AI 분석부터 협업 알림까지 한 번에.

**주요 기능**
- SDK 한 줄로 로그 수집
- AI 로그 분석 (Claude)
- 시각화 대시보드 & PDF 리포트
- Jira 이슈 자동 생성
- Mattermost 웹훅 알림

**기술 스택:** React 19 · TypeScript · Redux Toolkit · Recharts · Framer Motion · Vite · MSW

---

## 로컬 개발

각 앱을 독립적으로 실행합니다.

```bash
# 고민 한 접시
cd gomin && npm install && npm run dev       # http://localhost:5173

# TechMate
cd frontend && npm install && npm run dev    # http://localhost:5174

# CHO:LOG
cd cholog && npm install && npm run dev      # http://localhost:5175

# Portfolio
cd portfolio && npm install && npm run dev   # http://localhost:5176
```

---

## 빌드 & 배포

Vercel에서 `portfolio/` 를 출력 디렉터리로 사용하여 단일 배포합니다.  
`portfolio/scripts/build-all.mjs` 가 전체 앱을 빌드하고 결과물을 `portfolio/dist/` 에 통합합니다.

```
vercel.json 배포 경로

/           → portfolio (메인)
/gomin/*    → 고민 한 접시
/techmate/* → TechMate
/cholog/*   → CHO:LOG
```

**Vercel 빌드 커맨드**
```bash
npm install --prefix gomin && \
npm install --prefix frontend && \
npm install --prefix cholog && \
npm install --prefix portfolio && \
node portfolio/scripts/build-all.mjs
```

---

## 레포지토리 구조

```
fronts/
├── portfolio/          # 포트폴리오 메인 (Vercel 출력 디렉터리)
│   ├── src/
│   │   ├── components/ # Hero, ProjectCard, ProjectsSection, Footer
│   │   └── data/       # projects.js (각 앱 메타 정보)
│   └── scripts/
│       └── build-all.mjs
├── gomin/              # 고민 한 접시
│   └── src/
├── frontend/           # TechMate
│   └── src/
├── cholog/             # CHO:LOG (TypeScript)
│   └── src/
└── vercel.json         # 라우팅 & 빌드 설정
```
