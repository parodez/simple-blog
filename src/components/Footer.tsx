import React from 'react';

export const Footer: React.FC = () => {
    return (
        <footer className="mt-24 pb-12 pt-10 border-t border-gray-100 dark:border-slate-800 text-center">
            <div className="flex items-center justify-center gap-8 mb-6">
                <button className="text-gray-400 hover:text-primary transition-colors">
                    <span className="material-symbols-outlined">share</span>
                </button>
                <button className="text-gray-400 hover:text-primary transition-colors">
                    <span className="material-symbols-outlined">bookmark</span>
                </button>
            </div>
            <p className="text-gray-400 text-sm">© {new Date().getFullYear()} Parodez</p>
        </footer>
    );
};
