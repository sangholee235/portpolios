// 스크롤 효과 관련 부분만 수정했습니다
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { BsBookmark, BsBookmarkFill } from "react-icons/bs";
import { FiEdit } from "react-icons/fi";
import ArticleCard from "../components/article/ArticleCard";
import Memo from "../components/article/Memo";
import Quiz from "../components/article/Quiz";
import Modal from "../components/common/Modal";
import { fetchFolders, createFolder } from "../store/slices/folderSlice";
import { fetchQuizzes } from "../store/slices/quizSlice";
import {
  fetchArticleDetail,
  toggleLikeArticle,
} from "../store/slices/articleSilce";
import { addScrap, removeScrap } from "../store/slices/scrapSlice";
import FloatingButton from "../components/ui/FloatingButton";
import quiz from "../assets/images/quiz.png";

const ArticlePage = () => {
  const navigate = useNavigate();
  // url 파라미터를 통해 기사 id 추출 (메모 컴포넌트 전달용)
  const { id } = useParams();
  const [scrollPosition, setScrollPosition] = useState(0);
  const [textColor, setTextColor] = useState("text-white");
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [showFolderModal, setShowFolderModal] = useState(false);
  const [showFolderNameModal, setShowFolderNameModal] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [showUnscrapModal, setShowUnscrapModal] = useState(false);
  const [scrapToRemove, setScrapToRemove] = useState(null);
  const [selectedFolderId, setSelectedFolderId] = useState(null);
  const { article, status, liked, scraped, scrapId } = useSelector(
    (state) => state.article
  );
  const { scraps } = useSelector((state) => state.scrap);
  const { folders } = useSelector((state) => state.folder);
  const { loading: quizLoading, error, quizzes } = useSelector((state) => state.quiz);

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchArticleDetail(id));
    dispatch(fetchFolders());
  }, [dispatch, id]);

  const handleSidePanelToggle = () => {
    if (!isSidePanelOpen) {
      setShowQuiz(false); // Reset quiz state when opening panel
    }
    setIsSidePanelOpen(!isSidePanelOpen);
  };

  // 퀴즈 버튼 클릭 핸들러 추가
  const handleQuizClick = () => {
    setShowQuiz(true);
    setIsSidePanelOpen(true);

    const fetchQuizWithRetry = () => {
      dispatch(fetchQuizzes(id))
        .unwrap()
        .then(() => {
          // Quiz loaded successfully
        })
        .catch((error) => {
          if (error.reason) {
            setTimeout(() => {
              fetchQuizWithRetry();
            }, 2000);
          } else {
            setShowQuiz(false);
            setIsSidePanelOpen(false);
          }
        });
    };

    fetchQuizWithRetry();
  };

  // 사이드 패널 닫을 때 퀴즈 상태도 초기화
  const handleCloseSidePanel = () => {
    setIsSidePanelOpen(false);
  };

  const handleScrapButtonClick = () => {
    if (scraped) {
      setScrapToRemove(scrapId); // articleSlice의 scrapId 사용
      setShowUnscrapModal(true);
    } else {
      setShowFolderModal(true);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    setIsSidePanelOpen(false);
  }, [id]);


  useEffect(() => {
    const handleScroll = () => {
      const position = window.pageYOffset;
      setScrollPosition(position);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const imageStyle = {
    transform: `scale(${1 + scrollPosition * 0.0008})`,
  };

  const overlayStyle = {
    backgroundColor: `rgba(253, 251, 247, ${Math.min(1, scrollPosition * 0.002)})`,
  };

  return (
    <div className="relative ">
      {/* Floating Buttons */}
      <div
        className={`z-50 flex flex-col gap-2 fixed bottom-8 right-8 
        ${isSidePanelOpen ? "opacity-0 pointer-events-none" : "opacity-100"}`}
      >
        <FloatingButton
          text={<FiEdit size={24} />}
          color="from-green-500 to-green-600"
          onClick={handleSidePanelToggle}
          className={scraped ? "opacity-100" : "opacity-0 pointer-events-none"}
        />

        <FloatingButton
          text={
            liked ? <AiFillHeart size={24} /> : <AiOutlineHeart size={24} />
          }
          color="from-pink-500 to-pink-600"
          onClick={() => {
            dispatch(toggleLikeArticle(id));
          }}
        />
        <FloatingButton
          text={
            scraped ? <BsBookmarkFill size={24} /> : <BsBookmark size={24} />
          }
          color="from-blue-500 to-blue-600"
          onClick={handleScrapButtonClick}
        />
      </div>

      {/* Folder Selection Modal */}
      {showFolderModal && (
        <Modal
          type="select"
          title="스크랩할 폴더 선택"
          options={folders?.content?.map((folder) => ({
            label: folder.folderName,
            value: folder.folderId,
          }))}
          onClose={() => setShowFolderModal(false)}
          onConfirm={(option) => {
            if (option.type === "new_folder") {
              setShowFolderModal(false);
              setShowFolderNameModal(true);
              return;
            }
            setSelectedFolderId(option.value);
            dispatch(addScrap({ articleId: id, folderId: option.value }))
              .unwrap()
              .then(() => {
                setShowFolderModal(false);
                setIsSidePanelOpen(true);
                dispatch(fetchArticleDetail(id)); // 스크랩 후 기사 정보 새로고침
              });
          }}
        />
      )}

      {/* scrap remove Modal */}
      {showUnscrapModal && (
        <Modal
          type="confirm"
          title="스크랩 취소"
          message={
            <>
              <p>정말 스크랩을 취소하시겠습니까?</p>
              <p>취소 후 모든 메모는 없어집니다.</p>
            </>
          }
          onClose={() => setShowUnscrapModal(false)}
          onConfirm={() => {
            dispatch(removeScrap(scrapToRemove))
              .unwrap()
              .then(() => {
                setSelectedFolderId(null);
                setShowUnscrapModal(false);
                setIsSidePanelOpen(false);
                dispatch(fetchArticleDetail(id)); // 스크랩 취소 후 기사 정보 새로고침
              });
          }}
        />
      )}

      {/* New Folder Name Modal */}
      {showFolderNameModal && (
        <Modal
          type="edit"
          title="새 폴더 만들기"
          value={newFolderName}
          onChange={(e) => setNewFolderName(e.target.value)}
          onClose={() => {
            setShowFolderNameModal(false);
            setNewFolderName("");
          }}
          onConfirm={() => {
            if (newFolderName.trim()) {
              dispatch(createFolder(newFolderName.trim())).then(() => {
                dispatch(fetchFolders()); // 폴더 목록 새로고침
                setShowFolderNameModal(false);
                setNewFolderName("");
                setShowFolderModal(true); // 폴더 선택 모달 다시 열기
              });
            }
          }}
        />
      )}

      {/* Side Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-full md:w-1/2 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-[100] ${isSidePanelOpen ? "translate-x-0" : "translate-x-full"
          }`}
      >
        <div className="h-full overflow-hidden">
          <button
            onClick={() => setIsSidePanelOpen(false)}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
          <div
            className="flex-1 overflow-y-auto p-8"
            onWheel={(e) => e.stopPropagation()}
            onTouchMove={(e) => e.stopPropagation()}
            onScroll={(e) => e.stopPropagation()}
            style={{ overscrollBehavior: "contain" }}
          >
            {showQuiz ? (
              quizLoading || !quizzes?.length ? (
                <div className="flex items-center justify-center h-full min-h-[calc(100vh-16rem)] w-full">
                  <div className="flex flex-col items-center justify-center text-center space-y-6">
                    <div className="relative">
                      <div className="animate-spin rounded-full h-24 w-24 border-[6px] border-gray-200"></div>
                      <div className="absolute top-0 animate-spin rounded-full h-24 w-24 border-[6px] border-blue-500 border-t-transparent"></div>
                    </div>
                    <div>
                      <p className="text-3xl font-bold text-gray-800 mb-4">
                        퀴즈 생성 중
                      </p>
                      <p className="text-xl text-gray-600">
                        잠시만 기다려주세요
                      </p>
                      <p className="text-sm text-gray-500 mt-2">
                        AI가 기사를 분석하여 퀴즈를 만들고 있습니다
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <Quiz
                  key={`quiz-${id}`}
                  articleId={id}
                  quizzes={quizzes}
                  onClose={() => {
                    handleCloseSidePanel();
                    setTimeout(() => setShowQuiz(false), 300);
                  }}
                />
              )
            ) : (
              <Memo articleId={id} initialFolderId={selectedFolderId} />
            )}
          </div>
        </div>
      </div>

      {/* Main Content Wrapper */}
      <div
        className={`transition-all duration-300 ease-in-out ${isSidePanelOpen ? "md:w-1/2" : "w-full"
          }`}
      >
        {/* Hero Section - 여기에 오버레이 스타일 적용 */}
        <div
          className={`fixed inset-0 flex flex-col ${isSidePanelOpen ? "" : "md:flex-row"
            } h-screen ${isSidePanelOpen ? "md:w-1/2" : "w-full"}`}
        >
          {/* Image Section */}
          <div
            className={`relative w-full h-full ${isSidePanelOpen ? "" : "md:w-1/2"
              } overflow-hidden`}
          >
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                ...imageStyle,
                backgroundImage: `url(${(article?.images && article.images[0]?.imageUrl)})`,
              }}
            />
            {/* 검은색 오버레이 대신 #FDFBF7 색상의 오버레이 적용 */}
            <div
              className="absolute inset-0 bg-black/50"
            />
            {/* 새로운 오버레이 - 스크롤에 따라 #FDFBF7 색상으로 덮임 */}
            <div
              className="absolute inset-0 pointer-events-none z-10"
              style={overlayStyle}
            />
          </div>

          {/* Text Section - 동일한 오버레이 효과를 글자 섹션에도 적용 */}
          <div
            className={`absolute ${isSidePanelOpen ? "" : "md:relative"
              } w-full ${isSidePanelOpen ? "" : "md:w-1/2"
              } h-full flex items-center ${isSidePanelOpen
                ? "bg-transparent"
                : "md:bg-[#FDFBF7]"
              }`}
          >
            {/* 글자 섹션에도 동일한 오버레이 적용 (모바일에서는 Hero 섹션 전체에 효과 적용) */}
            <div
              className="absolute inset-0 pointer-events-none z-10 md:hidden"
              style={overlayStyle}
            />
            <div className="px-8 md:px-12 max-w-2xl relative">
              <p
                className={`text-xl font-['Pretendard-Black'] ml-2 ${isSidePanelOpen ? "text-white" : "text-white md:text-black"
                  } mb-4`}
              >
                {article?.category}
              </p>
              <h1
                className={`text-4xl md:text-h1 font-['Pretendard-Black'] mb-6 md:mb-8 leading-tight
              ${isSidePanelOpen ? "text-white" : "text-white md:text-black"}
              decoration-4 md:decoration-8 underline underline-offset-[5px] md:underline-offset-[15px] 
              ${isSidePanelOpen ? "decoration-white" : "decoration-white md:decoration-current"}`}
              >
                {article?.title}
              </h1>
              <p
                className={`text-lg md:text-xl mb-4 md:mb-6 ${isSidePanelOpen ? "text-white" : "text-white md:text-black"
                  } opacity-80`}
              >
                {article?.summary}
              </p>
              <p
                className={`text-sm md:text-base ${isSidePanelOpen ? "text-white" : "text-white md:text-black"
                  } opacity-70`}
              >
                {article?.reporter}
              </p>
              <p
                className={`text-sm md:text-base ${isSidePanelOpen ? "text-white" : "text-white md:text-black"
                  } opacity-70`}
              >
                {article?.datetime}
              </p>
            </div>
          </div>
        </div>

        {/* Content Section - Adjust width when side panel is open */}
        <div className="relative">
          <div className="h-screen" />
          <div className="relative bg-[#FDFBF7] min-h-screen z-10">
            <div className="w-full flex flex-col items-center">
              <div
                className={`w-full px-8 ${isSidePanelOpen ? "md:w-[85%]" : "md:w-[50%]"
                  } md:px-0 pt-16 md:pt-24 pb-10`}
              >
                <div className="text-left space-y-8">
                  {article?.content?.split("\n").map((paragraph, index, paragraphs) => {
                    if (!paragraph.trim()) return null;

                    const elements = [];

                    if (article?.images && article.images.length > 1 && index > 0) {
                      const currentImageIndex = Math.floor(index / 3) + 1;
                      if (currentImageIndex < article.images.length && index % 3 === 0) {
                        const image = article.images[currentImageIndex];
                        elements.push(
                          <div key={`image-${currentImageIndex}`} className="my-8">
                            <img
                              src={image.imageUrl}
                              alt={image.caption || "Article image"}
                              className="w-full h-auto rounded-lg shadow-lg"
                            />
                            {image.caption && (
                              <p className="mt-2 text-sm text-gray-500 italic">
                                {image.caption}
                              </p>
                            )}
                          </div>
                        );
                      }
                    }

                    const isPhotoDesc =
                      paragraph.includes("@") &&
                      (paragraph.includes("기자") ||
                        paragraph.includes("연합뉴스"));

                    elements.push(
                      <p
                        key={`paragraph-${index}`}
                        className={`${isPhotoDesc ? "text-gray-500 text-sm italic" : "text-lg leading-relaxed text-gray-800"} 
                        ${index === 0 ? "font-semibold text-xl" : ""}`}
                      >
                        {paragraph.trim()}
                      </p>
                    );

                    return elements;
                  })}
                </div>


                {/* 퀴즈 풀기 배너 */}
                <div className="w-full rounded-2xl mb-12 pt-14">
                  <div className="w-full rounded-2xl px-6 py-3 md:px-12 flex md:flex-row justify-between items-center relative overflow-hidden bg-[#EEF3FF]">
                    {/* 텍스트와 버튼 영역 */}
                    <div className="relative z-10 flex flex-col px-6 gap-4 w-full md:max-w-[60%] text-left">
                      <div>
                        <p className="text-gray-600 text-sm md:text-base mb-1">
                          <span className="hidden md:inline">쉽고 재밌는 IT 뉴스 플랫폼 </span>
                          TechMate와 함께 하는
                        </p>
                        <p className="text-2xl md:text-3xl pt-1 font-bold">IT 퀴즈</p>
                      </div>
                      <button
                        onClick={handleQuizClick}
                        className="bg-white text-sm font-semibold px-5 py-1.5 rounded-full text-gray-700 hover:bg-gray-50 transition-colors w-fit"
                      >
                        AI 퀴즈 풀기
                      </button>
                    </div>
                    {/* 우측 이미지 */}
                    <div className="h-40 w-40">
                      <img
                        src={quiz}
                        alt="Quiz"
                        className="h-full w-full object-contain"
                      />
                    </div>
                  </div>
                </div>
              </div>



              {/* Related Articles Section - Full width */}
              <div className="w-full bg-[#FDFBF7] py-16">
                <div className="w-[95%] md:w-[90%] max-w-[2000px] mx-auto px-8">
                  <h2 className="text-2xl font-['Pretendard-Black'] mb-8">연관 기사</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {article?.similarArticles
                      ?.slice(0, 4)
                      .map((relatedArticle) => (
                        <div
                          key={relatedArticle.articleId}
                          className="cursor-pointer group"
                          onClick={() =>
                            navigate(`/article/${relatedArticle.articleId}`)
                          }
                        >
                          <ArticleCard
                            id={relatedArticle.articleId}
                            title={relatedArticle.title}
                            journal={relatedArticle.journal}
                            category={relatedArticle.category}
                            summary={relatedArticle.summary || ""}
                            imageUrl={
                              relatedArticle.thumbnailImageUrl
                            }
                            datetime={relatedArticle.datetime}
                          />
                        </div>
                      ))}
                  </div>
                </div>
              </div>

              {/* Footer - 나머지 코드는 동일 */}
              <footer className="w-full bg-[#111111] text-white">
                <div className="w-[95%] md:w-[90%] max-w-[2000px] mx-auto px-8 py-20">
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
                    {/* Logo and Description */}
                    <div className="md:col-span-5 space-y-8">
                      <h2 className="text-4xl font-['Pretendard-Black']">TechMate</h2>
                      <p className="text-gray-400 text-lg leading-relaxed">
                        IT 기술 뉴스를 더 쉽게 이해하고<br />
                        학습할 수 있도록 도와주는 서비스
                      </p>
                    </div>

                    {/* Contact */}
                    <div className="md:col-span-4 space-y-8">
                      <h3 className="text-xl font-semibold">Contact</h3>
                      <ul className="space-y-4">
                        <li className="text-gray-400">SSAFY 12기 특화 프로젝트</li>
                        <li className="text-gray-400">B201팀</li>
                      </ul>
                    </div>
                  </div>

                  {/* Copyright */}
                  <div className="mt-16 pt-8 border-t border-gray-800">
                    <p className="text-gray-500 text-sm">
                      © 2025 TechMate. All rights reserved.
                    </p>
                  </div>
                </div>
              </footer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticlePage;