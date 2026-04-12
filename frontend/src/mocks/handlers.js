import { http, HttpResponse } from "msw";

const BASE = "/api/v1";

// ─────────────────────────────────────────────────────────────────────────────
// Mock Data
// ─────────────────────────────────────────────────────────────────────────────

const CATEGORIES = ["AI", "Frontend", "Backend", "DevOps", "Mobile", "Security", "Database", "Cloud"];

const MOCK_ARTICLES = Array.from({ length: 40 }, (_, i) => ({
  articleId: i + 1,
  title: [
    "React 19의 새로운 기능 완전 정리",
    "Spring Boot 3.x로 마이크로서비스 구축하기",
    "ChatGPT API를 활용한 AI 챗봇 만들기",
    "Kubernetes 클러스터 최적화 전략",
    "TypeScript 5.0 제네릭 심화 학습",
    "Docker Compose로 개발 환경 구성하기",
    "GraphQL vs REST API 완벽 비교",
    "Redis를 활용한 캐싱 전략 구현",
    "Next.js 14 App Router 완전 가이드",
    "AWS Lambda 서버리스 아키텍처 설계",
    "PostgreSQL 성능 최적화 인덱싱 전략",
    "Vue.js 3 Composition API 실전 활용",
    "Flutter로 크로스플랫폼 앱 개발",
    "Kafka 스트림 처리 파이프라인 구축",
    "OAuth 2.0 & JWT 인증 시스템 구현",
    "CI/CD 파이프라인 자동화 Jenkins + GitHub Actions",
    "Python FastAPI 고성능 REST API 개발",
    "MongoDB 스키마 설계 베스트 프랙티스",
    "WebSocket으로 실시간 채팅 구현하기",
    "Terraform으로 인프라 코드화(IaC) 실현",
  ][i % 20],
  summary: [
    "최신 버전에서 추가된 핵심 기능들을 실제 코드 예제와 함께 상세히 살펴봅니다.",
    "마이크로서비스 패턴을 적용하여 확장 가능한 백엔드 시스템을 구축하는 방법을 알아봅니다.",
    "OpenAI API를 활용하여 실제 서비스에 적용 가능한 AI 기능을 개발하는 실전 가이드입니다.",
    "프로덕션 환경에서 발생하는 성능 이슈를 해결하기 위한 실용적인 전략을 소개합니다.",
    "타입 안전성을 극대화하기 위한 고급 타입 기법과 실무 활용 패턴을 다룹니다.",
  ][i % 5],
  thumbnailImageUrl: `https://picsum.photos/seed/${i + 1}/400/250`,
  datetime: new Date(Date.now() - i * 86400000 * 2).toISOString(),
  category: CATEGORIES[i % CATEGORIES.length],
  journal: ["Tech Blog", "Medium", "Dev.to", "Velog", "Tistory"][i % 5],
  link: "https://example.com/article",
  likeCount: Math.floor(Math.random() * 200) + 10,
  isLiked: i % 4 === 0,
  viewCount: Math.floor(Math.random() * 1000) + 50,
}));

const MOCK_ARTICLE_DETAIL = (articleId) => {
  const base = MOCK_ARTICLES.find((a) => a.articleId === Number(articleId)) || MOCK_ARTICLES[0];
  const similarArticles = MOCK_ARTICLES
    .filter((a) => a.articleId !== base.articleId && a.category === base.category)
    .slice(0, 4)
    .map((a) => ({
      articleId: a.articleId,
      title: a.title,
      journal: a.journal,
      category: a.category,
      summary: a.summary,
      thumbnailImageUrl: a.thumbnailImageUrl,
      datetime: a.datetime,
    }));
  return {
    ...base,
    liked: base.isLiked,    // articleSlice: state.liked = action.payload.liked
    scraped: false,          // articleSlice: state.scraped = action.payload.scraped
    scrapId: null,
    reporter: "테크메이트 편집부",
    images: [
      { imageUrl: base.thumbnailImageUrl, caption: base.title },
    ],
    content: `이 글에서는 ${base.title}에 대해 자세히 알아보겠습니다.\n\n기술 스택의 기본 개념과 핵심 원리를 이해하는 것이 중요합니다. 실무에서 자주 사용되는 패턴과 안티패턴을 구분하여 적용하면 개발 생산성을 크게 향상시킬 수 있습니다.\n\n실제 프로젝트에 적용할 때는 팀의 기술 스택과 기존 아키텍처를 고려해야 합니다. 성능 병목 지점을 파악하고 적절한 최적화 전략을 수립하세요.\n\n최신 트렌드를 따라가되, 팀의 현실적인 역량과 유지보수 비용을 함께 고려하는 균형 잡힌 시각이 필요합니다. 새로운 기술을 도입할 때는 충분한 PoC와 팀 내 지식 공유가 선행되어야 합니다.\n\n지속적인 학습과 실전 경험을 통해 역량을 키워나가시기 바랍니다. 커뮤니티 활동과 오픈소스 기여도 좋은 성장 방법입니다.`,
    memo: null,
    similarArticles,
  };
};

const MOCK_FOLDERS = [
  { folderId: 1, folderName: "AI & ML", scrapCount: 5, createdAt: "2025-01-10T09:00:00Z" },
  { folderId: 2, folderName: "프론트엔드", scrapCount: 8, createdAt: "2025-01-15T11:00:00Z" },
  { folderId: 3, folderName: "백엔드 & 인프라", scrapCount: 3, createdAt: "2025-02-01T14:00:00Z" },
];

const MOCK_SCRAPS = {
  1: MOCK_ARTICLES.slice(0, 5).map((a, i) => ({
    scrapId: i + 1,
    folderId: 1,
    articleId: a.articleId,
    title: a.title,
    summary: a.summary,
    thumbnailImageUrl: a.thumbnailImageUrl,
    images: [{ imageUrl: a.thumbnailImageUrl }],
    category: a.category,
    journal: a.journal,
    datetime: a.datetime,
    memo: i === 0 ? "나중에 다시 읽기" : null,
  })),
  2: MOCK_ARTICLES.slice(5, 13).map((a, i) => ({
    scrapId: i + 10,
    folderId: 2,
    articleId: a.articleId,
    title: a.title,
    summary: a.summary,
    thumbnailImageUrl: a.thumbnailImageUrl,
    images: [{ imageUrl: a.thumbnailImageUrl }],
    category: a.category,
    journal: a.journal,
    datetime: a.datetime,
    memo: null,
  })),
  3: MOCK_ARTICLES.slice(13, 16).map((a, i) => ({
    scrapId: i + 20,
    folderId: 3,
    articleId: a.articleId,
    title: a.title,
    summary: a.summary,
    thumbnailImageUrl: a.thumbnailImageUrl,
    images: [{ imageUrl: a.thumbnailImageUrl }],
    category: a.category,
    journal: a.journal,
    datetime: a.datetime,
    memo: null,
  })),
};

const MOCK_QUIZZES = (articleId) => [
  {
    quiz_id: articleId * 10 + 1,
    quizId: articleId * 10 + 1,
    question: "다음 중 이 기술의 주요 특징으로 올바르지 않은 것은?",
    reason: "서버 사이드 렌더링(SSR)은 현대 프레임워크에서 널리 지원되는 기능입니다.",
    options: [
      { option_id: 1, optionId: 1, text: "성능 최적화가 가능하다", is_correct: false, choice_rate: 10, option_selection_rate: 10 },
      { option_id: 2, optionId: 2, text: "타입 안전성을 보장한다", is_correct: false, choice_rate: 15, option_selection_rate: 15 },
      { option_id: 3, optionId: 3, text: "서버 사이드 렌더링을 지원하지 않는다", is_correct: true, choice_rate: 62, option_selection_rate: 62 },
      { option_id: 4, optionId: 4, text: "모듈 시스템을 활용할 수 있다", is_correct: false, choice_rate: 13, option_selection_rate: 13 },
    ],
    correctOptionId: 3,
  },
  {
    quiz_id: articleId * 10 + 2,
    quizId: articleId * 10 + 2,
    question: "해당 기술을 사용할 때 가장 중요한 고려사항은?",
    reason: "팀의 기술 스택 호환성은 새로운 기술 도입 시 가장 먼저 검토해야 할 핵심 요소입니다.",
    options: [
      { option_id: 1, optionId: 1, text: "코드 가독성", is_correct: false, choice_rate: 20, option_selection_rate: 20 },
      { option_id: 2, optionId: 2, text: "팀의 기술 스택 호환성", is_correct: true, choice_rate: 55, option_selection_rate: 55 },
      { option_id: 3, optionId: 3, text: "개발 환경 설정", is_correct: false, choice_rate: 15, option_selection_rate: 15 },
      { option_id: 4, optionId: 4, text: "버전 관리", is_correct: false, choice_rate: 10, option_selection_rate: 10 },
    ],
    correctOptionId: 2,
  },
  {
    quiz_id: articleId * 10 + 3,
    quizId: articleId * 10 + 3,
    question: "다음 중 성능 최적화를 위한 올바른 접근법은?",
    reason: "캐싱 전략을 활용하면 불필요한 연산과 네트워크 요청을 줄여 성능을 크게 개선할 수 있습니다.",
    options: [
      { option_id: 1, optionId: 1, text: "무조건 최신 버전 사용", is_correct: false, choice_rate: 8, option_selection_rate: 8 },
      { option_id: 2, optionId: 2, text: "캐싱 전략 적극 활용", is_correct: true, choice_rate: 70, option_selection_rate: 70 },
      { option_id: 3, optionId: 3, text: "모든 기능 한 번에 구현", is_correct: false, choice_rate: 12, option_selection_rate: 12 },
      { option_id: 4, optionId: 4, text: "테스트 없이 빠른 배포", is_correct: false, choice_rate: 10, option_selection_rate: 10 },
    ],
    correctOptionId: 2,
  },
];

const MOCK_USER_ACTIVITY = {
  readArticlesCount: 47,
  scrapArticlesCount: 16,
  solvedQuizCount: 23,
};

// 퀴즈 풀이 현황 - 날짜별 풀이 횟수 (최근 30일)
const generateQuizTryDates = () => {
  const dates = {};
  const now = new Date();
  for (let i = 30; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split("T")[0];
    if (Math.random() > 0.4) {
      dates[dateStr] = Math.floor(Math.random() * 3) + 1;
    }
  }
  return dates;
};

const MOCK_QUIZ_HISTORY_DATA = {
  tryToDates: generateQuizTryDates(),
};

// In-memory state
let folders = [...MOCK_FOLDERS];
let scraps = { ...MOCK_SCRAPS };
let scrapCounter = 100;
let folderCounter = 10;

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

const ok = (data) =>
  HttpResponse.json({ success: true, data, timestamp: new Date().toISOString() });

const paginated = (items, page = 1, size = 10) => {
  const start = (page - 1) * size;
  return {
    content: items.slice(start, start + size),
    totalElements: items.length,
    totalPages: Math.ceil(items.length / size),
    page,
    size,
    first: page === 1,
    last: start + size >= items.length,
    numberOfElements: Math.min(size, items.length - start),
    empty: items.length === 0,
  };
};

// ─────────────────────────────────────────────────────────────────────────────
// Handlers
// ─────────────────────────────────────────────────────────────────────────────

export const handlers = [
  // ── Auth ──────────────────────────────────────────────────────────────────

  http.post(`${BASE}/credentials`, () =>
    HttpResponse.json({
      success: true,
      data: { accessToken: "mock-access-token-techmate" },
      timestamp: new Date().toISOString(),
    })
  ),

  http.post(`${BASE}/credentials/login`, () =>
    HttpResponse.json({
      success: true,
      data: { accessToken: "mock-access-token-techmate" },
      timestamp: new Date().toISOString(),
    })
  ),

  // OAuth 검증 엔드포인트 (KakaoCallback, GoogleCallback에서 사용)
  http.get(`${BASE}/credentials/oauth/valid/register`, () =>
    HttpResponse.json({
      success: true,
      data: {
        isRegistered: true,
        idToken: "mock-id-token",
      },
    })
  ),

  http.delete(`${BASE}/credentials`, () =>
    HttpResponse.json({ success: true, data: {} })
  ),

  // ── User ──────────────────────────────────────────────────────────────────

  http.get(`${BASE}/users/nickname`, () =>
    HttpResponse.json({ success: true, data: { nickname: "테크메이트 유저" } })
  ),

  http.patch(`${BASE}/users/nickname`, async ({ request }) => {
    const body = await request.json();
    localStorage.setItem("nickname", body.nickname);
    return HttpResponse.json({ success: true, data: { nickname: body.nickname } });
  }),

  http.get(`${BASE}/users/activity`, () => ok(MOCK_USER_ACTIVITY)),

  http.get(`${BASE}/users/quiz`, () => ok(MOCK_QUIZ_HISTORY_DATA)),

  // 로그아웃
  http.post(`${BASE}/credentials/logout`, () => ok({})),

  // ── User Preference (온보딩) ───────────────────────────────────────────────

  http.get(`${BASE}/user-preference/random`, () =>
    ok(
      MOCK_ARTICLES.slice(0, 12).map((a) => ({
        articleId: a.articleId,
        title: a.title,
        journal: a.journal,
        summary: a.summary,
        thumbnailImageUrl: a.thumbnailImageUrl,
        datetime: a.datetime,
        category: a.category,
      }))
    )
  ),

  // ── Articles ──────────────────────────────────────────────────────────────

  http.get(`${BASE}/articles/recommend`, ({ request }) => {
    const url = new URL(request.url);
    const page = Number(url.searchParams.get("page") ?? 0);
    const size = Number(url.searchParams.get("size") ?? 5);
    const start = page * size;
    const content = MOCK_ARTICLES.slice(start, start + size);
    // fetchRecommendArticles thunk에서 response.data.data를 반환하고
    // slice에서 action.payload.content를 사용함
    return ok({ content, totalElements: MOCK_ARTICLES.length, totalPages: Math.ceil(MOCK_ARTICLES.length / size) });
  }),

  http.get(`${BASE}/articles/category`, ({ request }) => {
    const url = new URL(request.url);
    const category = url.searchParams.get("category") ?? "";
    const page = Number(url.searchParams.get("page") ?? 1);
    const size = Number(url.searchParams.get("size") ?? 10);
    const filtered = category
      ? MOCK_ARTICLES.filter((a) => a.category === category)
      : MOCK_ARTICLES;
    return ok(paginated(filtered, page, size));
  }),

  http.get(`${BASE}/articles/hot`, ({ request }) => {
    const url = new URL(request.url);
    const page = Number(url.searchParams.get("page") ?? 1);
    const size = Number(url.searchParams.get("size") ?? 10);
    const sorted = [...MOCK_ARTICLES].sort((a, b) => b.viewCount - a.viewCount);
    return ok(paginated(sorted, page, size));
  }),

  http.get(`${BASE}/articles/recent`, ({ request }) => {
    const url = new URL(request.url);
    const page = Number(url.searchParams.get("page") ?? 1);
    const size = Number(url.searchParams.get("size") ?? 10);
    return ok(paginated(MOCK_ARTICLES, page, size));
  }),

  http.get(`${BASE}/articles/search`, ({ request }) => {
    const url = new URL(request.url);
    const keyword = url.searchParams.get("keyword") ?? "";
    const page = Number(url.searchParams.get("page") ?? 1);
    const size = Number(url.searchParams.get("size") ?? 10);
    const filtered = keyword
      ? MOCK_ARTICLES.filter(
          (a) =>
            a.title.toLowerCase().includes(keyword.toLowerCase()) ||
            a.summary.toLowerCase().includes(keyword.toLowerCase()) ||
            a.category.toLowerCase().includes(keyword.toLowerCase())
        )
      : MOCK_ARTICLES;
    return ok(paginated(filtered, page, size));
  }),

  http.get(`${BASE}/articles/:articleId`, ({ params }) => {
    const articleId = Number(params.articleId);
    const detail = MOCK_ARTICLE_DETAIL(articleId);
    // reflect live scrap state so memo button shows after scrapping
    let scraped = false;
    let scrapId = null;
    for (const folderId in scraps) {
      const found = scraps[folderId].find((s) => s.articleId === articleId);
      if (found) { scraped = true; scrapId = found.scrapId; break; }
    }
    return ok({ ...detail, scraped, scrapId });
  }),

  // toggleLikeArticle.fulfilled uses action.payload.articleId to update article list
  http.post(`${BASE}/article-like/:articleId`, ({ params }) => {
    const articleId = Number(params.articleId);
    const article = MOCK_ARTICLES.find((a) => a.articleId === articleId);
    if (article) {
      article.isLiked = !article.isLiked;
      article.likeCount += article.isLiked ? 1 : -1;
    }
    return ok({ articleId, liked: article?.isLiked ?? true });
  }),

  // ── Quiz ──────────────────────────────────────────────────────────────────

  http.get(`${BASE}/articles/:articleId/quiz`, ({ params }) => {
    const articleId = Number(params.articleId);
    // quizSlice reads: action.payload.data.quizzes, .articleId, .quizAttemptStatus, .selectOptions
    return HttpResponse.json({
      success: true,
      data: {
        quizzes: MOCK_QUIZZES(articleId),
        articleId,
        quizAttemptStatus: false,
        selectOptions: [],
      },
    });
  }),

  http.post(`${BASE}/articles/:articleId/quiz`, async ({ request, params }) => {
    const body = await request.json();
    const quizzes = MOCK_QUIZZES(Number(params.articleId) || 1);
    let correct = 0;
    (body.answers || body).forEach((answer) => {
      const quiz = quizzes.find((q) => q.quiz_id === answer.quizId || q.quizId === answer.quizId);
      const selectedOpt = answer.selectedOptionId ?? answer.optionId;
      if (quiz && quiz.correctOptionId === selectedOpt) correct++;
    });
    return ok({
      score: correct,
      totalQuestions: quizzes.length,
      results: quizzes.map((q) => ({
        quizId: q.quizId,
        correctOptionId: q.correctOptionId,
        explanation: "이 보기가 정답인 이유는 기술 문서에 명시된 핵심 특징과 일치하기 때문입니다.",
      })),
    });
  }),

  // ── Scraps & Folders ──────────────────────────────────────────────────────

  http.get(`${BASE}/scraps/folders`, () => {
    const content = folders.map((f) => ({
      ...f,
      scrapCount: (scraps[f.folderId] || []).length,
    }));
    // folderSlice: state.folders = action.payload.data → component uses folders.content
    return ok({
      content,
      pageable: {},
      size: content.length,
      number: 0,
      sort: [],
      first: true,
      last: true,
      numberOfElements: content.length,
      empty: content.length === 0,
    });
  }),

  http.post(`${BASE}/scraps/folders`, async ({ request }) => {
    const body = await request.json();
    const newFolder = {
      folderId: ++folderCounter,
      folderName: body.folderName,
      scrapCount: 0,
      createdAt: new Date().toISOString(),
    };
    folders.push(newFolder);
    scraps[newFolder.folderId] = [];
    // createFolder.fulfilled: state.folders.content.unshift(action.payload.data)
    return ok(newFolder);
  }),

  http.patch(`${BASE}/scraps/folders/:folderId`, async ({ params, request }) => {
    const body = await request.json();
    const folder = folders.find((f) => f.folderId === Number(params.folderId));
    if (folder) folder.folderName = body.folderName;
    // updateFolder.fulfilled: state.folders.content[index] = action.payload.data
    return ok(folder);
  }),

  http.delete(`${BASE}/scraps/folders/:folderId`, ({ params }) => {
    const folderId = Number(params.folderId);
    folders = folders.filter((f) => f.folderId !== folderId);
    delete scraps[folderId];
    return ok({});
  }),

  http.get(`${BASE}/scraps/:folderId`, ({ params }) => {
    const folderId = Number(params.folderId);
    const folderScraps = scraps[folderId] || [];
    // scrapSlice state.scraps = action.payload.data → component uses scraps.content
    return ok({
      content: folderScraps,
      pageable: {},
      size: folderScraps.length,
      number: 0,
      sort: [],
      first: true,
      last: true,
      numberOfElements: folderScraps.length,
      empty: folderScraps.length === 0,
    });
  }),

  http.post(`${BASE}/scraps/:articleId/folders/:folderId`, ({ params }) => {
    const { articleId, folderId } = params;
    const article = MOCK_ARTICLES.find((a) => a.articleId === Number(articleId));
    if (!article) return HttpResponse.json({ success: false }, { status: 404 });

    const newScrap = {
      scrapId: ++scrapCounter,
      folderId: Number(folderId),
      articleId: Number(articleId),
      title: article.title,
      summary: article.summary,
      thumbnailImageUrl: article.thumbnailImageUrl,
      images: [{ imageUrl: article.thumbnailImageUrl }],
      category: article.category,
      journal: article.journal,
      datetime: article.datetime,
      memo: null,
    };

    if (!scraps[Number(folderId)]) scraps[Number(folderId)] = [];
    scraps[Number(folderId)].push(newScrap);

    const folder = folders.find((f) => f.folderId === Number(folderId));
    if (folder) folder.scrapCount++;

    // scrapSlice.addScrap.fulfilled: state.scraps.content.unshift(action.payload.data)
    // return the full scrap object so the list updates correctly
    return ok(newScrap);
  }),

  http.delete(`${BASE}/scraps/:scrapId`, ({ params }) => {
    const scrapId = Number(params.scrapId);
    for (const folderId in scraps) {
      const idx = scraps[folderId].findIndex((s) => s.scrapId === scrapId);
      if (idx !== -1) {
        scraps[folderId].splice(idx, 1);
        const folder = folders.find((f) => f.folderId === Number(folderId));
        if (folder && folder.scrapCount > 0) folder.scrapCount--;
        break;
      }
    }
    return ok({});
  }),

  // ── Memos ─────────────────────────────────────────────────────────────────

  http.get(`${BASE}/scraps/memos/:articleId`, ({ params }) => {
    const articleId = Number(params.articleId);
    for (const folderId in scraps) {
      const scrap = scraps[folderId].find((s) => s.articleId === articleId);
      if (scrap?.memo) {
        return ok({ memoId: scrap.scrapId, scrapId: scrap.scrapId, folderId: scrap.folderId, content: scrap.memo });
      }
    }
    return ok(null);
  }),

  http.patch(`${BASE}/scraps/memos/:memoId`, async ({ params, request }) => {
    const body = await request.json();
    const memoId = Number(params.memoId);
    for (const folderId in scraps) {
      const scrap = scraps[folderId].find((s) => s.scrapId === memoId);
      if (scrap) {
        scrap.memo = body.content;
        return ok({ memoId, content: body.content });
      }
    }
    return ok({ memoId, content: body.content });
  }),
];
