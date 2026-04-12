import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSushiDetail } from "../store/slices/sushiSlice";
import { createAnswer } from "../store/slices/answerSlice";

const SushiView = ({ isOpen, onClose, onSubmitResult, sushiId, category }) => {
  const [sushiData, setSushiData] = useState(null);
  const [content, setContent] = useState("");
  const [showAnswerInput, setShowAnswerInput] = useState(false);
  const [titleShadowColor, setTitleShadowColor] = useState(
    "rgba(255, 255, 255, 0.4)"
  );
  const [showTopFade, setShowTopFade] = useState(false);
  const [showBottomFade, setShowBottomFade] = useState(true);
  const [opacity, setOpacity] = useState(0);
  const contentRef = useRef(null);

  const dispatch = useDispatch();
  const currentSushi = useSelector((state) => state.sushi.currentSushi);

  const titleShadowColors = {
    1: "rgba(255, 0, 0, 0.4)",
    2: "rgba(255, 255, 0, 0.4)",
    3: "rgba(83, 178, 0, 0.4)",
    4: "rgba(0, 179, 255, 0.4)",
    5: "rgba(183, 6, 227, 0.4)",
    6: "rgba(157, 157, 157, 0.4)",
  };

  useEffect(() => {
    if (isOpen) {
      setOpacity(0);
      setTimeout(() => setOpacity(1), 50);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && sushiId) {
      dispatch(fetchSushiDetail(sushiId))
        .unwrap()
        .catch(() => handleClose());
    }
  }, [dispatch, sushiId, isOpen]);

  useEffect(() => {
    setTitleShadowColor(
      titleShadowColors[category] || "rgba(255, 255, 255, 0.4)"
    );
  }, [category]);

  useEffect(() => {
    if (currentSushi) {
      setSushiData({
        sushiId: currentSushi.sushiId,
        title: currentSushi.title,
        content: currentSushi.content,
        plateType: `${category}`,
        sushiType: currentSushi.sushiType,
        maxAnswers: currentSushi.maxAnswers,
        remainingAnswers: currentSushi.remainingAnswers,
        expirationTime: currentSushi.expirationTime,
      });
    }
  }, [currentSushi, category]);

  const handleScroll = () => {
    if (!contentRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = contentRef.current;
    const isScrollable = scrollHeight > clientHeight;
    if (isScrollable) {
      setShowTopFade(scrollTop > 10);
      setShowBottomFade(scrollTop < scrollHeight - clientHeight - 10);
    } else {
      setShowTopFade(false);
      setShowBottomFade(false);
    }
  };

  useEffect(() => {
    const contentElement = contentRef.current;
    if (contentElement) {
      contentElement.addEventListener("scroll", handleScroll);
      handleScroll();
    }
    return () => contentElement?.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.style.overflow = "auto";
      contentRef.current.style.scrollbarWidth = "none";
      contentRef.current.style.msOverflowStyle = "none";
    }
  }, []);

  const handleOpenAnswerInput = () => setShowAnswerInput(true);

  const isWebView = () => {
    const ua = navigator.userAgent;
    const isIOS = /iPad|iPhone|iPod/.test(ua) && !window.MSStream;
    const isAndroid = /Android/.test(ua);
    const isWKWebView = window.webkit && window.webkit.messageHandlers;
    const isIOSWebView = /(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/i.test(
      ua
    );
    return (
      (isIOS && (isWKWebView || isIOSWebView)) || (isAndroid && /wv/.test(ua))
    );
  };

  const handleSubmit = async () => {
    try {
      await dispatch(
        createAnswer({ sushiId: sushiData.sushiId, content })
      ).unwrap();
      setShowAnswerInput(false);
      setContent("");
      onSubmitResult({ status: "success", isWebView: isWebView() });
      onClose();
    } catch (error) {
      if (error.error?.code === "R005") {
        onSubmitResult({ status: "R005" });
        onClose();
      } else {
        onSubmitResult({
          status: "error",
          message: error.message || "알 수 없는 오류",
        });
      }
    }
  };

  const handleClose = () => {
    setOpacity(0);
    setTimeout(() => {
      setShowAnswerInput(false);
      setSushiData({
        sushiId: "",
        title: "",
        content: "",
        plateType: "",
        sushiType: "",
        maxAnswers: "",
        remainingAnswers: "",
        expirationTime: "",
      });
      onClose();
    }, 300);
  };

  const handleBack = () => {
    showAnswerInput ? setShowAnswerInput(false) : handleClose();
  };

  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      .content::-webkit-scrollbar { display: none; }
      .content { scrollbar-width: none; }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  if (!isOpen) return null;

  return (
    <div
      style={{
        ...styles.modalOverlay,
        opacity,
        transition: "opacity 0.3s ease-in-out",
      }}
    >
      <div
        style={{
          ...styles.modalContent,
          opacity,
          transform: `translateY(${20 - opacity * 20}px)`,
          transition: "opacity 0.3s ease-in-out, transform 0.3s ease-in-out",
        }}
      >
        <div style={styles.container}>
          <div style={styles.buttonRow}>
            <div
              style={{
                width: "calc(3 * var(--custom-vh))",
                cursor: "pointer",
                fontSize: "calc(2.5 * var(--custom-vh))",
              }}
              onClick={handleBack}
            >
              {" <"}
            </div>
            <div
              style={{
                width: "calc(3 * var(--custom-vh))",
                cursor: "pointer",
                fontSize: "calc(2.5 * var(--custom-vh))",
              }}
              onClick={handleClose}
            >
              {" X "}
            </div>
          </div>
          {!showAnswerInput ? (
            <>
              <h3
                style={{
                  ...styles.title,
                  boxShadow: `0 calc(0.5 * var(--custom-vh)) 0px ${titleShadowColor}`,
                  fontSize: "calc(3 * var(--custom-vh))",
                  height: "auto",
                  minHeight: "calc(3 * var(--custom-vh))",
                  lineHeight: "calc(4 * var(--custom-vh))",
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                }}
              >
                {sushiData?.title}
              </h3>
              <div style={styles.contentContainer}>
                <div style={styles.contentWrapper}>
                  {showTopFade && <div style={styles.fadeIn} />}
                  <div
                    ref={contentRef}
                    style={styles.content}
                    onScroll={handleScroll}
                  >
                    <p style={styles.text}>{sushiData?.content}</p>
                  </div>
                  {showBottomFade && <div style={styles.fadeOut} />}
                </div>
              </div>
            </>
          ) : (
            <>
              <h3
                style={{
                  ...styles.title,
                  boxShadow: `0 calc(0.5 * var(--custom-vh)) 0px ${titleShadowColor}`,
                }}
              >
                {sushiData?.title}
              </h3>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="고민에 대한 의견을 나눠주세요"
                maxLength={500}
                style={styles.textarea}
              />
              <div style={styles.charCount}>{content.length} / 500</div>
            </>
          )}
          {!showAnswerInput ? (
            <button onClick={handleOpenAnswerInput} style={styles.button}>
              답변 작성
            </button>
          ) : (
            <button onClick={handleSubmit} style={styles.button}>
              제출하기
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const styles = {
  buttonRow: {
    display: "flex",
    justifyContent: "space-between",
    width: "100%",
    height: "calc( 3 * var(--custom-vh))",
    padding: "calc( 0.3 * var(--custom-vh))",
  },
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  modalContent: {
    position: "relative",
    top: "calc( 6 * var(--custom-vh))",
    height: "calc( 80 * var(--custom-vh))",
    width: "calc( 46 * var(--custom-vh))",
  },
  container: {
    width: "100%",
    height: "calc( 70 * var(--custom-vh))",
    background: "#FFFEEC",
    border: "1vh #906C48 solid",
    position: "relative",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "2vh",
    boxSizing: "border-box",
    borderRadius: "1vh",
    overflow: "hidden",
  },
  title: {
    display: "inline-block",
    margin: "0 calc( 2 * var(--custom-vh)) calc( 1 * var(--custom-vh))",
    padding: "0 calc( 2 * var(--custom-vh))",
    fontWeight: "bold",
    color: "#5D4A37",
  },
  contentContainer: {
    position: "relative",
    width: "90%",
    flex: 1,
    overflow: "hidden",
  },
  contentWrapper: {
    position: "relative",
    height: "97%",
    overflow: "hidden",
  },
  content: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflowY: "scroll",
    // margin: "calc( 2 * var(--custom-vh))",
    scrollbarWidth: "none",
    msOverflowStyle: "none",
  },
  text: {
    margin: "3vh 0",
    fontSize: "calc( 2.2 * var(--custom-vh))",
    lineHeight: "1.3",
    wordBreak: "break-word",
  },
  fadeIn: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "calc( 5 * var(--custom-vh))",
    background:
      "linear-gradient(to top, rgba(255, 254, 236, 0), rgba(255, 254, 236, 1))",
    pointerEvents: "none",
    zIndex: 1,
  },
  fadeOut: {
    position: "absolute",
    bottom: "0",
    left: 0,
    right: 0,
    height: "calc( 5 * var(--custom-vh))",
    background:
      "linear-gradient(to bottom, rgba(255, 254, 236, 0), rgba(255, 254, 236, 1))",
    pointerEvents: "none",
    zIndex: 1,
  },
  textarea: {
    width: "calc( 35 * var(--custom-vh))",
    height: "calc( 900 * var(--custom-vh))",
    padding: "calc( 1.2 * var(--custom-vh))",
    marginTop: "calc( 1.5 * var(--custom-vh))",
    borderRadius: "calc( 1 * var(--custom-vh))",
    border: "0.5vh solid #B2975C",
    fontFamily: "inherit",
    fontSize: "calc( 2 * var(--custom-vh))",
    lineHeight: "1.5",
    resize: "none",
    boxSizing: "border-box",
  },
  charCount: {
    fontSize: "calc( 1.5 * var(--custom-vh))",
    textAlign: "right",
    padding: "0.5vh",
  },
  button: {
    border: "none",
    borderRadius: "1vh",
    backgroundColor: "#B2975C",
    color: "#5D4A37",
    fontSize: "calc( 2 * var(--custom-vh))",
    padding: "calc( 1 * var(--custom-vh)) calc( 2 * var(--custom-vh))",
    height: "calc(4 * var(--custom-vh))",
    margin: "0",
    cursor: "pointer",
    transition: "background-color 0.3s",
    fontFamily: "inherit",
  },
  loading: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "calc( 100 * var(--custom-vh))",
    fontSize: "2vh",
    color: "#5D4A37",
  },
};

export default SushiView;
