import React from "react";
import { useNavigate } from "react-router-dom";
import Sushi from "./Sushi";

const SushiAnswerCard = ({
  id,
  title,
  category,
  content,
  sushiType,
  showHeart = false,
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (!id) {
      alert("초밥 데이터가 존재하지 않습니다.");
      return;
    }
    navigate(`/sushianswerdetail/${id}`);
  };


  return (
    <div style={outerContainerStyle} onClick={handleClick}>
      <div style={middleContainerStyle}>
        <div style={innerContainerStyle}>
          {showHeart && <span style={heartIconStyle}>❤️</span>}

          <div style={sushiOuterImageStyle}>
            <div style={sushiImageStyle}>
              <Sushi isushiId={id} category={category} sushiType={sushiType} />
            </div>
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
  top: `calc(1 * var(--custom-vh))`,
  right: `calc(1 * var(--custom-vh))`,
  fontSize: `calc(2.7 * var(--custom-vh))`,
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
  WebkitLineClamp: 2,
  WebkitBoxOrient: "vertical",
  overflow: "hidden",
};

const dividerStyle = {
  width: `calc(24 * var(--custom-vh))`,
  border: `calc(0.05 * var(--custom-vh)) solid #BCBCBC`,
  margin: `calc(1 * var(--custom-vh)) 0`,
};

export default SushiAnswerCard;
