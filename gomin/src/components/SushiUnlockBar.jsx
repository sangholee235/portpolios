import React, { useEffect, useState, useRef } from "react";
import { useSpring, animated } from "@react-spring/web";
import unlockssImg from "../assets/home/open.webp";
import Sushi from "./Sushi";
import { useSelector, useDispatch } from "react-redux";
import { countLike } from "../store/slices/memberSlice";

const SushiUnlockBar = ({ onClick }) => {
  const dispatch = useDispatch();
  const likesReceived = useSelector((state) => state.member.likesReceived);
  const prevLikesRef = useRef(likesReceived); // 이전 likesReceived 저장

  useEffect(() => {
    dispatch(countLike());
  }, [dispatch]);

  const LIKE_THRESHOLDS = [0, 1, 2, 3, 6, 10, 15, 20, 30, 50, 80, 100];

  const unlockedSushiCount = LIKE_THRESHOLDS.filter(
    (like) => likesReceived >= like
  ).length;

  const nextSushiIndex = LIKE_THRESHOLDS.findIndex(
    (like) => likesReceived < like
  );

  const nextSushiType =
    nextSushiIndex !== -1 ? Math.min(nextSushiIndex + 1, 12) : 12;

  const currentThreshold = LIKE_THRESHOLDS[unlockedSushiCount - 1] || 0;
  const nextThreshold = LIKE_THRESHOLDS[nextSushiType - 1] || 100;

  const progressPercentage =
    nextThreshold > currentThreshold
      ? ((likesReceived - currentThreshold) /
          (nextThreshold - currentThreshold)) *
        100
      : 100;

  // 🔥 격렬한 흔들림 애니메이션 설정
  const [shake, setShake] = useState(false);
  const shakeAnimation = useSpring({
    from: { transform: "translateX(0px) rotate(0deg)" },
    to: shake
      ? [
          { transform: "translateX(-3px) rotate(-3deg)" },
          { transform: "translateX(1.5px) rotate(1.5deg)" },
          { transform: "translateX(-5px) rotate(-5deg)" },
          { transform: "translateX(5px) rotate(5deg)" },
          { transform: "translateX(0px) rotate(0deg)" },
        ]
      : { transform: "translateX(0px) rotate(0deg)" },
    config: { duration: 50 },
    reset: true,
    onRest: () => setShake(false),
  });

  // 이전 값과 비교하여 변경 시에만 흔들림 트리거
  useEffect(() => {
    if (likesReceived !== prevLikesRef.current) {
      setShake(true);
      prevLikesRef.current = likesReceived; // 이전 값 업데이트
    }
  }, [likesReceived]);

  return (
    <animated.div
      style={{ ...styles.container, ...shakeAnimation }}
      onClick={onClick}
    >
      <img
        src={unlockssImg}
        alt="Unlock Sushi"
        style={styles.backgroundImage}
      />

      <div style={styles.progressContainer}>
        <div
          style={{ ...styles.progressBar, width: `${progressPercentage}%` }}
        />
      </div>

      <div style={styles.sushiContainer}>
        <Sushi sushiType={nextSushiType} />
      </div>
    </animated.div>
  );
};

const styles = {
  container: {
    position: "relative",
    display: "block",
    width: "calc( 20 * var(--custom-vh))",
    height: "calc( 10 * var(--custom-vh))",
    justifyContent: "center",
    alignItems: "center",
    cursor: "pointer",
    pointerEvents: "auto",
  },
  backgroundImage: {
    position: "absolute",
    top: "0",
    left: "0",
    width: "100%",
    height: "auto",
  },
  progressContainer: {
    position: "absolute",
    bottom: "37%",
    left: "64%",
    transform: "translateX(-50%)",
    width: "calc( 10 * var(--custom-vh))",
    height: "calc( 1.3 * var(--custom-vh))",
    backgroundColor: "#e0e0e0",
    borderRadius: "calc( 10 * var(--custom-vh))",
    border: "calc( 0.1 * var(--custom-vh)) solid #aaa",
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#4BBE0E",
    transition: "width 0.3s ease-in-out",
  },
  sushiContainer: {
    position: "absolute",
    top: "48%",
    left: "22%",
    transform: "translate(-50%, -50%) scale(0.33)",
    pointerEvents: "none",
  },
};

export default SushiUnlockBar;
