import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import sushiReducer from "./slices/sushiSlice";
import answerReducer from "./slices/answerSlice";
import notificationReducer from "./slices/notificationSlice";
import memberReducer from "./slices/memberSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    sushi: sushiReducer,
    answer: answerReducer,
    notification: notificationReducer,
    member: memberReducer,
  },
});
