import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  fetchNotifications,
  markAsRead,
  fetchUnreadExists,
  markAsReadAll,
} from "../store/slices/notificationSlice";

import EXP from "../assets/Notification/EXP.webp"; // 유통기한 마감
import ANS_END from "../assets/Notification/ANS_END.webp"; // 답변 마감
import ANS_LIKE from "../assets/Notification/ANS_LIKE.webp"; // 답변 좋아요
import directionIcon from "../assets/direction.svg";  // 상단에 추가

const NotificationModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const { notifications, status } = useSelector((state) => state.notification);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShow(true);
      dispatch(fetchNotifications({ page: 1, size: 10 }));
      dispatch(fetchUnreadExists());
    } else {
      setShow(false);
    }
  }, [isOpen, dispatch]);

  const handleNotificationClick = (notification) => {
    dispatch(markAsRead(notification.notificationId));
    if (notification.redirectUrl) {
      window.location.href = notification.redirectUrl;
    }
    onClose();
  };

  const readAllNotification = () => {
    dispatch(markAsReadAll()).then(() => {
      // 알림 전체 읽기를 완료한 후 notifications 비우기
      dispatch(fetchNotifications({ page: 1, size: 10 }));
      // 읽지 않은 알림 존재 여부 dispatch
      dispatch(fetchUnreadExists());
    });
  };

  // notification type 이미지
  const getNotificationImage = (type) => {
    switch (type) {
      case 1:
        return EXP;
      case 2:
        return ANS_END;
      case 3:
        return ANS_LIKE;
      default:
        return EXP;
    }
  };

  const truncateTitle = (title) => {
    if (!title) return "";
    return title.length > 15 ? `[${title.slice(0, 30)}...]` : `[${title}]`;
  };

  const scrollToTop = () => {
    const container = document.querySelector('.notification-container');
    if (container) {
      container.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  };

  if (!isOpen && !show) return null;

  return (
    <div style={{ ...styles.overlay, opacity: show ? 1 : 0 }}>
      <div
        style={{ ...styles.modal, transform: show ? "scale(1)" : "scale(0.9)" }}
      >
        <div style={styles.outerBox}>
          <div style={styles.innerBox}>알림</div>
          <button style={styles.cancelButton} onClick={onClose}>
            ✖
          </button>
        </div>
        {notifications.length > 0 && (
          <button style={styles.readAllButton} onClick={readAllNotification}>
            ✓ 모두 읽음
          </button>
        )}
        <div className="notification-container" style={styles.notificationContainer}>
          {status === "loading" ? (
            <p style={styles.emptyText}>로딩 중...</p>
          ) : notifications.length > 0 ? (
            <>
              <ul style={styles.list}>
                {notifications.map((notification) => (
                  <li
                    key={notification.notificationId}
                    style={styles.listItem}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <div style={styles.outerContainer}>
                      <div style={styles.middleContainer}>
                        <div style={styles.innerContainer}>
                          <div style={styles.notificationImage}>
                            <img
                              src={getNotificationImage(
                                notification.notificationType
                              )}
                              alt="알림 이미지"
                              style={styles.image}
                            />
                          </div>

                          <div style={styles.textContainer}>
                            <div style={styles.title}>{notification.message}</div>
                            <div style={styles.contentText}>
                              {notification.sushi?.title ? truncateTitle(notification.sushi.title) : ""}
                            </div>
                            <div style={styles.time}>
                              {new Date(notification.createdAt).toLocaleString()}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
              <button onClick={scrollToTop} style={styles.scrollTopButton}>
                <img
                  src={directionIcon}
                  alt="위로 가기"
                  style={{
                    width: "2vh",
                    height: "2vh",
                    filter: "brightness(0) invert(1)",
                  }}
                />
              </button>
            </>
          ) : (
            <p style={styles.emptyText}>알림이 없습니다.</p>
          )}
        </div>
      </div>
    </div>
  );
};

const styles = {
  /* 오버레이 스타일 */
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
    zIndex: 1000,
    transition: "opacity 0.3s ease",
  },
  /* 모달 스타일 */
  modal: {
    top: "6vh",
    width: "calc( 50 * var(--custom-vh))",
    height: "60%",
    padding: "2.5vh",
    paddingTop: "1vh",
    backgroundColor: "#FFFAF0",
    border: "1vh solid #906C48",
    borderRadius: "1.3vh",
    outline: "0.25vh solid #67523E",
    overflowY: "hidden",
    boxSizing: "border-box",
    scrollbarWidth: "none",
    transition: "transform 0.3s ease",
    display: "flex",
    flexDirection: "column"
  },
  /* '알림' 외부 박스 */
  outerBox: {
    width: "70%",
    minWidth: "20vh",
    height: "13%",
    margin: "0 auto 3vh auto",
    marginTop: "1.5vh",
    border: "0.4vh solid #8B6B3E",
    borderRadius: "1vh",
    backgroundColor: "#B2975C",
    padding: "0.7vh",
    boxSizing: "border-box",
  },
  /* '알림' 내부 박스 */
  innerBox: {
    width: "100%",
    height: "100%",
    border: "0.3vh solid #906C48",
    borderRadius: "0.5vh",
    backgroundColor: "#B2975C",
    textAlign: "center",
    color: "#5D4A37",
    fontSize: "2.6vh",
    fontWeight: "bold",
    padding: "0.8vh 0",
    boxSizing: "border-box",
  },
  /* 알림 목록 스타일 */
  list: {
    listStyle: "none",
    padding: 0,
    width: "100%",
    flex: 1,
  },
  /* 알림 아이템 컨테이너 */
  listItem: {
    display: "flex",
    justifyContent: "center",
    width: "100%",
    marginBottom: `calc(1 * var(--custom-vh))`,
  },
  /* 알림 아이템 외부 컨테이너 */
  outerContainer: {
    position: "relative",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "90%",
    margin: "0 auto",
    padding: `calc(0.7 * var(--custom-vh)) 0`,
    boxSizing: "border-box",
    border: `calc(0.2 * var(--custom-vh)) solid #D4C5B1`,
    backgroundColor: "#FFFEFA",
    marginBottom: 0,
  },
  /* 알림 아이템 중간 컨테이너 */
  middleContainer: {
    width: `calc(50 * var(--custom-vh))`,
    padding: `calc(1 * var(--custom-vh)) calc(2 * var(--custom-vh))`,
    boxSizing: "border-box",
    backgroundColor: "#FFFEFA",
  },
  /* 알림 아이템 내부 컨테이너 */
  innerContainer: {
    position: "relative",
    width: "100%",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFEFA",
  },
  /* 알림 이미지 컨테이너 */
  notificationImage: {
    width: `calc(9.2 * var(--custom-vh))`,
    height: `calc(9.2 * var(--custom-vh))`,
    marginRight: `calc(2 * var(--custom-vh))`,
    borderRadius: `calc(1 * var(--custom-vh))`,
    objectFit: "cover",
  },
  /* 알림 이미지 */
  image: {
    border: `calc(0.1 * var(--custom-vh)) solid #999999`,
    width: "100%",
    height: "100%",
  },
  /* 알림 텍스트 */
  textContainer: {
    flex: 1,
  },
  /* 알림 메시지 스타일 */
  title: {
    fontSize: `calc(2.2 * var(--custom-vh))`,
    fontWeight: "bold",
    color: "#5A4628",
    marginBottom: `calc(1 * var(--custom-vh))`,
    display: "-webkit-box",
    WebkitLineClamp: 2, // 최대 2줄까지 표시
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  /* 초밥 제목 스타일 */
  contentText: {
    fontSize: `calc(1.8 * var(--custom-vh))`,
    color: "#8D7B7B",
    lineHeight: "1.4",
    marginBottom: `calc(0.5 * var(--custom-vh))`,
  },
  /* 알림 시간 */
  time: {
    fontSize: `calc(1.5 * var(--custom-vh))`,
    color: "#666",
  },
  /* 알림없을때 */
  emptyText: {
    textAlign: "center",
    color: "#666",
    padding: `calc(2 * var(--custom-vh))`,
  },
  /* 모두 읽음 버튼 */
  readAllButton: {
    position: "absolute",
    top: "10vh",
    right: "8.0%",
    padding: "0.6vh 1.2vh",
    backgroundColor: "transparent",
    color: "#67523E",
    border: "none",
    cursor: "pointer",
    fontSize: "1.8vh",
    fontFamily: "Ownglyph, Ownglyph",
    transition: "all 0.2s ease",
    display: "flex",
    alignItems: "center",
    gap: "0.5vh",
    opacity: 0.8,
    zIndex: 10,
    minWidth: "20px",
    height: "3vh",
  },
  /* 닫기 버튼 */
  cancelButton: {
    position: "absolute",
    top: "1.2vh",
    right: "2%",
    padding: "0.6vh 1.2vh",
    border: "none",
    backgroundColor: "transparent",
    color: "#67523E",
    fontSize: "2.5vh",
    cursor: "pointer",
    fontWeight: "bold",
    zIndex: 10,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "3vh",
    height: "3vh",
    minWidth: "20px",
    minHeight: "20px",
  },
  notificationContainer: {
    flex: 1,
    overflowY: 'auto',
    paddingRight: '1vh',
    marginTop: '2vh',
    marginBottom: '2vh',
    display: 'flex',
    flexDirection: 'column',
    '&::-webkit-scrollbar': {  // 웹킷 기반 브라우저용
      display: 'none'
    },
    scrollbarWidth: 'none',    // 파이어폭스용
    msOverflowStyle: 'none',   // IE용
  },
  scrollTopButton: {
    width: "4vh",
    height: "4vh",
    margin: "1vh auto",
    marginTop: "2vh",
    display: "flex",           // block에서 flex로 변경
    alignItems: "center",      // 추가
    justifyContent: "center",    // 추가
    backgroundColor: "#B2975C",
    border: "none",
    borderRadius: "50%",
    color: "#FFFEFA",
    cursor: "pointer",
    flexShrink: 0,
  },
};

export default NotificationModal;
