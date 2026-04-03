import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Map, CheckCircle2, AlertTriangle, ArrowRight, Sparkles, Trophy, Target, RefreshCcw } from 'lucide-react';
import api from '../services/api';

export default function ResultsPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const result_id = state?.result_id;
  const evaluation = state?.evaluation;

  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!result_id || !evaluation) return;
    const fetchRoadmap = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.post('/roadmap/generate', { result_id });
        if (res.data.success) {
          setRoadmap(res.data.data?.roadmap || res.data.roadmap);
        } else {
          setError(res.data.error || 'Failed to generate roadmap');
        }
      } catch (err) {
        setError(err.message || 'Network error');
      } finally {
        setLoading(false);
      }
    };
    fetchRoadmap();
  }, [result_id, evaluation]);

  if (!evaluation) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-background flex flex-col items-center justify-center p-8"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', bounce: 0.5 }}
          className="w-24 h-24 mb-6 rounded-3xl bg-surface flex items-center justify-center"
        >
          <AlertTriangle className="w-12 h-12 text-yellow-500" />
        </motion.div>
        <h2 className="text-3xl font-black text-textMain mb-4">No Results Found</h2>
        <p className="text-textMuted mb-8 text-center text-lg max-w-md">
          It looks like the evaluation data is missing or your session expired.
        </p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/dashboard')}
          className="px-10 py-4 bg-gradient-to-r from-primary to-secondary text-white rounded-2xl font-bold hover:shadow-xl transition shadow-lg"
        >
          Return to Dashboard
        </motion.button>
      </motion.div>
    );
  }

  const getScoreColor = (score) => {
    if (score >= 80) return 'from-emerald-500 to-green-500';
    if (score >= 60) return 'from-yellow-500 to-orange-500';
    return 'from-red-500 to-rose-500';
  };

  const getScoreMessage = (score) => {
    if (score >= 80) return 'Excellent work!';
    if (score >= 60) return 'Good effort!';
    return 'Keep practicing!';
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-background p-4 pt-20 pb-12 relative overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/15 rounded-full filter blur-3xl" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/15 rounded-full filter blur-3xl" />

      <div className="max-w-5xl mx-auto space-y-8 relative z-10">

        {/* Score card */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="bg-surface/80 backdrop-blur-xl p-8 md:p-12 rounded-[2.5rem] shadow-2xl border border-primary/10 text-center relative overflow-hidden"
        >
          <div className="absolute -top-32 -right-32 w-80 h-80 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-gradient-to-br from-secondary/20 to-accent/20 rounded-full blur-3xl" />

          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.2, type: 'spring', bounce: 0.4 }}
            className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-primary via-secondary to-accent flex items-center justify-center shadow-xl shadow-primary/30 relative z-10"
          >
            <Trophy className="w-10 h-10 text-white" />
          </motion.div>

          <h1 className="text-4xl md:text-5xl font-black text-textMain mb-4 relative z-10">
            Interview Results
          </h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-textMuted font-medium mb-8 relative z-10"
          >
            {getScoreMessage(evaluation.score)}
          </motion.p>

          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.4, type: 'spring' }}
            className="inline-flex items-center gap-4 bg-background/80 backdrop-blur-xl px-10 py-6 rounded-3xl border-2 border-primary/30 shadow-xl relative z-10"
          >
            <span className="text-xl font-bold text-textMuted">Score:</span>
            <span className={`text-6xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r ${getScoreColor(evaluation.score)}`}>
              {evaluation.score}
            </span>
            <span className="text-3xl text-textMuted font-bold">/ 100</span>
          </motion.div>
        </motion.div>

        {/* Strengths & Weaknesses */}
        <div className="grid md:grid-cols-2 gap-6">
          <motion.div
            initial={{ x: -30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="bg-surface/80 backdrop-blur-xl p-8 rounded-3xl shadow-xl border border-emerald-500/20 relative overflow-hidden group hover:border-emerald-500/40 transition-all"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full filter blur-2xl" />
            <h3 className="text-2xl font-bold flex items-center gap-3 mb-6 text-textMain relative z-10">
              <div className="p-3 bg-emerald-500/20 rounded-xl">
                <CheckCircle2 className="text-emerald-400 w-8 h-8" />
              </div>
              <span>Strengths</span>
            </h3>
            <ul className="space-y-3 relative z-10">
              {evaluation.strengths?.map((s, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + i * 0.1 }}
                  className="flex gap-3 text-lg font-medium text-textMain items-start"
                >
                  <span className="text-emerald-400 mt-1 flex-shrink-0 text-xl">•</span>
                  <span>{s}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ x: 30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="bg-surface/80 backdrop-blur-xl p-8 rounded-3xl shadow-xl border border-amber-500/20 relative overflow-hidden group hover:border-amber-500/40 transition-all"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full filter blur-2xl" />
            <h3 className="text-2xl font-bold flex items-center gap-3 mb-6 text-textMain relative z-10">
              <div className="p-3 bg-amber-500/20 rounded-xl">
                <AlertTriangle className="text-amber-400 w-8 h-8" />
              </div>
              <span>Areas to Improve</span>
            </h3>
            <ul className="space-y-3 relative z-10">
              {evaluation.weaknesses?.map((w, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + i * 0.1 }}
                  className="flex gap-3 text-lg font-medium text-textMain items-start"
                >
                  <span className="text-amber-400 mt-1 flex-shrink-0 text-xl">•</span>
                  <span>{w}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Roadmap section */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="bg-surface/80 backdrop-blur-xl p-8 md:p-12 rounded-[2.5rem] shadow-2xl border border-primary/10 relative overflow-hidden mt-12"
        >
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-gradient-to-br from-secondary/20 to-primary/20 rounded-full blur-3xl" />

          <div className="flex items-center gap-5 mb-10 relative z-10">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.8, type: 'spring' }}
              className="p-4 bg-gradient-to-br from-secondary/20 to-primary/20 rounded-2xl shadow-inner flex-shrink-0"
            >
              <Map className="w-10 h-10 text-primary" />
            </motion.div>
            <div>
              <h2 className="text-3xl md:text-4xl font-black text-textMain">Your Learning Roadmap</h2>
              {error && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-red-400 font-bold mt-2 flex items-center gap-2"
                >
                  <AlertTriangle className="w-4 h-4" />
                  {error}
                </motion.p>
              )}
              {!error && !loading && (
                <p className="text-textMuted font-bold text-lg mt-1">Personalized based on your performance</p>
              )}
            </div>
          </div>

          <AnimatePresence>
            {!roadmap && loading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-20 relative z-10 text-textMuted space-y-8"
              >
                <div className="relative">
                  <div className="w-20 h-20 border-4 border-primary/20 rounded-full" />
                  <div className="absolute top-0 left-0 w-20 h-20 border-4 border-transparent border-t-primary border-r-primary rounded-full animate-spin" />
                </div>
                <p className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-primary via-secondary to-accent animate-pulse">
                  AI is generating your personalized roadmap...
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {roadmap && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-8 relative z-10"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-background/80 backdrop-blur-xl p-8 rounded-3xl border border-primary/10 shadow-lg"
              >
                <div className="flex items-start gap-4">
                  <Target className="w-8 h-8 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="text-lg font-bold text-textMuted uppercase tracking-widest mb-2">Summary Plan</h4>
                    <p className="text-xl font-medium leading-relaxed text-textMain">{roadmap.summary_plan}</p>
                  </div>
                </div>
              </motion.div>

              <div className="space-y-6">
                {roadmap.topics?.map((topic, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + i * 0.1 }}
                    className="bg-background/80 backdrop-blur-xl p-8 rounded-3xl border border-primary/10 shadow-lg hover:shadow-xl hover:border-primary/30 transition-all group"
                  >
                    <div className="flex justify-between items-start mb-6 flex-wrap gap-4">
                      <h4 className="text-2xl md:text-3xl font-bold text-primary group-hover:text-secondary transition-colors">
                        {topic.name}
                      </h4>
                      <span className={`px-5 py-2 rounded-xl text-xs font-black uppercase tracking-widest shadow-sm flex items-center gap-2
                        ${topic.priority?.toLowerCase() === 'high'
                          ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                          : topic.priority?.toLowerCase() === 'medium'
                          ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                          : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        }`}
                      >
                        <span className="w-2 h-2 rounded-full bg-current" />
                        {topic.priority}
                      </span>
                    </div>
                    <p className="text-textMain text-lg mb-6 leading-relaxed opacity-90">{topic.description}</p>

                    <div className="bg-surface/50 p-6 rounded-2xl border border-primary/10">
                      <strong className="block text-xs font-black text-textMuted uppercase tracking-widest mb-4 flex items-center gap-2">
                        <Sparkles className="w-4 h-4" />
                        Recommended Resources
                      </strong>
                      <ul className="space-y-3">
                        {topic.resources?.map((res, j) => (
                          <motion.li
                            key={j}
                            whileHover={{ x: 4 }}
                            className="flex items-start gap-3 text-secondary font-bold text-lg hover:text-primary transition-colors cursor-pointer group/link"
                          >
                            <ArrowRight className="w-5 h-5 flex-shrink-0 mt-0.5 opacity-50 group-hover/link:opacity-100 group-hover/link:translate-x-1 transition-all" />
                            <span className="group-hover/link:underline decoration-2 underline-offset-4">{res}</span>
                          </motion.li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {roadmap && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-12 text-center relative z-10"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/dashboard')}
                className="px-12 py-5 bg-gradient-to-r from-primary via-secondary to-accent text-white rounded-2xl font-black text-xl shadow-2xl hover:shadow-primary/50 transition flex items-center gap-3 mx-auto"
              >
                <RefreshCcw className="w-6 h-6" />
                Start New Interview
              </motion.button>
            </motion.div>
          )}
        </motion.div>

      </div>
    </motion.div>
  );
}
