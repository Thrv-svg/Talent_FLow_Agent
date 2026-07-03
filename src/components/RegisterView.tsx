/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import apiClient from '../apiClient';

interface RegisterViewProps {
  onRegisterSuccess: () => void;
  onSwitchToLogin: () => void;
  selectedRole: 'pelamar' | 'hr';
  onBack?: () => void;
}

export default function RegisterView({ onRegisterSuccess, onSwitchToLogin, selectedRole, onBack }: RegisterViewProps) {
  const navigate = useNavigate();
  const [completeName, setCompleteName] = useState('');
  const [nik, setNik] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  // Education Tracking
  const [eduType, setEduType] = useState<'sma' | 'kuliah' | ''>('');
  const [entryYear, setEntryYear] = useState('');
  const [gradYear, setGradYear] = useState('');
  const [futurePlan, setFuturePlan] = useState('');
  const [futureMajor, setFutureMajor] = useState('');

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState({ text: '', type: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg({ text: '', type: '' });

    // NIK Length match
    if (nik.length !== 16 || !/^\d+$/.test(nik)) {
      setMsg({ text: 'Gagal: NIK (KTP) harus terdiri dari tepat 16 digit angka!', type: 'error' });
      return;
    }

    setLoading(true);

    try {
      const payload = {
        nama_lengkap: completeName,
        nik,
        no_whatsapp: whatsapp,
        email,
        password,
        role: selectedRole,
        educationLevel: eduType === 'sma' ? 'SMA/SMK' : eduType === 'kuliah' ? 'Mahasiswa Aktif' : 'SMA/SMK',
        eduType,
        entryYear: parseInt(entryYear, 10),
        gradYear: parseInt(gradYear, 10),
        futurePlan,
        futureMajor
      };

      const response = await apiClient.post('/api/register', payload);
      const data = response.data;
      
      if (data.success) {
        setMsg({ text: 'Berhasil! Akun terdaftar. Mengalihkan...', type: 'success' });
        setTimeout(() => {
          onRegisterSuccess();
        }, 1500);
      } else {
        setMsg({ text: data.message || 'Gagal mendaftar.', type: 'error' });
      }
    } catch (err: any) {
       console.error(err);
       if (err.response?.status === 400 && err.response?.data?.message === 'Akun telah terdaftar') {
         setMsg({ text: 'Akun telah terdaftar', type: 'error' });
       } else {
         setMsg({ text: err.response?.data?.message || 'Terjadi kesalahan pada server.', type: 'error' });
       }
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
            Buat Akun Pelamar
          </h2>
          <p className="text-[#595959] text-sm mb-8">
            TalentFlow Career System
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5 h-[65vh] overflow-y-auto pr-2 custom-scrollbar">
          {msg.text && (
            <div className={`p-4 rounded-2xl text-sm font-medium text-center ${
              msg.type === 'success' 
                ? 'bg-emerald-50 text-emerald-600' 
                : 'bg-red-50 text-red-600'
            }`}>
              {msg.text}
            </div>
          )}

          <div>
            <input
              type="text"
              required
              value={completeName}
              onChange={(e) => setCompleteName(e.target.value)}
              placeholder="Nama Lengkap (Misal: Budi Wibowo)"
              className="w-full bg-gray-50/50 border border-gray-200 rounded-2xl px-5 py-3.5 text-[#262626] placeholder-gray-400 focus:outline-none focus:border-[#262626] focus:ring-1 focus:ring-[#262626] transition-all"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <input
                type="text"
                required
                maxLength={16}
                value={nik}
                onChange={(e) => setNik(e.target.value)}
                placeholder="16 Digit NIK"
                className="w-full bg-gray-50/50 border border-gray-200 rounded-2xl px-5 py-3.5 text-[#262626] placeholder-gray-400 focus:outline-none focus:border-[#262626] focus:ring-1 focus:ring-[#262626] transition-all"
              />
            </div>
            <div>
              <input
                type="text"
                required
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                placeholder="No. WhatsApp"
                className="w-full bg-gray-50/50 border border-gray-200 rounded-2xl px-5 py-3.5 text-[#262626] placeholder-gray-400 focus:outline-none focus:border-[#262626] focus:ring-1 focus:ring-[#262626] transition-all"
              />
            </div>
          </div>

          <hr className="border-t border-gray-100 my-2" />

          <div>
            <select
              required
              value={eduType}
              onChange={(e) => {
                const val = e.target.value as 'sma' | 'kuliah' | '';
                setEduType(val);
              }}
              className="w-full bg-gray-50/50 border border-gray-200 rounded-2xl px-5 py-3.5 text-[#262626] placeholder-gray-400 focus:outline-none focus:border-[#262626] focus:ring-1 focus:ring-[#262626] transition-all appearance-none"
            >
              <option value="" disabled>Pendidikan Saat Ini / Terakhir</option>
              <option value="sma">SMA/SMK Sederajat</option>
              <option value="kuliah">Kuliah (S1/D3/D4)</option>
            </select>
          </div>

          {eduType !== '' && (
            <div className="bg-gray-50/50 border border-gray-200 rounded-2xl p-4 flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <input
                    type="number"
                    required
                    value={entryYear}
                    onChange={(e) => setEntryYear(e.target.value)}
                    placeholder="Tahun Masuk"
                    className="w-full bg-gray-50/50 border border-gray-200 rounded-2xl px-5 py-3.5 text-[#262626] placeholder-gray-400 focus:outline-none focus:border-[#262626] focus:ring-1 focus:ring-[#262626] transition-all"
                  />
                </div>
                <div>
                  <input
                    type="number"
                    required
                    value={gradYear}
                    onChange={(e) => setGradYear(e.target.value)}
                    placeholder="Tahun Lulus"
                    className="w-full bg-gray-50/50 border border-gray-200 rounded-2xl px-5 py-3.5 text-[#262626] placeholder-gray-400 focus:outline-none focus:border-[#262626] focus:ring-1 focus:ring-[#262626] transition-all"
                  />
                </div>
              </div>

              <div>
                <select
                  required
                  value={futurePlan}
                  onChange={(e) => setFuturePlan(e.target.value)}
                  className="w-full bg-gray-50/50 border border-gray-200 rounded-2xl px-5 py-3.5 text-[#262626] placeholder-gray-400 focus:outline-none focus:border-[#262626] focus:ring-1 focus:ring-[#262626] transition-all appearance-none"
                >
                  <option value="" disabled>
                    {eduType === 'sma' ? 'Rencana Setelah Lulus SMA/SMK' : 'Rencana Setelah Lulus Kuliah (S1/D3)'}
                  </option>
                  {eduType === 'sma' && (
                    <>
                      <option value="kuliah">Lanjut Kuliah (S1/D3)</option>
                      <option value="kerja">Langsung Kerja</option>
                      <option value="usaha">Membangun Usaha</option>
                    </>
                  )}
                  {eduType === 'kuliah' && (
                    <>
                      <option value="s2">Lanjut S2 / S3</option>
                      <option value="kerja">Mencari Kerja</option>
                      <option value="usaha">Membangun Usaha</option>
                      <option value="lainnya">Lain-lain</option>
                    </>
                  )}
                </select>
              </div>

              {eduType === 'sma' && futurePlan === 'kuliah' && (
                <div>
                  <input
                    type="text"
                    required
                    value={futureMajor}
                    onChange={(e) => setFutureMajor(e.target.value)}
                    placeholder="Target Jurusan (Misal: Teknik Sipil)"
                    className="w-full bg-gray-50/50 border border-gray-200 rounded-2xl px-5 py-3.5 text-[#262626] placeholder-gray-400 focus:outline-none focus:border-[#262626] focus:ring-1 focus:ring-[#262626] transition-all"
                  />
                </div>
              )}
            </div>
          )}

          <hr className="border-t border-gray-100 my-2" />

          <div>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              className="w-full bg-gray-50/50 border border-gray-200 rounded-2xl px-5 py-3.5 text-[#262626] placeholder-gray-400 focus:outline-none focus:border-[#262626] focus:ring-1 focus:ring-[#262626] transition-all"
            />
          </div>

          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password (min. 6 karakter)"
              className="w-full bg-gray-50/50 border border-gray-200 rounded-2xl px-5 py-3.5 pr-12 text-[#262626] placeholder-gray-400 focus:outline-none focus:border-[#262626] focus:ring-1 focus:ring-[#262626] transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#262626] text-white rounded-full py-3.5 font-medium hover:scale-[1.02] transition-transform duration-200 disabled:opacity-50 mt-2"
          >
            {loading ? 'Memproses...' : 'Daftar Sekarang'}
          </button>
        </form>

        <p className="text-center text-sm text-[#595959] mt-8">
          Sudah punya akun?{' '}
          <button
            onClick={onSwitchToLogin}
            className="text-[#262626] font-medium hover:underline transition-all"
          >
            Masuk di sini
          </button>
        </p>
      </div>
    </div>
  );
}
