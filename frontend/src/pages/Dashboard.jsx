import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

import { UploadCloud, ChevronRight, Briefcase, Building } from 'lucide-react';
import api from '../services/api';

export default function Dashboard() {
  const [file, setFile] = useState(null);
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const navigate = useNavigate();


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
        localStorage.setItem('resume_text', res.data.data?.analysis || '{}');
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
      const resume_text = localStorage.getItem('resume_text') || '';
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

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen p-8 flex flex-col items-center bg-background">
      <motion.h1 
        initial={{ y: -30, opacity: 0 }} 
        animate={{ y: 0, opacity: 1 }} 
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary mb-16 mt-12"
      >
        Prepare for Greatness
      </motion.h1>

      <motion.div 
        layout
        className="w-full max-w-2xl bg-surface p-10 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-800"
      >
        {step === 1 ? (
          <motion.div initial={{ opacity:0, scale: 0.95 }} animate={{ opacity:1, scale: 1 }} transition={{duration: 0.5}}>
            <h2 className="text-3xl font-bold mb-8 flex items-center gap-3 text-textMain">
              <span className="p-3 bg-primary/10 rounded-xl text-primary"><UploadCloud /></span> 
              Step 1: Upload Resume
            </h2>
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="border-3 border-dashed border-primary/40 rounded-2xl p-12 text-center hover:bg-primary/5 transition-colors cursor-pointer relative group"
            >
              <input 
                type="file" 
                accept=".pdf,.doc,.docx"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                onChange={(e) => setFile(e.target.files[0])}
              />
              <UploadCloud className="w-20 h-20 text-primary mx-auto mb-6 opacity-75 group-hover:scale-110 transition-transform duration-300" />
              {file ? (
                <p className="text-xl font-bold text-primary">{file.name}</p>
              ) : (
                <div className="space-y-2">
                  <p className="text-xl font-medium text-textMain">Drag and drop your resume</p>
                  <p className="text-textMuted font-medium">Supports PDF and DOCX formats</p>
                </div>
              )}
            </motion.div>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleFileUpload}
              disabled={!file || loading}
              className="mt-8 w-full py-4 bg-primary text-white rounded-xl font-bold text-lg hover:bg-secondary transition disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2 shadow-lg"
            >
              {loading ? (
                <span className="animate-pulse">Extracting Profile...</span>
              ) : (
                <>Next Step <ChevronRight className="w-6 h-6"/></>
              )}
            </motion.button>
          </motion.div>
        ) : (
          <motion.div initial={{ opacity:0, x: 50 }} animate={{ opacity:1, x:0 }} transition={{duration: 0.5}}>
            <h2 className="text-3xl font-bold mb-8 flex items-center gap-3 text-textMain">
               <span className="p-3 bg-secondary/10 rounded-xl text-secondary"><Briefcase /></span> 
               Step 2: Target Role
            </h2>
            <form onSubmit={handleGenerateQuiz} className="space-y-8">
              <div>
                <label className="block text-base font-bold mb-2 text-textMain flex items-center gap-2">
                  <Building className="w-5 h-5 text-primary"/> Target Company
                </label>
                <input 
                  type="text" required placeholder="e.g. Google, Stripe"
                  value={company} onChange={e=>setCompany(e.target.value)}
                  className="w-full px-5 py-4 bg-background border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-secondary focus:border-transparent outline-none font-medium text-lg"
                />
              </div>
              <div>
                <label className="block text-base font-bold mb-2 text-textMain flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-primary"/> Target Role
                </label>
                <input 
                  type="text" required placeholder="e.g. Senior Frontend Engineer"
                  value={role} onChange={e=>setRole(e.target.value)}
                  className="w-full px-5 py-4 bg-background border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-secondary focus:border-transparent outline-none font-medium text-lg"
                />
              </div>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit" disabled={loading}
                className="mt-6 w-full py-4 bg-gradient-to-r from-primary to-secondary text-white rounded-xl font-bold text-lg hover:opacity-90 transition shadow-xl disabled:opacity-50"
              >
                {loading ? (
                  <span className="animate-pulse">Crafting your personalized interview...</span>
                ) : (
                  'Start Interview'
                )}
              </motion.button>
            </form>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}
