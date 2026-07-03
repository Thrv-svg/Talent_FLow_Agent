import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../apiClient';

interface CompanyRegisterViewProps {
  onRegisterSuccess: () => void;
  onSwitchToLogin: () => void;
  onBack?: () => void;
}

export default function CompanyRegisterView({ onRegisterSuccess, onSwitchToLogin, onBack }: CompanyRegisterViewProps) {
  const navigate = useNavigate();
  const [companyName, setCompanyName] = useState('');
  const [completeName, setCompleteName] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [step, setStep] = useState(1);

  const handleNextStep = () => {
    if (step === 1) {
      if (!companyName || !completeName || !whatsapp) {
        setError('Mohon isi semua data perusahaan yang wajib.');
        return;
      }
      setError('');
      setStep(2);
    }
  };

  const handleBackStep = () => {
    setError('');
    setStep(1);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Password dan konfirmasi password tidak cocok.');
      return;
    }
    
    setLoading(true);
    setError('');

    try {
      const res = await apiClient.post('/api/auth/register', {
        email,
        password,
        role: 'hr',
        complete_name: completeName,
        whatsapp,
        company_name: companyName,
      });

      if (res.data.success) {
        onRegisterSuccess();
      } else {
        setError(res.data.message || 'Gagal membuat akun.');
      }
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || 'Terjadi kesalahan saat pendaftaran.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] flex items-center justify-center p-6 select-none relative z-50">
      <button 
        type="button"
        onClick={(e) => { 
          e.preventDefault(); 
          if(onBack) onBack();
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

      <div className="bg-white p-10 sm:p-12 max-w-md w-full rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100/50 flex flex-col relative z-50">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-semibold text-[#262626] mb-2">
            Buat Akun Perusahaan
          </h2>
          <p className="text-[#595959] text-sm mb-8">
            TalentFlow Employer System
          </p>
          
          <div className="flex justify-center items-center gap-2 mb-2">
            <div className={`h-1.5 w-12 rounded-full transition-colors ${step >= 1 ? 'bg-[#262626]' : 'bg-gray-200'}`} />
            <div className={`h-1.5 w-12 rounded-full transition-colors ${step >= 2 ? 'bg-[#262626]' : 'bg-gray-200'}`} />
          </div>
        </div>

        <form onSubmit={step === 1 ? (e) => { e.preventDefault(); handleNextStep(); } : handleRegister} className="flex flex-col gap-5 h-[50vh] overflow-y-auto pr-2 custom-scrollbar">
          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-sm text-center font-medium">
              {error}
            </div>
          )}

          {step === 1 && (
            <>
              <div>
                <input
                  type="text"
                  required
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="Nama Perusahaan (Misal: PT Teknologi Maju)"
                  className="w-full bg-gray-50/50 border border-gray-200 rounded-2xl px-5 py-3.5 text-[#262626] placeholder-gray-400 focus:outline-none focus:border-[#262626] focus:ring-1 focus:ring-[#262626] transition-all"
                />
              </div>
              <div>
                <input
                  type="text"
                  required
                  value={completeName}
                  onChange={(e) => setCompleteName(e.target.value)}
                  placeholder="Nama Penanggung Jawab / HR"
                  className="w-full bg-gray-50/50 border border-gray-200 rounded-2xl px-5 py-3.5 text-[#262626] placeholder-gray-400 focus:outline-none focus:border-[#262626] focus:ring-1 focus:ring-[#262626] transition-all"
                />
              </div>
              <div>
                <input
                  type="tel"
                  required
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  placeholder="Nomor WhatsApp Perusahaan/HR"
                  className="w-full bg-gray-50/50 border border-gray-200 rounded-2xl px-5 py-3.5 text-[#262626] placeholder-gray-400 focus:outline-none focus:border-[#262626] focus:ring-1 focus:ring-[#262626] transition-all"
                />
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email Perusahaan"
                  className="w-full bg-gray-50/50 border border-gray-200 rounded-2xl px-5 py-3.5 text-[#262626] placeholder-gray-400 focus:outline-none focus:border-[#262626] focus:ring-1 focus:ring-[#262626] transition-all"
                />
              </div>
              <div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full bg-gray-50/50 border border-gray-200 rounded-2xl px-5 py-3.5 text-[#262626] placeholder-gray-400 focus:outline-none focus:border-[#262626] focus:ring-1 focus:ring-[#262626] transition-all"
                />
              </div>
              <div>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Konfirmasi Password"
                  className="w-full bg-gray-50/50 border border-gray-200 rounded-2xl px-5 py-3.5 text-[#262626] placeholder-gray-400 focus:outline-none focus:border-[#262626] focus:ring-1 focus:ring-[#262626] transition-all"
                />
              </div>
            </>
          )}

          <div className="mt-4 flex flex-col gap-3">
            {step === 2 && (
              <button
                type="button"
                onClick={handleBackStep}
                className="w-full rounded-full border border-gray-200 bg-transparent text-[#262626] py-3.5 font-medium hover:bg-gray-50 transition-colors"
              >
                Kembali ke Tahap 1
              </button>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#262626] text-white rounded-full py-3.5 font-medium hover:scale-[1.02] transition-transform duration-200 disabled:opacity-50"
            >
              {loading ? 'Memproses...' : step === 1 ? 'Lanjut' : 'Daftar Perusahaan'}
            </button>
          </div>
        </form>

        <p className="text-center text-sm text-[#595959] mt-8">
          Sudah punya akun?{' '}
          <button
            onClick={onSwitchToLogin}
            className="text-[#262626] font-medium hover:underline focus:outline-none"
          >
            Log In
          </button>
        </p>
      </div>
    </div>
  );
}
