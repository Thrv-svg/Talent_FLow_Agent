import { useState } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';

export function LampSwitch({ theme, onToggle }: { theme: 'dark' | 'light'; onToggle: () => void }) {
  const [isPulling, setIsPulling] = useState(false);
  const controls = useAnimation();
  const pullThreshold = 40; // pixels to pull before it triggers

  const handleDragEnd = (event: any, info: any) => {
    setIsPulling(false);
    if (info.offset.y > pullThreshold) {
      onToggle();
      // Add a little extra spring down before snapping back up
      controls.start({
        y: [info.offset.y + 10, 0],
        transition: { type: 'spring', stiffness: 300, damping: 12 }
      });
    } else {
      controls.start({ y: 0, transition: { type: 'spring', stiffness: 300, damping: 10 } });
    }
  };

  return (
    <div className="fixed top-0 right-16 z-[100] hidden md:flex flex-col items-center keep-colors">
      {/* Base / Mount */}
      <div className="w-12 h-3 bg-gradient-to-b from-slate-800 to-slate-900 rounded-b-lg border border-t-0 border-gray-300 shadow-xl flex justify-center z-10 relative">
        <div className="w-4 h-1.5 bg-gray-50 dark:bg-gray-900 transition-colors duration-300 ease-in-out absolute bottom-0 rounded-t-sm"></div>
      </div>
      
      {/* Light glow aura (only when theme is light) */}
      <div className="relative flex justify-center">
        {theme === 'light' && (
           <div className="absolute top-0 w-32 h-32 bg-amber-300/30 blur-[40px] rounded-full pointer-events-none transition-opacity duration-1000"></div>
        )}

        {/* String & Handle */}
        <motion.div
          drag="y"
          dragConstraints={{ top: 0, bottom: 80 }}
          dragElastic={0.1}
          onDragStart={() => setIsPulling(true)}
          onDragEnd={handleDragEnd}
          animate={controls}
          className="flex flex-col items-center cursor-grab active:cursor-grabbing relative z-20"
          style={{ touchAction: 'none' }}
        >
          {/* Chain */}
          <div className="w-1 h-20 flex flex-col justify-between items-center py-1 opacity-80" style={{ background: 'repeating-linear-gradient(to bottom, #d4d4d8 0px, #d4d4d8 2px, transparent 2px, transparent 4px)' }}>
          </div>
          
          {/* Handle / Knob */}
          <div className={`w-8 h-12 rounded-full transition-all duration-300 shadow-lg flex items-center justify-center border-b-4 relative ${
             theme === 'light' 
              ? 'bg-gradient-to-b from-amber-200 to-indigo-600 border-amber-600 shadow-amber-500/50 text-amber-900' 
              : 'bg-gradient-to-b from-slate-600 to-slate-800 border-gray-200 dark:border-gray-700 shadow-black/50 text-gray-600 dark:text-gray-400 transition-colors duration-300 ease-in-out '
          }`}>
             {/* Small indent ring */}
             <div className="absolute top-2 w-6 h-1 border-t border-black/20 rounded-full"></div>
             {theme === 'light' ? <Sun className="w-4 h-4 drop-shadow-sm mt-1" /> : <Moon className="w-4 h-4 drop-shadow-sm mt-1" />}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
