/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import apiClient from './apiClient';
import { UserProfile, PsychologicalResult, EducationLevel, UserMajor, TalentStats } from './types';
import TalentCard from './components/TalentCard';
import ProfileView from './components/ProfileView';
import KraepelinTest from './components/KraepelinTest';
import DISCTest from './components/DISCTest';
import PAPITest from './components/PAPITest';
import AcademicTest from './components/AcademicTest';
import InternshipsView from './components/InternshipsView';
import HRDSimulator from './components/HRDSimulator';
import LandingPage from './components/LandingPage';
import LoginView from './components/LoginView';
import RegisterView from './components/RegisterView';
import CompanyRegisterView from './components/CompanyRegisterView';
import AdminDashboard from './components/AdminDashboard';
import LeaderboardView from './components/LeaderboardView';
import PremiumPurchaseModal from './components/PremiumPurchaseModal';
import { LampSwitch } from './components/LampSwitch';

import ProtectedRoute from './components/ProtectedRoute';

import { motion, AnimatePresence } from 'motion/react';

// ... other imports
import { 
  Home, 
  BookOpen, 
  UserCheck, 
  Briefcase, 
  Eye, 
  Sparkles, 
  Zap, 
  ShieldAlert, 
  Compass, 
  HelpCircle, 
  Award, 
  CheckCircle, 
  Brain, 
  Smartphone,
  CheckCircle2,
  ListRestart,
  RefreshCw,
  Sliders,
  Send,
  Edit2,
  Crown,
  Trophy,
  X,
  Settings,
  Camera,
  Film,
  Menu,
  LogOut,
  Sun,
  Moon
} from 'lucide-react';

const DEFAULT_PROFILE: UserProfile = {
  id: 'talent-user-id',
  name: 'wahahasha',
  email: 'wahahasha@gmail.com',
  whatsapp: '08129838232',
  headline: 'Active Mahasiswa | Aspiring Tech Talent | Eager to learn Web Development',
  educationLevel: 'Mahasiswa Aktif',
  major: 'Teknik Informatika',
  isPremium: false,
  avatar: '',
  stats: {
    ovr: 50, // Starts at standard baseline (50)
    acd: 0,
    spd: 0,
    con: 0,
    str: 0,
    com: 0,
    ldr: 0,
    dtl: 0
  },
  cosmetics: {
    theme: 'classic',
    bannerUrl: '',
    avatarFrame: false,
    glowEffect: false
  },
  consistencyPoints: 0,
  checkInStreak: 0
};

import ActivityFeed from './components/ActivityFeed';
import DailyCheckInWidget from './components/DailyCheckInWidget';
import SkillsAnalytics from './components/SkillsAnalytics';
import CareerRoadmap from './components/CareerRoadmap';
import RoleSelectionView from './components/RoleSelectionView';
import CompanyDashboard from './components/CompanyDashboard';
import OnboardingSetupView from './components/OnboardingSetupView';
import ProfileEditModal from './components/ProfileEditModal';
import Toast, { ToastType } from './components/Toast';
import MoviesView from './components/MoviesView';

export default function App() {
  const [toast, setToast] = useState<{ message: string, type: ToastType } | null>(null);
  const [topToast, setTopToast] = useState<{ message: string, type: ToastType } | null>(null);

  const showToast = (message: string, type: ToastType = 'info') => {
    setToast({ message, type });
  };

  const showTopToast = (message: string, type: ToastType = 'info') => {
    setTopToast({ message, type });
  };

  // Authentication State Screen routing switcher
  const [authState, setAuthState] = useState<'landing' | 'login' | 'role_selection' | 'register' | 'authenticated' | 'company_dashboard' | 'onboarding' | 'loading'>('loading');

  const [selectedRole, setSelectedRole] = useState<'pelamar' | 'hr'>('pelamar');

  // Global Profile State
  const [profile, setProfile] = useState<UserProfile>(DEFAULT_PROFILE);

  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    return (localStorage.getItem('talentflow_theme') as 'dark' | 'light') || 'dark';
  });

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.body.classList.add('bg-gray-900');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('bg-gray-900');
    }
    localStorage.setItem('talentflow_theme', theme);
  }, [theme]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile((prev: UserProfile) => ({ ...prev, avatar: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Psychological Raw Scores
  const [psychResults, setPsychResults] = useState<PsychologicalResult>({});

  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showProfileEditModal, setShowProfileEditModal] = useState(false);
  const [hasPendingPayment, setHasPendingPayment] = useState(false);

  // Recorded Academic Quizzes completed
  const [quizScoresLog, setQuizScoresLog] = useState<{ id: string; score: number }[]>([]);

  // Active Tab: 'home' | 'academic' | 'psychology' | 'internship' | 'hrd' | 'leaderboard' | 'career'
  const [activeTab, setActiveTab] = useState<'home' | 'academic' | 'psychology' | 'internship' | 'hrd' | 'leaderboard' | 'career' | 'movies' | 'profile'>('home');
  
  // Psychological Active Sub Test Selection
  const [activeSubPsych, setActiveSubPsych] = useState<'none' | 'kraepelin' | 'disc' | 'papi'>('none');

  const [showMoreMenu, setShowMoreMenu] = useState(false);

  // AI Interpret State
  const [isInterpreting, setIsInterpreting] = useState(false);
  const [aiReport, setAiReport] = useState<any>(null);
  const [loadingStep, setLoadingStep] = useState('');
  
  const [isDataSyncedFromServer, setIsDataSyncedFromServer] = useState(false);

  // Handle successful authentication integration
  const handleLoginSuccess = (userData: any, savedState?: any, isNewUser?: boolean) => {
    let finalProfile = userData;
    if (savedState) {
      if (savedState.profile) {
          const mergedProfile = { ...savedState.profile, role: userData.role };
          setProfile(mergedProfile);
          finalProfile = mergedProfile;
      }
      if (savedState.psychResults) setPsychResults(savedState.psychResults);
      if (savedState.quizScoresLog) setQuizScoresLog(savedState.quizScoresLog);
      if (savedState.aiReport) setAiReport(savedState.aiReport);
    } else {
      setProfile(userData);
    }
    
    if (!finalProfile.isOnboarded) {
      setAuthState('onboarding');
    } else if (userData.role === 'hr' || userData.role === 'perusahaan') {
      setAuthState('company_dashboard');
    } else {
      setAuthState('authenticated');
    }
  };

  // Handle logging out and state clearance
  const handleLogout = () => {
    localStorage.removeItem('talentflow_token');
    localStorage.removeItem('talentflow_user');
    localStorage.removeItem('talentflow_user_profile');
    localStorage.removeItem('talentflow_psych_scores');
    localStorage.removeItem('talentflow_quiz_scores');
    localStorage.removeItem('talentflow_ai_report');
    setProfile(DEFAULT_PROFILE);
    setPsychResults({});
    setQuizScoresLog([]);
    setAiReport(null);
    setAuthState('landing');
    setIsDataSyncedFromServer(false);
  };

  // Local storage save triggers


  // Dynamic OVR recalculation based on Academic (40%), Kraepelin speed (20%), DISC consistency (20%), and PAPI leadership (20%)
  useEffect(() => {
    if (!profile.email) return;

    // 1. Academic grades (40%)
    const hasAcademic = quizScoresLog && quizScoresLog.length > 0;
    const acdVal = hasAcademic 
      ? Math.round(quizScoresLog.reduce((acc, curr) => acc + (curr.score || 0), 0) / quizScoresLog.length)
      : 0;

    // 2. Kraepelin speed (20%)
    const krSpeed = psychResults?.kraepelin?.speed || 0;
    const spdVal = krSpeed > 0 ? Math.min(99, Math.round(krSpeed)) : 0;

    // 3. DISC consistency (20%) - Using Conscientiousness (C) as Consistency
    const discC = psychResults?.disc?.scores?.C || 0;
    const discConVal = psychResults?.disc ? Math.min(99, Math.max(0, Math.round((discC / 12) * 99))) : 0;

    // 4. PAPI leadership (20%) - Using Leadership (L) trait
    const papiL = psychResults?.papi?.scores?.L || 0;
    const papiLdrVal = psychResults?.papi ? Math.min(99, Math.max(0, Math.round((papiL / 9) * 99))) : 0;

    const computedOvr = Math.round(
      (acdVal * 0.40) + 
      (spdVal * 0.20) + 
      (discConVal * 0.20) + 
      (papiLdrVal * 0.20)
    );
    const consistencyBonus = Math.min(5, Math.floor((profile.consistencyPoints || 0) / 40));
    const finalOvr = Math.min(99, Math.max(0, computedOvr) + consistencyBonus);

    if (
      profile.stats.ovr !== finalOvr ||
      profile.stats.acd !== acdVal ||
      profile.stats.spd !== spdVal ||
      profile.stats.ldr !== papiLdrVal
    ) {
      setProfile(prev => ({
        ...prev,
        stats: {
          ...prev.stats,
          ovr: finalOvr,
          acd: acdVal,
          spd: spdVal,
          ldr: papiLdrVal
        }
      }));
    }
  }, [quizScoresLog, psychResults, profile.email, profile.consistencyPoints]);

  // Fetch initial profile from MongoDB using the JWT token on app load
  useEffect(() => {
    const token = localStorage.getItem('talentflow_token');
    if (!token) {
      setAuthState('landing');
      return;
    }

    apiClient.get('/api/user/me')
      .then(res => res.data)
      .then(data => {
        if (data.success && data.data) {
          const p = data.data.profile;
          setProfile(p);
          setPsychResults(data.data.psychResults || {});
          setQuizScoresLog(data.data.quizScoresLog || []);
          setAiReport(data.data.aiReport || null);
          setHasPendingPayment(!!data.data.hasPendingPayment);

          if (!p.isOnboarded) {
            setAuthState('onboarding');
          } else if (p.role === 'hr' || p.role === 'perusahaan') {
            setAuthState('company_dashboard');
          } else {
            setAuthState('authenticated');
          }
        } else {
          handleLogout();
        }
        setIsDataSyncedFromServer(true);
      })
      .catch(err => {
        console.error('Error fetching MongoDB profile on mount:', err);
        handleLogout();
        setIsDataSyncedFromServer(true);
      });
  }, []);

  useEffect(() => {
    if (isDataSyncedFromServer && profile && authState !== 'landing' && authState !== 'onboarding' && authState !== 'login' && authState !== 'register' && authState !== 'role_selection') {
      const needsOnboarding = !profile.isOnboarded ||
           (profile.role === 'pelamar' && (!profile.educationLevel || !profile.major));
      if (needsOnboarding) {
        setAuthState('onboarding');
      }
    }
  }, [profile, isDataSyncedFromServer, authState]);

  // Unified automatic backend sync effect to save applicant status
  useEffect(() => {
    if (!isDataSyncedFromServer) return; // Prevent overwriting server with stale local storage
    if (authState !== 'authenticated' || !profile.email || profile.role === 'admin' || profile.role === 'hr') return;

    // Skip if default profile still loaded before sync
    if (profile.email === 'wahahasha@gmail.com' && !localStorage.getItem('talentflow_token')) return;

    const syncPayload = {
      profile,
      aiReport
    };

    apiClient.post('/api/user/save-state', syncPayload).catch((err) => {
      console.error('Error auto-syncing state with server:', err);
    });
  }, [profile, aiReport, authState, isDataSyncedFromServer]);

  // Real-time notification SSE listener
  useEffect(() => {
    if (authState === 'authenticated') {
      const token = localStorage.getItem('talentflow_token');
      if (!token) return;

      const eventSource = new EventSource(`/api/notifications/stream?token=${token}`);

      eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === 'status_update') {
            showToast(data.message, 'success');
          }
        } catch (err) {
          console.error('Error parsing SSE message', err);
        }
      };

      eventSource.onerror = (err) => {
        console.error('SSE Error', err);
        eventSource.close();
      };

      return () => {
        eventSource.close();
      };
    }
  }, [authState]);

  const handleUpdateProfile = (updated: Partial<UserProfile>) => {
    setProfile(prev => ({ ...prev, ...updated }));
    showToast('Profil berhasil diperbarui', 'success');
  };

  const handleDailyCheckIn = () => {
    const today = new Date().toISOString().split('T')[0];
    if (profile.lastCheckInDate === today) {
      showToast('Anda sudah check-in hari ini!', 'info');
      return;
    }
    
    setProfile(prev => {
      const isConsecutive = prev.lastCheckInDate && 
        (new Date(today).getTime() - new Date(prev.lastCheckInDate).getTime() <= 2 * 24 * 60 * 60 * 1000);
      
      const newStreak = isConsecutive ? (prev.checkInStreak || 0) + 1 : 1;
      const pointsGained = 10 + (newStreak % 5 === 0 ? 50 : 0); // Bonus point every 5 days
      
      return {
        ...prev,
        lastCheckInDate: today,
        checkInStreak: newStreak,
        consistencyPoints: (prev.consistencyPoints || 0) + pointsGained
      };
    });
    
    showToast('Check-in berhasil! +10 Consistency Points', 'success');
  };

  const handleUpdateCosmetics = (updated: Partial<UserProfile['cosmetics']>) => {
    setProfile((prev) => ({
      ...prev,
      cosmetics: { ...prev.cosmetics, ...updated }
    }));
  };

  const setPremiumState = (isPrem: boolean) => {
    setProfile((prev) => ({
      ...prev,
      isPremium: isPrem,
      cosmetics: {
        ...prev.cosmetics,
        theme: isPrem ? 'gold' : 'classic',
        avatarFrame: isPrem,
        glowEffect: isPrem
      }
    }));
  };

  const handleUpdateHeadline = (text: string) => {
    setProfile((prev) => ({ ...prev, headline: text }));
  };

  const fetchFreshData = async () => {
    try {
      const res = await apiClient.get('/api/user/me');
      if (res.data.success) {
        setPsychResults(res.data.data.psychResults || {});
        setQuizScoresLog(res.data.data.quizScoresLog || []);
        setHasPendingPayment(!!res.data.data.hasPendingPayment);
      }
    } catch (e) {
      console.error('Failed to fetch fresh data', e);
    }
  };

  const handleCompleteKraepelin = async (hasil: { speed: number; accuracy: number; stability: number; grafikData: number[] }) => {
    try {
      const res = await apiClient.post('/api/user/submit-kraepelin', hasil);
      if (res.data.success) {
        const freshData = await apiClient.get('/api/user/me');
        if (freshData.data.success) {
          setPsychResults(freshData.data.data.psychResults || {});
          setProfile(freshData.data.data.profile);
        }
        setActiveSubPsych('none');
        showToast('Kraepelin Telah Rampung! Skor awal Kecepatan (SPD) & Konsistensi (CON) Anda telah direkam.', 'success');
      }
    } catch (e) {
      showToast('Gagal mengirim hasil tes.', 'error');
    }
  };

  const handleCompleteDISC = async (answers: any) => {
    try {
      const res = await apiClient.post('/api/user/submit-disc', { jawaban: answers });
      if (res.data.success) {
        const freshData = await apiClient.get('/api/user/me');
        if (freshData.data.success) {
          setPsychResults(freshData.data.data.psychResults || {});
          setProfile(freshData.data.data.profile);
        }
        setActiveSubPsych('none');
        showToast('Kuis DISC Telah Selesai! Indikator kecakapan Sinergi (COM) direkam.', 'success');
      }
    } catch (e) {
      showToast('Gagal mengirim hasil tes.', 'error');
    }
  };

  const handleCompletePAPI = async (answers: any) => {
    try {
      const res = await apiClient.post('/api/user/submit-papi', { jawaban: answers });
      if (res.data.success) {
        const freshData = await apiClient.get('/api/user/me');
        if (freshData.data.success) {
          setPsychResults(freshData.data.data.psychResults || {});
          setProfile(freshData.data.data.profile);
        }
        setActiveSubPsych('none');
        showToast('Sesi PAPI Kostik 90 Soal Selesai! Indikator Leadership (LDR) & Kerapian (DTL) direkam.', 'success');
      }
    } catch (e) {
      showToast('Gagal mengirim hasil tes.', 'error');
    }
  };

  const handleCompleteAcademicQuiz = async (quizId: string, jawaban: Record<number, number>) => {
    try {
      const res = await apiClient.post('/api/user/submit-academic', { quizId, jawaban });
      if (res.data.success) {
        const freshData = await apiClient.get('/api/user/me');
        if (freshData.data.success) {
          setQuizScoresLog(freshData.data.data.quizScoresLog || []);
          setProfile(freshData.data.data.profile);
        }
        showToast('Kuis akademik berhasil diselesaikan!', 'success');
      }
    } catch (e) {
      showToast('Gagal mengirim hasil kuis.', 'error');
    }
  };

  // FETCH AI EVALUATION VIA /api/gemini/interpret
  const requestAIInterpretation = async () => {
    setIsInterpreting(true);
    setLoadingStep('Melakukan pre-processing data profil talenta...');
    
    try {
      // Mock delayed loading captions to make it look exceptionally smart and reassuring!
      setTimeout(() => setLoadingStep('Memproses aritmatika konvergen Kraepelin...'), 1200);
      setTimeout(() => setLoadingStep('Memetakan gaya komunikasi sosiodinamika DISC...'), 2400);
      setTimeout(() => setLoadingStep('Mengintegrasikan 20 dimensi karakter PAPI Kostik...'), 3600);
      
      await new Promise((resolve) => setTimeout(resolve, 4500));

      const payload = {
        profile,
        academicResults: quizScoresLog,
        psychologicalScores: psychResults
      };

      const res = await apiClient.post('/api/gemini/interpret', payload);
      const data = res.data;
      if (data.success && data.data) {
        setAiReport(data.data);
      } else {
        throw new Error('API return unsuccessful status');
      }

    } catch (e) {
      console.error(e);
      showToast('Error saat mengubung ke AI Server. Platform akan mengaktifkan Algorithmic Engine untuk menghitung skor Anda.', 'error');
    } finally {
      setIsInterpreting(false);
      setLoadingStep('');
    }
  };

  if (authState === 'landing') {
    return (
      <LandingPage
        onLoginClick={() => setAuthState('login')}
        onRegisterClick={() => setAuthState('role_selection')}
      />
    );
  }

  if (authState === 'login') {
    return <LoginView onLoginSuccess={handleLoginSuccess} onSwitchToRegister={() => setAuthState('role_selection')} onBack={() => setAuthState('landing')} />;
  }

  if (authState === 'role_selection') {
    return (
      <RoleSelectionView 
        onSelectRole={(role) => {
          setSelectedRole(role);
          setAuthState('register');
        }} 
        onBackToLogin={() => setAuthState('login')} 
      />
    );
  }

  if (authState === 'register') {
    if (selectedRole === 'hr') {
      return (
        <CompanyRegisterView
          onRegisterSuccess={() => setAuthState('login')}
          onSwitchToLogin={() => setAuthState('login')}
          onBack={() => setAuthState('landing')}
        />
      );
    }
    return (
      <RegisterView 
        selectedRole={selectedRole}
        onRegisterSuccess={() => setAuthState('login')} 
        onSwitchToLogin={() => setAuthState('login')} 
        onBack={() => setAuthState('landing')}
      />
    );
  }

  if (authState === 'onboarding') {
    return (
      <OnboardingSetupView 
        initialProfile={profile} 
        onComplete={(updatedProfile) => {
          const freshProfile = { ...profile, ...updatedProfile, isOnboarded: true };
          setProfile(freshProfile);
          localStorage.setItem('talentflow_user_profile', JSON.stringify(freshProfile));
          // Re-evaluate auth routing logic manually here
          if (freshProfile.role === 'hr' || freshProfile.role === 'perusahaan') {
            setAuthState('company_dashboard');
          } else {
            setAuthState('authenticated');
          }
          showToast('Profil berhasil diperbarui.', 'success');
        }} 
      />
    );
  }

  if (authState === 'company_dashboard') {
    return (
      <ProtectedRoute role={profile.role} allowedRoles={['hr', 'perusahaan', 'admin']}>
        <CompanyDashboard 
          user={profile} 
          onLogout={handleLogout} 
          onBackToApp={() => setAuthState('authenticated')} 
        />
      </ProtectedRoute>
    );
  }

  if (authState === 'authenticated' && profile.role === 'admin') {
    return (
      <ProtectedRoute role={profile.role} allowedRoles={['admin']}>
        <AdminDashboard adminUser={profile} onLogout={handleLogout} />
      </ProtectedRoute>
    );
  }

  const hasAcademic = quizScoresLog && quizScoresLog.length > 0;
  const hasKraepelin = psychResults?.kraepelin?.speed ? psychResults.kraepelin.speed > 0 : false;
  const hasDisc = psychResults?.disc?.scores ? Object.values(psychResults.disc.scores).some(val => Number(val) > 0) : false;
  const hasPapi = psychResults?.papi?.scores ? Object.values(psychResults.papi.scores).some(val => Number(val) > 0) : false;
  const allTestsDone = hasAcademic && hasKraepelin && hasDisc && hasPapi;
  const completedTestsCount = [hasAcademic, hasKraepelin, hasDisc, hasPapi].filter(Boolean).length;
  const testProgressPercent = (completedTestsCount / 4) * 100;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300 ease-in-out dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-300 ease-in-out dark:text-white flex flex-col font-sans transition-colors duration-300 ease-in-out ">
      
      <LampSwitch theme={theme} onToggle={() => setTheme(theme === 'light' ? 'dark' : 'light')} />

      {/* LINKEDIN STYLE TOP HEADER BAR */}
      <header className="sticky top-0 z-40 bg-white dark:bg-gray-800 transition-colors duration-300 ease-in-out w-full flex flex-col shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="py-3.5 w-full">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 px-4 sm:px-6">
            
            {/* Logo brand */}
            <div className="flex items-center gap-2.5 shrink-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-teal-500 to-emerald-400 p-0.5 flex items-center justify-center shadow-lg shadow-teal-500/10">
              <span className="font-display font-black text-gray-900 dark:text-white transition-colors duration-300 ease-in-out text-base tracking-tighter">TF</span>
            </div>
            <div>
              <span className="font-display font-extrabold text-xl text-gray-900 dark:text-white transition-colors duration-300 ease-in-out tracking-tight flex items-center gap-1.5">
                Talent<span className="text-teal-400">Flow</span>
              </span>
              <span className="text-[9px] text-gray-500 dark:text-gray-400 transition-colors duration-300 ease-in-out block uppercase tracking-widest leading-none font-bold">PT TalentFlow Indonesia</span>
            </div>
          </div>

          {/* Nav icon bars (LinkedIn style) */}
          <div className="flex-1 md:flex hidden"></div>

          {/* User badge + premium swift switch */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <button 
              onClick={() => setShowProfileEditModal(true)}
              className="flex items-center gap-2 bg-white dark:bg-gray-800 transition-colors duration-300 ease-in-out border border-gray-200 dark:border-gray-700 hover:border-gray-300 hover:bg-white dark:bg-gray-800 transition-colors duration-300 ease-in-out p-1.5 rounded-xl text-left hidden sm:flex cursor-pointer transition-colors"
            >
              <div className="w-7 h-7 rounded-full bg-teal-500/10 border border-teal-500/25 flex items-center justify-center font-bold text-xs text-teal-400 overflow-hidden shrink-0">
                {profile.avatar ? (
                  <img src={profile.avatar} alt="Avatar" className="w-full h-full object-cover keep-colors" />
                ) : (
                  profile.name.slice(0, 2).toUpperCase()
                )}
              </div>
              <div className="text-[10px] pr-2">
                <span className="block font-bold text-gray-900 dark:text-white transition-colors duration-300 ease-in-out leading-none">{profile.name}</span>
                <span className="text-gray-500 dark:text-gray-400 transition-colors duration-300 ease-in-out text-[9px] mt-0.5 block">{profile.isPremium ? '👑 Premium' : 'Free Member'}</span>
              </div>
              <Settings className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400 transition-colors duration-300 ease-in-out mr-2" />
            </button>

            {/* Status Keanggotaan & Toggle Buy Premium */}
            {!profile.isPremium ? (
              hasPendingPayment ? (
                <span className="px-3 py-1.5 rounded-lg font-bold text-[10px] uppercase bg-white dark:bg-gray-800 transition-colors duration-300 ease-in-out text-indigo-600 border border-amber-500/30">
                  Menunggu Konfirmasi
                </span>
              ) : (
                <button
                  onClick={() => setShowPaymentModal(true)}
                  className="bg-indigo-600 text-gray-900 dark:text-white transition-colors duration-300 ease-in-out hover:bg-indigo-700 text-gray-900 dark:text-white transition-colors duration-300 ease-in-out px-3 py-1.5 rounded-lg font-bold text-[10px] uppercase cursor-pointer tracking-wider transition-all shadow-[0_0_12px_rgba(245,158,11,0.3)]"
                >
                  Upgrade Premium
                </button>
              )
            ) : (
              <span className="px-3 py-1.5 rounded-lg font-bold text-[10px] uppercase bg-indigo-600 text-gray-900 dark:text-white transition-colors duration-300 ease-in-out /10 text-indigo-600 border border-amber-500/30 flex items-center gap-1.5 hidden sm:flex">
                <Crown className="w-3 h-3 text-indigo-600" />
                Premium
              </span>
            )}

            {/* Edit Profile trigger control PC */}
            <button
              onClick={() => setShowProfileEditModal(true)}
              className="bg-white dark:bg-gray-800 transition-colors duration-300 ease-in-out hover:bg-gray-100 dark:bg-gray-700 transition-colors duration-300 ease-in-out border border-gray-300 text-gray-900 dark:text-white transition-colors duration-300 ease-in-out px-3 py-1.5 rounded-lg flex items-center gap-1.5 font-semibold text-[10px] uppercase cursor-pointer tracking-wide select-none transition-all hidden sm:flex"
            >
              <Settings className="w-3.5 h-3.5" />
              Edit Profil
            </button>

            {/* Logout trigger control */}
            <button
              onClick={handleLogout}
              className="bg-red-500/10 hover:bg-red-550/15 border border-red-500/25 hover:border-red-550/40 text-red-400 px-3 py-1.5 rounded-lg font-semibold text-[10px] uppercase cursor-pointer tracking-wide select-none transition-all hidden sm:block"
            >
              Keluar
            </button>

          </div>

        </div>
        </div>

        {/* MOBILE UPPER SUB-NAVIGATION */}
        <nav className="md:hidden sticky bottom-0 z-50 w-full flex items-center justify-around py-3 text-xs text-gray-500 dark:text-gray-400 transition-colors duration-300 ease-in-out px-2 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 transition-colors duration-300 ease-in-out shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
        <button
          onClick={() => { setActiveTab('home'); setActiveSubPsych('none'); setShowMoreMenu(false); }}
          className={`flex flex-col items-center gap-1 cursor-pointer shrink-0 min-w-[4rem] py-1 ${activeTab === 'home' ? 'text-indigo-600 font-medium' : 'hover:text-gray-900 dark:text-white transition-colors duration-300 ease-in-out '}`}
        >
          <Home className="w-5 h-5" />
          <span>Beranda</span>
        </button>
        <button
          onClick={() => { setActiveTab('academic'); setActiveSubPsych('none'); setShowMoreMenu(false); }}
          className={`flex flex-col items-center gap-1 cursor-pointer shrink-0 min-w-[4rem] py-1 ${activeTab === 'academic' ? 'text-indigo-600 font-medium' : 'hover:text-gray-900 dark:text-white transition-colors duration-300 ease-in-out '}`}
        >
          <BookOpen className="w-5 h-5" />
          <span>Akademik</span>
        </button>
        <button
          onClick={() => { setActiveTab('psychology'); setActiveSubPsych('none'); setShowMoreMenu(false); }}
          className={`flex flex-col items-center gap-1 cursor-pointer shrink-0 min-w-[4rem] py-1 ${activeTab === 'psychology' ? 'text-indigo-600 font-medium' : 'hover:text-gray-900 dark:text-white transition-colors duration-300 ease-in-out '}`}
        >
          <Brain className="w-5 h-5" />
          <span>Psikologi</span>
        </button>
        <button
          onClick={() => { setActiveTab('internship'); setActiveSubPsych('none'); setShowMoreMenu(false); }}
          className={`flex flex-col items-center gap-1 cursor-pointer shrink-0 min-w-[4rem] py-1 ${activeTab === 'internship' ? 'text-indigo-600 font-medium' : 'hover:text-gray-900 dark:text-white transition-colors duration-300 ease-in-out '}`}
        >
          <Briefcase className="w-5 h-5" />
          <span>Lowongan</span>
        </button>
        
        <div className="shrink-0 flex flex-col items-center gap-1 min-w-[4rem]">
          <button
            onClick={() => setShowMoreMenu(!showMoreMenu)}
            className={`flex flex-col items-center justify-center gap-1 cursor-pointer w-full py-1 ${['leaderboard', 'career', 'movies', 'hrd'].includes(activeTab) || showMoreMenu ? 'text-teal-400' : 'text-gray-500 dark:text-gray-400 transition-colors duration-300 ease-in-out hover:text-gray-900 dark:text-white transition-colors duration-300 ease-in-out '}`}
          >
            <Menu className="w-5 h-5" />
            <span>Lainnya</span>
          </button>
        </div>
            {/* MOBILE POPUP MENU (LMS STYLE) */}
            <AnimatePresence>
              {showMoreMenu && (
                <>
                  {/* Backdrop */}
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setShowMoreMenu(false)}
                    className="fixed inset-0 bg-gray-50 dark:bg-gray-900 transition-colors duration-300 ease-in-out z-[60]"
                  />
                  {/* Menu */}
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.15, ease: "easeOut" }}
                    className="absolute top-full right-2 mt-2 w-64 bg-white dark:bg-gray-800 transition-colors duration-300 ease-in-out rounded-2xl shadow-2xl overflow-hidden py-1 z-[70] flex flex-col border border-gray-200 dark:border-gray-700"
                  >
                    <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex items-center gap-3 bg-gray-50 dark:bg-gray-900 transition-colors duration-300 ease-in-out mb-1">
                      <div className="w-9 h-9 rounded-full bg-teal-500/10 flex items-center justify-center font-bold text-sm text-teal-400 shrink-0 overflow-hidden border border-teal-500/20">
                        {profile.avatar ? (
                          <img src={profile.avatar} alt="Avatar" className="w-full h-full object-cover keep-colors" />
                        ) : (
                          profile.name.slice(0, 2).toUpperCase()
                        )}
                      </div>
                      <div className="col-span-1 overflow-hidden h-full">
                        <span className="block font-bold text-gray-900 dark:text-white transition-colors duration-300 ease-in-out text-sm truncate">{profile.name}</span>
                        <span className="block text-gray-600 dark:text-gray-400 transition-colors duration-300 ease-in-out text-[10px] truncate">{profile.email}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => { setShowProfileEditModal(true); setShowMoreMenu(false); }}
                      className="flex items-center gap-3 px-4 py-2.5 hover:bg-white dark:bg-gray-800 transition-colors duration-300 ease-in-out transition-colors text-gray-900 dark:text-white transition-colors duration-300 ease-in-out text-sm text-left w-full"
                    >
                      <Settings className="w-4 h-4 text-gray-600 dark:text-gray-400 transition-colors duration-300 ease-in-out " />
                      Edit Profil
                    </button>

                    <button
                      onClick={() => { setActiveTab('leaderboard'); setShowMoreMenu(false); }}
                      className={`flex items-center gap-3 px-4 py-2.5 transition-colors w-full text-left ${activeTab === 'leaderboard' ? 'bg-teal-500/10 text-teal-400 font-semibold' : 'text-gray-900 dark:text-white transition-colors duration-300 ease-in-out hover:bg-white dark:bg-gray-800 transition-colors duration-300 ease-in-out '}`}
                    >
                      <Trophy className={`w-4 h-4 ${activeTab === 'leaderboard' ? 'text-teal-400' : 'text-gray-600 dark:text-gray-400 transition-colors duration-300 ease-in-out '}`} />
                      Klasemen
                    </button>

                    <button
                      onClick={() => { setActiveTab('career'); setShowMoreMenu(false); }}
                      className={`flex items-center gap-3 px-4 py-2.5 transition-colors w-full text-left ${activeTab === 'career' ? 'bg-teal-500/10 text-teal-400 font-semibold' : 'text-gray-900 dark:text-white transition-colors duration-300 ease-in-out hover:bg-white dark:bg-gray-800 transition-colors duration-300 ease-in-out '}`}
                    >
                      <Compass className={`w-4 h-4 ${activeTab === 'career' ? 'text-teal-400' : 'text-gray-600 dark:text-gray-400 transition-colors duration-300 ease-in-out '}`} />
                      Roadmap
                    </button>

                    <button
                      onClick={() => { setActiveTab('movies'); setShowMoreMenu(false); }}
                      className={`flex items-center gap-3 px-4 py-2.5 transition-colors w-full text-left ${activeTab === 'movies' ? 'bg-teal-500/10 text-teal-400 font-semibold' : 'text-gray-900 dark:text-white transition-colors duration-300 ease-in-out hover:bg-white dark:bg-gray-800 transition-colors duration-300 ease-in-out '}`}
                    >
                      <Film className={`w-4 h-4 ${activeTab === 'movies' ? 'text-teal-400' : 'text-gray-600 dark:text-gray-400 transition-colors duration-300 ease-in-out '}`} />
                      Minat Film
                    </button>
                    
                    {profile.role === 'hr' && (
                      <button
                        onClick={() => { setActiveTab('hrd'); setShowMoreMenu(false); }}
                        className={`flex items-center gap-3 px-4 py-2.5 transition-colors w-full text-left ${activeTab === 'hrd' ? 'bg-teal-500/10 text-teal-400 font-semibold' : 'text-gray-900 dark:text-white transition-colors duration-300 ease-in-out hover:bg-white dark:bg-gray-800 transition-colors duration-300 ease-in-out '}`}
                      >
                        <Eye className={`w-4 h-4 ${activeTab === 'hrd' ? 'text-teal-400' : 'text-gray-600 dark:text-gray-400 transition-colors duration-300 ease-in-out '}`} />
                        Monitor HRD
                      </button>
                    )}

                    <div className="h-px bg-white dark:bg-gray-800 transition-colors duration-300 ease-in-out my-1 mx-4" />

                    <div className="px-4 py-2">
                       <button
                         onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                         className="flex items-center justify-between w-full p-1 bg-gray-50 dark:bg-gray-900 transition-colors duration-300 ease-in-out rounded-full border border-gray-200 dark:border-gray-700 outline-none"
                       >
                         <div className={`p-1.5 rounded-full transition-all flex items-center gap-2 px-3 ${theme === 'dark' ? 'text-gray-500 dark:text-gray-400 transition-colors duration-300 ease-in-out hover:text-gray-900 dark:text-white transition-colors duration-300 ease-in-out ' : 'bg-white dark:bg-gray-800 transition-colors duration-300 ease-in-out text-indigo-500'}`}>
                           <Sun className="w-3.5 h-3.5" />
                           {theme === 'light' && <span className="text-[10px] font-bold">Terang</span>}
                         </div>
                         <div className={`p-1.5 rounded-full transition-all flex items-center gap-2 px-3 ${theme === 'dark' ? 'bg-white dark:bg-gray-800 transition-colors duration-300 ease-in-out text-teal-400' : 'text-gray-500 dark:text-gray-400 transition-colors duration-300 ease-in-out hover:text-gray-900 dark:text-white transition-colors duration-300 ease-in-out '}`}>
                           {theme === 'dark' && <span className="text-[10px] font-bold">Gelap</span>}
                           <Moon className="w-3.5 h-3.5" />
                         </div>
                       </button>
                    </div>

                    <div className="h-px bg-white dark:bg-gray-800 transition-colors duration-300 ease-in-out my-1 mx-4" />

                    <button
                      onClick={() => { handleLogout(); setShowMoreMenu(false); }}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-red-500/10 transition-colors text-red-500 hover:text-red-400 text-sm text-left w-full rounded-b-xl"
                    >
                      <LogOut className="w-4 h-4" />
                      Keluar
                    </button>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
        </nav>
      </header>

      {/* MAIN CONTAINER WORKSPACE */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 md:py-8">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          
          {/* ========================================================
              LEFT COLUMN: SIDEBAR NAV & PROFILE (30% -> col-span-3)
              ======================================================== */}
          <div className="md:col-span-3 space-y-6">
            
            {/* SIDEBAR NAVIGATION */}
            <div className="bg-white dark:bg-gray-800 transition-colors duration-300 ease-in-out border border-gray-200 dark:border-gray-700 rounded-2xl p-3 shadow-sm hidden lg:flex flex-col gap-1">
              <button onClick={() => { setActiveTab('home'); setActiveSubPsych('none'); }} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors font-medium text-sm ${activeTab === 'home' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 dark:text-gray-400 transition-colors duration-300 ease-in-out hover:bg-gray-50 dark:bg-gray-900 transition-colors duration-300 ease-in-out hover:text-gray-900 dark:text-white transition-colors duration-300 ease-in-out '}`}>
                <Home className="w-5 h-5 shrink-0" /> Dashboard
              </button>
              <button onClick={() => { setActiveTab('academic'); setActiveSubPsych('none'); }} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors font-medium text-sm ${activeTab === 'academic' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 dark:text-gray-400 transition-colors duration-300 ease-in-out hover:bg-gray-50 dark:bg-gray-900 transition-colors duration-300 ease-in-out hover:text-gray-900 dark:text-white transition-colors duration-300 ease-in-out '}`}>
                <BookOpen className="w-5 h-5 shrink-0" /> Kuis Akademis
              </button>
              <button onClick={() => { setActiveTab('psychology'); setActiveSubPsych('none'); }} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors font-medium text-sm ${activeTab === 'psychology' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 dark:text-gray-400 transition-colors duration-300 ease-in-out hover:bg-gray-50 dark:bg-gray-900 transition-colors duration-300 ease-in-out hover:text-gray-900 dark:text-white transition-colors duration-300 ease-in-out '}`}>
                <Brain className="w-5 h-5 shrink-0" /> Psikotes Mandiri
              </button>
              <button onClick={() => { setActiveTab('internship'); setActiveSubPsych('none'); }} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors font-medium text-sm ${activeTab === 'internship' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 dark:text-gray-400 transition-colors duration-300 ease-in-out hover:bg-gray-50 dark:bg-gray-900 transition-colors duration-300 ease-in-out hover:text-gray-900 dark:text-white transition-colors duration-300 ease-in-out '}`}>
                <Briefcase className="w-5 h-5 shrink-0" /> Magang Terbuka
              </button>
              <button onClick={() => { setActiveTab('leaderboard'); setActiveSubPsych('none'); }} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors font-medium text-sm ${activeTab === 'leaderboard' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 dark:text-gray-400 transition-colors duration-300 ease-in-out hover:bg-gray-50 dark:bg-gray-900 transition-colors duration-300 ease-in-out hover:text-gray-900 dark:text-white transition-colors duration-300 ease-in-out '}`}>
                <Trophy className="w-5 h-5 shrink-0" /> Klasemen
              </button>
              <button onClick={() => { setActiveTab('career'); setActiveSubPsych('none'); }} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors font-medium text-sm ${activeTab === 'career' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 dark:text-gray-400 transition-colors duration-300 ease-in-out hover:bg-gray-50 dark:bg-gray-900 transition-colors duration-300 ease-in-out hover:text-gray-900 dark:text-white transition-colors duration-300 ease-in-out '}`}>
                <Compass className="w-5 h-5 shrink-0" /> Roadmap
              </button>
              {profile.role === 'hr' && (
                <button onClick={() => { setActiveTab('hrd'); setActiveSubPsych('none'); }} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors font-medium text-sm ${activeTab === 'hrd' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 dark:text-gray-400 transition-colors duration-300 ease-in-out hover:bg-gray-50 dark:bg-gray-900 transition-colors duration-300 ease-in-out hover:text-gray-900 dark:text-white transition-colors duration-300 ease-in-out '}`}>
                  <Eye className="w-5 h-5 shrink-0" /> Monitor HRD
                </button>
              )}
            </div>

            {/* PROFILE CARD */}
            <div className="bg-white dark:bg-gray-800 transition-colors duration-300 ease-in-out border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden relative text-left">
              {/* Simulated LinkedIn backdrop banner style */}
              <div className="h-14 bg-gradient-to-r from-teal-500/20 to-purple-500/20 absolute top-0 inset-x-0" />
              
              <div className="p-6 pt-10 text-center relative z-10">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('profile');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="w-full group hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200 rounded-xl p-2 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 flex flex-col items-center gap-3.5"
                  aria-label="Lihat profil lengkap"
                >
                  <div 
                    className="w-14 h-14 rounded-full bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 mx-auto flex items-center justify-center font-bold text-lg text-gray-900 dark:text-white relative overflow-hidden shrink-0"
                    onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
                    title="Upload Profile Picture"
                  >
                    {profile.avatar ? (
                      <img src={profile.avatar} alt="Avatar" className="w-full h-full object-cover keep-colors" />
                    ) : (
                      profile.name.slice(0, 2).toUpperCase()
                    )}
                    <div className="absolute inset-0 bg-black/50 hidden group-hover:flex items-center justify-center transition-all opacity-0 group-hover:opacity-100">
                      <Camera className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-xl font-bold text-gray-900 dark:text-white group-hover:underline group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-200">{profile.name}</h4>
                    <span className="text-[10px] text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-900 inline-block px-2.5 py-0.5 rounded-full mt-1 border border-gray-200 dark:border-gray-700 break-words group-hover:border-indigo-200 transition-colors duration-200">
                      {profile.educationLevel} - {profile.major}
                    </span>
                  </div>
                </button>
                <input 
                  type="file" 
                  accept="image/*" 
                  ref={fileInputRef} 
                  onChange={handleAvatarUpload} 
                  className="hidden" 
                />

                <div className="space-y-2 text-xs">
                  <span className="text-[10px] text-gray-500 dark:text-gray-400 transition-colors duration-300 ease-in-out font-bold block uppercase tracking-wider text-left pl-1">Headline Profil</span>
                  <textarea
                    rows={2}
                    value={profile.headline}
                    onChange={(e) => handleUpdateHeadline(e.target.value)}
                    placeholder="Tulis slogan/keahlian profesional Anda di sini..."
                    className="w-full bg-gray-50 dark:bg-gray-900 transition-colors duration-300 ease-in-out border border-gray-200 dark:border-gray-700 rounded-xl p-2 text-[11px] text-gray-900 dark:text-white transition-colors duration-300 ease-in-out focus:outline-none focus:border-teal-500 placeholder-gray-400 font-light"
                  />
                </div>

                {/* EDIT BACKGROUND DETECTIVES */}
                <div className="space-y-2 text-left pt-2.5 border-t border-gray-200 dark:border-gray-700">
                  <span className="text-[10px] text-gray-500 dark:text-gray-400 transition-colors duration-300 ease-in-out font-bold block uppercase tracking-wider pl-1">Pendidikan & Jurusan</span>
                  
                  <div className="space-y-1.5 text-[11px]">
                    <input
                      disabled
                      value={profile.educationLevel}
                      className="w-full bg-gray-100 dark:bg-gray-700 transition-colors duration-300 ease-in-out border border-gray-200 dark:border-gray-700 rounded-lg p-1.5 text-gray-500 dark:text-gray-400 transition-colors duration-300 ease-in-out cursor-not-allowed opacity-75 text-[11px]"
                    />

                    <input
                      disabled
                      value={profile.major}
                      className="w-full bg-gray-100 dark:bg-gray-700 transition-colors duration-300 ease-in-out border border-gray-200 dark:border-gray-700 rounded-lg p-1.5 text-gray-500 dark:text-gray-400 transition-colors duration-300 ease-in-out cursor-not-allowed opacity-75 text-[11px]"
                    />
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* ========================================================
              MIDDLE COLUMN: INTERACTIVE TABS VIEW (70% Width)
              ======================================================== */}
          <div className="md:col-span-9 space-y-6">
            <AnimatePresence mode="wait">
            
            {/* VIEW TAB MAIN FEED (HOME INDEX) */}
            {activeTab === 'profile' && (
              <motion.div 
                key="profile"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                id="profile-view" 
              >
                <ProfileView 
                  profile={profile}
                  psychResults={psychResults}
                  aiReport={aiReport}
                  quizScoresLog={quizScoresLog}
                  onUpdateCosmetics={handleUpdateCosmetics}
                  onUpgradeToPremium={() => setPremiumState(true)}
                />
              </motion.div>
            )}

            {activeTab === 'home' && (
              <motion.div 
                key="home"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                id="home-feed-view" 
                className="grid grid-cols-1 md:grid-cols-9 gap-6 items-start"
              >

                {/* MIDDLE COLUMN (Feed & Action - md:col-span-6) */}
                <div className="md:col-span-6 space-y-6">
                  {/* LinkedIn Share Box Mock */}
                  <div className="bg-white dark:bg-gray-800 transition-colors duration-300 ease-in-out border border-gray-200 dark:border-gray-700 p-4 rounded-3xl text-left flex gap-3 items-center shadow-sm">
                  <div className="w-9 h-9 rounded-full bg-gray-50 dark:bg-gray-900 transition-colors duration-300 ease-in-out border border-gray-200 dark:border-gray-700 flex items-center justify-center font-bold text-xs text-gray-500 dark:text-gray-400 transition-colors duration-300 ease-in-out select-none overflow-hidden shrink-0">
                    {profile.avatar ? (
                      <img src={profile.avatar} alt="Avatar" className="w-full h-full object-cover keep-colors" />
                    ) : (
                      profile.name.slice(0, 2).toUpperCase()
                    )}
                  </div>
                  <input
                    type="text"
                    disabled
                    placeholder="Mulai sebuah kiriman kompetensi atau bagikan sertifikasi barumu..."
                    className="flex-1 bg-gray-50 dark:bg-gray-900 transition-colors duration-300 ease-in-out /70 border border-gray-200 dark:border-gray-700 p-2.5 rounded-full text-xs text-gray-500 dark:text-gray-400 transition-colors duration-300 ease-in-out font-light"
                  />
                  <div className="bg-gray-50 dark:bg-gray-900 transition-colors duration-300 ease-in-out p-2 rounded-full border border-gray-200 dark:border-gray-700">
                    <Send className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400 transition-colors duration-300 ease-in-out " />
                  </div>
                </div>

                {/* THE PRIZED TALENT CARD (FIFA SCORE ENGINE) */}
                <TalentCard 
                  profile={profile} 
                  psychResults={psychResults}
                  aiReport={aiReport}
                  quizScoresLog={quizScoresLog}
                  onUpdateCosmetics={handleUpdateCosmetics}
                  onUpgradeToPremium={() => setPremiumState(true)}
                />

                {/* AI PSYCHOLOGICAL INTERPRETATION SECTION */}
                <div id="ai-psychological-section" className="bg-white dark:bg-gray-800 transition-colors duration-300 ease-in-out border border-gray-200 dark:border-gray-700 rounded-3xl p-6 md:p-8 space-y-6 text-left">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <h4 className="text-xl font-bold text-gray-900 dark:text-white transition-colors duration-300 ease-in-out font-display flex items-center gap-2">
                        <Brain className="w-5 h-5 text-teal-400" /> Interpretasi Psikologi Senior & Karakter Kerja AI
                      </h4>
                      <p className="text-xs text-gray-600 dark:text-gray-400 transition-colors duration-300 ease-in-out mt-1">
                        AI Senior menganalisis korelasi hasil Kraepelin, DISC, dan PAPI Kostik untuk mendesain keunggulan serta rekomendasi jabatan.
                      </p>
                    </div>

                    <div className="flex flex-col items-start sm:items-end gap-2 shrink-0">
                      <button
                        onClick={requestAIInterpretation}
                        disabled={isInterpreting || !allTestsDone}
                        title={!allTestsDone ? 'Lengkapi tes psikotes dan akademik untuk aktivasi AI.' : ''}
                        className="bg-teal-500 hover:bg-teal-400 disabled:opacity-50 disabled:cursor-not-allowed text-gray-900 dark:text-white transition-colors duration-300 ease-in-out font-bold text-xs px-5 py-2.5 rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer"
                      >
                        {isInterpreting ? (
                          <>
                            <RefreshCw className="w-4 h-4 animate-spin" /> Menganalisis...
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-4 h-4 text-gray-900 dark:text-white transition-colors duration-300 ease-in-out shrink-0 fill-gray-900" /> Minta Interpretasi AI Senior
                          </>
                        )}
                      </button>
                      {!allTestsDone && (
                        <p className="text-[11px] text-red-400 font-medium">
                          Kekurangan data: {(!hasAcademic ? ['Akademik'] : []).concat(!hasKraepelin ? ['Kraepelin'] : []).concat(!hasDisc ? ['DISC'] : []).concat(!hasPapi ? ['PAPI'] : []).join(', ')}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* AI Loading Screen */}
                  {isInterpreting && (
                    <div className="bg-gray-50 dark:bg-gray-900 transition-colors duration-300 ease-in-out /90 border border-gray-200 dark:border-gray-700 rounded-2xl p-8 text-center space-y-4 animate-pulse">
                      <div className="w-12 h-12 bg-teal-500/10 text-teal-400 border border-teal-500/20 rounded-full flex items-center justify-center mx-auto">
                        <Brain className="w-6 h-6 animate-spin" />
                      </div>
                      <div className="space-y-1.5">
                        <h5 className="font-bold text-gray-900 dark:text-white transition-colors duration-300 ease-in-out text-xs">Konsultasi Diagnosis AI Sedang Diproses...</h5>
                        <p className="text-[11px] text-teal-400 font-mono font-bold">{loadingStep}</p>
                      </div>
                    </div>
                  )}

                  {/* AI Response Report Container */}
                  {!allTestsDone ? (
                    <div className="bg-gray-50 dark:bg-gray-900 transition-colors duration-300 ease-in-out /40 p-6 rounded-2xl border border-dashed border-red-900/50 text-center">
                      <p className="text-xs text-red-400 font-medium max-w-sm mx-auto leading-relaxed">
                        Lengkapi tes psikotes dan akademik untuk aktivasi AI.
                      </p>
                    </div>
                  ) : !isInterpreting && aiReport ? (
                    <div className="bg-gray-50 dark:bg-gray-900 transition-colors duration-300 ease-in-out border border-gray-200 dark:border-gray-700 rounded-2xl p-6 space-y-5">
                      
                      {/* Sub header OVR */}
                      <div className="flex items-center gap-3 border-b border-gray-200 dark:border-gray-700 pb-4">
                        <div className="w-11 h-11 bg-gradient-to-tr from-indigo-600 to-yellow-400 rounded-full flex items-center justify-center font-display text-lg font-bold text-gray-900 dark:text-white transition-colors duration-300 ease-in-out font-mono shrink-0 shadow-md">
                          {aiReport.ovrRating}
                        </div>
                        <div>
                          <span className="text-[9px] uppercase font-bold text-gray-500 dark:text-gray-400 transition-colors duration-300 ease-in-out block tracking-widest">Sertifikasi Grade Kartu</span>
                          <h5 className="text-sm font-semibold text-gray-900 dark:text-white transition-colors duration-300 ease-in-out ">Rangkuman Kredibilitas Karakter & Karier Talenta</h5>
                        </div>
                      </div>

                      {/* Summary text */}
                      <div className="space-y-1.5 text-xs">
                        <span className="text-[10px] text-gray-500 dark:text-gray-400 transition-colors duration-300 ease-in-out uppercase font-bold block tracking-wider">Potret Karakter Komprehensif:</span>
                        <p className="text-gray-500 dark:text-gray-400 transition-colors duration-300 ease-in-out leading-relaxed font-light first-letter:text-2xl first-letter:font-bold first-letter:text-teal-400">
                          {aiReport.summary}
                        </p>
                      </div>

                      {/* Strengths & Weaknesses */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-gray-200 dark:border-gray-700">
                        <div className="space-y-2 text-xs">
                          <span className="text-[10px] text-emerald-400 uppercase font-bold block tracking-wider">✓ Titik Unggul Karakter (Strengths):</span>
                          <ul className="space-y-1.5 list-disc pl-4 text-gray-600 dark:text-gray-400 transition-colors duration-300 ease-in-out leading-normal font-light">
                            {aiReport.strengths?.map((st: string, idx: number) => (
                              <li key={idx}>{st}</li>
                            ))}
                          </ul>
                        </div>

                        <div className="space-y-2 text-xs">
                          <span className="text-[10px] text-red-400 uppercase font-bold block tracking-wider">🎯 Peluang Pengembangan (Weaknesses):</span>
                          <ul className="space-y-1.5 list-disc pl-4 text-gray-600 dark:text-gray-400 transition-colors duration-300 ease-in-out leading-normal font-light">
                            {aiReport.weaknesses?.map((wk: string, idx: number) => (
                              <li key={idx}>{wk}</li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* Recommended Careers */}
                      <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                        <span className="text-[10px] text-indigo-400 uppercase font-bold block tracking-wider mb-2.5">
                          💼 Top 3 Karir Sesuai Jurusan ({profile.major}) & Dimensi Karakter:
                        </span>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          {aiReport.recommendedRoles?.map((role: string, idx: number) => (
                            <div key={idx} className="bg-white dark:bg-gray-800 transition-colors duration-300 ease-in-out border border-gray-200 dark:border-gray-700 p-3 rounded-xl hover:border-gray-200 dark:border-gray-700 transition-all text-center">
                              <span className="text-[10px] text-gray-500 dark:text-gray-400 transition-colors duration-300 ease-in-out block font-mono">Pilihan #{idx + 1}</span>
                              <strong className="text-xs text-gray-900 dark:text-white transition-colors duration-300 ease-in-out block mt-1 tracking-tight truncate">{role}</strong>
                            </div>
                          ))}
                        </div>
                      </div>

                    </div>
                  ) : (
                    !isInterpreting && (
                      <div className="bg-gray-50 dark:bg-gray-900 transition-colors duration-300 ease-in-out /40 p-6 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700 text-center">
                        <p className="text-xs text-gray-600 dark:text-gray-400 transition-colors duration-300 ease-in-out max-w-sm mx-auto leading-relaxed">
                          Anda belum melangsungkan interpretasi AI senior terbaru. Silakan ketuk tombol <strong>Minta Interpretasi AI Senior</strong> di atas untuk mengaktifkan andalan algoritma kami!
                        </p>
                      </div>
                    )
                  )}

                </div>

                {/* ACTIVITY FEED */}
                <ActivityFeed 
                  quizScoresLog={quizScoresLog}
                  psychResults={psychResults}
                />
                </div>

                {/* RIGHT COLUMN (Widgets - md:col-span-3) */}
                <div className="md:col-span-3 flex flex-col gap-4 h-auto">
                  {/* PROGRESS BAR SECTION */}
                  <div className="bg-white dark:bg-gray-800 transition-colors duration-300 ease-in-out border border-gray-200 dark:border-gray-700 rounded-2xl p-5 space-y-3 text-left shadow-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 transition-colors duration-300 ease-in-out">Progres Tes</span>
                      <span className="text-xs font-bold text-teal-500">{testProgressPercent}%</span>
                    </div>
                    <div className="h-2 w-full bg-gray-100 dark:bg-gray-700 transition-colors duration-300 ease-in-out rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-teal-500 rounded-full relative"
                        initial={{ width: 0 }}
                        animate={{ width: `${testProgressPercent}%` }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                      />
                    </div>
                  </div>

                  {/* DAILY CHECK IN ACTION */}
                  <DailyCheckInWidget profile={profile} onCheckIn={handleDailyCheckIn} />

                  {/* SKILLS ANALYTICS */}
                  <div className="bg-white dark:bg-gray-800 transition-colors duration-300 ease-in-out border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm text-left overflow-hidden">
                    <SkillsAnalytics profile={profile} />
                  </div>
                </div>

              </motion.div>
            )}

            {/* TAB VIEW PORTAL: KUIS AKADEMIK EXAMS */}
            {activeTab === 'academic' && (
              <motion.div
                key="academic"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <AcademicTest 
                  profile={profile}
                  completedQuizzes={quizScoresLog.map(q => q.id)}
                  onCompleteQuiz={handleCompleteAcademicQuiz}
                  onUpgradeToPremium={() => setPremiumState(true)}
                />
              </motion.div>
            )}

            {/* TAB VIEW PORTAL: PSYCHOLOGICAL ASSESSMENTS */}
            {activeTab === 'psychology' && (
              <motion.div 
                key="psychology"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                id="psychology-portal" 
                className="space-y-6"
              >
                
                <AnimatePresence mode="wait">
                {activeSubPsych === 'none' && (
                  <motion.div 
                    key="psych-none"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="bg-white dark:bg-gray-800 transition-colors duration-300 ease-in-out border border-gray-200 dark:border-gray-700 rounded-3xl p-6 md:p-8 space-y-6 text-left"
                  >
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white transition-colors duration-300 ease-in-out flex items-center gap-2 font-display">
                        <Brain className="w-6 h-6 text-teal-400" /> Pusat Psikotest Utama & Kredibilitas Karakter
                      </h3>
                      <p className="text-xs text-gray-600 dark:text-gray-400 transition-colors duration-300 ease-in-out mt-1">
                        Pilih salah satu psikotes profesional terkemuka di bawah ini yang wajib ada untuk melengkapi data andalan psikografis Talent Card Anda.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      
                      {/* KRAEPELIN BOX */}
                      <div className="bg-gray-50 dark:bg-gray-900 transition-colors duration-300 ease-in-out border border-gray-200 dark:border-gray-700 p-5 rounded-2xl flex flex-col justify-between">
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-[9px] bg-yellow-500/10 text-yellow-500 border border-yellow-500/25 px-2 py-0.5 rounded uppercase font-bold tracking-wider">
                              Tes Penjumlahan
                            </span>
                            {psychResults.kraepelin && (
                              <span className="text-[8px] bg-teal-500 text-gray-900 dark:text-white transition-colors duration-300 ease-in-out px-1.5 py-0.5 rounded font-bold">✓ Selesai</span>
                            )}
                          </div>
                          <h4 className="text-sm font-bold text-gray-900 dark:text-white transition-colors duration-300 ease-in-out font-display">Kraepelin (Ketahanan Kerja)</h4>
                          <p className="text-[11px] text-gray-500 dark:text-gray-400 transition-colors duration-300 ease-in-out leading-normal">
                            Menjumlahkan deret digit dari bawah ke atas pada kolom 60 detik tepat, disisipi interval nafas tenang 5 detik.
                          </p>
                        </div>

                        <button
                          onClick={() => !psychResults.kraepelin && setActiveSubPsych('kraepelin')}
                          disabled={!!psychResults.kraepelin}
                          className={`font-bold text-xs p-2 rounded-xl mt-5 transition-all w-full ${psychResults.kraepelin ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 cursor-not-allowed' : 'bg-teal-500 hover:bg-teal-400 text-gray-900 dark:text-white transition-colors duration-300 ease-in-out cursor-pointer'}`}
                        >
                          {psychResults.kraepelin ? 'Selesai' : 'Mulai Kraepelin'}
                        </button>
                      </div>

                      {/* DISC BOX */}
                      <div className="bg-gray-50 dark:bg-gray-900 transition-colors duration-300 ease-in-out border border-gray-200 dark:border-gray-700 p-5 rounded-2xl flex flex-col justify-between">
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-[9px] bg-teal-500/10 text-teal-400 border border-teal-500/25 px-2 py-0.5 rounded uppercase font-bold tracking-wider">
                              Gaya Komunikasi
                            </span>
                            {psychResults.disc && (
                              <span className="text-[8px] bg-teal-500 text-gray-900 dark:text-white transition-colors duration-300 ease-in-out px-1.5 py-0.5 rounded font-bold">✓ Selesai</span>
                            )}
                          </div>
                          <h4 className="text-sm font-bold text-gray-900 dark:text-white transition-colors duration-300 ease-in-out font-display">DISC Communication Style</h4>
                          <p className="text-[11px] text-gray-500 dark:text-gray-400 transition-colors duration-300 ease-in-out leading-normal">
                            Menjaring kecenderungan Dominance, Influence, Steadiness, & Conscientiousness dalam bersosialisasi dan bermusyawarah.
                          </p>
                        </div>

                        <button
                          onClick={() => !psychResults.disc && setActiveSubPsych('disc')}
                          disabled={!!psychResults.disc}
                          className={`font-bold text-xs p-2 rounded-xl mt-5 transition-all w-full ${psychResults.disc ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 cursor-not-allowed' : 'bg-teal-500 hover:bg-teal-400 text-gray-900 dark:text-white transition-colors duration-300 ease-in-out cursor-pointer'}`}
                        >
                          {psychResults.disc ? 'Selesai' : 'Mulai DISC'}
                        </button>
                      </div>

                      {/* PAPI KOSTIK BOX */}
                      <div className="bg-gray-50 dark:bg-gray-900 transition-colors duration-300 ease-in-out border border-gray-200 dark:border-gray-700 p-5 rounded-2xl flex flex-col justify-between">
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-[9px] bg-violet-500/10 text-violet-400 border border-violet-500/25 px-2 py-0.5 rounded uppercase font-bold tracking-wider">
                              Karakter Kerja
                            </span>
                            {psychResults.papi && (
                              <span className="text-[8px] bg-teal-500 text-gray-900 dark:text-white transition-colors duration-300 ease-in-out px-1.5 py-0.5 rounded font-bold">✓ Selesai</span>
                            )}
                          </div>
                          <h4 className="text-sm font-bold text-gray-900 dark:text-white transition-colors duration-300 ease-in-out font-display">PAPI Kostik (90 Soal)</h4>
                          <p className="text-[11px] text-gray-500 dark:text-gray-400 transition-colors duration-300 ease-in-out leading-normal">
                            Mengurai secara micro 20 kepribadian mendalam mulai dari dorongan, kepatuhan, keaktifan jasmani, & detail-oriented.
                          </p>
                        </div>

                        <button
                          onClick={() => !psychResults.papi && setActiveSubPsych('papi')}
                          disabled={!!psychResults.papi}
                          className={`font-bold text-xs p-2 rounded-xl mt-5 transition-all w-full ${psychResults.papi ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 cursor-not-allowed' : 'bg-teal-500 hover:bg-teal-400 text-gray-900 dark:text-white transition-colors duration-300 ease-in-out cursor-pointer'}`}
                        >
                          {psychResults.papi ? 'Selesai' : 'Mulai PAPI Kostik'}
                        </button>
                      </div>

                    </div>
                  </motion.div>
                )}

                {/* Sub assessment workspaces rendering according to state triggers */}
                {activeSubPsych === 'kraepelin' && (
                  <motion.div
                    key="kraepelin"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <KraepelinTest onComplete={handleCompleteKraepelin} />
                  </motion.div>
                )}

                {activeSubPsych === 'disc' && (
                  <motion.div
                    key="disc"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <DISCTest onComplete={handleCompleteDISC} />
                  </motion.div>
                )}

                {activeSubPsych === 'papi' && (
                  <motion.div
                    key="papi"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <PAPITest onComplete={handleCompletePAPI} />
                  </motion.div>
                )}
                </AnimatePresence>

              </motion.div>
            )}

            {/* TAB VIEW PORTAL: INTERNSHIP JOB EXPERIENCES (MAGANG) */}
            {activeTab === 'internship' && (
              <motion.div 
                key="internship"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <InternshipsView profile={profile} onAppStatusUpdate={(msg) => showTopToast(msg, 'success')} />
              </motion.div>
            )}

            {/* TAB VIEW PORTAL: RECRUITER MONITOR PORTAL SIMULATOR */}
            {activeTab === 'hrd' && (
              <motion.div 
                key="hrd"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <HRDSimulator profile={profile} onUpgrade={() => setShowPaymentModal(true)} />
              </motion.div>
            )}

            {/* TAB VIEW PORTAL: LEADERBOARD */}
            {activeTab === 'leaderboard' && (
              <motion.div 
                key="leaderboard"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <LeaderboardView />
              </motion.div>
            )}

            {/* TAB VIEW PORTAL: CAREER ROADMAP */}
            {activeTab === 'career' && (
              <motion.div 
                key="career"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <CareerRoadmap profile={profile} psychResults={psychResults} />
              </motion.div>
            )}

            {/* MONGO DB CONNECTION TEST TAB */}
            {activeTab === 'movies' && (
              <motion.div 
                key="movies"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <MoviesView />
              </motion.div>
            )}

            </AnimatePresence>
          </div>

        </div>

      </main>

      {/* FOOTER METRIC CREDIBILITY */}
      <footer className="bg-white dark:bg-gray-800 transition-colors duration-300 ease-in-out border-t border-gray-200 dark:border-gray-700 py-6 mt-12 text-center text-xs text-gray-500 dark:text-gray-400 transition-colors duration-300 ease-in-out ">
        <div className="max-w-7xl mx-auto px-4 space-y-1">
          <p>© 2026 PT TalentFlow Indonesia. Hak Cipta Dilindungi.</p>
          <p className="font-light text-[11px] text-gray-500 dark:text-gray-400 transition-colors duration-300 ease-in-out ">Platform Validasi Kompetensi Berbasis Rating & Karakter Terstruktur untuk Industri Nasional.</p>
        </div>
      </footer>

      {/* PAYMENT MODAL OVERLAY */}
      {showPaymentModal && (
        <PremiumPurchaseModal 
          profile={profile}
          onClose={() => setShowPaymentModal(false)}
          onSuccess={async () => {
            setToast({ message: 'Permintaan pembayaran divalidasi. Menunggu verifikasi admin HR.', type: 'success' });
            setHasPendingPayment(true);
            setShowPaymentModal(false);
          }}
        />
      )}

      <ProfileEditModal
        profile={profile}
        isOpen={showProfileEditModal}
        onClose={() => setShowProfileEditModal(false)}
        onSave={handleUpdateProfile}
      />

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
          position="bottom-center"
        />
      )}

      {topToast && (
        <Toast
          message={topToast.message}
          type={topToast.type}
          onClose={() => setTopToast(null)}
          position="top-right"
        />
      )}
    </div>
  );
}
