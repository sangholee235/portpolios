import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sushi from "./Sushi";

const SushiCard = ({
  id,
  title,
  content,
  category,
  sushiType,
  showHeart = false,
  remainingAnswers,
  maxAnswers,
  isClosed,
  expirationTime,
}) => {
  const navigate = useNavigate();
  const [remainingTime, setRemainingTime] = useState(0);

  useEffect(() => {
    const expirationDate = new Date(expirationTime).getTime();

    const intervalId = setInterval(() => {
      const currentTime = new Date().getTime();
      const timeLeft = expirationDate - currentTime;

      if (timeLeft <= 0) {
        clearInterval(intervalId);
        setRemainingTime(0);
      } else {
        setRemainingTime(Math.floor(timeLeft / 1000)); // 소수점 버리고 초 단위로
      }
    }, 1000);

    return () => clearInterval(intervalId); // 컴포넌트가 언마운트되면 인터벌 정리
  }, [expirationTime]);

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours}h ${minutes}m ${secs}s`;
  };

  const handleClick = () => {
    if (!id) {
      console.log("sushiId가 존재하지 않습니다.", { id });
      return;
    }
    navigate(`/sushidetail/${id}`);
  };

  return (
    <div style={outerContainerStyle} onClick={handleClick}>
      <div style={middleContainerStyle}>
        <div style={innerContainerStyle}>
          {showHeart && <span style={heartIconStyle}>❤️</span>}

          <div style={sushiOuterImageStyle}>
            <div style={sushiImageStyle}>
              <Sushi sushiId={id} category={category} sushiType={sushiType} />
            </div>
            {!isClosed ? (
              <>
                <div style={remainingAnswersStyle}>
                  {maxAnswers - remainingAnswers}/{maxAnswers}
                </div>
                {remainingTime <= 10800 && remainingTime > 0 && (
                  <div style={remainingTimeStyle}>마감 임박!</div>
                )}
              </>
            ) : (
              <>
                <div style={remainingAnswersStyle}>
                  {maxAnswers - remainingAnswers}
                </div>
                <div style={soldoutStyle}>SOLD OUT</div>
              </>
            )}
          </div>

          <div style={textContainerStyle}>
            <div style={titleStyle}>{title}</div>
            <hr style={dividerStyle} />
            <div style={contentStyle}>{content}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

const heartIconStyle = {
  position: "absolute",
  top: `calc(0.8 * var(--custom-vh))`,
  right: `calc(0.8 * var(--custom-vh))`,
  fontSize: `calc(1.3 * var(--custom-vh))`,
};

const outerContainerStyle = {
  position: "relative",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  width: `calc(49 * var(--custom-vh))`,
  margin: `calc(0.5 * var(--custom-vh)) auto`,
  padding: `calc(0.8 * var(--custom-vh))`,
  backgroundColor: "#906C48",
  borderRadius: `calc(1.3 * var(--custom-vh))`,
  boxSizing: "border-box",
};

const middleContainerStyle = {
  width: `calc(47.5 * var(--custom-vh))`,
  backgroundColor: "#B2975C",
  borderRadius: `calc(0.8 * var(--custom-vh))`,
  padding: `calc(1.1 * var(--custom-vh))`,
  boxSizing: "border-box",
};

const innerContainerStyle = {
  position: "relative",
  width: `calc(45.3 * var(--custom-vh))`,
  backgroundColor: "#FFFFF0",
  borderRadius: `calc(0.6 * var(--custom-vh))`,
  padding: "0px",
  boxSizing: "border-box",
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
};

/**스시 이미지 감싸는 테두리 */
const sushiOuterImageStyle = {
  width: `calc(15 * var(--custom-vh))`,
  height: `calc(15 * var(--custom-vh))`,
  overflow: "hidden",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  borderRadius: `calc(2 * var(--custom-vh))`,
  position: "relative",
  backgroundColor: "#FFFFF0", // 배경색 추가
};

/**스시 사진 크기 조절 */
const sushiImageStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%) scale(0.8)",
  width: "100%",
  height: "100%",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

const textContainerStyle = {
  flex: 1,
  overflow: "hidden",
  display: "flex",
  flexDirection: "column",
  marginLeft: `calc(1.5 * var(--custom-vh))`,
};

const titleStyle = {
  width: `calc(20 * var(--custom-vh))`,
  fontSize: `calc(3 * var(--custom-vh))`,
  fontWeight: "bold",
  color: "#5A4628",
  margin: `calc(0.5 * var(--custom-vh)) 0 0 0`,
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
};

const contentStyle = {
  width: `calc(23 * var(--custom-vh))`,
  fontSize: `calc(2.5 * var(--custom-vh))`,
  color: "#8D7B7B",
  lineHeight: "1.4",
  display: "-webkit-box",
  WebkitLineClamp: 1,
  WebkitBoxOrient: "vertical",
  overflow: "hidden",
};

const dividerStyle = {
  width: `calc(24 * var(--custom-vh))`,
  border: "0.5px solid #BCBCBC",
  margin: `calc(1 * var(--custom-vh)) 0`,
};

/*남아있는 답변 */
const remainingAnswersStyle = {
  position: "relative",
  textAlign: "right",
  bottom: 0,
  color: "#f0f0f0",
  marginTop: `calc(5.8 * var(--custom-vh))`,
  marginLeft: `calc(10 * var(--custom-vh))`,
  padding: `0 calc(1 * var(--custom-vh))`,
  height: `calc(3 * var(--custom-vh))`,
  minWidth: `calc(1 * var(--custom-vh))`,
  width: "auto",
  border: "none",
  borderRadius: `calc(1 * var(--custom-vh))`,
  fontSize: `calc(2.2 * var(--custom-vh))`,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: "#E86100",
};
/*남아있는 시간 표시 */
const remainingTimeStyle = {
  position: "absolute",
  top: `calc(1.7 * var(--custom-vh))`,
  left: `calc(1.3 * var(--custom-vh))`,
  backgroundColor: "#454545",
  fontSize: `calc(2 * var(--custom-vh))`,
  border: "none",
  borderRadius: `calc(0.5 * var(--custom-vh))`,
  width: "auto",
  height: `calc(3 * var(--custom-vh))`,
  color: "#f0f0f0",
  marginTop: `calc(0.8 * var(--custom-vh))`,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: `0 calc(1 * var(--custom-vh))`,
  transform: "rotate(-25deg)",
};
/*Sold Out 표시 */
const soldoutStyle = {
  position: "absolute",
  top: `calc(4 * var(--custom-vh))`,
  left: `calc(1.5 * var(--custom-vh))`,
  fontWeight: "bold",
  fontSize: `calc(2 * var(--custom-vh))`,
  textShadow: `
    calc(0.3 * var(--custom-vh)) calc(0.3 * var(--custom-vh)) calc(0.6 * var(--custom-vh)) rgb(255, 255, 255),
    calc(-0.3 * var(--custom-vh)) calc(-0.3 * var(--custom-vh)) calc(0.6 * var(--custom-vh)) rgb(255, 255, 255)
  `,
  border: `calc(0.5 * var(--custom-vh)) solid #454545`,
  borderRadius: `calc(0.5 * var(--custom-vh))`,
  width: "auto",
  height: `calc(3 * var(--custom-vh))`,
  color: "#454545",
  marginTop: `calc(0.8 * var(--custom-vh))`,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: `0 calc(0.5 * var(--custom-vh))`,
  transform: "rotate(-15deg)",
};

export default SushiCard;
