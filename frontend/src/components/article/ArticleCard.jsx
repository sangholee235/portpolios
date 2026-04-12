import React from 'react';
import { useNavigate } from 'react-router-dom';
import replaceImage from '../../assets/images/replaceImage.png';

const ArticleCard = ({ id, title, journal, summary, category, imageUrl, datetime }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/article/${id}`);
    };

    const formatDate = (dateString) => {
        if (!dateString) return "2025.06.12"; // Default date if none provided
        const date = new Date(dateString);
        return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
    };

    return (
        <div
            className="flex flex-row sm:flex-col cursor-pointer transition-colors p-2 gap-3 sm:gap-0"
            onClick={handleClick}
        >
            {/* Article Image */}
            <div className="w-1/3 sm:w-full aspect-[3/4] sm:mb-3 overflow-hidden relative flex-shrink-0">
                <img
                    src={imageUrl || replaceImage}
                    alt="Article thumbnail"
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-110 hover:rotate-3"
                />
                <div className="absolute bottom-2 left-2 sm:bottom-3 sm:left-3">
                    <span className="text-white font-extrabold px-1 sm:px-3 py-1 rounded-full text-xs sm:text-h5">
                        {category || "IT/일반"}
                    </span>
                </div>
            </div>

            {/* Article Content */}
            <div className="flex flex-col flex-grow justify-between">
                <div>
                    <div className="font-['Pretendard-Black'] text-lg sm:text-xl md:text-2xl lg:text-[28.8px] leading-tight mb-1 sm:mb-2 mr-none sm:mr-2 line-clamp-2">
                        {title || "기사 제목 로드 실패"}
                    </div>

                    <h3 className="hidden sm:block text-base line-clamp-2 md:line-clamp-2 mb-2 mr-none sm:mr-5">
                        {summary || ""}
                    </h3>
                </div>

                <div className="flex justify-between items-end mt-auto">
                    <div className="text-black text-sm sm:text-sm">
                        {formatDate(datetime)}
                    </div>
                    <div className="flex flex-col items-center gap-1">
                        <span className="text-sm sm:text-sm">{journal}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ArticleCard;
