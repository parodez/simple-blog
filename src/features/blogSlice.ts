import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { supabase } from "../supabaseClient";

interface Blog {
  id: string;
  title: string;
  content: string;
  slug?: string;
  image_url?: string;
  created_at?: string;
  updated_at?: string;
  user_id?: string;
}

interface BlogState {
  blogs: Blog[];
  totalCount: number;
  itemsPerPage: number;
  currentBlog: Blog | null;
  loading: boolean;
  error: string | null;
}

const initialState: BlogState = {
  blogs: [],
  totalCount: 0,
  itemsPerPage: 5,
  currentBlog: null,
  loading: false,
  error: null,
};

export const fetchBlogs = createAsyncThunk(
  "blogs/fetchBlogs",
  async ({ userId, page = 1, limit = 5 }: { userId: string; page?: number; limit?: number }) => {
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, error, count } = await supabase
      .from("blogs")
      .select("*", { count: "exact" })
      .eq("user_id", userId)
      .order("updated_at", { ascending: false })
      .range(from, to);

    if (error) {
      throw new Error(error.message);
    }
    return { data, count: count || 0 };
  },
);

export const fetchBlogById = createAsyncThunk(
  "blogs/fetchBlogById",
  async (blogId: string) => {
    const { data, error } = await supabase
      .from("blogs")
      .select("*")
      .eq("id", blogId)
      .maybeSingle();


    if (error) {
      throw new Error(error.message);
    }
    return data;
  },
);

export const fetchBlogBySlug = createAsyncThunk(
  "blogs/fetchBlogBySlug",
  async (slug: string) => {
    const { data, error } = await supabase
      .from("blogs")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();


    if (error) {
      throw new Error(error.message);
    }
    return data;
  },
);

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
    clearCurrentBlog(state) {
      state.currentBlog = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBlogs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBlogs.fulfilled, (state, action) => {
        state.blogs = action.payload.data || [];
        state.totalCount = action.payload.count;
        state.loading = false;
      })
      .addCase(fetchBlogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch blogs";
      })
      .addCase(fetchBlogById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBlogById.fulfilled, (state, action) => {
        state.currentBlog = action.payload;
        state.loading = false;
      })
      .addCase(fetchBlogById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch blog";
      })
      .addCase(fetchBlogBySlug.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBlogBySlug.fulfilled, (state, action) => {
        state.currentBlog = action.payload;
        state.loading = false;
      })
      .addCase(fetchBlogBySlug.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch blog by slug";
      })
      .addCase(createBlog.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBlog.fulfilled, (state, action) => {
        state.blogs.unshift(action.payload);
        state.loading = false;
      })
      .addCase(createBlog.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to create blog";
      })
      .addCase(updateBlogAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateBlogAsync.fulfilled, (state, action) => {
        const index = state.blogs.findIndex(b => b.id === action.payload.id);
        if (index !== -1) {
          state.blogs[index] = action.payload;
        }
        state.currentBlog = action.payload;
        state.loading = false;
      })
      .addCase(updateBlogAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to update blog";
      })
      .addCase(deleteBlogAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteBlogAsync.fulfilled, (state, action) => {
        state.blogs = state.blogs.filter(b => b.id !== action.payload);
        state.loading = false;
      })
      .addCase(deleteBlogAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to delete blog";
      });
  },
});

export const createBlog = createAsyncThunk(
  "blogs/createBlog",
  async (blog: Omit<Blog, "id" | "created_at" | "updated_at">) => {
    const { data, error } = await supabase
      .from("blogs")
      .insert([blog])
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }
    return data;
  },
);

export const updateBlogAsync = createAsyncThunk(
  "blogs/updateBlogAsync",
  async ({ id, ...updates }: Partial<Blog> & { id: string }) => {
    const { data, error } = await supabase
      .from("blogs")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }
    return data;
  },
);

export const deleteBlogAsync = createAsyncThunk(
  "blogs/deleteBlogAsync",
  async (id: string) => {
    console.log('Attempting to delete blog and its comments:', id);

    // 1. Delete associated comments first to avoid foreign key constraints
    const { error: commentsError } = await supabase
      .from("comments")
      .delete()
      .eq("blog_id", id);

    if (commentsError) {
      console.warn('Error deleting comments, proceeding anyway:', commentsError.message);
    }

    // 2. Delete the blog post and use .select() to verify it happened
    const { data, error } = await supabase
      .from("blogs")
      .delete()
      .eq("id", id)
      .select();

    if (error) {
      console.error('Supabase delete error:', error);
      throw new Error(error.message);
    }

    if (!data || data.length === 0) {
      console.error('No blog was deleted. This might be due to RLS policies.');
      throw new Error("You do not have permission to delete this post or it does not exist.");
    }

    console.log('Successfully deleted blog:', id);
    return id;
  },
);

export const {
  setBlogs,
  addBlog,
  updateBlog,
  deleteBlog,
  setLoading,
  setError,
  clearCurrentBlog,
} = blogSlice.actions;

export default blogSlice.reducer;
