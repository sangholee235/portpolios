import React from "react";
import { useDispatch } from "react-redux";
import { kakaoLogin } from "../store/slices/authSlice";

const KakaoLoginButton = () => {
  const dispatch = useDispatch();

  const handleKakaoLogin = () => {
    const clientId = import.meta.env.VITE_KAKAO_CLIENT_ID;
    const redirectUri = "https://www.gomin.my/oauth/kakao/callback"; // 리다이렉트 URI

    // URL에서 redirectUrl 파라미터 가져오기
    const searchParams = new URLSearchParams(window.location.search);
    const redirectUrl = searchParams.get("redirectUrl");

    // state 파라미터에 redirectUrl 포함
    const state = redirectUrl || "";

    const kakaoAuthUrl = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&state=${state}`;
    window.location.href = kakaoAuthUrl;
  };

  return (
    <button
      onClick={handleKakaoLogin}
      style={{
        position: "absolute",
        left: "calc(50% - calc( 5 * var(--custom-vh)))",
        background: "#FEE500",
        height: "calc( 7 * var(--custom-vh))",
        width: "calc( 7 * var(--custom-vh))",
        border: "none",
        borderRadius: "50%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        cursor: "pointer",
        zIndex: "2",
      }}
    >
      <svg
        width="60%" // 이거 조절 해서 말풍선 크기 조절
        height="60%" // 이거 조절 해서 말풍선 크기 조절
        viewBox="0 0 24 24"
        fill="#000000"
        style={{
          minWidth: "24px",
          minHeight: "24px",
        }}
      >
        <path d="M12 3C6.5 3 2 6.5 2 11c0 2.9 1.9 5.4 4.7 6.9-.2.6-.7 2.3-.8 2.7 0 0 0 .2.1.2s.2.1.3 0c.4-.3 4.1-2.8 4.7-3.2.3 0 .7.1 1 .1 5.5 0 10-3.5 10-8C22 6.5 17.5 3 12 3z" />
      </svg>
    </button>
  );
};

export default KakaoLoginButton;
