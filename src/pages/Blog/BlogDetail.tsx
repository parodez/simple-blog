import React, { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchBlogBySlug } from '../../features/blogSlice';
import { RootState, AppDispatch } from '../../store';
import { useAuth } from '../../contexts/AuthContext';

const BlogDetail: React.FC = () => {
    const { slug } = useParams<{ slug: string }>();
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const { currentBlog: blog, loading, error } = useSelector((state: RootState) => state.blogs);
    const { user } = useAuth();

    useEffect(() => {
        if (slug) {
            dispatch(fetchBlogBySlug(slug));
        }
    }, [dispatch, slug]);



    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (error || !blog) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen p-6">
                <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
                <p className="text-gray-600 mb-6">{error || 'Blog post not found.'}</p>
                <button
                    onClick={() => navigate('/blog')}
                    className="bg-primary text-white py-2 px-6 rounded-full font-semibold"
                >
                    Back to list
                </button>
            </div>
        );
    }

    const formattedDate = blog.created_at
        ? new Date(blog.created_at).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        })
        : '';

    const updatedDate = blog.updated_at
        ? new Date(blog.updated_at).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        })
        : null;

    return (
        <div className="bg-background-light dark:bg-background-dark min-h-screen font-sans">
            <nav className="sticky top-0 z-50 w-full bg-white/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-gray-100 dark:border-slate-800">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Link to="/blog" className="flex items-center gap-2.5 group">
                            <div className="bg-primary rounded-lg p-1 flex items-center justify-center">
                                <span className="material-symbols-outlined text-white text-xl font-bold">article</span>
                            </div>
                            <span className="font-display font-bold text-xl tracking-tight text-[#111418] dark:text-white">SimpleBlog</span>
                        </Link>
                    </div>
                    <div className="flex items-center">
                        {user ? (
                            <Link
                                to="/blog"
                                className="bg-primary hover:bg-blue-600 text-white font-semibold py-2 px-5 rounded-full transition-colors duration-200 text-sm md:text-base"
                            >
                                My Blogs
                            </Link>
                        ) : (
                            <Link
                                to="/register"
                                className="bg-primary hover:bg-blue-600 text-white font-semibold py-2 px-5 rounded-full transition-colors duration-200 text-sm md:text-base"
                            >
                                Create Your Own Blog
                            </Link>
                        )}

                    </div>
                </div>
            </nav>

            <div className="layout-container flex flex-col items-center">
                <main className="w-full max-w-[850px] px-6 py-12 md:py-20">
                    <header className="mb-12 text-center">
                        <h1 className="font-display text-[#111418] dark:text-white tracking-tight text-4xl md:text-5xl lg:text-6xl font-extrabold leading-[1.1] mb-8">
                            {blog.title}
                        </h1>
                        <div className="flex flex-col items-center justify-center gap-3 text-[#64748b] dark:text-slate-400 text-sm md:text-base font-medium">
                            <div className="flex flex-wrap items-center justify-center gap-6">
                                <span className="flex items-center gap-2">
                                    <span className="material-symbols-outlined text-[18px]">calendar_today</span>
                                    Published on {formattedDate}
                                </span>
                                {updatedDate && (
                                    <span className="flex items-center gap-2">
                                        <span className="material-symbols-outlined text-[18px]">history</span>
                                        Updated {updatedDate}
                                    </span>
                                )}
                            </div>
                        </div>
                    </header>

                    {blog.image_url && (
                        <div className="mb-16">
                            <div className="w-full aspect-video rounded-2xl overflow-hidden shadow-2xl shadow-blue-500/10">
                                <img
                                    alt={blog.title}
                                    className="w-full h-full object-cover"
                                    src={blog.image_url}
                                />
                            </div>
                        </div>
                    )}

                    <article
                        className="prose prose-lg md:prose-xl dark:prose-invert article-content max-w-none mx-auto"
                        dangerouslySetInnerHTML={{ __html: blog.content }}
                    />


                    <footer className="mt-24 pt-10 border-t border-gray-100 dark:border-slate-800 text-center">
                        <div className="flex items-center justify-center gap-8 mb-6">
                            <button className="text-gray-400 hover:text-primary transition-colors">
                                <span className="material-symbols-outlined">share</span>
                            </button>
                            <button className="text-gray-400 hover:text-primary transition-colors">
                                <span className="material-symbols-outlined">bookmark</span>
                            </button>
                        </div>
                        <p className="text-gray-400 text-sm">© {new Date().getFullYear()} SimpleBlog. All rights reserved.</p>
                    </footer>
                </main>
            </div>
        </div>
    );
};

export default BlogDetail;
