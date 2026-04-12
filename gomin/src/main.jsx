import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import App from "./App.jsx";
import { store } from "./store/index.jsx";
import "./styles/global.css";
import "./index.css";

// Kakao SDK 초기화 (키가 없을 경우 무시)
try {
  if (window.Kakao && import.meta.env.VITE_KAKAO_JAVASCRIPT_ID) {
    window.Kakao.init(import.meta.env.VITE_KAKAO_JAVASCRIPT_ID);
  }
} catch (e) {
  console.warn("Kakao SDK init skipped:", e.message);
}

// 우클릭 방지
document.addEventListener("contextmenu", (e) => e.preventDefault());

async function bootstrap() {
  if (!localStorage.getItem("accessToken")) {
    localStorage.setItem("accessToken", "mock-access-token-portfolio");
    localStorage.setItem("userNickname", "고민 초밥러");
  }

  const { worker } = await import("./mocks/browser.js");
  await worker.start({
    onUnhandledRequest: "bypass",
    serviceWorker: { url: `${import.meta.env.BASE_URL}mockServiceWorker.js` },
  });

  createRoot(document.getElementById("root")).render(
    <StrictMode>
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <Provider store={store}>
          <App />
        </Provider>
      </BrowserRouter>
    </StrictMode>
  );
}

bootstrap();
