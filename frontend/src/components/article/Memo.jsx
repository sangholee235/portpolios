import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import FloatingButton from "../ui/FloatingButton";
import "../../styles/memo.css";
import { useDispatch, useSelector } from "react-redux";
import { fetchMemo, updateMemo } from "../../store/slices/memoSlice";
import { fetchFolders } from "../../store/slices/folderSlice";
import { addScrap, removeScrap } from "../../store/slices/scrapSlice";
import Modal from "../common/Modal";

const CustomComponents = {
  h1: ({ children }) => (
    <h1 className="text-3xl font-bold text-blue-600">{children}</h1>
  ),
  h2: ({ children }) => (
    <h2 className="text-2xl font-bold text-blue-500">{children}</h2>
  ),
  h3: ({ children }) => (
    <h3 className="text-xl font-bold text-blue-400">{children}</h3>
  ),
  p: ({ children }) => (
    <p className="text-gray-800 leading-relaxed mb-4">{children}</p>
  ),
  strong: ({ children }) => <strong>{children}</strong>,
  em: ({ children }) => <em className="text-blue-500">{children}</em>,
  a: ({ href, children }) => (
    <a
      href={href}
      className="text-gray-500 underline"
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
    </a>
  ),
  blockquote: ({ children }) => (
    <blockquote className="bg-gray-100 border-l-4 border-blue-500 px-4 py-3 my-4">
      {children}
    </blockquote>
  ),
  ul: ({ children }) => <ul className="list-disc pl-5">{children}</ul>,
  li: ({ children }) => <li className="mb-2">{children}</li>,
  code: ({ node, inline, className, children, ...props }) => {
    const match = /language-(\w+)/.exec(className || "");
    return !inline && match ? (
      <pre className="bg-gray-200 p-4 rounded overflow-x-auto">
        <code className={className} {...props}>
          {children}
        </code>
      </pre>
    ) : (
      <code className="bg-gray-200 rounded px-2 py-1 text-sm" {...props}>
        {children}
      </code>
    );
  },
};

const Memo = ({ articleId, initialFolderId }) => {
  const dispatch = useDispatch();
  const { memo, loading, error } = useSelector((state) => state.memo);
  const { folders = [] } = useSelector((state) => state.folder);
  const [markdown, setMarkdown] = useState("# 마크다운 형식의 메모를 제공합니다. 사용해보세요!😊");
  const [isPreview, setIsPreview] = useState(true);
  const [category, setCategory] = useState(initialFolderId ? String(initialFolderId) : "");
  const [showSaveConfirmModal, setShowSaveConfirmModal] = useState(false);


  // handleFolderChange도 수정
  const handleFolderChange = async (e) => {
    const newFolderId = String(e.target.value); // 문자열로 변환

    if (memo?.scrapId && articleId) {
      try {
        await dispatch(removeScrap(memo.scrapId));
        await dispatch(addScrap({
          articleId: articleId,
          folderId: Number(newFolderId)  // API 호출 시에는 숫자로 변환
        }));
        await dispatch(fetchMemo(articleId));
        setCategory(newFolderId);
      } catch (error) {
      }
    }
  };


  useEffect(() => {

    if (articleId) {
      // 먼저 폴더 목록을 가져온 후에 메모 정보를 가져오기
      dispatch(fetchFolders())
        .then(() => dispatch(fetchMemo(articleId)))
        .then((memoResponse) => {
          // 스크랩 모달에서 선택한 폴더 ID가 있으면 우선 적용
          if (initialFolderId) {
            setCategory(String(initialFolderId));
          }
          // 기존 메모의 폴더 ID가 있으면 적용
          else if (memoResponse.payload?.folderId) {
            setCategory(String(memoResponse.payload.folderId));
          }

          if (memoResponse.payload?.content) {
            setMarkdown(memoResponse.payload.content);
          } else {
            setMarkdown("# 마크다운을 입력하세요");
          }
        });
    }
  }, [dispatch, articleId, initialFolderId]);


  useEffect(() => {
    if (memo?.content) {
      setMarkdown(memo.content);
    }
  }, [memo]);

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(
      2,
      "0"
    )}/${String(date.getDate()).padStart(2, "0")}`;
  };
  const handleInputChange = (e) => {
    setMarkdown(e.target.value);
  };

  const togglePreview = () => {
    setIsPreview(!isPreview);
  };

  // 현재 날짜 가져오기
  const currentDate = new Date();
  const formattedDate = `${currentDate.getFullYear()}/${String(
    currentDate.getMonth() + 1
  ).padStart(2, "0")}/${String(currentDate.getDate()).padStart(2, "0")}`;


  const handleSave = async () => {
    // 최신 메모 데이터를 먼저 조회
    const memoResponse = await dispatch(fetchMemo(articleId)).unwrap();

    if (memoResponse?.memoId) {
      const updateResponse = await dispatch(updateMemo({
        memoId: memoResponse.memoId,  // 최신 메모 ID 사용
        content: markdown,
      })).unwrap();

      setShowSaveConfirmModal(true);
    }
  };

  return (
    <div className="markdown-container p-4 h-full flex flex-col">
      {/* 상단 작성일자와 카테고리 */}
      <div className="grid grid-cols-1 gap-2 flex-shrink-0">
        <div className="flex items-center space-x-3">
          <div className="text-gray-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
          <div>
            <label className="text-sm text-gray-500">작성일자</label>
            <div>{memo ? formatDate(memo.createdAt) : formattedDate}</div>
          </div>
        </div>

        <div className="flex items-center space-x-3 mb-5">
          <div className="text-gray-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
              />
            </svg>
          </div>
          <div className="flex-grow">
            <label className="text-sm text-gray-500">폴더</label>

            {/* // select 엘리먼트 수정 */}
            <select
              value={category}
              onChange={handleFolderChange}
              className="block w-full mt-1 text-gray-700 bg-white border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-100 focus:border-blue-400 focus:outline-none"
            >
              <option value="">폴더 선택</option>
              {folders?.content &&
                [...folders.content]  // 배열을 복사한 후 정렬
                  .sort((a, b) => a.folderId - b.folderId)
                  .map((folder) => (
                    <option
                      key={folder.folderId}
                      value={String(folder.folderId)}
                    >
                      {folder.folderName}
                    </option>
                  ))}
            </select>
          </div>
        </div>
      </div>

      {/* 마크다운 에디터 및 미리보기 */}
      <div className="flex-grow overflow-hidden my-2 h-[calc(90vh-250px)]">
        {!isPreview ? (
          <textarea
            className="markdown-editor w-full h-full border border-gray-300 rounded"
            value={markdown}
            onChange={handleInputChange}
          />
        ) : (
          <div className="markdown-preview w-full h-full border border-gray-300 rounded overflow-auto">
            <ReactMarkdown
              components={CustomComponents}
              remarkPlugins={[remarkGfm]}
            >
              {markdown}
            </ReactMarkdown>
          </div>
        )}
      </div>

      {/* 저장/수정 버튼 */}
      <div className="text-center flex-shrink-0 mt-4">
        <button
          onClick={() => {
            // isPreview가 false일 경우에만 handleSave 함수를 실행합니다.
            if (!isPreview) {
              handleSave();
              setIsPreview(true);
            } else {
              setIsPreview(false);
            }
          }}
          className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-8 py-2 rounded shadow-md transition duration-200 ease-in-out w-32"
        >
          {isPreview ? '수정하기' : '저장하기'}
        </button>

      </div>
      {/* 메모 저장 확인 모달 */}
      {showSaveConfirmModal && (
        <Modal
          type="confirm"
          title="메모 저장"
          message="메모가 저장되었습니다."
          onClose={() => setShowSaveConfirmModal(false)}
          onConfirm={() => setShowSaveConfirmModal(false)}
        />
      )}
    </div>
  );
};

export default Memo;
