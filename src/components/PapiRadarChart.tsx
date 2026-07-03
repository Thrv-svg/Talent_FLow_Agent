import React from 'react';
import { useIsDark } from '../hooks/useIsDark';

interface PapiRadarChartProps {
  scores: Record<string, number>;
  width?: number;
  height?: number;
}

export default function PapiRadarChart({ scores, width = 300, height = 300 }: PapiRadarChartProps) {
  const isDark = useIsDark();
  const isEmpty = !scores || Object.keys(scores).length === 0 || Object.values(scores).every(val => val === 0);

  if (isEmpty) {
    return (
      <div style={{ width: '100%', height }} className="bg-white dark:bg-gray-800 transition-colors duration-300 ease-in-out border border-gray-200 dark:border-gray-700 shadow-sm rounded-xl flex items-center justify-center p-4">
        <p className="text-gray-600 dark:text-gray-400 transition-colors duration-300 ease-in-out font-medium italic">Belum melakukan tes.</p>
      </div>
    );
  }

  // PAPI dimensions in clock-wise order starting from top-ish right
  const traits = [
    'G', 'L', 'I', 'T', 'V', // Q1
    'S', 'R', 'D', 'C', 'E', // Q2
    'N', 'A', 'P', 'X', 'B', // Q3
    'O', 'K', 'F', 'W', 'Z'  // Q4
  ];

  const totalPoints = traits.length; // 20
  const cx = width / 2;
  const cy = height / 2;
  const maxScore = 9; // Max PAPI score is usually 9
  const radius = Math.min(cx, cy) - 30; // Leave room for labels

  // Calculate coordinates for a given score/trait index
  const getPointCoordinates = (index: number, score: number) => {
    // Start at -90 degrees (top), rotate clockwise.
    // However, G is slightly to the right of top. Top is exactly between Z and G.
    // So the first angle for G should be -90 + (360 / 20 / 2) = -90 + 9 = -81 degrees.
    const angleStart = -90 + (360 / totalPoints / 2);
    const angleDeg = angleStart + (index * (360 / totalPoints));
    const angleRad = (angleDeg * Math.PI) / 180;
    
    // Scale score to radius
    const distance = (score / maxScore) * radius;
    
    const x = cx + distance * Math.cos(angleRad);
    const y = cy + distance * Math.sin(angleRad);
    
    return { x, y, angleDeg };
  };

  // Generate the polygon points string for the actual data
  const dataPoints = traits.map((trait, index) => {
    // Default score to 0 if undefined for graceful degradation
    const score = scores[trait] !== undefined ? scores[trait] : 0; 
    return getPointCoordinates(index, score);
  });
  
  const polygonPointsStr = dataPoints.map(p => `${p.x},${p.y}`).join(' ');

  // Generate concentric background rings
  const ringLevels = [9, 7, 5, 3, 1]; // Background rings at these score levels
  
  const gridStroke = isDark ? '#4b5563' : '#d1d5db';
  const labelFill = isDark ? '#9ca3af' : '#4b5563';

  return (
    <div style={{ width: '100%', height }} className="bg-white dark:bg-gray-800 transition-colors duration-300 ease-in-out border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-sm flex flex-col items-center justify-center">
      <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`} className="font-mono">
        {/* Background Rings */}
        <g stroke={gridStroke} strokeWidth="1" fill="none">
          {ringLevels.map((level) => {
            const ringPoints = traits.map((_, index) => {
              const p = getPointCoordinates(index, level);
              return `${p.x},${p.y}`;
            }).join(' ');
            
            return (
              <polygon key={`ring-${level}`} points={ringPoints} />
            );
          })}
        </g>

        {/* Axis Lines (spokes) */}
        <g stroke={gridStroke} strokeWidth="1">
          {traits.map((_, index) => {
            const outer = getPointCoordinates(index, maxScore);
            return <line key={`axis-${index}`} x1={cx} y1={cy} x2={outer.x} y2={outer.y} />;
          })}
        </g>

        {/* Data Polygon */}
        <polygon 
          points={polygonPointsStr} 
          fill={isDark ? "rgba(16, 185, 129, 0.35)" : "rgba(16, 185, 129, 0.2)"} 
          stroke="#10b981" 
          strokeWidth="2" 
        />

        {/* Data Dots */}
        {dataPoints.map((p, i) => (
          <circle key={`dot-${i}`} cx={p.x} cy={p.y} r="3" fill="#10b981" />
        ))}

        {/* Labels */}
        {width > 150 && (
          <g fill={labelFill} fontSize="10" textAnchor="middle" dominantBaseline="middle" fontWeight="bold">
            {traits.map((trait, index) => {
              // Put labels slightly outside the maximum radius
              const labelPos = getPointCoordinates(index, maxScore + 1.8);
              return (
                <text key={`label-${trait}`} x={labelPos.x} y={labelPos.y}>
                  {trait}
                </text>
              );
            })}
          </g>
        )}
      </svg>
    </div>
  );
}
