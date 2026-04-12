import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios";

const initialState = {
  nickname: localStorage.getItem("userNickname") || "",
  email: "",
  likesReceived: 0,
  accessToken: "default",
  refreshToken: "default",
  isNew: false,
};

/** 사용자 좋아요 개수 요청 API */
export const countLike = createAsyncThunk("member/countLike", async () => {
  try {
    const response = await api.get("/user/my-like");
    return response.data.data;
  } catch (error) {
  }
});

const memberSlice = createSlice({
  name: "member",
  initialState,
  reducers: {
    setMemberData: (state, action) => {
      const { nickname, email, likesReceived } = action.payload;
      state.nickname = nickname;
      state.email = email;
      state.likesReceived = likesReceived;
    },
    setAuthData: (state, action) => {
      const { accessToken, refreshToken, user } = action.payload;
      state.accessToken = accessToken;
      state.refreshToken = refreshToken;
      state.nickname = user.nickname;
      state.isNew = user.isNew;
    },
    updateNicknameState: (state, action) => {
      state.nickname = action.payload; // 닉네임 업데이트
    },
    updateLikesReceived: (state, action) => {
      state.likesReceived = action.payload;
    },
    clearMemberData: (state) => {
      state.nickname = "";
      state.email = "";
      state.likesReceived = 0;
      state.accessToken = "";
      state.refreshToken = "";
      state.isNew = false;
    },
    setIsNew: (state, action) => {
      state.isNew = action.payload; // ✅ isNew 값을 설정하는 액션 추가
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(countLike.fulfilled, (state, action) => {
        state.likesReceived = action.payload.totalLikes;
      })
      .addCase(countLike.rejected, (state, action) => {
      });
  },
});

export const {
  setMemberData,
  setAuthData,
  updateNicknameState,
  updateLikesReceived,
  clearMemberData,
  setIsNew, // ✅ 추가한 액션을 export
} = memberSlice.actions;
export default memberSlice.reducer;
