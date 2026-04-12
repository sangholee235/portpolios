import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchAnswerDetail } from "../store/slices/answerSlice";
import PostItAnswerModal from "../components/PostItAnswerModal";

import postIt from "../assets/postIt.webp";

const SushiAnswerDetail = () => {
  const { sushiId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const currentSushi = useSelector((state) => state.answer.answerDetail);
  const status = useSelector((state) => state.answer.status);
  const [currentPage, setCurrentPage] = useState(0);

  // 애니메이션 관련 상태
  const [isVisible, setIsVisible] = useState(false);

  const {
    title = "",
    content = "",
    createdAt = new Date(),
    answer = [],
    isLiked = new Boolean(),
  } = currentSushi || {};

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [likedAnswerId, setLikedAnswerId] = useState(null);

  useEffect(() => {
    if (!sushiId) {
      navigate("/home");
      return;
    }
    dispatch(fetchAnswerDetail(sushiId));

    // 데이터 로딩 후 애니메이션 시작
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);

    return () => clearTimeout(timer);
  }, [sushiId, dispatch, navigate]);

  const openModal = (answer) => {
    setSelectedAnswer(answer);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const answersPerPage = 5;
  const totalPages = Math.ceil(1 / answersPerPage);

  const handleGoBack = () => {
    navigate("/myAnswerList");
  };

  const truncateText = (text, maxLength) => {
    if (!text) return "답변 내용 없음";
    return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
  };

  if (status === "loading") {
    return <div style={styles.loading}>로딩 중...</div>;
  }

  if (status === "failed") {
    return <div style={styles.error}>데이터를 불러오는 데 실패했습니다.</div>;
  }

  if (!currentSushi || !sushiId) {
    navigate("/home");
    return null;
  }

  return (
    <div style={styles.background}>
      <div
        style={{
          ...styles.outerContainer,
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? "translateY(0)" : "translateY(20px)",
          transition: "opacity 0.5s ease, transform 0.5s ease",
        }}
      >
        <div style={styles.headerContainer}>
          <button onClick={handleGoBack} style={styles.backButton}>
            &lt;
          </button>
          <p style={styles.title}>{title || "제목이 없습니다"}</p>
        </div>
        <hr style={styles.divider} />
        <p style={styles.date}>
          {new Date(createdAt).toLocaleString() || "날짜 정보 없음"}
        </p>
        <div style={styles.contentBox}>
          <p style={styles.content}>{content || "본문 내용이 없습니다"}</p>
        </div>
        <hr style={styles.divider} />
        <div style={styles.postItOuterBox}>
          <div style={styles.postItRow}>
            <div
              style={{
                ...styles.postItContainer,
                animation: isVisible
                  ? `fadeIn 0.5s ease forwards 0.3s`
                  : "none",
                opacity: 0,
              }}
            >
              <img
                src={postIt}
                alt="포스트잇"
                style={{
                  cursor: "pointer",
                  width: "calc( 37.5 * var(--custom-vh))",
                  height: "calc( 37.5 * var(--custom-vh))",
                  objectFit: "contain",
                }}
                onClick={() => openModal(answer)}
              />
              <p style={styles.postItText}>{truncateText(answer, 58)}</p>
            </div>
          </div>
        </div>
      </div>
      {modalOpen && (
        <PostItAnswerModal
          isOpen={modalOpen}
          onClose={closeModal}
          content={answer}
          isLiked={isLiked}
        />
      )}
    </div>
  );
};

const styles = {
  background: {
    padding: "calc(3 * var(--custom-vh))",
    position: "relative",
    height: "calc( 100 * var(--custom-vh))",
    width: "100%",
    overflow: "hidden",
    boxSizing: "border-box",
  },
  outerContainer: {
    backgroundColor: "#FFFEEC",
    position: "relative",
    zIndex: 2,
    width: "100%",
    maxWidth: "calc( 60 * var(--custom-vh))",
    height: "calc( 80 * var(--custom-vh))",
    margin: "-0.5vh auto",
    padding: "calc( 2 * var(--custom-vh))",
    boxSizing: "border-box",
    border: "0.6vh solid #8B6B3E",
    borderRadius: "calc( 1.2 * var(--custom-vh))",
  },
  headerContainer: {
    display: "flex",
    height: "calc( 10 * var(--custom-vh))",
  },
  backButton: {
    position: "absolute",
    left: "calc(2 * var(--custom-vh))",
    fontFamily: "'Ownglyph', Ownglyph",
    fontSize: "calc(2.4 * var(--custom-vh))",
    fontWeight: "bold",
    background: "transparent",
    border: "none",
    cursor: "pointer",
    color: "#8B6B3E",
  },
  title: {
    width: "80%",
    fontSize: "calc( 3.5 * var(--custom-vh))",
    textAlign: "center",
    margin: "0 auto",
    flex: "0 1 auto",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
  },
  date: {
    fontSize: "calc( 1.8 * var(--custom-vh))",
    height: "calc( 2 * var(--custom-vh))",
    color: "#8B6B3E",
    textAlign: "right",
    marginRight: "calc(2 * var(--custom-vh))",
    margin: "calc( 1 * var(--custom-vh)) 0",
  },
  contentBox: {
    overflowY: "auto",
    padding: "calc( 1 * var(--custom-vh))",
    height: "calc(22 * var(--custom-vh))",
    borderRadius: "calc( 0.8 * var(--custom-vh))",
    border: "calc( 0.4* var(--custom-vh)) solid #B2975C",
    scrollbarWidth: "thin",
    scrollbarColor: "#B2975C transparent",
  },
  content: {
    margin: "0",
    fontSize: "calc(2.5 * var(--custom-vh))",
    color: "#5D4A37",
  },
  divider: {
    width: "90%",
    height: "0",
    margin: "calc( 2 * var(--custom-vh)) auto",
    border: "calc(0.1 * var(--custom-vh)) solid #B2975C",
  },
  postItOuterBox: {
    position: "relative",
    width: "calc( 40 * var(--custom-vh))",
    height: "calc( 25 * var(--custom-vh))",
    top: "calc( 5 * var(--custom-vh))",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "1vh",
  },
  postItRow: {
    display: "flex",
    justifyContent: "center",
    gap: "1vh",
  },
  arrowContainer: {
    position: "relative",
    display: "flex",
    justifyContent: "center",
    bottom: "calc(17 * var(--custom-vh))",
    height: "16%",
    width: "100%",
  },
  arrowLeft: {
    position: "relative",
    top: "calc(3 * var(--custom-vh))",
    marginRight: "auto",
    height: "calc(3 * var(--custom-vh))",
    width: "calc(3 * var(--custom-vh))",
    background: "transparent",
    border: "none",
    cursor: "pointer",
    color: "#8B6B3E",
    fontFamily: "'Ownglyph', Ownglyph",
    fontSize: "calc(3 * var(--custom-vh))",
    fontWeight: "bold",
  },
  arrowRight: {
    position: "relative",
    top: "calc(3 * var(--custom-vh))",
    marginLeft: "auto",
    height: "calc(3 * var(--custom-vh))",
    width: "calc(3 * var(--custom-vh))",
    background: "transparent",
    border: "none",
    cursor: "pointer",
    color: "#8B6B3E",
    fontFamily: "'Ownglyph', Ownglyph",
    fontSize: "calc(3 * var(--custom-vh))",
    fontWeight: "bold",
  },
  loading: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "calc( 100 * var(--custom-vh))",
    fontSize: "3vh",
    color: "#8B6B3E",
  },
  error: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "calc( 100 * var(--custom-vh))h",
    fontSize: "3vh",
    color: "red",
  },
  postItContainer: {
    position: "relative",
    top: "calc(-9 * var(--custom-vh))",
    width: "calc(37.5 * var(--custom-vh))",
    height: "calc(37.5 * var(--custom-vh))",
  },
  postItText: {
    position: "absolute",
    top: "70%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    margin: 0,
    fontSize: "calc(3 * var(--custom-vh))",
    color: "#5D4A37",
    textAlign: "center",
    width: "calc(20 * var(--custom-vh))",
    wordBreak: "break-word",
    zIndex: 1,
    pointerEvents: "none",
  },
};

// Chrome, Safari에서 스크롤바 숨기기 및 애니메이션 키프레임 추가
document.addEventListener("DOMContentLoaded", function () {
  const style = document.createElement("style");
  style.innerHTML = `
    .listContainer::-webkit-scrollbar {
      display: none;
    }
    
    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `;
  document.head.appendChild(style);
});

export default SushiAnswerDetail;
