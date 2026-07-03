/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { UserProfile } from '../types';
import { Eye, Search, Filter, ShieldCheck, Sparkles, SlidersHorizontal, ArrowDownWideNarrow } from 'lucide-react';
import { useState, useEffect } from 'react';
import apiClient from '../apiClient';

interface HRDSimulatorProps {
  profile: UserProfile;
  onUpgrade?: () => void;
}

export default function HRDSimulator({ profile, onUpgrade }: HRDSimulatorProps) {
  const [competitors, setCompetitors] = useState<any[]>([]);

  useEffect(() => {
    const fetchCompetitors = async () => {
      try {
        const res = await apiClient.get('/api/competitors');
        if (res.data.success) {
          setCompetitors(res.data.data);
        }
      } catch (err) {
        console.error('Failed to fetch competitors:', err);
      }
    };

    fetchCompetitors();
    const intervalId = setInterval(fetchCompetitors, 3000);
    return () => clearInterval(intervalId);
  }, []);

  // Filter out the user themselves from the competitors list because we add them explicitly 
  // to ensure their latest local state displays correctly.
  const filteredCompetitors = competitors.filter(c => c.id !== profile.id);

  // Compile full candidates list.
  // Sort pattern: PREMIUM ON TOP ALWAYS (Prioritas HRD), then sorted by OVR score
  const userCandidate = {
    id: profile.id,
    name: `${profile.name} (Anda)`,
    isPremium: profile.isPremium,
    major: profile.major,
    educationLevel: profile.educationLevel,
    ovr: profile.stats?.ovr > 0 ? profile.stats.ovr : 0,
    status: 'Applied',
    avatarColor: 'from-[#14b8a6] to-cyan-500',
    headline: profile.headline || 'Active Pelamar',
    avatarUrl: profile.avatar
  };

  const pool = [...filteredCompetitors, userCandidate];

  // Sort: premium first, then by OVR descending
  const sortedPool = pool.sort((a, b) => {
    if (a.isPremium && !b.isPremium) return -1;
    if (!a.isPremium && b.isPremium) return 1;
    return b.ovr - a.ovr;
  });

  const userRankIndex = sortedPool.findIndex((c) => c.id === profile.id) + 1;

  return (
    <div id="hrd-simulator" className="space-y-6 text-left card-appear">
      
      {/* BANNER */}
      <div className="bg-white dark:bg-gray-800 transition-colors duration-300 ease-in-out border border-gray-200 dark:border-gray-700 p-6 rounded-3xl space-y-2">
        <span className="text-[10px] bg-gray-50 dark:bg-gray-900 transition-colors duration-300 ease-in-out text-gray-600 dark:text-gray-400 transition-colors duration-300 ease-in-out border border-gray-200 dark:border-gray-700 px-3 py-1 rounded-full uppercase font-bold tracking-wider inline-flex items-center gap-1.5">
          <Eye className="w-3.5 h-3.5 text-teal-400" /> HRD Portal Panel Simulator
        </span>
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white transition-colors duration-300 ease-in-out font-display">Bagaimana HRD Melihat Profil & Kartu Talentamu?</h3>
        <p className="text-xs text-gray-800 leading-relaxed font-light">
          Simulasi dashboard rekrutmen ini mengilustrasikan bagaimana cara manajer HRD / direktur perusahaan menyortir jutaan pelamar kerja. Di platform kami, status keanggotaan premium secara dinamis memosisikan Anda pada slot prioritas tertinggi.
        </p>
      </div>

      {/* RECRUITMENT RANK SUMMARY ALIEN */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        <div className="bg-gray-50 dark:bg-gray-900 transition-colors duration-300 ease-in-out p-5 rounded-2xl border border-gray-200 dark:border-gray-700">
          <span className="text-[10px] text-gray-500 dark:text-gray-400 transition-colors duration-300 ease-in-out block uppercase font-bold">STATUS PRIORITAS PILAR</span>
          <strong className={`text-lg font-display ${profile.isPremium ? 'text-indigo-500' : 'text-gray-600 dark:text-gray-400 transition-colors duration-300 ease-in-out '}`}>
            {profile.isPremium ? '👑 PRIORITAS UTAMA' : 'STANDAR REKRUTMEN'}
          </strong>
          <p className="text-[10px] text-gray-600 dark:text-gray-400 transition-colors duration-300 ease-in-out mt-1">
            {profile.isPremium 
              ? 'Akun Anda ditempatkan pada urutan teratas list pelamar di gawai HRD.'
              : 'Akun Anda berada di daftar umum. Upgrade Premium untuk melompat ke peringkat teratas.'}
          </p>
        </div>

        <div className="bg-gray-50 dark:bg-gray-900 transition-colors duration-300 ease-in-out p-5 rounded-2xl border border-gray-200 dark:border-gray-700">
          <span className="text-[10px] text-gray-500 dark:text-gray-400 transition-colors duration-300 ease-in-out block uppercase font-bold">POSISI PELAMAR ANDA</span>
          <strong className="text-lg text-teal-400 font-display">
            Peringkat ke-{userRankIndex} dari {pool.length} Talenta
          </strong>
          <p className="text-[10px] text-gray-600 dark:text-gray-400 transition-colors duration-300 ease-in-out mt-1">
            Ditentukan berdasarkan skor OVR Talent Card dan prioritas keanggotaan.
          </p>
        </div>

        <div className="bg-gray-50 dark:bg-gray-900 transition-colors duration-300 ease-in-out p-5 rounded-2xl border border-gray-200 dark:border-gray-700 flex flex-col justify-between">
          <div>
            <span className="text-[10px] text-gray-500 dark:text-gray-400 transition-colors duration-300 ease-in-out block uppercase font-bold">TINGKAT RETEKS KUIS</span>
            <strong className="text-sm text-gray-900 dark:text-white transition-colors duration-300 ease-in-out block">
              {profile.isPremium ? '✓ Unlimited Retakes Aktif' : 'Terbatas 1x Sesi per Kuis'}
            </strong>
          </div>
          {!profile.isPremium && (
            <button
              onClick={onUpgrade}
              className="text-[10px] bg-indigo-600 text-gray-900 dark:text-white transition-colors duration-300 ease-in-out text-gray-900 dark:text-white transition-colors duration-300 ease-in-out font-bold px-3 py-1 rounded-md mt-2 shrink-0 self-start animate-pulse"
            >
              Dapatkan Retake Ucap
            </button>
          )}
        </div>

      </div>

      {/* PORTAL SIMULATION INTERACTIVE COMPRESSION BODY */}
      <div className="bg-gray-50 dark:bg-gray-900 transition-colors duration-300 ease-in-out p-5 rounded-3xl border border-gray-200 dark:border-gray-700 space-y-6">
        
        {/* Recruitment Header Control Bar mock */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 border-b border-gray-200 dark:border-gray-700 pb-4">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-gray-600 dark:text-gray-400 transition-colors duration-300 ease-in-out " />
            <span className="text-xs font-bold text-gray-500 dark:text-gray-400 transition-colors duration-300 ease-in-out font-display">Penyaring Pelamar Kerja: Seluruh Peserta</span>
          </div>

          <div className="flex gap-2 text-[10px] text-gray-600 dark:text-gray-400 transition-colors duration-300 ease-in-out items-center">
            <ArrowDownWideNarrow className="w-3.5 h-3.5 text-teal-400" />
            <span>Diurutkan: <strong>[Prioritas Member → OVR Tertinggi]</strong></span>
          </div>
        </div>

        {/* CANDIDATES DIRECT LIST */}
        <div className="space-y-3.5">
          {sortedPool.map((candidate, idx) => {
            const isUser = candidate.id === profile.id;
            
            return (
              <div 
                key={candidate.id}
                className={`p-4 md:p-5 rounded-2xl border transition-all flex flex-col md:flex-row items-center justify-between gap-4 relative overflow-hidden ${
                  isUser 
                    ? 'bg-teal-500/10 border-teal-500/40' 
                    : (candidate.isPremium ? 'bg-indigo-600 text-gray-900 dark:text-white transition-colors duration-300 ease-in-out /5 border-amber-500/20' : 'bg-white dark:bg-gray-800 transition-colors duration-300 ease-in-out border-gray-200 dark:border-gray-700')
                }`}
              >
                {/* Visual Rank Tag */}
                <div className="absolute top-2.5 left-2.5 font-mono text-[9px] text-gray-500 dark:text-gray-400 transition-colors duration-300 ease-in-out ">
                  RANK #{idx + 1}
                </div>

                <div className="flex gap-4 items-center text-left w-full md:w-auto mt-2 md:mt-0">
                  <div className={`w-11 h-11 rounded-full bg-gradient-to-tr ${candidate.avatarColor} text-gray-900 dark:text-white transition-colors duration-300 ease-in-out font-bold flex items-center justify-center font-display shadow-md overflow-hidden shrink-0`}>
                    {candidate.avatarUrl ? (
                      <img src={candidate.avatarUrl} alt="Profile" className="w-full h-full object-cover keep-colors" />
                    ) : (
                      candidate.name.replace(' (Anda)', '').slice(0, 2).toUpperCase()
                    )}
                  </div>

                  <div className="space-y-0.5">
                    <h4 className="text-sm font-bold text-gray-900 dark:text-white transition-colors duration-300 ease-in-out flex items-center gap-2">
                      {candidate.name}
                      {candidate.isPremium && (
                        <span className="bg-indigo-600 text-gray-900 dark:text-white transition-colors duration-300 ease-in-out /10 text-indigo-600 text-[9px] font-bold px-2 py-0.5 rounded-full border border-amber-500/20 flex items-center gap-0.5">
                          Prioritas
                        </span>
                      )}
                    </h4>
                    <p className="text-[11px] text-gray-600 dark:text-gray-400 transition-colors duration-300 ease-in-out ">{candidate.educationLevel} / {candidate.major}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 transition-colors duration-300 ease-in-out italic line-clamp-1">"{candidate.headline}"</p>
                  </div>
                </div>

                {/* Score badge / rating & Action */}
                <div className="flex items-center gap-4 justify-between w-full md:w-auto border-t md:border-t-0 border-gray-200 dark:border-gray-700 pt-3 md:pt-0">
                  <div className="text-left md:text-right">
                    <span className="block text-[8px] text-gray-500 dark:text-gray-400 transition-colors duration-300 ease-in-out uppercase tracking-widest font-bold">Overall FIFA Rating</span>
                    <strong className={`text-xl font-mono ${candidate.isPremium ? 'text-indigo-500' : 'text-teal-400'}`}>
                      {candidate.ovr} <span className="text-[10px] text-gray-500 dark:text-gray-400 transition-colors duration-300 ease-in-out ">OVR</span>
                    </strong>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-900 transition-colors duration-300 ease-in-out px-3 py-1.5 rounded-xl border border-gray-200 dark:border-gray-700 text-[10px] text-teal-400 font-mono">
                    👁️ Sedang Ditinjau
                  </div>
                </div>

              </div>
            );
          })}
        </div>

        {/* PROOF DE BRIEF */}
        {!profile.isPremium && (
          <div className="bg-indigo-600 text-gray-900 dark:text-white transition-colors duration-300 ease-in-out /10 border border-amber-500/25 p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between text-left gap-4">
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold text-indigo-500 flex items-center gap-1.5">
                👑 Naikkan Peringkat Rekrutmen Anda Sekarang
              </span>
              <p className="text-xs text-gray-800">
                Posisikan diri Anda langsung melompati kandidat lainnya dengan pendaftaran <strong>Premium Prioritas</strong>.
              </p>
            </div>
            <button
              onClick={onUpgrade}
              className="bg-indigo-600 text-gray-900 dark:text-white transition-colors duration-300 ease-in-out hover:bg-gold text-gray-900 dark:text-white transition-colors duration-300 ease-in-out font-bold text-xs px-5 py-2.5 rounded-xl transition-all cursor-pointer shadow-md shadow-amber-500/25 shrink-0"
            >
              Ubah Ke Premium Prioritas Rp 0 saja
            </button>
          </div>
        )}

      </div>

    </div>
  );
}
