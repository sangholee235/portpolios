import React from 'react';
import { useNavigate } from 'react-router-dom';
import replaceImage from '../../assets/images/replaceImage.png';

const MainArticle = ({ id, imageUrl, category, title, journal, summary }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/article/${id}`);
    };

    return (
        <div
            className="relative w-full h-full group cursor-pointer"
            onClick={handleClick}
        >
            <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/80 z-10" />
            <div className="absolute inset-0 bg-black/30" />
            <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                    backgroundImage: `url(${imageUrl || replaceImage})`
                }}
            />

            <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-12 text-white z-20">
                <div className="space-y-4 w-[80%]">
                    <h2 className="font-['Pretendard-Black'] text-2xl md:text-3xl leading-tight tracking-tight inline-block px-5 py-3 bg-black/40 rounded-lg backdrop-blur-sm">
                        {category}
                    </h2>

                    <h2 className="font-['Pretendard-Black'] text-3xl md:text-h1 leading-tight tracking-tight">
                        {title}
                    </h2>

                    <p className="text-base hidden md:block opacity-90 leading-relaxed max-w-3xl">
                        {summary}
                    </p>

                    <p className="text-sm opacity-75">
                        {journal}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default MainArticle;
