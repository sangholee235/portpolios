import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import axios from "axios";
import Home from "../../pages/Home";

const ShareRoute = () => {
  const [isValidating, setIsValidating] = useState(true);
  const [isValid, setIsValid] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const validateToken = async () => {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        setIsValidating(false);
        return;
      }

      try {
        // 토큰을 PathVariable로 전달
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/user/validate/${token}` // header 담지 않기 위해 직접 사용!
        );
        console.log("Token validation response:", response.data);
        setIsValid(response.data.data); // ApiResponse 형식 고려
      } catch (error) {
        console.error("Token validation error:", error);
        setIsValid(false);
      } finally {
        setIsValidating(false);
      }
    };

    validateToken();
  }, []);

  if (isValidating) {
    return <div>Loading...</div>; // 또는 적절한 로딩 컴포넌트
  }

  return isValid ? (
    <Home />
  ) : (
    <Navigate to={`/?redirectUrl=${encodeURIComponent(location.pathname)}`} />
  );
};

export default ShareRoute;
