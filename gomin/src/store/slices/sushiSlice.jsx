import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios";

/* 초밥(질문)에 대한 API와 상태관리를 하는 슬라이스 */
export const fetchRailSushi = createAsyncThunk(
  "sushi/fetchRail",
  async (size = 15) => {
    const response = await api.get(`/sushi/rail?size=${size}`);
    return response.data;
  }
);

/* 본인이 등록한 초밥(질문)에 대한 리스트를 불러오는 API */
export const fetchMySushi = createAsyncThunk(
  "sushi/fetchMySushi",
  async ({ keyword = "", page = 1, size = 10 }) => {
    const response = await api.get("/sushi/my", {
      params: {
        keyword,
        page,
        size,
      },
    });
    return response.data;
  }
);

/* 레일에 있는 초밥 중 특정 초밥에 대한 데이터를 불러오는 API */
export const fetchSushiDetail = createAsyncThunk(
  "sushi/fetchDetail",
  async (sushiId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/sushi/rail/${sushiId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

/* 링크에 포함된 토큰으로로 특정 초밥에 대한 데이터를 불러오는 API */
export const fetchSushiByToken = createAsyncThunk(
  "sushi/fetchByToken",
  async (token, { rejectWithValue }) => {
    try {
      const response = await api.get(`/share/${token}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

/* 초밥(질문)을 등록하는 API */
export const createSushi = createAsyncThunk(
  "sushi/create",
  async (sushiData) => {
    const response = await api.post("/sushi", sushiData);
    return response.data;
  }
);

/* 나의 초밥(질문)에 대한 상세 데이터 요청 API */
export const fetchMySushiDetail = createAsyncThunk(
  "sushi/fetchMySushiDetail",
  async (sushiId) => {
    const response = await api.get(`/sushi/my/${sushiId}`);
    return response.data;
  }
);

const sushiSlice = createSlice({
  name: "sushi",
  initialState: {
    railSushi: [],
    mySushi: [],
    currentSushi: null,
    status: "idle",
    error: null,
    railSpeed: 15,
  },
  reducers: {
    clearCurrentSushi: (state) => {
      state.currentSushi = null;
    },
    increaseRailSpeed: (state) => {
      if (state.railSpeed > 5) {
        state.railSpeed -= 0.5;
      }
    },
    decreaseRailSpeed: (state) => {
      if (state.railSpeed < 20) {
        state.railSpeed += 0.5;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRailSushi.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchRailSushi.fulfilled, (state, action) => {
        state.status = "idle";
        state.railSushi = action.payload.data.sushi; // 응답 구조 수정
      })
      .addCase(fetchRailSushi.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(fetchMySushi.fulfilled, (state, action) => {
        state.mySushi = action.payload.data.content; // 응답 구조 수정
      })
      .addCase(fetchSushiDetail.pending, (state) => {
        state.currentSushi = "loading";
      })
      .addCase(fetchSushiDetail.fulfilled, (state, action) => {
        state.status = "idle";
        state.currentSushi = action.payload.data;
      })
      .addCase(fetchSushiDetail.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(fetchMySushiDetail.pending, (state) => {
        state.currentSushi = "loading";
      })
      .addCase(fetchMySushiDetail.fulfilled, (state, action) => {
        state.status = "idle";
        state.currentSushi = action.payload.data;
      })
      .addCase(fetchMySushiDetail.rejected, (state, action) => {
        state.state = "failed";
        state.error = action.error.message;
      })
      .addCase(clearCurrentSushi, (state) => {
        state.currentSushi = null;
      })
      .addCase(fetchSushiByToken.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchSushiByToken.fulfilled, (state, action) => {
        state.status = "idle";
        state.currentSushi = action.payload.data;
      })
      .addCase(fetchSushiByToken.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { clearCurrentSushi, increaseRailSpeed, decreaseRailSpeed } =
  sushiSlice.actions;
export default sushiSlice.reducer;
