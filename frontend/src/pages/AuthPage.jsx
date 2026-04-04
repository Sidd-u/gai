import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, Sparkles, ArrowRight, LogIn, UserPlus } from 'lucide-react';
import api from '../services/api';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const endpoint = isLogin ? '/auth/login' : '/auth/signup';
      const res = await api.post(endpoint, { email, password });
      if (res.data.success && res.data.data?.token) {
        localStorage.setItem('token', res.data.data.token);
        navigate('/dashboard');
      } else {
        setError(res.data.error || 'Authentication failed');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-x-hidden bg-background">
      {/* Animated background orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[35rem] h-[35rem] bg-primary/30 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[35rem] h-[35rem] bg-secondary/30 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" style={{ animationDelay: '1.5s' }} />
      <div className="absolute top-[40%] left-[60%] w-[25rem] h-[25rem] bg-accent/20 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '3s' }} />

      {/* Main card */}
      <motion.div
        initial={{ y: 60, opacity: 0, scale: 0.95 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, type: 'spring', bounce: 0.4 }}
        className="w-full max-w-md bg-surface/80 backdrop-blur-xl p-8 md:p-10 rounded-[2.5rem] shadow-2xl relative z-10 border border-primary/10"
      >
        {/* Header with logo */}
        <div className="text-center mb-10">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.6, type: 'spring' }}
            className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary via-secondary to-accent flex items-center justify-center shadow-xl shadow-primary/30"
          >
            <Sparkles className="w-10 h-10 text-white" />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-4xl font-black mb-2 gradient-text"
          >
            AI Interviewer
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-textMuted font-medium"
          >
            Master your next tech interview
          </motion.p>
        </div>

        {/* Error message */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-2xl mb-6 text-sm font-medium flex items-center gap-2"
            >
              <span className="w-2 h-2 bg-red-500 rounded-full" />
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-bold mb-2 text-textMain flex items-center gap-2">
              <Mail className="w-4 h-4 text-primary" />
              Email
            </label>
            <div className="relative">
              <input
                type="email"
                required
                className="w-full px-5 py-4 bg-background/50 border-2 border-primary/20 rounded-2xl focus:ring-2 focus:ring-primary/40 focus:border-primary outline-none transition-all shadow-inner font-medium text-lg placeholder:text-textMuted/40 pl-12"
                placeholder="you@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-textMuted" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold mb-2 text-textMain flex items-center gap-2">
              <Lock className="w-4 h-4 text-secondary" />
              Password
            </label>
            <div className="relative">
              <input
                type="password"
                required
                className="w-full px-5 py-4 bg-background/50 border-2 border-secondary/20 rounded-2xl focus:ring-2 focus:ring-secondary/40 focus:border-secondary outline-none transition-all shadow-inner font-medium text-lg placeholder:text-textMuted/40 pl-12"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-textMuted" />
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-primary via-secondary to-accent text-white font-bold py-4 rounded-2xl transition-all duration-300 shadow-xl shadow-primary/30 hover:shadow-primary/50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-6 text-lg"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span className="animate-pulse">
                  {isLogin ? 'Signing In...' : 'Creating Account...'}
                </span>
              </>
            ) : (
              <>
                {isLogin ? (
                  <>
                    <LogIn className="w-5 h-5" />
                    <span>Sign In</span>
                  </>
                ) : (
                  <>
                    <UserPlus className="w-5 h-5" />
                    <span>Create Account</span>
                  </>
                )}
              </>
            )}
          </motion.button>
        </form>

        {/* Toggle auth mode */}
        <div className="mt-8 text-center">
          <motion.button
            whileHover={{ scale: 1.02 }}
            onClick={() => {
              setIsLogin(!isLogin);
              setError('');
            }}
            className="text-textMuted hover:text-primary transition-colors text-sm font-semibold flex items-center justify-center gap-2 mx-auto group"
          >
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <span className="gradient-text font-bold group-hover:translate-x-1 transition-transform">
              {isLogin ? 'Sign up' : 'Log in'}
            </span>
            <ArrowRight className="w-4 h-4 text-primary group-hover:translate-x-1 transition-transform" />
          </motion.button>
        </div>
      </motion.div>

      {/* Footer text */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="absolute bottom-6 text-textMuted text-sm font-medium"
      >
        Powered by AI • Practice Smart
      </motion.p>
    </div>
  );
}
