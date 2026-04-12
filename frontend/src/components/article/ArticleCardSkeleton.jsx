import React from 'react';

const ArticleCardSkeleton = () => {
    return (
        <div className="flex flex-col p-2 animate-pulse">
            <div className="w-full aspect-[3/4] mb-3 bg-gray-200 rounded" />
            <div className="flex flex-col">
                <div className="h-8 bg-gray-200 rounded mb-2" />
                <div className="h-6 bg-gray-200 rounded mb-2 w-3/4" />
                <div className="flex justify-between items-end mt-2">
                    <div className="h-4 w-20 bg-gray-200 rounded" />
                    <div className="flex flex-col items-center gap-1">
                        <div className="w-6 h-6 md:w-12 md:h-12 rounded-full bg-gray-200" />
                        <div className="h-4 w-16 bg-gray-200 rounded" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ArticleCardSkeleton;