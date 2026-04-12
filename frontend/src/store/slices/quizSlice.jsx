import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';

// Initial state structure
const initialState = {
    quizzes: [],
    articleId: null,
    quizAttemptStatus: false,
    selectOptions: [],
    loading: false,
    error: null
};

/**
 * 퀴즈 데이터 조회
 * @param articleId : 기사 ID
 */
export const fetchQuizzes = createAsyncThunk(
    'quiz/fetchQuizzes',
    async (articleId, { rejectWithValue }) => {
        try {
            const response = await api.get(`/articles/${articleId}/quiz`);
            return response.data;
        } catch (error) {
            // API 에러 응답이 있는 경우
            if (error.response) {
                if (error.response.data.reason === "solar api 서비스의 문제가 발생했습니다") {
                    alert("퀴즈 생성 오류. 다시 시도해주세요.");
                }
                return rejectWithValue({
                    status: error.response.status,
                    reason: error.response.data.reason,
                    path: error.response.data.spopath,
                    success: error.response.data.success,
                    timeStamp: error.response.data.timeStamp
                });
            }
            // 기타 에러
            return rejectWithValue({
                message: error.message || '알 수 없는 오류가 발생했습니다.'
            });
        }
    }
);

/**
 * 퀴즈 답변 제출
 * @param payload : { articleId: number, answers: Array<{quizId: number, optionId: number}> }
 */
export const submitQuizAnswers = createAsyncThunk(
    'quiz/submitQuizAnswers',
    async ({ articleId, answers }) => {
        // const response = await api.post(`/articles/${articleId}/quiz`, answers);
        const response = await api.post(`/articles/${articleId}/quiz`, answers);
        // console.log(response.data);
        return response.data;
    }
);

const quizSlice = createSlice({
    name: 'quiz',
    initialState,
    reducers: {
        resetQuiz: (state) => {
            return initialState;
        },
        updateSelectedOption: (state, action) => {
            const { quizId, optionId } = action.payload;
            const existingIndex = state.selectOptions.findIndex(
                option => option.quizId === quizId
            );

            if (existingIndex !== -1) {
                state.selectOptions[existingIndex].optionId = optionId;
            } else {
                state.selectOptions.push({ quizId, optionId });
            }
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch quizzes
            .addCase(fetchQuizzes.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchQuizzes.fulfilled, (state, action) => {
                state.loading = false;
                state.quizzes = action.payload.data.quizzes;
                state.articleId = action.payload.data.articleId;
                state.quizAttemptStatus = action.payload.data.quizAttemptStatus;
                state.selectOptions = action.payload.data.selectOptions || [];
            })
            .addCase(fetchQuizzes.rejected, (state, action) => {
                state.loading = false;
                // action.payload에 rejectWithValue로 전달한 에러 정보가 들어있음
                state.error = action.payload || action.error;

                // 퀴즈 생성 중인 상태 확인
                if (action.payload?.status === 404 &&
                    action.payload?.reason === "이미 퀴즈가 생성중 입니다.") {
                    state.isGenerating = true;
                }
            })
            // Submit answers
            .addCase(submitQuizAnswers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(submitQuizAnswers.fulfilled, (state, action) => {
                state.loading = false;
                state.quizAttemptStatus = true;  // 퀴즈 제출 완료 상태로 변경
                // 제출한 답변을 그대로 selectOptions에 저장
                if (action.meta.arg.answers) {
                    state.selectOptions = action.meta.arg.answers.map(answer => ({
                        quizId: answer.quizId,
                        optionId: answer.selectedOptionId ?? answer.optionId
                    }));
                }
            })
            .addCase(submitQuizAnswers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    }
});

export const { resetQuiz, updateSelectedOption } = quizSlice.actions;
export default quizSlice.reducer;