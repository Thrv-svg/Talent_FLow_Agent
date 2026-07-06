import React, { useEffect, useState } from 'react';
import { 
  Building2, Plus, ArrowLeft, LogOut, 
  Brain, Clock, UsersRound, CheckCircle,
  Briefcase, GraduationCap, X, Filter, Target,
  ChevronRight, Award, MapPin, Search, SlidersHorizontal,
  LayoutDashboard, Search as SearchIcon, ListChecks, Kanban
} from 'lucide-react';
import apiClient from '../apiClient';
import { UserProfile } from '../types';

interface CompanyDashboardProps {
  user: Pick<UserProfile, 'name' | 'email' | 'role' | 'companyName' | 'headline'>;
  onLogout: () => void;
  onBackToApp?: () => void;
}

interface JobPosting {
  id: string;
  title: string;
  type: 'fulltime' | 'intern';
}

type KanbanStage = 'pending' | 'evaluasi' | 'wawancara' | 'diterima';

type CompanyTab = 'dashboard' | 'pencarian' | 'lowongan' | 'pipeline';

export default function CompanyDashboard({ user, onLogout, onBackToApp }: CompanyDashboardProps) {
  const [activeTab, setActiveTab] = useState<CompanyTab>('pipeline');
  const [candidates, setCandidates] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);

  // Job Postings State
  const [jobs, setJobs] = useState<JobPosting[]>([]);
  const [activeJobId, setActiveJobId] = useState<string>('');

  // Candidate Pipeline Stages: [jobId][candId] = stage
  const [stages, setStages] = useState<Record<string, Record<string, KanbanStage>>>({});

  // Filters for Pipeline
  const [candFilter, setCandFilter] = useState<'all' | 'fulltime' | 'intern'>('all');

  // Filters for Pencarian Talenta
  const [searchQuery, setSearchQuery] = useState('');
  const [searchEdu, setSearchEdu] = useState('Semua');
  const [searchMajor, setSearchMajor] = useState('Semua');
  const [searchMinOvr, setSearchMinOvr] = useState<number>(0);

  // AI Matchmaker State
  const [aiAnalysis, setAiAnalysis] = useState<Record<string, string>>({});
  const [aiLoading, setAiLoading] = useState<Record<string, boolean>>({});
  const [selectedAiCand, setSelectedAiCand] = useState<UserProfile | null>(null);

  // Job Modal
  const [showJobModal, setShowJobModal] = useState(false);
  const [newJobTitle, setNewJobTitle] = useState('');
  const [newJobType, setNewJobType] = useState<'fulltime' | 'intern'>('fulltime');

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const res = await apiClient.get('/api/admin/candidates');
        if (res.data.success) {
          setCandidates(res.data.candidates);
        }
      } catch (err) {
        console.error('Error fetching candidates:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCandidates();
    const interval = setInterval(fetchCandidates, 3000);
    return () => clearInterval(interval);
  }, []);

  const activeJob = jobs.find(j => j.id === activeJobId) || jobs[0];

  // Helper to get stage defaulting to 'pending'
  const getStage = (candId: string) => {
    return stages[activeJobId]?.[candId] || 'pending';
  };

  const getCandidateOvr = (c: UserProfile) => {
    return Math.min(100, (c.stats?.ovr || 0) + (c.isPremium ? 12 : 0));
  };

  // Drag and Drop Handlers
  const onDragStart = (e: React.DragEvent, candId: string) => {
    e.dataTransfer.setData('candId', candId);
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const onDrop = async (e: React.DragEvent, colId: KanbanStage) => {
    e.preventDefault();
    const candId = e.dataTransfer.getData('candId');
    if (candId) {
      setStages(prev => ({
        ...prev,
        [activeJobId]: {
          ...(prev[activeJobId] || {}),
          [candId]: colId
        }
      }));
      // Alert the candidate over SSE
      try {
        await apiClient.post('/api/company/update-status', {
          candidateId: candId,
          jobId: activeJobId,
          stage: colId
        });
      } catch (err) {
        console.error('Failed to notify candidate', err);
      }
    }
  };

  const handleCreateJob = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newJobTitle) return;
    const newJob: JobPosting = {
      id: Math.random().toString(36).substr(2, 9),
      title: newJobTitle,
      type: newJobType,
    };
    setJobs([...jobs, newJob]);
    setActiveJobId(newJob.id);
    setShowJobModal(false);
    setNewJobTitle('');
  };

  const handleAIAnalysis = async (c: UserProfile) => {
    if (!activeJob) {
      alert('Buat lowongan pekerjaan terlebih dahulu sebelum menjalankan Analisis AI.');
      return;
    }
    setSelectedAiCand(c);
    if (aiAnalysis[c.id]) return;

    setAiLoading(prev => ({ ...prev, [c.id]: true }));
    try {
      const payload = {
        jobTitle: activeJob.title,
        companyIndustry: user.companyName,
        applicantProfile: {
          name: c.name,
          educationLevel: c.educationLevel,
          major: c.major,
          stats: {
            ovr: getCandidateOvr(c),
            ldr: c.stats?.ldr || 0,
            com: c.stats?.com || 0,
            acd: c.stats?.acd || 0,
          }
        }
      };

      const { data } = await apiClient.post('/api/company/candidate-fit', payload);
      
      if (data.success && data.matchText) {
        setAiAnalysis(prev => ({ ...prev, [c.id]: data.matchText }));
      } else {
        setAiAnalysis(prev => ({ ...prev, [c.id]: 'Tidak ada ringkasan AI yang dikembalikan.' }));
      }
    } catch (err) {
      console.error('AI match error:', err);
      setAiAnalysis(prev => ({ ...prev, [c.id]: 'Gagal menghasilkan analisis AI saat ini. Pastikan server terhubung.' }));
    } finally {
      setAiLoading(prev => ({ ...prev, [c.id]: false }));
    }
  };

  // Stealth Premium Sort (Inflate OVR implicitly without UI badges)
  const stealthSort = (cands: UserProfile[]) => {
    return [...cands].sort((a, b) => {
      const aBoost = a.isPremium ? 2000 : 0;
      const bBoost = b.isPremium ? 2000 : 0;
      const aScore = getCandidateOvr(a) + aBoost;
      const bScore = getCandidateOvr(b) + bBoost;
      return bScore - aScore;
    });
  };

  // Filter candidates for Pipeline
  const filteredPipelineCandidates = candidates.filter(c => {
    if (candFilter === 'all') return true;
    const isIntern = c.educationLevel === 'SMA/SMK' || c.educationLevel === 'Mahasiswa Aktif';
    if (candFilter === 'intern') return isIntern;
    return !isIntern;
  });

  const sortedPipelineCandidates = stealthSort(filteredPipelineCandidates);

  // Filter & Sort for Pencarian Talenta
  const getSearchCandidates = () => {
    let filtered = candidates.filter(c => {
      // Name & Headline Match
      const q = searchQuery.toLowerCase();
      const matchText = !q || c.name.toLowerCase().includes(q) || (c.headline && c.headline.toLowerCase().includes(q));
      
      // Edu Match
      const matchEdu = searchEdu === 'Semua' || c.educationLevel === searchEdu;
      
      // Major Match
      const matchMajor = searchMajor === 'Semua' || c.major === searchMajor;
      
      // OVR Match
      const matchOvr = getCandidateOvr(c) >= searchMinOvr;

      return matchText && matchEdu && matchMajor && matchOvr;
    });

    return stealthSort(filtered);
  };

  const searchCandidates = getSearchCandidates();

  const COLUMNS: { id: KanbanStage; title: string; icon: any; color: string; border: string }[] = [
    { id: 'pending', title: 'Masuk', icon: Clock, color: 'text-gray-600 dark:text-gray-400 transition-colors duration-300 ease-in-out ', border: 'border-gray-200 dark:border-gray-700' },
    { id: 'evaluasi', title: 'Evaluasi AI', icon: Brain, color: 'text-indigo-400', border: 'border-indigo-800/50' },
    { id: 'wawancara', title: 'Wawancara', icon: UsersRound, color: 'text-indigo-500', border: 'border-amber-800/50' },
    { id: 'diterima', title: 'Diterima', icon: CheckCircle, color: 'text-emerald-400', border: 'border-emerald-800/50' }
  ];

  return (
    <div className="min-h-screen bg-[#060a14] text-gray-900 dark:text-white transition-colors duration-300 ease-in-out flex flex-col font-sans">
      {/* HEADER NAVBAR */}
      <nav className="border-b border-gray-200 dark:border-gray-700 bg-[#0a0f1d] px-6 flex items-center justify-between z-20 sticky top-0 shadow-md h-16">
        <div className="flex items-center gap-4">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center border border-indigo-400/30">
            <Building2 className="text-gray-900 dark:text-white transition-colors duration-300 ease-in-out w-4 h-4" />
          </div>
          <div className="hidden sm:block">
            <h1 className="text-sm font-bold font-display tracking-tight text-gray-900 dark:text-white transition-colors duration-300 ease-in-out leading-tight">
              {user.companyName || user.name}
            </h1>
            <p className="text-[10px] text-indigo-300 flex items-center gap-1 uppercase tracking-widest font-bold">
              HR Information System
            </p>
          </div>
        </div>
        
        {/* CENTER TABS */}
        <div className="hidden md:flex flex-1 justify-center">
          <div className="flex gap-1 h-16">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center gap-2 px-4 border-b-2 font-medium text-sm transition-colors ${activeTab === 'dashboard' ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-gray-600 dark:text-gray-400 transition-colors duration-300 ease-in-out hover:text-gray-900 dark:text-white transition-colors duration-300 ease-in-out '}`}
            >
              <LayoutDashboard className="w-4 h-4" /> Dashboard Perusahaan
            </button>
            <button
              onClick={() => setActiveTab('pencarian')}
              className={`flex items-center gap-2 px-4 border-b-2 font-medium text-sm transition-colors ${activeTab === 'pencarian' ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-gray-600 dark:text-gray-400 transition-colors duration-300 ease-in-out hover:text-gray-900 dark:text-white transition-colors duration-300 ease-in-out '}`}
            >
              <SearchIcon className="w-4 h-4" /> Pencarian Talenta
            </button>
            <button
              onClick={() => setActiveTab('lowongan')}
              className={`flex items-center gap-2 px-4 border-b-2 font-medium text-sm transition-colors ${activeTab === 'lowongan' ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-gray-600 dark:text-gray-400 transition-colors duration-300 ease-in-out hover:text-gray-900 dark:text-white transition-colors duration-300 ease-in-out '}`}
            >
              <ListChecks className="w-4 h-4" /> Manajemen Lowongan
            </button>
            <button
              onClick={() => setActiveTab('pipeline')}
              className={`flex items-center gap-2 px-4 border-b-2 font-medium text-sm transition-colors ${activeTab === 'pipeline' ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-gray-600 dark:text-gray-400 transition-colors duration-300 ease-in-out hover:text-gray-900 dark:text-white transition-colors duration-300 ease-in-out '}`}
            >
              <Kanban className="w-4 h-4" /> Pipeline Rekrutmen
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={onLogout}
            className="text-xs px-4 py-2 bg-white dark:bg-gray-800 transition-colors duration-300 ease-in-out border border-gray-200 dark:border-gray-700 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/30 text-gray-800 rounded-lg transition-colors flex items-center gap-2"
          >
            <LogOut className="w-3.5 h-3.5" />
            Keluar
          </button>
        </div>
      </nav>

      {/* MOBILE NAVBAR PADDING */}
      <div className="md:hidden flex overflow-x-auto bg-[#0a0f1d] border-b border-gray-200 dark:border-gray-700 p-2 gap-2">
         <button onClick={() => setActiveTab('dashboard')} className={`px-3 py-1.5 rounded-md text-xs whitespace-nowrap ${activeTab === 'dashboard' ? 'bg-indigo-500/20 text-indigo-400' : 'text-gray-600 dark:text-gray-400 transition-colors duration-300 ease-in-out '}`}>Dashboard</button>
         <button onClick={() => setActiveTab('pencarian')} className={`px-3 py-1.5 rounded-md text-xs whitespace-nowrap ${activeTab === 'pencarian' ? 'bg-indigo-500/20 text-indigo-400' : 'text-gray-600 dark:text-gray-400 transition-colors duration-300 ease-in-out '}`}>Pencarian</button>
         <button onClick={() => setActiveTab('lowongan')} className={`px-3 py-1.5 rounded-md text-xs whitespace-nowrap ${activeTab === 'lowongan' ? 'bg-indigo-500/20 text-indigo-400' : 'text-gray-600 dark:text-gray-400 transition-colors duration-300 ease-in-out '}`}>Lowongan</button>
         <button onClick={() => setActiveTab('pipeline')} className={`px-3 py-1.5 rounded-md text-xs whitespace-nowrap ${activeTab === 'pipeline' ? 'bg-indigo-500/20 text-indigo-400' : 'text-gray-600 dark:text-gray-400 transition-colors duration-300 ease-in-out '}`}>Pipeline</button>
      </div>

      {/* DASHBOARD CONTENT */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        
        {/* TAB 1: PENCARIAN TALENTA */}
        {activeTab === 'pencarian' && (
          <div className="absolute inset-0 flex flex-col md:flex-row overflow-hidden bg-[#060a14]">
            {/* Filter Sidebar */}
            <div className="w-full md:w-80 border-r border-gray-200 dark:border-gray-700 bg-[#0a0f1d] p-6 overflow-y-auto shrink-0">
              <div className="flex items-center gap-2 mb-6 text-indigo-400">
                <SlidersHorizontal className="w-5 h-5" />
                <h2 className="font-bold">Filter Talenta</h2>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="text-xs font-bold text-gray-500 dark:text-gray-400 transition-colors duration-300 ease-in-out uppercase tracking-wider mb-2 block">Cari Nama / Posisi</label>
                  <div className="relative">
                    <Search className="w-4 h-4 text-gray-500 dark:text-gray-400 transition-colors duration-300 ease-in-out absolute left-3 top-1/2 -translate-y-1/2" />
                    <input 
                      type="text" 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Contoh: UI UX, Budi..."
                      className="w-full bg-white dark:bg-gray-800 transition-colors duration-300 ease-in-out border border-gray-200 dark:border-gray-700 rounded-xl pl-9 pr-4 py-2.5 text-sm text-gray-900 dark:text-white transition-colors duration-300 ease-in-out focus:border-indigo-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-500 dark:text-gray-400 transition-colors duration-300 ease-in-out uppercase tracking-wider mb-2 block">Jenjang Pendidikan</label>
                  <select 
                    value={searchEdu}
                    onChange={(e) => setSearchEdu(e.target.value)}
                    className="w-full bg-white dark:bg-gray-800 transition-colors duration-300 ease-in-out border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm text-gray-900 dark:text-white transition-colors duration-300 ease-in-out focus:border-indigo-500 focus:outline-none"
                  >
                     <option value="Semua">Semua Jenjang</option>
                     <option value="SMA/SMK">SMA/SMK</option>
                     <option value="Mahasiswa Aktif">Mahasiswa Aktif</option>
                     <option value="Lulusan">Lulusan (S1/D3)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-500 dark:text-gray-400 transition-colors duration-300 ease-in-out uppercase tracking-wider mb-2 block">Jurusan / Bidang</label>
                  <select 
                    value={searchMajor}
                    onChange={(e) => setSearchMajor(e.target.value)}
                    className="w-full bg-white dark:bg-gray-800 transition-colors duration-300 ease-in-out border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm text-gray-900 dark:text-white transition-colors duration-300 ease-in-out focus:border-indigo-500 focus:outline-none"
                  >
                     <option value="Semua">Semua Bidang</option>
                     <option value="Teknik Informatika">Teknik Informatika</option>
                     <option value="Bisnis & Manajemen">Bisnis & Manajemen</option>
                     <option value="Sains & Teknologi">Sains & Teknologi</option>
                     <option value="Umum">Umum / Lainnya</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-500 dark:text-gray-400 transition-colors duration-300 ease-in-out uppercase tracking-wider mb-2 block flex justify-between">
                    <span>Minimum OVR Score</span>
                    <span className="text-indigo-400">{searchMinOvr}</span>
                  </label>
                  <input 
                    type="range" 
                    min="0" 
                    max="100" 
                    value={searchMinOvr}
                    onChange={(e) => setSearchMinOvr(parseInt(e.target.value))}
                    className="w-full accent-indigo-500"
                  />
                  <div className="flex justify-between text-[10px] text-gray-500 dark:text-gray-400 transition-colors duration-300 ease-in-out mt-1">
                    <span>0</span>
                    <span>100</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Results Area */}
            <div className="flex-1 overflow-y-auto p-6 md:p-8">
              <div className="mb-6 flex justify-between items-end">
                <div>
                  <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white transition-colors duration-300 ease-in-out mb-1">Hasil Pencarian</h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-300 ease-in-out ">Ditemukan {searchCandidates.length} kandidat yang sesuai (Diurutkan berdasarkan OVR algoritma teratas)</p>
                </div>
              </div>

              {loading ? (
                <div className="flex justify-center py-20"><div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div></div>
              ) : searchCandidates.length === 0 ? (
                <div className="bg-gray-100 dark:bg-gray-700 transition-colors duration-300 ease-in-out border border-gray-200 dark:border-gray-700 rounded-2xl p-10 text-center">
                  <Search className="w-12 h-12 text-gray-500 dark:text-gray-400 transition-colors duration-300 ease-in-out mx-auto mb-4" />
                  <p className="text-gray-800 font-medium">Tidak ada kandidat yang cocok dengan kriteria filter.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                  {searchCandidates.map(c => (
                    <div key={c.id} className="bg-white dark:bg-gray-800 transition-colors duration-300 ease-in-out border border-gray-200 dark:border-gray-700 rounded-2xl p-5 flex flex-col hover:border-indigo-500/40 transition-colors">
                      <div className="flex gap-4 items-start mb-4">
                        <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-slate-700 to-slate-600 flex items-center justify-center font-bold text-xl text-gray-900 dark:text-white transition-colors duration-300 ease-in-out shadow-inner shrink-0">
                          {c.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-lg text-gray-900 dark:text-white transition-colors duration-300 ease-in-out leading-tight mb-1">{c.name}</h3>
                          <p className="text-xs text-indigo-300 font-medium line-clamp-1">{c.headline || 'Active Pelamar'}</p>
                          <div className="flex items-center gap-3 mt-2 text-xs text-gray-600 dark:text-gray-400 transition-colors duration-300 ease-in-out ">
                             <span className="flex items-center gap-1"><GraduationCap className="w-3 h-3" /> {c.educationLevel}</span>
                             <span className="flex items-center gap-1"><Briefcase className="w-3 h-3" /> {c.major}</span>
                          </div>
                        </div>
                        <div className="shrink-0 bg-gray-50 dark:bg-gray-900 transition-colors duration-300 ease-in-out border border-gray-200 dark:border-gray-700 px-3 py-2 rounded-xl text-center">
                           <span className="block text-[10px] text-gray-500 dark:text-gray-400 transition-colors duration-300 ease-in-out font-bold uppercase">OVR Score</span>
                           <span className="block text-xl font-black text-indigo-400">{getCandidateOvr(c)}</span>
                        </div>
                      </div>
                      <div className="mt-auto pt-4 border-t border-gray-200 dark:border-gray-700/50 flex gap-2">
                        <button 
                          onClick={() => handleAIAnalysis(c)}
                          className="flex-1 bg-indigo-500 hover:bg-indigo-400 text-gray-900 dark:text-white transition-colors duration-300 ease-in-out font-medium text-sm py-2 rounded-xl transition-colors flex items-center justify-center gap-2"
                        >
                          <Brain className="w-4 h-4" />
                          Analisis AI
                        </button>
                        <button className="px-4 bg-white dark:bg-gray-800 transition-colors duration-300 ease-in-out hover:bg-white dark:bg-gray-800 transition-colors duration-300 ease-in-out text-gray-800 font-medium text-sm py-2 rounded-xl transition-colors text-center border border-gray-300">
                          Simpan
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 4: PIPELINE REKRUTMEN (Original Kanban View) */}
        {activeTab === 'pipeline' && (
          <div className="absolute inset-0 flex flex-col overflow-hidden bg-[#060a14]">
            {/* SUBHEADER: Job Postings & Filters */}
            <div className="bg-[#0a0f1d] border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shrink-0">
              <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto hide-scrollbar">
                {jobs.map(job => (
                  <button
                    key={job.id}
                    onClick={() => setActiveJobId(job.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                      activeJobId === job.id 
                        ? 'bg-indigo-500 text-gray-900 dark:text-white transition-colors duration-300 ease-in-out shadow-lg shadow-indigo-500/20 border border-indigo-400' 
                        : 'bg-white dark:bg-gray-800 transition-colors duration-300 ease-in-out text-gray-600 dark:text-gray-400 transition-colors duration-300 ease-in-out border border-gray-200 dark:border-gray-700 hover:bg-white dark:bg-gray-800 transition-colors duration-300 ease-in-out hover:text-gray-900 dark:text-white transition-colors duration-300 ease-in-out '
                    }`}
                  >
                    {job.type === 'intern' ? <GraduationCap className="w-4 h-4" /> : <Briefcase className="w-4 h-4" />}
                    {job.title}
                  </button>
                ))}
                <button
                  onClick={() => setShowJobModal(true)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-white dark:bg-gray-800 transition-colors duration-300 ease-in-out border border-dashed border-gray-300 text-gray-600 dark:text-gray-400 transition-colors duration-300 ease-in-out hover:text-gray-900 dark:text-white transition-colors duration-300 ease-in-out hover:border-gray-200 dark:border-gray-700 transition-colors whitespace-nowrap"
                >
                  <Plus className="w-4 h-4" /> Lowongan
                </button>
              </div>

              <div className="flex items-center bg-white dark:bg-gray-800 transition-colors duration-300 ease-in-out border border-gray-200 dark:border-gray-700 p-1 rounded-xl shrink-0">
                <button
                  onClick={() => setCandFilter('all')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${candFilter === 'all' ? 'bg-white dark:bg-gray-800 transition-colors duration-300 ease-in-out text-gray-900 dark:text-white transition-colors duration-300 ease-in-out ' : 'text-gray-500 dark:text-gray-400 transition-colors duration-300 ease-in-out hover:text-gray-800'}`}
                >
                  Semua
                </button>
                <button
                  onClick={() => setCandFilter('fulltime')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${candFilter === 'fulltime' ? 'bg-white dark:bg-gray-800 transition-colors duration-300 ease-in-out text-gray-900 dark:text-white transition-colors duration-300 ease-in-out ' : 'text-gray-500 dark:text-gray-400 transition-colors duration-300 ease-in-out hover:text-gray-800'}`}
                >
                  Pelamar Kerja
                </button>
                <button
                  onClick={() => setCandFilter('intern')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${candFilter === 'intern' ? 'bg-white dark:bg-gray-800 transition-colors duration-300 ease-in-out text-gray-900 dark:text-white transition-colors duration-300 ease-in-out ' : 'text-gray-500 dark:text-gray-400 transition-colors duration-300 ease-in-out hover:text-gray-800'}`}
                >
                  Anak Magang
                </button>
              </div>
            </div>

            {/* KANBAN BOARD */}
            <div className="flex-1 overflow-x-auto p-6">
              {loading ? (
                <div className="h-full flex items-center justify-center">
                  <div className="w-10 h-10 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
                </div>
              ) : (
                <div className="flex gap-6 h-full items-start min-w-[1024px]">
                  {COLUMNS.map(col => {
                    const columnCandidates = sortedPipelineCandidates.filter(c => getStage(c.id) === col.id);
                    const Icon = col.icon;
                    
                    return (
                      <div 
                        key={col.id} 
                        className={`flex-1 flex flex-col bg-gray-50 dark:bg-gray-900 transition-colors duration-300 ease-in-out border ${col.border} rounded-2xl overflow-hidden h-full max-h-full`}
                        onDragOver={onDragOver}
                        onDrop={(e) => onDrop(e, col.id)}
                      >
                        <div className={`p-4 border-b ${col.border} bg-white dark:bg-gray-800 transition-colors duration-300 ease-in-out /80 backdrop-blur-sm flex items-center justify-between sticky top-0`}>
                          <div className="flex items-center gap-2">
                            <Icon className={`w-4 h-4 ${col.color}`} />
                            <h3 className="font-bold text-gray-900 dark:text-white transition-colors duration-300 ease-in-out text-sm">{col.title}</h3>
                          </div>
                          <span className="bg-white dark:bg-gray-800 transition-colors duration-300 ease-in-out text-gray-800 text-xs px-2 py-0.5 rounded-full font-medium">
                            {columnCandidates.length}
                          </span>
                        </div>

                        <div className="flex-1 p-3 overflow-y-auto space-y-3 pb-8 custom-scrollbar">
                          {columnCandidates.map(c => (
                            <div 
                              key={c.id} 
                              draggable
                              onDragStart={(e) => onDragStart(e, c.id)}
                              className="bg-white dark:bg-gray-800 transition-colors duration-300 ease-in-out /80 hover:bg-white dark:bg-gray-800 transition-colors duration-300 ease-in-out border border-gray-300/80 hover:border-indigo-500/50 rounded-xl p-4 cursor-grab active:cursor-grabbing transition-all group shadow-sm shadow-black/20"
                            >
                              <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-slate-700 to-slate-600 flex items-center justify-center font-bold text-gray-900 dark:text-white transition-colors duration-300 ease-in-out shadow-inner">
                                    {c.name.charAt(0).toUpperCase()}
                                  </div>
                                  <div>
                                    <h4 className="font-bold text-sm text-gray-900 dark:text-white transition-colors duration-300 ease-in-out leading-none mb-1">{c.name}</h4>
                                    <p className="text-[11px] text-gray-600 dark:text-gray-400 transition-colors duration-300 ease-in-out line-clamp-1">{c.headline || c.major || 'Umum'}</p>
                                  </div>
                                </div>
                                <div className="bg-white dark:bg-gray-800 transition-colors duration-300 ease-in-out border border-gray-300 px-2 py-1 rounded text-[10px] font-bold text-gray-800">
                                  OVR {getCandidateOvr(c)}
                                </div>
                              </div>

                              <div className="flex flex-wrap items-center gap-2 mb-3">
                                <span className="text-[10px] px-2 py-1 rounded-md bg-white dark:bg-gray-800 transition-colors duration-300 ease-in-out text-gray-600 dark:text-gray-400 transition-colors duration-300 ease-in-out border border-gray-200 dark:border-gray-700 flex items-center gap-1">
                                  <GraduationCap className="w-3 h-3" /> {c.educationLevel || '-'}
                                </span>
                              </div>

                              <button 
                                onClick={() => handleAIAnalysis(c)}
                                className="w-full flex items-center justify-center gap-2 py-2 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 text-xs font-semibold rounded-lg border border-indigo-500/20 transition-colors"
                              >
                                <Brain className="w-3.5 h-3.5" />
                                Analisis Kecocokan AI
                              </button>
                            </div>
                          ))}
                          
                          {columnCandidates.length === 0 && (
                             <div className="h-24 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl flex items-center justify-center">
                               <span className="text-xs text-gray-500 dark:text-gray-400 transition-colors duration-300 ease-in-out font-medium">Kosong</span>
                             </div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2 & 3 Placeholders */}
        {(activeTab === 'dashboard' || activeTab === 'lowongan') && (
           <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#060a14] p-6 text-center">
              <Building2 className="w-16 h-16 text-gray-800 mb-4" />
              <h2 className="text-xl font-bold text-gray-900 dark:text-white transition-colors duration-300 ease-in-out mb-2">Modul Sedang Dalam Pengembangan</h2>
              <p className="text-gray-600 dark:text-gray-400 transition-colors duration-300 ease-in-out max-w-md">Silakan gunakan "Pencarian Talenta" untuk mencari kandidat, atau "Pipeline Rekrutmen" untuk memonitor hiring proses Anda.</p>
              <button 
                onClick={() => setActiveTab('pipeline')}
                className="mt-6 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-gray-900 dark:text-white transition-colors duration-300 ease-in-out font-medium rounded-xl transition-colors"
              >
                Ke Pipeline Rekrutmen
              </button>
           </div>
        )}

      </main>

      {/* NEW JOB MODAL */}
      {showJobModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white dark:bg-gray-800 transition-colors duration-300 ease-in-out backdrop-blur-sm p-4">
          <div className="bg-[#0f172a] border border-gray-200 dark:border-gray-700 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white transition-colors duration-300 ease-in-out ">Buat Lowongan Baru</h2>
              <button onClick={() => setShowJobModal(false)} className="text-gray-600 dark:text-gray-400 transition-colors duration-300 ease-in-out hover:text-gray-900 dark:text-white transition-colors duration-300 ease-in-out p-1">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreateJob} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-2">Judul Lowongan / Posisi</label>
                <input
                  autoFocus
                  type="text"
                  required
                  value={newJobTitle}
                  onChange={(e) => setNewJobTitle(e.target.value)}
                  className="w-full bg-white dark:bg-gray-800 transition-colors duration-300 ease-in-out border border-gray-300 rounded-xl px-4 py-3 text-gray-900 dark:text-white transition-colors duration-300 ease-in-out placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-sm"
                  placeholder="Contoh: Digital Marketing Reguler"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-2">Target Pelamar</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setNewJobType('fulltime')}
                    className={`py-3 px-4 rounded-xl border text-sm font-medium flex items-center justify-center gap-2 transition-all ${newJobType === 'fulltime' ? 'bg-indigo-500/20 border-indigo-500 text-indigo-300' : 'bg-white dark:bg-gray-800 transition-colors duration-300 ease-in-out border-gray-300 text-gray-600 dark:text-gray-400 transition-colors duration-300 ease-in-out hover:bg-white dark:bg-gray-800 transition-colors duration-300 ease-in-out '}`}
                  >
                    <Briefcase className="w-4 h-4" /> Karyawan
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewJobType('intern')}
                    className={`py-3 px-4 rounded-xl border text-sm font-medium flex items-center justify-center gap-2 transition-all ${newJobType === 'intern' ? 'bg-indigo-500/20 border-indigo-500 text-indigo-300' : 'bg-white dark:bg-gray-800 transition-colors duration-300 ease-in-out border-gray-300 text-gray-600 dark:text-gray-400 transition-colors duration-300 ease-in-out hover:bg-white dark:bg-gray-800 transition-colors duration-300 ease-in-out '}`}
                  >
                    <GraduationCap className="w-4 h-4" /> Magang
                  </button>
                </div>
              </div>
              <div className="pt-2">
                <button type="submit" className="w-full py-3 bg-indigo-500 hover:bg-indigo-400 text-gray-900 dark:text-white transition-colors duration-300 ease-in-out rounded-xl font-bold text-sm transition-all active:scale-[0.98]">
                  Buat Lowongan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* AI ANALYSIS MODAL */}
      {selectedAiCand && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white dark:bg-gray-800 transition-colors duration-300 ease-in-out backdrop-blur-sm p-4">
          <div className="bg-[#0a0f1d] border border-indigo-500/30 rounded-2xl w-full max-w-lg shadow-[0_0_40px_rgba(99,102,241,0.15)] overflow-hidden animate-in fade-in zoom-in-95 duration-300">
            <div className="bg-gradient-to-r from-indigo-900/40 to-[#0a0f1d] border-b border-gray-200 dark:border-gray-700 p-6 flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2 text-indigo-400 mb-2">
                  <Brain className="w-5 h-5" />
                  <span className="text-xs font-bold uppercase tracking-wider font-display">AI Matchmaker</span>
                </div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white transition-colors duration-300 ease-in-out leading-tight">Analisis: {selectedAiCand.name}</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-300 ease-in-out mt-1">Untuk posisi: <strong className="text-gray-800">{activeJob?.title || '-'}</strong></p>
              </div>
              <button onClick={() => setSelectedAiCand(null)} className="text-gray-600 dark:text-gray-400 transition-colors duration-300 ease-in-out hover:text-gray-900 dark:text-white transition-colors duration-300 ease-in-out bg-gray-100 dark:bg-gray-700 transition-colors duration-300 ease-in-out hover:bg-white dark:bg-gray-800 transition-colors duration-300 ease-in-out rounded-full p-2 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6">
              {aiLoading[selectedAiCand.id] ? (
                <div className="flex flex-col items-center justify-center py-10 space-y-4">
                  <div className="w-12 h-12 relative">
                    <div className="absolute inset-0 border-4 border-indigo-500/20 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-indigo-400 rounded-full border-t-transparent animate-spin"></div>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-300 ease-in-out animate-pulse">AI sedang menganalisis profil kandidat...</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="bg-indigo-500/5 border border-indigo-500/20 rounded-xl p-5 leading-relaxed text-sm text-gray-800">
                    {aiAnalysis[selectedAiCand.id]}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 pt-4 border-t border-gray-200 dark:border-gray-700/50">
                    <div className="bg-white dark:bg-gray-800 transition-colors duration-300 ease-in-out rounded-lg p-3 border border-gray-200 dark:border-gray-700 text-center">
                      <p className="text-xs text-gray-500 dark:text-gray-400 transition-colors duration-300 ease-in-out mb-1">Overall Rating</p>
                      <p className="font-display font-black text-xl text-gray-900 dark:text-white transition-colors duration-300 ease-in-out ">{getCandidateOvr(selectedAiCand)}</p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 transition-colors duration-300 ease-in-out rounded-lg p-3 border border-gray-200 dark:border-gray-700 text-center">
                      <p className="text-xs text-gray-500 dark:text-gray-400 transition-colors duration-300 ease-in-out mb-1">Rekomendasi</p>
                      <p className="font-display font-black text-xl text-emerald-400">
                        {getCandidateOvr(selectedAiCand) > 65 ? 'Tinggi' : 'Konvensional'}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-6">
                <button 
                  onClick={() => setSelectedAiCand(null)} 
                  className="w-full py-3 bg-white dark:bg-gray-800 transition-colors duration-300 ease-in-out hover:bg-white dark:bg-gray-800 transition-colors duration-300 ease-in-out text-gray-900 dark:text-white transition-colors duration-300 ease-in-out rounded-xl font-medium text-sm transition-colors"
                >
                  Tutup Analisis
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
