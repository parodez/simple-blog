import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Comment {
  id: string;
  blog_id: string;
  user_id: string;
  content: string;
  image_url?: string;
  created_at?: string;
}

interface CommentState {
  comments: Comment[];
  loading: boolean;
  error: string | null;
}

const initialState: CommentState = {
  comments: [],
  loading: false,
  error: null,
};

const commentSlice = createSlice({
  name: "comments",
  initialState,
  reducers: {
    setComments(state, action: PayloadAction<Comment[]>) {
      state.comments = action.payload;
      state.loading = false;
      state.error = null;
    },
    addComment(state, action: PayloadAction<Comment>) {
      state.comments.push(action.payload);
    },
    deleteComment(state, action: PayloadAction<string>) {
      state.comments = state.comments.filter(
        (comment) => comment.id !== action.payload,
      );
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
      state.loading = false;
    },
    clearComments(state) {
      state.comments = [];
      state.loading = false;
      state.error = null;
    },
  },
  // Extra Reducers here if needed
});

export const {
  setComments,
  addComment,
  deleteComment,
  setLoading,
  setError,
  clearComments,
} = commentSlice.actions;
export default commentSlice.reducer;
