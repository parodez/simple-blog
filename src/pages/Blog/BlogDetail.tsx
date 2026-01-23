import React, { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchBlogBySlug } from '../../features/blogSlice';
import { fetchComments, createComment } from '../../features/commentSlice';
import { RootState, AppDispatch } from '../../store';
import { useAuth } from '../../contexts/AuthContext';
import { AnimatePresence } from 'framer-motion';
import BlogLayout from '../../layouts/BlogLayout';
import { CommentForm } from '../../components/Comments/CommentForm';
import { CommentItem } from '../../components/Comments/CommentItem';

const BlogDetail: React.FC = () => {
    const { slug } = useParams<{ slug: string }>();
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const { currentBlog: blog, loading, error } = useSelector((state: RootState) => state.blogs);
    const { comments } = useSelector((state: RootState) => state.comments);
    const { user } = useAuth();

    useEffect(() => {
        if (slug) {
            dispatch(fetchBlogBySlug(slug));
        }
    }, [dispatch, slug]);

    useEffect(() => {
        if (blog?.id) {
            dispatch(fetchComments(blog.id));
        }
    }, [dispatch, blog?.id]);

    const handleCommentSubmit = async (data: { name: string, email: string, content: string, imageUrl: string }) => {
        if (!blog?.id) return;

        await dispatch(createComment({
            blog_id: blog.id,
            name: data.name,
            email: data.email,
            content: data.content,
            image_url: data.imageUrl,
        })).unwrap();
    };

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

    const navbarActions = (
        user ? (
            <Link
                to="/blog"
                className="bg-primary hover:bg-blue-600 text-white font-semibold py-2 px-5 rounded-full transition-colors duration-200 text-sm md:text-base shadow-lg shadow-primary/20"
            >
                My Blogs
            </Link>
        ) : (
            <Link
                to="/register"
                className="bg-primary hover:bg-blue-600 text-white font-semibold py-2 px-5 rounded-full transition-colors duration-200 text-sm md:text-base shadow-lg shadow-primary/20"
            >
                Create Your Own Blog
            </Link>
        )
    );

    return (
        <BlogLayout navbarActions={navbarActions}>
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
                    className="prose prose-lg md:prose-xl dark:prose-invert article-content max-w-none mx-auto mb-20"
                    dangerouslySetInnerHTML={{ __html: blog.content }}
                />

                {/* Comments Section */}
                <section className="mt-20 pt-20 border-t border-gray-100 dark:border-slate-800">
                    <h2 className="text-3xl font-black text-[#111418] dark:text-white mb-10 flex items-center gap-4">
                        Comments
                        <span className="bg-primary/10 text-primary px-4 py-1 rounded-full text-lg font-bold">
                            {comments.length}
                        </span>
                    </h2>

                    <CommentForm onCommentSubmit={handleCommentSubmit} />

                    <div className="space-y-8">
                        <AnimatePresence mode="popLayout">
                            {comments.map((comment) => (
                                <CommentItem key={comment.id} comment={comment} />
                            ))}
                        </AnimatePresence>

                        {comments.length === 0 && (
                            <p className="text-center text-[#64748b] dark:text-slate-500 italic py-10">
                                Be the first to share your thoughts on this post.
                            </p>
                        )}
                    </div>
                </section>
            </main>
        </BlogLayout>
    );
};

export default BlogDetail;
