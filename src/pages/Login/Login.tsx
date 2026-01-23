import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, Navigate, Link } from 'react-router-dom';
import { Logo } from '../../components/Logo';

const Login: React.FC = () => {
  const { user, login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [showPassword, setShowPassword] = useState(false);

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
    <div className="glass-card p-10 md:p-14 rounded-[3rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.3)] space-y-8 border-white/40">
      <Logo variant="card" />

      <div className="space-y-2">
        <h2 className="text-text-main dark:text-white text-2xl font-bold tracking-tight">Sign In</h2>
      </div>

      <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
        {error && (
          <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm font-medium border border-red-100 dark:border-red-800">
            {error}
          </div>
        )}

        <div className="form-input-container flex flex-col gap-2">
          <label className="text-text-main dark:text-white text-[11px] font-bold uppercase tracking-[0.15em] transition-colors" htmlFor="email">
            Email Address
          </label>
          <input
            autoComplete="email"
            className="w-full rounded-2xl border-gray-200/50 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 h-16 px-6 text-text-main dark:text-white placeholder:text-gray-400 focus:ring-4 focus:ring-primary/20 focus:border-primary transition-all outline-none text-lg shadow-sm"
            id="email"
            name="email"
            placeholder="name@company.com"
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="form-input-container flex flex-col gap-2">
          <div className="flex justify-between items-center px-1">
            <label className="text-text-main dark:text-white text-[11px] font-bold uppercase tracking-[0.15em] transition-colors" htmlFor="password">
              Password
            </label>
            <Link to="#" className="text-primary text-xs font-bold hover:text-primary/80 transition-colors">
              Forgot password?
            </Link>
          </div>
          <div className="relative group">
            <input
              autoComplete="current-password"
              className="w-full rounded-2xl border-gray-200/50 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 h-16 px-6 pr-14 text-text-main dark:text-white placeholder:text-gray-400 focus:ring-4 focus:ring-primary/20 focus:border-primary transition-all outline-none text-lg shadow-sm"
              id="password"
              name="password"
              placeholder="••••••••"
              required
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary transition-colors flex items-center"
              type="button"
              onClick={() => setShowPassword(!showPassword)}
            >
              <span className="material-symbols-outlined text-2xl">
                {showPassword ? 'visibility_off' : 'visibility'}
              </span>
            </button>
          </div>
        </div>

        <button
          className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-5 rounded-2xl transition-all shadow-2xl shadow-primary/40 transform active:scale-[0.98] text-xl mt-2 disabled:opacity-70 disabled:cursor-not-allowed"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Signing In...' : 'Sign In to Account'}
        </button>
      </form>

      <footer className="pt-6 border-t border-gray-200/30">
        <p className="text-center text-text-muted dark:text-gray-400 text-base font-medium">
          New to SimpleBlog?{' '}
          <Link className="text-primary font-bold hover:underline decoration-2 underline-offset-4" to="/register">Create account</Link>
        </p>
        <div className="mt-8 text-center">
          <p className="text-gray-400 dark:text-gray-500 text-[10px] font-bold uppercase tracking-widest">
            © 2026 Parodez
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Login;
