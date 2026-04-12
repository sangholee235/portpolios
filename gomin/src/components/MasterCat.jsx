import { useState, useEffect, useRef, useContext } from "react";
import BgmContext from "../context/BgmProvider";
import grr from "../assets/sounds/grr.mp3";
import meow from "../assets/sounds/meow.mp3"
import haak from "../assets/sounds/haak.mp3"

export default function MasterCat() {
  const [clickCount, setClickCount] = useState(0);
  const [isPressing, setIsPressing] = useState(false);
  const [pressTimer, setPressTimer] = useState(null);
  const [showA, setShowA] = useState(false);

  const audioRef = useRef(new Audio());
  const { isMuted } = useContext(BgmContext);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : 0.6;
    }

    if (clickCount === 5 && audioRef.current) {
      audioRef.current.src = meow;
      audioRef.current.play();
    } else if (clickCount === 15 && audioRef.current) {
      audioRef.current.src = haak;
      audioRef.current.play();
      setShowA(true);
      setTimeout(() => {
        setShowA(false);
      }, 800);
    } else if (clickCount === 20) {
      setClickCount(0);
    }
  }, [clickCount, isMuted]);

  const handleMouseDown = () => {
    setIsPressing(true);
    const timer = setTimeout(() => {
      if(audioRef.current){
        audioRef.current.src = grr;
        audioRef.current.play();
      }
    }, 3000);
    setPressTimer(timer);
  };

  const handleMouseUp = () => {
    setIsPressing(false);
    if (pressTimer) {
      clearTimeout(pressTimer);
      setPressTimer(null);
    }
  };

  return (
    <div
      onClick={() => setClickCount((prev) => prev + 1)}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onTouchStart={handleMouseDown}
      onTouchEnd={handleMouseUp}
      style={{
        position: "relative",
        top: "50%",
        left: "50%",
        transform: "translateX(-50%) translateY(-50%)",
        width: "calc( 15 * var(--custom-vh))",
        height: "calc( 20 * var(--custom-vh))",
        padding: "calc( 5 * var(--custom-vh))",
        textAlign: "center",
        cursor: "pointer",
        zIndex: 5,
      }}
    >
      {showA && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "calc( 5 * var(--custom-vh))",
            height: "100%",
          }}
        >
          <div style={{ ...eyes, backgroundColor: "#fffff5" }}>--</div>
          <div style={{ ...eyes, backgroundColor: "#e3b86d" }}>--</div>
        </div>
      )}
    </div>
  );
}

const eyes = {
  height: "calc( 2 * var(--custom-vh))",
  width: "calc( 3 * var(--custom-vh))",
  border: "none",
  borderRadius: "calc( 5 * var(--custom-vh))",
  color: "#5d4a37",
  fontFamily: "inherit",
  fontWeight: "bolder",
  fontSize: "calc( 2.2 * var(--custom-vh))",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  cursor: "pointer",
  marginBottom: "calc( 8.3 * var(--custom-vh))",
};
