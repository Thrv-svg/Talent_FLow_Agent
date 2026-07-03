/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { UserProfile, TalentCosmetics } from '../types';
import PapiRadarChart from './PapiRadarChart';
import DiscChart from './DiscChart';
import KraepelinChart from './KraepelinChart';
import { Sparkles, ChevronLeft, ChevronRight, Share2, Download, Trophy, Target, Zap, ShieldCheck, Star, Flame, Award, ChevronDown, ChevronUp } from 'lucide-react';

interface TalentCardProps {
  profile: UserProfile;
  psychResults?: any;
  aiReport?: any;
  quizScoresLog?: { id: string; score: number }[];
  onUpdateCosmetics?: (cosmetics: Partial<TalentCosmetics>) => void;
  onUpgradeToPremium?: () => void;
}

export default function TalentCard({ profile, psychResults, aiReport, quizScoresLog }: TalentCardProps) {
  const [activeChart, setActiveChart] = useState(0); // 0: PAPI, 1: DISC, 2: Kraepelin
  const [isExpanded, setIsExpanded] = useState(false);

  const initials = profile.name.slice(0, 2).toUpperCase();

  const papiLabels: Record<string, string> = {
    G: 'Pekerja Keras', L: 'Kepemimpinan', I: 'Buat Keputusan', T: 'Cepat Tanggap',
    V: 'Stamina Fisik', S: 'Hub. Sosial', R: 'Pemikir/Teoretis', D: 'Tegas & Berani',
    C: 'Terstruktur', E: 'Emosi Stabil', N: 'Gigih (Masalah)', A: 'Ambisius',
    P: 'Mengatur Orang', X: 'Cari Panggung', B: 'Diterima Tim', O: 'Dekat Personal',
    K: 'Kompetitif', F: 'Loyal (Atasan)', W: 'Taat Aturan (SOP)', Z: 'Butuh Inovasi'
  };

  const papiScores = psychResults?.papi?.scores || {};
  
  // Identify dominant traits
  const radarOrder = ['G', 'L', 'I', 'T', 'V', 'S', 'R', 'D', 'C', 'E', 'N', 'A', 'P', 'X', 'B', 'O', 'K', 'F', 'W', 'Z'];
  const sortedTraits = [...radarOrder].sort((a, b) => (papiScores[b] || 0) - (papiScores[a] || 0));
  const dominant1 = sortedTraits[0];
  const dominant2 = sortedTraits[1];

  const getInterpretationBox = (trait: string) => {
    const interpretations: Record<string, string> = {
      B: 'Kebutuhan Diterima Kelompok (Staf Pendukung, Community Manager).',
      F: 'Loyal pada Atasan (Ajudan, Asisten Eksekutif, Staf Administrasi).',
      E: 'Emosi Super Stabil (Psikiater, Negosiator Sandera, Terapis).',
      X: 'Mencari Perhatian/Panggung (Aktor, Model, Public Speaker).',
      L: 'Pemimpin Alami (Manajer, Supervisor, Direktur).',
      I: 'Pengambil Keputusan (Eksekutif, Penasihat Bisnis).',
      D: 'Dominan & Tegas (Manajer Lapangan, Sales Manager).',
      C: 'Sangat Terstruktur (Akuntan, Administrator Data).',
      G: 'Pekerja Keras & Agresif (Pengusaha, Petarung Karier).',
      W: 'Taat Aturan SOP (Auditor, Quality Control, Inspektur).',
      A: 'Sangat Ambisius (Staf Sales, Entrepreneur).',
      K: 'Sangat Kompetitif (Atlet, Pemasar, Broker).',
      N: 'Gigih & Persisten (Riset, Teknisi, Investigator).',
      V: 'Stamina Fisik Tinggi (Pekerja Lapangan, Kurir, Ahli Logistik).',
      T: 'Cepat Tanggap (Resepsionis, Customer Service).',
      O: 'Dekat Secara Personal (HRD, Konselor, Guru).',
      P: 'Pengatur Orang (Supervisor Produksi, Koordinator).',
      R: 'Konseptor & Pemikir (Ilmuwan, Analis Data, Strategist).',
      S: 'Mudah Bergaul (Sales, Public Relations, Marketer).',
      Z: 'Butuh Inovasi (Desainer, Seniman, R&D).'
    };
    return interpretations[trait] || 'Trait unik yang sangat fleksibel untuk beragam peran.';
  };

  const isPremiumTheme = profile.cosmetics?.theme === 'gold' || profile.cosmetics?.theme === 'neon-cyber';

  // DISC Calc
  const discScores = psychResults?.disc?.scores || { D: 0, I: 0, S: 0, C: 0 };
  const discStyle = psychResults?.disc?.style || 'Belum Melakukan Tes';
  const totalDisc = (discScores.D || 0) + (discScores.I || 0) + (discScores.S || 0) + (discScores.C || 0) || 1;
  const dPct = Math.round(((discScores.D || 0) / totalDisc) * 100);
  const iPct = Math.round(((discScores.I || 0) / totalDisc) * 100);
  const sPct = Math.round(((discScores.S || 0) / totalDisc) * 100);
  const cPct = Math.round(((discScores.C || 0) / totalDisc) * 100);

  // Kraepelin Data
  const kraepelinResult = psychResults?.kraepelin || { speed: 0, accuracy: 0, stability: 0 };

  // Analyze test completions
  const hasAcademic = (quizScoresLog?.length || 0) > 0;
  const hasKraepelin = (kraepelinResult?.speed || 0) > 0;
  const hasDisc = (discScores?.D || 0) > 0 || (discScores?.I || 0) > 0 || (discScores?.S || 0) > 0 || (discScores?.C || 0) > 0;
  const hasPapi = Object.keys(papiScores).length > 0;

  const incompleteTests = [];
  if (!hasAcademic) incompleteTests.push('Kuis Akademik');
  if (!hasKraepelin) incompleteTests.push('Kraepelin');
  if (!hasDisc) incompleteTests.push('DISC');
  if (!hasPapi) incompleteTests.push('PAPI');
  
  const allTestsDone = incompleteTests.length === 0;

  // Achievement System
  const earnedAchievements = [];
  if (kraepelinResult.accuracy === 100) {
    earnedAchievements.push({ id: 'perfect_kraepelin', name: 'Perfect Kraepelin', icon: Target, color: 'text-emerald-600 bg-emerald-500/10 border-emerald-500/20' });
  }
  if (kraepelinResult.speed >= 90) {
    earnedAchievements.push({ id: 'speed_demon', name: 'Speed Demon', icon: Zap, color: 'text-indigo-600 bg-indigo-600 text-gray-900 dark:text-white transition-colors duration-300 ease-in-out /10 border-amber-500/20' });
  }
  if (Object.keys(papiScores).length > 0) {
    earnedAchievements.push({ id: 'papi_done', name: 'Self-Aware (PAPI)', icon: ShieldCheck, color: 'text-blue-600 bg-blue-500/10 border-blue-500/20' });
  }
  if (discScores.D > 0 || discScores.I > 0 || discScores.S > 0 || discScores.C > 0) {
    earnedAchievements.push({ id: 'disc_done', name: 'Communicator (DISC)', icon: Star, color: 'text-purple-600 bg-purple-500/10 border-purple-500/20' });
  }
  if ((quizScoresLog?.length || 0) >= 1) {
    earnedAchievements.push({ id: 'first_quiz', name: 'First Blood (Quiz)', icon: Sparkles, color: 'text-rose-600 bg-rose-500/10 border-rose-500/20' });
  }
  if ((quizScoresLog?.length || 0) >= 10) {
    earnedAchievements.push({ id: 'quiz_10', name: '10 Quizzes Completed', icon: Trophy, color: 'text-indigo-600 bg-indigo-600 text-gray-900 dark:text-white transition-colors duration-300 ease-in-out /10 border-amber-500/20' });
  }

  const nextChart = () => setActiveChart((p) => (p + 1) % 3);
  const prevChart = () => setActiveChart((p) => (p - 1 + 3) % 3);

  return (
    <div className="flex flex-col relative w-full border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 transition-colors duration-300 ease-in-out mb-6 overflow-hidden">
      
      {/* Top Header Mocking the Dialog */}
      <div className="flex justify-between items-center px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 transition-colors duration-300 ease-in-out ">
        <h2 className="text-gray-900 dark:text-white transition-colors duration-300 ease-in-out font-bold text-lg font-display tracking-wide">Talent Card</h2>
        <button className="text-gray-500 dark:text-gray-400 transition-colors duration-300 ease-in-out hover:text-gray-900 dark:text-white transition-colors duration-300 ease-in-out transition cursor-pointer">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
      </div>

      <div className="flex flex-col lg:flex-row">
        
        {/* LEFT COLUMN */}
        <div className="w-full lg:w-80 border-b lg:border-b-0 lg:border-r border-gray-200 dark:border-gray-700 p-6 lg:p-8 flex flex-col space-y-6">
          
          <div className="flex items-center gap-6">
            <div className={`w-20 h-20 rounded-xl flex items-center justify-center font-display text-3xl font-black text-gray-900 dark:text-white transition-colors duration-300 ease-in-out shrink-0 overflow-hidden ${profile.isPremium ? 'bg-gradient-to-tr from-amber-600 to-indigo-600 shadow-lg shadow-amber-500/20' : 'bg-blue-600 shadow-lg shadow-blue-500/20'}`}>
              {profile.avatar ? (
                <img src={profile.avatar} alt="Profile" className="w-full h-full object-cover keep-colors" />
              ) : (
                initials
              )}
            </div>
            
            <div className="flex flex-col items-center">
              <strong className={`font-mono text-3xl font-black tracking-tighter ${profile.isPremium ? 'text-indigo-600' : 'text-indigo-600'}`}>
                {profile.stats?.ovr > 0 ? profile.stats.ovr : "0"}
              </strong>
              <span className="text-[10px] text-gray-500 dark:text-gray-400 transition-colors duration-300 ease-in-out tracking-wider font-bold">OVR AVG</span>
            </div>
          </div>

          <div className="space-y-1">
            <h3 className="text-2xl font-black text-gray-900 dark:text-white transition-colors duration-300 ease-in-out font-display tracking-tight">{profile.name}</h3>
            <p className="text-sm text-indigo-600 font-bold">{profile.headline || 'Active Pelamar'}</p>
          </div>

          <div className="space-y-4 pt-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <span className="block text-[10px] uppercase font-bold text-gray-500 dark:text-gray-400 transition-colors duration-300 ease-in-out ">CONSISTENCY</span>
                <span className="block text-sm text-orange-400 font-bold flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5" /> {(profile.consistencyPoints || 0)} pts
                </span>
              </div>
              <div className="space-y-1">
                <span className="block text-[10px] uppercase font-bold text-gray-500 dark:text-gray-400 transition-colors duration-300 ease-in-out ">STREAK</span>
                <span className="block text-sm text-yellow-400 font-bold flex items-center gap-1">
                  <Award className="w-3.5 h-3.5" /> {(profile.checkInStreak || 0)} days
                </span>
              </div>
            </div>
            <div className="space-y-1">
              <span className="block text-[10px] uppercase font-bold text-gray-500 dark:text-gray-400 transition-colors duration-300 ease-in-out ">EMAIL</span>
              <span className="block text-sm text-gray-800 dark:text-gray-300 font-medium">{profile.email}</span>
            </div>
            <div className="space-y-1">
              <span className="block text-[10px] uppercase font-bold text-gray-500 dark:text-gray-400 transition-colors duration-300 ease-in-out ">WHATSAPP</span>
              <span className="block text text-gray-800 dark:text-gray-300 font-bold tracking-wide">{profile.whatsapp || '-'}</span>
            </div>
            <div className="space-y-2">
              <span className="block text-[10px] uppercase font-bold text-gray-500 dark:text-gray-400 transition-colors duration-300 ease-in-out ">STATUS TES</span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#105a46] border border-emerald-500/20 text-emerald-600 text-xs font-bold rounded-full">
                {kraepelinResult.speed > 0 || discScores.D > 0 || papiScores.G > 0 ? "Selesai (Aktif)" : "Belum Tersedia"}
              </span>
            </div>
            
            {earnedAchievements.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-gray-200 dark:border-gray-700/50">
                <span className="block text-[10px] uppercase font-bold text-gray-500 dark:text-gray-400 transition-colors duration-300 ease-in-out ">ACHIEVEMENTS</span>
                <div className="flex flex-wrap gap-2">
                  {earnedAchievements.map(ach => (
                    <div 
                      key={ach.id} 
                      className={`inline-flex items-center gap-1 px-2.5 py-1 ${ach.color} border rounded-md text-[10px] font-bold shadow-sm transition hover:scale-105 cursor-default`}
                      title={ach.name}
                    >
                      <ach.icon className="w-3.5 h-3.5" />
                      {ach.name}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* AI Box */}
          <div className="bg-emerald-50 dark:bg-emerald-900/20 text-gray-900 dark:text-emerald-100 transition-colors duration-300 ease-in-out p-5 rounded-2xl border border-emerald-200 dark:border-emerald-800 mt-auto leading-relaxed shadow-[0_0_15px_rgba(16,185,129,0.05)]">
            <h4 className="flex items-start gap-2 text-emerald-600 dark:text-emerald-400 font-bold mb-3 font-display text-lg tracking-tight leading-sm">
              AI Psychological Interpretation
            </h4>
            <div className="space-y-3 text-sm text-emerald-900 dark:text-emerald-200 font-light">
              {allTestsDone ? (
                <div>
                  <span className="text-blue-600 dark:text-blue-400 font-bold block mb-1">Dimensi Perilaku Dominan:</span>
                  <ul className="list-disc pl-4 space-y-2 marker:text-emerald-500 text-xs">
                    <li><strong className="text-emerald-700 dark:text-emerald-300 w-4 inline-block">{dominant1}:</strong> {getInterpretationBox(dominant1)}</li>
                    <li><strong className="text-emerald-700 dark:text-emerald-300 w-4 inline-block">{dominant2}:</strong> {getInterpretationBox(dominant2)}</li>
                  </ul>
                </div>
              ) : (
                <div className="text-emerald-700 dark:text-emerald-400 font-medium text-xs leading-relaxed">
                  Interpretasi AI belum tersedia. Silakan selesaikan rangkaian tes berikut:
                  <ul className="mt-2 space-y-1 ml-4 list-disc marker:text-emerald-500 font-semibold text-emerald-600 dark:text-emerald-300">
                    {incompleteTests.map(test => (
                      <li key={test}>{test}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN */}
        <div className="flex-1 p-6 lg:p-8 flex flex-col items-center relative">
          
          <div className="w-full text-left mb-4">
            <h3 className="text-xl font-bold font-display text-gray-900 dark:text-white transition-colors duration-300 ease-in-out border-b border-gray-200 dark:border-gray-700 pb-2">
              {activeChart === 0 && 'Dimensi Perilaku (PAPI)'}
              {activeChart === 1 && 'Gaya Komunikasi (DISC)'}
              {activeChart === 2 && 'Ketahanan Kerja (Kraepelin)'}
            </h3>
          </div>

          <div className="w-full flex-1 flex flex-col items-center justify-center min-h-[380px] max-w-[600px] relative overflow-hidden">
            <AnimatePresence mode="wait">
              {activeChart === 0 && (
                <motion.div 
                  key="0"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  className="w-full flex justify-center"
                >
                  <PapiRadarChart scores={papiScores} width={400} height={400} />
                </motion.div>
              )}

              {activeChart === 1 && (
                <motion.div 
                  key="1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  className="w-full"
                >
                  <DiscChart scores={{ D: discScores.D, I: discScores.I, S: discScores.S, C: discScores.C }} height={350} />
                </motion.div>
              )}

              {activeChart === 2 && (
                <motion.div 
                  key="2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  className="w-full"
                >
                  <KraepelinChart speed={kraepelinResult.speed || 0} accuracy={kraepelinResult.accuracy || 0} stability={kraepelinResult.stability || 0} dataPoints={kraepelinResult.grafikData || []} height={350} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* LOWER SECTION (LEGENDS & METADATA) */}
          <AnimatePresence mode="wait">
            {activeChart === 0 && (
              <motion.div 
                key="l0"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="w-full bg-gray-50 dark:bg-gray-900 transition-colors duration-300 ease-in-out border border-gray-200 dark:border-gray-700 rounded-2xl p-5 mt-6 border-dashed"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2.5 text-xs text-gray-600 dark:text-gray-400 transition-colors duration-300 ease-in-out ">
                  {['G', 'L', 'I', 'T', 'V', 'S', 'R', 'D', 'C', 'E'].map(key => (
                    <div key={key} className="flex items-center">
                      <strong className="text-emerald-600 w-6 font-bold">{key}:</strong> 
                      <span className="flex-1 font-light truncate">{papiLabels[key]}</span>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2.5 text-xs text-gray-600 dark:text-gray-400 transition-colors duration-300 ease-in-out mt-2.5">
                  {['N', 'A', 'P', 'X', 'B', 'O', 'K', 'F', 'W', 'Z'].map(key => (
                    <div key={key} className="flex items-center">
                      <strong className="text-emerald-600 w-6 font-bold">{key}:</strong> 
                      <span className="flex-1 font-light truncate">{papiLabels[key]}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeChart === 1 && (
              <motion.div 
                key="l1"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="w-full bg-gray-50 dark:bg-gray-900 transition-colors duration-300 ease-in-out border border-gray-200 dark:border-gray-700 rounded-2xl p-5 mt-6 border-dashed flex flex-col gap-2"
              >
                <strong className="text-gray-900 dark:text-white transition-colors duration-300 ease-in-out text-sm">Gaya Utama (DISC): <span className="text-indigo-600">{discStyle}</span></strong>
                <p className="text-xs text-gray-600 dark:text-gray-400 transition-colors duration-300 ease-in-out leading-relaxed">
                  Menjabarkan kecenderungan Anda dalam merespons lingkungan dan tekanan. 
                  Tipe <strong className="text-gray-800">Dominance (D)</strong> berarti dorongan kuat menyelesaikan tantangan, 
                  <strong className="text-gray-800"> Influence (I)</strong> untuk persuasi, 
                  <strong className="text-gray-800"> Steadiness (S)</strong> untuk konsistensi tim, dan 
                  <strong className="text-gray-800"> Compliance (C)</strong> untuk ketaatan standar.
                </p>
              </motion.div>
            )}

            {activeChart === 2 && (
              <motion.div 
                key="l2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="w-full bg-gray-50 dark:bg-gray-900 transition-colors duration-300 ease-in-out border border-gray-200 dark:border-gray-700 rounded-2xl p-5 mt-6 border-dashed flex flex-col gap-3 text-xs text-gray-600 dark:text-gray-400 transition-colors duration-300 ease-in-out "
              >
                <div className="flex w-full gap-2 font-mono font-bold text-center">
                  <div className="flex-1 min-w-0 p-2 overflow-hidden bg-gray-50 dark:bg-gray-900 transition-colors duration-300 ease-in-out border border-gray-200 dark:border-gray-700 rounded-lg">
                    <span className="block truncate text-[10px] text-gray-500 dark:text-gray-400 transition-colors duration-300 ease-in-out mb-1" title="SPEED (Kecepatan)">Kecepatan</span>
                    <span className="text-indigo-600 text-base sm:text-lg">{kraepelinResult.speed}/100</span>
                  </div>
                  <div className="flex-1 min-w-0 p-2 overflow-hidden bg-gray-50 dark:bg-gray-900 transition-colors duration-300 ease-in-out border border-gray-200 dark:border-gray-700 rounded-lg">
                    <span className="block truncate text-[10px] text-gray-500 dark:text-gray-400 transition-colors duration-300 ease-in-out mb-1" title="ACCURACY (Ketelitian)">Ketelitian</span>
                    <span className="text-emerald-600 text-base sm:text-lg">{kraepelinResult.accuracy}%</span>
                  </div>
                  <div className="flex-1 min-w-0 p-2 overflow-hidden bg-gray-50 dark:bg-gray-900 transition-colors duration-300 ease-in-out border border-gray-200 dark:border-gray-700 rounded-lg">
                    <span className="block truncate text-[10px] text-gray-500 dark:text-gray-400 transition-colors duration-300 ease-in-out mb-1" title="STABILITY (Kestabilan)">Kestabilan</span>
                    <span className="text-indigo-600 text-base sm:text-lg">{kraepelinResult.stability}/100</span>
                  </div>
                </div>
                <p className="leading-relaxed mt-2 text-gray-600 dark:text-gray-400 transition-colors duration-300 ease-in-out text-center italic">
                  {kraepelinResult.speed > 0 ? (
                    <>
                      Kecepatan aritmatika Anda berada di tingkat {kraepelinResult.speed >= 80 ? 'Sangat Baik (Top Tier)' : kraepelinResult.speed >= 50 ? 'Standar (Rata-rata)' : 'Di Bawah Standar'}, 
                      dengan ketelitian yang {kraepelinResult.accuracy >= 90 ? 'Tinggi' : kraepelinResult.accuracy >= 60 ? 'Cukup Baik' : 'Kurang'}. 
                      {kraepelinResult.stability >= 75 ? ' Grafik menunjukkan konsistensi dan resiliensi mental yang sangat kuat di bawah tekanan.' 
                        : kraepelinResult.stability >= 40 ? ' Ketahanan fokus Anda tergolong standar, dengan sedikit fluktuasi.' 
                        : ' Terdapat indikasi keletihan kognitif dan penurunan fokus pada tekanan berkelanjutan.'}
                    </>
                  ) : (
                    "Belum ada data yang cukup untuk dianalisis."
                  )}
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ARROW CONTROLS (CAROUSEL) */}
          <div className="w-full mt-4 flex items-center justify-between z-20">
            <span className="text-[10px] text-gray-500 dark:text-gray-400 font-bold italic hidden sm:block">
              Geser untuk melihat chart lain
            </span>
            <div className="flex items-center gap-2">
              <button 
                onClick={prevChart}
                className="w-10 h-10 rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-white flex items-center justify-center transition-all shadow-sm cursor-pointer"
                aria-label="Previous Chart"
              >
                <ChevronLeft className="w-5 h-5 text-gray-900 dark:text-white" />
              </button>
              <button 
                onClick={nextChart}
                className="w-10 h-10 rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-white flex items-center justify-center transition-all shadow-sm cursor-pointer"
                aria-label="Next Chart"
              >
                <ChevronRight className="w-5 h-5 text-gray-900 dark:text-white" />
              </button>
            </div>
          </div>

        </div>

      </div>

      {/* EXPANDABLE METRICS GRID */}
      <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-3 bg-gray-50 dark:bg-gray-900 transition-colors duration-300 ease-in-out flex justify-center z-10 relative">
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-1.5 text-xs font-bold text-gray-600 dark:text-gray-400 transition-colors duration-300 ease-in-out hover:text-gray-900 dark:text-white transition-colors duration-300 ease-in-out transition-colors cursor-pointer"
        >
          {isExpanded ? (
            <>Hide Details <ChevronUp className="w-4 h-4" /></>
          ) : (
            <>View Details <ChevronDown className="w-4 h-4" /></>
          )}
        </button>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-white dark:bg-gray-800 transition-colors duration-300 ease-in-out border-t border-gray-200 dark:border-gray-700 overflow-hidden"
          >
            <div className="p-6 lg:px-8 lg:py-6">
              <h4 className="text-gray-900 dark:text-white transition-colors duration-300 ease-in-out font-bold mb-4 font-display flex items-center gap-2">
                <Target className="w-5 h-5 text-indigo-600" />
                Raw Psychometric Breakdown
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-gray-50 dark:bg-gray-900 transition-colors duration-300 ease-in-out border border-gray-200 dark:border-gray-700 p-4 rounded-xl flex flex-col">
                  <span className="text-[10px] text-gray-500 dark:text-gray-400 transition-colors duration-300 ease-in-out font-bold uppercase mb-1">Academic (ACD)</span>
                  <span className="text-2xl font-mono font-black text-blue-600 mt-auto">{profile.stats?.acd || 0}</span>
                </div>
                <div className="bg-gray-50 dark:bg-gray-900 transition-colors duration-300 ease-in-out border border-gray-200 dark:border-gray-700 p-4 rounded-xl flex flex-col">
                  <span className="text-[10px] text-gray-500 dark:text-gray-400 transition-colors duration-300 ease-in-out font-bold uppercase mb-1">Kraepelin Speed (SPD)</span>
                  <span className="text-2xl font-mono font-black text-indigo-600 mt-auto">{profile.stats?.spd || 0}</span>
                </div>
                <div className="bg-gray-50 dark:bg-gray-900 transition-colors duration-300 ease-in-out border border-gray-200 dark:border-gray-700 p-4 rounded-xl flex flex-col">
                  <span className="text-[10px] text-gray-500 dark:text-gray-400 transition-colors duration-300 ease-in-out font-bold uppercase mb-1">Kraepelin Cons. (CON)</span>
                  <span className="text-2xl font-mono font-black text-emerald-600 mt-auto">{profile.stats?.con || 0}</span>
                </div>
                 <div className="bg-gray-50 dark:bg-gray-900 transition-colors duration-300 ease-in-out border border-gray-200 dark:border-gray-700 p-4 rounded-xl flex flex-col">
                  <span className="text-[10px] text-gray-500 dark:text-gray-400 transition-colors duration-300 ease-in-out font-bold uppercase mb-1">Kraepelin Stress (STR)</span>
                  <span className="text-2xl font-mono font-black text-rose-600 mt-auto">{profile.stats?.str || 0}</span>
                </div>
                <div className="bg-gray-50 dark:bg-gray-900 transition-colors duration-300 ease-in-out border border-gray-200 dark:border-gray-700 p-4 rounded-xl flex flex-col">
                  <span className="text-[10px] text-gray-500 dark:text-gray-400 transition-colors duration-300 ease-in-out font-bold uppercase mb-1">DISC Comm (COM)</span>
                  <span className="text-2xl font-mono font-black text-indigo-600 mt-auto">{profile.stats?.com || 0}</span>
                </div>
                <div className="bg-gray-50 dark:bg-gray-900 transition-colors duration-300 ease-in-out border border-gray-200 dark:border-gray-700 p-4 rounded-xl flex flex-col">
                  <span className="text-[10px] text-gray-500 dark:text-gray-400 transition-colors duration-300 ease-in-out font-bold uppercase mb-1">PAPI Leadership (LDR)</span>
                  <span className="text-2xl font-mono font-black text-teal-600 mt-auto">{profile.stats?.ldr || 0}</span>
                </div>
                <div className="bg-gray-50 dark:bg-gray-900 transition-colors duration-300 ease-in-out border border-gray-200 dark:border-gray-700 p-4 rounded-xl flex flex-col">
                  <span className="text-[10px] text-gray-500 dark:text-gray-400 transition-colors duration-300 ease-in-out font-bold uppercase mb-1">PAPI Detail (DTL)</span>
                  <span className="text-2xl font-mono font-black text-purple-600 mt-auto">{profile.stats?.dtl || 0}</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
