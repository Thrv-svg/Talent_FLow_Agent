/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { DISC_QUESTIONS } from '../data/questions';
import { Award, UserCheck, CheckCircle } from 'lucide-react';

interface DISCTestProps {
  onComplete: (answers: Record<number, { most: string | null; least: string | null }>) => void;
}

export default function DISCTest({ onComplete }: DISCTestProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, { most: string | null; least: string | null }>>({});
  const [isDone, setIsDone] = useState(false);
  const [timeLeft, setTimeLeft] = useState(15 * 60); // 15 mins
  
  const totalQuestions = DISC_QUESTIONS.length;
  const currentQuestion = DISC_QUESTIONS[currentIndex];

  useEffect(() => {
    if (isDone) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          processSubmit(); // Auto submit
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isDone]);

  const handleSelect = (dimension: string, type: 'most' | 'least') => {
    setAnswers((prev) => {
      const qAnswers = prev[currentQuestion.id] || { most: null, least: null };
      const updated = { ...qAnswers };

      if (type === 'most') {
        if (updated.least === dimension) updated.least = null;
        updated.most = updated.most === dimension ? null : dimension;
      } else {
        if (updated.most === dimension) updated.most = null;
        updated.least = updated.least === dimension ? null : dimension;
      }

      return { ...prev, [currentQuestion.id]: updated };
    });
  };

  const currentAns = answers[currentQuestion.id] || { most: null, least: null };
  const canProceed = currentAns.most !== null && currentAns.least !== null;

  const handleNext = () => {
    if (!canProceed) return;
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex((p) => p + 1);
    } else {
      processSubmit();
    }
  };

  const processSubmit = () => {
    setIsDone(true);
    
    const scores = { D: 0, I: 0, S: 0, C: 0 };
    Object.values(answers as Record<number, { most: string | null; least: string | null }>).forEach((ans) => {
      if (ans.most) {
        scores[ans.most as 'D'|'I'|'S'|'C'] += 2; // +2 for most
      }
      if (ans.least) {
        scores[ans.least as 'D'|'I'|'S'|'C'] = Math.max(0, scores[ans.least as 'D'|'I'|'S'|'C'] - 1); // -1 for least
      }
    });

    let maxStyle: 'D' | 'I' | 'S' | 'C' = 'S';
    let maxVal = scores.S;
    if (scores.D > maxVal) { maxStyle = 'D'; maxVal = scores.D; }
    if (scores.I > maxVal) { maxStyle = 'I'; maxVal = scores.I; }
    if (scores.C > maxVal) { maxStyle = 'C'; maxVal = scores.C; }

    const styleMap = {
      D: 'Dominance (Director) - Komunikator Tegas & Pemberani',
      I: 'Influence (Connector) - Komunikator Antusias & Persuasif',
      S: 'Steadiness (Supporter) - Komunikator Hangat & Kooperatif',
      C: 'Conscientiousness (Planner) - Komunikator Analitis & Presisi'
    };

    setTimeout(() => {
      onComplete(answers);
    }, 1500);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900 transition-colors duration-300 ease-in-out border border-[#1f2d45] rounded-3xl p-4 md:p-8 max-w-5xl mx-auto flex flex-col md:flex-row gap-6 min-h-[600px]">
      
      {/* LEFT: QUESTION AREA */}
      <div className="flex-1 flex flex-col">
        {/* HEADER */}
        <div className="flex justify-between items-center bg-[#111827] border border-[#1f2d45] rounded-xl p-4 mb-4">
          <div>
            <h2 className="text-xl font-bold font-display text-gray-900 dark:text-white transition-colors duration-300 ease-in-out flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-blue-400" /> DISC Personality Test
            </h2>
            <p className="text-gray-600 dark:text-gray-400 transition-colors duration-300 ease-in-out text-xs mt-1">Soal {currentIndex + 1} dari {totalQuestions}</p>
          </div>
          <div className="flex items-center gap-2 bg-white dark:bg-gray-800 transition-colors duration-300 ease-in-out px-4 py-2 rounded-lg border border-gray-300 text-indigo-600 font-mono font-bold">
            ⏱️ {formatTime(timeLeft)}
          </div>
        </div>

        {!isDone ? (
          <div className="flex-1 space-y-4">
            <div className="bg-[#111827] border border-[#1f2d45] rounded-xl p-5 mb-2">
              <div className="flex items-center justify-between mb-4 border-b border-gray-200 dark:border-gray-700 pb-3">
                <span className="font-bold text-gray-900 dark:text-white transition-colors duration-300 ease-in-out text-lg">Pertanyaan {currentIndex + 1}</span>
                <span className="text-xs font-bold px-3 py-1 bg-indigo-600 text-gray-900 dark:text-white transition-colors duration-300 ease-in-out /10 text-indigo-600 border border-amber-500/20 rounded-md">
                  Tetrad Assessment
                </span>
              </div>
              <p className="text-gray-800 text-sm">
                Pilih satu pernyataan yang <strong className="text-emerald-400">PALING SESUAI (Most)</strong> dan satu yang <strong className="text-rose-400">PALING TIDAK SESUAI (Least)</strong> dengan diri Anda.
              </p>
            </div>

            {/* TETRAD ROWS */}
            <div className="space-y-3">
              {currentQuestion.options.map((opt, oIdx) => {
                const isMost = currentAns.most === opt.dimension;
                const isLeast = currentAns.least === opt.dimension;
                
                const mostDisabled = currentAns.most !== null && !isMost;
                const leastDisabled = currentAns.least !== null && !isLeast;

                return (
                  <div key={oIdx} className="group flex flex-col md:flex-row md:items-center justify-between bg-transparent border border-[#1f2d45] hover:border-blue-500 p-4 rounded-xl transition-all gap-4">
                    <div className="text-gray-900 dark:text-white transition-colors duration-300 ease-in-out text-sm leading-relaxed pr-4 flex-1">
                      {opt.text}
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleSelect(opt.dimension, 'most')}
                        disabled={mostDisabled || isLeast}
                        className={`px-3 py-2 border rounded-lg font-bold text-sm w-[90px] text-center flex justify-center items-center gap-1 transition-all
                          ${isMost ? 'bg-emerald-500/15 border-emerald-500 text-emerald-400' 
                            : (mostDisabled || isLeast) ? 'border-[#1f2d45] text-[#8fa0be] opacity-30 cursor-not-allowed bg-white dark:bg-gray-800 transition-colors duration-300 ease-in-out ' 
                            : 'border-[#1f2d45] bg-[#111827] text-[#8fa0be] hover:border-emerald-500 hover:text-emerald-400 hover:bg-emerald-500/5'
                          }`}
                      >
                        👍 Most
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSelect(opt.dimension, 'least')}
                        disabled={leastDisabled || isMost}
                        className={`px-3 py-2 border rounded-lg font-bold text-sm w-[90px] text-center flex justify-center items-center gap-1 transition-all
                          ${isLeast ? 'bg-rose-500/15 border-rose-500 text-rose-400' 
                            : (leastDisabled || isMost) ? 'border-[#1f2d45] text-[#8fa0be] opacity-30 cursor-not-allowed bg-white dark:bg-gray-800 transition-colors duration-300 ease-in-out ' 
                            : 'border-[#1f2d45] bg-[#111827] text-[#8fa0be] hover:border-rose-500 hover:text-rose-400 hover:bg-rose-500/5'
                          }`}
                      >
                        👎 Least
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex justify-between items-center pt-4">
              <button
                onClick={() => setCurrentIndex((p) => Math.max(0, p - 1))}
                className={`py-3 px-6 rounded-xl border font-semibold text-sm transition-all ${
                  currentIndex === 0 ? 'opacity-0 pointer-events-none' : 'border-[#1f2d45] text-gray-800 hover:bg-white dark:bg-gray-800 transition-colors duration-300 ease-in-out '
                }`}
              >
                ← Sebelumnya
              </button>
              
              <button
                onClick={handleNext}
                disabled={!canProceed}
                className={`py-3 px-6 rounded-xl font-bold text-sm transition-all ${
                  canProceed ? 'bg-blue-600 hover:bg-blue-500 text-gray-900 dark:text-white transition-colors duration-300 ease-in-out shadow-lg shadow-blue-500/20' : 'bg-white dark:bg-gray-800 transition-colors duration-300 ease-in-out text-gray-500 dark:text-gray-400 transition-colors duration-300 ease-in-out opacity-50 cursor-not-allowed'
                }`}
              >
                {currentIndex === totalQuestions - 1 ? 'Selesai & Kumpulkan' : 'Selanjutnya →'}
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center space-y-4">
             <div className="w-20 h-20 bg-emerald-500/10 text-emerald-400 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white transition-colors duration-300 ease-in-out font-display">Tes Selesai!</h2>
            <p className="text-gray-600 dark:text-gray-400 transition-colors duration-300 ease-in-out ">Mensubmit dan Menganalisis Profil Kepribadian Anda...</p>
          </div>
        )}
      </div>

      {/* RIGHT: NAVIGATION PANEL */}
      <div className="w-full md:w-64 shrink-0 flex flex-col space-y-4">
        <div className="bg-[#111827] border border-[#1f2d45] rounded-xl p-5 flex-1">
          <h3 className="text-gray-900 dark:text-white transition-colors duration-300 ease-in-out font-bold mb-4">Navigasi Soal</h3>
          
          <div className="grid grid-cols-5 gap-2 content-start max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
            {Array.from({ length: totalQuestions }).map((_, idx) => {
              const ans = answers[idx + 1];
              const isAnswered = ans && ans.most !== null && ans.least !== null;
              const isActive = currentIndex === idx;
              
              const isPrevAnswered = idx === 0 || (answers[idx] && answers[idx].most && answers[idx].least);

              return (
                <button
                  key={idx}
                  onClick={() => {
                    if (isPrevAnswered || idx <= currentIndex) {
                      setCurrentIndex(idx);
                    }
                  }}
                  className={`aspect-square rounded flex items-center justify-center text-xs font-bold transition-all border
                    ${isActive ? 'border-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]' : 'border-[#1f2d45]'}
                    ${isAnswered ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-transparent text-gray-500 dark:text-gray-400 transition-colors duration-300 ease-in-out hover:bg-white dark:bg-gray-800 transition-colors duration-300 ease-in-out '}
                  `}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>

          <div className="mt-6 pt-4 border-t border-[#1f2d45] space-y-3">
            <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400 transition-colors duration-300 ease-in-out ">
              <span className="w-3 h-3 rounded-sm bg-emerald-500 block shrink-0" /> Selesai
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400 transition-colors duration-300 ease-in-out ">
              <span className="w-3 h-3 rounded-sm border border-[#1f2d45] block shrink-0" /> Belum Selesai
            </div>
          </div>

          <div className="mt-8 p-3 bg-red-500/5 border border-red-500/20 text-red-300 text-xs rounded-lg leading-relaxed">
            <strong>Instruksi:</strong> Anda wajib memilih tepat 1 "Most" dan 1 "Least" sebelum dapat menuju nomor selanjutnya.
          </div>
        </div>
      </div>

    </div>
  );
}
