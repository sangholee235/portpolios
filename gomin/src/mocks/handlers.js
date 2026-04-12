import { http, HttpResponse } from "msw";

const BASE = "/api";

// ─────────────────────────────────────────────────────────────────────────────
// Mock Data
// ─────────────────────────────────────────────────────────────────────────────

const SUSHI_TAGS = [
  ["직장", "인간관계"],
  ["진로", "취업"],
  ["연애", "관계"],
  ["가족", "고민"],
  ["금전", "생활"],
  ["건강", "마음"],
  ["학업", "공부"],
  ["인생", "결정"],
];

const SUSHI_CONTENTS = [
  "요즘 직장 동료와의 관계가 너무 힘들어요. 어떻게 대처해야 할까요?",
  "이직을 고민 중인데 지금 회사에 계속 다녀야 할지 새로운 곳으로 옮겨야 할지 모르겠어요.",
  "좋아하는 사람에게 고백해야 할까요? 거절당할까봐 너무 무서워요.",
  "부모님과의 갈등이 심해지고 있어요. 어떻게 화해할 수 있을까요?",
  "월세와 식비로 저축을 전혀 못하고 있어요. 돈 관리 어떻게 해야 할까요?",
  "매일 두통이 있는데 병원에 가야 할지 모르겠어요.",
  "시험 공부에 집중이 안 돼요. 효과적인 공부법이 있을까요?",
  "30대인데 아직도 인생 방향을 모르겠어요. 늦은 건 아닐까요?",
  "친구 사이가 멀어지는 것 같아 슬퍼요. 관계를 유지하려면 어떻게 해야 할까요?",
  "번아웃이 온 것 같은데 어떻게 회복해야 할지 모르겠어요.",
  "프리랜서로 독립할까 고민 중인데 리스크가 너무 커 보여요.",
  "자취를 시작했는데 혼자 있는 시간이 너무 외로워요.",
  "SNS를 끊어야 할지 고민이에요. 비교심리로 자존감이 낮아진 것 같아요.",
  "운동을 꾸준히 하고 싶은데 의지가 약해서 번번이 실패해요.",
  "새로운 언어를 배우고 싶은데 어디서 시작해야 할지 모르겠어요.",
];

// Sushi 카테고리 매핑 (연애=1, 우정=2, 진로=3, 건강=4, 가족=5, 기타=6)
const SUSHI_TITLES = [
  "직장 동료와의 갈등",
  "이직 고민 중",
  "고백할까요?",
  "부모님과 화해하고 싶어요",
  "돈 관리가 너무 힘들어요",
  "두통이 계속 있어요",
  "공부에 집중이 안 돼요",
  "인생 방향을 모르겠어요",
  "친구 사이가 멀어지는 것 같아요",
  "번아웃이 온 것 같아요",
  "프리랜서로 독립할까요?",
  "자취 외로움",
  "SNS를 끊어야 할까요?",
  "운동 의지 부족",
  "새로운 언어 학습",
];

const MOCK_SUSHI_LIST = Array.from({ length: 15 }, (_, i) => ({
  sushiId: i + 1,
  title: SUSHI_TITLES[i % SUSHI_TITLES.length],
  content: SUSHI_CONTENTS[i % SUSHI_CONTENTS.length],
  category: (i % 6) + 1,         // 1~6 numeric
  sushiType: (i % 12) + 1,       // 1~12 numeric
  isAnswered: i % 3 === 0,
  isLocked: i % 5 === 0,
  maxAnswers: 5,
  remainingAnswers: i % 3 === 0 ? 0 : Math.floor(Math.random() * 4) + 1,
  isClosed: i % 3 === 0,
  createdAt: new Date(Date.now() - i * 3600000 * 8).toISOString(),
  expirationTime: new Date(Date.now() + (i % 3 === 0 ? -86400000 : (3 - i % 3) * 3600000 * 12)).toISOString(),
  answerCount: i % 3 === 0 ? 5 : Math.floor(Math.random() * 4),
  likeCount: Math.floor(Math.random() * 20),
  shareToken: `share-token-${i + 1}`,
}));

const MOCK_MY_SUSHI = Array.from({ length: 8 }, (_, i) => ({
  sushiId: i + 100,
  title: SUSHI_TITLES[(i + 3) % SUSHI_TITLES.length],
  content: SUSHI_CONTENTS[(i + 3) % SUSHI_CONTENTS.length],
  category: ((i + 3) % 6) + 1,
  sushiType: ((i + 5) % 12) + 1,
  isAnswered: i % 2 === 0,
  isLocked: false,
  maxAnswers: 5,
  remainingAnswers: i % 2 === 0 ? 0 : Math.floor(Math.random() * 4) + 1,
  isClosed: i % 2 === 0,
  createdAt: new Date(Date.now() - i * 86400000).toISOString(),
  expirationTime: new Date(Date.now() + (i % 2 === 0 ? -86400000 : 86400000 * 2)).toISOString(),
  answerCount: i % 2 === 0 ? 5 : Math.floor(Math.random() * 3),
  likeCount: Math.floor(Math.random() * 10),
  shareToken: `share-token-my-${i + 100}`,
}));

const MOCK_ANSWERS = [
  {
    answerId: 1,
    sushiId: 1,
    content:
      "직장 동료와의 갈등은 먼저 상대방의 입장을 이해하려는 노력이 필요해요. 직접 대화를 시도해보세요. 감정을 쌓아두면 더 커질 수 있어요.",
    likeCount: 15,
    isLiked: false,
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    author: "익명의 고민상담사",
    isGPT: false,
  },
  {
    answerId: 2,
    sushiId: 1,
    content:
      "저도 비슷한 경험이 있었어요. 시간이 지나면 자연스럽게 해결되는 경우도 많더라고요. 너무 걱정하지 마세요!",
    likeCount: 8,
    isLiked: true,
    createdAt: new Date(Date.now() - 7200000).toISOString(),
    author: "익명의 직장인",
    isGPT: false,
  },
  {
    answerId: 3,
    sushiId: 1,
    content:
      "AI 분석: 직장 내 갈등 해결을 위해서는 ①명확한 소통, ②경계 설정, ③필요시 HR 부서 상담을 권장드립니다.",
    likeCount: 5,
    isLiked: false,
    createdAt: new Date(Date.now() - 10800000).toISOString(),
    author: "AI 고민 해결사",
    isGPT: true,
  },
];

const MOCK_MY_ANSWERS = Array.from({ length: 5 }, (_, i) => ({
  sushiId: i + 1,
  title: SUSHI_TITLES[i % SUSHI_TITLES.length],
  content: SUSHI_CONTENTS[i % SUSHI_CONTENTS.length],
  category: (i % 6) + 1,
  sushiType: (i % 12) + 1,
  isAnswered: true,
  isLocked: false,
  isLiked: i % 2 === 0,
  getLike: i % 3 === 0,
  createdAt: new Date(Date.now() - i * 86400000 * 2).toISOString(),
  myAnswer: {
    answerId: i + 10,
    content: [
      "제 생각엔 천천히 시작하는 게 좋을 것 같아요.",
      "비슷한 경험이 있는데, 시간이 약이더라고요.",
      "전문가의 도움을 받아보시는 건 어떨까요?",
      "작은 것부터 바꿔나가다 보면 달라질 거예요.",
      "응원합니다! 분명 잘 해내실 거예요.",
    ][i],
    likeCount: Math.floor(Math.random() * 12),
    isLiked: i % 2 === 0,
    createdAt: new Date(Date.now() - i * 86400000).toISOString(),
  },
}));

const NOTIFICATION_TYPES = [3, 2, 3, 1, 3, 2, 3, 1]; // 1=유통기한, 2=답변마감, 3=좋아요
const NOTIFICATION_MESSAGES = [
  "내 답변에 좋아요가 눌렸어요! 🎉",
  "내 초밥의 답변이 마감되었어요.",
  "내 답변에 또 좋아요가 눌렸어요!",
  "초밥의 유통기한이 임박했어요. 확인해보세요!",
  "새 답변에 좋아요가 달렸어요!",
  "초밥 답변 모집이 완료되었어요.",
  "따뜻한 공감을 받았어요 🌟",
  "유통기한 만료 전에 확인하세요!",
];

const MOCK_NOTIFICATIONS = Array.from({ length: 8 }, (_, i) => ({
  notificationId: i + 1,
  notificationType: NOTIFICATION_TYPES[i],
  message: NOTIFICATION_MESSAGES[i],
  isRead: i > 3,
  createdAt: new Date(Date.now() - i * 3600000 * 4).toISOString(),
  relatedSushiId: (i % 8) + 1,
  sushi: {
    sushiId: (i % 8) + 1,
    title: SUSHI_TITLES[(i + 1) % SUSHI_TITLES.length],
  },
}));

// In-memory state
let notifications = [...MOCK_NOTIFICATIONS];

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

const ok = (data) =>
  HttpResponse.json({
    success: true,
    data,
    timestamp: new Date().toISOString(),
  });

const MOCK_AUTH_DATA = {
  accessToken: "mock-access-token-portfolio",
  refreshToken: "mock-refresh-token-portfolio",
  user: {
    id: 1,
    nickname: "고민 초밥러",
    email: "demo@gomin.my",
    isNew: false,
    likesReceived: 42,
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// Handlers
// ─────────────────────────────────────────────────────────────────────────────

export const handlers = [
  // ── Auth ──────────────────────────────────────────────────────────────────

  http.post("/oauth/:provider", () => ok(MOCK_AUTH_DATA)),

  http.post(`${BASE}/auth/logout`, () => ok({})),

  http.get(`${BASE}/health`, () =>
    HttpResponse.json({ status: "UP" })
  ),

  // ── SSE (no-op: 포트폴리오에서는 실시간 알림 비활성화) ──────────────────

  http.get(`${BASE}/sse/subscribe`, () =>
    new HttpResponse("data: {}\n\n", {
      status: 200,
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    })
  ),

  // ── User ──────────────────────────────────────────────────────────────────

  http.get("/user/my-like", () =>
    ok({ totalLikes: MOCK_AUTH_DATA.user.likesReceived })
  ),

  http.put("/user/nickname", async ({ request }) => {
    const body = await request.json();
    MOCK_AUTH_DATA.user.nickname = body.nickname;
    localStorage.setItem("userNickname", body.nickname);
    return ok({ nickname: body.nickname });
  }),

  http.delete("/user/me", () => ok({})),

  http.get("/user/validate/:token", () =>
    ok({ valid: true, user: MOCK_AUTH_DATA.user })
  ),

  // ── Sushi (Questions) ─────────────────────────────────────────────────────

  http.get("/sushi/rail", ({ request }) => {
    const url = new URL(request.url);
    const size = Number(url.searchParams.get("size") ?? 15);
    return ok({ sushi: MOCK_SUSHI_LIST.slice(0, size) });
  }),

  http.get("/sushi/my", ({ request }) => {
    const url = new URL(request.url);
    const page = Number(url.searchParams.get("page") ?? 1);
    const size = Number(url.searchParams.get("size") ?? 10);
    const keyword = url.searchParams.get("keyword") ?? "";
    const filtered = keyword
      ? MOCK_MY_SUSHI.filter((s) => s.content.includes(keyword))
      : MOCK_MY_SUSHI;
    const start = (page - 1) * size;
    return ok({
      content: filtered.slice(start, start + size),
      totalElements: filtered.length,
      totalPages: Math.ceil(filtered.length / size),
      page,
      size,
    });
  }),

  http.get("/sushi/rail/:sushiId", ({ params }) => {
    const sushi =
      MOCK_SUSHI_LIST.find((s) => s.sushiId === Number(params.sushiId)) ||
      MOCK_SUSHI_LIST[0];
    return ok({
      ...sushi,
      answers: MOCK_ANSWERS,
    });
  }),

  // SushiDetail reads `currentSushi.answer` (singular), not `answers`
  http.get("/sushi/my/:sushiId", ({ params }) => {
    const sushi =
      MOCK_MY_SUSHI.find((s) => s.sushiId === Number(params.sushiId)) ||
      MOCK_MY_SUSHI[0];
    return ok({
      ...sushi,
      answer: MOCK_ANSWERS,
    });
  }),

  http.get("/share/:token", () =>
    ok({
      ...MOCK_SUSHI_LIST[0],
      answers: MOCK_ANSWERS,
      shareToken: "mock-share-token",
    })
  ),

  http.post("/sushi", async ({ request }) => {
    const body = await request.json();
    const newSushiId = MOCK_SUSHI_LIST.length + 1;
    const newSushi = {
      sushiId: newSushiId,
      title: body.title || "새 고민",
      content: body.content,
      category: body.category || 6,
      sushiType: body.sushiType || 1,
      isAnswered: false,
      isLocked: false,
      maxAnswers: body.maxAnswers || 5,
      remainingAnswers: body.maxAnswers || 5,
      isClosed: false,
      createdAt: new Date().toISOString(),
      expirationTime: new Date(Date.now() + 86400000 * 3).toISOString(),
      answerCount: 0,
      likeCount: 0,
      token: `share-token-new-${newSushiId}`,  // PostSushi uses response.payload.data.token
    };
    MOCK_SUSHI_LIST.unshift(newSushi);
    return ok(newSushi);
  }),

  // ── Answers ───────────────────────────────────────────────────────────────

  http.post("/sushi/rail/:sushiId/answer", async ({ request }) => {
    const body = await request.json();
    const newAnswer = {
      answerId: MOCK_ANSWERS.length + 100,
      sushiId: 1,
      content: body.content,
      likeCount: 0,
      isLiked: false,
      createdAt: new Date().toISOString(),
      author: "고민 초밥러",
      isGpt: false,
    };
    MOCK_ANSWERS.push(newAnswer);
    return ok(newAnswer);
  }),

  http.get("/answer", ({ request }) => {
    const url = new URL(request.url);
    const page = Number(url.searchParams.get("page") ?? 1);
    const size = Number(url.searchParams.get("size") ?? 10);
    return ok({
      content: MOCK_MY_ANSWERS,
      totalElements: MOCK_MY_ANSWERS.length,
      totalPages: 1,
      page,
      size,
    });
  }),

  // SushiAnswerDetail reads `currentSushi.answer` as string (the user's own answer text)
  http.get("/answer/:sushiId", ({ params }) => {
    const item =
      MOCK_MY_ANSWERS.find((a) => a.sushiId === Number(params.sushiId)) ||
      MOCK_MY_ANSWERS[0];
    return ok({
      ...item,
      answer: item.myAnswer?.content || "답변 내용이 없습니다.",
    });
  }),

  http.post("/answer/:answerId/like", ({ params }) => {
    const answer = MOCK_ANSWERS.find(
      (a) => a.answerId === Number(params.answerId)
    );
    if (answer) {
      answer.isLiked = !answer.isLiked;
      answer.likeCount += answer.isLiked ? 1 : -1;
    }
    return ok({ liked: answer?.isLiked ?? true });
  }),

  // ── Notifications ─────────────────────────────────────────────────────────

  http.get("/notification", ({ request }) => {
    const url = new URL(request.url);
    const page = Number(url.searchParams.get("page") ?? 1);
    const size = Number(url.searchParams.get("size") ?? 10);
    const start = (page - 1) * size;
    // notificationSlice expects action.payload.data.content, action.payload.data.pageNumber etc.
    return ok({
      content: notifications.slice(start, start + size),
      pageNumber: page,
      totalPages: Math.ceil(notifications.length / size),
      totalElements: notifications.length,
      pageSize: size,
      first: page === 1,
      last: start + size >= notifications.length,
    });
  }),

  http.put("/notification/:notificationId", ({ params }) => {
    const n = notifications.find(
      (n) => n.notificationId === Number(params.notificationId)
    );
    if (n) n.isRead = true;
    return ok({});
  }),

  // notificationSlice: state.hasUnread = action.payload.data.hasUnread
  http.get("/notification/unread-exists", () =>
    ok({ hasUnread: notifications.some((n) => !n.isRead) })
  ),

  http.put("/notification/read-all", () => {
    notifications = notifications.map((n) => ({ ...n, isRead: true }));
    return ok({});
  }),

  // ── FCM ───────────────────────────────────────────────────────────────────

  http.post(`${BASE}/fcm/token`, () => ok({})),
  http.delete(`${BASE}/fcm/token`, () => ok({})),
];
