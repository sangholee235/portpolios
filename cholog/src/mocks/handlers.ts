import { http, HttpResponse } from "msw";

const BASE = "https://www.cholog.com/api";

// ─────────────────────────────────────────────────────────────────────────────
// Mock Data
// ─────────────────────────────────────────────────────────────────────────────

const MOCK_USER = { nickname: "포트폴리오 유저" };

const MOCK_PROJECTS = [
  {
    id: 1,
    name: "쇼핑몰 Backend",
    projectToken: "mock-token-abc123",
    isCreator: true,
    createdAt: "2025-01-15T09:00:00Z",
  },
  {
    id: 2,
    name: "결제 서비스",
    projectToken: "mock-token-def456",
    isCreator: false,
    createdAt: "2025-01-20T11:30:00Z",
  },
  {
    id: 3,
    name: "사용자 인증 API",
    projectToken: "mock-token-ghi789",
    isCreator: true,
    createdAt: "2025-02-01T14:00:00Z",
  },
];

const MOCK_LOG_STATS = {
  total: 12847,
  trace: 1024,
  debug: 3210,
  info: 6543,
  warn: 1421,
  error: 589,
  fatal: 60,
};

const makeTimestamp = () => new Date().toISOString();

const generateTimeline = (days: number) => {
  const result = [];
  const now = new Date();
  for (let i = days; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    result.push({
      timestamp: d.toISOString().split("T")[0],
      logCount: Math.floor(Math.random() * 80) + 10,
    });
  }
  return result;
};

const generateTrend = (days: number) => {
  const result = [];
  const now = new Date();
  for (let i = days; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    result.push({
      date: d.toISOString().split("T")[0],
      errorCount: Math.floor(Math.random() * 40) + 5,
    });
  }
  return result;
};

const MOCK_LOGS = Array.from({ length: 30 }, (_, i) => ({
  id: `log-${1000 + i}`,
  level: ["INFO", "WARN", "ERROR", "DEBUG", "TRACE", "FATAL"][i % 6] as string,
  message: [
    "사용자 로그인 성공",
    "결제 처리 시작",
    "NullPointerException in OrderService",
    "데이터베이스 연결 확인",
    "API 요청 수신",
    "재고 업데이트 완료",
    "이메일 발송 실패",
    "캐시 만료 처리",
    "장바구니 세션 종료",
    "상품 검색 인덱스 갱신",
  ][i % 10],
  apiPath: ["/api/users/login", "/api/orders", "/api/payments", "/api/products", "/api/cart"][i % 5],
  traceId: `trace-${2000 + i}`,
  timestamp: new Date(Date.now() - i * 3600000).toISOString(),
  source: (i % 3 === 0 ? "frontend" : "backend") as "frontend" | "backend",
  projectKey: "SHOP",
  environment: "production",
  logger: [
    "com.example.service.UserService",
    "com.example.service.OrderService",
    "com.example.controller.PaymentController",
  ][i % 3],
  logType: (i % 3 === 0 ? "FRONTEND" : "BACKEND") as string,
}));

const MOCK_ARCHIVED_LOGS = Array.from({ length: 10 }, (_, i) => ({
  // ArchivedLogItem 타입 준수
  logId: `archived-log-${500 + i}`,
  nickname: ["김개발", "이백엔드", "박프론트"][i % 3],
  memo: i % 2 === 0 ? `아카이브 이유: ${["결제 오류 재발 방지", "서버 다운 원인 분석", "인증 실패 패턴"][i % 3]}` : "",
  logLevel: ["ERROR", "FATAL", "WARN"][i % 3] as "ERROR" | "FATAL" | "WARN",
  logSource: (i % 3 === 0 ? "frontend" : "backend") as "frontend" | "backend",
  logType: i % 3 === 0 ? "FRONTEND" : "BACKEND",
  logEnvironment: "production",
  logMessage: `아카이브된 로그 #${i + 1}: ${["결제 오류 - PaymentService.processPayment()", "서버 다운 - ServerHealthCheck 실패", "인증 실패 - TokenExpiredException"][i % 3]}`,
  logTimestamp: new Date(Date.now() - (i + 30) * 86400000).toISOString(),
}));

const MOCK_LOG_DETAIL = (logId: string) => ({
  // LogDetail 타입 준수
  id: logId,
  level: "ERROR",
  message: "NullPointerException: Cannot invoke method getUser() on null object reference",
  source: "backend" as const,
  projectKey: "SHOP",
  apiPath: "/api/orders/create",
  traceId: `trace-detail-${logId}`,
  timestamp: new Date().toISOString(),
  environment: "production",
  logger: "com.example.service.OrderService",
  logType: "BACKEND",
  error: {
    type: "NullPointerException",
    message: "Cannot invoke method getUser() on null object reference",
    stacktrace:
      "java.lang.NullPointerException: Cannot invoke method getUser()\n\tat com.example.service.OrderService.createOrder(OrderService.java:87)\n\tat com.example.controller.OrderController.create(OrderController.java:45)\n\tat sun.reflect.NativeMethodAccessorImpl.invoke0(Native Method)",
  },
  client: {
    url: "https://shop.example.com/orders/new",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    referrer: "https://shop.example.com/cart",
  },
  http: {
    durationMs: 342,
    request: {
      method: "POST",
      url: "/api/orders/create",
    },
    response: {
      statusCode: 500,
    },
  },
  payload: {
    userId: null,
    items: [{ productId: 101, quantity: 2 }],
  },
});

const MOCK_TRACE_LOGS = (traceId: string) => [
  {
    // LogDetail 타입 준수: id 필드 사용
    id: `trace-log-1-${traceId}`,
    level: "INFO",
    message: "주문 생성 요청 수신",
    source: "backend" as const,
    projectKey: "SHOP",
    apiPath: "/api/orders/create",
    traceId,
    timestamp: new Date(Date.now() - 300).toISOString(),
    environment: "production",
    logger: "com.example.controller.OrderController",
    logType: "BACKEND",
  },
  {
    id: `trace-log-2-${traceId}`,
    level: "DEBUG",
    message: "사용자 정보 조회 중",
    source: "backend" as const,
    projectKey: "SHOP",
    apiPath: "/api/orders/create",
    traceId,
    timestamp: new Date(Date.now() - 200).toISOString(),
    environment: "production",
    logger: "com.example.service.UserService",
    logType: "BACKEND",
  },
  {
    id: `trace-log-3-${traceId}`,
    level: "ERROR",
    message: "NullPointerException: 사용자 정보 없음",
    source: "backend" as const,
    projectKey: "SHOP",
    apiPath: "/api/orders/create",
    traceId,
    timestamp: new Date(Date.now() - 100).toISOString(),
    environment: "production",
    logger: "com.example.service.OrderService",
    logType: "BACKEND",
    error: {
      type: "NullPointerException",
      message: "사용자 정보 없음",
    },
  },
];

// GetWebhookSettingResponse.data shape: { exists, webhookSetting: { id, mmURL, logLevel, notificationENV, isEnabled } }
const MOCK_WEBHOOK = {
  exists: true,
  webhookItem: {
    id: 1,
    mmURL: "https://hooks.mattermost.com/services/T00000/B00000/XXXX",
    keywords: "ERROR,FATAL",
    notificationENV: "production",
    isEnabled: true,
  },
};

const MOCK_JIRA_CONFIG = {
  exists: true,
  projectKey: "SHOP",
  instanceUrl: "https://mycompany.atlassian.net",
};

// JiraIssueInfo shape: { userNames, projectId, issueTypes, priorities }
const MOCK_JIRA_ISSUE_INFO = {
  projectId: 1,
  userNames: [
    { userName: "dev@company.com" },
    { userName: "backend@company.com" },
    { userName: "frontend@company.com" },
  ],
  issueTypes: [
    { id: "10001", name: "Bug" },
    { id: "10002", name: "Task" },
    { id: "10003", name: "Story" },
  ],
  priorities: [
    { id: "1", name: "Highest" },
    { id: "2", name: "High" },
    { id: "3", name: "Medium" },
    { id: "4", name: "Low" },
  ],
};


const makeReport = (projectId: number): object => ({
  projectId,
  periodDescription: `${new Date(Date.now() - 7 * 86400000).toISOString().split("T")[0]} ~ ${new Date().toISOString().split("T")[0]}`,
  generatedAt: new Date().toISOString(),
  totalLogCounts: {
    overallTotal: 12847,
    frontendTotal: 3421,
    backendTotal: 9426,
  },
  logLevelDistribution: {
    distribution: [
      { level: "INFO", count: 6543, percentage: 50.9 },
      { level: "DEBUG", count: 3210, percentage: 25.0 },
      { level: "WARN", count: 1421, percentage: 11.1 },
      { level: "ERROR", count: 589, percentage: 4.6 },
      { level: "TRACE", count: 1024, percentage: 8.0 },
      { level: "FATAL", count: 60, percentage: 0.5 },
    ],
    totalLogsInDistribution: 12847,
  },
  topErrors: [
    { rank: 1, errorIdentifier: "NullPointerException", occurrenceCount: 142, sourceOrigin: "backend" },
    { rank: 2, errorIdentifier: "TimeoutException", occurrenceCount: 98, sourceOrigin: "backend" },
    { rank: 3, errorIdentifier: "DatabaseException", occurrenceCount: 67, sourceOrigin: "backend" },
    { rank: 4, errorIdentifier: "ValidationException", occurrenceCount: 54, sourceOrigin: "frontend" },
    { rank: 5, errorIdentifier: "AuthenticationException", occurrenceCount: 41, sourceOrigin: "backend" },
  ],
  slowBackendApis: [
    { rank: 1, httpMethod: "GET", requestPath: "/api/orders/history", averageResponseTimeMs: 1842, maxResponseTimeMs: 5230, totalRequests: 2341 },
    { rank: 2, httpMethod: "POST", requestPath: "/api/payments/process", averageResponseTimeMs: 1234, maxResponseTimeMs: 4100, totalRequests: 891 },
    { rank: 3, httpMethod: "GET", requestPath: "/api/products/search", averageResponseTimeMs: 876, maxResponseTimeMs: 2980, totalRequests: 5621 },
    { rank: 4, httpMethod: "GET", requestPath: "/api/users/profile", averageResponseTimeMs: 543, maxResponseTimeMs: 1200, totalRequests: 12840 },
    { rank: 5, httpMethod: "PUT", requestPath: "/api/orders/status", averageResponseTimeMs: 421, maxResponseTimeMs: 980, totalRequests: 445 },
  ],
});

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

const ok = (data: unknown) =>
  HttpResponse.json({ success: true, data, timestamp: makeTimestamp() });

const created = (data: unknown) =>
  HttpResponse.json(
    { success: true, data, timestamp: makeTimestamp() },
    { status: 201 }
  );

// ─────────────────────────────────────────────────────────────────────────────
// Handlers
// ─────────────────────────────────────────────────────────────────────────────

export const handlers = [
  // ── User ──────────────────────────────────────────────────────────────────

  http.get(`${BASE}/user`, () => ok(MOCK_USER)),

  http.post(`${BASE}/user`, () =>
    ok({ message: "회원가입이 완료되었습니다." })
  ),

  http.post(`${BASE}/user/login`, () => ok({ nickname: MOCK_USER.nickname })),

  http.post(`${BASE}/user/logout`, () => ok({})),

  // ── Project ───────────────────────────────────────────────────────────────

  http.get(`${BASE}/project`, () => ok({ projects: MOCK_PROJECTS })),

  http.post(`${BASE}/project`, async ({ request }) => {
    const body = (await request.json()) as { name: string };
    const newProject = {
      id: MOCK_PROJECTS.length + 1,
      name: body.name,
      projectToken: `mock-token-new-${Date.now()}`,
      isCreator: true,
      createdAt: new Date().toISOString(),
    };
    MOCK_PROJECTS.push(newProject);
    return created({ id: newProject.id });
  }),

  http.get(`${BASE}/project/:projectId`, ({ params }) => {
    const project = MOCK_PROJECTS.find((p) => p.id === Number(params.projectId));
    if (!project) return HttpResponse.json({ success: false }, { status: 404 });
    return ok({ name: project.name, projectToken: project.projectToken });
  }),

  http.put(`${BASE}/project/:projectId`, async ({ params, request }) => {
    const body = (await request.json()) as { name: string };
    const project = MOCK_PROJECTS.find((p) => p.id === Number(params.projectId));
    if (project) project.name = body.name;
    return ok({ id: Number(params.projectId) });
  }),

  http.delete(`${BASE}/project/:projectId/me`, ({ params }) => {
    const idx = MOCK_PROJECTS.findIndex((p) => p.id === Number(params.projectId));
    if (idx !== -1) MOCK_PROJECTS.splice(idx, 1);
    return ok({});
  }),

  http.delete(`${BASE}/project/:projectId`, ({ params }) => {
    const idx = MOCK_PROJECTS.findIndex((p) => p.id === Number(params.projectId));
    if (idx !== -1) MOCK_PROJECTS.splice(idx, 1);
    return ok({});
  }),

  http.post(`${BASE}/project/uuid`, () =>
    ok({ token: `invite-${Date.now()}-${Math.random().toString(36).slice(2)}` })
  ),

  http.post(`${BASE}/project/join`, () => ok({})),

  // extraFeaturesSlice: PUT /project/:projectId/jira
  http.put(`${BASE}/project/:projectId/jira`, async ({ params }) => {
    return ok({ projectId: Number(params.projectId) });
  }),

  // ── Log Stats ─────────────────────────────────────────────────────────────

  http.get(`${BASE}/log/:projectId/stats`, () => ok(MOCK_LOG_STATS)),

  http.get(`${BASE}/log/:projectId/errors/top3`, () =>
    ok([
      { errorName: "NullPointerException", errorCode: "NPE-001", count: 142 },
      { errorName: "TimeoutException", errorCode: "TO-002", count: 98 },
      { errorName: "DatabaseException", errorCode: "DB-003", count: 67 },
    ])
  ),

  http.get(`${BASE}/log/:projectId/timeline`, () =>
    ok(generateTimeline(14))
  ),

  http.get(`${BASE}/log/:projectId/errors/type-ratio`, () =>
    ok([
      { errorType: "NullPointerException", count: 142, ratio: 35.2 },
      { errorType: "TimeoutException", count: 98, ratio: 24.3 },
      { errorType: "DatabaseException", count: 67, ratio: 16.6 },
      { errorType: "ValidationException", count: 54, ratio: 13.4 },
      { errorType: "기타", count: 43, ratio: 10.5 },
    ])
  ),

  http.get(`${BASE}/log/:projectId/errors/trend`, () =>
    ok(generateTrend(14))
  ),

  // ── Log List & Search ─────────────────────────────────────────────────────

  http.get(`${BASE}/log/:projectId`, ({ request }) => {
    const url = new URL(request.url);
    const page = Number(url.searchParams.get("page") ?? 1);
    const size = Number(url.searchParams.get("size") ?? 20);
    const level = url.searchParams.get("level");

    const filtered = level
      ? MOCK_LOGS.filter((l) => l.level === level.toUpperCase())
      : MOCK_LOGS;

    const start = (page - 1) * size;
    const content = filtered.slice(start, start + size);

    return ok({
      content,
      pageNumber: page,
      pageSize: size,
      totalElements: filtered.length,
      totalPages: Math.ceil(filtered.length / size),
      first: page === 1,
      last: start + size >= filtered.length,
    });
  }),

  http.get(`${BASE}/log/:projectId/search`, ({ request }) => {
    const url = new URL(request.url);
    const keyword = url.searchParams.get("keyword") ?? "";
    const message = url.searchParams.get("message") ?? "";
    const apiPath = url.searchParams.get("apiPath") ?? "";
    const level = url.searchParams.get("level") ?? "";
    const source = url.searchParams.get("source") ?? "";
    const page = Number(url.searchParams.get("page") ?? 1);
    const size = Number(url.searchParams.get("size") ?? 10);
    const term = keyword || message;
    const filtered = MOCK_LOGS.filter((l) => {
      if (level && l.level.toLowerCase() !== level.toLowerCase()) return false;
      if (source && l.source !== source) return false;
      if (apiPath && !l.apiPath.includes(apiPath)) return false;
      if (term && !l.message.toLowerCase().includes(term.toLowerCase()) && !l.apiPath.includes(term)) return false;
      return true;
    });
    const start = (page - 1) * size;
    return ok({
      content: filtered.slice(start, start + size),
      pageNumber: page,
      pageSize: size,
      totalElements: filtered.length,
      totalPages: Math.ceil(filtered.length / size) || 1,
      first: page === 1,
      last: start + size >= filtered.length,
    });
  }),

  // ── Log Detail & Trace ────────────────────────────────────────────────────

  http.get(`${BASE}/log/:projectId/detail/:logId`, ({ params }) =>
    ok(MOCK_LOG_DETAIL(params.logId as string))
  ),

  http.get(`${BASE}/log/:projectId/trace/:traceId`, ({ params }) =>
    ok(MOCK_TRACE_LOGS(params.traceId as string))
  ),

  // archive GET은 catch-all보다 먼저 선언해야 함
  http.get(`${BASE}/log/:projectId/archive`, () =>
    ok({
      content: MOCK_ARCHIVED_LOGS,
      pageNumber: 1,
      pageSize: 20,
      totalElements: MOCK_ARCHIVED_LOGS.length,
      totalPages: 1,
      first: true,
      last: true,
    })
  ),

  http.get(`${BASE}/log/:projectId/:apiPath`, ({ params }) => {
    const filtered = MOCK_LOGS.filter((l) =>
      l.apiPath.includes(decodeURIComponent(params.apiPath as string))
    );
    return ok({
      content: filtered,
      pageNumber: 1,
      pageSize: 20,
      totalElements: filtered.length,
      totalPages: 1,
      first: true,
      last: true,
    });
  }),

  // ── Archive ───────────────────────────────────────────────────────────────

  http.post(`${BASE}/log/:projectId/archive`, () =>
    ok({ archivedCount: 5 })
  ),

  // ── Report ────────────────────────────────────────────────────────────────

  http.post(`${BASE}/report/:projectId`, ({ params }) => ok(makeReport(Number(params.projectId)))),

  http.post(`${BASE}/report/:projectId/pdf`, () =>
    new HttpResponse(new Blob(["mock-pdf-content"], { type: "application/pdf" }), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": "attachment; filename=report.pdf",
      },
    })
  ),

  // ── Webhook ───────────────────────────────────────────────────────────────

  http.get(`${BASE}/webhook/:projectId`, () => ok(MOCK_WEBHOOK)),

  // CreateWebhookSettingResponse.data is {}
  http.post(`${BASE}/webhook/:projectId`, () => created({})),

  // UpdateWebhookSettingResponse.data is { id: string }
  http.put(`${BASE}/webhook/:projectId`, () => ok({ id: "1" })),

  // ── LLM Analysis ──────────────────────────────────────────────────────────

  http.post(`${BASE}/log/:projectId/analysis`, async ({ request }) => {
    const body = (await request.json()) as { logId: string };
    return ok({
      analysisResult: `## AI 로그 분석 결과\n\n**로그 ID**: ${body.logId}\n\n### 원인 분석\n이 오류는 \`OrderService.createOrder()\` 메서드에서 사용자 객체가 null인 상태로 메서드가 호출되어 발생했습니다.\n\n### 재현 조건\n- 세션이 만료된 상태에서 주문 생성 요청\n- 인증 토큰 없이 API 호출\n\n### 해결 방안\n1. **입력 검증 강화**: 메서드 진입 전 null 체크 추가\n2. **인증 미들웨어**: 모든 요청에 인증 필터 적용\n3. **전역 예외 처리**: NullPointerException 전역 핸들러 구현`,
      modelUsed: "claude-3-5-sonnet",
    });
  }),

  // ── Jira ──────────────────────────────────────────────────────────────────

  // jiraSlice: /jira/user 엔드포인트
  http.get(`${BASE}/jira/user`, () =>
    ok({ exists: true, userName: "dev@company.com", jiraToken: "mock-jira-api-token-xxxx" })
  ),

  http.put(`${BASE}/jira/user`, () => ok({})),

  http.post(`${BASE}/jira/user`, () => ok({})),

  http.get(`${BASE}/jira/project/:projectId`, () => ok(MOCK_JIRA_CONFIG)),

  http.post(`${BASE}/jira/project/:projectId`, () => created(MOCK_JIRA_CONFIG)),

  http.put(`${BASE}/jira/project/:projectId`, () => ok(MOCK_JIRA_CONFIG)),

  // jiraSlice fetchJiraIssueInfo expects: { userNames, projectId, issueTypes, priorities }
  http.get(`${BASE}/jira/issue/:projectId`, ({ params }) =>
    ok({ ...MOCK_JIRA_ISSUE_INFO, projectId: Number(params.projectId) })
  ),

  // jiraSlice createJiraIssue expects: { issueKey, issueUrl }
  http.post(`${BASE}/jira/issue/:projectId`, async () => {
    const issueKey = `SHOP-${125 + Math.floor(Math.random() * 10)}`;
    return created({
      issueKey,
      issueUrl: `https://mycompany.atlassian.net/browse/${issueKey}`,
    });
  }),

  // GetJiraTokenResponse.data: { projectId, token }
  http.get(`${BASE}/jira/:projectId/token`, ({ params }) =>
    ok({ projectId: Number(params.projectId), token: "mock-jira-api-token-xxxx" })
  ),
];
