/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Sparkles, ArrowLeft } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';
import apiClient from '../apiClient';

interface LoginViewProps {
  onLoginSuccess: (userData: any, savedState?: any, isNewUser?: boolean) => void;
  onSwitchToRegister: () => void;
  onBack?: () => void;
}

export default function LoginView({ onLoginSuccess, onSwitchToRegister, onBack }: LoginViewProps) {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Forgot password states
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [forgotStep, setForgotStep] = useState<'request' | 'verify'>('request');
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotCode, setForgotCode] = useState('');
  const [forgotNewPassword, setForgotNewPassword] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setLoading(true);
    setErrorMsg('');

    try {
      const response = await apiClient.post('/api/login', { email, password });
      const result = response.data;

      if (result.success) {
        localStorage.setItem('talentflow_token', result.token);
        localStorage.setItem('talentflow_user', JSON.stringify(result.data));
        onLoginSuccess(result.data, result.savedState);
      } else {
        setErrorMsg(result.message || 'Email atau password salah.');
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.response?.data?.message || 'Gagal terhubung ke server.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    setLoading(true);
    setErrorMsg('');
    try {
      const response = await apiClient.post('/api/auth/google', { token: credentialResponse.credential });
      const result = response.data;
      if (result.success) {
        localStorage.setItem('talentflow_token', result.token);
        localStorage.setItem('talentflow_user', JSON.stringify(result.data));
        onLoginSuccess(result.data, result.savedState, result.isNewUser);
      } else {
        setErrorMsg(result.message || 'Gagal login via Google.');
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.response?.data?.message || 'Gagal terhubung ke server.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPasswordRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail) return;

    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const response = await apiClient.post('/api/auth/forgot-password-request', { email: forgotEmail });
      if (response.data.success) {
        setSuccessMsg(response.data.message);
        setForgotStep('verify');
      } else {
        setErrorMsg(response.data.message || 'Gagal meminta reset password.');
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.response?.data?.message || 'Terjadi kesalahan server.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail || !forgotCode || !forgotNewPassword) return;

    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const response = await apiClient.post('/api/auth/forgot-password-reset', {
        email: forgotEmail,
        code: forgotCode,
        newPassword: forgotNewPassword
      });
      if (response.data.success) {
        setSuccessMsg(response.data.message);
        setIsForgotPassword(false);
        setForgotStep('request');
        setForgotEmail('');
        setForgotCode('');
        setForgotNewPassword('');
        // Automatically prefill email on login page
        setEmail(forgotEmail);
      } else {
        setErrorMsg(response.data.message || 'Gagal mereset password.');
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.response?.data?.message || 'Terjadi kesalahan server.');
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
            {isForgotPassword ? 'Reset Password' : 'Welcome Back'}
          </h2>
          <p className="text-[#595959]">
            {isForgotPassword ? 'Masukkan email untuk kode verifikasi.' : 'Masuk ke akun TalentFlow Anda.'}
          </p>
        </div>

        {successMsg && (
          <div className="bg-emerald-50 text-emerald-600 p-4 rounded-2xl text-sm text-center font-medium mb-6">
            {successMsg}
          </div>
        )}
        {errorMsg && (
          <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-sm text-center font-medium mb-6">
            {errorMsg}
          </div>
        )}

        {!isForgotPassword ? (
          <>
            <form onSubmit={handleLogin} className="flex flex-col gap-5">
              <div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email address"
                  required
                  className="w-full bg-gray-50/50 border border-gray-200 rounded-2xl px-5 py-3.5 text-[#262626] placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#262626] focus:border-[#262626] transition-all"
                />
              </div>

              <div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    required
                    className="w-full bg-gray-50/50 border border-gray-200 rounded-2xl px-5 py-3.5 pr-12 text-[#262626] placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#262626] focus:border-[#262626] transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                <div className="text-right mt-2">
                  <button
                    type="button"
                    onClick={() => setIsForgotPassword(true)}
                    className="text-[13px] text-[#595959] hover:text-[#262626] transition-colors"
                  >
                    Forgot password?
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#262626] text-white rounded-full py-3.5 font-medium hover:scale-[1.02] transition-transform duration-200 disabled:opacity-50 mt-2"
              >
                {loading ? 'Verifying...' : 'Login'}
              </button>
              
              <div className="flex items-center space-x-4 my-2">
                <div className="h-px bg-gray-200 flex-1" />
                <span className="text-xs text-gray-400 font-medium">OR</span>
                <div className="h-px bg-gray-200 flex-1" />
              </div>
              
              <div className="flex justify-center flex-col items-center gap-2">
                 <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={() => setErrorMsg('Google login failed.')}
                  theme="outline"
                  text="signin_with"
                  size="large"
                  shape="pill"
                  width="100%"
                />
              </div>
            </form>

            <p className="text-center text-sm text-[#595959] mt-8">
              Belum punya akun?{' '}
              <button
                onClick={onSwitchToRegister}
                className="text-[#262626] font-medium hover:underline transition-all"
              >
                Registrasi
              </button>
            </p>
          </>
        ) : (
          <div>
            {forgotStep === 'request' && (
              <form onSubmit={handleForgotPasswordRequest} className="flex flex-col gap-5">
                <div>
                  <input
                    type="email"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="Email address"
                    required
                    className="w-full bg-gray-50/50 border border-gray-200 rounded-2xl px-5 py-3.5 text-[#262626] placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#262626] focus:border-[#262626] transition-all"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#262626] text-white rounded-full py-3.5 font-medium hover:scale-[1.02] transition-transform duration-200 disabled:opacity-50 mt-2"
                >
                  {loading ? 'Mengirim...' : 'Kirim Kode Reset'}
                </button>
              </form>
            )}

            {forgotStep === 'verify' && (
              <form onSubmit={handleForgotPasswordReset} className="flex flex-col gap-5">
                <div>
                  <input
                    type="text"
                    value={forgotCode}
                    onChange={(e) => setForgotCode(e.target.value)}
                    placeholder="Kode Verifikasi (6 digit)"
                    required
                    className="w-full bg-gray-50/50 border border-gray-200 rounded-2xl px-5 py-3.5 text-[#262626] placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#262626] focus:border-[#262626] transition-all text-center tracking-widest font-mono"
                  />
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={forgotNewPassword}
                    onChange={(e) => setForgotNewPassword(e.target.value)}
                    placeholder="Password Baru"
                    required
                    className="w-full bg-gray-50/50 border border-gray-200 rounded-2xl px-5 py-3.5 pr-12 text-[#262626] placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#262626] focus:border-[#262626] transition-all"
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
                  {loading ? 'Memproses...' : 'Simpan Password Baru'}
                </button>
              </form>
            )}

            <p className="text-center text-sm text-[#595959] mt-8">
              Ingat password Anda?{' '}
              <button
                onClick={() => {
                  setIsForgotPassword(false);
                  setForgotStep('request');
                }}
                className="text-[#262626] font-medium hover:underline transition-all"
              >
                Kembali Login
              </button>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

