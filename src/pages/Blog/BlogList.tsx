import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchBlogs } from '../../features/blogSlice';
import { RootState, AppDispatch } from '../../store';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const BlogList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { blogs, loading, error } = useSelector((state: RootState) => state.blogs);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchBlogs(user?.id));
    }
  }, [dispatch, user]);

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

  return (
    <div className="bg-background-light dark:bg-background-dark text-[#111418] dark:text-white min-h-screen font-sans">
      <header className="sticky top-0 z-50 w-full bg-white dark:bg-slate-900 border-b border-[#dbe0e6] dark:border-slate-800 shadow-sm">
        <div className="max-w-[1200px] mx-auto px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <div className="flex flex-col">
              <h1 className="text-primary text-xl font-black leading-none tracking-tight">SimpleBlog</h1>
            </div>
          </div>
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

          {!loading && !error && blogs.length > 0 && (
            <div className="flex items-center justify-between px-2 py-4">
              <p className="text-sm text-[#617289] dark:text-slate-400">Showing {blogs.length} posts</p>
              <div className="flex gap-2">
                <button className="flex items-center justify-center w-10 h-10 rounded-lg border border-[#dbe0e6] dark:border-slate-800 bg-white dark:bg-slate-900 text-[#617289] hover:bg-background-light dark:hover:bg-slate-800 transition-colors">
                  <span className="material-symbols-outlined">chevron_left</span>
                </button>
                <button className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary text-white font-bold">1</button>
                <button className="flex items-center justify-center w-10 h-10 rounded-lg border border-[#dbe0e6] dark:border-slate-800 bg-white dark:bg-slate-900 text-[#617289] hover:bg-background-light dark:hover:bg-slate-800 transition-colors">2</button>
                <button className="flex items-center justify-center w-10 h-10 rounded-lg border border-[#dbe0e6] dark:border-slate-800 bg-white dark:bg-slate-900 text-[#617289] hover:bg-background-light dark:hover:bg-slate-800 transition-colors">3</button>
                <button className="flex items-center justify-center w-10 h-10 rounded-lg border border-[#dbe0e6] dark:border-slate-800 bg-white dark:bg-slate-900 text-[#617289] hover:bg-background-light dark:hover:bg-slate-800 transition-colors">
                  <span className="material-symbols-outlined">chevron_right</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default BlogList;
