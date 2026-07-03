import React, { useEffect } from 'react';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

export interface ToastProps {
  message: string;
  type?: ToastType;
  onClose: () => void;
  duration?: number;
  position?: 'bottom-center' | 'top-right';
}

export default function Toast({ message, type = 'info', onClose, duration = 3000, position = 'bottom-center' }: ToastProps) {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const getStyle = () => {
    switch (type) {
      case 'success':
        return 'bg-emerald-900/90 border-emerald-500/50 text-emerald-100 shadow-[0_0_20px_rgba(16,185,129,0.3)]';
      case 'error':
        return 'bg-rose-900/90 border-rose-500/50 text-rose-100 shadow-[0_0_20px_rgba(244,63,94,0.3)]';
      default:
        return 'bg-white dark:bg-gray-800 transition-colors duration-300 ease-in-out /90 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white transition-colors duration-300 ease-in-out shadow-[0_0_20px_rgba(148,163,184,0.3)]';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-rose-400 shrink-0" />;
      default:
        return <Info className="w-5 h-5 text-gray-600 dark:text-gray-400 transition-colors duration-300 ease-in-out shrink-0" />;
    }
  };

  const getPositionStyle = () => {
    switch (position) {
      case 'top-right':
        return 'fixed top-6 right-6 z-[100] transform translate-y-0 opacity-100';
      case 'bottom-center':
      default:
        return 'fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] transform translate-y-0 opacity-100';
    }
  };

  return (
    <div className={`${getPositionStyle()} px-4 py-3 rounded-xl border backdrop-blur-md flex items-center gap-3 transition-all duration-300 ${getStyle()}`}>
      {getIcon()}
      <p className="text-sm font-medium pr-6">{message}</p>
      <button 
        onClick={onClose}
        className="absolute top-1/2 -translate-y-1/2 right-3 text-gray-900 dark:text-white transition-colors duration-300 ease-in-out /50 hover:text-gray-900 dark:text-white transition-colors duration-300 ease-in-out transition"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
