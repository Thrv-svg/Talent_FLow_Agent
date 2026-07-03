  /**
   * @license
   * SPDX-License-Identifier: Apache-2.0
   */

  import React, { useState, useEffect } from 'react';
  import { motion } from 'motion/react';
  import apiClient from '../apiClient';
  import { 
    Home, Users, CreditCard, Layers, Clock, Sliders, LogOut, Sparkles, ChevronLeft, ChevronRight, Menu, HelpCircle, ChevronDown
  } from 'lucide-react';

  import AdminOverview from './AdminOverview';
  import AdminCandidates from './AdminCandidates';
  import AdminPayments from './AdminPayments';
  import AdminQuizzes from './AdminQuizzes';
  import AdminAnalytics from './AdminAnalytics';
  import AdminSettings from './AdminSettings';

  interface AdminDashboardProps {
    adminUser: any;
    onLogout: () => void;
  }

  // Initial mock data seeds for seamless execution
  const INITIAL_PAYMENTS = [];

  const INITIAL_QUIZZES: any[] = [];
  const INITIAL_QUESTIONS: any[] = [];
  const INITIAL_DISC: any[] = [];

  const LOCALIZATION = {
    id: {
      dashboard: "Dashboard",
      candidates: "Pendaftar",
      payments: "Verifikasi Pembayaran",
      quizzes: "Kuis & Asesmen",
      analytics: "Laporan Psikogram",
      settings: "Settings",
      secConsole: "Secure Console",
      navHeaderMain: "Utama",
      navHeaderExams: "Manajemen Ujian",
      navHeaderReports: "Analitik Asesmen",
      navHeaderSystem: "Sistem",
      logout: "Keluar (Logout)",
      logoutConfirm: "Keluar Sesi",
      sidebarClose: "Tutup Sidebar",
      adminTitle: "Admin TalentFlow",
      subTitle: "Super Admin"
    },
    en: {
      dashboard: "Dashboard",
      candidates: "Applicants",
      payments: "Verify Payments",
      quizzes: "Quizzes & Exams",
      analytics: "Analytics & Reports",
      settings: "Settings",
      secConsole: "Secure Console",
      navHeaderMain: "Main View",
      navHeaderExams: "Exam Center",
      navHeaderReports: "Analytics Desk",
      navHeaderSystem: "System Option",
      logout: "Exit (Logout)",
      logoutConfirm: "End Sesi",
      sidebarClose: "Collapse Sidebar",
      adminTitle: "Admin TalentFlow",
      subTitle: "Super Admin"
    }
  };

  export default function AdminDashboard({ adminUser, onLogout }: AdminDashboardProps) {
    // Navigation active state
    const [activeTab, setActiveTab] = useState<'overview' | 'candidates' | 'pembayaran' | 'exams' | 'analytics' | 'settings'>('overview');
    
    // Theme & Language states (Cached in LocalStorage)
    const [lang, setLang] = useState<'id' | 'en'>(() => {
      return (localStorage.getItem('app_language') as 'id' | 'en') || 'id';
    });
    const [theme, setTheme] = useState<'dark' | 'light'>(() => {
      return (localStorage.getItem('theme') as 'dark' | 'light') || 'dark';
    });

    // Collapsible sidebar state
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

    // Smooth CSS indicator tracking
    const navRef = React.useRef<HTMLElement>(null);
    const [indicatorStyle, setIndicatorStyle] = useState({ top: 0, height: 0, opacity: 0 });

    // Core candidate database fetched from server
    const [candidates, setCandidates] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [btnLoading, setBtnLoading] = useState<string | null>(null);

    // Selected candidate object passed to details view
    const [selectedCandidate, setSelectedCandidate] = useState<any | null>(null);

    // Persistent States backup
    const [payments, setPayments] = useState<any[]>([]);

    const [quizzes, setQuizzes] = useState<any[]>(() => {
      const local = localStorage.getItem('tf_quizzes');
      return local ? JSON.parse(local) : INITIAL_QUIZZES;
    });

    const [questions, setQuestions] = useState<any[]>(() => {
      const local = localStorage.getItem('tf_questions');
      return local ? JSON.parse(local) : INITIAL_QUESTIONS;
    });

    const [discTetrads, setDiscTetrads] = useState<any[]>(() => {
      const local = localStorage.getItem('tf_disc_tetrads');
      return local ? JSON.parse(local) : INITIAL_DISC;
    });

    const t = LOCALIZATION[lang];

    // Load candidate details dynamically
    const fetchCandidates = async () => {
      setLoading(true);
      try {
        const response = await apiClient.get('/api/admin/candidates');
        const data = response.data;
        if (data.success && data.candidates) {
          setCandidates(data.candidates);
          if (data.candidates.length > 0 && !selectedCandidate) {
            setSelectedCandidate(data.candidates[0]);
          }
        }
      } catch (err) {
        console.error('Error fetching candidates:', err);
      } finally {
        setLoading(false);
      }
    };

    const fetchPayments = async () => {
      try {
        const response = await apiClient.get('/api/admin/pending-payments');
        const data = response.data;
        if (data.success && data.data) {
          setPayments(data.data);
        }
      } catch (err) {
        console.error('Error fetching payments:', err);
      }
    };

    useEffect(() => {
      fetchCandidates();
      fetchPayments();
      
      const interval = setInterval(() => {
        fetchCandidates();
        fetchPayments();
      }, 3000);
      
      return () => clearInterval(interval);
    }, []);

    // Save payments, quizzes, questions, disc to localStorage
    useEffect(() => {
      localStorage.setItem('tf_quizzes', JSON.stringify(quizzes));
    }, [quizzes]);

    useEffect(() => {
      localStorage.setItem('tf_questions', JSON.stringify(questions));
    }, [questions]);

    useEffect(() => {
      localStorage.setItem('tf_disc_tetrads', JSON.stringify(discTetrads));
    }, [discTetrads]);

    // Toggle candidate Premium state
    // Handlers for candidates
    const handleDeleteCandidate = async (candidateId: string) => {
      try {
        const res = await apiClient.delete(`/api/admin/candidates/${candidateId}`);
        if (res.data.success) {
          setCandidates(p => p.filter(c => c.id !== candidateId));
          if (selectedCandidate?.id === candidateId) {
            setSelectedCandidate(null);
          }
        } else {
          alert(res.data.message);
        }
      } catch (e: any) {
        alert('Error: ' + e.message);
      }
    };

    const handleResetCandidate = async (candidateId: string) => {
      try {
        const res = await apiClient.post(`/api/admin/reset-candidate/${candidateId}`);
        if (res.data.success) {
          // Refetch candidates to get fresh data
          const fresh = await apiClient.get('/api/admin/candidates');
          if (fresh.data.success) {
            setCandidates(fresh.data.candidates);
            if (selectedCandidate?.id === candidateId) {
              const updatedCand = fresh.data.candidates.find((c: any) => c.id === candidateId);
              setSelectedCandidate(updatedCand || null);
            }
          }
        } else {
          alert(res.data.message);
        }
      } catch (e: any) {
        alert('Error: ' + e.message);
      }
    };

    const handleTogglePremium = async (candidate: any) => {
      const targetEmail = candidate.email;
      const nextPremium = !candidate.isPremium;
      setBtnLoading(targetEmail);
      try {
        const response = await apiClient.post('/api/admin/set-premium', { email: targetEmail, isPremium: nextPremium });
        const data = response.data;
        if (data.success) {
          await fetchCandidates();
          // Update selection reference dynamically
          setSelectedCandidate((prev: any) => {
            if (prev && prev.email === targetEmail) {
              const prevOvr = prev.stats?.ovr || 0;
              return {
                ...prev,
                isPremium: nextPremium,
                stats: {
                  ...prev.stats,
                  ovr: nextPremium ? Math.min(99, prevOvr + 5) : Math.max(50, prevOvr - 5)
                }
              };
            }
            return prev;
          });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setBtnLoading(null);
      }
    };

    // State update handlers for Exams
    const handleAddQuiz = (payload: any) => setQuizzes(p => [...p, payload]);
    const handleDeleteQuiz = (id: string) => {
      if (confirm(lang === 'id' ? 'Hapus jadwal kuis ini secara permanen?' : 'Delete this assessment permanently?')) {
        setQuizzes(p => p.filter(q => q.id !== id));
      }
    };
    const handleUpdateQuiz = (updated: any) => setQuizzes(p => p.map(q => q.id === updated.id ? updated : q));

    // State update handlers for Questions
    const handleAddQuestion = (payload: any) => setQuestions(p => [...p, payload]);
    const handleDeleteQuestion = (id: string) => setQuestions(p => p.filter(q => q.id !== id));

    // DISC tetrad updates
    const handleAddDiscTetrad = (payload: any) => setDiscTetrads(p => [...p, payload]);
    const handleDeleteDiscTetrad = (id: string) => setDiscTetrads(p => p.filter(t => t.id !== id));

    const handleLanguageChange = (language: 'id' | 'en') => {
      setLang(language);
      localStorage.setItem('app_language', language);
    };

    const handleToggleTheme = () => {
      const nextTheme = theme === 'dark' ? 'light' : 'dark';
      setTheme(nextTheme);
      localStorage.setItem('theme', nextTheme);
    };

    useEffect(() => {
      // Small delay to allow DOM to render buttons before querying offsetTop
      const timeout = setTimeout(() => {
        if (navRef.current) {
          const activeEl = navRef.current.querySelector('button[data-active="true"]') as HTMLElement;
          if (activeEl) {
            setIndicatorStyle({
              top: activeEl.offsetTop,
              height: activeEl.offsetHeight,
              opacity: 1
            });
          }
        }
      }, 50);
      return () => clearTimeout(timeout);
    }, [activeTab, sidebarCollapsed]);

    const pendingPaymentsCount = payments.filter(p => p.status === 'Menunggu').length;

    const NavItem = ({ id, icon: Icon, label, badge, customClass = '' }: { id: typeof activeTab, icon: any, label: string, badge?: number, customClass?: string }) => {
      const isActive = activeTab === id;
      
      return (
        <button
          data-active={isActive}
          onClick={() => setActiveTab(id)}
          className={`w-full flex items-center gap-3 py-2.5 px-3 rounded-xl text-xs font-semibold cursor-pointer relative select-none active:scale-95 transition-all duration-300 ease-out hover:shadow-[0_0_8px_rgba(129,140,248,0.2)] hover:-translate-x-1 hover:opacity-80 ${customClass} ${
            isActive 
              ? 'bg-indigo-600/10 text-indigo-400 shadow-[inset_0_0_0_1px_rgba(129,140,248,0.1),0_0_12px_rgba(129,140,248,0.4)] scale-[1.02] hover:opacity-100 hover:translate-x-0' 
              : theme === 'light' ? 'text-gray-500 dark:text-gray-400 transition-colors duration-300 ease-in-out hover:bg-gray-100 dark:bg-gray-700 transition-colors duration-300 ease-in-out hover:text-gray-800 scale-100' : 'text-gray-500 dark:text-gray-400 transition-colors duration-300 ease-in-out hover:bg-white dark:bg-gray-800 transition-colors duration-300 ease-in-out hover:text-gray-900 dark:text-white transition-colors duration-300 ease-in-out scale-100'
          }`}
          style={{ 
            transition: 'all 0.3s ease-out',
            textShadow: isActive ? '0 0 10px rgba(129, 140, 248, 0.6)' : 'none'
          }}
        >
          <Icon 
            className={`w-4 h-4 shrink-0 transition-all duration-300 ease-out`}
            style={{
              filter: isActive ? 'drop-shadow(0 0 6px rgba(129, 140, 248, 0.8))' : 'drop-shadow(0 0 0px rgba(129, 140, 248, 0))'
            }}
          />
          {!sidebarCollapsed && <span className="animate-in fade-in duration-300">{label}</span>}
          
          {badge !== undefined && badge > 0 && (
            <span className="absolute right-3 bg-rose-500 text-gray-900 dark:text-white transition-colors duration-300 ease-in-out font-mono text-[9px] font-black rounded-full w-4.5 h-4.5 flex items-center justify-center">
              {badge}
            </span>
          )}
        </button>
      );
    };

    return (
      <div className={`min-h-screen flex text-gray-900 dark:text-white transition-colors duration-300 ease-in-out font-sans transition-all duration-300 ${
        theme === 'light' ? 'bg-white dark:bg-gray-800 transition-colors duration-300 ease-in-out text-gray-800' : 'bg-gray-50 dark:bg-gray-900 transition-colors duration-300 ease-in-out text-gray-900 dark:text-white transition-colors duration-300 ease-in-out '
      }`}>
        
        {/* 1. COLLAPSIBLE BILINGUAL SIDEBAR COMPONENT */}
        <aside className={`border-r shrink-0 transition-all duration-300 flex flex-col justify-between select-none relative ${
          theme === 'light' ? 'bg-white dark:bg-gray-800 transition-colors duration-300 ease-in-out border-gray-200 dark:border-gray-700' : 'bg-[#090d1a] border-gray-200 dark:border-gray-700/80'
        } ${
          sidebarCollapsed ? 'w-20' : 'w-64'
        }`}>
          
          <div>
            {/* Logo Brand Header */}
            <div className={`h-[72px] px-5 flex items-center justify-between border-b shrink-0 ${
              theme === 'light' ? 'border-gray-200 dark:border-gray-700' : 'border-gray-200 dark:border-gray-700'
            }`}>
              {!sidebarCollapsed && (
                <div className="flex items-center gap-2.5 text-left animate-in fade-in duration-400">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-500 to-teal-400 p-0.5 flex items-center justify-center font-bold text-gray-900 dark:text-white transition-colors duration-300 ease-in-out font-display">
                    TF
                  </div>
                  <div>
                    <strong className={`font-display font-black text-sm tracking-tight block ${
                      theme === 'light' ? 'text-gray-800' : 'text-gray-900 dark:text-white transition-colors duration-300 ease-in-out '
                    }`}>
                      Talent<span className="text-indigo-455">Flow</span>
                    </strong>
                    <span className="text-[8.5px] text-gray-500 dark:text-gray-400 transition-colors duration-300 ease-in-out uppercase font-black block tracking-widest leading-none mt-0.5">Secure Hub</span>
                  </div>
                </div>
              )}

              {/* Sidebar toggle icon button */}
              <button 
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className={`p-1.5 rounded-lg border cursor-pointer hover:bg-white dark:bg-gray-800 transition-colors duration-300 ease-in-out ${
                  theme === 'light' ? 'border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 transition-colors duration-300 ease-in-out ' : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 transition-colors duration-300 ease-in-out '
                } ${sidebarCollapsed ? 'mx-auto' : ''}`}
                title={t.sidebarClose}
              >
                {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
              </button>
            </div>

            {/* Nav list mappings */}
            <nav ref={navRef} className="p-3 space-y-4 text-left relative sidebar-links-container">
              
              {/* The absolute sliding indicator */}
              <div 
                id="sidebar-active-indicator"
                className="absolute left-0 w-1 bg-indigo-500 rounded-r-md z-10"
                style={{ 
                  top: `${indicatorStyle.top}px`, 
                  height: `${indicatorStyle.height}px`, 
                  opacity: indicatorStyle.opacity,
                  transition: 'all 0.3s ease-out'
                }}
              />

              {/* Section 1: Utama */}
              <div className="space-y-1 block">
                {!sidebarCollapsed && (
                  <span className="text-[9.5px] uppercase tracking-wider text-gray-500 dark:text-gray-400 transition-colors duration-300 ease-in-out font-extrabold px-3 block">
                    {t.navHeaderMain}
                  </span>
                )}
                <NavItem id="overview" icon={Home} label={t.dashboard} />
                <NavItem id="candidates" icon={Users} label={t.candidates} />
                <NavItem id="pembayaran" icon={CreditCard} label={t.payments} badge={pendingPaymentsCount} />
              </div>

              {/* Section 2: Management */}
              <div className="space-y-1 block">
                {!sidebarCollapsed && (
                  <span className="text-[9.5px] uppercase tracking-wider text-gray-500 dark:text-gray-400 transition-colors duration-300 ease-in-out font-extrabold px-3 block pt-2">
                    {t.navHeaderExams}
                  </span>
                )}
                <NavItem id="exams" icon={Layers} label={t.quizzes} />
              </div>

              {/* Section 3: Analytics */}
              <div className="space-y-1 block">
                {!sidebarCollapsed && (
                  <span className="text-[9.5px] uppercase tracking-wider text-gray-500 dark:text-gray-400 transition-colors duration-300 ease-in-out font-extrabold px-3 block pt-2">
                    {t.navHeaderReports}
                  </span>
                )}
                <NavItem id="analytics" icon={Clock} label={t.analytics} />
              </div>

              {/* Section 4: System */}
              <div className="space-y-1 block">
                {!sidebarCollapsed && (
                  <span className="text-[9.5px] uppercase tracking-wider text-gray-500 dark:text-gray-400 transition-colors duration-300 ease-in-out font-extrabold px-3 block pt-2">
                    {t.navHeaderSystem}
                  </span>
                )}
                <NavItem id="settings" icon={Sliders} label={t.settings} />
              </div>

            </nav>
          </div>

          {/* Sidebar Footer User Details with click dropdown */}
          <div className={`p-3 relative ${
            theme === 'light' ? 'border-t border-gray-200 dark:border-gray-700' : 'border-t border-gray-200 dark:border-gray-700'
          }`}>
            <div 
              onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              className="flex items-center gap-3 p-2 rounded-2xl hover:bg-white dark:bg-gray-800 transition-colors duration-300 ease-in-out cursor-pointer transition select-none relative"
            >
              <div className="w-9 h-9 rounded-full bg-indigo-600 border border-indigo-400 flex items-center justify-center font-black text-xs text-gray-900 dark:text-white transition-colors duration-300 ease-in-out ">
                AD
              </div>
              
              {!sidebarCollapsed && (
                <div className="text-left flex-1 animate-in fade-in duration-300">
                  <span className={`block font-bold text-xs truncate max-w-[110px] ${theme === 'light' ? 'text-gray-800' : 'text-gray-900 dark:text-white transition-colors duration-300 ease-in-out '}`}>{t.adminTitle}</span>
                  <span className="text-[9.5px] text-gray-500 dark:text-gray-400 transition-colors duration-300 ease-in-out block">{t.subTitle}</span>
                </div>
              )}

              {!sidebarCollapsed && <ChevronDown className="w-4 h-4 text-gray-500 dark:text-gray-400 transition-colors duration-300 ease-in-out shrink-0" />}
            </div>

            {/* Profile Dropdown menus */}
            {profileDropdownOpen && (
              <div className={`absolute bottom-16 inset-x-3 rounded-2xl border p-2 text-left shadow-xl ${
                theme === 'light' ? 'bg-white dark:bg-gray-800 transition-colors duration-300 ease-in-out border-gray-200 dark:border-gray-700' : 'bg-[#0f1322] border-gray-200 dark:border-gray-700'
              }`}>
                <button
                  onClick={onLogout}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-left text-xs font-bold text-red-400 hover:bg-red-500/10 cursor-pointer transition select-none"
                >
                  <LogOut className="w-4 h-4" />
                  <span>{t.logout}</span>
                </button>
              </div>
            )}

          </div>

        </aside>

        {/* 2. MAIN ACTIVE WINDOW CONTENT WORKSPACE */}
        <main className="flex-1 min-w-0 flex flex-col h-screen overflow-y-auto">
          
          {/* Recruiter header bar */}
          <header className={`sticky top-0 z-30 h-[72px] flex flex-col justify-center px-6 border-b backdrop-blur-md ${
            theme === 'light' ? 'bg-white dark:bg-gray-800 transition-colors duration-300 ease-in-out /80 border-gray-200 dark:border-gray-700' : 'bg-gray-50 dark:bg-gray-900 transition-colors duration-300 ease-in-out /80 border-gray-200 dark:border-gray-700'
          }`}>
            <div className="max-w-7xl mx-auto w-full flex justify-between items-center gap-4">
              <div className="text-left">
                <span className="text-[10px] text-indigo-405 font-bold uppercase tracking-wider font-mono">
                  {t.secConsole}
                </span>
                <h1 className={`text-base font-black tracking-tight ${theme === 'light' ? 'text-gray-800' : 'text-gray-900 dark:text-white transition-colors duration-300 ease-in-out '}`}>
                  TalentFlow <span className="text-indigo-455">Admin Workspace</span>
                </h1>
              </div>

              {/* Quick stats on top */}
              <div className="flex gap-4 items-center">
                <span className="text-[10px] uppercase font-bold text-gray-500 dark:text-gray-400 transition-colors duration-300 ease-in-out hidden md:inline-block">
                  PT TalentFlow Indonesia • Recruiter Portal
                </span>
              </div>
            </div>
          </header>

          {/* Content viewer workspace container */}
          <div className="p-6 max-w-7xl mx-auto w-full flex-1">
            {activeTab === 'overview' && (
              <AdminOverview
                candidates={candidates}
                payments={payments}
                quizzes={quizzes}
                lang={lang}
                onSwitchTab={setActiveTab}
                onSelectCandidate={setSelectedCandidate}
                onRefresh={fetchCandidates}
              />
            )}

            {activeTab === 'candidates' && (
              <AdminCandidates
                candidates={candidates}
                lang={lang}
                selectedCandidate={selectedCandidate}
                onSelectCandidate={setSelectedCandidate}
                onTogglePremium={handleTogglePremium}
                onDeleteCandidate={handleDeleteCandidate}
                onResetCandidate={handleResetCandidate}
                btnLoading={btnLoading}
              />
            )}

            {activeTab === 'pembayaran' && (
              <AdminPayments
                payments={payments}
                lang={lang}
                onVerify={() => fetchPayments()}
              />
            )}

            {activeTab === 'exams' && (
              <AdminQuizzes
                quizzes={quizzes}
                questions={questions}
                discTetrads={discTetrads}
                lang={lang}
                onAddQuiz={handleAddQuiz}
                onDeleteQuiz={handleDeleteQuiz}
                onUpdateQuiz={handleUpdateQuiz}
                onAddQuestion={handleAddQuestion}
                onDeleteQuestion={handleDeleteQuestion}
                onAddDiscTetrad={handleAddDiscTetrad}
                onDeleteDiscTetrad={handleDeleteDiscTetrad}
              />
            )}

            {activeTab === 'analytics' && (
              <AdminAnalytics
                candidates={candidates}
                lang={lang}
              />
            )}

            {activeTab === 'settings' && (
              <AdminSettings
                adminUser={adminUser}
                lang={lang}
                theme={theme}
                onToggleTheme={handleToggleTheme}
                onSetLanguage={handleLanguageChange}
              />
            )}
          </div>

        </main>

      </div>
    );
  }
