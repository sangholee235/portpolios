import React, { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { socialLogin } from "../store/slices/authSlice";
import { useNavigate } from "react-router-dom";

const OAuthCallback = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      const urlParams = new URLSearchParams(window.location.search);

      const code = urlParams.get("code");
      const provider = location.pathname.split("/")[2];
      const redirectUrl = urlParams.get("state"); // OAuth state 파라미터 활용

      if (code) {
        dispatch(socialLogin({ provider, code }))
          .unwrap()
          .then(() => {
            if (redirectUrl) {
              // 전달될 리다이렉트 URL이 있는 경우 해당 페이지로 이동
              navigate(decodeURIComponent(redirectUrl));
            } else {
              // 로그인 후 홈으로 이동
              navigate("/home");
            }
          })
          .catch((error) => {
            navigate("/");
          });
      }
      isFirstRender.current = false;
    }
  }, [dispatch, navigate]);

  return <div></div>;
};

export default OAuthCallback;
