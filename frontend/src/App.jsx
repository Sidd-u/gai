import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import AuthPage from './pages/AuthPage';
import Dashboard from './pages/Dashboard';
import QuizPage from './pages/QuizPage';
import ResultsPage from './pages/ResultsPage';
import { Palette } from 'lucide-react';

function App() {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'colorful');

  useEffect(() => {
    // Empty string maps to custom default colorful theme which is root
    document.documentElement.setAttribute('data-theme', theme === 'colorful' ? 'colorful' : theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const themes = ['colorful', 'dark', 'blue', 'purple', 'green', 'orange'];

  return (
    <Router>
      <div className="min-h-screen relative w-full overflow-x-hidden bg-background text-textMain transition-colors duration-300">
        <div className="absolute top-4 right-4 z-50 flex gap-2 items-center bg-surface p-2 rounded-lg shadow-sm border border-opacity-10 border-black">
          <Palette className="w-5 h-5 text-textMuted" />
          <select 
            className="bg-transparent text-textMain rounded px-2 py-1 outline-none text-sm cursor-pointer"
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
