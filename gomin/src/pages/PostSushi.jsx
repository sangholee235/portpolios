import React, { useState, useRef, useCallback, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createSushi } from "../store/slices/sushiSlice";
import Slider from "react-slick";
import "../styles/slider.css";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import nextPage from "../assets/sounds/nextPage.mp3";
import BgmContext from "../context/BgmProvider";

import cuttle from "../assets/sushi/cuttle.webp";
import eel from "../assets/sushi/eel.webp";
import egg from "../assets/sushi/egg.webp";
import octopus from "../assets/sushi/octopus.webp";
import salmon from "../assets/sushi/salmon.webp";
import shrimp from "../assets/sushi/shrimp.webp";
import wagyu from "../assets/sushi/wagyu.webp";
import scallop from "../assets/sushi/가리비초밥.webp";
import flatfish from "../assets/sushi/광어초밥.webp";
import uni from "../assets/sushi/성게알초밥.webp";
import tuna from "../assets/sushi/참치초밥.webp";
import salmonRoe from "../assets/sushi/연어알초밥.webp";

import padlock_color from "../assets/home/padlock_color.webp";
import padlock from "../assets/home/padlock.webp";

import x from "../assets/x-twitter.png";

import CommonAlertModal from "../components/CommonAlertModal";

const styles = `
  @keyframes slideUp {
    from {
      transform: translateY(100%);
    }
    to {
      transform: translateY(0);
    }
  }

  @keyframes slideDown {
    from {
      transform: translateY(0);
    }
    to {
      transform: translateY(100%);
    }
  }

  @keyframes fadeIn {
    from {
      background-color: rgba(0,0,0,0);
    }
    to {
      background-color: rgba(0,0,0,0.6);
    }
  }

  @keyframes fadeOut {
    from {
      background-color: rgba(0,0,0,0.6);
    }
    to {
      background-color: rgba(0,0,0,0);
    }
  }
`;

const PostSushi = ({ onClose, onComplete }) => {
  const dispatch = useDispatch();
  const likesReceived = useSelector((state) => state.member.likesReceived);
  const [step, setStep] = useState(1);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [maxAnswers, setMaxAnswers] = useState(5);
  const [category, setCategory] = useState(0);
  const [sushiType, setSushiType] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [shareUrl, setShareUrl] = useState("");
  const audioRef = useRef(null);
  const [isClosing, setIsClosing] = useState(false);
  const [isConfirmPressed, setIsConfirmPressed] = useState(false);
  const [isCancelPressed, setIsCancelPressed] = useState(false);
  const isSubmittingRef = useRef(false);
  const reRender = useCallback(() => {}, []);
  const [alertModal, setAlertModal] = useState({
    isOpen: false,
    message: "",
  });
  const { isMuted } = useContext(BgmContext);

  const categoryMapping = {
    연애: 1,
    우정: 2,
    진로: 3,
    건강: 4,
    가족: 5,
    기타: 6,
  };

  const sushiImages = [
    { id: 1, src: egg, name: "계란초밥", requiredLikes: 0 },
    { id: 2, src: salmon, name: "연어초밥", requiredLikes: 1 },
    { id: 3, src: shrimp, name: "새우초밥", requiredLikes: 2 },
    { id: 4, src: cuttle, name: "한치초밥", requiredLikes: 3 },
    { id: 5, src: octopus, name: "문어초밥", requiredLikes: 6 },
    { id: 6, src: eel, name: "장어초밥", requiredLikes: 10 },
    { id: 7, src: wagyu, name: "와규초밥", requiredLikes: 15 },
    { id: 8, src: scallop, name: "가리비초밥", requiredLikes: 20 },
    { id: 9, src: flatfish, name: "광어초밥", requiredLikes: 30 },
    { id: 10, src: uni, name: "성게알초밥", requiredLikes: 50 },
    { id: 11, src: tuna, name: "참치초밥", requiredLikes: 80 },
    { id: 12, src: salmonRoe, name: "연어알초밥", requiredLikes: 100 },
  ];

  const settings = {
    className: "center",
    centerMode: true,
    infinite: true,
    centerPadding: "0vh",
    slidesToShow: 3,
    speed: 500,
    beforeChange: (current, next) => {
      setCurrentSlide(next);
      const nextSushi = sushiImages[next];
      if (likesReceived >= nextSushi.requiredLikes) {
        setSushiType(nextSushi.id);
      } else {
        setSushiType(-1);
      }
    },
    initialSlide: 0,
    swipeToSlide: true,
    slidesToScroll: 1,
    arrows: false,
  };

  const handleCategoryChange = (e) => {
    setCategory(Number(e.target.value));
  };

  const handleProgressChange = (e) => {
    setMaxAnswers(Number(e.target.value));
  };

  const handleSushiTypeChange = (sushi) => {
    if (likesReceived >= sushi.requiredLikes) {
      setSushiType(sushi.id);
    } else {
      alert(
        `이 초밥을 선택하기 위해서는 ${sushi.requiredLikes}개의 좋아요가 필요합니다.`
      );
    }
  };

  React.useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio(nextPage);
    }
  }, []);

  const showAlert = (message) => {
    setAlertModal({
      isOpen: true,
      message,
    });
  };

  const handleNext = () => {
    if (audioRef.current) {
      // 음소거 상태에 따라 볼륨 설정
      audioRef.current.volume = isMuted ? 0 : 0.5;
      audioRef.current.play();
    }
    if (!category) {
      showAlert("카테고리를 설정해주세요.");
      return;
    }
    if (sushiType === -1) {
      showAlert("사용할 수 없는 초밥입니다.");
      return;
    }
    if (!sushiType) {
      showAlert("초밥을 골라주세요.");
      return;
    }
    setStep(2);
  };

  const handleBack = () => {
    if (audioRef.current) {
      // 음소거 상태에 따라 볼륨 설정
      audioRef.current.volume = isMuted ? 0 : 0.5;
      audioRef.current.play();
    }
    setStep(1);
  };

  const handleSubmit = () => {
    if (title.length === 0 || content.length === 0) {
      showAlert("제목과 내용을 모두 입력해주세요.");
      return;
    }
    if (title.length > 30) {
      showAlert("제목은 30자 이내로 입력해주세요.");
      return;
    }
    if (content.length > 500) {
      showAlert("내용은 500자 이내로 입력해주세요.");
      return;
    }
    setShowModal(true);
  };

  const handleConfirmSubmit = async () => {
    if (isSubmittingRef.current) {
      return;
    }

    isSubmittingRef.current = true;
    reRender();

    try {
      const sushiData = {
        title,
        content,
        maxAnswers,
        category,
        sushiType,
      };

      const response = await dispatch(createSushi(sushiData));
      const { data } = response.payload;
      const { token } = data;
      const shareUrl = `share/${token}`;
      setShareUrl(shareUrl);

      setShowModal(false);
      setShowCompleteModal(true);
    } finally {
      isSubmittingRef.current = false;
      reRender();
    }
  };

  const handleCompleteClose = () => {
    setShowCompleteModal(false);
    onClose();

    onComplete?.();
  };

  const handleCancelSubmit = () => {
    setShowModal(false);
  };

  const handleCopyClipBoard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      showAlert("클립보드에 링크가 복사되었어요.");
    } catch (err) {}
  };
  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 700); // 애니메이션 지속 시간과 동일하게 설정
  };

  React.useEffect(() => {
    setSushiType(sushiImages[0].id);
  }, []);

  function useReRenderer() {
    const [, setState] = useState({});
    return useCallback(() => setState({}), []);
  }

  return (
    <>
      <style>{styles}</style>
      <div
        style={{
          ...overlayStyle,
          animation: isClosing
            ? "fadeOut 0.7s ease-out"
            : "fadeIn 0.7s ease-out",
          backgroundColor: isClosing ? "rgba(0,0,0,0)" : "rgba(0,0,0,0.6)",
        }}
      >
        <div
          style={{
            ...modalStyle,
            animation: isClosing
              ? "slideDown 0.7s ease-out"
              : "slideUp 0.7s ease-out",
          }}
        >
          <div style={orderForm}>
            <div style={orderFormHeader}>
              <div style={orderFormHeaderTop}>
                <p style={orderTitle}>
                  마음속 이야기를 적는
                  <br /> 고민 작성서
                </p>
                <button style={closeBtn} onClick={handleClose}>
                  ✖
                </button>
              </div>
              <p style={orderExplain}>
                유통기한이 임박한 초밥에는
                <br /> 마스터냥의 조언이 달릴 수 있습니다
              </p>
            </div>
            <hr style={divider} />

            <div style={orderFormBody}>
              {step === 1 ? (
                <>
                  <p style={orderSet}>질문 카테고리 설정</p>
                  <div style={radioContainer}>
                    <label style={radioBtn}>
                      <input
                        style={radioInput}
                        type="radio"
                        id="category1"
                        name="category"
                        value={categoryMapping["연애"]}
                        checked={category === categoryMapping["연애"]}
                        onChange={handleCategoryChange}
                      />
                      <span style={radioLabel}>사람 관계</span>
                    </label>
                    <label style={radioBtn}>
                      <input
                        style={radioInput}
                        type="radio"
                        id="category2"
                        name="category"
                        value={categoryMapping["우정"]}
                        checked={category === categoryMapping["우정"]}
                        onChange={handleCategoryChange}
                      />
                      <span style={radioLabel}>금전 문제</span>
                    </label>
                    <label style={radioBtn}>
                      <input
                        style={radioInput}
                        type="radio"
                        id="category3"
                        name="category"
                        value={categoryMapping["진로"]}
                        checked={category === categoryMapping["진로"]}
                        onChange={handleCategoryChange}
                      />
                      <span style={radioLabel}>건강 및 생활</span>
                    </label>
                    <label style={radioBtn}>
                      <input
                        style={radioInput}
                        type="radio"
                        id="category4"
                        name="category"
                        value={categoryMapping["건강"]}
                        checked={category === categoryMapping["건강"]}
                        onChange={handleCategoryChange}
                      />
                      <span style={radioLabel}>공부 및 진로</span>
                    </label>
                    <label style={radioBtn}>
                      <input
                        style={radioInput}
                        type="radio"
                        id="category5"
                        name="category"
                        value={categoryMapping["가족"]}
                        checked={category === categoryMapping["가족"]}
                        onChange={handleCategoryChange}
                      />
                      <span style={radioLabel}>자아실현</span>
                    </label>
                    <label style={radioBtn}>
                      <input
                        style={radioInput}
                        type="radio"
                        id="category6"
                        name="category"
                        value={categoryMapping["기타"]}
                        checked={category === categoryMapping["기타"]}
                        onChange={handleCategoryChange}
                      />
                      <span style={radioLabel}>기타</span>
                    </label>
                  </div>
                  <hr style={divider} />
                  <p style={orderSet}>인원수 설정</p>
                  <input
                    style={rangeInput}
                    type="range"
                    min="1"
                    max="10"
                    value={maxAnswers}
                    onChange={handleProgressChange}
                  />
                  <p style={presentPerson}>{maxAnswers} / 10</p>
                  <hr style={divider} />
                  <p style={orderSet}>초밥 종류 선택</p>
                  <div style={sliderContainer}>
                    <Slider {...settings}>
                      {sushiImages.map((sushi, index) => (
                        <div
                          className={`slider ${
                            currentSlide === index ? "active" : ""
                          }`}
                          key={sushi.id}
                          style={{
                            cursor:
                              likesReceived >= sushi.requiredLikes
                                ? "pointer"
                                : "not-allowed",
                            border:
                              currentSlide === index
                                ? "2px solid #FFD700"
                                : "none",
                            textAlign: "center",
                            position: "relative",
                          }}
                        >
                          <div
                            style={{
                              position: "relative",
                              display: "inline-block",
                            }}
                          >
                            <img
                              style={{
                                ...sliderSushi,
                                opacity:
                                  likesReceived >= sushi.requiredLikes
                                    ? 1
                                    : 0.5,
                              }}
                              src={sushi.src}
                              alt={sushi.name}
                            />
                            {likesReceived < sushi.requiredLikes && (
                              <div
                                style={{
                                  position: "absolute",
                                  top: "50%",
                                  left: "50%",
                                  transform: "translate(-50%, -50%)",
                                  textAlign: "center",
                                  width: "100%",
                                }}
                              >
                                {/* 흑백버전 */}
                                <img
                                  src={padlock}
                                  alt="padlock"
                                  style={{
                                    position: "relative",
                                    top: "calc( 3 * var(--custom-vh))",
                                    left: "calc( 3.2 * var(--custom-vh))",
                                    pointerEvents: "none",
                                    opacity: 0.8,
                                  }}
                                />
                                <p
                                  style={{
                                    position: "relative",
                                    margin: "0.5vh 0 0 0",
                                    top: "0.6vh",
                                    fontSize: "1.8vh",
                                    opacity: 0.5,
                                    color: "#454545",
                                  }}
                                >
                                  {sushi.requiredLikes}개의 좋아요 필요
                                </p>

                                {/* 컬러버전
                                <img
                                  src={padlock_color}
                                  alt="padlock"
                                  style={{
                                    position: "relative",
                                    top: "2vh",
                                    left: "3.2vh",
                                    width: "6vh",
                                    height: "6vh",
                                    pointerEvents: "none",
                                    opacity: 0.8,
                                  }}
                                />
                                <p
                                  style={{
                                    position: "relative",
                                    margin: "0.5vh 0 0 0",
                                    top: "2.5vh",
                                    color: "#454545",
                                    fontSize: "1.8vh",
                                    color: "red",
                                  }}
                                >
                                  {sushi.requiredLikes}개의 좋아요 필요
                                </p> */}
                              </div>
                            )}
                          </div>
                          <p
                            style={{
                              opacity:
                                likesReceived >= sushi.requiredLikes ? 1 : 0.5,
                              position: "relative",
                              justifyContent: "center",
                              top: "-5vh",
                              textAlign: "center",
                              fontSize: "1.95vh",
                              fontWeight: "bold",
                            }}
                          >
                            {sushi.name}
                          </p>
                        </div>
                      ))}
                    </Slider>
                  </div>
                  <div style={orderFormFooter}>
                    <hr style={divider} />
                    <div style={pageSelect}>
                      <button style={nextBtn} onClick={handleNext}>
                        고민작성 &gt;
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <p style={orderSet}>제목</p>
                  <hr style={divider} />
                  <textarea
                    style={titleText}
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="고민의 제목을 입력하세요 (30자 이내)"
                    maxLength={30}
                  />
                  <p style={textCounter}>{title.length} / 30</p>
                  <hr style={divider} />
                  <p style={orderSet}>내용</p>
                  <hr style={divider} />
                  <textarea
                    style={contentText}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="고민의 내용을 입력하세요 (500자 이내)"
                    maxLength={500}
                  />
                  <p style={textCounter}>{content.length} / 500</p>
                  <div style={orderFormFooter}>
                    <hr style={divider} />
                    <div style={pageSelect}>
                      <button style={backBtn} onClick={handleBack}>
                        &lt; 이전
                      </button>
                      <button style={submitBtn} onClick={handleSubmit}>
                        고민제출 &gt;
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>

            {showModal && (
              <div style={submitModalStyle}>
                <div style={submitModalContent}>
                  <p>고민을 제출하고 난 후에는 수정할 수 없습니다.</p>
                  <div style={buttonContainer}>
                    <button
                      style={{
                        ...cancelButtonStyle,
                        backgroundColor: isCancelPressed
                          ? "#67523E"
                          : "#A68564",
                        transform: isCancelPressed
                          ? "translateY(0.4vh)"
                          : "translateY(-0.2vh)",
                        boxShadow: isCancelPressed
                          ? "0 0 0 #67523E"
                          : "0 0.4vh 0 #67523E",
                      }}
                      onClick={handleCancelSubmit}
                      onMouseDown={() => setIsCancelPressed(true)}
                      onMouseUp={() => setIsCancelPressed(false)}
                      onMouseLeave={() => setIsCancelPressed(false)}
                    >
                      취소
                    </button>
                    <button
                      style={{
                        ...confirmButtonStyle,
                        backgroundColor: isConfirmPressed
                          ? "#863334"
                          : "#C85253",

                        transform: isConfirmPressed
                          ? "translateY(0.4vh)"
                          : "translateY(-0.2vh)",
                        boxShadow: isConfirmPressed
                          ? "0 0 0 #863334"
                          : "0 0.4vh 0 #863334",
                      }}
                      onClick={handleConfirmSubmit}
                      onMouseDown={() => setIsConfirmPressed(true)}
                      onMouseUp={() => setIsConfirmPressed(false)}
                      onMouseLeave={() => setIsConfirmPressed(false)}
                    >
                      확인
                    </button>
                  </div>
                </div>
              </div>
            )}

            {showCompleteModal && (
              <div style={submitModalStyle}>
                <div style={submitModalContent}>
                  <p>제출이 완료되었습니다!</p>

                  <button
                    style={{
                      ...confirmButtonStyle,
                      backgroundColor: isCancelPressed ? "#67523E" : "#A68564",
                      transform: isCancelPressed
                        ? "translateY(0.4vh)"
                        : "translateY(-0.2vh)",
                      boxShadow: isCancelPressed
                        ? "0 0 0 #67523E"
                        : "0 0.4vh 0 #67523E",
                    }}
                    onClick={handleCompleteClose}
                    onMouseDown={() => setIsCancelPressed(true)}
                    onMouseUp={() => setIsCancelPressed(false)}
                    onMouseLeave={() => setIsCancelPressed(false)}
                  >
                    확인
                  </button>

                  <p>공유하기</p>

                  <div style={buttonContainer}>
                    {/* 링크복사 아이콘 */}
                    <i
                      className="fas fa-link"
                      onClick={() =>
                        handleCopyClipBoard(
                          `${window.location.origin}/${shareUrl}`
                        )
                      }
                      style={iconStyleR}
                    ></i>

                    {/* 카카오톡 공유 아이콘 */}
                    <button
                      style={iconButtonStyle}
                      onClick={() => {
                        if (!window.Kakao.isInitialized()) {
                          window.Kakao.init(
                            import.meta.env.VITE_KAKAO_JAVASCRIPT_ID
                          );
                        }

                        window.Kakao.Link.sendCustom({
                          templateId: 117216, // 본인 템플릿 ID
                          templateArgs: {
                            url: shareUrl,
                          },
                        });
                      }}
                    >
                      <img
                        src="https://developers.kakao.com/assets/img/about/logos/kakaotalksharing/kakaotalk_sharing_btn_medium.png"
                        alt="카카오톡 아이콘"
                        style={iconStyleK}
                      />
                    </button>

                    {/* 페이스북 공유 아이콘 */}
                    <button
                      style={iconButtonStyle}
                      onClick={() => {
                        window.open(
                          `https://www.facebook.com/sharer/sharer.php?u=${window.location.origin}/${shareUrl}`,
                          "_blank"
                        );
                      }}
                    >
                      <i
                        className="fa-brands fa-facebook-f"
                        style={iconStyleF}
                      ></i>
                    </button>

                    {/* X (구 트위터) 공유 아이콘 */}
                    <a
                      href={`https://x.com/intent/tweet?text=Check%20out%20this%20sushi%20post!&url=${window.location.origin}/${shareUrl}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={iconButtonStyle}
                    >
                      <img src={x} alt="X (Twitter) Icon" style={iconStyleX} />
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 공통 알림 모달 */}
      <CommonAlertModal
        isOpen={alertModal.isOpen}
        onClose={() => setAlertModal({ isOpen: false, message: "" })}
        message={alertModal.message}
      />
    </>
  );
};

// 스타일 객체들
const overlayStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  backgroundColor: "rgba(0,0,0,0.6)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

const modalStyle = {
  position: "relative",
  height: "calc( 75 * var(--custom-vh))",
  width: "calc( 50 * var(--custom-vh))",
  animation: "slideUp 0.7s ease-out", // 아래에서 위로 슬라이드 애니메이션으로 변경
};

const orderForm = {
  backgroundColor: "#F4F4F4",
  border: "solid 0.3rem #454545",
  height: "100%",
};

const orderFormHeader = {
  height: "20%",
};

const orderFormHeaderTop = {
  display: "flex",
  justifyContent: "space-between",
  height: "70%",
};

const orderTitle = {
  margin: "0",
  padding: "2vh",
  letterSpacing: "0.1vh",
  fontSize: "4vh",
  color: "#454545",
};

const closeBtn = {
  position: "relative",
  width: "7vh",
  height: "7vh",
  border: "none",
  backgroundColor: "transparent",
  color: "#454545",
  fontSize: "2.5vh",
  cursor: "pointer",
  fontWeight: "bold",
};

const orderExplain = {
  margin: "0",
  height: "30%",
  paddingRight: "1vh",
  fontSize: "1.7vh",
  textAlign: "right",
  color: "#454545",
};

const orderFormBody = {
  height: "80%",
  position: "relative",
  display: "flex",
  flexDirection: "column",
};

const divider = {
  margin: "0",
  border: "solid 0.1rem #454545",
};

const orderSet = {
  height: "4%",
  margin: "0",
  marginBlockStart: "0",
  marginBlockEnd: "0",
  padding: "1vh",
  fontSize: "2.3vh",
  color: "#454545",
};

const radioContainer = {
  height: "10%",
  marginTop: "2%",
  marginLeft: "2%",
  marginBottom: "2%",
  display: "grid",
  gridTemplateColumns: "repeat(3, 1fr)",
  gap: "1%",
  accentColor: "black",
  fontSize: "1.95vh",
  color: "#454545",
};

const radioBtn = {
  position: "relative",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
};

const radioInput = {
  position: "relative",
  height: "calc( 1.6 * var(--custom-vh))",
  width: "calc( 1.6 * var(--custom-vh))",
  margin: "0",
  marginRight: "5%",
};

const radioLabel = {
  position: "relative",
  margin: "0",
  marginRight: "auto",
  height: "fit-content",
  width: "fit-content",
};

const rangeInput = {
  position: "relative",
  marginTop: "2%",
  height: "5%",
  width: "96%",
  display: "block",
  margin: "0 auto",
  accentColor: "#454545",
};

const presentPerson = {
  height: "4%",
  margin: "0",
  marginTop: "2%",
  marginBottom: "2%",
  paddingRight: "1vh",
  textAlign: "right",
  fontSize: "1.95vh",
  color: "#454545",
};

const sliderContainer = {
  position: "relative",
  height: "43%",
  width: "100%",
  color: "#454545",
};

const sliderSushi = {
  position: "relative",
  display: "block",
  margin: "0 auto",
  height: "100%",
  pointerEvents: "none",
};

const orderFormFooter = {
  position: "relative",
  height: "fit-content",
  width: "100%",
  marginTop: "auto",
};

const pageSelect = {
  position: "relative",
  display: "flex",
  height: "auto",
  padding: "0.5vh",
  paddingTop: "0.7vh",
  paddingBottom: "0.7vh",
};

const nextBtn = {
  marginLeft: "auto",
  border: "0",
  backgroundColor: "transparent",
  cursor: "pointer",
  fontFamily: "Ownglyph, Ownglyph",
  fontSize: "3vh",
  color: "#454545",
  height: "fit-content",
};

const backBtn = {
  border: "0",
  backgroundColor: "transparent",
  cursor: "pointer",
  fontFamily: "Ownglyph, Ownglyph",
  fontSize: "3vh",
  color: "#454545",
  height: "fit-content",
};

const submitBtn = {
  marginLeft: "auto",
  border: "0",
  backgroundColor: "transparent",
  cursor: "pointer",
  fontFamily: "Ownglyph, Ownglyph",
  fontSize: "3vh",
  color: "#454545",
};

const titleText = {
  position: "relative",
  backgroundColor: "transparent",
  border: 0,
  outline: "none",
  resize: "none",
  scrollbarWidth: "none",
  msOverflowStyle: "none",
  padding: "1vh",
  width: "100%",
  height: "7%",
  fontFamily: "Ownglyph, Ownglyph",
  fontSize: "2.3vh",
  boxSizing: "border-box",
  color: "#454545",
};

const contentText = {
  position: "relative",
  backgroundColor: "transparent",
  border: 0,
  outline: "none",
  resize: "none",
  scrollbarWidth: "none",
  msOverflowStyle: "none",
  padding: "1vh",
  height: "69%",
  width: "100%",
  fontFamily: "Ownglyph, Ownglyph",
  fontSize: "2.3vh",
  boxSizing: "border-box",
  color: "#454545",
};

const submitModalStyle = {
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
  transition: "opacity 0.2s ease-in-out",
};

const submitModalContent = {
  backgroundColor: "#fdf5e6",
  padding: "4%",
  borderRadius: "2vh",
  height: "fit-content",
  width: "calc( 50 * var(--custom-vh))",
  position: "relative",
  textAlign: "center",
  border: "1vh solid #906C48",
  outline: "0.3vh solid #67523E",
  fontSize: "2.3vh",
  boxSizing: "border-box",
};

const buttonContainer = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  width: "100%",
  marginTop: "3vh",
  marginBottom: "1vh",
  gap: "2vh",
};

const iconButtonStyle = {
  background: "none",
  border: "none",
  padding: 0,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

const iconStyleR = {
  fontSize: "1em",
  backgroundColor: "#5B9253",
  color: "#ffffff",
  width: "40px",
  height: "40px",
  borderRadius: "15%",
  lineHeight: "40px",
  display: "inline-block",
  textAlign: "center",
  transition: "background-color 0.3s ease-in-out",
  verticalAlign: "middle", // 수직 정렬 맞추기
};

const iconStyleK = {
  fontSize: "3.2em", // 아이콘 크기 일관성 (조금 작게 조정)
  width: "40px", // 동일한 크기로 지정
  height: "40px", // 동일한 크기로 지정
  display: "inline-block",
  verticalAlign: "middle", // 수직 정렬 맞추기
};

const iconStyleF = {
  fontSize: "2em",
  backgroundColor: "#3b5998",
  color: "#ffffff",
  width: "40px",
  height: "40px",
  borderRadius: "15%",
  lineHeight: "40px",
  display: "inline-block",
  textAlign: "center",
  transition: "background-color 0.3s ease-in-out",
  verticalAlign: "middle", // 수직 정렬 맞추기
};

const iconStyleX = {
  color: "#3b5998", // 아이콘 색상
  width: "47px", // 동일한 크기로 지정
  height: "47px", // 동일한 크기로 지정
  display: "inline-block",
  verticalAlign: "middle", // 수직 정렬 맞추기
};

const confirmButtonStyle = {
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
};

const cancelButtonStyle = {
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
};

const textCounter = {
  position: "relative",
  height: "3%",
  bottom: "0",
  margin: "0",
  padding: "0.5vh",
  textAlign: "right",
  fontSize: "1.8vh",
  color: "#454545",
};

export default PostSushi;
