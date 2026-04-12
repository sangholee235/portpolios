import "./App.css";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/common/Header";
import Intro from "./pages/IntroPage";
import ArticlePage from "./pages/ArticlePage";
import HomePage from "./pages/HomePage";
import Mypage from "./pages/MyPage";
import UserProfilePage from "./pages/UserProfilePage";
import OpenPage from "./pages/OpenPage";
import KakaoCallback from "./pages/KakaoCallback";
import GoogleCallback from "./pages/GoogleCallback";
import ProtectedRoute from "./pages/ProtectedRoute";
import UnprotectedRoute from "./pages/UnprotectedRoute";

function App() {
  return (
    <Router basename={import.meta.env.BASE_URL}>
      <div>
          <Routes>
            {/* 엑세스 토큰이 없을 때만 접근 가능한 경로 */}
            <Route
              path="/"
              element={<OpenPage />}
            />
            <Route 
              path="/open" 
              element={
                <UnprotectedRoute>
                  <Intro />
                </UnprotectedRoute>
              } 
            />
            <Route 
              path="/userprofile" 
              element={
                <UnprotectedRoute>
                  <UserProfilePage />
                </UnprotectedRoute>
              } 
            />

            {/* 인증 콜백 라우트 */}
            <Route path="/auth" element={<KakaoCallback />} />
            <Route path="/auth/google" element={<GoogleCallback />} />

            {/* 엑세스 토큰이 필요할 때만 접근 가능한 경로 */}
            <Route
              path="/home"
              element={
                <ProtectedRoute>
                  <>
                    <Header />
                    <HomePage />
                  </>
                </ProtectedRoute>
              }
            />
            <Route
              path="/article/:id"
              element={
                <ProtectedRoute>
                  <>
                  <Header />
                  <ArticlePage />
                  </>
                </ProtectedRoute>
              }
            />
            <Route
              path="/mypage"
              element={
                <ProtectedRoute>
                  <>
                  <Header />
                  <Mypage />
                  </>
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
      </div>
    </Router>
  );
}

export default App;
