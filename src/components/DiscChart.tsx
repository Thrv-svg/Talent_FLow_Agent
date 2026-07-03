import React from 'react';

interface DiscChartProps {
  scores: {
    D: number;
    I: number;
    S: number;
    C: number;
  };
  height?: number;
}

export default function DiscChart({ scores, height = 300 }: DiscChartProps) {
  const isEmpty = Object.values(scores).every(val => val === 0);

  if (isEmpty) {
    return (
      <div style={{ width: '100%', height }} className="bg-white dark:bg-gray-800 transition-colors duration-300 ease-in-out shadow-sm rounded-xl flex items-center justify-center p-4 border border-gray-200 dark:border-gray-700">
        <p className="text-gray-600 dark:text-gray-400 font-medium italic">Belum melakukan tes.</p>
      </div>
    );
  }

  // Define normalized max height for bars
  const maxScore = Math.max(1, (scores.D + scores.I + scores.S + scores.C) / 1.5);
  
  // Normalize a score to a height percentage, capping at 95%
  const getPct = (val: number) => {
    return Math.min(95, Math.max(15, (val / maxScore) * 100));
  };

  const categories = [
    { key: 'D', name: 'Dominance', color: 'bg-red-600', textColor: 'text-red-600', pct: getPct(scores.D), val: scores.D, desc: ['Results', 'Direct', 'Competitive'] },
    { key: 'I', name: 'Influence', color: 'bg-yellow-500', textColor: 'text-yellow-600', pct: getPct(scores.I), val: scores.I, desc: ['Enthusiasm', 'Friendly', 'Optimistic'] },
    { key: 'S', name: 'Steadiness', color: 'bg-green-600', textColor: 'text-green-600', pct: getPct(scores.S), val: scores.S, desc: ['Sincerity', 'Patient', 'Modest'] },
    { key: 'C', name: 'Compliance', color: 'bg-blue-600', textColor: 'text-blue-600', pct: getPct(scores.C), val: scores.C, desc: ['Accurate', 'Cautious', 'Contemplative'] },
  ];

  return (
    <div className="w-full flex font-sans rounded-xl overflow-hidden shadow-sm border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 transition-colors duration-300 ease-in-out" style={{ height }}>
      {categories.map((cat, idx) => (
        <div key={cat.key} className={`flex-1 flex flex-col ${idx !== 0 ? 'border-l border-gray-200 dark:border-gray-700' : ''}`}>
          
          {/* Top colored section for the "Bar" visualization */}
          <div className={`${cat.color} flex-1 relative overflow-hidden flex flex-col justify-end p-2 md:p-4 transition-all`} style={{ height: `${cat.pct}%`, marginTop: 'auto' }}>
            {/* Using a darker shade underneath the bar visualization simulating the chart */}
             <div className="absolute inset-0 bg-black/10 z-0" />
             
             {/* Character mockup placeholder */}
             <div className="w-full h-full absolute inset-0 flex items-center justify-center opacity-20">
                <div className="w-16 h-16 rounded-full bg-white dark:bg-gray-800 transition-colors duration-300 ease-in-out opacity-50"></div>
             </div>

             <div className="relative z-10 flex flex-col items-center mt-auto">
                <span className="text-white text-3xl md:text-5xl font-bold mb-2">{cat.key}</span>
             </div>
          </div>
          
          {/* Bottom text section matching the style */}
          <div className={`${cat.color} text-white px-2 py-4 md:px-4 text-left flex-shrink-0 min-h-[120px]`}>
             <h4 className="font-bold text-sm md:text-md border-b border-white/20 pb-1 mb-2 text-white">
               <span className="text-xl inline-block mr-0.5">{cat.key}</span>{cat.name.slice(1)}
             </h4>
             <ul className="text-xs space-y-1 mt-2 text-white/90">
                 {cat.desc.map((d, i) => (
                     <li key={i} className="flex gap-1.5 opacity-90"><span className="opacity-70">-</span> {d}</li>
                 ))}
             </ul>
          </div>
          
        </div>
      ))}
    </div>
  );
}
