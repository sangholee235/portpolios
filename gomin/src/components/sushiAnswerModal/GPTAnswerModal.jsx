import React from "react";
import postItBlue from "../../assets/postIt/postIt3.webp";

import masterFace from "../../assets/answerDetail/master-face.webp";
import PawPrintIcon from "../../components/icons/PawPrintIcon";

import { modalStyles, postItImages } from "./styles/modalStyles";

const GPTAnswerModal = ({ isOpen, onClose, answer }) => {
  if (!isOpen || !answer) return null;

  return (
    <div style={modalStyles.overlay} onClick={onClose}>
      <div style={modalStyles.postOuterBox}>
        <div style={modalStyles.postIt} onClick={(e) => e.stopPropagation()}>
          <img
            src={postItImages[answer.postItColor]}
            alt="PostIt"
            style={modalStyles.postItImage}
          />
          <div style={modalStyles.closeButton} onClick={onClose}>
            ✖
          </div>

          <div style={modalStyles.gptHeader}>
            <span style={modalStyles.gptHeaderTitle}>마스터냥의 쪽지</span>
          </div>

          <div style={modalStyles.content}>{answer.content}</div>
          <img
            src={masterFace}
            alt="Master"
            style={modalStyles.gptMasterIcon}
          />
        </div>
      </div>
    </div>
  );
};

export default GPTAnswerModal;
