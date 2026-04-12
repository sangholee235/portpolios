import { createSlice, createAsyncThunk, isRejectedWithValue } from '@reduxjs/toolkit';
import api from "../../api/axios";

const initialState = {
    articles: [],
    currentArticle: null,
    recommendArticles: [],
    categoryArticles: [],
    loading: false,
    error: null,
    hasMore: true,
    currentPage: 0,
    liked: false,
    scraped: false,
    scrapId: null  // Add scrapId to track current scrap
};

/**
 * 추천 기사 리스트 조회
 * @param page : 요청 할 페이지
 * @param size : 요청 할 기사의 개수
 * 
 * @return articles [] : 기사 배열
 */
export const fetchRecommendArticles = createAsyncThunk(
    "article/fetchRecommendArticles",
    async (page = 0) => {
        const response = await api.get("/articles/recommend", {
            params: {
                page,
                size: 5,
            }
        });
        return response.data.data;
    }
);

/**
 * 기사 카테고리 리스트 조회
 * @param category : 요청 할 뉴스 카테고리
 * @param page : 요청 할 페이지
 * @param size : 요청 할 기사의 개수
 * 
 * @return articles [] : 기사 배열
 */
export const fetchCategoryArticles = createAsyncThunk(
    "article/fetchCategoryArticles",
    async ({ category = "", page = 1, size = 10 } = {}) => {
        const response = await api.get("/articles/category", {
            params: {
                category,
                page,
                size,
            }
        });
        return response.data;
    }
)

/**
 * 인기 기사 조회
 * @param page : 요청 할 페이지
 * @param size : 요청 할 기사의 개수
 * 
 * @return articles [] : 기사 배열
 */
export const fetchHotArticles = createAsyncThunk(
    "article/fetchHotArticles",
    async ({ page = 1, size = 10 } = {}) => {
        const response = await api.get("/articles/hot", {
            params: {
                page,
                size,
            }
        });
        return response.data;
    }
)

/**
 * 최신 기사 조회
 * @param page : 요청 할 페이지
 * @param size : 요청 할 기사의 개수
 * 
 * @return articles [] : 기사 배열
 */
export const fetchRecentArticles = createAsyncThunk(
    "article/fetchRecentArticles",
    async ({ page = 1, size = 10 } = {}) => {
        const response = await api.get("/articles/recent", {
            params: {
                page,
                size,
            }
        });
        return response.data;
    }
)

/**
 * @param keyword : 검색 키워드
 * @param page : 요청 할 페이지
 * @param size : 요청 할 기사의 개수
 */
export const fetchSearchArticles = createAsyncThunk(
    "article/fetchSearchArticles",  // Add this action type string
    async ({ keyword = "", page = 1, size = 10 } = {}) => {
        const response = await api.get("/articles/search", {
            params: {
                keyword,
                page,
                size,
            }
        });

        if (response.data.data.content.length === 0) {
            throw new Error("검색 결과가 없습니다.")
        }

        return response.data;
    }
)


/**
 * 기사 상세 조회
 * @param articleId : 기사 ID
 * 
 * @return article [] : 기사 상세 정보
 */
export const fetchArticleDetail = createAsyncThunk(
    "article/fetchArticleDetail",
    async (articleId) => {
        const response = await api.get(`/articles/${articleId}`);
        return response.data.data;
    }
)

/**
 * 기사에 대한 좋아요를 누르는 API
 * @param articleId : 기사 ID
 * 
 */
export const toggleLikeArticle = createAsyncThunk(
    "article/toggleLikeArticle",
    async (articleId) => {
        const response = await api.post(`/article-like/${articleId}`);
        return response.data;
    }
)

const articleSlice = createSlice({
    name: 'article',
    initialState,
    reducers: {
        resetArticle: (state) => {
            return initialState;
        }
    },
    extraReducers: (builder) => {
        builder
            // 상세 기사 조회 상태 관리
            .addCase(fetchArticleDetail.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchArticleDetail.fulfilled, (state, action) => {
                state.loading = false;
                state.article = action.payload;
                state.liked = action.payload.liked;
                state.scraped = action.payload.scraped;
                state.scrapId = action.payload.scrapId;  // Store scrapId from API response
            })

            // 추천 기사 조회 상태 관리
            .addCase(fetchRecommendArticles.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchRecommendArticles.fulfilled, (state, action) => {
                state.loading = false;
                // Check if it's the first page
                if (state.currentPage === 0) {
                    state.articles = action.payload.content;
                } else {
                    // Filter out duplicates when adding new articles
                    const newArticles = action.payload.content.filter(newArticle =>
                        !state.articles.some(existingArticle =>
                            existingArticle.articleId === newArticle.articleId
                        )
                    );
                    state.articles = [...state.articles, ...newArticles];
                }
                state.hasMore = action.payload.content.length === 5;
                state.currentPage += 1;
            })
            .addCase(fetchRecommendArticles.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })

            // 카테고리 별 기사 조회 상태 관리
            .addCase(fetchCategoryArticles.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCategoryArticles.fulfilled, (state, action) => {
                state.loading = false;
                // Check if it's the first page
                if (state.currentPage === 0) {
                    state.articles = action.payload.data.content;
                } else {
                    // Filter out duplicates when adding new articles
                    const newArticles = action.payload.data.content.filter(newArticle =>
                        !state.articles.some(existingArticle =>
                            existingArticle.articleId === newArticle.articleId
                        )
                    );
                    state.articles = [...state.articles, ...newArticles];
                }
                state.hasMore = action.payload.data.content.length === 5;
                state.currentPage += 1;
            })
            .addCase(fetchCategoryArticles.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            // 인기 기사 조회 상태 관리
            .addCase(fetchHotArticles.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchHotArticles.fulfilled, (state, action) => {
                state.loading = false;
                // Check if it's the first page
                if (state.currentPage === 0) {
                    state.articles = action.payload.data.content;
                } else {
                    // Filter out duplicates when adding new articles
                    const newArticles = action.payload.data.content.filter(newArticle =>
                        !state.articles.some(existingArticle =>
                            existingArticle.articleId === newArticle.articleId
                        )
                    );
                    state.articles = [...state.articles, ...newArticles];
                }
                state.hasMore = action.payload.data.content.length === 5;
                state.currentPage += 1;
            })
            .addCase(fetchHotArticles.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })

            // Handle toggleLikeArticle
            .addCase(toggleLikeArticle.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(toggleLikeArticle.fulfilled, (state, action) => {
                state.loading = false;
                state.liked = !state.liked;  // 좋아요 상태 토글

                // 현재 기사의 좋아요 상태 업데이트
                if (state.article) {
                    state.article = {
                        ...state.article,
                        liked: !state.article.liked
                    };
                }

                // 기사 목록의 좋아요 상태 업데이트
                state.articles = state.articles.map(article =>
                    article.articleId === action.payload.articleId
                        ? { ...article, liked: !article.liked }
                        : article
                );
            })
            .addCase(toggleLikeArticle.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })

            // 최신 기사 조회 상태 관리
            .addCase(fetchRecentArticles.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchRecentArticles.fulfilled, (state, action) => {
                state.loading = false;
                // Check if it's the first page
                if (state.currentPage === 0) {
                    state.articles = action.payload.data.content;
                } else {
                    // Filter out duplicates when adding new articles
                    const newArticles = action.payload.data.content.filter(newArticle =>
                        !state.articles.some(existingArticle =>
                            existingArticle.articleId === newArticle.articleId
                        )
                    );
                    state.articles = [...state.articles, ...newArticles];
                }
                state.hasMore = action.payload.data.content.length === 5;
                state.currentPage += 1;
            })
            .addCase(fetchRecentArticles.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            // 검색 기사 조회 상태 관리
            .addCase(fetchSearchArticles.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchSearchArticles.fulfilled, (state, action) => {
                state.loading = false;
                if (state.currentPage === 0) {
                    state.articles = action.payload.data.content;
                } else {
                    const newArticles = action.payload.data.content.filter(newArticle =>
                        !state.articles.some(existingArticle =>
                            existingArticle.articleId === newArticle.articleId
                        )
                    );
                    state.articles = [...state.articles, ...newArticles];
                }
                state.hasMore = action.payload.data.content.length === 5;
                state.currentPage += 1;
            })
            .addCase(fetchSearchArticles.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
    }
});

export const { resetArticle } = articleSlice.actions;

export default articleSlice.reducer;
