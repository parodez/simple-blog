import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Logo } from './Logo';
import { useAuth } from '../contexts/AuthContext';

interface NavbarProps {
    actions?: React.ReactNode;
}

export const Navbar: React.FC<NavbarProps> = ({ actions }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        console.log('Logout initiating...');
        try {
            await logout();
        } catch (error: any) {
            console.error('Logout error (silent):', error);
            // Even if signOut fails (e.g. session already invalid), we want to clear local UI
        } finally {
            console.log('Redirecting to login');
            navigate('/login');
        }
    };

    return (
        <nav className="sticky top-0 z-50 w-full bg-white/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-gray-100 dark:border-slate-800">
            <div className="max-w-7xl mx-auto px-6 sm:px-8 h-16 flex items-center justify-between">
                <Logo link />
                <div className="flex items-center gap-6">
                    {/* Page-Specific Actions */}
                    <div className="flex items-center gap-4">
                        {actions}
                    </div>

                    {/* Universal User Section */}
                    {user ? (
                        <div className="flex items-center gap-4 pl-6 border-l border-gray-100 dark:border-slate-800">
                            <div className="hidden sm:flex flex-col text-right">
                                <p className="text-xs font-bold dark:text-white leading-none">
                                    {user.email?.split('@')[0]}
                                </p>
                            </div>
                            <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold border border-primary/20">
                                {user.email?.substring(0, 2).toUpperCase()}
                            </div>
                            <button
                                type="button"
                                onClick={handleLogout}
                                className="flex items-center gap-2 text-[#64748b] dark:text-slate-400 hover:text-red-500 transition-colors group cursor-pointer"
                                title="Log out"
                            >
                                <span className="material-symbols-outlined text-xl group-hover:text-red-500">logout</span>
                                <span className="text-sm font-medium hidden md:block">Log out</span>
                            </button>
                        </div>
                    ) : !actions && (
                        <Link
                            to="/register"
                            className="bg-primary hover:bg-blue-600 text-white font-semibold py-2 px-5 rounded-full transition-colors duration-200 text-sm md:text-base shadow-lg shadow-primary/20"
                        >
                            Create Your Own Blog
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
};
