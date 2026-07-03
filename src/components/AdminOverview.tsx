/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Users, Award, CheckCircle2, TrendingUp, Sparkles, RefreshCw, BarChart3, Clock } from 'lucide-react';
import { UserProfile } from '../types';

interface AdminOverviewProps {
  candidates: any[];
  payments: any[];
  quizzes: any[];
  lang: 'id' | 'en';
  onSwitchTab: (tab: 'overview' | 'candidates' | 'pembayaran' | 'exams' | 'analytics' | 'settings') => void;
  onSelectCandidate: (candidate: any) => void;
  onRefresh: () => void;
}

const LOCALIZATION = {
  id: {
    welcome: "Selamat Datang, Admin 👋",
    subWelcome: "Platform rekrutmen TalentFlow aktif. Terdapat pendaftar baru hari ini yang menunggu verifikasi.",
    viewReport: "Lihat Laporan",
    totalCandidates: "Total Pendaftar",
    examsFinished: "Total Tes Diselesaikan",
    avgScore: "Rata-Rata Skor",
    passedCount: "Lulus Seleksi",
    recentApplicants: "Pendaftar Terbaru",
    viewAll: "Lihat Semua",
    quizPerformance: "Performa Kuis",
    loading: "Memuat data...",
    totalLabel: "total pendaftar",
    noData: "Belum ada performa kuis yang dicatat.",
    targetPos: "Posisi Target",
    stage: "Tahapan",
    action: "Aksi",
    registeredAt: "Tanggal Daftar",
    inspect: "Inspeksi",
    trendText: "dibandingkan kemarin"
  },
  en: {
    welcome: "Welcome Back, Admin 👋",
    subWelcome: "TalentFlow recruitment platform is active. New applicants are awaiting verification today.",
    viewReport: "View Reports",
    totalCandidates: "Total Applicants",
    examsFinished: "Exams Finished",
    avgScore: "Average Score",
    passedCount: "Selection Passed",
    recentApplicants: "Recent Applicants",
    viewAll: "View All",
    quizPerformance: "Quiz Performance",
    loading: "Loading data...",
    totalLabel: "total applicants",
    noData: "No quiz performance recorded yet.",
    targetPos: "Target position",
    stage: "Stage",
    action: "Action",
    registeredAt: "Date Registered",
    inspect: "Inspect",
    trendText: "compared to yesterday"
  }
};

export default function AdminOverview({
  candidates,
  payments,
  quizzes,
  lang,
  onSwitchTab,
  onSelectCandidate,
  onRefresh
}: AdminOverviewProps) {
  const t = LOCALIZATION[lang];

  // Calculations
  const totalApplicants = candidates.length;
  const pendingPayments = payments.length;
  
  // Calculate finished tests dynamically from candidate stats
  const finishedExamsCount = candidates.reduce((acc, curr) => {
    let count = 0;
    if (curr.quizScoresLog && curr.quizScoresLog.length > 0) {
      count = curr.quizScoresLog.length;
    } else if (curr.stats?.acd > 0) {
      count = 0; // Removing the simulated baseline tests dummy data
    }
    return acc + count;
  }, 0);

  // Compute average score
  const scoresArray = candidates.map(c => c.stats?.acd || 0).filter(s => s > 0);
  const averageScore = scoresArray.length > 0 
    ? Math.round(scoresArray.reduce((a, b) => a + b, 0) / scoresArray.length) 
    : 0;

  // Dynamically calculate averages for quizzes
  const quizStats = (quizzes || []).slice(0, 4).map(quiz => {
    const scores = candidates
      .map(c => c.quizScoresLog?.find((log: any) => log.id === quiz.id)?.score)
      .filter(score => score !== undefined && score > 0);
    
    const avg = scores.length > 0
      ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
      : 0;
      
    return {
      name: quiz.name,
      avg
    };
  }).filter(q => q.avg >= 0);

  // Candidates who passed (arbitrary score filter OVR > 75)
  const passedCandidatesCount = candidates.filter(c => (c.stats?.ovr || 0) > 75).length;

  // Recent 5 applicants
  const recentApplicants = [...candidates]
    .slice(0, 5);

  return (
    <div className="space-y-6">
      
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-gray-200 dark:border-gray-700 rounded-3xl p-6 text-left relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-2 relative z-10 max-w-xl">
          <h2 className="text-2xl font-black text-gray-900 dark:text-white transition-colors duration-300 ease-in-out font-display tracking-tight">{t.welcome}</h2>
          <p className="text-xs text-gray-600 dark:text-gray-400 transition-colors duration-300 ease-in-out leading-relaxed font-light">
            {t.subWelcome} {pendingPayments > 0 && (
              <span className="font-bold text-indigo-600">
                {pendingPayments} {lang === 'id' ? 'antrean pembayaran baru.' : 'new payment pending.'}
              </span>
            )}
          </p>
        </div>
        <div className="flex gap-2 relative z-10 select-none">
          <button 
            onClick={() => onSwitchTab('analytics')}
            className="flex items-center gap-2 bg-gray-50 dark:bg-gray-900 transition-colors duration-300 ease-in-out hover:bg-white dark:bg-gray-800 transition-colors duration-300 ease-in-out text-gray-900 dark:text-white transition-colors duration-300 ease-in-out border border-gray-200 dark:border-gray-700 px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer transition"
          >
            <TrendingUp className="w-4 h-4 text-teal-405" />
            {t.viewReport}
          </button>
        </div>
        {/* Subtle background glow */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/5 blur-3xl rounded-full" />
      </div>

      {/* Aggregate Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Total Applicants */}
        <div 
          onClick={() => onSwitchTab('candidates')}
          className="bg-white dark:bg-gray-800 transition-colors duration-300 ease-in-out border border-gray-200 dark:border-gray-700 p-4 rounded-2xl text-left hover:border-teal-500/40 cursor-pointer transition duration-155"
        >
          <div className="flex justify-between items-start">
            <div className="w-10 h-10 rounded-xl bg-teal-500/10 flex items-center justify-center text-teal-400">
              <Users className="w-5 h-5" />
            </div>
            <span className="text-[10px] text-teal-400 bg-teal-500/10 font-bold px-2 py-0.5 rounded-full">ACTIVE</span>
          </div>
          <h3 className="text-3xl font-black text-gray-900 dark:text-white transition-colors duration-300 ease-in-out font-mono mt-3">{totalApplicants}</h3>
          <span className="text-[10px] text-gray-500 dark:text-gray-400 transition-colors duration-300 ease-in-out uppercase tracking-wider block font-semibold mt-1">{t.totalCandidates}</span>
        </div>

        {/* Card 2: Exams Finished */}
        <div 
          onClick={() => onSwitchTab('analytics')}
          className="bg-white dark:bg-gray-800 transition-colors duration-300 ease-in-out border border-gray-200 dark:border-gray-700 p-4 rounded-2xl text-left hover:border-blue-500/40 cursor-pointer transition duration-155"
        >
          <div className="flex justify-between items-start">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400">
              <BarChart3 className="w-5 h-5" />
            </div>
            <span className="text-[10px] text-blue-400 bg-blue-500/10 font-bold px-2 py-0.5 rounded-full">+0%</span>
          </div>
          <h3 className="text-3xl font-black text-gray-900 dark:text-white transition-colors duration-300 ease-in-out font-mono mt-3">{finishedExamsCount}</h3>
          <span className="text-[10px] text-gray-500 dark:text-gray-400 transition-colors duration-300 ease-in-out uppercase tracking-wider block font-semibold mt-1">{t.examsFinished}</span>
        </div>

        {/* Card 3: Average Score */}
        <div
          onClick={() => onSwitchTab('analytics')}
          className="bg-white dark:bg-gray-800 transition-colors duration-300 ease-in-out border border-gray-200 dark:border-gray-700 p-4 rounded-2xl text-left hover:border-amber-500/40 cursor-pointer transition duration-155"
        >
          <div className="flex justify-between items-start">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-gray-900 dark:text-white transition-colors duration-300 ease-in-out /10 flex items-center justify-center text-indigo-500">
              <Clock className="w-5 h-5" />
            </div>
            <span className="text-[10px] text-amber-450 bg-indigo-600 text-gray-900 dark:text-white transition-colors duration-300 ease-in-out /10 font-semibold px-2 py-0.5 rounded-full">AVG</span>
          </div>
          <h3 className="text-3xl font-black text-gray-900 dark:text-white transition-colors duration-300 ease-in-out font-mono mt-3">{averageScore}%</h3>
          <span className="text-[10px] text-gray-500 dark:text-gray-400 transition-colors duration-300 ease-in-out uppercase tracking-wider block font-semibold mt-1">{t.avgScore}</span>
        </div>

        {/* Card 4: Selection Passed */}
        <div className="bg-white dark:bg-gray-800 transition-colors duration-300 ease-in-out border border-gray-200 dark:border-gray-700 p-4 rounded-2xl text-left">
          <div className="flex justify-between items-start">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <span className="text-[10px] text-emerald-405 bg-emerald-500/10 font-bold px-2 py-0.5 rounded-full">HIRED</span>
          </div>
          <h3 className="text-3xl font-black text-gray-900 dark:text-white transition-colors duration-300 ease-in-out font-mono mt-3">{passedCandidatesCount}</h3>
          <span className="text-[10px] text-gray-500 dark:text-gray-400 transition-colors duration-300 ease-in-out uppercase tracking-wider block font-semibold mt-1">{t.passedCount}</span>
        </div>

      </div>

      {/* Mid Level Content: Recent Applicants & Quiz Progress Performance Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Recent Applicants Column */}
        <div className="lg:col-span-7 bg-white dark:bg-gray-800 transition-colors duration-300 ease-in-out border border-gray-200 dark:border-gray-700 rounded-3xl p-5 text-left flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center pb-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2">
                <h4 className="font-display font-black text-gray-900 dark:text-white transition-colors duration-300 ease-in-out text-sm uppercase tracking-wider">{t.recentApplicants}</h4>
                <span className="text-[9.5px] bg-indigo-500/10 text-indigo-400 px-2 py-0.5 rounded-full border border-indigo-500/20">
                  {totalApplicants} {t.totalLabel}
                </span>
              </div>
              <button 
                onClick={() => onSwitchTab('candidates')}
                className="text-xs text-teal-400 hover:text-teal-300 font-bold flex items-center gap-1 cursor-pointer transition select-none"
              >
                {t.viewAll} →
              </button>
            </div>

            <div className="mt-4 divide-y divide-slate-850 overflow-hidden">
              {recentApplicants.map((cand) => {
                const inisial = cand.name.slice(0, 2).toUpperCase();
                return (
                  <div 
                    key={cand.id || cand.email}
                    onClick={() => { onSwitchTab('candidates'); onSelectCandidate(cand); }}
                    className="py-3 flex items-center justify-between gap-4 hover:bg-white dark:bg-gray-800 transition-colors duration-300 ease-in-out px-2 rounded-xl cursor-pointer transition"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-indigo-500/15 border border-indigo-500/25 flex items-center justify-center font-bold text-xs text-indigo-405 font-display">
                        {inisial}
                      </div>
                      <div>
                        <strong className="text-xs text-gray-900 dark:text-white transition-colors duration-300 ease-in-out block">{cand.name}</strong>
                        <span className="text-[10px] text-gray-500 dark:text-gray-400 transition-colors duration-300 ease-in-out block truncate max-w-[170px] mt-0.5">
                          {cand.educationLevel} • {cand.major}
                        </span>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-[10px] text-indigo-600 bg-indigo-600 text-gray-900 dark:text-white transition-colors duration-300 ease-in-out /10 border border-amber-500/20 px-2.5 py-0.5 rounded-full font-bold">
                        {cand.stats?.ovr > 0 ? `${cand.stats.ovr} OVR` : "0 OVR"}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Quiz Performance Bars Column */}
        <div className="lg:col-span-5 bg-white dark:bg-gray-800 transition-colors duration-300 ease-in-out border border-gray-200 dark:border-gray-700 rounded-3xl p-5 text-left">
          <h4 className="font-display font-black text-gray-900 dark:text-white transition-colors duration-300 ease-in-out text-sm uppercase tracking-wider pb-4 border-b border-gray-200 dark:border-gray-700">{t.quizPerformance}</h4>
          
          <div className="mt-5 space-y-4">
            {quizStats.length > 0 ? quizStats.map((quiz, idx) => {
              const bgColors = ["bg-teal-500", "bg-blue-500", "bg-indigo-600 text-gray-900 dark:text-white transition-colors duration-300 ease-in-out ", "bg-purple-500"];
              const textColors = ["text-teal-400", "text-blue-400", "text-indigo-600", "text-purple-400"];
              const bgColor = bgColors[idx % bgColors.length];
              const textColor = textColors[idx % textColors.length];

              return (
                <div key={idx} className="space-y-1.5 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-gray-900 dark:text-white transition-colors duration-300 ease-in-out ">{quiz.name}</span>
                    <span className={`${textColor} font-mono font-bold`}>{quiz.avg}% avg</span>
                  </div>
                  <div className="w-full bg-[#1e293b] h-2 rounded-full overflow-hidden">
                    <div className={`${bgColor} h-full rounded-full transition-all duration-500`} style={{ width: `${Math.min(100, Math.max(0, quiz.avg))}%` }} />
                  </div>
                </div>
              );
            }) : (
              <div className="text-center text-gray-500 dark:text-gray-400 transition-colors duration-300 ease-in-out text-xs italic py-4">
                {t.noData}
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
