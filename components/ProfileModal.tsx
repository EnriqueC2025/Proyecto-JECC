
import React, { useState } from 'react';
import { User, UserRole } from '../types';

interface ProfileModalProps {
  user: User;
  onClose: () => void;
  onUpdate: (updatedUser: User) => void;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ user, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    name: user.name,
    company: user.company,
    role: user.role
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate({
      ...user,
      ...formData
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-surface-dark w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-800">
        <div className="p-8 border-b border-gray-100 dark:border-gray-700 relative">
          <div className="flex items-center gap-4">
             <div 
              className="size-20 rounded-2xl bg-cover bg-center border-4 border-white dark:border-gray-800 shadow-xl"
              style={{ backgroundImage: `url('${user.avatar}')` }}
            />
            <div>
              <h3 className="text-2xl font-serif font-bold dark:text-white">Perfil Profesional</h3>
              <p className="text-gray-500 text-sm font-medium">{user.email}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 size-10 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 transition-colors"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-400">Nombre Completo</label>
              <input 
                type="text" 
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all dark:text-white"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-400">Cargo / Rol</label>
              {/* Fixed: Use select instead of input text to ensure UserRole type safety and fix assignability error */}
              <select 
                value={formData.role}
                onChange={(e) => setFormData({...formData, role: e.target.value as UserRole})}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all dark:text-white"
              >
                <option value={UserRole.ADMIN}>Administrador</option>
                <option value={UserRole.EDITOR}>Editor</option>
                <option value={UserRole.VIEWER}>Lector</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-400">Institución / Empresa</label>
            <input 
              type="text" 
              value={formData.company}
              onChange={(e) => setFormData({...formData, company: e.target.value})}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all dark:text-white"
            />
          </div>

          <div className="bg-primary/5 dark:bg-primary/10 p-4 rounded-2xl border border-primary/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-primary">verified_user</span>
              <div>
                <p className="text-xs font-bold text-primary uppercase">Créditos Disponibles</p>
                <p className="text-lg font-black text-primary">{user.credits} <span className="text-xs font-medium">unidades</span></p>
              </div>
            </div>
            <button type="button" className="text-xs font-bold text-primary hover:underline">Recargar créditos</button>
          </div>

          <div className="pt-4 flex gap-3">
            <button 
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-6 rounded-xl border border-gray-200 dark:border-gray-700 font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              Cancelar
            </button>
            <button 
              type="submit"
              className="flex-1 py-3 px-6 rounded-xl bg-primary hover:bg-primary-hover text-white font-bold shadow-lg shadow-primary/20 transition-all active:scale-[0.98]"
            >
              Guardar Perfil
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileModal;
