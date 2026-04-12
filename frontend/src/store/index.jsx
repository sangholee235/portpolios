import { configureStore } from '@reduxjs/toolkit';
import articleReducer from './slices/articleSilce';
import memoReducer from './slices/memoSlice';
import folderReducer from './slices/folderSlice';
import userProfileReducer from './slices/userProfileSlice';
import quizReducer from './slices/quizSlice';
import myPageReducer from './slices/myPageSlice';
import scrapReducer from './slices/scrapSlice';


const store = configureStore({
    reducer: {
        article: articleReducer,
        folder: folderReducer,
        userProfile: userProfileReducer,
        myPage: myPageReducer,
        scrap: scrapReducer,
        memo: memoReducer,
        quiz: quizReducer,
        // ... other reducers
    },
});

export default store;
