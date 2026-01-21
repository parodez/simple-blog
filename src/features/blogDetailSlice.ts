import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Blog {
  id: string;
  title: string;
  content: string;
  image_url?: string;
  created_at?: string;
  updated_at?: string;
  user_id?: string;
}

interface BlogState {
  blog: Blog | null;
  loading: boolean;
  error: string | null;
}

const initialState: BlogState = {
  blog: null,
  loading: false,
  error: null,
};

const blogDetailSlice = createSlice({
  name: "blogDetail",
  initialState,
  reducers: {
    setBlog(state, action: PayloadAction<Blog>) {
      state.blog = action.payload;
      state.loading = false;
      state.error = null;
    },
    clearBlog(state) {
      state.blog = null;
      state.loading = false;
      state.error = null;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
      state.loading = false;
    },
  },
  // Extra Reducers here if needed
});

export const { setBlog, clearBlog, setLoading, setError } =
  blogDetailSlice.actions;
export default blogDetailSlice.reducer;
