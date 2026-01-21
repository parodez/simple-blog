import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { supabase } from "../supabaseClient";

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
  blogs: Blog[];
  loading: boolean;
  error: string | null;
}

const initialState: BlogState = {
  blogs: [],
  loading: false,
  error: null,
};

const blogSlice = createSlice({
  name: "blogs",
  initialState,
  reducers: {
    setBlogs(state, action: PayloadAction<Blog[]>) {
      state.blogs = action.payload;
      state.loading = false;
      state.error = null;
    },
    addBlog(state, action: PayloadAction<Blog>) {
      state.blogs.unshift(action.payload);
    },
    updateBlog(state, action: PayloadAction<Blog>) {
      const index = state.blogs.findIndex(
        (blog) => blog.id === action.payload.id,
      );
      if (index !== -1) {
        state.blogs[index] = action.payload;
      }
    },
    deleteBlog(state, action: PayloadAction<string>) {
      state.blogs = state.blogs.filter((blog) => blog.id !== action.payload);
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBlogs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBlogs.fulfilled, (state, action) => {
        state.blogs = action.payload || [];
        state.loading = false;
      })
      .addCase(fetchBlogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch blogs";
      });
  },
});

export const fetchBlogs = createAsyncThunk(
  "blogs/fetchBlogs",
  async (userId: string) => {
    const { data, error } = await supabase
      .from("blogs")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(error.message);
    }
    return data;
  },
);
export const {
  setBlogs,
  addBlog,
  updateBlog,
  deleteBlog,
  setLoading,
  setError,
} = blogSlice.actions;
export default blogSlice.reducer;
