import React, { useState, useEffect } from "react";
import KakaoLoginButton from "../components/KakaoLoginButton";
import GoogleLoginButton from "../components/GoogleLoginButton";
import introImage from "../assets/introf.webp";
import BgmContext from "../context/BgmProvider";

// 쿠키 설정 함수
const setCookie = (name, value, days) => {
  let expires = "";
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + value + expires + "; path=/";
};

// 쿠키 가져오기 함수
const getCookie = (name) => {
  const nameEQ = name + "=";
  const ca = document.cookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === " ") c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
};

// iOS 체크 함수
const isIOS = () => {
  return (
    [
      "iPad Simulator",
      "iPhone Simulator",
      "iPod Simulator",
      "iPad",
      "iPhone",
      "iPod",
    ].includes(navigator.platform) ||
    // iPad on iOS 13 detection
    (navigator.userAgent.includes("Mac") && "ontouchend" in document)
  );
};

const Intro = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstallButtonVisible, setInstallButtonVisible] = useState(false);
  const [isIOSDevice, setIsIOSDevice] = useState(false);
  const [isAppInstalled, setIsAppInstalled] = useState(false);

  useEffect(() => {
    // iOS 디바이스 체크
    setIsIOSDevice(isIOS());

    // 앱이 이미 설치되었는지 확인
    const checkIfAppIsInstalled = () => {
      const isStandalone = window.matchMedia(
        "(display-mode: standalone)"
      ).matches;
      const isFullscreen = window.matchMedia(
        "(display-mode: fullscreen)"
      ).matches;
      return isStandalone || isFullscreen;
    };

    setIsAppInstalled(checkIfAppIsInstalled());

    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // 앱이 설치되지 않은 경우에만 버튼 표시
      if (!checkIfAppIsInstalled()) {
        setInstallButtonVisible(true);
      }
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // display-mode가 변경되는 것을 감지
    const mediaQueryList = window.matchMedia("(display-mode: standalone)");
    const handleChange = (e) => {
      setIsAppInstalled(e.matches);
      if (e.matches) {
        setInstallButtonVisible(false);
      }
    };

    if (mediaQueryList.addEventListener) {
      mediaQueryList.addEventListener("change", handleChange);
    } else if (mediaQueryList.addListener) {
      // 구형 브라우저 대응
      mediaQueryList.addListener(handleChange);
    }

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );

      if (mediaQueryList.removeEventListener) {
        mediaQueryList.removeEventListener("change", handleChange);
      } else if (mediaQueryList.removeListener) {
        mediaQueryList.removeListener(handleChange);
      }
    };
  }, []);

  const handleInstallClick = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();

      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === "accepted") {
          setIsAppInstalled(true);
          setInstallButtonVisible(false);
        } else {
        }
        setDeferredPrompt(null);
      });
    } else {
      alert("이 브라우저에서는 앱 설치를 지원하지 않거나 이미 설치되었습니다.");
    }
  };

  return (
    <div style={styles.backgroundContainer}>
      <div
        style={{
          ...styles.backgroundLayer,
          backgroundImage: `url("${introImage}")`,
          zIndex: 1,
          transform: "translateX(0) translateY(3%)",
        }}
      ></div>

      {/* iOS가 아니고, 앱이 설치되지 않았을 때만 설치 버튼 표시 */}
      {!isIOSDevice && !isAppInstalled && isInstallButtonVisible && (
        <div
          id="install-button"
          style={styles.installButtonContainer}
          onClick={handleInstallClick}
        >
          <span style={{ ...styles.installButton }}>앱</span>
          <span style={{ ...styles.installButton }}>설</span>
          <span style={{ ...styles.installButton }}>치</span>
          <span style={{ ...styles.installButton }}>♤</span>
        </div>
      )}

      <div style={styles.buttoncontainer}>
        <h2
          style={{
            marginBottom: "calc( 1 * var(--custom-vh))",
            fontSize: "calc( 4.5 * var(--custom-vh))",
          }}
        >
          로그인
        </h2>
        <KakaoLoginButton />
        <GoogleLoginButton />
      </div>
    </div>
  );
};

const styles = {
  backgroundContainer: {
    position: "relative",
    height: "calc( 100 * var(--custom-vh))",
    width: "100%",
    overflow: "hidden",
  },
  backgroundLayer: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "calc( 105 * var(--custom-vh))",
    scale: "1.1",
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
  },
  buttoncontainer: {
    position: "absolute",
    height: "calc( 6 * var(--custom-vh))",
    zIndex: 2,
    color: "#fff",
    right: "calc( 12 * var(--custom-vh))",
    bottom: "calc( 35 * var(--custom-vh))",
  },
  installButtonContainer: {
    position: "absolute",
    zIndex: 2,
    color: "#fff",
    display: "flex",
    right: "calc( 1.5 * var(--custom-vh))",
    top: "calc( 1.5 * var(--custom-vh))",
  },
  installButton: {
    height: "calc( 3 * var(--custom-vh))",
    width: "calc( 3 * var(--custom-vh))",
    border: "none",
    borderRadius: "calc( 3 * var(--custom-vh))",
    color: "#2e4485",
    fontFamily: "inherit",
    fontWeight: "bold",
    fontSize: "calc( 2.2 * var(--custom-vh))",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    cursor: "pointer",
    zIndex: "2",
    backgroundColor: "#f0f0f0",
  },
};

export default Intro;
