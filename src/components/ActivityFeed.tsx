import React from 'react';
import { Target, Zap, ShieldCheck, Star, Sparkles, Trophy, Activity, CheckCircle } from 'lucide-react';

interface ActivityFeedProps {
  quizScoresLog: { id: string; score: number }[];
  psychResults: any;
}

export default function ActivityFeed({ quizScoresLog, psychResults }: ActivityFeedProps) {
  const activities = [];

  // Generate activities based on actual milestones
  const kraepelinResult = psychResults?.kraepelin || { speed: 0, accuracy: 0, stability: 0 };
  const papiScores = psychResults?.papi?.scores || {};
  const discScores = psychResults?.disc?.scores || { D: 0, I: 0, S: 0, C: 0 };

  if (quizScoresLog && quizScoresLog.length > 0) {
    if (quizScoresLog.length >= 10) {
      activities.push({
        id: 'quiz-10',
        title: 'Earned "10 Quizzes Completed" Badge',
        description: 'Successfully finished 10 academic assessments.',
        icon: Trophy,
        color: 'text-indigo-500',
        bgColor: 'bg-indigo-600 text-gray-900 dark:text-white transition-colors duration-300 ease-in-out /10',
        time: 'Baru saja'
      });
    }

    activities.push({
      id: 'quiz-completed',
      title: 'Completed Academic Quiz',
      description: `Menyelesaikan kuis dengan skor ${quizScoresLog[quizScoresLog.length - 1].score}.`,
      icon: CheckCircle,
      color: 'text-teal-400',
      bgColor: 'bg-teal-500/10',
      time: 'Beberapa saat lalu'
    });
  }

  if (kraepelinResult.accuracy === 100) {
    activities.push({
      id: 'kraepelin-perfect',
      title: 'Earned "Perfect Kraepelin" Badge',
      description: 'Menyelesaikan Kraepelin Test dengan akurasi 100%.',
      icon: Target,
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-500/10',
      time: 'Hari ini'
    });
  }

  if (kraepelinResult.speed >= 90) {
     activities.push({
      id: 'kraepelin-speed',
      title: 'Earned "Speed Demon" Badge',
      description: 'Menyelesaikan Kraepelin Test dengan kecepatan luar biasa.',
      icon: Zap,
      color: 'text-indigo-500',
      bgColor: 'bg-indigo-600 text-gray-900 dark:text-white transition-colors duration-300 ease-in-out /10',
      time: 'Kemarin'
    });
  }

  if (Object.keys(papiScores).length > 0) {
    activities.push({
      id: 'papi-badge',
      title: 'Earned "Self-Aware (PAPI Kostik)" Badge',
      description: 'Telah mengeksplorasi kepribadian mendalam.',
      icon: ShieldCheck,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10',
      time: 'Beberapa hari lalu'
    });
  }

  if (discScores.D > 0 || discScores.I > 0 || discScores.S > 0 || discScores.C > 0) {
    activities.push({
      id: 'disc-badge',
      title: 'Earned "Communicator (DISC)" Badge',
      description: 'Menemukan gaya komunikasi dan preferensi perilaku via DISC.',
      icon: Star,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10',
      time: 'Minggu lalu'
    });
  }

  if (activities.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 transition-colors duration-300 ease-in-out border border-gray-200 dark:border-gray-700 rounded-3xl p-6 md:p-8 space-y-4">
        <h4 className="text-lg font-bold text-gray-900 dark:text-white transition-colors duration-300 ease-in-out font-display flex items-center gap-2">
          <Activity className="w-5 h-5 text-indigo-400" /> Aktivitas Terbaru
        </h4>
        <div className="text-center py-8 text-gray-500 dark:text-gray-400 transition-colors duration-300 ease-in-out text-sm">
          Belum ada aktivitas. Mulai ikuti tes atau kuis untuk mulai membangun portofolio Anda.
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 transition-colors duration-300 ease-in-out border border-gray-200 dark:border-gray-700 rounded-3xl p-6 md:p-8 space-y-6">
      <h4 className="text-lg font-bold text-gray-900 dark:text-white transition-colors duration-300 ease-in-out font-display flex items-center gap-2">
        <Activity className="w-5 h-5 text-indigo-400" /> Aktivitas Terbaru
      </h4>
      <div className="space-y-4">
        {activities.map((activity, index) => (
          <div key={`${activity.id}-${index}`} className="flex gap-4">
            <div className={`w-10 h-10 shrink-0 rounded-full flex items-center justify-center ${activity.bgColor}`}>
              <activity.icon className={`w-5 h-5 ${activity.color}`} />
            </div>
            <div className="flex-1 border-b border-gray-200 dark:border-gray-700/50 pb-4">
              <div className="flex justify-between items-start gap-4">
                <div>
                  <h5 className="text-sm font-bold text-gray-900 dark:text-white transition-colors duration-300 ease-in-out ">{activity.title}</h5>
                  <p className="text-xs text-gray-600 dark:text-gray-400 transition-colors duration-300 ease-in-out mt-1">{activity.description}</p>
                </div>
                <span className="text-[10px] text-gray-500 dark:text-gray-400 transition-colors duration-300 ease-in-out font-medium whitespace-nowrap">{activity.time}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
