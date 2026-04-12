import React, { createContext, useState, useRef, useEffect } from "react";
import bgmSound from "../assets/sounds/bgm.mp3"; // 배경음악 파일

const BgmContext = createContext();

export const BgmProvider = ({ children }) => {
  const [isMuted, setIsMuted] = useState(true); // 기본적으로 음소거 상태
  const [isPlaying, setIsPlaying] = useState(false); // 음악이 재생 중인지 여부
  const audioRef = useRef(new Audio(bgmSound));

  useEffect(() => {
    const audio = audioRef.current;
    audio.loop = true;
    audio.volume = 0.1; // 기본 볼륨 설정

    if (!isMuted && isPlaying) {
      audio
        .play()
    } else {
      audio.pause();
    }

    return () => {
      audio.pause();
    };
  }, [isMuted, isPlaying]);

  const toggleMute = () => {
    const audio = audioRef.current;

    if (isMuted) {
      audio.volume = 0.1; // 음소거 해제 시 볼륨 복원
      setIsPlaying(true); // 음악 재생 시작
    } else {
      audio.volume = 0; // 음소거 시 볼륨 0
      setIsPlaying(false); // 음악 정지
    }

    setIsMuted(!isMuted);
  };

  return (
    <BgmContext.Provider value={{ isMuted, toggleMute }}>
      {children}
    </BgmContext.Provider>
  );
};

export default BgmContext;
