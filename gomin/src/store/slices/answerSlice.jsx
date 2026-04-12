import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios";

/* 답변에 대한 API와 상태를 관리하는 슬라이스 */

/* 답변 생성 하는 API */
export const createAnswer = createAsyncThunk(
  "answer/create",
  async ({ sushiId, content }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/sushi/rail/${sushiId}/answer`, {
        content,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

/* 답변에 대한 좋아요를 누르는 API */
export const toggleLike = createAsyncThunk(
  "answer/toggleLike",
  async (answerId) => {
    const response = await api.post(`/answer/${answerId}/like`);
    return { answerId, data: response.data };
  }
);

/* 본인이 단 답변에 대한 초밥 리스트를 불러오는 API */
export const fetchMyAnswers = createAsyncThunk(
  "answer/fetchMyAnswers",
  async ({ page = 1, size = 10 }) => {
    const response = await api.get("/answer", {
      params: {
        page,
        size,
      },
    });
    return response.data;
  }
);

/* 본인 답변에 대한 본 초밥의 상세 페이지 API */
export const fetchAnswerDetail = createAsyncThunk(
  "answer/fetchAnswerDetail",
  async (sushiId) => {
    const response = await api.get(`/answer/${sushiId}`);
    return response.data;
  }
);

const answerSlice = createSlice({
  name: "answer",
  initialState: {
    answers: [],
    myAnswers: [],
    answerDetail: null, // 상세 답변 상태 추가
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createAnswer.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createAnswer.fulfilled, (state, action) => {
        state.status = "idle";
        state.answers.push(action.payload.data);
      })
      .addCase(createAnswer.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(toggleLike.fulfilled, (state, action) => {
        const answer = state.answers.find(
          (a) => a.answerId === action.payload.answerId
        );
        if (answer) {
          answer.isLiked = !answer.isLiked;
        }
      })
      .addCase(fetchMyAnswers.fulfilled, (state, action) => {
        state.myAnswers = action.payload.data;
      })
      .addCase(fetchAnswerDetail.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchAnswerDetail.fulfilled, (state, action) => {
        state.status = "idle";
        state.answerDetail = action.payload.data; // 상세 답변 정보 저장
      })
      .addCase(fetchAnswerDetail.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default answerSlice.reducer;
