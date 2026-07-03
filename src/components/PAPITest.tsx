/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { PAPI_QUESTIONS } from '../data/questions';
import { ShieldCheck, CheckCircle } from 'lucide-react';

interface PAPITestProps {
  onComplete: (answers: Record<number, 'A' | 'B'>) => void;
}

export default function PAPITest({ onComplete }: PAPITestProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, 'A' | 'B'>>({});
  const [isDone, setIsDone] = useState(false);
  const [timeLeft, setTimeLeft] = useState(45 * 60); // 45 Minutes

  const totalQuestions = PAPI_QUESTIONS.length;
  const currentQuestion = PAPI_QUESTIONS[currentIndex];

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

  const handleSelect = (questionId: number, option: 'A' | 'B') => {
    setAnswers((prev) => ({ ...prev, [questionId]: option }));
    
    // Auto advance after brief delay
    if (currentIndex < totalQuestions - 1) {
      setTimeout(() => {
        setCurrentIndex((prev) => prev + 1);
      }, 300);
    } else {
      setTimeout(() => {
        // Last question answered, check if all 90 are filled
        setAnswers((currentAnswers) => {
          const terjawab = Object.keys(currentAnswers).length; 
          if (terjawab >= totalQuestions) {
            processSubmit();
          }
          return currentAnswers;
        });
      }, 500);
    }
  };

  const processSubmit = () => {
    setIsDone(true);

    const baseTraits = ['G', 'L', 'I', 'T', 'V', 'S', 'R', 'Z', 'O', 'B', 'X', 'P', 'A', 'N', 'F', 'W', 'K', 'E', 'H', 'D'];
    const scores: Record<string, number> = {};
    baseTraits.forEach((t) => { scores[t] = 0; });

    // Use current state to process
    setAnswers((finalAnswers) => {
      PAPI_QUESTIONS.forEach((q) => {
        const choice = finalAnswers[q.id];
        if (choice === 'A') {
          const trait = q.optionA.trait;
          scores[trait] = (scores[trait] || 0) + 1;
        } else if (choice === 'B') {
          const trait = q.optionB.trait;
          scores[trait] = (scores[trait] || 0) + 1;
        }
      });

      Object.keys(scores).forEach((k) => {
        scores[k] = Math.min(9, Math.max(0, scores[k] || 0));
      });

      const roles: string[] = [];
      const needs: string[] = [];

      if (scores.L > 4) roles.push('Leadership');
      if (scores.G > 4) roles.push('Hard Worker');
      if (scores.I > 4) roles.push('Decision Maker');
      if (scores.R > 4) roles.push('Conceptual Analyst');
      if (scores.X > 4) needs.push('Recognition (X)');
      if (scores.D > 4) needs.push('Precision & Details (D)');
      if (scores.F > 4) needs.push('Support & Guidelines (F)');
      if (scores.W > 4) needs.push('Rules Cleared (W)');

      if (roles.length === 0) roles.push('Team Operator', 'Independent Contributor');
      if (needs.length === 0) needs.push('Group Affiliation (O)');

      setTimeout(() => {
        onComplete(finalAnswers);
      }, 2000);
      
      return finalAnswers;
    });
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const currentChoice = answers[currentQuestion.id];
  const totalAnsweredCount = Object.keys(answers).length;

  return (
    <div className="bg-gray-50 dark:bg-gray-900 transition-colors duration-300 ease-in-out border border-[#1f2d45] rounded-3xl p-4 md:p-8 max-w-5xl mx-auto flex flex-col md:flex-row gap-6 min-h-[600px]">
      
      {/* LEFT: QUESTION AREA */}
      <div className="flex-1 flex flex-col">
        {/* HEADER */}
        <div className="flex justify-between items-center bg-[#111827] border border-[#1f2d45] rounded-xl p-4 mb-4">
          <div>
            <h2 className="text-xl font-bold font-display text-gray-900 dark:text-white transition-colors duration-300 ease-in-out flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" /> PAPI Kostick Test
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
                <span className="font-bold text-gray-900 dark:text-white transition-colors duration-300 ease-in-out text-lg">Pertanyaan {currentQuestion.id}</span>
                <span className="text-xs font-bold px-3 py-1 bg-blue-500/10 text-blue-500 border border-blue-500/20 rounded-md">
                  Pilih Satu Paling Sesuai
                </span>
              </div>
              <p className="text-gray-800 text-sm">
                Manakah dari dua pernyataan di bawah ini yang paling menggambarkan diri Anda di lingkungan kerja?
              </p>
            </div>

            {/* OPTIONS A & B */}
            <div className="space-y-4">
              <button
                type="button"
                onClick={() => handleSelect(currentQuestion.id, 'A')}
                className={`w-full flex items-center gap-4 p-5 rounded-xl border-2 transition-all cursor-pointer text-left
                  ${currentChoice === 'A' 
                    ? 'border-emerald-500 bg-emerald-500/10' 
                    : 'border-[#1f2d45] bg-[#111827] hover:border-blue-500'}`}
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-lg shrink-0
                  ${currentChoice === 'A' ? 'bg-emerald-500 text-gray-900 dark:text-white transition-colors duration-300 ease-in-out ' : 'bg-[#1f2d45] text-[#8fa0be]'}`}
                >
                  a
                </div>
                <div className="text-gray-900 dark:text-white transition-colors duration-300 ease-in-out w-full text-base leading-relaxed">
                  {currentQuestion.optionA.text}
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleSelect(currentQuestion.id, 'B')}
                className={`w-full flex items-center gap-4 p-5 rounded-xl border-2 transition-all cursor-pointer text-left
                  ${currentChoice === 'B' 
                    ? 'border-emerald-500 bg-emerald-500/10' 
                    : 'border-[#1f2d45] bg-[#111827] hover:border-blue-500'}`}
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-lg shrink-0
                  ${currentChoice === 'B' ? 'bg-emerald-500 text-gray-900 dark:text-white transition-colors duration-300 ease-in-out ' : 'bg-[#1f2d45] text-[#8fa0be]'}`}
                >
                  b
                </div>
                <div className="text-gray-900 dark:text-white transition-colors duration-300 ease-in-out w-full text-base leading-relaxed">
                  {currentQuestion.optionB.text}
                </div>
              </button>
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
                onClick={() => {
                  if (totalAnsweredCount >= totalQuestions) {
                    processSubmit();
                  } else {
                    alert(`Tolong jawab pertanyaan tersisa. Terjawab: ${totalAnsweredCount}/90`);
                  }
                }}
                className={`py-3 px-6 rounded-xl font-bold text-sm transition-all ${
                  totalAnsweredCount >= totalQuestions
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-gray-900 dark:text-white transition-colors duration-300 ease-in-out shadow-lg shadow-emerald-500/20' 
                  : currentIndex === totalQuestions - 1 ? 'bg-white dark:bg-gray-800 transition-colors duration-300 ease-in-out text-gray-500 dark:text-gray-400 transition-colors duration-300 ease-in-out opacity-50 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-500 text-gray-900 dark:text-white transition-colors duration-300 ease-in-out '
                }`}
                disabled={currentIndex === totalQuestions - 1 && totalAnsweredCount < totalQuestions}
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
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white transition-colors duration-300 ease-in-out font-display">Tes PAPI Kostick Selesai!</h2>
            <p className="text-gray-600 dark:text-gray-400 transition-colors duration-300 ease-in-out ">Menganalisis Kebutuhan Sosial Lingkungan dan Gaya Bekerja Anda...</p>
          </div>
        )}
      </div>

      {/* RIGHT: NAVIGATION PANEL */}
      <div className="w-full md:w-72 shrink-0 flex flex-col space-y-4">
        <div className="bg-[#111827] border border-[#1f2d45] rounded-xl p-5 flex-1">
          <h3 className="text-gray-900 dark:text-white transition-colors duration-300 ease-in-out font-bold mb-4">Navigasi Soal (90 Items)</h3>
          
          <div className="grid grid-cols-5 gap-1.5 content-start max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
            {Array.from({ length: totalQuestions }).map((_, idx) => {
              const qId = idx + 1;
              const ans = answers[qId];
              const isActive = currentIndex === idx;
              
              return (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`aspect-square rounded flex items-center justify-center text-[10px] sm:text-xs font-bold transition-all border
                    ${isActive ? 'border-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]' : 'border-[#1f2d45]'}
                    ${ans ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' : 'bg-transparent text-gray-500 dark:text-gray-400 transition-colors duration-300 ease-in-out hover:bg-white dark:bg-gray-800 transition-colors duration-300 ease-in-out '}
                  `}
                >
                  {qId}
                </button>
              );
            })}
          </div>

          <div className="mt-6 pt-4 border-t border-[#1f2d45] space-y-3">
            <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400 transition-colors duration-300 ease-in-out ">
              <span className="w-3 h-3 rounded-sm bg-emerald-500 block shrink-0" /> Sudah Dijawab
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400 transition-colors duration-300 ease-in-out ">
              <span className="w-3 h-3 rounded-sm border border-[#1f2d45] block shrink-0" /> Belum Dijawab
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-[#1f2d45] text-xs text-gray-500 dark:text-gray-400 transition-colors duration-300 ease-in-out ">
            Terjawab: <strong className="text-emerald-400 ml-1">{totalAnsweredCount}</strong> / 90
          </div>
        </div>
      </div>

    </div>
  );
}
