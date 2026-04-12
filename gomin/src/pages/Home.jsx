import React, { useState, useEffect, useRef, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUnreadExists } from "../store/slices/notificationSlice";
import { countLike } from "../store/slices/memberSlice";
import {
  fetchSushiByToken,
  fetchSushiDetail,
} from "../store/slices/sushiSlice";
import { useLocation } from "react-router-dom";
import Rail from "../components/Rail";
import PostSushiBell from "../components/PostSushiBell";
import NotificationBell from "../components/NotificationBell";
import NotificationModal from "../components/NotificationModal";
import SushiUnlock from "../components/SushiUnlock";
import PostSushi from "./PostSushi";
import SushiUnlockBar from "../components/SushiUnlockBar";
import BgmContext from "../context/BgmProvider";
import CommonAlertModal from "../components/CommonAlertModal";
import PushAgreeModal from "../components/webpush/PushAgreeModal";
import { useSpring, animated } from "@react-spring/web";
import bgImg from "../assets/home/back.webp";
import deskImg from "../assets/home/rail.webp";
import masterImg from "../assets/home/master.webp";
import SushiView from "./SushiView";
import plate from "../assets/sounds/plate.mp3";
import Tutorial from "../components/Tutorial";
import { useSSE } from "../hooks/useSSE";
import SSEIndicator from "../components/SSEIndicator";
import AnswerSubmitCheckModal from "../components/AnswerSubmitCheckModal";
import MasterCat from "../components/MasterCat";

const Home = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const [showLoadingScreen, setShowLoadingScreen] = useState(true);
  const [hasRefreshed, setHasRefreshed] = useState(false);
  const [token, setToken] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isSushiUnlockOpen, setIsSushiUnlockOpen] = useState(false);
  const [isPostSushiOpen, setIsPostSushiOpen] = useState(false);
  const [isSushiViewOpen, setIsSushiViewOpen] = useState(false);
  const [selectedSushiData, setSelectedSushiData] = useState(null);
  const [startTutorial, setStartTutorial] = useState(false);
  const [submitResult, setSubmitResult] = useState(null); // 제출 결과 상태 추가
  const [showPushAgreeModal, setShowPushAgreeModal] = useState(false);
  const audioRef = useRef(null);
  const { isMuted } = useContext(BgmContext);

  const hasUnread = useSelector(
    (state) => state.notification.hasUnread ?? false
  );
  const [imagesLoaded, setImagesLoaded] = useState({
    bg: false,
    desk: false,
    master: false,
  });

  const handleSushiClick = async (sushiData) => {
    try {
      await dispatch(fetchSushiDetail(sushiData.sushiId)).unwrap();
      setSelectedSushiData(sushiData);
      setIsSushiViewOpen(true);
    } catch (error) {
      if (error.error?.code === "R006") {
        showAlert("이미 답변한 초밥이다냥!");
      }
    }
  };

  const handlePostSushiComplete = () => {
    if (Notification.permission === "default") {
      setShowPushAgreeModal(true);
    }
  };

  const handleSubmitResult = (result) => {
    setSubmitResult(result);
    if (
      result.status === "success" &&
      !result.isWebView &&
      Notification.permission === "default"
    ) {
      setShowPushAgreeModal(true);
    }
  };

  const showAlert = (message) => {
    setSubmitResult({ status: "error", message });
  };

  useEffect(() => {
    if (isSushiViewOpen && selectedSushiData?.isClosed) {
      showAlert("이미 마감된 초밥이에요!");
      setIsSushiViewOpen(false);
    }
  }, [isSushiViewOpen, selectedSushiData]);

  useEffect(() => {
    const pathParts = location.pathname.split("/");
    if (pathParts[1] === "share" && pathParts.length > 2) {
      setToken(pathParts[2]);
    }
  }, [location]);

  useEffect(() => {
    if (token) {
      dispatch(fetchSushiByToken(token))
        .unwrap()
        .then((response) => {
          if (response.data) {
            setSelectedSushiData(response.data);
            setTimeout(() => setIsSushiViewOpen(true), 2000);
          }
        })
        .catch((error) => {
          if (error.error?.code === "R006")
            showAlert("이미 답변한 초밥이다냥!");
        });
    }
  }, [token, dispatch]);

  useEffect(() => {
    dispatch(fetchUnreadExists());
    dispatch(countLike());
  }, [dispatch]);

  const handleImageLoad = (image) => {
    setImagesLoaded((prev) => ({ ...prev, [image]: true }));
  };

  useEffect(() => {
    const bgImage = new Image();
    bgImage.src = bgImg;
    bgImage.onload = () => handleImageLoad("bg");
    const masterImage = new Image();
    masterImage.src = masterImg;
    masterImage.onload = () => handleImageLoad("master");
    const deskImage = new Image();
    deskImage.src = deskImg;
    deskImage.onload = () => handleImageLoad("desk");
  }, []);

  const allImagesLoaded = Object.values(imagesLoaded).every((loaded) => loaded);

  useEffect(() => {
    const hasVisited = sessionStorage.getItem("hasVisitedHome");
    if (!hasVisited && !hasRefreshed) {
      sessionStorage.setItem("hasVisitedHome", "true");
      setTimeout(() => setHasRefreshed(true), 100);
    } else {
      const timer = setTimeout(() => setShowLoadingScreen(false), 500);
      return () => clearTimeout(timer);
    }
  }, [hasRefreshed]);

  useEffect(() => {
    if (isSushiViewOpen && audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : 0.5;
      audioRef.current.play();
    }
  }, [isSushiViewOpen, isMuted]);

  const bgSpring = useSpring({
    opacity: allImagesLoaded ? 1 : 0,
    transform: allImagesLoaded ? "translateY(7%)" : "translateY(-50%)",
    config: { tension: 170, friction: 26 },
    delay: 1000,
  });
  const masterSpring = useSpring({
    opacity: allImagesLoaded ? 1 : 0,
    transform: allImagesLoaded ? "scale(1.2)" : "scale(0.8)",
    config: { tension: 170, friction: 26 },
    delay: 1500,
  });
  const deskSpring = useSpring({
    opacity: allImagesLoaded ? 1 : 0,
    transform: allImagesLoaded ? "translateX(0)" : "translateX(-50%)",
    config: { tension: 170, friction: 26 },
    delay: 300,
  });
  const bellSpring = useSpring({
    opacity: allImagesLoaded ? 1 : 0,
    transform: allImagesLoaded ? "translateY(0)" : "translateY(-50%)",
    config: { tension: 300, friction: 10 },
    delay: 1700,
  });

  const isSSEConnected = useSSE();

  return (
    <>
      {/* 배경 이미지 */}
      <div style={styles.backgroundContainer}>
        <animated.div
          style={{
            ...styles.backgroundLayer,
            zIndex: 2,
            position: "absolute",
            backgroundImage: `url("${bgImg}")`,
            opacity: bgSpring.opacity,
            transform: bgSpring.transform,
          }}
        >
          {/* SSE 연결 상태 표시 */}
          <SSEIndicator isConnected={isSSEConnected} />
        </animated.div>
        {/* 고양이마스터 */}
        <animated.div
          style={{
            ...styles.backgroundLayer,
            backgroundImage: `url("${bgImg}")`,
            zIndex: 1,
            opacity: bgSpring.opacity,
            transform: bgSpring.transform,
          }}
          onLoad={() => handleImageLoad("bg")}
        ></animated.div>
        <animated.div
          style={{
            ...styles.backgroundLayer,
            backgroundImage: `url("${masterImg}")`,
            zIndex: 2,
            opacity: masterSpring.opacity,
            transform: masterSpring.transform,
          }}
          onLoad={() => handleImageLoad("master")}
        ></animated.div>
        <MasterCat />
        <animated.div
          style={{
            ...styles.backgroundLayer,
            zIndex: 2,
            opacity: bellSpring.opacity,
            transform: bellSpring.transform,
          }}
        >
          {/* 알림 : 새로운 알림이 있을 때, 없을 떄 */}
          <NotificationBell
            onClick={() => setIsNotificationOpen(true)}
            hasUnread={hasUnread}
          />
        </animated.div>
        {/* 튜토리얼 버튼 */}
        <div style={styles.buttonContainer}>
          <button style={styles.button} onClick={() => setStartTutorial(true)}>
            ?
          </button>
        </div>
        {startTutorial && (
          <Tutorial
            onClose={() => setStartTutorial(false)}
            showFullTutorial={false}
          />
        )}
        {/* 책상과 그 위의 요소들 */}
        <animated.div
          style={{
            ...styles.deskContainer,
            opacity: deskSpring.opacity,
            transform: deskSpring.transform,
          }}
        >
          {/* 책상 */}
          <img
            src={deskImg}
            alt="Desk"
            style={styles.deskImage}
            onLoad={() => handleImageLoad("desk")}
          />
          {/* Rail */}
          <div style={styles.rail}>
            <Rail onSushiClick={handleSushiClick} />
          </div>
          {/* 주문벨 */}
          <div style={styles.bell}>
            <PostSushiBell onClick={() => setIsPostSushiOpen(true)} />
          </div>
          <div style={styles.unlock}>
            <SushiUnlockBar onClick={() => setIsSushiUnlockOpen(true)} />
          </div>
        </animated.div>
        <div style={{ position: "absolute", zIndex: "10" }}>
          <audio ref={audioRef} src={plate} />
          {selectedSushiData &&
            isSushiViewOpen &&
            !selectedSushiData.isClosed && (
              <SushiView
                isOpen={isSushiViewOpen}
                onClose={() => setIsSushiViewOpen(false)}
                onSubmitResult={handleSubmitResult}
                sushiId={selectedSushiData.sushiId}
                category={selectedSushiData.category}
              />
            )}
          <AnswerSubmitCheckModal
            isOpen={
              submitResult?.status === "success" ||
              submitResult?.status === "R005"
            }
            onClose={() => setSubmitResult(null)}
            isOwnSushi={submitResult?.status === "R005"}
          />
          <CommonAlertModal
            isOpen={submitResult?.status === "error"}
            onClose={() => setSubmitResult(null)}
            message={submitResult?.message || "답변 제출에 실패했습니다."}
          />
          <SushiUnlock
            isOpen={isSushiUnlockOpen}
            onClose={() => setIsSushiUnlockOpen(false)}
          />
          {isPostSushiOpen && (
            <PostSushi
              onClose={() => setIsPostSushiOpen(false)}
              onComplete={handlePostSushiComplete}
            />
          )}
          <NotificationModal
            isOpen={isNotificationOpen}
            onClose={() => setIsNotificationOpen(false)}
          />
          {showPushAgreeModal && (
            <PushAgreeModal
              isOpen={showPushAgreeModal}
              onClose={() => setShowPushAgreeModal(false)}
            />
          )}
        </div>
      </div>
    </>
  );
};

// styles는 그대로 유지
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
    height: "100%",
    scale: "1.1",
    backgroundSize: "contain",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
  },

  deskContainer: {
    position: "absolute",
    bottom: 0,
    left: "-35%",
    transform: "translateX(-50%)",
    width: "auto%",
    height: "calc(28 * var(--custom-vh))", // 책상의 높이 설정
    zIndex: 3,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-end", // 책상이 컨테이너 하단에 붙도록
  },
  deskImage: {
    width: "auto",
    height: "100%",
    objectFit: "contain",
  },
  rail: {
    position: "absolute",
    bottom: "56%",
    left: "50%",
    width: "100%",
    transform: "translateX(-50%)",
    zIndex: 4,
  },
  bell: {
    position: "absolute",
    right: "23%",
    bottom: "25%",
    zIndex: 5,
  },
  unlock: {
    position: "absolute",
    left: "24%",
    bottom: "22%",
    zIndex: 5,
  },
  buttonContainer: {
    position: "absolute",
    left: "calc( 49.5 * var(--custom-vh))",
    top: "calc( 51.1 * var(--custom-vh))",
    zIndex: 5,
  },
  button: {
    padding: "calc( 0.2 * var(--custom-vh))",
    border: "calc( 0.6 * var(--custom-vh)) solid",
    borderRadius: "calc( 5 * var(--custom-vh))",
    backgroundColor: "#ada782",
    color: "#dfdbaf",
    fontSize: "calc( 2.5 * var(--custom-vh))",
    fontWeight: "bold",
    cursor: "pointer",
    width: "calc( 4 * var(--custom-vh))",
    height: "calc( 4 * var(--custom-vh))",
    whiteSpace: "nowrap",
    lineHeight: "1",
    fontFamily: "inherit",
  },
  speedControls: {
    position: "absolute",
    left: "50%",
    bottom: "22%",
    display: "flex",
    gap: "10px",
    zIndex: 5,
  },
  speedButton: {
    padding: "8px 16px",
    fontSize: "18px",
    backgroundColor: "#ada782",
    color: "#dfdbaf",
    border: "2px solid #dfdbaf",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "all 0.2s",
    "&:hover": {
      backgroundColor: "#8f8a6d",
    },
  },
};

export default Home;
