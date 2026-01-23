import React from 'react';
import { motion } from 'framer-motion';
import { Comment } from '../../features/commentSlice';

interface CommentItemProps {
    comment: Comment;
}

export const CommentItem: React.FC<CommentItemProps> = ({ comment }) => {
    return (
        <motion.div
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
                        <img
                            src={comment.image_url}
                            alt="Attached"
                            className="w-full h-auto cursor-pointer hover:scale-[1.02] transition-transform"
                            onClick={() => window.open(comment.image_url, '_blank')}
                        />
                    </div>
                )}
            </div>
        </motion.div>
    );
};
