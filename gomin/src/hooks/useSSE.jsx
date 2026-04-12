import { useEffect, useRef, useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import { updateHasUnread } from "../store/slices/notificationSlice";
import { updateLikesReceived } from "../store/slices/memberSlice";
import { EventSource } from "eventsource";

export const useSSE = (initialDelay = 3000) => {
  const dispatch = useDispatch();
  const [isConnected, setIsConnected] = useState(false); // 홈화면 표기용
  const eventSourceRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);
  const connectionTimeoutRef = useRef(null);
  const initialDelayTimeoutRef = useRef(null);
  const retryCountRef = useRef(0); // 재연결 시도 횟수를 추적할 ref 추가
  const MAX_RETRIES = 10; // 최대 재시도 횟수 설정

  const cleanup = () => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    if (connectionTimeoutRef.current) {
      clearTimeout(connectionTimeoutRef.current);
    }
    reconnectTimeoutRef.current = null;
    connectionTimeoutRef.current = null;
  };

  const connectSSE = useCallback(async () => {
    if (eventSourceRef.current && eventSourceRef.current.readyState === 1) {
      return;
    }

    cleanup();

    if (retryCountRef.current >= MAX_RETRIES) {
      setIsConnected(false);
      return;
    }

    const token = localStorage.getItem("accessToken");

    if (!token) {
      setIsConnected(false);
      return;
    }

    eventSourceRef.current = new EventSource(
      `${import.meta.env.VITE_API_BASE_URL}/api/sse/subscribe`,
      {
        fetch: (input, init) =>
          fetch(input, {
            ...init,
            headers: {
              Authorization: `Bearer ${token}`,
              "Cache-Control": "no-cache",
            },
            credentials: "include",
          }),
      }
    );

    connectionTimeoutRef.current = setTimeout(() => {
      if (!eventSourceRef.current || eventSourceRef.current.readyState !== 1) {
        setIsConnected(false);
        retryCountRef.current += 1;

        if (retryCountRef.current >= MAX_RETRIES) {
          return;
        }

        cleanup();

        if (!reconnectTimeoutRef.current) {
          connectSSE();
        }
      }
    }, 5000);

    eventSourceRef.current.addEventListener("notification", (event) => {
      const data = JSON.parse(event.data);
      dispatch(updateHasUnread(data.hasUnread));
    });

    eventSourceRef.current.addEventListener("likeCount", (event) => {
      const data = JSON.parse(event.data);
      dispatch(updateLikesReceived(data.totalLikes));
    });

    eventSourceRef.current.addEventListener("shutdown", (event) => {
      setIsConnected(false);
      cleanup();

      const checkServerAndReconnect = async () => {
        try {
          const response = await fetch(
            `${import.meta.env.VITE_API_BASE_URL}/api/health`
          );
          const health = await response.json();

          if (health.status === "UP") {
            window.location.reload();
          } else {
            setTimeout(checkServerAndReconnect, 1000);
          }
        } catch (error) {
          setTimeout(checkServerAndReconnect, 1000);
        }
      };

      setTimeout(checkServerAndReconnect, 5000);
    });

    eventSourceRef.current.onopen = () => {
      setIsConnected(true);
      retryCountRef.current = 0;
    };

    eventSourceRef.current.onerror = (error) => {
      setIsConnected(false);
      retryCountRef.current += 1;

      cleanup();

      if (!reconnectTimeoutRef.current && retryCountRef.current < MAX_RETRIES) {
        reconnectTimeoutRef.current = setTimeout(() => {
          connectSSE();
          reconnectTimeoutRef.current = null;
        }, 3000);
      }
    };
  }, [dispatch]);

  useEffect(() => {
    initialDelayTimeoutRef.current = setTimeout(() => {
      connectSSE().catch(console.error);
    }, initialDelay);

    return () => {
      retryCountRef.current = 0;
      setIsConnected(false);
      cleanup();
      if (initialDelayTimeoutRef.current) {
        clearTimeout(initialDelayTimeoutRef.current);
      }
    };
  }, [connectSSE, initialDelay]);

  return isConnected;
};
