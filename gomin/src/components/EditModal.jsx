import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { updateNickname, deleteAccount } from "../store/slices/authSlice";
import { clearMemberData } from "../store/slices/memberSlice";
import { useNavigate } from "react-router-dom";
import { useNotification } from "../hooks/useNotification"; // 푸시 알림 훅 추가
import "../styles/font.css";

const EditModal = ({ isOpen, onClose, onConfirm }) => {
  const dispatch = useDispatch();
  const currentNickname = localStorage.getItem("userNickname");
  const { requestPermission } = useNotification(); // 푸시 알림 훅 사용

  const [nickname, setNickname] = useState("");
  const [error, setError] = useState("");
  const [fade, setFade] = useState(false);
  const [isEditPressed, setIsEditPressed] = React.useState(false);
  const [isCancelPressed, setIsCancelPressed] = React.useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      setFade(true);
    } else {
      setFade(false);
    }
  }, [isOpen]);

  useEffect(() => {
    setNickname(currentNickname);
  }, [isOpen, currentNickname]);

  const handleClose = () => {
    setFade(false);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  const handleSaveNickname = async () => {
    if (!nickname.trim()) {
      setError("닉네임을 입력해주세요.");
      return;
    }
    try {
      const result = await dispatch(updateNickname(nickname)).unwrap();
      localStorage.setItem("userNickname", nickname);
      alert("닉네임이 성공적으로 변경되었습니다.");
      handleClose();
    } catch (err) {
      setError("닉네임 변경에 실패했습니다. 다시 시도해주세요.");
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm("정말로 탈퇴하시겠습니까?")) {
      try {
        await dispatch(deleteAccount()).unwrap();
        handleClose();
        navigate("/");
      } catch (err) {
        setError("회원탈퇴에 실패했습니다. 다시 시도해주세요.");
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("userNickname");
    dispatch(clearMemberData());
    handleClose();
    navigate("/");
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    if (value.length <= 7) {
      setNickname(value);
      setError("");
    }
  };

  // 푸시 알림 권한 요청 및 FCM 토큰 처리
  const handlePushNotification = async () => {
    const result = await requestPermission();
    if (result === "granted") {
      alert("푸시 알림을 보내드릴게요!");
    } else if (result === "denied") {
      alert("푸시 알림이 차단되어있습니다. 브라우저 설정에서 변경 가능합니다.");
    } else {
      console.log("사용자가 결정을 보류함:", result);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        ...styles.overlay,
        opacity: fade ? 1 : 0,
        visibility: fade ? "visible" : "hidden",
      }}
    >
      <div
        style={{
          ...styles.modal,
          transform: fade ? "translateY(0)" : "translateY(-20px)",
          opacity: fade ? 1 : 0,
        }}
      >
        <div style={styles.innerBox}>
          {/* 왼쪽 상단에 종모양 아이콘 추가 */}
          <button
            onClick={handlePushNotification}
            style={{
              ...styles.pushNotificationIcon,
              position: "absolute",
              top: "1vh",
              left: "1vh",
            }}
          >
            🔔
          </button>

          <p style={styles.titleStyle}>당신을 어떻게 부르면 될까요?</p>

          <div style={styles.inputContainer}>
            <input
              type="text"
              value={nickname}
              onChange={handleInputChange}
              placeholder="answer"
              style={styles.inputStyle}
            />
          </div>
          {error && <p style={styles.errorStyle}>{error}</p>}

          <div style={styles.buttonBox}>
            <button
              onClick={handleClose}
              onMouseDown={() => setIsCancelPressed(true)}
              onMouseUp={() => setIsCancelPressed(false)}
              onMouseLeave={() => setIsCancelPressed(false)}
              style={{
                ...styles.cancelButton,
                backgroundColor: isCancelPressed ? "#67523E" : "#A68564",
                transform: isCancelPressed
                  ? "translateY(0.4vh)"
                  : "translateY(-0.2vh)",
                boxShadow: isCancelPressed
                  ? "0 0 0 #67523E"
                  : "0 0.4vh 0 #67523E",
              }}
              className="custom-placeholder"
            >
              취소
            </button>
            <button
              onClick={handleSaveNickname}
              onMouseDown={() => setIsEditPressed(true)}
              onMouseUp={() => setIsEditPressed(false)}
              onMouseLeave={() => setIsEditPressed(false)}
              style={{
                ...styles.editButton,
                backgroundColor: isEditPressed ? "#863334" : "#C85253",
                transform: isEditPressed
                  ? "translateY(0.4vh)"
                  : "translateY(-0.2vh)",
                boxShadow: isEditPressed
                  ? "0 0 0 #863334"
                  : "0 0.4vh 0 #863334",
              }}
              className="custom-placeholder"
            >
              확인
            </button>
          </div>

          {/* 하단 "회원탈퇴/로그아웃" 버튼 원래 위치 유지 */}
          <div style={styles.bottomButtonContainer}>
            <button
              onClick={handleDeleteAccount}
              style={styles.bottomButtonStyle}
            >
              회원탈퇴
            </button>
            <button onClick={handleLogout} style={styles.bottomButtonStyle}>
              로그아웃
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
    transition: "all 0.3s ease-in-out",
    visibility: "hidden",
  },
  modal: {
    width: "calc( 48.5 * var(--custom-vh))",
    height: "fit-content",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
    transition: "all 0.3s ease-in-out",
    transform: "translateY(-20px)",
    opacity: 0,
  },
  innerBox: {
    backgroundColor: "#fdf5e6",
    padding: "3vh",
    borderRadius: "2vh",
    width: "calc( 50 * var(--custom-vh))",
    position: "relative",
    textAlign: "center",
    border: "1vh solid #906C48",
    outline: "0.3vh solid #67523E",
    fontSize: "2.3vh",
  },
  buttonBox: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    marginTop: "3vh",
    marginBottom: "1vh",
    gap: "5vh",
  },
  editButton: {
    padding: "1vh 0",
    border: "none",
    borderRadius: "1vh",
    backgroundColor: "#A68564",
    color: "white",
    cursor: "pointer",
    width: "40%",
    whiteSpace: "nowrap",
    lineHeight: "1",
    fontFamily: "Ownglyph, Ownglyph",
    fontSize: "2.8vh",
    transition: "all 0.1s ease",
  },
  cancelButton: {
    padding: "1vh 0",
    border: "none",
    borderRadius: "1vh",
    backgroundColor: "#C85253",
    color: "white",
    cursor: "pointer",
    width: "40%",
    whiteSpace: "nowrap",
    lineHeight: "1",
    fontFamily: "Ownglyph, Ownglyph",
    fontSize: "2.8vh",
    transition: "all 0.1s ease",
  },
  bottomButtonContainer: {
    position: "absolute",
    bottom: "1vh",
    left: "10px",
    right: "10px",
    display: "flex",
    justifyContent: "space-between", // 좌우로 분리
    fontSize: "1.4vh",
  },
  bottomButtonStyle: {
    background: "none",
    border: "none",
    color: "#888",
    cursor: "pointer",
    textDecoration: "underline",
    fontFamily: "Ownglyph, Ownglyph",
  },
  pushNotificationIcon: {
    background: "none",
    border: "none",
    color: "#888",
    cursor: "pointer",
    fontSize: "1.5vh", // 아이콘 크기 조정
    lineHeight: "1.5vh",
    padding: "0",
  },
  errorStyle: {
    color: "#dc3545",
    fontSize: "14px",
    marginBottom: "15px",
    textAlign: "center",
  },
  titleStyle: {
    fontSize: "2.8vh",
    marginBottom: "20px",
    color: "#000",
    textAlign: "center",
  },
  inputContainer: {
    width: "100%",
    marginBottom: "20px",
  },
  inputStyle: {
    width: "100%",
    padding: "10px",
    border: "1px solid #ddd",
    borderRadius: "5px",
    backgroundColor: "white",
    textAlign: "center",
    boxSizing: "border-box",
    fontSize: "2.8vh",
    fontFamily: "Ownglyph, Ownglyph",
  },
};

export default EditModal;
