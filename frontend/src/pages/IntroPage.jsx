import React from "react";
import { useNavigate } from "react-router-dom";
import IntroImage from "../assets/images/introImage.jpg";
import cityImage from "../assets/images/cityimage.jpg";
import SocialLoginButton from "../components/ui/SocialLoginButton";
import { useGoogleLogin } from "@react-oauth/google";

const Intro = () => {
  const navigate = useNavigate();

  const handleSocialLogin = (provider) => {
    if (provider === 'kakao') {
      const KAKAO_REST_API_KEY = import.meta.env.VITE_KAKAO_REST_API_KEY; // VITE_ 접두사 사용
      const REDIRECT_URI = `${import.meta.env.VITE_API_BASE_URL}/auth`; // KakaoCallback 컴포넌트의 경로

      const kakaoURL = `https://kauth.kakao.com/oauth/authorize?client_id=${KAKAO_REST_API_KEY}&redirect_uri=${REDIRECT_URI}&response_type=code`;

      window.location.href = kakaoURL;
    } else if (provider === "google") {
      const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
      const REDIRECT_URI = `${import.meta.env.VITE_API_BASE_URL}/auth/google`;

      const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=openid%20profile%20email`;

      window.location.href = googleAuthUrl;
    }
  };


  return (
    <div className="flex flex-row min-h-screen h-screen w-full">
      {/* Left section - hidden on mobile */}
      <div className="hidden md:block md:w-1/2 relative">
        <img
          src={cityImage}
          alt="Tech city skyline"
          className="w-full h-full object-cover"
          style={{ filter: "brightness(0.8) saturate(1.2)" }}
        />
      </div>

      {/* Right section - full width on mobile, 33% on desktop */}
      {/* Right section */}
      <div className="w-full md:w-1/2 bg-white flex items-center justify-center text-black p-8">
        <div className="w-[60%] md:w-[50%] flex flex-col items-center justify-center">
          <div className="w-full text-center space-y-6">
            <div className="space-y-2 flex flex-col items-center">
              <h1 className="text-5xl md:text-4xl font-bold flex justify-center">
                <span className="text-primary-500">Tech</span>
                <span className="text-black">Mate</span>
              </h1>
              <div className="w-12 md:w-36 h-1 bg-primary-500 mx-auto rounded-full"></div>
            </div>
            <div className="space-y-1 flex flex-col items-center w-full">
              <div className="w-full">
                <p className="text-base md:text-h5 text-black font-medium text-left">
                  반갑습니다.
                </p>
                <p className="text-body-sm md:text-h5 text-black text-left">
                  당신의 기술메이트 테크메이트
                </p>
              </div>
            </div>
          </div>

          <div className="w-full space-y-4 mt-12">

            <button
              onClick={() => {
                localStorage.setItem("accessToken", "mock-access-token-techmate");
                navigate("/home");
              }}
              className="w-full py-3 px-6 bg-primary-500 text-white rounded-lg font-semibold text-base hover:bg-primary-600 transition-colors"
            >
              데모로 시작하기
            </button>

            <SocialLoginButton
              provider="kakao"
              onClick={() => handleSocialLogin("kakao")}
            />

            <SocialLoginButton
              provider="google"
              onClick={() => handleSocialLogin("google")}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Intro;
