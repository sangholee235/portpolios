import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from '../../api/axios';

// Fetch notifications with pagination
export const fetchNotifications = createAsyncThunk(
  "notification/fetchAll",
  async ({ page = 1, size = 10 }) => {
    const response = await api.get(`/notification?page=${page}&size=${size}`);
    return response.data;
  }
);

// Mark notification as read
export const markAsRead = createAsyncThunk(
  "notification/markAsRead",
  async (notificationId) => {
    const response = await api.put(`/notification/${notificationId}`);
    return { notificationId, data: response.data };
  }
);

// Check for unread notifications
export const fetchUnreadExists = createAsyncThunk(
  "notification/fetchUnreadExists",
  async () => {
    const response = await api.get('/notification/unread-exists');
    return response.data;
  }
);

// 읽지 않은 모든 알람 조회
export const markAsReadAll = createAsyncThunk(
  "notification/markAsReadAll",
  async () => {
    const response = await api.put('/notification/read-all');
    return response.data;
  }
)

const notificationSlice = createSlice({
  name: "notification",
  initialState: {
    notifications: [], // notification content
    status: "idle",    // API 상태 관리
    error: null,       // 에러 상태 관리
    hasUnread: false,  // 읽지 않은 알림 존재 여부
    pagination: {      // 페이지네이션 정보
      pageNumber: 1,
      totalPages: 1,
      totalElements: 0,
      pageSize: 10,
      first: true,
      last: false
    },
    // eventSource: null, // SSE 연결 객체 저장
  },
  reducers: {
    clearNotifications: (state) => {
      state.notifications = [];
      state.pagination = {
        pageNumber: 1,
        totalPages: 1,
        totalElements: 0,
        pageSize: 10,
        first: true,
        last: false
      };
    },
    updateHasUnread: (state, action) => {
      state.hasUnread = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch notifications
      .addCase(fetchNotifications.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.notifications = action.payload.data.content;
        state.pagination = {
          pageNumber: action.payload.data.pageNumber,
          totalPages: action.payload.data.totalPages,
          totalElements: action.payload.data.totalElements,
          pageSize: action.payload.data.pageSize,
          first: action.payload.data.first,
          last: action.payload.data.last
        };
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      // Mark as read
      .addCase(markAsRead.fulfilled, (state, action) => {
        state.notifications = state.notifications.filter(
          (n) => n.notificationId !== action.payload.notificationId
        );
      })
      // Check unread exists
      .addCase(fetchUnreadExists.fulfilled, (state, action) => {
        state.hasUnread = action.payload.data.hasUnread;
      })

  },
});

export const { clearNotifications, updateHasUnread } = notificationSlice.actions;
export default notificationSlice.reducer;