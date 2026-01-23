import { motion, AnimatePresence } from 'framer-motion';
import { Outlet, useLocation } from 'react-router-dom';

interface AuthLayoutProps {
    heroText: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ heroText }) => {
    const location = useLocation();

    return (
        <div className="flex h-screen w-full relative immersive-bg items-start justify-center py-6 md:py-12 px-4 overflow-x-hidden overflow-y-auto no-scrollbar">
            {/* Background blobs */}
            <div className="fixed top-20 right-[15%] w-64 h-64 bg-accent/20 rounded-full blur-[100px] pointer-events-none"></div>
            <div className="fixed bottom-20 left-[10%] w-96 h-96 bg-primary/20 rounded-full blur-[120px] pointer-events-none"></div>

            {/* Left side text for large screens */}
            <div className="hidden lg:flex fixed left-20 top-1/2 -translate-y-1/2 flex-col gap-6 z-10">
                <div className="glass-quote p-12 rounded-[2.5rem] shadow-2xl max-w-xl">
                    <h1 className="text-white text-8xl font-black leading-[1.1] tracking-tighter">
                        {heroText}
                    </h1>
                    <div className="mt-8 h-1.5 w-32 bg-accent rounded-full shadow-[0_0_20px_rgba(0,210,255,0.5)]"></div>
                </div>
            </div>

            <main className="w-full max-w-[520px] lg:ml-auto lg:mr-32 z-20">
                <AnimatePresence mode="popLayout">
                    <motion.div
                        key={location.pathname}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{
                            duration: 0.4,
                            ease: "easeOut"
                        }}
                    >
                        <Outlet />
                    </motion.div>
                </AnimatePresence>
            </main>
        </div>
    );
};

export default AuthLayout;
