import React from 'react';
import { Calendar, Flame, Award, Check } from 'lucide-react';
import { UserProfile } from '../types';

interface DailyCheckInWidgetProps {
  profile: UserProfile;
  onCheckIn: () => void;
}

export default function DailyCheckInWidget({ profile, onCheckIn }: DailyCheckInWidgetProps) {
  const points = profile.consistencyPoints || 0;
  const streak = profile.checkInStreak || 0;
  const lastCheckIn = profile.lastCheckInDate;
  
  // Check if already checked in today
  const today = new Date().toISOString().split('T')[0];
  const hasCheckedInToday = lastCheckIn === today;

  return (
    <div className="bg-white dark:bg-gray-800 transition-colors duration-300 ease-in-out dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-3xl p-6 h-auto transition-colors duration-300 ease-in-out relative overflow-hidden group">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />
      
      <div className="flex flex-wrap md:flex-row items-start md:items-center justify-between gap-4 relative z-10 w-full">
        <div className="flex-1 min-w-[240px]">
          <h4 className="text-lg font-bold text-gray-900 dark:text-white transition-colors duration-300 ease-in-out dark:text-white flex items-center gap-2 mb-1 transition-colors duration-300 ease-in-out ">
            <Calendar className="w-5 h-5 text-orange-400" /> Daily Talent Check-in
          </h4>
          <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300 ease-in-out dark:text-gray-400 max-w-sm transition-colors duration-300 ease-in-out ">
            Bangun rutinitas Anda. Login setiap hari untuk mendapatkan poin konsistensi dan tingkatkan Overall Rating (OVR) Anda.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          {/* Stats Badges */}
          <div className="flex gap-3">
            <div className="flex flex-col items-center bg-gray-50 dark:bg-gray-900 transition-colors duration-300 ease-in-out dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl px-4 py-2 min-w-[80px] transition-colors duration-300 ease-in-out ">
              <span className="text-[10px] uppercase font-bold text-gray-500 dark:text-gray-400 transition-colors duration-300 ease-in-out dark:text-gray-400 mb-0.5">STREAK</span>
              <div className="flex items-center gap-1 font-bold text-orange-400">
                <Flame className="w-4 h-4" /> {streak} <span className="text-xs">hari</span>
              </div>
            </div>
            <div className="flex flex-col items-center bg-gray-50 dark:bg-gray-900 transition-colors duration-300 ease-in-out dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl px-4 py-2 min-w-[80px] transition-colors duration-300 ease-in-out ">
              <span className="text-[10px] uppercase font-bold text-gray-500 dark:text-gray-400 transition-colors duration-300 ease-in-out dark:text-gray-400 mb-0.5">POIN</span>
              <div className="flex items-center gap-1 font-bold text-yellow-400">
                <Award className="w-4 h-4" /> {points}
              </div>
            </div>
          </div>

          <button
            onClick={onCheckIn}
            disabled={hasCheckedInToday}
            className={`
              shrink-0 h-14 px-6 rounded-2xl font-bold text-sm flex items-center gap-2 transition-all shadow-md
              ${hasCheckedInToday 
                ? 'bg-gray-100 dark:bg-gray-700 transition-colors duration-300 ease-in-out dark:bg-gray-700 text-gray-500 dark:text-gray-400 transition-colors duration-300 ease-in-out dark:text-gray-400 cursor-not-allowed shadow-none border border-gray-200 dark:border-gray-700 dark:border-gray-600'
                : 'bg-indigo-600 dark:bg-indigo-500 text-white hover:bg-indigo-700 dark:hover:bg-indigo-600 cursor-pointer hover:shadow-lg hover:shadow-indigo-500/20'}
            `}
          >
            {hasCheckedInToday ? (
              <>
                <Check className="w-5 h-5 text-emerald-500" />
                Done
              </>
            ) : (
              'Check In +10'
            )}
          </button>
        </div>
      </div>
      
      {/* Progress Bar pseudo UI for next milestone can go here if needed... */}
    </div>
  );
}
