import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { toggleLike } from "../../store/slices/answerSlice";
import { modalStyles, postItImages } from "./styles/modalStyles";

const PostItModal = ({ isOpen, onClose, answer }) => {
  if (!isOpen || !answer) return null;

  const dispatch = useDispatch();
  // 서버 상태를 기반으로 초기 상태 설정
  const [isLiked, setIsLiked] = useState(answer.isLiked);
  // 요청 중복 방지를 위한 상태
  const [isLoading, setIsLoading] = useState(false);

  // answer prop이 변경될 때마다 로컬 상태 업데이트
  useEffect(() => {
    setIsLiked(answer.isLiked);
  }, [answer]);

  const handleToggleLike = async () => {
    // 이미 요청 중이면 무시
    if (isLoading) return;

    // 이미 좋아요 상태인데 또 좋아요를 누르려고 하면 무시
    if (isLiked) return;

    setIsLoading(true);

    try {
      const result = await dispatch(toggleLike(answer.answerId)).unwrap();
      setIsLiked(true); // 성공 시에만 상태 업데이트
    } catch (error) {
      console.error("Failed to toggle like:", error);
      // 에러 발생 시 처리 (예: 토스트 메시지)
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={modalStyles.overlay} onClick={onClose}>
      <div
        style={modalStyles.postOuterBox}
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={postItImages[answer.postItColor]}
          alt="PostIt"
          style={modalStyles.postItImage}
        />
        <div style={modalStyles.closeButton} onClick={onClose}>
          ✖
        </div>
        <div style={modalStyles.content}>{answer.content}</div>
        <div
          style={{
            ...modalStyles.heart,
            cursor: isLoading ? "not-allowed" : "pointer",
            opacity: isLoading ? 0.5 : 1,
          }}
          onClick={handleToggleLike}
        >
          {isLiked ? "❤️" : "🤍"}
        </div>
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: "50%",
    transform: "translateX(-50%)",
    width: "calc( 55 * var(--custom-vh))",
    height: "calc( 100 * var(--custom-vh))",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  postOuterBox: {
    position: "relative",
    width: "calc( 40 * var(--custom-vh))",
    height: "calc( 40 * var(--custom-vh))",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  postItImage: {
    width: "100%",
    height: "100%",
    marginTop: "calc( 4 * var(--custom-vh))",
    transform: "scale(1.5)",
    objectFit: "contain",
  },
  closeButton: {
    position: "absolute",
    height: "calc( 3 * var(--custom-vh))",
    top: "5%",
    right: "8%",
    cursor: "pointer",
    fontSize: "2.5vh",
    color: "#000000",
  },
  content: {
    position: "absolute",
    width: "80%",
    height: "50%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "calc( 2 * var(--custom-vh))",
    textAlign: "center",
  },
  heart: {
    position: "absolute",
    height: "calc( 4 * var(--custom-vh))",
    bottom: "7%",
    right: "5%",
    fontSize: "calc( 3 * var(--custom-vh))",
    zIndex: 3,
    cursor: "pointer",
  },
};

export default PostItModal;
