import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';

export default function QuizPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const quiz = state?.quiz;
  const quiz_id = state?.quiz_id;

  const [answers, setAnswers] = useState({});
  const [currentIdx, setCurrentIdx] = useState(0);
  const [loading, setLoading] = useState(false);

  if (!quiz) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-background flex flex-col items-center justify-center p-8">
        <div className="text-xl font-medium text-textMain mb-4">No quiz session found</div>
        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => navigate('/dashboard')} className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-secondary transition shadow-md">
          Return to Dashboard
        </motion.button>
      </motion.div>
    );
  }
  
  const questions = quiz.questions || [];
  const currentQ = questions[currentIdx];
  const isLast = currentIdx === questions.length - 1;

  const handleAnswerChange = (val) => {
    setAnswers(prev => ({ ...prev, [currentQ.id]: val }));
  };

  const handleNext = () => {
    if (currentIdx < questions.length - 1) setCurrentIdx(currentIdx + 1);
  };

  const handlePrev = () => {
    if (currentIdx > 0) setCurrentIdx(currentIdx - 1);
  };

  const submitQuiz = async () => {
    setLoading(true);
    try {
      const res = await api.post('/quiz/submit', { quiz_id, answers });
      if (res.data.success) {
        const evalData = res.data.data?.evaluation || res.data.evaluation;
        const resId = res.data.data?.result_id || res.data.result_id;
        navigate('/results', { state: { result_id: resId, evaluation: evalData } });
      } else {
        alert('Error submitting answers: ' + (res.data.error || 'Unknown error'));
      }
    } catch (err) {
      alert('Error submitting answers: ' + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-background p-6 flex flex-col items-center">
      <div className="w-full max-w-4xl pt-8">
        <div className="w-full bg-surface rounded-full h-3 mb-8 overflow-hidden">
          <motion.div 
            className="bg-primary h-3 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-textMain">Question {currentIdx + 1} of {questions.length}</h2>
          <span className="px-3 py-1 bg-surface text-primary rounded-full text-sm font-semibold uppercase tracking-wider border border-primary/20">
            {currentQ.type}
          </span>
        </div>

        <AnimatePresence mode="wait">
          <motion.div 
            key={currentQ.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-surface p-8 rounded-3xl shadow-xl min-h-[400px] flex flex-col border border-gray-100 dark:border-gray-800"
          >
            <h3 className="text-xl font-medium text-textMain mb-6 leading-relaxed whitespace-pre-wrap">
               {currentQ.question}
            </h3>

            <div className="flex-grow">
              {currentQ.type === 'mcq' && (
                <div className="space-y-4">
                  {currentQ.options?.map((opt, i) => (
                    <label 
                      key={i} 
                      className={`block p-5 rounded-xl border-2 cursor-pointer transition-all ${answers[currentQ.id] === opt ? 'border-primary bg-primary/10' : 'border-gray-200 dark:border-gray-700 hover:border-primary/50'}`}
                    >
                      <input 
                        type="radio" 
                        name={currentQ.id} 
                        value={opt}
                        checked={answers[currentQ.id] === opt}
                        onChange={() => handleAnswerChange(opt)}
                        className="hidden"
                      />
                      <span className="font-semibold text-lg">{opt}</span>
                    </label>
                  ))}
                </div>
              )}

              {(currentQ.type === 'coding' || currentQ.type === 'essay') && (
                <textarea 
                  className="w-full h-64 p-5 rounded-xl bg-background border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-primary focus:border-transparent outline-none resize-none font-mono text-base shadow-inner leading-relaxed"
                  placeholder={currentQ.type === 'coding' ? "Write your code snippet here..." : "Draft your well-thought-out answer..."}
                  value={answers[currentQ.id] || ''}
                  onChange={(e) => handleAnswerChange(e.target.value)}
                />
              )}
            </div>

            <div className="mt-8 flex justify-between items-center pt-6 border-t border-gray-200 dark:border-gray-800">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handlePrev}
                disabled={currentIdx === 0}
                className="px-6 py-3 rounded-xl font-bold text-textMuted hover:bg-black/5 disabled:opacity-30 transition"
              >
                Previous
              </motion.button>
              
              {isLast ? (
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={submitQuiz}
                  disabled={loading}
                  className="px-8 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition flex items-center gap-2 disabled:opacity-50"
                >
                  {loading ? 'Evaluating Model...' : 'Submit Interview'}
                </motion.button>
              ) : (
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleNext}
                  className="px-8 py-3 bg-primary text-white rounded-xl font-bold text-lg shadow-md hover:bg-secondary transition"
                >
                  Next Question
                </motion.button>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
