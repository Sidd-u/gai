import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../services/api';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const endpoint = isLogin ? '/auth/login' : '/auth/signup';
      // Adjust standard URL for auth to api instance
      const res = await api.post(endpoint, { email, password });
      if (res.data.success && res.data.data?.token) {
        localStorage.setItem('token', res.data.data.token);
        navigate('/dashboard');
      } else {
        setError(res.data.error || 'Authentication failed');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Authentication failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-background">
      <div className="absolute top-[-10%] left-[-10%] w-[30rem] h-[30rem] bg-primary rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[30rem] h-[30rem] bg-secondary rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{animationDelay: '1s'}}></div>

      <motion.div 
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, type: 'spring' }}
        className="w-full max-w-md bg-surface p-10 rounded-3xl shadow-2xl relative z-10 border border-gray-200 dark:border-gray-800"
      >
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-primary mb-3">AI Interviewer</h1>
          <p className="text-textMuted font-medium">Master your next tech interview</p>
        </div>

        {error && <div className="bg-red-100/10 text-red-500 border border-red-500 p-3 rounded-lg mb-6 text-sm">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-textMain mb-2">Email</label>
            <input 
              type="email" 
              required
              className="w-full px-5 py-3 bg-background border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all shadow-inner"
              placeholder="you@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-textMain mb-2">Password</label>
            <input 
              type="password" 
              required
              className="w-full px-5 py-3 bg-background border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all shadow-inner"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>
          
          <button 
            type="submit" 
            className="w-full bg-gradient-to-r from-primary to-secondary text-white font-bold py-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-primary/50 transform hover:-translate-y-1 mt-4"
          >
            {isLogin ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <div className="mt-8 text-center">
          <button 
            onClick={() => setIsLogin(!isLogin)}
            className="text-primary hover:text-secondary text-sm font-semibold transition-colors decoration-2 hover:underline"
          >
            {isLogin ? "Don't have an account? Sign up" : "Already have an account? Log in"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
