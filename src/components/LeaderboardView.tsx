import React, { useEffect, useState } from 'react';
import { Crown, Trophy, Medal, Star, ShieldAlert } from 'lucide-react';
import apiClient from '../apiClient';

interface LeaderboardCandidate {
  id: string;
  name: string;
  headline: string;
  avatarUrl?: string;
  stats: {
    ovr: number;
    acd?: number;
    spd?: number;
    con?: number;
    str?: number;
    com?: number;
    ldr?: number;
    dtl?: number;
  };
  cosmetics: {
    portrait: number;
    color: string;
  };
}

export default function LeaderboardView() {
  const [candidates, setCandidates] = useState<LeaderboardCandidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchLeaderboard();
    const interval = setInterval(fetchLeaderboard, 3000);
    return () => clearInterval(interval);
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const res = await apiClient.get('/api/leaderboard');
      if (res.data.success) {
        setCandidates(res.data.data);
      } else {
        setError('Gagal memuat leaderboard');
      }
    } catch (err) {
      setError('Terjadi kesalahan sambungan server');
    } finally {
      setLoading(false);
    }
  };

  const getColorClass = (color: string) => {
    const map: Record<string, string> = {
      emerald: 'bg-emerald-500',
      blue: 'bg-blue-500',
      purple: 'bg-purple-500',
      orange: 'bg-orange-500',
      rose: 'bg-rose-500',
      slate: 'bg-white dark:bg-gray-800 transition-colors duration-300 ease-in-out '
    };
    return map[color] || 'bg-teal-500';
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-20 opacity-60">
        <Crown className="w-12 h-12 text-teal-400 mb-4 animate-bounce" />
        <p className="text-gray-600 dark:text-gray-400 transition-colors duration-300 ease-in-out font-medium">Memuat klasemen terbaik...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-20">
        <ShieldAlert className="w-12 h-12 text-rose-400 mb-4" />
        <p className="text-rose-400 font-medium">{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      <div className="text-center space-y-2 mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-teal-500/10 mb-2">
          <Trophy className="w-8 h-8 text-teal-400" />
        </div>
        <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-white transition-colors duration-300 ease-in-out tracking-tight">Talent Leaderboard</h1>
        <p className="text-gray-600 dark:text-gray-400 transition-colors duration-300 ease-in-out max-w-lg mx-auto">
          Peringkat top 10 kandidat terbaik berdasarkan Overall Rating (OVR). Terus selesaikan tes untuk meningkatkan skormu!
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 transition-colors duration-300 ease-in-out border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden shadow-xl">
        {candidates.length === 0 ? (
          <div className="p-12 text-center text-gray-600 dark:text-gray-400 transition-colors duration-300 ease-in-out ">
            Belum ada kandidat di leaderboard.
          </div>
        ) : (
          <div className="divide-y divide-slate-800/50">
            {candidates.map((cand, idx) => {
              const ovr = cand.stats?.ovr || 0;
              let isTop3 = idx < 3;
              let rankColor = 'text-gray-500 dark:text-gray-400 transition-colors duration-300 ease-in-out ';
              let RankIcon = Star;

              if (idx === 0) {
                rankColor = 'text-yellow-400';
                RankIcon = Crown;
              } else if (idx === 1) {
                rankColor = 'text-gray-800';
                RankIcon = Medal;
              } else if (idx === 2) {
                rankColor = 'text-amber-600';
                RankIcon = Medal;
              }

              return (
                <div key={cand.id} className="p-4 sm:p-6 flex items-center gap-4 sm:gap-6 hover:bg-white dark:bg-gray-800 transition-colors duration-300 ease-in-out /20 transition-colors">
                  
                  {/* Rank Column */}
                  <div className={"flex flex-col items-center justify-center w-8 shrink-0 " + rankColor}>
                    {isTop3 ? <RankIcon className="w-6 h-6 sm:w-8 sm:h-8 mb-1" /> : <div className="text-xl sm:text-2xl font-bold font-display opacity-50">#{idx + 1}</div>}
                  </div>

                  {/* Avatar */}
                  <div className={"w-12 h-12 sm:w-16 sm:h-16 rounded-xl flex items-center justify-center shrink-0 shadow-lg overflow-hidden " + getColorClass(cand.cosmetics?.color || 'emerald')}>
                    {cand.avatarUrl ? (
                      <img src={cand.avatarUrl} alt="Avatar" className="w-full h-full object-cover keep-colors" />
                    ) : (
                      <span className="text-xl sm:text-2xl font-display font-bold text-gray-900 dark:text-white transition-colors duration-300 ease-in-out shadow-sm">
                        {cand.name.slice(0, 2).toUpperCase()}
                      </span>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white transition-colors duration-300 ease-in-out truncate">{cand.name}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-300 ease-in-out truncate">{cand.headline || 'Kandidat TalentFlow'}</p>
                  </div>

                  {/* OVR Score */}
                  <div className="shrink-0 flex flex-col items-center">
                    <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 transition-colors duration-300 ease-in-out mb-0.5 tracking-widest uppercase">OVR</div>
                    <div className={"px-3 py-1 rounded-lg font-display font-black text-xl sm:text-2xl shadow-sm " + (ovr >= 80 ? 'bg-teal-500/20 text-teal-300' : ovr >= 60 ? 'bg-emerald-500/20 text-emerald-300' : 'bg-white dark:bg-gray-800 transition-colors duration-300 ease-in-out text-gray-800')}>
                      {ovr}
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}
