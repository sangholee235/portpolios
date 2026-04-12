import { useState, useEffect, useCallback } from "react";
import { getToken, onMessage } from "firebase/messaging";
import { messaging } from "../firebase-config";
import { registerFCMToken, unregisterFCMToken } from "../api/axios";

const VAPID_KEY = import.meta.env.VITE_FIREBASE_VAPID_KEY;

export const useNotification = () => {
  const [token, setToken] = useState("");
  const [notification, setNotification] = useState(null);
  const [error, setError] = useState(null);

  // 로그아웃 시 호출할 수 있는 함수로 분리
  const unregisterToken = useCallback(async () => {
    if (token) {
      try {
        await unregisterFCMToken(token);
        setToken("");
      } catch (error) {
        console.error("토큰 삭제 실패:", error);
      }
    }
  }, [token]);

  const getFCMToken = useCallback(async (registration) => {
    try {
      const fcmToken = await getToken(messaging, {
        vapidKey: VAPID_KEY,
        serviceWorkerRegistration: registration,
      });

      if (fcmToken) {
        await registerFCMToken(fcmToken);
        setToken(fcmToken);
        return fcmToken;
      }

      throw new Error("Failed to get FCM token");
    } catch (error) {
      setError(error.message);
      console.error("FCM 토큰 발급 실패:", error);
      return null;
    }
  }, []);

  const requestPermission = useCallback(async () => {
    try {
      // 이미 알림 권한이 허용된 경우
      if (Notification.permission === "granted") {
        const registration = await navigator.serviceWorker.getRegistration();

        if (!registration) {
          throw new Error("서비스 워커가 등록되지 않았습니다.");
        }
        await getFCMToken(registration);
        return "granted"; // 권한 상태를 반환
      }

      const permission = await Notification.requestPermission();

      // 알림 권한 허용 받으면
      if (permission === "granted") {
        const registration = await navigator.serviceWorker.getRegistration();
        if (!registration) {
          throw new Error("서비스 워커가 등록되지 않았습니다.");
        }
        await getFCMToken(registration);
        return "granted"; // 권한 상태를 반환
      }

      return permission; //"denied" or "default"
    } catch (error) {
      setError(error.message);
      console.error("알림 권한 요청 실패:", error);
      return "error";
    }
  }, [getFCMToken]);

  const showNotification = useCallback(
    ({ title, body, icon = "/pushlogo.png" }) => {
      if (Notification.permission === "granted") {
        new Notification(title, { body, icon });
      }
    },
    []
  );

  useEffect(() => {
    // const initializeNotifications = async () => {
    if (!("Notification" in window)) {
      setError("이 브라우저는 알림을 지원하지 않습니다.");
      return;
    }

    //   if (Notification.permission === "default") {
    //     await requestPermission();
    //   } else if (Notification.permission === "granted") {
    //     const registration = await navigator.serviceWorker.getRegistration();
    //     if (registration) {
    //       await getFCMToken(registration);
    //     }
    //   }
    // };

    // initializeNotifications();

    // messaging이 null이면 (개발 환경 등) 구독 건너뜀
    if (!messaging) return;

    const unsubscribe = onMessage(messaging, (payload) => {
      // 포그라운드에서 알림을 표시하려면 아래 주석을 해제
      if (payload.data) {
        showNotification({
          title: payload.data.title,
          body: payload.data.body,
          icon: "/pushlogo.png",
        });
      }

      // 여기에 인앱 알림 구현도 가능

      setNotification(payload);
    });

    return () => unsubscribe();
  }, []);

  return {
    token,
    notification,
    error,
    requestPermission,
    showNotification,
    unregisterToken,
  };
};
