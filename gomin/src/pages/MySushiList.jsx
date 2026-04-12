import React, { useState, useEffect } from "react";
import SushiCard from "../components/SushiCard";
import { useDispatch, useSelector } from "react-redux";
import { fetchMySushi } from "../store/slices/sushiSlice";
import { useTrail, animated } from "@react-spring/web"; // react-spring 라이브러리에서 useTrail, animated 가져오기
import directionIcon from "../assets/direction.svg";  // 파일 상단에 추가

import "../styles/font.css";

const MySushiList = () => {
  const [search, setSearch] = useState("");
  const [displaySushi, setDisplaySushi] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const [initialLoding, setInitialLoading] = useState(true);

  const dispatch = useDispatch();
  const mySushi = useSelector((state) => state.sushi.mySushi);

  const onChange = (e) => {
    setSearch(e.target.value);
  };


  useEffect(() => {
    let mounted = true;
    const fetchInitialData = async () => {
      try {
        const result = await dispatch(
          fetchMySushi({
            search: "",
            page: 1,
            size: 10,
          })
        );
        if (mounted && result.payload && result.payload.data) {
          setInitialLoading(false);
          setDisplaySushi(result.payload.data.content);
          setHasMore(result.payload.data.content.length === 10);
        }
      } catch (error) {

      }
    };
    fetchInitialData();
    return () => {
      mounted = false;
    };
  }, []);

  /*스크롤 감지 */
  const handleScroll = (e) => {
    const { scrollTop, clientHeight, scrollHeight } = e.currentTarget;

    if (!loading && hasMore && scrollHeight - scrollTop <= clientHeight + 100) {
      loadMore();
    }
  };

  /*다음 페이지 요청하는 코드 */
  const loadMore = () => {
    if (loading || !hasMore) return;
    setLoading(true);
    const nextPage = page + 1;

    dispatch(
      fetchMySushi({
        keyword: search,
        page: nextPage,
        size: 10,
      })
    ).then((result) => {
      if (result.payload && result.payload.data) {
        const newSushi = result.payload.data.content;

        if (newSushi.length < 10) {

          setHasMore(false);
        }
        setDisplaySushi((prev) => [...prev, ...newSushi]);
        setPage(nextPage);
      }
      setLoading(false);
    });
  };

  /*검색 기능 */
  const onSearch = () => {
    dispatch(
      fetchMySushi({
        keyword: search,
      })
    ).then((result) => {

      const apiResult = result.payload.data.content;
      // const filtered = apiResult.filter((sushi) =>
      //   sushi.title.toLowerCase().includes(search.toLowerCase())
      // );
      setDisplaySushi(apiResult);


    });
  };

  /*검색 엔터 기능 */
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      onSearch();
    }
  };

  // react-spring 애니메이션 효과
  const trail = useTrail(displaySushi.length, {
    opacity: 1,
    transform: "translateY(0px)",
    from: { opacity: 0, transform: "translateY(50px)" },
    config: { mass: 1, tension: 200, friction: 20 },
  });

  const scrollToTop = () => {
    const container = document.querySelector('.background');
    if (container) {
      container.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="background" style={styles.background} onScroll={handleScroll}>
      <div style={styles.listContainer}>
        {/* 나의 고민 박스 */}
        <div style={styles.position}>
          <div style={styles.outerBox}>
            <div style={styles.innerBox}>나의 고민</div>
          </div>
        </div>

        {/* 검색창 */}
        <div style={styles.searchContainer}>
          <div style={styles.inputWrapper}>
            <input
              type="text"
              value={search}
              onChange={onChange}
              onKeyDown={handleKeyDown}
              placeholder="고민을 검색해주세요"
              style={styles.searchInput}
              className="custom-placeholder"
            />
            <i
              className="fas fa-search"
              style={styles.searchIcon}
              onClick={onSearch}
            ></i>
          </div>
        </div>

        {/* 디버깅을 위한 현재 상태 표시 */}
        <div style={{ display: "none" }}>
          <p>검색어: {search}</p>
          <p>데이터 개수: {displaySushi.length}</p>
          <p>로딩 상태: {loading ? "true" : "false"}</p>
          <p>추가 데이터 존재: {hasMore ? "true" : "false"}</p>
        </div>

        {/* 고민 리스트 */}
        {displaySushi && displaySushi.length > 0 ? (
          <ul style={styles.list}>
            {trail.map((style, index) => (
              <animated.li
                key={`${displaySushi[index].sushiId}-${index}`}
                style={style}
              >
                <SushiCard
                  id={displaySushi[index].sushiId}
                  title={displaySushi[index].title}
                  category={displaySushi[index].category}
                  content={displaySushi[index].content}
                  sushiType={displaySushi[index].sushiType}
                  remainingAnswers={displaySushi[index].remainingAnswers}
                  maxAnswers={displaySushi[index].maxAnswers}
                  isClosed={displaySushi[index].isClosed}
                  createdAt={displaySushi[index].createdAt}
                  expirationTime={displaySushi[index].expirationTime}
                />
              </animated.li>
            ))}
          </ul>
        ) : initialLoding ? (
          <div style={styles.noResult}></div>
        ) : (
          <div style={styles.noResult}>일치하는 고민이 없습니다.</div>
        )}

        {/* 로딩 표시 */}
        {loading && <div style={styles.loadingText}>로딩 중...</div>}

        {/* 더 이상 데이터가 없을 때 메시지 */}
        {/* {!hasMore && displaySushi.length > 0 && (
          <div style={styles.endMessage}>더 이상 고민이 없습니다.</div>
        )} */}
      </div>
      <button onClick={scrollToTop} style={styles.scrollTopButton}>
        <img
          src={directionIcon}
          alt="위로 가기"
          style={{
            width: "calc(3 * var(--custom-vh))",
            height: "calc(3 * var(--custom-vh))",
            filter: "brightness(0) invert(1)", // SVG를 흰색으로 변경
          }}
        />
      </button>
    </div>
  );
};

const styles = {
  /**배경 스타일 */
  background: {
    position: "relative",
    height: `calc(100 * var(--custom-vh))`,
    width: `calc(55 * var(--custom-vh))`,
    overflowY: "auto",
    scrollbarWidth: "none",
  },
  /**리스트 감싸는 스타일 */
  listContainer: {
    position: "relative",
    zIndex: 2,
    width: "100%",
    maxWidth: `calc(55 * var(--custom-vh))`,
    margin: "0 auto",
    padding: `calc(3 * var(--custom-vh))`,
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  position: {
    // position: "sticky",
    // zIndex: 1000,
    // top: "0px",
    // padding: "10px",
  },
  /**나의 고민 외부 박스 */
  outerBox: {
    width: `calc(35 * var(--custom-vh))`,
    margin: `0 auto calc(1.5 * var(--custom-vh))`,
    border: `calc(0.7 * var(--custom-vh)) solid #8B6B3E`,
    borderRadius: `calc(1.2 * var(--custom-vh))`,
    backgroundColor: "#B2975C",
    padding: `calc(1 * var(--custom-vh))`,
    boxSizing: "border-box",
  },
  /**나의 고민 내부 박스 */
  innerBox: {
    width: "100%",
    border: `calc(0.3 * var(--custom-vh)) solid #906C48`,
    borderRadius: `calc(0.6 * var(--custom-vh))`,
    backgroundColor: "#B2975C",
    textAlign: "center",
    color: "#5D4A37",
    fontSize: `calc(3.8 * var(--custom-vh))`,
    fontWeight: "bold",
    padding: `calc(0.7 * var(--custom-vh)) 0`,
    boxSizing: "border-box",
  },

  /**검색창 컨테이너 스타일 */
  searchContainer: {
    display: "flex",
    justifyContent: "center",
    marginBottom: `calc(1 * var(--custom-vh))`,
    height: `calc(5.8 * var(--custom-vh))`,
  },

  /**돋보기 감싸는거 */
  inputWrapper: {
    position: "relative",
    width: `calc(45 * var(--custom-vh))`,
  },

  /**검색창 내부 스타일 */
  searchInput: {
    width: `calc(45 * var(--custom-vh))`,
    height: `calc(5.8 * var(--custom-vh))`,
    fontSize: `calc(1.8 * var(--custom-vh))`,
    textAlign: "center",
    border: `calc(0.3 * var(--custom-vh)) solid #906C48`,
    borderRadius: `calc(1 * var(--custom-vh))`,
    outline: "none",
    boxSizing: "border-box",
  },

  /** 입력창 내부 돋보기 아이콘 */
  searchIcon: {
    position: "absolute",
    right: `calc(1 * var(--custom-vh))`,
    top: "73%",
    transform: "translateY(-50%)",
    fontSize: `calc(3 * var(--custom-vh))`,
    color: "#906C48",
    cursor: "pointer",
  },

  /**검색 결과 없을때 */
  noResult: {
    textAlign: "center",
    color: "#8B6B3E",
    fontSize: `calc(2.8 * var(--custom-vh))`,
    marginTop: `calc(3.5 * var(--custom-vh))`,
  },
  /**글 리스트 스타일 */
  list: {
    listStyle: "none",
    padding: 0,
    margin: "0 auto",
    width: "100%",
    height: `calc(100 * var(--custom-vh))`,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },

  loadingText: {
    textAlign: "center",
    color: "#8B6B3E",
    fontSize: `calc(2 * var(--custom-vh))`,
    padding: `calc(2 * var(--custom-vh)) 0`,
  },

  endMessage: {
    textAlign: "center",
    color: "#8B6B3E",
    fontSize: `calc(2 * var(--custom-vh))`,
    padding: `calc(2 * var(--custom-vh)) 0`,
  },

  scrollTopButton: {
    position: "fixed",
    bottom: "5vh",
    left: "50%",
    transform: "translateX(-50%)",
    width: "calc(6 * var(--custom-vh))",
    height: "calc(6 * var(--custom-vh))",
    backgroundColor: "rgba(178, 151, 92, 0.6)",
    border: "calc(0.3 * var(--custom-vh)) solid rgba(139, 107, 62, 0.4)",
    borderRadius: "calc(3 * var(--custom-vh))",
    color: "#FFFEFA",
    fontSize: "calc(2.5 * var(--custom-vh))",
    cursor: "pointer",
    zIndex: 1000,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backdropFilter: "blur(4px)",
    transition: "all 0.3s ease",
    boxShadow: "0 calc(0.4 * var(--custom-vh)) calc(0.8 * var(--custom-vh)) rgba(0,0,0,0.15)",
    "&:hover": {
      backgroundColor: "rgba(178, 151, 92, 0.8)",
      transform: "translateX(-50%) translateY(-2px)",
      boxShadow: "0 calc(0.6 * var(--custom-vh)) calc(1 * var(--custom-vh)) rgba(0,0,0,0.2)",
    },
    "&:active": {
      transform: "translateX(-50%) translateY(0)",
    }
  },
};

// Chrome, Safari에서 스크롤바 숨기기
document.addEventListener("DOMContentLoaded", function () {
  const style = document.createElement("style");
  style.innerHTML = `.listContainer::-webkit-scrollbar {
      display: none;
}`;

  document.head.appendChild(style);
});

export default MySushiList;
