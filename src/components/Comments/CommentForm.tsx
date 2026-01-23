import React, { useState } from 'react';
import { supabase } from '../../supabaseClient';

interface CommentFormProps {
    onCommentSubmit: (data: { name: string, email: string, content: string, imageUrl: string }) => Promise<void>;
}

export const CommentForm: React.FC<CommentFormProps> = ({ onCommentSubmit }) => {
    const [commentName, setCommentName] = useState('');
    const [commentEmail, setCommentEmail] = useState('');
    const [commentContent, setCommentContent] = useState('');
    const [commentImageUrl, setCommentImageUrl] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isUploadingImage, setIsUploadingImage] = useState(false);

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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!commentName.trim() || !commentContent.trim()) return;

        setIsSubmitting(true);
        try {
            await onCommentSubmit({
                name: commentName,
                email: commentEmail,
                content: commentContent,
                imageUrl: commentImageUrl
            });
            setCommentContent('');
            setCommentImageUrl('');
        } catch (err: any) {
            console.error('Failed to post comment:', err);
            alert(`Failed to post comment: ${err.message || 'Please try again.'}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="glass-card p-8 rounded-[2rem] border border-gray-100 dark:border-slate-800 shadow-xl shadow-blue-500/5 mb-16">
            <h3 className="text-xl font-bold text-[#111418] dark:text-white mb-6">Leave a response</h3>
            <form onSubmit={handleSubmit} className="space-y-6">
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
    );
};
