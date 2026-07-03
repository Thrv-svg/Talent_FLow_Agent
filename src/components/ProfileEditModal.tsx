import React, { useState } from 'react';
import { UserProfile } from '../types';
import { X, Save, User, Phone, Book } from 'lucide-react';

interface ProfileEditModalProps {
  profile: UserProfile;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedProfile: Partial<UserProfile>) => void;
}

export default function ProfileEditModal({ profile, isOpen, onClose, onSave }: ProfileEditModalProps) {
  const [formData, setFormData] = useState({
    name: profile.name || '',
    whatsapp: profile.whatsapp || '',
    headline: profile.headline || '',
  });

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-50 dark:bg-gray-900 transition-colors duration-300 ease-in-out /80 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 transition-colors duration-300 ease-in-out border border-gray-200 dark:border-gray-700 rounded-3xl w-full max-w-md shadow-2xl shadow-black/50 overflow-hidden transform animate-in fade-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700/80">
          <h3 className="font-display font-bold text-xl text-gray-900 dark:text-white transition-colors duration-300 ease-in-out flex items-center gap-2">
            <User className="w-5 h-5 text-teal-400" /> Profil Saya
          </h3>
          <button 
            onClick={onClose}
            className="text-gray-600 dark:text-gray-400 transition-colors duration-300 ease-in-out hover:text-gray-900 dark:text-white transition-colors duration-300 ease-in-out transition-colors p-1 rounded-lg hover:bg-white dark:bg-gray-800 transition-colors duration-300 ease-in-out "
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-600 dark:text-gray-400 transition-colors duration-300 ease-in-out ml-1">Nama Lengkap</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 dark:text-gray-400 transition-colors duration-300 ease-in-out " />
              <input 
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full bg-gray-50 dark:bg-gray-900 transition-colors duration-300 ease-in-out border border-gray-200 dark:border-gray-700 py-2.5 pl-10 pr-4 rounded-xl text-sm text-gray-900 dark:text-white transition-colors duration-300 ease-in-out focus:outline-none focus:border-teal-500/50 focus:ring-1 focus:ring-teal-500/50 transition-all font-medium"
                placeholder="Masukkan nama lengkap Anda"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-600 dark:text-gray-400 transition-colors duration-300 ease-in-out ml-1">Nomor Kontak / WhatsApp</label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 dark:text-gray-400 transition-colors duration-300 ease-in-out " />
              <input 
                type="text"
                name="whatsapp"
                value={formData.whatsapp}
                onChange={handleChange}
                required
                className="w-full bg-gray-50 dark:bg-gray-900 transition-colors duration-300 ease-in-out border border-gray-200 dark:border-gray-700 py-2.5 pl-10 pr-4 rounded-xl text-sm text-gray-900 dark:text-white transition-colors duration-300 ease-in-out focus:outline-none focus:border-teal-500/50 focus:ring-1 focus:ring-teal-500/50 transition-all font-medium"
                placeholder="Misal: 08123456789"
              />
            </div>
          </div>
          
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-600 dark:text-gray-400 transition-colors duration-300 ease-in-out ml-1">Headline Profil / Bio Singkat</label>
            <div className="relative">
              <Book className="absolute left-3 top-3 w-4 h-4 text-gray-500 dark:text-gray-400 transition-colors duration-300 ease-in-out " />
              <textarea 
                name="headline"
                value={formData.headline}
                onChange={handleChange}
                rows={3}
                required
                className="w-full bg-gray-50 dark:bg-gray-900 transition-colors duration-300 ease-in-out border border-gray-200 dark:border-gray-700 py-2.5 pl-10 pr-4 rounded-xl text-sm text-gray-900 dark:text-white transition-colors duration-300 ease-in-out focus:outline-none focus:border-teal-500/50 focus:ring-1 focus:ring-teal-500/50 transition-all font-medium resize-none"
                placeholder="Misal: Mahasiswa Aktif | Aspiring Developer"
              />
            </div>
          </div>

          <div className="pt-4 flex items-center justify-end gap-3">
            <button 
              type="button" 
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-gray-800 font-bold text-xs hover:bg-white dark:bg-gray-800 transition-colors duration-300 ease-in-out transition-colors"
            >
              Batal
            </button>
            <button 
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-gray-900 dark:text-white transition-colors duration-300 ease-in-out font-bold text-xs shadow-lg shadow-teal-500/20 transition-all flex items-center gap-2"
            >
              <Save className="w-4 h-4" /> Simpan Perubahan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
