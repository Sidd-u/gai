import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Circle, Code, MessageSquare, HelpCircle, ChevronLeft, Send, Sparkles } from 'lucide-react';
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
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-background flex flex-col items-center justify-center p-8"
      >
        <div className="w-20 h-20 mb-6 rounded-2xl bg-surface flex items-center justify-center">
          <HelpCircle className="w-10 h-10 text-textMuted" />
        </div>
        <div className="text-xl font-bold text-textMain mb-4">No quiz session found</div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/dashboard')}
          className="px-8 py-4 bg-gradient-to-r from-primary to-secondary text-white rounded-2xl font-bold transition shadow-lg hover:shadow-xl"
        >
          Return to Dashboard
        </motion.button>
      </motion.div>
    );
  }

  const questions = quiz.questions || [];
  const currentQ = questions[currentIdx];
  const isLast = currentIdx === questions.length - 1;
  const progress = ((currentIdx + 1) / questions.length) * 100;

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

  const getTypeIcon = (type) => {
    switch (type) {
      case 'mcq': return <CheckCircle2 className="w-5 h-5" />;
      case 'coding': return <Code className="w-5 h-5" />;
      case 'essay': return <MessageSquare className="w-5 h-5" />;
      default: return <HelpCircle className="w-5 h-5" />;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'mcq': return 'from-emerald-500 to-teal-500';
      case 'coding': return 'from-blue-500 to-indigo-500';
      case 'essay': return 'from-purple-500 to-pink-500';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const hasAnswered = answers[currentQ?.id];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-background p-4 pt-20 flex flex-col items-center relative overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-primary/15 rounded-full filter blur-3xl" />
      <div className="absolute bottom-20 right-10 w-80 h-80 bg-secondary/15 rounded-full filter blur-3xl" />

      <div className="w-full max-w-4xl relative z-10">
        {/* Header with progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-black gradient-text mb-1">Interview Questions</h1>
              <p className="text-textMuted font-medium">Question {currentIdx + 1} of {questions.length}</p>
            </div>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className={`px-4 py-2 bg-gradient-to-r ${getTypeColor(currentQ.type)} rounded-xl text-white font-bold text-sm flex items-center gap-2 shadow-lg`}
            >
              {getTypeIcon(currentQ.type)}
              <span className="uppercase tracking-wider">{currentQ.type}</span>
            </motion.div>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-surface rounded-full h-4 overflow-hidden shadow-inner">
            <motion.div
              className="h-full bg-gradient-to-r from-primary via-secondary to-accent rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            />
          </div>

          {/* Question dots indicator */}
          <div className="flex gap-2 mt-4 flex-wrap justify-center">
            {questions.map((q, i) => (
              <button
                key={q.id}
                onClick={() => setCurrentIdx(i)}
                className={`w-3 h-3 rounded-full transition-all ${
                  i === currentIdx
                    ? 'bg-gradient-to-r from-primary to-secondary scale-125'
                    : answers[q.id]
                    ? 'bg-primary/60'
                    : 'bg-surface border border-primary/30'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Question card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQ.id}
            initial={{ opacity: 0, x: 40, scale: 0.98 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -40, scale: 0.98 }}
            transition={{ duration: 0.35 }}
            className="bg-surface/80 backdrop-blur-xl p-6 md:p-10 rounded-[2rem] shadow-2xl border border-primary/10 min-h-[500px] flex flex-col"
          >
            {/* Question text */}
            <div className="flex-grow">
              <div className="mb-6 flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center flex-shrink-0 shadow-lg">
                  <span className="text-white font-black text-sm">{currentIdx + 1}</span>
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-textMain leading-relaxed whitespace-pre-wrap">
                  {currentQ.question}
                </h3>
              </div>

              {currentQ.type === 'mcq' && (
                <div className="space-y-3">
                  {currentQ.options?.map((opt, i) => {
                    const isSelected = answers[currentQ.id] === opt;
                    return (
                      <motion.label
                        key={i}
                        whileHover={{ scale: 1.01, x: 4 }}
                        whileTap={{ scale: 0.99 }}
                        className={`block p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                          isSelected
                            ? 'border-primary bg-gradient-to-r from-primary/15 to-secondary/15 shadow-lg'
                            : 'border-primary/10 hover:border-primary/30 hover:bg-primary/5'
                        }`}
                      >
                        <input
                          type="radio"
                          name={currentQ.id}
                          value={opt}
                          checked={isSelected}
                          onChange={() => handleAnswerChange(opt)}
                          className="hidden"
                        />
                        <div className="flex items-center gap-4">
                          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                            isSelected ? 'border-primary bg-primary' : 'border-gray-400'
                          }`}>
                            {isSelected && <Circle className="w-3 h-3 text-white fill-current" />}
                          </div>
                          <span className="font-bold text-lg text-textMain">{opt}</span>
                        </div>
                      </motion.label>
                    );
                  })}
                </div>
              )}

              {(currentQ.type === 'coding' || currentQ.type === 'essay') && (
                <div className="relative">
                  <textarea
                    className="w-full h-72 p-6 rounded-2xl bg-background/50 border-2 border-primary/20 focus:ring-2 focus:ring-primary/40 focus:border-primary outline-none resize-none font-mono text-base shadow-inner leading-relaxed text-textMain placeholder:text-textMuted/40"
                    placeholder={currentQ.type === 'coding' ? "// Write your code snippet here...\n\nfunction solution() {\n  // Your implementation\n}" : "Draft your well-thought-out answer...\n\nStart by explaining your approach, then provide details..."}
                    value={answers[currentQ.id] || ''}
                    onChange={(e) => handleAnswerChange(e.target.value)}
                  />
                  <div className="absolute bottom-4 right-4 text-xs text-textMuted font-medium">
                    {(answers[currentQ.id] || '').length} characters
                  </div>
                </div>
              )}
            </div>

            {/* Navigation buttons */}
            <div className="mt-8 flex justify-between items-center pt-6 border-t border-primary/10">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handlePrev}
                disabled={currentIdx === 0}
                className="px-6 py-3 rounded-xl font-bold flex items-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-primary/10 transition"
              >
                <ChevronLeft className="w-5 h-5" />
                <span className="hidden sm:inline">Previous</span>
              </motion.button>

              {isLast ? (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={submitQuiz}
                  disabled={loading || !hasAnswered}
                  className="px-8 py-4 bg-gradient-to-r from-primary via-secondary to-accent text-white rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transition flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span className="animate-pulse">Evaluating...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      <span>Submit Interview</span>
                      <Send className="w-5 h-5" />
                    </>
                  )}
                </motion.button>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleNext}
                  className="px-8 py-4 bg-gradient-to-r from-primary to-secondary text-white rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transition flex items-center gap-2"
                >
                  <span>Next</span>
                  <ChevronLeft className="w-5 h-5 rotate-180" />
                </motion.button>
              )}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Helper text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center text-textMuted text-sm font-medium mt-6"
        >
          Take your time. There's no time limit.
        </motion.p>
      </div>
    </motion.div>
  );
}
