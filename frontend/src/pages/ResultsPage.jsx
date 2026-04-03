import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Map, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';
import api from '../services/api';

export default function ResultsPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  // Safe state checks
  const result_id = state?.result_id;
  const evaluation = state?.evaluation;

  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log("result_id:", result_id);
    console.log("evaluation:", evaluation);

    if (!result_id || !evaluation) return;
    const fetchRoadmap = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.post('/roadmap/generate', { result_id });
        if (res.data.success) {
          setRoadmap(res.data.data?.roadmap || res.data.roadmap); // Safely maps whether wrapped in data container or root
        } else {
          setError(res.data.error || 'Failed to generate roadmap');
          console.error('Roadmap error:', res.data.error);
        }
      } catch (err) {
        setError(err.message || 'Network error');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchRoadmap();
  }, [result_id, evaluation]);

  if (!evaluation) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-8">
        <AlertTriangle className="w-16 h-16 text-yellow-500 mb-4" />
        <h2 className="text-2xl font-bold text-textMain mb-4">No Results Found</h2>
        <p className="text-textMuted mb-8 text-center">It looks like the evaluation data is missing or your session expired.</p>
        <button onClick={() => navigate('/dashboard')} className="px-8 py-3 bg-primary text-white rounded-xl font-bold hover:bg-secondary transition shadow-md">
          Return to Dashboard
        </button>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-background p-8 pt-16">
      <div className="max-w-5xl mx-auto space-y-8 pb-20">
        
        <motion.div 
          initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
          className="bg-surface p-12 rounded-[2rem] shadow-xl border border-gray-100 dark:border-gray-800 text-center relative overflow-hidden"
        >
          <div className="absolute -top-24 -right-24 w-72 h-72 bg-primary/20 rounded-full blur-3xl mix-blend-multiply"></div>
          <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-secondary/20 rounded-full blur-3xl mix-blend-multiply"></div>
          <h1 className="text-5xl font-extrabold text-textMain mb-6 relative z-10">Interview Evaluation</h1>
          <div className="inline-flex items-center justify-center space-x-3 bg-background px-8 py-4 rounded-2xl border-2 border-primary shadow-md relative z-10">
            <span className="text-2xl font-bold text-textMuted">Overall Score:</span>
            <span className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">{evaluation.score}<span className="text-3xl text-gray-400">/100</span></span>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.2 }}
            className="bg-surface p-8 rounded-3xl shadow-lg border-l-8 border-green-500"
          >
            <h3 className="text-3xl font-bold flex items-center gap-3 mb-8 text-textMain">
              <CheckCircle2 className="text-green-500 w-10 h-10"/> Strengths
            </h3>
            <ul className="space-y-4">
              {evaluation.strengths?.map((s, i) => (
                <li key={i} className="flex gap-4 text-xl font-medium text-textMain">
                  <span className="text-green-500 mt-1 flex-shrink-0">•</span> {s}
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.3 }}
            className="bg-surface p-8 rounded-3xl shadow-lg border-l-8 border-yellow-500"
          >
            <h3 className="text-3xl font-bold flex items-center gap-3 mb-8 text-textMain">
              <AlertTriangle className="text-yellow-500 w-10 h-10"/> Areas to Improve
            </h3>
            <ul className="space-y-4">
              {evaluation.weaknesses?.map((w, i) => (
                <li key={i} className="flex gap-4 text-xl font-medium text-textMain">
                  <span className="text-yellow-500 mt-1 flex-shrink-0">•</span> {w}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        <motion.div 
          initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }}
          className="bg-surface p-12 rounded-[2.5rem] shadow-2xl mt-16 relative overflow-hidden"
        >
          <div className="flex items-center gap-6 mb-10 relative z-10">
            <div className="p-5 bg-gradient-to-br from-secondary/20 to-primary/20 rounded-3xl shadow-inner">
              <Map className="w-12 h-12 text-primary" />
            </div>
            <div>
              <h2 className="text-4xl font-black text-textMain">Personalized Roadmap</h2>
              {error && <p className="text-red-500 font-bold mt-2">Error: {error}</p>}
              {!error && <p className="text-textMuted font-bold text-xl mt-2">Generated based on your performance</p>}
            </div>
          </div>

          {!roadmap && loading && (
            <div className="flex flex-col items-center justify-center py-16 relative z-10 text-textMuted space-y-6">
               <div className="w-16 h-16 border-8 border-primary/30 border-t-primary rounded-full animate-spin shadow-lg"></div>
               <p className="font-bold animate-pulse text-2xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">AI is architecting your path...</p>
            </div>
          )}

          {roadmap && (
            <div className="space-y-10 relative z-10">
              <p className="text-2xl font-medium leading-relaxed bg-background p-8 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-md">{roadmap.summary_plan}</p>
              
              <div className="space-y-8">
                {roadmap.topics?.map((topic, i) => (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 * i }}
                    key={i} className="bg-background p-8 rounded-3xl shadow-md border border-gray-100 dark:border-gray-800 hover:shadow-xl transition-all group"
                  >
                    <div className="flex justify-between items-start mb-6">
                      <h4 className="text-3xl font-bold text-primary group-hover:text-secondary transition-colors">{topic.name}</h4>
                      <span className={`px-5 py-2 rounded-xl text-sm font-black uppercase tracking-widest shadow-sm
                        ${topic.priority?.toLowerCase() === 'high' ? 'bg-red-100 text-red-700' : 
                          topic.priority?.toLowerCase() === 'medium' ? 'bg-yellow-100 text-yellow-700' : 
                          'bg-green-100 text-green-700'}`}>
                        {topic.priority}
                      </span>
                    </div>
                    <p className="text-textMain text-xl mb-8 leading-relaxed opacity-90">{topic.description}</p>
                    
                    <div className="bg-surface p-6 rounded-2xl border border-gray-200/50 dark:border-gray-700/50">
                      <strong className="block text-sm font-black text-textMuted uppercase tracking-widest mb-4">Recommended Resources</strong>
                      <ul className="space-y-3">
                        {topic.resources?.map((res, j) => (
                          <li key={j} className="flex items-start gap-3 text-secondary font-bold text-lg hover:text-primary transition-colors cursor-pointer group/link">
                            <ArrowRight className="w-6 h-6 flex-shrink-0 mt-0.5 opacity-50 group-hover/link:translate-x-1 transition-transform" />
                            <span className="group-hover/link:underline decoration-2 underline-offset-4">{res}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

           {roadmap && (
             <div className="mt-16 text-center relative z-10">
               <motion.button 
                 whileHover={{ scale: 1.05 }}
                 whileTap={{ scale: 0.95 }}
                 onClick={() => navigate('/dashboard')} className="px-12 py-5 bg-textMain text-background rounded-2xl font-black text-xl shadow-2xl"
               >
                  Start New Interview
               </motion.button>
            </div>
           )}
        </motion.div>

      </div>
    </motion.div>
  );
}
