import React from 'react';
import { Link } from 'react-router-dom';

interface LogoProps {
    variant?: 'header' | 'card';
    className?: string;
    link?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ variant = 'header', className = '', link = false }) => {
    const isHeader = variant === 'header';

    const content = (
        <div className={`flex ${isHeader ? 'items-center gap-3' : 'flex-col items-center gap-6'} select-none ${className}`}>
            <div className={`
                bg-primary flex items-center justify-center shadow-primary/20
                ${isHeader ? 'w-9 h-9 rounded-xl shadow-lg' : 'w-24 h-24 rounded-[2.5rem] shadow-2xl ring-8 ring-white/30'}
            `}>
                <span className={`material-symbols-outlined text-white ${isHeader ? 'text-2xl' : 'text-[70px]'}`}>
                    edit_note
                </span>
            </div>
            <div className={isHeader ? '' : 'space-y-1'}>
                <span className={`
                    text-text-main dark:text-white font-black tracking-tighter
                    ${isHeader ? 'text-xl' : 'text-5xl'}
                `}>
                    SimpleBlog
                </span>
            </div>
        </div>
    );

    if (link) {
        return (
            <Link to="/blog" className="hover:opacity-90 transition-opacity">
                {content}
            </Link>
        );
    }

    return content;
};

export default Logo;
