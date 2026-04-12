import React, { useContext } from "react";
import BgmContext from "../context/BgmProvider";

const MuteButton = () => {
  const { isMuted, toggleMute } = useContext(BgmContext);

  return (
    <button onClick={toggleMute} style={styles.muteButton}>
      <i className={isMuted ? "fas fa-volume-mute" : "fas fa-volume-up"}></i>
    </button>
  );
};

const styles = {
  muteButton: {
    position: "fixed",
    top: "calc( 3 * var(--custom-vh))",
    right: "calc( 2 * var(--custom-vh))",
    zIndex: 1000,
    background: "transparent",
    color: "white",
    border: "none",
    fontSize: "3vh",
    cursor: "pointer",
    opacity: 0.6,
    transition: "opacity 0.3s",
  },
};

export default MuteButton;
