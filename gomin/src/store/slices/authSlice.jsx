import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios";
import { clearMemberData, setAuthData } from "./memberSlice";

export const kakaoLogin = createAsyncThunk(
  "auth/kakaoLogin",
  async ({ clientId, redirectUri }, { rejectWithValue }) => {
    try {
      const kakaoAuthUrl = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}`;
      window.location.href = kakaoAuthUrl;
    } catch (error) {
      return rejectWithValue(error.response?.data || "카카오 로그인 요청 실패");
    }
  }
);

export const GoogleLogin = createAsyncThunk(
  "auth/GoogleLogin",
  async ({ clientId, redirectUri, state }, { rejectWithValue }) => {
    try {
      const GoogleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=email profile&state=${state}`;
      window.location.href = GoogleAuthUrl;
    } catch (error) {
      return rejectWithValue(error.response?.data || "카카오 로그인 요청 실패");
    }
  }
);

export const socialLogin = createAsyncThunk(
  "auth/socialLogin",
  async ({ provider, code }, { dispatch, rejectWithValue }) => {
    try {
      const response = await api.post(`/oauth/${provider}`, { code });

      dispatch(setAuthData(response.data.data));

      localStorage.setItem("accessToken", response.data.data.accessToken);
      localStorage.setItem("userNickname", response.data.data.user.nickname);

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "소셜 로그인 요청 실패");
    }
  }
);

export const logoutApi = createAsyncThunk(
  "auth/logoutApi",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      await api.post("/api/auth/logout");
      dispatch(clearMemberData());
    } catch (error) {
      return rejectWithValue(error.response?.data || "로그아웃 요청 실패");
    }
  }
);

/** 닉네임 수정 API */
export const updateNickname = createAsyncThunk(
  "auth/updateNickname",
  async (nickname, { rejectWithValue }) => {
    try {
      const response = await api.put("/user/nickname", { nickname });
      return response.data; // 서버 응답 전체를 반환 ({success, data, error})
    } catch (error) {
      return rejectWithValue("닉네임 변경 실패");
    }
  }
);

export const deleteAccount = createAsyncThunk(
  "auth/deleteAccount",
  async (_, { dispatch }) => {
    await api.delete("/user/me");
    dispatch(clearMemberData());
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    accessToken: null,
    isAuthenticated: false,
    user: null,
    status: "idle",
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.accessToken = null;
      state.isAuthenticated = false;
      state.user = null;
      localStorage.removeItem("accessToken");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(kakaoLogin.pending, (state) => {
        state.status = "loading";
      })
      .addCase(kakaoLogin.fulfilled, (state) => {
        state.status = "succeeded";
      })
      .addCase(kakaoLogin.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(socialLogin.fulfilled, (state, action) => {
        state.accessToken = action.payload.data.accessToken;
        state.isAuthenticated = true;
        state.user = action.payload.data.user;
        localStorage.setItem("accessToken", action.payload.data.accessToken);
      })
      .addCase(logoutApi.fulfilled, (state) => {
        state.accessToken = null;
        state.isAuthenticated = false;
        state.user = null;
        localStorage.removeItem("accessToken");
      })
      .addCase(updateNickname.fulfilled, (state, action) => {
        if (state.user) {
          state.user.nickname = action.payload.data.nickname;
          localStorage.setItem("userNickname", action.payload.data.nickname);
        }
      })
      .addCase(deleteAccount.fulfilled, (state) => {
        state.accessToken = null;
        state.isAuthenticated = false;
        state.user = null;
        localStorage.removeItem("accessToken");
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
