import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../../api/axios';

// 메모 조회 액션
export const fetchMemo = createAsyncThunk(
    'memo/fetchMemo',
    async (articleId, { rejectWithValue }) => {
        try {
            const response = await api.get(`/scraps/memos/${articleId}`);
            if (!response.data.data) {
                return null;
            }

            return response.data.data;
        } catch (err) {

            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

// 메모 수정 액션
export const updateMemo = createAsyncThunk(
    'memo/updateMemo',
    async ({ memoId, content }, { rejectWithValue }) => {
        try {
            const response = await api.patch(`/scraps/memos/${memoId}`, {
                content: content
            });


            return response.data.data;
        } catch (err) {

            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

const initialState = {
    memo: null,
    loading: false,
    error: null
};

const memoSlice = createSlice({
    name: 'memo',
    initialState,
    reducers: {
        resetMemo: (state) => initialState
    },
    extraReducers: (builder) => {
        builder
            // 메모 조회
            .addCase(fetchMemo.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchMemo.fulfilled, (state, action) => {
                state.loading = false;
                state.memo = action.payload;
            })
            .addCase(fetchMemo.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // 메모 수정
            .addCase(updateMemo.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateMemo.fulfilled, (state, action) => {
                state.loading = false;
                state.memo = action.payload;
            })
            .addCase(updateMemo.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const { resetMemo } = memoSlice.actions;
export default memoSlice.reducer;