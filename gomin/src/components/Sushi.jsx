import React from "react";
import { useNavigate } from "react-router-dom";

// 초밥 이미지 임포트
import eggImg from "../assets/sushi/egg.webp";
import salmonImg from "../assets/sushi/salmon.webp";
import shrimpImg from "../assets/sushi/shrimp.webp";
import cuttleImg from "../assets/sushi/cuttle.webp";
import eelImg from "../assets/sushi/eel.webp";
import octopusImg from "../assets/sushi/octopus.webp";
import wagyuImg from "../assets/sushi/wagyu.webp";
import scallopImg from "../assets/sushi/가리비초밥.webp";
import tunaImg from "../assets/sushi/참치초밥.webp";
import uniImg from "../assets/sushi/성게알초밥.webp";
import flatfighImg from "../assets/sushi/광어초밥.webp";
import salmonroeImg from "../assets/sushi/연어알초밥.webp";

// Plates 이미지 임포트
import redImg from "../assets/plates/red.webp";
import yellowImg from "../assets/plates/yellow.webp";
import greenImg from "../assets/plates/green.webp";
import blueImg from "../assets/plates/blue.webp";
import violetImg from "../assets/plates/violet.webp";
import grayImg from "../assets/plates/gray.webp";
import whiteImg from "../assets/plates/white.webp";

const Sushi = ({
  sushiId,
  category,
  sushiType,
  remainingAnswers,
  expirationTime,
  onSushiClick,
}) => {
  // 고민 카테고리 매핑
  const categories = {
    1: "사랑",
    2: "금전",
    3: "건강",
    4: "진로",
    5: "자아",
    6: "기타",
  };

  // 카테고리에 맞는 Plates 이미지 매핑
  const plates = {
    1: redImg,
    2: yellowImg,
    3: greenImg,
    4: blueImg,
    5: violetImg,
    6: grayImg,
  };

  // 초밥 타입 매핑
  const sushiTypes = {
    1: { name: "계란", image: eggImg },
    2: { name: "연어", image: salmonImg },
    3: { name: "새우", image: shrimpImg },
    4: { name: "한치", image: cuttleImg },
    5: { name: "문어", image: octopusImg },
    6: { name: "장어", image: eelImg },
    7: { name: "와규", image: wagyuImg },
    8: { name: "가리비", image: scallopImg },
    9: { name: "광어", image: flatfighImg },
    10: { name: "성게알", image: uniImg },
    11: { name: "참치", image: tunaImg },
    12: { name: "연어알", image: salmonroeImg },
  };

  const categoryName = categories[category] || "알 수 없는 카테고리";
  const sushiName = sushiTypes[sushiType] || {
    name: "알 수 없는 초밥",
    image: null,
  };

  const plateImage = plates[category] || whiteImg;

  const handleSushiClick = () => {
    onSushiClick({
      sushiId,
      category,
      sushiType,
      remainingAnswers,
      expirationTime,
    });
  };

  return (
    <div
      className="sushi"
      style={{
        cursor: "pointer",
        textAlign: "center",
        width: "150px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {/* 초밥과 접시를 감싸는 div */}
      <div
        style={{
          position: "relative",
          width: "calc( 19 * var(--custom-vh))",
          height: "calc( 18 * var(--custom-vh))",
          overflow: "hidden",
        }}
      >
        {plateImage && (
          <img
            src={plateImage}
            alt={`Plate for ${categoryName}`}
            style={{
              width: "calc( 16 * var(--custom-vh))",
              height: "calc( 15 * var(--custom-vh))",
              position: "absolute",
              top: "45%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              borderRadius: "50%",
            }}
          />
        )}

        {sushiName.image && (
          <img
            onClick={handleSushiClick}
            src={sushiName.image}
            alt={sushiName.name}
            style={{
              width: "calc( 46 * var(--custom-vh))",
              height: "calc( 12 * var(--custom-vh))",
              overflow: "hidden",
              objectFit: "cover",
              objectPosition: "center",
              position: "absolute",
              top: "47.8%",
              left: "49%",
              transform: "translate(-50%, -50%)",
              willChange: "transform",
              imageRendering: "crisp-edges",
              transition: "all 0.3s ease",
              cursor: "pointer",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translate(-50%, -60%)";
              e.currentTarget.style.filter = "brightness(1.1)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translate(-50%, -50%)";
              e.currentTarget.style.filter = "brightness(1)";
            }}
          />
        )}
      </div>
    </div>
  );
};

export default Sushi;
