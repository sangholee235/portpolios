import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import navImg from "../assets/home/nav.webp";
import navHomeImg from "../assets/home/nav1.webp";
import navSushiImg from "../assets/home/nav2.webp";
import navAnswerImg from "../assets/home/nav3.webp";

import Modal from "../components/EditModal";
import Tutorial from "../components/Tutorial";

/** 상단 네비게이션 바 */
const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [bgImage, setBgImage] = useState(navImg);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTutorialOpen, setIsTutorialOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const isNew = useSelector((state) => state.member?.isNew);

  useEffect(() => {
    if (isNew) {
      setIsTutorialOpen(true); // 튜토리얼 실행
    }
  }, [isNew]);

  // 튜토리얼 종료 후 닉네임 모달 실행
  const handleTutorialClose = () => {
    setIsTutorialOpen(false);
    openModal(); // 튜토리얼이 닫히면 모달 실행
  };

  // 미리 이미지 로드
  useEffect(() => {
    const preloadImages = [navHomeImg, navSushiImg, navAnswerImg];
    preloadImages.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  useEffect(() => {
    const getBgImage = () => {
      switch (location.pathname) {
        case "/Home":
          return navHomeImg;
        case "/MySushiList":
          return navSushiImg;
        case "/MyAnswerList":
          return navAnswerImg;
        default:
          return navImg;
      }
    };

    const newBgImage = getBgImage();
    if (bgImage !== newBgImage) {
      setBgImage(newBgImage);
    }
  }, [location.pathname, bgImage]);

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <nav style={{ ...styles.navbar, backgroundImage: `url(${bgImage})` }}>
      <div
        style={{
          ...styles.contentWrapper,
          pointerEvents: isTutorialOpen ? "none" : "auto",
        }}
      >
        {/* Home 메뉴 */}
        <div
          style={styles.navItem}
          onClick={() => handleNavigation("/Home")}
        ></div>

        {/* MySushiList 메뉴 */}
        <div
          style={styles.navItem}
          onClick={() => handleNavigation("/MySushiList")}
        ></div>

        {/* MyAnswerList 메뉴 */}
        <div
          style={styles.navItem}
          onClick={() => handleNavigation("/MyAnswerList")}
        ></div>

        {/* My 메뉴 (닉네임 모달) */}
        <div style={styles.navItem} onClick={openModal}></div>
      </div>

      {/* 튜토리얼 실행 */}
      {isTutorialOpen && (
        <Tutorial onClose={handleTutorialClose} showFullTutorial={true} />
      )}

      {/* 닉네임 설정 모달 */}
      {isModalOpen && <Modal isOpen={isModalOpen} onClose={closeModal} />}
    </nav>
  );
};

// 스타일
const styles = {
  navbar: {
    width: "100%",
    backgroundSize: "100% auto",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
    paddingBottom: "28.12%",
    position: "relative",
    transition: "background-image 0.3s ease-in-out",
  },

  contentWrapper: {
    position: "absolute",
    inset: "0", // 부모 크기와 동일하게 설정
    display: "flex",
  },

  navItem: {
    flex: 1, // 4개의 div를 동일한 크기로 분할
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "16px",
    fontWeight: "bold",
    color: "white",
    cursor: "pointer",
    transition: "background-color 0.3s",
  },
};

export default Navbar;
