/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { CheckCircle2, ShieldAlert } from 'lucide-react';
import apiClient from '../apiClient';

interface PendingUser {
  id: number;
  email: string;
  profile: string; 
}

interface AdminPaymentsProps {
  payments: PendingUser[];
  lang: 'id' | 'en';
  onVerify: () => void;
}

const LOCALIZATION = {
  id: {
    title: "Validasi Pembayaran",
    subTitle: "Daftar pelamar yang telah mengkonfirmasi pembayaran dan menunggu verifikasi.",
    applicant: "Pelamar / NIK",
    status: "Status",
    action: "Aksi",
    approveBtn: "Verifikasi (Approve)",
    processing: "Memproses..."
  },
  en: {
    title: "Payment Validation",
    subTitle: "List of applicants who have confirmed payment and pending verification.",
    applicant: "Applicant / NIK",
    status: "Status",
    action: "Action",
    approveBtn: "Approve",
    processing: "Processing..."
  }
};

export default function AdminPayments({
  payments,
  lang,
  onVerify
}: AdminPaymentsProps) {
  const t = LOCALIZATION[lang];
  const [processingId, setProcessingId] = useState<number | null>(null);

  const handleApprove = async (userId: number) => {
    setProcessingId(userId);
    try {
      const { data } = await apiClient.post('/api/admin/approve-premium', { userId });
      if (data.success) {
        onVerify(); // Refresh list
      }
    } catch (err) {
      console.error(err);
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="text-left">
        <h2 className="text-xl font-black text-gray-900 dark:text-white transition-colors duration-300 ease-in-out font-display flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-indigo-400" />
          {t.title}
        </h2>
        <p className="text-xs text-gray-600 dark:text-gray-400 transition-colors duration-300 ease-in-out mt-1 font-light leading-relaxed">
          {t.subTitle}
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 transition-colors duration-300 ease-in-out border border-gray-200 dark:border-gray-700 rounded-3xl overflow-hidden text-left">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-900 transition-colors duration-300 ease-in-out border-b border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 transition-colors duration-300 ease-in-out uppercase tracking-wider font-bold">
                <th className="p-4">{t.applicant}</th>
                <th className="p-4">{t.status}</th>
                <th className="p-4 text-center">{t.action}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-850">
              {payments.map((p) => {
                const profileData = JSON.parse(p.profile || '{}');
                return (
                  <tr key={p.id} className="hover:bg-white dark:bg-gray-800 transition-colors duration-300 ease-in-out transition">
                    <td className="p-4">
                      <strong className="text-gray-900 dark:text-white transition-colors duration-300 ease-in-out block font-semibold">{profileData.name || p.email}</strong>
                      <span className="text-[10px] text-gray-500 dark:text-gray-400 transition-colors duration-300 ease-in-out block mt-0.5 font-mono">
                        NIK: {profileData.nik || '-'} | Email: {p.email}
                      </span>
                    </td>
                    
                    <td className="p-4">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] leading-none uppercase font-bold inline-block bg-indigo-600 text-gray-900 dark:text-white transition-colors duration-300 ease-in-out /10 text-indigo-600 border border-amber-500/20">
                        PENDING
                      </span>
                    </td>

                    <td className="p-4 text-center">
                      <button
                        onClick={() => handleApprove(p.id)}
                        disabled={processingId === p.id}
                        className="bg-emerald-500 hover:bg-emerald-400 text-gray-900 dark:text-white transition-colors duration-300 ease-in-out px-4 py-2 rounded-xl font-bold shadow-[0_0_15px_rgba(16,185,129,0.2)] disabled:opacity-50 transition-all flex items-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 justify-center mx-auto"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        {processingId === p.id ? t.processing : t.approveBtn}
                      </button>
                    </td>
                  </tr>
                );
              })}
              {payments.length === 0 && (
                <tr>
                  <td colSpan={3} className="p-8 text-center text-gray-500 dark:text-gray-400 transition-colors duration-300 ease-in-out italic">
                    Tidak ada pembayaran yang menunggu verifikasi.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
