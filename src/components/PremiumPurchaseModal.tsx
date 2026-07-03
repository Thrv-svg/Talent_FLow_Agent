import React, { useState } from 'react';
import { X, Crown, CheckCircle2, QrCode, Smartphone, CreditCard, ChevronRight, Sparkles } from 'lucide-react';
import apiClient from '../apiClient';

interface PremiumPurchaseModalProps {
  onClose: () => void;
  onSuccess: (paymentData: any) => void;
  profile: any;
}

export default function PremiumPurchaseModal({ onClose, onSuccess, profile }: PremiumPurchaseModalProps) {
  const [step, setStep] = useState<'plan' | 'method' | 'qris' | 'processing' | 'under_development'>('plan');
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);

  const handleSimulatePayment = async () => {
    setStep('processing');
    
    try {
      await apiClient.post('/api/user/request-premium');
      onSuccess({});
    } catch (err) {
      console.error('Failed to request premium', err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-50 dark:bg-gray-900 transition-colors duration-300 ease-in-out /80 backdrop-blur-md">
      <div className="bg-white dark:bg-gray-800 transition-colors duration-300 ease-in-out border border-gray-200 dark:border-gray-700 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between bg-white dark:bg-gray-800 transition-colors duration-300 ease-in-out ">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-600 to-indigo-600 p-0.5 flex items-center justify-center shadow-lg shadow-amber-500/20">
              <div className="w-full h-full bg-gray-50 dark:bg-gray-900 transition-colors duration-300 ease-in-out rounded-[10px] flex items-center justify-center">
                <Crown className="w-4 h-4 text-indigo-600 fill-amber-500" />
              </div>
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white transition-colors duration-300 ease-in-out ">Upgrade ke Premium</h3>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 transition-colors duration-300 ease-in-out hover:bg-white dark:bg-gray-800 transition-colors duration-300 ease-in-out flex items-center justify-center text-gray-600 dark:text-gray-400 transition-colors duration-300 ease-in-out hover:text-gray-900 dark:text-white transition-colors duration-300 ease-in-out transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6">
          {step === 'plan' && (
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-black text-gray-900 dark:text-white transition-colors duration-300 ease-in-out ">Status Prioritas Recruiter</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-300 ease-in-out ">Peluang dilirik HRD naik drastis dengan status Premium.</p>
              </div>

              <div className="bg-gray-50 dark:bg-gray-900 transition-colors duration-300 ease-in-out p-5 rounded-2xl border border-amber-500/20 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600 text-gray-900 dark:text-white transition-colors duration-300 ease-in-out /10 rounded-full blur-3xl" />
                
                <div className="space-y-4 relative z-10">
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-gray-800 font-medium">Anggota Premium</span>
                    <div className="text-right">
                      <span className="text-2xl font-black text-indigo-500">Rp 150.000</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400 transition-colors duration-300 ease-in-out block">/ akses selamanya</span>
                    </div>
                  </div>
                  
                  <ul className="space-y-3">
                    <li className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-5 h-5 text-indigo-600 shrink-0" />
                      <span className="text-sm text-gray-800"><strong className="text-gray-900 dark:text-white transition-colors duration-300 ease-in-out ">Lencana Kehormatan Emas</strong> di portal Admin & HRD.</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-5 h-5 text-indigo-600 shrink-0" />
                      <span className="text-sm text-gray-800">Posisi sortir teratas <strong className="text-gray-900 dark:text-white transition-colors duration-300 ease-in-out ">(Prioritas Tampil).</strong></span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-5 h-5 text-indigo-600 shrink-0" />
                      <span className="text-sm text-gray-800"><strong className="text-gray-900 dark:text-white transition-colors duration-300 ease-in-out ">Kesempatan Mengulang (Retake)</strong> kuis tak terbatas.</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-5 h-5 text-indigo-600 shrink-0" />
                      <span className="text-sm text-gray-800">Tema Talent Card eksklusif Gold / Neon.</span>
                    </li>
                  </ul>
                </div>
              </div>

              <button 
                onClick={() => setStep('method')}
                className="w-full py-3.5 bg-indigo-600 text-gray-900 dark:text-white transition-colors duration-300 ease-in-out hover:bg-indigo-700 text-gray-900 dark:text-white transition-colors duration-300 ease-in-out rounded-xl font-bold tracking-wide flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(245,158,11,0.25)] transition-all"
              >
                Pilih Metode Pembayaran <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}

          {step === 'method' && (
            <div className="space-y-6">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white transition-colors duration-300 ease-in-out mb-2">Pilih Metode Pembayaran</h2>

              <div className="space-y-4">
                {/* QRIS */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-gray-500 dark:text-gray-400 transition-colors duration-300 ease-in-out uppercase tracking-widest pl-1">Scan QRIS</span>
                  <button 
                    onClick={() => { setSelectedMethod('QRIS'); setStep('qris'); }}
                    className="w-full flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-gray-900 transition-colors duration-300 ease-in-out border border-gray-200 dark:border-gray-700 hover:border-amber-500/50 hover:bg-white dark:bg-gray-800 transition-colors duration-300 ease-in-out focus:ring-1 focus:ring-amber-500 transition-all text-left"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-indigo-500/10 rounded-lg flex items-center justify-center text-indigo-400">
                        <QrCode className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900 dark:text-white transition-colors duration-300 ease-in-out ">QRIS (Semua Bank / E-Wallet)</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 transition-colors duration-300 ease-in-out ">Otomatis Terverifikasi</div>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-500 dark:text-gray-400 transition-colors duration-300 ease-in-out " />
                  </button>
                </div>

                {/* E-Wallet */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-gray-500 dark:text-gray-400 transition-colors duration-300 ease-in-out uppercase tracking-widest pl-1">E-Wallet</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {['GoPay', 'OVO', 'DANA', 'ShopeePay'].map(method => (
                      <button 
                        key={method}
                        onClick={() => setStep('under_development')}
                        className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-900 transition-colors duration-300 ease-in-out border border-gray-200 dark:border-gray-700 hover:border-emerald-500/50 hover:bg-white dark:bg-gray-800 transition-colors duration-300 ease-in-out transition-all text-left"
                      >
                        <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                          <Smartphone className="w-4 h-4" />
                        </div>
                        <span className="font-semibold text-sm text-gray-800">{method}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* M-Banking / Virtual Account */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-gray-500 dark:text-gray-400 transition-colors duration-300 ease-in-out uppercase tracking-widest pl-1">M-Banking / Virtual Account</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {['BCA Virtual Account', 'Mandiri Virtual Account', 'BNI Virtual Account', 'BRI Virtual Account'].map(method => (
                      <button 
                        key={method}
                        onClick={() => setStep('under_development')}
                        className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-900 transition-colors duration-300 ease-in-out border border-gray-200 dark:border-gray-700 hover:border-blue-500/50 hover:bg-white dark:bg-gray-800 transition-colors duration-300 ease-in-out transition-all text-left"
                      >
                        <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400">
                          <CreditCard className="w-4 h-4" />
                        </div>
                        <span className="font-semibold text-sm text-gray-800 truncate pr-2">{method}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 'qris' && (
            <div className="space-y-6 text-center">
              <div className="bg-white dark:bg-gray-800 transition-colors duration-300 ease-in-out p-4 rounded-2xl w-64 mx-auto flex items-center justify-center overflow-hidden">
                <img src="/images/premium_qr_payment.png.jpeg" alt="Scan QRIS" className="w-full h-auto object-contain keep-colors" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white transition-colors duration-300 ease-in-out mb-1">Scan QRIS ini</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-300 ease-in-out ">Buka aplikasi E-Wallet atau M-Banking Anda dan scan QR di atas untuk menyelesaikan pesanan.</p>
              </div>

              <div className="bg-gray-50 dark:bg-gray-900 transition-colors duration-300 ease-in-out p-4 rounded-xl border border-gray-200 dark:border-gray-700 flex justify-between items-center text-sm">
                <span className="text-gray-600 dark:text-gray-400 transition-colors duration-300 ease-in-out ">Total Pembayaran</span>
                <span className="text-lg font-black text-indigo-500">Rp 150.000</span>
              </div>

              <button 
                onClick={handleSimulatePayment}
                className="w-full py-3.5 bg-indigo-600 text-gray-900 dark:text-white transition-colors duration-300 ease-in-out hover:bg-indigo-700 text-gray-900 dark:text-white transition-colors duration-300 ease-in-out rounded-xl font-bold tracking-wide shadow-[0_0_20px_rgba(245,158,11,0.25)] transition-all"
              >
                Konfirmasi Pembayaran
              </button>
            </div>
          )}

          {step === 'processing' && (
            <div className="py-12 space-y-6 flex flex-col items-center justify-center">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-amber-500/20 border-t-amber-500 rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-indigo-600 animate-pulse" />
                </div>
              </div>
              <div className="text-center space-y-2">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white transition-colors duration-300 ease-in-out ">Memproses Pembayaran...</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-300 ease-in-out ">Mohon tunggu, jangan tutup halaman ini.</p>
              </div>
            </div>
          )}

          {step === 'under_development' && (
            <div className="py-12 space-y-6 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 bg-white dark:bg-gray-800 transition-colors duration-300 ease-in-out rounded-2xl flex items-center justify-center text-gray-500 dark:text-gray-400 transition-colors duration-300 ease-in-out mb-2">
                <span className="text-3xl">🚧</span>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white transition-colors duration-300 ease-in-out ">Fitur Belum Tersedia</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-300 ease-in-out max-w-xs mx-auto">
                  Fitur pembayaran ini sedang dalam tahap pengembangan. Silakan gunakan metode QRIS untuk saat ini.
                </p>
              </div>
              <button 
                onClick={() => setStep('method')}
                className="mt-4 px-6 py-3 bg-white dark:bg-gray-800 transition-colors duration-300 ease-in-out hover:bg-white dark:bg-gray-800 transition-colors duration-300 ease-in-out text-gray-900 dark:text-white transition-colors duration-300 ease-in-out rounded-xl font-semibold transition-all"
              >
                Kembali ke Metode Pembayaran
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
