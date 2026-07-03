import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Phone, MapPin, Briefcase, GraduationCap, FileText, ExternalLink, Loader2, CheckCircle2 } from 'lucide-react';
import { UserProfile } from '../types';
import TalentCard from './TalentCard';
import apiClient from '../apiClient';

interface ProfileViewProps {
  profile: UserProfile;
  psychResults?: any;
  aiReport?: any;
  quizScoresLog?: any[];
  onUpdateCosmetics?: (cosmetics: any) => void;
  onUpgradeToPremium?: () => void;
}

export default function ProfileView({ 
  profile, 
  psychResults, 
  aiReport, 
  quizScoresLog,
  onUpdateCosmetics,
  onUpgradeToPremium
}: ProfileViewProps) {
  const initials = profile.name.slice(0, 2).toUpperCase();

  const [formData, setFormData] = useState({
    name: profile.name || '',
    headline: profile.headline || '',
    email: profile.email || '',
    whatsapp: profile.whatsapp || '',
    location: 'Indonesia',
    about: profile.headline ? `Seorang profesional yang berfokus pada pengembangan diri dan penguasaan kompetensi di bidang ${profile.major || 'terkait'}. Saat ini aktif membangun portofolio keahlian melalui asesmen psikometri dan pengembangan analitis.` : "Belum ada ringkasan yang ditulis."
  });
  const [isLocating, setIsLocating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isPending = profile.pendingUpdates?.status === 'pending';

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSensitiveUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.email === profile.email && formData.whatsapp === profile.whatsapp) return;
    
    setIsSubmitting(true);
    try {
      await apiClient.post('/api/user/request-sensitive-update', {
        newEmail: formData.email,
        newWhatsapp: formData.whatsapp
      });
      // Updating profile optimistically or showing a success message
      alert('Permintaan perubahan data berhasil dikirim ke Admin.');
      if (!profile.pendingUpdates) {
         profile.pendingUpdates = {};
      }
      profile.pendingUpdates.status = 'pending';
      profile.pendingUpdates.email = formData.email;
      profile.pendingUpdates.whatsapp = formData.whatsapp;
    } catch (error) {
      console.error('Error:', error);
      alert('Terjadi kesalahan saat mengirim perubahan.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLocationClick = () => {
    setIsLocating(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setFormData(prev => ({ ...prev, location: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}` }));
          setIsLocating(false);
        },
        (error) => {
          console.error("Error getting location: ", error);
          alert('Akses lokasi ditolak oleh browser. Silakan izinkan akses lokasi di pengaturan browser Anda.');
          setIsLocating(false);
        }
      );
    } else {
      setIsLocating(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      
      {/* 1. TOP BANNER / HEADER CARD */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden flex flex-col border border-gray-200 dark:border-gray-700 transition-colors duration-300">
        <div className="h-32 sm:h-48 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 relative w-full transition-colors duration-300">
          {/* Cover Photo Mock */}
        </div>
        
        <div className="px-6 pb-6 relative text-left">
          {/* Avatar Overlap */}
          <div className="-mt-16 sm:-mt-24 mb-4 relative inline-block">
            <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full border-4 border-white dark:border-gray-800 bg-gray-50 dark:bg-gray-900 flex items-center justify-center font-bold text-4xl text-gray-400 overflow-hidden shadow-sm transition-colors duration-300">
              {profile.avatar ? (
                <img src={profile.avatar} alt="Profile Avatar" className="w-full h-full object-cover" />
              ) : (
                initials
              )}
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div className="w-full flex-1 max-w-2xl space-y-3">
              <input 
                type="text" 
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white bg-transparent border-b border-transparent hover:border-gray-200 dark:hover:border-gray-700 focus:border-indigo-500 focus:outline-none transition-colors px-1 -mx-1"
                placeholder="Nama Lengkap"
              />
              <input 
                type="text" 
                name="headline"
                value={formData.headline}
                onChange={handleInputChange}
                className="w-full text-gray-700 dark:text-gray-300 text-lg bg-transparent border-b border-transparent hover:border-gray-200 dark:hover:border-gray-700 focus:border-indigo-500 focus:outline-none transition-colors px-1 -mx-1 mt-1"
                placeholder="Headline (ex: Active Pelamar)"
              />
              
              <div className="mt-2 text-sm text-gray-500 dark:text-gray-400 font-medium px-1">
                {profile.educationLevel} · {profile.major}
              </div>

              <div className="mt-4 flex flex-col gap-y-3 text-sm text-gray-600 dark:text-gray-400">
                <form onSubmit={handleSensitiveUpdate} className="flex flex-col sm:flex-row flex-wrap gap-y-3 gap-x-4">
                  <div className="flex items-center gap-2 max-w-xs w-full">
                    <Mail className="w-4 h-4 text-gray-400 dark:text-gray-500 shrink-0" />
                    <input 
                      type="email" 
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      disabled={isPending || isSubmitting}
                      className="w-full bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-md py-1.5 px-3 text-sm text-gray-900 dark:text-white focus-visible:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors disabled:opacity-50"
                      placeholder="Email Address"
                    />
                  </div>
                  
                  <div className="flex items-center gap-2 max-w-xs w-full">
                    <Phone className="w-4 h-4 text-gray-400 dark:text-gray-500 shrink-0" />
                    <input 
                      type="text" 
                      name="whatsapp"
                      value={formData.whatsapp}
                      onChange={handleInputChange}
                      disabled={isPending || isSubmitting}
                      className="w-full bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-md py-1.5 px-3 text-sm text-gray-900 dark:text-white focus-visible:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors disabled:opacity-50"
                      placeholder="WhatsApp Number"
                    />
                  </div>
                  
                  {(!isPending && (formData.email !== profile.email || formData.whatsapp !== profile.whatsapp)) && (
                    <button 
                      type="submit"
                      disabled={isSubmitting}
                      className="px-4 py-1.5 bg-indigo-600 text-white text-xs font-semibold rounded-md hover:bg-indigo-700 transition-colors disabled:opacity-50"
                    >
                      {isSubmitting ? 'Menyimpan...' : 'Ajukan Perubahan'}
                    </button>
                  )}
                </form>

                {isPending && (
                  <div className="flex items-center gap-2 text-[11px] text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 px-3 py-1.5 rounded-md border border-amber-200 dark:border-amber-800/50 w-fit">
                    <Loader2 className="w-3 h-3 animate-spin shrink-0" />
                    <span className="font-medium">Perubahan kontak sedang menunggu persetujuan Admin</span>
                  </div>
                )}

                <div className="flex mt-1 items-center gap-2 max-w-xs w-full">
                  <button 
                    type="button"
                    onClick={handleLocationClick}
                    disabled={isLocating}
                    className="shrink-0 p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 transition-colors focus-visible:outline-none focus:ring-2 focus:ring-indigo-500"
                    title="Get Current Location"
                  >
                    {isLocating ? <Loader2 className="w-4 h-4 animate-spin text-indigo-500" /> : <MapPin className="w-4 h-4" />}
                  </button>
                  <input 
                    type="text" 
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="w-full bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-md py-1.5 px-3 text-sm text-gray-900 dark:text-white focus-visible:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
                    placeholder="Location"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. TENTANG (ABOUT / SUMMARY) CARD */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700 text-left transition-colors duration-300">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Tentang</h3>
        <textarea 
          name="about"
          value={formData.about}
          onChange={handleInputChange}
          rows={4}
          className="w-full text-sm text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-lg p-4 focus-visible:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors resize-none leading-relaxed"
          placeholder="Tuliskan ringkasan profesional Anda..."
        />
      </div>

      {/* 3. PENGALAMAN & PENDIDIKAN CARD */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700 text-left transition-colors duration-300">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Pengalaman & Pendidikan</h3>
        <div className="space-y-6 flex flex-col">
          {/* Experience Empty State / Placeholder */}
          <div className="flex gap-4">
            <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-sm flex items-center justify-center shrink-0 transition-colors duration-300">
              <Briefcase className="w-6 h-6 text-gray-400 dark:text-gray-500" />
            </div>
            <div>
              <h4 className="text-base font-bold text-gray-900 dark:text-white leading-snug">Calon Karyawan (Belum Bekerja)</h4>
              <div className="text-sm text-gray-800 dark:text-gray-300 mt-0.5">Berbagai Instansi & Perusahaan</div>
              <div className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Saat ini · Pencari Kerja Aktif</div>
              <p className="text-sm text-gray-800 dark:text-gray-300 leading-relaxed mt-2">
                Saat ini sedang fokus dalam eksplorasi peluang karier dan penyelesaian uji kompetensi standar industri melalui platform TalentFlow.
              </p>
            </div>
          </div>

          <hr className="border-gray-200 dark:border-gray-700 transition-colors duration-300" />

          {/* Education Based on UserProfile attributes */}
          <div className="flex gap-4">
            <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-sm flex items-center justify-center shrink-0 transition-colors duration-300">
              <GraduationCap className="w-6 h-6 text-gray-400 dark:text-gray-500" />
            </div>
            <div>
              <h4 className="text-base font-bold text-gray-900 dark:text-white leading-snug">Pendidikan Akademik</h4>
              <div className="text-sm text-gray-800 dark:text-gray-300 mt-0.5">{profile.educationLevel}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Fokus Studi: {profile.major}</div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. HASIL TES PSIKOLOGI (TALENT CARD) */}
      <div className="text-left">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 px-1">Hasil Asesmen Kompetensi</h3>
        <TalentCard 
          profile={profile} 
          psychResults={psychResults} 
          aiReport={aiReport} 
          quizScoresLog={quizScoresLog} 
          onUpdateCosmetics={onUpdateCosmetics}
          onUpgradeToPremium={onUpgradeToPremium}
        />
      </div>

      {/* 5. ACTIVITY STREAK / QUICK STATS */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700 text-left transition-colors duration-300">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Aktivitas & Keterlibatan</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg flex items-center gap-4 transition-colors duration-300">
            <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/30 rounded-full flex items-center justify-center shrink-0 transition-colors duration-300">
              <span className="font-bold text-indigo-600 dark:text-indigo-400 text-lg">{profile.checkInStreak || 0}</span>
            </div>
            <div>
              <div className="font-bold text-gray-900 dark:text-white">Hari Beruntun</div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Keaktifan login dan berlatih</div>
            </div>
          </div>
          <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg flex items-center gap-4 transition-colors duration-300">
            <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-900/30 rounded-full flex items-center justify-center shrink-0 transition-colors duration-300">
              <span className="font-bold text-emerald-600 dark:text-emerald-400 text-lg">{profile.consistencyPoints || 0}</span>
            </div>
            <div>
              <div className="font-bold text-gray-900 dark:text-white">Poin Konsistensi</div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Total komitmen asesmen</div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
