import React, { useEffect, useRef } from 'react';
import FullpageScroll from '../components/ui/FullPageScroll';
import { useNavigate } from 'react-router-dom';
import newsImage from '../assets/images/newsImage.jpg';
import deskImage from '../assets/images/deskImage.jpg';
import webImage from '../assets/images/webImage1.png';
import webImage2 from '../assets/images/webImage2.png';
import webImage3 from '../assets/images/webImage3.png';
import mobileImage from '../assets/images/mobileImage1.png';
import mobileImage2 from '../assets/images/mobileImage2.png';
import mobileImage3 from '../assets/images/mobileImage3.png';
import '../styles/OpenPage.css';

const ScrollArrow = () => (
    <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white z-20">
        <div className="floating-arrow">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <path d="M12 5v14M5 12l7 7 7-7" />
            </svg>
        </div>
    </div>
);

const Openpage = () => {
    const navigate = useNavigate();

    // useEffect(() => {
    //     // Check if user has visited before
    //     const hasVisited = localStorage.getItem('hasVisitedIntro');
    //     if (hasVisited) {
    //         navigate('/open');
    //         return;
    //     }
    //     // Set visited flag
    //     localStorage.setItem('hasVisitedIntro', 'true');
    // }, [navigate]);

    // Add new ref for the fourth section
    const contentRef1 = useRef(null);
    const phoneRef1 = useRef(null);
    const contentRef2 = useRef(null);
    const phoneRef2 = useRef(null);
    const contentRef3 = useRef(null);
    const phoneRef3 = useRef(null);

    // Add new refs at the top with other refs
    const lastTitleRef = useRef(null);
    const lastSubtitleRef = useRef(null);

    // Add new ref with other refs
    const lastButtonRef = useRef(null);

    useEffect(() => {
        const sectionObservers = [
            {
                trigger: contentRef1,
                targets: [
                    { ref: contentRef1.current, delay: 0 },
                    { ref: phoneRef1.current, delay: 600 },
                ]
            },
            {
                trigger: contentRef2,
                targets: [
                    { ref: contentRef2.current, delay: 0 },
                    { ref: phoneRef2.current, delay: 600 },
                ]
            },
            {
                trigger: contentRef3,
                targets: [
                    { ref: contentRef3.current, delay: 0 },
                    { ref: phoneRef3.current, delay: 600 },
                ]
            },
            {
                trigger: lastTitleRef,
                targets: [
                    { ref: lastTitleRef.current, delay: 0 },
                    { ref: lastSubtitleRef.current, delay: 600 },
                    { ref: lastButtonRef.current, delay: 1200 },
                ]
            }
        ];

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const matchedSection = sectionObservers.find(
                            section => section.trigger.current === entry.target
                        );

                        if (matchedSection) {
                            matchedSection.targets.forEach(({ ref, delay }) => {
                                if (ref) {
                                    setTimeout(() => {
                                        ref.style.opacity = '1';
                                        ref.style.transform = 'translateY(0)';
                                    }, delay);
                                }
                            });

                            observer.unobserve(entry.target); // prevent repeat
                        }
                    }
                });
            },
            { threshold: 0.3 }
        );

        sectionObservers.forEach(section => {
            if (section.trigger.current) {
                observer.observe(section.trigger.current);
            }
        });

        return () => observer.disconnect();
    }, []);

    // Update the last section
    return (
        <FullpageScroll>
            {/* First section */}
            <FullpageScroll.Section className="relative overflow-hidden">
                <div className="absolute inset-0">
                    <img src={newsImage} alt="Tech background" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/50" />
                </div>
                <div className="relative z-10 h-screen flex flex-col items-start justify-center">
                    <p className="title-animation text-h3 md:text-h1 font-['Pretendard-Black'] text-start text-white mb-8">
                        IT 동향 파악엔
                    </p>
                    <p className="font-['Pretendard-Black'] subtitle-animation text-h3 md:text-h1 text-start text-white">
                        테크메이트와 함께,
                    </p>
                </div>
                <ScrollArrow />
            </FullpageScroll.Section>

            {/* Second section */}
            <FullpageScroll.Section className="bg-[#FFFFF] relative">
                <div className="mx-auto px-4 h-screen flex items-center">
                    <div className="w-full flex flex-row justify-center gap-12 items-center">
                        <div
                            ref={contentRef1}
                            className="opacity-0 transform translate-y-10 transition-all ease-out duration-1000 max-w-[150px] md:max-w-[280px]"
                        >
                            <div className="rounded-3xl overflow-hidden"> {/* Added fixed width */}
                                <img
                                    src={mobileImage3}
                                    alt="App preview 2"
                                    className="w-full h-full object-cover scale-100" /* Added scale for slightly larger image */
                                />
                            </div>
                        </div>

                        <div className=""> {/* Added flex and flex-col */}
                            <div
                                ref={phoneRef1}
                                className="opacity-0 transform translate-y-10 transition-all duration-1000 ease-out max-w-[200px] md:max-w-[600px]"
                            >
                                <h2 className="text-xl sm:text-3xl md:text-4xl font-bold mb-4">나만의 뉴스를 한눈에,</h2>
                                <p className="text-base sm:text-lg md:text-xl text-gray-600">뉴스를 스크랩하고</p>
                                <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-4">한눈에 모아보세요.</p>
                                <div className="hidden md:block rounded-3xl overflow-hidden"> {/* Changed flex to block */}
                                    <img
                                        src={webImage}
                                        alt="App preview 2"
                                        className="w-full h-full object-cover scale-100" /* Added scale for slightly larger image */
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </FullpageScroll.Section>

            {/* Third section */}
            <FullpageScroll.Section className="bg-[#FFFFF] relative">
                <div className="mx-auto px-4 h-screen flex items-center">
                    <div className="w-full flex flex-row justify-center gap-12 items-center">
                        <div
                            ref={contentRef2}
                            className="opacity-0 transform translate-y-10 transition-all ease-out duration-1000 max-w-[150px] md:max-w-[280px]"
                        >
                            <div className="rounded-3xl overflow-hidden"> {/* Added fixed width */}
                                <img
                                    src={mobileImage2}
                                    alt="App preview 2"
                                    className="w-full h-full object-cover scale-100" /* Added scale for slightly larger image */
                                />
                            </div>
                        </div>

                        <div className=""> {/* Added flex and flex-col */}
                            <div
                                ref={phoneRef2}
                                className="opacity-0 transform translate-y-10 transition-all duration-1000 ease-out max-w-[200px] md:max-w-[600px]"
                            >
                                <h2 className="text-xl sm:text-3xl md:text-4xl font-bold mb-4">메모까지 간편히,</h2>
                                <p className="text-base sm:text-lg md:text-xl text-gray-600">기사를 읽으며</p>
                                <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-4">나의 생각을 기록하세요.</p>
                                <div className="hidden md:block rounded-3xl overflow-hidden"> {/* Changed flex to block */}
                                    <img
                                        src={webImage2}
                                        alt="App preview 2"
                                        className="w-full h-full object-cover scale-100" /* Added scale for slightly larger image */
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </FullpageScroll.Section>

            {/* Add fourth section */}
            <FullpageScroll.Section className="bg-[#FFFFF] relative">
                <div className="mx-auto px-4 h-screen flex items-center">
                    <div className="w-full flex flex-row justify-center gap-12 items-center">
                        <div
                            ref={contentRef3}
                            className="opacity-0 transform translate-y-10 transition-all ease-out duration-1000 max-w-[150px] md:max-w-[280px]"
                        >
                            <div className="rounded-3xl overflow-hidden"> {/* Added fixed width */}
                                <img
                                    src={mobileImage}
                                    alt="App preview 2"
                                    className="w-full h-full object-cover scale-100" /* Added scale for slightly larger image */
                                />
                            </div>
                        </div>

                        <div className=""> {/* Added flex and flex-col */}
                            <div
                                ref={phoneRef3}
                                className="opacity-0 transform translate-y-10 transition-all duration-1000 ease-out max-w-[200px] md:max-w-[600px]"
                            >
                                <h2 className="text-xl sm:text-3xl md:text-4xl font-bold mb-4">맞춤형 학습경험</h2>
                                <p className="text-base sm:text-lg md:text-xl text-gray-600">IT뉴스를 읽고</p>
                                <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-4">퀴즈로 복습하세요</p>
                                <div className="hidden md:block rounded-3xl overflow-hidden"> {/* Changed flex to block */}
                                    <img
                                        src={webImage3}
                                        alt="App preview 2"
                                        className="w-full h-full object-cover scale-100" /* Added scale for slightly larger image */
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </FullpageScroll.Section>
            {/* Last section */}
            <FullpageScroll.Section className="relative overflow-hidden">
                <div className="absolute inset-0">
                    <img src={deskImage} alt="Tech background" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/50" />
                </div>
                <div className="relative z-10 h-screen flex flex-col items-start justify-center">
                    <p ref={lastTitleRef} className="opacity-0 transform translate-y-10 transition-all duration-1000 text-h3 md:text-h1 font-['Pretendard-Black'] text-start text-white mb-8">
                        지금 바로 시작하세요
                    </p>
                    <p ref={lastSubtitleRef} className="opacity-0 transform translate-y-10 transition-all duration-1000 font-['Pretendard-Black'] text-h3 md:text-h1 text-start text-white mb-8">
                        테크메이트와 함께,
                    </p>
                    <button
                        ref={lastButtonRef}
                        onClick={() => navigate('/open')}
                        className="opacity-0 transform translate-y-10 transition-all duration-1000 px-8 py-3 bg-white text-black rounded-full text-xl hover:bg-opacity-90"
                    >
                        시작하기
                    </button>
                </div>
            </FullpageScroll.Section>
        </FullpageScroll>
    );
};

export default Openpage;
