import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, BarChart3, BrainCircuit, ShieldCheck, Zap } from 'lucide-react';

interface LandingPageProps {
  onLoginClick: () => void;
  onRegisterClick: () => void;
}

export default function LandingPage({ onLoginClick, onRegisterClick }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-[#fafafa] selection:bg-[#262626] selection:text-white font-sans overflow-x-hidden">
      {/* FLOATING NAVBAR */}
      <nav className="fixed top-6 left-0 right-0 z-50 px-4">
        <div className="max-w-5xl mx-auto rounded-full bg-white/80 backdrop-blur-md shadow-sm border border-gray-200 px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#262626] text-white flex items-center justify-center font-bold text-sm">
              TF
            </div>
            <span className="font-bold text-[#262626] text-lg tracking-tight">TalentFlow</span>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={onRegisterClick}
              className="px-4 sm:px-5 py-2 text-sm font-medium text-[#262626] border border-gray-300 rounded-full hover:bg-gray-50 transition-colors"
            >
              Registrasi
            </button>
            <button 
              onClick={onLoginClick}
              className="px-4 sm:px-5 py-2 text-sm font-medium text-white bg-[#262626] rounded-full hover:scale-[1.02] transition-transform duration-200"
            >
              Masuk
            </button>
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="relative pt-40 pb-24 px-6 md:pt-52 md:pb-32 overflow-hidden flex flex-col items-center justify-center min-h-[85vh]">
        {/* Subtle Radial Gradient Background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] sm:w-[800px] sm:h-[800px] bg-gradient-to-tr from-gray-200/40 via-gray-100/20 to-transparent rounded-full blur-3xl -z-10" />
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          
            <motion.h1 
              initial={{ opacity: 0, y: 60, filter: 'blur(15px)', scale: 0.95 }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)', scale: 1 }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              className="text-5xl md:text-7xl font-semibold text-[#262626] tracking-tight leading-[1.1] mb-6"
            >
              Masa Depan Rekrutmen, <br className="hidden md:block" /> Dimulai dari Sini.
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 80 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="text-lg md:text-xl text-[#595959] max-w-2xl mx-auto leading-relaxed mb-10"
            >
              Platform asesmen kompetensi cerdas untuk mengukur potensi sejati kandidat melalui tes psikometri dan analisis data real-time, dirancang dengan antarmuka yang modern dan minimalis.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <button 
                onClick={onRegisterClick}
                className="px-8 py-4 text-base font-medium text-white bg-[#262626] rounded-full hover:scale-[1.02] transition-transform duration-200 flex items-center gap-2 w-full sm:w-auto justify-center shadow-lg shadow-black/5"
              >
                Mulai Sekarang <ArrowRight className="w-4 h-4" />
              </button>
              <button 
                onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-8 py-4 text-base font-medium text-[#262626] border border-gray-300 bg-transparent rounded-full hover:bg-gray-50 transition-colors w-full sm:w-auto justify-center"
              >
                Jelajahi Fitur
              </button>
            </motion.div>
        </div>
      </section>

      {/* SCROLLABLE INFORMATION SECTIONS */}
      <section id="features" className="max-w-7xl mx-auto py-32 px-6 flex flex-col gap-32">
        
        {/* Feature 1: Asesmen Psikometri Terpadu */}
        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <div className="lg:col-span-5 space-y-6 flex flex-col items-center lg:items-start text-center lg:text-left">
            <h2 className="text-3xl lg:text-4xl font-semibold text-[#262626] tracking-tight mb-4">
              Ujian Psikologi & Kognitif Cerdas
            </h2>
            <p className="text-lg text-[#595959] leading-relaxed">
              Evaluasi karakter kandidat secara mendalam melalui instrumen tes standar industri seperti Kraepelin, DISC, PAPI, dan Kuis Akademik dalam satu platform yang terintegrasi.
            </p>
          </div>
          <div className="lg:col-span-7 bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100/50 flex items-center justify-center p-4 sm:p-8 relative overflow-hidden group aspect-[4/3] sm:aspect-video">
             {/* App Window Wrapper with Video */}
             <div className="w-full bg-gray-50 rounded-2xl border border-gray-100 flex flex-col relative overflow-hidden group-hover:border-gray-200 transition-colors">
               <div className="w-full h-10 sm:h-12 border-b border-gray-200 bg-white/80 backdrop-blur-md flex items-center px-4 gap-2 z-10 shrink-0">
                 <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-red-400" />
                 <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-amber-400" />
                 <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-emerald-400" />
               </div>
               <div className="w-full relative bg-gray-100">
                 <video 
                   src="/images/psikotest.mp4" 
                   autoPlay 
                   muted 
                   loop 
                   playsInline
                   className="w-full h-auto block"
                 >
                   Video preview
                 </video>
               </div>
            </div>
          </div>
        </motion.div>

        {/* Feature 2: Analitik & Visualisasi Data */}
        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <div className="lg:col-span-7 lg:order-1 order-2 bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100/50 flex items-center justify-center p-4 sm:p-8 relative overflow-hidden group aspect-[4/3] sm:aspect-video">
             {/* App Window Wrapper with Video */}
             <div className="w-full bg-gray-50 rounded-2xl border border-gray-100 flex flex-col relative overflow-hidden group-hover:border-gray-200 transition-colors">
               <div className="w-full h-10 sm:h-12 border-b border-gray-200 bg-white/80 backdrop-blur-md flex items-center px-4 gap-2 z-10 shrink-0">
                 <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-red-400" />
                 <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-amber-400" />
                 <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-emerald-400" />
               </div>
               <div className="w-full relative bg-gray-100">
                 <video 
                   src="/images/dashboard.mp4" 
                   autoPlay 
                   muted 
                   loop 
                   playsInline
                   className="w-full h-auto block"
                 >
                   Video preview
                 </video>
               </div>
            </div>
          </div>
          <div className="lg:col-span-5 lg:order-2 order-1 space-y-6 flex flex-col items-center lg:items-start text-center lg:text-left">
            <h2 className="text-3xl lg:text-4xl font-semibold text-[#262626] tracking-tight mb-4">
              Visualisasi Nilai & Talent Card
            </h2>
            <p className="text-lg text-[#595959] leading-relaxed">
              Data kompleks disajikan dalam grafik radar interaktif dan metrik performa yang mudah dipahami. Pantau stabilitas, kecepatan, dan akurasi kandidat secara real-time.
            </p>
          </div>
        </motion.div>

        {/* Feature 3: Otomatisasi Alur Rekrutmen */}
        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <div className="lg:col-span-5 space-y-6 flex flex-col items-center lg:items-start text-center lg:text-left">
            <h2 className="text-3xl lg:text-4xl font-semibold text-[#262626] tracking-tight mb-4">
              Otomatisasi Keputusan Bebas Bias
            </h2>
            <p className="text-lg text-[#595959] leading-relaxed">
              Sistem scoring otomatis yang mengurangi bias manusia. Dapatkan rekomendasi kandidat terbaik berdasarkan persentase kecocokan profil dengan kebutuhan perusahaan.
            </p>
          </div>
          <div className="lg:col-span-7 bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100/50 flex items-center justify-center p-8 relative overflow-hidden group aspect-[4/3] sm:aspect-video">
             {/* App Window Wrapper */}
             <div className="w-full h-full bg-gray-50 rounded-2xl border border-gray-100 flex flex-col relative overflow-hidden group-hover:border-gray-200 transition-colors">
               <div className="w-full h-10 sm:h-12 border-b border-gray-200 bg-white/80 backdrop-blur-md flex items-center px-4 gap-2 z-10 shrink-0">
                 <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-red-400" />
                 <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-amber-400" />
                 <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-emerald-400" />
               </div>
               <div className="w-full flex-1 bg-[#fafafa] flex flex-col p-6 gap-4">
                  <div className="flex justify-between items-center border-b border-gray-200 pb-4">
                     <div className="w-24 sm:w-32 h-3 sm:h-4 bg-gray-200 rounded-full" />
                     <div className="w-16 h-6 bg-[#10b981]/10 rounded-full flex items-center justify-center">
                       <span className="text-[10px] font-bold text-[#10b981]">98% MATCH</span>
                     </div>
                  </div>
                  <div className="flex gap-4">
                     <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gray-200 shrink-0" />
                     <div className="flex-1 space-y-2 py-1">
                        <div className="w-20 sm:w-24 h-2.5 sm:h-3 bg-gray-300 rounded-full" />
                        <div className="w-40 sm:w-48 h-2 bg-gray-200 rounded-full" />
                     </div>
                  </div>
                  <div className="mt-auto space-y-3">
                     <div className="flex items-center gap-2">
                       <div className="w-5 h-5 rounded text-[#10b981] bg-[#10b981]/20 flex items-center justify-center shrink-0"><ShieldCheck className="w-3 h-3" /></div>
                       <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                         <div className="w-[85%] h-full bg-[#262626] rounded-full" />
                       </div>
                     </div>
                     <div className="flex items-center gap-2">
                       <div className="w-5 h-5 rounded text-[#0000ee] bg-[#0000ee]/20 flex items-center justify-center shrink-0"><BrainCircuit className="w-3 h-3" /></div>
                       <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                         <div className="w-[92%] h-full bg-[#262626] rounded-full" />
                       </div>
                     </div>
                  </div>
               </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* CTA / FOOTER */}
      <footer className="relative mt-24 py-24 px-6 border-t border-gray-200 text-center bg-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.02]" />
        <div className="relative z-10 max-w-3xl mx-auto">
          <div className="w-16 h-16 rounded-3xl bg-[#262626] text-white flex items-center justify-center font-bold text-xl mx-auto mb-8 shadow-xl">
              TF
          </div>
          <h2 className="text-3xl md:text-4xl font-semibold text-[#262626] tracking-tight mb-8">
            Siap menemukan talenta terbaik Anda?
          </h2>
          <button 
             onClick={onRegisterClick}
             className="px-8 py-4 text-lg font-medium text-white bg-[#262626] rounded-full hover:scale-[1.02] transition-transform duration-200 shadow-lg shadow-black/5"
          >
            Mulai Uji Coba Gratis
          </button>
          <p className="mt-16 text-sm text-gray-400 font-medium">
            © {new Date().getFullYear()} PT TalentFlow Indonesia. Hak Cipta Dilindungi.
          </p>
        </div>
      </footer>
    </div>
  );
}
