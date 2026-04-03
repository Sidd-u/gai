import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { UploadCloud, ChevronRight, Briefcase, Building, FileCheck, Sparkles, Zap } from 'lucide-react';
import api from '../services/api';

export default function Dashboard() {
  const token = localStorage.getItem('token');
  const nav = useNavigate();
  if (!token) {
    nav('/auth');
    return null;
  }
  const [file, setFile] = useState(null);
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const handleFileUpload = async () => {
    if (!file) return;
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await api.post('/resume/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (res.data.success) {
        localStorage.setItem('resume_id', res.data.data?.resume_id);
        localStorage.setItem('resume_text', JSON.stringify(res.data.data?.parsed || {}));
        setStep(2);
      } else {
        alert('Error uploading resume: ' + (res.data.error || 'Unknown error'));
      }
    } catch (err) {
      alert('Error uploading resume: ' + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateQuiz = async (e) => {
    e.preventDefault();
    if (!company || !role) return;
    setLoading(true);
    try {
      let resume_text = '';
      try {
        const stored = localStorage.getItem('resume_text') || '{}';
        const parsed = JSON.parse(stored);
        resume_text = parsed.summary ||
          (parsed.skills ? `Skills: ${parsed.skills.join(', ')}. ${parsed.summary || ''}` : stored);
      } catch {
        resume_text = localStorage.getItem('resume_text') || '';
      }
      const res = await api.post('/quiz/generate', { company, role, resume_text });
      if (res.data.success) {
        navigate('/quiz', { state: { quiz_id: res.data.data?.quiz_id, quiz: res.data.data?.quiz } });
      } else {
        alert('Error generating quiz: ' + (res.data.error || 'Unknown error'));
      }
    } catch (err) {
      alert('Error generating quiz: ' + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && ['.pdf', '.doc', '.docx'].some(ext => droppedFile.name.toLowerCase().endsWith(ext))) {
      setFile(droppedFile);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen p-6 pt-20 flex flex-col items-center relative overflow-hidden"
    >
      {/* Animated background elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full filter blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/20 rounded-full filter blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

      {/* Header */}
      <motion.div
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-center mb-12 mt-8 relative z-10"
      >
        <div className="flex items-center justify-center gap-3 mb-4">
          <Sparkles className="w-8 h-8 text-primary" />
          <h1 className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-accent">
            AI Interview Prep
          </h1>
        </div>
        <p className="text-xl text-textMuted font-medium max-w-xl mx-auto">
          Master your next tech interview with AI-powered practice and personalized feedback
        </p>
      </motion.div>

      {/* Progress indicator */}
      <div className="flex items-center gap-4 mb-10 relative z-10">
        <div className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${step === 1 ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-lg' : 'bg-surface text-textMuted'}`}>
          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black ${step === 1 ? 'bg-white text-primary' : 'bg-gray-600'}`}>1</div>
          <span className="font-bold text-sm">Resume</span>
        </div>
        <div className={`w-12 h-1 rounded-full transition-all ${step === 2 ? 'bg-gradient-to-r from-primary to-secondary' : 'bg-gray-600'}`} />
        <div className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${step === 2 ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-lg' : 'bg-surface text-textMuted'}`}>
          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black ${step === 2 ? 'bg-white text-primary' : 'bg-gray-600'}`}>2</div>
          <span className="font-bold text-sm">Role</span>
        </div>
      </div>

      {/* Main card */}
      <motion.div
        layout
        className="w-full max-w-2xl bg-surface/80 backdrop-blur-xl p-8 md:p-10 rounded-[2rem] shadow-2xl border border-primary/10 relative z-10"
      >
        <AnimatePresence mode="wait">
          {step === 1 ? (
            <motion.div
              key="step1"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <h2 className="text-2xl md:text-3xl font-bold mb-2 flex items-center gap-3 text-textMain">
                <span className="p-3 bg-gradient-to-br from-primary to-secondary rounded-2xl shadow-lg">
                  <UploadCloud className="w-7 h-7 text-white" />
                </span>
                Upload Your Resume
              </h2>
              <p className="text-textMuted mb-8 ml-14 font-medium">Let AI analyze your background and tailor questions for you</p>

              <motion.div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                whileHover={{ scale: 1.01 }}
                className={`border-2 border-dashed rounded-3xl p-12 text-center transition-all cursor-pointer relative group overflow-hidden ${
                  isDragging
                    ? 'border-primary bg-primary/10 scale-[1.02]'
                    : 'border-primary/30 hover:border-primary/60 hover:bg-primary/5'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.doc,.docx"
                  className="hidden"
                  onChange={(e) => setFile(e.target.files[0])}
                />
                <div className="relative z-10">
                  <motion.div
                    animate={{ y: [0, -8, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <UploadCloud className={`w-24 h-24 mx-auto mb-6 transition-all duration-300 ${isDragging ? 'text-primary scale-110' : 'text-primary/70 group-hover:scale-110 group-hover:text-primary'}`} />
                  </motion.div>
                  {file ? (
                    <div className="space-y-3">
                      <div className="flex items-center justify-center gap-2 text-primary">
                        <FileCheck className="w-6 h-6" />
                        <p className="text-xl font-bold">{file.name}</p>
                      </div>
                      <p className="text-textMuted font-medium">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <p className="text-2xl font-bold text-textMain">Drop your resume here</p>
                      <p className="text-textMuted font-medium">Supports PDF, DOC, and DOCX formats</p>
                      <div className="flex items-center justify-center gap-2 text-sm text-textMuted">
                        <Zap className="w-4 h-4" />
                        <span>AI-powered analysis in seconds</span>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleFileUpload}
                disabled={!file || loading}
                className="mt-8 w-full py-4 bg-gradient-to-r from-primary via-secondary to-accent text-white rounded-2xl font-bold text-lg hover:shadow-xl hover:shadow-primary/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-3 shadow-lg"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span className="animate-pulse">Analyzing Resume...</span>
                  </>
                ) : (
                  <>
                    <span>Continue</span>
                    <ChevronRight className="w-6 h-6" />
                  </>
                )}
              </motion.button>
            </motion.div>
          ) : (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 60 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -60 }}
              transition={{ duration: 0.4 }}
            >
              <h2 className="text-2xl md:text-3xl font-bold mb-2 flex items-center gap-3 text-textMain">
                <span className="p-3 bg-gradient-to-br from-secondary to-accent rounded-2xl shadow-lg">
                  <Briefcase className="w-7 h-7 text-white" />
                </span>
                Target Your Dream Role
              </h2>
              <p className="text-textMuted mb-8 ml-14 font-medium">Tell us where you want to work and we'll customize the interview</p>

              <form onSubmit={handleGenerateQuiz} className="space-y-6">
                <div>
                  <label className="block text-sm font-bold mb-3 text-textMain flex items-center gap-2">
                    <Building className="w-5 h-5 text-primary"/>
                    <span>Target Company</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Google, Microsoft, Stripe"
                    value={company}
                    onChange={e => setCompany(e.target.value)}
                    className="w-full px-5 py-4 bg-background/50 border-2 border-primary/20 rounded-2xl focus:ring-2 focus:ring-primary/40 focus:border-primary outline-none font-medium text-lg transition-all placeholder:text-textMuted/50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-3 text-textMain flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-secondary"/>
                    <span>Target Role</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Senior Frontend Engineer, ML Engineer"
                    value={role}
                    onChange={e => setRole(e.target.value)}
                    className="w-full px-5 py-4 bg-background/50 border-2 border-secondary/20 rounded-2xl focus:ring-2 focus:ring-secondary/40 focus:border-secondary outline-none font-medium text-lg transition-all placeholder:text-textMuted/50"
                  />
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={loading || !company || !role}
                  className="mt-4 w-full py-5 bg-gradient-to-r from-primary via-secondary to-accent text-white rounded-2xl font-bold text-xl hover:shadow-xl hover:shadow-primary/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin" />
                      <span className="animate-pulse">Generating Interview...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-6 h-6" />
                      <span>Start Interview</span>
                    </>
                  )}
                </motion.button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Features preview */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="mt-12 grid grid-cols-3 gap-6 text-center relative z-10"
      >
        <div className="text-center">
          <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
            <Sparkles className="w-7 h-7 text-primary" />
          </div>
          <p className="text-sm font-bold text-textMuted">AI Questions</p>
        </div>
        <div className="text-center">
          <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-gradient-to-br from-secondary/20 to-accent/20 flex items-center justify-center">
            <FileCheck className="w-7 h-7 text-secondary" />
          </div>
          <p className="text-sm font-bold text-textMuted">Instant Feedback</p>
        </div>
        <div className="text-center">
          <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-gradient-to-br from-accent/20 to-primary/20 flex items-center justify-center">
            <Zap className="w-7 h-7 text-accent" />
          </div>
          <p className="text-sm font-bold text-textMuted">Smart Roadmap</p>
        </div>
      </motion.div>
    </motion.div>
  );
}
