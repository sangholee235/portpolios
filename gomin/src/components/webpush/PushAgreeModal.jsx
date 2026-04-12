import React from "react";
import { useNotification } from "../../hooks/useNotification";
import CommonConfirmModal from "./CommonConfirmModal";

const PushAgreeModal = ({ isOpen, onClose }) => {
  const { requestPermission } = useNotification();

  const handlePermission = async () => {
    const result = await requestPermission();
    if (result === "granted") {
      console.log("알림 권한 허용됨");
    } else if (result === "denied") {
      alert("알림이 차단되었습니다. 브라우저 설정에서 변경 가능합니다.");
    } else {
      console.log("사용자가 결정을 보류함:", result);
    }
    onClose();
  };

  return (
    <CommonConfirmModal
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={handlePermission}
      message="알림을 허용하면 창을 닫아도 초밥 마감 & 좋아요 획득 소식을 받을 수 있어요!"
    />
  );
};

export default PushAgreeModal;
