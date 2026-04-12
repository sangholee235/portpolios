import React from 'react';

const MainArticleSkeleton = () => {
    return (
        <div className="relative w-full h-full animate-pulse">
            <div className="absolute inset-0 bg-gray-200" />
            <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-12 z-20">
                <div className="space-y-4 w-[80%]">
                    <div className="h-8 w-32 bg-gray-300 rounded" />
                    <div className="h-16 w-full bg-gray-300 rounded" />
                    <div className="h-8 w-2/3 bg-gray-300 rounded" />
                </div>
            </div>
        </div>
    );
};

export default MainArticleSkeleton;