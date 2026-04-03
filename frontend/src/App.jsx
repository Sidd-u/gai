import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AuthPage from './pages/AuthPage';
import Dashboard from './pages/Dashboard';
import QuizPage from './pages/QuizPage';
import ResultsPage from './pages/ResultsPage';
import { Palette, Menu, X, LayoutDashboard, FileText, Settings, Sparkles } from 'lucide-react';

function App() {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'midnight');
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme',
      localStorage.getItem('theme') || 'midnight');
  }, []);

  const themes = [
    { value: 'midnight', label: 'Midnight', gradient: 'from-blue-500 via-indigo-500 to-purple-500' },
    { value: 'ocean', label: 'Ocean', gradient: 'from-sky-500 via-cyan-500 to-teal-500' },
    { value: 'sunset', label: 'Sunset', gradient: 'from-orange-500 via-rose-500 to-pink-500' },
    { value: 'forest', label: 'Forest', gradient: 'from-green-500 via-emerald-500 to-lime-500' },
    { value: 'ember', label: 'Ember', gradient: 'from-red-500 via-orange-500 to-amber-500' },
    { value: 'arctic', label: 'Arctic', gradient: 'from-cyan-500 via-sky-400 to-white' },
  ];

  return (
    <Router>
      <div className="min-h-screen relative w-full overflow-x-hidden bg-background text-textMain transition-colors duration-500">
        {/* Animated background gradient */}
        <div className="fixed inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 pointer-events-none" />

        {/* Menu button */}
        <div className="absolute top-6 left-6 z-50">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsSidebarOpen(true)}
            className="p-3 bg-surface/80 backdrop-blur-xl rounded-2xl shadow-lg border border-primary/20 hover:border-primary/40 transition-all cursor-pointer group"
          >
             <Menu className="w-6 h-6 text-textMain group-hover:text-primary transition-colors" />
          </motion.button>
        </div>

        <AnimatePresence>
          {isSidebarOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={() => setIsSidebarOpen(false)}
                className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm cursor-pointer"
              />
              <motion.div
                initial={{ x: -320 }} animate={{ x: 0 }} exit={{ x: -320 }} transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="fixed top-0 left-0 h-full w-[320px] bg-surface/95 backdrop-blur-xl z-50 shadow-2xl flex flex-col border-r border-primary/10"
              >
                <div className="p-6 flex justify-between items-center border-b border-primary/10">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary via-secondary to-accent flex items-center justify-center">
                      <Sparkles className="w-6 h-6 text-white" />
                    </div>
                    <h2 className="text-xl font-black gradient-text">Menu</h2>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsSidebarOpen(false)}
                    className="p-2 hover:bg-primary/10 rounded-xl transition cursor-pointer"
                  >
                    <X className="w-6 h-6 text-textMain" />
                  </motion.button>
                </div>
                <nav className="p-4 space-y-2 flex-1 overflow-y-auto">
                  <Link to="/dashboard" onClick={() => setIsSidebarOpen(false)} className="flex items-center gap-4 p-4 rounded-2xl hover:bg-primary/10 text-textMain font-bold transition group">
                     <LayoutDashboard className="w-6 h-6 text-primary group-hover:scale-110 transition-transform" />
                     <span>Dashboard</span>
                  </Link>
                  <div className="flex items-center gap-4 p-4 rounded-2xl text-textMain font-bold opacity-40 cursor-not-allowed">
                     <FileText className="w-6 h-6 text-secondary" />
                     <span>My Results</span>
                  </div>
                  <div className="flex items-center gap-4 p-4 rounded-2xl hover:bg-primary/10 text-textMain font-bold transition opacity-60 cursor-not-allowed">
                     <Settings className="w-6 h-6 text-textMuted" />
                     <span>Settings</span>
                  </div>
                  {isLoggedIn && (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      onClick={() => {
                        localStorage.removeItem('token');
                        localStorage.removeItem('resume_id');
                        localStorage.removeItem('resume_text');
                        setIsLoggedIn(false);
                        setIsSidebarOpen(false);
                        window.location.href = '/auth';
                      }}
                      className="flex items-center gap-4 p-4 rounded-2xl hover:bg-red-500/10 text-red-400 font-bold transition w-full text-left border border-red-500/20 hover:border-red-500/40"
                    >
                      <X className="w-6 h-6" />
                      <span>Log Out</span>
                    </motion.button>
                  )}
                </nav>
                {/* Theme preview in sidebar */}
                <div className="p-4 border-t border-primary/10">
                  <p className="text-xs font-bold text-textMuted uppercase tracking-widest mb-3 px-2">Active Theme</p>
                  <div className="flex gap-2">
                    {themes.map(t => (
                      <button
                        key={t.value}
                        onClick={() => { setTheme(t.value); setIsSidebarOpen(false); }}
                        className={`w-8 h-8 rounded-full bg-gradient-to-br ${t.gradient} flex-shrink-0 transition-transform ${theme === t.value ? 'scale-125 ring-2 ring-white ring-offset-2 ring-offset-surface' : 'hover:scale-110'}`}
                        title={t.label}
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Theme selector */}
        <motion.div
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="absolute top-6 right-6 z-50"
        >
          <div className="flex gap-2 items-center bg-surface/80 backdrop-blur-xl p-2 px-4 rounded-2xl shadow-lg border border-primary/20">
            <Palette className="w-5 h-5 text-textMuted" />
            <select
              className="bg-transparent text-textMain font-bold px-3 py-2 outline-none cursor-pointer hover:text-primary transition-colors"
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
            >
              {themes.map(t => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>
        </motion.div>

        <Routes>
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/quiz" element={<QuizPage />} />
          <Route path="/results" element={<ResultsPage />} />
          <Route path="*" element={<Navigate to="/auth" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
