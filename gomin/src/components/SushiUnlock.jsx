import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { countLike } from "../store/slices/memberSlice";

// 초밥 이미지 임포트
import eggImg from "../assets/sushi/egg.webp";
import salmonImg from "../assets/sushi/salmon.webp";
import shrimpImg from "../assets/sushi/shrimp.webp";
import cuttleImg from "../assets/sushi/cuttle.webp";
import eelImg from "../assets/sushi/eel.webp";
import octopusImg from "../assets/sushi/octopus.webp";
import wagyuImg from "../assets/sushi/wagyu.webp";
import scallopImg from "../assets/sushi/가리비초밥.webp";
import tunaImg from "../assets/sushi/참치초밥.webp";
import uniImg from "../assets/sushi/성게알초밥.webp";
import flatfighImg from "../assets/sushi/광어초밥.webp";
import salmonEggImg from "../assets/sushi/연어알초밥.webp";

import padlockImg from "../assets/home/padlock_color.webp";
import heartImg from "../assets/heart.webp";

const SUSHI_COUNT = 12;

const keyframes = `
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @keyframes fadeOut {
    from {
      background-color: rgba(0,0,0,0.6);
    }
    to {
      background-color: rgba(0,0,0,0);
    }
  }

  @keyframes modalShow {
    from {
      opacity: 0;
      transform: translateY(20px) scale(0.95);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }

  @keyframes modalHide {
    from {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
    to {
      opacity: 0;
      transform: translateY(20px) scale(0.95);
    }
  }
`;

// 초밥 타입 매핑 수정 - Sushi.jsx와 동일한 방식으로 변경
const sushiTypes = {
  1: { name: "계란초밥", image: eggImg, requiredLikes: 0 },
  2: { name: "연어초밥", image: salmonImg, requiredLikes: 1 },
  3: { name: "새우초밥", image: shrimpImg, requiredLikes: 2 },
  4: { name: "한치초밥", image: cuttleImg, requiredLikes: 3 },
  5: { name: "문어초밥", image: octopusImg, requiredLikes: 6 },
  6: { name: "장어초밥", image: eelImg, requiredLikes: 10 },
  7: { name: "와규초밥", image: wagyuImg, requiredLikes: 15 },
  8: { name: "가리비초밥", image: scallopImg, requiredLikes: 20 },
  9: { name: "광어초밥", image: flatfighImg, requiredLikes: 30 },
  10: { name: "성게알초밥", image: uniImg, requiredLikes: 50 },
  11: { name: "참치초밥", image: tunaImg, requiredLikes: 80 },
  12: { name: "연어알초밥", image: salmonEggImg, requiredLikes: 100 },
};

const SushiUnlock = ({ isOpen, onClose }) => {
  const [isClosing, setIsClosing] = useState(false);
  const dispatch = useDispatch();
  const likesReceived = useSelector((state) => state.member.likesReceived);

  // keyframes 스타일을 동적으로 추가
  useEffect(() => {
    const styleSheet = document.createElement("style");
    styleSheet.textContent = keyframes;
    document.head.appendChild(styleSheet);

    return () => {
      document.head.removeChild(styleSheet);
    };
  }, []);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 300);
  };

  // 다음 해금될 초밥 찾기 함수 추가
  const getNextSushi = () => {
    for (let i = 1; i <= SUSHI_COUNT; i++) {
      if (sushiTypes[i].requiredLikes > likesReceived) {
        return sushiTypes[i];
      }
    }
    return sushiTypes[SUSHI_COUNT]; // 모두 해금된 경우 마지막 초밥 반환
  };

  // 현재 해금된 초밥의 인덱스 찾기
  const getCurrentSushiIndex = () => {
    for (let i = SUSHI_COUNT; i >= 1; i--) {
      if (sushiTypes[i].requiredLikes <= likesReceived) {
        return i;
      }
    }
    return 1; // 기본값은 첫 번째 초밥
  };

  useEffect(() => {
    if (isOpen) {
      dispatch(countLike());
    }
  }, [isOpen, dispatch]);

  const nextSushi = getNextSushi();
  const currentSushiIndex = getCurrentSushiIndex();
  const currentSushi = sushiTypes[currentSushiIndex];

  const progressPercentage = Math.min(
    ((likesReceived - currentSushi.requiredLikes) /
      (nextSushi.requiredLikes - currentSushi.requiredLikes)) *
    100,
    100
  );

  if (!isOpen) return null;

  return (
    <div
      style={{
        ...overlayStyle,
        animation: isClosing ? "fadeOut 0.3s ease-out" : "fadeIn 0.3s ease-out",
        backgroundColor: isClosing ? "rgba(0,0,0,0)" : "rgba(0,0,0,0.6)",
      }}
    >
      <div
        style={{
          ...modalStyle,
          animation: isClosing
            ? "modalHide 0.3s ease-in-out forwards"
            : "modalShow 0.3s ease-in-out forwards",
        }}
      >
        <div style={outerBoxStyle}>
          <div style={innerBoxStyle}>나의 초밥</div>
        </div>
        <button onClick={handleClose} style={cancelButtonStyle}>
          ✖
        </button>

        <div style={progressContainer}>
          <div style={progressBarContainer}>
            <div style={leftIconContainer}>
              <img src={heartImg} alt="하트" style={leftIconStyle} />
              <p style={leftTextStyle}>{likesReceived}</p>
            </div>
            <div style={progressBar}>
              <div
                style={{ ...progressFill, width: `${progressPercentage}%` }}
              />
            </div>
            <div style={rightIconContainer}>
              <img
                src={nextSushi.image}
                alt={nextSushi.name}
                style={rightIconStyle}
              />
              <p style={rightTextStyle}>
                다음초밥까지 {nextSushi.requiredLikes - likesReceived}개!
              </p>
            </div>
          </div>
        </div>

        <div style={sushiGrid}>
          {Array.from({ length: SUSHI_COUNT }).map((_, index) => {
            const sushiInfo = sushiTypes[index + 1];
            const isUnlocked = likesReceived >= sushiInfo.requiredLikes;

            return (
              <div key={index} style={sushiOuterStyle}>
                <div style={sushiItem}>
                  {isUnlocked ? (
                    <div style={sushiImageContainer}>
                      <img
                        src={sushiInfo.image}
                        alt={sushiInfo.name}
                        style={sushiImageStyle}
                      />
                      <div style={sushiNameStyle}>{sushiInfo.name}</div>
                    </div>
                  ) : (
                    <div style={lockedStyle}>
                      <div style={requiredLikesStyle}>
                        {sushiInfo.requiredLikes}개의 좋아요 필요
                      </div>
                      <img
                        src={padlockImg}
                        alt="자물쇠"
                        style={lockIconStyle}
                      />
                      <div style={sushiUnlockNameStyle}>{sushiInfo.name}</div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// 스타일 정의
const overlayStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  backgroundColor: "rgba(0, 0, 0, 0.6)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  animation: "fadeIn 0.3s ease-in-out forwards",
};

const modalStyle = {
  backgroundColor: "#fdf5e6",
  padding: "2.5vh",
  paddingTop: "2vh",
  top: "6vh",
  width: "calc( 50 * var(--custom-vh))",
  height: "fit-content",
  border: "1vh solid #906C48",
  borderRadius: "1.3vh",
  outline: "0.25vh solid #67523E",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  boxSizing: "border-box",
  opacity: 0,
  transform: "translateY(20px) scale(0.95)",
  animation: "modalShow 0.3s ease-in-out forwards",
};

const outerBoxStyle = {
  width: "70%",
  margin: "2vh",
  border: "0.4vh solid #8B6B3E",
  borderRadius: "1vh",
  backgroundColor: "#B2975C",
  padding: "0.6vh",
  boxSizing: "border-box",
};

const innerBoxStyle = {
  width: "100%",
  border: "0.2vh solid #906C48",
  borderRadius: "0.5vh",
  backgroundColor: "#B2975C",
  textAlign: "center",
  color: "#5D4A37",
  fontSize: "calc(3 * var(--custom-vh))",
  fontWeight: "bold",
  padding: "0.5vh",
  boxSizing: "border-box",
};

const cancelButtonStyle = {
  position: "absolute",
  top: "1.2vh",
  right: "1.2vh",
  width: "5vh",
  height: "5vh",
  border: "none",
  backgroundColor: "transparent",
  color: "#67523E",
  fontSize: "2.5vh",
  cursor: "pointer",
};

const progressContainer = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  marginBottom: "3vh",
  width: "80%",
};

const progressBarContainer = {
  position: "relative",
  width: "100%",
  height: "3vh",
  marginBottom: "1vh",
  display: "flex",
  alignItems: "center",
};

const progressBar = {
  position: "absolute",
  width: "calc(100% - 6vh)",
  height: "2vh",
  border: "0.2vh solid #906C48",
  borderRadius: "0.6vh",
  overflow: "hidden",
  left: "3vh",
  right: "3vh",
  backgroundColor: "#e0e0e0",
};

const progressFill = {
  height: "100%",
  backgroundColor: "#4BBE0E",
  borderRadius: "0.6vh",
  transition: "width 0.5s ease-in-out",
};

const leftIconContainer = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  position: "absolute",
  top: "-1.6vh",
  left: "0vh",
  zIndex: 3,
};

const leftIconStyle = {
  position: "absolute",
  top: "-6.9vh",
  left: "-6.5vh",
  width: "20vh",
  height: "20vh",
};

const leftTextStyle = {
  position: "absolute",
  top: "2vh",
  left: "calc(3 * var(--custom-vh))",
  margin: 0,
  textAlign: "center",
  fontSize: "calc(2.5 * var(--custom-vh))",
  color: "#FFFFFF",
};

const rightIconContainer = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  position: "absolute",
  top: "-1.4vh",
  right: "-3vh",
  zIndex: 3,
};

const rightIconStyle = {
  position: "absolute",
  right: "-9vh",
  top: "-11.3vh",
  width: "30vh",
  height: "30vh",
  objectFit: "contain",
  zIndex: 3,
  pointerEvents: "none",
};

const rightTextStyle = {
  position: "absolute",
  width: "20vh",
  right: "-4vh",
  top: "5.5vh",
  margin: 0,
  textAlign: "center",
  fontSize: "calc(2.5 * var(--custom-vh))",
  color: "#5D4A37",
};

const progressText = {
  fontSize: "1.8vh",
  color: "#5D4A37",
  fontWeight: "bold",
  marginBottom: "1vh",
};

const sushiGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(3, 1fr)",
  justifyContent: "center",
  width: "100%",
  alignItems: "center",
};

const sushiOuterStyle = {
  width: "100%",
  aspectRatio: "1/1",
  backgroundColor: "#B2975C",
  padding: "0.5vh",
  boxSizing: "border-box",
  border: "0.3vh solid #906C48",
  borderRadius: "1vh",
};

const sushiItem = {
  width: "100%",
  height: "100%",
  backgroundColor: "#E8E2D6",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  boxSizing: "border-box",
  border: "0.3vh solid #906C48",
  position: "relative",
};

const sushiImageContainer = {
  position: "absolute",
  width: "100%",
  height: "100%",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  transform: "scale(2.5)",
  top: "1.3vh",
};

const sushiImageStyle = {
  width: "100%",
  height: "auto",
  objectFit: "contain",
  marginBottom: "0.6vh",
};

const sushiNameStyle = {
  position: "absolute",
  bottom: "35%",
  width: "100%",
  height: "fit-content",
  color: "#5D4A37",
  textAlign: "center",
  fontSize: "calc(0.8 * var(--custom-vh))",
};

const lockedStyle = {
  position: "absolute",
  width: "100%",
  display: "flex",
  height: "--custom-vh",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  transform: "scale(2.5)",
  top: "1.3vh",
};

const lockIconStyle = {
  position: "absolute",
  width: "100%", // 이미지 크기 조정
  height: "100%",
  left: "-0.15vh",
  top: "0.3vh",
  scale: "1.5",
};

const requiredLikesStyle = {
  position: "absolute",
  width: "100%",
  height: "100%",
  top: "45%",
  fontSize: "calc(0.7 * var(--custom-vh))",
  textAlign: "center",
  wordBreak: "keep-all",
  color: "#5D4A37",
  textShadow: `
    calc(-0.05 * var(--custom-vh)) calc(-0.05 * var(--custom-vh)) 0 #fff,
    calc(0.05 * var(--custom-vh)) calc(-0.05 * var(--custom-vh)) 0 #fff,
    calc(-0.05 * var(--custom-vh)) calc(0.05 * var(--custom-vh)) 0 #fff,
    calc(0.05 * var(--custom-vh)) calc(0.05 * var(--custom-vh)) 0 #fff
  `,
  zIndex: "1",
};

const sushiUnlockNameStyle = {
  position: "absolute",
  bottom: "35%",
  width: "100%",
  height: "fit-content",
  color: "#5D4A37",
  textAlign: "center",
  fontSize: "calc(0.8 * var(--custom-vh))",
};

export default SushiUnlock;
