import React from 'react';
import { User, Building, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface RoleSelectionViewProps {
  onSelectRole: (role: 'pelamar' | 'hr') => void;
  onBackToLogin: () => void;
}

export default function RoleSelectionView({ onSelectRole, onBackToLogin }: RoleSelectionViewProps) {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#fafafa] flex items-center justify-center p-6 select-none relative z-50">
      <button 
        type="button"
        onClick={(e) => { 
          e.preventDefault(); 
          if(onBackToLogin) onBackToLogin();
          navigate('/'); 
        }}
        className="group flex items-center gap-2.5 bg-white/50 backdrop-blur-md border border-gray-200/80 shadow-sm text-[#595959] hover:text-[#262626] hover:bg-white px-4 py-2 rounded-full transition-all duration-300 text-sm font-medium z-50 fixed top-6 left-6"
      >
        <svg 
          className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Kembali
      </button>

      <div className="relative z-10 w-full max-w-4xl px-6">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-semibold text-[#262626] mb-4 tracking-tight">Pilih Jenis Akun</h1>
          <p className="text-[#595959] text-base md:text-lg">Silakan pilih peran untuk melanjutkan ke tahap pendaftaran.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <button
            onClick={() => onSelectRole('pelamar')}
            className="group relative flex flex-col items-center justify-center p-12 bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100/50 hover:-translate-y-1 hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#262626] text-center"
          >
            <div className="w-20 h-20 bg-gray-50 border border-gray-200 rounded-full flex items-center justify-center mb-8 group-hover:scale-110 group-hover:bg-[#262626] group-hover:border-[#262626] transition-all duration-300">
              <User className="w-10 h-10 text-[#595959] group-hover:text-white transition-colors duration-300" />
            </div>
            <h2 className="text-2xl font-semibold text-[#262626] mb-4">Pelamar</h2>
            <p className="text-[#595959] leading-relaxed">
              Daftar sebagai pelamar untuk membuat profil, mengikuti tes asesmen, dan melamar posisi magang/pekerjaan.
            </p>
          </button>

          <button
            onClick={() => onSelectRole('hr')}
            className="group relative flex flex-col items-center justify-center p-12 bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100/50 hover:-translate-y-1 hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#262626] text-center"
          >
            <div className="w-20 h-20 bg-gray-50 border border-gray-200 rounded-full flex items-center justify-center mb-8 group-hover:scale-110 group-hover:bg-[#262626] group-hover:border-[#262626] transition-all duration-300">
              <Building className="w-10 h-10 text-[#595959] group-hover:text-white transition-colors duration-300" />
            </div>
            <h2 className="text-2xl font-semibold text-[#262626] mb-4">Perusahaan / HR</h2>
            <p className="text-[#595959] leading-relaxed">
              Mewakili instansi perusahaan untuk mengelola lowongan, memonitor proses rekrutmen, dan melihat hasil asesmen pelamar.
            </p>
          </button>
        </div>
      </div>
    </div>
  );
}
