import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AuthPage from './pages/AuthPage';
import Dashboard from './pages/Dashboard';
import QuizPage from './pages/QuizPage';
import ResultsPage from './pages/ResultsPage';
import { Palette, Menu, X, LayoutDashboard, FileText, Settings } from 'lucide-react';

function App() {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'colorful');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    // Empty string maps to custom default colorful theme which is root
    document.documentElement.setAttribute('data-theme', theme === 'colorful' ? 'colorful' : theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const themes = ['colorful', 'dark', 'blue', 'purple', 'green', 'orange'];

  return (
    <Router>
      <div className="min-h-screen relative w-full overflow-x-hidden bg-background text-textMain transition-colors duration-300">
        
        <div className="absolute top-4 left-4 z-50">
          <button 
            onClick={() => setIsSidebarOpen(true)} 
            className="p-3 bg-surface rounded-xl shadow-md border border-gray-200 dark:border-gray-800 hover:bg-black/5 transition cursor-pointer"
          >
             <Menu className="w-6 h-6 text-textMain" />
          </button>
        </div>

        <AnimatePresence>
          {isSidebarOpen && (
            <>
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={() => setIsSidebarOpen(false)}
                className="fixed inset-0 bg-black/20 z-40 backdrop-blur-sm cursor-pointer"
              />
              <motion.div 
                initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }} transition={{ type: 'spring', damping: 20 }}
                className="fixed top-0 left-0 h-full w-[280px] bg-surface z-50 shadow-2xl flex flex-col border-r border-gray-200 dark:border-gray-800"
              >
                <div className="p-6 flex justify-between items-center border-b border-gray-200 dark:border-gray-800">
                  <h2 className="text-2xl font-black text-primary">Menu</h2>
                  <button onClick={() => setIsSidebarOpen(false)} className="p-2 hover:bg-black/5 rounded-lg transition cursor-pointer">
                    <X className="w-6 h-6 text-textMain" />
                  </button>
                </div>
                <nav className="p-6 space-y-4 flex-1">
                  <Link to="/dashboard" onClick={() => setIsSidebarOpen(false)} className="flex items-center gap-4 p-4 rounded-2xl hover:bg-primary/10 text-textMain font-bold text-lg transition">
                     <LayoutDashboard className="w-6 h-6 text-primary" /> Dashboard
                  </Link>
                  <Link to="/results" onClick={() => setIsSidebarOpen(false)} className="flex items-center gap-4 p-4 rounded-2xl hover:bg-primary/10 text-textMain font-bold text-lg transition">
                     <FileText className="w-6 h-6 text-secondary" /> My Results
                  </Link>
                  <div className="flex items-center gap-4 p-4 rounded-2xl hover:bg-primary/10 text-textMain font-bold text-lg transition opacity-60 cursor-not-allowed">
                     <Settings className="w-6 h-6 text-textMuted" /> Settings
                  </div>
                </nav>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        <div className="absolute top-4 right-4 z-50 flex gap-3 items-center bg-surface p-3 px-5 rounded-full shadow-lg border border-gray-200 dark:border-gray-800">
          <div style={{background: 'var(--color-primary)'}} className="w-3 h-3 rounded-full shadow-inner"/>
          <Palette className="w-5 h-5 text-textMuted" />
          <select 
            className="bg-transparent text-textMain font-bold px-2 outline-none text-sm cursor-pointer"
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
          >
            {themes.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
          </select>
        </div>

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
