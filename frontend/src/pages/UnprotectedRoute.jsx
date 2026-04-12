import React from "react";
import { Navigate } from "react-router-dom";

function UnprotectedRoute({ children }) {
  const accessToken = localStorage.getItem("accessToken");

  // 엑세스 토큰이 있으면 "/home"으로 리디렉션
  if (accessToken) {
    return <Navigate to="/home" replace />;
  }

  // 엑세스 토큰이 없으면 자식 컴포넌트 렌더링
  return children;
}

export default UnprotectedRoute;