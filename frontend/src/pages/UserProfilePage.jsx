import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ArticleCard from '../components/article/ArticleCard';
import '../styles/Logo.css';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRandomArticles, registerPreferredArticles } from '../store/slices/userProfileSlice';


const UserProfilePage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [step, setStep] = useState(1);
    const [nickname, setNickname] = useState('');
    const [currentPage, setCurrentPage] = useState(0);
    const [selectedArticles, setSelectedArticles] = useState([]);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [fadeIn, setFadeIn] = useState(false);

    const location = useLocation(); // 전달된 state를 가져오기 위한 훅

    // location에서 provider도 함께 받아오도록 수정
    const { idToken, provider } = location.state || {}; // provider 추가


    useEffect(() => {
        if (!idToken || !provider) {
            navigate('/');
        } else {
            // 필요 시 API 호출이나 상태 업데이트 수행 가능
        }
    }
        , [idToken, navigate]);

    // 프로그레스 바 단계 정보 추가
    const steps = [
        { number: 1, text: '닉네임 입력' },
        { number: 2, text: '선호 기사 선택' },
        { number: 3, text: '가입 완료' }
    ];

    // 닉네임 유효성 검사 (1자 이상 20자 이하)
    const isNicknameValid = nickname.length >= 1 && nickname.length <= 20;

    // Redux store에서 랜덤 기사 목록 가져오기
    const { randomArticles = [], loading = false } = useSelector((state) => {
        return state.userProfile || {};
    });

    // articles 배열 제거하고 randomArticles 사용
    const articlesPerPage = 4;

    // randomArticles가 존재할 때만 렌더링
    useEffect(() => {
        if (step === 3) {
            setTimeout(() => setFadeIn(true), 100);
        } else {
            setFadeIn(false);
        }
    }, [step]);
    // }, [randomArticles, selectedArticles, currentPage]);

    const handleArticleSelect = async (articleId) => {
        setIsTransitioning(true);

        const currentPageArticles = randomArticles.slice(currentPage * articlesPerPage, (currentPage + 1) * articlesPerPage);
        const otherPagesSelections = selectedArticles.filter(id =>
            !currentPageArticles.map(a => a.id).includes(id)
        );

        const newSelectedArticles = [...otherPagesSelections, articleId];
        setSelectedArticles(newSelectedArticles);

        setTimeout(async () => {
            if (newSelectedArticles.length === 3) {
                try {
                    const response = await dispatch(registerPreferredArticles({
                        nickname,
                        selectedArticles: newSelectedArticles,
                        idToken,
                        provider // provider 추가
                    })).unwrap();

                    // 토큰 저장
                    const { accessToken, refreshToken } = response.data;
                    localStorage.setItem('accessToken', accessToken);
                    localStorage.setItem('refreshToken', refreshToken);

                    setIsTransitioning(false);
                    setStep(prev => prev + 1);
                } catch (error) {
                    setIsTransitioning(false);
                }
            } else {
                setCurrentPage(prev => prev + 1);
                setIsTransitioning(false);
            }
        }, 500);
    };

    // handlePreferredArticles 함수 제거
    // registerPreferredArticles 함수 제거 (더 이상 필요하지 않음)
    // 닉네임 입력 후 랜덤 기사 조회
    const handleNicknameSubmit = () => {
        if (!isNicknameValid) return;

        dispatch(fetchRandomArticles(nickname))
            .then((action) => {
                if (action.type.endsWith('/fulfilled')) {
                    setStep(prev => prev + 1);
                } else {

                }
            })
            .catch((err) => {

            });
    };

    const handleNext = () => {
        if (step === 1) {
            handleNicknameSubmit();
            return;
        }

        if (step === 2) {
            if (selectedArticles.length === 3) {
                handlePreferredArticles();
            }
            return;
        }
    };

    // 홈으로 이동
    const handleGoHome = () => {
        navigate('/home');
    };

    return (
        <div className="min-h-screen flex flex-col items-center pt-14 px-8 md:px-10">
            {/* 프로그레스 바 */}
            <div className="w-full max-w-3xl px-4 pt-3 mb-8">
                <div className="flex justify-between items-center relative">
                    {steps.map((s, index) => (
                        <div key={s.number} className="flex flex-col items-center relative z-10">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= s.number ? 'bg-[#1B2C7A] text-white' : 'bg-gray-200'
                                }`}>
                                {s.number}
                            </div>
                            <span className="mt-2 text-sm">{s.text}</span>
                        </div>
                    ))}
                    {/* 연결선 */}
                    <div className="absolute top-4 left-[5%] right-[5%] h-[2px] bg-gray-200 -z-0">
                        <div
                            className="h-full bg-[#1B2C7A] transition-all duration-300"
                            style={{ width: `${((step - 1) / 2) * 100}%` }}
                        />
                    </div>
                </div>
            </div>

            {/* 단계별 컨텐츠 */}
            <div className="w-full max-w-6xl py-6">
                {step === 1 && (
                    <>
                        <div className="text-center max-w-xl mx-auto">
                            <h2 className="text-2xl font-bold mb-8">사용하실 닉네임을 입력해주세요</h2>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={nickname}
                                    onChange={(e) => setNickname(e.target.value)}
                                    className="w-full p-4 border-2 border-gray-200 rounded-lg outline-none focus:border-blue-600"
                                    placeholder="닉네임을 입력해 주세요 (1-20자)"
                                    maxLength={20}
                                />
                                {nickname && (
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2">
                                        {isNicknameValid ? "✓" : "✗"}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="max-w-xl mx-auto md:mt-8 fixed md:relative bottom-0 left-0 right-0 px-8 pb-10 md:p-0 bg-white md:bg-transparent">
                            <button
                                onClick={handleNext}
                                disabled={!isNicknameValid}
                                className={`w-full py-3 rounded-lg ${isNicknameValid
                                    ? 'bg-[#1B2C7A] text-white'
                                    : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                    }`}
                            >
                                다음
                            </button>
                        </div>
                    </>
                )}

                {step === 2 && (
                    <div>
                        <div className="text-center mb-4">
                            <h2 className="text-2xl font-bold">흥미로운 기사를 선택해주세요</h2>
                            <p className="text-gray-600 mt-2 text-xs">
                                {currentPage + 1}번째 선호 기사를 선택해주세요 ({selectedArticles.length}/3)
                            </p>
                        </div>

                        <div className="max-w-6xl mx-auto px-4 relative">
                            <div
                                className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-1 md:gap-8 transition-all duration-300
                                    ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}
                            >
                                {randomArticles
                                    .slice(currentPage * articlesPerPage, (currentPage + 1) * articlesPerPage)
                                    .map((article) => (
                                        <div
                                            key={article.id}
                                            onClick={(e) => {
                                                if (!isTransitioning && selectedArticles.length < 3) {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    handleArticleSelect(article.id);
                                                }
                                            }}
                                            className={`cursor-pointer transition-all duration-300 w-full rounded-lg overflow-hidden p-2 md:p-4
                                                ${selectedArticles.includes(article.id)
                                                    ? 'ring-4 ring-[#1B2C7A] bg-blue-50 scale-105'
                                                    : selectedArticles.length >= 3
                                                        ? 'opacity-50 cursor-not-allowed'
                                                        : 'hover:shadow-lg hover:scale-102'
                                                }`}
                                        >
                                            <div className="w-full mx-auto pointer-events-none">
                                                <div className="[&>div>div>div>div:nth-child(1)]:!text-base [&>div>div>div>div:nth-child(1)]:!sm:text-base [&>div>div>div:not(:first-child)]:hidden [&>div>div>h3]:hidden">
                                                    <ArticleCard
                                                        id={article.id}
                                                        title={article.title}
                                                        imageUrl={article.thumbnailUrl}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div className="text-center max-w-xl mx-auto">
                        <h2 className={`text-2xl font-bold mb-10 mt-10 transition-all duration-700 transform ${fadeIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                            정보 입력이 완료되었어요!
                        </h2>
                        <div className="inline-block">
                            <h1
                                onClick={handleGoHome}
                                className="mt-8 text-6xl font-bold cursor-pointer bg-gradient-to-r from-[#72B7CA] to-[#1B2C7A] text-transparent bg-clip-text
                                tech-logo"
                            >
                                TechMate
                            </h1>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );  // This is the closing of the return statement
};  // This is the closing of the UserProfilePage component

export default UserProfilePage;
