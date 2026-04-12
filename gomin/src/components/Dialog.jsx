import { useState, useEffect, useRef } from "react";
import "../styles/dialog.css";

const Dialog = ({
  dialogues = [],
  speed = 50,
  onClose,
  isOpen,
  onComplete,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showNextIndicator, setShowNextIndicator] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const intervalRef = useRef(null);

  const showFullText = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    const currentDialogue = String(dialogues[currentIndex] || "");
    setDisplayText(currentDialogue);
    setIsTyping(false);
    setShowNextIndicator(true);
  };

  useEffect(() => {
    if (!isOpen) {
      setCurrentIndex(0);
      setDisplayText("");
      setIsTyping(false);
      setShowNextIndicator(false);
      setIsCompleted(false);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    if (!dialogues.length || currentIndex >= dialogues.length) {
      setIsCompleted(true);
      onComplete?.();
      return;
    }

    const currentDialogue = String(dialogues[currentIndex] || "");

    setDisplayText("");
    setIsTyping(true);
    setShowNextIndicator(false);

    let index = 0;
    let mounted = true;

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = setInterval(() => {
      if (!mounted) return;

      if (index < currentDialogue.length) {
        setDisplayText((prev) => currentDialogue.substring(0, index + 1));
        index++;
      } else {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
        setIsTyping(false);
        setShowNextIndicator(true);
      }
    }, speed);

    return () => {
      mounted = false;
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [currentIndex, dialogues, speed, isOpen, onComplete]);

  useEffect(() => {
    if (!isOpen) return;

    const handleGlobalClick = () => {
      if (isTyping) {
        showFullText();
        return;
      }

      if (currentIndex >= dialogues.length - 1) {
        if (!isCompleted) {
          setIsCompleted(true);
          onComplete?.();
        } else {
          onClose?.();
        }
        return;
      }

      setCurrentIndex(currentIndex + 1);
    };

    document.addEventListener("click", handleGlobalClick);

    return () => {
      document.removeEventListener("click", handleGlobalClick);
    };
  }, [
    isOpen,
    isTyping,
    isCompleted,
    currentIndex,
    dialogues.length,
    onClose,
    onComplete,
  ]);

  if (!isOpen) return null;

  return (
    <div className="dialog-container">
      <div className="speech-bubble">
        <p>{displayText}</p>
        {showNextIndicator && <span className="next-indicator"> ▼ </span>}
      </div>
    </div>
  );
};

export default Dialog;
