import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchBlogBySlug } from '../../features/blogSlice';
import { fetchComments, createComment } from '../../features/commentSlice';
import { RootState, AppDispatch } from '../../store';
import { useAuth } from '../../contexts/AuthContext';
import { Logo } from '../../components/Logo';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../supabaseClient';

const BlogDetail: React.FC = () => {
    const { slug } = useParams<{ slug: string }>();
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const { currentBlog: blog, loading, error } = useSelector((state: RootState) => state.blogs);
    const { comments } = useSelector((state: RootState) => state.comments);
    const { user } = useAuth();

    const [commentName, setCommentName] = useState('');
    const [commentEmail, setCommentEmail] = useState('');
    const [commentContent, setCommentContent] = useState('');
    const [commentImageUrl, setCommentImageUrl] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isUploadingImage, setIsUploadingImage] = useState(false);

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

    const handleCommentImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploadingImage(true);
        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${Date.now()}-${Math.floor(Math.random() * 1000)}.${fileExt}`;
            const filePath = `public/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('images')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data } = supabase.storage
                .from('images')
                .getPublicUrl(filePath);

            if (data?.publicUrl) {
                setCommentImageUrl(data.publicUrl);
            }
        } catch (error: any) {
            console.error('Comment image upload failed:', error);
            alert(`Failed to upload image: ${error.message}`);
        } finally {
            setIsUploadingImage(false);
            if (e.target) e.target.value = '';
        }
    };

    const handleCommentSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!blog?.id || !commentName.trim() || !commentContent.trim()) return;

        setIsSubmitting(true);
        try {
            await dispatch(createComment({
                blog_id: blog.id,
                name: commentName,
                email: commentEmail,
                content: commentContent,
                image_url: commentImageUrl,
            })).unwrap();
            setCommentContent('');
            setCommentImageUrl('');
            // Optional: clear name/email or keep them for convenience
        } catch (err: any) {
            console.error('Failed to post comment:', err);
            alert(`Failed to post comment: ${err.message || 'Please try again.'}`);
        } finally {
            setIsSubmitting(false);
        }
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

    return (
        <div className="bg-background-light dark:bg-background-dark min-h-screen font-sans">
            <nav className="sticky top-0 z-50 w-full bg-white/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-gray-100 dark:border-slate-800">
                <div className="max-w-7xl mx-auto px-6 sm:px-8 h-16 flex items-center justify-between">
                    <Logo link />
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

                        {/* Comment Form */}
                        <div className="glass-card p-8 rounded-[2rem] border border-gray-100 dark:border-slate-800 shadow-xl shadow-blue-500/5 mb-16">
                            <h3 className="text-xl font-bold text-[#111418] dark:text-white mb-6">Leave a response</h3>
                            <form onSubmit={handleCommentSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-widest text-[#64748b] dark:text-slate-400 ml-2">Your Name</label>
                                        <input
                                            type="text"
                                            required
                                            value={commentName}
                                            onChange={(e) => setCommentName(e.target.value)}
                                            placeholder="John Doe"
                                            className="w-full rounded-2xl border-gray-100 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-900/50 h-14 px-6 text-[#111418] dark:text-white focus:ring-4 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-widest text-[#64748b] dark:text-slate-400 ml-2">Email Address (Optional)</label>
                                        <input
                                            type="email"
                                            value={commentEmail}
                                            onChange={(e) => setCommentEmail(e.target.value)}
                                            placeholder="john@example.com"
                                            className="w-full rounded-2xl border-gray-100 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-900/50 h-14 px-6 text-[#111418] dark:text-white focus:ring-4 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-[#64748b] dark:text-slate-400 ml-2">Comment</label>
                                    <textarea
                                        required
                                        rows={4}
                                        value={commentContent}
                                        onChange={(e) => setCommentContent(e.target.value)}
                                        placeholder="What are your thoughts?"
                                        className="w-full rounded-[2rem] border-gray-100 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-900/50 p-6 text-[#111418] dark:text-white focus:ring-4 focus:ring-primary/20 focus:border-primary transition-all outline-none resize-none"
                                    />
                                </div>

                                {/* Comment Image Upload */}
                                <div className="flex flex-col gap-4">
                                    <label className="text-xs font-bold uppercase tracking-widest text-[#64748b] dark:text-slate-400 ml-2">Attach Image (Optional)</label>
                                    <div className="flex items-center gap-4">
                                        {!commentImageUrl ? (
                                            <label className="cursor-pointer group flex items-center justify-center w-14 h-14 rounded-2xl bg-gray-50 dark:bg-slate-900/50 border-2 border-dashed border-gray-200 dark:border-slate-800 hover:border-primary dark:hover:border-primary transition-all">
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleCommentImageUpload}
                                                    className="hidden"
                                                    disabled={isUploadingImage}
                                                />
                                                {isUploadingImage ? (
                                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
                                                ) : (
                                                    <span className="material-symbols-outlined text-[#64748b] group-hover:text-primary transition-colors">add_photo_alternate</span>
                                                )}
                                            </label>
                                        ) : (
                                            <div className="relative group w-24 h-24 rounded-2xl overflow-hidden shadow-lg">
                                                <img src={commentImageUrl} alt="Preview" className="w-full h-full object-cover" />
                                                <button
                                                    type="button"
                                                    onClick={() => setCommentImageUrl('')}
                                                    className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                                                >
                                                    <span className="material-symbols-outlined text-white">delete</span>
                                                </button>
                                            </div>
                                        )}
                                        {!commentImageUrl && !isUploadingImage && (
                                            <span className="text-sm text-[#64748b] dark:text-slate-500">Add an image to your comment</span>
                                        )}
                                    </div>
                                </div>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="bg-primary hover:bg-blue-600 disabled:opacity-50 text-white font-bold py-4 px-10 rounded-2xl transition-all shadow-lg shadow-blue-500/20 active:scale-[0.98]"
                                >
                                    {isSubmitting ? 'Posting...' : 'Post Comment'}
                                </button>
                            </form>
                        </div>

                        {/* Comment List */}
                        <div className="space-y-8">
                            <AnimatePresence mode="popLayout">
                                {comments.map((comment) => (
                                    <motion.div
                                        key={comment.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        className="flex gap-6"
                                    >
                                        <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-blue-500/20">
                                            {comment.name.substring(0, 1).toUpperCase()}
                                        </div>
                                        <div className="flex-1 space-y-2 pt-1">
                                            <div className="flex items-center justify-between">
                                                <h4 className="font-bold text-[#111418] dark:text-white">
                                                    {comment.name}
                                                    {comment.email && (
                                                        <span className="text-sm font-normal text-[#64748b] dark:text-slate-500 ml-1">
                                                            ({comment.email})
                                                        </span>
                                                    )}
                                                </h4>
                                                <span className="text-xs text-[#64748b] dark:text-slate-500 font-medium">
                                                    {new Date(comment.created_at).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <p className="text-[#64748b] dark:text-slate-400 leading-relaxed">
                                                {comment.content}
                                            </p>
                                            {comment.image_url && (
                                                <div className="mt-4 max-w-sm rounded-2xl overflow-hidden shadow-md">
                                                    <img src={comment.image_url} alt="Attached" className="w-full h-auto cursor-pointer hover:scale-[1.02] transition-transform" onClick={() => window.open(comment.image_url, '_blank')} />
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>

                            {comments.length === 0 && (
                                <p className="text-center text-[#64748b] dark:text-slate-500 italic py-10">
                                    Be the first to share your thoughts on this post.
                                </p>
                            )}
                        </div>
                    </section>


                    <footer className="mt-32 pt-10 border-t border-gray-100 dark:border-slate-800 text-center">
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
