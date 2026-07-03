/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from 'react';
import { Zap, PlayCircle, ShieldAlert } from 'lucide-react';

interface KraepelinTestProps {
  onComplete: (hasil: { speed: number; accuracy: number; stability: number; grafikData: number[] }) => void;
}

export default function KraepelinTest({ onComplete }: KraepelinTestProps) {
  const [gameState, setGameState] = useState<'intro' | 'playing' | 'transition' | 'completed'>('intro');
  const [gridData, setGridData] = useState<number[][]>([]);
  const [currentCol, setCurrentCol] = useState(0);
  const [currentRow, setCurrentRow] = useState(0);
  const [timer, setTimer] = useState(15);
  const [transitionCountdown, setTransitionCountdown] = useState(5);
  const [scores, setScores] = useState<number[]>([]);
  const [inputs, setInputs] = useState<number[]>([]);
  const [feedbackActive, setFeedbackActive] = useState(false);
  
  const TOTAL_COLS = 10;
  const ROWS_PER_COL = 40;
  const INTERVAL_TIME = 15;
  const TRANSITION_TIME = 5;
  const CELL_HEIGHT = 46;

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const boardRef = useRef<HTMLDivElement>(null);

  const buildGrid = () => {
    const data: number[][] = [];
    for (let c = 0; c < TOTAL_COLS; c++) {
      const colData: number[] = [];
      for (let r = 0; r < ROWS_PER_COL; r++) {
        colData.push(Math.floor(Math.random() * 10));
      }
      data.push(colData);
    }
    setGridData(data);
    setScores(new Array(TOTAL_COLS).fill(0));
    setInputs(new Array(TOTAL_COLS).fill(0));
  };

  const startGame = () => {
    buildGrid();
    setCurrentCol(0);
    setCurrentRow(0);
    setTimer(INTERVAL_TIME);
    setGameState('playing');
  };

  useEffect(() => {
    if (gameState === 'playing') {
      timerRef.current = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            if (currentCol >= TOTAL_COLS - 1) {
              endGame();
            } else {
              runTransition();
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (gameState === 'transition') {
      timerRef.current = setInterval(() => {
        setTransitionCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            setCurrentCol((c) => c + 1);
            setCurrentRow(0);
            setTimer(INTERVAL_TIME);
            setGameState('playing');
            return TRANSITION_TIME; // Reset for next time
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameState, currentCol]);

  // Handle keyboard inputs
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState !== 'playing') return;
      const num = parseInt(e.key, 10);
      if (!isNaN(num) && num >= 0 && num <= 9) {
        processAnswer(num);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState, gridData, currentCol, currentRow]);

  const processAnswer = (inputNum: number) => {
    if (gameState !== 'playing' || currentRow >= ROWS_PER_COL - 1) return;

    const bottomNum = gridData[currentCol][currentRow];
    const topNum = gridData[currentCol][currentRow + 1];
    const correctAns = (bottomNum + topNum) % 10;

    setInputs((prev) => {
      const next = [...prev];
      next[currentCol]++;
      return next;
    });

    // We can track score
    if (inputNum === correctAns) {
      setScores((prev) => {
        const next = [...prev];
        next[currentCol]++;
        return next;
      });
    }

    // Play visual feedback if needed, then move row
    setFeedbackActive(true);
    setTimeout(() => setFeedbackActive(false), 150);
    setCurrentRow((prev) => prev + 1);
  };

  const runTransition = () => {
    setGameState('transition');
    setTransitionCountdown(TRANSITION_TIME);
  };

  const endGame = () => {
    setGameState('completed');
    
    // calculate performance
    // Speed: average inputs per column. Expected good speed is ~25 inputs per 15 sec.
    let totalInputs = 0;
    let totalCorrects = 0;
    let maxInput = 0;
    
    for (let i = 0; i < TOTAL_COLS; i++) {
        totalInputs += inputs[i];
        totalCorrects += scores[i];
        if (inputs[i] > maxInput) maxInput = inputs[i];
    }
    
    const avgInputs = totalInputs / TOTAL_COLS;
    // max score 100 for speed if average is >= 25
    const speed = Math.min(100, Math.round((avgInputs / 30) * 100));
    
    // Accuracy calculating with penalties for blanks as if maxInput was expected.
    // Total Expected is MAX of (maxInput * 10) OR totalInputs if they didn't skip (or simply standard).
    // Let's use maxInput * TOTAL_COLS as the denominator to heavily penalize zeros.
    const expectedInputs = Math.max(totalInputs, maxInput * TOTAL_COLS);
    const accuracy = expectedInputs === 0 ? 0 : Math.round((totalCorrects / expectedInputs) * 100);
    
    // Stability: Standard Deviation
    let sumDiffSq = 0;
    for (let i = 0; i < TOTAL_COLS; i++) {
        sumDiffSq += Math.pow(inputs[i] - avgInputs, 2);
    }
    const stdDev = Math.sqrt(sumDiffSq / TOTAL_COLS);
    // 0 stdDev = 100 stability. If stdDev is 10, stability = 0.
    const stabilityRaw = 100 - (stdDev * 10);
    const stability = Math.max(0, Math.min(100, Math.round(stabilityRaw)));

    setTimeout(() => {
      onComplete({ speed, accuracy, stability, grafikData: scores });
    }, 2000);
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900 transition-colors duration-300 ease-in-out border border-[#1f2d45] rounded-3xl p-3 md:p-6 w-full max-w-5xl mx-auto flex flex-col items-center min-h-[calc(100dvh-5rem)] md:h-[80vh] overflow-hidden relative">
      
      {/* HEADER */}
      <div className="text-center w-full shrink-0 mb-2 md:mb-4">
        <h2 className="font-display font-bold text-xl md:text-2xl text-gray-900 dark:text-white transition-colors duration-300 ease-in-out mb-1 md:mb-2">Tes Ketahanan Kerja (Kraepelin)</h2>
        <div className="text-lg md:text-xl font-bold text-indigo-600 bg-indigo-600 text-gray-900 dark:text-white transition-colors duration-300 ease-in-out /10 px-4 md:px-5 py-1.5 md:py-2 rounded-lg border border-amber-500/20 inline-block">
          {gameState === 'completed' ? 'Selesai' : `Waktu Interval: ${timer}s`}
        </div>
        <p className="text-gray-600 dark:text-gray-400 transition-colors duration-300 ease-in-out text-xs md:text-sm mt-1.5 md:mt-3">
          Jumlahkan dua angka terbawah. Ketik digit terakhir dari hasilnya.
        </p>
      </div>

      {gameState === 'intro' && (
        <div className="flex-1 w-full overflow-y-auto pb-6">
          <div className="flex min-h-full flex-col items-center justify-center py-4">
            <div className="bg-white dark:bg-gray-800 transition-colors duration-300 ease-in-out border border-gray-200 dark:border-gray-700 p-5 sm:p-6 rounded-2xl w-full max-w-lg text-center shadow-lg">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white transition-colors duration-300 ease-in-out mb-2 text-teal-400">Instruksi Pengerjaan:</h3>
              <p className="text-sm text-gray-800 mb-4 leading-relaxed text-left sm:text-center">
                Ini adalah simulasi tes Kraepelin sesungguhnya. Anda harus menjumlahkan dua angka secara cepat dari bawah ke atas pada kolom yang tersedia, namun hanya masukkan <strong>DIGIT SATUAN</strong>-nya saja.
                <br /><span className="text-xs text-gray-600 dark:text-gray-400 transition-colors duration-300 ease-in-out block mt-1">(Misal: 8 + 7 = 15, ketik 5).</span>
              </p>
              <p className="text-sm text-gray-800 mb-6 leading-relaxed text-left sm:text-center">
                Tersedia total 10 kolom, dimana layar akan pindah otomatis tiap 15 detik. Gunakan NUMPAD jika memakai desktop.
              </p>
              <button
                onClick={startGame}
                className="bg-blue-500 hover:bg-blue-600 text-gray-900 dark:text-white transition-colors duration-300 ease-in-out font-bold px-6 border-b-4 border-blue-700 active:border-b-0 active:translate-y-1 py-3 rounded-xl transition-all w-full text-lg shadow-[0_0_15px_rgba(59,130,246,0.3)] shrink-0"
              >
                Mulai Tes Sekarang
              </button>
            </div>
          </div>
        </div>
      )}

      {(gameState === 'playing' || gameState === 'transition') && gridData.length > 0 && (
        <>
          {/* THE BOARD */}
          <div 
            className="flex-1 w-full bg-[#111827] border border-[#1f2d45] rounded-xl overflow-hidden relative min-h-[160px] md:min-h-[220px] [--col-w:40px] [--row-h:34px] [--col-gap:16px] [--box-w:48px] [--box-h:76px] [--cx:60px] [--cy:60px] md:[--row-h:46px] md:[--col-gap:20px] md:[--box-w:60px] md:[--box-h:96px] md:[--cx:80px] md:[--cy:80px]"
          >
            
            {/* The fixed blue box in the center */}
            <div 
              className={`absolute border-[2px] border-blue-400 bg-blue-500/20 rounded-xl pointer-events-none z-20 transition-all duration-150 ${feedbackActive ? 'scale-110 bg-blue-400/40 border-blue-300 drop-shadow-[0_0_15px_rgba(59,130,246,0.8)]' : 'scale-100'}`} 
              style={{
                left: 'calc(var(--cx) - var(--box-w) / 2)',
                bottom: 'calc(var(--cy) - var(--box-h) / 2)',
                width: 'var(--box-w)',
                height: 'var(--box-h)',
              }}
            />

            {/* Moving Grid */}
            <div 
              className="absolute flex transition-transform duration-300 ease-out will-change-transform"
              style={{
                left: 0,
                bottom: 0,
                gap: 'var(--col-gap)',
                transform: `translate(calc(var(--cx) - (var(--col-w)/2 + ${currentCol} * (var(--col-w) + var(--col-gap)))), calc((${currentRow} + 1) * var(--row-h) - var(--cy)))`
              }}
            >
              {gridData.map((colDigits, cIdx) => {
                const isActiveCol = cIdx === currentCol;
                return (
                  <div
                    key={cIdx}
                    className={`flex flex-col-reverse transition-all duration-300 w-[var(--col-w)] ${
                      isActiveCol ? 'opacity-100' : 'opacity-40'
                    }`}
                  >
                    {colDigits.map((num, rIdx) => {
                      const isActivePair = isActiveCol && (rIdx === currentRow || rIdx === currentRow + 1);
                      return (
                        <div 
                          key={rIdx} 
                          className={`w-full flex items-center justify-center font-black text-[24px] md:text-[36px] transition-all duration-200 ${isActivePair ? 'text-gray-900 dark:text-white transition-colors duration-300 ease-in-out translate-x-px' : 'text-gray-500 dark:text-gray-400 transition-colors duration-300 ease-in-out /80'}`} 
                          style={{ height: 'var(--row-h)' }}
                        >
                          {num}
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>

            {/* TRANSITION OVERLAY */}
            {gameState === 'transition' && (
              <div className="absolute inset-0 bg-black/95 z-50 flex flex-col items-center justify-center transition-all duration-300">
                <div className="w-20 h-20 bg-red-500/20 text-red-500 rounded-full flex items-center justify-center mb-4 border border-red-500/50 shadow-[0_0_30px_rgba(239,68,68,0.4)] relative">
                  <ShieldAlert className="w-10 h-10 animate-pulse" />
                </div>
                <h2 className="font-display text-3xl font-bold text-red-500 mb-2 drop-shadow-md">Waktu Berpindah!</h2>
                <p className="text-gray-900 dark:text-white transition-colors duration-300 ease-in-out text-lg font-medium text-center">
                  Geser ke baris selanjutnya dalam <br/>
                  <span className="block text-5xl text-indigo-600 font-bold mt-3 animate-bounce">{transitionCountdown}</span>
                </p>
              </div>
            )}
          </div>

          {/* NUMPAD (for mobile support like in index.html provided) */}
          <div className="shrink-0 w-full max-w-sm mt-2 md:mt-3 pb-1 md:pb-2 z-30">
            <div className="grid grid-cols-3 gap-1.5 md:gap-3">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
                <button
                  key={n}
                  onClick={() => processAnswer(n)}
                  className="bg-[#1f2d45] hover:bg-blue-600 active:bg-blue-700 active:scale-95 text-gray-900 dark:text-white transition-colors duration-300 ease-in-out border border-blue-500/50 rounded-xl md:rounded-2xl text-xl md:text-2xl font-bold py-3 md:p-4 transition-all shadow-md touch-manipulation"
                >
                  {n}
                </button>
              ))}
              <div className="col-start-2">
                <button
                  onClick={() => processAnswer(0)}
                  className="bg-[#1f2d45] hover:bg-blue-600 active:bg-blue-700 active:scale-95 text-gray-900 dark:text-white transition-colors duration-300 ease-in-out border border-blue-500/50 rounded-xl md:rounded-2xl text-xl md:text-2xl font-bold py-3 md:p-4 transition-all w-full shadow-md touch-manipulation"
                >
                  0
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {gameState === 'completed' && (
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="text-center p-8 bg-[#111827] border border-[#1f2d45] rounded-2xl">
            <h2 className="text-2xl font-bold text-emerald-400 font-display mb-4">Waktu Habis!</h2>
            <p className="text-gray-800">Menyimpan dan mengalkulasi hasil ketahanan kerja Anda ke database...</p>
          </div>
        </div>
      )}
    </div>
  );
}
