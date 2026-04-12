import React, { useRef, useEffect, useState, useContext } from "react";
import { useSpring, animated } from "@react-spring/web";
import alarmTrueImg from "../assets/home/alarmON.webp";
import alarmFalseImg from "../assets/home/alarmOFF.webp";
import notificationBell from "../assets/sounds/notificationBell.mp3";
import BgmContext from "../context/BgmProvider";

const NotificationBell = ({ onClick, hasUnread }) => {
  const audioRef = useRef(null);
  const prevHasUnread = useRef(hasUnread); // 이전 값 저장
  const [shake, setShake] = useState(false);
  const { isMuted } = useContext(BgmContext);

  // 흔들림 애니메이션 설정
  const shakeAnimation = useSpring({
    from: { transform: "translateX(0px) rotate(0deg)" },
    to: shake
      ? [
        { transform: "translateX(-2px) rotate(-2deg)" },
        { transform: "translateX(2px) rotate(2deg)" },
        { transform: "translateX(-2px) rotate(-2deg)" },
        { transform: "translateX(2px) rotate(2deg)" },
        { transform: "translateX(0px) rotate(0deg)" },
      ]
      : { transform: "translateX(0px) rotate(0deg)" },
    config: { duration: 50 },
    reset: true,
    onRest: () => setShake(false),
  });

  // hasUnread가 false → true로 변경될 때만 흔들리도록 설정
  useEffect(() => {
    if (!prevHasUnread.current && hasUnread) {
      setShake(true);
    }
    prevHasUnread.current = hasUnread;
  }, [hasUnread]);

  // 흔들림 시작 시 소리 재생
  useEffect(() => {
    if (shake && !isMuted && audioRef.current) {
      audioRef.current.volume = 0.4;
      audioRef.current.play();
    }
  }, [shake, isMuted]);

  return (
    <animated.div
      style={{
        backgroundImage: `url("${hasUnread ? alarmTrueImg : alarmFalseImg}")`,
        position: "absolute",
        top: "-49%",
        right: "0",
        backgroundSize: "contain",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        width: "calc( 50 * var(--custom-vh))",
        height: "100%",
        zIndex: 2,
        transformOrigin: "90% 30%",
        ...shakeAnimation, // 애니메이션 적용
      }}
    >
      {/* 클릭 이벤트 감지 투명 버튼 */}
      <div
        onClick={() => {
          onClick();
        }}
        style={{
          position: "absolute",
          top: "61%",
          right: "2%",
          transform: "translate(-50%, -50%)",
          width: "12%",
          height: "12%",
          backgroundColor: "rgb(0, 0, 0, 0)",
          cursor: "pointer",
        }}
      ></div>
      {/* 효과음 */}
      <audio ref={audioRef}>
        <source src={notificationBell} type="audio/mp3" />
      </audio>
    </animated.div>
  );
};

export default NotificationBell;
