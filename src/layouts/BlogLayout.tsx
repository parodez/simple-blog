import React from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';

interface BlogLayoutProps {
    children: React.ReactNode;
    navbarActions?: React.ReactNode;
}

const BlogLayout: React.FC<BlogLayoutProps> = ({ children, navbarActions }) => {
    return (
        <div className="bg-background-light dark:bg-background-dark min-h-screen font-sans transition-colors duration-300">
            <Navbar actions={navbarActions} />
            <div className="layout-container flex flex-col items-center animate-fade-in">
                {children}
            </div>
            <div className="max-w-[850px] mx-auto w-full px-6">
                <Footer />
            </div>
        </div>
    );
};

export default BlogLayout;
