import postItPink from "../../../assets/postIt/postIt1.webp";
import postItGreen from "../../../assets/postIt/postIt2.webp";
import postItBlue from "../../../assets/postIt/postIt3.webp";
import postItRed from "../../../assets/postIt/postIt4.webp";
import postItOrange from "../../../assets/postIt/postIt5.webp";

export const postItImages = {
  pink: postItPink,
  green: postItGreen,
  blue: postItBlue,
  red: postItRed,
  orange: postItOrange,
};

export const modalStyles = {
  overlay: {
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translateX(-50%) translateY(-50%)",
    width: "calc( 55 * var(--custom-vh))",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  postOuterBox: {
    position: "relative",
    width: "calc( 40 * var(--custom-vh))",
    height: "calc( 40 * var(--custom-vh))",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  postIt: {
    position: "relative",
    width: "calc( 40 * var(--custom-vh))",
    height: "calc( 40 * var(--custom-vh))",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  postItImage: {
    width: "100%",
    height: "100%",
    marginTop: "calc( 4 * var(--custom-vh))",
    transform: "scale(1.5)",
    objectFit: "contain",
  },
  closeButton: {
    position: "absolute",
    height: "calc( 3 * var(--custom-vh))",
    top: "5%",
    right: "8%",
    cursor: "pointer",
    fontSize: "calc( 2.5 * var(--custom-vh))",
    color: "#000000",
    zIndex: 3,
  },
  content: {
    position: "absolute",
    width: "80%",
    height: "50%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "calc( 2 * var(--custom-vh))",
    textAlign: "center",
  },
  heart: {
    position: "absolute",
    height: "calc( 4 * var(--custom-vh))",
    bottom: "7%",
    right: "5%",
    fontSize: "calc( 3 * var(--custom-vh))",
    zIndex: 3,
    cursor: "pointer",
  },
  // GPT Modal specific styles

  // 이전 버전
  // gptHeader: {
  //   display: "flex",
  //   alignItems: "center",
  //   position: "absolute",
  //   top: "22%",
  //   left: "23%",
  //   zIndex: 3,
  // },
  // gptHeaderTitle: {
  //   color: "#424242",
  //   fontSize: "2.2vh",
  //   margin: "-0.5vh 0 0.5vh 1vh",
  // },
  // gptMasterIcon: {
  //   width: "3vh",
  //   height: "3vh",
  //   marginRight: "1vh",
  // },

  gptHeader: {
    display: "flex",
    alignItems: "center",
    position: "absolute",
    top: "10%", // 상단으로 이동
    left: "18%", // 원래 좌측 위치 유지
    zIndex: 3,
  },
  gptHeaderTitle: {
    color: "#424242",
    fontSize: "2.2vh",
    margin: "-0.5vh 0 0.5vh 1vh",
  },
  gptMasterIcon: {
    position: "absolute",
    width: "5vh",
    height: "5vh",
    bottom: "5%",
    right: "10%",
    zIndex: 3,
  },

  // Negative Modal specific styles
  negativeInnerBox: {
    backgroundColor: "#fdf5e6",
    padding: "calc(3 * var(--custom-vh))",
    borderRadius: "2vh",
    width: "calc(40 * var(--custom-vh))",
    height: "calc(17 * var(--custom-vh))",
    position: "relative",
    textAlign: "center",
    border: "1vh solid #906C48",
    outline: "0.3vh solid #67523E",
    fontSize: "calc(2.3 * var(--custom-vh))",
  },
  warningContent: {
    position: "relative",
    height: "calc(6 * var(--custom-vh))",
    zIndex: 1,
    fontSize: "calc(2.5 * var(--custom-vh))",
  },
  buttonBox: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "calc(5 * var(--custom-vh))",
    marginTop: "calc(3 * var(--custom-vh))",
    marginBottom: "calc(1 * var(--custom-vh))",
    gap: "calc(5 * var(--custom-vh))",
  },
  button: {
    padding: "calc(1 * var(--custom-vh)) 0",
    border: "none",
    borderRadius: "1vh",
    color: "white",
    cursor: "pointer",
    width: "40%",
    whiteSpace: "nowrap",
    lineHeight: "1",
    fontFamily: "Ownglyph, Ownglyph",
    fontSize: "calc(2.8 * var(--custom-vh))",
    transition: "all 0.1s ease",
  },
};
