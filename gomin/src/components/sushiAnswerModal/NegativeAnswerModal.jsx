import React, { useState } from "react";
import { modalStyles } from "./styles/modalStyles";

const NegativeAnswerModal = ({ isOpen, onClose, onConfirm }) => {
  const [isOpenPressed, setIsOpenPressed] = useState(false);
  const [isCancelPressed, setIsCancelPressed] = useState(false);

  if (!isOpen) return null;

  return (
    <div style={modalStyles.overlay}>
      <div style={modalStyles.negativeInnerBox}>
        <div style={modalStyles.warningContent}>
          <p>
            부적절한 내용을 포함할 수 있습니다.
            <br /> 열어보시겠습니까?
          </p>
        </div>
        <div style={modalStyles.buttonBox}>
          <button
            onClick={onClose}
            onMouseDown={() => setIsCancelPressed(true)}
            onMouseUp={() => setIsCancelPressed(false)}
            onMouseLeave={() => setIsCancelPressed(false)}
            style={{
              ...modalStyles.button,
              backgroundColor: isCancelPressed ? "#67523E" : "#A68564",
              transform: isCancelPressed
                ? "translateY(calc(0.4 * var(--custom-vh)))"
                : "translateY(calc(-0.2 * var(--custom-vh))vh)",
              boxShadow: isCancelPressed
                ? "0 0 0 #67523E"
                : "0 0.4vh 0 #67523E",
            }}
          >
            아니요
          </button>
          <button
            onClick={onConfirm}
            onMouseDown={() => setIsOpenPressed(true)}
            onMouseUp={() => setIsOpenPressed(false)}
            onMouseLeave={() => setIsOpenPressed(false)}
            style={{
              ...modalStyles.button,
              backgroundColor: isOpenPressed ? "#863334" : "#C85253",
              transform: isOpenPressed
                ? "translateY(calc(0.4 * var(--custom-vh)))"
                : "translateY(calc(-0.2 * var(--custom-vh)))",
              boxShadow: isOpenPressed ? "0 0 0 #863334" : "0 0.4vh 0 #863334",
            }}
          >
            네
          </button>
        </div>
      </div>
    </div>
  );
};

export default NegativeAnswerModal;
