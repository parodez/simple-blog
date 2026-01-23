import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, Navigate, Link } from 'react-router-dom';

const Login: React.FC = () => {
  const { user, login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (user) return <Navigate to="/blog" />;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      await login(email, password);
      navigate('/blog');
    } catch (err: any) {
      console.error('Login error:', err);
      setError('Invalid email or password. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full overflow-hidden bg-gray-50 dark:bg-surface-dark font-sans antialiased">
      {/* Left hero section */}
      <section className="hidden lg:flex lg:w-1/2 relative bg-login-hero bg-cover bg-center items-center justify-center">
        <div className="absolute inset-0 bg-primary/25 backdrop-blur-[4px]" />
        <div className="relative z-10 p-16 max-w-xl">
          <header>
          </header>
        </div>
      </section>

      {/* Right form section */}
      <main className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 sm:p-12 md:p-24 bg-surface-light dark:bg-surface-dark relative">
        <div className="w-full max-w-[440px] flex flex-col gap-10">

          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
              <span className="material-symbols-outlined text-white text-3xl">edit_note</span>
            </div>
            <span className="text-text-main dark:text-white text-2xl font-bold tracking-tight">SimpleBlog</span>
          </div>

          {/* Intro */}
          {/* <div className="space-y-3">
            <h2 className="text-text-main dark:text-white text-4xl font-black tracking-tight">Welcome Back</h2>
          </div> */}

          {/* Form */}
          <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
            {error && (
              <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm font-medium border border-red-100 dark:border-red-800">
                {error}
              </div>
            )}

            <div className="form-input-container flex flex-col gap-2">
              <label className="text-text-main dark:text-white text-sm font-semibold transition-colors" htmlFor="email">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 h-14 px-4 text-text-main dark:text-white placeholder:text-gray-400 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
              />
            </div>

            <div className="form-input-container flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <label className="text-text-main dark:text-white text-sm font-semibold transition-colors" htmlFor="password">
                  Password
                </label>
                <a className="text-primary text-sm font-bold hover:text-primary/80 transition-colors" href="#">
                  Forgot password?
                </a>
              </div>
              <div className="relative group">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 h-14 px-4 pr-12 text-text-main dark:text-white placeholder:text-gray-400 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                />
              </div>
            </div>

            <div className="flex items-center">
              <label className="flex items-center gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary/20 transition-all cursor-pointer"
                />
                <span className="text-text-muted dark:text-gray-300 text-sm font-medium">Keep me signed in</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-xl transition-all shadow-xl shadow-primary/20 transform active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          <footer className="space-y-6">
            <p className="text-center text-text-muted dark:text-gray-400 text-sm font-medium">
              Don't have an account?{' '}
              <Link to="/register" className="text-primary font-bold hover:underline decoration-2 underline-offset-4">
                Sign Up
              </Link>
            </p>
            <div className="pt-6 border-t border-gray-100 dark:border-gray-100 dark:border-gray-800 text-center">
              <p className="text-gray-400 dark:text-gray-500 text-xs font-normal">
                © 2024 BlogFlow Platform. Secure enterprise login.
              </p>
            </div>
          </footer>
        </div>
      </main >
    </div >
  );
};

export default Login;
