import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchBlogs, deleteBlogAsync } from '../../features/blogSlice';
import { RootState, AppDispatch } from '../../store';
import { useAuth } from '../../contexts/AuthContext';
import BlogLayout from '../../layouts/BlogLayout';
import { Pagination } from '../../components/Pagination';

const BlogList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { blogs, totalCount, itemsPerPage, loading, error } = useSelector((state: RootState) => state.blogs);
  const { user } = useAuth();
  const navigate = useNavigate();
  const [blogToDelete, setBlogToDelete] = React.useState<string | null>(null);
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [currentPage, setCurrentPage] = React.useState(1);

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchBlogs({ userId: user.id, page: currentPage, limit: itemsPerPage }));
    }
  }, [dispatch, user, currentPage, itemsPerPage]);

  const handleDelete = async () => {
    if (!blogToDelete) return;

    setIsDeleting(true);
    try {
      await dispatch(deleteBlogAsync(blogToDelete)).unwrap();
      setBlogToDelete(null);
    } catch (err) {
      console.error('Delete error:', err);
      alert('Failed to delete blog post');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <BlogLayout>
      <div className="max-w-[1200px] w-full p-8">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <h1 className="text-[#111418] dark:text-white text-4xl font-black leading-tight tracking-[-0.033em]">My Posts</h1>
          <button
            onClick={() => navigate('/blog/new')}
            className="flex items-center gap-2 text-[#617289] dark:text-slate-400 hover:text-primary transition-colors group"
          >
            <span className="material-symbols-outlined text-sm font-bold">add</span>
            <span className="truncate">Create New Blog</span>
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-xl border border-red-100 dark:border-red-800">
            Error: {error}
          </div>
        ) : (
          <div className="mb-6 bg-white dark:bg-slate-900 rounded-xl border border-[#dbe0e6] dark:border-slate-800 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-background-light dark:bg-slate-800/50">
                    <th className="px-6 py-4 text-[#111418] dark:text-slate-200 text-xs font-bold uppercase tracking-widest w-[40%]">Blog Title</th>
                    <th className="px-6 py-4 text-[#111418] dark:text-slate-200 text-xs font-bold uppercase tracking-widest w-[25%]">URL Slug</th>
                    <th className="px-6 py-4 text-[#111418] dark:text-slate-200 text-xs font-bold uppercase tracking-widest w-[15%]">Last Updated</th>
                    <th className="px-6 py-4 text-[#111418] dark:text-slate-200 text-xs font-bold uppercase tracking-widest w-[20%] text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {blogs.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-10 text-center text-[#617289] dark:text-slate-400 italic">
                        No blog posts found. Create your first one!
                      </td>
                    </tr>
                  ) : (
                    blogs.map((blog) => (
                      <tr key={blog.id} className="border-t border-[#dbe0e6] dark:border-slate-800 hover:bg-background-light dark:hover:bg-slate-800/30 transition-colors">
                        <td className="px-6 py-5">
                          <div className="flex flex-col">
                            <span className="text-[#111418] dark:text-white text-sm font-semibold">{blog.title}</span>
                            <span className="text-[#617289] dark:text-slate-400 text-xs truncate max-w-[300px]">
                              {blog.content?.replace(/<[^>]*>/g, ' ').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim().substring(0, 60)}...
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <span className="text-[#617289] dark:text-slate-400 text-xs font-medium bg-gray-50 dark:bg-slate-800/50 px-2 py-1 rounded">
                            /blog/{user?.email?.split('@')[0] || 'author'}/{blog.slug}
                          </span>
                        </td>
                        <td className="px-6 py-5">
                          <span className="text-[#617289] dark:text-slate-400 text-sm">
                            {blog.updated_at && new Date(blog.updated_at).toLocaleDateString()}
                          </span>
                        </td>
                        <td className="px-6 py-5 text-right">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => {
                                const usernamePrefix = user?.email?.split('@')[0] || 'author';
                                window.open(`/blog/${usernamePrefix}/${blog.slug}`, '_blank');
                              }}
                              className="p-2 text-[#617289] dark:text-slate-400 hover:text-primary transition-colors"
                              title="View"
                            >
                              <span className="material-symbols-outlined text-xl">visibility</span>
                            </button>
                            <button
                              onClick={() => navigate(`/blog/edit/${blog.id}`)}
                              className="p-2 text-[#617289] dark:text-slate-400 hover:text-primary transition-colors"
                              title="Edit"
                            >
                              <span className="material-symbols-outlined text-xl">edit</span>
                            </button>
                            <button
                              onClick={() => setBlogToDelete(blog.id)}
                              className="p-2 text-[#617289] dark:text-slate-400 hover:text-red-500 transition-colors"
                              title="Delete"
                            >
                              <span className="material-symbols-outlined text-xl">delete</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <Pagination
              currentPage={currentPage}
              totalCount={totalCount}
              itemsPerPage={itemsPerPage}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </div>

      <AnimatePresence>
        {blogToDelete && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setBlogToDelete(null)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white dark:bg-slate-900 rounded-[2rem] p-8 max-w-md w-full shadow-2xl relative z-10 border border-gray-100 dark:border-slate-800"
            >
              <div className="w-16 h-16 bg-red-50 dark:bg-red-900/20 rounded-2xl flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-red-600 text-3xl">delete_forever</span>
              </div>
              <h3 className="text-2xl font-bold text-[#111418] dark:text-white mb-2">Delete Post?</h3>
              <p className="text-[#617289] dark:text-slate-400 text-sm mb-8 leading-relaxed">
                Are you sure you want to delete this blog post? This action cannot be undone and the content will be permanently removed.
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => setBlogToDelete(null)}
                  className="flex-1 px-6 py-4 rounded-xl bg-gray-50 dark:bg-slate-800 text-[#111418] dark:text-white text-sm font-bold hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="flex-1 px-6 py-4 rounded-xl bg-red-600 text-white text-sm font-bold hover:bg-red-700 transition-colors shadow-lg shadow-red-600/20 disabled:opacity-50"
                >
                  {isDeleting ? 'Deleting...' : 'Delete Post'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </BlogLayout>
  );
};

export default BlogList;
