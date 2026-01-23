import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, Navigate, Link } from 'react-router-dom';

const Register: React.FC = () => {
  const { user, register } = useAuth();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  if (user) return <Navigate to="/blog" />;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      setIsSubmitting(false);
      return;
    }

    try {
      await register(email, password);
      setSuccess('Registration successful! Please sign in with your new account.');
      setTimeout(() => navigate('/login'), 2500);
    } catch (err: any) {
      console.error('Registration error:', err);
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-background-light dark:bg-background-dark font-sans antialiased">
      {/* Left hero section */}
      <section className="hidden lg:flex lg:w-1/2 relative bg-reg-hero bg-cover bg-center items-center justify-center">
        <div className="absolute inset-0 bg-primary/30 backdrop-blur-md" />
        <div className="relative z-10 p-12 max-w-lg">
          <header>
            <h1 className="text-white text-6xl font-black leading-tight tracking-tight mb-4">
              Start your journey.
            </h1>
            <p className="text-white/90 text-xl font-normal">
              Create your account and join a global community of thinkers, writers, and creators.
            </p>
          </header>
        </div>
      </section>

      {/* Right form section */}
      <main className="w-full lg:w-1/2 flex flex-col justify-center items-center p-6 sm:p-12 md:p-20 bg-white dark:bg-background-dark relative overflow-y-auto">
        <div className="w-full max-w-[480px] flex flex-col gap-8">

          {/* Logo */}
          <div className="flex items-center gap-2 mb-2">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center shadow-lg shadow-primary/20">
              <span className="material-symbols-outlined text-white text-2xl">edit_note</span>
            </div>
            <span className="text-[#111418] dark:text-white text-xl font-bold tracking-tight">SimpleBlog</span>
          </div>

          {/* Intro */}
          <div className="flex flex-col gap-2">
            <h2 className="text-[#111418] dark:text-white text-4xl font-black leading-tight tracking-[-0.033em]">
              Create an account
            </h2>
            <p className="text-[#617289] dark:text-gray-400 text-base font-normal leading-normal">
              Fill in the details below to get started with SimpleBlog.
            </p>
          </div>

          {/* Form */}
          <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
            {error && (
              <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm font-medium border border-red-100 dark:border-red-800">
                {error}
              </div>
            )}
            {success && (
              <div className="p-4 rounded-xl bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 text-sm font-medium border border-green-100 dark:border-green-800">
                {success}
              </div>
            )}

            <div className="flex flex-col w-full">
              <label className="text-[#111418] dark:text-white text-sm font-medium leading-normal pb-2" htmlFor="fullName">
                Full Name
              </label>
              <input
                id="fullName"
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="John Doe"
                className="form-input flex w-full rounded-lg text-[#111418] dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-[#dbe0e6] dark:border-gray-700 bg-white dark:bg-gray-800 h-14 placeholder:text-[#617289] px-4 text-base font-normal leading-normal transition-all outline-none"
              />
            </div>

            <div className="flex flex-col w-full">
              <label className="text-[#111418] dark:text-white text-sm font-medium leading-normal pb-2" htmlFor="email">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                className="form-input flex w-full rounded-lg text-[#111418] dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-[#dbe0e6] dark:border-gray-700 bg-white dark:bg-gray-800 h-14 placeholder:text-[#617289] px-4 text-base font-normal leading-normal transition-all outline-none"
              />
            </div>

            <div className="flex flex-col w-full">
              <label className="text-[#111418] dark:text-white text-sm font-medium leading-normal pb-2" htmlFor="password">
                Password
              </label>
              <div className="relative flex items-center">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a password"
                  className="form-input flex w-full rounded-lg text-[#111418] dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-[#dbe0e6] dark:border-gray-700 bg-white dark:bg-gray-800 h-14 placeholder:text-[#617289] px-4 pr-12 text-base font-normal leading-normal transition-all outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 text-[#617289] hover:text-primary transition-colors flex items-center"
                >
                  <span className="material-symbols-outlined text-xl">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
              <p className="text-xs text-[#617289] mt-2 italic">Must be at least 8 characters long.</p>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-lg transition-colors shadow-lg shadow-primary/20 mt-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Signing Up...' : 'Sign Up'}
            </button>
          </form>

          {/* Social login divider */}
          <div className="relative flex items-center py-2">
            <div className="flex-grow border-t border-[#dbe0e6] dark:border-gray-700"></div>
            <span className="flex-shrink mx-4 text-[#617289] text-xs font-medium uppercase tracking-wider">
              Or sign up with
            </span>
            <div className="flex-grow border-t border-[#dbe0e6] dark:border-gray-700"></div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button className="flex items-center justify-center gap-3 border border-[#dbe0e6] dark:border-gray-700 rounded-lg py-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all font-medium text-[#111418] dark:text-white">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              Google
            </button>
            <button className="flex items-center justify-center gap-3 border border-[#dbe0e6] dark:border-gray-700 rounded-lg py-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all font-medium text-[#111418] dark:text-white">
              <svg className="w-5 h-5 fill-[#1DA1F2]" viewBox="0 0 24 24">
                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.84 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
              </svg>
              Twitter
            </button>
          </div>

          <footer className="space-y-6">
            <p className="text-center text-[#617289] dark:text-gray-400 text-sm">
              Already have an account?{' '}
              <Link to="/login" className="text-primary font-bold hover:underline decoration-2 underline-offset-4">
                Sign In
              </Link>
            </p>
            <div className="pt-4 text-center text-[#617289] text-xs font-normal border-t border-gray-100 dark:border-gray-800">
              © 2024 SimpleBlog Platform. All rights reserved.
            </div>
          </footer>
        </div>
      </main>
    </div>
  );
};

export default Register;
