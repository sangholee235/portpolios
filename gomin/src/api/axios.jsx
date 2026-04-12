import axios from "axios";
import { ERROR_MESSAGES } from "../constants/errorMessages";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  } else {
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // 프론트엔드 단 에러
    if (!error.response) {
      return Promise.reject(error);
    }

    const errorCode = error.response?.data?.error?.code;
    const status = error.response?.status;

    // 401 Unauthorized 에러 처리
    if (status === 401) {
      localStorage.removeItem("accessToken"); // 토큰 삭제
      window.location.href = "/";
      return Promise.reject(error);
    }

    // 에러 코드에 따른 alert 발생

    const nonAlertErrors = ["R005", "R006"]; // 알림 모달 따로 구현한 에러

    if (
      errorCode &&
      ERROR_MESSAGES[errorCode] &&
      !nonAlertErrors.includes(errorCode)
    ) {
      alert(ERROR_MESSAGES[errorCode]);
    } else {
      // 등록되지 않은 에러는 콘솔에만 출력
      console.error("Unregistered error:", error.response?.data);
    }

    const authErrors = ["A001"]; // 로그인 필요
    const oauthErrors = ["O001", "O002", "O003", "O004", "O005"];

    // 페이지 이동이 필요한 에러 (인증, 권한)
    if ([...authErrors, ...oauthErrors].includes(errorCode)) {
      window.location.href = "/";
    }
    // 홈 이동이 필요한 에러
    else if (["S003", "S004", "S005", "R001"].includes(errorCode)) {
      window.location.href = "/home";
    }

    // 단순 알림만 필요한 에러 (좋아요, 답변 관련)
    // R003(이미 좋아요 누름), R004(자신의 답변 좋아요) 등

    // 그 외 에러는 Promise.reject로 전달하여 각 컴포넌트에서 처리할 수 있도록 함
    return Promise.reject(error);
  }
);

// FCM 토큰 등록
export const registerFCMToken = async (token) => {
  try {
    const response = await api.post("/fcm/token ", {
      token: token,
    });
    return response.data;
  } catch (error) {
    console.error("FCM 토큰 등록 실패:", error);
    throw error;
  }
};

// FCM 토큰 삭제
export const unregisterFCMToken = async (token) => {
  try {
    const response = await api.delete("/fcm/token", {
      token: token,
    });
    return response.data;
  } catch (error) {
    console.error("FCM 토큰 삭제 실패:", error);
    throw error;
  }
};

export default api;
