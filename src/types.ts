/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type EducationLevel = 'SMA/SMK' | 'Mahasiswa Aktif' | 'Lulusan';

export type UserMajor = 'Teknik Informatika' | 'Bisnis & Manajemen' | 'Sains & Teknologi' | 'Umum';

export interface TalentCosmetics {
  theme: 'gold' | 'neon-cyber' | 'obsidian' | 'cosmic' | 'classic';
  bannerUrl: string;
  avatarFrame: boolean;
  glowEffect: boolean;
}

export interface TalentStats {
  ovr: number; // Overall Rating (30-99)
  acd: number; // Academic score
  spd: number; // Kraepelin Speed
  con: number; // Kraepelin Consistency
  str: number; // Kraepelin Stress Resistance
  com: number; // DISC Communication
  ldr: number; // PAPI Leadership
  dtl: number; // PAPI Detail Orientation
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  whatsapp: string;
  headline: string;
  educationLevel: EducationLevel | '';
  major: UserMajor | '';
  isPremium: boolean;
  avatar: string; // Base64 or placeholder initials
  stats: TalentStats;
  cosmetics: TalentCosmetics;
  role?: 'pelamar' | 'admin' | 'hr' | 'perusahaan';
  nik?: string;
  companyName?: string;
  isOnboarded?: boolean;
  achievements?: string[];
  consistencyPoints?: number;
  lastCheckInDate?: string;
  checkInStreak?: number;
  pendingUpdates?: {
    email?: string;
    whatsapp?: string;
    status?: string;
    requestedAt?: string | Date;
  };
}

export interface Internship {
  id: string;
  companyName: string;
  title: string;
  location: string;
  type: 'Remote' | 'Hybrid' | 'On-site';
  targetAudience: EducationLevel[];
  description: string;
  stipend: string;
  requirements: string[];
  logo: string;
}

export interface AcademicQuiz {
  id: string;
  subject: string;
  level: 'SMA' | 'University';
  major: UserMajor;
  questions: {
    question: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
  }[];
}

export interface DISCQuestion {
  id: number;
  options: {
    text: string;
    dimension: 'D' | 'I' | 'S' | 'C' | 'N'; // Dominance, Influence, Steadiness, Conscientiousness, Neutral
    icon: string;
  }[];
}

export interface PAPIQuestion {
  id: number;
  optionA: {
    text: string;
    trait: string; // e.g. G (Hard worker), L (Leadership)
  };
  optionB: {
    text: string;
    trait: string; // e.g. I (Decision maker), T (Pace)
  };
}

export interface PsychologicalResult {
  kraepelin?: {
    speed: number;
    accuracy: number;
    stability: number;
    rawReport: string;
    workCurve: number[];
  };
  disc?: {
    scores: { D: number; I: number; S: number; C: number };
    style: string;
    summary: string;
  };
  papi?: {
    scores: { [trait: string]: number };
    roles: string[];
    needs: string[];
  };
  aiReport?: {
    ovrRating: number;
    summary: string;
    strengths: string[];
    weaknesses: string[];
    recommendedRoles: string[];
  };
}
