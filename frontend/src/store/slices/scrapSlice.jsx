// scrapeSlice.jsx
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../../api/axios';

const initialState = {
  scraps: {
    content: [],
    pageable: {},
    size: 0,
    number: 0,
    sort: [],
    first: true,
    last: false,
    numberOfElements: 0,
    empty: false
  },
  loading: false,
  error: null
};

// 스크랩 폴더 기준으로 조회
export const fetchScraps = createAsyncThunk(
  'scraps/fetch',
  async (folderId, { rejectWithValue }) => {
    try {
      const res = await api.get(`/scraps/${folderId}`);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const addScrap = createAsyncThunk(
  'scraps/add',
  async ({ articleId, folderId }, { rejectWithValue }) => {
    try {
      const res = await api.post(`/scraps/${articleId}/folders/${folderId}`);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const removeScrap = createAsyncThunk(
  'scraps/remove',
  async (scrapId, { rejectWithValue }) => {
    try {
      await api.delete(`/scraps/${scrapId}`);
      return scrapId;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

const scrapSlice = createSlice({
  name: 'scrap',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // 조회 처리
      //Immer 방식으로 상태 업데이트
      .addCase(fetchScraps.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchScraps.fulfilled, (state, action) => {
        state.scraps = action.payload.data;
        state.loading = false;
      })
      .addCase(fetchScraps.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })
      
      // 추가 처리
      .addCase(addScrap.fulfilled, (state, action) => {
        // console.log('스크랩 추가 성공:', action.payload);
        state.scraps.content.unshift(action.payload.data);
      })
      .addCase(addScrap.rejected, (state, action) => {
        // console.error('스크랩 추가 실패:', action.error);
        state.error = action.error;
      })
      
      // 삭제 처리
      .addCase(removeScrap.fulfilled, (state, action) => {
        // console.log('스크랩 삭제 성공:', action.payload);
        state.scraps.content = state.scraps.content.filter(
          scrap => scrap.scrapId !== action.payload
        );
      })
      .addCase(removeScrap.rejected, (state, action) => {
        // console.error('스크랩 삭제 실패:', action.error);
        state.error = action.error;
      });
  }
});

export default scrapSlice.reducer;
