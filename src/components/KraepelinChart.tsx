import React, { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, LabelList, Tooltip } from 'recharts';
import { useIsDark } from '../hooks/useIsDark';

interface KraepelinChartProps {
  speed: number;
  accuracy: number;
  stability: number;
  dataPoints?: number[];
  height?: number;
}

export default function KraepelinChart({ speed, accuracy, stability, dataPoints = [], height = 300 }: KraepelinChartProps) {
  const isDark = useIsDark();

  if (speed === 0 && accuracy === 0 && stability === 0) {
    return (
      <div style={{ width: '100%', height }} className="bg-white dark:bg-gray-800 transition-colors duration-300 ease-in-out rounded-xl flex items-center justify-center p-4 border border-gray-200 dark:border-gray-700">
        <p className="text-gray-600 dark:text-gray-400 transition-colors duration-300 ease-in-out font-medium italic">Belum melakukan tes.</p>
      </div>
    );
  }

  const data = dataPoints.length > 0 
    ? dataPoints.map((val, i) => ({ name: (i + 1).toString(), value: val }))
    : Array.from({ length: 10 }).map((_, i) => ({ name: (i + 1).toString(), value: 0 }));

  const CustomizedDot = (props: any) => {
    const { cx, cy } = props;
    if (cx == null || cy == null) return null;
    return (
      <circle cx={cx} cy={cy} r={3} stroke="none" fill="#0ea5e9" />
    );
  };

  return (
    <div style={{ width: '100%', height }} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 transition-colors duration-300 ease-in-out rounded-xl p-6 shadow-sm flex flex-col">
        <h4 className="text-center text-gray-900 dark:text-white mb-4 text-sm font-bold font-display tracking-wide">GRAFIK HASIL TES KRAEPELIN</h4>
        <ResponsiveContainer width="100%" height="85%">
        <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={true} stroke={isDark ? '#374151' : '#e5e7eb'} />
            <XAxis dataKey="name" tick={{fontSize: 10, fill: isDark ? '#9ca3af' : '#6b7280'}} tickLine={false} axisLine={{ stroke: isDark ? '#4b5563' : '#d1d5db' }} interval={0} />
            <YAxis domain={[0, 'dataMax']} tick={{fontSize: 10, fill: isDark ? '#9ca3af' : '#6b7280'}} tickLine={false} axisLine={{ stroke: isDark ? '#4b5563' : '#d1d5db' }} />
            <Tooltip
               contentStyle={{ 
                 backgroundColor: isDark ? '#1f2937' : '#ffffff', 
                 border: `1px solid ${isDark ? '#374151' : '#e5e7eb'}`, 
                 borderRadius: '8px', 
                 color: isDark ? '#ffffff' : '#111827',
                 boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' 
               }}
            />
            <Line 
                type="monotone" 
                dataKey="value" 
                stroke="#0ea5e9" 
                strokeWidth={2} 
                dot={<CustomizedDot />}
                isAnimationActive={false}
            >
                <LabelList dataKey="value" position="top" offset={10} style={{fontSize: 10, fill: isDark ? '#d1d5db' : '#4b5563', fontWeight: 'bold'}} />
            </Line>
        </LineChart>
        </ResponsiveContainer>
    </div>
  );
}
