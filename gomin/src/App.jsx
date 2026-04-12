import React, { useEffect, useState } from "react";
import {
  Routes,
  Route,
  useLocation,
  useNavigate,
  Navigate,
} from "react-router-dom";
import { BgmProvider } from "./context/BgmProvider";
import Home from "./pages/Home";
import Intro from "./pages/Intro";
import MyAnswerList from "./pages/MyAnswerList";
import SushiDetail from "./pages/SushiDetail";
import SushiAnswerDetail from "./pages/SushiAnswerDetail";
import MySushiList from "./pages/MySushiList";
import SushiView from "./pages/SushiView";
import PostSushi from "./pages/PostSushi";
import Navbar from "./components/NavBar";
import OAuthCallback from "./components/OAuthCallback";
import ErrorPage from "./pages/ErrorPage";
import ProtectedRoute from "./components/ProtectedRoute";
import MuteButton from "./components/MuteButton";
import ShareRoute from "./components/share/ShareRoute";

function App() {
  const location = useLocation();
  const navigate = useNavigate();

  // Navbar 표시 여부 결정
  const shouldShowNavbar = location.pathname !== "/";

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");

    // 토큰이 있으면 인트로 페이지에서 홈으로 자동 이동 (포트폴리오 데모용)
    if (accessToken && location.pathname === "/") {
      navigate("/home", { replace: true });
      return;
    }

    if (
      !accessToken &&
      location.pathname !== "/" &&
      !location.pathname.startsWith("/share/") &&
      !location.pathname.startsWith("/oauth/")
    ) {
      navigate("/", { replace: true });
    }
  }, [location.pathname, navigate]);

  // App.jsx나 적절한 상위 컴포넌트에 추가
  useEffect(() => {
    const updateCustomVh = () => {
      const container = document.querySelector(".container");
      if (container) {
        const containerHeight = container.offsetHeight;
        const customVh = containerHeight / 100;
        document.documentElement.style.setProperty(
          "--custom-vh",
          `${customVh}px`
        );
      }
    };

    updateCustomVh();
    window.addEventListener("resize", updateCustomVh);

    return () => window.removeEventListener("resize", updateCustomVh);
  }, []);

  return (
    <BgmProvider>
      <MuteButton />
      <div className="container vh-container">
        <div className="container">
          {shouldShowNavbar && <Navbar />}
          <Routes>
            <Route path="/" element={<Intro />} />

            {/* <Route path="/home" element={<Home />} /> */}
            <Route
              path="/home"
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              }
            />

            <Route path="/mysushilist" element={<MySushiList />} />
            <Route path="/myanswerlist" element={<MyAnswerList />} />
            <Route path="/sushidetail/:sushiId" element={<SushiDetail />} />
            <Route path="/sushiview" element={<SushiView />} />
            <Route path="/postsushi" element={<PostSushi />} />
            <Route
              path="/sushianswerdetail/:sushiId"
              element={<SushiAnswerDetail />}
            />
            <Route path="/oauth/kakao/callback" element={<OAuthCallback />} />
            <Route path="/oauth/google/callback" element={<OAuthCallback />} />
            <Route path="/share/:token" element={<ShareRoute />} />
            <Route path="*" element={<ErrorPage />} />
          </Routes>
        </div>
      </div>
    </BgmProvider>
  );
}

export default App;
