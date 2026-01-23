import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchBlogs } from '../../features/blogSlice';
import { RootState, AppDispatch } from '../../store';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Logo } from '../../components/Logo';
import { deleteBlogAsync } from '../../features/blogSlice';
import { AnimatePresence, motion } from 'framer-motion';

const BlogList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { blogs, totalCount, itemsPerPage, loading, error } = useSelector((state: RootState) => state.blogs);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [blogToDelete, setBlogToDelete] = React.useState<string | null>(null);
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [currentPage, setCurrentPage] = React.useState(1);

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchBlogs({ userId: user.id, page: currentPage, limit: itemsPerPage }));
    }
  }, [dispatch, user, currentPage, itemsPerPage]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      alert('Error logging out');
    }
  };

  const getInitials = (email?: string) => {
    if (!email) return '??';
    return email.substring(0, 2).toUpperCase();
  };

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
    <div className="bg-background-light dark:bg-background-dark text-[#111418] dark:text-white min-h-screen font-sans">
      <header className="sticky top-0 z-50 w-full bg-white dark:bg-slate-900 border-b border-[#dbe0e6] dark:border-slate-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 h-16 flex items-center justify-between">
          <Logo link />
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3 pr-6 border-r border-[#dbe0e6] dark:border-slate-800">
              <div className="flex flex-col text-right">
                <p className="text-sm font-bold dark:text-white leading-none">
                  {user?.email?.split('@')[0] || 'Author'}
                </p>
              </div>
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold">
                {getInitials(user?.email)}
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-transparent text-[#617289] dark:text-slate-400 hover:text-red-500 transition-colors group"
            >
              <span className="material-symbols-outlined text-xl group-hover:text-red-500">logout</span>
              <span className="text-sm font-medium">Logout</span>
            </button>
          </div>
        </div>
      </header>
      <main className="w-full">
        <div className="max-w-[1200px] mx-auto p-8">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-[#111418] dark:text-white text-4xl font-black leading-tight tracking-[-0.033em]">My Posts</h1>
            </div>
            <button
              onClick={() => navigate('/blog/new')}
              className="flex items-center gap-2 text-[#617289] dark:text-slate-400 hover:text-red-500 transition-colors group"
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
              <div className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-background-light dark:bg-slate-800/50">
                        <th className="px-6 py-4 text-[#111418] dark:text-slate-200 text-xs font-bold uppercase tracking-widest w-[50%]">Blog Title</th>
                        <th className="px-6 py-4 text-[#111418] dark:text-slate-200 text-xs font-bold uppercase tracking-widest w-[25%]">Date</th>
                        <th className="px-6 py-4 text-[#111418] dark:text-slate-200 text-xs font-bold uppercase tracking-widest w-[25%] text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {blogs.length === 0 ? (
                        <tr>
                          <td colSpan={3} className="px-6 py-10 text-center text-[#617289] dark:text-slate-400 italic">
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
                              <span className="text-[#617289] dark:text-slate-400 text-sm">
                                {blog.created_at && new Date(blog.created_at).toLocaleDateString()}
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
              </div>
            </div>
          )}

          {!loading && !error && totalCount > 0 && (
            <div className="flex items-center justify-between px-2 py-4">
              <p className="text-sm text-[#617289] dark:text-slate-400">
                Showing {blogs.length} of {totalCount} posts
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="flex items-center justify-center w-10 h-10 rounded-lg border border-[#dbe0e6] dark:border-slate-800 bg-white dark:bg-slate-900 text-[#617289] hover:bg-background-light dark:hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <span className="material-symbols-outlined">chevron_left</span>
                </button>

                {(() => {
                  const totalPages = Math.ceil(totalCount / itemsPerPage);
                  if (totalPages <= 1) return null;

                  const pages = new Set<number>([1, totalPages]);

                  // Calculate the central 3 pages window
                  let start = Math.max(1, currentPage - 1);
                  let end = Math.min(totalPages, currentPage + 1);

                  // Shift window if at boundaries to show 3 if possible
                  if (currentPage === 1) end = Math.min(totalPages, 3);
                  if (currentPage === totalPages) start = Math.max(1, totalPages - 2);

                  for (let i = start; i <= end; i++) {
                    pages.add(i);
                  }

                  return Array.from(pages)
                    .sort((a, b) => a - b)
                    .map((page, index, array) => (
                      <React.Fragment key={page}>
                        {index > 0 && page !== array[index - 1] + 1 && (
                          <span className="flex items-center justify-center w-6 text-[#617289] font-bold">...</span>
                        )}
                        <button
                          onClick={() => setCurrentPage(page)}
                          className={`flex items-center justify-center w-10 h-10 rounded-lg font-bold transition-colors ${currentPage === page
                              ? 'bg-primary text-white shadow-lg shadow-primary/20'
                              : 'border border-[#dbe0e6] dark:border-slate-800 bg-white dark:bg-slate-900 text-[#617289] hover:bg-background-light dark:hover:bg-slate-800'
                            }`}
                        >
                          {page}
                        </button>
                      </React.Fragment>
                    ));
                })()}

                <button
                  onClick={() => setCurrentPage(prev => Math.min(Math.ceil(totalCount / itemsPerPage), prev + 1))}
                  disabled={currentPage === Math.ceil(totalCount / itemsPerPage)}
                  className="flex items-center justify-center w-10 h-10 rounded-lg border border-[#dbe0e6] dark:border-slate-800 bg-white dark:bg-slate-900 text-[#617289] hover:bg-background-light dark:hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <span className="material-symbols-outlined">chevron_right</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

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
    </div>
  );
};

export default BlogList;
