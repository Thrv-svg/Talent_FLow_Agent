/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Users, Search, ShieldCheck, Mail, Phone, Crown, CheckCircle, 
  X, RefreshCw, BarChart2, Star, MapPin, Sparkles, UserCheck2, ChevronLeft, ChevronRight, Trash2, RotateCcw 
} from 'lucide-react';
import { UserProfile } from '../types';
import PapiRadarChart from './PapiRadarChart';
import KraepelinChart from './KraepelinChart';
import DiscPieChart from './DiscPieChart';

interface AdminCandidatesProps {
  candidates: any[];
  lang: 'id' | 'en';
  selectedCandidate: any | null;
  onSelectCandidate: (candidate: any) => void;
  onTogglePremium: (candidate: any) => void;
  onDeleteCandidate?: (id: string) => void;
  onResetCandidate?: (id: string) => void;
  btnLoading: string | null;
}

const LOCALIZATION = {
  id: {
    title: "Daftar Semua Pendaftar",
    subTitle: "Kelola status lamaran, tinjau spesifikasi nilai psikografis, dan andalan profil Talent Card.",
    searchPlaceholder: "Cari nama, NIK, headline, email...",
    allStatus: "Semua Status",
    allMajor: "Semua Bidang",
    allLevel: "Semua Tingkat",
    statusReview: "Tahap Review",
    statusHired: "Diterima",
    statusRejected: "Tidak Lolos",
    statusWait: "Belum Ujian",
    statusFinished: "Selesai Ujian",
    priorityUrgent: "Prioritas Teratas",
    ratingOvr: "Kelayakan OVR",
    makePremium: "★ Jadikan Anggota Prioritas",
    removePremium: "☆ Batalkan Anggota Prioritas",
    processing: "Memproses...",
    candidateDetail: "Inspeksi Talent Card",
    academicExams: "Kuis Akademis",
    kraepelinCurve: "Ketahanan Kerja (Kraepelin)",
    discTitle: "Gaya Komunikasi (DISC)",
    papiTitle: "Karakter Kerja (PAPI Kostick)",
    aiReport: "Potret Karakter AI Senior",
    emptyAI: "Kandidat belum meminta interpretasi AI Senior.",
    ovrRatingLabel: "TOTAL VALUE",
    overallScore: "OVR AVG",
    details: "SOP Detail & Aturan",
    strengths: "Kekuatan Pokok (Strengths)",
    weaknesses: "Area Pengembangan (Weaknesses)",
    careers: "Rekomendasi Jabatan Ideal",
    academicStatsLabel: "Spesifikasi Atribut Talenta",
    registeredAt: "Tanggal Registrasi"
  },
  en: {
    title: "All Registered Applicants",
    subTitle: "Manage application status, review psychographic specifications, and inspect Talent Cards.",
    searchPlaceholder: "Search by name, NIK, headline, email...",
    allStatus: "All Status",
    allMajor: "All Fields",
    allLevel: "All Education",
    statusReview: "Stage Review",
    statusHired: "Hired",
    statusRejected: "Rejected",
    statusWait: "Not Tested Yet",
    statusFinished: "Tested Finished",
    priorityUrgent: "Top Priority",
    ratingOvr: "Value Rating",
    makePremium: "★ Grant Priority Member",
    removePremium: "☆ Revoke Priority Member",
    processing: "Processing...",
    candidateDetail: "Inspect Talent Card",
    academicExams: "Academic Quizzes",
    kraepelinCurve: "Stress Resistance (Kraepelin)",
    discTitle: "Communication Style (DISC)",
    papiTitle: "Work Behavior (PAPI)",
    aiReport: "Senior AI Character Insights",
    emptyAI: "This candidate has not requested AI Senior interpretation yet.",
    ovrRatingLabel: "TOTAL VALUE",
    overallScore: "OVR AVG",
    details: "SOP Detail & Rules",
    strengths: "Core Strengths",
    weaknesses: "Development Opportunities",
    careers: "Recommended Careers",
    academicStatsLabel: "Talent Attribute Inventory",
    registeredAt: "Date Registered"
  }
};

export default function AdminCandidates({
  candidates,
  lang,
  selectedCandidate,
  onSelectCandidate,
  onTogglePremium,
  onDeleteCandidate,
  onResetCandidate,
  btnLoading
}: AdminCandidatesProps) {
  const t = LOCALIZATION[lang];

  // Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMajor, setSelectedMajor] = useState('ALL');
  const [selectedLevel, setSelectedLevel] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');

  // Multi-purpose confirmation modal
  const [confirmModal, setConfirmModal] = useState<{ isOpen: boolean, type: 'delete' | 'reset', targetId: string, message: string } | null>(null);

  // Detail Slide/Carousel track within Talent card
  const [carouselIndex, setCarouselIndex] = useState(0);

  // Filter candidates
  const filtered = candidates.filter(cand => {
    const searchLower = searchQuery.toLowerCase();
    const matchSearch =
      (cand.name && cand.name.toLowerCase().includes(searchLower)) ||
      (cand.email && cand.email.toLowerCase().includes(searchLower)) ||
      (cand.nik && cand.nik.includes(searchLower)) ||
      (cand.headline && cand.headline.toLowerCase().includes(searchLower));

    const matchMajor = selectedMajor === 'ALL' || cand.major === selectedMajor;
    const matchLevel = selectedLevel === 'ALL' || cand.educationLevel === selectedLevel;

    // Status logic mapping (Tested Finished uses dynamic test scores)
    const sudahKuis = cand.quizScoresLog && cand.quizScoresLog.length > 0;
    const isPremium = cand.isPremium;
    
    let matchStatus = true;
    if (selectedStatus !== 'ALL') {
      if (selectedStatus === 'review') matchStatus = !cand.isPremium && sudahKuis;
      if (selectedStatus === 'diterima') matchStatus = (cand.stats?.ovr || 0) > 75;
      if (selectedStatus === 'tidak-lolos') matchStatus = (cand.stats?.ovr || 0) <= 60 && sudahKuis;
      if (selectedStatus === 'belum-ujian') matchStatus = !sudahKuis;
      if (selectedStatus === 'selesai') matchStatus = sudahKuis;
    }

    return matchSearch && matchMajor && matchLevel && matchStatus;
  });

  // Sort: Priority members on top
  const sorted = [...filtered].sort((a, b) => {
    if (a.isPremium && !b.isPremium) return -1;
    if (!a.isPremium && b.isPremium) return 1;
    return (b.stats?.ovr || 0) - (a.stats?.ovr || 0);
  });

  const nextCarousel = () => setCarouselIndex(p => (p + 1) % 4);
  const prevCarousel = () => setCarouselIndex(p => (p - 1 + 4) % 4);

  return (
    <div className="space-y-6">
      
      {/* Search & Filter Header Container */}
      <div className="bg-white dark:bg-gray-800 transition-colors duration-300 ease-in-out border border-gray-200 dark:border-gray-700 p-6 rounded-3xl text-left space-y-4">
        <div>
          <h2 className="text-xl font-black text-gray-900 dark:text-white transition-colors duration-300 ease-in-out font-display tracking-tight">{t.title}</h2>
          <p className="text-xs text-gray-600 dark:text-gray-400 transition-colors duration-300 ease-in-out mt-1 font-light">{t.subTitle}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          
          {/* Query input */}
          <div className="md:col-span-4 relative">
            <Search className="w-4 h-4 text-gray-500 dark:text-gray-400 transition-colors duration-300 ease-in-out absolute left-3 top-3.5" />
            <input 
              type="text"
              placeholder={t.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-50 dark:bg-gray-900 transition-colors duration-300 ease-in-out border border-gray-200 dark:border-gray-700 rounded-xl py-2.5 pl-9 pr-4 text-xs text-gray-900 dark:text-white transition-colors duration-300 ease-in-out placeholder-gray-400 focus:outline-none focus:border-indigo-500 transition"
            />
          </div>

          {/* Major dropdown */}
          <div className="md:col-span-3">
            <select
              value={selectedMajor}
              onChange={(e) => setSelectedMajor(e.target.value)}
              className="w-full bg-gray-50 dark:bg-gray-900 transition-colors duration-300 ease-in-out border border-gray-200 dark:border-gray-700 text-xs text-gray-500 dark:text-gray-400 transition-colors duration-300 ease-in-out rounded-xl p-2.5 cursor-pointer focus:outline-none focus:border-indigo-500"
            >
              <option value="ALL">{t.allMajor}</option>
              <option value="Teknik Informatika">Teknik Informatika</option>
              <option value="Bisnis & Manajemen">Bisnis & Manajemen</option>
              <option value="Sains & Teknologi">Sains & Teknologi</option>
              <option value="Umum">Umum / Lainnya</option>
            </select>
          </div>

          {/* Level dropdown */}
          <div className="md:col-span-3">
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="w-full bg-gray-50 dark:bg-gray-900 transition-colors duration-300 ease-in-out border border-gray-200 dark:border-gray-700 text-xs text-gray-500 dark:text-gray-400 transition-colors duration-300 ease-in-out rounded-xl p-2.5 cursor-pointer focus:outline-none focus:border-indigo-500"
            >
              <option value="ALL">{t.allLevel}</option>
              <option value="SMA/SMK">SMA / SMK</option>
              <option value="Mahasiswa Aktif">Mahasiswa Aktif</option>
              <option value="Lulusan">Lulusan Baru (S1/D3)</option>
            </select>
          </div>

          {/* Status dropdown */}
          <div className="md:col-span-2">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full bg-gray-50 dark:bg-gray-900 transition-colors duration-300 ease-in-out border border-gray-200 dark:border-gray-700 text-xs text-gray-500 dark:text-gray-400 transition-colors duration-300 ease-in-out rounded-xl p-2.5 cursor-pointer focus:outline-none focus:border-indigo-500"
            >
              <option value="ALL">{t.allStatus}</option>
              <option value="belum-ujian">{t.statusWait}</option>
              <option value="selesai">{t.statusFinished}</option>
              <option value="review">{t.statusReview}</option>
              <option value="diterima">{t.statusHired}</option>
              <option value="tidak-lolos">{t.statusRejected}</option>
            </select>
          </div>

        </div>
      </div>

      {/* Main Two-Column Panel inside Selection page */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Candidates List panel */}
        <div className="lg:col-span-5 bg-white dark:bg-gray-800 transition-colors duration-300 ease-in-out border border-gray-200 dark:border-gray-700 p-4 rounded-3xl text-left space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-gray-200 dark:border-gray-700">
            <span className="text-[10px] text-gray-600 dark:text-gray-400 transition-colors duration-300 ease-in-out font-extrabold uppercase tracking-wide">
              {t.title} ({sorted.length})
            </span>
          </div>

          <div className="space-y-2.5 max-h-[620px] overflow-y-auto pr-1">
            {sorted.map((c) => {
              const active = selectedCandidate && selectedCandidate.email === c.email;
              const initials = (c.name || '?').slice(0, 2).toUpperCase();
              return (
                <div 
                  key={c.id || c.email}
                  onClick={() => onSelectCandidate(c)}
                  className={`p-3.5 border rounded-2xl cursor-pointer text-left relative overflow-hidden transition-all duration-300 flex items-center justify-between gap-3 transform hover:scale-105 ${
                    active 
                      ? 'bg-indigo-600 text-gray-900 dark:text-white transition-colors duration-300 ease-in-out /10 border-amber-500/60 shadow-[0_0_15px_rgba(245,158,11,0.2)]' 
                      : 'bg-gray-50 dark:bg-gray-900 transition-colors duration-300 ease-in-out border-gray-200 dark:border-gray-700 hover:bg-white dark:bg-gray-800 transition-colors duration-300 ease-in-out hover:border-cyan-500/80 hover:shadow-[0_0_20px_rgba(6,182,212,0.4)]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-full font-bold text-xs flex items-center justify-center font-display border shrink-0 ${
                      c.isPremium 
                        ? 'bg-gradient-to-tr from-indigo-600 to-yellow-300 text-gray-900 dark:text-white transition-colors duration-300 ease-in-out border-amber-400' 
                        : 'bg-white dark:bg-gray-800 transition-colors duration-300 ease-in-out text-gray-800 border-gray-300'
                    }`}>
                      {initials}
                    </div>

                    <div>
                      <h4 className="font-extrabold text-xs text-gray-900 dark:text-white transition-colors duration-300 ease-in-out flex items-center gap-1.5 truncate max-w-[150px]">
                        {c.name}
                        {c.isPremium && <Crown className="w-3 h-3 text-indigo-600 fill-amber-500 shrink-0" />}
                      </h4>
                      <p className="text-[10px] text-gray-500 dark:text-gray-400 transition-colors duration-300 ease-in-out truncate max-w-[150px] mt-0.5">
                        {c.educationLevel} • {c.major}
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-[9px] text-gray-500 dark:text-gray-400 transition-colors duration-300 ease-in-out block font-bold">OVR</span>
                    <strong className={`font-mono text-sm ${c.isPremium ? 'text-indigo-600 font-black' : 'text-teal-400'}`}>
                      {c.stats?.ovr > 0 ? c.stats.ovr : "0"}
                    </strong>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Detailed Comprehensive Inspecting Board (Candidate Detail view) */}
        <div className="lg:col-span-7 bg-gray-50 dark:bg-gray-900 transition-colors duration-300 ease-in-out /40 border border-gray-200 dark:border-gray-700 p-6 rounded-3xl text-left min-h-[600px] flex flex-col justify-between">
          
          {selectedCandidate ? (
            <div className="space-y-6">
              
              {/* Recruiter Detail Header */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-5 border-b border-gray-200 dark:border-gray-700">
                <div className="flex gap-4 items-center">
                  <div className={`w-14 h-14 rounded-full font-display font-black text-lg flex items-center justify-center shrink-0 border-2 ${
                    selectedCandidate.isPremium 
                      ? 'bg-gradient-to-tr from-indigo-600 to-yellow-400 text-gray-900 dark:text-white transition-colors duration-300 ease-in-out border-amber-400' 
                      : 'bg-white dark:bg-gray-800 transition-colors duration-300 ease-in-out text-gray-800 border-gray-300'
                  }`}>
                    {(selectedCandidate.name || '?').slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-gray-900 dark:text-white transition-colors duration-300 ease-in-out flex items-center gap-2">
                      {selectedCandidate.name}
                      {selectedCandidate.isPremium && <Crown className="w-4 h-4 text-indigo-600 fill-amber-500 shrink-0 animate-bounce" />}
                    </h3>
                    <p className="text-xs text-gray-600 dark:text-gray-400 transition-colors duration-300 ease-in-out font-light mt-0.5">
                      {selectedCandidate.educationLevel} | {selectedCandidate.major}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    onClick={() => {
                      setConfirmModal({
                        isOpen: true,
                        type: 'reset',
                        targetId: selectedCandidate.id,
                        message: lang === 'id' ? `Hapus semua skor ujian untuk kandidat ${selectedCandidate.name}? Data kuantitatif akan di-reset (0).` : `Reset all test scores for ${selectedCandidate.name}? All quantitative data will be set to (0).`
                      });
                    }}
                    className="p-2 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 transition-colors duration-300 ease-in-out text-gray-600 dark:text-gray-400 transition-colors duration-300 ease-in-out hover:text-indigo-500 hover:border-amber-500/50 hover:bg-indigo-600 text-gray-900 dark:text-white transition-colors duration-300 ease-in-out /10 cursor-pointer transition select-none flex items-center justify-center"
                    title={lang === 'id' ? 'Reset Semua Skor' : 'Reset All Scores'}
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => {
                      setConfirmModal({
                        isOpen: true,
                        type: 'delete',
                        targetId: selectedCandidate.id,
                        message: lang === 'id' ? `Hapus KANDIDAT ${selectedCandidate.name} secara permanen? Data ini tidak dapat dipulihkan.` : `Permanently delete CANDIDATE ${selectedCandidate.name}? This data cannot be recovered.`
                      });
                    }}
                    className="p-2 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 transition-colors duration-300 ease-in-out text-gray-600 dark:text-gray-400 transition-colors duration-300 ease-in-out hover:text-red-400 hover:border-red-500/50 hover:bg-red-500/10 cursor-pointer transition select-none flex items-center justify-center"
                    title={lang === 'id' ? 'Hapus Pelamar' : 'Delete Candidate'}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => onTogglePremium(selectedCandidate)}
                    disabled={btnLoading === selectedCandidate.email}
                    className={`flex-1 px-4 py-2 rounded-xl text-xs font-bold tracking-wide cursor-pointer transition select-none ${
                      selectedCandidate.isPremium 
                        ? 'bg-[#1e1e24] hover:bg-red-500/10 hover:text-red-400 border border-gray-200 dark:border-gray-700 text-gray-800' 
                        : 'bg-gradient-to-r from-indigo-600 to-yellow-500 text-gray-900 dark:text-white transition-colors duration-300 ease-in-out hover:opacity-90 font-extrabold'
                    }`}
                  >
                    {btnLoading === selectedCandidate.email ? t.processing : (
                      selectedCandidate.isPremium ? t.removePremium : t.makePremium
                    )}
                  </button>
                </div>
              </div>

              {/* Verification Details Row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-white dark:bg-gray-800 transition-colors duration-300 ease-in-out border border-gray-200 dark:border-gray-700 p-4 rounded-2xl leading-normal text-xs text-gray-500 dark:text-gray-400 transition-colors duration-300 ease-in-out ">
                <div className="space-y-1 md:border-r border-gray-200 dark:border-gray-700 pr-2">
                  <span className="text-[10px] text-gray-500 dark:text-gray-400 transition-colors duration-300 ease-in-out uppercase block font-bold">{lang === 'id' ? 'Surat Elektronik' : 'Email Address'}</span>
                  <div className="flex items-center gap-1.5 truncate">
                    <Mail className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                    <span className="font-semibold block truncate">{selectedCandidate.email}</span>
                  </div>
                </div>
                <div className="space-y-1 md:border-r border-gray-200 dark:border-gray-700 px-1.5">
                  <span className="text-[10px] text-gray-500 dark:text-gray-400 transition-colors duration-300 ease-in-out uppercase block font-bold">{lang === 'id' ? 'Nomor WhatsApp' : 'WhatsApp Link'}</span>
                  <div className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                    <span className="font-semibold block">{selectedCandidate.whatsapp || '-'}</span>
                  </div>
                </div>
                <div className="space-y-1 pl-1.5">
                  <span className="text-[10px] text-gray-500 dark:text-gray-400 transition-colors duration-300 ease-in-out uppercase block font-bold">{lang === 'id' ? 'Nomor NIK KTP' : 'NIK Identity'}</span>
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                    <span className="font-semibold font-mono tracking-wider block">{selectedCandidate.nik || '-'}</span>
                  </div>
                </div>
              </div>

              {/* Headline block */}
              <div className="space-y-1.5 text-xs">
                <span className="text-[10px] text-gray-500 dark:text-gray-400 transition-colors duration-300 ease-in-out font-bold block uppercase tracking-wider pl-0.5">Headline Profil Pelamar:</span>
                <p className="bg-white dark:bg-gray-800 transition-colors duration-300 ease-in-out /60 border border-gray-200 dark:border-gray-700 rounded-xl p-3 text-gray-500 dark:text-gray-400 transition-colors duration-300 ease-in-out leading-relaxed font-light italic text-[11.5px]">
                  "{selectedCandidate.headline || 'Active Pelamar | Siap magang dan bekerja secara andal'}"
                </p>
              </div>

              {/* Visual Stats Block (Split Specs & Visual Ratings Charts Carousel) */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-stretch pt-2 border-t border-gray-200 dark:border-gray-700">
                
                {/* Stats spec bars */}
                <div className="md:col-span-7 bg-white dark:bg-gray-800 transition-colors duration-300 ease-in-out border border-gray-200 dark:border-gray-700 rounded-2xl p-4 space-y-3 flex flex-col justify-between">
                  <div>
                    <span className="text-[9.5px] uppercase font-bold text-teal-400 tracking-widest block pb-1 border-b border-gray-200 dark:border-gray-700">
                      {t.academicStatsLabel}
                    </span>
                    <div className="space-y-2 mt-3 block">
                      
                      {/* Academic Bar */}
                      <div className="space-y-1 text-xs">
                        <div className="flex justify-between items-center text-[10px]">
                          <span className="text-gray-500 dark:text-gray-400 transition-colors duration-300 ease-in-out font-medium">Academic Exam (ACD)</span>
                          <strong className="text-gray-900 dark:text-white transition-colors duration-300 ease-in-out font-mono">{selectedCandidate.stats?.acd || 0}/100</strong>
                        </div>
                        <div className="w-full bg-[#1e293b] h-1.5 rounded-full overflow-hidden">
                          <div className="bg-teal-500 h-full rounded-full transition-all" style={{ width: `${selectedCandidate.stats?.acd || 0}%` }} />
                        </div>
                      </div>

                      {/* Speed Bar */}
                      <div className="space-y-1 text-xs">
                        <div className="flex justify-between items-center text-[10px]">
                          <span className="text-gray-500 dark:text-gray-400 transition-colors duration-300 ease-in-out font-medium">Kraepelin Speed (SPD)</span>
                          <strong className="text-gray-900 dark:text-white transition-colors duration-300 ease-in-out font-mono">{selectedCandidate.stats?.spd || 0}/99</strong>
                        </div>
                        <div className="w-full bg-[#1e293b] h-1.5 rounded-full overflow-hidden">
                          <div className="bg-rose-500 h-full rounded-full transition-all" style={{ width: `${selectedCandidate.stats?.spd || 0}%` }} />
                        </div>
                      </div>

                      {/* Consistency Bar */}
                      <div className="space-y-1 text-xs">
                        <div className="flex justify-between items-center text-[10px]">
                          <span className="text-gray-500 dark:text-gray-400 transition-colors duration-300 ease-in-out font-medium">Consistency (CON)</span>
                          <strong className="text-gray-900 dark:text-white transition-colors duration-300 ease-in-out font-mono">{selectedCandidate.stats?.con || 0}%</strong>
                        </div>
                        <div className="w-full bg-[#1e293b] h-1.5 rounded-full overflow-hidden">
                          <div className="bg-emerald-500 h-full rounded-full transition-all" style={{ width: `${selectedCandidate.stats?.con || 0}%` }} />
                        </div>
                      </div>

                      {/* Symbiosis communication Bar */}
                      <div className="space-y-1 text-xs">
                        <div className="flex justify-between items-center text-[10px]">
                          <span className="text-gray-500 dark:text-gray-400 transition-colors duration-300 ease-in-out font-medium">DISC Synergy (COM)</span>
                          <strong className="text-gray-900 dark:text-white transition-colors duration-300 ease-in-out font-mono">{selectedCandidate.stats?.com || 0}/99</strong>
                        </div>
                        <div className="w-full bg-[#1e293b] h-1.5 rounded-full overflow-hidden">
                          <div className="bg-blue-500 h-full rounded-full transition-all" style={{ width: `${selectedCandidate.stats?.com || 0}%` }} />
                        </div>
                      </div>

                      {/* Papi leadership Bar */}
                      <div className="space-y-1 text-xs">
                        <div className="flex justify-between items-center text-[10px]">
                          <span className="text-gray-500 dark:text-gray-400 transition-colors duration-300 ease-in-out font-medium">Leadership (LDR)</span>
                          <strong className="text-gray-900 dark:text-white transition-colors duration-300 ease-in-out font-mono">{selectedCandidate.stats?.ldr || 0}/99</strong>
                        </div>
                        <div className="w-full bg-[#1e293b] h-1.5 rounded-full overflow-hidden">
                          <div className="bg-indigo-600 text-gray-900 dark:text-white transition-colors duration-300 ease-in-out h-full rounded-full transition-all" style={{ width: `${selectedCandidate.stats?.ldr || 0}%` }} />
                        </div>
                      </div>

                    </div>
                  </div>
                </div>

                {/* Highly interactive modular graphics Carousel with pure, robust SVG outputs */}
                <div className="md:col-span-5 bg-white dark:bg-gray-800 transition-colors duration-300 ease-in-out border border-gray-200 dark:border-gray-700 rounded-2xl p-4.5 flex flex-col justify-between text-center relative overflow-hidden">
                  <div>
                    {/* Carousel Selector tabs header */}
                    <div className="flex justify-between items-center pb-2 border-b border-gray-200 dark:border-gray-700 select-none">
                      <button onClick={prevCarousel} className="p-1 hover:bg-white dark:bg-gray-800 transition-colors duration-300 ease-in-out rounded text-gray-600 dark:text-gray-400 transition-colors duration-300 ease-in-out cursor-pointer">
                        <ChevronLeft className="w-3.5 h-3.5" />
                      </button>
                      <span className="text-[10px] text-gray-500 dark:text-gray-400 transition-colors duration-300 ease-in-out font-extrabold uppercase tracking-wider block font-mono shrink-0">
                        {carouselIndex === 0 && (lang === 'id' ? 'OVR RATING' : 'OVERALL VALUE')}
                        {carouselIndex === 1 && (lang === 'id' ? 'KURVA KRAEPELIN' : 'KRAEPELIN SPEED')}
                        {carouselIndex === 2 && (lang === 'id' ? 'DIAGRAM DISC' : 'DISC GRAPH')}
                        {carouselIndex === 3 && (lang === 'id' ? 'BINTANG PAPI' : 'PAPI BEHAVIOR')}
                      </span>
                      <button onClick={nextCarousel} className="p-1 hover:bg-white dark:bg-gray-800 transition-colors duration-300 ease-in-out rounded text-gray-600 dark:text-gray-400 transition-colors duration-300 ease-in-out cursor-pointer">
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Sliding components block based on index */}
                    <div className="mt-4 flex flex-col items-center justify-center min-h-[260px]">
                      
                      {carouselIndex === 0 && (
                        <div className="space-y-3 flex flex-col items-center">
                          <div className="w-22 h-22 rounded-full border-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 transition-colors duration-300 ease-in-out flex flex-col justify-center items-center relative select-none">
                            <strong className={`font-mono text-3xl font-black block leading-none ${selectedCandidate.isPremium ? 'text-indigo-600' : 'text-teal-400'}`}>
                              {selectedCandidate.stats?.ovr > 0 ? selectedCandidate.stats.ovr : "0"}
                            </strong>
                            <span className="text-[7.5px] font-bold text-gray-500 dark:text-gray-400 transition-colors duration-300 ease-in-out tracking-wider">OVR VALUE</span>
                          </div>
                          <span className="text-[10px] text-gray-500 dark:text-gray-400 transition-colors duration-300 ease-in-out italic leading-relaxed max-w-[155px]">
                            {lang === 'id' ? 'Penilaian menyeluruh kelayakan magang' : 'Consolidated internship eligibility index'}
                          </span>
                        </div>
                      )}

                      {carouselIndex === 1 && (
                        <div className="w-full space-y-2">
                          <div className="w-full flex items-end justify-center relative px-2">
                             <KraepelinChart 
                               speed={selectedCandidate.psychResults?.kraepelin?.speed || 0} 
                               accuracy={selectedCandidate.psychResults?.kraepelin?.accuracy || 0} 
                               stability={selectedCandidate.psychResults?.kraepelin?.stability || 0}
                               dataPoints={selectedCandidate.psychResults?.kraepelin?.grafikData || []}
                               height={240} 
                             />
                          </div>
                        </div>
                      )}

                      {carouselIndex === 2 && (
                        <div className="w-full space-y-2 mt-1">
                          <div className="w-full relative px-2">
                             <DiscPieChart 
                               scores={selectedCandidate.psychResults?.disc?.scores || {D:0,I:0,S:0,C:0}} 
                               height={240} 
                             />
                          </div>
                        </div>
                      )}

                      {carouselIndex === 3 && (
                        <div className="w-full space-y-2 flex flex-col items-center">
                          <div className="w-full max-w-[280px] h-60 relative flex items-center justify-center bg-gray-100 dark:bg-gray-700 transition-colors duration-300 ease-in-out rounded-xl p-2 border border-gray-200 dark:border-gray-700">
                            <PapiRadarChart scores={selectedCandidate.psychResults?.papi?.scores || {}} width={240} height={240} />
                          </div>
                          <span className="text-[10px] text-emerald-400 font-bold block font-mono">{lang === 'id' ? '20 DIMENSI PAPI' : '20 PAPI DIMENSIONS'}</span>
                        </div>
                      )}

                    </div>
                  </div>
                </div>

              </div>

              {/* AI senior detailed diagnosis insights box */}
              <div className="space-y-2 border-t border-gray-200 dark:border-gray-700 pt-3">
                <span className="text-[10px] text-indigo-400 font-extrabold uppercase tracking-wider block pl-0.5">
                  🛡️ {t.aiReport}:
                </span>

                {selectedCandidate.aiReport ? (
                  <div className="bg-white dark:bg-gray-800 transition-colors duration-300 ease-in-out border border-gray-200 dark:border-gray-700 p-4.5 rounded-2xl space-y-4">
                    <p className="text-gray-800 text-xs leading-relaxed font-light first-letter:text-xl first-letter:font-bold first-letter:text-indigo-405">
                      {selectedCandidate.aiReport.summary}
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs leading-normal pt-3 border-t border-gray-200 dark:border-gray-700">
                      <div className="space-y-1.5">
                        <strong className="text-[10px] text-emerald-400 uppercase font-black block tracking-wider">✓ {t.strengths}</strong>
                        <ul className="list-disc pl-4 text-gray-600 dark:text-gray-400 transition-colors duration-300 ease-in-out space-y-1 font-light text-[11px]">
                          {selectedCandidate.aiReport.strengths?.slice(0, 3).map((st: string, i: number) => (
                            <li key={i}>{st}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="space-y-1.5">
                        <strong className="text-[10px] text-rose-450 uppercase font-black block tracking-wider">🎯 {t.weaknesses}</strong>
                        <ul className="list-disc pl-4 text-gray-600 dark:text-gray-400 transition-colors duration-300 ease-in-out space-y-1 font-light text-[11px]">
                          {selectedCandidate.aiReport.weaknesses?.slice(0, 2).map((wk: string, i: number) => (
                            <li key={i}>{wk}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="border border-dashed border-gray-200 dark:border-gray-700 p-5 rounded-2xl text-[11px] text-gray-500 dark:text-gray-400 transition-colors duration-300 ease-in-out text-center italic font-light">
                    {t.emptyAI}
                  </p>
                )}
              </div>

            </div>
          ) : (
            <div className="flex-1 flex flex-col justify-center items-center text-center py-40 space-y-3.5 select-none border border-dashed border-gray-200 dark:border-gray-700 rounded-3xl bg-black/10">
              <Users className="w-12 h-12 text-gray-700 shrink-0" />
              <div className="space-y-1">
                <h5 className="font-extrabold text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300 ease-in-out ">{lang === 'id' ? 'Silakan Pilih Calon / Pelamar' : 'Select Applicant to Inspect'}</h5>
                <p className="text-xs text-gray-500 dark:text-gray-400 transition-colors duration-300 ease-in-out max-w-sm font-light">
                  {lang === 'id' 
                    ? 'Ketuk salah satu pendaftar di panel kiri untuk membuka andalan detail Talent Card, nilai kuis, kurva mental psikotes, dan visual diagram.' 
                    : 'Tap an applicant on the left side to load their deep cognitive curves, PAPI radar octagon and full-scale LinkedIn headlines.'}
                </p>
              </div>
            </div>
          )}

        </div>

      </div>

      {/* Confirmation Modal */}
      {confirmModal && confirmModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-50 dark:bg-gray-900 transition-colors duration-300 ease-in-out /80 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 transition-colors duration-300 ease-in-out border border-gray-200 dark:border-gray-700 rounded-3xl p-6 max-w-sm w-full space-y-6 shadow-2xl relative">
            <button 
              onClick={() => setConfirmModal(null)}
              className="absolute top-4 right-4 text-gray-500 dark:text-gray-400 transition-colors duration-300 ease-in-out hover:text-gray-900 dark:text-white transition-colors duration-300 ease-in-out "
            >
              <X className="w-5 h-5" />
            </button>
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white transition-colors duration-300 ease-in-out font-display">
                {lang === 'id' ? 'Konfirmasi Tindakan' : 'Confirm Action'}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-300 ease-in-out font-light leading-relaxed">
                {confirmModal.message}
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button 
                onClick={() => setConfirmModal(null)}
                className="w-full py-2.5 rounded-xl text-sm font-bold bg-white dark:bg-gray-800 transition-colors duration-300 ease-in-out text-gray-800 hover:bg-white dark:bg-gray-800 transition-colors duration-300 ease-in-out transition"
              >
                {lang === 'id' ? 'Batal' : 'Cancel'}
              </button>
              <button 
                onClick={() => {
                  if (confirmModal.type === 'delete' && onDeleteCandidate) {
                    onDeleteCandidate(confirmModal.targetId);
                  } else if (confirmModal.type === 'reset' && onResetCandidate) {
                    onResetCandidate(confirmModal.targetId);
                  }
                  setConfirmModal(null);
                }}
                className={`w-full py-2.5 rounded-xl text-sm font-bold text-gray-900 dark:text-white transition-colors duration-300 ease-in-out transition ${confirmModal.type === 'delete' ? 'bg-red-500 hover:bg-red-400' : 'bg-indigo-600 text-gray-900 dark:text-white transition-colors duration-300 ease-in-out hover:bg-indigo-700'}`}
              >
                {lang === 'id' ? 'Lanjutkan' : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
