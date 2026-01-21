import { configureStore } from "@reduxjs/toolkit";

import blogReducer from "./features/blogSlice";
import blogDetailReducer from "./features/blogDetailSlice";
import commentReducer from "./features/commentSlice";

export const store = configureStore({
  reducer: {
    blogs: blogReducer,
    blogDetail: blogDetailReducer,
    comments: commentReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
