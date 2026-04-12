import React, { useRef, useContext } from "react";
import bellImg from "../assets/home/bell.webp";
import orderBellSound from "../assets/sounds/nextPage.mp3";
import BgmContext from "../context/BgmProvider";


const PostSushiBell = ({ onClick }) => {
  const audioRef = useRef(new Audio());
  const { isMuted } = useContext(BgmContext);

  // 클릭 시 효과음 재생
  const handlePlaySound = () => {
    if (audioRef.current) {
      // 음소거 상태에 따라 볼륨 설정
      audioRef.current.volume = isMuted ? 0 : 0.4;
      audioRef.current.play();
    }
  };

  return (
    <div
      onClick={() => {
        onClick();
        handlePlaySound();
      }}
      style={{ cursor: "pointer" }}
    >
      <img
        src={bellImg}
        alt="Post Sushi Bell"
        style={{
          position: "absolute",
          bottom: "-25%",
          right: "20%",
          cursor: "pointer",
          width: "calc( 8 * var(--custom-vh))",
          height: "calc( 7 * var(--custom-vh))",
          objectFit: "cover",
        }}
      />
      {/* 효과음 */}
      <audio ref={audioRef}>
        <source src={orderBellSound} type="audio/mp3" />
      </audio>
    </div>
  );
};

export default PostSushiBell;
