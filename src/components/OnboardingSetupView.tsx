import React, { useState, useEffect } from 'react';
import { UserProfile } from '../types';
import apiClient from '../apiClient';
import { Briefcase, UserCircle, CheckCircle2, Building2 } from 'lucide-react';

interface Props {
  initialProfile?: any;
  onComplete: (data: Partial<UserProfile>) => void;
}

export default function OnboardingSetupView({ initialProfile, onComplete }: Props) {
  const [step, setStep] = useState<number>(initialProfile?.role && initialProfile.role !== 'pending' ? 2 : 1);
  const [selectedRole, setSelectedRole] = useState<'pelamar' | 'hr'>(
    initialProfile?.role === 'hr' || initialProfile?.role === 'perusahaan' ? 'hr' : 'pelamar'
  );
  
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Pelamar fields
  const [eduLevel, setEduLevel] = useState(
    initialProfile?.educationLevel && initialProfile?.educationLevel !== '' 
      ? initialProfile?.educationLevel 
      : 'SMA/SMK'
  );
  const [eduType, setEduType] = useState(
    initialProfile?.eduType && initialProfile?.eduType !== ''
      ? initialProfile?.eduType
      : (eduLevel === 'SMA/SMK' ? 'sma' : 'kuliah')
  );
  const [majorSelect, setMajorSelect] = useState('Umum');
  const [customMajor, setCustomMajor] = useState('');

  const [nik, setNik] = useState(initialProfile?.nik || '');
  const [whatsapp, setWhatsapp] = useState(initialProfile?.whatsapp || '');
  const [aboutMe, setAboutMe] = useState('');
  const [nickname, setNickname] = useState('');
  const [skills, setSkills] = useState('');
  const [portfolio, setPortfolio] = useState('');
  const [expectedSalary, setExpectedSalary] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [hobbies, setHobbies] = useState('');

  // HR / Perusahaan fields
  const [companyName, setCompanyName] = useState(initialProfile?.companyName || '');
  const [industry, setIndustry] = useState('');
  const [companyDesc, setCompanyDesc] = useState('');

  const [availableMajors, setAvailableMajors] = useState<string[]>([]);

  useEffect(() => {
    // Fetch majors from global DB
    apiClient.get('/api/majors').then(res => {
      if (res.data.success) {
        const matchingMajors = res.data.keys
          .filter((m: any) => m.eduLevel === eduLevel)
          .map((m: any) => m.majorName);
        
        let defaults: string[] = [];
        if (eduLevel === 'SMA/SMK') {
          defaults = ['IPA', 'IPS', 'Bahasa', 'Teknik Mesin', 'Teknik Kendaraan Ringan', 'Akuntansi', 'Pemasaran', 'Umum'];
        } else {
          defaults = ['Teknik Informatika', 'Bisnis & Manajemen', 'Sains & Teknologi', 'Umum'];
        }
        
        const merged = Array.from(new Set([...defaults, ...matchingMajors]));
        setAvailableMajors(merged);
        
        if (initialProfile?.major && merged.includes(initialProfile.major)) {
            setMajorSelect(initialProfile.major);
        } else if (initialProfile?.major) {
            setMajorSelect('Lainnya');
            setCustomMajor(initialProfile.major);
        } else {
            setMajorSelect('Umum');
        }
      }
    }).catch(console.error);
  }, [eduLevel, initialProfile]);

  const handleRoleSelection = (role: 'pelamar' | 'hr') => {
    setSelectedRole(role);
    setStep(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      let finalMajor = selectedRole === 'pelamar' 
          ? (majorSelect === 'Lainnya' ? customMajor : majorSelect)
          : '';

      const formData = selectedRole === 'hr'
        ? { companyName, industry, companyDesc }
        : { 
            educationLevel: eduLevel,
            eduType: eduLevel === 'SMA/SMK' ? 'sma' : 'kuliah',
            nik,
            whatsapp,
            major: finalMajor, 
            aboutMe, 
            nickname, 
            skills, 
            portfolio, 
            expectedSalary, 
            linkedin, 
            hobbies 
          };

      const payload = {
        role: selectedRole,
        formData
      };

      const res = await apiClient.post('/api/user/onboarding', payload);
      
      if (res.data.success) {
        if (res.data.token) {
          localStorage.setItem('talentflow_token', res.data.token);
        }
        onComplete(res.data.profile);
      } else {
        setErrorMsg(res.data.message || 'Gagal menyimpan data onboarding.');
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.response?.data?.message || 'Server error saat onboarding.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300 ease-in-out flex flex-col items-center justify-center p-4 selection:bg-teal-500/30 font-sans py-12 overflow-y-auto">
      <div className="bg-white dark:bg-gray-800 transition-colors duration-300 ease-in-out border border-gray-200 dark:border-gray-700 p-8 rounded-2xl w-full max-w-2xl shadow-2xl relative overflow-hidden mt-auto mb-auto">
        
        {/* Glow Effects */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

        <div className="relative z-10">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-black text-gray-900 dark:text-white transition-colors duration-300 ease-in-out tracking-tight flex justify-center items-center gap-2">
              <SparkleIcon /> {selectedRole === 'pelamar' ? 'Overview Kandidat' : 'Lengkapi Profil Perusahaan'}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 transition-colors duration-300 ease-in-out text-sm mt-3 max-w-md mx-auto leading-relaxed">
              Halo, {initialProfile?.name || 'Talent'}! Lengkapi data ini agar HR / Perusahaan lebih mengenal potensi luar biasa Anda.
            </p>
          </div>

          {errorMsg && (
            <div className="bg-red-500/10 text-red-500 border border-red-500/20 p-4 rounded-xl text-xs font-bold mb-6 flex items-center justify-center">
              {errorMsg}
            </div>
          )}

          {step === 1 ? (
            <div className="space-y-6">
              <h3 className="text-sm font-bold text-gray-800 uppercase tracking-widest text-center border-b border-gray-200 dark:border-gray-700 pb-2">
                Pilih Peran Anda
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => handleRoleSelection('pelamar')}
                  className="bg-gray-50 dark:bg-gray-900 transition-colors duration-300 ease-in-out border-2 border-gray-200 dark:border-gray-700 hover:border-teal-500/50 p-6 rounded-2xl text-left transition-all group flex flex-col focus:outline-none focus:ring-4 focus:ring-teal-500/20"
                >
                  <div className="bg-white dark:bg-gray-800 transition-colors duration-300 ease-in-out group-hover:bg-teal-500/20 text-gray-600 dark:text-gray-400 transition-colors duration-300 ease-in-out group-hover:text-teal-400 w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-colors">
                    <UserCircle className="w-6 h-6" />
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 dark:text-white transition-colors duration-300 ease-in-out mb-2 group-hover:text-teal-300 transition-colors">Saya Pelamar Kerja</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 transition-colors duration-300 ease-in-out leading-relaxed font-medium">Buka berbagai tes akademik, evaluasi psikotes, dan temukan pekerjaan impian Anda berikutnya dengan platform AI.</p>
                </button>

                <button
                  type="button"
                  onClick={() => handleRoleSelection('hr')}
                  className="bg-gray-50 dark:bg-gray-900 transition-colors duration-300 ease-in-out border-2 border-gray-200 dark:border-gray-700 hover:border-indigo-500/50 p-6 rounded-2xl text-left transition-all group flex flex-col focus:outline-none focus:ring-4 focus:ring-indigo-500/20"
                >
                  <div className="bg-white dark:bg-gray-800 transition-colors duration-300 ease-in-out group-hover:bg-indigo-500/20 text-gray-600 dark:text-gray-400 transition-colors duration-300 ease-in-out group-hover:text-indigo-400 w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-colors">
                    <Briefcase className="w-6 h-6" />
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 dark:text-white transition-colors duration-300 ease-in-out mb-2 group-hover:text-indigo-300 transition-colors">Saya Perusahaan / HR</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 transition-colors duration-300 ease-in-out leading-relaxed font-medium">Temukan kandidat berkualitas yang disortir menggunakan algoritma TalentFlow dan OVR tracking.</p>
                </button>
              </div>
            </div>
          ) : (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              {(!initialProfile?.role || initialProfile?.role === 'pending') && (
                  <div className="flex items-center justify-center mb-6">
                    <button 
                      type="button" 
                      onClick={() => setStep(1)} 
                      className="text-xs text-gray-500 dark:text-gray-400 transition-colors duration-300 ease-in-out hover:text-gray-900 dark:text-white transition-colors duration-300 ease-in-out transition-colors bg-white dark:bg-gray-800 transition-colors duration-300 ease-in-out border border-gray-200 dark:border-gray-700 px-3 py-1 rounded-full uppercase font-bold tracking-widest"
                    >
                      ← Ubah Peran
                    </button>
                  </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5 bg-gray-50 dark:bg-gray-900 transition-colors duration-300 ease-in-out p-6 sm:p-8 rounded-2xl border border-gray-200 dark:border-gray-700/60 shadow-inner">
                {selectedRole === 'pelamar' ? (
                  <>
                    <h3 className="text-sm font-bold text-teal-400 uppercase tracking-widest border-l-2 border-teal-500 pl-2 mb-4 flex items-center gap-2">
                       <UserCircle className="w-4 h-4" /> Detail Kandidat [{eduLevel}]
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-bold text-gray-600 dark:text-gray-400 transition-colors duration-300 ease-in-out uppercase tracking-wider mb-1.5 ml-1">NIK (Nomor Induk Kependudukan)</label>
                        <input
                          type="text"
                          required
                          maxLength={16}
                          value={nik}
                          onChange={(e) => setNik(e.target.value.replace(/\D/g, ''))}
                          className="w-full bg-white dark:bg-gray-800 transition-colors duration-300 ease-in-out border border-gray-200 dark:border-gray-700 rounded-xl p-3 text-sm text-gray-900 dark:text-white transition-colors duration-300 ease-in-out focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all font-mono"
                          placeholder="16 Digit Angka NIK"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-gray-600 dark:text-gray-400 transition-colors duration-300 ease-in-out uppercase tracking-wider mb-1.5 ml-1">No Whatsapp Aktif</label>
                        <input
                          type="text"
                          required
                          value={whatsapp}
                          onChange={(e) => setWhatsapp(e.target.value)}
                          className="w-full bg-white dark:bg-gray-800 transition-colors duration-300 ease-in-out border border-gray-200 dark:border-gray-700 rounded-xl p-3 text-sm text-gray-900 dark:text-white transition-colors duration-300 ease-in-out focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all font-mono"
                          placeholder="Cth: 081234..."
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-bold text-gray-600 dark:text-gray-400 transition-colors duration-300 ease-in-out uppercase tracking-wider mb-1.5 ml-1">Tingkat Pendidikan</label>
                        <select
                          value={eduLevel}
                          onChange={(e) => setEduLevel(e.target.value)}
                          className="w-full bg-white dark:bg-gray-800 transition-colors duration-300 ease-in-out border border-gray-200 dark:border-gray-700 rounded-xl p-3 text-sm text-gray-900 dark:text-white transition-colors duration-300 ease-in-out focus:outline-none focus:border-teal-500 transition-all font-mono"
                        >
                          <option value="SMA/SMK">SMA/SMK</option>
                          <option value="Mahasiswa Aktif">Mahasiswa Aktif / S1</option>
                          <option value="Lulusan Universitas (S1/D3)">Lulusan Universitas (S1/D3)</option>
                          <option value="Lulusan Universitas (S2/S3)">Lulusan Universitas (S2/S3)</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-gray-600 dark:text-gray-400 transition-colors duration-300 ease-in-out uppercase tracking-wider mb-1.5 ml-1">Jurusan yang Anda Ambil</label>
                        <select
                          value={majorSelect}
                          onChange={(e) => setMajorSelect(e.target.value)}
                          className="w-full bg-white dark:bg-gray-800 transition-colors duration-300 ease-in-out border border-gray-200 dark:border-gray-700 rounded-xl p-3 text-sm text-gray-900 dark:text-white transition-colors duration-300 ease-in-out focus:outline-none focus:border-teal-500 transition-all font-mono"
                        >
                          {availableMajors.map(m => (
                              <option key={m} value={m}>{m}</option>
                          ))}
                          <option value="Lainnya">Lainnya (Ketik Manual)</option>
                        </select>
                      </div>
                    </div>

                    {majorSelect === 'Lainnya' && (
                        <div>
                          <label className="block text-[11px] font-bold text-gray-600 dark:text-gray-400 transition-colors duration-300 ease-in-out uppercase tracking-wider mb-1.5 ml-1">Nama Jurusan</label>
                          <input
                            type="text"
                            required
                            value={customMajor}
                            onChange={(e) => setCustomMajor(e.target.value)}
                            className="w-full bg-white dark:bg-gray-800 transition-colors duration-300 ease-in-out border border-teal-900/50 rounded-xl p-3 text-sm text-teal-300 focus:outline-none focus:border-teal-500 transition-all font-mono"
                            placeholder="Contoh: Rekayasa Perangkat Lunak"
                          />
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-bold text-gray-600 dark:text-gray-400 transition-colors duration-300 ease-in-out uppercase tracking-wider mb-1.5 ml-1">Biasa Dipanggil Apa?</label>
                        <input
                          type="text"
                          required
                          value={nickname}
                          onChange={(e) => setNickname(e.target.value)}
                          className="w-full bg-white dark:bg-gray-800 transition-colors duration-300 ease-in-out border border-gray-200 dark:border-gray-700 rounded-xl p-3 text-sm text-gray-900 dark:text-white transition-colors duration-300 ease-in-out focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all"
                          placeholder="Contoh: Rian, Sarah"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-gray-600 dark:text-gray-400 transition-colors duration-300 ease-in-out uppercase tracking-wider mb-1.5 ml-1">Keahlian (Skills Utama)</label>
                        <input
                          type="text"
                          required
                          value={skills}
                          onChange={(e) => setSkills(e.target.value)}
                          className="w-full bg-white dark:bg-gray-800 transition-colors duration-300 ease-in-out border border-gray-200 dark:border-gray-700 rounded-xl p-3 text-sm text-gray-900 dark:text-white transition-colors duration-300 ease-in-out focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all"
                          placeholder="Cth: Public Speaking, ReactJS"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-gray-600 dark:text-gray-400 transition-colors duration-300 ease-in-out uppercase tracking-wider mb-1.5 ml-1">Ceritakan Secara Singkat Tentang Diri Anda!</label>
                      <textarea
                        required
                        rows={3}
                        value={aboutMe}
                        onChange={(e) => setAboutMe(e.target.value)}
                        className="w-full bg-white dark:bg-gray-800 transition-colors duration-300 ease-in-out border border-gray-200 dark:border-gray-700 rounded-xl p-3 text-sm text-gray-900 dark:text-white transition-colors duration-300 ease-in-out focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all resize-none"
                        placeholder="Saya adalah seseorang yang suka tantangan..."
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-bold text-gray-600 dark:text-gray-400 transition-colors duration-300 ease-in-out uppercase tracking-wider mb-1.5 ml-1">Link Portofolio (Opsional)</label>
                        <input
                          type="text"
                          value={portfolio}
                          onChange={(e) => setPortfolio(e.target.value)}
                          className="w-full bg-white dark:bg-gray-800 transition-colors duration-300 ease-in-out border border-gray-200 dark:border-gray-700 rounded-xl p-3 text-sm text-gray-900 dark:text-white transition-colors duration-300 ease-in-out focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all"
                          placeholder="https://github.com/myname"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-gray-600 dark:text-gray-400 transition-colors duration-300 ease-in-out uppercase tracking-wider mb-1.5 ml-1">Link LinkedIn (Opsional)</label>
                        <input
                          type="text"
                          value={linkedin}
                          onChange={(e) => setLinkedin(e.target.value)}
                          className="w-full bg-white dark:bg-gray-800 transition-colors duration-300 ease-in-out border border-gray-200 dark:border-gray-700 rounded-xl p-3 text-sm text-gray-900 dark:text-white transition-colors duration-300 ease-in-out focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all"
                          placeholder="https://linkedin.com/in/myname"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-bold text-gray-600 dark:text-gray-400 transition-colors duration-300 ease-in-out uppercase tracking-wider mb-1.5 ml-1">Ekspektasi Gaji</label>
                        <input
                          type="text"
                          required
                          value={expectedSalary}
                          onChange={(e) => setExpectedSalary(e.target.value)}
                          className="w-full bg-white dark:bg-gray-800 transition-colors duration-300 ease-in-out border border-gray-200 dark:border-gray-700 rounded-xl p-3 text-sm text-gray-900 dark:text-white transition-colors duration-300 ease-in-out focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all font-mono"
                          placeholder="Cth: Rp 5.000.000 / kompetitif"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-gray-600 dark:text-gray-400 transition-colors duration-300 ease-in-out uppercase tracking-wider mb-1.5 ml-1">Hobi & Ketertarikan Lain</label>
                        <input
                          type="text"
                          required
                          value={hobbies}
                          onChange={(e) => setHobbies(e.target.value)}
                          className="w-full bg-white dark:bg-gray-800 transition-colors duration-300 ease-in-out border border-gray-200 dark:border-gray-700 rounded-xl p-3 text-sm text-gray-900 dark:text-white transition-colors duration-300 ease-in-out focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all"
                          placeholder="Cth: Membaca, Olahraga"
                        />
                      </div>
                    </div>

                  </>
                ) : (
                  <>
                    <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-widest border-l-2 border-indigo-500 pl-2 mb-4 flex items-center gap-2">
                      <Building2 className="w-4 h-4" /> Form Perusahaan
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-bold text-gray-600 dark:text-gray-400 transition-colors duration-300 ease-in-out uppercase tracking-wider mb-1.5 ml-1">Nama Perusahaan</label>
                        <input
                          type="text"
                          required
                          value={companyName}
                          onChange={(e) => setCompanyName(e.target.value)}
                          className="w-full bg-white dark:bg-gray-800 transition-colors duration-300 ease-in-out border border-gray-200 dark:border-gray-700 rounded-xl p-3 text-sm text-gray-900 dark:text-white transition-colors duration-300 ease-in-out focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                          placeholder="Contoh: PT Bintang Cemerlang"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-gray-600 dark:text-gray-400 transition-colors duration-300 ease-in-out uppercase tracking-wider mb-1.5 ml-1">Industri / Sektor</label>
                        <input
                          type="text"
                          required
                          value={industry}
                          onChange={(e) => setIndustry(e.target.value)}
                          className="w-full bg-white dark:bg-gray-800 transition-colors duration-300 ease-in-out border border-gray-200 dark:border-gray-700 rounded-xl p-3 text-sm text-gray-900 dark:text-white transition-colors duration-300 ease-in-out focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                          placeholder="Contoh: Manufaktur, IT, F&B"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-gray-600 dark:text-gray-400 transition-colors duration-300 ease-in-out uppercase tracking-wider mb-1.5 ml-1">Deskripsi & Aktivitas Rekrutmen</label>
                      <textarea
                        required
                        rows={3}
                        value={companyDesc}
                        onChange={(e) => setCompanyDesc(e.target.value)}
                        className="w-full bg-white dark:bg-gray-800 transition-colors duration-300 ease-in-out border border-gray-200 dark:border-gray-700 rounded-xl p-3 text-sm text-gray-900 dark:text-white transition-colors duration-300 ease-in-out focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all resize-none"
                        placeholder="Jelaskan secara singkat jenis profil karyawan yang Anda cari..."
                      />
                    </div>
                  </>
                )}

                <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                   <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gray-100 dark:bg-gray-700 transition-colors duration-300 ease-in-out hover:bg-white dark:bg-gray-800 transition-colors duration-300 ease-in-out text-gray-900 dark:text-white transition-colors duration-300 ease-in-out font-black py-3.5 rounded-xl text-sm flex items-center justify-center transition-all shadow-lg focus:outline-none focus:ring-4 focus:ring-white/20"
                   >
                     {loading ? 'MENYIMPAN DATA...' : 'SIMPAN PROFIL & PENGATURAN'}
                   </button>
                   <p className="text-center text-[10px] text-gray-500 dark:text-gray-400 transition-colors duration-300 ease-in-out mt-4 font-medium max-w-xs mx-auto">
                     Data Anda digunakan murni untuk mencocokkan profil menggunakan mesin TalentFlow OVR.
                   </p>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function SparkleIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-teal-400">
      <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a4.4 4.4 0 0 1 0-8.508l6.135-1.582a2 2 0 0 0 1.437-1.437l1.582-6.135a4.4 4.4 0 0 1 8.508 0l1.582 6.135a2 2 0 0 0 1.437 1.437l6.135 1.582a4.4 4.4 0 0 1 0 8.508l-6.135 1.582a2 2 0 0 0-1.437 1.437l-1.582 6.135a4.4 4.4 0 0 1-8.508 0z" />
    </svg>
  );
}
