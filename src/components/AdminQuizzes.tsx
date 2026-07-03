/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  BookOpen, Layers, CheckSquare, Plus, Trash2, Edit3, X, HelpCircle, Save, Check, ShieldAlert, AlertCircle 
} from 'lucide-react';

interface Quiz {
  id: string;
  name: string;
  rumpun: string;
  pohon: string;
  prodi: string;
  duration: number;
  itemCount: number;
  dateLimit: string;
  targetJobs: string[];
}

interface Question {
  id: string;
  quizId: string;
  type: 'Pilihan Ganda' | 'Essay';
  questionText: string;
  options?: Record<string, string>;
  key?: string;
}

interface DiscTetrad {
  id: string;
  D: string;
  I: string;
  S: string;
  C: string;
}

interface AdminQuizzesProps {
  quizzes: Quiz[];
  questions: Question[];
  discTetrads: DiscTetrad[];
  lang: 'id' | 'en';
  onAddQuiz: (payload: Quiz) => void;
  onDeleteQuiz: (id: string) => void;
  onUpdateQuiz: (quiz: Quiz) => void;
  onAddQuestion: (payload: Question) => void;
  onDeleteQuestion: (id: string) => void;
  onAddDiscTetrad: (payload: DiscTetrad) => void;
  onDeleteDiscTetrad: (id: string) => void;
}

const REFERENSI_ILMU: Record<string, Record<string, string[]>> = {
  "Sains & Teknologi": {
    "Informatika": ["Teknik Informatika", "Sistem Informasi", "Sains Data"],
    "Insinyur": ["Teknik Sipil", "Teknik Mesin", "Teknik Elektro"]
  },
  "Ekonomi & Bisnis": {
    "Manajemen": ["Akuntansi", "Manajemen Bisnis", "Kewirausahaan"],
    "Keuangan": ["S1 Perbankan", "Analisis Finansial"]
  },
  "Ilmu Sosial & Humaniora": {
    "Bahasa": ["Sastra Inggris", "Bahasa Indonesia", "Komunikasi Profesional"],
    "Psikologi": ["Psikologi Industri", "Konseling Sosial"]
  }
};

const JOBS_CHECKLIST = [
  "Front-End Developer", "UI/UX Designer", "Product Manager", "Back-End Developer", 
  "Data Scientist", "Akuntan Senior", "Business Operations", "Content Creator"
];

const LOCALIZATION = {
  id: {
    activeTests: "Daftar Assessment",
    academicBank: "Bank Soal Akademik",
    discBank: "Bank Soal DISC",
    addQuizBtn: "Buat Assessment Baru",
    quizName: "Nama Assessment",
    rumpun: "Rumpun Ilmu",
    pohon: "Pohon Ilmu",
    prodi: "Program Studi",
    duration: "Durasi (Menit)",
    questionCount: "Target Jumlah Soal",
    scheduledDate: "Batas Akhir Jadwal",
    targetJobs: "Target Posisi (Bisa pilih multipel)",
    allJobs: "Terapkan ke Semua Posisi",
    cancel: "Batal",
    save: "Simpan",
    delete: "Hapus",
    edit: "Ubah",
    questionsUnderQuiz: "Pertanyaan di dalam Kuis Ini",
    addQuestionBtn: "Tambah Soal Baru",
    questionType: "Tipe Pertanyaan",
    mcq: "Pilihan Ganda",
    essay: "Esai / Uraian",
    questionInput: "Isi Pertanyaan",
    choices: "Opsi Jawaban",
    addChoice: "+ Tambah Pilihan",
    correctKey: "Kunci Jawaban yang Benar",
    emptyQuestions: "Belum ada soal untuk kuis ini.",
    discTetradTitle: "Kelola Tetrad Pernyataan DISC",
    discDescription: "Setiap tetrad wajib dipetakan ke 4 trait unik (D, I, S, C). Tidak diperkenankan memetakan gaya kepribadian yang sama lebih dari sekali dalam satu soal!",
    addDiscBtn: "Tambah Soal DISC baru",
    traitDuplicateError: "Gagal: Anda tidak boleh memilih gaya kepribadian (D, I, S, C) yang ganda dalam satu soal!"
  },
  en: {
    activeTests: "Assessment List",
    academicBank: "Quiz Banks",
    discBank: "DISC Personality Bank",
    addQuizBtn: "Create New Assessment",
    quizName: "Assessment Title",
    rumpun: "Field Category (Rumpun)",
    pohon: "Sub Category (Pohon)",
    prodi: "Major (Program Studi)",
    duration: "Duration (Minutes)",
    questionCount: "Target Questions Count",
    scheduledDate: "Scheduled Deadline",
    targetJobs: "Target Jobs (Can select multiple)",
    allJobs: "Apply to All Postings",
    cancel: "Cancel",
    save: "Save",
    delete: "Delete",
    edit: "Edit",
    questionsUnderQuiz: "Questions inside this Quiz",
    addQuestionBtn: "Add New Question",
    questionType: "Question Format",
    mcq: "Multiple Choice (MCQ)",
    essay: "Essay / Open-ended",
    questionInput: "Question Body Text",
    choices: "Options / Choices",
    addChoice: "+ Add Custom Choice",
    correctKey: "Correct Answer Key",
    emptyQuestions: "No database questions available for this module.",
    discTetradTitle: "Manage DISC Personality Tetrads",
    discDescription: "Each personality set must be mapped to four unique traits (D, I, S, C). Selecting duplicate traits is strictly forbidden!",
    addDiscBtn: "Add new DISC Tetrad",
    traitDuplicateError: "Failed: You cannot configure duplicate traits (D, I, S, C) inside a single question!"
  }
};

export default function AdminQuizzes({
  quizzes,
  questions,
  discTetrads,
  lang,
  onAddQuiz,
  onDeleteQuiz,
  onUpdateQuiz,
  onAddQuestion,
  onDeleteQuestion,
  onAddDiscTetrad,
  onDeleteDiscTetrad
}: AdminQuizzesProps) {
  const t = LOCALIZATION[lang];

  const [topTab, setTopTab] = useState<'quizzes' | 'academic' | 'disc'>('quizzes');
  
  // Create / Edit Quiz Modal state
  const [quizModalOpen, setQuizModalOpen] = useState(false);
  const [editingQuiz, setEditingQuiz] = useState<Quiz | null>(null);

  // Quiz Form states (with dynamic 3-level tree implementation)
  const [formName, setFormName] = useState('');
  const [formRumpun, setFormRumpun] = useState('');
  const [formPohon, setFormPohon] = useState('');
  const [formProdi, setFormProdi] = useState('');
  const [formDuration, setFormDuration] = useState(30);
  const [formCount, setFormCount] = useState(15);
  const [formLimitDate, setFormLimitDate] = useState('2026-06-15');
  const [formJobs, setFormJobs] = useState<string[]>([]);
  const [allJobsChecked, setAllJobsChecked] = useState(false);

  // Active loaded quiz reference in question bank submenu
  const [activeBankQuizId, setActiveBankQuizId] = useState<string>(quizzes[0]?.id || '');

  // Add Question modal states
  const [questionModalOpen, setQuestionModalOpen] = useState(false);
  const [qType, setQType] = useState<'Pilihan Ganda' | 'Essay'>('Pilihan Ganda');
  const [qText, setQText] = useState('');
  const [qChoices, setQChoices] = useState<{ label: string; text: string }[]>([
    { label: 'A', text: '' },
    { label: 'B', text: '' },
    { label: 'C', text: '' },
    { label: 'D', text: '' }
  ]);
  const [qKey, setQKey] = useState('A');

  // Add DISC modal states
  const [discModalOpen, setDiscModalOpen] = useState(false);
  const [discD, setDiscD] = useState('');
  const [discI, setDiscI] = useState('');
  const [discS, setDiscS] = useState('');
  const [discC, setDiscC] = useState('');

  // 3-Level hierarchy lookups
  const pohonList = formRumpun ? Object.keys(REFERENSI_ILMU[formRumpun] || {}) : [];
  const prodiList = (formRumpun && formPohon) ? (REFERENSI_ILMU[formRumpun][formPohon] || []) : [];

  const handleOpenCreateModal = () => {
    setEditingQuiz(null);
    setFormName('');
    setFormRumpun('');
    setFormPohon('');
    setFormProdi('');
    setFormDuration(30);
    setFormCount(15);
    setFormLimitDate('2026-06-30');
    setFormJobs([]);
    setAllJobsChecked(false);
    setQuizModalOpen(true);
  };

  const handleOpenEditModal = (quiz: Quiz) => {
    setEditingQuiz(quiz);
    setFormName(quiz.name);
    setFormRumpun(quiz.rumpun);
    setFormPohon(quiz.pohon);
    setFormProdi(quiz.prodi);
    setFormDuration(quiz.duration);
    setFormCount(quiz.itemCount);
    setFormLimitDate(quiz.dateLimit);
    setFormJobs(quiz.targetJobs);
    setAllJobsChecked(quiz.targetJobs.includes('Semua Posisi'));
    setQuizModalOpen(true);
  };

  const handleSaveQuiz = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formRumpun || !formPohon || !formProdi) {
      alert("Harap lengkapi semua isian!");
      return;
    }

    const payload: Quiz = {
      id: editingQuiz ? editingQuiz.id : 'quiz_' + Math.random().toString(36).substr(2, 9),
      name: formName,
      rumpun: formRumpun,
      pohon: formPohon,
      prodi: formProdi,
      duration: Number(formDuration),
      itemCount: Number(formCount),
      dateLimit: formLimitDate,
      targetJobs: allJobsChecked ? ['Semua Posisi'] : formJobs
    };

    if (editingQuiz) {
      onUpdateQuiz(payload);
    } else {
      onAddQuiz(payload);
    }
    setQuizModalOpen(false);
  };

  const handleToggleJobCheckbox = (job: string) => {
    setFormJobs(prev => {
      if (prev.includes(job)) {
        return prev.filter(j => j !== job);
      } else {
        return [...prev, job];
      }
    });
  };

  const handleAddChoiceOption = () => {
    setQChoices(prev => {
      const nextLabel = String.fromCharCode(65 + prev.length);
      return [...prev, { label: nextLabel, text: '' }];
    });
  };

  const handleRemoveChoiceOption = (idx: number) => {
    if (qChoices.length <= 2) {
      alert("Soal Pilihan Ganda minimal membutuhkan 2 opsi jawaban!");
      return;
    }
    setQChoices(prev => {
      const temp = prev.filter((_, i) => i !== idx);
      // Recalibrate labels A, B, C...
      return temp.map((val, i) => ({
        label: String.fromCharCode(65 + i),
        text: val.text
      }));
    });
  };

  const handleSaveQuestion = () => {
    if (!qText.trim()) return alert("Teks pertanyaan tidak boleh kosong!");
    
    let optionsRecord: Record<string, string> | undefined = undefined;
    if (qType === 'Pilihan Ganda') {
      optionsRecord = {};
      for (const opt of qChoices) {
        if (!opt.text.trim()) return alert(`Pilihan ${opt.label} wajib diisi!`);
        optionsRecord[opt.label] = opt.text;
      }
    }

    const payload: Question = {
      id: 'q_' + Math.random().toString(36).substr(2, 9),
      quizId: activeBankQuizId || quizzes[0]?.id,
      type: qType,
      questionText: qText,
      options: optionsRecord,
      key: qType === 'Pilihan Ganda' ? qKey : ''
    };

    onAddQuestion(payload);
    setQText('');
    setQuestionModalOpen(false);
  };

  const handleSaveDisc = () => {
    if (!discD.trim() || !discI.trim() || !discS.trim() || !discC.trim()) {
      alert("Seluruh 4 input tetrad wajib diisi!");
      return;
    }

    const payload: DiscTetrad = {
      id: 'disc_' + Math.random().toString(36).substr(2, 9),
      D: discD,
      I: discI,
      S: discS,
      C: discC
    };

    onAddDiscTetrad(payload);
    setDiscD('');
    setDiscI('');
    setDiscS('');
    setDiscC('');
    setDiscModalOpen(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Tab Menu Header Selection */}
      <div className="flex gap-1 bg-white dark:bg-gray-800 transition-colors duration-300 ease-in-out p-1.5 rounded-2xl border border-gray-200 dark:border-gray-700 select-none">
        <button
          onClick={() => setTopTab('quizzes')}
          className={`flex items-center gap-1.5 flex-1 justify-center py-2 px-4 rounded-xl text-xs font-bold transition cursor-pointer ${
            topTab === 'quizzes' ? 'bg-indigo-600 text-gray-900 dark:text-white transition-colors duration-300 ease-in-out ' : 'text-gray-600 dark:text-gray-400 transition-colors duration-300 ease-in-out hover:bg-white dark:bg-gray-800 transition-colors duration-300 ease-in-out '
          }`}
        >
          <Layers className="w-4 h-4" />
          {t.activeTests}
        </button>

        <button
          onClick={() => {
            setTopTab('academic');
            if (quizzes.length > 0 && !activeBankQuizId) {
              setActiveBankQuizId(quizzes[0].id);
            }
          }}
          className={`flex items-center gap-1.5 flex-1 justify-center py-2 px-4 rounded-xl text-xs font-bold transition cursor-pointer ${
            topTab === 'academic' ? 'bg-indigo-600 text-gray-900 dark:text-white transition-colors duration-300 ease-in-out ' : 'text-gray-600 dark:text-gray-400 transition-colors duration-300 ease-in-out hover:bg-white dark:bg-gray-800 transition-colors duration-300 ease-in-out '
          }`}
        >
          <CheckSquare className="w-4 h-4" />
          {t.academicBank}
        </button>

        <button
          onClick={() => setTopTab('disc')}
          className={`flex items-center gap-1.5 flex-1 justify-center py-2 px-4 rounded-xl text-xs font-bold transition cursor-pointer ${
            topTab === 'disc' ? 'bg-indigo-600 text-gray-900 dark:text-white transition-colors duration-300 ease-in-out ' : 'text-gray-600 dark:text-gray-400 transition-colors duration-300 ease-in-out hover:bg-white dark:bg-gray-800 transition-colors duration-300 ease-in-out '
          }`}
        >
          <BookOpen className="w-4 h-4" />
          {t.discBank}
        </button>
      </div>

      {/* RENDER VIEW: QUIZ ACTIVE LISTS */}
      {topTab === 'quizzes' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-gray-800 transition-colors duration-300 ease-in-out border border-gray-200 dark:border-gray-700 p-5 rounded-3xl text-left">
            <div>
              <h3 className="text-sm font-black text-gray-900 dark:text-white transition-colors duration-300 ease-in-out uppercase tracking-wider font-display">{t.activeTests}</h3>
              <p className="text-[11px] text-gray-500 dark:text-gray-400 transition-colors duration-300 ease-in-out mt-1 font-light">{lang === 'id' ? 'Kelola rumpun ilmu kognitif pelamar' : 'Manage academic cognitive streams'}</p>
            </div>
            <button
              onClick={handleOpenCreateModal}
              className="bg-indigo-600 hover:bg-indigo-500 text-gray-900 dark:text-white transition-colors duration-300 ease-in-out font-extrabold text-xs px-4 py-2.5 rounded-xl cursor-pointer shadow-md flex items-center gap-1.5 transition select-none"
            >
              <Plus className="w-4 h-4" />
              {t.addQuizBtn}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {quizzes.map((q) => {
              const quizRealQuestionsCount = questions.filter(quest => quest.quizId === q.id).length;
              const isFullySeeded = quizRealQuestionsCount >= q.itemCount;
              return (
                <div key={q.id} className="bg-white dark:bg-gray-800 transition-colors duration-300 ease-in-out border border-gray-200 dark:border-gray-700 rounded-2xl p-5 text-left relative overflow-hidden flex flex-col justify-between space-y-4">
                  
                  <div className="space-y-1">
                    <div className="flex justify-between items-start">
                      <span className="text-[9px] bg-gray-50 dark:bg-gray-900 transition-colors duration-300 ease-in-out text-indigo-405 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider font-mono">
                        {q.rumpun}
                      </span>
                      <span className={`text-[8.5px] px-2 py-0.5 rounded font-black uppercase ${
                        isFullySeeded ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-450'
                      }`}>
                        {isFullySeeded ? 'READY' : 'UNFINISHED'}
                      </span>
                    </div>

                    <h4 className="text-sm font-black text-gray-900 dark:text-white transition-colors duration-300 ease-in-out font-display pt-1">{q.name}</h4>
                    <span className="text-[10px] text-gray-500 dark:text-gray-400 transition-colors duration-300 ease-in-out block truncate max-w-[280px]">
                      {q.prodi} • {q.pohon}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px] text-gray-600 dark:text-gray-400 transition-colors duration-300 ease-in-out font-light border-y border-gray-200 dark:border-gray-700 py-3">
                    <div>
                      <span>{lang === 'id' ? 'Durasi' : 'Duration'}: </span>
                      <strong className="text-gray-900 dark:text-white transition-colors duration-300 ease-in-out font-semibold font-mono">{q.duration} min</strong>
                    </div>
                    <div>
                      <span>{lang === 'id' ? 'Soal/Bank' : 'Items loaded'}: </span>
                      <strong className="text-gray-900 dark:text-white transition-colors duration-300 ease-in-out font-semibold font-mono">{quizRealQuestionsCount} / {q.itemCount}</strong>
                    </div>
                  </div>

                  <div className="flex justify-between items-center bg-gray-50 dark:bg-gray-900 transition-colors duration-300 ease-in-out /40 p-2 rounded-xl text-[10.5px]">
                    <span className="text-gray-500 dark:text-gray-400 transition-colors duration-300 ease-in-out ">{lang === 'id' ? 'Deadline' : 'Deadline'}: <strong className="text-gray-800 font-semibold font-mono">{q.dateLimit}</strong></span>
                    
                    <div className="flex gap-1 select-none">
                      <button 
                        onClick={() => handleOpenEditModal(q)}
                        className="p-1.5 bg-white dark:bg-gray-800 transition-colors duration-300 ease-in-out hover:bg-white dark:bg-gray-800 transition-colors duration-300 ease-in-out text-indigo-400 rounded-lg cursor-pointer border border-gray-200 dark:border-gray-700"
                        title={t.edit}
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button 
                        onClick={() => onDeleteQuiz(q.id)}
                        className="p-1.5 bg-gray-50 dark:bg-gray-900 transition-colors duration-300 ease-in-out hover:bg-rose-500/10 text-gray-500 dark:text-gray-400 transition-colors duration-300 ease-in-out hover:text-red-400 border border-gray-200 dark:border-gray-700 hover:border-red-500/20 rounded-lg cursor-pointer"
                        title={t.delete}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* RENDER VIEW: ACADEMIC QUESTIONS BANK */}
      {topTab === 'academic' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start text-left">
          
          {/* Left panel selectors */}
          <div className="lg:col-span-4 bg-white dark:bg-gray-800 transition-colors duration-300 ease-in-out border border-gray-200 dark:border-gray-700 p-4 rounded-3xl space-y-3">
            <span className="text-[10px] text-gray-500 dark:text-gray-400 transition-colors duration-300 ease-in-out uppercase font-black tracking-wider block">
              {lang === 'id' ? 'Pilih Modul Ujian' : 'Select Exam Module'}
            </span>
            <div className="space-y-2">
              {quizzes.map((q) => {
                const isCur = activeBankQuizId === q.id;
                const questCount = questions.filter(quest => quest.quizId === q.id).length;
                return (
                  <div
                    key={q.id}
                    onClick={() => setActiveBankQuizId(q.id)}
                    className={`p-3.5 rounded-2xl border text-xs cursor-pointer transition flex items-center justify-between gap-3 ${
                      isCur 
                        ? 'bg-indigo-600/15 border-indigo-500/55 shadow' 
                        : 'bg-gray-50 dark:bg-gray-900 transition-colors duration-300 ease-in-out border-gray-200 dark:border-gray-700 hover:bg-white dark:bg-gray-800 transition-colors duration-300 ease-in-out '
                    }`}
                  >
                    <div>
                      <strong className="text-gray-900 dark:text-white transition-colors duration-300 ease-in-out block">{q.name}</strong>
                      <span className="text-[10px] text-gray-500 dark:text-gray-400 transition-colors duration-300 ease-in-out mt-1 block">{q.rumpun}</span>
                    </div>
                    <span className="text-[11px] font-bold font-mono text-gray-600 dark:text-gray-400 transition-colors duration-300 ease-in-out bg-gray-50 dark:bg-gray-900 transition-colors duration-300 ease-in-out px-2 py-0.5 rounded">
                      {questCount}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right panel list and additions */}
          <div className="lg:col-span-8 bg-white dark:bg-gray-800 transition-colors duration-300 ease-in-out border border-gray-200 dark:border-gray-700 p-5 rounded-3xl space-y-4">
            
            <div className="flex justify-between items-center pb-3 border-b border-gray-200 dark:border-gray-700 select-none">
              <span className="text-xs font-black text-gray-900 dark:text-white transition-colors duration-300 ease-in-out font-display uppercase tracking-widest">{t.questionsUnderQuiz}</span>
              <button
                onClick={() => setQuestionModalOpen(true)}
                className="bg-indigo-600 hover:bg-indigo-500 text-gray-900 dark:text-white transition-colors duration-300 ease-in-out font-extrabold text-[11px] px-3.5 py-2 rounded-xl transition cursor-pointer"
              >
                + Soal
              </button>
            </div>

            {/* Questions lists */}
            <div className="space-y-3.5 max-h-[500px] overflow-y-auto pr-1">
              {questions.filter(quest => quest.quizId === activeBankQuizId).length === 0 ? (
                <p className="border border-dashed border-gray-200 dark:border-gray-700 p-8 rounded-2xl text-xs text-gray-500 dark:text-gray-400 transition-colors duration-300 ease-in-out text-center italic">
                  {t.emptyQuestions}
                </p>
              ) : (
                questions
                  .filter(quest => quest.quizId === activeBankQuizId)
                  .map((quest, index) => (
                    <div key={quest.id} className="bg-gray-50 dark:bg-gray-900 transition-colors duration-300 ease-in-out border border-gray-200 dark:border-gray-700 p-4 rounded-xl space-y-3 relative">
                      <div className="flex justify-between items-start">
                        <span className="text-[10px] bg-white dark:bg-gray-800 transition-colors duration-300 ease-in-out text-gray-500 dark:text-gray-400 transition-colors duration-300 ease-in-out px-2 py-0.5 rounded font-bold font-mono uppercase">
                          {quest.type}
                        </span>
                        
                        <button
                          onClick={() => onDeleteQuestion(quest.id)}
                          className="text-gray-500 dark:text-gray-400 transition-colors duration-300 ease-in-out hover:text-red-400 cursor-pointer p-0.5 select-none"
                          title={t.delete}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <p className="text-gray-900 dark:text-white transition-colors duration-300 ease-in-out text-xs leading-normal font-light">
                        <strong>#{index + 1}. </strong> {quest.questionText}
                      </p>

                      {/* Render choice lists if multiple choices */}
                      {quest.type === 'Pilihan Ganda' && quest.options && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] pl-4 pt-1 text-gray-600 dark:text-gray-400 transition-colors duration-300 ease-in-out ">
                          {Object.entries(quest.options).map(([key, value]) => {
                            const isCorrect = quest.key === key;
                            return (
                              <div key={key} className={isCorrect ? 'text-emerald-400 font-bold' : 'font-light'}>
                                {key}. {value} {isCorrect && '✓'}
                              </div>
                            );
                          })}
                        </div>
                      )}

                    </div>
                  ))
              )}
            </div>

          </div>

        </div>
      )}

      {/* RENDER VIEW: DISC PERSONALITY BANK */}
      {topTab === 'disc' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-gray-800 transition-colors duration-300 ease-in-out border border-gray-200 dark:border-gray-700 p-5 rounded-3xl text-left">
            <div>
              <h3 className="text-sm font-black text-gray-900 dark:text-white transition-colors duration-300 ease-in-out uppercase tracking-wider font-display">{t.discTetradTitle}</h3>
              <p className="text-[11px] text-gray-600 dark:text-gray-400 transition-colors duration-300 ease-in-out mt-1 font-light leading-relaxed max-w-xl">{t.discDescription}</p>
            </div>
            <button
              onClick={() => setDiscModalOpen(true)}
              className="bg-indigo-600 hover:bg-indigo-500 text-gray-900 dark:text-white transition-colors duration-300 ease-in-out font-extrabold text-xs px-4 py-2.5 rounded-xl cursor-pointer shadow flex items-center gap-1 transition select-none shrink-0"
            >
              <Plus className="w-4 h-4" />
              {t.addDiscBtn}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
            {discTetrads.map((tet, idx) => (
              <div key={tet.id} className="bg-white dark:bg-gray-800 transition-colors duration-300 ease-in-out border border-gray-200 dark:border-gray-700 p-5 rounded-2xl relative space-y-3">
                <div className="flex justify-between items-center pb-2 border-b border-gray-200 dark:border-gray-700">
                  <span className="text-[10px] text-gray-500 dark:text-gray-400 transition-colors duration-300 ease-in-out font-black font-mono">DISC TETRAD BUNDLE #{idx + 1}</span>
                  <button
                    onClick={() => onDeleteDiscTetrad(tet.id)}
                    className="text-gray-500 dark:text-gray-400 transition-colors duration-300 ease-in-out hover:text-red-405 p-1 rounded hover:bg-red-500/10 cursor-pointer transition select-none"
                    title={t.delete}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="space-y-2 text-xs leading-normal">
                  <div className="flex gap-2 items-start">
                    <strong className="text-rose-455 font-mono shrink-0 w-8">[D]</strong>
                    <span className="text-gray-800 font-light">{tet.D}</span>
                  </div>
                  <div className="flex gap-2 items-start">
                    <strong className="text-amber-455 font-mono shrink-0 w-8">[I]</strong>
                    <span className="text-gray-800 font-light">{tet.I}</span>
                  </div>
                  <div className="flex gap-2 items-start">
                    <strong className="text-emerald-455 font-mono shrink-0 w-8">[S]</strong>
                    <span className="text-gray-800 font-light">{tet.S}</span>
                  </div>
                  <div className="flex gap-2 items-start">
                    <strong className="text-blue-455 font-mono shrink-0 w-8">[C]</strong>
                    <span className="text-gray-800 font-light">{tet.C}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL WINDOW: CREATING OR EDITING ACADEMIC EXAMS */}
      {quizModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0b0e14] border border-gray-200 dark:border-gray-700 rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl animate-in duration-200">
            <div className="bg-[#0e121a] p-4.5 border-b border-gray-200 dark:border-gray-700 text-left flex justify-between items-center select-none">
              <h3 className="text-sm font-black text-gray-900 dark:text-white transition-colors duration-300 ease-in-out font-display uppercase tracking-widest">
                {editingQuiz ? t.edit : t.addQuizBtn}
              </h3>
              <button onClick={() => setQuizModalOpen(false)} className="text-gray-500 dark:text-gray-400 transition-colors duration-300 ease-in-out hover:text-gray-900 dark:text-white transition-colors duration-300 ease-in-out cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveQuiz} className="p-5 text-left space-y-4 max-h-[80vh] overflow-y-auto pr-2">
              <div className="space-y-1">
                <label className="text-[10px] text-gray-500 dark:text-gray-400 transition-colors duration-300 ease-in-out font-bold uppercase tracking-wider">{t.quizName}</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Tes Dasar Coding Python"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-gray-900 transition-colors duration-300 ease-in-out border border-gray-200 dark:border-gray-700 rounded-xl p-2.5 text-xs text-gray-900 dark:text-white transition-colors duration-300 ease-in-out placeholder-slate-700 focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* Dynamic 3-Level selector row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] text-gray-500 dark:text-gray-400 transition-colors duration-300 ease-in-out font-bold uppercase tracking-wider">{t.rumpun}</label>
                  <select
                    required
                    value={formRumpun}
                    onChange={(e) => {
                      setFormRumpun(e.target.value);
                      setFormPohon('');
                      setFormProdi('');
                    }}
                    className="w-full bg-gray-50 dark:bg-gray-900 transition-colors duration-300 ease-in-out border border-gray-200 dark:border-gray-700 text-xs text-gray-800 rounded-xl p-2.5 cursor-pointer focus:outline-none focus:border-indigo-500"
                  >
                    <option value="">-- {t.rumpun} --</option>
                    {Object.keys(REFERENSI_ILMU).map(rup => (
                      <option key={rup} value={rup}>{rup}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-gray-500 dark:text-gray-400 transition-colors duration-300 ease-in-out font-bold uppercase tracking-wider">{t.pohon}</label>
                  <select
                    required
                    disabled={!formRumpun}
                    value={formPohon}
                    onChange={(e) => {
                      setFormPohon(e.target.value);
                      setFormProdi('');
                    }}
                    className="w-full bg-gray-50 dark:bg-gray-900 transition-colors duration-300 ease-in-out border border-gray-200 dark:border-gray-700 text-xs text-gray-900 dark:text-white transition-colors duration-300 ease-in-out rounded-xl p-2.5 cursor-pointer focus:outline-none focus:border-indigo-500 disabled:opacity-45"
                  >
                    <option value="">-- {t.pohon} --</option>
                    {pohonList.map(poh => (
                      <option key={poh} value={poh}>{poh}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-gray-500 dark:text-gray-400 transition-colors duration-300 ease-in-out font-bold uppercase tracking-wider">{t.prodi}</label>
                  <select
                    required
                    disabled={!formPohon}
                    value={formProdi}
                    onChange={(e) => setFormProdi(e.target.value)}
                    className="w-full bg-gray-50 dark:bg-gray-900 transition-colors duration-300 ease-in-out border border-gray-200 dark:border-gray-700 text-xs text-gray-900 dark:text-white transition-colors duration-300 ease-in-out rounded-xl p-2.5 cursor-pointer focus:outline-none focus:border-indigo-500 disabled:opacity-45"
                  >
                    <option value="">-- {t.prodi} --</option>
                    {prodiList.map(prd => (
                      <option key={prd} value={prd}>{prd}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Duration and Date limits */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] text-gray-500 dark:text-gray-400 transition-colors duration-300 ease-in-out font-bold uppercase tracking-wider">{t.duration}</label>
                  <input
                    type="number"
                    required
                    min={5}
                    max={120}
                    value={formDuration}
                    onChange={(e) => setFormDuration(Number(e.target.value))}
                    className="w-full bg-gray-50 dark:bg-gray-900 transition-colors duration-300 ease-in-out border border-gray-200 dark:border-gray-700 rounded-xl p-2.5 text-xs text-gray-900 dark:text-white transition-colors duration-300 ease-in-out focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-gray-500 dark:text-gray-400 transition-colors duration-300 ease-in-out font-bold uppercase tracking-wider">{t.questionCount}</label>
                  <input
                    type="number"
                    required
                    min={5}
                    value={formCount}
                    onChange={(e) => setFormCount(Number(e.target.value))}
                    className="w-full bg-gray-50 dark:bg-gray-900 transition-colors duration-300 ease-in-out border border-gray-200 dark:border-gray-700 rounded-xl p-2.5 text-xs text-gray-900 dark:text-white transition-colors duration-300 ease-in-out focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-gray-500 dark:text-gray-400 transition-colors duration-300 ease-in-out font-bold uppercase tracking-wider">{t.scheduledDate}</label>
                  <input
                    type="date"
                    required
                    className="w-full bg-gray-50 dark:bg-gray-900 transition-colors duration-300 ease-in-out border border-gray-200 dark:border-gray-700 rounded-xl p-2.5 text-xs text-gray-900 dark:text-white transition-colors duration-300 ease-in-out focus:outline-none"
                    value={formLimitDate}
                    onChange={(e) => setFormLimitDate(e.target.value)}
                  />
                </div>
              </div>

              {/* Job Targets checklist */}
              <div className="space-y-2 pt-2 border-t border-gray-200 dark:border-gray-700 text-xs">
                <div className="flex justify-between items-center text-[10px] text-gray-500 dark:text-gray-400 transition-colors duration-300 ease-in-out uppercase font-bold tracking-wider">
                  <span className="block">{t.targetJobs}</span>
                  <label className="flex items-center gap-1.5 cursor-pointer text-indigo-400">
                    <input
                      type="checkbox"
                      checked={allJobsChecked}
                      onChange={(e) => {
                        setAllJobsChecked(e.target.checked);
                        if (e.target.checked) setFormJobs([]);
                      }}
                    />
                    {t.allJobs}
                  </label>
                </div>

                <div className="bg-gray-50 dark:bg-gray-900 transition-colors duration-300 ease-in-out border border-gray-200 dark:border-gray-700 rounded-2xl p-4.5 grid grid-cols-2 gap-2.5 max-h-[140px] overflow-y-auto leading-none select-none">
                  {JOBS_CHECKLIST.map(job => (
                    <label key={job} className={`flex items-center gap-2 p-2 rounded-xl text-xs cursor-pointer border transition leading-normal ${
                      allJobsChecked ? 'opacity-35 cursor-not-allowed border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 transition-colors duration-300 ease-in-out ' : 
                      formJobs.includes(job) ? 'bg-indigo-600/10 border-indigo-500/50 text-indigo-400' : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 transition-colors duration-300 ease-in-out hover:bg-white dark:bg-gray-800 transition-colors duration-300 ease-in-out '
                    }`}>
                      <input
                        type="checkbox"
                        disabled={allJobsChecked}
                        checked={!allJobsChecked && formJobs.includes(job)}
                        onChange={() => handleToggleJobCheckbox(job)}
                        className="rounded"
                      />
                      <span>{job}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Controls */}
              <div className="flex justify-end gap-3 pt-3 border-t border-gray-200 dark:border-gray-700 select-none">
                <button
                  type="button"
                  onClick={() => setQuizModalOpen(false)}
                  className="bg-white dark:bg-gray-800 transition-colors duration-300 ease-in-out border border-gray-200 dark:border-gray-700 hover:bg-white dark:bg-gray-800 transition-colors duration-300 ease-in-out text-gray-500 dark:text-gray-400 transition-colors duration-300 ease-in-out font-semibold px-4 py-2 rounded-xl text-xs cursor-pointer transition select-none"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-500 text-gray-900 dark:text-white transition-colors duration-300 ease-in-out font-extrabold px-5 py-2.5 rounded-xl text-xs cursor-pointer transition select-none border border-indigo-500 shadow"
                >
                  {t.save}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* MODAL WINDOW: CREATING NEW QUESTIONS (ACADEMIC MCQ/ESSAY) */}
      {questionModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0b0e14] border border-gray-200 dark:border-gray-700 rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl animate-in duration-200 text-left">
            <div className="bg-[#0e121a] p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center select-none">
              <h3 className="text-sm font-black text-gray-900 dark:text-white transition-colors duration-300 ease-in-out font-display uppercase tracking-widest">{t.addQuestionBtn}</h3>
              <button onClick={() => setQuestionModalOpen(false)} className="text-gray-500 dark:text-gray-400 transition-colors duration-300 ease-in-out hover:text-gray-900 dark:text-white transition-colors duration-300 ease-in-out cursor-pointer animate-in">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4 max-h-[82vh] overflow-y-auto pr-2">
              <div className="space-y-1">
                <label className="text-[10px] text-gray-500 dark:text-gray-400 transition-colors duration-300 ease-in-out uppercase font-black tracking-wider block">{t.questionType}</label>
                <select
                  value={qType}
                  onChange={(e) => setQType(e.target.value as any)}
                  className="w-full bg-gray-50 dark:bg-gray-900 transition-colors duration-300 ease-in-out border border-gray-200 dark:border-gray-700 text-xs text-gray-900 dark:text-white transition-colors duration-300 ease-in-out rounded-xl p-2.5 cursor-pointer focus:outline-none"
                >
                  <option value="Pilihan Ganda">{t.mcq}</option>
                  <option value="Essay">{t.essay}</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-gray-500 dark:text-gray-400 transition-colors duration-300 ease-in-out uppercase font-black tracking-wider block">{t.questionInput}</label>
                <textarea
                  rows={3}
                  required
                  placeholder="e.g. Di manakah letak file CSS utama di folder React?"
                  className="w-full bg-gray-50 dark:bg-gray-900 transition-colors duration-300 ease-in-out border border-gray-200 dark:border-gray-700 rounded-xl p-3 text-xs text-gray-900 dark:text-white transition-colors duration-300 ease-in-out placeholder-slate-700 focus:outline-none leading-relaxed"
                  value={qText}
                  onChange={(e) => setQText(e.target.value)}
                />
              </div>

              {/* Choices rendering conditionally */}
              {qType === 'Pilihan Ganda' && (
                <div className="space-y-3.5 border-t border-gray-200 dark:border-gray-700 pt-3.5 select-none">
                  <div className="flex justify-between items-center select-none">
                    <label className="text-[10px] text-gray-500 dark:text-gray-400 transition-colors duration-300 ease-in-out uppercase font-black tracking-wider block">{t.choices}</label>
                    <button
                      type="button"
                      onClick={handleAddChoiceOption}
                      className="text-xs text-indigo-400 hover:text-indigo-305 font-bold cursor-pointer"
                    >
                      {t.addChoice}
                    </button>
                  </div>

                  <div className="space-y-2">
                    {qChoices.map((opt, idx) => (
                      <div key={opt.label} className="flex gap-2 items-center">
                        <strong className="text-gray-600 dark:text-gray-400 transition-colors duration-300 ease-in-out font-mono text-xs w-6 shrink-0 text-center">{opt.label}.</strong>
                        <input
                          type="text"
                          required
                          placeholder="Teks opsi pilihan"
                          className="flex-1 bg-gray-50 dark:bg-gray-900 transition-colors duration-300 ease-in-out border border-gray-200 dark:border-gray-700 rounded-xl p-2.5 text-xs text-gray-900 dark:text-white transition-colors duration-300 ease-in-out focus:outline-none"
                          value={opt.text}
                          onChange={(e) => {
                            const val = e.target.value;
                            setQChoices(prev => prev.map((item, i) => i === idx ? { ...item, text: val } : item));
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveChoiceOption(idx)}
                          className="p-1 px-2.5 bg-gray-50 dark:bg-gray-900 transition-colors duration-300 ease-in-out hover:bg-rose-500/10 text-gray-500 dark:text-gray-400 transition-colors duration-300 ease-in-out hover:text-red-400 border border-gray-200 dark:border-gray-700 rounded-xl cursor-pointer"
                        >
                          &times;
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-1 pt-2">
                    <label className="text-[10px] text-gray-500 dark:text-gray-400 transition-colors duration-300 ease-in-out uppercase font-black tracking-wider block">{t.correctKey}</label>
                    <select
                      value={qKey}
                      onChange={(e) => setQKey(e.target.value)}
                      className="w-full bg-gray-50 dark:bg-gray-900 transition-colors duration-300 ease-in-out border border-gray-200 dark:border-gray-700 text-xs text-gray-900 dark:text-white transition-colors duration-300 ease-in-out rounded-xl p-2.5 cursor-pointer focus:outline-none"
                    >
                      {qChoices.map(opt => (
                        <option key={opt.label} value={opt.label}>Pilihan {opt.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {/* Controls */}
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700 select-none">
                <button
                  type="button"
                  onClick={() => setQuestionModalOpen(false)}
                  className="bg-white dark:bg-gray-800 transition-colors duration-300 ease-in-out border border-gray-200 dark:border-gray-700 hover:bg-white dark:bg-gray-800 transition-colors duration-300 ease-in-out text-gray-500 dark:text-gray-400 transition-colors duration-300 ease-in-out font-semibold px-4 py-2 rounded-xl text-xs cursor-pointer transition select-none"
                >
                  {t.cancel}
                </button>
                <button
                  type="button"
                  onClick={handleSaveQuestion}
                  className="bg-indigo-600 hover:bg-indigo-500 text-gray-900 dark:text-white transition-colors duration-300 ease-in-out font-extrabold px-5 py-2.5 rounded-xl text-xs cursor-pointer transition select-none border border-indigo-500 shadow"
                >
                  {t.save}
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* MODAL WINDOW: CREATING NEW DISC QUESTIONS */}
      {discModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0b0e14] border border-gray-200 dark:border-gray-700 rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl animate-in duration-200 text-left">
            <div className="bg-[#0e121a] p-4.5 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center select-none">
              <h3 className="text-sm font-black text-gray-900 dark:text-white transition-colors duration-300 ease-in-out font-display uppercase tracking-widest">{t.addDiscBtn}</h3>
              <button onClick={() => setDiscModalOpen(false)} className="text-gray-500 dark:text-gray-400 transition-colors duration-300 ease-in-out hover:text-gray-900 dark:text-white transition-colors duration-300 ease-in-out cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <p className="text-[11px] text-gray-500 dark:text-gray-400 transition-colors duration-300 ease-in-out leading-relaxed italic border-l-2 border-amber-500/50 pl-3">
                {t.discDescription}
              </p>

              {/* D Option */}
              <div className="space-y-1 leading-none">
                <label className="text-[10px] text-rose-400 font-extrabold uppercase tracking-wider flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block shrink-0" />
                  Dominance (D) Statement
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Berorientasi pada tindakan nyata, berani, and tegas mengambil keputusan"
                  value={discD}
                  onChange={(e) => setDiscD(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-gray-900 transition-colors duration-300 ease-in-out border border-gray-200 dark:border-gray-700 rounded-xl p-2.5 text-xs text-gray-900 dark:text-white transition-colors duration-300 ease-in-out focus:outline-none"
                />
              </div>

              {/* I Option */}
              <div className="space-y-1 leading-none">
                <label className="text-[10px] text-indigo-600 font-extrabold uppercase tracking-wider flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 text-gray-900 dark:text-white transition-colors duration-300 ease-in-out inline-block shrink-0" />
                  Influence (I) Statement
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Suka berkomunikasi, persuasive, antusias bersosialisasi"
                  value={discI}
                  onChange={(e) => setDiscI(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-gray-900 transition-colors duration-300 ease-in-out border border-gray-200 dark:border-gray-700 rounded-xl p-2.5 text-xs text-gray-900 dark:text-white transition-colors duration-300 ease-in-out focus:outline-none"
                />
              </div>

              {/* S Option */}
              <div className="space-y-1 leading-none">
                <label className="text-[10px] text-emerald-400 font-extrabold uppercase tracking-wider flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block shrink-0" />
                  Steadiness (S) Statement
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Tenang, loyal, empati tinggi dan menghargai konsistensi tim"
                  value={discS}
                  onChange={(e) => setDiscS(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-gray-900 transition-colors duration-300 ease-in-out border border-gray-200 dark:border-gray-700 rounded-xl p-2.5 text-xs text-gray-900 dark:text-white transition-colors duration-300 ease-in-out focus:outline-none"
                />
              </div>

              {/* C Option */}
              <div className="space-y-1 leading-none">
                <label className="text-[10px] text-blue-450 font-extrabold uppercase tracking-wider flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block shrink-0" />
                  Compliance (C) Statement
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Akurat, taat aturan, terperinci, and sangat metodis"
                  value={discC}
                  onChange={(e) => setDiscC(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-gray-900 transition-colors duration-300 ease-in-out border border-gray-200 dark:border-gray-700 rounded-xl p-2.5 text-xs text-gray-900 dark:text-white transition-colors duration-300 ease-in-out focus:outline-none"
                />
              </div>

              {/* Controls */}
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700 select-none">
                <button
                  type="button"
                  onClick={() => setDiscModalOpen(false)}
                  className="bg-white dark:bg-gray-800 transition-colors duration-300 ease-in-out border border-gray-200 dark:border-gray-700 hover:bg-white dark:bg-gray-800 transition-colors duration-300 ease-in-out text-gray-500 dark:text-gray-400 transition-colors duration-300 ease-in-out font-semibold px-4 py-2 rounded-xl text-xs cursor-pointer transition select-none"
                >
                  {t.cancel}
                </button>
                <button
                  type="button"
                  onClick={handleSaveDisc}
                  className="bg-indigo-600 hover:bg-indigo-500 text-gray-900 dark:text-white transition-colors duration-300 ease-in-out font-extrabold px-5 py-2.5 rounded-xl text-xs cursor-pointer transition select-none border border-indigo-500 shadow"
                >
                  {t.save}
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}
