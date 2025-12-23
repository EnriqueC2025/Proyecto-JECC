
import React, { useState } from 'react';
import { User, UserRole } from '../types';
import Logo from './Logo';

interface AuthProps {
  onLogin: (user: User) => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    company: '',
    role: UserRole.EDITOR
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const mockUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      name: isLogin ? (formData.email.split('@')[0]) : formData.name,
      email: formData.email,
      company: formData.company || 'Institución Académica',
      role: formData.role,
      credits: 100,
      avatar: `https://ui-avatars.com/api/?name=${formData.name || formData.email}&background=1d4fd7&color=fff`
    };
    
    localStorage.setItem('cs_user', JSON.stringify(mockUser));
    onLogin(mockUser);
  };

  return (
    <div className="fixed inset-0 z-[200] bg-white dark:bg-background-dark flex overflow-hidden">
      <div className="hidden lg:flex flex-1 bg-primary relative items-center justify-center p-20 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent opacity-20 animate-pulse"></div>
          <div className="h-full w-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        </div>
        <div className="relative z-10 text-white max-w-lg">
          <div className="size-20 bg-white/10 backdrop-blur-xl rounded-2xl flex items-center justify-center mb-8 border border-white/20">
            <Logo className="size-16" />
          </div>
          <h2 className="text-5xl font-serif font-black mb-6 leading-tight">Potencia tu Visión con Inteligencia.</h2>
          <p className="text-xl text-white/80 leading-relaxed font-medium">
            La plataforma definitiva para profesionales y académicos en la era de GENERATIVE EDITION LAB AI.
          </p>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-8 md:p-16 overflow-y-auto">
        <div className="w-full max-w-md">
          <h3 className="text-3xl font-serif font-bold text-gray-900 dark:text-white mb-2">
            {isLogin ? 'Bienvenido' : 'Registro Profesional'}
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-8 font-medium">
            Inicia sesión en GENERATIVE EDITION LAB AI y configura tus permisos institucionales.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Nombre Completo</label>
                <input 
                  required
                  type="text" 
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all dark:text-white"
                  placeholder="Ej. Juan Pérez"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
            )}
            
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Correo Electrónico</label>
              <input 
                required
                type="email" 
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all dark:text-white"
                placeholder="nombre@institucion.edu"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Rol de Usuario</label>
              <select 
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all dark:text-white"
                value={formData.role}
                onChange={(e) => setFormData({...formData, role: e.target.value as UserRole})}
              >
                <option value={UserRole.ADMIN}>Administrador (Control Total)</option>
                <option value={UserRole.EDITOR}>Editor (Creación & Edición)</option>
                <option value={UserRole.VIEWER}>Lector (Solo Consulta)</option>
              </select>
            </div>

            {!isLogin && (
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Empresa / Institución</label>
                <input 
                  required
                  type="text" 
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all dark:text-white"
                  placeholder="Ej. Universidad de Diseño"
                  value={formData.company}
                  onChange={(e) => setFormData({...formData, company: e.target.value})}
                />
              </div>
            )}

            <button 
              type="submit"
              className="w-full bg-primary hover:bg-primary-hover text-white font-bold py-3.5 rounded-xl shadow-lg shadow-primary/20 transition-all active:scale-[0.98] mt-4"
            >
              {isLogin ? 'Iniciar Sesión' : 'Registrar Cuenta'}
            </button>
          </form>

          <div className="mt-8 text-center">
            <button 
              onClick={() => setIsLogin(!isLogin)}
              className="text-primary font-bold hover:underline"
            >
              {isLogin ? 'Crear una cuenta nueva' : 'Ya tengo una cuenta'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
