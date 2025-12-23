
import React, { useState, useEffect, useRef } from 'react';
import { Notification, NotificationSettings, User } from '../types';
import Logo from './Logo';

interface NavbarProps {
  notifications: Notification[];
  onMarkAsRead: () => void;
  user: User;
  onLogout: () => void;
  onEditProfile: () => void;
  settings: NotificationSettings;
  onUpdateSettings: (newSettings: NotificationSettings) => void;
}

const Navbar: React.FC<NavbarProps> = ({ 
  notifications, 
  onMarkAsRead, 
  user, 
  onLogout, 
  onEditProfile,
  settings, 
  onUpdateSettings 
}) => {
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isUserOpen, setIsUserOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  
  const notifRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
  }, [isDark]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) setIsNotifOpen(false);
      if (userRef.current && !userRef.current.contains(event.target as Node)) setIsUserOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleType = (type: keyof NotificationSettings['types']) => {
    onUpdateSettings({
      ...settings,
      types: { ...settings.types, [type]: !settings.types[type] }
    });
  };

  const setFrequency = (freq: NotificationSettings['frequency']) => {
    onUpdateSettings({ ...settings, frequency: freq });
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-[#e8ebf3] dark:border-gray-800 bg-white/90 dark:bg-background-dark/90 backdrop-blur-md h-16 shrink-0">
      <div className="max-w-[1440px] mx-auto px-6 h-full flex items-center justify-between">
        {/* Brand Section */}
        <div className="flex items-center gap-3 shrink-0">
          <Logo className="size-10" />
          <h1 className="text-lg md:text-xl font-bold tracking-tight font-serif text-gray-900 dark:text-white truncate max-w-[150px] sm:max-w-none">
            GENERATIVE EDITION LAB AI
          </h1>
        </div>
        
        {/* Actions Section */}
        <div className="flex items-center gap-2 md:gap-4 ml-4">
          <div className="hidden lg:flex items-center gap-2 bg-primary/5 dark:bg-primary/20 px-3 py-1.5 rounded-full border border-primary/10 shrink-0">
            <span className="material-symbols-outlined text-primary text-sm">payments</span>
            <span className="text-primary font-bold text-sm">{user.credits} Créditos</span>
          </div>
          
          <div className="flex items-center gap-1 md:gap-1.5">
            <button 
              onClick={() => setIsSettingsOpen(true)}
              className="size-10 flex items-center justify-center text-gray-500 hover:text-primary transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 shrink-0"
              title="Ajustes de notificación"
            >
              <span className="material-symbols-outlined">settings</span>
            </button>

            <div className="relative" ref={notifRef}>
              <button 
                onClick={() => { setIsNotifOpen(!isNotifOpen); onMarkAsRead(); }}
                className={`relative size-10 flex items-center justify-center transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 shrink-0 ${isNotifOpen ? 'text-primary' : 'text-gray-500'}`}
              >
                <span className="material-symbols-outlined">notifications</span>
                {unreadCount > 0 && settings.frequency !== 'muted' && (
                  <span className="absolute top-2 right-2 size-3.5 bg-red-500 text-white text-[9px] font-bold flex items-center justify-center rounded-full border-2 border-white dark:border-background-dark">
                    {unreadCount}
                  </span>
                )}
              </button>

              {isNotifOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-700 rounded-2xl shadow-2xl overflow-hidden animate-in">
                  <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/50">
                    <span className="font-bold text-sm dark:text-white">Notificaciones</span>
                    <button 
                      onClick={() => { setIsSettingsOpen(true); setIsNotifOpen(false); }}
                      className="text-xs text-primary hover:underline font-semibold"
                    >
                      Ajustes
                    </button>
                  </div>
                  <div className="max-h-[320px] overflow-y-auto">
                    {settings.frequency === 'muted' ? (
                      <div className="p-8 text-center text-gray-500 text-xs italic">
                        Notificaciones silenciadas.
                      </div>
                    ) : notifications.length === 0 ? (
                      <div className="p-8 text-center">
                        <span className="material-symbols-outlined text-gray-300 text-4xl mb-2">notifications_off</span>
                        <p className="text-xs text-gray-500">Sin actividad nueva</p>
                      </div>
                    ) : (
                      notifications.map(n => (
                        <div key={n.id} className="p-4 border-b border-gray-50 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                          <div className="flex gap-3">
                            <div className={`mt-1 size-2 rounded-full shrink-0 ${n.type === 'success' ? 'bg-green-500' : n.type === 'warning' ? 'bg-orange-500' : 'bg-blue-500'}`} />
                            <div className="flex-1 overflow-hidden">
                              <p className="text-xs font-bold text-gray-900 dark:text-gray-100 truncate">{n.title}</p>
                              <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-2">{n.message}</p>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="h-6 w-px bg-gray-200 dark:bg-gray-700 mx-1 shrink-0"></div>

            <div className="relative" ref={userRef}>
              <button 
                onClick={() => setIsUserOpen(!isUserOpen)}
                className="flex items-center gap-2 pl-2 rounded-full hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors p-1 shrink-0"
              >
                <div 
                  className="size-9 rounded-full bg-cover bg-center border-2 border-gray-200 dark:border-gray-700 shadow-sm shrink-0"
                  style={{ backgroundImage: `url('${user.avatar}')` }}
                />
              </button>

              {isUserOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-700 rounded-2xl shadow-2xl overflow-hidden animate-in">
                  <div className="p-4 bg-gray-50/50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-700">
                    <p className="text-sm font-bold text-gray-900 dark:text-white leading-none truncate">{user.name}</p>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1 truncate">{user.company}</p>
                  </div>
                  <div className="p-2">
                    <button 
                      onClick={() => { onEditProfile(); setIsUserOpen(false); }}
                      className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors"
                    >
                      <span className="material-symbols-outlined text-xl">account_circle</span>
                      Perfil Profesional
                    </button>
                    <div className="h-px bg-gray-100 dark:bg-gray-800 my-1"></div>
                    <div className="flex items-center justify-between px-3 py-2">
                      <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                        <span className="material-symbols-outlined text-xl">{isDark ? 'dark_mode' : 'light_mode'}</span>
                        <span className="text-sm">Modo Oscuro</span>
                      </div>
                      <button 
                        onClick={() => setIsDark(!isDark)}
                        className={`w-9 h-5 rounded-full transition-colors relative ${isDark ? 'bg-primary' : 'bg-gray-300'}`}
                      >
                        <div className={`absolute top-0.5 size-4 bg-white rounded-full transition-transform ${isDark ? 'translate-x-4.5' : 'translate-x-0.5'}`} />
                      </button>
                    </div>
                    <div className="h-px bg-gray-100 dark:bg-gray-800 my-1"></div>
                    <button 
                      onClick={onLogout}
                      className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors"
                    >
                      <span className="material-symbols-outlined text-xl">logout</span>
                      Salir
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {isSettingsOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in">
          <div className="bg-white dark:bg-surface-dark w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-800">
            <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
              <h3 className="font-serif text-xl font-bold dark:text-white">Ajustes del Sistema</h3>
              <button onClick={() => setIsSettingsOpen(false)} className="size-10 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <section>
                <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-4">Filtrado de Alertas</h4>
                <div className="space-y-2">
                  {(['success', 'info', 'warning'] as const).map(type => (
                    <label key={type} className="flex items-center justify-between p-3 rounded-xl border border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors cursor-pointer">
                      <div className="flex items-center gap-3">
                        <div className={`size-2 rounded-full ${type === 'success' ? 'bg-green-500' : type === 'warning' ? 'bg-orange-500' : 'bg-blue-500'}`} />
                        <span className="text-sm font-medium dark:text-gray-200 capitalize">
                          {type === 'success' ? 'Éxito' : type === 'warning' ? 'Advertencias' : 'Información'}
                        </span>
                      </div>
                      <input type="checkbox" checked={settings.types[type]} onChange={() => toggleType(type)} className="rounded text-primary focus:ring-primary dark:bg-gray-800" />
                    </label>
                  ))}
                </div>
              </section>

              <section>
                <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-4">Visualización</h4>
                <div className="grid grid-cols-1 gap-2">
                  {[
                    { id: 'realtime', label: 'Tiempo Real', desc: 'Alertas inmediatas' },
                    { id: 'summary', label: 'Historial', desc: 'Solo en el panel' },
                    { id: 'muted', label: 'Silenciado', desc: 'Desactiva avisos' }
                  ].map(item => (
                    <button
                      key={item.id}
                      onClick={() => setFrequency(item.id as any)}
                      className={`flex flex-col items-start p-3 rounded-xl border transition-all ${
                        settings.frequency === item.id 
                        ? 'bg-primary/5 border-primary ring-1 ring-primary' 
                        : 'border-gray-100 dark:border-gray-800 hover:border-gray-200 dark:hover:border-gray-700'
                      }`}
                    >
                      <span className={`text-sm font-bold ${settings.frequency === item.id ? 'text-primary' : 'dark:text-white'}`}>{item.label}</span>
                      <span className="text-[11px] text-gray-500 dark:text-gray-400">{item.desc}</span>
                    </button>
                  ))}
                </div>
              </section>
            </div>

            <div className="p-6 bg-gray-50 dark:bg-gray-800/30 flex justify-end">
              <button onClick={() => setIsSettingsOpen(false)} className="bg-primary text-white font-bold py-2.5 px-8 rounded-xl shadow-lg shadow-primary/20 hover:bg-primary-hover transition-colors">
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
