/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Sliders, Check, HelpCircle, Mail, ShieldAlert, Award, Sparkles, Sun } from 'lucide-react';

interface AdminSettingsProps {
  adminUser: any;
  lang: 'id' | 'en';
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  onSetLanguage: (language: 'id' | 'en') => void;
}

const LOCALIZATION = {
  id: {
    title: "Pengaturan Sistem",
    subTitle: "Kelola preferensi portal TalentFlow, kustomisasi bahasa, and atur mode visual aksesibilitas.",
    accountSec: "Keamanan Akun & Profil",
    adminProfile: "Profil Admin Utama",
    secStatus: "Keamanan Sandi & 2FA Aktif",
    langSec: "Bahasa Portal Pengantar",
    langDesc: "Ubah instan bahasa seluruh antarmuka dan laporan admin.",
    themeSec: "Aksesibilitas & Tema Visual",
    themeDesc: "Tarik tali lampu gantung di bawah untuk beralih antara Mode Gelap (Dark Mode) dan Mode Terang (Light Mode). Pilihan disimpan otomatis.",
    helpSec: "Bantuan & Kontak Support",
    contactSupport: "Hubungi Tim Support TalentFlow",
    currentLang: "Bahasa Indonesia (ID)",
    saveSuccess: "Konfigurasi disimpan ke sistem lokal.",
    themeDark: "Mode Gelap",
    themeLight: "Mode Terang",
    roleLabel: "Super Administrator"
  },
  en: {
    title: "System Settings",
    subTitle: "Configure TalentFlow console properties, choose translations, and adjust visual themes.",
    accountSec: "Account Profile & Security",
    adminProfile: "Master Admin Profile",
    secStatus: "Secure Password & Multi-factor Enabled",
    langSec: "Console Translation Base",
    langDesc: "Instantly translate all admin buttons, dialogs, and aggregates.",
    themeSec: "Accessibility & Themes",
    themeDesc: "Pull the hanging lamp cord below to toggle between Dark Mode and Light Mode. Your preferences are saved automatically.",
    helpSec: "Support Ticket & Documentation",
    contactSupport: "Contact TalentFlow Support Team",
    currentLang: "English (EN)",
    saveSuccess: "Configurations synchronized locally.",
    themeDark: "Dark Charcoal Theme",
    themeLight: "Classic Light Theme",
    roleLabel: "Super Administrator"
  }
};

export default function AdminSettings({
  adminUser,
  lang,
  theme,
  onToggleTheme,
  onSetLanguage
}: AdminSettingsProps) {
  const t = LOCALIZATION[lang];
  const [lampPulled, setLampPulled] = useState(false);

  // Trigger pull cord animation briefly in CSS then switch theme
  const handlePullCord = () => {
    setLampPulled(true);
    setTimeout(() => {
      setLampPulled(false);
      onToggleTheme();
    }, 350);
  };

  return (
    <div className="space-y-6 text-left">
      
      {/* Title Header */}
      <div className="bg-white dark:bg-gray-800 transition-colors duration-300 ease-in-out border border-gray-200 dark:border-gray-700 p-6 rounded-3xl">
        <h2 className="text-xl font-black text-gray-900 dark:text-white transition-colors duration-300 ease-in-out font-display tracking-tight flex items-center gap-2">
          <Sliders className="w-5 h-5 text-indigo-400" />
          {t.title}
        </h2>
        <p className="text-xs text-gray-600 dark:text-gray-400 transition-colors duration-300 ease-in-out mt-1 font-light leading-relaxed">
          {t.subTitle}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Language & Profile details */}
        <div className="lg:col-span-6 space-y-6">
          
          {/* User profile check card */}
          <div className="bg-white dark:bg-gray-800 transition-colors duration-300 ease-in-out border border-gray-200 dark:border-gray-700 rounded-2xl p-5 space-y-4">
            <h3 className="text-xs font-black text-gray-900 dark:text-white transition-colors duration-300 ease-in-out uppercase tracking-wider pb-2 border-b border-gray-200 dark:border-gray-700">
              {t.accountSec}
            </h3>

            <div className="flex gap-4 items-center">
              <div className="w-12 h-12 rounded-full bg-indigo-600 border-2 border-indigo-400 flex items-center justify-center font-black text-md text-gray-900 dark:text-white transition-colors duration-300 ease-in-out font-display">
                AD
              </div>
              <div className="space-y-0.5">
                <strong className="text-sm text-gray-900 dark:text-white transition-colors duration-300 ease-in-out block">{adminUser.name || 'Admin TalentFlow'}</strong>
                <span className="text-[10px] text-indigo-45s uppercase tracking-wider font-extrabold">{t.roleLabel}</span>
              </div>
            </div>

            <div className="space-y-2 pt-1.5 text-xs text-gray-600 dark:text-gray-400 transition-colors duration-300 ease-in-out leading-normal">
              <div className="flex justify-between py-1.5 border-b border-gray-200 dark:border-gray-700">
                <span>Email Admin:</span>
                <span className="text-gray-900 dark:text-white transition-colors duration-300 ease-in-out font-semibold">{adminUser.email || 'admin@talentflow.com'}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-gray-200 dark:border-gray-700">
                <span>Security Console:</span>
                <span className="text-emerald-450 font-bold">2FA ENABLED</span>
              </div>
            </div>
          </div>

          {/* Bilingual translations toggling base */}
          <div className="bg-white dark:bg-gray-800 transition-colors duration-300 ease-in-out border border-gray-200 dark:border-gray-700 rounded-2xl p-5 space-y-3.5">
            <div>
              <h3 className="text-xs font-black text-gray-900 dark:text-white transition-colors duration-300 ease-in-out uppercase tracking-wider">
                {t.langSec}
              </h3>
              <p className="text-[10.5px] text-gray-500 dark:text-gray-400 transition-colors duration-300 ease-in-out mt-0.5 leading-relaxed font-light">{t.langDesc}</p>
            </div>

            <div className="grid grid-cols-2 gap-3 leading-none select-none">
              
              {/* Indonesian ID option */}
              <div
                onClick={() => onSetLanguage('id')}
                className={`p-3.5 border rounded-2xl cursor-pointer text-center transition flex justify-between items-center ${
                  lang === 'id' 
                    ? 'bg-indigo-600/10 border-indigo-500 text-indigo-400 font-extrabold' 
                    : 'bg-gray-50 dark:bg-gray-900 transition-colors duration-300 ease-in-out border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 transition-colors duration-300 ease-in-out hover:bg-white dark:bg-gray-800 transition-colors duration-300 ease-in-out '
                }`}
              >
                <span className="text-xs">Bahasa Indonesia (ID)</span>
                {lang === 'id' && <Check className="w-4 h-4 text-indigo-400 shrink-0" />}
              </div>

              {/* English EN option */}
              <div
                onClick={() => onSetLanguage('en')}
                className={`p-3.5 border rounded-2xl cursor-pointer text-center transition flex justify-between items-center ${
                  lang === 'en' 
                    ? 'bg-indigo-600/10 border-indigo-500 text-indigo-400 font-extrabold' 
                    : 'bg-gray-50 dark:bg-gray-900 transition-colors duration-300 ease-in-out border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 transition-colors duration-300 ease-in-out hover:bg-white dark:bg-gray-800 transition-colors duration-300 ease-in-out '
                }`}
              >
                <span className="text-xs">English (EN)</span>
                {lang === 'en' && <Check className="w-4 h-4 text-indigo-400 shrink-0" />}
              </div>

            </div>
          </div>

        </div>

        {/* Right Column: Pull-cord light bulb toggler */}
        <div className="lg:col-span-6 bg-white dark:bg-gray-800 transition-colors duration-300 ease-in-out border border-gray-200 dark:border-gray-700 rounded-3xl p-6 flex flex-col items-center justify-between min-h-[360px] text-center">
          
          <div className="space-y-1 block">
            <h3 className="text-xs font-black text-gray-900 dark:text-white transition-colors duration-300 ease-in-out uppercase tracking-wider">
              {t.themeSec}
            </h3>
            <p className="text-[11px] text-gray-500 dark:text-gray-400 transition-colors duration-300 ease-in-out leading-relaxed font-light max-w-sm mt-1">
              {t.themeDesc}
            </p>
          </div>

          {/* HANGING LAMP PULL CORD INTERACTION VECTOR COMPONENT */}
          <div className="w-44 h-44 relative flex flex-col justify-start items-center p-2 select-none">
            
            {/* The wire ceiling anchor line */}
            <div className={`w-0.5 bg-white dark:bg-gray-800 transition-colors duration-300 ease-in-out mx-auto transition-all duration-300 ${
              lampPulled ? 'h-24' : 'h-16'
            }`} />

            {/* Pull handle handle circle anchor */}
            <div 
              onClick={handlePullCord}
              className={`w-6 h-6 rounded-full border border-gray-300 bg-gray-50 dark:bg-gray-900 transition-colors duration-300 ease-in-out flex items-center justify-center cursor-pointer hover:scale-110 active:scale-95 text-gray-500 dark:text-gray-400 transition-colors duration-300 ease-in-out transition-all select-none hover:border-indigo-400 hover:text-indigo-400 shadow-md ${
                lampPulled ? 'translate-y-8 bg-indigo-500 border-indigo-405 text-gray-900 dark:text-white transition-colors duration-300 ease-in-out ' : 'translate-y-0'
              }`}
              title="Tarik Tali Lampu"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-current" />
            </div>

            {/* Glowing Lamp bulbs visual overlay */}
            <div className="mt-8 flex flex-col items-center">
              <Sun className={`w-8 h-8 transition-all ${
                theme === 'dark' ? 'text-gray-700 scale-90' : 'text-indigo-500 scale-110 drop-shadow-[0_0_15px_rgba(245,158,11,0.6)]'
              }`} />
              <span className="text-[10px] text-gray-500 dark:text-gray-400 transition-colors duration-300 ease-in-out font-black font-mono block mt-2 tracking-widest uppercase">
                {theme === 'dark' ? t.themeDark : t.themeLight}
              </span>
            </div>

          </div>

          <div className="border border-dashed border-gray-200 dark:border-gray-700 p-4.5 rounded-2xl w-full text-left text-xs bg-gray-50 dark:bg-gray-900 transition-colors duration-300 ease-in-out /40 text-gray-500 dark:text-gray-400 transition-colors duration-300 ease-in-out leading-relaxed font-light">
            <span className="font-bold text-gray-800 block mb-1">💡 Pro Tip</span>
            {lang === 'id' 
              ? 'Warna dan visual diatur saksama dengan parameter kontras netral kelas dunia untuk kenyamanan operator mata rekruter.' 
              : 'Our interface is meticulously tested to match perfect eye-friendly contrast standards for prolonged recruitment operations.'}
          </div>

        </div>

      </div>

    </div>
  );
}
