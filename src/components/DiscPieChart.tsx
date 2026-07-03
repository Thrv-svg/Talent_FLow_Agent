import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { useIsDark } from '../hooks/useIsDark';

interface DiscPieChartProps {
  scores: {
    D: number;
    I: number;
    S: number;
    C: number;
  };
  height?: number;
}

export default function DiscPieChart({ scores, height = 300 }: DiscPieChartProps) {
  const isDark = useIsDark();
  const isEmpty = Object.values(scores).every(val => val === 0);

  if (isEmpty) {
    return (
      <div style={{ width: '100%', height }} className="bg-white dark:bg-gray-800 transition-colors duration-300 ease-in-out shadow-sm rounded-xl flex items-center justify-center p-4 border border-gray-200 dark:border-gray-700">
        <p className="text-gray-600 dark:text-gray-400 font-medium italic">Belum melakukan tes.</p>
      </div>
    );
  }

  const total = Object.values(scores).reduce((acc, curr) => acc + curr, 0) || 1;

  const data = [
    { name: 'Dominance', value: scores.D, color: '#dc2626' }, // red-600
    { name: 'Influence', value: scores.I, color: '#eab308' }, // yellow-500
    { name: 'Steadiness', value: scores.S, color: '#16a34a' }, // green-600
    { name: 'Compliance', value: scores.C, color: '#2563eb' }, // blue-600
  ];

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, value, name }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    const pct = ((value / total) * 100).toFixed(0);

    return (
      <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" className="text-[11px] font-bold font-mono">
        {name.charAt(0)}: {pct}%
      </text>
    );
  };

  return (
    <div style={{ width: '100%', height }} className="bg-white dark:bg-gray-800 transition-colors duration-300 ease-in-out shadow-sm rounded-xl flex items-center justify-center p-2 sm:p-4 border border-gray-200 dark:border-gray-700">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="45%"
            labelLine={false}
            label={renderCustomizedLabel}
            outerRadius="75%"
            innerRadius="35%"
            fill="#8884d8"
            dataKey="value"
            stroke={isDark ? '#1f2937' : '#ffffff'}
            strokeWidth={2}
            isAnimationActive={false}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip 
            formatter={(value) => [`${((Number(value) / total) * 100).toFixed(1)}%`, 'Percentage']}
            contentStyle={{ 
              backgroundColor: isDark ? '#1f2937' : '#ffffff', 
              border: `1px solid ${isDark ? '#374151' : '#e5e7eb'}`, 
              borderRadius: '8px', 
              color: isDark ? '#ffffff' : '#111827',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' 
            }}
          />
          <Legend 
            verticalAlign="bottom" 
            content={(props: any) => {
              const { payload } = props;
              return (
                <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 w-full pt-4">
                  {payload?.map((entry: any, index: number) => (
                    <div key={`item-${index}`} className="flex items-center gap-1.5 w-auto">
                      <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: entry.color }} />
                      <span className="text-[10px] sm:text-xs text-gray-900 dark:text-white transition-colors duration-300 ease-in-out font-medium leading-none whitespace-nowrap">{entry.value}</span>
                    </div>
                  ))}
                </div>
              );
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
