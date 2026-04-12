import React, { useState, useEffect } from "react";
import Dialog from "../components/Dialog";

//튜토리얼 이미지
import t00 from "../assets/tuto/00.webp";
import t0 from "../assets/tuto/0.webp";
import t01 from "../assets/tuto/01.webp";
import t2 from "../assets/tuto/2.webp";
import t3 from "../assets/tuto/03.webp";
import t7 from "../assets/tuto/7.webp";
import t8 from "../assets/tuto/8.webp";
import t9 from "../assets/tuto/9.webp";
import t10 from "../assets/tuto/10.webp";

const Tutorial = ({ onClose, showFullTutorial = true }) => {
  const [showDialog, setShowDialog] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isDialogOpen, setIsDialogOpen] = useState(true);

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  const dialogues = [
    "어서오세요. 처음 뵙는 분이군요.",
    "저는 고민 한접시의 주인장, 마스터 냥입니다.",
    "이 곳은 손님의 고민을 풀어놓기도 하고",
    "다른 손님들의 고민을 들어주기도 하는 작은 식당입니다.",
    "작고 다양한 초밥들로 마음을 든든히 채워보세요.",
    "고민 한 접시의 이용 방법을 간단히 설명해드리겠습니다.",
  ];

  const tutorialSlides = [t00, t0, t01, t3, t7, t8, t2, t10, t9];

  useEffect(() => {
    if (showFullTutorial) {
      const timer = setTimeout(() => {
        setShowDialog(true);
      }, 2500);
      return () => clearTimeout(timer);
    } else {
      setShowTutorial(true);
    }
  }, [showFullTutorial]);

  const handleDialogComplete = () => {
    setShowDialog(false);
    setIsDialogOpen(false);
    setShowTutorial(true);
  };

  const handleTutorialPrevious = (e) => {
    e.stopPropagation();
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const handleTutorialNext = (e) => {
    e.stopPropagation();
    if (currentSlide < tutorialSlides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      setShowTutorial(false);
      onClose();
    }
  };

  return (
    <>
      {(showDialog || showTutorial) && (
        <div
          style={{
            position: "fixed",
            top: "40%",
            left: "50%",
            zIndex: 8,
            backgroundColor: "transparent",
          }}
          onClick={(e) => e.stopPropagation()}
        />
      )}

      {(showDialog || showTutorial) && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "transparent",
            zIndex: 7,
            pointerEvents: "auto",
          }}
          onClick={(e) => e.stopPropagation()}
        />
      )}

      {showDialog && (
        <div
          style={{
            position: "absolute",
            top: "calc( 25 * var(--custom-vh))",
            left: "calc( 28 * var(--custom-vh))",
            width: "calc( 25 * var(--custom-vh))",
          }}
        >
          <Dialog
            dialogues={dialogues}
            onClose={handleCloseDialog}
            isOpen={isDialogOpen}
            onComplete={handleDialogComplete}
          />
        </div>
      )}

      {showTutorial && (
        <div style={styles.tutorialModal}>
          <div style={styles.tutorialContent}>
            <div style={styles.navigationContainer}>
              <div
                style={styles.navigationLeft}
                onClick={handleTutorialPrevious}
              />
              <div
                style={styles.navigationRight}
                onClick={handleTutorialNext}
              />
            </div>
            <img
              src={tutorialSlides[currentSlide]}
              alt={`Tutorial ${currentSlide + 1}`}
              style={styles.tutorialImage}
            />
            <div style={styles.pagination}>
              {tutorialSlides.map((_, index) => (
                <div
                  key={index}
                  style={{
                    ...styles.paginationDot,
                    backgroundColor:
                      currentSlide === index ? "#24D536" : "#D1D5DB",
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const styles = {
  tutorialModal: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 9,
  },
  tutorialContent: {
    borderRadius: "12px",
    width: "calc( 45 * var(--custom-vh))",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    overflow: "hidden",
    position: "relative",
  },
  navigationContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: "flex",
    zIndex: 2,
  },
  navigationLeft: {
    width: "50%",
    height: "100%",
    cursor: "pointer",
  },
  navigationRight: {
    width: "50%",
    height: "100%",
    cursor: "pointer",
  },
  tutorialImage: {
    width: "100%",
    height: "auto",
    display: "block",
    objectFit: "contain",
  },
  pagination: {
    display: "flex",
    gap: "8px",
    padding: "16px 0",
  },
  paginationDot: {
    width: "1vh",
    height: "1vh",
    borderRadius: "5vh",
    transition: "background-color 0.2s",
  },
};

export default Tutorial;
