/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { MOCK_INTERNSHIPS } from '../data/internships';
import { UserProfile, EducationLevel, Internship } from '../types';
import { Compass, Search, Filter, Briefcase, DollarSign, MapPin, CheckCircle2, Sparkles, Building2 } from 'lucide-react';

interface InternshipsViewProps {
  profile: UserProfile;
  onAppStatusUpdate?: (message: string) => void;
}

export default function InternshipsView({ profile, onAppStatusUpdate }: InternshipsViewProps) {
  const [levelFilter, setLevelFilter] = useState<EducationLevel | 'Semua'>(profile.educationLevel || 'Semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'All' | 'Remote' | 'Hybrid' | 'On-site'>('All');
  const [appliedInternships, setAppliedInternships] = useState<Record<string, boolean>>({});

  const handleApply = (internshipId: string) => {
    setAppliedInternships((prev) => ({ ...prev, [internshipId]: true }));
    
    // Simulate company feedback update after a few seconds
    if (onAppStatusUpdate) {
      setTimeout(() => {
        const job = MOCK_INTERNSHIPS.find(i => i.id === internshipId);
        if (job) {
          onAppStatusUpdate(`Update Lamaran: Profil Talent Anda sekarang sedang ditinjau oleh HRD ${job.companyName}.`);
        }
      }, 4000);
    }
  };

  // Filter internships list
  const filteredInternships = MOCK_INTERNSHIPS.filter((item) => {
    // Math level filter
    const matchesLevel = levelFilter === 'Semua' || item.targetAudience.includes(levelFilter);
    // Math search query
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.description.toLowerCase().includes(searchQuery.toLowerCase());
    // Match type
    const matchesType = typeFilter === 'All' || item.type === typeFilter;

    return matchesLevel && matchesSearch && matchesType;
  });

  return (
    <div id="internships-view-root" className="space-y-6 text-left">
      
      {/* HEADER BANNER */}
      <div className="bg-white dark:bg-gray-800 transition-colors duration-300 ease-in-out dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-6 md:p-8 rounded-3xl space-y-3 relative overflow-hidden transition-colors duration-300 ease-in-out ">
        <div className="absolute top-0 right-0 p-8 opacity-[0.03] dark:opacity-10 text-gray-900 dark:text-white transition-colors duration-300 ease-in-out dark:text-white">
          <Briefcase className="w-40 h-40" />
        </div>

        <div className="max-w-2xl space-y-2 z-10 relative">
          <span className="text-xs bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800/50 px-3 py-1 rounded-full uppercase font-bold tracking-wider inline-flex items-center gap-1 transition-colors duration-300 ease-in-out ">
            <Sparkles className="w-3 h-3 text-indigo-600 dark:text-indigo-400 shrink-0 transition-colors duration-300 ease-in-out " /> Fitur Magang Selaras Industri
          </span>
          <h3 className="text-3xl font-extrabold text-gray-900 dark:text-white transition-colors duration-300 ease-in-out dark:text-white font-display transition-colors duration-300 ease-in-out ">Peluang Magang Terbuka Berbasis Kompetensi</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300 ease-in-out dark:text-gray-400 leading-relaxed transition-colors duration-300 ease-in-out ">
            Selamat datang di portal magang terintegrasi. Khusus untuk pelajar SMA/SMK, mahasiswa aktif, dan lulusan baru, kami menyelaraskan rating kognitif Anda pada Talent Card langsung dengan lowongan magang mitra industri premium.
          </p>
        </div>
      </div>

      {/* FILTER PANEL */}
      <div className="bg-white dark:bg-gray-800 transition-colors duration-300 ease-in-out border border-gray-200 dark:border-gray-700 p-5 rounded-2xl grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
        
        {/* Search Input */}
        <div className="md:col-span-5 relative">
          <Search className="w-4 h-4 text-gray-500 dark:text-gray-400 transition-colors duration-300 ease-in-out absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari magang (UI/UX, Frontend, Admin, etc)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-gray-50 dark:bg-gray-900 transition-colors duration-300 ease-in-out border border-gray-200 dark:border-gray-700 focus:border-teal-500 rounded-xl pl-10 pr-4 py-2 text-xs text-gray-900 dark:text-white transition-colors duration-300 ease-in-out placeholder-slate-550 focus:outline-none transition-all"
          />
        </div>

        {/* Education Level Trigger */}
        <div className="md:col-span-3 flex flex-col space-y-1 text-left">
          <label className="text-[10px] text-gray-500 dark:text-gray-400 transition-colors duration-300 ease-in-out font-bold uppercase tracking-wider pl-1">Jenjang Pendidikan</label>
          <select
            value={levelFilter}
            onChange={(e: any) => setLevelFilter(e.target.value)}
            className="bg-gray-50 dark:bg-gray-900 transition-colors duration-300 ease-in-out border border-gray-200 dark:border-gray-700 hover:border-gray-200 dark:border-gray-700 text-xs text-gray-800 px-3 py-2 rounded-xl focus:outline-none focus:border-teal-500"
          >
            <option value="Semua">Semua Pendidikan (SMA/S1/Lulusan)</option>
            <option value="SMA/SMK">Khusus Pelajar SMA / SMK</option>
            <option value="Mahasiswa Aktif">Khusus Mahasiswa Aktif</option>
            <option value="Lulusan">Khusus Lulusan Baru</option>
          </select>
        </div>

        {/* Type selector */}
        <div className="md:col-span-3 flex flex-col space-y-1 text-left">
          <label className="text-[10px] text-gray-500 dark:text-gray-400 transition-colors duration-300 ease-in-out font-bold uppercase tracking-wider pl-1">Sistem Kerja</label>
          <select
            value={typeFilter}
            onChange={(e: any) => setTypeFilter(e.target.value)}
            className="bg-gray-50 dark:bg-gray-900 transition-colors duration-300 ease-in-out border border-gray-200 dark:border-gray-700 hover:border-gray-200 dark:border-gray-700 text-xs text-gray-800 px-3 py-2 rounded-xl focus:outline-none focus:border-teal-500"
          >
            <option value="All">Semua Sistem Kerja</option>
            <option value="Remote">Remote (100% dari Rumah)</option>
            <option value="Hybrid">Hybrid (Kantor + Remote)</option>
            <option value="On-site">On-site (Penuh di Kantor)</option>
          </select>
        </div>

        {/* Refresh count */}
        <div className="md:col-span-1 text-center font-mono text-[10px] text-gray-500 dark:text-gray-400 transition-colors duration-300 ease-in-out ">
          <span className="block font-bold text-gray-800">{filteredInternships.length}</span> Lowongan
        </div>

      </div>

      {/* JOBS LIST */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredInternships.map((job) => {
          const hasApplied = appliedInternships[job.id];
          const matchesUserLevel = !!profile.educationLevel && job.targetAudience.includes(profile.educationLevel);

          return (
            <div 
              key={job.id} 
              className={`bg-white dark:bg-gray-800 transition-colors duration-300 ease-in-out border rounded-2xl p-5 md:p-6 flex flex-col justify-between transition-all hover:-translate-y-0.5 ${
                hasApplied 
                  ? 'border-emerald-500/40 shadow-emerald-500/5' 
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-200 dark:border-gray-700'
              }`}
            >
              <div className="space-y-4">
                {/* Header info */}
                <div className="flex gap-4 items-center">
                  <div className="w-12 h-12 rounded-xl bg-gray-50 dark:bg-gray-900 transition-colors duration-300 ease-in-out flex items-center justify-center text-2xl border border-gray-200 dark:border-gray-700 shadow-sm shrink-0">
                    {job.logo}
                  </div>

                  <div className="space-y-0.5 text-left">
                    <h4 className="text-md font-bold text-gray-900 dark:text-white transition-colors duration-300 ease-in-out leading-snug tracking-tight font-display">{job.title}</h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400 transition-colors duration-300 ease-in-out flex items-center gap-1">
                      <Building2 className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400 transition-colors duration-300 ease-in-out " /> {job.companyName}
                    </p>
                  </div>
                </div>

                {/* Sub Metadata Tags */}
                <div className="flex flex-wrap gap-2 pt-1">
                  <span className="bg-gray-50 dark:bg-gray-900 transition-colors duration-300 ease-in-out text-gray-800 text-[10px] font-mono border border-gray-200 dark:border-gray-700 px-2.5 py-1 rounded-md flex items-center gap-1.5">
                    <MapPin className="w-3 h-3 text-gray-500 dark:text-gray-400 transition-colors duration-300 ease-in-out " /> {job.location} ({job.type})
                  </span>
                  <span className="bg-gray-50 dark:bg-gray-900 transition-colors duration-300 ease-in-out text-gray-800 text-[10px] font-mono border border-gray-200 dark:border-gray-700 px-2.5 py-1 rounded-md flex items-center gap-1.5">
                    <DollarSign className="w-3 h-3 text-gray-500 dark:text-gray-400 transition-colors duration-300 ease-in-out " /> {job.stipend}
                  </span>
                </div>

                <p className="text-xs text-gray-800 leading-relaxed font-light">
                  {job.description}
                </p>

                {/* Target Level requirements info */}
                <div className="space-y-1.5 pt-2 border-t border-gray-200 dark:border-gray-700">
                  <span className="text-[10px] text-gray-500 dark:text-gray-400 transition-colors duration-300 ease-in-out uppercase tracking-widest font-bold block">Target Kualifikasi Magang:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {job.targetAudience.map((aud, aIdx) => {
                      const isMatchingUser = aud === profile.educationLevel;
                      return (
                        <span 
                          key={aIdx} 
                          className={`text-[9px] px-2 py-0.5 rounded-full font-semibold border ${
                            isMatchingUser 
                              ? 'bg-teal-500/10 border-teal-500/25 text-teal-400' 
                              : 'bg-gray-50 dark:bg-gray-900 transition-colors duration-300 ease-in-out border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 transition-colors duration-300 ease-in-out '
                          }`}
                        >
                          {aud} {isMatchingUser && '🎯 Cocok'}
                        </span>
                      );
                    })}
                  </div>
                </div>

                {/* Bullets requirements */}
                <ul className="space-y-1 text-xs text-gray-600 dark:text-gray-400 transition-colors duration-300 ease-in-out list-disc pl-4 font-light">
                  {job.requirements.map((req, rIdx) => (
                    <li key={rIdx}>{req}</li>
                  ))}
                </ul>
              </div>

              {/* ACTION CALL TO APPLY */}
              <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-900 transition-colors duration-300 ease-in-out /20 p-3 rounded-xl">
                {!matchesUserLevel && (
                  <span className="text-[10px] text-indigo-500 font-semibold">⚠ Jenjang Anda berbeda</span>
                )}
                {matchesUserLevel && (
                  <span className="text-[10px] text-teal-400 font-medium">✓ Memenuhi syarat kualifikasi</span>
                )}

                {hasApplied ? (
                  <span className="bg-emerald-500/15 border border-emerald-500/25 text-emerald-400 text-xs px-4 py-1.5 rounded-xl font-bold flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Sudah Dilamar (Reviewing)
                  </span>
                ) : (
                  <button
                    onClick={() => handleApply(job.id)}
                    className="bg-teal-500 hover:bg-teal-400 active:scale-95 text-gray-900 dark:text-white transition-colors duration-300 ease-in-out font-bold text-xs px-4 py-2 rounded-xl transition-all cursor-pointer shadow-sm"
                  >
                    Kirim Lamaran Magang
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
