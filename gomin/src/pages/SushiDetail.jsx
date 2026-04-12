import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchMySushiDetail,
  clearCurrentSushi,
} from "../store/slices/sushiSlice";
import PostItModal from "../components/sushiAnswerModal/PostItModal";
import NegativeAnswerModal from "../components/sushiAnswerModal/NegativeAnswerModal";
import GPTAnswerModal from "../components/sushiAnswerModal/GPTAnswerModal";

import postItPink from "../assets/postIt/postIt1.webp";
import postItGreen from "../assets/postIt/postIt2.webp";
import postItBlue from "../assets/postIt/postIt3.webp";
import postItRed from "../assets/postIt/postIt4.webp";
import postItOrange from "../assets/postIt/postIt5.webp";
import warningIcon from "../assets/postIt/Group 5.svg";

import PawPrintIcon from "../components/icons/PawPrintIcon";

const postItImages = [
  postItPink, // 1
  postItGreen, // 2
  postItBlue, // 3
  postItRed, // 4
  postItOrange, // 5
];

const postItColors = {
  [postItPink]: "pink",
  [postItGreen]: "green",
  [postItBlue]: "blue",
  [postItRed]: "red",
  [postItOrange]: "orange",
};

const SushiDetail = () => {
  const { sushiId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const currentSushi = useSelector((state) => state.sushi.currentSushi);
  const status = useSelector((state) => state.sushi.status);
  const [currentPage, setCurrentPage] = useState(0);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  /* 부적절한 답변 여는 모달 */
  const [negativeModalOpen, setNegativeModalOpen] = useState(false);
  const [negativeAnswer, setNegativeAnswer] = useState(null);

  // GPT 답변 여는 모달
  const [gptModalOpen, setGptModalOpen] = useState(false);

  // 애니메이션 관련 state
  const [isVisible, setIsVisible] = useState(false);

  const {
    title = "",
    content = "",
    expirationTime = new Date(),
    createdAt = new Date(),
    answer = [],
    isClosed = false,
  } = currentSushi || {};

  useEffect(() => {
    if (!sushiId) {
      navigate("/home");
      return;
    }
    setTimeout(() => {
      dispatch(clearCurrentSushi());
    }, 5);

    dispatch(fetchMySushiDetail(sushiId));

    // 로딩 후 컴포넌트 페이드인 효과
    setTimeout(() => {
      setIsVisible(true);
    }, 100);
  }, [sushiId, dispatch, navigate, modalOpen]);

  const openAnswer = (answer, index) => {
    const postItColor = postItColors[postItImages[index % 5]];

    if (answer.isNegative) {

      // setNegativeAnswer(answer);
      setNegativeAnswer({ ...answer, postItColor });
      setNegativeModalOpen(true);
    } else if (answer.isGPT) {
      setSelectedAnswer({ ...answer, postItColor });
      setGptModalOpen(true);
    } else {

      // const postItColor = postItColors[postItImages[index % 5]];
      setSelectedAnswer({ ...answer, postItColor });
      setModalOpen(true);
    }
  };

  const closeModal = () => {
    setModalOpen(false);
  };
  const closeNegativeModal = () => {
    setNegativeModalOpen(false);
  };
  const closeGptModal = () => {
    setGptModalOpen(false);
  };

  const confirmNegativeAnswer = () => {
    closeNegativeModal();
    setSelectedAnswer(negativeAnswer);
    setNegativeAnswer(null);
    setModalOpen(true);
  };

  /** 포스트잇(댓글) 페이징 설정 */
  const answersPerPage = 5;
  const totalPages = Math.max(1, Math.ceil(answer.length / answersPerPage));

  const nextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleGoBack = () => {
    navigate("/mysushilist");
  };

  if (status === "loading" || currentSushi === null) {
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
          {/* 뒤로가기 버튼 추가 */}
          <button onClick={handleGoBack} style={styles.backButton}>
            &lt;
          </button>

          {/* 제목 */}
          <p style={styles.title}>
            <span style={styles.titleText}>{title}</span>
          </p>
        </div>
        <hr style={styles.divider} />
        {/* 날짜 */}
        <p style={styles.date}>
          {new Date(createdAt).toLocaleString("ko-KR", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          })}
        </p>

        {/* 본문 내용 */}
        <div style={styles.contentBox}>
          <p style={styles.content}>{content}</p>
        </div>

        <hr style={styles.divider} />

        {/* 포스트잇 (댓글) */}
        {!isClosed ? (
          <p style={styles.catMessage}>£아직 답변이 마감되지 않았다냥♤</p>
        ) : (
          <div style={styles.postItContainer}>
            {answer
              .slice(
                currentPage * answersPerPage,
                (currentPage + 1) * answersPerPage
              )
              .map((item, index) => (
                <div
                  key={item.answerId}
                  style={{
                    ...styles.postItBox,
                    ...styles[`postIt${index + 1}`],
                    backgroundImage: `url(${postItImages[index % 5]})`, // 5개 이미지를 순환
                    backgroundSize: "contain",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                    // filter: item.isNegative ? "blur(2px)" : "none",
                    cursor: "pointer",
                    animation: `fadeIn 0.5s ease forwards ${0.1 + index * 0.1
                      }s`,
                    opacity: 0,
                  }}
                  onClick={() => openAnswer(item, index)}
                >
                  <div style={{ ...styles.postIt, backgroundImage: "none" }}>
                    {item.isNegative && <div style={styles.warningIcon}></div>}
                    <div
                      style={{
                        width: "100%",
                        height: "100%",
                        filter: item.isNegative ? "blur(2vh)" : "none",
                        position: "relative",
                        zIndex: 1,
                      }}
                    >
                      <p style={styles.postItText}>
                        {item.content.length > 20
                          ? `${item.content.slice(0, 20)}...`
                          : item.content}
                      </p>
                    </div>

                    {item.isGPT && (
                      <>
                        <div style={styles.previewPawPrintTop}>
                          <PawPrintIcon />
                        </div>
                        <div style={styles.previewPawPrintBottom}>
                          <PawPrintIcon />
                        </div>
                      </>
                    )}
                  </div>
                </div>
              ))}
          </div>
        )}

        {/* 페이지네이션 버튼 */}
        {totalPages > 1 && (
          <div style={styles.arrowContainer}>
            {currentPage > 0 && (
              <button onClick={prevPage} style={styles.arrowLeft}>
                &lt;
              </button>
            )}
            {currentPage < totalPages - 1 && (
              <button onClick={nextPage} style={styles.arrowRight}>
                &gt;
              </button>
            )}
          </div>
        )}
      </div>

      {/* PostItModal */}
      {modalOpen && (
        <PostItModal
          isOpen={modalOpen}
          onClose={closeModal}
          answer={selectedAnswer}
        />
      )}

      {/* GPT 답변 모달 */}
      {gptModalOpen && (
        <GPTAnswerModal
          isOpen={gptModalOpen}
          onClose={closeGptModal}
          answer={selectedAnswer}
        />
      )}
      {/* 부적절한 답변 모달 */}
      {negativeModalOpen && (
        <NegativeAnswerModal
          isOpen={negativeModalOpen}
          onClose={closeNegativeModal}
          onConfirm={confirmNegativeAnswer}
        />
      )}
    </div>
  );
};

const styles = {
  /**배경 */
  background: {
    padding: "3vh",
    position: "relative",
    height: "calc( 100 * var(--custom-vh))",
    width: "calc( 55 * var(--custom-vh))",
    overflow: "hidden",
    boxSizing: "border-box",
  },
  /**전체 감싸는 컨테이너 */
  outerContainer: {
    backgroundColor: "#FFFEEC",
    position: "relative",
    zIndex: 2,
    width: "calc( 48 * var(--custom-vh))",
    maxWidth: "calc( 60 * var(--custom-vh))",
    height: "calc( 80 * var(--custom-vh))",
    margin: "calc( -0.5 * var(--custom-vh)) auto",
    padding: "calc( 2 * var(--custom-vh))",
    boxSizing: "border-box",
    border: "0.6vh solid #8B6B3E",
    borderRadius: "calc( 1.2 * var(--custom-vh))h",
  },

  /**헤더 컨테이너 */
  headerContainer: {
    display: "flex",
    height: "calc( 10 * var(--custom-vh))",
  },

  /**뒤로가기 버튼 */
  backButton: {
    position: "absolute",
    left: "calc( 2 * var(--custom-vh))",
    fontFamily: "'Ownglyph', Ownglyph",
    fontSize: "calc( 2.4 * var(--custom-vh))",
    fontWeight: "bold",
    background: "transparent",
    border: "none",
    cursor: "pointer",
    color: "#8B6B3E",
  },
  /**제목 */
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
  /**제목 텍스트 */
  titleText: {
    margin: 0,
    padding: 0,
  },
  /**날짜 */
  date: {
    fontSize: "calc( 1.8 * var(--custom-vh))",
    height: "calc( 2 * var(--custom-vh))",
    color: "#8B6B3E",
    textAlign: "right",
    marginRight: "calc( 2 * var(--custom-vh))",
    margin: "calc( 1 * var(--custom-vh)) 0",
  },
  /**내용 박스 */
  contentBox: {
    overflowY: "auto",
    padding: "calc( 1 * var(--custom-vh))",
    paddingLeft: "calc( 2 * var(--custom-vh))",
    height: "calc( 22 * var(--custom-vh))",
    borderRadius: "calc( 0.8 * var(--custom-vh))",
    border: "calc( 0.4 * var(--custom-vh)) solid #B2975C",
  },
  /**내용 */
  content: {
    margin: "0",
    fontSize: "2.5vh",
    color: "#5D4A37",
  },
  /**구분선 */
  divider: {
    width: "90%",
    height: "0",
    margin: "calc( 2 * var(--custom-vh)) auto",
    border: "calc(0.1 * var(--custom-vh)) solid #B2975C",
  },
  /**포스트잇 컨테이너 */
  postItContainer: {
    position: "relative",
    width: "calc( 40 * var(--custom-vh))",
    height: "calc( 25 * var(--custom-vh))",
    top: "calc( 5 * var(--custom-vh))",
    left: "calc( 5.2 * var(--custom-vh))",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    pointerEvents: "none",
  },
  /**포스트잇 박스 */
  postItBox: {
    position: "absolute",
    width: "25%",
    aspectRatio: "1 / 1",
    backgroundColor: "transparent",
    margin: "0",
    scale: "2",
    pointerEvents: "none",
  },
  /**포스트잇 디자인 */
  postIt: {
    position: "relative",
    width: "55%",
    height: "55%",
    top: "13%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "0.5vh",
    margin: "auto",
    pointerEvents: "auto",
  },
  /**포스트잇 내용 */
  postItText: {
    position: "absolute",
    top: "40%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    fontSize: "0.9vh",
    color: "#5D4A37",
    textAlign: "center",
    width: "70%",
    height: "70%",
    overflow: "hidden",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  /** 포스트잇 배치 */
  postIt1: { top: "-15%", left: "-10%", transform: "rotate(-5deg)" },
  postIt2: { top: "40%", left: "5%", transform: "rotate(3deg)" },
  postIt3: { top: "-15%", left: "25%", transform: "rotate(-2deg)" },
  postIt4: { top: "40%", left: "45%", transform: "rotate(4deg)" },
  postIt5: { top: "-15%", left: "60%", transform: "rotate(-3deg)" },
  /**화살표 컨테이너 */
  arrowContainer: {
    position: "relative",
    display: "flex",
    justifyContent: "center",
    bottom: "calc( 17 * var(--custom-vh))",
    height: "16%",
    width: "100%",
  },
  /**왼쪽, 오른쪽 화살표 */
  arrowLeft: {
    position: "relative",
    top: "calc( 3 * var(--custom-vh))",
    marginRight: "auto",
    height: "calc( 3 * var(--custom-vh))",
    width: "calc( 3 * var(--custom-vh))",
    background: "transparent",
    border: "none",
    cursor: "pointer",
    color: "#8B6B3E",
    fontFamily: "'Ownglyph', Ownglyph",
    fontSize: "calc( 3 * var(--custom-vh))",
    fontWeight: "bold",
  },
  arrowRight: {
    position: "relative",
    top: "calc( 3 * var(--custom-vh))",
    marginLeft: "auto",
    height: "calc( 3 * var(--custom-vh))",
    width: "calc( 3 * var(--custom-vh))",
    background: "transparent",
    border: "none",
    cursor: "pointer",
    color: "#8B6B3E",
    fontFamily: "'Ownglyph', Ownglyph",
    fontSize: "calc( 3 * var(--custom-vh))",
    fontWeight: "bold",
  },
  /**마감 안된 답변 안내문 */
  catMessage: {
    textAlign: "center",
    fontSize: "calc(2.6 * var(--custom-vh))",
    fontWeight: "bold",
    color: "#8B6B3E",
    marginBottom: "calc(2 * var(--custom-vh))",
  },
  loading: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    fontSize: "3vh",
    color: "#8B6B3E",
  },
  error: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    fontSize: "3vh",
    color: "red",
  },
  previewPawPrintTop: {
    position: "absolute",
    top: "0%", // 더 위로 이동
    left: "0%", // 더 왼쪽으로 이동
    transform: "scale(0.7) rotate(-15deg)", // 약간 회전 추가
    zIndex: 3,
    color: "#4a4a4a",
  },
  previewPawPrintBottom: {
    position: "absolute",
    bottom: "-10%", // 더 아래로 이동
    right: "0%", // 더 오른쪽으로 이동
    transform: "scale(0.7) rotate(15deg)", // 약간 회전 추가
    zIndex: 3,
    color: "#4a4a4a",
  },
  warningIcon: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "4vh",
    height: "4vh",
    backgroundImage: `url(${warningIcon})`,
    backgroundSize: "contain", // 이미지 크기를 div에 맞게 조정
    backgroundRepeat: "no-repeat", // 이미지를 반복하지 않도록
    zIndex: 2,
    pointerEvents: "none",
  },
};

// 애니메이션 키프레임 추가
document.addEventListener("DOMContentLoaded", function () {
  const style = document.createElement("style");
  style.innerHTML = `
    .listContainer::-webkit-scrollbar {
      display: none;
    }
    
    /* contentBox 스크롤바 스타일 */
    .contentBox::-webkit-scrollbar {
      width: 0.8vh;
    }
    
    .contentBox::-webkit-scrollbar-track {
      background: transparent;
    }
    
    .contentBox::-webkit-scrollbar-thumb {
      background: #B2975C;
      border-radius: 0.4vh;
    }
    
    .contentBox::-webkit-scrollbar-thumb:hover {
      background: #8B6B3E;
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

export default SushiDetail;
