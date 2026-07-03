import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { PieChart, TrendingUp } from 'lucide-react';
import { UserProfile } from '../types';
import { useIsDark } from '../hooks/useIsDark';

interface SkillsAnalyticsProps {
  profile: UserProfile;
}

export default function SkillsAnalytics({ profile }: SkillsAnalyticsProps) {
  const isDark = useIsDark();
  const stats = profile.stats || {
    ovr: 0, acd: 0, spd: 0, con: 0, str: 0, com: 0, ldr: 0, dtl: 0
  };

  const data = [
    { subject: 'Academics', A: stats.acd || 0, fullMark: 100 },
    { subject: 'Speed', A: stats.spd || 0, fullMark: 100 },
    { subject: 'Consistency', A: stats.con || 0, fullMark: 100 },
    { subject: 'Stress Res.', A: stats.str || 0, fullMark: 100 },
    { subject: 'Communication', A: stats.com || 0, fullMark: 100 },
    { subject: 'Leadership', A: stats.ldr || 0, fullMark: 100 },
    { subject: 'Detail', A: stats.dtl || 0, fullMark: 100 },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 transition-colors duration-300 ease-in-out border border-gray-200 dark:border-gray-700 rounded-3xl p-6 md:p-8 relative overflow-hidden group">
      <div className="flex items-center gap-2 mb-2">
        <div className="bg-teal-500/10 p-2 rounded-xl border border-teal-500/20">
          <PieChart className="w-5 h-5 text-teal-400" />
        </div>
        <h4 className="text-lg font-bold text-gray-900 dark:text-white transition-colors duration-300 ease-in-out font-display">Skills Analytics</h4>
      </div>
      <p className="text-xs text-gray-600 dark:text-gray-400 transition-colors duration-300 ease-in-out mb-6">Pemetaan visual kompetensi inti berdasarkan tes performa.</p>

      <div className="h-[280px] w-full mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="65%" data={data}>
            <PolarGrid stroke={isDark ? '#4b5563' : '#d1d5db'} />
            <PolarAngleAxis 
              dataKey="subject" 
              tick={{ fill: isDark ? '#9ca3af' : '#4b5563', fontSize: 10, fontWeight: 600 }}
            />
            <PolarRadiusAxis 
              angle={30} 
              domain={[0, 100]} 
              tick={{ fill: isDark ? '#4b5563' : '#9ca3af', fontSize: 10 }}
              axisLine={false}
              tickCount={5}
            />
            <Tooltip
               cursor={{ stroke: isDark ? '#818cf8' : '#4f46e5', strokeWidth: 2, fill: 'transparent' }}
               contentStyle={{ 
                 backgroundColor: isDark ? '#1f2937' : '#ffffff', 
                 border: `1px solid ${isDark ? '#374151' : '#e5e7eb'}`, 
                 borderRadius: '8px', 
                 color: isDark ? '#ffffff' : '#111827',
                 boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' 
               }}
               itemStyle={{ color: '#0d9488', fontWeight: 'bold' }}
               labelStyle={{ color: isDark ? '#d1d5db' : '#4b5563', fontWeight: 'bold' }}
            />
            <Radar
               name={profile.name}
               dataKey="A"
               stroke="#0d9488"
               fill="#14b8a6"
               fillOpacity={isDark ? 0.35 : 0.2}
               activeDot={{ r: 6, fill: isDark ? '#818cf8' : '#4f46e5', stroke: isDark ? '#f9fafb' : '#ffffff', strokeWidth: 2 }}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
      
      {/* Quick insights */}
      <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-900 transition-colors duration-300 ease-in-out rounded-2xl border border-gray-200 dark:border-gray-700 flex items-start gap-3">
        <TrendingUp className="w-5 h-5 text-teal-600 dark:text-teal-400 shrink-0" />
        <div>
          <h5 className="text-xs font-bold text-gray-800 dark:text-gray-200">Competency Overview</h5>
          <p className="text-[10px] text-gray-500 dark:text-gray-400 transition-colors duration-300 ease-in-out mt-1 leading-relaxed">
            Visualisasi di atas menunjukkan persebaran kompetensi Anda. Semakin luas jaring, semakin tinggi performa Anda di berbagai bidang, membantu memoles profil bagi perusahaan.
          </p>
        </div>
      </div>
    </div>
  );
}
