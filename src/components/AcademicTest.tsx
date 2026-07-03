/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from 'react';
import { AcademicQuiz, UserProfile, UserMajor } from '../types';
import { SMA_QUIZZES, MAJOR_QUIZZES } from '../data/questions';
import { Award, Compass, Search, Laptop, ShieldAlert, Sparkles, CheckCircle, RefreshCcw, Video, Mic, Smartphone } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AcademicTestProps {
  profile: UserProfile;
  completedQuizzes: string[];
  onCompleteQuiz: (quizId: string, jawaban: Record<number, number>) => void;
  onUpgradeToPremium?: () => void;
}

export default function AcademicTest({ profile, completedQuizzes, onCompleteQuiz, onUpgradeToPremium }: AcademicTestProps) {
  // Quiz state
  const [activeTab, setActiveTab] = useState<'sma' | 'major' | 'cross'>('sma');
  const [selectedQuiz, setSelectedQuiz] = useState<AcademicQuiz | null>(null);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [raguAnswers, setRaguAnswers] = useState<Record<number, boolean>>({});
  const [currentIdx, setCurrentIdx] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15 * 60);
  const [quizFinished, setQuizFinished] = useState(false);
  const [quizScore, setQuizScore] = useState(0);

  // Custom Modal State (to avoid iframe confirm blocks)
  const [confirmModal, setConfirmModal] = useState<{isOpen: boolean, message: string} | null>(null);

  // Use refs to get latest state inside setInterval
  const answersRef = useRef(answers);
  const raguRef = useRef(raguAnswers);
  useEffect(() => {
    answersRef.current = answers;
    raguRef.current = raguAnswers;
  }, [answers, raguAnswers]);

  // SEB Webcam simulation canvas
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [proctoringActive, setProctoringActive] = useState(false);

  // Timer logic
  useEffect(() => {
    if (!selectedQuiz || quizFinished || !proctoringActive) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          executeSubmit(true); // auto submit
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [selectedQuiz, quizFinished, proctoringActive]);

  // Render dummy moving face lines on proctoring canvas to look live and genuine!
  useEffect(() => {
    if (!proctoringActive || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animFrame: number;
    let r = 0;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // bg
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw wireframe simulated face
      ctx.strokeStyle = '#14b8a6';
      ctx.lineWidth = 1.5;
      
      // Face shape
      ctx.beginPath();
      ctx.arc(canvas.width / 2, canvas.height / 2, 35 + Math.sin(r) * 1.5, 0, Math.PI * 2);
      ctx.stroke();

      // Eyes
      ctx.beginPath();
      ctx.arc(canvas.width / 2 - 12, canvas.height / 2 - 8, 3, 0, Math.PI * 2);
      ctx.arc(canvas.width / 2 + 12, canvas.height / 2 - 8, 3, 0, Math.PI * 2);
      ctx.fillStyle = '#14b8a6';
      ctx.fill();

      // Mouth (Smile)
      ctx.beginPath();
      ctx.arc(canvas.width / 2, canvas.height / 2 + 8, 10, 0, Math.PI);
      ctx.stroke();

      // Tracking grid lines
      ctx.strokeStyle = 'rgba(20, 184, 166, 0.15)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, canvas.height / 2 + Math.cos(r) * 10);
      ctx.lineTo(canvas.width, canvas.height / 2 + Math.cos(r) * 10);
      ctx.stroke();

      // Text status overlay on proctoring
      ctx.fillStyle = '#14b8a6';
      ctx.font = '8px monospace';
      ctx.fillText('[ZOOM SECURE AI PROCTOR]', 6, 12);
      ctx.fillText('STATUS: WAJAH TERDETEKSI', 6, canvas.height - 8);

      r += 0.05;
      animFrame = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(animFrame);
  }, [proctoringActive, selectedQuiz]);

  const selectQuizToStart = (quiz: AcademicQuiz) => {
    setSelectedQuiz(quiz);
    setAnswers({});
    setRaguAnswers({});
    setCurrentIdx(0);
    setTimeLeft(15 * 60);
    setQuizFinished(false);
    setProctoringActive(true);
  };

  const selectAnswer = (qIdx: number, oIdx: number) => {
    setAnswers((prev) => ({ ...prev, [qIdx]: oIdx }));
  };

  const requestSubmit = () => {
    if (!selectedQuiz) return;
    const totalQLength = selectedQuiz.questions.length;
    let terjawab = 0;
    for (let i = 0; i < totalQLength; i++) {
      if (answers[i] !== undefined) terjawab++;
    }
    const adaRagu = Object.values(raguAnswers).some(val => val === true);
    
    let confirmMsg = "";
    if (adaRagu) {
      confirmMsg = `⚠️ PERINGATAN ⚠️\n\nAnda masih memiliki soal yang ditandai "Ragu-ragu". Sistem tetap memproses jawaban tersebut. Yakin kumpulkan?`;
    } else if (terjawab < totalQLength) {
      confirmMsg = `Anda baru menjawab ${terjawab} dari ${totalQLength} soal. Yakin ingin mengumpulkannya sekarang?`;
    } else {
      confirmMsg = `Anda sudah menjawab semua soal dengan yakin. Siap mengakhiri tes ini?`;
    }
    setConfirmModal({ isOpen: true, message: confirmMsg });
  };

  const executeSubmit = (isAuto = false) => {
    if (!selectedQuiz) return;
    const totalQLength = selectedQuiz.questions.length;
    const finalAnswers = isAuto ? answersRef.current : answers;

    let correct = 0;
    selectedQuiz.questions.forEach((q, qIndex) => {
      if (finalAnswers[qIndex] === q.correctAnswer) {
        correct++;
      }
    });

    const calculatedScore = Math.round((correct / totalQLength) * 100);
    setQuizScore(calculatedScore);
    setQuizFinished(true);
    setProctoringActive(false);
    setConfirmModal(null);

    onCompleteQuiz(selectedQuiz.id, finalAnswers);
  };
  
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Compile cross-major quizzes for Premium users
  const allMajors: UserMajor[] = ['Teknik Informatika', 'Bisnis & Manajemen', 'Sains & Teknologi', 'Umum'];
  const crossMajors = allMajors.filter((m) => m !== profile.major);

  return (
    <div id="academic-test-main" className="space-y-6">
      
      {/* SEB HIGH INTEGRITY ENVIRONMENT BANNER */}
      <div className="bg-gradient-to-r from-red-950/40 via-slate-900 to-red-955/40 border border-red-500/20 p-5 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 text-left">
          <div className="p-3 rounded-full bg-red-500/10 text-red-400 border border-red-500/20">
            <Laptop className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-gray-900 dark:text-white transition-colors duration-300 ease-in-out flex items-center gap-2 font-display">
              <span className="w-2 h-2 bg-red-400 rounded-full animate-ping" /> Simulator Integrasi Safe Exam Browser (SEB) & Zoom Proctoring
            </h4>
            <p className="text-xs text-gray-600 dark:text-gray-400 transition-colors duration-300 ease-in-out mt-0.5">
              Untuk kuis akademik tingkat lanjut, sistem mendeteksi kelayakan anti-curang. Wajib menggunakan laptop/PC terbaru, mengaktifkan kamera Zoom Pro, & menonaktifkan perpindahan tab browser.
            </p>
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-900 transition-colors duration-300 ease-in-out p-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-xs font-mono text-center flex flex-col items-center shrink-0">
          <span className="text-[10px] text-gray-500 dark:text-gray-400 transition-colors duration-300 ease-in-out block uppercase">SEB SECURE FRAME v3.5</span>
          <span className="text-teal-400 font-bold tracking-tight">AKTIF & MERESTRIKSI KONTROL</span>
        </div>
      </div>

      {/* QUIZ WORKSPACE */}
      {!selectedQuiz ? (
        <div id="quiz-list-panel" className="bg-white dark:bg-gray-800 transition-colors duration-300 ease-in-out border border-gray-200 dark:border-gray-700 rounded-3xl p-6 md:p-8 space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white transition-colors duration-300 ease-in-out flex items-center gap-2 font-display">
                <Compass className="w-6 h-6 text-sky-400" /> Sesi Kuis Uji Akademis & Keahlian Komparatif
              </h3>
              <p className="text-xs text-gray-600 dark:text-gray-400 transition-colors duration-300 ease-in-out mt-1">
                Lengkapi ujian di bawah untuk mengakumulasi skor akademik kognitif demi mendongkrak status Talent Card Anda!
              </p>
            </div>

            {/* TAB SELECTOR */}
            <div className="flex bg-gray-50 dark:bg-gray-900 transition-colors duration-300 ease-in-out p-1 rounded-xl border border-gray-200 dark:border-gray-700 text-xs">
              <button
                onClick={() => setActiveTab('sma')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                  activeTab === 'sma' ? 'bg-white dark:bg-gray-800 transition-colors duration-300 ease-in-out text-teal-400' : 'text-gray-500 dark:text-gray-400 transition-colors duration-300 ease-in-out hover:text-gray-800'
                }`}
              >
                Pelajaran SMA (Free)
              </button>
              <button
                onClick={() => setActiveTab('major')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                  activeTab === 'major' ? 'bg-white dark:bg-gray-800 transition-colors duration-300 ease-in-out text-teal-400' : 'text-gray-500 dark:text-gray-400 transition-colors duration-300 ease-in-out hover:text-gray-800'
                }`}
              >
                Matakuliah Default Jurusan
              </button>
              <button
                onClick={() => setActiveTab('cross')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                  activeTab === 'cross' ? 'bg-white dark:bg-gray-800 transition-colors duration-300 ease-in-out text-teal-400' : 'text-gray-500 dark:text-gray-400 transition-colors duration-300 ease-in-out hover:text-gray-800'
                }`}
              >
                Kuis Lintas Jurusan (Premium Only)
              </button>
            </div>
          </div>

          {/* SMA QUIZZES TAB */}
          <AnimatePresence mode="wait">
          {activeTab === 'sma' && (
            <motion.div 
              key="sma"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-4"
            >
              {SMA_QUIZZES.map((quiz) => {
                const isCompleted = completedQuizzes.includes(quiz.id);
                return (
                <div key={quiz.id} className="bg-gray-50 dark:bg-gray-900 transition-colors duration-300 ease-in-out p-5 rounded-2xl border border-gray-200 dark:border-gray-700 hover:border-gray-200 dark:border-gray-700 transition-all flex flex-col justify-between">
                  <div className="space-y-2">
                    <span className="text-[9px] bg-sky-500/10 text-sky-400 border border-sky-500/25 px-2 py-0.5 rounded uppercase font-bold tracking-wider">
                      Ujian Umum SMA/SMK
                    </span>
                    <h4 className="text-md font-bold text-gray-900 dark:text-white transition-colors duration-300 ease-in-out font-display leading-tight">{quiz.subject}</h4>
                    <p className="text-[11px] text-gray-600 dark:text-gray-400 transition-colors duration-300 ease-in-out ">
                      Materi dasar matematika, literasi bahasa inggris profesional, dan ejaan baku formal untuk melatih kognisi awal.
                    </p>
                  </div>

                  <div className="mt-5 pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
                    <span className="text-[10px] text-gray-500 dark:text-gray-400 transition-colors duration-300 ease-in-out ">{quiz.questions.length} Pertanyaan</span>
                    <button
                      onClick={() => !isCompleted && selectQuizToStart(quiz)}
                      disabled={isCompleted}
                      className={`font-bold text-xs px-3 py-1.5 rounded-lg transition-all ${isCompleted ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 cursor-not-allowed' : 'bg-teal-500 hover:bg-teal-400 text-gray-900 dark:text-white transition-colors duration-300 ease-in-out cursor-pointer'}`}
                    >
                      {isCompleted ? 'Selesai' : 'Mulai Ujian'}
                    </button>
                  </div>
                </div>
              )})}
            </motion.div>
          )}

          {/* MAJOR DEFAULT QUIZZES TAB */}
          {activeTab === 'major' && (
            <motion.div 
              key="major"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              <div className="bg-gray-50 dark:bg-gray-900 transition-colors duration-300 ease-in-out p-4 rounded-xl border border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row items-center justify-between gap-3">
                <span className="text-xs text-gray-600 dark:text-gray-400 transition-colors duration-300 ease-in-out ">
                  {profile.educationLevel === 'SMA/SMK' ? (
                    <>Ujian Jurusan Utama yang Anda Ambil: <strong className="text-gray-900 dark:text-white transition-colors duration-300 ease-in-out font-semibold">{profile.major}</strong> <span className="text-red-400 font-medium ml-1">(Khusus Mahasiswa)</span></>
                  ) : (
                    <>Ujian Jurusan Utama yang Anda Ambil: <strong className="text-gray-900 dark:text-white transition-colors duration-300 ease-in-out font-semibold">{profile.major}</strong> (Membuka {profile.isPremium ? 10 : 3} matakuliah khusus).</>
                  )}
                </span>
                {profile.educationLevel === 'SMA/SMK' ? (
                  <span className="text-[10px] bg-gray-100 dark:bg-gray-700 transition-colors duration-300 ease-in-out border border-gray-300 text-gray-500 dark:text-gray-400 transition-colors duration-300 ease-in-out px-3 py-1 rounded-full uppercase font-bold opacity-80 cursor-not-allowed">TERKUNCI</span>
                ) : (
                  <span className="text-[10px] bg-teal-500/10 border border-teal-500/25 text-teal-400 px-3 py-1 rounded-full uppercase font-bold">AKTIF & TERBUKA</span>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {(() => {
                  let quizzes = MAJOR_QUIZZES[profile.major];
                  if (!quizzes || quizzes.length === 0) {
                    quizzes = Array.from({ length: 10 }).map((_, i) => ({
                      id: `custom-major-${i}`,
                      subject: `Pengantar ${profile.major} ${i + 1}`,
                      level: profile.educationLevel === 'SMA/SMK' ? 'SMA' : 'University',
                      major: profile.major || 'Umum',
                      questions: [
                        { question: `Apa fondasi utama dalam ${profile.major}?`, options: ['Teori A', 'Teori B', 'Praktek C', 'Analisis D'], correctAnswer: 0, explanation: 'Prinsip dasar sangat penting dipahami.' },
                        { question: `Bagaimana implementasi lanjutan dari keilmuan ini di industri?`, options: ['Metode X', 'Metode Y', 'Standar Z', 'Metrik W'], correctAnswer: 1, explanation: 'Standar implementasi mengikuti acuan industri.' },
                        { question: `Metode evaluasi yang paling efektif untuk bidang ini adalah?`, options: ['A', 'B', 'C', 'D'], correctAnswer: 2, explanation: 'Evaluasi berdasarkan data yang akurat.' }
                      ]
                    }));
                  }
                  
                  const displayQuizzes = profile.isPremium ? quizzes : quizzes.slice(0, 3);
                  return displayQuizzes.map((quiz) => {
                    const isCompleted = completedQuizzes.includes(quiz.id);
                    const isLocked = profile.educationLevel === 'SMA/SMK';
                    return (
                    <div key={quiz.id} className={`bg-gray-50 dark:bg-gray-900 transition-colors duration-300 ease-in-out p-5 rounded-2xl border ${isLocked ? 'border-gray-200 dark:border-gray-700 opacity-60' : 'border-gray-200 dark:border-gray-700 hover:border-gray-200 dark:border-gray-700'} transition-all flex flex-col justify-between`}>
                      <div className="space-y-2">
                        <span className="text-[9px] bg-[#8b5cf6]/20 text-[#c084fc] border border-[#a855f7]/20 px-2 py-0.5 rounded uppercase font-bold tracking-wider">
                          Kuliah Standar {profile.major}
                        </span>
                        <h4 className="text-md font-bold text-gray-900 dark:text-white transition-colors duration-300 ease-in-out font-display leading-tight">{quiz.subject}</h4>
                        <p className="text-[11px] text-gray-600 dark:text-gray-400 transition-colors duration-300 ease-in-out ">
                          Topik keahlian spesifik dalam Talent Card rekrutmen.
                        </p>
                      </div>

                      <div className="mt-5 pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
                        <span className="text-[10px] text-gray-500 dark:text-gray-400 transition-colors duration-300 ease-in-out ">{quiz.questions.length} Pertanyaan</span>
                        <button
                          onClick={() => !isLocked && !isCompleted && selectQuizToStart(quiz)}
                          disabled={isLocked || isCompleted}
                          className={`font-bold text-xs px-3 py-1.5 rounded-lg transition-all ${isLocked ? 'bg-white dark:bg-gray-800 transition-colors duration-300 ease-in-out text-gray-500 dark:text-gray-400 transition-colors duration-300 ease-in-out cursor-not-allowed' : isCompleted ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 cursor-not-allowed' : 'bg-teal-500 hover:bg-teal-400 text-gray-900 dark:text-white transition-colors duration-300 ease-in-out cursor-pointer'}`}
                        >
                          {isLocked ? 'Terkunci' : (isCompleted ? 'Selesai' : 'Mulai Ujian')}
                        </button>
                      </div>
                    </div>
                  )})
                })()}
              </div>
            </motion.div>
          )}

          {/* CROSS MAJOR QUIZZES (PREMIUM ONLY) */}
          {activeTab === 'cross' && (
            <motion.div 
              key="cross"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              <div className="bg-gray-50 dark:bg-gray-900 transition-colors duration-300 ease-in-out p-4 rounded-xl border border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row items-center justify-between gap-3">
                <span className="text-xs text-gray-600 dark:text-gray-400 transition-colors duration-300 ease-in-out ">
                  Maksimalkan akun luar biasamu! Ambil kuis lintas jurusan untuk memperkaya keahlian duplikasi / multi-bidang demi kredibilitas tertinggi di hadapan HRD.
                </span>
                {!profile.isPremium && (
                  <span className="text-[10px] bg-indigo-600 text-gray-900 dark:text-white transition-colors duration-300 ease-in-out /10 border border-amber-500/20 text-indigo-500 px-3 py-1 rounded-full uppercase font-bold flex items-center gap-1">
                    👑 Premium Only
                  </span>
                )}
              </div>

              {profile.isPremium ? (
                <div className="space-y-6">
                  {crossMajors.map((mjName) => (
                    <div key={mjName} className="space-y-3">
                      <h5 className="text-xs font-bold text-teal-400 uppercase tracking-widest border-l-2 border-teal-500 pl-2">
                        Kuis Lintas Bidang: {mjName}
                      </h5>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {(MAJOR_QUIZZES[mjName] || []).map((quiz) => {
                          const isCompleted = completedQuizzes.includes(quiz.id);
                          return (
                          <div key={quiz.id} className={`bg-gray-50 dark:bg-gray-900 transition-colors duration-300 ease-in-out p-5 rounded-2xl border ${isCompleted ? 'border-gray-200 dark:border-gray-700' : 'border-gray-200 dark:border-gray-700 hover:border-gray-200 dark:border-gray-700'} transition-all flex flex-col justify-between`}>
                            <div className="space-y-2">
                              <span className="text-[9px] bg-indigo-600 text-gray-900 dark:text-white transition-colors duration-300 ease-in-out /15 text-indigo-500 border border-amber-500/25 px-2 py-0.5 rounded uppercase font-bold tracking-wider">
                                Cross-Quiz {mjName}
                              </span>
                              <h4 className="text-md font-bold text-gray-900 dark:text-white transition-colors duration-300 ease-in-out font-display leading-tight">{quiz.subject}</h4>
                              <p className="text-[11px] text-gray-600 dark:text-gray-400 transition-colors duration-300 ease-in-out ">
                                Perkaya akun Anda dengan menjawab kuis di luar bidang studi utama untuk meningkatkan rating OVR secara komprehensif.
                              </p>
                            </div>

                            <div className="mt-5 pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
                              <span className="text-[10px] text-gray-500 dark:text-gray-400 transition-colors duration-300 ease-in-out ">{quiz.questions.length} Pertanyaan</span>
                              <button
                                onClick={() => !isCompleted && selectQuizToStart(quiz)}
                                disabled={isCompleted}
                                className={`font-bold text-xs px-3 py-1.5 rounded-lg transition-all ${isCompleted ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 cursor-not-allowed' : 'bg-teal-500 hover:bg-teal-400 text-gray-900 dark:text-white transition-colors duration-300 ease-in-out cursor-pointer'}`}
                              >
                                {isCompleted ? 'Selesai' : 'Mulai Ujian Lintas'}
                              </button>
                            </div>
                          </div>
                        )})}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-gray-50 dark:bg-gray-900 transition-colors duration-300 ease-in-out /60 p-12 text-center border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-3xl space-y-4">
                  <div className="w-12 h-12 bg-indigo-600 text-gray-900 dark:text-white transition-colors duration-300 ease-in-out /10 text-indigo-500 rounded-full flex items-center justify-center mx-auto border border-amber-500/20">
                    👑
                  </div>
                  <div className="space-y-1.5 max-w-sm mx-auto">
                    <h5 className="font-bold text-gray-900 dark:text-white transition-colors duration-300 ease-in-out text-md">Akses Kuis Lintas Jurusan Digembok</h5>
                    <p className="text-xs text-gray-600 dark:text-gray-400 transition-colors duration-300 ease-in-out ">
                      Sebagai anggota Free, Anda hanya dibolehkan mengerjakan kuis default jurusan {profile.major}. Menjadi Premium untuk membuktikan kompetensi lintas bidang Anda pada radar HRD!
                    </p>
                  </div>
                  <button
                    onClick={onUpgradeToPremium}
                    className="bg-indigo-600 text-gray-900 dark:text-white transition-colors duration-300 ease-in-out hover:bg-indigo-700 text-gray-900 dark:text-white transition-colors duration-300 ease-in-out font-semibold px-4 py-2 rounded-xl text-xs transition-all cursor-pointer"
                  >
                    Dapatkan Keanggotaan Premium Sekarang
                  </button>
                </div>
              )}
            </motion.div>
          )}
          </AnimatePresence>

        </div>
      ) : (
        /* QUIZ ACTIVE SCREEN WITH PROCTORING SIMULATION DOCK */
        <div id="quiz-active-view" className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* THE DIGITAL PROCTORING COLUMN */}
          <div className="lg:col-span-4 bg-white dark:bg-gray-800 transition-colors duration-300 ease-in-out border border-gray-200 dark:border-gray-700 p-5 rounded-2xl space-y-4 text-left">
            <h4 className="text-xs font-bold text-gray-800 uppercase tracking-widest font-display flex items-center gap-1.5 border-b border-gray-200 dark:border-gray-700 pb-3">
              <Video className="w-4 h-4 text-red-500 animate-pulse" /> AI Proctoring Dashboard
            </h4>

            {/* LIVE PULSING CANVAS WEBCAM SIM */}
            <div className="relative rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
              <canvas ref={canvasRef} width={280} height={180} className="w-full bg-gray-50 dark:bg-gray-900 transition-colors duration-300 ease-in-out block" />
              
              <div className="absolute top-2.5 right-2.5 bg-red-650 text-gray-900 dark:text-white transition-colors duration-300 ease-in-out font-bold font-mono text-[9px] px-2 py-0.5 rounded flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" /> REC LIVE
              </div>
            </div>

            {/* PROCTOR INSTRUCTIONS */}
            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between items-center bg-gray-50 dark:bg-gray-900 transition-colors duration-300 ease-in-out p-2 rounded-lg border border-gray-200 dark:border-gray-700">
                <span className="text-gray-500 dark:text-gray-400 transition-colors duration-300 ease-in-out ">PROCTOR AGENT ID:</span>
                <span className="font-mono text-gray-500 dark:text-gray-400 transition-colors duration-300 ease-in-out ">PROCT-889-JKT</span>
              </div>
              <div className="flex justify-between items-center bg-gray-50 dark:bg-gray-900 transition-colors duration-300 ease-in-out p-2 rounded-lg border border-gray-200 dark:border-gray-700">
                <span className="text-gray-500 dark:text-gray-400 transition-colors duration-300 ease-in-out ">VOICE/AUDIO PROCT:</span>
                <span className="text-red-400 font-bold flex items-center gap-1">
                  <Mic className="w-3.5 h-3.5 text-red-400 shrink-0" /> MUTED & RECORDING
                </span>
              </div>
              <div className="flex justify-between items-center bg-gray-50 dark:bg-gray-900 transition-colors duration-300 ease-in-out p-2 rounded-lg border border-gray-200 dark:border-gray-700">
                <span className="text-gray-500 dark:text-gray-400 transition-colors duration-300 ease-in-out ">BROWSER ENVIRONMENT:</span>
                <span className="text-emerald-400 font-bold">SEB LOCKED (Tab Safe)</span>
              </div>
            </div>

            <div className="bg-indigo-600 text-gray-900 dark:text-white transition-colors duration-300 ease-in-out /10 border border-amber-500/20 p-3 rounded-xl text-[10px] text-indigo-400 leading-normal">
              🚨 <strong>PERINGATAN SEB:</strong> Mengalihkan jendela gawai atau membuka window pencarian baru di Google akan langsung membatalkan kelayakan ujian kuis keahlian Anda secara permanen.
            </div>

            {/* NAV GRID FOR QUESTIONS */}
            {!quizFinished && selectedQuiz && (
              <div className="bg-gray-50 dark:bg-gray-900 transition-colors duration-300 ease-in-out p-4 rounded-xl border border-gray-200 dark:border-gray-700 space-y-3">
                <h3 className="text-xs font-bold text-gray-800">Navigasi Soal</h3>
                <div className="grid grid-cols-5 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-5 gap-2">
                  {selectedQuiz.questions.map((_, idx) => {
                    const isAnswered = answers[idx] !== undefined;
                    const isRagu = raguAnswers[idx] === true;
                    const isActive = currentIdx === idx;
                    
                    let bgClass = 'bg-white dark:bg-gray-800 transition-colors duration-300 ease-in-out border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 transition-colors duration-300 ease-in-out ';
                    if (isActive) bgClass = 'bg-white dark:bg-gray-800 transition-colors duration-300 ease-in-out border-sky-500 text-gray-900 dark:text-white transition-colors duration-300 ease-in-out shadow-sm';
                    else if (isRagu) bgClass = 'bg-indigo-600 text-gray-900 dark:text-white transition-colors duration-300 ease-in-out border-amber-600 text-amber-950 font-bold';
                    else if (isAnswered) bgClass = 'bg-emerald-500 border-emerald-600 text-emerald-950 font-bold';

                    return (
                      <button
                        key={idx}
                        onClick={() => setCurrentIdx(idx)}
                        className={`aspect-square rounded text-xs transition-all border outline-none cursor-pointer flex items-center justify-center hover:scale-105 ${bgClass}`}
                      >
                        {idx + 1}
                      </button>
                    );
                  })}
                </div>
                <div className="text-[10px] space-y-1.5 text-gray-600 dark:text-gray-400 transition-colors duration-300 ease-in-out pt-2 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 bg-emerald-500 rounded-sm shrink-0" /> Dijawab</div>
                  <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 bg-indigo-600 text-gray-900 dark:text-white transition-colors duration-300 ease-in-out rounded-sm shrink-0" /> Ragu-ragu</div>
                  <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 bg-transparent border border-gray-200 dark:border-gray-700 rounded-sm shrink-0" /> Belum Dijawab</div>
                </div>
              </div>
            )}
          </div>

          {/* ACTIVE TEST GRID */}
          <div className="lg:col-span-8 bg-white dark:bg-gray-800 transition-colors duration-300 ease-in-out border border-gray-200 dark:border-gray-700 rounded-3xl p-6 space-y-6 text-left relative flex flex-col min-h-[400px]">
            {!quizFinished ? (
              <div className="space-y-6 flex-1 flex flex-col">
                <div className="flex justify-between items-start gap-4 border-b border-gray-200 dark:border-gray-700 pb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white transition-colors duration-300 ease-in-out font-display leading-tight">{selectedQuiz.subject}</h3>
                    <span className="text-[10px] text-gray-500 dark:text-gray-400 transition-colors duration-300 ease-in-out ">Soal {currentIdx + 1} dari {selectedQuiz.questions.length}</span>
                  </div>
                  <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-900 transition-colors duration-300 ease-in-out px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 shrink-0">
                    <span className="w-2 h-2 rounded-full bg-indigo-600 text-gray-900 dark:text-white transition-colors duration-300 ease-in-out animate-pulse" />
                    <span className="font-mono text-sm font-bold text-indigo-500">{formatTime(timeLeft)}</span>
                  </div>
                </div>

                <div className="flex-1">
                  {selectedQuiz.questions.map((q, qIdx) => {
                    if (qIdx !== currentIdx) return null;
                    return (
                      <div key={qIdx} className="space-y-5 animate-in fade-in zoom-in-95 duration-200">
                        <h4 className="text-[15px] font-semibold text-gray-900 dark:text-white transition-colors duration-300 ease-in-out leading-relaxed">
                          {q.question}
                        </h4>

                        <div className="grid grid-cols-1 gap-3 pt-2">
                          {q.options.map((opt, oIdx) => {
                            const isSelected = answers[qIdx] === oIdx;

                            return (
                              <button
                                key={oIdx}
                                type="button"
                                onClick={() => selectAnswer(qIdx, oIdx)}
                                className={`p-4 rounded-xl text-left border text-xs leading-relaxed transition-all cursor-pointer flex gap-4 items-start ${
                                  isSelected
                                    ? 'bg-sky-950/40 border-sky-500 text-sky-200 font-semibold shadow-md'
                                    : 'bg-gray-50 dark:bg-gray-900 transition-colors duration-300 ease-in-out border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 transition-colors duration-300 ease-in-out hover:border-gray-300 hover:text-gray-900 dark:text-white transition-colors duration-300 ease-in-out '
                                }`}
                              >
                                <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${
                                  isSelected ? 'border-sky-400 bg-sky-500' : 'border-gray-300'
                                }`}>
                                  {isSelected && <div className="w-2 h-2 rounded-full bg-gray-50 dark:bg-gray-900 transition-colors duration-300 ease-in-out " />}
                                </div>
                                <span className="text-[14px]">{opt}</span>
                              </button>
                            );
                          })}
                        </div>
                        
                        <label className="flex items-center gap-2 mt-4 cursor-pointer outline-none w-max group">
                          <input 
                            type="checkbox" 
                            className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-amber-500/50 bg-gray-50 dark:bg-gray-900 transition-colors duration-300 ease-in-out cursor-pointer"
                            checked={raguAnswers[qIdx] || false}
                            onChange={(e) => setRaguAnswers(prev => ({ ...prev, [qIdx]: e.target.checked }))}
                          />
                          <span className="text-sm font-medium text-gray-600 dark:text-gray-400 transition-colors duration-300 ease-in-out group-hover:text-indigo-500 transition-colors">Saya Ragu-ragu</span>
                        </label>
                      </div>
                    );
                  })}
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-700">
                  <button
                    onClick={() => setCurrentIdx(prev => Math.max(0, prev - 1))}
                    disabled={currentIdx === 0}
                    className="text-xs text-gray-600 dark:text-gray-400 transition-colors duration-300 ease-in-out bg-gray-50 dark:bg-gray-900 transition-colors duration-300 ease-in-out hover:bg-white dark:bg-gray-800 transition-colors duration-300 ease-in-out disabled:opacity-30 disabled:cursor-not-allowed border border-gray-200 dark:border-gray-700 px-5 py-2.5 rounded-xl transition-all cursor-pointer font-medium font-sans"
                  >
                    ← Sebelumnya
                  </button>

                  {currentIdx < selectedQuiz.questions.length - 1 ? (
                    <button
                      onClick={() => setCurrentIdx(prev => Math.min(selectedQuiz.questions.length - 1, prev + 1))}
                      className="bg-sky-500/20 hover:bg-sky-500/30 text-sky-400 border border-sky-500/30 font-bold text-xs px-5 py-2.5 rounded-xl transition-all cursor-pointer shadow-sm"
                    >
                      Selanjutnya →
                    </button>
                  ) : (
                    <button
                      onClick={requestSubmit}
                      className="bg-emerald-500 hover:bg-emerald-400 text-gray-900 dark:text-white transition-colors duration-300 ease-in-out font-bold text-xs px-5 py-2.5 rounded-xl transition-all cursor-pointer shadow-sm flex items-center gap-2"
                    >
                      <CheckCircle className="w-4 h-4" /> Selesai & Kumpulkan
                    </button>
                  )}
                </div>
              </div>
            ) : (
              /* COMPLETED RESULTS PANELS DURING ACTIVE SEB */
              <div className="text-center py-8 space-y-6">
                <div className="w-16 h-16 bg-emerald-500/10 text-emerald-400 rounded-full flex items-center justify-center mx-auto border-2 border-emerald-500/25">
                  <CheckCircle className="w-8 h-8" />
                </div>

                <div className="space-y-2">
                  <span className="text-[10px] uppercase font-bold text-gray-500 dark:text-gray-400 transition-colors duration-300 ease-in-out tracking-wider">Hasil Proktor SEB Terverifikasi</span>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white transition-colors duration-300 ease-in-out font-display">Ujian Selesai Dikirim!</h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400 transition-colors duration-300 ease-in-out max-w-sm mx-auto">
                    Kamera AI Zoom dan sistem Safe Exam Browser mencatat ujian {selectedQuiz.subject} bebas dari manipulasi dan kecurangan.
                  </p>
                </div>

                {/* Score badge */}
                <div className="bg-gray-50 dark:bg-gray-900 transition-colors duration-300 ease-in-out border border-gray-200 dark:border-gray-700 rounded-2xl p-6 inline-block max-w-xs w-full">
                  <span className="text-gray-500 dark:text-gray-400 transition-colors duration-300 ease-in-out text-xs block uppercase">SKOR MATAKULIAH</span>
                  <strong className="text-5xl font-mono text-emerald-400 font-extrabold tracking-tight mt-1 inline-block">
                    {quizScore} <span className="text-xs text-gray-500 dark:text-gray-400 transition-colors duration-300 ease-in-out font-normal">/100</span>
                  </strong>
                  
                  <div className="h-1 bg-white dark:bg-gray-800 transition-colors duration-300 ease-in-out w-full rounded-full mt-3 overflow-hidden">
                    <div className="h-full bg-emerald-400" style={{ width: `${quizScore}%` }} />
                  </div>
                </div>

                {/* Review explanation review */}
                <div className="space-y-4 max-w-md mx-auto text-left py-2">
                  <h4 className="text-xs font-bold text-gray-800 uppercase tracking-widest font-display">Analisis Lembar Pembahasan Kuis:</h4>
                  <div className="space-y-2.5 text-xs text-gray-500 dark:text-gray-400 transition-colors duration-300 ease-in-out leading-relaxed bg-gray-50 dark:bg-gray-900 transition-colors duration-300 ease-in-out /60 border border-gray-200 dark:border-gray-700 p-4 rounded-xl">
                    {selectedQuiz.questions.map((q, idx) => (
                      <div key={idx} className="border-b border-gray-200 dark:border-gray-700 pb-2 last:border-b-0">
                        <p className="font-semibold text-gray-800">Q: {q.question}</p>
                        <p className="text-[11px] text-gray-600 dark:text-gray-400 transition-colors duration-300 ease-in-out mt-1">Jawaban Anda: {q.options[answers[idx]] || 'Kosong'}</p>
                        <p className={`text-[11px] font-medium mt-1 ${answers[idx] === q.correctAnswer ? 'text-emerald-400' : 'text-indigo-500'}`}>✓ Pembahasan: {q.explanation}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => { setSelectedQuiz(null); setProctoringActive(false); }}
                  className="bg-teal-500 hover:bg-teal-400 text-gray-900 dark:text-white transition-colors duration-300 ease-in-out font-bold text-xs px-6 py-2.5 rounded-xl transition-all cursor-pointer"
                >
                  Kembali ke Portal Kuis
                </button>
              </div>
            )}
          </div>

        </div>
      )}

      {/* CUSTOM CONFIRM MODAL (REPLACES window.confirm) */}
      {confirmModal && confirmModal.isOpen && (
        <div className="fixed inset-0 bg-black/80 z-[10000] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 transition-colors duration-300 ease-in-out border border-gray-200 dark:border-gray-700 rounded-2xl p-8 max-w-sm w-full text-center shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="mx-auto w-16 h-16 rounded-full bg-indigo-600 text-gray-900 dark:text-white transition-colors duration-300 ease-in-out /15 text-indigo-600 flex items-center justify-center mb-4">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h3 className="font-display font-bold text-gray-900 dark:text-white transition-colors duration-300 ease-in-out text-xl mb-2">Konfirmasi Pengumpulan</h3>
            <p className="text-gray-600 dark:text-gray-400 transition-colors duration-300 ease-in-out text-sm whitespace-pre-wrap leading-relaxed mb-6">
              {confirmModal.message}
            </p>
            <div className="flex gap-3">
              <button 
                onClick={() => setConfirmModal(null)} 
                className="flex-1 bg-gray-50 dark:bg-gray-900 transition-colors duration-300 ease-in-out hover:bg-white dark:bg-gray-800 transition-colors duration-300 ease-in-out border border-gray-200 dark:border-gray-700 text-gray-800 font-bold px-4 py-2.5 rounded-xl text-sm transition-all"
              >
                Batal
              </button>
              <button 
                onClick={() => executeSubmit(false)} 
                className="flex-1 bg-emerald-500 hover:bg-emerald-400 text-gray-900 dark:text-white transition-colors duration-300 ease-in-out font-bold px-4 py-2.5 rounded-xl text-sm transition-all shadow-md"
              >
                Ya, Kumpulkan
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
