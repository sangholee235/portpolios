import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/axios";

const initialState = {
  folders: {
    content: [],
    pageable: {},
    size: 0,
    number: 0,
    sort: [],
    first: true,
    last: false,
    numberOfElements: 0,
    empty: false,
  },
  loading: false,
  error: null,
};

// 폴더 리스트 조회
export const fetchFolders = createAsyncThunk(
  "folders/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/scraps/folders");
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

// 폴더 삭제
export const deleteFolder = createAsyncThunk(
  "folders/delete",
  async (folderId, { rejectWithValue }) => {
    try {
      await api.delete(`/scraps/folders/${folderId}`);
      return folderId;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

// 폴더 생성
export const createFolder = createAsyncThunk(
  "folders/create",
  async (folderName, { rejectWithValue }) => {
    try {

      const res = await api.post("/scraps/folders", { folderName });

      return res.data;
    } catch (err) {

      return rejectWithValue(err.response.data);
    }
  }
);

// 폴더 수정
export const updateFolder = createAsyncThunk(
  "folders/update",
  async ({ folderId, folderName }, { rejectWithValue }) => {
    try {
      const res = await api.patch(`/scraps/folders/${folderId}`, {
        folderName,
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

const folderSlice = createSlice({
  name: "folder",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // 생성 처리
      .addCase(createFolder.pending, (state) => {
        state.loading = true;
      })
      .addCase(createFolder.fulfilled, (state, action) => {

        state.folders.content.unshift(action.payload.data);
        state.loading = false;
      })
      .addCase(createFolder.rejected, (state, action) => {

        state.error = action.payload;
        state.loading = false;
      })

      // 수정 처리
      .addCase(updateFolder.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateFolder.fulfilled, (state, action) => {
        const updatedFolder = action.payload.data;
        const index = state.folders.content.findIndex(
          (folder) => folder.folderId === updatedFolder.folderId
        );
        if (index !== -1) {
          state.folders.content[index] = updatedFolder;
        }
        state.loading = false;
      })
      .addCase(updateFolder.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })

      // 조회 처리
      .addCase(fetchFolders.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchFolders.fulfilled, (state, action) => {
        state.folders = action.payload.data;
        state.loading = false;
      })
      .addCase(fetchFolders.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })

      // 삭제 처리
      .addCase(deleteFolder.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteFolder.fulfilled, (state, action) => {
        state.folders.content = state.folders.content.filter(
          (folder) => folder.folderId !== action.payload
        );
        state.loading = false;
      })
      .addCase(deleteFolder.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      });
  },
});

export default folderSlice.reducer;
