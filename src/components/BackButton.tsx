import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function BackButton() {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleBackClick = () => {
    const path = location.pathname;
    if (path === '/dashboard' || path === '/admin' || path === '/company') {
      setShowLogoutModal(true);
    } else {
      navigate(-1);
    }
  };

  const handleLogout = () => {
    setShowLogoutModal(false);
    // Add any additional logout logic here, then redirect
    navigate('/login');
  };

  return (
    <>
      <button
        onClick={handleBackClick}
        className="fixed top-6 left-6 z-[60] bg-white/80 backdrop-blur-md border border-[#e5e7eb] shadow-sm text-[#262626] hover:bg-gray-50 p-3 rounded-full flex items-center justify-center transition-all cursor-pointer"
        aria-label="Go Back"
      >
        <ArrowLeft className="w-5 h-5" />
      </button>

      {showLogoutModal && (
        <div className="fixed inset-0 z-[70] bg-[#262626]/20 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white p-10 max-w-sm w-full rounded-[2rem] shadow-[0_28px_60px_-42px_rgba(0,0,0,0.72)] flex flex-col">
            <h3 className="text-xl font-semibold text-[#262626] mb-2">Keluar dari Akun?</h3>
            <p className="text-[#595959] text-sm mb-8">Apakah Anda yakin ingin keluar dari sesi ini?</p>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="w-full rounded-full border border-[#e5e7eb] bg-transparent text-[#262626] py-3.5 font-medium hover:bg-gray-50 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleLogout}
                className="w-full rounded-full bg-[#262626] text-white py-3.5 font-medium hover:scale-[1.02] transition-transform"
              >
                Keluar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
